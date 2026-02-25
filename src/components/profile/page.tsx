// components/ProfileImage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
}

export const ProfileImage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ FIX: Ambil token dari localStorage
        const token = localStorage.getItem('access_token');

        console.log(token)
        console.log('🔑 Token:', token ? token.substring(0, 20) + '...' : 'TIDAK ADA');

        // Jika tidak ada token, user belum login
        if (!token) {
          setLoading(false);
          return;
        }

        // ✅ FIX: Kirim token via Authorization header
        const res = await fetch('http://localhost:2000/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('📡 Response status:', res.status);

        if (!res.ok) {
          // Token expired atau invalid
          const errorData = await res.json();
          console.error('❌ API Error:', errorData);

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log('User fetched:', data);

        // Response dari backend: { success: true, data: { id, email, avatarUrl, ... } }
        setUser(data.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);



  // Loading state
  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
    );
  }
  console.log("AVATAR:", user?.avatarUrl);


  // Belum login - tampilkan icon guest
  if (!user) {
    return (
      <Link href="/login?redirect=/dashboard">
        <Image
          src="/images/guestProfile.svg"
          alt="Guest"
          width={36}
          height={36}
          className="rounded-full border-2 border-transparent hover:border-[#1A581E] transition-colors"
        />
      </Link>
    );
  }

  // Sudah login - tampilkan avatar
  return (
    <Link
      href="/dashboard"
      className="hover:opacity-80 transition-opacity transform hover:scale-110 duration-200"
    >
      <Image
        src={user.avatarUrl ?? '/images/guestProfile.svg'}
        alt={user.fullName ?? 'Profile'}
        width={36}
        height={36}
        className="rounded-full border-2 border-transparent hover:border-[#1A581E] transition-colors"
      />
    </Link>
  );
};