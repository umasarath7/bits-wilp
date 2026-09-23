// DMML — Lecture 6: ML Lifecycle and Workflow
// Source: CourseFiles/DMML/L6-ML lifecycle and Workflow (3).pptx (123 slides)

export default {
  title: "ML Lifecycle & Workflow",
  source: "L6-ML lifecycle and Workflow.pptx · 123 slides",
  overview:
    "The ML lifecycle is a cyclic, iterative process: **business goal → ML problem framing → data processing → model development → deployment → monitoring**, with feedback loops. The lecture details each phase and its architecture (feature store, model registry, feedback loops, alarm manager, scheduler, lineage tracker). It then covers the **three levels of ML software (Data, Model, Code)**: the **data engineering pipeline** (ingestion → exploration & validation → wrangling → splitting), the **ML pipeline** (model engineering → evaluation → packaging/serialisation formats), different **ML workflows** (offline/online training; batch/real-time prediction; forecast, web-service, online-learning and AutoML patterns), **deployment pipelines** (serving patterns, containers, serverless), the **DataOps → ModelOps → DevOps = MLOps** loop, and why deployments fail.",

  summary: [
    {
      id: "lifecycle",
      heading: "1. The ML lifecycle",
      slides: "5–15",
      blocks: [
        { type: "p", text: "```flow\nBusiness goal -> ML problem framing -> Data processing -> Model development -> Deployment -> Monitoring\nMonitoring -> feedback loops back to Data processing / Model development\n```" },
        { type: "p", text: "Phases are **not strictly sequential**; feedback loops can interrupt the cycle at any phase." },
        {
          type: "table",
          head: ["Phase", "Key activities"],
          rows: [
            ["**Business goal** (most important)", "Understand requirements; align stakeholders; form the business question; identify must-have features; consider new processes; define **business metrics** the model should improve; review data feasibility; costs (data acquisition, training, inference, *wrong predictions*); production considerations (handling ML errors, path to production); Definition of Done / acceptance criteria"],
            ["**ML problem framing**", "What is observed and what is predicted (label/target). Success criteria; an observable **performance metric** (e.g. accuracy); link the technical metric to the business outcome (accuracy → sales); stakeholders agree; formulate inputs, outputs and metric; **ask whether ML is even needed** (simple rules may do, or data may be insufficient); data sourcing and annotation strategy; start with a simple, interpretable model; iterate"],
            ["**Data processing**", "Collect (label, ingest, aggregate), prepare (pre-process, feature engineering)"],
            ["**Model development**", "Build, train, tune, evaluate; CI/CD pipeline to staging and production"],
            ["**Deployment**", "Serve predictions/inferences in production"],
            ["**Monitoring**", "Verify performance; early detection and mitigation (drift, bias)"],
          ],
        },
        { type: "p", text: "**Framing example:** a manufacturer wanting more profit could forecast demand for existing products, forecast input materials to cut locked-up capital, or predict new-product sales. Each is a *different* ML problem." },
      ],
    },
    {
      id: "arch",
      heading: "2. ML lifecycle architecture components",
      slides: "16–21",
      blocks: [
        {
          type: "table",
          head: ["Component", "Role"],
          rows: [
            ["**Online / offline feature store**", "Reduces duplicated feature code across teams. Online = low latency for real-time inference; offline = history for training and batch scoring"],
            ["**Model registry**", "Stores model artifacts + metadata (data, code, model); **lineage** and version control of models"],
            ["**Performance feedback loop**", "From *development-time evaluation* back to data preparation"],
            ["**Model drift feedback loop**", "From *production* evaluation back to data preparation"],
            ["**Alarm manager**", "Receives monitoring alerts and notifies targets, e.g. the model-update retraining pipeline"],
            ["**Scheduler**", "Triggers retraining at business-defined intervals"],
            ["**Lineage tracker**", "Re-creates the ML environment at any point in time (versions of resources and environments)"],
          ],
        },
      ],
    },
    {
      id: "data",
      heading: "3. Data processing: collection, preparation, feature engineering",
      slides: "22–36",
      blocks: [
        { type: "p", text: "**Why data matters in ML:** it defines the system's goal (input-output pairs), trains the algorithm, measures performance against **data drift**, and forms the **baseline dataset** for detecting drift." },
        { type: "list", items: [
          "**Collection:** **label** (manual or automated); **ingest & aggregate** from many sources (time series, events, sensors, IoT, social); ingestion is real-time (streaming) or historical (batch); storage in SQL DBs, lakes, warehouses and lakehouses, with ETL automating movement.",
          "**Pre-processing:** **clean** (the class-age example: a duplicate student entered thrice, age 100 instead of 10, missing students → remove duplicates/outliers, impute); **partition** into train/validation/test randomly (**remove duplicates before splitting** to avoid **data leakage**); **scale** (normalise to [0,1] / standardise to mean 0, sd 1); **unbias & balance**; **augment** (synthesise data to regularise and reduce overfitting).",
          "**Feature engineering:** **creation** (one-hot, binning, splitting, calculated features); **transformation & imputation** (replace missing/invalid values, Cartesian products, non-linear transforms, domain features); **extraction** (dimensionality reduction: PCA, ICA, LDA); **selection** (subset that minimises error; feature importance, correlation matrix).",
          "Use EDA and visualisation, data-wrangler tools, low/no-code and GenAI code tools to speed up preparation.",
        ]},
      ],
    },
    {
      id: "model",
      heading: "4. Model development, deployment & monitoring",
      slides: "37–58",
      blocks: [
        { type: "list", items: [
          "**Training & tuning:** features; versioned code with CI; **algorithm selection** (success metrics, explainability, compute); distributed training via **data parallelism** (split data into mini-batches across nodes) and **model parallelism** (split the model across nodes); **debugging/profiling** (bottlenecks, overfitting, saturated activations, vanishing gradients); **validation metrics** (confusion matrix, RMSE); **HPO** (learning rate, epochs, layers, units, activations); training **containers**; **model artifacts** (parameters, model definition, metadata).",
          "**Pre-production pipelines:** data-prepare pipeline, feature pipeline (to/from the feature store), **CI/CD/CT pipeline**.",
          "**Evaluation:** **offline** (holdout set never used for training/validation) vs **online** (live data).",
          "**Deployment:** governance and quality gates. The app sends a payload to an endpoint; the model is fetched from the registry, features from the feature store, and code from the container repository.",
          "**Inference pipeline** (prepare data → predict → post-process; batch or real-time). **Scheduler pipeline** (retrain at intervals to limit data and concept drift).",
          "**Monitoring:** capture data, compare with training, apply rules, alert. Issues: data quality, model quality, **bias drift**, **feature-attribution drift**. **Explainability**; **drift detection** (**data drift** = input distribution change; **concept drift** = the input→target relationship changes); the alarm manager triggers the **model update pipeline**.",
        ]},
        {
          type: "table",
          caption: "Deployment strategies",
          head: ["Strategy", "How it works"],
          rows: [
            ["**Blue/green**", "Two identical production environments. Test on green, switch live traffic from blue to green, then swap roles. Near-zero downtime, instant rollback"],
            ["**Canary**", "Release to a **small group of users** first, then gradually roll out"],
            ["**A/B testing**", "A defined share of traffic goes to the new model, the rest to the old. Larger groups and **longer** (days/weeks) than canary; measures business impact"],
            ["**Shadow**", "The new model receives the **same inputs** in parallel; only the old model's output serves users; the new one is analysed. Zero user risk"],
          ],
        },
      ],
    },
    {
      id: "three",
      heading: "5. Three levels of ML software: Data, Model, Code",
      slides: "59–72",
      blocks: [
        { type: "p", text: "The goal of an ML project is a statistical model built from collected data using ML algorithms. Every ML-based software manages **three assets: Data, Model, Code**, via three disciplines: **Data engineering** (acquisition + preparation), **ML model engineering** (training + serving) and **Code engineering** (integrating the model into the product)." },
        { type: "p", text: "```flow\nDATA: Data ingestion -> Exploration & validation -> Data wrangling (cleaning) -> Data splitting -> Training / validation / test sets\nMODEL: Model training (feature eng. + model eng. + HPO) -> Model evaluation -> Model testing -> Model packaging\nCODE: Model serving -> Performance monitoring -> Performance logging\n```" },
        {
          type: "table",
          caption: "Data engineering pipeline",
          head: ["Step", "Key activities"],
          rows: [
            ["**1. Data ingestion**", "Collect from internal/external DBs, marts, OLAP cubes, warehouses, OLTP, Spark, HDFS; synthetic data or enrichment. Identify sources + **provenance**; estimate space; create a workspace; obtain and convert data *without changing it*; **back up** (work on a copy); **privacy compliance** (anonymise, GDPR); **metadata catalogue** (size, format, aliases, modified time, ACLs); set a **test set aside and never look at it** (avoid **data-snooping bias**)"],
            ["**2. Exploration & validation**", "**Profiling** → metadata (max, min, avg). **Validation** = user-defined error-detection routines (e.g. are address components consistent, is the postcode correct, are values missing?). Use notebooks (RAD tools); attribute profiling (name, record count, type, numerical measures, **missing-value ratio**, distribution type); identify label attributes; visualise; correlations; identify extra data needed"],
            ["**3. Data wrangling (cleaning)**", "Programmatically reformat/restructure (may change the schema). **Write reusable scripts/functions.** Transformations; fix/remove outliers; fill missing values (0, mean, median) or drop rows/columns; drop irrelevant attributes; restructure (reorder, extract, combine fields, filter records, change granularity via aggregation/pivot)"],
            ["**4. Data splitting**", "Training (≈80%), validation and test sets for the core ML stages"],
          ],
        },
        { type: "p", text: "Data preparation (Gartner: an iterative, agile process of exploring, combining, cleaning and transforming raw data into curated datasets) is the **most expensive phase in time and resources**. *Garbage in, garbage out.*" },
      ],
    },
    {
      id: "mlpipe",
      heading: "6. ML pipeline & model serialisation formats",
      slides: "73–84",
      blocks: [
        { type: "list", items: [
          "**Model engineering/training:** feature engineering (discretise, decompose categorical/date features, transforms log/sqrt/x², aggregate, scale) and model engineering (code review + versioning of model specs; train many model families with default parameters; N-fold CV mean ± sd; error analysis; shortlist 3–5 models making *different* errors; HPO via CV, preferring **random search over grid**; **ensembles**: voting, bagging, boosting, stacking).",
          "**Evaluation & testing:** check the business objective is met; the final **model acceptance test** on the held-back test set estimates generalisation error.",
          "**Packaging:** export to a format the application consumes (PMML, PFA, ONNX), so the model runs **outside the training environment** (e.g. a scikit-learn model inside a Spark job).",
        ]},
        {
          type: "table",
          caption: "Model serialisation formats",
          head: ["Kind", "Format", "Notes"],
          rows: [
            ["Language-agnostic", "**Amalgamation**", "Model + code bundled as one package/source file (e.g. SKompiler → SQL, Excel, PFA, SymPy → C/JS/Rust). Portable, compact for simple models; code and parameters managed together"],
            ["Language-agnostic", "**PMML**", "XML (.pmml), standardised by DMG; not all algorithms; licensing limits open-source use"],
            ["Language-agnostic", "**PFA**", "JSON scoring engine; replacement for PMML; needs a PFA-enabled runtime"],
            ["Language-agnostic", "**ONNX**", "Framework-independent; backed by Microsoft, Facebook, Amazon; runs in ONNX runtimes"],
            ["Vendor-specific", "scikit-learn **.pkl** · H2O **POJO/MOJO** · Spark **MLeap** · TensorFlow **.pb** · PyTorch **.pt** (TorchScript) · Keras **.h5** (HDF) · Apple **.mlmodel** (Core ML)", ""],
          ],
        },
      ],
    },
    {
      id: "workflows",
      heading: "7. ML workflows and deployment (code) pipelines",
      slides: "85–110",
      blocks: [
        {
          type: "table",
          head: ["Dimension", "Option A", "Option B"],
          rows: [
            ["Training", "**Offline / batch / static**: trained once on collected data, constant until retrained, risk of **model decay**", "**Online / dynamic**: retrained regularly as data streams arrive (time series, sensors, stock trading)"],
            ["Prediction", "**Batch**: predictions on historical input; fine when not time-critical", "**Real-time / on-demand**: predictions from data available at request time"],
          ],
        },
        {
          type: "table",
          caption: "Architecture patterns",
          head: ["Pattern", "Training", "Prediction", "Notes"],
          rows: [
            ["**Forecast**", "Offline", "Batch", "Academic/Kaggle; easiest; rare in production"],
            ["**Web service**", "Offline", "Real-time", "Most common: a microservice returns predictions; the model stays constant until retrained"],
            ["**Online learning** (real-time streaming analytics)", "Online (incremental)", "Real-time", "Learns on the fly; fits **Lambda** architecture; **drawback: bad data degrades the system**"],
            ["**AutoML**", "Online", "Real-time", "Automatically selects and configures algorithms; minimal ML expertise"],
          ],
        },
        { type: "p", text: "**Model serving** = deploying the model in production. Inference needs **a model, an interpreter and input data**. Two aspects: the automated retraining + deployment pipeline, and the **prediction API**." },
        {
          type: "table",
          caption: "Model serving patterns",
          head: ["Pattern", "Idea"],
          rows: [
            ["**Model-as-Service**", "Model + interpreter wrapped in a dedicated web service (REST/gRPC), e.g. Gemini/Copilot APIs"],
            ["**Model-as-Dependency**", "The packaged model is a library inside the application (like an imported SDK)"],
            ["**Precompute**", "Predict a batch in advance and store in a DB; requests just look up the result (goes with the Forecast workflow)"],
            ["**Model-on-Demand**", "Model available at runtime behind a **message broker**: requests go to an input queue, the event processor (serving runtime + model) predicts in batches and writes to an output queue"],
            ["**Hybrid / Federated learning**", "A server model trained once gives the initial model. **Each device trains its own personalised model**, sends only *model updates* (not personal data) back, and the server aggregates them into a new initial model. Private data never leaves the device; constraints: weak devices, devices not always available. TensorFlow Federated"],
          ],
        },
        { type: "list", items: [
          "**Docker containers:** inference is stateless, lightweight and idempotent, so wrap the whole stack + prediction code in a container, orchestrate with **Kubernetes** (or Fargate), and expose a REST API (Flask). This is the de-facto standard.",
          "**Serverless functions:** package the code + dependencies as a .zip with one entry point on AWS Lambda / Azure Functions / Google Cloud Functions, or use managed ML platforms (SageMaker, Vertex/AI Platform, Azure ML, Watson). Watch the **artifact size limits**.",
        ]},
      ],
    },
    {
      id: "mlops",
      heading: "8. DataOps → ModelOps → DevOps (MLOps) and deployment failures",
      slides: "111–121",
      blocks: [
        { type: "p", text: "```flow\nDataOps: design/develop/test/deploy the training set -> ModelOps: design/develop/test/deploy the trained model -> DevOps: design/develop/test/deploy the inference API\nDevOps monitoring (drift, bias, accuracy) -> feedback & retraining -> DataOps\n```" },
        {
          type: "table",
          caption: "Case survey: why deployments fail (8–90 days to deploy one model; many fail from lack of expertise, data bias, high costs)",
          head: ["Phase", "Challenges"],
          rows: [
            ["**Data management**", "Finding what data exists and where (Twitter's single-responsibility services); logs are hard to parse; synthetic data needed; joining datasets with different schemas/conventions (Firebird: 12 datasets); labelling (limited experts, low variance, high volume); few profiling tools"],
            ["**Model learning**", "Model selection (Airbnb started with a complex DL model: complexity, many dev cycles, heavy hardware); training cost and CO₂ (billion-parameter NLP); HPO grows **exponentially** with each hyperparameter"],
            ["**Model verification**", "**Requirement encoding** (Booking.com: 150 models deployed, yet business value wasn't guaranteed, so define the right KPIs); formal verification under regulation; test-based verification limited to simulations; continuously validate data (bugs, feedback loops, dependency changes)"],
            ["**Model deployment**", "**Integration** (Pinterest: three models with similar embeddings maintained separately, so work was tripled); abstraction-boundary erosion, correction cascades, **pipeline jungles**; **monitoring** input data, prediction bias, performance, outliers; **updating** for **concept drift**"],
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["ML lifecycle", "Business goal → framing → data → model → deploy → monitor (iterative)."],
    ["Feature store", "Online (low latency) / offline (history) store of features."],
    ["Model registry", "Versioned store of model artifacts + metadata + lineage."],
    ["Data drift / concept drift", "Input distribution changes / input→target relationship changes."],
    ["Data snooping bias", "Choosing models by peeking at the test set."],
    ["Missing value ratio", "Absent values / number of records."],
    ["Data vs model parallelism", "Split the data across nodes vs split the model across nodes."],
    ["Blue/green, canary, A/B, shadow", "Deployment strategies that reduce release risk."],
    ["ONNX / PMML / PFA", "Portable model exchange formats."],
    ["Model decay", "Offline models going stale in production."],
    ["Model-as-service / dependency", "Model behind an API / packaged inside the app."],
    ["Precompute serving", "Predictions computed in batch and looked up."],
    ["Federated learning", "Devices train locally; only model updates go to the server."],
    ["MLOps", "DataOps + ModelOps + DevOps with feedback/retraining."],
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

**Example:** churn prediction. Ingest CRM, billing and call logs → profile (15% missing tenure, skewed charges) → impute tenure, cap outliers, one-hot the plan type → 80/10/10 split.`,
    },
    {
      title: "Phases of the ML lifecycle and its architecture",
      marks: 5,
      question: "Explain the phases of the ML lifecycle. Why is business goal identification the most important phase? Describe the supporting architecture components (feature store, model registry, feedback loops, alarm manager, scheduler, lineage tracker).",
      solution: `
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
| Lineage tracker | Re-creates the environment at any past point in time |`,
    },
    {
      title: "Deployment strategies: blue/green, canary, A/B, shadow",
      marks: 5,
      question: "Explain blue/green, canary, A/B and shadow deployment strategies for ML models. Which would you use to validate a new fraud model with zero customer risk, and why?",
      solution: `
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

**For the fraud model:** start with **shadow deployment**. Every transaction is scored by both models. We compare alerts, precision/recall against confirmed fraud, and latency, without blocking any real customer. Once it is confidently better, move to a **canary** (e.g. 5% of traffic), then full rollout (or blue/green switch-over) with a quick rollback path.`,
    },
    {
      title: "Model serving patterns and federated learning",
      marks: 5,
      question: "Describe the model serving patterns: model-as-service, model-as-dependency, precompute, model-on-demand and hybrid (federated learning). Give a use case for each.",
      solution: `
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

**Federated benefits:** personal data never leaves the device; accurate personalised models without storing huge private datasets centrally. **Constraints:** devices are less powerful and not always available; training data is spread over millions of devices (TensorFlow Federated helps).`,
    },
    {
      title: "Model packaging and serialisation formats",
      marks: 5,
      question: "Why must an ML model be packaged/serialised? Compare language-agnostic formats (amalgamation, PMML, PFA, ONNX) and list vendor-specific formats.",
      solution: `
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

**Choice:** ONNX for cross-framework, cross-platform deployment. Vendor formats when training and serving share a stack.`,
    },
    {
      title: "ML workflows: training and prediction modes, architecture patterns",
      marks: 5,
      question: "Differentiate offline vs online learning and batch vs real-time prediction. Explain the forecast, web-service, online-learning and AutoML architecture patterns.",
      solution: `
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

**Example:** a credit-card fraud model is often a **web service** (offline-trained, real-time scoring) with scheduled retraining. A stock-signal model may use **online learning**.`,
    },
    {
      title: "Why ML deployments fail (case survey) and the MLOps loop",
      marks: 5,
      question: "Using the case survey, explain challenges at each phase of ML deployment (data management, model learning, verification, deployment) with industry examples. How does integrating DataOps, ModelOps and DevOps help?",
      solution: `
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
DataOps produces a trustworthy training set, ModelOps turns it into a validated model, and DevOps puts it behind an inference API. Monitoring closes the loop by triggering data fixes and retraining. This addresses the failure points through automation, versioning, monitoring and shared ownership.`,
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
