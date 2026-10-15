"use client";
import { Provider } from "./context";
import { Locale } from "./model";
import { Shell } from "./ui";
import { Home, Catalogue, SpeciesDetail, InfoPage } from "./public-pages";
import { Login, Checkout, Dashboard, AdoptionDetail } from "./account-pages";
import "./styles.css";
export default function AdopterApp({
  locale,
  path,
}: {
  locale: Locale;
  path: string[];
}) {
  const [page, id, adoptionId] = path;
  const content = !page ? (
    <Home />
  ) : page === "trees" ? (
    id ? (
      <SpeciesDetail key={id} id={id} />
    ) : (
      <Catalogue />
    )
  ) : page === "login" ? (
    <Login />
  ) : page === "checkout" ? (
    <Checkout />
  ) : page === "dashboard" ? (
    id === "adoptions" && adoptionId ? (
      <AdoptionDetail id={adoptionId} />
    ) : (
      <Dashboard />
    )
  ) : (
    <InfoPage page={page} />
  );
  return (
    <Provider locale={locale}>
      <Shell>{content}</Shell>
    </Provider>
  );
}
