'use client';

import React, { useState } from 'react';
import { Typography } from '@/components/ui/Typography';
import { MapPin, Trees, Mountain, Landmark } from 'lucide-react';
import './ProjectArea.css';

export const ProjectArea = () => {
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);

    const zones = [
        {
            id: 'perspektif',
            name: 'Perspektif Keistimewaan',
            trees: 35,
            icon: <Trees className="w-5 h-5" />,
            color: '#1A581E',
            position: { cx: 30, cy: 40 }
        },
        {
            id: 'toponimi',
            name: 'Toponimi Gunungkidul',
            trees: 42,
            icon: <Mountain className="w-5 h-5" />,
            color: '#029146',
            position: { cx: 55, cy: 35 }
        },
        {
            id: 'native',
            name: 'Native Karst',
            trees: 28,
            icon: <Landmark className="w-5 h-5" />,
            color: '#07863E',
            position: { cx: 70, cy: 55 }
        },
        {
            id: 'sumbu',
            name: 'Sumbu Filosofi',
            trees: 31,
            icon: <MapPin className="w-5 h-5" />,
            color: '#009549',
            position: { cx: 45, cy: 70 }
        }
    ];

    const textStyle = {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: '16px',
        lineHeight: '1.8',
        letterSpacing: '0%'
    };

    return (
        <section id="project-area" className="project-area-section">
            <div className="project-area-container">

                {/* Section Title */}
                <div className="section-title">
                    <Typography variant="tilt-title" className="text-[#1A581E]">
                        Project Area
                    </Typography>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left: Description */}
                    <div className="flex flex-col order-2 lg:order-1">
                        <p className="text-black text-left" style={textStyle}>
                            Lokasi proyek PohonKu berada di Taman Hutan Raya (Tahura) Bunder, Gunungkidul, Daerah Istimewa Yogyakarta. Kawasan seluas ±25 hektar ini merupakan pusat konservasi keanekaragaman hayati khas ekosistem karst.
                        </p>
                        <p className="text-black text-left" style={textStyle}>
                            Tahura Bunder dipilih karena keunikan ekosistemnya yang menjadi habitat bagi berbagai spesies tanaman langka. Melalui program adopsi, kami berkomitmen melestarikan keanekaragaman hayati sambil memberikan edukasi kepada masyarakat tentang pentingnya konservasi lingkungan.
                        </p>

                        {/* Zone Cards */}
                        <div className="zone-cards-grid">
                            {zones.map((zone) => (
                                <div
                                    key={zone.id}
                                    className="zone-card"
                                    onMouseEnter={() => setHoveredZone(zone.id)}
                                    onMouseLeave={() => setHoveredZone(null)}
                                >
                                    <div className="zone-card-header">
                                        <div className="zone-icon">
                                            {zone.icon}
                                        </div>
                                        <h3 className="zone-name">
                                            {zone.name}
                                        </h3>
                                    </div>
                                    <p className="zone-count" style={textStyle}>
                                        {zone.trees} Jenis Tanaman
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Interactive Map */}
                    <div className="relative order-1 lg:order-2">
                        <div className="map-container">
                            {/* Map Background - Stylized SVG */}
                            <div className="map-wrapper">
                                <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {/* Background - Landmass */}
                                    <defs>
                                        <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#E8F5E9', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#C8E6C9', stopOpacity: 1 }} />
                                        </linearGradient>
                                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                                        </filter>
                                    </defs>

                                    {/* Stylized Landmass Shape */}
                                    <path
                                        d="M20,30 Q30,15 50,20 Q70,15 80,30 Q90,50 85,70 Q75,85 50,80 Q25,85 15,70 Q10,50 20,30"
                                        fill="url(#landGradient)"
                                        stroke="#1A581E"
                                        strokeWidth="0.5"
                                        filter="url(#shadow)"
                                        className="transition-all duration-500"
                                    />

                                    {/* Zone Circles */}
                                    {zones.map((zone) => (
                                        <g key={zone.id}>
                                            {/* Outer pulse circle */}
                                            <circle
                                                cx={zone.position.cx}
                                                cy={zone.position.cy}
                                                r={hoveredZone === zone.id ? 12 : 8}
                                                fill={zone.color}
                                                opacity={hoveredZone === zone.id ? 0.3 : 0.15}
                                                className="transition-all duration-300"
                                            >
                                                {hoveredZone === zone.id && (
                                                    <animate
                                                        attributeName="r"
                                                        values="8;14;8"
                                                        dur="2s"
                                                        repeatCount="indefinite"
                                                    />
                                                )}
                                            </circle>
                                            {/* Inner solid circle */}
                                            <circle
                                                cx={zone.position.cx}
                                                cy={zone.position.cy}
                                                r={hoveredZone === zone.id ? 6 : 4}
                                                fill={zone.color}
                                                className="transition-all duration-300 cursor-pointer hover:r-6"
                                            />
                                            {/* Label */}
                                            <text
                                                x={zone.position.cx}
                                                y={zone.position.cy + 18}
                                                textAnchor="middle"
                                                className={`text-xs font-semibold transition-all duration-300 ${hoveredZone === zone.id ? 'fill-[#1A581E] font-bold' : 'fill-gray-600'}`}
                                                style={{ fontSize: hoveredZone === zone.id ? '3.5px' : '3px' }}
                                            >
                                                {zone.name.split(' ')[0]}
                                            </text>
                                        </g>
                                    ))}

                                    {/* Connection Lines */}
                                    <path
                                        d="M30,40 L55,35 L70,55 L45,70 L30,40"
                                        stroke="#1A581E"
                                        strokeWidth="0.3"
                                        fill="none"
                                        opacity="0.3"
                                        strokeDasharray="2,2"
                                        className="animate-pulse"
                                    />

                                    {/* Location Marker */}
                                    <g transform="translate(50, 50)">
                                        <circle
                                            r="3"
                                            fill="#FF5722"
                                            className="animate-ping"
                                            style={{ animationDuration: '2s' }}
                                        />
                                        <circle
                                            r="2"
                                            fill="#FF5722"
                                        />
                                    </g>
                                </svg>

                                {/* Legend */}
                                <div className="map-legend">
                                    <div className="flex items-center justify-between">
                                        <div className="legend-item">
                                            <div className="legend-dot" style={{ backgroundColor: '#1A581E' }}></div>
                                            <span>Zona Konservasi</span>
                                        </div>
                                        <div className="legend-item">
                                            <div className="legend-dot" style={{ backgroundColor: '#FF5722' }}></div>
                                            <span>Lokasi Utama</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#1A581E]/10 to-[#029146]/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-[#029146]/10 to-[#07863E]/10 rounded-full blur-2xl"></div>
                    </div>

                </div>

            </div>
        </section>
    );
};
