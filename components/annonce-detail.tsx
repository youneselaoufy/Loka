"use client"

import Image from "next/image"
import { CalendarDays, MapPin, Tag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Listing {
  id: string
  title: string
  pricePerDay: number
  location: string
  availability: string
  imageUrl?: string
  category: string
  isFeatured?: boolean
  rating?: number
  ownerName?: string
}

export default function AnnonceDetail({ listing }: { listing: Listing }) {
  const [loading, setLoading] = useState(false)

  const handleRent = async () => {
    const token = localStorage.getItem("token")
    if (!token) return alert("Veuillez vous connecter pour louer cette annonce.")

    setLoading(true)
    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: listing.id }),
      })

      const data = await res.json()
      if (res.ok) {
        alert("Annonce louée avec succès !")
      } else {
        alert(data.error || "Erreur lors de la location.")
      }
    } catch {
      alert("Erreur réseau ou serveur.")
    } finally {
      setLoading(false)
    }
  }

  const getImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return "/placeholder.svg?width=800&height=400&text=Pas+de+photo"
    if (imageUrl.startsWith("http")) return imageUrl
    return process.env.NODE_ENV === "production"
      ? `https://loka.youneselaoufy.com${imageUrl}`
      : `http://localhost:4000${imageUrl}`
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow">
          <Image
            src={getImageSrc(listing.imageUrl)}
            alt={listing.title}
            fill
            className="object-cover"
            unoptimized
          />
          {listing.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-loka-secondary text-white border-none">
              En vedette
            </Badge>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
          <p className="text-2xl text-loka-primary font-semibold mb-6">
            {listing.pricePerDay}$ <span className="text-base text-muted-foreground">/ jour</span>
          </p>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-loka-primary" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-loka-primary" />
              <span>Disponibilité : {listing.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-loka-primary" />
              <span>Catégorie : {listing.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-loka-primary" />
              <span>Propriétaire : {listing.ownerName || "Utilisateur inconnu"}</span>
            </div>
          </div>

          <button
            onClick={handleRent}
            disabled={loading}
            className="mt-8 bg-loka-primary text-white px-5 py-2 rounded hover:bg-loka-primary/90 transition disabled:opacity-60"
          >
            {loading ? "Location en cours..." : "Louer cette annonce"}
          </button>
        </div>
      </div>
    </div>
  )
}