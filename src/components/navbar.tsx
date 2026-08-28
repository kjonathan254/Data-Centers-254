"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Menu,
  Search,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";

// Load the Sheet-based mobile nav only on the client to avoid
// Radix UI aria-controls ID hydration mismatch
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <BrandLogo variant="nav" priority />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Explore dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 rounded-md"
              >
                Explore
                <ChevronDown className={`h-3 w-3 transition-transform ${exploreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 rounded-xl glass-card border border-border p-1.5 shadow-xl shadow-black/30"
                  >
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch={true}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center justify-between group"
                      >
                        {link.label}
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-cyan hover:bg-cyan/10 transition-all"
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
