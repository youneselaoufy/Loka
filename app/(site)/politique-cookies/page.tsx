import SimplePage from "@/app/_components/SimplePage";

export const metadata = { title: "Politique cookies – Loka" };

export default function Cookies() {
  return (
    <SimplePage title="Politique relative aux cookies">
      <p>
        Nous utilisons des cookies pour améliorer votre expérience, mesurer
        l’audience et sécuriser les transactions.
      </p>

      <h2>Cookies essentiels</h2>
      <p>Ils garantissent le bon fonctionnement du site : session, panier, etc.</p>

      <h2>Cookies d’analyse</h2>
      <p>
        Google&nbsp;Analytics (_ga, _gid)&nbsp;: statistiques anonymes pour
        optimiser nos pages.
      </p>

      <h2>Gestion de vos préférences</h2>
      <p>
        Vous pouvez à tout moment supprimer ou bloquer les cookies via les
        paramètres de votre navigateur. Cela peut toutefois dégrader certaines
        fonctionnalités de Loka.
      </p>
    </SimplePage>
  );
}
