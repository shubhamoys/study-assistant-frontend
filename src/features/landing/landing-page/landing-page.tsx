import Link from "next/link";
import {
  Brain,
  ChatCircleText,
  NotePencil,
  ShieldCheck,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo/logo";
import { SiteHeader } from "@/components/site-header/site-header";
import styles from "./landing-page.module.scss";

const STEPS = [
  {
    number: "1",
    title: "Browse the store",
    description: "Free and premium decks across dozens of subjects.",
    image: "/screenshots/store.jpg",
  },
  {
    number: "2",
    title: "Add to your cart",
    description: "Pick a few premium decks and review them together.",
    image: "/screenshots/cart.jpg",
  },
  {
    number: "3",
    title: "Check out securely",
    description: "Card and UPI payments, handled entirely by Razorpay.",
    image: "/screenshots/checkout.jpg",
  },
  {
    number: "4",
    title: "Get instant access",
    description: "Your purchase lands straight in your library.",
    image: "/screenshots/order-confirmation.jpg",
  },
  {
    number: "5",
    title: "Study, and retain it",
    description: "Spaced repetition tells you exactly what to review, and when.",
    image: "/screenshots/study-session.jpg",
  },
];

const FEATURES = [
  {
    icon: ChatCircleText,
    title: "Ratings you can actually trust",
    description:
      "Every deck carries real reviews from people who studied it — see the rating before you commit your time.",
    image: "/screenshots/deck-detail-reviews.jpg",
  },
  {
    icon: NotePencil,
    title: "Build your own, with rich content",
    description:
      "Write flashcards in Markdown — code blocks, tables, and images included — and keep them private or export them to share.",
    image: "/screenshots/my-decks.jpg",
  },
  {
    icon: Storefront,
    title: "One library, fully organized",
    description:
      "Search, filter by subject or difficulty, and sort by what you last studied — everything you own, in one place.",
    image: "/screenshots/library.jpg",
  },
];

const QUICK_FACTS = [
  { icon: Brain, label: "FSRS spaced repetition" },
  { icon: ShieldCheck, label: "Secure Razorpay checkout" },
  { icon: NotePencil, label: "Markdown-powered decks" },
  { icon: ChatCircleText, label: "Ratings & reviews" },
];

export function LandingPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Spaced repetition, done right</span>
            <h1 className={styles.heroHeading}>
              Study smarter.
              <br />
              Remember longer.
            </h1>
            <p className={styles.heroSubheading}>
              StudyLoop is a flashcard platform built around a
              science-backed spaced-repetition engine. Browse a marketplace
              of ready-made decks, build your own with rich Markdown
              content, and let the algorithm decide exactly when you need
              to see a card again.
            </p>
            <div className={styles.heroActions}>
              <Button size="lg" asChild>
                <Link href="/register">Create a free account</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>

          <div className={styles.heroImage}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static local screenshot, no responsive/optimization needs beyond max-width:100% */}
            <img
              src="/screenshots/store.jpg"
              alt="Browsing the StudyLoop deck store"
              className={styles.heroImageEl}
            />
          </div>
        </section>

        <section className={styles.stepsSection}>
          <h2 className={styles.sectionHeading}>
            From browsing to remembering, in five steps
          </h2>
          <div className={styles.steps}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.step}>
                <div className={styles.stepImageFrame}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static local screenshot */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className={styles.stepImage}
                  />
                </div>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionHeading}>Everything a study habit needs</h2>
          <div className={styles.features}>
            {FEATURES.map((feature) => (
              <article key={feature.title} className={`${styles.feature} index-card`}>
                <div className={styles.featureImageFrame}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static local screenshot */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureBody}>
                  <feature.icon size={22} weight="bold" className={styles.featureIcon} />
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.factsRow}>
          {QUICK_FACTS.map((fact) => (
            <span key={fact.label} className={styles.fact}>
              <fact.icon size={16} weight="bold" />
              {fact.label}
            </span>
          ))}
        </section>

        <section className={styles.ctaBand}>
          <h2 className={styles.ctaHeading}>Ready to build your study loop?</h2>
          <p className={styles.ctaSubheading}>
            Free to join. Browse the store, add your first deck to your
            library, and start your first session today.
          </p>
          <Button size="lg" asChild className={styles.ctaButton}>
            <Link href="/register">Create a free account</Link>
          </Button>
        </section>

        <footer className={styles.footer}>
          <Logo height={24} />
          <p className={styles.footerTagline}>
            A spaced-repetition flashcard platform for retaining what you study.
          </p>
        </footer>
      </main>
    </>
  );
}
