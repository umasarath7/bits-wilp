// AML — Contact Session 4: Linear Regression
// Source: CourseFiles/AML/ContactSession4-LinearRegression.pptx (77 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, then formulas with intuition.

export default {
  title: "Linear Regression",
  source: "ContactSession4-LinearRegression.pptx · 77 slides",
  overview:
    "This is the most examined numerical topic after Naïve Bayes. We'll build it from the very beginning, the way I would in a classroom: **why** we need regression, **why** a straight line, **why** “least squares”, how to measure the fit, **why** machine-learning people use gradient descent instead of the formula, how to handle many features and curves, and finally **why** too flexible a model hurts (bias–variance) and how regularisation tames it. One small running example (hours studied → exam score) carries us through the first half. Every abbreviation is spelled out, and there's a glossary at the end.",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why do we need regression?",
      slides: "15–16",
      blocks: [
        {
          type: "p",
          text: "Imagine you're a teacher and you notice that students who study more hours seem to score higher. You write down data for five students:",
        },
        {
          type: "table",
          caption: "Our running example",
          head: ["Hours studied (x)", "1", "2", "3", "4", "5"],
          rows: [["Exam score (y)", "2", "4", "5", "4", "5"]],
        },
        {
          type: "p",
          text: "A new student says: *“I'm going to study for 6 hours. What score can I expect?”* 6 isn't in your table. How do you answer? You need a **rule** connecting hours to scores, something like *score = something + something × hours*. Once you have the rule, you can plug in any number of hours. **Finding that rule from data is what regression does.**",
        },
        {
          type: "p",
          text: "Slide 16 puts it formally: regression predicts a **numerical** variable. Examples: the value of a flat, next month's demand for a product in a shop, tomorrow's temperature. The variable we predict, **Y**, is the **dependent variable** (or response), because it *depends* on the others. The variables we use, **X**, are the **independent variables** (or predictors), the things we know. Regression finds the relationship $Y = f(X)$.",
        },
        {
          type: "p",
          text: "**Three ways to find f (slide 16):** **Ordinary Least Squares (OLS)**, a direct formula (Lesson 4); **gradient descent**, an iterative search (Lesson 7); and a **Bayesian** approach, which treats the parameters as uncertain and estimates them by Maximum Conditional Likelihood (MCLE) or Maximum A Posteriori (MAP). This course focuses on the first two.",
        },
      ],
    },
    {
      id: "line",
      heading: "Lesson 2: Why a straight line? The hypothesis",
      slides: "17–19",
      blocks: [
        {
          type: "p",
          text: "Plot the five students and the dots go roughly upward from left to right. The simplest shape that captures “goes up steadily” is a **straight line**. We start with a line because it's simple, easy to interpret, and surprisingly often good enough. That's why it's called **linear** regression: *linear* just means *line-shaped*.",
        },
        {
          type: "p",
          text: "You know the equation of a line from school: $y = mx + c$. The slides write it as $y = mx + b$ (slide 17), and in ML we write the same thing as the **hypothesis** (our proposed rule):",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The hypothesis",
          text: "$$h_\\theta(x) = \\theta_0 + \\theta_1 x$$\n\n- $\\theta_0$ (“theta-zero”) is the **intercept**: where the line crosses the y-axis, i.e. the prediction when x = 0. It's the “b” (or “c”) from school.\n- $\\theta_1$ (“theta-one”) is the **slope**: how much the prediction rises when x increases by 1. It's the “m” from school.\n- $h_\\theta(x)$ is the **predicted** value. Sometimes written $\\hat y$ (“y-hat”): the hat means *our guess*, not the real value.",
        },
        {
          type: "p",
          text: "**A subtle but important idea (slide 19).** For a *fixed* choice of $\\theta_0, \\theta_1$, the hypothesis $h_\\theta(x)$ is a function of **x**: it's one particular line. But different choices of θ give different lines, and some fit the data better than others. So “learning” means **searching over θ** for the line that fits best. To do that, we need a way to score how well each line fits.",
        },
      ],
    },
    {
      id: "residual",
      heading: "Lesson 3: Why can't the line pass through every point? Residuals",
      slides: "17",
      blocks: [
        {
          type: "p",
          text: "Real life is messy. Two students who both study 3 hours won't get the same score: one slept badly, one guessed well, one had a headache. **No straight line can go through all the dots.** So we accept that every prediction will be a little off.",
        },
        {
          type: "p",
          text: "That “little off” for each point is called the **residual** (or error): the vertical gap between the dot and the line.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Residual",
          text: "$$e_i = y_i - \\hat y_i \\quad (\\text{actual} - \\text{predicted})$$\n\nIf the dot is **above** the line, the residual is positive: the real score was higher than predicted. If it's **below**, the residual is negative. (In gradient descent we'll write the error the other way round, $h_\\theta(x) - y$; the sign doesn't matter once it's squared.)",
        },
        {
          type: "p",
          text: "Slide 16 names two ways to measure how bad a residual is: the **absolute error** $|y - \\hat y|$ and the **squared error** $(y - \\hat y)^2$. The next lesson explains why we square.",
        },
      ],
    },
    {
      id: "ols",
      heading: "Lesson 4: Why “least squares”? Finding the best line",
      slides: "17, 19–24",
      blocks: [
        {
          type: "p",
          text: "You could draw many lines through the dots. Which one is best? A natural answer: **the line whose mistakes are smallest overall.**",
        },
        {
          type: "p",
          text: "**First idea (doesn't work): add up the residuals.** Positive and negative residuals cancel. A terrible line with residuals of +10 and −10 adds up to 0 and looks perfect.",
        },
        {
          type: "p",
          text: "**Second idea (works): square each residual, then add.** Squaring makes every value positive, so nothing cancels. It also **punishes big mistakes much more than small ones**: a miss of 2 counts as 4, but a miss of 10 counts as 100. So the line is pushed hard to avoid being very wrong anywhere. The total is the **Sum of Squared Errors (SSE)**, and the method of choosing the line with the smallest SSE is **Ordinary Least Squares (OLS)**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The cost function (slide 19 notation)",
          text: "$$J(\\theta_0, \\theta_1) = \\frac{1}{2m} \\sum_{i=1}^{m} \\big( h_\\theta(x^{(i)}) - y^{(i)} \\big)^2$$\n\n- $m$ = number of training examples; $x^{(i)}, y^{(i)}$ = the $i$-th example\n- $\\Sigma$ (capital sigma) = “add all of these up”\n- The $\\frac1m$ makes it an average (the **Mean Squared Error**, MSE). The extra $\\frac12$ is only there to cancel the 2 that appears when we take the derivative later; it doesn't change which line is best.\n\n**Learning = find the $\\theta_0, \\theta_1$ that make J as small as possible.**",
        },
        {
          type: "p",
          text: "**The OLS solution.** Calculus gives exact formulas for the best $\\theta_0$ and $\\theta_1$. You don't need to derive them, but you should understand why they make sense. First, some shorthand: $\\bar x$ (“x-bar”) is the mean of the x values and $\\bar y$ (“y-bar”) is the mean of the y values.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "OLS formulas (memorise these)",
          text: "$$\\theta_1 = \\frac{S_{xy}}{S_{xx}} = \\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2} \\qquad \\theta_0 = \\bar y - \\theta_1 \\bar x$$\n\nEquivalent shortcut (no means needed): $\\theta_1 = \\dfrac{n\\sum x_iy_i - \\sum x_i \\sum y_i}{n\\sum x_i^2 - (\\sum x_i)^2}$",
        },
        {
          type: "p",
          text: "**Why the slope formula makes sense.** For each student, ask two questions: *is this student above or below average in hours?* and *above or below average in score?* If they're above average in both, $(x - \\bar x)$ and $(y - \\bar y)$ are both positive and their product is positive. If below average in both, both are negative, and the product is still positive. If one is above and the other below, the product is negative. So $S_{xy}$, the **sum of cross-products**, measures **how much x and y move together**. $S_{xx}$, the **sum of squares of x**, measures **how spread out x is**. Dividing gives *how much y moves with x, per unit of x's own spread*: exactly what a slope should be.",
        },
        {
          type: "p",
          text: "**Why the intercept formula makes sense.** The best-fit line always **passes through the average point** $(\\bar x, \\bar y)$. That's intuitive: a student with average hours should get a predicted average score. If we know the slope and one point on the line, rearranging $\\bar y = \\theta_0 + \\theta_1 \\bar x$ gives $\\theta_0$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: hours → score",
          text: "**Step 1, the means:** $\\bar x = (1+2+3+4+5)/5 = 3$, $\\bar y = (2+4+5+4+5)/5 = 4$\n\n**Step 2, the table:**\n\n| x | y | $x - \\bar x$ | $y - \\bar y$ | product | $(x - \\bar x)^2$ |\n|---|---|---|---|---|---|\n| 1 | 2 | −2 | −2 | 4 | 4 |\n| 2 | 4 | −1 | 0 | 0 | 1 |\n| 3 | 5 | 0 | 1 | 0 | 0 |\n| 4 | 4 | 1 | 0 | 0 | 1 |\n| 5 | 5 | 2 | 1 | 2 | 4 |\n| | | | **Total** | $S_{xy} = 6$ | $S_{xx} = 10$ |\n\n**Step 3, the slope:** $\\theta_1 = 6/10 = 0.6$\n\n**Step 4, the intercept:** $\\theta_0 = 4 - 0.6 \\times 3 = 2.2$\n\n**The rule:** $\\hat y = 2.2 + 0.6x$. In plain English: *each extra hour of study is linked with about 0.6 more marks, on average.* For the new student: $\\hat y(6) = 2.2 + 0.6 \\times 6 = $ **5.8**.",
        },
        { type: "diagram", name: "s4-residuals" },
      ],
    },
    {
      id: "fit",
      heading: "Lesson 5: How good is our line? MSE, RMSE, MAE and R²",
      slides: "SVM deck 35",
      blocks: [
        {
          type: "p",
          text: "We found the best line, but *best* doesn't mean *good*. If the dots were scattered like confetti there would still be a “best” line, just a useless one. We need a score for how well the line fits.",
        },
        {
          type: "p",
          text: "**The error-based scores.** Using our line, the predictions are 2.8, 3.4, 4.0, 4.6, 5.2 and the residuals are −0.8, 0.6, 1.0, −0.6, −0.2. Squared and added: **SSE = 0.64 + 0.36 + 1 + 0.36 + 0.04 = 2.4**.",
        },
        {
          type: "list",
          items: [
            "**MSE (Mean Squared Error)** = SSE / n = 2.4 / 5 = **0.48**. Average squared miss; in squared units.",
            "**RMSE (Root Mean Square Error)** = √MSE = **0.69**. Back in the original units: *typically off by about 0.7 marks*.",
            "**MAE (Mean Absolute Error)** = average of |residual| = (0.8 + 0.6 + 1 + 0.6 + 0.2)/5 = **0.64**. Less sensitive to outliers (Session 2).",
          ],
        },
        {
          type: "p",
          text: "**R², a score from 0 to 1.** MSE's size depends on the units, so it's hard to say whether 0.48 is good. R² fixes that by comparing our line with the dumbest possible model. Suppose you knew nothing about hours: your best guess for every student would be the average score, $\\bar y = 4$. The total amount you'd be wrong by is the **Total Sum of Squares**, $SST = \\sum (y - \\bar y)^2 = 4 + 0 + 1 + 0 + 1 = 6$. Using the line, you're wrong by only SSE = 2.4. The line has **explained** part of the variation.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "R² (coefficient of determination)",
          text: "$$R^2 = 1 - \\frac{SSE}{SST} = 1 - \\frac{\\sum (y - \\hat y)^2}{\\sum (y - \\bar y)^2}$$\n\n**R² = 1**: the line explains everything (all dots on the line). **R² = 0**: the line is no better than guessing the average.\n\nHere: $R^2 = 1 - 2.4/6 = $ **0.6**. *Hours studied explains 60% of the differences in scores;* the other 40% comes from things we didn't measure (sleep, luck, ability).",
        },
      ],
    },
    {
      id: "bowl",
      heading: "Lesson 6: Picturing the cost: the bowl and the contour plot",
      slides: "19–27",
      blocks: [
        {
          type: "p",
          text: "Here's a helpful way to think about learning. Every pair $(\\theta_0, \\theta_1)$ is a candidate line, and each has a cost $J$. Imagine a map where the east–west position is $\\theta_0$, the north–south position is $\\theta_1$, and the **height** is the cost J. What does that landscape look like?",
        },
        {
          type: "p",
          text: "For linear regression with squared error, it's a **bowl** (slides 20–23). Lines far from the data are high up the sides; the best line sits at the **single lowest point** at the bottom. A bowl-shaped function is called **convex**, and it has an important property: **there's only one minimum, the global one**. No false valleys to get stuck in.",
        },
        {
          type: "p",
          text: "A **contour plot** (slide 24) shows the same bowl from above, like a hiking map. Each ellipse connects the $(\\theta_0, \\theta_1)$ pairs that have the **same cost**. The centre of the smallest ellipse is the minimum. Points on the same ellipse are equally good (or bad) lines, even though they look different.",
        },
        { type: "diagram", name: "s4-bowl" },
        {
          type: "callout",
          kind: "idea",
          title: "Keep two pictures apart",
          text: "**Picture 1: the data plot** (x vs y): one hypothesis is one *line*.\n**Picture 2: the cost plot** ($\\theta_0$ vs $\\theta_1$): one hypothesis is one *point*, and its height is its cost.\nLearning means walking to the lowest point of picture 2.",
        },
      ],
    },
    {
      id: "gd",
      heading: "Lesson 7: Why gradient descent? Walking downhill",
      slides: "28–45",
      blocks: [
        {
          type: "p",
          text: "For one feature, the OLS formula is quick. But with millions of examples and thousands of features, the exact formula gets slow, and many models (like logistic regression in Session 5) have **no formula at all**. So ML uses a general-purpose method: **gradient descent (GD)**.",
        },
        {
          type: "p",
          text: "**The idea.** Imagine standing somewhere on the bowl in thick fog. You can't see the bottom, but you can feel which way the ground slopes under your feet. So you take a small step **downhill**, feel the slope again, take another step, and repeat until the ground is flat. That's gradient descent. The **gradient** is the slope, i.e. the derivative of J with respect to each θ. Stepping **against** the gradient takes you downhill.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The gradient-descent update",
          text: "Repeat until convergence, updating **all** $\\theta_j$ at the same time:\n$$\\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta)$$\n\nFor linear regression, working out the derivative gives:\n$$\\theta_0 := \\theta_0 - \\alpha \\frac1m \\sum_{i} \\big(h_\\theta(x^{(i)}) - y^{(i)}\\big) \\qquad \\theta_1 := \\theta_1 - \\alpha \\frac1m \\sum_{i} \\big(h_\\theta(x^{(i)}) - y^{(i)}\\big) x^{(i)}$$\n\n- $\\alpha$ (“alpha”) is the **learning rate**: the size of each step.\n- $:=$ means “replace with”.\n- $h_\\theta(x) - y$ is the error on each example (predicted − actual).",
        },
        {
          type: "p",
          text: "**Reading the update in plain words.** If the predictions are too high on average (errors positive), the gradient is positive, and subtracting it **lowers** θ₀. If big-x points are predicted too high, the $x^{(i)}$-weighted sum is positive and θ₁ **decreases**, flattening the line. Each step nudges the line toward the dots.",
        },
        {
          type: "p",
          text: "**Simultaneous update.** Compute *all* the new θ values from the *old* ones, then replace them together. If you update θ₀ first and then use the new θ₀ to compute θ₁'s gradient, you're doing something slightly different (and wrong).",
        },
        {
          type: "callout",
          kind: "example",
          title: "One step on our hours data",
          text: "Start at $\\theta_0 = \\theta_1 = 0$ (the flat line $\\hat y = 0$), with α = 0.1.\n\n- Errors $h - y$: −2, −4, −5, −4, −5\n- Gradient for θ₀ = average error = −20/5 = **−4**\n- Gradient for θ₁ = average of error × x = (−2 − 8 − 15 − 16 − 25)/5 = −66/5 = **−13.2**\n- New θ₀ = 0 − 0.1(−4) = **0.4**; new θ₁ = 0 − 0.1(−13.2) = **1.32**\n\nThe cost J drops from **8.6** to **0.82** after this one step. Keep going, and θ creeps toward the OLS answer (2.2, 0.6).",
        },
        {
          type: "p",
          text: "**Intuitions to know (slide 33):**",
        },
        {
          type: "table",
          head: ["Situation", "What happens", "Why"],
          rows: [
            ["**α too small**", "Converges, but very slowly", "Tiny steps: you need thousands of them"],
            ["**α too large**", "Overshoots the minimum; may **oscillate** or **diverge** (cost grows)", "You leap across the valley and land higher on the other side"],
            ["**Already at a minimum**", "θ doesn't change", "The slope is zero, so the step is zero"],
            ["**Getting close to the minimum**", "Steps shrink automatically, even with a fixed α", "The slope gets gentler near the bottom"],
          ],
        },
        { type: "diagram", name: "s4-lr" },
        {
          type: "p",
          text: "**How much data per step? Three variants (slides 36–45, and the revision deck).**",
        },
        {
          type: "list",
          items: [
            "**Batch GD:** each step uses **all m examples** to compute the gradient. Smooth and accurate, but each step is slow on large datasets.",
            "**Stochastic GD (SGD):** each step uses **one example**, updating immediately; the next example uses the already-updated θ. Fast and makes progress at once, but the path is noisy and it can be unstable if α is too big or features aren't scaled.",
            "**Mini-batch GD:** each step uses a **small group** (e.g. 32 examples). The practical middle ground, and it runs efficiently on modern hardware.",
          ],
        },
        {
          type: "p",
          text: "Because the linear-regression cost is a bowl (convex), gradient descent with a sensible α always reaches the **global** minimum.",
        },
      ],
    },
    {
      id: "multi",
      heading: "Lesson 8: What if there are many features? Multivariate regression",
      slides: "46–57, 67–75",
      blocks: [
        {
          type: "p",
          text: "Hours alone explained 60% of the scores. What about sleep, attendance and previous marks? Real outcomes depend on several things. Slide 46's house-price example uses **size, number of rooms, floors and age** to predict price. So we extend the line to **multiple features**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Hypothesis with n features",
          text: "$$h_\\theta(x) = \\theta_0 + \\theta_1 x_1 + \\theta_2 x_2 + \\dots + \\theta_n x_n = \\theta^T x$$\n\n- $n$ = number of features; $x_j^{(i)}$ = value of feature $j$ in example $i$\n- We add a dummy feature $x_0 = 1$ so that $\\theta_0$ fits the same pattern, and then the whole sum is the **dot product** $\\theta^T x$ (θ-transpose-x).\n- Each $\\theta_j$ means: *the change in prediction when $x_j$ goes up by 1, keeping the other features fixed*.\n\nGradient descent is the same as before, for every j from 0 to n:\n$$\\theta_j := \\theta_j - \\alpha \\frac1m \\sum_i \\big(h_\\theta(x^{(i)}) - y^{(i)}\\big) x_j^{(i)}$$",
        },
        {
          type: "p",
          text: "**Feature scaling: why it matters so much.** Suppose one feature is house size (around 1,000–3,000 sq ft) and another is number of bedrooms (1–5). The cost bowl becomes a long, thin, stretched valley: tiny changes in the size weight change the cost enormously, while the bedroom weight barely matters. Gradient descent then zig-zags across the valley and may **diverge**. Rescaling each feature to a similar range, e.g. **mean normalisation** $x_j \\leftarrow (x_j - \\mu_j)/s_j$ (subtract the mean, divide by the standard deviation or range), makes the contours round, so GD heads straight to the bottom. The revision deck's heart-disease example shows this: with BMI ≈ 30 and blood pressure ≈ 100 unscaled, stochastic GD blows up within three steps (Numerical Q5).",
        },
        {
          type: "p",
          text: "**The normal equation (slides 67–75, self study).** OLS extends to many features in matrix form. Stack the examples as rows of a matrix X (with a first column of 1s) and the targets as a vector y. Then:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Normal equation",
          text: "$$\\theta = (X^T X)^{-1} X^T y$$\n\nOne calculation, **no learning rate, no iterations**. The price: inverting $X^TX$ costs roughly $O(n^3)$ in the number of features, which is slow when n is in the tens of thousands, and it fails if $X^TX$ can't be inverted (e.g. two features are exact copies of each other).",
        },
      ],
    },
    {
      id: "curve",
      heading: "Lesson 9: How can a “linear” model fit curves? Polynomial fitting",
      slides: "2–7",
      blocks: [
        {
          type: "p",
          text: "The slides open with a classic example: $N = 10$ noisy points sampled from a sine-shaped curve. A straight line clearly can't follow it. We can fit a **polynomial** of order M instead:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Polynomial curve fitting",
          text: "$$y(x, \\mathbf w) = w_0 + w_1 x + w_2 x^2 + \\dots + w_M x^M = \\sum_{j=0}^{M} w_j x^j$$\n\nThe coefficients are found by minimising the sum-of-squares error\n$$E(\\mathbf w) = \\frac12 \\sum_{n=1}^{N} \\big( y(x_n, \\mathbf w) - t_n \\big)^2$$\nwhere $t_n$ is the target (actual value) for point n.",
        },
        {
          type: "p",
          text: "**Wait, isn't a curve non-linear?** In x, yes. But look at the **coefficients**: the prediction is still just a *weighted sum*, $w_0 \\cdot 1 + w_1 \\cdot x + w_2 \\cdot x^2 + \\dots$. We've simply invented new features ($x^2$, $x^3$, …) and fitted a linear model on them. Because it's **linear in the parameters w**, the same OLS/gradient-descent machinery works unchanged. That's why it's still called a *linear model*.",
        },
        {
          type: "p",
          text: "**Basis functions (slides 67–75).** The same trick works with any fixed transformation $\\phi_j(x)$: $y = \\sum_j w_j \\phi_j(x)$. **Polynomial** basis $\\phi_j(x) = x^j$; **Gaussian** basis $\\phi_j(x) = \\exp\\!\\big(-\\frac{(x - \\mu_j)^2}{2s^2}\\big)$ (little bumps centred at $\\mu_j$); **sigmoidal** basis (S-shaped steps). These are called **generalised linear models**.",
        },
        {
          type: "p",
          text: "**What happens as M grows (slide 6)?**",
        },
        {
          type: "table",
          head: ["Order M", "What the fit looks like", "Diagnosis"],
          rows: [
            ["0 or 1", "A flat line or straight line: misses the wave entirely", "**Underfitting**"],
            ["3", "Follows the underlying sine shape nicely", "**Good fit**"],
            ["9 (with 10 points)", "Passes through **every** point exactly (E = 0) but swings wildly between them; coefficients become huge", "**Overfitting**"],
          ],
        },
        { type: "diagram", name: "s4-poly" },
        {
          type: "p",
          text: "With M = 9 there are 10 coefficients for 10 points, enough to hit every point, including its noise. That's Student A from Session 1 again: perfect on the training data, useless on new data.",
        },
      ],
    },
    {
      id: "bv",
      heading: "Lesson 10: Why does too much flexibility hurt? Bias and variance",
      slides: "8–10",
      blocks: [
        {
          type: "p",
          text: "Lesson 9 showed that a too-simple model and a too-complex model both fail, in opposite ways. **Bias** and **variance** are the names for these two kinds of failure.",
        },
        {
          type: "p",
          text: "**An analogy: archery.** Imagine training the same model on many different samples of data, like shooting many arrows. **Bias** is how far the *average* arrow lands from the bullseye: a consistent, systematic miss. **Variance** is how *scattered* the arrows are: how much the result changes from one sample to the next.",
        },
        { type: "diagram", name: "s4-archery" },
        {
          type: "list",
          items: [
            "**High bias (underfitting):** the model makes **wrong or over-simple assumptions**, so its class of shapes can't represent the truth. A straight line fitted to a sine wave misses in the same way no matter which sample you use. Tightly grouped arrows, all off-target.",
            "**High variance (overfitting):** the model is so flexible that it **learns the noise**. Change a few training points and the M = 9 polynomial changes shape completely. Arrows scattered all over.",
          ],
        },
        {
          type: "p",
          text: "**The trade-off (slides 8–9).** As model complexity (e.g. polynomial order) **increases**, small changes in the data cause bigger changes in the fit, so **variance goes up**; but on average it can follow the true shape better, so **bias goes down**. A **simpler** model changes little between samples (**low variance**) but assumes more and may be too rigid (**high bias**). You can't drive both to zero at once. The best model sits at the complexity where the **total error**, roughly bias² + variance + unavoidable noise, is smallest, and you find it with validation data.",
        },
        {
          type: "table",
          caption: "Summary",
          head: ["", "High bias", "High variance"],
          rows: [
            ["Also called", "Underfitting", "Overfitting"],
            ["Cause", "Too simple / rigid model", "Too complex / flexible model"],
            ["Training error", "High", "Low"],
            ["Test error", "High (close to training)", "High (much higher than training)"],
            ["Fix", "More complex model, more features, less regularisation", "Simpler model, more data, **regularisation**"],
          ],
        },
        {
          type: "p",
          text: "**The revision-deck favourite.** Three classifiers draw a straight line, a smooth curve and a very wiggly boundary. The **straight line** has high robustness but the poorest fit: **high bias, low variance**. The **wiggly** one has the best fit to the training data but poor robustness: **low bias, high variance**. The smooth curve is the balance.",
        },
      ],
    },
    {
      id: "reg",
      heading: "Lesson 11: How do we tame complexity? Regularisation",
      slides: "11–14, 58–66",
      blocks: [
        {
          type: "p",
          text: "We saw that the overfitted M = 9 polynomial has **huge coefficients**: that's how it bends sharply to hit every point. So here's an idea: keep the flexible model, but **charge a penalty for large coefficients**. The model can still bend if the data truly demands it, but not just to chase noise. That's **regularisation** (slide 11).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Regularised error",
          text: "$$\\tilde E(\\mathbf w) = \\frac12 \\sum_{n=1}^{N} \\big( y(x_n, \\mathbf w) - t_n \\big)^2 + \\frac{\\lambda}{2} \\|\\mathbf w\\|^2, \\qquad \\|\\mathbf w\\|^2 = w_0^2 + w_1^2 + \\dots + w_M^2$$\n\nIn words: **augmented error = error on data + λ × model complexity.**\n\n$\\lambda$ (“lambda”) controls how much the penalty matters compared with fitting the data. In the linear-regression notation:\n$$J(\\theta) = \\frac{1}{2m}\\Big[ \\sum_i \\big(h_\\theta(x^{(i)}) - y^{(i)}\\big)^2 + \\lambda \\sum_{j=1}^{n} \\theta_j^2 \\Big]$$\nBy convention the intercept $\\theta_0$ is **not** penalised (the sum starts at j = 1).",
        },
        {
          type: "p",
          text: "**How a large λ makes the hypothesis simpler (slide 62 asks exactly this).** To keep the total cost low, the optimiser now has to balance two things: fitting the data *and* keeping the weights small. With a large λ, big weights are very expensive, so the higher-order weights ($w_5, w_6, \\dots$) get pushed close to 0. Those terms then contribute almost nothing, and the curve behaves like a **lower-order, smoother** polynomial.",
        },
        {
          type: "table",
          caption: "Choosing λ (slides 12–14, 60)",
          head: ["λ", "Effect on the M = 9 (or M = 5) fit"],
          rows: [
            ["**λ = 0**", "No penalty: plain least squares, overfits"],
            ["**Moderate λ** (e.g. ln λ = −18)", "Smooth curve that follows the true shape: good fit"],
            ["**Very large λ**", "All weights squashed toward 0: a nearly flat line, **underfits** (high bias)"],
          ],
        },
        {
          type: "p",
          text: "So λ is a **hyperparameter** that moves you along the bias–variance trade-off: small λ → more variance, large λ → more bias. Choose it with validation or cross-validation (Session 3).",
        },
        {
          type: "p",
          text: "**Gradient descent with regularisation.** The update for $j \\ge 1$ becomes $\\theta_j := \\theta_j \\big(1 - \\alpha \\frac{\\lambda}{m}\\big) - \\alpha \\frac1m \\sum_i \\big(h_\\theta(x^{(i)}) - y^{(i)}\\big) x_j^{(i)}$. The factor $(1 - \\alpha\\lambda/m)$ is slightly less than 1, so every step first **shrinks** each weight a little, then applies the usual correction. This is called **weight decay**. The regularised normal equation is $\\theta = (X^TX + \\lambda I')^{-1} X^T y$, where $I'$ is the identity matrix with a 0 in the intercept's position.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in seven lines",
          text: "1. Regression predicts a number: $h_\\theta(x) = \\theta_0 + \\theta_1 x$.\n2. Residual = actual − predicted. Least squares minimises the sum of squared residuals, $J = \\frac1{2m}\\sum(h - y)^2$, a convex bowl.\n3. OLS: $\\theta_1 = S_{xy}/S_{xx}$, $\\theta_0 = \\bar y - \\theta_1 \\bar x$ (the line passes through the mean point).\n4. Fit: MSE, RMSE, MAE; $R^2 = 1 - SSE/SST$ = fraction of variation explained.\n5. Gradient descent: $\\theta_j := \\theta_j - \\alpha\\frac1m\\sum(h - y)x_j$, simultaneous update; α too small = slow, too big = diverges; batch / stochastic / mini-batch; scale your features.\n6. Many features: $h = \\theta^Tx$; normal equation $\\theta = (X^TX)^{-1}X^Ty$. Polynomials and basis functions are still *linear in the parameters*.\n7. Complexity ↑ → bias ↓, variance ↑. Regularisation adds $\\lambda\\|w\\|^2$: large λ shrinks weights → simpler, smoother model.",
        },
      ],
    },
  ],

  glossary: [
    ["x, y", "Independent / dependent variable", "What you know (hours) / what you predict (score)"],
    ["$h_\\theta(x)$ or $\\hat y$", "Hypothesis / y-hat", "The model's prediction"],
    ["$\\theta_0$, $\\theta_1$", "Theta-zero, theta-one", "Intercept and slope (also written b and m)"],
    ["$\\theta^T x$", "Theta-transpose-x", "The dot product $\\theta_0x_0 + \\theta_1x_1 + \\dots$ with $x_0 = 1$"],
    ["m, n", "—", "Number of training examples; number of features"],
    ["$x^{(i)}_j$", "—", "Value of feature j in example i"],
    ["$\\bar x$, $\\bar y$", "x-bar, y-bar", "Means of x and y"],
    ["Σ", "Sigma", "“Add all of these up”"],
    ["Residual (e)", "—", "Actual − predicted, for one point"],
    ["SSE", "Sum of Squared Errors", "$\\sum (y - \\hat y)^2$"],
    ["OLS", "Ordinary Least Squares", "Choose the line that minimises SSE"],
    ["$S_{xy}$", "Sum of cross-products", "$\\sum (x - \\bar x)(y - \\bar y)$: how x and y move together"],
    ["$S_{xx}$", "Sum of squares of x", "$\\sum (x - \\bar x)^2$: spread of x"],
    ["J(θ)", "Cost function", "$\\frac1{2m}\\sum(h - y)^2$: how bad a choice of θ is"],
    ["MSE", "Mean Squared Error", "SSE ÷ n"],
    ["RMSE", "Root Mean Square Error", "√MSE, in the original units"],
    ["MAE", "Mean Absolute Error", "Average of |residual|"],
    ["SST", "Total Sum of Squares", "$\\sum (y - \\bar y)^2$: total variation in y"],
    ["R²", "Coefficient of determination", "Fraction of variation explained, 0 to 1"],
    ["Convex", "—", "Bowl-shaped: a single global minimum"],
    ["Contour plot", "—", "Top view of the cost bowl; each ellipse = equal cost"],
    ["GD", "Gradient Descent", "Repeatedly step against the slope of J"],
    ["α", "Alpha, learning rate", "Size of each gradient-descent step"],
    ["SGD", "Stochastic Gradient Descent", "Update after each single example"],
    ["Mini-batch GD", "—", "Update after each small group of examples"],
    ["Feature scaling", "Mean normalisation", "$(x - \\mu)/s$: bring features to similar ranges"],
    ["Normal equation", "—", "$\\theta = (X^TX)^{-1}X^Ty$: closed-form solution"],
    ["M", "Model order", "Highest power in the polynomial"],
    ["$t_n$", "Target", "Actual value of point n (slides' polynomial notation)"],
    ["Basis function $\\phi_j$", "—", "A fixed transformation of x used as a feature"],
    ["Bias", "—", "Systematic error from over-simple assumptions → underfitting"],
    ["Variance", "—", "Sensitivity to the particular training sample → overfitting"],
    ["λ", "Lambda", "Regularisation strength"],
    ["Weight decay", "—", "The shrinking factor $(1 - \\alpha\\lambda/m)$ in regularised GD"],
    ["MCLE / MAP", "Maximum Conditional Likelihood / Maximum A Posteriori", "Bayesian ways to estimate θ"],
  ],

  examTips: [
    "**PYQ Q4 and revision Q2** are both *simple linear regression by least squares → predict → MSE*. Build the table with columns $x, y, x - \\bar x, y - \\bar y$, product, square. It's fast and earns method marks.",
    "Gradient-descent questions (revision deck): write the hypothesis, compute each **error** $h(x) - y$, then each gradient $\\frac1m\\sum e\\,x_j$, then $\\theta_j - \\alpha \\cdot$ gradient. Show the table.",
    "In SGD, the second example uses the **already-updated** θ. In batch GD, every example uses the same old θ.",
    "The bias–variance answer must mention **underfitting/overfitting, model complexity, and that the optimum is a trade-off**.",
    "“How does a large λ give a simpler hypothesis?” → the penalty forces the $\\theta_j$ toward 0, so the high-order terms vanish and the curve is smoother.",
  ],

  problems: [
    {
      title: "Least-squares line, prediction and MSE",
      pyq: "Midsem Q4: slope/intercept, predict at 3.5, MSE",
      level: "Easy",
      marks: 5,
      hint: "Follow Lesson 4's four steps: means → table of deviations → slope = Σproduct ÷ Σsquares → intercept = ȳ − m x̄. For MSE, add columns for ŷ and the squared residual.",
      question: `A shop records its sales (units) against advertising spend (₹ thousand):

| Spend x | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Sales y | 6 | 8 | 11 | 13 | 16 |

(a) Find the slope m and intercept b of $y = mx + b$. (b) Predict sales for x = 3.5. (c) Compute the MSE on the data, plus RMSE, MAE and R².`,
      solution: `
### What is being asked
Fit the best straight line by least squares (Lesson 4), use it to predict, and measure how well it fits (Lesson 5).

### Why this approach
OLS gives the slope and intercept directly. Every quantity comes from one table of deviations from the means, so building that table first saves time and earns method marks.

### Formulas
$$m = \\frac{\\sum (x - \\bar x)(y - \\bar y)}{\\sum (x - \\bar x)^2}, \\quad b = \\bar y - m\\bar x, \\quad \\text{MSE} = \\frac1n\\sum (y - \\hat y)^2, \\quad R^2 = 1 - \\frac{SSE}{SST}$$

### Working
Means: $\\bar x = 15/5 = 3$, $\\bar y = 54/5 = 10.8$

| x | y | $x-\\bar x$ | $y-\\bar y$ | product | $(x-\\bar x)^2$ |
|---|---|---|---|---|---|
| 1 | 6 | −2 | −4.8 | 9.6 | 4 |
| 2 | 8 | −1 | −2.8 | 2.8 | 1 |
| 3 | 11 | 0 | 0.2 | 0 | 0 |
| 4 | 13 | 1 | 2.2 | 2.2 | 1 |
| 5 | 16 | 2 | 5.2 | 10.4 | 4 |
| | | | **Σ** | **25** | **10** |

**(a)** $m = 25/10 = 2.5$; $b = 10.8 - 2.5 \\times 3 = 3.3$

**(b)** $\\hat y(3.5) = 2.5 \\times 3.5 + 3.3 = 8.75 + 3.3 = 12.05$

**(c)** Predictions: 5.8, 8.3, 10.8, 13.3, 15.8 → residuals $y - \\hat y$: 0.2, −0.3, 0.2, −0.3, 0.2
- SSE $= 0.04 + 0.09 + 0.04 + 0.09 + 0.04 = 0.30$
- MSE $= 0.30/5 = 0.06$; RMSE $= \\sqrt{0.06} = 0.245$
- MAE $= (0.2 + 0.3 + 0.2 + 0.3 + 0.2)/5 = 1.2/5 = 0.24$
- SST $= 4.8^2 + 2.8^2 + 0.2^2 + 2.2^2 + 5.2^2 = 62.8$, so $R^2 = 1 - 0.30/62.8 = 0.995$

### Answer
**(a)** $\\hat y = 2.5x + 3.3$ **(b)** **12.05 units** **(c)** MSE **0.06**, RMSE **0.245**, MAE **0.24**, R² **0.995**

### Takeaway
Each extra ₹1,000 of advertising is linked with about 2.5 more units sold. R² = 0.995 means spend explains 99.5% of the variation in sales: an almost perfect straight-line fit.`,
    },
    {
      title: "House area vs price (revision deck Q2)",
      pyq: "Revision deck Q2",
      level: "Medium",
      marks: 4,
      hint: "Same table as Lesson 4, just messier numbers. Keep 2–3 decimals in the deviations. Slope = Σproduct ÷ Σsquares.",
      question: `| Area (m²) | 72 | 50 | 81 | 74 | 94 | 86 |
|---|---|---|---|---|---|---|
| Price (lakh ₹) | 84 | 63 | 77 | 78 | 90 | 75 |

(a) Use least squares to fit Price = $w_0 + w_1\\cdot$Area. (b) Predict the price of an 80 m² house.`,
      solution: `
### What is being asked
A least-squares line on real-looking data, then one prediction.

### Formula
$$w_1 = \\frac{\\sum (x - \\bar x)(y - \\bar y)}{\\sum (x - \\bar x)^2}, \\qquad w_0 = \\bar y - w_1 \\bar x$$

### Working
Means: $\\bar x = 457/6 = 76.167$, $\\bar y = 467/6 = 77.833$

| x | y | $x-\\bar x$ | $y-\\bar y$ | product | $(x-\\bar x)^2$ |
|---|---|---|---|---|---|
| 72 | 84 | −4.167 | 6.167 | −25.69 | 17.36 |
| 50 | 63 | −26.167 | −14.833 | 388.14 | 684.69 |
| 81 | 77 | 4.833 | −0.833 | −4.03 | 23.36 |
| 74 | 78 | −2.167 | 0.167 | −0.36 | 4.69 |
| 94 | 90 | 17.833 | 12.167 | 216.97 | 318.03 |
| 86 | 75 | 9.833 | −2.833 | −27.86 | 96.69 |
| | | | **Σ** | **547.17** | **1144.83** |

**(a)** $w_1 = 547.17/1144.83 = 0.478$; $w_0 = 77.833 - 0.478 \\times 76.167 = 41.43$

**(b)** Price(80) $= 41.43 + 0.478 \\times 80 = 41.43 + 38.24 = 79.67$

### Answer
**(a)** Price $= 41.43 + 0.478 \\times$ Area **(b)** **₹79.67 lakh**

### Takeaway
Each extra square metre adds about ₹0.48 lakh (₹48,000) on average. Notice some products are negative: those houses sit on opposite sides of the average in area and price, and they pull the slope down.`,
    },
    {
      title: "One iteration of batch gradient descent (1 feature)",
      level: "Medium",
      marks: 4,
      hint: "With θ = (0, 0) every prediction is 0, so each error h − y is just −y. Gradient for θ₀ = average error; for θ₁ = average of error × x.",
      question:
        "Data: (1, 2), (2, 4), (3, 5). Start at $\\theta_0 = \\theta_1 = 0$ with α = 0.1 and cost $J = \\frac{1}{2m}\\sum(h-y)^2$. (a) Do one batch GD update. (b) Compute J before and after. (c) What are the OLS optimum and its cost?",
      solution: `
### What is being asked
Take one step down the cost bowl by hand (Lesson 7), check that the cost fell, and compare with the exact OLS answer.

### Why this approach
Batch GD uses all three points to compute each gradient, then updates both θs together from the old values.

### Formulas
$$\\theta_0 := \\theta_0 - \\alpha \\frac1m \\sum (h - y), \\qquad \\theta_1 := \\theta_1 - \\alpha \\frac1m \\sum (h - y)\\,x, \\qquad J = \\frac{1}{2m}\\sum (h - y)^2$$

### Working
**(a)** With θ = (0, 0), every $h = 0$, so the errors $h - y$ are **−2, −4, −5**.
- Gradient for θ₀: $\\frac13(-2 - 4 - 5) = -3.667$
- Gradient for θ₁: $\\frac13(-2 \\cdot 1 - 4 \\cdot 2 - 5 \\cdot 3) = -25/3 = -8.333$
- $\\theta_0 = 0 - 0.1(-3.667) = 0.367$
- $\\theta_1 = 0 - 0.1(-8.333) = 0.833$

**(b)**
- $J_{\\text{before}} = \\frac{1}{6}(4 + 16 + 25) = 7.5$
- New predictions: $0.367 + 0.833x$ = 1.2, 2.033, 2.867 → errors −0.8, −1.967, −2.133
- $J_{\\text{after}} = \\frac16(0.64 + 3.868 + 4.551) = 1.51$

**(c)** $\\bar x = 2$, $\\bar y = 11/3 = 3.667$
- $\\theta_1 = \\frac{(-1)(-1.667) + 0 + (1)(1.333)}{(-1)^2 + 0 + 1^2} = \\frac{3}{2} = 1.5$
- $\\theta_0 = 3.667 - 1.5 \\times 2 = 0.667$
- Predictions 2.167, 3.667, 5.167 → errors 0.167, −0.333, 0.167 → $J_{\\min} = \\frac16(0.028 + 0.111 + 0.028) = 0.028$

### Answer
(a) $\\theta_0 = $ **0.367**, $\\theta_1 = $ **0.833** (b) J falls from **7.5** to **1.51** (c) OLS: $\\theta_0 = $ **0.667**, $\\theta_1 = $ **1.5**, $J_{\\min} = $ **0.028**

### Takeaway
One step already cut the cost by 80%, but we're not at the minimum yet. More iterations would keep walking toward (0.667, 1.5).`,
    },
    {
      title: "Multivariate GD: coronary-heart-disease risk (revision deck)",
      pyq: "Revision deck: first GD iteration, α = 0.02",
      level: "Hard",
      marks: 6,
      hint: "Build one table: prediction h, error e = h − y, e × x₁, e × x₂. Sum the last three columns, divide by m = 3, multiply by α, and subtract from each old weight.",
      question: `RR-CHD (relative risk of coronary heart disease) is linear in BMI ($x_1$) and diastolic pressure ($x_2$): $y = w_0 + w_1x_1 + w_2x_2$. Start with $w_0 = 5$, $w_1 = w_2 = -0.03$, α = 0.02. Show the first iteration of batch gradient descent.

| Patient | BMI | Diastolic | RR-CHD |
|---|---|---|---|
| 1 | 35 | 80 | 1.81 |
| 2 | 25 | 80 | 1.22 |
| 3 | 30 | 100 | 1.71 |`,
      solution: `
### What is being asked
One batch gradient-descent step with two features (Lessons 7–8).

### Why this approach
Every weight's gradient is the average of (error × its feature), with $x_0 = 1$ for the intercept. All three weights are updated together from the old values.

### Formula
$$w_j := w_j - \\alpha \\cdot \\frac1m \\sum_i e_i \\, x_j^{(i)}, \\qquad e_i = h(x^{(i)}) - y^{(i)}$$

### Working
Predictions and errors:

| P | $h = 5 - 0.03x_1 - 0.03x_2$ | y | e = h − y | $e \\cdot x_1$ | $e \\cdot x_2$ |
|---|---|---|---|---|---|
| 1 | 5 − 1.05 − 2.4 = 1.55 | 1.81 | −0.26 | −9.1 | −20.8 |
| 2 | 5 − 0.75 − 2.4 = 1.85 | 1.22 | 0.63 | 15.75 | 50.4 |
| 3 | 5 − 0.9 − 3.0 = 1.10 | 1.71 | −0.61 | −18.3 | −61.0 |
| **Σ** | | | **−0.24** | **−11.65** | **−31.4** |

Gradients (divide by m = 3): $g_0 = -0.08$, $g_1 = -3.8833$, $g_2 = -10.4667$

Updates:
- $w_0 = 5 - 0.02(-0.08) = 5.0016$
- $w_1 = -0.03 - 0.02(-3.8833) = -0.03 + 0.0777 = 0.0477$
- $w_2 = -0.03 - 0.02(-10.4667) = -0.03 + 0.2093 = 0.1793$

### Answer
After one iteration: $w_0 = $ **5.0016**, $w_1 = $ **0.0477**, $w_2 = $ **0.1793**.

### Takeaway
$w_2$ moved the most because pressure values (80–100) are large, so they multiply the errors into big gradients. That's the warning sign that unscaled features can make GD unstable; the next problem shows it happening.`,
    },
    {
      title: "Same data with stochastic GD: why feature scaling matters",
      level: "Hard",
      marks: 5,
      hint: "SGD: after each patient, update immediately with $w_j \\leftarrow w_j - \\alpha\\,e\\,x_j$ (no averaging). Use the new weights for the next patient's prediction.",
      question:
        "Repeat the RR-CHD problem with **stochastic** GD (update after each patient, in order 1, 2, 3; same α = 0.02 and initial weights). Show all three updates, then comment on the result.",
      solution: `
### What is being asked
The same step as the previous problem, but with SGD (Lesson 7), and an explanation of what goes wrong.

### Why this approach
SGD updates after **every** example and the next prediction uses the **new** weights, so errors compound instead of averaging out.

### Formula
$$w_j \\leftarrow w_j - \\alpha \\, e \\, x_j \\quad (x_0 = 1)$$

### Working
**Patient 1:** $h = 1.55$, $e = -0.26$
- $w_0 = 5 + 0.02(0.26) = 5.0052$
- $w_1 = -0.03 + 0.02(0.26)(35) = 0.152$
- $w_2 = -0.03 + 0.02(0.26)(80) = 0.386$

**Patient 2:** $h = 5.0052 + 0.152(25) + 0.386(80) = 39.69$, so $e = 39.69 - 1.22 = 38.47$
- $w_0 = 5.0052 - 0.02(38.47) = 4.236$
- $w_1 = 0.152 - 0.02(38.47)(25) = -19.08$
- $w_2 = 0.386 - 0.02(38.47)(80) = -61.16$

**Patient 3:** $h \\approx 4.236 - 19.08(30) - 61.16(100) \\approx -6684$, so $e \\approx -6685.7$
- $w_0 \\approx 137.95$, $w_1 \\approx 3992$, $w_2 \\approx 13310$

### Answer
The weights **explode: SGD diverges**.

**Why:** the features are unscaled (BMI ≈ 30, pressure ≈ 100), so each update changes the weights by roughly $\\alpha \\, x_j^2 \\gg 1$ times the error, and every step overshoots more than the last. Batch GD survived its one step only because it averaged errors of opposite sign.

**Fixes:** standardise the features, $x_j \\leftarrow (x_j - \\mu_j)/\\sigma_j$, and/or use a much smaller α.

### Takeaway
Always scale features before gradient descent, and suspect the learning rate or scaling whenever the cost goes **up**.`,
    },
    {
      title: "Effect of the learning rate",
      level: "Medium",
      marks: 4,
      hint: "The derivative of θ² is 2θ, so each step multiplies θ by (1 − 2α). Look at whether that factor is between 0 and 1, exactly 0, negative, or below −1.",
      question:
        "Minimise $J(\\theta) = \\theta^2$ from $\\theta = 1$. Write the GD update, then do 3 iterations for α = 0.1, 0.5, 1.0 and 1.1. Describe each behaviour.",
      solution: `
### What is being asked
See Lesson 7's learning-rate intuitions happen on the simplest possible bowl.

### Formula
$J'(\\theta) = 2\\theta$, so $\\theta \\leftarrow \\theta - \\alpha \\cdot 2\\theta = (1 - 2\\alpha)\\,\\theta$

### Working
| α | factor $1 - 2\\alpha$ | θ₁, θ₂, θ₃ | Behaviour |
|---|---|---|---|
| 0.1 | 0.8 | 0.8, 0.64, 0.512 | Slow, steady convergence |
| 0.5 | 0 | 0, 0, 0 | Reaches the minimum in one step (the ideal α for this bowl) |
| 1.0 | −1 | −1, 1, −1 | **Oscillates** forever between ±1 |
| 1.1 | −1.2 | −1.2, 1.44, −1.728 | **Diverges**: overshoots more each time |

### Takeaway
|factor| < 1 → converges; = 1 → bounces forever; > 1 → blows up. In practice, plot J against iterations: if J goes up, reduce α.`,
    },
    {
      title: "Regularised cost and ridge shrinkage",
      level: "Medium",
      marks: 5,
      hint: "(a) Don't penalise θ₀; penalty = λ/(2m) × (θ₁² + θ₂²). (b) Compute Σxy and Σx² once, then just change the denominator.",
      question:
        "(a) A model has $\\theta = (0.5, 2, -3)$ and a data cost (sum of squared errors / 2m) of 1.2 with m = 10. With λ = 4, compute $J = \\frac{1}{2m}[\\text{SSE} + \\lambda\\sum_{j\\ge1}\\theta_j^2]$. (b) For a no-intercept model $y = wx$ on data x = (1, 2, 3, 4), y = (2.2, 3.9, 6.1, 8.0), the ridge solution is $w = \\frac{\\sum xy}{\\sum x^2 + \\lambda}$. Compute w for λ = 0, 10, 30 and comment.",
      solution: `
### What is being asked
Compute a regularised cost, and watch λ shrink a weight (Lesson 11).

### Why this approach
The penalty adds $\\frac{\\lambda}{2m}\\sum_{j \\ge 1}\\theta_j^2$ on top of the data cost. In the ridge formula, λ sits in the denominator, so bigger λ means smaller w.

### Working
**(a)** Data part = 1.2 (already divided by 2m). Penalty $= \\frac{4}{2 \\times 10}(2^2 + (-3)^2) = 0.2 \\times 13 = 2.6$ (θ₀ = 0.5 is not penalised).
$J = 1.2 + 2.6 = 3.8$

**(b)** $\\sum xy = 2.2 + 7.8 + 18.3 + 32 = 60.3$; $\\sum x^2 = 1 + 4 + 9 + 16 = 30$

| λ | $w = 60.3 / (30 + \\lambda)$ |
|---|---|
| 0 | 60.3/30 = **2.01** (plain least squares) |
| 10 | 60.3/40 = **1.51** |
| 30 | 60.3/60 = **1.005** |

### Answer
(a) **J = 3.8** (b) w = **2.01, 1.51, 1.005**

### Takeaway
As λ grows, the weight **shrinks toward 0**. A moderate λ reduces variance (less overfitting); too large a λ flattens the model and **underfits** (high bias). Here the data clearly follow y ≈ 2x, so λ = 30 has damaged a good fit.`,
    },
    {
      title: "Normal equation (vectorised closed form)",
      level: "Hard",
      marks: 5,
      hint: "For one feature, $X^TX = \\begin{pmatrix} n & \\sum x \\\\ \\sum x & \\sum x^2 \\end{pmatrix}$ and $X^Ty = (\\sum y, \\sum xy)$. Invert the 2×2 matrix: swap the diagonal, negate the off-diagonal, divide by the determinant.",
      question:
        "Solve the sales data (x = 1..5, y = 6, 8, 11, 13, 16) with $\\theta = (X^TX)^{-1}X^Ty$, where X has a column of ones. Confirm it matches OLS.",
      solution: `
### What is being asked
Use the matrix form of least squares (Lesson 8) and check it gives the same line as the table method.

### Formula
$$\\theta = (X^TX)^{-1} X^T y, \\qquad \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$

### Working
$\\sum x = 15$, $\\sum x^2 = 55$, $\\sum y = 54$, $\\sum xy = 6 + 16 + 33 + 52 + 80 = 187$
$$X^TX = \\begin{pmatrix}5 & 15\\\\15 & 55\\end{pmatrix}, \\qquad X^Ty = \\begin{pmatrix}54\\\\187\\end{pmatrix}$$
$\\det = 5 \\cdot 55 - 15^2 = 275 - 225 = 50$
$$(X^TX)^{-1} = \\frac{1}{50}\\begin{pmatrix}55 & -15\\\\-15 & 5\\end{pmatrix}$$
$$\\theta = \\frac1{50}\\begin{pmatrix}55 \\cdot 54 - 15 \\cdot 187\\\\ -15 \\cdot 54 + 5 \\cdot 187\\end{pmatrix} = \\frac{1}{50}\\begin{pmatrix}2970 - 2805\\\\-810 + 935\\end{pmatrix} = \\begin{pmatrix}3.3\\\\2.5\\end{pmatrix}$$

### Answer
$\\theta_0 = $ **3.3**, $\\theta_1 = $ **2.5**: the same as OLS ($b = 3.3$, $m = 2.5$) ✓

### Takeaway
No learning rate and no iterations, but it needs a matrix inverse, which costs about $O(n^3)$ in the number of features. Great for a few features; gradient descent wins for many.`,
    },
    {
      title: "Model order, parameters and overfitting",
      level: "Easy",
      marks: 3,
      hint: "A polynomial of order M has M + 1 coefficients. Compare that number with the number of data points.",
      question:
        "You fit polynomials of order M = 0, 1, 3, 9 to N = 10 noisy points from a sine curve. (a) How many coefficients does each model have? (b) Which gives zero training error, and why is that bad? (c) Name two ways to use M = 9 safely.",
      solution: `
### What is being asked
Connect model order to overfitting (Lessons 9–11).

### Working
**(a)** $M + 1$ coefficients: **1, 2, 4, 10**.

**(b)** **M = 9.** Ten coefficients for ten points means the curve can pass exactly through every point, so E = 0. But it's fitting the **noise**: it oscillates wildly between points and has huge coefficients, so it predicts new points badly (**overfitting, high variance**).

**(c)** Any two:
1. **Regularisation:** add $\\frac\\lambda2\\|w\\|^2$ with a suitable λ.
2. **More data:** with N = 100 points, M = 9 follows the true curve well.
3. Choose M (or λ) by **validation / cross-validation**.

### Takeaway
When the number of parameters approaches the number of data points, a model can memorise instead of learn.`,
    },
  ],

  theory: [
    {
      title: "Bias–variance trade-off",
      pyq: "Midsem Q2(b): “Explain the bias–variance tradeoff. How does it relate to underfitting and overfitting?”",
      marks: 2,
      question: "Explain the bias–variance trade-off. How does it relate to underfitting and overfitting?",
      solution: `
### What the examiner wants
Both definitions, the link to under/overfitting, and **what happens as complexity changes**. It's a 2-mark question, so four crisp bullets are enough.

### Model answer
- **Bias:** error from wrong or over-simple assumptions; the model class can't represent the true relationship (e.g. a line for a curve). High bias → **underfitting**: high training *and* test error.
- **Variance:** error from sensitivity to the particular training sample; a flexible model changes a lot with small data changes and learns the noise. High variance → **overfitting**: low training error, high test error.
- **Trade-off:** as model complexity (e.g. polynomial order) **increases**, bias ↓ and variance ↑; as it **decreases**, bias ↑ and variance ↓. Expected error ≈ bias² + variance + irreducible noise, so the best model is at the complexity that **minimises the total**, found with validation/CV.
- **Controls:** regularisation (λ), model order, more training data (reduces variance).

### Takeaway
Archery picture: bias = arrows consistently off-target; variance = arrows scattered.`,
    },
    {
      title: "Robustness vs fit from decision boundaries",
      pyq: "Revision deck Q3",
      marks: 3,
      question: "Three classifiers trained on the same data produce a straight line, a smooth curve and a very wiggly boundary. Which has high robustness and the poorest fit? Which has the highest fit and poor robustness? Relate them to bias and variance.",
      solution: `
### What the examiner wants
Each boundary matched to fit/robustness **and** to bias/variance.

### Model answer
- **Straight line (leftmost):** **high robustness, poorest fit**. It misclassifies several training points but would barely change with new data: **high bias, low variance** (underfitting).
- **Smooth curve (middle):** a good balance; the best candidate to generalise.
- **Wiggly boundary (rightmost):** **highest fit, poorest robustness**. It carves around individual (noisy) points, so a small change in the data changes it a lot: **low bias, high variance** (overfitting).

### Takeaway
“Robust” = low variance; “fits the training data well” = low bias. You rarely get both from the extremes.`,
    },
    {
      title: "What is regularisation and how does λ work?",
      marks: 3,
      question: "What is regularisation? Write the regularised error function. How does a large value of λ result in a simpler hypothesis? What happens if λ is too large?",
      solution: `
### What the examiner wants
The definition, the formula, the **mechanism** (why large λ → simpler), and the danger of too much.

### Model answer
**Regularisation** controls overfitting by adding a penalty on large coefficients to the error function:
$$\\tilde E(w) = \\frac12\\sum_n\\big(y(x_n,w)-t_n\\big)^2 + \\frac{\\lambda}{2}\\|w\\|^2$$
i.e. *error on data + λ × model complexity*.

- **Large λ:** to minimise $\\tilde E$, the optimiser must keep $\\|w\\|$ small. The high-order coefficients are pushed near 0, so those terms contribute little and the curve becomes smoother and effectively lower-order: a simpler hypothesis with lower variance.
- **λ too large:** all weights → 0 and the model becomes nearly constant, which underfits (high bias).
- **λ = 0:** plain least squares, which may overfit.
- Choose λ by cross-validation. The intercept is usually not penalised.

### Takeaway
λ is a dial between overfitting (small λ) and underfitting (large λ).`,
    },
    {
      title: "OLS vs gradient descent",
      marks: 3,
      question: "Compare solving linear regression by the closed form (OLS / normal equation) and by gradient descent.",
      solution: `
### What the examiner wants
A side-by-side comparison on method, tuning, cost and when to use each. A table is ideal.

### Model answer
| | OLS / Normal equation | Gradient descent |
|---|---|---|
| Method | $\\theta = (X^TX)^{-1}X^Ty$, one shot | Iterative updates $\\theta_j -= \\alpha\\,\\partial J/\\partial\\theta_j$ |
| Learning rate | Not needed | Must choose α |
| Iterations | None | Many, until convergence |
| Cost | $O(n^3)$ matrix inverse, slow for many features | $O(mn)$ per iteration; scales to large n and m |
| Issues | $X^TX$ may be singular (redundant features) | Needs feature scaling; may diverge if α is too big |
| Use when | Few features (up to about 10⁴) | Many features or huge datasets; also works for models with no closed form (logistic regression) |

### Takeaway
Same answer for linear regression; different routes. Gradient descent is the one that generalises to other models.`,
    },
    {
      title: "Gradient descent: learning rate and variants",
      marks: 4,
      question: "Explain gradient descent for linear regression. What happens if α is too small or too large, or θ is already at a minimum? Differentiate batch, stochastic and mini-batch GD.",
      solution: `
### What the examiner wants
The idea with the update rule, the three slide-33 intuitions, and the three variants.

### Model answer
- **Idea:** J(θ) is a convex bowl for linear regression. Start with any θ and repeatedly step opposite the gradient, $\\theta_j := \\theta_j - \\alpha\\frac1m\\sum_i(h_\\theta(x^{(i)})-y^{(i)})x_j^{(i)}$, updating all $\\theta_j$ **simultaneously**, until the change is tiny.
- **α too small:** tiny steps, very slow. **α too large:** overshoots; J oscillates or increases (diverges). **At a minimum:** the gradient is 0, so θ doesn't change. Steps also shrink naturally near the minimum.
- **Batch GD:** the gradient uses all m samples per update. Accurate and smooth, but slow on big data.
- **Stochastic GD:** updates after each single sample. Fast, but noisy, and can hover around the minimum.
- **Mini-batch GD:** uses small groups (e.g. 32–256). Balances stability and speed, and runs efficiently on vector hardware.

### Takeaway
Walking downhill in fog: α is your stride length, and the batch size is how many points you check before each step.`,
    },
    {
      title: "Why is it called a “linear” model?",
      marks: 2,
      question: "A polynomial $y = w_0 + w_1x + w_2x^2 + w_3x^3$ is a curve. Why is it still called a linear (regression) model? What are basis functions?",
      solution: `
### What the examiner wants
The key phrase **“linear in the parameters”**, and a definition of basis functions with examples.

### Model answer
- It is **linear in the parameters w**, not necessarily in x. The prediction is a weighted *sum* of fixed functions of x: $y = \\sum_j w_j\\phi_j(x)$ with $\\phi_j(x) = x^j$.
- So the least-squares cost is still quadratic (convex) in w, and the same OLS / normal equation / GD machinery applies.
- **Basis functions** $\\phi_j$ transform the input: polynomial $x^j$, **Gaussian** $\\exp(-(x-\\mu_j)^2/2s^2)$, **sigmoidal** $\\sigma((x-\\mu_j)/s)$. Models of this form are called *generalised linear models*.

### Takeaway
“Linear” describes how the **weights** enter the model, not the shape of the curve.`,
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
