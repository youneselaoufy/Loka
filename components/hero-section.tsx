import { Button } from "@/components/ui/button"
import Link from "next/link" // Pour le bouton, même s'il pourrait aussi scroller

export default function HeroSection() {
  return (
    <section className="bg-loka-primary text-white py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">Louez plutôt qu'acheter.</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Découvrez des milliers d'articles à louer près de chez vous. Économisez, partagez et consommez autrement avec
          Loka.
        </p>
        <Button
          size="lg"
          className="bg-loka-secondary hover:bg-loka-secondary/90 text-white font-semibold px-8 py-3 text-lg rounded-md"
          asChild // Pour utiliser Link à l'intérieur
        >
          <Link href="#search-filters">Commencer la location</Link>
        </Button>
      </div>
    </section>
  )
}
