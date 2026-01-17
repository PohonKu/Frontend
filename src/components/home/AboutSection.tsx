import React from 'react';
import { Typography } from '@/components/ui/Typography';

export const AboutSection = () => {
    return (
        <section className="py-20 border-b border-gray-200">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Placeholder for Image */}
                <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-400 italic">About Image Placeholder</p>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    <Typography variant="h2" className="text-gray-900">
                        About PohonKu
                    </Typography>

                    <Typography variant="body" className="text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Typography>

                    <Typography variant="body" className="text-gray-600">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                    </Typography>

                    {/* TODO: Add 'Learn More' button or link */}
                </div>
            </div>
        </section>
    );
};
