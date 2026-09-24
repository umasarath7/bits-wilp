// DMML — Lecture 8: Data Profiling & Validation
// Source: CourseFiles/DMML/L8-Data Profiling and Validation.pptx (119 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Profiling & Validation",
  source: "L8-Data Profiling and Validation.pptx · 119 slides",
  overview:
    "A model can only be as good as its data. So how do we **know** whether data is good, and how do we **keep checking** as it changes? This lecture asks: **what** does “good data” mean (quality dimensions, and what ML needs on top)? **What** usually goes wrong (noise, outliers, weak features)? **Where** does bias come from, especially **selection bias**, which was a full question last time (**PYQ Q6**)? **What** is data leakage and why does it fool us? **Why** do models decay in production (drift and skew), and how do we detect it (PSI, KL divergence)? And **how** do we profile and validate data automatically? Running examples: a hospital's patient data (the slides' healthcare examples) and a company surveying customers about a new product.",

  summary: [
    {
      id: "dq",
      heading: "Lesson 1: What makes data “good”? The data-quality dimensions",
      slides: "4–18",
      blocks: [
        {
          type: "p",
          text: "“Good data” is vague. To improve quality we need to **measure** it, and the slides break it into **data-quality dimensions**: *measurable attributes of data that can be assessed, interpreted and improved individually*. Combining the scores tells you how **fit for use** the data is in a particular context.",
        },
        {
          type: "p",
          text: "The easiest way to learn them is through the slides' hospital examples. For each dimension, ask: *what would go wrong for a patient if this failed?*",
        },
        {
          type: "table",
          caption: "The 10 dimensions, with slide 6's healthcare examples",
          head: ["Dimension", "Meaning", "Hospital example of failure", "How to improve"],
          rows: [
            ["**Accuracy**", "Correctly represents the real world; verifiable against a trusted source", "Blood group recorded A+ when it's O−", "Validation tools, audits, staff training"],
            ["**Completeness**", "All required values are present", "Allergy information missing", "Alerts for empty fields, enrichment, accountability"],
            ["**Consistency**", "The same value everywhere it appears", "Weight 68 kg in the medical record, 75 kg in the lab system", "Central governance, integration tools"],
            ["**Timeliness**", "Available when needed, and current", "ICU vital signs updated 2 hours late", "Refresh schedules, real-time feeds, SLAs, streaming"],
            ["**Validity**", "Follows the rules, formats and logic", "Heart rate 400 bpm; an invalid ICD diagnosis code; a birth date in the future", "Entry rules, anomaly detection"],
            ["**Uniqueness**", "No duplicates", "“Rajesh Kumar” and “R. Kumar” as two patients", "Matching algorithms, identity policies"],
            ["**Integrity**", "Accurate, consistent and reliable **over time**; references point to things that exist", "A prescription refers to a doctor ID that doesn't exist", "Validation and referential-integrity checks"],
            ["**Lineage / traceability**", "You can see where data came from and how it changed", "A medication dose changed with no audit trail", "Lineage tools; regulations such as **BCBS 239** (banking risk-data rules)"],
            ["**Reliability**", "Accurate *and* continuously available; depends on processes and culture too", "Different oxygen-level (SpO₂) readings in different systems", "Processes, governance, culture"],
            ["**Accessibility**", "Authorised people can find, retrieve, understand and use it", "MRI scans can't be retrieved in the emergency room", "Catalogues, consistent access methods (APIs)"],
          ],
        },
      ],
    },
    {
      id: "mlgood",
      heading: "Lesson 2: What does “good data” mean for a model specifically?",
      slides: "19–26",
      blocks: [
        {
          type: "p",
          text: "Data can be clean by all ten dimensions and still be bad **for ML**. The slides add seven ML-specific properties:",
        },
        {
          type: "table",
          head: ["Property", "What it means", "Example of failure"],
          rows: [
            ["**Informative**", "Contains the information needed to predict the target", "Predicting purchases from only a product's name and a customer's location, without product properties or past purchases"],
            ["**Good coverage**", "Enough examples of every situation the model will face", "1,000 topics but one document per topic, so the model may just memorise document IDs"],
            ["**Reflects real inputs**", "Training data looks like production data", "A car detector trained only on daytime photos fails at night"],
            ["**Unbiased**", "No systematic distortion", "Click rates skewed by an item's position on the page (UI bias)"],
            ["**Not from a feedback loop**", "Labels don't come from the model's own outputs", "Using clicks on emails the model highlighted as “truth”: the model is learning from itself"],
            ["**Consistent labels**", "Everyone labels the same way", "Different labellers, class definitions that change, misread motives (an ignored item isn't necessarily disliked)"],
            ["**Big enough**", "Enough data to generalise", "Going from thousands to millions of examples often helps, but the required size can't be known in advance"],
          ],
        },
      ],
    },
    {
      id: "problems",
      heading: "Lesson 3: What usually goes wrong with data?",
      slides: "27–35",
      blocks: [
        {
          type: "list",
          items: [
            "**Cost (slides 27–28).** Unlabelled data can be expensive; **labelling is the most expensive part**, especially by hand. Design labelling to be cheap and streamlined. Google's **reCAPTCHA** is a clever example: it stops bots *and* gets millions of people to label images for free.",
            "**Noise (slides 29–30).** Random corruption of individual examples: blurry images, broken text formatting, background noise in audio, half-answered surveys. Fix with imputation, deblurring or noise suppression. **Noise hurts small datasets far more** (the model overfits to it); in big data it tends to average out.",
            "**Low predictive power (slides 31–32).** Predicting whether someone will like a song from the artist, title and lyrics misses what really matters: arrangement, instruments, tone, rhythm. Those must be extracted from the audio. The frustrating part: when a model is weak, it's hard to tell whether the **model** isn't expressive enough or the **data** simply lacks the information.",
            "**Outliers (slides 33–35).** Examples very different from the rest (by some distance, e.g. Euclidean). Shallow models (linear/logistic regression, AdaBoost) are sensitive to them. Should you delete them? It's debatable, and not methodologically sound for small datasets, but justified if performance on held-out data improves. In big data they matter less.",
          ],
        },
      ],
    },
    {
      id: "bias",
      heading: "Lesson 4: Where does bias come from?",
      slides: "36–50",
      blocks: [
        {
          type: "p",
          text: "**Bias in data** is *an inconsistency between the data and the real-world phenomenon it's supposed to represent*. It's dangerous because a biased model looks accurate on its own (biased) test data, then fails, or treats people unfairly, in the real world. Several kinds can occur at once:",
        },
        {
          type: "table",
          head: ["Bias", "What it is", "Example"],
          rows: [
            ["**Omitted variable**", "A feature essential for prediction is missing", "A churn model that doesn't know a competitor just launched a cheaper plan"],
            ["**Sponsorship / funding**", "Data produced by a sponsored body is skewed toward the sponsor", "Sponsored news suppresses bad news about the sponsor"],
            ["**Prejudice / stereotype**", "Historical sources encode stereotypes", "Photos show men outdoors and women at home; word2vec learns programmer − man + woman ≈ homemaker"],
            ["**Systematic value distortion**", "A constant measurement error from a device", "A camera's white balance makes white look yellow; the production camera differs from the training one"],
            ["**Experimenter**", "Searching or interpreting data to confirm what you already believe", "A surveyor asking leading questions"],
            ["**Labelling**", "The labelling process or person introduces bias", "Labellers skim and pick topics from key phrases; they skip boring documents"],
            ["**Reporting**", "How often things appear in data ≠ how often they happen (people record the unusual)", "Book reviews are mostly extreme, so the model can't detect mild sentiment"],
            ["**Automation**", "Trusting automated results regardless of their error rate", "A defect-detection model 15% worse than human inspectors, yet the team was eager to deploy it"],
            ["**Selection**", "Choosing data sources because they're **easy, convenient or cheap**", "Sending a new book's chapters only to the author's previous mailing list"],
            ["**Group attribution**", "Generalising from individuals to their whole group: **in-group** (favouring your own) or **out-group homogeneity** (stereotyping others)", "A résumé screener favouring graduates of the engineers' own academy"],
            ["**Implicit**", "Assuming your own experience applies to everyone", "Assuming a head shake means “no” (in parts of India it can mean “yes”)"],
            ["**Confirmation**", "Unconsciously processing data to confirm your beliefs", "Dropping features that show small dogs are docile, after one bad experience with a poodle"],
          ],
        },
      ],
    },
    {
      id: "selection",
      heading: "Lesson 5: Selection bias in depth (PYQ Q6), and fairness red flags",
      slides: "51–57",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Definition",
          text: "**Selection bias** occurs when the data used to train a model is **not chosen in a way that represents the population** the model will be used on, typically because sources are picked for being **easily available, convenient or cheap**. The model then learns patterns of the *sample*, not the *population*.",
        },
        {
          type: "p",
          text: "The slides illustrate it with one running story: **a company surveys customers to predict sales of a new product.** Each sub-type is a different way that survey goes wrong:",
        },
        {
          type: "table",
          caption: "The three sub-types of selection bias",
          head: ["Sub-type", "Cause", "Survey example", "Fix"],
          rows: [
            ["**Coverage bias**", "The population isn't covered representatively", "Only people who bought **our** product are surveyed; buyers of competitors' products are left out", "Define the target population first; sample from all of it"],
            ["**Non-response (participation) bias**", "Some groups are less likely to take part", "Competitors' customers were **80% more likely to refuse** the survey", "Follow up non-responders; weight responses; incentives"],
            ["**Sampling bias**", "No proper randomisation", "Taking the **first 200 email replies**, who are likely more enthusiastic than average", "Random (or stratified) sampling"],
          ],
        },
        { type: "diagram", name: "d8-selection" },
        {
          type: "p",
          text: "**Why it matters for ML:** the model looks great in testing (because the test data is biased the same way), then under-performs, or treats groups unfairly, on the real population. *Hospital example:* a model trained only on patients from city hospitals misjudges rural patients whose health patterns differ.",
        },
        {
          type: "p",
          text: "**Fairness (slides 55–57).** Models are **not inherently objective**: humans choose and curate their training data. So audit both the data and the predictions for bias. Three **red flags** to look for:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Missing feature values** for many examples. The California Housing dataset has about 14,000 missing income values, so investigate why (are they concentrated in one group?).",
            "**Unexpected feature values:** implausible entries that hint at collection problems.",
            "**Data skew:** under- or over-represented groups. If only north-west California data is used to predict prices for the whole state, the south is under-represented.",
          ],
        },
      ],
    },
    {
      id: "leak",
      heading: "Lesson 6: What is data leakage, and why does it fool us?",
      slides: "58–64",
      blocks: [
        {
          type: "p",
          text: "**Data (target) leakage**, also called contamination, is the unintentional use of **information about the target that won't be available when the model makes real predictions**. It's like a student who secretly saw the answer key: brilliant in the mock exam, lost in the real one. Evaluation looks **overly optimistic**, and the model fails in production.",
        },
        {
          type: "table",
          caption: "Three causes (slides 59–64)",
          head: ["Cause", "Example", "Fix"],
          rows: [
            ["**The target is a function of a feature**", "Predicting a country's GDP using *population* and *GDP per capita* as features: multiply them and you get GDP. Or predicting yearly salary from monthly salary", "Check how each feature relates to the target; drop features derived from it"],
            ["**A feature hides the target**", "Predicting gender where a “Group” column has values like “M18-25”, which contains gender (and age)", "Remove it, unless it's another model's prediction (then it's legitimate *stacking*)"],
            ["**A feature from the future**", "A loan-default model using “number of late-payment reminders”. At application time this is always 0, because the loan hasn't started", "Understand the business timeline: use only features known **at the moment of prediction**"],
          ],
        },
        { type: "diagram", name: "d8-leak" },
        {
          type: "p",
          text: "Leakage also happens when duplicates end up in both training and test sets (Lecture 6), or when test data is used to choose features or scaling parameters. **Warning sign:** accuracy that seems too good to be true usually is.",
        },
      ],
    },
    {
      id: "drift",
      heading: "Lesson 7: Why do models decay in production? Skew, drift and how to detect it",
      slides: "65–83",
      blocks: [
        {
          type: "p",
          text: "A Kaggle dataset never changes. Real production data does, constantly (slides 65–67): **user preferences change**, so training data goes out of date; production data keeps shifting; and models **decay at different speeds**, from days to years. As the slides put it, *past performance is no guarantee of future results*. The different ways things change have precise names:",
        },
        {
          type: "table",
          head: ["Type", "What changes", "Example"],
          rows: [
            ["**Data drift: schema skew**", "Training and serving data no longer share the same schema: **new or missing features, changed types** (integer → real), **changed domains** (a category disappears, a range shifts)", "An upstream app adds a field or switches kg to lb"],
            ["**Data drift: distribution skew**", "Feature **distributions** differ between training and serving (a bad training set, or natural trends)", "House prices rise; a fashion item goes out of style"],
            ["**Concept drift**", "The **relationship between inputs and target** changes; old patterns stop being valid, or new classes appear", "What counts as spam evolves; fraudsters change tactics"],
            ["**Training-serving skew**", "The model behaves differently in serving than in training because of **different feature code**, data changes, feedback loops, or **mismatched compute**", "A feature computed in Python for training but in SQL for serving, with slightly different rounding"],
          ],
        },
        {
          type: "p",
          text: "**Avoiding training-serving skew:** **reuse exactly the same feature-engineering code** for training and serving (this is what a feature store is for), and match the compute resources.",
        },
        {
          type: "p",
          text: "**Detecting drift (slides 72–78).** First, **log everything**: incoming features, predictions and, when it arrives later, the ground truth (needed to detect label drift). Then detection approaches: **model-based**; **statistical**, either supervised (statistical process control, sequential analysis, adaptive windowing) or unsupervised (clustering/novelty detection, monitoring feature distributions, the model-dependent **MD3** margin-density method); and **distance metrics** such as **PSI** and **KL divergence**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "PSI and KL divergence",
          text: "Split a feature into bins. Let $E_i$ = the % of **training** (expected) data in bin i, and $A_i$ = the % of **new** (actual) data in bin i.\n\n$$\\text{PSI} = \\sum_i (A_i - E_i)\\,\\ln\\frac{A_i}{E_i} \\qquad D_{KL}(P\\,\\|\\,Q) = \\sum_i P_i \\ln\\frac{P_i}{Q_i}$$\n\n**PSI (Population Stability Index) rule of thumb:** below 0.1 → stable; 0.1–0.25 → moderate shift; above 0.25 → significant drift. Widely used in **credit scoring**, risk, segmentation and fraud.\n\n**KL divergence** (relative entropy) measures how different a distribution is from a baseline (a training window or the validation set), usually **per feature**. It's **asymmetric**: $D_{KL}(P\\|Q) \\ne D_{KL}(Q\\|P)$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example",
          text: "A feature's training distribution over 4 bins is 25%, 25%, 25%, 25%. In production this month it's 10%, 20%, 30%, 40%.\n\n| Bin | E | A | A − E | ln(A/E) | (A − E) ln(A/E) |\n|---|---|---|---|---|---|\n| 1 | 0.25 | 0.10 | −0.15 | −0.916 | 0.137 |\n| 2 | 0.25 | 0.20 | −0.05 | −0.223 | 0.011 |\n| 3 | 0.25 | 0.30 | 0.05 | 0.182 | 0.009 |\n| 4 | 0.25 | 0.40 | 0.15 | 0.470 | 0.071 |\n\nPSI = 0.137 + 0.011 + 0.009 + 0.071 = **0.228**: a **moderate shift**. Investigate and consider retraining. (KL(A‖E) = 0.106.) Note that every PSI term is positive: shifts in either direction add to the total.",
        },
        { type: "diagram", name: "d8-psi" },
      ],
    },
    {
      id: "profile",
      heading: "Lesson 8: How do we check data is ready? Profiling, sampling and validation",
      slides: "84–96",
      blocks: [
        {
          type: "p",
          text: "**Data profiling (slides 84–90)** is *systematically analysing a dataset's quality, structure and content*: finding anomalies, missing values, patterns, metadata and integrity problems. It supports governance, standardisation and compliance, and can be automated. Two levels:",
        },
        {
          type: "table",
          head: ["Single-field profiling", "Multi-field profiling"],
          rows: [
            ["**Summary statistics:** count, min, max, mean", "**Inclusion dependencies, keys, functional dependencies:** is one field's set of values a subset of another's? Does one field determine another?"],
            ["**Data types:** categorical or continuous, strings, timestamps, XML/JSON", "**Numerical relationships:** pair plots, correlation heat maps"],
            ["**Values against business rules:** e.g. only South American students are eligible", ""],
            ["**Distributions:** counts per category; histograms showing skew, modes and outliers", ""],
          ],
        },
        {
          type: "p",
          text: "**When to profile:** at the **very start** of a project, to judge whether it's viable, spot problems early, plan transformations and quality fixes, find issues that need fixing in business processes or ETL, and predict ETL problems. It saves a lot of time later.",
        },
        {
          type: "p",
          text: "**Filtering, selection and sampling (slide 91).** Not everything that's created gets ingested. Sampling cuts processing and training cost but loses some detail. Weigh the quality cost against the savings, remembering that ML usually benefits from more data (and that careless sampling causes selection bias).",
        },
        {
          type: "p",
          text: "**Data validation (slides 92–96)** checks data **before each new model version is trained**, so that rare or gradual anomalies aren't silently absorbed into the model. It asks: do the new data's statistics match expectations (feature distributions, number of categories)? Are there anomalies in the latest increment? Are assumptions made at training time violated at serving time? How do training and serving data differ, and how do successive batches differ? Two requirements for the output: it must be **actionable** (say what to fix) and **high precision** (too many false alarms and people stop trusting it). The challenge: writing rules for hundreds of columns and tracking their history by hand is laborious, so rules should **refresh themselves** from the data.",
        },
      ],
    },
    {
      id: "frameworks",
      heading: "Lesson 9: How do we automate validation? Frameworks and where to test",
      slides: "97–119",
      blocks: [
        {
          type: "p",
          text: "```flow\nCompute statistics of training data (against rules) -> Compute statistics of new ingested data -> Compare -> Store results + automated action (remove row, cap/floor) -> Notify / alert for approval\n```",
        },
        {
          type: "table",
          caption: "Three popular frameworks (slides 99–110)",
          head: ["", "Great Expectations (GX)", "Soda Core", "Deequ (AWS Labs)"],
          rows: [
            ["Idea", "“Test your data, not just your code”: **Expectations** describe the expected state of data", "Open-source Python library + command line; checks written in **SodaCL** (YAML)", "A data-quality library built on **Apache Spark** (Scala/Python)"],
            ["Strengths", "A huge library of expectations; checks run where the data is; supports **data contracts**; human-readable reports; results stored in S3/GCS/Postgres/files", "Many connectors; scans run programmatically or on a schedule; good for production monitoring and checking external data before ingestion", "Scales to billions of rows; **suggests constraints** by profiling the data; keeps a metrics history for trend alerts (warn beyond 3σ, error beyond 4σ)"],
            ["Integrations", "Airflow, dbt, Dagster, Meltano", "Airflow, Dagster, dbt (results to Soda Cloud)", "AWS EMR, Glue; metrics in S3/DynamoDB; QuickSight"],
            ["Best for", "Validation at every pipeline stage; shift-left quality", "Continuous production monitoring and anomaly detection", "Spark-based data lakes; unit tests for very large data"],
          ],
        },
        {
          type: "p",
          text: "**Deequ's three steps:** *declare constraints* (how the data should look) → *compute metrics* → *analyse and report* (compare with history; list failing constraints and values).",
        },
        {
          type: "p",
          text: "**Where to put the tests (slides 111–114).** Sources produce bad data and rules change, so embed checks in **every layer**, e.g. the **medallion architecture**'s bronze (raw), silver (cleaned) and gold (business-ready) layers: correct patterns, data types, documentation. **Shift left**: the first hotspot is **ingestion**, because catching problems at the front door is cheapest. **Schema changes** are among the most common problems (hence data contracts, Lecture 7). The next hotspots are after each transformation and just before training.",
        },
        {
          type: "table",
          caption: "Pre-training checklist (slides 115–117)",
          head: ["Check", "What you validate", "Why"],
          rows: [
            ["Schema", "Structure and types", "Prevent training failures"],
            ["Distributions", "Statistics, drift", "Prevent silent degradation"],
            ["Labels", "Correctness and balance", "A usable target"],
            ["Feature values", "Ranges, validity", "Prevent nonsense inputs"],
            ["Missingness", "NaN, infinity, sudden jumps in nulls", "Clean input"],
            ["Outliers", "Extreme values", "Stable training"],
            ["Leakage", "Temporal leakage, target contamination", "A model that generalises"],
            ["Split validation", "Train/test integrity (no overlap)", "Avoid fake accuracy"],
            ["Fairness", "Representation and bias", "Ethics and regulation"],
          ],
        },
        {
          type: "table",
          caption: "Pre-ingestion vs pre-training validation (slides 118–119)",
          head: ["", "Pre-ingestion validation", "Pre-training validation"],
          rows: [
            ["Stage", "Data ingestion / preparation", "Model training"],
            ["Goal", "Raw data quality and **schema compliance**", "Data fit for training; generalisation"],
            ["Data checked", "Raw incoming source data", "Cleaned, prepared data and held-back subsets"],
            ["Example", "A card transaction is checked by the bank's API; if invalid, the client is alerted before it's ingested (and it's logged)", "Checking distributions, labels, leakage and split integrity before a training run"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole lecture in seven lines",
          text: "1. Ten quality dimensions: accuracy, completeness, consistency, timeliness, validity, uniqueness, integrity, lineage, reliability, accessibility (learn the hospital examples).\n2. For ML, data must also be informative, well covered, realistic, unbiased, free of feedback loops, consistently labelled and big enough. Common problems: labelling cost, noise, low predictive power, outliers.\n3. Many biases: omitted variable, sponsorship, stereotype, systematic distortion, experimenter, labelling, reporting, automation, **selection**, group attribution, implicit, confirmation.\n4. **Selection bias** = convenient, unrepresentative data: **coverage**, **non-response**, **sampling** (survey example). Fairness red flags: missing values, unexpected values, skew.\n5. **Leakage**: target is a function of a feature (GDP), a feature hides the target (“M18-25”), a feature from the future (late-payment reminders).\n6. Drift: schema skew, distribution skew, **concept drift**, training-serving skew (share feature code). Detect with logs + statistics; **PSI** > 0.25 = significant; KL divergence per feature.\n7. Profile early (single- and multi-field); validate before every training run (actionable, high precision); automate with Great Expectations, Soda, Deequ; shift left to ingestion; pre-ingestion vs pre-training checks.",
        },
      ],
    },
  ],

  glossary: [
    ["Data-quality dimension", "—", "A measurable attribute of data quality"],
    ["Fitness for use", "—", "Whether data is good enough for a particular purpose"],
    ["EMR", "Electronic Medical Record", "A patient's digital health record"],
    ["ICD code", "International Classification of Diseases", "Standard diagnosis codes"],
    ["Referential integrity", "—", "References (IDs) always point to records that exist"],
    ["BCBS 239", "Basel Committee on Banking Supervision standard 239", "Rules for banks' risk-data aggregation and reporting"],
    ["SLA", "Service Level Agreement", "A promised level of timeliness/availability"],
    ["Feedback loop (data)", "—", "Training on labels produced by the model's own outputs"],
    ["reCAPTCHA", "—", "Google's bot test that also collects labels"],
    ["Noise", "—", "Random corruption of individual examples"],
    ["Outlier", "—", "An example very different from the rest"],
    ["Bias (data)", "—", "Inconsistency between the data and the real-world phenomenon"],
    ["Selection bias", "—", "Training data chosen unrepresentatively (convenient, cheap sources)"],
    ["Coverage bias", "—", "Part of the population isn't included"],
    ["Non-response bias", "Participation bias", "Some groups decline to take part"],
    ["Sampling bias", "—", "No proper randomisation in choosing the sample"],
    ["In-group / out-group homogeneity bias", "—", "Favouring your own group / seeing other groups as all alike"],
    ["word2vec", "—", "A word-embedding model that can absorb stereotypes from text"],
    ["Data (target) leakage", "Contamination", "Target information in features that won't exist at prediction time"],
    ["Stacking", "—", "Using one model's predictions as features for another (legitimate)"],
    ["Schema skew", "—", "Training and serving data have different schemas"],
    ["Distribution skew", "—", "Training and serving feature distributions differ"],
    ["Concept drift", "—", "The relationship between inputs and target changes"],
    ["Training-serving skew", "—", "Different behaviour in training vs serving (different code, data or compute)"],
    ["Ground truth", "—", "The true label, often known only later"],
    ["MD3", "Margin Density Drift Detection", "Detects drift from changes in how many points lie near the decision margin"],
    ["PSI", "Population Stability Index", "$\\sum (A - E)\\ln(A/E)$; above 0.25 means significant drift"],
    ["KL divergence", "Kullback–Leibler divergence (relative entropy)", "$\\sum P\\ln(P/Q)$; asymmetric difference from a baseline"],
    ["Data profiling", "—", "Systematic analysis of data's structure, content and quality"],
    ["Functional dependency", "—", "One field's value determines another's"],
    ["Data validation", "—", "Checking data against expectations before use"],
    ["GX", "Great Expectations", "Framework of human-readable data “expectations”"],
    ["SodaCL", "Soda Checks Language", "YAML language for data-quality checks"],
    ["Deequ", "—", "AWS Labs' Spark library for data-quality constraints"],
    ["σ", "Sigma (standard deviation)", "Used for alert thresholds (3σ, 4σ)"],
    ["Medallion architecture", "Bronze / silver / gold layers", "Raw → cleaned → business-ready data"],
    ["Shift-left", "—", "Test as early as possible in the pipeline"],
    ["NaN / INF", "Not a Number / infinity", "Invalid numeric values"],
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
### What the examiner wants
A precise definition (unrepresentative data chosen for convenience), the **three sub-types with the survey examples**, the consequence for ML (looks good in testing, fails on the real population), and how to detect and mitigate it. Contrasting it with one other bias shows depth (Lesson 5).

### Model answer
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

**Conclusion:** selection bias arises *before modelling*, at collection. No algorithm can fully fix data that doesn't represent the target population, so representative, randomised collection is the primary defence.

### Takeaway
Selection bias is about **who gets into the data**. Coverage = whole groups missing; non-response = groups declining; sampling = no randomisation. Fix it at collection time, because more of the same biased data doesn't help.`,
    },
    {
      title: "Data-quality dimensions for an ML dataset",
      marks: 5,
      question: "Explain the key data-quality dimensions with a healthcare example for each. Which additional properties make data “good” specifically for ML?",
      solution: `
### What the examiner wants
The dimensions named and defined, **each with a concrete example** (the hospital ones work well), how to improve each, and the ML-specific extensions (Lessons 1–2).

### Model answer
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

Aggregated dimension scores express **fitness for use** in the specific context.

### Takeaway
Quality is measurable, dimension by dimension; for ML, also ask whether the data is informative, representative, unbiased and consistently labelled.`,
    },
    {
      title: "Data leakage: causes and prevention",
      marks: 5,
      question: "What is data leakage? Explain its three causes with examples and how to prevent it in an ML pipeline.",
      solution: `
### What the examiner wants
Definition and why it's dangerous (over-optimistic evaluation), the **three causes** with the GDP, “M18-25” and late-payment examples, and prevention steps (Lesson 6).

### Model answer
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
- Pre-training validation checks for leakage (temporal leakage, target contamination) and suspiciously high feature importance or near-perfect accuracy.

### Takeaway
Ask of every feature: *would I know this value at the exact moment I make the prediction?* If not, it leaks.`,
    },
    {
      title: "Data drift, concept drift and training-serving skew",
      marks: 5,
      question: "Differentiate data drift (schema skew, distribution skew), concept drift and training-serving skew with examples. How can drift be detected (PSI, KL divergence)?",
      solution: `
### What the examiner wants
Each type defined precisely with an example (schema vs distribution skew under data drift), how to avoid training-serving skew, and detection methods including a PSI/KL formula and interpretation (Lesson 7).

### Model answer
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

Drift alerts → alarm manager → **retraining pipeline** (L6).

### Takeaway
Data drift = inputs change; concept drift = the input→target rule changes; training-serving skew = your own pipelines disagree. Log everything and monitor PSI/KL.`,
    },
    {
      title: "Data profiling and data validation",
      marks: 5,
      question: "What is data profiling? Explain single-field and multi-field profiling and when profiling should be done. How does data validation differ, and what should validation check before training?",
      solution: `
### What the examiner wants
Profiling (single- vs multi-field, and when to do it) and validation (when, what questions, requirements: actionable and high precision), and how they differ (Lesson 8).

### Model answer
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
\`\`\`

### Takeaway
Profiling **discovers** what the data is like, once at the start; validation **checks** that each new batch still matches expectations, every time.`,
    },
    {
      title: "Great Expectations vs Soda Core vs Deequ",
      marks: 5,
      question: "Explain how a data validation component works and compare Great Expectations, Soda Core and Deequ. Which would you choose for a Spark-based data lake, and which for validating third-party data before ingestion?",
      solution: `
### What the examiner wants
A comparison table on idea, strengths, integrations and best use, plus a line on shift-left testing and where in the pipeline to run them (Lesson 9).

### Model answer
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

All three support automated, shift-left quality testing inside orchestrators.

### Takeaway
GX = readable expectations at every stage; Soda = monitoring with YAML checks; Deequ = Spark-scale constraints with auto-suggestions.`,
    },
    {
      title: "Pre-ingestion vs pre-training validation",
      marks: 5,
      question: "Where can data-quality issues enter a pipeline? Compare pre-ingestion and pre-training validation with examples, explaining the shift-left principle.",
      solution: `
### What the examiner wants
Both stages compared on goal, data checked and examples, with the pre-training checklist (schema, distributions, labels, leakage, splits, fairness) (Lesson 9).

### Model answer
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
| Example | A card transaction is validated via the bank/card API; if invalid, the client is alerted immediately, before ingestion (and the failure is logged) | Before retraining a fraud model, check label balance, PSI of key features, and no future-dated features |

### Takeaway
Pre-ingestion guards the front door (schema, raw quality); pre-training guards the model (distributions, labels, leakage, fairness).`,
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
