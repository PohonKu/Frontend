import React, { useState, useEffect } from 'react';

const useNumberAnimation = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return count;
};

export const ImpactStats = () => {
    const [stats, setStats] = useState({
        treesPlanted: 1200,
        co2Absorbed: 450,
        activeAdopters: 860
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-1e0b.up.railway.app';
                // Try fetching public stats if available
                const res = await fetch(`${apiUrl}/api/v1/stats/public`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        setStats({
                            treesPlanted: json.data.totalTreesPlanted || 1200,
                            co2Absorbed: json.data.totalCarbonAbsorbed || 450,
                            activeAdopters: json.data.totalAdopters || 860
                        });
                        return;
                    }
                }
            } catch (err) {
                console.warn('Public stats API not ready, falling back to dummy data', err);
            }
        };
        fetchStats();
    }, []);

    const treesPlanted = useNumberAnimation(stats.treesPlanted);
    const co2Absorbed = useNumberAnimation(stats.co2Absorbed);
    const activeAdopters = useNumberAnimation(stats.activeAdopters);

    return (
        <section className="w-full bg-white py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

                    {/* Stat 1 */}
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-6 text-[#1A3626]">
                            {/* Elegant thin-line SVG */}
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0a4 4 0 01-4-4 4 4 0 018 0 4 4 0 01-4 4z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M10 21l-2-2m6 2l2-2" />
                            </svg>
                        </div>
                        <h4 className="text-4xl font-inria font-bold text-[#111827] mb-2">
                            {treesPlanted.toLocaleString()}+
                        </h4>
                        <p className="text-gray-500 font-light tracking-[0.15em] uppercase text-xs font-sans">Pohon Teradopsi</p>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-6 text-[#1A3626]">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                        </div>
                        <h4 className="text-4xl font-inria font-bold text-[#111827] mb-2">
                            {co2Absorbed.toLocaleString()} <span className="text-xl text-gray-400 font-sans">Kg</span>
                        </h4>
                        <p className="text-gray-500 font-light tracking-[0.15em] uppercase text-xs font-sans">Total CO2 Terserap</p>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-6 text-[#1A3626]">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m14-10a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h4 className="text-4xl font-inria font-bold text-[#111827] mb-2">
                            {activeAdopters.toLocaleString()}+
                        </h4>
                        <p className="text-gray-500 font-light tracking-[0.15em] uppercase text-xs font-sans">Pengadopsi Aktif</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ImpactStats;
