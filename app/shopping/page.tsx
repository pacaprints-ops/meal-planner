import { supabase } from "@/lib/supabase"
import ShoppingView from "./ShoppingView"

function getMondayOfCurrentWeek() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  return monday.toISOString().split("T")[0]
}

export default async function ShoppingPage() {
  const { data: household } = await supabase
    .from("households")
    .select("id, weekly_budget")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const householdId = household?.id
  const weeklyBudget: number | null = household?.weekly_budget ?? null

  const weekStart = getMondayOfCurrentWeek()

  const [{ data: staples }, { data: list }, { data: plan }] = await Promise.all([
    supabase.from("staple_items").select("*").eq("household_id", householdId).order("name"),
    supabase.from("shopping_lists").select("id, name").eq("household_id", householdId).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("meal_plans").select("id").eq("household_id", householdId).eq("week_start_date", weekStart).single(),
  ])

  const { data: items } = list
    ? await supabase.from("shopping_list_items").select("*").eq("shopping_list_id", list.id).order("is_checked").order("ingredient_name")
    : { data: null }

  // Calculate estimated weekly spend from plan meals
  let estimatedTotal: number | null = null
  if (plan) {
    const { data: planItems } = await supabase
      .from("meal_plan_items")
      .select("meal_id")
      .eq("meal_plan_id", plan.id)

    if (planItems && planItems.length > 0) {
      const uniqueMealIds = [...new Set(planItems.map((pi) => pi.meal_id))]
      const { data: meals } = await supabase
        .from("meals")
        .select("id, estimated_cost")
        .in("id", uniqueMealIds)

      if (meals) {
        const total = meals.reduce((sum, m) => sum + (m.estimated_cost || 0), 0)
        estimatedTotal = total > 0 ? Math.round(total * 100) / 100 : null
      }
    }
  }

  return (
    <ShoppingView
      list={list}
      items={items || []}
      staples={staples || []}
      householdId={householdId}
      weeklyBudget={weeklyBudget}
      estimatedTotal={estimatedTotal}
    />
  )
}
