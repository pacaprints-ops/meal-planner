"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Meal = {
  id: string
  name: string
  meal_type: string
  is_quick: boolean
  is_budget_friendly: boolean
  estimated_cost: number | null
}

type Member = { id: string; name: string }

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"]

export default function EditMealForm({ meal, members, mealMemberIds }: { meal: Meal; members: Member[]; mealMemberIds: string[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(meal.name)
  const [type, setType] = useState(meal.meal_type)
  const [isQuick, setIsQuick] = useState(meal.is_quick)
  const [isBudget, setIsBudget] = useState(meal.is_budget_friendly)
  const [estimatedCost, setEstimatedCost] = useState(meal.estimated_cost?.toString() ?? "")
  const [selectedMembers, setSelectedMembers] = useState<string[]>(mealMemberIds)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function toggleMember(id: string) {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id])
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError("")

    const { error: mealError } = await supabase
      .from("meals")
      .update({
        name: name.trim(),
        meal_type: type,
        is_quick: isQuick,
        is_budget_friendly: isBudget,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
      })
      .eq("id", meal.id)

    if (mealError) { setError(mealError.message); setLoading(false); return }

    // Update meal members: delete all then re-insert
    await supabase.from("meal_members").delete().eq("meal_id", meal.id)
    if (selectedMembers.length > 0) {
      await supabase.from("meal_members").insert(
        selectedMembers.map((memberId) => ({ meal_id: meal.id, member_id: memberId }))
      )
    }

    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-stone-400 hover:text-peach-600 transition-colors font-medium"
      >
        Edit meal
      </button>
    )
  }

  return (
    <form onSubmit={handleSave} className="mt-4 bg-white border border-stone-200 rounded-2xl px-5 py-5 shadow-sm space-y-4 fade-in">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-stone-900">Edit meal</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-stone-300 hover:text-stone-500 text-lg">✕</button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Meal type</label>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                type === t ? "bg-peach-500 border-peach-500 text-white" : "bg-white border-stone-200 text-stone-600 hover:border-peach-300"
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Options</label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Quick", value: isQuick, set: setIsQuick },
            { label: "Budget friendly", value: isBudget, set: setIsBudget },
          ].map(({ label, value, set }) => (
            <button key={label} type="button" onClick={() => set(!value)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                value ? "bg-peach-500 border-peach-500 text-white" : "bg-white border-stone-200 text-stone-600 hover:border-peach-300"
              }`}
            >{value ? "✓ " : ""}{label}</button>
          ))}
        </div>
      </div>

      {members.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Who eats this?</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const selected = selectedMembers.includes(m.id)
              return (
                <button key={m.id} type="button" onClick={() => toggleMember(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                    selected ? "bg-peach-500 border-peach-500 text-white" : "bg-white border-stone-200 text-stone-600 hover:border-peach-300"
                  }`}
                >{selected ? "✓ " : ""}{m.name}</button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Estimated cost</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">£</span>
          <input
            type="number" step="0.01" min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="e.g. 8.50"
            className="w-full pl-7 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading}
          className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-stone-400 hover:text-stone-700 px-3 py-2.5">
          Cancel
        </button>
      </div>
    </form>
  )
}
