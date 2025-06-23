"use client"

import { Label } from "@/components/ui/label"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, MapPin, UserCircle } from "lucide-react"
import type { DateRange } from "react-day-picker"

export default function SingleAdPreview() {
  const [date, setDate] = useState<DateRange | undefined>()

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Aperçu de votre annonce</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg rounded-xl">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src="/placeholder.svg?width=800&height=600&text=Nettoyeur+Haute+Pression"
                  alt="Aperçu de l'image de l'annonce"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">Nettoyeur Haute Pression pour Gros Travaux</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                  <MapPin className="h-4 w-4" />
                  <span>Montréal, QC</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground">
                  Nettoyeur haute pression puissant et fiable, parfait pour nettoyer les allées, patios, voitures, et
                  plus. Livré avec plusieurs buses pour différentes applications. Facile à transporter et à installer.
                  Disponible pour location journalière ou hebdomadaire.
                </p>
                <Separator className="my-6" />
                <div className="flex items-center gap-4">
                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Publié par Jeanne Dupont</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Propriétaire vérifié
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="shadow-lg rounded-xl sticky top-20">
              {" "}
              {/* Sticky for desktop */}
              <CardHeader>
                <p className="text-3xl font-bold text-center">
                  35 $ <span className="text-base font-normal text-muted-foreground">/ jour</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Choisir les dates de location</Label>
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mt-1"
                    numberOfMonths={1}
                    locale={{
                      months: [
                        "Janvier",
                        "Février",
                        "Mars",
                        "Avril",
                        "Mai",
                        "Juin",
                        "Juillet",
                        "Août",
                        "Septembre",
                        "Octobre",
                        "Novembre",
                        "Décembre",
                      ],
                      weekdaysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                    }}
                  />
                </div>
                <Button size="lg" className="w-full bg-[#8bc34a] hover:bg-[#7cb33a] text-white">
                  Réserver maintenant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
