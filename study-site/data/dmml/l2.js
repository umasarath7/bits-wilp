// DMML — Lecture 2: Concepts / Fundamentals of Data Management
// Source: CourseFiles/DMML/L2-Data Management Fundamentals.pptx (37 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Management Fundamentals",
  source: "L2-Data Management Fundamentals.pptx · 37 slides",
  overview:
    "Lecture 1 was about how data is *represented*. This one is about how an organisation *looks after* it. We'll ask: **why** is data an asset, and **when** does it turn into a liability? **Why** are ML pipelines more fragile than ordinary data pipelines? **What** does “data management” actually involve (integration, storage, governance, security)? **What** journey does data take on its way to a model? And **who** is responsible for each part? Running example: a hospital chain that wants to use patient records to predict which patients are likely to be readmitted, a case where data is hugely valuable and hugely dangerous at the same time. The asset-and-liability pair was examined directly (**PYQ Q2**).",

  summary: [
    {
      id: "asset",
      heading: "Lesson 1: Why is data called an asset?",
      slides: "3–4",
      blocks: [
        {
          type: "p",
          text: "An **asset** is something that creates value for its owner, like a factory, a brand or cash. Slide 4 asks: *can you imagine an ML system without data?* You can't. The model is only a way of extracting value from the data.",
        },
        {
          type: "p",
          text: "**The Netflix case (slide 4).** Netflix's research team says data lets them provide *“efficient and actionable data-informed perspectives that help Netflix think critically and differently about its business and ultimately improve our service”*. Which shows to commission, which thumbnail to show you, how to encode video for your connection: all driven by data. The lessons the slide draws:",
        },
        {
          type: "list",
          items: [
            "**Data is an important asset.**",
            "**For a successful business model, data is key.**",
            "**Success means transforming data into value.** Raw data sitting in a database is worth nothing until it drives a decision.",
            "**The “truthful pain”: relevant data is not easy to collect.**",
          ],
        },
        {
          type: "p",
          text: "*Hospital example:* years of admission records, test results and outcomes are an asset. They could predict which patients will be readmitted within 30 days, so doctors can follow up early.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Two myths (slide 6)",
          text: "**“More data == better.”** Not if it's irrelevant, unrepresentative, or collected without permission. More data can mean more risk and cost.\n**“This stuff is easy.”** Collecting, storing and deleting data properly is hard, as the next lesson shows.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Lesson 2: When does data become a liability?",
      slides: "5–8",
      blocks: [
        {
          type: "p",
          text: "A **liability** is something that can cost you: a debt, a legal risk. Slide 5 opens with a proverb: *“One man's food is another man's poison.”* The same data can be either, depending on circumstances. The hospital's patient records are an asset for predicting readmissions, but if they're leaked or misused, they bring **legal, ethical and reputational** damage: lawsuits, fines and lost trust.",
        },
        {
          type: "p",
          text: "**Data becomes a liability** through *exposure to unexpected nuances of the collected data*. If you don't think about how it could be exposed or misused, it can harm both the organisation and the people the data describes.",
        },
        {
          type: "p",
          text: "**Restrictions on collection (slide 6).** Anything that identifies a person, **PII (Personally Identifiable Information)** such as name, phone or Aadhaar number, legally needs **explicit consent plus deletion criteria**. (That's the checkbox you tick when applying for a loan or credit card.) What you must comply with depends on:",
        },
        {
          type: "list",
          items: [
            "**Where the organisation is** (an employer may have to store employees' data on servers in its own country).",
            "**Where the data came from** (EU citizens' data cannot leave the EU).",
            "**Organisation policies** (confidential company data).",
          ],
        },
        {
          type: "p",
          text: "The **sources of these restrictions** are governing laws, industry practices, insurance regulations and corporate governance policies. And you must answer practical questions: how is permission stored, how can it be withdrawn, who can access the data, when, and why?",
        },
        {
          type: "p",
          text: "**Three ways to reduce the liability (slide 7)**, from least to most protective:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Access restriction.** Restrict access to private data even for employees, external and internal. If someone needs access, grant **granular** permissions and keep **detailed logs** so every access can be traced. *Hospital:* only the treating doctor sees the full record.",
            "**Anonymisation / pseudonymisation.** Replace private identifiers with substitutes **in a reversible way**, where reversing needs access to additional data or systems. This protects data from *casual inspection* by engineers working on the pipeline, while **preserving the properties the model needs**. The slide's example: for weather prediction, replace a postcode with a **different postcode from the same locality**. *Hospital:* replace patient names with random IDs; keep age band and district.",
            "**Connection removal (recommended).** Remove the link between the private data (PII) and the model data altogether. This **reduces risk the most**, but it's **harder than it seems**, and doing it without destroying value can be difficult.",
          ],
        },
        { type: "diagram", name: "d2-liability" },
        {
          type: "p",
          text: "**Deletion is harder than it sounds (slide 8).** Pressing Shift+Del doesn't erase the bytes; recovery software can often restore them. Archived copies on tape are even harder to purge. When should data be deleted? **When the user asks** (for a specific period), **when the organisation no longer needs it** (job portals that keep your profile for only 6 months), or **when governing policy sets a cut-off**, such as the EU's **GDPR** (General Data Protection Regulation).",
        },
      ],
    },
    {
      id: "sensitive",
      heading: "Lesson 3: Why are ML pipelines more sensitive than ordinary data pipelines?",
      slides: "9–10",
      blocks: [
        {
          type: "callout",
          kind: "example",
          title: "Slide 9's scenario",
          text: "An e-commerce company wants to predict **New Year's Eve sales** for every country, region and language, and study trends by language. Due to a technical or human error, it **loses the data from one country**. The **data pipeline keeps running normally**, but the **ML pipeline behaves very differently**. Why?",
        },
        {
          type: "p",
          text: "Because a data pipeline doesn't *predict* anything. It moves and transforms whatever arrives, so fewer rows still flow through “successfully”. An ML pipeline includes a **model that has learnt what the data normally looks like**. Remove a country and the **distribution** of the data changes: the model's predictions for that region, and even the totals, go wrong. Nothing crashes; the answers are just silently worse, which hurts sales and reputation.",
        },
        {
          type: "table",
          head: ["Pipeline type", "Sensitive to"],
          rows: [
            ["Normal data pipeline", "**Volume** of input data; **correctness** of input data"],
            ["ML pipeline", "Volume and correctness, **plus changes in the data's distribution** (which regions, languages or customer types are represented, and in what proportions)"],
          ],
        },
        {
          type: "p",
          text: "**Data reliability (slide 10).** Because ML is so sensitive, the data systems underneath must be reliable. The slides list five minimum properties for data in distributed systems:",
        },
        {
          type: "list",
          items: [
            "**Durability:** once written, data isn't lost (even if a disk or server fails).",
            "**Consistency:** everyone reading the data sees the same, correct version.",
            "**Version control:** you can go back to the data as it was at an earlier time (“time travel”), essential for reproducing how a model was trained.",
            "**Performance:** data can be read and written fast enough for the workload.",
            "**Availability:** the data can be reached when it's needed.",
          ],
        },
      ],
    },
    {
      id: "dm",
      heading: "Lesson 4: What does data management actually involve?",
      slides: "11–20",
      blocks: [
        {
          type: "p",
          text: "**Why now? (slides 11–12).** An IBM study found **72% of top-performing CEOs** believe competitive advantage depends on having the most advanced generative AI. But to exploit AI, an organisation first needs its **information architecture** in order: data that's accessible and usable. The typical obstacles: huge **volume**; **silos** across locations and clouds; many **types and formats**; and **complex, inconsistent** datasets.",
        },
        {
          type: "p",
          text: "Data management has **four components**. Think of them as the four jobs the hospital must do before its readmission model can exist:",
        },
        { type: "p", text: "#### I. Integration and processing: getting data in and into shape" },
        {
          type: "p",
          text: "Step one is **ingesting raw data** from its sources: web APIs, apps, IoT devices, forms, surveys. The traditional method is **ETL (Extract → Transform → Load)**: pull the data out, clean and reshape it on a separate server, then load it into the target. ETL struggles with **unstructured data**, **high velocity** and **real-time** flows, so **ELT (Extract → Load → Transform)** emerged with the cloud: load the raw data first, then transform it inside the powerful target system. Processing then **filters, merges and aggregates** the data for BI (Business Intelligence) dashboards or ML.",
        },
        { type: "p", text: "#### II. Storage: where the data lives" },
        {
          type: "table",
          head: ["", "Data warehouse", "Data lake", "Data lakehouse"],
          rows: [
            ["Schema", "**Defined** in advance (schema-on-write)", "**None** needed (schema-on-read)", "Open formats with a table layer on top"],
            ["Data", "Structured", "Structured, semi-structured and unstructured", "All types"],
            ["Built on", "RDBMS (relational database)", "Cheap object storage", "Lake storage + warehouse features"],
            ["Good for", "High-performance analytics, BI dashboards", "AI/ML, analytics at scale, data-science sandboxes", "Both, from one copy of the data"],
            ["Cost", "Higher", "Cost-optimised", "Low storage cost, warehouse-like reliability"],
          ],
        },
        { type: "p", text: "#### III. Governance: agreeing on meaning and responsibility" },
        {
          type: "p",
          text: "**Data governance councils** align the organisation's **taxonomies** (what we call things), so that **metadata**, i.e. *data about data* (what a column means, where it came from, who owns it), is consistent across teams. They also define **roles and responsibilities** so access is appropriate. *Hospital:* everyone agrees what “readmission” means (within 30 days? any reason?), and who owns the definition.",
        },
        { type: "p", text: "#### IV. Security: guarding the data" },
        {
          type: "p",
          text: "Guardrails against **unauthorised access, corruption and theft**: **controlled access** (the slide asks: *can you see a colleague's salary slip?* You shouldn't be able to); **encryption** (unreadable without a key); **data masking** (show XXXX-1234 instead of a full card number); and **disaster recovery** (backups and failover).",
        },
        { type: "diagram", name: "d2-components" },
      ],
    },
    {
      id: "platform",
      heading: "Lesson 5: How do organisations put it all together? The data platform and framework",
      slides: "21–24",
      blocks: [
        {
          type: "p",
          text: "**A data platform (slides 21–22)** is the practical home for all of the above: *a software suite, a central repository and a collection of pipelines that ingest, store, transform and deliver data to different groups in the enterprise*. To serve many teams at once it needs fast query processing, large storage, elastic compute, in-memory caches, massively parallel processing, columnar storage and compute clusters.",
        },
        {
          type: "p",
          text: "**The data-management framework (slides 23–24)** is a checklist of the areas an organisation must cover, often drawn as a wheel (based on DAMA's DMBOK, the Data Management Body of Knowledge) with **governance at the centre** supporting everything else:",
        },
        {
          type: "table",
          head: ["Area", "What it ensures"],
          rows: [
            ["**Data governance** (centre)", "Overarching support: stewardship, policies, processes, standards, best practices"],
            ["Data architecture", "The infrastructure for storing, integrating and using data"],
            ["Metadata", "Critical information about data attributes, so data can be found and used efficiently"],
            ["Data quality", "Data fit for business needs"],
            ["Data lifecycle", "Integrity from the moment data enters the company until its final deletion"],
            ["Analytics", "Statistical and visual techniques to get insights"],
            ["Data privacy", "Safe sharing, internally and externally"],
          ],
        },
      ],
    },
    {
      id: "lifecycle",
      heading: "Lesson 6: What journey does data take on its way to a model?",
      slides: "25–31",
      blocks: [
        {
          type: "p",
          text: "Slides 25–31 describe the **ML data lifecycle** in four phases. Follow one patient record through the hospital's system:",
        },
        {
          type: "p",
          text: "```flow\nPhase 1: Creation (devices, web, curation) -> Phase 2: Ingestion (into the data lake) -> Phase 3: Processing (validate, clean, enrich) -> Phase 4: Post-processing (store, manage, analyse, visualise) -> Model training\n```",
        },
        {
          type: "p",
          text: "**Phase 1: Creation / generation.** Data is generated or captured **somewhere else** first: a lab machine records a blood test, a nurse types notes, a monitor streams heart rate. Other examples from the slides: serving logs, photos from events, medical diagnostics. Some datasets can stay **static** for months (a photo-recognition set, if it's representative). Others must be **refreshed**: a model trained only on winter photos will see a **distribution shift** in summer.",
        },
        {
          type: "p",
          text: "**Phase 2: Ingestion.** Receive the data and write it to storage. Two practical points: **filtering/selection always happens** (you never keep literally everything); and **sampling** saves cost but loses detail. Measure the quality cost against the savings, because *more relevant data usually helps ML*. Use APIs or RPCs (Remote Procedure Calls) that confirm **lineage**: where each record came from. Reliability concerns here: **correctness and throughput**.",
        },
        {
          type: "p",
          text: "**Phase 3: Processing.** Make the data fit for training: **validate** it (against the schema, or against the last known good feed), **clean** it (missing fields, duplicates, misclassified records, encoding errors), **normalise or bucket** values (ages → age bands), and **enrich and extend** it (join with other sources, add labels such as “readmitted within 30 days: yes/no”).",
        },
        {
          type: "p",
          text: "**Phase 4: Post-processing.** **Store** the processed data in a form that suits how it will be accessed (which depends on the model's structure, the team and the training process). Record **metadata** about the stored features, which is enormously valuable later. **Visualise** it so people can understand what each record means, how it links to other datasets, and whether it's clean and safe to train on. Then it's ready for **ML**.",
        },
      ],
    },
    {
      id: "roles",
      heading: "Lesson 7: Who does what? Data roles and how they connect",
      slides: "32–37",
      blocks: [
        {
          type: "table",
          caption: "Data roles (slides 32–34)",
          head: ["Role", "What they do"],
          rows: [
            ["**Data analyst**", "Collect and clean data, explore it, produce reports"],
            ["**Data engineer**", "Manage database systems; build and maintain **data pipelines**"],
            ["**Data scientist**", "Build statistical and ML models; find deep insights"],
            ["**Data architect**", "Design and maintain the organisation's **data blueprint** and systems"],
            ["**Database administrator**", "Install and manage database systems on the infrastructure"],
            ["**BI analyst**", "Turn data into business insights and reports"],
          ],
        },
        {
          type: "p",
          text: "**Data engineering** is *designing, building and maintaining systems that collect, transform and store data for analytics, data science and ML*. It's the plumbing.",
        },
        {
          type: "p",
          text: "**Connecting the dots: the recommendation-engine case study (slides 35–37).** A team builds a product-recommendation engine. The data engineering part covers **data sources, cleaning logic, storage, schedulers, alarms and change requests**. But the case study asks: what's **missing**? Two whole layers:",
        },
        {
          type: "list",
          items: [
            "**Data architecture:** business acumen, data models, a holistic design, orchestration, the platform. The **blueprint** that engineering builds to.",
            "**Data governance:** privacy, security, monitoring and logging, lifecycle management. The **rules** that keep the data trustworthy and legal.",
          ],
        },
        {
          type: "p",
          text: "```flow\nData Architecture (blueprints, standards, models) -> Data Engineering (pipelines, ETL/ELT, APIs, streaming, orchestration)\nBig Data (volume, velocity, variety) -> Data Governance (quality, compliance, metadata, stewardship, security)\n```",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in six lines",
          text: "1. Data is an **asset** (Netflix: data → value), but relevant data is hard to collect. Myths: more data == better; this stuff is easy.\n2. Data is a **liability** when exposed or misused. PII needs consent and deletion criteria. Reduce risk by access restriction → pseudonymisation → connection removal (recommended). Deletion is hard (tapes, GDPR).\n3. Data pipelines care about volume and correctness; **ML pipelines also care about distribution**. Reliability = durability, consistency, versioning, performance, availability.\n4. Four components: **integration** (ETL → ELT), **storage** (warehouse / lake / lakehouse), **governance** (metadata, roles), **security** (access, encryption, masking, recovery).\n5. Lifecycle: creation → ingestion → processing → post-processing → model.\n6. Roles: analyst, engineer, scientist, architect, DBA, BI analyst. Engineering needs architecture (blueprint) and governance (rules) to be complete.",
        },
      ],
    },
  ],

  recap: [
    {
      "type": "callout",
      "kind": "idea",
      "title": "In one line",
      "text": "Data is an **asset** when managed well and a **liability** when exposed or misused. Manage both sides."
    },
    {
      "type": "list",
      "items": [
        "**Asset:** data → value (Netflix). Relevant data is hard to collect.",
        "**Liability:** leaks, misuse, no consent → legal, ethical, reputational harm. PII needs **consent + deletion criteria**.",
        "**Myths:** “more data == better”, “this stuff is easy”."
      ]
    },
    {
      "type": "diagram",
      "name": "d2-liability",
      "caption": "Reduce liability: restrict → pseudonymise → remove the link."
    },
    {
      "type": "list",
      "items": [
        "**ML pipelines** break on **distribution** changes, not just volume or correctness (lost-country example).",
        "**Reliability:** durability · consistency · versioning (time travel) · performance · availability."
      ]
    },
    {
      "type": "diagram",
      "name": "d2-components",
      "caption": "Four components around the data."
    },
    {
      "type": "table",
      "head": [
        "Component",
        "Key words"
      ],
      "rows": [
        [
          "Integration",
          "ETL → ELT; filter, merge, aggregate"
        ],
        [
          "Storage",
          "warehouse (schema) · lake (raw, cheap) · lakehouse (both)"
        ],
        [
          "Governance",
          "councils, metadata, taxonomy, roles"
        ],
        [
          "Security",
          "access control, encryption, masking, disaster recovery"
        ]
      ]
    },
    {
      "type": "p",
      "text": "**Lifecycle:** creation → ingestion → processing (validate, clean, enrich) → post-processing (store, metadata, visualise) → ML. **Roles:** analyst, engineer, scientist, architect, DBA, BI analyst."
    },
    {
      "type": "callout",
      "kind": "exam",
      "title": "Exam hook",
      "text": "**PYQ Q2:** value → protect → leverage → mitigate liability → KPI → example (hospital or bank)."
    }
  ],

  glossary: [
    ["Asset", "—", "Something that creates value (data → decisions → value)"],
    ["Liability", "—", "Something that creates risk or cost (leaks, misuse, fines)"],
    ["PII", "Personally Identifiable Information", "Data that identifies a person: name, phone, Aadhaar, address"],
    ["Consent", "—", "The person's explicit permission to collect and use their data"],
    ["Pseudonymisation", "—", "Replacing identifiers reversibly; reversal needs extra data"],
    ["Anonymisation", "—", "Removing identifying information so people can't be identified"],
    ["Connection removal", "—", "Cutting the link between PII and model data (recommended)"],
    ["GDPR", "General Data Protection Regulation", "EU law on personal data, including deletion rights"],
    ["Data distribution", "—", "What the data looks like overall: which groups, in what proportions"],
    ["Durability / consistency / availability", "—", "Data isn't lost / everyone sees the same version / data is reachable when needed"],
    ["Version control (time travel)", "—", "Being able to see data as it was at an earlier time"],
    ["ETL", "Extract, Transform, Load", "Transform before loading into the target"],
    ["ELT", "Extract, Load, Transform", "Load raw data first, transform inside the target"],
    ["BI", "Business Intelligence", "Dashboards and reports for decision-makers"],
    ["Data warehouse", "—", "Schema-defined store for structured analytics"],
    ["Data lake", "—", "Cheap store for raw data of any type, no schema needed"],
    ["Data lakehouse", "—", "Lake storage with warehouse-style management"],
    ["RDBMS", "Relational DataBase Management System", "Software for relational databases"],
    ["Metadata", "—", "Data about data: meaning, origin, owner, format"],
    ["Taxonomy", "—", "An agreed classification and naming scheme"],
    ["Data governance council", "—", "Group that sets data definitions, roles and access policies"],
    ["Data masking", "—", "Hiding parts of sensitive values (XXXX-1234)"],
    ["Data platform", "—", "Central suite, repository and pipelines serving the whole enterprise"],
    ["DAMA / DMBOK", "Data Management Association / Data Management Body of Knowledge", "The standard data-management framework"],
    ["Lineage", "—", "Where data came from and how it changed along the way"],
    ["RPC / API", "Remote Procedure Call / Application Programming Interface", "Ways for systems to call each other"],
    ["Distribution shift", "—", "When new data looks different from the training data"],
    ["DBA", "Database Administrator", "Installs and manages database systems"],
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
### What the examiner wants
The question has **four verbs** (value, protect, leverage, mitigate liability) and the marks follow them. Give each its own heading with concrete actions, then add a KPI and a real example (Lessons 1–2, 4). Mentioning the asset/liability duality shows you understand the lecture's framing.

### Model answer
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

**Conclusion:** data creates value only when **governed**. Treating it as an asset means investing in its quality and accessibility *and* controlling its liability side.

### Takeaway
Asset and liability are two sides of the same data: a good strategy **creates value** (inventory, quality, platform, ML) and **limits risk** (consent, pseudonymisation, access control, deletion) at the same time.`,
    },
    {
      title: "Data as a liability: approaches to reduce risk",
      marks: 5,
      question: "Explain how data can become a liability for an organization. Describe the restrictions on data collection and the three approaches to reduce the liability of private data in ML pipelines.",
      solution: `
### What the examiner wants
How data becomes a liability (with an example), the collection restrictions (PII consent, location rules), the **three approaches in order** with pros and cons, and why deletion is hard (Lesson 2).

### Model answer
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

**Plus deletion:** Shift+Del doesn't truly erase data, and archives on tape are hard to purge. Delete when the user asks, when the business no longer needs it, or when regulation (GDPR) sets a cut-off.

### Takeaway
Access restriction → pseudonymisation → connection removal: each step protects more but is harder to do. Deletion must be planned, not assumed.`,
    },
    {
      title: "Why ML pipelines are more data-sensitive; data reliability",
      marks: 5,
      question: "Using an example, explain why ML pipelines are more sensitive to data than traditional data pipelines. What characteristics make data reliable in a distributed environment?",
      solution: `
### What the examiner wants
Use the slide's New Year's Eve sales scenario to show *why* (data pipelines only care about volume and correctness; ML also depends on distribution), then list the five reliability properties with one line each (Lesson 3).

### Model answer
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

*(Homework in the slides: why integrity isn't listed separately. It is effectively achieved through consistency + durability + validation.)*

### Takeaway
A data pipeline fails loudly; an ML pipeline fails **silently** when the distribution shifts. That's why reliability and monitoring matter more for ML.`,
    },
    {
      title: "Components of data management: ETL vs ELT, warehouse vs lake",
      marks: 5,
      question: "Describe the four components of a data management strategy. In your answer, contrast ETL with ELT and a data warehouse with a data lake, and explain the lakehouse.",
      solution: `
### What the examiner wants
All four components named and explained, with the two comparisons asked for (ETL vs ELT; warehouse vs lake, plus lakehouse) set out in tables (Lesson 4).

### Model answer
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

**4. Data security:** controlled access (you shouldn't see a colleague's salary slip or another patient's report), encryption, data masking, disaster recovery. It protects against cybercrime; breaches carry financial and brand costs.

### Takeaway
Integration, storage, governance, security. ELT and lakes exist because data became bigger, faster and less structured.`,
    },
    {
      title: "Phases of the ML data lifecycle",
      marks: 5,
      question: "With a neat diagram, explain the phases of the data lifecycle for ML (creation, ingestion, processing, post-processing). Mention the key concerns at each phase.",
      solution: `
### What the examiner wants
The four phases in order with a diagram, the key concerns in each (refresh vs static, sampling, lineage, validate/clean/enrich, metadata and visualisation), and one running example (Lesson 6).

### Model answer
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
- Then **ML training**.

### Takeaway
Creation → ingestion → processing → post-processing. Most model problems can be traced back to a skipped check in one of these phases.`,
    },
    {
      title: "Data roles and data engineering vs data architecture",
      marks: 5,
      question: "An e-commerce firm wants a personalised recommendation engine. Explain what data engineering would do, what is still missing without data architecture and governance, and which roles are involved.",
      solution: `
### What the examiner wants
The main roles in a table, a definition of data engineering, and the recommendation-engine case study showing what architecture and governance add (Lesson 7).

### Model answer
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
- **DBA** (databases)

### Takeaway
Engineering builds the pipes, architecture draws the blueprint, governance sets the rules. A data system needs all three.`,
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
