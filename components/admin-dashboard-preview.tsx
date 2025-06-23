import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart2, Activity } from "lucide-react"

const stats = [
  {
    title: "Utilisateurs Totaux",
    value: "1 250",
    icon: <Users className="h-6 w-6 text-muted-foreground" />,
    change: "+15% ce mois-ci",
  },
  {
    title: "Annonces Actives",
    value: "3 420",
    icon: <FileText className="h-6 w-6 text-muted-foreground" />,
    change: "+200 cette semaine",
  },
  {
    title: "Réservations Complétées",
    value: "890",
    icon: <BarChart2 className="h-6 w-6 text-muted-foreground" />,
    change: "+5% par rapport au mois dernier",
  },
  {
    title: "Taux de Réservation",
    value: "76%",
    icon: <Activity className="h-6 w-6 text-muted-foreground" />,
    change: "Tendance à la hausse",
  },
]

export default function AdminDashboardPreview() {
  return (
    <section id="dashboard" className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Aperçu du Tableau de Bord Admin</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Obtenez une vue d'ensemble des performances de votre plateforme avec de puissants outils d'administration.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-lg rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
