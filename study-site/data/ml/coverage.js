// ML — Coverage checklist: what each module page covers, what was solved, and every slide issue found.

export default {
  title: "Coverage Checklist & Slide Checks",
  source: "Built from CourseFiles/ML (CS 1 – CS 10) · quality-assurance record",
  overview:
    "This page records **what the site covers against the slide decks**, so you can trust that nothing in the PDFs was skipped and nothing outside them was added. It also lists **every slide error or ambiguity** found while re-solving the examples (all numbers re-computed in Python). Where a slide answer is wrong, the module page shows the slide's value **and** the corrected one.",

  summary: [
    {
      id: "sources",
      heading: "1. Source files",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["File", "Pages", "Site page", "Status"],
          rows: [
            ["ML_CS 1_25th July&1August 2026.pdf", "61", "Module 1: Introduction", "✅ covered"],
            ["ML_CS 2_1-16thAug2026.pdf", "77", "Module 2: ML workflow (data, preprocessing)", "✅ covered"],
            ["ML_CS 3&4_9&29Aug2026.pdf", "118", "Module 3: Linear regression", "✅ covered"],
            ["ML_CS 5 & 6_29Aug&5thSep26.pdf", "69", "Module 4: Logistic regression & evaluation", "✅ covered"],
            ["ML_ CS 7&8_6th&12th Sep2026_mid-sem.pdf", "66", "Module 5 (identical to slides 1–65 of the next deck)", "✅ covered via the larger deck"],
            ["ML_ CS 7&8_12th Sep&3,10thoct2026.pdf", "123", "Module 5: Decision trees", "✅ covered"],
            ["ML CS 9_10&17thOct26.pdf", "85", "Module 6: Instance-based learning (+ classifier evaluation, CV)", "✅ covered"],
            ["ML_ CS 10_24th October 2026.pdf", "68", "Module 7: SVM", "✅ covered"],
            ["Modules M8–M11", "–", "Bayesian, ensemble, unsupervised learning, model comparison", "⏳ no slides in CourseFiles yet"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Gaps you should know about",
          text: "- **M8 Bayesian learning, M9 ensembles, M10 unsupervised learning and M11 model evaluation/comparison** have no slides in CourseFiles/ML yet. Add the PDFs and these pages will be built in the same format.\n- No previous ML question papers were provided, so the practice questions follow the slides' own “Problem type” lists.",
        },
      ],
    },
    {
      id: "checklist",
      heading: "2. Topic coverage checklist",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Module", "Topics (lessons)", "Slide examples / exercises solved", "Practice L1/L2/L3", "Figures"],
          rows: [
            ["M1", "Course plan; ⟨T,P,E⟩; traditional vs ML; when to use ML; supervised/unsupervised/RL/semi-supervised; batch/online; instance vs model; tools; workflow", "All T-P-E examples, slide examples 31–33, spam, car-price workflow", "2 / 2 / 1", "2"],
            ["M2", "Data & attributes; NOIR types; transformations; data types; quality; preprocessing; cleansing & imputation; IQR & 3σ; sampling; scaling; feature engineering; binning; encoding; inductive hypothesis", "Bank case study, IQR exercise, 3σ, min-max, z-score, lengths, stratified, app-feedback case", "1 / 2 / 1", "3"],
            ["M3", "Hypothesis; cost; OLS by hand; convexity; normal equation; GD (rule, convergence, α, scaling); variants; MSE/RMSE/R²; basis functions; bias–variance; ridge/lasso/elastic net; lab", "Tips, J(θ₁), f(x) min, closed form, tiny GD, RRCHD (linear, ridge, lasso), MSE example", "2 / 4 / 1", "6"],
            ["M4", "Generative vs discriminative; logistic model; boundaries; cross-entropy; GD; sentiment; odds; C; confusion matrix & metrics; skew; ROC/AUC; imbalance; OvA/OvO", "Sentiment, GD iteration, inference, accuracy paradox, skew tables, ROC (both), cancer matrix, practice exercise (λ = 10)", "2 / 2 / 0", "5"],
            ["M5", "Tree structure; Hunt; manual loan tree; entropy & gain; ID3 PlayTennis; problem types 1–10; Gini; continuous splits; classification error; gain ratio; overfitting; pre/post-pruning; MDL", "Every problem type 1–10, shapes practice, loan practice (discretisation, binary split, ID3, post-prune)", "1 / 1 / 0", "3"],
            ["M6", "Lazy vs eager; k-NN; dissimilarity; nominal, binary (Jaccard), Minkowski, ordinal, Gower; curse of dimensionality; choosing k; weighted k-NN; LWR; challenges; validation & CV", "Jaccard, basket, Minkowski matrices, Gower (both), Problem types 1–3, additional exercise", "2 / 2 / 1", "4"],
            ["M7", "Linear classifiers; max margin; support vectors; 2/‖w‖; primal; Lagrangian/dual; numerical examples; soft margin & C; non-linear mapping; kernel trick; kernels; multi-class; pros/cons", "Both α-solving examples, non-linear Φ₁ example, kernels 8/64/81, φ(2,3), OvA/OvO votes", "1 / 2 / 1", "4"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "What every module page contains",
          text: "📖 Notes (lessons with what you'll learn, formulas, simple and harder examples, common mistakes, quick revision, slide references) · ⚡ Recap · ✍️ Numerical (every slide problem + Level 1–3 practice, with hints; self-made solutions are marked “Exercise solution prepared for the website”) · 📝 Theory · ❓ Quiz (one at a time, MCQ + numeric) · 📚 Glossary.",
        },
      ],
    },
    {
      id: "issues",
      heading: "3. Slide errors and ambiguities found",
      slides: "",
      blocks: [
        {
          type: "search",
          placeholder: "Filter issues, e.g. M5, entropy, AUC…",
          head: ["Module · slide", "Issue on slide", "Correct / how handled"],
          rows: [
            ["M2 · 47", "“99% of observations lie within μ ± 3σ”", "99.7% (99% is μ ± 2.58σ); rule unchanged."],
            ["M2 · 45", "Q3 = 14.5 (median of upper half)", "Correct by that method; numpy's interpolation gives 14.25. State the method."],
            ["M2 · 56", "σ = 5.277 for the lengths", "Population SD = 5.280; z-scores −0.707, 1.414 unchanged."],
            ["M3 · 26", "Sum of absolute errors 15.3 / 12.4 / 15.7", "15.77 / 13.13 / 15.39; w = 0.25 still best."],
            ["M3 · 15", "θ₀ = −0.8188 (from rounded θ₁)", "Exact −0.8203; predictions agree to 2 d.p."],
            ["M3 · 113", "Elastic net: r = 1 → ridge", "True for the slide's formula; sklearn's l1_ratio = 1 means lasso."],
            ["M3 · 115–116", "Asks for 2 iterations; answer table shows 1; “ridge shrinks / lasso pushes toward zero faster”", "Iteration 2 diverges (α too large for unscaled features); both penalties pull the old negative weights up toward 0, lasso overshoots."],
            ["M4 · 30", "“Approx. new weights 0.4, −0.4, −0.6”", "Exact 0.350, −0.424, −0.613 (slides 33–34 agree)."],
            ["M4 · 31–32", "Error column y − h then h − y", "Use one convention and match the update's sign."],
            ["M4 · 47", "High-skew T1: precision 0.3, F 0.375", "Precision 0.333, F 0.400."],
            ["M4 · 54–56", "AUC 0.60 with tied 0.85 scores split", "Ties can't be split by a threshold; diagonal step gives 0.56."],
            ["M4 · 61", "λ = 10 with α = 0.8", "αλ = 8 → shrink factor −7; the run diverges (solution shows it and a λ = 0 comparison)."],
            ["M5 · 53–57", "E(3,1) = “0.4421 + 0.5 = 0.94”; Wind 0.94", "E(3,1) = 0.811; Wind = 0.811; root choice (Sky/AirTemp) unchanged."],
            ["M5 · 63", "New Rainy row predicted Yes (TP = 1)", "The Sky tree predicts No → FN = 1 (as on slide 62)."],
            ["M5 · 14 vs 68", "Tid 6 is Married (14, 121) but Single (68–72)", "Both versions noted; each slide answer is right for its own table."],
            ["M5 · 121", "Practice: test row (No, Single, 85K, No)", "Solved on the page; the full tree gets 1/4, root-only 2/4 (overfitting)."],
            ["M6 · 35", "“Equal weight” but distances summed, not averaged", "Ranking identical; Gower average = sum/4."],
            ["M6 · 56", "L2 weight sum 1.6", "1.594 (0.33 + 1.06 + 0.21 with more decimals); L1 still wins."],
            ["M6 · 74", "Manhattan distance for a query with only a size", "Rating of the query not given → distance on size only (flagged)."],
            ["M7 · 21", "w = (1, −1), b = 0 with + points (2,2), (4,4)", "Those points give wᵀx + b = 0: they lie on the boundary; use the slide only for the margin formula."],
            ["M7 · 31 vs 36", "α₁ = −3.5 vs α₁ = +3.5", "Different conventions (label absorbed vs explicit yᵢ); both give the correct w."],
          ],
        },
      ],
    },
  ],
};
