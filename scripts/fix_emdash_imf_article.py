#!/usr/bin/env python3
"""Replace em dashes in africa-160-data-centres-imf-power-constraint.md
with house-style punctuation (validator rule: no \\u2014). Idempotent:
exits 0 without writing when no em dash remains."""
import sys

PATH = "content/articles/africa-160-data-centres-imf-power-constraint.md"

REPLACEMENTS = [
    ('in Africa \u2014 5.5% of the global total. We read the report',
     'in Africa: 5.5% of the global total. We read the report'),
    ("installations \u2014 and nearly half of the region's fleet sits",
     "installations, and nearly half of the region's fleet sits"),
    ('annual sales \u2014 the background against which',
     'annual sales, the background against which'),
    ('tell different stories \u2014 industry estimates put',
     'tell different stories: industry estimates put'),
    ('the most data centres \u2014 Nigeria, Kenya and South Africa \u2014 86%, 65% and',
     'the most data centres (Nigeria, Kenya and South Africa), 86%, 65% and'),
    ('just 0.2% cumulatively over the next decade \u2014 about 0.4% of GDP once AI-related capital accumulation is included',
     'just 0.2% cumulatively over the next decade, about 0.4% of GDP once AI-related capital accumulation is included'),
    ('bankable for private investors \u2014 with spillover access',
     'bankable for private investors, with spillover access'),
    ('not the count \u2014 it is the diagnosis',
     'not the count: it is the diagnosis'),
    ("itself a finding \u2014 the region's fleet is broad but shallow",
     "itself a finding: the region's fleet is broad but shallow"),
    ("documented when [why Kenya's data centre market estimates disagree](/articles/why-kenya-data-centre-market-estimates-disagree) \u2014 six research firms produced",
     "documented in [why Kenya's data centre market estimates disagree](/articles/why-kenya-data-centre-market-estimates-disagree): six research firms produced"),
    ('four markets \u2014 Egypt, Kenya, Nigeria and South Africa \u2014 which tells you',
     'four markets (Egypt, Kenya, Nigeria and South Africa), which tells you'),
    ("Generator ownership \u2014 the market's own verdict on grid reliability \u2014 is widespread",
     "Generator ownership (the market's own verdict on grid reliability) is widespread"),
    ('over the next decade \u2014 about 0.4% of GDP once AI-related capital accumulation is counted',
     'over the next decade, about 0.4% of GDP once AI-related capital accumulation is counted'),
    ('bankable for private investors \u2014 potentially extending electricity access',
     'bankable for private investors, potentially extending electricity access'),
    ('whether anchor demand catalyses net additions to grid capacity "or simply diverts existing supply \u2014 which depends on how power purchase agreements and grid extension mandates are structured".',
     'whether anchor demand "catalyzes net additions to grid capacity or simply diverts existing supply" depends on how power purchase agreements and grid extension mandates are structured.'),
    ('green compute \u2014 the logic behind [the Olkaria',
     'green compute, the logic behind [the Olkaria'),
    ('concept note \u2014 [the full story of the Microsoft and G42 stall](/articles/microsoft-g42-kenya-data-centre) is a study',
     'concept note. [The full story of the Microsoft and G42 stall](/articles/microsoft-g42-kenya-data-centre) is a study'),
    ('compute capacity" \u2014 specifically the areas where',
     'compute capacity", specifically the areas where'),
    ("turn on \u2014 and they are precisely the instruments",
     "turn on, and they are precisely the instruments"),
    ('when the constraints fall \u2014 the submarine cable waves',
     'when the constraints fall: the submarine cable waves'),
    ('was built \u2014 not the reason an existing one was fully booked \u2014 the 160 starts moving',
     'was built, not the reason an existing one was fully booked, the 160 starts moving'),
]

def main():
    src = open(PATH, encoding="utf-8").read()
    if "\u2014" not in src:
        print("already clean: no em dash present")
        return 0
    for old, new in REPLACEMENTS:
        if old in src:
            src = src.replace(old, new)
    remaining = src.count("\u2014")
    if remaining:
        print(f"FAIL: {remaining} em dash(s) still present after replacements")
        import re
        for m in re.finditer("\u2014", src):
            print("  ...", repr(src[max(0, m.start()-50):m.end()+50]))
        return 1
    open(PATH, "w", encoding="utf-8").write(src)
    print("OK: all em dashes replaced; file written")
    return 0

if __name__ == "__main__":
    sys.exit(main())
