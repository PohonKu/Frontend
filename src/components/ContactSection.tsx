'use client';

import React, { useState, FormEvent } from 'react';
import { MapPin, Mail, Clock, Phone } from 'lucide-react';

import Image from 'next/image';
import styles from './ContactSection.module.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialLinks = [
    { name: 'Instagram', icon: '/images/PohonKu (FKT)/react-icons/io5/IoLogoInstagram.svg', href: '#' },
    { name: 'YouTube', icon: '/images/PohonKu (FKT)/react-icons/io5/IoLogoYoutube.svg', href: '#' },
    { name: 'TikTok', icon: '/images/PohonKu (FKT)/react-icons/io5/IoLogoTiktok.svg', href: '#' },
    { name: 'Facebook', icon: '/images/PohonKu (FKT)/react-icons/io5/IoLogoFacebook.svg', href: '#' },
    { name: 'Twitter', icon: '/images/PohonKu (FKT)/react-icons/io5/IoLogoTwitter.svg', href: '#' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className={styles.contactSection}>
      {/* Background */}
      <div className={styles.contactBackground}>
        <div className={styles.contactOverlay} />
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className={`${styles.successToast} ${styles.show}`} role="alert" aria-live="polite">
          <span>✓</span>
          <span>Pesan berhasil dikirim</span>
        </div>
      )}

      {/* Content */}
      <div className={styles.contactContent}>
        {/* Header */}
        <header className={styles.contactHeader}>
          <h1 className={styles.contactTitle}>Hubungi Kami</h1>
          <p className={styles.contactSubtitle}>
            Silakan hubungi kami melalui informasi kontak di bawah ini atau kirim pesan melalui formulir
          </p>
        </header>

        {/* Two Column Grid */}
        <div className={styles.contactGrid}>
          {/* Left Column - Contact Info */}
          <div className={styles.contactInfo}>
            {/* Location */}
            <div className={`${styles.contactBlock} group hover:-translate-y-1 hover:bg-white/5 transition-all duration-400 rounded-2xl p-4 md:p-5 -mx-4 md:-mx-5 border border-transparent hover:border-white/10 cursor-pointer`}>
              <div className={`${styles.iconContainer} group-hover:bg-[#1A581E] group-hover:shadow-[0_0_15px_rgba(26,88,30,0.5)] transition-all duration-400`}>
                <MapPin width={24} height={24} className={`${styles.contactIcon} group-hover:text-white transition-colors duration-400`} />
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Lokasi</h3>
                <p className={`${styles.contactText} mt-1 opacity-90 group-hover:opacity-100 transition-opacity leading-relaxed`}>
                  3HW4+M4W, Gading III, Gading, Kec. Playen, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55861
                </p>
              </div>
            </div>

            {/* Email */}
            <div className={`${styles.contactBlock} group hover:-translate-y-1 hover:bg-white/5 transition-all duration-400 rounded-2xl p-4 md:p-5 -mx-4 md:-mx-5 border border-transparent hover:border-white/10 cursor-pointer`}>
              <div className={`${styles.iconContainer} group-hover:bg-[#1A581E] group-hover:shadow-[0_0_15px_rgba(26,88,30,0.5)] transition-all duration-400`}>
                <Mail width={24} height={24} className={`${styles.contactIcon} group-hover:text-white transition-colors duration-400`} />
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Email</h3>
                <p className={`${styles.contactText} mt-1 opacity-90 group-hover:opacity-100 transition-opacity tracking-wide`}>pohonku@gmail.com</p>
              </div>
            </div>

            {/* Combined Phone Contacts */}
            <div className={`${styles.contactBlock} group hover:-translate-y-1 hover:bg-white/5 transition-all duration-400 rounded-2xl p-4 md:p-5 -mx-4 md:-mx-5 border border-transparent hover:border-white/10 cursor-pointer`}>
              <div className={`${styles.iconContainer} group-hover:bg-[#1A581E] group-hover:shadow-[0_0_15px_rgba(26,88,30,0.5)] transition-all duration-400`}>
                <Phone width={24} height={24} className={`${styles.contactIcon} group-hover:text-white transition-colors duration-400`} />
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Telepon & WhatsApp</h3>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#A2E3B1] bg-[#1A581E]/40 px-2 py-0.5 rounded border border-[#A2E3B1]/20 w-16 text-center shadow-sm">Umum</span>
                    <p className={`${styles.contactText} opacity-90 group-hover:opacity-100 transition-opacity tracking-wide`}>+62 857-1553-8430 <span className="text-gray-400 text-xs ml-1 font-normal tracking-normal">(Laras)</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#A2E3B1] bg-[#1A581E]/40 px-2 py-0.5 rounded border border-[#A2E3B1]/20 w-16 text-center shadow-sm">Teknis</span>
                    <p className={`${styles.contactText} opacity-90 group-hover:opacity-100 transition-opacity tracking-wide`}>+62 813-8385-7627 <span className="text-gray-400 text-xs ml-1 font-normal tracking-normal">(Arsya)</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className={`${styles.contactBlock} group hover:-translate-y-1 hover:bg-white/5 transition-all duration-400 rounded-2xl p-4 md:p-5 -mx-4 md:-mx-5 border border-transparent hover:border-white/10 cursor-pointer`}>
              <div className={`${styles.iconContainer} group-hover:bg-[#1A581E] group-hover:shadow-[0_0_15px_rgba(26,88,30,0.5)] transition-all duration-400`}>
                <Clock width={24} height={24} className={`${styles.contactIcon} group-hover:text-white transition-colors duration-400`} />
              </div>
              <div className={styles.contactDetails}>
                <h3 className={styles.contactLabel}>Jam Operasional</h3>
                <p className={`${styles.contactText} mt-1 opacity-90 group-hover:opacity-100 transition-opacity`}>Setiap hari: 08.00 - 15.30 (WIB)</p>
              </div>
            </div>

            {/* Social Media */}
            <div className={styles.socialSection}>
              <h3 className={styles.socialTitle}>Media Sosial</h3>
              <div className={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className={styles.socialLink}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className={styles.socialIcon}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form Card */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Sampaikan Pesan Anda</h2>

            <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
              {/* Name Field */}
              <div className={styles.formField}>
                <label htmlFor="name" className={styles.formLabel}>
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className={styles.formInput}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" className={styles.errorMessage}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className={styles.formField}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Masukkan email Anda"
                  className={styles.formInput}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" className={styles.errorMessage}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Subject Field */}
              <div className={styles.formField}>
                <label htmlFor="subject" className={styles.formLabel}>
                  Subjek
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Subjek pesan Anda"
                  className={styles.formInput}
                />
              </div>

              {/* Message Field */}
              <div className={styles.formField}>
                <label htmlFor="message" className={styles.formLabel}>
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tulis pesan Anda di sini..."
                  className={styles.formTextarea}
                  rows={4}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <span id="message-error" className={styles.errorMessage}>
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
