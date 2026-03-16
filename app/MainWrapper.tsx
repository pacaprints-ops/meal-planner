"use client"

import { usePathname } from "next/navigation"

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/" || pathname === "/login" || pathname === "/pricing" || pathname === "/how-it-works") return <>{children}</>
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-10">
      {children}
    </main>
  )
}
