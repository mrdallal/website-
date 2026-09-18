import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { Sidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: { absolute: "TECHSIDES OS", template: "%s — TECHSIDES OS" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-canvas text-bone">
      <a
        href="#dashboard-main"
        className="sr-only z-50 bg-lime px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main id="dashboard-main" className="flex-1 px-5 pb-16 pt-20 sm:px-8 lg:px-10 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
