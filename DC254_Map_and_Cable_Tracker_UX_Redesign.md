# DC254 Map and Cable Tracker UX Redesign

**Pages reviewed**

- [Infrastructure map](https://data-centers-254.vercel.app/infrastructure/map)
- [Subsea cable tracker](https://data-centers-254.vercel.app/tracker/cables)

**Review focus:** Visual hierarchy, interaction clarity, data comprehension, accessibility, mobile usability and authority-building presentation.

## Executive recommendation

The two pages already contain valuable proprietary data and a strong visual foundation: dark infrastructure-themed styling, large numerical cards, an interactive map, status filters, list view and clear verification language.

The main problem is not a lack of information. It is **simultaneous information density**.

The map currently presents facilities, cables, IXPs, regional assets, PIDA projects, fibre, clusters, legends, filters and explanatory text in one experience. The cable tracker presents a strong dataset, but mostly as a long vertical list of cards. Both pages would become more understandable and engaging if they adopted the same interaction model:

> **Orient the user → let them choose a question → show one focused visual answer → reveal evidence on demand.**

The redesign should make the pages feel like two views of the same product:

- The **Map** answers: *Where is the infrastructure and how does it connect?*
- The **Tracker** answers: *What is live, what is coming, and how do we know?*

## What is already working

### Infrastructure map

The map has several strong elements:

- The headline immediately establishes the use case: every data centre in Kenya mapped.
- The four metric cards communicate scale quickly.
- Asset and status filters are present.
- Map view and list view provide a useful alternative to visual exploration.
- Nairobi and Mombasa are correctly treated as important clusters.
- Cable routes can be highlighted from the map and cable list.
- The PIDA layer is clearly separated conceptually from the verified directory.
- The “How to read this map” panel is useful for first-time users.

### Cable tracker

The tracker also has a credible foundation:

- The title is memorable and specific.
- The three status counts clarify live, landed and announced systems.
- Monthly verification is visible.
- Cable cards include status, owner or consortium, location, context and confidence.
- The page correctly distinguishes design capacity from lit capacity.
- Full explainers provide a path for deeper reading.

## Main UX problems to solve

### 1. The user’s first question is not explicit enough

Both pages begin with a good title, but the interface does not immediately ask the user what they want to investigate.

A visitor may be trying to answer one of several different questions:

- Where are Kenya’s data centres?
- Which cables are currently live?
- Which facilities connect to the most networks?
- What is being built next?
- How does Mombasa connect to Nairobi?
- Which figures are verified?

The interface should expose these as clear entry points rather than expecting users to infer the route from filters and map symbols.

### 2. Too many layers are visible at the same time

On the map, facilities, cables, IXPs, clusters, regional assets and PIDA projects compete for attention. The result is impressive for expert users but visually difficult for first-time users.

The solution is not to remove the data. It is to make layers **progressive**:

- Default view: facilities, live cables and major IXPs.
- Optional view: planned cables, fibre, regional assets and PIDA projects.
- Advanced view: all layers, with an explicit “research mode” label.

### 3. Metrics need stronger definitions

The map shows “Mapped live capacity: 28.2 MW of 230 MW announced pipeline,” while the wider DC254 directory and market report use additional distinctions such as 10.5 MW live IT load and 42.9 MW built capacity.

This is not necessarily a data problem, but it creates a comprehension problem. A user may ask why the map’s “live capacity” differs from the directory’s live or built figures.

Every metric card should have:

- A precise label.
- A one-line definition.
- A last-verified date.
- An information tooltip or expandable methodology note.

### 4. The map relies heavily on hover

The current map encourages users to hover over cables. Hover is weak on touch devices, difficult for keyboard users and not always discoverable.

Every hover interaction should have a tap, click and keyboard equivalent. The cable list should act as the primary accessible control for selecting a route.

### 5. The cable tracker is accurate but visually repetitive

The tracker’s long cards make every cable equally prominent. The status difference is visible, but the user has to scan many similar blocks to compare systems.

The page needs a compact comparison layer before the detailed records:

- Status distribution.
- Timeline by ready-for-service year.
- Route or landing-point view.
- Quick comparison table.
- Search and status filters.

## Shared visual language for both pages

Create a shared “DC254 Infrastructure Intelligence” component system.

### Colour system

Use colour for meaning, not decoration:

| Meaning | Suggested treatment |
|---|---|
| Live / operational | Bright green dot and subtle green border |
| Under construction | Amber dot and amber badge |
| Committed | Violet or blue-violet badge |
| Early stage / announced | Dashed cyan or muted blue badge |
| Landed, service pending | Orange badge with a warning icon |
| Verified | Green verification mark |
| Partial / review | Amber verification mark |
| Structured gap / not researched | Neutral grey or lavender badge |
| Selected route or asset | High-contrast cyan line and glow |

Do not use red for ordinary development status. Reserve red for errors, contradictions or a material warning.

### Typography

- Keep the current strong editorial headline style.
- Use a smaller uppercase eyebrow for page type: `INFRASTRUCTURE MAP` or `CABLE TRACKER`.
- Make metric labels more readable and less compressed.
- Use tabular numerals for MW, Tbps, network counts and years.
- Keep supporting text at a readable contrast level, especially on the map side panel.

### Cards

Use two card levels:

1. **Decision cards:** metrics, status summaries and active filters.
2. **Evidence cards:** facility or cable records, sources, confidence and verification dates.

Do not give every block the same border, glow and visual weight. The selected asset should be visibly stronger than the unselected cards.

### Verification treatment

Make verification a visible product feature:

```text
VERIFIED SEPT 2026 · HIGH CONFIDENCE
Source trail available →
```

Use this consistently on map details, tracker rows and facility panels.

## Redesign for the infrastructure map

## A. New page structure

### 1. Hero with a clear decision prompt

Keep the existing headline, but add a short question selector below it:

```text
What do you want to explore?

[Find a facility] [Trace a cable] [Compare Nairobi & Mombasa] [See what is being built]
```

Each button should set the map to a purposeful preset rather than only changing a filter.

Suggested presets:

- **Find a facility:** show facilities, search active, map centred on Kenya.
- **Trace a cable:** show live and planned cables, cable list expanded.
- **Compare Nairobi & Mombasa:** show two cluster cards and a split comparison.
- **See what is being built:** show under-construction, committed and early-stage assets.

### 2. Metric strip with definitions

Keep four metrics, but simplify the labels:

```text
27 facilities tracked
20 operational
7 live cable systems
140 KIXP members
```

Add a small “Definitions” link beside the cards. If capacity remains in the metric strip, label it explicitly as one of:

- `Published live IT load`
- `Built facility capacity`
- `Announced pipeline`

Do not use “mapped live capacity” unless the definition is immediately visible.

### 3. Filter bar as a command centre

Replace the current long row of mixed filters with two levels.

**Primary filter row:**

```text
[All] [Facilities] [Cables] [IXPs] [PIDA projects]
```

**Secondary status row, shown only when relevant:**

```text
[All status] [Operational] [Under construction] [Committed] [Early stage]
```

Add a visible filter summary:

```text
Showing 7 cable systems · 6 live · 1 service pending
[Clear filters]
```

### 4. Map and intelligence rail

Use a 70/30 desktop split:

- Left: map canvas.
- Right: contextual intelligence rail.

The right rail should change based on the selected mode:

**Default rail:**

- How to read the map.
- Top three clusters.
- Current visible asset count.
- Verification date.

**Cable mode:**

- Live / pending / planned summary.
- Cable list with status and year.
- “Trace route” actions.

**Facility mode:**

- Nairobi, Mombasa and other cluster counts.
- Operational versus pipeline summary.
- Quick facility list.

**PIDA mode:**

- Clear warning: `Registry projects are not facility capacity.`
- Sector filter.
- Project count and source date.

### 5. Selection drawer instead of only map labels

When a user selects an asset, open a drawer or side panel with:

```text
SEACOM
LIVE · VERIFIED SEPT 2026

Mombasa landing
1.28 Tbps design capacity at launch
In service since 2009

What this means
Connects Kenya to regional and international routes.

[Trace route] [Open source record] [Read explainer]
```

The panel should remain open while the user explores the map. Include a close button and a “back to all assets” action.

### 6. Map controls

Add a compact map control stack:

- Zoom in / out.
- Reset view.
- Centre on Nairobi.
- Centre on Mombasa.
- Toggle labels.
- Toggle 3D or terrain only if it improves comprehension.
- Full-screen mode.

Avoid adding controls that are technically impressive but do not answer a user question.

### 7. Make the map’s visual hierarchy calmer

Recommended defaults:

- Desaturate base geography further.
- Use brighter routes only when selected.
- Show major labels by default and secondary labels on zoom.
- Reduce the number of simultaneous PIDA labels.
- Use cluster bubbles with a count and category, not overlapping facility dots at national zoom.
- Zoom automatically to Nairobi or Mombasa when a cluster is selected.
- Keep cable routes slightly dimmed until selected.

The map should feel like a calm control room, not a full dataset dumped onto a canvas.

### 8. Move the PIDA layer below the main experience

The PIDA section is valuable but currently competes with the map. Move it below the primary map interaction and present it as a separate module:

```text
CONTINENTAL PIPELINE
Projects registered in the AUDA-NEPAD infrastructure database

[Show PIDA projects on map]
[Read the methodology]
```

Use a different visual treatment, such as violet, to make it obvious that PIDA registry projects are not the same as verified facilities.

## B. New map interaction ideas

### “Trace the internet” mode

Let the user select a starting point and endpoint:

```text
From [Mombasa cable landing] to [Nairobi facility]
```

Then highlight:

1. The cable route.
2. The landing station.
3. The terrestrial or fibre connection.
4. The data-centre cluster.
5. The relevant IXP.

This turns the map from a catalogue into a story.

### Nairobi versus Mombasa comparison

A persistent comparison panel could show:

| Dimension | Nairobi | Mombasa |
|---|---|---|
| Facilities | 17 | 4 |
| Primary role | Data-centre and enterprise cluster | Cable landing and coastal connectivity gateway |
| Key assets | IXPs, operators, enterprise sites | Subsea systems, landing stations, coastal routes |
| Explore | View Nairobi | View Mombasa |

Populate figures dynamically from the dataset.

### “What changed?” mode

Add a date selector or monthly change badge:

```text
Since last verification
+1 tracked facility
+1 status change
+1 cable record updated
```

This is especially useful for repeat visitors and journalists.

## Redesign for the cable tracker

## A. New page structure

### 1. Hero as a status dashboard

Keep the existing title, but make the promise more direct:

```text
The cables under Mombasa, tracked.
Live systems, landed systems and planned routes — separated by evidence and status.
```

Add a primary action row:

```text
[Explore live systems] [See the pipeline] [Open cable map]
```

### 2. Replace the four equal cards with a status story

Use a horizontal status funnel or segmented bar:

```text
7 live ━━━━━━━━━ 1 landed / RFS pending ━━━ 2 planned
```

Under it, show the definition for each stage:

- **Live:** carrying traffic on the Kenya segment.
- **Landed / RFS pending:** physically ashore, but ready-for-service not confirmed.
- **Planned:** announced build or route, not counted as live.

The current cards are clear, but a visual progression will make the central editorial discipline memorable.

### 3. Add search, filter and sort controls

Before “The full slate,” add:

```text
[Search cable or consortium]
[All status] [Live] [RFS pending] [Planned]
[Sort: Newest] [Sort: Oldest] [Sort: Status]
```

Show a result count and a clear-filter action.

### 4. Add a cable timeline

A horizontal timeline would make the page more visually engaging and help users understand the market’s evolution:

```text
2009  TEAMS · SEACOM
2010  EASSy
2012  LION2
2021  DARE1
2022  PEACE
2024  2Africa
2026  Daraja · planned
```

Each timeline item should open the corresponding cable detail. The timeline should not replace the full records; it should provide orientation before the user reads them.

### 5. Turn the full slate into compact expandable rows

The current cards are readable but consume substantial vertical space. Use a compact row by default:

```text
[status dot] TEAMS     2009     Mombasa     Live     1.28 Tbps     [Details]
```

On selection, expand into:

- Route summary.
- Consortium or operator.
- Landing point.
- Design capacity.
- Status explanation.
- Confidence and verification date.
- Source link.
- Explainer link.

This lets expert users scan and curious users go deeper.

### 6. Add a route mini-map to each expanded record

When a cable opens, show a small regional route diagram or mini-map. The route should not need to be reconstructed mentally from prose.

Use a consistent visual:

- Origin / route / Mombasa landing.
- Live route in cyan.
- Planned route in amber dashed line.
- Landing station marker.
- “Route schematic” label where exact geometry is indicative.

### 7. Make evidence visible without overwhelming the record

Each cable should have an evidence footer:

```text
HIGH CONFIDENCE · VERIFIED SEPT 2026
Source trail available →
```

Clicking it can open a drawer with:

- Source names.
- Source type.
- Verification date.
- Exact evidence note.
- Caveat about design capacity versus lit capacity.

### 8. Add “compare cables” mode

Allow users to select up to three cables and compare:

| Cable | Status | Year | Landing | Design capacity | Confidence |
|---|---|---:|---|---:|---|
| TEAMS | Live | 2009 | Mombasa | 1.28 Tbps at launch | High |
| PEACE | Live | 2022 | Mombasa branch | 16 Tbps | Medium |
| Africa-1 | RFS pending | — | Mombasa | Not published | Medium |

This is particularly useful for journalists, investors, researchers and infrastructure analysts.

## B. Cable tracker storytelling features

### “Live count versus headline count” module

Create a memorable explanatory module:

```text
Why the live count is 7

10 systems are tracked.
7 are carrying traffic.
1 is landed but has no announced ready-for-service date.
2 are planned.

We count a cable as live only when service is confirmed.
```

This is one of DC254’s clearest trust features and should be visually prominent.

### “What changed this month?” module

Add a dated update panel:

```text
September 2026 update
No change to the live count.
Africa-1 remains landed with RFS pending.
Daraja remains planned.
Next review: October 2026.
```

If there is a change, the panel becomes a high-value reason to revisit and share the page.

### Cable route versus capacity caveat

Place the caveat directly beside capacity figures:

> Design capacity is operator-reported. Lit capacity is not published and is not estimated here.

This should be visually attached to the numbers, not left only in the introductory paragraph.

## Mobile redesign

### Map page

On mobile, use a deliberate bottom-sheet pattern:

1. Top: title and three compact metrics.
2. Sticky filter bar.
3. Map fills the viewport.
4. Bottom sheet contains the selected asset or cable list.
5. Swipe up to expand details.
6. “List view” remains a clear alternative.

Do not place a tall explanatory panel beside a tiny map on mobile. Put the explanation in a collapsible sheet.

### Cable tracker

Use:

- Sticky status tabs.
- Compact cable rows.
- Expandable details.
- Horizontal timeline that can be swiped.
- Full-screen route mini-map on selection.
- Large tap targets for `Details`, `Trace route` and `Read explainer`.

Avoid presenting all long cable descriptions expanded by default.

## Accessibility requirements

- Every map asset must have a keyboard-accessible list equivalent.
- Do not make hover the only way to reveal a cable route.
- Use patterns in addition to colour for live, pending and planned routes.
- Provide text labels for status badges.
- Ensure focus states are visible on filters, map/list toggles and asset rows.
- Keep contrast strong for muted grey text on black backgrounds.
- Make the map’s key insight available as text for screen readers.
- Add an accessible “Data table” mode for the map.
- Preserve URL state for filters and selected assets where practical, so views can be shared.

## SEO and shareability improvements

### Map page

Add a visible summary block that answers:

- How many facilities are tracked?
- How many are operational?
- How many live cable systems land at Mombasa?
- What is KIXP’s role?
- What is the difference between verified facilities and PIDA registry projects?

### Cable tracker

Add a visible summary that states:

- Seven systems are live.
- One is landed with RFS pending.
- Two are planned.
- The dataset was verified in September 2026.
- Design capacity is not the same as lit capacity.

### Social preview actions

Add a compact `Share this view` button that generates a URL containing:

```text
/infrastructure/map?asset=cables&status=operational&focus=mombasa
/tracker/cables?status=live
```

The shared URL should preserve filters and produce a clear preview title such as:

```text
7 live subsea cable systems landing at Mombasa | DC254
```

This would turn interactive exploration into a shareable product feature.

## Recommended implementation sequence

### Phase 1: Comprehension improvements

- Clarify metric labels and definitions.
- Add preset questions above the map.
- Separate primary and secondary filters.
- Add visible filter summaries.
- Make the map list view more prominent.
- Add tracker search, status filters and sort controls.
- Add the live / pending / planned explanatory status bar.

### Phase 2: Visual storytelling

- Add Nairobi versus Mombasa comparison.
- Add cable timeline.
- Add “Why the live count is 7” module.
- Add “What changed this month?” module.
- Add route mini-maps to cable records.
- Reduce simultaneous map layers by default.

### Phase 3: Advanced interaction

- Add trace-the-internet mode.
- Add compare-cables mode.
- Add shareable URL state.
- Add full-screen map and mobile bottom-sheet behaviour.
- Add evidence drawers with source trails.
- Add an accessible data-table export mode.

## Proposed visual wireframes

### Map page

```text
┌────────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE MAP                                         │
│ Kenya’s digital infrastructure, mapped.                   │
│                                                            │
│ What do you want to explore?                               │
│ [Find a facility] [Trace a cable] [Compare cities]        │
│ [See what is being built]                                 │
├────────────────────────────────────────────────────────────┤
│ 27 facilities   20 operational   7 live cables   140 IXPs │
│ [Definitions]              Verified Sept 2026              │
├────────────────────────────────────────────────────────────┤
│ [All] [Facilities] [Cables] [IXPs] [PIDA]                  │
│ [Operational] [Building] [Committed] [Early stage]        │
│ Showing 7 cable systems                         [Clear]    │
├───────────────────────────────┬────────────────────────────┤
│                               │ CABLE MODE                 │
│                               │ 7 live · 1 pending · 2    │
│          MAP                  │ planned                    │
│                               │                            │
│      selected route           │ [SEACOM] [PEACE] [TEAMS]  │
│                               │ [Africa-1] [Daraja]       │
│                               │                            │
│                               │ [Open details]             │
├───────────────────────────────┴────────────────────────────┤
│ [Browse directory] [Read how Kenya connects] [Share view]  │
├────────────────────────────────────────────────────────────┤
│ CONTINENTAL PIPELINE: PIDA registry projects               │
│ [Show this layer] [Methodology]                            │
└────────────────────────────────────────────────────────────┘
```

### Cable tracker

```text
┌────────────────────────────────────────────────────────────┐
│ CABLE TRACKER                                              │
│ The cables under Mombasa, tracked.                         │
│ Live, landed and planned — separated by evidence.          │
│ [Explore live] [See pipeline] [Open cable map]             │
├────────────────────────────────────────────────────────────┤
│ 7 LIVE ━━━━━━━━━ 1 RFS PENDING ━━━ 2 PLANNED              │
│ carrying traffic     landed ashore       announced         │
│                                                            │
│ Verified Sept 2026 · Monthly sweep                        │
├────────────────────────────────────────────────────────────┤
│ [Search cables] [All status] [Sort: newest]                │
├────────────────────────────────────────────────────────────┤
│ 2009 ─── 2010 ─── 2012 ───── 2021 ── 2022 ── 2024 ─ 2026  │
│ TEAMS     EASSy    LION2       DARE1    PEACE    2Africa   │
│                                                   Daraja   │
├────────────────────────────────────────────────────────────┤
│ LIVE SYSTEMS                                               │
│ ● TEAMS       2009   Mombasa   1.28 Tbps       [Details]  │
│ ● SEACOM      2009   Mombasa   1.28 Tbps       [Details]  │
│ ● EASSy       2010   Mombasa   4.72 Tbps       [Details]  │
│                                                            │
│ LANDED · RFS PENDING                                       │
│ ● Africa-1   Mombasa   no RFS date             [Details]  │
│                                                            │
│ PLANNED                                                    │
│ ● Daraja     Mombasa   no RFS date             [Details]  │
├────────────────────────────────────────────────────────────┤
│ WHY THE LIVE COUNT IS 7                                    │
│ A cable joins the live count when it carries traffic.     │
│ [Read methodology] [Share this tracker]                   │
└────────────────────────────────────────────────────────────┘
```

## Final design direction

The visual direction should remain recognisably DC254: dark, technical, editorial and evidence-led. The improvement is to introduce more **calm hierarchy and guided exploration**.

The map should feel like a control room for asking spatial questions. The cable tracker should feel like a status board and timeline for asking change and readiness questions.

If only one improvement is implemented first, make it this:

> **Add question-based presets and status summaries before the data visualisation.**

That single change will make both pages easier to understand while preserving the depth that makes DC254 valuable.
