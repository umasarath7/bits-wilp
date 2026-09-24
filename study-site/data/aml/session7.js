// AML — Contact Session 7: Support Vector Machines
// Source: CourseFiles/AML/ContactSession7-SVM.pptx (40 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, then formulas with intuition.

export default {
  title: "Support Vector Machines",
  source: "ContactSession7-SVM.pptx · 40 slides",
  overview:
    "SVM questions carried **8 of 30 marks** in the previous mid-sem (a kernel calculation and the XOR problem). We'll build the idea from one simple question: **if many lines separate two classes, which one is best?** From there: **how** to measure the gap (the margin), **why** only a few points (the support vectors) matter, **how** the optimisation is set up, **what** to do when data is noisy (soft margin and C), and **how** to separate data that no straight line can (feature maps and the kernel trick). The last lesson is a step-by-step guide to solving SVM questions by hand.",

  summary: [
    {
      id: "margin",
      heading: "Lesson 1: If many lines separate the data, which one is best?",
      slides: "3–10",
      blocks: [
        {
          type: "p",
          text: "**The setting (slide 3).** A **linear classifier** draws a straight line (in general a flat **hyperplane**) and labels points by which side they fall on:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Linear classifier",
          text: "$$f(x, w, b) = \\text{sign}(w^T x + b)$$\n\n- $w$ is the **weight vector**: it points perpendicular to the line and sets its orientation\n- $b$ is the **bias**: it shifts the line\n- $w^Tx + b > 0$ → class **+1**; $w^Tx + b < 0$ → class **−1**; the line itself is $w^Tx + b = 0$",
        },
        {
          type: "p",
          text: "**The puzzle (slides 4–7).** For two well-separated groups of points, there are infinitely many lines that separate them perfectly. Any of them gets 100% on the training data. So which should we choose? Slide 7 shows the danger: a line that passes very **close** to some training points. A new point that's only slightly different from a training example, and of the *same* class, can land on the wrong side.",
        },
        {
          type: "p",
          text: "**An analogy.** Imagine two villages, and you must build a straight road between them without touching any house. You could squeeze a narrow lane right next to one village, but a slight wobble and you hit a house. The sensible choice is the **widest possible road**, with its centre line as far as possible from both villages. That's exactly what an SVM does.",
        },
        {
          type: "p",
          text: "**The margin (slide 8).** The **margin** of a linear classifier is *the width by which the boundary could be increased before hitting a data point*: the width of the road. The **maximum-margin linear classifier** is the one with the widest margin. It is the simplest kind of SVM, called a **Linear SVM (LSVM)** (slide 9).",
        },
        {
          type: "p",
          text: "**Support vectors (slides 9–10).** The houses at the very edge of the road, the ones the road's edges touch, are the **support vectors**: the training points that the margin *pushes up against*, i.e. those nearest to the boundary. Here's the remarkable part: **the best line is completely determined by these few points.** Remove a house deep inside a village and the road doesn't move. Remove one of the edge houses and the road can widen or shift. That's the definition on slide 10: support vectors are *the points which, if removed, would alter the position of the dividing hyperplane.*",
        },
        { type: "diagram", name: "s7-margin" },
        {
          type: "callout",
          kind: "idea",
          title: "Why the widest margin?",
          text: "A wide margin means the classifier isn't relying on a knife-edge decision near any training point. It's more **robust to noise** and tends to **generalise better** to new data.",
        },
      ],
    },
    {
      id: "geometry",
      heading: "Lesson 2: How do we measure the margin? The geometry",
      slides: "11–13",
      blocks: [
        {
          type: "p",
          text: "To maximise the margin we need a formula for it. There's a subtlety first: the line $w^Tx + b = 0$ is the same line as $2w^Tx + 2b = 0$, because scaling w and b doesn't move it. So we fix the scale with a convenient convention (the **canonical form**): choose w and b so that the support vectors satisfy $w^Tx + b = +1$ (positive side) and $w^Tx + b = -1$ (negative side).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Key geometry (memorise)",
          text: "- **Constraints:** $w^Tx_i + b \\ge +1$ for $y_i = +1$ and $w^Tx_i + b \\le -1$ for $y_i = -1$. Combined: $y_i(w^Tx_i + b) \\ge 1$.\n- **Margin lines** (the edges of the road, through the support vectors): $w^Tx + b = \\pm 1$\n- **Decision boundary** (the centre line): $w^Tx + b = 0$\n- **Margin width:** $\\dfrac{2}{\\|w\\|}$\n- **Distance of any point x from the boundary:** $\\dfrac{|w^Tx + b|}{\\|w\\|}$\n\n$\\|w\\|$ is the length of w: $\\sqrt{w_1^2 + w_2^2 + \\dots}$",
        },
        {
          type: "p",
          text: "**Where does 2/‖w‖ come from?** The distance of a point from a line is $|w^Tx + b|/\\|w\\|$. A support vector on the positive edge has $w^Tx + b = 1$, so it's $1/\\|w\\|$ from the centre line. The negative edge is the same distance on the other side. Total road width: $2/\\|w\\|$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example",
          text: "An SVM has $w = (1, 1)$ and $b = -3$.\n\n- Boundary: $x_1 + x_2 - 3 = 0$, i.e. $x_1 + x_2 = 3$\n- Margin lines: $x_1 + x_2 = 4$ and $x_1 + x_2 = 2$\n- $\\|w\\| = \\sqrt{1 + 1} = 1.414$, so the margin $= 2/1.414 = $ **1.414**\n- The point (2, 2): $w^Tx + b = 2 + 2 - 3 = 1$. It sits exactly on the positive margin line: a **support vector**.\n- The point (3, 3): $w^Tx + b = 3$; distance $= 3/1.414 = 2.12$ from the boundary. Safely on the positive side, not a support vector.",
        },
        {
          type: "p",
          text: "**The key consequence.** Maximising the margin $2/\\|w\\|$ is the same as making $\\|w\\|$ as **small** as possible, while keeping every point on the correct side of its margin line. That turns “find the widest road” into an optimisation problem.",
        },
      ],
    },
    {
      id: "opt",
      heading: "Lesson 3: How is the best line found? The optimisation problem",
      slides: "13–16",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "The primal problem (hard margin)",
          text: "Find w and b such that\n$$\\Phi(w) = \\tfrac12 \\|w\\|^2 \\text{ is minimised, subject to } y_i(w^Tx_i + b) \\ge 1 \\text{ for all } i$$\n\n(We minimise $\\frac12\\|w\\|^2$ rather than $\\|w\\|$ because it's smooth and has a clean derivative. The minimum is at the same w.)",
        },
        {
          type: "p",
          text: "**What kind of problem is this? (slide 14).** A **quadratic** objective with **linear** inequality constraints. This is a well-studied class called **quadratic programming (QP)**, with many reliable solvers. The standard route is to build a **dual problem**, attaching a **Lagrange multiplier** $\\alpha_i \\ge 0$ to each constraint (one per training point).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The Lagrangian and what it tells us (slide 15)",
          text: "$$L(w, b, \\alpha) = \\tfrac12\\|w\\|^2 - \\sum_i \\alpha_i \\big[ y_i(w^Tx_i + b) - 1 \\big]$$\n\nSetting the derivatives to zero:\n- $\\dfrac{\\partial L}{\\partial w} = 0 \\;\\Rightarrow\\;$ $$w = \\sum_i \\alpha_i y_i x_i$$\n- $\\dfrac{\\partial L}{\\partial b} = 0 \\;\\Rightarrow\\;$ $$\\sum_i \\alpha_i y_i = 0$$",
        },
        {
          type: "p",
          text: "**Reading those two results in plain words:**",
        },
        {
          type: "list",
          items: [
            "**w is a weighted sum of training points.** Each point contributes $\\alpha_i y_i x_i$. It turns out that $\\alpha_i > 0$ **only for support vectors**; every other point has $\\alpha_i = 0$ and contributes nothing. That's the maths behind “only the edge houses matter”.",
            "**The weights balance between classes:** the total α on the positive side equals the total α on the negative side.",
            "**Classifying a new point** becomes $f(x) = \\text{sign}\\big(\\sum_i \\alpha_i y_i \\, x_i^T x + b\\big)$. Notice the data appears **only as dot products** $x_i^T x$. Hold on to that; it's what makes kernels possible in Lesson 5.",
          ],
        },
      ],
    },
    {
      id: "soft",
      heading: "Lesson 4: What if the data is noisy? Soft margin and C",
      slides: "17–22",
      blocks: [
        {
          type: "p",
          text: "The **hard margin** so far demands that *every* training point be on the correct side, outside the road: **no training errors** (slide 17). Real data has noise: a mislabelled point, or a genuine case that just looks like the other class. One such point can force the road to become very narrow or twisted, or make separation impossible altogether.",
        },
        {
          type: "p",
          text: "**The fix: allow some rule-breaking, at a price (slide 18).** Give each point a **slack variable** $\\xi_i$ (“xi”) that measures how far it breaks the margin rule. The slide describes slack as giving the classifier *some leniency when moving around points near the margin*. Then add the total slack to the cost, weighted by a constant **C**:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Soft margin (slide 21)",
          text: "Find w and b such that\n$$\\Phi(w) = \\tfrac12 w^Tw + C \\sum_i \\xi_i \\text{ is minimised}$$\nsubject to $y_i(w^Tx_i + b) \\ge 1 - \\xi_i$ and $\\xi_i \\ge 0$ for all i.\n\nFor a given line, the slack of each point is $\\xi_i = \\max\\big(0,\\; 1 - y_i f(x_i)\\big)$, also called the **hinge loss**.",
        },
        {
          type: "table",
          caption: "What the slack value tells you",
          head: ["Slack $\\xi_i$", "Where the point is"],
          rows: [
            ["**0**", "Correct side, on or outside the margin: no violation"],
            ["**between 0 and 1**", "Correct side, but **inside** the margin (on the road)"],
            ["**exactly 1**", "Exactly on the decision boundary"],
            ["**greater than 1**", "On the **wrong side**: misclassified"],
          ],
        },
        { type: "diagram", name: "s7-slack" },
        {
          type: "p",
          text: "**What C does (slides 19, 22).** C decides how expensive rule-breaking is compared with a narrow road:",
        },
        {
          type: "table",
          head: ["", "Large C", "Small C"],
          rows: [
            ["Penalty for slack", "High: violations are expensive", "Low: violations are cheap"],
            ["Margin", "**Narrower**", "**Wider**"],
            ["Margin violations", "Fewer", "More (“many instances end up on the street”)"],
            ["Risk", "Overfitting: bends to every noisy point (close to a hard margin)", "Underfitting if too small; but often **generalises better**"],
          ],
        },
        {
          type: "p",
          text: "So **C is a hyperparameter that controls overfitting** (slide 21), playing the same role as λ in regularised regression, but in the opposite direction: large C = weak regularisation, small C = strong regularisation. Choose it by cross-validation.",
        },
      ],
    },
    {
      id: "kernel",
      heading: "Lesson 5: What if no straight line can separate the classes? Kernels",
      slides: "23–31",
      blocks: [
        {
          type: "p",
          text: "Soft margins handle a *few* awkward points. But some data is fundamentally not line-shaped (slide 24). Picture points on a number line: negatives at the far left and far right, positives in the middle. **No single cut point** separates them.",
        },
        {
          type: "p",
          text: "**The idea: lift the data into more dimensions.** Add a second coordinate, $x^2$. Now each point x becomes $(x, x^2)$ and sits on a U-shaped parabola. The middle points (small |x|) are low down; the outer points (large |x|) are high up. A **horizontal line** now separates them perfectly. A straight line in the new space corresponds to a non-linear boundary (two cut points) in the original space.",
        },
        { type: "diagram", name: "s7-lift" },
        {
          type: "p",
          text: "In general (slide 27): the original input space can always be mapped, by some transformation $\\Phi: x \\to \\phi(x)$, into a higher-dimensional **feature space** where the training set is separable. Then run an ordinary linear SVM there.",
        },
        {
          type: "p",
          text: "**The catch.** The feature space can be enormous. With 100 input features, all degree-2 terms already give 5,151 dimensions; degree 3 gives over 176,000. Computing φ for every point and taking dot products in that space would be very slow.",
        },
        {
          type: "p",
          text: "**The kernel trick (slide 25).** Remember Lesson 3: the SVM only ever uses the data through **dot products** $x_i^T x_j$. After mapping, those become $\\phi(x_i)^T \\phi(x_j)$. A **kernel function** is a shortcut that computes that feature-space dot product **directly from the original vectors**, without ever building φ:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Kernel",
          text: "$$K(x_i, x_j) = \\phi(x_i)^T \\phi(x_j)$$\n\nReplace every $x_i^T x_j$ in the SVM with $K(x_i, x_j)$, and you get a linear separator in the feature space, which is a non-linear boundary in the input space, at roughly the cost of an ordinary dot product. The SVM *never needs to represent the feature space explicitly*; the kernel plays the role of the dot product there (slide 30).",
        },
        {
          type: "table",
          caption: "Examples of kernel functions (slide 29)",
          head: ["Kernel", "$K(x_i, x_j)$", "Intuition"],
          rows: [
            ["**Linear**", "$x_i^T x_j$", "No mapping: the ordinary linear SVM"],
            ["**Polynomial** of power p", "$(1 + x_i^T x_j)^p$", "All feature products up to degree p"],
            ["**Gaussian (RBF)**", "$\\exp\\!\\left(-\\dfrac{\\|x_i - x_j\\|^2}{2\\sigma^2}\\right)$", "A similarity: 1 for identical points, → 0 far apart. Infinite-dimensional φ"],
            ["**Sigmoid**", "$\\tanh(\\beta_0 \\, x_i^T x_j + \\beta_1)$", "Behaves like a neural-network unit"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Seeing the trick work: degree-2 polynomial kernel (PYQ Q1d)",
          text: "For 2-D points, expand $K(x, z) = (1 + x_1z_1 + x_2z_2)^2$:\n$$1 + 2x_1z_1 + 2x_2z_2 + x_1^2z_1^2 + x_2^2z_2^2 + 2x_1x_2z_1z_2$$\nThat's exactly the dot product of\n$$\\phi(x) = \\big(1,\\ \\sqrt2 x_1,\\ \\sqrt2 x_2,\\ x_1^2,\\ x_2^2,\\ \\sqrt2 x_1x_2\\big)$$\nwith the same φ(z). The $\\sqrt2$ is there so that each cross term comes out with a factor of 2.\n\n**Check with numbers:** $x = (1, 2)$, $z = (3, -1)$.\n- **Kernel way:** $x^Tz = 3 - 2 = 1$, so $K = (1 + 1)^2 = $ **4**. Three multiplications.\n- **Feature way:** $\\phi(x) = (1, \\sqrt2, 2\\sqrt2, 1, 4, 2\\sqrt2)$, $\\phi(z) = (1, 3\\sqrt2, -\\sqrt2, 9, 1, -3\\sqrt2)$. Dot product $= 1 + 6 - 4 + 9 + 4 - 12 = $ **4** ✓",
        },
        {
          type: "p",
          text: "**About the RBF kernel.** Its σ controls how local the similarity is. A small σ means only very close points count as similar, giving wiggly, very flexible boundaries (overfitting risk). A large σ gives smooth boundaries.",
        },
      ],
    },
    {
      id: "multi",
      heading: "Lesson 6: More than two classes, and solving SVM questions by hand",
      slides: "32–39",
      blocks: [
        {
          type: "p",
          text: "**Multiple classes (slides 32–34).** SVMs are inherently **binary**. For K classes, use the strategies from Sessions 3 and 5: **One-vs-Rest** (K SVMs; pick the class whose $w_k^Tx + b_k$ is largest) or **One-vs-One** ($K(K-1)/2$ SVMs; majority vote). OvO suits SVMs well because each small two-class problem trains quickly.",
        },
        {
          type: "p",
          text: "**Extras on slides 35–36:** the regression metrics MAE, MSE, RMSE and R² (Sessions 2 and 4), and the gradient-descent variants (batch, stochastic, mini-batch; Session 4).",
        },
        {
          type: "callout",
          kind: "exam",
          title: "Recipe 1: maximum-margin line for a few 2-D points (slides 37–38)",
          text: "1. **Plot** the points roughly.\n2. **Guess the support vectors:** the points of each class closest to the other class.\n3. Draw the line through the support vectors of **one** class (if it has two).\n4. Draw the **parallel** line through the support vector of the other class.\n5. The **decision boundary** is the parallel line exactly **midway**.\n6. **Check** that every point is on the correct side (a quick $g = $ line expression for each).\n7. For **canonical w and b**, scale the boundary equation so that it equals ±1 on the margin lines. Then margin $= 2/\\|w\\|$.",
        },
        {
          type: "callout",
          kind: "exam",
          title: "Recipe 2: non-separable data (XOR, PYQ Q5)",
          text: "1. **Choose φ** so the classes separate. For XOR, use $z = x_1x_2$: same signs → +1, different signs → −1.\n2. **Transform** every point and tabulate.\n3. **Support vectors** = the transformed points closest to the other class (for XOR, all four, since z = ±1).\n4. **Hyperplane in the new space:** solve $w z + b = +1$ and $-1$ at the support vectors (XOR: w = 1, b = 0, so z = 0; margin 2).\n5. **Map back:** substitute φ. XOR: $x_1x_2 = 0$, i.e. the two axes. Rule: class = sign($x_1x_2$).",
        },
        { type: "diagram", name: "s7-xor" },
        {
          type: "callout",
          kind: "exam",
          title: "Recipe 3: kernel value questions (PYQ Q1d, homework Q2)",
          text: "1. Write $\\phi(x)$ explicitly (degree 2: $(1, \\sqrt2x_1, \\sqrt2x_2, x_1^2, x_2^2, \\sqrt2x_1x_2)$).\n2. Compute $\\phi$ for both points.\n3. Take their dot product.\n4. **Verify** with $(1 + x^Tz)^2$ computed directly. Same number = the kernel trick.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in six lines",
          text: "1. Among all separating lines, pick the one with the **widest margin**; it's the most robust.\n2. Canonical form: $y_i(w^Tx_i + b) \\ge 1$; margin lines $w^Tx + b = \\pm1$; margin $= 2/\\|w\\|$.\n3. Primal: minimise $\\frac12\\|w\\|^2$. Dual: $w = \\sum\\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$; only **support vectors** have $\\alpha_i > 0$.\n4. Soft margin: add $C\\sum\\xi_i$, slack $\\xi = \\max(0, 1 - yf(x))$. Large C → narrow margin, overfit risk; small C → wide margin.\n5. Non-separable data: map to a higher dimension with φ. The dual uses only dot products, so replace them with a **kernel** $K = \\phi(x)^T\\phi(z)$.\n6. Kernels: linear, polynomial $(1 + x^Tz)^p$, RBF $e^{-\\|x - z\\|^2/2\\sigma^2}$, sigmoid. Multiclass via OvR/OvO.",
        },
      ],
    },
  ],

  glossary: [
    ["SVM", "Support Vector Machine", "A classifier that finds the widest-margin separating boundary"],
    ["LSVM", "Linear SVM", "The maximum-margin linear classifier"],
    ["Hyperplane", "—", "A flat boundary: a line in 2-D, a plane in 3-D"],
    ["w", "Weight vector", "Perpendicular to the boundary; sets its orientation"],
    ["b", "Bias", "Shifts the boundary"],
    ["sign(·)", "—", "+1 if positive, −1 if negative"],
    ["Margin", "—", "Width of the gap between the classes: $2/\\|w\\|$"],
    ["‖w‖", "Norm of w", "Length of w: $\\sqrt{w_1^2 + w_2^2 + \\dots}$"],
    ["Support vectors", "—", "Training points on the margin lines; they alone determine the boundary"],
    ["Canonical form", "—", "Scaling w, b so that $w^Tx + b = \\pm 1$ at the support vectors"],
    ["Primal problem", "—", "Minimise $\\frac12\\|w\\|^2$ subject to $y_i(w^Tx_i + b) \\ge 1$"],
    ["QP", "Quadratic Programming", "Optimising a quadratic objective with linear constraints"],
    ["Lagrange multiplier $\\alpha_i$", "—", "One per constraint; > 0 only for support vectors"],
    ["Dual problem", "—", "The reformulation in terms of α; depends only on dot products"],
    ["Hard margin", "—", "No training errors allowed"],
    ["Soft margin", "—", "Allows violations via slack, penalised by C"],
    ["Slack $\\xi_i$", "Xi", "How much a point violates the margin; > 1 means misclassified"],
    ["Hinge loss", "—", "$\\max(0, 1 - yf(x))$, equal to the slack"],
    ["C", "—", "Penalty on slack: large C = narrow margin, small C = wide margin"],
    ["φ(x)", "Feature map", "Transforms the input into a (higher-dimensional) feature space"],
    ["Kernel K(x, z)", "—", "$\\phi(x)^T\\phi(z)$ computed directly, without φ"],
    ["Kernel trick", "—", "Replacing dot products with a kernel to get non-linear boundaries cheaply"],
    ["RBF", "Radial Basis Function (Gaussian) kernel", "$\\exp(-\\|x - z\\|^2 / 2\\sigma^2)$"],
    ["σ (in RBF)", "Sigma", "Width of the Gaussian: small = very local, wiggly boundary"],
    ["tanh", "Hyperbolic tangent", "Used in the sigmoid kernel"],
    ["OvR / OvO", "One-vs-Rest / One-vs-One", "Strategies to use a binary SVM for many classes"],
  ],

  examTips: [
    "**SVM appears in every paper:** PYQ Q1(d) polynomial kernel (2 marks) and Q5 XOR feature map (6 marks). Revision Q6 covers the linear SVM hyperplane and the 1-D kernel trick.",
    "Kernel questions: write $\\phi(x)$ explicitly, compute $\\phi(x_1)$ and $\\phi(x_2)$, take their dot product, and **verify** with $(1 + x_1^Tx_2)^2$.",
    "Hyperplane questions: identify the support vectors, write the margin lines $w^Tx + b = \\pm1$, then the boundary $w^Tx + b = 0$. Give the margin $2/\\|w\\|$ (not $1/\\|w\\|$).",
    "“Express the boundary back in the original space”: substitute φ back, e.g. $z = x_1x_2 = 0$ gives the two axes.",
    "C questions: large C → narrow margin, fewer violations, overfitting risk; small C → wider margin, more violations, often generalises better.",
  ],

  problems: [
    {
      title: "Polynomial kernel: feature map and kernel value",
      pyq: "Midsem Q1(d): K(x, x′) = (1 + x·x′)², x₁ = (1,3), x₂ = (2,1)",
      level: "Medium",
      marks: 2,
      hint: "Expand (1 + x₁z₁ + x₂z₂)² and group the terms: each term should be (something in x) × (the same thing in z). The cross terms have a 2, which is why √2 appears in φ.",
      question:
        "For $K(x,z) = (1 + x^Tz)^2$ with $x, z \\in \\mathbb R^2$: (a) derive the feature map $\\phi(x)$. (b) For $x_a = (1, 2)$ and $x_b = (3, -1)$, compute $\\phi(x_a)$, $\\phi(x_b)$ and $K(x_a, x_b)$ both ways.",
      solution: `
### What is being asked
Show that the kernel equals a dot product in a 6-D feature space (Lesson 5).

### Why this approach
If we can write $K(x, z)$ as a sum of terms each of the form (something of x) × (the same thing of z), those “somethings” are the components of φ.

### Working
**(a)**
$$(1 + x_1z_1 + x_2z_2)^2 = 1 + 2x_1z_1 + 2x_2z_2 + x_1^2z_1^2 + x_2^2z_2^2 + 2x_1x_2z_1z_2$$
Split each term into an x-part and a z-part: $2x_1z_1 = (\\sqrt2x_1)(\\sqrt2z_1)$, and so on. So
$$\\phi(x) = (1,\\ \\sqrt2x_1,\\ \\sqrt2x_2,\\ x_1^2,\\ x_2^2,\\ \\sqrt2x_1x_2)$$

**(b)**
- $\\phi(x_a) = (1,\\ \\sqrt2,\\ 2\\sqrt2,\\ 1,\\ 4,\\ 2\\sqrt2)$
- $\\phi(x_b) = (1,\\ 3\\sqrt2,\\ -\\sqrt2,\\ 9,\\ 1,\\ -3\\sqrt2)$
- Dot product: $1 + (\\sqrt2)(3\\sqrt2) + (2\\sqrt2)(-\\sqrt2) + 9 + 4 + (2\\sqrt2)(-3\\sqrt2) = 1 + 6 - 4 + 9 + 4 - 12 = 4$
- Direct: $x_a^Tx_b = 3 - 2 = 1$, so $K = (1 + 1)^2 = 4$

### Answer
$\\phi(x) = (1, \\sqrt2x_1, \\sqrt2x_2, x_1^2, x_2^2, \\sqrt2x_1x_2)$; **K = 4** both ways ✓

### Takeaway
The 2-D kernel calculation gives the same answer as the 6-D dot product with far less work. That's the kernel trick. (For the PYQ's points (1, 3) and (2, 1): $x^Tz = 5$, so K = 36.)`,
    },
    {
      title: "Maximum-margin hyperplane by hand",
      pyq: "SVM homework / revision Q6",
      level: "Hard",
      marks: 6,
      hint: "Plot the points. The closest positives to the negative group are (2, 3) and (3, −1); the closest negative is (1, 0). Draw the line through the two positive SVs, then a parallel line through (1, 0), then go midway.",
      question:
        "Positive: (3,2), (4,3), (2,3), (3,−1). Negative: (1,0), (1,−1), (0,2), (−1,2). Find the linear SVM hyperplane, the support vectors, the canonical w and b, and the margin.",
      solution: `
### What is being asked
Solve a small linear SVM by hand using the graphical method (Lesson 6, recipe 1).

### Why this approach
The boundary is determined only by the support vectors. Two parallel lines through the SVs of each class, with the boundary midway, give the widest road.

### Formulas
$$\\text{margin lines: } w^Tx + b = \\pm1, \\qquad \\text{margin} = \\frac{2}{\\|w\\|}$$

### Working
**Support vectors:** (2, 3) and (3, −1) on the positive side; (1, 0) on the negative side.

**Line through the positive SVs:** slope $= (-1 - 3)/(3 - 2) = -4$, so $y = -4x + 11$, i.e. $4x + y = 11$.

**Parallel line through (1, 0):** $4(1) + 0 = 4$, so $4x + y = 4$.

**Boundary (midway):** $4x + y = (11 + 4)/2 = 7.5$.

**Check every point** with $g = 4x + y$:
- Positives: (3, 2) → 14, (4, 3) → 19, (2, 3) → 11, (3, −1) → 11. All ≥ 11 ✓
- Negatives: (1, 0) → 4, (1, −1) → 3, (0, 2) → 2, (−1, 2) → −2. All ≤ 4 ✓

**Canonical form:** on the margin lines, $4x + y - 7.5 = \\pm 3.5$. Divide by 3.5 so it equals ±1:
- $w = (4/3.5,\\ 1/3.5) = (8/7,\\ 2/7) \\approx (1.143, 0.286)$
- $b = -7.5/3.5 = -15/7 \\approx -2.143$

**Margin:** $\\|w\\| = \\sqrt{(64 + 4)/49} = \\sqrt{68}/7$, so the margin $= 2/\\|w\\| = 14/\\sqrt{68} = 1.698$.

### Answer
Boundary **$4x + y = 7.5$**; support vectors **(2, 3), (3, −1), (1, 0)**; $w = (8/7, 2/7)$, $b = -15/7$; margin **1.698**.

### Takeaway
Always check that no other point sits inside the road; if one does, you picked the wrong support vectors. (A numerical search over all orientations confirms $w \\parallel (4, 1)$ gives the widest margin.)`,
    },
    {
      title: "XOR with a feature map",
      pyq: "Midsem Q5 (6 marks)",
      level: "Hard",
      marks: 6,
      hint: "Try multiplying the two coordinates. What sign does x₁x₂ have for each class?",
      question: `XOR data (not linearly separable):

| x₁ | x₂ | Class |
|---|---|---|
| 1 | 1 | +1 |
| −1 | −1 | +1 |
| 1 | −1 | −1 |
| −1 | 1 | −1 |

(a) Suggest $\\phi(x_1, x_2)$ that makes the data linearly separable. (b) Identify the support vectors in the transformed space. (c) Write the maximum-margin hyperplane there. (d) Express the boundary in the original space.`,
      solution: `
### What is being asked
The classic non-linear SVM problem (Lesson 6, recipe 2).

### Why this approach
Same-sign coordinates give class +1 and opposite signs give −1. The product $x_1x_2$ captures exactly that.

### Working
**(a)** $\\phi(x_1, x_2) = x_1x_2$, or in 3-D $\\phi = (x_1, x_2, x_1x_2)$.

| x | $z = x_1x_2$ | class |
|---|---|---|
| (1, 1) | 1 | +1 |
| (−1, −1) | 1 | +1 |
| (1, −1) | −1 | −1 |
| (−1, 1) | −1 | −1 |

Now +1 ↔ z = 1 and −1 ↔ z = −1: **linearly separable**.

**(b)** Every point lies exactly at z = ±1, the closest the two classes get, so **all four points are support vectors**.

**(c)** Solve $wz + b = \\pm 1$ at the support vectors:
- $w(1) + b = +1$
- $w(-1) + b = -1$

Adding gives $2b = 0$, so $b = 0$ and $w = 1$. Hyperplane: **z = 0**. In 3-D: $0 \\cdot x_1 + 0 \\cdot x_2 + 1 \\cdot x_1x_2 = 0$. Margin $= 2/\\|w\\| = 2$.

**(d)** Substitute $z = x_1x_2$: boundary **$x_1x_2 = 0$**, i.e. the two coordinate axes. Rule: class = sign$(x_1x_2)$: +1 in quadrants I and III, −1 in II and IV.

### Answer
(a) $z = x_1x_2$ (b) all four points (c) $z = 0$, with w = 1, b = 0, margin 2 (d) $x_1x_2 = 0$ (the axes)

### Takeaway
A single well-chosen feature turned an impossible problem into a trivial one. The degree-2 polynomial kernel contains the $\\sqrt2x_1x_2$ term, so it solves XOR implicitly.`,
    },
    {
      title: "1-D kernel trick (revision deck Q6b)",
      pyq: "Revision deck Q6",
      level: "Medium",
      marks: 4,
      hint: "Positives are in the middle (around 3), negatives on the outside. Try z = (x − 3)², which is small near 3 and large far away.",
      question:
        "Positive points: x = 2, 3, 4. Negative points: x = 0, 1, 5, 6 (all on a line). Use a transformation to make them linearly separable, find the SVM boundary, and map it back.",
      solution: `
### What is being asked
Lift 1-D data into 2-D so a straight line separates it (Lesson 5's opening example).

### Why this approach
The pattern is − − + + + − −, so no single cut works. A squared distance from the centre puts the middle points low and the outer points high.

### Working
Use $z = (x - 3)^2$:

| x | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| class | − | − | + | + | + | − | − |
| z | 9 | 4 | 1 | 0 | 1 | 4 | 9 |

Positives have z ≤ 1; negatives have z ≥ 4.

**Support vectors:** (2, 1), (4, 1) on the positive side; (1, 4), (5, 4) on the negative side.

**Boundary** midway: $z = (1 + 4)/2 = 2.5$.

**Map back:** $(x - 3)^2 = 2.5 \\Rightarrow x = 3 \\pm \\sqrt{2.5} = 3 \\pm 1.58$.

### Answer
Boundary **z = 2.5** in the new space → **x = 1.42 and x = 4.58** in the original space. Predict + between them.

### Takeaway
A horizontal line in the lifted space becomes **two** cut points on the original line. Non-linear in x, linear in φ(x).`,
    },
    {
      title: "Margins, slack and the soft-margin objective",
      level: "Medium",
      marks: 5,
      hint: "For each point: f = x₁ + x₂ − 3, then y·f, then ξ = max(0, 1 − y·f). ξ = 0 and y·f = 1 means a support vector; 0 < ξ ≤ 1 means inside the margin; ξ > 1 means misclassified.",
      question:
        "An SVM has $w = (1, 1)$, $b = -3$. For each point compute $f(x) = w^Tx + b$, $y f(x)$ and the slack $\\xi = \\max(0, 1 - yf(x))$, and say whether it is a support vector, a margin violation or misclassified: (1,1)−, (2,2)+, (3,3)+, (2,0.5)−, (1.8,1.5)+, (1,1.5)+. Then compute the margin and the soft-margin objective for C = 1 and C = 10.",
      solution: `
### What is being asked
Read slack values (Lesson 4) and evaluate the soft-margin cost.

### Formulas
$$\\xi_i = \\max(0,\\ 1 - y_if(x_i)), \\qquad \\text{objective} = \\tfrac12\\|w\\|^2 + C\\sum\\xi_i, \\qquad \\text{margin} = \\frac{2}{\\|w\\|}$$

### Working
| x | y | f(x) | y·f | ξ | status |
|---|---|---|---|---|---|
| (1, 1) | − | −1 | 1 | 0 | **support vector** (on the margin) |
| (2, 2) | + | 1 | 1 | 0 | **support vector** |
| (3, 3) | + | 3 | 3 | 0 | safe |
| (2, 0.5) | − | −0.5 | 0.5 | 0.5 | inside the margin, correct |
| (1.8, 1.5) | + | 0.3 | 0.3 | 0.7 | inside the margin, correct |
| (1, 1.5) | + | −0.5 | −0.5 | 1.5 | **misclassified** (ξ > 1) |

$\\sum\\xi = 0.5 + 0.7 + 1.5 = 2.7$

- Margin $= 2/\\sqrt2 = 1.414$
- $\\frac12\\|w\\|^2 = \\frac12(1 + 1) = 1$
- C = 1: $1 + 1(2.7) = 3.7$
- C = 10: $1 + 10(2.7) = 28$

### Answer
Margin **1.414**; objective **3.7** (C = 1) and **28** (C = 10).

### Takeaway
With C = 10 the violations dominate the cost, so the optimiser would prefer a narrower margin with fewer violations. That's large C pushing toward a hard margin.`,
    },
    {
      title: "Recovering w and b from the dual",
      level: "Hard",
      marks: 4,
      hint: "Write w = α(2,2) − α(0,0). Then use the margin condition at each support vector: w·x + b = +1 for the positive one and −1 for the negative one.",
      question:
        "A hard-margin SVM on two points gives support vectors $x_1 = (2,2)$, $y_1 = +1$ and $x_2 = (0,0)$, $y_2 = -1$, with $\\alpha_1 = \\alpha_2 = \\alpha$. Use $w = \\sum \\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$ and the margin conditions to find α, w, b and the margin.",
      solution: `
### What is being asked
Use the dual results from Lesson 3 to rebuild the boundary.

### Formulas
$$w = \\sum_i \\alpha_i y_i x_i, \\qquad \\sum_i \\alpha_i y_i = 0, \\qquad w^Tx_{SV} + b = y_{SV}$$

### Working
- $\\sum\\alpha_iy_i = \\alpha - \\alpha = 0$ ✓
- $w = \\alpha(+1)(2, 2) + \\alpha(-1)(0, 0) = (2\\alpha, 2\\alpha)$
- At $x_2 = (0, 0)$: $0 + b = -1 \\Rightarrow b = -1$
- At $x_1 = (2, 2)$: $2\\alpha \\cdot 2 + 2\\alpha \\cdot 2 - 1 = 1 \\Rightarrow 8\\alpha = 2 \\Rightarrow \\alpha = 0.25$
- $w = (0.5, 0.5)$; boundary $0.5x_1 + 0.5x_2 - 1 = 0$, i.e. $x_1 + x_2 = 2$
- $\\|w\\| = \\sqrt{0.25 + 0.25} = 0.7071$, so the margin $= 2/0.7071 = 2.83$

### Answer
α = **0.25**, w = **(0.5, 0.5)**, b = **−1**, margin **2.83**.

### Takeaway
With only two points, the margin equals the distance between them ($\\sqrt{8} = 2.83$), and the boundary is their perpendicular bisector, as you'd expect.`,
    },
    {
      title: "RBF and linear kernel values",
      level: "Easy",
      marks: 3,
      hint: "Linear = dot product. Polynomial = (1 + dot product)³. RBF: compute the squared distance ‖x − z‖² first, then e^(−γ × distance²).",
      question:
        "For $x = (1, 2)$ and $z = (2, 0)$ compute (a) the linear kernel, (b) the polynomial kernel $(1 + x^Tz)^3$, (c) the RBF kernel with $\\gamma = 1/(2\\sigma^2) = 0.5$. (d) What happens to the RBF value as the points move apart?",
      solution: `
### What is being asked
Evaluate the common kernels from slide 29 (Lesson 5).

### Working
**(a)** $x^Tz = 1 \\times 2 + 2 \\times 0 = 2$

**(b)** $(1 + 2)^3 = 27$

**(c)** $\\|x - z\\|^2 = (1 - 2)^2 + (2 - 0)^2 = 1 + 4 = 5$, so $K = e^{-0.5 \\times 5} = e^{-2.5} = 0.082$

### Answer
(a) **2** (b) **27** (c) **0.082**

**(d)** It decays toward **0**. RBF is a *similarity*: 1 for identical points, about 0 for distant ones.

### Takeaway
A small σ (large γ) makes similarity very local, which gives wiggly boundaries and a risk of overfitting.`,
    },
    {
      title: "Why kernels save computation",
      level: "Medium",
      marks: 3,
      hint: "$\\binom{102}{2} = 102 \\times 101 / 2$. Compare building and multiplying two vectors of that length with one 100-term dot product.",
      question:
        "With n = 100 input features, a full degree-2 polynomial feature map (with bias and linear terms) has $\\binom{n+2}{2}$ dimensions. (a) How many? (b) Compare the cost of an explicit dot product with the kernel. (c) Which kernel corresponds to an infinite-dimensional φ?",
      solution: `
### What is being asked
Quantify why the kernel trick matters (Lesson 5).

### Working
**(a)** $\\binom{102}{2} = \\frac{102 \\times 101}{2} = 5151$ dimensions

**(b)**
- *Explicit:* build two 5,151-dimensional vectors, then a 5,151-term dot product.
- *Kernel:* $(1 + x^Tz)^2$ is one 100-term dot product, an addition and a square, so about **50× cheaper**.
- For degree 3: $\\binom{103}{3} = 176{,}851$ dimensions, so the saving explodes.

**(c)** The **Gaussian RBF** kernel: its feature space is infinite-dimensional, so it can *only* be used through the kernel.

### Answer
(a) **5,151** (b) the kernel is about 50× cheaper (c) **RBF**

### Takeaway
Kernels let SVMs work in huge (even infinite) feature spaces at the cost of an ordinary dot product.`,
    },
  ],

  theory: [
    {
      title: "Maximum margin and support vectors",
      marks: 3,
      question: "Why does an SVM choose the maximum-margin hyperplane? What are support vectors and why are they important?",
      solution: `
### What the examiner wants
The robustness argument, the definition of support vectors, and why they matter (sparsity, sensitivity).

### Model answer
- **Why maximum margin:** many hyperplanes separate the training data. One that passes close to some training points is fragile: a new point near them, even of the correct class, may fall on the wrong side. Maximising the margin gives the most “safety room”, so the classifier is more **robust to noise** and **generalises better**.
- **Support vectors:** the training points on the margin boundaries $w^Tx + b = \\pm1$, nearest to the hyperplane. The max-margin hyperplane is **completely determined** by them ($\\alpha_i > 0$ only for them).
- **Why important:** removing a non-support vector doesn't change the solution; removing a support vector alters the hyperplane. The model is sparse: prediction needs only the support vectors.

### Takeaway
Widest road between two villages; the edge houses define the road.`,
    },
    {
      title: "Hard margin vs soft margin, and C",
      marks: 4,
      question: "Differentiate hard- and soft-margin SVM with their formulations. Explain the role of the slack variables and of C.",
      solution: `
### What the examiner wants
Both formulations written out, the meaning of the slack ranges, and the effect of C in both directions.

### Model answer
**Hard margin:** minimise $\\frac12 w^Tw$ s.t. $y_i(w^Tx_i + b) \\ge 1$ for all i. No training errors; only works for linearly separable, noise-free data and is sensitive to outliers.

**Soft margin:** minimise $\\frac12 w^Tw + C\\sum\\xi_i$ s.t. $y_i(w^Tx_i + b) \\ge 1 - \\xi_i$, $\\xi_i \\ge 0$.

**Slack $\\xi_i$** gives leniency:
- ξ = 0: correct and outside the margin
- 0 < ξ ≤ 1: inside the margin
- ξ > 1: misclassified

**C** weights the slack penalty:
- **Large C:** violations are costly → narrower margin, fewer violations; close to a hard margin, with a risk of overfitting.
- **Small C:** wider margin, more violations tolerated; often generalises better, but too small underfits.

### Takeaway
C is the regularisation knob that controls overfitting.`,
    },
    {
      title: "The kernel trick",
      marks: 4,
      question: "Explain the kernel trick. Why is it needed, and why does it work for SVMs? List common kernels.",
      solution: `
### What the examiner wants
The need (non-separable data, expensive φ), **why** it works (the dual uses only dot products), the result, and the four kernels.

### Model answer
- **Need:** some data isn't linearly separable in the input space (XOR, concentric circles). Mapping to a higher-dimensional space φ(x) can make it separable, but computing φ explicitly may be very expensive or even infinite-dimensional.
- **Why it works:** the SVM dual and its decision function use the data **only through dot products** $x_i^Tx_j$. Replace every dot product with a kernel $K(x_i, x_j) = \\phi(x_i)^T\\phi(x_j)$, computed directly from the original vectors.
- **Result:** a linear separator in feature space, which is a non-linear boundary in input space, at roughly the cost of the original dot product.
- **Common kernels:**
  - Linear: $x^Tz$
  - Polynomial: $(1 + x^Tz)^p$
  - Gaussian RBF: $\\exp(-\\|x - z\\|^2/2\\sigma^2)$
  - Sigmoid: $\\tanh(\\beta_0 x^Tz + \\beta_1)$

### Takeaway
Mention the degree-2 check $(1 + x^Tz)^2 = \\phi(x)^T\\phi(z)$ as an example for extra credit.`,
    },
    {
      title: "Primal and dual formulations",
      marks: 3,
      question: "Write the SVM primal problem and the Lagrangian. What conditions come from setting the derivatives to zero, and what do they tell us?",
      solution: `
### What the examiner wants
The primal, the Lagrangian, the two conditions, and their interpretation.

### Model answer
**Primal:** $\\min_{w,b}\\ \\frac12\\|w\\|^2$ s.t. $y_i(w^Tx_i + b) \\ge 1$. A quadratic objective with linear constraints (a QP).

**Lagrangian:** $L = \\frac12\\|w\\|^2 - \\sum_i\\alpha_i[y_i(w^Tx_i + b) - 1]$, with $\\alpha_i \\ge 0$.

**Conditions:**
- $\\partial L/\\partial w = 0 \\Rightarrow w = \\sum_i\\alpha_iy_ix_i$: w is a combination of training points, and only support vectors ($\\alpha_i > 0$) contribute.
- $\\partial L/\\partial b = 0 \\Rightarrow \\sum_i\\alpha_iy_i = 0$: the α weights balance between the classes.

Substituting back gives the **dual**, which depends only on $x_i^Tx_j$. That enables kernels.

### Takeaway
The dual is where “only support vectors matter” and “only dot products appear” both come from.`,
    },
    {
      title: "SVM vs logistic regression",
      marks: 3,
      question: "Compare SVM and logistic regression.",
      solution: `
### What the examiner wants
A table comparing objective, output, which points matter, non-linearity and when to use each.

### Model answer
| | SVM | Logistic regression |
|---|---|---|
| Objective | Maximise margin (hinge loss + $\\|w\\|^2$) | Maximise likelihood (log-loss) |
| Output | Class (sign); scores are not probabilities | Probability $P(y = 1 \\mid x)$ |
| Which points matter | Only the **support vectors** | All points contribute |
| Non-linear boundaries | Natural via **kernels** | Needs explicit feature engineering |
| Outliers | Soft margin (C) limits their influence | Can be pulled by far points |
| Multiclass | OvA/OvO | OvA or softmax |
| Use when | Clear-margin, high-dimensional data (text, images) | You need probabilities and interpretability |

### Takeaway
Both are discriminative linear classifiers. SVM optimises the gap; logistic regression optimises the probabilities.`,
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
    { q: "Removing a training point that is NOT a support vector will:", options: ["Shift the boundary", "Leave the boundary unchanged", "Shrink the margin", "Make the problem non-separable"], answer: 1, why: "Only support vectors (α > 0) determine the hyperplane." },
  ],
};
