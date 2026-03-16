"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AddMemberForm({ householdId }: { householdId: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError("")

    const { error } = await supabase.from("household_members").insert({
      household_id: householdId,
      name: name.trim(),
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setName("")
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  )
}
