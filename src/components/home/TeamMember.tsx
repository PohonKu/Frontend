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
      <FadeIn className={`team-member-container ${activeTeam}`}>
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
              className={`member-card ${activeTeam} group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-tr-[3rem] cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Photo with Unique Curved Cutout Shape */}
              <div className={`member-image-wrapper ${activeTeam} overflow-hidden rounded-tr-[3rem]`}>
                <Image
                  src="/images/RectangleFoto.svg"
                  alt={member.name}
                  width={200}
                  height={267}
                  className="member-image transition-transform duration-700 ease-out group-hover:scale-110"
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
      </FadeIn>
    </section>
  );
};
