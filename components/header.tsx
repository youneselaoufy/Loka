"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, MountainIcon } from "lucide-react"
import { useState } from "react"
import AuthModal from "./auth-modal"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/annonces", label: "Annonces" }, // Supposons une page /annonces
  { href: "/publier", label: "Publier une annonce" }, // Supposons une page /publier
  { href: "/tableau-de-bord", label: "Tableau de bord" }, // Supposons une page /tableau-de-bord
]

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalType, setAuthModalType] = useState<"login" | "register">("login")

  const openAuthModal = (type: "login" | "register") => {
    setAuthModalType(type)
    setIsAuthModalOpen(true)
    setIsSheetOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-loka-primary">
            <MountainIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Loka</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-loka-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" onClick={() => openAuthModal("login")}>
              Se connecter
            </Button>
            <Button
              className="bg-loka-secondary hover:bg-loka-secondary/90 text-white"
              onClick={() => openAuthModal("register")}
            >
              S’inscrire
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[320px]">
                <div className="p-4">
                  <Link
                    href="/"
                    className="mb-6 flex items-center gap-2 font-semibold text-loka-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <MountainIcon className="h-6 w-6" />
                    <span className="text-xl font-bold">Loka</span>
                  </Link>
                  <nav className="grid gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-lg text-muted-foreground hover:text-loka-primary"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-8 flex flex-col gap-2">
                    <Button variant="outline" className="w-full" onClick={() => openAuthModal("login")}>
                      Se connecter
                    </Button>
                    <Button
                      className="w-full bg-loka-secondary hover:bg-loka-secondary/90 text-white"
                      onClick={() => openAuthModal("register")}
                    >
                      S’inscrire
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        setIsOpen={setIsAuthModalOpen}
        type={authModalType}
        setType={setAuthModalType}
      />
    </>
  )
}
