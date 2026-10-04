# Newsletter Cadence & Segment Streams

**Owner: Kevin Jonathan Otieno. Companion to docs/NEWS-TO-ASSETS-PLAYBOOK.md
and docs/RESEARCH-VERIFICATION-STANDARDS.md. This page formalises what the
signup forms promise ("One concise briefing every Monday. Unsubscribe anytime.")
so the commitment survives beyond any single month's energy.**

> **Cadence change, October 2026:** The Rack Report returns to **weekly**
> (every Monday) with Issue 002, published **Monday 5 October 2026**.
> Editor's ruling, 5 October 2026: "I would make The Rack Report less of a
> 'newsletter of links' and more of a weekly intelligence briefing. Its job
> is: What changed? What can we verify? Why does it matter? What should we
> watch next?" The weekly loop pairs the Monday briefing with Wednesday's
> investigation and Friday's flagship intelligence on the site. The September
> 2026 monthly interlude is superseded; issue numbering continues
> sequentially (Issue 001 shipped 14 September 2026).
>
> **Cadence change, September 2026 (superseded 5 October 2026):** moved from
> weekly to monthly (first Monday) with the original Issue 002 send; rationale
> was sustainability alongside the reporting load. The weekly intelligence
> briefing format restores weekly cadence at lower per-issue weight.

## The two streams

| Stream | Cadence | Send window | Format | Status page |
|---|---|---|---|---|
| The Rack Report | Weekly, Monday | 06:00 EAT (03:00 UTC) | Email + PDF | /rack-report |
| DC254 Brief | Monthly, first Tuesday | 06:00 EAT | Email + web summary | /research |

- **The Rack Report** is the flagship: the week's most important
  developments in the seven-section briefing anatomy (Headline, By the
  Numbers, Infrastructure Intelligence, Inside the Map, Policy Watch, What
  We're Watching, From DataCentre254). Issue numbering is sequential and
  never skips; if a Monday must slip, the issue ships the next day with a
  dated editor's note.
- **The DC254 Brief** is the monthly digest: what changed in the durable
  assets (directory, trackers, snapshots), what shipped on the site, and
  what the next month is watching. It is the segmentation-aware stream.

## Cadence rules

1. **A cadence is a promise, printed on the page.** The signup forms, the
   landing pages and this document state the same schedule. If the schedule
   changes, all three change together in one commit.
2. **Never skip silently.** A missed month gets a dated note in the next
   issue. Reliability is part of the trust product.
3. **Issues are numbered.** Issue N+1 follows issue N; the archive lives in
   `docs/newsletter/` (working files) and `public/reports/` (published PDFs).
4. **Every issue links its sources.** Same verification chain as articles;
   single-source claims are labelled Medium at best.

## Segment streams (the audience is the product)

Signup captures `role` (one of seven segments) + `companyType` + `source`
page. The segments, from `src/lib/newsletter-store.ts`:

| Segment (role) | What they get first |
|---|---|
| `operator` | Capacity pipeline moves, facility status changes, tracker updates |
| `leadership` | Cost benchmarks (tariffs), sovereignty/licensing changes, buyer guidance |
| `investor` | Pipeline staging moves, operator scoreboard, market outlook |
| `journalist` | Dated, sourced figures they can cite; dataset bundles; corrections log |
| `vendor` | Operator expansion signals, market-entry explainers |
| `student` | Beginner cluster, glossary, Kiswahili glossary, career explainers |
| `other` | The shared core: monthly headline + one durable-asset update |

Segmentation is **ordering, not exclusion**: everyone gets the Rack Report
core; the DC254 Brief and any future segment digests lead with the section
their segment told us they care about. No segment-gated paywalls exist above
the trust engine.

## Sponsor-ready inventory (rules)

- One sponsor per Rack Report issue, clearly labelled, tracked click report
  per slot (sponsor click counters already run in the newsletter store).
- Segment counts shown on /advertise come from the live store, never inflated.
- The quarterly State of the Market dataset bundle is the sponsorship
  adjacent product: free, cited, and proof of the audience's professionalism.

## Definition of done (per issue)

- [ ] Issue numbered, dated, sources listed, confidence stated
- [ ] Durable assets checked against the playbook checklist before send
- [ ] Segment leads applied (Brief) / anatomy complete (Rack Report)
- [ ] Archive copy saved to `docs/newsletter/` and `public/reports/` (PDF)
- [ ] Any material figure change logged in `src/lib/corrections-data.ts`
