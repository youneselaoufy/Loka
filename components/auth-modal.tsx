"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast" // Pour simuler la soumission

interface AuthModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  type: "login" | "register"
  setType: (type: "login" | "register") => void
}

export default function AuthModal({ isOpen, setIsOpen, type, setType }: AuthModalProps) {
  const { toast } = useToast()

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Simulation de la logique de connexion
    toast({
      title: "Connexion (Simulation)",
      description: "Vous seriez maintenant connecté.",
    })
    setIsOpen(false)
  }

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Simulation de la logique d'inscription
    toast({
      title: "Inscription (Simulation)",
      description: "Votre compte serait maintenant créé.",
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs value={type} onValueChange={(value) => setType(value as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="register">S’inscrire</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <DialogHeader className="mt-4">
                <DialogTitle>Connexion</DialogTitle>
                <DialogDescription>Accédez à votre compte Loka.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="email-login">Courriel</Label>
                  <Input id="email-login" type="email" placeholder="nom@exemple.com" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-login">Mot de passe</Label>
                  <Input id="password-login" type="password" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-loka-primary hover:bg-loka-primary/90 text-white">
                  Se connecter
                </Button>
              </DialogFooter>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Pas encore de compte ?{" "}
              <Button variant="link" className="p-0 h-auto text-loka-primary" onClick={() => setType("register")}>
                S'inscrire
              </Button>
            </p>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit}>
              <DialogHeader className="mt-4">
                <DialogTitle>Inscription</DialogTitle>
                <DialogDescription>Créez votre compte Loka gratuitement.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="name-register">Nom complet</Label>
                  <Input id="name-register" placeholder="Votre nom complet" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-register">Courriel</Label>
                  <Input id="email-register" type="email" placeholder="nom@exemple.com" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-register">Mot de passe</Label>
                  <Input id="password-register" type="password" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-loka-secondary hover:bg-loka-secondary/90 text-white">
                  S’inscrire
                </Button>
              </DialogFooter>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Déjà un compte ?{" "}
              <Button variant="link" className="p-0 h-auto text-loka-primary" onClick={() => setType("login")}>
                Se connecter
              </Button>
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
