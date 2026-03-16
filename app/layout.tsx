import type { Metadata } from "next"
import { Geist } from "next/font/google"
import NavBar from "./NavBar"
import MainWrapper from "./MainWrapper"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Menu Planner",
  description: "Household meal planning made effortless",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-stone-50 min-h-screen`}>
        <NavBar />
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  )
}
