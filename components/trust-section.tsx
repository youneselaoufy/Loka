import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShieldCheck, Smile } from "lucide-react" // Smile pour "Pas de frais cachés"

const commitments = [
  {
    icon: <Users className="h-10 w-10 text-loka-secondary" />,
    title: "Entre particuliers",
    description: "Échanges directs et sécurisés au sein de votre communauté locale.",
  },
  {
    icon: <Smile className="h-10 w-10 text-loka-secondary" />, // Changé pour Smile
    title: "Pas de frais cachés",
    description: "Transparence totale sur les prix. Ce que vous voyez est ce que vous payez.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-loka-secondary" />,
    title: "Matériel vérifié", // Ou "Qualité et confiance"
    description: "Nous encourageons des annonces claires et un matériel bien entretenu.",
  },
]

export default function TrustSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-loka-primary">Nos engagements pour votre confiance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((commitment, index) => (
            <Card
              key={index}
              className="text-center shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg bg-card"
            >
              <CardHeader className="items-center">
                {" "}
                {/* Pour centrer l'icône */}
                <div className="p-3 bg-loka-secondary/10 rounded-full mb-4 w-fit">{commitment.icon}</div>
                <CardTitle className="text-xl font-semibold">{commitment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{commitment.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
