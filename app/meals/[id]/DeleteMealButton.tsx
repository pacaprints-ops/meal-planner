"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DeleteMealButton({ mealId }: { mealId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await supabase.from("meals").delete().eq("id", mealId)
    router.push("/meals")
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-500">Are you sure?</span>
        <button onClick={handleDelete} disabled={loading} className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
          {loading ? "Deleting…" : "Yes, delete"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-sm text-stone-400 hover:text-stone-600">Cancel</button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-sm text-stone-300 hover:text-red-400 transition-colors">
      Delete meal
    </button>
  )
}
