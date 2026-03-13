'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number; // Delay in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number; // Duration in ms
}

export const FadeIn = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '',
  duration = 1000 
}: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger once when it intersects
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getDirectionClass = () => {
    if (isVisible) return 'translate-y-0 translate-x-0 opacity-100';
    
    switch (direction) {
      case 'up': return 'translate-y-12 opacity-0';
      case 'down': return '-translate-y-12 opacity-0';
      case 'left': return 'translate-x-12 opacity-0';
      case 'right': return '-translate-x-12 opacity-0';
      case 'none': return 'opacity-0';
      default: return 'translate-y-12 opacity-0';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all ease-out ${getDirectionClass()} ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
       }}
    >
      {children}
    </div>
  );
};
