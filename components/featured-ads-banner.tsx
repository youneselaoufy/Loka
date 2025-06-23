import { sampleListings, type Listing } from "@/lib/data"
import ListingCard from "./listing-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturedAdsBanner() {
  const featuredListings: Listing[] = sampleListings.filter((l) => l.isFeatured).slice(0, 4)

  if (featuredListings.length === 0) {
    return null // Don't render if no featured ads
  }

  return (
    <section className="py-16 bg-[#224489] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-center md:text-left mb-4 md:mb-0">Sélection de la semaine</h2>
          <Button variant="outline" asChild className="border-white text-white hover:bg-white hover:text-[#224489]">
            <Link href="#listings">Voir toutes les annonces</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  )
}
