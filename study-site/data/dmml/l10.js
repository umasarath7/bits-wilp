// DMML — Lecture 10: Workflow Orchestration and Automation
// Source: CourseFiles/DMML/L10-Workflow Orchestration and Automation.pptx (77 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Workflow Orchestration & Automation",
  source: "L10-Workflow Orchestration and Automation.pptx · 77 slides",
  overview:
    "Five pipelines can be run by hand. Five hundred cannot. This lecture is about the **conductor** that runs them: an **orchestrator** decides **what runs, in which order, when, and what happens if something fails**. It starts with why manual pipelines break at scale (slides 4–12), separates **orchestration** from **choreography**, **automation**, **data pipelines** and **workflows** (slides 13–21), then teaches the core ideas: **DAGs, tasks, operators, sensors, dependencies, scheduler, executor, logging, SLAs, retries** (slides 22–31). It surveys the tools (**Airflow, Prefect, Dagster, Argo, Kubeflow**…, slides 32–42), designs an orchestrated ML workflow and an AWS case study (slides 43–50), shows how orchestration powers **DataOps** (CI/CD, automation, observability, slides 51–58), and ends with best practices, above all **idempotent and atomic tasks** (slides 60–75).",

  simpleIntro: "Picture an orchestra. Fifty musicians, each excellent, but without a **conductor** they'd start at different times and drown each other out. A company's data pipelines are the musicians: extract here, transform there, train a model, send a report. **Orchestration** is the conductor: it decides **what runs, in which order, at what time, and what to do when something goes wrong**. Airflow is the most famous conductor.",

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
              "title": "Why",
              "text": "By hand, 5 pipelines are fine; 500 are chaos: forgotten steps, wrong order, no record, messy fixes.",
              "tag": "The problem",
              "example": "Reports every day + ML every 30 minutes"
            },
            {
              "title": "What",
              "text": "A **DAG**: boxes (tasks) joined by one-way arrows (dependencies), with no loops.",
              "tag": "The plan",
              "example": "ingest → validate → transform → train → deploy"
            },
            {
              "title": "How",
              "text": "An orchestrator (Airflow, Prefect, Dagster…) schedules, runs, retries, logs and alerts.",
              "tag": "The conductor",
              "example": "Netflix runs thousands of tasks on Airflow"
            }
          ]
        }
      ]
    },
    {
      "id": "s-why",
      "heading": "2. Why manual pipelines break",
      "slides": "4–12",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Problem",
            "Everyday picture"
          ],
          "rows": [
            [
              "**Time**",
              "One person can't press 500 buttons every morning"
            ],
            [
              "**Dependencies**",
              "“Run C only after A and B finish”: someone always forgets"
            ],
            [
              "**Compliance gaps**",
              "No record of who ran what, when, with which settings"
            ],
            [
              "**Error recovery**",
              "Each person fixes failures their own way"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "Manual pipelines fail on **T-D-C-E**: Time, Dependencies, Compliance, Error recovery."
        },
        {
          "type": "p",
          "text": "Orchestration fixes this and gives **Efficiency, Reliability, Scalability, Flexibility and Monitoring**."
        }
      ]
    },
    {
      "id": "s-words",
      "heading": "3. Similar words, different meanings",
      "slides": "13–21",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Pair",
            "Simple difference"
          ],
          "rows": [
            [
              "**Orchestration vs choreography**",
              "Orchestra with a **conductor** vs dancers **reacting to each other** (no central control, harder to debug)"
            ],
            [
              "**Automation vs orchestration**",
              "One machine doing **one task** (password reset) vs a manager **connecting many tasks** into a full process (access request: check → update → notify → confirm)"
            ],
            [
              "**Data pipeline vs workflow**",
              "Pipeline **moves and transforms data**; workflow is the **whole process**, including decisions and human approvals"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Services A, B, C, D call each other directly, with no central controller. This is…",
          "options": [
            "Orchestration",
            "Choreography",
            "Automation",
            "A DAG"
          ],
          "answer": 1,
          "why": "No conductor, point-to-point calls: choreography."
        }
      ]
    },
    {
      "id": "s-dag",
      "heading": "4. The DAG: a recipe card for the conductor",
      "slides": "22–31",
      "blocks": [
        {
          "type": "p",
          "text": "**D**irected: arrows have one direction, so the order is clear. **A**cyclic: no going round in circles (else the pipeline never ends). **G**raph: boxes and arrows."
        },
        {
          "type": "p",
          "text": "```flow\nIngest orders -> Validate -> Transform -> Train model -> Deploy\nIngest customers -> Validate\n```"
        },
        {
          "type": "table",
          "head": [
            "Part",
            "Job",
            "Analogy"
          ],
          "rows": [
            [
              "**Task / operator**",
              "Does one piece of work",
              "A musician playing"
            ],
            [
              "**Sensor**",
              "**Waits** for a file, time or event",
              "A musician waiting for the cue"
            ],
            [
              "**Scheduler**",
              "Decides **when** each task may start",
              "The conductor's baton"
            ],
            [
              "**Executor**",
              "Actually **runs** the task",
              "The hands on the instrument"
            ],
            [
              "**Retries, SLA, logs**",
              "Try again, deadline, written record",
              "Second take, concert time, recording"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**Scheduler decides when, executor runs it, sensor waits, operator does.**"
        },
        {
          "type": "check",
          "q": "Task 1 → Task 2 → Task 4 → Task 1. What's wrong?",
          "options": [
            "Nothing",
            "It is cyclic, so it would loop forever",
            "It is undirected",
            "It has too few tasks"
          ],
          "answer": 1,
          "why": "A DAG must be acyclic."
        }
      ]
    },
    {
      "id": "s-tools",
      "heading": "5. Which conductor? The tools",
      "slides": "32–42",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Tool",
            "Remember it as…"
          ],
          "rows": [
            [
              "**Airflow**",
              "The classic: Python DAGs for ETL (Netflix)"
            ],
            [
              "**Prefect**",
              "Modern Python, cloud-friendly, live monitoring"
            ],
            [
              "**Dagster**",
              "The quality inspector: type-safe, lineage (healthcare)"
            ],
            [
              "**Argo**",
              "Every task is a **container** on Kubernetes"
            ],
            [
              "**Kubeflow**",
              "Built for the **ML** lifecycle on Kubernetes"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Kinds of tool:** operator-native (task templates) vs container-native (each task a container); open source (you run it) vs managed (Astronomer, Cloud Composer); data-specific vs general-purpose (AWS Step Functions)."
        }
      ]
    },
    {
      "id": "s-design",
      "heading": "6. Designing a workflow",
      "slides": "43–50",
      "blocks": [
        {
          "type": "p",
          "text": "```flow\nTrigger: new file or 1 AM -> Ingest -> Validate -> Transform -> Train -> Deploy only if better than current model\nValidate fails -> Alert -> Stop\n```"
        },
        {
          "type": "p",
          "text": "**Commonly forgotten pieces:** a logger, continuous monitoring, resource allocation and security."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's AWS case study",
          "text": "Managed Airflow (**MWAA**) runs three notebooks: clean **weather** data → clean **taxi** rides and join with weather → train a model predicting **taxi fares** from rain and distance."
        }
      ]
    },
    {
      "id": "s-dataops",
      "heading": "7. Orchestration in DataOps",
      "slides": "51–58",
      "blocks": [
        {
          "type": "p",
          "text": "```flow\nCI/CD: what should change -> Orchestration: when and in what order -> Automation: runs it -> Observability: what happened and why\n```"
        },
        {
          "type": "p",
          "text": "Good orchestration observability knows the difference between a **hiccup that was retried** and a **failure that stopped the run**, finds the **root cause** fast, and can **block bad data** from moving on."
        }
      ]
    },
    {
      "id": "s-golden",
      "heading": "8. The golden rule: idempotent and atomic",
      "slides": "60–75",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Word",
            "Simple meaning",
            "Example"
          ],
          "rows": [
            [
              "**Idempotent**",
              "Doing it twice = doing it once",
              "Light switch **ON** (not the “volume +1” button). Overwrite today's partition instead of appending"
            ],
            [
              "**Atomic**",
              "All or nothing, never half-done",
              "Copy the file **first**, delete the original **only after** the copy works"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Why? Pipelines fail and get **retried**. If tasks are idempotent and atomic, a retry never creates duplicates or loses data."
        },
        {
          "type": "table",
          "head": [
            "Other habits",
            ""
          ],
          "rows": [
            [
              "One DAG per business goal",
              "no “monster DAG”"
            ],
            [
              "Clear names",
              "`transfer_s3_to_redshift`, not `task_1`"
            ],
            [
              "No hard-coded values",
              "use variables and connections"
            ],
            [
              "Useful logs and alerts",
              "what failed, on which data, link to the log"
            ],
            [
              "DAGs in Git, tested",
              "pytest, CI before merge"
            ]
          ]
        },
        {
          "type": "check",
          "q": "A load task appends rows; after a retry, totals double. The task is not…",
          "options": [
            "atomic",
            "idempotent",
            "directed",
            "scheduled"
          ],
          "answer": 1,
          "why": "Running it twice changed the result."
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
          "text": "- **Why:** manual fails on T-D-C-E.\n- **Orchestration** = conductor; **choreography** = dancers; **automation** = one task.\n- **DAG** = directed + acyclic; nodes = tasks, edges = dependencies.\n- **Operator** does, **sensor** waits, **scheduler** when, **executor** runs; retries, SLAs, logs.\n- **Tools:** Airflow, Prefect, Dagster, Argo, Kubeflow.\n- **Golden rule:** idempotent (light switch) + atomic (copy, then delete)."
        }
      ]
    }
  ],

  summary: [
    {
      id: "need",
      heading: "Lesson 1: Why can't we keep running pipelines by hand?",
      slides: "4–12",
      blocks: [
        {
          type: "p",
          text: "**The story (slide 5).** A data engineer at an e-commerce company does four things by hand every day: extract data from several sources, transform it, load it into the warehouse, and generate reports. Then the company grows: new channels (a **mobile app**, **experience stores**), many more customers, many new reports (“peak buying hours for happy-hour offers”), and some analyses must run **every 30 minutes** with an ML engine. Doing that by hand falls apart.",
        },
        {
          type: "table",
          caption: "Four problems with manual pipelines (slides 6–7)",
          head: ["Problem", "What goes wrong"],
          rows: [
            ["**Time-consuming**", "What works for 5 pipelines is unmanageable for 50 or 500"],
            ["**Dependencies**", "“Job C runs only after A and B succeed” is impossible to track by hand at scale"],
            ["**Compliance gaps**", "No reliable record of **when** a task ran, **by whom**, with **what parameters**; schedulers keep audit logs"],
            ["**Error recovery**", "Ad-hoc fixes that depend on one person's expertise: inconsistent, sometimes wrong"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Definitions (slide 8)",
          text: "**Data pipeline orchestration** *automates the movement and transformation of data between systems, so data is accurate, up to date and ready for analysis.* It is **context-aware**: it understands the events inside the pipeline.\n**Data orchestration** is the **wider** term: coordinating *any* data-related computing task: job sequencing, metadata sync, cataloguing results, triggering loads and quality checks, detecting when one task ends and starting the next, timing scripts.",
        },
        {
          type: "table",
          caption: "Why orchestrate? (slide 9)",
          head: ["Benefit", "Meaning"],
          rows: [
            ["**Efficiency**", "Less manual effort, streamlined workflows"],
            ["**Reliability**", "Consistent delivery, less data loss or inconsistency"],
            ["**Scalability**", "Handles growing volumes as the company grows"],
            ["**Flexibility**", "Add sources or change steps quickly"],
            ["**Monitoring & visualisation**", "See status and performance, find bottlenecks, troubleshoot"],
          ],
        },
        {
          type: "p",
          text: "**Use cases (slides 10–12):** **real-time analytics** (finance, e-commerce, telecom: instant insights, anomaly detection); **integration across applications** (consistent, synchronised data); **ML/AI pipelines** (preprocessing → features → training → serving, end to end); **governance & compliance** (privacy, access control, masking, GDPR/HIPAA built into the workflow); **data-science experimentation** (rapid iteration).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "Manual pipelines fail on **T-D-C-E**: **T**ime, **D**ependencies, **C**ompliance, **E**rror recovery. Orchestration gives **E-R-S-F-M**: Efficiency, Reliability, Scalability, Flexibility, Monitoring.",
        },
      ],
    },
    {
      id: "vs",
      heading: "Lesson 2: Orchestration vs choreography, automation, pipelines and workflows",
      slides: "13–21",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "The picture on slide 15",
          text: "**Orchestration = an orchestra with a conductor**: one central controller tells every musician when to play. **Choreography = a dance troupe**: no conductor; each dancer reacts to the others.",
        },
        {
          type: "table",
          caption: "Choreography vs orchestration (slide 16)",
          head: ["", "Choreography", "Orchestration"],
          rows: [
            ["**Control**", "Services call each other point-to-point (A ↔ B ↔ C ↔ D)", "A central **orchestrator** invokes each service and collects replies"],
            ["**Coupling**", "Tight, complicated dependencies", "Services **loosely coupled**"],
            ["**Debugging & testing**", "Harder; fault tolerance is complex", "Domain boundaries are clear; tests confined to domains"],
          ],
        },
        {
          type: "table",
          caption: "Automation vs orchestration (slide 17)",
          head: ["Category", "Automation", "Orchestration"],
          rows: [
            ["**Scope**", "Executes a **single, repetitive** task", "Coordinates many systems, services and teams into one synchronised flow"],
            ["**Complexity**", "Straightforward, rule-based tasks", "Interdependent processes across systems"],
            ["**Flexibility**", "Rigid", "Adaptable, dynamic"],
            ["**Integration**", "Within one application", "Across applications and the organisation"],
          ],
        },
        {
          type: "p",
          text: "**Example (slide 54): IT service requests.** *Automation* resets a password or categorises a ticket. *Orchestration* links automations into a complete flow: a request for application access is routed, permissions verified, directories updated, approvers notified, completion confirmed, all in the correct order.",
        },
        {
          type: "table",
          caption: "Data pipeline vs data workflow (slides 19–20)",
          head: ["", "Data pipeline", "Data workflow"],
          rows: [
            ["**What**", "Automated steps that **move** data: extract → transform → load", "The **whole process** of working with data, including decisions and actions"],
            ["**Contains**", "Sources, extraction, transformation logic, loading, destination", "Sequential/parallel tasks, **decision points**, **human approvals**, tool integrations, reporting"],
            ["**Use when**", "Large regular volumes, real-time processing, structured multi-source data, minimal human touch", "Complex decisions, coordination across teams, compliance and governance, insight generation"],
          ],
        },
        {
          type: "table",
          caption: "Data pipeline vs workflow orchestration (slide 21)",
          head: ["Category", "Data pipeline", "Workflow orchestration"],
          rows: [
            ["**Scope**", "Movement and transformation of data", "Coordinates and manages execution of tasks **within** pipelines"],
            ["**Functionality**", "Data flow and transformations", "Correct **order and timing** of processes"],
            ["**Tools**", "Apache NiFi, AWS Data Pipeline", "Apache Airflow, Orchestra"],
            ["**Parallelism**", "Runs independent transformations in parallel", "Runs steps in the right order (sequential by default)"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Note on parallelism",
          text: "Slide 21 says orchestrators run tasks “sequentially by default”. Read this as *they enforce order where dependencies exist*: tools like Airflow still run **independent** branches of a DAG in parallel.",
        },
      ],
    },
    {
      id: "dag",
      heading: "Lesson 3: The core ideas: DAGs, tasks and who runs them",
      slides: "22–31",
      blocks: [
        {
          type: "p",
          text: "**Directed (slide 24).** Every arrow has a direction, so each task is clearly **upstream**, **downstream** or **parallel** to another. A two-way arrow (undirected) leaves the order ambiguous ✗.",
        },
        {
          type: "p",
          text: "**Acyclic (slide 25).** No loops: a task can't depend on itself, or on a task that ultimately depends on it. A cycle (1 → 2 → 4 → 1) would run forever and never finish ✗.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "DAG = Directed Acyclic Graph (slide 26)",
          text: "A graph of **nodes = tasks** and **edges = dependencies**, with arrows that have a direction and no cycles. DAGs are the central concept behind orchestration tools, and drawing a workflow as a DAG makes it easy to see and reason about.",
        },
        {
          type: "p",
          text: "```flow\nextract_orders -> transform_orders -> load_warehouse -> build_report\nextract_customers -> transform_customers -> load_warehouse\n```",
        },
        {
          type: "table",
          caption: "Building blocks (slides 27–31, Airflow terms)",
          head: ["Concept", "Meaning"],
          rows: [
            ["**Task**", "The basic unit of execution; tasks are arranged into DAGs"],
            ["**Operator**", "A predefined task template (run SQL, call Python, copy to S3) you string together"],
            ["**Sensor**", "A special operator that only **waits** for something: a time, a file, an external event, then succeeds so downstream tasks run"],
            ["**Upstream / downstream**", "The task **directly** before / after (formerly parent/child). Declare tasks first, dependencies second"],
            ["**Scheduler**", "Monitors all DAGs and triggers task instances when their dependencies are complete (checks about **once a minute** by default)"],
            ["**Executor**", "The mechanism that actually **runs** task instances"],
            ["**Logging**", "Records execution details, outputs and errors for monitoring, debugging and audit"],
            ["**SLA**", "A time limit within which a task or DAG run should succeed; alerts if missed"],
            ["**Retries**", "Automatically re-run a failed task to handle **transient** errors"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**Scheduler decides *when*, executor decides *how*, sensor *waits*, operator *does*.**",
        },
      ],
    },
    {
      id: "tools",
      heading: "Lesson 4: Which tool? The orchestration landscape",
      slides: "32–42",
      blocks: [
        {
          type: "p",
          text: "An orchestration tool **stitches tasks into a DAG** where each task consumes an input and produces an output, and it is responsible for **scheduling, starting tasks, saving state, monitoring workflows and generating alerts** (slide 33).",
        },
        {
          type: "table",
          caption: "Ways to classify tools (slides 34–36)",
          head: ["Dimension", "Options"],
          rows: [
            ["**How tasks are defined**", "**Operator-native** (predefined templates: Airflow, Luigi, Prefect, Dagster, Metaflow) vs **container-native** (each task is a container orchestrated by Kubernetes: Flyte, Union)"],
            ["**How you get it**", "**Open source** (you install and run it; community matters) vs **managed** (a company hosts it: Astronomer, Google Cloud Composer, Prefect Cloud)"],
            ["**Purpose**", "**Data-specific** vs **general-purpose** (any task: Kubeflow, Argo, Tekton, AWS Step Functions)"],
          ],
        },
        {
          type: "table",
          caption: "Five tools to know (slides 37–41)",
          head: ["Tool", "Identity", "Ideal use", "Real-world example"],
          rows: [
            ["**Apache Airflow**", "Open-source, Python DAGs; dynamic pipeline generation, scalable, scheduling, monitoring & logging", "ETL and large-scale data workflows", "**Netflix** schedules thousands of tasks"],
            ["**Prefect**", "Python-native modern API, cloud-native, live monitoring; integrates with dbt, Snowflake, Looker", "ML pipelines, cloud workflows, transformations", "Major tech companies' dynamic workflows"],
            ["**Dagster**", "**Type-safe** pipelines, metadata/lineage tracking, error handling, data-quality focus, observability", "When **data quality and lineage** come first", "**Healthcare** data processed with high integrity"],
            ["**Argo Workflows**", "**Container-native** engine on **Kubernetes**; DAG and step workflows, reusable templates, parallel jobs", "Containerised, parallel processing", "Any Kubernetes cluster"],
            ["**Kubeflow Pipelines**", "ML workflows on Kubernetes: data prep → training → evaluation → deployment, plus experiments and model management", "**ML** lifecycle (not mainly data orchestration)", "AI development lifecycle"],
          ],
        },
        {
          type: "p",
          text: "**Comparison (slide 42):** **Airflow** (Airbnb, Python, scheduling + backfilling), **Argo** (Applatix, YAML, Kubernetes), **Azkaban** (LinkedIn, YAML), **Conductor** (Netflix, JSON), **Luigi** (Spotify, Python), **Metaflow** (Netflix, Python), **NiFi** (NSA, UI-based), **Oozie** (XML, Hadoop). **Backfilling** = re-running a DAG for past dates.",
        },
      ],
    },
    {
      id: "design",
      heading: "Lesson 5: Designing an orchestrated ML workflow",
      slides: "43–50",
      blocks: [
        {
          type: "p",
          text: "```flow\nTrigger: new file or daily 1 AM -> Ingest -> Validate -> Transform -> Train model -> Deploy if better\nValidate fails -> Alert -> Stop execution\n```",
        },
        {
          type: "list",
          items: [
            "**Start:** triggered by an **event** (new data file detected) or a **schedule** (daily at 1 AM) (slide 44).",
            "**Sequential rules (slide 45):** validation runs only after ingestion succeeds; if validation **fails**, the workflow **stops and alerts**; transformation runs only after validation passes; training only after transformation; deployment only if the new model **beats the one in production**.",
          ],
        },
        {
          type: "table",
          caption: "What does this design have, hide, and miss? (slide 46)",
          head: ["Has", "Hidden", "Missing"],
          rows: [
            ["Tasks, dependencies, executors", "Validator, scheduler", "**Logger, continuous monitoring, resource allocation, security**"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Case study (slides 47–50): taxi fares on AWS",
          text: "**Amazon MWAA** (Managed Workflows for Apache Airflow) inside **SageMaker Unified Studio** orchestrates three notebook tasks: **(1)** ingest and preprocess hourly **weather** data (time, temperature, rain, precipitation, wind); **(2)** ingest NYC **taxi** rides (pickup/drop-off, distance, passengers, fare), transform and **join** with weather, write to S3; **(3)** train a **regression** model of how rain and distance affect fares, and predict fares for new trips. One governed workflow gives visibility and reproducibility across ETL and ML.",
        },
      ],
    },
    {
      id: "dataops",
      heading: "Lesson 6: How orchestration powers DataOps",
      slides: "51–58",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Orchestration is the bridge (slide 52)",
          text: "**CI/CD** (Git, tests, deploy) defines **what should change** → **Orchestration** (DAGs, scheduling & triggers, dependencies, retries & SLAs, state & metadata) → **Automation** **runs it reliably** → **Observability** tells you **what happened and why**.",
        },
        {
          type: "p",
          text: "**Enables automation (slides 53–54).** Automation is efficient at the task level; orchestration chains automations through shared triggers, data and workflow logic so the whole process runs end to end across departments.",
        },
        {
          type: "p",
          text: "**Enables CI/CD for data (slides 55–56).** Real organisations have tens or hundreds of pipelines spread across edge, on-premises and several clouds, with many failure points (network, servers) and forked dependencies. The orchestrator's scheduling and workflow engine **triggers jobs, enforces dependencies, tracks what has happened and what still must happen, and logs traces for audit**.",
        },
        {
          type: "p",
          text: "**Enables observability (slides 57–58).** Ordinary monitoring says “each component is up”. Orchestration observability follows the **whole run** (e.g. a nightly ETL that takes hours) and can tell a **transient error that was retried** from one that **halted** the workflow. It gives **end-to-end visibility**, **root-cause analysis** (lineage + logs pinpoint the failed task), **proactive alerting** (predict SLA breaches) and **built-in quality gates** (stop bad data from moving downstream).",
        },
      ],
    },
    {
      id: "best",
      heading: "Lesson 7: Best practices: the golden rule and friends",
      slides: "60–75",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "The golden rule: idempotent and atomic tasks (slides 63–64, 69–70)",
          text: "**Idempotent:** running it **many times = running it once**. Light switch “ON” is idempotent; “volume +1” is not. Pipelines fail and get **retried**; a non-idempotent task would create duplicate rows or wrong totals.\n**Atomic:** a task **either completes fully or fails completely**, with no half-done state. Moving a file: *copy to processed, and only if that succeeds, delete from staging*, never delete first.\nSplit Extract, Transform and Load into **separate tasks** so each can be re-run independently.",
        },
        {
          type: "table",
          caption: "More best practices (slides 61–75)",
          head: ["Area", "Practice"],
          rows: [
            ["**DAG design**", "**Modular** DAGs and reusable components/templates; **one DAG per business outcome** (`ingest_customer_events_dag`, not a “monster DAG”)"],
            ["**Naming**", "Descriptive task IDs: `transfer_s3_to_redshift`, not `task_1`"],
            ["**Organisation**", "**TaskGroups** (extract_tasks / transform_tasks / load_tasks) instead of a flat list of 20 tasks"],
            ["**Parameterisation**", "No hard-coded values: use Variables, Connections and templates; import reusable modules"],
            ["**Trigger rules**", "Default `all_success`; avoid casual `all_done` (a cleanup could delete data after a failure). Use it only for things like a final notification"],
            ["**Logging**", "Right levels (info / warning / error) and context: what was it doing, on which data?"],
            ["**Alerting**", "`on_failure_callback` to Slack/PagerDuty/Teams with DAG ID, task ID, log URL and what went wrong; watch durations, SLA misses, failure rates (Grafana, Datadog)"],
            ["**Versioning & testing**", "DAGs in Git; unit tests with pytest (mock external systems); end-to-end with pytest-airflow; CI validates syntax and runs linters before merge"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**Light switch, not volume button.** Copy, *then* delete.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "idea",
      title: "In one line",
      text: "An orchestrator runs a DAG of idempotent, atomic tasks in the right order and time, retries and alerts on failure, and makes the whole run observable.",
    },
    {
      type: "list",
      items: [
        "**Manual pipelines fail on** time, dependencies, compliance gaps, error recovery.",
        "**Orchestration** (conductor) vs **choreography** (dancers react to each other); **automation** = one task, **orchestration** = coordinates many.",
        "**Pipeline** moves data; **workflow** = the whole process incl. decisions and approvals.",
        "**DAG:** directed (clear order) + acyclic (no loops); nodes = tasks, edges = dependencies.",
        "**Operator** does, **sensor** waits, **scheduler** decides when, **executor** runs; logging, SLAs, retries.",
        "**Tools:** Airflow (ETL, Netflix), Prefect (Python, cloud), Dagster (quality, lineage), Argo (containers on Kubernetes), Kubeflow (ML).",
        "**Orchestration → DataOps:** bridges CI/CD, automation and observability.",
        "**Golden rule:** idempotent + atomic tasks; single-purpose DAGs; no hard-coding; useful logs and actionable alerts.",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: design an orchestrated ML workflow (draw the DAG, failure path) · orchestration vs choreography/automation · why idempotency matters · choose a tool for a scenario.",
    },
  ],

  glossary: [
    ["Orchestration", "—", "Central coordination of many tasks/services in the right order and timing"],
    ["Data pipeline orchestration", "—", "Automating movement and transformation of data between systems, context-aware"],
    ["Data orchestration", "—", "Coordinating any data-related computing tasks (wider term)"],
    ["Choreography", "—", "Services coordinating among themselves point-to-point, without a controller"],
    ["Automation", "—", "Running a single repetitive task without human effort"],
    ["Data workflow", "—", "Whole data process including decisions, approvals and reporting"],
    ["DAG", "Directed Acyclic Graph", "Tasks (nodes) and dependencies (edges) with direction and no cycles"],
    ["Task", "—", "Basic unit of execution in a DAG"],
    ["Operator", "—", "Predefined task template (Airflow)"],
    ["Sensor", "—", "Operator that waits for a time, file or event"],
    ["Upstream / downstream", "—", "Task directly before / after another"],
    ["Scheduler", "—", "Triggers task instances when dependencies complete"],
    ["Executor", "—", "Mechanism that runs task instances"],
    ["SLA", "Service Level Agreement", "Time limit for a task/DAG to succeed"],
    ["Retry", "—", "Automatic re-run after a transient failure"],
    ["Backfilling", "—", "Running a workflow for past time periods"],
    ["Operator-native / container-native", "—", "Tasks from templates vs each task a container on Kubernetes"],
    ["Kubernetes", "K8s", "Container orchestration platform"],
    ["MWAA", "Amazon Managed Workflows for Apache Airflow", "AWS-hosted Airflow"],
    ["CI/CD", "Continuous Integration / Continuous Delivery", "Automated test and deploy of changes"],
    ["Observability", "—", "Understanding what happened and why from logs, metrics and lineage"],
    ["RCA", "Root Cause Analysis", "Finding the exact cause of a failure"],
    ["Idempotent", "—", "Running many times has the same effect as running once"],
    ["Atomic", "—", "Completes fully or fails completely, no partial state"],
    ["TaskGroup", "—", "Airflow visual grouping of related tasks"],
    ["Trigger rule", "all_success / all_done", "When a task runs based on upstream outcomes"],
  ],

  examTips: [
    "Draw the workflow as a **DAG with arrows** and a **failure branch** (validate fails → alert → stop). It earns easy marks.",
    "When comparing, use a table: orchestration vs choreography (control, coupling, debugging) or vs automation (scope, complexity, flexibility, integration).",
    "Always mention **idempotency and atomicity** with the light-switch and copy-then-delete examples when asked about reliable pipelines.",
    "For tool choice, justify with the scenario: data quality → Dagster; Kubernetes containers → Argo; ML lifecycle → Kubeflow; general ETL → Airflow.",
  ],

  theory: [
    {
      title: "Design an orchestrated ML workflow",
      marks: 5,
      question: "An e-commerce company wants its demand-forecast model retrained every night when new sales files arrive. Design an orchestrated workflow, explain the DAG and the core orchestration components, and describe what happens when data validation fails.",
      solution: `
### What the examiner wants
A DAG with clear dependencies and a trigger, the roles of scheduler/executor/sensor/operators, failure handling (alert, stop, retries), and the missing pieces (logging, monitoring, resources, security).

### Model answer
**Why orchestrate:** doing ingest → transform → train → deploy by hand fails on **time, dependencies, compliance (no audit trail) and error recovery** (slide 7).

\`\`\`flow
Sensor: new sales file in S3 or 1 AM schedule -> Ingest sales -> Validate data -> Transform features -> Train model -> Evaluate vs production -> Deploy if better
Validate data fails -> Alert on-call via Slack -> Stop execution
\`\`\`

**The DAG (slides 24–26):** nodes are tasks, edges are dependencies; **directed** (clear upstream/downstream) and **acyclic** (no loops, so the run finishes).

**Components (slides 27–31):**
- **Trigger:** a **sensor** waits for the new file, or the **scheduler** starts the run at 1 AM.
- **Operators** implement each task (Python, SQL, S3 copy).
- **Scheduler** triggers each task once its upstream tasks succeed; **executor** actually runs them.
- **Retries** handle transient errors (e.g. a network timeout during ingestion); **SLA**: “model must be deployed by 6 AM”, alert if missed.
- **Logging** records each run (when, parameters, outcome) for debugging and audit.

**When validation fails (slide 45):** downstream tasks don't run (default trigger rule \`all_success\`); an **on_failure_callback** sends an actionable alert (DAG ID, task ID, log URL, cause); the bad data never reaches training.

**Make it reliable (slides 63–70):** tasks are **idempotent** (re-running the 2025-03-01 load overwrites that day's partition instead of appending duplicates) and **atomic** (write the model to the registry, then switch the pointer). Add the **missing components** (slide 46): logger, continuous monitoring, resource allocation, security.

**Tool:** Apache Airflow (or Amazon MWAA as managed Airflow), as in the AWS taxi-fare case study (slides 47–50).`,
    },
    {
      title: "Orchestration vs choreography vs automation",
      marks: 5,
      question: "Differentiate orchestration from choreography and from automation, with examples. Why is orchestration preferred for data pipelines?",
      solution: `
### Model answer
**Analogy (slide 15):** orchestration is an **orchestra with a conductor**; choreography is a **dance troupe** where each dancer reacts to the others.

| | Choreography | Orchestration |
|---|---|---|
| Control | Services call each other point-to-point | Central orchestrator invokes each service |
| Coupling | Tight; dependencies complicated | Loose; clear domain boundaries |
| Debugging/testing | Hard; fault tolerance complex | Easier; tests confined to domains |

| | Automation | Orchestration |
|---|---|---|
| Scope | One repetitive task | Many tasks across systems and teams |
| Complexity | Simple rules | Interdependent processes |
| Flexibility | Rigid | Adaptable |
| Integration | One application | Organisation-wide |

**Example (slide 54):** automation resets a password; orchestration runs the whole access request: verify permissions → update directory → notify approver → confirm.

\`\`\`flow
Orchestrator -> Extract job -> Transform job -> Load job -> Quality check -> Report
\`\`\`

**Why orchestration for data pipelines:** pipelines have many **dependencies**, need **retries, SLAs and audit logs**, must stop bad data (quality gates), and must be observable end to end. A central controller gives one place to see state, re-run failed steps and enforce order, giving **efficiency, reliability, scalability, flexibility and monitoring** (slide 9).`,
    },
    {
      title: "Idempotency and atomicity in pipelines",
      marks: 5,
      question: "Explain idempotency and atomicity with examples. Why are they called the ‘golden rule’ for orchestrated pipelines, and list other best practices for DAG design.",
      solution: `
### Model answer
**Idempotent** (slides 63, 69): running a task many times has the **same effect as running it once**. A light switch set to ON is idempotent; “increase volume by 1” is not.
*Pipeline example:* a daily load that **overwrites** the partition for 2025-03-01 is idempotent; one that **appends** rows creates duplicates every time it is retried.

**Atomic** (slides 64, 70): a task **either completes fully or fails completely**.
*Example:* moving a file from staging to processed: **copy first, delete only after the copy succeeds**. Deleting first risks losing the file forever.

**Why the golden rule:** pipelines fail (network timeouts), and orchestrators **retry** automatically. Idempotent + atomic tasks make retries and re-runs **safe**: no duplicates, no corrupted state, faster recovery, no data loss.

\`\`\`flow
Task fails midway -> Orchestrator retries -> Atomic: no partial output left -> Idempotent: same final result -> Downstream continues safely
\`\`\`

**Other best practices (slides 61–75):** separate Extract/Transform/Load tasks; **modular, single-purpose DAGs**; descriptive task names; **TaskGroups**; no hard-coded values (variables, connections, templates); avoid casual \`all_done\` trigger rules; informative logs; actionable alerts (\`on_failure_callback\` with DAG/task ID and log URL); DAGs in Git with pytest unit tests and CI checks.`,
    },
    {
      title: "Orchestration as the backbone of DataOps",
      marks: 5,
      question: "How does workflow orchestration enable DataOps practices such as CI/CD, automation and observability? Illustrate with a nightly ETL example.",
      solution: `
### Model answer
**Orchestration is the bridge (slide 52):** **CI/CD** defines *what should change* (code in Git, tests, deployment); **orchestration** (DAGs, schedules, triggers, dependencies, retries, SLAs, state and metadata) turns it into runs; **automation** *runs things reliably*; **observability** tells *what happened and why*.

\`\`\`flow
Git commit to DAG -> CI: lint, tests -> Deploy DAG -> Scheduler triggers nightly ETL -> Extract -> Transform -> Quality gate -> Load warehouse -> Logs, lineage, metrics -> Dashboards and alerts
\`\`\`

- **CI/CD for data (slides 55–56):** organisations run hundreds of pipelines across edge, on-premises and multiple clouds; the orchestrator triggers jobs, enforces dependencies, tracks what has run and what remains, and keeps audit traces.
- **Automation (slides 53–54):** chains automated tasks through shared triggers and data so the process runs end to end.
- **Observability (slides 57–58):** for a multi-hour nightly ETL, traditional monitoring only says each service is up; orchestration observability follows the whole run, distinguishes a **retried transient error** from a **halting error**, enables **root-cause analysis**, **proactive alerts** before SLA breaches, and **quality gates** that stop bad data moving downstream.

**Result:** faster, safer changes; fewer data incidents; auditable runs.`,
    },
  ],

  quiz: [
    { q: "Which is NOT one of the four problems of manual pipelines listed in the lecture?", options: ["Dependencies", "Compliance gaps", "Error recovery", "Too many dashboards"], answer: 3, why: "Time, dependencies, compliance, error recovery (slide 7)." },
    { q: "A central controller invoking each service and collecting replies is:", options: ["Choreography", "Orchestration", "Automation", "Replication"], answer: 1, why: "Slide 16." },
    { q: "Resetting a user's password automatically is an example of:", options: ["Orchestration", "Automation", "Choreography", "Lineage"], answer: 1, why: "A single repetitive task (slide 54)." },
    { q: "Why must a pipeline graph be acyclic?", options: ["To run faster", "Otherwise it could loop forever and never finish", "To use less memory", "Because tasks can't run in parallel"], answer: 1, why: "Slide 26." },
    { q: "In Airflow, a task that only waits for a file to arrive is a:", options: ["Executor", "Sensor", "Scheduler", "TaskGroup"], answer: 1, why: "Slide 28." },
    { q: "Which component triggers task instances once their dependencies are complete?", options: ["Executor", "Scheduler", "Operator", "Logger"], answer: 1, why: "Slide 30." },
    { q: "Which tool emphasises type-safe pipelines, data quality and lineage?", options: ["Dagster", "Argo", "Luigi", "Oozie"], answer: 0, why: "Slide 39." },
    { q: "A container-native workflow engine running on Kubernetes is:", options: ["Airflow", "Argo Workflows", "Prefect", "Dagster"], answer: 1, why: "Slide 40." },
    { q: "Which is the ‘golden rule’ for reliable Airflow tasks?", options: ["Use all_done everywhere", "Make tasks idempotent and atomic", "Put everything in one DAG", "Hard-code paths"], answer: 1, why: "Slides 69–70." },
    { q: "Moving a file atomically means:", options: ["Delete from staging, then copy", "Copy to processed, then delete from staging only if the copy succeeded", "Copy twice", "Rename randomly"], answer: 1, why: "Slide 70." },
    { q: "Why is a casual `all_done` trigger rule dangerous?", options: ["It never runs", "A cleanup task may run and delete data even after a failure", "It slows the scheduler", "It disables retries"], answer: 1, why: "Slide 73." },
    { q: "In the lecture's workflow, what happens if validation fails?", options: ["Training continues", "An alert is sent and execution stops", "Data is deleted", "The model is deployed anyway"], answer: 1, why: "Slides 44–45." },
  ],
};
