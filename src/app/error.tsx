"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page/error-page";

interface ErrorPageRouteProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router convention — catches a rendering/data error anywhere
 * below this segment and shows this instead of a blank white screen. Must
 * be a Client Component. Never renders the raw `error.message` — that's an
 * internal detail, not something a user should see (see the "user-friendly
 * errors" pass elsewhere in this codebase).
 */
export default function ErrorPageRoute({ error, reset }: ErrorPageRouteProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      eyebrow="Error"
      heading="Something went wrong."
      message="We hit a snag loading this page. Trying again usually fixes it."
    >
      <Button onClick={() => reset()}>Try again</Button>
      <Button asChild variant="secondary">
        <Link href="/">Go home</Link>
      </Button>
    </ErrorPage>
  );
}
