import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, CalendarCheck, Users } from "lucide-react"

const steps = [
  {
    icon: <UploadCloud className="h-10 w-10 text-[#224489]" />,
    title: "Déposez votre annonce",
    description:
      "Listez facilement vos outils, équipements ou matériel inutilisés. Fixez votre prix, disponibilité et conditions.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-[#224489]" />,
    title: "Réservez et Connectez",
    description:
      "Parcourez les annonces locales, trouvez ce dont vous avez besoin et envoyez une demande de réservation au propriétaire.",
  },
  {
    icon: <Users className="h-10 w-10 text-[#224489]" />,
    title: "Partagez et Gagnez",
    description:
      "Rencontrez-vous, échangez l'article et finalisez la location. Les propriétaires gagnent de l'argent, les locataires économisent !",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
            >
              <CardHeader>
                <div className="mx-auto bg-slate-100 rounded-full p-4 w-fit mb-4">{step.icon}</div>
                <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
