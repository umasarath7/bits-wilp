// ML (DSEZG565) — Module 9: Ensemble learning (bagging, random forest, boosting, AdaBoost, gradient boosting, XGBoost, stacking)
// Source: CourseFiles/ML/Machine Learning_Watermarked_ppts_Nov2026.pdf, pages 578–648 (Sessions 12 & 13).
// All "slides" references on this page are PAGE NUMBERS of that consolidated PDF (the open-book exam copy).

export default {
  title: "Ensemble Learning",
  source: "Consolidated PDF (Nov 2026) · pages 578–648 · Sessions 12–13",
  quizMode: "step",
  overview:
    "One expert can be wrong; a well-chosen panel is usually right more often. **Ensemble learning** combines many **weak learners** into one **strong learner**. The module explains *why* (bias and variance), then the three ways to combine: **bagging** (train many models in parallel on bootstrapped data and average: cuts **variance**; **random forest** is the famous example), **boosting** (train models one after another, each fixing the last one's mistakes: cuts **bias**; **AdaBoost**, **gradient boosting**, **XGBoost**) and **stacking** (different model types combined by a **meta-model**). Every worked example from the slides is solved step by step. **Page numbers on this page refer to your consolidated exam PDF.**",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why combine models? Weak learners, bias and variance",
      slides: "580–587",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Ask one friend to guess the number of sweets in a jar and they may be way off. Ask 50 friends and average: the individual errors cancel. Ensembles do the same with models: many imperfect models, combined well, beat any one of them."},
        {
          type: "callout",
          kind: "formula",
          title: "Definitions (pages 580–582)",
          text: "**Ensemble learning:** combine multiple models to solve the same problem, using several **base models** (“weak learners”) to compensate for each other's weaknesses, so the group is a **strong learner** with better performance than any individual.\n**Weak learner:** a model that doesn't do well on its own because it has **high bias** (underfits) or **high variance** (overfits). Recall the bias–variance trade-off: underfitted = high bias, low variance; overfitted = low bias, high variance.",
        },
        {
          type: "table",
          caption: "Homogeneous vs heterogeneous ensembles (pages 583–584)",
          head: ["Type", "Weak learners", "Example"],
          rows: [
            ["**Homogeneous**", "All from the **same** algorithm", "All decision trees"],
            ["**Heterogeneous**", "**Different** algorithms", "Decision tree + SVM + k-NN"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Match the combiner to the weakness (pages 585–586)",
          text: "The choice of weak learner must be **coherent** with how they are combined. Base models with **high variance, low bias** → combine to **reduce variance** (bagging). Base models with **high bias, low variance** → combine to **reduce bias** (boosting).",
        },
        {
          type: "table",
          caption: "Three combination methods (page 587)",
          head: ["Method", "Learners", "Trained", "Reduces", "Combine by"],
          rows: [
            ["**Bagging**", "Homogeneous", "Independently, **in parallel**", "**Variance**", "Average / majority vote"],
            ["**Boosting**", "Homogeneous", "**Sequentially**, each focusing on earlier mistakes", "**Bias**", "Weighted sum"],
            ["**Stacking**", "**Heterogeneous**", "Base models, then a meta-model", "Both (learns the best mix)", "A **meta-model**"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Bagging = parallel + variance ↓. Boosting = sequential + bias ↓. Stacking = different models + a boss model on top.**"},
      ],
    },
    {
      id: "bagging",
      heading: "Lesson 2: Bootstrapping and bagging",
      slides: "588–602",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "We have only one dataset, but want many different training sets. **Bootstrapping** draws rows at random **with replacement**: some rows appear twice, others not at all. Each draw gives a slightly different dataset, so each model learns slightly differently, and their average is steadier."},
        {
          type: "callout",
          kind: "formula",
          title: "Bootstrapping (pages 589–596)",
          text: "From an initial dataset of n samples (the slides use 5 patient MRI records: age, perimeter mean, texture mean, growth rate → cancer yes/no), create a **bootstrapped dataset** of the same size n by drawing samples **independently and with replacement**: the same record can be picked more than once (the slides' draws pick the row with age 43 twice and the row with age 65 twice). Repeat to make one bootstrapped dataset per weak learner. The initial dataset should be large enough to capture the complexity of the true distribution.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Bagging = bootstrap aggregating (pages 588, 597–601)",
          text: "1. Create k bootstrapped datasets $D_1, \\dots, D_k$ (each of size n).\n2. Train one base model $C_i$ on each $D_i$ (in **parallel**).\n3. **Aggregate:**\n- Regression: $f_{ensemble}(x) = \\frac{1}{N}\\sum_{i=1}^{N} f_i(x)$.\n- Classification, **hard voting:** the class with the most votes, $C^*(x) = \\arg\\max_y\\sum_i\\delta(C_i(x) = y)$.\n- Classification, **soft voting:** average the predicted class probabilities and take the highest.\nBagging gives an ensemble with **less variance** (more robust) than its components.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Random forest (pages 602–603)",
          text: "Bagging with **deep decision trees** (high variance) plus **one extra twist**: at **each node**, only a **random subset of features** is considered for the best split. This makes the trees more different from one another, so averaging removes more variance.\n*Example (page 603):* five trees rate a product 5, 4, 5, 4, 4 → averaged rating $(5 + 4 + 5 + 4 + 4)/5 = 4.4$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem types 1–2 (pages 611–614): majority voting in a random forest",
          text: "**Type 1, student result:** Tree 1 Pass, Tree 2 Fail, Tree 3 Pass → Pass 2 votes, Fail 1 → **Pass** (the mode).\n**Type 2, card transaction** (₹20,000, international, unusual location): Tree 1 Fraud, Tree 2 Legitimate, Tree 3 Fraud → **Fraud** (2 vs 1). Each tree was trained on a bootstrap sample drawn with replacement.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Bootstrap = sample with replacement, same size. Bagging = bootstrap + train in parallel + average/vote. Random forest = bagging of trees + random features at every split.**"},
      ],
    },
    {
      id: "boosting",
      heading: "Lesson 3: Boosting: learning from mistakes",
      slides: "604–610, 639–641",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "A student does a practice test, then spends the next study session on the questions they got wrong, then the next session on what's still wrong… Boosting trains models **one after another**, each giving more attention to the examples the previous ones handled badly."},
        {
          type: "table",
          caption: "Bagging vs boosting (pages 604–607)",
          head: ["", "Bagging", "Boosting"],
          rows: [
            ["**Training**", "Base models **independent**, can run in parallel", "Each model **depends on the previous** ones"],
            ["**Focus**", "Equal weight on all data", "More weight on samples **badly handled** before"],
            ["**Base models**", "High variance, low bias (deep trees)", "**Low variance, high bias**: shallow trees, e.g. one-level **stumps**"],
            ["**Reduces**", "Variance", "**Bias**"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "How boosting combines (pages 608–610, 641)",
          text: "Train weak learner 1 on the data → update the data (increase weights or copies of **misclassified** samples) → train learner 2 → … The usual combination is a **weighted sum**:\n$$f_{ensemble}(x) = \\sum_i c_i\\,f_i(x)$$\nwhere $c_i$ reflects how well learner $f_i$ performed. Popular algorithms: **AdaBoost, gradient boosting, XGBoost**.\n**General boosting (regression):** start with a base prediction (the mean) → compute errors → train the next tree **on the errors** → repeat → final prediction = sum of all trees' contributions.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Boosting = a relay of weak learners; each one runs on the mistakes the last one left behind.**"},
      ],
    },
    {
      id: "adaboost",
      heading: "Lesson 4: AdaBoost, step by step",
      slides: "618–629",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "AdaBoost algorithm (pages 618–619)",
          text: "1. Initialise weights $w_i = 1/n$.\n2. For t = 1…T: train a weak learner $h_t$ (a **stump**: the feature with the lowest Gini / highest information gain) using the weights.\n3. Weighted error $\\epsilon_t = \\sum_{i: h_t(x_i) \\ne y_i} w_i$.\n4. Learner weight (“performance of the stump”, written α or β): $$\\alpha_t = \\frac12\\ln\\frac{1 - \\epsilon_t}{\\epsilon_t}$$\n5. Update: $w_i \\leftarrow w_i\\,e^{-\\alpha_t y_i h_t(x_i)}$, i.e. ×$e^{+\\alpha}$ if **misclassified**, ×$e^{-\\alpha}$ if correct.\n6. **Normalise** so the weights sum to 1.\nFinal: $H(x) = \\text{sign}\\left(\\sum_t\\alpha_t h_t(x)\\right)$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slides 620–624: heart-disease data, one round",
          text: "7 patients, each weight 1/7 ≈ 0.14. The first stump misclassifies 2 → **total error 2/7 = 0.28**.\nPerformance $\\alpha = \\frac12\\ln\\frac{1 - 0.28}{0.28} = \\frac12\\ln 2.5 \\approx 0.45$ (exactly 0.458 with 2/7).\nNew weights: misclassified $0.14 \\times e^{0.45} = 0.21$; correct $0.14 \\times e^{-0.45} = 0.08$ (more precisely 0.09). Sum = 5(0.08) + 2(0.21) = 0.82 → normalised **0.10** (correct) and **0.26** (misclassified; exactly 0.25 without rounding). The two hard patients now carry far more weight for the next stump.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (pages 625–629): customer churn",
          text: "6 customers (tenure, spend, churn): (2, 80, +1), (4, 40, −1), (6, 70, +1), (8, 30, −1), (10, 60, −1), (12, 90, +1). Weights 1/6 each.\n**Stump 1:** spend > 50 → +1. Only customer 5 (spend 60, retained) is wrong → $\\epsilon_1 = 1/6$; $\\alpha_1 = \\frac12\\ln 5 = 0.8047$.\nMultipliers: correct $e^{-0.8047} = 0.4472$, wrong $e^{0.8047} = 2.2361$ → unnormalised 0.0745 ×5 and 0.3727; $Z_1 = 0.7452$ → **0.10** each and **0.50** for customer 5.\n**Stump 2:** tenure ≤ 7 → +1. Wrong on customers 2 and 6 (weights 0.1 + 0.1) → $\\epsilon_2 = 0.2$, $\\alpha_2 = \\frac12\\ln 4 = 0.6931$.\n**Ensemble:** $H(x) = \\text{sign}(0.8047h_1 + 0.6931h_2)$. Customer 2: −0.8047 + 0.6931 = −0.1116 → **−1 ✓**. Customer 5: +0.8047 − 0.6931 = +0.1116 → **+1 ✗**: still wrong; a third round would be needed.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**ε → α = ½ln((1−ε)/ε) → wrong × e^α, right × e^−α → normalise → repeat → sign of the α-weighted vote.**"},
      ],
    },
    {
      id: "gb",
      heading: "Lesson 5: Gradient boosting and XGBoost",
      slides: "615–617, 630–643",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Instead of re-weighting points, gradient boosting fits each new tree to the **residuals**, what's still left to explain. Start with the average, see how far off each point is, fit a small tree to those gaps, add a **fraction** of it (the learning rate), repeat."},
        {
          type: "callout",
          kind: "formula",
          title: "Gradient boosting steps (pages 615–617)",
          text: "1. Base model: the **average** (regression) or most frequent class.\n2. **Residuals** = actual − predicted.\n3. Fit a new model RM1 with the **residuals as the target**.\n4. New prediction = old prediction + (learning rate × RM1's output).\n5. Compute new residuals; fit RM2 on them; repeat.\nError falls as trees are added (page 616). **Hyperparameters (page 617):** learning rate, number of estimators, subsample, loss, max features, max depth. Friedman (1999) generalised boosting to **arbitrary loss functions** (page 639); scikit-learn: GradientBoostingClassifier / Regressor.",
        },
        {
          type: "callout",
          kind: "example",
          title: "XGBoost worked example (pages 636–638)",
          text: "4 samples: x = 2, 4, 6, 8 with y = 10, 20, 30, 40; learning rate η = 0.3, λ = 0.\n**Step 1:** base prediction $\\hat y^{(0)} = (10 + 20 + 30 + 40)/4 = 25$.\n**Step 2, tree 1** (split x ≤ 5): residuals −15, −5 | 5, 15 → leaf values **−10** and **+10** → predictions 25 + 0.3(∓10) = **22, 22, 28, 28**.\n**Step 3:** $MSE_1 = (144 + 4 + 4 + 144)/4 = 74$.\n**Step 4, tree 2:** residuals −12, −2 | 2, 12 → leaves **−7** and **+7** → predictions **19.9, 19.9, 30.1, 30.1**; $MSE_2 = 49.01$.\n**Step 5:** $\\hat y(x) = 25 + 0.3T_1(x) + 0.3T_2(x)$ → x = 3 gives **19.9**, x = 7 gives **30.1**.",
        },
        {
          type: "table",
          caption: "What makes XGBoost “eXtreme”? (pages 630–635, 642–643)",
          head: ["Feature", "Meaning"],
          rows: [
            ["**Gradient-boosted trees**", "Each new tree corrects earlier errors by following the negative gradient of the loss"],
            ["**Built-in regularisation**", "L1/L2 penalties on tree complexity prevent overfitting"],
            ["**Shrinkage (learning rate η)**", "Add only a fraction of each tree: more robust, needs more trees"],
            ["**Pruning**", "Remove splits that don't reduce the loss"],
            ["**Level-wise (breadth-first) growth**", "Adds nodes depth by depth"],
            ["**Sparsity-aware missing-value handling**", "Learns where to send missing values"],
            ["**Cache-aware access**", "Keeps hot data in CPU cache (spatial locality)"],
            ["**Approximate greedy split search, parallel & GPU, early stopping, feature importance**", "Speed and scale (Kaggle 2015 and KDD Cup 2015 winners)"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Gradient boosting = mean + learning-rate × (tree fitted to residuals), again and again. XGBoost = that, plus regularisation, pruning, missing-value handling and speed tricks.**"},
      ],
    },
    {
      id: "stacking",
      heading: "Lesson 6: Stacking",
      slides: "644–648",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Ask a doctor, an engineer and a lawyer for an opinion, then hire a **manager** who has learned *how much to trust each of them* in different situations. The experts are the base models; the manager is the **meta-model**."},
        {
          type: "callout",
          kind: "formula",
          title: "Stacking (pages 644–648)",
          text: "Differences from bagging/boosting: uses **heterogeneous** weak learners, and **learns** how to combine them with a **meta-model** instead of a fixed average. Define (1) the base algorithms (e.g. **decision tree, k-NN, SVM**) and (2) the meta-model (e.g. a **neural network**).\n**2-fold procedure:** split the data into two folds → train the base models on fold 1 → let them predict fold 2 → train the meta-model on those predictions (with fold 2's true labels).\n**k-fold cross-training:** k−1 folds train the base models, the remaining fold trains the meta-model, repeated so every sample is used for both.",
        },
        {
          type: "p",
          text: "```flow\nFold 1 -> Train DT, k-NN, SVM\nFold 2 -> Base model predictions -> Train meta-model (neural network) -> Final prediction\n```",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Stacking = different experts + a trained manager. Never train the manager on the same rows the experts learned from.**"},
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "M9 on one screen",
      head: ["Idea", "Key point"],
      rows: [
        ["Weak → strong", "Weak learners have high bias or high variance; ensembles combine them"],
        ["Bagging", "Bootstrap (with replacement, same size) → train in parallel → average / hard or soft vote → variance ↓"],
        ["Random forest", "Bagged deep trees + random feature subset at each split"],
        ["Boosting", "Sequential; reweight mistakes; weighted sum $\\sum c_if_i(x)$ → bias ↓; stumps"],
        ["AdaBoost", "$\\alpha = \\frac12\\ln\\frac{1-\\epsilon}{\\epsilon}$; wrong × $e^{\\alpha}$, right × $e^{-\\alpha}$; normalise; $H = \\text{sign}\\sum\\alpha h$"],
        ["Gradient boosting", "Mean → fit trees to residuals → add η × tree"],
        ["XGBoost", "+ regularisation, pruning, missing values, cache-aware, parallel, early stopping"],
        ["Stacking", "Heterogeneous base models + meta-model trained on held-out predictions"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "AdaBoost: show ε, α, both multipliers, unnormalised weights, Z and normalised weights · gradient boosting: show residuals, leaf values, η × leaf, new predictions and the loss · always say whether a method reduces bias or variance.",
    },
  ],

  glossary: [
    ["Ensemble learning", "—", "Combining several models into one stronger model"],
    ["Weak learner", "Base model", "A model only slightly better than chance (high bias or variance)"],
    ["Strong learner", "Ensemble model", "The combined model"],
    ["Homogeneous / heterogeneous ensemble", "—", "Same algorithm / different algorithms"],
    ["Bootstrapping", "—", "Resampling with replacement to build same-size datasets"],
    ["Bagging", "Bootstrap aggregating", "Average or vote over models trained on bootstrap samples"],
    ["Hard / soft voting", "—", "Majority class / highest average probability"],
    ["Random forest", "—", "Bagged trees with a random feature subset at each split"],
    ["Boosting", "—", "Sequentially trained learners focusing on earlier errors"],
    ["Decision stump", "—", "A one-level decision tree"],
    ["AdaBoost", "Adaptive Boosting", "Boosting by reweighting samples; learner weight α"],
    ["Learner weight α", "Amount of say / performance of stump", "$\\frac12\\ln((1-\\epsilon)/\\epsilon)$"],
    ["Gradient boosting", "—", "Fit each new tree to the residuals (negative gradient)"],
    ["Residual", "—", "Actual − predicted"],
    ["Learning rate / shrinkage", "η", "Fraction of each new tree added to the model"],
    ["XGBoost", "eXtreme Gradient Boosting", "Regularised, fast, scalable gradient-boosted trees"],
    ["Stacking", "Stacked generalisation", "Meta-model learns to combine heterogeneous base models"],
    ["Meta-model", "—", "The model trained on base models' predictions"],
  ],

  examTips: [
    "Start any ensemble answer with the bias–variance motivation and say which one the method reduces.",
    "For AdaBoost numericals, lay out a table: sample, weight, prediction, correct?, multiplier, new weight, normalised weight.",
    "For random-forest voting questions, tally the votes explicitly and name the rule (majority/mode, or average for regression).",
    "For stacking, mention the held-out fold (or k-fold cross-training) used to train the meta-model.",
  ],

  problems: [
    {
      title: "Random forest majority vote (Problem types 1–2, pages 611–614)",
      level: "From slides",
      question: "(a) Three trees predict Pass, Fail, Pass for a student. (b) Three trees predict Fraud, Legitimate, Fraud for a transaction. Give the forest's predictions.",
      solution: "### Rule\nClassification forest → **majority vote** (mode).\n### (a)\nPass 2, Fail 1 → **Pass**.\n### (b)\nFraud 2, Legitimate 1 → **Fraud**.",
    },
    {
      title: "Random forest regression average (page 603)",
      level: "From slides",
      question: "Five trees predict ratings 5, 4, 5, 4, 4. What does the forest predict?",
      solution: "Regression → **average**: (5 + 4 + 5 + 4 + 4)/5 = **4.4**.",
    },
    {
      title: "AdaBoost one round (pages 620–624)",
      level: "From slides",
      question: "7 samples with equal weights; the first stump misclassifies 2. Compute the stump's performance α and the updated, normalised weights.",
      solution: "### Error\nε = 2/7 = 0.2857.\n### α\n½ ln(0.7143/0.2857) = ½ ln 2.5 = **0.458** (slide rounds to 0.45).\n### Update\nWrong: (1/7)e^{0.458} = 0.2259; right: (1/7)e^{−0.458} = 0.0904. Sum = 5(0.0904) + 2(0.2259) = 0.904.\n### Normalise\nRight **0.10**, wrong **0.25** (slide, with rounded 0.14, 0.21, 0.08: 0.10 and 0.26).",
    },
    {
      title: "AdaBoost two rounds: churn (pages 625–629)",
      level: "From slides",
      question: "Customers (tenure, spend, y): (2, 80, +1), (4, 40, −1), (6, 70, +1), (8, 30, −1), (10, 60, −1), (12, 90, +1). Stump 1: spend > 50 → +1; stump 2: tenure ≤ 7 → +1. Run two rounds of AdaBoost and classify customers 2 and 5 with the ensemble.",
      solution: "### Round 1\nWeights 1/6. Stump 1 wrong only on #5 → ε₁ = 1/6, **α₁ = ½ ln 5 = 0.8047**. Multipliers 0.4472 (right), 2.2361 (wrong) → 0.0745 ×5, 0.3727; Z = 0.7452 → **0.1 ×5, 0.5 for #5**.\n### Round 2\nStump 2 predicts +1, +1, +1, −1, −1, −1 → wrong on #2 and #6 → ε₂ = 0.2, **α₂ = ½ ln 4 = 0.6931**.\n### Ensemble H = sign(0.8047h₁ + 0.6931h₂)\n#2: −0.8047 + 0.6931 = −0.1116 → **−1 (correct)**. #5: 0.8047 − 0.6931 = +0.1116 → **+1 (still wrong)**.",
    },
    {
      title: "XGBoost regression, two trees (pages 636–638)",
      level: "From slides",
      question: "x = 2, 4, 6, 8; y = 10, 20, 30, 40; η = 0.3, λ = 0; each tree splits at x ≤ 5. Build two trees and predict x = 3 and x = 7.",
      solution: "### Base\nŷ⁽⁰⁾ = 25.\n### Tree 1\nResiduals −15, −5, 5, 15 → leaves −10, +10 → ŷ⁽¹⁾ = 22, 22, 28, 28; MSE₁ = **74**.\n### Tree 2\nResiduals −12, −2, 2, 12 → leaves −7, +7 → ŷ⁽²⁾ = 19.9, 19.9, 30.1, 30.1; MSE₂ = **49.01**.\n### Predict\nx = 3 → 25 + 0.3(−10) + 0.3(−7) = **19.9**; x = 7 → **30.1**.",
    },
    {
      title: "AdaBoost learner weight",
      level: "Level 1",
      question: "A stump has weighted error 0.1. Find α and the multipliers for correct and misclassified samples.",
      solution: "α = ½ ln(0.9/0.1) = ½ ln 9 = **1.0986**. Correct × e^{−1.0986} = **0.333**; wrong × e^{1.0986} = **3.0**. (Then normalise.) Exercise solution prepared for the website.",
    },
    {
      title: "Bootstrap: how many rows are left out?",
      level: "Level 2",
      question: "A bootstrap sample of size n is drawn from n rows. What fraction of the original rows is expected to appear at least once, for n = 5 and for large n?",
      solution: "### Idea\nA given row is missed in one draw with probability 1 − 1/n, so in all n draws with $(1 - 1/n)^n$.\n### n = 5\n$1 - 0.8^5 = 1 - 0.328$ = **0.672** (about 3.4 distinct rows of 5).\n### Large n\n$1 - e^{-1}$ ≈ **0.632**: about 63% of rows appear; the ~37% left out (“out-of-bag”) can be used to test each tree. Exercise solution prepared for the website.",
    },
  ],

  theory: [
    {
      title: "Bagging vs boosting",
      level: "Level 2",
      question: "Compare bagging and boosting: how they train, what error they reduce, what base learners they use and how they combine predictions.",
      solution: "Both combine **homogeneous** weak learners (page 587). **Bagging** trains base models **independently in parallel** on **bootstrap samples**, then averages (regression) or votes (hard/soft, classification); it reduces **variance**, so it suits high-variance, low-bias learners such as deep trees (random forest). **Boosting** trains learners **sequentially**, each giving more weight to samples the previous ones misclassified, and combines them with a **weighted sum** $\\sum c_if_i(x)$; it reduces **bias**, so it suits low-variance, high-bias learners such as **stumps** (pages 604–610). Examples: bagging → random forest; boosting → AdaBoost, gradient boosting, XGBoost.",
    },
    {
      title: "Random forest",
      level: "Level 1",
      question: "How does a random forest differ from plain bagging, and why does that help?",
      solution: "A random forest bags **deep decision trees** trained on bootstrap samples, and **additionally** considers only a **random subset of features at each split** (pages 602–603). This decorrelates the trees (one strong feature can no longer dominate every tree), so averaging their predictions removes more variance. Final prediction: majority vote (classification) or average (regression), e.g. ratings 5, 4, 5, 4, 4 → 4.4.",
    },
    {
      title: "AdaBoost algorithm",
      level: "Level 2",
      question: "Describe the AdaBoost algorithm and the role of the learner weight α.",
      solution: "Initialise $w_i = 1/n$. Each round: fit a stump using the weights (best Gini/information gain), compute weighted error ε, set $\\alpha = \\frac12\\ln\\frac{1-\\epsilon}{\\epsilon}$, multiply weights of misclassified samples by $e^{\\alpha}$ and correct ones by $e^{-\\alpha}$, normalise, repeat until the number of estimators or target accuracy is reached (pages 618–619). Final $H(x) = \\text{sign}(\\sum\\alpha_th_t(x))$. α is large when ε is small, so accurate stumps get more say; ε = 0.5 gives α = 0 (no say).",
    },
    {
      title: "Gradient boosting and XGBoost",
      level: "Level 3",
      question: "Explain gradient boosting with residuals and list what XGBoost adds.",
      solution: "Gradient boosting starts from a base prediction (mean or most frequent class), computes **residuals** (actual − predicted), fits a new tree to the residuals, adds **learning rate × tree** to the prediction, and repeats; residuals are the negative gradient of the squared loss, and Friedman generalised this to any differentiable loss (pages 615–617, 639–641). **XGBoost** (pages 630–635, 642–643) adds L1/L2 **regularisation**, **shrinkage**, **pruning** of unhelpful splits, level-wise growth, **sparsity-aware missing-value handling**, cache-aware memory access, approximate greedy split search, parallel/GPU training, **early stopping** and feature importance. Worked example: 25 → 22/28 → 19.9/30.1 with MSE 74 → 49.01.",
    },
    {
      title: "Stacking",
      level: "Level 2",
      question: "What is stacking, and how is the meta-model trained?",
      solution: "Stacking combines **heterogeneous** base models (e.g. decision tree, k-NN, SVM) through a **meta-model** (e.g. a neural network) that *learns* how to weight them, unlike the fixed averaging of bagging/boosting (pages 644–645). Training (pages 646–648): split data into folds; train base models on one fold; collect their predictions on the other fold; train the meta-model on those predictions and true labels. **k-fold cross-training** repeats this so all samples are used for both levels, preventing the meta-model from learning on predictions the base models made on their own training data.",
    },
  ],

  quiz: [
    { topic: "Basics", q: "Bagging mainly reduces…", options: ["bias", "variance", "training time", "the number of features"], answer: 1, why: "Page 587.", wrong: ["Boosting reduces bias.", null, "It trains many models.", "Random forests sample features but still aim at variance."] },
    { topic: "Basics", q: "Boosting usually uses which base learners?", options: ["Deep, high-variance trees", "Shallow, high-bias stumps", "k-NN only", "Neural networks only"], answer: 1, why: "Page 605." },
    { topic: "Basics", q: "Stacking differs from bagging and boosting because it…", options: ["uses only trees", "uses heterogeneous learners and a meta-model", "never uses cross-validation", "is unsupervised"], answer: 1, why: "Page 644." },
    { topic: "Bagging", q: "A bootstrap sample is drawn…", options: ["without replacement, half size", "with replacement, same size", "by stratified folds", "from the test set"], answer: 1, why: "Page 592." },
    { topic: "Bagging", q: "Averaging the class probabilities of all models and picking the highest is…", options: ["hard voting", "soft voting", "stacking", "boosting"], answer: 1, why: "Page 599." },
    { topic: "Bagging", type: "num", q: "Five trees predict 5, 4, 5, 4, 4. Random forest regression output?", answer: 4.4, tol: 0.001, why: "Average (page 603)." },
    { topic: "Bagging", q: "What does a random forest add to bagging?", options: ["Sequential training", "A random subset of features at each split", "A meta-model", "Sample reweighting"], answer: 1, why: "Page 602." },
    { topic: "AdaBoost", type: "num", q: "AdaBoost: weighted error ε = 1/6. α = ½ ln((1−ε)/ε)? (4 decimals)", answer: 0.8047, tol: 0.0005, why: "½ ln 5." },
    { topic: "AdaBoost", type: "num", q: "With α = 0.8047, the multiplier for a misclassified sample is…? (4 decimals)", answer: 2.2361, tol: 0.001, why: "$e^{0.8047} = \\sqrt5$." },
    { topic: "AdaBoost", q: "After updating weights in AdaBoost you must…", options: ["delete wrong samples", "normalise the weights to sum to 1", "retrain all previous stumps", "set α to 1"], answer: 1, why: "Step 5 (page 619)." },
    { topic: "Gradient boosting", q: "Each new tree in gradient boosting is fitted to…", options: ["the original labels", "the residuals of the current model", "random noise", "the test set"], answer: 1, why: "Page 615." },
    { topic: "Gradient boosting", type: "num", q: "Base prediction 25, leaf value −10, learning rate 0.3. New prediction?", answer: 22, tol: 0.001, why: "25 + 0.3(−10)." },
    { topic: "XGBoost", q: "Which is NOT a feature of XGBoost listed in the slides?", options: ["Built-in regularisation", "Handling missing values", "Cache-aware prefetching", "Requires no hyperparameters"], answer: 3, why: "Pages 631, 642–643." },
    { topic: "Stacking", q: "The meta-model in stacking is trained on…", options: ["the raw training features only", "the base models' predictions on held-out data", "the test labels", "bootstrap samples"], answer: 1, why: "Pages 646–648." },
  ],
};
