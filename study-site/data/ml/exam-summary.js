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
            ["gives data and asks for outliers", "sort → Q1, Q3 → IQR → fences Q1 − 1.5IQR, Q3 + 1.5IQR (or μ ± 3σ)", "M2"],
            ["asks to normalise / standardise", "min-max (v − min)/(max − min) · z = (v − μ)/σ · decimal v/10ʲ", "M2"],
            ["gives a case study and asks for preprocessing", "column by column: type → problem → fix (units, missing, scales, encoding)", "M2"],
            ["asks for the least-squares line", "θ₁ = Sxy/Sxx, θ₀ = ȳ − θ₁x̄ · or θ = (XᵀX)⁻¹Xᵀy", "M3"],
            ["asks for gradient-descent iterations (regression)", "table ŷ, e = ŷ − y, e·xⱼ, sums → θⱼ − (α/n)Σe·xⱼ", "M3"],
            ["adds ridge / lasso", "ridge θⱼ(1 − αλ) − …; lasso − αλ·sign(θⱼ); never θ₀", "M3"],
            ["asks for MSE / RMSE / R²", "Σ(y − ŷ)²/n, √MSE, 1 − SSE/SST", "M3"],
            ["gives a logistic model and a new point", "z = θᵀx → σ(z) → class (≥ 0.5) → odds ratio e^θ", "M4"],
            ["asks for a logistic GD iteration", "same table with h = σ(z), update θ − (α/m)Σ(h − y)x", "M4"],
            ["gives a confusion matrix", "precision, recall, specificity, FPR, F₁, accuracy", "M4"],
            ["gives scores and classes", "sort → thresholds → (FPR, TPR) → trapezoid AUC", "M4"],
            ["asks which attribute to split on", "entropy & information gain (or Gini, gain ratio)", "M5"],
            ["has a continuous attribute in a tree", "midpoints → lowest weighted Gini/entropy", "M5"],
            ["asks to prune", "pre: gain ≤ threshold → leaf · post: prune if validation error doesn't rise", "M5"],
            ["compares trees with bits", "MDL: internal log₂(#attrs), leaf ⌈log₂(#classes)⌉, error log₂n", "M5"],
            ["asks for a distance between objects", "Minkowski / Jaccard / simple matching / rank / Gower", "M6"],
            ["asks to classify with K neighbours", "distance table → K nearest → vote (weighted: Σ1/d²)", "M6"],
            ["asks for locally weighted regression", "kernel weights → weighted average and weighted GD step", "M6"],
            ["asks how to tune hyperparameters", "validation set / (stratified) k-fold CV, never the test set", "M6"],
            ["gives support vectors", "augment → dot-product equations = labels → α → w̃ → b → hyperplane, margin 2/‖w‖", "M7"],
            ["asks for a kernel value", "xᵀy first, then (c + xᵀy)^q or exp(−‖x − y‖²/2σ²)", "M7"],
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
            "**Column of 1s in X**; **simultaneous** GD updates using the old θ; error × feature for each θⱼ.",
            "**A diverging loss** means α is too large for unscaled features. Say so.",
            "**Don't regularise θ₀.** Ridge shrinks by (1 − αλ); if αλ ≥ 1 the update breaks.",
            "**Logistic weights act on log-odds**: odds × e^θ per unit.",
            "**Rows = actual, columns = predicted.** Precision divides by the predicted-positive column, recall by the actual-positive row.",
            "**Entropy uses log₂ and weighted children.** E(3,1) = 0.811, E(9,5) = 0.940.",
            "**Gini / weighted impurity: lowest wins.** Gain: highest wins.",
            "**Scale before k-NN**, and use odd K for two classes.",
            "**SVM:** augment with 1; b is the last entry; margin 2/‖w‖.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide errors to be aware of (details on each module page and the Coverage page)",
          text: "M2 3σ covers 99.7% (not 99%) · M3 car-mileage SAE 15.77/13.13/15.39 · M3 elastic-net r convention vs sklearn l1_ratio · M4 high-skew T1 P = 0.333, F = 0.40 · M4 ROC tie handling (0.56 vs 0.60) · M5 EnjoySport E(3,1) = 0.811 · M5 slide 63 test prediction is No · M5 Tid 6 Single vs Married · M7 slide 21's points lie on the hyperplane.",
        },
      ],
    },
  ],
};
