'use client'

import { useState } from "react"
import { CheckCircle, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PublierAnnoncePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    pricePerDay: "",
    location: "",
    availability: "",
    category: ""
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.email) {
      alert("Vous devez être connecté pour publier une annonce.")
      return
    }

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value)
    })
    if (imageFile) data.append("image", imageFile)
    data.append("userEmail", user.email) // ✅ important

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        body: data,
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ title: "", pricePerDay: "", location: "", availability: "", category: "" })
        setImageFile(null)
        setImagePreview(null)
        setTimeout(() => {
          setSuccess(false)
          router.push("/tableau-de-bord")
        }, 2000)
      } else {
        const err = await res.json()
        alert("Erreur: " + err?.error || "Échec de l'envoi.")
      }
    } catch (err) {
      console.error("Erreur réseau:", err)
      alert("Erreur réseau.")
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Publier une annonce</h1>

      {success && (
        <div className="flex items-center gap-2 mb-4 text-green-600 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <p>Annonce publiée avec succès !</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titre"
          className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-primary" required />

        <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="Prix par jour"
          className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-primary" required />

        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ville"
          className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-primary" required />

        <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="Disponibilité"
          className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-primary" required />

        <select name="category" value={formData.category} onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-3 bg-white focus:outline-primary" required>
          <option value="">-- Catégorie --</option>
          <option value="Outils">Outils</option>
          <option value="Sports">Sports</option>
          <option value="Jardinage">Jardinage</option>
          <option value="Électronique">Électronique</option>
        </select>

        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded cursor-pointer text-gray-500 hover:border-primary transition">
          <Upload className="mb-2" />
          <span>Choisir une image</span>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded shadow" />
        )}

        <button type="submit" className="w-full bg-primary text-white py-3 rounded hover:bg-primary/90 transition">
          Publier l’annonce
        </button>
      </form>
    </main>
  )
}
