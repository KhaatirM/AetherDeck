import { SiteNav } from "@/components/brand/site-nav";
import { Hero } from "@/components/marketing/hero";
import { TierShowcase } from "@/components/marketing/tier-showcase";
import { FeatureBento } from "@/components/marketing/feature-bento";
import { Workflow } from "@/components/marketing/workflow";
import { TemplateStrip } from "@/components/marketing/template-strip";
import { ClosingCta, SiteFooter } from "@/components/marketing/closing";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <SiteNav />
      <main>
        <Hero />
        <TierShowcase />
        <FeatureBento />
        <Workflow />
        <TemplateStrip />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
