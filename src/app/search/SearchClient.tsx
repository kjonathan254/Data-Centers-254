"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  Clock,
  Shield,
  ArrowRight,
  Server,
  MapPin,
  Zap,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleResult {
  title: string;
  slug: string;
  tlDr: string | null;
  description: string | null;
  cluster: string;
  readingTimeMin: number | null;
  lastVerified: string | null;
}

interface FacilityResult {
  name: string;
  slug: string;
  city: string;
  status: string;
  itLoadMw: number | null;
  tierRating: string | null;
  facilityType: string | null;
  notable: string | null;
  operator: { name: string };
  connectivityProviders: { provider: { name: string } }[];
}

const clusterColors: Record<string, string> = {
  Beginner: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Kenya: "bg-green-500/10 text-green-400 border-green-500/20",
  Internet: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Energy: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Careers: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [articles, setArticles] = useState<ArticleResult[]>([]);
  const [facilities, setFacilities] = useState<FacilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setArticles([]);
      setFacilities([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setFacilities(data.facilities || []);
    } catch {
      setArticles([]);
      setFacilities([]);
    }
    setLoading(false);
  }, []);

  // Search on load if ?q= is present
  useEffect(() => {
    if (initialQ.length >= 2) {
      doSearch(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState(null, "", url.toString());
    doSearch(query);
  };

  const totalResults = articles.length + facilities.length;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Search Header */}
        <div className="mb-12">
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
            Search
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Find What You Need
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            Search across articles, the DC Directory, and the entire Data Centre 254 knowledge base.
          </p>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, facilities, topics..."
                className="w-full h-14 pl-12 pr-12 bg-surface border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all text-base"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); doSearch(""); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-accent rounded w-3/4 mb-2" />
                <div className="h-4 bg-accent rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && searched && totalResults === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <SearchIcon className="size-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
              Try different keywords, or browse our{" "}
              <Link href="/beginners" className="text-cyan underline hover:underline">beginner guides</Link>.
            </p>
          </div>
        )}

        {!loading && totalResults > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>

            {/* Facilities Section */}
            {facilities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Server className="size-4" />
                  DC Directory ({facilities.length})
                </h2>
                <div className="space-y-2">
                  {facilities.map((f, i) => (
                    <motion.div
                      key={f.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link
                        href={`/directory?highlight=${encodeURIComponent(f.name)}`}
                        className="block glass-card glass-card-hover rounded-xl p-4 sm:p-5 border border-border/50 hover:border-cyan/30 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-cyan transition-colors">
                                {f.name}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 rounded-full ${f.status === "Operational" ? "border-green-500/30 text-green-400" : "border-amber-500/30 text-amber-400"}`}
                              >
                                {f.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />{f.operator.name} &middot; {f.city}
                              </span>
                              {f.tierRating && (
                                <span>{f.tierRating}</span>
                              )}
                              {f.itLoadMw && (
                                <span className="flex items-center gap-1">
                                  <Zap className="size-3" />{f.itLoadMw}MW
                                </span>
                              )}
                            </div>
                            {f.connectivityProviders.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1.5">
                                {f.connectivityProviders.map((cp) => cp.provider.name).join(", ")}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground/30 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles Section */}
            {articles.length > 0 && (
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <SearchIcon className="size-4" />
                  Articles ({articles.length})
                </h2>
                <div className="space-y-2">
                  {articles.map((a, i) => (
                    <motion.div
                      key={a.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (facilities.length + i) * 0.05 }}
                    >
                      <Link
                        href={`/articles/${a.slug}`}
                        className="block glass-card glass-card-hover rounded-xl p-4 sm:p-5 border border-border/50 hover:border-cyan/30 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-cyan transition-colors">
                                {a.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 rounded-full ${clusterColors[a.cluster] || "border-border text-muted-foreground"}`}
                              >
                                {a.cluster}
                              </Badge>
                            </div>
                            {a.tlDr && (
                              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                                {a.tlDr}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
                              {a.readingTimeMin && (
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3" />{a.readingTimeMin} min
                                </span>
                              )}
                              {a.lastVerified && (
                                <span className="flex items-center gap-1">
                                  <Shield className="size-3" />Verified {a.lastVerified}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="size-4 text-muted-foreground/30 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state (no search yet) */}
        {!loading && !searched && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              Type at least 2 characters to search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
