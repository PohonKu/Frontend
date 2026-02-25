'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';
import { Leaf } from 'lucide-react';

function LoginContent() {
    const searchParams = useSearchParams();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Base URL from env, fallback to production URL if not set locally
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
        <div className="bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative overflow-hidden transform transition-all hover:scale-[1.01] duration-500">

            {/* Decorative Blur Elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1A581E] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#029146] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo / Icon Area */}
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100">
                    <Leaf className="w-10 h-10 text-[#1A581E]" />
                </div>

                <Typography variant="h2" className="text-gray-900 mb-2 text-center">
                    Selamat Datang
                </Typography>
                <Typography variant="body" className="text-gray-500 mb-8 text-center text-sm">
                    Masuk ke PohonKu untuk memulai perjalanan konservasi Anda dan pantau pohon adopsi.
                </Typography>

                {errorMsg && (
                    <div className="w-full bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg animate-in fade-in slide-in-from-top-2 text-sm">
                        <p className="font-medium">{errorMsg}</p>
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium px-4 py-3.5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                    <Typography variant="button" className="text-gray-700 tracking-wide font-medium">
                        Lanjut dengan Google
                    </Typography>
                </button>

                <div className="mt-8 text-center text-xs text-gray-400">
                    Dengan masuk, Anda menyetujui <a href="#" className="underline hover:text-gray-600 transition-colors">Syarat & Ketentuan</a> serta <a href="#" className="underline hover:text-gray-600 transition-colors">Kebijakan Privasi</a> kami.
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
            <Suspense fallback={
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-[#1A581E] border-t-transparent animate-spin mb-4" />
                    <p className="text-[#1A581E] font-medium">Memuat...</p>
                </div>
            }>
                <LoginContent />
            </Suspense>
        </div>
    );
}
