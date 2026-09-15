import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page/error-page";

export const metadata: Metadata = {
  title: "Page not found — StudyLoop",
};

export default function NotFound() {
  return (
    <ErrorPage
      eyebrow="404"
      heading="This page doesn't exist."
      message="The link may be broken, or the page may have moved. Let's get you back on track."
    >
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
      <Button asChild variant="secondary">
        <Link href="/store">Browse the store</Link>
      </Button>
    </ErrorPage>
  );
}
