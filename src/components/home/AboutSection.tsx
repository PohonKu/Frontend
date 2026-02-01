import React from 'react';
import { Typography } from '@/components/ui/Typography';

export const AboutSection = () => {
    return (
        <section className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="max-w-[1780px] mx-auto px-6 lg:px-8">

                {/* Main Content Container - gap from Figma */}
                <div className="flex flex-col gap-10">

                    {/* Title Section - "PohonKu" with description */}
                    <div className="flex flex-col gap-5">
                        {/* Main Title - Centered */}
                        <Typography variant="tilt-title" className="text-[#2A3D0B] text-center">
                            PohonKu
                        </Typography>

                        {/* Description - Left aligned, Inter font */}
                        <p className="text-black text-left text-base md:text-lg lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                            PohonKu merupakan program adopsi tanaman langka yang mengajak masyarakat untuk terlibat langsung dalam upaya konservasi tanaman langka. Pengadopsi atau dikenal dengan Bestree akan mendapat laporan perkembangan tanaman, sertifikat adopsi, dan akun personal untuk memantau dampak lingkungan seperti serapan karbon dan simpanan air. Sasaran utama dari bisnis ini adalah pecinta lingkungan utamanya generasi muda, keluarga untuk edukasi anak, serta perusahaan yang menjalankan program CSR. Kanal distribusi utamanya berupa website dan media sosial, didukung kerja sama dengan NGO, kampus, serta kehadiran di event bertema lingkungan.
                        </p>
                    </div>

                    {/* Info Section - Image + Text */}
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        {/* Image Placeholder - Fixed width from Figma */}
                        <div className="w-[430px] h-[200px] bg-[#D9D9D9] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 text-sm">Foto Placeholder</span>
                        </div>

                        {/* Text Block - Inter font */}
                        <p className="text-black text-base lg:text-xl leading-relaxed flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>

                    {/* Visi Misi Section - Side by side, large gap like Figma */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-80">

                        {/* Visi - Left side */}
                        <div className="flex flex-row items-start gap-8">
                            <Typography variant="tilt-label" className="text-[#1A581E] text-2xl whitespace-nowrap">
                                Visi:
                            </Typography>
                            <p className="text-black text-base lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Menjadi platform adopsi tanaman langka terpercaya dalam pelestarian lingkungan di Indonesia
                            </p>
                        </div>

                        {/* Misi - Right side */}
                        <div className="flex flex-row items-start gap-8">
                            <Typography variant="tilt-label" className="text-[#1A581E] text-2xl whitespace-nowrap">
                                Misi:
                            </Typography>
                            <ul className="flex flex-col gap-3 list-disc list-inside">
                                <li className="text-black text-base lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Melestarikan keanekaragaman hayati melalui program adopsi tanaman langka
                                </li>
                                <li className="text-black text-base lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Memfasilitasi kolaborasi antara publik dan komunitas pecinta lingkungan untuk pelestarian lingkungan hidup
                                </li>
                                <li className="text-black text-base lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Mengembangkan teknologi yang ramah pengguna
                                </li>
                                <li className="text-black text-base lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Menyediakan sistem yang transparan dan kredibel
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};
