'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';

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
        const redirect = searchParams.get('redirect') || '/dashboard';
        localStorage.setItem('post_login_redirect', redirect);
        window.location.href = `${apiUrl}/api/v1/auth/google`;
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Photo Panel */}
            <div className="hidden lg:block relative">
                <Image
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1920"
                    alt="Hutan Indonesia"
                    fill
                    className="object-cover"
                    priority
                    sizes="50vw"
                />
                <div className="absolute inset-0 bg-[#1A581E]/70" />
                <div className="absolute inset-0 flex flex-col justify-end p-12 pb-16">
                    <Typography variant="tilt-title" className="text-white text-[40px] xl:text-[52px] mb-4 leading-tight">
                        PohonKu
                    </Typography>
                    <Typography variant="body" className="text-white/80 text-base max-w-md leading-relaxed">
                        Adopsi tanaman langka, pantau pertumbuhannya, dan jadilah bagian dari gerakan konservasi hutan Indonesia.
                    </Typography>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center bg-white px-6 py-20 lg:py-0">
                <div className="w-full max-w-sm">

                    {/* Brand (visible on mobile only) */}
                    <div className="lg:hidden mb-10">
                        <Typography variant="tilt-subtitle" className="text-[#1A581E] text-center">
                            PohonKu
                        </Typography>
                    </div>

                    {/* Heading */}
                    <Typography variant="h2" className="text-gray-900 mb-2">
                        Masuk
                    </Typography>
                    <Typography variant="body" className="text-gray-500 mb-10 text-sm">
                        Masuk ke akun Anda untuk memantau pohon adopsi dan perkembangan konservasi.
                    </Typography>

                    {/* Error */}
                    {errorMsg && (
                        <div className="w-full bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg text-sm">
                            <p className="font-medium">{errorMsg}</p>
                        </div>
                    )}

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="group w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-[#1A581E] hover:border-[#1A581E] font-medium px-4 py-3.5 rounded-lg transition-all duration-400 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <Typography variant="button" className="text-gray-700 group-hover:text-white font-medium transition-colors duration-400 ease-in-out">
                            Lanjut dengan Google
                        </Typography>
                    </button>

                    {/* Footer */}
                    <p className="mt-10 text-center text-xs text-gray-400 leading-relaxed">
                        Dengan masuk, Anda menyetujui{' '}
                        <a href="#" className="underline hover:text-gray-600 transition-colors">Syarat & Ketentuan</a>{' '}
                        serta{' '}
                        <a href="#" className="underline hover:text-gray-600 transition-colors">Kebijakan Privasi</a> kami.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-3 border-[#1A581E] border-t-transparent animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
