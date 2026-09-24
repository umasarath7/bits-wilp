// DMML — Lecture 3: Data Architectures
// Source: CourseFiles/DMML/L3-Data Architectures.pptx (50 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Architectures",
  source: "L3-Data Architectures.pptx · 50 slides",
  overview:
    "A data architecture is the **blueprint** for how an organisation's data flows from its sources to the people and models that use it. The slides classify architectures along **four questions**: **who controls** the data (centralisation), **where** it lives (warehouse, mart, lake, lakehouse), **who owns and governs** it in a large organisation (data mesh, data fabric), and **how** it's processed (batch and stream: Lambda, Kappa). We finish with the general big-data architecture. Running example: a **global bank** with subsidiaries in India, the UK and Singapore, which is exactly the situation of the previous paper's architecture question (**PYQ Q3**).",

  summary: [
    {
      id: "intro",
      heading: "Lesson 1: What is data architecture, and why do we need one?",
      slides: "3–6",
      blocks: [
        {
          type: "p",
          text: "Think of building a house. Before anyone lays a brick, an architect draws a **blueprint**: where the rooms go, how the plumbing runs, where you could add a floor later. Data architecture is the same thing for data: it decides **where data comes from, where it's stored, how it moves, who can use it, and how it can grow**, before engineers build the pipelines.",
        },
        {
          type: "p",
          text: "**Three definitions (slides 3–4)**, each adding something:",
        },
        {
          type: "list",
          items: [
            "**TOGAF (The Open Group Architecture Framework):** *a description of the structure and interaction of the enterprise's major types and sources of data, logical data assets, physical data assets, and data-management resources.* The **what exists and how it connects** view.",
            "**DAMA-DMBOK:** *identifying the data needs of the enterprise and designing and maintaining the master blueprints to meet those needs*, using them to guide integration, control data assets and **align data investments with business strategy**. The **business-alignment** view.",
            "**Reis & Housley (Fundamentals of Data Engineering):** *the design of systems to support the evolving data needs of an enterprise, achieved by **flexible and reversible decisions** reached through a careful evaluation of **trade-offs**.* The **change** view: needs keep evolving, so don't lock yourself in.",
          ],
        },
        {
          type: "p",
          text: "**Why it matters (slide 5).** Requirements change quickly and new tools appear almost daily. A good architecture helps you **understand the business goals**, **translate them into designs**, and **know the trade-offs** at every stage: source → ingestion → storage → transformation → serving. The slides' summary: *successful data engineering is built on a rock-solid architecture.*",
        },
        {
          type: "table",
          caption: "Two sides of architecture (slide 6)",
          head: ["", "Operational architecture", "Technical architecture"],
          rows: [
            ["Describes", "**What** needs to happen: people, processes, technology", "**How** it will happen"],
            ["Example question", "Which business processes does this data serve? How is its quality managed? What latency does the business need?", "How do we move 10 TB an hour from the source database into the lake?"],
          ],
        },
      ],
    },
    {
      id: "central",
      heading: "Lesson 2: Who controls the data? Centralised, decentralised or hybrid",
      slides: "7–12",
      blocks: [
        {
          type: "p",
          text: "Our global bank has three subsidiaries, each with its own customers, core banking system and local regulator. The first architectural decision: **should data be controlled from one place, by each unit, or a mix?**",
        },
        {
          type: "p",
          text: "**Centralised (slides 8–9).** A **single point of control**. Data flows from authoritative sources into **one intelligent landing area**, then **one aggregation layer** across all business units, feeding **simplified enterprise reporting**. Like a head office that insists every branch sends its paperwork to one central registry. **Good for:** governance, auditing, consistent reporting, one version of the truth. **Risks:** the central team becomes a **bottleneck**, it's slower to adapt, and it's a **single point of failure**. **Typical of highly regulated industries: banking and healthcare.**",
        },
        {
          type: "p",
          text: "**Decentralised (slide 10).** **Each business unit organises its data front to back** in its own silo: its own sources, aggregation and BU-level reporting. Separate platforms then aggregate across units for enterprise reporting. **Good for:** autonomy and fitting each unit's diverse customers and core systems. **Risks:** duplicated data, **inconsistent definitions** (is a “customer” an account or a person?), and a hard-to-assemble enterprise view. **Typical of insurance**, where master data and domain data are decentralised.",
        },
        {
          type: "p",
          text: "**Hybrid (slides 11–12).** Data and platforms are organised **by data domain** (customers, accounts, payments, risk), with **single golden sources** and **no duplication across domains**. Central standards and master data, plus domain-level agility. **Good for:** balance, and handling rapidly updated data streams. **Cost:** more coordination and design complexity. **Typical of telecom:** centralised master data management plus federated storage by domain.",
        },
        { type: "diagram", name: "d3-central" },
        {
          type: "table",
          caption: "Summary",
          head: ["", "Centralised", "Decentralised", "Hybrid"],
          rows: [
            ["Idea", "One landing area and aggregation layer for all units", "Each unit runs its own data front to back", "Organise by domain with single golden sources"],
            ["Strength", "Governance, auditing, consistency", "Autonomy; fits diverse units", "Central standards + domain agility"],
            ["Weakness", "Bottleneck, less agile, single point of failure", "Duplication, inconsistent definitions", "Coordination and design complexity"],
            ["Typical industry", "**Banking, healthcare**", "**Insurance**", "**Telecom**"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "For the global bank (PYQ Q3)",
          text: "A pure central model clashes with **data residency** laws (some countries require citizens' data to stay in the country). A pure decentralised model gives inconsistent customer data and weak group-wide risk reporting. The usual answer is **hybrid**: central governance, master data (one golden customer record) and group reporting, plus **regional stores** that keep data in-country. See the Theory tab for the full model answer.",
        },
      ],
    },
    {
      id: "warehouse",
      heading: "Lesson 3: Where should analytical data live? Warehouses, schemas and marts",
      slides: "13–19",
      blocks: [
        {
          type: "p",
          text: "**Data warehouse (slides 13–14).** Data is extracted from operational systems, transformed into a **defined structure** (ETL), and loaded for **business analytics**. The structure is a **schema** built from two kinds of table:",
        },
        {
          type: "list",
          items: [
            "**Fact tables** hold the **measures**: the numbers you add up. *Bank:* transaction amount, fee, balance.",
            "**Dimension tables** hold the **context**: who, what, where, when. *Bank:* customer, branch, product, date.",
          ],
        },
        {
          type: "p",
          text: "Why bother? A schema makes data **fast to query, consistent, understandable to business users, and efficient for aggregation** (“total fees by branch by month”).",
        },
        {
          type: "p",
          text: "**Star vs snowflake (slides 15–17).** Two ways to arrange the dimensions around the fact table:",
        },
        {
          type: "table",
          head: ["", "Star schema", "Snowflake schema"],
          rows: [
            ["Shape", "A central fact table with **single-level** dimension tables around it, like the points of a star", "Dimensions **split into sub-dimensions**: branch → city → country, like the arms of a snowflake"],
            ["Design", "**Denormalised** (product id, name and category all in one table)", "**Normalised** (category in its own table)"],
            ["Pros", "**Faster queries** (fewer joins); easy for non-technical users", "Less redundancy; **saves storage**; handles complex hierarchies"],
            ["Cons", "Repeated values use more storage", "More joins → **slower queries**; harder to design and maintain"],
          ],
        },
        { type: "diagram", name: "d3-starsnow" },
        {
          type: "p",
          text: "**Data mart (slides 18–19).** A **smaller, refined subset of the warehouse** for one department or line of business: HR recruitment, IT tickets, the credit-card division. Why? Querying the whole warehouse for one team's needs is slow and complicated. A mart adds a transformation stage with **pre-joined and pre-aggregated** data, which **greatly speeds up** that team's complex joins and aggregations.",
        },
      ],
    },
    {
      id: "lake",
      heading: "Lesson 4: What about raw, messy data? Lakes and lakehouses",
      slides: "20–24",
      blocks: [
        {
          type: "p",
          text: "A warehouse needs you to decide the structure **before** loading. That's hard for fast, messy, unstructured data: app clickstreams, call recordings, scanned KYC documents. So the **data lake** flips the order.",
        },
        {
          type: "p",
          text: "**Data lake (slides 20–22).** Used with **ELT**: load raw data **as it is**, and transform it later depending on its format and purpose. Storage is **near-limitless and cheap**, holds **any size and type** of data, and compute is spun up only when needed.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "How lakes go wrong (slide 23)",
          text: "Without discipline, a lake becomes a **data swamp**: a dumping ground nobody can navigate. It fills with **dark data** (collected but never used) and **WORN data** (Write Once, Read Never). It grows unmanageable, which has happened even at Facebook and Netflix. The root cause is no schema, no metadata, no ownership.",
        },
        {
          type: "p",
          text: "**Data lakehouse (slide 24, from Databricks).** Keep the lake's cheap object storage, but add the warehouse's **controls, data management and structures** on top: tables with schemas, **ACID transactions** (Atomicity, Consistency, Isolation, Durability: updates happen fully or not at all, and readers never see half-written data), and support for **multiple query engines**. One copy of the data serves both BI dashboards and ML.",
        },
        {
          type: "table",
          caption: "Warehouse vs lake vs lakehouse",
          head: ["", "Warehouse", "Lake", "Lakehouse"],
          rows: [
            ["Load style", "ETL (schema-on-write)", "ELT (schema-on-read)", "ELT with managed tables"],
            ["Data types", "Structured", "Any", "Any"],
            ["Cost", "Higher", "Low", "Low"],
            ["Governance / ACID", "Strong", "Weak (swamp risk)", "Strong"],
            ["Best for", "BI, reporting", "ML, exploration, raw archive", "BI and ML on one copy"],
          ],
        },
      ],
    },
    {
      id: "gov",
      heading: "Lesson 5: Who owns the data in a big organisation? Data mesh and data fabric",
      slides: "25–28",
      blocks: [
        {
          type: "p",
          text: "As organisations grow, one central data team can't understand every domain. The team running the lake doesn't know what a “chargeback” means to the cards business. Two modern answers:",
        },
        {
          type: "p",
          text: "**Data mesh (Zhamak Dehghani, slides 25–26)** is an **organisational** idea: **decentralise** the monolithic central platform. Instead of every domain pushing its data into a central lake for a central team to clean, **each domain owns, hosts and serves its own data as a product**. Four principles:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Domain-oriented decentralised ownership and architecture:** the payments team owns payments data.",
            "**Data as a product:** that data is published like a product, with a clear schema, documentation, quality guarantees and SLAs (Service Level Agreements), so other teams can rely on it.",
            "**Self-serve data infrastructure as a platform:** a central platform team provides the tools so domains don't each reinvent storage and pipelines.",
            "**Federated computational governance:** global rules (security, privacy, naming) agreed centrally and enforced automatically, while domains keep autonomy.",
          ],
        },
        {
          type: "p",
          text: "*Example:* the e-commerce team exposes its **order events** as a curated dataset with a schema, SLAs and usage documentation.",
        },
        {
          type: "p",
          text: "**Data fabric (slides 27–28)** is a **technology** idea: a **unified data layer** that connects all the organisation's stores (lakes, warehouses, databases, SaaS apps) through APIs, CDC (Change Data Capture) and **data virtualisation**, so users can query across them as if they were one. Features: unified access, seamless integration and orchestration, security/governance/compliance, scalability, real-time insight, multi-cloud. *Example:* a **360° customer view** combining Salesforce sales data, data-lake transactions and social-media sentiment via APIs.",
        },
        {
          type: "callout",
          kind: "idea",
          title: "The one-line difference",
          text: "**Mesh** changes **who owns** the data (people and organisation). **Fabric** changes **how data is connected** (a technical integration layer). They can be used together.",
        },
        { type: "diagram", name: "d3-mesh" },
      ],
    },
    {
      id: "proc",
      heading: "Lesson 6: How do we process both history and live data? Lambda and Kappa",
      slides: "29–32, 43–50",
      blocks: [
        {
          type: "p",
          text: "**The motivating problem (slide 29): fraud at our bank.** The bank needs two things from the same transactions: **batch analysis** of months of history to discover fraud patterns and produce reports, and **real-time alerts** on each new card swipe within milliseconds. Batch is accurate but slow; streaming is fast but sees only recent data. How do we get both?",
        },
        {
          type: "p",
          text: "**Lambda architecture (slides 30–31, 43–46).** Send every incoming event, kept in an **immutable, append-only** store, down **two paths**:",
        },
        {
          type: "list",
          items: [
            "**Batch layer (the cold path):** periodically recomputes results over **all** the raw data. Accurate and complete, but hours behind.",
            "**Speed layer (the hot path):** processes events as they arrive. Low latency, but approximate and covering only recent data.",
            "**Serving layer:** merges the batch views and the real-time views to answer queries.",
          ],
        },
        {
          type: "p",
          text: "Lambda's big weakness: the same logic is written **twice**, in a batch framework and a streaming framework, so there are two codebases to maintain, results that don't quite match, and more bugs.",
        },
        {
          type: "p",
          text: "**Kappa architecture (Jay Kreps, slides 32, 47–50)** asks: *why not treat everything as a stream?* Keep one **unified, immutable, ordered log** of events (e.g. in Kafka), and process it with a **single stream-processing** codebase. To recompute history (after fixing a bug, say), simply **replay the log from the start** through the new code.",
        },
        { type: "diagram", name: "d3-lambda" },
        {
          type: "table",
          head: ["", "Lambda", "Kappa"],
          rows: [
            ["Paths", "Two: batch (cold) + speed (hot), merged in a serving layer", "One: everything is a stream"],
            ["Reprocessing history", "Batch layer recomputes over all raw data", "**Replay** the log from the beginning"],
            ["Pros", "Accurate historical views + low-latency views", "**One codebase**; simpler; truly event-based"],
            ["Cons", "**Two codebases**; duplicated logic; hard to reconcile", "Streaming is hard to run well; can be complex and expensive; batch is still cheaper for enormous histories"],
            ["For ML", "Batch layer trains on full history; speed layer serves real-time inference", "Same logic for history and live data; supports **online learning**"],
          ],
        },
      ],
    },
    {
      id: "bigdata",
      heading: "Lesson 7: What does a complete big-data architecture look like?",
      slides: "33–42",
      blocks: [
        {
          type: "p",
          text: "**Big data (slides 33–35)** means datasets so large or complex that traditional systems can't handle them: terabytes to petabytes. Compare: **traditional data** is structured, relational, analysed with SQL and statistics, and predictable in size. **Big data** mixes structured, semi-structured and unstructured data, needs ML and data mining, and must be processed in a **distributed** way across many machines. It's described by the **5 Vs**:",
        },
        {
          type: "list",
          items: [
            "**Volume:** how much (petabytes of transactions).",
            "**Velocity:** how fast it arrives (thousands of card swipes per second).",
            "**Variety:** how many forms (tables, JSON logs, images, voice).",
            "**Veracity:** how trustworthy it is (noise, errors, fraud).",
            "**Value:** whether it's worth anything once processed.",
          ],
        },
        {
          type: "p",
          text: "**The generic architecture (slides 36–38)** has these building blocks:",
        },
        {
          type: "p",
          text: "```flow\nData sources -> Data storage (distributed files) -> Batch processing -> Analytical data store -> Analysis & reporting\nData sources -> Real-time message ingestion -> Stream processing -> Analytical data store\nOrchestration (Azure Data Factory, Oozie, Sqoop) coordinates all steps\n```",
        },
        {
          type: "table",
          caption: "Benefits and challenges (slides 39–41)",
          head: ["Benefits", "Challenges"],
          rows: [
            ["**Technology choices:** many open-source and vendor options", "**Complexity:** many moving parts, hard to build, test and debug"],
            ["**Performance through parallelism:** split work across many machines", "**Skillset:** specialised frameworks and languages"],
            ["**Elastic scale:** add machines when needed, pay for what you use", "**Technology maturity:** some tools evolve fast (Spark), others are stable but ageing (Hive, Pig)"],
            ["**Interoperability** with IoT and existing enterprise BI", ""],
          ],
        },
        {
          type: "p",
          text: "**Workloads it supports (slide 42):** batch processing of **data at rest**, real-time processing of **data in motion**, interactive exploration, and predictive analytics/ML. **Use it when** volumes are too large for a traditional database, unstructured data must be transformed for analysis, or unbounded streams need low-latency processing.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in six lines",
          text: "1. Data architecture = the blueprint: flexible, reversible decisions driven by trade-offs. Operational = what; technical = how.\n2. **Centralised** (one control point: banks, hospitals) vs **decentralised** (unit silos: insurance) vs **hybrid** (domains with golden sources: telecom).\n3. **Warehouse**: facts + dimensions; **star** (denormalised, fast) vs **snowflake** (normalised, compact); **marts** for departments.\n4. **Lake**: ELT, cheap, any data, but beware swamps, dark data and WORN. **Lakehouse** adds warehouse management and ACID.\n5. **Mesh** = domain ownership, data as a product, self-serve platform, federated governance. **Fabric** = one integration layer over all stores.\n6. **Lambda** = batch + speed + serving (two codebases). **Kappa** = one stream, replay the log. Big data: 5 Vs; sources → storage/ingestion → batch/stream → analytical store → reporting, with orchestration.",
        },
      ],
    },
  ],

  glossary: [
    ["Data architecture", "—", "The blueprint for how data flows, is stored and used"],
    ["TOGAF", "The Open Group Architecture Framework", "A standard enterprise-architecture framework"],
    ["DAMA-DMBOK", "Data Management Association – Data Management Body of Knowledge", "The standard data-management reference"],
    ["Operational vs technical architecture", "—", "What must happen / how it will happen"],
    ["BU", "Business Unit", "A division of the company (e.g. a country subsidiary)"],
    ["MDM", "Master Data Management", "Maintaining one authoritative (golden) record for core entities"],
    ["Golden source", "—", "The single trusted source for a piece of data"],
    ["Data residency", "—", "Laws requiring data to stay within a country or region"],
    ["Fact table", "—", "Holds measures (amounts, counts)"],
    ["Dimension table", "—", "Holds context (who, what, where, when)"],
    ["Star schema", "—", "Fact table + single-level denormalised dimensions"],
    ["Snowflake schema", "—", "Fact table + normalised, multi-level dimensions"],
    ["Data mart", "—", "A department-specific subset of the warehouse"],
    ["ETL / ELT", "Extract-Transform-Load / Extract-Load-Transform", "Transform before loading / load raw, transform later"],
    ["Schema-on-write / on-read", "—", "Structure enforced when loading / when reading"],
    ["Data swamp", "—", "An unmanaged, unusable lake"],
    ["Dark data", "—", "Data collected but never used"],
    ["WORN", "Write Once, Read Never", "Data stored and never looked at again"],
    ["Lakehouse", "—", "Lake storage + warehouse management and ACID"],
    ["ACID", "Atomicity, Consistency, Isolation, Durability", "Guarantees that updates are all-or-nothing and reliable"],
    ["Data mesh", "—", "Decentralised, domain-owned data served as products"],
    ["Data as a product", "—", "Data published with schema, docs, quality guarantees and SLAs"],
    ["SLA", "Service Level Agreement", "A promised level of quality/availability"],
    ["Federated governance", "—", "Global rules set centrally, applied by autonomous domains"],
    ["Data fabric", "—", "A unified integration layer across all data stores"],
    ["Data virtualisation", "—", "Querying data where it lives, without copying it"],
    ["CDC", "Change Data Capture", "Streaming each change made to a database"],
    ["SaaS", "Software as a Service", "Cloud applications such as Salesforce"],
    ["Lambda architecture", "—", "Batch (cold) + speed (hot) + serving layers"],
    ["Kappa architecture", "—", "A single stream-processing path; replay the log to recompute"],
    ["Immutable, append-only log", "—", "Events are only added, never changed"],
    ["Online learning", "—", "Updating a model continuously as new data arrives"],
    ["5 Vs", "Volume, Velocity, Variety, Veracity, Value", "The dimensions that make data “big”"],
    ["Orchestration", "—", "Scheduling and coordinating pipeline steps (Data Factory, Oozie)"],
  ],

  examTips: [
    "**PYQ Q3** asked you to *apply* centralisation principles to a global organisation with subsidiaries. Answer with: the three options → a comparison on **integration, security, performance** → a **recommended hybrid** design (central MDM/governance + regional/domain stores for data residency) → an example.",
    "Lambda vs Kappa is a very likely 5-marker. Draw both flows and give the ML angle (training on batch, inference on speed).",
    "For mesh vs fabric: mesh = *organisational decentralisation*, fabric = *technical integration layer*.",
  ],

  theory: [
    {
      title: "Designing a global organisation's data architecture by centralisation",
      pyq: "Comprehensive Q3 (5 marks)",
      marks: 5,
      question:
        "How would you apply the principles of data architecture categorization by centralization to design a data management system for a global organization with multiple subsidiaries, considering the trade-offs between centralized, decentralized, and hybrid approaches in terms of data integration, security, and performance, and taking into account the organization's diverse business needs, regulatory requirements, and technological infrastructure?",
      solution: `
### What the examiner wants
It says **apply**, so don't just define the three models. Compare them on the three criteria the question names (**integration, security, performance**), recommend one for *this* organisation with reasons (data residency, group reporting, local agility), and sketch the design with a diagram (Lesson 2).

### Model answer
**1. The three options (slides 9–12)**
- **Centralised:** a single point of control. Authoritative sources → one landing area → one aggregation layer → enterprise reporting. Typical in regulated banking and healthcare.
- **Decentralised:** each subsidiary/BU owns its sources, aggregation and reporting; enterprise platforms aggregate across BUs. Typical in insurance.
- **Hybrid:** organised by **data domain**, with **single golden sources** and no duplication across domains. Typical in telecom (centralised MDM + federated domain storage).

**2. Trade-off analysis**

| Criterion | Centralised | Decentralised | Hybrid |
|---|---|---|---|
| **Integration** | Easiest enterprise view, one model; slow to onboard local sources | Hard: different schemas and definitions, silos | Central **MDM** and shared definitions + local domain autonomy |
| **Security & compliance** | One policy point, easy auditing; but cross-border movement may *violate* data-residency laws | Local control meets local law, but inconsistent enforcement | **Federated governance**: global policies, enforced locally; data stays in-region |
| **Performance** | Central bottleneck; latency for distant subsidiaries | Local performance good; enterprise queries slow | Local processing near the data + curated global aggregates |
| **Agility / cost** | Low agility; economies of scale | High agility; duplicated effort and cost | Balanced |

**3. Recommended design: hybrid**

\`\`\`flow
Subsidiary sources (ERP, CRM, IoT) -> Regional domain stores / lakehouse (data stays in-region) -> Curated data products
Curated data products -> Global layer: MDM golden records + enterprise warehouse -> Group reporting & ML
Global governance council: policies, catalogue, metadata, security standards -> applied in every region
\`\`\`

- **Centralise:** master data (customer, product, legal entity) as **golden records**; the enterprise **catalogue/metadata**; security standards (encryption, RBAC); and group-level KPIs and consolidated financial reporting.
- **Decentralise:** operational data and local analytics per subsidiary/domain, especially data under **residency laws** (EU GDPR data stays in an EU region; India DPDPA).
- **Integration:** subsidiaries publish **curated, aggregated or anonymised data products** to the global layer through ELT/CDC pipelines with **data contracts**. Only allowed data crosses borders.
- **Security:** a zero-trust, role-based model; audit logging; pseudonymise PII before it leaves the region.
- **Performance:** regional compute close to users; the global warehouse holds pre-aggregated marts.
- **Technology:** respect existing infrastructure (some subsidiaries on-prem, others cloud) using a common cloud/lakehouse standard and APIs. A **data fabric** layer can virtualise access across them.

**4. Example:** a multinational bank. Customer master data and the risk data (BCBS 239 lineage) are centralised. Each country runs its own lakehouse for transactions (regulators require local storage). Group risk reports use aggregated feeds.

**Conclusion:** no single model fits a global group. **Hybrid**, with central governance and MDM plus decentralised domain storage, balances integration, compliance and performance.

### Takeaway
For a regulated global group the defensible answer is **hybrid**: central governance, MDM and group reporting; regional or domain stores for residency and local speed.`,
    },
    {
      title: "Lambda vs Kappa architecture for ML",
      marks: 5,
      question: "A bank needs both fraud-pattern reports (batch) and real-time fraud alerts. Explain the Lambda architecture with a diagram, its drawbacks, and how Kappa addresses them. How does each support ML workflows?",
      solution: `
### What the examiner wants
Both flows drawn, the layers explained, a comparison table (paths, reprocessing, pros, cons), and the **ML angle** (training vs inference, online learning). A scenario such as fraud detection ties it together (Lesson 6).

### Model answer
**Lambda** runs two paths from an immutable, append-only source:

\`\`\`flow
Transactions (immutable log) -> Batch layer / cold path (all raw data, e.g. warehouse jobs) -> Batch views
Transactions (immutable log) -> Speed layer / hot path (stream processing, NoSQL) -> Real-time views
Batch views + Real-time views -> Serving layer (combined query)
\`\`\`
- **Batch layer:** stores all raw data and computes accurate, pre-aggregated views (fraud patterns, reports). It has high latency.
- **Speed layer:** processes the latest events with low latency for immediate alerts, possibly less accurately.
- **Serving layer:** merges both views for clients.

**Drawbacks:** two systems with **two codebases** for the same logic. They are hard to keep consistent and reconcile, error-prone, and costly to operate.

**Kappa (Jay Kreps):** use the **stream-processing platform as the backbone** for everything.

\`\`\`flow
Transactions -> Distributed immutable log (Kafka) -> Stream processor -> Real-time views / alerts
Distributed immutable log -> Replay from offset 0 -> Recompute historical views
\`\`\`
- One code path. Batch becomes "replay the stream". It is a true event-driven design.
- **Challenges:** streaming is harder to run well; it can be expensive; batch storage is still cheaper for very large history.

**ML angle:**
- *Lambda:* the batch layer gives the **complete history for training**; the speed layer gives **real-time inference/scoring**.
- *Kappa:* the **same processing logic** for historical and live data (fewer training/serving mismatches), supporting **online/continuous learning**.

**For the bank:** Lambda is a pragmatic start if a mature warehouse already exists. Kappa is attractive if the team is strong in streaming and wants a single codebase.

### Takeaway
Lambda = two paths, accurate but two codebases. Kappa = one stream, replay the log. Choose Kappa when one team can own a single streaming codebase.`,
    },
    {
      title: "Warehouse schemas: star vs snowflake, and data marts",
      marks: 5,
      question: "Explain the star and snowflake schemas with a retail example. Compare them, and explain when and why data marts are created.",
      solution: `
### What the examiner wants
Facts vs dimensions defined, both schemas described (ideally sketched) with pros and cons, and the purpose of a data mart (Lesson 3).

### Model answer
**Retail example:** fact table **Sales**(date_id, product_id, store_id, customer_id, qty, amount).

**Star schema:** single-level, **denormalised** dimensions directly around the fact.
\`\`\`flow
Dim Date -> FACT Sales
Dim Product (id, name, category, brand) -> FACT Sales
Dim Store (id, city, state, country) -> FACT Sales
\`\`\`

**Snowflake schema:** dimensions **normalised** into sub-dimensions.
\`\`\`flow
Category -> Product -> FACT Sales
Country -> State -> City -> Store -> FACT Sales
\`\`\`

| | Star | Snowflake |
|---|---|---|
| Normalisation | Denormalised | Normalised |
| Joins | Few, so **faster queries** | More, so slower |
| Storage | More (repeated values) | Less redundancy |
| Ease | Simple for business users | Harder to design and maintain |
| Best for | Fast dashboards and BI | Complex hierarchies, very large dimensions |

**Data marts:** once the warehouse exists, departments (HR recruitment analytics, IT ticket dashboards) query it heavily, and running every query over the whole warehouse hurts performance. A **data mart** is a refined **subset** focused on one department/line of business:
- easier access for analysts and report developers
- an extra transformation stage (pre-joined, pre-aggregated data)
- much better performance for complex joins and aggregations on large raw data

### Takeaway
Star = denormalised, fast and simple. Snowflake = normalised, compact but more joins. Marts = department-sized, pre-aggregated slices of the warehouse.`,
    },
    {
      title: "Data lake vs warehouse vs lakehouse",
      marks: 5,
      question: "Compare data warehouses, data lakes and data lakehouses. What are data swamps, dark data and WORN? How does a lakehouse address these issues for ML?",
      solution: `
### What the examiner wants
A comparison table (schema, data types, load style, cost, governance, use), the lake's failure modes (swamp, dark data, WORN), and why the lakehouse emerged (Lessons 3–4).

### Model answer
| | Warehouse | Lake | Lakehouse |
|---|---|---|---|
| Pipeline | ETL (transform, then load) | ELT (load raw, transform later) | ELT + managed tables |
| Schema | Schema-on-write | Schema-on-read | Schema enforcement on open formats |
| Data | Structured | Any (structured, semi, unstructured) | Any |
| Storage cost | Higher | Very low (object storage) | Low (object storage) |
| Transactions | ACID | Usually none | **ACID** (Delta/Iceberg/Hudi) |
| Users | BI analysts | Data scientists, ML | Both |

**Lake failure modes:**
- **Data swamp:** a disorganised, ungoverned dumping ground where nobody can find or trust data.
- **Dark data:** data collected and stored in normal business but never used.
- **WORN:** *Write Once, Read Never*. Storage grows unmanageable. Even Facebook and Netflix have lots of WORN data.

**Lakehouse (Databricks):** adds warehouse-style **controls, data management and structures** on top of lake storage: schemas, ACID, versioning/time travel, catalogues and governance, plus support for several query engines. For ML this means one copy of the data serves SQL BI *and* Python/Spark training, with reproducible versions of training data and less duplication.

### Takeaway
Warehouses are strict and fast; lakes are cheap and flexible but can rot; lakehouses aim for both on one copy of the data.`,
    },
    {
      title: "Data mesh vs data fabric",
      marks: 5,
      question: "Explain data mesh and its four principles. How is it different from data fabric? Give an example of each.",
      solution: `
### What the examiner wants
Mesh's four principles and fabric's features, an example of each, and the crucial distinction: **organisational vs technological** (Lesson 5).

### Model answer
**Data mesh (Zhamak Dehghani).** A response to monolithic, centralised lakes/warehouses and the divide between operational and analytical data. It applies **domain-driven design** to data: instead of pushing data into a central team's lake, domains **host and serve** their own datasets.

Four principles:
1. **Domain-oriented decentralised ownership and architecture:** the orders team owns order data end to end.
2. **Data as a product:** discoverable, addressable, trustworthy, documented (schema, SLAs, usage guidelines).
3. **Self-serve data infrastructure as a platform:** a central platform team provides tools (catalogue, monitoring, pipelines) so domains focus on domain logic.
4. **Federated computational governance:** global standards (security, interoperability) enforced automatically, with domains keeping autonomy.

*Example:* the e-commerce orders domain publishes an "order events" data product with metadata, schema, SLAs and usage docs. Marketing consumes it directly.

**Data fabric.** A **technology-driven unified data layer** that integrates lakes, warehouses, databases and SaaS through **APIs, CDC and virtualisation**. Features: unified access, integration and orchestration, security/governance/compliance, scalability, real-time insights, multi-cloud. *Example:* a 360° customer view combining Salesforce sales, data-lake transaction logs and social-media sentiment via APIs.

**Difference:**
| | Mesh | Fabric |
|---|---|---|
| Nature | Organisational + architectural (people, ownership) | Technical integration layer |
| Data location | Distributed across domains by design | Anywhere; unified virtually |
| Governance | Federated | Centralised policies through the fabric |

They can coexist: a fabric can be the self-serve platform underneath a mesh.

### Takeaway
Mesh changes **who owns** data; fabric changes **how data is connected**. They are complementary, not rivals.`,
    },
    {
      title: "Big-data architecture components",
      marks: 5,
      question: "With a diagram, explain the components of a generalised big-data architecture. When should an organisation adopt it, and what are its benefits and challenges?",
      solution: `
### What the examiner wants
The 5 Vs, the component diagram (sources, storage, ingestion, batch and stream processing, analytical store, reporting, orchestration), and the benefits and challenges (Lesson 7).

### Model answer
\`\`\`flow
Data sources (DBs, files, IoT) -> Data storage (distributed file store) -> Batch processing (filter, aggregate) -> Analytical data store -> Analysis & reporting
Data sources -> Real-time message ingestion -> Stream processing -> Analytical data store
Orchestration (Data Factory / Oozie / Sqoop) automates the workflows end to end
\`\`\`

**Components**
- **Data sources:** DBs, files, IoT devices, logs.
- **Data storage:** a distributed file store for large volumes in many formats.
- **Batch processing:** long-running jobs that read, filter, aggregate and write new files.
- **Real-time message ingestion:** captures and buffers streaming messages.
- **Stream processing:** filters/aggregates real-time data and writes to a sink.
- **Analytical data store:** a structured, queryable store (e.g. a Kimball-style warehouse).
- **Analysis & reporting:** BI, dashboards, ML.
- **Orchestration:** automates the repeated workflows.

**When to adopt:** volumes too large for a traditional DB; unstructured data to transform; unbounded streams needing low latency. Workloads: batch at rest, real-time in motion, interactive exploration, predictive analytics/ML.

**Benefits:** technology choice, performance through parallelism, elastic scale (pay per use), interoperability with IoT and BI.
**Challenges:** complexity (build, test, debug), specialised skills, fast-changing technology (e.g. Spark releases).

**5 Vs** drive the need: *volume, velocity, variety, veracity, value*.

### Takeaway
Every big-data system is some arrangement of the same blocks: land the data, process it in batch and/or stream, serve it for analysis, and orchestrate the lot.`,
    },
  ],

  quiz: [
    { q: "Which architecture suits highly regulated banks and healthcare organisations?", options: ["Centralised", "Decentralised", "Hybrid", "Kappa"], answer: 0, why: "A single point of control for governance, auditing and reporting." },
    { q: "Telecom companies often use centralised MDM with federated domain storage. That is:", options: ["Centralised", "Decentralised", "Hybrid", "Lambda"], answer: 2, why: "Organised by domain with golden sources." },
    { q: "A star schema is:", options: ["Normalised, many joins", "Denormalised, fast queries", "Stream-only", "Schema-less"], answer: 1, why: "Single-level denormalised dimensions around a fact table." },
    { q: "A department-specific subset of a warehouse is a:", options: ["Data lake", "Data mart", "Data swamp", "Data fabric"], answer: 1, why: "Data marts serve one line of business." },
    { q: "“Write Once, Read Never” describes:", options: ["Warehouses", "Unused data in lakes", "Kafka logs", "OLTP rows"], answer: 1, why: "WORN data is a lake anti-pattern." },
    { q: "Which is NOT a data mesh principle?", options: ["Data as a product", "Self-serve infrastructure", "Centralised data team owns all data", "Federated computational governance"], answer: 2, why: "Mesh decentralises ownership to domains." },
    { q: "Kappa architecture reprocesses history by:", options: ["A separate batch layer", "Replaying the event log", "Manual reloads", "Snapshots only"], answer: 1, why: "A single streaming path with replay." },
    { q: "Main drawback of Lambda architecture:", options: ["No real-time", "Duplicate logic in two codebases", "No batch accuracy", "Can't scale"], answer: 1, why: "Batch and speed layers use different frameworks with duplicated logic." },
    { q: "In Lambda, the speed layer is also called the:", options: ["Cold path", "Hot path", "Serving path", "Replay path"], answer: 1, why: "Hot path = low latency." },
    { q: "Data fabric mainly provides:", options: ["Domain ownership", "A unified integration/access layer via APIs, CDC and virtualisation", "Star schemas", "A batch layer"], answer: 1, why: "A technology layer unifying heterogeneous stores." },
  ],
};
