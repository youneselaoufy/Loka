"use client"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/context/auth-context"

interface AuthModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  type: "login" | "register"
  setType: (type: "login" | "register") => void
}

export default function AuthModal({ isOpen, setIsOpen, type, setType }: AuthModalProps) {
  const { toast } = useToast()
  const { setUser } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetFields = () => {
    setEmail("")
    setPassword("")
    setName("")
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Erreur", description: data.error || "Identifiants invalides", variant: "destructive" })
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)

      toast({ title: "Connexion réussie", description: `Bienvenue ${data.user.name}` })
      setIsOpen(false)
      resetFields()
    } catch (err) {
      toast({ title: "Erreur serveur", description: "Impossible de se connecter au serveur", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Erreur", description: data.error || "Inscription échouée", variant: "destructive" })
        return
      }

      toast({ title: "Inscription réussie", description: "Vous pouvez maintenant vous connecter." })
      setType("login")
      resetFields()
    } catch (err) {
      toast({ title: "Erreur serveur", description: "Impossible de contacter le serveur", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs value={type} onValueChange={(v) => setType(v as "login" | "register")} className="w-full">
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
                  <Input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-login">Mot de passe</Label>
                  <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full bg-loka-primary hover:bg-loka-primary/90 text-white">
                  {isLoading ? "Connexion..." : "Se connecter"}
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
                  <Input id="name-register" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-register">Courriel</Label>
                  <Input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-register">Mot de passe</Label>
                  <Input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full bg-loka-secondary hover:bg-loka-secondary/90 text-white">
                  {isLoading ? "Inscription..." : "S’inscrire"}
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
