'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../FAQSection.css';

export default function FAQPage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqItems = [
    {
      question: "Bagaimana cara mengadopsi pohon?",
      answer: "Anda dapat mengadopsi pohon dengan memilih jenis pohon yang tersedia di halaman Koleksi Pohon, lalu klik tombol 'Adopt Tree' dan ikuti langkah-langkah pembayaran."
    },
    {
      question: "Apa yang didapatkan setelah mengadopsi pohon?",
      answer: "Anda akan mendapatkan sertifikat adopsi digital, pembaruan berkala tentang perkembangan pohon yang Anda adopsi, dan kesempatan untuk mengunjungi lokasi pohon."
    },
    {
      question: "Berapa lama masa adopsi pohon?",
      answer: "Program adopsi tersedia dalam pilihan 1 tahun, 3 tahun, atau 5 tahun. Anda dapat memperpanjang masa adopsi setelah periode berakhir."
    },
    {
      question: "Apakah bisa mengunjungi lokasi pohon?",
      answer: "Ya, adopter dapat mengunjungi lokasi pohon di Tahura Bunder dengan memberikan pemberitahuan terlebih dahulu kepada tim kami."
    },
    {
      question: "Bagaimana jika pohon yang diadopsi tidak tumbuh dengan baik?",
      answer: "Tim ahli kami akan memantau kesehatan semua pohon secara berkala. Jika terjadi masalah, kami akan menanam pohon pengganti tanpa biaya tambahan."
    },
    {
      question: "Apakah ada kontribusi bagi pemilik lahan?",
      answer: "Ya, sebagian dari dana adopsi diberikan kepada pemilik lahan lokal sebagai bentuk keadilan ekonomi dan dukungan terhadap masyarakat sekitar."
    },
    {
      question: "Bagaimana memantau perkembangan pohon?",
      answer: "Anda akan menerima laporan berkala setiap 3 bulan yang berisi foto terbaru, tingkat pertumbuhan, dan status kesehatan pohon yang Anda adopsi."
    },
    {
      question: "Apakah bisa mengadopsi lebih dari satu pohon?",
      answer: "Tentu! Anda dapat mengadopsi sebanyak-banyaknya pohon yang Anda inginkan. Setiap pohon akan memiliki ID unik dan laporan perkembangan terpisah."
    }
  ];

  return (
    <main className="faq-page">
      <div className="faq-container">
        <h1 className="faq-title">FAQ</h1>
        <p className="faq-subtitle">
          Pertanyaan yang sering diajukan seputar program adopsi pohon
        </p>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${activeFAQ === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="question-text">{item.question}</span>
                {activeFAQ === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              <div className={`faq-answer ${activeFAQ === index ? 'show' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
