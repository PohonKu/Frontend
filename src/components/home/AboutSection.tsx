import { Typography } from '@/components/ui/Typography';

interface AboutSectionProps {
  className?: string;
}

export function AboutSection({ className = '' }: AboutSectionProps) {
  return (
    <section id="about" className={`w-full min-h-[90vh] flex items-center bg-[#FDFDFD] py-16 px-6 md:px-12 lg:px-20 ${className}`}>
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Side: Brand and Description */}
        <div className="flex flex-col space-y-6 md:space-y-8">
          <Typography variant="tilt-title" className="text-[#1A581E]">
            PohonKu
          </Typography>
          <div className="flex flex-col space-y-4">
            <Typography variant="body" className="text-gray-700 text-base md:text-lg text-justify leading-relaxed">
              PohonKu merupakan program adopsi tanaman langka yang mengajak masyarakat untuk terlibat langsung dalam upaya konservasi tanaman langka. Pengadopsi atau dikenal dengan <em className="font-semibold text-[#1A581E] not-italic">Bestree</em> akan mendapat laporan perkembangan tanaman, sertifikat adopsi, dan akun personal untuk memantau dampak lingkungan seperti serapan karbon dan simpanan air.
            </Typography>
            <Typography variant="body" className="text-gray-700 text-base md:text-lg text-justify leading-relaxed">
              Sasaran utama dari bisnis ini adalah pecinta lingkungan utamanya generasi muda, keluarga untuk edukasi anak, serta perusahaan yang menjalankan program CSR. Kanal distribusi utamanya berupa website dan media sosial, didukung kerja sama dengan NGO, kampus, serta kehadiran di event bertema lingkungan.
            </Typography>
          </div>
        </div>

        {/* Right Side: Visi Misi Card */}
        <div className="bg-[#1A581E] text-white rounded-[2rem] p-10 md:p-14 shadow-2xl flex flex-col space-y-10 relative overflow-hidden">
          {/* Subtle decorations to make it less plain but minimalist */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          {/* Background tree illustration */}
          <div
            className="absolute top-0 left-0 right-0 -bottom-32 pointer-events-none z-0"
            style={{
              backgroundImage: "url('/gambarCici/bg1.svg')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              filter: 'invert(1)',
              opacity: 0.06,
            }}
          />

          {/* Visi */}
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <Typography variant="tilt-label" className="text-[#A2E3B1] tracking-[0.2em] text-sm md:text-base uppercase flex flex-col items-center gap-2">
              Visi
            </Typography>
            <Typography variant="body" className="text-white font-medium text-[17px] md:text-xl leading-relaxed max-w-[90%] mx-auto">
              "Menjadi platform adopsi tanaman langka terpercaya dalam pelestarian lingkungan di Indonesia"
            </Typography>
          </div>

          {/* Separator */}
          <div className="w-16 h-px bg-[#A2E3B1]/30 mx-auto relative z-10 transition-all"></div>

          {/* Misi */}
          <div className="flex flex-col items-center text-center space-y-5 relative z-10">
            <Typography variant="tilt-label" className="text-[#A2E3B1] tracking-[0.2em] text-sm md:text-base uppercase flex flex-col items-center gap-2">
              Misi
            </Typography>
            <ul className="text-white text-[15px] md:text-[17px] leading-relaxed space-y-3 text-left w-full max-w-[90%] mx-auto list-disc marker:text-[#A2E3B1] pl-5">
              <li className="pl-1">Melestarikan keanekaragaman hayati melalui program adopsi tanaman langka.</li>
              <li className="pl-1">Memfasilitasi kolaborasi antara publik dan komunitas pecinta lingkungan hidup.</li>
              <li className="pl-1">Mengembangkan teknologi yang ramah pengguna.</li>
              <li className="pl-1">Menyediakan sistem yang transparan dan kredibel.</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
