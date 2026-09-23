// DMML — Lecture 8: Data Profiling and Validation
// Source: CourseFiles/DMML/L8-Data Profiling and Validation.pptx (122 slides)

export default {
  title: "Data Profiling & Validation",
  source: "L8-Data Profiling and Validation.pptx · 122 slides",
  overview:
    "How to know whether data is *fit for ML*. The lecture covers the **10 data-quality dimensions** and the **ML-specific extensions** (informative, coverage, real inputs, unbiased, no feedback loop, consistent labels, big enough); **common data problems** (labelling cost, noise, low predictive power, outliers); **12 types of bias**, especially **selection bias** (coverage, non-response, sampling); **fairness** red flags; **data leakage** (target as a function of a feature, feature hiding the target, feature from the future); **skew and drift** (schema/distribution skew, concept drift, training-serving skew) with **PSI and KL divergence**; **data profiling** (single- and multi-field); **sampling and validation**; validation frameworks (**Great Expectations, Soda Core, Deequ**); and **pre-ingestion vs pre-training validation**.",

  summary: [
    {
      id: "dq",
      heading: "1. Data-quality dimensions",
      slides: "4–18",
      blocks: [
        { type: "p", text: "Data-quality dimensions are **measurable attributes** of data that can be assessed, interpreted and improved individually. Their aggregated scores indicate **fitness for use** in context." },
        {
          type: "table",
          caption: "The 10 dimensions, mapped to the healthcare examples on slide 6",
          head: ["Dimension", "Meaning", "Healthcare example", "Improve by"],
          rows: [
            ["**Accuracy**", "Represents real-world entities correctly; verifiable against trusted sources", "Blood group A+ recorded instead of O−", "Validation tools, audits, training"],
            ["**Completeness**", "All required values present", "Allergy info missing", "Alerts for missing fields, enrichment, governance accountability"],
            ["**Consistency**", "Same value across systems", "Weight 68 kg in EMR vs 75 kg in lab", "Central governance, integration tools"],
            ["**Timeliness**", "Available when needed; current", "ICU vitals updated 2 hours late", "Refresh schedules, real-time feeds, SLAs, streaming"],
            ["**Validity**", "Conforms to rules/formats/logic", "Heart rate 400 bpm; invalid ICD code; birth date in the future", "Entry rules, anomaly detection"],
            ["**Uniqueness**", "No duplicates", "“Rajesh Kumar” vs “R. Kumar” profiles", "Matching algorithms, identity policies, dashboards"],
            ["**Integrity**", "Accurate + consistent + reliable **over time**; referential integrity", "Prescription references a non-existent doctor ID", "Validation rules + referential-integrity checks"],
            ["**Lineage / traceability**", "Where data came from; audit trail to verify it", "Medication changed with no audit trail", "Lineage tools; regulations such as **BCBS 239**"],
            ["**Reliability**", "Accurate *and* continuously available (uptime); organisational factors matter too", "Different SpO₂ readings across systems", "Processes, governance, culture"],
            ["**Accessibility**", "Authorised users can find, retrieve, understand and use it (catalogues, APIs)", "MRI scans not retrievable in the ER", "Catalogues, consistent access methods"],
          ],
        },
        {
          type: "table",
          caption: "ML-specific extensions: what “good data” means for a model",
          head: ["Property", "Example", "Maps to"],
          rows: [
            ["**Informative**", "Predicting purchases needs product *and* past-purchase properties, not just name + location", "Completeness / usage"],
            ["**Good coverage**", "1,000 topics need enough documents each; with one doc per topic the model may learn document IDs", "Completeness / coverage"],
            ["**Reflects real inputs**", "Car detector trained only on daytime photos fails at night", "Accuracy"],
            ["**Unbiased**", "Click rate biased by position on the page (UI bias)", "Integrity"],
            ["**Not from a feedback loop**", "Don't label training data with the model's own predictions; clicks on model-highlighted emails aren't a true signal", "Integrity"],
            ["**Consistent labels**", "Different labellers, evolving class definitions, misread user motives (ignored ≠ disliked)", "Consistency"],
            ["**Big enough**", "Going from thousands to millions of examples often helps, but you can't know the required size upfront", "Completeness"],
          ],
        },
      ],
    },
    {
      id: "problems",
      heading: "2. Common problems with data",
      slides: "27–35",
      blocks: [
        { type: "list", items: [
          "**Cost:** unlabelled data can be expensive; **labelling is the most expensive**, especially manual work. Design streamlined labelling (Google's **reCAPTCHA** both fights spam and gets cheap labels).",
          "**Noise:** blurry images, broken text formatting, background audio noise, incomplete poll answers. It corrupts examples independently; fix with imputation, deblurring or noise suppression. It is **a bigger problem for small datasets** (leads to overfitting); in big data it averages out.",
          "**Low predictive power:** song-liking predicted from artist, title and lyrics alone misses arrangement, instruments, tone and rhythm, which must come from the audio. It is hard to tell whether the model isn't expressive enough or the data lacks information.",
          "**Outliers:** dissimilar examples (by some distance, e.g. Euclidean). Shallow models (linear/logistic regression, AdaBoost) are sensitive to them. Excluding them is debatable (not methodologically sound, especially for small datasets), but justified if holdout performance improves. In big data they matter less.",
        ]},
      ],
    },
    {
      id: "bias",
      heading: "3. Bias and fairness",
      slides: "36–57",
      blocks: [
        { type: "p", text: "**Bias in data** = an inconsistency with the phenomenon the data represents. Several types can co-occur." },
        {
          type: "table",
          head: ["Bias", "Definition", "Example"],
          rows: [
            ["**Omitted variable**", "A feature needed for accurate prediction is missing", "Churn model without a competitor's new cheaper plan"],
            ["**Sponsorship / funding**", "Data produced by a sponsored agency is skewed", "Sponsored news suppresses bad news about the sponsor"],
            ["**Prejudice / stereotype**", "Historical sources encode stereotypes", "Photos show men outdoors and women at home; word2vec: programmer − man + woman ≈ homemaker"],
            ["**Systematic value distortion**", "Constant device/measurement error", "Camera white balance makes white look yellow; production camera differs"],
            ["**Experimenter**", "Searching/interpreting to affirm prior beliefs; one-per-person surveys", "A surveyor's leading questions"],
            ["**Labelling**", "A biased labelling process/person", "Skim-reading labellers pick topics from keyphrases; skipping uninteresting docs"],
            ["**Reporting**", "Frequencies in data ≠ real-world frequencies (people record the unusual)", "Book reviews are mostly extreme, so the model misses subtle sentiment"],
            ["**Automation**", "Favouring automated results regardless of error rates", "Defect model 15% worse than human inspectors, yet the team was eager to deploy"],
            ["**Selection**", "Choosing data sources that are **easily available, convenient or cheap**", "Sending a new book's chapters only to the previous book's mailing list"],
            ["**Group attribution**", "Generalising individuals to the whole group: **in-group** (favour your own) / **out-group homogeneity** (stereotype others)", "Résumé screener favouring the engineers' own academy"],
            ["**Implicit**", "Assumptions from one's own experiences that don't generalise", "Head shake = “no” (means “yes” in some regions)"],
            ["**Confirmation**", "Unconsciously processing data to confirm beliefs", "Discarding features showing small dogs are docile after a bad poodle experience"],
          ],
        },
        {
          type: "table",
          caption: "Selection bias sub-types (all from the product-sales survey example)",
          head: ["Sub-type", "Cause", "Example"],
          rows: [
            ["**Coverage bias**", "Data not selected in a representative fashion", "Only buyers of *our* product surveyed; competitors' buyers excluded"],
            ["**Non-response / participation bias**", "Participation gaps during collection", "Competitor buyers were 80% more likely to refuse the survey"],
            ["**Sampling bias**", "No proper randomisation", "The first 200 email responders, likely more enthusiastic than average"],
          ],
        },
        { type: "p", text: "**Fairness:** models are *not inherently objective*, because humans curate the training data. Audit data and predictions for bias. **Red flags:** (1) **missing feature values** for many examples (e.g. 14,000 missing income values in California Housing), so investigate the cause; (2) **unexpected feature values** (implausible entries); (3) **data skew**: under/over-represented groups (only north-west California data used for state-wide prices, so the south is under-represented)." },
      ],
    },
    {
      id: "leak",
      heading: "4. Data leakage",
      slides: "58–64",
      blocks: [
        { type: "p", text: "**Data (target) leakage / contamination** is the unintentional introduction of information about the target that won't be available at prediction time. It gives **overly optimistic evaluation** and then failure in production." },
        {
          type: "table",
          head: ["Cause", "Example", "Fix"],
          rows: [
            ["**Target is a function of a feature**", "Predicting GDP with *population* and *GDP per capita* as features (their product = GDP). Predicting yearly salary with monthly salary", "Analyse each attribute's relation to the target; drop derived features"],
            ["**Feature hides the target**", "Predicting gender where a ‘Group’ column (e.g. ‘M18-25’) encodes gender and age", "Remove it, unless it is another model's prediction (then it's *stacking*)"],
            ["**Feature from the future**", "Loan-repayment model using ‘late payment reminders’: always 0 at application time in production", "Understand the business timeline: use only features known at prediction time"],
          ],
        },
      ],
    },
    {
      id: "drift",
      heading: "5. Skew, drift and drift detection",
      slides: "65–83",
      blocks: [
        { type: "p", text: "**Scenarios:** (1) **outdated** data, as user preferences change over time; (2) production data keeps changing, unlike static Kaggle sets; (3) **model decay speed** varies from days to years. *Past performance is no guarantee of future results.*" },
        {
          type: "table",
          head: ["Type", "What changes", "Example"],
          rows: [
            ["**Data drift: schema skew**", "Training and serving data don't share a schema: **new/missing features, changed types (int → real), changed domains** (a category disappears, a range shifts)", "Upstream app adds a field or changes a unit"],
            ["**Data drift: distribution skew**", "Feature distributions differ between training and serving (wrong training set, or natural trends)", "Real-estate prices change; a fashion item's popularity shifts"],
            ["**Concept drift**", "The **relationship between inputs and the target** changes; old mappings become invalid, or new classes appear", "What counts as spam evolves; fraud patterns change"],
            ["**Training-serving skew**", "Model outputs differ between training and serving because of different feature code, data changes, feedback loops, or **mismatched compute resources**", "Feature computed in Python for training but SQL for serving"],
          ],
        },
        { type: "p", text: "**Avoid training-serving skew:** **reuse the same feature-engineering code** for training and serving (a feature store), and match the computational resources." },
        { type: "p", text: "**Detection prerequisites:** log all incoming features and predictions, plus the ground truth (for label drift). **Approaches:** *model-based*; *statistical*: supervised (statistical process control, sequential analysis, adaptive windowing), unsupervised (clustering/novelty detection, feature-distribution monitoring, model-dependent **MD3** margin-density); *algorithm-based*: **PSI** and **KL divergence**." },
        {
          type: "table",
          head: ["Metric", "Formula", "Interpretation / uses"],
          rows: [
            ["**PSI** (Population Stability Index)", "$\\text{PSI} = \\sum_i (A_i - E_i)\\ln\\frac{A_i}{E_i}$ over bins (E = expected/training %, A = actual/new %)", "Rule of thumb: < 0.1 stable, 0.1–0.25 moderate shift, > 0.25 significant drift. Used in **credit scoring**, risk assessment, customer segmentation, fraud"],
            ["**KL divergence** (relative entropy)", "$D_{KL}(P\\|Q) = \\sum_i P_i \\ln\\frac{P_i}{Q_i}$", "Difference of a distribution from a baseline (a training window or the validation set); applied **per feature**; asymmetric. Also used in VAEs, TRPO, language models"],
          ],
        },
        { type: "p", text: "**Mini example:** training bins 25/25/25/25%, production bins 10/20/30/40%. PSI = 0.137 + 0.011 + 0.009 + 0.071 = **0.228**, a moderate shift (investigate, consider retraining). KL(P‖Q) = 0.106." },
      ],
    },
    {
      id: "profile",
      heading: "6. ML data readiness: profiling, sampling, validation",
      slides: "84–96",
      blocks: [
        { type: "p", text: "**Data profiling:** systematically analyse datasets for **quality, structure and content**: anomalies, missing values, patterns, metadata, integrity. It supports governance, standardisation and compliance, and can be automated." },
        {
          type: "table",
          head: ["Single-field profiling", "Multi-field profiling"],
          rows: [
            ["**Summary statistics** (count, min, max, mean)", "**Inclusion dependencies, keys, functional dependencies** (is one field's value set a subset of another's?)"],
            ["**Data types** (categorical/continuous, strings, timestamps, XML/JSON)", "**Numerical relationships**: pair plots, correlation heat maps"],
            ["**Data values** vs business rules (e.g. only South American students eligible)", ""],
            ["**Distributions**: counts per category; histograms (skew, modes, outliers)", ""],
          ],
        },
        { type: "p", text: "**When:** at the **very start** of a project, to judge viability, spot problems early, plan transformations and quality improvements, find issues needing business-process/ETL fixes, and predict ETL problems. This saves significant time." },
        { type: "p", text: "**Filter / selection / sampling:** not all created data is ingested. Sampling saves processing and training cost but loses some detail. Measure the quality cost against the savings (ML generally benefits from more data)." },
        { type: "p", text: "**Data validation:** check source-data accuracy and quality **before training a new model version**, so rare or incremental anomalies aren't silently ignored. Check that new data's statistics match expectations (feature distributions, number of categories). *Questions:* anomalies in incremental data? training assumptions violated at serving? train vs serve differences? differences between successive batches? The output must be **actionable** and **high precision** (too many false alarms destroy credibility). **Challenge:** rules for hundreds of columns and tracking history are laborious, so rules should self-refresh." },
      ],
    },
    {
      id: "frameworks",
      heading: "7. Validation frameworks & automated testing",
      slides: "97–119",
      blocks: [
        { type: "p", text: "```flow\nCompute statistics of training data (against rules) -> Compute statistics of new ingested data -> Compare -> Store results + automated action (remove row, cap/floor) -> Notify / alert for approval\n```" },
        {
          type: "table",
          head: ["", "Great Expectations (GX)", "Soda Core", "Deequ (AWS Labs)"],
          rows: [
            ["Idea", "“Test data, not just code”: **Expectations** describe the expected state of data", "Open-source Python library + CLI with **SodaCL** (YAML checks)", "Data-quality library on **Apache Spark** (Scala/Python)"],
            ["Strengths", "Exhaustive expectation library; checks run in place; supports **data contracts**; human-readable reports; stores results in S3/GCS/Postgres/files", "Broad connectors; programmatic or scheduled scans; production monitoring and external-data validation before ingestion", "Billions of rows; **suggests constraints** by profiling; metrics repository for trends (warn at > 3σ, error at > 4σ)"],
            ["Integrations", "Airflow (GreatExpectationsOperator), dbt, Dagster, Meltano", "Airflow, Dagster, dbt (results into Soda Cloud)", "EMR, Glue; metrics in S3/DynamoDB, QuickSight"],
            ["Best for", "Validation at every pipeline stage; shift-left quality", "Continuous production monitoring, anomaly detection", "Spark-based lakes; unit tests for large data"],
          ],
        },
        { type: "p", text: "**Deequ principles:** *declare constraints* (how the data should look) → *compute metrics* → *analyse and report* (anomaly vs history; report failing constraints and values)." },
        { type: "p", text: "**Automated quality testing:** sources produce bad data and rules change, so embed checks in each layer (e.g. the **medallion** bronze/silver/gold layers): correct patterns, data types, documentation. **Shift-left:** the first hotspot is **ingestion**. **Schema changes** are among the most common issues (hence data contracts). The next hotspots are after each transformation, before training." },
        {
          type: "table",
          caption: "Pre-training validation: what to validate",
          head: ["Category", "What you validate", "Why"],
          rows: [
            ["Schema", "Structure, types", "Prevent training failures"],
            ["Distributions", "Statistics, drift", "Prevent silent degradation"],
            ["Labels", "Correctness, balance", "A usable target"],
            ["Feature values", "Ranges, validity", "Prevent invalid semantics"],
            ["Missingness", "NaN, INF, null explosion", "Clean input"],
            ["Outliers", "Extreme values", "Stable gradients"],
            ["Leakage", "Temporal leakage, target contamination", "Generalisable model"],
            ["Split validation", "Train/test integrity", "Avoid fake accuracy"],
            ["Fairness", "Representation, bias", "Ethics and regulation"],
          ],
        },
        {
          type: "table",
          head: ["", "Pre-ingestion validation", "Pre-training validation"],
          rows: [
            ["Stage", "Data ingestion / preparation", "Model training"],
            ["Goal", "Raw data quality and **schema compliance**", "Fit-for-training data; tune and evaluate generalisation"],
            ["Data", "Raw incoming source data", "Clean, prepared data / held-back subset"],
            ["Example", "Card transaction validated by the bank API; invalid → client alerted before ingestion (logged)", "Check distributions, labels, leakage and split integrity before a training run"],
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["Data-quality dimension", "Measurable attribute: accuracy, completeness, consistency, timeliness, validity, uniqueness, integrity, lineage, reliability, accessibility."],
    ["Selection bias", "Skewing towards easily available/convenient/cheap data sources."],
    ["Coverage / non-response / sampling bias", "Unrepresentative selection / participation gaps / no randomisation."],
    ["Data leakage", "Target information in features that won't exist at prediction time."],
    ["Schema skew", "Training vs serving schema mismatch."],
    ["Distribution skew", "Training vs serving feature distributions differ."],
    ["Concept drift", "The input→target relationship changes."],
    ["Training-serving skew", "Different outputs from different train/serve pipelines."],
    ["PSI", "$\\sum (A-E)\\ln(A/E)$; > 0.25 means significant drift."],
    ["KL divergence", "$\\sum P\\ln(P/Q)$; asymmetric distance from a baseline."],
    ["Data profiling", "Systematic analysis of structure, content and quality."],
    ["Great Expectations", "Expectation-based data tests; data contracts."],
    ["Deequ", "Spark data-quality library with constraint suggestion."],
    ["Shift-left", "Validate as early as possible (at ingestion)."],
  ],

  examTips: [
    "**PYQ Q6 (Selection bias, 5 marks):** definition → **three sub-types** (coverage, non-response, sampling) with the survey examples → ML consequences → detection and mitigation → contrast with one other bias.",
    "Data-quality dimensions: map each to a concrete example (the healthcare list is perfect).",
    "Leakage: memorise the **three causes** with the GDP, gender-group and loan-reminder examples.",
    "Drift: **data drift (schema vs distribution)**, **concept drift** and **training-serving skew** are all distinct. Give one example each plus PSI/KL for detection.",
  ],

  theory: [
    {
      title: "Selection bias with examples",
      pyq: "Comprehensive Q6 (5 marks)",
      marks: 5,
      question: "There are various types of bias. Describe the Selection Bias with suitable examples.",
      solution: `
**Context:** bias in data is an *inconsistency with the phenomenon the data represents*. It can come from how data is collected, labelled or interpreted. The slides list 12 types (omitted variable, sponsorship, prejudice, systematic value distortion, experimenter, labelling, reporting, automation, **selection**, group attribution, implicit, confirmation).

**Definition:** **selection bias** is the tendency to skew the choice of data sources towards those that are **easily available, convenient and/or cost-effective**, so the collected data **doesn't represent the population** on which the model will be used.

*Classic example:* you want general readers' opinion of your new book, so you send early chapters to the mailing list of your *previous* book's readers. They will very likely like it, but that tells you little about a general reader.

**Three sub-types** (all using a model that predicts future sales of a new product from phone surveys):

| Sub-type | Cause | Example |
|---|---|---|
| **Coverage bias** | Data not selected in a **representative** fashion | Only consumers who **bought the product** were surveyed; buyers of a competing product were never included |
| **Non-response (participation) bias** | **Participation gaps** in collection make the data unrepresentative | Both groups surveyed, but competitor buyers were **80% more likely to refuse**, so they are under-represented |
| **Sampling bias** | **No proper randomisation** during collection | The surveyor took the **first 200 consumers who replied to an email**, likely more enthusiastic than average |

\`\`\`flow
Target population (all potential buyers) -> Convenient / non-random selection -> Skewed sample -> Model learns skewed patterns -> Poor predictions for unseen groups
\`\`\`

**Other ML examples:**
- A face-recognition model trained mostly on one ethnicity (easily scraped celebrity photos) performs poorly on others.
- A loan-default model trained only on **approved** applicants (rejected applicants have no repayment outcome). This is also called *reject inference* bias.
- Housing prices trained only on north-west California data (slide 57's skew) mis-price the south.

**Consequences:** optimistic offline metrics, poor generalisation, **unfair** outcomes for under-represented groups, and wrong business decisions.

**Detection and mitigation:**
- Compare sample distributions with population/production distributions during **profiling** (skew, missing groups, PSI).
- **Random and stratified sampling**; oversample under-represented groups.
- Follow up non-responders; add incentives; use multiple collection channels.
- Reweight samples; collect data from the *deployment* population; document the collection in data contracts and datasheets.
- Fairness audits of predictions per group.

**Conclusion:** selection bias arises *before modelling*, at collection. No algorithm can fully fix data that doesn't represent the target population, so representative, randomised collection is the primary defence.`,
    },
    {
      title: "Data-quality dimensions for an ML dataset",
      marks: 5,
      question: "Explain the key data-quality dimensions with a healthcare example for each. Which additional properties make data “good” specifically for ML?",
      solution: `
| Dimension | Meaning | Healthcare example |
|---|---|---|
| Accuracy | Correctly represents reality | Blood group A+ recorded instead of O−, risking a wrong transfusion |
| Completeness | Required values present | Allergy information missing, risking an adverse drug reaction |
| Consistency | Same across systems | Weight 68 kg in EMR vs 75 kg in lab gives the wrong dose |
| Timeliness | Available and current when needed | ICU vitals updated 2 hours late delays intervention |
| Validity | Obeys rules/formats | Heart rate 400 bpm or an invalid ICD code |
| Uniqueness | No duplicates | “Rajesh Kumar” and “R. Kumar” fragment the clinical history |
| Integrity | Correct over time; referential integrity | Prescription refers to a non-existent doctor ID |
| Lineage/traceability | Origin and audit trail | Medication changed with no audit trail |
| Reliability | Trustworthy and continuously available | Different SpO₂ readings across systems |
| Accessibility | Authorised users can get it | MRI scans not retrievable in the ER |

**ML-specific “good data” properties:**
- **Informative:** enough predictive features.
- **Good coverage** of every class/topic.
- **Reflects real production inputs** (not daytime-only photos).
- **Unbiased** (e.g. UI position bias in clicks).
- **Not the result of a feedback loop** (no self-labelled data).
- **Consistent labels.**
- **Big enough** to generalise.

Aggregated dimension scores express **fitness for use** in the specific context.`,
    },
    {
      title: "Data leakage: causes and prevention",
      marks: 5,
      question: "What is data leakage? Explain its three causes with examples and how to prevent it in an ML pipeline.",
      solution: `
**Data (target) leakage / contamination:** unintentionally giving the model information about the target that **won't be available at prediction time**. Evaluation looks excellent, then the model fails in production.

**1. Target is a function of a feature**
- Predicting a country's **GDP** with *population* and *GDP per capita* as features: their product *is* GDP.
- Predicting **yearly salary** with *monthly salary* in the table. In production, monthly salary won't be supplied (otherwise no model is needed).

**2. Feature hides the target**
- Predicting customer **gender** when a *Group* column holds demographic codes like "F25-34". The target is hidden inside a feature.
- *Exception:* if Group is another model's (less accurate) prediction, using it is legitimate **model stacking**.

**3. Feature from the future**
- Predicting **loan repayment** using *Late Payment Reminders*. At application time it is always 0, so the model learned a signal that never exists at prediction time.

**Prevention:**
- Analyse each feature's relation to the target and its **availability timeline** (understand the business context).
- Time-based splits for temporal data; build features only from data before the prediction timestamp.
- **Remove duplicates before splitting**; fit scalers/imputers on training data only.
- Pre-training validation checks for leakage (temporal leakage, target contamination) and suspiciously high feature importance or near-perfect accuracy.`,
    },
    {
      title: "Data drift, concept drift and training-serving skew",
      marks: 5,
      question: "Differentiate data drift (schema skew, distribution skew), concept drift and training-serving skew with examples. How can drift be detected (PSI, KL divergence)?",
      solution: `
**Why it matters:** production data keeps changing (unlike static Kaggle data), so models **decay**, some in days, others in years.

| Type | What changes | Example | Response |
|---|---|---|---|
| **Schema skew** (data drift) | Training and serving schemas differ: new or missing features, types (int → float), domains (a category disappears, the range changes) | An upstream app starts sending price in paise instead of rupees | Schema validation, data contracts |
| **Distribution skew** (data drift) | Feature distributions differ | Housing prices rise; fashion popularity shifts | Monitor distributions; retrain on recent data |
| **Concept drift** | The **input → target relationship** changes; new classes appear | Fraudsters change tactics; the meaning of "spam" evolves | Retrain/relabel; possibly redesign features |
| **Training-serving skew** | The same input gives different features/outputs in training and serving (different code, data changes, feedback loops, different compute) | Feature computed in pandas for training but SQL at serving | **Reuse the same feature code** (feature store); match resources |

**Detection:** log features, predictions and ground truth. Approaches: model-based; statistical (SPC, sequential analysis, adaptive windowing; clustering/novelty; feature-distribution monitoring; MD3); algorithmic:
- **PSI** $= \\sum (A_i - E_i)\\ln(A_i/E_i)$. < 0.1 stable, 0.1–0.25 moderate, > 0.25 significant. *Example:* training bins 25/25/25/25%, new 10/20/30/40% gives PSI ≈ **0.23**, a moderate shift. Widely used in credit scoring.
- **KL divergence** $= \\sum P_i\\ln(P_i/Q_i)$: per-feature divergence from a baseline (training or validation window). Asymmetric.

Drift alerts → alarm manager → **retraining pipeline** (L6).`,
    },
    {
      title: "Data profiling and data validation",
      marks: 5,
      question: "What is data profiling? Explain single-field and multi-field profiling and when profiling should be done. How does data validation differ, and what should validation check before training?",
      solution: `
**Data profiling:** systematically analysing datasets to evaluate their **quality, structure and content**. It finds anomalies, missing values and patterns, produces metadata, validates integrity, and supports governance and compliance.

- **Single-field:**
  - summary statistics (count, min, max, mean)
  - data types (categorical/continuous; strings, timestamps, JSON/XML)
  - data values vs business rules
  - distributions (category counts, histograms for skew, modes, outliers)
- **Multi-field:**
  - inclusion dependencies, keys, functional dependencies
  - numerical relationships (pair plots, correlation heat maps)

**When:** **at the very beginning** of a project, to check viability, find dirty data early, plan transformations, identify business-process/ETL issues and predict ETL problems.

**Data validation** checks accuracy and quality **before training each new model version**, comparing new data statistics with expectations or the training baseline, so incremental anomalies aren't silently ignored. Its output must be **actionable** and **high-precision** (false alarms kill credibility).

**Pre-training checks:**
- schema (structure, types)
- distributions / drift
- labels (correctness, balance)
- feature ranges
- missingness (NaN/INF)
- outliers
- **leakage**
- train/test split integrity
- fairness/representation

\`\`\`flow
Training statistics (baseline) -> New data statistics -> Compare against rules -> Auto-action (drop / cap / floor) -> Alert & approve -> Train
\`\`\``,
    },
    {
      title: "Great Expectations vs Soda Core vs Deequ",
      marks: 5,
      question: "Explain how a data validation component works and compare Great Expectations, Soda Core and Deequ. Which would you choose for a Spark-based data lake, and which for validating third-party data before ingestion?",
      solution: `
**How a validation component works:**
1. Compute statistics of the training data against a set of rules.
2. Compute statistics of the newly ingested data.
3. Compare them.
4. Store the results and take automated actions (remove rows, cap or floor values).
5. Send notifications/alerts for approval.

| | Great Expectations | Soda Core | Deequ |
|---|---|---|---|
| Core idea | "Test data, not just code": declarative **Expectations** | YAML checks in **SodaCL**, CLI + Python | **Constraint** verification on **Spark** |
| Unique features | Huge expectation library; checks run in place; **data contracts**; human-readable docs; results in S3/GCS/Postgres | Many connectors; programmatic or scheduled scans; anomaly detection and profiling | **Constraint suggestion** from profiling; metrics repository; anomaly rules (warn > 3σ, error > 4σ) |
| Integrations | Airflow operator, dbt, Dagster, Meltano | Airflow, Dagster, dbt → Soda Cloud | AWS EMR, Glue; S3/DynamoDB; QuickSight |
| Sweet spot | Validation at every pipeline stage (shift-left) | Production monitoring; **external data before ingestion** | **Billions of rows** in Spark lakes |

**Choices:**
- **Spark-based lake → Deequ.** It scales on Spark, auto-suggests constraints, and tracks metric trends.
- **Third-party data before ingestion → Soda Core** (explicitly suited to external-data validation and production monitoring), or GX with a data contract.

All three support automated, shift-left quality testing inside orchestrators.`,
    },
    {
      title: "Pre-ingestion vs pre-training validation",
      marks: 5,
      question: "Where can data-quality issues enter a pipeline? Compare pre-ingestion and pre-training validation with examples, explaining the shift-left principle.",
      solution: `
**Where issues enter:** at data input, during ingestion, and after ingestion during transformations. Validate strategically at the **hotspots**.

**Shift-left:** validate as **early** as possible. The first hotspot is **ingestion**, because unexpected **schema changes** are among the most common quality issues (hence data contracts). Schema validation alone catches a large share of errors. Later hotspots come after each transformation step, before training.

\`\`\`flow
Source / client -> PRE-INGESTION validation (schema, format, business rules) -> Ingest -> Transform (checks after each step) -> PRE-TRAINING validation (distributions, labels, leakage, split) -> Train
\`\`\`

| | Pre-ingestion | Pre-training |
|---|---|---|
| Stage | Data ingestion/preparation | Just before model training |
| Goal | Raw data quality and **schema compliance**; reject bad data at the door | Data fit for learning; reliable evaluation of generalisation |
| Data | Raw incoming source data | Cleaned, prepared data and held-back subsets |
| Checks | Schema, types, formats, mandatory fields, business rules | Distributions/drift, labels, ranges, NaN/INF, outliers, **leakage**, split integrity, fairness |
| Example | A card transaction is validated via the bank/card API; if invalid, the client is alerted immediately, before ingestion (and the failure is logged) | Before retraining a fraud model, check label balance, PSI of key features, and no future-dated features |`,
    },
  ],

  quiz: [
    { q: "Duplicate patient profiles (“Rajesh Kumar” vs “R. Kumar”) violate:", options: ["Accuracy", "Uniqueness", "Timeliness", "Accessibility"], answer: 1, why: "Each entity should appear once." },
    { q: "Heart rate recorded as 400 bpm violates:", options: ["Validity", "Completeness", "Lineage", "Timeliness"], answer: 0, why: "It breaks domain rules." },
    { q: "Surveying only the first 200 email responders is:", options: ["Coverage bias", "Non-response bias", "Sampling bias", "Reporting bias"], answer: 2, why: "No proper randomisation." },
    { q: "Competitor buyers refusing the survey far more often causes:", options: ["Sampling bias", "Non-response bias", "Automation bias", "Implicit bias"], answer: 1, why: "Participation gaps." },
    { q: "Using ‘late payment reminders’ to predict loan repayment at application time is leakage via:", options: ["Target as a function of a feature", "Feature hiding the target", "Feature from the future", "Sampling"], answer: 2, why: "The value doesn't exist at prediction time." },
    { q: "A change in the relationship between inputs and target is:", options: ["Schema skew", "Distribution skew", "Concept drift", "Training-serving skew"], answer: 2, why: "Concept drift." },
    { q: "A PSI of 0.32 indicates:", options: ["Stable population", "Minor change", "Significant drift", "Perfect match"], answer: 2, why: "> 0.25 is significant by the common rule of thumb." },
    { q: "Best way to avoid training-serving skew:", options: ["More data", "Reuse the same feature-engineering code in training and serving", "Bigger model", "Lower learning rate"], answer: 1, why: "A single feature pipeline or feature store." },
    { q: "Which framework suggests constraints automatically and runs on Spark?", options: ["Great Expectations", "Soda Core", "Deequ", "dbt"], answer: 2, why: "AWS Labs' Deequ." },
    { q: "Favouring a model's output even though humans are more accurate is:", options: ["Automation bias", "Confirmation bias", "Selection bias", "Labelling bias"], answer: 0, why: "Trusting automation irrespective of error rates." },
  ],
};
