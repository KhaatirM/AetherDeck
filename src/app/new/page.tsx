import type { Metadata } from "next";
import type { TemplatePreset } from "@/types/deck";
import { CreateFlow } from "@/components/create/create-flow";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = { title: "New deck" };

function isTemplate(value: string | undefined): value is TemplatePreset {
  return TEMPLATES.some((t) => t.id === value);
}

export default async function NewDeckPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string; template?: string }>;
}) {
  const { prompt, template } = await searchParams;
  return (
    <CreateFlow
      initialPrompt={prompt?.trim() || undefined}
      initialTemplate={isTemplate(template) ? template : undefined}
    />
  );
}
