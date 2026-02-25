'use client';

import React from 'react';
import { Typography } from '@/components/ui/Typography';

interface LoginButtonProps {
  redirectUrl?: string; // opsional, default ke backend
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  redirectUrl = '/login',
}) => {
  const handleLogin = () => {
    window.location.href = redirectUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-[#1A581E] hover:bg-[#029146] text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
    >
      <Typography variant="button" className="text-white text-sm font-semibold">
        Login
      </Typography>
    </button>
  );
};
