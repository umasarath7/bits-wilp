// DMML — Lecture 5: Modern Data Infrastructure and DataOps
// Source: CourseFiles/DMML/L5- Modern Data Infrastructure and DataOps updated (1).pptx (99 slides)

export default {
  title: "Modern Data Infrastructure & DataOps",
  source: "L5-Modern Data Infrastructure and DataOps.pptx · 99 slides",
  overview:
    "A walk through each layer of modern data infrastructure: **ingestion** (sources, interfaces, tools); **transformation & modelling** (dbt, SQL); **workflow orchestration** (Airflow); **storage** (raw ingredients → storage systems: file/block/object, cache, HDFS, streaming; consistency → abstractions); and **serving** (reverse ETL; business/operational/embedded analytics; the DS/ML infrastructure stack; ways to serve data). It then covers **automation** (IaC, pipeline automation), **DevOps → DataOps**, cloud and security foundations, **CI/CD/CT for ML**, **observability**, and the **DoorDash ML platform** case study.",

  summary: [
    {
      id: "flow",
      heading: "1. The data engineering lifecycle, revisited",
      slides: "4–5",
      blocks: [
        { type: "p", text: "```flow\nGeneration / Source -> Ingestion -> Transformation -> Serving -> Analytics | Data Science & ML | Reverse ETL\nStorage underlies ingestion, transformation and serving\n```" },
        { type: "p", text: "**Drivers of the last two decades:** public clouds (AWS, GCP, Azure) make building and deploying easy; storage costs dropped; highly scalable **columnar** databases (Redshift, Snowflake, BigQuery). These led to the modern warehouse and the **data lake**." },
      ],
    },
    {
      id: "ingest",
      heading: "2. Ingestion, transformation & orchestration infrastructure",
      slides: "6–15",
      blocks: [
        { type: "p", text: "**Source example:** an e-commerce firm combines its PostgreSQL shopping-cart DB with Google Analytics web data to understand pre-purchase behaviour. Most organisations have dozens to hundreds of sources, internal and third-party. The first question for a data engineer: **how do we get the data, and in what form?**" },
        {
          type: "table",
          head: ["Parameter", "Options"],
          rows: [
            ["How to get data", "App DB (Postgres/MySQL), REST API, stream (Kafka), shared file system / cloud bucket (logs, CSV), warehouse/lake, HDFS/HBase"],
            ["Interface / structure", "JSON from REST, structured MySQL rows, JSON inside DB columns, semi-structured logs, CSV/fixed-width/flat files, Kafka stream output"],
            ["Tools", "Singer, Stitch, **Fivetran**: mostly the E+L of ETL/ELT, some with light transforms"],
          ],
        },
        { type: "list", items: [
          "**Transformation** (the T): from simple (time-zone conversion, hashing an email to protect PII) to complex (a new business metric from many columns).",
          "**Data modelling** is a specific transformation: structuring data (usually warehouse tables) for analysis. Use tools like **dbt**. Prefer **SQL-based** modelling over point-and-click, because SQL is shared by engineers and analysts and familiar to new hires.",
          "**Workflow orchestration:** one source → ingest → transform is easy. *n* sources, run many times a day with dependencies, can't be managed with ad-hoc Python/SQL. Orchestrators **schedule and manage task flow**: general-purpose **Apache Airflow**, Luigi, AWS Glue; ML-specific **Kubeflow Pipelines** (Docker-based).",
        ]},
      ],
    },
    {
      id: "storage",
      heading: "3. Storage infrastructure",
      slides: "16–45",
      blocks: [
        { type: "p", text: "Storage is the **cornerstone** of the lifecycle; data is stored many times as it moves. Three layers: **raw ingredients → storage systems → storage abstractions**." },
        {
          type: "table",
          caption: "Raw ingredients",
          head: ["Ingredient", "Notes"],
          rows: [
            ["HDD / SSD / RAM", "HDD: magnetic, large and cheap, slower. SSD: flash, no moving parts, fast. RAM: volatile, fastest"],
            ["Networking & CPU", "Networking distributes data across nodes (performance, durability, availability); CPU services requests"],
            ["Serialization", "Row vs columnar; **Parquet** (columnar), **Hudi** (hybrid), **Arrow** (in-memory)"],
            ["Compression", "Smaller data, faster scans and network transfer"],
            ["Caching", "Fast layer for frequently/recently used data"],
          ],
        },
        {
          type: "table",
          caption: "Key storage-system trade-offs",
          head: ["", "Option A", "Option B"],
          rows: [
            ["Scale", "**Single machine**", "**Distributed**: many servers, faster at scale, built-in redundancy (object stores, Spark, cloud DWs)"],
            ["Consistency", "**Strong**: writes reach consensus first; every read returns the latest value", "**Eventual**: fast reads that may be slightly stale; the common trade-off at scale"],
          ],
        },
        {
          type: "table",
          caption: "Storage types",
          head: ["Type", "Characteristics", "Examples / uses"],
          rows: [
            ["**File**", "Finite byte stream; append; random read/write; directory tree with metadata/pointers", "Local FS (NTFS, ext4: read-after-write consistency, locking); **NAS** (shared over network, redundancy); cloud FS (**Amazon EFS**)"],
            ["**Block**", "Raw storage in fixed blocks (512 B → 4 KB), smallest addressable unit; seeks on HDD", "Transactional DBs, VM boot disks; **RAID** (durability, performance, capacity); **SAN**; cloud **EBS** (persists, replicated to ≥2 hosts); local instance volumes (cheap, lost on VM stop)"],
            ["**Object**", "Key-value store of **immutable** objects; no random writes or appends (rewrite the whole object); random reads via range requests; **serverless**", "**S3**, Azure Blob, GCS; cloud data lakes and many cloud DWs sit on it"],
            ["**Cache / memory**", "RAM: ultra-low latency but volatile", "**Memcached** (simple key-value cache for queries/API responses); **Redis** (richer types, optional persistence ~every 2 s, tolerates small loss)"],
            ["**HDFS**", "Based on GFS; files split into blocks, **NameNode** holds metadata, **3× replication**; **combines compute and storage** on the same nodes", "Still used under Spark and Amazon EMR, though MapReduce/Pig have faded"],
            ["**Streaming storage**", "**Retention** (Kafka can keep data very long or indefinitely) and **replay** of historical ranges", "Kafka, Kinesis, Pulsar, Pub/Sub"],
          ],
        },
        { type: "p", text: "**Storage abstractions** (built on those systems): data warehouse, data lake, data lakehouse, data platforms, **data catalogues**." },
      ],
    },
    {
      id: "serving",
      heading: "4. Serving infrastructure",
      slides: "46–75",
      blocks: [
        { type: "p", text: "**Reverse ETL:** send processed data **back into source/operational systems**. *Example:* CRM data → warehouse → lead-scoring model → scores back in the warehouse. Instead of emailing Excel or building a dashboard, **load the scored leads back into the CRM** where salespeople work. Challenge: transformation and validation for the target system. Tools: Hightouch, Census, Fivetran, Airbyte, RudderStack. Ad-tech example: compute cost-per-click bids and push them back to the platform." },
        {
          type: "table",
          caption: "Analytics",
          head: ["Type", "Focus", "Tools"],
          rows: [
            ["**Business analytics**", "Historical and current data for strategic decisions: dashboards, reports, ad-hoc analysis", "Tableau, Power BI, Qlik"],
            ["**Operational analytics**", "**Immediate action** on real-time data. The difference is *time*, and the line is blurring", "Real-time dashboards/alerts"],
            ["**Embedded analytics**", "**External-facing**: analytics inside the product for end users (data applications)", "Looker, Qlik Embedded, Sisense"],
          ],
        },
        { type: "p", text: "**DS/ML infrastructure stack** (bottom = generic, top = ML-specific). Shared infrastructure increases **volume** (more projects), **velocity** (faster time to market), **validity** (robust results) and **variety** (more kinds of projects)." },
        {
          type: "table",
          head: ["Layer (bottom → top)", "Role / key challenge"],
          rows: [
            ["1. Data warehouse", "Where data lives; lay it out to be discoverable and efficiently accessible, *and never lose it*"],
            ["2. Compute resources", "On-demand compute for many algorithms, often in parallel; doesn't dictate what runs"],
            ["3. Job scheduler", "Keep data flowing and machines running (regular retraining); must itself stay up"],
            ["4. Architecture", "Map a real problem to robust software: algorithms + how pipelines connect"],
            ["5. Versioning", "Experiments need side-by-side versions, **isolated** (code, input/output data, pipelines)"],
            ["6. Model operations", "Deploy, monitor and ensure validity of all models; track metadata from prototype to production"],
            ["7. Feature engineering", "Efficient raw data → features transformation"],
            ["8. Model development", "Choose and implement the model. It is only a *tiny part* of the stack"],
          ],
        },
        { type: "p", text: "Foundational layers (data, compute) are agnostic to the workload. Middle layers define the software architecture (mostly integrating components). The top is the realm of DS/ML and evolves fastest." },
        {
          type: "table",
          caption: "Ways to serve data",
          head: ["Way", "Notes"],
          rows: [
            ["File exchange", "Ubiquitous (CSV invoices, text for sentiment); depends on use case, consumer process, size, access, data type"],
            ["Databases (OLAP)", "Schema imposes order; **fine-grained permissions** (table/column/row); high performance and concurrency; DS extracts → features → offline training"],
            ["Streaming systems", "Emitted metrics; operational analytics DBs combining OLAP with stream processing"],
            ["**Query federation**", "Query many sources (lakes, RDBMS, DWs, APIs) in place, without centralising (Trino, Presto, Starburst). Good for ad-hoc exploration, **read-only** access and compliance; beware load on production sources"],
            ["Notebooks", "Jupyter (Julia, Python, R) connecting to APIs, DBs, lakes via libraries/ODBC"],
          ],
        },
      ],
    },
    {
      id: "ops",
      heading: "5. Automation, DataOps, cloud, security",
      slides: "76–87",
      blocks: [
        { type: "list", items: [
          "**Infrastructure components:** storage (lake/DW/lakehouse), DBs (RDBMS, NoSQL, time-series), compute (ETL/ELT engines, clusters, serverless), orchestration, integration (APIs, messaging).",
          "**Infrastructure provisioning automation:** **IaC** (Terraform, Pulumi, AWS CDK, Azure Bicep), **GitOps** (ArgoCD, Flux), CloudFormation templates. This is why VMs arrive in minutes.",
          "**Pipeline automation:** scheduled/triggered ETL/ELT and streaming jobs; **auto-retry with back-off**; **schema-change detection** that auto-updates downstream models (dbt tests); orchestrators (Airflow, Dagster, Prefect); event-driven (EventBridge, Event Grid, Kafka Streams); **self-healing** workflows (retry, fallback, alternative route).",
          "**DevOps** works on *code*. **DataOps** applies it to data: *dev* = pipeline development, *ops* = monitoring, troubleshooting, enhancing. It uses **agile** for data governance and analytics development and **DevOps** for code optimisation, builds and delivery, while also improving the warehouse.",
          "**Cloud:** computing services (storage, DBs, software, servers) over the internet, **pay-as-you-go**; pipeline builders, streaming, API gateways and stores are available as services.",
        ]},
        {
          type: "table",
          caption: "Security foundation",
          head: ["State of data", "Meaning", "Protection"],
          rows: [
            ["**At rest**", "Stored on a medium", "Encrypt the entire medium"],
            ["**In transit**", "Moving between systems", "Message/transport encryption (TLS)"],
            ["**In use**", "Being used by someone", "**Role-based access control**"],
          ],
        },
      ],
    },
    {
      id: "ct",
      heading: "6. CI/CD/CT for ML, observability, DoorDash case",
      slides: "88–97",
      blocks: [
        { type: "p", text: "```flow\nExperimental phase (new idea, e.g. a feature) -> Continuous Integration (PR: unit tests + automated retraining + model registry) -> Continuous Deployment (canary + A/B vs production) -> Continuous Training (recurring retraining, e.g. daily fine-tune + reroute)\n```" },
        { type: "list", items: [
          "**Experimental:** the ML engineer tests a new transformation, trains and validates. The output is code for the main repo.",
          "**CI:** a PR triggers unit tests *and* the automated training pipeline (retrain, integration tests, push to the **model registry**), plus a manual review of the PR and metrics.",
          "**CD:** a **canary deployment** checks the model fits the serving pipeline, then an **A/B test** against the production model, then promotion.",
          "**CT:** a model starts to **deteriorate** once in the registry, so recurring training (e.g. daily fine-tuning on new data) and redeployment follow.",
          "**Observability:** from DevOps (removing dev/IT silos) to data: **monitoring, tracking and triaging incidents to prevent *data downtime***.",
        ]},
        { type: "p", text: "**DoorDash case.** *Problems:* fragmented ML workflows (analytics, batch ML and real-time ML separate), low observability (data issues → wrong ETAs), deployments taking weeks, frequent data drift, manual debugging. *Solution:* a unified ML platform." },
        {
          type: "table",
          head: ["Component", "Role"],
          rows: [
            ["**Feature store**", "Low-latency store the prediction service reads (numerical, categorical, embeddings)"],
            ["Realtime feature aggregator", "Streams events into features (e.g. store wait time over the last 30 min, recent driving speeds)"],
            ["Historical aggregator", "Offline long-window features (1 week, 3 months) → feature warehouse + feature store"],
            ["Prediction logs", "Predictions + features used + model id, for debugging and the next training set"],
            ["Model training pipeline", "The **only** writer to the model store, giving a trace for security/audit. Auto-retrain, deploy and monitor (CI/CD for models)"],
            ["Model store", "Model files + metadata (which model is active, which gets **shadow** traffic)"],
            ["Prediction service", "Serves predictions from request features + context; supports override model id for **A/B tests**"],
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["Orchestrator", "Schedules and manages task dependencies (Airflow, Kubeflow)."],
    ["dbt", "SQL-based transformation/modelling tool in the warehouse."],
    ["Strong vs eventual consistency", "Always latest vs fast but possibly stale reads."],
    ["Object storage", "Immutable key-value objects; S3/GCS; basis of lakes."],
    ["Block storage", "Fixed-size blocks; DBs, VM disks; EBS, RAID, SAN."],
    ["HDFS", "Distributed file system: NameNode, 3× replication, compute + storage together."],
    ["Reverse ETL", "Push processed data back to operational tools (CRM)."],
    ["Embedded analytics", "Analytics inside customer-facing products."],
    ["Query federation", "Query many sources in place (Trino/Presto)."],
    ["IaC", "Infrastructure as code (Terraform)."],
    ["DataOps", "Agile + DevOps applied to data pipelines and analytics."],
    ["CT", "Continuous training: recurring automatic retraining."],
    ["Feature store", "Shared online/offline store of model features."],
    ["Data downtime", "Periods when data is missing, wrong or late."],
  ],

  examTips: [
    "Storage questions: compare **file vs block vs object** on unit, mutability, access, examples and use case, and mention **consistency** trade-offs.",
    "Serving questions: reverse ETL with the **CRM lead-scoring** example is a classic.",
    "For DataOps/MLOps: explain the **four phases (experiment → CI → CD → CT)** and name canary/A-B/model registry.",
    "Use **DoorDash** as a ready-made case study for any “design an ML data platform” question.",
  ],

  theory: [
    {
      title: "File vs block vs object storage",
      marks: 5,
      question: "Compare file, block and object storage with examples. Which would you use for (a) a transactional database, (b) a data lake for ML training data, (c) shared files across VMs? Justify.",
      solution: `
| | File | Block | Object |
|---|---|---|---|
| Unit | File (byte stream) in a directory tree | Fixed-size **block** (512 B – 4 KB), the smallest addressable unit | **Object** (bytes + metadata) under a key |
| Mutability | Append + random write | Random read/write at block level | **Immutable**: rewrite the whole object to change it; random reads via range requests |
| Access | OS file system, NAS over the network | Attached like a disk; OS/DB lays out data | HTTP API; serverless, virtually unlimited |
| Performance | Good locally; network penalty on NAS | Lowest latency, high IOPS | High throughput, higher latency per request |
| Examples | NTFS, ext4, NAS, **Amazon EFS** | RAID, SAN, **Amazon EBS**, instance store | **Amazon S3**, Azure Blob, GCS |

**(a) Transactional DB → block storage** (e.g. EBS). DBs manage their own block layout for low-latency random reads/writes. EBS persists independently of the VM and replicates to at least two hosts for durability.
**(b) ML data lake → object storage** (S3/GCS). Cheap, scalable, durable, stores any format (Parquet, images), and compute scales separately (Spark, SageMaker). Training data is written once and read many times, which suits immutability.
**(c) Shared files across VMs → file storage** (NAS / EFS). A POSIX directory tree mounted by many machines, with read-after-write semantics and locking.

**Add-on:** caches (Redis/Memcached) for ultra-low-latency serving, and HDFS where compute and storage must be co-located (Spark on EMR).`,
    },
    {
      title: "Strong vs eventual consistency; distributed storage",
      marks: 5,
      question: "Why do organisations move from single-machine to distributed storage? Explain strong vs eventual consistency with examples, and state which an ML feature store (online) and a financial ledger should use.",
      solution: `
**Why distributed:** as data and access patterns outgrow one server, storing data across many servers gives **scale** (store, retrieve and process faster in parallel) and **redundancy** (data survives a node failure). Object stores, Spark and cloud warehouses are all distributed.

**The dilemma:** replicating a change to every node takes time, so there is a trade-off between reading the *latest* data and reading *somewhat current* data quickly.

| | Strong consistency | Eventual consistency |
|---|---|---|
| Guarantee | A write reaches **consensus** before completing; every read returns the latest value | Reads return quickly without checking all replicas; replicas **converge** later |
| Latency / availability | Higher latency; may block during partitions | Low latency, highly available |
| Example | Bank balance, inventory decrement, ACID RDBMS | Social-media likes, product view counts, many NoSQL/document stores, DNS |

**Choices:**
- **Financial ledger → strong consistency**, because a stale balance could allow a double spend.
- **Online feature store → usually eventual consistency** (with bounded staleness). Low-latency reads matter most, and a feature like "orders in the last 30 min" that is a few seconds stale barely changes a prediction. Critical features can use stronger guarantees.`,
    },
    {
      title: "Reverse ETL and types of analytics",
      marks: 5,
      question: "What is reverse ETL? Explain with an example and mention its challenge. Differentiate business, operational and embedded analytics.",
      solution: `
**Reverse ETL** takes processed data from the output side of the lifecycle (warehouse/models) and **feeds it back into operational source systems**, where people actually work.

\`\`\`flow
CRM (customers, orders) -> ETL -> Warehouse -> Lead-scoring model -> Scores in warehouse -> Reverse ETL -> CRM (salespeople see scored leads)
\`\`\`
*Example:* rather than emailing salespeople an Excel file or asking them to check a dashboard, push the lead scores **into the CRM** they already use. The data is actionable where the work happens. Also used in ad tech: compute cost-per-click bids and push them back to the ad platform.
**Challenge:** transforming and validating data to fit the target system's schema and API rules. **Tools:** Hightouch, Census, Fivetran, Airbyte, RudderStack.

**Analytics types**

| | Business | Operational | Embedded |
|---|---|---|---|
| Purpose | Strategic, actionable insights from historical + current data | **Immediate action** on real-time data | Analytics for **external end users** inside a product |
| Form | Dashboards, reports, ad-hoc analysis | Real-time monitors and alerts | Dashboards inside apps (data applications) |
| Time | Longer-term trends + human judgement | Seconds/minutes | Live, user-facing |
| Tools | Tableau, Power BI, Qlik | Streaming + operational DBs | Looker, Qlik Embedded, Sisense |

The line between business and operational analytics is blurring as real-time data becomes cheaper.`,
    },
    {
      title: "Layers of the data-science/ML infrastructure stack",
      marks: 5,
      question: "Explain the layers of the data-science infrastructure stack from the bottom up, giving the key challenge at each layer. Why is common infrastructure valuable?",
      solution: `
\`\`\`flow
Data warehouse -> Compute resources -> Job scheduler -> Architecture -> Versioning -> Model operations -> Feature engineering -> Model development
\`\`\`
*(bottom, generic → top, ML-specific)*

| Layer | Key challenge |
|---|---|
| **Data warehouse** | Lay data out so it is discoverable and efficiently accessible, while **never losing data** (durability) |
| **Compute** | Provide on-demand resources for many algorithms, often in parallel. The layer is agnostic to what runs |
| **Job scheduler** | Keep data flowing and machines busy for recurring training, while staying up and scaling to many concurrent pipelines |
| **Architecture** | Map the real-world problem to a robust software architecture: algorithms and how pipelines connect |
| **Versioning** | Run versions side by side for experimentation, **isolated** (code, input/output data, scheduled pipelines) so results can be compared reliably |
| **Model operations** | Deploy, monitor and assure validity of all models without slowing experimentation; track metadata from prototype to production |
| **Feature engineering** | Make the raw data → features transformation sequence efficient |
| **Model development** | Pick and implement the right modelling approach, usually with off-the-shelf libraries. Only a *tiny* part of the whole |

**Why common infrastructure:** it increases **volume** (projects run at once), **velocity** (time to market), **validity** (robust results) and **variety** (types of projects supported), instead of every team inventing bespoke processes. The foundational layers are shared; the top layers let data scientists iterate freely (*freedom and responsibility*).`,
    },
    {
      title: "DataOps, CI/CD/CT and observability",
      marks: 5,
      question: "What is DataOps and how does it relate to DevOps? Describe the phases of a CI/CD/CT pipeline for ML with a diagram, and explain data observability.",
      solution: `
**DevOps** removes silos between developers and IT for fast, reliable software releases. It works on **code**.
**DataOps** applies the same ideas to **data**: *dev* = building data pipelines; *ops* = monitoring, troubleshooting and enhancing them. It combines **agile** processes (for governance and analytics development) with **DevOps** processes (code optimisation, builds, delivery) and continuous improvement of the warehouse. Automation includes IaC (Terraform), orchestrators (Airflow/Dagster), auto-retries, schema-change detection and self-healing workflows.

**CI/CD/CT for ML**
\`\`\`flow
Experiment (new feature idea, train, validate) -> CI (pull request: unit tests + automated retraining + push to model registry + review) -> CD (canary deploy, then A/B test vs production, then promote) -> CT (scheduled retraining on fresh data, redeploy)
CT -> feeds back into the model registry
\`\`\`
- **Experimental:** a change is proved in development; the output is code.
- **CI:** unit tests *plus* the automated training pipeline and integration tests; the model is pushed to the **model registry**; manual approval.
- **CD:** a **canary** release checks the model fits the serving pipeline; an **A/B test** against the production model; promote on success.
- **CT:** models **deteriorate** once deployed (drift), so retrain regularly (e.g. daily fine-tuning) and reroute serving.

**Observability:** monitoring, tracking and **triaging incidents to prevent data downtime** (missing, late or wrong data). It extends DevOps observability to data: freshness, volume, schema, distribution and lineage checks. At DoorDash, poor observability let data issues produce **incorrect ETAs**.`,
    },
    {
      title: "Designing an ML platform: the DoorDash case",
      marks: 5,
      question: "DoorDash's ML workflows were fragmented, slow to deploy and hit by data drift. Describe the components of its unified ML platform and how each addresses these problems.",
      solution: `
**Problems:**
- fragmented workflows (analytics, batch ML, real-time ML separate)
- low observability (data issues → wrong ETAs)
- deployments taking weeks
- frequent data drift
- manual pipeline debugging

\`\`\`flow
Event stream -> Realtime feature aggregator -> Feature store
Data warehouse -> Historical aggregator -> Feature warehouse + Feature store
Feature store -> Prediction service -> Prediction logs -> Training data & debugging
Training pipeline (repo scripts) -> Model store (active / shadow models) -> Prediction service
\`\`\`

| Component | Role | Problem addressed |
|---|---|---|
| **Feature store** | Low-latency shared features (numerical, categorical, embeddings) | One source of features, so batch and real-time aren't fragmented; less training-serving skew |
| **Realtime feature aggregator** | Stream → features (store wait time in the last 30 min, driving speeds) | Fresh features for accurate ETAs |
| **Historical aggregator** | Offline long-window features (1 week, 3 months) | Consistent history for training and serving |
| **Prediction logs** | Predictions + features + model id | **Observability**, debugging, next training set |
| **Model training pipeline** | The only path to write models; auto-retrain, deploy, monitor | CI/CD for models, so deployments take days not weeks; audit trail; answers drift via retraining |
| **Model store** | Model files + metadata (active model, **shadow** traffic) | Safe rollout, versioning |
| **Prediction service** | Serves predictions; override model id for **A/B** | Controlled experiments in production |

**Result:** a unified, observable, automated, production-grade ML data platform.`,
    },
    {
      title: "Ways to serve data, including query federation",
      marks: 5,
      question: "Describe the different ways data is served to consumers (files, databases, streaming, query federation, notebooks). When is query federation the right choice, and what are its risks?",
      solution: `
| Way | How | Best when |
|---|---|---|
| **File exchange** | Produce files (CSV invoices, text of complaints) for consumers | Simple sharing; depends on use case, consumer process, size, who accesses, data type |
| **Databases (OLAP)** | Query a DW/lake, export results or feed features | Structured, governed access: schema, **fine-grained table/column/row permissions**, high performance and concurrency |
| **Streaming systems** | Emit metrics/events; operational analytics DBs combine OLAP + streams | Real-time and near-real-time use cases |
| **Query federation** | One query engine (Trino/Presto/Starburst) reads many sources (OLTP, OLAP, APIs, files) **in place** | Ad-hoc exploration across silos **without building pipelines/ETL** |
| **Notebooks** | Jupyter connects via libraries/APIs/ODBC | Exploration, feature engineering, training |

**Query federation is right when:** you need to blend data from several systems quickly; you want **read-only** access for consumers (no files, dumps or DB credentials); **access control and compliance are critical**, since users see only the versions they're allowed; or centralising data isn't worth it.

**Risks:** each source has its own usage patterns and quirks. Federated queries hitting **live production OLTP systems** can consume excessive resources and hurt applications. Performance depends on the slowest source. Use it for exploration; for heavy, repeated workloads, build a pipeline into an OLAP store.`,
    },
  ],

  quiz: [
    { q: "Apache Airflow is primarily a:", options: ["Message broker", "Workflow orchestrator", "Columnar database", "Feature store"], answer: 1, why: "It schedules and manages task flows." },
    { q: "Objects in object storage are:", options: ["Mutable at byte level", "Immutable; rewritten entirely to change", "Stored in blocks addressed by the OS", "Only structured"], answer: 1, why: "No random writes/appends; supports range reads." },
    { q: "Amazon EBS is an example of:", options: ["File storage", "Block storage", "Object storage", "Streaming storage"], answer: 1, why: "Cloud virtualised block storage for EC2." },
    { q: "HDFS replicates each block by default to:", options: ["1 node", "2 nodes", "3 nodes", "All nodes"], answer: 2, why: "3× replication for durability and availability." },
    { q: "Pushing lead scores from the warehouse back into the CRM is:", options: ["ETL", "ELT", "Reverse ETL", "CDC"], answer: 2, why: "Data flows back to operational systems." },
    { q: "Analytics shown to external users inside a product is:", options: ["Business analytics", "Operational analytics", "Embedded analytics", "Federated analytics"], answer: 2, why: "External-facing data applications." },
    { q: "Protecting data in use is primarily done through:", options: ["Disk encryption", "TLS", "Role-based access control", "Compression"], answer: 2, why: "At rest → encrypt medium; in transit → message encryption; in use → RBAC." },
    { q: "Terraform belongs to which automation category?", options: ["Pipeline automation", "Infrastructure as code", "Data validation", "Model registry"], answer: 1, why: "IaC provisions infrastructure." },
    { q: "In CI/CD/CT for ML, canary + A/B testing happen in:", options: ["Experimentation", "Continuous integration", "Continuous deployment", "Continuous training"], answer: 2, why: "CD validates the new model against production." },
    { q: "At DoorDash, only this component may write models to the model store:", options: ["Prediction service", "Feature store", "Model training pipeline", "Prediction logs"], answer: 2, why: "This gives an audit trail of every change." },
  ],
};
