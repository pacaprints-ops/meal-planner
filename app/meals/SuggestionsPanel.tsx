"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { suggestMeals } from "./suggestMeals"
import { supabase } from "@/lib/supabase"
import { generateIngredients } from "./new/generateIngredients"

type Suggestion = { name: string; meal_type: string }

export default function SuggestionsPanel({ householdId, members }: { householdId: string; members: { id: string; name: string }[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [adding, setAdding] = useState<string | null>(null)
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")

  async function handleSuggest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuggestions([])
    const result = await suggestMeals(householdId, prompt)
    if (result.error) { setError(result.error); setLoading(false); return }
    setSuggestions(result.suggestions || [])
    setLoading(false)
  }

  async function handleAdd(suggestion: Suggestion) {
    setAdding(suggestion.name)
    const allMemberIds = members.map((m) => m.id)

    const { data } = await supabase
      .from("meals")
      .insert({
        household_id: householdId,
        name: suggestion.name,
        meal_type: suggestion.meal_type,
      })
      .select()
      .single()

    if (data) {
      // Tag all members by default
      await supabase.from("meal_members").insert(
        allMemberIds.map((id) => ({ meal_id: data.id, member_id: id }))
      )
      // Generate ingredients in background
      generateIngredients(data.id, suggestion.name).finally(() => {})
    }

    setAdded((prev) => new Set([...prev, suggestion.name]))
    setAdding(null)
    window.location.reload()
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
          open
            ? "border-peach-300 bg-peach-50 text-peach-700"
            : "border-peach-200 bg-gradient-to-r from-peach-50 to-white text-stone-800 hover:border-peach-400 shadow-sm hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✦</span>
          <div className="text-left">
            <p className="font-bold text-base leading-tight">{open ? "Close ideas" : "Not sure what to cook?"}</p>
            <p className="text-xs text-stone-400 font-normal mt-0.5">{open ? "" : "Get personalised meal ideas for your household"}</p>
          </div>
        </div>
        <span className="text-stone-300 text-lg">{open ? "↑" : "→"}</span>
      </button>

      {open && (
        <div className="mt-3 bg-white border border-stone-200 rounded-2xl px-6 py-5 shadow-sm fade-in">
          <h2 className="text-base font-bold text-stone-900 mb-1">Get meal ideas</h2>
          <p className="text-sm text-stone-400 mb-4">Tell us what you're after, or leave blank for a mix of ideas. Dislikes and dietary needs are taken into account automatically.</p>

          <form onSubmit={handleSuggest} className="flex gap-2 mb-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. quick weeknight dinners, something with chicken…"
              className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Thinking…" : "Suggest"}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3 py-3 border-b border-stone-100 last:border-0">
                  <div>
                    <span className="text-stone-800 font-medium">{s.name}</span>
                    <span className="text-xs text-stone-400 ml-2 capitalize">{s.meal_type}</span>
                  </div>
                  {added.has(s.name) ? (
                    <span className="text-sm text-green-600 font-medium">Added ✓</span>
                  ) : (
                    <button
                      onClick={() => handleAdd(s)}
                      disabled={adding === s.name}
                      className="text-sm bg-peach-500 hover:bg-peach-600 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {adding === s.name ? "Adding…" : "Add"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
