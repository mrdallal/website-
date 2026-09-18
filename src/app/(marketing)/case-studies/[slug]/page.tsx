import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { caseStudies, getCaseStudyBySlug } from "@/content/projects";
import { services } from "@/content/services";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { PageHero } from "@/components/marketing/page-hero";
import { FinalCta } from "@/components/marketing/final-cta";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study" };
  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: { images: [{ url: study.image }] },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const relatedServices = services.filter((s) => study.services.includes(s.id));

  return (
    <>
      <PageHero
        label={study.category}
        headline={[study.title]}
        intro={study.description}
        aside={
          <dl className="grid gap-6 sm:grid-cols-4">
            <div>
              <dt className="micro-mono text-mute">Client</dt>
              <dd className="mt-2 font-semibold">{study.client}</dd>
            </div>
            <div>
              <dt className="micro-mono text-mute">Services</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {relatedServices.map((s) => (
                  <Badge key={s.id} tone="outline">
                    {s.title}
                  </Badge>
                ))}
              </dd>
            </div>
            <div>
              <dt className="micro-mono text-mute">Date</dt>
              <dd className="mt-2 font-semibold">{formatDate(study.date, { year: "numeric", month: "long" })}</dd>
            </div>
            <div>
              <dt className="micro-mono text-mute">Status</dt>
              <dd className="mt-2">{study.placeholder ? <Badge tone="lime">Placeholder</Badge> : <Badge tone="ink">Published</Badge>}</dd>
            </div>
          </dl>
        }
      />

      <Section tone="white" padding="none">
        <Container>
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-bone/15 bg-ink">
            <Image src={study.image} alt={study.imageAlt} fill priority unoptimized={study.image.endsWith(".svg")} sizes="100vw" className="object-cover" />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-7">
              {study.challenge ? (
                <div>
                  <SectionLabel as="p" index="01" className="mb-6">
                    The challenge
                  </SectionLabel>
                  <p className="text-lead text-bone/80">{study.challenge}</p>
                </div>
              ) : null}
              {study.approach ? (
                <div>
                  <SectionLabel as="p" index="02" className="mb-6">
                    The approach
                  </SectionLabel>
                  <p className="text-lead text-bone/80">{study.approach}</p>
                </div>
              ) : null}
              {!study.challenge && !study.approach ? (
                <p className="text-lead text-bone/70">
                  This entry is a placeholder. A full write-up (challenge, approach, results) will be published when the project is
                  released.
                </p>
              ) : null}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border border-bone/15 bg-surface p-6 shadow-panel">
                <SectionLabel as="p" className="mb-6">
                  Results
                </SectionLabel>
                <ul className="space-y-3 border-t border-bone/15">
                  {study.results.map((result, i) => (
                    <li key={`${i}-${result}`} className="border-b border-bone/15 py-3 text-sm font-medium">
                      {result}
                    </li>
                  ))}
                </ul>
                {study.testimonial ? (
                  <blockquote className="mt-8">
                    <p className="text-body font-semibold">“{study.testimonial.quote}”</p>
                    <footer className="mt-3 text-sm text-mute">
                      {study.testimonial.author}, {study.testimonial.role}
                    </footer>
                  </blockquote>
                ) : null}
              </div>
            </aside>
          </div>

          <Link href="/work" className="link-arrow mt-16 inline-flex items-center gap-3 label-mono text-bone/70 hover:text-lime">
            <ArrowLeft className="arrow size-4" />
            All work
          </Link>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
