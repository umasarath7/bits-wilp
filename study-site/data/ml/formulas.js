// ML — Searchable formula & concept index.
// Each row: [Topic, Formula, Conditions / when to use, Typical question wording, Worked example (module · slides)]

const ROWS = [
  // ---- M1
  ["Definition of ML", "Improve at task T, measured by P, with experience E", "Defining a learning problem", "“define T, P and E”", "Spam, handwriting, checkers, driving (M1 · 18–20)"],
  ["Types of learning", "Supervised (labels) · unsupervised (none) · reinforcement (rewards) · semi-supervised (few labels)", "Classify a problem", "“which type of learning”", "Employability, car price, segmentation (M1 · 30–51)"],
  ["Classification vs regression", "Categorical target → classification; real target → regression", "Supervised problems", "“predict whether” / “predict how much”", "Tumour vs sea-ice extent (M1 · 34, 40)"],
  ["Batch / mini-batch / online", "All data / subsets / one instance per update", "How training data is used", "“incremental”, “streaming”", "(M1 · 52)"],
  ["Instance- vs model-based", "Store and compare (lazy) vs learn parameters (eager)", "Describing a learner", "“k-NN is…”", "(M1 · 53; M6 · 5)"],
  ["ML workflow", "Should I use ML → data → preprocess → model/loss → optimise → hyperparameters → analyse", "Project planning", "“steps of an ML project”", "Car price from mileage (M1 · 58–59)"],
  // ---- M2
  ["Attribute types", "Nominal (=) < Ordinal (<) < Interval (+ −) < Ratio (× ÷, true zero)", "Describing data", "“identify the attribute type”", "Bank case study (M2 · 9–13, 24)"],
  ["Permissible transformations", "Nominal: permutation · ordinal: monotonic · interval: a·x + b · ratio: a·x", "Attribute types", "“which transformation”", "°C ↔ °F, m ↔ ft (M2 · 13)"],
  ["IQR outliers", "IQR = Q₃ − Q₁; fences Q₁ − 1.5·IQR, Q₃ + 1.5·IQR", "Sorted numeric data", "“find the outlier”", "10…22 → fences 5.75, 19.75, outlier 22 (M2 · 44–45)"],
  ["3σ rule", "Outlier if x < μ − 3σ or x > μ + 3σ", "Roughly normal data", "“z-score method”", "μ 50, σ 5 → 35, 65 (M2 · 47)"],
  ["Min-max normalisation", "$v' = \\frac{v - \\min}{\\max - \\min}(\\text{new}_{max} - \\text{new}_{min}) + \\text{new}_{min}$", "Known bounds, k-NN/NN; not for skewed data", "“normalise to [0, 1]”", "73,600 → 0.716 (M2 · 58)"],
  ["Z-score standardisation", "$v' = \\frac{v - \\mu}{\\sigma}$", "Gaussian-assuming algorithms; outliers", "“standardise”", "73,600 → 1.225; lengths −0.707, 1.414 (M2 · 56–58)"],
  ["Decimal scaling", "$v' = v/10^j$, smallest j with max|v'| < 1", "Quick scaling", "“decimal scaling”", "(M2 · 58)"],
  ["Stratified sampling", "Sample each stratum in proportion to its size", "Groups of different sizes", "“representative sample”", "600/300/100 → 60/30/10 (M2 · 53)"],
  ["Equal-width / equal-depth binning", "Width W = (max − min)/N · equal counts per bin", "Discretisation", "“binning”", "(M2 · 65–66)"],
  ["Encoding", "One-hot for nominal · label encoding for ordinal", "Categorical features", "“encode”", "(M2 · 67)"],
  ["Inductive learning hypothesis", "Fits enough training examples → fits unseen ones", "Theory", "“state the hypothesis”", "(M2 · 72)"],
  // ---- M3
  ["Linear hypothesis", "$h_\\theta(x) = \\theta_0 + \\theta_1x_1 + \\dots + \\theta_dx_d = X\\theta$", "Regression", "“fit a linear model”", "(M3 · 8–9, 29)"],
  ["Least-squares cost", "$J(\\theta) = \\frac{1}{2n}\\sum(h_\\theta(x^{(i)}) - y^{(i)})^2$", "Regression", "“cost function”", "(1,1),(2,2),(3,3): J(0.5) = 0.583 (M3 · 17–23)"],
  ["Simple OLS", "$\\theta_1 = \\frac{\\sum(x - \\bar x)(y - \\bar y)}{\\sum(x - \\bar x)^2}$, $\\theta_0 = \\bar y - \\theta_1\\bar x$", "One feature", "“least-squares line”", "Tips → −0.8188 + 0.1462x (M3 · 14–15)"],
  ["Normal equation", "$\\theta = (X^TX)^{-1}X^Ty$", "Small number of features; XᵀX invertible", "“closed form”", "Experience → salary θ = (1, 1) (M3 · 32–36)"],
  ["Gradient descent (regression)", "$\\theta_j := \\theta_j - \\frac{\\alpha}{n}\\sum(h_\\theta(x^{(i)}) - y^{(i)})x_j^{(i)}$", "Any differentiable cost", "“first iteration of GD”", "RRCHD → 5.0016, 0.0477, 0.1793; house → (0.367, 0.833) (M3 · 64–74)"],
  ["Learning rate effect", "Small α slow · large α oscillates/diverges", "GD tuning", "“interpret convergence”", "(M3 · 59, 62)"],
  ["GD variants", "Batch (all) · SGD (1) · mini-batch (chunks)", "Large data / online", "“stochastic”", "(M3 · 77–82)"],
  ["MSE / RMSE / R²", "$\\frac{1}{n}\\sum(y - \\hat y)^2$ · $\\sqrt{MSE}$ · $1 - \\frac{SSE}{SST}$", "Regression evaluation", "“evaluate the model”", "Houses MSE 2.5, RMSE 1.58 (M3 · 86–87)"],
  ["Basis functions", "$y = \\sum w_j\\phi_j(x)$, e.g. $\\phi_j = x^j$", "Non-linear relationships", "“polynomial regression”", "(M3 · 91–93)"],
  ["Bias / variance", "Underfit: train & test error high · overfit: train low, test high", "Diagnosis", "“high bias / high variance”", "(M3 · 95–100)"],
  ["Ridge (L2)", "$J + \\frac{\\lambda}{2}\\sum_{j \\ge 1}\\theta_j^2$; $\\theta_j \\leftarrow \\theta_j(1 - \\alpha\\lambda) - \\frac{\\alpha}{n}\\sum(h - y)x_j$", "Overfitting; keep all features", "“regularisation constant”", "RRCHD → 0.0507, 0.1823 (M3 · 111, 115–116)"],
  ["Lasso (L1)", "$J + \\lambda\\sum|\\theta_j|$; $\\theta_j \\leftarrow \\theta_j - \\frac{\\alpha}{n}\\sum(h - y)x_j - \\alpha\\lambda\\,\\text{sign}(\\theta_j)$", "Sparse model, feature selection", "“lasso”", "RRCHD → 0.1477, 0.2793 (M3 · 112, 116)"],
  ["Elastic net", "$r\\frac{\\lambda}{2}\\sum\\theta^2 + \\frac{1 - r}{2}\\lambda\\sum|\\theta|$ (slide: r = 1 ridge)", "Correlated features", "“elastic net”", "(M3 · 113)"],
  // ---- M4
  ["Sigmoid / logistic model", "$h_\\theta(x) = \\frac{1}{1 + e^{-\\theta^Tx}}$; predict 1 iff θᵀx ≥ 0", "Binary classification", "“probability that”", "Sentiment 0.70; job (5, 6) → 0.31 (M4 · 7, 29, 35)"],
  ["Cross-entropy", "$J = -\\frac{1}{m}\\sum[y\\log h + (1 - y)\\log(1 - h)]$", "Logistic regression", "“cost function”", "(M4 · 20–22)"],
  ["Logistic GD", "$\\theta_j := \\theta_j - \\frac{\\alpha}{m}\\sum(h - y)x_j$", "Training logistic regression", "“one iteration”", "→ 0.350, −0.424, −0.613 (M4 · 30–34)"],
  ["Odds ratio", "$e^{\\theta_j}$: odds multiply per unit of xⱼ", "Interpreting coefficients", "“interpret the influence”", "e^0.3 = 1.35 (M4 · 35)"],
  ["Logit", "$\\log\\frac{p}{1 - p} = \\theta^Tx$", "Inverse of the sigmoid", "“log-odds”", "(M4 · 67)"],
  ["C in sklearn", "C = 1/λ; higher C → less regularisation", "LogisticRegression, SVC", "“hyperparameter C”", "(M4 · 37)"],
  ["Confusion-matrix metrics", "Acc (TP+TN)/all · P = TP/(TP+FP) · R = TP/(TP+FN) · Spec TN/(TN+FP) · FPR FP/(FP+TN) · F₁ 2PR/(P+R)", "Classification evaluation", "“precision, recall, F-score”", "Cancer P 0.391, R 0.30 (M4 · 44, 62)"],
  ["Accuracy paradox", "99% accuracy can mean 0 recall on the rare class", "Imbalanced data", "“which model is better”", "990/10 cars (M4 · 40–42)"],
  ["ROC / AUC", "TPR vs FPR over thresholds; AUC by trapezoids (1 perfect, 0.5 random)", "Threshold-free comparison", "“construct the ROC”", "AUC 0.56 (slide 0.60) (M4 · 49–57)"],
  ["Multi-class", "OvA: K classifiers · OvO: K(K − 1)/2", "More than 2 classes", "“one-vs-rest”", "(M4 · 65–66; M7 · 64–65)"],
  ["Class imbalance fixes", "SMOTE / resample · change metric · other algorithms", "Rare class", "“imbalanced”", "(M4 · 59–60)"],
  // ---- M5
  ["Entropy", "$-\\sum p_c\\log_2 p_c$ (0 pure; max log₂k)", "Tree splitting", "“impurity”", "E(9,5) 0.940; E(3,1) 0.811 (M5 · 27–28)"],
  ["Information gain", "$E(S) - \\sum\\frac{|S_v|}{|S|}E(S_v)$", "ID3", "“best attribute at the root”", "Outlook 0.247 (M5 · 29–36)"],
  ["Gini index", "$1 - \\sum p_i^2$; split: weighted Gini, lowest wins", "CART", "“Gini”", "Home owner 0.343, gain 0.077 (M5 · 66–69)"],
  ["Classification error", "$1 - \\max_i p_i$", "Impurity (pruning)", "“misclassification error”", "(1,5) → 0.167 (M5 · 81)"],
  ["Continuous split", "Sort; candidate thresholds at midpoints; lowest weighted impurity", "Numeric attribute", "“threshold”", "Temp 54 (0.25); income 97.5 (0.300) (M5 · 74–79)"],
  ["Gain ratio", "Gain / SplitInfo, SplitInfo $= -\\sum\\frac{|S_i|}{|S|}\\log_2\\frac{|S_i|}{|S|}$", "Many-valued attributes", "“Customer ID”", "Car type 0.41 vs ID 0.23 (M5 · 82–87)"],
  ["Pre-pruning", "Stop if gain ≤ threshold / min samples / max depth; leaf = majority", "Overfitting", "“threshold 0.85”", "Square → leaf Allow (M5 · 99–102)"],
  ["Post-pruning", "Prune a node if the prune-set error doesn't increase", "Overfitting", "“prune set”", "Prune Size, keep Colour (M5 · 103–109)"],
  ["MDL", "min L(tree) + L(errors): internal log₂(#attrs), leaf ⌈log₂(#classes)⌉, error log₂n", "Comparing trees", "“description length”", "Tree (a) better if n < 16 (M5 · 110–119)"],
  // ---- M6
  ["Minkowski distance", "$(\\sum|x_i - y_i|^h)^{1/h}$: h = 1 Manhattan, 2 Euclidean, ∞ supremum", "Numeric attributes", "“distance matrix”", "x1–x2: 5, 3.61, 3 (M6 · 24–27)"],
  ["Simple matching", "$d = \\frac{p - m}{p}$", "Nominal attributes", "“nominal”", "2 of 3 match → 1/3 (M6 · 11–13)"],
  ["Jaccard", "$d = \\frac{b + c}{a + b + c}$, $J = \\frac{a}{a + b + c}$", "Asymmetric binary", "“asymmetric binary”", "Jack–Mary 0.33; basket 0.5 (M6 · 17–23)"],
  ["Ordinal scaling", "$z = \\frac{r - 1}{M - 1}$", "Ordinal attributes", "“rank”", "5 levels → 0, 0.25, … (M6 · 29)"],
  ["Gower distance", "$\\frac{\\sum w_c\\delta^{(c)}d^{(c)}}{\\sum w_c\\delta^{(c)}}$", "Mixed attribute types", "“weighted dissimilarity”", "Students d(A,B) = 0.26 (M6 · 30–32)"],
  ["k-NN", "Class: majority of k nearest · regression: mean", "Instance-based prediction", "“KNN with K = 3, 5, 7”", "(1,1): +, +, − (M6 · 40–52)"],
  ["Choosing k", "k ≈ √N (odd) · elbow · cross-validation", "Hyperparameter", "“value of K”", "(M6 · 43–47)"],
  ["Distance-weighted k-NN", "$w_i = 1/d^2$ (or $1/(d_0 + d)^2$, $e^{-(d/\\sigma)^2}$); $\\hat f = \\frac{\\sum w_if(x_i)}{\\sum w_i}$", "Noisy data, use all points", "“locally weighted KNN”", "C4 → L1 (2.06 vs 1.60) (M6 · 48, 53–56)"],
  ["Locally weighted regression", "$E_3 = \\frac{1}{2}\\sum_{kNN}K(d)(f - \\hat f)^2$; $w_j \\mathrel{-}= \\eta\\sum K e\\,x_j$", "Non-linear regression", "“kernel exp(−d²/2b²)”", "ŷ(7) = 7.747; w = (3.43, 0.43) (M6 · 62–71)"],
  ["Cross-validation", "Holdout · LOOCV · k-fold · stratified k-fold; tune on validation, test once", "Model selection", "“how to choose hyperparameters”", "(M6 · 77–84)"],
  // ---- M7
  ["SVM margin", "$M = \\frac{2}{\\|w\\|}$", "Linear SVM", "“margin”", "w = (1, 0) → 2 (M7 · 16–17, 34)"],
  ["Hard-margin SVM", "$\\min\\frac{1}{2}\\|w\\|^2$ s.t. $y_i(w^Tx_i + b) \\ge 1$", "Separable data", "“optimisation problem”", "(M7 · 18–19)"],
  ["SVM dual solution", "$w = \\sum\\alpha_iy_ix_i$, $\\sum\\alpha_iy_i = 0$, $b = y_k - w\\cdot x_k$; $f(x) = \\text{sign}(\\sum\\alpha_iy_ix_i\\cdot x + b)$", "Solving SVMs", "“find w and b”", "α = (−3.5, 0.75, 0.75) → x₁ = 2 (M7 · 22–37)"],
  ["Soft margin", "$\\frac{1}{2}\\|w\\|^2 + C\\sum\\xi_i$, $y_i(w^Tx_i + b) \\ge 1 - \\xi_i$", "Noisy / overlapping data", "“slack”, “C”", "(M7 · 40–46)"],
  ["Kernel trick", "$K(x_i, x_j) = \\varphi(x_i)^T\\varphi(x_j)$", "Non-linear SVM", "“kernel”", "(x², √2xy, y²) ⇒ (aᵀb)² (M7 · 50, 59)"],
  ["Kernel functions", "Linear xᵀy · polynomial (1 + xᵀy)ᵖ · RBF exp(−‖x − y‖²/2σ²) · sigmoid tanh(β₀xᵀy + β₁)", "Choosing a kernel", "“polynomial kernel”", "(1,2),(2,3) → 8, 64, 81 (M7 · 60–61)"],
];

export default {
  title: "Formula & Concept Index",
  source: `${ROWS.length} formulas across Modules 1–7 · searchable`,
  overview:
    "Your quick-lookup companion. Type a keyword: a topic (“Gini”), a symbol (“λ”), a phrase from the question (“prune set”, “first iteration”) or a module (“M5”). Each row gives the formula, **when it applies**, the **typical wording** that signals it, and a **worked example** with its slides. Then open that module for the full method.",
  summary: [
    {
      id: "index",
      heading: "🔎 Search the index",
      slides: "",
      blocks: [
        {
          type: "search",
          placeholder: "Search: e.g. entropy, ridge, M6, kernel, outlier…",
          head: ["Topic", "Formula", "Conditions / when", "Typical wording", "Worked example (module · slides)"],
          rows: ROWS,
        },
      ],
    },
  ],
};
