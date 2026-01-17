import React from 'react';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    // Add any specific props if needed
}

export const Logo = ({ className, ...props }: LogoProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`} {...props}>
            <Image
                src="/images/Logo.svg"
                alt="PohonKu Logo"
                width={40}
                height={40}
                className="object-contain"
            />
            <div className="flex flex-col">
                <Typography variant="tahura-bunder" className="text-[#1A581E] leading-none text-left">
                    PohonKu
                </Typography>
            </div>
        </div>
    );
};
