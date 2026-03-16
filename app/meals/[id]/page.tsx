import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"
import AddIngredientForm from "./AddIngredientForm"
import IngredientList from "./IngredientList"
import DeleteMealButton from "./DeleteMealButton"
import EditMealForm from "./EditMealForm"

export default async function MealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: meal, error }, { data: ingredients }, { data: household }] = await Promise.all([
    supabase.from("meals").select("*, meal_members(member_id)").eq("id", id).single(),
    supabase.from("meal_ingredients").select("*").eq("meal_id", id).order("sort_order").order("created_at"),
    supabase.from("households").select("id").order("created_at", { ascending: false }).limit(1).single(),
  ])

  if (error || !meal) return notFound()

  const { data: members } = household
    ? await supabase.from("household_members").select("id, name").eq("household_id", household.id)
    : { data: [] }

  const mealMemberIds = (meal.meal_members || []).map((mm: { member_id: string }) => mm.member_id)

  return (
    <div className="max-w-lg fade-up">
      <div className="flex items-center justify-between mb-6">
        <Link href="/meals" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-peach-600 transition-colors">
          ← Meals
        </Link>
        <div className="flex items-center gap-4">
          <DeleteMealButton mealId={id} />
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-stone-900 mb-3">{meal.name}</h1>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-peach-50 text-peach-700 border border-peach-200 px-2.5 py-1 rounded-full font-medium capitalize">{meal.meal_type}</span>
          {meal.is_quick && <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full font-medium">Quick</span>}
          {meal.is_budget_friendly && <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full font-medium">Budget</span>}
          {meal.estimated_cost && <span className="text-xs bg-stone-50 text-stone-500 border border-stone-200 px-2.5 py-1 rounded-full font-medium">£{meal.estimated_cost.toFixed(2)}</span>}
        </div>
      </div>

      <EditMealForm
        meal={{ id: meal.id, name: meal.name, meal_type: meal.meal_type, is_quick: meal.is_quick, is_budget_friendly: meal.is_budget_friendly, estimated_cost: meal.estimated_cost }}
        members={members || []}
        mealMemberIds={mealMemberIds}
      />

      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden mt-4">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-900">Ingredients</h2>
          <span className="text-xs text-stone-400">{ingredients?.length || 0} items</span>
        </div>
        <div className="px-6 py-4">
          <IngredientList ingredients={ingredients || []} />
          <AddIngredientForm mealId={id} />
        </div>
      </div>
    </div>
  )
}
