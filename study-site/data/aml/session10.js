// AML — Contact Session 10: Ensembles (combining multiple learners, bagging, random forests, AdaBoost)
// Source: CourseFiles/AML/ContactSession10-Ensembles.pptx (42 slides). Every lesson cites its slides.

export default {
  title: "Ensembles: Bagging, Random Forests & AdaBoost",
  source: "ContactSession10-Ensembles.pptx · 42 slides",
  quizMode: "step",
  overview:
    "No single algorithm is best on every problem (the **No Free Lunch theorem**). Each learner makes its own assumptions and fails in its own places. So instead of searching for one perfect expert, we form a **committee**: many base learners whose combined vote is better than any member. Two questions run through the session: **how do we make the members different** (different algorithms, hyperparameters, inputs, or training samples), and **how do we combine them** (sum/average, weighted sum, median, min, max, product). Then the two famous recipes: **bagging** (train on bootstrap samples in parallel and vote; random forests add random feature subsets) reduces **variance**, and **boosting** (AdaBoost: train learners one after another, each focusing on the examples the previous ones got wrong) builds a strong learner from weak ones.",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why combine learners?",
      slides: "3–8",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Would you rather trust **one** doctor's opinion or a **panel** of doctors? Each doctor has blind spots, but different doctors have *different* blind spots, so a panel's combined verdict is usually better than any single member's. That's an **ensemble**.\n\nThe panel only helps if the doctors are **different** (five copies of the same doctor add nothing) and each is **reasonably competent**. So we make models different on purpose: different algorithms, different settings, different inputs, or different samples of the data."},
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The motivation for ensembles and the two challenges every ensemble must solve.",
        },
        {
          type: "p",
          text: "**No Free Lunch theorem (slide 3):** there is no algorithm that is always the most accurate. Each algorithm brings assumptions, converges to a different solution and fails under different circumstances; even the best-tuned learner misses some examples that another learner gets right. In the absence of a single superior model, a **committee** of models can do better.\n\nThe committee's members are **base learners** $d_1, \\dots, d_L$; their outputs are combined by $f(\\cdot)$ into the final answer y (slide 4). Two challenges: the **expertise of the members** (do they help?) and **combining** their results.",
        },
        {
          type: "table",
          caption: "Issue 1: making base learners diverse (slides 5–8)",
          head: ["Way", "Example"],
          rows: [
            ["Different **algorithms**", "Each makes different assumptions (e.g. a tree + an SVM + Naïve Bayes)"],
            ["Different **hyperparameters**", "Different neural-net structures, different SVM kernels"],
            ["Different **input representations**", "Spoken words + video of the speaker's lips; image + text annotations"],
            ["Different **training sets**", "Different random samples (bagging), or partition the input space and let learners specialise (mixture of experts)"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Diversity vs accuracy (slides 5, 8)",
          text: "It does not help if all learners are good or bad at roughly the same things: we need **diverse** learners. Each must be **reasonably accurate** to begin with, but base learners are chosen for **simplicity**, not for their individual accuracy.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Ensemble = panel of experts.** Works when members are **diverse** and **decent**. No single algorithm always wins (No Free Lunch), so combine several."},
      ],
    },
    {
      id: "combine",
      heading: "Lesson 2: Combining the outputs: voting and fusion rules",
      slides: "9–11, 25–30",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "How does the panel reach a verdict? Several voting styles:\n- **Average (sum):** everyone's scores are averaged. Fair and smooth.\n- **Weighted average:** trust the better experts more.\n- **Median:** ignore the extremists.\n- **Max / min:** follow the most / least enthusiastic member.\n- **Product:** multiply scores, so **any one member saying 0 vetoes** that class.\n\nWhy averaging helps: each wiggly, over-excited model is wrong in its own random direction; averaging cancels the random wiggles (variance) while keeping the shared correct trend."},
        {
          type: "callout",
          kind: "formula",
          title: "Simple combination (slides 9–10)",
          text: "$$y = f(d_1, \\dots, d_L \\mid \\Phi), \\qquad \\text{weighted sum: } y = \\sum_{j=1}^{L}w_jd_j,\\; w_j \\ge 0,\\; \\sum_j w_j = 1$$\nFusion rules for class i: **sum** (average) $y_i = \\frac{1}{L}\\sum_j d_{ji}$ · **weighted sum** $\\sum_j w_jd_{ji}$ · **median** · **minimum** · **maximum** · **product** $\\prod_j d_{ji}$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Three learners, three classes (slide 11)",
          text: "Class scores: $d_1 = (0.2, 0.5, 0.3)$, $d_2 = (0.0, 0.6, 0.4)$, $d_3 = (0.4, 0.4, 0.2)$.\n\n| Rule | $C_1$ | $C_2$ | $C_3$ | Winner |\n|---|---|---|---|---|\n| Sum (average) | 0.2 | **0.5** | 0.3 | $C_2$ |\n| Median | 0.2 | **0.5** | **0.3** | $C_2$ |\n| Minimum | 0.0 | **0.4** | 0.2 | $C_2$ |\n| Maximum | 0.4 | **0.6** | 0.4 | $C_2$ |\n| Product | 0.0 | **0.12** | **0.024** | $C_2$ |\n\nEvery rule picks **C₂** here. Note the product rule's veto: $d_2$ gave $C_1$ a score of 0, so $C_1$'s product is 0 however confident the others are.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): slide 11's C₃ column",
          text: "The $C_3$ scores are 0.3, 0.4, 0.2, so the **median is 0.3** (slide: 0.4) and the **product is $0.3 \\times 0.4 \\times 0.2 = 0.024$** (slide: 0.032). The winner $(C_2)$ is unchanged.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Why averaging works (slides 25–30)",
          text: "Fit $f(x) = 2$ sin(1.5x) from noisy samples (noise $N(0, 1)$). An order-1 polynomial is too simple (high bias). Order-3 and order-5 polynomials fit each sample well but each fit wiggles differently (high variance). **Averaging** many order-5 fits gives a curve close to the true function.\n**Idea for voting:** vote over models with **high variance and low bias**. After combining, the bias stays small and averaging reduces the variance. Even if the individual models are biased, the drop in variance may outweigh the bias, so the error still decreases.",
        },
        { type: "diagram", name: "s4-archery" },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Average cancels individual wobbles (reduces variance).** Product rule = veto power (a single 0 kills that class). Know all five rules: sum, weighted, median, min, max, product."},
      ],
    },
    {
      id: "bagging",
      heading: "Lesson 3: Bagging (bootstrap aggregating)",
      slides: "12–14",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "**Bagging** = make many slightly different training sets out of one, train a model on each, and let them vote.\n\nHow do you make “different” datasets from one? **Bootstrapping**: draw rows **with replacement**, like pulling names from a hat and putting each name back before the next draw. Some rows get picked twice, some not at all. Each bootstrap sample therefore contains about **63%** of the original rows (the rest, about 37%, are “out-of-bag”).\n\nBagging helps most with **jumpy** models (deep trees), whose predictions change a lot when the data changes slightly: their votes average out the jumpiness."},
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to make many different learners from one dataset, and why it reduces variance.",
        },
        {
          type: "p",
          text: "**Bootstrapping (slide 12)** creates subsets of the original data by sampling **with replacement**. With replacement, draws are independent: with 7 items, each draw has a 1/7 chance for every item. (Without replacement they are dependent: after taking one item, the next draw is from 6, a 1/6 chance.)\n\n**Bagging (slides 12–14):**\n1. Create L bootstrap samples $X_1, \\dots, X_L$, each the **same size as the original data** (slide 14), drawn with replacement. Some instances appear several times, others not at all.\n2. Train a base (weak) model on each sample: **in parallel, independently**.\n3. Combine predictions: **voting** for classification, **averaging** for regression.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Why a bootstrap sample holds about 63% of the data (slide 14: “find out why”)",
          text: "*Derivation prepared for the website.* In one draw, a particular instance is **not** chosen with probability $1 - \\frac{1}{N}$. In N independent draws it is never chosen with probability $(1 - \\frac{1}{N})^N \\to e^{-1} = 0.368$ as N grows. So each instance appears in a bootstrap sample with probability $1 - (1 - \\frac{1}{N})^N \\approx 1 - e^{-1} =$ **0.632**. ($N = 10$: 0.651; $N = 100$: 0.634; $N = 1000$: 0.632.) The ≈37% left out are the **out-of-bag** examples.",
        },
        {
          type: "table",
          caption: "When bagging helps (slide 14)",
          head: ["Base classifier", "Effect of bagging"],
          rows: [
            ["**Unstable** (small data changes → big model changes, e.g. deep trees)", "Reduces errors from random fluctuations in the training data: **variance falls**"],
            ["**Stable** (e.g. k-NN with large k, linear models)", "Little help: the ensemble's error is mostly the base classifier's **bias**"],
            ["Noisy data", "Less prone to overfitting: no particular instance gets extra focus"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Bagging = Bootstrap (draw with replacement) + AGGregate (vote/average).** ~63% unique rows per sample, because 1 − ($1 - 1/N$)ᴺ ≈ $1 - 1/e$. Reduces **variance** of unstable models; runs in **parallel**."},
      ],
    },
    {
      id: "rf",
      heading: "Lesson 4: Random forests",
      slides: "15",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "A **random forest** is bagging with decision trees, plus one more twist: at every split, each tree may only look at a **random handful of columns**. Why? If one column is very strong, every bagged tree would ask it first and they'd all look alike (a panel of clones). Forcing different columns makes the trees **disagree more**, and a panel that disagrees in random ways averages out better."},
        {
          type: "callout",
          kind: "formula",
          title: "Random forest = bagged trees + random features (slide 15)",
          text: "- Build decision trees on **bootstrap replicas** of the data.\n- At each node, restrict the split to a **small random subset of the features**. The subset size is a **hyperparameter** (sklearn `max_features`).\n- **Do not prune** the trees (each is low-bias, high-variance).\n- Estimate performance on the **out-of-bootstrap** (out-of-bag) data.\n- **Average** (or vote) the outputs of all trees.\nRandom feature subsets make the trees **less correlated**, so averaging removes more variance. The forest **generalises well when the number of trees is large**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "In code (from the AML webinar)",
          text: "`RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)`: 100 trees, each limited to depth 5. On the loan data it reached test accuracy 0.83 with recall 0.93 for approved loans (see the Webinar 1 page).",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Random forest = many unpruned trees on bootstrap samples + a random subset of features at each split → vote.** More trees = more stable."},
      ],
    },
    {
      id: "boosting",
      heading: "Lesson 5: Boosting and AdaBoost",
      slides: "16–23, 31–42",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Bagging trains its experts **independently, in parallel**. **Boosting** trains them **one after another, each one studying the previous ones' mistakes**, like a coaching session: after each mock test, the coach makes the next practice set focus on the questions you got wrong.\n\n**AdaBoost** does this with weights:\n1. Start with every example equally important.\n2. Train a simple model (often a one-question tree, a “stump”). Measure its **weighted error $\\epsilon$**.\n3. Give the model a **say $\\alpha$**: lower error → bigger say.\n4. **Increase** the weights of the examples it got wrong and **decrease** the ones it got right, so the next model focuses on the hard cases.\n5. Repeat. Final answer = **weighted vote** of all the models, each counting $\\alpha$ times.\n\nIf a model is worse than coin-flipping $(\\epsilon > 0.5)$, stop; it's no use."},
        {"type": "callout", "kind": "tip", "title": "Read the symbols aloud", "text": "- $\\epsilon_j$ “epsilon-j” = weighted error of model j (sum of the weights of the examples it got wrong).\n- $\\alpha_j = \\frac{1}{2}\\ln\\frac{1 - \\epsilon_j}{\\epsilon_j}$ = model j's say. $\\epsilon = 0.3$ → $\\alpha = 0.42$; $\\epsilon = 0.1$ → $\\alpha = 1.1$.\n- $p^t$ = weight (importance) of example t. Wrong: $\\times e^{\\alpha}$ (up); right: $\\times e^{-\\alpha}$ (down); then divide by the total so the weights sum to 1.\n- $H(x) = \\text{sign}(\\sum\\alpha_jh_j(x))$ = the weighted vote: add up ±1 votes times their $\\alpha$, then take the sign."},
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to build complementary learners **on purpose**: each new learner concentrates on the examples the previous ones got wrong.",
        },
        {
          type: "p",
          text: "**Bagging vs boosting (slide 16).** In bagging, complementary learners arise by **chance** (random samples and unstable learners). Boosting **actively** creates them by training the next learner on the **mistakes** of the previous ones. **Original boosting (Schapire 1990):** three weak learners (error < 0.5) and data split into $X_1$, $X_2$, $X_3$. Train $d_1$ on $X_1$; feed $X_2$ to $d_1$; train $d_2$ on everything $d_1$ misclassified plus examples from $X_2$; and so on.\n\n**AdaBoost (Freund & Schapire 1996, slide 17)** uses the **same training set over and over** with **simple classifiers that don't overfit** (e.g. decision stumps), changing the **probabilities of drawing each instance** as a function of the error. Start with every $p^t = 1/N$, then raise the weight of misclassified instances so the next learner focuses on them.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "AdaBoost algorithm (slides 31–42)",
          text: "Initialise $p_1^t = 1/N$ for all N examples. For each base learner $j = 1, \\dots, L$:\n1. Randomly draw $X_j$ from X with probabilities $p_j^t$; train $d_j$; compute $y_j^t = d_j(x^t)$.\n2. **Weighted error:** $\\epsilon_j = \\sum_t p_j^t \\cdot 1(y_j^t \\ne r^t)$, errors weighted by each example's importance.\n3. If $\\epsilon_j > 1/2$: stop $(L = j - 1)$. A learner worse than chance can't be used.\n4. **Approach 1:** $\\beta_j = \\epsilon_j/(1 - \\epsilon_j)$; if correct, $p_{j+1}^t = \\beta_jp_j^t$, else unchanged ($\\beta < 1$ shrinks correct examples).\n   **Approach 2:** $\\alpha_j = \\frac{1}{2}\\ln\\frac{1 - \\epsilon_j}{\\epsilon_j}$; misclassified $p^t \\leftarrow p^te^{\\alpha_j}$, correct $p^t \\leftarrow p^te^{-\\alpha_j}$.\n5. **Normalise:** $Z_j = \\sum_t p_{j+1}^t$, $p_{j+1}^t \\leftarrow p_{j+1}^t/Z_j$.\n**Final classifier:** $H(x) = \\text{sign}\\left(\\sum_j\\alpha_jh_j(x)\\right)$: a weighted vote. A **higher $\\alpha$ means a better learner** and a bigger say.",
        },
        {
          type: "callout",
          kind: "example",
          title: "The three-round picture (slides 18–23)",
          text: "10 points (+/−), equal weights $D_1$.\n- Round 1: stump $h_1$ (vertical line) misclassifies 3 + points → $\\epsilon_1 = 0.30$, $\\alpha_1 = \\frac{1}{2}\\ln\\frac{0.7}{0.3} =$ **0.42**. Those 3 points get bigger weights in $D_2$.\n- Round 2: $h_2$ misclassifies 3 − points (now lighter) → $\\epsilon_2 = 0.21$, $\\alpha_2 =$ **0.65**.\n- Round 3: $h_3$ (horizontal line) → $\\epsilon_3 = 0.14$, $\\alpha_3 =$ **0.92**.\n- **Combine:** $H_{final} = \\text{sign}(0.42h_1 + 0.65h_2 + 0.92h_3)$. Three axis-parallel stumps together make a staircase boundary that no single stump could draw.",
        },
        {
          type: "callout",
          kind: "example",
          title: "One weight update by hand",
          text: "*Exercise solution prepared for the website.* 10 examples, each weight 0.1; $h_1$ misclassifies 3 → $\\epsilon = 0.3$, $\\alpha = 0.4236$.\n- Misclassified: $0.1 \\times e^{0.4236} = 0.1528$ each. Correct: 0.1 × e^−0.4236 = 0.0655 each.\n- $Z = 3 (0.1528) + 7 (0.0655) = 0.9165$.\n- Normalised: misclassified **0.1667** each (together 0.5), correct **0.0714** each (together 0.5).\nApproach 1 ($\\beta = 0.3/0.7 = 0.4286$ on the correct ones) gives exactly the same normalised weights. After the update, the previous learner's mistakes carry **half** of the total weight.",
        },
        {
          type: "table",
          caption: "Bagging vs boosting",
          head: ["", "Bagging / random forest", "Boosting (AdaBoost)"],
          rows: [
            ["Training", "Parallel, independent", "Sequential: each learner depends on the previous ones"],
            ["Data", "Bootstrap samples (uniform)", "Same set, re-weighted toward mistakes"],
            ["Combination", "Equal vote / average", "Weighted vote by $\\alpha$"],
            ["Reduces mainly", "Variance", "Bias (and variance)"],
            ["Base learners", "Unstable, low-bias (full trees)", "Weak, simple (stumps); error must be < 0.5"],
            ["Noise", "Robust", "Can overfit noisy labels (they keep gaining weight)"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Boosting = coach who focuses on your mistakes. AdaBoost: error $\\epsilon$ → say $\\alpha$ = ½ln($(1 - \\epsilon)/\\epsilon$) → up-weight mistakes, down-weight successes, normalise → next model → weighted vote.** Stop if $\\epsilon > 0.5$. Bagging = parallel, cuts variance; boosting = sequential, cuts bias."},
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "formula",
      title: "Key formulas",
      text: "Weighted vote $y = \\sum w_jd_j$ · bootstrap coverage $1 - (1 - 1/N)^N \\approx 0.632$ · AdaBoost $\\epsilon_j = \\sum p^t\\,1(\\text{wrong})$, $\\alpha_j = \\frac{1}{2}\\ln\\frac{1 - \\epsilon_j}{\\epsilon_j}$, $p \\leftarrow pe^{\\pm\\alpha}$ then normalise, $H = \\text{sign}(\\sum\\alpha_jh_j)$",
    },
    {
      type: "table",
      head: ["Idea", "Remember"],
      rows: [
        ["No Free Lunch", "no single best algorithm → committee"],
        ["Diversity", "algorithms · hyperparameters · inputs · training sets"],
        ["Fusion rules", "sum, weighted sum, median, min, max, product"],
        ["Bagging", "bootstrap + parallel + vote → lower variance"],
        ["Random forest", "bagged unpruned trees + random feature subset per node"],
        ["AdaBoost", "sequential, reweight mistakes, stop if $\\epsilon > 0.5$, weighted vote by $\\alpha$"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "$\\alpha$ uses the natural log · normalise weights after every round · higher $\\alpha$ = better learner · ~63% unique instances per bootstrap sample (show the $(1 - 1/N)^N$ argument).",
    },
  ],

  glossary: [
    ["Ensemble", "committee", "A set of base learners whose outputs are combined"],
    ["No Free Lunch theorem", "", "No algorithm is best on all problems"],
    ["Base learner", "", "One member of the ensemble"],
    ["Bootstrap sample", "", "Sample of size N drawn with replacement"],
    ["Bagging", "bootstrap aggregating", "Train on bootstrap samples, vote/average"],
    ["Out-of-bag", "OOB", "Instances not drawn into a bootstrap sample (~37%)"],
    ["Random forest", "", "Bagged trees with random feature subsets at each node"],
    ["Boosting", "", "Sequentially train learners on previous mistakes"],
    ["AdaBoost", "adaptive boosting", "Boosting by re-weighting instances; weighted vote"],
    ["Weak learner", "", "Classifier slightly better than chance (error < 0.5)"],
    ["Decision stump", "", "One-level decision tree"],
    ["$\\alpha$ (AdaBoost)", "½ $\\ln((1 - \\epsilon)/\\epsilon)$", "Learner's vote weight"],
    ["Mixture of experts", "", "Learners specialised in different regions of the input space"],
  ],

  examTips: [
    "If asked “why ensembles?”, cite No Free Lunch and the bias–variance argument (averaging high-variance, low-bias models).",
    "For fusion-rule tables, compute every rule per class and state the winner for each rule.",
    "AdaBoost numericals: write $\\epsilon$, $\\alpha$ (natural log), the new weights for wrong and right examples, Z, and the normalised weights.",
    "Contrast bagging and boosting in a table: training order, sampling, combination, what they reduce.",
  ],

  problems: [
    {
      title: "Fusion rules (slide 11)",
      level: "Easy",
      question: "$d_1 = (0.2, 0.5, 0.3)$, $d_2 = (0.0, 0.6, 0.4)$, $d_3 = (0.4, 0.4, 0.2)$ for classes $C_1$, $C_2$, $C_3$. Apply sum (average), median, minimum, maximum and product. Which class wins under each?",
      solution: "Average: (0.2, 0.5, 0.3) · Median: (0.2, 0.5, 0.3) · Min: (0.0, 0.4, 0.2) · Max: (0.4, 0.6, 0.4) · Product: (0.0, 0.12, 0.024).\n**C₂ wins under every rule.** (The slide's $C_3$ median 0.4 and product 0.032 should be 0.3 and 0.024.)",
    },
    {
      title: "Weighted vote",
      level: "Easy",
      question: "Three classifiers predict a loan as Approved (+1), Rejected (−1), Rejected (−1), with weights 0.5, 0.3, 0.2. What is the weighted-sum decision? What would a simple majority vote give?",
      solution: "*Exercise solution prepared for the website.*\nWeighted: 0.5(+1) + 0.3(−1) + 0.2(−1) = 0 → a **tie** (break by the most reliable learner → Approved). Majority vote: 2 Rejected vs 1 → **Rejected**. Weights can change the decision.",
    },
    {
      title: "Why 63%? (slide 14)",
      level: "Medium",
      hint: "Probability that one particular instance is never drawn in N draws with replacement.",
      question: "Show that a bootstrap sample of size N contains about 63% of the distinct training instances. Compute the exact value for $N = 10$ and $N = 1000$.",
      solution: "*Exercise solution prepared for the website.*\nP(an instance is not picked in one draw) = $1 - 1/N$; in N draws, $(1 - 1/N)^N$ → $e^{-1} = 0.368$. So P(it appears) ≈ $1 - 0.368$ = **0.632**.\n$N = 10$: $1 - 0.9^{10}$ = **0.651**. $N = 1000$: $1 - 0.999^{1000}$ = **0.632**.",
    },
    {
      title: "AdaBoost α values (slides 19–23)",
      level: "Easy",
      question: "Compute $\\alpha$ = ½ $\\ln((1 - \\epsilon)/\\epsilon)$ for $\\epsilon = 0.30$, 0.21, 0.14. Which learner has the biggest say?",
      solution: "$\\epsilon = 0.30$ → ½ $\\ln(2.333)$ = **0.42** · $\\epsilon = 0.21$ → ½ $\\ln(3.762)$ = **0.66** (slide 0.65) · $\\epsilon = 0.14$ → ½ $\\ln(6.143)$ = **0.91** (slide 0.92). The third learner (lowest error) has the biggest say.",
    },
    {
      title: "Final AdaBoost vote",
      level: "Medium",
      question: "$H = \\text{sign}(0.42 h_1 + 0.65 h_2 + 0.92 h_3)$. Classify points where $(h_1, h_2, h_3)$ = (+1, −1, −1), (+1, +1, −1), (−1, +1, +1).",
      solution: "*Exercise solution prepared for the website.*\n(+, −, −): $0.42 - 0.65 - 0.92$ = −1.15 → **−1**.\n(+, +, −): $0.42 + 0.65 - 0.92 = 0.15$ → **+1**.\n(−, +, +): −$0.42 + 0.65 + 0.92 = 1.15$ → **+1**.",
    },
    {
      title: "One round of AdaBoost weights",
      level: "Hard",
      hint: "Multiply wrong by $e^{\\alpha}$, right by e^−$\\alpha$, then divide by the sum.",
      question: "10 examples with weights 0.1. The first stump misclassifies examples 3, 7 and 9. Compute $\\epsilon$, $\\alpha$, and the normalised weights for round 2. Check with the $\\beta$ approach.",
      solution: "*Exercise solution prepared for the website.*\n$\\epsilon = 0.3$; $\\alpha$ = ½ $\\ln(0.7/0.3) = 0.4236$.\nWrong: $0.1 e^{0.4236} = 0.1528$; right: 0.1e^−0.4236 = 0.0655. $Z = 3 (0.1528) + 7 (0.0655) = 0.9165$.\nNormalised: examples 3, 7, 9 → **0.1667**; the other seven → **0.0714**.\n$\\beta$ approach: $\\beta = 0.3/0.7 = 0.4286$; right → 0.04286, wrong → 0.1; $Z = 0.6$ → 0.1667 and 0.0714. Same.",
    },
    {
      title: "When does AdaBoost stop?",
      level: "Easy",
      question: "A base learner has weighted error 0.55. What does AdaBoost do, and why?",
      solution: "*Exercise solution prepared for the website.*\n$\\epsilon > 0.5$ → **stop** $(L = j - 1)$: the learner is worse than random guessing, $\\alpha$ would be negative, and its weight updates would favour the wrong examples (slide 36).",
    },
    {
      title: "Choose the ensemble",
      level: "Medium",
      question: "(a) Your deep decision tree has 100% training accuracy but 70% test accuracy. (b) Your decision stump has 62% training and 61% test accuracy. Which ensemble method would you apply in each case, and why?",
      solution: "*Exercise solution prepared for the website.*\n(a) **Bagging / random forest**: the tree is unstable with high variance; averaging many bootstrap trees reduces variance.\n(b) **Boosting (AdaBoost)**: the stump is a weak, high-bias learner; boosting combines many such learners, each fixing the previous mistakes, to reduce bias.",
    },
  ],

  theory: [
    {
      title: "Why ensembles work",
      level: "Medium",
      question: "Explain why combining learners can beat the best single learner. What properties should base learners have?",
      solution: "By the No Free Lunch theorem no algorithm is always best; different learners fail on different examples. If learners are **diverse** (different algorithms, hyperparameters, inputs or training sets) and each is **reasonably accurate**, their errors partly cancel when combined. Averaging high-variance, low-bias models keeps bias low and reduces variance (slides 3–8, 25–30).",
    },
    {
      title: "Bagging and random forests",
      level: "Medium",
      question: "Describe bagging and random forests. When does bagging help?",
      solution: "Bagging trains L base learners on bootstrap samples (size N, with replacement, ~63% distinct instances) in parallel and combines them by voting/averaging. It reduces variance, so it helps **unstable** learners (e.g. deep trees); for stable learners the error is dominated by bias. It's less prone to overfitting noise. A random forest bags unpruned trees and also restricts each node's split to a random feature subset (a hyperparameter), decorrelating the trees; it uses out-of-bag data for evaluation and generalises well with many trees (slides 12–15).",
    },
    {
      title: "AdaBoost",
      level: "Hard",
      question: "Write the AdaBoost algorithm and explain the role of $\\epsilon$ and $\\alpha$.",
      solution: "Initialise $p^t = 1/N$. For each learner j: draw $X_j$ with probabilities $p_j$, train $d_j$, compute the weighted error $\\epsilon_j = \\sum p^t \\cdot 1$(wrong). If $\\epsilon_j$ > ½, stop. Compute $\\alpha_j$ = ½ $\\ln((1 - \\epsilon_j)/\\epsilon_j)$ (or $\\beta_j = \\epsilon_j/(1 - \\epsilon_j)$). Increase the weights of misclassified examples (×$e^{\\alpha}$) and decrease the correct ones (×e^−$\\alpha$ or ×$\\beta$), then normalise. Final: $H(x) = \\text{sign}(\\sum \\alpha_j h_j(x))$. $\\epsilon$ measures the learner's weighted mistakes; $\\alpha$ is its vote weight (higher for lower $\\epsilon$) (slides 31–42).",
    },
    {
      title: "Bagging vs boosting",
      level: "Easy",
      question: "Compare bagging and boosting.",
      solution: "Bagging: parallel, independent learners on bootstrap samples, equal votes, reduces variance, robust to noise. Boosting: sequential learners on re-weighted data focusing on previous mistakes, weighted votes by $\\alpha$, reduces bias (and variance), but can overfit noisy labels. Bagging leaves complementarity to chance; boosting creates it deliberately (slide 16).",
    },
  ],

  quiz: [
    { topic: "Motivation", q: "The No Free Lunch theorem says…", options: ["Ensembles are always better", "No single algorithm is always the most accurate", "More data is always better", "Deep learning beats all others"], answer: 1, why: "Slide 3.", wrong: ["It doesn't say that.", null, "Unrelated.", "Unrelated."] },
    { topic: "Motivation", q: "Base learners in an ensemble should be…", options: ["Identical and highly accurate", "Diverse and reasonably accurate", "Random guessers", "As complex as possible"], answer: 1, why: "Slides 5–8.", wrong: ["Identical learners add nothing.", null, "They must beat chance.", "Simplicity is preferred."] },
    { topic: "Combining", type: "num", q: "Product rule for $C_2$ with scores 0.5, 0.6, 0.4? (2 decimals)", answer: 0.12, tol: 0.001, why: "$0.5 \\times 0.6 \\times 0.4$." },
    { topic: "Combining", type: "num", q: "Median of $C_3$ scores 0.3, 0.4, 0.2? (1 decimal)", answer: 0.3, tol: 0.001, why: "Sorted 0.2, 0.3, 0.4 (the slide says 0.4)." },
    { topic: "Bagging", q: "Bootstrap sampling draws…", options: ["Without replacement, half the data", "With replacement, same size as the data", "Only misclassified examples", "One example per class"], answer: 1, why: "Slide 14.", wrong: ["That's subsampling.", null, "That's boosting's idea.", "No."] },
    { topic: "Bagging", type: "num", q: "Approximate fraction of distinct instances in a large bootstrap sample? (3 decimals)", answer: 0.632, tol: 0.002, why: "$1 - e^{-1}$." },
    { topic: "Bagging", q: "Bagging mainly reduces…", options: ["Bias", "Variance", "Training time", "Number of features"], answer: 1, why: "Averaging unstable learners.", wrong: ["Boosting targets bias.", null, "It increases total training.", "No."] },
    { topic: "Random forest", q: "What distinguishes a random forest from plain bagged trees?", options: ["Trees are pruned", "Each node considers only a random subset of features", "It uses boosting weights", "It uses one tree"], answer: 1, why: "Slide 15.", wrong: ["They are NOT pruned.", null, "No.", "Many trees."] },
    { topic: "Boosting", q: "AdaBoost stops adding learners when the weighted error $\\epsilon$…", options: ["< 0.1", "> 0.5", "= 0", "> 0.25"], answer: 1, why: "Worse than chance (slide 36).", wrong: ["That's a good learner.", null, "Not the rule.", "Not the rule."] },
    { topic: "Boosting", type: "num", q: "$\\alpha$ = ½ $\\ln((1 - \\epsilon)/\\epsilon)$ for $\\epsilon = 0.3$? (2 decimals)", answer: 0.42, tol: 0.005, why: "½ ln(2.333)." },
    { topic: "Boosting", q: "After a round, the weights of misclassified examples are…", options: ["Decreased", "Increased (× $e^{\\alpha}$) and then normalised", "Set to zero", "Unchanged forever"], answer: 1, why: "Slide 41.", wrong: ["Correct ones decrease.", null, "No.", "They change."] },
    { topic: "Boosting", type: "num", q: "10 equal weights, 3 misclassified $(\\epsilon = 0.3)$. Normalised weight of each misclassified example after the update? (3 decimals)", answer: 0.1667, display: "0.167", tol: 0.002, why: "Wrong examples share half the total weight: 0.5/3." },
    { topic: "Boosting", q: "In $H = \\text{sign}(\\sum \\alpha_j h_j)$, a learner with higher $\\alpha$…", options: ["Has a smaller say", "Is a better learner with a bigger say", "Is ignored", "Has higher error"], answer: 1, why: "Slide 40.", wrong: ["Opposite.", null, "No.", "Lower error."] },
    { topic: "Comparison", q: "Which statement is TRUE?", options: ["Boosting trains learners in parallel", "Bagging re-weights misclassified examples", "Boosting trains learners sequentially on previous mistakes", "Bagging uses weighted votes by $\\alpha$"], answer: 2, why: "Slide 16.", wrong: ["Bagging is parallel.", "That's boosting.", null, "That's AdaBoost."] },
  ],
};
