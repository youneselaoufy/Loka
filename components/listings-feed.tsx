"use client"

import ListingCard from "./listing-card"

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

export default function ListingsFeed({ listings }: { listings: Listing[] }) {
  const visibleCount = 6
  const listingsToDisplay = listings.slice(0, visibleCount)

  return (
    <section id="annonces" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Annonces récentes</h2>

        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listingsToDisplay.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucune annonce ne correspond à vos critères.
          </p>
        )}
      </div>
    </section>
  )
}
