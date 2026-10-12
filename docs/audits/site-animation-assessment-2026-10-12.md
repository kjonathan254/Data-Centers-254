# Site Animation Assessment — "what if we animated the site?"

**Date:** 2026-10-12 · **Trigger:** Editor question — "what if we started animating the site using the site animation skills we had identified… Would this site animation affect the site in any way?"
**Scope:** impact analysis only. No site code was changed for this assessment.

## Short answer

Yes — animating the site would affect it, but the *size* of the effect depends entirely on how it is done. Done the DC254 way (the pattern already in `src/app/policy/intelligence/motion.tsx`), the effect is close to zero and partly positive. Done with a heavy animation library, it would cost bundle weight, risk Core Web Vitals, and break the site's stated accessibility posture.

## Where the site already stands (verified today)

- The site is **not** animation-free. `globals.css` carries 22 `@keyframes`/`animation` declarations, and `prefers-reduced-motion` is honoured in six places (`globals.css`, `cable-explorer.tsx`, `jibu-welcome.tsx`, `jibu-chat.tsx`, `ListenBar.tsx`, `east-africa-infrastructure-map.tsx`).
- The policy-intelligence console ships purpose-built motion primitives (`motion.tsx`): zero dependencies, hydration-safe, SSR renders the **final** value so crawlers and no-JS visitors see complete evidence, animations arm only after mount + scroll-into-view, and all motion respects `prefers-reduced-motion`.
- Task 118 (2026-10-11) deliberately skipped GSAP/Motion site-animation skills with the reason "site is deliberately reduced-motion". That decision remains correct as a *dependency* decision; the `motion.tsx` pattern shows the site animates without one.

## What "animating the site" would actually affect

| Dimension | Effect if done DC254-style (CSS + existing primitives) | Effect if done with GSAP/Motion (library) |
|---|---|---|
| JS bundle | ~0 bytes — CSS keyframes + IntersectionObserver already shipped | +30–100 KB minified+gzipped, loaded site-wide unless code-split |
| Core Web Vitals | Safe: transform/opacity only, no layout properties animated | Risk to INP/CLS if timelines touch layout or run on scroll without throttling |
| SEO | Neutral-to-positive: SSR-first pattern keeps full content in HTML | Risk if content is hidden behind JS-triggered entrances (crawlers see less) |
| Accessibility | Keeps the `prefers-reduced-motion` guarantee already enforced in 6 files | Must be re-implemented per component; easy to regress |
| LCP | Unchanged (animations must not gate the hero image/text) | Risk if hero entrances wait on JS hydration |
| Service worker / PWA | No change (no new precache entries beyond CSS) | New chunks must be precached or they break offline |
| Audit score | SEO 95/100 protected | Jeopardises the performance deductions already cleared |
| Maintenance | One pattern to follow (`motion.tsx`) | Second animation system to keep in sync with React 18/19 |

## Recommendation

1. **Adopt the house pattern, not a library.** Any new animated section uses the `motion.tsx` primitives (or CSS keyframes with the existing `prefers-reduced-motion` block). No GSAP/Motion dependency; the Task 118 skip stands.
2. **Rules that keep the effect at zero:** animate only `transform` and `opacity`; never animate layout (width/height/top/margin); SSR the final state; arm on scroll-into-view; always pair with `prefers-reduced-motion`.
3. **Where richer motion belongs: Remotion, not the runtime.** The "DC254 Numbers" and "Inside the Map" videos are exactly this — heavy animation delivered as MP4 files. Embedded with a poster frame and lazy loading they cost no runtime JavaScript and cannot shift layout (fixed 16:9 or 9:16 aspect box). This gives the site cinematic animation at zero performance cost.
4. **If a scroll-driven "live" number counter is wanted** (e.g. the 27 / 10.5 MW / 230 MW stats counting up on the homepage): implement it inside the existing `motion.tsx` pattern (count-up on first in-view, final value in SSR HTML, reduced-motion renders final value immediately). That is a contained, audit-friendly change — estimated one component + tests, CI double-green as usual.

## Verdict

Animating the site would affect it in the ways tabled above — but with the house pattern the effect is negligible and reversible, and the platform already has everything needed. The high-motion ambitions (data storytelling, map narratives) are better served off-runtime as Remotion renders embedded as video, which is now a proven, reusable pipeline.
