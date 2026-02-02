import React, { ElementType } from "react";

// Update TypoVariant dengan varian baru
type TypoVariant =
  | "d1" | "d2"
  | "h1" | "h2" | "h3"
  | "title" | "body" | "label"
  | "c1" | "c2"
  // Varian Baru Spesifik Desain:
  | "tahura-bunder"  // Untuk style TahuraBunder (Inria Serif)
  | "beranda-nav"   // Untuk style Beranda (Inria Serif)
  | "tilt-title"    // Untuk judul besar (Tilt Warp) - PohonKu title
  | "tilt-label"   // Untuk label kecil (Tilt Warp) - Visi/Misi labels
  | "tilt-zone";    // Untuk nama zona (Tilt Warp) - Zone names

type TypoWeight = "light" | "regular" | "medium" | "semibold" | "bold";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: TypoVariant;
  weight?: TypoWeight;
  component?: ElementType;
  className?: string;
}

// Update Mapping Style
const variantStyles: Record<TypoVariant, string> = {
  // ... style lama ...
  d1: "text-5xl md:text-6xl font-serif tracking-tight leading-tight",
  d2: "text-4xl md:text-5xl font-serif tracking-tight leading-tight",
  h1: "text-3xl md:text-4xl font-serif leading-snug",
  h2: "text-2xl md:text-3xl font-serif leading-snug",
  h3: "text-xl md:text-2xl font-serif leading-snug",
  title: "text-lg md:text-xl font-sans leading-normal",
  body: "text-base font-sans leading-relaxed text-gray-600",
  label: "text-sm font-sans uppercase tracking-wider",
  c1: "text-sm font-sans text-gray-500",
  c2: "text-xs font-sans text-gray-400",

  // --- STYLE BARU SESUAI REQUEST ---

  // TahuraBunder: Inria Serif, 14px, Bold, 100% LH (Updated per request)
  // TahuraBunder: Inria Serif, 14px, 100% LH (Bold applied via weight logic)
  "tahura-bunder": "font-inria text-[14px] leading-[100%] tracking-normal text-center align-middle",

  // Beranda / Beranda-Nav: Inria Serif, 14px, 100% LH (Bold applied via weight logic)
  "beranda-nav": "font-inria text-[14px] leading-[100%] tracking-normal",

  // Tilt Title: Tilt Warp, 96px, 121px LH untuk judul "PohonKu"
  "tilt-title": "font-tilt text-[96px] leading-[121px] tracking-normal flex items-center",

  // Tilt Label: Tilt Warp, 24px, 30px LH untuk label "Visi:" dan "Misi:"
  "tilt-label": "font-tilt text-[24px] leading-[30px] tracking-normal",

  // Tilt Zone: Tilt Warp, 14px untuk nama zona
  "tilt-zone": "font-tilt text-[14px] leading-[100%] tracking-normal",
};

const weightStyles: Record<TypoWeight, string> = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const defaultTags: Record<TypoVariant, ElementType> = {
  d1: "h1", d2: "h1", h1: "h1", h2: "h2", h3: "h3",
  title: "h4", body: "p", label: "span", c1: "span", c2: "span",

  // Default tags untuk varian baru
  "tahura-bunder": "span", // Biasanya logo text pakai span/h1
  "beranda-nav": "span",   // Link navigasi pakai span
  "tilt-title": "h1",      // Judul besar PohonKu
  "tilt-label": "span",    // Label Visi/Misi
  "tilt-zone": "h3",       // Zone names
};

export function Typography({
  children,
  variant = "body",
  weight = "regular", // Default weight akan ditimpa oleh class spesifik jika perlu
  component,
  className = "",
  ...props
}: TypographyProps) {
  const Tag = component || defaultTags[variant];

  // Logic khusus: Jika varian adalah 'beranda-nav', 'tahura-bunder', 'tilt-label', atau 'tilt-zone', kita paksa weight jadi Bold secara default
  // kecuali user override lewat props.
  const isCustomVariant = variant === 'beranda-nav' || variant === 'tahura-bunder' || variant === 'tilt-label' || variant === 'tilt-zone';
  const appliedWeight = isCustomVariant && weight === 'regular' ? 'bold' : weight;

  const finalClassName = [
    variantStyles[variant],
    weightStyles[appliedWeight],
    className
  ].join(" ");

  return (
    <Tag className={finalClassName} {...props}>
      {children}
    </Tag>
  );
}