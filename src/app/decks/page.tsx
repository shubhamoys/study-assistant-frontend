import type { Metadata } from "next";
import { DecksList } from "@/features/decks/decks-list/decks-list";

export const metadata: Metadata = {
  title: "My Decks — AI Study Assistant",
};

export default function DecksPage() {
  return <DecksList />;
}
