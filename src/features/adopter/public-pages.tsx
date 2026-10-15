"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ForestHero,
  ProgrammeIntro,
  ProgrammeLocation,
  ProgrammeTeam,
  Conservation,
  themeImages,
} from "./brand";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  Tag,
  FileText,
  Activity,
} from "lucide-react";
import { api } from "./data";
import { useApp, useData } from "./context";
import { Duration, estimate, money, themes } from "./model";
import { Heading, Photo, Place, RouteLink, SpeciesCard, State } from "./ui";
export function Steps() {
  const { text: t } = useApp();
  return (
    <div className="pk-steps">
      {[
        [t.step1, t.step1Body],
        [t.step2, t.step2Body],
        [t.step3, t.step3Body],
      ].map(([title, body], i) => (
        <div key={title}>
          <span className="pk-step-number">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}
export function Benefits() {
  const { text: t } = useApp();
  return (
    <>
      <div className="pk-benefits">
        {[
          [Tag, t.tagBenefit],
          [Activity, t.updatesBenefit],
          [FileText, t.certBenefit],
        ].map(([Icon, label], i) => {
          const Symbol = Icon as typeof Tag;
          return (
            <div key={i}>
              <Symbol strokeWidth={1.4} />
              <span>{String(label)}</span>
            </div>
          );
        })}
      </div>
      <p className="pk-note">{t.serviceNote}</p>
    </>
  );
}
export function Questions({ short = false }: { short?: boolean }) {
  const { text: t } = useApp();
  return (
    <div className="pk-faq">
      {[
        [t.faq1, t.faq1Body],
        [t.faq2, t.faq2Body],
        [t.faq3, t.faq3Body],
        [t.faq4, t.faq4Body],
      ]
        .slice(0, short ? 3 : 4)
        .map(([title, body]) => (
          <details key={title}>
            <summary>
              {title}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{body}</p>
          </details>
        ))}
    </div>
  );
}
export function Home() {
  const { text: t } = useApp();
  const result = useData(() => api.species());
  return (
    <>
      <ForestHero />
      <ProgrammeIntro />
      <section className="pk-section pk-container">
        <div className="pk-theme-heading">
          <h2>{t.themesTitle}</h2>
          <p>{t.themesBody}</p>
        </div>
        <div className="pk-themes">
          {themes.map((theme, i) => {
            return (
              <RouteLink
                key={theme}
                to={`/trees?theme=${encodeURIComponent(theme)}`}
                className="pk-theme"
              >
                <div>
                  <Image src={themeImages[i]} width={100} height={100} alt="" />
                </div>
                <h3>{theme}</h3>
                <p>
                  {t[`theme${i}` as "theme0" | "theme1" | "theme2" | "theme3"]}
                </p>
                <ArrowUpRight size={19} />
              </RouteLink>
            );
          })}
        </div>
      </section>
      <section className="pk-section pk-tint">
        <div className="pk-container">
          <div className="pk-section-heading">
            <div>
              <h2>{t.selectionTitle}</h2>
            </div>
            <RouteLink to="/trees" className="pk-text-link">
              {t.all}
              <ArrowRight size={18} />
            </RouteLink>
          </div>
          {result.loading || result.error ? (
            <State {...result} />
          ) : !result.data?.length ? (
            <p className="pk-notice">{t.noResults}</p>
          ) : (
            <div className="pk-grid-three">
              {result.data?.slice(0, 3).map((s) => (
                <SpeciesCard key={s.id} species={s} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="pk-section pk-container">
        <h2>{t.stepsTitle}</h2>
        <Steps />
      </section>
      <section className="pk-care">
        <div className="pk-container pk-two-col">
          <div>
            <Sprout size={44} strokeWidth={1} />
            <h2>{t.careTitle}</h2>
            <p>{t.careBody}</p>
          </div>
          <Benefits />
        </div>
      </section>
      <ProgrammeLocation />
      <Conservation />
      <section className="pk-section pk-tint">
        <div className="pk-container pk-two-col">
          <div>
            <p className="pk-kicker">FAQ</p>
            <h2>{t.faq}</h2>
            <RouteLink to="/faq" className="pk-text-link">
              {t.faq}
              <ArrowRight size={18} />
            </RouteLink>
          </div>
          <Questions short />
        </div>
      </section>
    </>
  );
}
export function Catalogue() {
  const { text: t, locale } = useApp(),
    router = useRouter(),
    params = useSearchParams();
  const result = useData(() => api.species());
  const q = params.get("q") || "",
    theme = params.get("theme") || "";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/${locale}/trees?${next}`, { scroll: false });
  }
  const items =
    result.data?.filter(
      (s) =>
        s.name.toLowerCase().includes(q.toLowerCase()) &&
        (!theme || s.category === theme),
    ) || [];
  return (
    <div className="pk-container pk-section">
      <Heading title={t.catalogueTitle} body={t.catalogueBody} />
      <div className="pk-filters">
        <label>
          {t.search}
          <input
            type="search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder={t.search}
          />
        </label>
        <label>
          {t.theme}
          <select
            value={theme}
            onChange={(e) => update("theme", e.target.value)}
          >
            <option value="">{t.allThemes}</option>
            {themes.map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </select>
        </label>
        {(q || theme) && (
          <button
            className="pk-text-link"
            onClick={() =>
              router.replace(`/${locale}/trees`, { scroll: false })
            }
          >
            {t.clear}
          </button>
        )}
      </div>
      {result.loading || result.error ? (
        <State {...result} />
      ) : (
        <>
          <p className="pk-count" aria-live="polite">
            {items.length} {t.results}
          </p>
          {items.length ? (
            <div className="pk-grid-three">
              {items.map((s) => (
                <SpeciesCard key={s.id} species={s} />
              ))}
            </div>
          ) : (
            <div className="pk-state">
              <h2>{t.noResults}</h2>
              <p>{t.noResultsBody}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export function SpeciesDetail({ id }: { id: string }) {
  const { text: t, locale } = useApp(),
    [duration, setDuration] = useState<Duration>(1);
  const result = useData(() => api.speciesById(id), [id]);
  if (result.loading || result.error || !result.data)
    return <State {...result} />;
  const s = result.data;
  const available = s.stock !== null && s.stock > 0 && s.price !== null;
  return (
    <div className="pk-container pk-section">
      <RouteLink to="/trees" className="pk-text-link">
        ← {t.explore}
      </RouteLink>
      <div className="pk-detail-grid">
        <div>
          <Photo
            src={s.image}
            alt={s.name}
            className="pk-detail-photo"
            priority
          />

          <section className="pk-story">
            <h2>{t.storyTitle}</h2>
            {s.contentDraft && <p className="pk-notice">{t.draftContent}</p>}
            {locale !== s.storyLocale && s.story && (
              <p className="pk-note">{t.originalStory}</p>
            )}
            <p className="pk-story-copy" lang={s.storyLocale}>
              {s.story || t.storyMissing}
            </p>
            <h3>{t.ecology}</h3>
            <p>{s.description || t.unavailable}</p>
          </section>
        </div>
        <aside className="pk-detail-info">
          <p className="pk-kicker">{s.category}</p>
          <h1>{s.name}</h1>
          <p className="pk-latin">
            {s.latinName || `${t.latin}: ${t.unavailable}`}
          </p>
          <Place />
          <div className="pk-divider" />
          <label>
            {t.adoptionPeriod}
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) as Duration)}
            >
              <option value={1}>1 {t.year}</option>
              <option value={3}>3 {t.years}</option>
            </select>
          </label>
          <p className="pk-note">{t.estimate}</p>
          <p className="pk-price">
            {s.price === null
              ? t.priceUnknown
              : money(estimate(s.price, duration), locale)}
          </p>
          <p className="pk-note">{t.priceNote}</p>
          {available ? (
            <RouteLink
              to={`/checkout?species=${encodeURIComponent(id)}&duration=${duration}`}
              className="pk-button pk-wide"
            >
              {t.adopt}
              <ArrowUpRight size={18} />
            </RouteLink>
          ) : (
            <p className="pk-notice">
              {s.stock === 0 ? t.soldOut : t.stockUnknown}
            </p>
          )}
          <div className="pk-divider" />
          <Benefits />
        </aside>
      </div>
    </div>
  );
}
export function InfoPage({ page }: { page: string }) {
  const { text: t } = useApp();
  if (page === "how-it-works")
    return (
      <div className="pk-container pk-section">
        <Heading kicker={t.how} title={t.stepsTitle} body={t.catalogueBody} />
        <Steps />
        <div className="pk-panel">
          <h2>{t.careTitle}</h2>
          <Benefits />
        </div>
        <Questions />
        <RouteLink to="/trees" className="pk-button">
          {t.explore}
          <ArrowRight size={18} />
        </RouteLink>
      </div>
    );
  if (page === "about")
    return (
      <>
        <ProgrammeIntro />
        <ProgrammeLocation />
        <ProgrammeTeam />
        <Conservation />
      </>
    );
  if (page === "faq")
    return (
      <div className="pk-container pk-section pk-narrow">
        <Heading title={t.faq} />
        <Questions />
      </div>
    );
  return (
    <div
      className={`pk-container pk-section pk-narrow ${page === "contact" ? "pk-contact-page" : ""}`}
    >
      <Heading
        title={
          page === "contact"
            ? t.contactTitle
            : page === "privacy"
              ? t.privacy
              : t.terms
        }
        body={page === "contact" ? t.contactBody : t.policyBody}
      />
      <p className="pk-notice">{t.unavailable}</p>
      <RouteLink to="/faq" className="pk-text-link">
        {t.faq}
        <ArrowRight size={18} />
      </RouteLink>
    </div>
  );
}
