---
title: "Kenya Data Protection Act and Data Centres: What Operators and Customers Must Know"
slug: "kenya-data-protection-act-data-centres"
meta_description: "Kenya's Data Protection Act 2019 imposes specific obligations on data centres handling personal data. Understand consent, data localisation, breach notification, and what the law means for colocation customers and operators."
primary_keyword: "Kenya Data Protection Act data centres"
secondary_keywords:
  - "data protection Kenya"
  - "data localisation Kenya"
  - "ODPC Kenya"
  - "data breach notification Kenya"
  - "GDPR comparison Kenya"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Policy"
cluster: "Policy"
og_image: "/images/dc-security-camera.webp"
reading_time: "13 min"
images:
  - src: "/images/dc-security-camera-2.webp"
    alt:  "Surveillance camera overlooking a server hall"
    caption: "The Data Protection Act 2019 established Kenya's framework for protecting personal data, with significant implications for data centre operators and their customers"
    position: "hero"
  - src: "/images/dc-biometric-access.webp"
    alt:  "Biometric access control at a data centre"
    caption: "Compliance with the Data Protection Act requires both technical measures (encryption, access controls) and organisational measures (policies, training, breach response plans)"
    position: "section-break"
  - src: "/images/dc-servers-racks.webp"
    alt:  "Blue-lit server racks in a data hall"
    caption: "Data centre operators must implement measures to prevent unauthorised access to customer data stored on servers within their facilities"
    position: "inline"
  - src: "/images/dc-security-camera.webp"
    alt:  "Security cameras monitoring a colocation facility"
    caption: "Non-compliance with the Data Protection Act can result in fines of up to KES 5 million or 1% of annual turnover, making compliance a business necessity"
    position: "inline"
internal_links:
  - text: "Kenya data centre licensing framework"
    href: "/articles/kenya-data-centre-licensing-framework"
  - text: "data centre security explained"
    href: "/articles/data-centre-security-explained"
  - text: "data centre directory"
    href: "/directory"
external_sources:
  - title: "Office of the Data Protection Commissioner (ODPC)"
    url: "https://www.odpc.go.ke/"
  - title: "Kenya Data Protection Act 2019"
    url: "https://www.odpc.go.ke/legal-framework"
faq:
  - question: "Does the Data Protection Act apply to data centre operators?"
    answer: "Yes. Data centre operators are classified as data processors under the Act, meaning they process personal data on behalf of their customers (the data controllers). As processors, data centres have specific obligations including implementing appropriate security measures, processing data only as instructed by the customer, and supporting breach notification requirements."
  - question: "What is data localisation and does Kenya require it?"
    answer: "The Act does not impose strict data localisation (a blanket requirement to keep all data within Kenya). However, it restricts cross-border data transfers to countries with adequate data protection standards, or where the data subject has given consent, or where the transfer is necessary for a contract or legal obligation. In practice, this means many organisations choose to keep data in Kenya to avoid the complexity of cross-border transfer assessments."
  - question: "What happens if a data centre suffers a data breach?"
    answer: "The Data Protection Act requires data controllers (the data centre's customers) to notify the Office of the Data Protection Commissioner (ODPC) within 72 hours of becoming aware of a breach likely to result in a risk to the rights and freedoms of data subjects. The data centre, as processor, must notify the customer promptly so the customer can meet this obligation. Failure to notify can result in fines."
  - question: "How does Kenya's law compare to GDPR?"
    answer: "Kenya's Data Protection Act is modelled closely on the EU's GDPR, sharing core principles like lawful basis for processing, data subject rights, and breach notification. Key differences include lower maximum fines (KES 5 million vs GDPR's €20 million), a smaller regulator with limited enforcement capacity, and less developed case law and guidance. International companies operating in Kenya typically apply GDPR-level compliance as a baseline."
  - question: "Do cloud providers operating in Kenya need to comply?"
    answer: "Yes. Any entity processing personal data of Kenyan residents is subject to the Act, regardless of where they are physically located. AWS, Azure, and Google Cloud all comply with the Act when serving Kenyan customers. However, the question of where the data physically resides (in Kenya vs South Africa vs Europe) adds complexity to compliance, which is why data localisation is a growing topic."
canonical_url: "https://data-centers-254.vercel.app/articles/kenya-data-protection-act-data-centres"
---

When Kenya's Data Protection Act came into effect in November 2019, it fundamentally changed the legal landscape for any organisation that handles personal data — and that includes every data centre operator and every customer who places servers in a Kenyan facility. The Act, modelled closely on the European Union's General Data Protection Regulation (GDPR), established rights for individuals, obligations for organisations, and enforcement powers for the Office of the Data Protection Commissioner (ODPC) that, in principle, match the standards set by the world's most comprehensive data protection laws.

![Surveillance camera overlooking a server hall](/images/dc-security-camera-2.webp)

In practice, Kenya's data protection regime is still maturing. The ODPC, established in 2020, has been building its institutional capacity gradually. Enforcement actions have been limited, guidance documents are still being developed, and many organisations remain unclear on exactly what compliance requires. But the law is the law, and for data centre operators and their customers, understanding the Data Protection Act is not optional — it is a legal obligation with financial penalties for non-compliance of up to KES 5 million or 1% of annual turnover, whichever is higher.

## How the Act Classifies Data Centre Participants

The Data Protection Act uses two key roles that map directly onto the data centre industry. The **data controller** is the entity that determines the purposes and means of processing personal data. In a data centre context, the data controller is typically the customer — the bank that decides what customer data to store, how to process it, and why. The **data processor** is the entity that processes personal data on behalf of the controller. The data centre operator, which provides the physical infrastructure to store and process the controller's data, is a data processor.

This distinction matters because the Act imposes different obligations on controllers and processors. The controller bears the primary responsibility for ensuring lawful processing, obtaining consent, respecting data subject rights, and conducting data protection impact assessments. The processor must process data only as instructed by the controller, implement appropriate security measures, and support the controller's compliance obligations.

A data centre operator's obligations as a processor are defined by its contract with the customer. A well-drafted data processing agreement (DPA) between a data centre and its customer should specify what data the data centre may access, what security measures it must implement, what happens in the event of a breach, and what happens to the data when the contract ends. Without a DPA, both parties are exposed to legal risk.

## Key Obligations for Data Centre Operators

### Security Measures

The Act requires data processors to implement "appropriate technical and organisational measures" to protect personal data. For a data centre, this translates directly into the security infrastructure discussed in [our security guide](/articles/data-centre-security-explained): physical access controls (biometrics, mantraps, CCTV), network security (firewalls, intrusion detection, encryption), and environmental controls (fire suppression, climate control). A data centre that cannot demonstrate these measures is not just a security risk — it is a compliance risk.

### Processing Only as Instructed

A data centre must not access, copy, or process customer data beyond what is necessary to provide the contracted services. When a technician performs remote hands services — physically pressing a button or checking a status light on a customer's server — they must not access the data on that server. Data centre operators enforce this through access controls (technicians cannot log into customer servers), monitoring (CCTV and access logs record all physical access to equipment), and contractual provisions (the master service agreement and DPA prohibit unauthorised access).

![Biometric access control at a data centre](/images/dc-biometric-access.webp)

### Supporting Breach Notification

If a data centre experiences a security incident that affects customer data — whether a physical breach (unauthorised access to the server room), a cyber attack, or an equipment failure that exposes data — it must notify the affected customer promptly. The customer, as data controller, then has 72 hours to assess whether the breach poses a risk to data subjects and, if so, to notify the ODPC. A data centre that delays notifying its customer, or fails to detect a breach in the first place, could jeopardise the customer's ability to meet the 72-hour notification requirement.

### Sub-processor Management

If a data centre engages third parties — security contractors, cleaning staff, maintenance technicians — who may have access to areas where personal data is stored or processed, it must ensure those sub-processors provide equivalent data protection. The data centre remains liable to its customer for the actions of its sub-processors, so vetting, contracting, and monitoring third parties is a compliance requirement, not just a security best practice.

## Cross-Border Data Transfers

One of the most practically significant aspects of the Data Protection Act for data centre customers is the restriction on cross-border data transfers. Section 48 of the Act provides that personal data shall not be transferred outside Kenya unless the recipient country has been assessed by the ODPC as having an adequate level of data protection, or unless one of several exceptions applies (the data subject has consented, the transfer is necessary for a contract, the transfer is necessary for important reasons of public interest, or the transfer is made through binding corporate rules or approved codes of conduct).

![Blue-lit server racks in a data hall](/images/hero-server-hall.webp)

As of 2025, the ODPC has not published a comprehensive list of countries deemed to have adequate data protection. The EU (via GDPR), the United Kingdom (via UK GDPR), and several other jurisdictions would likely qualify, but the absence of a formal adequacy determination creates uncertainty. In practice, many Kenyan organisations interpret this requirement conservatively and choose to keep personal data within Kenya's borders — which drives demand for Kenyan data centre capacity.

For data centre operators, this provision is a commercial opportunity. The Data Protection Act creates a regulatory incentive for organisations to use Kenyan data centres rather than hosting in South Africa, Europe, or the cloud. A colocation facility that can demonstrate compliance with the Act, including through certifications like ISO 27001, becomes more attractive to customers who need to keep data in Kenya for regulatory reasons.

## Data Subject Rights and Their Impact on Data Centres

The Act grants Kenyan data subjects several rights that, while primarily the responsibility of the data controller, can affect data centre operations.

The right of access means a data subject can request a copy of their personal data. If the data is stored on servers in a data centre, the controller may need the data centre's assistance to access and extract it. The right to erasure ("the right to be forgotten") means a data subject can request deletion of their personal data. When data is stored on physical drives in a data centre, secure deletion requires the data centre's cooperation — either by the customer remotely wiping the data, or by the data centre performing physical drive destruction or secure erasure on the customer's instructions.

The right to data portability means data subjects can request their data in a structured, commonly used format. For data stored in a data centre, this may involve the data centre providing access to the physical drives or supporting the transfer of data to a different facility. These rights create operational obligations for data centres that go beyond simply providing power, cooling, and connectivity.

## Registration and Compliance

The Data Protection Act requires data controllers and processors to register with the ODPC. Data centre operators must register as data processors, and their customers (banks, telcos, government agencies) must register as data controllers. Registration involves providing details about the organisation, the types of data processed, the purposes of processing, and the security measures in place.

![Security cameras monitoring a colocation facility](/images/dc-security-camera.webp)

Beyond registration, compliance requires several ongoing activities. Data protection impact assessments (DPIAs) must be conducted for processing activities that are likely to result in a high risk to data subjects. Records of processing activities must be maintained. Staff who handle personal data must receive data protection training. And data centres must maintain documentation of their security measures, breach response procedures, and sub-processor agreements.

## The Practical Reality

Kenya's Data Protection Act is well-drafted legislation that, on paper, provides protections comparable to GDPR. The practical reality is that enforcement is still developing, many organisations are in early stages of compliance, and the ODPC has limited resources relative to the scale of its mandate. However, this is changing. The ODPC has issued guidance notices, conducted compliance assessments of government agencies, and is building its enforcement capacity.

For data centre operators, the message is clear: compliance is not a future concern, it is a current obligation. The operators that invest in compliance now — through ISO 27001 certification, robust data processing agreements, staff training, and security measures — will have a competitive advantage as enforcement intensifies. Those that treat compliance as an afterthought will face increasing legal, commercial, and reputational risk. The Data Protection Act is not just a legal requirement; it is becoming a market differentiator in Kenya's data centre industry.