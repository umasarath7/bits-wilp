// DMML — Lecture 7: Data Collection and Ingestion
// Source: CourseFiles/DMML/L7-Data  Collection and Ingestion.pptx (93 slides)

export default {
  title: "Data Collection & Ingestion",
  source: "L7-Data Collection and Ingestion.pptx · 93 slides",
  overview:
    "Where ML data comes from and how it gets in. The lecture opens with the **Netflix recommendation data-source exercise**, then categorises **data sources** (by creation, location: 1st/2nd/3rd party, and creator: user-entered, system-generated, system-generated user data) and **source systems** (RDBMS; NoSQL key-value, document, wide-column, search, time-series; APIs, GraphQL, webhooks, gRPC; data sharing; third-party data; message queues and event streams). It covers **ingestion** (why, challenges, tool types), **data contracts, lineage and governance**, **key engineering considerations**, **batch vs streaming ingestion** concerns (late data, ordering, at-least-once, replay, TTL, dead-letter queue, push/pull), and every **way to ingest** (JDBC/ODBC, CDC, APIs, object storage, SFTP, webhooks, scraping, transfer appliances).",

  summary: [
    {
      id: "netflix",
      heading: "1. Exercise: Netflix recommendation data sources",
      slides: "4–7",
      blocks: [
        { type: "p", text: "Classify each source along four dimensions: **consumption** (batch/real-time), **type** (structured/semi/unstructured), **raw vs derived**, and **internal vs external**." },
        {
          type: "table",
          head: ["Data", "Consumption", "Type", "Raw/Derived", "Source"],
          rows: [
            ["Billions of member ratings (+1M/day)", "Batch", "Structured", "Raw", "Internal"],
            ["Popularity metrics (hourly/daily/weekly, by cluster)", "Batch", "Structured", "**Derived**", "Internal"],
            ["Stream data (duration, time, device, day)", "**Real-time**", "Semi-structured", "Raw", "Internal"],
            ["Titles added to queues daily", "Batch", "Structured", "Raw", "Internal"],
            ["Title metadata (director, actor, genre, reviews)", "Batch", "Structured + semi", "Raw", "Internal + external"],
            ["Social data of users and friends", "Batch", "Semi-structured", "Raw", "External"],
            ["Search text", "Batch", "**Unstructured**", "Raw", "Internal"],
            ["Box office, critic reviews", "Batch", "Structured + semi", "Raw", "External"],
            ["Demographics, culture, language, temporal", "Batch", "Structured", "Derived", "Internal + external"],
          ],
        },
        { type: "p", text: "**Why know the sources?** Sources differ in characteristics and access patterns, serve different purposes and need different processing. Knowing them lets us **access** and **process** the data efficiently." },
      ],
    },
    {
      id: "sources",
      heading: "2. Categorising data sources",
      slides: "8–18",
      blocks: [
        {
          type: "table",
          head: ["Axis", "Categories"],
          rows: [
            ["**Creation**", "*Analog* (speech, video, handwriting: transient) → *analog + digital* (voice assistants convert speech → text) → *direct digital creation* (transactions)"],
            ["**Location**", "**First-party:** your own customers' data (purchase history, feedback). **Second-party:** another company's customer data shared with you (MakeMyTrip → hotels). **Third-party:** data about the public, not your customers (traffic, festival behaviour)"],
            ["**Creator**", "**User-entered:** texts, images, uploads; likely malformed (very long/short names like ‘Llanfairpwll…gogogoch’ or ‘Lb’; text in number fields; wrong file formats), so it needs heavy validation and fast processing. **System-generated:** logs (memory, instances, job results) for visibility/debugging; rarely malformed, can be processed periodically, but volume grows fast and the signal gets lost in noise; store while useful, in low-cost storage. **System-generated user data:** clicks, scrolls, zooms, ignored pop-ups, location, which is **subject to privacy regulation**"],
            ["**Format**", "Structured / semi-structured / unstructured (L1)"],
          ],
        },
      ],
    },
    {
      id: "systems",
      heading: "3. Source systems",
      slides: "19–43",
      blocks: [
        { type: "p", text: "ML systems are usually **downstream** of other systems, so their sources are often other systems' outputs." },
        {
          type: "table",
          head: ["System", "Characteristics", "Examples / uses"],
          rows: [
            ["**RDBMS (SQL)**", "Tables with PK/FK relationships; **ACID**; normalised; rows stored contiguously. Ideal for rapidly changing app state; challenge: capturing state history over time", "Postgres, MySQL, Oracle"],
            ["**Key-value**", "Like a hash map but scalable. In-memory caches for sessions (temporary) or durable, replicated persistence", "E-commerce user/cart event state"],
            ["**Document**", "Nested JSON documents in collections, retrieved by key. **Flexible schema: a blessing and a curse** (inconsistent, bloated). Indexes available; **no joins** (denormalised duplication); often **eventually consistent**, not ACID; analytics needs full scans", "MongoDB"],
            ["**Wide-column**", "Huge write rates, PB scale, millions of requests/s, <10 ms latency; **single index (row key)**, so no complex queries; extract via scans or CDC for analytics", "DynamoDB, Cassandra, Bigtable (e-commerce, fintech, ad tech, IoT)"],
            ["**Search**", "Fast search/retrieval on semantic and structural characteristics; **text search** (exact/fuzzy/semantic) and **log analysis** (anomaly detection, monitoring, security)", "Elasticsearch, Solr/Lucene, Algolia"],
            ["**Time-series**", "Values ordered by time; **measurement** (regular sensors) vs **event-based** (irregular); fast writes with memory buffering; timestamp + few fields; good for operational analytics, not BI; few joins", "InfluxDB, Druid; stocks, IoT, windy.com"],
          ],
        },
        {
          type: "table",
          caption: "APIs & other sources",
          head: ["Source", "Notes"],
          rows: [
            ["**REST APIs**", "Stateless calls (IRCTC PNR status used by many sites). Abstraction ranges from a thin wrapper to a full analytics API"],
            ["Client libraries / open-source connectors", "Remove boilerplate; off-the-shelf SaaS connectors; frameworks for custom connectors"],
            ["**GraphQL**", "Created at Facebook; retrieve **multiple data models in one request**; JSON-shaped responses"],
            ["**Webhooks** (reverse APIs)", "The **provider calls the consumer's HTTP endpoint** when an event happens"],
            ["**RPC / gRPC**", "Google, 2015; Protocol Buffers; efficient bidirectional exchange over HTTP/2 (CPU, battery, bandwidth); stricter standards than REST"],
            ["**Data sharing**", "Multitenant cloud platforms with fine-grained sharing policies (row/column/sensitive filtering); **data marketplaces**; enables decentralised patterns such as **data mesh**"],
            ["**Third-party data**", "data.gov.in, US BLS, NASA, Facebook for advertisers. Data is *sticky* (a flywheel of adoption); accessed via APIs, cloud sharing or download; CRM data → scoring model → reverse ETL"],
            ["**Message queues**", "Asynchronous small messages via **pub/sub**; the subscriber acknowledges and the message is removed; decouples microservices; buffers load spikes; durable through replication"],
            ["**Event streaming**", "An **ordered log** of records **retained** for a while, with **replay**. **Topics** (related events; zero or more producers and consumers); **partitions** (the lanes of a freeway for parallelism; the same **partition key** always goes to the same partition)"],
          ],
        },
      ],
    },
    {
      id: "ingest",
      heading: "4. Data ingestion: meaning, challenges, tools",
      slides: "44–51",
      blocks: [
        { type: "p", text: "**Ingestion** moves data from a source into a landing area or object store for ad-hoc queries and analytics: consume from the origin, clean a bit, write to the destination. It **helps teams go fast** (narrow scope, agility, self-service for analysts and scientists). Examples: Salesforce → DW → Tableau; a Twitter feed → real-time sentiment; data for ML training." },
        {
          type: "table",
          head: ["Challenge", "Detail"],
          rows: [
            ["Complexity takes time", "Building pipelines from scratch for every new source or need slows the team"],
            ["Change takes time", "Each target change costs 10–20 hours; about **90% of time goes on maintenance/break-fix (data drift)**"],
            ["Maintenance & rework", "Repeated troubleshooting leaves no time for innovation"],
          ],
        },
        {
          type: "table",
          head: ["Tool type", "Trade-off"],
          rows: [
            ["**Manual / hand coding**", "Greatest control; lots of work and rework"],
            ["**Single-purpose tools**", "Drag-and-drop, prebuilt connectors, quick; cumbersome to manage many, hard to share"],
            ["**Data integration platforms**", "Features for every step; need domain-specific developers; slow to adapt"],
            ["**DataOps approach**", "Agile + automation; abstracts the *how*, so engineers focus on the *what* and on business needs"],
          ],
        },
        { type: "p", text: "**Common sources:** Kafka, JDBC, Oracle CDC, HTTP clients, HDFS. **Common destinations:** Kafka, JDBC, Snowflake, Amazon S3, Databricks. **Cloud migration:** ingestion is essential for moving silos into cloud lakes and warehouses; the more the what-ifs are automated, the better." },
      ],
    },
    {
      id: "contract",
      heading: "5. Data contracts, lineage & governance",
      slides: "52–55",
      blocks: [
        {
          type: "table",
          head: ["Concept", "Meaning"],
          rows: [
            ["**Data contract**", "A written agreement between the **source-system owner** and the **ingesting team**: *what* data, *how* (full or incremental), *how often*, and *who* the contacts are on both sides. Stored in a well-known place (GitHub repo, docs), ideally in a standard, machine-queryable form"],
            ["**Data lineage**", "Documentation and visualisation of data's journey: origin → transformations through pipelines → where it is served (dashboards/reports). Requires identifying assets, tracking them from sources, documenting sources, mapping paths and pinpointing consumption"],
            ["**Data governance**", "The discipline for **quality, security and availability** of data through policies, standards and procedures for collection, ownership, storage, processing and use. At ingestion it **stops bad data propagating**, ensures **compliance** (GDPR, HIPAA, PII, PCI-DSS, DPDPA) and creates **traceability and trust** in the source"],
          ],
        },
      ],
    },
    {
      id: "consider",
      heading: "6. Key engineering considerations",
      slides: "56–59",
      blocks: [
        {
          type: "table",
          head: ["Consideration", "Question to ask"],
          rows: [
            ["Use case", "What is the data for?"],
            ["Reusability", "Can we reuse it and avoid ingesting multiple versions of the same dataset?"],
            ["Lineage", "Where is it going (destination)?"],
            ["Freshness", "How often should it be updated from the source?"],
            ["Volume", "What volume is expected?"],
            ["Format", "What format, and can downstream storage and transformation accept it?"],
            ["Quality", "Is the source data good enough for immediate downstream use?"],
            ["Risks", "What post-processing is needed? What are the data-quality risks?"],
            ["Velocity", "Does streaming data need in-flight processing?"],
          ],
        },
      ],
    },
    {
      id: "batch",
      heading: "7. Batch ingestion",
      slides: "60–65",
      blocks: [
        { type: "list", items: [
          "**Time-interval** (e.g. nightly, for daily DW reporting) vs **size-based** (cut a stream into objects by bytes or event count for the lake).",
          "**Full snapshot** (grab the entire current state each time: simple, very common) vs **differential/incremental** (only changes since the last read: less network and storage).",
          "**Inserts & updates:** batch/columnar systems perform poorly with many **small** operations. Single-row inserts and many small in-place updates are anti-patterns (each update scans column files). Know your store's pattern: Druid/Pinot handle high insert rates; SingleStore handles hybrid OLTP+OLAP; BigQuery is poor at single-row SQL inserts but excellent through its **streaming buffer**.",
          "**Data migration:** moving hundreds of TB or whole DBs. **Schema differences** always exist, so test on a sample first. Move in bulk, not row by row. Object storage is a good intermediate stage. Use migration tools. The **AWS Snow family** covers petabyte to exabyte-scale physical transfer and edge workloads.",
        ]},
      ],
    },
    {
      id: "stream",
      heading: "8. Streaming ingestion concerns",
      slides: "66–75",
      blocks: [
        {
          type: "table",
          head: ["Concern", "Explanation", "Mitigation"],
          rows: [
            ["**Schema evolution**", "Fields added or removed, types changed; breaks downstream", "**Schema registry** to version schemas; talk to upstream teams proactively"],
            ["**Late-arriving data**", "Events with similar event times arrive at different ingestion times (latency). E.g. a Driver Monitoring System whose camera frames lag", "Set a **cut-off time** (watermark) beyond which late data is not processed"],
            ["**Ordering & multiple delivery**", "Distributed platforms may deliver **out of order** and **more than once** (**at-least-once**); exactly-once is very hard (e.g. duplicate bank SMS)", "Idempotent consumers, de-duplication keys, event-time ordering"],
            ["**Replay**", "Re-read a range of history to reprocess", "Kafka, Kinesis, Pub/Sub support retention + replay; RabbitMQ deletes after consumption"],
            ["**Message size**", "Kinesis max 1 MB; Kafka default 1 MB, configurable to 20 MB+", "Send a pointer/notification, then fetch the payload via API (adds delay)"],
            ["**TTL / retention**", "How long unacknowledged events live. Too short → messages vanish before processing; too long → backlog", "Pub/Sub up to 7 days; Kinesis up to 365 days; Kafka indefinitely (disk-bound)"],
            ["**Error handling**", "Non-existent topic, oversized message, expired TTL", "Route failures to a **dead-letter queue** so they don't block good messages; diagnose and reprocess later"],
            ["**Push vs pull**", "**Pull:** subscribers read and acknowledge (Kafka, Kinesis: pull only; the default choice). **Push:** the service writes to a listener (Pub/Sub, RabbitMQ also support push)", "Add a layer to emulate push on pull systems"],
          ],
        },
      ],
    },
    {
      id: "ways",
      heading: "9. Ways to ingest data",
      slides: "76–91",
      blocks: [
        {
          type: "table",
          head: ["Way", "Key points"],
          rows: [
            ["**Direct DB connection (ODBC/JDBC)**", "A driver translates the standard API into DB-native commands; pull via many small queries or one large query. JDBC is Java-based and very portable"],
            ["**CDC: batch**", "Query rows with updated_at > last run; **misses intermediate changes** (mitigate with an insert-only schema)"],
            ["**CDC: continuous / log-based**", "Treat every write as an event; read the DB **binary log** (Postgres) and send to Kafka via **Debezium**; near real-time replication/analytics"],
            ["**CDC: managed**", "Cloud DB triggers a serverless function / event stream per change"],
            ["CDC considerations", "Consumes DB memory, disk, CPU and network. Run batch CDC off-hours or on a **read replica**"],
            ["**APIs**", "No standard for data exchange: read docs, talk to owners, maintain code. Trends: vendor client libraries, **connector platforms** (SaaS/open source), **data sharing** platforms (BigQuery, Snowflake, Redshift, S3)"],
            ["**Message queues / event streams**", "Real-time ingestion from web, mobile, IoT; ingestion can be non-linear (publish → consume → republish)"],
            ["**Object storage**", "The best and most secure way to exchange files: multitenant, massive, **signed URLs** for temporary access, secure, scalable"],
            ["**File export**", "Export scans load transactional DBs, so run at safe times, split by key range/partition, or use a read replica. Cloud DWs export directly to object storage"],
            ["**Shell & SSH**", "Shell scripts glue workflows (read DB → reserialise → upload → trigger load). SSH tunnels via a **bastion host** give secure DB access; SCP over SSH"],
            ["**SFTP / SCP**", "Still common with partners; needs careful security configuration"],
            ["**Webhooks**", "Reverse APIs: the provider calls *your* endpoint. E.g. AWS Lambda (receive) → Kinesis (buffer) → stream processing"],
            ["**Web interface / scraping**", "Manual report download; scraping HTML is ethically and legally murky"],
            ["**Data sharing**", "Read-only access to a provider's dataset; you don't own it and can lose access"],
            ["**Transfer appliances**", "For 100 TB+, ship a physical box of drives (AWS Snow family). One-time migrations only"],
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["1st/2nd/3rd-party data", "Own customers / partner's customers / public data."],
    ["System-generated user data", "Clicks, scrolls, location: privacy-regulated."],
    ["Wide-column DB", "Massive write throughput, single row-key index (Cassandra, Bigtable)."],
    ["GraphQL", "Query language for APIs: many models in one request."],
    ["Webhook", "Reverse API: the provider calls the consumer's endpoint."],
    ["Topic / partition", "Stream of related events / parallel lane keyed by partition key."],
    ["Data contract", "Agreement on what/how/how often/who between source and ingestion teams."],
    ["Data lineage", "Map of data's journey from origin to consumption."],
    ["Full snapshot vs differential", "Whole state each time vs only changes."],
    ["At-least-once delivery", "Messages may be duplicated; consumers must be idempotent."],
    ["Dead-letter queue", "Holding area for events that fail ingestion."],
    ["TTL", "Maximum retention of unacknowledged events."],
    ["Log-based CDC", "Reading DB binary logs to stream changes (Debezium)."],
    ["Bastion host", "Secure jump server for SSH tunnels to databases."],
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
4. **Freshness:** real-time context must reach the model within seconds, while catalogue metadata can refresh daily.`,
    },
    {
      title: "NoSQL source systems compared",
      marks: 5,
      question: "Compare the NoSQL source systems (key-value, document, wide-column, search, time-series) in terms of data model, strengths, limitations and typical use cases. How does a data engineer extract analytics data from them?",
      solution: `
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

Then model the data in the warehouse/lakehouse for training.`,
    },
    {
      title: "Streaming ingestion challenges",
      marks: 5,
      question: "What challenges must be handled when ingesting streaming data? Explain schema evolution, late-arriving data, ordering and multiple delivery, replay, message size, TTL, error handling (dead-letter queue) and push vs pull.",
      solution: `
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
\`\`\``,
    },
    {
      title: "Change data capture (CDC)",
      marks: 5,
      question: "What is Change Data Capture? Explain batch, continuous (log-based) and managed CDC with their trade-offs. What precautions must be taken when running CDC on a production database?",
      solution: `
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

*Use case:* keeping an e-commerce inventory replica and an analytics store current with minimal data loss.`,
    },
    {
      title: "Data contracts, lineage and governance at ingestion",
      marks: 5,
      question: "Explain data contracts, data lineage and data governance. Why are they especially important at the data ingestion stage?",
      solution: `
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
\`\`\``,
    },
    {
      title: "Choosing ingestion methods for scenarios",
      marks: 5,
      question: "Recommend and justify an ingestion method for each: (a) nightly load of an on-prem Oracle orders table, (b) near-real-time replication of a PostgreSQL inventory DB to analytics, (c) a SaaS payment provider notifying you of each payment, (d) a partner that drops daily CSVs, (e) migrating 400 TB from an on-prem data centre to the cloud.",
      solution: `
| Scenario | Method | Why |
|---|---|---|
| (a) Nightly Oracle orders | **Batch via JDBC/ODBC** (differential using updated_at), or **file export** to object storage | Time-interval batch fits daily reporting. Run off-hours or on a **read replica** to protect the OLTP DB |
| (b) Near-real-time inventory | **Log-based CDC** (Debezium → Kafka) | Captures every change with low latency and little extra query load |
| (c) SaaS payment notifications | **Webhook** (Lambda endpoint → Kinesis/Kafka buffer → processing) | The provider pushes events; a buffer handles spikes; route failures to a **DLQ** |
| (d) Partner daily CSVs | **SFTP / object storage** with **signed URLs**, plus schema validation | Common partner pattern; object storage is secure and scalable; validate against a **data contract** |
| (e) 400 TB migration | **Transfer appliance** (AWS Snow family), then incremental sync | Over 100 TB, shipping drives is faster and cheaper than the network. One-time only; test schema compatibility on a sample first |

**General considerations** (slide 58): use case, reusability, lineage, freshness, volume, format, quality, risks, velocity.`,
    },
    {
      title: "Message queues vs event-streaming platforms",
      marks: 5,
      question: "Differentiate message queues and event-streaming platforms. Explain topics and partitions with the freeway analogy, and state when you'd use each for ML data ingestion.",
      solution: `
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
- **Streaming platform:** collecting clickstream/IoT events for **real-time features** and **replaying history** to rebuild training sets or backfill features (Kappa-style).`,
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
