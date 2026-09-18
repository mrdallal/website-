"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Root error boundary. Shows a safe message; details are never rendered to
 * the visitor (they are available in server logs / the dev overlay).
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error("Unhandled error", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col justify-center bg-canvas text-bone">
      <Container className="py-16">
        <p className="micro-mono text-danger">Something went wrong</p>
        <h1 className="mt-6 max-w-[16ch] text-h2">We hit an unexpected error.</h1>
        <p className="mt-6 max-w-[44ch] text-lead text-bone/70">Please try again. If the problem continues, contact the team and mention the reference below.</p>
        {error.digest ? <p className="mt-4 font-mono text-xs text-mute">Reference: {error.digest}</p> : null}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="outline" size="lg" withArrow>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
