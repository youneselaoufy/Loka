import SimplePage from "@/app/_components/SimplePage";

export const metadata = { title: "Conditions d’utilisation – Loka" };

export default function Terms() {
  return (
    <SimplePage title="Conditions d’utilisation">
      <h2>1. Objet du service</h2>
      <p>
        Loka met en relation des particuliers souhaitant louer des objets de
        manière ponctuelle. L’inscription vaut acceptation sans réserve des
        présentes conditions.
      </p>

      <h2>2. Responsabilités des utilisateurs</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Fournir des informations exactes et à jour ;</li>
        <li>Restituer les objets dans l’état où ils ont été empruntés ;</li>
        <li>Respecter les lois en vigueur et les droits des tiers.</li>
      </ul>

      <h2>3. Paiement et commissions</h2>
      <p>
        Les paiements transitent par Stripe ; Loka prélève 10 % de commission
        sur chaque location, incluant les frais de transaction.
      </p>

      <h2>4. Litiges</h2>
      <p>
        En cas de désaccord, les parties s’engagent à chercher une résolution
        amiable avant toute action judiciaire. La juridiction compétente est le
        tribunal de Montréal.
      </p>

      <h2>5. Modifications</h2>
      <p>
        Loka se réserve le droit de modifier les présentes conditions. Les
        utilisateurs seront notifiés 15 jours avant l’entrée en vigueur des
        changements.
      </p>
    </SimplePage>
  );
}
