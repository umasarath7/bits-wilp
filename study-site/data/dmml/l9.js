// DMML — Lecture 9: Analytics Engineering
// Source: CourseFiles/DMML/L9-Analytics Engineering.pptx (91 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Analytics Engineering",
  source: "L9-Analytics Engineering.pptx · 91 slides",
  overview:
    "Lecture 7 brought data **in** (ingestion) and Lecture 8 checked it was **good**. This lecture is about turning that raw data into **trusted, analysis-ready tables**, the job of an *analytics engineer*. Think of a restaurant kitchen: groceries arrive (ingestion), they are washed and chopped (cleaning), cooked into dishes (business logic) and plated for customers (reporting tables). The lecture covers **data integration** (combining sources), the **six-step transformation process**, two layering patterns (**Medallion: Bronze → Silver → Gold**, and **dbt: staging → intermediate → marts**), **testing** transformations, **documenting** data models, **data versioning** (Git for data: DVC, lakeFS, Delta Lake…) and **lineage** for reproducible ML.",

  simpleIntro: "Think of a restaurant. Groceries arrive at the back door (**ingestion**, Lecture 7). Someone checks they're fresh (**validation**, Lecture 8). Now the kitchen must **wash, chop, cook and plate** them so customers get a finished dish. That kitchen work on data is **analytics engineering**: combining sources, cleaning and transforming them in tidy layers, testing the result, writing the recipe down, keeping old versions, and being able to say where every number came from.",

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
              "title": "Integrate",
              "text": "Bring data from every source together into **one trusted view**.",
              "tag": "Combine",
              "example": "Sales DB + CRM + ad platforms → one customer table"
            },
            {
              "title": "Transform in layers",
              "text": "Improve data step by step: **Bronze** (raw) → **Silver** (clean) → **Gold** (ready to use).",
              "tag": "Cook",
              "example": "dbt: staging → intermediate → marts"
            },
            {
              "title": "Test, document, version, trace",
              "text": "Check the logic is right, write it down, keep old copies, and track where data came from.",
              "tag": "Trust",
              "example": "DVC, lakeFS, Delta Lake; lineage tracker"
            }
          ]
        },
        {
          "type": "p",
          "text": "```flow\nSources -> Integrate -> Transform (Bronze -> Silver -> Gold) -> Test -> Document -> Version + Lineage -> Trusted analytics and ML\n```"
        }
      ]
    },
    {
      "id": "s-integ",
      "heading": "2. Ingestion vs integration: moving vs cooking",
      "slides": "4–15",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Ingestion",
            "Integration"
          ],
          "rows": [
            [
              "In one word",
              "**Move**",
              "**Combine + clean**"
            ],
            [
              "Restaurant",
              "Groceries delivered to the kitchen",
              "Groceries cooked into one meal"
            ],
            [
              "Improves quality?",
              "No",
              "Yes (merge, filter, clean)"
            ],
            [
              "Complexity",
              "Simple",
              "Complex (ETL, metadata, governance)"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "ETL or ELT?",
          "text": "**ETL:** cook **before** putting food in the fridge (transform, then load). **ELT:** put everything in the fridge first and cook **inside** the warehouse when needed. Modern cloud warehouses favour **ELT**."
        },
        {
          "type": "p",
          "text": "**Why integration is harder today:** many more sources (apps, IoT, APIs), people want data in **real time**, and everything is moving to the **cloud**. So integration must run **continuously and automatically**, not as a one-time project."
        },
        {
          "type": "check",
          "q": "A pipeline copies files from an S3 bucket into the lake every hour, without changing them. This is…",
          "options": [
            "Data integration",
            "Data ingestion",
            "Data normalization",
            "Reverse ETL"
          ],
          "answer": 1,
          "why": "Just moving data is ingestion."
        }
      ]
    },
    {
      "id": "s-types",
      "heading": "3. Seven ways to transform data",
      "slides": "16–26",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Type",
            "Plain meaning",
            "Example"
          ],
          "rows": [
            [
              "**Cleaning**",
              "Fix mistakes",
              "Remove duplicates, fill blanks, fix typos"
            ],
            [
              "**Standardization**",
              "Same units and formats",
              "lb → kg; one date format"
            ],
            [
              "**Aggregation**",
              "Summarise",
              "Daily sales → monthly"
            ],
            [
              "**Enrichment**",
              "Add extra info",
              "PIN code → city"
            ],
            [
              "**Integration**",
              "Merge sources",
              "CRM + billing"
            ],
            [
              "**Normalization**",
              "Remove repetition, one consistent form",
              "Phone numbers in one format"
            ],
            [
              "**Filtering**",
              "Keep only what you need",
              "Only 2025 orders"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**“Clean Students Always Eat In Nice Fields”**: Cleaning, Standardization, Aggregation, Enrichment, Integration, Normalization, Filtering."
        },
        {
          "type": "p",
          "text": "**The six-step process** for any transformation:"
        },
        {
          "type": "p",
          "text": "```flow\n1 Discovery: what do I have? -> 2 Mapping: which field goes where? -> 3 Logic: what rules? -> 4 Execution: run it -> 5 Validation: is it right? -> 6 Documentation and monitoring: keep it working\n```"
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**“Do My Laundry Every Valid Day”**: Discovery, Mapping, Logic, Execution, Validation, Documentation."
        }
      ]
    },
    {
      "id": "s-layers",
      "heading": "4. Layers: Medallion and dbt",
      "slides": "27–38",
      "blocks": [
        {
          "type": "p",
          "text": "**Analogy: a water filter with three stages.** Muddy water goes in (Bronze), the first filter removes dirt (Silver), the last makes it drinkable and bottled for customers (Gold). You never throw away the muddy water, because you may need to filter it again."
        },
        {
          "type": "table",
          "head": [
            "Layer",
            "What's in it",
            "Retail example"
          ],
          "rows": [
            [
              "🥉 **Bronze**",
              "Raw data, exactly as received (+ when it was loaded)",
              "Raw POS transactions"
            ],
            [
              "🥈 **Silver**",
              "Cleaned, de-duplicated, merged: one enterprise view",
              "One clean `customers` table"
            ],
            [
              "🥇 **Gold**",
              "Ready-to-use tables for a specific need",
              "`monthly_sales_by_store`"
            ],
            [
              "💎 **Platinum** (some firms)",
              "Gold + ML predictions",
              "Customer table with a churn score"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**dbt** (data build tool) does the same with SQL inside the warehouse (ELT):"
        },
        {
          "type": "p",
          "text": "```flow\nLanding (raw copy) -> Staging stg_: rename, cast types -> Intermediate int_: business logic -> Marts dim_ and fact_: ready for BI\n```"
        },
        {
          "type": "table",
          "head": [
            "dbt layer",
            "≈ Medallion"
          ],
          "rows": [
            [
              "Staging",
              "Bronze"
            ],
            [
              "Intermediate",
              "Silver"
            ],
            [
              "Marts",
              "Gold"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Fact vs dimension",
          "text": "**Fact** = an event with numbers (an order of 2 items worth ₹500). **Dimension** = who/what/when describes it (the customer, the product, the date)."
        },
        {
          "type": "check",
          "q": "Which layer would hold `monthly_revenue_by_region`, read directly by a dashboard?",
          "options": [
            "Bronze",
            "Silver",
            "Gold",
            "Landing"
          ],
          "answer": 2,
          "why": "Consumption-ready, project-specific tables live in Gold (marts)."
        }
      ]
    },
    {
      "id": "s-test",
      "heading": "5. Testing: did the recipe come out right?",
      "slides": "39–48",
      "blocks": [
        {
          "type": "p",
          "text": "A job can finish with **no errors** and still give **wrong numbers** (GST added twice, a join that drops customers). So we test the **logic**, in three steps:"
        },
        {
          "type": "list",
          "items": [
            "**Schema check:** right columns, right types, NOT NULL / UNIQUE / allowed values, every order's customer exists.",
            "**Contract check:** the producer and consumer agreed on the format; flag breaking changes.",
            "**Logic check:** business rules (“15% VAT only on category X”), compare source vs target, regression (old results unchanged), speed at real volumes."
          ],
          "ordered": true
        },
        {
          "type": "table",
          "head": [
            "Level",
            "Tests"
          ],
          "rows": [
            [
              "Unit",
              "One rule"
            ],
            [
              "Integration",
              "The whole pipeline end to end"
            ],
            [
              "Regression",
              "Today's output vs yesterday's"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's insurance exercise",
          "text": "Payouts depend on policy, location and history. Check sample payouts against **manually verified** ones, check **monthly totals**, run new fraud logic **in parallel** with production first. Result: zero payout errors, approvals 20% faster."
        }
      ]
    },
    {
      "id": "s-docs",
      "heading": "6. Writing the recipe down: data-model documentation",
      "slides": "49–57",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Model",
            "Like…",
            "Shows"
          ],
          "rows": [
            [
              "**Conceptual**",
              "An architect's sketch",
              "Big entities in business words (Customer places Order)"
            ],
            [
              "**Logical**",
              "The floor plan",
              "Entities, attributes, relationships"
            ],
            [
              "**Physical**",
              "The construction drawing",
              "Tables, data types, indexes"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Good documentation means **clarity, easier maintenance, faster onboarding, consistent definitions and better teamwork**. Tools: **dbt** (docs built in), **DataHub** (catalog + lineage + contracts), **Amundsen** (search for data, from Lyft)."
        }
      ]
    },
    {
      "id": "s-version",
      "heading": "7. Data versioning: an undo button for data",
      "slides": "58–80",
      "blocks": [
        {
          "type": "p",
          "text": "Code has Git. Data needs the same, because a model is only reproducible if you know **exactly which data** trained it."
        },
        {
          "type": "table",
          "head": [
            "Why?",
            "Plain meaning"
          ],
          "rows": [
            [
              "**Riskless testing**",
              "Try new data; if it's worse, go back"
            ],
            [
              "**Business performance**",
              "Compare this year's data with last year's"
            ],
            [
              "**Audit & compliance**",
              "Prove what data you had and when (GDPR)"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "How?",
            "Like…",
            "Catch"
          ],
          "rows": [
            [
              "**Full copy**",
              "Photocopying the whole book every day",
              "Wastes space"
            ],
            [
              "**valid_from / valid_to**",
              "Crossing out an old line and writing the new one below, with dates",
              "Only via query filters"
            ],
            [
              "**Tools** (Git for data)",
              "Track changes in Google Docs",
              "Learning curve"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Version names:** `3.2.4` = **big change . new feature . small fix**. Tools: **DVC** (Git-based), **lakeFS** (Git branches for a data lake), **Delta Lake** (time travel, ACID), **Dolt** (SQL database you can branch), **Git LFS** (big files as pointers), **Pachyderm**, **Neptune**."
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "Why: **RBA**: Riskless testing, Business performance, Audit. How: **copy → columns → tools**."
        },
        {
          "type": "check",
          "q": "A team wants Git-style branches and instant rollback over a petabyte data lake on S3. Best fit?",
          "options": [
            "Git LFS",
            "lakeFS",
            "Amundsen",
            "Full duplication"
          ],
          "answer": 1,
          "why": "lakeFS gives Git-like branching/commits over S3/GCS at petabyte scale."
        }
      ]
    },
    {
      "id": "s-lineage",
      "heading": "8. Lineage: the parcel-tracking page for data",
      "slides": "81–89",
      "blocks": [
        {
          "type": "p",
          "text": "**Data lineage** shows the full journey of a value: where it came from, which steps changed it, where it went. It works by **saving metadata at every step**."
        },
        {
          "type": "p",
          "text": "For ML, a **lineage tracker** remembers six things so you can **rebuild any past model exactly**:"
        },
        {
          "type": "p",
          "text": "```flow\nInfrastructure code + Data snapshot + Pipeline code + Feature list + Model code + Container image -> Lineage tracker -> Re-create the model at any point in time\n```"
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "*“If you can't explain the data that trained the model, you can't trust the model.”*"
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "9. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Ingestion moves, integration combines + cleans.** ETL = transform first; ELT = load first.\n- **7 transformations:** Clean, Standardize, Aggregate, Enrich, Integrate, Normalize, Filter.\n- **6 steps:** Discovery, Mapping, Logic, Execution, Validation, Documentation.\n- **Bronze raw → Silver clean → Gold ready** (Platinum = + ML). dbt: staging → intermediate → marts.\n- **Test:** schema → contract → logic; unit / integration / regression.\n- **Versioning:** why RBA; how copy → columns → tools; DVC, lakeFS, Delta Lake.\n- **Lineage** = tracking page for data; makes models reproducible."
        }
      ]
    }
  ],

  summary: [
    {
      id: "integration",
      heading: "Lesson 1: Why combine data at all? Data integration",
      slides: "4–15",
      blocks: [
        {
          type: "p",
          text: "A company's data lives in many places: the sales database, a CRM, ad platforms, files in S3. Each department sees only its own piece. **Data integration** *combines data of different types and formats from every source into a data lake or warehouse to give one unified fact base* (slide 5). The pay-off: better decisions, departments that agree on the numbers, and a better customer experience.",
        },
        {
          type: "callout",
          kind: "idea",
          title: "Ingestion vs integration: the simplest way to remember",
          text: "**Ingestion = moving** the groceries into the kitchen. **Integration = cooking** them into one meal. Ingestion is the simple first step of integration; integration adds cleaning, merging, transforming and governance (slides 6–8).",
        },
        {
          type: "table",
          caption: "Data ingestion vs data integration (slide 8)",
          head: ["Aspect", "Data ingestion", "Data integration"],
          rows: [
            ["**Definition**", "Collect and transfer data from sources to target storage for later processing", "Unify raw data from different sources, transform it, and load it into a warehouse or lake"],
            ["**Use**", "Consolidate data in a central repository", "Make high-quality, credible data available for analytics and reporting"],
            ["**Data quality**", "Doesn't automatically improve quality", "Improves quality through merging, filtering and other transformations"],
            ["**Complexity**", "Simpler pipelines", "More complex: cleansing, ETL, metadata management, governance"],
            ["**Skills**", "Little domain knowledge needed", "Skilled data engineers / ETL developers"],
          ],
        },
        {
          type: "p",
          text: "**ETL or ELT? (slide 6).** If data is transformed **before** it is stored, the process is **ETL** (extract, transform, load). If it is stored first and transformed **inside** the warehouse, it is **ELT**. Slide 7's picture shows both ideas together: OLTP, SaaS-API and S3 sources are **E**xtracted and **L**oaded into Bronze tables, then **T**ransformed into an integrated Silver table and an aggregated Gold table.",
        },
        {
          type: "p",
          text: "**Why it's harder today (slide 9).** Many more sources (IoT, APIs, cloud apps), real-time decisions that need data transformed *in flight*, DevOps teams expecting always-on self-service data, and the move to the cloud. Integration is no longer a one-off project but a **continuous** process that needs automation.",
        },
        {
          type: "table",
          caption: "What Gartner expects from data integration tools (slides 10–14)",
          head: ["Feature", "In plain words"],
          rows: [
            ["**Integration styles**", "Batch/bulk movement, replication and **CDC**, streaming, data virtualisation, with ready-made connectors"],
            ["**Transformation**", "Basic (string fixes, calculations), intermediate (merging, aggregation), advanced (parsing, text mining)"],
            ["**Augmentation**", "GenAI/ML that writes pipeline code and docs, detects anomalies, lets you query in natural language"],
            ["**Metadata management**", "Discover and share technical, operational and business metadata (catalogs, glossaries)"],
            ["**Governance**", "Quality, lineage, policy enforcement, masking"],
            ["**DataOps**", "Git for pipelines, automated testing, CI/CD"],
            ["**FinOps**", "Monitor and optimise the cost of integration workloads"],
            ["**AI-focused**", "Unstructured data, loading vector databases, **RAG**, the **Model Context Protocol**"],
          ],
        },
        {
          type: "p",
          text: "**Use cases (slide 11):** data engineering; delivering modern architectures (lakehouse, **data fabric**, **data mesh**, data products); **self-service** integration for analysts; **operational** integration (master data, partner data sharing); and supporting **AI projects** (chatbots, recommenders). Leaders in Gartner's 2025 quadrant (slide 15) include Informatica, Microsoft, Oracle, IBM, AWS, Google and Qlik.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Integration = combine + clean + transform into one trusted view. Ingestion only moves data. ETL transforms before loading; ELT after.",
        },
      ],
    },
    {
      id: "transform",
      heading: "Lesson 2: How does raw data become usable? Transformation types and the six-step process",
      slides: "16–26, 41–43",
      blocks: [
        {
          type: "p",
          text: "**Data transformation** *converts raw, unstructured or inconsistent data into clean, usable formats for analytics, reporting and ML* (slide 17). It sits between **ingest** and **destination**: Source → Ingest → **Stage (transform)** → Destination.",
        },
        {
          type: "table",
          caption: "The seven basic types (slide 18): match the type to what it does",
          head: ["Type", "What it does", "Everyday example"],
          rows: [
            ["**Cleaning**", "Remove duplicates, handle missing values, fix typos, validate formats", "Delete the second copy of a customer; check emails have an @"],
            ["**Standardization**", "Convert units, align date/time formats, harmonise names", "kg and lb → kg; “12/03/25” and “2025-03-12” → one format"],
            ["**Aggregation**", "Summarise detailed data into higher-level figures", "Daily sales → monthly totals"],
            ["**Enrichment**", "Add information from internal or external sources", "Add the city name from a PIN-code lookup"],
            ["**Integration**", "Combine data from several sources into one view", "CRM + billing → one customer table"],
            ["**Normalization**", "Structure data to reduce redundancy and improve integrity", "Phone numbers “617-359-2117” and “6173592117” → “(617)359-2117”"],
            ["**Filtering / selection**", "Keep only rows that meet conditions", "Only orders from 2025"],
          ],
        },
        {
          type: "table",
          caption: "More complex transformations (slides 42–43)",
          head: ["Type", "Example"],
          rows: [
            ["**Attribute construction**", "Build a new feature such as “Salary ROI” from Money-Paid and Products-Assembled"],
            ["**Discretization**", "Cut a continuous value into bins: ages 21–30, 31–40, 41–50"],
            ["**Generalization**", "Replace low-level values with broader categories (exact age → age group)"],
            ["**Smoothing**", "Remove spikes with moving averages"],
          ],
        },
        {
          type: "p",
          text: "**The six-step process (slides 19–25)** is the same whatever tool you use:",
        },
        {
          type: "table",
          head: ["Step", "Question it answers", "Example"],
          rows: [
            ["**1. Discovery**", "What data do I have? (profile structure, types, volumes, quality; gather metadata)", "Find that 8% of ages are blank"],
            ["**2. Data mapping**", "Which source field goes to which target field?", "CRM `first_name` → warehouse `customerFirstName`"],
            ["**3. Logic design**", "What rules reshape the data? (conditions, regex, date parsing, aggregations, SQL)", "Status ‘P’ → ‘pending’; parse dates"],
            ["**4. Execution**", "Run it as a batch or streaming job (ETL: before load; ELT: inside the warehouse; tools: dbt, Estuary Flow, Apache Beam)", "Nightly dbt run"],
            ["**5. Validation & testing**", "Is the output accurate, complete and in the right format? (quality checks, schema validation, row counts)", "Row count in = row count out"],
            ["**6. Documentation & monitoring**", "Is it documented, and does it keep working? (failures, schema drift, unexpected inputs: observability)", "Alert when a column disappears"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook: “Do My Laundry Every Valid Day”",
          text: "**D**iscovery → **M**apping → **L**ogic → **E**xecution → **V**alidation → **D**ocumentation & monitoring.",
        },
      ],
    },
    {
      id: "patterns",
      heading: "Lesson 3: How should transformations be organised? Medallion and the dbt layers",
      slides: "27–38",
      blocks: [
        {
          type: "p",
          text: "**Pattern = a proven answer to a problem that keeps coming back** (slide 28). Doctors see the same fever symptoms in an area (problem pattern) and prescribe a similar combination of medicines (solution pattern). Data teams have patterns too, and two are central here.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Medallion architecture (slides 29–31)",
          text: "A **data design pattern for a lakehouse** that improves data **step by step** as it moves through layers, also called a **multi-hop** architecture.\n- 🥉 **Bronze (raw):** land source data **as-is**, plus load-time metadata. Purpose: fast CDC, a historical archive, lineage, auditability, reprocessing without re-reading the source.\n- 🥈 **Silver (cleansed & conformed):** match, merge, de-duplicate and clean **“just enough”** to give an **enterprise view** of key entities (master customers, stores, transactions).\n- 🥇 **Gold (curated):** **consumption-ready, project-specific**, de-normalised, read-optimised tables with few joins: customer analytics, product quality, recommendations, sales.",
        },
        {
          type: "p",
          text: "```flow\nSources -> Bronze: raw, as-is -> Silver: cleaned, merged -> Gold: business-ready -> BI, ML, reports\n```",
        },
        {
          type: "p",
          text: "**ELT with dbt (slides 32–37).** **dbt** (data build tool) manages transformations **inside the warehouse**: extract and load raw data first, then transform it with SQL models. Its layers:",
        },
        {
          type: "table",
          caption: "The dbt layers (slides 34–37)",
          head: ["Layer", "Models", "Structure", "Transformations", "Purpose"],
          rows: [
            ["**Landing** (raw/source)", "—", "1:1 copy of source tables", "None", "Entry point for data"],
            ["**Staging**", "`stg_*`", "Usually 1:1 with sources; **no joins**", "Light: type casting, renaming, removing deleted rows", "Clean, standard building blocks"],
            ["**Intermediate**", "`int_*`", "Built on staging", "Heavier: aggregations, business logic, CASE, window functions", "Bridge from clean data to facts"],
            ["**Marts**", "`dim_*`, `fact_*`", "Joins/unions of facts, dims and intermediates", "No new logic, just assembling", "Dimensional model for analytics"],
          ],
        },
        {
          type: "p",
          text: "**Model contracts** guard the entry and exit of the dbt project, and marts feed **BI** and **reverse ETL** (slide 33). Slide 38 maps the two patterns: **staging ≈ Bronze, intermediate ≈ Silver, marts ≈ Gold**. A few organisations add a **Platinum** layer: Gold data enriched with **AI/ML predictions**.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Facts vs dimensions in one line",
          text: "**Fact** = something that happened, with numbers (an order: quantity, amount). **Dimension** = the context that describes it (customer, product, date). Dimensions change slowly; facts keep growing.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Bronze raw → Silver clean → Gold business-ready (→ Platinum with ML). dbt: landing → stg_ → int_ → dim_/fact_ marts.",
        },
      ],
    },
    {
      id: "testing",
      heading: "Lesson 4: How do we know a transformation is right? Testing",
      slides: "39–48",
      blocks: [
        {
          type: "p",
          text: "A transformation can run without errors and still be **wrong**: a currency converted twice, a join that drops rows, a date read as MM/DD instead of DD/MM. **Transformation testing** checks the *correctness of the transformation logic itself* (slide 40).",
        },
        {
          type: "list",
          items: [
            "**What to test (slide 41):** type conversions, string manipulations, date/time conversions, aggregations, normalization, filtering, enrichment/lookups, null handling, splitting/merging, error and outlier handling.",
          ],
        },
        {
          type: "table",
          caption: "Suggested steps (slides 46–47)",
          head: ["Step", "Checks"],
          rows: [
            ["**1. Schema validation**", "Required columns present (and no unexpected ones); correct data types (age is an integer); constraints (NOT NULL, UNIQUE, ACCEPTED VALUES such as pending/accepted/failed); **referential integrity** (every order's customer exists); naming conventions"],
            ["**2. Contract validation**", "Producer–consumer **data contracts**; breaking vs non-breaking changes; versioned schemas"],
            ["**3. Transformation validation**", "**Business rules** (“15% VAT only on category X”); **source-to-target** checks; profiling after transformation; **regression** tests (new logic doesn't break old rules); **performance** tests at scale"],
          ],
        },
        {
          type: "table",
          caption: "Three levels of testing (slide 48)",
          head: ["Level", "Scope", "Example"],
          rows: [
            ["**1. Unit**", "One transformation", "dbt generic and singular tests (`not_null`, `unique`)"],
            ["**2. Integration**", "Several transformations / the end-to-end pipeline", "Raw orders → mart totals match"],
            ["**3. Regression**", "Compare with historical outputs", "Last month's revenue unchanged after a refactor"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Exercise (slide 45): an insurance company",
          text: "Millions of claims; payouts depend on policy type, location and claim history. Tests: verify each payout calculation against **manually verified samples**; check monthly **aggregated** payout totals; run new **fraud-detection** logic **in parallel** with production to make sure it creates no false positives. Result in the slide's story: **zero payout errors and 20% faster approvals**.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Best practices (slide 44)",
          text: "Document every rule in a **mapping sheet** (source field → logic → target field) · **automate** validation · test at **realistic volumes** · keep logic in **Git** · test **edge cases** (missing data, extremes, special characters).",
        },
      ],
    },
    {
      id: "docs",
      heading: "Lesson 5: Why document data models? Conceptual, logical, physical",
      slides: "49–57",
      blocks: [
        {
          type: "p",
          text: "Data-model documentation includes **diagrams, table definitions, usage scenarios and design notes**: what the data is, how it is organised and **why** decisions were made (slide 50). Benefits (slide 51): **clarity** for technical and business people, **easier maintenance**, **faster onboarding**, **consistent use** of definitions, **better collaboration**.",
        },
        {
          type: "table",
          caption: "Three levels of data model (slide 52): from napkin sketch to blueprint",
          head: ["Model", "Detail", "Built by", "Contains"],
          rows: [
            ["**Conceptual**", "Highest level", "Business stakeholders", "Main entities and rules in business terms (Customer places Order)"],
            ["**Logical**", "More detail", "Data architects + business analysts", "Entities, attributes, relationships; becomes the schema design"],
            ["**Physical**", "Most detailed", "Database developers", "Tables, data types, indexes, access methods"],
          ],
        },
        {
          type: "table",
          caption: "Popular tools (slides 53–55)",
          head: ["Tool", "Strength"],
          rows: [
            ["**dbt**", "Version control, modular reusable SQL models, built-in documentation"],
            ["**DataHub**", "Data catalog: discovery, lineage, profiling, data contracts, governance"],
            ["**Amundsen** (from Lyft)", "Search-based data discovery with in-line metadata and popularity ranking"],
          ],
        },
      ],
    },
    {
      id: "versioning",
      heading: "Lesson 6: Why keep old versions of data? Data versioning",
      slides: "58–80",
      blocks: [
        {
          type: "p",
          text: "**Data versioning** *stores versions of data created or changed at specific points in time* (slide 60). Code has Git; data needs the same, because a model is only reproducible if you know **exactly which data** trained it.",
        },
        {
          type: "table",
          caption: "Three reasons (slides 59, 61–62)",
          head: ["Benefit", "In plain words"],
          rows: [
            ["**Riskless testing**", "Try a new dataset; if it fails, reload the old working version, with no loss of business"],
            ["**Measuring business performance**", "Keep each year's sales data to study changing customer trends"],
            ["**Compliance & audit**", "Show auditors exactly what data existed when; regulations such as **GDPR** require keeping some data; versions also help detect fraud"],
          ],
        },
        {
          type: "p",
          text: "**Naming versions (slides 63–64).** Avoid `File_Final_v2_REAL`. Use **semantic versioning** `MAJOR.MINOR.PATCH`, e.g. **3.2.4**: 3 = significant (breaking) change, 2 = new compatible features, 4 = minor fixes. You can also name by **status** (cleaned/uncleaned, complete/incomplete) or by the **last process** applied (normalised).",
        },
        {
          type: "table",
          caption: "Manual files or a tool? (slide 65)",
          head: ["Option", "Suits"],
          rows: [
            ["**File versioning** (save copies yourself)", "Small teams in one place; highly sensitive data seen by few people; individual work"],
            ["**Tool-based** (DVC, Delta Lake, Pachyderm…)", "Many people editing at once; teams in different locations; **accountability** (who changed what, where errors entered)"],
          ],
        },
        {
          type: "table",
          caption: "Three implementation approaches (slides 66–69)",
          head: ["Approach", "How", "Pros", "Cons"],
          rows: [
            ["**1. Full duplication**", "Save a full copy under a new location each time", "Easiest start (“something is better than nothing”)", "Least space-efficient; dates hard-coded in queries, error-prone"],
            ["**2. valid_from / valid_to metadata**", "Never overwrite a row: append the new row and set the old row's `valid_to`", "Space-efficient; “time travel” within one table", "Only way to see versions is filtering on those columns"],
            ["**3. Tooling (Git for data)**", "Treat versions as first-class: lakeFS, DVC, Git LFS", "No copies of unchanged data; create/delete/compare versions; any scale and format", "Learning curve, tool choice"],
          ],
        },
        {
          type: "p",
          text: "**Challenges (slides 70–71):** **storage cost** (every version takes space, so balance frequency against cost), **security** (more copies = more risk of leakage, especially in the cloud) and **choosing a provider** (open source?, storage capacity, user-friendly?, supported clouds, cost). **Choosing a tool (slide 73):** support for your data type (video, audio, tables), ease of use, **diff/compare**, fit with your stack, and whether your **team will adopt it**.",
        },
        {
          type: "table",
          caption: "Seven tools (slides 74–80)",
          head: ["Tool", "One-line identity"],
          rows: [
            ["**Neptune.ai**", "Experiment tracker; versions datasets/models as artifacts (hash, location, folder structure, size)"],
            ["**Pachyderm**", "Version-controlled data-science platform; branches, transactional commits, **provenance** for full audit trails"],
            ["**DVC**", "Open-source, storage-agnostic, runs on top of **Git**; pipelines as DAGs; tracks metrics and failed attempts"],
            ["**Git LFS**", "Replaces large files in Git with **text pointers**; contents live on a remote server"],
            ["**Dolt**", "A **SQL database** you can fork, clone, branch, merge, push and pull like Git (MySQL-compatible)"],
            ["**lakeFS**", "Git-like branches and commits over S3/GCS at **petabyte** scale; isolated, atomic, ACID changes and instant rollback"],
            ["**Delta Lake**", "Storage layer for data lakes: **ACID** transactions, schema enforcement, batch + streaming, **time travel** and rollbacks"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "Versioning = **R**iskless testing, **B**usiness performance, **A**udit (“RBA”). Approaches: **copy → columns → tools**.",
        },
      ],
    },
    {
      id: "lineage",
      heading: "Lesson 7: Where did this number come from? Lineage and reproducibility",
      slides: "81–89",
      blocks: [
        {
          type: "p",
          text: "**Data lineage** *tracks and visualises data's journey from source to its current location, and every change along the way* (slide 82): where a value came from, when it was split or merged, and which transformations touched it. It works by **collecting metadata at every step** into a **metadata repository** (slide 83). Think of a parcel tracking page, but for data.",
        },
        {
          type: "p",
          text: "**Lineage for ML (slides 84–88).** In the AWS ML architecture a **lineage tracker** collects references to every traceable change so you can **re-create the ML environment at any point in time**. Its six components:",
        },
        {
          type: "table",
          head: ["Component", "How its history is kept"],
          rows: [
            ["**Infrastructure as code (IaC)**", "Commit IaC changes to a version-controlled repo (also prevents configuration drift)"],
            ["**Data**", "Commit schema/metadata changes or archive a database snapshot; store data in a lake, its location in config"],
            ["**Implementation code**", "Commit to version control"],
            ["**Model feature list**", "Feature store keeps features and their past versions, or archive a feature-list snapshot"],
            ["**Model algorithm code**", "Commit to version control"],
            ["**Model container image**", "Push versions to a container registry"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Lineage for training data (slide 89)",
          text: "*“If you can't explain the data that trained the model, you can't trust the model.”* Track: **data origin and transformations**, **code and hyperparameters** (Git), **model artifacts** with metrics, **deployment and usage**. Result: **reproducibility**: if production breaks, you can rebuild the last good version.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "idea",
      title: "In one line",
      text: "Integrate sources, transform them in tested layers (Bronze → Silver → Gold / stg → int → marts), document, version and trace everything.",
    },
    {
      type: "list",
      items: [
        "**Ingestion** moves data; **integration** combines + cleans + transforms it. ETL transforms before loading, ELT after.",
        "**7 transformation types:** cleaning, standardization, aggregation, enrichment, integration, normalization, filtering.",
        "**6 steps:** discovery → mapping → logic design → execution → validation & testing → documentation & monitoring.",
        "**Medallion:** Bronze (raw, as-is) → Silver (cleaned, conformed) → Gold (business-ready) (→ Platinum with ML).",
        "**dbt:** landing → staging `stg_` (light) → intermediate `int_` (business logic) → marts `dim_`/`fact_`.",
        "**Testing:** schema → contract → transformation (business rules, source-to-target, regression, performance); unit / integration / regression levels.",
        "**Models:** conceptual (business) → logical (entities, attributes) → physical (types, indexes). Tools: dbt, DataHub, Amundsen.",
        "**Versioning:** why = riskless testing, business performance, audit; how = full copy, valid_from/valid_to, tools (DVC, lakeFS, Delta Lake, Dolt, Git LFS, Pachyderm, Neptune).",
        "**Lineage:** metadata at every step → reproduce any model (IaC, data, code, features, algorithm, container image).",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: Medallion vs dbt layers with a diagram · ingestion vs integration · data versioning approaches and tools · testing transformations for a scenario.",
    },
  ],

  glossary: [
    ["Analytics engineering", "—", "Turning raw data into tested, documented, analysis-ready models"],
    ["Data integration", "—", "Combining data from many sources into one unified, trusted view"],
    ["Data ingestion", "—", "Moving data from sources into storage"],
    ["ETL / ELT", "Extract-Transform-Load / Extract-Load-Transform", "Transform before vs after loading into the warehouse"],
    ["CDC", "Change Data Capture", "Capturing only the rows that changed in a source"],
    ["Data virtualization", "—", "Querying data where it lives without copying it"],
    ["Data fabric / data mesh", "—", "Architectures for connecting distributed data (central fabric vs domain-owned mesh)"],
    ["RAG", "Retrieval-Augmented Generation", "LLM answers grounded on retrieved documents"],
    ["MCP", "Model Context Protocol", "A standard interface for connecting AI models to tools and data"],
    ["FinOps", "Financial operations", "Monitoring and optimising cloud spend"],
    ["Medallion architecture", "Multi-hop architecture", "Bronze (raw) → Silver (clean) → Gold (curated) layers"],
    ["Lakehouse", "—", "A data lake with warehouse features (ACID, schema)"],
    ["dbt", "data build tool", "SQL-based framework for transformations inside the warehouse"],
    ["stg_ / int_ / dim_ / fact_", "Staging / intermediate / dimension / fact models", "dbt naming for its layers"],
    ["Fact / dimension", "—", "Measurable events / descriptive context (customer, product, date)"],
    ["Reverse ETL", "—", "Sending warehouse data back into operational tools"],
    ["Data contract", "—", "Agreement between data producer and consumer on schema and quality"],
    ["Referential integrity", "—", "Every reference (e.g. customer ID) points to an existing record"],
    ["Regression test", "—", "Checks that new logic doesn't change previously correct outputs"],
    ["Conceptual / logical / physical model", "—", "Business view → entities & attributes → implementation details"],
    ["Data catalog", "—", "Searchable inventory of datasets with metadata (DataHub, Amundsen)"],
    ["Data versioning", "—", "Keeping versions of data from specific points in time"],
    ["Semantic versioning", "MAJOR.MINOR.PATCH", "e.g. 3.2.4: breaking change . new features . fixes"],
    ["valid_from / valid_to", "—", "Columns marking when each row version was current"],
    ["DVC", "Data Version Control", "Open-source Git-based versioning for data and ML pipelines"],
    ["Git LFS", "Git Large File Storage", "Large files replaced by pointers in Git"],
    ["ACID", "Atomicity, Consistency, Isolation, Durability", "Guarantees of reliable transactions"],
    ["Provenance", "—", "Record of where data came from and how it was produced"],
    ["Data lineage", "—", "Tracking data's journey and transformations from source to use"],
    ["IaC", "Infrastructure as Code", "Infrastructure defined in version-controlled code"],
    ["Feature store", "—", "Central store of ML features and their versions"],
  ],

  examTips: [
    "For layering questions, **draw the flow** (Sources → Bronze → Silver → Gold → consumers) and give one example table per layer.",
    "When asked to compare ingestion and integration, use the five aspects: definition, use, quality, complexity, skills.",
    "For versioning, give **why** (3 reasons), **how** (3 approaches with pros/cons) and **one tool** with its distinguishing feature.",
    "For testing questions, structure as schema → contract → transformation validation, then unit / integration / regression levels, with a scenario example.",
  ],

  theory: [
    {
      title: "Medallion architecture and the dbt layers",
      marks: 5,
      question: "A retail company lands raw data from its POS database, a CRM and ad platforms into a lakehouse. Explain how the Medallion architecture organises this data and how it maps to the dbt layering pattern. Use a diagram.",
      solution: `
### What the examiner wants
The purpose of each layer, what happens to the data in each, how Medallion maps to dbt, and a concrete retail example. A diagram is worth marks.

### Model answer
**Idea:** the Medallion (multi-hop) architecture is a data design pattern for a lakehouse that **improves structure and quality step by step** as data flows from Bronze to Silver to Gold (slide 29).

\`\`\`flow
POS DB + CRM + Ad APIs -> Bronze: raw tables as-is + load metadata -> Silver: cleaned, de-duplicated, conformed customers and orders -> Gold: sales_by_store, customer_ltv, campaign_roi -> BI dashboards, ML models, reverse ETL
\`\`\`

| Layer | What happens | Retail example |
|---|---|---|
| **Bronze** (raw) | Source structures kept **as-is**, plus load time/process ID; fast CDC, historical archive, lineage, reprocessing without re-reading the source | \`pos_transactions_raw\`, \`crm_contacts_raw\` |
| **Silver** (cleansed, conformed) | Match, merge, de-duplicate, clean **“just enough”**: an enterprise view of key entities | One \`customers\` table merging CRM and POS IDs; de-duplicated \`orders\` |
| **Gold** (curated) | Project-specific, **de-normalised, read-optimised**, few joins; final business rules | \`monthly_sales_by_store\`, \`customer_segments\` |

**Mapping to dbt (slides 32–38):** dbt follows **ELT**: load raw data first, transform inside the warehouse with SQL models.
- **Landing / staging (\`stg_*\`) ≈ Bronze:** 1:1 with sources; light changes only (casting, renaming); **no joins**.
- **Intermediate (\`int_*\`) ≈ Silver:** business logic, aggregations, window functions.
- **Marts (\`dim_*\`, \`fact_*\`) ≈ Gold:** joins into a dimensional model for analytics; feeds BI and reverse ETL.
- Some organisations add **Platinum**: Gold data enriched with ML predictions (e.g. churn score per customer).

**Why it helps:** raw data is never lost (reprocess from Bronze), quality improves predictably, each layer can be **tested** (dbt tests, model contracts), and consumers always read trusted Gold tables.

### Takeaway
Bronze = keep everything, Silver = make it correct, Gold = make it useful.`,
    },
    {
      title: "Data ingestion vs data integration",
      marks: 5,
      question: "Distinguish data ingestion from data integration. Why has data integration become harder for modern enterprises, and what features should a modern integration tool offer?",
      solution: `
### Model answer
**Ingestion** collects and transfers data from sources to target storage for later processing. **Integration** unifies data from different sources, **transforms** it and loads it into a warehouse or lake to give one trusted fact base (slides 5–8).

| Aspect | Ingestion | Integration |
|---|---|---|
| Purpose | Consolidate in a central store | High-quality data for analytics and reporting |
| Quality | Not improved automatically | Improved by merging, filtering, cleaning |
| Complexity | Simpler | Cleansing, ETL, metadata, governance |
| Skills | Less domain knowledge | Skilled data/ETL engineers |

\`\`\`flow
OLTP DB, SaaS API, S3 -> Ingest (E, L) -> Bronze tables -> Transform (T) -> Integrated Silver table -> Aggregated Gold table
\`\`\`

**Why harder today (slide 9):** an explosion of sources (IoT, APIs, cloud apps); **real-time** decisions needing data transformed in flight; DevOps teams expecting always-on, self-service data; migration to the **cloud** beyond the corporate data centre; integration is now **continuous** and must be automated.

**Features of a modern tool (Gartner, slides 12–14):** multiple styles (batch, replication/CDC, streaming, virtualisation) with connectors; basic-to-advanced transformations; **augmentation** with GenAI/ML; **metadata management**; **governance** (quality, lineage, masking); **DataOps** (Git, automated tests, CI/CD); **FinOps** (cost control); **AI-focused** support (unstructured data, vector databases, RAG, MCP).

**Example:** a bank ingests card transactions every minute (ingestion), then integrates them with the customer master and merchant data to build a fraud-feature table (integration).`,
    },
    {
      title: "Data versioning: why, how and which tool",
      marks: 5,
      question: "An ML team retrains a credit model monthly and must answer auditors' questions about which data each model used. Explain why data versioning is needed, the implementation approaches, and suggest suitable tools.",
      solution: `
### Model answer
**Data versioning** stores versions of data created or changed at specific points in time (slide 60).

**Why (slides 59–62):**
1. **Riskless testing:** try a new dataset; if the model gets worse, reload the previous working version.
2. **Measuring business performance:** compare data across years (e.g. changing customer trends).
3. **Compliance & audit:** prove exactly which data trained each model; regulations like **GDPR** require keeping some data; easier fraud detection.

**How (slides 66–69):**

| Approach | How it works | Trade-off |
|---|---|---|
| Full duplication | Copy the whole dataset each month to a new location | Easy, but wasteful and error-prone (dates hard-coded) |
| valid_from / valid_to | Append changed rows; close the old row's \`valid_to\` | Space-efficient time travel; only via query filters |
| Tooling | Git-like versions as first-class objects | No duplicate storage, compare/rollback, any scale |

**Naming:** semantic versions (e.g. **2.1.0** = new compatible features) or status/process names.

\`\`\`flow
Raw data snapshot v1.0 -> DVC/lakeFS commit + Git commit of code -> Train model -> Registry links model to data hash -> Auditor query: which data? -> Checkout exact version
\`\`\`

**Tools for this team:** **DVC** (on top of Git, links data + code + metrics per experiment), **lakeFS** (branches/commits over S3 at petabyte scale, instant rollback) or **Delta Lake** (time travel, ACID, audit history). **Dolt** suits versioned SQL tables.

**Challenges:** storage cost (balance frequency vs cost), security of many copies, choosing the right provider (open source, capacity, cloud support, cost).`,
    },
    {
      title: "Testing data transformations",
      marks: 5,
      question: "An insurance company computes claim payouts from policy type, location and claim history. Describe how you would test these transformations.",
      solution: `
### Model answer
**Transformation testing** checks the correctness of the transformation logic itself, not just that the job ran (slide 40).

**Step 1: schema validation (slide 46).** Required columns present, correct types (payout is numeric, claim_date is a date), constraints (NOT NULL policy_id, status in {pending, approved, rejected}), **referential integrity** (every claim's policy exists), naming conventions.

**Step 2: contract validation.** The claims system (producer) and payout pipeline (consumer) agree on a **data contract**; detect breaking vs non-breaking changes; versioned schemas.

**Step 3: transformation validation (slide 47).**
- **Business rules:** e.g. “cap payout at the sum insured”, “location factor applies to flood zones only”.
- **Source-to-target:** recompute a sample of payouts and compare with **manually verified** results.
- **Profiling after transformation:** payout distributions and ranges look normal.
- **Regression:** new fraud logic doesn't change existing payout rules; run new logic **in parallel** with production first.
- **Performance:** millions of claims finish within the batch window.

**Levels (slide 48):** unit (one rule, e.g. dbt tests), integration (full pipeline → monthly totals match ledger), regression (compare against last month's outputs).

\`\`\`flow
Claims data -> Schema & contract checks -> Payout transformations -> Rule + sample + aggregate tests -> Parallel run vs production -> Release
\`\`\`

**Best practices (slide 44):** mapping sheet for every rule, automated tests, production-scale volumes, logic in Git, edge cases (missing history, extreme claims). Slide 45's story: **zero payout errors and 20% faster approvals**.`,
    },
  ],

  quiz: [
    { q: "Which statement best describes data integration compared with ingestion?", options: ["It only moves data", "It combines, cleans and transforms data into a unified view", "It never uses ETL", "It needs no skills"], answer: 1, why: "Ingestion moves; integration unifies and transforms (slide 8)." },
    { q: "Transforming data after loading it into the warehouse is called:", options: ["ETL", "ELT", "CDC", "Reverse ETL"], answer: 1, why: "Extract, Load, then Transform (slide 6)." },
    { q: "Converting pounds to kilograms and aligning date formats is:", options: ["Enrichment", "Standardization", "Aggregation", "Filtering"], answer: 1, why: "Slide 18." },
    { q: "In the Medallion architecture, which layer keeps source data as-is?", options: ["Gold", "Silver", "Bronze", "Platinum"], answer: 2, why: "Bronze = raw landing with load metadata (slide 30)." },
    { q: "Which dbt layer applies business logic such as aggregations and window functions?", options: ["Staging", "Intermediate", "Marts", "Landing"], answer: 1, why: "int_* models (slide 36)." },
    { q: "Staging models in dbt should:", options: ["Join many tables", "Do light changes like casting and renaming, 1:1 with sources", "Hold ML predictions", "Contain no columns"], answer: 1, why: "Slide 35." },
    { q: "Comparing new outputs with historical outputs to detect unintended changes is:", options: ["Unit testing", "Integration testing", "Regression testing", "Schema validation"], answer: 2, why: "Level 3 (slide 48)." },
    { q: "A data model built by DB developers with data types and indexes is:", options: ["Conceptual", "Logical", "Physical", "Semantic"], answer: 2, why: "Slide 52." },
    { q: "In data version 3.2.4, the ‘3’ indicates:", options: ["A minor bug fix", "New compatible features", "A significant change", "The day of the month"], answer: 2, why: "MAJOR.MINOR.PATCH (slide 64)." },
    { q: "Appending new rows and closing the old row's valid_to field is which versioning approach?", options: ["Full duplication", "Valid from/to metadata", "Tooling", "Git LFS"], answer: 1, why: "Slide 68." },
    { q: "Which tool is a SQL database you can branch and merge like Git?", options: ["Dolt", "Amundsen", "Neptune", "DataHub"], answer: 0, why: "Slide 78." },
    { q: "Which tool brings ACID transactions, schema enforcement and time travel to data lakes?", options: ["Git LFS", "Delta Lake", "Amundsen", "dbt"], answer: 1, why: "Slide 80." },
    { q: "Data lineage works mainly by:", options: ["Deleting old data", "Collecting metadata at each processing step", "Encrypting data", "Training models"], answer: 1, why: "Metadata repository (slide 83)." },
  ],
};
