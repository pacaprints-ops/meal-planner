"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-stone-400 hover:text-red-500 transition-colors"
    >
      Sign out
    </button>
  )
}
