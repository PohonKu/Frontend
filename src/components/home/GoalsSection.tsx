'use client';

import React from 'react';
import Image from 'next/image';
import './GoalsSection.css';

interface SDGItemProps {
  number: string;
  label: string;
  title: string;
  description: string;
}

export const GoalsSection = () => {
  const sdgItems: SDGItemProps[] = [
    {
      number: "13",
      label: "Goal 13",
      title: "Konservasi Tanaman Langka",
      description: "Melestarikan keanekaragaman hayati melalui program adopsi tanaman langka di kawasan Tahura Bunder"
    },
    {
      number: "13",
      label: "Goal 13",
      title: "Edukasi Lingkungan",
      description: "Memberikan pemahaman kepada masyarakat tentang pentingnya konservasi dan keberlanjutan ekosistem"
    }
  ];

  return (
    <section id="goals" className="goals-section">
      <div className="goals-container">
        {/* Section Title */}
        <h2 className="goals-title">Sustainable Development Goals</h2>

        {/* SDG List - Vertical Stack */}
        <div className="sdg-list">
          {sdgItems.map((item, index) => (
            <div key={index} className="sdg-item">
              {/* Left: SDG Icon */}
              <div className="sdg-icon">
                <Image
                  src="/images/SDG13.svg"
                  alt={`SDG ${item.number}`}
                  width={140}
                  height={140}
                  className="sdg-image"
                />
              </div>

              {/* Right: Text Content */}
              <div className="sdg-content">
                <h3 className="sdg-title">{item.label}: Climate Action</h3>
                <p className="sdg-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
