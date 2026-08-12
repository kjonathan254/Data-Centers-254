"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const config = {
  nav: { width: 83, height: 36, src: "/logo-nav.webp" },
  footer: { width: 55, height: 24, src: "/logo-footer.webp" },
  default: { width: 120, height: 52, src: "/logo.webp" },
} as const;

export type BrandLogoVariant = keyof typeof config;

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
}

export default function BrandLogo({
  variant = "nav",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const pathname = usePathname();
  const { width, height, src } = config[variant];

  const handleClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center shrink-0 group ${className}`}
      aria-label="Data Centre 254 — Home"
    >
      <div className="relative">
        <Image
          src={src}
          alt="Data Centre 254"
          width={width}
          height={height}
          priority={priority}
          className="object-contain transition-all duration-300"
          sizes={`${width}px`}
        />
        {/* Subtle glow on hover — matches the original Server icon effect */}
        <div className="absolute inset-0 bg-cyan/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </button>
  );
}
