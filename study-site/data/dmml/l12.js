// DMML — Lecture 12: ML Experimentation & Metadata
// Source: CourseFiles/DMML/L12-ML Experimentation  Metadata.pptx (120 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "ML Experimentation & Metadata",
  source: "L12-ML Experimentation  Metadata.pptx · 120 slides",
  overview:
    "Building a model means running **hundreds of experiments**: other models, features, hyperparameters, data. Weeks later someone asks: *“Which data trained the production model? With which settings? Can we reproduce it?”* Without records, nobody knows (slide 68's “unfortunate data scientist”). This lecture is about keeping those records. It covers **training and splitting data** (train/validation/test, k-fold, LOOCV, shuffle splits, slides 4–14), the **four kinds of experiments** and hyperparameter search (slides 15–21), **model validation** and its six pillars (slides 22–29), **metadata**: types and what to log for datasets, features, labels, models and pipelines (slides 30–47), **metadata systems** (one vs many; build, open source or buy, slides 48–56), the **ML metadata store** (slides 57–60), **metadata management vs lineage** (slides 61–66), **experiment tracking** and its tools (MLflow, Comet, W&B, Neptune, DVC, DagsHub, slides 67–92), and the **model registry** (slides 93–118).",

  simpleIntro: "Imagine a cook testing 200 versions of a recipe: a pinch more salt here, a different oven there. If they never write anything down, they'll never know which version won the competition, or be able to make it again. ML teams face the same problem. This lecture teaches the **lab notebook** of ML: how to run experiments properly, what **metadata** (notes about data, models and runs) to keep, where to keep it, and how to manage the winning models in a **model registry**.",

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
              "title": "Experiment properly",
              "text": "Split data fairly; change one thing at a time.",
              "tag": "Test",
              "example": "k-fold cross-validation"
            },
            {
              "title": "Write everything down",
              "text": "Metadata: which data, code, settings, environment and results.",
              "tag": "Lab notebook",
              "example": "git SHA + data hash + hyperparameters"
            },
            {
              "title": "Manage the winners",
              "text": "A model registry stores chosen models with versions and stages.",
              "tag": "Trophy cabinet",
              "example": "MLflow: staging → production"
            }
          ]
        }
      ]
    },
    {
      "id": "s-split",
      "heading": "2. Splitting data: practice, mock exam, final exam",
      "slides": "4–14",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Set",
            "Like…"
          ],
          "rows": [
            [
              "**Training**",
              "Textbook practice problems"
            ],
            [
              "**Validation**",
              "Mock exams for choosing settings"
            ],
            [
              "**Test**",
              "The final exam, seen only once"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "Method",
            "Simple idea"
          ],
          "rows": [
            [
              "**k-fold**",
              "Cut data into k pieces; each piece takes a turn as the test; average the k scores"
            ],
            [
              "**LOOCV**",
              "Leave out one row at a time (very slow)"
            ],
            [
              "**Leave-p-out**",
              "Leave out every group of p rows (explodes in cost)"
            ],
            [
              "**Shuffle split**",
              "Shuffle and split randomly a few times (seeded)"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Data split into 5 parts; train on 4, test on 1, repeat 5 times and average. This is…",
          "options": [
            "Hold-out",
            "5-fold cross-validation",
            "LOOCV",
            "Bootstrapping"
          ],
          "answer": 1,
          "why": "k-fold with k = 5."
        }
      ]
    },
    {
      "id": "s-exp",
      "heading": "3. Four kinds of experiment",
      "slides": "15–21",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Change…",
            "Keep fixed",
            "Name"
          ],
          "rows": [
            [
              "The model",
              "Data",
              "**Model selection**"
            ],
            [
              "The features",
              "Model",
              "**Feature engineering**"
            ],
            [
              "The settings (learning rate…)",
              "Model",
              "**Hyperparameter tuning**"
            ],
            [
              "The data (more, varied)",
              "Model",
              "**Data augmentation**"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Searching settings:** grid (try all), random (try some), Bayesian (smart guessing), Hyperband (drop the worst half each round), genetic (keep the fittest)."
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**Parameters** are learned; **hyperparameters** are chosen before training."
        }
      ]
    },
    {
      "id": "s-valid",
      "heading": "4. Six pillars of model validation",
      "slides": "22–29",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Pillar",
            "Question"
          ],
          "rows": [
            [
              "Conceptual soundness",
              "Does it make sense?"
            ],
            [
              "Data quality",
              "Can we trust the training data?"
            ],
            [
              "Process verification",
              "Was it built and deployed correctly?"
            ],
            [
              "Outcomes analysis",
              "Does it perform, and stay fair?"
            ],
            [
              "Ongoing monitoring",
              "Is it still healthy?"
            ],
            [
              "Governance",
              "Who is accountable?"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "“**C**an **D**ata **P**rove **O**ur **M**odel's **G**oodness?”"
        }
      ]
    },
    {
      "id": "s-meta",
      "heading": "5. Metadata: the label on the jar",
      "slides": "30–47",
      "blocks": [
        {
          "type": "p",
          "text": "A photo stores its camera, date and place. A book has a title page and contents. That information *about* the thing is **metadata**."
        },
        {
          "type": "table",
          "head": [
            "Type",
            "Tells you…",
            "Example"
          ],
          "rows": [
            [
              "Descriptive",
              "What is it?",
              "Title, keywords"
            ],
            [
              "Structural",
              "How is it organised?",
              "Table schema, keys"
            ],
            [
              "Administrative",
              "Who may use it, when made?",
              "Access rights, dates"
            ],
            [
              "Technical",
              "What format, where?",
              "File type, location, encryption"
            ],
            [
              "Statistical",
              "How was it produced?",
              "Sampling method"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**For ML, record for every model:**"
        },
        {
          "type": "p",
          "text": "```flow\nWhich Data: hash -> Which Code: git SHA -> Which Settings: hyperparameters -> Which Environment: Dockerfile -> Which Results: metrics\n```"
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**D-C-S-E-R**: Data, Code, Settings, Environment, Results. With these five, any model can be rebuilt."
        },
        {
          "type": "p",
          "text": "Also: labels' **source and confidence**, features' **owner and use restrictions**, pipelines' **cached outputs** (tools like MLMD in TFX record them automatically)."
        }
      ]
    },
    {
      "id": "s-where",
      "heading": "6. Where does metadata live?",
      "slides": "48–60",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "One big system",
            "Several small systems"
          ],
          "rows": [
            [
              "Good",
              "Easy to analyse everything together",
              "Simple, independent, one outage doesn't stop all"
            ],
            [
              "Bad",
              "Hard to design; one outage hurts everyone",
              "Hard to join; need shared IDs"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Golden rule",
          "text": "Metadata systems must never be in the **live path** of training or serving."
        },
        {
          "type": "table",
          "head": [
            "Option",
            "Like…"
          ],
          "rows": [
            [
              "**Build**",
              "Cooking at home: exactly how you like it, but you do all the work"
            ],
            [
              "**Open source**",
              "A free community kitchen: ready, but you clean up"
            ],
            [
              "**Buy**",
              "A restaurant: easy, but you pay and depend on them"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Repository** = shelf · **registry** = a checkpoint list of important items · **store** = a shop where you browse and compare. Pipeline-first (MLMD) vs model-first (MLflow, Neptune)."
        }
      ]
    },
    {
      "id": "s-lin",
      "heading": "7. Lineage: forward, backward, sideways",
      "slides": "61–66",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Direction",
            "Answers"
          ],
          "rows": [
            [
              "**Forward**",
              "If I change this, what is affected downstream?"
            ],
            [
              "**Backward**",
              "Where did this number come from?"
            ],
            [
              "**Horizontal**",
              "How does data flow across systems?"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Metadata management is the whole library catalogue; **lineage** is one special part of it: each item's travel history."
        }
      ]
    },
    {
      "id": "s-track",
      "heading": "8. Experiment tracking",
      "slides": "67–92",
      "blocks": [
        {
          "type": "p",
          "text": "Runs scattered across a laptop, Colab and the cloud → nobody knows which was best. **Experiment tracking** logs every run into **one place**: database + dashboard + client library."
        },
        {
          "type": "table",
          "head": [
            "Way",
            "Verdict"
          ],
          "rows": [
            [
              "Spreadsheet",
              "Fine alone, breaks in a team"
            ],
            [
              "Git",
              "Not built for ML: can't compare many runs, no live view"
            ],
            [
              "**Tracking tool**",
              "Built for it ✓"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "Tool",
            "Remember it as…"
          ],
          "rows": [
            [
              "**MLflow**",
              "Tracking + a registry with stages"
            ],
            [
              "**W&B**",
              "Pretty charts + hyperparameter sweeps"
            ],
            [
              "**Comet**",
              "Real-time + Git snapshots"
            ],
            [
              "**Neptune**",
              "Flexible nested metadata"
            ],
            [
              "**DVC**",
              "Git for data"
            ],
            [
              "**DagsHub**",
              "GitHub for ML (Git + DVC + MLflow)"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Which approach CANNOT show experiments live while they run?",
          "options": [
            "W&B",
            "MLflow",
            "Committing results to Git after each run",
            "Comet"
          ],
          "answer": 2,
          "why": "Git only stores results after the run finishes."
        }
      ]
    },
    {
      "id": "s-reg",
      "heading": "9. The model registry: the trophy cabinet",
      "slides": "93–118",
      "blocks": [
        {
          "type": "p",
          "text": "Operations asks: *How do I use this model? Was it tested? What does it depend on? Which version is best?* The **registry** answers, for every model version."
        },
        {
          "type": "p",
          "text": "```flow\nMany experiment runs -> Register best model v3 -> Staging: tests, fairness, approval -> Production -> Monitor -> Retrain v4 or roll back to v3\n```"
        },
        {
          "type": "table",
          "head": [
            "Term",
            "Simple meaning"
          ],
          "rows": [
            [
              "Model repository",
              "A folder of model files"
            ],
            [
              "**Model registry**",
              "Versions + stages + approvals + docs"
            ],
            [
              "Model store",
              "Registry offered as a service, plus more"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "MLOps level",
            "Registry use"
          ],
          "rows": [
            [
              "0",
              "Humans register and deploy by hand"
            ],
            [
              "1",
              "Pipeline registers models automatically (continuous training)"
            ],
            [
              "2",
              "Plus CI/CD and automatic promotion"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "10. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Split:** train / validation / test; k-fold, LOOCV, shuffle split.\n- **4 experiments:** model, features, hyperparameters, data.\n- **Validation pillars:** “Can Data Prove Our Model's Goodness?”\n- **Metadata:** 5 types; for models record **D-C-S-E-R**.\n- **Systems:** one vs many; never in the live path; build / open source / buy.\n- **Tracking:** one place for all runs; MLflow, W&B, Comet, Neptune, DVC, DagsHub.\n- **Registry:** versions, stages, approvals; MLOps levels 0/1/2."
        }
      ]
    }
  ],

  summary: [
    {
      id: "train",
      heading: "Lesson 1: How should we split data to train and judge a model?",
      slides: "4–14",
      blocks: [
        {
          type: "p",
          text: "**Training** feeds data to an algorithm so it can learn patterns (slide 5). Before training you need: a problem statement, access to data, cleaned data, a chosen algorithm and its **hyperparameters**; then you split the data (slide 6). The lecture's focus is the **data**.",
        },
        {
          type: "table",
          caption: "Three data sets (slides 7–8)",
          head: ["Set", "Role", "Analogy"],
          rows: [
            ["**Training**", "The model's “DNA”: it learns from this", "Textbook practice problems"],
            ["**Validation**", "Unseen data used **during** development to tune and choose", "Mock exams"],
            ["**Test**", "Final check on unseen, real-world-like data", "The final exam"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Never test on what you trained on (slide 9)",
          text: "A model can only be judged on data it hasn't seen. Splitting reveals **overfitting**: great on training data, poor on test data.",
        },
        {
          type: "table",
          caption: "Splitting strategies (slides 10–14)",
          head: ["Method", "How", "Trade-off"],
          rows: [
            ["**Hold-out**", "One train/test split", "Simple, but blunt: may miss information"],
            ["**k-fold cross-validation**", "Split into k folds; train on k−1, test on the 1 left out; repeat k times; **average** the k scores (e.g. 10-fold)", "Uses all data for both roles; k times the work"],
            ["**LOOCV** (leave-one-out)", "k-fold with k = number of observations: leave out one row each time", "Lowest bias; very slow"],
            ["**LPOCV** (leave-p-out)", "Leave out every possible group of p rows; train on n−p", "Number of splits grows combinatorially: very costly"],
            ["**Shuffle splits**", "Shuffle, then split into train/test a chosen number of times; randomness controlled by a **seed**", "Fast alternative to LOOCV/LPOCV"],
          ],
        },
      ],
    },
    {
      id: "experiments",
      heading: "Lesson 2: What is an ML experiment, and what can we vary?",
      slides: "15–21",
      blocks: [
        {
          type: "p",
          text: "An **ML experiment** is *a structured test of a model*: it runs over a dataset, makes predictions and validates them against known outputs. Teams run **hundreds** of experiments, changing one thing at a time, and **track** results so data drives the final choice (slide 15).",
        },
        {
          type: "table",
          caption: "Four kinds of experiment (slides 17–21): change one thing, keep the rest fixed",
          head: ["Experiment", "Changes", "Stays the same", "Example"],
          rows: [
            ["**Model selection**", "The model", "Dataset", "Logistic regression vs SVM vs random forest vs neural net, same metrics; or route credit-card transactions to one model and direct debits to another"],
            ["**Feature engineering**", "Features", "Model", "Scaling, standardising, log/square-root, powers, feature subsets"],
            ["**Hyperparameter tuning**", "Hyperparameters", "Model", "Learning rate, number of hidden layers"],
            ["**Data augmentation**", "The dataset (more, more varied)", "Model", "Crop, flip, add noise to images"],
          ],
        },
        {
          type: "table",
          caption: "Hyperparameter search methods (slide 20)",
          head: ["Method", "Idea", "Cost"],
          rows: [
            ["**Grid search**", "Try every combination in a predefined grid", "Thorough, expensive"],
            ["**Random search**", "Sample random combinations", "Faster; may miss key values"],
            ["**Bayesian optimisation**", "Build a probabilistic model of the loss to choose the next try intelligently", "Thorough, expensive"],
            ["**Hyperband**", "Drop the worst 50% of configurations between rounds", "Fast"],
            ["**Genetic algorithms**", "“Evolve” configurations by keeping high performers", "Varies"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Parameter vs hyperparameter",
          text: "**Parameters** are learned from data (weights). **Hyperparameters** are set **before** training (learning rate, tree depth, number of layers).",
        },
      ],
    },
    {
      id: "validation",
      heading: "Lesson 3: Is the model trustworthy? Model validation",
      slides: "22–29",
      blocks: [
        {
          type: "p",
          text: "**Model validation** *evaluates the performance and reliability of a predictive model*: its **accuracy, robustness and generalisability** on new, unseen data (slides 23–24). It uses cross-validation and metrics like accuracy, precision, recall and F1, and catches **overfitting and underfitting**. Applications: finance (credit scoring, fraud), healthcare (diagnosis, drug development), retail (forecasting, recommendations), manufacturing (failure prediction), environmental science, energy (load forecasting) (slides 25–26).",
        },
        {
          type: "table",
          caption: "Six pillars of a model-validation framework (slides 27–29)",
          head: ["Pillar", "Question", "Checks"],
          rows: [
            ["**Conceptual soundness**", "Does this model make sense?", "Every variable tied to a business goal; explicit assumptions; method backed by best practice"],
            ["**Data quality**", "Can we trust the training set?", "Accuracy, completeness, bias of internal and third-party data; log how missing values and proxies were treated"],
            ["**Process verification**", "Was it built and deployed correctly?", "Independent code review, reproducibility tests, change controls: the model built is the model in production"],
            ["**Outcomes analysis**", "Does it perform, and stay fair?", "Accuracy, stress and sensitivity tests, **challenger** benchmarks, fair-lending disparity checks"],
            ["**Ongoing monitoring**", "Is it still healthy?", "Drift thresholds, alerts, reviews after market/product shifts"],
            ["**Governance**", "Who's accountable?", "Roles, access rights, redevelopment horizons; every decision traceable and auditable"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook: “Can Data Prove Our Model's Goodness?”",
          text: "**C**onceptual soundness · **D**ata quality · **P**rocess verification · **O**utcomes analysis · **M**onitoring · **G**overnance.",
        },
      ],
    },
    {
      id: "metadata",
      heading: "Lesson 4: What is metadata, and what should we record?",
      slides: "30–47",
      blocks: [
        {
          type: "p",
          text: "**Metadata = data about data.** A photo file stores camera, date, exposure and location alongside the picture; a book has a title, author and table of contents; a table has a schema with column types and descriptions (slides 31–32).",
        },
        {
          type: "table",
          caption: "Why we need it (slide 33)",
          head: ["Benefit", "Meaning"],
          rows: [
            ["**Data discovery**", "A search engine for company data: no “tribal knowledge” or Slack threads"],
            ["**Data literacy & democratisation**", "A common language between engineers (producers) and business users (consumers)"],
            ["**Trust & compliance**", "In finance, healthcare and pharma, knowing **who touched what and when** is non-negotiable"],
            ["**Cloud modernisation**", "Migrations fail when teams don't know which data is safe to move, delete or refactor"],
          ],
        },
        {
          type: "table",
          caption: "Five types of metadata (slide 35)",
          head: ["Type", "Purpose", "Examples"],
          rows: [
            ["**Descriptive**", "Identify and discover", "Title, author, keywords, summary"],
            ["**Structural**", "Organisation and relationships", "Table schemas, primary/foreign keys, sections"],
            ["**Administrative**", "Access, permissions, compliance", "Access rights, created/modified dates, copyright, file type"],
            ["**Technical**", "Compatibility and quality", "Format, resolution, compression, storage location, encryption"],
            ["**Statistical**", "How data was created and analysed", "Sampling method, source, transformation steps"],
          ],
        },
        {
          type: "p",
          text: "**Dimensions (slide 34):** purpose, date and time, location, ownership and methodology.",
        },
        {
          type: "table",
          caption: "What to log for each ML object (slides 37–47)",
          head: ["Object", "Metadata to keep"],
          rows: [
            ["**Artifacts** (datasets, models, predictions)", "Reference (S3 path), version (md5 hash), preview (table head, image snapshot), description (column names), authors and dates"],
            ["**Datasets**", "**Provenance** (where it came from), location of raw data, responsible person/team, creation/version date, **use restrictions** (licences, governance)"],
            ["**Features**", "Definition version, responsible team (who to call in an incident), creation/update dates, **use restrictions** (illegal in some jurisdictions)"],
            ["**Labels**", "Label-definition version (which instructions), label-set version (corrections), **source** (vendor, human + QA, algorithm), **confidence** (lower for automated or new labellers)"],
            ["**Experiments / training**", "Data version (hash, sample), environment (requirements.txt, conda.yml, Dockerfile), code version (git SHA), hyperparameters, metrics and learning curves, hardware use (CPU/GPU/TPU/memory), evaluation metrics, charts (ROC, confusion matrix), sample predictions"],
            ["**Trained models**", "Model package/location, model version (code + data + hyperparameters + environment), evaluation history, linked experiments, creator/maintainer, downstream datasets, **drift metrics**, production hardware use"],
            ["**Pipelines**", "Inputs/outputs of each DAG node and whether inputs are complete; **cached outputs** to resume from the middle (which run, which binary produced them). Produced automatically by tools such as **MLMD** in **TFX**"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "For any model you should be able to answer **“which Data, which Code, which Settings, which Environment, which Results?”** (“**D-C-S-E-R**”).",
        },
      ],
    },
    {
      id: "systems",
      heading: "Lesson 5: Where does metadata live? Metadata systems and stores",
      slides: "48–60",
      blocks: [
        {
          type: "p",
          text: "A **metadata system** keeps track of what we're doing: minimally which feature definitions exist and which versions are used by which model definitions and trained models (slide 49). Most organisations start **without** one and regret it, then build several narrow ones.",
        },
        {
          type: "table",
          caption: "One system or many? (slides 50–52)",
          head: ["", "One system", "Multiple systems"],
          rows: [
            ["**How**", "Track features, labels, models, deployments and quality in one place", "Separate systems: features & labels, training, serving, quality monitoring"],
            ["**Advantage**", "Easy correlation, analysis and reporting across everything", "Decoupled, nimble, easy to change; an outage has limited impact"],
            ["**Drawback**", "Hard schema design, constant new columns and backfills, hard to stabilise; an outage blocks labellers and feature engineers", "Hard cross-system analysis; must share **unique IDs** so data can be joined"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Design rule (slide 51)",
          text: "Keep metadata systems **out of the live path** of model training and serving, so a metadata outage never stops production.",
        },
        {
          type: "table",
          caption: "Build, open source or buy? (slides 53–56)",
          head: ["Option", "Pros", "Cons"],
          rows: [
            ["**Build**", "No licence; exactly fits your case; change it any way you like", "You implement, host, document, fix bugs and integrate it; failures are your fault"],
            ["**Open source**", "No licence; already built; docs and community; others add features", "You host and adapt it; community support only; may be abandoned"],
            ["**Buy**", "Nothing to build; vendor docs and support; hosted; request features", "Licence fee; can't fix bugs yourself; vendor may be slow or go out of business"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "ML metadata store (slides 58–60)",
          text: "A **centralised place to manage all metadata about experiments, artifacts, models and pipelines**. It holds the **metadata**, not the artifacts themselves, with a UI to **log, store, display, monitor, compare, organise, filter and query** it.\n- **Repository:** stores metadata objects and their relationships (even GitHub can be one).\n- **Registry:** a **checkpoint** of important metadata for one specific thing (e.g. a model registry of production models).\n- **Store:** where you go **“shopping”**: search, compare, pick.\n**Pipeline-first** stores (MLMD powering Kubeflow, TFX) centre the process; **model-first** stores (MLflow, Neptune) centre the output.",
        },
      ],
    },
    {
      id: "lineage",
      heading: "Lesson 6: Metadata management and data lineage",
      slides: "61–66",
      blocks: [
        {
          type: "p",
          text: "**Metadata management** captures, organises and maintains metadata: structural, descriptive and administrative (slide 62). **Data lineage** records a dataset's **origin, movement and changes** over time; it traces errors back to their source, shows how upstream changes affect downstream processes, and supports compliance (slide 63).",
        },
        {
          type: "table",
          caption: "Three directions of lineage (slide 63)",
          head: ["Type", "Shows"],
          rows: [
            ["**Forward**", "How data moves from source to destination (impact of a change)"],
            ["**Backward**", "Where data came from (root cause)"],
            ["**Horizontal**", "Flow across systems and processes"],
          ],
        },
        {
          type: "table",
          caption: "Metadata management vs data lineage (slide 66)",
          head: ["", "Metadata management", "Data lineage"],
          rows: [
            ["**Definition**", "Managing data about data: description, structure, administration", "A specific type of metadata tracking data's journey and transformations"],
            ["**Purpose**", "Consistency, quality, usability, security", "Visibility and traceability of each data item"],
            ["**Components**", "Definitions, mappings, data models, business rules", "Original source, transformations, who accessed it, where it moved"],
            ["**Benefits**", "Discovery, governance, compliance, quality, integration", "Understanding transformations, usage tracking, debugging, **impact analysis**, compliance"],
            ["**Users**", "Analysts, scientists, stewards, IT, business", "Data engineers, analysts, governance teams, IT"],
          ],
        },
        {
          type: "p",
          text: "**Relationship (slides 64–65):** lineage is part of descriptive metadata (who accessed, what changed, when, why). Together they answer: where does data come from, how is it related, how is it used, how does it change?",
        },
      ],
    },
    {
      id: "tracking",
      heading: "Lesson 7: Experiment tracking",
      slides: "67–92",
      blocks: [
        {
          type: "p",
          text: "**The pain (slides 68–69):** experiments differ in model, hyperparameters, data, code and even library versions; results end up scattered across laptops, cloud machines, clusters and Colab. **Experiment tracking** is *saving all the information you care about for every experiment you run* (slide 70), so you can compare runs and stop hopeless ones early.",
        },
        {
          type: "table",
          caption: "What to track (slides 70, 78–79)",
          head: ["Item", "How"],
          rows: [
            ["**Code**", "Preprocessing, training, evaluation scripts and notebooks"],
            ["**Environment**", "Dockerfile, requirements.txt, pyproject.toml, conda.yml (or built images)"],
            ["**Data**", "Version hash or immutable location; DVC `.dvc` files"],
            ["**Parameters**", "Full run configuration; careful with command-line arguments, which are easy to forget"],
            ["**Metrics**", "Train, validation and test metrics for every run"],
            ["**Also**", "Model weights, charts (confusion matrix, ROC), example predictions"],
          ],
        },
        {
          type: "p",
          text: "**Components (slide 71):** an **experiment database** (stores and queries metadata), an **experiment dashboard** (visual interface) and a **client library** (logging and querying from code).",
        },
        {
          type: "table",
          caption: "Experiment tracking vs model management vs MLOps (slides 72–73)",
          head: ["", "Focus"],
          rows: [
            ["**Experiment tracking**", "The iterative **development** phase: try many things; useful even if a model never reaches production (research)"],
            ["**ML model management**", "Starts when models go to **production**: versioning, registry, testing versions in production, rollback"],
            ["**MLOps**", "The whole discipline; experiment tracking is one sub-discipline of it"],
          ],
        },
        {
          type: "table",
          caption: "Four benefits (slides 74–77)",
          head: ["Benefit", "Meaning"],
          rows: [
            ["**One source of truth**", "All experiments from every machine in one place: search, filter, drill down, reproduce, access even if the server is gone"],
            ["**Automated comparison**", "Compare metrics, parameters, learning curves, confusion matrices, code diffs, hardware use, SHAP/LIME"],
            ["**Collaboration**", "See what everyone is doing, share results, query programmatically"],
            ["**Live monitoring**", "Watch runs live from anywhere; stop bad ones early"],
          ],
        },
        {
          type: "table",
          caption: "Three ways to implement (slides 80–84)",
          head: ["Approach", "Pros", "Cons"],
          rows: [
            ["**Manual** (spreadsheets + naming conventions)", "Easy; fine for small personal projects", "Falls apart at scale; wrong entries; overwriting others' work"],
            ["**Git / GitHub** (commit metrics and charts via post-commit hooks)", "Uses existing tools", "Git wasn't built for ML: comparing more than two runs is hard, many experiments are hard to organise, **no live monitoring**"],
            ["**Dedicated tracking tools**", "ML-first: easier, better integrations, experiment-focused features", "Tool choice / cost"],
          ],
        },
        {
          type: "table",
          caption: "Six tracking tools (slides 86–92)",
          head: ["Tool", "Distinguishing feature"],
          rows: [
            ["**MLflow**", "Logs parameters, metrics, artifacts; compare runs; **model registry with stages** (staging → production)"],
            ["**Comet**", "Cloud platform; real-time logging; Git code snapshots; collaboration"],
            ["**Weights & Biases (W&B)**", "Rich visualisations; real-time tracking; **hyperparameter sweeps**"],
            ["**Neptune**", "Flexible API with **nested metadata structure**; custom dashboards"],
            ["**DVC**", "Open source; versions data, models and pipelines with **Git**; DAG pipelines; any storage (S3, GCS, Azure)"],
            ["**DagsHub**", "GitHub-like collaboration built on **Git + DVC + MLflow**; lineage; no vendor lock-in"],
          ],
        },
      ],
    },
    {
      id: "registry",
      heading: "Lesson 8: The model registry",
      slides: "93–118",
      blocks: [
        {
          type: "p",
          text: "**Two problem stories (slides 94–95).** (1) A lone data scientist hands raw model files to operations, who ask: *how do I use it? was it tested? what are its dependencies?* (2) The team grows (engineers, a product manager) and asks: *where is the best version? how was it trained? where are its docs? how do we review it? how do we plug it into deployment tools?* A **model registry** answers all of these.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Definition (slide 96)",
          text: "A **model registry** is a **centralised repository for managing and documenting trained models**: clear naming, complete metadata, collaboration between data scientists and operations. Data scientists **push** trained models in; from there they are **tested, validated and deployed**.",
        },
        {
          type: "table",
          caption: "Related terms (slides 97–99)",
          head: ["Term", "Meaning"],
          rows: [
            ["**Model repository**", "Just a **storage location** for model files"],
            ["**Model registry**", "Tracks and manages the **full lifecycle**: versions, metadata, stages, approvals"],
            ["**Model store**", "**Superset** of a registry: a service other services call to fetch models, plus logging, discovery, assets, pipelines"],
            ["**Experiment tracking**", "Records the runs that **produce** candidate models; the registry registers the chosen ones"],
          ],
        },
        {
          type: "table",
          caption: "Key features (slides 100–109)",
          head: ["Feature", "What it gives"],
          rows: [
            ["**Central storage**", "One view of all models and artifacts (not files lost in repos)"],
            ["**Bridge experiment ↔ production**", "Glue between data science, software and operations teams"],
            ["**Central UI**", "Search, view status (staged/deployed/retired), approve, read docs"],
            ["**API for downstream systems**", "Services fetch the most stable or any version; supports **CI/CD/CT**"],
            ["**Versioning**", "Register → version history → compare metrics/hyperparameters → new versions increment → old versions retained"],
            ["**Integration with training/experiments**", "Registers artifacts (weights, ONNX, Docker), dataset version, tags, metrics, owner, run ID, source version, dependencies, change history, docs"],
            ["**Staging integration**", "Integration and QA tests, **fairness**, explainability and regulatory checks, approval workflows, access control"],
            ["**CI/CD integration**", "Webhooks trigger actions; promotion dev → staging → production; highly available for automated jobs"],
            ["**Deployment integration**", "Serves models to REST services; collects production metrics for comparison and audit"],
          ],
        },
        {
          type: "p",
          text: "```flow\nExperiment tracking: many runs -> Register best model v3 -> Staging: tests, fairness, approval -> Production serving -> Monitor -> Retrain -> Register v4 or roll back to v3\n```",
        },
        {
          type: "table",
          caption: "Registry by MLOps maturity (slides 111–113)",
          head: ["Level", "Role of the registry"],
          rows: [
            ["**Level 0** (manual)", "Data scientist prepares and registers the artifact by hand; operations push it to staging, then production"],
            ["**Level 1** (automated training pipeline)", "Pipeline outputs (model + metadata) flow into the registry automatically; models are staged and promoted if they pass tests: **continuous training**"],
            ["**Level 2** (CI/CD automation)", "Same as level 1, plus event triggers promote models with better metrics after retraining, or archive old ones"],
          ],
        },
        {
          type: "table",
          caption: "Build, maintain or buy a registry? (slides 114–117)",
          head: ["Option", "You need / consider"],
          rows: [
            ["**Build**", "Object storage, a database, APIs for promotion, a UI. Ask: incentive, skills, time, who operates it, total cost"],
            ["**Maintain (self-host open source)**", "Licence type, operations and updates, hosting cost, missing features, support (community only?), documentation"],
            ["**Buy (fully managed)**", "Industry and privacy rules (on-premises only?), features, licence cost, security, performance for large models, availability/SLA, support, ease of use"],
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
      text: "Run experiments systematically, record metadata for every dataset, feature, label, model and pipeline, track experiments in one place, and manage chosen models through a registry.",
    },
    {
      type: "list",
      items: [
        "**Data:** train (learn) / validation (tune) / test (final); k-fold, LOOCV, LPOCV, shuffle splits.",
        "**4 experiments:** model selection, feature engineering, hyperparameter tuning, data augmentation; search by grid, random, Bayesian, Hyperband, genetic.",
        "**Validation pillars:** conceptual soundness, data quality, process verification, outcomes, monitoring, governance.",
        "**Metadata types:** descriptive, structural, administrative, technical, statistical; log for artifacts, datasets, features, labels, experiments, models, pipelines (MLMD/TFX).",
        "**Systems:** one (easy analysis, fragile) vs many (decoupled, need shared IDs); keep out of the live path; build vs open source vs buy.",
        "**Repository** stores, **registry** checkpoints, **store** = shopping; pipeline-first (MLMD) vs model-first (MLflow, Neptune).",
        "**Lineage:** forward, backward, horizontal; part of descriptive metadata.",
        "**Experiment tracking:** code, environment, data, parameters, metrics; DB + dashboard + client; manual vs Git vs tools (MLflow, Comet, W&B, Neptune, DVC, DagsHub).",
        "**Model registry:** central storage, UI, API, versioning, staging checks, CI/CD, deployment; MLOps levels 0/1/2; build/maintain/buy.",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: what metadata to capture for reproducibility · experiment tracking approaches and tools · model registry features and its role in MLOps levels · one vs multiple metadata systems.",
    },
  ],

  glossary: [
    ["Training / validation / test set", "—", "Data to learn / tune and choose / give the final unbiased check"],
    ["Overfitting", "—", "Good on training data, poor on unseen data"],
    ["k-fold cross-validation", "—", "Train on k−1 folds, test on the remaining one, k times, average"],
    ["LOOCV / LPOCV", "Leave-One-Out / Leave-P-Out Cross-Validation", "Leave out one / p observations at a time"],
    ["Shuffle split", "—", "Repeated random train/test splits controlled by a seed"],
    ["Hyperparameter", "—", "Setting fixed before training (learning rate, layers)"],
    ["Grid / random search", "—", "Try all combinations / random combinations of hyperparameters"],
    ["Bayesian optimisation", "—", "Probabilistic model of the loss guides the hyperparameter search"],
    ["Hyperband", "—", "Repeatedly drops the worst half of configurations"],
    ["Model validation", "—", "Checking a model's accuracy, robustness and generalisability"],
    ["Challenger model", "—", "Alternative model benchmarked against the current one"],
    ["Metadata", "—", "Data about data"],
    ["Descriptive / structural / administrative / technical / statistical metadata", "—", "Discovery / organisation / access & compliance / format & storage / collection methods"],
    ["Artifact", "—", "Input or output of runs: dataset, model, predictions"],
    ["md5 hash", "—", "Fingerprint used to identify a data/model version"],
    ["Provenance", "—", "Where data came from"],
    ["Git SHA", "—", "Unique ID of a code commit"],
    ["MLMD", "ML Metadata", "Pipeline metadata library used in TFX"],
    ["TFX", "TensorFlow Extended", "Google's end-to-end ML pipeline platform"],
    ["ML metadata store", "—", "Central place for experiment, model, artifact and pipeline metadata"],
    ["Data lineage (forward / backward / horizontal)", "—", "Where data goes / came from / flows across systems"],
    ["Experiment tracking", "—", "Saving all relevant information for every experiment"],
    ["MLflow / Comet / W&B / Neptune / DVC / DagsHub", "—", "Experiment tracking and versioning tools"],
    ["Hyperparameter sweep", "—", "Automatic exploration of many hyperparameter combinations (W&B)"],
    ["Model registry", "—", "Central system managing model versions, metadata and lifecycle stages"],
    ["Model repository / model store", "—", "Just storage / superset of a registry offered as a service"],
    ["ONNX", "Open Neural Network Exchange", "Portable model file format"],
    ["CI/CD/CT", "Continuous Integration / Delivery / Training", "Automated test, deploy and retrain"],
    ["MLOps levels 0/1/2", "—", "Manual / automated training pipeline / automated CI/CD pipeline"],
  ],

  examTips: [
    "For reproducibility questions, list **data version, code version, environment, hyperparameters, metrics** (D-C-S-E-R) and name the tool that stores each.",
    "Separate the three ideas clearly: **experiment tracking** (development), **metadata store** (all metadata), **model registry** (chosen models through stages).",
    "Use comparison tables: one vs multiple metadata systems; build vs open source vs buy; manual vs Git vs dedicated tools.",
    "Draw the flow experiment → registry → staging → production → monitor → retrain/rollback.",
  ],

  theory: [
    {
      title: "Metadata for reproducible ML",
      marks: 5,
      question: "A regulator asks a bank to reproduce the exact credit-scoring model that was in production six months ago. What metadata must the ML team have captured for datasets, features, labels, experiments, models and pipelines?",
      solution: `
### What the examiner wants
Specific metadata items per object, why each matters, and where they are stored, tied to the reproduction scenario.

### Model answer
**Metadata = data about data**; for ML it must answer *which data, code, settings, environment and results* produced a model (slides 37–47).

| Object | Metadata to have captured | Why it matters here |
|---|---|---|
| **Dataset** | Provenance, raw location, owner, version date, use restrictions | Retrieve the exact loan data used six months ago and prove it was allowed |
| **Features** | Definition version, owner, created/updated dates, use restrictions | Recompute *debt_to_income_v2*, not today's v3; some features may be illegal in some jurisdictions |
| **Labels** | Label-definition version, label-set version, source, confidence | “Default” may have been redefined or corrected since |
| **Experiment/training** | Data hash, **git SHA**, environment (requirements.txt, Dockerfile), hyperparameters, metrics, hardware | Re-run training identically |
| **Model** | Package location, model version, evaluation history, linked runs, owner, drift metrics | Fetch the artifact and show how it performed |
| **Pipeline** | Node inputs/outputs, cached outputs, run IDs (MLMD/TFX) | Re-execute or audit each step |

\`\`\`flow
Model v7 in registry -> Linked experiment run -> Data hash + git SHA + environment + hyperparameters -> Feature and label definition versions -> Rebuild identical model
\`\`\`

**Where it lives:** an **ML metadata store** (holds metadata, not the artifacts), a **model registry** for the production model, **experiment tracking** for runs, and **lineage** (backward lineage answers “where did this come from?”).

**Design notes:** keep metadata systems **out of the live path** of training and serving; if multiple systems are used, share **unique IDs** so they can be joined (slides 51–52). Benefits: **trust and compliance**: knowing who touched what and when is non-negotiable in finance (slide 33).`,
    },
    {
      title: "Experiment tracking: approaches and tools",
      marks: 5,
      question: "A growing data-science team runs experiments on laptops, Colab and a cloud cluster, and cannot tell which run produced the best model. Explain experiment tracking, what to track, the implementation approaches and suitable tools.",
      solution: `
### Model answer
**Experiment tracking** saves all relevant information for every experiment you run (slide 70). Without it, results are scattered across machines and you can't compare or reproduce runs (slides 68–69, 75).

**What to track (slides 78–79):** code (scripts, notebooks), environment (Dockerfile, requirements.txt, conda.yml), **data version** (hash, DVC file), parameters (full config, including command-line arguments), metrics (train/val/test), model weights, charts (confusion matrix, ROC), sample predictions.

**Components (slide 71):** experiment **database** + **dashboard** + **client library**.

| Approach | Pros | Cons |
|---|---|---|
| Spreadsheets + naming conventions | Easy for one person | Breaks at scale, errors, overwrites |
| Git with post-commit hooks | Familiar | Can't compare many runs, hard to organise, no live monitoring |
| **Dedicated tool** | ML-first, integrations, comparisons | Choose and maintain a tool |

\`\`\`flow
Laptop run + Colab run + Cluster run -> Client library logs to one tracking server -> Dashboard: compare metrics, curves, code diffs -> Pick best -> Register in model registry
\`\`\`

**Tools (slides 87–92):** **MLflow** (open source, includes a model registry with stages), **W&B** (visualisation, hyperparameter sweeps), **Comet** (real-time, Git snapshots), **Neptune** (flexible nested metadata), **DVC** (Git-based data/pipeline versioning), **DagsHub** (Git + DVC + MLflow collaboration).

**Benefits (slide 74):** one source of truth, automated comparison, collaboration, live monitoring (stop bad runs early). Tracking is useful even if a model never reaches production (slide 73).`,
    },
    {
      title: "The model registry in MLOps",
      marks: 5,
      question: "Explain what a model registry is, how it differs from a model repository and experiment tracking, its key features, and its role at MLOps levels 0, 1 and 2.",
      solution: `
### Model answer
**Definition (slide 96):** a **centralised repository to manage and document trained models**: naming, metadata, versions and lifecycle stages, bridging data scientists and operations.

| Term | Role |
|---|---|
| Model repository | Only stores model files |
| Experiment tracking | Records all runs during development |
| **Model registry** | Manages the chosen models' **full lifecycle** (versions, stages, approvals) |
| Model store | Superset of the registry offered as a service |

**Key features (slides 100–109):** central storage and UI (search, status, approve, docs); **API** for downstream services; **versioning** (register → history → compare → retain old versions → rollback); integration with training (registers weights/ONNX/Docker, dataset version, owner, run ID, dependencies); **staging** checks (integration/QA tests, fairness, explainability, regulatory compliance, access control); **CI/CD** (webhooks, promotion dev → staging → prod); deployment integration with production metrics.

\`\`\`flow
Training pipeline -> Register model v5 + metadata -> Staging: QA, fairness, approval -> Promote to production -> Monitor metrics -> Better retrained model: promote v6 or roll back to v4
\`\`\`

**MLOps levels (slides 111–113):**
- **Level 0:** manual: the data scientist packages and registers the model; operations deploy it.
- **Level 1:** automated training pipeline writes models and metadata into the registry → **continuous training**; models staged and promoted after tests.
- **Level 2:** plus CI/CD automation and **event triggers** that promote better models or archive old ones.

**Setting one up (slides 114–117):** build (storage, DB, API, UI; skills, time, cost), maintain open source (operations, support, features), or buy managed (privacy rules, security, performance, SLA, cost).`,
    },
    {
      title: "One metadata system or many?",
      marks: 5,
      question: "An organisation is designing metadata systems for features, labels, training, serving and quality monitoring. Compare one central system with multiple systems, and explain how to decide between building, using open source and buying.",
      solution: `
### Model answer
A **metadata system** keeps track of what we're doing: which feature definitions exist and which versions are used in which models (slide 49). Quality and fairness evaluation must read across features, labels, models and deployments (slide 50).

| | **One system** | **Multiple systems** |
|---|---|---|
| Analysis | Easy correlation and reporting | Hard; must join across systems |
| Design | Complex schema, constant new columns and backfills | Each simple and nimble |
| Reliability | Hard to stabilise; an outage blocks feature engineers and labellers | Outage impact limited |
| Requirement | — | **Shared unique IDs** or a mapping system so data can be joined |

**Rule:** keep metadata systems **out of the live path** of training and serving (slide 51).

\`\`\`flow
Feature metadata + Label metadata + Training metadata + Serving metadata -> Shared IDs -> Quality and fairness analysis
\`\`\`

**Build vs open source vs buy (slides 53–56):** first understand the real problem, check existing tools, and estimate build and maintenance effort.

| Option | Pros | Cons |
|---|---|---|
| Build | Fits exactly, no licence | Implement, host, document, fix everything yourself |
| Open source | Ready-made, community, no licence | Host and adapt; may be abandoned |
| Buy | Vendor support, hosted | Licence fee; dependent on vendor |

**Recommendation for a mid-size team:** a few decoupled systems (e.g. feature store registry + MLflow tracking/registry + monitoring) linked by shared run and model IDs, using open source first.`,
    },
  ],

  quiz: [
    { q: "Which data set gives the final, unbiased check after development?", options: ["Training", "Validation", "Test", "Augmented"], answer: 2, why: "Slides 7–8." },
    { q: "LOOCV is k-fold cross-validation where k equals:", options: ["2", "10", "the number of observations", "the number of features"], answer: 2, why: "Slide 13." },
    { q: "Keeping the model fixed and changing learning rate and layers between runs is:", options: ["Model selection", "Feature engineering", "Hyperparameter tuning", "Data augmentation"], answer: 2, why: "Slide 20." },
    { q: "Which search method drops the worst 50% of configurations between rounds?", options: ["Grid search", "Hyperband", "Bayesian optimisation", "Random search"], answer: 1, why: "Slide 20." },
    { q: "“Was the model built and deployed correctly?” is which validation pillar?", options: ["Conceptual soundness", "Process verification", "Outcomes analysis", "Governance"], answer: 1, why: "Slide 28." },
    { q: "Primary/foreign keys and table schemas are which type of metadata?", options: ["Descriptive", "Structural", "Administrative", "Statistical"], answer: 1, why: "Slide 35." },
    { q: "Label confidence and label source are examples of metadata for:", options: ["Features", "Labels", "Pipelines", "Hardware"], answer: 1, why: "Slide 40." },
    { q: "Cached outputs and node inputs/outputs are part of:", options: ["Pipeline metadata", "Dataset provenance", "Feature metadata", "Descriptive metadata"], answer: 0, why: "Slide 47." },
    { q: "A main drawback of multiple metadata systems is:", options: ["One outage stops everything", "Harder analysis across systems", "Complex single schema", "No decoupling"], answer: 1, why: "Slide 52." },
    { q: "An ML metadata store holds:", options: ["The model weights themselves", "Metadata about artifacts, not the artifacts", "Only code", "Only logs"], answer: 1, why: "Slide 58." },
    { q: "Lineage showing where a value came from is:", options: ["Forward", "Backward", "Horizontal", "Vertical"], answer: 1, why: "Slide 63." },
    { q: "Why is Git alone weak for experiment tracking?", options: ["It can't store text", "Comparing many runs is hard and there's no live monitoring", "It is too expensive", "It has no history"], answer: 1, why: "Slide 83." },
    { q: "Which tool is known for hyperparameter sweeps?", options: ["DVC", "Weights & Biases", "DagsHub", "Dolt"], answer: 1, why: "Slide 89." },
    { q: "At MLOps level 1 the model registry mainly enables:", options: ["Manual handoffs", "Continuous training via automated pipelines", "Deleting models", "Data labelling"], answer: 1, why: "Slide 112." },
  ],
};
