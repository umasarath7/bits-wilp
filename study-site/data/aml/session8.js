// AML — Contact Session 8: Mid-sem revision
// Source: CourseFiles/AML/ContactSession8-Revision.pptx (29 slides; questions mostly as images)
// Teaching style: each revision question is explained as "what it tests → how to approach it".

export default {
  title: "Mid-sem Revision + Formula Sheet",
  source: "ContactSession8-Revision.pptx · 29 slides",
  overview:
    "The revision session doesn't teach anything new. It walks through **one exam-style question per topic**, which tells you exactly what your teacher considers examinable: Naïve Bayes, least-squares regression, bias–variance, Bayes' theorem, data preprocessing, linear and non-linear SVMs, and gradient descent. In these notes, each lesson takes one of those question types and explains **what it's really testing** and **how to approach it**. Then comes a formula sheet in which every formula says *when* to use it. All the revision questions are solved step by step in the Numerical and Theory tabs. For the night before the exam, use the **Exam Summary** page (📋 in the sidebar).",

  summary: [
    {
      id: "map",
      heading: "Lesson 1: What does the revision deck tell us about the exam?",
      slides: "1–29",
      blocks: [
        {
          type: "p",
          text: "Teachers usually build revision sessions from the questions they intend to ask. So the first thing to do is list the questions and map each to the session that teaches it:",
        },
        {
          type: "table",
          head: ["Revision question", "What it tests", "Session", "Where it's solved here"],
          rows: [
            ["Q1: classify (Short, Dark, Brown)", "Naïve Bayes with categorical attributes, and spotting a zero probability", "S6", "Numerical Q1"],
            ["Q2: area vs price", "Least-squares line and prediction", "S4", "Numerical Q2"],
            ["Q3: three decision boundaries", "Bias–variance / robustness vs fit", "S4", "Theory Q1"],
            ["Q4: Vijay's job offers", "Bayes' theorem and complements", "S6", "Numerical Q3"],
            ["Q5: travel-insurance table", "Data-quality issues and fixes", "S2", "Theory Q3"],
            ["Q6a: 8 points, find the hyperplane", "Linear SVM by hand", "S7", "Numerical Q4"],
            ["Q6b: points on a line", "Non-linear SVM / kernel trick", "S7", "Numerical Q5"],
            ["Slides 16–29: RR-CHD", "One iteration of batch GD, then SGD", "S4", "Numerical Q6; Session 4 Q5 for SGD"],
          ],
        },
        {
          type: "p",
          text: "Compare this with the previous mid-sem (Lesson 5): the same topics appear, almost in the same form. Naïve Bayes, regression and SVM together carried more than half the marks. That's where your practice time should go.",
        },
      ],
    },
    {
      id: "approach",
      heading: "Lesson 2: How to approach each type of question",
      slides: "2–15",
      blocks: [
        {
          type: "p",
          text: "Each question type has a fixed shape. If you recognise the shape, you know the steps before you read the numbers.",
        },
        {
          type: "p",
          text: "**Naïve Bayes (Q1).** *What it tests:* can you turn a table into probabilities and combine them? *Approach:* priors → a small likelihood table for the query's values only → multiply per class → normalise → state the class. **Watch for zeros:** in Q1, class C2 never has dark hair or brown eyes, so its score is 0. Say so, and mention Laplace smoothing.",
        },
        {
          type: "p",
          text: "**Least squares (Q2).** *What it tests:* the OLS formulas and careful arithmetic. *Approach:* means → a table with $x - \\bar x$, $y - \\bar y$, product and square → slope = Σproduct/Σsquare → intercept = $\\bar y - $ slope × $\\bar x$ → substitute. Keep 2–3 decimals in the deviations; the numbers are deliberately awkward.",
        },
        {
          type: "p",
          text: "**Bias–variance from pictures (Q3).** *What it tests:* can you connect model shape to bias and variance? A **straight** boundary is robust but fits poorly: high bias, low variance. A **wiggly** one fits the training data best but is fragile: low bias, high variance. Always say which is under- and which is overfitting.",
        },
        {
          type: "p",
          text: "**Bayes' theorem word problem (Q4).** *What it tests:* translating English into probability notation. *Approach:* write down every given as P(·): P(G) = 0.6, P(M) = 0.5, P(G | M) = 0.8. “Does not get G, given M” is the complement, $1 - P(G \\mid M)$. “M given G” needs Bayes: $P(M \\mid G) = P(G \\mid M)P(M)/P(G)$.",
        },
        {
          type: "p",
          text: "**Data preprocessing (Q5).** *What it tests:* the Session 2 data-quality checklist. *Approach:* scan the table **column by column** and look for duplicates, missing values (n/a, blanks), impossible values (age 212, ₹0 insured), redundant columns (age and date of birth), mixed units or currencies, and inconsistent formats (dates). Give a fix for each.",
        },
        {
          type: "p",
          text: "**Linear SVM (Q6a).** *What it tests:* the max-margin idea. *Approach:* plot → pick the support vectors (closest opposite-class points) → line through one class's SVs → parallel line through the other's → boundary midway → check all points. The slides stress: **choose the right support vectors**; the wrong ones give a narrower margin.",
        },
        {
          type: "p",
          text: "**Non-linear SVM (Q6b).** *What it tests:* the idea that a mapping makes data separable. *Approach:* notice the − + − pattern on a line → map with a squared distance from the centre, $Z = (x - 3)^2$ → find the midway line in (x, Z) → map back, giving two cut points.",
        },
        {
          type: "p",
          text: "**Gradient descent (slides 16–29).** *What it tests:* the update rule and simultaneous updates. The slides lay it out as: write the hypothesis → write the update for each weight, $w_j' = w_j - \\frac1m \\alpha \\sum (h - y) x_j$ → build the table → substitute. The answer after one batch iteration is $w_0 = 5.0016$, $w_1 = 0.0477$, $w_2 = 0.1793$.",
        },
      ],
    },
    {
      id: "gdvar",
      heading: "Lesson 3: Batch vs stochastic gradient descent on the same data",
      slides: "21–29",
      blocks: [
        {
          type: "p",
          text: "Slides 21–29 repeat the RR-CHD question with different gradient-descent variants. The definitions (slide 21):",
        },
        {
          type: "table",
          head: ["Variant", "When the update happens", "Good and bad"],
          rows: [
            ["**Batch**", "After computing the derivative from **all** the training data", "Smooth and stable, but slow per update on big data"],
            ["**Mini-batch**", "After each small **group** of samples", "The practical default: stable enough and fast"],
            ["**Stochastic (SGD)**", "After **each** training instance, immediately", "Fast progress, but noisy; very sensitive to the learning rate and feature scale"],
          ],
        },
        {
          type: "p",
          text: "**The key difference in the table.** In batch GD, all three patients use the **same** starting weights, and you average their gradients. In SGD, patient 2 uses the weights **already updated** by patient 1, and patient 3 uses those updated by patient 2.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Why SGD blows up on this data",
          text: "With α = 0.02, batch GD moves the weights sensibly after one iteration. SGD with the same α on these **unscaled** features (BMI ≈ 30, blood pressure ≈ 100) **diverges within three updates**: the weights jump into the thousands. Each single-sample step changes the weights by about α × error × feature, and with features around 100 that overshoots badly. Batch GD survived only because the errors of opposite sign partly cancelled when averaged. The fix is to **scale the features** or use a much smaller α. Session 4, Numerical Q5 works through all three SGD updates.",
        },
      ],
    },
    {
      id: "sheet-eval",
      heading: "Lesson 4: Formula sheet, part 1: evaluation and data",
      slides: "S1–S3",
      blocks: [
        {
          type: "table",
          head: ["Formula", "Use it when…"],
          rows: [
            ["Accuracy $= \\frac{TP+TN}{TP+TN+FP+FN}$", "Classes are balanced and both errors cost the same"],
            ["Precision $= \\frac{TP}{TP+FP}$", "False alarms are costly (spam filter, expensive investigations)"],
            ["Recall $= \\frac{TP}{TP+FN}$", "Missing a positive is costly (fraud, disease, churn)"],
            ["$F_1 = \\frac{2PR}{P+R} = \\frac{2TP}{2TP+FP+FN}$", "You need one number balancing precision and recall"],
            ["FPR $= \\frac{FP}{FP+TN}$; Specificity $= \\frac{TN}{TN+FP}$", "ROC curves (x-axis = FPR); how well negatives are recognised"],
            ["Minkowski $(\\sum|x_k-y_k|^r)^{1/r}$: r = 1 Manhattan, r = 2 Euclidean, r = ∞ max", "Distances between numeric records (standardise first if scales differ)"],
            ["Cosine $\\frac{x\\cdot y}{\\|x\\|\\|y\\|}$", "Documents and sparse data; length shouldn't matter"],
            ["Correlation $\\frac{\\sum(x-\\bar x)(y-\\bar y)}{\\sqrt{\\sum(x-\\bar x)^2\\sum(y-\\bar y)^2}}$", "Strength of a straight-line relationship (blind to curves)"],
            ["z-score $\\frac{x-\\bar x}{s}$; min-max $\\frac{x-\\min}{\\max-\\min}$", "Putting attributes on comparable scales"],
            ["MAE $\\frac1m\\sum|e|$; MSE $\\frac1m\\sum e^2$; RMSE $\\sqrt{MSE}$; $R^2 = 1-\\frac{SSE}{SST}$", "Regression error; MAE if there are many outliers; R² for “fraction explained”"],
            ["OvA = $K$; OvO = $K(K-1)/2$", "Counting classifiers for K classes (10 classes → 45 OvO)"],
            ["k-fold: k models, each trained on $(k-1)/k$ of the data", "Cross-validation arithmetic"],
            ["Bootstrap unique fraction $1-(1-1/n)^n \\to 0.632$", "Bootstrap sample questions"],
          ],
        },
      ],
    },
    {
      id: "sheet-models",
      heading: "Lesson 5: Formula sheet, part 2: models",
      slides: "S4–S7",
      blocks: [
        {
          type: "table",
          head: ["Formula", "Use it when…"],
          rows: [
            ["OLS: $m = \\frac{\\sum(x-\\bar x)(y-\\bar y)}{\\sum(x-\\bar x)^2}$, $b = \\bar y - m\\bar x$", "Fitting a least-squares line by hand"],
            ["Normal equation $\\theta = (X^TX)^{-1}X^Ty$", "Closed-form multivariate regression"],
            ["Cost $J = \\frac1{2m}\\sum(h_\\theta(x)-y)^2 \\;[+\\frac{\\lambda}{2m}\\sum_{j\\ge1}\\theta_j^2]$", "Evaluating linear regression (with optional regularisation)"],
            ["GD update $\\theta_j := \\theta_j - \\alpha\\frac1m\\sum_i(h_\\theta(x^{(i)})-y^{(i)})x_j^{(i)}$", "One iteration of GD, linear **or** logistic (only h differs)"],
            ["Sigmoid $\\sigma(z) = \\frac1{1+e^{-z}}$: σ(0) = 0.5, σ(1) = 0.731, σ(2) = 0.881, σ(3) = 0.953", "Logistic regression predictions"],
            ["Log-loss $-\\frac1m\\sum[y\\log h+(1-y)\\log(1-h)]$", "Logistic regression cost"],
            ["Bayes $P(y \\mid x) = \\frac{P(x \\mid y)P(y)}{P(x)}$", "Reversing a conditional probability"],
            ["Naïve Bayes $\\hat y = \\arg\\max_y P(y)\\prod_iP(x_i \\mid y)$", "Classifying from a categorical table"],
            ["Laplace $\\frac{n_c+1}{n+v}$", "A zero count appears"],
            ["Gaussian $\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/2\\sigma^2}$", "NB with a continuous attribute"],
            ["SVM: $y_i(w^Tx_i+b)\\ge1$, margin $= 2/\\|w\\|$, $w = \\sum\\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$", "Linear SVM hyperplane and margin"],
            ["Soft margin $\\min \\frac12\\|w\\|^2 + C\\sum\\xi_i$, $\\xi_i = \\max(0, 1-y_if(x_i))$", "Noisy data; reading slack values"],
            ["Kernels: linear $x^Tz$; polynomial $(1+x^Tz)^p$; RBF $e^{-\\|x-z\\|^2/2\\sigma^2}$", "Non-linear SVMs"],
            ["Degree-2 feature map $\\phi(x) = (1, \\sqrt2x_1, \\sqrt2x_2, x_1^2, x_2^2, \\sqrt2x_1x_2)$", "Verifying a polynomial kernel value"],
          ],
        },
      ],
    },
    {
      id: "pyqmap",
      heading: "Lesson 6: What the previous mid-sem actually asked",
      slides: "",
      blocks: [
        {
          type: "table",
          caption: "Previous mid-sem (30 marks) mapped to sessions",
          head: ["PYQ", "Topic", "Session", "Marks"],
          rows: [
            ["Q1a", "Euclidean + Manhattan distance", "S2", "2"],
            ["Q1b", "Confusion matrix → accuracy, precision, recall, F1", "S3", "2"],
            ["Q1c", "Which analyst (recall vs precision) is satisfied", "S3", "2"],
            ["Q1d", "Polynomial kernel φ and K", "S7", "2"],
            ["Q2a", "Three challenges of ML", "S1", "2"],
            ["Q2b", "Bias–variance trade-off", "S4", "2"],
            ["Q2c", "Frame the churn problem (type, model, metric)", "S1/S3/S5", "2"],
            ["Q3", "Naïve Bayes loan approval", "S6", "5"],
            ["Q4", "Least-squares line, predict, MSE", "S4", "5"],
            ["Q5", "XOR: feature map, SVs, hyperplane, boundary", "S7", "6"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "What this means for your preparation",
          text: "About **80%** of the marks (24/30) were numerical, and **NB + regression + SVM = 16/30**. Every session contributed something, but the theory questions were short (2 marks each) and rewarded a crisp definition plus an example. Practise the three big numerical recipes until they're automatic, then learn the 2-mark theory answers on the Exam Summary page.",
        },
      ],
    },
  ],

  examTips: [
    "Spend the first 2 minutes planning: attempt the high-mark numerical questions (NB, regression, SVM) first.",
    "Show tables for every computation. Method marks are awarded even if the arithmetic slips.",
    "State the final answer clearly (e.g. “**Predicted class: Yes**”) and add a one-line interpretation.",
    "For 2-mark theory: definition + key point + example. Don't write essays.",
  ],

  problems: [
    {
      title: "Naïve Bayes: (Short, Dark, Brown)",
      pyq: "Revision Q1",
      level: "Easy",
      marks: 4,
      hint: "C1 has 5 rows, C2 has 3. For each of short, dark and brown, count within each class. Check C2 carefully for dark hair and brown eyes.",
      question: `Classify X = (Short, Dark, Brown).

| Height | Hair | Eyes | Class |
|---|---|---|---|
| tall | blond | brown | C1 |
| tall | dark | blue | C1 |
| tall | dark | brown | C1 |
| short | dark | blue | C1 |
| short | blond | brown | C1 |
| tall | red | blue | C2 |
| tall | blond | blue | C2 |
| short | blond | blue | C2 |`,
      solution: `
### What is being asked
Classify one record with Naïve Bayes (Session 6).

### Formula
$$\\text{score}(C) = P(C)\\,P(\\text{short} \\mid C)\\,P(\\text{dark} \\mid C)\\,P(\\text{brown} \\mid C)$$

### Working
- Priors: $P(C1) = 5/8 = 0.625$, $P(C2) = 3/8 = 0.375$
- C1: $P(\\text{short} \\mid C1) = 2/5$, $P(\\text{dark} \\mid C1) = 3/5$, $P(\\text{brown} \\mid C1) = 3/5$ → score $= 0.4 \\times 0.6 \\times 0.6 \\times 0.625 = 0.09$
- C2: $P(\\text{short} \\mid C2) = 1/3$, $P(\\text{dark} \\mid C2) = 0/3$, $P(\\text{brown} \\mid C2) = 0/3$ → score $= 0$

### Answer
**X → C1.**

### Takeaway
C2 scored 0 only because dark hair and brown eyes never appear in its 3 rows: the zero-probability problem. With Laplace smoothing, $P(C1 \\mid X) \\approx 0.94$ (Session 6, Numerical Q2).`,
    },
    {
      title: "Least squares: area vs price",
      pyq: "Revision Q2",
      level: "Medium",
      marks: 4,
      hint: "Means first: x̄ = 457/6, ȳ = 467/6. Then the deviation table. Slope = Σproduct ÷ Σsquare.",
      question: `| Area | 72 | 50 | 81 | 74 | 94 | 86 |
|---|---|---|---|---|---|---|
| Price | 84 | 63 | 77 | 78 | 90 | 75 |

(a) Least-squares equation for Price vs Area. (b) Predict the price for 80 m².`,
      solution: `
### What is being asked
A least-squares line and one prediction (Session 4).

### Formula
$$w_1 = \\frac{\\sum (x - \\bar x)(y - \\bar y)}{\\sum (x - \\bar x)^2}, \\qquad w_0 = \\bar y - w_1 \\bar x$$

### Working
- $\\bar x = 76.167$, $\\bar y = 77.833$
- $\\sum(x - \\bar x)(y - \\bar y) = 547.17$; $\\sum(x - \\bar x)^2 = 1144.83$ (full table in Session 4, Numerical Q2)
- $w_1 = 547.17/1144.83 = 0.4779$; $w_0 = 77.833 - 0.4779 \\times 76.167 = 41.43$

### Answer
**(a)** Price $= 41.43 + 0.478 \\times$ Area **(b)** Price(80) $= 41.43 + 38.24 = $ **₹79.67 lakh**

### Takeaway
Interpretation: each extra square metre adds about ₹0.48 lakh on average.`,
    },
    {
      title: "Bayes' theorem: job offers",
      pyq: "Revision Q4",
      level: "Easy",
      marks: 3,
      hint: "Write P(G), P(M) and P(G | M) first. (a) is a complement; (b) needs Bayes' theorem.",
      question: "P(Google offer) = 0.6, P(Microsoft offer) = 0.5, P(G | M) = 0.8. (a) P(not G | M)? (b) P(M | G)?",
      solution: `
### What is being asked
Translate the story into probabilities and reverse a conditional (Session 6, Lesson 2).

### Formula
$$P(\\neg G \\mid M) = 1 - P(G \\mid M), \\qquad P(M \\mid G) = \\frac{P(G \\mid M)P(M)}{P(G)}$$

### Working
**(a)** $1 - 0.8 = 0.2$

**(b)** $\\frac{0.8 \\times 0.5}{0.6} = \\frac{0.4}{0.6} = 0.667$

### Answer
(a) **0.2** (b) **0.667**

### Takeaway
The complement works *within* the same condition: given M, either G happens or it doesn't.`,
    },
    {
      title: "Linear SVM hyperplane",
      pyq: "Revision Q6(a)",
      level: "Hard",
      marks: 5,
      hint: "Support vectors: (2, 3) and (3, −1) for +, (1, 0) for −. Line through the two + SVs, parallel line through (1, 0), then go midway.",
      question: "Positive: (3,2), (4,3), (2,3), (3,−1). Negative: (1,0), (1,−1), (0,2), (−1,2). Find the SVM hyperplane.",
      solution: `
### What is being asked
The maximum-margin line by the graphical method (Session 7, Lesson 6).

### Working
- **Support vectors:** (2, 3) and (3, −1) on the + side; (1, 0) on the − side
- Line through the + SVs: slope $= (-1 - 3)/(3 - 2) = -4$ → $y = -4x + 11$
- Parallel line through (1, 0): $y = -4x + 4$
- **Boundary** (midway): $y = -4x + 7.5$, i.e. $4x + y - 7.5 = 0$
- Check with $g = 4x + y$: positives 14, 19, 11, 11 (all ≥ 11); negatives 4, 3, 2, −2 (all ≤ 4) ✓
- Canonical form: divide by 3.5 → $w = (8/7, 2/7)$, $b = -15/7$; margin $= 2/\\|w\\| = 1.698$

### Answer
**$4x + y - 7.5 = 0$**, with margin 1.698.

### Takeaway
Choosing the wrong support vectors gives lines with a smaller margin. Always check that no point falls inside the road.`,
    },
    {
      title: "Non-linear SVM with the kernel trick",
      pyq: "Revision Q6(b)",
      level: "Medium",
      marks: 4,
      hint: "The pattern is − − + + + − −. Map with Z = (x − 3)², which is small in the middle and large on the outside.",
      question: "Positive: (2,0), (3,0), (4,0). Negative: (0,0), (1,0), (5,0), (6,0). Use the kernel trick to find the non-linear SVM boundary.",
      solution: `
### What is being asked
Separate data that no single cut can separate, by lifting it into 2-D (Session 7, Lesson 5).

### Working
- Map $Z = (x - 3)^2$. Positives: Z = 1, 0, 1. Negatives: Z = 9, 4, 4, 9.
- **Support vectors in (X, Z):** (2, 1), (4, 1) and (1, 4), (5, 4)
- **Boundary** midway: $Z = (1 + 4)/2 = 2.5$
- Map back: $(x - 3)^2 = 2.5 \\iff x^2 - 6x + 6.5 = 0 \\iff x = 3 \\pm 1.58$

### Answer
$Z = 2.5$, i.e. **x ≈ 1.42 and x ≈ 4.58**. Predict + between them.

### Takeaway
A straight line in the lifted space becomes two cut points on the original line.`,
    },
    {
      title: "First iteration of batch GD (RR-CHD)",
      pyq: "Revision: gradient descent, α = 0.02",
      level: "Hard",
      marks: 6,
      hint: "Prediction h = 5 − 0.03·BMI − 0.03·Diastolic for each patient. Then errors h − y, then error × BMI and error × Diastolic. Average (÷3), × 0.02, subtract.",
      question: `RR-CHD $= w_0 + w_1\\,\\text{BMI} + w_2\\,\\text{Diastolic}$, starting at $w_0 = 5$, $w_1 = w_2 = -0.03$, α = 0.02. Show the first iteration of batch gradient descent.

| BMI | Diastolic | RR-CHD |
|---|---|---|
| 35 | 80 | 1.81 |
| 25 | 80 | 1.22 |
| 30 | 100 | 1.71 |`,
      solution: `
### What is being asked
One batch GD update with two features (Session 4, Lessons 7–8).

### Formula (slide 16)
$$w_j' = w_j - \\frac13 \\cdot 0.02 \\cdot \\sum (w_0 + w_1x_1 + w_2x_2 - y)\\,x_j \\quad (x_0 = 1)$$

### Working
| Patient | h | y | e = h − y | e × BMI | e × Diastolic |
|---|---|---|---|---|---|
| 1 | 1.55 | 1.81 | −0.26 | −9.1 | −20.8 |
| 2 | 1.85 | 1.22 | 0.63 | 15.75 | 50.4 |
| 3 | 1.10 | 1.71 | −0.61 | −18.3 | −61.0 |
| **Σ** | | | **−0.24** | **−11.65** | **−31.4** |

Gradients (÷3): $g_0 = -0.08$, $g_1 = -3.8833$, $g_2 = -10.4667$

- $w_0 = 5 - 0.02(-0.08) = 5.0016$
- $w_1 = -0.03 - 0.02(-3.8833) = 0.0477$
- $w_2 = -0.03 - 0.02(-10.4667) = 0.1793$

### Answer
$w_0 = $ **5.0016**, $w_1 = $ **0.0477**, $w_2 = $ **0.1793** (matches slide 17).

### Takeaway
Every weight uses the **same old** weights for all three patients. That's what makes it *batch* GD.`,
    },
  ],

  theory: [
    {
      title: "Robustness vs fit",
      pyq: "Revision Q3",
      marks: 3,
      question: "Three classifiers on the same data have a straight-line, a smooth-curve and a highly wiggly decision boundary. Which has high robustness and the poorest fit? Which has poor robustness and the highest fit?",
      solution: `
### What the examiner wants
Each boundary matched to fit/robustness and to bias/variance.

### Model answer
- **Leftmost (straight line):** high robustness, poorest fit: **high bias, low variance** (underfitting).
- **Rightmost (wiggly):** highest fit, poor robustness: **low bias, high variance** (overfitting).
- **Middle (smooth curve):** balances the two and is likely to generalise best.

### Takeaway
Robust = low variance. Good training fit = low bias.`,
    },
    {
      title: "Batch vs mini-batch vs stochastic GD",
      marks: 3,
      question: "Differentiate batch, mini-batch and stochastic gradient descent. Which would you use for a dataset of 10 million rows?",
      solution: `
### What the examiner wants
The slide-21 definitions, a pro and con of each, and a justified choice.

### Model answer
- **Batch GD:** the derivative is computed from **all** training data before each update. Accurate and stable, but slow and memory-heavy for big data.
- **Mini-batch GD:** the derivative is computed from **small groups** (e.g. 64–512) before each update. A good trade-off that makes use of vectorised hardware.
- **Stochastic GD:** the derivative is computed from **each instance**, with the update applied immediately. Fastest progress per sample, but noisy; needs a small or decaying α and scaled features.
- **10 million rows:** **mini-batch** (or SGD). Batch GD would need a full pass over 10 million rows for every single step.

### Takeaway
The only difference between the three is how many examples you look at before each step.`,
    },
    {
      title: "Six data-preprocessing issues",
      pyq: "Revision Q5",
      marks: 6,
      question: "A travel-insurance purchase log has these problems. Name the issue and the fix for each: repeated rows; 'n/a' in Age; a blank Profession; both Age and DOB columns; Sum Insured in ₹ and USD; dates as dd/mm/yyyy and yyyy-mm-dd; Sum Insured = ₹0.",
      solution: `
### What the examiner wants
Each problem named with its data-quality category and a fix (slide 11 gives six).

### Model answer
1. **Duplicate rows** (1st and 3rd identical): remove the duplicates.
2. **Missing Age** ('n/a'): replace with the mean (or derive it from DOB).
3. **Blank Profession:** replace with the **mode**.
4. **Redundant columns** (Age and DOB): keep only one.
5. **Different currencies:** convert to a single currency.
6. **Different date formats:** standardise them.
7. **Invalid ₹0 sum insured:** treat as missing and replace with the mean.

### Takeaway
Numeric gaps → mean/median; categorical gaps → mode; impossible values → treat as missing.`,
    },
  ],

  quiz: [
    { q: "About what share of the previous mid-sem was numerical?", options: ["25%", "50%", "80%", "100%"], answer: 2, why: "Only Q2 (6 of 30 marks) was pure theory." },
    { q: "Which group of topics carried the most marks in the PYQ?", options: ["MLOps + data types", "NB + SVM + regression", "ROC + hyperparameters", "PCA + clustering"], answer: 1, why: "5 + 6 + 5 = 16 of 30 marks." },
    { q: "Updating the weights after every single training sample is:", options: ["Batch GD", "Mini-batch GD", "Stochastic GD", "Normal equation"], answer: 2, why: "SGD updates per instance." },
    { q: "In the revision SVM problem, the decision boundary is:", options: ["y = −4x + 11", "y = −4x + 4", "y = −4x + 7.5", "y = 4x − 7.5"], answer: 2, why: "Midway between the two margin lines." },
    { q: "With Z = (x−3)², the 1-D kernel example's boundary is:", options: ["Z = 1", "Z = 2.5", "Z = 4", "Z = 0"], answer: 1, why: "Midway between Z = 1 (positive SVs) and Z = 4 (negative SVs)." },
    { q: "In the Short/Dark/Brown question, C2's score is 0 because:", options: ["C2 has fewer rows", "Dark hair and brown eyes never occur in C2", "The prior of C2 is 0", "Short never occurs in C2"], answer: 1, why: "Two zero likelihoods make the product zero; Laplace smoothing would fix it." },
  ],
};
