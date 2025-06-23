import Image from "next/image"

export default function DashboardPreviewSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Aperçu de votre tableau de bord</h2>
        <div className="max-w-4xl mx-auto bg-slate-100 p-4 sm:p-8 rounded-xl shadow-2xl">
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?width=1200&height=675&text=Aperçu+Tableau+de+Bord+Utilisateur"
              alt="Aperçu du tableau de bord utilisateur"
              fill
              className="object-cover border border-muted"
            />
          </div>
        </div>
        <p className="text-center mt-8 text-muted-foreground max-w-xl mx-auto">
          Gérez vos annonces, messages et réservations en un seul endroit grâce à notre tableau de bord utilisateur
          intuitif.
        </p>
      </div>
    </section>
  )
}
