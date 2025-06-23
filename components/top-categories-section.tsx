import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Wrench, Bike, Sprout, Tent, PartyPopper, Laptop } from "lucide-react"

const categories = [
  {
    name: "Bricolage",
    icon: <Wrench className="h-8 w-8 text-[#224489]" />,
    href: "#",
  },
  {
    name: "Sports",
    icon: <Bike className="h-8 w-8 text-[#224489]" />,
    href: "#",
  },
  {
    name: "Jardinage",
    icon: <Sprout className="h-8 w-8 text-[#224489]" />,
    href: "#",
  },
  {
    name: "Camping",
    icon: <Tent className="h-8 w-8 text-[#224489]" />,
    href: "#",
  },
  {
    name: "Fêtes",
    icon: <PartyPopper className="h-8 w-8 text-[#224489]" />,
    href: "#",
  },
  {
    name: "Électronique",
    icon: <Laptop className="h-8 w-8 text-[#224489]" />,
    href: "#",
  },
]

export default function TopCategoriesSection() {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Catégories populaires</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} className="block group">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-center p-6 rounded-xl aspect-square">
                <div className="mb-3">{category.icon}</div>
                <h3 className="text-base md:text-lg font-semibold text-center">{category.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
