"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  BarChart3,
  CheckSquare,
  FileText,
  Folder,
  Inbox,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  Zap,
  ExternalLink,
} from "lucide-react";
import { dashboardNav } from "@/content/site";
import type { SessionUser } from "@/lib/auth/session";
import { Wordmark } from "@/components/marketing/wordmark";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  layout: LayoutGrid,
  inbox: Inbox,
  users: Users,
  folder: Folder,
  "check-square": CheckSquare,
  "bar-chart": BarChart3,
  "file-text": FileText,
  zap: Zap,
  settings: Settings,
};

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {dashboardNav.map((item) => {
        const Icon = icons[item.icon] ?? LayoutGrid;
        const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "border-lime bg-bone/10 text-bone"
                  : "border-transparent text-bone/60 hover:bg-bone/5 hover:text-bone",
              )}
            >
              <Icon className={cn("size-4 shrink-0", active ? "text-lime" : "text-bone/50 group-hover:text-bone/80")} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function UserBlock({ user }: { user: SessionUser }) {
  return (
    <div className="border-t border-bone/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-bone">{user.name}</p>
          <p className="truncate text-xs text-bone/50">{user.email}</p>
        </div>
        <Badge tone={user.role === "ADMIN" ? "lime" : "outline"} className="shrink-0 border-bone/30 text-bone">
          {user.role === "ADMIN" ? "Admin" : "Team"}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-bone/60 hover:text-bone" target="_blank" rel="noreferrer">
          <ExternalLink className="size-3.5" /> View site
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="inline-flex items-center gap-1.5 text-xs text-bone/60 hover:text-bone">
            <LogOut className="size-3.5" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink text-bone lg:flex" aria-label="Dashboard navigation">
        <div className="flex h-16 items-center justify-between border-b border-bone/10 px-5">
          <Wordmark className="text-bone" size="sm" href="/dashboard" />
          <span className="micro-mono text-bone/40">OS</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <NavList pathname={pathname} />
        </nav>
        <UserBlock user={user} />
      </aside>

      {/* Mobile top bar + sheet */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-bone/10 bg-canvas/95 px-4 backdrop-blur lg:hidden">
        <Wordmark size="sm" href="/dashboard" />
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
          <DialogPrimitive.Trigger asChild>
            <button type="button" className="inline-flex size-10 items-center justify-center border border-bone/30" aria-label="Open navigation">
              <Menu className="size-4" />
            </button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/70" />
            <DialogPrimitive.Content
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col bg-ink text-bone focus:outline-none"
              aria-describedby={undefined}
            >
              <DialogPrimitive.Title className="sr-only">Dashboard navigation</DialogPrimitive.Title>
              <div className="flex h-14 items-center justify-between border-b border-bone/10 px-4">
                <Wordmark className="text-bone" size="sm" href="/dashboard" />
                <DialogPrimitive.Close className="inline-flex size-9 items-center justify-center border border-bone/30" aria-label="Close navigation">
                  <X className="size-4" />
                </DialogPrimitive.Close>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 py-4">
                <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
              </nav>
              <UserBlock user={user} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </div>
    </>
  );
}
