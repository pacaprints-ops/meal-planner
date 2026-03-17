"use client"

import { useState } from "react"
import { generateShoppingList, toggleItem, addItem, removeItem, addStaple, removeStaple, addStaplesToList } from "./actions"

type Item = { id: string; ingredient_name: string; quantity: number | null; unit: string | null; is_checked: boolean }
type Staple = { id: string; name: string }
type List = { id: string; name: string } | null

export default function ShoppingView({ list, items: initialItems, staples: initialStaples, householdId, weeklyBudget, estimatedTotal }: {
  list: List; items: Item[]; staples: Staple[]; householdId: string
  weeklyBudget: number | null; estimatedTotal: number | null
}) {
  const [items, setItems] = useState(initialItems)
  const [staples, setStaples] = useState(initialStaples)
  const [generating, setGenerating] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")
  const [showStaples, setShowStaples] = useState(false)
  const [newStaple, setNewStaple] = useState("")
  const [selectedStaples, setSelectedStaples] = useState<string[]>(initialStaples.map((s) => s.name))

  async function handleGenerate() {
    setGenerating(true)
    setError("")
    const result = await generateShoppingList()
    if (result?.error) { setError(result.error); setGenerating(false); return }
    setGenerating(false)
    window.location.reload()
  }

  async function handleToggle(id: string, checked: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_checked: checked } : i)))
    await toggleItem(id, checked)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newItem.trim() || !list) return
    setAdding(true)
    await addItem(list.id, newItem.trim())
    setNewItem("")
    setAdding(false)
    window.location.reload()
  }

  async function handleRemove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await removeItem(id)
  }

  async function handleAddStaple(e: React.FormEvent) {
    e.preventDefault()
    if (!newStaple.trim()) return
    const data = await addStaple(householdId, newStaple.trim())
    if (data) {
      setStaples((prev) => [...prev, { id: data.id, name: newStaple.trim() }])
    }
    setSelectedStaples((prev) => [...prev, newStaple.trim()])
    setNewStaple("")
  }

  async function handleRemoveStaple(id: string, name: string) {
    setStaples((prev) => prev.filter((s) => s.id !== id))
    setSelectedStaples((prev) => prev.filter((n) => n !== name))
    await removeStaple(id)
  }

  function toggleStapleSelection(name: string) {
    setSelectedStaples((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])
  }

  async function handleAddSelected() {
    if (!list || selectedStaples.length === 0) return
    await addStaplesToList(list.id, selectedStaples)
    setShowStaples(false)
    window.location.reload()
  }

  const unchecked = items.filter((i) => !i.is_checked)
  const checked = items.filter((i) => i.is_checked)
  const progress = items.length > 0 ? Math.round((checked.length / items.length) * 100) : 0

  return (
    <div className="fade-up">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Shopping List</h1>
          {list && <p className="text-stone-400 text-sm mt-1">{list.name}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStaples(!showStaples)}
            className={`border text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
              showStaples
                ? "border-peach-300 bg-peach-50 text-peach-700"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            Staples
          </button>
          {list && (
            <button
              onClick={() => window.print()}
              className="border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              Print
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          >
            {generating ? "Generating…" : list ? "Regenerate" : "Generate from plan"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mt-4 mb-6 fade-up-1">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
            <span>{checked.length} of {items.length} items</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-peach-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Budget tracker */}
      {(weeklyBudget || estimatedTotal) && (
        <div className="mb-6 fade-up-1">
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "linear-gradient(135deg, #d4714a 0%, #3a8a78 100%)" }}>
            <div className="px-5 py-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">💰 Weekly Budget</span>
                {weeklyBudget && estimatedTotal && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${estimatedTotal <= weeklyBudget ? "bg-white/20 text-white" : "bg-red-500/30 text-white"}`}>
                    {estimatedTotal <= weeklyBudget ? "On track ✓" : "Over budget ⚠️"}
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between gap-4 mb-3">
                <div>
                  <p className="text-2xl font-black text-white">
                    {estimatedTotal ? `£${estimatedTotal.toFixed(2)}` : "—"}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">estimated this week</p>
                </div>
                {weeklyBudget && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-white/80">£{weeklyBudget.toFixed(2)}</p>
                    <p className="text-white/50 text-xs mt-0.5">weekly budget</p>
                  </div>
                )}
              </div>
              {weeklyBudget && estimatedTotal && (
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${estimatedTotal <= weeklyBudget ? "bg-white" : "bg-red-300"}`}
                    style={{ width: `${Math.min((estimatedTotal / weeklyBudget) * 100, 100)}%` }}
                  />
                </div>
              )}
              {!weeklyBudget && (
                <p className="text-white/50 text-xs">
                  <a href="/households" className="underline hover:text-white">Set a weekly budget</a> on your household page to track spend
                </p>
              )}
              {!estimatedTotal && weeklyBudget && (
                <p className="text-white/50 text-xs">Add estimated costs to your meals to track spend here</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Staples panel */}
      {showStaples && (
        <div className="bg-white border border-stone-200 rounded-2xl px-5 py-5 mb-6 shadow-sm fade-in">
          <h2 className="text-base font-semibold text-stone-900 mb-1">Staples</h2>
          <p className="text-sm text-stone-400 mb-4">Tick what you need this week, then add to your list.</p>

          {staples.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {staples.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={selectedStaples.includes(s.name)}
                      onChange={() => toggleStapleSelection(s.name)}
                      className="rounded accent-peach-500"
                    />
                    {s.name}
                  </label>
                  <button onClick={() => handleRemoveStaple(s.id, s.name)} className="text-stone-300 hover:text-red-400 transition-colors">×</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-400 mb-4">No staples saved yet.</p>
          )}

          <form onSubmit={handleAddStaple} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newStaple}
              onChange={(e) => setNewStaple(e.target.value)}
              placeholder="Add a staple…"
              className="flex-1 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
            />
            <button type="submit" className="bg-stone-100 text-stone-700 text-sm px-4 py-2 rounded-xl hover:bg-stone-200 transition-colors">Save</button>
          </form>

          {list && staples.length > 0 && (
            <button
              onClick={handleAddSelected}
              className="w-full bg-peach-500 hover:bg-peach-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              Add selected to list
            </button>
          )}
        </div>
      )}

      {!list && !error && (
        <div className="text-center py-16 fade-up-2">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-lg font-semibold text-stone-700 mb-2">No shopping list yet</h2>
          <p className="text-stone-400 text-sm">Generate your week's plan first, then hit Generate above.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden mb-4 fade-up-2">
          <ul>
            {unchecked.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input type="checkbox" checked={false} onChange={() => handleToggle(item.id, true)} className="rounded accent-peach-500 w-4 h-4" />
                  <span className="text-stone-800">
                    {item.ingredient_name}
                    {item.quantity && <span className="text-stone-400 text-sm ml-2">{item.quantity} {item.unit}</span>}
                  </span>
                </label>
                <button onClick={() => handleRemove(item.id)} className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {checked.length > 0 && (
        <div className="fade-up-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Done</p>
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <ul>
              {checked.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-stone-100 last:border-0">
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input type="checkbox" checked={true} onChange={() => handleToggle(item.id, false)} className="rounded accent-peach-500 w-4 h-4" />
                    <span className="text-stone-400 line-through">
                      {item.ingredient_name}
                      {item.quantity && <span className="text-sm ml-2">{item.quantity} {item.unit}</span>}
                    </span>
                  </label>
                  <button onClick={() => handleRemove(item.id)} className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {list && (
        <form onSubmit={handleAdd} className="flex gap-2 fade-up-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add an item…"
            className="flex-1 border border-stone-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300 shadow-sm"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-peach-500 hover:bg-peach-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}
    </div>
  )
}
