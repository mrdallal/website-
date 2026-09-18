import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/marketing/wordmark";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-ink text-bone">
      <Container className="flex h-20 items-center">
        <Wordmark className="text-bone" />
      </Container>
      <Container className="flex flex-1 flex-col justify-center py-16">
        <p className="micro-mono text-lime">404</p>
        <h1 className="mt-6 max-w-[14ch] text-display">This page leaked.</h1>
        <p className="mt-6 max-w-[44ch] text-lead text-bone/70">The page you were looking for does not exist or has moved. The system, however, is fine.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="lime" size="lg" withArrow>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outlineLight" size="lg" withArrow>
            <Link href="/contact">Start a project</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
