// DMML — Lecture 4: Data Pipelines (modes of data flow, Modern Data Stack, pipeline architecture)
// Source: CourseFiles/DMML/L4-Data Pipelines.pptx (80 slides)

export default {
  title: "Data Pipelines & the Modern Data Stack",
  source: "L4-Data Pipelines.pptx · 80 slides",
  overview:
    "A data pipeline is fundamentally about **data flow**. This lecture covers the three **modes of data flow**: through **databases** (backward/forward compatibility, schema evolution, “data outlives code”), through **services** (client-server, SOA, microservices, REST/SOAP, RPC/gRPC) and through **asynchronous message passing** (brokers). It then contrasts the **Traditional Data Stack with the Modern Data Stack** and covers what a pipeline is, its benefits and challenges, its **architecture components**, **ETL vs ELT**, **batch vs streaming**, **CDC**, the unified **Dataflow model**, implementation via **development/execution and micro-pipelines**, and the three classes of **pipeline tools**.",

  summary: [
    {
      id: "why",
      heading: "1. Why data pipelines?",
      slides: "4–7",
      blocks: [
        { type: "p", text: "**IMD example:** India's weather service collects from 806 automatic weather stations, 1,382 rain gauges, 5,896 district stations, 39 Doppler radars, 2 satellites, ozone/aerosol/lightning networks and more, several times a day. Feeding this manually is humanly impossible. A well-designed pipeline handles the **5 Vs** (volume, velocity, variety, veracity, value) while staying maintainable. At its heart, a pipeline is **data flow**: how data moves between systems through processing, transformation and storage stages." },
      ],
    },
    {
      id: "db",
      heading: "2. Mode 1: data flow through databases",
      slides: "10–17",
      blocks: [
        { type: "p", text: "**Example:** a hospital's doctor app writes a prescription to the HMS database; the pharmacist app and the patient's mobile app read it. The writer **encodes**, the reader **decodes**." },
        { type: "list", items: [
          "**Scenario 1:** one process writes, another reads.",
          "**Scenario 2:** the same process, a later version, reads what an older version wrote. This needs **backward compatibility** (new code reads old data).",
          "**Scenario 3:** many processes/services or instances access the DB at once. During **rolling upgrades** old and new code run together, so an older version may read data written by newer code. This needs **forward compatibility** (old code tolerates new data).",
          "**Preserve unknown fields:** if new code adds a field and old code reads, updates and writes the record back, the new field must be kept intact.",
          "**Data outlives code:** an app can be replaced in minutes, but five-year-old data remains. A single DB holds values written 5 ms ago and 5 years ago.",
          "**Schema evolution:** rewriting (migrating) large datasets is expensive, so use simple changes (add a nullable column). The DB then *appears* to have one schema though records use many historical versions.",
          "**Archival storage:** snapshots/dumps for backup or the warehouse are typically encoded consistently using the **latest schema**.",
        ]},
      ],
    },
    {
      id: "svc",
      heading: "3. Mode 2: data flow through services",
      slides: "18–30",
      blocks: [
        {
          type: "table",
          head: ["Style", "Key points"],
          rows: [
            ["**Client-server**", "Servers expose an API (a *service*); clients call it. Web browsers use standard HTTP/HTML; native/mobile/JS (Ajax) clients get data (JSON) through application-specific APIs"],
            ["**SOA**", "A server can also be a client. The application is decomposed into services by functionality, **independently deployable/evolvable**, each owned by one team. Old and new versions coexist, so encodings must stay compatible across versions"],
            ["**Microservices**", "Evolved from SOA: also distributed and decoupled, but **lighter-weight and more flexible** (SOA is heavier on infrastructure)"],
            ["**Web services**", "SOA is an *architecture*; a web service is a *specific protocol implementation* (SOAP or REST)"],
            ["**REST**", "*Not a protocol* but a design philosophy on HTTP: simple formats, URLs identify resources, HTTP features for caching/auth/content negotiation. Easy to debug (browser, curl), huge tool ecosystem, popular with microservices"],
            ["**SOAP**", "XML-based protocol aiming to be independent of HTTP. WS-* standards; API described in **WSDL** (not human-readable), so it relies on tooling/code generation. Still used in large enterprises; out of favour elsewhere"],
            ["**RPC**", "Makes a remote call look like a local function (**location transparency**). This is *fundamentally flawed*: networks fail, time out and have latency"],
            ["**Modern RPC**", "Thrift, Avro RPC, **gRPC (Protocol Buffers)**. Explicit about remoteness; provide service discovery; binary encoding outperforms JSON/REST. Used mainly *within* one organisation/datacenter"],
          ],
        },
      ],
    },
    {
      id: "msg",
      heading: "4. Mode 3: asynchronous message passing",
      slides: "31–34",
      blocks: [
        { type: "p", text: "Message passing sits between RPC and databases. Like RPC, a message reaches another process with low latency. Like a DB, it goes through an **intermediary (message broker / queue)** that stores it temporarily. Examples: RabbitMQ, ActiveMQ, NATS, **Apache Kafka** (formerly TIBCO, IBM WebSphere)." },
        { type: "p", text: "```flow\nProducer(s) -> Named queue / topic (broker) -> Consumer(s) / subscriber(s)\n```" },
        { type: "list", items: [
          "**Buffer** if the recipient is unavailable or overloaded, which improves reliability.",
          "**Redelivers** messages to a crashed process, so nothing is lost.",
          "The sender **needn't know the recipient's IP/port**.",
          "**One message → many recipients.**",
          "**Decouples** sender from recipient: publish and forget.",
          "Usually **one-way and asynchronous** (a reply goes on a separate channel). Brokers don't enforce a data model; any encoding works, and backward/forward-compatible encodings allow independent deployment.",
        ]},
      ],
    },
    {
      id: "mds",
      heading: "5. Traditional vs Modern Data Stack",
      slides: "35–50",
      blocks: [
        { type: "p", text: "**TDS problems:**\n• **Long turnaround:** on-prem infrastructure, all costs borne in-house, an army of engineers, tightly coupled systems (a small change breaks others).\n• **Expensive journey to insights:** manual report generation and cleaning in Excel, error-prone, doesn't scale.\n• **Slow response to new information:** scaling on-prem is costly, compute is limited, pipelines take hours, slow ETL means a new data update takes weeks, so opportunities are missed." },
        {
          type: "table",
          caption: "TDS vs MDS (slide 39)",
          head: ["", "Traditional Data Stack", "Modern Data Stack"],
          rows: [
            ["Infrastructure", "Physical, on-prem servers", "**Cloud-native**"],
            ["Scalability", "Manual scaling", "Scales dynamically with demand (elastic)"],
            ["Integration", "Custom, hand-built workflows", "**Automated** data ingestion (connectors)"],
            ["Flexibility", "**Monolithic**", "**Modular**: plug-and-play tools"],
            ["Analytics", "Batch reporting", "Real-time insights, interactive dashboards"],
            ["Cost", "Significant upfront investment (licences, hardware)", "**Pay-as-you-go**"],
            ["Transformation", "ETL before load (slow)", "ELT in the warehouse (dbt/SQL)"],
            ["Users", "IT-dependent", "**Self-service** for analysts and business"],
          ],
        },
        { type: "p", text: "**MDS** = integrated, cloud-based tools for collecting, ingesting, storing, cleaning, transforming, analysing and governing data. It is cloud-native and modular, automates and optimises cost, and enables self-service analytics and AI: *an assembly line for data*." },
        { type: "p", text: "**Key characteristics:** self-service (discover, understand context/lineage, insights without IT); agile data management (**availability**: storage separate from compute; **elasticity**: auto-scale, e.g. Friday afternoons); flexible, fast set-up, **pay-as-you-go**, **plug-and-play** with open standards and no lock-in." },
        {
          type: "table",
          caption: "MDS building blocks",
          head: ["Layer", "What / examples"],
          rows: [
            ["Ingestion", "Batch → **streaming-first**: CDC, replication, pub/sub (Fivetran, Stitch, Kafka)"],
            ["Storage & processing", "Warehouses (Snowflake, BigQuery, Redshift), lakes (object storage), **lakehouses** (ACID + CDC on cheap storage)"],
            ["Transformation", "Native SQL in the warehouse (**dbt**), or orchestration + custom code"],
            ["BI & analytics", "Self-service exploration (Looker, Tableau), not just static charts"],
            ["Catalogues & governance", "Discovery, trust and context; metadata becomes big data"],
            ["Privacy & access governance", "Entitlement engines applying policies across the stack"],
            ["Others", "Real-time processing, data-science tools, event collectors, data-quality tools"],
          ],
        },
        { type: "p", text: "**Use cases:** AI personalisation (Spark + Databricks), customer insights (Snowflake + Looker), supply-chain optimisation (Fivetran + dbt), fraud detection (ML + APIs + Redshift)." },
      ],
    },
    {
      id: "pipe",
      heading: "6. Data pipelines: definition, benefits, challenges",
      slides: "51–57",
      blocks: [
        { type: "p", text: "A **data pipeline** is a series of steps that move data from one system so it becomes useful in another (analytics, DS, AI/ML). It **pulls** from the source, **applies transformation rules**, and **pushes** to the destination. Pipelines emerged from the big-data/data-lake era, when unfettered raw data led to many workflows (clean, filter, aggregate, move, load). **Situation:** most organisations still build pipelines by hand, non-repeatably and in isolation, so development can't keep pace and business and IT “draw swords”." },
        {
          type: "table",
          head: ["Benefits", "Challenges"],
          rows: [
            ["**Self-service data:** analysts and scientists build ad-hoc pipelines, fail fast, innovate faster", "**Always under construction:** building/debugging takes so long that requirements change first, creating backlogs"],
            ["**Real-time analytics and apps:** streaming pipelines deliver the right data, to the right place, right now", "**Out of order:** a small change in a row/table means hours of rework. Pipelines go offline for fixes; unplanned changes, i.e. **data drift**, cause hidden breakages"],
            ["**Cloud migration and adoption:** move data to the cloud and use NLP, sentiment and image services", "**Build it and they will come:** pipelines tied to specific frameworks/platforms, so changing infrastructure means weeks of rebuilding"],
          ],
        },
      ],
    },
    {
      id: "arch",
      heading: "7. Pipeline architecture, ETL/ELT, batch/stream, CDC",
      slides: "58–66",
      blocks: [
        { type: "p", text: "```flow\nOrigin -> Dataflow (processing: ingest, transform) -> Storage (at stages) -> Destination\nWorkflow (task sequence & dependencies) + Monitoring (health of every stage)\n```" },
        {
          type: "table",
          head: ["Component", "Meaning"],
          rows: [
            ["Origin", "Point of data entry"],
            ["Destination", "Final point where data is delivered"],
            ["Dataflow", "Movement from origin to destination, including changes and the stores it passes through"],
            ["Storage", "Systems preserving data at each stage"],
            ["Processing", "Ingest, store, transform, deliver"],
            ["Workflow", "Sequence of tasks and their dependencies"],
            ["Monitoring", "Checking the pipeline and its stages work correctly"],
          ],
        },
        {
          type: "table",
          caption: "ETL vs ELT: when to use which",
          head: ["ETL", "ELT"],
          rows: [
            ["High data quality/governance needed **upfront**", "The target (cloud platform) handles massive parallel transformations"],
            ["Target has limited compute/storage (legacy warehouse)", "Load raw data quickly for agility"],
            ["Structured, curated analytical output", "Semi/unstructured data"],
            ["Complex transformations with business rules outside the DB", "Reuse raw data for many downstream consumers"],
            ["E.g. enterprise DW, regulatory reporting, MDM, ERP → warehouse", "E.g. lake/lakehouse pipelines, **ML pipelines**"],
          ],
        },
        {
          type: "table",
          head: ["", "Batch pipeline", "Stream pipeline"],
          rows: [
            ["How", "Loads batches at set intervals (often off-peak); chained commands", "Event-driven; processes events continuously as they occur"],
            ["When", "No immediate need (monthly accounting); goes with ETL", "Data must be continuously updated"],
            ["Latency / reliability", "High latency; very reliable", "Low latency; less reliable (dropped/queued messages)"],
          ],
        },
        { type: "p", text: "**CDC (change data capture):** extract every insert/update/delete event from a DB. Batch CDC reads RDBMS event logs; trigger CDC comes from cloud NoSQL events. Used for replication. *Example:* an e-commerce stock/SKU DB fails over to a replica with no interruption and minimal data loss." },
        { type: "p", text: "**Dataflow model (Google) / Apache Beam:** a unified batch + streaming model. All data is **events**. Streams are **unbounded**; batches are **bounded** streams. Aggregation happens over **windows** (tumbling, sliding). Nearly identical code serves both. Philosophy: *batch is a special case of streaming* (also adopted by Flink and Spark)." },
      ],
    },
    {
      id: "impl",
      heading: "8. Implementation & tools",
      slides: "67–78",
      blocks: [
        { type: "list", items: [
          "**Simple:** CSV → database → dashboard. **Complex:** 10 sources → merge fields → dimensional schema → aggregate by year → flag nulls → BI extract → personalised dashboards.",
          "**Development pipeline** (creates the code) vs **execution pipeline** (runs it in production). They are usually different teams, so developers change code without owning its downstream impact, raising errors and delays. Integrate them (DataOps).",
          "**Micro-pipelines:** split stages into small independent pipelines so each step can change without disrupting the whole flow. Steps: **requirement** (agile: Scrum/Kanban, e.g. a new source or field) → **development** (not necessarily code: model or dashboard changes, heavily automated).",
          "**Tool decision questions:** just move data, or transform it too? Is the environment stable and in our control, or dynamic with external sources? One-off, or operationalised over time?",
        ]},
        {
          type: "table",
          head: ["Tool class", "Strength", "Weakness"],
          rows: [
            ["**Data ingestion/loading tools**", "Easy to set up and deploy; solve “under construction”", "Basic transforms only; rigid, embedded with structure specifics; must rebuild on **data drift**"],
            ["**Data integration / ETL platforms**", "Hundreds of connectors and transformations", "Designed for an era with little drift; break on change and need massive rework"],
            ["**Data engineering platforms (DataOps)**", "**Smart pipelines**: abstract the *how*, focus on *what/who/where*. Deploy in hours, resilient to change, re-point to new platforms in minutes", "Needs DataOps maturity"],
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["Backward compatibility", "Newer code can read data written by older code."],
    ["Forward compatibility", "Older code can read data written by newer code."],
    ["Data outlives code", "Old data persists across many code versions."],
    ["Schema evolution", "Changing the schema without rewriting all existing data."],
    ["SOA / microservices", "Decomposed, independently deployable services (heavy / lightweight)."],
    ["REST", "HTTP-based design philosophy (not a protocol)."],
    ["SOAP / WSDL", "XML protocol / its interface description."],
    ["gRPC", "RPC framework over HTTP/2 using Protocol Buffers."],
    ["Message broker", "Intermediary queue/topic that decouples producers and consumers."],
    ["MDS", "Cloud-native, modular, pay-as-you-go data tooling."],
    ["Data drift (pipelines)", "Unplanned changes in source structure/semantics that break pipelines."],
    ["CDC", "Capturing row-level changes (insert/update/delete) as events."],
    ["Dataflow model", "Batch = bounded stream; windowed processing (Apache Beam)."],
    ["Micro-pipeline", "Small independent pipeline stage, changeable in isolation."],
  ],

  examTips: [
    "**PYQ Q4 (TDS vs MDS, 5 marks):** give the slide-39 table (infrastructure, scalability, integration, flexibility, analytics, cost), add TDS problems + MDS characteristics, and name a tool per MDS layer.",
    "Modes of data flow: remember the **three modes** and the **compatibility** vocabulary. Rolling upgrades need *both* backward and forward compatibility.",
    "ETL vs ELT: always add **when to use which**, with examples (regulatory reporting → ETL; ML/lakehouse → ELT).",
  ],

  theory: [
    {
      title: "Traditional Data Stack vs Modern Data Stack",
      pyq: "Comprehensive Q4 (5 marks)",
      marks: 5,
      question: "Compare Traditional Data Stack (TDS) vs Modern Data Stack (MDS).",
      solution: `
**Definitions**
- **TDS:** legacy, **on-premises**, tightly coupled, monolithic tools (on-prem RDBMS/warehouse + heavy ETL + static reports).
- **MDS:** an integrated set of **cloud-based, modular** tools for collection, ingestion, storage, cleaning, transformation, analysis and governance of data. It automates workflows, optimises cost, accelerates insights and enables **self-service analytics and AI**, acting as an "assembly line" for data.

**Comparison**

| Dimension | TDS | MDS |
|---|---|---|
| Infrastructure | Physical, on-prem servers | **Cloud-native** (Snowflake, BigQuery, Redshift, Databricks) |
| Scalability | Manual, costly scale-out; limited compute | **Elastic**: auto-scales with demand |
| Integration | Custom hand-coded workflows | **Automated ingestion** via managed connectors (Fivetran, Airbyte) |
| Flexibility | **Monolithic**: a small change breaks other parts | **Modular, plug-and-play**, open standards, no lock-in |
| Transformation | Slow **ETL** before load; weeks to add data | **ELT** in the warehouse using SQL (dbt) |
| Analytics | Batch reporting, often manual Excel | Real-time insights, interactive self-service BI (Looker, Tableau) |
| Cost | Large upfront licences + hardware + an "army of engineers" | **Pay-as-you-go**, storage separated from compute |
| Users | IT-dependent | Self-service for analysts and business users |
| Governance | Ad hoc | Catalogues, lineage, access-governance tools |

**TDS problems (why MDS emerged)**
1. **Long turnaround:** infrastructure takes long to untangle; coupled systems make small changes risky.
2. **Expensive journey to insights:** manual report generation and cleaning cause errors and don't scale.
3. **Slow response to new information:** costly scaling, pipelines taking hours, and ETL refactoring for weeks, so opportunities are missed.

**MDS pipeline**
\`\`\`flow
Sources (SaaS, DBs, events) -> Automated ingestion (Fivetran / Kafka) -> Cloud warehouse / lakehouse -> Transform in-warehouse (dbt, SQL) -> BI & ML (Looker, notebooks) -> Reverse ETL
Catalogue, governance & data quality span all layers
\`\`\`

**Example:** a retailer on TDS waits a week for a new sales report built by IT. With MDS, a Fivetran connector syncs Shopify data to Snowflake in hours, dbt models it, and analysts build a live Looker dashboard themselves, paying only for the compute they use.

**Conclusion:** MDS trades heavy upfront investment and rigidity for **cloud elasticity, modularity, automation and self-service**. Its own challenges are tool sprawl and governance/cost control, which call for catalogues and DataOps.`,
    },
    {
      title: "Modes of data flow and compatibility",
      marks: 5,
      question: "Describe the three modes of data flow between processes. Explain backward and forward compatibility, schema evolution and why “data outlives code”, using a database example.",
      solution: `
**1. Through databases:** the writer encodes and the reader decodes, possibly much later. E.g. doctor app → HMS DB → pharmacist app and patient app.
**2. Through services:** client-server, SOA, microservices, REST/SOAP web services, RPC/gRPC. A request/response over the network.
**3. Through asynchronous message passing:** via a **message broker** (Kafka, RabbitMQ): producer → topic/queue → consumers.

**Compatibility (database scenarios)**
- **Backward compatibility:** *newer code reads data written by older code.* This is essential even with one process, because a later version must read what the earlier version wrote.
- **Forward compatibility:** *older code reads data written by newer code.* Needed during **rolling upgrades**, when some instances run new code and others old. If new code adds a field and old code reads and rewrites the record, the old code should **preserve the unknown field**.

\`\`\`flow
App v2 (new code) writes -> DB -> App v1 (old code) reads: needs FORWARD compatibility
App v1 (old code) writes -> DB -> App v2 (new code) reads: needs BACKWARD compatibility
\`\`\`

**Data outlives code:** redeploying an app takes minutes, but the DB still contains values written 5 years ago alongside ones written 5 ms ago.
**Schema evolution:** migrating huge datasets is expensive, so evolve the schema with cheap changes (add a nullable column). The DB looks like one schema even though the stored records span many historical versions.
**Archival:** backup/warehouse dumps are re-encoded consistently in the **latest schema**.

Binary formats with explicit schemas (**Avro, Protobuf**) are designed for this compatibility.`,
    },
    {
      title: "REST vs SOAP vs RPC/gRPC; SOA vs microservices",
      marks: 5,
      question: "Compare REST, SOAP and RPC (gRPC) for service communication. How do SOA and microservices differ, and why must data encodings stay compatible in them?",
      solution: `
| | REST | SOAP | RPC / gRPC |
|---|---|---|---|
| Nature | Design philosophy on HTTP (not a protocol) | XML-based protocol (WS-* standards) | Call a remote procedure like a local one |
| Interface | URLs + HTTP verbs, JSON | **WSDL** (machine-oriented XML) | IDL (Protocol Buffers for gRPC) |
| Ease | Easy to debug (browser, curl); huge tool ecosystem | Needs heavy tooling/code generation | Needs generated client stubs |
| Performance | Good (text JSON) | Heavy (verbose XML) | **Best**: binary over HTTP/2 |
| Typical use | Public, cross-organisation APIs; microservices | Legacy enterprise integration | Internal service-to-service (same datacentre) |

**Caveat on RPC:** "location transparency" is fundamentally flawed, because remote calls can time out, fail or be slow. Modern frameworks (gRPC, Thrift) are *explicit* about remoteness and add service discovery.

**SOA vs microservices:** both decompose an application into services by functionality, **independently deployable and evolvable**, each owned by one team. SOA is heavier on infrastructure (often an enterprise service bus). Microservices, which evolved from SOA, are lightweight and more flexible. **Compatibility:** teams release independently, so old and new clients and servers run at the same time. Encodings must be backward and forward compatible across API versions.`,
    },
    {
      title: "Message brokers vs direct RPC",
      marks: 5,
      question: "What is asynchronous message passing? Explain how a message broker works and its advantages over direct RPC, with an example.",
      solution: `
**Asynchronous message passing** sits between RPC and databases. Like RPC, a message reaches another process with low latency. Like a DB, it passes through an **intermediary (message broker / queue / message-oriented middleware)** that stores it temporarily.

\`\`\`flow
Order service (producer) -> Topic "orders" (broker: Kafka / RabbitMQ) -> Billing service
Topic "orders" -> Inventory service
Topic "orders" -> Analytics pipeline
\`\`\`

**Working:** a producer sends a message to a named **queue or topic**. The broker delivers it to one or more consumers/subscribers. There can be many producers and consumers per topic. The broker doesn't enforce a data model: a message is bytes + metadata, so any encoding can be used.

**Advantages over direct RPC:**
1. **Buffering:** absorbs load if the consumer is down or overloaded, improving reliability.
2. **Redelivery:** re-sends to a crashed consumer, so no message is lost.
3. **No addressing:** the sender doesn't need the recipient's IP/port.
4. **Fan-out:** one message reaches many recipients.
5. **Decoupling:** the sender just publishes and forgets.

**Nature:** usually one-way and **asynchronous**; replies go on a separate channel. With backward/forward-compatible encodings, producers and consumers can be deployed independently, in any order.

**Example:** an e-commerce order event is consumed independently by billing, inventory and the ML feature pipeline. If inventory is down, its messages wait in the broker.`,
    },
    {
      title: "Pipeline architecture, ETL vs ELT, batch vs streaming, CDC",
      marks: 5,
      question: "Explain the components of a data pipeline architecture. Compare ETL with ELT and batch with stream processing pipelines, and describe where CDC fits.",
      solution: `
**Components**
\`\`\`flow
Origin -> Processing (ingest, transform) -> Storage (intermediate) -> Destination
Workflow (task order & dependencies) and Monitoring (stage health) wrap the dataflow
\`\`\`
Origin (entry point), destination (end point), dataflow (movement + changes), storage (data preserved at stages), processing (ingest, store, transform, deliver), workflow (tasks and dependencies), monitoring (check that each stage works).

**ETL vs ELT**
| ETL | ELT |
|---|---|
| Transform before loading | Load raw data, transform inside the target |
| Quality/governance upfront; limited target compute; complex business rules; curated structured output | Powerful cloud target; agility; semi/unstructured data; raw data reused by many consumers |
| Enterprise DW, regulatory reporting, MDM, ERP → DW | Lake/lakehouse and **ML pipelines** |

**Batch vs stream**
| Batch | Stream |
|---|---|
| Scheduled intervals, often off-peak | Continuous, event-driven |
| No immediate need (monthly accounting) | Continuously updated data (fraud, IoT) |
| High latency, very reliable | Low latency, less reliable (dropped/queued messages) |

**CDC:** captures each **insert/update/delete** in a source DB as an event, either from **DB logs** (batch/log-based) or **triggers/events** (cloud NoSQL). It feeds streaming pipelines and replicas. *Example:* an e-commerce inventory DB fails over to a replica with no service interruption and minimal data loss.

**Unifying the two:** Google's **Dataflow model / Apache Beam** treats batch as a *bounded* stream and processes both with windowed aggregations in near-identical code (also Flink, Spark).`,
    },
    {
      title: "Data pipeline benefits, challenges and tooling",
      marks: 5,
      question: "What are the benefits and challenges of data pipelines? Compare ingestion tools, integration/ETL platforms and data engineering (DataOps) platforms, and explain micro-pipelines.",
      solution: `
**Benefits:**
- **Self-service data:** analysts and scientists build ad-hoc pipelines and fail fast.
- **Real-time analytics:** streaming delivers the right data, to the right place, right now.
- **Cloud migration:** move data to the cloud and use NLP, sentiment and image services.

**Challenges:**
1. **Always under construction:** schema alignment, sources and destinations, debugging. By go-live, requirements have changed, creating backlogs.
2. **Out of order:** a small row/table change means hours of rework. Pipelines go offline for fixes, and unplanned changes (**data drift**) cause hidden breakages.
3. **"Build it and they will come":** pipelines are tied to a framework/platform, so switching infrastructure means weeks of rebuilding.

**Tool classes:**
| Class | Pros | Cons |
|---|---|---|
| Ingestion/loading tools | Quick to set up, many connectors | Basic transforms; rigid; rebuild on drift |
| Integration/ETL platforms | Rich connectors and transforms | Built for a low-drift era; break on change |
| **Data engineering (DataOps) platforms** | **Smart pipelines**: abstract the *how*, focus on the *what*; deploy in hours; resilient to change; re-point to new platforms in minutes | Need DataOps practice |

**Micro-pipelines:** split a complex pipeline into small independent stages so each can change without disrupting the whole flow. Each follows **requirement** (agile, e.g. add a source or field) → **development** (automated; may be a model or dashboard change rather than code). Combine this with integrated **development and execution pipelines**, so teams owning code also own its downstream impact.`,
    },
  ],

  quiz: [
    { q: "Old code reading data written by newer code requires:", options: ["Backward compatibility", "Forward compatibility", "Normalisation", "CDC"], answer: 1, why: "Forward compatibility: the old reader tolerates the new writer." },
    { q: "REST is best described as:", options: ["An XML protocol", "A design philosophy built on HTTP", "A binary RPC framework", "A message broker"], answer: 1, why: "REST is not a protocol." },
    { q: "SOAP APIs are described using:", options: ["OpenAPI", "WSDL", "Protobuf", "GraphQL"], answer: 1, why: "Web Services Description Language." },
    { q: "gRPC uses which serialization?", options: ["JSON", "XML", "Protocol Buffers", "Avro"], answer: 2, why: "gRPC is built on Protocol Buffers over HTTP/2." },
    { q: "Which is NOT an advantage of a message broker over direct RPC?", options: ["Buffering when the consumer is down", "Redelivery after crashes", "Guaranteed synchronous reply", "Fan-out to many consumers"], answer: 2, why: "Message passing is typically one-way and asynchronous." },
    { q: "In the TDS vs MDS table, MDS cost is:", options: ["Upfront licences", "Pay-as-you-go", "Free", "Fixed hardware"], answer: 1, why: "Consumption-based pricing." },
    { q: "Flexibility of a traditional data stack is described as:", options: ["Modular", "Monolithic", "Serverless", "Plug-and-play"], answer: 1, why: "Tightly coupled, monolithic systems." },
    { q: "ELT is preferred for:", options: ["Regulatory reporting with strict upfront rules", "ML pipelines on a cloud lakehouse", "Legacy warehouses with little compute", "MDM"], answer: 1, why: "Load raw data fast, transform at scale, reuse for many consumers." },
    { q: "In the Dataflow model, a batch is:", options: ["An unbounded stream", "A bounded stream", "A message queue", "A snapshot table"], answer: 1, why: "Batch is a special case of streaming." },
    { q: "Unplanned changes that silently break pipelines are called:", options: ["Data drift", "Data lineage", "Data mesh", "Reverse ETL"], answer: 0, why: "As defined on slide 57." },
  ],
};
