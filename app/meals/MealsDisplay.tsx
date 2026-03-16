"use client"

import { useState } from "react"
import Link from "next/link"
import SuggestionsPanel from "./SuggestionsPanel"

const TABS = [
  { key: "all", label: "All", icon: "🍽️" },
  { key: "breakfast", label: "Breakfast", icon: "🌅" },
  { key: "lunch", label: "Lunch", icon: "☀️" },
  { key: "dinner", label: "Dinner", icon: "🌙" },
  { key: "snack", label: "Snack", icon: "🍎" },
]

const TYPE_STYLES: Record<string, { card: string; pill: string; icon: string }> = {
  breakfast: { card: "border-l-4 border-l-peach-300", pill: "bg-peach-50 text-peach-700", icon: "🌅" },
  lunch:     { card: "border-l-4 border-l-mint-300",  pill: "bg-mint-50 text-mint-700",   icon: "☀️" },
  dinner:    { card: "border-l-4 border-l-stone-400", pill: "bg-stone-100 text-stone-600", icon: "🌙" },
  snack:     { card: "border-l-4 border-l-blue-300",  pill: "bg-blue-50 text-blue-600",   icon: "🍎" },
}

const AVATAR_COLORS = [
  "bg-peach-400",
  "bg-mint-500",
  "bg-blue-400",
  "bg-violet-400",
  "bg-amber-400",
]

type Meal = {
  id: string
  name: string
  meal_type: string
  is_quick: boolean
  is_budget_friendly: boolean
  estimated_cost: number | null
  meal_members: { member_id: string }[]
}

type Member = { id: string; name: string }

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function MealCard({ meal, members }: { meal: Meal; members: Member[] }) {
  const style = TYPE_STYLES[meal.meal_type] || TYPE_STYLES.dinner
  const mealMemberIds = meal.meal_members.map((mm) => mm.member_id)
  const eatingMembers = mealMemberIds.length > 0
    ? members.filter((m) => mealMemberIds.includes(m.id))
    : members

  return (
    <Link
      href={`/meals/${meal.id}`}
      className={`bg-white rounded-2xl shadow-sm border border-stone-200 ${style.card} hover:shadow-md hover:border-peach-200 transition-all group overflow-hidden flex flex-col`}
    >
      <div className="px-4 pt-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${style.pill} capitalize flex items-center gap-1`}>
            <span>{style.icon}</span> {meal.meal_type}
          </span>
          <span className="text-stone-200 group-hover:text-peach-400 transition-colors text-sm">→</span>
        </div>
        <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-peach-700 transition-colors">
          {meal.name}
        </h3>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <div className="flex gap-1 flex-wrap items-center">
          {meal.is_quick && (
            <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-md font-semibold">Quick</span>
          )}
          {meal.estimated_cost && (
            <span className="text-[10px] text-stone-400 font-semibold">£{meal.estimated_cost.toFixed(2)}</span>
          )}
          {meal.is_budget_friendly && (
            <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-md font-semibold">Budget</span>
          )}
        </div>
        {eatingMembers.length > 0 && (
          <div className="flex -space-x-1">
            {eatingMembers.slice(0, 4).map((m, i) => (
              <div
                key={m.id}
                title={m.name}
                className={`w-5 h-5 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white text-[9px] font-bold flex items-center justify-center border border-white`}
              >
                {initials(m.name)}
              </div>
            ))}
            {eatingMembers.length > 4 && (
              <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 text-[9px] font-bold flex items-center justify-center border border-white">
                +{eatingMembers.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function MealsDisplay({ meals, members, householdId }: { meals: Meal[]; members: Member[]; householdId: string }) {
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = meals.filter((m) => {
    const matchesTab = activeTab === "all" || m.meal_type === activeTab
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const countFor = (type: string) =>
    type === "all" ? meals.length : meals.filter((m) => m.meal_type === type).length

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meals…"
          className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-peach-300 shadow-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
        {TABS.map((tab) => {
          const count = countFor(tab.key)
          if (count === 0 && tab.key !== "all") return null
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeTab === tab.key
                  ? "bg-peach-500 text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-500 hover:border-peach-300 hover:text-peach-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* AI Suggestions */}
      <div className="mb-5">
        <SuggestionsPanel householdId={householdId} members={members} />
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 border-dashed">
          <div className="text-4xl mb-3">🍳</div>
          <p className="font-bold text-stone-700 mb-1">
            {search ? `No meals matching "${search}"` : "No meals yet"}
          </p>
          <p className="text-stone-400 text-sm">Add meals or use AI suggestions above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((meal, i) => (
            <div
              key={meal.id}
              className="fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <MealCard meal={meal} members={members} />
            </div>
          ))}
        </div>
      )}

      {/* Next step CTA */}
      {meals.length >= 3 && (
        <div className="mt-8 flex items-center justify-between bg-mint-50 border border-mint-200 rounded-2xl px-5 py-4">
          <div>
            <p className="font-bold text-stone-900 text-sm">Great meal library!</p>
            <p className="text-stone-500 text-xs mt-0.5">Next, set up your weekly schedule</p>
          </div>
          <a href="/schedule" className="bg-peach-500 hover:bg-peach-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all shadow-sm">
            Next →
          </a>
        </div>
      )}
    </div>
  )
}
