"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Ingredient = { id: string; ingredient_name: string; quantity: number | null; unit: string | null }

export default function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const router = useRouter()
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleRemove(id: string) {
    setRemoving(id)
    await supabase.from("meal_ingredients").delete().eq("id", id)
    setRemoving(null)
    router.refresh()
  }

  if (ingredients.length === 0) return <p className="text-sm text-stone-400 mb-4">Ingredients will appear here shortly — or add your own below while you wait.</p>

  return (
    <ul className="divide-y divide-stone-100 mb-4 -mx-6">
      {ingredients.map((ing) => (
        <li key={ing.id} className="flex items-center justify-between gap-3 px-6 py-2.5 hover:bg-stone-50 transition-colors group">
          <span className="text-sm text-stone-800">
            {ing.ingredient_name}
            {ing.quantity && <span className="text-stone-400 ml-2 text-xs">{ing.quantity} {ing.unit}</span>}
          </span>
          <button
            onClick={() => handleRemove(ing.id)}
            disabled={removing === ing.id}
            className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none opacity-0 group-hover:opacity-100"
            aria-label="Remove"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
