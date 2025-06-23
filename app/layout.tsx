import type React from "react"
import type { Metadata } from "next"
import { Roboto, Open_Sans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster" // Pour les notifications éventuelles

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans", // Au cas où on voudrait l'utiliser spécifiquement
})

export const metadata: Metadata = {
  title: "Loka - Louez plutôt qu'acheter",
  description: "Plateforme canadienne de location de matériel entre particuliers.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", roboto.variable, openSans.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16">{children}</main> {/* pt-16 pour l'en-tête fixe */}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
