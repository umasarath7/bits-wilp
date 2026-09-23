// AML — Contact Session 1: Introduction to Machine Learning
// Source: CourseFiles/AML/ContactSession1-Introduction.pptx (51 slides)
// Text supports **bold**, `code` and KaTeX math ($inline$, $$display$$).

export default {
  title: "Introduction to Machine Learning",
  source: "ContactSession1-Introduction.pptx · 51 slides",
  overview:
    "What ML is (the $\\langle T, P, E \\rangle$ definition), when to use it, the main application types, the ways to categorise learning (supervision, how data is fed in, how the model generalises), and the main challenges: bad data, overfitting/underfitting, validation and hyperparameters.",

  summary: [
    {
      id: "course",
      heading: "Course logistics",
      slides: "2",
      blocks: [
        {
          type: "table",
          head: ["Component", "Weight"],
          rows: [["Mid-semester exam", "30%"], ["Assignments", "30%"], ["Comprehensive exam", "40%"]],
        },
      ],
    },
    {
      id: "what",
      heading: "1. What is Machine Learning?",
      slides: "3–5",
      blocks: [
        { type: "p", text: "The slides give three definitions, from the most informal to the most precise:" },
        {
          type: "list",
          items: [
            "**Informal:** the science (and art) of programming computers so they can *learn from data*.",
            "**General (Arthur Samuel):** the field of study that gives computers the ability to learn *without being explicitly programmed*.",
            "**Engineering (Tom Mitchell):** a program learns from experience **E** with respect to some task **T** and performance measure **P** if its performance on T, measured by P, improves with E. A well-defined learning task is the triple $\\langle T, P, E \\rangle$.",
          ],
        },
        { type: "diagram", name: "tradVsMl" },
        {
          type: "p",
          text: "**The key shift:** in traditional programming *you* write the program (the rules). In ML the computer produces the program (the model) from **data + expected outputs**.",
        },
        {
          type: "table",
          caption: "Mitchell-style task definitions from the slides",
          head: ["Task T", "Performance P", "Experience E"],
          rows: [
            ["Playing checkers", "% of games won against an arbitrary opponent", "Practice games against itself"],
            ["Recognising handwritten words", "% of words correctly classified", "Database of human-labelled handwriting images"],
            ["Driving on 4-lane highways (vision)", "Avg distance before a human-judged error", "Images + steering commands recorded from a human driver"],
            ["Spam vs legitimate email", "% of emails correctly classified", "Emails, some with human-given labels"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Likely exam question",
          text: "“Define the learning task $\\langle T,P,E \\rangle$ for &lt;some scenario&gt;.” Make **P measurable** (a %, an error rate, a distance) and make **E the data source** the system actually learns from.",
        },
      ],
    },
    {
      id: "why",
      heading: "2. Why ML? (the spam filter story)",
      slides: "6–12",
      blocks: [
        {
          type: "table",
          head: ["", "Traditional approach", "ML approach"],
          rows: [
            ["How", "Hand-write rules for patterns (“4U”, “credit card”, “free”, “amazing”), then test and update", "Learn which words/phrases are unusually frequent in spam compared with ham"],
            ["Result", "Long list of complex rules that is hard to maintain", "Shorter program, easier to maintain, usually more accurate"],
            ["When spammers adapt", "Rewrite the rules by hand", "Retrain on new data"],
          ],
        },
        {
          type: "p",
          text: "**Handwritten digit example (slide 8):** it is very hard to write rules for what makes a “2”. Some “2”s look like “3”s or “7”s. This is exactly the kind of problem where you learn from examples instead of writing rules.",
        },
        { type: "p", text: "**When to use ML (slide 11):**" },
        {
          type: "list",
          items: [
            "Existing solutions need a lot of hand-tuning or long lists of rules",
            "Complex problems with no good traditional solution (the human reasoning can't be written down as rules)",
            "Changing environments, where the system must adapt to new data",
            "Getting insights from complex problems and large amounts of data (**data mining**: ML helps *humans* learn by revealing unexpected correlations and trends)",
          ],
        },
        {
          type: "p",
          text: "**Typical scenarios (slide 9):** recognising patterns (faces, speech, medical images), recognising anomalies (credit-card fraud, unusual sensor readings in a nuclear plant), prediction from time series (stock prices, exchange rates) and generating new patterns (images, motion).",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Where ML fits (slide 12)",
          text: "AI ⊃ Machine Learning ⊃ Deep Learning. ML overlaps with statistics, data mining, pattern recognition and optimisation.",
        },
      ],
    },
    {
      id: "apps",
      heading: "3. Applications of ML",
      slides: "13–24",
      blocks: [
        { type: "p", text: "**The two classes of application (slide 15):**" },
        {
          type: "list",
          ordered: true,
          items: [
            "**Assign or predict an object/event to an element of a set.** If the set is discrete (a finite set of categories/integers) it is **classification**. If the set is the real numbers it is **regression**.",
            "**Predict a sequence of steps to reach a goal:** planning, control and problem solving (chess, driving, flying, controlling robots and game characters).",
          ],
        },
        {
          type: "p",
          text: "**Classification examples:** medical diagnosis, fraud detection, network worm detection, spam filtering, recommendations, DNA sequences, spoken words, handwritten letters, astronomical images.",
        },
        {
          type: "p",
          text: "**Domains:** internet, computational biology, finance, e-commerce, space exploration, robotics, information extraction, social networks, software engineering, system management, creative arts.",
        },
        {
          type: "table",
          caption: "Deep learning in speech recognition (slide 20, Zeiler et al. 2013). GMM baseline WER = 15.4%",
          head: ["# Hidden layers", "1", "2", "4", "8", "10", "12"],
          rows: [["Word error rate %", "16.0", "12.8", "11.4", "**10.9**", "11.0", "11.1"]],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Read the table like an examiner",
          text: "1 hidden layer is *worse* than the GMM baseline. Depth helps up to 8 layers (best, 10.9%), then error rises slightly. Beyond some point, more model capacity stops helping; the same idea as overfitting in section 5.",
        },
        {
          type: "p",
          text: "**Other state-of-the-art examples:** visual question answering, autonomous cars (Stanley/Sebastian Thrun: laser terrain mapping, adaptive vision, learning from human drivers, path planning), OCR, tumour detection, news categorisation, offensive-comment flagging, summarisation, chatbots, customer segmentation, recommendation systems, revenue forecasting.",
        },
      ],
    },
    {
      id: "types",
      heading: "4. Types of Machine Learning",
      slides: "25–41",
      blocks: [
        { type: "p", text: "The slides classify ML along **three independent axes**. One system has a value on each axis." },
        {
          type: "table",
          caption: "Axis 1: level of supervision",
          head: ["Type", "Given", "Output / goal", "Examples"],
          rows: [
            ["**Supervised** (inductive)", "Inputs $x_i$ + desired outputs (labels) $y_i$", "Learn $f(x) \\approx y$", "Regression (y real), classification (y categorical)"],
            ["**Unsupervised**", "Inputs $x_i$ only", "Hidden structure", "Clustering, dimensionality reduction, association rules"],
            ["**Semi-supervised**", "Lots of unlabelled data + a few labels", "Use both", "Google Photos: cluster faces, then you name one person"],
            ["**Reinforcement**", "Rewards from a sequence of actions", "A **policy**: states → actions that maximises reward over time", "AlphaGo, robot in a maze, pole balancing"],
          ],
        },
        {
          type: "p",
          text: "**Supervised regression (slide 28):** given $(x_1,y_1),\\dots,(x_n,y_n)$, learn $f(x)$ with **y real-valued**, e.g. predict September Arctic sea-ice extent from the year.",
        },
        {
          type: "p",
          text: "**Supervised classification (slides 29–30):** y is **categorical**, e.g. tumour size → benign (0) or malignant (1). The learnt classifier can be as simple as a threshold: **if $x > T$ then malignant, else benign**.",
        },
        {
          type: "p",
          text: "**More features (slide 31):** $x$ can be multi-dimensional, one dimension per attribute (tumour size, age, clump thickness, uniformity of cell size/shape…). In 2-D the threshold becomes a boundary line; in higher dimensions it becomes a hyperplane.",
        },
        {
          type: "table",
          caption: "Algorithms you will meet",
          head: ["Supervised", "Unsupervised"],
          rows: [
            ["Linear Regression", "**Clustering:** k-Means, Hierarchical Cluster Analysis, Expectation Maximisation"],
            ["Logistic Regression", "**Visualisation / dim. reduction:** PCA, Kernel PCA, LLE, t-SNE"],
            ["Naïve Bayes", "**Association rule learning:** Apriori, Eclat"],
            ["SVMs, Decision Trees, Random Forests, Neural Nets", ""],
          ],
        },
        {
          type: "p",
          text: "**Data visualisation (slide 35):** project complex unlabelled data to 2-D/3-D while preserving structure (keep separate clusters from overlapping), to understand how the data is organised and spot unexpected patterns (e.g. t-SNE of CIFAR images: animals vs vehicles). **Unsupervised applications:** genomics (group people by genetic similarity), organising computing clusters, social network analysis, market segmentation, astronomical data analysis.",
        },
        {
          type: "table",
          caption: "Axis 2: how training data is used",
          head: ["Type", "Data per update", "Notes"],
          rows: [
            ["**Batch**", "All available data at once", "Retrain from scratch to include new data; costly in time and memory"],
            ["**Mini-batch**", "A subset at a time", "The practical middle ground"],
            ["**Online (incremental)**", "A single instance at a time", "Adapts to changing data; fits data that doesn't fit in memory"],
          ],
        },
        {
          type: "table",
          caption: "Axis 3: how the system generalises",
          head: ["Type", "Idea", "Example"],
          rows: [
            ["**Instance-based**", "Memorise examples; compare new points to known points with a similarity measure", "k-Nearest Neighbours"],
            ["**Model-based**", "Detect patterns and build a predictive model (learn parameters)", "Linear regression: $y = \\theta_0 + \\theta_1 x$"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common confusion",
          text: "Supervised/unsupervised is about **labels**. Batch/online is about **how data is fed during training**. Instance/model-based is about **how predictions are made**. The axes are independent. For example, a spam filter can be supervised + online + model-based.",
        },
      ],
    },
    {
      id: "challenges",
      heading: "5. Challenges of Machine Learning",
      slides: "42–51",
      blocks: [
        { type: "p", text: "There are two broad ways things go wrong: **bad data** and **bad model**." },
        {
          type: "table",
          caption: "Data problems",
          head: ["Problem", "What it means", "Remedy"],
          rows: [
            ["**Insufficient data**", "Even simple problems need thousands of examples. With enough data, very different algorithms perform similarly (“unreasonable effectiveness of data”)", "Weigh the trade-off: spend on algorithm development or on collecting data"],
            ["**Non-representative data**", "Small sample → **sampling noise**. Flawed sampling → **sampling bias**, *even with a large sample*. (Missing countries in the life-satisfaction data exaggerates the effect of wealth.)", "Training data must represent the new cases you want to generalise to"],
            ["**Poor quality**", "Missing features (e.g. 5% didn't give their age), errors, noise, outliers", "Drop the instances or the feature, fill in missing values, or train models with and without; fix or discard outliers. Cleaning is essential."],
            ["**Irrelevant features**", "Garbage in, garbage out", "**Feature engineering:** selection (choose useful ones), extraction (combine existing ones), gather new data"],
          ],
        },
        {
          type: "table",
          caption: "Model problems",
          head: ["", "Overfitting", "Underfitting"],
          rows: [
            ["Symptom", "Great on training data, poor on new data", "Poor even on training data"],
            ["Cause", "Model too complex for the amount/noise of data. It learns the **noise** (e.g. a high-degree polynomial life-satisfaction model)", "Model too simple for the underlying structure"],
            ["Fix", "**Regularisation** (constrain it, e.g. force a smaller slope), simplify the model, get more data, reduce noise", "More powerful model (more parameters), better features, **reduce** regularisation"],
          ],
        },
        { type: "p", text: "**Testing and validation (slides 49–50):**" },
        {
          type: "list",
          items: [
            "The goal is good performance on **unseen test data**, which the developer often doesn't have. The assumption is that training data represents test data.",
            "Hold out a random **20–30%** of the data as the **validation (dev) set**. A model that does well on validation is expected to do well on unseen data. Performance is *statistical/predictive*, not guaranteed.",
            "**K-fold cross-validation** reduces the bias from one lucky or unlucky split. Split into K parts, train on K−1, validate on the remaining one, repeat K times, and **average**. K = 10 is common.",
          ],
        },
        {
          type: "p",
          text: "**Hyperparameters (slide 51):** settings of the *learning algorithm* (not learnt from data, e.g. polynomial degree or regularisation strength). Each can take many values (real or categorical), so the number of combinations grows exponentially. The **best model is the one with the best cross-validation performance** over the combinations. This is expensive, so optimisation frameworks exist (grid/random search and others).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Parameter vs hyperparameter",
          text: "**Parameters** (e.g. $\\theta_0, \\theta_1$) are learnt *from data* during training. **Hyperparameters** (e.g. degree, $\\lambda$, K in k-NN) are set *before* training and tuned with validation.",
        },
      ],
    },
  ],

  keyTerms: [
    ["⟨T, P, E⟩", "Task, Performance measure, Experience: Mitchell's definition of a learning problem."],
    ["Classification", "Predict a label from a finite set of categories."],
    ["Regression", "Predict a real-valued quantity."],
    ["Policy (RL)", "A mapping from states to actions that maximises cumulative reward."],
    ["Online learning", "Update the model one instance at a time."],
    ["Instance-based", "Predict by comparing to stored examples (e.g. k-NN)."],
    ["Model-based", "Fit parameters of a model, then use the model to predict."],
    ["Sampling noise", "Unrepresentative data due to a small sample (chance)."],
    ["Sampling bias", "Unrepresentative data due to a flawed sampling method, even when the sample is large."],
    ["Feature engineering", "Feature selection + extraction + creating new features."],
    ["Overfitting", "Model fits the training noise; low train error, high validation error."],
    ["Underfitting", "Model too simple; high train and high validation error."],
    ["Regularisation", "Constraining a model to reduce overfitting."],
    ["Validation / dev set", "Held-out data (20–30%) used to evaluate and select models."],
    ["K-fold CV", "K train/validate rounds on rotating folds; average the scores."],
    ["Hyperparameter", "A setting of the learning algorithm, chosen before training."],
  ],

  examTips: [
    "Memorise the 4 slide examples of ⟨T,P,E⟩, then practise writing them for new scenarios.",
    "When asked “which type of learning”, state **all three axes** (supervision, batch/online, instance/model-based) and justify each in one line.",
    "Overfitting vs underfitting questions almost always come with a train/validation error table. Compare the **gap** (overfit) and the **level** (underfit).",
    "Sampling noise vs sampling bias: noise → small sample; bias → flawed method (a bigger sample doesn't fix it).",
    "K-fold arithmetic: K models, each trained on (K−1)/K of the data. With a hyperparameter grid, total fits = combos × K (+1 final refit).",
  ],

  problems: [
    {
      title: "Define ⟨T, P, E⟩ for new scenarios",
      level: "Easy",
      marks: 4,
      question:
        "Define the learning task $\\langle T, P, E \\rangle$ for: (a) a bank's loan-default predictor, (b) a movie recommender on a streaming platform. For each, also say whether it is classification or regression.",
      solution: `
**(a) Loan default**
- **T:** Predict whether a loan applicant will default (yes/no).
- **P:** % of applicants correctly classified (or recall on defaulters, since missing a defaulter is costly).
- **E:** Historical loan applications with their known repayment outcome.
- Output is a finite category → **classification** (supervised).

**(b) Movie recommender**
- **T:** Predict the rating (1–5) a user would give an unseen movie, and recommend the top ones.
- **P:** Mean absolute error between predicted and actual ratings, or % of recommended movies actually watched.
- **E:** Past ratings and watch history of users.
- Predicting a numeric rating → **regression**. Predicting “will watch / won't watch” → classification. Either is acceptable if justified.`,
    },
    {
      title: "Classify the learning system on all three axes",
      level: "Medium",
      marks: 6,
      question: `For each system, state: (i) supervised / unsupervised / semi-supervised / reinforcement, (ii) batch or online, (iii) instance-based or model-based. Justify briefly.

1. A spam filter that updates itself every time a user clicks “Mark as spam”, using a learnt weight per word.
2. A retailer that runs k-Means every quarter on all customer purchase data to find segments.
3. A robot vacuum that learns which cleaning routes finish fastest, getting a penalty for bumping into furniture.
4. A system that predicts house prices by averaging the prices of the 5 most similar houses sold.`,
      solution: `
| # | Supervision | Batch/Online | Instance/Model |
|---|---|---|---|
| 1 | **Supervised**: user clicks give labels | **Online**: one instance at a time | **Model-based**: learnt word weights |
| 2 | **Unsupervised**: no labels, clustering | **Batch**: all data each quarter | **Model-based**: learns cluster centroids (see note) |
| 3 | **Reinforcement**: rewards/penalties, learns a policy | **Online**: learns while acting | **Model-based** (learns a policy) |
| 4 | **Supervised**: past sale prices are labels | **Batch** (stored data) | **Instance-based**: 5-NN, compares to stored examples |

*Note for #2:* k-Means stores centroids, i.e. a compact model, rather than all instances. Examiners accept model-based if you justify it.`,
    },
    {
      title: "Threshold classifier for tumour size",
      level: "Medium",
      marks: 6,
      question: `Training data (tumour size in cm → label, B = benign, M = malignant):

| Size | 1.0 | 1.5 | 2.0 | 2.5 | 3.0 | 3.5 | 4.0 | 4.5 |
|---|---|---|---|---|---|---|---|---|
| Label | B | B | B | M | B | M | M | M |

The classifier is **“if $x > T$ predict M, else B”**.
(a) Using midpoints between consecutive sizes as candidates, find the $T$ that minimises training error.
(b) What is the best achievable training accuracy? Can any single threshold reach 100%? Why?
(c) If there is a tie, which $T$ would you choose for a medical application, and why?`,
      solution: `
**(a)** Candidate thresholds are the midpoints 1.25, 1.75, …, 4.25. Count the errors for the interesting ones:

| T | Predicted M | Errors | Error rate |
|---|---|---|---|
| 1.75 | 2.0 … 4.5 | 2.0(B), 3.0(B) → **2** | 25% |
| **2.25** | 2.5 … 4.5 | 3.0(B) → **1** | 12.5% |
| 2.75 | 3.0 … 4.5 | 2.5(M), 3.0(B) → **2** | 25% |
| **3.25** | 3.5 … 4.5 | 2.5(M) → **1** | 12.5% |
| 3.75 | 4.0, 4.5 | 2.5(M), 3.5(M) → **2** | 25% |

The minimum is **1 error**, at **T = 2.25** or **T = 3.25**.

**(b)** Best accuracy $= 7/8 = 87.5\\%$. 100% is impossible: a malignant 2.5 lies *below* a benign 3.0, so the data is **not linearly separable** on one feature. You would need more features (the “increasing feature dimension” idea on slide 31) or a more complex model.

**(c)** Choose **T = 2.25**. Its only error is a **false positive** (a benign tumour flagged malignant → extra tests). T = 3.25 makes a **false negative** (a cancer missed), which is far more costly. The performance measure P should reflect the cost of each type of error.`,
    },
    {
      title: "K-fold cross-validation arithmetic",
      level: "Easy",
      marks: 4,
      question:
        "A dataset has 1,200 labelled samples. (a) With 10-fold CV, how many models are trained, and how many samples go into training and validation in each round? (b) How many times is each sample used for training and for validation? (c) Repeat (a) for leave-one-out CV (K = n).",
      solution: `
**(a)** Fold size $= 1200/10 = 120$.
- Models trained: **10**
- Each round: **1,080** training, **120** validation

**(b)** Each sample is in exactly one fold, so it is used **1×** for validation and **9×** for training.

**(c)** Leave-one-out: $K = 1200$ → **1,200 models**, each trained on **1,199** samples and validated on **1**. This gives a nearly unbiased estimate but is very expensive.`,
    },
    {
      title: "Hyperparameter grid search cost",
      level: "Medium",
      marks: 5,
      question: `You tune a model with three hyperparameters:
- polynomial degree $\\in \\{1,2,3,4,5\\}$
- regularisation $\\lambda \\in \\{0, 0.01, 0.1, 1\\}$
- learning rate $\\in \\{0.001, 0.01, 0.1\\}$

using 5-fold CV. One training run on 80% of the data takes 3 minutes.
(a) How many hyperparameter combinations are there?
(b) How many training runs, including one final refit on the full data?
(c) Estimate the total time (assume the final refit on 100% of the data takes 25% longer).
(d) How does adding a 4th hyperparameter with 6 values change the cost? What does this illustrate?`,
      solution: `
**(a)** $5 \\times 4 \\times 3 = $ **60 combinations**

**(b)** $60 \\times 5 = 300$ CV runs, $+1$ final refit = **301 runs**

**(c)** $300 \\times 3 = 900$ min. Refit $= 3 \\times 1.25 = 3.75$ min.
Total $\\approx 903.75$ min $\\approx$ **15.1 hours**

**(d)** Combinations $= 60 \\times 6 = 360$, CV runs $= 1800$ → about **90 hours**, 6× the cost. This is the **exponential growth** of the hyperparameter space (slide 51). It is why people use random search or Bayesian optimisation frameworks instead of exhaustive grids.`,
    },
    {
      title: "Diagnose overfitting vs underfitting",
      level: "Medium",
      marks: 6,
      question: `Polynomial regression models of increasing degree were trained. Mean squared errors:

| Degree | 1 | 2 | 4 | 8 | 15 |
|---|---|---|---|---|---|
| Train MSE | 24.1 | 9.8 | 5.2 | 2.1 | 0.2 |
| Validation MSE | 25.3 | 10.6 | 5.9 | 9.4 | 41.7 |

(a) Which degree(s) underfit and which overfit? Justify.
(b) Which degree would you pick?
(c) Suggest two remedies for the degree-15 model, *without* changing the degree.`,
      solution: `
**(a)**
- **Degree 1, and arguably 2 → underfitting.** Train and validation errors are both *high* and *close* to each other: the model is too simple.
- **Degree 8, 15 → overfitting.** Train error keeps falling (0.2 at degree 15) but validation error rises sharply. The large **gap** (0.2 vs 41.7) shows the model is fitting noise.

**(b) Degree 4.** It has the lowest validation MSE (5.9) and a small train/validation gap (5.2 vs 5.9). Always select on **validation**, never on training error.

**(c)**
1. **Regularisation**, e.g. penalise large coefficients (ridge, $\\lambda \\sum \\theta_j^2$) to constrain the model.
2. **More training data**, so noise averages out and the high-degree curve can't chase individual points.
3. *(Also accepted)* Reduce noise in the data by cleaning outliers and fixing errors.`,
    },
    {
      title: "Instance-based vs model-based prediction",
      level: "Hard",
      marks: 8,
      question: `GDP per capita (in thousands of USD) and life satisfaction (0–10):

| Country | A | B | C | D | E |
|---|---|---|---|---|---|
| GDP $x$ | 10 | 20 | 30 | 40 | 50 |
| Life sat. $y$ | 5.0 | 5.6 | 6.1 | 6.6 | 7.3 |

Predict life satisfaction for a new country X with GDP = 33:
(a) using **3-nearest-neighbours** (instance-based),
(b) using a **least-squares linear model** $y = \\theta_0 + \\theta_1 x$ (model-based).
(c) Which approach needs the training data at prediction time?`,
      solution: `
**(a) 3-NN.** Distances from 33: C = 3, D = 7, B = 13, E = 17, A = 23.
The 3 nearest are **C, D, B**:
$$\\hat y = \\frac{6.1 + 6.6 + 5.6}{3} = \\frac{18.3}{3} = \\mathbf{6.10}$$

**(b) Linear model.**
$\\bar x = 30,\\quad \\bar y = 30.6/5 = 6.12$

| $x-\\bar x$ | $y-\\bar y$ | product | $(x-\\bar x)^2$ |
|---|---|---|---|
| −20 | −1.12 | 22.4 | 400 |
| −10 | −0.52 | 5.2 | 100 |
| 0 | −0.02 | 0 | 0 |
| 10 | 0.48 | 4.8 | 100 |
| 20 | 1.18 | 23.6 | 400 |
| | **Sum** | **56.0** | **1000** |

$$\\theta_1 = \\frac{56.0}{1000} = 0.056, \\qquad \\theta_0 = 6.12 - 0.056 \\times 30 = 4.44$$
$$\\hat y(33) = 4.44 + 0.056 \\times 33 = 4.44 + 1.848 = \\mathbf{6.29}$$

**(c)** **Instance-based (k-NN)** must keep all training data and search it at prediction time. The model-based approach only stores $\\theta_0, \\theta_1$, so the data can be discarded after training. *(You'll derive this regression formula properly in Session 4.)*`,
    },
    {
      title: "Batch vs mini-batch vs online: update counts",
      level: "Easy",
      marks: 4,
      question:
        "A training set has 60,000 images. You train for 10 epochs. How many parameter updates happen with (a) batch learning, (b) mini-batch learning with batch size 128, (c) online learning? (d) Which would you choose if the data arrives as a continuous stream and can't be stored?",
      solution: `
**(a) Batch:** 1 update per epoch → **10 updates**

**(b) Mini-batch (128):** $60000/128 = 468.75$ → 468 full batches + 1 partial batch of $60000 - 468\\times128 = 96$ images = **469 updates/epoch** → **4,690 updates**

**(c) Online:** 1 update per instance → $60000 \\times 10 =$ **600,000 updates**

**(d) Online (incremental) learning.** It learns from one instance at a time, adapts to changing data, and doesn't need the whole dataset in memory.`,
    },
    {
      title: "Reading the deep-learning speech results",
      level: "Medium",
      marks: 5,
      question: `From slide 20 (GMM baseline WER = 15.4%):

| Hidden layers | 1 | 2 | 4 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|
| WER % | 16.0 | 12.8 | 11.4 | 10.9 | 11.0 | 11.1 |

(a) Compute the absolute and relative WER reduction of the best network over the baseline.
(b) On a test set of 50,000 words, how many fewer word errors does the best network make?
(c) Why might 10 and 12 layers be slightly worse than 8?`,
      solution: `
**(a)** The best is 8 layers at 10.9%.
- Absolute: $15.4 - 10.9 = $ **4.5 percentage points**
- Relative: $4.5 / 15.4 = $ **29.2% reduction**

**(b)** Baseline errors $= 0.154 \\times 50000 = 7700$. Best $= 0.109 \\times 50000 = 5450$.
→ **2,250 fewer errors**

**(c)** Extra layers add parameters and capacity. With fixed training data, the deeper models start to **overfit** (and are harder to optimise), so validation/test error rises slightly. This is the model-selection trade-off from slide 48. Also note that **1 layer (16.0%) is worse than the baseline**, which is underfitting: too little capacity.`,
    },
    {
      title: "Data quality and splitting",
      level: "Medium",
      marks: 5,
      question: `A customer dataset has 40,000 rows. 6% of rows are missing *age*, and 1.5% of rows are exact duplicates (none of the duplicates are missing age).
(a) After removing duplicates, how many rows remain?
(b) If you then drop rows with missing age, how many remain? What fraction of the original data is lost?
(c) Split the remaining data 70/15/15 into train/validation/test.
(d) Give one alternative to dropping the rows, and one risk of dropping them.`,
      solution: `
**(a)** Duplicates $= 0.015 \\times 40000 = 600$ → **39,400 rows**

**(b)** Missing age $= 0.06 \\times 40000 = 2400$ (all among non-duplicates) → $39400 - 2400 = $ **37,000 rows**.
Lost $= 3000/40000 = $ **7.5%**

**(c)** Train $= 0.70 \\times 37000 = $ **25,900**, validation $=$ **5,550**, test $=$ **5,550**

**(d)**
- *Alternative:* impute age (median, or median per customer segment), or drop the *feature* if age isn't important, or train models both with and without it (slide 46).
- *Risk:* if missing-age customers differ systematically (e.g. younger users skip the field), dropping them introduces **sampling bias**, and the training data no longer represents new customers.`,
    },
    {
      title: "Sampling noise vs sampling bias",
      level: "Easy",
      marks: 3,
      question:
        "A political poll phones 2 million people from a list of magazine subscribers and car owners, and predicts the wrong winner. A second poll surveys only 50 random citizens and also gets it wrong. Which error is sampling bias and which is sampling noise? How would you fix each?",
      solution: `
- **Poll 1 → sampling bias.** The sampling *method* is flawed: subscribers and car owners were wealthier than average. A huge sample doesn't help. **Fix:** sample from a frame that represents the whole population (stratified random sampling).
- **Poll 2 → sampling noise.** The method is fair (random), but 50 people is too few, so the result swings by chance. **Fix:** increase the sample size.

*(Poll 1 is the classic 1936 Literary Digest poll example.)*`,
    },
    {
      title: "Features and polynomial model size",
      level: "Hard",
      marks: 5,
      question:
        "(a) How many parameters does a polynomial regression model of degree $d$ on a single feature have? (b) How many terms (including the bias) does a full degree-2 polynomial on 2 features have? List them. (c) In general, a full degree-$d$ polynomial on $n$ features has $\\binom{n+d}{d}$ terms. Compute this for $n = 3, d = 3$ and $n = 10, d = 3$. (d) You have 20 training points and one feature. What happens with a degree-19 polynomial?",
      solution: `
**(a)** $d + 1$ parameters: $\\theta_0, \\theta_1, \\ldots, \\theta_d$

**(b)** **6 terms:** $1,\\ x_1,\\ x_2,\\ x_1^2,\\ x_1x_2,\\ x_2^2$. Check: $\\binom{4}{2} = 6$ ✓

**(c)**
- $n=3, d=3$: $\\binom{6}{3} = $ **20**
- $n=10, d=3$: $\\binom{13}{3} = \\dfrac{13\\cdot12\\cdot11}{6} = $ **286**

The number of parameters explodes with more features, which raises the risk of overfitting.

**(d)** 20 parameters for 20 points: the curve can pass **exactly through every point**, so training error = 0. It will oscillate wildly between points and generalise very badly: **extreme overfitting**. You would need regularisation or a lower degree.`,
    },
  ],

  theory: [
    {
      title: "Key challenges in machine learning",
      pyq: "Midsem Q2(a): “List and briefly explain three key challenges faced in machine learning.”",
      marks: 2,
      question: "List and briefly explain **three** key challenges faced in machine learning.",
      solution: `
Any three, each with a one-line explanation and an example:

1. **Insufficient training data.** Most algorithms need thousands of examples. With too few, the model can't learn the real pattern. *Remedy:* collect more data, or use simpler models.
2. **Non-representative training data.** If the sample doesn't reflect the cases the model will see, it won't generalise. A small sample gives *sampling noise*; a flawed collection method gives *sampling bias*, even with a big sample.
3. **Poor-quality data.** Missing values, errors, noise and outliers hide the pattern. *Remedy:* data cleaning, imputation, removing or fixing outliers.
4. **Irrelevant features.** Garbage in, garbage out. *Remedy:* feature engineering (selection, extraction, new features).
5. **Overfitting.** The model is too complex and memorises noise: good on training data, poor on new data. *Remedy:* regularisation, more data, a simpler model.
6. **Underfitting.** The model is too simple to capture the structure. *Remedy:* a more powerful model, better features, less regularisation.

*Exam tip:* for 2 marks, name 3 challenges with one line each. Split them into data-side (1–4) and model-side (5–6) to show structure.`,
    },
    {
      title: "Frame a business problem as an ML problem",
      pyq: "Midsem Q2(c): churn prediction, i.e. state problem type, model and metric",
      marks: 2,
      question:
        "A company wants to predict whether a customer will **churn** (leave) in the next month. Frame this as a machine learning problem: state the problem type, an appropriate model choice, and a suitable performance metric, with justification.",
      solution: `
- **Problem type:** *supervised binary classification*. Historical customers come with a known label (churned: yes/no), and the output is one of two categories. It is usually *batch* (retrained monthly) and model-based.
- **Features (E):** tenure, monthly charges, number of complaints, usage trend, contract type, payment delays…
- **Model:** **logistic regression** as a baseline. It is simple, interpretable, and gives a churn *probability* you can rank customers by. Decision trees, random forests or SVMs are alternatives if it underfits.
- **Metric:** churn data is **imbalanced** (e.g. 5% churners), so accuracy is misleading: predicting "no churn" for everyone gives 95%. Use **recall** on churners (catch as many as possible for retention offers), balanced with **precision** (don't waste offers), so **F1-score** or ROC-AUC.

*Structure your answer as:* Type → Model → Metric, each with a "because…".`,
    },
    {
      title: "Define ML; traditional programming vs ML",
      marks: 3,
      question:
        "Define machine learning using Tom Mitchell's definition. Explain with a diagram or example how the ML approach differs from traditional programming, using spam filtering.",
      solution: `
**Definition:** a computer program is said to learn from experience **E** with respect to some task **T** and performance measure **P**, if its performance at T, as measured by P, improves with E.

**Spam filter:**
- T = classify emails as spam/ham, P = % correctly classified, E = emails labelled by users.

| | Traditional | ML |
|---|---|---|
| Input | Data + hand-written rules | Data + expected outputs (labels) |
| Output | Answers | The *program* (a model), which then produces answers |
| Spam | Rules like "contains *free*, *4U*": a long, brittle rule list | Learns which words are unusually frequent in spam |
| New spam tricks | Programmer rewrites rules | Retrain on new labelled data automatically |

Result: the ML program is shorter, easier to maintain and usually more accurate.`,
    },
    {
      title: "Supervised, unsupervised, semi-supervised and reinforcement learning",
      marks: 4,
      question:
        "Differentiate between supervised, unsupervised, semi-supervised and reinforcement learning. Give one real-world example and one algorithm for each.",
      solution: `
| Type | Training data | Goal | Example | Algorithm |
|---|---|---|---|---|
| **Supervised** | Inputs **with** labels | Learn $f(x)\\to y$ | House price prediction; spam detection | Linear/logistic regression, SVM, Naive Bayes |
| **Unsupervised** | Inputs **without** labels | Discover structure | Customer segmentation | k-Means, PCA, Apriori |
| **Semi-supervised** | Few labels + many unlabelled | Use structure to spread labels | Google Photos face tagging | Clustering + classifier |
| **Reinforcement** | No labels; **rewards** from actions | Learn a *policy* (state → action) maximising long-term reward | AlphaGo, robot navigation | Q-learning |`,
    },
    {
      title: "Batch vs online; instance vs model-based",
      marks: 3,
      question:
        "(a) Compare batch and online learning. When would you prefer online learning? (b) Compare instance-based and model-based learning with an example of each.",
      solution: `
**(a)**
- **Batch:** trains on *all* the data at once. To learn from new data it must retrain from scratch. This is simple but costly, and the model is offline between retrains.
- **Online (incremental):** learns from one instance (or a mini-batch) at a time, as data arrives.
- **Prefer online** when data arrives as a continuous stream (stock prices, sensor feeds), when the environment changes quickly, or when the data is too big to fit in memory (out-of-core learning). *Risk:* bad incoming data degrades the model, so it needs monitoring and an adjustable learning rate.

**(b)**
- **Instance-based:** memorise training examples; predict by similarity to stored examples. *Example:* k-NN. It must keep the data, and prediction is slower.
- **Model-based:** build a model from the data (learn parameters), then predict with the model. *Example:* linear regression $y = \\theta_0 + \\theta_1 x$. The data can be discarded, and prediction is fast.`,
    },
    {
      title: "Why use a validation set and cross-validation?",
      marks: 3,
      question:
        "Why can't we evaluate a model on its training data? Explain the hold-out validation set and k-fold cross-validation. What problem does k-fold solve?",
      solution: `
- **Training error is optimistic.** A complex model can memorise the training data (overfit) and still fail on new data. We need an estimate of performance on **unseen** data.
- **Hold-out validation:** randomly keep 20–30% of the data aside and train on the rest. Evaluate and compare models on the held-out part, and pick the best one. *Problem:* the estimate depends on **which** points were held out (a lucky or unlucky split), and less data is left for training.
- **k-fold CV:** split the data into k folds. For each fold, train on k−1 folds and validate on the remaining one. **Average** the k scores (k = 10 is common).
- **What it solves:** it reduces the variance/bias of the estimate caused by a single split, and uses every point for both training and validation. *Cost:* k times the training.
- The final **test set** is touched only once, at the end.`,
    },
  ],

  quiz: [
    {
      q: "In Mitchell's definition for a checkers program, “playing practice games against itself” is:",
      options: ["The task T", "The performance measure P", "The experience E", "The hypothesis"],
      answer: 2,
      why: "E is what the system learns from. T = playing checkers, P = % of games won.",
    },
    {
      q: "Predicting tomorrow's temperature (in °C) from today's weather readings is:",
      options: ["Classification", "Regression", "Clustering", "Reinforcement learning"],
      answer: 1,
      why: "The target is a real value, so it is regression (supervised).",
    },
    {
      q: "Google Photos clusters faces automatically, then asks you to name one person so it can label all their photos. This is:",
      options: ["Supervised", "Unsupervised", "Semi-supervised", "Reinforcement"],
      answer: 2,
      why: "Lots of unlabelled data (clustering) plus a few labels = semi-supervised (slide 38).",
    },
    {
      q: "A model has training accuracy 99% and validation accuracy 71%. The most appropriate first fix is:",
      options: ["Use a more complex model", "Reduce regularisation", "Increase regularisation / get more data", "Remove the validation set"],
      answer: 2,
      why: "A big train–validation gap means overfitting. Constrain the model (regularise) or add data.",
    },
    {
      q: "A survey of 5 million people drawn only from premium-card holders will most likely suffer from:",
      options: ["Sampling noise", "Sampling bias", "Underfitting", "Too few features"],
      answer: 1,
      why: "A flawed sampling method gives bias even with a huge sample. Noise comes from a sample that is too small.",
    },
    {
      q: "k-Nearest Neighbours is an example of:",
      options: ["Model-based learning", "Instance-based learning", "Reinforcement learning", "Association rule learning"],
      answer: 1,
      why: "It compares new points to stored training instances instead of learning parameters.",
    },
    {
      q: "Which of these is a hyperparameter, not a parameter?",
      options: ["The slope θ₁ of a linear model", "The intercept θ₀", "The regularisation strength λ", "The weight of the word “free” in a spam model"],
      answer: 2,
      why: "λ is set before training and tuned with validation. The others are learnt from data.",
    },
    {
      q: "Apriori and Eclat are algorithms for:",
      options: ["Clustering", "Dimensionality reduction", "Association rule learning", "Classification"],
      answer: 2,
      why: "Both are unsupervised association-rule learners (e.g. market-basket analysis).",
    },
    {
      q: "An RL agent learns a policy. A policy is:",
      options: ["A mapping from states to actions", "A reward function", "A labelled training set", "A loss function"],
      answer: 0,
      why: "Policy: states → actions, chosen to maximise reward over time (slide 39).",
    },
    {
      q: "Combining ‘car mileage’ and ‘car age’ into a single ‘wear-and-tear’ feature is:",
      options: ["Feature selection", "Feature extraction", "Regularisation", "Data cleaning"],
      answer: 1,
      why: "Extraction combines existing features into a more useful one. Selection picks a subset.",
    },
  ],
};
