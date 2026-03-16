import { supabase } from "@/lib/supabase"
import ScheduleGrid from "./ScheduleGrid"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = ["breakfast", "lunch", "dinner"]

export default async function SchedulePage() {
  const { data: household } = await supabase
    .from("households")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const householdId = household?.id

  const { data: members } = await supabase
    .from("household_members")
    .select("id, name")
    .eq("household_id", householdId)
    .order("sort_order")
    .order("created_at")

  let { data: schedule } = await supabase
    .from("weekly_schedules")
    .select("*")
    .eq("household_id", householdId)
    .eq("is_default", true)
    .single()

  if (!schedule) {
    const { data: newSchedule } = await supabase
      .from("weekly_schedules")
      .insert({ household_id: householdId, name: "Default", is_default: true })
      .select()
      .single()
    schedule = newSchedule
  }

  let { data: slots } = await supabase
    .from("weekly_schedule_slots")
    .select("*")
    .eq("weekly_schedule_id", schedule?.id)

  // Migrate household-level slots (member_id = null) → per-member slots
  const hasNullSlots = slots?.some((s) => s.member_id === null)
  const hasMemberSlots = slots?.some((s) => s.member_id !== null)

  if (hasNullSlots && !hasMemberSlots && members && members.length > 0) {
    const nullSlots = slots?.filter((s) => s.member_id === null) || []

    const memberSlots = nullSlots.flatMap((slot) =>
      members.map((member) => ({
        weekly_schedule_id: slot.weekly_schedule_id,
        day_of_week: slot.day_of_week,
        meal_type: slot.meal_type,
        is_needed: slot.is_needed,
        member_id: member.id,
      }))
    )

    await supabase
      .from("weekly_schedule_slots")
      .delete()
      .eq("weekly_schedule_id", schedule!.id)
      .is("member_id", null)

    await supabase.from("weekly_schedule_slots").insert(memberSlots)

    const { data: newSlots } = await supabase
      .from("weekly_schedule_slots")
      .select("*")
      .eq("weekly_schedule_id", schedule!.id)

    slots = newSlots
  }

  // If no slots at all, seed per-member slots
  if ((!slots || slots.length === 0) && members && members.length > 0) {
    const newSlots = DAYS.flatMap((_, dayIndex) =>
      MEAL_TYPES.flatMap((mealType) =>
        members.map((member) => ({
          weekly_schedule_id: schedule!.id,
          day_of_week: dayIndex,
          meal_type: mealType,
          is_needed: true,
          member_id: member.id,
        }))
      )
    )
    await supabase.from("weekly_schedule_slots").insert(newSlots)

    const { data: seededSlots } = await supabase
      .from("weekly_schedule_slots")
      .select("*")
      .eq("weekly_schedule_id", schedule!.id)

    slots = seededSlots
  }

  return (
    <div className="fade-up">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach-500 mb-2">
          <span className="w-5 h-5 rounded-full bg-peach-500 text-white flex items-center justify-center text-xs">3</span>
          Step 3 of 5
        </div>
        <h1 className="text-3xl font-bold text-stone-900">Weekly Schedule</h1>
        <p className="text-stone-400 text-sm mt-1">
          Tap each person's name to toggle whether they need that meal. Turn off any meals a person doesn't need on a given day — the plan will only include meals where they're switched on.
        </p>
      </div>

      {(!members || members.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 border-dashed">
          <p className="text-stone-500">Add household members first before setting the schedule.</p>
          <a href="/households" className="text-peach-600 font-medium text-sm mt-2 inline-block hover:underline">← Go to Household</a>
        </div>
      ) : (
        <ScheduleGrid slots={slots || []} scheduleId={schedule?.id} members={members} />
      )}

      <div className="mt-8 flex items-center justify-between bg-mint-50 border border-mint-200 rounded-2xl px-6 py-5">
        <div>
          <p className="font-semibold text-stone-900">Schedule set!</p>
          <p className="text-stone-500 text-sm mt-0.5">Now generate your personalised meal plan</p>
        </div>
        <a href="/plan" className="bg-peach-500 hover:bg-peach-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md">
          Next: Generate plan →
        </a>
      </div>
    </div>
  )
}
