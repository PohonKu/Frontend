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
        <section className="py-24 bg-[#F9F9F9] border-t border-gray-100">
            <FadeIn className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl md:text-4xl font-tilt font-bold text-[#1A581E] mb-6">
                        Langkah Menuju Kebaikan
                    </h2>
                    <div className="w-12 h-[2px] bg-[#1A3626] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map((step) => (
                        <div key={step.id} className="relative flex flex-col items-center text-center group bg-white p-10 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">

                            {/* Faint Step Number Watermark */}
                            <div className="absolute top-4 right-6 text-6xl font-tilt font-bold text-gray-100 select-none transition-colors duration-300 group-hover:text-gray-200">
                                {step.id}
                            </div>

                            <div className="relative z-10 w-16 h-16 rounded-full bg-[#CEFFD1]/50 flex items-center justify-center text-[#1A581E] mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#A2E3B1]/50">
                                {step.icon}
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-[#111827] mb-3 font-inria">
                                    {step.title}
                                </h3>

                                <p className="text-[#6B7280] font-light text-[15px] leading-relaxed font-sans">
                                    {step.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </FadeIn>
        </section>
    );
};

export default HowItWorks;
