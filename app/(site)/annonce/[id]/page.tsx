// app/annonce/[id]/page.tsx
import { notFound } from "next/navigation"
import Image from "next/image"
import { CalendarDays, MapPin, Tag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

async function getListing(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function AnnoncePage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)
  if (!listing) return notFound()

  const imageSrc = listing.imageUrl?.startsWith("http")
    ? listing.imageUrl
    : listing.imageUrl
    ? `http://localhost:4000${listing.imageUrl}`
    : "/placeholder.svg?width=800&height=400&text=Pas+de+photo"

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image principale */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow">
          <Image
            src={imageSrc}
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

        {/* Infos annonce */}
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
        </div>
      </div>
    </div>
  )
}
