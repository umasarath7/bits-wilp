// AML — Contact Session 3: Model selection, evaluation, hyperparameter optimisation, MLOps
// Source: CourseFiles/AML/ContactSession3-EndToEndML2.pptx (46 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, then formulas with intuition.

export default {
  title: "Model Selection, Evaluation, Tuning & MLOps",
  source: "ContactSession3-EndToEndML2.pptx · 46 slides",
  overview:
    "In Session 2 we prepared the data. Now we train models and ask the hard questions. **Which model should we pick?** **How do we measure whether it's good**, especially when the thing we're looking for is rare? **How do we get an honest estimate** of its performance? **How do we tune its settings** without wasting days of computing? And once it works, **how do we keep it working in production**? Our running example is the bank's fraud detector from Session 1: it's trained, and now we have to judge it and ship it.",

  summary: [
    {
      id: "select",
      heading: "Lesson 1: Why try several models? Model selection and training",
      slides: "1–6",
      blocks: [
        {
          type: "p",
          text: "No single algorithm is best for every problem. The only reliable way to choose is to **try a few sensible candidates and compare them on data they haven't seen**. But first, the kind of data you have narrows down which candidates make sense (slide 3):",
        },
        {
          type: "list",
          items: [
            "If the training data comes **with the answer (label)**: a **real-valued** answer → a **regression** model; a **discrete** answer (binary or integer classes) → a **classification** model.",
            "If there are **no labels** → an **unsupervised** model (e.g. clustering).",
          ],
        },
        {
          type: "p",
          text: "**The housing story continues (slide 4).** The house-price problem has labels (actual median prices), so it's regression. You start simple with **linear regression**. Then you try a **decision tree regressor**, and something striking happens: its error on the *training* data is almost zero. Wonderful? No. Its **cross-validation** error (on held-out folds) is poor. That's Student A from Session 1, memorising the past papers: **overfitting**. Finally you try a **random forest regressor**, which builds many different decision trees and averages them. Averaging smooths out each tree's quirks, and the cross-validation accuracy improves.",
        },
        {
          type: "callout",
          kind: "idea",
          title: "The rule behind model selection",
          text: "**Never choose a model by its training error.** Training error always favours the most complex model. Choose by **cross-validation (or validation) error**, which estimates how the model will do on new data.",
        },
        {
          type: "p",
          text: "**A classification example: MNIST (slides 5–6).** MNIST is a famous dataset of **70,000 handwritten digits**. Each image is 28 × 28 pixels, and each pixel is a number from 0 (black) to 255 (white). Flatten each image into a row of $28 \\times 28 = 784$ numbers and the whole dataset becomes a **70,000 × 784 matrix**, one row per image, with each image labelled by the digit it shows.",
        },
        {
          type: "p",
          text: "The slides' recipe: split into **60,000 training** and **10,000 test** images, and **shuffle** the training set. Why shuffle? If the file happens to list all the 0s, then all the 1s, and so on, a cross-validation fold might contain no 7s at all, and some algorithms that learn one example at a time get confused by long runs of the same digit. Then start with a simpler problem: a binary **“5-detector”** whose target is 1 if the image is a 5 and 0 otherwise. Cross-validate several classifiers on it and keep the best.",
        },
      ],
    },
    {
      id: "multiclass",
      heading: "Lesson 2: What if there are more than two classes? One-vs-All and One-vs-One",
      slides: "7",
      blocks: [
        {
          type: "p",
          text: "The 5-detector answers a yes/no question. But reading a digit means choosing among **10** classes. Some algorithms, such as **random forests** and **Naïve Bayes**, handle many classes directly. Others, such as **Support Vector Machines (SVMs)** and plain linear classifiers, are **strictly binary**: they can only separate two groups. So how do we use a binary classifier for 10 classes? Break the big question into many yes/no questions. There are two ways.",
        },
        {
          type: "p",
          text: "**One-vs-All (OvA), also called One-vs-Rest.** Train one detector per class: a 0-detector (“is it a 0, or anything else?”), a 1-detector, and so on up to a 9-detector. That's **10 classifiers**. For a new image, ask all 10 and **pick the class whose detector gives the highest score**. It's like 10 specialists each shouting how confident they are; the most confident wins.",
        },
        {
          type: "p",
          text: "**One-vs-One (OvO).** Train one classifier for **every pair** of classes: 0 vs 1, 0 vs 2, …, 8 vs 9. For a new image, run all of them and **pick the class that wins the most duels**, like a round-robin tournament. With N classes there are $N(N-1)/2$ pairs, so for 10 digits that's **45 classifiers**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "How many classifiers?",
          text: "$$\\text{OvA} = N \\qquad\\qquad \\text{OvO} = \\frac{N(N-1)}{2}$$\n\nN = number of classes. For N = 10: OvA = 10, OvO = 45.",
        },
        {
          type: "p",
          text: "**Why would anyone train 45 classifiers instead of 10?** Because each OvO classifier only trains on the images of *its two* classes, about 12,000 images instead of all 60,000. Some algorithms (SVMs especially) get much slower as the training set grows, so **many small problems can be faster than a few big ones**. That's OvO's main advantage (slide 7).",
        },
      ],
    },
    {
      id: "confusion",
      heading: "Lesson 3: Why isn't accuracy enough? The confusion matrix",
      slides: "8–13",
      blocks: [
        {
          type: "p",
          text: "The obvious way to judge a classifier is **accuracy**: the fraction of predictions it gets right. But look at slide 12. Suppose there are **9,990 genuine** transactions and only **10 frauds**. A lazy model that says “genuine” for *everything* is right 9,990 times out of 10,000: **99.9% accuracy**. And it catches **zero frauds**. It's useless, yet its accuracy looks spectacular.",
        },
        {
          type: "p",
          text: "The problem is that accuracy lumps all mistakes together. But there are **two different kinds of mistake**, and they usually have very different costs. To see them separately, we lay out the results in a 2 × 2 table called the **confusion matrix** (slide 10). Rows are what *actually* happened; columns are what the model *predicted*.",
        },
        {
          type: "table",
          caption: "The confusion matrix (slide notation a, b, c, d)",
          head: ["", "Predicted: fraud (Yes)", "Predicted: genuine (No)"],
          rows: [
            ["**Actually fraud (Yes)**", "a = **TP**, True Positive: fraud, and we caught it ✓", "b = **FN**, False Negative: fraud, but we **missed** it ✗"],
            ["**Actually genuine (No)**", "c = **FP**, False Positive: genuine, but we **raised a false alarm** ✗", "d = **TN**, True Negative: genuine, and we let it through ✓"],
          ],
        },
        {
          type: "p",
          text: "**How to read the names.** The second word (Positive/Negative) is what the model **predicted**. The first word (True/False) says whether that prediction was **right**. So a “false negative” is a *negative prediction that was wrong*: the model said “genuine”, but it was fraud.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Accuracy",
          text: "$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN} = \\frac{a + d}{a + b + c + d}$$",
        },
        {
          type: "callout",
          kind: "example",
          title: "Our fraud model on 1,000 transactions",
          text: "There are 40 frauds. The model catches 30 of them and misses 10. It also wrongly flags 20 of the 960 genuine transactions.\n\n| | Predicted fraud | Predicted genuine |\n|---|---|---|\n| Actual fraud | TP = 30 | FN = 10 |\n| Actual genuine | FP = 20 | TN = 940 |\n\nAccuracy $= (30 + 940)/1000 = $ **0.97**. Sounds great. But a quarter of the frauds got away, and 20 innocent customers had their cards blocked. Accuracy hides both facts. Lesson 4 gives us numbers for each.",
        },
      ],
    },
    {
      id: "metrics",
      heading: "Lesson 4: How do we measure what matters? Precision, recall and F1",
      slides: "13",
      blocks: [
        {
          type: "p",
          text: "Different people care about different mistakes. The fraud investigations team asks: *“Of all the actual frauds, how many did you catch?”* The customer-service team asks: *“When you raise an alert, how often is it real? Every false alarm is an angry customer on the phone.”* Each question gets its own metric.",
        },
        {
          type: "p",
          text: "**Recall** answers the investigators. Look along the **actual-fraud row**: of all real frauds (TP + FN), what fraction did we catch (TP)? It's also called **sensitivity** or the **True Positive Rate (TPR)**.",
        },
        {
          type: "p",
          text: "**Precision** answers customer service. Look down the **predicted-fraud column**: of everything we flagged (TP + FP), what fraction was really fraud (TP)?",
        },
        {
          type: "p",
          text: "**F1-score** combines them into one number. It's the **harmonic mean** of precision and recall. Why not the ordinary average? Because the harmonic mean is dragged down by whichever is smaller. A model with precision 1.0 and recall 0.01 has an ordinary average of 0.5, but an F1 of about 0.02, which correctly says “this model is bad”.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The metrics you must know",
          text: "$$\\text{Precision} = \\frac{TP}{TP + FP} \\qquad \\text{Recall (TPR)} = \\frac{TP}{TP + FN}$$\n$$F_1 = \\frac{2 \\times \\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2TP}{2TP + FP + FN}$$\n$$\\text{FPR} = \\frac{FP}{FP + TN} \\qquad \\text{Specificity (TNR)} = \\frac{TN}{TN + FP} = 1 - \\text{FPR}$$\n\n**FPR** (False Positive Rate) = the fraction of genuine cases wrongly flagged. **Specificity** (True Negative Rate) = the fraction of genuine cases correctly let through.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Back to our fraud model (TP 30, FN 10, FP 20, TN 940)",
          text: "- **Recall** $= 30/(30+10) = $ **0.75**: we catch 75% of frauds.\n- **Precision** $= 30/(30+20) = $ **0.60**: 60% of our alerts are real; 40% are false alarms.\n- **F1** $= 2(30)/(60 + 20 + 10) = 60/90 = $ **0.667**\n- **FPR** $= 20/960 = $ **0.021**; **Specificity** $= 940/960 = $ **0.979**\n\nNow the picture is honest: accuracy said 97%, but we miss a quarter of the frauds and 4 in 10 alerts are false.",
        },
        {
          type: "p",
          text: "**Which should you optimise? (This was PYQ Q1c.)** Ask *which mistake is more expensive*.",
        },
        {
          type: "list",
          items: [
            "**Missing a positive is costly → maximise recall.** Cancer screening (a missed cancer can be fatal), fraud detection, predicting which customers will leave (churn).",
            "**A false alarm is costly → maximise precision.** A spam filter (sending your job offer to the spam folder is worse than letting one spam through), or any alert that triggers an expensive manual investigation.",
          ],
        },
        {
          type: "p",
          text: "You usually can't have both. Making the model more eager to say “fraud” catches more frauds (recall ↑) but also raises more false alarms (precision ↓). That trade-off is what the next lesson is about.",
        },
      ],
    },
    {
      id: "roc",
      heading: "Lesson 5: Why does the threshold matter? ROC curves and AUC",
      slides: "14–22",
      blocks: [
        {
          type: "p",
          text: "Most classifiers don't output a hard yes/no. They output a **score**, often a probability like “P(fraud) = 0.73”. We turn it into a decision with a **threshold**: flag the transaction if the score ≥ t. Choose t = 0.9 and you flag only the most suspicious cases (few false alarms, many misses). Choose t = 0.3 and you flag lots (few misses, many false alarms). **Every threshold gives a different confusion matrix.** So which threshold, and how do we compare two models fairly when each could use any threshold?",
        },
        {
          type: "p",
          text: "**The ROC curve (slides 17–19)** answers this by showing *every* threshold at once. ROC stands for **Receiver Operating Characteristic**; it was invented in the 1950s to analyse radar signals, where operators had to trade off catching real aircraft (hits) against reacting to noise (false alarms). For each threshold, compute two numbers and plot a point:",
        },
        {
          type: "list",
          items: [
            "**y-axis: TPR** (True Positive Rate, i.e. recall) $= TP/(TP + FN)$: how many real positives we catch.",
            "**x-axis: FPR** (False Positive Rate) $= FP/(FP + TN)$: how many negatives we wrongly flag.",
          ],
        },
        {
          type: "p",
          text: "Join the points and you get the curve. How to read the landmarks (slide 19):",
        },
        {
          type: "list",
          items: [
            "**(0, 0):** threshold so high that nothing is flagged. No false alarms, no catches.",
            "**(1, 1):** threshold so low that everything is flagged. Every fraud caught, every genuine customer blocked.",
            "**(0, 1), the top-left corner: the ideal classifier.** Catches every positive with zero false alarms. The closer a curve hugs this corner, the better.",
            "**The diagonal from (0, 0) to (1, 1): random guessing.** A coin flip catches positives and negatives at the same rate.",
            "**Below the diagonal:** worse than random; the model's predictions are backwards (flip them and it becomes good).",
          ],
        },
        {
          type: "p",
          text: "**AUC, the Area Under the ROC Curve (slide 20),** squeezes the whole curve into one number: **1 = ideal**, **0.5 = random guessing**. A nice interpretation: AUC is the probability that the model gives a randomly chosen positive a *higher* score than a randomly chosen negative.",
        },
        {
          type: "p",
          text: "**Comparing two models (slide 20).** If model M1's curve is above M2's everywhere, M1 is better at every threshold. But curves can **cross**: M1 might be better at low FPR and M2 at high FPR. Then no model is best overall; choose the one that's better **in the region you'll operate in**. A bank that can tolerate only 1% false alarms cares about the left end of the curve.",
        },
        {
          type: "p",
          text: "**How to build an ROC curve by hand (slides 21–22):**",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Get the classifier's score $P(+ \\mid x)$ for every test instance.",
            "Sort the instances by score, highest first.",
            "Use each unique score as a threshold: everything with a score ≥ it is predicted positive.",
            "At each threshold, count TP, FP, TN, FN and compute TPR and FPR.",
            "Plot the (FPR, TPR) points and join them. For AUC, add up the areas of the trapezoids under the curve.",
          ],
        },
        {
          type: "p",
          text: "The Numerical tab works through the slide-21 example (10 instances) in full, including the AUC.",
        },
      ],
    },
    {
      id: "estimate",
      heading: "Lesson 6: How do we get a reliable estimate of performance?",
      slides: "14–16",
      blocks: [
        {
          type: "p",
          text: "A metric is only as trustworthy as the data it's computed on. Slide 14 notes that measured performance depends on more than the algorithm: on the **class distribution** (how rare fraud is), the **cost of each kind of mistake**, and the **sizes of the training and test sets**. So how do we get a number we can rely on?",
        },
        {
          type: "p",
          text: "**Learning curves (slide 15).** Train on 100 examples, then 200, 400, 800…, and plot accuracy against training-set size. The curve usually rises and then levels off. It tells you whether **collecting more data would help** (still rising) or not (flat). The sizes can grow by a fixed step (**arithmetic sampling**) or by doubling (**geometric sampling**). With **small samples**, the estimate itself has **bias** (it's systematically off) and **variance** (it jumps around from sample to sample).",
        },
        {
          type: "p",
          text: "**Ways to estimate performance (slide 16).** All of them are about *which data to train on and which to test on*:",
        },
        {
          type: "table",
          head: ["Method", "How it works", "Good and bad"],
          rows: [
            ["**Holdout**", "Keep 2/3 for training, test on the other 1/3", "Simple and fast; but one split can be lucky or unlucky, and you train on less data"],
            ["**Random subsampling**", "Repeat the holdout several times with different random splits; average", "Smoother estimate; some records may never get tested"],
            ["**k-fold cross-validation**", "Split into k parts; each part is the test set once while the other k−1 train; average the k scores", "Every record tested exactly once; costs k training runs"],
            ["**Leave-one-out (LOOCV)**", "k-fold with k = n: test on one record at a time", "Uses almost all data for training; very expensive (n runs)"],
            ["**Stratified sampling**", "Any of the above, but keep the **class proportions** the same in every split", "Essential for rare classes: every fold gets its share of frauds"],
            ["**Bootstrap**", "Draw n records **with replacement** to train; test on the records never drawn", "Great for small datasets"],
          ],
        },
        {
          type: "p",
          text: "**Why about 63.2% in a bootstrap?** Draw n times, with replacement, from n records. For any one record, the chance of missing it on one draw is $1 - \\frac1n$, so the chance of missing it on all n draws is $(1 - \\frac1n)^n$. As n grows, this approaches $e^{-1} \\approx 0.368$. So about **36.8%** of the records are never drawn (they become the test set) and about **63.2%** appear in the training sample, some of them several times.",
        },
      ],
    },
    {
      id: "hpo",
      heading: "Lesson 7: How do we tune hyperparameters without wasting days?",
      slides: "23–30",
      blocks: [
        {
          type: "p",
          text: "Recall from Session 1: **hyperparameters** are settings you choose *before* training, not learnt from data. Slide 24 lists examples: the **learning rate** and **how long to run** gradient descent, the **batch size** for mini-batch training, and the **regularisation constant**. Finding good values is called **hyperparameter optimisation**, also *metaparameter optimisation* or simply *tuning*. The question is how to search efficiently.",
        },
        {
          type: "p",
          text: "**1. Tuning by hand (slide 26).** Fiddle with values until the results look good. Honestly, the most common method. The results are usually decent, but it takes a lot of effort and offers no guarantees.",
        },
        {
          type: "p",
          text: "**2. Grid search (slide 27).** Choose a few values for each hyperparameter, try **every combination**, and keep the best. It's thorough brute force. The catch: the cost **multiplies** with each hyperparameter. 5 learning rates × 4 batch sizes × 5 regularisation values = 100 runs; add a fourth hyperparameter with 5 values and it's 500. This exponential growth is the **curse of dimensionality** again. Also, choosing a good grid can be almost as hard as the tuning itself.",
        },
        {
          type: "p",
          text: "**3. Making grid search faster (slide 28).**",
        },
        {
          type: "list",
          items: [
            "**Early stopping (successive halving):** train every setting for just 1 epoch, throw away the worse half, train the survivors for another epoch, halve again, and so on. Most bad settings are eliminated cheaply. The risk: a setting that starts slowly but would have finished best (e.g. a small learning rate) might be thrown out early.",
            "**Parallelism:** each setting is independent, so run them on different machines at the same time. This is called **embarrassingly parallel**. It saves waiting time, but **not energy or money**: the total computing is the same.",
          ],
        },
        {
          type: "p",
          text: "**4. Random search (slide 29).** Instead of a grid, try **randomly chosen** points (scikit-learn's `RandomizedSearchCV`). Why is this often better? Suppose only one of two hyperparameters really matters. A 3 × 3 grid spends 9 runs but tries only **3 distinct values** of the important one. Nine random points try **9 distinct values** of it. Random search doesn't need exponentially more points as dimensions grow, which is how it beats the curse of dimensionality. The downside: with a finite number of samples, it isn't guaranteed to land near the best setting.",
        },
        {
          type: "p",
          text: "**5. How each setting is judged: cross-validation (slide 30).** Whatever search you use, you score each setting on **validation data not used for training**, usually with several rounds of cross-validation. This gives a reliable picture of how good each setting is, at a significant computational cost.",
        },
      ],
    },
    {
      id: "mlops",
      heading: "Lesson 8: Why isn't a trained model the finish line? MLOps",
      slides: "31–38",
      blocks: [
        {
          type: "p",
          text: "Your fraud model scores well in a notebook. Now it has to check millions of live transactions a day, keep working as fraudsters change tactics, and be updated without breaking anything. Slide 32 puts it bluntly: training a good model is the easy part. **The real challenge is building an integrated ML system and continuously operating it in production.** Slide 33 shows that the **ML code is a small fraction** of a real ML system; the rest is data collection, data checks, feature extraction, serving infrastructure, monitoring and more.",
        },
        {
          type: "p",
          text: "**What is MLOps?** It's an engineering culture and practice that **unifies ML development (Dev) and ML operation (Ops)**, with **automation and monitoring at every step**: integration, testing, release, deployment and infrastructure management. It's DevOps applied to ML.",
        },
        {
          type: "p",
          text: "**First, what does DevOps give ordinary software? (slide 34).** Shorter development cycles, faster deployment and dependable releases, through two practices: **Continuous Integration (CI)**, where every code change is automatically built and tested, and **Continuous Delivery (CD)**, where tested changes are automatically released.",
        },
        {
          type: "p",
          text: "**Why ML needs more than DevOps (slides 34–35):**",
        },
        {
          type: "table",
          head: ["Aspect", "What's different for ML"],
          rows: [
            ["**Team skills**", "Data scientists focus on exploring data, building models and experimenting, not on production engineering"],
            ["**Development**", "ML is experimental. The challenge is tracking what worked and what didn't, keeping results reproducible, and reusing code"],
            ["**Testing**", "Beyond code tests, you must **validate the data**, evaluate the trained model's quality, and validate the model"],
            ["**Deployment**", "You don't deploy one program; you deploy a **multi-step pipeline** that retrains and redeploys the model automatically"],
            ["**Production**", "Models **decay** as real-world data drifts (new fraud tactics). You must track data statistics and live performance, and alert or roll back"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "CI, CD and CT in ML (slide 35)",
          text: "- **CI (Continuous Integration)** is not only about testing code; it also **tests and validates data, data schemas and models**.\n- **CD (Continuous Delivery)** is not about shipping one package; it delivers **an ML training pipeline that automatically deploys another service**, the model prediction service.\n- **CT (Continuous Training)** is **new and unique to ML**: automatically **retraining** the model in production and serving the new one.",
        },
        {
          type: "p",
          text: "**The manual starting point (slide 36, “level 0”).** Many teams begin with a manual, script-driven, interactive process: a data scientist trains a model in a notebook and hands a file to engineers, who deploy it as a prediction service (e.g. a microservice with a REST API, a web interface other programs call). Problems: ML and operations are disconnected, which can cause **training-serving skew** (the data is processed differently in training and in production); releases are infrequent; and there's no CI, no CD and no performance monitoring.",
        },
        {
          type: "p",
          text: "**Frameworks (slide 38):** cloud vendors provide MLOps tooling: Kubeflow and Cloud Build (Google), AWS MLOps (Amazon), Azure MLOps (Microsoft).",
        },
      ],
    },
    {
      id: "validation",
      heading: "Lesson 9: What can go wrong in production? Data and model validation",
      slides: "37, 40–45",
      blocks: [
        {
          type: "p",
          text: "An automated pipeline retrains the model on new data by itself. That's powerful, and dangerous: if bad data flows in, it will happily train a bad model and ship it. So the pipeline needs two gatekeepers (slide 37).",
        },
        {
          type: "p",
          text: "**Gate 1: data validation, before training.** Check the incoming data and decide whether to retrain or stop:",
        },
        {
          type: "list",
          items: [
            "**Data value skew:** the data still has the right shape, but its **statistics have changed significantly**. For example, the average transaction amount jumps during a festival season, or a new payment method appears. The world has changed, so **trigger retraining**.",
            "**Data schema skew:** the data **doesn't match the expected format**: unexpected features, unexpected values, or expected features missing (an upstream team renamed a column). Training on this would be garbage in, garbage out, so **stop the pipeline** and fix it.",
          ],
        },
        {
          type: "p",
          text: "**Gate 2: model validation, after retraining and before production.** The offline checks:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Compute evaluation metrics for the new model on test data.",
            "Compare them with the **current production model**, a baseline model, or business requirements. Only promote it if it's better.",
            "Check performance is **consistent across data segments**, e.g. not great on metro customers but terrible on rural ones.",
            "Test that it can be deployed: **infrastructure compatibility** and **API consistency**.",
          ],
        },
        {
          type: "p",
          text: "Then **online validation**: release it to a small slice of real traffic first. A **canary deployment** sends, say, 5% of transactions to the new model and watches for problems (like a canary in a coal mine). **A/B testing** runs the old and new models side by side on different users and compares results.",
        },
        {
          type: "p",
          text: "**Levels of automation (slides 40–43):**",
        },
        {
          type: "list",
          items: [
            "**Level 1:** automate the ML pipeline so it does **continuous training (CT)** and continuously delivers the prediction service. Add automated data and model validation, **pipeline triggers** (retrain on a schedule or when new data arrives) and **metadata management** (recording what was trained on what).",
            "**Level 2: full CI/CD pipeline automation.** Six stages: (1) **development and experimentation**, which produces pipeline source code; (2) **pipeline CI**, which builds and tests it into packages; (3) **pipeline CD**, which deploys those to the target environment; (4) **automated training**, run in production on a schedule or trigger, pushing a trained model to the model registry; (5) **model CD**, serving the model as a prediction service; (6) **monitoring**, collecting live statistics that can trigger the pipeline again.",
          ],
        },
        {
          type: "p",
          text: "**What CI tests look like in ML (slide 44):** unit-test the feature-engineering logic (e.g. a function that one-hot encodes a categorical column); unit-test the model's methods; test that **training converges**; test for **NaN values** (Not a Number, e.g. from dividing by zero or very large or small values); test that every pipeline component produces the expected artifacts; and test the integration between components.",
        },
        {
          type: "p",
          text: "**What CD checks look like (slide 45):** the model is compatible with the target infrastructure (packages installed, enough memory, compute and accelerators); call the prediction service's API to test it; measure **throughput and latency**; validate the data; confirm the model meets its performance targets. Deployment is staged: **automated** to a test environment on new code, **semi-automated** to pre-production when code is merged, and **manual** to production.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in six lines",
          text: "1. Choose models by **cross-validation** error, never training error (decision tree overfits → random forest).\n2. Binary-only algorithms handle N classes with **OvA (N classifiers)** or **OvO (N(N−1)/2)**.\n3. Accuracy hides the two kinds of mistake. Use the confusion matrix: **precision** = TP/(TP+FP), **recall** = TP/(TP+FN), F1 = harmonic mean.\n4. Missing positives costly → recall; false alarms costly → precision. The **ROC curve** (TPR vs FPR over all thresholds) and **AUC** (1 ideal, 0.5 random) compare models across thresholds.\n5. Estimate performance with holdout, k-fold, LOOCV, stratified or bootstrap (≈63.2% unique). Tune hyperparameters by hand, grid, successive halving, or random search, scored by CV.\n6. **MLOps** = DevOps for ML: CI tests data and models too, CD ships a pipeline, **CT** retrains automatically; validate data (value vs schema skew) and models (offline, then canary/A-B).",
        },
      ],
    },
  ],

  glossary: [
    ["Model selection", "—", "Choosing among candidate models by their validation/CV performance"],
    ["Random forest", "—", "Many decision trees trained differently, with their predictions averaged"],
    ["MNIST", "Modified National Institute of Standards and Technology dataset", "70,000 labelled 28×28 images of handwritten digits"],
    ["OvA / OvR", "One-vs-All / One-vs-Rest", "One binary classifier per class; pick the highest score"],
    ["OvO", "One-vs-One", "One binary classifier per pair of classes; majority vote"],
    ["SVM", "Support Vector Machine", "A binary classifier that finds the widest separating margin (Session 7)"],
    ["TP / TN", "True Positive / True Negative", "Correctly predicted positive / negative"],
    ["FP", "False Positive", "Predicted positive, actually negative: a false alarm"],
    ["FN", "False Negative", "Predicted negative, actually positive: a miss"],
    ["Accuracy", "—", "(TP + TN) / all; misleading when classes are imbalanced"],
    ["Precision", "—", "TP / (TP + FP): of everything flagged, how much was right"],
    ["Recall / TPR", "True Positive Rate, sensitivity", "TP / (TP + FN): of all real positives, how many were caught"],
    ["F1-score", "—", "Harmonic mean of precision and recall"],
    ["FPR", "False Positive Rate", "FP / (FP + TN): fraction of negatives wrongly flagged"],
    ["Specificity / TNR", "True Negative Rate", "TN / (TN + FP) = 1 − FPR"],
    ["Threshold", "—", "The score above which we predict positive"],
    ["ROC", "Receiver Operating Characteristic", "Curve of TPR vs FPR over all thresholds"],
    ["AUC", "Area Under the (ROC) Curve", "1 = perfect, 0.5 = random guessing"],
    ["Learning curve", "—", "Performance vs training-set size"],
    ["Holdout", "—", "Train on 2/3, test on 1/3"],
    ["LOOCV", "Leave-One-Out Cross-Validation", "k-fold with k = n"],
    ["Bootstrap", "—", "Sampling with replacement; ≈63.2% unique records, rest used for testing"],
    ["HPO", "Hyperparameter optimisation", "Finding good hyperparameter values (tuning)"],
    ["Grid search", "—", "Try every combination on a grid of values"],
    ["Successive halving", "Early stopping for grid search", "Train all for 1 epoch, drop the worse half, repeat"],
    ["Random search", "RandomizedSearchCV in scikit-learn", "Try randomly chosen combinations"],
    ["Epoch", "—", "One full pass through the training data"],
    ["MLOps", "Machine Learning Operations", "DevOps practices applied to ML systems"],
    ["DevOps", "Development + Operations", "Culture and tools for building, testing and releasing software rapidly and reliably"],
    ["CI", "Continuous Integration", "Automatically build and test every change (in ML: also data, schemas, models)"],
    ["CD", "Continuous Delivery", "Automatically release tested changes (in ML: a pipeline that deploys the prediction service)"],
    ["CT", "Continuous Training", "Automatically retrain and serve the model in production (unique to ML)"],
    ["REST API", "Representational State Transfer Application Programming Interface", "A standard web interface other programs call to get predictions"],
    ["Training-serving skew", "—", "Data processed differently in training and in production"],
    ["Data value skew", "—", "Incoming data's statistics changed → retrain"],
    ["Data schema skew", "—", "Incoming data doesn't match the expected format → stop and fix"],
    ["Canary deployment", "—", "Send a small share of live traffic to the new model first"],
    ["A/B testing", "—", "Run old and new models on different users and compare"],
    ["NaN", "Not a Number", "An invalid numeric result, e.g. from dividing by zero"],
  ],

  examTips: [
    "Confusion-matrix metrics are **guaranteed marks** (PYQ Q1b). Draw the matrix, write the four formulas, substitute, keep 3–4 decimals.",
    "Always add one line of **interpretation**: “recall 0.91 means the model catches 91% of the fraud cases”.",
    "“Which analyst / user is happier?” → decide which mistake each person hates (miss = FN → recall; false alarm = FP → precision) and compare those two numbers.",
    "OvO count is $N(N-1)/2$: for 10 classes the answer is **45**, a favourite number.",
    "ROC questions: state the axes (TPR vs FPR), the ideal point (0, 1), and that the diagonal means random guessing (AUC 0.5).",
    "MLOps theory keywords: **CI (code + data + model tests), CD (pipeline deploys prediction service), CT (auto-retrain), value vs schema skew, model validation, canary/A-B, monitoring**.",
  ],

  problems: [
    {
      title: "Confusion-matrix metrics and business choice",
      pyq: "Midsem Q1(b)+(c): accuracy, precision, recall, F1, then analyst A vs B",
      level: "Medium",
      marks: 4,
      hint: "Recall looks along the *actual spam* row; precision looks down the *predicted spam* column. Then ask what each user hates: spam in the inbox is a *miss* (FN); a real email in the spam folder is a *false alarm* (FP).",
      question: `A spam classifier evaluated on 500 emails:

| | Predicted Spam | Predicted Ham |
|---|---|---|
| Actual Spam | 90 (TP) | 10 (FN) |
| Actual Ham | 30 (FP) | 370 (TN) |

(a) Compute accuracy, precision, recall, F1, FPR and specificity.
(b) User X hates finding spam in the inbox. User Y can't afford to lose a genuine email to the spam folder. Who is happier with this classifier? Justify with the metrics.`,
      solution: `
### What is being asked
Compute the standard metrics from a confusion matrix (Lesson 4), then link each user's complaint to the right metric.

### Why this approach
Each metric answers a different question. The business part is about **which mistake** each user cares about:
- spam reaching the inbox = a spam email predicted as ham = **FN** → measured by **recall**
- a real email lost to the spam folder = ham predicted as spam = **FP** → measured by **precision** (and FPR)

### Formulas
$$\\text{Acc} = \\frac{TP+TN}{N}, \\quad P = \\frac{TP}{TP+FP}, \\quad R = \\frac{TP}{TP+FN}, \\quad F_1 = \\frac{2TP}{2TP+FP+FN}, \\quad \\text{FPR} = \\frac{FP}{FP+TN}$$

### Working
**(a)**
- Accuracy $= (90 + 370)/500 = 460/500 = 0.92$
- Precision $= 90/(90 + 30) = 90/120 = 0.75$
- Recall $= 90/(90 + 10) = 90/100 = 0.90$
- F1 $= 2(90)/(180 + 30 + 10) = 180/220 = 0.818$
- FPR $= 30/(30 + 370) = 30/400 = 0.075$
- Specificity $= 370/400 = 0.925$

**(b)**
- **User X** hates spam in the inbox (misses) → **recall = 0.90**. Only 10 of 100 spam emails get through. X is fairly happy.
- **User Y** hates losing real mail (false alarms) → **precision = 0.75**. One in four emails in the spam folder is genuine; 30 real emails were lost. Y is **less satisfied**.

### Answer
Accuracy **0.92**, precision **0.75**, recall **0.90**, F1 **0.818**, FPR **0.075**, specificity **0.925**. **User X is happier**, because recall (0.90) is higher than precision (0.75).

### Takeaway
To please Y, **raise** the threshold: fewer emails get flagged, so precision goes up and recall goes down. You trade one user's happiness for the other's.`,
    },
    {
      title: "The accuracy paradox on imbalanced data",
      level: "Medium",
      marks: 4,
      hint: "For model A, count how many positive predictions it makes. For model B, use the four formulas directly. Then compare recall, not accuracy.",
      question:
        "A test set has 9,990 negatives and 10 positives (slide 12). (a) Model A predicts everything negative. Compute its accuracy, recall and precision. (b) Model B gives TP = 8, FN = 2, FP = 40, TN = 9950. Compute accuracy, precision, recall and F1. (c) Which model is better and why?",
      solution: `
### What is being asked
Show, with numbers, why accuracy misleads on imbalanced data (Lesson 3).

### Why this approach
When one class is 99.9% of the data, a model can score high accuracy by ignoring the rare class completely. Recall and precision expose that.

### Working
**(a) Model A** (TP = 0, FN = 10, FP = 0, TN = 9990)
- Accuracy $= 9990/10000 = 99.9\\%$
- Recall $= 0/10 = 0$
- Precision $= 0/0$: undefined, because it never predicts positive

**(b) Model B**
- Accuracy $= (8 + 9950)/10000 = 9958/10000 = 99.58\\%$
- Precision $= 8/(8 + 40) = 8/48 = 0.167$
- Recall $= 8/(8 + 2) = 0.80$
- F1 $= 2(8)/(16 + 40 + 2) = 16/58 = 0.276$

### Answer
| | Accuracy | Recall | Precision | F1 |
|---|---|---|---|---|
| A | **99.9%** | **0** | undefined | — |
| B | **99.58%** | **0.80** | **0.167** | **0.276** |

**Model B is better**, even though its accuracy is lower. It catches 80% of the rare positives; A catches none.

### Takeaway
On imbalanced data, report recall, precision, F1 or AUC. B's precision is low (many false alarms), which may still be acceptable for screening, where a follow-up check filters them out.`,
    },
    {
      title: "Build an ROC curve and compute AUC",
      level: "Hard",
      marks: 6,
      hint: "Count the positives (P) and negatives (N) first. Then lower the threshold one score at a time: each + you pass adds 1 to TP, each − adds 1 to FP. Instances with the same score enter together.",
      question: `A probabilistic classifier gives these scores (slide 21):

| Inst | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| P(+) | 0.95 | 0.93 | 0.87 | 0.85 | 0.85 | 0.85 | 0.76 | 0.53 | 0.43 | 0.25 |
| Class | + | + | − | − | − | + | − | + | − | + |

(a) For each threshold "predict + if $P \\ge t$", compute TP, FP, TPR and FPR.
(b) List the ROC points and compute the AUC with the trapezoidal rule.
(c) What does this AUC say about the classifier?`,
      solution: `
### What is being asked
Build the ROC curve by hand (Lesson 5) and measure the area under it.

### Why this approach
Each threshold gives one confusion matrix, hence one (FPR, TPR) point. The scores are already sorted, so as we lower the threshold, instances switch to “predicted +” one by one.

### Formulas
$$\\text{TPR} = \\frac{TP}{P}, \\qquad \\text{FPR} = \\frac{FP}{N}, \\qquad \\text{trapezoid area} = \\text{width} \\times \\frac{\\text{left height} + \\text{right height}}{2}$$

### Working
Positives: instances 1, 2, 6, 8, 10 → $P = 5$. Negatives: 3, 4, 5, 7, 9 → $N = 5$.

**(a)**

| Threshold $t \\ge$ | TP | FP | TPR | FPR |
|---|---|---|---|---|
| above 0.95 | 0 | 0 | 0 | 0 |
| 0.95 | 1 | 0 | 0.2 | 0 |
| 0.93 | 2 | 0 | 0.4 | 0 |
| 0.87 | 2 | 1 | 0.4 | 0.2 |
| 0.85 | 3 | 3 | 0.6 | 0.6 |
| 0.76 | 3 | 4 | 0.6 | 0.8 |
| 0.53 | 4 | 4 | 0.8 | 0.8 |
| 0.43 | 4 | 5 | 0.8 | 1.0 |
| 0.25 | 5 | 5 | 1.0 | 1.0 |

At 0.85, three instances enter together (4 −, 5 −, 6 +), so TP rises by 1 and FP by 2.

**(b)** ROC points (FPR, TPR): (0, 0), (0, 0.2), (0, 0.4), (0.2, 0.4), (0.6, 0.6), (0.8, 0.6), (0.8, 0.8), (1, 0.8), (1, 1).

Only segments that move right add area:
- FPR 0 → 0.2 at height 0.4: $0.2 \\times 0.4 = 0.08$
- FPR 0.2 → 0.6, height 0.4 → 0.6: $0.4 \\times 0.5 = 0.20$
- FPR 0.6 → 0.8 at height 0.6: $0.2 \\times 0.6 = 0.12$
- FPR 0.8 → 1.0 at height 0.8: $0.2 \\times 0.8 = 0.16$

AUC $= 0.08 + 0.20 + 0.12 + 0.16 = 0.56$

### Answer
**AUC = 0.56**: only slightly better than random guessing (0.5).

### Takeaway
The model ranks its two most confident positives well, then mixes the classes badly (three negatives near the top). The ROC curve shows exactly *where* a model's ranking breaks down.`,
    },
    {
      title: "OvA vs OvO classifier counts and data sizes",
      level: "Easy",
      marks: 3,
      hint: "OvA = K, OvO = K(K−1)/2. For data sizes: an OvA classifier sees every class; an OvO classifier sees only its two classes.",
      question:
        "(a) How many binary classifiers do OvA and OvO need for 3, 4, 10 and 26 classes? (b) MNIST has 60,000 training images, about 6,000 per digit. How many images does each OvA classifier and each OvO classifier train on? (c) Why can OvO be faster overall for SVMs even though it trains more classifiers?",
      solution: `
### What is being asked
The trade-off between the two multiclass strategies (Lesson 2).

### Formula
$$\\text{OvA} = K, \\qquad \\text{OvO} = \\frac{K(K-1)}{2}$$

### Working
**(a)**
| K | OvA | OvO |
|---|---|---|
| 3 | 3 | $3 \\cdot 2/2 = 3$ |
| 4 | 4 | $4 \\cdot 3/2 = 6$ |
| 10 | 10 | $10 \\cdot 9/2 = 45$ |
| 26 | 26 | $26 \\cdot 25/2 = 325$ |

**(b)** Each **OvA** classifier (“is it a 3 or not?”) trains on **all 60,000** images. Each **OvO** classifier (“3 or 8?”) trains only on those two digits: $2 \\times 6000 = $ **about 12,000** images.

**(c)** SVM training time grows faster than linearly with the number of samples (roughly $n^2$ or worse). So 45 small problems of 12,000 samples can be cheaper than 10 big problems of 60,000 samples.

### Takeaway
OvO trains more classifiers, but each is small. That pays off for algorithms that scale badly with data size.`,
    },
    {
      title: "Bootstrap sampling",
      level: "Medium",
      marks: 3,
      hint: "The chance of missing one particular record in a single draw is 1 − 1/n. The draws are independent, so raise it to the power n.",
      question:
        "You draw a bootstrap sample of size n = 1000 from 1000 records. (a) What is the probability that a given record is never chosen? (b) About how many unique records end up in the training sample, and how many are left for testing? (c) What happens to this fraction as n → ∞?",
      solution: `
### What is being asked
Where the famous “63.2%” comes from (Lesson 6).

### Why this approach
Sampling **with replacement** means each of the n draws is independent, and each record has probability $1/n$ of being picked in any one draw.

### Formula
$$P(\\text{never chosen}) = \\left(1 - \\frac1n\\right)^n \\;\\xrightarrow{\\,n \\to \\infty\\,}\\; e^{-1} \\approx 0.368$$

### Working
**(a)** $(1 - 1/1000)^{1000} = 0.999^{1000} = 0.3677$

**(b)**
- Never chosen: $1000 \\times 0.3677 \\approx 368$ records, which form the test (“out-of-bag”) set
- Unique records in the training sample: $1000 - 368 \\approx 632$

**(c)** The fraction never chosen tends to $e^{-1} = 0.368$, so the fraction appearing tends to $1 - 0.368 = $ **0.632**.

### Answer
(a) **0.3677** (b) about **632** unique for training, about **368** for testing (c) tends to **63.2%** unique.

### Takeaway
A bootstrap sample has the same size as the data but only about 63% of its distinct records; the rest are duplicates. That's the source of the “.632 bootstrap” estimator.`,
    },
    {
      title: "Cost of grid search with successive halving",
      level: "Medium",
      marks: 4,
      hint: "Plain: configurations × epochs. Halving: add up how many configurations survive each round (64, 32, 16, …).",
      question:
        "You have 64 hyperparameter configurations, and each epoch of training costs 1 unit. (a) Plain grid search trains each configuration for 7 epochs. What is the total cost? (b) With early stopping (slide 28), you train all configurations for 1 epoch, discard the worse half, and repeat until one remains. What is the total cost? (c) What is the speed-up, and what is the risk?",
      solution: `
### What is being asked
How much the early-stopping trick from slide 28 saves (Lesson 7).

### Why this approach
In successive halving, each round costs one epoch per **surviving** configuration, and the number of survivors halves every round.

### Working
**(a)** $64 \\times 7 = 448$ units

**(b)** Survivors per round: 64 → 32 → 16 → 8 → 4 → 2 → 1 (7 rounds)
Cost $= 64 + 32 + 16 + 8 + 4 + 2 + 1 = 127$ units

**(c)** Speed-up $= 448/127 \\approx 3.5\\times$

### Answer
(a) **448** units (b) **127** units (c) about **3.5× faster**.

### Takeaway
**Risk:** a configuration that learns slowly at first but would have ended best (e.g. a small learning rate) can be discarded in an early round.`,
    },
    {
      title: "Random search: how many trials?",
      level: "Medium",
      marks: 3,
      hint: "Each random trial misses the good region with probability 0.95. The chance that *all* n trials miss is 0.95ⁿ.",
      question:
        "Suppose the “good” region of hyperparameter space is the top 5% of configurations. (a) With random search of 60 trials, what is the probability that at least one trial lands in the good region? (b) How many trials are needed for a 95% chance? (c) Why does random search beat grid search when only a few hyperparameters matter?",
      solution: `
### What is being asked
Why a modest number of random trials is usually enough (Lesson 7).

### Why this approach
“At least one hit” is easiest to compute as $1 - P(\\text{all miss})$.

### Formula
$$P(\\text{at least one hit in } n) = 1 - 0.95^n$$

### Working
**(a)** $1 - 0.95^{60} = 1 - 0.046 = 0.954$

**(b)** Need $1 - 0.95^n \\ge 0.95$, i.e. $0.95^n \\le 0.05$. Take logs: $n \\ge \\frac{\\ln 0.05}{\\ln 0.95} = \\frac{-2.996}{-0.0513} = 58.4$, so **59 trials**.

**(c)** A 3 × 3 grid spends 9 runs but tries only **3 distinct values** of each hyperparameter. Nine random trials try **9 distinct values** of each. If only one hyperparameter really matters, random search explores it three times as finely for the same cost, and the number of trials doesn't need to grow exponentially with the number of hyperparameters.

### Answer
(a) **0.954** (b) **59** trials

### Takeaway
About 60 random trials give a 95% chance of landing in the top 5%, **whatever the number of hyperparameters**.`,
    },
    {
      title: "Choosing a threshold from scores",
      level: "Hard",
      marks: 5,
      hint: "For each threshold, list the transactions flagged (score ≥ t). Count how many are really fraud (TP) and how many aren't (FP). FN = frauds below the threshold.",
      question: `Fraud scores for 8 transactions: (0.92, F), (0.81, F), (0.74, L), (0.66, F), (0.55, L), (0.41, L), (0.30, F), (0.12, L), where F = fraud (positive) and L = legit.
For thresholds $t = 0.7$ and $t = 0.35$ (predict fraud if score $\\ge t$), compute precision and recall. Which threshold should Analyst A (can't miss fraud) choose, and which should Analyst B (minimise false alarms)?`,
      solution: `
### What is being asked
See the precision–recall trade-off directly by moving the threshold (Lessons 4–5).

### Why this approach
Lowering the threshold flags more transactions: it catches more frauds (recall ↑) but also flags more legit ones (precision ↓).

### Working
4 frauds (0.92, 0.81, 0.66, 0.30) and 4 legit.

**t = 0.7:** flagged 0.92 (F), 0.81 (F), 0.74 (L)
- TP = 2, FP = 1, FN = 2 (0.66 and 0.30)
- Precision $= 2/3 = 0.667$; Recall $= 2/4 = 0.50$

**t = 0.35:** flagged 0.92, 0.81, 0.74, 0.66, 0.55, 0.41
- TP = 3 (0.92, 0.81, 0.66), FP = 3 (0.74, 0.55, 0.41), FN = 1 (0.30)
- Precision $= 3/6 = 0.50$; Recall $= 3/4 = 0.75$

### Answer
| t | Precision | Recall |
|---|---|---|
| 0.7 | **0.667** | **0.50** |
| 0.35 | **0.50** | **0.75** |

**Analyst A → t = 0.35** (higher recall, fewer missed frauds). **Analyst B → t = 0.7** (higher precision, fewer false alarms).

### Takeaway
The model didn't change; only the threshold did. That's why ROC and precision–recall curves, which show *all* thresholds, are the fair way to compare models.`,
    },
    {
      title: "Sizing the MNIST data matrix and split",
      level: "Easy",
      marks: 2,
      hint: "Features per image = 28 × 28. Memory = number of values × bytes per value (uint8 = 1 byte, float64 = 8 bytes).",
      question:
        "MNIST has 70,000 images of 28×28 pixels. (a) What are the dimensions of the data matrix, and how many values does it hold? (b) How much memory does it need as uint8 and as float64? (c) Give the train/test sizes used in the slides, and say why the training set is shuffled.",
      solution: `
### What is being asked
Turn images into a data matrix (Lesson 1) and estimate its size.

### Working
**(a)** Each image is flattened to $28 \\times 28 = 784$ numbers (one column per pixel). Matrix: **70,000 × 784**. Values: $70000 \\times 784 = 54{,}880{,}000$.

**(b)**
- uint8 (1 byte each): 54.88 MB ≈ 52.3 MiB
- float64 (8 bytes each): $54.88 \\times 8 = 439$ MB ≈ 418.7 MiB

**(c)** **60,000 train / 10,000 test.** Shuffling makes the cross-validation folds similar (no fold is missing some digits) and stops order-sensitive algorithms (e.g. stochastic gradient descent) from seeing long runs of the same digit.

### Answer
(a) **70,000 × 784**, **54.88 million** values (b) about **55 MB** as uint8, about **439 MB** as float64 (c) **60,000 / 10,000**, shuffled.

### Takeaway
Storing pixels as 1-byte integers instead of 8-byte floats saves 8× memory. That matters once datasets get large.`,
    },
  ],

  theory: [
    {
      title: "Why accuracy misleads, and what to use instead",
      marks: 3,
      question: "Explain with an example why accuracy is a poor metric for imbalanced datasets. Which metrics should be used instead?",
      solution: `
### What the examiner wants
A concrete numerical example of the paradox, then the alternative metrics, each with its formula and meaning.

### Model answer
- **The paradox:** with 9,990 negatives and 10 positives, a classifier that predicts “negative” for everything scores **99.9% accuracy** yet **detects no positives**. Accuracy is dominated by the majority class, and it treats misses and false alarms as equal.
- **Use instead:**
  - **Recall** $= TP/(TP + FN)$: how many real positives we catch.
  - **Precision** $= TP/(TP + FP)$: how trustworthy the positive alerts are.
  - **F1** $= 2PR/(P + R)$: balances the two.
  - **ROC-AUC**: ranking quality across all thresholds (0.5 = random, 1 = perfect).
  - **Cost-sensitive evaluation**: give each type of error its real-world cost.

### Takeaway
Pick the metric that matches the costly mistake: misses → recall; false alarms → precision.`,
    },
    {
      title: "ROC curve and AUC",
      marks: 4,
      question: "What is an ROC curve? How is it constructed? Interpret the points (0,0), (1,1), (0,1), the diagonal, and the AUC. How do you compare two models whose ROC curves cross?",
      solution: `
### What the examiner wants
Definition (axes), the construction steps, the meaning of each landmark, the AUC scale, and what to do when curves cross.

### Model answer
- **ROC** (Receiver Operating Characteristic) plots **TPR** (y-axis) against **FPR** (x-axis) as the decision threshold changes. It shows the trade-off between hits and false alarms.
- **Construction:** get $P(+|x)$ for every test instance → sort in decreasing order → use each unique value as a threshold → count TP, FP, TN, FN → plot (FPR, TPR).
- **(0, 0):** everything predicted negative. **(1, 1):** everything predicted positive. **(0, 1):** the perfect classifier. **Diagonal:** random guessing. **Below the diagonal:** worse than random (inverting the predictions would help).
- **AUC:** 1 = ideal, 0.5 = random. It equals the probability that a random positive is scored above a random negative.
- **Crossing curves:** neither model dominates (e.g. M1 better at low FPR, M2 at high FPR). Choose by the **FPR range the application can tolerate**; use AUC only as an overall summary.

### Takeaway
ROC compares models **independently of any single threshold**.`,
    },
    {
      title: "Methods for estimating performance",
      marks: 4,
      question: "Explain holdout, random subsampling, k-fold cross-validation, leave-one-out and bootstrap. Which would you use for a small dataset?",
      solution: `
### What the examiner wants
A one-line “how it works” plus a strength or weakness for each method, then a justified choice for small data.

### Model answer
- **Holdout:** reserve part of the data (e.g. 1/3) for testing and train on the rest. Simple, but depends on one split and trains on less data.
- **Random subsampling:** repeat the holdout several times and average. Less variance, but some records may never be tested.
- **k-fold CV:** k disjoint folds; each is the test set once while the rest train. Every record is tested exactly once; average the k scores.
- **Leave-one-out:** k = n. Nearly unbiased and uses maximum training data, but costs n training runs.
- **Bootstrap:** sample n records **with replacement** for training (≈63.2% unique); test on the ≈36.8% never drawn.
- **Stratified** versions keep the class proportions in every split.
- **For a small dataset:** stratified 10-fold CV, LOOCV or bootstrap. You can't afford to lock a third of scarce data away in a single holdout.

### Takeaway
All methods answer the same question, “how will this do on unseen data?”. They differ in how much data they use and how much computing they cost.`,
    },
    {
      title: "Grid search vs random search",
      marks: 3,
      question: "Compare tuning by hand, grid search and random search. How can grid search be made faster?",
      solution: `
### What the examiner wants
The three methods with pros and cons, and the two speed-ups from slide 28.

### Model answer
- **By hand:** the most common approach, and usually decent results, but a lot of effort and no guarantees.
- **Grid search:** try every combination on a grid. Systematic, but the cost grows **exponentially** with the number of hyperparameters, and choosing the grid is itself hard.
- **Random search:** sample random combinations. The cost doesn't explode with dimensions, and it tries more distinct values of each important hyperparameter. With finitely many samples it isn't guaranteed to get near the optimum.
- **Speed-ups for grid search:** (1) **early stopping / successive halving**: train all settings for 1 epoch, keep the better half, repeat; (2) **parallelism**: settings are independent (embarrassingly parallel), which saves time but not energy.

### Takeaway
When only a few hyperparameters matter, random search gets more value from each run than a grid.`,
    },
    {
      title: "MLOps: DevOps vs MLOps, CI/CD/CT",
      marks: 5,
      question: "What is MLOps? How do ML systems differ from traditional software? Explain CI, CD and CT in the ML context.",
      solution: `
### What the examiner wants
A definition, the five differences from slides 34–35, and precise ML meanings of CI, CD and CT. This is a 5-mark question, so use headings or a table.

### Model answer
**MLOps** applies DevOps principles to ML: it unifies ML development (Dev) and operation (Ops), with automation and monitoring across integration, testing, release, deployment and infrastructure. The real challenge isn't training a model but **operating an integrated ML system continuously in production**, since ML code is only a small part of that system.

**How ML differs from ordinary software:**
| Aspect | ML-specific challenge |
|---|---|
| Team | Data scientists focus on experiments, not production engineering |
| Development | Experimental, so tracking and reproducibility are hard |
| Testing | Also needs data validation, model-quality and model-validation tests |
| Deployment | A multi-step pipeline that retrains and redeploys models |
| Production | Models decay as data drifts, so monitoring and rollback are needed |

**CI/CD/CT in ML:**
- **CI:** besides testing code, test and validate **data, data schemas and models** (unit tests for feature logic, convergence tests, NaN checks).
- **CD:** deliver a **training pipeline** that automatically deploys *another* service, the model prediction service (check infrastructure compatibility, APIs, latency and throughput).
- **CT (new in ML):** automatically **retrain** the model in production on new data, on a schedule or trigger, and serve it.

### Takeaway
One-line summary: in ML, **CI tests data too, CD ships a pipeline, and CT retrains by itself**.`,
    },
    {
      title: "Data validation and model validation in a pipeline",
      marks: 4,
      question: "Explain data value skew, data schema skew and the steps of offline and online model validation.",
      solution: `
### What the examiner wants
The two data checks, each with the action it triggers, and the model-validation steps in order.

### Model answer
**Data validation** runs *before* training and decides whether to retrain or stop:
- **Data value skew:** the statistical properties of the incoming data change significantly (e.g. transaction amounts jump in festival season). **Trigger retraining.**
- **Data schema skew:** the data doesn't match the expected schema (unexpected features or values, missing features). **Stop the pipeline** and fix it or update it.

**Model validation** runs *after* retraining and before promotion:
1. Compute evaluation metrics on test data.
2. Compare with the current production model, a baseline, or business thresholds.
3. Check the performance is consistent across data **segments**.
4. Test deployability: infrastructure compatibility and API consistency.
5. **Online validation:** a canary deployment (a small share of live traffic) or A/B testing.

### Takeaway
Value skew → retrain. Schema skew → stop. Never promote a model without comparing it with the one already in production.`,
    },
    {
      title: "Overfitting diagnosis in the housing example",
      marks: 3,
      question: "On the housing data, a decision tree regressor has near-zero training RMSE but high cross-validation RMSE. What does this indicate, and what options do you have?",
      solution: `
### What the examiner wants
The diagnosis, backed by the train/CV gap, and three or four concrete remedies.

### Model answer
- **Diagnosis: overfitting.** The tree memorised the training data (low bias, high variance) and doesn't generalise. The large gap between training and CV error is the evidence.
- **Options:**
  1. Use an **ensemble**, e.g. a **random forest**, which averages many different trees and gave better CV accuracy in the slides.
  2. Constrain the model: limit the maximum depth or require a minimum number of samples per leaf.
  3. Get more training data or better features.
  4. Tune those hyperparameters with grid or random search plus cross-validation.

### Takeaway
Near-zero training error is a warning sign, not a success. Always judge by CV/validation error.`,
    },
  ],

  quiz: [
    { q: "Recall is:", options: ["TP/(TP+FP)", "TP/(TP+FN)", "TN/(TN+FP)", "(TP+TN)/N"], answer: 1, why: "Recall = fraction of actual positives that are caught." },
    { q: "How many classifiers does One-vs-One need for 10 classes?", options: ["10", "20", "45", "90"], answer: 2, why: "K(K−1)/2 = 10·9/2 = 45." },
    { q: "On an ROC plot, the ideal classifier sits at:", options: ["(0,0)", "(1,1)", "(0,1)", "(1,0)"], answer: 2, why: "FPR = 0 and TPR = 1." },
    { q: "An AUC of 0.5 means:", options: ["Perfect classifier", "Random guessing", "Always wrong", "50% accuracy"], answer: 1, why: "The diagonal ROC line corresponds to random guessing." },
    { q: "In bootstrap sampling, roughly what fraction of records appear in the training sample?", options: ["50%", "63.2%", "80%", "100%"], answer: 1, why: "1 − (1−1/n)ⁿ → 1 − e⁻¹ ≈ 0.632." },
    { q: "Which is unique to MLOps compared with DevOps?", options: ["Continuous integration", "Continuous delivery", "Continuous training", "Unit testing"], answer: 2, why: "CT automatically retrains models in production." },
    { q: "The incoming data suddenly lacks an expected feature column. This is:", options: ["Data value skew", "Data schema skew", "Concept drift", "Overfitting"], answer: 1, why: "A schema mismatch: stop the pipeline and fix it." },
    { q: "Main drawback of grid search:", options: ["Not reproducible", "Cost grows exponentially with the number of hyperparameters", "Can't be parallelised", "Needs labelled data"], answer: 1, why: "Every added hyperparameter multiplies the number of grid points." },
    { q: "For a cancer screening test, the most important metric is usually:", options: ["Precision", "Recall", "Accuracy", "Specificity"], answer: 1, why: "Missing a cancer (FN) is the costliest error." },
    { q: "Which classifier handles multiple classes natively?", options: ["SVM", "Linear classifier", "Random Forest", "Perceptron"], answer: 2, why: "Random forests and Naive Bayes are natively multiclass; SVMs are binary." },
  ],
};
