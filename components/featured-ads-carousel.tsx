"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { sampleListings } from "@/lib/data"
import ListingCard from "./listing-card" // Réutilisation de ListingCard

export default function FeaturedAdsCarousel() {
  // Sélectionner 3 annonces "en vedette" ou aléatoires si pas assez
  const featuredListings = sampleListings.filter((l) => l.isFeatured).slice(0, 3)
  if (featuredListings.length < 3) {
    // Compléter avec d'autres annonces si pas assez de "featured"
    const additionalNeeded = 3 - featuredListings.length
    const otherListings = sampleListings.filter((l) => !l.isFeatured).slice(0, additionalNeeded)
    featuredListings.push(...otherListings)
  }
  if (featuredListings.length === 0) return null // Ne rien afficher si aucune annonce

  return (
    <section className="py-12 bg-loka-primary text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Sélection de la semaine</h2>
        <Carousel
          opts={{
            align: "start",
            loop: featuredListings.length > 1, // Boucler si plus d'une annonce
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredListings.slice(0, 3).map(
              (
                listing,
                index, // Assurer qu'on a max 3
              ) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    {/* ListingCard est déjà stylé, pas besoin de Card supplémentaire ici */}
                    <ListingCard listing={listing} />
                  </div>
                </CarouselItem>
              ),
            )}
          </CarouselContent>
          {featuredListings.length > 1 && ( // Afficher les contrôles si plus d'une annonce
            <>
              <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-white hidden sm:flex" />
              <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-white hidden sm:flex" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  )
}
