// AML — Contact Session 3: Model selection & training, evaluation, hyperparameter optimisation, ML pipelines/MLOps
// Source: CourseFiles/AML/ContactSession3-EndToEndML2.pptx (46 slides)

export default {
  title: "Model Selection, Evaluation, Tuning & MLOps",
  source: "ContactSession3-EndToEndML2.pptx · 46 slides",
  overview:
    "Choosing and training models (regression for housing, where a decision tree overfits and a random forest does better; classification for MNIST, a binary '5-detector'; multiclass via OvA/OvO), evaluating them properly (confusion matrix, why accuracy fails on imbalanced data, precision/recall/F1, learning curves, holdout/CV/bootstrap, ROC and AUC), tuning hyperparameters (by hand, grid search, early stopping, random search), and running models in production with MLOps (CI/CD/CT, data and model validation).",

  summary: [
    {
      id: "select",
      heading: "1. Model selection & training",
      slides: "1–7",
      blocks: [
        { type: "list", items: [
          "**Labels available?** Real-valued output → **regression**. Discrete output (binary/integer) → **classification**. No labels → **unsupervised**.",
          "**Housing (regression):** start with linear regression. A **decision tree regressor** gives very low *training* error but poor *cross-validation* error, i.e. **overfitting**. A **random forest regressor** (an ensemble of trees) gives better CV accuracy.",
          "**MNIST (classification):** 70,000 handwritten digits, 28×28 pixels (0–255) → a **70000 × 784** data matrix. Split into **60,000 train / 10,000 test**, and **shuffle** the training set so CV folds are similar and the order doesn't bias the model.",
          "**Binary '5-detector':** target = 1 if the image is a 5, else 0. Cross-validate several classifiers.",
        ]},
        {
          type: "table",
          caption: "Multiclass strategies",
          head: ["", "One-vs-All (OvA / OvR)", "One-vs-One (OvO)"],
          rows: [
            ["Idea", "One binary classifier per class: class k vs the rest", "One binary classifier per **pair** of classes"],
            ["# classifiers (K classes)", "$K$", "$K(K-1)/2$"],
            ["Prediction", "Class with the **highest score**", "Class that **wins the most duels** (majority vote)"],
            ["MNIST (K = 10)", "10 classifiers", "45 classifiers"],
            ["Advantage", "Few classifiers", "Each is trained only on the data of its 2 classes, so it is fast for algorithms that scale badly with data size (e.g. SVM)"],
          ],
        },
        { type: "p", text: "Random forests and Naive Bayes handle multiple classes **natively**. SVMs and linear classifiers are strictly **binary**, so they need OvA or OvO." },
      ],
    },
    {
      id: "metrics",
      heading: "2. Metrics: confusion matrix and beyond",
      slides: "8–13",
      blocks: [
        {
          type: "table",
          caption: "Confusion matrix (slide notation: a, b, c, d)",
          head: ["", "Predicted Yes", "Predicted No"],
          rows: [
            ["**Actual Yes**", "a = **TP**", "b = **FN**"],
            ["**Actual No**", "c = **FP**", "d = **TN**"],
          ],
        },
        {
          type: "table",
          caption: "Metrics you must know",
          head: ["Metric", "Formula", "Answers the question"],
          rows: [
            ["**Accuracy**", "$\\frac{TP+TN}{TP+TN+FP+FN}$", "How often is the model right overall?"],
            ["**Precision**", "$\\frac{TP}{TP+FP}$", "Of the items flagged positive, how many really are? (cost of **false alarms**)"],
            ["**Recall / Sensitivity / TPR**", "$\\frac{TP}{TP+FN}$", "Of the actual positives, how many did we catch? (cost of **misses**)"],
            ["**F1-score**", "$\\frac{2PR}{P+R} = \\frac{2TP}{2TP+FP+FN}$", "Harmonic mean of precision and recall"],
            ["**FPR**", "$\\frac{FP}{FP+TN}$", "Fraction of negatives wrongly flagged"],
            ["**Specificity / TNR**", "$\\frac{TN}{TN+FP} = 1 - FPR$", ""],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Limitation of accuracy (slide 12)",
          text: "9,990 class-0 and 10 class-1 examples. Predicting *everything* as class 0 gives **99.9% accuracy** while detecting **zero** class-1 cases. For imbalanced classes use precision, recall, F1 or ROC-AUC.",
        },
        {
          type: "callout",
          kind: "exam",
          title: "Precision vs recall: which matters? (PYQ Q1c)",
          text: "If missing a positive is costly (fraud, cancer, churn), **maximise recall**. If false alarms are costly (spam filter deleting real mail, costly manual investigations), **maximise precision**.",
        },
      ],
    },
    {
      id: "methods",
      heading: "3. Methods of performance evaluation",
      slides: "14–22",
      blocks: [
        { type: "p", text: "Performance depends on more than the algorithm: **class distribution, cost of misclassification, and the size of the training and test sets**." },
        { type: "p", text: "**Learning curve:** accuracy vs training-set size (arithmetic or geometric sampling schedule). With small samples, the performance estimate has both **bias** and **variance**." },
        {
          type: "table",
          caption: "Methods of estimation",
          head: ["Method", "How"],
          rows: [
            ["**Holdout**", "Train on 2/3, test on 1/3"],
            ["**Random subsampling**", "Repeated holdout; average the results"],
            ["**k-fold cross-validation**", "k disjoint partitions; train on k−1, test on 1; repeat k times"],
            ["**Leave-one-out**", "k = n"],
            ["**Stratified sampling**", "Keep the class proportions in every split/fold"],
            ["**Bootstrap**", "Sample n records **with replacement**; about 63.2% are unique, and the rest (≈36.8%) are used for testing"],
          ],
        },
        { type: "p", text: "**ROC curve:** plots **TPR (y-axis) vs FPR (x-axis)** as the decision threshold varies. It comes from 1950s signal-detection theory and shows the trade-off between hits and false alarms." },
        {
          type: "list",
          items: [
            "(0, 0): everything predicted negative. (1, 1): everything predicted positive. **(0, 1): the ideal classifier.**",
            "Diagonal = **random guessing** (AUC = 0.5). Below the diagonal = predictions opposite to the true class.",
            "**AUC:** 1 = ideal, 0.5 = random. When curves cross (M1 better at low FPR, M2 at high FPR), no model dominates; choose by the operating region you need.",
            "**Construction:** sort instances by $P(+|x)$ descending, use each unique score as a threshold, count TP/FP, and plot (FPR, TPR).",
          ],
        },
      ],
    },
    {
      id: "hpo",
      heading: "4. Hyperparameter optimisation",
      slides: "23–30",
      blocks: [
        { type: "p", text: "**Hyperparameters** are set before training: learning rate, number of iterations (gradient descent), batch size (mini-batch), regularisation constant, and so on. Tuning them is also called *metaparameter optimisation*." },
        {
          type: "table",
          head: ["Method", "How", "Pros / cons"],
          rows: [
            ["**By hand**", "Fiddle until the results look good", "Most common; decent results, but lots of effort and no guarantees"],
            ["**Grid search**", "Try every combination on a grid; pick the best", "Brute force; cost grows **exponentially** with the number of hyperparameters; choosing the grid is hard"],
            ["**Grid + early stopping**", "Run all points for 1 epoch, discard the worse half, repeat (successive halving)", "Much cheaper"],
            ["**Grid + parallelism**", "Each setting on a different server (embarrassingly parallel)", "Faster wall-clock time, but **same energy cost**"],
            ["**Random search** (`RandomizedSearchCV`)", "Random points instead of a grid", "Beats the curse of dimensionality; but with finitely many samples it may miss the optimum"],
            ["**Cross-validation**", "Evaluate each setting on validation folds", "Reliable, but computationally expensive"],
          ],
        },
      ],
    },
    {
      id: "mlops",
      heading: "5. ML pipelines & MLOps",
      slides: "31–45",
      blocks: [
        { type: "p", text: "**MLOps** is an engineering culture that unifies ML development (Dev) and operation (Ops), with automation and monitoring at every step: integration, testing, release, deployment and infrastructure. The ML code is only a **small fraction** of a real ML system. The rest is data collection, verification, feature extraction, serving, monitoring and so on." },
        {
          type: "table",
          caption: "How ML differs from ordinary software (DevOps)",
          head: ["Aspect", "ML-specific challenge"],
          rows: [
            ["Team skills", "Data scientists focus on EDA, modelling and experiments, not production engineering"],
            ["Development", "Experimental: track what worked, reproducibility, code reuse"],
            ["Testing", "Also **data validation**, model quality evaluation and model validation"],
            ["Deployment", "A multi-step pipeline that retrains and redeploys automatically"],
            ["Production", "Performance decays as **data profiles evolve**; monitor statistics and roll back"],
          ],
        },
        { type: "list", items: [
          "**CI** = testing and validating code *and* **data, data schemas and models**.",
          "**CD** = a *training pipeline* that automatically deploys *another service* (the model prediction service).",
          "**CT (continuous training)** is unique to ML: automatically retrain and serve models in production.",
          "**Manual process (level 0):** script-driven and interactive; ML and ops are disconnected, which causes **training-serving skew**; infrequent releases with no CI/CD or monitoring. Deployment = the trained model served as a REST microservice.",
          "**Data validation** (before training): **data value skew** (the statistics change, so trigger retraining) and **data schema skew** (unexpected or missing features/values, so stop the pipeline and fix it).",
          "**Model validation** (after retraining): evaluate on test data, compare with the production/baseline model, check consistency across data segments, test infrastructure/API compatibility, then do online validation (**canary / A/B testing**).",
          "**Level 1:** automate the pipeline for CT, with pipeline triggers and metadata management. **Level 2:** full CI/CD pipeline automation with these stages: development & experimentation → pipeline CI → pipeline CD → automated training → model CD → monitoring.",
          "**CI tests** include unit tests for feature engineering (e.g. a one-hot encoder), training convergence, NaN checks (division by zero), expected artifacts and component integration. **CD checks** include infrastructure compatibility, API tests, latency/throughput, and meeting performance targets. Deployment goes automated to test → semi-automated to pre-prod → manual to production.",
        ]},
        { type: "p", text: "**Frameworks:** Kubeflow + Cloud Build (Google), AWS MLOps, Azure MLOps." },
      ],
    },
  ],

  keyTerms: [
    ["Precision", "TP / (TP + FP): purity of the positive predictions."],
    ["Recall (TPR)", "TP / (TP + FN): coverage of the actual positives."],
    ["F1", "Harmonic mean of precision and recall."],
    ["FPR", "FP / (FP + TN)."],
    ["ROC / AUC", "TPR vs FPR over thresholds; area: 1 = ideal, 0.5 = random."],
    ["OvA vs OvO", "K classifiers vs K(K−1)/2 classifiers."],
    ["Bootstrap", "Sampling with replacement; ≈63.2% of records are unique."],
    ["Learning curve", "Performance vs training-set size."],
    ["Grid / random search", "Exhaustive vs random sampling of the hyperparameter space."],
    ["MLOps", "DevOps principles applied to ML systems."],
    ["CT", "Continuous training: automatic retraining in production."],
    ["Training-serving skew", "Mismatch between how data is processed in training and in serving."],
    ["Data schema skew", "Input doesn't match the expected features/types."],
    ["Canary / A-B test", "Online validation on a small slice of real traffic."],
  ],

  examTips: [
    "Confusion-matrix metrics are **guaranteed marks** (PYQ Q1b). Write the four formulas first, substitute, and keep 3–4 decimals.",
    "Always add one line of **interpretation**: “recall 0.91 means the model catches 91% of the fraud cases.”",
    "OvO count: $K(K-1)/2$. For 10 classes the answer is **45**, a favourite number.",
    "ROC questions: state the axes (TPR vs FPR), the ideal point (0, 1), and that the diagonal means random guessing.",
    "For MLOps theory, the keywords that score are **CI (code + data + model tests), CD (pipeline deploys prediction service), CT (auto-retrain), data/schema skew, model validation, monitoring**.",
  ],

  problems: [
    {
      title: "Confusion-matrix metrics and business choice",
      pyq: "Midsem Q1(b)+(c): accuracy, precision, recall, F1, then analyst A vs B",
      level: "Medium",
      marks: 4,
      question: `A spam classifier evaluated on 500 emails:

| | Predicted Spam | Predicted Ham |
|---|---|---|
| Actual Spam | 90 (TP) | 10 (FN) |
| Actual Ham | 30 (FP) | 370 (TN) |

(a) Compute accuracy, precision, recall, F1, FPR and specificity.
(b) User X hates finding spam in the inbox. User Y can't afford to lose a genuine email to the spam folder. Who is happier with this classifier? Justify with the metrics.`,
      solution: `
**(a)**
- Accuracy $= (90+370)/500 = $ **0.92**
- Precision $= 90/(90+30) = $ **0.75**
- Recall $= 90/(90+10) = $ **0.90**
- F1 $= 2(90)/(180+30+10) = 180/220 = $ **0.818**
- FPR $= 30/(30+370) = $ **0.075**
- Specificity $= 370/400 = $ **0.925**

**(b)**
- **User X** cares about catching spam, i.e. **recall** = 0.90. Only 10 of 100 spam emails reach the inbox, so X is fairly happy.
- **User Y** cares about **precision** (and FPR). Precision 0.75 means 1 in 4 emails in the spam folder is genuine: 30 real emails were lost. Y is **less satisfied**.

To please Y, raise the decision threshold. This trades recall for precision.`,
    },
    {
      title: "The accuracy paradox on imbalanced data",
      level: "Medium",
      marks: 4,
      question:
        "A test set has 9,990 negatives and 10 positives (slide 12). (a) Model A predicts everything negative. Compute its accuracy, recall and precision. (b) Model B gives TP = 8, FN = 2, FP = 40, TN = 9950. Compute accuracy, precision, recall and F1. (c) Which model is better and why?",
      solution: `
**(a) Model A**
- Accuracy $= 9990/10000 = $ **99.9%**
- Recall $= 0/10 = $ **0**
- Precision $= 0/0$, undefined (no positive predictions)

**(b) Model B**
- Accuracy $= (8+9950)/10000 = $ **99.58%**
- Precision $= 8/48 = $ **0.167**
- Recall $= 8/10 = $ **0.80**
- F1 $= 16/(16+40+2) = $ **0.276**

**(c)** **Model B**, even though its accuracy is *lower*. It detects 80% of the rare positives, while A detects none. Accuracy is dominated by the majority class. For imbalanced data, judge models on recall, precision, F1 or AUC. B's precision is low (many false alarms), which may be acceptable for screening.`,
    },
    {
      title: "Build an ROC curve and compute AUC",
      level: "Hard",
      marks: 6,
      question: `A probabilistic classifier gives these scores (slide 21):

| Inst | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| P(+) | 0.95 | 0.93 | 0.87 | 0.85 | 0.85 | 0.85 | 0.76 | 0.53 | 0.43 | 0.25 |
| Class | + | + | − | − | − | + | − | + | − | + |

(a) For each threshold "predict + if $P \\ge t$", compute TP, FP, TPR and FPR.
(b) List the ROC points and compute the AUC with the trapezoidal rule.
(c) What does this AUC say about the classifier?`,
      solution: `
Positives $P = 5$, negatives $N = 5$.

| $t \\ge$ | TP | FP | TPR | FPR |
|---|---|---|---|---|
| >0.95 | 0 | 0 | 0 | 0 |
| 0.95 | 1 | 0 | 0.2 | 0 |
| 0.93 | 2 | 0 | 0.4 | 0 |
| 0.87 | 2 | 1 | 0.4 | 0.2 |
| 0.85 | 3 | 3 | 0.6 | 0.6 |
| 0.76 | 3 | 4 | 0.6 | 0.8 |
| 0.53 | 4 | 4 | 0.8 | 0.8 |
| 0.43 | 4 | 5 | 0.8 | 1.0 |
| 0.25 | 5 | 5 | 1.0 | 1.0 |

(All three 0.85 instances enter together.)

**(b)** ROC points (FPR, TPR): (0,0), (0,0.2), (0,0.4), (0.2,0.4), (0.6,0.6), (0.8,0.6), (0.8,0.8), (1,0.8), (1,1)

AUC = sum of trapezoids:
- 0→0.2: $0.2 \\times 0.4 = 0.08$
- 0.2→0.6: $0.4 \\times (0.4+0.6)/2 = 0.20$
- 0.6→0.8: $0.2 \\times 0.6 = 0.12$
- 0.8→1.0: $0.2 \\times 0.8 = 0.16$

**AUC = 0.56**

**(c)** Only slightly better than random guessing (0.5). The model ranks the first two positives well but then mixes the classes badly.`,
    },
    {
      title: "OvA vs OvO classifier counts and data sizes",
      level: "Easy",
      marks: 3,
      question:
        "(a) How many binary classifiers do OvA and OvO need for 3, 4, 10 and 26 classes? (b) MNIST has 60,000 training images, about 6,000 per digit. How many images does each OvA classifier and each OvO classifier train on? (c) Why can OvO be faster overall for SVMs even though it trains more classifiers?",
      solution: `
**(a)**

| K | OvA = K | OvO = K(K−1)/2 |
|---|---|---|
| 3 | 3 | 3 |
| 4 | 4 | 6 |
| 10 | 10 | **45** |
| 26 | 26 | 325 |

**(b)** Each **OvA** classifier uses **all 60,000** images (one digit vs the rest). Each **OvO** classifier uses only the two digits' images, about **12,000**.

**(c)** SVM training cost grows super-linearly with the number of samples (roughly $O(n^2)$ or more). Training 45 small problems of 12k samples is cheaper than 10 large problems of 60k samples. OvO's advantage is exactly that each classifier sees only the data of its two classes.`,
    },
    {
      title: "Bootstrap sampling",
      level: "Medium",
      marks: 3,
      question:
        "You draw a bootstrap sample of size n = 1000 from 1000 records. (a) What is the probability that a given record is never chosen? (b) About how many unique records end up in the training sample, and how many are left for testing? (c) What happens to this fraction as n → ∞?",
      solution: `
**(a)** In each draw the chance of missing the record is $1 - \\tfrac1n$. Over $n$ draws:
$$\\left(1-\\tfrac{1}{1000}\\right)^{1000} = \\mathbf{0.3677}$$

**(b)** Unique records $\\approx 1000 \\times (1-0.3677) \\approx$ **632**. The about **368** records never drawn form the test (out-of-bag) set.

**(c)** $\\left(1-\\frac1n\\right)^n \\to e^{-1} = 0.368$, so about **63.2%** of records are unique in the bootstrap sample. This is the source of the ".632 bootstrap".`,
    },
    {
      title: "Cost of grid search with successive halving",
      level: "Medium",
      marks: 4,
      question:
        "You have 64 hyperparameter configurations, and each epoch of training costs 1 unit. (a) Plain grid search trains each configuration for 7 epochs. What is the total cost? (b) With early stopping (slide 28), you train all configurations for 1 epoch, discard the worse half, and repeat until one remains. What is the total cost? (c) What is the speed-up, and what is the risk?",
      solution: `
**(a)** $64 \\times 7 = $ **448 units**

**(b)** Configurations per round: 64, 32, 16, 8, 4, 2, 1
Cost $= 64+32+16+8+4+2+1 = $ **127 units**

**(c)** Speed-up $\\approx 448/127 = $ **3.5×**. **Risk:** a configuration that starts slowly but would have been best (e.g. a small learning rate) may be discarded too early.`,
    },
    {
      title: "Random search: how many trials?",
      level: "Medium",
      marks: 3,
      question:
        "Suppose the “good” region of hyperparameter space is the top 5% of configurations. (a) With random search of 60 trials, what is the probability that at least one trial lands in the good region? (b) How many trials are needed for a 95% chance? (c) Why does random search beat grid search when only a few hyperparameters matter?",
      solution: `
**(a)** $P = 1 - 0.95^{60} = 1 - 0.046 = $ **0.954**

**(b)** $1 - 0.95^n \\ge 0.95 \\Rightarrow n \\ge \\frac{\\ln 0.05}{\\ln 0.95} = 58.4$, so **59 trials**

**(c)** The cost doesn't grow exponentially with dimensions. A 3×3 grid tries only **3** distinct values of each hyperparameter in 9 runs, while 9 random trials try **9** distinct values of each. If only one hyperparameter really matters, random search explores it much better.`,
    },
    {
      title: "Choosing a threshold from scores",
      level: "Hard",
      marks: 5,
      question: `Fraud scores for 8 transactions: (0.92, F), (0.81, F), (0.74, L), (0.66, F), (0.55, L), (0.41, L), (0.30, F), (0.12, L), where F = fraud (positive) and L = legit.
For thresholds $t = 0.7$ and $t = 0.35$ (predict fraud if score $\\ge t$), compute precision and recall. Which threshold should Analyst A (can't miss fraud) choose, and which should Analyst B (minimise false alarms)?`,
      solution: `
There are 4 frauds and 4 legit transactions.

**t = 0.7:** flagged 0.92(F), 0.81(F), 0.74(L), so TP = 2, FP = 1, FN = 2
- Precision $= 2/3 = $ **0.667**
- Recall $= 2/4 = $ **0.50**

**t = 0.35:** flagged 0.92, 0.81, 0.74, 0.66, 0.55, 0.41, so TP = 3 (F at 0.92, 0.81, 0.66), FP = 3, FN = 1 (0.30)
- Precision $= 3/6 = $ **0.50**
- Recall $= 3/4 = $ **0.75**

**Analyst A → t = 0.35** (higher recall, misses fewer frauds). **Analyst B → t = 0.7** (higher precision, fewer false alarms). Lowering the threshold raises recall and lowers precision: this is the trade-off an ROC or precision-recall curve shows.`,
    },
    {
      title: "Sizing the MNIST data matrix and split",
      level: "Easy",
      marks: 2,
      question:
        "MNIST has 70,000 images of 28×28 pixels. (a) What are the dimensions of the data matrix, and how many values does it hold? (b) How much memory does it need as uint8 and as float64? (c) Give the train/test sizes used in the slides, and say why the training set is shuffled.",
      solution: `
**(a)** $28 \\times 28 = 784$ features, so the matrix is **70000 × 784**, holding $70000 \\times 784 = $ **54,880,000** values.

**(b)** uint8: 54.88 MB ≈ **52.3 MiB**. float64 (8 bytes each): ≈ **439 MB** (418.7 MiB).

**(c)** **60,000 train / 10,000 test**. Shuffling makes the CV folds similar (no fold is missing some digits) and prevents algorithms that are sensitive to instance order (e.g. SGD) from performing poorly.`,
    },
  ],

  theory: [
    {
      title: "Why accuracy misleads, and what to use instead",
      marks: 3,
      question: "Explain with an example why accuracy is a poor metric for imbalanced datasets. Which metrics should be used instead?",
      solution: `
- With 9,990 negatives and 10 positives, a classifier that predicts “negative” for everything scores **99.9% accuracy** yet **detects no positives**. Accuracy is dominated by the majority class.
- **Use instead:**
  - **Recall** $TP/(TP+FN)$: how many positives we catch.
  - **Precision** $TP/(TP+FP)$: how trustworthy the positive alerts are.
  - **F1** balances the two.
  - **ROC-AUC**: threshold-independent ranking quality.
  - Also cost-sensitive evaluation, where each error type gets a cost.`,
    },
    {
      title: "ROC curve and AUC",
      marks: 4,
      question: "What is an ROC curve? How is it constructed? Interpret the points (0,0), (1,1), (0,1), the diagonal, and the AUC. How do you compare two models whose ROC curves cross?",
      solution: `
- **ROC** (Receiver Operating Characteristic) plots **TPR** (y-axis) against **FPR** (x-axis) as the decision threshold changes. It shows the trade-off between hits and false alarms.
- **Construction:** get $P(+|x)$ for every test instance, sort in decreasing order, use each unique value as a threshold, count TP/FP/TN/FN, and plot (FPR, TPR).
- **(0,0):** everything predicted negative. **(1,1):** everything predicted positive. **(0,1):** the perfect classifier. **Diagonal:** random guessing. **Below the diagonal:** worse than random (inverting the predictions would help).
- **AUC:** 1 = ideal, 0.5 = random. It equals the probability that a random positive is scored higher than a random negative.
- **Crossing curves:** neither model dominates (e.g. M1 is better at low FPR, M2 at high FPR). Choose based on the **operating FPR** the application can tolerate. Use AUC only as an overall summary.`,
    },
    {
      title: "Methods for estimating performance",
      marks: 4,
      question: "Explain holdout, random subsampling, k-fold cross-validation, leave-one-out and bootstrap. Which would you use for a small dataset?",
      solution: `
- **Holdout:** reserve a part (e.g. 1/3) for testing and train on the rest. Simple, but the estimate depends on one split and training uses less data.
- **Random subsampling:** repeat the holdout several times and average. Reduces variance, but some records may never be tested.
- **k-fold CV:** k disjoint folds; each fold is the test set once and the rest are training. Every record is tested exactly once; average the k scores.
- **Leave-one-out:** k = n. Nearly unbiased and uses maximum training data, but costs n training runs and has high variance.
- **Bootstrap:** sample n records **with replacement** for training (≈63.2% unique) and test on the unused ≈36.8%. Good for very small datasets.
- **Stratified** versions keep the class proportions in each split.
- **Small dataset:** stratified k-fold (k = 10), LOOCV, or bootstrap, since you can't afford to waste data on a single holdout.`,
    },
    {
      title: "Grid search vs random search",
      marks: 3,
      question: "Compare tuning by hand, grid search and random search. How can grid search be made faster?",
      solution: `
- **By hand:** the most common approach and gives decent results, but takes a lot of effort and has no guarantees.
- **Grid search:** try every combination on a grid. It is systematic, but the cost grows **exponentially** with the number of hyperparameters, and choosing the grid is itself difficult.
- **Random search:** sample random combinations. The cost doesn't explode with dimensions, and it explores more distinct values of each important hyperparameter. It is not guaranteed to get near the optimum with a finite number of samples.
- **Speed-ups:** (1) **early stopping / successive halving**: train all settings for 1 epoch, keep the better half, repeat; (2) **parallelism**: settings are independent (embarrassingly parallel), which saves time but not energy.`,
    },
    {
      title: "MLOps: DevOps vs MLOps, CI/CD/CT",
      marks: 5,
      question: "What is MLOps? How do ML systems differ from traditional software? Explain CI, CD and CT in the ML context.",
      solution: `
**MLOps** applies DevOps principles to ML: it unifies ML development and operation, with automation and monitoring across integration, testing, release, deployment and infrastructure. The real challenge is not training a model but **operating an integrated ML system continuously in production**. ML code is only a small part of that system.

**How ML differs:**
- **Team:** data scientists, who focus on experiments rather than production engineering.
- **Development:** experimental, so tracking and reproducibility are hard.
- **Testing:** also needs data validation and model-quality tests.
- **Deployment:** a multi-step pipeline that retrains and deploys models.
- **Production:** models decay as the data distribution drifts, so monitoring is needed.

**CI/CD/CT in ML:**
- **CI:** besides testing code, test and validate **data, data schemas and models**: unit tests for feature logic, convergence tests, NaN checks.
- **CD:** deliver a **training pipeline** that automatically deploys *another* service, the model prediction service. Check infrastructure compatibility, API behaviour and latency/throughput.
- **CT (new in ML):** automatically **retrain** the model in production on new data (on a schedule or trigger) and serve it.`,
    },
    {
      title: "Data validation and model validation in a pipeline",
      marks: 4,
      question: "Explain data value skew, data schema skew and the steps of offline and online model validation.",
      solution: `
**Data validation** runs *before* training and decides whether to retrain or stop:
- **Data value skew:** significant change in the statistical properties of the incoming data. **Trigger retraining.**
- **Data schema skew:** the data doesn't match the expected schema (unexpected features or values, missing features). **Stop the pipeline** and fix it or update the pipeline.

**Model validation** runs *after* retraining and before promoting to production:
1. Compute evaluation metrics on test data.
2. Compare with the current production model, a baseline, or business thresholds.
3. Check the performance is consistent across data **segments**.
4. Test deployability: infrastructure compatibility and API consistency.
5. **Online validation:** canary deployment or A/B testing on live traffic.`,
    },
    {
      title: "Overfitting diagnosis in the housing example",
      marks: 3,
      question: "On the housing data, a decision tree regressor has near-zero training RMSE but high cross-validation RMSE. What does this indicate, and what options do you have?",
      solution: `
- **Diagnosis:** **overfitting**. The tree memorised the training data (low bias, high variance) and doesn't generalise, which is clear from the large gap between training and CV error.
- **Options:**
  1. Use an **ensemble**, e.g. a **Random Forest** (averages many de-correlated trees), which gave better CV accuracy in the slides.
  2. Regularise or constrain the model (max depth, min samples per leaf).
  3. Get more training data or better features.
  4. Tune hyperparameters with grid/random search plus CV.
- Never judge by training error. Always use CV/validation error.`,
    },
  ],

  quiz: [
    { q: "Recall is:", options: ["TP/(TP+FP)", "TP/(TP+FN)", "TN/(TN+FP)", "(TP+TN)/N"], answer: 1, why: "Recall = fraction of actual positives that are caught." },
    { q: "How many classifiers does One-vs-One need for 10 classes?", options: ["10", "20", "45", "90"], answer: 2, why: "K(K−1)/2 = 10·9/2 = 45." },
    { q: "On an ROC plot, the ideal classifier sits at:", options: ["(0,0)", "(1,1)", "(0,1)", "(1,0)"], answer: 2, why: "FPR = 0 and TPR = 1." },
    { q: "An AUC of 0.5 means:", options: ["Perfect classifier", "Random guessing", "Always wrong", "50% accuracy"], answer: 1, why: "The diagonal ROC line corresponds to random guessing." },
    { q: "In bootstrap sampling, roughly what fraction of records appear in the training sample?", options: ["50%", "63.2%", "80%", "100%"], answer: 1, why: "1 − (1−1/n)ⁿ → 1 − e⁻¹ ≈ 0.632." },
    { q: "Which is unique to MLOps compared with DevOps?", options: ["Continuous integration", "Continuous delivery", "Continuous training", "Unit testing"], answer: 2, why: "CT automatically retrains models in production." },
    { q: "The incoming data suddenly lacks an expected feature column. This is:", options: ["Data value skew", "Data schema skew", "Concept drift", "Overfitting"], answer: 1, why: "A schema mismatch: stop the pipeline and fix it." },
    { q: "Main drawback of grid search:", options: ["Not reproducible", "Cost grows exponentially with the number of hyperparameters", "Can't be parallelised", "Needs labelled data"], answer: 1, why: "Every added hyperparameter multiplies the number of grid points." },
    { q: "For a cancer screening test, the most important metric is usually:", options: ["Precision", "Recall", "Accuracy", "Specificity"], answer: 1, why: "Missing a cancer (FN) is the costliest error." },
    { q: "Which classifier handles multiple classes natively?", options: ["SVM", "Linear classifier", "Random Forest", "Perceptron"], answer: 2, why: "Random forests and Naive Bayes are natively multiclass; SVMs are binary." },
  ],
};
