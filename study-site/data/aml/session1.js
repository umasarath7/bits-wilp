// AML — Contact Session 1: Introduction to Machine Learning
// Source: CourseFiles/AML/ContactSession1-Introduction.pptx (51 slides)
// Text supports **bold**, `code` and KaTeX math ($inline$, $$display$$).
// Teaching style: big idea → plain explanation → example → summary table → what to remember.
// Solutions: ### What is asked → ### Idea & why → ### Formula → ### Steps → ### Answer → ### Takeaway.

export default {
  title: "Introduction to Machine Learning",
  source: "ContactSession1-Introduction.pptx · 51 slides",
  overview:
    "This session answers four questions. **What is ML?** A program that gets better at a task by learning from data instead of following hand-written rules. **When should you use it?** When the rules are too many, too hard to write down, or keep changing. **What kinds of ML are there?** Sorted by labels (supervised, unsupervised, semi-supervised, reinforcement), by how data is fed in (batch or online), and by how predictions are made (instance-based or model-based). **What goes wrong?** Bad data, and models that are too complex or too simple. Everything else in the course builds on these ideas.",

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
        {
          type: "callout",
          kind: "idea",
          title: "The big idea",
          text: "In normal programming, **you** write the rules. In machine learning, you give the computer **examples with the right answers**, and it **works out the rules by itself**.",
        },
        {
          type: "p",
          text: "Think about how a child learns what a dog is. Nobody gives the child a rule like “four legs + tail + barks = dog”. We just point at many dogs and say “dog”. After enough examples the child recognises dogs they've never seen before. Machine learning works the same way: show the computer many labelled examples and it learns a pattern it can apply to new cases.",
        },
        { type: "diagram", name: "tradVsMl" },
        {
          type: "p",
          text: "Read the diagram left to right. **Traditional programming:** you feed in *data + a program (rules)* and get *output*. **Machine learning:** you feed in *data + the expected output* and get a *program*, which we call a **model**. That model is then used on new data to produce answers.",
        },
        {
          type: "p",
          text: "The slides give **three definitions**, each more precise than the last:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Informal:** the science (and art) of programming computers so they can *learn from data*.",
            "**Arthur Samuel:** the field that gives computers the ability to learn *without being explicitly programmed*.",
            "**Tom Mitchell (the one to write in exams):** a program learns from **experience E** with respect to a **task T** and a **performance measure P** if its performance at T, measured by P, **improves with E**.",
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Mitchell's definition as a checklist",
          text: "A learning problem is fully described by the triple $\\langle T, P, E \\rangle$:\n\n- **T (Task):** what the system has to *do*. Use a verb: classify, predict, play, drive.\n- **P (Performance):** a *number* that tells you how well it does T: accuracy %, error rate, distance.\n- **E (Experience):** the *data it learns from*: labelled emails, past games, recorded driving.\n\nThe word “learns” means **P gets better as E grows**.",
        },
        {
          type: "p",
          text: "Why does this matter? Many problems sound like AI but are badly defined. “Make email better” is not a learning problem. “Classify emails as spam/ham (T), measured by % correctly classified (P), using emails users have labelled (E)” is. Writing down T, P and E forces you to be precise.",
        },
        {
          type: "table",
          caption: "The four ⟨T, P, E⟩ examples from slide 5",
          head: ["Task T", "Performance P", "Experience E"],
          rows: [
            ["Playing checkers", "% of games won against an arbitrary opponent", "Practice games against itself"],
            ["Recognising handwritten words", "% of words correctly classified", "Database of human-labelled handwriting images"],
            ["Driving on 4-lane highways (vision)", "Average distance travelled before a human-judged error", "Images + steering commands recorded from a human driver"],
            ["Spam vs legitimate email", "% of emails correctly classified", "Emails, some with human-given labels"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: write ⟨T, P, E⟩ for a new scenario",
          text: "**Scenario:** a hospital wants software that flags pneumonia in chest X-rays.\n\n- **T:** classify each chest X-ray as *pneumonia* or *normal*.\n- **P:** % of X-rays classified correctly. Better still, the **% of pneumonia cases caught**, because missing a sick patient is the costly mistake.\n- **E:** a database of past X-rays labelled by radiologists.\n\nNotice that P is a **number you can measure** and E is **where the data comes from**. Those are the two things examiners check.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember",
          text: "ML = learning rules from examples. Always be able to write ⟨T, P, E⟩, with P measurable and E the actual data source.",
        },
      ],
    },
    {
      id: "why",
      heading: "2. Why ML? The spam filter story",
      slides: "6–12",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "The big idea",
          text: "Use ML when writing the rules by hand is **too long, too hard, or goes out of date too quickly**.",
        },
        {
          type: "p",
          text: "The slides use spam filtering to show why. Let's walk through it as if you were the programmer.",
        },
        {
          type: "p",
          text: "**The traditional way.** You look at spam and notice words like “4U”, “credit card”, “free” and “amazing”. You write a rule for each: *if the email contains “free” and “credit card”, mark it as spam*. You test it, find spam that slips through, and add more rules. After months you have hundreds of rules that are hard to read, conflict with each other, and are hard to maintain. Then spammers start writing “fr33” instead of “free”, and you're back to writing rules.",
        },
        {
          type: "p",
          text: "**The ML way.** You collect emails that users have already marked as spam or not spam (“ham”). The algorithm counts which words and phrases appear **unusually often in spam compared with ham**, and learns how much each one should count. When spammers switch to “fr33”, users mark those emails as spam, you retrain, and the model learns the new word **without you writing a single rule**.",
        },
        {
          type: "table",
          caption: "Side by side",
          head: ["", "Traditional approach", "ML approach"],
          rows: [
            ["How it's built", "A person writes rules for known patterns", "The algorithm learns which words predict spam from labelled examples"],
            ["Result", "A long list of complex rules, hard to maintain", "A shorter program, easier to maintain, usually more accurate"],
            ["When spammers change tactics", "A person rewrites the rules", "Retrain on new labelled data"],
          ],
        },
        {
          type: "p",
          text: "**Some problems can't be written as rules at all.** Slide 8 shows handwritten digits. Try writing a rule for what makes a “2”: a curve at the top, a diagonal, a flat base? Some people's “2” looks like a “3” or a “7”. Nobody can write that rule down, yet a model trained on thousands of labelled digits recognises them very well.",
        },
        {
          type: "p",
          text: "**When to use ML (slide 11).** Ask yourself these four questions. A “yes” to any of them suggests ML:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Would the rule-based solution need lots of hand-tuning or a very long list of rules?** Example: spam filtering.",
            "**Is it a complex problem with no good traditional solution, because humans can't explain how they do it?** Examples: recognising faces, understanding speech.",
            "**Does the environment keep changing?** An ML system can adapt by retraining on new data. Example: fraud patterns change every month.",
            "**Do you want insight from a large amount of data?** This is **data mining**: ML can reveal patterns and correlations humans never suspected, so *ML helps humans learn* too.",
          ],
        },
        {
          type: "p",
          text: "**Typical scenarios (slide 9):** recognising **patterns** (faces, speech, medical images), spotting **anomalies** (unusual credit-card transactions, strange sensor readings in a nuclear plant), **predicting** from time series (stock prices, exchange rates) and **generating** new content (images, motion).",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Where ML fits (slide 12)",
          text: "**AI ⊃ Machine Learning ⊃ Deep Learning.** AI is the broad goal of making machines act intelligently. ML is the part of AI that learns from data. Deep learning is the part of ML that uses many-layered neural networks. ML also overlaps with statistics, data mining, pattern recognition and optimisation.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember",
          text: "Spam story: rules → long, brittle, manual updates. ML → learns from labelled data, adapts by retraining. Use ML for rule-heavy problems, problems humans can't explain, changing environments, and finding insight in data.",
        },
      ],
    },
    {
      id: "apps",
      heading: "3. Applications of ML",
      slides: "13–24",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "The big idea",
          text: "Almost every application is one of two things: **put something into a category, or predict a number** (classification/regression), or **choose a sequence of actions to reach a goal** (planning and control).",
        },
        {
          type: "p",
          text: "**Class 1: assign or predict a value (slide 15).** The system looks at an object or event and outputs one answer. What kind of answer decides the name:",
        },
        {
          type: "list",
          items: [
            "The answer comes from a **finite set of categories** (spam/ham, digit 0–9, disease/no disease) → **classification**.",
            "The answer is a **real number** (a price, a temperature, a sales figure) → **regression**.",
          ],
        },
        {
          type: "p",
          text: "Quick test: *can you list all possible answers?* If yes, it's classification. If the answer could be 23.7 or 23.71, it's regression.",
        },
        {
          type: "p",
          text: "**Class 2: predict a sequence of steps to reach a goal (slide 18).** Here there's no single answer. The system has to *act* again and again: playing chess, driving a car, flying a drone, controlling a robot or a game character. This is the home of **reinforcement learning** (section 4).",
        },
        {
          type: "p",
          text: "**Classification examples (slide 17):** medical diagnosis, credit-card fraud, network worm detection, spam filtering, recommending articles/books/movies, DNA sequences, spoken words, handwritten letters, astronomical images. **Domains (slide 16):** internet, computational biology, finance, e-commerce, space exploration, robotics, information extraction, social networks, software engineering, system management, creative arts.",
        },
        {
          type: "p",
          text: "**A real result: deep learning for speech (slide 20).** Researchers trained networks with different numbers of hidden layers to recognise speech and measured the **word error rate (WER)**, the % of words recognised wrongly (lower is better). The old method (a Gaussian Mixture Model) scored 15.4%.",
        },
        {
          type: "table",
          caption: "Zeiler et al. 2013. Baseline GMM WER = 15.4%",
          head: ["# Hidden layers", "1", "2", "4", "8", "10", "12"],
          rows: [["Word error rate %", "16.0", "12.8", "11.4", "**10.9**", "11.0", "11.1"]],
        },
        {
          type: "p",
          text: "How to read it: **1 layer (16.0%) is worse than the old method**, because the network is too simple. Adding layers helps a lot, down to **10.9% at 8 layers**. After that, 10 and 12 layers are slightly *worse*. More capacity stops helping and starts to hurt. Keep this pattern in mind: it's **underfitting** at the left and the start of **overfitting** at the right (section 5).",
        },
        {
          type: "p",
          text: "**Other applications in the slides:** visual question answering, self-driving cars (Stanley and Sebastian, with laser terrain mapping, adaptive vision, learning from human drivers and path planning), OCR, product image classification, tumour detection, news categorisation, flagging offensive comments, summarisation, chatbots, customer segmentation, recommendation systems and revenue forecasting.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember",
          text: "Finite categories → classification. Real number → regression. Sequence of actions → planning/control (RL). In the speech table, too few layers underfit and too many start to overfit.",
        },
      ],
    },
    {
      id: "types",
      heading: "4. Types of Machine Learning",
      slides: "25–41",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "The big idea",
          text: "The slides sort ML systems using **three separate questions**. Every system has an answer to each one:\n\n1. **What kind of feedback does it learn from?** (supervised / unsupervised / semi-supervised / reinforcement)\n2. **How is the training data fed in?** (batch / mini-batch / online)\n3. **How does it make a prediction?** (instance-based / model-based)",
        },
        { type: "p", text: "#### Question 1: What kind of feedback? (level of supervision)" },
        {
          type: "p",
          text: "**Supervised learning: learning with an answer key.** Every training example comes with the correct answer, called the **label**. It's like studying with a solved question bank: you see a question $x$, you see its answer $y$, and you learn a function $f(x) \\approx y$ so you can answer new questions. Supervised learning has two flavours:",
        },
        {
          type: "list",
          items: [
            "**Regression:** $y$ is a real number. *Slide 28:* predict the September Arctic sea-ice extent (in million km²) from the year.",
            "**Classification:** $y$ is a category. *Slides 29–30:* predict whether a tumour is benign (0) or malignant (1) from its size.",
          ],
        },
        {
          type: "p",
          text: "The tumour example shows how simple a classifier can be. Plot tumour size on a line. Benign tumours sit mostly on the left and malignant ones on the right. The model learns a **threshold T**: *if size > T predict malignant, else benign*. Training means finding the best T.",
        },
        {
          type: "p",
          text: "**More features (slide 31).** Real systems use more than one measurement: tumour size, patient age, clump thickness, uniformity of cell size and shape. Each one is a **feature**, i.e. one dimension of $x$. With 2 features the threshold becomes a **line** splitting the plane. With 3 or more it becomes a **hyperplane**. Same idea, more dimensions.",
        },
        {
          type: "p",
          text: "**Unsupervised learning: no answer key.** You only have inputs $x_1, \\dots, x_n$, no labels. The goal is to find **hidden structure**. Imagine being handed 10,000 customer records and asked “what kinds of customers do we have?”. Nobody tells you the groups; the algorithm finds them. Main tasks:",
        },
        {
          type: "list",
          items: [
            "**Clustering:** group similar items (k-Means, hierarchical clustering, Expectation Maximisation). *Examples:* customer segmentation, grouping people by genetic similarity (slide 36), organising computing clusters, social network analysis.",
            "**Visualisation and dimensionality reduction:** squeeze many features down to 2–3 so you can plot them while keeping similar points together (PCA, Kernel PCA, LLE, t-SNE). *Slide 35:* t-SNE of images places animals in one region and vehicles in another, with no labels given.",
            "**Association rule learning:** find items that occur together (Apriori, Eclat). *Example:* people who buy bread and butter often buy milk.",
          ],
        },
        {
          type: "p",
          text: "**Semi-supervised learning: a few answers, lots of unlabelled data.** Labelling is expensive, so often you have a little labelled data and a lot of unlabelled data. *Slide 38 (Google Photos):* the app first **clusters** your photos by face (unsupervised). You name one person once (a label), and it labels every photo in that cluster (supervised).",
        },
        {
          type: "p",
          text: "**Reinforcement learning: learning by trial and reward.** There are no labels at all. An **agent** observes the **state** of its environment, takes an **action**, and receives a **reward** (positive or negative). Over many tries it learns a **policy**, a rule that maps *state → best action*, to collect the most reward over time. It's like training a dog with treats. *Examples (slide 39):* AlphaGo, a robot finding its way through a maze, balancing a pole on your hand.",
        },
        {
          type: "table",
          caption: "Question 1 summary",
          head: ["Type", "What you're given", "What it learns", "Example"],
          rows: [
            ["**Supervised**", "Inputs **+ labels**", "$f(x) \\approx y$", "House price (regression), spam (classification)"],
            ["**Unsupervised**", "Inputs only", "Hidden structure", "Customer segments, t-SNE plots"],
            ["**Semi-supervised**", "Few labels + lots of unlabelled data", "Uses both", "Google Photos face naming"],
            ["**Reinforcement**", "Rewards for actions", "A **policy**: state → action", "AlphaGo, maze robot"],
          ],
        },
        {
          type: "table",
          caption: "Algorithms you'll meet in this course (slides 32 and 34)",
          head: ["Supervised", "Unsupervised"],
          rows: [
            ["Linear regression", "**Clustering:** k-Means, Hierarchical, Expectation Maximisation"],
            ["Logistic regression", "**Dimensionality reduction:** PCA, Kernel PCA, LLE, t-SNE"],
            ["Naïve Bayes", "**Association rules:** Apriori, Eclat"],
            ["SVMs, decision trees, random forests, neural networks", ""],
          ],
        },
        { type: "p", text: "#### Question 2: How is the training data fed in? (slide 40)" },
        {
          type: "p",
          text: "Picture a teacher marking 1,000 answer sheets and adjusting their teaching.",
        },
        {
          type: "list",
          items: [
            "**Batch learning:** read **all 1,000** sheets, then adjust once. The model trains on the entire dataset at once. To include new data you have to **retrain from scratch** on old + new data, which is slow and needs lots of memory.",
            "**Mini-batch learning:** read **50 sheets**, adjust, read the next 50, adjust again. The model trains on small chunks. This is the practical middle ground most modern systems use.",
            "**Online (incremental) learning:** adjust after **every single sheet**. The model updates on one example at a time as data arrives. It's ideal when data **streams in continuously** (stock prices, sensor feeds), when things **change quickly**, or when the data is **too big to fit in memory**. The risk: if bad data arrives, the model quietly gets worse, so it has to be monitored.",
          ],
        },
        { type: "p", text: "#### Question 3: How does it make a prediction? (slide 41)" },
        {
          type: "list",
          items: [
            "**Instance-based learning: “find similar past cases”.** The system simply **remembers** the training examples. For a new case it finds the most similar stored ones and copies their answer. *Example:* **k-Nearest Neighbours.** To price a house, find the 5 most similar houses sold and average their prices. It's like a doctor who says “this looks just like three patients I saw last year”.",
            "**Model-based learning: “learn a formula”.** The system studies the data, **builds a model** (e.g. a line $y = \\theta_0 + \\theta_1 x$) and learns its parameters. After training the data can be thrown away; predictions come from the formula. It's like a doctor who has learnt a rule such as “risk rises with blood pressure at this rate”.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "The three questions are independent",
          text: "Students often mix these up. **Supervised/unsupervised** is about *labels*. **Batch/online** is about *how data is fed in*. **Instance/model-based** is about *how predictions are made*. One system has an answer to all three. For example, a spam filter that updates each time you click “Report spam” and learns a weight per word is **supervised + online + model-based**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember",
          text: "Labels? → supervised. None? → unsupervised. Few? → semi-supervised. Rewards? → RL. All data at once → batch; one at a time → online. Stores examples → instance-based (k-NN); learns parameters → model-based (linear regression).",
        },
      ],
    },
    {
      id: "challenges",
      heading: "5. Challenges of Machine Learning",
      slides: "42–51",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "The big idea",
          text: "An ML system can fail for only two reasons: **the data is bad**, or **the model is wrong for the data** (too complex or too simple). Then there's the practical question: how do we *check* which one is happening? That's what validation is for.",
        },
        { type: "p", text: "#### Part A: Bad data" },
        {
          type: "p",
          text: "**1. Insufficient data (slide 44).** Humans learn “apple” from a handful of examples. Algorithms usually need **thousands** of examples even for simple problems, and millions for images or speech. A famous finding (“the unreasonable effectiveness of data”) is that with enough data, quite different algorithms end up performing about the same. The slides turn this into a **trade-off: spend your effort on a cleverer algorithm, or on collecting more data?**",
        },
        {
          type: "p",
          text: "**2. Non-representative data (slide 45).** The training data must look like the cases the model will face later. There are two different ways this goes wrong, and exams love to ask which is which:",
        },
        {
          type: "list",
          items: [
            "**Sampling noise:** the sample is **too small**, so it's unrepresentative *by chance*. Survey 10 random people and you might happen to get 7 cricket fans. **Fix: collect more data.**",
            "**Sampling bias:** the **method** of collecting is flawed, so the data is unrepresentative *even if it's huge*. Survey 1 million people, but only at cricket stadiums. **More data does not fix bias; only a better sampling method does.**",
          ],
        },
        {
          type: "p",
          text: "The slide's example: a model of *life satisfaction vs GDP* built from some countries suggests money strongly buys happiness. Add the missing countries (some rich but not very happy, some poor but happy) and the effect is much weaker. The missing data **exaggerated the role of wealth**.",
        },
        {
          type: "p",
          text: "**3. Poor-quality data (slide 46).** Errors, noise, outliers and missing values make the real pattern harder to see. Cleaning is essential and is often most of a data scientist's time. For **outliers**, either discard them or fix them by hand. For **missing values** (e.g. 5% of customers didn't give their age), you have options: **ignore the feature**, **drop those rows**, **fill in the values** (say, with the median age), or **train one model with the feature and one without** and compare.",
        },
        {
          type: "p",
          text: "**4. Irrelevant features (slide 47).** “Garbage in, garbage out.” If the features don't relate to what you're predicting, no algorithm can help. **Feature engineering** fixes this in three ways: **feature selection** (keep only useful features), **feature extraction** (combine features into a better one, e.g. mileage + age → wear-and-tear), and **creating new features by gathering new data**.",
        },
        { type: "p", text: "#### Part B: The wrong model" },
        {
          type: "p",
          text: "Think of three students preparing for an exam:",
        },
        {
          type: "list",
          items: [
            "**Student A memorises every past-paper answer word for word.** They score 100% on past papers but fail when the question changes slightly. That is **overfitting**: the model learnt the training data *including its noise and quirks*, not the real pattern.",
            "**Student B only reads the chapter titles.** They do badly on past papers *and* on the real exam. That is **underfitting**: the model is too simple to capture the pattern at all.",
            "**Student C understands the concepts.** They do well on both. That's the goal: a model that **generalises**.",
          ],
        },
        {
          type: "p",
          text: "**Overfitting (slide 47).** It happens when the model is **too complex for the amount and noisiness of the data**. The slides' example is a high-degree polynomial fitted to life-satisfaction data: it wiggles through every point, so it fits the training data perfectly but makes silly predictions in between. **Fixes:** **regularisation** (put a constraint on the model, e.g. force a smaller slope, so it can't bend to every point), a simpler model with fewer parameters, more training data, or less noise (fix errors, remove outliers).",
        },
        {
          type: "p",
          text: "**Underfitting (slide 48).** The model is **too simple for the structure in the data**, like fitting a straight line to a curve. **Fixes:** a more powerful model (more parameters), better features, or **less** regularisation.",
        },
        {
          type: "table",
          caption: "How to tell them apart from the errors",
          head: ["", "Training error", "Validation error", "Diagnosis", "What to do"],
          rows: [
            ["Case 1", "Low", "**Much higher**", "**Overfitting** (big gap)", "Regularise, simplify, more data"],
            ["Case 2", "**High**", "High (close to training)", "**Underfitting** (both bad)", "More complex model, better features, less regularisation"],
            ["Case 3", "Low", "Low (close)", "Good fit", "Keep it"],
          ],
        },
        { type: "p", text: "#### Part C: How do we check? Testing and validation" },
        {
          type: "p",
          text: "**Why not test on the training data?** Student A (the memoriser) scores 100% on past papers, but that tells you nothing about the real exam. In the same way, **training error is always too optimistic**. We need to measure the model on data it has **never seen** (slide 49).",
        },
        {
          type: "p",
          text: "**Hold-out validation (slide 50).** Before training, set aside a random **20–30%** of the data as a **validation set** (also called a dev set). Train on the rest, then measure performance on the validation set. A model that does well there is *expected* to do well on new data. This is a statistical estimate, not a guarantee.",
        },
        {
          type: "p",
          text: "**The problem with a single split:** you might get unlucky (all the hard examples land in validation) or lucky. The score depends on *which* points were held out.",
        },
        {
          type: "p",
          text: "**K-fold cross-validation fixes this.** Split the data into **K equal parts (folds)**. Train on K−1 folds and validate on the remaining fold. Repeat **K times**, so each fold gets one turn as the validation set. Then **average the K scores**. Every data point is used for validation exactly once and for training K−1 times. **K = 10** is common.",
        },
        {
          type: "p",
          text: "```flow\nSplit data into K folds -> Round 1: train on folds 2..K, validate on fold 1 -> Round 2: train on all but fold 2, validate on fold 2 -> … -> Round K -> Average the K scores\n```",
        },
        {
          type: "callout",
          kind: "formula",
          title: "K-fold arithmetic",
          text: "With $n$ samples and $K$ folds:\n\n- fold size $= n / K$\n- each round trains on $n \\cdot \\frac{K-1}{K}$ samples and validates on $n / K$\n- number of models trained $= K$\n- each sample is validated **once** and used for training **K − 1** times",
        },
        {
          type: "p",
          text: "**Hyperparameters (slide 51).** A **parameter** is something the model learns *from the data*, like the slope $\\theta_1$ of a line. A **hyperparameter** is a setting you choose *before training*, like the degree of the polynomial, the regularisation strength $\\lambda$, or K in k-NN. How do you choose them? Try different values, measure each with cross-validation, and **pick the one with the best cross-validation score**. The catch: with several hyperparameters, the number of combinations **multiplies** (3 values × 4 values × 5 values = 60 combinations, each needing K training runs). That's why tuning frameworks (grid search, random search, smarter optimisers) exist.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Grid-search cost",
          text: "$$\\text{training runs} = (\\text{values}_1 \\times \\text{values}_2 \\times \\dots) \\times K \\;(+1 \\text{ final refit on all the data})$$",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember",
          text: "Bad data: insufficient, non-representative (noise = too small, bias = flawed method), poor quality, irrelevant features. Wrong model: overfit = big train–validation gap; underfit = both errors high. Judge models on unseen data: hold-out or K-fold (average of K). Hyperparameters are picked by cross-validation score.",
        },
      ],
    },
  ],

  keyTerms: [
    ["⟨T, P, E⟩", "Task, Performance measure, Experience: Mitchell's definition of a learning problem."],
    ["Label", "The correct answer attached to a training example."],
    ["Feature", "One measurable input attribute (one dimension of $x$)."],
    ["Classification", "Predict a category from a finite set."],
    ["Regression", "Predict a real-valued number."],
    ["Policy (RL)", "A mapping from states to actions that maximises reward over time."],
    ["Online learning", "Update the model one instance at a time as data arrives."],
    ["Instance-based", "Predict by comparing with stored examples (e.g. k-NN)."],
    ["Model-based", "Learn a model's parameters, then predict with the model."],
    ["Sampling noise", "Unrepresentative data because the sample is too small (chance)."],
    ["Sampling bias", "Unrepresentative data because the collection method is flawed; more data doesn't help."],
    ["Feature engineering", "Feature selection + extraction + creating new features."],
    ["Overfitting", "Fits training noise: low training error, much higher validation error."],
    ["Underfitting", "Too simple: training and validation errors both high."],
    ["Regularisation", "Constraining a model so it can't overfit."],
    ["Validation / dev set", "Held-out data (20–30%) for evaluating and choosing models."],
    ["K-fold CV", "K rounds, each fold validated once; average the K scores."],
    ["Hyperparameter", "A setting of the learning algorithm chosen before training (degree, λ, K)."],
  ],

  examTips: [
    "For ⟨T,P,E⟩ questions, make **P a measurable number** and **E the real data source**. Mention which error type matters most if the scenario has costly mistakes.",
    "“Which type of learning?” → answer **all three questions** (feedback, how data is fed, how predictions are made) with a one-line reason for each.",
    "Overfit vs underfit questions usually give a train/validation error table. Look at the **gap** (overfit) and the **level** (underfit).",
    "Noise vs bias: noise → sample too small; bias → method flawed (a bigger sample doesn't fix it).",
    "K-fold: K models, each trained on (K−1)/K of the data. Grid search runs = combinations × K (+1 final refit).",
  ],

  problems: [
    {
      title: "Define ⟨T, P, E⟩ for new scenarios",
      level: "Easy",
      marks: 4,
      question:
        "Define the learning task $\\langle T, P, E \\rangle$ for: (a) a bank's loan-default predictor, (b) a movie recommender on a streaming platform. For each, also say whether it is classification or regression.",
      solution: `
### What is being asked
For each system, name the **task**, how to **measure** it, and what **data** it learns from. Then decide whether the output is a category or a number.

### Which idea we use, and why
Mitchell's definition: a system learns if its performance **P** on task **T** improves with experience **E**. Check each part:
- T should be a clear verb phrase.
- P must be a number you can compute.
- E must be data that actually exists.

For the classification vs regression question, ask: *can I list all possible outputs?*

### Solution
**(a) Loan default**
- **T:** predict whether a loan applicant will default (yes/no).
- **P:** % of applicants correctly classified. Better: **recall on defaulters**, because approving someone who then defaults is the expensive mistake.
- **E:** historical loan applications with their known repayment outcome.
- Two possible outputs → **classification** (supervised).

**(b) Movie recommender**
- **T:** predict the rating (1–5) a user would give a movie they haven't seen, and recommend the highest-rated ones.
- **P:** average error between predicted and actual ratings (e.g. mean absolute error), or % of recommended movies actually watched.
- **E:** users' past ratings and watch history.
- A numeric rating → **regression**. If you frame it as “will watch / won't watch”, it's classification. Either is fine if you justify it.

### Takeaway
The same business goal can be framed as classification or regression. What decides it is the **form of the output** you choose to predict.`,
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
### What is being asked
Place each system on the **three independent axes** from section 4 and give a reason for each choice.

### How to decide
Ask three questions of every system, in order:
1. **Feedback:** are there correct answers (labels)? None? A few? Rewards?
2. **Data feeding:** does it learn from everything at once (batch) or update as each example arrives (online)?
3. **Prediction:** does it look up similar stored examples (instance-based) or use learnt parameters (model-based)?

### Solution
| # | Feedback | Batch/Online | Instance/Model |
|---|---|---|---|
| 1 | **Supervised**: each click is a label (spam) | **Online**: updates one email at a time | **Model-based**: it learnt a weight per word |
| 2 | **Unsupervised**: no labels, it finds groups | **Batch**: uses all data once a quarter | **Model-based**: it keeps centroids, not every customer |
| 3 | **Reinforcement**: learns from penalties/rewards | **Online**: learns while it cleans | **Model-based**: learns a policy (state → action) |
| 4 | **Supervised**: past sale prices are the labels | **Batch**: works from the stored sales data | **Instance-based**: 5-NN compares with stored houses |

*Note on #2:* k-Means keeps only the cluster centres (a compact summary), which is why it counts as model-based.

### Takeaway
Look for key phrases: “labels / marked as” → supervised; “reward / penalty” → RL; “every time / as it arrives” → online; “most similar” → instance-based; “learnt weights” → model-based.`,
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
### What is being asked
This is the slide 30 classifier: one number T splits the size line into “benign” (left) and “malignant” (right). We have to **train** it, i.e. find the T with the fewest mistakes on the training data.

### Idea & why this approach
Moving T around only changes predictions when it crosses a data point. So we only need to test **one T between each pair of neighbouring points**, i.e. the midpoints 1.25, 1.75, …, 4.25. For each T:
- everything **above** T is predicted M
- everything **at or below** T is predicted B

Count the points whose true label disagrees.

### Formula
$$\\text{error rate} = \\frac{\\text{number of wrong predictions}}{\\text{total points}}, \\qquad \\text{accuracy} = 1 - \\text{error rate}$$

### Steps
**(a)** Check the interesting candidates, where the labels change:

| T | Predicted M | Wrong ones | Errors | Error rate |
|---|---|---|---|---|
| 1.75 | 2.0 … 4.5 | 2.0 (really B), 3.0 (really B) | 2 | 25% |
| **2.25** | 2.5 … 4.5 | 3.0 (really B) | **1** | 12.5% |
| 2.75 | 3.0 … 4.5 | 2.5 (really M, predicted B), 3.0 (really B) | 2 | 25% |
| **3.25** | 3.5 … 4.5 | 2.5 (really M, predicted B) | **1** | 12.5% |
| 3.75 | 4.0, 4.5 | 2.5 (M), 3.5 (M) predicted B | 2 | 25% |

Candidates further out (1.25, 4.25) make even more errors.

### Answer
**(a)** The minimum is **1 error**, at **T = 2.25** or **T = 3.25**.

**(b)** Best accuracy $= 7/8 = $ **87.5%**. No single threshold can reach 100%, because a **malignant 2.5 sits to the left of a benign 3.0**. Any cut either puts 2.5 on the benign side or 3.0 on the malignant side. The data is **not separable using one feature**. You would need more features (slide 31) or a more flexible model.

**(c)** Choose **T = 2.25**. Its one mistake is a **false positive**: a benign tumour flagged as malignant, which means extra tests. T = 3.25's mistake is a **false negative**: a cancer is missed, which is far worse.

### Takeaway
“Training” a model means searching for the parameter value (here T) that minimises error on the training data. When two models tie on accuracy, choose based on **which mistake is more costly**, and choose P to reflect that.`,
    },
    {
      title: "K-fold cross-validation arithmetic",
      level: "Easy",
      marks: 4,
      question:
        "A dataset has 1,200 labelled samples. (a) With 10-fold CV, how many models are trained, and how many samples go into training and validation in each round? (b) How many times is each sample used for training and for validation? (c) Repeat (a) for leave-one-out CV (K = n).",
      solution: `
### What is being asked
How K-fold cross-validation divides the data, and how much training it costs.

### Idea & why
K-fold rotates which part of the data is held out, so every sample gets exactly **one** turn as validation data. That gives a fairer estimate than a single split.

### Formula
With $n$ samples and $K$ folds:
$$\\text{fold size} = \\frac{n}{K}, \\quad \\text{train per round} = n - \\frac{n}{K}, \\quad \\text{models} = K$$

### Steps
**(a)** $n = 1200,\\ K = 10$:
- fold size $= 1200 / 10 = 120$
- each round: **1,080 training, 120 validation**
- models trained: **10**

**(b)** Each sample belongs to exactly one fold:
- validated once, when its own fold is held out
- used for training in the other $10 - 1 = 9$ rounds

So **1× validation, 9× training**.

**(c)** Leave-one-out means $K = n = 1200$:
- fold size $= 1$
- each round: **1,199 training, 1 validation**
- models trained: **1,200**

### Takeaway
Bigger K means each model sees more training data (a more reliable estimate), but you train K models, so it costs more. K = 10 is the usual compromise. Leave-one-out is the extreme.`,
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
### What is being asked
The cost of **grid search**: trying every combination of hyperparameter values, each checked with cross-validation.

### Idea & why
Every combination is a different model, and each model's score comes from K-fold CV, so it is trained K times. After choosing the best combination, we train it **once more on all the data** (the final refit) to get the model we deploy.

### Formula
$$\\text{runs} = \\underbrace{(v_1 \\times v_2 \\times v_3)}_{\\text{combinations}} \\times K + 1$$

### Steps
**(a)** Combinations $= 5 \\times 4 \\times 3 = $ **60**

**(b)** CV runs $= 60 \\times 5 = 300$. Add 1 final refit → **301 runs**.

**(c)**
- CV time $= 300 \\times 3 = 900$ minutes
- refit time $= 3 \\times 1.25 = 3.75$ minutes
- total $= 903.75$ min $\\approx$ **15.1 hours**

**(d)**
- combinations $= 60 \\times 6 = 360$
- CV runs $= 360 \\times 5 = 1800$
- time $\\approx 1800 \\times 3 = 5400$ min $\\approx$ **90 hours**, i.e. **6× the cost**

### Takeaway
Each new hyperparameter **multiplies** the cost, so it grows exponentially (slide 51). That's why people use random search or smarter optimisation frameworks instead of trying every combination.`,
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
### What is being asked
Use the training and validation errors to diagnose each model (Student A vs Student B from the notes), then pick the best one.

### How to read the table
Look at two things for each column:
- **Level:** is the *training* error high? If so, the model can't even fit what it has seen → **underfitting**.
- **Gap:** is validation error much bigger than training error? If so, it memorised the training data → **overfitting**.

### Steps
| Degree | Train | Val | Gap | Diagnosis |
|---|---|---|---|---|
| 1 | 24.1 | 25.3 | 1.2 | Both high → **underfit** |
| 2 | 9.8 | 10.6 | 0.8 | Still fairly high → mild underfit |
| 4 | 5.2 | 5.9 | 0.7 | Both low, small gap → **good** |
| 8 | 2.1 | 9.4 | 7.3 | Gap opening → **overfitting starts** |
| 15 | 0.2 | 41.7 | 41.5 | Huge gap → **severe overfit** |

### Answer
**(a)** **Degree 1 (and arguably 2) underfit:** both errors are high and close together, so the model is too simple. **Degrees 8 and 15 overfit:** training error keeps falling but validation error climbs. At degree 15, 0.2 vs 41.7 means it has fitted the noise.

**(b)** **Degree 4.** It has the **lowest validation error** (5.9) and a small gap. Always choose using **validation** error, never training error. Training error always favours the most complex model.

**(c)** Any two:
1. **Regularisation**: penalise large coefficients so the curve can't bend to every point.
2. **More training data**: noise averages out, and the curve can't chase individual points.
3. **Clean the data**: remove outliers and errors so there's less noise to memorise.

### Takeaway
As complexity rises, training error only goes **down**, but validation error goes **down, then up** (a U shape). The best model sits at the bottom of the validation curve.`,
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
### What is being asked
Make the same prediction in the two ways from slide 41: by **looking up similar countries** (k-NN) and by **fitting a line** (linear regression). Then compare them.

### Idea & why
- **3-NN:** find the 3 countries whose GDP is closest to 33 and average their life satisfaction. No training step; the data *is* the model.
- **Linear model:** find the straight line that best fits all 5 points (smallest total squared error), then read off the value at x = 33. Least squares gives a formula for the slope and intercept.

### Formulas
k-NN (with $k$ neighbours $N$):
$$\\hat y = \\frac{1}{k} \\sum_{i \\in N} y_i$$

Least-squares line:
$$\\theta_1 = \\frac{\\sum (x_i - \\bar x)(y_i - \\bar y)}{\\sum (x_i - \\bar x)^2}, \\qquad \\theta_0 = \\bar y - \\theta_1 \\bar x$$

$\\theta_1$ (the slope) measures how much $x$ and $y$ move together, relative to how much $x$ varies on its own. $\\theta_0$ makes the line pass through the mean point $(\\bar x, \\bar y)$.

### Steps
**(a) 3-NN**
Distances from 33:
- C: $|30-33| = 3$
- D: $|40-33| = 7$
- B: $|20-33| = 13$
- E: 17
- A: 23

The 3 nearest are **C, D, B**:
$$\\hat y = \\frac{6.1 + 6.6 + 5.6}{3} = \\frac{18.3}{3} = 6.10$$

**(b) Linear model**
Means: $\\bar x = (10+20+30+40+50)/5 = 30$, $\\bar y = 30.6 / 5 = 6.12$.

| $x$ | $y$ | $x-\\bar x$ | $y-\\bar y$ | product | $(x-\\bar x)^2$ |
|---|---|---|---|---|---|
| 10 | 5.0 | −20 | −1.12 | 22.4 | 400 |
| 20 | 5.6 | −10 | −0.52 | 5.2 | 100 |
| 30 | 6.1 | 0 | −0.02 | 0 | 0 |
| 40 | 6.6 | 10 | 0.48 | 4.8 | 100 |
| 50 | 7.3 | 20 | 1.18 | 23.6 | 400 |
| | | | **Sum** | **56.0** | **1000** |

$$\\theta_1 = \\frac{56.0}{1000} = 0.056, \\qquad \\theta_0 = 6.12 - 0.056 \\times 30 = 4.44$$
$$\\hat y(33) = 4.44 + 0.056 \\times 33 = 4.44 + 1.848 = 6.29$$

### Answer
- **(a)** 3-NN predicts **6.10**.
- **(b)** The linear model predicts **6.29**.
- **(c)** **k-NN (instance-based)** needs all the training data at prediction time, because it must search for neighbours. The linear model only needs $\\theta_0$ and $\\theta_1$; the data can be discarded after training.

### Takeaway
The answers differ because k-NN averages *nearby* countries (B at 20 pulls it down), while the line uses the *overall trend* of all points. Instance-based = simple, but slow and memory-hungry at prediction time. Model-based = a training step, then fast, compact predictions. *(Session 4 derives the regression formula properly.)*`,
    },
    {
      title: "Batch vs mini-batch vs online: update counts",
      level: "Easy",
      marks: 4,
      question:
        "A training set has 60,000 images. You train for 10 epochs. How many parameter updates happen with (a) batch learning, (b) mini-batch learning with batch size 128, (c) online learning? (d) Which would you choose if the data arrives as a continuous stream and can't be stored?",
      solution: `
### What is being asked
How often the model's parameters get updated under each way of feeding data (slide 40).

### Idea & why
An **epoch** is one full pass through the training data. The number of updates per epoch depends on how much data the model looks at before each update:
- **batch:** all the data → 1 update per epoch
- **mini-batch:** $b$ samples → $\\lceil n / b \\rceil$ updates per epoch (the last batch may be smaller)
- **online:** 1 sample → $n$ updates per epoch

### Formula
$$\\text{total updates} = \\text{updates per epoch} \\times \\text{epochs}$$

### Steps
**(a) Batch:** 1 update per epoch × 10 epochs = **10 updates**

**(b) Mini-batch (128):**
- $60000 / 128 = 468.75$ → 468 full batches + 1 smaller batch
- the smaller batch has $60000 - 468 \\times 128 = 96$ images
- 469 updates per epoch × 10 = **4,690 updates**

**(c) Online:** 60,000 updates per epoch × 10 = **600,000 updates**

**(d) Online learning.** It learns from each item as it arrives and never needs the whole dataset in memory.

### Takeaway
More frequent updates = faster reaction to new data, but each update is based on less information, so it's noisier. Mini-batch balances the two, which is why it's the common default.`,
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
### What is being asked
Quantify the improvement, then explain the trend using over/underfitting.

### Two kinds of “reduction”
- **Absolute** reduction is the plain difference, in **percentage points**: old − new.
- **Relative** reduction is that difference as a share of the old value: $(\\text{old} - \\text{new}) / \\text{old}$.

Examiners check that you know the difference: going from 15.4% to 10.9% is a 4.5-*point* drop, but a 29% *relative* drop.

### Steps
**(a)** The best is 8 layers at 10.9%.
- Absolute: $15.4 - 10.9 = $ **4.5 percentage points**
- Relative: $4.5 / 15.4 = 0.292$ → **29.2% reduction**

**(b)** Errors = WER × number of words.
- Baseline: $0.154 \\times 50000 = 7700$ errors
- Best: $0.109 \\times 50000 = 5450$ errors
- Difference: **2,250 fewer errors**

**(c)** Each extra layer adds parameters, i.e. more **capacity** to fit the data. With the same amount of training data, 10–12 layers start to **overfit** (and deeper networks are also harder to train), so test error creeps up. At the other end, **1 layer (16.0%) is worse than the baseline**: too little capacity, i.e. **underfitting**.

### Takeaway
Model complexity has a sweet spot. Too little → underfit; too much → overfit. You find the sweet spot by measuring on held-out data, exactly as this table does.`,
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
### What is being asked
Walk through a typical cleaning pipeline (slide 46): remove duplicates, handle missing values, split the data. Then think about the side effects.

### Idea & why
- **Duplicates** add no new information and make some examples count double, so we remove them.
- **Missing values** must be handled somehow. Dropping rows is the simplest option but has a cost.
- **Train/validation/test:** train on one part, tune on another, and report the final score on a part never touched before.

### Steps
**(a)** Duplicates $= 1.5\\% \\times 40000 = 600$ → $40000 - 600 = $ **39,400 rows**

**(b)**
- Missing age $= 6\\% \\times 40000 = 2400$ rows. None of them are duplicates, so all 2,400 are still there.
- Remaining: $39400 - 2400 = $ **37,000 rows**
- Lost: $600 + 2400 = 3000$, and $3000 / 40000 = $ **7.5%** of the original data

**(c)**
- Train: $0.70 \\times 37000 = $ **25,900**
- Validation: $0.15 \\times 37000 = $ **5,550**
- Test: **5,550**

**(d)**
- *Alternatives (slide 46):* fill in (impute) age with the median, or the median per customer segment; drop the *feature* if age doesn't matter much; or train one model with age and one without, and compare.
- *Risk:* if the people who skipped age are different from the rest (e.g. mostly younger users), dropping them makes the data **unrepresentative**. That's **sampling bias** introduced by cleaning.

### Takeaway
Cleaning choices change what the model sees. Before dropping data, ask *“are the rows I'm removing different in some way?”*`,
    },
    {
      title: "Sampling noise vs sampling bias",
      level: "Easy",
      marks: 3,
      question:
        "A political poll phones 2 million people from a list of magazine subscribers and car owners, and predicts the wrong winner. A second poll surveys only 50 random citizens and also gets it wrong. Which error is sampling bias and which is sampling noise? How would you fix each?",
      solution: `
### What is being asked
Tell apart the two ways data can be unrepresentative (slide 45).

### How to decide
Ask: *is the method fair, and just the sample too small?* → **noise**. *Is the method itself skewed, whatever the size?* → **bias**.

### Answer
- **Poll 1 → sampling bias.** The *method* is flawed: magazine subscribers and car owners were wealthier than the average voter. With 2 million people, it's precisely wrong. **Fix:** sample from a list that represents the whole population, e.g. stratified random sampling.
- **Poll 2 → sampling noise.** The method is fair (random), but 50 people is too few, so the result swings by chance. **Fix:** increase the sample size.

### Takeaway
More data fixes noise but **not** bias. *(Poll 1 is the famous 1936 Literary Digest poll.)*`,
    },
    {
      title: "Features and polynomial model size",
      level: "Hard",
      marks: 5,
      question:
        "(a) How many parameters does a polynomial regression model of degree $d$ on a single feature have? (b) How many terms (including the bias) does a full degree-2 polynomial on 2 features have? List them. (c) In general, a full degree-$d$ polynomial on $n$ features has $\\binom{n+d}{d}$ terms. Compute this for $n = 3, d = 3$ and $n = 10, d = 3$. (d) You have 20 training points and one feature. What happens with a degree-19 polynomial?",
      solution: `
### What is being asked
How fast model complexity (the number of parameters) grows with the degree and the number of features, and what that means for overfitting.

### Idea & why
Each term in a polynomial has its own coefficient to learn. More terms means more parameters, which means more ability to bend around the data, and more risk of fitting noise.

### Formula
- One feature, degree $d$: $\\theta_0 + \\theta_1 x + \\dots + \\theta_d x^d$ → $d + 1$ parameters.
- $n$ features, all terms up to degree $d$: $\\binom{n+d}{d}$ terms.

### Steps
**(a)** **$d + 1$ parameters:** $\\theta_0, \\theta_1, \\dots, \\theta_d$.

**(b)** Degree 2 on $x_1, x_2$:
- degree 0: $1$
- degree 1: $x_1, x_2$
- degree 2: $x_1^2, x_1x_2, x_2^2$

That's **6 terms**. Check: $\\binom{2+2}{2} = \\binom{4}{2} = 6$ ✓

**(c)**
- $n = 3, d = 3$: $\\binom{6}{3} = \\frac{6 \\cdot 5 \\cdot 4}{3!} = $ **20**
- $n = 10, d = 3$: $\\binom{13}{3} = \\frac{13 \\cdot 12 \\cdot 11}{6} = $ **286**

**(d)** Degree 19 has 20 parameters, one per data point. A curve with as many parameters as points can pass **exactly through every point**, so training error = 0. Between the points it swings wildly and predicts nonsense. That's **extreme overfitting**. Fix: a lower degree, or regularisation.

### Takeaway
Adding features or raising the degree quickly adds parameters. Once the number of parameters approaches the number of data points, the model can memorise instead of learn.`,
    },
  ],

  theory: [
    {
      title: "Key challenges in machine learning",
      pyq: "Midsem Q2(a): “List and briefly explain three key challenges faced in machine learning.”",
      marks: 2,
      question: "List and briefly explain **three** key challenges faced in machine learning.",
      solution: `
### What the examiner wants
Three named challenges, each with a one-line explanation. An example or remedy earns full marks. Show structure by splitting them into **data problems** and **model problems**.

### Model answer
*Data problems*
1. **Insufficient training data.** Most algorithms need thousands of examples. With too few, the model can't learn the real pattern. *Remedy:* collect more data, or use a simpler model.
2. **Non-representative data.** If the training data doesn't look like future cases, the model won't generalise. A small sample causes *sampling noise*; a flawed collection method causes *sampling bias*, even with a big sample.
3. **Poor-quality data.** Missing values, errors and outliers hide the pattern. *Remedy:* clean the data, impute missing values, fix or remove outliers.
4. **Irrelevant features.** Garbage in, garbage out. *Remedy:* feature selection and extraction.

*Model problems*

5. **Overfitting.** The model is too complex, so it memorises noise: great on training data, poor on new data. *Remedy:* regularisation, more data, a simpler model.
6. **Underfitting.** The model is too simple to capture the pattern. *Remedy:* a more powerful model, better features, less regularisation.

### Takeaway
For 2 marks, three of these with one line each is enough. Picking from *both* groups shows you understand that failures come from the data **and** from the model.`,
    },
    {
      title: "Frame a business problem as an ML problem",
      pyq: "Midsem Q2(c): churn prediction, i.e. state problem type, model and metric",
      marks: 2,
      question:
        "A company wants to predict whether a customer will **churn** (leave) in the next month. Frame this as a machine learning problem: state the problem type, an appropriate model choice, and a suitable performance metric, with justification.",
      solution: `
### What the examiner wants
Three decisions, each with a **“because”**: the problem type, the model, the metric.

### Model answer
- **Problem type: supervised binary classification.** Past customers come with a known outcome (churned: yes/no), and the output is one of two categories. In practice it's batch-trained (retrained monthly) and model-based.
- **Features (what E contains):** tenure, monthly charges, number of complaints, usage trend, contract type, late payments.
- **Model: logistic regression** as a baseline. It's simple and interpretable, and it outputs a churn *probability* you can rank customers by. Decision trees, random forests or SVMs are alternatives if it underfits.
- **Metric:** churn data is **imbalanced** (e.g. only 5% churn). Accuracy is misleading: predicting “no churn” for everyone scores 95% and catches nobody. Use **recall** on churners (catch as many as possible for retention offers) balanced with **precision** (don't waste offers), i.e. **F1-score** or ROC-AUC.

### Takeaway
Structure every “frame this as ML” answer as **Type → Model → Metric**, and if the classes are imbalanced, say why accuracy is the wrong metric.`,
    },
    {
      title: "Define ML; traditional programming vs ML",
      marks: 3,
      question:
        "Define machine learning using Tom Mitchell's definition. Explain with a diagram or example how the ML approach differs from traditional programming, using spam filtering.",
      solution: `
### What the examiner wants
The exact definition, the spam example mapped to T/P/E, and a clear contrast between the two approaches, ideally as a table or diagram.

### Model answer
**Definition:** a computer program is said to learn from experience **E** with respect to some task **T** and performance measure **P** if its performance at T, as measured by P, improves with E.

**Spam filter:** T = classify emails as spam/ham; P = % correctly classified; E = emails labelled by users.

\`\`\`flow
Traditional: Data + Rules (written by a person) -> Computer -> Output
ML: Data + Expected outputs (labels) -> Computer -> Program (model)
\`\`\`

| | Traditional | ML |
|---|---|---|
| Input | Data + hand-written rules | Data + expected outputs (labels) |
| Output | Answers | A *model*, which then produces answers |
| Spam | Rules like “contains *free*, *4U*”: a long, brittle list | Learns which words are unusually frequent in spam |
| New spam tricks | A programmer rewrites the rules | Retrain on newly labelled emails |

**Result:** the ML program is shorter, easier to maintain and usually more accurate.

### Takeaway
The one-line contrast to remember: traditional programming turns *rules into answers*; ML turns *answers into rules*.`,
    },
    {
      title: "Supervised, unsupervised, semi-supervised and reinforcement learning",
      marks: 4,
      question:
        "Differentiate between supervised, unsupervised, semi-supervised and reinforcement learning. Give one real-world example and one algorithm for each.",
      solution: `
### What the examiner wants
A comparison table (what data you get, what you learn) with an example and an algorithm for each type.

### Model answer
| Type | Training data | Goal | Example | Algorithm |
|---|---|---|---|---|
| **Supervised** | Inputs **with** labels | Learn $f(x) \\to y$ | House price prediction; spam detection | Linear/logistic regression, SVM, Naive Bayes |
| **Unsupervised** | Inputs **without** labels | Discover hidden structure | Customer segmentation | k-Means, PCA, Apriori |
| **Semi-supervised** | Few labels + many unlabelled | Use the structure to spread labels | Google Photos face tagging | Clustering + a classifier |
| **Reinforcement** | No labels; **rewards** for actions | Learn a *policy* (state → action) that maximises long-term reward | AlphaGo, robot navigation | Q-learning |

### Takeaway
The difference is **what kind of feedback** the system gets: full answers, no answers, a few answers, or rewards.`,
    },
    {
      title: "Batch vs online; instance vs model-based",
      marks: 3,
      question:
        "(a) Compare batch and online learning. When would you prefer online learning? (b) Compare instance-based and model-based learning with an example of each.",
      solution: `
### What the examiner wants
A clear definition of each, when to prefer online learning, and one example for each of instance-based and model-based.

### Model answer
**(a)**
- **Batch learning:** trains on *all* the data at once. To learn from new data it must retrain from scratch, which is simple but costly, and the model doesn't change between retrains.
- **Online (incremental) learning:** learns from one instance (or a small mini-batch) at a time, as data arrives.
- **Prefer online** when data arrives as a continuous stream (stock prices, sensors), when the environment changes quickly, or when the data is too big for memory. *Risk:* bad incoming data quietly degrades the model, so it needs monitoring.

**(b)**
- **Instance-based:** memorise the training examples and predict by similarity to them. *Example:* k-NN. It must keep all the data, and prediction is slower.
- **Model-based:** learn a model's parameters from the data, then predict with the model. *Example:* linear regression $y = \\theta_0 + \\theta_1 x$. The data can be discarded after training, and prediction is fast.

### Takeaway
Batch/online is about **when the model learns**. Instance/model-based is about **how it predicts**.`,
    },
    {
      title: "Why use a validation set and cross-validation?",
      marks: 3,
      question:
        "Why can't we evaluate a model on its training data? Explain the hold-out validation set and k-fold cross-validation. What problem does k-fold solve?",
      solution: `
### What the examiner wants
Why training error misleads, how each method works, and the specific weakness of a single split that k-fold removes.

### Model answer
- **Training error is too optimistic.** A complex model can memorise the training data (overfit) and still fail on new data. We need an estimate of performance on **unseen** data.
- **Hold-out validation:** randomly set aside 20–30% of the data, train on the rest, evaluate on the held-out part, and pick the best model. *Weakness:* the score depends on **which** points happened to be held out (a lucky or unlucky split), and less data is left for training.
- **K-fold CV:** split the data into K folds. Train on K−1 folds, validate on the remaining one, and repeat K times so each fold is validated once. **Average** the K scores (K = 10 is common).
- **What it solves:** the estimate no longer depends on one particular split, and every point is used for both training and validation. *Cost:* K times the training.
- The final **test set** is used only once, at the very end.

### Takeaway
Validation answers the question “how will this do on data it hasn't seen?”. K-fold answers it more reliably by averaging over K different splits.`,
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
      why: "The target is a real number, so it is regression (supervised).",
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
      why: "It compares new points with stored training instances instead of learning parameters.",
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
