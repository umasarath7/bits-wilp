// AML — Previous mid-semester paper, fully solved
// Source: CourseFiles/AML/previous papers/*.jpeg (5 questions, 30 marks)

export default {
  title: "Previous Mid-sem Paper (Solved)",
  source: "CourseFiles/AML/previous papers · 5 questions · 30 marks",
  overview:
    "The actual previous mid-semester paper with model answers. **Numerical** tab: Q1 (a–d), Q3, Q4, Q5. **Theory** tab: Q2. Try each under exam conditions first. The question time budget is roughly 4 minutes per mark.",

  summary: [
    {
      id: "pattern",
      heading: "Paper pattern",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Q", "Content", "Marks", "Session"],
          rows: [
            ["1", "(a) Euclidean & Manhattan distance · (b) accuracy/precision/recall/F1 · (c) recall vs precision for a business case · (d) polynomial kernel feature map & value", "2×4 = 8", "S2, S3, S7"],
            ["2", "(a) three ML challenges · (b) bias–variance · (c) frame churn prediction", "2×3 = 6", "S1, S4, S3/S5"],
            ["3", "Naïve Bayes: loan approval (priors, likelihoods, posteriors)", "5", "S6"],
            ["4", "Linear regression: slope, intercept, prediction, MSE", "2+2+1 = 5", "S4"],
            ["5", "XOR: feature map, support vectors, max-margin hyperplane, boundary in original space", "1+2+2+1 = 6", "S7"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Format notes",
          text: "Answers can be typed or handwritten, then scanned and uploaded via QR code, **per question**. Don't upload all sheets against one question. In the actual attempt, Q3 (NB) took about 49 minutes and Q1 about 38. Practise NB tables until they're quick.",
        },
      ],
    },
  ],

  problems: [
    {
      title: "Q1 (a) Euclidean and Manhattan distance",
      pyq: true,
      level: "Easy",
      marks: 2,
      question: "Two data points have feature values P = [3, 7, 2] and Q = [6, 2, 5]. Compute the Euclidean and Manhattan distance between P and Q.",
      solution: `
Differences: $|3-6| = 3$, $|7-2| = 5$, $|2-5| = 3$

- **Euclidean:** $\\sqrt{3^2+5^2+3^2} = \\sqrt{9+25+9} = \\sqrt{43} = $ **6.557**
- **Manhattan:** $3+5+3 = $ **11**`,
    },
    {
      title: "Q1 (b) Confusion-matrix metrics",
      pyq: true,
      level: "Easy",
      marks: 2,
      question: `A classifier's confusion matrix on a 500-sample test set is below. Calculate the accuracy, precision, recall and F1-score.

| | Predicted Positive | Predicted Negative |
|---|---|---|
| Actual Positive | 160 (TP) | 15 (FN) |
| Actual Negative | 25 (FP) | 300 (TN) |`,
      solution: `
- **Accuracy** $= \\frac{160+300}{500} = \\frac{460}{500} = $ **0.92**
- **Precision** $= \\frac{160}{160+25} = \\frac{160}{185} = $ **0.865**
- **Recall** $= \\frac{160}{160+15} = \\frac{160}{175} = $ **0.914**
- **F1** $= \\frac{2 \\times 0.865 \\times 0.914}{0.865+0.914} = \\frac{2(160)}{2(160)+25+15} = \\frac{320}{360} = $ **0.889**`,
    },
    {
      title: "Q1 (c) Which analyst is satisfied?",
      pyq: true,
      level: "Medium",
      marks: 2,
      question:
        "A bank uses the classifier in (b) to flag fraudulent transactions. Analyst A cannot afford to miss any actual fraud case, even if it means investigating more false alarms. Analyst B wants to minimise false alarms, even if a few fraud cases go undetected. Which analyst is more likely to be satisfied with this classifier? Justify with reference to the metrics computed in (b).",
      solution: `
- Analyst A cares about **recall** (missed frauds = FN). Recall = **0.914**: 160 of 175 frauds are caught and only 15 are missed (8.6%).
- Analyst B cares about **precision** (false alarms = FP). Precision = **0.865**: 25 of 185 alerts are false (13.5%).
- Since **recall (0.914) > precision (0.865)**, the classifier is better at catching fraud than at avoiding false alarms, so **Analyst A is more likely to be satisfied**.
- A still misses 15 frauds, so if A truly needs "no misses", the threshold should be lowered to push recall higher, at the cost of precision (which would make B less happy).`,
    },
    {
      title: "Q1 (d) Polynomial kernel of degree 2",
      pyq: true,
      level: "Medium",
      marks: 2,
      question:
        "Each 2-D point $x_i = (x_{i1}, x_{i2})$ is transformed using a polynomial kernel of degree 2: $K(x, x') = (1 + x_1x_1' + x_2x_2')^2$. Given $x_1 = (1, 3)$ and $x_2 = (2, 1)$, compute the transformed feature-space representation of both points and the kernel value $K(x_1, x_2)$.",
      solution: `
Feature map: $\\phi(x) = (1,\\ \\sqrt2x_1,\\ \\sqrt2x_2,\\ x_1^2,\\ x_2^2,\\ \\sqrt2x_1x_2)$

- $\\phi(1,3) = (1,\\ \\sqrt2,\\ 3\\sqrt2,\\ 1,\\ 9,\\ 3\\sqrt2) \\approx (1, 1.414, 4.243, 1, 9, 4.243)$
- $\\phi(2,1) = (1,\\ 2\\sqrt2,\\ \\sqrt2,\\ 4,\\ 1,\\ 2\\sqrt2) \\approx (1, 2.828, 1.414, 4, 1, 2.828)$

**Dot product:** $1 + (\\sqrt2)(2\\sqrt2) + (3\\sqrt2)(\\sqrt2) + 1\\cdot4 + 9\\cdot1 + (3\\sqrt2)(2\\sqrt2) = 1 + 4 + 6 + 4 + 9 + 12 = $ **36**

**Direct:** $x_1\\cdot x_2 = 2 + 3 = 5 \\Rightarrow (1+5)^2 = $ **36** ✓`,
    },
    {
      title: "Q3 Naïve Bayes: loan approval",
      pyq: true,
      level: "Medium",
      marks: 5,
      question: `Use Naïve Bayes classification to predict loan approval for the new applicant ⟨Income Level = "Medium", Credit Score = "Good", Employment Status = "Employed", Loan Amount = "Medium"⟩.

| Income | Credit | Employment | Loan Amt | Approved |
|---|---|---|---|---|
| High | Good | Employed | Low | Yes |
| Low | Poor | Unemployed | High | No |
| Medium | Good | Employed | Medium | Yes |
| Low | Good | Employed | High | No |
| High | Poor | Employed | Medium | Yes |
| Medium | Poor | Unemployed | Low | No |
| High | Good | Unemployed | Medium | Yes |
| Low | Good | Employed | Low | Yes |

Calculate the prior probabilities, likelihoods and posterior probabilities, and state the predicted class.`,
      solution: `
**Priors:** Yes = rows {1,3,5,7,8} = 5, No = rows {2,4,6} = 3
- $P(\\text{Yes}) = 5/8 = 0.625$
- $P(\\text{No}) = 3/8 = 0.375$

**Likelihoods:**

| Attribute = value | P(·\\|Yes) | P(·\\|No) |
|---|---|---|
| Income = Medium | 1/5 = 0.2 (row 3) | 1/3 = 0.333 (row 6) |
| Credit = Good | 4/5 = 0.8 (rows 1,3,7,8) | 1/3 = 0.333 (row 4) |
| Employment = Employed | 4/5 = 0.8 (rows 1,3,5,8) | 1/3 = 0.333 (row 4) |
| Loan = Medium | 3/5 = 0.6 (rows 3,5,7) | **0/3 = 0** |

**Posteriors (unnormalised):**
- $P(X|\\text{Yes})P(\\text{Yes}) = 0.2 \\times 0.8 \\times 0.8 \\times 0.6 \\times 0.625 = 0.0768 \\times 0.625 = $ **0.048**
- $P(X|\\text{No})P(\\text{No}) = 0.333 \\times 0.333 \\times 0.333 \\times 0 \\times 0.375 = $ **0**

**Normalised:** $P(\\text{Yes}|X) = 0.048/(0.048+0) = $ **1**, $P(\\text{No}|X) = 0$

### Predicted class: **Approved = Yes**

**Bonus (earns credit): note the zero-frequency problem.** "Loan = Medium" never occurs with "No". With **Laplace smoothing** (Income, Loan: 3 values; Credit, Employment: 2 values):
- Yes: $\\frac{2}{8}\\cdot\\frac{5}{7}\\cdot\\frac{5}{7}\\cdot\\frac{4}{8}\\cdot0.625 = 0.0399$
- No: $\\frac{2}{6}\\cdot\\frac{2}{5}\\cdot\\frac{2}{5}\\cdot\\frac{1}{6}\\cdot0.375 = 0.00333$

So $P(\\text{Yes}|X) = $ **0.923**. The prediction is still **Yes**.`,
    },
    {
      title: "Q4 Linear regression: advertising vs sales",
      pyq: true,
      level: "Easy",
      marks: 5,
      question: `A data analyst wants to predict Sales (units) from Advertising Spend (in thousands).

| Advertising Spend | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Sales | 6 | 8 | 11 | 13 | 16 |

(a) Develop a linear regression model: calculate the slope (m) and intercept (b) of $y = mx + b$. [2]
(b) Predict sales for an advertising spend of 3.5. [2]
(c) Calculate the Mean Squared Error (MSE) of your model on the given dataset. [1]`,
      solution: `
**(a)** $\\bar x = 3$, $\\bar y = 10.8$

| x | y | $x-\\bar x$ | $y-\\bar y$ | product | $(x-\\bar x)^2$ |
|---|---|---|---|---|---|
| 1 | 6 | −2 | −4.8 | 9.6 | 4 |
| 2 | 8 | −1 | −2.8 | 2.8 | 1 |
| 3 | 11 | 0 | 0.2 | 0 | 0 |
| 4 | 13 | 1 | 2.2 | 2.2 | 1 |
| 5 | 16 | 2 | 5.2 | 10.4 | 4 |
| | | | Σ | **25** | **10** |

$m = 25/10 = $ **2.5**, $b = 10.8 - 2.5(3) = $ **3.3**, so **$y = 2.5x + 3.3$**

**(b)** $y(3.5) = 2.5(3.5) + 3.3 = $ **12.05 units**

**(c)**

| x | y | ŷ | e = y − ŷ | e² |
|---|---|---|---|---|
| 1 | 6 | 5.8 | 0.2 | 0.04 |
| 2 | 8 | 8.3 | −0.3 | 0.09 |
| 3 | 11 | 10.8 | 0.2 | 0.04 |
| 4 | 13 | 13.3 | −0.3 | 0.09 |
| 5 | 16 | 15.8 | 0.2 | 0.04 |

MSE $= 0.30/5 = $ **0.06**`,
    },
    {
      title: "Q5 SVM on XOR",
      pyq: true,
      level: "Hard",
      marks: 6,
      question: `Consider the following 2-D dataset (a classic XOR pattern), which is not linearly separable in the original space:

| x1 | x2 | Class |
|---|---|---|
| 1 | 1 | +1 |
| −1 | −1 | +1 |
| 1 | −1 | −1 |
| −1 | 1 | −1 |

(a) Suggest a suitable feature transformation φ(x1, x2) that makes the data linearly separable. [1]
(b) Identify the support vectors in the transformed space. [2]
(c) Write the equation of the maximum-margin hyperplane in the transformed space. [2]
(d) Express the resulting decision boundary back in the original (x1, x2) space. [1]`,
      solution: `
**(a)** $\\phi(x_1, x_2) = (x_1, x_2, x_1x_2)$. The new feature $z = x_1x_2$ is what matters.

| x₁ | x₂ | $z = x_1x_2$ | class |
|---|---|---|---|
| 1 | 1 | 1 | +1 |
| −1 | −1 | 1 | +1 |
| 1 | −1 | −1 | −1 |
| −1 | 1 | −1 | −1 |

All +1 points have z = +1 and all −1 points have z = −1, so they are separable by a plane on the z-axis.

**(b)** The two classes sit at z = +1 and z = −1, the closest possible positions. Every point touches the margin, so **all four points are support vectors**: (1,1,1), (−1,−1,1), (1,−1,−1), (−1,1,−1).

**(c)** Take $w = (0, 0, w_3)$ and bias b. The canonical conditions at the SVs:
- $w_3(1) + b = +1$
- $w_3(-1) + b = -1$

So $w_3 = 1$ and $b = 0$. The hyperplane is **$0\\cdot x_1 + 0\\cdot x_2 + 1\\cdot z = 0$, i.e. $z = 0$**. The margin lines are $z = \\pm1$, and the margin $= 2/\\|w\\| = $ **2**.

**(d)** Substitute $z = x_1x_2$: the boundary is **$x_1x_2 = 0$**, i.e. the two coordinate axes ($x_1 = 0$ or $x_2 = 0$).
**Decision rule:** $f(x) = \\text{sign}(x_1x_2)$, so +1 in quadrants I and III and −1 in quadrants II and IV.

*(Equivalent: the polynomial kernel $(1 + x^Tx')^2$ contains the $\\sqrt2x_1x_2$ feature and solves XOR implicitly.)*`,
    },
  ],

  theory: [
    {
      title: "Q2 (a) Three key challenges in ML",
      pyq: true,
      marks: 2,
      question: "List and briefly explain three key challenges faced in machine learning.",
      solution: `
1. **Insufficient / non-representative training data.** Too few examples, or a sample that doesn't reflect real cases (sampling noise or sampling bias), so the model can't generalise.
2. **Poor-quality data and irrelevant features.** Missing values, noise, outliers and useless attributes hide the true pattern. They need cleaning and feature engineering.
3. **Overfitting / underfitting.** A model that is too complex memorises noise (great on training data, poor on new data). One that is too simple misses the structure. Fix with regularisation, more data, or a model of the right complexity.`,
    },
    {
      title: "Q2 (b) Bias–variance trade-off",
      pyq: true,
      marks: 2,
      question: "Explain the bias–variance tradeoff. How does it relate to underfitting and overfitting?",
      solution: `
- **Bias** = error from overly simple assumptions, which causes **underfitting** (high training and test error).
- **Variance** = error from sensitivity to the training sample. The model fits noise, which causes **overfitting** (low training error, high test error).
- Increasing model complexity lowers bias but raises variance, and vice versa. Total error ≈ bias² + variance + noise, so the best model is at the complexity that **balances** the two (chosen by validation, controlled by regularisation or model order).`,
    },
    {
      title: "Q2 (c) Frame customer churn as an ML problem",
      pyq: true,
      marks: 2,
      question: "A company wants to predict whether a customer will churn (leave) in the next month. Frame this as a machine learning problem: state the problem type, an appropriate model choice, and a suitable performance metric, with justification.",
      solution: `
- **Problem type:** supervised **binary classification**. Past customers have known labels (churned: yes/no), and the output is one of two classes.
- **Model:** **logistic regression**. It gives the probability of churn, is interpretable (which factors drive churn), and is a fast baseline. Random forest or SVM are options if more capacity is needed.
- **Metric:** churners are a minority, so accuracy is misleading. Use **recall** (catch the customers who will leave, so retention offers reach them), balanced with precision, i.e. **F1-score or ROC-AUC**.`,
    },
  ],

  quiz: [],
};
