"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ListingCard from "./listing-card"
import type { Listing } from "@/lib/data"

export default function FeaturedAdsCarousel() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/featured-listings")
        const data = await res.json()
        setFeaturedListings(data)
      } catch (err) {
        console.error("Erreur fetch featured listings:", err)
      }
    }

    fetchFeatured()
  }, [])

  if (featuredListings.length === 0) return null

  return (
    <section className="py-12 bg-loka-primary text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Sélection de la semaine</h2>
        <Carousel
          opts={{ align: "start", loop: featuredListings.length > 1 }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredListings.map((listing, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ListingCard listing={listing} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {featuredListings.length > 1 && (
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
