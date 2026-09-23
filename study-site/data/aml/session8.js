// AML — Contact Session 8: Mid-sem revision
// Source: CourseFiles/AML/ContactSession8-Revision.pptx (29 slides; questions mostly as images)

export default {
  title: "Mid-sem Revision + Formula Sheet",
  source: "ContactSession8-Revision.pptx · 29 slides",
  overview:
    "The revision deck works through one exam-style question per topic: Naïve Bayes (height/hair/eyes), least-squares regression (area vs price), bias/variance from decision boundaries, Bayes' theorem (job offers), data-preprocessing issues, linear and non-linear SVM hyperplanes, and one iteration of batch and stochastic gradient descent. Below is a one-page **formula sheet** for Sessions 1–7, followed by those questions with full solutions.",

  summary: [
    {
      id: "sheet-eval",
      heading: "Formula sheet: evaluation & data",
      slides: "S1–S3",
      blocks: [
        {
          type: "table",
          head: ["Topic", "Formula"],
          rows: [
            ["Accuracy", "$\\frac{TP+TN}{TP+TN+FP+FN}$"],
            ["Precision / Recall", "$\\frac{TP}{TP+FP}$ / $\\frac{TP}{TP+FN}$"],
            ["F1", "$\\frac{2PR}{P+R} = \\frac{2TP}{2TP+FP+FN}$"],
            ["FPR / Specificity", "$\\frac{FP}{FP+TN}$ / $\\frac{TN}{TN+FP}$"],
            ["Minkowski", "$(\\sum|x_k-y_k|^r)^{1/r}$: r = 1 Manhattan, r = 2 Euclidean, r = ∞ max"],
            ["Cosine", "$\\frac{x\\cdot y}{\\|x\\|\\|y\\|}$"],
            ["Correlation", "$\\frac{\\sum(x-\\bar x)(y-\\bar y)}{\\sqrt{\\sum(x-\\bar x)^2\\sum(y-\\bar y)^2}}$"],
            ["Standardise / min-max", "$\\frac{x-\\bar x}{s}$ / $\\frac{x-\\min}{\\max-\\min}$"],
            ["MAE / MSE / RMSE / R²", "$\\frac1m\\sum|e|$ / $\\frac1m\\sum e^2$ / $\\sqrt{MSE}$ / $1-\\frac{SSE}{SST}$"],
            ["OvA / OvO classifiers", "$K$ / $K(K-1)/2$"],
            ["k-fold CV", "k models, each trained on $(k-1)/k$ of the data"],
            ["Bootstrap unique fraction", "$1-(1-1/n)^n \\to 0.632$"],
          ],
        },
      ],
    },
    {
      id: "sheet-models",
      heading: "Formula sheet: models",
      slides: "S4–S7",
      blocks: [
        {
          type: "table",
          head: ["Model", "Key formulas"],
          rows: [
            ["**OLS line**", "$m = \\frac{\\sum(x-\\bar x)(y-\\bar y)}{\\sum(x-\\bar x)^2}$, $b = \\bar y - m\\bar x$"],
            ["Normal equation", "$\\theta = (X^TX)^{-1}X^Ty$"],
            ["Linear-regression cost", "$J = \\frac1{2m}\\sum(h_\\theta(x)-y)^2 \\;[+\\frac{\\lambda}{2m}\\sum_{j\\ge1}\\theta_j^2]$"],
            ["**GD update** (linear & logistic)", "$\\theta_j := \\theta_j - \\alpha\\frac1m\\sum_i(h_\\theta(x^{(i)})-y^{(i)})x_j^{(i)}$"],
            ["Sigmoid", "$\\sigma(z) = \\frac1{1+e^{-z}}$; σ(0) = 0.5, σ(1) = 0.731, σ(2) = 0.881, σ(3) = 0.953"],
            ["Log-loss", "$-\\frac1m\\sum[y\\log h+(1-y)\\log(1-h)]$"],
            ["**Bayes**", "$P(y|x) = \\frac{P(x|y)P(y)}{P(x)}$"],
            ["**Naïve Bayes**", "$\\hat y = \\arg\\max_y P(y)\\prod_iP(x_i|y)$"],
            ["Laplace", "$\\frac{n_c+1}{n+v}$"],
            ["Gaussian likelihood", "$\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/2\\sigma^2}$"],
            ["**SVM**", "$y_i(w^Tx_i+b)\\ge1$, margin $= 2/\\|w\\|$, $w = \\sum\\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$"],
            ["Soft margin", "$\\min \\frac12\\|w\\|^2 + C\\sum\\xi_i$, $\\xi_i = \\max(0, 1-y_if(x_i))$"],
            ["Kernels", "Linear $x^Tz$; polynomial $(1+x^Tz)^p$; RBF $e^{-\\|x-z\\|^2/2\\sigma^2}$"],
            ["Poly-2 feature map", "$\\phi(x) = (1, \\sqrt2x_1, \\sqrt2x_2, x_1^2, x_2^2, \\sqrt2x_1x_2)$"],
          ],
        },
      ],
    },
    {
      id: "gdvar",
      heading: "Gradient-descent variants (revision slides 21–29)",
      slides: "21–29",
      blocks: [
        {
          type: "table",
          head: ["Variant", "When the update happens", "Notes"],
          rows: [
            ["**Batch**", "After computing the derivative over **all** training data", "Smooth, but slow per update on big data"],
            ["**Mini-batch**", "After each mini **group** of samples", "The practical default"],
            ["**Stochastic (SGD)**", "After **each** training instance, immediately", "Fast, noisy; sensitive to α and to feature scale"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Watch the scale",
          text: "On the RR-CHD data, batch GD with α = 0.02 moves the weights sensibly after one iteration. Per-sample SGD with the same α on **unscaled** features (BMI ≈ 30, pressure ≈ 100) **diverges** within 3 updates. See Session 4, Numerical Q5.",
        },
      ],
    },
    {
      id: "map",
      heading: "What was examined: topic map",
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
        { type: "p", text: "**Takeaway:** about 80% of the marks (24/30) are numerical. Every session contributes, but **NB + regression + SVM = 16/30**. Theory questions are short (2 marks each) and reward a crisp definition plus an example." },
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
- $P(C1) = 5/8 = 0.625$, $P(C2) = 3/8 = 0.375$
- C1: $P(\\text{short}|C1) = 2/5$, $P(\\text{dark}|C1) = 3/5$, $P(\\text{brown}|C1) = 3/5$, so $P(X|C1) = 0.144$ and $P(X|C1)P(C1) = $ **0.09**
- C2: $P(\\text{short}|C2) = 1/3$, $P(\\text{dark}|C2) = 0$, $P(\\text{brown}|C2) = 0$, so the score is **0**

**X → C1.** (With Laplace smoothing, $P(C1|X) \\approx 0.94$; see Session 6 Q2.)`,
    },
    {
      title: "Least squares: area vs price",
      pyq: "Revision Q2",
      level: "Medium",
      marks: 4,
      question: `| Area | 72 | 50 | 81 | 74 | 94 | 86 |
|---|---|---|---|---|---|---|
| Price | 84 | 63 | 77 | 78 | 90 | 75 |

(a) Least-squares equation for Price vs Area. (b) Predict the price for 80 m².`,
      solution: `
- $\\bar x = 76.167$, $\\bar y = 77.833$
- $\\sum(x-\\bar x)(y-\\bar y) = 547.17$, $\\sum(x-\\bar x)^2 = 1144.83$
- $w_1 = 0.4779$, $w_0 = 41.43$

**(a)** Price $= 41.43 + 0.478\\cdot$Area

**(b)** Price(80) $= $ **79.67 lakh**

(The full table is in Session 4, Numerical Q2.)`,
    },
    {
      title: "Bayes' theorem: job offers",
      pyq: "Revision Q4",
      level: "Easy",
      marks: 3,
      question: "P(Google offer) = 0.6, P(Microsoft offer) = 0.5, P(G | M) = 0.8. (a) P(not G | M)? (b) P(M | G)?",
      solution: `
**(a)** $1 - 0.8 = $ **0.2**

**(b)** $P(M|G) = \\frac{0.8 \\times 0.5}{0.6} = $ **0.667**`,
    },
    {
      title: "Linear SVM hyperplane",
      pyq: "Revision Q6(a)",
      level: "Hard",
      marks: 5,
      question: "Positive: (3,2), (4,3), (2,3), (3,−1). Negative: (1,0), (1,−1), (0,2), (−1,2). Find the SVM hyperplane.",
      solution: `
- **SVs:** (2,3) and (3,−1) (+), and (1,0) (−)
- Line through the + SVs: $y = -4x + 11$
- Parallel line through (1,0): $y = -4x + 4$
- **Boundary** (midway): $y = -4x + 7.5$, i.e. **$4x + y - 7.5 = 0$**
- Canonical: $w = (8/7, 2/7)$, $b = -15/7$, margin = 1.698

*Important:* choose the right SVs. Lines that don't pass through the true SVs give a smaller margin.`,
    },
    {
      title: "Non-linear SVM with the kernel trick",
      pyq: "Revision Q6(b)",
      level: "Medium",
      marks: 4,
      question: "Positive: (2,0), (3,0), (4,0). Negative: (0,0), (1,0), (5,0), (6,0). Use the kernel trick to find the non-linear SVM boundary.",
      solution: `
- Map $Z = (x-3)^2$. Positives get Z = 1, 0, 1; negatives get Z = 9, 4, 4, 9.
- **SVs in (X, Z):** (2,1), (4,1), (1,4), (5,4)
- **Boundary:** $Z = 2.5 \\iff (x-3)^2 = 2.5 \\iff x^2 - 6x + 6.5 = 0$, i.e. $x \\approx 1.42$ and $4.58$`,
    },
    {
      title: "First iteration of batch GD (RR-CHD)",
      pyq: "Revision: gradient descent, α = 0.02",
      level: "Hard",
      marks: 6,
      question: `RR-CHD $= w_0 + w_1\\,\\text{BMI} + w_2\\,\\text{Diastolic}$, starting at $w_0 = 5$, $w_1 = w_2 = -0.03$, α = 0.02.

| BMI | Diastolic | RR-CHD |
|---|---|---|
| 35 | 80 | 1.81 |
| 25 | 80 | 1.22 |
| 30 | 100 | 1.71 |`,
      solution: `
- Errors $h - y$: **−0.26, 0.63, −0.61**
- Gradients:
  - $g_0 = \\frac13(-0.24) = -0.08$
  - $g_1 = \\frac13(-9.1+15.75-18.3) = -3.8833$
  - $g_2 = \\frac13(-20.8+50.4-61) = -10.4667$
- **Updates:**
  - $w_0 = 5.0016$
  - $w_1 = -0.03 + 0.0777 = 0.0477$
  - $w_2 = -0.03 + 0.2093 = 0.1793$`,
    },
  ],

  theory: [
    {
      title: "Robustness vs fit",
      pyq: "Revision Q3",
      marks: 3,
      question: "Three classifiers on the same data have a straight-line, a smooth-curve and a highly wiggly decision boundary. Which has high robustness and the poorest fit? Which has poor robustness and the highest fit?",
      solution: `
- **Leftmost (straight line):** high robustness, poorest fit, so **high bias, low variance**.
- **Rightmost (wiggly):** highest fit, poor robustness, so **low bias, high variance**.
- The middle one balances the two and is likely to generalise best.`,
    },
    {
      title: "Batch vs mini-batch vs stochastic GD",
      marks: 3,
      question: "Differentiate batch, mini-batch and stochastic gradient descent. Which would you use for a dataset of 10 million rows?",
      solution: `
- **Batch GD:** the derivative is computed from **all** training data before each update. Accurate, stable, but slow and memory-heavy for big data.
- **Mini-batch GD:** the derivative is computed from **small groups** (e.g. 64–512) before each update. A good trade-off, and it makes use of vectorised hardware.
- **Stochastic GD:** the derivative is computed from **each instance**, and the update happens immediately. Fastest progress per sample, but noisy; it needs a decaying α and scaled features.
- **10 million rows:** **mini-batch** (or SGD). Batch GD would need a full pass over 10M rows for every single step.`,
    },
    {
      title: "Six data-preprocessing issues",
      pyq: "Revision Q5",
      marks: 6,
      question: "A travel-insurance purchase log has these problems. Name the issue and the fix for each: repeated rows; 'n/a' in Age; a blank Profession; both Age and DOB columns; Sum Insured in ₹ and USD; dates as dd/mm/yyyy and yyyy-mm-dd; Sum Insured = ₹0.",
      solution: `
1. **Duplicate rows** (1st and 3rd identical): remove the duplicates.
2. **Missing Age** ('n/a'): replace with the mean (or derive it from DOB).
3. **Blank Profession:** replace with the **mode**.
4. **Redundant columns** (Age and DOB): keep only one.
5. **Different currencies:** convert to a single currency.
6. **Different date formats:** standardise them.
7. **Invalid ₹0 sum insured:** treat as missing and replace with the mean.`,
    },
  ],

  quiz: [
    { q: "About what share of the previous mid-sem was numerical?", options: ["25%", "50%", "80%", "100%"], answer: 2, why: "Only Q2 (6 of 30 marks) was pure theory." },
    { q: "Which pair of topics carried the most marks in the PYQ?", options: ["MLOps + data types", "NB + SVM + regression", "ROC + hyperparameters", "PCA + clustering"], answer: 1, why: "5 + 6 + 5 = 16 of 30 marks." },
    { q: "Updating the weights after every single training sample is:", options: ["Batch GD", "Mini-batch GD", "Stochastic GD", "Normal equation"], answer: 2, why: "SGD updates per instance." },
    { q: "In the revision SVM problem, the decision boundary is:", options: ["y = −4x + 11", "y = −4x + 4", "y = −4x + 7.5", "y = 4x − 7.5"], answer: 2, why: "Midway between the two margin lines." },
    { q: "With Z = (x−3)², the 1-D kernel example's boundary is:", options: ["Z = 1", "Z = 2.5", "Z = 4", "Z = 0"], answer: 1, why: "Midway between Z = 1 (positive SVs) and Z = 4 (negative SVs)." },
  ],
};
