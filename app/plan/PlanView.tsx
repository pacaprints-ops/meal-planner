"use client"

import { useState } from "react"
import { generatePlan, getMealsForType, swapMeal, regenerateDayPlan } from "./actions"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = ["breakfast", "lunch", "dinner"]

const MEAL_ICONS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
}

type Item = {
  day_of_week: number
  meal_type: string
  meal_name_snapshot: string
  meal_id: string
  member_id: string | null
}

type Member = { id: string; name: string }
type MealOption = { id: string; name: string }

function MealGroup({ mealId, mealName, memberNames, planId, dayOfWeek, mealType, householdId, onSwapped }: {
  mealId: string; mealName: string; memberNames: string[]
  planId: string; dayOfWeek: number; mealType: string; householdId: string
  onSwapped: () => void
}) {
  const [swapping, setSwapping] = useState(false)
  const [options, setOptions] = useState<MealOption[]>([])
  const [loading, setLoading] = useState(false)

  async function handleOpenSwap() {
    if (swapping) { setSwapping(false); return }
    setLoading(true)
    const meals = await getMealsForType(householdId, mealType)
    setOptions(meals.filter((m) => m.id !== mealId))
    setLoading(false)
    setSwapping(true)
  }

  async function handleSwap(newMeal: MealOption) {
    await swapMeal(planId, dayOfWeek, mealType, mealId, newMeal.id, newMeal.name)
    setSwapping(false)
    onSwapped()
  }

  return (
    <div className="mb-1 last:mb-0">
      <div className="flex items-start gap-2 flex-wrap">
        <div className="flex-1">
          <span className="text-stone-800 font-semibold text-sm">{mealName}</span>
          {memberNames.length > 0 && (
            <span className="text-stone-400 text-xs ml-2 bg-stone-100 px-2 py-0.5 rounded-full">{memberNames.join(", ")}</span>
          )}
        </div>
        <button
          onClick={handleOpenSwap}
          disabled={loading}
          className="text-stone-300 hover:text-peach-500 transition-colors text-xs shrink-0 mt-0.5"
          title="Swap meal"
        >
          {loading ? "…" : swapping ? "✕" : "⇄"}
        </button>
      </div>
      {swapping && (
        <div className="mt-2 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
          {options.length === 0 ? (
            <p className="text-xs text-stone-400 px-4 py-3">No other options</p>
          ) : (
            options.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSwap(m)}
                className="block w-full text-left text-sm px-4 py-2.5 hover:bg-peach-50 hover:text-peach-700 transition-colors border-b border-stone-100 last:border-0"
              >
                {m.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function PlanView({ items, members, weekStart, planId, householdId }: {
  items: Item[]; members: Member[]; weekStart: string
  planId: string | null; householdId: string
}) {
  const [loading, setLoading] = useState(false)
  const [redoingDay, setRedoingDay] = useState<number | null>(null)
  const [localItems, setLocalItems] = useState(items)

  async function handleGenerate() {
    setLoading(true)
    const result = await generatePlan()
    if (result?.error) alert(result.error)
    setLoading(false)
    window.location.reload()
  }

  async function handleRedoDay(dayIndex: number) {
    if (!planId) return
    setRedoingDay(dayIndex)
    const result = await regenerateDayPlan(planId, dayIndex, householdId)
    if (result?.error) alert(result.error)
    setRedoingDay(null)
    window.location.reload()
  }

  const formatted = new Date(weekStart).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  })

  const hasPlan = localItems.length > 0
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m.name]))

  return (
    <div className="fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">This Week</h1>
          <p className="text-stone-400 text-sm mt-1">w/c {formatted}</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Generating…" : hasPlan ? "Regenerate" : "Generate plan"}
        </button>
      </div>

      {!hasPlan && (
        <div className="mt-8 fade-up-2">
          <div className="rounded-2xl overflow-hidden shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #d4714a 0%, #3a8a78 100%)" }}>
            <div className="px-6 py-7 text-white text-center">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-xl font-black text-white mb-2">Ready for a new week?</h2>
              <p className="text-white/70 text-sm mb-5 max-w-xs mx-auto">Your schedule is saved — just hit generate and we'll plan this week's meals around it.</p>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-white text-peach-700 hover:bg-peach-50 font-bold px-8 py-3 rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50 text-sm"
              >
                {loading ? "Generating…" : "Generate this week's plan"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 text-sm text-stone-400">
            <a href="/schedule" className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-center hover:border-peach-200 hover:text-peach-600 transition-all">
              📅 Update schedule first
            </a>
            <a href="/meals" className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-center hover:border-peach-200 hover:text-peach-600 transition-all">
              🍽️ Add new meals
            </a>
          </div>
        </div>
      )}

      {hasPlan && (
        <div className="grid gap-4 fade-up-2">
          {DAYS.map((day, dayIndex) => {
            const dayItems = localItems.filter((i) => i.day_of_week === dayIndex)
            if (dayItems.length === 0) return null

            return (
              <div key={day} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="bg-stone-50 border-b border-stone-100 px-5 py-3 flex items-center justify-between">
                  <h3 className="font-bold text-stone-900">{day}</h3>
                  <button
                    onClick={() => handleRedoDay(dayIndex)}
                    disabled={redoingDay === dayIndex}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-stone-200 hover:border-peach-400 hover:text-peach-600 hover:bg-peach-50 text-stone-400 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                  >
                    {redoingDay === dayIndex ? (
                      <span className="animate-pulse">Redoing…</span>
                    ) : (
                      <>↺ Redo day</>
                    )}
                  </button>
                </div>
                <div className="divide-y divide-stone-100">
                  {MEAL_TYPES.map((mealType) => {
                    const slotItems = dayItems.filter((i) => i.meal_type === mealType)
                    if (slotItems.length === 0) return null

                    // Group by meal name
                    const byMeal: Record<string, { mealId: string; memberIds: string[] }> = {}
                    for (const item of slotItems) {
                      if (!byMeal[item.meal_name_snapshot]) byMeal[item.meal_name_snapshot] = { mealId: item.meal_id, memberIds: [] }
                      if (item.member_id) byMeal[item.meal_name_snapshot].memberIds.push(item.member_id)
                    }
                    const groups = Object.entries(byMeal)
                    const showNames = groups.length > 1

                    return (
                      <div key={mealType} className="px-5 py-3.5 flex items-start gap-4">
                        <div className="flex items-center gap-2 w-28 shrink-0">
                          <span className="text-base">{MEAL_ICONS[mealType]}</span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 capitalize">{mealType}</span>
                        </div>
                        <div className="flex-1">
                          {planId ? (
                            groups.map(([mealName, { mealId, memberIds }]) => (
                              <MealGroup
                                key={mealId}
                                mealId={mealId}
                                mealName={mealName}
                                memberNames={showNames ? memberIds.map((id) => memberMap[id] || "?") : []}
                                planId={planId}
                                dayOfWeek={dayIndex}
                                mealType={mealType}
                                householdId={householdId}
                                onSwapped={() => window.location.reload()}
                              />
                            ))
                          ) : (
                            <span className="text-stone-300 text-sm">—</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {hasPlan && (
        <div className="mt-8 flex justify-end fade-up-3">
          <a href="/shopping" className="inline-flex items-center gap-2 bg-peach-500 hover:bg-peach-600 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all hover:shadow-md text-sm">
            Next: Shopping list →
          </a>
        </div>
      )}
    </div>
  )
}
