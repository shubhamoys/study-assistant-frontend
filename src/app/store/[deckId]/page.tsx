import type { Metadata } from "next";
import { DeckDetail } from "@/features/store/deck-detail/deck-detail";

export const metadata: Metadata = {
  title: "Deck — StudyLoop",
};

interface DeckPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { deckId } = await params;
  return <DeckDetail deckId={deckId} />;
}
