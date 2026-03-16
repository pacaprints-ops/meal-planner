import { supabase } from "@/lib/supabase"
import Link from "next/link"
import SignOutButton from "./SignOutButton"

function formatWeekDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default async function ProfilePage() {
  const { data: household } = await supabase
    .from("households")
    .select("id, name, weekly_budget")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const householdId = household?.id

  const [{ data: members }, { data: shoppingLists }, { data: meals }] = await Promise.all([
    supabase.from("household_members").select("id, name").eq("household_id", householdId),
    supabase.from("shopping_lists").select("id, name, created_at").eq("household_id", householdId).order("created_at", { ascending: false }).limit(10),
    supabase.from("meals").select("id").eq("household_id", householdId),
  ])

  // Get item counts and completion for each list
  const listsWithStats = await Promise.all(
    (shoppingLists || []).map(async (list) => {
      const { data: items } = await supabase
        .from("shopping_list_items")
        .select("id, is_checked")
        .eq("shopping_list_id", list.id)
      const total = items?.length || 0
      const checked = items?.filter((i) => i.is_checked).length || 0
      return { ...list, total, checked }
    })
  )

  return (
    <div className="fade-up">

      {/* Header */}
      <div className="rounded-2xl overflow-hidden mb-6 shadow-sm" style={{ background: "linear-gradient(135deg, #d4714a 0%, #3a8a78 100%)" }}>
        <div className="px-5 py-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Your account</p>
            <SignOutButton />
          </div>
          <h1 className="text-2xl font-black text-white">{household?.name || "My Household"}</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span>{members?.length || 0} member{(members?.length || 0) !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{meals?.length || 0} meals saved</span>
            {household?.weekly_budget && (
              <>
                <span>·</span>
                <span>£{household.weekly_budget.toFixed(2)}/wk budget</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-6 fade-up-1">
        {[
          { href: "/plan", icon: "✨", label: "This Week's Plan", sub: "View or regenerate" },
          { href: "/schedule", icon: "📅", label: "Weekly Schedule", sub: "Edit your slots" },
          { href: "/meals", icon: "🍽️", label: "Meal Library", sub: `${meals?.length || 0} meals` },
          { href: household ? `/households/${household.id}` : "/households", icon: "🏠", label: "Household", sub: "Members & budget" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-stone-200 rounded-2xl px-4 py-4 hover:shadow-md hover:border-peach-200 transition-all group"
          >
            <span className="text-2xl block mb-2">{item.icon}</span>
            <p className="font-bold text-stone-900 text-sm group-hover:text-peach-700 transition-colors">{item.label}</p>
            <p className="text-stone-400 text-xs mt-0.5">{item.sub}</p>
          </Link>
        ))}
      </div>

      {/* Shopping history */}
      <div className="fade-up-2">
        <h2 className="font-bold text-stone-900 mb-3">Shopping history</h2>

        {listsWithStats.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 border-dashed">
            <div className="text-3xl mb-2">🛒</div>
            <p className="text-stone-500 font-semibold text-sm">No shopping lists yet</p>
            <p className="text-stone-400 text-xs mt-1">Generate your first list on the Shopping page</p>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            {listsWithStats.map((list, i) => {
              const pct = list.total > 0 ? Math.round((list.checked / list.total) * 100) : 0
              const done = list.total > 0 && list.checked === list.total
              return (
                <div key={list.id} className={`px-5 py-4 ${i < listsWithStats.length - 1 ? "border-b border-stone-100" : ""}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{list.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{formatWeekDate(list.created_at)}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      done ? "bg-green-50 text-green-600" : list.total === 0 ? "bg-stone-100 text-stone-400" : "bg-peach-50 text-peach-600"
                    }`}>
                      {done ? "Done ✓" : list.total === 0 ? "Empty" : `${list.checked}/${list.total}`}
                    </span>
                  </div>
                  {list.total > 0 && (
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${done ? "bg-green-400" : "bg-peach-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
