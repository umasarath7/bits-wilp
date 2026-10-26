// ISM — Lecture 4 (CS-4): Bayes' theorem and the Naive Bayes classifier
// Source: CourseFiles/ISM/Lec4.pdf (67 slides). Every topic cites its slides; nothing outside the deck is taught.

export default {
  title: "Bayes' Theorem & the Naive Bayes Classifier",
  source: "Lec4.pdf (CS-4) · 67 slides",
  quizMode: "step",
  overview:
    "Lecture 3 ended with a “reverse” question: given that a 1 was received, what's the chance a 1 was sent? **Bayes' theorem** is the general answer: it turns P(evidence | cause), which is easy to know, into P(cause | evidence), which is what we actually want. A doctor knows how often measles causes a rash, but needs the chance that *this* child with a rash has measles. We prove the theorem, solve the slides' classic problems (bonus schemes, flu vs measles, spam filters, bolts from three machines, fire accidents), then scale it up into a machine-learning classifier. **Naive Bayes** predicts a class from many features by assuming they are conditionally independent given the class. We apply it to weather/tennis tables, animal species and text, and fix its zero-probability problem with **Laplace smoothing**.",

  simpleIntro: "Lecture 3 went **forwards**: from a cause to an effect (“if the bolt came from machine A, how likely is it defective?”). **Bayes' theorem** goes **backwards**: from the effect you saw to the cause behind it (“this bolt is defective, which machine made it?”). The same idea, applied to many features at once, is the **Naive Bayes classifier** behind spam filters. All examples are the lecturer's own.",

  simple: [
    {
      "id": "s-big",
      "heading": "1. The big picture",
      "slides": "",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Bayes' theorem",
              "text": "Turn $P(\\text{evidence} \\mid \\text{cause})$ into $P(\\text{cause} \\mid \\text{evidence})$.",
              "tag": "Reasoning backwards",
              "example": "A child has a rash: flu or measles?",
              "figure": "i4-flu"
            },
            {
              "title": "Prior → posterior",
              "text": "Start with a belief (**prior**), see evidence, update to a new belief (**posterior**).",
              "tag": "Learning from data",
              "example": "Spam rate 50% → 95% once the filter flags it"
            },
            {
              "title": "Naive Bayes",
              "text": "Score each class by prior × the likelihood of **each feature**, assuming the features are independent. Biggest score wins.",
              "tag": "A classifier",
              "example": "Will the player play tennis today?"
            }
          ]
        }
      ]
    },
    {
      "id": "s-bayes",
      "heading": "2. Bayes' theorem: from effect back to cause",
      "slides": "4–12",
      "blocks": [
        {
          "type": "p",
          "text": "Think of a tree. Lecture 3's **total probability** adds up every path that leads to the evidence. Bayes then asks: **what share of that total came through the path I care about?**"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Bayes' theorem",
          "text": "$$P(A_i \\mid B) = \\frac{P(A_i)\\,P(B \\mid A_i)}{\\sum_j P(A_j)\\,P(B \\mid A_j)} = \\frac{\\text{this path}}{\\text{all paths to } B}$$"
        },
        {
          "type": "table",
          "head": [
            "Word",
            "Meaning",
            "Flu example"
          ],
          "rows": [
            [
              "**Prior** $P(A_i)$",
              "Belief before the evidence",
              "P(flu) = 0.9"
            ],
            [
              "**Likelihood** $P(B \\mid A_i)$",
              "How well the cause explains the evidence",
              "P(rash | flu) = 0.08"
            ],
            [
              "**Evidence** $P(B)$",
              "Total probability of what you saw",
              "P(rash) = 0.167"
            ],
            [
              "**Posterior** $P(A_i \\mid B)$",
              "Belief after the evidence",
              "P(flu | rash) = 0.431"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 2): flu or measles?",
          "text": "90% of sick children have flu, 10% measles. A rash appears in 8% of flu cases and 95% of measles cases. A child has a rash. P(flu)?\n\n**Path flu → rash:** $0.9 \\times 0.08 = 0.072$.\n**Path measles → rash:** $0.1 \\times 0.95 = 0.095$.\n**All paths:** $P(\\text{rash}) = 0.072 + 0.095 = 0.167$.\n$P(\\text{flu} \\mid \\text{rash}) = \\frac{0.072}{0.167}$"
        },
        {
          "type": "answer",
          "value": "0.431",
          "text": "Flu dropped from 90% to 43%: the rash is strong evidence for measles (P(measles | rash) = 0.569), even though measles is rare."
        },
        {
          "type": "diagram",
          "name": "i4-flu"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Rare things stay rare",
          "text": "1% have a condition; the test catches 90% and false-alarms 5%. P(condition | positive) $= \\frac{0.009}{0.009 + 0.0495} = 0.154$. Most positives are false alarms, because the healthy group is so much bigger."
        }
      ]
    },
    {
      "id": "s-tree",
      "heading": "3. The exam recipe: draw the tree",
      "slides": "52–66",
      "blocks": [
        {
          "type": "p",
          "text": "Almost every Bayes question in the exam has the same shape: **groups with shares**, **a rate inside each group**, and “given the evidence, which group?”"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Four steps",
          "text": "1. Branch 1: the causes with their priors (they must add to 1).\n2. Branch 2: the evidence rate under each cause.\n3. Multiply along each path; **add** the paths that end in the evidence → $P(B)$.\n4. Divide the path you want by $P(B)$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Problem 2): the bolt factory",
          "text": "Machines A, B, C make 25%, 35%, 40% of the bolts; 5%, 4%, 2% of their bolts are defective. A random bolt is defective. Which machine made it?\n\nPaths: A $0.25 \\times 0.05 = 0.0125$; B $0.35 \\times 0.04 = 0.014$; C $0.40 \\times 0.02 = 0.008$. Total $P(D) = 0.0345$.\n$P(A \\mid D) = \\frac{0.0125}{0.0345} = 0.362$, $P(B \\mid D) = 0.406$, $P(C \\mid D) = 0.232$."
        },
        {
          "type": "answer",
          "value": "P(A | defective) = 0.362",
          "text": "C makes the most bolts, yet it is the **least** likely culprit: its defect rate is low."
        },
        {
          "type": "diagram",
          "name": "i4-bolt"
        },
        {
          "type": "check",
          "q": "Spam is 50% of email. The filter flags 99% of spam and 5% of normal email. A flagged email: P(it is NOT spam)?",
          "options": [
            "0.05",
            "0.048",
            "0.5",
            "0.01"
          ],
          "answer": 1,
          "why": "$\\frac{0.5 \\times 0.05}{0.5 \\times 0.05 + 0.5 \\times 0.99} = \\frac{0.025}{0.52} = 0.048$ (lecturer's Example 3)."
        }
      ]
    },
    {
      "id": "s-map",
      "heading": "4. MAP: picking the most believable hypothesis",
      "slides": "13–20",
      "blocks": [
        {
          "type": "p",
          "text": "In machine learning, the “causes” are **hypotheses** h (spam / not spam, plays / doesn't play) and the evidence is the **data** D. We want the hypothesis with the biggest posterior."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "MAP and ML",
          "text": "$$h_{MAP} = \\arg\\max_h P(D \\mid h)\\,P(h)$$ $P(D)$ is the same for every h, so drop it when **comparing**. If all priors are equal, this becomes $h_{ML} = \\arg\\max_h P(D \\mid h)$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 4): play when sunny?",
          "text": "14 days: Sunny had Yes 3, No 2. Overall Yes 9, No 5.\nYes: $P(\\text{Sunny} \\mid \\text{Yes})P(\\text{Yes}) = \\frac{3}{9} \\cdot \\frac{9}{14} = \\frac{3}{14}$. No: $\\frac{2}{5} \\cdot \\frac{5}{14} = \\frac{2}{14}$.\nDivide each by $P(\\text{Sunny}) = 5/14$ → 0.60 vs 0.40."
        },
        {
          "type": "answer",
          "value": "Plays (0.60 > 0.40)"
        }
      ]
    },
    {
      "id": "s-nb",
      "heading": "5. Naive Bayes: many features at once",
      "slides": "19–29",
      "blocks": [
        {
          "type": "p",
          "text": "With several features $x_1, \\dots, x_n$, the likelihood $P(x_1, \\dots, x_n \\mid h)$ needs far too much data to estimate. The **naive** trick: assume the features are **independent within each class**, so the likelihood is just a product of one-feature fractions you can count from a table."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Naive Bayes rule",
          "text": "$$\\text{score}(c) = P(c) \\prod_i P(x_i \\mid c) \\qquad \\text{predict the class with the highest score}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 5): play tennis?",
          "text": "Today: Outlook Sunny, Temp Hot, Humidity Normal, Windy False. Read each fraction from the 14-day table.\n\n**Yes:** $\\frac{3}{9} \\cdot \\frac{2}{9} \\cdot \\frac{6}{9} \\cdot \\frac{6}{9} \\cdot \\frac{9}{14} = 0.0212$\n**No:** $\\frac{2}{5} \\cdot \\frac{2}{5} \\cdot \\frac{1}{5} \\cdot \\frac{2}{5} \\cdot \\frac{5}{14} = 0.0046$"
        },
        {
          "type": "answer",
          "value": "Yes: the player will play",
          "text": "You only need to compare the scores. Dividing both by P(X) (as the slide does) turns them into 0.726 and 0.157 but doesn't change the winner."
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Table habit",
          "text": "For each feature, write the fraction as **count of (feature value AND class) ÷ count of class**. The denominator is the class total (9 Yes, 5 No), not 14."
        }
      ]
    },
    {
      "id": "s-laplace",
      "heading": "6. Zero counts and Laplace smoothing (text classification)",
      "slides": "30–48",
      "blocks": [
        {
          "type": "p",
          "text": "If a word never appeared in spam during training, $P(\\text{word} \\mid \\text{spam}) = 0$, and one zero wipes out the whole product, however spammy the other words are. **Laplace smoothing** adds 1 to every count so nothing is ever exactly 0."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Laplace smoothing",
          "text": "$$P(w \\mid c) = \\frac{\\text{count}(w, c) + 1}{\\text{total words in } c + |V|} \\qquad |V| = \\text{number of distinct words in all training text}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 30–35): sports or not?",
          "text": "Training: “A great game” (S), “The election was over” (N), “Very clean match” (S), “A clean but forgettable game” (S), “It was a close election” (N). Classify **“A very close game”**.\n\nSports has 11 words, Not-sports 9, vocabulary $|V| = 14$. Priors 3/5 and 2/5.\n**Sports:** a $\\frac{2+1}{25}$, very $\\frac{1+1}{25}$, close $\\frac{0+1}{25}$, game $\\frac{2+1}{25}$ → $\\frac{3 \\cdot 2 \\cdot 1 \\cdot 3}{25^4} \\cdot \\frac{3}{5} = 2.76 \\times 10^{-5}$\n**Not sports:** $\\frac{2 \\cdot 1 \\cdot 2 \\cdot 1}{23^4} \\cdot \\frac{2}{5} = 0.57 \\times 10^{-5}$"
        },
        {
          "type": "answer",
          "value": "Sports",
          "text": "Without smoothing, “close” (0 times in Sports) would make the Sports score exactly 0."
        },
        {
          "type": "check",
          "q": "Class c has 20 words; the vocabulary has 10 words; “goal” appears 3 times in c. Smoothed P(goal | c)?",
          "options": [
            "3/20",
            "4/30",
            "4/20",
            "3/30"
          ],
          "answer": 1,
          "why": "$(3 + 1)/(20 + 10) = 4/30$."
        }
      ]
    },
    {
      "id": "s-test",
      "heading": "7. Test your understanding",
      "slides": "",
      "blocks": [
        {
          "type": "check",
          "q": "In Bayes' theorem the denominator P(B) is found using…",
          "options": [
            "the complement rule",
            "the law of total probability",
            "independence",
            "the MLE"
          ],
          "answer": 1,
          "why": "Add up every path that leads to B."
        },
        {
          "type": "check",
          "q": "Machine 1 makes 70% (2% defective), machine 2 makes 30% (5% defective). A defective item: P(machine 2)?",
          "options": [
            "0.30",
            "0.517",
            "0.05",
            "0.483"
          ],
          "answer": 1,
          "why": "Paths 0.014 and 0.015 → $0.015/0.029 = 0.517$."
        },
        {
          "type": "check",
          "q": "Why is Naive Bayes called “naive”?",
          "options": [
            "It ignores priors",
            "It assumes features are independent given the class",
            "It uses only one feature",
            "It never smooths"
          ],
          "answer": 1,
          "why": "That assumption is rarely exactly true, but it works surprisingly well."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "8. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Bayes = this path ÷ all paths** on the tree. The denominator is total probability.\n- **Prior × likelihood → posterior.** A rare cause stays fairly unlikely even after a positive test.\n- **MAP:** $\\arg\\max P(D \\mid h)P(h)$; drop $P(D)$ when comparing. Equal priors → ML.\n- **Naive Bayes:** prior × product of per-feature fractions; each fraction's denominator is the **class count**.\n- **Laplace:** $\\frac{\\text{count} + 1}{\\text{class words} + |V|}$ so no zero kills the product."
        }
      ]
    }
  ],

  summary: [
    {
      id: "bayes",
      heading: "Lesson 1: How do I reverse a conditional probability? Bayes' theorem",
      slides: "4–7",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A formula to update the probability of each possible **cause** $E_i$ after observing an **effect** A.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Bayes' theorem (slide 4)",
          text: "Let $E_1, E_2, \\dots, E_n$ be mutually exclusive events with $P(E_i) > 0$, and A any event with $P(A) > 0$ and $A \\subseteq \\bigcup E_i$. Then\n$$P(E_i \\mid A) = \\frac{P(E_i)\\,P(A \\mid E_i)}{\\sum_{i=1}^{n} P(E_i)\\,P(A \\mid E_i)}$$\n**Numerator** = the one path through cause $E_i$. **Denominator** = $P(A)$ by total probability (all paths).",
        },
        {
          type: "p",
          text: "**Proof (slides 5–7).** Since $A \\subseteq \\bigcup E_i$, $A = (A \\cap E_1) \\cup \\dots \\cup (A \\cap E_n)$ (distributive law), and these pieces are mutually exclusive. By the addition rule, $P(A) = \\sum P(A \\cap E_i)$ (1). By the multiplication rule, $P(A \\cap E_i) = P(E_i)P(A \\mid E_i)$ (2). Substituting (2) in (1) gives $P(A) = \\sum P(E_i)P(A \\mid E_i)$ (3), the **rule of total probability** (or *rule of elimination*). Finally, by definition $P(E_i \\mid A) = P(E_i \\cap A)/P(A)$ (4); substitute (2) and (3) into (4). ∎",
        },
        {
          type: "table",
          caption: "Vocabulary (slides 16–17)",
          head: ["Term", "Symbol", "Meaning"],
          rows: [
            ["Prior", "$P(E_i)$ or $P(h)$", "Probability of the cause/hypothesis **before** seeing the evidence"],
            ["Likelihood", "$P(A \\mid E_i)$ or $P(D \\mid h)$", "Probability of the evidence **if** that cause is true"],
            ["Evidence (predictor prior)", "$P(A)$ or $P(D)$", "Overall probability of the evidence (total probability)"],
            ["Posterior", "$P(E_i \\mid A)$ or $P(h \\mid D)$", "Probability of the cause **after** seeing the evidence"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: Example 2 (slide 10), flu or measles?",
          text: "90% of sick children have flu (F), 10% measles (M). P(rash | M) = 0.95, P(rash | F) = 0.08. A child has a rash: P(flu)?\n\n$$P(F \\mid R) = \\frac{P(F)P(R \\mid F)}{P(F)P(R \\mid F) + P(M)P(R \\mid M)} = \\frac{0.9(0.08)}{0.9(0.08) + 0.1(0.95)} = \\frac{0.072}{0.167} = 0.431$$\nSo P(measles | rash) = 0.569: although measles is rare, the rash points to it.",
        },
        { type: "diagram", name: "i4-flu" },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Example 1 (slides 8–9), bonus schemes",
          text: "X, Y, Z become manager with probabilities 4/9, 2/9, 1/3. The bonus scheme (A) is introduced with probability 3/10, 1/2, 4/5 respectively.\n\n(i) Total probability: $P(A) = \\frac{4}{9}\\cdot\\frac{3}{10} + \\frac{2}{9}\\cdot\\frac{1}{2} + \\frac{1}{3}\\cdot\\frac{4}{5} = \\frac{12 + 10 + 24}{90} = \\frac{23}{45}$.\n(ii) Bayes: $P(E_1 \\mid A) = \\frac{(4/9)(3/10)}{23/45} = \\frac{2/15}{23/45} = \\frac{6}{23}$.",
        },
        {
          type: "p",
          text: "**Example 3 (slides 11–12), the spam filter.** 50% of emails are spam (B). The software detects 99% of spam, with a 5% false-positive rate. If an email is flagged (A), what's the chance it's actually **not** spam? $P(B^c \\mid A) = \\frac{P(A \\mid B^c)P(B^c)}{P(A \\mid B)P(B) + P(A \\mid B^c)P(B^c)} = \\frac{0.05(0.5)}{0.05(0.5) + 0.99(0.5)} = \\frac{5}{104} \\approx 0.048$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Confusing $P(A \\mid E)$ (given) with $P(E \\mid A)$ (asked).\n- Forgetting the denominator is a **sum over all causes**, not just the one you want.\n- Using the false-positive rate as P(not spam | flagged). They're different (0.05 vs 0.048 here; much more different when spam is rare).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Posterior = prior × likelihood ÷ evidence. Evidence = Σ prior × likelihood (total probability). Tree: the path you want ÷ all paths to the evidence.",
        },
      ],
    },
    {
      id: "problems",
      heading: "Lesson 2: The classic Bayes problems, solved with trees",
      slides: "52–66",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A reliable recipe for any Bayes word problem, applied to the slides' practice problems.",
        },
        {
          type: "p",
          text: "```flow\n1. Name the causes E₁…Eₙ and the evidence A -> 2. Write priors P(Eᵢ) and likelihoods P(A | Eᵢ) -> 3. Tree: multiply along each path -> 4. Add paths = P(A) -> 5. Posterior = path ÷ P(A)\n```",
        },
        {
          type: "p",
          text: "**Problem 2 (slides 54–56), bolts.** Machines A, B, C make 25%, 35%, 40% of bolts; 5%, 4%, 2% of their output is defective. A random bolt is defective: which machine?",
        },
        { type: "diagram", name: "i4-bolt" },
        {
          type: "p",
          text: "$P(E) = 0.0125 + 0.0140 + 0.0080 = 0.0345$. So $P(A \\mid E) = 0.0125/0.0345 = 0.362$, $P(B \\mid E) = 0.0140/0.0345 = 0.406$, $P(C \\mid E) = 0.0080/0.0345 = 0.232$, and **P(B or C | defective) = $0.638 \\approx 0.64$**. Notice C makes the most bolts but is least to blame: its defect rate is lowest.",
        },
        {
          type: "table",
          caption: "The other practice problems at a glance",
          head: ["Problem", "Priors", "Likelihoods", "Asked", "Answer"],
          rows: [
            ["1 Board of directors (52–53)", "set 1: 0.6, set 2: 0.4", "new product: 0.8, 0.3", "P(product)", "0.48 + 0.12 = **0.6**"],
            ["3 Fire accident (57–58)", "short circuit 0.8, LPG 0.2", "fire: 0.30, 0.95", "Most probable cause", "24/43 vs 19/43 → **short circuit**"],
            ["4 Vice Chancellor (59–60)", "academic 0.5, business 0.3, politician 0.2", "research: 0.8, 0.6, 0.4", "P(academic | research)", "0.40/0.66 = **0.606**"],
            ["5 Technicians (61–62)", "Janet 0.20, Tom 0.60, Georgia 0.15, Peter 0.05", "incomplete: 0.05, 0.10, 0.10, 0.05", "P(Janet | incomplete)", "0.01/0.0875 = **0.114**"],
            ["6 Light aircraft (63–64)", "discovered 0.7, not 0.3", "locator: 0.6, 0.1", "(a) P(not disc | locator) (b) P(disc | no locator)", "**0.067**, **0.509**"],
          ],
        },
        {
          type: "p",
          text: "**Janet's lesson (slide 62):** although Janet makes an incomplete repair only 1 time in 20, more than 11% of incomplete repairs are hers. Posteriors depend on **both** how often a cause occurs and how strongly it produces the evidence.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide checks (flagged)",
          text: "- **Problem 3:** the stem lists “P(LPG cylinder explosion)” without a value; the solution uses $0.2 = 1 - 0.8$ (treating the two causes as the only ones).\n- **Problem 7 (firms V and W):** the stem says “the probability is **3/4** that W will bid”, but the solution uses $P(W) = 1/3$, $P(W') = 2/3$, getting $P(V) = 11/18$ and $P(W' \\mid V) = 9/11$. With the stem's value, $P(V) = (3/4) (1/3) + (1/4) (3/4)$ = **7/16** and $P(W' \\mid V) = (3/16)/(7/16)$ = **3/7**. Both versions are worked in the Numerical tab.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Draw the tree, multiply along, add the evidence paths, divide. The biggest prior isn't necessarily the biggest posterior.",
        },
      ],
    },
    {
      id: "map",
      heading: "Lesson 3: From Bayes' theorem to learning: MAP and ML hypotheses",
      slides: "13–20",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How Bayes' theorem becomes a decision rule: pick the hypothesis (class) with the highest posterior.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Bayes for hypotheses (slides 16–18)",
          text: "$$P(h \\mid D) = \\frac{P(D \\mid h)\\,P(h)}{P(D)}$$\n**MAP (maximum a posteriori) hypothesis:**\n$$h_{MAP} = \\arg\\max_{h \\in H} P(h \\mid D) = \\arg\\max_{h \\in H} \\frac{P(D \\mid h)P(h)}{P(D)} = \\arg\\max_{h \\in H} P(D \\mid h)P(h)$$\n($P(D)$ is the same for every h, so it can be dropped when comparing.)\n**ML (maximum likelihood) hypothesis:** if all priors are equal, $P(h_i) = P(h_j)$, then $h_{ML} = \\arg\\max_{h_i \\in H} P(D \\mid h_i)$.",
        },
        {
          type: "p",
          text: "**Generative model (slide 17):** to estimate the posterior $P(Y \\mid X)$, estimate the **likelihood** of the data given the target, $P(X \\mid Y)$, and the **prior** over targets, $P(Y)$. For a class $Y = c_k$: $P(Y = c_k \\mid X) = \\frac{P(X \\mid Y = c_k)P(Y = c_k)}{P(X)}$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Example 4 (slides 13–15): will the player play if it's sunny?",
          text: "14 days of (Weather, Play). Frequency table: Sunny: Yes 3, No 2 · Overcast: Yes 4, No 0 · Rainy: Yes 2, No 3. Totals: Yes 9, No 5; P(Sunny) = 5/14.\n\n$P(\\text{Yes} \\mid \\text{Sunny}) = \\frac{P(\\text{Sunny} \\mid \\text{Yes})P(\\text{Yes})}{P(\\text{Sunny})} = \\frac{(3/9)(9/14)}{5/14} = 0.60$\n\n$P(\\text{No} \\mid \\text{Sunny}) = \\frac{(2/5)(5/14)}{5/14} = 0.40$\n\n0.60 > 0.40 → **the player will play** (the MAP class is Yes).",
        },
        {
          type: "p",
          text: "**Features of Bayesian learning (slides 19–20):** prior knowledge combines with observed data to give the final probability of a hypothesis; prior knowledge comes as a prior for each hypothesis plus a probability distribution over data for each hypothesis; new instances can be classified by combining several hypotheses weighted by their probabilities. **Practical issues (slide 51):** it needs initial knowledge of many probabilities (often estimated from background knowledge or past data), and finding the Bayes-optimal hypothesis can be computationally costly in general.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$h_{\\text{MAP}}$ = $\\arg\\max P(D \\mid h) P(h)$. Equal priors → $h_{\\text{ML}}$ = $\\arg\\max P(D \\mid h)$. Drop $P(D)$ when comparing classes.",
        },
      ],
    },
    {
      id: "naive",
      heading: "Lesson 4: Many features at once: the Naive Bayes classifier",
      slides: "19–29",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to classify using several features without needing every combination of feature values in the data, by assuming **conditional independence**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Conditional independence and Naive Bayes (slides 21–22)",
          text: "**Definition:** X is conditionally independent of Y given Z if $P(X = x_i \\mid Y = y_j, Z = z_k) = P(X = x_i \\mid Z = z_k)$ for all i, j, k, i.e. $P(X \\mid Y, Z) = P(X \\mid Z)$. Example: P(Thunder | Rain, Lightning) = P(Thunder | Lightning).\n\n**Naive Bayes assumes the features $X_i$ are conditionally independent given the class Y:**\n$$P(X_1, \\dots, X_n \\mid Y) = \\prod_{j=1}^{n} P(X_j \\mid Y)$$\n$$\\text{so} \\quad P(Y \\mid X_1, \\dots, X_n) \\propto P(Y)\\prod_{j=1}^{n} P(X_j \\mid Y)$$",
        },
        {
          type: "p",
          text: "**Why “naive”?** In reality features are often related (hot days tend to be humid). Assuming they're independent *within each class* is a simplification, but it shrinks the job enormously. Instead of estimating a probability for every *combination* of feature values (which needs a huge data set), we estimate one small table per feature (slide 22). Naive Bayes assumes conditional independence; Bayes' theorem itself does not (slide 19).",
        },
        {
          type: "p",
          text: "**Slightly harder example: Example 5 (slides 23–25), play tennis.** 14 days with Outlook, Temp, Humidity, Windy and Play. Today = (Sunny, Hot, Normal, False). The per-feature tables (slide 24) give, for Yes (9 days) and No (5 days):",
        },
        {
          type: "table",
          head: ["Feature = today's value", "P(· | Yes)", "P(· | No)", "P(·)"],
          rows: [
            ["Outlook = Sunny", "3/9", "2/5", "5/14"],
            ["Temp = Hot", "2/9", "2/5", "4/14"],
            ["Humidity = Normal", "6/9", "1/5", "7/14"],
            ["Windy = False", "6/9", "2/5", "8/14"],
            ["Prior", "P(Yes) = 9/14", "P(No) = 5/14", ""],
          ],
        },
        {
          type: "p",
          text: "$$P(\\text{Yes} \\mid X) = \\frac{\\frac{3}{9}\\cdot\\frac{2}{9}\\cdot\\frac{6}{9}\\cdot\\frac{6}{9}\\cdot\\frac{9}{14}}{\\frac{5}{14}\\cdot\\frac{4}{14}\\cdot\\frac{7}{14}\\cdot\\frac{8}{14}} = 0.72, \\qquad P(\\text{No} \\mid X) = \\frac{\\frac{2}{5}\\cdot\\frac{2}{5}\\cdot\\frac{1}{5}\\cdot\\frac{2}{5}\\cdot\\frac{5}{14}}{\\text{same}} = 0.157$$ 0.72 > 0.157 → **the player will play tennis.** (The slide divides by the product of the feature probabilities, which also assumes the features are independent overall. That's why the two numbers don't add to 1. For the decision, only the comparison of numerators matters.)",
        },
        {
          type: "callout",
          kind: "example",
          title: "Example 6 (slides 26–29): animal species",
          text: "8 animals (4 of species S1, 4 of S2) with Colour, Legs, Height, Smelly. New instance: Green, 2 legs, Tall, not Smelly.\n\n$P(S1 \\mid X) \\propto \\frac{1}{2} \\cdot P(\\text{Green} \\mid S1) \\cdot P(2 \\mid S1) \\cdot P(\\text{Tall} \\mid S1) \\cdot P(\\text{No} \\mid S1)$\n$P(S2 \\mid X) \\propto \\frac{1}{2} \\cdot \\frac{1}{4} \\cdot \\frac{4}{4} \\cdot \\frac{2}{4} \\cdot \\frac{3}{4} = 0.047$\n\nThe new animal belongs to **S2**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): Example 6 height table",
          text: "In the data, the S1 animals' heights are Short, Tall, Short, Short, so **P(Tall | S1) = 1/4** and P(Short | S1) = 3/4. Slide 28's table (and slide 29's calculation) uses P(Tall | S1) = 3/4, giving 0.0117. With the correct value, $P(S_1 \\mid X)$ ∝ ½ · $2/4 \\cdot 1/4 \\cdot 1/4 \\cdot 1/4$ = **0.0039**. S2 (0.047) still wins, so the conclusion is unchanged.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "When to use Naive Bayes (slide 50)",
          text: "With a moderate or large training set, and when the attributes are (roughly) conditionally independent given the class. Successful uses include diagnosis and classifying text documents; also news categorisation, spam detection, face recognition and sentiment analysis (slide 49).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Score(class) = P(class) × Π P(featureᵢ | class); pick the biggest. Build one frequency table per feature, then read off fractions.",
        },
      ],
    },
    {
      id: "laplace",
      heading: "Lesson 5: What if a count is zero? Laplace smoothing and text classification",
      slides: "30–48",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Why a single zero count wrecks Naive Bayes, how Laplace smoothing fixes it, and how Naive Bayes classifies text as a “bag of words”.",
        },
        {
          type: "p",
          text: "**The zero-frequency problem (slide 30).** Naive Bayes multiplies probabilities. If any feature value never appeared with a class in training, its estimate is 0, so the **whole product is 0**, whatever the other features say. Slide 30's tax-evasion table (record 7 deleted) gives P(Refund = Yes | Yes) = 0 and P(Marital = Married | Yes) = 0, so for X = (Refund = Yes, Divorced, 120K) both P(X | No) and P(X | Yes) become 0, and **Naive Bayes can't classify X at all**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Laplace smoothing (slides 33–34)",
          text: "Add 1 (or in general a constant k) to every count, and add the number of possible words (vocabulary size T) to the divisor so the result stays at most 1:\n$$P(t_i \\mid c) = \\frac{N_{t_i,c} + 1}{N_c + T}$$\n$N_{t_i,c}$ = number of times word $t_i$ appears in class c's documents; $N_c$ = total words in class c; T = number of unique words (vocabulary size).\n**Text classifier (slide 33):** $P(c \\mid d) \\propto P(c)\\prod_{t_i \\in d} P(t_i \\mid c)$ for a document $d = (t_1, \\dots, t_k)$.",
        },
        {
          type: "p",
          text: "**Bag of words (slides 31–32).** Represent each sentence by its word frequencies, ignoring order, and assume each word is independent of the others given the tag. Training sentences: “A great game” (Sports), “The election was over” (Not sports), “Very clean match” (Sports), “A clean but forgettable game” (Sports), “It was a close election” (Not sports). Which tag fits **“A very close game”**? Without smoothing, “close” never appears in a Sports sentence, so P(close | Sports) = 0 and the Sports score is 0.",
        },
        {
          type: "table",
          caption: "With Laplace smoothing (slide 35): Sports has 11 words, Not sports 9, vocabulary 14",
          head: ["Word", "P(word | Sports)", "P(word | Not sports)"],
          rows: [
            ["a", "(2+1)/(11+14)", "(1+1)/(9+14)"],
            ["very", "(1+1)/(11+14)", "(0+1)/(9+14)"],
            ["close", "(0+1)/(11+14)", "(1+1)/(9+14)"],
            ["game", "(2+1)/(11+14)", "(0+1)/(9+14)"],
          ],
        },
        {
          type: "p",
          text: "Sports: $\\frac{3}{25}\\cdot\\frac{2}{25}\\cdot\\frac{1}{25}\\cdot\\frac{3}{25}\\cdot\\frac{3}{5} = 2.76 \\times 10^{-5}$. Not sports: $\\frac{2}{23}\\cdot\\frac{1}{23}\\cdot\\frac{2}{23}\\cdot\\frac{1}{23}\\cdot\\frac{2}{5} = 0.572 \\times 10^{-5}$. **“A very close game” → Sports.**",
        },
        {
          type: "callout",
          kind: "example",
          title: "Example 7 (slides 36–42): movie reviews",
          text: "Positive: “I loved the movie”, “A great movie, good movie”, “Great acting, a good movie” (14 words). Negative: “I hated the movie”, “Poor acting” (6 words). Vocabulary 10. Classify **“I hated the poor acting”**.\n\nPositive: $\\frac{1+1}{14+10}\\cdot\\frac{0+1}{24}\\cdot\\frac{1+1}{24}\\cdot\\frac{0+1}{24}\\cdot\\frac{1+1}{24}\\cdot\\frac{3}{5} = 6.03 \\times 10^{-7}$\nNegative: $\\left(\\frac{1+1}{6+10}\\right)^5 \\cdot \\frac{2}{5} = 1.22 \\times 10^{-5}$ → **Negative**.",
        },
        {
          type: "p",
          text: "**Example 8 (slides 43–48): spam words.** Word counts: Dear (normal 8, spam 2), Friend (5, 1), Lunch (3, 0), Money (1, 4); totals normal 17, spam 7. For “Dear Friend”: $P(N \\mid D, F) \\approx 0.94$ vs $P(S \\mid D, F) \\approx 0.11$ → **normal**. For “Lunch Money Money Money Money”: without smoothing, P(Lunch | S) = 0 makes the spam score 0, so *any* message containing “Lunch” is classed normal however many times “Money” appears. Adding 1 to each count (totals 21 and 11): normal $\\frac{21}{32}\\cdot\\frac{4}{21}\\cdot\\left(\\frac{2}{21}\\right)^4 = 0.00001$, spam $\\frac{11}{32}\\cdot\\frac{1}{11}\\cdot\\left(\\frac{5}{11}\\right)^4 = 0.00133$ → **spam**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Adding 1 to the numerator but forgetting **+T** in the denominator.\n- Counting **documents** instead of **word occurrences** for $N_c$ (“good movie … good movie” counts “movie” twice).\n- Forgetting the class prior $P(c)$ at the end.\n- A word repeated in the new message is multiplied in once **per occurrence** (Money⁴).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Zero count → zero product → fix with (count + 1)/(class words + vocabulary). Text NB: $P(c)$ × Π P(word | c) over the words of the document.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "formula",
      title: "Bayes",
      text: "$$P(E_i \\mid A) = \\frac{P(E_i)P(A \\mid E_i)}{\\sum_j P(E_j)P(A \\mid E_j)}$$ posterior = prior × likelihood / evidence",
    },
    { type: "diagram", name: "i4-bolt" },
    {
      type: "table",
      head: ["Idea", "Rule"],
      rows: [
        ["MAP", "$\\arg\\max P(D \\mid h) P(h)$"],
        ["ML", "$\\arg\\max P(D \\mid h)$ (equal priors)"],
        ["Naive Bayes", "$P(c)$ Π $P(x_i \\mid c)$, features conditionally independent given c"],
        ["Laplace", "(count + 1)/$(N_c + T)$"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Define events · draw the tree · denominator = all paths · NB: one table per feature · smoothing: +1 on top, +T below.",
    },
  ],

  glossary: [
    ["Prior", "$P(h)$, $P(E_i)$", "Belief in a hypothesis before seeing data"],
    ["Likelihood", "$P(D \\mid h)$", "Probability of the data if the hypothesis is true"],
    ["Posterior", "$P(h \\mid D)$", "Belief after seeing the data"],
    ["Evidence", "$P(D)$", "Overall probability of the data (total probability)"],
    ["MAP", "Maximum a posteriori", "Hypothesis with the largest posterior"],
    ["ML", "Maximum likelihood", "Hypothesis with the largest likelihood (equal priors)"],
    ["Conditional independence", "", "$P(X \\mid Y, Z) = P(X \\mid Z)$"],
    ["Naive Bayes", "", "Classifier assuming features are conditionally independent given the class"],
    ["Laplace smoothing", "Add-one smoothing", "Add 1 to each count (and T to the divisor) so no probability is 0"],
    ["Bag of words", "", "Represent text by word counts, ignoring order"],
    ["Rule of elimination", "", "Another name for the rule of total probability (slide 6)"],
  ],

  examTips: [
    "Always show the denominator $P(A)$ as its own line. It's usually part (i) of the question.",
    "For Naive Bayes, write the frequency tables first, then one product per class; state the decision rule (“the larger posterior wins”).",
    "If any conditional probability is 0, say so and apply Laplace smoothing (unless told not to).",
    "Keep fractions in NB products as long as possible. The numbers get tiny; use scientific notation.",
  ],

  problems: [
    {
      title: "Example 1: bonus scheme and managers (slides 8–9)",
      level: "From slides",
      hint: "(i) is total probability; (ii) is Bayes with the result of (i) as the denominator.",
      question: "X, Y, Z become managers with probabilities 4/9, 2/9, 1/3. The bonus scheme is introduced with probabilities 3/10, 1/2, 4/5 if X, Y, Z respectively become manager. (i) P(bonus scheme introduced)? (ii) Given it was introduced, P(X was appointed)?",
      solution: "### Set-up\n$E_1, E_2, E_3$ = X, Y, Z appointed; A = bonus introduced.\n### (i) Total probability\n$P(A) = \\frac{4}{9}\\cdot\\frac{3}{10} + \\frac{2}{9}\\cdot\\frac{1}{2} + \\frac{1}{3}\\cdot\\frac{4}{5} = \\frac{23}{45}$.\n### (ii) Bayes\n$P(E_1 \\mid A) = \\frac{(4/9)(3/10)}{23/45} =$ **$6/23 \\approx 0.261$**.",
    },
    {
      title: "Example 2: flu or measles (slide 10)",
      level: "From slides",
      question: "90% of sick children have flu, 10% measles. P(rash | measles) = 0.95, P(rash | flu) = 0.08. A child has a rash. P(flu)?",
      solution: "$P(F \\mid R) = \\frac{0.9(0.08)}{0.9(0.08) + 0.1(0.95)} = \\frac{0.072}{0.167} =$ **0.431**. (So P(measles | rash) = 0.569.)",
    },
    {
      title: "Example 3: spam filter false alarms (slides 11–12)",
      level: "From slides",
      question: "50% of emails are spam. The filter detects 99% of spam; the false-positive rate is 5%. If an email is detected as spam, what's the probability it is in fact not spam?",
      solution: "A = detected, B = spam. $P(B^c \\mid A) = \\frac{0.05(0.5)}{0.05(0.5) + 0.99(0.5)} =$ **$5/104 \\approx 0.048$**.",
    },
    {
      title: "Example 4: play when sunny? (slides 13–15)",
      level: "From slides",
      question: "From the 14-day table (Sunny: Yes 3, No 2; Overcast: Yes 4, No 0; Rainy: Yes 2, No 3), decide whether the player plays when it's sunny.",
      solution: "$P(Yes \\mid Sunny) = \\frac{(3/9)(9/14)}{5/14} =$ **0.60**; $P(No \\mid Sunny) = \\frac{(2/5)(5/14)}{5/14} =$ **0.40** → **plays**.",
    },
    {
      title: "Example 5: play tennis with four features (slides 23–25)",
      level: "From slides",
      hint: "Read each P(feature | class) from slide 24's tables.",
      question: "Today = (Outlook Sunny, Temp Hot, Humidity Normal, Windy False). Using the 14-day table, will the player play?",
      solution: "### Naive Bayes\nYes: $\\frac{3}{9}\\cdot\\frac{2}{9}\\cdot\\frac{6}{9}\\cdot\\frac{6}{9}\\cdot\\frac{9}{14} = 0.02116$. No: $\\frac{2}{5}\\cdot\\frac{2}{5}\\cdot\\frac{1}{5}\\cdot\\frac{2}{5}\\cdot\\frac{5}{14} = 0.00457$.\nDividing by $P(X) = \\frac{5}{14}\\cdot\\frac{4}{14}\\cdot\\frac{7}{14}\\cdot\\frac{8}{14} = 0.02915$ (as the slide does): **P(Yes | X) = 0.726**, **P(No | X) = 0.157**.\n### Answer\nYes wins → **the player will play tennis**.",
    },
    {
      title: "Example 6: classify an animal species (slides 26–29)",
      level: "From slides",
      hint: "Count within each species: e.g. S1 heights are Short, Tall, Short, Short.",
      question: "Data (Colour, Legs, Height, Smelly, Species): 1 White,3,Short,Yes,S1 · 2 Green,2,Tall,No,S1 · 3 Green,3,Short,Yes,S1 · 4 White,3,Short,Yes,S1 · 5 Green,2,Short,No,S2 · 6 White,2,Tall,No,S2 · 7 White,2,Tall,No,S2 · 8 White,2,Short,Yes,S2. (a) Estimate the conditional probabilities. (b) Classify {Green, 2 legs, Tall, Smelly = No}.",
      solution: "### (a) Tables $(P(S_1) = P(S_2) = 4/8)$\n| | S1 | S2 |\n|---|---|---|\n| White / Green | 2/4 / 2/4 | 3/4 / 1/4 |\n| Legs 2 / 3 | 1/4 / 3/4 | 4/4 / 0/4 |\n| Tall / Short | **1/4 / 3/4** | 2/4 / 2/4 |\n| Smelly Yes / No | 3/4 / 1/4 | 1/4 / 3/4 |\n### (b)\nS1: ½ · $2/4 \\cdot 1/4 \\cdot 1/4 \\cdot 1/4$ = **0.0039**. S2: ½ · $1/4 \\cdot 4/4 \\cdot 2/4 \\cdot 3/4$ = **0.047**. → **S2**.\n⚠️ The slide uses P(Tall | S1) = 3/4 (giving 0.0117); the data says 1/4. The decision is the same.",
    },
    {
      title: "Sports or not sports? (slides 31–35)",
      level: "From slides",
      question: "Training: “A great game” (S), “The election was over” (N), “Very clean match” (S), “A clean but forgettable game” (S), “It was a close election” (N). Classify “A very close game” with Laplace smoothing.",
      solution: "Sports words = 11, Not-sports words = 9, vocabulary = 14; $P(S) = 3/5$, $P(N) = 2/5$.\nSports: (3/25)(2/25)(1/25)(3/25)(3/5) = **$2.76 \\times 10^{-5}$**. Not sports: (2/23)(1/23)(2/23)(1/23)(2/5) = **$0.572 \\times 10^{-5}$**. → **Sports**.",
    },
    {
      title: "Example 7: movie review sentiment (slides 36–42)",
      level: "From slides",
      question: "Positive: “I loved the movie”, “A great movie, good movie”, “Great acting, a good movie”. Negative: “I hated the movie”, “Poor acting”. Classify “I hated the poor acting” with Laplace smoothing.",
      solution: "Positive words 14, negative 6, vocabulary 10 (I, loved, the, movie, hated, a, great, poor, acting, good).\nPositive: P(I|+) = 2/24, P(hated|+) = 1/24, P(the|+) = 2/24, P(poor|+) = 1/24, P(acting|+) = 2/24; × 3/5 → **$6.03 \\times 10^{-7}$**.\nNegative: each word $(1 + 1)/(6 + 10) = 0.125$; $0.125^5 \\times 2/5$ → **$1.22 \\times 10^{-5}$**. → **Negative**.",
    },
    {
      title: "Example 8: “Dear Friend” and “Lunch Money⁴” (slides 43–48)",
      level: "From slides",
      hint: "Counts: Dear 8/2, Friend 5/1, Lunch 3/0, Money 1/4 (normal/spam); totals 17/7.",
      question: "(a) Is “Dear Friend” normal or spam? (b) Is “Lunch Money Money Money Money” normal or spam? Why is smoothing needed in (b)?",
      solution: "### (a)\n$P(N \\mid D, F) = \\frac{(8/17)(5/17)(17/24)}{(10/24)(6/24)} = 0.94$; $P(S \\mid D, F) = \\frac{(2/7)(1/7)(7/24)}{(10/24)(6/24)} = 0.11$ → **normal**. (Slide: 0.9423 and 0.1153, from rounded intermediates.)\n### (b) Without smoothing\nNormal: $(17/24) (3/17) (1/17)^4 = 1.5 \\times 10^{-6}$; spam: $(7/24) (0/7) (4/7)^4$ = **0**, because “Lunch” never appeared in spam.\n### With Laplace (+1 per word; totals 21 and 11; $P(N) = 21/32$, $P(S) = 11/32$ as on the slide)\nNormal: $(21/32) (4/21) (2/21)^4$ = **$1.0 \\times 10^{-5}$**; spam: $(11/32) (1/11) (5/11)^4$ = **$1.33 \\times 10^{-3}$** → **spam**.",
    },
    {
      title: "Problem 1: board of directors (slides 52–53)",
      level: "From slides",
      question: "Set 1 wins with probability 0.6, set 2 with 0.4. The new product is introduced with probability 0.8 if set 1 wins, 0.3 if set 2 wins. P(product introduced)?",
      solution: "Total probability: $0.6 (0.8) + 0.4 (0.3) = 0.48 + 0.12$ = **0.6**.",
    },
    {
      title: "Problem 2: bolt factory (slides 54–56)",
      level: "From slides",
      question: "A, B, C make 25%, 35%, 40% of bolts with 5%, 4%, 2% defective. A random bolt is defective. P(made by (i) A, (ii) B or C)?",
      solution: "$P(E) = 0.0125 + 0.014 + 0.008 = 0.0345$.\n(i) 0.0125/0.0345 = **0.362**.\n(ii) (0.014 + 0.008)/0.0345 = **0.638** (slide: $0.41 + 0.23 = 0.64$).",
    },
    {
      title: "Problem 3: cause of a fire (slides 57–58)",
      level: "From slides",
      question: "P(short circuit) = 0.8, P(LPG explosion) = 0.2. P(fire | short circuit) = 0.30, P(fire | LPG) = 0.95. Which cause is more probable given a fire?",
      solution: "P(fire) = $0.24 + 0.19 = 0.43$. P(short | fire) = 0.24/0.43 = **$24/43 \\approx 0.558$**; P(LPG | fire) = **$19/43 \\approx 0.442$** → **short circuit** is the more probable cause.\n(The stem omits P(LPG); $0.2 = 1 - 0.8$ is used, as on the solution slide.)",
    },
    {
      title: "Problem 4: who became Vice Chancellor? (slides 59–60)",
      level: "From slides",
      question: "Academician, businessman, politician become VC with probabilities 0.5, 0.3, 0.2; research is promoted with probabilities 0.8, 0.6, 0.4. Research was promoted. P(academician is VC)?",
      solution: "$P(R) = 0.40 + 0.18 + 0.08 = 0.66$. P(academician | R) = 0.40/0.66 = **0.606**.",
    },
    {
      title: "Problem 5: incomplete repairs (slides 61–62)",
      level: "From slides",
      question: "Janet 20% (incomplete 1 in 20), Tom 60% (1 in 10), Georgia 15% (1 in 10), Peter 5% (1 in 20). Given an incomplete repair, P(Janet)?",
      solution: "$\\frac{0.20(0.05)}{0.20(0.05) + 0.60(0.10) + 0.15(0.10) + 0.05(0.05)} = \\frac{0.01}{0.0875} =$ **0.114**.",
    },
    {
      title: "Problem 6: missing light aircraft (slides 63–64)",
      level: "From slides",
      hint: "P(locator | not discovered) = $1 - 0.9 = 0.1$.",
      question: "70% of disappeared aircraft are discovered. 60% of discovered ones have a locator; 90% of undiscovered ones do not. (a) Has a locator: P(not discovered)? (b) No locator: P(discovered)?",
      solution: "Paths: disc ∩ loc = 0.42; disc ∩ no loc = 0.28; not ∩ loc = 0.03; not ∩ no loc = 0.27.\n(a) 0.03/(0.03 + 0.42) = **0.067**. (b) 0.28/(0.28 + 0.27) = **0.509**.",
    },
    {
      title: "Problem 7: bidding firms V and W (slides 65–66)",
      level: "From slides",
      hint: "Check what the stem says P(W bids) is.",
      question: "P(V gets the job | W doesn't bid) = 3/4. P(W bids) = 3/4, and if W bids, P(V gets the job) = 1/3. (a) P(V gets the job)? (b) If V gets the job, P(W did not bid)?",
      solution: "### With the stem's values $(P(W) = 3/4, P(W') = 1/4)$\n(a) $P(V) = \\frac{1}{3}\\cdot\\frac{3}{4} + \\frac{3}{4}\\cdot\\frac{1}{4} = \\frac{1}{4} + \\frac{3}{16} =$ **$7/16 \\approx 0.4375$**.\n(b) $P(W' \\mid V) = \\frac{3/16}{7/16} =$ **$3/7 \\approx 0.429$**.\n### ⚠️ The slide's solution\nIt uses $P(W) = 1/3$, $P(W') = 2/3$: $P(V) = (1/3) (1/3) + (3/4) (2/3) = 11/18$ and $P(W' \\mid V) = (1/2)/(11/18) = 9/11$. That contradicts the stem's “probability is 3/4 that W will bid”. Use the stem's data unless your instructor says otherwise.",
    },
    {
      title: "Level 1: a screening test",
      level: "Level 1",
      hint: "Prior 0.01; likelihoods 0.9 and 0.05.",
      question: "1% of people have a condition. A test detects it 90% of the time and gives a false positive 5% of the time. A person tests positive. P(has the condition)?",
      solution: "$\\frac{0.01(0.9)}{0.01(0.9) + 0.99(0.05)} = \\frac{0.009}{0.0585} =$ **0.154**. Most positives are false alarms because the condition is rare.",
    },
    {
      title: "Level 1: which machine?",
      level: "Level 1",
      question: "Machine 1 makes 70% of items (2% defective) and machine 2 makes 30% (5% defective). A defective item is found. P(machine 2)?",
      solution: "$\\frac{0.3(0.05)}{0.7(0.02) + 0.3(0.05)} = \\frac{0.015}{0.029} =$ **0.517**.",
    },
    {
      title: "Level 2: weather table, rainy day",
      level: "Level 2",
      question: "Using Example 4's table, find P(No | Rainy) and P(Yes | Overcast).",
      solution: "P(No | Rainy) = (3/5)(5/14)/(5/14) = **0.6**. P(Yes | Overcast) = (4/9)(9/14)/(4/14) = **1** (every overcast day was a play day).",
    },
    {
      title: "Level 2: a zero count in the tennis data",
      level: "Level 2",
      hint: "Look at P(Overcast | No).",
      question: "Using Example 5's tables (no smoothing), classify X = (Overcast, Cool, High, True).",
      solution: "Yes: (4/9)(3/9)(3/9)(3/9)(9/14) = **0.0106**. No: P(Overcast | No) = 0/5, so the No score is **0** → **Yes**. The single zero decides everything, which is exactly the zero-frequency problem Laplace smoothing addresses.",
    },
    {
      title: "Level 3: smoothed sentiment",
      level: "Level 3",
      question: "With Example 7's training data and Laplace smoothing, classify “great movie”.",
      solution: "Positive: P(great | +) = (2+1)/24, P(movie | +) = (4+1)/24 → (3/24)(5/24)(3/5) = **0.0156**. Negative: P(great | −) = (0+1)/16, P(movie | −) = (1+1)/16 → (1/16)(2/16)(2/5) = **0.0031** → **Positive**.",
    },
    {
      title: "Level 3: late parcels",
      level: "Level 3",
      question: "Couriers A, B, C deliver 50%, 30%, 20% of parcels; 4%, 6%, 10% of their parcels are late. A parcel is late. Which courier is most likely responsible?",
      solution: "P(late) = $0.020 + 0.018 + 0.020 = 0.058$. Posteriors: A 0.345, B 0.310, C 0.345. **A and C are equally likely** (each 0.345): C's high late rate exactly offsets its small share.",
    },
  ],

  theory: [
    {
      title: "State and prove Bayes' theorem",
      level: "Level 3",
      question: "State Bayes' theorem and prove it.",
      solution: "### Statement\nIf $E_1, …, E_n$ are mutually exclusive with $P(E_i) > 0$, and $A \\subseteq \\bigcup E_i$ with $P(A) > 0$, then $P(E_i \\mid A) = \\frac{P(E_i)P(A \\mid E_i)}{\\sum_j P(E_j)P(A \\mid E_j)}$.\n### Proof\n$A = \\bigcup (A \\cap E_j)$ with disjoint pieces, so $P(A) = \\sum P(A \\cap E_j)$; each $P(A \\cap E_j) = P(E_j)P(A \\mid E_j)$ (multiplication rule), giving total probability. Then $P(E_i \\mid A) = P(E_i \\cap A)/P(A)$; substitute both. ∎",
    },
    {
      title: "Why is Naive Bayes “naive”?",
      level: "Level 2",
      question: "Explain the conditional-independence assumption of Naive Bayes, why it's useful, and when it's reasonable.",
      solution: "Naive Bayes assumes the features are conditionally independent given the class: $P(X_1, …, X_n \\mid Y) = \\prod P(X_j \\mid Y)$. It's “naive” because real features are often related. It's useful because we only estimate one small table per feature instead of a probability for every combination of feature values, which would need vast data. It works well with moderate-to-large training sets when features are roughly independent given the class, e.g. words in text, medical diagnosis (slide 50).",
    },
    {
      title: "MAP vs ML",
      level: "Level 2",
      question: "Define the MAP and ML hypotheses. When do they coincide?",
      solution: "$h_{MAP} = \\arg\\max_h P(D \\mid h)P(h)$ uses both likelihood and prior. $h_{ML} = \\arg\\max_h P(D \\mid h)$ uses the likelihood only. They coincide when all hypotheses have **equal priors** (slide 18).",
    },
    {
      title: "Laplace smoothing",
      level: "Level 1",
      question: "What problem does Laplace smoothing solve, and how?",
      solution: "If a feature value never occurs with a class in training, its estimated probability is 0 and the Naive Bayes product for that class becomes 0, regardless of the other evidence (slides 30, 47). Laplace smoothing adds 1 (or k) to every count and adds the vocabulary size T to the denominator, $P(t \\mid c) = (N_{t,c} + 1)/(N_c + T)$, so no probability is 0 and they still sum to 1.",
    },
  ],

  quiz: [
    {
      topic: "Bayes' theorem",
      type: "num",
      q: "P(flu) = 0.9, P(measles) = 0.1, P(rash | flu) = 0.08, P(rash | measles) = 0.95. P(flu | rash)? (3 decimals)",
      answer: 0.431,
      tol: 0.002,
      why: "$0.072/(0.072 + 0.095) = 0.431$.",
    },
    {
      topic: "Bayes' theorem",
      type: "num",
      q: "Bolts: A 25% (5% def), B 35% (4%), C 40% (2%). P(A | defective)? (3 decimals)",
      answer: 0.362,
      tol: 0.002,
      why: "0.0125/0.0345.",
    },
    {
      topic: "Bayes' theorem",
      type: "num",
      q: "Spam 50%, detection 99%, false positive 5%. P(not spam | flagged)? (fraction or decimal)",
      answer: 5 / 104,
      display: "5/104",
      tol: 0.002,
      why: "0.025 / (0.025 + 0.495).",
    },
    {
      topic: "Bayes' theorem",
      q: "In Bayes' theorem, the denominator $\\sum P(E_i) P(A \\mid E_i)$ equals…",
      options: ["$P(E_i \\mid A)$", "$P(A)$ by total probability", "1 always", "$P(E_i)$"],
      answer: 1,
      why: "It's the total probability of the evidence A.",
      wrong: ["That's the result (the posterior).", null, "The posteriors sum to 1, not the denominator.", "That's a prior."],
    },
    {
      topic: "Bayes' theorem",
      type: "num",
      q: "VC: priors 0.5/0.3/0.2, P(research | ·) = 0.8/0.6/0.4. P(academician | research)? (3 decimals)",
      answer: 0.606,
      tol: 0.002,
      why: "0.4/0.66.",
    },
    {
      topic: "MAP / ML",
      q: "The ML hypothesis equals the MAP hypothesis when…",
      options: ["The data is large", "All priors are equal", "Features are independent", "$P(D) = 1$"],
      answer: 1,
      why: "With equal $P(h)$, maximising $P(D \\mid h) P(h)$ is the same as maximising $P(D \\mid h)$.",
      wrong: ["Data size doesn't make priors equal.", null, "That's the Naive Bayes assumption, a different idea.", "$P(D)$ is dropped either way."],
    },
    {
      topic: "MAP / ML",
      type: "num",
      q: "Weather table: P(Sunny | Yes) = 3/9, P(Yes) = 9/14, P(Sunny) = 5/14. P(Yes | Sunny)?",
      answer: 0.6,
      tol: 0.001,
      why: "(3/9)(9/14)/(5/14) = 0.6.",
    },
    {
      topic: "Naive Bayes",
      q: "Naive Bayes assumes the features are…",
      options: ["Mutually exclusive", "Conditionally independent given the class", "Normally distributed", "Equally likely"],
      answer: 1,
      why: "P($X_1$, …, $X_n$ | Y) = Π $P(X_j \\mid Y)$.",
      wrong: ["Features can co-occur.", null, "Not assumed in the slides' discrete examples.", "Feature values can have any frequencies."],
    },
    {
      topic: "Naive Bayes",
      type: "num",
      q: "Species S2 score: ½ × P(Green|S2) 1/4 × P(2 legs|S2) 1 × P(Tall|S2) 1/2 × P(No smell|S2) 3/4 = ? (3 decimals)",
      answer: 0.047,
      tol: 0.001,
      why: "$0.5 \\times 0.25 \\times 1 \\times 0.5 \\times 0.75 = 0.046875$.",
    },
    {
      topic: "Laplace",
      type: "num",
      q: "A word appears 0 times in class c, which has 9 words; vocabulary 14. Laplace-smoothed P(word | c)? (fraction or decimal)",
      answer: 1 / 23,
      display: "1/23",
      tol: 0.001,
      why: "(0 + 1)/(9 + 14).",
    },
    {
      topic: "Laplace",
      q: "Without smoothing, “Lunch Money Money Money Money” is classed as normal because…",
      options: ["Money is rare in spam", "P(Lunch | spam) = 0 makes the spam score 0", "Normal has the bigger prior only", "Words are mutually exclusive"],
      answer: 1,
      why: "One zero factor zeroes the whole product.",
      wrong: ["Money is common in spam (4 of 7 words).", null, "The prior alone wouldn't override Money⁴.", "Not an assumption of NB."],
    },
    {
      topic: "Laplace",
      q: "In $P(t \\mid c)$ = $(N_{\\text{tc}} + 1)/(N_c + T)$, T is…",
      options: ["Total number of documents", "Number of unique words (vocabulary size)", "Number of classes", "Number of times t appears"],
      answer: 1,
      why: "Adding 1 for each of T words means adding T to the divisor.",
      wrong: ["Documents aren't counted; words are.", null, "Classes don't enter the word probability.", "That's N_tc."],
    },
  ],
};
