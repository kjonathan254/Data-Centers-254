#!/usr/bin/env python3
"""16 Sep 2026: new-badge suppression flag + Gap 7 (GPU cloud) verification pass.
- articles.ts: optional `new` frontmatter flag; `new: false` suppresses the badge
  in isArticleFresh (user instruction: gap-program articles carry no New badge)
- GPU article: add the 10 Nov 2025 Atlancis/Everse/iXAfrica GPU-powered AI
  infrastructure launch (NVIDIA GPUs, hosted at iXAfrica Nairobi campus)
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent

def edit(path, old, new, count=1):
    p = ROOT / path
    t = p.read_text(encoding="utf-8")
    n = t.count(old)
    if n != count:
        print(f"[FAIL] {path}: {n} matches (want {count}) for: {old[:70]!r}"); sys.exit(1)
    p.write_text(t.replace(old, new), encoding="utf-8")
    print(f"[OK] {path}: {old[:52]!r}")

# ── 1. articles.ts: flag in interface ────────────────────────────────────────
edit("src/lib/articles.ts",
"  faq: ArticleFaq[];\n  canonical_url?: string;\n}",
"  faq: ArticleFaq[];\n  canonical_url?: string;\n  /** Set false to keep the green New badge off a story regardless of publish date. */\n  new?: boolean;\n}")

# ── 2. articles.ts: guard in isArticleFresh ─────────────────────────────────
edit("src/lib/articles.ts",
"""export function isArticleFresh(a: Article, now: Date = new Date()): boolean {
  const ageHours =""",
"""export function isArticleFresh(a: Article, now: Date = new Date()): boolean {
  if (a.frontmatter.new === false) return false;
  const ageHours = """)

# ── 3. Flag the gap-program articles published today (no New badge) ─────────
for f in [
    "content/articles/gpu-cloud-infrastructure-kenya.md",
    "content/articles/reduce-cloud-latency-kenya.md",
    "content/articles/colocation-data-centres-nairobi-buyers-guide.md",
    "content/articles/vps-hosting-kenya-mpesa-payment.md",
    "content/articles/raxio-vs-africa-data-centres-kenya-comparison.md",
]:
    edit(f, 'published_date: "2026-09-16"', 'published_date: "2026-09-16"\nnew: false')

# ── 4. GPU article: ground-truth paragraph on the Nov 2025 GPU launch ────────
edit("content/articles/gpu-cloud-infrastructure-kenya.md",
"Beyond iXAfrica, the pattern to know is this:",
"**The full stack is already running, not just the shells.** In November 2025, Atlancis Technologies, Everse Technology and iXAfrica jointly unveiled what the partners describe as East and Central Africa's first GPU-powered AI infrastructure, hosted at iXAfrica's Nairobi campus and built on NVIDIA GPUs (announcement dated 10 November 2025). The distinction matters: a facility that could host GPUs is a shell, while a facility where GPU clusters are installed, powered and cooled is a working AI factory, and Nairobi now has one. Kenyan teams can engage local providers for GPU capacity instead of importing every training run.\n\nBeyond iXAfrica, the pattern to know is this:")

# ── 5. GPU article: FAQ refresh (frontmatter + body, identical text) ─────────
edit("content/articles/gpu-cloud-infrastructure-kenya.md",
"iXAfrica's NBOX1 campus in Nairobi is explicitly built and marketed for high-density GPU hosting with a 22.5MW design capacity, and similar capacity is emerging as new facilities launch.",
"iXAfrica's NBOX1 campus in Nairobi is explicitly built and marketed for high-density GPU hosting with a 22.5MW design capacity, and since November 2025 the campus hosts a GPU-powered AI infrastructure service unveiled by Atlancis Technologies, Everse Technology and iXAfrica, built on NVIDIA GPUs. Similar capacity is emerging as new facilities launch.", count=2)

# ── 6. GPU article: source ───────────────────────────────────────────────────
edit("content/articles/gpu-cloud-infrastructure-kenya.md",
'  - title: "Marcopolis, IXAfrica: Building East Africa\'s First AI-Ready, Hyperscaler-Ready Data Centre (18 Jul 2025; high-density GPU hosting)"',
'  - title: "iXAfrica / iafrica.com: Atlancis Technologies, Everse Technology and iXAfrica unveil East and Central Africa\'s first GPU-powered AI infrastructure (10 November 2025; NVIDIA GPUs, Nairobi campus)"\n    url: "https://ixafrica.co.ke/"\n  - title: "Marcopolis, IXAfrica: Building East Africa\'s First AI-Ready, Hyperscaler-Ready Data Centre (18 Jul 2025; high-density GPU hosting)"')

print("BADGE FLAG + GPU PASS COMPLETE")
