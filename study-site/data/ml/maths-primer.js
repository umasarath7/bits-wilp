// Shared by ML and AML — "Maths You Need": every symbol and idea the lectures assume, taught from zero.
// Written for students who never attended the MFML / lecture sessions. All examples verified by hand and in Python.

export default {
  title: "📐 Maths You Need (from zero)",
  source: "Prerequisite primer for ML & AML · no lecture needed",
  quizMode: "step",
  overview:
    "Machine-learning slides are full of symbols that look scary: Σ, $\\theta^T x$, $\\|w\\|$, $\\partial J/\\partial \\theta$, argmin, $e^{-z}$, $\\log_2$. **Every one of them is a short-hand for something simple you already know** (adding up, multiplying, measuring a length, asking “how steep is it here?”). This page translates each into plain English, with a tiny example you can do in your head. Read it once, then come back whenever a lesson uses a symbol you don't recognise. Ten minutes here will save hours of confusion later.",

  summary: [
    {
      id: "read",
      heading: "Lesson 1: How to read a formula: Σ, subscripts, hats and bars",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "A formula is a **sentence written in shorthand**. You only need to know a handful of “words” to read almost any ML formula aloud.",
        },
        {
          type: "table",
          head: ["Symbol", "Say it as", "Means", "Tiny example"],
          rows: [
            ["$\\sum_{i=1}^{n} x_i$", "“sum of x-i, i from 1 to n”", "add up all the x's", "$x = 2$, 5, 3 → 10"],
            ["$x_i$ or $x_j$", "“x sub i”", "the i-th item in a list (a label, not maths)", "$x_2 = 5$ above"],
            ["$x^{(i)}$", "“x superscript i”", "the i-th **example** (row); the brackets mean it's a label, not a power", "x⁽³⁾ = 3rd house"],
            ["$\\hat y$", "“y-hat”", "a **guess/estimate** of y", "predicted price"],
            ["$\\bar x$", "“x-bar”", "the **average** of x", "$(2 + 5 + 3)/3 = 3.33$"],
            ["$\\theta, w$", "“theta”, “w”", "the model's adjustable numbers (weights, knobs)", "slope, intercept"],
            ["$:=$ or $\\leftarrow$", "“becomes”", "update the value (as in code)", "$\\theta$ := $\\theta - 0.1$"],
            ["$\\forall i$", "“for every i”", "the rule applies to each example", ""],
            ["$\\in$", "“is in / belongs to”", "membership", "y ∈ {0, 1}: y is 0 or 1"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Read one aloud",
          text: "$\\frac{1}{n}\\sum_{i=1}^{n}(\\hat y^{(i)} - y^{(i)})^2$ → “for every example, take (guess − real), square it, add them all up, divide by how many there are”. That's just the **average squared mistake** (MSE).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Σ = add up. Subscript = which item. (i) superscript = which example. Hat = guess. Bar = average. := = becomes.**",
        },
      ],
    },
    {
      id: "vectors",
      heading: "Lesson 2: Vectors, dot product and length",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "A **vector** is just a **list of numbers** describing one thing. A house could be x = (size 1200, bedrooms 3). A set of weights could be $w = (0.2, 50)$.\n\nThe **dot product** $w \\cdot x$ (also written $w^T x$) = multiply matching entries and add them up. It's how a model turns features into **one score**: $0.2 \\times 1200 + 50 \\times 3 = 240 + 150$ = **390**. Every linear model, logistic regression, SVM and neuron starts with a dot product.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The three vector tools",
          text: "- **Dot product:** $w \\cdot x = w^Tx = w_1x_1 + w_2x_2 + \\dots$\n- **Length (norm):** $\\|w\\| = \\sqrt{w_1^2 + w_2^2 + \\dots}$, Pythagoras. $w = (3, 4)$ → $\\|w\\| = 5$.\n- **Distance between two points:** $\\|a - b\\| = \\sqrt{(a_1 - b_1)^2 + (a_2 - b_2)^2}$. (1, 2) to (4, 6) → $\\sqrt{9 + 16} = 5$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Why it matters later",
          text: "- Logistic regression: score $z = \\theta^T x$.\n- SVM: road width = $2/\\|w\\|$ (a shorter w gives a wider road).\n- k-NN and k-means: “nearest” = smallest distance $\\|a - b\\|$.\n- Kernels: everything is built from dot products.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Vector = list. Dot product = multiply pairs and add (gives one score). $\\|w\\|$ = length by Pythagoras. Distance = length of the difference.**",
        },
      ],
    },
    {
      id: "matrices",
      heading: "Lesson 3: Matrices: transpose, multiply, inverse",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "A **matrix** is a **table** of numbers, like a spreadsheet: one row per example, one column per feature. The ML convention adds a first column of **1s** (it multiplies the intercept).\n- **Transpose $X^T$:** flip the table, so rows become columns.\n- **Multiply:** each answer cell = (a row of the first) · (a column of the second), a dot product.\n- **Inverse $A^{-1}$:** the matrix version of “divide by A”. $A \\cdot A^{-1}$ = identity (the matrix version of 1).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "2 × 2 inverse: the only one you'll do by hand",
          text: "$$\\begin{bmatrix}a & b\\\\c & d\\end{bmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{bmatrix}d & -b\\\\-c & a\\end{bmatrix}$$\n**Swap** the diagonal, **negate** the off-diagonal, **divide** by the determinant (ad − bc). If ad − bc = 0 there's no inverse.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked: XᵀX for three houses",
          text: "Sizes 1, 2, 3 with the 1s column: X rows (1, 1), (1, 2), (1, 3).\n$X^T X = [[1 + 1 + 1, 1 + 2 + 3], [1 + 2 + 3, 1 + 4 + 9]] = [[3, 6], [6, 14]]$. Determinant = $3 \\cdot 14 - 6 \\cdot 6 = 6$.\nInverse = (1/6)[[14, −6], [−6, 3]] = [[2.333, −1], [−1, 0.5]].",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Matrix = table. ᵀ = flip. Multiply = row · column. $2 \\times 2$ inverse = swap, negate, divide by ad − bc.**",
        },
      ],
    },
    {
      id: "slope",
      heading: "Lesson 4: Slope, derivative and the bottom of a bowl",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "A **derivative** answers one question: **“If I nudge the input a tiny bit, how much does the output change?”** It is the **steepness** of the curve at that spot.\n- Positive derivative: going uphill to the right.\n- Negative: going downhill to the right.\n- **Zero: flat ground, the top of a hill or the bottom of a valley.**\n\nML lives on this idea: the cost $J(\\theta)$ is a valley, and we want its bottom, where the slope is zero.",
        },
        {
          type: "table",
          caption: "The only derivative rules you need",
          head: ["Function", "Derivative", "Example"],
          rows: [
            ["$c$ (a constant)", "0", "5 → 0"],
            ["$x^n$", "$nx^{n-1}$", "$x^2$ → 2x; $x^3$ → $3 x^2$"],
            ["$ax + b$", "$a$", "3x + 2 → 3"],
            ["$(ax - b)^2$", "$2a(ax - b)$ (chain rule)", "$(2 x - 4)^2$ → $4 (2 x - 4)$"],
            ["$e^x$", "$e^x$", ""],
            ["$\\ln x$", "$1/x$", ""],
            ["sigmoid $\\sigma(z)$", "$\\sigma(z)(1 - \\sigma(z))$", "$\\sigma = 0.6$ → 0.24"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Find a minimum",
          text: "$f(x) = x^2 - 4 x + 3$. Slope $f'(x) = 2 x - 4$. Flat where $2 x - 4 = 0$ → **x = 2**. Is it a valley or a hill? The second derivative f″ = 2 > 0 → a valley (bowl opening up). Minimum value $f(2)$ = −1.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Derivative = steepness. Zero = flat = top or bottom. Second derivative > 0 = bowl (minimum).** Chain rule: derivative of the outside × derivative of the inside.",
        },
      ],
    },
    {
      id: "gradient",
      heading: "Lesson 5: Partial derivatives and the gradient",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "When the cost depends on **several knobs** ($\\theta_0$, $\\theta_1$, $\\theta_2$…), we ask the steepness question **one knob at a time**, holding the others still. That's a **partial derivative**, written with a curly ∂: $\\frac{\\partial J}{\\partial \\theta_1}$ = “how fast J changes if I turn only knob $\\theta_1$”.\n\nPut all of them in a list and you get the **gradient** $\\nabla J$ (“nabla J”): an arrow pointing **uphill**, steepest direction first. Gradient descent steps the **opposite** way, downhill.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked",
          text: "J(a, b) = a² + 3ab. $\\partial J/\\partial a = 2 a + 3 b$ (treat b as a constant). $\\partial J/\\partial b = 3 a$ (treat a as a constant). At $(a, b) = (1, 2)$: gradient = (8, 3). One gradient-descent step with $\\alpha = 0.1$: $(1, 2) - 0.1 (8, 3)$ = **(0.2, 1.7)**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**∂ = “change just this one knob”. Gradient = the list of all of them = the uphill arrow. Gradient descent: knobs := knobs − $\\alpha$ × gradient.**",
        },
      ],
    },
    {
      id: "explog",
      heading: "Lesson 6: e, exponentials and logarithms",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "- **e ≈ 2.718** is just a special number, like $\\pi$.\n- **eˣ** grows fast for positive x and shrinks towards 0 for negative x: $e^0 = 1$, $e^1 = 2.718$, $e^{-1} = 0.368$, $e^{-5} = 0.0067$.\n- A **log** undoes a power. $\\log_2(8) = 3$ because $2^3 = 8$; it answers “how many times do I multiply 2 to get 8?”. **ln** is log base e.\n- Logs turn **multiplying into adding** and **squash huge numbers**: $\\ln(100, 000) \\approx 11.5$. That's why skewed incomes get log-transformed.",
        },
        {
          type: "table",
          caption: "Values worth knowing",
          head: ["Expression", "Value", "Where it appears"],
          rows: [
            ["$\\log_2 1$", "0", "entropy of a pure node"],
            ["$\\log_2 \\frac{1}{2}$", "−1", "entropy of a 50/50 node = 1"],
            ["$\\log_2 x$", "= ln x / ln 2", "calculator trick"],
            ["$\\frac{1}{1 + e^{0}}$", "0.5", "sigmoid at $z = 0$"],
            ["$e^{-1}$", "0.368", "bootstrap: $1 - e^{-1} \\approx 63\\%$"],
            ["$\\ln(1/x) = -\\ln x$", "", "why log-loss has a minus sign"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**e ≈ 2.718; $e^{-z}$ is tiny for big z. log undoes a power; $\\log_2$ counts halvings (bits). log of a fraction is negative → that's why entropy and log-loss carry a minus sign.**",
        },
      ],
    },
    {
      id: "prob",
      heading: "Lesson 7: Probability and odds in five minutes",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "- **P(A)** = how often A happens, from 0 (never) to 1 (always). 30 of 100 emails are spam → P(spam) = 0.3.\n- **P(A | B)** “A given B” = how often A happens **among the cases where B happened**. Of the 40 emails containing “free”, 30 are spam → P(spam | “free”) = 0.75.\n- **Odds** = $P/(1 - P)$. $P = 0.75$ → odds = 3, i.e. “3 to 1”.\n- **Log-odds (logit)** = $\\ln(\\text{odds})$. Logistic regression models the log-odds as a straight line, so each weight shifts the log-odds, which **multiplies the odds by e^weight**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**P = fraction of the time. $P(A \\mid B)$ = fraction within B. Odds = $P/(1 - P)$. Logistic weight $\\theta$ → $\\text{odds} \\times e^{\\theta}$.**",
        },
      ],
    },
    {
      id: "argmin",
      heading: "Lesson 8: argmin, argmax, sign and absolute value",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Symbol", "Means", "Example"],
          rows: [
            ["$\\min_x f(x)$", "the **smallest value** of f", "min of (5, 2, 7) = 2"],
            ["$\\arg\\min_x f(x)$", "**which x** gives the smallest value", "argmin of (5, 2, 7) = position 2"],
            ["$\\arg\\max$", "which option gives the biggest value", "Naïve Bayes picks the class with the largest score"],
            ["$\\text{sign}(z)$", "+1 if $z > 0$, −1 if $z < 0$, 0 if $z = 0$", "SVM and perceptron decisions"],
            ["$|z|$", "size without sign", "|−3| = 3 (Manhattan distance, lasso)"],
            ["$1(\\text{condition})$", "1 if true, 0 if false", "counting mistakes in AdaBoost"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**min = the value; argmin = the winner (where it happens).** k-means E-step: assign each point to argmin distance. Classifiers: predict argmax score.",
        },
      ],
    },
    {
      id: "lagrange",
      heading: "Lesson 9: Optimising with rules: Lagrange multipliers (no heavy maths)",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "Sometimes we want the best value **while obeying rules**. Example: “build the widest road (SVM) but every house must stay off the road.”\n\nThe Lagrange trick turns each rule into a **penalty with its own price tag $\\alpha$**:\n- A rule that is **comfortably obeyed** (a house far from the road) doesn't constrain anything → its price **α = 0**.\n- A rule that is **just barely obeyed** (a house touching the road's edge) is what's actually holding us back → it gets a **positive price $\\alpha > 0$**.\n\nThat's exactly why, in an SVM, **only the support vectors have $\\alpha \\ne 0$**: they are the rules that bind. Solving for the $\\alpha$'s (the “dual problem”) then gives $w = \\sum \\alpha_i y_i x_i$.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Lagrange multiplier = the price of a rule. Rules that don't bind cost 0; rules that bind (support vectors) have $\\alpha > 0$.** You need the idea, not the derivation.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      head: ["Symbol", "Plain English"],
      rows: [
        ["Σ", "add up"], ["$\\hat{x}$, $\\bar{x}$", "guess, average"], ["$w^T x = w \\cdot x$", "multiply pairs and add → one score"], ["$\\|w\\|$", "length (Pythagoras)"],
        ["$X^T$, $X^{-1}$", "flip the table, “divide by” the table"], ["$f'$, $\\partial J/\\partial \\theta$", "steepness (for one knob)"], ["$\\nabla J$", "uphill arrow; step the opposite way"],
        ["$e^x$, ln, $\\log_2$", "growth, undo growth, count halvings"], ["$P(A \\mid B)$", "fraction of A within B"], ["argmin", "which option gives the minimum"], ["$\\alpha$ (Lagrange)", "price of a binding rule"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Use this page",
      text: "Stuck on a symbol in any lesson? Find it in the table above, read it aloud in English, then reread the formula.",
    },
  ],

  glossary: [
    ["Vector", "", "A list of numbers describing one thing"],
    ["Dot product", "$w \\cdot x$, $w^T x$", "Multiply matching entries and add"],
    ["Norm", "$\\|w\\|$", "Length of a vector"],
    ["Matrix", "", "A table of numbers"],
    ["Transpose", "ᵀ", "Swap rows and columns"],
    ["Inverse", "⁻¹", "The matrix that undoes multiplication"],
    ["Determinant", "ad − bc", "Number deciding whether an inverse exists"],
    ["Derivative", "$f'$, d/dx", "Steepness / rate of change"],
    ["Partial derivative", "∂", "Rate of change in one variable, others fixed"],
    ["Gradient", "∇", "List of partial derivatives; points uphill"],
    ["Exponential", "$e^x$", "$e \\approx 2.718$ raised to a power"],
    ["Logarithm", "ln, $\\log_2$", "Inverse of a power"],
    ["Odds", "", "$P/(1 - P)$"],
    ["argmin / argmax", "", "The input that gives the minimum / maximum"],
    ["Lagrange multiplier", "$\\alpha$, $\\lambda$", "Price attached to a constraint"],
  ],

  examTips: [
    "Before a numerical, write each symbol's meaning in words in the margin. It prevents most sign and index mistakes.",
    "For $\\log_2$ on a calculator: $\\ln(x)/\\ln(2)$.",
    "Check a hand-computed matrix inverse by multiplying back: you should get [[1, 0], [0, 1]].",
  ],

  problems: [
    {
      title: "Read and compute a sum",
      level: "Easy",
      question: "For $y = (2, 4, 5)$ and predictions ŷ = (1, 4, 7), compute $\\frac{1}{n}\\sum(\\hat y_i - y_i)^2$.",
      solution: "Differences: −1, 0, 2 → squares 1, 0, 4 → sum 5 → divide by $n = 3$ → **1.667**.",
    },
    {
      title: "Dot product and length",
      level: "Easy",
      question: "w = (2, −1, 3), $x = (1, 4, 2)$. Compute $w \\cdot x$, $\\|w\\|$ and the distance between w and x.",
      solution: "$w \\cdot x = 2 - 4 + 6$ = **4**. $\\|w\\| = \\sqrt{4 + 1 + 9} = \\sqrt{14}$ = **3.742**. $w - x$ = (1, −5, 1) → $\\sqrt{1 + 25 + 1} = \\sqrt{27}$ = **5.196**.",
    },
    {
      title: "Inverse of a 2×2",
      level: "Medium",
      question: "Invert $A = [[5, 15], [15, 55]]$ and check.",
      solution: "det = $275 - 225 = 50$. $A^{-1} = (1/50)$[[55, −15], [−15, 5]] = **[[1.1, −0.3], [−0.3, 0.1]]**. Check the first row times the first column: 5(1.1) + 15(−0.3) = $5.5 - 4.5 = 1$ ✓.",
    },
    {
      title: "Partial derivatives and one step",
      level: "Medium",
      question: "$J(\\theta_0, \\theta_1) = (\\theta_0 + 2 \\theta_1 - 4)^2$. Find both partial derivatives at (0, 0) and take one gradient step with $\\alpha = 0.1$.",
      solution: "Chain rule: $\\partial J/\\partial \\theta_0 = 2 (\\theta_0 + 2 \\theta_1 - 4) \\cdot 1$, $\\partial J/\\partial \\theta_1 = 2 (\\theta_0 + 2 \\theta_1 - 4) \\cdot 2$. At (0, 0): (−8, −16). Step: $(0, 0) - 0.1$(−8, −16) = **(0.8, 1.6)**. J falls from 16 to $(0.8 + 3.2 - 4)^2$ = **0**.",
    },
    {
      title: "Logs and the sigmoid",
      level: "Easy",
      question: "Compute $\\log_2(0.25)$, −$0.5 \\cdot \\log_2(0.5) - 0.5 \\cdot \\log_2(0.5)$, and $\\sigma(2) = 1/(1 + e^{-2})$.",
      solution: "$\\log_2(0.25)$ = **−2**. The entropy expression = 0.5 + 0.5 = **1**. $e^{-2} = 0.135$ → $\\sigma(2) = 1/1.135$ = **0.881**.",
    },
    {
      title: "Odds",
      level: "Easy",
      question: "P(approved) = 0.8. What are the odds and log-odds? If a weight is 0.7, by what factor do the odds change per unit?",
      solution: "Odds = 0.8/0.2 = **4**; log-odds = ln 4 = **1.386**. $e^{0.7}$ = **2.01**: the odds roughly double per unit.",
    },
  ],

  theory: [
    {
      title: "Why logs in ML?",
      level: "Easy",
      question: "Give three places logs appear in ML and why.",
      solution: "Entropy (−$\\sum p$ $\\log_2 p$ measures surprise in bits); log-loss (−log p heavily punishes confident mistakes and makes the logistic cost convex); log-transforming skewed features (squashes huge values, reduces the pull of outliers). Logs also turn products of probabilities (Naïve Bayes) into sums, which avoids tiny numbers.",
    },
    {
      title: "Gradient in one sentence",
      level: "Easy",
      question: "What does the gradient tell you, and why does gradient descent subtract it?",
      solution: "The gradient lists how fast the cost rises when each parameter is nudged; together it points in the direction of steepest increase. Subtracting it (times a small step $\\alpha$) moves the parameters downhill, reducing the cost.",
    },
  ],

  quiz: [
    { topic: "Notation", q: "$\\bar{x}$ means…", options: ["The predicted x", "The average of x", "The largest x", "x squared"], answer: 1, why: "Bar = mean.", wrong: ["That's x-hat.", null, "No.", "No."] },
    { topic: "Notation", q: "$x^{(3)}$ in ML usually means…", options: ["x cubed", "The 3rd training example", "3 times x", "The 3rd feature"], answer: 1, why: "Brackets mark a label, not a power.", wrong: ["Brackets mean it's a label.", null, "No.", "Features use subscripts: $x_3$."] },
    { topic: "Vectors", type: "num", q: "$w = (3, 4)$. $\\|w\\|$ = ?", answer: 5, tol: 0, why: "$\\sqrt{9 + 16}$." },
    { topic: "Vectors", type: "num", q: "(2, 1)·(3, −4) = ?", answer: 2, tol: 0, why: "$6 - 4$." },
    { topic: "Matrices", type: "num", q: "Determinant of [[3, 6], [6, 14]]?", answer: 6, tol: 0, why: "$42 - 36$." },
    { topic: "Calculus", type: "num", q: "Derivative of $x^2 - 4 x + 3$ at $x = 5$?", answer: 6, tol: 0, why: "$2 x - 4 = 6$." },
    { topic: "Calculus", q: "At the bottom of a bowl-shaped cost curve the derivative is…", options: ["Positive", "Negative", "Zero", "Infinite"], answer: 2, why: "Flat ground.", wrong: ["That's to the right of the bottom.", "That's to the left.", null, "No."] },
    { topic: "Calculus", q: "Gradient descent moves the parameters…", options: ["Along the gradient (uphill)", "Opposite to the gradient (downhill)", "Randomly", "To zero"], answer: 1, why: "$\\theta$ := $\\theta - \\alpha$$\\nabla J$.", wrong: ["That's ascent.", null, "No.", "No."] },
    { topic: "Logs", type: "num", q: "$\\log_2(8)$ = ?", answer: 3, tol: 0, why: "$2^3 = 8$." },
    { topic: "Logs", type: "num", q: "Sigmoid at $z = 0$?", answer: 0.5, tol: 0.001, why: "1/(1 + 1)." },
    { topic: "Probability", type: "num", q: "$P = 0.75$. Odds = ?", answer: 3, tol: 0.001, why: "0.75/0.25." },
    { topic: "argmin", q: "argmin over k of distances (4.2, 1.7, 3.0) is…", options: ["1.7", "Position 2 (the second centre)", "4.2", "Position 1"], answer: 1, why: "argmin returns *which*, not the value.", wrong: ["That's min.", null, "That's max.", "No."] },
    { topic: "Lagrange", q: "In an SVM, which points have Lagrange multiplier $\\alpha > 0$?", options: ["All points", "Support vectors (binding rules)", "Misclassified points only", "None"], answer: 1, why: "Non-binding rules cost nothing.", wrong: ["Most points have $\\alpha = 0$.", null, "Not exactly.", "No."] },
  ],
};
