// DMML — Lecture 2: Concepts / Fundamentals of Data Management
// Source: CourseFiles/DMML/L2-Data Management Fundamentals.pptx (39 slides)

export default {
  title: "Data Management Fundamentals",
  source: "L2-Data Management Fundamentals.pptx · 39 slides",
  overview:
    "The *principles* of data. Data is an **asset** (the Netflix example) and a **liability** (PII, medical records, compliance, deletion). **ML pipelines are more sensitive** to data than ordinary pipelines, and data must be **reliable** (durable, consistent, versioned, performant, available). The lecture then covers the **components of data management** (integration & processing via ETL/ELT, storage in a warehouse/lake/lakehouse, governance, security), the **data platform**, the **DMBOK-style framework**, the **four phases of the ML data lifecycle** (creation → ingestion → processing → post-processing), and **data roles**.",

  summary: [
    {
      id: "asset",
      heading: "1. Principles of data: asset, liability, sensitivity, reliability",
      slides: "3–10",
      blocks: [
        {
          type: "table",
          head: ["Principle", "Key idea", "Example / practice"],
          rows: [
            ["**Data as an asset**", "Data is key to a successful business model: transform data into value. But relevant data is *not easy to collect*", "Netflix: data-informed perspectives that improve its service"],
            ["**Data as a liability**", "“One man's food is another's poison.” Data becomes a liability when exposed or misused, or held without consent, bringing legal, ethical and reputational risk", "Leaked medical records → lawsuits and reputational damage"],
            ["**Data sensitivity of ML pipelines**", "Normal pipelines are sensitive to **volume and correctness**. ML pipelines are also sensitive to **changes in data distribution**", "Losing one country's data: the data pipeline runs “fine” but year-end sales predictions go wrong"],
            ["**Data reliability**", "Minimum expected characteristics of data in distributed systems", "Durability, consistency, version control (time travel), performance, availability"],
          ],
        },
        { type: "p", text: "**Myths:** “more data == better” and “this stuff is easy.”" },
        {
          type: "table",
          caption: "Managing data as a liability",
          head: ["Topic", "Details"],
          rows: [
            ["**Restrictions on collection**", "PII needs *explicit consent + deletion criteria*. Compliance depends on the organisation's location, the data's origin (EU data can't leave the EU) and company policies. Sources of restriction: laws, industry practice, insurance regulations, corporate governance"],
            ["**Approach 1: access restriction**", "Restrict even employees; grant granular permissions; keep detailed logs to trace access"],
            ["**Approach 2: anonymisation / pseudonymisation**", "Replace private identifiers reversibly (reversal needs extra data/systems). Protects against casual inspection along the pipeline and preserves the properties the model needs (e.g. a different postcode from the *same locality*)"],
            ["**Approach 3 (recommended): connection removal**", "Remove the link between PII and model data. This reduces risk the most, but is harder than it seems"],
            ["**Deletion is hard**", "Shift+Del doesn't erase data (recovery tools exist); tape archives are hard to purge. Delete when the user asks, when no longer needed (e.g. job-portal profiles kept 6 months), or when policy demands (GDPR)"],
          ],
        },
      ],
    },
    {
      id: "dm",
      heading: "2. Data management and its components",
      slides: "11–20",
      blocks: [
        { type: "p", text: "**IBM study:** 72% of top-performing CEOs say competitive advantage depends on having the most advanced GenAI. To exploit AI, organisations must first organise their **information architecture** so data is accessible and usable. **Challenges:** data volume; silos across locations/clouds; many types and formats; complex, inconsistent datasets." },
        {
          type: "table",
          head: ["Component", "What it does"],
          rows: [
            ["**I. Integration & processing**", "Step 1: ingest raw data (web APIs, apps, IoT, forms, surveys). **ETL** was the traditional method but struggles with unstructured data, velocity and real-time flows, so **ELT** emerged (cloud + real-time needs). Then *filter, merge, aggregate* for BI dashboards or ML"],
            ["**II. Storage**", "Before or after processing; chosen by type and purpose. **Warehouse:** defined schema, RDBMS, high-performance analytics on structured data (BI, dashboards). **Lake:** no schema, semi/unstructured data, cost-optimised (AI, analytics at scale, sandboxes). **Lakehouse** = warehouse + lake"],
            ["**III. Governance**", "**Data governance councils** align taxonomies so **metadata** (data about data) is consistent, and define roles and responsibilities for appropriate access"],
            ["**IV. Security**", "Guardrails against unauthorised access, corruption and theft: controlled access (can you see a colleague's salary slip?), **encryption, data masking**, disaster recovery"],
          ],
        },
      ],
    },
    {
      id: "platform",
      heading: "3. Data platform & DM framework",
      slides: "21–24",
      blocks: [
        { type: "p", text: "**Data platform:** a software suite, central repository and collection of pipelines that ingest, store, transform and deliver data to different enterprise groups. It needs fast query processing, large storage, elastic compute, in-memory caches, massively parallel processing, columnar storage and compute clusters." },
        {
          type: "table",
          caption: "Data-management framework (DMBOK-style)",
          head: ["Area", "Role"],
          rows: [
            ["**Data governance** (centre)", "Overarching support: stewardship, policies, processes, standards, best practices"],
            ["Data architecture", "Infrastructure for storage, integration and use of data"],
            ["Metadata", "Critical information about data attributes, so data is used efficiently"],
            ["Data quality", "Structure to ensure data fulfils business needs"],
            ["Data lifecycle", "Integrity from first entry into the company to final deletion"],
            ["Analytics", "Statistical and visual techniques for insights"],
            ["Data privacy", "Supports sharing internally and externally, safely"],
          ],
        },
      ],
    },
    {
      id: "lifecycle",
      heading: "4. Phases of the ML data lifecycle",
      slides: "25–31",
      blocks: [
        { type: "p", text: "```flow\nPhase 1: Creation (devices, web, curation) -> Phase 2: Ingestion (data lake) -> Phase 3: Processing (validation, cleaning, enrichment) -> Phase 4: Post-processing (storage, management, analysis & visualisation) -> Model training & pipeline\n```" },
        {
          type: "table",
          head: ["Phase", "Key points"],
          rows: [
            ["**Creation / generation**", "Data is generated or captured *somewhere else* (serving logs, event photos, medical diagnostics). Some datasets can stay static (a photo-recognition set usable for months, if representative); others must be refreshed (winter-only photos → distribution shift)"],
            ["**Ingestion**", "Receive into the system and write to storage. **Filtering/selection** always happens; **sampling** saves cost but loses detail (measure the quality cost vs the savings; more data usually helps ML). Use APIs/RPCs that confirm **lineage**. Reliability concerns: **correctness and throughput**"],
            ["**Processing**", "**Validate** (against the schema / last known good feed), **clean** (missing fields, duplicates, misclassification, encoding errors), **normalise / bucket**, **enrich & extend** (join other sources, add labels)"],
            ["**Post-processing**", "**Storage** chosen by access patterns (model structure, team, training process). **Metadata** about stored features is hugely valuable. **Visualisation** must explain what each record means, how it links to other datasets, and whether it is clean and safe for training. Then **ML**"],
          ],
        },
      ],
    },
    {
      id: "roles",
      heading: "5. Data roles & connecting the dots",
      slides: "32–37",
      blocks: [
        {
          type: "table",
          head: ["Role", "Responsibility"],
          rows: [
            ["Data analyst", "Collect/clean data, exploratory analysis, reports"],
            ["Data engineer", "Manage DBMS; develop and maintain **data pipelines**"],
            ["Data scientist", "Build statistical/ML models; deep insights"],
            ["Data architect", "Create and maintain the organisation's data **blueprint** and systems"],
            ["DB admin", "Install and manage DB systems on infrastructure"],
            ["BI analyst", "Business insights and reporting"],
          ],
        },
        { type: "p", text: "**Data engineering** = *design, build, maintain* systems to *collect, transform, store* data for *analytics, data science, ML*. **Case study (recommendation engine):** data engineering covers sources, cleaning logic, storage, schedulers, alarms and change requests. What's missing is **architecture** (business acumen, data models, holistic design, orchestration, platform) and **governance** (privacy, security, monitoring/logging, lifecycle)." },
        { type: "p", text: "```flow\nData Architecture (blueprints, standards, models) -> Data Engineering (pipelines, ETL/ELT, APIs, streaming, orchestration)\nBig Data (volume, velocity, variety) -> Data Governance (quality, compliance, metadata, stewardship, security)\n```" },
      ],
    },
  ],

  keyTerms: [
    ["Data as asset", "Data that creates business value when managed and used well."],
    ["Data as liability", "Data that creates legal/ethical/reputational risk when exposed or misused."],
    ["PII", "Personally identifiable information: needs consent and deletion criteria."],
    ["Pseudonymisation", "Reversible replacement of identifiers (reversal needs extra data)."],
    ["Connection removal", "Cutting the link between PII and model data (recommended)."],
    ["Data reliability", "Durability, consistency, versioning, performance, availability."],
    ["ETL vs ELT", "Transform before load vs load raw, then transform in the target."],
    ["Lakehouse", "Warehouse governance + lake's cheap, flexible storage."],
    ["Metadata", "Data about data."],
    ["Data governance council", "Body that sets taxonomy, roles and access policies."],
    ["Data platform", "Central suite and pipelines to ingest, store, transform and deliver data."],
    ["Lineage", "Where data came from and how it changed."],
  ],

  examTips: [
    "**PYQ Q2** (Data as an Asset strategy). Structure: *value* (inventory, quality, monetisation), *protect* (governance, security, privacy), *leverage* (platform, analytics/ML), *mitigate liability* (consent, anonymisation, retention/deletion, access control), plus a KPI and an example.",
    "Always pair **asset** with **liability**. The slides present them together, and examiners expect both sides.",
    "Remember the **three approaches** to reduce liability (access restriction → pseudonymisation → connection removal) and the **five reliability** properties.",
  ],

  theory: [
    {
      title: "Applying “Data as an Asset” to a data-management strategy",
      pyq: "Comprehensive Q2 (5 marks)",
      marks: 5,
      question:
        "How can an organization apply the concept of “Data as an Asset” to inform its data management strategy, ensuring that data is properly valued, protected, and leveraged to drive business outcomes, while also mitigating potential risks and liabilities associated with data misuse or mismanagement?",
      solution: `
**Idea:** treat data like any balance-sheet asset. It has *value* that must be measured, *owners* accountable for it, *maintenance* to keep it fit for use, and *risk* (a liability side) that must be controlled. (Netflix uses data-informed perspectives to improve its business; the same data exposed carelessly becomes a liability.)

\`\`\`flow
Value (inventory, quality, worth) -> Protect (governance, security, privacy) -> Leverage (platform, BI, ML) -> Measure business outcomes
Mitigate liability: consent -> access control -> anonymisation -> retention & deletion
\`\`\`

**1. Properly valued**
- Build a **data inventory / catalogue** with **metadata**: what data exists, where, who owns it, how sensitive it is.
- Assign **data owners and stewards** (a governance council); classify data by business criticality.
- Define **data-quality KPIs** (accuracy, completeness, timeliness) and link datasets to the business outcomes they drive (e.g. churn data → retention revenue).

**2. Properly protected**
- **Governance framework:** policies, standards, stewardship, lifecycle from creation to deletion.
- **Security:** role-based access, encryption at rest and in transit, data masking, audit logs, disaster recovery.
- **Reliability:** durability (backups), consistency across copies, **versioning** (time travel), availability SLAs.

**3. Leveraged for outcomes**
- A **data platform** (lake/warehouse/lakehouse + pipelines) that breaks silos and gives self-service access.
- Feed BI dashboards and **ML models**. Monitor ML data for *distribution changes*, since ML pipelines are more sensitive than normal pipelines.
- Track ROI: decisions improved, costs reduced, new data products.

**4. Mitigating risks and liabilities**
- **Consent and legal compliance** for PII: GDPR/DPDPA, data residency (EU data stays in the EU), industry and insurance rules.
- **Minimise exposure:**
  - access restriction (least privilege, logging)
  - **pseudonymisation / anonymisation**
  - **connection removal** between PII and model data (the recommended approach)
- **Retention and deletion policy:** delete when the user asks, when the data is no longer needed, or at a regulatory cut-off. Plan for backups and tapes too.
- Data-quality controls so bad data doesn't lead to bad decisions.

**Example:** a hospital values its EMR data (it drives readmission-prediction models), protects it (RBAC, encryption, HIPAA), leverages it (a lakehouse feeding ML), and mitigates liability (pseudonymised patient IDs in training data, audit trails, retention limits).

**Conclusion:** data creates value only when **governed**. Treating it as an asset means investing in its quality and accessibility *and* controlling its liability side.`,
    },
    {
      title: "Data as a liability: approaches to reduce risk",
      marks: 5,
      question: "Explain how data can become a liability for an organization. Describe the restrictions on data collection and the three approaches to reduce the liability of private data in ML pipelines.",
      solution: `
**How data becomes a liability:** the same data that is an asset can harm the organisation and its users when it is exposed, misused or held without permission. *Example:* medical records in a breach lead to lawsuits, regulatory fines and reputational damage. Data can also be a liability simply because it must be protected, retained correctly and deleted on time.

**Restrictions on collection**
- PII needs **explicit consent and deletion criteria**.
- Compliance depends on:
  - the **organisation's location** (employee data stored on in-country servers)
  - the **data's origin** (EU data can't leave the region)
  - **organisation policies** (confidential data)
- Questions to answer: permission to store? how stored? how is permission withdrawn? who can access, when and why?
- Sources of restriction: laws, industry practice, insurance regulations, corporate governance.

**Three approaches**
1. **Access restriction:** limit external *and* internal access, even for employees. Use granular permissions and detailed logging for traceability.
2. **Anonymisation / pseudonymisation:** replace private identifiers reversibly, where reversal needs extra data/systems. This shrinks the access/audit surface, protects against casual inspection by engineers, and **preserves properties the model needs** (e.g. a postcode from the same locality for weather prediction).
3. **Connection removal (recommended):** remove the connection between PII and model data. This reduces risk the most, since there is no trivial way back, but it is harder than it seems.

**Plus deletion:** Shift+Del doesn't truly erase data, and archives on tape are hard to purge. Delete when the user asks, when the business no longer needs it, or when regulation (GDPR) sets a cut-off.`,
    },
    {
      title: "Why ML pipelines are more data-sensitive; data reliability",
      marks: 5,
      question: "Using an example, explain why ML pipelines are more sensitive to data than traditional data pipelines. What characteristics make data reliable in a distributed environment?",
      solution: `
**Example (slide 9):** an e-commerce company predicts New Year's Eve sales by country and language. Due to an error, data for one country/language is lost. The **data pipeline keeps running normally** (it just moves fewer rows), but the **ML pipeline behaves abnormally**: predictions for that segment are wrong, hurting sales planning and reputation.

**Why:**
- A normal data pipeline is sensitive to the **volume** and **correctness** of input data.
- An ML pipeline is sensitive to **volume, correctness *and* changes in the data distribution**. The model learned a distribution. If a segment disappears or shifts, the model silently mis-predicts, with no crash and no error, just worse accuracy.

So ML needs distribution monitoring, validation and drift detection (L8), not just job success checks.

**Data reliability characteristics (slide 10):**

| Question | Characteristic |
|---|---|
| What if data is lost after some time? | **Durability** (replication, backups) |
| Do all copies return the same data? | **Consistency** |
| Can we go back to an earlier state when data changes often? | **Version control / time travel** |
| How fast is it available for accurate answers? | **Performance** |
| Is it there when needed? | **Availability** |

*(Homework in the slides: why integrity isn't listed separately. It is effectively achieved through consistency + durability + validation.)*`,
    },
    {
      title: "Components of data management: ETL vs ELT, warehouse vs lake",
      marks: 5,
      question: "Describe the four components of a data management strategy. In your answer, contrast ETL with ELT and a data warehouse with a data lake, and explain the lakehouse.",
      solution: `
**1. Data integration & processing**
- Ingest raw data from web APIs, mobile apps, IoT, forms and surveys.
- **ETL** (Extract → Transform → Load) was the historical standard for integrating datasets. **Problems:** it assumes structured data, can't keep up with velocity, and is poor for real-time flows.
- **ELT** (Extract → Load → Transform in the target) became popular thanks to cloud infrastructure and real-time needs: load raw data fast, transform later at scale.
- Data is then filtered, merged and aggregated for BI dashboards or ML.

**2. Data storage**

| | Warehouse | Lake |
|---|---|---|
| Schema | Defined (schema-on-write) | None (schema-on-read) |
| Data | Structured | Semi/unstructured + structured |
| Optimised for | High-performance analytics | Low cost, many source types |
| Use | BI, dashboards, visualisation | AI/ML, analytics at scale, sandboxes |

**Lakehouse** = lake storage + warehouse management (schema, ACID, governance).

**3. Data governance:** governance councils align taxonomies so **metadata** is consistent, and define roles and responsibilities for appropriate access.

**4. Data security:** controlled access (you shouldn't see a colleague's salary slip or another patient's report), encryption, data masking, disaster recovery. It protects against cybercrime; breaches carry financial and brand costs.`,
    },
    {
      title: "Phases of the ML data lifecycle",
      marks: 5,
      question: "With a neat diagram, explain the phases of the data lifecycle for ML (creation, ingestion, processing, post-processing). Mention the key concerns at each phase.",
      solution: `
\`\`\`flow
Creation (devices, web, curation) -> Ingestion (data lake: logs, web, curated, behavioural) -> Processing (validation, cleaning, enrichment) -> Post-processing (storage, metadata, analysis/visualisation) -> Model training & pipeline -> Models
\`\`\`

**Phase 1: Creation / generation**
- Data is generated in *someone else's* storage: serving logs, event photos, medical diagnostics. It can be structured, semi-structured or unstructured.
- *Concern:* **representativeness and freshness.** Some datasets stay valid for months; others drift (a winter-only photo set fails in summer).

**Phase 2: Ingestion**
- Receive data and write it to storage. **Filtering/selection** always occurs.
- **Sampling** saves processing and training cost but can lose detail. Measure the quality cost against the savings, since ML generally benefits from more data.
- Use APIs/RPC that deliver the right format and confirm **lineage**.
- *Concern:* **correctness and throughput.**

**Phase 3: Processing**
- **Validate** incoming data against the schema or the last known good feed.
- **Clean:** missing fields, duplicates, misclassifications, encoding errors.
- **Normalise / bucket** inconsistent values.
- **Enrich / extend:** join with other sources, add labels.
- *Concern:* bad data leads to bad models.

**Phase 4: Post-processing**
- **Store** processed data according to access patterns (model structure, team structure, training process).
- Maintain **metadata** about features, which is invaluable when many people reuse the data.
- **Visualise** meaningfully: what each record means, how it links to other datasets, and whether it is clean and safe for training.
- Then **ML training**.`,
    },
    {
      title: "Data roles and data engineering vs data architecture",
      marks: 5,
      question: "An e-commerce firm wants a personalised recommendation engine. Explain what data engineering would do, what is still missing without data architecture and governance, and which roles are involved.",
      solution: `
**Data engineering** (design → build → maintain systems to collect → transform → store data for analytics/DS/ML):
- identify data sources (clickstream, orders, catalogue); write cleaning logic; choose storage
- schedulers to collect data regularly and feed the recommendation engine
- maintenance: raise alarms on failures; handle change requests

**Missing without data architecture:** business acumen, **data models**, a holistic view and design, **orchestration**, and the overall **data platform**. Engineering without a blueprint produces point-to-point pipelines that don't scale.

**Missing without governance:** **privacy** (user behaviour is PII-adjacent), **security**, **monitoring and logging**, **lifecycle** management (retention/deletion), and quality standards.

\`\`\`flow
Data architecture (blueprint, models) -> Data engineering (pipelines, ETL/ELT, streaming) -> Data science (models) -> BI / analytics
Data governance (quality, compliance, metadata, security) spans all layers
\`\`\`

**Roles:**
- **data architect** (blueprint)
- **data engineer** (pipelines)
- **data scientist** (recommendation model)
- **data analyst / BI analyst** (EDA, KPIs such as CTR and conversion)
- **DBA** (databases)`,
    },
  ],

  quiz: [
    { q: "ML pipelines, unlike plain data pipelines, are additionally sensitive to:", options: ["Volume of data", "Correctness of data", "Changes in data distribution", "Network speed"], answer: 2, why: "Distribution shifts silently break models while data jobs still succeed." },
    { q: "Which approach to reducing the liability of private data does the slide recommend most?", options: ["Access restriction", "Pseudonymisation", "Connection removal", "Encryption only"], answer: 2, why: "Removing the link between PII and model data reduces risk the most." },
    { q: "Replacing a user's postcode with another postcode from the same locality is:", options: ["Deletion", "Pseudonymisation", "Encryption", "Connection removal"], answer: 1, why: "A reversible replacement that preserves model-relevant properties." },
    { q: "Which is NOT one of the listed data reliability characteristics?", options: ["Durability", "Consistency", "Version control", "Virality"], answer: 3, why: "They are durability, consistency, version control, performance and availability." },
    { q: "ELT became popular mainly because of:", options: ["Mainframes", "Cloud infrastructure and the need for real-time data", "XML", "Tape storage"], answer: 1, why: "Load first, transform later at scale in the cloud." },
    { q: "Schema-on-read, cheap storage for unstructured data describes a:", options: ["Data warehouse", "Data lake", "Data mart", "OLTP DB"], answer: 1, why: "Lakes store raw data of any type." },
    { q: "Who aligns taxonomies so metadata is added consistently?", options: ["DB admin", "Data governance council", "BI analyst", "Data scientist"], answer: 1, why: "A governance activity." },
    { q: "In the ML data lifecycle, validation, cleaning and enrichment happen in:", options: ["Creation", "Ingestion", "Processing", "Post-processing"], answer: 2, why: "Phase 3: processing." },
    { q: "Reliability concerns during ingestion focus on:", options: ["Cost and UI", "Correctness and throughput", "Model accuracy", "Visualisation"], answer: 1, why: "As stated on slide 29." },
    { q: "Who creates and maintains the organisation's data blueprint?", options: ["Data engineer", "Data architect", "Data analyst", "DBA"], answer: 1, why: "Architecture = blueprint." },
  ],
};
