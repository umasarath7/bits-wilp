// AML — Contact Session 7: Support Vector Machines
// Source: CourseFiles/AML/ContactSession7-SVM.pptx (40 slides)

export default {
  title: "Support Vector Machines",
  source: "ContactSession7-SVM.pptx · 40 slides",
  overview:
    "Among all separating hyperplanes, an SVM picks the one with the **maximum margin**, and that hyperplane is fixed by the **support vectors**. It is found by a quadratic optimisation (primal → Lagrangian dual, where $w = \\sum \\alpha_i y_i x_i$). **Soft margins** (slack $\\xi_i$ and the parameter C) handle noise. The **kernel trick** ($K(x_i,x_j) = \\phi(x_i)^T\\phi(x_j)$) handles non-linear data without computing $\\phi$ explicitly. Multiclass problems use OvA/OvO.",

  summary: [
    {
      id: "linear",
      heading: "1. Linear classifiers & the maximum margin",
      slides: "3–11",
      blocks: [
        { type: "p", text: "$$f(x, w, b) = \\text{sign}(w^Tx + b)$$ Points with $w^Tx + b > 0$ are +1 and points with $w^Tx + b < 0$ are −1. The hyperplane is $w^Tx + b = 0$." },
        { type: "list", items: [
          "Many lines separate the data. Which is best? If the boundary passes close to training points, new points near them may fall on the wrong side.",
          "**Margin:** the width the boundary could be increased by before hitting a data point.",
          "**Maximum-margin linear classifier** is the simplest SVM (**LSVM**).",
          "**Support vectors:** the points the margin pushes against, i.e. the points nearest the hyperplane. The hyperplane is determined **only** by them. Removing any other point doesn't change it; removing a support vector does.",
        ]},
        {
          type: "table",
          caption: "Key geometry",
          head: ["Quantity", "Formula"],
          rows: [
            ["Canonical constraints", "$w^Tx_i + b \\ge +1$ for $y_i = +1$, and $\\le -1$ for $y_i = -1$, i.e. $y_i(w^Tx_i+b) \\ge 1$"],
            ["Margin hyperplanes", "$w^Tx + b = \\pm 1$ (these pass through the support vectors)"],
            ["**Margin width**", "$\\dfrac{2}{\\|w\\|}$"],
            ["Distance of point x to the hyperplane", "$\\dfrac{|w^Tx + b|}{\\|w\\|}$"],
          ],
        },
      ],
    },
    {
      id: "opt",
      heading: "2. The optimisation problem (primal & dual)",
      slides: "12–16",
      blocks: [
        { type: "p", text: "**Primal (hard margin):** find w, b such that $\\Phi(w) = \\frac12\\|w\\|^2$ is minimised, subject to $y_i(w^Tx_i + b) \\ge 1$ for all i. (Maximising $2/\\|w\\|$ is the same as minimising $\\|w\\|^2$.)" },
        { type: "p", text: "A **quadratic** objective with **linear** inequality constraints is a well-known QP class. Solve it via the **dual**: add a Lagrange multiplier $\\alpha_i \\ge 0$ for each constraint:" },
        { type: "p", text: "$$L(w,b,\\alpha) = \\tfrac12\\|w\\|^2 - \\sum_i\\alpha_i\\big[y_i(w^Tx_i+b) - 1\\big]$$" },
        { type: "list", items: [
          "$\\partial L/\\partial w = 0 \\Rightarrow$ **$w = \\sum_i \\alpha_iy_ix_i$**",
          "$\\partial L/\\partial b = 0 \\Rightarrow$ **$\\sum_i \\alpha_iy_i = 0$**",
          "Only support vectors have $\\alpha_i > 0$. All other points have $\\alpha_i = 0$.",
          "The dual depends on the data **only through dot products** $x_i^Tx_j$. This is what makes the kernel trick possible.",
          "Classify with $f(x) = \\text{sign}\\big(\\sum_i \\alpha_iy_i\\,x_i^Tx + b\\big)$.",
        ]},
      ],
    },
    {
      id: "soft",
      heading: "3. Soft margin: slack variables & C",
      slides: "17–22",
      blocks: [
        { type: "p", text: "A **hard margin** requires every point to be classified correctly (no training error), which fails on noisy data. A **soft margin** adds slack variables $\\xi_i \\ge 0$:" },
        { type: "p", text: "$$\\min\\; \\tfrac12 w^Tw + C\\sum_i\\xi_i \\quad \\text{s.t.}\\; y_i(w^Tx_i+b) \\ge 1-\\xi_i,\\;\\xi_i\\ge0$$" },
        {
          type: "table",
          caption: "Reading the slack $\\xi_i = \\max(0, 1 - y_if(x_i))$",
          head: ["$\\xi_i$", "Meaning"],
          rows: [
            ["0", "Correct and outside (or on) the margin"],
            ["0 < ξ < 1", "Correct side but **inside** the margin (margin violation)"],
            ["ξ = 1", "Exactly on the decision boundary"],
            ["ξ > 1", "**Misclassified**"],
          ],
        },
        {
          type: "table",
          caption: "Effect of C (slide 22)",
          head: ["", "Large C", "Small C"],
          rows: [
            ["Penalty on slack", "High", "Low"],
            ["Margin", "**Narrower**", "**Wider**"],
            ["Margin violations", "Fewer", "More (many points “on the street”)"],
            ["Risk", "Overfitting (approaches a hard margin)", "Underfitting, but often **generalises better**"],
          ],
        },
        { type: "p", text: "C is a hyperparameter that **controls overfitting**, just as λ does in regression (roughly C ∼ 1/λ)." },
      ],
    },
    {
      id: "kernel",
      heading: "4. Non-linear SVMs & the kernel trick",
      slides: "23–31",
      blocks: [
        { type: "p", text: "If the data isn't linearly separable even with slack, **map it to a higher-dimensional space** $\\Phi: x \\to \\phi(x)$ where it becomes separable. Example: 1-D points with − on the outside and + in the middle become separable after $x \\to (x, x^2)$." },
        { type: "p", text: "**Kernel trick:** the linear SVM only needs dot products. In feature space these become $K(x_i,x_j) = \\phi(x_i)^T\\phi(x_j)$. A **kernel function** computes this inner product *directly* in the original space, so we never compute $\\phi$ explicitly." },
        {
          type: "table",
          caption: "Examples of kernel functions (slide 29)",
          head: ["Kernel", "K(xᵢ, xⱼ)"],
          rows: [
            ["Linear", "$x_i^Tx_j$"],
            ["Polynomial of power p", "$(1 + x_i^Tx_j)^p$"],
            ["Gaussian (RBF)", "$\\exp\\!\\left(-\\dfrac{\\|x_i-x_j\\|^2}{2\\sigma^2}\\right)$"],
            ["Sigmoid", "$\\tanh(\\beta_0\\,x_i^Tx_j + \\beta_1)$"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Degree-2 polynomial kernel expansion (PYQ Q1d)",
          text: "For $x = (x_1,x_2)$, $K(x,z) = (1 + x^Tz)^2 = \\phi(x)^T\\phi(z)$ with $$\\phi(x) = \\big(1,\\;\\sqrt2x_1,\\;\\sqrt2x_2,\\;x_1^2,\\;x_2^2,\\;\\sqrt2x_1x_2\\big)$$ Expand $(1 + x_1z_1 + x_2z_2)^2$ and match the terms to derive it. Always check that computing K directly gives the same number as the dot product of the φ's.",
        },
        { type: "p", text: "The SVM finds a separating hyperplane in feature space without ever representing that space explicitly. The kernel plays the role of the dot product." },
      ],
    },
    {
      id: "misc",
      heading: "5. Multi-class & extras",
      slides: "32–39",
      blocks: [
        { type: "p", text: "SVMs are inherently binary. For K classes use **one-vs-rest** (K SVMs, pick the largest $w_k^Tx + b_k$) or **one-vs-one** (K(K−1)/2 SVMs, majority vote)." },
        { type: "p", text: "**Regression metrics recap:** MAE, MSE, RMSE, R². **Gradient-descent variants:** batch (whole dataset per update, slow on big data), stochastic (one sample, fast), mini-batch." },
        { type: "p", text: "**Homework (also revision Q6):** positives {(3,2), (4,3), (2,3), (3,−1)}, negatives {(1,0), (1,−1), (0,2), (−1,2)}. Find the maximum-margin hyperplane. See the Numerical tab." },
        {
          type: "callout",
          kind: "tip",
          title: "Graphical method for hand-solving SVM questions",
          text: "(1) Plot the points. (2) Guess the support vectors: the closest opposite-class points. (3) Draw the line through the two SVs of one class. (4) Draw the parallel line through the SV of the other class. (5) The decision boundary is the **midway parallel line**. (6) Check that every point is on the correct side, and that no other orientation gives a wider margin.",
        },
      ],
    },
  ],

  keyTerms: [
    ["Margin", "$2/\\|w\\|$: the gap between the classes."],
    ["Support vectors", "Points on the margin; they alone define the hyperplane ($\\alpha_i > 0$)."],
    ["Hard margin", "No misclassification allowed."],
    ["Soft margin", "Slack $\\xi_i$ allows violations, penalised by C."],
    ["C", "Trade-off between margin width and violations. Large C = narrow margin."],
    ["Dual", "$w = \\sum\\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$; depends only on dot products."],
    ["Kernel", "$K(x,z) = \\phi(x)^T\\phi(z)$ computed without φ."],
    ["Kernel trick", "Replace dot products by K to fit non-linear boundaries cheaply."],
    ["RBF kernel", "$\\exp(-\\|x-z\\|^2/2\\sigma^2)$."],
    ["Polynomial kernel", "$(1+x^Tz)^p$."],
    ["Hinge loss", "$\\max(0, 1 - y f(x))$, equal to the slack."],
  ],

  examTips: [
    "**SVM appears in every paper:** PYQ Q1(d) polynomial kernel (2 marks) and Q5 XOR feature map (6 marks). Revision Q6 covers the linear SVM hyperplane and the 1-D kernel trick.",
    "Kernel questions: write $\\phi(x)$ explicitly, compute $\\phi(x_1)$ and $\\phi(x_2)$, take their dot product, and **verify** with $(1+x_1^Tx_2)^2$.",
    "Hyperplane questions: identify the support vectors, write the margin lines $w^Tx+b=\\pm1$, then the boundary $w^Tx+b=0$. Give the margin $2/\\|w\\|$.",
    "“Express the boundary back in the original space”: substitute $\\phi$ back, e.g. $z = x_1x_2 = 0$ gives the two axes.",
  ],

  problems: [
    {
      title: "Polynomial kernel: feature map and kernel value",
      pyq: "Midsem Q1(d): K(x, x′) = (1 + x·x′)², x₁ = (1,3), x₂ = (2,1)",
      level: "Medium",
      marks: 2,
      question:
        "For $K(x,z) = (1 + x^Tz)^2$ with $x, z \\in \\mathbb R^2$: (a) derive the feature map $\\phi(x)$. (b) For $x_a = (1, 2)$ and $x_b = (3, -1)$, compute $\\phi(x_a)$, $\\phi(x_b)$ and $K(x_a, x_b)$ both ways.",
      solution: `
**(a)** $(1 + x_1z_1 + x_2z_2)^2 = 1 + 2x_1z_1 + 2x_2z_2 + x_1^2z_1^2 + x_2^2z_2^2 + 2x_1x_2z_1z_2$, which matches
$$\\phi(x) = (1,\\ \\sqrt2x_1,\\ \\sqrt2x_2,\\ x_1^2,\\ x_2^2,\\ \\sqrt2x_1x_2)$$

**(b)**
- $\\phi(x_a) = (1,\\ \\sqrt2,\\ 2\\sqrt2,\\ 1,\\ 4,\\ 2\\sqrt2)$
- $\\phi(x_b) = (1,\\ 3\\sqrt2,\\ -\\sqrt2,\\ 9,\\ 1,\\ -3\\sqrt2)$

Dot product $= 1 + 6 - 4 + 9 + 4 - 12 = $ **4**

**Direct:** $x_a^Tx_b = 3 - 2 = 1 \\Rightarrow (1+1)^2 = $ **4** ✓

The kernel computed in 2-D equals the 6-D dot product; that is the **kernel trick**.`,
    },
    {
      title: "Maximum-margin hyperplane by hand",
      pyq: "SVM homework / revision Q6",
      level: "Hard",
      marks: 6,
      question:
        "Positive: (3,2), (4,3), (2,3), (3,−1). Negative: (1,0), (1,−1), (0,2), (−1,2). Find the linear SVM hyperplane, the support vectors, the canonical w and b, and the margin.",
      solution: `
**Support vectors:** (2,3) and (3,−1) on the positive side, (1,0) on the negative side.

**Line through the positive SVs:** slope $= (−1−3)/(3−2) = −4$, so $y = −4x + 11$, i.e. **$4x + y = 11$**

**Parallel line through (1,0):** $4x + y = 4$

**Decision boundary (midway):** **$4x + y = 7.5$**, i.e. $y = −4x + 7.5$

**Check all points** with $g = 4x + y$:
- Positives: 14, 19, 11, 11, all ≥ 11 ✓
- Negatives: 4, 3, 2, −2, all ≤ 4 ✓

**Canonical form:** we need $w^Tx + b = \\pm1$ on the margins. $4x + y - 7.5 = \\pm3.5$, so divide by 3.5:
- $w = (8/7,\\ 2/7) \\approx (1.143, 0.286)$
- $b = -15/7 \\approx -2.143$

**Margin** $= 2/\\|w\\| = 2/\\sqrt{(64+4)/49} = 14/\\sqrt{68} = $ **1.698**. (Equivalently, the distance between the lines is $7/\\sqrt{17}$.)

A numeric search over all orientations confirms $w \\parallel (4, 1)$ gives the widest margin. Choosing wrong support vectors gives a narrower margin (slide 13 note).`,
    },
    {
      title: "XOR with a feature map",
      pyq: "Midsem Q5 (6 marks)",
      level: "Hard",
      marks: 6,
      question: `XOR data (not linearly separable):

| x₁ | x₂ | Class |
|---|---|---|
| 1 | 1 | +1 |
| −1 | −1 | +1 |
| 1 | −1 | −1 |
| −1 | 1 | −1 |

(a) Suggest $\\phi(x_1, x_2)$ that makes the data linearly separable. (b) Identify the support vectors in the transformed space. (c) Write the maximum-margin hyperplane there. (d) Express the boundary in the original space.`,
      solution: `
**(a)** $\\phi(x_1,x_2) = x_1x_2$, or in 3-D $\\phi = (x_1, x_2, x_1x_2)$.

| x | $z = x_1x_2$ | class |
|---|---|---|
| (1,1) | 1 | +1 |
| (−1,−1) | 1 | +1 |
| (1,−1) | −1 | −1 |
| (−1,1) | −1 | −1 |

Now +1 ↔ z = 1 and −1 ↔ z = −1: **linearly separable**.

**(b)** All four points lie exactly on the margins ($z = \\pm1$), so **all four are support vectors**.

**(c)** In 1-D, $w z + b = 0$ with $y(wz+b) \\ge 1$ tight at $z = \\pm1$:
- $w + b = 1$ and $-w + b = -1$, so $w = 1$, $b = 0$
- Hyperplane: **$z = 0$** (in 3-D: $0\\cdot x_1 + 0\\cdot x_2 + 1\\cdot x_1x_2 = 0$)
- Margin $= 2/\\|w\\| = 2$

**(d)** $x_1x_2 = 0$, i.e. **the two coordinate axes** ($x_1 = 0$ or $x_2 = 0$). Decision rule: class = sign$(x_1x_2)$, so +1 in quadrants I and III and −1 in II and IV.`,
    },
    {
      title: "1-D kernel trick (revision deck Q6b)",
      pyq: "Revision deck Q6",
      level: "Medium",
      marks: 4,
      question:
        "Positive points: x = 2, 3, 4. Negative points: x = 0, 1, 5, 6 (all on a line, y = 0). Use a transformation to make them linearly separable, find the SVM boundary, and map it back.",
      solution: `
The data isn't separable by one threshold (− + − pattern). Use $z = (x - 3)^2$:

| x | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| class | − | − | + | + | + | − | − |
| z | 9 | 4 | 1 | 0 | 1 | 4 | 9 |

In the (x, z) plane, positives have z ≤ 1 and negatives have z ≥ 4.

**Support vectors:** (2,1), (4,1) and (1,4), (5,4)

**Boundary** midway: **$z = 2.5$**, i.e. $(x-3)^2 = 2.5$, i.e. $x^2 - 6x + 6.5 = 0$
→ $x = 3 \\pm \\sqrt{2.5} = $ **1.42 and 4.58**. Predict + between them.`,
    },
    {
      title: "Margins, slack and the soft-margin objective",
      level: "Medium",
      marks: 5,
      question:
        "An SVM has $w = (1, 1)$, $b = -3$. For each point compute $f(x) = w^Tx + b$, $y f(x)$ and the slack $\\xi = \\max(0, 1 - yf(x))$, and say whether it is a support vector, a margin violation or misclassified: (1,1)−, (2,2)+, (3,3)+, (2,0.5)−, (1.8,1.5)+, (1,1.5)+. Then compute the margin and the soft-margin objective for C = 1 and C = 10.",
      solution: `
| x | y | f(x) | y·f | ξ | status |
|---|---|---|---|---|---|
| (1,1) | − | −1 | 1 | 0 | **SV** (on the margin) |
| (2,2) | + | 1 | 1 | 0 | **SV** |
| (3,3) | + | 3 | 3 | 0 | safe |
| (2,0.5) | − | −0.5 | 0.5 | 0.5 | inside the margin, correct |
| (1.8,1.5) | + | 0.3 | 0.3 | 0.7 | inside the margin, correct |
| (1,1.5) | + | −0.5 | −0.5 | 1.5 | **misclassified** (ξ > 1) |

**Margin** $= 2/\\|w\\| = 2/\\sqrt2 = $ **1.414**

**Objective** $\\frac12\\|w\\|^2 + C\\sum\\xi = 1 + C(2.7)$:
- C = 1: **3.7**
- C = 10: **28**

With C = 10 the optimiser would prefer a narrower margin with fewer violations.`,
    },
    {
      title: "Recovering w and b from the dual",
      level: "Hard",
      marks: 4,
      question:
        "A hard-margin SVM on two points gives support vectors $x_1 = (2,2)$, $y_1 = +1$ and $x_2 = (0,0)$, $y_2 = -1$, with $\\alpha_1 = \\alpha_2 = \\alpha$. Use $w = \\sum \\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$ and the margin conditions to find α, w, b and the margin.",
      solution: `
$\\sum\\alpha_iy_i = \\alpha - \\alpha = 0$ ✓

$w = \\alpha(2,2) - \\alpha(0,0) = (2\\alpha, 2\\alpha)$

**Margin conditions:**
- $w^Tx_2 + b = -1 \\Rightarrow b = -1$
- $w^Tx_1 + b = 1 \\Rightarrow 8\\alpha - 1 = 1 \\Rightarrow \\alpha = $ **0.25**

So $w = $ **(0.5, 0.5)** and $b = $ **−1**. Boundary: $x_1 + x_2 = 2$.

**Margin** $= 2/\\|w\\| = 2/0.7071 = $ **2.83**, which equals the distance between the two points, as expected.`,
    },
    {
      title: "RBF and linear kernel values",
      level: "Easy",
      marks: 3,
      question:
        "For $x = (1, 2)$ and $z = (2, 0)$ compute (a) the linear kernel, (b) the polynomial kernel $(1 + x^Tz)^3$, (c) the RBF kernel with $\\gamma = 1/(2\\sigma^2) = 0.5$. (d) What happens to the RBF value as the points move apart?",
      solution: `
**(a)** $x^Tz = 2 + 0 = $ **2**

**(b)** $(1 + 2)^3 = $ **27**

**(c)** $\\|x - z\\|^2 = 1 + 4 = 5$, so $K = e^{-0.5 \\times 5} = e^{-2.5} = $ **0.082**

**(d)** It decays toward **0**. RBF is a *similarity*: 1 for identical points, ≈ 0 for distant ones. A small σ (large γ) gives very local, wiggly boundaries (overfitting risk).`,
    },
    {
      title: "Why kernels save computation",
      level: "Medium",
      marks: 3,
      question:
        "With n = 100 input features, a full degree-2 polynomial feature map (with bias and linear terms) has $\\binom{n+2}{2}$ dimensions. (a) How many? (b) Compare the cost of an explicit dot product with the kernel. (c) Which kernel corresponds to an infinite-dimensional φ?",
      solution: `
**(a)** $\\binom{102}{2} = 102\\cdot101/2 = $ **5,151** dimensions

**(b)**
- *Explicit:* build two 5,151-dim vectors, then a 5,151-term dot product.
- *Kernel:* $(1 + x^Tz)^2$ is one 100-term dot product, an addition and a square, so about **50× cheaper**. The saving explodes for higher degrees: degree 3 gives $\\binom{103}{3} = 176,851$ dimensions.

**(c)** The **Gaussian RBF** kernel. Its feature space is infinite-dimensional, so it can *only* be used through the kernel trick.`,
    },
  ],

  theory: [
    {
      title: "Maximum margin and support vectors",
      marks: 3,
      question: "Why does an SVM choose the maximum-margin hyperplane? What are support vectors and why are they important?",
      solution: `
- **Why max margin:** many hyperplanes separate the training data. One that passes close to some training points is fragile: a new point near them, even of the correct class, may fall on the wrong side. Maximising the margin gives the most “safety room”, so the classifier is more **robust to noise** and **generalises better**.
- **Support vectors:** the training points lying on the margin boundaries $w^Tx+b = \\pm1$, nearest to the hyperplane. The max-margin hyperplane is **completely determined** by them ($\\alpha_i > 0$ only for them).
- **Importance:** removing a non-SV doesn't change the solution, while removing an SV alters the hyperplane. The model is sparse, since prediction needs only the SVs.`,
    },
    {
      title: "Hard margin vs soft margin, and C",
      marks: 4,
      question: "Differentiate hard- and soft-margin SVM with their formulations. Explain the role of the slack variables and of C.",
      solution: `
**Hard margin:** minimise $\\frac12 w^Tw$ s.t. $y_i(w^Tx_i+b) \\ge 1$ for all i. No training errors; it only works for linearly separable, noise-free data and is sensitive to outliers.

**Soft margin:** minimise $\\frac12 w^Tw + C\\sum\\xi_i$ s.t. $y_i(w^Tx_i+b) \\ge 1 - \\xi_i$, $\\xi_i \\ge 0$.

**Slack $\\xi_i$** gives leniency:
- ξ = 0: correct and outside the margin
- 0 < ξ ≤ 1: inside the margin
- ξ > 1: misclassified

**C** weights the slack penalty:
- **Large C:** violations are costly, so a narrower margin and fewer violations. Close to a hard margin, with a risk of overfitting.
- **Small C:** a wider margin with more violations tolerated. Often generalises better; too small underfits.

C is the regularisation knob that controls overfitting.`,
    },
    {
      title: "The kernel trick",
      marks: 4,
      question: "Explain the kernel trick. Why is it needed, and why does it work for SVMs? List common kernels.",
      solution: `
- **Need:** some data isn't linearly separable in the input space (XOR, concentric circles). Mapping to a higher-dimensional space $\\phi(x)$ can make it separable, but computing φ explicitly may be very expensive or even infinite-dimensional.
- **Why it works:** the SVM dual and its decision function use the data **only through dot products** $x_i^Tx_j$. Replace every dot product by a kernel $K(x_i,x_j) = \\phi(x_i)^T\\phi(x_j)$, computed directly from the original vectors.
- **Result:** a linear separator in feature space, which is a non-linear boundary in input space, at roughly the cost of the original dot product.
- **Common kernels:**
  - Linear: $x^Tz$
  - Polynomial: $(1+x^Tz)^p$
  - Gaussian RBF: $\\exp(-\\|x-z\\|^2/2\\sigma^2)$
  - Sigmoid: $\\tanh(\\beta_0 x^Tz + \\beta_1)$`,
    },
    {
      title: "Primal and dual formulations",
      marks: 3,
      question: "Write the SVM primal problem and the Lagrangian. What conditions come from setting the derivatives to zero, and what do they tell us?",
      solution: `
**Primal:** $\\min_{w,b}\\ \\frac12\\|w\\|^2$ s.t. $y_i(w^Tx_i+b) \\ge 1$. A quadratic objective with linear constraints (a QP).

**Lagrangian:** $L = \\frac12\\|w\\|^2 - \\sum_i\\alpha_i[y_i(w^Tx_i+b)-1]$, $\\alpha_i \\ge 0$

**Conditions:**
- $\\partial L/\\partial w = 0 \\Rightarrow w = \\sum_i\\alpha_iy_ix_i$: w is a combination of the training points, and only the SVs ($\\alpha_i > 0$) contribute.
- $\\partial L/\\partial b = 0 \\Rightarrow \\sum_i\\alpha_iy_i = 0$.

Substituting back gives the **dual**, which depends only on $x_i^Tx_j$, and so enables kernels.`,
    },
    {
      title: "SVM vs logistic regression",
      marks: 3,
      question: "Compare SVM and logistic regression.",
      solution: `
| | SVM | Logistic regression |
|---|---|---|
| Objective | Maximise margin (hinge loss + $\\|w\\|^2$) | Maximise likelihood (log-loss) |
| Output | Class (sign); scores not probabilities | Calibrated probability $P(y=1|x)$ |
| Which points matter | Only the **support vectors** | All points contribute |
| Non-linear | Natural via **kernels** | Needs explicit feature engineering |
| Outliers | Soft margin (C) limits their influence | Can be pulled by far points |
| Multiclass | OvA/OvO | OvA or softmax |
| Use when | Clear-margin, high-dimensional data (text, images) | You need probabilities and interpretability |`,
    },
  ],

  quiz: [
    { q: "The margin of an SVM with weight vector w is:", options: ["‖w‖", "1/‖w‖", "2/‖w‖", "‖w‖²"], answer: 2, why: "The distance between $w^Tx+b = +1$ and $-1$." },
    { q: "Support vectors are:", options: ["All training points", "Misclassified points only", "Points on the margin that define the hyperplane", "Points farthest from the hyperplane"], answer: 2, why: "Only they have α > 0." },
    { q: "Increasing C in a soft-margin SVM generally:", options: ["Widens the margin", "Narrows the margin with fewer violations", "Has no effect", "Removes the support vectors"], answer: 1, why: "Violations become expensive." },
    { q: "A slack value ξ = 1.5 means the point is:", options: ["Correct, outside the margin", "Inside the margin, correct", "On the boundary", "Misclassified"], answer: 3, why: "ξ > 1 means it is on the wrong side of the hyperplane." },
    { q: "The kernel trick works because the SVM dual depends only on:", options: ["The labels", "Dot products of inputs", "The number of features", "The learning rate"], answer: 1, why: "Replace $x_i^Tx_j$ with $K(x_i,x_j)$." },
    { q: "Polynomial kernel $(1+x^Tz)^2$ with $x^Tz = 5$ gives:", options: ["25", "26", "36", "11"], answer: 2, why: "(1+5)² = 36." },
    { q: "Which φ makes XOR linearly separable?", options: ["x₁ + x₂", "x₁x₂", "x₁ − x₂", "|x₁|"], answer: 1, why: "The product is +1 for same signs and −1 for different signs." },
    { q: "In the dual solution, w equals:", options: ["Σαᵢxᵢ", "Σαᵢyᵢxᵢ", "Σyᵢxᵢ", "Σαᵢyᵢ"], answer: 1, why: "From ∂L/∂w = 0." },
    { q: "The Gaussian RBF kernel corresponds to a feature space that is:", options: ["2-dimensional", "Same as the input", "Infinite-dimensional", "Undefined"], answer: 2, why: "That is why it can only be used via the kernel." },
  ],
};
