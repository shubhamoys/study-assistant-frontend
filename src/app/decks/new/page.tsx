import type { Metadata } from "next";
import { CreateDeckPage } from "@/features/decks/create-deck-page/create-deck-page";

export const metadata: Metadata = {
  title: "Create Deck — AI Study Assistant",
};

export default function NewDeckPage() {
  return <CreateDeckPage />;
}
