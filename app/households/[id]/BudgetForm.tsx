"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function BudgetForm({ householdId, currentBudget }: { householdId: string; currentBudget: number | null }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentBudget?.toString() || "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await supabase
      .from("households")
      .update({ weekly_budget: parseFloat(value) || null })
      .eq("id", householdId)
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-white/70 text-sm font-semibold">£</span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24 bg-white/20 border border-white/30 rounded-xl px-3 py-1.5 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="100"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? "…" : "Save"}
        </button>
        <button onClick={() => setEditing(false)} className="text-white/50 hover:text-white/80 text-xs transition-colors">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-2 mt-3 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-3 py-2 transition-all group"
    >
      <span>💰</span>
      <div className="text-left">
        <p className="text-white text-xs font-bold leading-tight">
          {currentBudget ? `£${currentBudget}/week` : "Set your weekly food budget"}
        </p>
        <p className="text-white/50 text-[10px] leading-tight">
          {currentBudget ? "Tap to edit · tracked on shopping page" : "Tap to add · see your spend on the shopping page"}
        </p>
      </div>
      <span className="text-white/40 group-hover:text-white/70 text-xs ml-1">✏️</span>
    </button>
  )
}
