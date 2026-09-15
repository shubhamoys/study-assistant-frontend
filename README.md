# StudyLoop — Web App

The main, consumer-facing web app for **StudyLoop**, a spaced-repetition flashcard platform. Users can browse a marketplace of decks, save them to a personal library, study with a science-backed spaced-repetition algorithm (FSRS), build and sell their own decks with rich Markdown content, and purchase premium decks.

This is a [Next.js](https://nextjs.org/) (App Router) frontend. It's one of three projects that make up StudyLoop:

- **`study-assistant-backend`** — the GraphQL API this app talks to. **You need this running first.**
- **`study-assistant-admin-frontend`** — the separate admin panel (not needed to use this app as a regular user).

If you haven't set up the backend yet, do that first — see its own README — then come back here.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), React 19 |
| Language | TypeScript |
| Data fetching | [Apollo Client](https://www.apollographql.com/docs/react) (GraphQL) |
| State | Redux Toolkit (auth session state, persisted to `localStorage`) |
| Styling | SCSS Modules for page/feature UI, [Tailwind CSS v4](https://tailwindcss.com/) for design tokens + [shadcn/ui](https://ui.shadcn.com/) primitives (Radix-based) |
| Forms | React Hook Form + [Zod](https://zod.dev/) validation |
| Rich text | `@uiw/react-md-editor` for writing, `react-markdown` (+ `remark-gfm`, `rehype-sanitize`, `rehype-highlight`) for rendering — supports Markdown, tables, code blocks, and images |
| Theming | `next-themes` (light/dark, system-aware) |
| Icons | [Phosphor Icons](https://phosphoricons.com/) |

## Prerequisites

- **[Node.js](https://nodejs.org/) 20 or later** and npm
- **The backend (`study-assistant-backend`) running** — see that project's README. By default this app expects it at `http://localhost:4000`.

## Setup — from cloning to running

**1. Clone the repo and install dependencies**

```bash
git clone <this-repository-url>
cd study-assistant-frontend
npm install
```

**2. Create your environment file**

```bash
cp .env.example .env.local
```

The default value (`NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql`) already matches the backend's default setup — you shouldn't need to change anything unless you moved the backend to a different port or host.

**3. Start the dev server**

```bash
npm run dev
```

Open **http://localhost:3000**. You should see the StudyLoop marketing/landing page.

**4. Log in**

You have two options:

- **Register a brand-new account** via "Create a free account" on the landing page — you'll need to verify your email (or grab the verification link from the backend's terminal output if you haven't configured Mailtrap there).
- **Use a seeded demo account** from the backend's seed data: `john.doe@studyloop.dev` or `marcus.demo@studyloop.dev`, password = whatever `SEED_REVIEWER_PASSWORD` was set to in the backend's `.env`. These accounts already have some reviews under their name.

Once logged in, you land on your Library. From there: browse the **Store** for seeded decks, add free ones directly or paid ones to your **Cart** and check out (needs Razorpay test keys configured on the backend), create your own deck under **My Decks**, and **Study** anything in your library.

## Important commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (hot reload) at `http://localhost:3000` |
| `npm run build` | Production build (also type-checks the whole project) |
| `npm run start` | Run the production build (`npm run build` first) |
| `npm run lint` | ESLint |

There's no separate `test`/`test:e2e` script in this project — testing was done manually in the browser throughout development (see the backend's README for its automated e2e suite, which covers the shared GraphQL API this app calls).

## Testing on a phone, on the same Wi-Fi

Optional, only if you want to try the app on a real mobile device during development:

1. Find your machine's LAN IP (Windows PowerShell: `Get-NetIPAddress -AddressFamily IPv4`, look at the Wi-Fi adapter).
2. Set `NEXT_PUBLIC_GRAPHQL_URL=http://<that-ip>:4000/graphql` in `.env.local` (not `localhost` — your phone can't resolve that).
3. `next.config.ts`'s `allowedDevOrigins` already covers the common `192.168.*.*` home-network range — widen it if you're on a different subnet (e.g. `10.*.*.*`).
4. Start the dev server bound to all interfaces: `npx next dev -H 0.0.0.0`.
5. On your phone, visit `http://<that-ip>:3000`.

The backend needs no changes for this — it already allows any private-network (LAN) origin automatically in development.

## Troubleshooting

- **Every page shows a generic "couldn't load" error, or GraphQL calls fail** — the backend isn't running, or `NEXT_PUBLIC_GRAPHQL_URL` in `.env.local` doesn't match where it's actually listening. Confirm the backend is up by visiting `http://localhost:4000/graphql` directly.
- **Login/register works but the checkout "Pay" step fails** — the backend needs valid Razorpay test-mode API keys configured; see its README.
- **Registered but never got a verification email** — check the backend's terminal output; if Mailtrap isn't configured there, the email content (including the link) is logged to the console instead of actually sent.

## Running the full project

See `study-assistant-backend`'s README for the full three-project setup (clone order, expected folder layout, port assignments). In short: this app expects to live as a sibling folder to `study-assistant-backend` and `study-assistant-admin-frontend`, running on port 3000 while they run on 4000 and 3001 respectively.
