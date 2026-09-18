import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: CaseStudy;
  className?: string;
  /** Larger typography for the lead card */
  emphasis?: boolean;
  priority?: boolean;
}

export function ProjectCard({ project, className, emphasis = false, priority = false }: ProjectCardProps) {
  const href = `/case-studies/${project.slug}`;
  const isSvg = project.image.endsWith(".svg");

  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={href}
        className="relative block overflow-hidden border border-bone/15 bg-ink focus-visible:outline-2 focus-visible:outline-offset-4"
        aria-label={`${project.title}${project.placeholder ? " (placeholder)" : ""}`}
      >
        <div className={cn("relative w-full", emphasis ? "aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/3]")}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority={priority}
            unoptimized={isSvg}
            sizes={emphasis ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        </div>
        <div className="absolute left-4 top-4 flex gap-2">
          {project.placeholder ? <Badge tone="lime">Placeholder</Badge> : null}
        </div>
        <span className="absolute bottom-4 right-4 flex size-11 items-center justify-center bg-canvas text-bone opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2">
          <ArrowUpRight className="size-5" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="micro-mono text-mute">{project.category}</p>
          <p className="micro-mono text-mute">{project.client}</p>
        </div>
        <h3 className={cn("mt-3 font-semibold tracking-[-0.02em]", emphasis ? "text-h3" : "text-h4")}>
          <Link href={href} className="hover:underline underline-offset-4 decoration-1">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-mute">{project.description}</p>
        {project.results[0] ? (
          <p className="mt-4 border-l-2 border-lime pl-3 text-sm font-medium text-bone/80">{project.results[0]}</p>
        ) : null}
      </div>
    </article>
  );
}
