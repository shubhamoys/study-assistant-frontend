"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="flex flex-1 flex-col items-center gap-12 px-6 py-16 sm:py-24">
      <header className="flex w-full max-w-3xl items-center justify-between">
        <span className="stamp">Setup Preview</span>
        <ThemeToggle />
      </header>

      <main className="flex w-full max-w-3xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl font-bold italic tracking-tight sm:text-5xl">
            AI Study Assistant
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Project scaffolding is wired up — theme, database, and API. Phase
            1 work starts from here.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="tag">Field Notes Brutalism</span>
          <span className="tag bg-brand-yellow">Warm Paper / Inkboard</span>
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

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="neo-interactive bg-rating-again px-3 py-3 font-sans text-sm font-bold text-rating-text uppercase">
            Again
          </button>
          <button className="neo-interactive bg-rating-hard px-3 py-3 font-sans text-sm font-bold text-rating-text uppercase">
            Hard
          </button>
          <button className="neo-interactive bg-rating-good px-3 py-3 font-sans text-sm font-bold text-rating-text uppercase">
            Good
          </button>
          <button className="neo-interactive bg-rating-easy px-3 py-3 font-sans text-sm font-bold text-rating-text uppercase">
            Easy
          </button>
        </div>
      </main>
    </div>
  );
}
