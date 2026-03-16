import Link from "next/link"
import FeatureCarousel from "./FeatureCarousel"

const steps = [
  {
    number: "01",
    title: "Set up your household",
    desc: "Add your family members. Note dislikes, allergies, and dietary needs — the planner remembers everything.",
  },
  {
    number: "02",
    title: "Build your meal library",
    desc: "Add meals your family loves. Ingredients are generated automatically, and you can get new ideas whenever you're stuck.",
  },
  {
    number: "03",
    title: "Set your weekly schedule",
    desc: "Choose which meals you want each day and who's eating them. Do it once — it saves for every week.",
  },
  {
    number: "04",
    title: "Generate and go",
    desc: "One tap creates your personalised plan and shopping list. You're done.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ backgroundColor: "#0e2421" }}>
        <div className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(circle at 15% 55%, #b8e0d2 0%, transparent 50%), radial-gradient(circle at 82% 18%, #d4714a 0%, transparent 42%)",
          }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-peach-500/20 border border-peach-400/30 text-peach-300 text-xs font-bold px-4 py-2 rounded-full mb-6 fade-up">
            🎉 Try free for 7 days — no credit card needed
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6 fade-up-1">
            Stop dreading<br />
            <span className="text-peach-300">what's for dinner</span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-300 max-w-xl mx-auto mb-4 leading-relaxed fade-up-2 font-medium">
            Try it for 7 days. See exactly how it works.
          </p>
          <p className="text-base text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-up-2">
            Menu Planner creates a personalised weekly meal plan for every person in your household — automatically. Different tastes, different needs, one plan that works for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 fade-up-3">
            <Link
              href="/login"
              className="bg-peach-500 hover:bg-peach-400 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-2xl hover:-translate-y-0.5"
            >
              Start your free 7 days →
            </Link>
            <Link href="/how-it-works" className="bg-peach-500/20 hover:bg-peach-500/30 border border-peach-400/40 text-peach-200 hover:text-white font-semibold px-6 py-4 rounded-2xl text-base transition-all">
              How it works
            </Link>
          </div>

          <p className="text-stone-500 text-sm fade-up-4">No credit card · Cancel any time · Set up in under 5 minutes</p>

          {/* Mini social proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-stone-500 text-xs fade-up-4">
            {["Per-person meal plans", "Auto shopping list", "Budget tracking", "Meal idea generator"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-mint-400">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features carousel */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Everything you need to sort the week's food
            </h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              Not just a recipe app. A genuine fix for the daily "what shall we have?" problem.
            </p>
          </div>
          <FeatureCarousel />
        </div>
      </section>

      {/* Per-person callout */}
      <section className="py-20 px-6 bg-peach-50 border-y border-peach-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-widest text-mint-600 mb-4">What makes us different</div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
              Wednesday dinner:<br />
              <span className="text-peach-600">two meals, zero arguments</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Most meal planners assume everyone eats the same thing. We don't. Menu Planner knows that the kids want mac and cheese while you want chicken pasta — and plans for both, automatically.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-peach-500 hover:bg-peach-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
              Try it free for a week →
            </Link>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden w-full">
            <div className="bg-stone-50 border-b border-stone-100 px-5 py-3">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Wednesday</span>
            </div>
            <div className="divide-y divide-stone-100">
              {[
                { meal: "Breakfast", detail: "Porridge", who: "Everyone" },
                { meal: "Lunch", detail: "Packed lunch", who: "Kids" },
                { meal: "Dinner", detail: "Mac & Cheese", who: "Olivia, Max", highlight: true },
                { meal: "Dinner", detail: "Chicken Pasta", who: "Carrie, Iain", highlight: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wide">{row.meal}</span>
                    <p className={`text-sm font-semibold mt-0.5 ${row.highlight ? "text-peach-700" : "text-stone-700"}`}>{row.detail}</p>
                  </div>
                  <span className="text-xs text-stone-400">{row.who}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Budget callout */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-widest text-mint-600 mb-4">Budget tracking</div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
              Know your food bill<br />
              <span className="text-peach-600">before you hit the shop</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Set a weekly food budget, add estimated costs to your meals, and see at a glance whether you're on track. No more shock at the checkout.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-peach-500 hover:bg-peach-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
              Start your free trial →
            </Link>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #d4714a 0%, #3a8a78 100%)" }}>
            <div className="px-6 py-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">💰 Weekly Budget</p>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-3xl font-black">£64.50</p>
                  <p className="text-white/60 text-xs mt-1">estimated this week</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white/80">£75.00</p>
                  <p className="text-white/50 text-xs mt-1">weekly budget</p>
                </div>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full" style={{ width: "86%" }} />
              </div>
              <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">On track ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Up and running in minutes</h2>
            <p className="text-stone-500 text-lg">Four steps to a stress-free week, every week.</p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start bg-white border border-stone-200 rounded-2xl px-7 py-6 shadow-sm">
                <span className="text-3xl font-bold text-mint-400 leading-none mt-0.5 w-10 shrink-0">{step.number}</span>
                <div>
                  <h3 className="text-base font-bold text-stone-900 mb-1">{step.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Trial CTA */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: "#0e2421" }}>
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-peach-500/20 border border-peach-400/30 text-peach-300 text-xs font-bold px-4 py-2 rounded-full mb-8">
            🎉 Free for your first week
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            Try it free. No commitment.
          </h2>
          <p className="text-stone-400 mb-4 text-lg">
            Get full access to every feature for 7 days — completely free. See if it works for your family before you pay a thing.
          </p>
          <p className="text-stone-500 text-sm mb-10">After your trial, plans start from just a few pounds a month.</p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-peach-500 hover:bg-peach-400 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Start your free week →
          </Link>
          <p className="text-stone-600 text-sm mt-5">No credit card required · Cancel any time</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-10 px-6" style={{ backgroundColor: "#0e2421" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🍽️</span>
            <span className="font-bold text-stone-400 text-sm">Menu Planner</span>
          </div>
          <div className="flex items-center gap-6 text-stone-500 text-sm">
            <Link href="/how-it-works" className="hover:text-stone-300 transition-colors">How it works</Link>
            <Link href="/pricing" className="hover:text-stone-300 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-stone-300 transition-colors">Log in</Link>
            <Link href="/login" className="hover:text-stone-300 transition-colors">Sign up free</Link>
          </div>
          <p className="text-stone-600 text-xs">Making family mealtimes easier, one week at a time.</p>
        </div>
      </footer>

    </div>
  )
}
