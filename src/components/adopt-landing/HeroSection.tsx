import React from 'react';

interface HeroSectionProps {
    treeName: string;
    setTreeName: (name: string) => void;
}

export const HeroSection = ({ treeName, setTreeName }: HeroSectionProps) => {

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/* Dark, moody forest background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-16">

                {/* Left Column: Copy */}
                <div className="flex-1 text-center md:text-left text-white space-y-8 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-tilt leading-tight text-[#FAFAFA]">
                        Tinggalkan Jejak Kebaikan.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0 font-light leading-relaxed font-sans">
                        Lebih dari sekadar menanam. Ukir nama Anda, atau nama mereka yang Anda sayangi, dan biarkan tumbuh bersama alam Gunungkidul.
                    </p>
                </div>

                {/* Right Column: Elegant Glassmorphism Card */}
                <div className="flex-1 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden">

                        <div className="space-y-8 relative z-10">
                            {/* Illustration Area: The Wooden Tag (Elegant) */}
                            <div className="relative bg-[#ebe1d5]/90 backdrop-blur-md rounded-lg p-8 flex flex-col items-center justify-center min-h-[160px] border border-[#d4c3b3] shadow-inner">
                                <p className="text-xs text-[#5C3A21] tracking-[0.2em] mb-3 uppercase font-sans font-medium">Ditanam Oleh</p>
                                <p className="text-3xl font-inria text-[#2C1E16] font-bold text-center break-words w-full px-2">
                                    {treeName || "Nama Anda"}
                                </p>
                            </div>

                            {/* Input Area */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="treeName" className="sr-only">Tulis nama untuk ukiran pohon...</label>
                                    <input
                                        type="text"
                                        id="treeName"
                                        value={treeName}
                                        onChange={(e) => setTreeName(e.target.value)}
                                        placeholder="Tulis nama untuk ukiran pohon..."
                                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 px-5 py-4 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#1A581E] focus:border-[#1A581E] transition-all outline-none text-lg font-light font-sans"
                                        maxLength={30}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const element = document.getElementById('featured-trees');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full bg-[#1A581E] hover:bg-[#145216] text-white font-medium py-4 rounded-xl text-lg transition-colors duration-300 font-sans"
                                >
                                    Ukir Nama Ini
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
