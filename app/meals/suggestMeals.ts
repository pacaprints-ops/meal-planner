"use server"

import Anthropic from "@anthropic-ai/sdk"
import { supabase } from "@/lib/supabase"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function suggestMeals(householdId: string, prompt: string) {
  const [{ data: members }, { data: meals }, { data: preferences }] = await Promise.all([
    supabase.from("household_members").select("id, name").eq("household_id", householdId),
    supabase.from("meals").select("name").eq("household_id", householdId),
    supabase.from("member_preferences").select("value, preference_type, member_id"),
  ])

  const memberMap = Object.fromEntries((members || []).map((m) => [m.id, m.name]))
  const existingMeals = (meals || []).map((m) => m.name)

  const memberSummary = (members || []).map((m) => {
    const prefs = (preferences || []).filter((p) => p.member_id === m.id)
    if (prefs.length === 0) return m.name
    const prefList = prefs.map((p) => `${p.preference_type}: ${p.value}`).join(", ")
    return `${m.name} (${prefList})`
  }).join("\n")

  const userPrompt = prompt.trim()
    ? `The user wants: ${prompt}`
    : "Suggest a variety of family-friendly meals."

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are helping a household plan their meals. Suggest 5 meals they haven't tried yet.

Household members and preferences:
${memberSummary}

Meals they already have:
${existingMeals.join(", ") || "none"}

${userPrompt}

Return ONLY a JSON array of 5 suggestions. Each item: { "name": string, "meal_type": "breakfast"|"lunch"|"dinner" }
Do not suggest anything that conflicts with dietary requirements or allergies.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""
  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return { suggestions: JSON.parse(match[0]) }
  } catch {
    return { error: "Failed to parse suggestions" }
  }
  return { error: "No suggestions returned" }
}
