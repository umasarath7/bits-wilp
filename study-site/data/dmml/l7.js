// DMML — Lecture 7: Data Collection & Ingestion
// Source: CourseFiles/DMML/L7-Data  Collection and Ingestion.pptx (91 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Collection & Ingestion",
  source: "L7-Data Collection and Ingestion.pptx · 91 slides",
  overview:
    "Every ML system starts by **getting data in**. This lecture asks: **why** must you understand your data sources before building anything? **How** can sources be classified, and **what** kinds of source systems exist (databases of many flavours, APIs, webhooks, queues, event streams)? **What** is ingestion, and **why** is it the part of data engineering that breaks most often? **How** do we keep it trustworthy (data contracts, lineage, governance)? And **what** are the specific headaches of batch and streaming ingestion? This lecture **wasn't examined last time**, so it's a strong candidate this time. Running example: Netflix's recommendation system, which the slides use as an exercise.",

  summary: [
    {
      id: "netflix",
      heading: "Lesson 1: Why must you understand your data sources first?",
      slides: "4–7",
      blocks: [
        {
          type: "p",
          text: "Think about what Netflix needs to recommend your next show: what you've rated, what you watched and for how long, what's popular, details about every title, what you searched for, maybe what your friends like. Each of these comes from a **different source**, arrives in a **different way**, and needs **different handling**. The slides turn this into an exercise: classify each source along **four dimensions**:",
        },
        {
          type: "list",
          items: [
            "**Consumption:** is it used in **batch** (periodically) or **real-time** (as it happens)?",
            "**Type:** **structured**, **semi-structured** or **unstructured**?",
            "**Raw or derived:** collected directly, or **computed** from other data?",
            "**Internal or external:** produced by Netflix, or obtained from outside?",
          ],
        },
        {
          type: "table",
          caption: "The Netflix exercise (slides 4–6)",
          head: ["Data", "Consumption", "Type", "Raw/Derived", "Source"],
          rows: [
            ["Billions of member ratings (+1 million a day)", "Batch", "Structured", "Raw", "Internal"],
            ["Popularity metrics (hourly/daily/weekly, by cluster)", "Batch", "Structured", "**Derived**", "Internal"],
            ["Stream data (duration, time, device, day)", "**Real-time**", "Semi-structured", "Raw", "Internal"],
            ["Titles added to queues daily", "Batch", "Structured", "Raw", "Internal"],
            ["Title metadata (director, actors, genre, reviews)", "Batch", "Structured + semi", "Raw", "Internal + external"],
            ["Social data of users and friends", "Batch", "Semi-structured", "Raw", "External"],
            ["Search text", "Batch", "**Unstructured**", "Raw", "Internal"],
            ["Box office, critic reviews", "Batch", "Structured + semi", "Raw", "External"],
            ["Demographics, culture, language, time", "Batch", "Structured", "Derived", "Internal + external"],
          ],
        },
        {
          type: "p",
          text: "**Why bother? (slide 7).** Sources differ in their characteristics and **access patterns**, serve different purposes, and need **different processing**. Real-time viewing data needs a streaming path; external critic reviews need an API and legal checks; derived popularity metrics need a scheduled job. Knowing the sources is what lets you **access and process the data efficiently**.",
        },
      ],
    },
    {
      id: "sources",
      heading: "Lesson 2: How can data sources be categorised?",
      slides: "8–18",
      blocks: [
        {
          type: "p",
          text: "Beyond the Netflix dimensions, the slides give four more ways to classify a source. Each one tells you something practical about how to handle it.",
        },
        {
          type: "p",
          text: "**1. By how it was created (slides 9–10).** **Analog** data (speech, video, handwriting) is transient: it disappears unless captured. **Analog + digital:** a voice assistant converts your speech into text. **Direct digital creation:** a transaction born digital, like a UPI payment.",
        },
        {
          type: "p",
          text: "**2. By whose customers it describes (slides 11–13):**",
        },
        {
          type: "list",
          items: [
            "**First-party data:** about **your own customers** (their purchase history, feedback). *Netflix: your viewing history.*",
            "**Second-party data:** another company's customer data, **shared with you** under an agreement. *MakeMyTrip sharing booking patterns with a hotel chain.*",
            "**Third-party data:** about **the general public**, not your customers (traffic patterns, festival behaviour, census data).",
          ],
        },
        {
          type: "p",
          text: "**3. By who creates it (slides 14–17)**, which is very practical because it predicts how dirty the data will be:",
        },
        {
          type: "table",
          head: ["Created by", "Examples", "What to expect", "How to handle it"],
          rows: [
            ["**Users (user-entered)**", "Names, reviews, images, uploads", "**Often malformed**: absurdly long or short names (‘Llanfairpwll…gogogoch’, ‘Lb’), text in number fields, wrong file formats", "Heavy validation; process quickly (users expect instant feedback)"],
            ["**Systems (system-generated)**", "Logs of memory, instances, job results", "Rarely malformed, but **volume grows fast** and the useful signal gets lost in noise", "Process periodically; keep only while useful; use cheap storage"],
            ["**Systems recording users' behaviour**", "Clicks, scrolls, zooms, ignored pop-ups, location", "Extremely valuable for ML, and **subject to privacy regulation**", "Consent, anonymisation, retention limits (Lecture 2)"],
          ],
        },
        {
          type: "p",
          text: "**4. By format (slide 18):** structured, semi-structured or unstructured (Lecture 1).",
        },
      ],
    },
    {
      id: "systems",
      heading: "Lesson 3: What kinds of database do we ingest from?",
      slides: "19–31",
      blocks: [
        {
          type: "p",
          text: "ML systems usually sit **downstream** of other systems (slide 19): their inputs are the outputs of apps, databases and services built for other purposes. So you must understand the systems you're pulling from, because each has its own strengths and quirks.",
        },
        {
          type: "table",
          head: ["System", "What it's like", "What it means for ingestion", "Examples"],
          rows: [
            ["**Relational (RDBMS / SQL)**", "Tables linked by primary/foreign keys; **ACID** guarantees; normalised; rows stored together", "Ideal for rapidly changing application state. The challenge is capturing **history**: a row shows only the current value", "PostgreSQL, MySQL, Oracle"],
            ["**Key-value**", "Like a hash map, but scalable: in-memory caches (sessions) or durable, replicated stores", "Great for current state (a user's cart); not for analytics queries", "Redis, DynamoDB"],
            ["**Document**", "Nested JSON documents in collections, retrieved by key", "**Flexible schema: a blessing and a curse** (inconsistent, bloated records). **No joins** (data duplicated), often **eventually consistent**, analytics needs full scans", "MongoDB"],
            ["**Wide-column**", "Huge write rates, petabyte scale, millions of requests per second, under 10 ms latency; only **one index (the row key)**", "No complex queries; extract with scans or CDC for analytics", "Cassandra, Bigtable, DynamoDB (e-commerce, fintech, ad tech, IoT)"],
            ["**Search**", "Fast retrieval by meaning and structure: **text search** (exact, fuzzy, semantic) and **log analysis** (anomalies, monitoring, security)", "A source of logs and search behaviour", "Elasticsearch, Solr/Lucene, Algolia"],
            ["**Time-series**", "Values ordered by time: **measurement** (regular sensor readings) or **event-based** (irregular); fast writes buffered in memory; a timestamp and a few fields", "Good for operational analytics, not BI; few joins", "InfluxDB, Druid; stock ticks, IoT, weather"],
          ],
        },
      ],
    },
    {
      id: "apis",
      heading: "Lesson 4: Beyond databases: APIs, webhooks, sharing, queues and streams",
      slides: "32–43",
      blocks: [
        {
          type: "table",
          head: ["Source", "How it works", "Example"],
          rows: [
            ["**REST APIs**", "Stateless HTTP calls; the abstraction ranges from a thin wrapper to a full analytics API", "IRCTC's PNR-status API used by many travel sites"],
            ["**Client libraries / connectors**", "Ready-made code that removes boilerplate; off-the-shelf SaaS connectors; frameworks for building custom ones", "Fivetran/Airbyte connectors"],
            ["**GraphQL**", "Created at Facebook: fetch **several data models in one request**, with a JSON-shaped response exactly as asked", "One call for a user, their orders and their reviews"],
            ["**Webhooks** (reverse APIs)", "Instead of you asking repeatedly, **the provider calls your HTTP endpoint** when an event happens", "A payment gateway notifying you that a payment succeeded"],
            ["**RPC / gRPC**", "Google, 2015: Protocol Buffers over HTTP/2; efficient two-way exchange (saves CPU, battery, bandwidth); stricter than REST", "Internal microservices"],
            ["**Data sharing platforms**", "Multi-tenant cloud platforms with fine-grained sharing (row, column, sensitive-field filters); **data marketplaces**. Enables decentralised patterns such as **data mesh**", "Snowflake/BigQuery sharing"],
            ["**Third-party data**", "data.gov.in, US Bureau of Labor Statistics, NASA, Facebook for advertisers; accessed via APIs, cloud sharing or downloads. Data is **sticky**: once integrated, it creates a flywheel of adoption", "Enriching customers with public data"],
            ["**Message queues**", "Small messages sent asynchronously via **publish/subscribe**; the subscriber **acknowledges** and the message is **removed**. Decouples microservices, buffers load spikes, durable through replication", "RabbitMQ, SQS"],
            ["**Event-streaming platforms**", "An **ordered log** of records **kept for a while** (retention) that can be **replayed**", "Kafka, Kinesis, Pub/Sub"],
          ],
        },
        {
          type: "p",
          text: "**Topics and partitions (slides 41–43).** In an event-streaming platform, a **topic** is a named stream of related events (e.g. “video-plays”), with zero or more producers and consumers. A topic is split into **partitions**, like the **lanes of a freeway**: more lanes means more events processed in parallel. Each event has a **partition key** (e.g. user-id), and events with the same key always go to the same partition, so one user's events stay in order.",
        },
        {
          type: "callout",
          kind: "idea",
          title: "Queue vs stream in one line",
          text: "A **queue** delivers a message and **forgets it** once acknowledged. A **stream** **keeps an ordered log** you can replay: it's a history, not just a mailbox.",
        },
      ],
    },
    {
      id: "ingest",
      heading: "Lesson 5: What is ingestion, and why does it break so often?",
      slides: "44–51",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Definition",
          text: "**Data ingestion** moves data from a **source** into a **landing area** (often object storage) where it can be queried and analysed: *consume from the origin → clean it a little → write it to the destination.*",
        },
        {
          type: "p",
          text: "**Why it matters (slides 45–46):** ingestion **helps teams go fast**. It has a narrow scope, supports agility, and gives analysts and scientists **self-service** access. Examples: Salesforce → data warehouse → Tableau dashboards; a Twitter feed → real-time sentiment analysis; collecting data for ML training.",
        },
        {
          type: "table",
          caption: "Why ingestion is hard (slides 47–48)",
          head: ["Challenge", "What happens"],
          rows: [
            ["**Complexity takes time**", "Building a pipeline from scratch for every new source or request slows the team down"],
            ["**Change takes time**", "Each change to a target costs 10–20 hours; about **90% of engineering time goes on maintenance and break-fix**, mostly caused by **data drift** (sources changing without warning)"],
            ["**Maintenance and rework**", "Constant troubleshooting leaves no time for new work"],
          ],
        },
        {
          type: "table",
          caption: "Four ways to build ingestion (slides 49–50)",
          head: ["Approach", "Trade-off"],
          rows: [
            ["**Hand coding**", "Maximum control, but lots of work and rework"],
            ["**Single-purpose tools**", "Drag-and-drop with prebuilt connectors, quick to start; cumbersome to manage many, hard to share"],
            ["**Data integration platforms**", "Features for every step; need specialist developers; slow to adapt"],
            ["**DataOps approach**", "Agile + automation; abstracts the *how* so engineers focus on the *what* and on business needs"],
          ],
        },
        {
          type: "p",
          text: "**Typical sources (slide 51):** Kafka, JDBC databases, Oracle CDC, HTTP clients, HDFS. **Typical destinations:** Kafka, JDBC databases, Snowflake, Amazon S3, Databricks. Ingestion is also central to **cloud migration**: moving on-prem silos into cloud lakes and warehouses. The more of the “what-ifs” are automated, the better.",
        },
      ],
    },
    {
      id: "contract",
      heading: "Lesson 6: How do we keep ingestion trustworthy? Contracts, lineage, governance",
      slides: "52–59",
      blocks: [
        {
          type: "p",
          text: "Remember the Lecture 4 story: the payments team renamed a column and every dashboard broke silently. The fix isn't more heroics; it's **agreements and visibility**.",
        },
        {
          type: "p",
          text: "**Data contract (slides 52–53).** A written agreement between the **owner of the source system** and the **team ingesting from it**, stating: **what** data will be provided; **how** (full extract or incremental); **how often**; and **who** the contacts are on both sides. Keep it in a well-known place (a GitHub repository, internal docs), ideally in a standard, machine-readable format so it can be checked automatically. *Netflix example:* the playback team promises the “video-plays” events will always contain user-id, title-id, start time and duration, with 7 days' notice before any change.",
        },
        {
          type: "p",
          text: "**Data lineage (slide 54).** Documentation and visualisation of **data's journey**: where it originated, how it was transformed through pipelines, and where it's served (dashboards, reports, models). Building it means identifying data assets, tracking them from their sources, documenting the sources, mapping the paths, and pinpointing where the data is consumed. When a number looks wrong, lineage tells you where to look.",
        },
        {
          type: "p",
          text: "**Data governance at ingestion (slide 55).** Governance is the discipline of ensuring data **quality, security and availability**, through policies, standards and procedures covering collection, ownership, storage, processing and use. At the ingestion stage it **stops bad data from spreading** downstream, ensures **compliance** with regulations (GDPR, HIPAA, PCI-DSS, India's DPDPA, rules for PII), and builds **traceability and trust** in the source.",
        },
        {
          type: "table",
          caption: "Questions to ask before ingesting anything (slides 56–59)",
          head: ["Consideration", "Question"],
          rows: [
            ["Use case", "What is this data for?"],
            ["Reusability", "Can we reuse existing data and avoid ingesting several versions of the same dataset?"],
            ["Lineage", "Where is the data going?"],
            ["Freshness", "How often must it be refreshed from the source?"],
            ["Volume", "How much data do we expect?"],
            ["Format", "What format, and can downstream storage and transformation handle it?"],
            ["Quality", "Is it good enough to use immediately downstream?"],
            ["Risks", "What post-processing is needed? What quality risks exist?"],
            ["Velocity", "Does streaming data need processing in flight?"],
          ],
        },
      ],
    },
    {
      id: "batch",
      heading: "Lesson 7: How does batch ingestion work?",
      slides: "60–65",
      blocks: [
        {
          type: "p",
          text: "**Batch ingestion** moves data in chunks. Four decisions shape it:",
        },
        {
          type: "list",
          items: [
            "**When to cut a batch.** **Time-interval:** e.g. every night, for daily warehouse reports. **Size-based:** cut a stream into objects once they reach a certain number of bytes or events, useful for writing to a lake.",
            "**How much to take.** **Full snapshot:** grab the entire current state every time; simple and very common. **Differential (incremental):** take only what changed since the last run; less network and storage, but you must track what changed.",
            "**Inserts and updates.** Columnar and batch-oriented stores perform **badly with many small operations**: single-row inserts and frequent small in-place updates are anti-patterns (each update may rewrite whole column files). Know your store: Druid and Pinot handle high insert rates; SingleStore handles hybrid OLTP + OLAP; BigQuery is poor at single-row SQL inserts but excellent through its **streaming buffer**.",
            "**Data migration.** Moving hundreds of terabytes or whole databases: there are **always schema differences**, so test on a sample first; move data in **bulk**, not row by row; use object storage as an intermediate stage; use migration tools. For petabytes to exabytes, the **AWS Snow family** physically ships storage devices.",
          ],
        },
      ],
    },
    {
      id: "stream",
      heading: "Lesson 8: What makes streaming ingestion tricky?",
      slides: "66–75",
      blocks: [
        {
          type: "p",
          text: "Streaming means ingesting events **as they happen**, continuously. That brings problems batch never has. Imagine Netflix's “video-plays” stream from millions of phones and TVs:",
        },
        {
          type: "table",
          head: ["Concern", "What goes wrong", "How to handle it"],
          rows: [
            ["**Schema evolution**", "Producers add or remove fields or change types, and consumers break", "A **schema registry** to version schemas; talk to upstream teams proactively"],
            ["**Late-arriving data**", "Events that happened at the same time arrive at different times (a phone on a train reconnects an hour later; the slides' example is a driver-monitoring camera whose frames lag)", "Set a **cut-off time (watermark)** after which late events for a window are no longer processed"],
            ["**Ordering and duplicates**", "Distributed platforms can deliver events **out of order** and **more than once** (**at-least-once** delivery); exactly-once is very hard. Think of getting the same bank SMS twice", "**Idempotent** consumers (processing twice has the same effect as once), de-duplication keys, ordering by event time"],
            ["**Replay**", "You need to reprocess a period of history, e.g. after fixing a bug", "Kafka, Kinesis and Pub/Sub keep data and allow replay; RabbitMQ deletes messages once consumed"],
            ["**Message size**", "Kinesis allows at most 1 MB; Kafka defaults to 1 MB (configurable to 20 MB+)", "Send a small pointer/notification and fetch the big payload via an API (adds delay)"],
            ["**TTL (time-to-live) / retention**", "How long unacknowledged events are kept: too short and they vanish before processing; too long and a backlog builds", "Pub/Sub up to 7 days; Kinesis up to 365 days; Kafka indefinitely (limited by disk)"],
            ["**Error handling**", "An event for a topic that doesn't exist, an oversized message, an expired TTL", "Route failures to a **dead-letter queue (DLQ)** so they don't block good events; diagnose and reprocess later"],
            ["**Push vs pull**", "**Pull:** consumers read and acknowledge (Kafka and Kinesis are pull-only; the usual default). **Push:** the service writes to a listener (Pub/Sub and RabbitMQ also support push)", "Add a small layer to emulate push on pull-only systems"],
          ],
        },
      ],
    },
    {
      id: "ways",
      heading: "Lesson 9: All the practical ways to ingest data",
      slides: "76–91",
      blocks: [
        {
          type: "p",
          text: "Finally, the toolbox. You'll use several of these in any real project; pick by source type, volume, freshness needed and security.",
        },
        {
          type: "p",
          text: "**From databases.** A **direct connection (ODBC/JDBC)** uses a driver that translates a standard API into the database's own commands; pull with many small queries or one big one (JDBC is Java-based and very portable). **Change Data Capture (CDC)** captures changes instead of copying everything:",
        },
        {
          type: "table",
          head: ["CDC style", "How it works", "Watch out for"],
          rows: [
            ["**Batch CDC**", "Query rows whose `updated_at` is later than the last run", "**Misses intermediate changes**: if a row changed three times, you see only the last. Mitigate with an insert-only schema"],
            ["**Continuous / log-based CDC**", "Treat every write as an event: read the database's **binary log** and send each change to Kafka with **Debezium**", "Near real-time replication and analytics"],
            ["**Managed CDC**", "The cloud database triggers a serverless function or event stream for each change", "Vendor-specific"],
          ],
        },
        {
          type: "p",
          text: "CDC is not free: it uses the database's memory, disk, CPU and network. Run batch CDC off-hours or against a **read replica** so the production database isn't slowed.",
        },
        {
          type: "table",
          caption: "Other ways to ingest (slides 80–91)",
          head: ["Way", "Key points"],
          rows: [
            ["**APIs**", "There's no standard for data exchange: read the docs, talk to the owners, maintain the code. Trends: vendor client libraries, **connector platforms** (SaaS/open source), **data-sharing** platforms (BigQuery, Snowflake, Redshift, S3)"],
            ["**Message queues / event streams**", "Real-time ingestion from web, mobile and IoT; can be non-linear (publish → consume → republish)"],
            ["**Object storage**", "The best and most secure way to exchange files: multi-tenant, massive, **signed URLs** for temporary access"],
            ["**File export**", "Exports scan and load the transactional database, so run them at safe times, split by key range/partition, or use a read replica. Cloud warehouses can export straight to object storage"],
            ["**Shell and SSH**", "Shell scripts glue steps together (read DB → reserialise → upload → trigger load). SSH tunnels through a **bastion host** give secure database access; SCP copies files over SSH"],
            ["**SFTP / SCP**", "Still common for exchanging files with partners; needs careful security setup"],
            ["**Webhooks**", "The provider calls *your* endpoint. A typical build: AWS Lambda receives → Kinesis buffers → stream processing"],
            ["**Web interface / scraping**", "Manually downloading reports; scraping web pages is ethically and legally murky"],
            ["**Data sharing**", "Read-only access to a provider's dataset; you don't own it and can lose access"],
            ["**Transfer appliances**", "For 100 TB or more, physically ship a box of drives (AWS Snow family). Only for one-time migrations"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in seven lines",
          text: "1. Know your sources: classify by consumption (batch/real-time), type, raw vs derived, internal vs external (Netflix exercise).\n2. Also by creation (analog → digital), whose customers (1st/2nd/3rd party), creator (user-entered = messy; system logs = noisy; user behaviour = privacy-regulated), format.\n3. Source databases: relational, key-value, document (flexible schema: blessing and curse), wide-column (one row-key index), search, time-series. Plus REST, GraphQL, webhooks, gRPC, data sharing, third-party data, queues and streams (topics, partitions).\n4. Ingestion = consume → light clean → land. Hard because ~90% of time goes on break-fix from data drift. Hand code vs tools vs platforms vs DataOps.\n5. Trust: **data contracts** (what, how, how often, who), **lineage**, **governance** (quality, security, compliance). Ask about use, reuse, freshness, volume, format, quality, risk, velocity.\n6. Batch: time vs size cut-offs; full snapshot vs incremental; avoid small inserts/updates in columnar stores; migrations in bulk.\n7. Streaming: schema evolution (registry), late data (watermarks), duplicates/order (idempotency), replay, size, TTL, dead-letter queues, push vs pull. CDC batch vs log-based (Debezium); use read replicas.",
        },
      ],
    },
  ],

  glossary: [
    ["Batch / real-time consumption", "—", "Data used periodically / as it happens"],
    ["Raw / derived data", "—", "Collected directly / computed from other data"],
    ["First / second / third-party data", "—", "Your customers / a partner's customers shared with you / the general public"],
    ["User-entered / system-generated data", "—", "Typed or uploaded by people / produced by machines (logs)"],
    ["Downstream", "—", "Consuming the outputs of other systems"],
    ["RDBMS", "Relational DataBase Management System", "Tables, keys, SQL, ACID"],
    ["ACID", "Atomicity, Consistency, Isolation, Durability", "Reliable transaction guarantees"],
    ["Wide-column database", "—", "Massive write throughput with a single row-key index (Cassandra)"],
    ["Eventual consistency", "—", "Copies catch up after a short delay"],
    ["Time-series database", "—", "Stores values ordered by time (InfluxDB)"],
    ["REST API", "Representational State Transfer Application Programming Interface", "Stateless HTTP interface"],
    ["GraphQL", "—", "API query language: several data models in one request"],
    ["Webhook", "Reverse API", "The provider calls your endpoint when an event happens"],
    ["gRPC", "Google Remote Procedure Call", "Fast binary RPC over HTTP/2"],
    ["Data marketplace", "—", "A platform for buying, selling or sharing datasets"],
    ["Publish/subscribe (pub/sub)", "—", "Producers publish to a topic; subscribers receive"],
    ["Acknowledgement", "—", "The consumer confirming it processed a message"],
    ["Event streaming", "—", "An ordered, retained, replayable log of events"],
    ["Topic / partition / partition key", "—", "Named stream / parallel lane / field deciding the lane"],
    ["Data ingestion", "—", "Moving data from sources into a landing area"],
    ["Landing area", "—", "Where ingested data first arrives (often object storage)"],
    ["Data drift (sources)", "—", "Unannounced changes in source data that break pipelines"],
    ["Data contract", "—", "Agreement on what, how, how often and who between source and ingestion teams"],
    ["Data lineage", "—", "The documented journey of data from origin to use"],
    ["HIPAA / PCI-DSS / DPDPA", "US health privacy law / Payment Card Industry Data Security Standard / India's Digital Personal Data Protection Act", "Regulations governing sensitive data"],
    ["Full snapshot / incremental", "—", "Copy everything each time / copy only changes"],
    ["Schema registry", "—", "A service storing versioned schemas for streams"],
    ["Late-arriving data", "—", "Events that arrive long after they happened"],
    ["Watermark", "—", "A cut-off after which late events are no longer accepted"],
    ["At-least-once / exactly-once", "—", "Delivered one or more times / delivered exactly once (hard)"],
    ["Idempotent", "—", "Doing it twice has the same effect as doing it once"],
    ["TTL", "Time To Live", "How long an unacknowledged event is kept"],
    ["DLQ", "Dead-Letter Queue", "Where failed events go for later diagnosis"],
    ["Push / pull", "—", "The service sends to consumers / consumers fetch from the service"],
    ["ODBC / JDBC", "Open / Java Database Connectivity", "Standard driver APIs for connecting to databases"],
    ["CDC", "Change Data Capture", "Capturing each insert, update and delete"],
    ["Debezium", "—", "Open-source tool for log-based CDC into Kafka"],
    ["Read replica", "—", "A copy of a database used for reads, to protect production"],
    ["Signed URL", "—", "A temporary link granting access to one object"],
    ["Bastion host", "—", "A secure “jump” server for SSH access"],
    ["SFTP / SCP", "SSH File Transfer Protocol / Secure Copy", "Secure file transfer methods"],
  ],

  examTips: [
    "Selection bias (PYQ Q6) sits in L8, but **data sources** are where it starts. Link *convenient sources* → selection bias in your answers.",
    "The Netflix table is a ready-made example for any “classify data sources” question. Reproduce 4–5 rows.",
    "Streaming questions: list **schema evolution, late data, ordering/duplicates, replay, size, TTL, DLQ, push/pull** with one line of mitigation each.",
    "CDC: distinguish **batch (updated_at) vs log-based continuous** and mention the load on the source (use a read replica).",
  ],

  theory: [
    {
      title: "Classifying ML data sources (Netflix exercise)",
      marks: 5,
      question: "Taking Netflix's recommendation system as an example, explain how the data sources of an ML system can be categorised. Classify at least five sources by consumption, type, raw/derived and internal/external, and explain why knowing the source matters.",
      solution: `
### What the examiner wants
The four dimensions (consumption, type, raw vs derived, internal vs external) applied to at least 4–5 real sources in a table, plus **why** classification matters (access patterns and processing differ) (Lessons 1–2).

### Model answer
**Categorisation axes:** consumption (batch vs real-time), type (structured/semi/unstructured), raw vs derived, internal vs external. Also by **creation** (analog/digital), **location** (1st/2nd/3rd party) and **creator** (user-entered, system-generated, system-generated user data).

| Netflix data | Consumption | Type | Raw/Derived | Source |
|---|---|---|---|---|
| Billions of ratings (+1M/day) | Batch | Structured | Raw | Internal |
| Popularity metrics (hourly/daily, per cluster) | Batch | Structured | **Derived** | Internal |
| Streaming context (duration, device, time) | **Real-time** | Semi-structured | Raw | Internal |
| Search queries | Batch | **Unstructured** | Raw | Internal |
| Social data of users and friends | Batch | Semi-structured | Raw | **External** |
| Box office, critic reviews | Batch | Structured + semi | Raw | External |
| Demographics, language, temporal | Batch | Structured | Derived | Internal + external |

**Why the source matters:**
1. **Access:** batch sources can be pulled nightly via JDBC/files; real-time sources need a stream (Kafka).
2. **Processing:** unstructured search text needs NLP; derived metrics need upstream jobs and lineage.
3. **Quality and compliance:** user-entered and social data need validation and **privacy** handling; third-party data needs contracts and licences.
4. **Freshness:** real-time context must reach the model within seconds, while catalogue metadata can refresh daily.

### Takeaway
Classifying sources tells you how to ingest each one: streaming vs batch path, parser, legal checks, refresh schedule.`,
    },
    {
      title: "NoSQL source systems compared",
      marks: 5,
      question: "Compare the NoSQL source systems (key-value, document, wide-column, search, time-series) in terms of data model, strengths, limitations and typical use cases. How does a data engineer extract analytics data from them?",
      solution: `
### What the examiner wants
Each NoSQL type's structure, strengths and weaknesses **for ingestion** (joins, consistency, indexes), with examples, as a table (Lesson 3).

### Model answer
| Type | Model | Strengths | Limitations | Use cases / examples |
|---|---|---|---|---|
| **Key-value** | key → value (hash map) | Ultra-fast lookups, high concurrency; in-memory or durable | Lookup by key only | Sessions, carts, caching (Redis, DynamoDB) |
| **Document** | Nested JSON documents in collections | Flexible, evolving schema; related data in one document; indexes | **No joins**, duplicated data; often eventually consistent; analytics needs full scans | Catalogues, user profiles (MongoDB) |
| **Wide-column** | Rows with many columns, one row key | PB scale, millions of req/s, <10 ms latency, huge write rates | **Single index**; no complex queries | Ad tech, IoT, fintech, personalisation (Cassandra, Bigtable) |
| **Search** | Inverted indexes | Fast text search (exact/fuzzy/semantic), log analysis | Not a system of record | Site search, security/log analytics (Elasticsearch, Solr) |
| **Time-series** | Timestamp + few fields | Fast writes/reads, memory buffering, time-window statistics | Few joins; not great for BI | IoT sensors, stock ticks, monitoring (InfluxDB, Druid) |

**Extraction for analytics/ML:** these systems are tuned for operational access, not analytical scans. So:
- run **large scans/exports** off-hours or on replicas, or
- use **CDC / change streams** to capture updates as an event stream into Kafka → lake/warehouse, or
- use native connectors in ingestion tools.

Then model the data in the warehouse/lakehouse for training.

### Takeaway
Key-value = current state; document = flexible but inconsistent; wide-column = huge writes, one index; search = text and logs; time-series = ordered measurements.`,
    },
    {
      title: "Streaming ingestion challenges",
      marks: 5,
      question: "What challenges must be handled when ingesting streaming data? Explain schema evolution, late-arriving data, ordering and multiple delivery, replay, message size, TTL, error handling (dead-letter queue) and push vs pull.",
      solution: `
### What the examiner wants
Each concern named with **what goes wrong** and **a mitigation**: schema evolution, late data, ordering and duplicates, replay, message size, TTL, error handling, push vs pull (Lesson 8).

### Model answer
| Challenge | What happens | How to handle |
|---|---|---|
| **Schema evolution** | Producers add/remove fields or change types | **Schema registry** (versioned schemas); proactive communication with upstream teams |
| **Late-arriving data** | Events with similar event times arrive at different ingestion times (network latency, e.g. driver-monitoring camera frames) | Process by **event time** and set a **cut-off (watermark)** after which late events are dropped or handled separately |
| **Ordering & multiple delivery** | Distributed brokers can reorder messages and deliver **at-least-once**, so duplicates appear (a bank SMS twice) | **Idempotent** consumers, de-duplication by event id, partition keys for per-key ordering |
| **Replay** | Need to reprocess a time range | Platforms with retention + replay (Kafka, Kinesis, Pub/Sub); RabbitMQ deletes after consumption |
| **Message size** | Limits (Kinesis 1 MB; Kafka 1 MB default, up to 20 MB+) | Send a notification/pointer, then fetch the payload via API |
| **TTL** | Unacknowledged events expire | Tune retention: too short loses data, too long builds a backlog (Pub/Sub 7 days, Kinesis 365, Kafka unlimited) |
| **Error handling** | Bad topic, oversized or expired events block the flow | Route to a **dead-letter queue**, diagnose, fix, reprocess |
| **Push vs pull** | How consumers receive | **Pull** (Kafka, Kinesis) is the default for data engineering; **push** (Pub/Sub, RabbitMQ) for special cases |

\`\`\`flow
Producers -> Topic (partitions by key) -> Consumer (idempotent, event-time windows, watermark) -> Sink
Consumer -> failures -> Dead-letter queue -> Fix & replay
\`\`\`

### Takeaway
Streams are unordered, duplicated, late and ever-changing; registries, watermarks, idempotency, replay and dead-letter queues tame them.`,
    },
    {
      title: "Change data capture (CDC)",
      marks: 5,
      question: "What is Change Data Capture? Explain batch, continuous (log-based) and managed CDC with their trade-offs. What precautions must be taken when running CDC on a production database?",
      solution: `
### What the examiner wants
What CDC is and why it beats full copies, the three styles (batch, log-based, managed) with their trade-offs, the load it puts on the source, and a use case such as replication or failover (Lessons 7 and 9).

### Model answer
**CDC** captures changes (insert/update/delete) made to a source database, so they can be ingested periodically or continuously for analytics, replication or ML, without full reloads.

**1. Batch-oriented CDC**
- The table has an **updated_at** column. Query rows changed since the last run and differentially update the target.
- *Limitation:* you get only the **latest state**, not every intermediate change (a row updated 3 times between runs shows once).
- *Mitigation:* an **insert-only schema** (each change is a new row, e.g. each account transaction).

**2. Continuous CDC**
- Captures **all table history**; each write is an **event**; supports near real-time replication and streaming analytics.
- **Log-based:** read the DB's **binary / write-ahead log** (e.g. PostgreSQL) sequentially and publish events to **Kafka** via **Debezium**.

\`\`\`flow
App writes -> PostgreSQL (WAL / binlog) -> Debezium CDC -> Kafka topic -> Stream processing -> Lakehouse / feature store
\`\`\`

**3. Managed CDC:** cloud DBs trigger a **serverless function** or write to an **event stream** on every change (e.g. DynamoDB Streams → Lambda).

**Precautions:** CDC consumes the DB's memory, disk bandwidth, storage, CPU and network.
- Run **batch CDC** queries **off-hours**, or against a **read replica** (preferably read-only), to avoid slowing the primary.
- Monitor log retention so the CDC reader doesn't fall behind.
- Handle **schema changes** in the source.

*Use case:* keeping an e-commerce inventory replica and an analytics store current with minimal data loss.

### Takeaway
Batch CDC (updated_at) is simple but misses intermediate changes; log-based CDC (Debezium) captures every change in near real time. Use a read replica to protect production.`,
    },
    {
      title: "Data contracts, lineage and governance at ingestion",
      marks: 5,
      question: "Explain data contracts, data lineage and data governance. Why are they especially important at the data ingestion stage?",
      solution: `
### What the examiner wants
A definition and practical example for each of the three, and how together they stop bad data spreading and build trust. Mention compliance regimes (Lesson 6).

### Model answer
**Data contract:** a written agreement between the **owner of a source system** and the **team ingesting its data**, stating:
- **what** data is extracted
- **how** (full or incremental)
- **how often**
- **who** the contacts are on both sides

Store it in a well-known place (Git repo, docs site), ideally in a standard machine-readable format so it can be validated in CI or queried.
*Why:* unexpected **schema changes** are among the most common causes of data-quality issues. The contract makes changes explicit and agreed.

**Data lineage:** the documentation and visualisation of data's journey: origin → transformations in pipelines → where it is served (dashboards, reports, models). Producing it means identifying assets, tracking them from sources, documenting sources, mapping paths and pinpointing consumption.
*Why:* impact analysis ("which dashboards break if this column changes?"), debugging, audit and regulation (e.g. BCBS 239 in banking).

**Data governance:** the discipline covering **quality, security and availability** of data through policies, standards and procedures for collection, ownership, storage, processing and use.

**Why at ingestion (the entry point):**
- stops **bad data propagating** downstream (shift-left)
- ensures **regulatory compliance** from the start: GDPR, HIPAA, PII, PCI-DSS, DPDPA
- creates **traceability and trust** in each source

\`\`\`flow
Source owner + Ingestion team -> Data contract (what/how/when/who) -> Ingestion with validation -> Lineage recorded -> Governed, trusted data downstream
\`\`\`

### Takeaway
Contracts prevent surprises, lineage explains problems, governance enforces quality and compliance: three layers of trust at the front door.`,
    },
    {
      title: "Choosing ingestion methods for scenarios",
      marks: 5,
      question: "Recommend and justify an ingestion method for each: (a) nightly load of an on-prem Oracle orders table, (b) near-real-time replication of a PostgreSQL inventory DB to analytics, (c) a SaaS payment provider notifying you of each payment, (d) a partner that drops daily CSVs, (e) migrating 400 TB from an on-prem data centre to the cloud.",
      solution: `
### What the examiner wants
For each scenario, a method **and the reason** (volume, freshness, source type, security), with the tool named (Lessons 7–9).

### Model answer
| Scenario | Method | Why |
|---|---|---|
| (a) Nightly Oracle orders | **Batch via JDBC/ODBC** (differential using updated_at), or **file export** to object storage | Time-interval batch fits daily reporting. Run off-hours or on a **read replica** to protect the OLTP DB |
| (b) Near-real-time inventory | **Log-based CDC** (Debezium → Kafka) | Captures every change with low latency and little extra query load |
| (c) SaaS payment notifications | **Webhook** (Lambda endpoint → Kinesis/Kafka buffer → processing) | The provider pushes events; a buffer handles spikes; route failures to a **DLQ** |
| (d) Partner daily CSVs | **SFTP / object storage** with **signed URLs**, plus schema validation | Common partner pattern; object storage is secure and scalable; validate against a **data contract** |
| (e) 400 TB migration | **Transfer appliance** (AWS Snow family), then incremental sync | Over 100 TB, shipping drives is faster and cheaper than the network. One-time only; test schema compatibility on a sample first |

**General considerations** (slide 58): use case, reusability, lineage, freshness, volume, format, quality, risks, velocity.

### Takeaway
Pick the ingestion method from four facts: what the source is, how much data, how fresh it must be, and how sensitive it is.`,
    },
    {
      title: "Message queues vs event-streaming platforms",
      marks: 5,
      question: "Differentiate message queues and event-streaming platforms. Explain topics and partitions with the freeway analogy, and state when you'd use each for ML data ingestion.",
      solution: `
### What the examiner wants
How each works (delete after acknowledgement vs retained, ordered log), replay, ordering and partitions, typical tools, and when to use each (Lesson 4).

### Model answer
| | Message queue | Event-streaming platform |
|---|---|---|
| Purpose | **Route** small messages between decoupled systems with delivery guarantees | **Ingest and process** data as an **ordered log** of records |
| After consumption | Subscriber **acknowledges** and the message is **removed** | Data is **retained** for a configured time |
| Replay | No | **Yes**: rewind to any past point |
| Model | Pub/sub queue | Topics with partitions |
| Examples | RabbitMQ, ActiveMQ, SQS | **Kafka**, Kinesis, Pulsar, Pub/Sub |

**Topics:** a producer writes events to a **topic**, a collection of related events (fraud alerts, orders, IoT temperatures). There can be zero, one or many producers and consumers.
**Partitions:** a topic is split into **partitions**, like the **lanes of a multi-lane freeway**. More lanes means parallelism and higher throughput. Messages are assigned by **partition key**, and the same key always lands in the same partition, which preserves per-key order (e.g. all events of one customer).

\`\`\`flow
Producers -> Topic "clicks" -> Partition 0 | Partition 1 | Partition 2 -> Consumer group (parallel)
\`\`\`

**For ML:**
- **Queue:** task distribution to microservices, e.g. "score this document" requests (model-on-demand serving).
- **Streaming platform:** collecting clickstream/IoT events for **real-time features** and **replaying history** to rebuild training sets or backfill features (Kappa-style).

### Takeaway
A queue is a mailbox that forgets delivered messages; a stream is a replayable history. ML pipelines usually want the history.`,
    },
  ],

  quiz: [
    { q: "MakeMyTrip sharing its customer data with partner hotels is:", options: ["First-party data", "Second-party data", "Third-party data", "Synthetic data"], answer: 1, why: "Another company's own-customer data shared with you." },
    { q: "Clicks, scrolls and location captured by an app are:", options: ["User-entered data", "System-generated data (logs)", "System-generated user data (privacy-regulated)", "Third-party data"], answer: 2, why: "System-generated but still about the user." },
    { q: "Which NoSQL type has only a single row-key index but massive write throughput?", options: ["Document", "Wide-column", "Search", "Graph"], answer: 1, why: "Cassandra, Bigtable, DynamoDB." },
    { q: "A provider calling YOUR HTTP endpoint when an event occurs is a:", options: ["REST poll", "Webhook", "gRPC stream", "JDBC connection"], answer: 1, why: "Also called a reverse API." },
    { q: "Messages with the same partition key in Kafka:", options: ["Go to random partitions", "Always go to the same partition", "Are dropped", "Go to the DLQ"], answer: 1, why: "This preserves per-key ordering." },
    { q: "Events that repeatedly fail ingestion should be routed to:", options: ["The source DB", "A dead-letter queue", "The TTL buffer", "The feature store"], answer: 1, why: "So they don't block good messages." },
    { q: "Most streaming platforms guarantee:", options: ["Exactly-once always", "At-least-once (possible duplicates)", "At-most-once only", "No delivery guarantee"], answer: 1, why: "Exactly-once is very hard in distributed systems." },
    { q: "Batch CDC using an updated_at column misses:", options: ["New rows", "Intermediate changes between runs", "Deleted tables", "Schema"], answer: 1, why: "It sees only the latest state." },
    { q: "For migrating 400 TB, the recommended method is:", options: ["SFTP", "Webhooks", "Transfer appliance (e.g. AWS Snowball)", "JDBC row by row"], answer: 2, why: "Over 100 TB, physical transfer beats the network." },
    { q: "A written agreement on what/how/how often/who between source owner and ingesting team is a:", options: ["Data lineage", "Data contract", "SLA dashboard", "Schema registry"], answer: 1, why: "A data contract." },
  ],
};
