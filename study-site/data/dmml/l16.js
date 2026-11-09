// DMML — Lecture 16: Data and ML Observability
// Source: CourseFiles/DMML/L16-Data and ML Observability.pptx (92 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data & ML Observability",
  source: "L16-Data and ML Observability.pptx · 92 slides",
  overview:
    "A model in production can keep running and **look perfectly healthy while giving wrong answers**: a recommender suggesting winter coats in spring, a report built on yesterday's data, a facial-recognition system that led to a wrongful arrest (slides 6–9). **Observability** is how we see *inside* data pipelines and models to catch these **silent failures** and find out **why** they happened. **Part 1** covers data observability: data downtime, monitoring vs observability, the maturity model, the **five pillars (freshness, volume, schema, lineage, distribution)** via one running case study, instrumentation and the observability pipeline, patterns (logs, traces, alerts, dashboards, anomaly detection), tools and the link to **DataOps** (slides 4–49). **Part 2** covers ML observability: data vs ML observability, **common ML failures** and root causes, **metrics** and drift tests, **Evidently** and **Arize**, a **closed-loop framework**, **SLIs/SLOs/SLAs** and **LLM observability** (slides 50–89).",

  simpleIntro: "A car's dashboard tells you the speed, fuel and engine temperature; a good mechanic can also tell you **why** the engine light came on. Data pipelines and ML models need both. The dangerous failures are **silent**: the system keeps running but the numbers are old, doubled or quietly wrong. This lecture teaches how to watch data (the **five pillars**), how to watch models (**drift**, staleness, bad labels), what to measure, when to retrain, and how to set clear targets (**SLIs, SLOs, SLAs**).",

  simple: [
    {
      "id": "s-big",
      "heading": "1. The big picture",
      "slides": "4–9",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Watch the data",
              "text": "Is it fresh, the right amount, the right shape, traceable, normal-looking?",
              "tag": "Data observability",
              "example": "ETL failed, reports used old data"
            },
            {
              "title": "Watch the model",
              "text": "Is it still accurate, or have the world, the rules or the features changed?",
              "tag": "ML observability",
              "example": "Winter coats recommended in spring"
            },
            {
              "title": "Close the loop",
              "text": "Set targets, alert, find the cause, retrain automatically.",
              "tag": "Act",
              "example": "Retrain when PSI > 0.2"
            }
          ]
        },
        {
          "type": "p",
          "text": "**Why it matters:** data downtime can cost 140K–540K dollars **per hour**; bad data about 12.9 million dollars a year. A facial-recognition error even led to a wrongful arrest."
        }
      ]
    },
    {
      "id": "s-mvo",
      "heading": "2. Monitoring vs observability",
      "slides": "10–12",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Monitoring",
            "Observability"
          ],
          "rows": [
            [
              "Like…",
              "The dashboard warning light",
              "The mechanic finding the cause"
            ],
            [
              "Answers",
              "**What** happened?",
              "**Why**, and where?"
            ],
            [
              "Style",
              "Reactive",
              "Proactive"
            ],
            [
              "Finds",
              "Problems you expected",
              "Problems you didn't expect"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Maturity ladder:** L0 monitoring → L1 observability → L2 full-stack (metrics, events, logs, traces) → L3 intelligent (AI finds patterns) → L4 federated (any data, on demand)."
        }
      ]
    },
    {
      "id": "s-pillars",
      "heading": "3. Five pillars, one story",
      "slides": "13–21",
      "blocks": [
        {
          "type": "p",
          "text": "**The story:** a complaints system (phone, web, chat, email, post) loads data every night from OLTP to OLAP for reports and models."
        },
        {
          "type": "table",
          "head": [
            "Pillar",
            "Question",
            "What went wrong"
          ],
          "rows": [
            [
              "**Freshness**",
              "Is it up to date?",
              "The ETL failed silently; reports used old data"
            ],
            [
              "**Volume**",
              "Right amount?",
              "Every record loaded **twice**"
            ],
            [
              "**Schema**",
              "Same structure?",
              "A key column changed without warning; 750 reports a year at risk"
            ],
            [
              "**Lineage**",
              "Where does it come from and go?",
              "An unknown system downstream complained"
            ],
            [
              "**Distribution**",
              "Do values look normal?",
              "A spike turned out to be test data loaded by mistake"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "“**F**resh **V**egetables **S**poil **L**ess **D**aily”: Freshness, Volume, Schema, Lineage, Distribution."
        },
        {
          "type": "table",
          "head": [
            "",
            "Data quality",
            "Data observability"
          ],
          "rows": [
            [
              "Checks",
              "The data itself (rules)",
              "The whole pipeline's health"
            ],
            [
              "When",
              "At rest",
              "In motion"
            ],
            [
              "Style",
              "Known rules",
              "Learns what's normal (ML)"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Sales numbers suddenly doubled overnight because a loader ran twice. Which pillar catches it?",
          "options": [
            "Freshness",
            "Volume",
            "Lineage",
            "Schema"
          ],
          "answer": 1,
          "why": "Unexpected row counts are a volume problem."
        }
      ]
    },
    {
      "id": "s-how",
      "heading": "4. How we watch: the toolkit",
      "slides": "22–49",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Pattern",
            "Simple idea"
          ],
          "rows": [
            [
              "**Logs**",
              "A flight recorder: structured (JSON), with a correlation ID to follow one request"
            ],
            [
              "**Traces**",
              "A parcel's full journey; each stop is a span"
            ],
            [
              "**Alerts**",
              "Only when it matters, by severity, linked to on-call"
            ],
            [
              "**Dashboards**",
              "The 4 golden signals: **latency, traffic, errors, saturation**"
            ],
            [
              "**Anomaly detection**",
              "Learn normal, flag odd: one value (point), odd for the time (contextual), odd as a group (collective)"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Observability pipeline:** ingest (limit floods) → transform (filter noise, sample, mask PII) → store (hot recent data, cold old data) → query (access control)."
        },
        {
          "type": "table",
          "head": [
            "Tool",
            "For"
          ],
          "rows": [
            [
              "Monte Carlo / Databand",
              "Automatic data observability"
            ],
            [
              "Soda Core",
              "Data tests written as code"
            ],
            [
              "OpenLineage",
              "Lineage"
            ],
            [
              "OpenTelemetry",
              "Logs, metrics, traces"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**DataOps cycle:** detect (rule checks) → awareness (shared metadata and lineage across teams) → iterate (data-as-code)."
        }
      ]
    },
    {
      "id": "s-ml",
      "heading": "5. How ML systems fail quietly",
      "slides": "50–73",
      "blocks": [
        {
          "type": "p",
          "text": "A translator that returns French in under a second is *operationally* fine, even if the French is **wrong**. That's a silent ML failure."
        },
        {
          "type": "table",
          "head": [
            "Failure",
            "Plain meaning",
            "Example"
          ],
          "rows": [
            [
              "**Data drift**",
              "The **customers** changed",
              "Shopping trends shift; winter model in spring"
            ],
            [
              "**Concept drift**",
              "The **rules** changed",
              "What counts as fraud evolves"
            ],
            [
              "**Feature staleness**",
              "The **news is old**",
              "Cached features; slow joins (fresh data ≠ fresh features)"
            ],
            [
              "**Label mismatch**",
              "The **answer key** is wrong",
              "Annotator errors, class imbalance"
            ],
            [
              "**Inference degradation**",
              "Slowly getting worse",
              "Old assumptions no longer hold"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Root causes:** mostly **data** (drift, training-serving skew, quality, labels), then **model design** (overfitting, feedback loops, wrong goal), then **operations** (offline ≠ online, no monitoring)."
        },
        {
          "type": "check",
          "q": "Inputs look the same as last year, but what counts as ‘fraud’ has changed. This is…",
          "options": [
            "Data drift",
            "Concept drift",
            "Feature staleness",
            "Volume issue"
          ],
          "answer": 1,
          "why": "The input→target relationship changed."
        }
      ]
    },
    {
      "id": "s-measure",
      "heading": "6. What to measure and when to retrain",
      "slides": "74–83",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Layer",
            "Examples"
          ],
          "rows": [
            [
              "Software",
              "Latency, errors, memory"
            ],
            [
              "Data",
              "% missing, out-of-range, PSI"
            ],
            [
              "Model",
              "Precision, recall, F1, RMSE, calibration, fairness"
            ],
            [
              "Business",
              "Clicks, purchases, approvals"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Rules of thumb (slide 80)",
          "text": "**PSI** < 0.1 stable · 0.1–0.25 moderate · **> 0.25 act**. Retrain when PSI > 0.2, or F1/accuracy drops 5–10% from the training baseline."
        },
        {
          "type": "p",
          "text": "**Drift tests:** PSI, Kolmogorov–Smirnov, Jensen–Shannon, Wasserstein. **Tools:** **Evidently** (open-source drift reports) and **Arize** (diagnose performance), both linking to MLflow and Airflow."
        }
      ]
    },
    {
      "id": "s-slo",
      "heading": "7. Targets: SLI → SLO → SLA",
      "slides": "84–89",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Term",
            "Like…",
            "Example"
          ],
          "rows": [
            [
              "**SLI**",
              "The thermometer reading",
              "Duplicate rate; data freshness"
            ],
            [
              "**SLO**",
              "The target temperature",
              "“99% of pipelines deliver within 1 hour”; “accuracy ≥ 95%”"
            ],
            [
              "**SLA**",
              "The promise, with a penalty",
              "“We'll meet it 90% of the time; if not, …”"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Slide arithmetic",
          "text": "90% over 30 days (720 hours) allows **72 hours** of misses, not the 7.2 hours printed on slide 87 (that would be 99%)."
        },
        {
          "type": "p",
          "text": "```flow\nData checks -> Model monitoring -> Versions and lineage -> Retrain when a trigger fires -> Data checks\n```"
        },
        {
          "type": "p",
          "text": "**LLM observability:** vector drift (RAG context shifting), prompt drift, LLM-as-a-judge for hallucination and safety, full traces of each request."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "8. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Monitoring** = what (light); **observability** = why (mechanic).\n- **Five pillars:** Freshness, Volume, Schema, Lineage, Distribution.\n- **Golden signals:** latency, traffic, errors, saturation.\n- **ML failures:** customers changed (data drift), rules changed (concept drift), old news (staleness), wrong answer key (labels).\n- **PSI > 0.25 act; retrain at PSI > 0.2 or 5–10% F1 drop.**\n- **SLI** measure → **SLO** target → **SLA** promise."
        }
      ]
    }
  ],

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why observe? Data downtime and silent failures",
      slides: "5–12",
      blocks: [
        {
          type: "p",
          text: "**Data downtime** = periods when data is **partial, wrong, missing or late**. It can cost **140K–540K dollars per hour**, and bad decisions from bad data cost organisations about **12.9 million dollars a year** on average (slide 7).",
        },
        {
          type: "table",
          caption: "Real incidents (slides 6, 8–9)",
          head: ["Incident", "What went wrong", "Pillar"],
          rows: [
            ["**Mercari** (marketplace)", "A Google query silently turned a column into an integer; a **schema-change monitor** alerted the team in time", "Schema"],
            ["**A bank's trading reports**", "A batch job mishandled daylight saving time → traders used **one-hour-old** data", "Freshness"],
            ["**A fashion retailer**", "A model trained on winter patterns kept recommending heavy coats in spring; **slow covariate shift**, no crash, falling accuracy", "Distribution / drift"],
            ["**Robert Williams (2020)**", "Wrongfully arrested after facial recognition matched him to grainy footage; NIST (2019) found some algorithms **10–100× more likely** to misidentify African-American and Asian faces", "Data bias → model failure"],
          ],
        },
        {
          type: "callout",
          kind: "idea",
          title: "The root cause (slide 9)",
          text: "Models are trained on **historical data** assuming the future looks the same. In the real world, data changes (gradually or suddenly), so **data drift** quietly makes models less accurate.",
        },
        {
          type: "table",
          caption: "Monitoring vs observability (slides 10–11)",
          head: ["Monitoring", "Observability"],
          rows: [
            ["Tracks a **pre-defined** set of metrics", "Uses metrics, logs and traces to explore the system's **state**"],
            ["Detects issues: “**What** happened? Is it working?”", "Explains root causes: “**Why** did it happen? Where exactly?”"],
            ["**Reactive**: finds **known unknowns**", "**Proactive**: finds **unknown unknowns**"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Slide check",
          text: "Slide 11's table lists “tracks a pre-defined set of metrics” under **both** columns. That describes monitoring; observability goes beyond fixed metrics to ask new questions of the system.",
        },
        {
          type: "table",
          caption: "Observability maturity model (slide 12)",
          head: ["Level", "Name", "Meaning"],
          rows: [
            ["**L0**", "Monitoring", "Each component works: performance, capacity, availability, alerts"],
            ["**L1**", "Observability", "Why isn't it working: metrics, logs, traces, dashboards, alarms"],
            ["**L2**", "Full-stack observability", "Contextual telemetry (**MELT**: metrics, events, logs, traces); root cause by topology"],
            ["**L3**", "Intelligent observability", "AI/ML finds patterns signalling errors; automated correlation and remediation"],
            ["**L4**", "Federated observability", "Any data to any consumer on demand; highest impact at lowest cost"],
          ],
        },
      ],
    },
    {
      id: "pillars",
      heading: "Lesson 2: The five pillars of data observability",
      slides: "13–21",
      blocks: [
        {
          type: "p",
          text: "**The running case study (slide 14):** a large company's **complaints-management system** receives complaints by phone, web, chat, email, post and in person. Data grows **500 GB a year** (total > 7 TB). Every night an **incremental ETL** moves data from OLTP to OLAP for downstream systems and weekly-to-annual compliance reports; after crashes a **full reload takes 16 hours**. Each pillar is one thing that went wrong:",
        },
        {
          type: "table",
          caption: "Five pillars, five incidents (slides 15–19)",
          head: ["Pillar", "Question", "What happened in the case", "Why it matters"],
          rows: [
            ["**Freshness**", "Is the data up to date?", "The ETL failed silently; month-end reports ran on **stale** data", "Stale sales data → stock-outs or overstock; misleading insights"],
            ["**Volume**", "Is the amount right?", "**Double** the volume: a bug loaded every record **twice** (caught in the ETL cycle)", "Missing rows or duplicates snowball"],
            ["**Schema**", "Did the structure change?", "Source schema changed (including a **key column**) without telling the team behind **750 reports a year**", "Breaks dashboards, APIs, ML models"],
            ["**Lineage**", "Where does data come from and go?", "The team didn't know consumers beyond one hop; an **unknown system** reported an “ETL failure”", "Data's **GPS**: trace problems, audit, comply"],
            ["**Distribution**", "Do values look normal?", "A spike in API complaints was an automated program loading **test data** by mistake", "Early warning of corruption and drift"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook: “FVSLD = Fresh Vegetables Spoil Less Daily”",
          text: "**F**reshness · **V**olume · **S**chema · **L**ineage · **D**istribution.",
        },
        {
          type: "table",
          caption: "Data quality vs data observability (slide 21)",
          head: ["Aspect", "Data quality", "Data observability"],
          rows: [
            ["**Focus**", "The **state** of data: accuracy, completeness, consistency", "The **health of pipelines**: freshness, volume, schema changes"],
            ["**Approach**", "Predefined manual rules (reactive)", "ML-based anomaly detection (proactive)"],
            ["**Scope**", "Specific datasets: **data at rest**", "Entire pipeline: **data in motion**"],
            ["**Goal**", "Data is usable for business", "Data flows without failures"],
            ["**Best for**", "Compliance, governance, known constraints", "Complex/real-time systems; lowering **MTTR**"],
          ],
        },
      ],
    },
    {
      id: "instrument",
      heading: "Lesson 3: How do we instrument a pipeline?",
      slides: "22–42",
      blocks: [
        {
          type: "p",
          text: "**The black box (slide 23):** you know what goes in and what comes out, but not what happened in between, so you see strange values and missing columns. *To correct, you must first observe.* **Telemetry** = data an application emits about its internal state (CPU, memory, error rates, response times, logs, traces). **Instrumentation** = adding code that collects telemetry (slide 24).",
        },
        {
          type: "table",
          caption: "What to observe along a data pipeline (slides 25–27)",
          head: ["Point", "Watch for"],
          rows: [
            ["**Ingestion**", "How much arrives, how fast, errors and delays"],
            ["**Processing**", "Stage failures, latency, resource use, correct transformations"],
            ["**Storage & delivery**", "Write speed, correct destinations"],
            ["**Error tracking**", "Where errors occurred, root causes, suggested fixes"],
            ["**Performance**", "Bottlenecks, optimisation"],
            ["**Anomaly detection**", "Unusual behaviour (a stage suddenly much slower)"],
            ["**Alerting & reporting**", "Real-time notifications and health reports"],
          ],
        },
        {
          type: "table",
          caption: "The observability pipeline (slides 28–32)",
          head: ["Stage", "Key features"],
          rows: [
            ["**Ingestion**", "Batching, buffering, compression; **flow control**: **cardinality limiter** (stops an explosion of unique time series), **concurrency limiter**, **streaming aggregation**"],
            ["**Transformation** (the missing step)", "Before storage: **filter** noise (debug logs), **aggregate** spans into metrics, **sample** traces (tail-based), **enrich** (Kubernetes/cloud tags), **mask PII**"],
            ["**Storage**", "**Tiering**: hot (“blaze”) tier for recent data, **cold** tier for old data; **no downsampling** (keep full resolution)"],
            ["**Query**", "**Access tokens and policies**, **client separation**, **query acceleration**"],
          ],
        },
        {
          type: "table",
          caption: "Five basic patterns (slides 33–39)",
          head: ["Pattern", "Best practices"],
          rows: [
            ["**Log analytics** (the flight recorder)", "**Structured** (JSON) logs; consistent fields (timestamp, serviceName, logLevel, **correlationId**); centralise (ELK, Splunk); log-level hygiene (DEBUG…FATAL); correlate with metrics and traces"],
            ["**Distributed tracing**", "A **trace** is a request's whole journey; **spans** are its steps (a DB query, an API call); **context propagation** links them; pinpoints the slow or failing service"],
            ["**Alerting**", "Thresholds based on **SLOs/KPIs**; severity levels; connect to incident management/on-call; tune continuously to cut noise"],
            ["**Dashboards**", "The **four golden signals: latency, traffic, errors, saturation**; trends with context; layered drill-down; clickable through to logs and traces"],
            ["**Anomaly detection**", "Baseline normal behaviour; statistics (mean, SD) or ML (**Isolation Forest, autoencoders**). Types: **point** (one huge transaction), **contextual** (high traffic at 3 AM), **collective** (a group pattern, e.g. a DDoS attack)"],
          ],
        },
        {
          type: "table",
          caption: "Common tools (slides 40–42)",
          head: ["Tool", "Use it for"],
          rows: [
            ["**Monte Carlo**", "End-to-end, ML-driven data observability with lineage and RCA: fast to deploy"],
            ["**Databand** (IBM)", "Pipeline reliability inside Airflow/Spark: runtimes, completeness, quality"],
            ["**Soda Core**", "Open-source, code-defined **data tests** (YAML/SQL) in pipelines"],
            ["**OpenLineage**", "Standard for collecting **lineage** metadata; impact of schema changes"],
            ["**OpenTelemetry**", "Vendor-neutral standard for **logs, metrics and traces** (APM)"],
          ],
        },
        {
          type: "p",
          text: "**Choosing a tool (slide 40):** map your data landscape and priority use cases → check coverage of the five pillars → validate integration and scalability → assess alert quality and noise reduction → consider total cost and the vendor partnership.",
        },
      ],
    },
    {
      id: "dataops",
      heading: "Lesson 4: Observability and DataOps",
      slides: "43–49",
      blocks: [
        {
          type: "p",
          text: "Observability **reduces data downtime** by detecting anomalies and alerting the right people, cutting **time to detection and time to resolution**. It is fundamental to **DataOps** (an agile delivery pipeline and feedback loop for data products) because it watches every stage of the DataOps lifecycle and enables root-cause analysis (slides 44–45).",
        },
        {
          type: "table",
          caption: "The DataOps cycle (slides 46–48)",
          head: ["Stage", "Focus", "What happens"],
          rows: [
            ["**Detection**", "Validation", "Classic data-quality checks: column schemas, row-level business rules. But you can only check rules you already know"],
            ["**Awareness**", "Visibility", "**Metadata-first** governance: centralise pipeline and dataset metadata so Team A can trace bad data upstream to Team B and B can warn A about downstream impact"],
            ["**Iteration**", "Process", "**Data-as-code**: repeatable standards for all data development"],
          ],
        },
        {
          type: "p",
          text: "**Benefits (slide 49):** better data quality, happier and more productive teams (less firefighting), faster insights (automatic anomaly detection and RCA), and lower operational and legal risk through lineage.",
        },
      ],
    },
    {
      id: "mlobs",
      heading: "Lesson 5: From data to ML observability",
      slides: "50–59",
      blocks: [
        {
          type: "p",
          text: "**ML observability** = *X-ray vision into how a model behaves in production*, not just whether it's running (slide 52). Without it, a recommender serving millions could degrade for weeks until revenue drops.",
        },
        {
          type: "table",
          caption: "Data vs ML observability (slides 53–54)",
          head: ["Aspect", "Data observability", "ML observability"],
          rows: [
            ["**Watches**", "Pipelines and infrastructure", "Model behaviour and performance"],
            ["**Unit**", "Individual data points and datasets", "Whole models/algorithms"],
            ["**Signals**", "Freshness, completeness, schema consistency", "Accuracy, precision, recall, evaluation metrics"],
            ["**Techniques**", "Profiling, lineage, anomaly detection", "Performance monitoring, feature importance, explainability"],
            ["**Users**", "Data engineers, scientists, analysts", "ML engineers, scientists, business stakeholders (performance, **fairness**)"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "ML monitoring vs ML observability (slides 55–56): “the What vs the Why”",
          text: "**Monitoring** tells you **what** and **when** (accuracy dropped on Tuesday): failure-centric alerts. **Observability** explains **why** and often **how to fix it**: for concept drift it compares data distributions and indicators to pinpoint the cause, with a whole-system view even when nothing has crashed.",
        },
        {
          type: "table",
          caption: "Garbage in, garbage out: data health drives model performance (slides 57–59)",
          head: ["Factor", "Effect"],
          rows: [
            ["**Quality & reliability**", "Incomplete or inconsistent data → poor decisions"],
            ["**Sample size**", "Small datasets → poor, even near-random, performance"],
            ["**Missing values**", "Handling matters (treating clinical gaps as **MAR** gave more robust models)"],
            ["**Bias & fairness**", "Less data on marginalised groups → unfair, less accurate results"],
            ["**Distribution drift**", "Production ≠ training data → wrong predictions"],
            ["**Feature representation**", "How complex data (e.g. EHRs) is represented decides success"],
          ],
        },
      ],
    },
    {
      id: "failures",
      heading: "Lesson 6: How ML systems fail",
      slides: "60–73",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "Two kinds of expectation (slides 61–62)",
          text: "Take an English→French translator. **Operational:** return a translation within 1 second; a violation is loud (timeout, 404, out-of-memory). **ML performance:** the translation is correct 99% of the time; a violation is **silent**: you still get a French sentence, just a wrong one. ML systems must watch **both**.",
        },
        {
          type: "table",
          caption: "Common failures (slides 63–69)",
          head: ["Failure", "Meaning", "Example"],
          rows: [
            ["**Data drift**", "Input **distribution** changes so training data no longer represents reality; models can lose **over 40% accuracy in a year** (Microsoft)", "E-commerce conversion model as shopping trends change"],
            ["**Concept drift**", "The **relationship** between inputs and target changes, even if inputs look the same", "The definition of a **fraudulent transaction** evolves"],
            ["**Feature staleness**", "Features are out of date at prediction time. **Fresh data ≠ fresh features** (joins and aggregations add delay)", "Causes: training-serving skew, stale caches, delayed joins, slow fetches (bad sharding), asynchronous updates"],
            ["**Label mismatch**", "Labels wrong or inconsistent", "Annotator errors, **class imbalance**, “NA” vs null, deliberate manipulation"],
            ["**Inference degradation**", "Predictions slowly get worse as assumptions go stale (model drift)", "A historical model failing on new patterns"],
          ],
        },
        {
          type: "table",
          caption: "Root-cause classes (slides 70–73)",
          head: ["Class", "Examples"],
          rows: [
            ["**Data issues** (most failures, often silent)", "Data/concept drift; **training-serving skew** (batch training vs real-time features); quality problems; labelling errors and bias"],
            ["**Model logic / design**", "Over/underfitting; **fragility** to small perturbations (adversarial examples); **degenerate feedback loops** (predictions shape future training data); **wrong objective** (accuracy instead of profit)"],
            ["**System & operations**", "**Offline-online mismatch**; inadequate monitoring (silent failures go unseen); fragile pipeline complexity; infrastructure limits (latency, cost)"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**Data drift = the customers changed. Concept drift = the rules changed. Staleness = the news is old. Label mismatch = the answer key is wrong.**",
        },
      ],
    },
    {
      id: "metrics",
      heading: "Lesson 7: What to measure, and when to retrain",
      slides: "74–83",
      blocks: [
        {
          type: "table",
          caption: "Four layers of ML system quality (slides 75–77)",
          head: ["Layer", "Metrics"],
          rows: [
            ["**Software health**", "Latency, error rates, memory, disk: monitor like any service"],
            ["**Data quality**", "% missing values, type mismatches, range violations"],
            ["**Model quality**", "Precision/recall, MAE/RMSE, top-k accuracy; **proxy metrics** if true labels arrive late"],
            ["**Business KPIs**", "Clicks, purchases, loan approvals, cost savings: the ultimate measure"],
          ],
        },
        {
          type: "table",
          caption: "Model-level metrics (slide 78)",
          head: ["Metric", "Use"],
          rows: [
            ["**Accuracy**", "Classification"],
            ["**Precision**", "When **false positives** are costly"],
            ["**Recall**", "When **false negatives** are costly"],
            ["**F1**", "Balanced; preferred for **imbalanced** data"],
            ["**RMSE / MAE**", "Regression (MAE when there are outliers)"],
            ["**AUC-ROC**", "Binary classification ranking"],
            ["**Latency / calibration / fairness**", "Inference time; predicted probabilities match reality (80% confident → right 80% of the time); equal outcomes across groups"],
          ],
        },
        {
          type: "table",
          caption: "Data-level metrics and drift tests (slide 79)",
          head: ["Metric / test", "Detects"],
          rows: [
            ["Missing-value rate", "Pipeline failures"],
            ["Feature mean / variance", "Distribution shifts"],
            ["Cardinality changes", "Schema drift in categorical features"],
            ["Range violations / type mismatches", "Out-of-bounds values / schema corruption"],
            ["**PSI** (Population Stability Index)", "Distribution change over time"],
            ["**Kolmogorov–Smirnov test**", "Whether two distributions differ"],
            ["**Jensen–Shannon divergence**", "How similar two distributions are"],
            ["**Wasserstein distance**", "“Earth mover's distance” between distributions"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Thresholds and retraining triggers (slide 80)",
          text: "- Set **baselines** during training; alert on a set drop (e.g. **5–10% fall in F1**).\n- **PSI < 0.1:** no significant change · **0.1–0.25:** moderate · **> 0.25:** act.\n- **Retrain** when PSI is high (**> 0.2**), accuracy/F1 drops significantly, or feature importance degrades.",
        },
        {
          type: "table",
          caption: "Two tools (slides 82–83)",
          head: ["Tool", "What it does", "Integrations"],
          rows: [
            ["**Evidently** (open source)", "Data drift, data quality and model performance reports and dashboards", "Airflow/Prefect jobs, logs drift scores to **MLflow**, ZenML, Grafana, Jupyter"],
            ["**Arize**", "AI observability: troubleshooting and diagnosing model performance (also LLMs, Phoenix)", "Airflow alerts/retraining triggers, **MLflow**, Feast, Vertex AI, SageMaker, LangChain, OpenAI"],
          ],
        },
      ],
    },
    {
      id: "unified",
      heading: "Lesson 8: A unified framework, SLIs/SLOs/SLAs and LLM observability",
      slides: "84–89",
      blocks: [
        {
          type: "p",
          text: "```flow\nData quality: schema, missing values, drift -> Model monitoring: accuracy, concept drift -> Metadata: versions, lineage -> Retraining loop: event or schedule triggers -> Data quality\n```",
        },
        {
          type: "p",
          text: "**The closed loop (slide 85):** **data quality** (data engineering) → **model monitoring** (MLOps) → **metadata tracking** (governance: who trained the model on what?) → **retraining loop** (automation: event-based when drift crosses a threshold, or time-based), and back.",
        },
        {
          type: "table",
          caption: "SLI → SLO → SLA (slides 86–88)",
          head: ["Term", "Meaning", "Example"],
          rows: [
            ["**SLI** (indicator)", "An agreed **measurement** of data or model health", "Duplicate rate of user records; freshness, nulls, out-of-range values, formatting"],
            ["**SLO** (objective)", "The **target** for an SLI", "Duplicate user-ID rate ≤ 0.25%; “99% of pipelines deliver new data within 1 hour”; “model accuracy stays above 95%, else retrain”"],
            ["**SLA** (agreement)", "A **commitment** that the SLI meets the SLO, plus **what happens if it doesn't**", "Meet the duplicate-rate SLI 90% of the time over the trailing 30 days"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): the downtime arithmetic (slide 87)",
          text: "The slide says meeting the SLI **90%** of the time over **30 days** allows “**7.2 hours**” of downtime. 30 days = 720 hours, and 10% of 720 = **72 hours**. 7.2 hours would correspond to **99%**.",
        },
        {
          type: "table",
          caption: "LLM observability (slide 89): from predictive to generative",
          head: ["Signal", "Meaning"],
          rows: [
            ["**Vector drift**", "In RAG, the embedding space of retrieved context drifts away from what the model expects"],
            ["**Prompt drift**", "The same prompt gives worse results over time (model updates, changing users)"],
            ["**Quality & safety evaluation**", "**LLM-as-a-judge** scores hallucination, safety and toxicity in real time"],
            ["**Full traces**", "Capture user input, system prompt, retrieved data, tool arguments and output to debug non-deterministic failures"],
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
      text: "Watch data (freshness, volume, schema, lineage, distribution) and models (performance, drift, staleness, labels) end to end, explain *why* things break, and close the loop with SLOs and automatic retraining.",
    },
    {
      type: "list",
      items: [
        "**Data downtime** costs 140K–540K dollars/hour; bad data ~12.9 M dollars/year; silent failures (Mercari schema, DST delay, winter coats, facial recognition).",
        "**Monitoring** = what, reactive, known unknowns; **observability** = why, proactive, unknown unknowns. Maturity L0 monitoring → L4 federated.",
        "**Five pillars:** freshness, volume, schema, lineage, distribution (complaints case study).",
        "**Data quality** (state, rules, at rest) vs **data observability** (pipeline health, ML anomalies, in motion, MTTR).",
        "**Observability pipeline:** ingestion (cardinality/concurrency limits) → transformation (filter, aggregate, sample, enrich, mask PII) → storage (hot/cold tiers) → query (access, separation, acceleration).",
        "**Patterns:** structured logs, distributed tracing (trace/spans), actionable alerts, dashboards (latency, traffic, errors, saturation), anomaly detection (point, contextual, collective).",
        "**Tools:** Monte Carlo, Databand, Soda Core, OpenLineage, OpenTelemetry; DataOps cycle: detection → awareness → iteration.",
        "**ML failures:** data drift, concept drift, feature staleness, label mismatch, inference degradation; root causes: data, model design, system/ops.",
        "**Metrics:** software, data, model, business KPIs; PSI, KS, JS, Wasserstein; PSI > 0.25 act, retrain at PSI > 0.2 or 5–10% F1 drop. Tools: Evidently, Arize.",
        "**Closed loop** + **SLI → SLO → SLA**; LLM observability: vector drift, prompt drift, LLM-as-a-judge, full traces.",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: five pillars of data observability with examples · monitoring vs observability · data drift vs concept drift vs feature staleness · design an ML observability framework with SLOs and retraining triggers.",
    },
  ],

  glossary: [
    ["Data downtime", "—", "Periods when data is partial, erroneous, missing or late"],
    ["Silent failure", "—", "System keeps running but gives wrong results"],
    ["Monitoring", "—", "Tracking predefined metrics to detect what went wrong"],
    ["Observability", "—", "Understanding why a system behaves as it does from its outputs"],
    ["Known / unknown unknowns", "—", "Problems you anticipated / problems you didn't"],
    ["MELT", "Metrics, Events, Logs, Traces", "Types of telemetry data"],
    ["Freshness / volume / schema / lineage / distribution", "—", "Five pillars of data observability"],
    ["MTTR", "Mean Time To Resolution", "Average time to fix an incident"],
    ["Telemetry", "—", "Data a system emits about its internal state"],
    ["Instrumentation", "—", "Adding code to collect telemetry"],
    ["Cardinality limiter", "—", "Prevents an explosion of unique time series"],
    ["Tail-based sampling", "—", "Keep traces chosen after seeing the whole request"],
    ["Structured logging", "—", "Logs in a parseable format such as JSON"],
    ["Correlation ID", "—", "ID that links all logs of one request across services"],
    ["Trace / span", "—", "A request's full journey / one unit of work within it"],
    ["Golden signals", "—", "Latency, traffic, errors, saturation"],
    ["Point / contextual / collective anomaly", "—", "One odd value / odd for its context / odd as a group"],
    ["Isolation Forest / autoencoder", "—", "ML methods for anomaly detection"],
    ["Monte Carlo / Databand / Soda Core", "—", "Data observability and data-testing tools"],
    ["OpenLineage / OpenTelemetry", "—", "Open standards for lineage / logs-metrics-traces"],
    ["APM", "Application Performance Monitoring", "Monitoring application speed and errors"],
    ["DataOps", "—", "Agile, automated delivery and feedback loop for data"],
    ["Data-as-code", "—", "Managing data definitions and checks like software"],
    ["Data drift / covariate shift", "—", "Change in input data distribution"],
    ["Concept drift", "—", "Change in the input-to-target relationship"],
    ["Feature staleness", "—", "Features out of date at prediction time"],
    ["Training-serving skew", "—", "Different feature logic or timing in training vs serving"],
    ["Degenerate feedback loop", "—", "Model outputs shape its own future training data"],
    ["Calibration", "—", "Predicted probabilities match observed frequencies"],
    ["PSI", "Population Stability Index", "Distribution-shift score; > 0.25 means significant drift"],
    ["KS test / JS divergence / Wasserstein distance", "Kolmogorov–Smirnov / Jensen–Shannon / Earth mover's", "Tests and distances for comparing distributions"],
    ["Evidently / Arize", "—", "ML monitoring and observability tools"],
    ["SLI / SLO / SLA", "Service Level Indicator / Objective / Agreement", "Measurement / target / commitment with consequences"],
    ["Vector drift / prompt drift", "—", "LLM-era drift in embeddings / in prompt outcomes"],
    ["LLM-as-a-judge", "—", "Using an LLM to score outputs"],
  ],

  examTips: [
    "For the five pillars, give each a **one-line definition + the complaints-system incident + a detection method**; a table is ideal.",
    "Always contrast **monitoring (what, reactive) vs observability (why, proactive)**, for data and for ML.",
    "Distinguish **data drift, concept drift and feature staleness** with the e-commerce, fraud-definition and stale-cache examples.",
    "For framework questions, draw the closed loop and define one SLI, SLO and SLA with numbers, plus PSI thresholds for retraining.",
  ],

  theory: [
    {
      title: "Five pillars of data observability",
      marks: 5,
      question: "A company's nightly ETL feeds compliance reports and ML models from a complaints-management system. Explain the five pillars of data observability with examples from such a system, and how each would be detected.",
      solution: `
### What the examiner wants
Each pillar defined, a concrete incident, a detection method, and why observability (not just data-quality rules) is needed.

### Model answer
**Data downtime** (partial, wrong, missing or late data) costs 140K–540K dollars per hour (slide 7). Observability watches pipeline **health in motion** across five pillars (slides 15–19):

| Pillar | Incident in the complaints system | Detection |
|---|---|---|
| **Freshness** | ETL failed silently; month-end reports used stale data | Alert when a table's last update is older than its SLO (e.g. 6 AM) |
| **Volume** | A bug loaded every record twice → double volume | Row-count anomaly vs historical baseline |
| **Schema** | Source changed a key column without telling the team behind 750 reports | Schema-change monitor (as at Mercari) |
| **Lineage** | Unknown downstream system reported an “ETL failure” | OpenLineage graph of producers and consumers |
| **Distribution** | Spike in API-channel complaints was test data loaded by a program | Statistical checks on mean/min/max/frequencies; PSI |

\`\`\`flow
OLTP complaints DB -> Incremental ETL -> OLAP warehouse -> Reports and ML
Observability layer -> Freshness, volume, schema, lineage, distribution checks -> Alert owner -> Root cause via lineage
\`\`\`

**Why observability, not only data quality (slide 21):** data-quality rules check known constraints on data at rest; observability uses **ML-based anomaly detection** across the **whole pipeline** to catch unknown unknowns and reduce **MTTR**. Tools: Monte Carlo, Databand, Soda Core, OpenLineage.`,
    },
    {
      title: "Data drift, concept drift and other ML failures",
      marks: 5,
      question: "Explain why ML failures are often silent, and describe data drift, concept drift, feature staleness and label mismatch with examples. How can each be detected?",
      solution: `
### Model answer
**Silent failures (slides 61–62):** an English→French translator that answers within 1 second meets its **operational** expectation; if the translation is wrong it violates the **ML performance** expectation, yet nothing crashes. Hence the need to observe model quality, not just uptime.

| Failure | Meaning | Example | Detection |
|---|---|---|---|
| **Data drift** | Input distribution changes; models can lose > 40% accuracy in a year | Customer behaviour shifts on an e-commerce site; winter-trained recommender in spring | PSI, KS test, JS divergence, Wasserstein on features |
| **Concept drift** | Input→target relationship changes | Definition of a fraudulent transaction evolves | Performance drop on fresh labels; compare error by segment |
| **Feature staleness** | Features out of date at prediction; fresh data ≠ fresh features | Stale cache, delayed joins, async updates, training-serving skew | Feature-age monitoring vs freshness SLO |
| **Label mismatch** | Wrong/inconsistent labels | Annotator errors, class imbalance, “NA” vs null, manipulation | Label audits, agreement rates, class-balance checks |

\`\`\`flow
Production inputs -> Compare with training distribution: PSI -> Drift? -> Check model metrics on new labels -> Concept drift? -> Root cause via lineage -> Retrain or fix pipeline
\`\`\`

**Root-cause classes (slides 70–73):** data issues (most common), model design (overfitting, fragility, feedback loops, wrong objective) and system/operations (offline-online mismatch, missing monitoring). **ML observability** explains the *why*, not just the *what* (slide 55).`,
    },
    {
      title: "Designing an ML observability framework",
      marks: 5,
      question: "Design an observability framework for a credit-risk model in production: what to measure at each layer, thresholds and retraining triggers, SLIs/SLOs/SLAs, and tools.",
      solution: `
### Model answer
**Four layers (slides 75–79):**

| Layer | Metrics for the credit model |
|---|---|
| Software | Latency, error rate, memory |
| Data | Missing-value rate, range violations, type mismatches, cardinality; **PSI / KS** per feature |
| Model | AUC-ROC, recall on defaulters (false negatives costly), calibration, **fairness** across groups |
| Business | Approval rate, default rate, losses |

**Thresholds (slide 80):** baseline at training; alert on a 5–10% F1/AUC drop; **PSI < 0.1** stable, **0.1–0.25** moderate, **> 0.25** act; **retrain** when PSI > 0.2 or performance drops.

**SLI → SLO → SLA (slides 86–88):**
- SLI: hours since the feature table was refreshed; model AUC on labelled loans.
- SLO: “99% of pipeline runs deliver data within 1 hour”; “AUC ≥ 0.80, else trigger retraining”.
- SLA: the commitment to meet the SLO a given share of time, and what happens if missed (incident ticket, fallback to the previous model).

\`\`\`flow
Data checks: freshness, volume, schema, PSI -> Model monitoring: AUC, recall, fairness, calibration -> Metadata: data, code, model versions and lineage -> Trigger: PSI above 0.2 or AUC below SLO -> Retrain, validate, register, deploy -> Data checks
\`\`\`

**Tools:** **Evidently** (drift and quality reports, logged to MLflow, run from Airflow), **Arize** (performance tracing, retraining triggers), **OpenTelemetry** (service metrics and traces), MLflow for versions and lineage. **Patterns:** structured logs with correlation IDs, golden-signal dashboards, severity-ranked actionable alerts.`,
    },
    {
      title: "Monitoring vs observability, and its role in DataOps",
      marks: 5,
      question: "Differentiate monitoring and observability for data and ML systems. Explain the observability maturity model and how data observability supports the DataOps cycle.",
      solution: `
### Model answer
| Monitoring | Observability |
|---|---|
| Predefined metrics | Metrics, logs, traces, lineage: ask new questions |
| *What* happened, *when* | *Why* and *how to fix* |
| Reactive, known unknowns | Proactive, unknown unknowns |
| Failure-centric | Whole-system understanding, even without an outage |

*ML example (slide 55):* monitoring detects that accuracy fell; observability compares distributions and indicators to show it was **concept drift** in one segment.

**Maturity model (slide 12):** L0 monitoring (component health) → L1 observability (why it fails: metrics, logs, traces) → L2 full-stack (MELT, topology-based RCA) → L3 intelligent (AI finds patterns, automated remediation) → L4 federated (any data to any consumer on demand).

**DataOps cycle (slides 46–48):**

\`\`\`flow
Detection: schema and row-level rule checks -> Awareness: centralized metadata, lineage across teams -> Iteration: data-as-code standards -> Detection
\`\`\`

Observability feeds every stage: it detects anomalies beyond known rules, makes upstream and downstream impact visible (Team A traces bad data to Team B), and drives repeatable improvements. **Benefits (slide 49):** better quality, less firefighting, faster insights, lower operational and legal risk.`,
    },
  ],

  quiz: [
    { q: "Observability, compared with monitoring, mainly answers:", options: ["What happened?", "Why it happened and where", "How much it costs", "Who wrote the code"], answer: 1, why: "Slide 11." },
    { q: "Month-end reports built on data from a failed ETL violate which pillar?", options: ["Volume", "Freshness", "Schema", "Lineage"], answer: 1, why: "Slide 15." },
    { q: "Every record loaded twice is caught by which pillar?", options: ["Volume", "Distribution", "Freshness", "Lineage"], answer: 0, why: "Slide 16." },
    { q: "Which pillar is described as data's GPS?", options: ["Schema", "Lineage", "Volume", "Freshness"], answer: 1, why: "Slide 18." },
    { q: "Data observability differs from data quality because it:", options: ["Focuses on data at rest with manual rules", "Watches the whole pipeline in motion with anomaly detection", "Only checks accuracy", "Ignores schema"], answer: 1, why: "Slide 21." },
    { q: "The four golden signals are:", options: ["Freshness, volume, schema, lineage", "Latency, traffic, errors, saturation", "Accuracy, precision, recall, F1", "CPU, RAM, disk, network"], answer: 1, why: "Slide 37." },
    { q: "High website traffic at 3 AM that would be normal at 3 PM is a:", options: ["Point anomaly", "Contextual anomaly", "Collective anomaly", "Schema anomaly"], answer: 1, why: "Slide 39." },
    { q: "Which is an open standard for collecting logs, metrics and traces?", options: ["OpenLineage", "OpenTelemetry", "Soda Core", "Monte Carlo"], answer: 1, why: "Slide 41." },
    { q: "The definition of a fraudulent transaction changes over time. This is:", options: ["Data drift", "Concept drift", "Feature staleness", "Label mismatch"], answer: 1, why: "Slide 65." },
    { q: "“Fresh data ≠ fresh features” refers to:", options: ["Concept drift", "Feature staleness", "Label noise", "Schema drift"], answer: 1, why: "Slide 66." },
    { q: "A model's predictions influence its future training data, reinforcing errors. This is:", options: ["Degenerate feedback loop", "Offline-online mismatch", "Calibration", "Underfitting"], answer: 0, why: "Slide 72." },
    { q: "Which metric is preferred for imbalanced classification?", options: ["Accuracy", "F1 score", "RMSE", "MAE"], answer: 1, why: "Slide 78." },
    { q: "A PSI of 0.3 indicates:", options: ["No change", "Moderate change", "Significant drift requiring action", "Perfect calibration"], answer: 2, why: "> 0.25 (slide 80)." },
    { q: "A target such as “99% of pipelines deliver data within 1 hour” is an:", options: ["SLI", "SLO", "SLA", "KPI only"], answer: 1, why: "Slide 88." },
    { q: "Monitoring whether retrieved RAG context's embeddings shift over time is:", options: ["Prompt drift", "Vector drift", "Label mismatch", "Volume check"], answer: 1, why: "Slide 89." },
  ],
};
