# Article Template — SEO + AEO Ready
*(Copy this file per article. Fill every bracket. Delete instructions before publishing.)*

---

## 1. Front Matter (fill first — this drives everything else)

```yaml
title: ""              # 50–60 characters. Primary keyword near the front.
slug: ""                # kebab-case, matches title, no stop words if avoidable
meta_description: ""    # 150–160 characters, includes keyword + a reason to click
primary_keyword: ""     # the one phrase this article is built to rank for
secondary_keywords: []  # 3–6 related terms/questions to weave in naturally
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: ""     # link to an About/author page — required for E-E-A-T
published_date: ""      # YYYY-MM-DD
updated_date: ""        # update this every time you meaningfully revise
category: ""            # e.g. AI in Business, Seniors & Tech
canonical_url: ""        # the one true URL for this piece if it's cross-posted
og_image: ""             # 1200x630, has the headline burned into it
reading_time: ""         # auto or estimated
```

**Why each field matters:** title/description are what Google shows in results (and what AI systems quote when summarizing your page); the primary keyword decides what question you're answering; canonical URL stops Medium/LinkedIn cross-posts from competing with your own site for the same ranking.

---

## 2. The Headline

- [ ] States the topic in plain language — no clever wordplay that hides the keyword
- [ ] Primary keyword appears in the first half
- [ ] Promises something specific (a number, an outcome, a timeframe)
- [ ] Matches what the article actually delivers (mismatch = high bounce = ranking hit)

---

## 3. The Opening (first 100 words — this is what gets quoted)

AI answer engines and Google's AI Overviews tend to pull the **first clear, self-contained answer** on the page, not your best line three paragraphs in. Lead with it.

**Bad:** *"For the last seven years, the digital landscape has undergone a transformation…"*
**Good:** *"AI Overviews cite the page that answers a question in the fewest words, near the top. Here's how to write for that."*

- [ ] First 2–3 sentences directly answer the implied question in the headline
- [ ] No throat-clearing, no "in this article we will discuss"
- [ ] The one-sentence version of your whole article appears somewhere in this section

---

## 4. Structure (headings do double duty: skimming humans + parsing AI)

- [ ] H1 = title (one per page, matches front matter title)
- [ ] H2s are phrased as **questions or clear statements**, not vague labels
  - Bad: "Overview" / "Background" / "More Info"
  - Good: "What is AEO?" / "Why does Google cite some pages and not others?"
- [ ] Each H2 section could stand alone if someone only read that one section
- [ ] At least one list or table — AI extracts structured data far more reliably than prose
- [ ] Logical order: definition → how it works → why it matters → how to apply it

---

## 5. Body Content Checklist

- [ ] Answers the primary keyword's question **comprehensively** — cover the follow-up
      questions a reader would ask next (Google's AI Overviews often chain these)
- [ ] Defines jargon on first use (helps both new readers and AI extracting definitions)
- [ ] Includes at least one concrete example, case study, or "I tried this" detail —
      this is your **Experience** signal for Google's E-E-A-T
- [ ] Cites primary/authoritative sources (not just other blogs) with real links
- [ ] Kenyan-specific data, examples, or context included where relevant — this is
      differentiation no global competitor content can copy
- [ ] Addresses at least one common misconception or "people assume X, but actually Y"
- [ ] No filler paragraphs — if a sentence doesn't add information, cut it

---

## 6. FAQ Block (add to every article — cheapest AEO win available)

Format as literal Q&A. This maps directly to `FAQPage` schema and is what AI systems
lift almost verbatim.

```
**Q: [question in the reader's own words]**
A: [direct 1–3 sentence answer, then optional elaboration]

**Q: [related question]**
A: [...]
```

- [ ] 3–5 questions minimum
- [ ] Each answer works if read with zero other context on the page

---

## 7. E-E-A-T Signals (Google's quality framework — applies to AI selection too)

| Pillar | What to add to this article |
|---|---|
| **Experience** | First-hand detail, screenshots, "I tested/built/saw this" |
| **Expertise** | Your relevant credentials or track record, linked once |
| **Authoritativeness** | Links to/from other credible work you've published |
| **Trustworthiness** | Publish + update dates visible, clear author name, working links |

- [ ] Author byline links to a bio page with real credentials
- [ ] Publish date and "last updated" date both visible on the page
- [ ] No dead links, no vague unsourced claims

---

## 8. Structured Data (paste this on the live page, not just in the draft)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "REPLACE",
  "description": "REPLACE — same as meta_description",
  "image": "REPLACE — og_image URL",
  "datePublished": "REPLACE — YYYY-MM-DD",
  "dateModified": "REPLACE — YYYY-MM-DD",
  "author": {
    "@type": "Person",
    "name": "Kevin Jonathan Onyango Otieno",
    "url": "REPLACE — author page URL"
  },
  "publisher": {
    "@type": "Organization",
    "name": "REPLACE — e.g. Senior Citizens Tech Haven / Elmac AI",
    "logo": { "@type": "ImageObject", "url": "REPLACE" }
  }
}
```

If you added an FAQ block, also add `FAQPage` schema (see AEO reference — same pattern,
`mainEntity` is an array of `{question, answer}` pairs).

- [ ] Validate at https://validator.schema.org/ or Google's Rich Results Test before publishing

---

## 9. Technical / On-Page Checklist

- [ ] URL slug is short, matches primary keyword, no dates/numbers unless needed
- [ ] Meta title 50–60 chars / meta description 150–160 chars, no duplicates elsewhere on site
- [ ] Open Graph tags set (title, description, image, url, type=article) — this is what
      renders when the link is shared on WhatsApp, Facebook, LinkedIn
- [ ] One canonical URL declared if this piece is also posted to Medium/LinkedIn
- [ ] Images have descriptive alt text (not "image1.jpg") — also an AI/accessibility signal
- [ ] Internal links to 2–3 related articles on your own site
- [ ] External links to 1–2 authoritative outside sources
- [ ] Mobile rendering checked — you write mobile-first, but always preview the live page

---

## 10. AI Crawler Policy (decide once, apply site-wide — not per article)

**[Unverified/evolving — this is one of the fastest-moving parts of SEO; re-check every
few months rather than treating this as settled.]**

Your `robots.txt` decides whether AI systems can read (and potentially cite) your site:

```
User-agent: *
Allow: /

# Allow AI answer engines to crawl and cite you:
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

- Allowing these crawlers = eligible to be cited by ChatGPT, Claude, Perplexity, Google AI
  Overviews. Blocking them = your content can't train or be cited by that system.
- For someone building a personal AI-thought-leader brand, allowing crawlers is almost
  certainly the right default — being cited by name inside an AI answer is the whole point.
- Have one sitemap.xml that's actually current; a stale sitemap actively hurts you.

---

## 11. Freshness Plan

- [ ] Set a calendar reminder to revisit this article in 3–6 months
- [ ] When updating: make a **substantive** change (new data, new section, corrected
      claim) and update `dateModified` — cosmetic date-bumping with no real edit is a
      known way to lose trust with both Google and AI systems, not gain it

---

## 12. Pre-Publish Final Pass

- [ ] Read only the headline + first 100 words + headings — does it stand alone as an answer?
- [ ] Could a competitor's AI summary "steal" this article's value in one sentence? If yes,
      you haven't gone deep enough — comprehensiveness is what keeps people (and AI) coming
      back to the source instead of just the snippet
- [ ] Every fact checked against a primary source, not memory
- [ ] FAQ + Article schema both validated
- [ ] Shared preview (OG image/title/description) checked on at least one platform
