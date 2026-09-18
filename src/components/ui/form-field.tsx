import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Field wrapper: label + control + hint + error, wired with aria attributes.
--------------------------------------------------------------------------- */
interface FormFieldProps {
  label: string;
  name: string;
  hint?: string;
  error?: string | string[];
  required?: boolean;
  optionalLabel?: boolean;
  className?: string;
  children: React.ReactElement<{
    id?: string;
    name?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    required?: boolean;
  }>;
}

export function FormField({ label, name, hint, error, required, optionalLabel = true, className, children }: FormFieldProps) {
  const id = `field-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const message = Array.isArray(error) ? error[0] : error;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="label-mono">{label}</span>
        {!required && optionalLabel ? <span className="micro-mono text-mute">Optional</span> : null}
      </label>
      {React.cloneElement(children, {
        id,
        name,
        required,
        "aria-invalid": Boolean(error) || undefined,
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <p id={hintId} className="text-sm text-mute">
          {hint}
        </p>
      ) : null}
      {message ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {message}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Controls
--------------------------------------------------------------------------- */
const controlBase =
  "w-full rounded-xs border border-bone/15 bg-surface px-3.5 text-base text-bone placeholder:text-mute-2 transition-colors focus:border-lime/70 focus:outline-none disabled:cursor-not-allowed disabled:bg-raised aria-invalid:border-danger";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, "min-h-32 py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlBase, "select-chevron h-12", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ className, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" className={cn("size-4 rounded-xs border-bone/40 accent-lime", className)} {...props} />
      <span>{label}</span>
    </label>
  );
}

/** Generic, accessible form-level error/success message. */
export function FormMessage({ tone, children }: { tone: "error" | "success" | "info"; children: React.ReactNode }) {
  const styles = {
    error: "border-danger/40 bg-danger/8 text-danger",
    success: "border-ok/40 bg-ok/8 text-ok",
    info: "border-bone/20 bg-raised text-bone",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-xs border px-4 py-3 text-sm font-medium", styles[tone])}>
      {children}
    </div>
  );
}
