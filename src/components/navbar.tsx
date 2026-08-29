"use client";

import { useState, useEffect } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";

// Load the Sheet-based mobile nav only on the client to avoid
// Radix UI aria-controls ID hydration mismatch
import dynamic from "next/dynamic";
const MobileNavSheet = dynamic(() => import("@/components/mobile-nav-sheet"), {
  ssr: false,
});

const topicLinks = [
  { label: "Data Centres", href: "/data-centres" },
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Map", href: "/infrastructure/map" },
  { label: "AI", href: "/ai" },
  { label: "Energy", href: "/energy" },
  { label: "Careers", href: "/careers" },
  { label: "Research", href: "/research" },
];

const platformLinks = [
  { label: "DC Directory", href: "/directory" },
  { label: "Glossary", href: "/glossary" },
  { label: "Foundations", href: "/foundations" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const exploreLinks = [
  { label: "Knowledge Base", href: "/data-centres" },
  ...platformLinks,
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <BrandLogo variant="nav" priority />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Explore dropdown — React hover/focus state, CSS transition */}
            <div
              className="relative"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 rounded-md"
                aria-haspopup="true"
                aria-expanded={exploreOpen}
                onClick={() => setExploreOpen((o) => !o)}
              >
                Explore
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute top-full left-0 pt-2 transition-all duration-150 ${
                  exploreOpen
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 translate-y-1"
                }`}
              >
                <div className="w-52 rounded-xl border border-border bg-card p-1.5 shadow-xl shadow-black/30">
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      onClick={() => setExploreOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-between"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main links */}
            {topicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Search + Mobile */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              prefetch={true}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-cyan hover:bg-cyan/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            <MobileNavSheet open={mobileOpen} onOpenChange={setMobileOpen} />
          </div>
        </div>
      </nav>
    </header>
  );
}
