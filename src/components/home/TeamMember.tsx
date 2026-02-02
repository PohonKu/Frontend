'use client';

import React from 'react';
import Image from 'next/image';
import './TeamMember.css';

interface TeamMemberData {
  name: string;
  role: string;
  id: string;
  image?: string;
}

export const TeamMember = () => {
  const teamMembers: TeamMemberData[] = [
    {
      name: "Dummy Name",
      role: "sebagai apa ni",
      id: "21/123456/AB/09876"
    },
    {
      name: "Dummy Name",
      role: "sebagai apa ni",
      id: "21/123456/AB/09876"
    },
    {
      name: "Dummy Name",
      role: "sebagai apa ni",
      id: "21/123456/AB/09876"
    },
    {
      name: "Dummy Name",
      role: "sebagai apa ni",
      id: "21/123456/AB/09876"
    }
  ];

  return (
    <section id="team-member" className="team-member-section">
      <div className="team-member-container">
        {/* Section Title */}
        <h2 className="team-title">Team Member</h2>

        {/* Team Members Grid */}
        <div className="team-members-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="member-card">
              {/* Photo with Unique Curved Cutout Shape */}
              <div className="member-image-wrapper">
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
                <p className="member-role">{member.role}</p>
                <p className="member-id">{member.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
