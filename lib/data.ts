// Ce fichier simule des données qui viendraient normalement d'une base de données.

export interface Listing {
  id: string
  title: string
  pricePerDay: number
  location: string
  availability: string // Ex: "Immédiate", "Dès le 25/07", "Week-ends"
  imageUrl?: string
  category: string // Ex: "Outils", "Sports", "Jardinage"
  isFeatured?: boolean
  rating?: number // Note moyenne, ex: 4.5
  ownerName?: string // Optionnel
}

export const sampleListings: Listing[] = [
  {
    id: "1",
    title: "Perceuse à percussion Makita Pro",
    pricePerDay: 20,
    location: "Montréal, QC",
    availability: "Immédiate",
    imageUrl: "/assets/perceuse.png",
    category: "Outils",
    isFeatured: true,
    rating: 4.8,
    ownerName: "Jean D.",
  },
  {
    id: "2",
    title: "Vélo de montagne Norco Adulte",
    pricePerDay: 35,
    location: "Laval, QC",
    availability: "Dès demain",
    imageUrl: "/assets/velo.png",
    category: "Sports",
    rating: 4.5,
  },
  {
    id: "3",
    title: "Tondeuse à gazon électrique Ryobi",
    pricePerDay: 25,
    location: "Québec, QC",
    availability: "Week-ends seulement",
    imageUrl: "/assets/tondeuse.png",
    category: "Jardinage",
    isFeatured: true,
  },
  {
    id: "4",
    title: "Ensemble de camping 4 personnes Woods",
    pricePerDay: 45,
    location: "Longueuil, QC",
    availability: "Sur demande",
    imageUrl: "/assets/camping.png",
    category: "Sports",
    rating: 4.2,
  },
  {
    id: "5",
    title: "Haut-parleur Bluetooth JBL Charge 5",
    pricePerDay: 15,
    location: "Gatineau, QC",
    availability: "Immédiate",
    imageUrl: "/assets/hautparleur.png",
    category: "Électronique",
    isFeatured: true,
  },
  {
    id: "6",
    title: "Brouette de jardin robuste Garant",
    pricePerDay: 10,
    location: "Sherbrooke, QC",
    availability: "Dès le 10/08",
    imageUrl: "/assets/brouette.png",
    category: "Jardinage",
  },
  {
    id: "7",
    title: "Kayak récréatif Pelican (simple)",
    pricePerDay: 30,
    location: "Trois-Rivières, QC",
    availability: "Immédiate",
    imageUrl: "/assets/kayak.png",
    category: "Sports",
    isFeatured: false,
    rating: 4.0,
  },
  {
    id: "8",
    title: "Scie circulaire DeWalt avec guide",
    pricePerDay: 22,
    location: "Saguenay, QC",
    availability: "Week-ends",
    imageUrl: "/assets/scie.png",
    category: "Outils",
    isFeatured: false,
  },
]
