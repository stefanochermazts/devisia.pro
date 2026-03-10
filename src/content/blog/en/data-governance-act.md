---
title: "A Pragmatic Guide to the EU Data Governance Act for Technical Leaders"
description: "Understand the data governance act and how it shapes compliance, data sharing, and architecture for B2B software teams."
pubDate: 2026-03-03T08:45:44.859Z
heroImage: "https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/3d3b1ac3-12da-4a1c-b2da-71cbf3cd2bdc/data-governance-act-compliance-guide.jpg"
author: "Devisia AI"
tags: ["data governance act", "EU data regulation", "data sharing", "saas compliance", "privacy by design"]
translationSlug: "data-governance-act"
autoTranslateToIt: true
---
The EU's **Data Governance Act (DGA)** is not just another compliance regulation. It's a pragmatic framework designed to solve a critical problem: making it safe and technically feasible for organizations to share data.

Its purpose is to unlock the value in vast datasets—mostly non-personal—that are currently inaccessible, locked away in public and private sector silos. By establishing clear rules for data intermediaries and encouraging data donation for public good (data altruism), the DGA aims to enable a more connected and innovative data economy. For technical leaders, understanding its mechanics is key to both compliance and opportunity.

## Why the Data Governance Act Exists and What Problem It Solves

![Illustration showing data silos blocking innovation, with DGA enabling trusted data exchange.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/df9606ad-d408-4e3d-99d1-60df5c9bec2a/data-governance-act-data-exchange.jpg)

Before the DGA, the EU faced a data paradox. Enormous volumes of valuable data—from anonymized public transport patterns to aggregated industrial IoT sensor readings—were sitting unused within public bodies and private companies. This data hoarding doesn't just slow down academic research; it actively stifles innovation and creates economic dead ends.

For any founder or CTO, the problem was twofold. First, the trust deficit: sharing data felt inherently risky due to concerns about competitive disadvantage, accidental privacy breaches, or misuse. Second, the technical deficit: a lack of standardized APIs and protocols made every attempt at data exchange a costly, bespoke integration project.

### Addressing the Trust and Technical Deficits

Without a common rulebook, data sharing has always been a high-friction exercise. The DGA was engineered to solve these two problems directly by providing a legal structure to build trust and a technical framework to drive interoperability. It is best understood not as a compliance burden, but as a market-enabler.

> The core idea behind the **Data Governance Act** is not to force data sharing, but to create a predictable environment where organizations choose to share data because the risks are managed and the benefits are clear.

This framework was a direct response to market needs. A 2020 European Commission consultation revealed that **90% of respondents** agreed that formal governance was critical for unlocking cross-sector innovation. This feedback from industry stakeholders directly shaped the DGA. You can review the [findings from the European Parliament](https://www.europarl.europa.eu/legislative-train/theme-a-europe-fit-for-the-digital-age/file-data-governance-act) to trace its legislative journey.

### Unlocking Value, Not Adding Hurdles

For B2B software and AI companies, the DGA should be viewed through a strategic lens. It's about new technical and business opportunities, not just new rules. The Act creates a clear pathway for:

*   **Accessing Public Sector Data:** The DGA mandates that public bodies establish processes for making non-personal data available for re-use, creating opportunities to build new services in mobility, healthcare, or environmental science.
*   **Creating New Data Services:** It formally enables "data intermediation services"—neutral, trusted third parties that facilitate secure data exchange between other organizations.
*   **Fueling AI and Analytics:** A more reliable supply of high-quality, diverse data is the lifeblood of robust machine learning models. The DGA aims to get that data flowing.

By putting this framework in place, the DGA is designed to create a virtuous cycle: more trust leads to more data sharing, which in turn fuels innovation and proves the value of the governance structure.

## Decoding the Core Concepts of the Data Governance Act

To build compliant systems, technical leaders must first understand the DGA's core vocabulary. The regulation establishes a new ecosystem with defined roles and responsibilities. This is not just legal jargon; it's a functional blueprint for a trustworthy data marketplace.

Think of the DGA as defining the rules of engagement for this marketplace. It introduces clear definitions for the key actors, ensuring everyone operates from a common understanding of their functions and obligations.

### The Main Actors on the DGA Stage

The Act is built around three primary roles. Identifying which role(or roles) your organization might play is the first step toward a concrete implementation strategy.

*   **Data Holders:** Any public sector body or private company that collects and controls data. This could be a municipality holding anonymized traffic flow data or a factory with aggregated sensor data from its production lines. Their key function is to make this data available for re-use under secure and non-discriminatory conditions.

*   **Data Users:** The companies or individuals seeking to access data from holders to build new products, conduct research, or generate insights. A SaaS company might be a data user when it accesses public environmental data to build a new sustainability analytics feature.

*   **Data Intermediation Services Providers:** A new and critical role created by the DGA. These are neutral third parties that provide the technical and legal infrastructure for data sharing between holders and users. They act as a trusted conduit, ensuring data moves securely and compliantly without the intermediary itself analyzing or using the data.

> A core principle is **neutrality**. A data intermediary is prohibited from using the data it handles for its own commercial purposes. This structural separation is an architectural choice designed to build trust by preventing conflicts of interest. Their only business is to facilitate the exchange.

This separation is fundamental. It assures both data holders and users that the intermediary is a secure, trustworthy channel, removing the need for complex, one-off sharing agreements between individual parties.

### Key Roles and Responsibilities Under the Data Governance Act

This table clarifies the distinct functions and core obligations of the main actors defined within the DGA framework.

| Actor Role | Description | Primary Obligation Example |
| :--- | :--- | :--- |
| **Data Holder** | A public or private entity that collects and controls data. | Making non-personal data available for re-use in a secure and non-discriminatory way. |
| **Data User** | An individual or entity that accesses and uses data for commercial or non-commercial purposes. | Complying with the specific conditions set by the data holder for data re-use. |
| **Data Intermediary** | A neutral third party that facilitates data sharing between holders and users. | Acting as a fiduciary for data subjects and refraining from using the data for its own purposes. |

### New Concepts: Data Altruism and Intermediaries

The DGA also introduces two powerful concepts to boost data availability and regulate the new marketplace it creates.

**Data Altruism** is a formal framework that allows individuals and companies to voluntarily consent to their data being used for purposes of general interest, such as scientific research or improving public services. The Act establishes a certification for **"data altruism organizations"** to ensure such data is handled ethically and securely. For instance, a company could donate its anonymized supply chain data to researchers studying economic resilience.

The DGA also places strict obligations on **Data Intermediation Services**. To operate, these providers must notify a national authority and are strictly prohibited from using the shared data for any other purpose. They have a fiduciary duty to act in the best interests of data subjects, solidifying their role as neutral brokers. This is a critical consideration for any platform building data-sharing features, as it could place them under these rigid neutrality rules.

## Your Key Obligations and Compliance Deadlines

Translating the DGA's theory into concrete engineering tasks is an immediate priority for B2B software companies in the EU. The grace period is over.

The Data Governance Act became fully applicable across all EU Member States on **24 September 2023**. That deadline followed a 15-month implementation period, meaning the obligations are active *now*. Your responsibilities depend entirely on which role your organization plays in the data ecosystem. You can see the DGA's place in the wider legislative context by reviewing the [EU's strategy for the data economy](https://www.roschier.com/eu-data-economy-digitalization/data-governance-act).

### Core Obligations for Data Intermediation Services

If your platform facilitates data sharing between other organizations, you may be classified as a **data intermediation service provider**. This role carries the most stringent DGA obligations, designed to enforce neutrality.

*   **Structural Separation:** You must keep your data intermediation service legally and operationally separate from your other services. You cannot use the data flowing through the platform for your own commercial gain, such as improving your own products or selling derived analytics.
*   **Fiduciary Duty:** You have a legal obligation to act in the best interests of the data subjects whose data you handle. This requires robust systems for managing consent and enforcing purpose limitation.
*   **Notification Requirement:** Before operating, you must notify the designated national authority, which will add you to a public register and place you under its direct oversight.

> A naive approach, such as building a "data marketplace" feature that also feeds your own analytics engine, would directly violate the DGA's neutrality rules. The regulation demands a clean architectural and business separation between facilitating data exchange and exploiting it.

### Rules for Re-using Public Sector Data

For companies acting as **data users**, the DGA standardizes the process for accessing non-personal data held by public sector bodies. This creates significant opportunities but comes with clear conditions.

The diagram below shows how the key roles established by the Data Governance Act interact.

![Concept map illustrating the roles of Data Governance Authority (DGA) with data holders, intermediary, and data users.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/aa2fb8ea-8c94-4054-b94c-37bd27e01d69/data-governance-act-dga-roles.jpg)

As a data user, your primary obligation is to adhere to the conditions set by the data holder, enforced through legal agreements and technical controls.

These conditions will likely include:

*   **Non-Discrimination:** Public bodies must establish fair, transparent, and non-discriminatory terms for data re-use.
*   **Compliance with Terms:** You must only use the data for the agreed-upon purposes and respect any technical constraints, such as using it only within a secure processing environment provided by the public body.
*   **Confidentiality:** If a dataset contains commercially sensitive information (e.g., business secrets), you are legally required to protect its confidentiality. This typically involves a formal **Data Processing Agreement (DPA)** that governs how data is handled. For a closer look, **[check out our guide on Data Processing Agreements](https://devisia.pro/blog/data-processing-agreement)**.

### Becoming a Recognised Data Altruism Organisation

Finally, the DGA creates a formal status for **"data altruism organizations."** If your organization wishes to collect and process data for the public good, you can register for this official status. This designation builds trust but requires you to be:
*   A **non-profit** entity.
*   Fully transparent about your data processing activities.
*   Equipped with robust security measures to protect the data you hold.

## Architectural Changes Your Software Platform Needs

![Diagram illustrating compliant software architecture with data anonymization, consent, API gateway, audit log, and secure sources.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/9fad1f20-76c7-4d1d-8f6e-54008ba2039a/data-governance-act-software-architecture.jpg)

The Data Governance Act is a technical mandate for CTOs and engineering leaders. It confirms a core principle: privacy and governance are not features to be added later; they are architectural decisions.

Attempting to achieve compliance with ad-hoc methods like insecure file transfers or raw database exports is a recipe for failure. These approaches offer no auditability, no granular access control, and no way to manage consent. A robust, compliant architecture is the only sustainable path.

### Secure APIs as the Foundation

The cornerstone of compliant data sharing under the DGA is a **secure API gateway**. An API-first architecture is non-negotiable, providing the control, standardization, and observability required for every data transaction.

*   **Granular Access Control:** APIs must enforce permissions with precision. Basic Role-Based Access Control (RBAC) is often insufficient. You should architect for Attribute-Based Access Control (ABAC) to create dynamic rules based on user attributes, data sensitivity, or project context.

*   **Standardised Data Formats:** APIs enforce a consistent structure, ensuring that only intended data leaves your system and preventing accidental data leakage.

*   **Rate Limiting and Throttling:** Implementing rate limits is critical for preventing abuse, whether from malicious actors attempting data exfiltration or misconfigured clients overwhelming your services.

This disciplined, API-centric model replaces chaotic, insecure data sharing with a managed and auditable process.

### Implementing Robust Logging and Auditing

To prove compliance, you must be able to demonstrate who accessed what data, when, and for what purpose. Comprehensive logging is not optional; it is fundamental to accountability.

> Your system must maintain an immutable audit trail of every data access event. Logs must capture each API call related to data sharing: the user identity, the specific data requested, the timestamp, and the request's success or failure.

This audit log serves as your primary evidence for regulatory inquiries, incident investigations, and demonstrating transparency to data holders and users. It must be designed for long-term storage, searchability, and tamper-resistance.

### Managing Consent and Data Provenance

The DGA reinforces the GDPR principles of consent and purpose limitation. Architecturally, this requires a system that can track and enforce the permissions granted for each piece of data.

Your platform needs a dedicated **consent management module**. This is more than a checkbox; it must programmatically link every data point to the specific consent under which it was collected. When a request for data arrives, your system must be able to verify that the intended use is permitted.

You must also manage **data provenance**—the complete lineage of your data. This includes tracking:
*   The original source of the data (the data holder).
*   Any transformations applied, such as anonymization or aggregation.
*   The legal basis for its processing and sharing.

Maintaining this chain of custody is essential, especially for data intermediaries. A clear data map is also a prerequisite for conducting a thorough **[Privacy Impact Assessment](https://devisia.pro/blog/privacy-impact-assessment)**, allowing you to identify and mitigate risks proactively.

## How the DGA Works with GDPR and the AI Act

<iframe width="100%" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/dp36WsH6JQQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

No EU regulation exists in isolation. For technical leaders, understanding how the **Data Governance Act (DGA)** intersects with GDPR and the AI Act is crucial for building a coherent compliance architecture. The relationship is complementary, not contradictory.

GDPR's mission is to **protect personal data**. The DGA's mission is to **enable the sharing** of data—both personal and non-personal—within a trusted framework. GDPR sets the rules for what must be protected; the DGA provides the approved mechanisms for sharing data in a way that respects those rules.

> The DGA operationalizes data sharing in a compliant-by-design manner. It creates pathways, like neutral data intermediaries, to facilitate data flows without violating GDPR's core principles of purpose limitation and data minimization.

Any sharing of personal data under the DGA must still have a valid legal basis under GDPR, such as explicit consent from the data subject. This is a critical detail for engineering teams designing consent management systems. You can explore the intricacies of data subject rights in our **deep dive on GDPR's Article 14**.

### Fuelling Compliant AI with the DGA

For organizations building AI systems, the DGA is a strategic asset, not a hurdle. The EU's AI Act places a heavy emphasis on data quality, governance, and traceability, especially for high-risk AI. Poorly sourced, biased, or incomplete datasets are a primary source of AI model failure and risk.

The DGA provides a practical foundation to meet these demanding requirements. By using DGA-compliant data intermediaries and accessing data from trusted altruism organizations, AI developers can:

*   **Ensure High-Quality Inputs:** Gain access to well-documented datasets with clear provenance.
*   **Mitigate Bias:** Diversify training data by sourcing it from multiple, reliable holders through a trusted framework.
*   **Demonstrate Compliance:** Leverage the DGA's built-in transparency and auditing mechanisms to document data origins and usage for AI Act reporting.

In short, the DGA offers a solution to one of the AI Act’s biggest challenges: acquiring high-quality training data in an ethical, legal, and transparent manner.

For more information on upcoming regulatory alignments, you can [reduce compliance burdens by exploring the upcoming shifts in the EU's digital legal framework](https://www.whitecase.com/insight-alert/eu-digital-omnibus-what-changes-lie-ahead-data-act-gdpr-and-ai-act).

## Actionable Next Steps for Product and Engineering Teams

![A CTO leads a 5-step data governance process: audit, policies, vendor vetting, APIs, and monitoring.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/234987d0-83a5-47bb-a08a-a2053f48d912/data-governance-act-governance-steps.jpg)

Translating DGA principles into code and infrastructure requires a pragmatic, phased approach. For product and engineering leaders, this is about evolving platform maturity, not a one-off project. Attempting perfect compliance in a single "big bang" release is unrealistic and prone to failure.

An incremental strategy allows you to address the highest risks first while building the foundational architecture for more advanced governance capabilities over time.

### Phase 1: Discovery and Assessment

You cannot govern what you cannot see. A thorough data audit is the non-negotiable starting point.

*   **Conduct a Data Audit:** Map every data asset your organization holds. For each dataset, document its origin, the purpose for holding it, its storage location, and its access controls. This map becomes your single source of truth.

*   **Review and Update Policies:** Your privacy policy and data processing agreements are not static legal documents. They must accurately reflect how your systems handle data sharing, consent, and purpose limitation under the DGA.

*   **Vet Third-Party Processors:** Scrutinize every vendor that processes your data. Ensure their contracts and technical capabilities align with DGA requirements, particularly if they are involved in any data sharing activities.

### Phase 2: Technical Implementation Roadmap

Once you have a clear picture of your data landscape, you can translate policy into an engineering roadmap. This means treating governance as a core system requirement.

> Viewing compliance solely as a legal problem is a strategic error. The Data Governance Act has direct and unavoidable architectural implications. Your technical roadmap must address governance as a first-class citizen.

This roadmap should focus on building the technical enablers for secure and controlled data exchange:

1.  **Develop a Secure API Strategy:** If you lack one, prioritize the implementation of a secure API gateway. It must support granular access controls (e.g., Attribute-Based Access Control), rate limiting, and comprehensive logging for all data-sharing endpoints.

2.  **Design a Consent Management System:** Architect the tools for both end-users and internal teams to manage consent dynamically. The system must be able to programmatically link specific permissions to specific datasets and enforce those rules at runtime.

3.  **Establish Governance Workflows:** Define and automate the operational playbooks for handling data access requests, conducting audits, and managing the full data lifecycle from creation to secure deletion.

This phased approach breaks down the DGA's abstract requirements into manageable engineering tasks, leading to a more robust, trustworthy, and competitive platform.

## The Data Governance Act: Answering Tough Questions

Even with a clear overview, the DGA raises practical questions for those building software. Here are direct answers to the most common concerns for CTOs and product leaders.

### What's the real difference between the DGA and GDPR?

Think of it this way: **GDPR is about protecting personal data, while the DGA is about creating trusted mechanisms to share data.**

GDPR sets the rules for protecting personal information. The DGA builds on that foundation, creating a legal and technical framework (like data intermediaries) so that data—both personal and non-personal—can be shared in a way that honors GDPR's principles. They are designed to work in tandem.

### Does the Data Governance Act force my company to share its data?

No. The Data Governance Act **does not impose a general obligation on private companies to share their data.**

The framework is voluntary. Its purpose is to encourage data sharing by reducing risk and friction. Obligations only arise if you *choose* to participate in the ecosystem—for example, by operating as a data intermediary or by re-using specific types of public sector data.

### Could my SaaS platform accidentally become a data intermediary?

Yes, and this is a critical risk to assess. If your platform provides a service that enables two or more separate organizations to share data with each other, you might fall under the DGA's definition of a **data intermediation service provider**.

> For example, if you build a "data marketplace" feature that connects different companies to exchange datasets, you are almost certainly acting as an intermediary. This would subject you to the DGA's strict neutrality rules, prohibiting you from using that data for your own commercial benefit and requiring you to register with national authorities. A superficial approach here is a major compliance blind spot.

### Is the DGA only about non-personal data?

No, the DGA covers both **personal and non-personal data**, but it applies different rules. For non-personal data (e.g., aggregated industrial sensor data), the goal is to unlock its economic value. For personal data, it introduces additional safeguards to ensure any sharing is fully compliant with GDPR, typically by using a neutral data intermediary to manage consent and purpose limitation.

---

At **Devisia**, we believe compliance with regulations like the Data Governance Act isn't a legal checkbox—it's an architectural choice. We build reliable digital products and AI-enabled systems with governance and privacy designed in from day one. To see how our pragmatic approach can turn your vision into maintainable, compliant software, visit us at [https://www.devisia.pro](https://www.devisia.pro).