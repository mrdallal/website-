import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  /** Hide the mobile data-label (e.g. for action columns) */
  hideLabel?: boolean;
  align?: "left" | "right";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  /** Rendered when rows is empty */
  emptyState?: React.ReactNode;
  caption?: string;
  className?: string;
  dense?: boolean;
}

/**
 * Server-renderable table. Collapses into stacked cards under `md`
 * (see `.data-table` rules in globals.css).
 */
export function DataTable<T>({ columns, rows, getRowKey, emptyState, caption, className, dense = false }: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("md:overflow-x-auto md:border md:border-bone/15 md:bg-surface", className)}>
      <table className="data-table text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="border-b border-bone/15 bg-raised/60">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "micro-mono px-4 py-3 font-medium text-mute",
                  col.align === "right" && "text-right",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-bone-2 last:border-0 md:hover:bg-raised">
              {columns.map((col) => (
                <td
                  key={col.key}
                  data-label={col.hideLabel ? "" : col.header}
                  className={cn("px-4 align-middle", dense ? "py-2" : "py-3.5", col.align === "right" && "md:text-right", col.className)}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
