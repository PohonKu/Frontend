import React from 'react';

interface HeroSectionProps {
    treeName: string;
    setTreeName: (name: string) => void;
}

export const HeroSection = ({ treeName, setTreeName }: HeroSectionProps) => {

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-16">

                {/* Left Column: Copy */}
                <div className="flex-1 text-center md:text-left text-white space-y-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-tilt leading-tight text-[#f0f9f1] drop-shadow-xl">
                        Tinggalkan Jejak <br className="hidden lg:block"/> Murni Abadi.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200/90 max-w-xl mx-auto md:mx-0 font-light leading-relaxed font-sans drop-shadow-md">
                        Sebuah warisan kehidupan. Ukir nama Anda, dan saksikan akar kebaikan tumbuh bersama alam Gunungkidul.
                    </p>
                </div>

                {/* Right Column: Elegant Glassmorphism Card */}
                <div className="flex-1 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-[#A2E3B1]/30 transition-colors duration-500">

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A2E3B1]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="space-y-10 relative z-10">
                            {/* Illustration Area: The Glass Tag */}
                            <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center justify-center min-h-[160px] border border-white/5 shadow-inner">
                                <p className="text-[10px] text-[#A2E3B1]/80 tracking-[0.3em] mb-4 uppercase font-sans font-medium">Bumi Mengingat</p>
                                <p className="text-3xl lg:text-4xl font-inria text-white font-bold text-center break-words w-full px-2 drop-shadow-lg">
                                    {treeName || "Nama Anda"}
                                </p>
                            </div>

                            {/* Input Area */}
                            <div className="space-y-6">
                                <div className="relative">
                                    <label htmlFor="treeName" className="sr-only">Tulis nama ukiran...</label>
                                    <input
                                        type="text"
                                        id="treeName"
                                        value={treeName}
                                        onChange={(e) => setTreeName(e.target.value)}
                                        placeholder="Tulis nama ukiran..."
                                        className="w-full bg-transparent text-white placeholder-white/40 px-2 py-3 border-b border-white/20 focus:border-[#A2E3B1] transition-all outline-none text-xl font-light font-sans"
                                        maxLength={30}
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A2E3B1] transition-all duration-300 peer-focus:w-full"></div>
                                </div>

                                <button
                                    onClick={() => {
                                        const element = document.getElementById('featured-trees');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white font-medium py-4 rounded-xl text-lg transition-all duration-300 font-sans tracking-wide shadow-lg hover:shadow-[#A2E3B1]/20 group-hover:-translate-y-1"
                                >
                                    Ukir Sekarang
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
