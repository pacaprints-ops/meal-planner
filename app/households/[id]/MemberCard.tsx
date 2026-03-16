"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Member = { id: string; name: string }
type Preference = { id: string; member_id: string; preference_type: string; value: string; severity: string }

const AVATAR_COLORS = ["bg-peach-500", "bg-mint-500", "bg-blue-500", "bg-violet-500", "bg-amber-500"]

const PREF_STYLES: Record<string, string> = {
  allergy: "bg-red-50 text-red-600 border border-red-200",
  dietary: "bg-mint-50 text-mint-700 border border-mint-200",
  dislike: "bg-stone-100 text-stone-600 border border-stone-200",
}

const PREF_ICONS: Record<string, string> = {
  allergy: "🚨",
  dietary: "🥗",
  dislike: "🚫",
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function MemberCard({ member, preferences, colorIndex = 0 }: { member: Member; preferences: Preference[]; colorIndex?: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("dislike")
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    setLoading(true)
    setError("")
    const { error } = await supabase.from("member_preferences").insert({
      member_id: member.id,
      preference_type: type,
      value: value.trim(),
      severity: type === "allergy" ? "hard" : "soft",
    })
    if (error) { setError(error.message); setLoading(false); return }
    setValue("")
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function handleRemove(prefId: string) {
    await supabase.from("member_preferences").delete().eq("id", prefId)
    router.refresh()
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`w-12 h-12 rounded-2xl ${avatarColor} text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm`}>
          {initials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-900 text-base">{member.name}</h3>
          <p className="text-stone-400 text-xs mt-0.5">
            {preferences.length === 0 ? "No preferences set" : `${preferences.length} preference${preferences.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            open
              ? "bg-stone-100 text-stone-500 border-stone-200"
              : "bg-peach-50 text-peach-600 border-peach-200 hover:bg-peach-100"
          }`}
        >
          {open ? "Done" : "+ Pref"}
        </button>
      </div>

      {/* Preferences */}
      {preferences.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {preferences.map((p) => (
            <span
              key={p.id}
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-semibold ${PREF_STYLES[p.preference_type]}`}
            >
              <span>{PREF_ICONS[p.preference_type]}</span>
              {p.value}
              <button
                onClick={() => handleRemove(p.id)}
                className="ml-0.5 hover:opacity-60 font-black text-sm leading-none"
                aria-label="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add preference form */}
      {open && (
        <div className="border-t border-stone-100 px-5 py-4 bg-stone-50">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="flex gap-2">
              {["dislike", "dietary", "allergy"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    type === t
                      ? "bg-peach-500 text-white border-peach-500"
                      : "bg-white text-stone-500 border-stone-200 hover:border-peach-300"
                  }`}
                >
                  {PREF_ICONS[t]} {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === "dietary" ? "e.g. vegetarian" : type === "allergy" ? "e.g. nuts" : "e.g. broccoli"}
                className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300 bg-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "…" : "Add"}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </form>
        </div>
      )}
    </div>
  )
}
