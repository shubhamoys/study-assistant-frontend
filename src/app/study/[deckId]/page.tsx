import type { Metadata } from "next";
import { StudySession } from "@/features/study/study-session/study-session";

export const metadata: Metadata = {
  title: "Study — StudyLoop",
};

interface StudyPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { deckId } = await params;
  return <StudySession deckId={deckId} />;
}
