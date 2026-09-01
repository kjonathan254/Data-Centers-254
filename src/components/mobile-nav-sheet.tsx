"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
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
  { label: "Ask Jibu", href: "/chat" },
  { label: "Glossary", href: "/glossary" },
  { label: "FAQ", href: "/faq" },
  { label: "Foundations", href: "/foundations" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileNavSheet({ open, onOpenChange }: MobileNavSheetProps) {
  const closeMobile = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl border-border p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-border">
            <BrandLogo variant="footer" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <p className="text-section-label px-3 mb-3">Topics</p>
            {topicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                onClick={closeMobile}
                className="block w-full text-left px-3 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border my-4" />

            <p className="text-section-label px-3 mb-3">Platform</p>
            {platformLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                onClick={closeMobile}
                className="block w-full text-left px-3 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
