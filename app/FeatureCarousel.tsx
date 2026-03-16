"use client"

import { useEffect, useState, useRef, useCallback } from "react"

const features = [
  {
    number: "01",
    icon: "👨‍👩‍👧‍👦",
    title: "Built for real families",
    desc: "Different meals for different people on the same night — handled automatically. Mac and cheese for the kids, curry for the grown-ups. Everyone gets what they want.",
    accent: "#d4714a",
  },
  {
    number: "02",
    icon: "✦",
    title: "Meal ideas on demand",
    desc: "Stuck in a rut? Get personalised meal ideas in seconds. Every suggestion respects your household's dislikes, allergies, and dietary needs — automatically.",
    accent: "#3a8a78",
  },
  {
    number: "03",
    icon: "🛒",
    title: "Shopping list writes itself",
    desc: "Generate your full weekly shopping list in one tap. Add your household staples, tick items off as you go — your shop sorted before you leave the house.",
    accent: "#d4714a",
  },
  {
    number: "04",
    icon: "💰",
    title: "Budget tracking built in",
    desc: "Set a weekly food budget, add estimated costs to your meals, and see whether you're on track before you hit the shop. No more shock at the checkout.",
    accent: "#3a8a78",
  },
  {
    number: "05",
    icon: "📅",
    title: "Your schedule, saved forever",
    desc: "Set up your weekly routine once — who eats what and when. It saves permanently and uses it to build a fresh plan every single week.",
    accent: "#d4714a",
  },
  {
    number: "06",
    icon: "🔄",
    title: "Swap any meal, any day",
    desc: "Not feeling Tuesday's dinner? Swap it out or regenerate the whole day in one tap. Full flexibility, zero spreadsheets.",
    accent: "#3a8a78",
  },
]

export default function FeatureCarousel() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setActive(i)
      setAnimating(false)
    }, 200)
  }, [animating])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length)
    }, 4000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  function handleGoTo(i: number) {
    goTo(i)
    startTimer()
  }

  function handleNext() {
    handleGoTo((active + 1) % features.length)
  }

  function handlePrev() {
    handleGoTo((active - 1 + features.length) % features.length)
  }

  const f = features[active]

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
      {/* Main slide */}
      <div className="flex flex-col md:flex-row min-h-[340px]">

        {/* Left accent panel */}
        <div
          className="md:w-2/5 flex flex-col items-center justify-center px-10 py-12 relative overflow-hidden transition-colors duration-700"
          style={{ backgroundColor: f.accent }}
        >
          {/* Large background number */}
          <span
            className="absolute text-[10rem] font-black leading-none select-none transition-all duration-500"
            style={{ color: "rgba(255,255,255,0.08)", bottom: "-1rem", right: "1rem" }}
          >
            {f.number}
          </span>
          {/* Icon */}
          <span
            className="text-7xl mb-4 relative z-10 transition-all duration-300"
            style={{ opacity: animating ? 0 : 1, transform: animating ? "scale(0.8)" : "scale(1)" }}
          >
            {f.icon}
          </span>
          {/* Counter */}
          <span className="relative z-10 text-white/60 text-xs font-bold tracking-widest uppercase">
            {f.number} / 0{features.length}
          </span>
        </div>

        {/* Right content */}
        <div className="flex-1 bg-white flex flex-col justify-between px-8 md:px-12 py-10">
          <div
            style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "all 0.3s ease" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: f.accent }}>
              Feature {f.number}
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight mb-4">
              {f.title}
            </h3>
            <p className="text-stone-500 text-base leading-relaxed max-w-md">
              {f.desc}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleGoTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "24px" : "8px",
                    height: "8px",
                    backgroundColor: i === active ? f.accent : "#d6d3d1",
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-700 transition-all text-sm"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:opacity-80"
                style={{ backgroundColor: f.accent }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-stone-100">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${((active + 1) / features.length) * 100}%`, backgroundColor: f.accent }}
        />
      </div>
    </div>
  )
}
