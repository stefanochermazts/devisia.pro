---
title: "A Pragmatic Guide to the Digital Market Act for Technology Leaders"
description: "A pragmatic guide for CTOs and founders on the Digital Market Act. Understand its technical implications, compliance risks, and strategic opportunities."
pubDate: 2026-03-19T10:11:46.217Z
heroImage: "https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/5e8c34c9-c250-49c6-8432-595bf8d5838d/digital-market-act-guide.jpg"
author: "Devisia AI"
tags: ["digital market act", "EU regulation", "tech compliance", "B2B software", "API economy"]
translationSlug: "digital-market-act"
autoTranslateToIt: true
---
The **Digital Market Act (DMA)** is not just another EU regulation; it is a structural redesign of the digital economy's core rules, engineered to create fairer, more open markets.

For years, a handful of large technology companies have controlled the essential gateways to the digital world—app stores, search engines, and operating systems. The market power of these "gatekeepers" enabled them to create closed ecosystems, often imposing restrictive terms on smaller businesses and limiting their access to core platform functions. This dynamic stifled competition and reduced consumer choice.

The DMA introduces a fundamental shift. Instead of retroactively penalizing anti-competitive behavior, it establishes proactive rules—a clear set of **‘dos and don’ts’**—that designated gatekeepers must follow. This regulation is a deliberate move away from siloed "walled gardens" toward a more interoperable and competitive system.

> For a technical leader, the DMA is not a compliance checkbox. It is a strategic inflection point that redefines the rules of digital engagement, creating new architectural requirements and significant opportunities for businesses prepared to adapt.

This regulation forces gatekeepers to open their services, creating a more level playing field. This will impact product roadmaps, data strategies, and core system architecture. The DMA works in conjunction with other frameworks, like the [Data Governance Act](https://devisia.pro/en/blog/data-governance-act), which complements its focus on market fairness with new rules for data sharing and intermediation.

### What This Means For Your Business

The problem the DMA solves—market concentration—creates opportunities for everyone else. For founders, CTOs, and product leaders at non-gatekeeper companies, the DMA is a strategic opening, not a compliance burden. It creates new possibilities for businesses that can leverage:

*   **Fair Competition:** The DMA prohibits self-preferencing. Gatekeepers can no longer give their own products and services preferential treatment in rankings over competitors.
*   **Interoperability:** New obligations require gatekeepers to allow third-party services to integrate with their core platforms, unlocking significant potential for new SaaS and AI-driven products that were previously technically or commercially unfeasible.
*   **Privacy by Design:** The DMA complements GDPR, reinforcing the imperative to build systems with robust privacy principles from the ground up. In this new landscape, trust becomes a critical competitive differentiator.

In short, the Digital Market Act is reshaping the environment in which software is built, distributed, and scaled. For any B2B technology company building for the European market, understanding its architectural and strategic implications is essential for growth.

## How The EU Defines A Gatekeeper Platform

The Digital Markets Act avoids vague, academic definitions of market power. Instead, it uses clear, quantitative thresholds to identify "gatekeepers." This pragmatic, numbers-driven approach provides critical clarity for the technology industry.

The European Commission uses a two-part test to determine if a company operates a **core platform service (CPS)** with an "entrenched and durable position." This is not a subjective judgment but a calculation based on specific metrics. Understanding these thresholds is key to knowing which companies are subject to the DMA's obligations.

### The Quantitative Thresholds For Designation

A company must have a significant economic footprint and a large, established user base in the EU to be considered a potential gatekeeper.

A provider of a **core platform service** is presumed to be a gatekeeper if it meets these two conditions:
*   An annual EU-wide turnover of at least **€7.5 billion** in the last three financial years OR a global market capitalization of at least **€75 billion** in the last financial year.
*   At least **45 million monthly active EU end-users** and **10,000 yearly active EU business users** in the last financial year.

To confirm an "entrenched" position, a company must have met these user-base numbers for the last three consecutive years. This precise methodology led the European Commission to designate its initial set of gatekeepers—including Alphabet, Amazon, Apple, and Meta—who are now bound by the DMA's rules. You can review the official [methodology for DMA gatekeeper designation](https://www.europarl.europa.eu/RegData/etudes/ATAG/2022/739226/EPRS-AaG-739226-DMA-Application-timeline-FINAL.pdf) on the European Parliament's site.

This clear-cut process means your business falls into one of two categories, as this decision tree illustrates.

![A DMA Impact Decision Tree flowchart showing that if you are a Gatekeeper, it leads to Compliance; if not, it's an Opportunity.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/2f91f1ad-13ee-4a13-9a46-9a30a6be46f8/digital-market-act-decision-tree.jpg)

For most companies, the DMA is not about direct compliance. It's about strategic opportunity.

### Core Platform Services Under Scrutiny

The DMA targets ten specific **core platform services (CPS)** where gatekeepers have historically concentrated market power, setting the terms for all other participants.

The list of CPS includes:
*   **Online intermediation services:** e.g., marketplaces and app stores.
*   **Online search engines.**
*   **Social networking services.**
*   **Video-sharing platform services.**
*   **Number-independent interpersonal communication services:** e.g., messaging apps.
*   **Operating systems.**
*   **Web browsers.**
*   **Virtual assistants.**
*   **Cloud computing services.**
*   **Online advertising services** controlled by the platform owner.

> If your business relies on, integrates with, or competes within any of these domains, the gatekeeper's new obligations will directly impact your product strategy, architecture, and market access.

For instance, a company designated as a gatekeeper for its operating system (e.g., Apple with iOS) and app store must now allow competing app stores and alternative payment systems. This creates a direct opening for developers who were previously locked into the platform’s exclusive terms, fostering a more dynamic and competitive software market.

## Technical And Architectural Implications For Your Software

For a CTO or Head of Engineering, the Digital Market Act is not a legal abstraction; it is a set of engineering challenges that impact your codebase, APIs, and system architecture. The DMA's rules on interoperability, data portability, and fair access are, in effect, software design specifications.

A superficial, "check-the-box" implementation will result in brittle, insecure systems. The risk of a naive approach—such as exposing internal database schemas via a public API—is a significant security vulnerability and a source of long-term technical debt. A thoughtful, architectural approach, however, can transform these regulatory requirements into a competitive advantage.

The core problem is re-architecting systems once designed as closed fortresses to communicate securely and reliably with the outside world.

![A diagram illustrates an API Gateway connecting API, Auth, and Maecity services to a Third Party App, emphasizing data portability.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/42487e08-ad46-4a50-83f9-387fee2360e6/digital-market-act-api-diagram.jpg)

### Designing For Interoperability And Data Portability

At the technical heart of the DMA is the requirement for well-designed APIs. Gatekeepers must expose interfaces that allow third-party services to connect with their platforms and enable users to port their data. This is more than just opening a few endpoints; it demands a robust API strategy.

*   **Clean API Design:** APIs must be clear, stable, and meticulously documented. Adopting standards like OpenAPI is no longer a best practice but a necessity for providing predictable, machine-readable specifications. A solid versioning strategy is also critical to manage changes without breaking third-party integrations.
*   **Secure Authentication and Authorization:** Opening up systems mandates a zero-trust security model. Protocols like **OAuth 2.0** and **OpenID Connect** are non-negotiable for managing granular, consent-based access. You must be able to guarantee that a third-party application can only access the specific data a user has explicitly approved.
*   **Performance and Scale:** Mandated APIs will face unpredictable traffic loads. The architecture must handle this demand without degrading core service performance. This requires implementing effective rate limiting, caching strategies, and potentially dedicated infrastructure for API traffic. Our analysis of [on-premises vs cloud deployment models](https://devisia.pro/en/blog/on-premises-vs-cloud) offers relevant context for these scaling decisions.

### Embracing Service Unbundling With Microservices

The DMA's prohibition on "tying" or "bundling" services is another major technical driver. Gatekeepers can no longer force users of one service to adopt another—for example, requiring a specific browser to be tied to the operating system.

This requirement effectively renders monolithic architectures obsolete. A system where the browser, OS, and app store are deeply entangled cannot comply with the unbundling mandate.

> The Digital Market Act mandates an architectural shift toward modularity. Systems must be composed of independent, loosely coupled services that can be enabled, disabled, or replaced without breaking the entire product.

This is where an architectural pattern like **microservices** moves from a "good idea" to a practical necessity for compliance and flexibility. Breaking a large application into a collection of smaller, independent services provides the modularity the DMA demands.

*   **A Real-World Scenario:** Consider a gatekeeper's social platform where messaging is deeply integrated into the main application. Under the DMA, these must be separable. In a microservices architecture, messaging would be a distinct service with its own API. This service could then, as required by the regulation, interoperate with third-party messaging apps.

This architectural choice comes with trade-offs. While you gain flexibility and resilience, you also introduce the complexities of service discovery, inter-service communication, and managing distributed data. This is a deliberate architectural decision: trading operational complexity for regulatory compliance and strategic agility.

## Understanding DMA Enforcement And Timelines

The Digital Market Act is not a theoretical framework; it is an active regulatory instrument with a clear implementation schedule and significant financial penalties for non-compliance. For technology leaders, this timeline is a map of business risk and strategic priorities.

The regulation officially entered into force in late 2022, with its key provisions applying from May 2023. This initiated a formal process for potential gatekeepers to self-assess against the DMA’s criteria and notify the European Commission. This process has already resulted in official designations, compliance reports, and enforcement actions.

### From Deadlines To Real-World Penalties

The transition from legal text to market impact has been rapid. Once designated, gatekeepers were given a strict six-month window to bring their core platform services into full compliance with the DMA's list of "do's and don'ts."

The European Commission has made it clear that it will use its full authority to enforce these rules. The penalties for non-compliance are not minor fines; they are substantial, designed to compel behavioral change. These are not hypothetical risks but documented events.

*   **Fines for Non-Compliance:** The DMA allows for fines of up to **10% of a company’s total worldwide annual turnover**, and up to 20% for repeated infringements.
*   **Structural Remedies:** In cases of systematic non-compliance, the Commission can impose structural remedies, such as forcing a company to sell off parts of its business.

A prominent example is the investigation into Apple's "anti-steering" rules, which prevent app developers from directing users to cheaper subscription options outside the App Store. Such investigations demonstrate that the DMA is a powerful regulatory tool with tangible consequences, as detailed in analyses of [what Europe's Digital Markets Act has delivered](https://techpolicy.press/what-europes-digital-markets-act-has-delivered-so-far-and-what-comes-next).

### Key DMA Implementation Milestones

The DMA's phased rollout makes its impact tangible. Each milestone represented a point where obligations became active and the risk of non-compliance became real.

Here’s a simplified timeline of the DMA's implementation.

| Date              | Milestone                         | Significance For Tech Companies                                                      |
| :---------------- | :-------------------------------- | :----------------------------------------------------------------------------------- |
| **November 2022** | DMA Enters into Force             | The official start, beginning the countdown for all subsequent deadlines.           |
| **May 2023**      | DMA Provisions Apply              | Key obligations became active, and the formal process for designating gatekeepers began.   |
| **July 2023**     | Notification Deadline             | Companies meeting gatekeeper thresholds were required to notify the Commission. |
| **September 2023**| First Gatekeeper Designations     | The first group of companies was officially designated, starting their compliance clock. |
| **March 2024**    | Initial Compliance Deadline       | Designated gatekeepers had to be in full compliance with all their DMA obligations.  |
| **Ongoing**       | Enforcement and Investigations    | The European Commission actively monitors compliance, launches investigations, and issues penalties. |

This timeline confirms that the DMA is not a future concern. Its mechanics are already in motion, actively reshaping digital markets. For founders and product leaders at non-gatekeeper firms, each enforcement action is a market signal validating the new, more level playing field. It is a green light for innovators to compete on merit.

## Capitalizing on Opportunities in the New Digital Market

For most companies, the Digital Markets Act is not about compliance—it is about opportunity. While designated gatekeepers re-architect their platforms to meet new obligations, other firms can strategically capture the value being unlocked.

The DMA's mandates on interoperability and data portability are systematically dismantling the "walled gardens" that have historically limited the growth of smaller SaaS and AI companies. Previously, a product's potential was often capped by the restrictive terms of a dominant platform. Now, a more open and competitive field is emerging.

This shift levels the playing field, enabling startups and SMEs to build products that were once technically or commercially unfeasible. The focus is shifting away from navigating gatekeeper restrictions and toward delivering superior user value.

![Diagram showing an open gate of opportunity leading to SaaS applications and AI for improved interoperability.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/7c8fc812-74ca-48ff-8326-a2286276f953/digital-market-act-digital-transformation.jpg)

### Building On Newly Opened APIs and Fairer Rules

The most immediate opportunities arise directly from the DMA's core requirements. Mandated API access and fairer app store policies are reducing friction for developers and creating new integration possibilities.

*   **SaaS Integrations:** Imagine building a specialized B2B collaboration tool. Previously, deep integration with a gatekeeper's core messaging or OS services was difficult or impossible. The DMA now requires gatekeepers to provide APIs for such interoperability, allowing you to build more seamless user experiences.
*   **Custom Application Development:** With greater, consent-based access to user data, you can build more personalized applications. A new fitness app, for instance, could (with user permission) port an individual's entire health history from a gatekeeper’s ecosystem, providing immediate value and removing the friction of a cold start.
*   **Accelerated Time-to-Market:** Fairer app store rules, such as allowing alternative payment systems, can significantly reduce operational costs and simplify go-to-market strategies. This allows you to focus engineering resources on core product development instead of wrestling with restrictive payment gateways.

This is not a future state. The regulatory framework officially entered into force on **1st November 2022**. By **2nd May 2023**, most provisions were active, initiating the designation process for 'gatekeepers'. Companies meeting the thresholds, such as an annual EU turnover of **€7.5 billion**, had to notify the European Commission. You can see a breakdown in the official [timeline and process of the DMA](https://actonline.org/wp-content/uploads/DMA-Timeline85-Final-.pdf).

### Unlocking New AI Workflows

The DMA is a significant catalyst for AI innovation. By breaking down data silos and combating platform lock-in, it creates fertile ground for specialized AI solutions to compete on merit.

> The Digital Markets Act encourages a shift from single-vendor AI ecosystems toward a diverse marketplace. This enables businesses to construct 'best-of-breed' AI workflows, combining different models and services without being locked into one gatekeeper's stack.

Consider an AI-powered logistics platform. Before the DMA, you might have been locked into a single gatekeeper’s ecosystem for maps, cloud hosting, and AI services. Now, you can architect a more robust and efficient solution:
*   Use a specialized, third-party routing algorithm for superior delivery optimization.
*   Integrate with multiple communication platforms to send driver updates.
*   Leverage powerful open-source language models for customer service chatbots and run them on your preferred infrastructure.

This modular approach not only improves performance but also enhances system resilience and cost-effectiveness. By architecting with a privacy-first mindset, you also build trust, which aligns with the principles discussed in our guide to [building a first-party data strategy](https://devisia.pro/en/blog/first-party-data). For product leaders, the objective is clear: use these new openings to build more scalable, maintainable, and competitive digital products.

## Conclusion: Building Your Business For A Post-DMA World

The Digital Market Act is not just a compliance exercise; it is a fundamental restructuring of the digital economy. For years, the market has been defined by closed ecosystems. The DMA is systematically dismantling those walls, pushing the industry toward a more open, interoperable model. For most B2B technology leaders, this is not a threat but a direct invitation to build differently.

The new rules force gatekeepers to unbundle services, enable data portability, and allow third-party systems to connect. While the giants are occupied with complex compliance projects, smaller, more agile companies have a clear window of opportunity to build products that were previously unviable. The legislation validates a new competitive landscape where product quality matters more than platform allegiance.

### A Mindset For The New Market

To succeed in this new reality, a forward-looking product and engineering mindset is essential. A durable strategy is grounded in principles aligned with where the market is headed.

We see three pillars for success:

*   **Privacy by Design:** The DMA works in tandem with GDPR. Architecting for privacy from day one is a core competitive advantage that builds user trust.
*   **Long-Term Maintainability:** The rules will evolve. Architecting for modularity, scalability, and adaptation ensures your systems can absorb future changes without a costly rebuild.
*   **Incremental, Value-Driven Delivery:** Focus on shipping measurable business value quickly. This approach lets you test ideas and pivot based on real traction in these newly opened market segments.

> The Digital Markets Act is a starting point, not an endpoint. It rewards businesses that prioritize reliability, user trust, and sustainable architecture over short-term growth hacks. Long-term success will come from building excellent products, not from navigating regulatory loopholes.

Ultimately, the most pragmatic path forward is to build with purpose. The new rules favor companies that create reliable, secure, and user-focused software. For founders and product leaders, this means directing engineering efforts toward what matters: solving real problems and delivering exceptional value.

Navigating these technical and strategic shifts requires deep expertise. A technical partner like **Devisia** can provide the architectural clarity and hands-on support needed to build robust, scalable systems that are ready for what comes next. The opportunity is here—for those prepared to build for it.

## Frequently Asked Questions About The DMA

Here, we address practical questions that CTOs, product leaders, and founders have about the DMA's real-world impact on their strategy and technology stack.

### Does The Digital Market Act Apply To My B2B SaaS Startup?

Directly, the DMA’s obligations target only designated "gatekeepers." However, the indirect effects are far-reaching. If your SaaS product competes with, integrates into, or is sold through a gatekeeper’s platform—like an app store or an OS—the DMA creates new opportunities for you.

You may gain fairer access, better commercial terms, and the freedom to offer alternative payment systems. Your users may also gain true data portability. The key is to map where your business model intersects with gatekeeper services and strategize how to turn these new rules into a competitive advantage.

### What Is The Most Significant Technical Change Required By The DMA?

Architecturally, the mandates for **interoperability and data portability** are the most profound. For gatekeepers, this means re-architecting away from closed, proprietary ecosystems toward building robust, secure, and well-documented APIs for third-party services.

For other businesses, the challenge is preparing your systems to connect with these new APIs. This is not a minor tweak; it requires careful architectural planning to manage data synchronization, security, and scalability. We are moving toward a more interconnected, API-first digital economy.

### How do the DMA and GDPR interact?

> The DMA and GDPR are complementary, not interchangeable. GDPR is about protecting personal data and individual privacy rights. The DMA is about economic fairness and open competition in digital markets.

You cannot use DMA compliance as an excuse for GDPR non-compliance. For example, when a gatekeeper provides data access under the DMA, it must still do so in a GDPR-compliant manner, with a valid legal basis and respect for user consent. Your systems must be engineered to satisfy both sets of requirements simultaneously.

### Will The DMA Make It Easier To Build AI Applications?

Yes, in several important ways. The DMA is poised to break down the walls of single-provider AI ecosystems, fostering a more diverse and competitive market.

*   **Fairer Access:** Gaining better access to core platform services and hardware features—like NFC chips—could unlock new categories of AI-driven applications that were previously impossible to build.
*   **Data Portability:** When users can easily move their data to a new, innovative AI service, it fuels competition. This gives smaller, specialized players a real chance to gain traction with superior models.
*   **No Self-Preferencing:** By prohibiting gatekeepers from unfairly promoting their own services, the DMA ensures that smaller AI solutions can compete on merit, not on platform politics.

These factors combine to create a more open playing field where the best AI solution can win, rather than the one most deeply embedded in a closed platform.

---
Navigating these changes requires a partner who understands both the technical architecture and the strategic implications. **Devisia** helps businesses build reliable, scalable, and maintainable digital products designed to thrive in this new, more open market. Learn more at [https://www.devisia.pro](https://www.devisia.pro).