"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, FileText, CheckCircle2 } from "lucide-react";
import { api, DataError } from "./data";
import { FcGoogle } from "react-icons/fc";
import { useApp, useData } from "./context";
import { Draft, Duration, estimate, money, safeReturn } from "./model";
import { Gate, Heading, Photo, RouteLink, State } from "./ui";
import { Benefits } from "./public-pages";

export function Login() {
  const { locale, text: t } = useApp();
  const params = useSearchParams();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const next = safeReturn(params.get("next"), locale);
  function enter() {
    if (busy) return;
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
      setError(
        locale === "id"
          ? "Login Google belum dapat digunakan. Silakan coba lagi nanti."
          : "Google sign-in is currently unavailable. Please try again later.",
      );
      return;
    }
    try {
      localStorage.setItem("post_login_redirect", next);
      setBusy(true);
      // Full navigation is required for the external backend OAuth handshake.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`${base.replace(/\/$/, "")}/api/v1/auth/google`);
    } catch {
      setBusy(false);
      setError(
        locale === "id"
          ? "Tidak dapat membuka login Google. Silakan coba lagi."
          : "Unable to open Google sign-in. Please try again.",
      );
    }
  }
  return (
    <section className="pk-google-login">
      <div className="pk-google-panel">
        <h1>{locale === "id" ? "Masuk ke PohonKu" : "Sign in to PohonKu"}</h1>
        <p>
          {locale === "id"
            ? "Gunakan akun Google untuk melanjutkan adopsi dan melihat perkembangan pohonmu."
            : "Use your Google account to continue your adoption and follow your tree’s progress."}
        </p>
        <button
          type="button"
          className="pk-button pk-google-button"
          disabled={busy}
          onClick={() => void enter()}
        >
          <FcGoogle size={24} aria-hidden="true" />
          {busy ? t.processing : t.google}
        </button>
        {(error || params.has("error")) && (
          <p className="pk-login-error" role="alert">
            {error ||
              (locale === "id"
                ? "Login Google tidak berhasil. Silakan coba lagi."
                : "Google sign-in was unsuccessful. Please try again.")}
          </p>
        )}
        <RouteLink to="/privacy" className="pk-text-link">
          {t.privacy}
        </RouteLink>
      </div>
    </section>
  );
}

export function Checkout() {
  const params = useSearchParams();
  const orderId = params.get("order");
  return orderId ? (
    <Gate>
      <OrderPage id={orderId} />
    </Gate>
  ) : (
    <CheckoutDraft id={params.get("species") || ""} />
  );
}
function CheckoutDraft({ id }: { id: string }) {
  const { text: t, locale, user } = useApp(),
    params = useSearchParams(),
    router = useRouter();
  const result = useData(() => api.speciesById(id), [id]);
  const [draft, setDraft] = useState<Draft>({
      speciesId: id,
      duration: params.get("duration") === "3" ? 3 : 1,
      tag: "",
    }),
    [review, setReview] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(
          sessionStorage.getItem(`pk-draft-${id}`) || "null",
        );
        if (saved?.speciesId === id)
          setDraft({
            speciesId: id,
            duration:
              params.get("duration") === "3"
                ? 3
                : params.get("duration") === "1"
                  ? 1
                  : saved.duration === 3
                    ? 3
                    : 1,
            tag: typeof saved.tag === "string" ? saved.tag.slice(0, 30) : "",
          });
      } catch {
        /* Ignore corrupt draft. */
      }
    });
    return () => {
      active = false;
    };
  }, [id, params]);
  function update(patch: Partial<Draft>) {
    const next = { ...draft, ...patch };
    setDraft(next);
    sessionStorage.setItem(`pk-draft-${id}`, JSON.stringify(next));
    if (patch.duration) {
      const query = new URLSearchParams(params);
      query.set("duration", String(next.duration));
      router.replace(`/${locale}/checkout?${query}`, { scroll: false });
    }
  }
  async function submit() {
    if (lock.current) return;
    const returnPath = `/${locale}/checkout?species=${encodeURIComponent(id)}&duration=${draft.duration}`;
    if (!user) {
      router.push(`/${locale}/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      const order = await api.createOrder(draft);
      router.replace(
        `/${locale}/checkout?order=${encodeURIComponent(order.id)}`,
      );
    } catch (error) {
      setError(error as Error);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (!id)
    return (
      <div className="pk-state">
        <RouteLink to="/trees" className="pk-button">
          {t.explore}
        </RouteLink>
      </div>
    );
  if (result.loading || result.error || !result.data)
    return <State {...result} />;
  const s = result.data,
    available = s.stock !== null && s.stock > 0 && s.price !== null;
  return (
    <div className="pk-container pk-section">
      <Heading kicker={t.how} title={t.checkout} body={t.catalogueBody} />
      <div className="pk-two-col pk-align-start">
        <div className="pk-panel">
          <h2>{review ? t.summary : t.step2}</h2>
          {error && <State error={error} />}
          {review ? (
            <>
              <dl className="pk-facts">
                <dt>{t.step1}</dt>
                <dd>{s.name}</dd>
                <dt>{t.adoptionPeriod}</dt>
                <dd>
                  {draft.duration} {t.years}
                </dd>
                <dt>{t.tag}</dt>
                <dd>{draft.tag}</dd>
                <dt>{t.total}</dt>
                <dd>
                  {s.price === null
                    ? t.priceUnknown
                    : money(estimate(s.price, draft.duration), locale)}
                </dd>
              </dl>
              <button
                className="pk-button pk-wide"
                disabled={busy || !available}
                onClick={() => void submit()}
              >
                {busy ? t.processing : user ? t.continue : t.login}
                <ArrowRight size={18} />
              </button>
              <button
                className="pk-text-link"
                disabled={busy}
                onClick={() => setReview(false)}
              >
                {t.edit}
              </button>
            </>
          ) : (
            <form
              className="pk-stack"
              onSubmit={(e) => {
                e.preventDefault();
                update({ tag: draft.tag.trim() });
                setReview(true);
              }}
            >
              <label>
                {t.adoptionPeriod}
                <select
                  value={draft.duration}
                  onChange={(e) =>
                    update({ duration: Number(e.target.value) as Duration })
                  }
                >
                  <option value={1}>1 {t.year}</option>
                  <option value={3}>3 {t.years}</option>
                </select>
              </label>
              <label>
                {t.tag}
                <input
                  value={draft.tag}
                  maxLength={30}
                  required
                  pattern=".*\S.*"
                  aria-describedby="tag-hint"
                  onChange={(e) => update({ tag: e.target.value })}
                />
              </label>
              <p id="tag-hint" className="pk-note">
                {t.tagHint} ({draft.tag.length}/30)
              </p>
              <button className="pk-button" disabled={!available}>
                {t.review}
                <ArrowRight size={18} />
              </button>
            </form>
          )}
          {!available && (
            <p className="pk-notice">
              {s.stock === 0 ? t.soldOut : t.stockUnknown}
            </p>
          )}
        </div>
        <aside>
          <Photo src={s.image} alt={s.name} className="pk-checkout-photo" />
          <p className="pk-kicker">{s.category}</p>
          <h2>{s.name}</h2>
          <p className="pk-price">
            {s.price === null
              ? t.priceUnknown
              : money(estimate(s.price, draft.duration), locale)}
          </p>
          <p className="pk-note">{t.priceNote}</p>
          <Benefits />
        </aside>
      </div>
    </div>
  );
}

async function openPayment(token: string, done: () => void) {
  const key = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  if (!key) throw new DataError(503, "PAYMENT_NOT_CONFIGURED");
  if (!window.snap)
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.dataset.clientKey = key;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        reject(new DataError(503));
      };
      document.body.appendChild(script);
    });
  if (!window.snap) throw new DataError(503);
  window.snap.pay(token, {
    onSuccess: done,
    onPending: done,
    onError: done,
    onClose: done,
  });
}
function OrderPage({ id }: { id: string }) {
  const { text: t, locale } = useApp();
  const result = useData(() => api.order(id), [id]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null);
  // Poll the server, never infer a paid order from a payment popup callback.
  useEffect(() => {
    if (result.data?.status !== "PENDING") return;
    let checks = 0;
    const timer = window.setInterval(() => {
      if (++checks <= 12) result.retry();
      else window.clearInterval(timer);
    }, 10000);
    return () =>
      window.clearInterval(
        timer,
      ); /* polling is scoped to order identity/status */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, result.data?.status]);
  async function action(kind: "pay" | "cancel") {
    setBusy(true);
    setError(null);
    try {
      if (kind === "pay") {
        const p = await api.payment(id);
        const token = p.snapToken ?? p.token;
        if (typeof token !== "string") throw new DataError(502);
        await openPayment(token, result.retry);
      } else if (kind === "cancel") await api.cancel(id);
      result.retry();
    } catch (error) {
      setError(error as Error);
    } finally {
      setBusy(false);
    }
  }
  if (result.loading || result.error || !result.data)
    return <State {...result} />;
  const order = result.data;
  return (
    <div className="pk-container pk-section pk-narrow">
      <div className="pk-panel">
        <p className="pk-kicker">{order.number}</p>
        {order.status === "PAID" && <CheckCircle2 size={42} />}
        <h1>{t[order.status]}</h1>
        <p>
          {order.status === "PENDING"
            ? t.pendingHelp
            : order.status === "PAID"
              ? t.paidHelp
              : t.terminalHelp}
        </p>
        <dl className="pk-facts">
          <dt>{t.total}</dt>
          <dd>
            {order.total === null ? t.priceUnknown : money(order.total, locale)}
          </dd>
          <dt>{t.adoptionPeriod}</dt>
          <dd>
            {order.duration === null
              ? t.periodUnknown
              : `${order.duration} ${order.duration === 1 ? t.year : t.years}`}
          </dd>
          <dt>{t.tag}</dt>
          <dd>{order.tag || t.unavailable}</dd>
        </dl>
        {error && <State error={error} />}
        {order.status === "PENDING" && (
          <>
            <button
              className="pk-button"
              disabled={busy}
              onClick={() => void action("pay")}
            >
              {t.pay}
            </button>

            <div className="pk-actions">
              <button className="pk-text-link" onClick={result.retry}>
                {t.verify}
              </button>
              <button
                className="pk-text-link"
                disabled={busy}
                onClick={() => void action("cancel")}
              >
                {t.cancel}
              </button>
            </div>
          </>
        )}
        <div className="pk-actions">
          <RouteLink to="/dashboard" className="pk-button">
            {t.account}
            <ArrowRight size={18} />
          </RouteLink>
          {!["PAID", "PENDING"].includes(order.status) && (
            <RouteLink to="/trees" className="pk-text-link">
              {t.explore}
            </RouteLink>
          )}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <Gate>
      <DashboardContent />
    </Gate>
  );
}
function DashboardContent() {
  const [now] = useState(() => Date.now());
  const { text: t, locale } = useApp();
  const result = useData(async () => {
    const [adoptions, orders] = await Promise.all([
      api.adoptions(),
      api.orders(),
    ]);
    return { adoptions, orders };
  });
  return (
    <div className="pk-container pk-section">
      <Heading
        kicker={t.account}
        title={t.dashboardTitle}
        body={t.dashboardBody}
      />
      {result.loading || result.error || !result.data ? (
        <State {...result} />
      ) : (
        <>
          {result.data.orders.length > 0 && (
            <section className="pk-orders">
              <h2>{t.orders}</h2>
              {result.data.orders.map((order) => (
                <RouteLink
                  key={order.id}
                  to={`/checkout?order=${order.id}`}
                  className="pk-order-row"
                >
                  <span>
                    {order.number}
                    <small>{order.tag}</small>
                  </span>
                  <span className="pk-badge">{t[order.status]}</span>
                  <span>
                    {order.total === null
                      ? t.priceUnknown
                      : money(order.total, locale)}
                  </span>
                  <ArrowRight size={18} />
                </RouteLink>
              ))}
            </section>
          )}
          {result.data.adoptions.length ? (
            <>
              <h2>{t.myTrees}</h2>
              <div className="pk-grid-three">
                {result.data.adoptions.map((a) => (
                  <article className="pk-panel pk-adoption-card" key={a.id}>
                    <Leaf size={42} strokeWidth={1} />
                    <span className="pk-badge">
                      {!a.serial
                        ? t.allocation
                        : a.expiresAt
                          ? Date.parse(a.expiresAt) < now
                            ? t.ended
                            : t.active
                          : t.periodUnknown}
                    </span>
                    <h3>{a.speciesName}</h3>
                    <p>
                      {t.tag}: {a.tag}
                    </p>
                    <p className="pk-note">{a.serial || t.allocation}</p>
                    <RouteLink
                      to={`/dashboard/adoptions/${a.id}`}
                      className="pk-text-link"
                    >
                      {t.viewProgress}
                      <ArrowRight size={18} />
                    </RouteLink>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="pk-empty">
              <Leaf size={52} strokeWidth={1} />
              <h2>{t.emptyTitle}</h2>
              <p>{t.emptyBody}</p>
              <RouteLink to="/trees" className="pk-button">
                {t.explore}
                <ArrowRight size={18} />
              </RouteLink>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export function AdoptionDetail({ id }: { id: string }) {
  return (
    <Gate>
      <AdoptionContent id={id} />
    </Gate>
  );
}
function AdoptionContent({ id }: { id: string }) {
  const { text: t, locale } = useApp();
  const result = useData(() => api.adoption(id), [id]);
  const format = (date: string | null) =>
    date
      ? new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
          dateStyle: "long",
          timeZone: "Asia/Jakarta",
        }).format(new Date(date))
      : t.unavailable;
  if (result.loading || result.error || !result.data)
    return <State {...result} />;
  const a = result.data;
  return (
    <div className="pk-container pk-section">
      <RouteLink to="/dashboard" className="pk-text-link">
        ← {t.account}
      </RouteLink>
      <Heading
        kicker={a.serial || t.allocation}
        title={a.speciesName}
        body={`${t.tag}: ${a.tag}`}
      />
      <div className="pk-two-col pk-align-start">
        <div>
          <h2>{t.timeline}</h2>
          <dl className="pk-facts">
            <dt>{t.adopted}</dt>
            <dd>{format(a.adoptedAt)}</dd>
            <dt>{t.expires}</dt>
            <dd>{format(a.expiresAt)}</dd>
            <dt>{t.planted}</dt>
            <dd>{format(a.plantedAt)}</dd>
            <dt>{t.coords}</dt>
            <dd>
              {a.latitude !== null && a.longitude !== null
                ? `${a.latitude}, ${a.longitude}`
                : t.unavailable}
            </dd>
          </dl>
          {a.observations.length ? (
            <div className="pk-timeline">
              {a.observations.map((o) => (
                <article key={o.id}>
                  <time dateTime={o.date}>{format(o.date)}</time>
                  {o.photo && (
                    <Photo
                      src={o.photo}
                      alt={t.observationPhoto}
                      className="pk-observation-photo"
                    />
                  )}
                  <dl className="pk-facts">
                    <dt>{t.height}</dt>
                    <dd>
                      {o.height === null ? t.unavailable : `${o.height} cm`}
                    </dd>
                    <dt>{t.diameter}</dt>
                    <dd>
                      {o.diameter === null ? t.unavailable : `${o.diameter} cm`}
                    </dd>
                  </dl>
                  {locale === "en" && o.notes && (
                    <p className="pk-note">{t.notesId}</p>
                  )}
                  <p lang="id">{o.notes || t.unavailable}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="pk-notice">{t.observationEmpty}</p>
          )}
        </div>
        <aside className="pk-panel">
          <FileText size={38} strokeWidth={1} />
          <h2>{t.certificate}</h2>
          {a.certificate ? (
            <a
              className="pk-button"
              href={a.certificate}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.download}
            </a>
          ) : (
            <>
              <span className="pk-badge">{t.unavailable}</span>
              <p>{t.certNote}</p>
            </>
          )}
          <p className="pk-note">{t.serviceNote}</p>
          <Link
            href={`/${locale}/trees/${a.speciesId}`}
            className="pk-text-link"
          >
            {t.readStory}
            <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
