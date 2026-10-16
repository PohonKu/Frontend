"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { useApp } from "./context";

const teams = {
  fkt: [
    {
      name: "Laras Adisetya Jati W.",
      role: "Project Leader",
      photo: "laras",
      position: "50% 35%",
    },
    {
      name: "Rega Alvino",
      role: "Marketing",
      photo: "rega",
      position: "50% 30%",
    },
    {
      name: "Putri Asiko Citarusa",
      role: "Silviculture Analyst",
      photo: "putri",
      position: "50% 32%",
    },
    {
      name: "Marvel Agrifa B. M.",
      role: "Finance & HR",
      photo: "marvel",
      position: "50% 35%",
    },
  ],
  it: [
    {
      name: "Rasyadwa Arsya",
      role: "IT Manager and Frontend Developer",
      photo: "arsya",
      position: "50% 28%",
    },
    {
      name: "Aqidatul Izzah",
      role: "UI/UX Illustration Designer",
      photo: "izzah",
      position: "50% 30%",
    },
    {
      name: "Shella Florencia Doul'im",
      role: "UI/UX Web Designer",
      photo: "shella",
      position: "50% 34%",
    },
    {
      name: "Hendra Kurnia",
      role: "Backend Developer",
      photo: "hendra",
      position: "50% 30%",
    },
  ],
} as const;
type Team = keyof typeof teams;
const tabs: Team[] = ["fkt", "it"];

export function ProgrammeTeam() {
  const { locale } = useApp();
  const id = locale === "id";
  const [active, setActive] = useState<Team>("fkt");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft")
      next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(tabs[next]);
    buttons.current[next]?.focus();
  }

  return (
    <section
      className="pk-section pk-team"
      id="team"
      aria-labelledby="pk-team-title"
    >
      <div className="pk-container">
        <h2 id="pk-team-title">
          {id ? "Tim di balik PohonKu" : "The people behind PohonKu"}
        </h2>
        <div
          className="pk-team-tabs"
          role="tablist"
          aria-label={id ? "Pilih tim" : "Choose a team"}
        >
          {tabs.map((team, index) => (
            <button
              key={team}
              type="button"
              role="tab"
              id={`pk-tab-${team}`}
              aria-selected={active === team}
              aria-controls="pk-team-panel"
              tabIndex={active === team ? 0 : -1}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              onClick={() => setActive(team)}
              onKeyDown={(event) => navigate(event, index)}
            >
              {team === "fkt"
                ? id
                  ? "Tim FKT"
                  : "Forestry team"
                : id
                  ? "Tim IT"
                  : "IT team"}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="pk-team-panel"
          aria-labelledby={`pk-tab-${active}`}
          tabIndex={0}
          className="pk-team-panel"
        >
          <p className="pk-team-description">
            {active === "fkt"
              ? id
                ? "Fakultas Kehutanan, Universitas Gadjah Mada"
                : "Faculty of Forestry, Universitas Gadjah Mada"
              : id
                ? "Tim desain dan pengembangan website PohonKu dari Departemen Teknik Elektro dan Teknologi Informasi (DTETI), Fakultas Teknik, Universitas Gadjah Mada."
                : "PohonKu website design and development team from the Department of Electrical Engineering and Information Technology (DTETI), Faculty of Engineering, Universitas Gadjah Mada."}
          </p>
          <div className="pk-members" key={active}>
            {teams[active].map((member) => (
              <article className="pk-member" key={member.photo}>
                <div className="pk-member-photo">
                  <Image
                    src={`/images/team/${member.photo}.png`}
                    alt={member.name}
                    fill
                    sizes="(max-width: 560px) 85vw, (max-width: 1050px) 40vw, 22vw"
                    style={{ objectPosition: member.position }}
                  />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
