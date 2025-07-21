import SimplePage from "@/app/_components/SimplePage";

export const metadata = { title: "FAQ – Loka" };

export default function FAQ() {
  return (
    <SimplePage title="Foire aux questions">
      <h2>Comment fonctionne la caution ?</h2>
      <p>
        Une pré-autorisation est placée sur votre carte seulement pendant la durée
        de la location. Elle est levée automatiquement au retour de l’objet en bon
        état.
      </p>

      <h2>Puis-je annuler ma réservation ?</h2>
      <p>
        Oui ! Gratuitement jusqu’à 24 h avant le début. Passé ce délai, la première
        journée reste due.
      </p>

      <h2>Les paiements sont-ils sécurisés ?</h2>
      <p>
        Nous utilisons Stripe : vos coordonnées bancaires ne transitent jamais par
        nos serveurs.
      </p>
    </SimplePage>
  );
}
