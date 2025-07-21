import { notFound, headers } from "next/navigation"
import AnnonceDetail from "@/components/annonce-detail"

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

type PageProps = {
  params: { id: string }
}

/**
 * Récupère une annonce depuis le backend.
 * – En Server Component, `fetch("/api/…")` ne passe PAS par `nextConfig.rewrites()`.
 * – On construit donc l’URL absolue à partir de l’en-tête Host (ou d’une env si dispo).
 */
async function getListing(id: string): Promise<Listing | null> {
  // 1) si vous avez défini NEXT_INTERNAL_API_ORIGIN, on l’utilise
  const origin =
    process.env.NEXT_INTERNAL_API_ORIGIN ||
    (() => {
      // 2) sinon on reconstruit à partir du Host reçu par le serveur
      const host = headers().get("host") || "loka.youneselaoufy.com"
      // http pour localhost, sinon https
      const protocol = host.startsWith("localhost") ? "http" : "https"
      return `${protocol}://${host}`
    })()

  try {
    const res = await fetch(`${origin}/api/listings/${id}`, {
      // on ne garde pas de cache pour toujours avoir la version la plus récente
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as Listing
  } catch {
    return null
  }
}

export default async function AnnoncePage({ params }: PageProps) {
  const listing = await getListing(params.id)
  if (!listing) return notFound()

  return <AnnonceDetail listing={listing} />
}
