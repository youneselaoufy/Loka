import SimplePage from "@/app/_components/SimplePage";
export const metadata = { title: "Contact – Loka" };
export default function Contact() {
  return (
    <SimplePage title="Contact">
      <p>Écrivez-nous à <a href="mailto:support@loka.com">support@loka.com</a>.</p>
    </SimplePage>
  );
}
