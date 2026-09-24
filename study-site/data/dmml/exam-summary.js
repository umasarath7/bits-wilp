// DMML — Exam summary: a last-minute revision sheet for the comprehensive exam (Lectures 1–8).
// Built from the lecture notes and the previous comprehensive paper. Notes-only page (no questions).

export default {
  title: "DMML Exam Summary",
  source: "Lectures 1–8 + previous comprehensive paper · read in about 25 minutes",
  overview:
    "Read this the night before and on the morning of the exam. The DMML comprehensive is **pure theory**: six 5-mark questions, roughly **one per lecture**, and every one asks you to **apply** a concept to a scenario. This page gives you, for each lecture, the **definitions, lists and diagram** you must be able to reproduce, plus the **example** that makes an answer concrete. Section 1 tells you how to write; sections L1–L8 tell you what to write; sections 2–3 are the traps to avoid and a final checklist.",

  summary: [
    {
      id: "paper",
      heading: "1. What the paper looks like, and how to answer",
      slides: "",
      blocks: [
        {
          type: "table",
          caption: "Previous comprehensive: 6 × 5 marks",
          head: ["Q", "Asked", "Lecture", "Style"],
          rows: [
            ["1", "How graph data models influence query languages + example", "L1", "Mechanism + example"],
            ["2", "Apply “data as an asset” to a data-management strategy", "L2", "Strategy"],
            ["3", "Architecture by centralisation for a global organisation", "L3", "Design with trade-offs"],
            ["4", "Traditional vs Modern Data Stack", "L4", "Compare"],
            ["5", "Data engineering pipeline, with a diagram", "L6", "Describe with diagram"],
            ["6", "Selection bias with examples", "L8", "Describe with examples"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Not asked last time, so prepare them well",
          text: "**L5** (storage types, consistency, reverse ETL, the ML infrastructure stack, CI/CD/CT, DoorDash) and **L7** (source types, data contracts, CDC, streaming ingestion concerns). Also likely: **Lambda vs Kappa**, **leakage and drift**, **deployment strategies**.",
        },
        {
          type: "p",
          text: "```flow\n1. Define / set context -> 2. Key concepts (4–6 points) -> 3. Diagram or comparison table -> 4. Apply to the scenario + real example -> 5. Trade-offs + one-line conclusion\n```",
        },
        {
          type: "table",
          caption: "Decode the verb",
          head: ["If the question says…", "Write…"],
          rows: [
            ["**Compare / differentiate**", "A table with 6–8 rows, then a one-line verdict"],
            ["**…with a (suitable) diagram**", "A labelled box-and-arrow diagram **first**, then explain each box. No diagram = lost marks"],
            ["**…with examples**", "Definition → sub-types → 2–3 concrete examples → impact"],
            ["**How would you apply / design…**", "Options → evaluate against **every** criterion named → recommendation → why"],
            ["**How can an organisation…**", "Strategy: goals → controls → risks and mitigation → KPI → example"],
          ],
        },
        {
          type: "p",
          text: "**Time:** about 15–18 minutes per answer: 2 to plan headings and the diagram, 12 to write, 2 for the example and conclusion. Make each criterion in the question a **visible sub-heading**.",
        },
      ],
    },
    {
      id: "l1",
      heading: "L1. Data representations",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Data management** = ingesting, processing, securing, storing data → strategic decisions → better outcomes. ML depends on it for **structure, performance, accuracy, reliability**.",
            "**Formats:** structured (fixed schema) / semi-structured (flexible tags: JSON, email) / unstructured (images, audio).",
            "**Data models:** relational (tables, SQL, normalise 1NF→BCNF) · hierarchical (tree, DL/I) · **graph** (nodes + edges, relationships first, **Cypher/Gremlin**, fast multi-hop) · document (JSON, MongoDB) · key-value (Redis, fastest, key only).",
            "**Declarative** (what; optimiser decides; parallel; SQL) vs **imperative** (how, step by step). Car-and-bag analogy.",
            "**Row store** → writes, OLTP. **Column store** (Parquet, Redshift) → reads, OLAP, ML training.",
            "**Serialization:** text (CSV, XML, JSON) vs binary (Protobuf, Avro, BSON, JSONB); same schema both sides.",
            "**OLTP** (record, fast writes: GPay payment) vs **OLAP** (analyse, fast reads). Roll-up, drill-down, slice/dice, pivot. EU-tax drill-down story.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Signature example (PYQ Q1)",
          text: "Fraud ring in a bank: `MATCH (f:Account {flagged:true})-[:USES|TRANSFERS_TO*1..3]-(s) RETURN s`. One line in Cypher; three or more self-JOINs in SQL, with cost growing per hop.",
        },
      ],
    },
    {
      id: "l2",
      heading: "L2. Data management fundamentals",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Asset:** data → value (Netflix). Truthful pain: relevant data is hard to collect. Myths: more data == better; this stuff is easy.",
            "**Liability:** exposure/misuse → legal, ethical, reputational harm. PII needs **consent + deletion criteria**; location rules (EU data stays in EU).",
            "**Reduce liability:** (1) access restriction + logging → (2) pseudonymisation (reversible; keep useful properties, e.g. a postcode from the same locality) → (3) **connection removal** (recommended, hardest). Deletion is hard (Shift+Del, tapes; GDPR).",
            "**ML pipelines are sensitive to distribution**, not just volume/correctness (lost-country New Year sales example). **Reliability:** durability, consistency, versioning (time travel), performance, availability.",
            "**Four components:** integration (ETL → ELT), storage (warehouse / lake / lakehouse), governance (councils, metadata, roles), security (access, encryption, masking, disaster recovery).",
            "**Lifecycle:** creation → ingestion → processing (validate, clean, enrich) → post-processing (store, metadata, visualise) → ML.",
            "**Roles:** analyst, engineer, scientist, architect, DBA, BI analyst. Engineering needs architecture (blueprint) + governance (rules).",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PYQ Q2 skeleton",
          text: "**Value** (inventory, quality, monetise, ML) → **Protect** (governance, security, privacy) → **Leverage** (platform, self-service, analytics) → **Mitigate liability** (consent, pseudonymise, least access, retention/deletion) → **KPI** (e.g. % of datasets catalogued with owners) → example (a hospital or bank).",
        },
      ],
    },
    {
      id: "l3",
      heading: "L3. Data architectures",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Architecture** = blueprint; *flexible, reversible decisions through trade-offs* (Reis & Housley). Operational (what) vs technical (how).",
            "**Centralised** (one control point; governance and consistency; bottleneck; banks, hospitals) · **decentralised** (BU silos; autonomy; duplication; insurance) · **hybrid** (domains + golden sources; telecom).",
            "**Warehouse:** facts (measures) + dimensions (context). **Star** = denormalised, fast. **Snowflake** = normalised, compact, more joins. **Mart** = department subset.",
            "**Lake:** ELT, cheap, any data; risk of **swamp, dark data, WORN**. **Lakehouse:** lake + warehouse management + ACID.",
            "**Mesh** (organisational): domain ownership, data as a product, self-serve platform, federated governance. **Fabric** (technical): one integration layer (APIs, CDC, virtualisation).",
            "**Lambda:** batch (cold) + speed (hot) + serving; two codebases. **Kappa:** one stream, replay the log. Bank-fraud motivation.",
            "**Big data:** 5 Vs; sources → storage/ingestion → batch/stream → analytical store → reporting, with orchestration.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PYQ Q3 skeleton (global organisation)",
          text: "Three options → compare on **integration, security, performance** (a table) → recommend **hybrid**: central governance, MDM and group reporting + regional stores for **data residency** and local speed → diagram → risks (coordination) → conclusion.",
        },
      ],
    },
    {
      id: "l4",
      heading: "L4. Pipelines & the modern data stack",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Why pipelines:** IMD's thousands of stations; handle the 5 Vs maintainably.",
            "**Three modes of data flow:** via **database** (backward = new reads old; forward = old reads new; rolling upgrades need both; preserve unknown fields; data outlives code) · via **services** (REST philosophy, SOAP/WSDL, RPC's flawed location transparency, gRPC; SOA vs microservices) · via **message brokers** (buffer, redeliver, decouple, fan-out; async).",
            "**TDS problems:** long turnaround, expensive manual insights, slow response (weeks per update).",
            "**MDS:** cloud-native, elastic, automated ingestion, modular, real-time, pay-as-you-go, self-service. Layers: ingestion (Fivetran, Kafka) → storage (Snowflake, BigQuery, lakehouse) → transformation (dbt) → BI (Looker) → catalogue/governance.",
            "**Pipeline** = pull → transform → push. Challenges: always under construction; broken by **data drift**; tied to platforms.",
            "**Components:** origin, destination, dataflow, storage, processing, workflow, monitoring. **ETL** (governed, legacy, regulatory) vs **ELT** (cloud, ML). Batch vs stream. **CDC**. Beam: batch = bounded stream.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PYQ Q4 table rows to reproduce",
          text: "Infrastructure (on-prem vs cloud-native) · scalability (manual vs elastic) · integration (custom vs automated connectors) · flexibility (monolithic vs modular) · analytics (batch vs real-time) · cost (upfront vs pay-as-you-go) · transformation (ETL vs ELT/dbt) · users (IT-dependent vs self-service).",
        },
      ],
    },
    {
      id: "l5",
      heading: "L5. Modern data infrastructure & DataOps (not asked last time)",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Lifecycle:** source → ingestion → transformation → serving (analytics, ML, reverse ETL), storage underneath. Drivers: cloud, cheap storage, columnar DBs.",
            "**Orchestration:** schedule and manage dependencies (Airflow; Kubeflow for ML). Model data in SQL with **dbt**.",
            "**Consistency:** strong (latest value, slower: bank balance) vs eventual (fast, maybe stale: like counts).",
            "**Storage:** file (tree; NAS, EFS) · block (fixed blocks; DBs, EBS, RAID) · **object** (immutable, key; S3; lakes) · cache (Redis) · HDFS (3× replication, NameNode) · streaming (Kafka retention + replay).",
            "**Reverse ETL:** scores back into the CRM (lead scoring). Analytics: business / operational / embedded. Serving: files, OLAP DBs, streams, **query federation** (Trino), notebooks.",
            "**ML stack (bottom → top):** warehouse → compute → scheduler → architecture → versioning → model ops → feature engineering → model development (the smallest part).",
            "**Automation:** IaC (Terraform), GitOps, retries with back-off, schema-change detection, self-healing. **DataOps** = DevOps + agile for data. Security: at rest (encrypt medium), in transit (TLS), in use (RBAC).",
            "**Experiment → CI** (tests + retrain + registry) **→ CD** (canary + A/B) **→ CT** (recurring retraining). Observability prevents data downtime.",
            "**DoorDash:** feature store, real-time + historical aggregators, prediction logs, single-writer model store, A/B-capable prediction service.",
          ],
        },
      ],
    },
    {
      id: "l6",
      heading: "L6. ML lifecycle & workflow",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Lifecycle:** business goal (most important) → framing (ask if ML is needed) → data → model → deploy → monitor, with **feedback loops**.",
            "**Components:** online/offline feature store, model registry, performance and drift feedback loops, alarm manager, scheduler, lineage tracker.",
            "**Data prep:** clean, **dedupe before splitting** (leakage), scale, balance, augment; feature creation, transformation, extraction (PCA), selection.",
            "**Drift:** data drift (inputs change) vs concept drift (input→target changes). **Deploy:** blue/green, canary, A/B, shadow.",
            "**Three levels:** Data, Model, Code.",
            "**Packaging:** ONNX, PMML, PFA, pickle. **Patterns:** forecast, web service, online learning, AutoML. **Serving:** as-service, as-dependency, precompute, on-demand, **federated**. Docker + Kubernetes or serverless.",
            "**MLOps:** DataOps → ModelOps → DevOps + feedback. Failures: Twitter (finding data), Airbnb (too complex), Booking.com (wrong KPIs), Pinterest (duplicated models).",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PYQ Q5 diagram (draw it first)",
          text: "```flow\nData ingestion (sources, provenance, backup, privacy, metadata, set test set aside) -> Exploration & validation (profiling, rules, missing ratio, correlations) -> Data wrangling (reusable scripts, outliers, imputation, restructure) -> Data splitting (train / validation / test)\n```",
        },
      ],
    },
    {
      id: "l7",
      heading: "L7. Data collection & ingestion (not asked last time)",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Netflix exercise:** classify sources by consumption (batch/real-time), type, raw vs derived, internal vs external.",
            "**Other axes:** creation (analog → digital) · 1st/2nd/3rd-party · creator (user-entered = messy; system logs = noisy; user behaviour = privacy-regulated) · format.",
            "**Source DBs:** relational (history is hard) · key-value · document (flexible schema: blessing and curse; no joins) · wide-column (one row-key index) · search · time-series.",
            "**Other sources:** REST, GraphQL (many models, one request), **webhooks** (provider calls you), gRPC, data sharing, third-party data, queues (delete after ack) vs **streams** (retained, replayable; topics, partitions, partition keys).",
            "**Ingestion** = consume → light clean → land. ~90% of time goes on break-fix from data drift.",
            "**Trust:** **data contract** (what, how, how often, who) · lineage · governance (GDPR, HIPAA, PCI-DSS, DPDPA).",
            "**Batch:** time vs size cut; full snapshot vs incremental; avoid many small inserts in columnar stores; migrate in bulk.",
            "**Streaming concerns:** schema evolution (registry) · late data (watermark) · duplicates/order (idempotency) · replay · size · TTL · **dead-letter queue** · push vs pull.",
            "**CDC:** batch (updated_at; misses intermediate changes) vs log-based (Debezium → Kafka); use a read replica.",
          ],
        },
      ],
    },
    {
      id: "l8",
      heading: "L8. Data profiling & validation",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**10 quality dimensions** (hospital examples): accuracy, completeness, consistency, timeliness, validity, uniqueness, integrity, lineage, reliability, accessibility.",
            "**For ML also:** informative, coverage, reflects real inputs, unbiased, no feedback loop, consistent labels, big enough.",
            "**Biases:** omitted variable, sponsorship, stereotype, systematic distortion, experimenter, labelling, reporting, automation, **selection**, group attribution, implicit, confirmation.",
            "**Leakage:** target is a function of a feature (GDP = population × per-capita), a feature hides the target (“M18-25”), a feature from the future (late-payment reminders).",
            "**Drift:** schema skew, distribution skew, **concept drift**, training-serving skew (share feature code). **PSI** = Σ(A − E) ln(A/E): < 0.1 stable, 0.1–0.25 moderate, > 0.25 significant. KL divergence per feature.",
            "**Profiling** (single- and multi-field, at project start) vs **validation** (before each training run; actionable, high precision). Tools: Great Expectations, Soda, Deequ; shift left to ingestion; pre-ingestion vs pre-training checks.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PYQ Q6 skeleton (selection bias)",
          text: "Definition (unrepresentative data chosen because it's easy, convenient or cheap) → **coverage** (only our buyers surveyed) → **non-response** (competitor buyers 80% more likely to refuse) → **sampling** (first 200 email replies) → ML impact (looks good in testing, fails on the real population) → detect (compare with population statistics, skew checks) → mitigate (define the population, stratified random sampling, follow up non-responders, reweight) → contrast with reporting bias.",
        },
      ],
    },
    {
      id: "traps",
      heading: "2. Traps that cost marks",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Skipping a clause.** If the question lists integration, security and performance, each needs its own heading.",
            "**No diagram when the question asks for one.** Draw boxes and arrows, even rough ones.",
            "**Definitions only.** Every PYQ said *apply / design / how can*. Tie each point to the scenario.",
            "**Mixing up pairs:** backward vs forward compatibility; data drift vs concept drift; mesh (organisational) vs fabric (technical); Lambda (two paths) vs Kappa (one stream); ETL vs ELT; star vs snowflake.",
            "**Forgetting the liability side** of “data as an asset”.",
            "**No example.** Use the slides' own: Netflix, DoorDash, IMD, Airbnb, Booking.com, Pinterest, the EU-tax drill-down, the hospital quality examples, the product survey.",
          ],
        },
      ],
    },
    {
      id: "checklist",
      heading: "3. Final 5-minute checklist",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "remember",
          title: "Can you, without looking…",
          text: "1. Compare the five data models, and write one Cypher query?\n2. List the three ways to reduce data liability, in order?\n3. Draw Lambda and Kappa, and compare centralised / decentralised / hybrid?\n4. Reproduce the TDS vs MDS table (8 rows)?\n5. Compare file, block and object storage, and draw experiment → CI → CD → CT?\n6. Draw the 4-step data engineering pipeline with activities under each step?\n7. List the streaming-ingestion concerns with a fix for each, and define a data contract?\n8. Explain selection bias with its three sub-types, the three causes of leakage, and PSI?\n\nIf yes to all eight, you're ready. Good luck!",
        },
      ],
    },
  ],
};
