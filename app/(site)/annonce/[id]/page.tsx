import { notFound } from "next/navigation"
import { headers } from "next/headers"
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

type PageProps = { params: { id: string } }

async function getListing(id: string): Promise<Listing | null> {
  /* URL absolue de l’API */
  const origin =
    process.env.NEXT_INTERNAL_API_ORIGIN ||
    (async () => {
      const hdr = await headers()              // ⬅️ 1) attendre la promesse
      const host = hdr.get("host") ?? "loka.youneselaoufy.com"
      const protocol = host.startsWith("localhost") ? "http" : "https"
      return `${protocol}://${host}`
    })()

  try {
    const res = await fetch(`${await origin}/api/listings/${id}`, {
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
