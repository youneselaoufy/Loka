"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, MountainIcon } from "lucide-react"
import { useState } from "react"
import AuthModal from "./auth-modal"
import { useAuth } from "@/components/context/auth-context" // ✅ Import du contexte

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/annonces", label: "Annonces" },
  { href: "/publier", label: "Publier une annonce" },
  { href: "/tableau-de-bord", label: "Tableau de bord" },
]

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalType, setAuthModalType] = useState<"login" | "register">("login")
  const { user, setUser } = useAuth() // ✅ Récupérer l'utilisateur

  const openAuthModal = (type: "login" | "register") => {
    setAuthModalType(type)
    setIsAuthModalOpen(true)
    setIsSheetOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Bonjour, {user.name}</span>
          <Button variant="outline" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      )
    }
    return (
      <>
        <Button variant="outline" onClick={() => openAuthModal("login")}>
          Se connecter
        </Button>
        <Button
          className="bg-loka-secondary hover:bg-loka-secondary/90 text-white"
          onClick={() => openAuthModal("register")}
        >
          S’inscrire
        </Button>
      </>
    )
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
            {renderAuthButtons()}
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
                    {user ? (
                      <>
                        <span className="text-sm font-medium text-muted-foreground text-left">
                          Bonjour, {user.name}
                        </span>
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                          Se déconnecter
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" onClick={() => openAuthModal("login")}>
                          Se connecter
                        </Button>
                        <Button
                          className="w-full bg-loka-secondary hover:bg-loka-secondary/90 text-white"
                          onClick={() => openAuthModal("register")}
                        >
                          S’inscrire
                        </Button>
                      </>
                    )}
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
