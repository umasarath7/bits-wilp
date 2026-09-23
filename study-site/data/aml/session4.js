// AML — Contact Session 4: Linear Regression
// Source: CourseFiles/AML/ContactSession4-LinearRegression.pptx (77 slides; most equations are images)

export default {
  title: "Linear Regression",
  source: "ContactSession4-LinearRegression.pptx · 77 slides",
  overview:
    "Starting from polynomial curve fitting (error function, model order M, bias–variance trade-off, overfitting and regularisation), the session builds linear regression: hypothesis $h_\\theta(x)=\\theta_0+\\theta_1x$, squared-error cost $J(\\theta)$, closed-form OLS, gradient descent (learning rate, convergence, batch/stochastic/mini-batch), multivariate regression, basis functions (generalised linear models) and regularised regression.",

  summary: [
    {
      id: "curve",
      heading: "1. Polynomial curve fitting",
      slides: "2–7",
      blocks: [
        { type: "p", text: "Fit $N$ noisy training points $(x_n, t_n)$ with a polynomial of order $M$:" },
        { type: "p", text: "$$y(x,\\mathbf w) = w_0 + w_1x + w_2x^2 + \\dots + w_Mx^M = \\sum_{j=0}^{M} w_j x^j$$" },
        { type: "p", text: "It is **non-linear in x but linear in the coefficients w**, so it is still a *linear model*. The coefficients are found by minimising the **sum-of-squares error**:" },
        { type: "p", text: "$$E(\\mathbf w) = \\frac12\\sum_{n=1}^{N}\\big(y(x_n,\\mathbf w) - t_n\\big)^2$$" },
        {
          type: "table",
          caption: "Different hypotheses (model order M)",
          head: ["M", "Fit", "Diagnosis"],
          rows: [
            ["0, 1", "Constant / straight line: misses the curve", "**Underfitting**, high bias"],
            ["3", "Follows the underlying sine-like curve", "Good fit"],
            ["9 (with N = 10)", "Passes through **every** point, $E = 0$, wild oscillations", "**Overfitting**, high variance; coefficients become huge"],
          ],
        },
      ],
    },
    {
      id: "bv",
      heading: "2. Bias–variance trade-off",
      slides: "8–10",
      blocks: [
        {
          type: "table",
          head: ["", "Bias", "Variance"],
          rows: [
            ["Meaning", "Error from wrong **assumptions**: the model class can't represent the true function", "Error from **sensitivity** to the particular training sample"],
            ["Caused by", "Too simple / rigid a model", "Too complex / flexible a model"],
            ["Leads to", "**Underfitting**", "**Overfitting** (learns the noise)"],
            ["As model order ↑", "↓ decreases", "↑ increases"],
          ],
        },
        { type: "list", items: [
          "As the order of the polynomial increases, small changes in the dataset cause greater changes in the fitted polynomial, so **variance increases**. On average, the complex model fits the underlying function better, so **bias decreases**.",
          "A simple model changes little when the training data changes (**low variance**), but assumes more and may fail if the truth is complex (**high bias**).",
          "**Optimal model = best trade-off**, i.e. the one that minimises total error ≈ bias² + variance + noise.",
        ]},
        {
          type: "callout",
          kind: "exam",
          title: "Revision-deck favourite",
          text: "Three decision boundaries: a straight line, a smooth curve and a very wiggly curve. **Leftmost (line):** high robustness, poorest fit, **high bias, low variance**. **Rightmost (wiggly):** highest fit, poor robustness, **low bias, high variance**.",
        },
      ],
    },
    {
      id: "reg",
      heading: "3. Regularisation",
      slides: "11–14, 58–66",
      blocks: [
        { type: "p", text: "Add a penalty that discourages large coefficients:" },
        { type: "p", text: "$$\\tilde E(\\mathbf w) = \\frac12\\sum_{n=1}^N\\big(y(x_n,\\mathbf w)-t_n\\big)^2 + \\frac{\\lambda}{2}\\|\\mathbf w\\|^2, \\qquad \\|\\mathbf w\\|^2 = w_0^2 + w_1^2+\\dots+w_M^2$$" },
        { type: "p", text: "In words: **augmented error = error on data + λ · model complexity**. λ controls the relative importance of the penalty." },
        { type: "list", items: [
          "**λ = 0:** no regularisation, so M = 9 overfits.",
          "**Moderate λ (e.g. ln λ = −18):** M = 9 behaves like a smooth curve with a good fit.",
          "**Very large λ:** all weights are pushed toward 0, so the fit is flat and underfits (high bias).",
          "**Why large λ gives simpler hypotheses:** minimising the cost forces the $\\theta_j$ to be small. Small higher-order coefficients make those terms negligible, so the curve is effectively lower-order and smoother.",
          "In linear-regression notation: $J(\\theta)=\\frac{1}{2m}\\Big[\\sum_i (h_\\theta(x^{(i)})-y^{(i)})^2 + \\lambda\\sum_{j=1}^n\\theta_j^2\\Big]$. By convention $\\theta_0$ is **not** regularised.",
        ]},
      ],
    },
    {
      id: "lr",
      heading: "4. Linear regression: OLS and the cost function",
      slides: "15–27",
      blocks: [
        { type: "p", text: "**Regression** predicts a numerical dependent variable $Y$ from one or more independent variables (predictors) $X$: $Y = f(X)$. Examples: real-estate prices, retail demand, weather." },
        { type: "p", text: "**Approaches:** Ordinary Least Squares (closed form), Gradient Descent (iterative), Bayesian (parameterised $P(Y|X;\\theta)$, fitted by MLE or MAP)." },
        { type: "p", text: "**Hypothesis:** $h_\\theta(x) = \\theta_0 + \\theta_1x$ (the slides also write it as $y = mx + b$)." },
        { type: "p", text: "**Cost (squared error):** $$J(\\theta_0,\\theta_1) = \\frac{1}{2m}\\sum_{i=1}^m\\big(h_\\theta(x^{(i)}) - y^{(i)}\\big)^2$$" },
        {
          type: "callout",
          kind: "tip",
          title: "OLS closed form (single feature): memorise this",
          text: "$$m = \\theta_1 = \\frac{\\sum (x_i-\\bar x)(y_i-\\bar y)}{\\sum (x_i-\\bar x)^2} = \\frac{n\\sum x_iy_i - \\sum x_i\\sum y_i}{n\\sum x_i^2 - (\\sum x_i)^2}, \\qquad b = \\theta_0 = \\bar y - m\\bar x$$",
        },
        { type: "list", items: [
          "For fixed θ, $h_\\theta(x)$ is a function of x. $J(\\theta)$ is a function of the **parameters**. Different θ give different hypotheses and different costs.",
          "Plotting $J(\\theta_0,\\theta_1)$ gives a **bowl-shaped (convex)** surface with a single global minimum.",
          "**Contour plot:** each ellipse is a set of $(\\theta_0,\\theta_1)$ with the same J. The centre is the minimum.",
          "**Error measures:** absolute error $|h(x)-y|$ and squared error $(h(x)-y)^2$. Squared error is differentiable and penalises large errors more.",
        ]},
      ],
    },
    {
      id: "gd",
      heading: "5. Gradient descent",
      slides: "28–45",
      blocks: [
        { type: "p", text: "Start with some θ and repeatedly step **downhill** until convergence:" },
        { type: "p", text: "$$\\theta_j := \\theta_j - \\alpha\\,\\frac{\\partial}{\\partial\\theta_j}J(\\theta) \\quad\\text{(simultaneous update for all } j)$$" },
        { type: "p", text: "For linear regression: $$\\theta_0 := \\theta_0 - \\alpha\\frac1m\\sum_{i}(h_\\theta(x^{(i)})-y^{(i)}), \\qquad \\theta_1 := \\theta_1 - \\alpha\\frac1m\\sum_{i}(h_\\theta(x^{(i)})-y^{(i)})\\,x^{(i)}$$" },
        {
          type: "table",
          caption: "Intuitions (slide 33)",
          head: ["Situation", "What happens"],
          rows: [
            ["α too small", "Converges, but **slowly**"],
            ["α too large", "Overshoots the minimum; may **oscillate or diverge**"],
            ["Already at a (local) minimum", "Gradient = 0, so θ stays unchanged"],
            ["Near the minimum with a fixed α", "Steps shrink automatically because the gradient shrinks"],
          ],
        },
        {
          type: "table",
          caption: "Gradient-descent variants",
          head: ["Variant", "Gradient computed from", "Trade-off"],
          rows: [
            ["**Batch GD**", "All m samples per update", "Stable, but slow for huge data"],
            ["**Stochastic GD**", "One sample per update", "Fast, noisy; progress from the first sample"],
            ["**Mini-batch GD**", "A small group per update", "The practical middle ground; vectorises well"],
          ],
        },
        { type: "p", text: "The squared-error cost of linear regression is **convex**, so GD (with a suitable α) reaches the **global** minimum." },
      ],
    },
    {
      id: "multi",
      heading: "6. Multivariate regression & basis functions",
      slides: "46–57, 67–76",
      blocks: [
        { type: "p", text: "**Features** $x_1,\\dots,x_n$ (e.g. size, rooms, floors, age → price). $x^{(i)}_j$ = value of feature $j$ in example $i$." },
        { type: "p", text: "$$h_\\theta(x) = \\theta_0 + \\theta_1x_1 + \\dots + \\theta_nx_n = \\theta^Tx \\quad (x_0 = 1)$$" },
        { type: "p", text: "**Update:** $\\theta_j := \\theta_j - \\alpha\\frac1m\\sum_i(h_\\theta(x^{(i)})-y^{(i)})\\,x^{(i)}_j$ for $j = 0..n$." },
        { type: "list", items: [
          "**Feature scaling / mean normalisation** (e.g. $x_j \\leftarrow (x_j-\\mu_j)/s_j$) makes the contours round, so GD converges much faster. Unscaled features (BMI ≈ 30, blood pressure ≈ 100) can make GD diverge.",
          "**Normal equation** (self study, the vectorised closed form): $\\theta = (X^TX)^{-1}X^Ty$. No α and no iterations, but it costs $O(n^3)$ to invert and fails if $X^TX$ is singular.",
          "**Regularised normal equation:** $\\theta = (X^TX + \\lambda I')^{-1}X^Ty$, where $I'$ has 0 in the bias position.",
          "**Generalised linear models (basis functions):** $y = \\sum_j w_j\\phi_j(x)$ with polynomial ($x^j$), Gaussian ($\\exp(-\\frac{(x-\\mu_j)^2}{2s^2})$) or sigmoidal basis functions. Still linear in w, so the same machinery applies.",
          "**GD with regularisation:** $\\theta_j := \\theta_j(1-\\alpha\\frac{\\lambda}{m}) - \\alpha\\frac1m\\sum_i(h_\\theta(x^{(i)})-y^{(i)})x^{(i)}_j$ for $j\\ge1$ (**weight decay**).",
        ]},
        {
          type: "table",
          caption: "Regression metrics (SVM deck, slide 35)",
          head: ["Metric", "Formula"],
          rows: [
            ["MAE", "$\\frac1m\\sum|y_i-\\hat y_i|$"],
            ["MSE", "$\\frac1m\\sum(y_i-\\hat y_i)^2$"],
            ["RMSE", "$\\sqrt{\\text{MSE}}$"],
            ["R²", "$1 - \\frac{\\sum(y_i-\\hat y_i)^2}{\\sum(y_i-\\bar y)^2}$"],
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["Hypothesis", "$h_\\theta(x)=\\theta^Tx$."],
    ["Cost J(θ)", "$\\frac{1}{2m}\\sum(h_\\theta(x)-y)^2$ (half the MSE)."],
    ["OLS", "Closed-form least-squares solution."],
    ["Gradient descent", "Iteratively step against the gradient, scaled by the learning rate α."],
    ["Learning rate α", "Step size: too small is slow, too big diverges."],
    ["Convex", "Bowl-shaped cost with one global minimum."],
    ["Bias", "Error from overly simple assumptions (underfitting)."],
    ["Variance", "Sensitivity to the training sample (overfitting)."],
    ["Regularisation (λ)", "Penalty $\\lambda\\|w\\|^2$ that shrinks the weights."],
    ["Normal equation", "$\\theta=(X^TX)^{-1}X^Ty$."],
    ["Basis function", "$\\phi_j(x)$ used to make a linear model fit non-linear data."],
    ["Feature scaling", "Bring features to similar ranges for faster GD."],
  ],

  examTips: [
    "**PYQ Q4 and revision Q2** are both *simple linear regression by least squares → predict → MSE*. Build a table with columns $x, y, x-\\bar x, y-\\bar y$, product, square. It is fast and earns method marks.",
    "Gradient-descent questions (revision deck): write the hypothesis, compute each **error** $h(x)-y$, then each gradient $\\frac1m\\sum e\\,x_j$, then $\\theta_j - \\alpha\\cdot$gradient. Show the table.",
    "The bias–variance answer must mention **underfitting/overfitting, model complexity, and that the optimum is a trade-off**.",
    "“How does a large λ give a simpler hypothesis?” → the penalty forces the $\\theta_j$ toward 0, so the high-order terms vanish and the curve is smoother.",
  ],

  problems: [
    {
      title: "Least-squares line, prediction and MSE",
      pyq: "Midsem Q4: slope/intercept, predict at 3.5, MSE",
      level: "Easy",
      marks: 5,
      question: `Sales (units) vs advertising spend (in thousands):

| Spend x | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Sales y | 6 | 8 | 11 | 13 | 16 |

(a) Find the slope m and intercept b of $y = mx + b$. (b) Predict sales for x = 3.5. (c) Compute the MSE on the data, plus RMSE, MAE and R².`,
      solution: `
$\\bar x = 3$, $\\bar y = 54/5 = 10.8$

| x | y | $x-\\bar x$ | $y-\\bar y$ | product | $(x-\\bar x)^2$ |
|---|---|---|---|---|---|
| 1 | 6 | −2 | −4.8 | 9.6 | 4 |
| 2 | 8 | −1 | −2.8 | 2.8 | 1 |
| 3 | 11 | 0 | 0.2 | 0 | 0 |
| 4 | 13 | 1 | 2.2 | 2.2 | 1 |
| 5 | 16 | 2 | 5.2 | 10.4 | 4 |
| | | | **Σ** | **25** | **10** |

**(a)** $m = 25/10 = $ **2.5**, $b = 10.8 - 2.5 \\times 3 = $ **3.3**, so $\\hat y = 2.5x + 3.3$

**(b)** $\\hat y(3.5) = 8.75 + 3.3 = $ **12.05 units**

**(c)** Predictions: 5.8, 8.3, 10.8, 13.3, 15.8. Residuals: 0.2, −0.3, 0.2, −0.3, 0.2
- MSE $= (0.04+0.09+0.04+0.09+0.04)/5 = 0.30/5 = $ **0.06**
- RMSE $= 0.245$
- MAE $= 1.2/5 = 0.24$
- $R^2 = 1 - 0.30/62.8 = $ **0.995**`,
    },
    {
      title: "House area vs price (revision deck Q2)",
      pyq: "Revision deck Q2",
      level: "Medium",
      marks: 4,
      question: `| Area (m²) | 72 | 50 | 81 | 74 | 94 | 86 |
|---|---|---|---|---|---|---|
| Price (lakh ₹) | 84 | 63 | 77 | 78 | 90 | 75 |

(a) Use least squares to fit Price = $w_0 + w_1\\cdot$Area. (b) Predict the price of an 80 m² house.`,
      solution: `
$\\bar x = 457/6 = 76.167$, $\\bar y = 467/6 = 77.833$

| x | y | $x-\\bar x$ | $y-\\bar y$ | product | sq |
|---|---|---|---|---|---|
| 72 | 84 | −4.167 | 6.167 | −25.69 | 17.36 |
| 50 | 63 | −26.167 | −14.833 | 388.14 | 684.69 |
| 81 | 77 | 4.833 | −0.833 | −4.03 | 23.36 |
| 74 | 78 | −2.167 | 0.167 | −0.36 | 4.69 |
| 94 | 90 | 17.833 | 12.167 | 216.97 | 318.03 |
| 86 | 75 | 9.833 | −2.833 | −27.86 | 96.69 |
| | | | **Σ** | **547.17** | **1144.83** |

**(a)** $w_1 = 547.17/1144.83 = $ **0.478**, $w_0 = 77.833 - 0.478 \\times 76.167 = $ **41.43**
So Price $= 41.43 + 0.478\\,$Area

**(b)** Price(80) $= 41.43 + 0.478 \\times 80 = $ **79.67 lakh**`,
    },
    {
      title: "One iteration of batch gradient descent (1 feature)",
      level: "Medium",
      marks: 4,
      question:
        "Data: (1, 2), (2, 4), (3, 5). Start at $\\theta_0 = \\theta_1 = 0$ with α = 0.1 and cost $J = \\frac{1}{2m}\\sum(h-y)^2$. (a) Do one batch GD update. (b) Compute J before and after. (c) What are the OLS optimum and its cost?",
      solution: `
**(a)** With θ = (0, 0), $h = 0$, so the errors $h - y$ are **−2, −4, −5**.
- $\\partial J/\\partial\\theta_0 = \\frac13(-2-4-5) = -3.667$
- $\\partial J/\\partial\\theta_1 = \\frac13(-2\\cdot1 - 4\\cdot2 - 5\\cdot3) = \\frac{-25}{3} = -8.333$
- $\\theta_0 = 0 - 0.1(-3.667) = $ **0.367**
- $\\theta_1 = 0 - 0.1(-8.333) = $ **0.833**

**(b)**
- $J_\\text{before} = \\frac{1}{6}(4+16+25) = $ **7.5**
- After: predictions 1.2, 2.033, 2.867; errors −0.8, −1.967, −2.133
- $J_\\text{after} = \\frac16(0.64+3.868+4.551) = $ **1.51**, which decreased ✓

**(c)** $\\bar x = 2$, $\\bar y = 3.667$
- $\\theta_1 = \\frac{(-1)(-1.667)+0+(1)(1.333)}{2} = $ **1.5**
- $\\theta_0 = 3.667 - 3 = $ **0.667**
- $J_{\\min} = \\frac16(0.028+0.111+0.028) = $ **0.028**

GD would keep moving toward this point.`,
    },
    {
      title: "Multivariate GD: coronary-heart-disease risk (revision deck)",
      pyq: "Revision deck: first GD iteration, α = 0.02",
      level: "Hard",
      marks: 6,
      question: `RR-CHD (relative risk) is linear in BMI ($x_1$) and diastolic pressure ($x_2$): $y = w_0 + w_1x_1 + w_2x_2$. Start with $w_0 = 5$, $w_1 = w_2 = -0.03$, α = 0.02. Show the first iteration of batch gradient descent.

| Patient | BMI | Diastolic | RR-CHD |
|---|---|---|---|
| 1 | 35 | 80 | 1.81 |
| 2 | 25 | 80 | 1.22 |
| 3 | 30 | 100 | 1.71 |`,
      solution: `
**Predictions and errors** $e = h - y$:

| P | $h = 5 - 0.03x_1 - 0.03x_2$ | y | e | $e\\cdot x_1$ | $e\\cdot x_2$ |
|---|---|---|---|---|---|
| 1 | 5 − 1.05 − 2.4 = 1.55 | 1.81 | −0.26 | −9.1 | −20.8 |
| 2 | 5 − 0.75 − 2.4 = 1.85 | 1.22 | 0.63 | 15.75 | 50.4 |
| 3 | 5 − 0.9 − 3.0 = 1.10 | 1.71 | −0.61 | −18.3 | −61.0 |
| **Σ** | | | **−0.24** | **−11.65** | **−31.4** |

**Gradients** ($\\frac1m\\Sigma$):
- $g_0 = -0.08$
- $g_1 = -3.8833$
- $g_2 = -10.4667$

**Updates** $w_j - \\alpha g_j$:
- $w_0 = 5 - 0.02(-0.08) = $ **5.0016**
- $w_1 = -0.03 - 0.02(-3.8833) = $ **0.0477**
- $w_2 = -0.03 - 0.02(-10.4667) = $ **0.1793**`,
    },
    {
      title: "Same data with stochastic GD: why feature scaling matters",
      level: "Hard",
      marks: 5,
      question:
        "Repeat the RR-CHD problem with **stochastic** GD (update after each patient, in order 1, 2, 3; same α = 0.02 and initial weights). Show all three updates, then comment on the result.",
      solution: `
The SGD update per sample is $w_j \\leftarrow w_j - \\alpha\\,e\\,x_j$ with $x_0 = 1$.

**Patient 1:** $e = -0.26$
- $w_0 = 5 + 0.0052 = 5.0052$
- $w_1 = -0.03 + 0.02(0.26)(35) = 0.152$
- $w_2 = -0.03 + 0.02(0.26)(80) = 0.386$

**Patient 2:** $h = 5.0052 + 0.152(25) + 0.386(80) = 39.69$, so $e = 38.47$
- $w_0 = 4.236$
- $w_1 = 0.152 - 0.02(38.47)(25) = -19.08$
- $w_2 = 0.386 - 0.02(38.47)(80) = -61.16$

**Patient 3:** $h \\approx -6684$, so $e \\approx -6685.7$
- $w_0 \\approx 137.95$
- $w_1 \\approx 3992$
- $w_2 \\approx 13310$

**Comment:** the weights **explode, so SGD diverges**. The features are unscaled (BMI ≈ 30, pressure ≈ 100), so $\\alpha\\,x_j^2 \\gg 1$ and each step overshoots. Batch GD happened to survive one step only because it averages errors of opposite sign.

**Fixes:** standardise the features, $x_j \\leftarrow (x_j-\\mu_j)/\\sigma_j$, and/or use a much smaller α.`,
    },
    {
      title: "Effect of the learning rate",
      level: "Medium",
      marks: 4,
      question:
        "Minimise $J(\\theta) = \\theta^2$ from $\\theta = 1$. Write the GD update, then do 3 iterations for α = 0.1, 0.5, 1.0 and 1.1. Describe each behaviour.",
      solution: `
$J'(\\theta) = 2\\theta$, so $\\theta \\leftarrow \\theta - 2\\alpha\\theta = (1-2\\alpha)\\theta$

| α | factor $1-2\\alpha$ | θ₁, θ₂, θ₃ | Behaviour |
|---|---|---|---|
| 0.1 | 0.8 | 0.8, 0.64, 0.512 | Slow, steady convergence |
| 0.5 | 0 | 0, 0, 0 | Reaches the minimum in one step (lucky, ideal α) |
| 1.0 | −1 | −1, 1, −1 | **Oscillates** forever, never converges |
| 1.1 | −1.2 | −1.2, 1.44, −1.728 | **Diverges** (overshoots more each time) |

**Lesson:** α too small is slow; α too large oscillates or diverges. In practice, plot J against iterations: if J rises, decrease α.`,
    },
    {
      title: "Regularised cost and ridge shrinkage",
      level: "Medium",
      marks: 5,
      question:
        "(a) A model has $\\theta = (0.5, 2, -3)$ and a data cost (sum of squared errors / 2m) of 1.2 with m = 10. With λ = 4, compute $J = \\frac{1}{2m}[\\text{SSE} + \\lambda\\sum_{j\\ge1}\\theta_j^2]$. (b) For a no-intercept model $y = wx$ on data x = (1, 2, 3, 4), y = (2.2, 3.9, 6.1, 8.0), the ridge solution is $w = \\frac{\\sum xy}{\\sum x^2 + \\lambda}$. Compute w for λ = 0, 10, 30 and comment.",
      solution: `
**(a)** The data part is 1.2 (already divided by 2m). Penalty $= \\frac{\\lambda}{2m}\\sum_{j\\ge1}\\theta_j^2 = \\frac{4}{20}(4+9) = 2.6$ ($\\theta_0$ is not penalised).
$J = 1.2 + 2.6 = $ **3.8**

**(b)** $\\sum xy = 2.2+7.8+18.3+32 = 60.3$, $\\sum x^2 = 30$

| λ | w |
|---|---|
| 0 | 60.3/30 = **2.01** (OLS) |
| 10 | 60.3/40 = **1.51** |
| 30 | 60.3/60 = **1.005** |

As λ grows the weight **shrinks toward 0**. Moderate λ reduces variance (less overfitting). Too large a λ makes the model too flat, i.e. **underfitting / high bias**.`,
    },
    {
      title: "Normal equation (vectorised closed form)",
      level: "Hard",
      marks: 5,
      question:
        "Solve the sales data (x = 1..5, y = 6, 8, 11, 13, 16) with $\\theta = (X^TX)^{-1}X^Ty$, where X has a column of ones. Confirm it matches OLS.",
      solution: `
$$X^TX = \\begin{pmatrix} n & \\sum x \\\\ \\sum x & \\sum x^2\\end{pmatrix} = \\begin{pmatrix}5 & 15\\\\15 & 55\\end{pmatrix}, \\quad X^Ty = \\begin{pmatrix}\\sum y\\\\ \\sum xy\\end{pmatrix} = \\begin{pmatrix}54\\\\187\\end{pmatrix}$$
($\\sum xy = 6+16+33+52+80 = 187$)

$\\det = 5\\cdot55 - 15^2 = 50$
$$(X^TX)^{-1} = \\frac{1}{50}\\begin{pmatrix}55 & -15\\\\-15 & 5\\end{pmatrix}$$
$$\\theta = \\frac1{50}\\begin{pmatrix}55\\cdot54 - 15\\cdot187\\\\ -15\\cdot54 + 5\\cdot187\\end{pmatrix} = \\frac{1}{50}\\begin{pmatrix}2970-2805\\\\-810+935\\end{pmatrix} = \\begin{pmatrix}3.3\\\\2.5\\end{pmatrix}$$
This is the same as OLS: $b = 3.3$, $m = 2.5$ ✓. No learning rate and no iterations, but it needs a matrix inverse ($O(n^3)$ in the number of features).`,
    },
    {
      title: "Model order, parameters and overfitting",
      level: "Easy",
      marks: 3,
      question:
        "You fit polynomials of order M = 0, 1, 3, 9 to N = 10 noisy points from a sine curve. (a) How many coefficients does each model have? (b) Which gives zero training error, and why is that bad? (c) Name two ways to use M = 9 safely.",
      solution: `
**(a)** $M+1$ coefficients: **1, 2, 4, 10**

**(b)** **M = 9**: 10 coefficients and 10 points, so it can interpolate every point exactly ($E = 0$). It fits the noise, oscillates wildly between points, and has huge coefficients, so it generalises very badly (**overfitting, high variance**).

**(c)**
1. **Regularisation:** add $\\frac\\lambda2\\|w\\|^2$ with a suitable λ.
2. **More data:** with N = 100 points, M = 9 fits the true curve well.
3. *(Also)* Choose M by validation / cross-validation.`,
    },
  ],

  theory: [
    {
      title: "Bias–variance trade-off",
      pyq: "Midsem Q2(b): “Explain the bias–variance tradeoff. How does it relate to underfitting and overfitting?”",
      marks: 2,
      question: "Explain the bias–variance trade-off. How does it relate to underfitting and overfitting?",
      solution: `
- **Bias:** error from wrong or over-simple assumptions. The model class can't represent the true relationship (e.g. a line for a curve). High bias leads to **underfitting**: high training *and* test error.
- **Variance:** error from sensitivity to the particular training sample. A flexible model changes a lot when the data changes slightly and learns the noise. High variance leads to **overfitting**: low training error, high test error.
- **Trade-off:** as model complexity (e.g. polynomial order) **increases**, bias ↓ and variance ↑. As it **decreases**, bias ↑ and variance ↓. Expected error ≈ bias² + variance + irreducible noise, so the optimal model sits at the complexity that **minimises the total**, found using validation/CV.
- **Controls:** regularisation (λ), model order, more training data (reduces variance).`,
    },
    {
      title: "Robustness vs fit from decision boundaries",
      pyq: "Revision deck Q3",
      marks: 3,
      question: "Three classifiers trained on the same data produce a straight line, a smooth curve and a very wiggly boundary. Which has high robustness and the poorest fit? Which has the highest fit and poor robustness? Relate them to bias and variance.",
      solution: `
- **Straight line (leftmost):** **high robustness, poorest fit**. It misclassifies several training points but would barely change with new data, so **high bias, low variance** (underfitting).
- **Smooth curve (middle):** a good balance; the best candidate to generalise.
- **Wiggly boundary (rightmost):** **highest fit, poorest robustness**. It carves around individual points (noise), so a small change in the data changes it a lot: **low bias, high variance** (overfitting).`,
    },
    {
      title: "What is regularisation and how does λ work?",
      marks: 3,
      question: "What is regularisation? Write the regularised error function. How does a large value of λ result in a simpler hypothesis? What happens if λ is too large?",
      solution: `
**Regularisation** controls overfitting by adding a penalty on large coefficients to the error function:
$$\\tilde E(w) = \\frac12\\sum_n\\big(y(x_n,w)-t_n\\big)^2 + \\frac{\\lambda}{2}\\|w\\|^2$$
i.e. *error on data + λ · model complexity*.

- **Large λ:** to minimise $\\tilde E$, the optimiser must keep $\\|w\\|$ small. The high-order coefficients are pushed near 0, so those terms contribute little and the curve becomes smoother and effectively lower-order: a simpler hypothesis with lower variance.
- **λ too large:** all weights → 0 and the model becomes nearly constant, which underfits (high bias).
- **λ = 0:** the ordinary least-squares fit, which may overfit.
- Choose λ by cross-validation.`,
    },
    {
      title: "OLS vs gradient descent",
      marks: 3,
      question: "Compare solving linear regression by the closed form (OLS / normal equation) and by gradient descent.",
      solution: `
| | OLS / Normal equation | Gradient descent |
|---|---|---|
| Method | $\\theta = (X^TX)^{-1}X^Ty$, one shot | Iterative updates $\\theta_j -= \\alpha\\,\\partial J/\\partial\\theta_j$ |
| Learning rate | Not needed | Must choose α |
| Iterations | None | Many, until convergence |
| Cost | $O(n^3)$ matrix inverse, slow when there are many features | $O(mn)$ per iteration; scales to large n and m |
| Issues | $X^TX$ may be singular (redundant features) | Needs feature scaling; may diverge if α is too big |
| Use when | Few features (up to about 10⁴) | Many features or huge datasets; also works for models with no closed form (logistic regression) |`,
    },
    {
      title: "Gradient descent: learning rate and variants",
      marks: 4,
      question: "Explain gradient descent for linear regression. What happens if α is too small or too large, or θ is already at a minimum? Differentiate batch, stochastic and mini-batch GD.",
      solution: `
- **Idea:** J(θ) is a bowl (convex) for linear regression. Start with any θ and repeatedly step opposite the gradient, $\\theta_j := \\theta_j - \\alpha\\frac1m\\sum_i(h_\\theta(x^{(i)})-y^{(i)})x_j^{(i)}$, updating all $\\theta_j$ **simultaneously**, until the change is tiny.
- **α too small:** tiny steps, very slow convergence. **α too large:** overshoots, J oscillates or increases (diverges). **At a minimum:** the gradient is 0, so θ doesn't change. Steps also shrink naturally near the minimum.
- **Batch GD:** the gradient uses all m samples per update. Accurate and smooth, but slow on big data.
- **Stochastic GD:** updates after each single sample. Fast and makes progress immediately, but noisy (may hover around the minimum).
- **Mini-batch GD:** uses small groups (e.g. 32–256). Balances stability and speed, and makes use of vectorised hardware.`,
    },
    {
      title: "Why is it called a “linear” model?",
      marks: 2,
      question: "A polynomial $y = w_0 + w_1x + w_2x^2 + w_3x^3$ is a curve. Why is it still called a linear (regression) model? What are basis functions?",
      solution: `
- It is **linear in the parameters w**, not necessarily in x. The prediction is a weighted *sum* of fixed functions of x: $y = \\sum_j w_j\\phi_j(x)$ with $\\phi_j(x) = x^j$.
- So the least-squares cost is still quadratic (convex) in w, and the same OLS / normal equation / GD machinery applies.
- **Basis functions** $\\phi_j$ transform the input: polynomial $x^j$, **Gaussian** $\\exp(-(x-\\mu_j)^2/2s^2)$, **sigmoidal** $\\sigma((x-\\mu_j)/s)$. These are *generalised linear models*.`,
    },
  ],

  quiz: [
    { q: "In $y = mx + b$ fitted by least squares, the intercept b equals:", options: ["$\\bar y - m\\bar x$", "$\\bar x - m\\bar y$", "$m\\bar x$", "$\\sum y / \\sum x$"], answer: 0, why: "The OLS line always passes through $(\\bar x, \\bar y)$." },
    { q: "If the learning rate is too large, gradient descent will:", options: ["Converge slowly", "Overshoot and possibly diverge", "Stop immediately", "Find a local minimum faster"], answer: 1, why: "Big steps jump over the minimum." },
    { q: "A polynomial of order M = 9 fitted to 10 points will typically:", options: ["Underfit", "Overfit", "Have high bias", "Have zero variance"], answer: 1, why: "It interpolates the noise: zero training error, poor generalisation." },
    { q: "Increasing λ in ridge regression tends to:", options: ["Increase variance", "Increase bias", "Increase the weights", "Remove the intercept"], answer: 1, why: "Weights shrink, so the model is simpler: bias ↑, variance ↓." },
    { q: "The linear-regression squared-error cost J(θ) is:", options: ["Non-convex with many minima", "Convex (bowl-shaped)", "Always zero", "Linear in θ"], answer: 1, why: "A quadratic in θ, so there is one global minimum." },
    { q: "Stochastic GD computes each update from:", options: ["All samples", "One sample", "A mini-batch", "The normal equation"], answer: 1, why: "SGD uses a single example per step." },
    { q: "The normal equation's main disadvantage is:", options: ["It needs a learning rate", "It needs many iterations", "The $O(n^3)$ matrix inverse for many features", "It can't find the global minimum"], answer: 2, why: "Inverting $X^TX$ is expensive when n is large." },
    { q: "A model with high training error and high test error is:", options: ["Overfitting", "Underfitting", "Well-fitted", "Regularised perfectly"], answer: 1, why: "A too-simple model (high bias)." },
    { q: "Why scale features before gradient descent?", options: ["To reduce bias", "So contours are round and GD converges faster", "It is required by OLS", "To remove outliers"], answer: 1, why: "Unequal scales create elongated contours and zig-zagging or divergence." },
    { q: "Which parameter is usually NOT regularised?", options: ["θ₀", "θ₁", "θ₂", "All are regularised"], answer: 0, why: "The bias/intercept term is conventionally excluded from the penalty." },
  ],
};
