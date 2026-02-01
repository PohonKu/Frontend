import React from 'react';
import Image from 'next/image';

export const Header = () => {
    return (
        <section className="relative w-full">
            {/* Hero Image - Fixed aspect ratio to maintain pixel quality */}
            <div className="relative w-full h-auto">
                <Image
                    src="/images/bgTahuraHeader.svg"
                    alt="Tahura Bunder Landscape"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                    priority
                />
            </div>
        </section>
    );
};
