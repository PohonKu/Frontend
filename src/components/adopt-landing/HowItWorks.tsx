import React from 'react';
import { FadeIn } from '@/components/ui/FadeIn';

const STEPS = [
    {
        id: "01",
        title: "Pilih Spesies",
        description: "Eksplorasi koleksi endemik kami.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        )
    },
    {
        id: "02",
        title: "Ukir Nama",
        description: "Personalisasikan tag kayu eksklusif.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        )
    },
    {
        id: "03",
        title: "Dukung Alam",
        description: "Selesaikan adopsi dengan aman.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )
    },
    {
        id: "04",
        title: "Pantau Tumbuh",
        description: "Lihat perkembangan pohonmu langsung dari dashboard.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    }
];

export const HowItWorks = () => {
    return (
        <section className="min-h-screen flex items-center py-24 relative z-10">
            <FadeIn className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 px-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-tilt font-bold text-[#f0f9f1] mb-6 drop-shadow-lg">
                        Langkah Kebaikan.
                    </h2>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#A2E3B1] to-transparent mx-auto mb-4 opacity-70"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map((step) => (
                        <div key={step.id} className="relative flex flex-col items-center text-center group bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:border-[#A2E3B1]/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">

                            {/* Faint Step Number Watermark */}
                            <div className="absolute -top-4 -right-2 text-8xl font-tilt font-bold text-white/5 select-none transition-colors duration-500 group-hover:text-white/10">
                                {step.id}
                            </div>

                            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[#A2E3B1] mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(162,227,177,0.2)]">
                                {step.icon}
                            </div>

                            <div className="relative z-10 w-full">
                                <h3 className="text-2xl font-bold text-[#f0f9f1] mb-4 font-inria tracking-wide">
                                    {step.title}
                                </h3>

                                <p className="text-gray-300/90 font-light text-[16px] leading-relaxed font-sans">
                                    {step.description}
                                </p>
                            </div>

                            {/* Subtle bottom accent line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A2E3B1]/0 to-transparent group-hover:via-[#A2E3B1]/50 transition-all duration-700"></div>

                        </div>
                    ))}
                </div>

            </FadeIn>
        </section>
    );
};

export default HowItWorks;
