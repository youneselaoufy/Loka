import { ReactNode } from "react";

export default function SimplePage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <article className="prose dark:prose-invert">{children}</article>
    </main>
  );
}
