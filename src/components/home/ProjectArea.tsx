'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';
import { FadeIn } from '@/components/ui/FadeIn';
import { MapPin, Trees, Mountain, Landmark } from 'lucide-react';
import './ProjectArea.css';

export const ProjectArea = () => {
    const [activeZone, setActiveZone] = useState<string | null>(null);

    const zones = [
        {
            id: 'perspektif',
            name: 'Perspektif Keistimewaan',
            trees: 35,
            icon: <Image src="/gambarCici/Icon Pohonku/Icon Pohonku/Perspektif Keistimewaan.svg" alt="Perspektif" width={22} height={22} className="object-contain" />,
            color: '#1A581E',
            position: { cx: 30, cy: 40 }
        },
        {
            id: 'toponimi',
            name: 'Toponimi Gunungkidul',
            trees: 42,
            icon: <Image src="/gambarCici/Icon Pohonku/Icon Pohonku/Toponimi Gunkid.svg" alt="Toponimi" width={22} height={22} className="object-contain" />,
            color: '#029146',
            position: { cx: 55, cy: 35 }
        },
        {
            id: 'native',
            name: 'Native Karst',
            trees: 28,
            icon: <Image src="/gambarCici/Icon Pohonku/Icon Pohonku/Native Karst.svg" alt="Karst" width={22} height={22} className="object-contain" />,
            color: '#07863E',
            position: { cx: 70, cy: 55 }
        },
        {
            id: 'sumbu',
            name: 'Sumbu Filosofi',
            trees: 31,
            icon: <Image src="/gambarCici/Icon Pohonku/Icon Pohonku/Sumbu Filosofi.svg" alt="Sumbu" width={22} height={22} className="object-contain" />,
            color: '#009549',
            position: { cx: 45, cy: 70 }
        }
    ];

    return (
        <section id="project-area" className="pa-section">
            <FadeIn className="pa-container">

                {/* Header */}
                <div className="pa-header">
                    <Typography variant="tilt-title" className="text-[#1A581E] justify-center">
                        Project Area
                    </Typography>
                    <p className="pa-subtitle">
                        Taman Hutan Raya (Tahura) Bunder, Gunungkidul, DIY — pusat konservasi keanekaragaman hayati khas ekosistem karst seluas ±25 hektar.
                    </p>
                </div>

                {/* Main Content: Map + Zone Buttons */}
                <div className="pa-content">

                    {/* Map */}
                    <div className="pa-map-col">
                        <div className="pa-map-card">
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full"
                            >
                                {/* Background */}
                                <defs>
                                    <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#E8F5E9', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#C8E6C9', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>

                                {/* Landmass */}
                                <path
                                    d="M20,30 Q30,15 50,20 Q70,15 80,30 Q90,50 85,70 Q75,85 50,80 Q25,85 15,70 Q10,50 20,30"
                                    fill="url(#landGrad)"
                                    stroke="#1A581E"
                                    strokeWidth="0.4"
                                    className="transition-all duration-500"
                                />

                                {/* Connection Lines */}
                                <path
                                    d="M30,40 L55,35 L70,55 L45,70 L30,40"
                                    stroke="#1A581E"
                                    strokeWidth="0.25"
                                    fill="none"
                                    opacity="0.2"
                                    strokeDasharray="2,2"
                                />

                                {/* Zone Markers */}
                                {zones.map((zone) => {
                                    const isActive = activeZone === zone.id;
                                    return (
                                        <g key={zone.id}>
                                            {/* Highlight ring */}
                                            <circle
                                                cx={zone.position.cx}
                                                cy={zone.position.cy}
                                                r={isActive ? 10 : 6}
                                                fill={zone.color}
                                                opacity={isActive ? 0.25 : 0.1}
                                                className="transition-all duration-300"
                                            />
                                            {/* Dot */}
                                            <circle
                                                cx={zone.position.cx}
                                                cy={zone.position.cy}
                                                r={isActive ? 4.5 : 3}
                                                fill={zone.color}
                                                stroke="#fff"
                                                strokeWidth={isActive ? 1 : 0.5}
                                                className="transition-all duration-300 cursor-pointer"
                                                onMouseEnter={() => setActiveZone(zone.id)}
                                                onMouseLeave={() => setActiveZone(null)}
                                            />
                                            {/* Label (visible when active) */}
                                            <text
                                                x={zone.position.cx}
                                                y={zone.position.cy - (isActive ? 8 : 6)}
                                                textAnchor="middle"
                                                fill="#1A581E"
                                                style={{
                                                    fontSize: isActive ? '3.2px' : '0px',
                                                    fontWeight: 600,
                                                    fontFamily: 'Inter, sans-serif',
                                                    opacity: isActive ? 1 : 0,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {zone.name}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Center marker */}
                                <circle cx="50" cy="50" r="1.5" fill="#D32F2F" />
                            </svg>

                            {/* Legend */}
                            <div className="pa-legend">
                                <span className="pa-legend-item">
                                    <span className="pa-legend-dot" style={{ background: '#1A581E' }}></span>
                                    Zona Konservasi
                                </span>
                                <span className="pa-legend-item">
                                    <span className="pa-legend-dot" style={{ background: '#D32F2F' }}></span>
                                    Lokasi Utama
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Zone Buttons */}
                    <div className="pa-zones-col">
                        {zones.map((zone) => (
                            <button
                                key={zone.id}
                                className={`pa-zone-btn ${activeZone === zone.id ? 'pa-zone-btn--active' : ''}`}
                                onMouseEnter={() => setActiveZone(zone.id)}
                                onMouseLeave={() => setActiveZone(null)}
                                onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
                            >
                                <span className="pa-zone-icon" style={{ color: zone.color }}>
                                    {zone.icon}
                                </span>
                                <div className="pa-zone-info">
                                    <span className="pa-zone-name">{zone.name}</span>
                                    <span className="pa-zone-count">{zone.trees} Jenis Tanaman</span>
                                </div>
                            </button>
                        ))}
                    </div>

                </div>
            </FadeIn>
        </section>
    );
};
