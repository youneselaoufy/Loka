"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import Link from "next/link"

type Listing = {
  id: string
  title: string
  pricePerDay: number
  imageUrl: string
}

type Rental = {
  id: string
  listingId: string
  title: string
  imageUrl: string
  pricePerDay: number
  rentalDate: string
}

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userString = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (!userString || !token) return

    let isMounted = true

    const fetchListings = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/user/listings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erreur lors du chargement des annonces.")
        const data = await res.json()
        if (isMounted) {
          const unique = Array.isArray(data)
            ? [...new Map(data.map(item => [item.id, item])).values()]
            : []
          setListings(unique)
        }
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      }
    }

    const fetchRentals = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/rentals`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erreur lors du chargement des locations.")
        const data = await res.json()
        if (isMounted) {
          const unique = Array.isArray(data)
            // on dé-doublonne par listingId, pas par rental.id
            ? [...new Map(data.map(item => [item.listingId, item])).values()]
            : []
          setRentals(unique)
        }
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      }
    }

    fetchListings()
    fetchRentals()

    return () => {
      isMounted = false
    }
  }, [])

  // Set des annonces déjà louées
  const rentedIds = new Set(rentals.map(r => r.listingId))

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Mon tableau de bord</h1>
        <Link
          href="/publier"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          <Plus size={18} /> Publier une annonce
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 mb-6 rounded">
          ⚠️ {error}
        </div>
      )}

      {/* Annonces publiées */}
      <h2 className="text-xl font-semibold mb-4">Mes annonces publiées</h2>
      {listings.length === 0 ? (
        <p className="text-gray-600 mb-8">Aucune annonce publiée.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {listings.map((item) => {
            const isRented = rentedIds.has(item.id)
            return (
              <div
                key={item.id}
                className="relative border rounded-lg overflow-hidden shadow hover:shadow-md transition"
              >
                {isRented && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    Loué
                  </span>
                )}
                <img
                  src={
                    item.imageUrl.startsWith("http")
                      ? item.imageUrl
                      : `http://localhost:4000${item.imageUrl}`
                  }
                  alt={item.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    ${item.pricePerDay} / jour
                  </p>
                  <button
                    disabled={isRented}
                    className={`mt-4 w-full py-2 rounded text-sm ${
                      isRented
                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {isRented ? "Indisponible" : "Réserver"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Locations */}
      <h2 className="text-xl font-semibold mb-4">Mes locations</h2>
      {rentals.length === 0 ? (
        <p className="text-gray-600">Aucune location pour le moment.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              <img
                src={
                  rental.imageUrl.startsWith("http")
                    ? rental.imageUrl
                    : `http://localhost:4000${rental.imageUrl}`
                }
                alt={rental.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1">
                  {rental.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  ${rental.pricePerDay} / jour
                </p>
                <p className="text-xs text-muted-foreground">
                  Loué le :{" "}
                  {new Date(rental.rentalDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
