import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, CalendarDays } from "lucide-react"
import type { Listing } from "@/lib/data"

export default function ListingCard({ listing }: { listing: Listing }) {
  // Fallback image en cas d'image manquante
  const fallbackImage = "/placeholder.svg?width=400&height=250&text=Loka"
  const imageSrc = listing.imageUrl?.startsWith("http")
    ? listing.imageUrl
    : listing.imageUrl
    ? `https://loka.youneselaoufy.com${listing.imageUrl}`
    : fallbackImage

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg flex flex-col h-full bg-card">
      <Link href={`/annonce/${listing.id}`} passHref legacyBehavior>
        <a className="block group">
          <div className="relative w-full aspect-[16/10] bg-muted">
            <Image
              src={imageSrc}
              alt={listing.title}
              fill
              unoptimized // 👈 corrige l’erreur Next.js en désactivant l’optimiseur
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {listing.isFeatured && (
              <Badge className="absolute top-2 right-2 bg-loka-secondary text-white border-loka-secondary">
                En vedette
              </Badge>
            )}
          </div>
        </a>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/annonce/${listing.id}`} passHref legacyBehavior>
          <a className="block">
            <h3
              className="text-lg font-semibold hover:text-loka-primary transition-colors truncate"
              title={listing.title}
            >
              {listing.title}
            </h3>
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1.5 text-loka-primary flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-1.5 text-loka-primary flex-shrink-0" />
          <span className="truncate">Dispo: {listing.availability}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex justify-between items-center w-full">
          <p className="text-xl font-bold text-loka-primary">
            {listing.pricePerDay}$<span className="text-xs font-normal text-muted-foreground">/jour</span>
          </p>
          <Link href={`/annonce/${listing.id}`} passHref legacyBehavior>
            <a className="text-sm text-loka-secondary hover:underline">Voir l'annonce</a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

