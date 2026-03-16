import { supabase } from "@/lib/supabase"
import Link from "next/link"
import CreateHouseholdForm from "./CreateHouseholdForm"
import { redirect } from "next/navigation"

export default async function HouseholdsPage() {
  const { data: households, error } = await supabase
    .from("households")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return <p className="text-red-500">Failed to load: {error.message}</p>

  // If there's already a household, go straight to it
  const existingHousehold = households?.find(h => h.name)
  if (existingHousehold) {
    redirect(`/households/${existingHousehold.id}`)
  }

  return (
    <div className="max-w-xl mx-auto fade-up">
      {/* Welcome header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🏠</div>
        <h1 className="text-4xl font-bold text-stone-900 mb-3">Welcome to Menu Planner</h1>
        <p className="text-stone-500 text-lg">Let's start by setting up your household. You can add members and their preferences in the next step.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-stone-100" style={{ background: "linear-gradient(135deg, #fef7f3 0%, #f0faf7 100%)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-peach-500 text-white text-sm font-bold flex items-center justify-center">1</div>
            <div>
              <h2 className="font-bold text-stone-900">Name your household</h2>
              <p className="text-xs text-stone-400 mt-0.5">e.g. "The Smith Family" or just your surname</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-5">
          <CreateHouseholdForm />
        </div>
      </div>
    </div>
  )
}
