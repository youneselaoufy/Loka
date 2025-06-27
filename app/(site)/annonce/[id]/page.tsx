import { notFound } from "next/navigation"
import Image from "next/image"
import { CalendarDays, MapPin } from "lucide-react"
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

type AnnoncePageProps = {
  params: { id: string }
}

export default async function AnnoncePage({ params }: AnnoncePageProps) {
  const { id } = params

  const listing = await getListing(id)
  if (!listing) return notFound()

  const imageSrc = listing.imageUrl?.startsWith("http")
    ? listing.imageUrl
    : listing.imageUrl
    ? `http://localhost:4000${listing.imageUrl}`
    : "/placeholder.svg?width=800&height=400&text=Pas+de+photo"

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative w-full h-72 rounded-lg overflow-hidden mb-6">
        <Image
          src={imageSrc}
          alt={listing.title}
          fill
          className="object-cover"
          unoptimized
        />
        {listing.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-loka-secondary text-white border-loka-secondary">
            En vedette
          </Badge>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-xl text-loka-primary font-semibold mb-4">
        {listing.pricePerDay}$ <span className="text-sm text-muted-foreground">/ jour</span>
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-loka-primary" />
          {listing.location}
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-1 text-loka-primary" />
          Dispo: {listing.availability}
        </div>
      </div>

      <p className="text-muted-foreground mb-4">Catégorie : {listing.category}</p>
      <p className="text-muted-foreground">Propriétaire : {listing.ownerName || "Utilisateur inconnu"}</p>
    </div>
  )
}

// Déplace cette fonction en bas pour garder la structure propre
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
