"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import type { DateRange } from "react-day-picker"

export default function PostAdSection() {
  const [date, setDate] = useState<DateRange | undefined>()

  return (
    <section id="post-ad" className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Déposer une nouvelle annonce</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Ex: Tondeuse à gazon professionnelle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Décrivez votre article en détail" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diy">Bricolage</SelectItem>
                      <SelectItem value="sports">Équipement sportif</SelectItem>
                      <SelectItem value="gardening">Jardinage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix par jour ($)</Label>
                  <Input id="price" type="number" placeholder="25" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Disponibilité</Label>
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
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
              <div className="space-y-2">
                <Label htmlFor="images">Télécharger des images</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG ou GIF (MAX. 800x400px)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full bg-[#224489] hover:bg-[#1e3a75] text-white">
                Soumettre l'annonce
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
