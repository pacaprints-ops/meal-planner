"use server"

import Anthropic from "@anthropic-ai/sdk"
import { supabase } from "@/lib/supabase"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateIngredients(mealId: string, mealName: string, useShortcuts = false) {
  const shortcutNote = useShortcuts
    ? " Use convenient shortcuts where possible (e.g. jar sauces, ready-made pastry, stock cubes, pre-made spice mixes) rather than making everything from scratch."
    : ""

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `List the typical ingredients for "${mealName}".${shortcutNote}
Return ONLY a JSON array, no explanation. Each item should have: ingredient_name, quantity (number or null), unit (string or null).
Example: [{"ingredient_name":"spaghetti","quantity":400,"unit":"g"},{"ingredient_name":"minced beef","quantity":500,"unit":"g"}]`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""

  let ingredients: { ingredient_name: string; quantity: number | null; unit: string | null }[] = []
  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) ingredients = JSON.parse(match[0])
  } catch {
    return { error: "Failed to parse ingredients" }
  }

  if (ingredients.length === 0) return { error: "No ingredients returned" }

  const rows = ingredients.map((ing, i) => ({
    meal_id: mealId,
    ingredient_name: ing.ingredient_name,
    quantity: ing.quantity ?? null,
    unit: ing.unit ?? null,
    sort_order: i,
  }))

  const { error } = await supabase.from("meal_ingredients").insert(rows)
  if (error) return { error: error.message }

  return { success: true, count: rows.length }
}
