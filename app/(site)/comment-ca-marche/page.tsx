import SimplePage from "@/app/_components/SimplePage";

export const metadata = { title: "Comment ça marche – Loka" };

export default function HowItWorks() {
  return (
    <SimplePage title="Comment ça marche">
      <ol className="list-decimal pl-5 space-y-2">
        <li>Créez un compte gratuitement.</li>
        <li>Publiez un objet ou trouvez celui qu’il vous faut.</li>
        <li>Réglez et récupérez l’objet en toute sécurité.</li>
      </ol>
    </SimplePage>
  );
}
