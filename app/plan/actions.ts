"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

function getMondayOfCurrentWeek() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  return monday.toISOString().split("T")[0]
}

type MealOption = {
  id: string
  name: string
  meal_type: string
  memberIds: string[]
}

type Assignment = {
  mealId: string
  mealName: string
  memberIds: string[]
}

function assignMealsToSlot(
  slotMemberIds: string[],
  options: MealOption[],
  used: Set<string>
): Assignment[] {
  if (options.length === 0 || slotMemberIds.length === 0) return []

  // Normalise: if no members tagged on a meal, treat it as available to everyone in this slot
  const normalised = options.map((m) => ({
    ...m,
    memberIds: m.memberIds.length > 0
      ? m.memberIds.filter((id) => slotMemberIds.includes(id))
      : [...slotMemberIds],
  })).filter((m) => m.memberIds.length > 0)

  const unassigned = new Set(slotMemberIds)
  const assignments: Assignment[] = []

  while (unassigned.size > 0) {
    const relevant = normalised.filter((m) => m.memberIds.some((id) => unassigned.has(id)))
    if (relevant.length === 0) break

    const scored = relevant.map((m) => ({
      meal: m,
      score: (used.has(m.id) ? 0 : 1000) + m.memberIds.filter((id) => unassigned.has(id)).length,
    }))
    scored.sort((a, b) => b.score - a.score)
    const best = scored[0].meal

    const assigned = best.memberIds.filter((id) => unassigned.has(id))
    assignments.push({ mealId: best.id, mealName: best.name, memberIds: assigned })
    assigned.forEach((id) => unassigned.delete(id))
    used.add(best.id)
  }

  return assignments
}

// Build a map of { "dayIndex-mealType" → [memberId, ...] } from per-member slots
function buildSlotMemberMap(slots: { day_of_week: number; meal_type: string; member_id: string | null; is_needed: boolean }[]) {
  const map: Record<string, string[]> = {}
  for (const slot of slots) {
    if (!slot.is_needed || !slot.member_id) continue
    const key = `${slot.day_of_week}-${slot.meal_type}`
    if (!map[key]) map[key] = []
    map[key].push(slot.member_id)
  }
  return map
}

export async function generatePlan() {
  const { data: household } = await supabase
    .from("households")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const householdId = household?.id
  const weekStart = getMondayOfCurrentWeek()

  const [{ data: schedule }, { data: members }, { data: mealsRaw }] = await Promise.all([
    supabase.from("weekly_schedules").select("id").eq("household_id", householdId).eq("is_default", true).single(),
    supabase.from("household_members").select("id, name").eq("household_id", householdId),
    supabase.from("meals").select("id, name, meal_type, meal_members(member_id)").eq("household_id", householdId),
  ])

  if (!schedule) return { error: "No schedule found." }
  if (!members || members.length === 0) return { error: "No household members found." }
  if (!mealsRaw || mealsRaw.length === 0) return { error: "No meals in library." }

  const { data: slots } = await supabase
    .from("weekly_schedule_slots")
    .select("*")
    .eq("weekly_schedule_id", schedule.id)
    .eq("is_needed", true)

  if (!slots || slots.length === 0) return { error: "No schedule slots enabled." }

  const allMemberIds = members.map((m) => m.id)

  const mealsByType: Record<string, MealOption[]> = {}
  for (const meal of mealsRaw) {
    const memberIds = (meal.meal_members as { member_id: string }[]).map((mm) => mm.member_id)
    const option: MealOption = { id: meal.id, name: meal.name, meal_type: meal.meal_type, memberIds }
    if (!mealsByType[meal.meal_type]) mealsByType[meal.meal_type] = []
    mealsByType[meal.meal_type].push(option)
  }

  await supabase.from("meal_plans").delete().eq("household_id", householdId).eq("week_start_date", weekStart)

  const { data: plan } = await supabase
    .from("meal_plans")
    .insert({ household_id: householdId, week_start_date: weekStart })
    .select()
    .single()

  if (!plan) return { error: "Failed to create plan." }

  // Build per-member slot map
  const slotMemberMap = buildSlotMemberMap(slots)
  // Fall back: if slots have no member_id (old format), assign everyone
  const hasPerMemberSlots = slots.some((s) => s.member_id !== null)

  const used = new Set<string>()
  const items: object[] = []

  // Get unique day+mealtype combinations
  const slotKeys = hasPerMemberSlots
    ? Object.keys(slotMemberMap)
    : [...new Set(slots.map((s) => `${s.day_of_week}-${s.meal_type}`))]

  for (const key of slotKeys) {
    const [dayStr, mealType] = key.split("-")
    const dayOfWeek = parseInt(dayStr)
    const slotMembers = hasPerMemberSlots ? (slotMemberMap[key] || []) : allMemberIds
    if (slotMembers.length === 0) continue

    const options = mealsByType[mealType] || []
    const assignments = assignMealsToSlot(slotMembers, options, used)

    for (const assignment of assignments) {
      for (const memberId of assignment.memberIds) {
        items.push({
          meal_plan_id: plan.id,
          day_of_week: dayOfWeek,
          meal_type: mealType,
          meal_id: assignment.mealId,
          meal_name_snapshot: assignment.mealName,
          member_id: memberId,
        })
      }
    }
  }

  await supabase.from("meal_plan_items").insert(items)
  revalidatePath("/plan")
  return { success: true }
}

export async function regenerateDayPlan(planId: string, dayOfWeek: number, householdId: string) {
  const [{ data: schedule }, { data: members }, { data: mealsRaw }] = await Promise.all([
    supabase.from("weekly_schedules").select("id").eq("household_id", householdId).eq("is_default", true).single(),
    supabase.from("household_members").select("id, name").eq("household_id", householdId),
    supabase.from("meals").select("id, name, meal_type, meal_members(member_id)").eq("household_id", householdId),
  ])

  if (!schedule || !members || !mealsRaw) return { error: "Missing data." }

  const { data: daySlots } = await supabase
    .from("weekly_schedule_slots")
    .select("*")
    .eq("weekly_schedule_id", schedule.id)
    .eq("day_of_week", dayOfWeek)
    .eq("is_needed", true)

  if (!daySlots || daySlots.length === 0) return { error: "No slots enabled for this day." }

  await supabase
    .from("meal_plan_items")
    .delete()
    .eq("meal_plan_id", planId)
    .eq("day_of_week", dayOfWeek)

  const allMemberIds = members.map((m) => m.id)

  const mealsByType: Record<string, MealOption[]> = {}
  for (const meal of mealsRaw) {
    const memberIds = (meal.meal_members as { member_id: string }[]).map((mm) => mm.member_id)
    const option: MealOption = { id: meal.id, name: meal.name, meal_type: meal.meal_type, memberIds }
    if (!mealsByType[meal.meal_type]) mealsByType[meal.meal_type] = []
    mealsByType[meal.meal_type].push(option)
  }

  const slotMemberMap = buildSlotMemberMap(daySlots)
  const hasPerMemberSlots = daySlots.some((s) => s.member_id !== null)

  const slotKeys = hasPerMemberSlots
    ? Object.keys(slotMemberMap)
    : [...new Set(daySlots.map((s) => `${s.day_of_week}-${s.meal_type}`))]

  const used = new Set<string>()
  const items: object[] = []

  for (const key of slotKeys) {
    const [, mealType] = key.split("-")
    const slotMembers = hasPerMemberSlots ? (slotMemberMap[key] || []) : allMemberIds
    if (slotMembers.length === 0) continue

    const options = mealsByType[mealType] || []
    const assignments = assignMealsToSlot(slotMembers, options, used)

    for (const assignment of assignments) {
      for (const memberId of assignment.memberIds) {
        items.push({
          meal_plan_id: planId,
          day_of_week: dayOfWeek,
          meal_type: mealType,
          meal_id: assignment.mealId,
          meal_name_snapshot: assignment.mealName,
          member_id: memberId,
        })
      }
    }
  }

  if (items.length > 0) {
    await supabase.from("meal_plan_items").insert(items)
  }

  revalidatePath("/plan")
  return { success: true }
}

export async function getMealsForType(householdId: string, mealType: string) {
  const { data } = await supabase
    .from("meals")
    .select("id, name, meal_members(member_id)")
    .eq("household_id", householdId)
    .eq("meal_type", mealType)
    .order("name")
  return data || []
}

export async function swapMeal(
  planId: string,
  dayOfWeek: number,
  mealType: string,
  oldMealId: string,
  newMealId: string,
  newMealName: string
) {
  await supabase
    .from("meal_plan_items")
    .update({ meal_id: newMealId, meal_name_snapshot: newMealName })
    .eq("meal_plan_id", planId)
    .eq("day_of_week", dayOfWeek)
    .eq("meal_type", mealType)
    .eq("meal_id", oldMealId)
  revalidatePath("/plan")
}
