import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/brand/site-nav";
import { SiteFooter } from "@/components/marketing/closing";
import { COMPANY_NAME, LEGAL_DOCUMENTS, getLegalDocument } from "@/lib/legal";
import { cn } from "@/lib/utils";

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return LEGAL_DOCUMENTS.map((doc) => ({ slug: doc.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDocument(slug);
  return { title: doc?.title ?? "Legal" };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const doc = getLegalDocument(slug);
  if (!doc) notFound();

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <SiteNav />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" aria-hidden>
        <div className="bg-dot-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute left-1/2 top-[-220px] h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,0.18),transparent)]" />
      </div>

      <main className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-32 pt-36 md:grid-cols-[220px_1fr]">
        <nav aria-label="Legal documents" className="md:sticky md:top-28 md:self-start">
          <div className="mb-3 text-[12px] font-medium text-fg-secondary">Legal</div>
          <ul className="flex flex-col gap-0.5">
            {LEGAL_DOCUMENTS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/legal/${item.slug}`}
                  aria-current={item.slug === doc.slug ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                    item.slug === doc.slug
                      ? "bg-white/[0.06] text-fg-primary"
                      : "text-fg-tertiary hover:text-fg-primary"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-tertiary">Legal</div>
          <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] text-gradient sm:text-[52px]">
            {doc.title}
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-fg-secondary">{doc.summary}</p>

          <div className="mt-12 rounded-2xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
            <div className="flex items-center gap-2 text-[13px] font-medium text-fg-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(124,108,255,0.8)]" />
              Being finalized
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-fg-secondary">
              The full {doc.title} for AetherDeck is being prepared by {COMPANY_NAME} and will be
              published here before general availability.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
