# Newsletter Cadence & Segment Streams

**Owner: Kevin Jonathan Otieno. Companion to docs/NEWS-TO-ASSETS-PLAYBOOK.md
and docs/RESEARCH-VERIFICATION-STANDARDS.md. This page formalises what the
signup forms promise ("Free. Weekly. No industry noise.") so the commitment
survives beyond any single week's energy.**

## The two streams

| Stream | Cadence | Send window | Format | Status page |
|---|---|---|---|---|
| The Rack Report | Weekly, every Monday | 06:00 EAT (03:00 UTC) | 8-page PDF + email | /rack-report |
| DC254 Brief | Monthly, first Tuesday | 06:00 EAT | Email + web summary | /research |

- **The Rack Report** is the flagship: the week's most important
  developments in the fixed nine-section anatomy (Headline, By the Numbers,
  Infrastructure, Power, Connectivity, Money, Policy, What We're Watching,
  From DataCentre254). Issue numbering is sequential and never skips; if a
  Monday must slip, the issue ships Tuesday with a dated editor's note.
- **The DC254 Brief** is the monthly digest: what changed in the durable
  assets (directory, trackers, snapshots), what shipped on the site, and
  what the next month is watching. It is the segmentation-aware stream.

## Cadence rules

1. **A cadence is a promise, printed on the page.** The signup forms, the
   landing pages and this document state the same schedule. If the schedule
   changes, all three change together in one commit.
2. **Never skip silently.** A missed week gets a dated note in the next
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
| `other` | The shared core: weekly headline + one durable-asset update |

Segmentation is **ordering, not exclusion**: everyone gets the Rack Report
core; the DC254 Brief and any future segment digests lead with the section
their segment told us they care about. No segment-gated paywalls exist above
the trust engine.

## Sponsor-ready inventory (rules)

- One sponsor per Rack Report issue, clearly labelled, tracked click report
  monthly (sponsor click counters already run in the newsletter store).
- Segment counts shown on /advertise come from the live store, never inflated.
- The quarterly State of the Market dataset bundle is the sponsorship
  adjacent product: free, cited, and proof of the audience's professionalism.

## Definition of done (per issue)

- [ ] Issue numbered, dated, sources listed, confidence stated
- [ ] Durable assets checked against the playbook checklist before send
- [ ] Segment leads applied (Brief) / anatomy complete (Rack Report)
- [ ] Archive copy saved to `docs/newsletter/` and `public/reports/` (PDF)
- [ ] Any material figure change logged in `src/lib/corrections-data.ts`
