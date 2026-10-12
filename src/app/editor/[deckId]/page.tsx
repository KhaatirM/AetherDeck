import type { Metadata } from "next";
import { EditorWorkspace } from "@/components/editor/editor-workspace";

export const metadata: Metadata = { title: "Editor" };

export default async function EditorPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return <EditorWorkspace deckId={deckId} />;
}
