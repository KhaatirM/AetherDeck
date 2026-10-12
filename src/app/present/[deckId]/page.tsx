import type { Metadata } from "next";
import { PresentationPlayer } from "@/components/player/presentation-player";

export const metadata: Metadata = { title: "Presenting" };

export default async function PresentPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return <PresentationPlayer deckId={deckId} />;
}
