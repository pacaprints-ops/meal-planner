"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = ["breakfast", "lunch", "dinner"]
const MEAL_ICONS: Record<string, string> = { breakfast: "🌅", lunch: "☀️", dinner: "🌙" }

type Slot = { id: string; day_of_week: number; meal_type: string; is_needed: boolean; member_id: string | null }
type Member = { id: string; name: string }

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export default function ScheduleGrid({ slots, scheduleId, members }: { slots: Slot[]; scheduleId: string; members: Member[] }) {
  const [slotMap, setSlotMap] = useState<Record<string, Slot>>(() =>
    Object.fromEntries(slots.map((s) => [`${s.day_of_week}-${s.meal_type}-${s.member_id}`, s]))
  )

  async function toggle(dayIndex: number, mealType: string, memberId: string) {
    const key = `${dayIndex}-${mealType}-${memberId}`
    const slot = slotMap[key]
    if (!slot) return
    const newValue = !slot.is_needed
    setSlotMap((prev) => ({ ...prev, [key]: { ...slot, is_needed: newValue } }))
    await supabase.from("weekly_schedule_slots").update({ is_needed: newValue }).eq("id", slot.id)
  }

  function noneOn(dayIndex: number, mealType: string) {
    return members.every((m) => !slotMap[`${dayIndex}-${mealType}-${m.id}`]?.is_needed)
  }

  return (
    <div className="grid gap-3">
      {DAYS.map((day, dayIndex) => (
        <div key={day} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="bg-stone-50 border-b border-stone-100 px-5 py-3">
            <h3 className="font-bold text-stone-900">{day}</h3>
          </div>
          <div className="divide-y divide-stone-100">
            {MEAL_TYPES.map((mealType) => {
              const none = noneOn(dayIndex, mealType)
              return (
                <div key={mealType} className={`px-5 py-3 flex items-center gap-4 ${none ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span>{MEAL_ICONS[mealType]}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 capitalize">{mealType}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member) => {
                      const isOn = slotMap[`${dayIndex}-${mealType}-${member.id}`]?.is_needed ?? false
                      return (
                        <button
                          key={member.id}
                          onClick={() => toggle(dayIndex, mealType, member.id)}
                          title={`${member.name} — ${isOn ? "needs this meal" : "not eating this"}`}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isOn
                              ? "bg-peach-500 text-white shadow-sm hover:bg-peach-600"
                              : "bg-stone-100 text-stone-300 hover:bg-stone-200"
                          }`}
                        >
                          <span className="font-black">{initials(member.name)}</span>
                          <span className="hidden sm:inline font-semibold">{member.name.split(" ")[0]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
