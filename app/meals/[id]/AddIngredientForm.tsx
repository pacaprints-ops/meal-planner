"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AddIngredientForm({ mealId }: { mealId: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError("")

    const { error } = await supabase.from("meal_ingredients").insert({
      meal_id: mealId,
      ingredient_name: name.trim(),
      quantity: quantity ? parseFloat(quantity) : null,
      unit: unit.trim() || null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setName("")
    setQuantity("")
    setUnit("")
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-stone-100">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add ingredient…"
        className="flex-1 min-w-32 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
        required
      />
      <input
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Qty"
        className="w-16 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
      />
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="Unit"
        className="w-20 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? "…" : "Add"}
      </button>
      {error && <p className="w-full text-red-500 text-sm">{error}</p>}
    </form>
  )
}
