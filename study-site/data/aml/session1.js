// AML — Contact Session 1: Introduction to Machine Learning
// Source: CourseFiles/AML/ContactSession1-Introduction.pptx (51 slides)
// Text supports **bold**, `code` and KaTeX math ($inline$, $$display$$).
// Teaching style: each lesson opens with the "why", builds on one running example,
// spells out every abbreviation the first time, and only then gives formulas.
// Solutions: ### What is being asked → ### Why this approach → ### Formula → ### Working → ### Answer → ### Takeaway.

export default {
  title: "Introduction to Machine Learning",
  source: "ContactSession1-Introduction.pptx · 51 slides",
  overview:
    "We'll build this session up one question at a time, the way I would in a classroom. **Why** do we need machine learning at all? **How** do we describe a learning problem precisely? **What kinds** of learning are there? **Why** do ML systems fail, and **how** do we check whether a model is any good? For each idea I'll first tell you why we need it, then show you how it works on a real example. Every abbreviation is spelled out the first time it appears, and there's a glossary at the end you can keep coming back to.",

  summary: [
    {
      id: "course",
      heading: "Before we start: course logistics",
      slides: "2",
      blocks: [
        {
          type: "table",
          head: ["Component", "Weight"],
          rows: [["Mid-semester exam", "30%"], ["Assignments", "30%"], ["Comprehensive exam", "40%"]],
        },
        {
          type: "p",
          text: "**Our running example for this session.** Imagine you've just joined the analytics team at a bank. Your manager says: *“Fraudsters are stealing from our customers' cards. Build something that flags suspicious transactions.”* We'll keep coming back to this bank as we go, because almost every idea in this session shows up in that one problem.",
        },
      ],
    },
    {
      id: "why",
      heading: "Lesson 1: Why do we even need machine learning?",
      slides: "3–8",
      blocks: [
        {
          type: "p",
          text: "Let's try to solve the bank's problem the old-fashioned way first. You sit with the fraud team and write rules: *if a transaction is above ₹50,000 and happens at 3 a.m. in a new city, flag it.* *If there are more than 5 transactions in 10 minutes, flag it.* It works for a while.",
        },
        {
          type: "p",
          text: "Then three things go wrong. First, the list of rules grows to hundreds, and nobody remembers why rule 147 exists. Second, genuine customers get blocked: a person on holiday in Goa trips half your rules. Third, and worst, the fraudsters **adapt**. They learn your limits and start making transactions of ₹49,000 at 11 p.m. You're back to writing rules, forever.",
        },
        {
          type: "p",
          text: "Now try a different approach. The bank already has millions of **past transactions**, and for each one it knows the answer: was it fraud or not? Instead of writing rules, you show the computer all these examples and let it **work out the rules for itself**, including patterns no human would think of, like a particular combination of merchant type, time and amount. When fraudsters change tactics, you retrain on the new examples. You write no new rules.",
        },
        {
          type: "p",
          text: "That second approach is **machine learning (ML)**. The slides tell exactly the same story with **spam filtering** (slides 6–7). A hand-written spam filter looks for words like “4U”, “credit card”, “free” and “amazing”. It becomes a long list of complex rules that is hard to maintain. An ML filter instead learns which words appear **unusually often in spam compared with normal mail** (called “ham”). Its program is shorter, easier to maintain, and usually more accurate.",
        },
        { type: "diagram", name: "tradVsMl" },
        {
          type: "p",
          text: "The diagram sums up the difference. In **traditional programming** you give the computer *data + a program (the rules)* and it produces *output*. In **machine learning** you give it *data + the expected output* and it produces *the program*. We call that learnt program a **model**. Once you have the model, you use it like any program: feed in a new transaction and it outputs “fraud” or “not fraud”.",
        },
        {
          type: "p",
          text: "**Some problems can't be written as rules at all.** Slide 8 shows handwritten digits. Try writing a rule for what makes a “2”: a curve on top, a slanted line, a flat base? Some people's “2” looks like a “3”, others like a “7”. You recognise them instantly, but you can't explain *how*. When humans can do something but can't write down the rules, learning from examples is the only practical option. Face unlock on your phone, Google's voice typing and doctors' X-ray assistants all exist for this reason.",
        },
        {
          type: "callout",
          kind: "idea",
          title: "In one line",
          text: "Traditional programming turns **rules into answers**. Machine learning turns **answers (examples) into rules**.",
        },
      ],
    },
    {
      id: "tpe",
      heading: "Lesson 2: How do we describe a learning problem precisely? (T, P, E)",
      slides: "4–5",
      blocks: [
        {
          type: "p",
          text: "“Build something that catches fraud” is a wish, not a problem you can solve. Before you write any code, you need to pin down three things: *what exactly should the system do*, *how will we know if it's doing well*, and *what will it learn from*. Without these, two people can build completely different systems and both claim success.",
        },
        {
          type: "p",
          text: "The slides give three definitions of ML, from informal to precise. The **informal** one: the science (and art) of programming computers so they can *learn from data*. **Arthur Samuel's** (1959): the field of study that gives computers the ability to learn *without being explicitly programmed*. And the one to write in exams, **Tom Mitchell's**:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Mitchell's definition",
          text: "A computer program is said to **learn** from **experience E** with respect to some **task T** and **performance measure P**, if its performance at T, as measured by P, **improves with E**.\n\nA well-defined learning problem is the triple $\\langle T, P, E \\rangle$.",
        },
        {
          type: "p",
          text: "Let's unpack each letter with our bank:",
        },
        {
          type: "list",
          items: [
            "**T, the Task:** what the system has to *do*. Always phrase it with a verb. *Classify each card transaction as fraud or genuine.*",
            "**P, the Performance measure:** a *number* that tells you how well it does T. *The percentage of fraudulent transactions that get caught.* It must be something you can actually compute; “works well” is not a P.",
            "**E, the Experience:** the *data it learns from*. *Two years of past transactions, each labelled fraud or genuine by the investigations team.*",
          ],
        },
        {
          type: "p",
          text: "The word “learns” has a precise meaning here: **as E grows, P gets better**. If feeding the system more past transactions doesn't catch more fraud, it isn't learning.",
        },
        {
          type: "p",
          text: "**Why P needs care.** Suppose only 1 in 1,000 transactions is fraud. A lazy system that says “genuine” for everything is right 99.9% of the time, but it catches zero fraud. So for the bank, “% of transactions classified correctly” is a poor P. “% of frauds caught” is much better. Choosing P is about asking **which mistake hurts more**. We'll come back to this in Session 3 (precision and recall).",
        },
        {
          type: "table",
          caption: "The four ⟨T, P, E⟩ examples from slide 5",
          head: ["Task T", "Performance P", "Experience E"],
          rows: [
            ["Playing checkers", "% of games won against an arbitrary opponent", "Practice games against itself"],
            ["Recognising handwritten words", "% of words correctly classified", "Database of human-labelled images of handwritten words"],
            ["Driving on four-lane highways using vision sensors", "Average distance travelled before a human-judged error", "Images and steering commands recorded while watching a human driver"],
            ["Categorising email as spam or legitimate", "% of emails correctly classified", "Database of emails, some with human-given labels"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Try it yourself: a food-delivery app",
          text: "Swiggy or Zomato shows you “Arriving in 32 minutes”. What's the ⟨T, P, E⟩?\n\n- **T:** predict the delivery time (in minutes) for a new order.\n- **P:** average number of minutes the prediction is off by, across orders.\n- **E:** millions of past orders with restaurant, distance, time of day, weather, and the actual delivery time.\n\nNotice that P is a number you can compute, and E is data the company really has.",
        },
      ],
    },
    {
      id: "when",
      heading: "Lesson 3: When should we use ML, and when not?",
      slides: "9–12",
      blocks: [
        {
          type: "p",
          text: "ML isn't magic, and it isn't always the right tool. Calculating GST on an invoice needs no ML; the rule is known exactly and never changes. So how do you decide? Slide 11 gives four situations where ML shines. Ask these questions about any problem:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Does the existing solution need lots of hand-tuning or a long list of rules?** Spam filtering and our fraud rules are classic cases. ML replaces the rule list with learnt patterns.",
            "**Is it a complex problem where humans can't explain their own reasoning?** Recognising faces, understanding speech, reading handwriting. We can do it but can't write the rules.",
            "**Does the environment keep changing?** Fraud patterns, customer tastes and news topics shift every month. An ML system adapts by retraining on fresh data; a rule-based system needs a programmer.",
            "**Do you want insight from a large, complex dataset?** This is **data mining**. When you let ML dig through data, it can reveal patterns nobody suspected. For example, a retailer finds that customers who buy baby products on weekdays tend to switch brands after 3 months. Here **ML helps humans learn** (slide 10).",
          ],
        },
        {
          type: "p",
          text: "**Typical scenarios (slide 9)** fall into four families: recognising **patterns** (faces, handwriting, medical images), spotting **anomalies** (unusual credit-card transactions, strange sensor readings in a nuclear power plant), **predicting** from time series (stock prices, currency exchange rates), and **generating** new patterns (images, motion sequences).",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Where does ML fit? (slide 12)",
          text: "Think of nested circles: **Artificial Intelligence (AI) ⊃ Machine Learning (ML) ⊃ Deep Learning (DL)**. AI is the broad goal of making machines behave intelligently (including hand-written rule systems). ML is the part of AI that learns from data. DL is the part of ML that uses neural networks with many layers. ML also overlaps with statistics, data mining, pattern recognition and optimisation.",
        },
      ],
    },
    {
      id: "apps",
      heading: "Lesson 4: What kinds of problems does ML solve?",
      slides: "13–24",
      blocks: [
        {
          type: "p",
          text: "Once you've decided to use ML, the next question is *what shape is the answer?* This matters because it decides which algorithms you can use. Slide 15 says nearly every application falls into one of two classes.",
        },
        {
          type: "p",
          text: "**Class 1: assign an object or event to a value.** The system looks at one thing and gives one answer. The *type* of answer gives it a name:",
        },
        {
          type: "list",
          items: [
            "If the answer comes from a **fixed set of categories**, it's **classification**. *Fraud or genuine. Spam or ham. Which digit, 0 to 9. Which disease.*",
            "If the answer is a **real number**, it's **regression**. *Tomorrow's temperature. A flat's price in Bengaluru. Next quarter's sales. The delivery time.*",
          ],
        },
        {
          type: "p",
          text: "A quick test: **can you list every possible answer in advance?** If yes, it's classification. If the answer could be 31.4 or 31.41 or 31.415, it's regression.",
        },
        {
          type: "p",
          text: "**Class 2: predict a sequence of steps to reach a goal (slide 18).** Here there's no single answer. The system has to keep *acting*: choosing chess moves, steering a car, flying a drone, controlling a robot or a video-game character. Each action changes the situation, and success is only known at the end. This is the territory of **reinforcement learning**, which we meet in Lesson 5.",
        },
        {
          type: "p",
          text: "**Where you see it (slides 16–17, 24).** Classification: medical diagnosis, credit-card fraud, network intrusion (worm) detection, spam filtering, recommending articles, books, movies or music, DNA sequences, spoken words, handwritten letters, astronomical images. Other modern uses: Optical Character Recognition (OCR, reading text from scanned documents), spotting faulty products on a production line, detecting tumours in brain scans, categorising news, flagging offensive comments, summarising documents, chatbots, customer segmentation, recommendation systems and revenue forecasting.",
        },
        {
          type: "p",
          text: "**A real result worth understanding (slide 20).** Researchers used deep neural networks for speech recognition and measured the **Word Error Rate (WER)**: the percentage of words the system gets wrong, so lower is better. The older method, a **Gaussian Mixture Model (GMM)**, scored 15.4%.",
        },
        {
          type: "table",
          caption: "Zeiler et al., 2013. Baseline GMM WER = 15.4%",
          head: ["Number of hidden layers", "1", "2", "4", "8", "10", "12"],
          rows: [["Word error rate %", "16.0", "12.8", "11.4", "**10.9**", "11.0", "11.1"]],
        },
        {
          type: "p",
          text: "Read it slowly. With **1 layer** the network (16.0%) is actually *worse* than the old method, because it's too simple to capture speech. Adding layers helps a lot, down to **10.9% at 8 layers**. Then something interesting happens: 10 and 12 layers are slightly *worse* again. More complexity stopped helping and started to hurt. Hold on to this pattern. In Lesson 8 you'll see it has a name: **underfitting** on the left, **overfitting** creeping in on the right.",
        },
      ],
    },
    {
      id: "supervision",
      heading: "Lesson 5: What kind of feedback does the model learn from?",
      slides: "25–39",
      blocks: [
        {
          type: "p",
          text: "Every learner needs feedback. A student learns faster with an answer key than without one. ML is the same, and the **type of feedback available** is the first way the slides classify ML systems. There are four possibilities.",
        },
        { type: "p", text: "#### Supervised learning: learning with an answer key" },
        {
          type: "p",
          text: "Every training example comes with the correct answer, called its **label**. Our bank's past transactions, each marked fraud or genuine, are exactly this. Formally (slides 28–29): given pairs $(x_1, y_1), (x_2, y_2), \\dots, (x_n, y_n)$, learn a function $f(x)$ that predicts $y$ from $x$. Here $x$ is the **input** (the transaction's details) and $y$ is the **label** (fraud or not).",
        },
        {
          type: "p",
          text: "It comes in the two flavours from Lesson 4. **Regression** when $y$ is a real number: slide 28 predicts the September Arctic sea-ice extent (in millions of km²) from the year. **Classification** when $y$ is a category: slides 29–30 predict whether a tumour is benign (0) or malignant (1) from its size.",
        },
        {
          type: "p",
          text: "The tumour example shows how simple a learnt classifier can be. Put tumour sizes on a number line. Benign ones cluster on the left, malignant ones on the right. The model learns a single cut-off **T** and the rule: *if size > T, predict malignant; otherwise benign*. “Training” here just means finding the best T from the labelled examples.",
        },
        {
          type: "p",
          text: "**One measurement is rarely enough (slide 31).** Doctors also look at the patient's age, clump thickness, uniformity of cell size and shape, and more. Each measurement is a **feature**, one dimension of $x$. With two features, the cut-off point becomes a **line** dividing the plane. With three or more, it becomes a flat surface called a **hyperplane**. Same idea, more dimensions. Our fraud model might use 30 features: amount, time, merchant type, distance from home, and so on.",
        },
        {
          type: "p",
          text: "**Supervised algorithms you'll study (slide 32):** linear regression, logistic regression, Naïve Bayes, Support Vector Machines (SVMs), decision trees and random forests, neural networks.",
        },
        { type: "p", text: "#### Unsupervised learning: no answer key at all" },
        {
          type: "p",
          text: "Now suppose the bank's marketing team hands you 10 lakh customer records and asks, *“What kinds of customers do we have?”* Nobody has labelled anyone. There's no right answer to learn from. The goal is to **discover hidden structure** in the inputs $x_1, \\dots, x_n$ alone (slide 33). The main tasks (slide 34):",
        },
        {
          type: "list",
          items: [
            "**Clustering:** group similar items together. The algorithm might find “young salaried, heavy UPI users”, “retired, fixed-deposit savers” and “small-business owners”. Algorithms: k-Means, Hierarchical Cluster Analysis, Expectation Maximisation. Other uses: grouping people by genetic similarity (slide 36), market segmentation, social-network analysis, organising computing clusters, astronomy.",
            "**Visualisation and dimensionality reduction:** squeeze many features down to 2 or 3 so you can plot the data, while keeping similar points close together (slide 35). Algorithms: Principal Component Analysis (PCA), Kernel PCA, Locally Linear Embedding (LLE), t-distributed Stochastic Neighbour Embedding (t-SNE). The slide's t-SNE plot of images puts animals in one region and vehicles in another, although it was never told which is which.",
            "**Association rule learning:** find items that go together. Supermarket data reveals “customers who buy bread and butter often buy milk”, which is why they're shelved near each other. Algorithms: Apriori, Eclat.",
          ],
        },
        { type: "p", text: "#### Semi-supervised learning: a few answers, lots of unlabelled data" },
        {
          type: "p",
          text: "Labelling is expensive. The bank's investigators can only review a few thousand transactions a month, but millions happen. So you often have a *little* labelled data and a *lot* of unlabelled data. Semi-supervised learning uses both. Slide 38's example is **Google Photos**: it first *clusters* your photos by face (unsupervised). You name one person once (a label), and it labels every photo in that cluster (supervised).",
        },
        { type: "p", text: "#### Reinforcement learning: learning by trial and reward" },
        {
          type: "p",
          text: "The fourth type has no labels at all, only **rewards**. A learner, called the **agent**, observes the situation (the **state**), takes an **action**, and gets a positive or negative **reward**. Over many attempts it learns the best strategy, called a **policy**: a mapping from *state → action* that collects the most reward over time (slide 39). It's how you train a dog with treats, or how you learn to ride a bicycle by falling. Examples: AlphaGo learning Go, a robot finding its way out of a maze, balancing a pole on your hand. This is the Class 2 (“sequence of steps”) problem from Lesson 4.",
        },
        {
          type: "table",
          caption: "Summary: the type of feedback decides the type of learning",
          head: ["Type", "What you're given", "What it learns", "Real-world example"],
          rows: [
            ["**Supervised**", "Inputs **with labels**", "A function $f(x) \\approx y$", "Fraud detection, house prices, spam"],
            ["**Unsupervised**", "Inputs only", "Hidden structure (groups, patterns)", "Customer segments, market-basket rules"],
            ["**Semi-supervised**", "A few labels + many unlabelled inputs", "Uses the structure to spread the labels", "Google Photos face tagging"],
            ["**Reinforcement**", "Rewards for actions", "A **policy**: state → best action", "AlphaGo, robot navigation"],
          ],
        },
      ],
    },
    {
      id: "batch",
      heading: "Lesson 6: How is data fed in, and how are predictions made?",
      slides: "40–41",
      blocks: [
        {
          type: "p",
          text: "The type of feedback is only one way to describe an ML system. The slides add two more questions that are **completely separate** from the first. Think of them as two more labels you can stick on any system.",
        },
        { type: "p", text: "#### How is the training data fed in? Batch vs online (slide 40)" },
        {
          type: "p",
          text: "Picture a teacher who wants to improve their teaching using students' answer sheets.",
        },
        {
          type: "list",
          items: [
            "**Batch learning:** the teacher reads **all 1,000 sheets**, then adjusts their teaching once. The model trains on **all available data at once**. When new data arrives, it must be **retrained from scratch** on old + new data. That's simple, but slow and memory-hungry, so it's typically done on a schedule (say, every Sunday night).",
            "**Mini-batch learning:** read **50 sheets**, adjust, read the next 50, adjust again. The model uses **a subset of the data at a time**. This is the practical middle ground most modern systems use.",
            "**Online (incremental) learning:** adjust after **every single sheet**. The model updates on **one instance at a time**, as it arrives. This suits data that **streams in continuously** (stock prices, sensor readings, clicks), environments that **change quickly**, and datasets **too large to fit in memory**. The risk: if garbage starts arriving (say a broken sensor), the model quietly gets worse, so it must be monitored.",
          ],
        },
        {
          type: "p",
          text: "For our bank: fraud patterns change weekly, and transactions stream in all day. An online (or frequently retrained) model makes sense.",
        },
        { type: "p", text: "#### How does it make a prediction? Instance-based vs model-based (slide 41)" },
        {
          type: "p",
          text: "Imagine two property agents estimating the price of a flat.",
        },
        {
          type: "list",
          items: [
            "**Agent A says:** *“Let me find the 5 most similar flats sold recently in this area and average their prices.”* That's **instance-based learning**. The system **remembers the training examples themselves** and compares each new case with them using a similarity measure. The classic algorithm is **k-Nearest Neighbours (k-NN)**: find the k most similar stored examples and copy their answer. There's no real training step, but every prediction means searching through all the stored data.",
            "**Agent B says:** *“From years of data I know price ≈ ₹20 lakh + ₹8,000 per square foot.”* That's **model-based learning**. The system **studies the data, builds a model** (here a straight line, $y = \\theta_0 + \\theta_1 x$) and learns its **parameters** ($\\theta_0$, $\\theta_1$). After training, the data can be thrown away. Predictions just plug into the formula, so they're fast.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Students often mix these up",
          text: "The three questions are **independent**:\n\n1. *Supervised / unsupervised / semi-supervised / reinforcement* is about the **type of feedback** (labels).\n2. *Batch / online* is about **how data is fed in** during training.\n3. *Instance-based / model-based* is about **how predictions are made**.\n\nEvery system has an answer to all three. A spam filter that updates each time you click “Report spam” and learns a weight per word is **supervised + online + model-based**.",
        },
      ],
    },
    {
      id: "data",
      heading: "Lesson 7: Why do ML projects fail? Part 1: bad data",
      slides: "42–47",
      blocks: [
        {
          type: "p",
          text: "You've built your fraud model. It looked great in testing, but in production it misses obvious frauds and blocks genuine customers. What went wrong? There are only **two** broad possibilities: the **data** was bad, or the **model** was wrong for the data. This lesson is about the data. Slide 43 lists four data problems.",
        },
        {
          type: "p",
          text: "**1. Not enough data (slide 44).** A child learns what an apple is from a few examples. Algorithms are far hungrier: they typically need **thousands** of examples even for simple problems, and millions for images or speech. There's a famous finding called *the unreasonable effectiveness of data*: given enough data, quite different algorithms end up performing about the same. The slide turns this into a practical **trade-off**: should you spend time building a cleverer algorithm, or collecting more data?",
        },
        {
          type: "p",
          text: "**2. Data that doesn't represent reality (slide 45).** Your training data must look like the cases the model will face later. If the bank trained only on transactions from metro cities, the model has never seen normal rural spending patterns and may flag them as fraud. There are two different ways data can be unrepresentative, and exams love to ask which is which:",
        },
        {
          type: "list",
          items: [
            "**Sampling noise:** the sample is **too small**, so it's unrepresentative *by chance*. Ask 10 random people their favourite sport and you might happen to get 7 cricket fans and conclude everyone loves cricket. **Fix: collect more data.**",
            "**Sampling bias:** the **way** you collected the data is flawed, so it's unrepresentative *no matter how big it is*. Survey 10 lakh people, but only outside cricket stadiums, and you'll get the same wrong answer, just more confidently. **More data does not fix bias. Only a better collection method does.**",
          ],
        },
        {
          type: "p",
          text: "The slide's example: a model of **life satisfaction vs Gross Domestic Product (GDP) per person**, built using only some countries, suggests that money strongly buys happiness. Add the missing countries (some rich but not so happy, some poorer but happy) and the relationship becomes much weaker. The missing data **exaggerated the role of wealth**.",
        },
        {
          type: "p",
          text: "**3. Poor-quality data (slide 46).** Real data is full of errors, noise, outliers and missing values: a transaction amount typed as ₹5,00,00,000 instead of ₹5,000, a timestamp in the wrong time zone, a missing merchant category. These hide the real pattern. Cleaning is essential, and it's often most of a data scientist's working time. For **outliers**, either discard them or fix them by hand. For **missing values** (the slide's example: 5% of customers didn't give their age), you can **ignore that feature**, **drop those rows**, **fill in** the gaps (e.g. with the median age), or **train one model with the feature and one without** and compare.",
        },
        {
          type: "p",
          text: "**4. Irrelevant features (slide 47).** *Garbage in, garbage out.* If the features have nothing to do with what you're predicting, no algorithm can help. The customer's favourite colour won't predict fraud. The fix is **feature engineering**, which has three parts: **feature selection** (keep only the useful features), **feature extraction** (combine existing features into a more useful one, e.g. “amount ÷ customer's average amount” says far more than the raw amount), and **creating new features by gathering new data** (e.g. adding the device ID used for the transaction).",
        },
      ],
    },
    {
      id: "fit",
      heading: "Lesson 8: Why do ML projects fail? Part 2: the wrong model",
      slides: "47–48",
      blocks: [
        {
          type: "p",
          text: "Even with perfect data, you can pick a model that's too complex or too simple. The easiest way to understand this is to think about three students preparing for the same exam.",
        },
        {
          type: "list",
          items: [
            "**Student A memorises every past-paper answer word for word.** On past papers they score 100%. In the real exam, where the questions are slightly different, they fail. They learnt the *specific answers*, not the *method*.",
            "**Student B only skims the chapter titles.** They do badly on past papers *and* on the real exam. They haven't learnt enough to answer anything.",
            "**Student C works through the concepts.** They do well on past papers and on the real exam, because what they learnt **carries over** to new questions.",
          ],
        },
        {
          type: "p",
          text: "Student A is **overfitting**. The model has learnt the training data *including its noise and quirks*, so it looks brilliant on the data it has seen and fails on new data. Student B is **underfitting**. The model is too simple to capture the real pattern, so it does badly everywhere. Student C **generalises**, which is the whole goal of ML: to do well on data it has *never seen*.",
        },
        {
          type: "p",
          text: "**Why overfitting happens (slide 47).** The model is **too complex for the amount and noisiness of the data**. The slides fit a very high-degree polynomial to the life-satisfaction data. The curve wiggles through every single point, so its training error is tiny, but it makes absurd predictions between the points. In our bank, an overfitted model might learn “a ₹2,317 transaction at a petrol pump in Pune at 4:12 p.m. is fraud”, because that one fraud happened to look like that. It's memorised an example, not learnt a pattern.",
        },
        {
          type: "p",
          text: "**How to fix overfitting:** make the model simpler (fewer parameters), get more training data, reduce noise in the data (fix errors, remove outliers), or apply **regularisation**. Regularisation means putting a **constraint** on the model so it can't bend to fit every point; for example, forcing the slope of a line to stay small. You'll see the maths in Session 4.",
        },
        {
          type: "p",
          text: "**Why underfitting happens (slide 48).** The model is **too simple for the structure in the data**, like fitting a straight line to a clearly curved pattern. **How to fix it:** use a more powerful model (more parameters), give it better features, or **reduce** the regularisation.",
        },
        {
          type: "p",
          text: "**How do you tell which one you have?** Compare the error on the **training data** with the error on **new data the model hasn't seen** (Lesson 9 explains how to get that). Two things to look at: the **level** of the training error, and the **gap** between the two.",
        },
        {
          type: "table",
          caption: "Diagnosing from the two errors",
          head: ["Training error", "Error on unseen data", "Diagnosis", "What to do"],
          rows: [
            ["Low", "**Much higher** (big gap)", "**Overfitting** (Student A)", "Regularise, simplify, get more data"],
            ["**High**", "High, close to training (small gap)", "**Underfitting** (Student B)", "More complex model, better features, less regularisation"],
            ["Low", "Low, close to training", "**Good fit** (Student C)", "Keep it"],
          ],
        },
        {
          type: "p",
          text: "Now look back at the speech-recognition table in Lesson 4. One hidden layer was worse than the baseline: underfitting. Eight layers was the sweet spot. Ten and twelve got slightly worse: overfitting starting. Every time you add complexity, **training error goes down**, but error on new data goes **down, then back up**. The best model sits at the bottom of that curve.",
        },
      ],
    },
    {
      id: "validation",
      heading: "Lesson 9: How do we know if a model is any good? Validation",
      slides: "49–50",
      blocks: [
        {
          type: "p",
          text: "Here's the problem. We care about how the model does on **future** data, which we don't have yet. And we've just seen that the error on the **training** data is misleading: Student A scores 100% on past papers. So how do we get an honest estimate?",
        },
        {
          type: "p",
          text: "**The idea: hide some data from the model.** Before training, set aside a random **20–30%** of your labelled data and don't let the model see it. This held-out part is called the **validation set** (or **development set**, “dev set”). Train on the remaining 70–80%, then measure performance on the validation set. Since the model never saw these examples, its score there is a fair preview of how it will do on new data. It's like a teacher keeping some questions back for a surprise test (slide 50).",
        },
        {
          type: "p",
          text: "The slides make an important point: this estimate is **statistical, not a guarantee**. It relies on the assumption that the validation data looks like the future data (which is why Lesson 7's “representative data” matters so much).",
        },
        {
          type: "p",
          text: "**The weakness of a single split.** Which 20% you happen to hold out affects the score. If, by bad luck, most of the tricky fraud cases land in the validation set, the model looks worse than it is. If they all land in training, it looks better. One split gives one noisy number.",
        },
        {
          type: "p",
          text: "**The fix: K-fold cross-validation (CV).** Instead of one split, do several and average. Split the data into **K equal parts** called **folds**. Hold out fold 1, train on the other K−1 folds, and measure on fold 1. Then hold out fold 2, train on the rest, measure on fold 2. Repeat until **every fold has had one turn** as the validation set. Finally, **average the K scores**. **K = 10** is a common choice.",
        },
        {
          type: "p",
          text: "```flow\nSplit data into K folds -> Round 1: train on folds 2..K, validate on fold 1 -> Round 2: train on all but fold 2, validate on fold 2 -> … -> Round K -> Average the K scores\n```",
        },
        {
          type: "p",
          text: "Why is this better? Every data point is used for validation **exactly once** and for training **K−1 times**, so no example is wasted, and no single lucky or unlucky split dominates the result. The price is that you train **K models** instead of one.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "K-fold arithmetic (you'll need this for numericals)",
          text: "With $n$ samples and $K$ folds:\n\n- each fold has $n / K$ samples\n- each round trains on $n - n/K = n \\cdot \\frac{K-1}{K}$ samples and validates on $n/K$\n- the number of models trained is $K$\n- each sample is validated **once** and trained on **K − 1** times\n\n*Example:* 1,000 samples, 10 folds → 10 models, each trained on 900 and validated on 100.",
        },
        {
          type: "p",
          text: "Finally, keep a separate **test set** that you touch **only once**, at the very end, to report the final score. If you keep checking the test set while tuning, you gradually tune *to* it, and it stops being an honest estimate.",
        },
      ],
    },
    {
      id: "hyper",
      heading: "Lesson 10: How do we choose the model's settings? Hyperparameters",
      slides: "51",
      blocks: [
        {
          type: "p",
          text: "When you use an ML algorithm, some numbers are learnt from the data and some you have to choose yourself. It's important to keep these apart.",
        },
        {
          type: "list",
          items: [
            "**Parameters** are learnt *from the data* during training. The slope $\\theta_1$ and intercept $\\theta_0$ of a line are parameters. So is the weight a spam filter gives the word “free”.",
            "**Hyperparameters** are settings of the *learning algorithm* that you choose *before* training. The degree of the polynomial, the regularisation strength (written $\\lambda$, “lambda”), and the k in k-NN are hyperparameters.",
          ],
        },
        {
          type: "p",
          text: "A cooking analogy: the **recipe settings** you choose (oven temperature, baking time) are hyperparameters. What happens to the cake inside the oven is the learning. You can't know the best oven temperature in advance; you try a few and taste the results.",
        },
        {
          type: "p",
          text: "**How do we choose hyperparameters? (slide 51)** Try different values, measure each one with cross-validation (Lesson 9), and **pick the combination with the best cross-validation score**. The catch is that the number of combinations **multiplies**. Three hyperparameters with 5, 4 and 3 candidate values give $5 \\times 4 \\times 3 = 60$ combinations, and with 5-fold CV each needs 5 training runs: 300 runs. Add one more hyperparameter with 6 values and it's 1,800 runs. Because this grows exponentially, optimisation frameworks exist to search smartly: grid search (try every combination), random search (try a random sample of combinations) and cleverer methods.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Cost of an exhaustive (grid) search",
          text: "$$\\text{training runs} = \\underbrace{(v_1 \\times v_2 \\times \\dots)}_{\\text{combinations}} \\times K \\;+\\; 1$$\n\nwhere $v_i$ is the number of candidate values for hyperparameter $i$, $K$ is the number of CV folds, and the $+1$ is the final re-training of the winning combination on all the data.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in six lines",
          text: "1. ML learns rules from examples; use it when rules are too many, unknown, or keep changing.\n2. Describe any problem as ⟨T, P, E⟩, with P a number you can compute.\n3. Categories → classification; a number → regression; a sequence of actions → reinforcement learning.\n4. Three independent labels: type of feedback · batch/online · instance/model-based.\n5. Failures come from bad data (too little, unrepresentative, dirty, irrelevant) or the wrong model (overfit = big gap; underfit = both errors high).\n6. Judge models on held-out data (validation / K-fold CV) and choose hyperparameters by CV score.",
        },
      ],
    },
  ],

  glossary: [
    ["ML", "Machine Learning", "Programs that learn rules from examples instead of being told the rules"],
    ["AI", "Artificial Intelligence", "The broad goal of making machines behave intelligently; ML is one part of it"],
    ["DL", "Deep Learning", "ML using neural networks with many layers"],
    ["T, P, E", "Task, Performance measure, Experience", "What the system does, the number that measures it, and the data it learns from"],
    ["Model", "—", "The “program” that ML produces from data; used to make predictions"],
    ["Label ($y$)", "Target / desired output", "The correct answer attached to a training example"],
    ["Feature ($x$)", "Attribute / input variable", "One measurable property used as input, e.g. transaction amount"],
    ["Classification", "—", "Predicting a category from a fixed set (fraud / genuine)"],
    ["Regression", "—", "Predicting a real number (price, temperature)"],
    ["Hyperplane", "—", "A flat boundary in many dimensions: a point in 1-D, a line in 2-D, a plane in 3-D"],
    ["Agent, state, action, reward", "Reinforcement-learning terms", "The learner, its situation, what it does, and the feedback it gets"],
    ["Policy", "—", "A reinforcement learner's strategy: which action to take in each state"],
    ["k-NN", "k-Nearest Neighbours", "Predict by averaging (or voting among) the k most similar stored examples"],
    ["$\\theta_0, \\theta_1$", "Theta-zero, theta-one", "Parameters of a line: intercept and slope"],
    ["PCA", "Principal Component Analysis", "Reduces many features to a few while keeping most of the variation"],
    ["LLE", "Locally Linear Embedding", "A dimensionality-reduction method that preserves local neighbourhoods"],
    ["t-SNE", "t-distributed Stochastic Neighbour Embedding", "Squeezes data to 2-D/3-D for plotting, keeping similar points close"],
    ["WER", "Word Error Rate", "% of words a speech recogniser gets wrong (lower is better)"],
    ["GMM", "Gaussian Mixture Model", "An older statistical model, the baseline in the speech example"],
    ["OCR", "Optical Character Recognition", "Reading printed or handwritten text from images"],
    ["GDP", "Gross Domestic Product", "A country's total economic output; per person, a measure of wealth"],
    ["Sampling noise", "—", "Unrepresentative data because the sample is too small (chance)"],
    ["Sampling bias", "—", "Unrepresentative data because the collection method is flawed; more data doesn't help"],
    ["Feature engineering", "—", "Selecting, combining and creating features so they're useful"],
    ["Overfitting", "—", "Memorising the training data: low training error, high error on new data"],
    ["Underfitting", "—", "Too simple: high error on training and new data"],
    ["Regularisation", "—", "A constraint that stops a model from becoming too complex"],
    ["Validation / dev set", "Development set", "Held-out data (20–30%) used to evaluate and compare models"],
    ["CV", "Cross-Validation", "Repeating training/validation on different splits and averaging"],
    ["K-fold CV", "—", "K rounds; each of K folds is the validation set once; average the K scores"],
    ["Test set", "—", "Data used only once, at the end, to report the final performance"],
    ["Hyperparameter", "—", "A setting chosen before training (degree, λ, k), tuned with CV"],
    ["$\\lambda$", "Lambda", "Regularisation strength"],
  ],

  examTips: [
    "For ⟨T, P, E⟩ questions, make **P a number you can compute** and **E the real data source**. If one kind of mistake is costlier (missing fraud, missing a disease), say so and pick P accordingly.",
    "“Which type of learning is this?” → answer **all three questions** (type of feedback, batch/online, instance/model-based) with a one-line reason each.",
    "Overfit vs underfit questions usually give a table of training and validation errors. Look at the **gap** (overfitting) and the **level** (underfitting).",
    "Noise vs bias: noise → sample too small; bias → collection method flawed (a bigger sample doesn't fix it).",
    "K-fold: K models, each trained on (K−1)/K of the data. Grid-search runs = combinations × K (+1 final refit).",
  ],

  problems: [
    {
      title: "Define ⟨T, P, E⟩ for new scenarios",
      hint: "For each system ask: what must it *do* (T)? What *number* shows it's doing well (P)? What *data* does the company already have (E)? Then: can you list every possible output? If yes, classification.",
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
      hint: "Look for key phrases. “Labels / marks as” → supervised. “Reward / penalty” → reinforcement. “Every time / as it arrives” → online. “Most similar” → instance-based. “Learnt weights” → model-based.",
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
      hint: "You only need to test one T between each pair of neighbouring sizes (the midpoints). For each, everything above T is predicted M. Count how many labels disagree.",
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
      hint: "Fold size = n / K. Each round holds out one fold and trains on the rest. How many folds does each sample *not* belong to?",
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
      hint: "Multiply the number of values of each hyperparameter to get the combinations. Each combination is trained K times. Don't forget the final refit.",
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
      hint: "For each degree, look at the *level* of the training error (high → underfit) and the *gap* between validation and training error (big → overfit). Pick the model with the lowest validation error.",
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
      hint: "(a) Find the 3 GDPs closest to 33 and average their y. (b) Build a table with $x-\\bar x$, $y-\\bar y$, their product and $(x-\\bar x)^2$. Slope = sum of products ÷ sum of squares.",
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
      hint: "Updates per epoch: batch = 1, mini-batch = number of batches (round up!), online = number of samples. Multiply by the epochs.",
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
      hint: "Absolute reduction = old − new (in percentage points). Relative reduction = (old − new) ÷ old. Errors = WER × number of words.",
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
      hint: "Do the steps in order: remove duplicates first, then the missing rows (the question tells you they don't overlap). Then take 70%, 15%, 15% of what's left.",
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
      hint: "Ask of each poll: is the *method* fair but the sample too small (noise)? Or is the method itself skewed, whatever the size (bias)?",
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
      hint: "Each term in the polynomial has its own coefficient. List the terms of degree 0, 1 and 2 for (b). For (d), compare the number of parameters with the number of data points.",
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
