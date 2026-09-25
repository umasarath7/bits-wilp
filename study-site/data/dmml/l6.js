// DMML — Lecture 6: ML Lifecycle & Workflow
// Source: CourseFiles/DMML/L6-ML lifecycle and Workflow (3).pptx (121 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "ML Lifecycle & Workflow",
  source: "L6-ML lifecycle and Workflow.pptx · 121 slides",
  overview:
    "This is the biggest lecture, and it contains a previous-paper question (**PYQ Q5**: the data engineering pipeline, with a diagram). It follows an ML project from **idea to production and back**. **Why** is ML a *cycle* rather than a straight line? **Why** does everything start with the business goal? **How** is data collected and prepared, **how** is a model trained, evaluated and packaged, and **how** is it released safely and served? **What** are the three levels of ML software: Data, Model, Code? And **why** do so many ML deployments fail? Running example: an online grocery (like BigBasket) that wants to forecast demand for each product so it stocks enough without wasting fresh food.",

  summary: [
    {
      id: "lifecycle",
      heading: "Lesson 1: Why is ML a lifecycle and not a one-off project?",
      slides: "5–8",
      blocks: [
        {
          type: "p",
          text: "Ordinary software is built, tested and shipped, and it keeps behaving the same way until someone changes the code. An ML model is different: it learnt from **past data**, and the world keeps changing. New products launch, festivals shift demand, customer habits drift. So an ML system must be **watched and refreshed continually**. That's why the slides draw it as a **cycle**:",
        },
        {
          type: "p",
          text: "**The phases are not strictly sequential** (slide 6). Feedback loops can send you back at any point: monitoring spots drift, so you go back to data processing; evaluation shows the model is weak, so you go back to feature engineering.",
        },
        { type: "diagram", name: "d6-cycle" },
        {
          type: "table",
          caption: "The six phases at a glance",
          head: ["Phase", "The question it answers", "Grocery example"],
          rows: [
            ["**Business goal**", "What outcome do we want?", "Cut fresh-produce waste by 20% without more stock-outs"],
            ["**ML problem framing**", "What exactly will the model predict, and how will we measure it?", "Predict tomorrow's units sold per product per store; measure the error in units"],
            ["**Data processing**", "What data, and how do we get it ready?", "Past orders, prices, promotions, weather, holidays → cleaned features"],
            ["**Model development**", "Which model, trained and tuned how?", "Try regression and gradient boosting; tune; evaluate"],
            ["**Deployment**", "How does it make real predictions?", "Nightly batch forecasts written to the ordering system"],
            ["**Monitoring**", "Is it still working?", "Compare forecasts with actual sales; watch for drift"],
          ],
        },
      ],
    },
    {
      id: "goal",
      heading: "Lesson 2: Why start with the business goal? Framing the problem",
      slides: "9–15",
      blocks: [
        {
          type: "p",
          text: "**The business goal is the most important phase** (slide 9). A brilliant model that answers the wrong question is worthless. Before touching data, the team should:",
        },
        {
          type: "list",
          items: [
            "**Understand the requirements** and **align all stakeholders** (operations, finance, store managers).",
            "**Form the business question** and identify the must-have features.",
            "Consider what **new processes** the model will need (who acts on the forecast?).",
            "Define the **business metrics** the model should improve (waste %, stock-out rate).",
            "Review **data feasibility**: do we even have the data?",
            "Estimate **costs**: acquiring data, training, running inference, and **the cost of wrong predictions** (over-forecast → rotten tomatoes; under-forecast → empty shelves).",
            "Plan for **production**: how will ML errors be handled, what's the path to production?",
            "Agree a **Definition of Done** / acceptance criteria.",
          ],
        },
        {
          type: "p",
          text: "**ML problem framing (slides 11–14)** turns the business goal into a precise ML task:",
        },
        {
          type: "list",
          items: [
            "Decide **what is observed** (inputs) and **what is predicted** (the **label** or **target**).",
            "Define **success criteria** and an observable **performance metric** (e.g. accuracy, or average error in units).",
            "**Link the technical metric to the business outcome** (a 10% lower forecast error → X% less waste), and get stakeholders to agree.",
            "**Ask whether ML is needed at all.** Maybe a simple rule (“order last week's sales + 10%”) is good enough, or the data isn't sufficient.",
            "Plan **data sourcing and annotation** (labelling).",
            "**Start with a simple, interpretable model**, then iterate.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "One goal, many ML problems (slide 15)",
          text: "A manufacturer wants **more profit**. That single goal could be framed as: forecast demand for **existing products**; forecast **input materials** to cut capital locked up in stock; or predict sales of a **new product**. Each is a *different* ML problem, with different data, labels and metrics. Framing is a choice, not a given.",
        },
      ],
    },
    {
      id: "arch",
      heading: "Lesson 3: What machinery supports the lifecycle?",
      slides: "16–21",
      blocks: [
        {
          type: "p",
          text: "When a company runs many models, the same needs keep recurring: shared features, versioned models, alerts, scheduled retraining. The slides list the standard components of an **ML lifecycle architecture**:",
        },
        {
          type: "table",
          head: ["Component", "What it does", "Why it's needed"],
          rows: [
            ["**Online / offline feature store**", "Stores ready-made features. **Online**: low latency for real-time predictions. **Offline**: full history for training and batch scoring", "Teams stop rewriting the same feature code, and training and serving use identical features"],
            ["**Model registry**", "Stores model artifacts + metadata (which data, which code); version control and **lineage** of models", "You can always answer “which model is live, and how was it made?”"],
            ["**Performance feedback loop**", "From evaluation **during development** back to data preparation", "A weak model sends you back to fix the data"],
            ["**Model drift feedback loop**", "From evaluation **in production** back to data preparation", "Drift triggers new data work and retraining"],
            ["**Alarm manager**", "Receives monitoring alerts and notifies the right target, e.g. the retraining pipeline", "Problems get acted on automatically"],
            ["**Scheduler**", "Triggers retraining at business-defined intervals", "Models stay fresh"],
            ["**Lineage tracker**", "Can re-create the ML environment at any point in time (versions of every resource)", "Reproducibility and audit"],
          ],
        },
      ],
    },
    {
      id: "data",
      heading: "Lesson 4: How is data collected and prepared?",
      slides: "22–36",
      blocks: [
        {
          type: "p",
          text: "**Why data matters so much in ML (slide 22).** Data **defines the goal** (the input–output pairs the model must learn); it **trains** the algorithm; it's used to **measure performance** as data drifts; and it forms the **baseline dataset** against which future drift is detected.",
        },
        {
          type: "p",
          text: "**Step 1: Collection (slides 23–25).** **Label** the data (manually or automatically). **Ingest and aggregate** from many sources: time series, events, sensors, IoT, social media. Ingestion is **real-time** (streaming) or **historical** (batch). Store it in SQL databases, lakes, warehouses or lakehouses, with ETL automating the movement.",
        },
        {
          type: "p",
          text: "**Step 2: Pre-processing (slides 26–31).** The slides use a small example: a class register where **one student was entered three times**, **one age is 100 instead of 10**, and **some students are missing**. Pre-processing fixes such problems:",
        },
        {
          type: "list",
          items: [
            "**Clean:** remove duplicates and outliers; impute missing values.",
            "**Partition:** randomly split into training, validation and test sets. **Remove duplicates *before* splitting**; otherwise the same record can land in both training and test, which is **data leakage**, and the test score looks better than reality.",
            "**Scale:** normalise to [0, 1] or standardise to mean 0 and standard deviation 1.",
            "**Unbias and balance:** fix skewed representation (Lecture 8).",
            "**Augment:** create synthetic variations of the data to regularise the model and reduce overfitting.",
          ],
        },
        {
          type: "p",
          text: "**Step 3: Feature engineering (slides 32–36).** Turn cleaned data into inputs the model can learn from:",
        },
        {
          type: "list",
          items: [
            "**Creation:** one-hot encoding, binning, splitting fields, calculated features (*grocery:* “is it a festival week?”, “price discount %”).",
            "**Transformation and imputation:** replace missing or invalid values; Cartesian products of features; non-linear transforms; domain-specific features.",
            "**Extraction:** dimensionality reduction such as PCA (Principal Component Analysis), ICA (Independent Component Analysis) and LDA (Linear Discriminant Analysis).",
            "**Selection:** choose the subset of features that minimises error, using feature importance or a correlation matrix.",
          ],
        },
        {
          type: "p",
          text: "Exploratory data analysis (EDA), visualisation, data-wrangling tools, low/no-code tools and GenAI code assistants can all speed up preparation.",
        },
      ],
    },
    {
      id: "model",
      heading: "Lesson 5: How is a model trained, shipped and watched?",
      slides: "37–54",
      blocks: [
        {
          type: "p",
          text: "**Training and tuning (slides 37–43).** The ingredients: the features; **versioned code** under CI; **algorithm selection** (based on the success metric, how explainable it must be, and compute cost). Big models are trained in a distributed way:",
        },
        {
          type: "list",
          items: [
            "**Data parallelism:** split the **data** into mini-batches spread across machines; each machine has a full copy of the model.",
            "**Model parallelism:** split the **model itself** across machines, when it's too big for one.",
          ],
        },
        {
          type: "p",
          text: "Then **debug and profile** (bottlenecks, overfitting, saturated activations, vanishing gradients), measure **validation metrics** (confusion matrix, RMSE), and run **hyperparameter optimisation** (learning rate, epochs, layers, units, activations). Training runs inside **containers**, and produces **model artifacts**: the learnt parameters, the model definition and metadata.",
        },
        {
          type: "p",
          text: "**Pre-production pipelines (slide 44):** a **data-prepare pipeline**, a **feature pipeline** (writes to and reads from the feature store), and a **CI/CD/CT pipeline**.",
        },
        {
          type: "p",
          text: "**Evaluation (slide 45):** **offline**, on a holdout set never used for training or validation; and **online**, on live data after deployment.",
        },
        {
          type: "p",
          text: "**Deployment (slides 46–48)** passes governance and quality gates. At runtime the app sends a request (payload) to an **endpoint**; the model is fetched from the **registry**, features from the **feature store**, and code from the **container repository**. Two production pipelines follow: an **inference pipeline** (prepare data → predict → post-process; batch or real-time) and a **scheduler pipeline** (retrain at intervals to limit drift).",
        },
        {
          type: "p",
          text: "**Monitoring (slides 49–54):** capture live data, compare it with the training data, apply rules, raise alerts. What can go wrong: **data quality**, **model quality**, **bias drift** (predictions becoming unfair to a group), and **feature-attribution drift** (the model starts relying on different features). Two kinds of drift to know precisely:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Data drift vs concept drift",
          text: "- **Data drift:** the **distribution of the inputs** changes. *Grocery:* a new customer segment (office canteens) starts ordering in bulk.\n- **Concept drift:** the **relationship between inputs and target** changes. *Grocery:* after a price war, the same discount now produces far fewer extra sales than before.\n\nWhen either is detected, the alarm manager triggers the **model update (retraining) pipeline**. **Explainability** tools help understand why predictions change.",
        },
        { type: "diagram", name: "d6-drift" },
      ],
    },
    {
      id: "deploy",
      heading: "Lesson 6: How do we release a new model safely? Deployment strategies",
      slides: "55–58",
      blocks: [
        {
          type: "p",
          text: "Replacing a live model is risky: if the new one is worse, customers suffer immediately. Four strategies reduce that risk (slides 55–58):",
        },
        {
          type: "table",
          head: ["Strategy", "How it works", "When to use it"],
          rows: [
            ["**Blue/green**", "Two identical production environments. The new model is tested on **green**, then live traffic switches from **blue** to green in one go; the roles swap for the next release", "Near-zero downtime and **instant rollback** (switch back to blue)"],
            ["**Canary**", "Release to a **small group of users** first (like the canary miners took underground), then roll out gradually", "Catch problems while few users are affected"],
            ["**A/B testing**", "A defined share of traffic goes to the new model, the rest to the old; larger groups and a **longer** run (days or weeks) than canary", "Measure **business impact** (did waste actually fall?)"],
            ["**Shadow**", "The new model receives the **same inputs** in parallel, but **only the old model's output is used**; the new one's predictions are just recorded and analysed", "**Zero user risk**; compare before exposing anyone"],
          ],
        },
        { type: "diagram", name: "d6-deploy" },
      ],
    },
    {
      id: "three",
      heading: "Lesson 7: The three levels of ML software, and the data engineering pipeline (PYQ Q5)",
      slides: "59–72",
      blocks: [
        {
          type: "p",
          text: "Every ML-based product manages **three assets**, each with its own engineering discipline (slides 59–62):",
        },
        {
          type: "list",
          items: [
            "**Data**, handled by **data engineering**: acquiring and preparing data.",
            "**Model**, handled by **ML model engineering**: training and serving models.",
            "**Code**, handled by **code engineering**: integrating the model into the product.",
          ],
        },
        {
          type: "p",
          text: "```flow\nDATA: Data ingestion -> Exploration & validation -> Data wrangling (cleaning) -> Data splitting -> Training / validation / test sets\nMODEL: Model training (feature eng. + model eng. + HPO) -> Model evaluation -> Model testing -> Model packaging\nCODE: Model serving -> Performance monitoring -> Performance logging\n```",
        },
        {
          type: "p",
          text: "**The data engineering pipeline, step by step.** This is exactly what PYQ Q5 asked, so learn the four steps and the key activities in each.",
        },
        {
          type: "p",
          text: "**Step 1: Data ingestion (slides 63–65).** Collect data from internal and external sources: databases, data marts, OLAP cubes, warehouses, OLTP systems, Spark, HDFS; possibly synthetic data or enrichment. Key activities: identify the sources and their **provenance** (where the data came from); estimate the storage space needed; create a workspace; obtain the data and convert it to a usable format **without changing its content**; **back it up** (work on a copy); ensure **privacy compliance** (anonymise; GDPR); record a **metadata catalogue** (size, format, aliases, last modified time, access-control lists). And crucially: **set a test set aside now and never look at it**. Peeking at it while choosing models introduces **data-snooping bias**.",
        },
        {
          type: "p",
          text: "**Step 2: Exploration and validation (slides 66–68).** **Profiling** produces metadata about the content: maximum, minimum, average and so on. **Validation** runs user-defined error-detection routines: are the address components consistent, is the postcode correct, are values missing? Use notebooks (rapid application development tools); profile each attribute (name, record count, data type, numerical measures, **missing-value ratio** = missing values ÷ records, distribution type); identify the label attribute(s); visualise; look at correlations; identify any extra data needed.",
        },
        {
          type: "p",
          text: "**Step 3: Data wrangling / cleaning (slides 69–71).** Programmatically reformat or restructure the data (which may change the schema). **Write reusable scripts or functions**, because the same cleaning will run again on new data. Typical work: transformations; fix or remove outliers; fill missing values (with 0, the mean or the median) or drop the rows or columns; drop irrelevant attributes; restructure (reorder, extract or combine fields, filter records, change granularity by aggregating or pivoting).",
        },
        {
          type: "p",
          text: "**Step 4: Data splitting (slide 72).** Split into **training (≈80%)**, **validation** and **test** sets for the model stages that follow.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Why this pipeline deserves so much care",
          text: "Gartner describes data preparation as *an iterative, agile process of exploring, combining, cleaning and transforming raw data into curated datasets*. It's the **most expensive phase in time and resources**, and *garbage in, garbage out*: no model can recover from bad preparation.",
        },
      ],
    },
    {
      id: "mlpipe",
      heading: "Lesson 8: How is a model built and packaged for production?",
      slides: "73–84",
      blocks: [
        {
          type: "p",
          text: "**Model engineering (slides 73–77)** has two halves:",
        },
        {
          type: "list",
          items: [
            "**Feature engineering:** discretise continuous features; decompose categorical and date features (a date → day of week, month, is-holiday); transforms such as log, square root or x²; aggregations; scaling.",
            "**Model engineering:** code review and versioning of model specifications; train **many model families** with default parameters; compare them with N-fold cross-validation (mean ± standard deviation); do **error analysis**; shortlist 3–5 models that make **different kinds** of errors; tune hyperparameters with CV (the slides prefer **random search over grid search**); and consider **ensembles** (voting, bagging, boosting, stacking), which combine models whose errors differ.",
          ],
        },
        {
          type: "p",
          text: "**Evaluation and testing (slide 78):** check the model meets the **business objective**; then the final **model acceptance test** on the held-back test set estimates the generalisation error. This is the one and only time the test set is used.",
        },
        {
          type: "p",
          text: "**Packaging (slides 79–84).** The model must run **outside the environment where it was trained**: a scikit-learn model trained in a notebook might need to run inside a Spark job or a Java service. So it's exported to a portable format:",
        },
        {
          type: "table",
          caption: "Model serialisation formats",
          head: ["Kind", "Format", "Notes"],
          rows: [
            ["Language-agnostic", "**Amalgamation**", "Model + code bundled into one package or source file (e.g. SKompiler turns a model into SQL, Excel, PFA or SymPy → C/JS/Rust). Portable and compact for simple models"],
            ["Language-agnostic", "**PMML** (Predictive Model Markup Language)", "XML (.pmml), standardised by the Data Mining Group; not every algorithm is supported; licensing limits open-source use"],
            ["Language-agnostic", "**PFA** (Portable Format for Analytics)", "A JSON scoring engine, intended to replace PMML; needs a PFA-enabled runtime"],
            ["Language-agnostic", "**ONNX** (Open Neural Network Exchange)", "Framework-independent; backed by Microsoft, Facebook and Amazon; runs in ONNX runtimes"],
            ["Vendor-specific", "scikit-learn **.pkl** · H2O **POJO/MOJO** · Spark **MLeap** · TensorFlow **.pb** · PyTorch **.pt** (TorchScript) · Keras **.h5** · Apple **.mlmodel** (Core ML)", "Tied to one framework"],
          ],
        },
      ],
    },
    {
      id: "workflows",
      heading: "Lesson 9: How are models trained and served in production?",
      slides: "85–110",
      blocks: [
        {
          type: "p",
          text: "Two independent choices shape any ML system in production (slides 85–88):",
        },
        {
          type: "table",
          head: ["Choice", "Option A", "Option B"],
          rows: [
            ["**How is it trained?**", "**Offline / batch / static:** trained once on collected data and unchanged until retrained. Risk: **model decay**", "**Online / dynamic:** retrained regularly as new data streams in (time series, sensors, stock trading)"],
            ["**How does it predict?**", "**Batch:** predictions computed on a batch of input in advance. Fine when not time-critical", "**Real-time / on-demand:** predictions made from data available at request time"],
          ],
        },
        {
          type: "table",
          caption: "Four architecture patterns from combining them (slides 89–93)",
          head: ["Pattern", "Training", "Prediction", "Notes"],
          rows: [
            ["**Forecast**", "Offline", "Batch", "Academic/Kaggle-style; the easiest; rare in production. *Grocery nightly forecast fits here*"],
            ["**Web service**", "Offline", "Real-time", "The most common: a microservice returns predictions; the model stays fixed until retrained"],
            ["**Online learning** (real-time streaming analytics)", "Online (incremental)", "Real-time", "Learns on the fly; fits the **Lambda** architecture. **Drawback: bad incoming data quickly degrades it**"],
            ["**AutoML**", "Online", "Real-time", "Automatically selects and configures algorithms; needs minimal ML expertise"],
          ],
        },
        {
          type: "p",
          text: "**Model serving (slides 94–95)** means making the model available in production. Making a prediction (inference) needs three things: **a model, an interpreter to run it, and input data**. Two aspects matter: the automated **retraining and deployment pipeline**, and the **prediction API**.",
        },
        {
          type: "table",
          caption: "Model serving patterns (slides 96–104)",
          head: ["Pattern", "Idea", "Example"],
          rows: [
            ["**Model-as-Service**", "The model + interpreter wrapped in its own web service (REST or gRPC)", "Gemini or Copilot APIs"],
            ["**Model-as-Dependency**", "The packaged model is a library inside the application", "A model file shipped inside a mobile app"],
            ["**Precompute**", "Predict a whole batch in advance and store the results in a database; requests just look them up", "Tomorrow's demand for every product, computed at night"],
            ["**Model-on-Demand**", "Model available at runtime behind a **message broker**: requests go to an input queue, an event processor (runtime + model) predicts in batches and writes to an output queue", "High-throughput scoring"],
            ["**Hybrid / Federated learning**", "A server model trained once gives the starting model. **Each device trains its own personalised copy** on local data and sends back only **model updates**, not personal data; the server aggregates them into a better starting model", "Phone keyboards learning your typing (TensorFlow Federated)"],
          ],
        },
        {
          type: "p",
          text: "**Federated learning in one sentence:** *the model travels to the data, not the data to the model*, so private data never leaves the device. Constraints: devices have limited power and aren't always available.",
        },
        { type: "diagram", name: "d6-federated" },
        {
          type: "p",
          text: "**How serving is usually built (slides 105–110):** **Docker containers**. Inference is stateless, lightweight and idempotent, so wrap the whole stack plus the prediction code in a container, orchestrate many containers with **Kubernetes** (or AWS Fargate), and expose a REST API (e.g. with Flask). This is the de-facto standard. Alternatively, **serverless functions**: package code and dependencies as a .zip with one entry point on AWS Lambda, Azure Functions or Google Cloud Functions, or use managed ML platforms (SageMaker, Vertex AI, Azure ML, Watson). Watch the **size limits** on deployment artifacts.",
        },
      ],
    },
    {
      id: "mlops",
      heading: "Lesson 10: Why do so many ML deployments fail? The MLOps loop",
      slides: "111–121",
      blocks: [
        {
          type: "p",
          text: "**MLOps (slides 111–113)** chains three “Ops” disciplines, one per asset from Lesson 7, with monitoring feeding back to the start:",
        },
        {
          type: "p",
          text: "```flow\nDataOps: design/develop/test/deploy the training set -> ModelOps: design/develop/test/deploy the trained model -> DevOps: design/develop/test/deploy the inference API\nDevOps monitoring (drift, bias, accuracy) -> feedback & retraining -> DataOps\n```",
        },
        {
          type: "p",
          text: "**The reality check (slides 114–121).** A survey found it takes **8–90 days to deploy a single model**, and many deployments fail for lack of expertise, data bias or high costs. The challenges, phase by phase, with real company stories:",
        },
        {
          type: "table",
          head: ["Phase", "Challenges and real examples"],
          rows: [
            ["**Data management**", "Finding what data exists and where (Twitter's many single-responsibility services scatter it); logs are hard to parse; synthetic data may be needed; joining datasets with different schemas and conventions (Firebird combined 12 datasets); labelling (few experts, low variance, huge volume); few profiling tools"],
            ["**Model learning**", "Model selection (Airbnb began with a complex deep-learning model: too complex, many development cycles, heavy hardware); training cost and CO₂ emissions (billion-parameter NLP models); hyperparameter search grows **exponentially** with each hyperparameter"],
            ["**Model verification**", "**Encoding requirements**: Booking.com deployed 150 models, yet that didn't guarantee business value, so the right KPIs must be defined; formal verification under regulation; tests limited to simulations; data must be validated continuously (bugs, feedback loops, dependency changes)"],
            ["**Model deployment**", "**Integration**: Pinterest maintained three models with similar embeddings separately, tripling the work; abstraction-boundary erosion, correction cascades, **pipeline jungles**; **monitoring** input data, prediction bias, performance and outliers; **updating** for **concept drift**"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in seven lines",
          text: "1. ML is a **cycle**: business goal → framing → data → model → deploy → monitor, with feedback loops. The business goal matters most, and ask whether ML is even needed.\n2. Lifecycle machinery: online/offline **feature store**, **model registry**, performance and drift feedback loops, alarm manager, scheduler, lineage tracker.\n3. Data: collect (label, ingest), pre-process (clean, **dedupe before splitting**, scale, balance, augment), feature engineering (create, transform, extract, select).\n4. Model: data vs model parallelism, HPO, offline vs online evaluation, inference and scheduler pipelines; monitor **data drift** (inputs change) vs **concept drift** (input→target changes). Release with blue/green, canary, A/B or shadow.\n5. Three levels: **Data, Model, Code**. Data engineering pipeline = **ingestion → exploration & validation → wrangling → splitting** (set the test set aside; no snooping).\n6. Package with ONNX/PMML/PFA/pickle; patterns: forecast, web service, online learning, AutoML; serving: as-service, as-dependency, precompute, on-demand, **federated**; Docker + Kubernetes or serverless.\n7. MLOps = DataOps → ModelOps → DevOps + feedback. Deployments fail on data, learning, verification and integration (Twitter, Airbnb, Booking.com, Pinterest).",
        },
      ],
    },
  ],

  recap: [
    {
      "type": "callout",
      "kind": "idea",
      "title": "In one line",
      "text": "ML is a **loop**, not a line: business goal → framing → data → model → deploy → monitor → back again."
    },
    {
      "type": "diagram",
      "name": "d6-cycle",
      "caption": "The lifecycle loops back on drift."
    },
    {
      "type": "list",
      "items": [
        "**Business goal first**; ask whether ML is even needed.",
        "Machinery: feature store (online/offline), model registry, feedback loops, alarm manager, scheduler, lineage.",
        "Prep: clean, **dedupe before splitting** (leakage), scale, balance, augment; features: create, transform, extract, select."
      ]
    },
    {
      "type": "diagram",
      "name": "d6-drift",
      "caption": "Data drift: inputs move. Concept drift: the rule moves."
    },
    {
      "type": "diagram",
      "name": "d6-deploy",
      "caption": "Four safe ways to release a model."
    },
    {
      "type": "p",
      "text": "#### Data engineering pipeline (PYQ Q5)"
    },
    {
      "type": "p",
      "text": "```flow\nIngestion (sources, provenance, backup, privacy, metadata, lock the test set) -> Exploration & validation (profiling, rules, missing ratio) -> Wrangling (reusable scripts, outliers, impute, restructure) -> Splitting (train / validation / test)\n```"
    },
    {
      "type": "list",
      "items": [
        "Three levels: **Data · Model · Code**.",
        "Package: ONNX, PMML, PFA, pickle. Serve: as-service, as-dependency, precompute, on-demand, **federated**.",
        "MLOps = DataOps → ModelOps → DevOps + feedback. Failures: Twitter, Airbnb, Booking.com, Pinterest."
      ]
    },
    {
      "type": "callout",
      "kind": "exam",
      "title": "Exam hook",
      "text": "**PYQ Q5:** draw the 4-step pipeline **first**, list activities under each step, then link it to the Model and Code levels."
    }
  ],

  glossary: [
    ["ML lifecycle", "—", "Business goal → framing → data → model → deployment → monitoring, looping back"],
    ["Label / target", "—", "The value the model predicts"],
    ["Definition of Done", "—", "Agreed acceptance criteria for the project"],
    ["Feature store (online / offline)", "—", "Shared features: low-latency for serving / full history for training"],
    ["Model registry", "—", "Versioned store of models with metadata and lineage"],
    ["Lineage", "—", "The record of which data and code produced a model"],
    ["Alarm manager", "—", "Routes monitoring alerts to people or pipelines"],
    ["Data leakage", "—", "Information from the test set sneaking into training"],
    ["Augmentation", "—", "Creating synthetic variations of data to reduce overfitting"],
    ["PCA / ICA / LDA", "Principal / Independent Component Analysis, Linear Discriminant Analysis", "Dimensionality-reduction methods"],
    ["Data / model parallelism", "—", "Split the data across machines / split the model across machines"],
    ["HPO", "Hyperparameter Optimisation", "Searching for the best hyperparameter values"],
    ["Model artifact", "—", "The saved model: parameters, definition, metadata"],
    ["Offline / online evaluation", "—", "On held-out data before release / on live data after"],
    ["Endpoint", "—", "The address an app calls to get a prediction"],
    ["Data drift", "—", "The input distribution changes"],
    ["Concept drift", "—", "The relationship between inputs and target changes"],
    ["Bias drift / feature-attribution drift", "—", "Predictions becoming unfair / the model relying on different features"],
    ["Blue/green deployment", "—", "Two identical environments; switch traffic from one to the other"],
    ["Canary deployment", "—", "Release to a small group of users first"],
    ["A/B testing", "—", "Split traffic between old and new models to measure impact"],
    ["Shadow deployment", "—", "The new model runs silently on real inputs; only the old one serves users"],
    ["Provenance", "—", "Where data originally came from"],
    ["ACL", "Access Control List", "Who may access a piece of data"],
    ["Data-snooping bias", "—", "Choosing models after peeking at the test set"],
    ["Profiling", "—", "Computing summary metadata about data (min, max, missing ratio…)"],
    ["Missing-value ratio", "—", "Missing values ÷ number of records"],
    ["Data wrangling", "—", "Programmatically cleaning and restructuring data"],
    ["Ensemble (voting, bagging, boosting, stacking)", "—", "Combining several models to reduce error"],
    ["Model acceptance test", "—", "The final check on the untouched test set"],
    ["PMML / PFA / ONNX", "Predictive Model Markup Language / Portable Format for Analytics / Open Neural Network Exchange", "Portable model formats"],
    ["Model decay", "—", "A static model's performance falling as the world changes"],
    ["Model-as-Service / as-Dependency", "—", "Model behind its own API / packaged inside the app"],
    ["Precompute serving", "—", "Predictions made in batch in advance and looked up later"],
    ["Model-on-Demand", "—", "Model behind a message broker, predicting from a queue"],
    ["Federated learning", "—", "Devices train locally; only model updates are shared"],
    ["Docker / Kubernetes", "—", "Container packaging / container orchestration"],
    ["Serverless function", "—", "Code run on demand by the cloud, with no servers to manage"],
    ["MLOps", "—", "DataOps + ModelOps + DevOps with a feedback loop"],
    ["Pipeline jungle", "—", "A tangled, unmaintainable web of data-preparation code"],
  ],

  examTips: [
    "**PYQ Q5** asked for the *data engineering pipeline with a diagram* in the context of Data/Model/Code. Draw the **4-step flow** (ingestion → exploration & validation → wrangling → splitting), list the key activities under each, then show how its output feeds the model and code pipelines.",
    "Deployment strategies (blue/green, canary, A/B, shadow) and serving patterns are easy 5-mark comparisons. Use a table.",
    "Always mention **feedback loops** and **drift** when describing the lifecycle; the slides stress that phases are not sequential.",
  ],

  theory: [
    {
      title: "Data engineering pipeline (Data, Model, Code)",
      pyq: "Comprehensive Q5 (5 marks)",
      marks: 5,
      question:
        "The goal of a machine learning project is to build a statistical model by using collected data and applying machine learning algorithms. Every ML-based software needs to manage three main assets: Data, Model and Code. Describe, with a suitable diagram, the Data Engineering Pipeline.",
      solution: `
### What the examiner wants
The question says **with a diagram**, so draw the four-step flow first. Then key activities under each step (ingestion, exploration & validation, wrangling, splitting), and how the output feeds the Model and Code levels. Name the three assets (Data, Model, Code) at the start (Lesson 7).

### Model answer
**Context: three levels of ML software**
- **Data → Data engineering** (acquisition + preparation)
- **Model → ML model engineering** (training + serving)
- **Code → Code engineering** (integrating the model into the product)

The data engineering pipeline is the *first and most expensive* stage: *garbage in, garbage out*. Its goal is to produce clean **training, validation and test datasets** for the ML algorithms.

**Diagram**
\`\`\`flow
Data sources (DBs, DW, OLAP cubes, OLTP, HDFS, APIs) -> 1. Data ingestion -> 2. Exploration & validation -> 3. Data wrangling (cleaning) -> 4. Data splitting -> Train / Validation / Test sets
Train / Validation / Test sets -> ML pipeline (Model) -> Deployment pipeline (Code)
Metadata catalogue, backups, privacy compliance and a set-aside test set run alongside
\`\`\`

**Step 1: Data ingestion.** Collect data from internal/external DBs, data marts, OLAP cubes, warehouses, OLTP systems, Spark/HDFS; possibly synthetic data or enrichment.
- *Activities:*
  - identify sources and record **provenance**
  - estimate the space needed and create a workspace
  - obtain the data and convert it to a usable format without altering it
  - **back up** (work on a copy)
  - **privacy compliance** (anonymise PII, GDPR)
  - start a **metadata catalogue** (size, format, aliases, last modified, ACLs)
  - **sample a test set and never look at it**, to avoid data-snooping bias

**Step 2: Exploration & validation.** **Data profiling** produces metadata (min, max, mean). **Validation** runs user-defined error-detection routines, e.g. are address components consistent, is the postcode correct, are values missing?
- *Activities:*
  - use notebooks (RAD tools)
  - profile each attribute: name, #records, data type, numeric measures, **missing-value ratio**, distribution
  - identify the **label**
  - visualise distributions
  - compute **correlations**
  - identify additional data needed (loop back to ingestion)

**Step 3: Data wrangling (cleaning).** Programmatically re-format and restructure attributes (the schema may change). Write **reusable scripts** so the same logic applies to future data.
- *Activities:*
  - promising transformations
  - fix or remove **outliers**
  - fill **missing values** (0/mean/median) or drop rows/columns
  - drop irrelevant attributes
  - restructure: reorder fields, extract new fields, combine fields, filter records, change granularity via aggregation or pivots

**Step 4: Data splitting.** Split into **training (~80%)**, **validation** and **test** sets. Remove duplicates *before* splitting to avoid **leakage**.

**Output and link to Model and Code:** curated datasets feed the **ML pipeline** (feature engineering, training, evaluation, packaging), whose packaged model is delivered by the **deployment pipeline** (serving, monitoring, logging). Monitoring feedback such as drift loops back to the data pipeline.

**Example:** churn prediction. Ingest CRM, billing and call logs → profile (15% missing tenure, skewed charges) → impute tenure, cap outliers, one-hot the plan type → 80/10/10 split.

### Takeaway
Ingestion → exploration & validation → wrangling → splitting, with the test set locked away at ingestion. It's the most expensive phase, and garbage in means garbage out.`,
    },
    {
      title: "Phases of the ML lifecycle and its architecture",
      marks: 5,
      question: "Explain the phases of the ML lifecycle. Why is business goal identification the most important phase? Describe the supporting architecture components (feature store, model registry, feedback loops, alarm manager, scheduler, lineage tracker).",
      solution: `
### What the examiner wants
All six phases with their key activities, the point that they are **not sequential** (feedback loops), and the architecture components that support them (Lessons 1–3).

### Model answer
\`\`\`flow
Business goal -> ML problem framing -> Data processing -> Model development -> Deployment -> Monitoring
Monitoring -> Model drift feedback loop -> Data processing
Model development -> Performance feedback loop -> Data processing
\`\`\`
The lifecycle is **cyclic and iterative**; the phases are not strictly sequential.

- **Business goal (most important):** without a clear problem and measurable business value, even a perfect model is useless. Understand requirements, align stakeholders, define business metrics, check data feasibility, cost of wrong predictions, and path to production.
- **ML problem framing:** decide what is observed and what is predicted (the label); set a quantifiable metric linked to business outcomes; check whether ML is needed at all; start simple.
- **Data processing:** collect (label, ingest, aggregate) and prepare (clean, partition, scale, unbias, augment, feature engineering).
- **Model development:** build, train (data/model parallel), debug, tune hyperparameters, evaluate offline/online, CI/CD/CT.
- **Deployment:** serve through endpoints using blue/green, canary, A/B or shadow.
- **Monitoring:** data/model quality, bias and feature-attribution drift, explainability; alerts trigger retraining.

**Architecture components**
| Component | Role |
|---|---|
| Feature store | Online (real-time inference) / offline (training history); avoids duplicated feature code |
| Model registry | Versioned model artifacts + metadata; lineage |
| Performance feedback loop | Development-time evaluation → back to data preparation |
| Model drift feedback loop | Production evaluation → back to data preparation |
| Alarm manager | Routes monitoring alerts, e.g. to the retraining pipeline |
| Scheduler | Periodic retraining at business-defined intervals |
| Lineage tracker | Re-creates the environment at any past point in time |

### Takeaway
The lifecycle is a loop driven by monitoring; the feature store, model registry, alarm manager, scheduler and lineage tracker keep it turning.`,
    },
    {
      title: "Deployment strategies: blue/green, canary, A/B, shadow",
      marks: 5,
      question: "Explain blue/green, canary, A/B and shadow deployment strategies for ML models. Which would you use to validate a new fraud model with zero customer risk, and why?",
      solution: `
### What the examiner wants
Each strategy's mechanism, its main benefit or risk, and when to use it, best as a table, with a line on how canary differs from A/B (Lesson 6).

### Model answer
| Strategy | Mechanism | Pros | Cons |
|---|---|---|---|
| **Blue/green** | Two identical prod environments. Test on green, switch all traffic from blue to green, swap roles | Near-zero downtime; instant rollback | Double infrastructure; all users switch at once |
| **Canary** | New model to a **small user subset**, then gradual rollout | Limits the blast radius | Some users see the new model's errors |
| **A/B testing** | A fixed % of traffic to the new model vs the old, for **days/weeks** | Measures **business impact** statistically | Longer; needs enough traffic; users exposed |
| **Shadow** | The new model gets the **same inputs in parallel**; only the old model's output is served; the new one is logged and analysed | **Zero user risk**; real production data | Extra compute; no measure of user response |

\`\`\`flow
Request -> Old model (serves response)
Request (copied) -> New model (shadow: logged, compared, never served)
\`\`\`

**For the fraud model:** start with **shadow deployment**. Every transaction is scored by both models. We compare alerts, precision/recall against confirmed fraud, and latency, without blocking any real customer. Once it is confidently better, move to a **canary** (e.g. 5% of traffic), then full rollout (or blue/green switch-over) with a quick rollback path.

### Takeaway
Blue/green = instant switch and rollback; canary = small group first; A/B = measure business impact over time; shadow = zero user risk.`,
    },
    {
      title: "Model serving patterns and federated learning",
      marks: 5,
      question: "Describe the model serving patterns: model-as-service, model-as-dependency, precompute, model-on-demand and hybrid (federated learning). Give a use case for each.",
      solution: `
### What the examiner wants
The serving patterns with an example each, federated learning explained step by step (initial model → local training → updates only → aggregation) with its benefit and constraints, and how serving is usually built (containers or serverless) (Lesson 9).

### Model answer
Inference needs **a model, an interpreter and input data**. Serving has two aspects: the automated retrain/deploy pipeline, and the prediction API.

| Pattern | How | Use case |
|---|---|---|
| **Model-as-Service** | Model + interpreter wrapped in an independent web service (REST/gRPC) | Gemini/Copilot APIs; a credit-scoring microservice |
| **Model-as-Dependency** | Packaged model is a library inside the app (like an imported SDK) | An on-device spell-check model in a mobile app |
| **Precompute** | Batch predictions stored in a DB; requests just look up the result (Forecast workflow) | Nightly product recommendations per user |
| **Model-on-Demand** | Message-broker architecture: requests → input queue → event processor (runtime + model) reads batches → output queue → caller | High-volume asynchronous scoring (document classification) |
| **Hybrid / Federated learning** | The server trains one general model as the initial model. Each **device trains a personalised model locally** and sends only *model updates* (not data) to the server, which aggregates them into a new initial model; devices test it | Keyboard next-word prediction (Gboard); health apps |

\`\`\`flow
Server model (initial) -> Devices train locally on private data -> Send model updates (not data) -> Server aggregates -> New initial model -> Devices
\`\`\`

**Federated benefits:** personal data never leaves the device; accurate personalised models without storing huge private datasets centrally. **Constraints:** devices are less powerful and not always available; training data is spread over millions of devices (TensorFlow Federated helps).

### Takeaway
Choose the pattern by latency and where the model runs. Federated learning moves the model to the data, so private data never leaves the device.`,
    },
    {
      title: "Model packaging and serialisation formats",
      marks: 5,
      question: "Why must an ML model be packaged/serialised? Compare language-agnostic formats (amalgamation, PMML, PFA, ONNX) and list vendor-specific formats.",
      solution: `
### What the examiner wants
Why packaging is needed (the model must run outside its training environment), the language-agnostic formats with their pros and cons, and the vendor-specific ones (Lesson 8).

### Model answer
**Why:** the model must run as an **independent asset outside the training environment**, e.g. a scikit-learn model used inside a Spark job, a Java service, or a mobile app. Packaging exports it in a format the business application can consume.

**Language-agnostic**
| Format | Description | Pros / cons |
|---|---|---|
| **Amalgamation** | Model + all code bundled as one package/source file (SKompiler converts sklearn → SQL, Excel, PFA, SymPy → C/JS/Rust) | Simple, portable, compact for simple models (logistic regression, trees); code and parameters must be managed together |
| **PMML** | XML (.pmml) describing the model and pipeline; standardised by DMG | Standard; doesn't support all algorithms; licensing limits open-source adoption |
| **PFA** | JSON scoring engine with well-defined inputs/outputs; a PMML replacement | Expressive; needs a PFA-enabled runtime |
| **ONNX** | Framework-independent format backed by Microsoft/Facebook/Amazon | Run anywhere via ONNX runtimes/inference engines |

**Vendor-specific:**
- scikit-learn **.pkl** (pickle)
- H2O **POJO / MOJO**
- SparkML **MLeap** bundle (JAR runtime)
- TensorFlow **.pb** (protocol buffers)
- PyTorch **.pt** (TorchScript)
- Keras **.h5** (HDF5)
- Apple **.mlmodel** (Core ML; convert with coremltools)

**Choice:** ONNX for cross-framework, cross-platform deployment. Vendor formats when training and serving share a stack.

### Takeaway
Portable formats (ONNX, PMML, PFA) let a model trained in one framework run anywhere; vendor formats (.pkl, .pt, .h5) are simpler but tie you to one stack.`,
    },
    {
      title: "ML workflows: training and prediction modes, architecture patterns",
      marks: 5,
      question: "Differentiate offline vs online learning and batch vs real-time prediction. Explain the forecast, web-service, online-learning and AutoML architecture patterns.",
      solution: `
### What the examiner wants
The two dimensions (offline vs online training; batch vs real-time prediction), the four resulting patterns with examples, and the risks (model decay; bad data in online learning) (Lesson 9).

### Model answer
**Training:**
- **Offline (batch/static):** trained on collected data and constant after deployment until retrained. It sees live data and becomes stale (**model decay**), so monitor it.
- **Online (dynamic/incremental):** retrained regularly as new data streams arrive (sensor, stock data), capturing temporal effects.

**Prediction:**
- **Batch:** predictions over historical input; fine when not time-critical.
- **Real-time (on-demand):** predictions per request, using the data available at request time.

| Pattern | Training | Prediction | Notes |
|---|---|---|---|
| **Forecast** | Offline | Batch | Kaggle/academia; easiest; rare in industry production |
| **Web service** | Offline | Real-time | Most common: a microservice serves predictions; the model is fixed until redeployed |
| **Online learning** | Online (incremental) | Real-time | Learns on the fly from event streams; pairs with **Lambda architecture**. Risk: **bad data steadily degrades the model** |
| **AutoML** | Online | Real-time | Automatically picks and configures algorithms/architectures; minimal ML expertise needed |

**Example:** a credit-card fraud model is often a **web service** (offline-trained, real-time scoring) with scheduled retraining. A stock-signal model may use **online learning**.

### Takeaway
Training mode × prediction mode gives four patterns: forecast, web service, online learning, AutoML. Web service is the most common in production.`,
    },
    {
      title: "Why ML deployments fail (case survey) and the MLOps loop",
      marks: 5,
      question: "Using the case survey, explain challenges at each phase of ML deployment (data management, model learning, verification, deployment) with industry examples. How does integrating DataOps, ModelOps and DevOps help?",
      solution: `
### What the examiner wants
The MLOps loop (DataOps → ModelOps → DevOps + feedback), then challenges grouped by phase, **each with the real company example** from the slides (Lesson 10).

### Model answer
**Hard reality:** most companies take **8–90 days** to deploy a single model, and many attempts fail due to lack of expertise, data bias and high costs.

| Phase | Challenges | Example |
|---|---|---|
| **Data management** | Discovering what data exists and where; unparseable logs; data that must be synthesised; joining sources with different schemas/conventions; labelling (few experts, low variance, huge volume); few profiling tools | **Twitter:** single-responsibility services make entity data hard to track. **Firebird:** joining 12 datasets |
| **Model learning** | Choosing an over-complex model; training cost and CO₂; HPO grows exponentially | **Airbnb** began with complex deep learning: many dev cycles, heavy hardware |
| **Model verification** | Encoding business requirements as KPIs; regulatory formal verification; simulations ≠ reality; continuous data validation | **Booking.com:** 150 models deployed, yet model gains didn't guarantee business value |
| **Model deployment** | Integration and model reuse; abstraction erosion, correction cascades, **pipeline jungles**; monitoring input data, bias, outliers; updating for **concept drift** | **Pinterest:** 3 models with similar embeddings maintained separately, so work was tripled |

**MLOps loop**
\`\`\`flow
DataOps (training-set schema, job, test, deploy) -> ModelOps (design, train, test, deploy model) -> DevOps (inference API design, dev, test, deploy)
DevOps monitoring (drift, bias, accuracy) -> Feedback & retraining -> DataOps
\`\`\`
DataOps produces a trustworthy training set, ModelOps turns it into a validated model, and DevOps puts it behind an inference API. Monitoring closes the loop by triggering data fixes and retraining. This addresses the failure points through automation, versioning, monitoring and shared ownership.

### Takeaway
Deployments fail on data (finding, joining, labelling), learning (complexity, cost), verification (wrong KPIs) and integration (duplicated models, pipeline jungles), which is exactly what the MLOps loop is meant to catch.`,
    },
  ],

  quiz: [
    { q: "Which ML lifecycle phase does the lecture call the most important?", options: ["Data processing", "Business goal identification", "Model development", "Monitoring"], answer: 1, why: "Without a clear business problem and value, the project fails." },
    { q: "Removing duplicates before splitting data mainly prevents:", options: ["Underfitting", "Data leakage", "Concept drift", "Model decay"], answer: 1, why: "Duplicates across train and test leak information." },
    { q: "PCA, ICA and LDA are examples of:", options: ["Feature creation", "Feature extraction", "Feature selection", "Imputation"], answer: 1, why: "Dimensionality reduction = feature extraction." },
    { q: "Sending the same inputs to a new model whose outputs are never served is:", options: ["Canary", "Blue/green", "Shadow", "A/B"], answer: 2, why: "Shadow deployment carries zero user risk." },
    { q: "Which is the FIRST step of the data engineering pipeline?", options: ["Data wrangling", "Data splitting", "Data ingestion", "Exploration & validation"], answer: 2, why: "Ingestion → exploration & validation → wrangling → splitting." },
    { q: "Looking at the test set while choosing models causes:", options: ["Data-snooping bias", "Selection bias", "Automation bias", "Reporting bias"], answer: 0, why: "Leads to over-optimistic model selection." },
    { q: "A framework-independent model format backed by Microsoft, Facebook and Amazon is:", options: ["PMML", "PFA", "ONNX", "MLeap"], answer: 2, why: "Open Neural Network eXchange." },
    { q: "Storing precomputed predictions in a DB for lookup is which serving pattern?", options: ["Model-as-service", "Precompute", "Model-on-demand", "Federated"], answer: 1, why: "Linked to the Forecast workflow." },
    { q: "In federated learning, what does a device send to the server?", options: ["Raw personal data", "Model updates", "Nothing", "Labels only"], answer: 1, why: "Personal data never leaves the device." },
    { q: "The most commonly used ML deployment architecture is:", options: ["Forecast", "Web service", "Online learning", "AutoML"], answer: 1, why: "A microservice with offline training and real-time predictions." },
  ],
};
