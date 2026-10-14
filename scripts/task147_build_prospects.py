#!/usr/bin/env python3
"""Task 147 - Build the DC254 Launch List prospect CSV.

Every row starts UNREVIEWED per intelligence/README.md house rules.
Company-level business contacts only; no personal emails, no private numbers.
Evidence URLs point to the prospect's own site, a dated news page, or the
DC254 directory record. Priority: A = first 20 sends, B = second wave,
C = opportunistic / channel.

Output: intelligence/prospects/2026-10-14-launch-list.csv
"""

import csv
import os

DIR = "https://data-centers-254.vercel.app/directory"

COLS = ["org", "category", "icp", "city", "why_now", "evidence_url",
        "contact_channel", "role_to_target", "priority",
        "verification_status", "added", "notes"]

R = []


def row(org, cat, icp, city, why, ev, chan, role, pri, notes=""):
    R.append([org, cat, icp, city, why, ev, chan, role, pri,
              "UNREVIEWED", "2026-10-14", notes])


# ---------------- ICP-1: vendors / integrators (speed-to-cash #1) ----------
row("Atlancis Technologies", "DC solutions / OCP modular", "icp1-vendor",
    "Nairobi", "Active Open ICT DC provider; featured as partner on iXAfrica "
    "site (Aug 2026 snapshot)", "https://atlancis.com",
    "Website contact + LinkedIn", "Managing Director", "A",
    "ISO 9001; OCP-ready modular DC solutions")
row("Almiria Networks Kenya", "DC setup: racks, cooling, UPS", "icp1-vendor",
    "Nairobi", "Advertises full DC setup incl. precision cooling and UPS",
    "https://www.almirianetworks.co.ke", "Website contact page",
    "Business Development Manager", "A")
row("HubTech", "DC setup and fitout", "icp1-vendor", "Nairobi",
    "DC setup page incl. raised floor, fire suppression, biometric security",
    "https://www.hubtech.co.ke", "Website contact", "Managing Director", "A")
row("Delta Energy Systems (Kenya)", "Integrated DC infrastructure",
    "icp1-vendor", "Nairobi",
    "Markets fully integrated DC modules (UPS, cooling, power, fire)",
    "https://deltaenergysystems.co.ke", "Website contact",
    "Sales Director", "A")
row("iDeveloper Technologies", "DC solutions + maintenance", "icp1-vendor",
    "Nairobi", "DC installation plus annual maintenance contracts offering",
    "https://idevelopertechnologies.co.ke", "Website contact",
    "Managing Director", "A")
row("NuAir Technologies", "Precision cooling integration", "icp1-vendor",
    "Nairobi", "Positions itself as Kenya DC cooling systems integration "
    "partner", "https://www.nuairtech.com", "Website contact",
    "Managing Director", "A")
row("Universal Engineering Systems", "Mission-critical DC cooling",
    "icp1-vendor", "Nairobi",
    "Case on site: precision cooling delivered for a 3MW data centre",
    "https://universalengineering.co.ke", "Website contact",
    "Managing Director", "A")
row("Climate Evolution Africa", "Precision AC for DCs", "icp1-vendor",
    "Nairobi", "Listed among Kenya DC cooling companies (2026 industry "
    "roundup)", "https://ensun.io", "Website / LinkedIn",
    "Business Development Manager", "B")
row("DC Deployed", "DC construction management (intl)", "icp1-vendor",
    "Nairobi (serves KE)", "Offers DC construction management for Kenya "
    "projects", "https://dcdeployed.com", "Website contact",
    "Business Development", "B")
row("Schneider Electric East Africa", "OEM: power + cooling", "icp1-vendor",
    "Nairobi", "Public partner on iXAfrica NBOX1 hyperscale launch (2024) "
    "and capacity expansion (Nov 2024)", "https://www.se.com",
    "LinkedIn + partner channel", "Data Center Segment Lead", "B",
    "OEM scale; long cycle, high value")
row("OPENWORLD LTD", "DC migration + managed services", "icp1-vendor",
    "Nairobi", "Public case: data centre migration to colocation for one of "
    "Kenya's largest banks", "https://www.linkedin.com", "LinkedIn",
    "Founder / BD", "B")
row("Vertiv East Africa", "OEM: critical digital infrastructure",
    "icp1-vendor", "Nairobi", "Weak public Kenya partner signal; needs "
    "verification before pitch", "https://www.vertiv.com",
    "Partner search / LinkedIn", "Channel Manager", "C",
    "VERIFY partner/distributor for Kenya first")

# ---------------- ICP-2: operators -----------------------------------------
row("iXAfrica Data Centres", "Hyperscale colo operator", "icp2-operator",
    "Nairobi", "NBOX1.2 (18 MW) under construction; NBOX2 Tilisi (53 MW) "
    "committed", f"{DIR}/ixafrica-nbox1-2",
    "Website + LinkedIn", "Head of Business Development", "A")
row("iColo (Digital Realty)", "Carrier-neutral colo", "icp2-operator",
    "Nairobi + Mombasa", "NBO2 (6.4 MW) launched Sep 2026; Kenya transition "
    "to Digital Realty brand", f"{DIR}/icolo-nbo2",
    "Website contact", "Country Manager Kenya", "A")
row("Nxtra (Airtel Africa) Kenya", "New entrant, build phase", "icp2-operator",
    "Tatu City", "Construction started Sep 2025, claimed East Africa's "
    "largest DC at Tatu City", "https://ict.go.ke",
    "Website / LinkedIn", "Project Director", "A",
    "CANDIDATE QUEUE RECORD: page-level verification pending, not "
    "auto-ingested into directory")
row("Africa Data Centres", "Colo operator", "icp2-operator", "Nairobi",
    "NBO2 under construction (directory record, Under Construction status)",
    f"{DIR}/africa-dc-nairobi-2", "Website contact",
    "Sales Director East Africa", "B")
row("Raxio Data Centres Kenya", "Colo operator", "icp2-operator", "Nairobi",
    "Nairobi facility at Early Stage status = active build phase",
    f"{DIR}/raxio-nairobi", "Website contact", "Managing Director", "B")
row("PAIX Data Centres", "Colo operator", "icp2-operator", "Nairobi",
    "Operational NBO-1 (directory record)", f"{DIR}/paix-nairobi",
    "Website contact", "Commercial Manager", "B")
row("Liquid Intelligent Technologies Kenya", "Operator + cloud",
    "icp2-operator", "Nairobi", "Operational Nairobi DC (directory record)",
    f"{DIR}/liquid-nairobi", "Website contact",
    "Head of Data Centre Services", "B")
row("Safaricom", "Telco operator + AI DC record", "icp2-operator", "Nairobi",
    "Operational Waiyaki Way DC; Microsoft-G42 AI DC record at Early Stage",
    f"{DIR}/safaricom-dc-waiyaki", "Enterprise channel",
    "Data Centre Product Manager", "B")
row("Microsoft (G42 AI DC program)", "Hyperscaler program", "icp2-operator",
    "Nairobi", "AI DC record Early Stage; ADC Nairobi wind-down REPORTED "
    "(12-14 Oct)", f"{DIR}/microsoft-g42-ai-dc", "Press + LinkedIn",
    "Datacenter Program Lead", "B",
    "Treat facts as REPORTED until Microsoft statement")
row("Telkom Kenya", "Telco operator, 3 sites", "icp2-operator",
    "Nairobi + Mombasa", "Three directory records (Milimani, Telephone "
    "House x2)", f"{DIR}/telkom-milimani-nairobi", "Website contact",
    "Head of Enterprise", "C")
row("Wananchi Group", "Operator (Zuku)", "icp2-operator", "Nairobi",
    "Operational DC (directory record)", f"{DIR}/wananchi-nairobi",
    "Website contact", "Technology Director", "C")
row("SimbaNET Kenya", "Operator / MSP", "icp2-operator", "Nairobi",
    "Operational (directory record)", f"{DIR}/simbanet-nairobi",
    "Website contact", "Managing Director", "C")
row("Septris EO Ltd", "Operator", "icp2-operator", "Nairobi",
    "Operational (directory record)", f"{DIR}/septris-nairobi",
    "Website contact", "Managing Director", "C")
row("Global Telecommunications & Services", "Operator", "icp2-operator",
    "Nairobi", "Operational (directory record)", f"{DIR}/global-ts-nairobi",
    "Website contact", "Managing Director", "C")
row("SEACOM Mombasa", "Cable landing + hosting", "icp2-operator", "Mombasa",
    "Operational CLS (directory record)", f"{DIR}/seacom-mombasa-cls",
    "Website contact", "Facilities Manager", "C")
row("Kenya Data Centres (ICT Authority)", "Public SME facility",
    "icp2-operator", "Nairobi", "Early stage public program (directory "
    "record)", f"{DIR}/kenya-data-centres-sme", "Official channels",
    "Program Lead", "C")

# ---------------- ICP-3: analysts / investors -------------------------------
row("Helios Investment Partners", "PE, iXAfrica majority owner",
    "icp3-analyst", "London / Nairobi", "Portfolio company iXAfrica is "
    "expanding (NBOX1.2, NBOX2)", "https://www.heliosinvestment.com",
    "Website IR contact", "Principal (digital infrastructure)", "B",
    "One-off Market Map dataset buyer profile")
row("Data Centres Africa", "Media / consultancy", "icp3-analyst",
    "Pan-Africa", "Continent's DC analysis platform; syndication partner "
    "candidate", "https://datacentresafrica.com", "Website contact",
    "Editor", "C")
row("Credence Research", "Market research publisher", "icp3-analyst",
    "International", "Publishes Kenya DC market reports (USD 266M 2025 to "
    "USD 805M 2031)", "https://www.credenceresearch.com",
    "Website contact", "Research Manager", "C",
    "Potential buyer of verified local data; also a competitor")
row("D4DHub / ECDPM", "Institutional research", "icp3-analyst",
    "International", "Publishes East Africa Data Center Markets Brief",
    "https://cms.d4dhub.eu", "Website contact", "Research Fellow", "C")

# ---------------- ICP-4: recruiters (Microsoft ADC angle) -------------------
row("DataX Connect", "Global DC recruiter", "icp4-recruiter", "Global",
    "DC recruitment specialist expanding in Africa; talent churn event: "
    "Microsoft ADC wind-down REPORTED", "https://dataxconnect.com",
    "Website contact", "Regional Director", "B")
row("First Point Group", "DC recruitment (Africa)", "icp4-recruiter",
    "South Africa / Global", "Recruits DC engineers across African markets",
    "https://www.firstpointgroup.com", "Website contact",
    "Regional Manager", "B")
row("LVI Associates", "DC hiring practice", "icp4-recruiter", "Global",
    "Dedicated data center hiring practice",
    "https://www.lviassociates.com", "Website contact",
    "Consultant, Data Center Practice", "C")
row("Airswift", "Workforce solutions", "icp4-recruiter", "Global",
    "Data center recruitment arm active in Africa",
    "https://www.airswift.com", "Website contact",
    "Africa Business Manager", "C")
row("Alpha Apex Group", "DC recruitment", "icp4-recruiter", "Global",
    "Listed among best data center recruiters 2026",
    "https://www.alphaapexgroup.com", "Website contact",
    "Engagement Manager", "C")
row("IBTC Data Centre Academy Kenya", "DC training provider", "icp4-recruiter",
    "Nairobi", "Expanded into Kenya with Schneider Electric support (2026)",
    "https://www.linkedin.com", "LinkedIn", "Director", "C",
    "Workforce Watch partner candidate")

# ---------------- Events (channel) ------------------------------------------
row("Datacloud Africa (Nairobi)", "Summit, co-located with ITW Africa",
    "events", "Nairobi", "Africa's DC and cloud summit; exhibitor and "
    "speaker pool for prospecting", "https://www.datacloudafrica.com",
    "Sponsorship desk", "Partnerships Lead", "C")
row("Africa Datacenters & Cloud Days", "Conference", "events", "Nairobi",
    "2026 edition; community pool", "https://africadca.org",
    "Sponsorship desk", "Partnerships Lead", "C")
row("Data Centre & Cloud Expo Africa", "Expo", "events", "Nairobi",
    "Exhibitor pool across vendors", "https://datacentersinafrica.com",
    "Sponsorship desk", "Partnerships Lead", "C")
row("Global Data Festival & Kenya Space Expo", "Gov-hosted gathering",
    "events", "Nairobi", "2-5 Jun 2026, Nairobi",
    "https://expo.ksa.go.ke", "Official channels", "Partnerships Lead", "C")

# ---------------- Ecosystem --------------------------------------------------
row("KDEAP PMU (ICT Authority)", "Donor-funded program", "icp6-kdeap",
    "Nairobi", "Fibre backbone SPN procurement closes 10:00 EAT 29 Oct "
    "2026", "https://kdeap.icta.go.ke", "Official channels",
    "PMU Lead", "C",
    "Reader/validator relationship, not a payer yet")

# ---------------- Apify sweep additions (Task 148, 2026-10-14) ---------------
# Source: intelligence/raw/2026-10-14-radar-vendors.json + radar-jobs.json
# (google-search-scraper, 8 queries, 71 organic results, all UNREVIEWED)
row("TeleNET", "DC infrastructure solutions", "icp1-vendor", "Nairobi",
    "Dedicated data centre infrastructure solutions page (rack, cooling, "
    "power)", "https://www.telenet.co.ke/solutions/data-centre-infrastructure/",
    "Website contact", "Business Development Manager", "A",
    "Source: Apify vendor sweep 2026-10-14")
row("Kalcom Solutions", "DC maintenance services", "icp1-vendor", "Nairobi",
    "Dedicated data center maintenance offering; recurring-service fit with "
    "the Radar", "https://kalcomsolutions.com/data-center-maintenance/",
    "Website contact", "Managing Director", "A",
    "Source: Apify vendor sweep 2026-10-14")
row("Carrel Technologies", "DC solutions (public-sector vertical)",
    "icp1-vendor", "Nairobi",
    "Data centre solutions under public-sector industry verticals",
    "http://carreltech.com/site/industry-verticals/public-sector/"
    "data-centre-solutions", "Website contact", "Business Development "
    "Manager", "B", "Source: Apify vendor sweep 2026-10-14")
row("MASC Solutions", "Fire detection + gaseous suppression", "icp1-vendor",
    "Nairobi", "Public data centre fire detection and gaseous suppression "
    "project case on site", "https://mascsolutions.com",
    "Website contact", "Managing Director", "B",
    "Source: Apify vendor sweep 2026-10-14")
row("Flammatech Africa", "Fire suppression projects", "icp1-vendor",
    "Nairobi", "Fire suppression projects portfolio includes data centres",
    "https://flammatech.africa/projects/", "Website contact",
    "Business Development Manager", "B",
    "Source: Apify vendor sweep 2026-10-14")
row("Cargen (Cummins East Africa)", "Generator dealer (OEM channel)",
    "icp1-vendor", "Nairobi", "Regional Cummins generator dealer; AI/DC "
    "power demand rising (Cat/Cummins DC generator boom coverage)",
    "https://cumminscargen.com/", "Website contact",
    "Sales Director", "B", "Source: Apify vendor sweep 2026-10-14")
row("Ekkosense", "DCIM software (active at ADC)", "icp1-vendor",
    "Global (active in KE)", "Public DCIM case study with Africa Data "
    "Centres", "https://www.ekkosense.com", "Website contact",
    "Regional Sales Manager", "C",
    "International vendor already selling into the Kenyan market")
row("Oracle Kenya", "Hyperscaler DC operations", "icp2-operator", "Nairobi",
    "Hiring datacenter technicians in Nairobi (multiple 2026 postings) = "
    "active DC spend", "https://www.myjobmag.co.ke/job/"
    "datacenter-technician-oracle", "Careers + LinkedIn",
    "Data Centre Site Lead", "B",
    "Source: Apify job sweep 2026-10-14; hiring is a signal, not status")
row("Wamae Allen", "Law firm, DC regulatory practice", "icp3-analyst",
    "Nairobi", "Published 'Data Centres in Kenya: Legal and Regulatory "
    "Guide'; natural Radar subscriber for regulatory tracking",
    "https://wamaeallen.com/data-centres-in-kenya-legal-regulatory-guide/",
    "Website contact", "Partner, Technology", "C",
    "Source: Apify tender sweep 2026-10-14")
row("TenderFlow", "Tender aggregator KE/UG/TZ", "channel", "Nairobi",
    "Runs live tender listings for East Africa; competitor and potential "
    "data partner", "https://tenderflow.co.ke/tenders",
    "Website contact", "Founder", "C",
    "channel bucket: map coverage overlap before any partnership")
row("Savannah Training", "DC fire specialist course", "channel", "Nairobi",
    "Runs Data Centre Fire Specialist course; training ecosystem contact "
    "for Workforce Watch", "https://savannahtraining.co.ke/pages/"
    "data-centre-fire-specialist", "Website contact", "Director", "C",
    "Source: Apify vendor sweep 2026-10-14")


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    repo = os.path.dirname(os.path.dirname(here))
    out = os.path.join(repo, "intelligence", "prospects",
                       "2026-10-14-launch-list.csv")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(COLS)
        for r in R:
            w.writerow(r)
    print("rows:", len(R), "->", out)
    pri = {}
    for r in R:
        pri[r[8]] = pri.get(r[8], 0) + 1
    print("priority split:", pri)


if __name__ == "__main__":
    main()
