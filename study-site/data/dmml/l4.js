// DMML — Lecture 4: Data Pipelines & the Modern Data Stack
// Source: CourseFiles/DMML/L4-Data Pipelines.pptx (78 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Pipelines & Modern Data Stack",
  source: "L4-Data Pipelines.pptx · 78 slides",
  overview:
    "Data is only useful if it gets from where it's created to where it's needed. This lecture covers that movement. **Why** do we need pipelines at all? **How** does data flow between programs: through databases, service calls, or message queues? **Why** did the traditional data stack struggle, and **what** makes the modern data stack different (examined as **PYQ Q4**)? **What** exactly is a data pipeline, how is it built (ETL vs ELT, batch vs stream, CDC), and **why** is it so hard to keep one working? Running example: an online retailer like Flipkart, whose orders, stock, payments and clicks must reach dashboards and ML models reliably.",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why do we need data pipelines at all?",
      slides: "4–7",
      blocks: [
        {
          type: "p",
          text: "**The IMD example (slides 4–6).** The India Meteorological Department collects weather data from **806 automatic weather stations, 1,382 rain gauges, 5,896 district stations, 39 Doppler radars, 2 satellites**, plus ozone, aerosol and lightning networks, several times a day. Imagine a person copying all that into a forecasting system by hand. Impossible. It has to flow **automatically**, be checked, reshaped and stored, and arrive on time.",
        },
        {
          type: "p",
          text: "A well-designed pipeline handles the **5 Vs** (volume, velocity, variety, veracity, value from Lecture 3) while staying **maintainable**. At its heart, a pipeline is about **data flow** (slide 7): *how data moves between systems through processing, transformation and storage stages.*",
        },
        {
          type: "p",
          text: "Before we look at pipelines as a whole, we need to understand the three basic ways data can travel from one process to another (slides 8–9). Each has its own rules.",
        },
        { type: "diagram", name: "d4-modes" },
      ],
    },
    {
      id: "db",
      heading: "Lesson 2: Data flow mode 1: through a database",
      slides: "10–17",
      blocks: [
        {
          type: "p",
          text: "**The simplest way:** one process **writes** data to a database and another **reads** it later. The writer **encodes** the data and the reader **decodes** it. Slide 10's hospital example: the doctor's app writes a prescription into the Hospital Management System database; the pharmacist's app and the patient's mobile app read it.",
        },
        {
          type: "p",
          text: "It sounds trivial, but **programs change over time**, and that's where it gets tricky. Three scenarios (slides 11–13):",
        },
        {
          type: "list",
          items: [
            "**Scenario 1:** one process writes, a different process reads. Both must agree on the format.",
            "**Scenario 2:** version 2 of an app reads records that version 1 wrote last year. The new code must understand old data. That's **backward compatibility**.",
            "**Scenario 3:** many instances access the database at once. During a **rolling upgrade** (servers updated one at a time), old and new versions run side by side, so **old code may read data written by new code**. The old code must cope with it. That's **forward compatibility**.",
          ],
        },
        {
          type: "callout",
          kind: "idea",
          title: "Remember the direction",
          text: "**Backward compatibility:** *newer* code can read *older* data.\n**Forward compatibility:** *older* code can read *newer* data.\nRolling upgrades need **both**.",
        },
        { type: "diagram", name: "d4-compat" },
        {
          type: "p",
          text: "**Preserve unknown fields (slide 14).** Suppose new code adds a `coupon_code` field to orders. Old code reads an order, updates its status and writes it back. If the old code silently drops the field it didn't recognise, data is lost. Old code must **keep unknown fields intact**.",
        },
        {
          type: "p",
          text: "**Data outlives code (slides 15–16).** You can redeploy an app in minutes, but data written five years ago is still there. One database holds values written 5 milliseconds ago and 5 years ago, by many versions of the code. Rewriting (**migrating**) a huge dataset to a new schema is expensive, so databases favour **schema evolution** through simple changes such as adding a new column that can be empty (nullable). The database then *appears* to have one schema, though records follow many historical versions.",
        },
        {
          type: "p",
          text: "**Archival storage (slide 17).** Snapshots or dumps taken for backup or for loading a warehouse are usually re-encoded consistently in the **latest schema**.",
        },
      ],
    },
    {
      id: "svc",
      heading: "Lesson 3: Data flow mode 2: through service calls",
      slides: "18–30",
      blocks: [
        {
          type: "p",
          text: "Instead of leaving data in a shared database, one program can **ask another directly** over the network. When you open the retailer's app, it calls the product service for details, the price service for today's price, and the review service for ratings.",
        },
        {
          type: "p",
          text: "**Client–server (slides 18–19).** **Servers** expose an **API (Application Programming Interface)**, which is called a **service**; **clients** call it. Web browsers use standard HTTP/HTML. Mobile apps and JavaScript (Ajax) clients fetch data, usually JSON, through application-specific APIs.",
        },
        {
          type: "p",
          text: "**SOA and microservices (slides 20–22).** In a **Service-Oriented Architecture (SOA)**, a big application is split into services by function (catalogue, cart, payments), and a server can itself be a client of another service. Each service is **deployed and evolved independently** and owned by one team. Consequence: old and new versions of services run at the same time, so their **message encodings must stay compatible across versions** (Lesson 2's vocabulary again). **Microservices** evolved from SOA: also distributed and decoupled, but **lighter-weight and more flexible** (SOA tends to need heavier infrastructure).",
        },
        {
          type: "p",
          text: "**Web services (slides 23–27).** SOA is an *architecture*; a **web service** is a specific *protocol implementation*. Two styles:",
        },
        {
          type: "list",
          items: [
            "**REST (Representational State Transfer)** is **not a protocol** but a design philosophy built on HTTP: simple data formats, **URLs identify resources** (`/orders/123`), and HTTP's own features handle caching, authentication and content negotiation. Easy to debug (a browser or `curl` will do), with a huge tool ecosystem. Popular with microservices.",
            "**SOAP (Simple Object Access Protocol)** is an **XML-based protocol** that aims to be independent of HTTP, with a large set of WS-* standards. Its API is described in **WSDL (Web Services Description Language)**, which isn't human-readable, so it relies heavily on tools and code generation. Still used in large enterprises; out of favour elsewhere.",
          ],
        },
        {
          type: "p",
          text: "**RPC (Remote Procedure Call), slides 28–30.** RPC tries to make calling a remote service look exactly like calling a local function: **location transparency**. The slides call this idea **fundamentally flawed**: a local function call either works or throws an error instantly, but a network call can **time out, get lost, be slow, or succeed without you hearing back**. Pretending otherwise hides real failure modes. **Modern RPC frameworks** (Thrift, Avro RPC, **gRPC** with Protocol Buffers) are honest that calls are remote, provide **service discovery**, and use **binary encoding**, which outperforms JSON over REST. They're mostly used **within one organisation or datacentre**.",
        },
      ],
    },
    {
      id: "msg",
      heading: "Lesson 4: Data flow mode 3: asynchronous message passing",
      slides: "31–34",
      blocks: [
        {
          type: "p",
          text: "The third way sits **between** the other two. Like a service call, a message reaches another process with **low latency**. Like a database, it goes through an **intermediary**, a **message broker** (or queue), which stores it temporarily. Examples: RabbitMQ, ActiveMQ, NATS, **Apache Kafka** (older ones include TIBCO and IBM WebSphere).",
        },
        {
          type: "p",
          text: "```flow\nProducer(s) -> Named queue / topic (broker) -> Consumer(s) / subscriber(s)\n```",
        },
        {
          type: "callout",
          kind: "example",
          title: "Why a retailer loves a broker",
          text: "When you place an order, the order service **publishes one “OrderPlaced” message** to a topic and moves on. The warehouse, payments, SMS notification, analytics and recommendation-model services **each subscribe** and react in their own time. If the SMS service is down for five minutes, its messages wait in the broker and are delivered when it's back. The order service never needed to know who was listening.",
        },
        { type: "diagram", name: "d4-broker" },
        {
          type: "p",
          text: "**Advantages over calling services directly (slides 32–33):**",
        },
        {
          type: "list",
          items: [
            "**Buffers** messages if the recipient is unavailable or overloaded, which improves reliability.",
            "**Redelivers** messages to a process that crashed, so nothing is lost.",
            "The sender **doesn't need to know the recipient's address** (IP and port).",
            "**One message can go to many recipients.**",
            "**Decouples** sender from recipient: the sender publishes and forgets.",
          ],
        },
        {
          type: "p",
          text: "**Things to know (slide 34):** communication is usually **one-way and asynchronous** (if a reply is needed, it goes back on a separate channel). Brokers don't enforce a data model; any encoding works, and using **backward- and forward-compatible** encodings lets publishers and consumers be deployed independently.",
        },
      ],
    },
    {
      id: "tds",
      heading: "Lesson 5: Why did the traditional data stack struggle?",
      slides: "35–38",
      blocks: [
        {
          type: "p",
          text: "A **data stack** is the set of tools an organisation uses to collect, store, transform and analyse data. The **Traditional Data Stack (TDS)** ran on the company's own servers. Picture the retailer ten years ago: an on-premises Oracle warehouse, nightly ETL jobs, and analysts building reports in Excel. The slides list three problems:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Long turnaround.** Everything ran on **on-prem infrastructure** whose full cost the company bore. It needed an army of engineers, and systems were **tightly coupled**: a small change in one broke others.",
            "**An expensive journey to insights.** Reports were generated manually and cleaned in Excel: error-prone, and impossible to scale.",
            "**Slow response to new information.** Scaling on-prem is costly and compute is limited; pipelines take hours; slow ETL means **a new data update takes weeks** to reach reports. By then, the opportunity is gone.",
          ],
        },
      ],
    },
    {
      id: "mds",
      heading: "Lesson 6: What makes a data stack “modern”?",
      slides: "39–50",
      blocks: [
        {
          type: "p",
          text: "The **Modern Data Stack (MDS)** is a set of **integrated, cloud-based tools** for collecting, ingesting, storing, cleaning, transforming, analysing and governing data. It's **cloud-native and modular**, automates work and optimises cost, and enables **self-service** analytics and AI. The slides call it *an assembly line for data*.",
        },
        {
          type: "table",
          caption: "TDS vs MDS (slide 39): the core of PYQ Q4",
          head: ["", "Traditional Data Stack", "Modern Data Stack"],
          rows: [
            ["Infrastructure", "Physical, on-premises servers", "**Cloud-native**"],
            ["Scalability", "Manual scaling (buy more hardware)", "**Elastic**: scales with demand automatically"],
            ["Integration", "Custom, hand-built workflows", "**Automated ingestion** with ready-made connectors"],
            ["Flexibility", "**Monolithic**: one big system", "**Modular**: plug-and-play tools"],
            ["Analytics", "Batch reports", "Real-time insight, interactive dashboards"],
            ["Cost", "Large upfront investment (licences, hardware)", "**Pay-as-you-go**"],
            ["Transformation", "ETL before loading (slow)", "ELT inside the warehouse (SQL, dbt)"],
            ["Users", "Dependent on IT", "**Self-service** for analysts and business users"],
          ],
        },
        { type: "diagram", name: "d4-tdsmds" },
        {
          type: "p",
          text: "**Key characteristics (slides 40–43):**",
        },
        {
          type: "list",
          items: [
            "**Self-service:** users can discover data, understand its context and lineage, and get insights without waiting for IT.",
            "**Agile data management:** **availability**, because storage is separate from compute, and **elasticity**, i.e. auto-scaling for peaks (the slides' example: Friday afternoons; for our retailer, Big Billion Days).",
            "**Flexible and quick to set up**, **pay-as-you-go**, and **plug-and-play** with open standards, so there's no vendor lock-in.",
          ],
        },
        {
          type: "table",
          caption: "MDS building blocks (slides 44–49)",
          head: ["Layer", "What it does", "Example tools"],
          rows: [
            ["**Ingestion**", "Moving from batch to **streaming-first**: CDC, replication, publish/subscribe", "Fivetran, Stitch, Kafka"],
            ["**Storage & processing**", "Warehouses, lakes, and **lakehouses** (ACID + CDC on cheap storage)", "Snowflake, BigQuery, Redshift, Databricks"],
            ["**Transformation**", "SQL transformations inside the warehouse, or orchestration + custom code", "**dbt**, Airflow"],
            ["**BI & analytics**", "Self-service exploration, not just static charts", "Looker, Tableau"],
            ["**Catalogues & governance**", "Discovery, trust and context. Metadata itself becomes big data", "Data catalogues"],
            ["**Privacy & access governance**", "Entitlement engines apply access policies across the whole stack", "Policy engines"],
            ["Others", "Real-time processing, data-science tools, event collectors, data-quality tools", "—"],
          ],
        },
        {
          type: "p",
          text: "**Use cases (slide 50):** AI personalisation (Spark + Databricks), customer insights (Snowflake + Looker), supply-chain optimisation (Fivetran + dbt), fraud detection (ML + APIs + Redshift).",
        },
      ],
    },
    {
      id: "pipe",
      heading: "Lesson 7: What is a data pipeline, and why is it so hard to keep one working?",
      slides: "51–57",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Definition",
          text: "A **data pipeline** is a series of steps that **moves data from one system so it becomes useful in another** (analytics, data science, AI/ML). It **pulls** data from the source, **applies transformation rules**, and **pushes** it to the destination.",
        },
        {
          type: "p",
          text: "**Where pipelines came from (slides 52–53).** In the big-data and data-lake era, organisations collected raw data without restriction. To make it usable they built many workflows: clean it, filter it, aggregate it, move it, load it. Those workflows are pipelines. **The situation today:** most organisations still build pipelines **by hand, one at a time, non-repeatably and in isolation**. Development can't keep pace with demand, and business and IT end up “drawing swords”.",
        },
        {
          type: "table",
          caption: "Benefits and challenges (slides 54–57)",
          head: ["Benefits", "Challenges"],
          rows: [
            ["**Self-service data:** analysts and scientists build their own ad-hoc pipelines, fail fast and innovate faster", "**Always under construction:** building and debugging take so long that requirements change before it's finished, creating backlogs"],
            ["**Real-time analytics and apps:** streaming pipelines deliver the right data, to the right place, right now", "**Out of order:** a small change in a row or table means hours of rework; pipelines go offline for fixes. Unplanned changes in the source, called **data drift**, cause hidden breakages"],
            ["**Cloud migration and adoption:** move data to the cloud and use its services (NLP, sentiment, image recognition)", "**“Build it and they will come”:** pipelines are tied to specific frameworks, so changing infrastructure means weeks of rebuilding"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Data drift in real life",
          text: "The payments team renames `amount` to `amount_inr` and starts sending paise instead of rupees. Nothing crashes, the pipeline still runs, but every revenue dashboard and the fraud model now see numbers 100× too big. That's why pipelines need monitoring and validation (Lecture 8).",
        },
      ],
    },
    {
      id: "arch",
      heading: "Lesson 8: How is a pipeline built? Components, ETL vs ELT, batch vs stream, CDC",
      slides: "58–66",
      blocks: [
        {
          type: "p",
          text: "```flow\nOrigin -> Dataflow (processing: ingest, transform) -> Storage (at stages) -> Destination\nWorkflow (task sequence & dependencies) + Monitoring (health of every stage)\n```",
        },
        {
          type: "table",
          caption: "Pipeline components (slides 58–60)",
          head: ["Component", "Meaning", "Retailer example"],
          rows: [
            ["**Origin**", "Where data enters", "Orders database, click events"],
            ["**Destination**", "Where data is finally delivered", "Warehouse, fraud model"],
            ["**Dataflow**", "The movement from origin to destination, including changes and the stores it passes through", "Orders → cleaned → joined with customers → aggregated"],
            ["**Storage**", "Systems that keep data at each stage", "Raw zone in the lake, curated tables"],
            ["**Processing**", "Ingesting, storing, transforming, delivering", "Spark jobs, SQL"],
            ["**Workflow**", "The sequence of tasks and their dependencies", "“Aggregate only after cleaning finishes”"],
            ["**Monitoring**", "Checking that every stage works correctly", "Alerts when row counts drop"],
          ],
        },
        {
          type: "p",
          text: "**ETL vs ELT: when to use which (slides 61–62).** Both extract data and load it into a target; the difference is **where and when the transformation happens**.",
        },
        {
          type: "table",
          head: ["Choose ETL when…", "Choose ELT when…"],
          rows: [
            ["High data quality and governance are needed **before** loading", "The target (a cloud platform) can run massive parallel transformations"],
            ["The target has limited compute or storage (a legacy warehouse)", "You want raw data loaded quickly, for agility"],
            ["The output is structured, curated analytics", "The data is semi-structured or unstructured"],
            ["Complex business-rule transformations run outside the database", "Many downstream consumers will reuse the raw data"],
            ["*E.g.* enterprise warehouse, regulatory reporting, MDM, ERP → warehouse", "*E.g.* lake/lakehouse pipelines, **ML pipelines**"],
          ],
        },
        {
          type: "table",
          caption: "Batch vs stream pipelines (slides 63–64)",
          head: ["", "Batch pipeline", "Stream pipeline"],
          rows: [
            ["How", "Loads data in batches at set intervals (often off-peak); a chain of commands", "Event-driven: processes each event continuously as it happens"],
            ["When", "No immediate need (monthly accounting); goes naturally with ETL", "Data must be continuously up to date (fraud alerts, live stock)"],
            ["Latency / reliability", "High latency; very reliable", "Low latency; less reliable (messages can be dropped or queued)"],
          ],
        },
        {
          type: "p",
          text: "**CDC, Change Data Capture (slide 65).** Instead of copying a whole table every night, capture **every insert, update and delete** as an event as it happens. *Batch CDC* reads the database's own change logs; *trigger CDC* comes from events emitted by cloud NoSQL databases. It's used for **replication**. The slide's example: an e-commerce stock (SKU) database fails, and traffic switches to a CDC-maintained replica with **no interruption and minimal data loss**.",
        },
        {
          type: "p",
          text: "**The Dataflow model and Apache Beam (slide 66).** Google's idea for unifying batch and streaming: treat **all data as events**. A stream is **unbounded** (it never ends); a batch is just a **bounded** stream (it has an end). Aggregations happen over **windows** of time: *tumbling* (back-to-back, e.g. every 5 minutes) or *sliding* (overlapping). The same code handles both. The philosophy that *batch is a special case of streaming* is also adopted by Flink and Spark.",
        },
      ],
    },
    {
      id: "impl",
      heading: "Lesson 9: How do teams implement and tool pipelines?",
      slides: "67–78",
      blocks: [
        {
          type: "p",
          text: "**From simple to complex (slide 67).** *Simple:* a CSV file → a database → a dashboard. *Complex:* 10 sources → merge fields → build a dimensional schema → aggregate by year → flag nulls → create a BI extract → personalised dashboards.",
        },
        {
          type: "p",
          text: "**Two pipelines, not one (slides 68–70).** A **development pipeline** creates the pipeline code; an **execution pipeline** runs it in production. They're usually owned by **different teams**, so developers change code without owning its downstream impact, which causes errors and delays. The fix is to integrate the two, which is the idea behind **DataOps** (Lecture 5).",
        },
        {
          type: "p",
          text: "**Micro-pipelines (slides 71–73).** Split a big pipeline into **small, independent pipelines**, one per stage, so each step can be changed without disrupting the whole flow. The process: **requirement** (managed with agile methods such as Scrum or Kanban, e.g. “add a new source” or “add a field”) → **development** (not necessarily code: a model or dashboard change, and heavily automated).",
        },
        {
          type: "p",
          text: "**Choosing tools: three questions (slide 74).** Do we just **move** data, or **transform** it too? Is the environment **stable** and under our control, or **dynamic**, with external sources that change? Is this a **one-off**, or will it be **operationalised** and run for years?",
        },
        {
          type: "table",
          caption: "Tool classes (slides 75–77)",
          head: ["Tool class", "Strength", "Weakness"],
          rows: [
            ["**Data ingestion / loading tools**", "Easy to set up and deploy; tackle “always under construction”", "Only basic transforms; rigid, built around specific structures; must be rebuilt when **data drift** happens"],
            ["**Data integration / ETL platforms**", "Hundreds of connectors and transformations", "Designed for an era with little drift, so they break on change and need massive rework"],
            ["**Data engineering platforms (DataOps)**", "**Smart pipelines** that abstract away the *how* and focus on *what, who and where*: deploy in hours, resilient to change, re-point to a new platform in minutes", "Need DataOps maturity in the organisation"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in seven lines",
          text: "1. Pipelines exist because data must flow automatically, at scale (IMD: thousands of stations).\n2. Three modes of data flow: **database** (encode/decode; backward = new reads old, forward = old reads new; preserve unknown fields; data outlives code), **services** (REST, SOAP, RPC/gRPC; SOA vs microservices), **message brokers** (buffer, redeliver, decouple, fan-out; async).\n3. TDS problems: slow turnaround, expensive manual insights, slow response to new data.\n4. MDS: cloud-native, elastic, automated ingestion, modular, real-time, pay-as-you-go, self-service; layers ingestion → storage → transformation (dbt) → BI → catalogue/governance.\n5. Pipeline = pull → transform → push. Benefits: self-service, real-time, cloud. Challenges: always under construction, breaks on **data drift**, tied to platforms.\n6. Components: origin, destination, dataflow, storage, processing, workflow, monitoring. ETL for governed/legacy; ELT for cloud/ML. Batch vs stream; CDC for replication; Beam: batch = bounded stream.\n7. Integrate development and execution pipelines; use micro-pipelines; pick tools by move vs transform, stable vs dynamic, one-off vs operational.",
        },
      ],
    },
  ],

  recap: [
    {
      "type": "callout",
      "kind": "idea",
      "title": "In one line",
      "text": "Pipelines move data automatically from where it's made to where it's useful, and they break when sources change."
    },
    {
      "type": "diagram",
      "name": "d4-modes",
      "caption": "Three ways data moves between programs."
    },
    {
      "type": "list",
      "items": [
        "**Backward** = new code reads old data · **forward** = old code reads new data · rolling upgrades need both.",
        "Services: **REST** (HTTP philosophy) · SOAP (XML, WSDL) · **gRPC** (fast binary). RPC's “looks local” idea is flawed.",
        "Brokers (Kafka): buffer, redeliver, decouple, fan-out; async."
      ]
    },
    {
      "type": "table",
      "head": [
        "",
        "Traditional stack",
        "Modern stack"
      ],
      "rows": [
        [
          "Infra",
          "on-prem",
          "cloud-native"
        ],
        [
          "Scale",
          "manual",
          "elastic"
        ],
        [
          "Integration",
          "hand-built",
          "automated connectors"
        ],
        [
          "Design",
          "monolithic",
          "modular"
        ],
        [
          "Analytics",
          "batch",
          "real-time"
        ],
        [
          "Cost",
          "upfront",
          "pay-as-you-go"
        ],
        [
          "Transform",
          "ETL",
          "ELT (dbt)"
        ],
        [
          "Users",
          "IT-dependent",
          "self-service"
        ]
      ],
      "caption": "PYQ Q4 table"
    },
    {
      "type": "list",
      "items": [
        "**Pipeline** = pull → transform → push. Pains: always under construction, **data drift**, tied to platforms.",
        "Parts: origin, dataflow, storage, processing, destination, workflow, monitoring.",
        "**ETL** for governed/legacy · **ELT** for cloud/ML · batch vs stream · **CDC** for change-by-change replication."
      ]
    },
    {
      "type": "callout",
      "kind": "exam",
      "title": "Exam hook",
      "text": "**PYQ Q4:** reproduce the 8-row TDS vs MDS table, add TDS problems and one tool per MDS layer."
    }
  ],

  glossary: [
    ["Data pipeline", "—", "Steps that pull data, transform it, and push it where it's useful"],
    ["Data flow", "—", "How data moves between systems through processing and storage"],
    ["Encode / decode", "—", "Convert data to bytes for storage or sending / convert it back"],
    ["Backward compatibility", "—", "Newer code can read data written by older code"],
    ["Forward compatibility", "—", "Older code can read data written by newer code"],
    ["Rolling upgrade", "—", "Updating servers one at a time, so old and new versions run together"],
    ["Schema evolution", "—", "Changing the schema without rewriting all existing data"],
    ["Migration", "—", "Rewriting existing data into a new schema"],
    ["API", "Application Programming Interface", "A defined way for programs to call a service"],
    ["SOA", "Service-Oriented Architecture", "An application split into independently deployable services"],
    ["Microservices", "—", "A lighter-weight, more flexible evolution of SOA"],
    ["REST", "Representational State Transfer", "A design philosophy for web APIs on HTTP (not a protocol)"],
    ["SOAP", "Simple Object Access Protocol", "An XML-based web-service protocol"],
    ["WSDL", "Web Services Description Language", "Describes a SOAP API; machine-readable"],
    ["RPC", "Remote Procedure Call", "Calling a remote service as if it were a local function"],
    ["Location transparency", "—", "RPC's (flawed) goal of hiding that a call is remote"],
    ["gRPC", "Google RPC", "Modern RPC framework using Protocol Buffers"],
    ["Message broker", "—", "An intermediary that stores and forwards messages (Kafka, RabbitMQ)"],
    ["Topic / queue", "—", "A named channel in a broker that producers write to and consumers read from"],
    ["Asynchronous", "—", "The sender doesn't wait for the receiver"],
    ["TDS", "Traditional Data Stack", "On-prem, monolithic, manual, batch data tooling"],
    ["MDS", "Modern Data Stack", "Cloud-native, modular, elastic, pay-as-you-go data tooling"],
    ["On-prem", "On-premises", "Running on the company's own servers"],
    ["Elasticity", "—", "Automatically scaling resources up and down with demand"],
    ["dbt", "data build tool", "Runs SQL transformations inside the warehouse"],
    ["Data drift (pipelines)", "—", "Unplanned changes in source structure or meaning that break pipelines"],
    ["ETL / ELT", "Extract-Transform-Load / Extract-Load-Transform", "Transform before loading / load raw, transform in the target"],
    ["Batch / stream pipeline", "—", "Process at intervals / process each event as it arrives"],
    ["CDC", "Change Data Capture", "Capturing each insert, update and delete as an event"],
    ["SKU", "Stock Keeping Unit", "A product identifier in inventory"],
    ["Bounded / unbounded", "—", "A dataset with an end (batch) / without an end (stream)"],
    ["Window (tumbling / sliding)", "—", "A time slice for aggregating a stream: back-to-back / overlapping"],
    ["Micro-pipeline", "—", "A small independent pipeline stage, changeable on its own"],
    ["DataOps", "—", "Applying DevOps/agile practices to data pipelines (Lecture 5)"],
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
### What the examiner wants
The slide-39 comparison table is the core, so reproduce its rows (infrastructure, scalability, integration, flexibility, analytics, cost) and add transformation and users. Then the **problems** of TDS, the **characteristics** of MDS, one tool per MDS layer, and a short example (Lessons 5–6).

### Model answer
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

**Conclusion:** MDS trades heavy upfront investment and rigidity for **cloud elasticity, modularity, automation and self-service**. Its own challenges are tool sprawl and governance/cost control, which call for catalogues and DataOps.

### Takeaway
TDS = on-prem, monolithic, manual, batch, big upfront cost. MDS = cloud-native, modular, automated, real-time, pay-as-you-go, self-service.`,
    },
    {
      title: "Modes of data flow and compatibility",
      marks: 5,
      question: "Describe the three modes of data flow between processes. Explain backward and forward compatibility, schema evolution and why “data outlives code”, using a database example.",
      solution: `
### What the examiner wants
All three modes, each with an example, plus precise definitions of backward and forward compatibility and **when** each is needed (rolling upgrades need both). Mention preserving unknown fields and “data outlives code” (Lessons 2–4).

### Model answer
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

Binary formats with explicit schemas (**Avro, Protobuf**) are designed for this compatibility.

### Takeaway
Database, service call, message broker. New reads old = backward; old reads new = forward.`,
    },
    {
      title: "REST vs SOAP vs RPC/gRPC; SOA vs microservices",
      marks: 5,
      question: "Compare REST, SOAP and RPC (gRPC) for service communication. How do SOA and microservices differ, and why must data encodings stay compatible in them?",
      solution: `
### What the examiner wants
A comparison of the three service styles on format, contract, ease of debugging and typical use; why RPC's location transparency is flawed; and the SOA vs microservices distinction (Lesson 3).

### Model answer
| | REST | SOAP | RPC / gRPC |
|---|---|---|---|
| Nature | Design philosophy on HTTP (not a protocol) | XML-based protocol (WS-* standards) | Call a remote procedure like a local one |
| Interface | URLs + HTTP verbs, JSON | **WSDL** (machine-oriented XML) | IDL (Protocol Buffers for gRPC) |
| Ease | Easy to debug (browser, curl); huge tool ecosystem | Needs heavy tooling/code generation | Needs generated client stubs |
| Performance | Good (text JSON) | Heavy (verbose XML) | **Best**: binary over HTTP/2 |
| Typical use | Public, cross-organisation APIs; microservices | Legacy enterprise integration | Internal service-to-service (same datacentre) |

**Caveat on RPC:** "location transparency" is fundamentally flawed, because remote calls can time out, fail or be slow. Modern frameworks (gRPC, Thrift) are *explicit* about remoteness and add service discovery.

**SOA vs microservices:** both decompose an application into services by functionality, **independently deployable and evolvable**, each owned by one team. SOA is heavier on infrastructure (often an enterprise service bus). Microservices, which evolved from SOA, are lightweight and more flexible. **Compatibility:** teams release independently, so old and new clients and servers run at the same time. Encodings must be backward and forward compatible across API versions.

### Takeaway
REST = simple HTTP philosophy; SOAP = heavy XML protocol; gRPC = fast binary RPC inside an organisation. Microservices are a lighter evolution of SOA.`,
    },
    {
      title: "Message brokers vs direct RPC",
      marks: 5,
      question: "What is asynchronous message passing? Explain how a message broker works and its advantages over direct RPC, with an example.",
      solution: `
### What the examiner wants
What a broker is, the flow diagram, the five advantages over direct calls, and the trade-offs (asynchronous, one-way). A concrete publish/subscribe example helps (Lesson 4).

### Model answer
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

**Example:** an e-commerce order event is consumed independently by billing, inventory and the ML feature pipeline. If inventory is down, its messages wait in the broker.

### Takeaway
A broker adds a buffer between sender and receiver: reliability, redelivery, fan-out and decoupling, at the cost of asynchronous, one-way communication.`,
    },
    {
      title: "Pipeline architecture, ETL vs ELT, batch vs streaming, CDC",
      marks: 5,
      question: "Explain the components of a data pipeline architecture. Compare ETL with ELT and batch with stream processing pipelines, and describe where CDC fits.",
      solution: `
### What the examiner wants
The component diagram, then each comparison with **when to use which** and examples, then CDC with its replication use case. Tables keep it compact (Lesson 8).

### Model answer
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

**Unifying the two:** Google's **Dataflow model / Apache Beam** treats batch as a *bounded* stream and processes both with windowed aggregations in near-identical code (also Flink, Spark).

### Takeaway
Components: origin → dataflow → storage → destination, plus workflow and monitoring. ETL for governed or legacy targets, ELT for cloud and ML; batch for periodic, stream for continuous; CDC for change-by-change replication.`,
    },
    {
      title: "Data pipeline benefits, challenges and tooling",
      marks: 5,
      question: "What are the benefits and challenges of data pipelines? Compare ingestion tools, integration/ETL platforms and data engineering (DataOps) platforms, and explain micro-pipelines.",
      solution: `
### What the examiner wants
The three benefits and three challenges from slides 54–57 (name **data drift** explicitly), then the tool classes with strengths and weaknesses, and how DataOps and micro-pipelines address the challenges (Lessons 7 and 9).

### Model answer
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

**Micro-pipelines:** split a complex pipeline into small independent stages so each can change without disrupting the whole flow. Each follows **requirement** (agile, e.g. add a source or field) → **development** (automated; may be a model or dashboard change rather than code). Combine this with integrated **development and execution pipelines**, so teams owning code also own its downstream impact.

### Takeaway
Pipelines unlock self-service and real-time data but are fragile: always under construction and broken by drift. Smart, modular (DataOps) pipelines are the answer.`,
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
