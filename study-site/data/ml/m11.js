// ML (DSEZG565) — Module 11: ML model evaluation & comparison, and an introduction to FAccT ML (fairness, interpretability)
// Source: CourseFiles/ML/Machine Learning_Watermarked_ppts_Nov2026.pdf, pages 729–749 (Session 15).
// All "slides" references on this page are PAGE NUMBERS of that consolidated PDF (the open-book exam copy).

export default {
  title: "Model Evaluation & FAccT ML",
  source: "Consolidated PDF (Nov 2026) · pages 729–749 · Session 15",
  quizMode: "step",
  overview:
    "The last module asks two questions. **Is the model good, and better than another one?** That means evaluation on unseen data, the standard metrics (covered in earlier modules; this page links back to them) and statistical comparison of models. **Is the model acceptable to society?** That is the **FAccT** agenda: **fairness, accountability, transparency** (plus privacy and security), with real failures such as the COMPAS risk score and Amazon's hiring tool, why “fairness through unawareness” fails, and why **interpretability** matters and trades off against performance. **Page numbers on this page refer to your consolidated exam PDF.**",

  summary: [
    {
      id: "eval",
      heading: "Lesson 1: Evaluating and comparing models",
      slides: "730–734",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "A student who memorised last year's paper can score 100% on it and still fail this year's exam. A model must be judged on data it has **never seen**. That's the whole point of evaluation."},
        {
          type: "p",
          text: "**Model guide (page 731):** the scikit-learn algorithm cheat-sheet: start from the data size and whether you are predicting a category (labelled → **classification**, unlabelled → **clustering**), a quantity (**regression**) or just looking at structure (**dimensionality reduction**), and follow the arrows to a suggested estimator.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Model evaluation (pages 732–733)",
          text: "*Model evaluation checks how well a trained model performs on data it has not seen before.*\n- **Training** data: the model learns patterns.\n- **Validation** data: compare and tune hyperparameter settings.\n- **Test** data: final evaluation of the chosen model on separate, unseen data.\nA common split is **70 / 15 / 15** (an example, not a rule). Doing very well on training data but badly on new data = **overfitting**.\n**Methods:** holdout, cross-validation (**k-fold**, **leave-one-out**), **bootstrap sampling**.",
        },
        {
          type: "table",
          caption: "Metrics (page 733; full treatment in earlier modules)",
          head: ["Task", "Metric", "Formula", "Where taught"],
          rows: [
            ["Classification", "Accuracy", "correct / total", "M4 (confusion matrix)"],
            ["Classification", "Precision", "TP / (TP + FP)", "M4"],
            ["Classification", "Recall", "TP / (TP + FN)", "M4"],
            ["Classification", "F1-score", "2PR / (P + R)", "M4"],
            ["Classification", "ROC / AUC", "TPR vs FPR over thresholds", "M4"],
            ["Regression", "MSE, RMSE, R², MAPE, MAD", "error-based", "M3"],
            ["Model selection", "Cross-validation", "k-fold, LOOCV", "M6 (CS 9)"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Comparing models (page 734)",
          text: "*If one hypothesis beats another on a sample of data, how probable is it that it is more accurate in general?* Use **statistical tests**, in two steps:\n1. Estimate the **confidence interval** of each model's accuracy.\n2. Test the **statistical significance** of the observed difference.\nA difference that lies inside the noise of the test set is not evidence that one model is better.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Train to learn, validate to tune, test once to report. A better score is only “better” if it is statistically significant.**"},
      ],
    },
    {
      id: "facct",
      heading: "Lesson 2: Emerging requirements: FAccT",
      slides: "735–739",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "An accurate model can still be **unfair** (treats groups differently), **unaccountable** (no one owns its failures), **opaque** (no one can explain it), **leaky** (exposes private data) or **fragile** (fooled by poisoned data). FAccT is the checklist for all of that."},
        {
          type: "table",
          caption: "Emerging requirements (page 735)",
          head: ["Requirement", "Key question"],
          rows: [
            ["**Fairness**", "How do we ensure gender and ethnic fairness in ML models?"],
            ["**Accountability**", "Who takes responsibility when an ML model fails?"],
            ["**Transparency**", "How do we make models transparent and compliant with regulations?"],
            ["**Privacy**", "How do we protect user privacy when exposing data to models?"],
            ["**Security**", "How do we defend models against **data poisoning**?"],
          ],
        },
        {
          type: "p",
          text: "**FAccT overview (page 736):** fairness, accountability, transparency, privacy and robustness sit at the meeting point of **machine learning, statistics, theory, psychology, social science and public policy**.",
        },
        {
          type: "table",
          caption: "Real-world failures (pages 737–739)",
          head: ["Case", "What happened"],
          rows: [
            ["**Amazon hiring tool**", "Reportedly **penalised résumés containing the word “women's”**"],
            ["**HP webcams**", "Face tracking reportedly couldn't see Black users"],
            ["**New Zealand passport robot**", "Rejected an Asian man's photo, claiming his **eyes were closed**"],
            ["**COMPAS** (Dressel et al., 2018)", "Commercial risk-assessment software used on **over 1 million offenders since 2000**; predicts risk of a misdemeanour or felony from **137 features**: an example of **algorithmic bias**"],
            ["**Word embeddings** (Garg et al., 2018)", "Gender bias in occupations tracks historical data (“women bias” highest for nurse, housekeeper, librarian; lowest for carpenter, mechanic, engineer): **negative legacy** of historical data"],
          ],
        },
      ],
    },
    {
      id: "fairness",
      heading: "Lesson 3: Fairness, and why “unawareness” isn't enough",
      slides: "740–742",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Fairness (page 740)",
          text: "**Fairness:** *the absence of bias towards an individual or a group* (Mehrabi et al., 2019).\n**Can ML models discriminate if machines just follow instructions?** Yes: models **approximate patterns in the data**, and they can **learn and even amplify** the biases in that data.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Fairness through unawareness (page 741)",
          text: "A model achieves **fairness through unawareness** if **none of the sensitive features** (e.g. race and ethnicity) are used directly. The hiring example drops race/ethnicity and trains only on skills and years of experience.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Why it fails (page 742)",
          text: "Sensitive features can still be **inferred from indirect evidence (proxies)**. In the slide, a feature like “often goes to Mexican markets” stands in for ethnicity, so the model can still make **discriminatory** hiring decisions even though race was never an input. Removing the column does not remove the information.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Deleting the sensitive column ≠ fairness: proxies smuggle it back in.** Fairness must be measured and tested, not assumed."},
      ],
    },
    {
      id: "interp",
      heading: "Lesson 4: Interpretability",
      slides: "743–749",
      blocks: [
        {
          type: "table",
          caption: "Who benefits from interpretability? (page 743)",
          head: ["Stakeholder", "Benefit"],
          rows: [
            ["**End users**", "Trust; understanding the consequences of decisions (privacy, fairness)"],
            ["**Regulatory agencies**", "Compliance, audits, accountability"],
            ["**Model designers**", "Diagnose model performance"],
          ],
        },
        {
          type: "p",
          text: "Society now relies on AI for autonomous vehicles, security, finance and more, so we need to examine **the basis of a model's decisions** (page 744).",
        },
        {
          type: "table",
          caption: "Interpretable models (pages 744–747)",
          head: ["Model", "Why it is interpretable", "Slide example"],
          rows: [
            ["**Decision tree**", "Each prediction is a readable path of if–then tests; splits carve the feature space into rectangles", "Contact-lens tree: tear production rate → astigmatism → age / spectacle prescription → soft, hard or none"],
            ["**Linear regression**", "Each coefficient $\\beta_j$ is the change in y per unit of $x_j$: **interpretable components**", "“Grumpiness” falls as hours of sleep rise"],
            ["**k-nearest neighbours**", "The prediction is explained by the **neighbours** that voted", "k = 3 vs k = 5 can flip the class of the query point"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Interpretability vs performance (pages 748–749)",
          text: "**High-performing models tend to be less interpretable.** Roughly from most accurate / least interpretable to least accurate / most interpretable (Arrieta et al., 2019): **deep learning → ensembles → SVM → Bayesian models / generalised additive models → k-NN → decision trees → linear/logistic regression → rule-based learning**. Research directions: hybrid modelling, explainability-preserving models, interpretable feature engineering, **post-hoc explainability** techniques and interpretability-driven designs. MNIST digit recognition is the example where powerful, complex models dominate.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Accuracy and interpretability pull in opposite directions; trees and linear models explain themselves, deep nets and ensembles need post-hoc explanations.**"},
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "M11 on one screen",
      head: ["Idea", "Key point"],
      rows: [
        ["Evaluation", "Train / validate / test (e.g. 70/15/15); holdout, k-fold, LOOCV, bootstrap"],
        ["Metrics", "Accuracy, precision, recall, F1 (classification); MSE, MAPE, MAD (regression)"],
        ["Comparing models", "Confidence interval of accuracy → test significance of the difference"],
        ["FAccT", "Fairness, accountability, transparency, privacy, security/robustness"],
        ["Failures", "COMPAS (137 features, > 1 M offenders), Amazon hiring, HP webcams, NZ passport robot, embedding bias"],
        ["Fairness", "Absence of bias towards an individual or group; unawareness fails because of proxies"],
        ["Interpretability", "Helps users, regulators, designers; trees, linear models, k-NN are interpretable; accuracy–interpretability trade-off"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Define each FAccT term with one concrete example · explain the proxy problem with the hiring example · name the three interpretability stakeholders · state the accuracy–interpretability trade-off with model families in order.",
    },
  ],

  glossary: [
    ["Holdout method", "—", "Single split into train and test sets"],
    ["Cross-validation", "k-fold / LOOCV", "Rotate which part of the data is held out"],
    ["Bootstrap sampling", "—", "Evaluate with resamples drawn with replacement"],
    ["Overfitting", "—", "Good on training data, poor on unseen data"],
    ["Confidence interval", "—", "Range likely to contain a model's true accuracy"],
    ["Statistical significance", "—", "Whether an observed difference is unlikely to be due to chance"],
    ["FAccT", "Fairness, Accountability and Transparency", "Responsible-ML research agenda (with privacy, robustness)"],
    ["Algorithmic bias", "—", "Systematic unfair outcomes produced by a model"],
    ["COMPAS", "Correctional Offender Management Profiling for Alternative Sanctions", "Commercial recidivism risk-score tool"],
    ["Data poisoning", "—", "Corrupting training data to manipulate a model"],
    ["Fairness through unawareness", "—", "Not using sensitive features directly"],
    ["Proxy feature", "—", "A feature that reveals a sensitive attribute indirectly"],
    ["Interpretability", "Explainability", "Ability to understand the basis of a model's decisions"],
    ["Post-hoc explainability", "—", "Explaining a trained black-box model afterwards"],
    ["XAI", "Explainable AI", "Research on making AI decisions understandable"],
  ],

  examTips: [
    "For “how would you evaluate…” questions, describe the split (train/validation/test), the method (k-fold), the metric that fits the problem (precision vs recall) and a significance test for comparisons.",
    "Fairness answers score well with the definition (Mehrabi), one real case (COMPAS or Amazon) and the proxy problem.",
    "Interpretability answers: stakeholders → interpretable models with examples → the trade-off figure.",
  ],

  problems: [
    {
      title: "Metrics from a confusion matrix",
      level: "Level 1",
      question: "A classifier gives TP = 40, FP = 10, FN = 20, TN = 30. Compute accuracy, precision, recall and F1.",
      solution: "Accuracy = (40 + 30)/100 = **0.70**. Precision = 40/50 = **0.80**. Recall = 40/60 = **0.667**. F1 = 2(0.8)(0.667)/(0.8 + 0.667) = **0.727**. (Metrics from page 733.) Exercise solution prepared for the website.",
    },
    {
      title: "Data split",
      level: "Level 1",
      question: "You have 20,000 labelled examples. Using the 70/15/15 split from page 732, how many go to training, validation and test, and what is each set used for?",
      solution: "Training **14,000** (learn parameters), validation **3,000** (tune hyperparameters, compare settings), test **3,000** (final, one-time evaluation on unseen data). Exercise solution prepared for the website.",
    },
    {
      title: "Is model A really better?",
      level: "Level 3",
      question: "Model A scores 86% and model B 84% accuracy on the same 500-example test set. Describe how to decide whether A is genuinely better (page 734), and estimate a 95% confidence interval for A's accuracy.",
      solution: "### Step 1: confidence interval\nStandard error ≈ √(0.86 × 0.14/500) = 0.0155 → 95% CI ≈ 0.86 ± 1.96 × 0.0155 = **0.86 ± 0.030** (0.83–0.89). B's 0.84 lies inside it.\n### Step 2: significance test\nTest the difference (e.g. a paired test on the same test examples, or compare via k-fold cross-validation). A 2-point gap on 500 examples is within the noise, so we **cannot** conclude A is better without more evidence. Exercise solution prepared for the website.",
    },
  ],

  theory: [
    {
      title: "Model evaluation and comparison",
      level: "Level 2",
      question: "Explain the steps of model evaluation, the main evaluation methods and metrics, and how to compare two models statistically.",
      solution: "Evaluation checks performance on **unseen** data (page 732): train on training data, tune hyperparameters on validation data, evaluate the final model once on test data (e.g. 70/15/15); strong training but weak test performance signals **overfitting**. Methods (page 733): holdout, k-fold and leave-one-out cross-validation, bootstrap sampling. Metrics: accuracy, precision, recall, F1 for classification; MSE, MAPE, MAD for regression. To compare models (page 734): estimate the **confidence interval** of each accuracy and test the **statistical significance** of the observed difference, because a better score on one sample may not generalise.",
    },
    {
      title: "FAccT and fairness through unawareness",
      level: "Level 2",
      question: "What are the emerging FAccT requirements for ML? Define fairness and explain why fairness through unawareness is insufficient, with an example.",
      solution: "Requirements (page 735): **fairness** (gender/ethnic fairness), **accountability** (who is responsible for failures), **transparency** (explainable, regulation-compliant models), **privacy** (protecting user data) and **security** (defending against data poisoning). Fairness = *absence of bias towards an individual or group* (page 740); models learn and can amplify biases in data (COMPAS, Amazon's hiring tool). **Fairness through unawareness** (page 741) removes sensitive attributes such as race from the inputs, but **proxies** can still encode them: in the hiring example a feature like shopping at Mexican markets lets the model infer ethnicity and discriminate anyway (page 742). Fairness must be measured on outcomes across groups.",
    },
    {
      title: "Interpretability",
      level: "Level 2",
      question: "Why is ML interpretability needed, which models are interpretable, and what is the interpretability–performance trade-off?",
      solution: "Society relies on AI for driving, security and finance (page 743). Interpretability helps **end users** (trust, understanding consequences), **regulators** (compliance, audits, accountability) and **model designers** (diagnosing performance). Interpretable models: **decision trees** (readable if–then paths, e.g. the contact-lens tree), **linear regression** (coefficients as interpretable components), **k-NN** (the neighbours explain the vote) (pages 744–747). **Trade-off** (pages 748–749): high-performing models (deep learning, ensembles, SVM) tend to be less interpretable than k-NN, trees, linear/logistic regression and rule-based models; research seeks hybrid and explainability-preserving models and **post-hoc explanations**.",
    },
  ],

  quiz: [
    { topic: "Evaluation", q: "Hyperparameters should be tuned on…", options: ["the training set", "the validation set", "the test set", "all data"], answer: 1, why: "Page 732.", wrong: ["Training data learns parameters.", null, "The test set is for the final report only.", "That leaks test information."] },
    { topic: "Evaluation", type: "num", q: "TP = 40, FN = 20. Recall? (3 decimals)", answer: 0.667, tol: 0.002, why: "40/60." },
    { topic: "Evaluation", q: "Comparing two models statistically involves…", options: ["only comparing training accuracy", "confidence intervals and a significance test", "choosing the larger model", "removing the test set"], answer: 1, why: "Page 734." },
    { topic: "FAccT", q: "Defending a model against data poisoning falls under…", options: ["fairness", "security", "transparency", "accountability"], answer: 1, why: "Page 735." },
    { topic: "FAccT", type: "num", q: "How many features does the COMPAS tool use (per the slides)?", answer: 137, tol: 0, why: "Page 738." },
    { topic: "Fairness", q: "Fairness through unawareness fails mainly because…", options: ["models can't read sensitive features", "sensitive attributes can be inferred from proxy features", "it needs more data", "it lowers accuracy"], answer: 1, why: "Page 742." },
    { topic: "Fairness", q: "Fairness (Mehrabi et al.) is defined as…", options: ["equal accuracy for all models", "absence of bias towards an individual or a group", "using no features", "a high AUC"], answer: 1, why: "Page 740." },
    { topic: "Interpretability", q: "Which stakeholder uses interpretability mainly for compliance and audits?", options: ["End users", "Regulatory agencies", "Model designers", "Data engineers"], answer: 1, why: "Page 743." },
    { topic: "Interpretability", q: "Which model family is typically the LEAST interpretable?", options: ["Linear regression", "Decision trees", "Deep learning", "Rule-based learning"], answer: 2, why: "Pages 748–749." },
  ],
};
