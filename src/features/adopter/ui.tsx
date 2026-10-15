"use client";
import Link from "next/link";
import { PageMotion } from "./motion";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { ArrowUpRight, ArrowRight, Menu, X, Leaf, MapPin } from "lucide-react";
import { DataError } from "./data";
import { useApp } from "./context";
import { Species, money } from "./model";
export function RouteLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  const { locale } = useApp();
  return (
    <Link className={className} href={`/${locale}${to}`}>
      {children}
    </Link>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const { locale, text: t, user, logout } = useApp();
  const path = usePathname(),
    search = useSearchParams();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const home = /^\/(id|en)$/.test(path);
  const menu = menuPath === path;
  const setMenu = (open: boolean) => setMenuPath(open ? path : null);
  const other =
    path.replace(/^\/(id|en)/, locale === "id" ? "/en" : "/id") +
    (search.toString() ? `?${search}` : "");
  return (
    <div className="pk">
      <a className="pk-skip" href="#pk-content">
        {t.skip}
      </a>
      <header
        className={`pk-header ${home && !scrolled && !menu ? "pk-header-clear" : ""}`}
      >
        <div className="pk-nav">
          <RouteLink to="" className="pk-logo">
            <Image
              src="/images/Logo.svg"
              width={170}
              height={99}
              alt="PohonKu"
              priority
              loading="eager"
            />
          </RouteLink>
          <button
            className="pk-menu"
            aria-label={menu ? t.close : t.menu}
            aria-expanded={menu}
            aria-controls="pk-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            id="pk-navigation"
            className={menu ? "is-open" : ""}
            aria-label={t.menu}
          >
            <RouteLink to="/trees">{t.explore}</RouteLink>
            <RouteLink to="/how-it-works">{t.how}</RouteLink>
            <RouteLink to="/about">{t.about}</RouteLink>
            <RouteLink to="/faq">{t.faq}</RouteLink>
          </nav>
          <div className="pk-nav-actions">
            <Link
              href={other}
              hrefLang={locale === "id" ? "en" : "id"}
              className="pk-language"
              aria-label={
                locale === "id"
                  ? "Switch to English"
                  : "Ganti ke Bahasa Indonesia"
              }
            >
              {locale === "id" ? "EN" : "ID"}
            </Link>
            <RouteLink
              to={user ? "/dashboard" : "/login"}
              className="pk-button pk-small"
            >
              {user ? t.account : t.login}
              <ArrowUpRight size={15} />
            </RouteLink>
          </div>
        </div>
      </header>
      <PageMotion>
        <div
          id="pk-content"
          tabIndex={-1}
          className={home ? "pk-home-content" : "pk-page-content"}
        >
          {children}
        </div>
        <footer className="pk-footer">
          <div className="pk-container pk-footer-grid">
            <div>
              <Image
                src="/images/Logo.svg"
                width={165}
                height={96}
                alt="PohonKu"
              />
              <p>{t.footerBody}</p>
              <span className="pk-kicker">TAHURA BUNDER · YOGYAKARTA</span>
            </div>
            <div>
              <RouteLink to="/trees">{t.explore}</RouteLink>
              <RouteLink to="/how-it-works">{t.how}</RouteLink>
              <RouteLink to="/about">{t.about}</RouteLink>
            </div>
            <div>
              <RouteLink to="/faq">{t.faq}</RouteLink>
              <RouteLink to="/contact">{t.contact}</RouteLink>
              <RouteLink to="/about#team">
                {locale === "id" ? "Tim pengembang" : "Our team"}
              </RouteLink>
              <RouteLink to="/privacy">{t.privacy}</RouteLink>
              <RouteLink to="/terms">{t.terms}</RouteLink>
            </div>
          </div>
          <div className="pk-container pk-footer-bottom">
            <span>© {new Date().getFullYear()} PohonKu</span>
            {user && <button onClick={logout}>{t.logout}</button>}
            <span>
              {locale === "id"
                ? "Fakultas Kehutanan UGM & Tim DTETI / IT"
                : "UGM Faculty of Forestry & DTETI / IT team"}
            </span>
          </div>
        </footer>
      </PageMotion>
    </div>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const { text: t } = useApp();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <div className={`pk-photo ${className}`}>
      {src && src !== failedSrc ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 720px) 100vw, 50vw"
          unoptimized
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className="pk-placeholder">
          <Leaf strokeWidth={0.8} size={64} aria-hidden="true" />
          <span>{t.noImage}</span>
        </div>
      )}
    </div>
  );
}
export function SpeciesCard({ species: s }: { species: Species }) {
  const { text: t, locale } = useApp();
  return (
    <article className="pk-tree-card">
      <RouteLink to={`/trees/${s.id}`} className="pk-card-photo">
        <Photo src={s.image} alt={s.name} />
        <span className="pk-card-arrow">
          <ArrowUpRight size={23} />
        </span>
      </RouteLink>
      <div className="pk-card-copy">
        <span className="pk-kicker">{s.category}</span>
        <h3>
          <RouteLink to={`/trees/${s.id}`}>{s.name}</RouteLink>
        </h3>
        <p className="pk-muted">
          {s.latinName || t.latin + ": " + t.unavailable}
        </p>
        <p className="pk-card-story" lang={s.story ? s.storyLocale : locale}>
          {s.story
            ? s.story.slice(0, 115) + (s.story.length > 115 ? "…" : "")
            : t.storyMissing}
        </p>
        {s.story && locale !== s.storyLocale && (
          <p className="pk-note">{t.originalStory}</p>
        )}
        <div className="pk-card-bottom">
          <span>
            {s.price === null ? (
              t.priceUnknown
            ) : (
              <>
                {t.from} <strong>{money(s.price, locale)}</strong>
                <small> / 1 {t.year}</small>
              </>
            )}
          </span>
          <span className={`pk-stock ${s.stock === 0 ? "is-empty" : ""}`}>
            {s.stock === null
              ? t.unavailable
              : s.stock === 0
                ? t.soldOut
                : t.available}
          </span>
        </div>
        <RouteLink to={`/trees/${s.id}`} className="pk-button">
          {t.readStory}
        </RouteLink>
      </div>
    </article>
  );
}
export function Heading({
  kicker,
  title,
  body,
}: {
  kicker?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="pk-heading">
      {kicker && <p className="pk-page-label">{kicker}</p>}
      <h1>{title}</h1>
      {body && <p className="pk-lead">{body}</p>}
    </div>
  );
}
export function State({
  error,
  loading,
  retry,
}: {
  error?: Error | null;
  loading?: boolean;
  retry?: () => void;
}) {
  const { text: t } = useApp();
  const path = usePathname(),
    query = useSearchParams();
  const status = error instanceof DataError ? error.status : 0;
  return (
    <div className="pk-state" role={error ? "alert" : "status"}>
      {loading ? (
        <>
          <span className="pk-spinner" />
          {t.loading}
        </>
      ) : (
        <>
          <Leaf size={36} />
          <h2>
            {status === 404
              ? t.notFound
              : status === 403
                ? t.forbidden
                : status === 401
                  ? t.sessionExpired
                  : status === 400 || status === 422 || status === 409
                    ? t.invalid
                    : t.errorTitle}
          </h2>
          {status === 401 ? (
            <RouteLink
              to={`/login?next=${encodeURIComponent(path + (query.toString() ? `?${query}` : ""))}`}
              className="pk-button"
            >
              {t.login}
            </RouteLink>
          ) : (
            <>
              {status >= 500 || status === 0 ? <p>{t.errorBody}</p> : null}
              {retry && (
                <button className="pk-button pk-outline" onClick={retry}>
                  {t.retry}
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
export function Gate({ children }: { children: ReactNode }) {
  const { ready, user, authError, refreshUser, text: t, locale } = useApp();
  const path = usePathname(),
    params = useSearchParams();
  if (!ready) return <State loading />;
  if (authError)
    return <State error={authError} retry={() => void refreshUser()} />;
  if (!user)
    return (
      <div className="pk-container pk-state">
        <h1>{t.loginRequired}</h1>
        <Link
          className="pk-button"
          href={`/${locale}/login?next=${encodeURIComponent(path + (params.toString() ? `?${params}` : ""))}`}
        >
          {t.login}
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  return <>{children}</>;
}
export function Place() {
  const { text: t } = useApp();
  return (
    <span className="pk-place">
      <MapPin size={15} />
      {t.eyebrow}
    </span>
  );
}
