// DMML — Lecture 3: Data Architectures
// Source: CourseFiles/DMML/L3-Data Architectures.pptx (52 slides)

export default {
  title: "Data Architectures",
  source: "L3-Data Architectures.pptx · 52 slides",
  overview:
    "Data architecture is the **blueprint** that supports an enterprise's evolving data needs through **flexible, reversible decisions based on trade-offs**. The lecture classifies architectures four ways: by **centralisation** (centralised / decentralised / hybrid), by **storage** (warehouse with star/snowflake schemas and data marts, lake, lakehouse), by **governance** (data mesh, data fabric) and by **processing** (Lambda, Kappa). It ends with a generalised **big-data architecture** (5 Vs, components, benefits, challenges) and how Lambda and Kappa support ML.",

  summary: [
    {
      id: "intro",
      heading: "1. What is data architecture and why?",
      slides: "3–6",
      blocks: [
        { type: "list", items: [
          "**TOGAF:** a description of the structure and interaction of the enterprise's major types and sources of data, logical and physical data assets, and data-management resources.",
          "**DAMA-DMBOK:** identifying the enterprise's data needs and designing and maintaining **master blueprints** to meet them, guiding integration, controlling data assets, and aligning data investments with business strategy.",
          "**Reis & Housley:** the design of systems to support the **evolving** data needs of an enterprise, achieved by **flexible and reversible decisions** reached through careful evaluation of **trade-offs**.",
          "**Why:** requirements change fast and new tools arrive almost daily. Good architecture lets you understand the business, translate its needs into designs, and know the trade-offs across source → ingestion → storage → transformation → serving. *Successful data engineering is built on rock-solid architecture.*",
        ]},
        {
          type: "table",
          head: ["Aspect", "Operational architecture", "Technical architecture"],
          rows: [
            ["Describes", "**What** needs to happen (people, processes, technology)", "**How** it will happen"],
            ["Example question", "Which business processes does the data serve? How is quality managed?", "How will we move 10 TB/hour from the source DB to the lake?"],
          ],
        },
      ],
    },
    {
      id: "central",
      heading: "2. Categorisation by centralisation",
      slides: "7–12",
      blocks: [
        {
          type: "table",
          head: ["", "Centralised", "Decentralised", "Hybrid"],
          rows: [
            ["Idea", "Single point of control: authoritative sources → one intelligent landing area → one aggregation layer across business units → simplified enterprise reporting", "Each business unit organises data front to back in its own silo (sources, aggregation, BU reporting); platforms aggregate across BUs for enterprise reporting", "Data and platforms organised **by data domain**, with **single golden sources** and no duplication across domains"],
            ["Strength", "Governance, auditing, reporting, consistency", "Autonomy; fits diverse customer bases and core systems", "Balance: central standards/MDM + domain agility; suits rapidly updated streams"],
            ["Weakness", "Bottleneck, less agility, single point of failure", "Duplication, inconsistent definitions, hard enterprise view", "More coordination and design complexity"],
            ["Typical industry", "**Banking, healthcare** (highly regulated)", "**Insurance** (decentralised MDM and domain data)", "**Telecom** (centralised MDM + federated domain storage)"],
          ],
        },
      ],
    },
    {
      id: "storage",
      heading: "3. Categorisation by storage",
      slides: "13–24",
      blocks: [
        { type: "p", text: "**Data warehouse:** the ETL output is transformed into a defined structure for business analytics. A **schema** (facts = measures; dimensions = context) makes data fast to query, consistent, understandable to business users and efficient for aggregation." },
        {
          type: "table",
          head: ["", "Star schema", "Snowflake schema"],
          rows: [
            ["Shape", "Central **fact** table (sales, revenue) + single-level **dimension** tables around it", "Dimensions split into sub-dimensions (multi-level)"],
            ["Design", "**Denormalised** (product id, name and category in one table)", "**Normalised**"],
            ["Pros", "Faster queries; easy for non-technical users", "Less redundancy; storage-efficient; handles complex hierarchies"],
            ["Cons", "Repeated data, so more storage", "More joins, so slower queries; harder to design and maintain"],
          ],
        },
        { type: "p", text: "**Data mart:** a refined **subset of the warehouse** for one department or line of business (HR recruitment, IT tickets). It avoids querying the whole warehouse, adds a transformation stage (pre-joined/aggregated data) and greatly improves performance for complex joins and aggregations." },
        { type: "p", text: "**Data lake:** used with **ELT** for high-velocity, unstructured data whose transformation depends on format. Storage is near-limitless and cheap, holding any size and type, with compute spun up on demand. **Drawbacks:** it becomes a dumping ground or **data swamp**, holds **dark data** (collected but never used) and **WORN** data (write once, read never), and grows unmanageable (even at Facebook and Netflix)." },
        { type: "p", text: "**Data lakehouse (Databricks):** the controls, data management and structures of a warehouse on top of the lake's object storage, supporting multiple query engines and **ACID** transactions." },
      ],
    },
    {
      id: "gov",
      heading: "4. Categorisation by governance: data mesh & data fabric",
      slides: "25–28",
      blocks: [
        {
          type: "table",
          head: ["", "Data mesh (Zhamak Dehghani)", "Data fabric"],
          rows: [
            ["Core idea", "**Decentralise** monolithic platforms: domains host and serve their own data as products, instead of pushing it into a central lake", "A **unified data layer** that integrates lakes, warehouses, DBs and SaaS via APIs, CDC and virtualisation"],
            ["Principles", "1. Domain-oriented decentralised ownership and architecture 2. **Data as a product** 3. **Self-serve data infrastructure** as a platform 4. **Federated computational governance**", "Unified access; seamless integration and orchestration; security, governance and compliance; scalability; real-time insights; multi-cloud"],
            ["Example", "E-commerce team exposes order events as a curated dataset with schema, SLAs and usage docs", "360° customer view: Salesforce sales + data-lake transactions + social sentiment via API"],
            ["Nature", "Organisational/socio-technical (domain-driven design applied to data)", "Technology/integration layer"],
          ],
        },
      ],
    },
    {
      id: "proc",
      heading: "5. Categorisation by processing: Lambda & Kappa",
      slides: "29–32, 43–50",
      blocks: [
        { type: "p", text: "**Motivation (bank fraud):** batch analysis to find fraud patterns and reports, *plus* real-time alerts on each transaction. The same data must flow to both batch and stream processing." },
        { type: "p", text: "```flow\nImmutable, append-only source -> Batch layer (cold path: all raw data, accurate, slow) -> Serving layer (batch views)\nImmutable, append-only source -> Speed layer (hot path: real-time, low latency, less accurate) -> Serving layer (combined view)\n```" },
        { type: "p", text: "```flow\nEvent stream (unified, immutable, ordered log) -> Stream processing -> Real-time views (replay the log to recompute history)\n```" },
        {
          type: "table",
          head: ["", "Lambda", "Kappa (Jay Kreps)"],
          rows: [
            ["Paths", "Two: **batch (cold)** + **speed (hot)**, merged in a serving layer", "One: everything is a **stream**"],
            ["Reprocessing", "Batch layer recomputes over all raw data", "**Replay** the log from the start"],
            ["Pros", "Accurate historical views + low-latency views", "Single codebase; simpler; a true event-based architecture"],
            ["Cons", "**Two codebases/frameworks**; duplicate logic; hard to reconcile; error-prone", "Streaming is hard to execute; can be complicated and expensive; batch is still cheaper for enormous history"],
            ["ML use", "Batch layer → training on full history; speed layer → real-time inference", "Unified pipeline; the same logic for history and live data; supports **online learning**"],
          ],
        },
      ],
    },
    {
      id: "bigdata",
      heading: "6. Generalised big-data architecture",
      slides: "33–42",
      blocks: [
        { type: "p", text: "**Big data** = massive, complex datasets that traditional systems can't handle (TB–PB). **Traditional data** is structured, relational, analysed with SQL/statistics, and predictable in size. **Big data** is structured + semi + unstructured, needs ML/data mining and **distributed processing**. **5 Vs:** Volume, Velocity, Variety, Veracity, Value." },
        { type: "p", text: "```flow\nData sources -> Data storage (distributed files) -> Batch processing -> Analytical data store -> Analysis & reporting\nData sources -> Real-time message ingestion -> Stream processing -> Analytical data store\nOrchestration (Azure Data Factory, Oozie, Sqoop) coordinates all steps\n```" },
        {
          type: "table",
          head: ["Benefits", "Challenges"],
          rows: [
            ["Many technology choices (open source + vendors)", "**Complexity:** many components, hard to build, test and debug"],
            ["**Performance through parallelism**", "**Skillset:** specialised frameworks and languages"],
            ["**Elastic scale**: scale out, pay for what you use", "**Technology maturity:** fast-evolving (Spark releases) vs stable (Hive, Pig)"],
            ["Interoperability with IoT and enterprise BI", ""],
          ],
        },
        { type: "p", text: "**Workloads:** batch processing of data at rest, real-time processing of data in motion, interactive exploration, predictive analytics/ML. **Use it when:** volumes are too large for a traditional DB, unstructured data must be transformed, or unbounded streams need low-latency processing." },
      ],
    },
  ],

  keyTerms: [
    ["Data architecture", "Blueprint for data needs; flexible, reversible, trade-off-driven."],
    ["Centralised / decentralised / hybrid", "One control point / BU silos / domain-based golden sources."],
    ["MDM", "Master data management: a single authoritative version of core entities."],
    ["Fact / dimension", "Measures (sales) / context (product, date, region)."],
    ["Star vs snowflake", "Denormalised, fast / normalised, compact."],
    ["Data mart", "Department-specific subset of the warehouse."],
    ["Data swamp / dark data / WORN", "Lake failure modes."],
    ["Lakehouse", "Lake storage + warehouse management and ACID."],
    ["Data mesh", "Domain ownership, data as product, self-serve platform, federated governance."],
    ["Data fabric", "Unified integration layer over heterogeneous stores."],
    ["Lambda", "Batch (cold) + speed (hot) + serving layers."],
    ["Kappa", "Stream-only; replay the log for reprocessing."],
    ["5 Vs", "Volume, velocity, variety, veracity, value."],
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

**Conclusion:** no single model fits a global group. **Hybrid**, with central governance and MDM plus decentralised domain storage, balances integration, compliance and performance.`,
    },
    {
      title: "Lambda vs Kappa architecture for ML",
      marks: 5,
      question: "A bank needs both fraud-pattern reports (batch) and real-time fraud alerts. Explain the Lambda architecture with a diagram, its drawbacks, and how Kappa addresses them. How does each support ML workflows?",
      solution: `
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

**For the bank:** Lambda is a pragmatic start if a mature warehouse already exists. Kappa is attractive if the team is strong in streaming and wants a single codebase.`,
    },
    {
      title: "Warehouse schemas: star vs snowflake, and data marts",
      marks: 5,
      question: "Explain the star and snowflake schemas with a retail example. Compare them, and explain when and why data marts are created.",
      solution: `
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
- much better performance for complex joins and aggregations on large raw data`,
    },
    {
      title: "Data lake vs warehouse vs lakehouse",
      marks: 5,
      question: "Compare data warehouses, data lakes and data lakehouses. What are data swamps, dark data and WORN? How does a lakehouse address these issues for ML?",
      solution: `
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

**Lakehouse (Databricks):** adds warehouse-style **controls, data management and structures** on top of lake storage: schemas, ACID, versioning/time travel, catalogues and governance, plus support for several query engines. For ML this means one copy of the data serves SQL BI *and* Python/Spark training, with reproducible versions of training data and less duplication.`,
    },
    {
      title: "Data mesh vs data fabric",
      marks: 5,
      question: "Explain data mesh and its four principles. How is it different from data fabric? Give an example of each.",
      solution: `
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

They can coexist: a fabric can be the self-serve platform underneath a mesh.`,
    },
    {
      title: "Big-data architecture components",
      marks: 5,
      question: "With a diagram, explain the components of a generalised big-data architecture. When should an organisation adopt it, and what are its benefits and challenges?",
      solution: `
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

**5 Vs** drive the need: *volume, velocity, variety, veracity, value*.`,
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
