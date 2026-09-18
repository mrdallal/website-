import Link from "next/link";
import { footerNav, primaryCta, siteConfig } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/marketing/wordmark";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-bone">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark className="text-bone" size="lg" />
            <p className="mt-6 max-w-[38ch] text-body text-bone/70">{siteConfig.tagline}</p>
            <Link
              href={primaryCta.href}
              className="link-arrow mt-8 inline-flex items-center gap-3 border-b border-lime pb-1 font-bold uppercase tracking-cta text-lime"
            >
              {primaryCta.label}
              <ArrowUpRight className="arrow size-4" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            {footerNav.map((column) => (
              <div key={column.heading}>
                <h2 className="micro-mono mb-5 text-bone/50">{column.heading}</h2>
                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="nav-link text-sm text-bone/85 hover:text-bone">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="micro-mono mb-5 text-bone/50">Contact</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={`mailto:${siteConfig.contactEmail}`} className="nav-link text-bone/85 hover:text-bone">
                    {siteConfig.contactEmail}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="nav-link text-bone/85 hover:text-bone">
                    Start a project
                  </Link>
                </li>
                {siteConfig.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} rel="noopener noreferrer" target="_blank" className="nav-link text-bone/85 hover:text-bone">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      <div className="overflow-hidden border-t border-bone/10" aria-hidden="true">
        <Container>
          <p className="select-none py-4 text-[clamp(4rem,17vw,17rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-bone/[0.07]">
            {siteConfig.name}
          </p>
        </Container>
      </div>

      <div className="border-t border-bone/10">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro-mono text-bone/50">
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="micro-mono text-bone/50">Attention → Website → Lead → Follow-up → Business</p>
        </Container>
      </div>
    </footer>
  );
}
