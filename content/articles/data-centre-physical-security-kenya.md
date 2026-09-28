---
title: "Data Centre Physical Security in Kenya: The Layers"
slug: "data-centre-physical-security-kenya"
meta_description: "How Kenyan data centres stack physical defences: perimeter, guards, biometrics, mantraps, CCTV retention, rack locks and audit logs. What to verify on a site tour."
primary_keyword: "data centre physical security Kenya"
secondary_keywords:
  - "physical security data centre standards"
  - "data centre access control biometrics"
  - "mantrap data centre"
  - "data centre security systems Kenya"
  - "secure data centres Nairobi"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-09-28"
updated_date: "2026-09-28"
category: "Security"
cluster: "Kenya"
og_image: "/images/dc-security.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-biometric-access.webp"
    alt: "Biometric access control reader at a data centre door"
    caption: "Biometric readers are the second checkpoint in a well-layered Kenyan facility, after the perimeter and before the mantrap."
    position: "hero"
  - src: "/images/dc-security-camera.webp"
    alt: "Security cameras monitoring a colocation facility aisle"
    caption: "CCTV coverage with retention turns every physical event into reviewable evidence."
    position: "section-break"
  - src: "/images/dc-biometric-access-3.webp"
    alt: "Mantrap door system controlling entry to a server suite"
    caption: "A mantrap admits exactly one authenticated person at a time, which is what makes tailgating difficult."
    position: "inline"
internal_links:
  - text: "data centre security explained"
    href: "/articles/data-centre-security-explained"
  - text: "security threats facing Kenyan data centres"
    href: "/articles/data-centre-security-threats-kenya"
  - text: "data centre fire suppression systems"
    href: "/articles/fire-suppression-systems-kenyan-data-centres"
  - text: "Kenya Data Protection Act"
    href: "/articles/kenya-data-protection-act-data-centres"
  - text: "ISO 27001 for Kenyan data centres"
    href: "/articles/iso-27001-data-centre-kenya"
  - text: "browse verified Kenyan facilities"
    href: "/directory"
external_sources:
  - title: "Computer Misuse and Cybercrimes Act, 2018 (Kenya Law)"
    url: "https://www.kenyalaw.org/kl/typo3mt/fileadmin/pdf/acts/ComputerMisuseandCybercrimesActNo.18of2018.pdf"
  - title: "ISO/IEC 27001 Information Security Management (ISO)"
    url: "https://www.iso.org/isoiec-27001-information-security.html"
  - title: "Communications Authority of Kenya, KE-CIRT/CC"
    url: "https://www.ca.go.ke/business-care/ke-cirt"
faq:
  - question: "What is a mantrap and why does it matter so much?"
    answer: "A mantrap is a small vestibule with two interlocking doors: the first door locks behind you, and the second opens only after you are authenticated. It exists to defeat tailgating, where an unauthorised person walks in behind an authorised one. Tailgating is one of the most common physical breaches in office-style buildings, and in a data centre it bypasses every badge system at once. Mantraps, often paired with biometric verification and a guard's visual check, are the standard countermeasure in Kenya's Tier III-class facilities."
  - question: "How long do Kenyan data centres keep access logs and CCTV footage?"
    answer: "Practice varies, but well-run facilities retain access control records and CCTV footage for periods in the range of 90 days to one year. Retention matters for three reasons: incident investigation, customer audits, and prosecution. Under the Computer Misuse and Cybercrimes Act 2018, a case for unauthorised access needs evidence, and access logs together with CCTV are what turn a suspicion into a provable event."
  - question: "What should I actually check on a data centre site tour?"
    answer: "Walk the path an intruder would take, then the path your equipment takes. Check that the perimeter has detection, not just fencing; that the mantrap admits one person at a time; that rack-level locks match your suite assignment; that CCTV covers the aisles and the loading bay; and ask to see how access logs are exported for audit. A facility that hesitates to show you its own process is telling you something."
canonical_url: "https://data-centers-254.vercel.app/articles/data-centre-physical-security-kenya"
---

Ask what makes a data centre secure and most people picture a firewall. In practice, the first attack a Kenyan facility has to survive is physical: someone getting to equipment they should never touch. Every other control, encryption, network segmentation, compliance certificates, assumes one thing, that only authorised people can physically reach the hardware. That is why physical security is Layer 1 in [our security model](/articles/data-centre-security-explained), and why it deserves its own inspection, layer by layer.

## The perimeter: delay and detect before the door

The outermost layer begins at the property boundary. For major facilities in Nairobi, that means perimeter walls or fences typically 2.5 to 3 metres high with anti-climb features, CCTV covering all approaches, vehicle barriers such as bollards or crash-rated gates to stop ram-raiding, and guards at the main entrance. The design goal is not one perfect wall. It is to force any approach to consume time, make noise, and leave a record before it reaches the building.

Detection matters as much as delay. A fence only helps if someone is watching it, which is why perimeter CCTV, patrol routines, and intrusion sensors on gates and fences are the difference between a boundary and a formality. Roof access points are secured and monitored, and facilities assess adjacent buildings or vantage points that could overlook sensitive areas.

## Building access: badges, biometrics, and the mantrap

Inside the perimeter, access becomes a sequence of checkpoints. Reception identifies visitors and verifies them against a pre-approved list before issuing a temporary badge scoped to specific areas and times. Employees and regular contractors authenticate with a combination of proximity cards, biometric readers such as fingerprint or iris scanners, and PINs, so that a stolen badge alone does not open anything.

The critical control is the mantrap: a vestibule with two interlocking doors where the first locks behind you and the second opens only after authentication. It defeats tailgating, the single most common physical breach technique, and in facilities serving banks and telcos it is usually paired with a guard's visual check. The GSC-era reality is that buyers ask for this specifically; "badge, retinal scan, mantrap" is now a shorthand tenants use when they describe what a serious facility looks like.

## Inside the white space: suites, racks, and logging

Past the mantrap, security becomes granular. In a carrier-neutral facility, access is scoped so that customers cannot physically reach other customers' equipment: suite doors, cage areas, and individually locked racks, with electronic locks replacing mechanical keys where audit granularity matters. Every event, every door, every badge, every biometric acceptance or rejection, lands in an access control system that keeps records typically for 90 days to one year.

Logging is what converts hardware into evidence. In a well-run facility you can reconstruct exactly who entered which area at what time, for any date in the retention window. That capability serves incident investigation, customer audits, and, where it comes to it, prosecution under the Computer Misuse and Cybercrimes Act 2018, which requires proof of unauthorised access. Physical security done well does not just stop people; it produces the record that makes stopping them legally meaningful.

## The layer everyone forgets: the loading bay and the vendors

Most physical breaches in real facilities do not happen at the front door, they happen where goods and people routinely flow: the loading bay, the generator yard, and the vendor intake process. A delivery van arriving with replacement UPS batteries is a legitimate event; an unverified "technician" arriving with a toolbox and a confident story is a classic intrusion pattern. Kenyan facilities that handle this well run escorted vendor access, verify work orders against a pre-registered contact at the customer, seal and inspect equipment movements, and treat every after-hours delivery as an exception that needs a named approver.

## What Kenya's threat environment changes

Kenya's facilities defend against the same attacks as any market, with one local sharpening: the country's history of sophisticated social engineering makes the human layer a primary target rather than an afterthought. A biometric reader is worthless if a guard is talked into propping a door, which is why the [attack patterns that matter in Kenya](/articles/data-centre-security-threats-kenya) pair technical intrusion with social engineering, and why procedures, guard briefing, escort rules, disposal of decommissioned drives, are as much a part of physical security as steel and sensors.

## What the leading Kenyan facilities actually run

Kenya's leading operators, iXAfrica, Africa Data Centres, and Safaricom, have invested heavily in this stack. iXAfrica's NBOX1 was designed to Tier III security requirements from the ground up: biometric access, mantraps, 24/7 CCTV surveillance, and on-site security personnel. Africa Data Centres applies group-wide security standards inherited from its pan-African parent. Maturity varies across the wider market, smaller enterprise server rooms and older buildings do not all match this standard, which is exactly why verification, not assumption, is the buyer's job.

If you are evaluating a facility, the question is not "is it secure?" but "what exactly does it run, and can you prove it?" Ask which controls are in place at each of the layers above, whether the operator holds [ISO 27001 certification](/articles/iso-27001-data-centre-kenya) and for what scope, how access logs are exported for your audit, and what the [fire and environmental controls](/articles/fire-suppression-systems-kenyan-data-centres) look like next to the physical ones. The [DC254 directory](/directory) lists tracked facilities so you can shortlist and then verify in person.
