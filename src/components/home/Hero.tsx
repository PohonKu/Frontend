'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Typography } from '@/components/ui/Typography';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1920',
        headline: 'Hutan itu Indonesia',
        subheadline: 'Adalah gerakan terbuka yang percaya akan kekuatan pesan-pesan positif untuk menumbuhkan rasa cinta kepada hutan Indonesia yang sangat berpengaruh pada kehidupan kita.',
        ctaText: 'Pelajari Lebih Lanjut',
        ctaLink: '/#about',
    },
    {
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920',
        headline: 'Adopsi Hutan',
        subheadline: 'Bantu kami memastikan para penjaga hutan di berbagai pelosok nusantara dapat hidup lebih layak dan terus merawat hutan, sumber napas dan kehidupan kita semua.',
        ctaText: 'Dukung Sekarang!',
        ctaLink: '/adopt',
    },
    {
        image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1920',
        headline: 'Lestarikan Alam Bersama',
        subheadline: 'Setiap pohon yang diadopsi adalah langkah nyata menuju masa depan yang lebih hijau, asri, dan lestari bagi generasi mendatang.',
        ctaText: 'Adopsi PohonKu',
        ctaLink: '/trees',
    }
];

export const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
            {/* Background Images with Crossfade */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.headline}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                        quality={90}
                    />
                    {/* Dark Overlay for Readability */}
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            ))}

            {/* Content Container */}
            <div className="relative z-10 w-full px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center mt-12 md:mt-24">
                <div
                    className="animate-fade-in-up w-full md:max-w-4xl flex flex-col items-center"
                    key={currentSlide}
                >
                    <Typography
                        variant="tilt-title"
                        className="text-white mb-6 drop-shadow-xl text-center"
                    >
                        {slides[currentSlide].headline}
                    </Typography>

                    <Typography
                        variant="title"
                        className="text-gray-200 mb-10 drop-shadow-md text-base md:text-lg lg:text-xl max-w-3xl mx-auto !leading-relaxed font-sans text-center"
                        weight="regular"
                    >
                        {slides[currentSlide].subheadline}
                    </Typography>

                    <Link
                        href={slides[currentSlide].ctaLink}
                        className="group flex justify-center w-full sm:w-auto sm:inline-flex mt-4 bg-white px-8 py-4 rounded-full transition-all duration-400 ease-in-out hover:bg-[#1A581E] hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    >
                        <Typography variant="button" className="text-gray-900 group-hover:text-white font-bold text-base md:text-lg transition-colors duration-400 ease-in-out">
                            {slides[currentSlide].ctaText}
                        </Typography>
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex justify-between px-2 md:px-8 z-20 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-2 text-white/60 hover:text-white hover:-translate-x-2 transition-all duration-300 group pointer-events-auto"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={1} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-2 text-white/60 hover:text-white hover:translate-x-2 transition-all duration-300 group pointer-events-auto"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={1} />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
