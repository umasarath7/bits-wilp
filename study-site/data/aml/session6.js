// AML — Contact Session 6: Classification intro + Naive Bayes
// Source: CourseFiles/AML/ContactSession6-NaiveBayes.pptx (38 slides)

export default {
  title: "Classification & the Naïve Bayes Classifier",
  source: "ContactSession6-NaiveBayes.pptx · 38 slides",
  overview:
    "Classification basics (linear classifiers; generative vs discriminative models), Bayes' theorem and why full Bayes breaks down (the false-positive paradox, data fragmentation), the conditional-independence assumption behind **Naïve Bayes**, estimating probabilities for categorical attributes (counts) and continuous attributes (discretisation or a Gaussian density), the zero-probability problem and **Laplace smoothing**, and text classification with bag-of-words.",

  summary: [
    {
      id: "clf",
      heading: "1. Classification & types of classifiers",
      slides: "2–6",
      blocks: [
        { type: "p", text: "Each record is $(x, y)$: $x$ = attribute set (predictors, independent variables, input) and $y$ = class label (response, dependent variable, output). **Task:** learn a model that maps each $x$ to one of the predefined labels. Examples: spam/non-spam from email features, malignant/benign cells from MRI features, galaxy shape from telescope images." },
        { type: "p", text: "**General approach:** induction (learn the model from the training set) → deduction (apply it to the test set)." },
        { type: "p", text: "**Linear classifier:** $y = 1$ if $\\sum_i w_ix_i \\ge 0$, else $y = 0$ (or −1). The $w_i$ are learnt in the training (induction) phase and applied during inference. **Non-linear** classifiers separate classes with a curved surface." },
        {
          type: "table",
          head: ["", "Generative", "Discriminative"],
          rows: [
            ["Learns", "Class-conditional $P(x|y)$ and prior $P(y)$", "The mapping $f: x \\to y$ (or $P(y|x)$) directly"],
            ["Inference", "Compute $P(y|x)$ for each class via Bayes; compare", "Apply f"],
            ["Boundary", "Linear or non-linear", "Linear if f is linear"],
            ["Examples", "**Naïve Bayes**, Gaussian discriminant analysis", "**Logistic regression**, SVM, perceptron"],
          ],
        },
      ],
    },
    {
      id: "bayes",
      heading: "2. Bayes' theorem & the full Bayes classifier",
      slides: "8–15",
      blocks: [
        { type: "p", text: "$$P(Y\\mid X) = \\frac{P(X\\mid Y)\\,P(Y)}{P(X)} \\qquad \\text{posterior} = \\frac{\\text{likelihood} \\times \\text{prior}}{\\text{evidence}}$$" },
        { type: "p", text: "**Maximum a-posteriori (MAP):** choose the class $y$ that maximises $P(y|X)$. Since $P(X)$ is the same for every class, this is the same as maximising $P(X|y)\\,P(y)$." },
        {
          type: "callout",
          kind: "tip",
          title: "Meningitis example (slides 11–13)",
          text: "10 patients; features: headache, fever, vomiting. Query (h = T, f = F, v = T): $P(m) = 0.3$, $P(h,\\neg f,v) = 0.6$. By the chain rule, $P(h,\\neg f,v|m) = \\frac23\\cdot\\frac22\\cdot\\frac22 = 0.667$, so $P(m|\\ldots) = 0.667\\times0.3/0.6 = 0.33$ and $P(\\neg m|\\ldots) = 0.67$. **Paradox of the false positive:** the likelihood is high but the **prior is low**, so the posterior stays low. For query (h, f, ¬v): $P(m|\\ldots) = 0$, a certainty. This is **data fragmentation**: every added condition shrinks the matching subset until counts hit 0.",
        },
        { type: "p", text: "**The problem:** estimating the full joint $P(X_1,\\dots,X_d|Y)$ needs a count for **every combination** of values. That is exponentially many, so most combinations never occur in the data." },
      ],
    },
    {
      id: "nb",
      heading: "3. Naïve Bayes",
      slides: "18–24",
      blocks: [
        { type: "p", text: "**Conditional independence:** X and Y are conditionally independent given Z if $P(X|Y,Z) = P(X|Z)$. Example: arm length and reading skill are correlated, but *given age* they are independent." },
        { type: "p", text: "**Naïve assumption:** the attributes are conditionally independent given the class:" },
        { type: "p", text: "$$P(X_1,\\dots,X_d\\mid Y) = \\prod_{i=1}^d P(X_i\\mid Y) \\quad\\Rightarrow\\quad \\hat y = \\arg\\max_{y}\\; P(y)\\prod_i P(X_i\\mid y)$$" },
        {
          type: "table",
          caption: "Estimating probabilities from data",
          head: ["Attribute", "Estimate"],
          rows: [
            ["Prior", "$P(y) = \\frac{\\#\\text{ instances of } y}{N}$, e.g. P(No) = 7/10"],
            ["Categorical", "$P(X_i = c|y) = \\frac{n_c}{n}$, where $n_c$ = # of class y with $X_i = c$ (e.g. P(Married | No) = 4/7)"],
            ["Continuous, option 1", "**Discretise** into bins (ordinal)"],
            ["Continuous, option 2", "**Gaussian:** $P(X_i = x|y) = \\frac{1}{\\sqrt{2\\pi\\sigma_y^2}}\\exp\\!\\left(-\\frac{(x-\\mu_y)^2}{2\\sigma_y^2}\\right)$ with the class mean and variance"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Tax-evasion example (slide 24)",
          text: "Test: Refund = No, Divorced, Income = 120K. P(X|No) = 4/7 × 1/7 × 0.0072 = 0.0006 and P(X|Yes) = 1 × 1/3 × 1.2×10⁻⁹. Since P(X|No)P(No) ≫ P(X|Yes)P(Yes), the class is **No**. (Income | No: μ = 110, σ² = 2975 gives 0.0072. Income | Yes: μ = 90, σ² = 25 gives 1.2×10⁻⁹.)",
        },
        { type: "p", text: "To report actual probabilities, **normalise**: $P(\\text{yes}|X) = \\frac{s_{yes}}{s_{yes} + s_{no}}$, where $s$ = prior × product of likelihoods (football example, slide 38: 0.01411 vs 0.01029 gives 0.578 / 0.422)." },
      ],
    },
    {
      id: "zero",
      heading: "4. The zero-probability problem & Laplace smoothing",
      slides: "25–26, 30–32",
      blocks: [
        { type: "p", text: "If any $P(X_i = c|y) = 0$ (the value never appears with that class in training), the **whole product becomes 0**, whatever the other evidence says. If it is 0 for every class, NB cannot classify at all (slide 25)." },
        {
          type: "table",
          head: ["Estimate", "Formula"],
          rows: [
            ["Original", "$\\frac{n_c}{n}$"],
            ["**Laplace** (add-1)", "$\\frac{n_c + 1}{n + v}$, where v = number of values $X_i$ can take"],
            ["m-estimate", "$\\frac{n_c + m\\,p}{n + m}$ (p = prior estimate, m = equivalent sample size)"],
          ],
        },
        { type: "p", text: "**Text (bag of words):** $P(w|c) = \\frac{\\text{count}(w,c) + 1}{\\text{total words in } c + |V|}$, where |V| = vocabulary size." },
      ],
    },
    {
      id: "text",
      heading: "5. Applications: text classification",
      slides: "27–34",
      blocks: [
        { type: "p", text: "**Bag of words:** represent a document by word frequencies and ignore order. Assume each word is independent given the class." },
        {
          type: "table",
          caption: "Training data (slide 30)",
          head: ["Text", "Tag"],
          rows: [
            ["A great game", "Sports"],
            ["The election was over", "Not sports"],
            ["Very clean match", "Sports"],
            ["A clean but forgettable game", "Sports"],
            ["It was a close election", "Not sports"],
          ],
        },
        { type: "p", text: "Query: **“A very close game”**. “close” never appears in Sports, so without smoothing P(close|Sports) = 0. With Laplace smoothing: Sports has 11 words, Not-sports 9, vocabulary 14. The worked answer is in the Numerical tab." },
        { type: "p", text: "**20 Newsgroups:** 1,000 training documents per group, and Naïve Bayes reaches **89% accuracy**. The learning curve (1/3 held out) shows accuracy rising with training-set size." },
        { type: "p", text: "**Other uses:** spam filtering, sentiment analysis, document categorisation, medical diagnosis, image classification. NB is fast, needs little data, and works well even when the independence assumption is violated." },
      ],
    },
  ],

  keyTerms: [
    ["Prior P(y)", "Class probability before seeing x."],
    ["Likelihood P(x|y)", "Probability of the features given the class."],
    ["Posterior P(y|x)", "Class probability after seeing x."],
    ["MAP", "Choose the class maximising $P(x|y)P(y)$."],
    ["Conditional independence", "$P(X|Y,Z)=P(X|Z)$."],
    ["Naïve assumption", "Features are independent given the class."],
    ["Generative model", "Learns $P(x|y)$ and $P(y)$ (e.g. NB)."],
    ["Discriminative model", "Learns $P(y|x)$ or f(x) directly (e.g. logistic regression)."],
    ["Laplace smoothing", "$(n_c+1)/(n+v)$ to avoid zero probabilities."],
    ["Data fragmentation", "Too many joint conditions leave too few (zero) matching records."],
    ["Bag of words", "Document = vector of word counts, order ignored."],
  ],

  examTips: [
    "**NB appears in almost every paper** (PYQ Q3 loan approval, 5 marks; revision Q1). Layout: (1) priors, (2) a table of the likelihoods needed for the query only, (3) products per class, (4) normalised posteriors, (5) the predicted class.",
    "Always **say explicitly** if a zero probability appears, and mention that Laplace smoothing would fix it. Examiners reward this.",
    "For Bayes-theorem word problems (revision Q4, Vijay's job offers), write P(A), P(B), P(A|B) first, then apply $P(B|A) = P(A|B)P(B)/P(A)$.",
    "Gaussian NB: compute the class mean and **variance**, then plug into the normal pdf. Watch whether the question gives σ or σ².",
  ],

  problems: [
    {
      title: "Loan approval with Naïve Bayes",
      pyq: "Midsem Q3 pattern (5 marks)",
      level: "Medium",
      marks: 5,
      question: `Predict **Buys = ?** for a new customer ⟨Age = Youth, Income = Medium, Student = Yes, Credit = Fair⟩.

| Age | Income | Student | Credit | Buys |
|---|---|---|---|---|
| Youth | High | No | Fair | No |
| Youth | High | No | Excellent | No |
| Middle | High | No | Fair | Yes |
| Senior | Medium | No | Fair | Yes |
| Senior | Low | Yes | Fair | Yes |
| Senior | Low | Yes | Excellent | No |
| Middle | Low | Yes | Excellent | Yes |
| Youth | Medium | No | Fair | No |
| Youth | Low | Yes | Fair | Yes |
| Senior | Medium | Yes | Fair | Yes |
| Youth | Medium | Yes | Excellent | Yes |
| Middle | Medium | No | Excellent | Yes |
| Middle | High | Yes | Fair | Yes |
| Senior | Medium | No | Excellent | No |

Compute the priors, likelihoods and posteriors, and state the predicted class.`,
      solution: `
**Priors:** Yes = 9, No = 5, so $P(\\text{Yes}) = 9/14 = 0.643$ and $P(\\text{No}) = 5/14 = 0.357$

**Likelihoods for the query:**

| Attribute | P(·\\|Yes) | P(·\\|No) |
|---|---|---|
| Age = Youth | 2/9 = 0.222 | 3/5 = 0.6 |
| Income = Medium | 4/9 = 0.444 | 2/5 = 0.4 |
| Student = Yes | 6/9 = 0.667 | 1/5 = 0.2 |
| Credit = Fair | 6/9 = 0.667 | 2/5 = 0.4 |

**Products:**
- $P(X|\\text{Yes})P(\\text{Yes}) = 0.222 \\times 0.444 \\times 0.667 \\times 0.667 \\times 0.643 = 0.0282$
- $P(X|\\text{No})P(\\text{No}) = 0.6 \\times 0.4 \\times 0.2 \\times 0.4 \\times 0.357 = 0.00686$

**Normalised posteriors:**
- $P(\\text{Yes}|X) = 0.0282/(0.0282+0.00686) = $ **0.804**
- $P(\\text{No}|X) = $ **0.196**

**Prediction: Buys = Yes.**`,
    },
    {
      title: "Height / hair / eyes (revision deck Q1)",
      pyq: "Revision deck Q1",
      level: "Easy",
      marks: 4,
      question: `Use Bayesian (Naïve Bayes) classification to classify **X = (Short, Dark, Brown)**.

| Height | Hair | Eyes | Class |
|---|---|---|---|
| tall | blond | brown | C1 |
| tall | dark | blue | C1 |
| tall | dark | brown | C1 |
| short | dark | blue | C1 |
| short | blond | brown | C1 |
| tall | red | blue | C2 |
| tall | blond | blue | C2 |
| short | blond | blue | C2 |

Then redo it with Laplace smoothing (Height: 2 values, Hair: 3, Eyes: 2).`,
      solution: `
**Priors:** $P(C1) = 5/8 = 0.625$, $P(C2) = 3/8 = 0.375$

| | C1 | C2 |
|---|---|---|
| P(short\\|·) | 2/5 = 0.4 | 1/3 = 0.333 |
| P(dark\\|·) | 3/5 = 0.6 | 0/3 = **0** |
| P(brown\\|·) | 3/5 = 0.6 | 0/3 = **0** |
| Product × prior | 0.4·0.6·0.6·0.625 = **0.09** | **0** |

**X → C1.** C2 gets 0 because dark hair and brown eyes never occur in C2 (the zero-probability problem).

**With Laplace smoothing:**
- C1: $\\frac{3}{7}\\cdot\\frac{4}{8}\\cdot\\frac{4}{7}\\cdot0.625 = 0.429\\cdot0.5\\cdot0.571\\cdot0.625 = 0.0765$
- C2: $\\frac{2}{5}\\cdot\\frac{1}{6}\\cdot\\frac{1}{5}\\cdot0.375 = 0.4\\cdot0.167\\cdot0.2\\cdot0.375 = 0.0050$

So $P(C1|X) = 0.0765/0.0815 = $ **0.94**. It is still C1, but now with a non-zero probability for C2.`,
    },
    {
      title: "Text classification with Laplace smoothing",
      level: "Medium",
      marks: 5,
      question:
        "Using the 5 training sentences in the notes (3 Sports, 2 Not sports), classify **“A very close game”** with multinomial Naïve Bayes and Laplace smoothing. (Sports has 11 words, Not sports has 9, and the vocabulary is 14 words.)",
      solution: `
**Priors:** $P(S) = 3/5$, $P(N) = 2/5$

| Word | count in S | $P(w|S) = \\frac{c+1}{11+14}$ | count in N | $P(w|N) = \\frac{c+1}{9+14}$ |
|---|---|---|---|---|
| a | 2 | 3/25 | 1 | 2/23 |
| very | 1 | 2/25 | 0 | 1/23 |
| close | 0 | 1/25 | 1 | 2/23 |
| game | 2 | 3/25 | 0 | 1/23 |

**Sports:** $\\frac{3\\cdot2\\cdot1\\cdot3}{25^4}\\cdot\\frac35 = \\frac{18}{390625}\\cdot0.6 = $ **2.76 × 10⁻⁵**

**Not sports:** $\\frac{2\\cdot1\\cdot2\\cdot1}{23^4}\\cdot\\frac25 = \\frac{4}{279841}\\cdot0.4 = $ **5.72 × 10⁻⁶**

**→ Sports.** $P(S|\\text{text}) = 2.76/(2.76+0.572) = $ **0.83**

Without smoothing, P(close|S) = 0 would have wrongly zeroed out Sports.`,
    },
    {
      title: "Bayes' theorem: job offers (revision deck Q4)",
      pyq: "Revision deck Q4",
      level: "Easy",
      marks: 3,
      question:
        "Vijay estimates a 60% chance of an offer from Google (G) and 50% from Microsoft (M). If he gets an offer from M, he believes there's an 80% chance of one from G. (a) If he gets an M offer, what is the probability he does NOT get a G offer? (b) What is P(M | G)?",
      solution: `
Given: $P(G) = 0.6$, $P(M) = 0.5$, $P(G|M) = 0.8$

**(a)** $P(\\neg G|M) = 1 - 0.8 = $ **0.2**

**(b)** Bayes: $P(M|G) = \\frac{P(G|M)P(M)}{P(G)} = \\frac{0.8 \\times 0.5}{0.6} = $ **0.667**`,
    },
    {
      title: "The false-positive paradox",
      level: "Medium",
      marks: 4,
      question:
        "A disease affects 1% of people. A test has sensitivity P(+|D) = 0.95 and false-positive rate P(+|¬D) = 0.05. (a) A person tests positive. What is P(D|+)? (b) Explain the result in terms of prior and likelihood.",
      solution: `
**(a)**
- $P(+) = 0.95(0.01) + 0.05(0.99) = 0.0095 + 0.0495 = 0.059$
- $P(D|+) = 0.0095 / 0.059 = $ **0.161**

**(b)** The likelihood is high (95%), but the **prior is tiny** (1%). Among 10,000 people, 95 true positives are swamped by 495 false positives from the healthy 99%. As in the meningitis example (slide 12), *likelihood is weighted by the prior*, so the posterior stays low: only about 16%.`,
    },
    {
      title: "Gaussian Naïve Bayes (continuous attributes)",
      level: "Hard",
      marks: 6,
      question:
        "Classify a person with height 172 cm and weight 70 kg as Male or Female (equal priors). Class statistics: Male: height μ = 175, σ = 6; weight μ = 75, σ = 8. Female: height μ = 162, σ = 5; weight μ = 58, σ = 6. Use $f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-(x-\\mu)^2/2\\sigma^2}$.",
      solution: `
**Male:**
- $f(172) = \\frac{1}{\\sqrt{2\\pi}\\cdot6}e^{-9/72} = 0.0665 \\times 0.8825 = $ **0.0587**
- $f(70) = \\frac{1}{\\sqrt{2\\pi}\\cdot8}e^{-25/128} = 0.0499 \\times 0.8226 = $ **0.0410**

**Female:**
- $f(172) = \\frac{1}{\\sqrt{2\\pi}\\cdot5}e^{-100/50} = 0.0798 \\times 0.1353 = $ **0.0108**
- $f(70) = \\frac{1}{\\sqrt{2\\pi}\\cdot6}e^{-144/72} = 0.0665 \\times 0.1353 = $ **0.0090**

**Scores** (× 0.5 prior):
- M: $0.0587 \\times 0.0410 \\times 0.5 = 1.20\\times10^{-3}$
- F: $0.0108 \\times 0.0090 \\times 0.5 = 4.86\\times10^{-5}$

$P(M|x) = 1.20/(1.20 + 0.0486) = $ **0.96**, so **Male**.`,
    },
    {
      title: "Full Bayes vs Naïve Bayes on the meningitis data",
      level: "Hard",
      marks: 5,
      question: `Using the 10-patient table (slides 11–13), classify the query **h = T, f = F, v = T** with **Naïve Bayes**, and compare with the full-Bayes answer P(m|…) = 0.33.

| ID | H | F | V | M |
|---|---|---|---|---|
| 1 | T | T | F | F |
| 2 | F | T | F | F |
| 3 | T | F | T | F |
| 4 | T | F | T | F |
| 5 | F | T | F | T |
| 6 | T | F | T | F |
| 7 | T | F | T | F |
| 8 | T | F | T | T |
| 9 | F | T | F | F |
| 10 | T | F | T | T |`,
      solution: `
**Priors:** meningitis = {5, 8, 10}, so $P(m) = 0.3$ and $P(\\neg m) = 0.7$

| | m (5,8,10) | ¬m (1,2,3,4,6,7,9) |
|---|---|---|
| P(h=T\\|·) | 2/3 | 5/7 |
| P(f=F\\|·) | 2/3 | 4/7 |
| P(v=T\\|·) | 2/3 | 4/7 |
| product × prior | $(2/3)^3 \\times 0.3 = 0.0889$ | $\\frac{5\\cdot4\\cdot4}{343} \\times 0.7 = 0.1633$ |

$P(m|q) = 0.0889/(0.0889+0.1633) = $ **0.35**, so predict **no meningitis**.

**Comparison:** full Bayes gives 0.33, so NB is very close. NB needed only single-attribute counts, while full Bayes needs joint counts that quickly fragment to 0 (as in the (h, f, ¬v) query, where full Bayes gave exactly 0).`,
    },
  ],

  theory: [
    {
      title: "Naïve Bayes: assumption, working and issues",
      marks: 5,
      question: "Explain the Naïve Bayes classifier: Bayes' theorem, the naïve assumption, how probabilities are estimated for categorical and continuous attributes, and its main issue and fix.",
      solution: `
- **Bayes:** $P(y|X) = P(X|y)P(y)/P(X)$. Classify by **MAP**: pick the y that maximises $P(X|y)P(y)$, since $P(X)$ is common to all classes.
- **Naïve assumption:** the attributes are **conditionally independent given the class**, so $P(X_1..X_d|y) = \\prod_i P(X_i|y)$. This replaces an exponential number of joint counts with $d$ simple counts per class.
- **Estimation:** prior $P(y) = N_y/N$. Categorical: $P(X_i=c|y) = n_c/n_y$. Continuous: discretise, or assume a **Gaussian** per class ($\\mu_y, \\sigma_y^2$) and use the pdf.
- **Issue:** a zero count makes the whole product zero. **Fix:** Laplace $(n_c+1)/(n+v)$ or the m-estimate.
- **Pros:** fast, needs little data, handles missing values and high dimensions (text), robust to irrelevant attributes. **Cons:** correlated attributes violate the assumption, and its probability estimates are poorly calibrated.`,
    },
    {
      title: "Generative vs discriminative classifiers",
      marks: 3,
      question: "Differentiate generative and discriminative classifiers with examples.",
      solution: `
| | Generative | Discriminative |
|---|---|---|
| Learns | $P(x|y)$ and $P(y)$, i.e. how each class **generates** data | $P(y|x)$ or the boundary $f(x)$ directly |
| Classifies by | Bayes' rule, comparing $P(x|y)P(y)$ | Evaluating $f(x)$ |
| Boundary | Linear or non-linear | Linear if f is linear |
| Can generate samples? | Yes | No |
| Examples | **Naïve Bayes**, GDA, HMM | **Logistic regression**, SVM, perceptron |
| Data needs | Works with less data (strong assumptions) | Usually more accurate with lots of data |`,
    },
    {
      title: "Paradox of the false positive and data fragmentation",
      marks: 4,
      question: "Using the meningitis example, explain (a) the paradox of the false positive and (b) data fragmentation in the full Bayes classifier. How does Naïve Bayes help with (b)?",
      solution: `
**(a) Paradox of the false positive:** for (h, ¬f, v) the likelihood $P(h,\\neg f,v|m) = 0.67$ is high, but the prior $P(m) = 0.3$ is low, giving $P(m|\\ldots) = 0.33$ versus $0.67$ for not-meningitis. It is twice as likely the patient does *not* have meningitis. It feels counter-intuitive, but **the likelihood is weighted by the prior**.

**(b) Data fragmentation:** with the chain rule $P(h|m)P(f|h,m)P(\\neg v|f,h,m)$, each extra condition restricts the counts to an ever-smaller subset of records. Soon a subset is empty and the probability becomes 0 (for (h, f, ¬v), $P(m|\\ldots) = 0$, a false “certainty”). Full joint estimation needs exponentially many records.

**NB helps** because each $P(X_i|y)$ uses **only the class condition**, so every estimate uses all the records of that class. Zeros still occur but are fixed with Laplace smoothing.`,
    },
    {
      title: "Laplace smoothing",
      marks: 3,
      question: "What is the zero-frequency problem in Naïve Bayes? Explain Laplace smoothing with its formula and an example.",
      solution: `
- **Problem:** if an attribute value never occurs with a class in training, $P(X_i=c|y) = 0$ and the whole product becomes 0, ignoring all the other evidence. If this happens for every class, NB can't decide (slide 25).
- **Laplace (add-one):** $P(X_i = c|y) = \\frac{n_c + 1}{n + v}$, where v = number of distinct values of $X_i$. Adding 1 to each count ensures no probability is 0, and adding v to the denominator keeps the probabilities summing to 1.
- **Example:** “close” never appears in Sports texts: $P(\\text{close}|S) = \\frac{0+1}{11+14} = \\frac{1}{25}$ instead of 0.
- **General m-estimate:** $\\frac{n_c + mp}{n+m}$.`,
    },
    {
      title: "Conditional independence",
      marks: 2,
      question: "Define conditional independence with an example. Why is the naïve assumption called “naïve”?",
      solution: `
- X and Y are **conditionally independent given Z** if $P(X|Y,Z) = P(X|Z)$: once Z is known, Y adds no information about X.
- **Example (slide 18):** arm length and reading skill are correlated in the general population (children have shorter arms and read less well), but **given age** they are unrelated.
- **“Naïve”** because NB assumes *all* features are conditionally independent given the class, which is rarely true (e.g. “San” and “Francisco” in text). Yet NB often classifies well because only the **ranking** of posteriors matters, not their exact values.`,
    },
  ],

  quiz: [
    { q: "Naïve Bayes assumes the features are:", options: ["Independent", "Conditionally independent given the class", "Normally distributed", "Equally important"], answer: 1, why: "$P(X_1..X_d|y) = \\prod P(X_i|y)$." },
    { q: "In MAP classification we can ignore P(X) because:", options: ["It is always 1", "It is the same for all classes", "It is zero", "It is unknown"], answer: 1, why: "The evidence is a common denominator." },
    { q: "Laplace-smoothed estimate for a value never seen in a class of 11 words with vocabulary 14:", options: ["0", "1/11", "1/25", "1/14"], answer: 2, why: "(0+1)/(11+14)." },
    { q: "Naïve Bayes is a:", options: ["Discriminative model", "Generative model", "Instance-based model", "Unsupervised model"], answer: 1, why: "It models P(x|y) and P(y)." },
    { q: "For a continuous attribute, NB commonly assumes:", options: ["A uniform distribution", "A Gaussian per class", "A Poisson distribution", "No distribution"], answer: 1, why: "Estimate the class mean/variance, then use the normal pdf." },
    { q: "P(G|M) = 0.8, P(M) = 0.5, P(G) = 0.6. P(M|G) is:", options: ["0.4", "0.667", "0.8", "0.48"], answer: 1, why: "0.8 × 0.5 / 0.6." },
    { q: "“Data fragmentation” in full Bayes refers to:", options: ["Missing values", "Joint conditions leaving too few matching records", "Too many classes", "Overlapping classes"], answer: 1, why: "The chain rule narrows the subset until counts become 0." },
    { q: "Which is TRUE of Naïve Bayes?", options: ["Needs a lot of training data", "Is slow to train", "Works well for text classification", "Always gives calibrated probabilities"], answer: 2, why: "The bag-of-words NB is a classic, strong baseline." },
  ],
};
