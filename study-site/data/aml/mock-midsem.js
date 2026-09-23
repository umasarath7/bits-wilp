// AML — Mock mid-semester paper in the same pattern as the previous paper (30 marks)

export default {
  title: "Mock Mid-sem Paper",
  source: "Practice paper · same pattern as the previous mid-sem · 30 marks · 2 hours",
  overview:
    "A full practice paper that follows the exact structure of the previous mid-sem: Q1 short numericals (4 × 2), Q2 short theory (3 × 2), Q3 Naïve Bayes (5), Q4 regression (5), Q5 SVM with a feature map (6). Set a 2-hour timer, write your answers on paper, then open the solutions.",

  summary: [
    {
      id: "instructions",
      heading: "How to use this paper",
      slides: "",
      blocks: [
        { type: "list", ordered: true, items: [
          "Set a **2-hour** timer. Attempt everything on paper, showing tables and steps as you would upload them.",
          "Open the **Numerical** tab for Q1, Q3, Q4 and Q5, and the **Theory** tab for Q2.",
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
      question: "For P = [2, −1, 4] and Q = [5, 3, 0], compute the Euclidean, Manhattan and supremum distances.",
      solution: `
Differences: $|2-5| = 3$, $|-1-3| = 4$, $|4-0| = 4$

- Euclidean $= \\sqrt{9+16+16} = \\sqrt{41} = $ **6.403**
- Manhattan $= 3+4+4 = $ **11**
- Supremum $= \\max(3,4,4) = $ **4**`,
    },
    {
      title: "Q1 (b) Metrics from a confusion matrix",
      level: "Easy",
      marks: 2,
      question: `A disease-screening model tested on 500 patients:

| | Predicted Positive | Predicted Negative |
|---|---|---|
| Actual Positive | 72 (TP) | 28 (FN) |
| Actual Negative | 18 (FP) | 382 (TN) |

Compute accuracy, precision, recall and F1.`,
      solution: `
- Accuracy $= (72+382)/500 = $ **0.908**
- Precision $= 72/90 = $ **0.80**
- Recall $= 72/100 = $ **0.72**
- F1 $= 144/(144+18+28) = 144/190 = $ **0.758**`,
    },
    {
      title: "Q1 (c) Doctor vs insurer",
      level: "Medium",
      marks: 2,
      question:
        "Using the model in (b): Dr. A says no sick patient should be sent home undiagnosed. Insurer B says healthy people shouldn't be sent for expensive follow-up tests. Who is more satisfied with this model? Justify using the metrics.",
      solution: `
- Dr. A cares about **recall** = 0.72: 28 of 100 sick patients are missed (28%), which is a serious problem for A.
- Insurer B cares about **precision** = 0.80: only 18 of 90 referrals are healthy people.
- Precision (0.80) > recall (0.72), so **Insurer B is more satisfied**. For A, the threshold should be lowered to raise recall, accepting more false positives.`,
    },
    {
      title: "Q1 (d) Polynomial kernel",
      level: "Medium",
      marks: 2,
      question:
        "For $K(x,z) = (1 + x^Tz)^2$, with $x_1 = (2, 1)$ and $x_2 = (1, -1)$, compute $\\phi(x_1)$, $\\phi(x_2)$ and $K(x_1,x_2)$.",
      solution: `
$\\phi(x) = (1, \\sqrt2x_1, \\sqrt2x_2, x_1^2, x_2^2, \\sqrt2x_1x_2)$

- $\\phi(2,1) = (1,\\ 2\\sqrt2,\\ \\sqrt2,\\ 4,\\ 1,\\ 2\\sqrt2)$
- $\\phi(1,-1) = (1,\\ \\sqrt2,\\ -\\sqrt2,\\ 1,\\ 1,\\ -\\sqrt2)$

Dot product $= 1 + 4 - 2 + 4 + 1 - 4 = $ **4**

**Check:** $x_1^Tx_2 = 2 - 1 = 1 \\Rightarrow (1+1)^2 = 4$ ✓`,
    },
    {
      title: "Q3 Naïve Bayes: play tennis?",
      level: "Medium",
      marks: 5,
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
**Priors:** $P(\\text{Yes}) = 9/14 = 0.643$, $P(\\text{No}) = 5/14 = 0.357$

| | P(·\\|Yes) | P(·\\|No) |
|---|---|---|
| Sunny | 2/9 | 3/5 |
| Cool | 3/9 | 1/5 |
| High | 3/9 | 4/5 |
| Strong | 3/9 | 3/5 |

- Yes: $\\frac29\\cdot\\frac39\\cdot\\frac39\\cdot\\frac39\\cdot\\frac9{14} = 0.00823 \\times 0.643 = $ **0.00529**
- No: $\\frac35\\cdot\\frac15\\cdot\\frac45\\cdot\\frac35\\cdot\\frac5{14} = 0.0576 \\times 0.357 = $ **0.02057**

**Normalised:** $P(\\text{No}|X) = 0.02057/(0.02057+0.00529) = $ **0.795**, $P(\\text{Yes}|X) = 0.205$

### Predicted: **Play = No**`,
    },
    {
      title: "Q4 Linear regression: study hours vs marks",
      level: "Easy",
      marks: 5,
      question: `| Study hours x | 2 | 4 | 6 | 8 | 10 |
|---|---|---|---|---|---|
| Marks y | 50 | 58 | 64 | 75 | 83 |

(a) Find the least-squares line $y = mx + b$. [2] (b) Predict the marks for 7 hours. [2] (c) Compute the MSE. [1]`,
      solution: `
**(a)** $\\bar x = 6$, $\\bar y = 66$

| $x-\\bar x$ | $y-\\bar y$ | product | sq |
|---|---|---|---|
| −4 | −16 | 64 | 16 |
| −2 | −8 | 16 | 4 |
| 0 | −2 | 0 | 0 |
| 2 | 9 | 18 | 4 |
| 4 | 17 | 68 | 16 |
| | Σ | **166** | **40** |

$m = 166/40 = $ **4.15**, $b = 66 - 4.15 \\times 6 = $ **41.1**, so $\\hat y = 4.15x + 41.1$

**(b)** $\\hat y(7) = 29.05 + 41.1 = $ **70.15 marks**

**(c)** Predictions: 49.4, 57.7, 66.0, 74.3, 82.6. Errors ($\\hat y - y$): −0.6, −0.3, 2.0, −0.7, −0.4
MSE $= (0.36+0.09+4+0.49+0.16)/5 = 5.1/5 = $ **1.02**`,
    },
    {
      title: "Q5 SVM: concentric classes",
      level: "Hard",
      marks: 6,
      question: `Class +1: (0,0), (1,0), (0,1), (−1,0). Class −1: (2,0), (0,2), (−2,0), (0,−2).
(a) Show the data is not linearly separable and suggest φ that makes it separable. [1]
(b) Identify the support vectors in the transformed space. [2]
(c) Find the maximum-margin hyperplane in the transformed space and its margin. [2]
(d) Express the decision boundary in the original space. [1]`,
      solution: `
**(a)** The +1 points form a small cluster **surrounded** on all four sides by −1 points, so no single straight line can separate them. Use the radial feature $z = \\phi(x) = x_1^2 + x_2^2$:
- +1: z = 0, 1, 1, 1
- −1: z = 4, 4, 4, 4

This is separable on the z-axis.

**(b)** The closest opposite-class values are z = 1 and z = 4. **Support vectors:** (1,0), (0,1), (−1,0), where z = 1, and **all four** −1 points, where z = 4. (0,0), with z = 0, is **not** a support vector.

**(c)** $wz + b = +1$ at z = 1 and $= -1$ at z = 4:
- $w + b = 1$ and $4w + b = -1$, so $w = -2/3$ and $b = 5/3$
- Hyperplane: $-\\tfrac23 z + \\tfrac53 = 0 \\Rightarrow$ **$z = 2.5$**
- Margin $= 2/|w| = 3$ (the gap from z = 1 to z = 4)

**(d)** **$x_1^2 + x_2^2 = 2.5$**, a circle of radius $\\sqrt{2.5} \\approx 1.58$ centred at the origin. Predict +1 inside and −1 outside.`,
    },
  ],

  theory: [
    {
      title: "Q2 (a) Supervised, unsupervised and reinforcement learning",
      marks: 2,
      question: "Differentiate supervised, unsupervised and reinforcement learning with one example each.",
      solution: `
- **Supervised:** learns $f(x) \\to y$ from **labelled** data. E.g. predicting house prices (regression) or spam detection (classification).
- **Unsupervised:** finds structure in **unlabelled** data. E.g. customer segmentation with k-Means, or dimensionality reduction with PCA.
- **Reinforcement:** an agent acts in an environment, receives **rewards or penalties**, and learns a **policy** (state → action) that maximises long-term reward. E.g. AlphaGo, or a robot learning to navigate a maze.`,
    },
    {
      title: "Q2 (b) Regularisation",
      marks: 2,
      question: "What is regularisation? How does the regularisation parameter λ affect bias and variance?",
      solution: `
- **Regularisation** adds a penalty on large weights to the cost, $J = \\text{error} + \\lambda\\sum_j\\theta_j^2$, discouraging overly complex models and so controlling **overfitting**.
- **Larger λ:** weights shrink, giving a smoother, simpler model, so **variance ↓ and bias ↑**. Too large and the model underfits.
- **Smaller λ:** a more flexible model, so **bias ↓ and variance ↑**. λ = 0 is plain least squares, which may overfit.
- Choose λ by cross-validation. For SVMs the parameter C plays the inverse role.`,
    },
    {
      title: "Q2 (c) Frame food-delivery time prediction",
      marks: 2,
      question: "A food-delivery app wants to predict how many minutes an order will take to arrive. Frame this as an ML problem: problem type, model choice and performance metric, with justification.",
      solution: `
- **Type:** supervised **regression**. Historical orders have the actual delivery time (a label), and the target is a real number (minutes). Features: distance, restaurant preparation time, time of day, traffic, weather, rider availability.
- **Model:** start with **linear regression** (a simple, interpretable baseline). Move to random forest or gradient boosting if the relationship is non-linear.
- **Metric:** **MAE** (in minutes) is easy to explain ("on average we're off by 4 minutes") and robust to rare extreme delays. RMSE if large errors are especially bad for customers.`,
    },
  ],

  quiz: [],
};
