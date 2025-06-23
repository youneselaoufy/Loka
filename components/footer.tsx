import Link from "next/link"
import { MountainIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-loka-primary mb-4">
              <MountainIcon className="h-7 w-7" />
              <span className="text-2xl font-bold">Loka</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme canadienne pour louer et partager du matériel entre particuliers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Liens rapides</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/a-propos" className="text-muted-foreground hover:text-loka-primary">
                À propos de Loka
              </Link>
              <Link href="/comment-ca-marche" className="text-muted-foreground hover:text-loka-primary">
                Comment ça marche ?
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-loka-primary">
                Nous contacter
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-loka-primary">
                FAQ
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Légal</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/politique-confidentialite" className="text-muted-foreground hover:text-loka-primary">
                Politique de confidentialité
              </Link>
              <Link href="/conditions-utilisation" className="text-muted-foreground hover:text-loka-primary">
                Conditions d'utilisation
              </Link>
              <Link href="/politique-cookies" className="text-muted-foreground hover:text-loka-primary">
                Politique sur les cookies
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Loka Inc. Tous droits réservés.</p>
          <p className="mt-1">Loka est un projet fictif à des fins de démonstration.</p>
        </div>
      </div>
    </footer>
  )
}
