import { supabase } from "@/lib/supabase"
import AddMealForm from "./AddMealForm"

export default async function NewMealPage() {
  const { data: household } = await supabase.from("households").select("id").order("created_at", { ascending: false }).limit(1).single()
  const householdId = household?.id

  const { data: members } = await supabase
    .from("household_members")
    .select("id, name")
    .eq("household_id", householdId)
    .order("sort_order")
    .order("created_at")

  return (
    <div className="fade-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Add a meal</h1>
        <p className="text-stone-400 text-sm mt-1">Ingredients are generated automatically by AI</p>
      </div>
      <AddMealForm householdId={householdId} members={members || []} />
    </div>
  )
}
