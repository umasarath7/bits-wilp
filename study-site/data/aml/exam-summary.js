// AML — Exam summary: a last-minute revision sheet for the mid-semester exam (Sessions 1–7).
// Built from the session notes and the previous paper. Notes-only page (no questions).

export default {
  title: "AML Exam Summary",
  source: "Sessions 1–7 + previous mid-sem paper · read in about 20 minutes",
  overview:
    "Read this the night before and again on the morning of the exam. It is **not** a replacement for the lessons; it's the set of things you must have at your fingertips. Section 2 and the recipes R1–R6 matter most: first learn to **recognise** each question type, then follow its **recipe**. About 80% of the previous paper was numerical, and Naïve Bayes, regression and SVM alone were 16 of 30 marks.",

  summary: [
    {
      id: "pattern",
      heading: "1. What the paper looks like",
      slides: "",
      blocks: [
        {
          type: "table",
          caption: "Previous mid-sem: 30 marks, about 4 minutes per mark",
          head: ["Q", "What was asked", "Marks", "Recipe below"],
          rows: [
            ["1a", "Euclidean + Manhattan distance", "2", "R1"],
            ["1b", "Confusion matrix → accuracy, precision, recall, F1", "2", "R2"],
            ["1c", "Which analyst is satisfied (recall vs precision)", "2", "R2"],
            ["1d", "Polynomial kernel: φ(x) and K(x, z)", "2", "R6"],
            ["2a–c", "Three ML challenges · bias–variance · frame churn as ML", "2 each", "Section 3"],
            ["3", "Naïve Bayes: loan approval", "5", "R5"],
            ["4", "Least-squares line → predict → MSE", "5", "R3"],
            ["5", "XOR with SVM: feature map, support vectors, hyperplane, boundary", "6", "R6"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Strategy",
          text: "- Start with the **big numericals you're fastest at** (NB, regression, SVM). They're where the marks are.\n- **Show a table for every calculation.** Method marks are given even if the arithmetic slips.\n- **Write the formula before substituting.** It earns marks and stops mistakes.\n- **End every numerical with a boxed answer and one line of interpretation** (“Predicted class: Yes”, “recall 0.91 means 91% of frauds are caught”).\n- Upload answers **per question** (QR code). Don't put every sheet under one question.\n- 2-mark theory = **definition + key point + example**. No essays.",
        },
      ],
    },
    {
      id: "recognise",
      heading: "2. Recognise the question → know what to do",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["If the question says…", "It's about…", "Do this"],
          rows: [
            ["“distance between points / nearest neighbour”", "Distance measures (S2)", "Write the difference vector, then apply each formula (R1)"],
            ["A 2×2 table of TP / FP / FN / TN", "Classification metrics (S3)", "Four formulas, substitute, 3–4 decimals (R2)"],
            ["“can't afford to miss…” / “too many false alarms”", "Recall vs precision (S3)", "Missing is costly → **recall**; false alarms costly → **precision**"],
            ["“fit a line”, “least squares”, “predict y when x = …”", "Simple linear regression (S4)", "Table of deviations → slope → intercept → predict → error (R3)"],
            ["“one iteration of gradient descent”, “learning rate α”", "GD for linear or logistic regression (S4/S5)", "Table: prediction → error → error × feature → average → update (R4)"],
            ["“probability of class”, “Bayes”, a table of categorical attributes", "Naïve Bayes (S6)", "Priors → likelihoods for the query only → products → normalise (R5)"],
            ["A probability never appears in training", "Zero-frequency problem (S6)", "Say so explicitly; apply Laplace $\\frac{n_c+1}{n+v}$"],
            ["“not linearly separable”, “kernel”, XOR", "Non-linear SVM (S7)", "Pick φ, transform, find support vectors, hyperplane, map back (R6)"],
            ["“maximum-margin hyperplane” for a few points", "Linear SVM (S7)", "Guess support vectors, $w^Tx+b=\\pm1$, solve for w, b; margin $2/\\|w\\|$ (R6)"],
            ["A train/validation error table vs complexity", "Over/underfitting (S1/S4)", "Big **gap** → overfit; both **high** → underfit; pick min validation error"],
            ["“frame this as an ML problem”", "Problem framing (S1/S2)", "Type → model → metric, each with “because” (Section 3)"],
            ["“which attribute type”", "Nominal/ordinal/interval/ratio (S2)", "Name the type + the deciding property (true zero? order?)"],
            ["“list preprocessing issues” with a messy table", "Data quality (S2)", "Duplicates, missing, invalid, formats, units, redundant columns: each with a fix"],
          ],
        },
      ],
    },
    {
      id: "r1",
      heading: "R1. Distances (Session 2)",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Formulas",
          text: "First write $|x_k - y_k|$ for every attribute.\n\n- **Manhattan (L₁):** $\\sum_k |x_k - y_k|$\n- **Euclidean (L₂):** $\\sqrt{\\sum_k (x_k - y_k)^2}$\n- **Supremum (L∞):** $\\max_k |x_k - y_k|$\n- **Minkowski:** $\\left(\\sum_k |x_k - y_k|^r\\right)^{1/r}$ (r = 1, 2, ∞ give the three above)\n- **Cosine similarity:** $\\dfrac{x \\cdot y}{\\|x\\|\\,\\|y\\|}$\n- **Hamming:** number of positions where two binary strings differ",
        },
        {
          type: "callout",
          kind: "example",
          title: "PYQ 1a in 30 seconds",
          text: "P = (3, 7, 2), Q = (6, 2, 5). Differences: 3, 5, 3.\nEuclidean $= \\sqrt{9 + 25 + 9} = \\sqrt{43} = $ **6.557**. Manhattan $= 3 + 5 + 3 = $ **11**.",
        },
        {
          type: "p",
          text: "**Remember:** $L_1 \\ge L_2 \\ge L_\\infty$ always. **Standardise first** if attributes are on different scales. Cosine is for documents and sparse data (ignores length and 0–0 matches). Correlation = 0 doesn't mean “unrelated” ($y = x^2$).",
        },
      ],
    },
    {
      id: "r2",
      heading: "R2. Confusion matrix and metrics (Session 3)",
      slides: "",
      blocks: [
        {
          type: "table",
          caption: "Layout (rows = actual, columns = predicted)",
          head: ["", "Predicted +", "Predicted −"],
          rows: [
            ["**Actual +**", "TP (true positive)", "FN (false negative: a **miss**)"],
            ["**Actual −**", "FP (false positive: a **false alarm**)", "TN (true negative)"],
          ],
        },
        { type: "diagram", name: "s3-confusion" },
        {
          type: "callout",
          kind: "formula",
          title: "Formulas",
          text: "$$\\text{Accuracy} = \\frac{TP + TN}{\\text{total}} \\qquad \\text{Precision} = \\frac{TP}{TP + FP} \\qquad \\text{Recall} = \\frac{TP}{TP + FN}$$\n$$F_1 = \\frac{2PR}{P + R} = \\frac{2TP}{2TP + FP + FN} \\qquad \\text{FPR} = \\frac{FP}{FP + TN} \\qquad \\text{Specificity} = \\frac{TN}{TN + FP}$$",
        },
        {
          type: "p",
          text: "**How to remember them.** *Precision* looks along the **predicted** column: of everything I flagged, how much was right? *Recall* looks along the **actual** row: of everything that was really positive, how much did I catch? Recall is also called sensitivity or the True Positive Rate (TPR).",
        },
        {
          type: "p",
          text: "**Which matters? (PYQ 1c)** If missing a positive is costly (fraud, cancer, churn), you want high **recall**. If false alarms are costly (spam filter deleting real mail, expensive investigations), you want high **precision**. With imbalanced classes, **accuracy is misleading**: 9,990 negatives and 10 positives → predicting “negative” for everything gives 99.9% accuracy and catches nothing.",
        },
        {
          type: "p",
          text: "**Also know:** ROC curve = TPR (y) vs FPR (x) as the threshold varies; ideal point (0, 1); diagonal = random guessing; AUC 1 = perfect, 0.5 = random. One-vs-All needs $K$ classifiers, One-vs-One needs $K(K-1)/2$ (10 classes → **45**). Bootstrap: ≈ **63.2%** of records are unique in a sample.",
        },
      ],
    },
    {
      id: "r3",
      heading: "R3. Least-squares line, prediction and error (Session 4)",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Formulas",
          text: "$$b_1 = \\frac{S_{xy}}{S_{xx}} = \\frac{\\sum (x - \\bar x)(y - \\bar y)}{\\sum (x - \\bar x)^2} \\qquad b_0 = \\bar y - b_1 \\bar x \\qquad \\hat y = b_0 + b_1 x$$\n$$\\text{MSE} = \\frac1n \\sum (y - \\hat y)^2 \\qquad \\text{RMSE} = \\sqrt{\\text{MSE}} \\qquad R^2 = 1 - \\frac{\\sum (y - \\hat y)^2}{\\sum (y - \\bar y)^2}$$\n\nShortcut form: $b_1 = \\dfrac{n\\sum xy - \\sum x \\sum y}{n \\sum x^2 - (\\sum x)^2}$",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Compute $\\bar x$ and $\\bar y$.",
            "Table with columns $x, y, x - \\bar x, y - \\bar y$, product, $(x - \\bar x)^2$. Sum the last two.",
            "Slope $b_1$ = sum of products ÷ sum of squares. Intercept $b_0 = \\bar y - b_1 \\bar x$ (the line passes through the mean point).",
            "Predict by substituting x.",
            "For MSE: add columns $\\hat y$, $y - \\hat y$, $(y - \\hat y)^2$; average the last one.",
            "Interpret the slope in words: “each extra unit of x adds about $b_1$ units of y”.",
          ],
        },
        { type: "diagram", name: "s4-residuals" },
        {
          type: "p",
          text: "**Also know:** the cost used in GD is $J(\\theta) = \\frac{1}{2m}\\sum(h_\\theta(x) - y)^2$ (half the MSE; it's **convex**, one global minimum). Normal equation $\\theta = (X^TX)^{-1}X^Ty$ (no α, no iterations, but expensive to invert). **Regularisation** adds $\\lambda \\sum_{j \\ge 1} \\theta_j^2$: large λ shrinks the θs toward 0, so the curve becomes simpler and smoother (θ₀ is not penalised).",
        },
      ],
    },
    {
      id: "r4",
      heading: "R4. One iteration of gradient descent (Sessions 4–5)",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "The update (same shape for linear and logistic regression)",
          text: "$$\\theta_j := \\theta_j - \\alpha \\cdot \\frac{1}{m}\\sum_{i=1}^{m} \\big(h_\\theta(x^{(i)}) - y^{(i)}\\big)\\, x_j^{(i)} \\qquad (x_0 = 1)$$\n\n- **Linear:** $h_\\theta(x) = \\theta^T x$\n- **Logistic:** $h_\\theta(x) = \\sigma(\\theta^T x) = \\dfrac{1}{1 + e^{-\\theta^T x}}$\n\nUpdate **all** θs from the **old** values (simultaneous update).",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Table columns: $x_1, x_2, y$, $z = \\theta^Tx$, prediction $h$ (= z, or σ(z) for logistic), error $h - y$, error × $x_1$, error × $x_2$.",
            "Average each “error × feature” column (the error column itself is the gradient for θ₀).",
            "Multiply by α and **subtract** from each old θ.",
            "**Batch** GD: one update using all rows. **Stochastic** GD: update after **each** row, using the new θ for the next row. **Mini-batch**: update after each small group.",
          ],
        },
        {
          type: "table",
          caption: "Sigmoid values to remember (saves time)",
          head: ["z", "−3", "−2", "−1", "0", "1", "2", "3"],
          rows: [["σ(z)", "0.047", "0.119", "0.269", "**0.5**", "0.731", "0.881", "0.953"]],
        },
        {
          type: "p",
          text: "**Also know:** α too small → slow; too large → overshoots and diverges. Scale features first, or GD may diverge (BMI ≈ 30 vs blood pressure ≈ 100). Logistic regression predicts 1 when $\\theta^Tx \\ge 0$ (i.e. σ ≥ 0.5); the **decision boundary** is $\\theta^Tx = 0$. **Why not MSE for logistic?** With the sigmoid inside, MSE is **non-convex** (GD can get stuck); **log-loss** $-\\frac1m\\sum[y\\log h + (1-y)\\log(1-h)]$ is convex.",
        },
      ],
    },
    {
      id: "r5",
      heading: "R5. Naïve Bayes (Session 6)",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Formulas",
          text: "$$P(y \\mid x) = \\frac{P(x \\mid y)\\,P(y)}{P(x)} \\qquad \\hat y = \\arg\\max_y \\; P(y) \\prod_i P(x_i \\mid y)$$\n\n- **Prior:** $P(y) = \\frac{\\text{count of class } y}{N}$\n- **Categorical likelihood:** $P(x_i = c \\mid y) = \\frac{n_c}{n_y}$\n- **Laplace smoothing:** $\\frac{n_c + 1}{n_y + v}$ ($v$ = number of possible values of that attribute)\n- **Gaussian likelihood:** $\\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\!\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$ using the class's mean and variance",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Priors:** count each class.",
            "**Likelihoods:** only for the attribute values in the **query**. Make a table: attribute value | P(· | Yes) | P(· | No).",
            "**Score** each class: prior × product of its likelihoods.",
            "**Normalise** if probabilities are asked: $P(\\text{Yes} \\mid x) = \\frac{s_{Yes}}{s_{Yes} + s_{No}}$.",
            "**State the answer**: “Predicted class: Yes (0.58)”.",
          ],
        },
        {
          type: "p",
          text: "**Why “naïve”?** It assumes the attributes are **independent given the class**, which is rarely exactly true, but it makes the maths possible (the full joint needs a count for every combination). **If any likelihood is 0**, the whole product becomes 0; say so and apply Laplace. NB is a **generative** model (learns $P(x|y)$ and $P(y)$); logistic regression is **discriminative** (learns $P(y|x)$ directly). For Bayes-theorem word problems, write $P(A)$, $P(B)$, $P(A|B)$ first, then flip with the formula.",
        },
      ],
    },
    {
      id: "r6",
      heading: "R6. Support Vector Machines (Session 7)",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Formulas",
          text: "- Decision: $f(x) = \\text{sign}(w^Tx + b)$; boundary $w^Tx + b = 0$\n- Margin lines (through the support vectors): $w^Tx + b = \\pm 1$\n- **Margin width** $= \\dfrac{2}{\\|w\\|}$; distance of a point to the boundary $= \\dfrac{|w^Tx + b|}{\\|w\\|}$\n- Hard margin: minimise $\\frac12\\|w\\|^2$ s.t. $y_i(w^Tx_i + b) \\ge 1$\n- Dual: $w = \\sum \\alpha_i y_i x_i$, $\\sum \\alpha_i y_i = 0$; only support vectors have $\\alpha_i > 0$\n- Soft margin: minimise $\\frac12\\|w\\|^2 + C\\sum \\xi_i$, slack $\\xi_i = \\max(0, 1 - y_i f(x_i))$\n- Kernels: linear $x^Tz$; polynomial $(1 + x^Tz)^p$; RBF $\\exp(-\\|x - z\\|^2 / 2\\sigma^2)$",
        },
        {
          type: "p",
          text: "**Linear SVM by hand:** plot the points → the closest opposite-class points are the support vectors → set $w^Tx + b = +1$ at the positive SVs and $-1$ at the negative SVs → solve for w and b → boundary is the line midway → margin $= 2/\\|w\\|$ → check every point is on the correct side.",
        },
        { type: "diagram", name: "s7-margin" },
        {
          type: "p",
          text: "**Polynomial kernel, degree 2 (PYQ 1d):** $\\phi(x) = (1, \\sqrt2 x_1, \\sqrt2 x_2, x_1^2, x_2^2, \\sqrt2 x_1 x_2)$. Compute φ for both points, take the dot product, and **check** it equals $(1 + x^Tz)^2$ computed directly.",
        },
        {
          type: "p",
          text: "**XOR (PYQ 5):** add the feature $z = x_1 x_2$. Now class +1 has z = +1 and class −1 has z = −1 → all 4 points are support vectors → hyperplane $z = 0$ (w₃ = 1, b = 0, margin 2) → in the original space the boundary is $x_1 x_2 = 0$ (the two axes); $f(x) = \\text{sign}(x_1 x_2)$.",
        },
        { type: "diagram", name: "s7-xor" },
        {
          type: "p",
          text: "**C in one line:** large C → narrow margin, few violations, risk of overfitting; small C → wider margin, more violations, often generalises better. **Kernel trick:** the dual only needs dot products, so replace them with $K(x, z)$ and never compute φ explicitly.",
        },
      ],
    },
    {
      id: "theory",
      heading: "3. Two-mark theory answers, ready to write",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Question", "What to write"],
          rows: [
            ["**Challenges of ML** (PYQ 2a)", "*Data:* insufficient, non-representative (noise = small sample, bias = flawed method), poor quality, irrelevant features. *Model:* overfitting (too complex, learns noise), underfitting (too simple). One line + remedy each."],
            ["**Bias–variance trade-off** (PYQ 2b)", "Bias = error from overly simple assumptions → underfitting. Variance = sensitivity to the particular training sample → overfitting. As complexity ↑, bias ↓ and variance ↑. Best model minimises total error (≈ bias² + variance + noise), i.e. the trade-off point."],
            ["**Frame churn / default / fraud** (PYQ 2c)", "Supervised binary classification (labelled history). Model: logistic regression baseline (interpretable, gives probabilities). Metric: data is imbalanced, so not accuracy; use recall (catch churners) balanced with precision → F1 / ROC-AUC."],
            ["**Overfitting vs underfitting**", "Overfit: low training, high validation error (big gap); fix with regularisation, more data, simpler model. Underfit: both high; fix with a more complex model, better features, less regularisation."],
            ["**Parameter vs hyperparameter**", "Parameters are learnt from data (θ, w). Hyperparameters are set before training (degree, λ, C, α, k) and tuned by cross-validation."],
            ["**Why cross-validation?**", "Training error is optimistic. A single hold-out split depends on luck. K-fold: each fold validates once; average K scores; every point used for both."],
            ["**Generative vs discriminative**", "Generative learns $P(x|y)$ and $P(y)$ (Naïve Bayes). Discriminative learns $P(y|x)$ or f(x) directly (logistic regression, SVM)."],
            ["**Why log-loss, not MSE, for logistic regression**", "Sigmoid inside MSE makes the cost non-convex with local minima; log-loss is convex, so GD finds the global minimum."],
            ["**MLOps: CI / CD / CT**", "CI = test code **and data, schemas, models**. CD = deploy the training pipeline, which deploys the prediction service. CT = automatic retraining in production. Monitor for data drift/skew; validate models before release (canary / A-B)."],
            ["**Curse of dimensionality**", "More dimensions → data becomes sparse → distances become similar → k-NN/clustering degrade. Fix: PCA, feature selection."],
          ],
        },
      ],
    },
    {
      id: "numbers",
      heading: "4. Numbers and facts worth memorising",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "σ(0) = 0.5, σ(±1) = 0.731 / 0.269, σ(±2) = 0.881 / 0.119, σ(±3) = 0.953 / 0.047",
            "OvO for K classes: $K(K-1)/2$ → 3 classes: 3, 10 classes: **45**. OvA: K.",
            "Bootstrap: $1 - (1 - 1/n)^n \\to$ **0.632** unique; ≈ 0.368 left out for testing.",
            "K-fold: K models, each trained on $(K-1)/K$ of the data; each sample validated once.",
            "Validation hold-out: 20–30%. Holdout method in the slides: train 2/3, test 1/3.",
            "Degree-2 polynomial kernel on 2-D data → **6** features. $\\binom{n+d}{d}$ terms in general.",
            "Laplace denominator adds **v** (the number of possible values), not 1.",
            "Margin = $2/\\|w\\|$, not $1/\\|w\\|$.",
            "Housing problem = supervised, multivariate, batch regression; metric RMSE (MAE if many outliers).",
            "Attribute ladder: nominal (=) → ordinal (<) → interval (−) → ratio (÷, true zero). °C interval, K ratio.",
          ],
        },
      ],
    },
    {
      id: "traps",
      heading: "5. Traps that cost marks",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Swapping FP and FN.** FN = actually positive but **missed**. FP = actually negative but **flagged**.",
            "**Using accuracy on imbalanced data** without comment. Always mention precision/recall.",
            "**Forgetting to update all θs from the old values** in GD (simultaneous update), or forgetting $x_0 = 1$ for θ₀.",
            "**Batch vs stochastic GD:** in SGD, the second row uses the **already-updated** θ.",
            "**Computing likelihoods for every attribute value** in NB instead of only the query's values. Wastes time.",
            "**Ignoring a zero probability** in NB. Always state it and mention Laplace.",
            "**Sample vs population standard deviation.** Divide by $n - 1$ for a sample unless told otherwise.",
            "**Relative vs absolute change.** 15.4% → 10.9% is 4.5 percentage points, but a 29% relative reduction.",
            "**Not scaling** before distance-based methods or gradient descent.",
            "**Correlation = 0 ≠ independent.** $y = x^2$ has r = 0.",
            "**Leaving the final answer unlabelled.** Box it, with units and a one-line interpretation.",
          ],
        },
      ],
    },
    {
      id: "checklist",
      heading: "6. Final 5-minute checklist",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "remember",
          title: "Can you, without looking…",
          text: "1. Write Euclidean, Manhattan and cosine formulas?\n2. Draw the confusion matrix and write precision, recall, F1?\n3. Build the regression table and get $b_1 = S_{xy}/S_{xx}$, $b_0 = \\bar y - b_1\\bar x$?\n4. Write the GD update and do one row of the table for logistic regression?\n5. Lay out an NB calculation: priors → query likelihoods → products → normalise?\n6. Write φ for the degree-2 polynomial kernel, and solve XOR with $z = x_1x_2$?\n7. Explain bias–variance and overfitting in two lines each?\n\nIf yes to all seven, you're ready. Good luck!",
        },
      ],
    },
  ],
};
