import { supabase } from "@/lib/supabase"
import PlanView from "./PlanView"

export default async function PlanPage() {
  const { data: household } = await supabase
    .from("households")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const householdId = household?.id

  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  const weekStart = monday.toISOString().split("T")[0]

  const [{ data: plan }, { data: members }] = await Promise.all([
    supabase.from("meal_plans").select("id").eq("household_id", householdId).eq("week_start_date", weekStart).single(),
    supabase.from("household_members").select("id, name").eq("household_id", householdId),
  ])

  const { data: items } = plan
    ? await supabase.from("meal_plan_items").select("*").eq("meal_plan_id", plan.id)
    : { data: null }

  return <PlanView items={items || []} members={members || []} weekStart={weekStart} planId={plan?.id || null} householdId={householdId} />
}
