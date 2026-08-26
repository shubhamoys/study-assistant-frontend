import type { Metadata } from "next";
import { Fragment_Mono, Fraunces, Lexend } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

// Display/heading font — see UI_UX_DESIGN.md §3.1. Variable font with the
// optical-size axis so headings keep their "ink-stamped" character at every size.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: "variable",
  axes: ["opsz"],
});

// Body/UI font — chosen for reading-fluency research, not aesthetics alone.
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700"],
});

// Code / math / timers.
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-fragment-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "AI Study Assistant",
  description:
    "A spaced-repetition flashcard platform for retaining what you study.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${lexend.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
