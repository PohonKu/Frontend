'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';
import Link from 'next/link';

function LoginContent() {
    const searchParams = useSearchParams();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-1e0b.up.railway.app';

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            if (error === 'google_failed') {
                setErrorMsg('Autentikasi Google gagal. Silakan coba lagi.');
            } else {
                setErrorMsg(`Gagal masuk: ${error}`);
            }
        }
    }, [searchParams]);

    const handleGoogleLogin = () => {
        const urlRedirect = searchParams.get('redirect');
        if (urlRedirect) {
            localStorage.setItem('post_login_redirect', urlRedirect);
        } else {
            const existing = localStorage.getItem('post_login_redirect');
            if (!existing) {
                localStorage.setItem('post_login_redirect', '/dashboard');
            }
        }
        // TEMPORARY BYPASS: Since Railway is down, we use a mock login flow
        alert("Backend Railway sedang tidak aktif. Menggunakan Mode Simulasi (Mock Login) agar Anda tetap bisa menguji aplikasi.");
        localStorage.setItem('access_token', 'mock_token_123');
        const target = localStorage.getItem('post_login_redirect') || '/dashboard';
        window.location.href = target;
        
        // NOTE: Restore this when backend is live
        // window.location.href = `${apiUrl}/api/v1/auth/google`;
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-end overflow-hidden">
            {/* Immersive Background Image (Visible on ALL devices) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1920"
                    alt="Hutan Indonesia"
                    fill
                    className="object-cover scale-105 animate-slow-zoom"
                    priority
                    sizes="100vw"
                    quality={90}
                />
                {/* Gradient Overlays for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A200B] via-[#0A200B]/60 to-[#0A200B]/30 lg:bg-[#1A581E]/60 backdrop-blur-[2px]" />
            </div>

            {/* Back Button */}
            <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="font-medium text-sm hidden sm:block">Kembali ke Beranda</span>
            </Link>

            {/* Text Content (Left side on Desktop, Top center on Mobile) */}
            <div className="absolute inset-0 z-10 flex flex-col justify-start pt-24 px-6 sm:px-12 lg:justify-end lg:pt-0 lg:pb-16 lg:w-1/2 pointer-events-none text-center lg:text-left">
                <div className="animate-fade-in-up">
                    <Typography variant="tilt-title" className="text-white text-5xl md:text-6xl xl:text-[72px] mb-4 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        PohonKu
                    </Typography>
                    <Typography variant="body" className="text-white/90 text-sm md:text-base lg:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed drop-shadow-md">
                        Jadilah bagian dari gerakan pelestarian hutan Indonesia. Masuk sekarang dan mulai berdampak.
                    </Typography>
                </div>
            </div>

            {/* Premium Login Card (Glassmorphism on Mobile, Solid/Frosted on Desktop) */}
            <div className="relative z-20 w-full max-w-md px-6 lg:w-1/2 lg:max-w-none flex items-center justify-center lg:h-screen lg:bg-white/95 lg:backdrop-blur-xl lg:rounded-l-[3rem] lg:shadow-[-20px_0_40px_rgba(0,0,0,0.2)] mt-32 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                
                {/* The Mobile Glass Card / Desktop Flat Card */}
                <div className="w-full bg-white/10 backdrop-blur-2xl lg:bg-transparent lg:backdrop-blur-none border border-white/20 lg:border-none rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] lg:shadow-none flex flex-col items-center lg:items-start text-center lg:text-left">
                    
                    {/* Welcome Header */}
                    <div className="w-16 h-1 bg-[#A2E3B1] rounded-full mb-8 opacity-80" />
                    
                    <Typography variant="h2" className="text-white lg:text-gray-900 text-3xl mb-3 tracking-tight">
                        Selamat Datang
                    </Typography>
                    
                    <Typography variant="body" className="text-white/80 lg:text-gray-500 mb-10 text-sm leading-relaxed max-w-sm">
                        Lanjutkan dengan akun Google Anda untuk mengakses dashboard dan memantau status adopsi pohon.
                    </Typography>

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="w-full bg-red-500/10 lg:bg-red-50 border border-red-500/50 text-red-200 lg:text-red-700 p-4 mb-6 rounded-xl text-sm flex items-start gap-3 text-left">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {/* Magic Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="group w-full flex items-center justify-center gap-4 bg-white/90 lg:bg-white border border-transparent lg:border-gray-200 text-gray-800 hover:bg-white hover:border-[#1A581E] font-medium px-4 py-4 rounded-xl transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="bg-white rounded-full p-1 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </div>
                        <span className="font-semibold text-base">Lanjut dengan Google</span>
                    </button>

                    {/* Footer Privasi */}
                    <p className="mt-12 text-xs text-white/60 lg:text-gray-400 leading-relaxed max-w-sm">
                        Dengan masuk, Anda menyetujui{' '}
                        <a href="#" className="text-white/90 lg:text-gray-600 underline hover:text-[#A2E3B1] lg:hover:text-[#1A581E] transition-colors font-medium">Syarat & Ketentuan</a>{' '}
                        serta{' '}
                        <a href="#" className="text-white/90 lg:text-gray-600 underline hover:text-[#A2E3B1] lg:hover:text-[#1A581E] transition-colors font-medium">Kebijakan Privasi</a> kami.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A200B] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#A2E3B1] border-t-transparent animate-spin shadow-[0_0_15px_rgba(162,227,177,0.5)]" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
