import { Wordmark } from "@/components/marketing/wordmark";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen bg-canvas text-bone lg:grid-cols-12">
      <aside className="relative hidden overflow-hidden bg-ink text-bone lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <Wordmark className="relative text-bone" size="lg" />
        <div className="relative">
          <p className="micro-mono text-lime">TECHSIDES OS</p>
          <p className="mt-4 max-w-[16ch] text-h2 font-semibold">The operating system behind the agency.</p>
          <p className="mt-6 max-w-[40ch] text-body text-bone/60">Leads, clients, projects, tasks and automations in one place.</p>
        </div>
        <p className="relative micro-mono text-bone/40">Private. Authorised team members only.</p>
      </aside>
      <main className="flex items-center justify-center px-gutter py-16 lg:col-span-7">{children}</main>
    </div>
  );
}
