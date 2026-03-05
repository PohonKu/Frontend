import React from 'react';

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
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-tilt font-bold text-[#1A581E] mb-6">
                        Langkah Menuju Kebaikan
                    </h2>
                    <div className="w-12 h-[1px] bg-[#1A3626] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex flex-col items-center text-center group p-6 rounded-xl transition-transform duration-300 hover:-translate-y-1">

                            <div className="text-[#1A581E] mb-6 opacity-80">
                                {step.icon}
                            </div>

                            <div className="text-xs font-sans text-[#6B7280] tracking-[0.2em] mb-3">
                                {step.id}
                            </div>

                            <h3 className="text-lg font-bold text-[#111827] mb-2 uppercase tracking-wide font-inria">
                                {step.title}
                            </h3>

                            <p className="text-[#4B5563] font-light text-sm leading-relaxed max-w-[200px] font-sans">
                                {step.description}
                            </p>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
