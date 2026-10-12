"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";

// Nav links live in one module (was copy-pasted in navbar + footer — Task 130
// backlog). Mobile keeps its desktop-plus-FAQ platform list from the module.
import {
  TOPIC_LINKS as topicLinks,
  MOBILE_PLATFORM_LINKS as platformLinks,
} from "@/lib/nav-data";

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileNavSheet({ open, onOpenChange }: MobileNavSheetProps) {
  const closeMobile = () => onOpenChange(false);

  // Trigger lives in the navbar (server-rendered hamburger, perf audit H2);
  // this component is the controlled panel only, lazy-mounted on first open.
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                className="block w-full text-left px-3 py-3 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
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
                className="block w-full text-left px-3 py-3 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
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
