// DMML — Lecture 5: Modern Data Infrastructure & DataOps
// Source: CourseFiles/DMML/L5- Modern Data Infrastructure and DataOps updated (1).pptx (97 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Modern Data Infrastructure & DataOps",
  source: "L5-Modern Data Infrastructure and DataOps.pptx · 97 slides",
  overview:
    "Lecture 4 described pipelines. This lecture looks at the **infrastructure underneath**: the machinery for getting data in, storing it, and serving it back out, plus the practices (DataOps, CI/CD/CT) that keep it running. We'll ask: **how** does data get in and get shaped? **Where** does it physically live, and why are there so many kinds of storage? **How** is it served back to people, apps and models? **What** does an ML team need on top? And **how** do we automate, secure and monitor it all? This lecture **wasn't examined last time**, so expect a question from it. Running example: a food-delivery company (DoorDash, whose case study ends the lecture, or Swiggy in India) predicting delivery times.",

  summary: [
    {
      id: "flow",
      heading: "Lesson 1: The data engineering lifecycle, and what changed",
      slides: "4–5",
      blocks: [
        {
          type: "p",
          text: "Every piece of infrastructure in this lecture supports one stage of the **data engineering lifecycle**:",
        },
        {
          type: "p",
          text: "```flow\nGeneration / Source -> Ingestion -> Transformation -> Serving -> Analytics | Data Science & ML | Reverse ETL\nStorage underlies ingestion, transformation and serving\n```",
        },
        {
          type: "p",
          text: "For our delivery company: orders, restaurant prep times and rider GPS pings are **generated** in apps; they're **ingested** into the platform; **transformed** into features like “average prep time for this restaurant in the last 30 minutes”; and **served** to the delivery-time model, to dashboards, and back into operational tools. **Storage** sits under every step.",
        },
        {
          type: "p",
          text: "**What changed in the last two decades (slide 5)?** Three things made modern infrastructure possible: **public clouds** (AWS, Google Cloud, Azure) made building and deploying easy; **storage became cheap**; and **highly scalable columnar databases** (Redshift, Snowflake, BigQuery) appeared. Together these gave us the modern cloud warehouse and the **data lake**.",
        },
      ],
    },
    {
      id: "ingest",
      heading: "Lesson 2: How does data get in and get shaped? Ingestion, transformation, orchestration",
      slides: "6–15",
      blocks: [
        {
          type: "p",
          text: "**Sources (slides 6–8).** The slide's example: an e-commerce firm combines its **PostgreSQL shopping-cart database** with **Google Analytics** web data to understand what customers do before they buy. Most organisations have **dozens to hundreds** of sources, internal and third-party. So the data engineer's first question is always: ***how* do we get the data, and in *what form* does it arrive?**",
        },
        {
          type: "table",
          head: ["Question", "Typical answers"],
          rows: [
            ["**How do we get it?**", "An application database (Postgres, MySQL); a REST API; a stream (Kafka); a shared file system or cloud bucket (logs, CSV); a warehouse or lake; HDFS/HBase"],
            ["**In what form?**", "JSON from a REST API; structured MySQL rows; JSON stored inside database columns; semi-structured logs; CSV, fixed-width or flat files; Kafka stream output"],
            ["**With which tools?**", "Singer, Stitch, **Fivetran**: mostly the E and L of ETL/ELT, some with light transformations"],
          ],
        },
        {
          type: "p",
          text: "**Transformation (slides 9–10)**, the T, ranges from simple (convert time zones; **hash an email address** so PII isn't exposed) to complex (a new business metric computed from many columns, e.g. “on-time delivery rate per zone”).",
        },
        {
          type: "p",
          text: "**Data modelling (slides 11–12)** is a special kind of transformation: **structuring data for analysis**, usually as warehouse tables. Use tools such as **dbt**. The slides recommend **SQL-based modelling over point-and-click tools**, because SQL is shared by engineers and analysts and new hires already know it.",
        },
        {
          type: "p",
          text: "**Workflow orchestration (slides 13–15).** One source → ingest → transform is easy to run by hand. But *n* sources, each running several times a day, where step C can only start after A and B finish, can't be managed with ad-hoc Python and SQL scripts. An **orchestrator** **schedules tasks and manages their dependencies**, retrying failures and alerting humans. General-purpose: **Apache Airflow**, Luigi, AWS Glue. ML-specific: **Kubeflow Pipelines** (runs each step in a Docker container).",
        },
      ],
    },
    {
      id: "storage",
      heading: "Lesson 3: Where does data physically live? Ingredients and trade-offs",
      slides: "16–26",
      blocks: [
        {
          type: "p",
          text: "Storage is the **cornerstone** of the lifecycle: data is stored many times as it moves through the pipeline. The slides describe three layers, from the bottom up: **raw ingredients → storage systems → storage abstractions**.",
        },
        {
          type: "table",
          caption: "Raw ingredients (slides 17–22)",
          head: ["Ingredient", "What to know"],
          rows: [
            ["**HDD** (Hard Disk Drive)", "Magnetic spinning disks: large and cheap, but slower"],
            ["**SSD** (Solid State Drive)", "Flash memory with no moving parts: much faster, costs more"],
            ["**RAM** (Random Access Memory)", "Fastest of all, but **volatile**: lost when power goes"],
            ["**Networking & CPU**", "Networking spreads data across machines for performance, durability and availability; CPUs service the requests"],
            ["**Serialization**", "Row vs columnar layouts: **Parquet** (columnar files), **Hudi** (hybrid), **Arrow** (columnar, in memory)"],
            ["**Compression**", "Smaller data means faster scans and cheaper network transfer"],
            ["**Caching**", "A fast layer holding frequently or recently used data"],
          ],
        },
        {
          type: "p",
          text: "**Trade-off 1: one machine or many? (slides 23–24).** A **single-machine** store is simple. A **distributed** store spreads data over many servers: faster at scale, with built-in redundancy (if one server dies, copies exist elsewhere). Object stores, Spark and cloud warehouses are all distributed.",
        },
        {
          type: "p",
          text: "**Trade-off 2: strong or eventual consistency? (slides 25–26).** Once data is copied across machines, a question arises: after a write, does every reader immediately see the new value?",
        },
        {
          type: "list",
          items: [
            "**Strong consistency:** the machines agree on each write (reach **consensus**) before confirming it, so **every read returns the latest value**. Correct, but slower. *Example:* your bank balance after a payment.",
            "**Eventual consistency:** writes are confirmed quickly and copies catch up shortly after, so a read **might briefly return a slightly old value**. Fast and scalable, the common choice at large scale. *Example:* a like count on a post, or a restaurant's rating.",
          ],
        },
      ],
    },
    {
      id: "types",
      heading: "Lesson 4: Which kind of storage for which job?",
      slides: "27–45",
      blocks: [
        {
          type: "p",
          text: "Think of three ways to store your belongings. A **filing cabinet** with folders (file storage). A **warehouse of numbered identical shelves** where you can replace any single shelf (block storage). A **coat-check counter**: hand over a coat, get a ticket; to change the coat you swap it for a new one (object storage).",
        },
        {
          type: "table",
          caption: "Storage systems (slides 27–45)",
          head: ["Type", "How it works", "Examples and uses"],
          rows: [
            ["**File**", "A finite stream of bytes; you can append and do random reads and writes; organised in a **directory tree** with metadata and pointers", "Local file systems (NTFS, ext4, with read-after-write consistency and locking); **NAS** (Network-Attached Storage, shared over the network); cloud file systems (**Amazon EFS**)"],
            ["**Block**", "Raw storage split into **fixed-size blocks** (512 bytes to 4 KB), the smallest addressable unit; any block can be rewritten", "Transactional databases, virtual-machine boot disks; **RAID** (combining disks for durability, performance and capacity); **SAN** (Storage Area Network); cloud **EBS** (persists, replicated to at least 2 hosts); local instance volumes (cheap but lost when the VM stops)"],
            ["**Object**", "A key-value store of **immutable** objects: **no random writes or appends** (to change an object you rewrite the whole thing); random reads via byte-range requests; **serverless** (no servers for you to manage)", "**Amazon S3**, Azure Blob, Google Cloud Storage. **Data lakes** and many cloud warehouses sit on it"],
            ["**Cache / memory**", "Data held in RAM: ultra-low latency but volatile", "**Memcached** (simple key-value cache for query and API results); **Redis** (richer data types, optional persistence every ~2 s, so it tolerates a small loss)"],
            ["**HDFS** (Hadoop Distributed File System)", "Based on Google's GFS: files split into blocks; a **NameNode** keeps the metadata; each block **replicated 3×**; **compute and storage on the same machines**", "Still found under Spark and Amazon EMR, though MapReduce and Pig have faded"],
            ["**Streaming storage**", "Keeps event streams with **retention** (Kafka can keep data very long, even indefinitely) and allows **replay** of a historical range", "Kafka, Kinesis, Pulsar, Google Pub/Sub"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Delivery-company choices",
          text: "- Orders database disks → **block** storage (many small random writes).\n- Raw GPS pings, menu photos, logs → **object** storage (cheap, huge, written once): the data lake.\n- “Restaurant X's current prep time” for the live ETA model → **cache** (Redis), read in under a millisecond.\n- Every order event, kept so features can be recomputed → **streaming storage** (Kafka with long retention).",
        },
        {
          type: "p",
          text: "**Storage abstractions (slide 45)** are built on these systems: the **data warehouse**, **data lake**, **data lakehouse**, **data platforms**, and **data catalogues** (searchable inventories of what data exists, what it means and who owns it).",
        },
      ],
    },
    {
      id: "serving",
      heading: "Lesson 5: How is data served back out? Reverse ETL, analytics and serving methods",
      slides: "46–58, 69–75",
      blocks: [
        {
          type: "p",
          text: "**Reverse ETL (slides 46–50).** Normal ETL moves data *from* operational systems *into* the warehouse. **Reverse ETL sends processed data back into operational tools**, where people actually work. The slide's example: CRM (Customer Relationship Management) data → warehouse → a **lead-scoring model** → scores stored in the warehouse. Instead of emailing an Excel file or building yet another dashboard that salespeople won't open, **load the scores straight back into the CRM**, next to each lead. Challenge: transforming and validating data for the target system. Tools: Hightouch, Census, Fivetran, Airbyte, RudderStack. Ad-tech example: compute cost-per-click bids and push them back to the ad platform.",
        },
        {
          type: "table",
          caption: "Three kinds of analytics (slides 51–58)",
          head: ["Type", "Focus", "Delivery-company example", "Tools"],
          rows: [
            ["**Business analytics**", "Historical and current data for strategic decisions: dashboards, reports, ad-hoc analysis", "Monthly orders by city", "Tableau, Power BI, Qlik"],
            ["**Operational analytics**", "Real-time data for **immediate action**. The difference is time, and the line is blurring", "An alert when a zone's delivery times spike right now", "Real-time dashboards and alerts"],
            ["**Embedded analytics**", "**External-facing**: analytics built into the product for customers", "A restaurant partner's in-app sales dashboard", "Looker, Qlik Embedded, Sisense"],
          ],
        },
        {
          type: "table",
          caption: "Ways to serve data (slides 69–75)",
          head: ["Method", "When and why"],
          rows: [
            ["**File exchange**", "Still everywhere: CSV invoices, text files for sentiment analysis. The right choice depends on the use case, consumer, size, access and data type"],
            ["**Databases (OLAP)**", "A schema imposes order; **fine-grained permissions** at table, column or row level; high performance and concurrency. Data scientists extract data → build features → train offline"],
            ["**Streaming systems**", "Emitted metrics; operational-analytics databases combining OLAP with stream processing"],
            ["**Query federation**", "Query many sources (lakes, relational DBs, warehouses, APIs) **where they live**, without first copying them to one place (Trino, Presto, Starburst). Good for ad-hoc exploration, **read-only** access and compliance. Beware putting load on production sources"],
            ["**Notebooks**", "Jupyter (Julia, Python, R) connecting to APIs, databases and lakes through libraries or ODBC"],
          ],
        },
      ],
    },
    {
      id: "mlstack",
      heading: "Lesson 6: What does an ML team need from infrastructure? The 8-layer stack",
      slides: "59–68",
      blocks: [
        {
          type: "p",
          text: "A single data scientist can train a model on a laptop. An organisation running dozens of models in production needs **shared infrastructure**. The payoff (slide 60) is four more Vs: more **volume** (more projects), more **velocity** (faster to production), more **validity** (robust results) and more **variety** (more kinds of problem tackled).",
        },
        {
          type: "p",
          text: "The slides draw the data-science/ML infrastructure as a **stack of eight layers**, from general-purpose foundations at the bottom to ML-specific work at the top:",
        },
        {
          type: "table",
          head: ["Layer (bottom → top)", "Its job", "Key challenge"],
          rows: [
            ["**1. Data warehouse**", "Where data lives", "Lay data out so it's discoverable and efficiently accessible, **and never lose it**"],
            ["**2. Compute resources**", "On-demand compute for many algorithms, often in parallel", "Must not dictate what runs on it"],
            ["**3. Job scheduler**", "Keeps data flowing and machines running (e.g. regular retraining)", "Must itself stay up, always"],
            ["**4. Architecture**", "Maps a real problem to robust software: algorithms + how pipelines connect", "Good design, not just code"],
            ["**5. Versioning**", "Keeps experiments side by side", "Each version **isolated**: its code, input and output data, and pipeline"],
            ["**6. Model operations**", "Deploy, monitor and ensure the validity of every model", "Track metadata from prototype to production"],
            ["**7. Feature engineering**", "Turn raw data into model features efficiently", "Consistency between training and serving"],
            ["**8. Model development**", "Choose and implement the model", "It's only a **tiny part** of the whole stack"],
          ],
        },
        {
          type: "p",
          text: "**How to read the stack.** The foundations (data, compute) don't care what workload runs on them. The middle layers are mostly about **integrating components** into a sound software architecture. The top is where data scientists spend their time, and it evolves fastest. The lesson echoes Session 3 of AML: the model is a small piece of a real ML system.",
        },
      ],
    },
    {
      id: "ops",
      heading: "Lesson 7: How do we automate and secure it all? IaC, pipeline automation, DataOps",
      slides: "76–87",
      blocks: [
        {
          type: "p",
          text: "**The pieces to manage (slide 76):** storage (lake, warehouse, lakehouse), databases (relational, NoSQL, time-series), compute (ETL/ELT engines, clusters, serverless functions), orchestration, and integration (APIs, messaging). Doing all of it by hand doesn't scale.",
        },
        {
          type: "p",
          text: "**Infrastructure provisioning automation (slides 77–78).** **IaC (Infrastructure as Code)**: describe servers, databases and networks in code files (**Terraform**, Pulumi, AWS CDK, Azure Bicep, CloudFormation templates), keep them in version control, and let a tool create the infrastructure. **GitOps** (ArgoCD, Flux) goes further: the Git repository *is* the source of truth, and the live system is automatically kept in sync with it. This is why a new virtual machine arrives in minutes, not weeks.",
        },
        {
          type: "p",
          text: "**Pipeline automation (slides 79–81):**",
        },
        {
          type: "list",
          items: [
            "Scheduled or triggered ETL/ELT and streaming jobs.",
            "**Auto-retry with back-off:** if a step fails, retry after waiting a little longer each time.",
            "**Schema-change detection:** notice when a source's structure changes and update or test downstream models automatically (e.g. dbt tests).",
            "Orchestrators such as Airflow, Dagster and Prefect; **event-driven** triggers (AWS EventBridge, Azure Event Grid, Kafka Streams).",
            "**Self-healing workflows:** retry, fall back, or route around a failure automatically.",
          ],
        },
        {
          type: "p",
          text: "**DevOps vs DataOps (slides 82–84).** **DevOps** applies automation and collaboration to **code**. **DataOps** applies the same ideas to **data**: *dev* = developing pipelines; *ops* = monitoring, troubleshooting and improving them. It borrows **agile** methods for data governance and analytics development, and **DevOps** for code optimisation, builds and delivery, while also improving the warehouse itself.",
        },
        {
          type: "p",
          text: "**Cloud (slide 85):** computing services (storage, databases, software, servers) delivered over the internet, **pay-as-you-go**. Pipeline builders, streaming services, API gateways and stores are all available as managed services.",
        },
        {
          type: "table",
          caption: "Security: protect data in all three states (slides 86–87)",
          head: ["State", "Meaning", "Protection"],
          rows: [
            ["**At rest**", "Stored on a disk or medium", "**Encrypt** the entire medium"],
            ["**In transit**", "Moving between systems over a network", "**Transport encryption** (TLS, Transport Layer Security)"],
            ["**In use**", "Being accessed or processed by someone", "**Role-Based Access Control (RBAC)**: people see only what their role needs"],
          ],
        },
      ],
    },
    {
      id: "ct",
      heading: "Lesson 8: How do models reach production and stay healthy? CI/CD/CT and observability",
      slides: "88–92",
      blocks: [
        {
          type: "p",
          text: "A delivery-time model trained last month is already going stale: new restaurants open, the monsoon slows riders. So getting a model into production **safely**, and **retraining it continually**, must be automated. The slides describe four phases:",
        },
        {
          type: "p",
          text: "```flow\nExperimental phase (new idea, e.g. a feature) -> Continuous Integration (PR: unit tests + automated retraining + model registry) -> Continuous Deployment (canary + A/B vs production) -> Continuous Training (recurring retraining, e.g. daily fine-tune + reroute)\n```",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Experimental phase:** an ML engineer tries an idea, say a new “rain in the last hour” feature. They test the transformation, train and validate. The output is code for the main repository.",
            "**Continuous Integration (CI):** opening a pull request (PR) triggers unit tests **and** the automated training pipeline: retrain, run integration tests, push the model to the **model registry** (a catalogue of trained models). A human reviews the PR and the metrics.",
            "**Continuous Deployment (CD):** first a **canary deployment** (a small slice of real traffic) checks the model works in the serving pipeline; then an **A/B test** compares it with the current production model; if it wins, it's promoted.",
            "**Continuous Training (CT):** once in production a model starts to **deteriorate**, so it's retrained on a schedule (e.g. fine-tuned daily on new data) and redeployed.",
          ],
        },
        {
          type: "p",
          text: "**Data observability (slides 91–92).** DevOps brought observability to software (breaking down silos between developers and IT). **Data observability** does the same for data: **monitoring, tracking and triaging incidents to prevent *data downtime***, i.e. periods when data is missing, wrong or late. A model can only be as healthy as the data feeding it.",
        },
      ],
    },
    {
      id: "doordash",
      heading: "Lesson 9: Case study: DoorDash's ML platform",
      slides: "93–97",
      blocks: [
        {
          type: "p",
          text: "DoorDash predicts delivery times (ETAs), assigns riders, and more. **Before (slide 93)** it had these problems: **fragmented ML workflows** (analytics, batch ML and real-time ML built separately); **low observability** (data issues silently produced wrong ETAs); **deployments taking weeks**; frequent **data drift**; and **manual debugging**. **The solution:** a unified ML platform built from these components (slides 94–97):",
        },
        {
          type: "table",
          head: ["Component", "What it does"],
          rows: [
            ["**Feature store**", "A low-latency store the prediction service reads: numerical, categorical and embedding features"],
            ["**Real-time feature aggregator**", "Turns live event streams into features, e.g. a store's wait time over the last 30 minutes, recent driving speeds"],
            ["**Historical aggregator**", "Computes long-window features offline (1 week, 3 months) → feature warehouse and feature store"],
            ["**Prediction logs**", "Record each prediction, the features used and the model id, for debugging and as the next training set"],
            ["**Model training pipeline**", "The **only** component allowed to write to the model store, giving a trace for security and audit; retrains, deploys and monitors automatically (CI/CD for models)"],
            ["**Model store**", "Model files plus metadata: which model is active, which receives **shadow** traffic (runs silently alongside for comparison)"],
            ["**Prediction service**", "Serves predictions using request features and context; can override the model id to run **A/B tests**"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in seven lines",
          text: "1. Lifecycle: source → ingestion → transformation → serving (analytics, ML, reverse ETL), with storage underneath. Cloud, cheap storage and columnar databases made modern infrastructure possible.\n2. Ingestion asks how and in what form (Fivetran, Stitch); transformation and modelling in SQL (dbt); orchestration schedules dependencies (Airflow, Kubeflow).\n3. Storage: HDD/SSD/RAM, serialization, compression, caching; single vs distributed; **strong** (always latest) vs **eventual** (fast, maybe stale) consistency.\n4. **File** (directory tree), **block** (fixed blocks: DBs, EBS), **object** (immutable, S3: lakes), cache (Redis), HDFS (3× replication), streaming (Kafka retention and replay).\n5. Serving: **reverse ETL** (scores back into the CRM); business / operational / embedded analytics; files, OLAP DBs, streams, **query federation**, notebooks.\n6. ML stack: warehouse → compute → scheduler → architecture → versioning → model ops → features → model (the smallest part). Automate with IaC/GitOps and self-healing pipelines; DataOps = DevOps + agile for data; secure data at rest, in transit, in use.\n7. Experiment → CI (tests + retrain + registry) → CD (canary + A/B) → CT (recurring retraining); observability prevents data downtime. DoorDash: feature store, aggregators, prediction logs, single-writer model store.",
        },
      ],
    },
  ],

  glossary: [
    ["Data engineering lifecycle", "—", "Generation → ingestion → transformation → serving, with storage underneath"],
    ["Ingestion", "—", "Getting data from sources into the platform"],
    ["Fivetran / Stitch / Singer", "—", "Tools that extract and load data from many sources"],
    ["Data modelling", "—", "Structuring data (usually tables) for analysis"],
    ["dbt", "data build tool", "SQL-based transformation and modelling in the warehouse"],
    ["Orchestrator", "—", "Schedules tasks and manages their dependencies (Airflow, Kubeflow)"],
    ["HDD / SSD / RAM", "Hard Disk Drive / Solid State Drive / Random Access Memory", "Slow and cheap / fast flash / fastest but volatile"],
    ["Parquet / Hudi / Arrow", "—", "Columnar file / hybrid table / in-memory columnar formats"],
    ["Strong consistency", "—", "Every read returns the latest write"],
    ["Eventual consistency", "—", "Reads may be briefly stale; copies catch up"],
    ["Consensus", "—", "Machines agreeing on a write before confirming it"],
    ["File storage", "—", "Byte streams in a directory tree (NTFS, NAS, EFS)"],
    ["NAS / SAN", "Network-Attached Storage / Storage Area Network", "Shared file storage / shared block storage over a network"],
    ["Block storage", "—", "Fixed-size blocks, individually rewritable (EBS, RAID)"],
    ["RAID", "Redundant Array of Independent Disks", "Combining disks for durability, speed and capacity"],
    ["EBS / EFS", "Elastic Block Store / Elastic File System", "AWS block and file storage"],
    ["Object storage", "—", "Immutable objects addressed by key (S3, GCS, Azure Blob)"],
    ["Serverless", "—", "You use the service without managing servers"],
    ["Memcached / Redis", "—", "In-memory caches; Redis adds richer types and optional persistence"],
    ["HDFS", "Hadoop Distributed File System", "Blocks replicated 3×, NameNode metadata, compute beside storage"],
    ["Retention / replay", "—", "How long a stream keeps events / re-reading a past range"],
    ["Data catalogue", "—", "A searchable inventory of datasets, meanings and owners"],
    ["Reverse ETL", "—", "Pushing processed data back into operational tools (CRM)"],
    ["CRM", "Customer Relationship Management", "Software salespeople use to manage customers and leads"],
    ["Business / operational / embedded analytics", "—", "Strategic history / immediate action / analytics inside the product"],
    ["Query federation", "—", "Querying many sources in place, without copying (Trino, Presto)"],
    ["ODBC", "Open Database Connectivity", "A standard way for programs to connect to databases"],
    ["IaC", "Infrastructure as Code", "Defining infrastructure in version-controlled code (Terraform)"],
    ["GitOps", "—", "Git as the source of truth; the system syncs to it automatically"],
    ["Back-off", "—", "Waiting longer between each retry"],
    ["DevOps / DataOps", "—", "Automation and collaboration for code / for data pipelines"],
    ["TLS", "Transport Layer Security", "Encryption for data in transit"],
    ["RBAC", "Role-Based Access Control", "Access granted according to a person's role"],
    ["CI / CD / CT", "Continuous Integration / Deployment / Training", "Test and retrain on each change / release safely / retrain regularly"],
    ["PR", "Pull Request", "A proposed code change submitted for review"],
    ["Model registry", "—", "A catalogue of trained models and their versions"],
    ["Canary deployment", "—", "Releasing to a small slice of real traffic first"],
    ["A/B test", "—", "Comparing two models on different users"],
    ["Shadow traffic", "—", "A new model runs silently on real requests, without affecting users"],
    ["Data observability / downtime", "—", "Monitoring data health / periods of missing, wrong or late data"],
    ["Feature store", "—", "A shared store of model features for training and serving"],
    ["ETA", "Estimated Time of Arrival", "The predicted delivery time"],
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
### What the examiner wants
A comparison on the unit of storage, mutability (can you rewrite part of it?), access method, typical examples and best use case, ideally as a table, plus one line on where caches, HDFS and streaming storage fit (Lesson 4).

### Model answer
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

**Add-on:** caches (Redis/Memcached) for ultra-low-latency serving, and HDFS where compute and storage must be co-located (Spark on EMR).

### Takeaway
File = directory tree; block = rewritable fixed blocks for databases and disks; object = immutable, key-addressed, cheap and huge, the foundation of data lakes.`,
    },
    {
      title: "Strong vs eventual consistency; distributed storage",
      marks: 5,
      question: "Why do organisations move from single-machine to distributed storage? Explain strong vs eventual consistency with examples, and state which an ML feature store (online) and a financial ledger should use.",
      solution: `
### What the examiner wants
Why distribution creates the consistency question, both definitions with an example each, and the trade-off (correctness vs speed and scale) (Lesson 3).

### Model answer
**Why distributed:** as data and access patterns outgrow one server, storing data across many servers gives **scale** (store, retrieve and process faster in parallel) and **redundancy** (data survives a node failure). Object stores, Spark and cloud warehouses are all distributed.

**The dilemma:** replicating a change to every node takes time, so there is a trade-off between reading the *latest* data and reading *somewhat current* data quickly.

| | Strong consistency | Eventual consistency |
|---|---|---|
| Guarantee | A write reaches **consensus** before completing; every read returns the latest value | Reads return quickly without checking all replicas; replicas **converge** later |
| Latency / availability | Higher latency; may block during partitions | Low latency, highly available |
| Example | Bank balance, inventory decrement, ACID RDBMS | Social-media likes, product view counts, many NoSQL/document stores, DNS |

**Choices:**
- **Financial ledger → strong consistency**, because a stale balance could allow a double spend.
- **Online feature store → usually eventual consistency** (with bounded staleness). Low-latency reads matter most, and a feature like "orders in the last 30 min" that is a few seconds stale barely changes a prediction. Critical features can use stronger guarantees.

### Takeaway
Strong = always the latest value, slower (bank balance). Eventual = fast, maybe briefly stale (like counts). Pick per use case.`,
    },
    {
      title: "Reverse ETL and types of analytics",
      marks: 5,
      question: "What is reverse ETL? Explain with an example and mention its challenge. Differentiate business, operational and embedded analytics.",
      solution: `
### What the examiner wants
Reverse ETL defined with the CRM lead-scoring example and its challenges and tools, then the three analytics types with their focus and an example of each (Lesson 5).

### Model answer
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

The line between business and operational analytics is blurring as real-time data becomes cheaper.

### Takeaway
Reverse ETL puts insights where people already work. Analytics differ mainly by time (history vs now) and audience (internal vs customers).`,
    },
    {
      title: "Layers of the data-science/ML infrastructure stack",
      marks: 5,
      question: "Explain the layers of the data-science infrastructure stack from the bottom up, giving the key challenge at each layer. Why is common infrastructure valuable?",
      solution: `
### What the examiner wants
All eight layers in order with each one's job and key challenge, the reading of the stack (generic foundations → ML-specific top), and the four Vs of shared infrastructure (Lesson 6).

### Model answer
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

**Why common infrastructure:** it increases **volume** (projects run at once), **velocity** (time to market), **validity** (robust results) and **variety** (types of projects supported), instead of every team inventing bespoke processes. The foundational layers are shared; the top layers let data scientists iterate freely (*freedom and responsibility*).

### Takeaway
Model development is the smallest layer; data, compute, scheduling, versioning and model operations do most of the work.`,
    },
    {
      title: "DataOps, CI/CD/CT and observability",
      marks: 5,
      question: "What is DataOps and how does it relate to DevOps? Describe the phases of a CI/CD/CT pipeline for ML with a diagram, and explain data observability.",
      solution: `
### What the examiner wants
DataOps vs DevOps, the four phases (experiment → CI → CD → CT) with what happens in each (tests, registry, canary, A/B, retraining), and data observability and data downtime (Lessons 7–8).

### Model answer
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

**Observability:** monitoring, tracking and **triaging incidents to prevent data downtime** (missing, late or wrong data). It extends DevOps observability to data: freshness, volume, schema, distribution and lineage checks. At DoorDash, poor observability let data issues produce **incorrect ETAs**.

### Takeaway
In ML, CI also retrains and registers the model, CD releases it gradually, and CT keeps retraining it, while observability watches the data feeding it.`,
    },
    {
      title: "Designing an ML platform: the DoorDash case",
      marks: 5,
      question: "DoorDash's ML workflows were fragmented, slow to deploy and hit by data drift. Describe the components of its unified ML platform and how each addresses these problems.",
      solution: `
### What the examiner wants
The problems DoorDash faced, then each platform component and **which problem it solves**. A flow diagram of training vs serving earns marks (Lesson 9).

### Model answer
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

**Result:** a unified, observable, automated, production-grade ML data platform.

### Takeaway
Shared feature store + real-time and historical aggregators + prediction logs + a single-writer model store + an A/B-capable prediction service = fast, observable, auditable ML.`,
    },
    {
      title: "Ways to serve data, including query federation",
      marks: 5,
      question: "Describe the different ways data is served to consumers (files, databases, streaming, query federation, notebooks). When is query federation the right choice, and what are its risks?",
      solution: `
### What the examiner wants
Each serving method with when to use it, and a fuller explanation of query federation: what it is, the tools, its benefits and its risk to production sources (Lesson 5).

### Model answer
| Way | How | Best when |
|---|---|---|
| **File exchange** | Produce files (CSV invoices, text of complaints) for consumers | Simple sharing; depends on use case, consumer process, size, who accesses, data type |
| **Databases (OLAP)** | Query a DW/lake, export results or feed features | Structured, governed access: schema, **fine-grained table/column/row permissions**, high performance and concurrency |
| **Streaming systems** | Emit metrics/events; operational analytics DBs combine OLAP + streams | Real-time and near-real-time use cases |
| **Query federation** | One query engine (Trino/Presto/Starburst) reads many sources (OLTP, OLAP, APIs, files) **in place** | Ad-hoc exploration across silos **without building pipelines/ETL** |
| **Notebooks** | Jupyter connects via libraries/APIs/ODBC | Exploration, feature engineering, training |

**Query federation is right when:** you need to blend data from several systems quickly; you want **read-only** access for consumers (no files, dumps or DB credentials); **access control and compliance are critical**, since users see only the versions they're allowed; or centralising data isn't worth it.

**Risks:** each source has its own usage patterns and quirks. Federated queries hitting **live production OLTP systems** can consume excessive resources and hurt applications. Performance depends on the slowest source. Use it for exploration; for heavy, repeated workloads, build a pipeline into an OLAP store.

### Takeaway
Serve data in the form the consumer needs: files, governed OLAP tables, streams, federated queries or notebooks. Federation queries data in place, without copying it.`,
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
