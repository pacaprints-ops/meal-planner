"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { generateIngredients } from "./generateIngredients"

type Member = { id: string; name: string }

export default function AddMealForm({ householdId, members }: { householdId: string; members: Member[] }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("dinner")
  const [isQuick, setIsQuick] = useState(false)
  const [isBudget, setIsBudget] = useState(false)
  const [useShortcuts, setUseShortcuts] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map((m) => m.id))
  const [estimatedCost, setEstimatedCost] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function toggleMember(id: string) {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !householdId) return
    setLoading(true)
    setError("")

    const { data, error: mealError } = await supabase
      .from("meals")
      .insert({ household_id: householdId, name: name.trim(), meal_type: type, is_quick: isQuick, is_budget_friendly: isBudget, estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null })
      .select()
      .single()

    if (mealError) { setError(mealError.message); setLoading(false); return }

    if (selectedMembers.length > 0) {
      const { error: memberError } = await supabase.from("meal_members").insert(
        selectedMembers.map((memberId) => ({ meal_id: data.id, member_id: memberId }))
      )
      if (memberError) { setError(memberError.message); setLoading(false); return }
    }

    generateIngredients(data.id, name.trim(), useShortcuts).finally(() => {})
    router.push(`/meals/${data.id}`)
    router.refresh()
  }

  const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"]

  return (
    <form onSubmit={handleSubmit} className="max-w-lg fade-up">
      <div className="bg-white border border-stone-200 rounded-2xl px-6 py-6 shadow-sm space-y-5">

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Meal name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spaghetti Bolognese"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Meal type</label>
          <div className="flex flex-wrap gap-2">
            {MEAL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                  type === t
                    ? "bg-peach-500 border-peach-500 text-white shadow-sm"
                    : "bg-white border-stone-200 text-stone-600 hover:border-peach-300 hover:text-peach-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Options</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Quick", value: isQuick, set: setIsQuick },
              { label: "Budget friendly", value: isBudget, set: setIsBudget },
              { label: "Use shortcuts", value: useShortcuts, set: setUseShortcuts },
            ].map(({ label, value, set }) => (
              <button
                key={label}
                type="button"
                onClick={() => set(!value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  value
                    ? "bg-peach-500 border-peach-500 text-white shadow-sm"
                    : "bg-white border-stone-200 text-stone-600 hover:border-peach-300 hover:text-peach-600"
                }`}
              >
                {value ? "✓ " : ""}{label}
              </button>
            ))}
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Who will eat this?</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const selected = selectedMembers.includes(m.id)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selected
                        ? "bg-peach-500 border-peach-500 text-white shadow-sm"
                        : "bg-white border-stone-200 text-stone-600 hover:border-peach-300 hover:text-peach-600"
                    }`}
                  >
                    {selected ? "✓ " : ""}{m.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Estimated cost <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">£</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="e.g. 8.50"
              className="w-full pl-7 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
            />
          </div>
          <p className="text-xs text-stone-400 mt-1">Used to estimate your weekly spend against your budget</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={loading}
          className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save meal"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-stone-500 hover:text-stone-800 px-4 py-2.5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
