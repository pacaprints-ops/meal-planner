"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const appLinks = [
  { href: "/households", label: "Household", step: "1", icon: "🏠" },
  { href: "/meals", label: "Meals", step: "2", icon: "🍽️" },
  { href: "/schedule", label: "Schedule", step: "3", icon: "📅" },
  { href: "/plan", label: "This Week", step: "4", icon: "✨" },
  { href: "/shopping", label: "Shopping", step: "5", icon: "🛒" },
]

export default function NavBar() {
  const pathname = usePathname()
  const isLanding = pathname === "/" || pathname === "/login" || pathname === "/pricing" || pathname === "/how-it-works"

  if (isLanding) {
    return (
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/PacaPrints Logo .png" alt="Paca Planners" width={32} height={32} className="rounded-sm" />
            <span className="font-bold text-white text-lg tracking-tight">Menu Planner</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/how-it-works" className="bg-peach-500/20 hover:bg-peach-500/30 border border-peach-400/40 text-peach-200 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
              How it works
            </Link>
            <Link href="/pricing" className="bg-peach-500/20 hover:bg-peach-500/30 border border-peach-400/40 text-peach-200 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
              Pricing
            </Link>
            <Link href="/login" className="bg-peach-500/20 hover:bg-peach-500/30 border border-peach-400/40 text-peach-200 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
              Log in
            </Link>
            <Link href="/login" className="bg-peach-500 hover:bg-peach-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg">
              Get started free
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block sticky top-0 z-50" style={{ backgroundColor: "#0d4f45" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/PacaPrints Logo .png" alt="Paca Planners" width={28} height={28} className="rounded-sm" />
              <span className="font-bold text-white tracking-tight">Menu Planner</span>
            </Link>
            <div className="flex items-center gap-1">
              {appLinks.map((link) => {
                const active = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      active
                        ? "text-peach-300 bg-peach-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-xs font-bold tabular-nums ${active ? "text-peach-400" : "text-white/30"}`}>{link.step}</span>
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/profile"
                className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm ${
                  pathname.startsWith("/profile")
                    ? "bg-peach-500/20 text-peach-300"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
                title="Profile"
              >
                👤
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14" style={{ backgroundColor: "#0d4f45" }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/PacaPrints Logo .png" alt="Paca Planners" width={24} height={24} className="rounded-sm" />
          <span className="font-bold text-white text-sm tracking-tight">Menu Planner</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">
            {appLinks.find(l => pathname.startsWith(l.href))?.label ?? ""}
          </span>
          <Link
            href="/profile"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm ${
              pathname.startsWith("/profile") ? "bg-peach-500/20 text-peach-300" : "text-white/50"
            }`}
          >
            👤
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10" style={{ backgroundColor: "#0d4f45" }}>
        <div className="flex items-stretch">
          {appLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all ${
                  active ? "text-peach-300" : "text-white/40 hover:text-white/70"
                }`}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                <span className="text-[10px] font-semibold">{link.label}</span>
                {active && <span className="absolute bottom-0 w-6 h-0.5 bg-peach-400 rounded-full" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
