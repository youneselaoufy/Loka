import { sampleListings } from "@/lib/data"
import ListingCard from "./listing-card"

export default function ListingsFeed() {
  // Pour l'instant, on affiche 6 annonces exemples.
  // Dans une vraie application, ceci viendrait d'un API et serait paginé/filtré.
  const listingsToDisplay = sampleListings.slice(0, 6)

  return (
    <section id="annonces" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Annonces récentes</h2>
        {listingsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listingsToDisplay.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucune annonce ne correspond à vos critères pour le moment.
          </p>
        )}
        {/* Optionnel: Bouton "Voir plus" pour la pagination */}
        {/* <div className="text-center mt-8">
          <Button variant="outline">Voir plus d'annonces</Button>
        </div> */}
      </div>
    </section>
  )
}
