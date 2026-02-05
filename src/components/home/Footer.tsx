'use client';

import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

// Custom SVG icons for TikTok and Flickr
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const FlickrIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <circle cx="8" cy="12" r="4"/>
    <circle cx="16" cy="12" r="4"/>
  </svg>
);

export const Footer = () => {
  const scrollToFAQ = () => {
    window.location.href = '/faq';
  };

  const navigateToContact = () => {
    window.location.href = '/contact';
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: '#E4405F' },
    { name: 'YouTube', icon: Youtube, href: '#', color: '#FF0000' },
    { name: 'TikTok', icon: TiktokIcon, href: '#', color: '#000000' },
    { name: 'Facebook', icon: Facebook, href: '#', color: '#1877F2' },
    { name: 'Twitter', icon: Twitter, href: '#', color: '#1DA1F2' },
    { name: 'Flickr', icon: FlickrIcon, href: '#', color: '#0063DC' }
  ];

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Left Section - Action Buttons */}
        <div className="footer-left">
          <div className="footer-buttons">
            <button onClick={scrollToFAQ} className="footer-btn">
              FAQ
            </button>
            <button onClick={navigateToContact} className="footer-btn primary">
              HUBUNGI KAMI
            </button>
          </div>
        </div>

        {/* Center Section - Copyright */}
        <div className="footer-center">
          <p className="footer-copyright">
            Copyright © {new Date().getFullYear()} PohonKu. All Rights Reserved.
          </p>
        </div>

        {/* Right Section - Social Media */}
        <div className="footer-right">
          <div className="social-links">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="social-link"
                  aria-label={social.name}
                  style={{ '--hover-color': social.color } as React.CSSProperties}
                >
                  <Icon />
                  <span className="social-tooltip">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
