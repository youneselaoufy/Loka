import HeroSection from "@/components/hero-section"
import SearchFilterBar from "@/components/search-filter-bar"
import ListingsFeed from "@/components/listings-feed"
import TrustSection from "@/components/trust-section"
import FeaturedAdsCarousel from "@/components/featured-ads-carousel"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchFilterBar />
      <ListingsFeed />
      <FeaturedAdsCarousel />
      <TrustSection />
    </>
  )
}
