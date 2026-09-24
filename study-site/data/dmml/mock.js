// DMML — Mock comprehensive paper in the same pattern as the previous paper (6 × 5 marks)

export default {
  title: "Mock Comprehensive Paper",
  source: "Practice paper · 6 questions × 5 marks · same style as the previous comprehensive",
  overview:
    "Six application-style questions, one per area, weighted towards topics **not asked last time** (L5 infrastructure/DataOps, L7 ingestion) plus high-probability cross-lecture themes (Lambda/Kappa, leakage/drift). Write each answer on paper in about 15 minutes, with headings, a diagram and an example, then compare with the model answer in the **Theory** tab. Each model answer starts with **what the examiner wants** (read that first; it's the marking scheme in disguise) and ends with a one-line **takeaway**.",

  summary: [
    {
      id: "how",
      heading: "How to use this paper",
      slides: "",
      blocks: [
        { type: "list", ordered: true, items: [
          "Set a timer for **90–100 minutes** for all six.",
          "For each: plan the headings (2 min) → write (12 min) → add a diagram, an example and a conclusion (2 min).",
          "Mark yourself against the model answer: did you cover **definition, 4–6 key points, a diagram/table, an example and trade-offs**?",
          "Re-read the lecture for any question where you missed more than 2 key points.",
        ]},
        {
          type: "table",
          head: ["Q", "Lecture(s)", "Theme"],
          rows: [
            ["1", "L1", "Storage layout, serialization, OLTP/OLAP for an ML feature pipeline"],
            ["2", "L2", "Data as liability for a healthcare ML start-up"],
            ["3", "L3", "Lambda vs Kappa for a ride-hailing platform"],
            ["4", "L5", "DataOps + CI/CD/CT + observability"],
            ["5", "L7", "Streaming ingestion design for an IoT fleet"],
            ["6", "L8 (+L6)", "Diagnosing a model that fails in production: leakage, skew, drift"],
          ],
        },
      ],
    },
  ],

  theory: [
    {
      title: "Q1: Representations for an ML feature pipeline",
      marks: 5,
      question: "A retail company runs its orders on an OLTP database and wants to build daily ML features (e.g. 30-day spend per customer) for thousands of customers and hundreds of features. How should the choice of storage layout (row vs column), serialization format and OLTP/OLAP separation influence the design? Justify with a diagram.",
      solution: `
### What the examiner wants
Three design decisions (storage layout, serialization format, OLTP vs OLAP placement), each justified **for this pipeline**, plus a diagram of the flow. It combines Lessons 5–7 of L1.

### Model answer
**1. Separate OLTP from OLAP**
- The orders DB is **OLTP**: many small writes, current data, optimised for fast writes and ACID. Heavy analytical scans for features would slow checkout.
- Move data (CDC/ELT) into an **OLAP** store (warehouse/lakehouse): historical, consolidated, optimised for reads and aggregations.

**2. Row vs column layout**
- OLTP keeps a **row** layout (fast inserts and updates of whole orders).
- Feature computation reads a *few columns over millions of rows* (customer_id, amount, date) → **columnar** (Parquet / Redshift / BigQuery). It reads only the needed columns, compresses well, and makes wide feature tables (hundreds of features) cheap to scan.
- For **online serving** of one customer's feature vector, a row/key-value store (feature store online layer, Redis) is best.

**3. Serialization**
- CDC events: **Avro/Protobuf** (compact binary, schema evolution with backward/forward compatibility).
- Analytical storage: **Parquet** (columnar).
- APIs to apps: **JSON** (readability). Producer and consumer must use the same schema/algorithm.

\`\`\`flow
OLTP orders DB (row store) -> CDC events (Avro) -> Lakehouse (Parquet, columnar) -> Daily feature job (SQL/Spark) -> Offline feature store (training)
Daily feature job -> Online feature store (key-value, row) -> Real-time model serving (JSON API)
\`\`\`

**4. Trade-offs:** more copies of data (governance/consistency needed), CDC lag (eventual consistency), schema evolution handled via a registry.
**Conclusion:** row + OLTP for transactions; column + OLAP for features and training; key-value for low-latency serving; binary schema-based formats in between.

### Takeaway
Operational writes → row store (OLTP); training scans → columnar Parquet (OLAP); service-to-service messages → compact binary with a schema (Avro/Protobuf).`,
    },
    {
      title: "Q2: Data as a liability in a healthcare ML start-up",
      marks: 5,
      question: "A health-tech start-up wants to train a readmission-prediction model on hospital patient records from several countries. Applying the principles of “data as a liability”, “data sensitivity of ML pipelines” and “data reliability”, explain how it should collect, store and use the data.",
      solution: `
### What the examiner wants
How the data becomes a liability here (PII, consent, residency, leaks), the collection restrictions, the **three risk-reduction approaches in order**, and deletion/retention, all tied to the start-up's situation (L2, Lesson 2).

### Model answer
**Data as liability:** medical records are high-value but high-risk. A breach or misuse means lawsuits, fines and reputational damage. More data isn't automatically better.

**Collection restrictions**
- **Explicit consent** + purpose + **deletion criteria** for PII/PHI.
- **Data residency:** EU patients' data stays in the EU (GDPR); Indian data under DPDPA; HIPAA in the US.
- Hospital (source) policies captured in **data contracts**.

**Reducing liability (three approaches)**
1. **Access restriction:** least privilege even for employees; granular roles; detailed audit logs.
2. **Pseudonymisation:** replace patient IDs, names and exact addresses reversibly (the key is held separately), keeping model-relevant properties (age band, same-locality postcode).
3. **Connection removal (recommended):** the training dataset holds no link back to identities at all.
Plus a **retention and deletion** policy (including backups) and encryption at rest and in transit.

**Sensitivity of ML pipelines:** unlike plain pipelines (sensitive to volume and correctness), the ML pipeline is also sensitive to **distribution changes**. If one country's hospital feed silently stops, the job still succeeds but predictions for that population degrade. So add per-segment volume and distribution checks (PSI) and alerts.

**Reliability:** durability (replicated storage + backups), consistency across regional copies, **versioned** training datasets (reproducibility for audits), performance and availability SLAs.

\`\`\`flow
Hospitals (consent, contracts) -> Regional ingestion (encryption, pseudonymisation) -> Regional lakehouse (versioned) -> De-identified training set -> Model
Governance: RBAC, audit logs, retention/deletion, drift monitoring per country
\`\`\`
**Conclusion:** the data becomes an asset only when privacy, compliance and reliability controls are designed in from ingestion.

### Takeaway
Treat patient data as an asset only after the liability is controlled: consent, least access, pseudonymise or remove the link to identities, and plan deletion.`,
    },
    {
      title: "Q3: Lambda or Kappa for a ride-hailing platform",
      marks: 5,
      question: "A ride-hailing company needs (a) nightly reports and model training on months of trip history, and (b) real-time surge pricing and ETA predictions. Explain how Lambda and Kappa architectures would serve these needs, compare them, and recommend one.",
      solution: `
### What the examiner wants
Both architectures briefly, then a **recommendation with reasons specific to ride-hailing** (surge pricing and ETAs need real-time; demand forecasting needs history), with a diagram and the trade-offs (L3, Lesson 6).

### Model answer
**Lambda**
\`\`\`flow
Trip & GPS events (immutable) -> Batch layer (cold: lake/warehouse, full history) -> Batch views (reports, training data)
Trip & GPS events -> Speed layer (hot: stream processing) -> Real-time views (surge, ETA features)
Batch views + Real-time views -> Serving layer
\`\`\`
- (a) The batch layer gives accurate aggregates and **complete history for model training**.
- (b) The speed layer gives **low-latency** demand/supply counts for surge and ETA inference.
- **Drawback:** the same logic (e.g. "trips per zone per 5 min") is implemented twice in different frameworks. This causes duplication, inconsistency and operational burden, and a risk of **training-serving skew**.

**Kappa**
\`\`\`flow
Trip & GPS events -> Kafka (retained, ordered log) -> Stream processor -> Real-time views + feature store
Kafka -> Replay from start -> Recompute history / training sets
\`\`\`
- One codebase; batch = **replaying** the log; the same feature logic for history and live data, which suits **online learning**.
- **Drawbacks:** streaming is harder to operate; retaining months of GPS data in the log is expensive; large historical recomputation is slower and costlier than batch.

| | Lambda | Kappa |
|---|---|---|
| Codebases | Two | One |
| History | Cheap batch storage | Log retention/replay |
| Consistency train/serve | Risk of skew | Same logic |
| Ops complexity | Two systems | Streaming expertise |

**Recommendation:** a **Kappa-leaning** design, where Kafka is the backbone and the same stream jobs compute features for serving *and* write them to a feature store/lakehouse for training. Keep cheap object storage for deep history (a pragmatic hybrid, in the spirit of the Dataflow "batch as bounded stream" model). If the team is new to streaming, start with Lambda and converge later.

### Takeaway
Choose by team and workload: Kappa if one streaming codebase can serve both live and replayed history; Lambda if heavy batch recomputation must stay separate.`,
    },
    {
      title: "Q4: DataOps, CI/CD/CT and observability",
      marks: 5,
      question: "Explain how DataOps extends DevOps, and describe with a diagram a CI/CD/CT pipeline for an ML model. How does data observability prevent “data downtime”? Use an example.",
      solution: `
### What the examiner wants
DataOps vs DevOps, the four phases (experiment → CI → CD → CT) with what happens in each, and data observability, illustrated on one concrete ML system (L5, Lessons 7–8).

### Model answer
**DevOps → DataOps**
- DevOps unifies development and operations of **code** for fast, reliable releases.
- **DataOps** applies this to **data**: *dev* = building data pipelines; *ops* = monitoring, troubleshooting and enhancing them. It combines **agile** (governance and analytics development) with **DevOps** automation (builds, tests, delivery).
- Automation includes IaC (Terraform), orchestrators (Airflow/Dagster), auto-retry with back-off, schema-change detection that updates downstream dbt models, and self-healing workflows.

**CI/CD/CT for ML**
\`\`\`flow
Experiment (new feature idea) -> CI: pull request -> unit tests + automated retraining + integration tests -> model registry -> review
Model registry -> CD: canary deployment -> A/B test vs production -> promote
Production -> CT: scheduled retraining on fresh data -> registry -> redeploy
\`\`\`
- **CI:** besides code tests, the PR triggers the **training pipeline** and pushes the model to the **registry**.
- **CD:** a **canary** checks the model fits the serving pipeline; an **A/B test** proves it beats production.
- **CT:** a deployed model deteriorates (drift), so retrain periodically (e.g. daily fine-tuning) and reroute serving.

**Observability:** monitoring, tracking and **triaging data incidents** (freshness, volume, schema, distribution, lineage) so missing, late or wrong data is caught *before* it reaches models and dashboards (**data downtime**).
*Example (DoorDash):* poor observability let data issues produce **wrong delivery ETAs**. Their platform added prediction logs, a feature store and an automated training pipeline, cutting deployments from weeks to days.

**Conclusion:** DataOps + CI/CD/CT + observability turn ML from ad-hoc experiments into a reliable, continuously improving product.

### Takeaway
Automate the whole path (test, retrain, register, canary/A-B, recurring retraining) and watch the data, not just the model.`,
    },
    {
      title: "Q5: Streaming ingestion for an IoT fleet",
      marks: 5,
      question: "A logistics firm streams GPS and engine-sensor readings from 50,000 trucks to train predictive-maintenance models. Describe the key engineering considerations and streaming-specific challenges for ingesting this data, and propose an ingestion design.",
      solution: `
### What the examiner wants
A design diagram (devices → broker/stream → processing → storage), then each streaming concern (schema evolution, late data, duplicates/order, replay, size, TTL, dead-letter queue, push/pull) **with its mitigation** for this fleet (L7, Lessons 4 and 8).

### Model answer
**Key engineering considerations (slide 58):**
- **use case:** predictive maintenance plus live alerts
- **reusability:** one ingested stream for many consumers
- **lineage:** where the data lands
- **freshness:** seconds for alerts, daily for training
- **volume:** 50k trucks × readings per second
- **format:** JSON/Avro
- **quality:** sensor noise, invalid values
- **risks:** device clock errors
- **velocity:** in-flight processing needed

**Streaming challenges and handling**
| Challenge | Handling |
|---|---|
| **Late-arriving data** (trucks lose connectivity in tunnels) | Event-time processing with a **cut-off/watermark**; buffer on the device |
| **Out-of-order & duplicates** (at-least-once) | Partition by **truck_id** (per-truck order), idempotent consumers, de-duplicate by event id |
| **Schema evolution** (new sensor firmware) | **Schema registry** (Avro), data contract with the device team |
| **Message size** (Kinesis 1 MB) | Keep readings small; large diagnostics dumps go to object storage with a pointer event |
| **TTL / retention & replay** | Kafka retention long enough to **replay** for retraining/backfills |
| **Errors** | Invalid or oversized events go to a **dead-letter queue** for diagnosis and reprocessing |
| **Push vs pull** | Pull-based consumers (Kafka) for pipelines |

**Design**
\`\`\`flow
Trucks (MQTT/HTTPS) -> Ingestion gateway (auth, pre-ingestion validation) -> Kafka topic "telemetry" (partitioned by truck_id)
Kafka -> Stream processor (windows, anomaly alerts) -> Time-series DB / operational dashboard
Kafka -> Sink to object storage (Parquet, lakehouse) -> Daily feature build -> Predictive-maintenance training
Kafka -> Dead-letter queue (bad events)
\`\`\`
Governance: device data contract, lineage, encryption in transit, and retention policy. A **time-series DB** suits operational analytics; the **lakehouse** suits training.

### Takeaway
IoT data is late, duplicated and ever-changing: use a retained stream (Kafka), a schema registry, watermarks, idempotent consumers and a dead-letter queue.`,
    },
    {
      title: "Q6: Why a great offline model fails in production",
      marks: 5,
      question: "A bank's credit-default model showed 95% accuracy offline but performs poorly after deployment. Using the concepts of data leakage, training-serving skew and data/concept drift, explain the possible causes and describe the validation and monitoring you would put in place.",
      solution: `
### What the examiner wants
A diagnosis covering **all** the likely causes (leakage, training-serving skew, data drift, concept drift, selection bias), how to confirm each (logs, PSI/KL, comparing feature code), and fixes (L8, Lessons 5–7; L6 monitoring).

### Model answer
**Possible causes**

1. **Data leakage** (optimistic offline accuracy):
   - *Feature from the future:* e.g. "number of collection calls" or "late-payment reminders", which are known only *after* default and are 0 at application time.
   - *Target as a function of a feature:* e.g. a "write-off amount" column.
   - *Feature hiding the target:* a status code embedding "defaulted".
   - *Split issues:* duplicates across train/test; random splits on time-series data.

2. **Training-serving skew:** features computed differently in training (a Python notebook) and serving (SQL/Java), with different units, missing-value handling or time windows. Or mismatched compute resources.

3. **Data drift:**
   - *Schema skew:* the app now sends income monthly instead of yearly; a new employment category appears.
   - *Distribution skew:* the applicant mix changes after a marketing campaign (younger, thinner files).

4. **Concept drift:** an economic downturn changes the relationship between income/debt and default.

5. **Selection bias:** trained only on *approved* past loans, but served to *all* applicants.

**Validation and monitoring**
\`\`\`flow
Pre-ingestion: schema + business rules (contracts) -> Pre-training: leakage, split integrity, label balance, distributions -> Deploy via shadow / canary
Production: log features + predictions + outcomes -> PSI / KL per feature, performance by segment -> Alarm manager -> Retraining pipeline
\`\`\`
- **Leakage review:** a feature availability-timeline audit; time-based splits; suspiciously high importance checks.
- **One feature pipeline / feature store** shared by training and serving to remove skew.
- **Data validation** (Great Expectations/Deequ) at ingestion and before training.
- **Drift monitoring:** PSI on key features (> 0.25 means act), prediction-distribution monitoring, delayed-label performance tracking.
- **Safe deployment:** shadow deployment first, then canary/A-B.
- **CT:** scheduled retraining plus drift-triggered retraining; periodic fairness audits.

**Conclusion:** offline accuracy is meaningless if the data can't be reproduced at prediction time. Validation *before* training and monitoring *after* deployment are both needed.

### Takeaway
Offline-great, online-poor almost always means leakage, skew or drift. Log features and predictions, compare distributions, and share feature code between training and serving.`,
    },
  ],

  quiz: [],
};
