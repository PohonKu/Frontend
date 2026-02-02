import './AboutSection.css';

interface AboutSectionProps {
  className?: string;
}

export function AboutSection({ className = '' }: AboutSectionProps) {
  return (
    <section id="about" className={`about-section ${className}`}>
      <div className="about-container">
        {/* Header */}
        <h1 className="about-title">PohonKu</h1>

        {/* Main Description */}
        <p className="about-description">
          PohonKu merupakan program adopsi tanaman langka yang mengajak masyarakat untuk terlibat langsung dalam upaya konservasi tanaman langka. Pengadopsi atau dikenal dengan <em>Bestree</em> akan mendapat laporan perkembangan tanaman, sertifikat adopsi, dan akun personal untuk memantau dampak lingkungan seperti serapan karbon dan simpanan air. Sasaran utama dari bisnis ini adalah pecinta lingkungan utamanya generasi muda, keluarga untuk edukasi anak, serta perusahaan yang menjalankan program CSR. Kanal distribusi utamanya berupa <em>website</em> dan media sosial, didukung kerja sama dengan NGO, kampus, serta kehadiran di <em>event</em> bertema lingkungan.
        </p>

        {/* Content Grid */}
        <div className="about-content">
          {/* Image Placeholder */}
          <div className="about-image">
            {/* Placeholder for image */}
          </div>

          {/* Lorem Ipsum Text */}
          <div className="about-text">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>

        {/* Vision and Mission Grid */}
        <div className="vision-mission-grid">
          {/* Vision */}
          <div className="vision-card">
            <h2 className="card-title">Visi:</h2>
            <p className="card-content">
              Menjadi <em>platform</em> adopsi tanaman langka terpercaya dalam pelestarian lingkungan di Indonesia
            </p>
          </div>

          {/* Mission */}
          <div className="mission-card">
            <h2 className="card-title">Misi:</h2>
            <ul className="mission-list">
              <li>Melestarikan keanekaragaman hayati melalui program adopsi tanaman langka</li>
              <li>Memfasilitasi kolaborasi antara publik dan komunitas pecinta lingkungan untuk pelestarian lingkungan hidup</li>
              <li>Mengembangkan teknologi yang ramah pengguna</li>
              <li>Menyediakan sistem yang transparan dan kredibel</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
