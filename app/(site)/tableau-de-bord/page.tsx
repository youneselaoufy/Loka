'use client'

import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import Link from "next/link"

type Listing = {
  id: number
  title: string
  pricePerDay: number
  imageUrl: string
}

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([])

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {}
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

  useEffect(() => {
    if (!user?.email || !token) return

    const fetchListings = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/user/listings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (Array.isArray(data)) {
          setListings(data)
        } else {
          console.error("Erreur de format des données:", data)
          setListings([])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des annonces:", error)
        setListings([])
      }
    }

    fetchListings()
  }, [user, token])

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

      {listings.length === 0 ? (
        <p className="text-gray-600">Vous n’avez publié aucune annonce pour le moment.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
              <img
                src={item.imageUrl?.startsWith("http") ? item.imageUrl : `http://localhost:4000${item.imageUrl}`}
                alt={item.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-2">${item.pricePerDay} / jour</p>
                <div className="flex justify-between items-center">
                  <button className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                    <Pencil size={16} /> Modifier
                  </button>
                  <button className="text-red-600 hover:underline flex items-center gap-1 text-sm">
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
