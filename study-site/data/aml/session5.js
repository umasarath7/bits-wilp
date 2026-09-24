// AML — Contact Session 5: Logistic Regression
// Source: CourseFiles/AML/ContactSession5-LogReg.pptx (23 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, then formulas with intuition.

export default {
  title: "Logistic Regression",
  source: "ContactSession5-LogReg.pptx · 23 slides",
  overview:
    "Linear regression predicts a number. But many real questions are **yes/no**: will this student pass, is this transaction fraud, will this customer default? This session builds logistic regression step by step: **why** we can't just use a straight line, **how** the sigmoid squashes any number into a probability, **where** the model draws its line between the classes, **why** it needs a different cost function (log-loss), and **how** to train it with gradient descent, including the slide-20 worked example that the exams love. We finish with more than two classes. Running example: predicting pass/fail from hours studied.",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why not just use linear regression for yes/no questions?",
      slides: "3–5",
      blocks: [
        {
          type: "p",
          text: "Slide 4 draws the line clearly. **Linear regression** could predict a student's **test score** on a scale of 0–100: a continuous number. **Logistic regression** predicts whether the student **passed or failed**: a category. Its predictions are **discrete** (only certain values are allowed), but underneath it also gives a **probability score**, e.g. “72% chance of passing”.",
        },
        {
          type: "p",
          text: "So why not simply code pass = 1 and fail = 0 and fit a straight line? Let's try. Say we have hours studied (x) and pass/fail (y). Fit a line and predict “pass” whenever the line is above 0.5. Three problems appear:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**The output isn't a probability.** For a student who studies 20 hours, the line might predict 1.8, and for 0 hours, −0.4. What does a probability of 1.8 mean? Nothing.",
            "**One far-away point wrecks it.** Add a student who studied 40 hours and (of course) passed. That point is correct, but it drags the line flatter, which shifts the 0.5 crossing to the right, and now some genuine passes get predicted as fails.",
            "**The cost doesn't fit the question.** Squared error treats “predicted 0.6 when the answer was 1” as a small miss, but the target is only ever 0 or 1.",
          ],
        },
        {
          type: "p",
          text: "What we want is a function that takes the same linear score $\\theta^Tx$ (from Session 4) but **squashes it into the range 0 to 1**, so it can be read as a probability. That function is the sigmoid.",
        },
        {
          type: "p",
          text: "**Quick recap (slide 5).** In vector form the linear score is $\\theta^T x = \\theta_0 + \\theta_1 x_1 + \\theta_2 x_2 + \\dots$, where $x_0 = 1$, $x$ is the feature vector and θ is the weight vector.",
        },
      ],
    },
    {
      id: "sigmoid",
      heading: "Lesson 2: How do we turn a score into a probability? The sigmoid",
      slides: "6–7",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "The logistic regression hypothesis",
          text: "$$h_\\theta(x) = \\sigma(\\theta^T x) = \\frac{1}{1 + e^{-\\theta^T x}}$$\n\n- $\\sigma$ (“sigma”) is the **sigmoid** or **logistic function**: $\\sigma(z) = \\dfrac{1}{1 + e^{-z}}$\n- $z = \\theta^T x$ is the ordinary linear score, which can be any number\n- $h_\\theta(x)$ is read as **the probability that y = 1** given x: $P(y = 1 \\mid x; \\theta)$",
        },
        {
          type: "p",
          text: "**Why does this formula squash things into (0, 1)?** Look at what happens to $e^{-z}$:",
        },
        {
          type: "list",
          items: [
            "**z very large (e.g. 10):** $e^{-10}$ is tiny, so $\\sigma \\approx 1/(1 + 0) = 1$. Very confident “yes”.",
            "**z very negative (e.g. −10):** $e^{10}$ is huge, so $\\sigma \\approx 1/\\text{huge} = 0$. Very confident “no”.",
            "**z = 0:** $e^0 = 1$, so $\\sigma = 1/2 = $ **0.5**. Completely undecided.",
          ],
        },
        {
          type: "p",
          text: "The result is an S-shaped curve that rises smoothly from 0 to 1, crossing 0.5 exactly at z = 0. It never quite reaches 0 or 1, so it's always a valid probability. Memorising a few values saves a lot of time in exams:",
        },
        {
          type: "table",
          caption: "Sigmoid values to remember",
          head: ["z", "−3", "−2", "−1", "0", "1", "2", "3"],
          rows: [["σ(z)", "0.047", "0.119", "0.269", "**0.5**", "0.731", "0.881", "0.953"]],
        },
        {
          type: "p",
          text: "Notice the symmetry: $\\sigma(-z) = 1 - \\sigma(z)$. So σ(−1) = 1 − 0.731 = 0.269. Learn the positive values and get the negatives for free.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Running example: will the student pass?",
          text: "Suppose training gave $\\theta_0 = -4$ and $\\theta_1 = 1.5$ (x = hours studied). Then $z = -4 + 1.5x$:\n\n| Hours | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| z | −2.5 | −1.0 | 0.5 | 2.0 | 3.5 |\n| P(pass) = σ(z) | 0.076 | 0.269 | 0.622 | 0.881 | 0.971 |\n\nIn plain English: at 1 hour, about an 8% chance of passing; at 4 hours, 88%. The probability rises smoothly with study time, and it can never go below 0 or above 1.",
        },
      ],
    },
    {
      id: "boundary",
      heading: "Lesson 3: Where does the model draw the line? The decision boundary",
      slides: "7–9",
      blocks: [
        {
          type: "p",
          text: "A probability is useful, but eventually we need a decision: pass or fail. The natural rule is (slide 7):",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The prediction rule",
          text: "Predict **y = 1** if $h_\\theta(x) \\ge 0.5$ $\\iff$ $\\theta^T x \\ge 0$\n\nPredict **y = 0** if $h_\\theta(x) < 0.5$ $\\iff$ $\\theta^T x < 0$\n\nBecause σ(z) ≥ 0.5 exactly when z ≥ 0, **you don't need to compute the sigmoid at all to classify**. Just check the sign of $\\theta^T x$.",
        },
        {
          type: "p",
          text: "The **decision boundary** is where the model is exactly undecided: $h_\\theta(x) = 0.5$, i.e. $\\theta^T x = 0$ (slide 8). In our running example, $-4 + 1.5x = 0$ gives $x = 2.67$ hours. Study more than about 2 hours 40 minutes and the model predicts “pass”.",
        },
        {
          type: "p",
          text: "**With two features the boundary is a line.** Slide 8 uses tumour size and age. Say $\\theta = (-3, 1, 1)$: predict malignant when $-3 + x_1 + x_2 \\ge 0$, i.e. $x_1 + x_2 \\ge 3$. The boundary is the straight line $x_1 + x_2 = 3$. Points on one side are predicted 1, on the other side 0.",
        },
        {
          type: "p",
          text: "**Curved boundaries (slide 9).** What if the classes sit in a ring, e.g. positives outside a circle and negatives inside? Add **polynomial features** like $x_1^2$ and $x_2^2$. With features $(1, x_1, x_2, x_1^2, x_2^2)$ and $\\theta = (-1, 0, 0, 1, 1)$: predict 1 when $-1 + x_1^2 + x_2^2 \\ge 0$, i.e. **outside the unit circle** $x_1^2 + x_2^2 = 1$. The model is still linear in θ, exactly the Session 4 trick, but the boundary is curved in the original space.",
        },
        {
          type: "callout",
          kind: "idea",
          title: "Keep in mind",
          text: "The decision boundary is a property of **θ**, not of the training data. The data is used to *learn* θ; once θ is fixed, the boundary is fixed.",
        },
        {
          type: "p",
          text: "**Reading the coefficients as odds.** Rearranging the sigmoid gives $\\log\\frac{p}{1 - p} = \\theta^T x$. The quantity $\\frac{p}{1-p}$ is the **odds** (e.g. p = 0.8 means odds of 4 to 1), and its logarithm is the **log-odds**. So logistic regression says *log-odds are linear in the features*. Practical meaning: **increasing $x_j$ by 1 multiplies the odds by $e^{\\theta_j}$**. In our example, $e^{1.5} \\approx 4.5$: each extra hour of study multiplies the odds of passing by about 4.5.",
        },
      ],
    },
    {
      id: "cost",
      heading: "Lesson 4: Why a new cost function? Log-loss",
      slides: "10–13",
      blocks: [
        {
          type: "p",
          text: "To learn θ (slide 10) we have a training set of m examples with n features and labels $y \\in \\{0, 1\\}$. As in Session 4, we need a cost function to minimise. The obvious choice is the Mean Squared Error we already know. Why not use it?",
        },
        {
          type: "p",
          text: "**Problem: MSE becomes a bumpy landscape (slide 11).** In linear regression, MSE was a smooth bowl with one minimum. But put the sigmoid inside, $\\frac{1}{2m}\\sum(\\sigma(\\theta^Tx) - y)^2$, and the surface becomes **non-convex**: it has flat plateaus and several dips. Gradient descent can walk into a local dip and get stuck, never finding the global minimum. So we need a cost that's shaped like a bowl again.",
        },
        {
          type: "p",
          text: "**The fix: cross-entropy, also called log-loss (slide 12).** Think about what a good cost should do. If the true answer is y = 1 and the model says h = 0.99, the cost should be about 0. If the model says h = 0.01, confidently wrong, the cost should be **huge**. The logarithm does exactly that:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Log-loss for one example",
          text: "$$\\text{Cost}(h_\\theta(x), y) = \\begin{cases} -\\log h_\\theta(x) & \\text{if } y = 1 \\\\ -\\log\\big(1 - h_\\theta(x)\\big) & \\text{if } y = 0 \\end{cases}$$",
        },
        {
          type: "list",
          items: [
            "**If y = 1:** the cost is $-\\log h$. When h = 1, $-\\log 1 = 0$: no cost. As h → 0, $-\\log h \\to \\infty$: a confident wrong answer is punished without limit.",
            "**If y = 0:** the cost is $-\\log(1 - h)$. Mirror image: zero when h = 0, infinite as h → 1.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Feel the numbers (y = 1)",
          text: "- Model says 0.9 → cost $-\\ln 0.9 = $ **0.105** (small: nearly right)\n- Model says 0.5 → cost $-\\ln 0.5 = $ **0.693** (undecided)\n- Model says 0.1 → cost $-\\ln 0.1 = $ **2.303** (big: confidently wrong)\n\nWith squared error, the last case would cost only $(0.1 - 1)^2 = 0.81$. Log-loss cares much more about confident mistakes.",
        },
        {
          type: "p",
          text: "**Combining the two cases into one formula (slide 13).** Since y is either 0 or 1, we can write both cases at once. When y = 1 the second term vanishes; when y = 0 the first term vanishes:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Log-loss cost function",
          text: "$$J(\\theta) = -\\frac{1}{m} \\sum_{i=1}^{m} \\Big[ y^{(i)} \\log h_\\theta(x^{(i)}) + \\big(1 - y^{(i)}\\big) \\log\\big(1 - h_\\theta(x^{(i)})\\big) \\Big]$$\n\nThis J(θ) is **convex**, a single bowl again, so gradient descent finds the global minimum.",
        },
      ],
    },
    {
      id: "gd",
      heading: "Lesson 5: How do we train it? Gradient descent (with the slide-20 example)",
      slides: "14, 20–23",
      blocks: [
        {
          type: "p",
          text: "Now we minimise J(θ) with gradient descent, exactly as in Session 4: start somewhere, step downhill, repeat (slide 14). When you work out the derivative of log-loss, something lovely happens: the messy sigmoid terms cancel, and the update has **exactly the same form as linear regression**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The update rule",
          text: "Repeat, updating all $\\theta_j$ simultaneously:\n$$\\theta_j := \\theta_j - \\alpha \\frac{1}{m} \\sum_{i=1}^{m} \\big( h_\\theta(x^{(i)}) - y^{(i)} \\big) x_j^{(i)}$$\n\nThe **only** difference from linear regression is inside $h$: here $h_\\theta(x) = \\sigma(\\theta^T x)$; there it was $\\theta^T x$.",
        },
        {
          type: "p",
          text: "**The exam recipe: one table.** Every gradient-descent question on logistic regression can be done with one table:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Columns: $x_1$, $x_2$, $y$, $z = \\theta^T x$, $\\hat y = \\sigma(z)$, error $\\hat y - y$, error × $x_1$, error × $x_2$.",
            "Fill in one row per example. Use the sigmoid table to save time.",
            "Average each of the last three columns (the error column itself gives θ₀'s gradient, since $x_0 = 1$).",
            "Multiply each average by α.",
            "Subtract from the old θ values.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Slide 20–23 worked example",
          text: "**Question (slide 20):** six points with labels, learning rate 0.5, initial weights $(W_0, W_1, W_2) = (1, 1, 1)$. The slide writes the output as $1/(1 + \\exp(-W_0 + W_1 X_1^2 - W_2 X_2))$, i.e. a slightly unusual exponent.\n\n**Slide 22: forward pass.** The exponent and prediction for each row:\n\n| X₁ | X₂ | Y | exponent | ŷ |\n|---|---|---|---|---|\n| 2 | 0 | 0 | 3 | 0.0474 |\n| 0 | 2 | 0 | −3 | 0.9526 |\n| 0 | −2 | 0 | 1 | 0.2689 |\n| −2 | 0 | 0 | 3 | 0.0474 |\n| 0 | 1 | 1 | −2 | 0.8808 |\n| 0 | −1 | 1 | 0 | 0.5000 |\n\n**Slide 23: gradients.** Errors ŷ − Y: 0.05, 0.95, 0.27, 0.05, −0.12, −0.5. Multiply by X₁ and X₂ and average: **0.12** (bias), **0** (X₁), **0.29** (X₂). Times the learning rate 0.5: 0.06, 0, 0.15.\n\n**New weights: W₀ = 0.94, W₁ = 1, W₂ = 0.85.**\n\nThe Numerical tab redoes the same data with the standard hypothesis $\\sigma(w_0 + w_1x_1 + w_2x_2)$ and checks that the log-loss drops. Either way the **method** is identical: forward pass → error → error × feature → average → × α → subtract.",
        },
      ],
    },
    {
      id: "multi",
      heading: "Lesson 6: What about more than two classes? One-vs-All and One-vs-One",
      slides: "15–19",
      blocks: [
        {
          type: "p",
          text: "Logistic regression answers one yes/no question. But suppose an email must be sorted into **Work, Friends, Family or Hobby**, or the weather into **Sunny, Cloudy, Rain or Snow** (slide 15). We break the multi-way question into several yes/no questions, exactly as in Session 3.",
        },
        {
          type: "p",
          text: "**One-vs-All (One-vs-Rest), slides 16–17.** For each class k, train a logistic regression classifier $h_\\theta^{(k)}(x)$ that estimates $P(y = k \\mid x)$, treating class k as positive and every other class as negative. For a new input, run all K classifiers and **pick the class with the highest probability**: $\\arg\\max_k h_\\theta^{(k)}(x)$. With classes A, B, C (slide 18): A vs (B + C), B vs (A + C), C vs (A + B).",
        },
        {
          type: "p",
          text: "**One-vs-One (slide 18).** Train a classifier for **every pair**: A vs B, A vs C, B vs C. For a new input, each classifier votes for one of its two classes, and the class with **the most votes** wins.",
        },
        {
          type: "table",
          caption: "Slide 18 comparison",
          head: ["", "One-vs-All", "One-vs-One"],
          rows: [
            ["Number of classifiers", "$K$", "$K(K-1)/2$"],
            ["Each classifier", "One class vs all others", "One class vs one other class"],
            ["Prediction", "Highest score / probability", "Majority vote"],
            ["3 classes", "3 classifiers", "3 classifiers"],
            ["10 classes", "10 classifiers", "45 classifiers"],
          ],
        },
        {
          type: "p",
          text: "Note: in One-vs-All the K probabilities **need not add up to 1**, because each classifier was trained independently. You just pick the biggest.",
        },
        {
          type: "p",
          text: "**Where logistic regression is used (slide 19):** credit-card **fraud** (fraud or not), **health** (is this tissue mass benign or malignant?), **marketing** (will this user buy an insurance product?), **banking** (will this customer default on a loan?). All are yes/no questions where a *probability* is valuable, because the business can choose its own threshold.",
        },
        {
          type: "p",
          text: "**Where it sits among classifiers.** Logistic regression models $P(y \\mid x)$ directly, so it's a **discriminative** model. Naïve Bayes (Session 6) takes the opposite, **generative** route.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in six lines",
          text: "1. Yes/no targets need outputs in (0, 1); a straight line gives values outside that range and is dragged by far points.\n2. $h_\\theta(x) = \\sigma(\\theta^Tx) = 1/(1 + e^{-\\theta^Tx}) = P(y = 1 \\mid x)$. σ(0) = 0.5, σ(1) = 0.731, σ(2) = 0.881, σ(3) = 0.953.\n3. Predict 1 when $\\theta^Tx \\ge 0$. The decision boundary is $\\theta^Tx = 0$: linear with raw features, curved with polynomial features.\n4. MSE + sigmoid is non-convex, so use **log-loss** $-\\frac1m\\sum[y\\log h + (1-y)\\log(1-h)]$, which is convex and punishes confident mistakes.\n5. GD update: $\\theta_j := \\theta_j - \\alpha\\frac1m\\sum(h - y)x_j$, the same as linear regression but with h = σ(θᵀx). One table does it.\n6. Multiclass: OvA (K classifiers, highest probability) or OvO (K(K−1)/2, majority vote).",
        },
      ],
    },
  ],

  glossary: [
    ["Logistic regression", "—", "A classifier that outputs the probability of class 1 using the sigmoid"],
    ["σ(z)", "Sigmoid / logistic function", "$1/(1 + e^{-z})$: squashes any number into (0, 1)"],
    ["z = θᵀx", "Linear score", "$\\theta_0 + \\theta_1x_1 + \\dots$, before the sigmoid"],
    ["$h_\\theta(x)$", "Hypothesis", "Estimated $P(y = 1 \\mid x)$"],
    ["e", "Euler's number", "≈ 2.718, the base of natural logarithms"],
    ["Decision boundary", "—", "Where $\\theta^Tx = 0$ (h = 0.5); separates predicted 0 from predicted 1"],
    ["Threshold", "—", "The cut-off on h (usually 0.5) for predicting 1"],
    ["Odds", "—", "p/(1 − p): e.g. p = 0.8 → odds 4"],
    ["Log-odds (logit)", "—", "log(p/(1 − p)) = θᵀx in logistic regression"],
    ["Convex / non-convex", "—", "One global minimum (bowl) / several local minima (bumpy)"],
    ["Log-loss", "Cross-entropy loss", "$-[y\\log h + (1-y)\\log(1-h)]$: punishes confident mistakes heavily"],
    ["J(θ)", "Cost function", "Average log-loss over the training set"],
    ["α", "Learning rate", "Step size in gradient descent"],
    ["GD", "Gradient Descent", "Iteratively step against the slope of J"],
    ["OvA / OvR", "One-vs-All / One-vs-Rest", "K classifiers, pick the highest probability"],
    ["OvO", "One-vs-One", "K(K−1)/2 pairwise classifiers, majority vote"],
    ["Discriminative model", "—", "Models P(y | x) directly (logistic regression, SVM)"],
    ["Generative model", "—", "Models P(x | y) and P(y), then uses Bayes (Naïve Bayes)"],
  ],

  examTips: [
    "The slide-20 example is a **one-iteration GD** table. Practise it until it takes under 10 minutes: z → σ(z) → error → error × feature → average → × α → subtract.",
    "Remember **σ(0) = 0.5**, σ(1) = 0.731, σ(2) = 0.881, σ(3) = 0.953, and σ(−z) = 1 − σ(z). This saves minutes.",
    "To classify, you only need the **sign** of θᵀx; no sigmoid needed.",
    "“Why not MSE for logistic regression?” → the sigmoid makes it **non-convex**, so GD can get stuck. Log-loss is convex.",
    "For framing questions (churn, default, fraud), logistic regression is the natural baseline: interpretable, outputs probabilities, convex training.",
  ],

  problems: [
    {
      title: "Sigmoid outputs and the decision boundary",
      level: "Easy",
      marks: 3,
      hint: "Compute z = θᵀx for each point first. Then use the sigmoid table. Class 1 whenever z ≥ 0.",
      question:
        "A tumour classifier uses $\\theta = (\\theta_0, \\theta_1, \\theta_2) = (-3, 1, 1)$ on features (size, age score). (a) Compute $h_\\theta(x)$ and the predicted class for (1, 1), (2, 2), (3, 0), (0, 4). (b) Write the decision boundary.",
      solution: `
### What is being asked
Apply the hypothesis and the prediction rule (Lessons 2–3).

### Why this approach
The class depends only on the sign of $z = \\theta^Tx$; the sigmoid gives the probability.

### Formulas
$$z = \\theta_0 + \\theta_1 x_1 + \\theta_2 x_2, \\qquad h = \\sigma(z) = \\frac{1}{1 + e^{-z}}, \\qquad \\hat y = 1 \\text{ if } z \\ge 0$$

### Working
$z = -3 + x_1 + x_2$

| x | z | σ(z) | class |
|---|---|---|---|
| (1, 1) | −1 | 0.269 | 0 |
| (2, 2) | 1 | 0.731 | 1 |
| (3, 0) | 0 | 0.5 | 1 (on the boundary; ≥ 0.5 counts as 1) |
| (0, 4) | 1 | 0.731 | 1 |

**(b)** $\\theta^Tx = 0 \\Rightarrow -3 + x_1 + x_2 = 0 \\Rightarrow x_1 + x_2 = 3$

### Answer
Probabilities **0.269, 0.731, 0.5, 0.731** → classes **0, 1, 1, 1**. Boundary: **$x_1 + x_2 = 3$**; points above or to the right of it are predicted 1.

### Takeaway
(2, 2) and (0, 4) look different but get the same probability because they have the same z. Everything on a line parallel to the boundary gets the same probability.`,
    },
    {
      title: "One iteration of gradient descent (slide-style)",
      level: "Hard",
      marks: 6,
      hint: "Use the one-table recipe from Lesson 5: z = 1 + x₁ + x₂ for every row, then σ(z) from the table, then the error and error × feature columns. Average, × 0.5, subtract.",
      question: `Fit logistic regression $h(x) = \\sigma(w_0 + w_1x_1 + w_2x_2)$ to the data below (the slide-20 data). Start at $(w_0, w_1, w_2) = (1, 1, 1)$ with learning rate 0.5. Find the weights after one batch gradient-descent iteration, and show that the log-loss decreased.

| x₁ | x₂ | y |
|---|---|---|
| 2 | 0 | 0 |
| 0 | 2 | 0 |
| 0 | −2 | 0 |
| −2 | 0 | 0 |
| 0 | 1 | 1 |
| 0 | −1 | 1 |`,
      solution: `
### What is being asked
One full batch gradient-descent step for logistic regression (Lesson 5), plus a check that it helped.

### Why this approach
The update has the same form as linear regression; only $h = \\sigma(z)$ changes. One table carries the whole calculation.

### Formulas
$$w_j := w_j - \\alpha \\cdot \\frac1m \\sum_i (\\hat y_i - y_i)\\,x_{ij}, \\qquad J = -\\frac1m\\sum\\big[y\\ln\\hat y + (1-y)\\ln(1-\\hat y)\\big]$$

### Working
| x₁ | x₂ | y | z = 1 + x₁ + x₂ | ŷ = σ(z) | e = ŷ − y | e·x₁ | e·x₂ |
|---|---|---|---|---|---|---|---|
| 2 | 0 | 0 | 3 | 0.9526 | 0.9526 | 1.9051 | 0 |
| 0 | 2 | 0 | 3 | 0.9526 | 0.9526 | 0 | 1.9051 |
| 0 | −2 | 0 | −1 | 0.2689 | 0.2689 | 0 | −0.5379 |
| −2 | 0 | 0 | −1 | 0.2689 | 0.2689 | −0.5379 | 0 |
| 0 | 1 | 1 | 2 | 0.8808 | −0.1192 | 0 | −0.1192 |
| 0 | −1 | 1 | 0 | 0.5 | −0.5 | 0 | 0.5 |
| | | | | **Σ** | **1.8239** | **1.3673** | **1.7480** |
| | | | | **avg (÷6)** | **0.3040** | **0.2279** | **0.2913** |

Update with α = 0.5:
- $w_0 = 1 - 0.5(0.3040) = 0.848$
- $w_1 = 1 - 0.5(0.2279) = 0.886$
- $w_2 = 1 - 0.5(0.2913) = 0.854$

Log-loss: **1.257** before, **1.145** after.

### Answer
$(w_0, w_1, w_2) = $ **(0.848, 0.886, 0.854)**; the log-loss fell from 1.257 to 1.145 ✓

### Takeaway
The slides write the exponent differently ($-W_0 + W_1X_1^2 - W_2X_2$) and so get (0.94, 1, 0.85), but the **method** is identical. Also notice this data isn't linearly separable: the y = 1 points sit *between* y = 0 points on the $x_2$ axis. A straight boundary will never fit it perfectly; you'd need a feature such as $x_2^2$.`,
    },
    {
      title: "Computing log-loss",
      level: "Easy",
      marks: 3,
      hint: "For y = 1 the loss is −ln h. For y = 0 it's −ln(1 − h). Average over the examples for J.",
      question:
        "(a) For a single example with y = 1, compute the log-loss when the model predicts h = 0.9, 0.6, 0.2 and 0.05. (b) For 5 examples with y = (1, 0, 1, 1, 0) and h = (0.8, 0.3, 0.6, 0.95, 0.1), compute J.",
      solution: `
### What is being asked
Evaluate the log-loss (Lesson 4) and see how it treats confident mistakes.

### Formula
$$\\text{Cost} = \\begin{cases} -\\ln h & y = 1 \\\\ -\\ln(1 - h) & y = 0 \\end{cases}, \\qquad J = \\text{average cost}$$

### Working
**(a)** y = 1, so the loss is $-\\ln h$:

| h | 0.9 | 0.6 | 0.2 | 0.05 |
|---|---|---|---|---|
| loss | 0.105 | 0.511 | 1.609 | 2.996 |

**(b)**
- y = 1, h = 0.8: $-\\ln 0.8 = 0.223$
- y = 0, h = 0.3: $-\\ln 0.7 = 0.357$
- y = 1, h = 0.6: $-\\ln 0.6 = 0.511$
- y = 1, h = 0.95: $-\\ln 0.95 = 0.051$
- y = 0, h = 0.1: $-\\ln 0.9 = 0.105$

$J = (0.223 + 0.357 + 0.511 + 0.051 + 0.105)/5 = 1.247/5 = 0.249$

### Answer
(a) **0.105, 0.511, 1.609, 2.996** (b) **J = 0.249**

### Takeaway
Going from h = 0.2 to h = 0.05 (more confidently wrong) nearly doubles the loss. Log-loss punishes confident mistakes far more than hesitant ones.`,
    },
    {
      title: "Non-linear decision boundary",
      level: "Medium",
      marks: 4,
      hint: "Set θᵀx = 0 to find the boundary. For each point, compute x₁² + x₂² − 4 and look at its sign.",
      question:
        "Features are $(1, x_1, x_2, x_1^2, x_2^2)$ with $\\theta = (-4, 0, 0, 1, 1)$. (a) Describe the decision boundary. (b) Classify (1, 1), (2, 1), (0, −2), (1.5, 1.5). (c) What does this show about logistic regression?",
      solution: `
### What is being asked
Use polynomial features to get a curved boundary (Lesson 3).

### Working
**(a)** $\\theta^Tx = -4 + x_1^2 + x_2^2 = 0 \\Rightarrow x_1^2 + x_2^2 = 4$: a **circle of radius 2** centred at the origin. Predict 1 outside, 0 inside.

**(b)**
| Point | $x_1^2 + x_2^2 - 4$ | class |
|---|---|---|
| (1, 1) | 1 + 1 − 4 = −2 | 0 |
| (2, 1) | 4 + 1 − 4 = 1 | 1 |
| (0, −2) | 0 + 4 − 4 = 0 | 1 (on the boundary) |
| (1.5, 1.5) | 2.25 + 2.25 − 4 = 0.5 | 1 |

### Answer
Boundary: circle $x_1^2 + x_2^2 = 4$. Classes: **0, 1, 1, 1**.

### Takeaway
**(c)** Logistic regression is linear in its *features*, so adding squared features lets it learn **curved** boundaries in the original space. The price is a risk of overfitting, so regularise.`,
    },
    {
      title: "Interpreting coefficients as odds",
      level: "Medium",
      marks: 3,
      hint: "Each +1 in a feature multiplies the odds by e raised to its coefficient. For (c), just apply the sigmoid to −1.",
      question:
        "A telecom churn model has $\\theta_{\\text{complaints}} = 0.7$ and $\\theta_{\\text{tenure (yrs)}} = -0.4$. (a) What happens to the odds of churn when complaints increase by 1? (b) When tenure increases by 1 year? (c) For a customer with $\\theta^Tx = -1$, what is P(churn)?",
      solution: `
### What is being asked
Turn coefficients into plain-English statements about odds (Lesson 3).

### Why this approach
Log-odds $= \\theta^Tx$. Adding 1 to $x_j$ adds $\\theta_j$ to the log-odds, which multiplies the odds by $e^{\\theta_j}$.

### Working
**(a)** $e^{0.7} = 2.01$
**(b)** $e^{-0.4} = 0.67$
**(c)** $\\sigma(-1) = 1/(1 + e^{1}) = 1/3.718 = 0.269$

### Answer
(a) Odds of churn roughly **double** with each extra complaint. (b) Odds fall by about **33%** per extra year with the company. (c) **P(churn) = 0.269**, so predict “no churn” at the 0.5 threshold.

### Takeaway
Positive coefficient → the feature pushes toward class 1; negative → away. This interpretability is a big reason banks and telecoms like logistic regression.`,
    },
    {
      title: "Multiclass prediction with OvA and OvO",
      level: "Medium",
      marks: 4,
      hint: "OvA: pick the largest probability. OvO: count each class's votes.",
      question:
        "An email sorter has classes A (Work), B (Friends), C (Family). (a) OvA classifiers output $P(A) = 0.62$, $P(B) = 0.71$, $P(C) = 0.15$. Predict the class. (b) OvO classifiers vote: A-vs-B → B, A-vs-C → A, B-vs-C → B. Predict the class. (c) How many classifiers are needed for 6 classes under each scheme?",
      solution: `
### What is being asked
Apply both multiclass strategies (Lesson 6).

### Working
**(a)** OvA picks the highest probability: B = 0.71. (The three don't sum to 1; each classifier is independent.)

**(b)** Votes: A = 1, B = 2, C = 0.

**(c)** OvA = K = 6. OvO $= 6 \\times 5 / 2 = 15$.

### Answer
(a) **B** (b) **B** (c) **6** and **15**

### Takeaway
OvA compares confidences; OvO counts wins. They usually agree, as here.`,
    },
  ],

  theory: [
    {
      title: "Why not linear regression for classification?",
      marks: 3,
      question: "Why is linear regression unsuitable for classification? How does logistic regression fix this?",
      solution: `
### What the examiner wants
Two or three concrete problems with the straight line, then the sigmoid + log-loss fix.

### Model answer
1. **Unbounded output:** $\\theta^Tx$ can be below 0 or above 1, so it can't be read as a probability.
2. **Sensitive to far points:** one extreme but correctly labelled point tilts the line and shifts the 0.5 threshold, which misclassifies other points.
3. **Wrong objective:** squared error doesn't match a 0/1 target.

**Logistic regression** passes the linear score through the **sigmoid**, so the output lies in (0, 1) and is read as $P(y = 1 \\mid x)$. It thresholds at 0.5, giving a decision boundary $\\theta^Tx = 0$, and it trains with **log-loss**, which is convex and suited to probabilities.

### Takeaway
Same linear score, different output layer and different cost.`,
    },
    {
      title: "Why log-loss instead of MSE?",
      marks: 3,
      question: "Explain why MSE is not used as the cost function for logistic regression. Write and explain the cross-entropy cost.",
      solution: `
### What the examiner wants
The **non-convexity** argument, the formula, and how it behaves at the extremes.

### Model answer
- With $h = \\sigma(\\theta^Tx)$, the MSE cost $\\frac{1}{2m}\\sum(h - y)^2$ is **non-convex** in θ. It has local minima and plateaus, so gradient descent may not reach the global optimum.
- **Cross-entropy / log-loss:** $\\text{Cost} = -\\log h$ if y = 1 and $-\\log(1 - h)$ if y = 0. Combined:
$$J(\\theta) = -\\frac1m\\sum\\big[y\\log h + (1-y)\\log(1-h)\\big]$$
- **Behaviour:** zero cost for a perfect confident prediction; the cost grows to ∞ as a confident prediction becomes wrong, which strongly penalises confident mistakes.
- It is **convex** in θ, so GD finds the global minimum, and its gradient has the simple form $\\frac1m\\sum(h - y)x_j$.

### Takeaway
Convex cost → reliable training. That's the whole reason for the switch.`,
    },
    {
      title: "Decision boundary",
      marks: 2,
      question: "What is the decision boundary of logistic regression? Is it always linear?",
      solution: `
### What the examiner wants
The definition (h = 0.5 ⇔ θᵀx = 0), an example, and the polynomial-features point.

### Model answer
- It is where the model is exactly undecided: $h_\\theta(x) = 0.5 \\iff \\theta^Tx = 0$. On one side predict 1, on the other side 0.
- With raw features the boundary is **linear** (a line in 2-D, a hyperplane in general), e.g. $-3 + x_1 + x_2 = 0$.
- With **polynomial features** ($x_1^2, x_2^2, x_1x_2, \\dots$) it can be **non-linear** in the original space, e.g. the circle $x_1^2 + x_2^2 = 1$, while still being linear in the parameters.
- The boundary is fixed by θ, which is learnt from the data.

### Takeaway
Linear in θ, not necessarily linear in x.`,
    },
    {
      title: "Frame a problem for logistic regression",
      pyq: "Midsem Q2(c)-style framing (churn, loan default, fraud)",
      marks: 3,
      question: "A bank wants to predict whether a loan applicant will default. Frame it as an ML problem: problem type, model, and metric, with justification. Why is logistic regression a sensible first model?",
      solution: `
### What the examiner wants
Type → Model → Metric, each with a “because”.

### Model answer
- **Type:** supervised **binary classification**, learning from historical loans labelled default / no default.
- **Model: logistic regression**, because it
  - outputs a *probability* of default that the bank can threshold according to its risk appetite
  - has interpretable coefficients (odds ratios), which regulators like
  - trains fast on a convex cost, making it a strong baseline
- **Metric:** defaults are usually rare (imbalanced), so not accuracy. Use **recall** on defaulters (missing a defaulter is costly) together with **precision** (don't reject good customers), i.e. **F1** or **ROC-AUC**. Choose the threshold from the cost of FN vs FP.

### Takeaway
Probability output + interpretability + imbalance-aware metric = full marks.`,
    },
    {
      title: "One-vs-all vs one-vs-one",
      marks: 3,
      question: "Explain the one-vs-all and one-vs-one strategies for multiclass classification with logistic regression. Compare them.",
      solution: `
### What the examiner wants
How each works, how it predicts, the classifier counts, and the trade-off.

### Model answer
- **One-vs-All (OvR):** for K classes, train K classifiers. Classifier k treats class k as positive and all others as negative, giving $h^{(k)}(x) = P(y = k \\mid x)$. Predict $\\arg\\max_k h^{(k)}(x)$.
- **One-vs-One:** train a classifier for every pair of classes, $K(K-1)/2$ in total. Each votes for one class of its pair; the class with the most votes wins.
- **Comparison:** OvA uses fewer classifiers, but each sees all the data and is imbalanced (1 class vs K − 1). OvO uses many more (45 for K = 10), but each is small and balanced, which suits algorithms that scale poorly with data size (e.g. SVMs).

### Takeaway
OvA = K specialists, highest confidence wins. OvO = a round-robin tournament, most wins.`,
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
    { q: "σ(−2) is approximately:", options: ["0.881", "0.119", "−0.881", "0.5"], answer: 1, why: "σ(−z) = 1 − σ(z) = 1 − 0.881." },
    { q: "In One-vs-All with 4 classes, how many logistic classifiers are trained?", options: ["4", "6", "12", "16"], answer: 0, why: "One per class: K = 4." },
  ],
};
