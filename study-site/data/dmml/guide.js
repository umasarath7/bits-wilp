// DMML — Answer-writing guide for the theory-based comprehensive exam

export default {
  title: "How to Write 5-Mark DMML Answers",
  source: "Study guide · based on the previous comprehensive paper pattern",
  overview:
    "The DMML comprehensive is **pure theory**: six 5-mark questions that ask you to *apply* concepts to scenarios. Marks come from **structure, coverage of key concepts, a diagram or table, and a concrete example**, not length. Use the framework below for every answer, and the keyword bank to make sure the examiner sees the terms they're looking for.",

  summary: [
    {
      id: "framework",
      heading: "1. The 5-part answer framework (≈ 1 mark each)",
      slides: "",
      blocks: [
        { type: "p", text: "```flow\n1. Define / set context -> 2. Key concepts (4–6 points) -> 3. Diagram or comparison table -> 4. Apply to the scenario / example -> 5. Trade-offs + conclusion\n```" },
        {
          type: "table",
          head: ["Part", "What to write", "Length"],
          rows: [
            ["**1. Define / context**", "One or two crisp sentences using the lecture's definition (e.g. “Data architecture is the design of systems to support evolving data needs through flexible, reversible decisions…”)", "2–3 lines"],
            ["**2. Key concepts**", "The 4–6 points the lecture lists (e.g. the 4 data-mesh principles, 3 selection-bias sub-types, 4 pipeline steps), each with **bold heading + one line**", "Half a page"],
            ["**3. Diagram / table**", "A flow diagram (boxes + arrows) or a comparison table. Questions saying “with suitable diagram” *lose marks without one*", "Quarter page"],
            ["**4. Apply / example**", "Tie it to the scenario in the question (global org, bank, hospital, e-commerce) and give an industry example from the slides (Netflix, DoorDash, Airbnb, IMD…)", "5–6 lines"],
            ["**5. Trade-offs + conclusion**", "Pros/cons or when *not* to use it, then a one-line takeaway", "2–3 lines"],
          ],
        },
      ],
    },
    {
      id: "verbs",
      heading: "2. Decode the question verb",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Verb in question", "What the examiner wants", "PYQ example"],
          rows: [
            ["**Compare**", "A table with 6–8 dimensions + a short verdict", "Q4: TDS vs MDS"],
            ["**Describe with diagram**", "Labelled flow diagram + explanation of each block", "Q5: data engineering pipeline"],
            ["**Describe with examples**", "Definition + sub-types + 2–3 concrete examples + impact", "Q6: selection bias"],
            ["**How would you apply… / design…**", "Options → trade-off analysis against the stated criteria → recommended design + justification", "Q3: centralisation for a global org"],
            ["**How can an organisation…**", "A strategy: goals → components/controls → risks/mitigation → metrics → example", "Q2: data as an asset"],
            ["**How does X influence Y… provide an example**", "Mechanism (why X causes Y) + a worked example showing the benefit", "Q1: graph models → query languages"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Answer every clause",
          text: "Long questions (like Q3) list several criteria: *integration, security, performance, business needs, regulation, infrastructure*. Make each one a **visible sub-heading or table row**. Missing a clause is the most common way to lose marks.",
        },
      ],
    },
    {
      id: "diagrams",
      heading: "3. Diagrams worth memorising (one per lecture)",
      slides: "",
      blocks: [
        { type: "p", text: "**L1:** serialization flow\n```flow\nProducer -> Serializer -> Bytes -> Transfer/Store -> De-serializer -> Consumer\n```" },
        { type: "p", text: "**L2:** ML data lifecycle\n```flow\nCreation -> Ingestion -> Processing (validate, clean, enrich) -> Post-processing (store, metadata, visualise) -> ML\n```" },
        { type: "p", text: "**L3:** Lambda\n```flow\nSource -> Batch layer (cold) -> Serving layer\nSource -> Speed layer (hot) -> Serving layer\n```" },
        { type: "p", text: "**L4:** pipeline architecture\n```flow\nOrigin -> Dataflow / processing -> Storage -> Destination (workflow + monitoring around it)\n```" },
        { type: "p", text: "**L5:** lifecycle + CI/CD/CT\n```flow\nSource -> Ingestion -> Transformation -> Serving -> Analytics / ML / Reverse ETL (storage underneath)\nExperiment -> CI -> CD (canary, A/B) -> CT\n```" },
        { type: "p", text: "**L6:** three levels of ML software\n```flow\nData: Ingest -> Explore & validate -> Wrangle -> Split\nModel: Train -> Evaluate -> Test -> Package\nCode: Serve -> Monitor -> Log\n```" },
        { type: "p", text: "**L7:** streaming ingestion\n```flow\nProducers -> Topic (partitions) -> Consumers -> Sink\nFailures -> Dead-letter queue\n```" },
        { type: "p", text: "**L8:** validation component\n```flow\nTraining stats -> New data stats -> Compare -> Auto-action -> Alert\n```" },
      ],
    },
    {
      id: "keywords",
      heading: "4. Keyword bank per lecture",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Lecture", "Must-use keywords"],
          rows: [
            ["L1 Representations", "schema; structured/semi/unstructured; relational/normalisation; graph nodes & edges, Cypher/Gremlin; document, key-value; declarative vs imperative, query optimiser; row vs column (Parquet); serialization (JSON, Avro, Protobuf, BSON); OLTP vs OLAP; roll-up/drill-down/pivot"],
            ["L2 Fundamentals", "data as asset/liability; PII, consent, GDPR/DPDPA, residency; access restriction, pseudonymisation, connection removal; ML pipelines sensitive to distribution; durability, consistency, versioning, performance, availability; ETL/ELT; warehouse/lake/lakehouse; governance council, metadata; data platform; lifecycle phases; roles"],
            ["L3 Architectures", "blueprint; flexible & reversible decisions; operational vs technical; centralised/decentralised/hybrid, MDM, golden source; star/snowflake, fact/dimension, data mart; data swamp, dark data, WORN; lakehouse ACID; data mesh (4 principles), data fabric; Lambda (batch/speed/serving), Kappa (replay); 5 Vs; big-data components"],
            ["L4 Pipelines", "modes of data flow (DB, services, message passing); backward/forward compatibility, schema evolution, data outlives code; SOA, microservices, REST, SOAP/WSDL, RPC/gRPC; message broker; TDS vs MDS (cloud-native, elastic, modular, pay-as-you-go, self-service); ETL vs ELT; batch vs stream; CDC; Dataflow model; data drift; micro-pipelines; DataOps smart pipelines"],
            ["L5 Infrastructure", "Fivetran/Stitch; dbt; Airflow/Kubeflow; HDD/SSD/RAM; strong vs eventual consistency; file/block/object; EBS, EFS, S3; Redis/Memcached; HDFS (NameNode, 3× replication); streaming retention/replay; reverse ETL; business/operational/embedded analytics; DS stack layers; query federation; IaC, GitOps; DataOps; at rest/in transit/in use; CI/CD/CT; observability, data downtime; feature store (DoorDash)"],
            ["L6 ML lifecycle", "business goal, problem framing, data processing, model development, deployment, monitoring; feedback loops; feature store, model registry, alarm manager, scheduler, lineage tracker; data leakage, scaling, augmentation; feature creation/extraction/selection; data vs model parallelism; blue/green, canary, A/B, shadow; data vs concept drift; Data/Model/Code; ingestion → exploration & validation → wrangling → splitting; PMML/PFA/ONNX; forecast/web-service/online/AutoML; serving patterns; federated learning; Docker/K8s, serverless; DataOps→ModelOps→DevOps"],
            ["L7 Ingestion", "1st/2nd/3rd-party; user-entered vs system-generated; RDBMS/ACID; key-value/document/wide-column/search/time-series; REST, GraphQL, webhooks, gRPC; data sharing/marketplace; message queue vs event streaming, topics & partitions; data contract, lineage, governance; engineering considerations; snapshot vs differential; late data, at-least-once, replay, TTL, DLQ, push/pull; JDBC/ODBC, CDC (batch/log-based/Debezium), SFTP, transfer appliance"],
            ["L8 Profiling & validation", "10 DQ dimensions; informative, coverage, real inputs, unbiased, feedback loop, consistent labels, big enough; noise, low predictive power, outliers; 12 biases; selection bias (coverage, non-response, sampling); fairness red flags; leakage (function of feature, hidden target, future feature); schema/distribution skew, concept drift, training-serving skew; PSI, KL; single/multi-field profiling; Great Expectations, Soda, Deequ; shift-left; pre-ingestion vs pre-training"],
          ],
        },
      ],
    },
    {
      id: "mistakes",
      heading: "5. Common mistakes to avoid",
      slides: "",
      blocks: [
        { type: "list", items: [
          "Writing a **generic essay** without the lecture's specific lists (e.g. naming only 2 of the 4 data-mesh principles).",
          "**No diagram** when the question says “with suitable diagram”.",
          "Comparing in paragraphs instead of a **table**.",
          "Forgetting the **scenario**: if the question mentions a global org or a bank, your recommendation must address it explicitly.",
          "Only one side of a pair: **asset *and* liability**, **pros *and* cons**, **batch *and* stream**.",
          "No **conclusion/recommendation** for “how would you apply/design” questions.",
        ]},
      ],
    },
  ],

  theory: [
    {
      title: "Practice: build an answer skeleton",
      marks: 5,
      question: "Without writing the full answer, build a 5-part skeleton (headings + bullet keywords + diagram outline) for: “How would an organisation use a data mesh to overcome the limitations of a centralised data lake? Discuss the trade-offs.”",
      solution: `
**1. Context:** a centralised lake/warehouse becomes a *bottleneck* (one central team, slow onboarding, data swamp, dark data, WORN). Data mesh (Zhamak Dehghani) decentralises ownership using domain-driven design.

**2. Key concepts (the 4 principles):**
- domain-oriented decentralised ownership
- **data as a product** (schema, SLAs, docs, discoverable)
- **self-serve data platform** (catalogue, monitoring, pipelines as a service)
- **federated computational governance** (global standards enforced automatically)

**3. Diagram**
\`\`\`flow
Orders domain -> Orders data product (schema, SLA)
Payments domain -> Payments data product
Marketing domain -> Consumes both via the catalogue
Self-serve platform + federated governance underneath all domains
\`\`\`

**4. Apply / example:** e-commerce. The orders team publishes "order events" with metadata and SLAs; marketing and ML teams consume them directly, and no central ticket queue is needed.

**5. Trade-offs + conclusion:**
- *Pros:* scalability of teams, domain expertise, faster delivery.
- *Cons:* needs mature domain teams, risk of inconsistent standards (mitigated by federated governance), platform investment, possible duplication.
- *Conclusion:* adopt mesh when many domains and a central bottleneck exist; keep central governance and a shared platform.`,
    },
    {
      title: "Practice: turn a weak answer into a strong one",
      marks: 5,
      question: "Weak answer to “Compare ETL and ELT”: “ETL transforms before loading and ELT loads before transforming. ELT is newer and better.” Rewrite it to earn full marks.",
      solution: `
**Definition:** both are **data pipeline architectures** for integrating data. **ETL** = Extract → Transform (in a separate engine) → Load. **ELT** = Extract → Load raw data into the target → Transform inside the target.

\`\`\`flow
ETL: Sources -> Extract -> Transform (staging engine) -> Load -> Warehouse
ELT: Sources -> Extract -> Load (raw) -> Lake / cloud warehouse -> Transform in place (SQL/dbt)
\`\`\`

| Dimension | ETL | ELT |
|---|---|---|
| Where the transform happens | External engine before load | Inside the target platform |
| Data types | Structured | Structured + semi/unstructured |
| Speed to land data | Slower (transform first) | Fast (load raw) |
| Target compute | Can be limited (legacy DW) | Must be powerful (cloud, MPP) |
| Governance | Quality and rules enforced **upfront** | Raw data kept; governance needed in the lake |
| Reusability | One curated output | Raw data reused by many consumers |
| Typical use | Enterprise DW, **regulatory reporting**, MDM, ERP → DW | Lake/lakehouse, **ML pipelines**, exploratory analytics |

**Why ELT grew:** cloud infrastructure (cheap storage, elastic compute) and the need for real-time and unstructured data, which ETL struggles with.

**Conclusion:** neither is universally better. Use **ETL** when strict upfront quality and compliance matter or the target is weak. Use **ELT** for agility, scale and ML on a modern data stack.`,
    },
  ],

  quiz: [],
};
