'use client';

import { useState } from 'react';
import Image from 'next/image';
import './TeamMember.css';

interface TeamMemberData {
  name: string;
  role: string;
  id: string;
  image?: string;
}

type TeamType = 'forestry' | 'web';

export const TeamMember = () => {
  const [activeTeam, setActiveTeam] = useState<TeamType>('forestry');

  const dummyMember: TeamMemberData = {
    name: "Nama Anggota",
    role: "Peran Anggota",
    id: "21/000000/XX/000"
  };

  const forestryTeam: TeamMemberData[] = Array(4).fill(dummyMember).map((member, index) => ({
    ...member,
    id: `21/123456/PA/00${index + 1}`
  }));

  const webTeam: TeamMemberData[] = Array(4).fill(dummyMember).map((member, index) => ({
    ...member,
    id: `21/654321/WD/00${index + 1}`
  }));

  const currentTeam = activeTeam === 'forestry' ? forestryTeam : webTeam;

  return (
    <section id="team-member" className="team-member-section">
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
              className={`member-card ${activeTeam}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Photo with Unique Curved Cutout Shape */}
              <div className={`member-image-wrapper ${activeTeam}`}>
                <Image
                  src="/images/RectangleFoto.svg"
                  alt={member.name}
                  width={200}
                  height={267}
                  className="member-image"
                />
              </div>

              {/* Member Info */}
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className={`member-role ${activeTeam}`}>{member.role}</p>
                <p className="member-id">{member.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
