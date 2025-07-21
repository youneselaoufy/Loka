import SimplePage from "@/app/_components/SimplePage";

export const metadata = { title: "Politique de confidentialité – Loka" };

export default function Privacy() {
  return (
    <SimplePage title="Politique de confidentialité">
      <p>
        Cette politique décrit quelles données nous collectons, pourquoi, et
        comment vous pouvez exercer vos droits.
      </p>

      <h2>Données collectées</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Nom, e-mail et mot de passe chiffré lors de la création de compte.</li>
        <li>Historique des locations et messages échangés.</li>
        <li>Données de paiement gérées par Stripe (nous n’y avons jamais accès).</li>
      </ul>

      <h2>Base légale</h2>
      <p>
        Conformément au RGPD, le traitement repose sur l’exécution du contrat
        (CGU) et votre consentement explicite lors de la navigation.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Vos données sont conservées tant que votre compte reste actif, puis
        archivées 12&nbsp;mois avant suppression définitive.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez accéder, rectifier ou supprimer vos données via
        <a href="mailto:privacy@loka.com" className="underline ml-1">
          privacy@loka.com
        </a>.
      </p>
    </SimplePage>
  );
}
