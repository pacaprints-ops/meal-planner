import Link from "next/link"

const tiers = [
  {
    name: "Free Trial",
    price: "£0",
    period: "for 7 days",
    desc: "Try every feature free. No card needed.",
    cta: "Start free trial",
    href: "/login",
    highlight: false,
    features: [
      "1 household",
      "Up to 5 household members",
      "Unlimited meals in your library",
      "Weekly meal plan generation",
      "Per-person meal planning",
      "Auto-generated shopping list",
      "Meal idea suggestions",
    ],
  },
  {
    name: "Family",
    price: "£4.99",
    period: "per month",
    desc: "Everything you need for a stress-free week.",
    cta: "Start free trial",
    href: "/login",
    highlight: true,
    badge: "Most popular",
    features: [
      "1 household",
      "Up to 8 household members",
      "Unlimited meals in your library",
      "Weekly meal plan generation",
      "Per-person meal planning",
      "Auto-generated shopping list",
      "Meal idea suggestions",
      "Budget tracking",
      "Shopping list history",
      "Staples list",
      "Swap & redo meals any time",
    ],
  },
  {
    name: "Household+",
    price: "£6.99",
    period: "per month",
    desc: "For larger households who need a bit more.",
    cta: "Start free trial",
    href: "/login",
    highlight: false,
    features: [
      "1 household",
      "Up to 12 household members",
      "Unlimited meals in your library",
      "Weekly meal plan generation",
      "Per-person meal planning",
      "Auto-generated shopping list",
      "Meal idea suggestions",
      "Budget tracking",
      "Shopping list history",
      "Staples list",
      "Swap & redo meals any time",
      "Priority support",
    ],
  },
]

const stats = [
  { value: "5 mins", label: "to set up your household" },
  { value: "1 tap", label: "to generate your week" },
  { value: "7 days", label: "completely free" },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden" style={{ backgroundColor: "#0e2421" }}>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 60%, #b8e0d2 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d4714a 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-peach-500/20 border border-peach-400/30 text-peach-300 text-xs font-bold px-4 py-2 rounded-full mb-6">
            🎉 First week always free — no card needed
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, honest pricing</h1>
          <p className="text-stone-400 text-lg">Try everything free for 7 days. Then pick the plan that fits your household.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-white border-b border-stone-100">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-peach-600">{s.value}</p>
              <p className="text-stone-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border flex flex-col ${
                  tier.highlight
                    ? "border-peach-400 shadow-2xl shadow-peach-100/60 bg-white relative"
                    : "border-stone-200 shadow-sm bg-white"
                }`}
              >
                {tier.highlight && (
                  <div className="bg-peach-500 text-white text-xs font-black uppercase tracking-widest text-center py-2.5 rounded-t-2xl">
                    ⭐ Most popular
                  </div>
                )}

                <div className={`px-7 pt-7 pb-5 ${!tier.highlight ? "rounded-t-2xl" : ""}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">{tier.name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black text-stone-900">{tier.price}</span>
                    <span className="text-stone-400 text-sm mb-1.5">{tier.period}</span>
                  </div>
                  <p className="text-stone-500 text-sm mb-6">{tier.desc}</p>

                  <Link
                    href={tier.href}
                    className="block w-full text-center font-bold py-3 rounded-xl text-sm transition-all bg-peach-500 hover:bg-peach-600 text-white shadow-sm hover:shadow-md"
                  >
                    {tier.cta}
                  </Link>
                </div>

                <div className="px-7 pb-7 border-t border-stone-100 flex-1">
                  <ul className="space-y-3 pt-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-stone-600">
                        <span className="text-mint-500 font-bold mt-0.5 shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-stone-400 text-sm mt-8">All plans include a 7-day free trial · Cancel any time · No hidden fees</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white border-t border-stone-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-10">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need a credit card to start?",
                a: "No. Sign up and use everything free for 7 days — no card required until your trial ends.",
              },
              {
                q: "How many households does one subscription cover?",
                a: "Each subscription covers one household. If you have a second household (like a holiday home or a second family), you'd need a separate subscription for it.",
              },
              {
                q: "What counts as a household member?",
                a: "Anyone in your home who you're planning meals for — adults, children, anyone with different tastes or dietary needs. Members are counted per household.",
              },
              {
                q: "What happens after the free trial?",
                a: "You'll be asked to choose a plan. If you don't subscribe, the app will pause until you do. Your data is always kept safe.",
              },
              {
                q: "Can I change plans later?",
                a: "Yes, upgrade or downgrade at any time from your account page.",
              },
              {
                q: "What's the difference between the plans?",
                a: "Family supports up to 8 members. Household+ supports up to 12 and includes priority support. Both have identical features otherwise.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-stone-100 pb-6">
                <p className="font-semibold text-stone-900 mb-2">{item.q}</p>
                <p className="text-stone-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#0e2421" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to sort the week's meals?</h2>
          <p className="text-stone-400 mb-8">Start your free 7-day trial today. No credit card, no commitment.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-peach-500 hover:bg-peach-400 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5">
            Start for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-10 px-6" style={{ backgroundColor: "#0e2421" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-stone-500 text-sm">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <Link href="/login" className="hover:text-stone-300 transition-colors">Log in</Link>
            <Link href="/login" className="hover:text-stone-300 transition-colors">Sign up free</Link>
          </div>
          <p className="text-stone-600 text-xs">Making family mealtimes easier, one week at a time.</p>
        </div>
      </footer>

    </div>
  )
}
