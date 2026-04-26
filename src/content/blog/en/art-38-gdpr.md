---
title: "Art 38 GDPR A Guide for Tech Leaders and Founders"
description: "A pragmatic guide to Art 38 GDPR. Understand DPO autonomy, resource needs, and conflict of interest rules for SaaS, startups, and AI-driven enterprises."
pubDate: 2026-04-16T09:11:21.248Z
heroImage: "https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/ede36dac-d40d-4cbd-9d4a-4a487e5adc66/art-38-gdpr-doodle-guide.jpg"
author: "Devisia AI"
tags: ["art 38 gdpr", "dpo compliance", "gdpr for tech", "data protection officer", "privacy governance"]
translationSlug: "art-38-gdpr"
autoTranslateToIt: true
---
Your sales team is close to signing a large customer. Security review is moving well. Then legal sends a short question that stops everything: who is your DPO, and how do you ensure independence under **art 38 gdpr**?

The answer often sounds fine at first. The CTO is acting as DPO. Or the head of security. Or a founder who “knows the systems best”. In a small SaaS company, that can feel efficient. In practice, it’s often the moment where a buyer, auditor, or regulator sees structural weakness.

Article 38 matters because it tests whether your organisation treats privacy oversight as real governance or as an extra label attached to an already busy operator. For software companies, that distinction shows up everywhere: sprint planning, vendor reviews, model evaluation, incident handling, retention rules, access design, and DPIAs for new features.

The problem gets sharper in AI-enabled environments. Teams move quickly, data flows multiply, and one person may approve architectures, choose processors, define logging, and then be asked to independently assess those same decisions. That isn’t a paperwork issue. It’s an organisational design flaw.

A weak Article 38 setup creates three kinds of debt:

- **Commercial debt** because enterprise buyers will question your governance.
- **Operational debt** because privacy review arrives late, after architecture hardens.
- **Regulatory debt** because your DPO may lack independence, access, or resources.

A sound setup does the opposite. It gives leadership a route for honest escalation, forces earlier design review, and makes privacy by design more than a slogan.

## The Article 38 Problem for Growing Tech Companies

A familiar pattern shows up in growing software companies.

The product is expanding. A few enterprise customers are live. The team has added SSO, audit logs, and region-specific hosting. Now procurement asks for your DPO details, reporting line, and evidence that the DPO isn’t marking their own homework.

That’s usually where internal assumptions start to break.

### When the obvious DPO choice isn’t actually workable

In a startup, the most knowledgeable person about data flows is often also the person making processing decisions. That may be the CTO who chooses analytics tooling, approves database retention, signs off on AI integrations, and decides what lands in logs.

That person may understand risk very well. But Article 38 isn’t asking only whether they are competent. It’s asking whether they can act independently when reviewing the consequences of their own decisions.

A common failure mode looks like this:

- **Engineering owns architecture** and decides what personal data enters the platform.
- **Security owns controls** and decides how events are logged and retained.
- **Product owns feature priorities** and decides whether high-risk processing ships now or later.
- **The same person is called the DPO** and is then expected to independently advise, challenge, and escalate.

That arrangement may survive internally for months. It often fails the moment an external party asks harder questions.

> **Practical rule:** If someone determines the purposes or means of processing, treat a DPO appointment for that same person as high risk.

### Why this hits tech teams harder

Software companies don’t process data in one place. They process it across admin panels, background jobs, telemetry pipelines, support tools, cloud storage, vendor APIs, and increasingly AI components such as embeddings, classifiers, and agent workflows.

That means Article 38 becomes architectural. The DPO must be involved early enough to influence design, not just review policies after launch.

The founders who struggle most with this usually aren’t careless. They’re trying to stay lean. They don’t want extra hierarchy. They want one capable person to cover multiple roles.

That works for many operational tasks. It doesn’t work well for independent oversight.

### Structural shortcuts become long-term risk

The expensive mistake isn’t appointing the wrong title. It’s building delivery, governance, and reporting structures around the assumption that privacy oversight can sit inside the same chain of command as product and engineering decisions.

Once that happens, every later fix gets harder. You’re not just changing a role. You’re changing meeting flows, escalation paths, access rights, and board visibility.

## Decoding the Legal Text of Article 38 GDPR

Article 38 has been effective since **May 25, 2018** and establishes the **position and independence** of the DPO. In software and IT-heavy organisations, it has become a practical governance checkpoint, not just a legal citation. According to [ISMS.online’s summary of Article 38 compliance](https://www.isms.online/general-data-protection-regulation-gdpr/gdpr-article-38-compliance/), **72% of EU IT companies** had appointed DPOs by **2023**, up from **45% in 2019**. The same source notes **over 1,200** GDPR notifications related to DPO roles in Germany in **2023** and **over 1,500** DPO-related audits reported by Italy’s Garante in **2022**.

![A diagram outlining the legal framework for the Data Protection Officer under Article 38 of the GDPR.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/eb816efd-153c-4c0d-8bfb-1586531ab42c/art-38-gdpr-data-protection-officer.jpg)

### Involved properly and in a timely manner

Article 38(1) says the organisation must involve the DPO, properly and in a timely manner, in all issues relating to personal data protection.

For a tech company, that means the DPO can’t be brought in only when a policy needs approval. The DPO needs visibility before key decisions harden.

In practice, “timely” usually means involvement in moments like these:

- **Discovery and scoping** when a team defines what data a feature needs
- **Vendor selection** when procurement is considering processors or AI providers
- **DPIA triggers** when a new workflow creates increased risk
- **Change review** when retention, access, or data-sharing patterns change
- **Incident response** when a possible breach needs early legal and technical assessment

If your DPO sees a feature after release notes are drafted, that isn’t timely.

### Necessary resources

Article 38(2) requires the organisation to support the DPO with resources necessary to perform the tasks under Article 39.

For engineers, “resources” should be read broadly. It includes budget, time, access, training, and working interfaces into the business. A DPO who can’t inspect systems, question teams, or maintain current knowledge is nominally appointed but functionally disabled.

This clause matters in modern stacks because personal data is often spread across:

- customer-facing applications
- internal admin tools
- analytics and observability platforms
- data exports
- support workflows
- AI services and prompt pipelines

Without access to those processing operations, a DPO can’t really advise or monitor.

### No instructions, no penalties, direct line to top management

Article 38(3) is the centre of gravity. The DPO must not receive instructions regarding the exercise of their tasks, must not be dismissed or penalised for performing them, and must report directly to the highest management level.

That legal wording translates into a simple operating principle. The DPO must be able to say “stop”, “redesign”, or “escalate” without needing permission from the people whose work is being examined.

A weak implementation sounds like this: the DPO sits under legal, security, or engineering and can only raise concerns through a department head. A stronger one gives the DPO a direct route to the CEO, board, or equivalent leadership body.

> The DPO isn’t there to own compliance delivery. The DPO is there to provide independent oversight and advice while the organisation remains accountable.

### Direct contact with data subjects

Article 38(4) says data subjects must be able to contact the DPO on all issues relating to processing and the exercise of their rights.

That has practical implications for software teams. Contact pathways must be easy to find, routed reliably, and backed by internal handling workflows. A buried mailbox that no one monitors isn’t enough.

You need a process for:

- intake
- verification
- triage
- technical fulfilment
- legal review where needed
- closure with an audit trail

### Secrecy and confidentiality

Article 38(5) binds the DPO to secrecy or confidentiality where applicable.

This is often missed in implementation. The DPO must be trusted with sensitive information, including internal failures, complaints, incident facts, and disagreements about risk. If teams think the role is performative or politically unsafe, they’ll avoid candour and Article 38 will fail in practice even if the org chart looks tidy.

### Other tasks are allowed, but conflicts are not

Article 38(6) allows the DPO to hold other duties, but only where those duties don’t create a conflict of interests.

That is where many startups get into trouble. The law allows overlap. It doesn’t allow self-supervision.

## Core Organisational Obligations Under Article 38

Article 38 isn’t a job description for one person. It creates obligations for the company. If those obligations aren’t reflected in governance, access control, and reporting patterns, the appointment won’t hold up well under customer scrutiny or regulatory review.

![A hand-drawn style diagram showing OBLIGATIONS at the center connected to ADVISE, REPORT, and FACILITATE boxes.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/f6743dd9-56ac-45b0-96a3-900702a44987/art-38-gdpr-obligations-diagram.jpg)

### Ensure real autonomy

A DPO can’t be managed like a normal delivery function.

If the DPO needs approval from a product leader before raising a concern, autonomy is already compromised. If performance review criteria penalise the DPO for slowing releases, the organisation has created pressure against independent judgement.

Practical signs of autonomy include:

- **Independent escalation** to the highest management level
- **Freedom to prioritise reviews** based on risk rather than release pressure
- **Documented dissent** when the business proceeds against DPO advice
- **Role design** that avoids operational ownership of the processing being reviewed

This is one place where paper compliance fails quickly. Companies often write “the DPO acts independently” in policy, then place the role inside a delivery chain where independence isn’t credible.

### Give the DPO direct management access

Direct reporting isn’t ceremonial. It changes response speed and decision quality.

According to [Clarip’s Article 38 summary](https://www.clarip.com/data-privacy/gdpr-article-38/), Article 38(3) requires the DPO to report directly to the highest management level, and **2024** statistics from Ireland’s Data Protection Commission showed **50% faster** DPIA resolutions in IT organisations where the DPO was suitably authorized, with an average of **45 days versus 90**.

That’s easy to understand operationally. If privacy concerns travel through multiple management layers, context gets diluted and decisions slow down.

A practical reporting line should include:

| Organisational need | What works | What usually fails |
|---|---|---|
| Escalation | Direct access to CEO, board, or equivalent leadership | Routing concerns through mid-level functional managers |
| Decision visibility | Privacy risk included in executive review packs | Privacy issues buried in legal or security backlogs |
| Follow-up | Clear ownership of remediation actions | Verbal acknowledgement with no tracked decisions |

A useful companion concept is the broader [means of compliance approach](https://devisia.pro/blog/means-of-compliance), where legal requirements are translated into specific operational controls rather than broad promises.

### Provide access to processing operations

This obligation is often misunderstood as “give the DPO policies and a list of systems”.

That’s not enough.

The DPO needs enough access to understand how data moves. In technical environments, that usually means access to architecture diagrams, data flow maps, processor lists, DPIAs, incident records, retention settings, and relevant product change logs. It may also include read access to selected dashboards or audit outputs, depending on internal controls.

For a SaaS or AI-enabled business, access questions often include:

- What personal data enters prompts or embeddings?
- Which vendors receive telemetry or support data?
- Where are admin actions logged?
- How long are exports retained?
- Which teams can query production data?
- How are data subject requests fulfilled across services?

If the answers exist only in engineers’ heads, the DPO is operating blind.

### Don’t punish the role for doing the job

This part of Article 38 is blunt for a reason. A DPO must not be dismissed or penalised for performing DPO tasks.

Most companies won’t state a penalty openly. The pressure is subtler.

It appears when leaders say the DPO is “not commercial enough”, “too negative”, or “slowing product momentum” because they raised legitimate objections. It also appears when the DPO is excluded from meetings after escalating uncomfortable issues.

> **Management test:** If your DPO can raise an inconvenient risk without career cost, your structure is closer to Article 38. If they can’t, it isn’t.

### Make involvement systematic, not ad hoc

Strong organisations don’t depend on someone remembering to call the DPO.

They create triggers. New vendor intake triggers review. High-risk features trigger DPIA assessment. Incident workflows trigger legal and privacy escalation. Procurement checklists trigger processor review. Such scenarios benefit from engineering discipline. You can encode governance into process gates and templates instead of relying on memory and goodwill.

## Navigating the DPO Conflict of Interest Dilemma

The hardest part of **art 38 gdpr** for startups isn’t understanding the words. It’s accepting what those words rule out.

Most small companies want one smart, trusted operator to cover several functions. That instinct is rational. Headcount is limited, and the people closest to systems usually understand data risk best.

The problem is that Article 38(6) doesn’t ask who understands the systems. It asks whether the same person can independently oversee processing without supervising their own decisions.

![A line drawing of a Data Protection Officer standing between company interests and data privacy concepts.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/a3a843c0-d21f-4146-82bc-f0011b6a2bb9/art-38-gdpr-dpo-role.jpg)

### The roles that usually create trouble

Conflict of interest usually appears where a role determines the purposes or means of processing.

That often includes functions such as:

- **CTO or Head of Engineering** if they decide architecture, tooling, retention, or system design
- **CISO or security lead** if they control monitoring, logging, access governance, or incident tooling
- **Head of Product** if they decide why data is collected and which features require new processing
- **Founder or managing director** if they hold final authority over commercial and operational choices
- **Head of HR or marketing** where those teams directly shape major processing decisions in their own domains

The issue isn’t title alone. It’s decision power.

A technically capable CTO may still be conflicted if they choose the AI provider, define what user content enters prompts, and approve how model outputs are stored. Asking that same person to act as DPO means asking them to independently review the governance of their own implementation choices.

### Why startups keep getting this wrong

Because some overlap is legally allowed, teams assume broad overlap is safe.

It often isn’t. Regulators are actively looking at this area. According to [the commentary on Article 38](https://komentarzrodo.pl/en/home/chapter-iv/section-4/art-38/commentary-to-art-38), recent reports from Italy’s Garante Privacy for **2024-2025** show that **62%** of fines issued to SMEs, totalling **over €500k**, were linked to DPO conflicts of interest discovered during processing audits.

That’s a warning for small software firms in particular. Lean staffing doesn’t excuse self-supervision.

For a related look at when a DPO is required in the first place, the practical overview at https://devisia.pro/blog/gdpr-art-37 is useful alongside Article 38.

### A workable conflict test

Ask these questions about the proposed DPO:

1. **Do they decide why personal data is processed?**  
   If yes, risk is high.

2. **Do they decide how personal data is processed?**  
   If yes, risk is also high.

3. **Can they review a risky feature they approved without organisational pressure?**  
   If no, independence is weak even if the title looks acceptable.

4. **Could they escalate concerns against their own department’s goals?**  
   If that feels unrealistic, the design is probably wrong.

5. **Is there a written mechanism for ongoing conflict review?**  
   Static role descriptions don’t help much when responsibilities shift every quarter.

### AI projects expose conflicts faster

Traditional SaaS already creates overlap risk. AI initiatives intensify it.

One person may be driving vendor selection, prompt design, guardrails, evaluation criteria, human review thresholds, and retention choices for prompts and outputs. If that same person is the DPO, they may end up assessing whether their own architecture creates excessive risk.

That’s one reason generic legal summaries aren’t enough for tech teams. The conflict isn’t abstract. It appears in backlog decisions and system boundaries.

A useful way to brief leadership is to separate three functions:

- **System owner** who chooses architecture and vendors
- **Control owner** who implements safeguards and workflows
- **Independent DPO** who advises, monitors, and escalates

Where one person holds all three, Article 38 risk rises quickly.

This short explainer is worth watching before redesigning the role in a smaller organisation:

<iframe width="100%" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/b9rxiB8dtT0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### What works better than wishful thinking

In small teams, perfect separation may be unrealistic. But careless overlap is still a bad choice.

Better approaches include:

- **External DPO appointment** where internal leaders retain operational ownership
- **Hybrid model** where an external DPO is supported by an internal privacy coordinator
- **Formal conflict register** reviewed whenever responsibilities change
- **Decision logs** showing where DPO advice differed from management decisions
- **Board-level acknowledgement** that the DPO may challenge release or design choices

> Don’t ask whether your proposed DPO is trustworthy. Ask whether the role design asks them to judge their own processing decisions.

## Budgeting for and Defining Sufficient DPO Resources

Resource support under Article 38(2) is where many organisations underperform because the legal text sounds vague. “Necessary resources” can be interpreted too narrowly, usually as “we appointed someone and gave them an email address”.

That isn’t enough for a company running live products, third-party integrations, and AI workflows.

### What regulators are signalling

Resource allocation is no longer a secondary issue. According to [gdpr-text.com’s Article 38 summary](https://gdpr-text.com/read/article-38/), in Poland **45%** of IT sector fines issued in the **12 months leading up to April 2026**, totalling **€2.1M**, were linked to insufficient DPO resourcing, particularly in companies deploying high-risk AI workflows. The same source states that a **2025 ENISA study** of EU IT startups found **70%** allocate less than **5%** of their compliance budget to DPO upkeep, correlating with a **30% higher** rate of data protection violations compared with properly resourced peers.

The practical message is clear. Under-resourcing the role is treated as a governance failure, not an administrative oversight.

### Four resource categories that matter

A useful budget discussion starts by separating the resource problem into four parts.

#### Financial budget

The DPO needs funds for external legal advice where specialist interpretation is needed, continuing education, and sometimes independent support for complex assessments.

Without a budget line, every request becomes a negotiation. That delays action and weakens the role.

#### Tooling and system visibility

A DPO doesn’t need unrestricted access to everything. They do need enough tooling to understand processing realities.

That usually includes some combination of:

- **Record keeping tools** for processing activities, vendors, and transfers
- **DPIA workflows** with evidence trails
- **Incident tracking** linked to breach assessment processes
- **Document management** for policies, guidance, and decisions
- **Access to architecture artefacts** such as data flow diagrams and service maps

This is also why the distinction between DPO and operational privacy manager matters. A DPO may oversee and advise, while another role coordinates execution. A useful comparison sits at https://devisia.pro/blog/data-protection-manager.

#### Time allocation

In this regard, many internal appointments often fail.

If the DPO role is added to someone who already leads security operations, architecture reviews, procurement, and incident handling, privacy oversight will be squeezed into spare capacity. Spare capacity is not a compliance model.

The time question should be tied to complexity. A company with one product and limited processor use needs less than a business operating across multiple jurisdictions, customer environments, and AI-assisted workflows.

#### Organisational access

The DPO must be able to reach the people who know what is happening.

That means access to:

- roadmap discussions where new processing begins
- procurement and vendor reviews
- security and incident channels
- legal and customer escalation loops
- leadership meetings where risk acceptance is decided

### What under-budgeting looks like in practice

Under-budgeting rarely appears as one dramatic failure. It shows up as friction:

- DPIAs are postponed because nobody owns the workflow.
- The DPO can’t assess a vendor because procurement didn’t involve them.
- Engineering ships logging changes without privacy review.
- AI features move to production before anyone examines prompt retention or output handling.
- Data subject requests bounce between support, product, and legal.

Those are resource problems disguised as process problems.

> Adequate resources don’t mean building a large privacy department. They mean giving the DPO enough capacity, access, and support to function credibly.

### A pragmatic budgeting method

Start with risk, not headcount.

Map the highest-risk processing in your environment. Then estimate the recurring work required for oversight, advice, training, incident support, and documentation. If your current DPO setup depends on after-hours review or goodwill from engineering managers, the resourcing is probably insufficient.

## Practical Implementation Models and Reporting Structures

Once leadership accepts the core requirements, the next question is operational. Where should the DPO function sit, and how should information move from product and engineering into that role?

There isn’t one universal model. The right choice depends on processing complexity, internal maturity, and whether your current leaders can stay out of conflict territory.

![A diagram illustrating the DPO position, showing its reporting relationship to management and collaboration with various teams.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/7327d167-0ead-4134-8669-cd17180946af/art-38-gdpr-dpo-diagram.jpg)

### Model one internal DPO

An internal DPO can work well where the business is large enough to support real independence and the processing environment is complex enough to justify a dedicated function.

This model tends to suit organisations that need deep day-to-day familiarity with:

- regulated data environments
- multiple products or business units
- frequent DPIAs
- sustained supervisory interaction
- heavy vendor and transfer analysis

**Advantages**

- Close knowledge of systems and business context
- Faster access to internal teams
- Easier presence in planning and governance forums

**Trade-offs**

- Harder to avoid conflicts if the person also carries operational responsibilities
- More expensive if you need a fully senior and independent role
- Can drift into execution work instead of independent oversight

### Model two external DPO

For many startups and scale-ups, an external DPO is the cleaner design.

The role remains independent by default, and internal operators can keep ownership of delivery and security implementation. This is often a good fit where the company needs strong expertise but doesn’t yet have enough scale for a full internal privacy function.

**Advantages**

- Lower conflict risk
- Access to specialist knowledge across clients and sectors
- Clearer separation between oversight and implementation

**Trade-offs**

- Less day-to-day context unless internal teams provide structured input
- Slower if there’s no reliable intake process
- Can become superficial if treated as a document reviewer rather than an embedded adviser

### Model three hybrid setup

The hybrid model is often the most practical for modern SaaS businesses.

An external DPO provides independent oversight, while an internal privacy lead, compliance manager, or legal operations owner coordinates evidence, workflows, and team communication.

That split usually works well because it separates:

| Function | Typical owner |
|---|---|
| Independent advice and escalation | External or independent DPO |
| Workflow coordination and follow-up | Internal privacy or compliance lead |
| Technical remediation | Engineering, security, product, data teams |
| Risk acceptance | Executive leadership |

This model avoids overloading the DPO with admin while preserving independence.

### Reporting structure that works in practice

Whatever model you choose, reporting needs to be explicit.

A workable structure usually looks like this:

- **Product and engineering teams** raise new processing changes through intake or governance checkpoints.
- **Security and operations** feed incidents, monitoring changes, and vendor issues into the same process.
- **The DPO** reviews, advises, and escalates where needed.
- **Executive leadership** receives direct reporting on significant risks, unresolved recommendations, and accepted exceptions.

If your privacy issues only appear in legal inboxes or audit preparation meetings, the structure is too weak.

### A simple implementation checklist

Use this as a design check rather than a paperwork exercise.

1. **Choose the role model first**  
   Internal, external, or hybrid should follow risk and conflict analysis, not convenience.

2. **Define decision boundaries**  
   Document who determines processing purposes and means, and keep those responsibilities separate from DPO oversight where possible.

3. **Create intake triggers**  
   New vendors, high-risk features, AI use cases, sensitive data flows, and incidents should all trigger DPO visibility.

4. **Set the reporting route in writing**  
   The DPO should have documented access to the highest management level, not just an informal promise.

5. **Give the role evidence access**  
   Data maps, DPIAs, vendor registers, architecture diagrams, and incident records should be reachable without political friction.

6. **Record disagreement cleanly**  
   If management accepts risk against DPO advice, preserve that decision trail.

> A good reporting structure doesn’t make privacy slower. It makes risk visible early enough for leadership to choose deliberately.

### What not to do

Some arrangements look efficient but usually create trouble:

- appointing the CTO as DPO while they control architecture
- placing the DPO under the general counsel or CISO with no direct leadership access
- outsourcing the DPO role without internal process owners
- treating the DPO as solely responsible for operational compliance
- involving the DPO only during audits, incidents, or customer questionnaires

Article 38 works when the DPO is close enough to reality to understand the systems, and independent enough to challenge them.

## Conclusion From Compliance Burden to Architectural Advantage

Many teams first encounter **art 38 gdpr** as a customer requirement or legal review obstacle. That framing is understandable, but it’s too narrow.

Article 38 gives you a design pattern for trustworthy governance in software companies. It tells you that privacy oversight must be independent, properly resourced, connected to real processing activity, and visible at the top of the organisation. Those aren’t abstract legal ideals. They are practical conditions for building systems that can scale without accumulating hidden risk.

A weak setup usually looks efficient until pressure arrives. Then the cracks show. The DPO lacks access. The role sits inside the wrong reporting chain. Product decisions outrun review. AI features reach production without a clear escalation path. Customer due diligence exposes all of it at once.

A stronger setup changes how the company operates.

- **Leadership gets earlier signal** on data protection risk.
- **Engineering gets clearer review points** before architecture hardens.
- **Procurement and product teams get defined triggers** instead of ad hoc legal checks.
- **Customers see governance maturity** rather than policy theatre.

This is why privacy should be treated as an architectural choice, not a feature. Article 38 pushes companies to make that choice structurally. It rewards organisations that can separate oversight from execution, fund the role properly, and give it a direct route to decision-makers.

The practical takeaway is simple.

If your current DPO arrangement depends on goodwill, spare time, or role overlap that nobody has tested for conflict, it probably needs redesign. If your DPO has direct leadership access, credible independence, sufficient resources, and visibility into real data flows, Article 38 becomes much easier to satisfy and much more useful to the business.

That is the shift worth making. Compliance stops being a drag on delivery and starts acting as a control layer for better software decisions.

---

If your team is building SaaS platforms, internal tools, or AI-enabled systems and needs help turning privacy requirements into workable architecture and governance, [Devisia](https://www.devisia.pro) can support that work with a pragmatic engineering mindset.