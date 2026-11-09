// DMML — Lecture 13: Distributed & Scalable Data Processing
// Source: CourseFiles/DMML/L13-Distributed  Scalable Data Processing - Copy.pptx (95 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Distributed & Scalable Data Processing",
  source: "L13-Distributed  Scalable Data Processing.pptx · 95 slides",
  overview:
    "What do you do when data is too big for one computer? You **split it across many machines** and **work on the pieces at the same time**. This lecture tells that story (slides 26–27): **distributed storage** (HDFS), **parallel processing** (MapReduce), **in-memory computing** (Spark) and **streaming** (Spark Streaming, Flink). It starts with **big data** and its **5 V's**, its uses and challenges (slides 4–25), contrasts **distributed vs parallel** systems (slides 28–35) and **disk vs in-memory** computing (slides 36–39), tours the **Hadoop ecosystem** (slides 40–45), explains **HDFS** (slides 46–49), **MapReduce** (slides 50–56) and **Spark** (slides 57–68), compares modern frameworks **Spark Structured Streaming, Flink, Ray and Dask** (slides 69–78), the cloud platforms **Snowflake, BigQuery and Databricks** (slides 79–87), and ends with **batch vs streaming for ML training and inference** (slides 88–93).",

  simpleIntro: "One person can't move a mountain of sand with a spoon, but a thousand people with buckets can. That's the whole idea of this lecture. When data is too big for one computer, we **split it across many machines** (HDFS), **work on all the pieces at once** (MapReduce), **keep the busy pieces in fast memory** (Spark), and **handle new data the moment it arrives** (streaming with Flink). Then we compare the cloud platforms that do all this for you, and decide when ML needs batch and when it needs streaming.",

  simple: [
    {
      "id": "s-big",
      "heading": "1. The big picture",
      "slides": "",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Store it in pieces",
              "text": "HDFS cuts files into blocks, spreads them over many machines and keeps 3 copies.",
              "tag": "Distributed storage",
              "example": "A country's phone book split by surname"
            },
            {
              "title": "Process pieces together",
              "text": "MapReduce: map → shuffle → reduce, all in parallel.",
              "tag": "Parallel processing",
              "example": "Max temperature per city"
            },
            {
              "title": "Faster and live",
              "text": "Spark keeps data in memory; Flink processes each event in milliseconds.",
              "tag": "In-memory + streaming",
              "example": "Real-time fraud detection"
            }
          ]
        }
      ]
    },
    {
      "id": "s-vs",
      "heading": "2. Big data and its 5 V's",
      "slides": "4–25",
      "blocks": [
        {
          "type": "table",
          "head": [
            "V",
            "Plain meaning",
            "Example"
          ],
          "rows": [
            [
              "**Volume**",
              "How much",
              "Petabytes of transactions"
            ],
            [
              "**Velocity**",
              "How fast it arrives",
              "Stock trades every millisecond"
            ],
            [
              "**Variety**",
              "How many kinds",
              "Tables, JSON, images, video"
            ],
            [
              "**Veracity**",
              "How trustworthy",
              "Noisy sensor readings"
            ],
            [
              "**Value**",
              "How useful",
              "Better pricing decisions"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Big shift:** instead of bringing data to the analysis, big data **moves the analysis to the data**, uses **ELT**, and **distributed** computing."
        },
        {
          "type": "p",
          "text": "**Real examples:** Amazon (recommendations, dynamic pricing, fraud), Ginger.io (predicts mental-health episodes from phone habits), KIA (sensor data for predictive maintenance)."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Not a replacement",
          "text": "Big-data analytics doesn't replace databases or warehouses, and isn't just about size."
        },
        {
          "type": "p",
          "text": "**Challenges:** clear goals, huge volumes, integration and quality, infrastructure, skilled people, privacy and compliance."
        }
      ]
    },
    {
      "id": "s-dp",
      "heading": "3. Distributed vs parallel",
      "slides": "26–35",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Parallel",
            "Distributed"
          ],
          "rows": [
            [
              "Picture",
              "Many cooks in **one kitchen**, one shared fridge",
              "Many **kitchens in different buildings**, talking by phone"
            ],
            [
              "Memory",
              "Shared",
              "Each has its own"
            ],
            [
              "Talk speed",
              "Very fast (nanoseconds)",
              "Slower (milliseconds)"
            ],
            [
              "Grow by",
              "Bigger machine (up)",
              "More machines (out)"
            ],
            [
              "If one fails",
              "Everything stops",
              "Others carry on"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Which design keeps working when one machine dies?",
          "options": [
            "Parallel system",
            "Distributed system",
            "Single server",
            "Shared-memory system"
          ],
          "answer": 1,
          "why": "Distributed systems reassign the work to other nodes."
        }
      ]
    },
    {
      "id": "s-mem",
      "heading": "4. Disk vs memory",
      "slides": "36–39",
      "blocks": [
        {
          "type": "p",
          "text": "**Disk-based:** a chef walking to the **basement storeroom** for every ingredient (milliseconds). **In-memory:** the ingredients sit in a **pantry next to the stove** (microseconds). Cheaper RAM made in-memory computing practical."
        }
      ]
    },
    {
      "id": "s-hadoop",
      "heading": "5. The Hadoop family",
      "slides": "40–45",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Job",
            "Tool"
          ],
          "rows": [
            [
              "Store files",
              "**HDFS**"
            ],
            [
              "Manage resources",
              "**YARN**"
            ],
            [
              "Process",
              "**MapReduce**, **Spark**"
            ],
            [
              "Query",
              "**Hive** (SQL), Drill, Pig"
            ],
            [
              "NoSQL database",
              "**HBase**"
            ],
            [
              "Bring data in",
              "**Flume** (logs), **Sqoop** (from SQL databases)"
            ],
            [
              "Stream",
              "**Kafka**, Storm"
            ],
            [
              "ML",
              "MLlib, Mahout"
            ],
            [
              "Coordinate / schedule / manage",
              "ZooKeeper, Oozie, Ambari"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-hdfs",
      "heading": "6. HDFS: one file, many machines",
      "slides": "46–49",
      "blocks": [
        {
          "type": "p",
          "text": "```flow\nBig file -> Cut into blocks -> Spread across DataNodes -> Copy each block to 2 more nodes -> NameNode keeps the map\n```"
        },
        {
          "type": "table",
          "head": [
            "Part",
            "Like…"
          ],
          "rows": [
            [
              "**NameNode**",
              "A librarian's catalogue: knows which shelf holds each chapter"
            ],
            [
              "**DataNodes**",
              "The shelves that hold the chapters"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Three copies mean a dead server loses nothing, and work can run on whichever machine already holds the data (**data locality**)."
        }
      ]
    },
    {
      "id": "s-mr",
      "heading": "7. MapReduce: sort the laundry, then fold",
      "slides": "50–56",
      "blocks": [
        {
          "type": "p",
          "text": "```flow\nInput files -> Split -> Map: label each item -> Shuffle: one pile per label -> Reduce: process each pile -> Result\n```"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: hottest day per city",
          "text": "Map turns each record into a pair like ⟨Tokyo, 37⟩. Shuffle sends every Tokyo pair to one reducer, every London pair to another. Each reducer keeps the maximum."
        },
        {
          "type": "answer",
          "value": "Tokyo 38 · London 27 · New York 33 · Toronto 32",
          "text": "A 10-hour single-machine job could take about an hour split into 10 parallel tasks."
        },
        {
          "type": "check",
          "q": "Which step makes sure all values for ‘London’ end up in the same place?",
          "options": [
            "Split",
            "Map",
            "Shuffle",
            "Reduce"
          ],
          "answer": 2,
          "why": "Shuffling groups pairs by key."
        }
      ]
    },
    {
      "id": "s-spark",
      "heading": "8. Spark: keep it in memory",
      "slides": "57–68",
      "blocks": [
        {
          "type": "p",
          "text": "MapReduce writes to disk after every step, which is slow when ML reads the same data again and again. **Spark** loads data into memory **once** and reuses it, for fast **repeated queries** and **iterative training**."
        },
        {
          "type": "table",
          "head": [
            "Spark word",
            "Simple meaning"
          ],
          "rows": [
            [
              "**RDD / DataFrame**",
              "Data split into fault-tolerant pieces / the same with column names"
            ],
            [
              "**Lazy + DAG**",
              "Writes down the plan first, runs it all when you ask for a result"
            ],
            [
              "**Driver**",
              "The boss (your program)"
            ],
            [
              "**Cluster manager**",
              "Hands out the work"
            ],
            [
              "**Workers**",
              "Do the work and cache data"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Library family: **Core**, **Streaming**, **MLlib**, **SQL**, **GraphX**."
        }
      ]
    },
    {
      "id": "s-frameworks",
      "heading": "9. Modern frameworks in one line each",
      "slides": "69–87",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Framework",
            "Remember it as…"
          ],
          "rows": [
            [
              "**Spark**",
              "Big batches; streams as tiny batches (seconds)"
            ],
            [
              "**Structured Streaming**",
              "Your batch code, now running as a stream"
            ],
            [
              "**Flink**",
              "True streaming, one event at a time, milliseconds, exactly-once"
            ],
            [
              "**Ray**",
              "Python ML at scale (tasks, objects, actors)"
            ],
            [
              "**Dask**",
              "Pandas and NumPy, but on many machines"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "Cloud platform",
            "Big idea",
            "Best for"
          ],
          "rows": [
            [
              "**Snowflake**",
              "Storage and compute scale separately; multi-cloud",
              "BI, self-service analytics, data sharing"
            ],
            [
              "**BigQuery**",
              "Serverless; pay per query; ML in SQL",
              "Google Cloud users; huge ad-hoc queries"
            ],
            [
              "**Databricks**",
              "Lakehouse (Spark + Delta Lake)",
              "Data engineering + ML on any data"
            ]
          ]
        },
        {
          "type": "check",
          "q": "A bank must flag fraud within milliseconds, event by event. Best engine?",
          "options": [
            "Batch MapReduce",
            "Apache Flink",
            "Hive",
            "Dask"
          ],
          "answer": 1,
          "why": "Flink is streaming-first with millisecond latency."
        }
      ]
    },
    {
      "id": "s-bs",
      "heading": "10. Batch or streaming for ML?",
      "slides": "88–93",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Ask",
            "If yes…"
          ],
          "rows": [
            [
              "Does the data lose value within minutes?",
              "Streaming"
            ],
            [
              "Is budget tight?",
              "Batch (cheaper)"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "",
            "Batch",
            "Streaming"
          ],
          "rows": [
            [
              "Training",
              "First model on years of history",
              "Keep updating on fresh data"
            ],
            [
              "Prediction",
              "Nightly / monthly scoring of everyone",
              "Instant: fraud, live recommendations"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "11. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **5 V's:** Volume, Velocity, Variety, Veracity, Value.\n- **Parallel** = one kitchen; **distributed** = many kitchens.\n- **HDFS:** NameNode (map) + DataNodes (blocks), 3 copies.\n- **MapReduce:** split → map → shuffle → reduce.\n- **Spark:** in memory, lazy DAG, driver → manager → workers.\n- **Flink** = true streaming; **Ray** = Python ML; **Dask** = big Pandas.\n- **Snowflake / BigQuery / Databricks** = split storage-compute / serverless / lakehouse.\n- **ML:** batch for history and bulk; streaming for live."
        }
      ]
    }
  ],

  summary: [
    {
      id: "bigdata",
      heading: "Lesson 1: What is big data, and why is it hard?",
      slides: "4–25",
      blocks: [
        {
          type: "p",
          text: "**Big data** = *massive, complex data sets that traditional data-management systems cannot handle* (slide 5), measured in terabytes or petabytes: transactions, social media, sensors, research. It is also the **ecosystem** of technologies and methods used to capture, store, manage and analyse it.",
        },
        {
          type: "table",
          caption: "The 5 V's (slides 6–8)",
          head: ["V", "Meaning", "Handled by"],
          rows: [
            ["**Volume**", "The **size** of the data", "Cloud storage, distributed file systems"],
            ["**Velocity**", "The **speed** at which data arrives (and goes stale)", "Stream processing, in-memory systems"],
            ["**Variety**", "The **types**: structured, semi-structured (JSON, XML), unstructured (text, images, video)", "NoSQL databases, data lakes with **schema-on-read**"],
            ["**Veracity**", "The **reliability/accuracy** (noise, errors)", "Cleaning, validation, verification"],
            ["**Value**", "The **real-world benefit**", "Analytics, ML and AI turning data into decisions"],
          ],
        },
        {
          type: "table",
          caption: "Traditional vs big-data analytics (slide 11)",
          head: ["Traditional", "Big data"],
          rows: [
            ["System producing specific results", "Platforms that support applications"],
            ["Collect valuable data", "Find data, explore value"],
            ["Data quality & consistency first", "Speed & low latency"],
            ["**Extract → Transform → Load**", "**Extract → Load → Transform**"],
            ["Problem → data → solution", "Data → analytics → knowledge"],
            ["Long-term inflexible structure", "Dynamic flexible structure"],
            ["**Bring data to the analysis**", "**Move the analysis closer to the data** (principle of locality)"],
            ["Centralised computing", "**Distributed** computing"],
          ],
        },
        {
          type: "p",
          text: "**How it works (slide 12):** data collection → storage (e.g. HDFS) → processing (MapReduce, Spark) → analysis (statistics, ML, visualisation) → results for decisions. **Use cases (slides 13–15):** **Amazon** (demand forecasting, segmentation, Alexa, dynamic pricing, fraud, recommendations), **Ginger.io** (predicting mental-health episodes from phone behaviour: fewer messages may signal depression, more may signal mania), **KIA Motors** (sensor data for quality control, predictive maintenance and supply chain).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "What big data analytics is NOT (slide 16)",
          text: "Not a one-size-fits-all RDBMS with shared disk and memory · not only for “big data companies” · not only about volume · not just about technology · **not meant to replace RDBMS or the data warehouse**.",
        },
        {
          type: "table",
          caption: "Six challenges and how to address them (slides 17–25)",
          head: ["Challenge", "Response"],
          rows: [
            ["**Defining clear objectives and use cases**", "Align with strategy; prioritise by impact; involve stakeholders"],
            ["**Managing vast amounts of data** (43% of decision-makers fear their infrastructure can't keep up)", "Scalable storage, data lifecycle management"],
            ["**Integration & quality assurance**", "Integration technology, governance, cleansing and validation"],
            ["**Infrastructure & scalability**", "Cloud, pay-as-you-go"],
            ["**Talent shortage** (11.5 million new data-science jobs projected by 2026)", "Training, partnerships with universities, external experts"],
            ["**Privacy, security, compliance** (over a third of budgets go to compliance and defence)", "Encryption, access control, anonymisation, keeping up with laws"],
          ],
        },
        {
          type: "p",
          text: "Also: real-time processing where needed, **cost management** (cost-effective storage, lifecycle), and building a **data-driven culture** (slides 24–25).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**5 V's = Very Very Varied, Very Valuable** data: Volume, Velocity, Variety, Veracity, Value.",
        },
      ],
    },
    {
      id: "distpar",
      heading: "Lesson 2: Distributed vs parallel computing",
      slides: "26–35",
      blocks: [
        {
          type: "p",
          text: "**The story (slides 26–27):** data poured in faster than one machine could handle. Four ideas saved the day: **distributed storage** (split files into blocks, copy them across machines), **parallel processing** (split jobs, gather results, reassign work if a machine fails), **in-memory computing** (keep data in RAM for repeated questions) and **streaming** (process events the moment they arrive).",
        },
        {
          type: "table",
          caption: "Distributed vs parallel systems (slides 29–35)",
          head: ["", "Distributed system", "Parallel system"],
          rows: [
            ["**What**", "Independent computers connected by a **network**", "Several processors in **one** computer (or tightly coupled cluster)"],
            ["**Memory**", "Each node has **its own** memory; nodes pass **messages**", "**Shared** memory (fast, but becomes a bottleneck)"],
            ["**Coupling**", "Loose", "Tight: one complex problem"],
            ["**Communication**", "Network: **milliseconds**", "Internal bus: **nanoseconds–microseconds**"],
            ["**Scaling**", "**Horizontal**: add machines (to thousands)", "**Vertical**: add processors (limits: bandwidth, heat; usually hundreds of cores)"],
            ["**Fault tolerance**", "**Built in**: other nodes continue", "**Single point of failure**"],
            ["**Geography**", "Can span cities/continents (CDNs, data-residency rules)", "One location"],
            ["**Best for**", "Loosely coupled tasks, huge data", "Tightly coupled tasks needing frequent coordination"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**Parallel = many cooks in ONE kitchen sharing one fridge. Distributed = many kitchens in different buildings talking on the phone.**",
        },
      ],
    },
    {
      id: "inmem",
      heading: "Lesson 3: Disk vs in-memory computing",
      slides: "36–39",
      blocks: [
        {
          type: "table",
          caption: "The chef analogy (slides 37–38)",
          head: ["", "Traditional (disk-based)", "In-memory computing"],
          rows: [
            ["**Where data lives**", "On disk (SSD/HDD), loaded into RAM only when needed", "Mainly in **RAM**"],
            ["**Speed**", "Milliseconds", "**Microseconds**"],
            ["**Analogy**", "A chef walking to a **basement storeroom** for every ingredient", "Ingredients in a **pantry next to the stove**"],
          ],
        },
        {
          type: "p",
          text: "**For big data (slide 39):** RAM is used for processing, increasing speed, and falling RAM prices make it affordable. **Volume** is addressed by in-memory computing; **variety** (unstructured data) by NoSQL databases; structured data stays in relational databases.",
        },
      ],
    },
    {
      id: "hadoop",
      heading: "Lesson 4: The Hadoop ecosystem",
      slides: "40–45",
      blocks: [
        {
          type: "p",
          text: "**Hadoop** is an *open-source framework that stores and processes big data with distributed storage and parallel processing on clusters of commodity hardware*, handling structured, semi-structured and unstructured data (slide 41).",
        },
        {
          type: "table",
          caption: "Who does what in the ecosystem (slides 42–45)",
          head: ["Job", "Tool(s)"],
          rows: [
            ["**Storage**", "**HDFS** (distributed file system); **HBase** (NoSQL database on HDFS)"],
            ["**Resource management**", "**YARN** (resources and job scheduling)"],
            ["**Processing**", "**MapReduce** (parallel batch), **Spark** (in-memory, batch + real-time)"],
            ["**Query / scripting**", "**Hive** (SQL on Hadoop, structured batch), **Drill** (flexible, schema-free queries), **Pig** (high-level scripting)"],
            ["**Ingestion**", "**Flume** (logs/unstructured into HDFS), **Sqoop** (RDBMS ↔ Hadoop)"],
            ["**Streaming**", "**Kafka** (message streaming and storage), **Storm** (real-time stream processing)"],
            ["**Machine learning**", "**Spark MLlib**, **Mahout**"],
            ["**Search**", "**Lucene** (full-text search library), **Solr** (search platform on Lucene)"],
            ["**Coordination / management**", "**ZooKeeper** (coordination), **Oozie** (workflow scheduler), **Ambari** (web UI to provision, manage, monitor)"],
          ],
        },
      ],
    },
    {
      id: "hdfs",
      heading: "Lesson 5: HDFS: storing one file on many machines",
      slides: "46–49",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "HDFS architecture (slide 47): director / worker",
          text: "- **NameNode** (the director, one per cluster): tracks every file, its permissions and **where each block lives**; manages the namespace (open, close, rename).\n- **DataNodes** (workers, on commodity hardware): store blocks as local files; create, delete and **replicate** blocks; serve reads and writes.",
        },
        {
          type: "p",
          text: "```flow\nBig file -> Split into blocks -> Blocks spread over DataNodes -> Each block copied to 2 more nodes -> NameNode keeps the map\n```",
        },
        {
          type: "callout",
          kind: "example",
          title: "Use case (slide 49): a national phone directory",
          text: "Surnames A on server 1, B on server 2, and so on; rebuilding the whole directory needs blocks from every server. Each piece is **replicated to two more servers by default** (three copies), so a failed server loses nothing; a development cluster may use no redundancy. Replicas also let work run **in parallel** on all servers, with **data locality** (computation runs where the data is).",
        },
      ],
    },
    {
      id: "mapreduce",
      heading: "Lesson 6: MapReduce: split the work, then combine",
      slides: "50–56",
      blocks: [
        {
          type: "p",
          text: "**MapReduce** is *a programming model that uses parallel processing to speed up large-scale data processing* across hundreds or thousands of servers (slide 51). A job that takes **10 hours** on one processor might take **about an hour** split into 10 parallel tasks (slide 52).",
        },
        {
          type: "table",
          caption: "The steps (slides 53–54)",
          head: ["Step", "What happens"],
          rows: [
            ["**Input**", "Structured or unstructured data, usually from HDFS"],
            ["**Splitting**", "Data cut into blocks and spread evenly over **mappers**"],
            ["**Mapping**", "Each mapper turns its data into **key/value pairs** (city → temperature)"],
            ["**Shuffling**", "Sort and send all pairs with the **same key** to the **same reducer** (all “Tokyo” to one reducer)"],
            ["**Reducing**", "Each reducer aggregates its key's values (merge, count, max…)"],
            ["**Result**", "Output written to HDFS or another store"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 55–56): maximum temperature per city",
          text: "Many files of pairs like ⟨Toronto, 18⟩, cities repeated across files.\n```flow\nTemperature files -> Split -> Map: emit city, temp -> Shuffle: group by city -> Reduce: max per city -> Tokyo 38, London 27, New York 33, Toronto 32\n```",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**“Sort the laundry by colour, then fold each pile”**: **map** labels every item with its colour (key), **shuffle** makes one pile per colour, **reduce** folds each pile.",
        },
      ],
    },
    {
      id: "spark",
      heading: "Lesson 7: Spark: keep it in memory",
      slides: "57–68",
      blocks: [
        {
          type: "p",
          text: "**Why not just MapReduce? (slide 58)** It writes to disk between steps for fault tolerance and does **one pass** per job, a poor fit for **low-latency** queries and **iterative** algorithms (machine learning, graph algorithms) that reread the same data many times. **In-memory computing** stores data in RAM across a cluster and processes it in parallel.",
        },
        {
          type: "p",
          text: "**Spark enables (slide 59):** (a) **low-latency queries**: load once into distributed memory, then answer query 1, 2, 3… at memory speed; (b) **efficient iterations**: iteration 2 reads iteration 1's results from memory, not disk.",
        },
        {
          type: "table",
          caption: "The Spark ecosystem (slides 60–63)",
          head: ["Component", "Purpose"],
          rows: [
            ["**Spark Core**", "Base engine: memory management, fault recovery, scheduling, distributing and monitoring jobs, storage access"],
            ["**Spark Streaming**", "High-throughput, fault-tolerant processing of live streams"],
            ["**MLlib**", "Machine-learning library"],
            ["**Spark SQL**", "Relational processing with SQL or Hive Query Language"],
            ["**GraphX**", "Graphs and graph-parallel computation (resilient distributed property graph)"],
          ],
        },
        {
          type: "table",
          caption: "How Spark works (slides 64–68)",
          head: ["Concept", "Meaning"],
          rows: [
            ["**RDD**", "Resilient Distributed Dataset: the basic **fault-tolerant**, partitioned data abstraction"],
            ["**DataFrame**", "Schema-aware API on RDDs, optimised by the **Catalyst** optimizer"],
            ["**DAG + lazy evaluation**", "Transformations are recorded, not run, until an **action** triggers execution, so Spark can optimise the whole plan"],
            ["**Driver program + SparkContext**", "Your code on the master node; SparkContext is the gateway (like a database connection)"],
            ["**Cluster manager**", "Splits a job into tasks and allocates resources"],
            ["**Worker nodes / executors**", "Run tasks on RDD partitions, cache data, return results; more workers → more partitions and memory → faster"],
          ],
        },
        {
          type: "p",
          text: "```flow\nDriver: SparkContext -> Cluster manager -> Worker 1: task + cache\nCluster manager -> Worker 2: task + cache\n```",
        },
      ],
    },
    {
      id: "streaming",
      heading: "Lesson 8: Modern distributed and streaming frameworks",
      slides: "69–78",
      blocks: [
        {
          type: "table",
          caption: "Five frameworks (slides 71–78)",
          head: ["Framework", "Primary focus", "Processing model", "Latency", "Typical uses"],
          rows: [
            ["**Spark (Streaming)**", "General distributed batch + streaming; **DStreams** = streams as small batches (built on RDDs)", "**Batch-first, micro-batches**", "Seconds", "ETL, analytics, ML, graphs"],
            ["**Spark Structured Streaming**", "High-level API: run the **same batch code as a stream** with almost no changes (since Spark 2.2)", "Unified batch + stream", "Higher than Flink", "Real-time dashboards, IoT ingestion"],
            ["**Apache Flink**", "**True event-at-a-time** stateful streaming; **exactly-once** state, **event-time** semantics, handles late/out-of-order data", "**Streaming-first**", "**Milliseconds**", "Fraud detection, real-time personalisation, complex event processing"],
            ["**Ray**", "Scale **Python AI/ML** apps with **tasks** (stateless remote functions), **objects** (shared values) and **actors** (stateful classes); in-memory object store", "Flexible actor model", "Low", "Distributed reinforcement learning, hyperparameter tuning, model serving"],
            ["**Dask**", "Scale existing **Python** libraries: Array (NumPy), DataFrame (Pandas), Bag (lists), Dask-ML (scikit-learn, XGBoost), Delayed, Futures → task graph → schedulers", "Parallel Python via task graphs", "Moderate", "Scaling data-science pipelines"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**Spark** = big batches (now also streams) · **Flink** = true streams, milliseconds · **Ray** = Python ML at scale with actors · **Dask** = “Pandas/NumPy, but bigger”.",
        },
      ],
    },
    {
      id: "cloud",
      heading: "Lesson 9: Cloud-native data platforms",
      slides: "79–87",
      blocks: [
        {
          type: "p",
          text: "A **cloud data platform** is *an integrated suite of cloud services to collect, store, process, analyse and act on data at scale*: no physical infrastructure to manage, **elastic scaling**, **pay-as-you-go**, all data types, and one central hub (slide 80).",
        },
        {
          type: "table",
          caption: "Three platforms (slides 82–87)",
          head: ["", "Snowflake", "Google BigQuery", "Databricks"],
          rows: [
            ["**Core idea**", "Separates **storage from compute** (scale each independently); multi-cloud", "**Serverless**: pay per query; automatic scaling", "**Lakehouse**: Spark + **Delta Lake**"],
            ["**Strengths**", "Concurrent workloads without contention; encryption, RBAC; **secure data sharing**", "**BigQuery ML** (models in SQL); Looker; Google AI integration", "Data engineering + ML: notebooks, model management, collaboration"],
            ["**Best for**", "Self-service analytics, BI, sharing across departments/partners, multi-cloud", "Google Cloud users; massive ad-hoc and real-time queries; ML in SQL without infrastructure", "Complex engineering, ML development, diverse (unstructured) data"],
            ["**Pricing**", "Pay per second (credits)", "Pay per TB scanned", "Pay per DBU + cloud VMs"],
            ["**Cloud**", "AWS, Azure, GCP", "GCP only", "Multi-cloud"],
          ],
        },
      ],
    },
    {
      id: "batchstream",
      heading: "Lesson 10: Batch or streaming for ML?",
      slides: "88–93",
      blocks: [
        {
          type: "table",
          caption: "Recap (slides 89–90)",
          head: ["", "Batch", "Streaming"],
          rows: [
            ["**Input**", "Bounded (finite)", "Unbounded: continuous **events**"],
            ["**Runs**", "On a schedule", "Continuously, shortly after events occur"],
            ["**Measured by**", "Throughput and quality", "Latency"],
            ["**Latency**", "High (data accumulates)", "Near real-time"],
            ["**Failure handling**", "Just re-run the job", "Harder: data keeps arriving (fault tolerance concerns)"],
            ["**Broker**", "—", "Often **Kafka**"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Two questions to decide (slides 91–92)",
          text: "**Q1. What are the latency requirements?** If the data's business value **decays within minutes**, don't choose batch. But most decisions aren't second-by-second, so batch is everywhere (reports, dashboards, replication).\n**Q2. What resources do you have?** **Batch is generally cheaper** to build, run and maintain.",
        },
        {
          type: "table",
          caption: "Batch and streaming together in ML (slide 93)",
          head: ["Phase", "Batch", "Streaming"],
          rows: [
            ["**Training**", "**Initial training** on large historical data", "**Continual training** on real-time data → adaptive models"],
            ["**Inference**", "**Batch inference** on large sets: daily sales predictions, monthly risk assessments", "**Real-time inference**: anomaly detection, live recommendations"],
          ],
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "idea",
      title: "In one line",
      text: "When data outgrows one machine: store it in blocks across many (HDFS), process the pieces in parallel (MapReduce), keep hot data in memory (Spark), and stream events as they arrive (Flink), on-premises or on cloud platforms.",
    },
    {
      type: "list",
      items: [
        "**5 V's:** volume, velocity, variety, veracity, value. Big data moves **analysis to the data**, ELT, distributed computing.",
        "**Challenges:** objectives, volume, integration/quality, infrastructure, talent, privacy/compliance.",
        "**Distributed** (network, own memory, horizontal, fault-tolerant) vs **parallel** (one machine, shared memory, vertical, single point of failure).",
        "**In-memory:** RAM microseconds vs disk milliseconds (pantry vs basement).",
        "**Hadoop:** HDFS, YARN, MapReduce, Spark, Hive, Pig, HBase, Flume, Sqoop, Kafka, Storm, ZooKeeper, Oozie, Ambari.",
        "**HDFS:** NameNode (map) + DataNodes (blocks); 3 copies by default; data locality.",
        "**MapReduce:** input → split → map (key/value) → shuffle → reduce → result.",
        "**Spark:** in-memory; RDD, DataFrame, lazy DAG; driver → cluster manager → workers; Core, Streaming, MLlib, SQL, GraphX.",
        "**Frameworks:** Spark (micro-batch), Structured Streaming, Flink (true streaming, ms, exactly-once), Ray (Python ML actors), Dask (scaled Pandas/NumPy).",
        "**Cloud:** Snowflake (storage/compute split), BigQuery (serverless, SQL ML), Databricks (lakehouse).",
        "**ML:** batch for initial training and bulk inference; streaming for continual training and real-time inference.",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: MapReduce steps with the temperature example · HDFS architecture · Hadoop vs Spark · distributed vs parallel · batch vs streaming for an ML scenario · choosing Snowflake/BigQuery/Databricks.",
    },
  ],

  glossary: [
    ["Big data", "—", "Data sets too large/complex for traditional systems"],
    ["5 V's", "Volume, Velocity, Variety, Veracity, Value", "Characteristics of big data"],
    ["Schema-on-read", "—", "Structure applied when data is read, not when stored"],
    ["Principle of locality", "Data locality", "Move computation to where the data is"],
    ["Distributed system", "—", "Networked independent computers with their own memory"],
    ["Parallel system", "—", "Multiple processors sharing memory in one system"],
    ["Horizontal / vertical scaling", "Scale out / scale up", "Add machines / add power to one machine"],
    ["In-memory computing", "IMC", "Processing data held in RAM rather than on disk"],
    ["Hadoop", "—", "Open-source framework for distributed storage and processing"],
    ["HDFS", "Hadoop Distributed File System", "Stores files as replicated blocks across nodes"],
    ["NameNode / DataNode", "—", "HDFS director (metadata) / worker (stores blocks)"],
    ["YARN", "Yet Another Resource Negotiator", "Hadoop resource management and job scheduling"],
    ["MapReduce", "—", "Map → shuffle → reduce parallel programming model"],
    ["HBase", "—", "NoSQL database on HDFS"],
    ["Hive / Drill / Pig", "—", "SQL on Hadoop / schema-free queries / high-level scripting"],
    ["Flume / Sqoop", "—", "Move logs into HDFS / transfer between RDBMS and Hadoop"],
    ["Kafka / Storm", "—", "Message streaming / real-time stream processing"],
    ["ZooKeeper / Oozie / Ambari", "—", "Coordination / workflow scheduling / cluster management UI"],
    ["Mahout / MLlib", "—", "Machine-learning libraries (Hadoop / Spark)"],
    ["Lucene / Solr", "—", "Full-text search library / search platform"],
    ["Apache Spark", "—", "In-memory distributed engine for batch and streaming"],
    ["RDD", "Resilient Distributed Dataset", "Spark's fault-tolerant partitioned data abstraction"],
    ["DataFrame / Catalyst", "—", "Schema-aware Spark API / its query optimiser"],
    ["Lazy evaluation", "—", "Transformations run only when an action is called"],
    ["Driver / SparkContext / executor", "—", "Main program / gateway to Spark / worker process"],
    ["DStream", "Discretized Stream", "Spark Streaming's stream of micro-batches"],
    ["Structured Streaming", "—", "Spark API that runs batch-style code as a stream"],
    ["Apache Flink", "—", "Streaming-first stateful engine, millisecond latency, exactly-once"],
    ["Exactly-once", "—", "Each event affects state exactly one time despite failures"],
    ["Event time", "—", "When an event happened (vs when it was processed)"],
    ["Ray (task, object, actor)", "—", "Python distributed framework: stateless function / shared value / stateful class"],
    ["Dask", "—", "Parallel Python: scaled NumPy, Pandas, lists via task graphs"],
    ["Snowflake / BigQuery / Databricks", "—", "Cloud data platforms: storage-compute split / serverless / lakehouse"],
    ["DBU", "Databricks Unit", "Databricks billing unit"],
    ["Batch / stream processing", "—", "Bounded data on a schedule / unbounded events continuously"],
  ],

  examTips: [
    "For MapReduce, always write the six steps and work the **max-temperature** example, or a word count, with a small flow diagram.",
    "Hadoop vs Spark: disk vs memory, one-pass vs iterative, batch vs batch+streaming, and why ML prefers Spark.",
    "For batch vs streaming, answer the **two questions** (latency needs, resources) and split training vs inference.",
    "Comparison tables score well: distributed vs parallel; Spark vs Flink vs Ray vs Dask; Snowflake vs BigQuery vs Databricks.",
  ],

  theory: [
    {
      title: "MapReduce with an example",
      marks: 5,
      question: "Explain the MapReduce programming model and its steps. Illustrate with finding the maximum temperature of each city from many log files spread across a Hadoop cluster.",
      solution: `
### What the examiner wants
The idea (split into parallel map and reduce tasks), every step, key/value pairs, shuffle by key, and a worked example with output.

### Model answer
**MapReduce** is a programming model that uses **parallel processing** to speed up large-scale data processing across hundreds or thousands of servers in a Hadoop cluster (slide 51). A job taking 10 hours on one processor might take about an hour as 10 parallel tasks (slide 52).

| Step | Role |
|---|---|
| **Input** | Files in HDFS (structured or unstructured) |
| **Splitting** | Data divided into blocks, spread evenly over mappers |
| **Mapping** | Each mapper emits **key/value pairs**: ⟨city, temperature⟩ |
| **Shuffling** | Pairs sorted; all values with the **same key** go to the **same reducer** |
| **Reducing** | Each reducer aggregates its key's values (here: max) |
| **Result** | Written to HDFS |

\`\`\`flow
Log files: Toronto 18, Tokyo 37, London 22, ... -> Split across mappers -> Map: emit city, temp -> Shuffle: all Tokyo values to one reducer -> Reduce: max per city -> Tokyo 38, London 27, New York 33, Toronto 32
\`\`\`

**Why it scales:** mappers run in parallel on the nodes that **already hold the blocks** (data locality); failed tasks are re-run elsewhere; reducers work independently per key.

**Limitation:** MapReduce writes intermediate results to disk and is one-pass, so it is slow for **iterative ML** and interactive queries, where **Spark's in-memory** model is preferred (slide 58).`,
    },
    {
      title: "Hadoop (HDFS + MapReduce) vs Spark",
      marks: 5,
      question: "Describe HDFS architecture and explain why Apache Spark is preferred over MapReduce for machine-learning workloads. Describe Spark's architecture.",
      solution: `
### Model answer
**HDFS (slides 47–49):** a director/worker file system. The **NameNode** holds the namespace and the location of every block; **DataNodes** store blocks and handle replication and reads/writes. Files are split into blocks spread across nodes and **replicated to two more nodes by default**, giving fault tolerance, parallelism and **data locality**.

**Why Spark for ML (slides 58–59):**

| | MapReduce | Spark |
|---|---|---|
| Storage between steps | Disk | **Memory (RAM)** |
| Model | One pass per job | Many steps in one DAG |
| Iterative algorithms (gradient descent, k-means) | Re-reads disk each iteration: slow | Iterations share data in memory: fast |
| Interactive queries | High latency | Load once, query at memory speed |
| Workloads | Batch | Batch + streaming + SQL + ML + graphs |

**Spark architecture (slides 64–68):** the **driver program** creates a **SparkContext** (gateway to Spark), which works with the **cluster manager** to split a job into **tasks** on **worker nodes** (executors) that process **RDD partitions** and **cache** data. Transformations are **lazy**: Spark builds a **DAG** and optimises it before an action runs. **DataFrames** use the Catalyst optimiser. Libraries: Core, Streaming, **MLlib**, SQL, GraphX.

\`\`\`flow
HDFS blocks -> Spark driver builds DAG -> Cluster manager -> Executors load partitions into memory -> Iterate ML training in memory -> Model
\`\`\`

**Conclusion:** keep HDFS (or cloud object storage) for durable storage; use Spark for iterative ML and low-latency analytics.`,
    },
    {
      title: "Batch vs streaming for ML pipelines",
      marks: 5,
      question: "A payments company wants to (a) train a fraud model on three years of transactions and (b) block fraudulent card payments within milliseconds. Discuss batch vs stream processing trade-offs and how both are used in ML training and inference. Suggest frameworks.",
      solution: `
### Model answer
| | Batch | Streaming |
|---|---|---|
| Data | Bounded, accumulated | Unbounded events (often via **Kafka**) |
| Latency | High | Near real-time |
| Success metric | Throughput, quality | Latency |
| Failures | Re-run the job | Harder: data keeps arriving |
| Cost | **Cheaper** | More expensive to build and run |

**Deciding (slides 91–92):** (1) **latency**: does the data's value decay within minutes? For fraud blocking, yes. (2) **resources**: batch is cheaper, so use streaming only where needed.

**In ML (slide 93):**
- **Training:** **batch** for the initial model on three years of history; **streaming** for continual updates as new fraud patterns appear.
- **Inference:** **batch** for bulk scoring (nightly risk review of all accounts); **streaming** for **real-time** scoring of each card payment.

\`\`\`flow
3 years of transactions -> Batch: Spark on lakehouse -> Train fraud model -> Model registry
Live card payments -> Kafka -> Flink: features in ms -> Real-time scoring -> Block or allow
\`\`\`

**Frameworks:** **Spark** (batch training on history; Structured Streaming for near-real-time), **Flink** for millisecond, exactly-once, event-time stream processing (slide 74), **Kafka** as the event broker; a lakehouse such as **Databricks** to unify both.`,
    },
    {
      title: "Distributed vs parallel computing and the big-data challenges",
      marks: 5,
      question: "Compare distributed and parallel systems across architecture, memory, communication, scalability and fault tolerance. Why are distributed systems the basis of big-data processing? Mention two big-data challenges and how to address them.",
      solution: `
### Model answer
| Dimension | Distributed | Parallel |
|---|---|---|
| Architecture | Independent networked computers, each with CPU, memory, OS | Many processors in one machine / tightly coupled cluster |
| Memory | Separate per node; message passing | Shared; fast but contended |
| Communication | Network, milliseconds | Internal bus, nanoseconds–microseconds |
| Scalability | **Horizontal** to thousands of nodes | **Vertical**, limited to hundreds of cores |
| Fault tolerance | Other nodes continue; work reassigned | Single point of failure |
| Geography | Across cities/continents | One location |

**Why distributed for big data:** volume exceeds one machine; adding commodity nodes scales cheaply; replication (HDFS keeps 3 copies) survives failures; computation moves to the data (**data locality**). Parallelism still happens **inside** each node and across nodes (MapReduce, Spark).

\`\`\`flow
Data too big for one machine -> Split into blocks on many nodes -> Process blocks in parallel near the data -> Combine results -> Survive node failures via replicas
\`\`\`

**Two challenges (slides 19–25):**
- **Infrastructure and scalability:** choose cloud, pay-as-you-go platforms (Snowflake, BigQuery, Databricks) that scale storage and compute elastically.
- **Privacy, security and compliance:** encryption, access control, anonymisation, and keeping up with regulations (over a third of budgets go to compliance and defence).`,
    },
  ],

  quiz: [
    { q: "Which V refers to the reliability and accuracy of data?", options: ["Volume", "Velocity", "Veracity", "Value"], answer: 2, why: "Slide 8." },
    { q: "Big-data analytics differs from traditional analytics by:", options: ["Moving data to the analysis", "Moving analysis closer to the data", "Centralised computing", "Avoiding ELT"], answer: 1, why: "Principle of locality (slides 9, 11)." },
    { q: "A distributed system typically scales:", options: ["Vertically", "Horizontally by adding machines", "Only with more cores", "Not at all"], answer: 1, why: "Slide 34." },
    { q: "Which is a single point of failure?", options: ["A distributed system", "A parallel system on one machine", "HDFS with replication", "A Kafka cluster"], answer: 1, why: "Slide 35." },
    { q: "In HDFS, which component knows where every block is stored?", options: ["DataNode", "NameNode", "YARN", "ZooKeeper"], answer: 1, why: "Slide 47." },
    { q: "By default, HDFS replicates each block onto how many additional servers?", options: ["0", "1", "2", "5"], answer: 2, why: "Two more servers, i.e. three copies (slide 49)." },
    { q: "In MapReduce, sending all values with the same key to the same reducer is:", options: ["Splitting", "Mapping", "Shuffling", "Reducing"], answer: 2, why: "Slide 54." },
    { q: "Which tool transfers data between relational databases and Hadoop?", options: ["Flume", "Sqoop", "Oozie", "Pig"], answer: 1, why: "Slide 44." },
    { q: "Spark is faster than MapReduce for iterative ML mainly because it:", options: ["Uses more disks", "Keeps working data in memory", "Has no fault tolerance", "Uses SQL only"], answer: 1, why: "Slides 58–59." },
    { q: "In Spark, nothing is computed until an action is called. This is:", options: ["Eager evaluation", "Lazy evaluation", "Shuffling", "Replication"], answer: 1, why: "Slide 65." },
    { q: "Which framework is streaming-first with millisecond latency and exactly-once state?", options: ["Spark (DStreams)", "Apache Flink", "Dask", "Hive"], answer: 1, why: "Slides 74, 78." },
    { q: "Which framework scales existing Pandas and NumPy code?", options: ["Ray", "Dask", "Flink", "Storm"], answer: 1, why: "Slide 77." },
    { q: "Which platform is serverless and charges per TB scanned?", options: ["Snowflake", "BigQuery", "Databricks", "HDFS"], answer: 1, why: "Slides 83, 87." },
    { q: "Initial model training on years of historical data is best done with:", options: ["Stream processing", "Batch processing", "Real-time inference", "Sensors"], answer: 1, why: "Slide 93." },
  ],
};
