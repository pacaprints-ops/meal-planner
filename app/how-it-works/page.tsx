import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: "🏠",
    title: "Set up your household",
    desc: "Start by creating your household and adding everyone who lives there. For each person you can note any dislikes, allergies, or dietary needs — things like vegetarian, gluten-free, or just hates mushrooms. The planner remembers all of it.",
    tip: "You can always add or update members later. Each person can have their own preferences.",
  },
  {
    number: "02",
    icon: "🍽️",
    title: "Build your meal library",
    desc: "Add the meals your household loves. Give each one a type (breakfast, lunch, dinner or snack), flag it as quick or budget-friendly if you like, and add an estimated cost if you want to track your weekly spend. Ingredients are generated automatically for your shopping list.",
    tip: "Not sure what to add? Use the meal ideas button to get suggestions tailored to your household's tastes.",
  },
  {
    number: "03",
    icon: "📅",
    title: "Set your weekly schedule",
    desc: "Tell the planner which meals each person needs on each day. Tap a person's name to switch them on or off for any meal slot. Someone out on Thursday evenings? Turn off dinner for them. Kids at school for lunch? Switch off lunch for weekdays. You only need to do this once — it saves and repeats every week.",
    tip: "Your schedule is your template. The plan uses it every week, but you can tweak it any time.",
  },
  {
    number: "04",
    icon: "✨",
    title: "Generate your week's plan",
    desc: "Hit the Generate button and the planner builds a full personalised meal plan for the week based on your schedule and meal library. If you're not happy with a day, hit Redo Day to get a fresh set of meals for just that day. You can also swap individual meals by tapping the swap icon.",
    tip: "The plan takes into account everyone's preferences — meals are only assigned to people who can eat them.",
  },
  {
    number: "05",
    icon: "🛒",
    title: "Generate your shopping list",
    desc: "Once your plan is ready, head to the Shopping page and hit Generate. It builds your full shopping list from the ingredients in your planned meals. Add your regular household staples (milk, bread, eggs) once and they'll always be there to tick and add with one tap.",
    tip: "Tick items off as you shop. If you've added estimated costs to your meals, you'll see your weekly spend tracked against your budget.",
  },
]

const faqs = [
  {
    q: "What if someone in my household has different meals to everyone else?",
    a: "That's exactly what Menu Planner is built for. In the schedule, you can have different meals assigned to different people on the same night. The plan handles it automatically.",
  },
  {
    q: "Do I have to redo the schedule every week?",
    a: "No — your schedule saves permanently. Each week you just hit Generate to get a fresh plan based on the same schedule. You only need to change it if your routine changes.",
  },
  {
    q: "How does the budget tracking work?",
    a: "Set your weekly food budget on the Household page. Add an estimated cost to each meal in your library. The Shopping page then shows how your week's plan compares to your budget.",
  },
  {
    q: "What if I don't have enough meals in my library?",
    a: "Use the meal ideas feature on the Meals page. Describe what you're after (quick dinners, something with chicken, kid-friendly meals) and it'll suggest options you can add to your library in one tap.",
  },
  {
    q: "Can I add breakfast and lunch as well as dinner?",
    a: "Yes — you can plan breakfast, lunch, dinner, and snacks. In your schedule, just toggle on the meal slots you want for each person each day.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden" style={{ backgroundColor: "#0d4f45" }}>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 60%, #b8e0d2 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d4714a 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">How it works</h1>
          <p className="text-white/70 text-lg">Five simple steps to a stress-free week of meals — set up once, runs itself after that.</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, i) => (
            <div key={step.number} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="flex items-start gap-5 px-7 py-6">
                <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: i % 2 === 0 ? "#fef7f3" : "#f0faf7" }}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-stone-300 tracking-widest">{step.number}</span>
                    <h2 className="text-lg font-bold text-stone-900">{step.title}</h2>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex items-start gap-2 bg-mint-50 border border-mint-200 rounded-xl px-4 py-3">
                    <span className="text-mint-500 text-xs font-bold shrink-0 mt-0.5">💡</span>
                    <p className="text-stone-600 text-xs leading-relaxed">{step.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white border-t border-stone-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-10">Common questions</h2>
          <div className="space-y-6">
            {faqs.map((item) => (
              <div key={item.q} className="border-b border-stone-100 pb-6">
                <p className="font-semibold text-stone-900 mb-2">{item.q}</p>
                <p className="text-stone-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#0d4f45" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to give it a go?</h2>
          <p className="text-white/60 mb-8">Try it free for 7 days — no credit card needed.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-peach-500 hover:bg-peach-400 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5">
            Start for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-10 px-6" style={{ backgroundColor: "#0d4f45" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-white/70 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-white/70 transition-colors">Log in</Link>
          </div>
          <p className="text-white/30 text-xs">Making family mealtimes easier, one week at a time.</p>
        </div>
      </footer>

    </div>
  )
}
