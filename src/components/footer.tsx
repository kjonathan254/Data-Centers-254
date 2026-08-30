"use client";

import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

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
  { label: "Methodology", href: "/methodology" },
  { label: "Glossary", href: "/glossary" },
  { label: "Foundations", href: "/foundations" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="mb-5">
              <BrandLogo variant="footer" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Inside Kenya&apos;s digital infrastructure. Data centres,
              connectivity, power, AI, and the systems that make the digital world work.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/FinallyKayvoh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X/Twitter"
                className="h-8 w-8 rounded-lg bg-accent/50 hover:bg-cyan/10 hover:text-cyan flex items-center justify-center transition-all text-muted-foreground"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/in/kevin-jonathan-otieno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-8 w-8 rounded-lg bg-accent/50 hover:bg-cyan/10 hover:text-cyan flex items-center justify-center transition-all text-muted-foreground"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.instagram.com/kayvoh_da_5_7"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-lg bg-accent/50 hover:bg-cyan/10 hover:text-cyan flex items-center justify-center transition-all text-muted-foreground"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="mailto:elmaccommunicationslimited@gmail.com"
                aria-label="Email"
                className="h-8 w-8 rounded-lg bg-accent/50 hover:bg-cyan/10 hover:text-cyan flex items-center justify-center transition-all text-muted-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Topics Column */}
          <div>
            <h3 className="text-section-label mb-4">Topics</h3>
            <ul className="space-y-2.5">
              {topicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-section-label mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Data Centre 254. Inside Kenya&apos;s Digital Infrastructure.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              Nairobi, Kenya
            </span>
          </div>
        </div>
        <div className="pb-6 flex flex-wrap items-center justify-center sm:justify-between gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
          <Link href="/editorial-policy" className="hover:text-foreground transition-colors">Editorial Policy</Link>
          <Link href="/advertise" className="hover:text-foreground transition-colors">Advertise</Link>
        </div>
      </div>
    </footer>
  );
}
