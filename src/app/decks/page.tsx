import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { DecksDashboard } from "@/components/dashboard/decks-dashboard";

export const metadata: Metadata = { title: "Decks" };

export default function DecksPage() {
  return (
    <AppShell>
      <DecksDashboard />
    </AppShell>
  );
}
