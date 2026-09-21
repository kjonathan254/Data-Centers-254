"use client";

import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

const topicLinks = [
  { label: "Data Centres", href: "/data-centres" },
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Map", href: "/infrastructure/map" },
  { label: "Policy & Regulation", href: "/policy" },
  { label: "AI", href: "/ai" },
  { label: "Energy", href: "/energy" },
  { label: "Careers", href: "/careers" },
  { label: "Research", href: "/research" },
];

const platformLinks = [
  { label: "DC Directory", href: "/directory" },
  { label: "Tracker", href: "/tracker" },
  { label: "Compare", href: "/directory/compare" },
  { label: "Data Exports", href: "/data-exports" },
  { label: "Ask Jibu", href: "/chat" },
  { label: "Methodology", href: "/methodology" },
  { label: "Corrections", href: "/corrections" },
  { label: "Glossary", href: "/glossary" },
  { label: "Kiswahili Glossary", href: "/glossary/kiswahili" },
  { label: "FAQ", href: "/faq" },
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
            {/* Masthead hierarchy: brand · tagline · publisher · place.
                Reads as a publication Elmac owns and operates, not a client credit. */}
            <p className="text-base font-semibold tracking-tight text-foreground mb-2">
              DataCentre254
            </p>
            <p className="text-sm font-medium text-foreground/80 leading-relaxed mb-2 max-w-xs">
              Digital infrastructure intelligence from Kenya
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              An{" "}
              <Link href="/about" className="text-foreground/70 hover:text-cyan underline underline-offset-2">
                Elmac Communications Ltd
              </Link>{" "}
              publication
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 max-w-xs">
              Nairobi, Kenya
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://whatsapp.com/channel/0029Vb8Ob1ZK0IBfXJc9P427"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                className="h-8 w-8 rounded-lg bg-accent/50 hover:bg-cyan/10 hover:text-cyan flex items-center justify-center transition-all text-muted-foreground"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
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
                    className="inline-block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                    className="inline-block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            &copy; {new Date().getFullYear()} Data Centre 254. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            An Elmac Communications Ltd publication
          </p>
        </div>
        <div className="pb-6 flex flex-wrap items-center justify-center sm:justify-between gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
          <Link href="/editorial-policy" className="hover:text-foreground transition-colors">Editorial Policy</Link>
          <Link href="/methodology" className="hover:text-foreground transition-colors">Data Methodology</Link>
          <Link href="/advertise" className="hover:text-foreground transition-colors">Advertise</Link>
        </div>
      </div>
    </footer>
  );
}
