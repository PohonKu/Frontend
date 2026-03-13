'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NameTagModal from '@/components/adopt/NameTagModal';
import PaymentModal from '@/components/adopt/PaymentModal';
import AuthErrorModal from '@/components/ui/AuthErrorModal';
import { orderApi } from '@/lib/apiPayment';
import { FadeIn } from '@/components/ui/FadeIn';

interface FeaturedTreesProps {
    prefilledName?: string;
}

// Fallback image maps from original hardcoded values to ensure beautiful UI
const FALLBACK_IMAGES: Record<string, string> = {
    'Nangka': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop',
    'Gayam': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop',
    'Beringin': 'https://images.unsplash.com/photo-1508349937151-22b68b72d5b1?q=80&w=800&auto=format&fit=crop'
};

const FALLBACK_BADGES: Record<string, string> = {
    'Nangka': 'Terlaris',
    'Gayam': 'Sangat Langka',
    'Beringin': 'Terlaris'
};

const DEFAULT_TREES = [
    {
        id: 'spec_001',
        name: 'Nangka',
        latinName: 'Artocarpus heterophyllus',
        price: 150000,
        image: FALLBACK_IMAGES['Nangka'],
        badge: 'Terlaris'
    },
    {
        id: 'spec_002',
        name: 'Gayam',
        latinName: 'Inocarpus fagifer',
        price: 250000,
        image: FALLBACK_IMAGES['Gayam'],
        badge: 'Sangat Langka'
    },
    {
        id: 'spec_003',
        name: 'Beringin',
        latinName: 'Ficus benjamina',
        price: 200000,
        image: FALLBACK_IMAGES['Beringin'],
        badge: 'Terlaris'
    }
];

export const FeaturedTrees = ({ prefilledName = '' }: FeaturedTreesProps) => {
    const [trees, setTrees] = useState(DEFAULT_TREES);
    const [pendingSpecies, setPendingSpecies] = useState<{ id: string; name: string } | null>(null);
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [showAuthError, setShowAuthError] = useState(false);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-1e0b.up.railway.app';
                const res = await fetch(`${apiUrl}/api/v1/trees/species`);
                
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && Array.isArray(json.data)) {
                        // We want to feature exactly these three by default, or just take the first 3
                        const targetNames = ['Nangka', 'Gayam', 'Beringin'];
                        const featuredSpecies = json.data.filter((s: any) => targetNames.includes(s.name));
                        
                        if (featuredSpecies.length > 0) {
                            const mappedTrees = targetNames.map(targetName => {
                                // Find the real species or fallback if missing in API
                                const realSpecies = featuredSpecies.find((s: any) => s.name === targetName);
                                const defaultTree = DEFAULT_TREES.find(t => t.name === targetName)!;
                                
                                if (realSpecies) {
                                    return {
                                        id: realSpecies.id, // REAL API ID
                                        name: realSpecies.name,
                                        latinName: realSpecies.latinName,
                                        price: parseInt(realSpecies.basePrice) || defaultTree.price,
                                        image: FALLBACK_IMAGES[targetName] || realSpecies.mainImageUrl, // Use unsplash to avoid placeholder crash
                                        badge: FALLBACK_BADGES[targetName] || 'Unggulan'
                                    };
                                }
                                return defaultTree;
                            });
                            
                            setTrees(mappedTrees);
                        }
                    }
                }
            } catch (err) {
                console.warn('Failed to load real species for FeaturedTrees, using fallbacks.', err);
            }
        };

        fetchSpecies();
    }, []);

    const handleAdopt = (tree: { id: string; name: string }) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setShowAuthError(true);
            return;
        }
        setPendingSpecies(tree);
    };

    const handleNameSubmit = async (nameOnTag: string) => {
        if (!pendingSpecies) return;

        setIsCreatingOrder(true);
        try {
            const response = await orderApi.createOrder({
                speciesId: pendingSpecies.id,
                nameOnTag,
            });

            if (response.success && response.data?.id) {
                setPendingSpecies(null);
                setActiveOrderId(response.data.id);
            } else {
                alert(response.message || 'Gagal membuat pesanan adopsi.');
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            alert(error.message || 'Terjadi kesalahan koneksi saat membuat pesanan.');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    return (
        <section id="featured-trees" className="py-24 bg-white">
            <FadeIn className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                    {trees.map((tree) => (
                        <div key={tree.id} className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

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
                                    <span className="bg-white/90 backdrop-blur-sm text-[#1A581E] border border-gray-200 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full font-sans font-medium">
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
                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-sans">
                                        Durasi Adopsi: 1 Tahun
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAdopt(tree)}
                                    className="w-full bg-white border border-[#1A581E] text-[#1A581E] hover:bg-[#1A581E] hover:text-white font-medium py-3 text-sm tracking-wider uppercase transition-colors duration-300 rounded-lg font-sans"
                                >
                                    Adopsi Sekarang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secondary CTA to view all trees */}
                <div className="mt-16 flex justify-center">
                    <Link 
                        href="/trees" 
                        className="group flex items-center gap-3 px-8 py-4 bg-white border border-[#1A581E] text-[#1A581E] rounded-full hover:bg-[#1A581E] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <span className="font-sans font-medium uppercase tracking-wider text-sm">Lihat Semua Koleksi</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

            </FadeIn>

            {/* Name Tag Modal */}
            {pendingSpecies && (
                <NameTagModal
                    speciesName={pendingSpecies.name}
                    initialName={prefilledName}
                    onClose={() => setPendingSpecies(null)}
                    onSubmit={handleNameSubmit}
                />
            )}

            {/* Auth Error Modal */}
            {showAuthError && (
                <AuthErrorModal onCloseAction={() => setShowAuthError(false)} />
            )}

            {/* Loading Overlay */}
            {isCreatingOrder && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1A581E] border-t-transparent mb-4"></div>
                        <p className="text-gray-900 font-medium font-sans">Menyiapkan Pesanan...</p>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {activeOrderId && (
                <PaymentModal
                    orderId={activeOrderId}
                    onClose={() => setActiveOrderId(null)}
                />
            )}
        </section>
    );
};

export default FeaturedTrees;

