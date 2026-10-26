// ML — Exam summary: every module's ⚡ Recap on one page (single source of truth: the module files).
import m1 from "./m1.js";
import m2 from "./m2.js";
import m3 from "./m3.js";
import m4 from "./m4.js";
import m5 from "./m5.js";
import m6 from "./m6.js";
import m7 from "./m7.js";

const MODULES = [[1, m1], [2, m2], [3, m3], [4, m4], [5, m5], [6, m6], [7, m7]].map(([n, m]) => ({
  id: `m${n}`,
  heading: `M${n}. ${m.title}`,
  slides: "",
  blocks: m.recap,
}));

export default {
  title: "ML Exam Summary",
  source: "Modules 1–7 · read in about 30 minutes",
  overview:
    "Read this before the exam. Section 1 maps question wording to the method and module; sections M1–M7 are each module's ⚡ Recap; section 2 lists the traps that cost marks, including the slide errors we found. Every number in the module pages was re-computed in Python. For lookups, use the 🔎 **Formula Index**; for drilling, the 🔀 **Mixed Quiz**.",

  summary: [
    {
      id: "map",
      heading: "1. Which method? A decision map",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["If the question…", "Do this", "Module"],
          rows: [
            ["asks for T, P, E or the type of learning", "T = job, P = measurable %, E = data; classify by the target", "M1"],
            ["asks for attribute types", "nominal (=) · ordinal (<) · interval (+) · ratio (×, true zero)", "M2"],
            ["gives data and asks for outliers", "sort → Q1, Q3 → IQR → fences $Q_1 - 1.5 \\text{IQR}$, Q3 + 1.5IQR (or $\\mu \\pm 3 \\sigma$)", "M2"],
            ["asks to normalise / standardise", "min-max $(v - \\min)/(\\max - \\min) \\cdot z = (v - \\mu)/\\sigma$ · decimal v/10ʲ", "M2"],
            ["gives a case study and asks for preprocessing", "column by column: type → problem → fix (units, missing, scales, encoding)", "M2"],
            ["asks for the least-squares line", "$\\theta_1$ = Sxy/Sxx, $\\theta_0$ = ȳ − $\\theta_1 \\bar{x}$ · or $\\theta = (X^T X)^{-1} X^T y$", "M3"],
            ["asks for gradient-descent iterations (regression)", "table ŷ, e = ŷ − y, $e \\cdot x_j$, sums → $\\theta_j - (\\alpha/n) \\sum e \\cdot x_j$", "M3"],
            ["adds ridge / lasso", "ridge $\\theta_j(1 - \\alpha \\lambda)$ − …; lasso − $\\alpha \\lambda \\cdot \\text{sign}(\\theta_j)$; never $\\theta_0$", "M3"],
            ["asks for $\\text{MSE}/\\text{RMSE}/R^2$", "Σ(y − ŷ)²/n, $\\sqrt{\\text{MSE}}$, $1 - \\text{SSE}/\\text{SST}$", "M3"],
            ["gives a logistic model and a new point", "$z = \\theta^T x$ → $\\sigma(z)$ → class (≥ 0.5) → odds ratio $e^{\\theta}$", "M4"],
            ["asks for a logistic GD iteration", "same table with $h = \\sigma(z)$, update $\\theta - (\\alpha/m) \\sum(h - y) x$", "M4"],
            ["gives a confusion matrix", "precision, recall, specificity, FPR, $F_1$, accuracy", "M4"],
            ["gives scores and classes", "sort → thresholds → (FPR, TPR) → trapezoid AUC", "M4"],
            ["asks which attribute to split on", "entropy & information gain (or Gini, gain ratio)", "M5"],
            ["has a continuous attribute in a tree", "midpoints → lowest weighted Gini/entropy", "M5"],
            ["asks to prune", "pre: gain ≤ threshold → leaf · post: prune if validation error doesn't rise", "M5"],
            ["compares trees with bits", "MDL: internal log₂(#attrs), leaf ⌈log₂(#classes)⌉, error $\\log_2 n$", "M5"],
            ["asks for a distance between objects", "Minkowski / Jaccard / simple matching / rank / Gower", "M6"],
            ["asks to classify with K neighbours", "distance table → K nearest → vote (weighted: $\\sum 1/d^2$)", "M6"],
            ["asks for locally weighted regression", "kernel weights → weighted average and weighted GD step", "M6"],
            ["asks how to tune hyperparameters", "validation set / (stratified) k-fold CV, never the test set", "M6"],
            ["gives support vectors", "augment → dot-product equations = labels → $\\alpha$ → $\\tilde{w}$ → b → hyperplane, margin $2/\\|w\\|$", "M7"],
            ["asks for a kernel value", "$x^T y$ first, then $(c + x^T y)^q$ or exp(−$\\|x - y\\|^2/2 \\sigma^2$)", "M7"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "The universal answer layout",
          text: "```flow\nState the formula / update rule -> Build a table of intermediate values -> Compute (keep 4 d.p.) -> Answer -> One-line interpretation\n```",
        },
      ],
    },
    ...MODULES,
    {
      id: "traps",
      heading: "2. Traps that cost marks",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Classify problems by the target column**, not the inputs.",
            "**Fit scalers on training data only**; never tune hyperparameters on the test set.",
            "**Column of 1s in X**; **simultaneous** GD updates using the old $\\theta$; error × feature for each $\\theta_j$.",
            "**A diverging loss** means $\\alpha$ is too large for unscaled features. Say so.",
            "**Don't regularise $\\theta_0$.** Ridge shrinks by $(1 - \\alpha \\lambda)$; if $\\alpha \\lambda \\ge 1$ the update breaks.",
            "**Logistic weights act on log-odds**: $\\text{odds} \\times e^{\\theta}$ per unit.",
            "**Rows = actual, columns = predicted.** Precision divides by the predicted-positive column, recall by the actual-positive row.",
            "**Entropy uses $\\log_2$ and weighted children.** $E(3, 1) = 0.811$, $E(9, 5) = 0.940$.",
            "**Gini / weighted impurity: lowest wins.** Gain: highest wins.",
            "**Scale before k-NN**, and use odd K for two classes.",
            "**SVM:** augment with 1; b is the last entry; margin $2/\\|w\\|$.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide errors to be aware of (details on each module page and the Coverage page)",
          text: "M2 $3 \\sigma$ covers 99.7% (not 99%) · M3 car-mileage SAE 15.77/13.13/15.39 · M3 elastic-net r convention vs sklearn `l1_ratio` · M4 high-skew T1 $P = 0.333$, $F = 0.40$ · M4 ROC tie handling (0.56 vs 0.60) · M5 EnjoySport $E(3, 1) = 0.811$ · M5 slide 63 test prediction is No · M5 Tid 6 Single vs Married · M7 slide 21's points lie on the hyperplane.",
        },
      ],
    },
  ],
};
