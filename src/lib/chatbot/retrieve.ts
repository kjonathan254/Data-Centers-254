/**
 * Dependency-free BM25-style retrieval over the DC254 corpus.
 * Tuned for a small corpus (~400–700 chunks): full precision in-memory,
 * sub-millisecond scoring per query.
 */

const STOPWORDS = new Set([
  "a","an","the","and","or","but","if","of","to","in","on","at","by","for","with",
  "about","into","through","during","before","after","from","up","down","out","off",
  "over","under","again","further","then","once","here","there","when","where","why",
  "how","all","any","both","each","few","more","most","other","some","such","no","nor",
  "not","only","own","same","so","than","too","very","can","will","just","is","are",
  "was","were","be","been","being","have","has","had","do","does","did","i","me","my",
  "we","our","you","your","it","its","this","that","these","those","what","which","who",
  "whom","as","also","would","could","should","may","might","tell","please","give","show",
]);

/** Lowercase, strip punctuation, drop stopwords, light singularise. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map((t) =>
      t.endsWith("ies") && t.length > 4 ? t.slice(0, -3) + "y"
      : t.endsWith("es") && t.length > 3 ? t.slice(0, -2)
      : t.endsWith("s") && !t.endsWith("ss") && t.length > 3 ? t.slice(0, -1)
      : t,
    );
}

export interface IndexedChunk {
  id: string;
  kind: "article" | "glossary" | "faq" | "fact";
  title: string;
  heading?: string;
  slug?: string;
  href: string;
  text: string;
  /** Higher-weight kinds surface first on ties (curated answers beat prose). */
  boost: number;
  tokens: string[];
  tf: Map<string, number>;
  length: number;
}

export interface SearchHit {
  chunk: IndexedChunk;
  score: number;
  normalized: number;
}

const K1 = 1.4;
const B = 0.75;

export class SearchIndex {
  private chunks: IndexedChunk[] = [];
  private df = new Map<string, number>();
  private avgLen = 1;

  constructor(raw: Omit<IndexedChunk, "tokens" | "tf" | "length">[]) {
    this.chunks = raw.map((c) => {
      const tokens = tokenize(`${c.title} ${c.heading ?? ""} ${c.text}`);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      return { ...c, tokens, tf, length: tokens.length };
    });
    // Document frequency per term.
    for (const c of this.chunks) {
      for (const t of new Set(c.tf.keys())) {
        this.df.set(t, (this.df.get(t) ?? 0) + 1);
      }
    }
    this.avgLen =
      this.chunks.reduce((s, c) => s + c.length, 0) / Math.max(this.chunks.length, 1);
  }

  get size(): number {
    return this.chunks.length;
  }

  search(query: string, topK = 5): SearchHit[] {
    const qTokens = [...new Set(tokenize(query))];
    if (qTokens.length === 0 || this.chunks.length === 0) return [];
    const N = this.chunks.length;

    const hits: SearchHit[] = [];
    for (const c of this.chunks) {
      let score = 0;
      let matched = 0;
      for (const qt of qTokens) {
        const tf = c.tf.get(qt);
        if (!tf) continue;
        matched += 1;
        const idf = Math.log(1 + (N - (this.df.get(qt) ?? 0) + 0.5) / ((this.df.get(qt) ?? 0) + 0.5));
        score +=
          idf *
          ((tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (c.length / this.avgLen))));
      }
      if (score > 0 && matched / qTokens.length >= 0.34) {
        // Curated kinds + exact title hits rank ahead of prose.
        const titleTokens = new Set(tokenize(c.title));
        const titleBoost = qTokens.some((t) => titleTokens.has(t)) ? 1.2 : 1;
        const norm = (score * c.boost * titleBoost) / qTokens.length;
        hits.push({ chunk: c, score, normalized: norm });
      }
    }

    hits.sort((a, b) => b.normalized - a.normalized);
    return hits.slice(0, topK);
  }
}
