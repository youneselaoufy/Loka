"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, CalendarDays, ListFilter } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { frCA } from "date-fns/locale"

export default function SearchFilterBar() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  return (
    <section id="search-filters" className="py-8 bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        <div className="bg-background p-4 md:p-6 rounded-lg shadow-md">
          {/* Barre de recherche principale */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Que recherchez-vous ?" className="pl-10 h-12 text-base" />
            </div>
            <Button className="bg-loka-primary hover:bg-loka-primary/90 text-white h-12 px-6 text-base">
              Rechercher
            </Button>
          </div>

          {/* Filtres avancés et tri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
            {/* Catégorie */}
            <div className="space-y-1">
              <label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground">
                Catégorie
              </label>
              <Select>
                <SelectTrigger id="category-filter" className="h-10">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="outils">Outils & Bricolage</SelectItem>
                  <SelectItem value="sport">Sports & Loisirs</SelectItem>
                  <SelectItem value="jardin">Jardinage</SelectItem>
                  <SelectItem value="evenement">Fêtes & Événements</SelectItem>
                  <SelectItem value="electronique">Électronique</SelectItem>
                  <SelectItem value="vehicules">Véhicules</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ville */}
            <div className="space-y-1">
              <label htmlFor="city-filter" className="text-sm font-medium text-muted-foreground">
                Ville
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="city-filter" type="text" placeholder="Entrez une ville" className="pl-10 h-10" />
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-1">
              <label htmlFor="date-filter" className="text-sm font-medium text-muted-foreground">
                Dates
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-filter"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal h-10"
                  >
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

            {/* Prix */}
            <div className="space-y-1">
              <label htmlFor="price-filter" className="text-sm font-medium text-muted-foreground">
                Prix ($/jour): {priceRange[0]} - {priceRange[1] === 500 ? "500+" : priceRange[1]}
              </label>
              <Slider
                id="price-filter"
                min={0}
                max={500}
                step={10}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-2"
              />
            </div>
          </div>
          {/* Options de tri */}
          <div className="mt-4 pt-4 border-t flex justify-end">
            <div className="space-y-1 w-full sm:w-auto">
              <label htmlFor="sort-options" className="text-sm font-medium text-muted-foreground sr-only">
                Trier par
              </label>
              <Select defaultValue="recentes">
                <SelectTrigger id="sort-options" className="h-10 w-full sm:w-[200px]">
                  <ListFilter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Plus récentes</SelectItem>
                  <SelectItem value="prix_asc">Prix croissant</SelectItem>
                  <SelectItem value="prix_desc">Prix décroissant</SelectItem>
                  <SelectItem value="notees">Mieux notées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
