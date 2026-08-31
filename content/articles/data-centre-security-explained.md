---
title: "Data Centre Security Explained: Physical, Network, and Compliance Layers"
slug: "data-centre-security-explained"
meta_description: "Data centre security operates on three layers: physical access control, network defences, and compliance frameworks like ISO 27001. Understand how Kenyan facilities protect infrastructure, data, and customer trust."
primary_keyword: "data centre security"
secondary_keywords:
  - "data centre physical security"
  - "data centre network security"
  - "ISO 27001 data centre Kenya"
  - "data centre compliance Kenya"
  - "data centre access control"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Security"
cluster: "Beginner"
og_image: "/images/dc-biometric-access.webp"
reading_time: "12 min"
images:
  - src: "/images/dc-security.webp"
    alt:  "Biometric access control and CCTV at a data centre"
    caption: "Tier III and IV data centres use multiple layers of physical security including biometric readers, mantraps, 24/7 CCTV monitoring, and on-site security personnel"
    position: "hero"
  - src: "/images/dc-gpu-cluster-2-wide.webp"
    alt:  "Secured server racks with locking cabinets"
    caption: "Colocation racks are individually locked, and access is logged and monitored — customers cannot access each other's equipment"
    position: "section-break"
  - src: "/images/dc-security-camera-2.webp"
    alt:  "Surveillance camera overlooking a server hall"
    caption: "Firewalls, intrusion detection systems, and DDoS mitigation appliances form the network security layer that protects data centre traffic from external threats"
    position: "inline"
  - src: "/images/dc-security-camera.webp"
    alt:  "Security cameras monitoring a colocation facility"
    caption: "Kenyan facilities layer cameras, mantraps, and biometrics — the reality is stricter than the brochure."
    position: "inline"
  - src: "/images/diagram-ssh-tcp-vpn.webp"
    alt:  "Comparison of SSH, TCP and VPN roles"
    caption: "Encrypted transport — SSH, TLS, VPNs — is the second wall after the mantrap."
    position: "diagram"

internal_links:
  - text: "what a data centre is"
    href: "/articles/what-is-a-data-centre"
  - text: "data centre tier ratings"
    href: "/articles/data-centre-tier-ratings-explained"
  - text: "Kenya data centre directory"
    href: "/directory"
external_sources:
  - title: "ISO/IEC 27001"
    url: "https://www.iso.org/isoiec-27001-information-security.html"
  - title: "Uptime Institute - Security"
    url: "https://uptimeinstitute.com/"
faq:
  - question: "What is the difference between physical and network security in a data centre?"
    answer: "Physical security protects the facility itself — preventing unauthorised people from entering the building, accessing server rooms, or touching equipment. It includes barriers, cameras, biometrics, guards, and access logging. Network security protects the data flowing through the facility — preventing unauthorised access to systems, blocking attacks, and ensuring data confidentiality and integrity. Both layers are essential; neither alone is sufficient."
  - question: "What certifications prove a data centre is secure?"
    answer: "The most recognised certification for information security management is ISO/IEC 27001, which covers policies, procedures, and controls for protecting data. SOC 2 Type II, common in the US tech ecosystem, is increasingly required by international customers operating in Kenya. For physical security, the Uptime Institute's Tier ratings include security requirements. PCI-DSS is required for facilities handling payment card data."
  - question: "How much does security cost as a percentage of data centre operating expenses?"
    answer: "Physical security typically accounts for 8–12% of a data centre's operating expenses, including security personnel (the largest single cost), CCTV systems, access control hardware, and monitoring. Network security adds another 5–10% when including firewalls, intrusion detection systems, DDoS mitigation, and security operations staff. Combined, security represents 15–20% of total opex for a well-run facility."
  - question: "What is a mantrap in data centre security?"
    answer: "A mantrap is a small room or corridor with two interlocking doors. A person enters through the first door, which locks behind them, and must be authenticated (typically by biometric scan, badge, or both) before the second door opens. This prevents tailgating — where an unauthorised person follows an authorised person through a door — which is one of the most common physical security breaches."
  - question: "Are Kenyan data centres secure enough for international standards?"
    answer: "The leading Kenyan facilities — iXAfrica NBOX1, Africa Data Centres facilities, and Safaricom's data centres — are designed and operated to international security standards. They employ biometric access, 24/7 security personnel, CCTV surveillance, and are pursuing ISO 27001 certification. However, security standards vary across the market, and smaller or older facilities may not meet the same levels. Customers should always verify specific certifications and security practices directly with the operator."
canonical_url: "https://data-centers-254.vercel.app/articles/data-centre-security-explained"
---

When a bank chooses to house its core banking servers in a data centre, it is trusting that facility with the digital equivalent of its vault. When a government agency places citizen data — tax records, health information, biometric data — on servers in a colocation facility, it is trusting that the data will not be accessed, modified, or stolen by anyone who should not have access. This trust is not given freely. It is earned through security systems, policies, and certifications that operate on multiple layers simultaneously.

![Biometric access control and CCTV at a data centre](/images/dc-security.webp)

Data centre security is not a single thing you can point to and say "there, that is security." It is a system of systems — physical barriers, electronic access controls, network defences, encryption protocols, compliance frameworks, and human procedures — all designed to work together so that a failure in any one layer does not compromise the whole. Understanding these layers is essential for anyone evaluating a data centre, whether as a potential customer, an employee, or an investor.

## Layer 1: Physical Security

Physical security is the most visible and intuitive layer of data centre protection. Its purpose is straightforward: prevent unauthorised people from getting close to the equipment, and ensure that every person who does enter is identified, authenticated, and logged.

### Perimeter Security

The outermost layer begins at the property boundary. For major data centre facilities in Nairobi, this includes perimeter walls or fences (typically 2.5–3 metres high, often with anti-climb features), CCTV cameras covering all approaches, vehicle barriers (bollards or crash-rated gates) to prevent ram-raiding, and security guards at the main entrance. The goal is to detect and deter any attempt to approach the facility before an intruder reaches the building itself.

Perimeter security also extends below ground and above the building. Anti-tunnelling measures, while less common in Kenya than in high-threat environments, may include ground-penetrating radar or buried sensors. Roof access points are secured and monitored, and adjacent buildings or vantage points that could overlook sensitive areas are assessed for surveillance risk.

### Building Access Control

Once inside the perimeter, access to the building itself is controlled through a series of checkpoints. The first is typically the reception area, where visitors are identified, their visit is verified against a pre-approved list, and they are issued a temporary access badge. This badge grants access only to specific areas and only during specific times. For employees and regular contractors, access is managed through a combination of proximity cards (RFID badges), biometric readers (fingerprint or iris scanners), and personal identification numbers (PINs).

The most critical access control mechanism in a data centre is the **mantrap**. A mantrap is a small room or corridor with two interlocking doors — you enter through the first door, which locks behind you, and you must be authenticated before the second door opens. This prevents "tailgating," where an unauthorised person follows closely behind an authorised person through a door. Tailgating is one of the most common and difficult-to-detect physical security breaches, and mantraps are the primary defence against it.

### Server Room and Rack-Level Security

Inside the server room, security becomes more granular. Access to individual rows or aisles of racks may be further restricted, with some areas accessible only to specific customers (in a colocation facility) or to specific roles (network engineers vs. facility engineers). Individual racks are locked with physical keys or electronic locks, and in carrier-neutral facilities, customers cannot physically access other customers' equipment.

Every access event — every door opened, every badge scanned, every biometric authentication — is logged in an access control system. These logs are retained for extended periods (typically 90 days to 1 year) and are used for audit purposes, incident investigation, and compliance verification. In a well-run facility, it should be possible to reconstruct exactly who accessed which area at what time, for any given date within the retention period.

## Layer 2: Network Security

While physical security protects the hardware, network security protects the data flowing through it. A data centre without network security is like a bank vault with the door left open — the servers may be physically secure, but the data they process and store is accessible to anyone who can reach them over the network.

![Comparison of SSH, TCP and VPN roles](/images/diagram-ssh-tcp-vpn.webp)

### Perimeter Network Defence

The first line of network defence is the perimeter firewall. A data centre typically deploys enterprise-grade firewalls (from vendors like Palo Alto Networks, Fortinet, Cisco, or Check Point) at the network boundary to control traffic entering and leaving the facility. These firewalls enforce rules about what types of traffic are allowed, block known malicious traffic patterns, and can perform deep packet inspection to detect threats embedded in legitimate-looking traffic.

Beyond firewalls, data centres deploy intrusion detection and prevention systems (IDS/IPS) that monitor network traffic for suspicious patterns — unusual connection attempts, data exfiltration, or traffic that matches known attack signatures. These systems can automatically block suspicious traffic and generate alerts for the security operations team.

### DDoS Protection

Distributed Denial of Service (DDoS) attacks — where attackers flood a target with traffic from many sources, overwhelming its capacity to respond — are a persistent threat to data centres and their customers. DDoS attacks in East Africa have increased significantly in recent years, driven by both ideological hacktivism and extortion attempts.

Data centres mitigate DDoS attacks through a combination of network-level defences (traffic scrubbing, rate limiting, and blackhole routing) and partnerships with DDoS mitigation providers (like Cloudflare, Akamai, or NEUSTAR) that can absorb and filter attack traffic before it reaches the data centre. The largest facilities maintain dedicated DDoS mitigation capacity on-site, while smaller facilities rely on upstream providers or cloud-based mitigation services.

![Surveillance camera overlooking a server hall](/images/dc-security-camera-2.webp)

### Zero Trust Architecture

The modern approach to data centre network security is moving toward "zero trust" architecture, which operates on the principle that no user, device, or network segment should be trusted by default — even if it is inside the data centre's network perimeter. Every access request must be authenticated, authorised, and encrypted, regardless of where it originates. This is a significant shift from the traditional model, where traffic inside the perimeter was considered safe and only external traffic was treated with suspicion.

Zero trust in a data centre context means implementing micro-segmentation (dividing the network into small, isolated segments with their own access controls), mutual TLS authentication between services, and continuous monitoring of all network traffic for anomalous behaviour. While full zero trust implementation is still evolving, Kenyan data centres serving international customers are increasingly expected to demonstrate progress toward this model.

## Layer 3: Data Security and Encryption

The third layer protects the data itself, regardless of whether it is at rest (stored on a server) or in transit (moving across the network). Data security measures include encryption, access controls at the application and database level, and backup and recovery procedures.

### Encryption

Encryption converts data into an unreadable format that can only be decrypted with the correct key. Modern data centres encrypt data both at rest (using AES-256 or similar algorithms) and in transit (using TLS 1.3 for network traffic and encrypted connections for storage replication). For colocation customers, encryption is often the customer's responsibility — the data centre provides the physical and network security, while the customer encrypts their own data. However, some facilities offer encryption-as-a-service for customers who want to outsource key management.

### Access Control and Identity Management

At the application and data level, access is managed through identity and access management (IAM) systems. These systems define who can access what data, under what conditions, and log all access for audit purposes. In a well-managed data centre environment, access follows the principle of least privilege — users are granted only the minimum access necessary to perform their job, and access is revoked when no longer needed.

## Compliance Frameworks

Security is not just about technology — it is about demonstrating to customers, regulators, and partners that specific standards are being met. Compliance frameworks provide the structure for this demonstration.

### ISO/IEC 27001

ISO 27001 is the international standard for information security management systems (ISMS). It specifies a framework of policies and procedures that an organisation must implement to manage information security risks. For data centres, ISO 27001 certification demonstrates that the facility has a systematic approach to identifying, assessing, and treating information security risks, and that this approach is regularly audited by an independent certification body.

In Kenya, the leading data centre operators are either ISO 27001 certified or in the process of obtaining certification. For international customers — banks, cloud providers, multinational corporations — ISO 27001 is often a non-negotiable requirement for choosing a colocation facility. Without it, a data centre is effectively excluded from competing for the most valuable customers.

![Secured server racks with locking cabinets](/images/dc-gpu-cluster-2-wide.webp)

### SOC 2 Type II

SOC 2 (Service Organisation Control 2) is an auditing standard developed by the American Institute of Certified Public Accountants. A SOC 2 Type II report evaluates an organisation's systems over a period of time (typically 6–12 months) to verify that they consistently meet security, availability, processing integrity, confidentiality, and privacy criteria. While more common in the North American market, SOC 2 compliance is increasingly expected by international technology companies operating in Kenya.

### PCI-DSS

The Payment Card Industry Data Security Standard (PCI-DSS) applies to any entity that stores, processes, or transmits payment card data. Data centres that host payment processing infrastructure — and in Kenya, this includes facilities serving banks, mobile money operators, and payment service providers — must demonstrate PCI-DSS compliance. This includes specific requirements for network segmentation, access control, encryption, and regular security testing.

## Security in Kenyan Data Centres: The Reality

Kenya's leading data centre operators — iXAfrica, Africa Data Centres, and Safaricom — have invested significantly in security infrastructure. iXAfrica's NBOX1 facility, for example, was designed from the ground up with Tier III security requirements, including biometric access, mantraps, 24/7 CCTV surveillance, and on-site security personnel. Africa Data Centres, as part of the pan-African Cassava Technologies group, applies group-wide security standards that align with international best practices.

![Security cameras monitoring a colocation facility](/images/dc-security-camera.webp)

However, security maturity varies across the Kenyan market. Smaller operator-built facilities and enterprise data centres may not have the same level of investment in security infrastructure, and the skills required to operate and maintain sophisticated security systems — network security engineers, security operations analysts, compliance auditors — are in short supply. As the market matures and customers become more demanding, security differentiation will become an increasingly important competitive factor.

For anyone evaluating a Kenyan data centre, the question should not be "is this facility secure?" but rather "what specific security measures does this facility implement, what certifications does it hold, and can I verify these claims through audit reports and site visits?" Security is not a checkbox — it is a continuous process of assessment, improvement, and verification.