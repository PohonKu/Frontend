import React from 'react';

const FEATURED_TREES = [
    {
        id: 'spec_001',
        name: 'Nangka',
        latinName: 'Artocarpus heterophyllus',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop',
        badge: 'Terlaris'
    },
    {
        id: 'spec_002',
        name: 'Gayam',
        latinName: 'Inocarpus fagifer',
        price: 250000,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop',
        badge: 'Sangat Langka'
    },
    {
        id: 'spec_003',
        name: 'Beringin',
        latinName: 'Ficus benjamina',
        price: 200000,
        image: 'https://images.unsplash.com/photo-1508349937151-22b68b72d5b1?q=80&w=800&auto=format&fit=crop',
        badge: 'Terlaris'
    }
];

export const FeaturedTrees = () => {
    return (
        <section id="featured-trees" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-tilt font-bold text-[#111827] mb-6">
                        Koleksi Eksklusif
                    </h2>
                    <div className="w-12 h-[1px] bg-[#1A3626] mx-auto mb-6"></div>
                    <p className="text-[#4B5563] font-light max-w-2xl mx-auto tracking-wide font-sans">
                        Spesies kurasi dengan dampak tertinggi pada ekosistem lokal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {FEATURED_TREES.map((tree) => (
                        <div key={tree.id} className="group flex flex-col bg-[#FAFAFA] border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">

                            {/* Image Area */}
                            <div className="relative h-80 w-full overflow-hidden">
                                <img
                                    src={tree.image}
                                    alt={tree.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />

                                <div className="absolute top-0 left-0 w-full h-full bg-black/10 transition-opacity duration-500 group-hover:opacity-0"></div>

                                {/* Elegant Badge */}
                                <div className="absolute top-5 left-5">
                                    <span className="bg-[#FAFAFA]/90 backdrop-blur-sm text-[#1A3626] border border-[#1A3626]/20 text-[10px] uppercase tracking-[0.2em] px-4 py-2 font-sans">
                                        {tree.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 flex flex-col items-center text-center flex-grow bg-white">
                                <h3 className="text-3xl font-inria font-bold text-[#111827] mb-1">{tree.name}</h3>
                                <p className="text-[#6B7280] italic font-light text-sm mb-6 font-sans">{tree.latinName}</p>

                                <div className="mb-8 mt-auto w-full">
                                    <p className="text-xl font-medium text-[#111827] font-sans">
                                        Rp {tree.price.toLocaleString('id-ID')}
                                    </p>
                                </div>

                                <button className="w-full bg-transparent border border-[#1A3626] text-[#1A3626] hover:bg-[#1A3626] hover:text-[#FAFAFA] font-medium py-3 text-sm tracking-widest uppercase transition-colors font-sans">
                                    Adopsi Sekarang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedTrees;
