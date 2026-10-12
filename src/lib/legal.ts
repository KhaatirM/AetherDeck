export const COMPANY_NAME = "Ciberpointe Entertainments Inc.";

export interface LegalDocument {
  slug: string;
  title: string;
  summary: string;
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    summary: "The rules for using AetherDeck responsibly, including content you may not create or share.",
  },
  {
    slug: "cookies",
    title: "Cookie Notice",
    summary: "Which cookies and similar technologies AetherDeck uses, and why.",
  },
  {
    slug: "cookie-preferences",
    title: "Cookie Preferences",
    summary: "How to review and change the cookies you allow AetherDeck to use.",
  },
  {
    slug: "data-processing",
    title: "Data Processing Addendum",
    summary: "How we process personal data on behalf of customers and the safeguards that apply.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What information we collect, how we use it, and the choices you have.",
  },
  {
    slug: "subprocessors",
    title: "Subprocessors",
    summary: "The third-party service providers that help us operate AetherDeck.",
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "The agreement that governs your access to and use of AetherDeck.",
  },
  {
    slug: "third-party-terms",
    title: "Third Party Terms",
    summary: "Terms that apply to third-party software and services included in AetherDeck.",
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}
