import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"
import AddMemberForm from "./AddMemberForm"
import MemberCard from "./MemberCard"
import BudgetForm from "./BudgetForm"

const AVATAR_COLORS = ["bg-peach-500", "bg-mint-500", "bg-blue-500", "bg-violet-500", "bg-amber-500"]

export default async function HouseholdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [
    { data: household, error: hError },
    { data: members, error: mError },
    { data: preferences },
  ] = await Promise.all([
    supabase.from("households").select("*").eq("id", id).single(),
    supabase.from("household_members").select("*").eq("household_id", id).order("sort_order").order("created_at"),
    supabase.from("member_preferences").select("*"),
  ])

  if (hError || !household) return notFound()

  return (
    <div className="fade-up">

      {/* Branded header card */}
      <div className="rounded-2xl overflow-hidden mb-6 shadow-sm" style={{ background: "linear-gradient(135deg, #d4714a 0%, #3a8a78 100%)" }}>
        <div className="px-5 py-6 text-white">
          <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">1</span>
            Step 1 of 5
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{household.name}</h1>
              <p className="text-white/70 text-sm mt-1">
                {members && members.length > 0
                  ? `${members.length} member${members.length > 1 ? "s" : ""} · tap to manage preferences`
                  : "Add your household members below"}
              </p>
              <BudgetForm householdId={id} currentBudget={household.weekly_budget ?? null} />
            </div>
            <div className="flex -space-x-2 ml-4">
              {(members || []).slice(0, 5).map((m, i) => (
                <div
                  key={m.id}
                  className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} border-2 border-white/30 text-white font-black text-xs flex items-center justify-center`}
                >
                  {m.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add member — at the top */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm mb-5 fade-up-1">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-peach-100 text-peach-700 flex items-center justify-center text-lg">+</div>
          <h2 className="font-bold text-stone-900">Add a member</h2>
        </div>
        <div className="px-5 py-4">
          <AddMemberForm householdId={id} />
        </div>
      </div>

      {/* Members */}
      {mError && <p className="text-red-500 mb-4 text-sm">{mError.message}</p>}

      {members && members.length > 0 ? (
        <div className="space-y-3 mb-6 fade-up-2">
          {members.map((m, i) => (
            <MemberCard
              key={m.id}
              member={m}
              preferences={(preferences || []).filter((p) => p.member_id === m.id)}
              colorIndex={i}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 mb-6 bg-white rounded-2xl border border-stone-200 border-dashed fade-up-2">
          <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
          <p className="text-stone-500 font-semibold mb-1">No members yet</p>
          <p className="text-stone-400 text-sm">Use the form above to add the people in your household</p>
        </div>
      )}

      {/* Next step CTA */}
      {members && members.length > 0 && (
        <div className="flex items-center justify-between bg-mint-50 border border-mint-200 rounded-2xl px-5 py-4 fade-up-3">
          <div>
            <p className="font-bold text-stone-900 text-sm">Household looking good!</p>
            <p className="text-stone-500 text-xs mt-0.5">Next, build your meal library</p>
          </div>
          <Link href="/meals" className="bg-peach-500 hover:bg-peach-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all shadow-sm">
            Next →
          </Link>
        </div>
      )}
    </div>
  )
}
