
'use client'

import { useEffect, useState } from 'react'
import { MapPin, CalendarDays } from 'lucide-react'
import Link from 'next/link'

type Listing = {
  id: number
  title: string
  pricePerDay: number
  location: string
  availability: string
  imageUrl: string
}

export default function AnnoncesPage() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/listings")
        const data = await res.json()
        setListings(data)
      } catch (error) {
        console.error("Erreur lors du chargement des annonces :", error)
      }
    }

    fetchListings()
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">Annonces récentes</h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500">Aucune annonce disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-white border border-gray-200"
            >
              <img
                src={item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:4000${item.imageUrl}`}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-primary">{item.title}</h2>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <CalendarDays size={16} />
                  <span>Dispo: {item.availability}</span>
                </div>
                <p className="text-base font-bold text-green-600">{item.pricePerDay}$<span className="text-sm"> /jour</span></p>
                <Link
                  href={`/annonce/${item.id}`}
                  className="mt-2 inline-block text-center bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                >
                  Voir l'annonce
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
