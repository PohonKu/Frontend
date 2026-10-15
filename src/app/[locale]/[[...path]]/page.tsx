import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdopterApp from "@/features/adopter/app";
import { messages } from '@/features/adopter/messages';
import type { Metadata } from 'next';
export async function generateMetadata({ params }: { params: Promise<{ locale: string; path?: string[] }> }): Promise<Metadata> {
  const { locale, path = [] } = await params;
  if (locale !== 'id' && locale !== 'en') return {};
  const t = messages(locale);
  const titles: Record<string, string> = { trees: t.explore, login: t.login, checkout: t.summary, dashboard: t.account, 'how-it-works': t.how, about: t.about, faq: t.faq, contact: t.contact, privacy: t.privacy, terms: t.terms };
  const suffix = path.length ? '/' + path.join('/') : '';
  return { title: `${titles[path[0]] || t.hero} | PohonKu`, description: t.heroBody, alternates: { languages: { id: `/id${suffix}`, en: `/en${suffix}` } } };
}
const simplePages = [
  "login",
  "checkout",
  "how-it-works",
  "about",
  "faq",
  "contact",
  "privacy",
  "terms",
];
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; path?: string[] }>;
}) {
  const resolved = await params;
  const { locale } = resolved,
    path = resolved.path || [];
  if (locale !== "id" && locale !== "en") notFound();
  const valid =
    !path.length ||
    (simplePages.includes(path[0]) && path.length === 1) ||
    (path[0] === "trees" && path.length <= 2) ||
    (path[0] === "dashboard" &&
      (path.length === 1 || (path.length === 3 && path[1] === "adoptions")));
  if (!valid) notFound();
  return (
    <Suspense
      fallback={<p role="status">{locale === "id" ? "Memuat…" : "Loading…"}</p>}
    >
      <AdopterApp locale={locale} path={path} />
    </Suspense>
  );
}
