---
title: "PHP2Shell: What Kenya's Government Website Checks Show"
slug: "kenya-php-advisory-php2shell"
meta_description: "Two critical PHP flaws prompted urgent patching worldwide. DC254 ran a public check of Kenya's government websites: what the signals show, and what they cannot."
primary_keyword: "PHP2Shell Kenya"
secondary_keywords:
  - "CVE-2026-109618"
  - "CVE-2026-109619"
  - "Kenya PHP advisory"
  - "KE-CIRT PHP"
  - "PHP 8.5.12 patch Kenya"
  - "data centre shared responsibility Kenya"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-10-22"
updated_date: "2026-10-22"
category: "Security"
cluster: "Kenya"
og_image: "/images/dc-server-chip-wide.webp"
reading_time: "11 min"
images:
  - src: "/images/dc-server-chip-wide.webp"
    alt: "Server processors mounted in a data centre rack"
    caption: "The flaw lives in the runtime that receives every web request, one layer below the application code"
    position: "hero"
  - src: "/images/dc-networking.webp"
    alt: "Network cabling and switching equipment in a data centre"
    caption: "Any server that answers web requests with PHP is exposed to this class of bug, wherever it is hosted"
    position: "section-break"
  - src: "/images/dc-biometric-access-2.webp"
    alt: "Biometric access control reader at a data centre door"
    caption: "Physical controls protect the building and the hardware; the PHP runtime sits in a software layer that facility certifications do not reach"
    position: "inline"
  - src: "/images/woman-network-engineer-patch-panel.webp"
    alt: "Engineer patching network equipment in a server room"
    caption: "Patching a shared runtime is change management as much as security: test, schedule, roll out, verify"
    position: "inline"
internal_links:
  - text: "Kenya's data centre market in numbers"
    href: "/articles/kenya-data-centre-market-numbers"
  - text: "security threats facing Kenya's data centres"
    href: "/articles/data-centre-security-threats-kenya"
  - text: "our tracking of cyber threats against Kenyan networks"
    href: "/articles/kenya-11-billion-cyber-threats-data-centres"
  - text: "the Data Protection Act's implications for data centres"
    href: "/articles/kenya-data-protection-act-data-centres"
  - text: "GPU cloud infrastructure in Kenya"
    href: "/articles/gpu-cloud-infrastructure-kenya"
external_sources:
  - title: "CISA, Critical Vulnerabilities in PHP Require Immediate Patching (21 October 2026)"
    url: "https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching"
  - title: "Google Cloud, Responding to core PHP vulnerabilities CVE-2026-109618 and CVE-2026-109619 (21 October 2026)"
    url: "https://cloud.google.com/blog/products/identity-security/responding-to-core-php-vulnerabilities-cve-2026-109618-cve-2026-109619"
  - title: "PHP Group, Upcoming Critical PHP Security Release (news archive)"
    url: "https://www.php.net/archive/2026.php"
  - title: "The Star, State issues urgent cyber alert over critical PHP flaws (22 October 2026)"
    url: "https://www.the-star.co.ke/news/2026-10-22-government-issues-urgent-cyber-alert-over-critical-php-flaws"
  - title: "watchTowr, PHP Remote Code Execution FAQ: CVE-2026-109618"
    url: "https://watchtowr.com/intelligence/php-cve-2026-109618-faq"
  - title: "KE-CIRT/CC, Communications Authority of Kenya"
    url: "https://ke-cirt.go.ke"
faq:
  - question: "What is PHP2Shell?"
    answer: "The name given to two critical vulnerabilities in the PHP core runtime, CVE-2026-109618 and CVE-2026-109619, both rated CVSS v4.0 9.2. They allow unauthenticated remote code execution on PHP installations that serve web requests. Fixes shipped on 21 October 2026 in PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35."
  - question: "Is any Kenyan government website confirmed vulnerable?"
    answer: "No. DC254's public-surface check observed CMS signatures consistent with PHP-based platforms on 9 of 10 responding government websites, but signatures do not reveal patch status. One site disclosed a runtime version, PHP 7.4.30, in its response headers. We found no public confirmation of exploitation of these flaws in Kenya as of publication."
  - question: "Does a web application firewall protect against PHP2Shell?"
    answer: "Partially and temporarily. CISA states a WAF may provide some protection until systems are updated. Datadog's analysis found the community workaround configurations incomplete. The vendor fix is the only complete remedy."
  - question: "What should I do about PHP 8.1 or older versions?"
    answer: "CISA advises taking PHP-based systems offline until they can be patched or updated. The PHP project published minimal source backports so OS vendors can build patched packages, since those branches no longer receive regular upstream releases. Contact your OS vendor for a backport timeline."
  - question: "How did DC254 check Kenya's government websites?"
    answer: "We sent one plain HTTPS GET request to each of 15 well-known .go.ke homepages on 22 October 2026 and read the response headers and body markers (WordPress, Drupal, Joomla, generator tags). No exploitation attempts, no path scanning, nothing beyond what a normal browser visit receives. The script ships in our open repository, and the limitations are listed in the research note below."
---

Two flaws in the PHP runtime, both rated CVSS v4.0 9.2, put server operators
on four continents into patch mode this week. CISA urged immediate updates in
Washington. Kenya's Ministry of Information, Communications and the Digital
Economy issued a critical advisory to ministries, departments and agencies on
21 October, in collaboration with the ICT Authority. We read the advisory,
checked the public surface of 15 government websites the next morning, and
wrote down what the signals show and where they stop.

The signals show a PHP-based estate. Nine of the ten government websites that
answered us carried signatures consistent with PHP-based content platforms.
One response header disclosed an actual runtime version, and it was PHP 7.4.30,
a branch that left security support in 2022. What the signals cannot show is
patch status on the other nine, because a CMS marker is not a version number.
That gap between what an outsider can see and what an operator must verify is
the story of this week, and it is the reason the advisory exists.

## What happened

On 21 October 2026 the PHP project shipped security releases for two
vulnerabilities in the language core: CVE-2026-109618 and CVE-2026-109619.
CISA, the US cyber defence agency, named the fixed releases the same day:
**PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35**. Until a server runs one of those
versions, CISA's alert describes the exposure plainly: unauthenticated remote
code execution on PHP installations serving web requests.

Wiz Research found the bugs. Google Cloud, which owns Wiz, published the
disclosure jointly with the PHP project and credited a mix of autonomous AI
agents with locating the flaws and helping draft the remediation. Wiz
estimates the bugs had been sitting in PHP's codebase for over a decade. The
release also came a day early: technical details leaked on social media
before the planned 22 October disclosure, and the PHP project's pre-release
notice had reserved the right to publish early in exactly that situation.
watchTowr documented the leak and the original schedule.

The PHP advisory describes both bugs as exploitable before any application
code runs. In the first, a memory-exhaustion event leaves a request
half-initialised and the cleanup routines treat attacker-controlled input as
functions to execute. In the second, request state outlives its own request,
and the next request handled by the same worker inherits it. Deployments
using mod_php carry the highest risk, because the runtime shares the web
server's process. CISA had received no reports of exploitation when it
published.

The response was broad. France's interior ministry took systems offline as a
precaution. The Netherlands' NCSC and the Port of Rotterdam published urgent
notices, Finland's state IT agency Valtori told its agencies to patch, and
Wikipedia applied preventive measures to its own infrastructure. Cloudflare
shipped managed WAF rules across all its plans, including the free tier, and
CERT-EU issued advisory 2026-018 for EU institutions.

Two footnotes matter for anyone planning a response. First, workarounds
circulated within hours, and Datadog's researchers tested the community
configurations: they blocked some attack paths and left others open, so the
vendor fix remains the only complete remedy. Second, PHP 8.1 and older
branches receive no regular upstream releases. The PHP project published
minimal source backports so that OS vendors can build patched packages of
their own, and CISA's advice for systems that cannot be updated is to take
them offline until they can be.

## What the advisory requires

The Kenyan advisory is dated 21 October 2026 and went out under the Ministry
of Information, Communications and the Digital Economy in collaboration with
the ICT Authority. The document itself circulated to ministries, departments
and agencies; Kenyan outlets including The Star and Tuko reproduced its
contents, and we cite those reports as the source for what it says. It
describes the two flaws, their CVSS 9.2 rating, and the remote code execution
conditions, then instructs agencies to act.

The measures, as reported: identify every PHP-based platform in use, patch
internet-facing systems first, limit the exposure of systems that cannot be
patched immediately, step up monitoring, apply web application firewall
protection where available, review third-party applications for PHP
exposure, and report suspected incidents to KE-CIRT/CC, the national
computer incident response team at the Communications Authority. Response
handling of any personal data involved falls under the Data Protection Act,
which we have covered for data centre operators
[elsewhere](/articles/kenya-data-protection-act-data-centres).

An advisory is an instruction to act. It is also not evidence that any
Kenyan system was breached, and readers should be careful not to read one
into it. We found no public confirmation of exploitation of these specific
flaws in Kenya as of publication.

## What we checked, and how

This is a research note, not a scan report, and the distinction is the
point. On 22 October 2026 we sent one plain HTTPS GET request to the
homepage of each of 15 well-known .go.ke hostnames and recorded the status
code, the Server and X-Powered-By headers, and page body markers such as
wp-content paths, Drupal and Joomla identifiers, and generator meta tags. No
path scanning, no subdomain enumeration, no exploitation attempts, nothing
beyond what a visitor's browser receives on a normal page load. The probe is
about ninety lines of Python and ships in this site's open repository
(scripts/govke-php-probe-20261022.py), so any technical reader can re-run it
against any domain list in minutes.

| Hostname | Status | What the response showed |
| --- | --- | --- |
| president.go.ke | 200 | WordPress (generator tag), behind Cloudflare |
| immigration.go.ke | 200 | WordPress (generator tag, 6.6.2) |
| konza.go.ke | 200 | WordPress (generator tag) |
| judiciary.go.ke | 200 | WordPress with Elementor; headers disclose PHP/7.4.30 |
| ict.go.ke | 200 | Drupal (generator tag: Drupal 10) |
| icta.go.ke | 200 | Drupal markers |
| treasury.go.ke | 200 | Drupal (generator tag: Drupal 10) |
| health.go.ke | 200 | Drupal (generator tag: Drupal 9) |
| kra.go.ke | 200 | Joomla markers |
| mombasa.go.ke | 200 | No CMS markers (openresty server header) |
| ecitizen.go.ke | 403 | No body served; Server header names cloudflare |
| statehouse.go.ke | no response | Connection failed during our window |
| education.go.ke | no response | Connection failed during our window |
| police.go.ke | no response | Connection failed during our window |
| kenya.go.ke | no response | Connection failed during our window |

Ten of fifteen hostnames answered. Nine showed signatures consistent with
PHP-based CMS platforms. One response in the set disclosed a runtime
version: judiciary.go.ke serves X-Powered-By: PHP/7.4.30 alongside a
matching Apache server header. PHP 7.4 left security support in November
2022, so that branch has no upstream fix for these CVEs; the backport route,
if one is available, runs through the OS vendor. A header can be stale or
set by a proxy, so it needs verification on the ground. Our claim is
narrower: a public response advertises a runtime branch that the official
fix does not cover, and that is worth a phone call by whoever owns the
server.

Four limitations bound everything above, and we would rather list them than
have a reader discover them.

- A CMS marker is not an inventory. WordPress, Drupal and Joomla all run on
  PHP, so the markers tell us the platform class, and they cannot tell us
  the patch level. Only the one disclosed header pins a version.
- One homepage, one request, one day. Anything behind a login, an API path,
  or a subdomain is invisible to this check, and most real exposure lives
  in exactly those places.
- A 403 or a dropped connection tells an outsider almost nothing. It could
  be a firewall, a blocklist, a restart, or a routing fault, and we cannot
  distinguish those from outside. We make no claim about eCitizen beyond
  what the table shows.
- The estate we could not see is larger than the estate we could. Counties,
  universities, hospitals and thousands of small businesses run PHP too.
  They sit outside this check entirely and belong to the wider risk
  picture, not to our findings.

## The data centre angle

Every PHP server in Kenya sits somewhere physical. The facility's
responsibility ends at power, cooling, connectivity and physical access;
the runtime is the tenant's problem, or the managed host's, depending on
the contract. Biometric doors and CCTV do not parse HTTP requests, and a
Tier III certification speaks to the availability of the plant, not to
what a tenant's application does with a malformed request. Readers who
want the physical layer mapped out can start with our guide to
[data centre physical security in Kenya](/articles/data-centre-physical-security-kenya).

Concentration changes the arithmetic. Kenya's commercial hosting estate
clusters in a small number of facilities, most of them in Nairobi, which
you can verify facility by facility in our
[DC Directory](/directory). When many customers share one building, one
unpatched runtime in that building raises the potential blast radius for
every network it touches. The actual risk in any specific facility depends
on segmentation, isolation, permissions and architecture, which is why
every advisory, Kenya's included, puts inventory before everything else.
It is also why we track the threat volume against Kenyan networks
separately from the market numbers in
[our data centre coverage](/articles/kenya-data-centre-market-numbers).

Kenya has already paid the reputational tuition this year. In July 2026
the presidency's website was defaced and taken offline for a period, an
incident that made national headlines. The operational cost was modest by
data centre standards. The trust cost was not. A runtime flaw that
executes before the application loads is a broader version of the same
exposure, because it does not depend on a weak password or a missed CMS
update.

If you buy hosting rather than operate it, three questions to your
provider are worth more than any checklist this week:

1. Which PHP version runs my stack, and when does your fixed release land?
2. Is my application on mod_php, on FPM behind a proxy, or in a container
   image I never see?
3. Where does your responsibility end and mine begin, in writing?

These are procurement questions. Asking them before an incident costs
nothing. Asking them after one costs a post-mortem.

One more thing follows from how this bug was found. Wiz located a
decade-old flaw with autonomous agents, and the same class of tooling will
keep finding others. Kenya's data centre market is courting AI workloads,
from [GPU cloud buildouts](/articles/gpu-cloud-infrastructure-kenya) to
AI-ready halls. AI-ready should mean more than GPU power and cooling; it
should mean patch discipline that acts at the speed AI-assisted research
now moves.

## What to do now

The advisory's measures and CISA's actions overlap almost exactly, so the
list below merges both. It takes an afternoon on a small estate and a
proper change window on a large one.

1. Inventory every PHP deployment, including the ones inside appliances
   and vendor packages. CISA notes PHP often ships as a component nobody
   counts.
2. Patch internet-facing systems first to PHP 8.5.12, 8.4.27, 8.3.36 or
   8.2.35.
3. If you run PHP 8.1 or older and cannot patch this week, CISA's guidance
   is to take the system offline until you can. Ask your OS vendor for a
   backport timeline in parallel.
4. Treat WAF rules as breathing room while you patch, and nothing more.
   CISA says a WAF may provide some protection; Datadog found the
   community workarounds incomplete.
5. Watch logs for PHP worker processes launching shells or downloading
   tools, per CISA's monitoring guidance.
6. Check third-party and vendor PHP applications against the same fix
   list, per the advisory's third-party measure.
7. Route suspected incidents to KE-CIRT/CC, and handle any personal data
   surfaced in a response within the Data Protection Act.

One date belongs in procurement documents. Under php.net's published
schedule, PHP 8.2 leaves security support on **31 December 2026**, two
months from this week. Contracts that specify supported runtimes should
carry that date, and any clause naming a version should name the security
end date of that version too.

The inventory, the patch and the monitoring are small jobs on their own.
The habit they build is the part that outlasts this specific bug, because
the next runtime disclosure will arrive with the same urgency and, if this
week is a guide, with less warning than the calendar promised.
