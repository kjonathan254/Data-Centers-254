"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Link as LinkIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { GlossaryTerm, GlossaryCategory } from "@/lib/glossary-data";

const categoryColors: Record<string, string> = {
  Fundamentals: "text-cyan bg-cyan/10 border-cyan/25",
  Standards: "text-purple-400 bg-purple-400/10 border-purple-400/25",
  Services: "text-green-400 bg-green-400/10 border-green-400/25",
  Infrastructure: "text-blue-400 bg-blue-400/10 border-blue-400/25",
  Energy: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  Connectivity: "text-rose-400 bg-rose-400/10 border-rose-400/25",
};

export default function GlossaryContent({
  terms,
  categories,
}: {
  terms: GlossaryTerm[];
  categories: readonly string[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.short.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !activeCategory || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [terms, search, activeCategory]);

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
            REFERENCE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
            Data Centre Glossary
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {terms.length} essential terms explained in plain language — with
            Kenya-specific context. Every definition includes real examples and
            links to deep-dive articles.
          </p>
        </div>

        {/* Search + Category Filters */}
        <div className="mb-10 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                !activeCategory
                  ? "bg-foreground text-background border-foreground"
                  : "text-muted-foreground border-border hover:border-muted-foreground"
              }`}
            >
              All ({terms.length})
            </button>
            {categories.map((cat) => {
              const count = terms.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    activeCategory === cat
                      ? categoryColors[cat] || "bg-foreground text-background"
                      : "text-muted-foreground border-border hover:border-muted-foreground"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-6">
          Showing {filtered.length} of {terms.length} terms
        </p>

        {/* Terms list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <BookOpen className="size-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No terms match your search.</p>
            </div>
          ) : (
            filtered.map((t) => {
              const isExpanded = expandedTerm === t.term;
              return (
                <div
                  key={t.term}
                  id={t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  className="glass-card rounded-xl border border-border/50 overflow-hidden"
                >
                  {/* Term header — always visible */}
                  <button
                    onClick={() =>
                      setExpandedTerm(isExpanded ? null : t.term)
                    }
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-start gap-3 sm:gap-4 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">
                          {t.term}
                        </h2>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            categoryColors[t.category] ||
                            "text-muted-foreground bg-muted border-border"
                          }`}
                        >
                          {t.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t.short}
                      </p>
                    </div>
                    <ChevronRight
                      className={`size-4 text-muted-foreground mt-1 shrink-0 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-5 border-t border-border/30">
                      <p className="mt-4 text-sm text-foreground/90 leading-relaxed">
                        {t.definition}
                      </p>

                      {/* Related terms */}
                      {t.relatedTerms && t.relatedTerms.length > 0 && (
                        <div className="mt-4">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            Related terms
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {t.relatedTerms.map((rt) => (
                              <button
                                key={rt}
                                onClick={() => {
                                  setSearch("");
                                  setActiveCategory(null);
                                  setExpandedTerm(rt);
                                  // Scroll to the term
                                  const el = document.getElementById(
                                    rt.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                                  );
                                  el?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                }}
                                className="px-2 py-0.5 rounded text-xs text-cyan bg-cyan/5 border border-cyan/20 hover:bg-cyan/10 transition-colors cursor-pointer"
                              >
                                {rt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related articles */}
                      {t.relatedArticles && t.relatedArticles.length > 0 && (
                        <div className="mt-4">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            Deep dives
                          </span>
                          <div className="mt-1.5 space-y-1">
                            {t.relatedArticles.map((a) => (
                              <Link
                                key={a.href}
                                href={a.href}
                                className="flex items-center gap-2 text-sm text-cyan hover:text-cyan/80 transition-colors group"
                              >
                                <LinkIcon className="size-3 shrink-0" />
                                <span className="group-hover:underline">{a.text}</span>
                                <ChevronRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            More terms added regularly. Have a suggestion?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            Suggest a term
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
