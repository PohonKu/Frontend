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
            <div className="relative z-10 w-full px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center mt-12">
                <div
                    className="transition-all duration-700 ease-out transform translate-y-0 opacity-100"
                    key={currentSlide}
                >
                    <Typography
                        variant="tilt-title"
                        className="text-white mb-6 drop-shadow-xl justify-center text-center"
                    >
                        {slides[currentSlide].headline}
                    </Typography>

                    <Typography
                        variant="title"
                        className="text-gray-200 mb-10 drop-shadow-md text-base md:text-lg lg:text-xl max-w-3xl mx-auto !leading-relaxed font-sans"
                        weight="regular"
                    >
                        {slides[currentSlide].subheadline}
                    </Typography>

                    <Link
                        href={slides[currentSlide].ctaLink}
                        className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                    >
                        <Typography variant="button" className="text-gray-900 font-bold text-base md:text-lg">
                            {slides[currentSlide].ctaText}
                        </Typography>
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

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
