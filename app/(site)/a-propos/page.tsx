import SimplePage from "@/app/_components/SimplePage";

export const metadata = {
  title: "À propos – Loka",
};

export default function About() {
  return (
    <SimplePage title="À propos">
      <p>
        Loka est né à Montréal en 2024 : louer au lieu d’acheter, c’est
        meilleur pour le portefeuille et la planète !
      </p>
    </SimplePage>
  );
}
