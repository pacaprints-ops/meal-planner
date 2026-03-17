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

export async function generateShoppingList() {
  const { data: household } = await supabase
    .from("households")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const householdId = household?.id
  const weekStart = getMondayOfCurrentWeek()

  // Get current plan
  const { data: plan } = await supabase
    .from("meal_plans")
    .select("id")
    .eq("household_id", householdId)
    .eq("week_start_date", weekStart)
    .single()

  if (!plan) return { error: "No plan found for this week. Generate a plan first." }

  // Get all meal IDs in the plan
  const { data: planItems } = await supabase
    .from("meal_plan_items")
    .select("meal_id")
    .eq("meal_plan_id", plan.id)

  const mealIds = [...new Set((planItems || []).map((i) => i.meal_id).filter(Boolean))]

  if (mealIds.length === 0) return { error: "No meals in the current plan." }

  // Get all ingredients for those meals
  const { data: ingredients } = await supabase
    .from("meal_ingredients")
    .select("ingredient_name, quantity, unit")
    .in("meal_id", mealIds)

  if (!ingredients || ingredients.length === 0) return { error: "No ingredients found. Add ingredients to your meals first." }

  // Combine duplicate ingredients
  const combined: Record<string, { ingredient_name: string; quantity: number | null; unit: string | null }> = {}
  for (const ing of ingredients) {
    const key = ing.ingredient_name.toLowerCase().trim()
    if (combined[key]) {
      if (combined[key].quantity != null && ing.quantity != null && combined[key].unit === ing.unit) {
        combined[key].quantity = (combined[key].quantity as number) + ing.quantity
      }
    } else {
      combined[key] = { ingredient_name: ing.ingredient_name, quantity: ing.quantity, unit: ing.unit }
    }
  }

  // Delete existing shopping list for this week
  await supabase.from("shopping_lists").delete().eq("household_id", householdId).eq("meal_plan_id", plan.id)

  // Create new shopping list
  const { data: list } = await supabase
    .from("shopping_lists")
    .insert({ household_id: householdId, meal_plan_id: plan.id, name: `Week of ${weekStart}` })
    .select()
    .single()

  if (!list) return { error: "Failed to create shopping list." }

  // Insert items
  const items = Object.values(combined).map((ing) => ({
    shopping_list_id: list.id,
    ingredient_name: ing.ingredient_name,
    quantity: ing.quantity,
    unit: ing.unit,
    is_checked: false,
  }))

  await supabase.from("shopping_list_items").insert(items)
  revalidatePath("/shopping")
  return { success: true }
}

export async function toggleItem(id: string, checked: boolean) {
  await supabase.from("shopping_list_items").update({ is_checked: checked }).eq("id", id)
  revalidatePath("/shopping")
}

export async function addItem(listId: string, name: string) {
  await supabase.from("shopping_list_items").insert({
    shopping_list_id: listId,
    ingredient_name: name,
    is_checked: false,
  })
  revalidatePath("/shopping")
}

export async function removeItem(id: string) {
  await supabase.from("shopping_list_items").delete().eq("id", id)
  revalidatePath("/shopping")
}

export async function getStaples(householdId: string) {
  const { data } = await supabase
    .from("staple_items")
    .select("*")
    .eq("household_id", householdId)
    .order("name")
  return data || []
}

export async function addStaple(householdId: string, name: string) {
  const { data } = await supabase.from("staple_items").insert({ household_id: householdId, name: name.trim() }).select().single()
  revalidatePath("/shopping")
  return data
}

export async function removeStaple(id: string) {
  await supabase.from("staple_items").delete().eq("id", id)
  revalidatePath("/shopping")
}

export async function addStaplesToList(listId: string, names: string[]) {
  if (names.length === 0) return
  const items = names.map((name) => ({
    shopping_list_id: listId,
    ingredient_name: name,
    is_checked: false,
  }))
  await supabase.from("shopping_list_items").insert(items)
  revalidatePath("/shopping")
}
