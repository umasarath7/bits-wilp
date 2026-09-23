// AML — Contact Session 5: Logistic Regression
// Source: CourseFiles/AML/ContactSession5-LogReg.pptx (23 slides)

export default {
  title: "Logistic Regression",
  source: "ContactSession5-LogReg.pptx · 23 slides",
  overview:
    "Logistic regression is a classifier. It passes the linear score $\\theta^Tx$ through the sigmoid to get $P(y=1|x)$, predicts 1 when that is ≥ 0.5 (i.e. when $\\theta^Tx \\ge 0$, a linear decision boundary), is trained by minimising the convex cross-entropy (log-loss) with gradient descent, and extends to many classes with one-vs-all or one-vs-one.",

  summary: [
    {
      id: "what",
      heading: "1. What is logistic regression?",
      slides: "3–5",
      blocks: [
        {
          type: "table",
          head: ["", "Linear regression", "Logistic regression"],
          rows: [
            ["Predicts", "A continuous number (test score 0–100)", "A **class** (pass/fail) plus a probability score"],
            ["Output", "$h_\\theta(x) = \\theta^Tx \\in (-\\infty, \\infty)$", "$h_\\theta(x) = \\sigma(\\theta^Tx) \\in (0, 1)$"],
            ["Cost", "Squared error (convex)", "**Cross-entropy / log-loss** (convex)"],
            ["Task", "Regression", "**Classification** (despite the name)"],
          ],
        },
        { type: "p", text: "**Recap:** the linear hypothesis in vector form is $h_\\theta(x) = \\theta^Tx = \\theta_0 + \\theta_1x_1 + \\theta_2x_2$ (with $x_0 = 1$)." },
      ],
    },
    {
      id: "sigmoid",
      heading: "2. Sigmoid and decision boundary",
      slides: "6–9",
      blocks: [
        { type: "p", text: "$$h_\\theta(x) = \\sigma(\\theta^Tx) = \\frac{1}{1+e^{-\\theta^Tx}} = P(y = 1 \\mid x;\\theta)$$" },
        {
          type: "table",
          caption: "Sigmoid values to remember",
          head: ["z", "−3", "−2", "−1", "0", "1", "2", "3"],
          rows: [["σ(z)", "0.047", "0.119", "0.269", "**0.5**", "0.731", "0.881", "0.953"]],
        },
        { type: "list", items: [
          "Predict **y = 1** if $h_\\theta(x) \\ge 0.5$ ⇔ $\\theta^Tx \\ge 0$. Predict **y = 0** if $\\theta^Tx < 0$.",
          "**Decision boundary:** the set where $\\theta^Tx = 0$, i.e. where the output is exactly 0.5. With linear features it is a line/hyperplane. Example: $\\theta = (-3, 1, 1)$ gives the boundary $x_1 + x_2 = 3$.",
          "**Non-linear boundaries:** add polynomial features. With $\\theta = (-1, 0, 0, 1, 1)$ on $(1, x_1, x_2, x_1^2, x_2^2)$, predict 1 if $x_1^2 + x_2^2 \\ge 1$, which is outside the **unit circle**.",
          "The boundary is a property of **θ**, not of the training set. The data is used to *fit* θ.",
          "**Odds interpretation:** $\\log\\frac{p}{1-p} = \\theta^Tx$. Increasing $x_j$ by 1 multiplies the odds by $e^{\\theta_j}$.",
        ]},
      ],
    },
    {
      id: "cost",
      heading: "3. Cost function: why not MSE?",
      slides: "10–13",
      blocks: [
        { type: "p", text: "Training set: m examples, n features, $y \\in \\{0, 1\\}$." },
        {
          type: "callout",
          kind: "warn",
          title: "MSE is non-convex here",
          text: "Plugging the sigmoid into squared error gives a **non-convex** J(θ) with many local minima, so gradient descent may not find the global minimum. Use **cross-entropy (log loss)** instead, which is **convex** for logistic regression.",
        },
        { type: "p", text: "$$\\text{Cost}(h_\\theta(x), y) = \\begin{cases} -\\log h_\\theta(x) & y = 1 \\\\ -\\log(1 - h_\\theta(x)) & y = 0\\end{cases}$$" },
        { type: "list", items: [
          "If y = 1: the cost is 0 when h = 1 and → ∞ as h → 0. Confident wrong answers are punished heavily.",
          "If y = 0: the cost is 0 when h = 0 and → ∞ as h → 1.",
        ]},
        { type: "p", text: "Compactly: $$J(\\theta) = -\\frac1m\\sum_{i=1}^m\\Big[y^{(i)}\\log h_\\theta(x^{(i)}) + (1-y^{(i)})\\log\\big(1-h_\\theta(x^{(i)})\\big)\\Big]$$" },
      ],
    },
    {
      id: "gd",
      heading: "4. Gradient descent",
      slides: "14, 20–23",
      blocks: [
        { type: "p", text: "Repeat, updating all $\\theta_j$ simultaneously: $$\\theta_j := \\theta_j - \\alpha\\frac1m\\sum_{i=1}^m\\big(h_\\theta(x^{(i)}) - y^{(i)}\\big)x_j^{(i)}$$" },
        {
          type: "callout",
          kind: "tip",
          title: "It looks identical to linear regression",
          text: "The update rule has the same form. The difference is inside $h_\\theta(x)$: here it is $\\sigma(\\theta^Tx)$, there it is $\\theta^Tx$. In exams, build the table **x₁, x₂, y, z = θᵀx, ŷ = σ(z), ŷ−y, (ŷ−y)x₁, (ŷ−y)x₂**, average the columns, multiply by α, and subtract.",
        },
      ],
    },
    {
      id: "multi",
      heading: "5. Multi-class classification & applications",
      slides: "15–19",
      blocks: [
        { type: "p", text: "**One-vs-all:** train a logistic classifier $h^{(k)}_\\theta(x) = P(y=k\\mid x)$ for each class $k$. For a new x, pick $\\arg\\max_k h^{(k)}_\\theta(x)$." },
        {
          type: "table",
          head: ["", "One-vs-All", "One-vs-One"],
          rows: [
            ["Classifiers", "$K$", "$K(K-1)/2$"],
            ["Each classifier", "One class vs all others", "One class vs another class"],
            ["Prediction", "Highest score / probability", "Majority vote"],
            ["3 classes", "3", "3"],
            ["10 classes", "10", "45"],
          ],
        },
        { type: "p", text: "**Applications:** credit-card fraud (fraud or not), health (tumour benign vs malignant), marketing (will the user buy insurance?), banking (will the customer default on a loan?)." },
      ],
    },
  ],

  keyTerms: [
    ["Sigmoid", "$\\sigma(z) = 1/(1+e^{-z})$, maps ℝ → (0, 1)."],
    ["$h_\\theta(x)$", "Estimated $P(y=1|x)$."],
    ["Decision boundary", "$\\theta^Tx = 0$, where $h = 0.5$."],
    ["Log-loss", "Cross-entropy cost, convex for logistic regression."],
    ["Odds", "$p/(1-p)$; log-odds $= \\theta^Tx$."],
    ["One-vs-all", "K binary classifiers; choose the maximum probability."],
    ["One-vs-one", "K(K−1)/2 pairwise classifiers; majority vote."],
    ["Discriminative model", "Models $P(y|x)$ directly (logistic regression is one)."],
  ],

  examTips: [
    "The slide example is a **one-iteration GD** table. Practise it until it takes under 10 minutes: z → σ(z) → error → error × feature → average → × α → subtract.",
    "Remember **σ(0) = 0.5**, and memorise σ(±1), σ(±2), σ(±3) (see the table) to save time.",
    "If asked “why not MSE for logistic regression?”, answer: the sigmoid makes it **non-convex**, so GD can get stuck. Log-loss is convex.",
    "For framing questions (churn, default, fraud), logistic regression is the natural baseline because it is interpretable and outputs probabilities.",
  ],

  problems: [
    {
      title: "Sigmoid outputs and the decision boundary",
      level: "Easy",
      marks: 3,
      question:
        "$\\theta = (\\theta_0, \\theta_1, \\theta_2) = (-3, 1, 1)$. (a) Compute $h_\\theta(x)$ and the predicted class for (1, 1), (2, 2), (3, 0), (0, 4). (b) Write the decision boundary.",
      solution: `
$z = -3 + x_1 + x_2$

| x | z | σ(z) | class |
|---|---|---|---|
| (1,1) | −1 | 0.269 | 0 |
| (2,2) | 1 | 0.731 | 1 |
| (3,0) | 0 | **0.5** | 1 (on the boundary; ≥ 0.5 counts as 1) |
| (0,4) | 1 | 0.731 | 1 |

**(b)** $\\theta^Tx = 0 \\Rightarrow$ **$x_1 + x_2 = 3$**. Points above or right of the line are predicted 1.`,
    },
    {
      title: "One iteration of gradient descent (slide-style)",
      level: "Hard",
      marks: 6,
      question: `Fit logistic regression $h(x) = \\sigma(w_0 + w_1x_1 + w_2x_2)$ to the data below. Start at $(w_0, w_1, w_2) = (1, 1, 1)$ with learning rate 0.5. Find the weights after one batch gradient-descent iteration, and show that the log-loss decreased.

| x₁ | x₂ | y |
|---|---|---|
| 2 | 0 | 0 |
| 0 | 2 | 0 |
| 0 | −2 | 0 |
| −2 | 0 | 0 |
| 0 | 1 | 1 |
| 0 | −1 | 1 |`,
      solution: `
| x₁ | x₂ | y | z = 1+x₁+x₂ | ŷ = σ(z) | e = ŷ−y | e·x₁ | e·x₂ |
|---|---|---|---|---|---|---|---|
| 2 | 0 | 0 | 3 | 0.9526 | 0.9526 | 1.9051 | 0 |
| 0 | 2 | 0 | 3 | 0.9526 | 0.9526 | 0 | 1.9051 |
| 0 | −2 | 0 | −1 | 0.2689 | 0.2689 | 0 | −0.5379 |
| −2 | 0 | 0 | −1 | 0.2689 | 0.2689 | −0.5379 | 0 |
| 0 | 1 | 1 | 2 | 0.8808 | −0.1192 | 0 | −0.1192 |
| 0 | −1 | 1 | 0 | 0.5 | −0.5 | 0 | 0.5 |
| | | | | **Σ** | **1.8239** | **1.3673** | **1.7480** |
| | | | | **avg (÷6)** | **0.3040** | **0.2279** | **0.2913** |

**Update** $w_j - 0.5\\times\\text{avg}$:
- $w_0 = 1 - 0.152 = $ **0.848**
- $w_1 = 1 - 0.1139 = $ **0.886**
- $w_2 = 1 - 0.1457 = $ **0.854**

**Log-loss:** before $= 1.257$, after $= 1.145$, so it **decreased** ✓

(This data isn't linearly separable, since the y = 1 points sit between y = 0 points on the $x_2$ axis. Linear logistic regression will never fit it perfectly; you'd need a feature such as $x_2^2$.)`,
    },
    {
      title: "Computing log-loss",
      level: "Easy",
      marks: 3,
      question:
        "(a) For a single example with y = 1, compute the log-loss when the model predicts h = 0.9, 0.6, 0.2 and 0.05. (b) For 5 examples with y = (1, 0, 1, 1, 0) and h = (0.8, 0.3, 0.6, 0.95, 0.1), compute J.",
      solution: `
**(a)** With y = 1 the loss is $-\\ln h$:

| h | 0.9 | 0.6 | 0.2 | 0.05 |
|---|---|---|---|---|
| loss | 0.105 | 0.511 | 1.609 | **2.996** |

A confident *wrong* prediction is punished very heavily.

**(b)** Per-example losses:
- y=1, h=0.8: $-\\ln 0.8 = 0.223$
- y=0, h=0.3: $-\\ln 0.7 = 0.357$
- y=1, h=0.6: $0.511$
- y=1, h=0.95: $0.051$
- y=0, h=0.1: $-\\ln 0.9 = 0.105$

$J = (0.223+0.357+0.511+0.051+0.105)/5 = $ **0.249**`,
    },
    {
      title: "Non-linear decision boundary",
      level: "Medium",
      marks: 4,
      question:
        "Features are $(1, x_1, x_2, x_1^2, x_2^2)$ with $\\theta = (-4, 0, 0, 1, 1)$. (a) Describe the decision boundary. (b) Classify (1, 1), (2, 1), (0, −2), (1.5, 1.5). (c) What does this show about logistic regression?",
      solution: `
**(a)** $\\theta^Tx = -4 + x_1^2 + x_2^2 = 0 \\Rightarrow x_1^2 + x_2^2 = 4$, a **circle of radius 2**. Predict 1 outside it and 0 inside.

**(b)**
| Point | $x_1^2+x_2^2-4$ | class |
|---|---|---|
| (1,1) | −2 | 0 |
| (2,1) | 1 | 1 |
| (0,−2) | 0 | 1 (on the boundary) |
| (1.5,1.5) | 0.5 | 1 |

**(c)** Logistic regression is linear in its *features*. By adding polynomial features it can learn **non-linear** boundaries in the original space, at the risk of overfitting (so regularise).`,
    },
    {
      title: "Interpreting coefficients as odds",
      level: "Medium",
      marks: 3,
      question:
        "A churn model has $\\theta_{\\text{complaints}} = 0.7$ and $\\theta_{\\text{tenure (yrs)}} = -0.4$. (a) What happens to the odds of churn when complaints increase by 1? (b) When tenure increases by 1 year? (c) For a customer with $\\theta^Tx = -1$, what is P(churn)?",
      solution: `
Log-odds $= \\theta^Tx$, so each +1 in $x_j$ multiplies the odds by $e^{\\theta_j}$.

**(a)** $e^{0.7} = 2.01$: the odds of churn roughly **double** with each extra complaint.

**(b)** $e^{-0.4} = 0.67$: the odds fall by about **33%** per extra year of tenure.

**(c)** $\\sigma(-1) = 1/(1+e) = $ **0.269**, so predict “no churn” at the 0.5 threshold.`,
    },
    {
      title: "Multiclass prediction with OvA and OvO",
      level: "Medium",
      marks: 4,
      question:
        "Classes: A, B, C. (a) OvA classifiers output $P(A) = 0.62$, $P(B) = 0.71$, $P(C) = 0.15$. Predict the class. (b) OvO classifiers vote: A-vs-B → B, A-vs-C → A, B-vs-C → B. Predict the class. (c) How many classifiers are needed for 6 classes under each scheme?",
      solution: `
**(a)** OvA picks the highest score, so **B** (0.71). The scores need not sum to 1, because each classifier is independent.

**(b)** Votes: A = 1, B = 2, C = 0, so **B** wins the most duels.

**(c)** OvA = **6**. OvO $= 6\\cdot5/2 = $ **15**.`,
    },
  ],

  theory: [
    {
      title: "Why not linear regression for classification?",
      marks: 3,
      question: "Why is linear regression unsuitable for classification? How does logistic regression fix this?",
      solution: `
1. **Unbounded output:** $\\theta^Tx$ can be < 0 or > 1, which can't be read as a probability.
2. **Sensitive to outliers / far points:** one extreme but correctly-labelled point tilts the line and shifts the 0.5 threshold, which misclassifies other points.
3. The squared-error objective doesn't match the 0/1 nature of the target.

**Logistic regression** passes the linear score through the **sigmoid**, so the output lies in (0, 1) and is interpretable as $P(y=1|x)$. It thresholds at 0.5 (a linear decision boundary $\\theta^Tx = 0$) and trains with **log-loss**, which is convex and suited to probabilities.`,
    },
    {
      title: "Why log-loss instead of MSE?",
      marks: 3,
      question: "Explain why MSE is not used as the cost function for logistic regression. Write and explain the cross-entropy cost.",
      solution: `
- With $h = \\sigma(\\theta^Tx)$, the MSE cost $\\frac{1}{2m}\\sum(h-y)^2$ is **non-convex** in θ. It has many local minima, so gradient descent may not reach the global optimum.
- **Cross-entropy / log-loss:** $\\text{Cost} = -\\log h$ if y = 1 and $-\\log(1-h)$ if y = 0. Combined:
$$J(\\theta) = -\\frac1m\\sum\\big[y\\log h + (1-y)\\log(1-h)\\big]$$
- **Behaviour:** zero cost for a perfect confident prediction, and it grows to ∞ as a confident prediction becomes wrong. This strongly penalises confident mistakes.
- It is **convex** in θ, so GD finds the global minimum. Its gradient has the simple form $\\frac1m\\sum(h-y)x_j$.`,
    },
    {
      title: "Decision boundary",
      marks: 2,
      question: "What is the decision boundary of logistic regression? Is it always linear?",
      solution: `
- It is where the model is exactly undecided: $h_\\theta(x) = 0.5 \\iff \\theta^Tx = 0$. On one side predict 1, on the other side predict 0.
- With raw features the boundary is **linear** (a line in 2-D, a hyperplane in general), e.g. $-3 + x_1 + x_2 = 0$.
- With **polynomial features** ($x_1^2, x_2^2, x_1x_2, …$) it can be **non-linear** in the original space, e.g. the circle $x_1^2 + x_2^2 = 1$. It is still linear in the parameters.
- The boundary is determined by θ, which is learnt from the data.`,
    },
    {
      title: "Frame a problem for logistic regression",
      pyq: "Midsem Q2(c)-style framing (churn, loan default, fraud)",
      marks: 3,
      question: "A bank wants to predict whether a loan applicant will default. Frame it as an ML problem: problem type, model, and metric, with justification. Why is logistic regression a sensible first model?",
      solution: `
- **Type:** supervised **binary classification**, using historical loans labelled default/no-default as experience.
- **Model:** **logistic regression**:
  - outputs a *probability* of default that the bank can threshold according to its risk appetite
  - interpretable coefficients (odds ratios), which regulators like
  - convex training, fast, a strong baseline
- **Metric:** defaults are usually rare (imbalanced), so not accuracy. Use **recall** on defaulters (missing a defaulter is costly) together with **precision** (don't reject good customers), i.e. **F1** or **ROC-AUC**. Choose the threshold from the cost of FN vs FP.`,
    },
    {
      title: "One-vs-all vs one-vs-one",
      marks: 3,
      question: "Explain the one-vs-all and one-vs-one strategies for multiclass classification with logistic regression. Compare them.",
      solution: `
- **One-vs-All (OvR):** for K classes, train K classifiers. Classifier k treats class k as positive and all others as negative, giving $h^{(k)}(x) = P(y=k|x)$. Predict $\\arg\\max_k h^{(k)}(x)$.
- **One-vs-One:** train a classifier for every pair of classes, $K(K-1)/2$ of them. Each votes for one class of its pair; the class with the most votes wins.
- **Comparison:** OvA uses fewer classifiers, but each sees all the data and the classes are imbalanced (1 vs K−1). OvO uses many more classifiers (45 for K = 10), but each is small and balanced (only 2 classes' data). That suits algorithms that scale poorly with data size, such as SVMs.`,
    },
  ],

  quiz: [
    { q: "σ(0) equals:", options: ["0", "0.5", "1", "e"], answer: 1, why: "1/(1+e⁰) = 1/2." },
    { q: "Logistic regression predicts y = 1 when:", options: ["θᵀx ≥ 0", "θᵀx ≥ 1", "θᵀx ≤ 0", "h(x) ≥ 1"], answer: 0, why: "h ≥ 0.5 ⇔ θᵀx ≥ 0." },
    { q: "Why is MSE not used for logistic regression?", options: ["It is too slow", "It is non-convex with the sigmoid", "It can't be differentiated", "It gives negative values"], answer: 1, why: "Non-convexity means GD may get stuck in local minima." },
    { q: "If y = 1 and h(x) → 0, the log-loss:", options: ["→ 0", "→ 1", "→ ∞", "= 0.5"], answer: 2, why: "−log(h) → ∞: a confident wrong prediction is heavily penalised." },
    { q: "The logistic-regression GD update has the same form as linear regression's, except:", options: ["The learning rate", "The definition of h(x)", "No 1/m factor", "No simultaneous update"], answer: 1, why: "h(x) = σ(θᵀx) instead of θᵀx." },
    { q: "Logistic regression is a:", options: ["Regression model", "Generative classifier", "Discriminative classifier", "Clustering algorithm"], answer: 2, why: "It models P(y|x) directly." },
    { q: "With features x₁², x₂², the logistic decision boundary can be:", options: ["Only a line", "A circle/ellipse", "Only a parabola", "No boundary"], answer: 1, why: "E.g. x₁² + x₂² = r²." },
    { q: "A coefficient θ_j = 0.7 means a unit increase in x_j multiplies the odds by:", options: ["0.7", "1.7", "e^0.7 ≈ 2.01", "0.5"], answer: 2, why: "Log-odds are linear, so the odds multiply by e^θ_j." },
  ],
};
