"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useApp } from "./context";
import { RouteLink } from "./ui";
gsap.registerPlugin(useGSAP);
const photos = [
  "photo-1542273917363-3b1817f69a2d",
  "photo-1448375240586-882707db888b",
  "photo-1511497584788-876760111969",
];
export const themeImages = [
  "Perspektif Keistimewaan",
  "Toponimi Gunkid",
  "Native Karst",
  "Sumbu Filosofi",
].map((name) => `/gambarCici/Icon Pohonku/Icon Pohonku/${name}.svg`);
export function ForestHero() {
  const { locale, text: t } = useApp();
  const id = locale === "id";
  const [slide, setSlide] = useState(0),
    [focused, setFocused] = useState(false),
    [hidden, setHidden] = useState(false),
    [reduced, setReduced] = useState(true);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    update();
    visibility();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (focused || hidden || reduced) return;
    const timer = setInterval(() => setSlide((n) => (n + 1) % 3), 8000);
    return () => clearInterval(timer);
  }, [focused, hidden, reduced]);
  useGSAP(
    () => {
      gsap.to(".pk-hero-slide", {
        opacity: (i) => (i === slide ? 1 : 0),
        duration: reduced ? 0 : 0.8,
        overwrite: true,
      });
    },
    { scope: root, dependencies: [slide, reduced] },
  );
  return (
    <section
      ref={root}
      className="pk-forest-hero"
      aria-label={
        id ? "PohonKu: Adopsi Tanaman Langka" : "PohonKu: Rare Tree Adoption"
      }
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="pk-hero-images" aria-hidden="true">
        {photos.map((photo, i) => (
          <div
            className="pk-hero-slide"
            key={photo}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1920&q=85`}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      <div className="pk-forest-overlay" />
      <div className="pk-forest-content">
        <h1>
          PohonKu
          <span>{id ? "Adopsi Tanaman Langka" : "Rare Tree Adoption"}</span>
        </h1>
        <p>{t.heroBody}</p>
        <div className="pk-actions">
          <RouteLink to="/trees" className="pk-button pk-light">
            {t.explore}
          </RouteLink>
          <RouteLink to="/about" className="pk-button pk-hero-secondary">
            {t.about}
          </RouteLink>
        </div>
      </div>
    </section>
  );
}
export function ProgrammeIntro() {
  const { locale } = useApp();
  const id = locale === "id";
  return (
    <section className="pk-section pk-container pk-programme-intro">
      <div>
        <h2>{id ? "Tentang PohonKu" : "About PohonKu"}</h2>
        <p>
          {id
            ? "PohonKu merupakan program konservasi yang diinisiasi oleh Fakultas Kehutanan, Universitas Gadjah Mada, untuk mendukung pelestarian jenis pohon lokal melalui penanaman, pemeliharaan, dan pemantauan pohon."
            : "PohonKu is a conservation programme initiated by the Faculty of Forestry, Universitas Gadjah Mada, to preserve local tree species through planting, maintenance and monitoring."}
        </p>
        <p>
          {id
            ? "Melalui adopsi pohon, masyarakat dapat ikut melestarikan keanekaragaman hayati, termasuk jenis lokal seperti Bendo, Gayam, dan Katimoho, serta mendukung keberlanjutan ekosistem hutan bagi generasi mendatang."
            : "Through tree adoption, the public can support biodiversity conservation, including local species such as Bendo, Gayam and Katimoho, and help sustain forest ecosystems for future generations."}
        </p>
      </div>
      <div className="pk-vision-panel">
        <h3>{id ? "Visi" : "Our vision"}</h3>
        <p>
          {id
            ? "Menjadi platform adopsi tanaman langka terpercaya dalam pelestarian lingkungan di Indonesia."
            : "To be a trusted rare-tree adoption platform supporting environmental conservation in Indonesia."}
        </p>
        <h3>{id ? "Misi" : "Our mission"}</h3>
        <ul>
          <li>
            {id
              ? "Melestarikan jenis pohon lokal."
              : "Preserve local tree species."}
          </li>
          <li>
            {id
              ? "Menghubungkan masyarakat dengan kegiatan konservasi."
              : "Connect communities with conservation."}
          </li>
          <li>
            {id
              ? "Mendukung penanaman, pemeliharaan, dan pemantauan pohon."
              : "Support tree planting, care and monitoring."}
          </li>
        </ul>
      </div>
    </section>
  );
}
export function ProgrammeLocation() {
  const { locale } = useApp();
  const id = locale === "id";
  return (
    <section className="pk-section pk-container pk-location" id="project-area">
      <div>
        <h2>{id ? "Lokasi program" : "Programme location"}</h2>
        <h3>Tahura Bunder, Gunungkidul</h3>
        <p>
          {id
            ? "Kegiatan PohonKu berlokasi di Tahura Bunder, Gunungkidul. Area awal program mencakup sekitar 3 hektare, dengan rencana perluasan."
            : "PohonKu is based at Tahura Bunder in Gunungkidul. The programme initially covers approximately 3 hectares, with plans for expansion."}
        </p>
        <div className="pk-tahura-photo">
          <Image
            src="/images/bgTahuraHeader.svg"
            alt={id ? "Gerbang Tahura Bunder" : "Tahura Bunder entrance"}
            width={900}
            height={280}
          />
        </div>
      </div>
      <Image
        className="pk-map"
        src="/images/Map.svg"
        width={730}
        height={544}
        alt={
          id
            ? "Peta lokasi Tahura Bunder di Pulau Jawa"
            : "Map showing Tahura Bunder on Java"
        }
      />
    </section>
  );
}
export function Conservation() {
  const { locale } = useApp();
  const id = locale === "id";
  return (
    <section className="pk-section pk-container pk-conservation">
      <Image
        src="/images/SDG13.svg"
        width={160}
        height={160}
        alt="SDG 13: Climate Action"
      />
      <div>
        <h2>
          {id
            ? "Pelestarian untuk generasi mendatang"
            : "Conservation for future generations"}
        </h2>
        <p>
          {id
            ? "Penanaman, pemeliharaan, dan pemantauan pohon merupakan bagian dari upaya menjaga keberlanjutan ekosistem hutan. PohonKu membuka kesempatan bagi masyarakat untuk terlibat dalam kegiatan ini."
            : "Planting, maintaining and monitoring trees help sustain forest ecosystems. PohonKu offers the public a way to take part in this work."}
        </p>
      </div>
    </section>
  );
}
export function ProgrammeTeam() {
  const { locale } = useApp();
  const id = locale === "id";
  return (
    <section className="pk-section pk-team" id="team">
      <div className="pk-container">
        <h2>{id ? "Tim di balik PohonKu" : "The people behind PohonKu"}</h2>
        <div className="pk-team-grid">
          {[
            {
              title: id ? "Tim Fakultas Kehutanan" : "Faculty of Forestry team",
              body: id
                ? "Fakultas Kehutanan, Universitas Gadjah Mada — penggagas program konservasi PohonKu."
                : "Faculty of Forestry, Universitas Gadjah Mada — initiator of the PohonKu conservation programme.",
            },
            {
              title: id ? "Tim DTETI / IT" : "DTETI / IT team",
              body: id
                ? "Tim desain UI/UX dan pengembangan website PohonKu."
                : "The team responsible for PohonKu’s UI/UX design and website development.",
            },
          ].map((team) => (
            <article key={team.title}>
              <div className="pk-team-frame" aria-hidden="true">
                <Image
                  src="/images/RectangleFoto.svg"
                  width={150}
                  height={200}
                  alt=""
                />
                <Image src="/images/Logo.svg" width={100} height={58} alt="" />
              </div>
              <h3>{team.title}</h3>
              <p>{team.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
