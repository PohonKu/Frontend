import React, { ElementType } from "react";

/**
 * Typography System for PohonKu
 * 
 * Font Rules:
 *   - Tilt Warp  (font-tilt)  → titles, subtitles, section headings
 *   - Inter      (font-sans)  → body text, descriptions, labels, captions
 *   - Inria Serif(font-inria) → buttons (navbar, footer, CTA, send)
 */

type TypoVariant =
  | "d1" | "d2"
  | "h1" | "h2" | "h3"
  | "title" | "body" | "label"
  | "c1" | "c2"
  // Tilt Warp variants (titles/headings)
  | "tilt-title"    // Large page title (e.g. "PohonKu")
  | "tilt-subtitle" // Section subtitles (e.g. "About", "FAQ")
  | "tilt-label"    // Small heading labels (e.g. "Visi:", "Misi:")
  | "tilt-zone"     // Zone names in maps
  // Inria Serif variants (buttons/nav)
  | "nav-link"      // Navbar links
  | "button";       // Buttons (CTA, send, footer)

type TypoWeight = "light" | "regular" | "medium" | "semibold" | "bold";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: TypoVariant;
  weight?: TypoWeight;
  component?: ElementType;
  className?: string;
}

const variantStyles: Record<TypoVariant, string> = {
  // ── Tilt Warp: Titles & Headings ──
  d1: "font-tilt text-5xl md:text-6xl tracking-tight leading-tight",
  d2: "font-tilt text-4xl md:text-5xl tracking-tight leading-tight",
  h1: "font-tilt text-3xl md:text-4xl leading-snug",
  h2: "font-tilt text-2xl md:text-3xl leading-snug",
  h3: "font-tilt text-xl md:text-2xl leading-snug",

  // ── Inter: Body & Content ──
  title: "font-sans text-lg md:text-xl leading-normal",
  body: "font-sans text-base leading-relaxed text-gray-600",
  label: "font-sans text-sm uppercase tracking-wider",
  c1: "font-sans text-sm text-gray-500",
  c2: "font-sans text-xs text-gray-400",

  // ── Tilt Warp: Specific Design Variants ──
  "tilt-title": "font-tilt text-[96px] leading-[121px] tracking-normal flex items-center",
  "tilt-subtitle": "font-tilt text-[56px] leading-[100%] tracking-normal",
  "tilt-label": "font-tilt text-[24px] leading-[30px] tracking-normal",
  "tilt-zone": "font-tilt text-[14px] leading-[100%] tracking-normal",

  // ── Inria Serif: Buttons & Navigation ──
  "nav-link": "font-inria text-[14px] leading-[100%] tracking-normal",
  "button": "font-inria text-[14px] leading-[100%] tracking-normal",
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
  "tilt-title": "h1",
  "tilt-subtitle": "h2",
  "tilt-label": "span",
  "tilt-zone": "h3",
  "nav-link": "span",
  "button": "span",
};

export function Typography({
  children,
  variant = "body",
  weight = "regular",
  component,
  className = "",
  ...props
}: TypographyProps) {
  const Tag = component || defaultTags[variant];

  // Nav links and buttons default to bold weight; Tilt Warp stays at 400 (regular)
  const isButtonOrNav = variant === "nav-link" || variant === "button";
  const appliedWeight = isButtonOrNav && weight === "regular" ? "bold" : weight;

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