import Link from "next/link";
import { serviceOptions } from "@/content/lead-options";
import { leadStatusValues } from "@/lib/validation/lead";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-field";
import { humanize } from "@/lib/utils";

interface LeadFiltersProps {
  values: { status?: string; service?: string; source?: string; q?: string; from?: string; to?: string };
  sources: string[];
}

/** Plain GET form: works without JavaScript and keeps filters in the URL. */
export function LeadFilters({ values, sources }: LeadFiltersProps) {
  const hasFilters = Object.values(values).some(Boolean);

  return (
    <form method="get" action="/dashboard/leads" className="grid gap-3 border border-bone/15 bg-surface p-4 md:grid-cols-12 md:items-end">
      <div className="md:col-span-3">
        <label htmlFor="lead-q" className="micro-mono mb-2 block text-mute">
          Search
        </label>
        <Input id="lead-q" name="q" defaultValue={values.q ?? ""} placeholder="Name, email or company" className="h-10" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="lead-status" className="micro-mono mb-2 block text-mute">
          Status
        </label>
        <Select id="lead-status" name="status" defaultValue={values.status ?? ""} className="h-10">
          <option value="">All</option>
          {leadStatusValues.map((s) => (
            <option key={s} value={s}>
              {humanize(s)}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="lead-service" className="micro-mono mb-2 block text-mute">
          Service
        </label>
        <Select id="lead-service" name="service" defaultValue={values.service ?? ""} className="h-10">
          <option value="">All</option>
          {serviceOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-1">
        <label htmlFor="lead-source" className="micro-mono mb-2 block text-mute">
          Source
        </label>
        <Select id="lead-source" name="source" defaultValue={values.source ?? ""} className="h-10">
          <option value="">All</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-1">
        <label htmlFor="lead-from" className="micro-mono mb-2 block text-mute">
          From
        </label>
        <Input id="lead-from" type="date" name="from" defaultValue={values.from ?? ""} className="h-10 px-2" />
      </div>
      <div className="md:col-span-1">
        <label htmlFor="lead-to" className="micro-mono mb-2 block text-mute">
          To
        </label>
        <Input id="lead-to" type="date" name="to" defaultValue={values.to ?? ""} className="h-10 px-2" />
      </div>
      <div className="flex gap-2 md:col-span-2">
        <Button type="submit" size="sm" className="h-10 flex-1">
          Apply
        </Button>
        {hasFilters ? (
          <Button asChild variant="ghost" size="sm" className="h-10">
            <Link href="/dashboard/leads">Clear</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
