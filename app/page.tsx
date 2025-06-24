'use client'

import { useEffect, useState } from "react"
import HeroSection from "@/components/hero-section"
import SearchFilterBar from "@/components/search-filter-bar"
import ListingsFeed from "@/components/listings-feed"
import TrustSection from "@/components/trust-section"
import FeaturedAdsCarousel from "@/components/featured-ads-carousel"
import type { Listing } from "@/lib/data"

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])

  const fetchListings = async (filters = {}) => {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filters)) {
      if (value !== "") params.append(key, value as string)
    }

    const res = await fetch(`http://localhost:4000/api/listings?${params.toString()}`)
    const data = await res.json()
    setListings(data)
  }

  useEffect(() => {
    fetchListings() // initial load
  }, [])

  return (
    <>
      <HeroSection />
      <SearchFilterBar onSearch={fetchListings} />
      <ListingsFeed listings={listings} />
      <FeaturedAdsCarousel />
      <TrustSection />
    </>
  )
}
