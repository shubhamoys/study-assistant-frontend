"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { SiteHeader } from "@/components/site-header/site-header";

const HEALTH_QUERY = gql`
  query Health {
    health {
      status
      database
      timestamp
    }
  }
`;

interface HealthQueryResult {
  health: { status: string; database: string; timestamp: string };
}

export default function Home() {
  const { data, loading, error } = useQuery<HealthQueryResult>(HEALTH_QUERY);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center gap-12 px-6 py-16 sm:py-24">
        <main className="flex w-full max-w-3xl flex-col items-center gap-10 text-center">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-4xl font-bold italic tracking-tight sm:text-5xl">
              AI Study Assistant
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Authentication, Store, and Library are live. Study is next.
            </p>
          </div>

          <div className="index-card w-full text-left">
            <p className="mb-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Backend status
            </p>
            {loading && <p className="font-display text-lg italic">Checking API…</p>}
            {error && (
              <p className="font-display text-lg text-state-error">
                API unreachable — is study-assistant-backend running?
              </p>
            )}
            {data && (
              <p className="font-display text-xl font-semibold">
                GraphQL: {data.health.status} · Database: {data.health.database}
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
