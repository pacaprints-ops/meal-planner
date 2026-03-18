import { supabase } from "@/lib/supabase"
import Link from "next/link"
import MealsDisplay from "./MealsDisplay"

export const dynamic = "force-dynamic"

export default async function MealsPage() {
  const { data: households } = await supabase.from("households").select("id").order("created_at", { ascending: false }).limit(1).single()
  const householdId = households?.id

  const [{ data: meals, error }, { data: members }] = await Promise.all([
    supabase.from("meals").select("*, meal_members(member_id)").eq("household_id", householdId).order("name"),
    supabase.from("household_members").select("id, name").eq("household_id", householdId),
  ])

  if (error) return <p className="text-red-500">Failed to load meals: {error.message}</p>

  return (
    <div className="fade-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach-500 mb-2">
            <span className="w-5 h-5 rounded-full bg-peach-500 text-white flex items-center justify-center text-xs">2</span>
            Step 2 of 5
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Meal Library</h1>
          <p className="text-stone-400 text-sm mt-1">Your household's go-to meals</p>
        </div>
        <Link
          href={`/meals/new?household=${householdId}`}
          className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md shrink-0"
        >
          + Add
        </Link>
      </div>

      <MealsDisplay meals={meals || []} members={members || []} householdId={householdId} />
    </div>
  )
}
