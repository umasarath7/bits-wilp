// AML — Overlap map with the ML course (DSEZG565): what is shared, what is AML-only, what is ML-only,
// and where to study each shared topic once. Built by comparing every AML session page with every ML module page.

const S = "🟰 Same core";
const P = "🔀 Partial";
const N = "🆕 AML only";

export default {
  title: "AML vs ML: What Overlaps and What Doesn't",
  source: "AML Sessions 1–15 compared with ML Modules 1–11 · study-planning page",
  overview:
    "AML and ML share much of their syllabus, so you don't need to learn everything twice. This page tells you, session by session, **what is the same**, **what only AML has** (study it on the AML page) and **what only ML has** (not needed for the AML exam). Use the three symbols: **🟰 Same core**: learn it once (either page) and just practise AML's own numericals; **🔀 Partial**: shared basics plus AML-only extras you must not skip; **🆕 AML only**: no help from ML, give it full time. Each AML session page also starts with a short 🔗 *ML overlap* box saying the same thing.",

  summary: [
    {
      id: "map",
      heading: "1. Session-by-session overlap map",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["AML session", "ML module", "Overlap", "Shared (learn once)", "AML only (must study)", "ML only (skip for AML)"],
          rows: [
            ["S1 Introduction", "M1", S, "T-P-E definition, when to use ML, supervised / unsupervised / semi-supervised / RL, batch vs online, instance vs model based", "Application domains, ML challenges (bad data, wrong model), validation and hyperparameter basics", "Tools and workflow slide"],
            ["S2 End-to-end ML: data & preprocessing", "M2 (+ M6 distances)", P, "Attribute types (NOIR), data quality, aggregation, sampling, discretisation, normalisation / z-score, curse of dimensionality, PCA idea", "Framing the housing problem, **RMSE / MAE**, dataset types (record, graph, ordered), percentiles, **similarity measures** (Euclidean, Minkowski, cosine, correlation), visualisation (box plots, star plots, Chernoff faces), housing notebook", "IQR and 3σ outlier exercises, decimal scaling, attribute-typing case study, inductive learning hypothesis"],
            ["S3 Model selection, evaluation, tuning, MLOps", "M4, M11", P, "Confusion matrix, precision / recall / F1, ROC and AUC, holdout and k-fold", "**Grid and random search**, learning curves, MNIST multiclass, **MLOps** (levels 0–2, CI/CD), data and model validation", "Statistical comparison of models (confidence intervals)"],
            ["S4 Linear regression", "M3", S, "Hypothesis, least squares, MSE / R², gradient descent, multivariate regression, normal equation, polynomial fitting, bias–variance, regularisation", "Contour-plot intuition, the house-data notation", "Ridge / lasso / elastic net in depth, basis-function models, GD variants comparison"],
            ["S5 Logistic regression", "M4", S, "Sigmoid, decision boundary, log-loss, gradient descent, one-vs-all / one-vs-one", "The PDF's worked GD example (initial weights all 1)", "Regularised logistic regression, sentiment worked problem, class imbalance"],
            ["S6 Naïve Bayes", "M8", P, "Bayes' theorem, NB from a frequency table, Laplace smoothing, text classification", "**Full-Bayes meningitis example** and data fragmentation, generative vs discriminative, tax-evasion table, NewsGroups", "**MLE, MAP, Bayes optimal, Gibbs**, Gaussian NB, multinomial vs Bernoulli NB, LR vs NB"],
            ["S7 SVM", "M7", S, "Maximum margin 2/‖w‖, the optimisation problem, soft margin and C, kernel trick, multi-class", "**XOR with SVM** (asked in the previous mid-sem), polynomial-kernel homework", "ML's own numerical SVM example"],
            ["S8 Revision", "–", "–", "–", "Formula sheet, batch vs stochastic GD on the same data, previous paper", "–"],
            ["S9 Decision trees", "M5", S, "Hunt's algorithm, entropy and information gain, Gini, overfitting, pre- and post-pruning", "Job-offer (CGPA / aptitude) multi-level worked example", "Gain ratio, classification error, continuous thresholds, MDL, PlayTennis ID3"],
            ["S10 Ensembles", "M9", P, "Why combine learners, bagging, random forests, AdaBoost", "Fusion / voting rules, polynomial committee illustration", "**Gradient boosting, XGBoost, stacking**"],
            ["S11 Clustering & EM", "M10", P, "k-means, Gaussian mixtures and EM", "**Agglomerative hierarchical clustering**, six-point single-link example", "k-medoids, ML's EM numerical"],
            ["S12 Neural networks", "–", N, "–", "**Everything**: perceptron, perceptron and delta rules, activations, backpropagation, deep-learning intro", "–"],
            ["S13 CNNs & RNNs", "–", N, "–", "**Everything**: convolution, padding, stride, parameters, pooling, LeNet / AlexNet / VGG, RNNs, sequence types", "–"],
            ["S14 Clustering in depth", "M10", P, "k-means, elbow idea, silhouette", "**Linkage problems, DBSCAN, Hopkins statistic, BCubed**, k-means problem on 5 points", "k-medoids"],
            ["S15 FAccT", "M11", P, "FAccT requirements, COMPAS, fairness through unawareness and proxies", "**Simpson's paradox, demographic parity, equal opportunity, equalized odds (numerical)**, real-world bias cases", "Interpretability and its trade-off"],
            ["Webinar 1", "–", N, "–", "Loan-approval models and the Streamlit app (practical)", "–"],
            ["–", "M6 k-NN", "ML only", "–", "–", "**k-NN** (whole module): not in AML"],
          ],
        },
      ],
    },
    {
      id: "plan",
      heading: "2. How to split your study time",
      slides: "",
      blocks: [
        {
          type: "table",
          caption: "Priority for the AML exam",
          head: ["Priority", "What", "Why"],
          rows: [
            ["**1. Highest**", "S12 Neural networks, S13 CNNs & RNNs, S14 linkage / DBSCAN / Hopkins / silhouette, S15 fairness criteria, S3 MLOps and tuning", "**AML only**: nothing carries over from ML, and each has numerical problems in the PDF"],
            ["**2. High**", "The AML-only extras in 🔀 rows: similarity measures (S2), meningitis full Bayes (S6), hierarchical clustering (S11), fusion rules (S10)", "Short, but easy to miss if you rely on ML notes"],
            ["**3. Revise once**", "🟰 rows: linear and logistic regression, SVM, decision trees, intro", "Learn the method once (ML or AML page), then **do the AML page's numericals**: AML's exam is about 80% numerical"],
            ["**4. Skip for AML**", "ML-only items: k-NN, MLE/MAP/Bayes optimal/Gibbs, Gaussian NB, gradient boosting/XGBoost/stacking, k-medoids, gain ratio/MDL, interpretability", "Not in the AML consolidated PDF"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Same topic, different examples",
          text: "Even where the theory is shared, **the worked examples differ**: AML's k-means uses points A–E and 2, 3, 4, …, 30; ML's uses glucose and weight. AML's AdaBoost, decision-tree and Naïve-Bayes tables are not ML's. In an open-book exam, questions usually mirror the course's **own** examples, so practise from the AML page and use the 📄 **Find It in the PDF** page to jump to the right page.",
        },
      ],
    },
    {
      id: "aml-only",
      heading: "3. AML-only checklist (tick these off)",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "S2: Euclidean / Manhattan / Minkowski / cosine / correlation by hand; RMSE vs MAE; star plots and Chernoff faces",
            "S3: grid vs random search; learning curves; MLOps levels 0, 1, 2 and CI/CD stages",
            "S6: full-Bayes meningitis queries (0.33 and the 0 / 1.0 fragmentation case)",
            "S7: XOR with an SVM (feature map, support vectors, hyperplane)",
            "S10: combining rules (voting, averaging)",
            "S11 / S14: single, complete and average linkage with dendrograms",
            "S12: perceptron rule, delta rule, backpropagation",
            "S13: convolution by hand, output size ⌊(n + 2p − f)/s⌋ + 1, parameter counts, max / average pooling, RNN sequence types",
            "S14: DBSCAN with ε and MinPts; Hopkins H; BCubed; silhouette",
            "S15: Simpson's paradox; demographic parity, equal opportunity, equalized odds from a table",
          ],
        },
      ],
    },
  ],
};
