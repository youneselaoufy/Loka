"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, CalendarDays } from "lucide-react"
import { useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { frCA } from "date-fns/locale"

export default function SearchFilterBar({
  onSearch,
}: {
  onSearch: (filters: any) => void
}) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  // 🔁 Lancer la recherche automatiquement à chaque changement
  useEffect(() => {
    const filters: any = {
      title,
      location,
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }
    onSearch(filters)
  }, [title, category, location, priceRange]) // Note : tu peux aussi ajouter dateRange si tu veux

  return (
    <section id="search-filters" className="py-8 bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        <div className="bg-background p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Que recherchez-vous ?"
                className="pl-10 h-12 text-base"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
              <Select onValueChange={setCategory}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Outils">Outils</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Jardinage">Jardinage</SelectItem>
                  <SelectItem value="Électronique">Électronique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Entrez une ville"
                  className="pl-10 h-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: frCA })} -{" "}
                          {format(dateRange.to, "LLL dd, y", { locale: frCA })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: frCA })
                      )
                    ) : (
                      <span>Choisir les dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={frCA}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Prix ($/jour): {priceRange[0]} - {priceRange[1] === 500 ? "500+" : priceRange[1]}
              </label>
              <Slider
                min={0}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
