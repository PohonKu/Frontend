'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FadeIn } from '@/components/ui/FadeIn';
import './TeamMember.css';

interface TeamMemberData {
  name: string;
  role: string;
  image?: string;
}

type TeamType = 'forestry' | 'web';

export const TeamMember = () => {
  const [activeTeam, setActiveTeam] = useState<TeamType>('forestry');

  const dummyMember: TeamMemberData = {
    name: "Nama Anggota",
    role: "Peran Anggota"
  };

  const forestryTeam: TeamMemberData[] = Array(4).fill(dummyMember).map((member) => ({
    ...member
  }));

  const webTeam: TeamMemberData[] = Array(4).fill(dummyMember).map((member) => ({
    ...member
  }));

  const currentTeam = activeTeam === 'forestry' ? forestryTeam : webTeam;

  return (
    <section id="team-member" className="team-member-section">
      <FadeIn>
        <div className={`team-member-container ${activeTeam}`}>
        {/* Section Title */}
        <h2 className="team-title">Team Member</h2>

        {/* Team Toggle Switch */}
        <div className="team-toggle-container">
          <button
            className={`team-toggle-btn forestry ${activeTeam === 'forestry' ? 'active' : ''}`}
            onClick={() => setActiveTeam('forestry')}
          >
            <span>Tim Kehutanan</span>
          </button>
          <button
            className={`team-toggle-btn web ${activeTeam === 'web' ? 'active' : ''}`}
            onClick={() => setActiveTeam('web')}
          >
            <span>Tim Pengembang Web</span>
          </button>
        </div>

        {/* Team Members Grid */}
        <div className="team-members-grid">
          {currentTeam.map((member, index) => (
            <div
              key={`${activeTeam}-${index}`}
              className={`member-card ${activeTeam} animate-member group transition-transform duration-300 hover:-translate-y-2 cursor-pointer`}
              style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
            >
              {/* Photo with Unique Curved Cutout Shape */}
              <div className={`member-image-wrapper ${activeTeam}`}>
                <Image
                  src="/images/RectangleFoto.svg"
                  alt={member.name}
                  width={200}
                  height={267}
                  className="member-image drop-shadow-md transition-all duration-500 ease-out group-hover:scale-105 group-hover:drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
                />
              </div>

              {/* Member Info */}
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className={`member-role ${activeTeam}`}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </FadeIn>
    </section>
  );
};
