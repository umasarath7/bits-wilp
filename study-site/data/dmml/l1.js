// DMML — Lecture 1: Data Representations
// Source: CourseFiles/DMML/L1-Data Representations.pptx (49 slides)

export default {
  title: "Data Representations",
  source: "L1-Data Representations.pptx · 49 slides",
  overview:
    "How data is *represented* before any ML happens. The lecture covers data formats (structured, semi-structured, unstructured); **data models** (relational, hierarchical, graph, document, key-value) and how each shapes its **query language**; **declarative vs imperative** querying; **row vs column** storage layouts; **serialization** (text vs binary formats); and **OLTP vs OLAP** processing. For ML the message is that a model is only as good as the underlying data systems: their structure, performance, accuracy and reliability.",

  summary: [
    {
      id: "dm",
      heading: "1. What & why of data management (for ML)",
      slides: "5–9",
      blocks: [
        { type: "p", text: "**Data management** is the practice of *ingesting, processing, securing and storing* an organisation's data, which is then used for *strategic decision-making to improve business outcomes*." },
        { type: "list", items: [
          "**Why:** the growth of big data (hybrid cloud, AI, IoT, edge), changing priorities (data silos, security risks, decision bottlenecks), and the need for clean data to improve business outcomes.",
          "**Why for ML:** an ML system is *essentially a data-processing pipeline* whose purpose is to extract usable, repeatable insights from data.",
          "**How ML differs from ordinary log-processing pipelines:** its success is hard to measure, failures are hard to detect, and it **depends entirely on the underlying data-management systems** for *structure, performance, accuracy and reliability*.",
        ]},
      ],
    },
    {
      id: "formats",
      heading: "2. Formats of data",
      slides: "10–12",
      blocks: [
        { type: "p", text: "**Schema** = the blueprint that defines how data is organised, stored and related: its rules, format and constraints." },
        {
          type: "table",
          head: ["", "Structured", "Semi-structured", "Unstructured"],
          rows: [
            ["What", "A definite, predefined schema", "Structured + unstructured: some tags/fields, a flexible schema", "No schema"],
            ["Example", "Excel/CSV tables, RDBMS rows", "Emails (from/to/subject + free body), JSON, XML, logs", "Handwritten notes, audio, video, images, news"],
            ["Advantages", "Easy to analyse; fast to retrieve", "Evolving schema; highly interoperable", "Many storage options; rich interpretations; adapts to change"],
            ["Disadvantages", "Schema changes are costly; the fixed schema is restrictive; new source types don't fit", "Hard to write validation/analysis routines", "Hard to analyse; slower to retrieve"],
          ],
        },
      ],
    },
    {
      id: "models",
      heading: "3. Data models",
      slides: "13–26",
      blocks: [
        { type: "p", text: "A **data model** is the way data is structured, stored and organised. It decides *what is easy and what is hard to express and query*." },
        { type: "list", items: [
          "**Relational:** data is a set of *relations* (tables), each a set of *tuples* (rows). Relations are unordered. An un-normalised table has redundancy, poor integrity, and is hard to interpret and extend, so we **normalise** it (1NF → 2NF → 3NF → BCNF → 5NF) to reduce redundancy, improve integrity and allow expansion.",
          "**Hierarchical:** a tree of parent-child records, e.g. the Windows Registry (regedit), organisation charts, DB indexes. Queries are *navigational* (e.g. IBM IMS, DL/I).",
          "**Graph:** **nodes** (entities) and **edges** (relationships). *Relationships are first-class.* In a document DB the *content* is the priority; in a graph DB the *relationships* are the priority, so connected data is retrieved faster. Examples: Neo4j, Amazon Neptune, TigerGraph. Used for social networks (LinkedIn, Facebook), fraud detection, recommendations, and mapping projects to business objectives.",
          "**Document:** self-contained *documents* (JSON/XML) with a unique key. Collection ≈ table, document ≈ row, but much more flexible (nested arrays, e.g. a book with several ‘Sold as’ formats). Examples: MongoDB, CouchDB, Amazon DocumentDB, Firestore. Used for emails, logs, content catalogues.",
          "**Key-value:** a collection of key → value pairs; lookup by key only. Extremely fast for simple reads and writes. Examples: Redis, DynamoDB, Riak. Used for caching, sessions, configuration.",
        ]},
        {
          type: "table",
          caption: "Comparison of data models (slide 26)",
          head: ["", "Relational", "Hierarchical", "Graph", "Document", "Key-value"],
          rows: [
            ["Structure", "Strict schema (tables)", "Tree (parent-child)", "Nodes + edges (flexible)", "Semi-structured JSON/XML", "Key → value"],
            ["Querying", "SQL (standard, powerful)", "Navigational (DL/I)", "**Cypher, Gremlin** (relationship-oriented)", "JSONPath, MongoDB QL", "By key only"],
            ["Performance", "Moderate; good for complex queries", "Fast hierarchical traversal", "**Fast for connected-data queries**", "Fast document reads/writes", "Extremely fast simple reads/writes"],
            ["Usage", "ERP, CRM, business apps", "Legacy systems, file systems", "Social networks, fraud, recommendations", "CMS, catalogues, APIs", "Caching, sessions, config"],
            ["Examples", "MySQL, PostgreSQL, Oracle", "IBM IMS", "Neo4j, Neptune, TigerGraph", "MongoDB, CouchDB", "Redis, DynamoDB"],
          ],
        },
        { type: "p", text: "Relational = **SQL**. Hierarchical, graph, document and key-value are grouped as **NoSQL**." },
      ],
    },
    {
      id: "query",
      heading: "4. Query languages: declarative vs imperative",
      slides: "27–31",
      blocks: [
        { type: "p", text: "**Analogy from the slides.** *Imperative:* “Open the door, go to the parking, open the car, check the bag, take it, close the car…” (**how**). *Declarative:* “Bring the bag from the car if it isn't empty” (**what**)." },
        {
          type: "table",
          head: ["", "Imperative / procedural", "Declarative"],
          rows: [
            ["You specify", "Every step and its order (loops, conditions, variables)", "The pattern of data wanted, the conditions, and the transformation (sort/group/aggregate)"],
            ["Who decides how", "The programmer must know the optimal way", "The **query optimiser** (indexes, joins, execution order)"],
            ["Optimisation", "The system can't optimise execution or memory", "The DB can improve performance **without changing queries** (execution plans)"],
            ["Parallelism", "Hard to parallelise a sequence of instructions", "Naturally lends itself to parallel execution, decided by the DB"],
            ["Ordering", "Output order is guaranteed", "Order only if requested"],
            ["Examples", "Application code looping over records; navigational queries", "**SQL**, Cypher, CSS selectors"],
          ],
        },
      ],
    },
    {
      id: "layout",
      heading: "5. Storage layouts: row vs column",
      slides: "32–34",
      blocks: [
        {
          type: "table",
          head: ["", "Row-major", "Column-major"],
          rows: [
            ["Stores", "All columns of a row together", "All values of a column together"],
            ["Fast at", "Accessing whole rows, **writes**", "Reading a few columns over many rows, **reads**/scans"],
            ["Good for", "**OLTP**", "**OLAP**, ML feature reads (thousands of features, few needed)"],
            ["Examples", "CSV; MS SQL Server", "**Parquet**; Amazon Redshift"],
          ],
        },
      ],
    },
    {
      id: "serial",
      heading: "6. Data serialization",
      slides: "35–41",
      blocks: [
        { type: "p", text: "**Serialization** converts data from one form to another (e.g. in-memory objects → text/binary) to **store** it (size constraints) or **transfer** it (bandwidth constraints). **Deserialization** reverses it. Both must use the **same algorithm/schema**. Take care when producer and consumer use different languages or technologies." },
        { type: "p", text: "```flow\nData producer -> Serializer -> Serialized data -> Transfer / store -> De-serializer -> Data consumer\n```" },
        {
          type: "table",
          head: ["Type", "Format", "Notes"],
          rows: [
            ["Text", "CSV", "Simple table, no nesting"],
            ["Text", "XML", "Hierarchical; used in older systems"],
            ["Text", "JSON", "Modern, language-agnostic"],
            ["Binary", "Protobuf", "Google's Protocol Buffers (used by gRPC)"],
            ["Binary", "Avro", "Apache; Hadoop/Spark compatible; schema-based"],
            ["Binary", "BSON", "Binary JSON, used by MongoDB"],
            ["Binary", "JSONB", "Binary JSON in PostgreSQL for semi-structured data"],
          ],
        },
        { type: "p", text: "**Example (slide 40):** a program's JSON → JSON-to-BSON serializer → BSON stored in the DB → BSON-to-JSON deserializer → JSON. The same language, JSON structure and algorithm must be used on both sides." },
      ],
    },
    {
      id: "olap",
      heading: "7. Data processing types: OLTP vs OLAP",
      slides: "42–47",
      blocks: [
        {
          type: "table",
          head: ["", "OLTP", "OLAP"],
          rows: [
            ["Stands for", "Online *Transaction* Processing", "Online *Analytical* Processing"],
            ["Purpose", "Save transactions immediately", "Analyse data derived from OLTP"],
            ["Data", "Current, operational", "Historical, consolidated"],
            ["Volume", "Many small transactions", "Fewer but large queries"],
            ["Optimised for", "**Fast writes**", "**Fast reads**"],
            ["Example", "A GPay payment; office entry/exit swipe", "GPay spending analysis; attendance computed from swipes"],
          ],
        },
        { type: "p", text: "**OLAP operations:** **roll-up** (summarise up a hierarchy, e.g. city → country), **drill-down** (go to finer detail: region → country → product), **slice/dice** (fix one or more dimensions), and **pivot/rotate** (swap rows and columns, e.g. Year×Line ↔ Line×Year). **Typical calculations:** margins, shares (% of total), KPIs, moving averages, growth %, trend analysis." },
        { type: "p", text: "**Slide 44 story:** a sharp profitability dip → drill down by region → Europe → EU countries → products → indirect costs up → root cause: additional tax on some products in the EU. OLAP turns data into *insight*." },
        { type: "p", text: "**OLAP features.** *Basic:* multidimensional analysis, consistent fast response, drill-down/roll-up, slice-and-dice, time intelligence. *Advanced:* cross-dimensional calculations, pre-consolidation, drill-through, alerts, collaborative decisions." },
      ],
    },
  ],

  keyTerms: [
    ["Schema", "Blueprint of how data is organised, stored and related."],
    ["Semi-structured", "Partly tagged/flexible schema (JSON, XML, email)."],
    ["Normalisation", "Splitting tables (1NF…BCNF) to remove redundancy and keep integrity."],
    ["Graph model", "Nodes + edges; relationships are first-class."],
    ["Cypher / Gremlin", "Declarative / traversal query languages for graphs."],
    ["Document model", "Self-contained JSON/XML documents retrieved by key."],
    ["Key-value", "Simplest NoSQL: key → opaque value; very fast lookups."],
    ["Declarative query", "States *what* is wanted; the optimiser decides *how*."],
    ["Imperative query", "Spells out *how*, step by step."],
    ["Row vs column store", "Row = fast writes (OLTP); column = fast analytical reads (OLAP)."],
    ["Serialization", "Encoding data for storage/transfer; deserialization reverses it."],
    ["OLTP / OLAP", "Transactional writes vs analytical reads."],
    ["Roll-up / drill-down", "Aggregate up / go into more detail along a hierarchy."],
  ],

  examTips: [
    "**PYQ Q1** was on *graph data models and query languages*. Link the model to the language: a graph model gives relationship-first languages (Cypher/Gremlin) where multi-hop queries are short and fast, while SQL needs many self-JOINs.",
    "For every “compare X vs Y” question, draw a **table** with 5–6 rows: definition, structure, strengths, weaknesses, use case, example tool.",
    "Always end a 5-mark answer with a **concrete example/scenario** from industry (bank, e-commerce, hospital). The paper's questions are application-oriented.",
  ],

  theory: [
    {
      title: "Graph data models and query languages",
      pyq: "Comprehensive Q1 (5 marks)",
      marks: 5,
      question:
        "How do graph data models influence the design of query languages? Provide an example where a graph data model enables more efficient querying of complex relationships between data entities.",
      solution: `
**1. The graph data model**
Data is stored as **nodes** (entities, e.g. Person, Account), **edges** (relationships, e.g. FRIEND_OF, TRANSFERRED_TO), and **properties** on both. Relationships are stored explicitly as first-class citizens, not recomputed through foreign-key JOINs. As the slides put it: *in a document DB the content is the priority; in a graph DB the relationships are the priority.*

**2. How the model shapes the query language**
- **Pattern matching instead of joins.** Because relationships are data, a query *describes a path pattern*: \`(a)-[:FRIEND_OF]->(b)\`. Languages such as **Cypher** (Neo4j) and **GQL** are declarative, ASCII-art-like, relationship-oriented languages.
- **Traversal primitives.** **Gremlin** (Apache TinkerPop) is a traversal language (\`g.V().out('knows')\`), so hops, direction and depth are native operators.
- **Variable-length paths.** Syntax such as \`-[:KNOWS*1..3]->\` expresses "friends up to 3 hops away" in one line. In SQL this needs recursive CTEs or repeated self-JOINs.
- **Graph algorithms as built-ins:** shortest path, PageRank, community detection.
- **Still declarative:** the user states the pattern and the engine picks the traversal order (index-free adjacency), just as a SQL optimiser does.

**3. Example: fraud ring detection in a bank**
Find accounts that share a phone number or device with a known fraudster, up to 3 hops away.

\`\`\`flow
Fraudster -> uses -> Device D1 -> used by -> Account A -> transfers to -> Account B
\`\`\`

*Cypher:*
\`\`\`
MATCH (f:Account {flagged:true})-[:USES|TRANSFERS_TO*1..3]-(suspect:Account)
RETURN DISTINCT suspect
\`\`\`
*Relational equivalent:* three or more self-JOINs on the accounts, devices and transfers tables, or a recursive CTE. The cost grows with **table size** at each hop. In a graph DB the cost grows only with the **neighbourhood visited**, because each node points directly at its neighbours.

Other examples: LinkedIn "people you may know" (2nd and 3rd-degree connections), recommendation engines (users → bought → product ← bought ← users), and mapping projects to business objectives (slide 20).

**4. Conclusion**
The graph model makes *relationships* the unit of storage, so its query languages are built around *patterns and traversals*. That makes deep, multi-hop relationship queries concise to write and efficient to run, which relational SQL handles poorly.`,
    },
    {
      title: "Choosing data models for one application",
      marks: 5,
      question:
        "An e-commerce company stores (a) orders and payments, (b) a product catalogue whose attributes differ by category, (c) shopping-cart sessions, and (d) a 'customers who bought this also bought' feature. Recommend a data model for each, with justification and example databases.",
      solution: `
| Need | Model | Why | Example DB |
|---|---|---|---|
| (a) Orders, payments | **Relational** | Fixed schema, ACID transactions, integrity through normalisation and foreign keys, complex SQL reporting | PostgreSQL, MySQL, Oracle |
| (b) Catalogue with varying attributes | **Document** | Each product is a self-contained JSON document; a phone has "RAM" while a shirt has "size", with no fixed schema needed. Nested arrays (variants, prices) fit naturally | MongoDB, DocumentDB |
| (c) Cart / session | **Key-value** | Look up by session-id only; extremely fast reads/writes and high concurrency; data is temporary | Redis, DynamoDB |
| (d) "Also bought" | **Graph** | Recommendations are multi-hop relationships (user → bought → product ← bought ← other users → bought → product). Graph traversal is much faster than repeated JOINs | Neo4j, Neptune |

**Point to make:** this is **polyglot persistence**: use the right model per workload instead of forcing one model everywhere. The trade-off is more systems to integrate and govern, handled by pipelines and a data platform (L2, L4).`,
    },
    {
      title: "Declarative vs imperative query languages",
      marks: 5,
      question: "Differentiate declarative and imperative query languages with an example. Why have databases standardised on declarative languages such as SQL?",
      solution: `
**Definitions**
- **Imperative:** you tell the computer *how*, specifying every step in order: loop over records, evaluate conditions, update variables, decide whether to fetch the next record.
- **Declarative:** you state *what* you want (the pattern of data, the conditions it must meet, and how to sort/group/aggregate it) and leave the *how* to the system.

**Example: retrieve all sharks from an animals list**
- Imperative:
\`\`\`
sharks = []
for a in animals:
    if a.family == "Sharks": sharks.append(a)
\`\`\`
- Declarative:
\`\`\`
SELECT * FROM animals WHERE family = 'Sharks';
\`\`\`

**Why declarative won**
1. **Optimisation freedom.** The query optimiser chooses indexes, join algorithms and execution order. The DB can get faster (new indexes, better plans) **without changing any query**.
2. **Parallelism.** Since no order is prescribed, the engine can spread work across cores and machines. Imperative code is hard to parallelise.
3. **Simplicity.** It is concise, hides implementation details, and is easier for analysts.
4. **Limited functionality helps.** The language is restricted, so the system has more room to optimise automatically.

**Trade-off:** imperative code guarantees ordering and gives full control, but the programmer must know the optimal strategy and the system can't optimise it.`,
    },
    {
      title: "Row vs column storage for OLTP, OLAP and ML",
      marks: 5,
      question: "Explain row-major and column-major storage layouts. Which is better for OLTP, OLAP and ML training workloads, and why? Give example formats and systems.",
      solution: `
**Row-major:** all columns of one row are stored contiguously (row1: id, name, age | row2: …).
**Column-major:** all values of one column are stored contiguously (ids… | names… | ages…).

\`\`\`flow
Row store: [id1 name1 age1] -> [id2 name2 age2] -> [id3 name3 age3]
Column store: [id1 id2 id3] -> [name1 name2 name3] -> [age1 age2 age3]
\`\`\`

| | Row | Column |
|---|---|---|
| Best at | Reading/writing whole records; **fast writes** | Scanning a few columns across many rows; **fast reads** |
| Workload | **OLTP**: insert an order, update a balance | **OLAP**: SUM(sales) by region over millions of rows |
| Compression | Lower (mixed types per block) | High (same type, similar values together) |
| Examples | CSV; MS SQL Server; MySQL (InnoDB) | **Parquet**, ORC; Amazon **Redshift**, BigQuery, Snowflake |

**ML training:** feature tables are wide (thousands of features), but a model often needs a subset of columns across all rows, so **columnar formats (Parquet)** are preferred: they read only the needed columns and compress well. Online inference that fetches one entity's full feature vector at a time behaves more like OLTP, so row/key-value stores (feature stores) fit there.`,
    },
    {
      title: "Data serialization",
      marks: 5,
      question: "What is data serialization and why is it needed? Explain the serialization process with a diagram, and compare text and binary serialization formats. Which would you choose for high-volume service-to-service messaging?",
      solution: `
**What:** converting data from one form to another, typically in-memory objects → a byte/text representation (serialization) and back (deserialization).
**Why:** to **store** data (size constraints) and to **transfer** it across networks (bandwidth constraints), between programs, languages and machines.

\`\`\`flow
Source system: Data producer -> Serializer -> Serialized bytes
Serialized bytes -> Transfer / storage -> De-serializer -> Destination: Data consumer
\`\`\`

**Rules:** both sides must use the **same algorithm/schema**. Take extra care when producer and consumer use different programming languages or technologies.

| | Text (CSV, XML, JSON) | Binary (Protobuf, Avro, BSON, JSONB) |
|---|---|---|
| Human-readable | Yes | No |
| Size / speed | Larger, slower to parse | Compact, fast |
| Schema | Implicit (CSV/JSON) or verbose (XML) | Often explicit (Protobuf, Avro) → safe schema evolution |
| Typical use | Config, REST APIs, data exchange | gRPC (Protobuf), Hadoop/Spark/Kafka (Avro), MongoDB (BSON), Postgres (JSONB) |

**Choice for high-volume service messaging:** **Protobuf** (with gRPC) or **Avro** (with Kafka). They are compact, fast, have a strongly typed schema, and support backward/forward compatibility as services evolve independently (L4, modes of data flow). JSON stays attractive for public or debuggable APIs.`,
    },
    {
      title: "OLTP vs OLAP with OLAP operations",
      marks: 5,
      question: "Differentiate OLTP and OLAP with examples. Explain the OLAP operations roll-up, drill-down, slice/dice and pivot with a sales example.",
      solution: `
| | OLTP | OLAP |
|---|---|---|
| Purpose | Record transactions immediately | Analyse historical data for insights |
| Data | Current, operational, normalised | Historical, consolidated, often denormalised (star schema) |
| Operations | Many small INSERT/UPDATEs | Few large, complex read queries |
| Optimised for | Write speed, concurrency, ACID | Read speed, aggregation |
| Example | Each GPay payment; badge swipe at office entry | Monthly GPay spend analysis; attendance report from swipes |

**OLAP operations on a Sales cube (Year × Product line × Region):**
- **Roll-up:** aggregate up a hierarchy, e.g. total sales per year instead of per month, or per country instead of per city.
- **Drill-down:** the reverse, e.g. Europe → countries → products (the slide's profitability-dip investigation that found an extra EU tax).
- **Slice:** fix one dimension, e.g. only Year = 2025.
- **Dice:** fix several dimensions, e.g. Year = 2025 AND Region = EU AND Line ∈ {Video, Kitchen}.
- **Pivot / rotate:** swap axes, e.g. Year×Line becomes Line×Year for a different view.

**Relation:** OLTP systems are the *source*. ETL/ELT moves their data into a warehouse, where OLAP serves BI and ML feature engineering.`,
    },
    {
      title: "Structured, semi-structured and unstructured data in ML",
      marks: 5,
      question: "Compare structured, semi-structured and unstructured data with advantages, disadvantages and ML examples. Why must a data-management strategy handle all three?",
      solution: `
| | Structured | Semi-structured | Unstructured |
|---|---|---|---|
| Schema | Predefined, fixed | Flexible, self-describing (tags/keys) | None |
| Examples | Transactions table, Excel/CSV | JSON API responses, XML, emails, logs | Images, audio, video, free text, scanned notes |
| Advantages | Easy to query/analyse; fast retrieval | Evolving schema; interoperable | Rich information; many storage options; adapts to change |
| Disadvantages | Rigid; schema changes costly; new sources don't fit | Harder to validate and analyse routinely | Hard to analyse; slow to retrieve; needs extraction (NLP/CV) |
| ML example | Churn from billing data | Clickstream JSON events for recommendations | X-ray images, call-centre audio for sentiment |

**Why all three:** modern ML uses mixed sources. Netflix, for example, combines structured ratings, semi-structured streaming events and unstructured search text (L7). The strategy must therefore include storage for each (warehouse for structured, lake for semi/unstructured, or a **lakehouse**), suitable serialization, metadata/catalogues, and validation rules adapted to each type.`,
    },
  ],

  quiz: [
    { q: "In which data model are relationships the top priority?", options: ["Relational", "Document", "Graph", "Key-value"], answer: 2, why: "Graph DBs store edges as first-class data." },
    { q: "Cypher and Gremlin are query languages for:", options: ["Document DBs", "Graph DBs", "Key-value stores", "Columnar warehouses"], answer: 1, why: "Cypher (Neo4j) and Gremlin (TinkerPop) are relationship-oriented languages." },
    { q: "SQL is an example of which kind of language?", options: ["Imperative", "Declarative", "Navigational", "Procedural"], answer: 1, why: "It states what data is wanted; the optimiser decides how." },
    { q: "Which storage layout is best for OLAP workloads?", options: ["Row-major", "Column-major", "Key-value", "Hierarchical"], answer: 1, why: "Scanning a few columns over many rows is fastest in column stores." },
    { q: "Parquet is a:", options: ["Row format", "Columnar format", "Text format", "Graph format"], answer: 1, why: "Parquet is column-oriented and used in OLAP and ML." },
    { q: "BSON is associated with:", options: ["PostgreSQL", "MongoDB", "Hadoop", "Google gRPC"], answer: 1, why: "Binary JSON is MongoDB's storage format; JSONB belongs to Postgres." },
    { q: "Emails with from/to/subject fields plus a free-text body are:", options: ["Structured", "Semi-structured", "Unstructured", "Relational"], answer: 1, why: "Part tagged fields, part free content." },
    { q: "Which OLAP operation moves from yearly totals to monthly figures?", options: ["Roll-up", "Drill-down", "Slice", "Pivot"], answer: 1, why: "Drill-down goes to a finer level of detail." },
    { q: "Normalisation primarily aims to:", options: ["Speed up reads", "Reduce redundancy and improve integrity", "Add more tables for analytics", "Remove the schema"], answer: 1, why: "It removes redundancy and anomalies." },
    { q: "Caching user sessions is best served by:", options: ["Graph DB", "Key-value store", "Hierarchical DB", "Data warehouse"], answer: 1, why: "Simple key lookups at very low latency, e.g. Redis." },
  ],
};
