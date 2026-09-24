// AML — Contact Session 6: Classification & the Naïve Bayes Classifier
// Source: CourseFiles/AML/ContactSession6-NaiveBayes.pptx (38 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, then formulas with intuition.

export default {
  title: "Classification & the Naïve Bayes Classifier",
  source: "ContactSession6-NaiveBayes.pptx · 38 slides",
  overview:
    "Naïve Bayes appears in **almost every paper** (5 marks in the previous mid-sem, plus a revision-deck question), so this session deserves care. We'll build it from the ground up: **what** a classifier is and the two families (generative vs discriminative), **why** Bayes' theorem lets us “reverse” a probability, **why** the full Bayes classifier breaks down on real data, **how** the naïve independence assumption rescues it, **how** to estimate every probability from a table (including continuous attributes), **what** goes wrong when a count is zero and how Laplace smoothing fixes it, and finally **text classification**. The recipe at the end of Lesson 5 is exactly how to lay out an exam answer.",

  summary: [
    {
      id: "clf",
      heading: "Lesson 1: What is classification, and what kinds of classifiers are there?",
      slides: "2–6",
      blocks: [
        {
          type: "p",
          text: "**Classification (slide 3).** We have a collection of records. Each record is a pair $(x, y)$: $x$ is the **attribute set** (also called features, predictors, independent variables or inputs) and $y$ is the **class label** (also called the response, dependent variable or output). The task: **learn a model that maps each attribute set x to one of a fixed set of class labels y.**",
        },
        {
          type: "table",
          caption: "Slide 3 examples",
          head: ["Task", "Attribute set x", "Class label y"],
          rows: [
            ["Categorising email", "Features from the email header and content", "Spam or non-spam"],
            ["Identifying tumour cells", "Features from X-rays or MRI scans", "Malignant or benign"],
            ["Cataloguing galaxies", "Features from telescope images", "Elliptical, spiral or irregular"],
          ],
        },
        {
          type: "p",
          text: "**The general approach (slide 4)** has two phases. **Induction (training):** learn the model from a training set whose labels are known. **Deduction (inference):** apply the model to new test records to predict their labels.",
        },
        {
          type: "p",
          text: "**Linear vs non-linear classifiers (slide 5).** A **linear classifier** separates the classes with a flat surface: a straight line in 2-D. It computes a weighted sum of the features, and if $\\sum_i w_i x_i \\ge 0$ it predicts one class (y = 1), otherwise the other (y = 0 or −1). The weights $w_i$ are learnt during training and applied during inference. A **non-linear** classifier separates the classes with a curved surface.",
        },
        {
          type: "p",
          text: "**Two families of classifier (slide 6).** Imagine two ways to tell mangoes from apples.",
        },
        {
          type: "list",
          items: [
            "**Generative:** learn *what a typical mango looks like* and *what a typical apple looks like* (their size, colour, shape distributions), and how common each fruit is. For a new fruit, ask *“which class would more likely have produced this?”*. Formally, learn the **class-conditional distribution $P(x \\mid y)$** and the **prior $P(y)$**, then compare classes using Bayes' theorem. The boundary can be linear or non-linear. **Naïve Bayes is generative.**",
            "**Discriminative:** don't model the fruits at all; just learn **the boundary between them**, a function $f$ that maps $x$ directly to y. A linear f gives a linear boundary. **Logistic regression (Session 5) and SVMs (Session 7) are discriminative.**",
          ],
        },
      ],
    },
    {
      id: "bayes",
      heading: "Lesson 2: Why Bayes' theorem? Turning a probability around",
      slides: "8–10",
      blocks: [
        {
          type: "p",
          text: "Here's the problem classification poses. From training data it's easy to count things like *“among spam emails, how often does the word ‘lottery’ appear?”*: that's $P(\\text{lottery} \\mid \\text{spam})$. But what we actually want for a new email is the reverse: *“given that this email contains ‘lottery’, how likely is it to be spam?”*: $P(\\text{spam} \\mid \\text{lottery})$. These are **not the same number**. Bayes' theorem is the tool that turns one into the other.",
        },
        {
          type: "p",
          text: "**Conditional probability (slide 9).** $P(A \\mid B)$ means “the probability of A, given that B has happened”. It's defined as $P(A \\mid B) = \\frac{P(A, B)}{P(B)}$: out of all the cases where B happens, the fraction where A also happens.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Bayes' theorem",
          text: "$$P(Y \\mid X) = \\frac{P(X \\mid Y) \\, P(Y)}{P(X)} \\qquad\\qquad \\text{posterior} = \\frac{\\text{likelihood} \\times \\text{prior}}{\\text{evidence}}$$\n\n- **Prior $P(Y)$:** how common the class is *before* looking at the evidence\n- **Likelihood $P(X \\mid Y)$:** how probable this evidence is *if* the class is Y\n- **Evidence $P(X)$:** how probable this evidence is overall\n- **Posterior $P(Y \\mid X)$:** how probable the class is *after* seeing the evidence",
        },
        {
          type: "callout",
          kind: "example",
          title: "Why the prior matters so much: a medical test",
          text: "A disease affects **1%** of people. A test catches it 95% of the time, $P(+ \\mid D) = 0.95$, but also gives a false positive to 5% of healthy people, $P(+ \\mid \\neg D) = 0.05$. You test positive. What's the chance you're actually ill?\n\nMost people guess 95%. Picture 10,000 people:\n- 100 are ill → 95 test positive\n- 9,900 are healthy → 5% of them, **495**, also test positive\n\nOf the 590 positives, only 95 are ill: $P(D \\mid +) = 95/590 = $ **0.161**, about 16%.\n\nThe likelihood was high (95%), but the **prior was tiny** (1%), and the false positives from the huge healthy group swamp the true ones. Bayes' theorem does this weighing automatically.",
        },
        {
          type: "p",
          text: "**Word problems (revision deck Q4).** When a question gives you some probabilities and asks for the reverse, write down what's known first: P(A), P(B), P(A | B). Then flip with $P(B \\mid A) = P(A \\mid B)P(B)/P(A)$. Example: Vijay has a 60% chance of a Google offer (G) and 50% of a Microsoft offer (M), and $P(G \\mid M) = 0.8$. Then $P(M \\mid G) = 0.8 \\times 0.5 / 0.6 = 0.667$.",
        },
      ],
    },
    {
      id: "full",
      heading: "Lesson 3: Using Bayes to classify, and why the full version breaks",
      slides: "11–17",
      blocks: [
        {
          type: "p",
          text: "**The Bayes classifier (slides 14–15).** Given a record with attributes $X = (X_1, X_2, \\dots, X_d)$, compute the posterior $P(Y \\mid X)$ for **every** class and pick the largest. This is called **Maximum A Posteriori (MAP)** classification.",
        },
        {
          type: "p",
          text: "**A shortcut.** The denominator $P(X)$ is the same for every class, because it only depends on the record, not on the class. So to find the *largest* posterior we can ignore it and just compare the numerators:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "MAP classification",
          text: "$$\\hat y = \\arg\\max_{y} \\; P(y \\mid X) = \\arg\\max_{y} \\; P(X \\mid y) \\, P(y)$$\n\n“$\\arg\\max_y$” means “the value of y that makes this biggest”. If you need actual probabilities, divide each class's score by the sum of all scores at the end (**normalisation**).",
        },
        {
          type: "p",
          text: "**The meningitis example (slides 11–12).** Ten patients, each with Headache (h), Fever (f), Vomiting (v) and whether they had Meningitis (m). A new patient has headache, **no** fever, and vomiting. Using the full Bayes theorem:",
        },
        {
          type: "list",
          items: [
            "Prior: 3 of 10 had meningitis, so $P(m) = 0.3$",
            "Evidence: 6 of 10 patients had exactly (h, ¬f, v), so $P(h, \\neg f, v) = 0.6$",
            "Likelihood by the **chain rule**: $P(h, \\neg f, v \\mid m) = P(h \\mid m) \\times P(\\neg f \\mid h, m) \\times P(v \\mid \\neg f, h, m) = \\frac23 \\times \\frac22 \\times \\frac22 = 0.667$",
            "Posterior: $P(m \\mid h, \\neg f, v) = 0.667 \\times 0.3 / 0.6 = $ **0.33**. Similarly $P(\\neg m \\mid \\dots) = 0.667$.",
          ],
        },
        {
          type: "p",
          text: "**The paradox of the false positive.** The symptoms fit meningitis well (likelihood 0.67), yet it's *twice as likely* the patient doesn't have it. Counter-intuitive, but it's the medical-test story again: **the likelihood is weighted by the prior**, and meningitis is relatively rare.",
        },
        {
          type: "p",
          text: "**Why the full version breaks: data fragmentation (slide 13).** Try another patient: headache, fever, **no** vomiting. The chain rule needs $P(f \\mid h, m)$: among patients with headache *and* meningitis, how many had fever? That subset has 2 patients, and **neither** had fever, so the probability is 0, and the whole posterior becomes $P(m \\mid h, f, \\neg v) = 0$. The model claims it's *certain* the patient doesn't have meningitis, based on a sample of two!",
        },
        {
          type: "p",
          text: "The deeper problem: each extra condition in the chain rule narrows the matching records further. With d attributes you need counts for **every combination of values**, which is exponentially many. Real datasets simply don't have enough rows, so most combinations have zero or tiny counts. The full Bayes classifier is correct in theory but **impossible to estimate** in practice.",
        },
      ],
    },
    {
      id: "nb",
      heading: "Lesson 4: How does the “naïve” assumption rescue it?",
      slides: "18–19",
      blocks: [
        {
          type: "p",
          text: "**Conditional independence (slide 18).** Two things X and Y are **conditionally independent given Z** if, once you know Z, learning Y tells you nothing more about X: $P(X \\mid Y, Z) = P(X \\mid Z)$.",
        },
        {
          type: "p",
          text: "The slide's example: across the whole population, **arm length** and **reading skill** are correlated. Children have short arms and limited reading; adults have long arms and read well. But **fix the age** (look only at 8-year-olds) and there's no relationship between arm length and reading at all. They're conditionally independent **given age**. Age was the hidden common cause.",
        },
        {
          type: "p",
          text: "**The naïve assumption (slide 19).** Naïve Bayes assumes that **all the attributes are conditionally independent given the class**. Then the hard joint likelihood splits into a product of easy single-attribute likelihoods:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The Naïve Bayes classifier",
          text: "$$P(X_1, X_2, \\dots, X_d \\mid y) = P(X_1 \\mid y) \\, P(X_2 \\mid y) \\cdots P(X_d \\mid y) = \\prod_{i=1}^{d} P(X_i \\mid y)$$\n\n$$\\hat y = \\arg\\max_y \\; P(y) \\prod_{i=1}^{d} P(X_i \\mid y)$$\n\n$\\prod$ (capital pi) means “multiply all of these together”.",
        },
        {
          type: "p",
          text: "**Why this is such a relief.** Instead of counting every *combination* of attribute values (exponentially many), we only count **each attribute on its own, within each class**: for d attributes that's just d simple tables per class. And each count uses **all** the records of that class, so the estimates are far more reliable.",
        },
        {
          type: "p",
          text: "**Why “naïve”?** Because the assumption is usually false. In an email, “San” and “Francisco” are obviously not independent. Yet Naïve Bayes classifies surprisingly well, because to pick a class we only need the **ranking** of the scores to be right, not their exact values. Its probability *numbers* can be off, but the *winner* is usually correct.",
        },
        {
          type: "p",
          text: "**Back to meningitis with Naïve Bayes.** For (h, ¬f, v): meningitis score $= \\frac23 \\cdot \\frac23 \\cdot \\frac23 \\cdot 0.3 = 0.089$; no-meningitis score $= \\frac57 \\cdot \\frac47 \\cdot \\frac47 \\cdot 0.7 = 0.163$. Normalised, $P(m \\mid \\dots) = 0.089/(0.089 + 0.163) = $ **0.35**, very close to the full-Bayes 0.33, using only single-attribute counts.",
        },
      ],
    },
    {
      id: "estimate",
      heading: "Lesson 5: How do we estimate the probabilities from a table?",
      slides: "20–24",
      blocks: [
        {
          type: "p",
          text: "Everything Naïve Bayes needs comes from counting in the training table (slide 21):",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Estimates for discrete (categorical) attributes",
          text: "$$P(y) = \\frac{\\text{number of records in class } y}{N} \\qquad P(X_i = c \\mid y) = \\frac{n_c}{n}$$\n\n- $N$ = total number of records\n- $n$ = number of records in class y\n- $n_c$ = number of those records that have $X_i = c$\n\nSlide 21's examples (tax-evasion data, 10 records): $P(\\text{No}) = 7/10$, $P(\\text{Yes}) = 3/10$, $P(\\text{Married} \\mid \\text{No}) = 4/7$, $P(\\text{Refund = Yes} \\mid \\text{Yes}) = 0/3 = 0$.",
        },
        {
          type: "p",
          text: "**Continuous attributes such as income (slides 22–23).** You can't count how many people earn *exactly* ₹1,20,000. Two options:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Discretise:** split the range into bins (low / medium / high), turning the attribute into an ordinal one, then count as usual.",
            "**Assume a normal (Gaussian) distribution for each class:** compute the class's mean μ and variance σ² from the training data, then use the bell-curve formula to get a likelihood for the test value.",
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Gaussian likelihood",
          text: "$$P(X_i = x \\mid y) = \\frac{1}{\\sqrt{2\\pi\\sigma_y^2}} \\exp\\!\\left( -\\frac{(x - \\mu_y)^2}{2\\sigma_y^2} \\right)$$\n\n$\\mu_y$ and $\\sigma_y^2$ are the mean and variance of attribute $X_i$ within class y. **Watch out** whether a question gives the standard deviation σ or the variance σ².\n\nIt's a *density*, not a probability, so it can exceed 1 for very narrow distributions. That's fine: we only compare classes.",
        },
        {
          type: "callout",
          kind: "example",
          title: "The slide-24 tax-evasion example",
          text: "Test record: Refund = No, Married status = Divorced, Income = 120K. Class statistics for income: **No**: μ = 110, σ² = 2975; **Yes**: μ = 90, σ² = 25.\n\n- $P(\\text{Income} = 120 \\mid \\text{No}) = \\frac{1}{\\sqrt{2\\pi \\cdot 2975}} e^{-(120-110)^2/(2 \\cdot 2975)} = 0.0072$\n- $P(\\text{Income} = 120 \\mid \\text{Yes}) = \\frac{1}{\\sqrt{2\\pi \\cdot 25}} e^{-(120-90)^2/50} = 1.2 \\times 10^{-9}$ (120 is 6 standard deviations from 90)\n\nThen:\n- $P(X \\mid \\text{No}) = \\frac47 \\times \\frac17 \\times 0.0072 = 0.0006$\n- $P(X \\mid \\text{Yes}) = 1 \\times \\frac13 \\times 1.2 \\times 10^{-9} = 4 \\times 10^{-10}$\n\nSince $P(X \\mid \\text{No})P(\\text{No}) \\gg P(X \\mid \\text{Yes})P(\\text{Yes})$, the class is **No**.",
        },
        {
          type: "callout",
          kind: "exam",
          title: "The exam recipe (use this layout every time)",
          text: "1. **Priors:** count each class. Write $P(\\text{Yes}) = \\dots$, $P(\\text{No}) = \\dots$\n2. **Likelihood table, for the query's values only:** one row per attribute value in the query; columns P(· | Yes) and P(· | No), as fractions.\n3. **Scores:** prior × product of its column, for each class.\n4. **Normalise** if probabilities are asked: $P(\\text{Yes} \\mid X) = \\frac{s_{\\text{Yes}}}{s_{\\text{Yes}} + s_{\\text{No}}}$.\n5. **State the prediction:** “Predicted class: Yes (0.80)”. If any likelihood was 0, **say so** and mention Laplace smoothing.",
        },
        {
          type: "p",
          text: "**The football practice example (slides 35–38)** follows exactly this recipe. Query: rainy weather, won 2 of the last 3, normal humidity, won the toss. Win score $= \\frac29 \\cdot \\frac49 \\cdot \\frac69 \\cdot \\frac39 \\cdot \\frac{9}{14} = 0.01411$; lose score $= \\frac35 \\cdot \\frac25 \\cdot \\frac15 \\cdot \\frac35 \\cdot \\frac{5}{14} = 0.01029$. Normalised: $P(\\text{win}) = 0.01411/(0.01411 + 0.01029) = $ **0.578** and $P(\\text{lose}) = $ **0.422**.",
        },
      ],
    },
    {
      id: "zero",
      heading: "Lesson 6: What if a count is zero? Laplace smoothing",
      slides: "25–26, 31–32",
      blocks: [
        {
          type: "p",
          text: "Look back at slide 21: $P(\\text{Refund = Yes} \\mid \\text{Yes}) = 0$, because no tax-evader in the training data had claimed a refund. Now suppose a test record *has* Refund = Yes. The product for the Yes class includes that 0, so **the whole score becomes 0, whatever the other attributes say**. One unseen combination vetoes all the other evidence.",
        },
        {
          type: "p",
          text: "It can get worse (slide 25). Delete record 7 from the table and classify (Refund = Yes, Divorced, 120K). Now $P(\\text{Divorced} \\mid \\text{No}) = 0$ as well, so **both** classes score 0. Naïve Bayes can't classify the record at all.",
        },
        {
          type: "p",
          text: "**The fix: never let a count be zero (slide 26).** Just because something didn't happen in a small training set doesn't mean it's impossible. **Laplace smoothing** adds 1 to every count. To keep the probabilities adding up to 1, it also adds v (the number of possible values) to the denominator:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Probability estimates",
          text: "| Estimate | Formula |\n|---|---|\n| Original | $\\dfrac{n_c}{n}$ |\n| **Laplace** (add-one) | $\\dfrac{n_c + 1}{n + v}$ |\n| m-estimate (general) | $\\dfrac{n_c + m \\, p}{n + m}$ |\n\n- $n$ = records in class y; $n_c$ = those with $X_i = c$\n- $v$ = number of distinct values attribute $X_i$ can take\n- $p$ = a prior guess for the probability; $m$ = how much weight to give that guess",
        },
        {
          type: "p",
          text: "**Example.** Hair colour has 3 values (blond, dark, red). Class C2 has 3 records, none with dark hair. Without smoothing, $P(\\text{dark} \\mid C2) = 0/3 = 0$. With Laplace, $(0 + 1)/(3 + 3) = 1/6$. Small, but not zero. Check that it's still a valid distribution: if C2's counts were blond 2, red 1, dark 0, the smoothed values are 3/6, 2/6 and 1/6, which add up to 1 ✓.",
        },
      ],
    },
    {
      id: "text",
      heading: "Lesson 7: Where is Naïve Bayes used? Text classification",
      slides: "27–34",
      blocks: [
        {
          type: "p",
          text: "Naïve Bayes shines on text: spam filters, sentiment analysis (is this review positive?), news categorisation. Why? Text has thousands of features (one per word), and NB handles huge numbers of features cheaply and needs little training data.",
        },
        {
          type: "p",
          text: "**Bag of words (slide 29).** Represent a document by **how many times each word appears**, ignoring word order entirely, as if you'd cut the text into words and shaken them in a bag. “Dog bites man” and “man bites dog” become the same bag. NB then treats each word as independent given the class.",
        },
        {
          type: "p",
          text: "**The slide-30 example.** Five training sentences: “A great game” (Sports), “The election was over” (Not sports), “Very clean match” (Sports), “A clean but forgettable game” (Sports), “It was a close election” (Not sports). Which tag fits **“A very close game”**?",
        },
        {
          type: "p",
          text: "Applying Bayes, we need $P(\\text{a} \\mid S) \\cdot P(\\text{very} \\mid S) \\cdot P(\\text{close} \\mid S) \\cdot P(\\text{game} \\mid S) \\cdot P(S)$. But **“close” never appears in a Sports sentence**, so $P(\\text{close} \\mid \\text{Sports}) = 0$ and Sports scores 0, even though “game” is obviously a sports word. Laplace to the rescue (slides 31–32).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Laplace smoothing for words",
          text: "$$P(w \\mid c) = \\frac{\\text{count}(w, c) + 1}{\\text{total words in class } c + |V|}$$\n\n$|V|$ = vocabulary size (number of distinct words across all training text). Here Sports has 11 words, Not sports has 9, and $|V| = 14$: {a, great, very, over, it, but, game, election, clean, close, the, was, forgettable, match}.\n\n| Word | P(word \\| Sports) | P(word \\| Not sports) |\n|---|---|---|\n| a | (2+1)/(11+14) = 3/25 | (1+1)/(9+14) = 2/23 |\n| very | (1+1)/25 = 2/25 | (0+1)/23 = 1/23 |\n| close | (0+1)/25 = 1/25 | (1+1)/23 = 2/23 |\n| game | (2+1)/25 = 3/25 | (0+1)/23 = 1/23 |",
        },
        {
          type: "p",
          text: "Multiplying out (Numerical Q3): Sports ≈ 2.76 × 10⁻⁵, Not sports ≈ 5.72 × 10⁻⁶, so **Sports**, with a posterior of about 0.83.",
        },
        {
          type: "p",
          text: "**How well does it work? (slides 33–34).** On the 20 Newsgroups dataset (1,000 training documents from each of 20 discussion groups, such as comp.graphics, rec.sport.hockey and sci.space), Naïve Bayes reaches **89% accuracy**. The learning curve (with 1/3 held out for testing) shows accuracy rising as the training set grows.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in six lines",
          text: "1. Generative models learn P(x | y) and P(y) (Naïve Bayes); discriminative models learn P(y | x) or the boundary (logistic regression, SVM).\n2. Bayes: posterior = likelihood × prior / evidence. A high likelihood can still give a low posterior if the prior is small (false-positive paradox).\n3. MAP: pick the class maximising P(X | y)P(y); P(X) can be ignored. Full Bayes needs joint counts, which fragment to zero.\n4. Naïve assumption: attributes conditionally independent given the class, so $P(X \\mid y) = \\prod P(X_i \\mid y)$.\n5. Estimate by counting ($n_c/n$); continuous attributes by binning or a per-class Gaussian. Recipe: priors → query likelihoods → products → normalise → state the class.\n6. A zero count kills the product: Laplace $(n_c + 1)/(n + v)$. Text: bag of words, $(\\text{count} + 1)/(\\text{words in class} + |V|)$.",
        },
      ],
    },
  ],

  glossary: [
    ["x, y", "Attribute set, class label", "The record's features, and the category to predict"],
    ["Induction / deduction", "Training / inference", "Learning the model; applying it to new records"],
    ["Linear classifier", "—", "Separates classes with a flat boundary: predict 1 if $\\sum w_i x_i \\ge 0$"],
    ["Generative model", "—", "Learns P(x | y) and P(y), classifies with Bayes (Naïve Bayes)"],
    ["Discriminative model", "—", "Learns P(y | x) or the boundary directly (logistic regression, SVM)"],
    ["P(A | B)", "Conditional probability", "Probability of A given that B happened: P(A, B)/P(B)"],
    ["P(A, B)", "Joint probability", "Probability that A and B both happen"],
    ["Prior P(y)", "—", "How common the class is before seeing the evidence"],
    ["Likelihood P(x | y)", "—", "How probable the evidence is if the class is y"],
    ["Evidence P(x)", "—", "How probable the evidence is overall (same for every class)"],
    ["Posterior P(y | x)", "—", "How probable the class is after seeing the evidence"],
    ["MAP", "Maximum A Posteriori", "Pick the class with the highest posterior"],
    ["arg max", "Argument of the maximum", "The value that makes an expression largest"],
    ["Chain rule", "—", "$P(a, b, c \\mid m) = P(a \\mid m)P(b \\mid a, m)P(c \\mid a, b, m)$"],
    ["Data fragmentation", "—", "Adding conditions leaves too few (zero) matching records"],
    ["Conditional independence", "—", "$P(X \\mid Y, Z) = P(X \\mid Z)$: once Z is known, Y adds nothing"],
    ["Π", "Capital pi", "“Multiply all of these together”"],
    ["$n$, $n_c$", "—", "Records in the class; those with the attribute value c"],
    ["$v$", "—", "Number of distinct values an attribute can take"],
    ["μ, σ²", "Mean, variance", "Parameters of the per-class Gaussian for a continuous attribute"],
    ["Gaussian NB", "—", "Naïve Bayes using a normal density for continuous attributes"],
    ["Laplace smoothing", "Add-one smoothing", "$(n_c + 1)/(n + v)$: avoids zero probabilities"],
    ["m-estimate", "—", "$(n_c + mp)/(n + m)$: general smoothing with prior guess p"],
    ["Bag of words", "—", "A document as word counts, ignoring order"],
    ["|V|", "Vocabulary size", "Number of distinct words in the training text"],
    ["Normalisation", "—", "Divide each class score by the sum of scores to get probabilities"],
  ],

  examTips: [
    "**NB appears in almost every paper** (PYQ Q3 loan approval, 5 marks; revision Q1). Layout: (1) priors, (2) a table of the likelihoods needed for the query only, (3) products per class, (4) normalised posteriors, (5) the predicted class.",
    "Always **say explicitly** if a zero probability appears, and mention that Laplace smoothing would fix it. Examiners reward this.",
    "For Bayes-theorem word problems (revision Q4, Vijay's job offers), write P(A), P(B), P(A | B) first, then apply $P(B \\mid A) = P(A \\mid B)P(B)/P(A)$.",
    "Gaussian NB: compute the class mean and **variance**, then plug into the normal pdf. Watch whether the question gives σ or σ².",
    "Keep fractions until the last step (e.g. 2/9 × 4/9…). It's faster and avoids rounding errors.",
  ],

  problems: [
    {
      title: "Loan approval with Naïve Bayes",
      pyq: "Midsem Q3 pattern (5 marks)",
      level: "Medium",
      marks: 5,
      hint: "Count Yes and No first (9 and 5). Then, for each of the four query values, count how many Yes rows and how many No rows have it. Only those four rows go in your likelihood table.",
      question: `A bank wants to predict whether a customer will buy a credit product. Predict **Buys = ?** for a new customer ⟨Age = Youth, Income = Medium, Student = Yes, Credit = Fair⟩.

| Age | Income | Student | Credit | Buys |
|---|---|---|---|---|
| Youth | High | No | Fair | No |
| Youth | High | No | Excellent | No |
| Middle | High | No | Fair | Yes |
| Senior | Medium | No | Fair | Yes |
| Senior | Low | Yes | Fair | Yes |
| Senior | Low | Yes | Excellent | No |
| Middle | Low | Yes | Excellent | Yes |
| Youth | Medium | No | Fair | No |
| Youth | Low | Yes | Fair | Yes |
| Senior | Medium | Yes | Fair | Yes |
| Youth | Medium | Yes | Excellent | Yes |
| Middle | Medium | No | Excellent | Yes |
| Middle | High | Yes | Fair | Yes |
| Senior | Medium | No | Excellent | No |

Compute the priors, likelihoods and posteriors, and state the predicted class.`,
      solution: `
### What is being asked
A standard Naïve Bayes classification of one query (Lesson 5's recipe).

### Why this approach
The naïve assumption lets us multiply one likelihood per attribute. We only need the likelihoods for the **query's** values, not the whole table.

### Formula
$$\\text{score}(y) = P(y) \\prod_i P(X_i \\mid y), \\qquad P(y \\mid X) = \\frac{\\text{score}(y)}{\\sum_{y'} \\text{score}(y')}$$

### Working
**1. Priors:** Yes = 9, No = 5 → $P(\\text{Yes}) = 9/14 = 0.643$, $P(\\text{No}) = 5/14 = 0.357$

**2. Likelihoods for the query:**

| Attribute value | P(· \\| Yes) | P(· \\| No) |
|---|---|---|
| Age = Youth | 2/9 = 0.222 | 3/5 = 0.6 |
| Income = Medium | 4/9 = 0.444 | 2/5 = 0.4 |
| Student = Yes | 6/9 = 0.667 | 1/5 = 0.2 |
| Credit = Fair | 6/9 = 0.667 | 2/5 = 0.4 |

**3. Scores:**
- Yes: $0.222 \\times 0.444 \\times 0.667 \\times 0.667 \\times 0.643 = 0.0282$
- No: $0.6 \\times 0.4 \\times 0.2 \\times 0.4 \\times 0.357 = 0.00686$

**4. Normalise:**
- $P(\\text{Yes} \\mid X) = 0.0282/(0.0282 + 0.00686) = 0.804$
- $P(\\text{No} \\mid X) = 0.196$

### Answer
**Predicted class: Buys = Yes** (probability 0.804).

### Takeaway
Being a Youth points toward No (3/5 vs 2/9), but being a student points strongly toward Yes (6/9 vs 1/5), and together with the higher prior, Yes wins. NB weighs every piece of evidence by multiplying.`,
    },
    {
      title: "Height / hair / eyes (revision deck Q1)",
      pyq: "Revision deck Q1",
      level: "Easy",
      marks: 4,
      hint: "C1 has 5 records, C2 has 3. Look at C2's hair and eye values carefully: are dark hair or brown eyes ever there? For Laplace, add 1 to each count and add v (2, 3 or 2) to each denominator.",
      question: `Use Bayesian (Naïve Bayes) classification to classify **X = (Short, Dark, Brown)**.

| Height | Hair | Eyes | Class |
|---|---|---|---|
| tall | blond | brown | C1 |
| tall | dark | blue | C1 |
| tall | dark | brown | C1 |
| short | dark | blue | C1 |
| short | blond | brown | C1 |
| tall | red | blue | C2 |
| tall | blond | blue | C2 |
| short | blond | blue | C2 |

Then redo it with Laplace smoothing (Height: 2 values, Hair: 3, Eyes: 2).`,
      solution: `
### What is being asked
Naïve Bayes on categorical data (Lesson 5), then the zero-count fix (Lesson 6).

### Formulas
$$P(X_i = c \\mid y) = \\frac{n_c}{n} \\quad \\text{(plain)}, \\qquad \\frac{n_c + 1}{n + v} \\quad \\text{(Laplace)}$$

### Working
**Priors:** $P(C1) = 5/8 = 0.625$, $P(C2) = 3/8 = 0.375$

| | C1 (n = 5) | C2 (n = 3) |
|---|---|---|
| P(short \\| ·) | 2/5 = 0.4 | 1/3 = 0.333 |
| P(dark \\| ·) | 3/5 = 0.6 | 0/3 = **0** |
| P(brown \\| ·) | 3/5 = 0.6 | 0/3 = **0** |
| Score = product × prior | $0.4 \\times 0.6 \\times 0.6 \\times 0.625 = 0.09$ | **0** |

Plain NB: **X → C1**. C2 scores 0 because dark hair and brown eyes never occur in C2 (the zero-probability problem).

**With Laplace smoothing:**
- C1: $\\frac{2+1}{5+2} \\cdot \\frac{3+1}{5+3} \\cdot \\frac{3+1}{5+2} \\cdot 0.625 = \\frac37 \\cdot \\frac48 \\cdot \\frac47 \\cdot 0.625 = 0.0765$
- C2: $\\frac{1+1}{3+2} \\cdot \\frac{0+1}{3+3} \\cdot \\frac{0+1}{3+2} \\cdot 0.375 = \\frac25 \\cdot \\frac16 \\cdot \\frac15 \\cdot 0.375 = 0.0050$
- $P(C1 \\mid X) = 0.0765/(0.0765 + 0.0050) = 0.94$

### Answer
**C1** both ways. With smoothing, P(C1 | X) = **0.94** and C2 gets a small non-zero probability.

### Takeaway
Always point out the zeros in the exam and mention Laplace. Here it didn't change the winner, but it replaced a false “certainty” with a sensible probability.`,
    },
    {
      title: "Text classification with Laplace smoothing",
      level: "Medium",
      marks: 5,
      hint: "Use the smoothed table from Lesson 7. Multiply the four word probabilities and the prior for each class. Keep it as fractions: 3·2·1·3 over 25⁴ is quicker than decimals.",
      question:
        "Using the 5 training sentences in Lesson 7 (3 Sports, 2 Not sports), classify **“A very close game”** with multinomial Naïve Bayes and Laplace smoothing. (Sports has 11 words, Not sports has 9, and the vocabulary is 14 words.)",
      solution: `
### What is being asked
Bag-of-words Naïve Bayes with Laplace smoothing (Lesson 7).

### Why this approach
“close” never appears in Sports, so without smoothing the Sports score would be 0.

### Formula
$$P(w \\mid c) = \\frac{\\text{count}(w, c) + 1}{\\text{words in } c + |V|}$$

### Working
**Priors:** $P(S) = 3/5$, $P(N) = 2/5$

| Word | count in S | $P(w \\mid S) = \\frac{c+1}{25}$ | count in N | $P(w \\mid N) = \\frac{c+1}{23}$ |
|---|---|---|---|---|
| a | 2 | 3/25 | 1 | 2/23 |
| very | 1 | 2/25 | 0 | 1/23 |
| close | 0 | 1/25 | 1 | 2/23 |
| game | 2 | 3/25 | 0 | 1/23 |

- **Sports:** $\\frac{3 \\cdot 2 \\cdot 1 \\cdot 3}{25^4} \\cdot \\frac35 = \\frac{18}{390625} \\cdot 0.6 = 2.76 \\times 10^{-5}$
- **Not sports:** $\\frac{2 \\cdot 1 \\cdot 2 \\cdot 1}{23^4} \\cdot \\frac25 = \\frac{4}{279841} \\cdot 0.4 = 5.72 \\times 10^{-6}$
- $P(S \\mid \\text{text}) = 2.76/(2.76 + 0.572) = 0.83$

### Answer
**Sports**, with posterior probability about **0.83**.

### Takeaway
Without smoothing, one unseen word (“close”) would have wiped out Sports entirely, despite “game” and “very” pointing to it.`,
    },
    {
      title: "Bayes' theorem: job offers (revision deck Q4)",
      pyq: "Revision deck Q4",
      level: "Easy",
      marks: 3,
      hint: "Write down P(G), P(M) and P(G | M) first. (a) is just the complement of P(G | M). (b) flips it with Bayes.",
      question:
        "Vijay estimates a 60% chance of an offer from Google (G) and 50% from Microsoft (M). If he gets an offer from M, he believes there's an 80% chance of one from G. (a) If he gets an M offer, what is the probability he does NOT get a G offer? (b) What is P(M | G)?",
      solution: `
### What is being asked
A direct application of conditional probability and Bayes' theorem (Lesson 2).

### Formula
$$P(\\neg G \\mid M) = 1 - P(G \\mid M), \\qquad P(M \\mid G) = \\frac{P(G \\mid M)\\,P(M)}{P(G)}$$

### Working
Given: $P(G) = 0.6$, $P(M) = 0.5$, $P(G \\mid M) = 0.8$

**(a)** $P(\\neg G \\mid M) = 1 - 0.8 = 0.2$

**(b)** $P(M \\mid G) = \\frac{0.8 \\times 0.5}{0.6} = \\frac{0.4}{0.6} = 0.667$

### Answer
(a) **0.2** (b) **0.667**

### Takeaway
P(G | M) = 0.8 but P(M | G) = 0.667. Conditional probabilities are not symmetric; Bayes' theorem converts one into the other using the priors.`,
    },
    {
      title: "The false-positive paradox",
      level: "Medium",
      marks: 4,
      hint: "First find P(+) by adding the positives from the ill and the healthy groups. Then P(D | +) = P(+ | D)P(D) / P(+). Picturing 10,000 people helps.",
      question:
        "A disease affects 1% of people. A test has sensitivity P(+|D) = 0.95 and false-positive rate P(+|¬D) = 0.05. (a) A person tests positive. What is P(D|+)? (b) Explain the result in terms of prior and likelihood.",
      solution: `
### What is being asked
Bayes' theorem with a rare condition (Lessons 2–3).

### Formula
$$P(+) = P(+ \\mid D)P(D) + P(+ \\mid \\neg D)P(\\neg D), \\qquad P(D \\mid +) = \\frac{P(+ \\mid D)\\,P(D)}{P(+)}$$

### Working
**(a)**
- $P(+) = 0.95 \\times 0.01 + 0.05 \\times 0.99 = 0.0095 + 0.0495 = 0.059$
- $P(D \\mid +) = 0.0095/0.059 = 0.161$

Check with 10,000 people: 100 ill → 95 test +; 9,900 healthy → 495 test +. So 95 of 590 positives are ill: 0.161 ✓

### Answer
**(a)** $P(D \\mid +) \\approx$ **0.16**, only about 16%.

**(b)** The likelihood is high (95%), but the **prior is tiny** (1%). The false positives from the large healthy group (495) swamp the true positives (95). As in the meningitis example, *the likelihood is weighted by the prior*.

### Takeaway
This is why a positive screening test is usually followed by a second, more specific test.`,
    },
    {
      title: "Gaussian Naïve Bayes (continuous attributes)",
      level: "Hard",
      marks: 6,
      hint: "Compute four densities: height and weight, for each class. For each, work out (x − μ)²/(2σ²) first, then e to the minus that, then divide by √(2π)·σ.",
      question:
        "Classify a person with height 172 cm and weight 70 kg as Male or Female (equal priors). Class statistics: Male: height μ = 175, σ = 6; weight μ = 75, σ = 8. Female: height μ = 162, σ = 5; weight μ = 58, σ = 6. Use $f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-(x-\\mu)^2/2\\sigma^2}$.",
      solution: `
### What is being asked
Naïve Bayes with continuous attributes using per-class normal densities (Lesson 5).

### Why this approach
We can't count exact heights, so each class gets a bell curve, and the height of the curve at the test value acts as the likelihood.

### Formula
$$f(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma} \\exp\\!\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$

### Working
**Male**
- Height: $\\frac{(172 - 175)^2}{2 \\cdot 36} = \\frac{9}{72} = 0.125$ → $f = \\frac{1}{2.5066 \\times 6} e^{-0.125} = 0.0665 \\times 0.8825 = 0.0587$
- Weight: $\\frac{(70 - 75)^2}{2 \\cdot 64} = \\frac{25}{128} = 0.195$ → $f = 0.0499 \\times 0.8226 = 0.0410$

**Female**
- Height: $\\frac{(172 - 162)^2}{2 \\cdot 25} = 2$ → $f = 0.0798 \\times 0.1353 = 0.0108$
- Weight: $\\frac{(70 - 58)^2}{2 \\cdot 36} = 2$ → $f = 0.0665 \\times 0.1353 = 0.0090$

**Scores** (× 0.5 prior):
- Male: $0.0587 \\times 0.0410 \\times 0.5 = 1.20 \\times 10^{-3}$
- Female: $0.0108 \\times 0.0090 \\times 0.5 = 4.86 \\times 10^{-5}$
- $P(\\text{M} \\mid x) = 1.20/(1.20 + 0.0486) = 0.96$

### Answer
**Male**, with probability about **0.96**.

### Takeaway
172 cm and 70 kg are each within one standard deviation of the male means, but two standard deviations above the female means, so the female densities are much smaller.`,
    },
    {
      title: "Full Bayes vs Naïve Bayes on the meningitis data",
      level: "Hard",
      marks: 5,
      hint: "Meningitis patients are 5, 8 and 10. For each symptom in the query, count within those 3, and within the other 7.",
      question: `Using the 10-patient table (slides 11–13), classify the query **h = T, f = F, v = T** with **Naïve Bayes**, and compare with the full-Bayes answer P(m|…) = 0.33.

| ID | H | F | V | M |
|---|---|---|---|---|
| 1 | T | T | F | F |
| 2 | F | T | F | F |
| 3 | T | F | T | F |
| 4 | T | F | T | F |
| 5 | F | T | F | T |
| 6 | T | F | T | F |
| 7 | T | F | T | F |
| 8 | T | F | T | T |
| 9 | F | T | F | F |
| 10 | T | F | T | T |`,
      solution: `
### What is being asked
Compare the naïve and full Bayes classifiers on the same query (Lessons 3–4).

### Why this approach
NB needs only single-symptom counts within each class, instead of the chain rule's increasingly narrow joint counts.

### Working
**Priors:** meningitis = {5, 8, 10}, so $P(m) = 0.3$ and $P(\\neg m) = 0.7$

| | m (5, 8, 10) | ¬m (1, 2, 3, 4, 6, 7, 9) |
|---|---|---|
| P(h = T \\| ·) | 2/3 | 5/7 |
| P(f = F \\| ·) | 2/3 | 4/7 |
| P(v = T \\| ·) | 2/3 | 4/7 |
| Score = product × prior | $(2/3)^3 \\times 0.3 = 0.0889$ | $\\frac{5 \\cdot 4 \\cdot 4}{343} \\times 0.7 = 0.1633$ |

$P(m \\mid q) = 0.0889/(0.0889 + 0.1633) = 0.35$

### Answer
**No meningitis** predicted; NB gives P(m | q) = **0.35**, very close to full Bayes (0.33).

### Takeaway
NB got almost the same answer using only single-attribute counts. Full Bayes needs joint counts that fragment to 0: for the query (h, f, ¬v) it gave exactly 0.`,
    },
  ],

  theory: [
    {
      title: "Naïve Bayes: assumption, working and issues",
      marks: 5,
      question: "Explain the Naïve Bayes classifier: Bayes' theorem, the naïve assumption, how probabilities are estimated for categorical and continuous attributes, and its main issue and fix.",
      solution: `
### What the examiner wants
All five parts in order: Bayes/MAP → assumption → estimation (both kinds) → zero problem and fix → pros/cons. Use headings.

### Model answer
- **Bayes:** $P(y \\mid X) = P(X \\mid y)P(y)/P(X)$. Classify by **MAP**: pick the y that maximises $P(X \\mid y)P(y)$; $P(X)$ is the same for all classes.
- **Naïve assumption:** attributes are **conditionally independent given the class**, so $P(X_1..X_d \\mid y) = \\prod_i P(X_i \\mid y)$. This replaces exponentially many joint counts with d simple counts per class, and avoids data fragmentation.
- **Estimation:** prior $P(y) = N_y/N$. Categorical: $P(X_i = c \\mid y) = n_c/n_y$. Continuous: discretise into bins, or assume a **Gaussian** per class (mean $\\mu_y$, variance $\\sigma_y^2$) and use the normal pdf.
- **Issue:** a zero count makes the whole product zero, ignoring all other evidence. **Fix:** Laplace $(n_c + 1)/(n + v)$ or the m-estimate.
- **Pros:** fast, needs little data, handles missing values and many features (text), robust to irrelevant attributes. **Cons:** correlated attributes violate the assumption, and its probability values are poorly calibrated (though the ranking is often right).

### Takeaway
One sentence to remember: *NB multiplies one likelihood per attribute with the prior, assuming independence given the class, and smooths zeros.*`,
    },
    {
      title: "Generative vs discriminative classifiers",
      marks: 3,
      question: "Differentiate generative and discriminative classifiers with examples.",
      solution: `
### What the examiner wants
A comparison on what is learnt, how classification is done, and examples. A table works well.

### Model answer
| | Generative | Discriminative |
|---|---|---|
| Learns | $P(x \\mid y)$ and $P(y)$: how each class **generates** data | $P(y \\mid x)$ or the boundary $f(x)$ directly |
| Classifies by | Bayes' rule, comparing $P(x \\mid y)P(y)$ | Evaluating $f(x)$ |
| Boundary | Linear or non-linear | Linear if f is linear |
| Can generate new samples? | Yes | No |
| Examples | **Naïve Bayes**, Gaussian discriminant analysis, HMM | **Logistic regression**, SVM, perceptron |
| Data needs | Works with less data (strong assumptions) | Usually more accurate with lots of data |

### Takeaway
Generative = model each fruit. Discriminative = learn the line between the fruits.`,
    },
    {
      title: "Paradox of the false positive and data fragmentation",
      marks: 4,
      question: "Using the meningitis example, explain (a) the paradox of the false positive and (b) data fragmentation in the full Bayes classifier. How does Naïve Bayes help with (b)?",
      solution: `
### What the examiner wants
The actual numbers from slides 12–13 for both parts, the reason behind each, and how NB avoids fragmentation.

### Model answer
**(a) Paradox of the false positive:** for (h, ¬f, v) the likelihood $P(h, \\neg f, v \\mid m) = 0.67$ is high, but the prior $P(m) = 0.3$ is low, giving $P(m \\mid \\dots) = 0.33$ versus $0.67$ for not-meningitis. It's twice as likely the patient does *not* have meningitis. It feels counter-intuitive, but **the likelihood is weighted by the prior**.

**(b) Data fragmentation:** the chain rule $P(h \\mid m)P(f \\mid h, m)P(\\neg v \\mid f, h, m)$ restricts each count to an ever-smaller subset of records. For (h, f, ¬v), $P(f \\mid h, m)$ is computed from just 2 patients, neither with fever, so it's 0 and $P(m \\mid \\dots) = 0$: a false “certainty”. Full joint estimation needs exponentially many records.

**How NB helps:** each $P(X_i \\mid y)$ uses **only the class condition**, so every estimate uses all the records of that class. Zeros can still occur but are fixed with Laplace smoothing.

### Takeaway
Paradox = prior beats likelihood. Fragmentation = too many conditions, too few rows.`,
    },
    {
      title: "Laplace smoothing",
      marks: 3,
      question: "What is the zero-frequency problem in Naïve Bayes? Explain Laplace smoothing with its formula and an example.",
      solution: `
### What the examiner wants
The problem (a zero count kills the product), the formula with each symbol explained, and an example.

### Model answer
- **Problem:** if an attribute value never occurs with a class in training, $P(X_i = c \\mid y) = 0$ and the whole product becomes 0, ignoring all other evidence. If this happens for every class, NB can't decide (slide 25).
- **Laplace (add-one):** $P(X_i = c \\mid y) = \\frac{n_c + 1}{n + v}$, where n = records in class y, $n_c$ = those with value c, and v = number of distinct values of $X_i$. Adding 1 to each count ensures nothing is 0; adding v to the denominator keeps the probabilities summing to 1.
- **Example:** “close” never appears in Sports texts, so $P(\\text{close} \\mid S) = \\frac{0 + 1}{11 + 14} = \\frac{1}{25}$ instead of 0.
- **General m-estimate:** $\\frac{n_c + mp}{n + m}$.

### Takeaway
“Unseen in a small sample” is not the same as “impossible”. Smoothing encodes that.`,
    },
    {
      title: "Conditional independence",
      marks: 2,
      question: "Define conditional independence with an example. Why is the naïve assumption called “naïve”?",
      solution: `
### What the examiner wants
The formal definition, the slide's example, and the reason for the name.

### Model answer
- X and Y are **conditionally independent given Z** if $P(X \\mid Y, Z) = P(X \\mid Z)$: once Z is known, Y adds no information about X.
- **Example (slide 18):** arm length and reading skill are correlated in the general population (children have shorter arms and read less well), but **given age** they are unrelated.
- **“Naïve”** because NB assumes *all* features are conditionally independent given the class, which is rarely true (e.g. “San” and “Francisco” in text). Yet NB often classifies well, because only the **ranking** of the posteriors matters, not their exact values.

### Takeaway
Independence given the class is a simplification, not a fact, and a very useful one.`,
    },
  ],

  quiz: [
    { q: "Naïve Bayes assumes the features are:", options: ["Independent", "Conditionally independent given the class", "Normally distributed", "Equally important"], answer: 1, why: "$P(X_1..X_d|y) = \\prod P(X_i|y)$." },
    { q: "In MAP classification we can ignore P(X) because:", options: ["It is always 1", "It is the same for all classes", "It is zero", "It is unknown"], answer: 1, why: "The evidence is a common denominator." },
    { q: "Laplace-smoothed estimate for a word never seen in a class of 11 words with vocabulary 14:", options: ["0", "1/11", "1/25", "1/14"], answer: 2, why: "(0+1)/(11+14)." },
    { q: "Naïve Bayes is a:", options: ["Discriminative model", "Generative model", "Instance-based model", "Unsupervised model"], answer: 1, why: "It models P(x|y) and P(y)." },
    { q: "For a continuous attribute, NB commonly assumes:", options: ["A uniform distribution", "A Gaussian per class", "A Poisson distribution", "No distribution"], answer: 1, why: "Estimate the class mean/variance, then use the normal pdf." },
    { q: "P(G|M) = 0.8, P(M) = 0.5, P(G) = 0.6. P(M|G) is:", options: ["0.4", "0.667", "0.8", "0.48"], answer: 1, why: "0.8 × 0.5 / 0.6." },
    { q: "“Data fragmentation” in full Bayes refers to:", options: ["Missing values", "Joint conditions leaving too few matching records", "Too many classes", "Overlapping classes"], answer: 1, why: "The chain rule narrows the subset until counts become 0." },
    { q: "Which is TRUE of Naïve Bayes?", options: ["Needs a lot of training data", "Is slow to train", "Works well for text classification", "Always gives calibrated probabilities"], answer: 2, why: "The bag-of-words NB is a classic, strong baseline." },
    { q: "A disease has prior 1% and a test with 95% sensitivity and 5% false positives. P(disease | positive) is about:", options: ["95%", "50%", "16%", "5%"], answer: 2, why: "95 true positives vs 495 false positives out of 10,000 people." },
    { q: "In Laplace smoothing $(n_c + 1)/(n + v)$, v is:", options: ["The number of classes", "The number of records", "The number of distinct values of the attribute", "Always 1"], answer: 2, why: "Adding v keeps the smoothed probabilities summing to 1." },
  ],
};
