import { notFound } from "next/navigation"
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
  params: {
    id: string
  }
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

export default async function AnnoncePage({ params }: PageProps) {
  const listing = await getListing(params.id)
  if (!listing) return notFound()

  return <AnnonceDetail listing={listing} />
}
