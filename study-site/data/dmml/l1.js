// DMML — Lecture 1: Data Representations
// Source: CourseFiles/DMML/L1-Data Representations.pptx (49 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Representations",
  source: "L1-Data Representations.pptx · 49 slides",
  overview:
    "Before any machine learning happens, data has to be **stored, shaped and moved**, and those choices decide what's easy or hard later. This lecture asks: **why** does data management matter for ML? **What** shapes does data come in? **Why** are there so many kinds of database, and how do they change the way we query? **Why** does it matter whether a table is stored row by row or column by column? **How** does data travel between systems? And **what's the difference** between recording business events and analysing them? Our running example is a food-delivery app like Swiggy or Zomato, because it needs almost every idea in the lecture.",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why does data management matter so much for ML?",
      slides: "5–9",
      blocks: [
        {
          type: "p",
          text: "Slide 6 lists things you've probably heard at work: *“Connection to source data failed.” “Oh no, that's old data.” “The information is in emails, what do we do now?” “Lots of nulls, what should we do?”* Every one of these is a **data management** problem, and every one of them would break an ML model.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Definition (slide 7)",
          text: "**Data management** is the practice of **ingesting, processing, securing and storing** an organisation's data, where it is then utilised for **strategic decision-making to improve business outcomes**.\n\nLearn the four verbs (*ingest, process, secure, store*) and the purpose (*decisions → better outcomes*). They are the keywords examiners look for.",
        },
        {
          type: "p",
          text: "**Why has it become urgent? (slide 8).** Hybrid cloud, AI, the Internet of Things (IoT) and edge computing have made data volumes explode. That growth creates **data silos** (each team hoards its own copy), **security risks** and **bottlenecks to decision-making**. Businesses need clean, usable data to make better decisions.",
        },
        {
          type: "p",
          text: "**Why it matters especially for ML (slide 9).** An ML system is *essentially a data-processing pipeline* whose purpose is to *extract usable and repeatable insights from data*. But unlike an ordinary reporting pipeline, three things make ML fragile:",
        },
        {
          type: "list",
          items: [
            "**Its success is hard to measure.** A report is either right or wrong; a model is “right 87% of the time”, and you may not know which 13% is wrong.",
            "**Its failures are hard to detect.** A broken report shows an error. A model fed stale or skewed data keeps producing confident predictions, just worse ones.",
            "**It depends completely on the underlying data systems** for four things: **structure, performance, accuracy and reliability**. If the data is badly structured, slow to fetch, inaccurate or unreliable, so is the model.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Our running example: a food-delivery app",
          text: "Think of everything a food-delivery app stores: **orders and payments**, a **restaurant menu catalogue** where every restaurant's items look different, **live shopping carts**, **“people who ordered this also ordered…”** recommendations, delivery-partner **GPS pings**, customer **reviews and food photos**. Its ML models predict delivery time, recommend dishes and flag fraudulent refunds. Each kind of data needs a different representation, and that's what this lecture is about.",
        },
      ],
    },
    {
      id: "formats",
      heading: "Lesson 2: What shapes does data come in? Structured, semi-structured, unstructured",
      slides: "10–12",
      blocks: [
        {
          type: "p",
          text: "The first question about any data is: **does it follow a fixed structure?** That structure is called a **schema**: the blueprint that defines how data is organised, stored and related, including its rules, format and constraints (slide 11). For example, “every order has an order-id (number), a customer-id (number), an amount (decimal) and a timestamp”.",
        },
        {
          type: "list",
          items: [
            "**Structured data** follows a **predefined schema**. Every record has the same fields, like rows in a spreadsheet or a relational table. *Food app:* the orders table.",
            "**Unstructured data** follows **no schema** at all. *Food app:* customers' food photos, voice complaints to the call centre, free-text reviews.",
            "**Semi-structured data** is in between: **some structure (tags or keys) but flexible**. An email has fixed fields (from, to, subject) plus a free-text body. *Food app:* the JSON event the app sends when you tap “Add to cart”, whose fields can vary from event to event.",
          ],
        },
        {
          type: "table",
          caption: "Slide 12 comparison",
          head: ["", "Structured", "Semi-structured", "Unstructured"],
          rows: [
            ["Schema", "Definite, predefined", "Flexible; self-describing tags/keys", "None"],
            ["Examples", "Excel/CSV tables, database rows", "Emails, JSON, XML, logs", "Handwritten notes, audio, video, images, news articles"],
            ["Advantages", "Easy to analyse; fast to retrieve", "Schema can evolve; highly interoperable", "Many storage options; rich interpretations; adapts to change"],
            ["Disadvantages", "Schema changes are costly; restrictive; new kinds of source don't fit", "Hard to write validation and analysis routines", "Hard to analyse; slower to retrieve"],
          ],
        },
        {
          type: "callout",
          kind: "idea",
          title: "The trade-off in one line",
          text: "The more structure data has, the **easier it is to analyse** but the **harder it is to change**. The less structure, the more **flexible and rich** it is, but the **harder to use**.",
        },
      ],
    },
    {
      id: "models",
      heading: "Lesson 3: Why are there so many kinds of database? Data models",
      slides: "13–26",
      blocks: [
        {
          type: "p",
          text: "A **data model** is *the way data is structured, stored and organised* (slide 14). Why not use one model for everything? Because each model makes some questions **easy** and others **hard**. Picking a model is really picking which questions you want to be fast. The slides cover five.",
        },
        { type: "p", text: "#### 1. Relational: tables and rows" },
        {
          type: "p",
          text: "Data is organised into **relations** (tables); each relation is a set of **tuples** (rows). Rows and columns are unordered: you can shuffle them without changing the meaning (slide 15). Slide 15 shows a single big table with repeated information: the same customer's name and address typed on every order row. That causes problems (slide 16): **no data integrity** (update the address in one row and not another, and now you have two addresses), it's **difficult to interpret**, **highly redundant**, and **not expandable**.",
        },
        {
          type: "p",
          text: "**The fix is normalisation:** split the big table into smaller related tables (Customers, Orders, Restaurants) linked by keys, so each fact is stored once. Benefits: **reduced redundancy, improved integrity, flexible expansion**. The levels are **1NF, 2NF, 3NF, BCNF (Boyce–Codd Normal Form) and 5NF**, each removing a further kind of redundancy. Queried with **SQL** (Structured Query Language). *Food app:* orders, payments and refunds, where correctness is non-negotiable.",
        },
        { type: "p", text: "#### 2. Hierarchical: a tree" },
        {
          type: "p",
          text: "Data forms a **tree of parent–child records**. Type `regedit` in Windows to see one: the Windows Registry (slide 17). Also used for organisation charts and database indexes (slide 18). Queries are **navigational**: you walk down the tree (e.g. IBM IMS with its DL/I language). *Food app:* a category tree, Cuisine → North Indian → Biryani.",
        },
        { type: "p", text: "#### 3. Graph: nodes and edges" },
        {
          type: "p",
          text: "Built around a **graph**: **nodes** (entities) connected by **edges** (relationships). The key line from slide 19: *“In a document database, the content of each document is the priority. In a graph database, the relationships between data items are the priority.”* Because relationships are stored directly, following them is **fast**. Examples: Neo4j, Amazon Neptune, Gephi. Used by LinkedIn and Facebook (who knows whom), and slide 20 suggests mapping **projects to business objectives** to see which projects align, overlap or duplicate each other. *Food app:* customer → ordered → dish ← ordered ← other customers, for recommendations and for spotting fraud rings sharing phones or addresses.",
        },
        { type: "p", text: "#### 4. Document: self-contained JSON" },
        {
          type: "p",
          text: "Built around **documents**: each record is a single self-contained piece of text, encoded as **JSON** (JavaScript Object Notation) or **XML** (eXtensible Markup Language), with a **unique key** to retrieve it (slide 21). A **collection** of documents is like a table and a **document** is like a row, but far more flexible: each document can have different fields and nested lists. Slide 21's book example has a “Sold as” list with a paperback price and an e-book price inside one record. Examples: MongoDB, Amazon DocumentDB, Apache CouchDB, Firebase Firestore. Used for **semi-structured** content: emails kept as evidence, device and event logs, photos with metadata (slide 22). *Food app:* the menu catalogue, where a pizza has sizes and crusts but a thali has a list of items.",
        },
        { type: "p", text: "#### 5. Key-value: the simplest of all" },
        {
          type: "p",
          text: "A collection of **key → value** pairs; you can only look things up **by key** (slide 23). That limitation makes it **extremely fast**. Used for **caching** (keeping copies of data in temporary storage for faster retrieval) and session storage (slide 24). Examples: Redis, Amazon DynamoDB. *Food app:* your live cart, stored under your session-id.",
        },
        {
          type: "table",
          caption: "Comparison of data models (slide 26)",
          head: ["", "Relational", "Hierarchical", "Graph", "Document", "Key-value"],
          rows: [
            ["Structure", "Strict schema (tables, rows, columns)", "Tree (parent–child)", "Nodes and edges (flexible)", "Semi-structured (JSON/XML)", "Simple key → value"],
            ["Querying", "**SQL** (standard, powerful)", "Navigational (e.g. DL/I)", "**Cypher, Gremlin** (relationship-oriented)", "JSONPath, MongoDB Query Language", "By key only"],
            ["Performance", "Moderate; good for complex queries", "Fast for hierarchical traversal", "**Fast for connected-data queries**", "Fast document reads/writes", "Extremely fast simple reads/writes"],
            ["Usage", "ERP, CRM, business apps", "Legacy systems, file systems", "Social networks, fraud detection, recommendations", "Content management, catalogues, APIs", "Caching, sessions, config"],
            ["Examples", "MySQL, PostgreSQL, Oracle, SQL Server", "IBM IMS", "Neo4j, Neptune, TigerGraph", "MongoDB, CouchDB, DocumentDB", "Redis, DynamoDB, Riak"],
          ],
        },
        {
          type: "p",
          text: "**SQL vs NoSQL (slide 25).** Relational databases are the **SQL** family. The other four are grouped as **NoSQL** (“not only SQL”). A real company usually uses several at once, one per job. This is called **polyglot persistence**.",
        },
      ],
    },
    {
      id: "query",
      heading: "Lesson 4: How should we ask a database for data? Declarative vs imperative",
      slides: "27–31",
      blocks: [
        {
          type: "p",
          text: "You have data stored. Now how do you get it back out, especially from several tables or databases at once (slide 28)? There are two styles of asking, and the slides explain them with a lovely analogy.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Fetching a bag from the car",
          text: "**Imperative (tell *how*):** “Open the door, walk to the parking lot, open the car, check whether the bag is empty, pick it up, close the car, walk back…” Every step, in order.\n\n**Declarative (tell *what*):** “Bring the bag from the car if it isn't empty.” The other person figures out the steps.",
        },
        {
          type: "p",
          text: "**Imperative (procedural) queries** spell out every step: loop over the records, check conditions, update variables, decide whether to fetch the next record. **Declarative queries** describe only **the pattern of data you want**, **the conditions it must meet**, and **how to transform it** (sort, group, aggregate). **SQL** is the classic declarative language: `SELECT * FROM orders WHERE city = 'Pune'`.",
        },
        {
          type: "p",
          text: "**Why databases prefer declarative:**",
        },
        {
          type: "list",
          items: [
            "**The database can optimise for you.** Since you didn't dictate the steps, the **query optimiser** chooses the fastest route: which index to use, which join method, what order. When the database adds an index or upgrades its engine, **your queries get faster without changing a single line**.",
            "**It can run in parallel.** With no prescribed order, the engine can split the work across many cores or machines. A step-by-step imperative loop is hard to parallelise.",
            "**It's simpler to write and read**, and hides implementation details.",
          ],
        },
        {
          type: "p",
          text: "**The trade-off.** Imperative code guarantees the order of results and gives full control, but the programmer must know the optimal strategy, and the system can't optimise execution or memory for them. A declarative query only returns a particular order if you ask for it.",
        },
        {
          type: "p",
          text: "**How this connects to data models.** Each data model gets query languages shaped around what it stores: tables → SQL (joins); graphs → **Cypher** and **Gremlin**, which describe *paths* like “customer who ordered a dish that my friend also ordered” in one line. This link was examined directly (**PYQ Q1**).",
        },
      ],
    },
    {
      id: "layout",
      heading: "Lesson 5: Why does storage layout matter? Row vs column",
      slides: "32–34",
      blocks: [
        {
          type: "p",
          text: "A table looks two-dimensional, but a disk stores bytes in one long line. So the database must decide: **store the table row by row, or column by column?** It sounds like a detail, but it can make a query 100× faster or slower.",
        },
        {
          type: "list",
          items: [
            "**Row-major:** all the columns of row 1, then all the columns of row 2, and so on. Reading or writing **one whole record** is fast, because it's all in one place.",
            "**Column-major:** all the values of column 1, then all the values of column 2, and so on. Reading **one column across millions of rows** is fast, because it's all in one place, and you skip the columns you don't need.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Which layout suits which question?",
          text: "The food app's orders table has 40 columns and 100 million rows.\n\n- **“Save this new order.”** One record, all 40 columns. A **row store** writes it in one place.\n- **“What was the total order value per city last month?”** Only 2 columns (amount, city), but all 100 million rows. A **column store** reads just those 2 columns, about 5% of the data. A row store would read everything.\n\nColumn stores also **compress** better, because values in one column are similar (all cities, all amounts).",
        },
        {
          type: "table",
          caption: "Slides 32–34 summary",
          head: ["", "Row-major", "Column-major"],
          rows: [
            ["Stores together", "All columns of one row", "All values of one column"],
            ["Fast at", "Whole-row access, **writes**", "Scanning a few columns, **reads**"],
            ["Suits", "**OLTP** (Lesson 7)", "**OLAP**; ML training (many features, need a few)"],
            ["Examples", "CSV; MS SQL Server", "**Parquet**; Amazon Redshift"],
          ],
        },
      ],
    },
    {
      id: "serial",
      heading: "Lesson 6: How does data travel between systems? Serialization",
      slides: "35–41",
      blocks: [
        {
          type: "p",
          text: "Inside a running program, data lives as objects in memory: a Python dictionary, a Java object. But memory disappears when the program stops, and you can't send a Python object directly to a Java service over the network. So we convert it to a sequence of text or bytes that can be **stored** or **sent**. That conversion is **serialization**; turning it back into objects is **deserialization** (slides 36–38).",
        },
        {
          type: "p",
          text: "**Why it's needed:** to **store** data (disks have size limits, so compact formats help) and to **transfer** it (networks have bandwidth limits).",
        },
        {
          type: "p",
          text: "```flow\nData producer -> Serializer -> Serialized data -> Transfer / store -> De-serializer -> Data consumer\n```",
        },
        {
          type: "callout",
          kind: "warn",
          title: "The golden rule",
          text: "Both sides must use the **same algorithm and structure (schema)**. Take extra care when the producer and consumer are written in **different languages or technologies**: a date serialized one way by Java and read another way by Python silently becomes wrong data.",
        },
        {
          type: "table",
          caption: "Serialization formats (slides 39–41)",
          head: ["Type", "Format", "What it's good for"],
          rows: [
            ["Text", "**CSV** (Comma Separated Values)", "Simple tables; no nesting"],
            ["Text", "**XML** (eXtensible Markup Language)", "Hierarchical data; older enterprise systems"],
            ["Text", "**JSON** (JavaScript Object Notation)", "Modern web APIs; language-agnostic"],
            ["Binary", "**Protobuf** (Google Protocol Buffers)", "Compact, fast; used by gRPC service calls"],
            ["Binary", "**Avro** (Apache)", "Schema-based; works with Hadoop and Spark"],
            ["Binary", "**BSON** (Binary JSON)", "MongoDB's storage format"],
            ["Binary", "**JSONB** (JSON Binary)", "PostgreSQL's format for semi-structured columns"],
          ],
        },
        {
          type: "p",
          text: "**Text vs binary.** Text formats are **human-readable** and easy to debug, but larger and slower to parse. Binary formats are **compact and fast**, and schema-based ones (Protobuf, Avro) catch type errors, but you can't read them by eye. **Slide 40's example:** a program's JSON → JSON-to-BSON serializer → BSON stored in MongoDB → BSON-to-JSON deserializer → JSON back in the program.",
        },
      ],
    },
    {
      id: "olap",
      heading: "Lesson 7: Recording the business vs analysing it: OLTP and OLAP",
      slides: "42–47",
      blocks: [
        {
          type: "p",
          text: "Every business does two very different things with data. It **records events as they happen** (a payment, a swipe at the office door) and it **analyses those events later** to make decisions (spending trends, monthly attendance). These need different kinds of system.",
        },
        {
          type: "table",
          caption: "OLTP vs OLAP (slides 42–43)",
          head: ["", "OLTP", "OLAP"],
          rows: [
            ["Stands for", "OnLine **Transaction** Processing", "OnLine **Analytical** Processing"],
            ["Job", "Save each transaction immediately and reliably", "Analyse data collected by OLTP systems"],
            ["Data", "Current, operational", "Historical, consolidated"],
            ["Workload", "Many tiny writes", "Fewer, big read queries"],
            ["Optimised for", "**Fast writes**", "**Fast reads**"],
            ["Example", "A GPay payment; your office entry/exit swipe", "GPay spending analysis; attendance calculated from swipes"],
          ],
        },
        {
          type: "p",
          text: "**OLAP operations.** OLAP data is thought of as a **cube**: measures (sales, profit) organised along dimensions (time, region, product). Four standard moves:",
        },
        {
          type: "list",
          items: [
            "**Roll-up:** summarise *upwards* in a hierarchy, e.g. city → state → country, or day → month → year.",
            "**Drill-down:** the reverse; go into *finer* detail, e.g. region → country → product.",
            "**Slice / dice:** fix one dimension (slice: only 2025) or several (dice: 2025, Europe, kitchen products).",
            "**Pivot (rotate):** swap rows and columns for a different view, e.g. Year × Product becomes Product × Year.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Slide 44's story: why OLAP turns data into insight",
          text: "A company sees a **sharp dip in profitability**. An analyst **drills down** by region → Europe stands out → drills into EU countries → then into products → finds **indirect costs** rising → root cause: an **additional tax on some products in the EU**. Five clicks from “profits are down” to “here's exactly why”.",
        },
        {
          type: "p",
          text: "**Typical OLAP calculations:** margins, shares (% of total), KPIs (Key Performance Indicators), moving averages, growth %, trend analysis. **OLAP features:** *basic*: multidimensional analysis, consistently fast response, drill-down/roll-up, slice-and-dice, time intelligence; *advanced*: cross-dimensional calculations, pre-consolidation, drill-through to source rows, alerts, collaborative decision-making.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in six lines",
          text: "1. Data management = ingest, process, secure, store → better decisions. ML depends on it for structure, performance, accuracy and reliability.\n2. Structured (fixed schema) ↔ semi-structured (flexible tags) ↔ unstructured (no schema): easier to analyse vs more flexible.\n3. Data models: relational (tables, SQL, normalise), hierarchical (tree), graph (relationships first, Cypher/Gremlin), document (JSON), key-value (fastest, key only).\n4. Declarative (what) beats imperative (how): the optimiser can speed things up and parallelise.\n5. Row stores for writes/OLTP; column stores (Parquet) for reads/OLAP/ML.\n6. Serialization: text (CSV, XML, JSON) vs binary (Protobuf, Avro, BSON, JSONB); same schema on both sides. OLTP records, OLAP analyses (roll-up, drill-down, slice/dice, pivot).",
        },
      ],
    },
  ],

  glossary: [
    ["DM", "Data Management", "Ingesting, processing, securing and storing data for better decisions"],
    ["Schema", "—", "The blueprint of how data is organised, stored and related"],
    ["Structured / semi-structured / unstructured", "—", "Fixed schema / flexible tags / no schema"],
    ["Data model", "—", "The way data is structured, stored and organised"],
    ["Relation / tuple", "Table / row", "Relational model terms"],
    ["NF", "Normal Form", "Levels of normalisation (1NF, 2NF, 3NF…)"],
    ["BCNF", "Boyce–Codd Normal Form", "A stricter form of 3NF"],
    ["Normalisation", "—", "Splitting tables so each fact is stored once"],
    ["DB / DBMS", "DataBase / DataBase Management System", "Where data lives / the software that manages it"],
    ["SQL", "Structured Query Language", "The declarative language of relational databases"],
    ["NoSQL", "Not only SQL", "Non-relational databases: document, key-value, graph, hierarchical"],
    ["Cypher / Gremlin", "—", "Query languages for graph databases (Neo4j / TinkerPop)"],
    ["DL/I", "Data Language/One", "IBM IMS's navigational language for hierarchical data"],
    ["Polyglot persistence", "—", "Using different databases for different jobs in one system"],
    ["Declarative query", "—", "Says *what* data is wanted; the optimiser decides how"],
    ["Imperative query", "Procedural", "Spells out *how*, step by step"],
    ["Query optimiser", "—", "The database component that picks the fastest execution plan"],
    ["Row-major / column-major", "—", "Storing a table row by row / column by column"],
    ["Parquet", "Apache Parquet", "A columnar file format used for analytics and ML"],
    ["Serialization", "—", "Converting in-memory data to text/bytes for storage or transfer"],
    ["CSV", "Comma Separated Values", "Plain-text table format"],
    ["JSON", "JavaScript Object Notation", "Text format of key–value pairs and lists"],
    ["XML", "eXtensible Markup Language", "Text format with nested tags"],
    ["BSON", "Binary JSON", "MongoDB's binary storage format"],
    ["JSONB", "JSON Binary", "PostgreSQL's binary JSON column type"],
    ["Protobuf / Avro", "Protocol Buffers / Apache Avro", "Compact, schema-based binary formats"],
    ["OLTP", "OnLine Transaction Processing", "Systems that record transactions: fast writes"],
    ["OLAP", "OnLine Analytical Processing", "Systems that analyse history: fast reads"],
    ["Roll-up / drill-down", "—", "Summarise up / go into more detail along a hierarchy"],
    ["Slice / dice / pivot", "—", "Fix one dimension / fix several / swap axes"],
    ["KPI", "Key Performance Indicator", "A metric that tracks business performance"],
    ["IoT", "Internet of Things", "Connected devices producing data"],
  ],

  examTips: [
    "**PYQ Q1** was on *graph data models and query languages*. Link the model to the language: a graph model gives relationship-first languages (Cypher/Gremlin) where multi-hop queries are short and fast, while SQL needs many self-JOINs.",
    "For every “compare X vs Y” question, draw a **table** with 5–6 rows: definition, structure, strengths, weaknesses, use case, example tool.",
    "Always end a 5-mark answer with a **concrete example/scenario** from industry (bank, e-commerce, food delivery, hospital). The paper's questions are application-oriented.",
  ],

  theory: [
    {
      title: "Graph data models and query languages",
      pyq: "Comprehensive Q1 (5 marks)",
      marks: 5,
      question:
        "How do graph data models influence the design of query languages? Provide an example where a graph data model enables more efficient querying of complex relationships between data entities.",
      solution: `
### What the examiner wants
Two parts: **how** the graph model shapes query languages (relationships are stored, so queries become path patterns and traversals), and **one concrete example** where it beats SQL. A diagram of the path and a sample Cypher query earn extra marks. Structure: model → influence on the language → example → conclusion (Lessons 3–4).

### Model answer
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
The graph model makes *relationships* the unit of storage, so its query languages are built around *patterns and traversals*. That makes deep, multi-hop relationship queries concise to write and efficient to run, which relational SQL handles poorly.

### Takeaway
The chain to remember: **relationships stored as data → queries written as path patterns (Cypher, Gremlin) → multi-hop questions are short to write and fast to run**, where SQL needs a JOIN per hop.`,
    },
    {
      title: "Choosing data models for one application",
      marks: 5,
      question:
        "An e-commerce company stores (a) orders and payments, (b) a product catalogue whose attributes differ by category, (c) shopping-cart sessions, and (d) a 'customers who bought this also bought' feature. Recommend a data model for each, with justification and example databases.",
      solution: `
### What the examiner wants
One model per need, each with a **reason tied to the data's shape or access pattern**, and an example database. A table is the clearest format (Lesson 3).

### Model answer
| Need | Model | Why | Example DB |
|---|---|---|---|
| (a) Orders, payments | **Relational** | Fixed schema, ACID transactions, integrity through normalisation and foreign keys, complex SQL reporting | PostgreSQL, MySQL, Oracle |
| (b) Catalogue with varying attributes | **Document** | Each product is a self-contained JSON document; a phone has "RAM" while a shirt has "size", with no fixed schema needed. Nested arrays (variants, prices) fit naturally | MongoDB, DocumentDB |
| (c) Cart / session | **Key-value** | Look up by session-id only; extremely fast reads/writes and high concurrency; data is temporary | Redis, DynamoDB |
| (d) "Also bought" | **Graph** | Recommendations are multi-hop relationships (user → bought → product ← bought ← other users → bought → product). Graph traversal is much faster than repeated JOINs | Neo4j, Neptune |

**Point to make:** this is **polyglot persistence**: use the right model per workload instead of forcing one model everywhere. The trade-off is more systems to integrate and govern, handled by pipelines and a data platform (L2, L4).

### Takeaway
Match the model to the question you need to be fast: correctness → relational; varying fields → document; lookup by id → key-value; relationships → graph.`,
    },
    {
      title: "Declarative vs imperative query languages",
      marks: 5,
      question: "Differentiate declarative and imperative query languages with an example. Why have databases standardised on declarative languages such as SQL?",
      solution: `
### What the examiner wants
Clear definitions, the same query written both ways, and the **reasons** declarative languages won: optimisation, parallelism, simplicity (Lesson 4). The car-and-bag analogy is a nice opener.

### Model answer
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

**Trade-off:** imperative code guarantees ordering and gives full control, but the programmer must know the optimal strategy and the system can't optimise it.

### Takeaway
Declarative = say **what**; the optimiser decides **how**, and can keep improving without you rewriting queries.`,
    },
    {
      title: "Row vs column storage for OLTP, OLAP and ML",
      marks: 5,
      question: "Explain row-major and column-major storage layouts. Which is better for OLTP, OLAP and ML training workloads, and why? Give example formats and systems.",
      solution: `
### What the examiner wants
What each layout physically does, which workload each suits and **why**, example formats/systems, and an explicit sentence about ML training vs online inference (Lesson 5).

### Model answer
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

**ML training:** feature tables are wide (thousands of features), but a model often needs a subset of columns across all rows, so **columnar formats (Parquet)** are preferred: they read only the needed columns and compress well. Online inference that fetches one entity's full feature vector at a time behaves more like OLTP, so row/key-value stores (feature stores) fit there.

### Takeaway
Whole records → row store (OLTP, writes). A few columns over many rows → column store (OLAP, ML training, Parquet).`,
    },
    {
      title: "Data serialization",
      marks: 5,
      question: "What is data serialization and why is it needed? Explain the serialization process with a diagram, and compare text and binary serialization formats. Which would you choose for high-volume service-to-service messaging?",
      solution: `
### What the examiner wants
Definition, the two reasons (storage and transfer), the flow diagram, the golden rule (same schema both sides), a text-vs-binary comparison, and a justified choice for the scenario (Lesson 6).

### Model answer
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

**Choice for high-volume service messaging:** **Protobuf** (with gRPC) or **Avro** (with Kafka). They are compact, fast, have a strongly typed schema, and support backward/forward compatibility as services evolve independently (L4, modes of data flow). JSON stays attractive for public or debuggable APIs.

### Takeaway
Text formats are readable; binary formats are compact, fast and schema-safe. High-volume machine-to-machine traffic → binary (Protobuf/Avro).`,
    },
    {
      title: "OLTP vs OLAP with OLAP operations",
      marks: 5,
      question: "Differentiate OLTP and OLAP with examples. Explain the OLAP operations roll-up, drill-down, slice/dice and pivot with a sales example.",
      solution: `
### What the examiner wants
A comparison table with real examples, then all four OLAP operations illustrated on **one** sales cube (Lesson 7). Mention how data flows from OLTP to OLAP.

### Model answer
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

**Relation:** OLTP systems are the *source*. ETL/ELT moves their data into a warehouse, where OLAP serves BI and ML feature engineering.

### Takeaway
OLTP **records** the business (fast writes); OLAP **analyses** it (fast reads). Roll-up and drill-down move along a hierarchy; slice and dice filter; pivot rotates.`,
    },
    {
      title: "Structured, semi-structured and unstructured data in ML",
      marks: 5,
      question: "Compare structured, semi-structured and unstructured data with advantages, disadvantages and ML examples. Why must a data-management strategy handle all three?",
      solution: `
### What the examiner wants
A comparison on schema, examples, pros and cons, **with an ML use for each**, then a clear argument for why one strategy must cover all three (Lesson 2).

### Model answer
| | Structured | Semi-structured | Unstructured |
|---|---|---|---|
| Schema | Predefined, fixed | Flexible, self-describing (tags/keys) | None |
| Examples | Transactions table, Excel/CSV | JSON API responses, XML, emails, logs | Images, audio, video, free text, scanned notes |
| Advantages | Easy to query/analyse; fast retrieval | Evolving schema; interoperable | Rich information; many storage options; adapts to change |
| Disadvantages | Rigid; schema changes costly; new sources don't fit | Harder to validate and analyse routinely | Hard to analyse; slow to retrieve; needs extraction (NLP/CV) |
| ML example | Churn from billing data | Clickstream JSON events for recommendations | X-ray images, call-centre audio for sentiment |

**Why all three:** modern ML uses mixed sources. Netflix, for example, combines structured ratings, semi-structured streaming events and unstructured search text (L7). The strategy must therefore include storage for each (warehouse for structured, lake for semi/unstructured, or a **lakehouse**), suitable serialization, metadata/catalogues, and validation rules adapted to each type.

### Takeaway
Modern ML mixes all three types, so the platform needs storage, formats and validation for each: the case for a lake or lakehouse.`,
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
