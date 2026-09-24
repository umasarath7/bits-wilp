// AML — Mock mid-semester paper in the same pattern as the previous paper (30 marks)
// Solutions follow the teaching layout: what is asked → why this approach → formula → working → answer → takeaway.

export default {
  title: "Mock Mid-sem Paper",
  source: "Practice paper · same pattern as the previous mid-sem · 30 marks · 2 hours",
  overview:
    "A full practice paper that follows the exact structure of the previous mid-sem: Q1 short numericals (4 × 2), Q2 short theory (3 × 2), Q3 Naïve Bayes (5), Q4 regression (5), Q5 SVM with a feature map (6). The scenarios are new, but the skills are the same. Set a 2-hour timer, write your answers on paper, then open the solutions. Each solution explains *why* the method fits before calculating.",

  summary: [
    {
      id: "instructions",
      heading: "How to use this paper",
      slides: "",
      blocks: [
        { type: "list", ordered: true, items: [
          "Set a **2-hour** timer. Attempt everything on paper, showing tables and steps as you would upload them.",
          "Open the **Numerical** tab for Q1, Q3, Q4 and Q5, and the **Theory** tab for Q2.",
          "Stuck? Press **💡 Hint** before giving up and opening the solution.",
          "Mark yourself with the solutions. Tick **Done** for each question you got fully right.",
          "Re-attempt any question you got wrong after revising its session: Q1 → S2/S3/S7, Q2 → S1/S4/S2, Q3 → S6, Q4 → S4, Q5 → S7.",
        ]},
      ],
    },
  ],

  problems: [
    {
      title: "Q1 (a) Distances",
      level: "Easy",
      marks: 2,
      hint: "Write the three absolute differences first. Euclidean = √(sum of squares), Manhattan = sum, supremum = the largest.",
      question: "Two customers are described by (orders, returns, reviews): P = [2, −1, 4] and Q = [5, 3, 0]. Compute the Euclidean, Manhattan and supremum distances.",
      solution: `
### What is being asked
Three Minkowski distances (Session 2, Lesson 10).

### Formulas
$$L_2 = \\sqrt{\\sum (P_k - Q_k)^2}, \\qquad L_1 = \\sum |P_k - Q_k|, \\qquad L_\\infty = \\max_k |P_k - Q_k|$$

### Working
Differences: $|2 - 5| = 3$, $|-1 - 3| = 4$, $|4 - 0| = 4$

- Euclidean: $\\sqrt{9 + 16 + 16} = \\sqrt{41} = 6.403$
- Manhattan: $3 + 4 + 4 = 11$
- Supremum: $\\max(3, 4, 4) = 4$

### Answer
Euclidean **6.403**, Manhattan **11**, supremum **4**.

### Takeaway
$L_1 \\ge L_2 \\ge L_\\infty$ holds here (11 ≥ 6.403 ≥ 4), a quick self-check.`,
    },
    {
      title: "Q1 (b) Metrics from a confusion matrix",
      level: "Easy",
      marks: 2,
      hint: "Precision = TP ÷ (TP + FP); recall = TP ÷ (TP + FN). For F1, use 2TP ÷ (2TP + FP + FN).",
      question: `A disease-screening model tested on 500 patients:

| | Predicted Positive | Predicted Negative |
|---|---|---|
| Actual Positive | 72 (TP) | 28 (FN) |
| Actual Negative | 18 (FP) | 382 (TN) |

Compute accuracy, precision, recall and F1.`,
      solution: `
### What is being asked
The four standard classification metrics (Session 3, Lessons 3–4).

### Formulas
$$\\text{Acc} = \\frac{TP + TN}{N}, \\quad P = \\frac{TP}{TP + FP}, \\quad R = \\frac{TP}{TP + FN}, \\quad F_1 = \\frac{2TP}{2TP + FP + FN}$$

### Working
- Accuracy $= (72 + 382)/500 = 454/500 = 0.908$
- Precision $= 72/(72 + 18) = 72/90 = 0.80$
- Recall $= 72/(72 + 28) = 72/100 = 0.72$
- F1 $= 144/(144 + 18 + 28) = 144/190 = 0.758$

### Answer
Accuracy **0.908**, precision **0.80**, recall **0.72**, F1 **0.758**.

### Takeaway
90.8% accuracy sounds good, but 28 of 100 sick patients are missed. Recall tells that story; accuracy hides it.`,
    },
    {
      title: "Q1 (c) Doctor vs insurer",
      level: "Medium",
      marks: 2,
      hint: "Sending a sick patient home = a false negative → recall. Sending a healthy person for tests = a false positive → precision.",
      question:
        "Using the model in (b): Dr. A says no sick patient should be sent home undiagnosed. Insurer B says healthy people shouldn't be sent for expensive follow-up tests. Who is more satisfied with this model? Justify using the metrics.",
      solution: `
### What is being asked
Match each concern to its metric (Session 3, Lesson 4).

### Working
- Dr. A worries about misses (FN) → **recall = 0.72**: 28 of 100 sick patients are missed (28%). That's serious for A.
- Insurer B worries about false alarms (FP) → **precision = 0.80**: only 18 of 90 referrals are healthy people.
- Precision (0.80) > recall (0.72).

### Answer
**Insurer B** is more satisfied.

### Takeaway
To satisfy Dr. A, lower the decision threshold to raise recall, accepting more false positives (and a less happy insurer).`,
    },
    {
      title: "Q1 (d) Polynomial kernel",
      level: "Medium",
      marks: 2,
      hint: "φ(x) = (1, √2x₁, √2x₂, x₁², x₂², √2x₁x₂). Then check your dot product against (1 + x₁·x₂)².",
      question:
        "For $K(x,z) = (1 + x^Tz)^2$, with $x_1 = (2, 1)$ and $x_2 = (1, -1)$, compute $\\phi(x_1)$, $\\phi(x_2)$ and $K(x_1,x_2)$.",
      solution: `
### What is being asked
The degree-2 feature map and the kernel value (Session 7, Lesson 5).

### Formula
$$\\phi(x) = (1, \\sqrt2x_1, \\sqrt2x_2, x_1^2, x_2^2, \\sqrt2x_1x_2)$$

### Working
- $\\phi(2, 1) = (1,\\ 2\\sqrt2,\\ \\sqrt2,\\ 4,\\ 1,\\ 2\\sqrt2)$
- $\\phi(1, -1) = (1,\\ \\sqrt2,\\ -\\sqrt2,\\ 1,\\ 1,\\ -\\sqrt2)$
- Dot product: $1 + (2\\sqrt2)(\\sqrt2) + (\\sqrt2)(-\\sqrt2) + 4 + 1 + (2\\sqrt2)(-\\sqrt2) = 1 + 4 - 2 + 4 + 1 - 4 = 4$
- Check: $x_1^Tx_2 = 2 - 1 = 1$, so $(1 + 1)^2 = 4$ ✓

### Answer
**K(x₁, x₂) = 4**, with the φ vectors above.

### Takeaway
Always show the direct check; it confirms the arithmetic and demonstrates the kernel trick.`,
    },
    {
      title: "Q3 Naïve Bayes: play tennis?",
      level: "Medium",
      marks: 5,
      hint: "Yes = 9 rows, No = 5 rows. For Sunny, Cool, High and Strong, count within Yes rows and within No rows. Multiply each column with its prior.",
      question: `Predict **Play** for ⟨Outlook = Sunny, Temp = Cool, Humidity = High, Wind = Strong⟩. Show the priors, likelihoods and normalised posteriors.

| Outlook | Temp | Humidity | Wind | Play |
|---|---|---|---|---|
| Sunny | Hot | High | Weak | No |
| Sunny | Hot | High | Strong | No |
| Overcast | Hot | High | Weak | Yes |
| Rain | Mild | High | Weak | Yes |
| Rain | Cool | Normal | Weak | Yes |
| Rain | Cool | Normal | Strong | No |
| Overcast | Cool | Normal | Strong | Yes |
| Sunny | Mild | High | Weak | No |
| Sunny | Cool | Normal | Weak | Yes |
| Rain | Mild | Normal | Weak | Yes |
| Sunny | Mild | Normal | Strong | Yes |
| Overcast | Mild | High | Strong | Yes |
| Overcast | Hot | Normal | Weak | Yes |
| Rain | Mild | High | Strong | No |`,
      solution: `
### What is being asked
A Naïve Bayes classification with four categorical attributes (Session 6, Lesson 5 recipe).

### Formula
$$\\text{score}(y) = P(y)\\prod_i P(X_i \\mid y), \\qquad P(y \\mid X) = \\frac{\\text{score}(y)}{\\sum \\text{scores}}$$

### Working
**Priors:** $P(\\text{Yes}) = 9/14 = 0.643$, $P(\\text{No}) = 5/14 = 0.357$

| Value | P(· \\| Yes) | P(· \\| No) |
|---|---|---|
| Outlook = Sunny | 2/9 | 3/5 |
| Temp = Cool | 3/9 | 1/5 |
| Humidity = High | 3/9 | 4/5 |
| Wind = Strong | 3/9 | 3/5 |

- Yes: $\\frac29 \\cdot \\frac39 \\cdot \\frac39 \\cdot \\frac39 \\cdot \\frac{9}{14} = 0.00823 \\times 0.643 = 0.00529$
- No: $\\frac35 \\cdot \\frac15 \\cdot \\frac45 \\cdot \\frac35 \\cdot \\frac{5}{14} = 0.0576 \\times 0.357 = 0.02057$
- $P(\\text{No} \\mid X) = 0.02057/(0.02057 + 0.00529) = 0.795$; $P(\\text{Yes} \\mid X) = 0.205$

### Answer
**Predicted: Play = No** (probability 0.795).

### Takeaway
Yes has the bigger prior, but three of the four query values (Sunny, High, Strong) are much more common on No days, and together they outweigh it.`,
    },
    {
      title: "Q4 Linear regression: study hours vs marks",
      level: "Easy",
      marks: 5,
      hint: "Means: x̄ = 6, ȳ = 66. Deviation table → slope = Σproduct ÷ Σsquares → intercept = ȳ − slope × x̄. For MSE, compute each prediction and squared error.",
      question: `| Study hours x | 2 | 4 | 6 | 8 | 10 |
|---|---|---|---|---|---|
| Marks y | 50 | 58 | 64 | 75 | 83 |

(a) Find the least-squares line $y = mx + b$. [2] (b) Predict the marks for 7 hours. [2] (c) Compute the MSE. [1]`,
      solution: `
### What is being asked
Least-squares line, prediction and MSE (Session 4, Lessons 4–5).

### Formulas
$$m = \\frac{\\sum(x - \\bar x)(y - \\bar y)}{\\sum(x - \\bar x)^2}, \\qquad b = \\bar y - m\\bar x, \\qquad \\text{MSE} = \\frac1n\\sum(y - \\hat y)^2$$

### Working
**(a)** $\\bar x = 30/5 = 6$, $\\bar y = 330/5 = 66$

| x | y | $x - \\bar x$ | $y - \\bar y$ | product | $(x - \\bar x)^2$ |
|---|---|---|---|---|---|
| 2 | 50 | −4 | −16 | 64 | 16 |
| 4 | 58 | −2 | −8 | 16 | 4 |
| 6 | 64 | 0 | −2 | 0 | 0 |
| 8 | 75 | 2 | 9 | 18 | 4 |
| 10 | 83 | 4 | 17 | 68 | 16 |
| | | | **Σ** | **166** | **40** |

$m = 166/40 = 4.15$; $b = 66 - 4.15 \\times 6 = 41.1$

**(b)** $\\hat y(7) = 4.15 \\times 7 + 41.1 = 29.05 + 41.1 = 70.15$

**(c)** Predictions: 49.4, 57.7, 66.0, 74.3, 82.6. Errors $(\\hat y - y)$: −0.6, −0.3, 2.0, −0.7, −0.4.
MSE $= (0.36 + 0.09 + 4 + 0.49 + 0.16)/5 = 5.1/5 = 1.02$

### Answer
(a) **ŷ = 4.15x + 41.1** (b) **70.15 marks** (c) **MSE = 1.02**

### Takeaway
Each extra hour of study adds about 4.15 marks on average. The biggest error is at x = 6 (the student who scored 64 rather than the predicted 66).`,
    },
    {
      title: "Q5 SVM: concentric classes",
      level: "Hard",
      marks: 6,
      hint: "The +1 points are near the origin, the −1 points far away. Try the squared distance from the origin, z = x₁² + x₂².",
      question: `Class +1: (0,0), (1,0), (0,1), (−1,0). Class −1: (2,0), (0,2), (−2,0), (0,−2).
(a) Show the data is not linearly separable and suggest φ that makes it separable. [1]
(b) Identify the support vectors in the transformed space. [2]
(c) Find the maximum-margin hyperplane in the transformed space and its margin. [2]
(d) Express the decision boundary in the original space. [1]`,
      solution: `
### What is being asked
The non-linear SVM recipe (Session 7, Lesson 6), with a ring-shaped pattern instead of XOR.

### Why this approach
The +1 class is surrounded on all sides by −1 points, so what separates them is **distance from the origin**. The squared radius captures that in one number.

### Working
**(a)** No straight line can put the central cluster on one side and all four surrounding points on the other. Use $z = \\phi(x) = x_1^2 + x_2^2$:
- +1: z = 0, 1, 1, 1
- −1: z = 4, 4, 4, 4

Now they are separable on the z-axis.

**(b)** The closest opposite-class values are z = 1 and z = 4. **Support vectors:** (1, 0), (0, 1), (−1, 0), where z = 1, and **all four** −1 points, where z = 4. The point (0, 0), with z = 0, is **not** a support vector.

**(c)** Solve $wz + b = +1$ at z = 1 and $wz + b = -1$ at z = 4:
- $w + b = 1$ and $4w + b = -1$ → subtract: $3w = -2$, so $w = -2/3$ and $b = 5/3$
- Hyperplane: $-\\frac23 z + \\frac53 = 0 \\Rightarrow z = 2.5$
- Margin $= 2/|w| = 2/(2/3) = 3$, the gap from z = 1 to z = 4 ✓

**(d)** $x_1^2 + x_2^2 = 2.5$: a circle of radius $\\sqrt{2.5} \\approx 1.58$ centred at the origin. Predict +1 inside and −1 outside.

### Answer
(a) $z = x_1^2 + x_2^2$ (b) the three +1 points at z = 1 and all four −1 points (c) $z = 2.5$, margin 3 (d) circle $x_1^2 + x_2^2 = 2.5$

### Takeaway
Pick φ to match the *shape* of the pattern: XOR → product $x_1x_2$; rings → squared radius $x_1^2 + x_2^2$.`,
    },
  ],

  theory: [
    {
      title: "Q2 (a) Supervised, unsupervised and reinforcement learning",
      marks: 2,
      question: "Differentiate supervised, unsupervised and reinforcement learning with one example each.",
      solution: `
### What the examiner wants
What each learns from, what it learns, and an example (Session 1, Lesson 5).

### Model answer
- **Supervised:** learns $f(x) \\to y$ from **labelled** data. E.g. predicting house prices (regression) or spam detection (classification).
- **Unsupervised:** finds structure in **unlabelled** data. E.g. customer segmentation with k-Means, or dimensionality reduction with PCA.
- **Reinforcement:** an agent acts in an environment, receives **rewards or penalties**, and learns a **policy** (state → action) that maximises long-term reward. E.g. AlphaGo, or a robot learning to navigate a maze.

### Takeaway
The difference is the kind of feedback: answers, no answers, or rewards.`,
    },
    {
      title: "Q2 (b) Regularisation",
      marks: 2,
      question: "What is regularisation? How does the regularisation parameter λ affect bias and variance?",
      solution: `
### What the examiner wants
The definition with the formula, and the effect of λ in both directions (Session 4, Lesson 11).

### Model answer
- **Regularisation** adds a penalty on large weights to the cost, $J = \\text{error} + \\lambda\\sum_j\\theta_j^2$, discouraging overly complex models and so controlling **overfitting**.
- **Larger λ:** weights shrink, giving a smoother, simpler model: **variance ↓, bias ↑**. Too large and the model underfits.
- **Smaller λ:** a more flexible model: **bias ↓, variance ↑**. λ = 0 is plain least squares, which may overfit.
- Choose λ by cross-validation. (For SVMs, C plays the inverse role.)

### Takeaway
λ is a dial along the bias–variance trade-off.`,
    },
    {
      title: "Q2 (c) Frame food-delivery time prediction",
      marks: 2,
      question: "A food-delivery app wants to predict how many minutes an order will take to arrive. Frame this as an ML problem: problem type, model choice and performance metric, with justification.",
      solution: `
### What the examiner wants
Type → Model → Metric, each with a “because” (Sessions 1–2).

### Model answer
- **Type:** supervised **regression**, because historical orders have the actual delivery time (a label) and the target is a real number (minutes). Features: distance, restaurant preparation time, time of day, traffic, weather, rider availability.
- **Model:** start with **linear regression** (a simple, interpretable baseline); move to random forest or gradient boosting if the relationship is non-linear.
- **Metric:** **MAE** (in minutes), because it's easy to explain (“on average we're off by 4 minutes”) and robust to rare extreme delays. RMSE if large errors are especially bad for customers.

### Takeaway
A number to predict → regression; then choose MAE vs RMSE by how much big misses matter.`,
    },
  ],

  quiz: [],
};
