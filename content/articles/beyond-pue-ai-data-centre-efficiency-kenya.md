---
title: "Beyond PUE: What AI Data Centre Efficiency Means for Kenya"
slug: "beyond-pue-ai-data-centre-efficiency-kenya"
meta_description: "PUE alone no longer describes AI-era data centre efficiency. What LG's CEO argument, Uptime's rack numbers and IEA forecasts mean for Kenyan operators."
primary_keyword: "beyond PUE AI data centre efficiency"
secondary_keywords:
  - "AI data centre efficiency Kenya"
  - "liquid cooling Nairobi data centre"
  - "data centre water use Kenya"
  - "rack density AI workloads"
  - "data centre metrics beyond PUE"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-10-20"
updated_date: "2026-10-20"
category: "Energy Efficiency"
cluster: "Energy"
og_image: "/images/dc-gpu-cluster-2-wide.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-gpu-cluster-2-wide.webp"
    alt: "High-density GPU racks in a data centre hall"
    caption: "Racks of 30 kW and above are becoming the norm for AI workloads, and the efficiency metric most Kenyan facilities quote was never designed for them"
    position: "hero"
  - src: "/images/diagram-power-chain-grid-to-gpu.webp"
    alt: "Diagram of the power chain from grid connection to GPU rack"
    caption: "The AI-era argument: grid, power train, cooling and chips have to be designed as one integrated system, because that is how they fail"
    position: "section-break"
  - src: "/images/dc-chillers-roof.webp"
    alt: "Rooftop chiller plant at a data centre"
    caption: "Once racks pass roughly 30 kW, air alone stops being a viable heat carrier and the heat has to be moved to liquid, chip to coolant loop"
    position: "inline"
  - src: "/images/kenya-geothermal-plant-olkaria.webp"
    alt: "Geothermal power plant at Olkaria, Kenya"
    caption: "Regional suitability beats one-size-fits-all efficiency: Kenya's grid is roughly nine-tenths renewable, which quietly changes which metrics matter most"
    position: "inline"
internal_links:
  - text: "our PUE explainer"
    href: "/articles/data-centre-pue-power-usage-effectiveness"
  - text: "data centre cooling systems"
    href: "/articles/data-centre-cooling-systems-explained"
  - text: "Kenya Power tariffs and data centre operating costs"
    href: "/articles/kenya-power-tariffs-data-centres"
  - text: "what Kenyan operators should disclose"
    href: "/articles/kenya-data-centres-what-operators-should-disclose"
  - text: "IXAfrica's Nairobi campus"
    href: "/articles/ixafrica-data-centres-kenya"
  - text: "the Energy hub"
    href: "/energy"
external_sources:
  - title: "Forbes Technology Council - AI Data Center Efficiency: Looking Beyond Power Usage Effectiveness (Jae-cheol Lyu, 19 October 2026)"
    url: "https://www.forbes.com/councils/forbestechcouncil/2026/10/19/ai-data-center-efficiency-looking-beyond-power-usage-effectiveness/"
  - title: "Uptime Institute annual survey (rack density figures as cited in the piece)"
    url: "https://uptimeinstitute.com/resources/research-and-reports"
  - title: "IEA, data centre electricity consumption projections (415 TWh in 2024 to ~945 TWh by 2030)"
    url: "https://www.iea.org/reports/energy-and-ai"
  - title: "S&P Global water stress survey figure (43% of 9,055 data centres, as cited in the piece)"
    url: "https://www.spglobal.com/market-intelligence"
faq:
  - question: "What does going beyond PUE actually mean?"
    answer: "It means treating PUE as one input rather than the verdict. In the AI era, operators and buyers are asked to evaluate three additional things: how flexibly the facility keeps pace with rapidly evolving hardware, how efficiently heat moves from the chip out past the facility boundary, and how reliably the site operates under local power, water and climate conditions. PUE measures none of these well, because it was designed to compare a facility against its own past, not against the work it enables."
  - question: "Why is PUE considered insufficient for AI data centres?"
    answer: "AI racks have pushed power densities from 5-10 kW to 30-50 kW and beyond, which breaks the air-cooling assumptions baked into a decade of PUE optimisation. A facility can post an excellent PUE while its GPUs idle waiting for power, water or cooling headroom. The metric tracks overhead energy, not utilisation, resilience or water, and those are exactly the variables AI workloads stress first."
  - question: "Does Nairobi's climate give Kenyan data centres an efficiency advantage?"
    answer: "Yes, a real one. Nairobi sits at about 1,800 metres, where temperatures stay mild year-round and free cooling works for much of the year, which helps keep PUE competitive without heavy mechanical assist. Mombasa is the opposite case: hot, humid and salty air, where efficiency has to be engineered around dehumidification and corrosion. The lesson from the beyond-PUE argument is that regional suitability matters more than any single technology's nameplate efficiency."
  - question: "How much money does PUE improvement actually save a Kenyan operator?"
    answer: "Illustratively: a 1 MW IT load running at PUE 1.6 draws about 1.6 MW from the grid. Improving to 1.4 saves roughly 200 kW continuously, which is about 1.75 million kWh a year. At an effective commercial tariff around KES 20 per kWh, that is roughly KES 35 million (about US$270,000) annually. The saving scales with the tariff, which is why the same PUE point is worth more in Nairobi than in markets with cheap power."
---

Every Kenyan data centre pitch deck quotes the same number first. Power usage
effectiveness, PUE, the ratio of total facility energy to the energy that
actually reaches the IT equipment, has been the industry's headline efficiency
figure for so long that buyers stop asking what it does and does not measure.
This week the argument against stopping there got a high-profile restatement:
writing in Forbes on 19 October 2026, Jae-cheol Lyu, president and CEO of LG
Electronics, made the case that PUE alone can no longer describe efficiency in
the AI era, and that the industry needs to evaluate three things it has
historically kept separate from the metric: hardware flexibility, heat
movement, and site-specific resilience. He is writing about a global market.
But the argument lands with particular force on a market like ours, where the
climate is generous, the grid is unusually clean, and the next generation of
AI racks is about to stress every assumption PUE was built on.

## What PUE still does well

Nothing in this piece is an argument to retire the metric. As we set out in
[our PUE explainer](/articles/data-centre-pue-power-usage-effectiveness), PUE
is genuinely good at one thing: tracking a facility's own trajectory over
time. A Nairobi operator who moves from 1.8 to 1.5 across a retrofit has a
real, comparable story to tell, and PUE is the right way to tell it. Lyu's
position, and ours, is that the trouble starts when PUE is read as a
cross-site verdict rather than a self-history. Two facilities can post
identical PUEs while one runs mild highland air through its coils and the
other battles coastal humidity with chillers running flat out. The identical
number hides different engineering, different water bills and different
exposure when something breaks. That is the gap the AI era blows open,
because AI workloads stress exactly the variables PUE was never designed to
see.

## The three questions that come after PUE

Lyu's framework is worth reading on its own terms, so let us restate it
faithfully and then translate each part into Kenyan specifics.

**First: how flexibly does the facility keep pace with the hardware?** The
numbers tell the story. Uptime Institute's latest survey, cited in the piece,
found the share of operators running racks of 30 kW or more rose from 19% in
2025 to 24% in 2026, and roughly one in seven operators now runs racks of 50
kW or more. A facility designed around 6 kW cabinets cannot flex its way to
an NVIDIA-class GPU hall; the power train, the floor loading, the airflow and
the breakers all pre-date the demand. Kenyan operators are already meeting
this: IXAfrica's Nairobi campus has built GPU-ready capacity at the density
end of the local market, and every serious retrofit conversation in the city
now starts with the same question, not "what is your PUE" but "what rack can
you actually take tomorrow?" Flexibility is an efficiency property. A hall
that cannot host next year's chips is inefficient by definition, no matter
what its meter says, because its capital sits idle while the demand goes to
another market.

![Power chain diagram](/images/diagram-power-chain-grid-to-gpu.webp)

**Second: how efficiently does heat move from the chip to beyond the
facility?** This is the axis where Kenya's advantage shows and also where its
next capital bill hides. Nairobi's highland climate, mild days and cool
nights, means free cooling still does real work for conventional racks, which
is part of why local facilities post respectable PUEs without exotic
mechanical plant. But the AI curve does not care about our weather. Once
racks pass roughly 30 kW, air alone stops being a viable heat carrier: the
heat has to move into liquid at the chip, through coolant distribution units,
and out of the building, and the facility that cannot move heat at that rate
simply cannot host the workload. Lyu's point is subtler than "buy liquid
cooling", though. He argues IT, power and cooling should be designed as one
coordinated system centred on computing performance, rather than three
procurement lines optimised separately. In Kenyan terms: the chiller
decision, the transformer sizing and the GPU order are the same decision, and
the operator who lets a supplier optimise one line item in isolation will pay
for it at the rack.

**Third: how reliably does the site operate under local power, water and
climate conditions?** Here the piece quotes numbers that should make any
operator pause. S&P Global, as cited by Lyu, reports that 43% of 9,055
surveyed data centres sit in regions of high water stress. Kenya knows this
variable intimately: the drought cycles of the last decade are national
memory, and a facility that quietly depends on county water or boreholes for
its cooling tower make-up carries a climate risk that never appears in its
PUE. The Kenyan counterweights are real, the binary units at Olkaria are
air-cooled, the grid is roughly nine-tenths renewable, so the carbon
arithmetic that dominates European siting debates matters less here, but the
water arithmetic is moving the other way as Nairobi grows. Reliability also
means the grid dimension: PUE says nothing about ride-through when the feeder
dips, and Kenya's operators, running on a grid with a thin reserve margin,
size UPS and diesel for exactly the hours PUE cannot see. Two facilities with
identical PUE can have very different odds of keeping a load alive through a
bad week.

## The numbers behind the squeeze

The urgency in Lyu's piece comes from arithmetic. The International Energy
Agency projects global data centre electricity consumption will more than
double, from 415 terawatt-hours in 2024 to roughly 945 terawatt-hours by
2030. Efficiency, in other words, has stopped being a procurement nicety and
become a strategic variable: utilities, regulators and neighbours now all
have a view on how much power these buildings deserve. The public mood data
cited in the piece is striking, a June 2026 Reuters/Ipsos report found 57% of
Americans oppose a data centre being built in their area, and 77% worry AI
growth could push electricity rates up.

Kenya runs the opposite experiment. We are not a market resisting data
centres; we are a market courting them, with a national compute-hub ambition
and tax incentives for the sector. That is precisely why the beyond-PUE
argument matters here: in a country that wants the investment, the licence to
operate will be kept by transparency, not by restraint. The operators who
publish measured numbers, water drawn, diesel hours, real PUE, will be the
ones who keep communities and regulators on side as the sector scales. We
have argued this before in [our disclosure piece](/articles/kenya-data-centres-what-operators-should-disclose),
and the global mood shift Lyu documents is the best evidence yet that
disclosure is a competitive asset rather than a compliance chore.

![Olkaria geothermal plant](/images/kenya-geothermal-plant-olkaria.webp)

## Five questions Kenyan buyers should ask instead of "what is your PUE"

The practical output of this argument is a better question list. When you are
evaluating a Kenyan colocation provider, a landlord pitching you a shell, or
a partner for a GPU deployment, ask:

1. **What rack density can you host today, and what is the roadmap?** Ask for
   kW per cabinet actually deployed, not designed, and what changes (power,
   cooling, floor) to reach 30 kW and beyond.
2. **Is the quoted PUE measured or designed?** Design PUE is a spreadsheet
   number. Ask for twelve months of metered data at the utility entry and UPS
   output.
3. **Where does cooling water come from, and what happens in a drought
   year?** If the answer is county water, ask for the borehole and storage
   contingency, and for any water usage figures the operator tracks.
4. **What is the ride-through architecture?** UPS minutes, generator hours,
   fuel contracts, and how many grid dips the site absorbed last year.
5. **What happens to the heat?** For new AI halls, direct-to-chip loops are
   coming whether we plan for them or not; the operators thinking about heat
   reuse now are the ones worth shortlisting.

None of these questions has a PUE answer, which is the point.

## The DC254 take

PUE will keep being quoted, and it should be, it is a clean, auditable
measure of one real thing. The error to avoid is letting a single metric
stand in for a conversation about flexibility, heat and local resilience that
the AI era has made unavoidable. Kenya starts this conversation from an
unusually strong position: a near-renewable grid, a climate that flatters
conventional cooling, and a competitive market where the leading operators
are already building for density. The facilities that will win the next
three years of Kenyan demand are the ones that can answer the five questions
above with numbers they are willing to publish, because in this market,
trust is not a side effect of good engineering, it is the product.
