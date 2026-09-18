import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** Base path + existing query (page will be replaced) */
  basePath: string;
  query: Record<string, string | undefined>;
}

export function Pagination({ page, pageSize, total, basePath, query }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (v) params.set(k, v);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  const linkClass = (disabled: boolean) =>
    cn(
      "inline-flex h-9 items-center border px-3 text-xs font-bold uppercase tracking-[0.08em]",
      disabled ? "pointer-events-none border-bone/15 text-mute" : "border-bone/30 hover:bg-ink hover:text-bone",
    );

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4">
      <p className="font-mono text-xs text-mute">
        Page {page} of {pages} · {total} total
      </p>
      <div className="flex gap-2">
        <Link href={href(Math.max(1, page - 1))} aria-disabled={page <= 1} className={linkClass(page <= 1)}>
          Previous
        </Link>
        <Link href={href(Math.min(pages, page + 1))} aria-disabled={page >= pages} className={linkClass(page >= pages)}>
          Next
        </Link>
      </div>
    </nav>
  );
}
