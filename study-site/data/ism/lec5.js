// ISM — Lecture 5 (CS-5): Random variables, expectation & variance, joint distributions
// Source: CourseFiles/ISM/Lec5.pdf (69 slides). Every topic cites its slides; nothing outside the deck is taught.

export default {
  title: "Random Variables, Expectation & Joint Distributions",
  source: "Lec5.pdf (CS-5) · 69 slides",
  quizMode: "step",
  overview:
    "So far each probability question has been a one-off. A **random variable** packages a whole experiment into a number: the number of heads, the TV sets sold today, a laptop's years of service. Its **probability distribution** lists (or draws, or gives by formula) how likely each value is: a **pmf** for counted (discrete) variables, a **pdf** for measured (continuous) ones, where probability becomes **area under a curve**. From the distribution we compute the **expected value** (long-run average) and **variance** (spread), with handy rules for scaling and shifting. Finally, two random variables at once: **joint distributions**, **marginals** (sum or integrate out the other variable), and **independence** $f(x, y) = g(x) h(y)$. This is the foundation for the named distributions in Lecture 6.",

  simpleIntro: "A **random variable** turns the outcome of an experiment into a number (heads in two tosses, TVs sold today, waiting time). Once outcomes are numbers you can list how likely each value is (the **distribution**), find the long-run average (**expected value**) and the spread (**variance**). This lecture does that for countable values (discrete), measured values (continuous) and two variables at once. All examples are the lecturer's own.",

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
              "title": "Discrete RV",
              "text": "Values you can **count**: 0, 1, 2, …. Each value gets a probability (a **pmf**) and the probabilities add to 1.",
              "tag": "Bars",
              "example": "TV sets sold per day",
              "figure": "i5-pmf"
            },
            {
              "title": "Continuous RV",
              "text": "Values you **measure** (time, weight). Probability is the **area** under a density curve (a **pdf**).",
              "tag": "Area",
              "example": "Lifetime of a bulb",
              "figure": "i5-pdf"
            },
            {
              "title": "Expected value & variance",
              "text": "The long-run **average** of the RV, and how far values typically stray from it.",
              "tag": "Centre & spread",
              "example": "KPN sells 1.2 TVs a day on average"
            }
          ]
        }
      ]
    },
    {
      "id": "s-rv",
      "heading": "2. Random variables and the pmf",
      "slides": "5–12, 18–20, 23, 26–28",
      "blocks": [
        {
          "type": "p",
          "text": "Toss two coins and let X = number of heads. The outcomes TT, HT, TH, HH become the numbers 0, 1, 1, 2. The **pmf** (probability mass function) $f(x) = P(X = x)$ lists the probability of each value."
        },
        {
          "type": "table",
          "head": [
            "x (heads)",
            "0",
            "1",
            "2"
          ],
          "rows": [
            [
              "f(x)",
              "1/4",
              "2/4",
              "1/4"
            ]
          ],
          "caption": "Lecturer's slide 11"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "A valid pmf needs two things",
          "text": "$$f(x) \\ge 0 \\text{ for every } x \\qquad \\text{and} \\qquad \\sum_x f(x) = 1$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 2): find k",
          "text": "$p(x) = k, 3k, 5k, 7k, 9k$ for $x = 0, 1, 2, 3, 4$. Find k and $P(X < 3)$.\n\n**Approach:** an unknown constant in a pmf → set the total to 1.\n$k + 3k + 5k + 7k + 9k = 25k = 1 \\Rightarrow k = \\frac{1}{25}$. Then $P(X < 3) = k + 3k + 5k = \\frac{9}{25}$."
        },
        {
          "type": "answer",
          "value": "k = 1/25 · P(X < 3) = 9/25",
          "text": "“< 3” means 0, 1, 2: it excludes 3. “≤ 3” would include it."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "CDF (cumulative distribution)",
          "text": "$$F(x) = P(X \\le x) = \\sum_{t \\le x} f(t) \\qquad P(a < X \\le b) = F(b) - F(a)$$ A staircase that climbs from 0 to 1. For k above: F = 1/25, 4/25, 9/25, 16/25, 1."
        },
        {
          "type": "diagram",
          "name": "i5-cdf"
        }
      ]
    },
    {
      "id": "s-ev",
      "heading": "3. Expected value and variance",
      "slides": "13–17, 21–27",
      "blocks": [
        {
          "type": "p",
          "text": "$E(X)$ is a **weighted average**: each value weighted by how often it happens. If you watched the experiment for years, the average would settle at $E(X)$. It's Lecture 1's grouped mean with probabilities in place of frequencies."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formulas",
          "text": "$$E(X) = \\mu = \\sum x\\,f(x) \\qquad \\text{Var}(X) = \\sum (x - \\mu)^2 f(x) = E(X^2) - \\mu^2 \\qquad \\sigma = \\sqrt{\\text{Var}(X)}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 21–22): KPN Appliances",
          "text": "Over 200 days, TV sales were 0, 1, 2, 3, 4 sets with probabilities 0.40, 0.25, 0.20, 0.05, 0.10.\n\n**Mean:** $E(X) = 0(0.4) + 1(0.25) + 2(0.2) + 3(0.05) + 4(0.1) = 1.2$.\n**Shortcut variance:** $E(X^2) = 0 + 0.25 + 0.8 + 0.45 + 1.6 = 3.1$, so $\\text{Var}(X) = 3.1 - 1.2^2 = 1.66$, $\\sigma = 1.288$."
        },
        {
          "type": "answer",
          "value": "μ = 1.2 TVs a day · σ² = 1.66 · σ ≈ 1.29"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Transformation rules",
          "text": "$$E(aX + b) = aE(X) + b \\qquad \\text{Var}(aX + b) = a^2\\,\\text{Var}(X)$$ Adding a constant **shifts** without spreading; multiplying by a stretches the SD by $|a|$ and the variance by $a^2$."
        },
        {
          "type": "check",
          "q": "E(X) = 1.2, Var(X) = 1.66. Profit = 4X + 3. What is Var(profit)?",
          "options": [
            "6.64",
            "9.64",
            "26.56",
            "7.8"
          ],
          "answer": 2,
          "why": "$4^2 \\times 1.66 = 26.56$. The +3 doesn't change the spread. (E(profit) = 7.8.)"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Sign trap",
          "text": "$\\text{Var}(X) = E(X^2) \\,{-}\\, [E(X)]^2$. Slide 25 prints a “+” by mistake; its next line subtracts correctly."
        }
      ]
    },
    {
      "id": "s-cont",
      "heading": "4. Continuous random variables: probability is area",
      "slides": "30–40",
      "blocks": [
        {
          "type": "p",
          "text": "A waiting time can be 2.31 or 2.3104 minutes: there are too many values to give each a probability. Instead a **density** curve $f(x)$ is drawn, and $P(a < X < b)$ is the **area under the curve** between a and b. The probability of any single exact value is 0."
        },
        {
          "type": "diagram",
          "name": "i5-pdf"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "pdf rules",
          "text": "$$f(x) \\ge 0, \\quad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1, \\quad P(a < X < b) = \\int_a^b f(x)\\,dx$$ $$F(x) = \\int_{-\\infty}^{x} f(u)\\,du, \\quad E(X) = \\int x f(x)\\,dx, \\quad \\text{Var}(X) = \\int x^2 f(x)\\,dx - \\mu^2$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 1): $f(x) = 2e^{-2x}$, $x > 0$",
          "text": "Find $P(1 < X < 3)$ and $P(X > 0.5)$.\n\nThe integral of $2e^{-2x}$ is $-e^{-2x}$.\n$P(1 < X < 3) = [-e^{-2x}]_1^3 = e^{-2} - e^{-6} = 0.133$\n$P(X > 0.5) = [-e^{-2x}]_{0.5}^{\\infty} = e^{-1} = 0.368$"
        },
        {
          "type": "answer",
          "value": "0.133 and 0.368",
          "text": "CDF: $F(x) = 1 - e^{-2x}$; mean $1/2$, variance $1/4$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slide 39: find k",
          "text": "$f(x) = kxe^{-4x^2}$, $x > 0$. Set the area to 1: substitute $u = 4x^2$ ($du = 8x\\,dx$) → $\\frac{k}{8}\\int_0^{\\infty} e^{-u}du = \\frac{k}{8} = 1$ → **k = 8**."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "A density is not a probability",
          "text": "$f(0) = 2$ above is bigger than 1, and that's fine. Only **areas** are probabilities."
        },
        {
          "type": "check",
          "q": "Y has CDF F(y) = y/4 on [0, 4]. P(Y > 1.5)?",
          "options": [
            "1.5/4",
            "5/8",
            "1/4",
            "3/8"
          ],
          "answer": 1,
          "why": "$1 - F(1.5) = 1 - 0.375 = 0.625 = 5/8$ (lecturer's slide 40)."
        }
      ]
    },
    {
      "id": "s-joint",
      "heading": "5. Two random variables: joint, marginal, independent",
      "slides": "46–64",
      "blocks": [
        {
          "type": "p",
          "text": "A **joint table** gives $P(X = x, Y = y)$ for every pair, and all the cells add to 1. Add across a row or down a column to get the distribution of **one** variable alone: the **marginal** (it's written in the table's margin)."
        },
        {
          "type": "table",
          "head": [
            "",
            "Y = 0",
            "Y = 1",
            "Y = 2",
            "Y = 3",
            "g(x)"
          ],
          "rows": [
            [
              "X = 0",
              "0",
              "1/8",
              "1/4",
              "1/8",
              "1/2"
            ],
            [
              "X = 1",
              "1/8",
              "1/4",
              "1/8",
              "0",
              "1/2"
            ],
            [
              "h(y)",
              "1/8",
              "3/8",
              "3/8",
              "1/8",
              "1"
            ]
          ],
          "caption": "Lecturer's slides 54–55, with the margins added"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Reading the table",
          "text": "$P(X + Y \\ge 2)$: list the qualifying cells (0,2), (0,3), (1,1), (1,2), (1,3) → $\\frac{1}{4} + \\frac{1}{8} + \\frac{1}{4} + \\frac{1}{8} + 0 = \\frac{3}{4}$."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Independence",
          "text": "$$X, Y \\text{ independent} \\iff f(x, y) = g(x)\\,h(y) \\text{ for } \\textbf{every} \\text{ cell}$$ Continuous: same idea with densities (e.g. $e^{-(x+y)} = e^{-x} \\cdot e^{-y}$ → independent)."
        },
        {
          "type": "check",
          "q": "In the table above, are X and Y independent?",
          "options": [
            "Yes",
            "No: cell (0, 0) is 0 but g(0)h(0) = 1/16",
            "Yes, because both margins are 1/2",
            "Can't tell"
          ],
          "answer": 1,
          "why": "One failing cell is enough to prove dependence; proving independence needs every cell."
        }
      ]
    },
    {
      "id": "s-compare",
      "heading": "6. Discrete vs continuous at a glance",
      "slides": "",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Discrete",
            "Continuous"
          ],
          "rows": [
            [
              "Values",
              "countable (0, 1, 2, …)",
              "an interval (measured)"
            ],
            [
              "Distribution",
              "pmf $f(x) = P(X = x)$",
              "pdf $f(x)$: a density, not a probability"
            ],
            [
              "Total",
              "$\\sum f(x) = 1$",
              "$\\int f(x)\\,dx = 1$"
            ],
            [
              "P(a ≤ X ≤ b)",
              "add the bars",
              "area $\\int_a^b f(x)\\,dx$"
            ],
            [
              "P(X = a)",
              "can be > 0",
              "always 0"
            ],
            [
              "Mean",
              "$\\sum x f(x)$",
              "$\\int x f(x)\\,dx$"
            ]
          ]
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
          "q": "f(x) = x/6 for x = 1, 2, 3. Valid pmf?",
          "options": [
            "Yes",
            "No, it sums to 2",
            "No, f(3) > 0.5",
            "Only if x is continuous"
          ],
          "answer": 0,
          "why": "1/6 + 2/6 + 3/6 = 1 and all are ≥ 0 (lecturer's slide 12)."
        },
        {
          "type": "check",
          "q": "For a continuous RV, P(X = 2) equals…",
          "options": [
            "f(2)",
            "F(2)",
            "0",
            "1/2"
          ],
          "answer": 2,
          "why": "A single point has zero width, so zero area."
        },
        {
          "type": "check",
          "q": "X takes 1, 2, 3 with probabilities 0.2, 0.5, 0.3. E(X)?",
          "options": [
            "2",
            "2.1",
            "1.9",
            "6"
          ],
          "answer": 1,
          "why": "$0.2 + 1.0 + 0.9 = 2.1$."
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
          "text": "- **pmf:** every $f(x) \\ge 0$ and they sum to 1. Unknown k → set the sum (or integral) to 1.\n- **CDF** $F(x) = P(X \\le x)$; $P(a < X \\le b) = F(b) - F(a)$.\n- $E(X) = \\sum x f(x)$; $\\text{Var} = E(X^2) - \\mu^2$; $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$.\n- **Continuous:** probability = area; $P(X = a) = 0$; replace sums with integrals.\n- **Joint:** marginal = row/column sum; independent only if **every** cell = $g(x)h(y)$."
        }
      ]
    }
  ],

  summary: [
    {
      id: "rv",
      heading: "Lesson 1: Turning outcomes into numbers: random variables",
      slides: "5–9, 29",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "What a random variable is, and how to tell discrete from continuous.",
        },
        {
          type: "p",
          text: "**Random variable (slide 5):** a variable that takes numerical values determined by the random outcome of an experiment, with exactly one number assigned to each sample point. Formally, it's a **function** whose domain is the sample space and whose range is the real numbers. Toss two coins: S = {HH, HT, TH, TT}, and X = number of heads maps HH → 2, HT → 1, TH → 1, TT → 0.",
        },
        {
          type: "table",
          caption: "Discrete vs continuous (slides 6–8)",
          head: ["", "Discrete", "Continuous"],
          rows: [
            ["Values", "Finite or countably infinite", "Any value in an interval"],
            ["Arises from", "**Counting**", "**Measuring** (time, distance, weight, volume)"],
            ["Examples", "Number of sales, calls, people in line, mistakes per page, heads in two tosses", "Length, depth, volume, time, weight, height (150–200 cm)"],
            ["Distribution", "Probability **mass** function (pmf) $f(x)$", "Probability **density** function (pdf) $f(x)$"],
            ["Cumulative", "CDF $F(x)$", "CDF $F(x)$"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Slide exercise (slide 9): discrete or continuous? (solution prepared for the website)",
          text: "**Discrete** (counted): books in a library, passengers on a bus, goals in a football match, steps taken in a day.\n**Continuous** (measured): weight of a watermelon (kg), rainfall in a day (mm), temperature of coffee (°C), length of a bridge (m), time to bake a cake (min).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "RV = function from outcomes to numbers. Count → discrete (pmf). Measure → continuous (pdf).",
        },
      ],
    },
    {
      id: "pmf",
      heading: "Lesson 2: How likely is each value? Discrete probability distributions",
      slides: "10–12, 18–20, 23, 26–28",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Probability mass function (slide 10)",
          text: "$f(x) = P(X = x)$ gives the probability of each value. Required conditions:\n$$f(x) \\ge 0 \\text{ for every } x, \\qquad \\sum_x f(x) = 1$$\n(The slide writes $f(x) > 0$; values with probability 0 are simply left out.) A pmf can be given as a **table**, a **graph** or an **equation**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example (slide 11): heads in two tosses",
          text: "$f(0) = P(TT) = \\frac{1}{4}$, $f(1) = P(HT, TH) = \\frac{2}{4} = \\frac{1}{2}$, $f(2) = P(HH) = \\frac{1}{4}$. All are ≥ 0 and they sum to 1, so it's a valid pmf.",
        },
        {
          type: "p",
          text: "**Is it valid? (slide 12)** A shooter hits the target in 1, 2 or 3 shots, with proposed $f(x) = x/6$. Check: $f(1) = 1/6$, $f(2) = 2/6$, $f(3) = 3/6$, all ≥ 0, and $1/6 + 2/6 + 3/6 = 1$. **Yes, valid.**",
        },
        {
          type: "p",
          text: "**From data to a distribution: KPN Appliances (slides 18–20).** Over 200 days, TV sales were 0 units on 80 days, 1 on 50, 2 on 40, 3 on 10, 4 on 20. Dividing by 200 gives the **empirical** pmf: $f(0) = 0.40$, $f(1) = 0.25$, $f(2) = 0.20$, $f(3) = 0.05$, $f(4) = 0.10$. (Compare: number of customers arriving in a day can be 0, 1, 2, … with no upper limit. That's a discrete RV with infinitely many values.)",
        },
        { type: "diagram", name: "i5-pmf" },
        {
          type: "callout",
          kind: "formula",
          title: "Cumulative distribution function, CDF (slide 23)",
          text: "$$F(x) = P(X \\le x) = \\sum_{t \\le x} f(t)$$\nIt rises in steps from 0 to 1. Useful: $P(a < X \\le b) = F(b) - F(a)$.",
        },
        {
          type: "p",
          text: "**Slide 23 example:** two dice, X = sum. $f(2) = 1/36$, $f(3) = 2/36$, …, $f(7) = 6/36$, …, $f(12) = 1/36$; the CDF accumulates: $F(2) = 1/36$, $F(3) = 3/36$, $F(4) = 6/36$, $F(5) = 10/36$, $F(6) = 15/36$, $F(7) = 21/36$, $F(8) = 26/36$, $F(9) = 30/36$, $F(10) = 33/36$, $F(11) = 35/36$, $F(12) = 1$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Example 2 (slides 26–27), find k",
          text: "$p(x) = k$, 3k, 5k, 7k, 9k for $x = 0$, 1, 2, 3, 4.\n\n(i) $\\sum p = 25k = 1 \\Rightarrow k = 1/25$.\n(ii) $P(X < 3) = k + 3k + 5k = 9/25$.\n(iii) $P(0 < X < 4) = 3k + 5k + 7k = 15/25 = 3/5$.\n(iv) CDF: $F = 0$ $(x < 0)$, 1/25 $(0 \\le x < 1)$, 4/25 $(1 \\le x < 2)$, 9/25 $(2 \\le x < 3)$, 16/25 $(3 \\le x < 4)$, 1 $(x \\ge 4)$.",
        },
        { type: "diagram", name: "i5-cdf" },
        {
          type: "callout",
          kind: "formula",
          title: "Discrete uniform distribution (slide 28)",
          text: "$$f(x) = \\frac{1}{n}$$\nn = number of values the RV can take; all values equally likely (e.g. one fair die: $f(x) = 1/6$).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Forgetting to check **both** conditions (non-negative **and** sums to 1).\n- Strict vs non-strict inequalities: for a discrete RV, $P(X < 3)$ excludes 3 but $P(X \\le 3)$ includes it.\n- CDF values must never decrease and must end at 1.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "pmf: $f(x) \\ge 0$, $\\sum f = 1$. CDF: $F(x) = P(X \\le x)$, a staircase. Unknown constant k → set the sum to 1.",
        },
      ],
    },
    {
      id: "expect",
      heading: "Lesson 3: The long-run average and spread: expected value and variance",
      slides: "13–17, 21–22, 24–27",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The mean and variance of a **random variable** (not of a data set), and the rules for transforming them.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Expected value and variance (slides 13, 15)",
          text: "$$E(X) = \\mu = \\sum x\\,f(x)$$\n$$\\text{Var}(X) = \\sigma^2 = \\sum (x - \\mu)^2 f(x) = E(X^2) - [E(X)]^2, \\qquad E(X^2) = \\sum x^2 f(x)$$\nStandard deviation $\\sigma$ = positive square root of the variance.",
        },
        {
          type: "p",
          text: "**Why “expected”?** If KPN's sales follow this distribution day after day, the average over many days settles at $E(X)$. It's the Lecture 1 grouped mean $\\Sigma fY/N$ with relative frequencies $f(x)$ in place of counts.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: KPN Appliances (slides 21–22)",
          text: "$E(X) = 0(0.4) + 1(0.25) + 2(0.2) + 3(0.05) + 4(0.1) = 1.20$ TV sets per day.\n\n| x | $x - \\mu$ | $(x - \\mu)^2$ | $f(x)$ | $(x - \\mu)^2 f(x)$ |\n|---|---|---|---|---|\n| 0 | −1.2 | 1.44 | 0.40 | 0.576 |\n| 1 | −0.2 | 0.04 | 0.25 | 0.010 |\n| 2 | 0.8 | 0.64 | 0.20 | 0.128 |\n| 3 | 1.8 | 3.24 | 0.05 | 0.162 |\n| 4 | 2.8 | 7.84 | 0.10 | 0.784 |\n\n$\\sigma^2 = 1.660$ (TV sets)², $\\sigma = 1.2884$ TV sets.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Example 1 (slides 24–25), kings in two cards",
          text: "X = number of kings when 2 cards are drawn without replacement. $f(0) = \\frac{{}^{48}C_2}{{}^{52}C_2} = \\frac{188}{221}$, $f(1) = \\frac{{}^4C_1 \\cdot {}^{48}C_1}{{}^{52}C_2} = \\frac{32}{221}$, $f(2) = \\frac{{}^4C_2}{{}^{52}C_2} = \\frac{1}{221}$.\n\n$E(X) = 0 + \\frac{32}{221} + \\frac{2}{221} = \\frac{34}{221}$. $E(X^2) = \\frac{32}{221} + \\frac{4}{221} = \\frac{36}{221}$.\n\n$\\text{Var}(X) = \\frac{36}{221} - \\left(\\frac{34}{221}\\right)^2 = \\frac{6800}{221^2} = 0.139$, $\\sigma = 0.37$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): sign typo on slide 25",
          text: "Slide 25 writes $\\text{var}(X) = E(X^2) + [E(X)]^2$. The formula is $E(X^2) \\,{-}\\, [E(X)]^2$ (slide 15), and the slide's own next line does subtract. The final answer $6800/221^2$ is correct.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Rules (slides 14, 16)",
          text: "$E(aX) = aE(X)$, $E(X + b) = E(X) + b$, so $E(aX + b) = aE(X) + b$.\n$V(b) = 0$, $V(aX) = a^2V(X)$, so $V(aX + b) = a^2V(X)$ (adding a constant shifts but doesn't spread), and $\\sigma_{aX} = |a|\\sigma_X$.\n$V(aX + bY) = a^2V(X) + b^2V(Y)$ **when X and Y are independent**.\nCautions: $E(X/Y) \\ne E(X)/E(Y)$, and $E(XY) \\ne E(X)E(Y)$ unless X and Y are independent.",
        },
        {
          type: "p",
          text: "**Is the game fair? (slide 17, solution prepared for the website).** A throws two dice: sum 7 → wins 3 dollars (prob 6/36); sum 8 → loses 2 dollars (5/36); sum 3 → loses 4 dollars (2/36); otherwise nothing. A's expected gain = $3 \\cdot \\frac{6}{36} - 2 \\cdot \\frac{5}{36} - 4 \\cdot \\frac{2}{36} = \\frac{18 - 10 - 8}{36} = 0$. Expected gain 0 → **the game is fair.**",
        },
        {
          type: "p",
          text: "**Example 2 continued (slide 27):** $E(X) = \\frac{0 + 3 + 10 + 21 + 36}{25} = \\frac{70}{25} = 2.8$; $E(X^2) = \\frac{0 + 3 + 20 + 63 + 144}{25} = \\frac{230}{25} = 9.2$; $\\text{Var}(X) = 9.2 - 2.8^2 = 1.36$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- $E(X^2) \\neq [E(X)]^2$. Compute $\\Sigma x^2 f(x)$ separately.\n- $V(aX + b) = a^2V(X)$: square the multiplier, drop the constant.\n- Adding variances of **dependent** variables.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$E(X) = \\sum x f(x)$. $\\text{Var} = E(X^2) - \\mu^2$. E(aX + b) = $a \\mu + b$. V(aX + b) = $a^2 \\sigma^2$. Fair game ⟺ expected gain 0.",
        },
      ],
    },
    {
      id: "continuous",
      heading: "Lesson 4: Probability as area: continuous random variables",
      slides: "30–40",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "For measured quantities, P(X = exact value) = 0, so probabilities come from **areas under a density curve** (slide 30).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Probability density function (slide 32)",
          text: "$f(x)$ is a pdf if\n1. $f(x) \\ge 0$\n2. $\\int_{-\\infty}^{\\infty} f(x)\\,dx = 1$\n3. $P(a \\le X \\le b) = \\int_a^b f(x)\\,dx$ = area under f between a and b.\n**Consequence:** for a continuous X, $P(X = a) = 0$, so $P(a < X < b) = P(a \\le X \\le b)$.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "CDF, mean and variance (slides 33–34)",
          text: "$$F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(u)\\,du, \\qquad f(x) = \\frac{dF(x)}{dx}$$\n$$\\mu = E(X) = \\int_{-\\infty}^{\\infty} x\\,f(x)\\,dx, \\qquad \\sigma^2 = \\int_{-\\infty}^{\\infty} (x - \\mu)^2 f(x)\\,dx = \\int_{-\\infty}^{\\infty} x^2 f(x)\\,dx - \\mu^2$$",
        },
        {
          type: "table",
          caption: "Integration formulas recalled on slide 35",
          head: ["Rule", "Formula"],
          rows: [
            ["Constant", "$\\int k f(u)\\,du = k \\int f(u)\\,du$"],
            ["Power", "$\\int u^n\\,du = \\frac{u^{n+1}}{n+1}$"],
            ["Exponential", "$\\int e^u\\,du = e^u$"],
            ["Trig", "$\\int \\sin u\\,du = -\\cos u$, $\\int \\cos u\\,du = \\sin u$"],
            ["Sum", "$\\int [f(u) \\pm g(u)]\\,du = \\int f(u)\\,du \\pm \\int g(u)\\,du$"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: Example 1 (slides 36–38)",
          text: "$f(x) = 2e^{-2x}$ for $x > 0$ (0 otherwise).\n\n(a) $P(1 < X < 3) = \\int_1^3 2e^{-2x}dx = e^{-2} - e^{-6} = 0.133$.\n(b) $P(X > 0.5) = \\int_{0.5}^{\\infty} 2e^{-2x}dx = e^{-1} = 0.368$.\nCDF: $F(x) = 1 - e^{-2x}$ for $x > 0$, so $P(X \\le 1) = F(1) = 1 - e^{-2} = 0.865$.\nMean and variance (integration by parts): $\\mu = 1/2$, $\\sigma^2 = 1/4$.",
        },
        { type: "diagram", name: "i5-pdf" },
        {
          type: "p",
          text: "**Slightly harder: finding k (slide 39).** For $f(x) = kxe^{-4x^2}$ $(x > 0)$ to be a pdf, $\\int_0^{\\infty} kxe^{-4x^2}dx = 1$. Substitute $u = 4x^2$ ($du = 8x\\,dx$): $\\int_0^{\\infty} \\frac{k}{8}e^{-u}du = \\frac{k}{8} = 1$, so **k = 8**.",
        },
        {
          type: "p",
          text: "**Reading probabilities from a CDF (slide 40).** $F_Y(y) = 0$ $(y < 0)$, $y/4$ $(0 \\le y \\le 4)$, 1 $(y > 4)$. Then P(Y ≤ −1) = 0; $P(Y \\le 1) = 1/4$; $P(2 < Y \\le 3) = F(3) - F(2) = 3/4 - 2/4 = 1/4$; $P(Y > 1.5) = 1 - F(1.5) = 1 - 1.5/4 = 5/8$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Treating $f(x)$ itself as a probability. Densities can exceed 1 ($f(0) = 2$ above); only **areas** are probabilities.\n- Integrating over the wrong pieces of a piecewise pdf. Split the integral at the break points.\n- Forgetting that $f = 0$ outside the stated range.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "pdf: $f \\ge 0$, total area 1, $P(a < X < b) = \\int_a^b f$. $F(x) = \\int f$ up to x; $f = F'$. $E(X) = \\int x$ f, $\\text{Var} = \\int x^2$ $f - \\mu^2$.",
        },
      ],
    },
    {
      id: "joint",
      heading: "Lesson 5: Two random variables at once: joint, marginal and independence",
      slides: "46–64",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to describe two random variables together, recover each one alone (marginals), and test whether they're independent.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Joint distributions (slides 46–47, 51)",
          text: "**Discrete:** joint pmf $f(x, y) = P(X = x, Y = y)$ (also written $J_{ij}$), with $f(x, y) \\ge 0$ and $\\sum_x \\sum_y f(x, y) = 1$.\n**Continuous:** joint density $f(x, y) \\ge 0$, $\\int\\int f(x, y)\\,dx\\,dy = 1$, and $P[(X, Y) \\in A] = \\iint_A f(x, y)\\,dx\\,dy$, the volume above region A.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Marginals and independence (slides 52–53)",
          text: "$$g(x) = \\sum_y f(x, y), \\quad h(y) = \\sum_x f(x, y) \\quad \\text{(discrete)}$$\n$$g(x) = \\int_{-\\infty}^{\\infty} f(x, y)\\,dy, \\quad h(y) = \\int_{-\\infty}^{\\infty} f(x, y)\\,dx \\quad \\text{(continuous)}$$\nX and Y are **independent** if $f(x, y) = g(x)\\,h(y)$ for **all** x and y.",
        },
        {
          type: "p",
          text: "**Simple example: education and age (slides 48–50).** Census-style joint table of education X (0 None, 1 Primary, 2 Secondary, 3 College) and age Y (30, 45, 70):",
        },
        {
          type: "table",
          head: ["Education \\ Age", "30", "45", "70", "$p(x)$"],
          rows: [
            ["0 None", ".01", ".02", ".05", ".08"],
            ["1 Primary", ".03", ".06", ".10", ".19"],
            ["2 Secondary", ".18", ".21", ".15", ".54"],
            ["3 College", ".07", ".08", ".04", ".19"],
            ["$p(y)$", ".29", ".37", ".34", "1"],
          ],
        },
        {
          type: "p",
          text: "P(30-year-old college graduate) = $p(3, 30)$ = **.07**. The **marginal** $p(x = 1)$ = .03 + .06 + .10 = **.19**, so called because it's written in the margin of the table.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: the slide 54–55 joint table",
          text: "$f(x, y)$ for X ∈ {0, 1}, Y ∈ {0, 1, 2, 3}: row $X = 0$: 0, 1/8, 1/4, 1/8; row $X = 1$: 1/8, 1/4, 1/8, 0.\n\n$(i) P(X = 1, Y = 2)$ = **1/8**. (ii) $P(X \\ge 1, Y \\ge 2) = 1/8 + 0$ = **1/8**.\n(iii) $P(X \\le 1, Y \\le 2) = 0 + 1/8 + 1/4 + 1/8 + 1/4 + 1/8$ = **7/8**.\n(iv) $P(X + Y \\ge 2) = P(0, 2) + P(0, 3) + P(1, 1) + P(1, 2) + P(1, 3) = 1/4 + 1/8 + 1/4 + 1/8 + 0$ = **3/4**.\n$(v) P(X \\ge 1, Y \\le 2) = 1/8 + 1/4 + 1/8$ = **1/2**.",
        },
        {
          type: "p",
          text: "**Building a joint table from independence (slide 58).** If X (1, 2 with probabilities 0.7, 0.3) and Y (−2, 5, 8 with 0.3, 0.5, 0.2) are independent, each cell is a product: $J_{ij} = f(x_i)g(y_j)$, giving 0.21, 0.35, 0.14 / 0.09, 0.15, 0.06.",
        },
        {
          type: "p",
          text: "**Two pens (slides 56–57).** Two pens are drawn from a box with 3 blue, 2 red and 3 green (8 pens, $^8C_2 = 28$ pairs). X = blue drawn, Y = red drawn: $f(x, y) = \\frac{{}^3C_x \\, {}^2C_y \\, {}^3C_{2-x-y}}{{}^8C_2}$. Joint table: $f(0, 0) = 3/28$, $f(1, 0) = 9/28$, $f(2, 0) = 3/28$, $f(0, 1) = 3/14$, $f(1, 1) = 3/14$, $f(0, 2) = 1/28$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): pens example",
          text: "Slide 56 says the box “contains blue pens, 2 red pens and 3 green pens”: the number of blue pens is missing. The slide's denominators (28 = ⁸C₂) and table imply **3 blue pens**, which is what we use.",
        },
        {
          type: "p",
          text: "**Continuous: the candy box (slides 59–62).** $f(x, y) = \\frac{2}{5}(2x + 3y)$ on $0 \\le x, y \\le 1$. (a) $\\int_0^1\\int_0^1 \\frac{2}{5}(2x + 3y)\\,dx\\,dy = \\frac{2}{5} + \\frac{3}{5} = 1$ ✓. (b) $P(0 < X < \\frac{1}{2}, \\frac{1}{4} < Y < \\frac{1}{2}) = \\frac{13}{160}$. (c) $g(x) = \\frac{4x + 3}{5}$, $h(y) = \\frac{2(1 + 3y)}{5}$ on [0, 1]. Since $g(x)h(y) \\ne f(x, y)$, X and Y are not independent. **Slide 53's example** $f(x, y) = e^{-(x+y)}$ factors as $e^{-x} \\cdot e^{-y}$, so those X and Y **are** independent.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Checking independence on **one** cell only. It must hold for **every** (x, y).\n- Summing over the wrong variable for a marginal ($g(x)$ sums over **y**).\n- For “$X + Y \\ge 2$” type events, list the qualifying cells explicitly before adding.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Joint table sums to 1. Marginal = row/column sum (or integral). Independent ⟺ every cell = row margin × column margin.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Lec5 on one screen",
      head: ["", "Discrete", "Continuous"],
      rows: [
        ["Distribution", "pmf $f(x) = P(X = x)$, $\\sum f = 1$", "pdf $f(x) \\ge 0$, $\\int f = 1$, P = area"],
        ["CDF", "$F(x)$ = Σ_{$t \\le x$} $f(t)$", "$F(x)$ = ∫_{−$\\infty$}^x f, $f = F'$"],
        ["Mean", "$\\sum x f(x)$", "$\\int x f(x)$ dx"],
        ["Variance", "$\\sum x^2$ $f - \\mu^2$", "$\\int x^2$ f dx − $\\mu^2$"],
        ["Marginal", "Σ over the other variable", "∫ over the other variable"],
        ["Independent", "$f(x, y) = g(x) h(y)$ for all cells", "$f(x, y) = g(x) h(y)$"],
      ],
    },
    { type: "diagram", name: "i5-pdf" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Find k by setting the total to 1 · E($X^2$) ≠ E(X)² · V(aX + b) = $a^2 V(X)$ · check independence for **every** cell.",
    },
  ],

  glossary: [
    ["RV", "Random variable", "A function assigning a number to each outcome"],
    ["pmf", "Probability mass function", "$f(x) = P(X = x)$ for a discrete RV"],
    ["pdf", "Probability density function", "Curve whose area gives probabilities for a continuous RV"],
    ["CDF", "Cumulative distribution function", "$F(x) = P(X \\le x)$"],
    ["$E(X)$, $\\mu$", "Expected value, mean", "Probability-weighted average of the values"],
    ["$\\text{Var}(X)$, $\\sigma^2$", "Variance", "E[$(X - \\mu)^2$] = $E(X^2) - \\mu^2$"],
    ["Discrete uniform", "", "$f(x) = 1/n$ for n equally likely values"],
    ["Joint pmf/pdf", "Bivariate distribution", "Distribution of the pair (X, Y)"],
    ["Marginal", "", "Distribution of one variable, found by summing/integrating out the other"],
    ["Independent RVs", "", "$f(x, y) = g(x) h(y)$ for all x, y"],
  ],

  examTips: [
    "“Find k” is almost always step (i): set $\\sum f = 1$ (or $\\int f = 1$) and solve.",
    "Show a table with columns x, $f(x)$, $x f(x)$, $x^2 f(x)$ for discrete mean/variance. It's quick and earns method marks.",
    "For continuous problems, write the integral with limits first; only then integrate.",
    "For independence in a table, compute all marginals and test every cell (or find one cell that fails to prove dependence).",
  ],

  problems: [
    {
      title: "Valid probability function? (slide 12)",
      level: "From slides",
      question: "A shooter needs 1, 2 or 3 shots; proposed $f(x) = x/6$, $x = 1$, 2, 3. Is this a valid probability function?",
      solution: "$f(1) = 1/6$, $f(2) = 2/6$, $f(3) = 3/6$ are all ≥ 0, and their sum is 6/6 = 1 → **valid**.",
    },
    {
      title: "Is the dice game fair? (slide 17)",
      level: "From slides",
      hint: "Fair means A's expected gain is 0.",
      question: "A throws two dice: sum 7 → wins 3 dollars from B; sum 8 → loses 2 dollars; sum 3 → loses 4 dollars; otherwise nothing. Is the game fair?",
      solution: "*Exercise solution prepared for the website.*\n### Approach\nLet $G = A$'s gain. A game is fair if $E(G) = 0$.\n### Working\n$P(7) = 6/36$, $P(8) = 5/36$, $P(3) = 2/36$.\n$E(G) = 3 \\cdot \\frac{6}{36} + (-2) \\cdot \\frac{5}{36} + (-4) \\cdot \\frac{2}{36} + 0 = \\frac{18 - 10 - 8}{36} = 0$.\n### Answer\n**Yes, the game is fair.**",
    },
    {
      title: "KPN Appliances: pmf, mean, variance (slides 19–22)",
      level: "From slides",
      question: "Over 200 days, 0/1/2/3/4 TVs were sold on 80/50/40/10/20 days. Find the probability distribution, the expected sales and the standard deviation.",
      solution: "$f(x) = 0.40$, 0.25, 0.20, 0.05, 0.10.\n$E(X) = 0.25 + 0.40 + 0.15 + 0.40 =$ **1.2**.\n$\\sigma^2 = \\sum (x - 1.2)^2 f(x) = 0.576 + 0.010 + 0.128 + 0.162 + 0.784 =$ **1.66**, **σ = 1.2884** TV sets.",
    },
    {
      title: "Two dice: distribution and CDF of the sum (slide 23)",
      level: "From slides",
      question: "Two dice are rolled; X = sum. Find the probability distribution and the cumulative distribution.",
      solution: "$f(x)$ for $x = 2$…12: 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1 (all /36).\n$F(x)$: 1, 3, 6, 10, 15, 21, 26, 30, 33, 35, 36 (all /36).",
    },
    {
      title: "Example 1: number of kings (slides 24–25)",
      level: "From slides",
      question: "Two cards are drawn without replacement from 52. Find the mean, variance and SD of X = number of kings.",
      solution: "$f(0) = 188/221$, $f(1) = 32/221$, $f(2) = 1/221$.\n$E(X) = 34/221$ = **0.154**. $E(X^2) = 36/221$. $\\text{Var} = 36/221 - (34/221)^2 = 6800/221^2$ = **0.139**. $\\sigma$ = **0.373**.",
    },
    {
      title: "Example 2: find k, probabilities, CDF, mean, variance (slides 26–27)",
      level: "From slides",
      question: "$p(x) = k$, 3k, 5k, 7k, 9k for $x = 0$, …, 4. Find (i) k, (ii) $P(X < 3)$, (iii) $P(0 < X < 4)$, (iv) the distribution function, $(v) E(X)$, (vi) $\\text{Var}(X)$.",
      solution: "(i) $25 k = 1$ → **k = 1/25**.\n(ii) 9k = **9/25**.\n(iii) 3k + 5k + 7k = **15/25 = 3/5**.\n(iv) $F = 0$, 1/25, 4/25, 9/25, 16/25, 1 on the intervals $x < 0$, [0, 1), [1, 2), [2, 3), [3, 4), $x \\ge 4$.\n$(v) E(X) = 70/25$ = **2.8**.\n(vi) $E(X^2) = 230/25 = 9.2$ → $\\text{Var} = 9.2 - 7.84$ = **1.36**.",
    },
    {
      title: "Continuous Example 1: f(x) = 2e^(−2x) (slides 36–38)",
      level: "From slides",
      question: "f(x) = 2e^(−2x) for $x > 0$. Find $(a) P(1 < X < 3)$, $(b) P(X > 0.5)$, the CDF and $P(X \\le 1)$, and the mean and variance.",
      solution: "(a) $[-e^{-2x}]_1^3 = e^{-2} - e^{-6} =$ **0.133**.\n(b) $e^{-1} =$ **0.368**.\nCDF: $F(x) = 1 - e^{-2x}$ $(x > 0)$; $F(1)$ = **0.865**.\nMean **1/2**, variance **1/4** (integration by parts, as on slide 38).",
    },
    {
      title: "Find k for f(x) = kx e^(−4x²) (slide 39)",
      level: "From slides",
      question: "Find k so that $f(x)$ = kx e^(−$4 x^2$) $(x > 0)$, 0 otherwise, is a probability density.",
      solution: "Substitute $u = 4 x^2$, du = 8x dx: $\\int_0^\\infty kxe^{-4x^2}dx = \\frac{k}{8}\\int_0^\\infty e^{-u}du = \\frac{k}{8} = 1$ → **k = 8**.",
    },
    {
      title: "Probabilities from a CDF (slide 40)",
      level: "From slides",
      question: "$F(y) = 0$ for $y < 0$, y/4 for $0 \\le y \\le 4$, 1 for $y > 4$. Find P(Y ≤ −1), $P(Y \\le 1)$, $P(2 < Y \\le 3)$, $P(Y > 1.5)$.",
      solution: "**0**, **1/4**, $3/4 - 2/4$ = **1/4**, $1 - 1.5/4$ = **5/8**.",
    },
    {
      title: "Set 1, P1: triangular density (slide 41)",
      level: "From slides",
      hint: "Split the integral at $x = 1$ for (ii).",
      question: "$f(x) = x$ $(0 < x < 1)$, $2 - x$ $(1 \\le x < 2)$, 0 otherwise. Find $(i) P(0.2 < X < 0.8)$, (ii) $P(0.6 < X < 1.2)$.",
      solution: "(i) $\\int_{0.2}^{0.8} x\\,dx = \\frac{0.64 - 0.04}{2} =$ **0.3** ✓.\n(ii) $\\int_{0.6}^{1} x\\,dx + \\int_1^{1.2}(2 - x)dx = 0.32 + [2x - x^2/2]_1^{1.2} = 0.32 + (1.68 - 1.5) =$ **0.5** ✓.",
    },
    {
      title: "Set 1, P2: k for k/(1 + x²) (slide 41)",
      level: "From slides",
      question: "$f(x) = k/(1 + x^2)$, −$\\infty < x < \\infty$, is a pdf. Find k.",
      solution: "$\\int_{-\\infty}^{\\infty} \\frac{k}{1+x^2}dx = k[\\tan^{-1}x]_{-\\infty}^{\\infty} = k\\pi = 1$ → **k = $1/\\pi$** ✓.\n(Note: the antiderivative of $1/(1 + x^2)$, tan⁻¹x, is not in slide 35's formula list, but the slide's answer requires it.)",
    },
    {
      title: "Set 1, P3: laptop service life (slide 42)",
      level: "From slides",
      hint: "$F(x) = 1$ − e^(−x/4.5).",
      question: "$f(x) = (1/4.5)$ e^(−x/4.5), $x > 0$. P(service) (a) at most 2.5 years, (b) 4 to 6 years, (c) at least 6.75 years?",
      solution: "CDF: $F(x) = 1 - e^{-x/4.5}$.\n(a) $1 - e^{-2.5/4.5} =$ **0.4262** ✓. (b) $e^{-4/4.5} - e^{-6/4.5} =$ **0.1475** ✓. (c) $e^{-6.75/4.5} = e^{-1.5} =$ **0.2231** ✓.",
    },
    {
      title: "Set 1, P4: mean and variance of the triangular density (slide 43)",
      level: "From slides",
      question: "For $f(x) = x$ $(0 \\le x \\le 1)$, $2 - x$ $(1 \\le x < 2)$, find the mean and variance.",
      solution: "$E(X) = \\int_0^1 x^2dx + \\int_1^2 x(2 - x)dx = \\frac{1}{3} + \\frac{2}{3} =$ **1** (also clear by symmetry).\n$E(X^2) = \\int_0^1 x^3dx + \\int_1^2 x^2(2 - x)dx = \\frac{1}{4} + \\frac{11}{12} = \\frac{7}{6}$ → $\\text{Var} = 7/6 - 1$ = **1/6** ✓.",
    },
    {
      title: "Set 1, P5: P(X = x) = kx (slide 43)",
      level: "From slides",
      question: "$P(X = x)$ = kx for $x = 1$, …, 5. Find (i) k, (ii) P(X is prime), (iii) $P(1/2 < X < 5/2)$.",
      solution: "(i) $15 k = 1$ → **k = 1/15** ✓.\n(ii) Primes in {1, …, 5} are 2, 3, 5 → (2 + 3 + 5)/15 = **10/15 = 2/3**.\n⚠️ The slide's answer is 11/15, which would require counting 1 as prime (it isn't).\n(iii) $X = 1$ or 2 → 3/15 = **1/5** ✓.",
    },
    {
      title: "Set 1, P6: defectives in a sample (slide 44)",
      level: "From slides",
      question: "A lot of 10 items has 3 defective. A sample of 4 is drawn without replacement; X = defectives. (a) Distribution of X, $(b) P(X \\le 1)$, $(c) P(0 < X < 2)$.",
      solution: "$P(X = x) = \\frac{{}^3C_x \\, {}^7C_{4-x}}{{}^{10}C_4}$, with ¹⁰C₄ = 210.\n$(a) P(0) = 35/210$ = **1/6**, $P(1) = 105/210$ = **1/2**, $P(2) = 63/210$ = **3/10**, $P(3) = 7/210$ = **1/30** ✓.\n(b) 1/6 + 1/2 = **2/3** ✓. $(c) P(X = 1)$ = **1/2** ✓.",
    },
    {
      title: "Set 1, P7: pmf with parameter a (slide 45)",
      level: "From slides",
      hint: "Sum to 1 gives a cubic; reject roots that make a probability negative.",
      question: "$P(0) = 3 a^3$, $P(1) = 4 a - 10 a^2$, $P(2) = 5 a - 1$ $(a > 0)$. (a) Find a, $(b) P(X < 2)$, (c) the largest x with $F(x) < 1/2$.",
      solution: "(a) $3 a^3 - 10 a^2 + 9 a - 1 = 1$ → $3 a^3 - 10 a^2 + 9 a - 2 = 0$ → $(a - 1) (a - 2) (3 a - 1) = 0$. $a = 1$ or 2 make $P(1)$ negative, so **a = 1/3** ✓.\nThen $P(0) = 1/9$, $P(1) = 2/9$, $P(2) = 2/3$.\n$(b) P(X < 2) = 1/9 + 2/9$ = **1/3** ✓.\n$(c) F(0) = 1/9$, $F(1) = 1/3 < 1/2$, $F(2) = 1$ → **x = 1** ✓.",
    },
    {
      title: "Joint table probabilities (slides 54–55)",
      level: "From slides",
      question: "Joint pmf: $X = 0$ row: 0, 1/8, 1/4, 1/8 ($Y = 0$…3); $X = 1$ row: 1/8, 1/4, 1/8, 0. Find $(i) P(X = 1, Y = 2)$, (ii) $P(X \\ge 1, Y \\ge 2)$, (iii) $P(X \\le 1, Y \\le 2)$, (iv) $P(X + Y \\ge 2)$, $(v) P(X \\ge 1, Y \\le 2)$.",
      solution: "(i) **1/8**. (ii) 1/8 + 0 = **1/8**. (iii) **7/8**. (iv) 1/4 + 1/8 + 1/4 + 1/8 + 0 = **3/4**. (v) 1/8 + 1/4 + 1/8 = **1/2**.\n(Slide 54 lists Y = {0, 1, 2, 3, 4} in (i); the table only has Y up to 3.)",
    },
    {
      title: "Joint distribution c(x² + y²) (slides 63–64)",
      level: "From slides",
      question: "$f(x, y) = c(x^2 + y^2)$, x ∈ {−1, 0, 1, 3}, y ∈ {−1, 2, 3}. (i) c, (ii) $P(X = 0, Y \\le 2)$, (iii) $P(X \\le 1, Y > 2)$, (iv) $P(X \\ge 2 - Y)$.",
      solution: "(i) Sum of all $x^2 + y^2 = 89$ → **c = 1/89**.\n(ii) f(0, −1) + $f(0, 2) = c + 4 c$ = **5/89**.\n(iii) $y = 3$, x ∈ {−1, 0, 1}: 10c + 9c + 10c = **29/89**.\n(iv) $x + y \\ge 2$: (−1,3), (0,2), (0,3), (1,2), (1,3), (3,−1), (3,2), (3,3) → 10c + 4c + 9c + 5c + 10c + 10c + 13c + 18c = **79/89**.",
    },
    {
      title: "Set 2, P1: K(2x + 3y) (slide 67)",
      level: "From slides",
      question: "$P(x, y) = K(2 x + 3 y)$, $x = 0$, 1, 2; $y = 1$, 2, 3. Find (i) K, (ii) the marginals, (iii) $P(X = 2, Y \\le 2)$, (iv) $P(X = 2)$.",
      solution: "$(i) \\sum(2 x + 3 y) = 72$ → **K = 1/72** ✓.\n(ii) $P(X = 0, 1, 2)$ = **18/72, 24/72, 30/72**; $P(Y = 1, 2, 3)$ = **15/72, 24/72, 33/72** ✓.\n(iii) (7 + 10)/72 = **17/72** ✓. (iv) **30/72** ✓.",
    },
    {
      title: "Set 2, P2: show independence (slide 67)",
      level: "From slides",
      question: "Joint distribution: $Y = 1$: 0.10 $(X = 2)$, 0.15 $(X = 4)$; $Y = 3$: 0.20, 0.30; $Y = 5$: 0.10, 0.15. Show X and Y are independent.",
      solution: "*Exercise solution prepared for the website.*\nMarginals: $P(X = 2) = 0.4$, $P(X = 4) = 0.6$; $P(Y = 1) = 0.25$, $P(Y = 3) = 0.5$, $P(Y = 5) = 0.25$.\nCheck every cell: $0.4 \\times 0.25 = 0.10$ ✓, $0.6 \\times 0.25 = 0.15$ ✓, $0.4 \\times 0.5 = 0.20$ ✓, $0.6 \\times 0.5 = 0.30$ ✓, $0.4 \\times 0.25 = 0.10$ ✓, $0.6 \\times 0.25 = 0.15$ ✓ → **independent**.",
    },
    {
      title: "Set 2, P3: bivariate table (slide 68)",
      level: "From slides",
      question: "Using the slide 68 table ($X = 0$, 1, 2; $Y = 1$…6), find $P(X \\le 1)$, $P(Y \\le 3)$, $P(X \\le 1, Y \\le 3)$.",
      solution: "Row sums: $X = 0$: 8/32 = 1/4; $X = 1$: 5/8; $X = 2$: 1/8.\n$P(X \\le 1) = 1/4 + 5/8$ = **7/8** ✓.\n$P(Y \\le 3) = (0 + 0 + 1/32) + (1/16 + 1/16 + 1/8) + (1/32 + 1/32 + 1/64)$ = **23/64** ✓.\n$P(X \\le 1, Y \\le 3) = 1/32 + 1/16 + 1/16 + 1/8$ = **9/32** ✓.",
    },
    {
      title: "Set 2, P4–P6: continuous joint densities (slides 68–69)",
      level: "From slides",
      question: "P4: $f(x, y)$ = e^(−(x+y)), x, $y \\ge 0$: find $P(X < 1)$. P5: f = Cxy on $0 < x$, $y < 2$: find C and $P(1/2 < X < 3/2, 1 < Y < 2)$. P6: $f = x + y$ on the unit square: marginals and independence?",
      solution: "P4: $g(x)$ = e^(−x) → $P(X < 1) = 1$ − e^(−1) = **0.6321** ✓.\nP5: $C \\cdot 2 \\cdot 2 = 1$ → **C = 1/4** ✓; $\\frac{1}{4}\\left[\\frac{x^2}{2}\\right]_{1/2}^{3/2}\\left[\\frac{y^2}{2}\\right]_1^2 = \\frac{1}{4} \\cdot 1 \\cdot \\frac{3}{2} =$ **3/8** ✓.\nP6: $g(x) = x + 1/2$, $h(y) = y + 1/2$; $g(x) h(y) \\ne x + y$ → **not independent** ✓.",
    },
    {
      title: "Level 1: check a pmf and its mean",
      level: "Level 1",
      question: "$f(x) = x/10$ for $x = 1$, 2, 3, 4. Is it a valid pmf? Find $E(X)$.",
      solution: "All ≥ 0 and $(1 + 2 + 3 + 4)/10 = 1$ → **valid**. $E(X) = (1 + 4 + 9 + 16)/10$ = **3**.",
    },
    {
      title: "Level 1: transform the mean and variance",
      level: "Level 1",
      question: "KPN earns ₹500 profit per TV sold plus a fixed ₹200 per day from services, so daily profit is $P = 500 X + 200$. Using $E(X) = 1.2$ and $\\text{Var}(X) = 1.66$, find $E(P)$ and $\\text{SD}(P)$.",
      solution: "$E(P) = 500 (1.2) + 200$ = **₹800**. $\\text{Var}(P) = 500^2 \\times 1.66 = 415$,000 → $\\text{SD} = 500 \\times 1.2884$ = **₹644.2**. (The constant 200 doesn't affect the spread.)",
    },
    {
      title: "Level 2: variance by the shortcut",
      level: "Level 2",
      question: "$P(X = 0) = 0.2$, $P(X = 1) = 0.5$, $P(X = 2) = 0.3$. Find $E(X)$, $\\text{Var}(X)$, $\\sigma$.",
      solution: "$E(X) = 0.5 + 0.6$ = **1.1**. $E(X^2) = 0.5 + 1.2 = 1.7$. $\\text{Var} = 1.7 - 1.21$ = **0.49**, $\\sigma$ = **0.7**.",
    },
    {
      title: "Level 2: a polynomial density",
      level: "Level 2",
      question: "$f(x) = 3 x^2$ on $0 \\le x \\le 1$. Find $P(X < 0.5)$, $E(X)$ and $\\text{Var}(X)$.",
      solution: "$P(X < 0.5) = [x^3]_0^{0.5}$ = **0.125**. $E(X) = \\int 3 x^3$ dx = **3/4**. $E(X^2) = \\int 3 x^4$ dx = 3/5 → $\\text{Var} = 3/5 - 9/16$ = **0.0375**.",
    },
    {
      title: "Level 2: marginals from the census table",
      level: "Level 2",
      question: "From the education–age table, find $P(Y = 45)$ and $P(X \\ge 2)$.",
      solution: "$P(Y = 45)$ = .02 + .06 + .21 + .08 = **.37**. $P(X \\ge 2)$ = .54 + .19 = **.73**.",
    },
    {
      title: "Level 3: find k and the mean",
      level: "Level 3",
      question: "$f(x)$ = kx($2 - x$) on $0 \\le x \\le 2$. Find k and $E(X)$.",
      solution: "∫₀² ($2 x - x^2$)dx = $4 - 8/3 = 4/3$ → **k = 3/4**. The density is symmetric about $x = 1$, so **E(X) = 1** (check: (3/4)∫($2 x^2 - x^3$)dx = $(3/4) (16/3 - 4) = 1$).",
    },
    {
      title: "Level 3: independence in a 2 × 2 table",
      level: "Level 3",
      question: "$f(0, 0) = 0.12$, $f(0, 1) = 0.28$, $f(1, 0) = 0.18$, $f(1, 1) = 0.42$. Are X and Y independent?",
      solution: "$g(0) = 0.40$, $g(1) = 0.60$; $h(0) = 0.30$, $h(1) = 0.70$. Products: 0.12, 0.28, 0.18, 0.42, all matching → **independent**.",
    },
    {
      title: "Level 3: variance of a combination",
      level: "Level 3",
      question: "X and Y are independent with $V(X) = 4$ and $V(Y) = 1$. Find $V(2 X - 3 Y)$ and its SD.",
      solution: "V(aX + bY) = $a^2 V(X) + b^2 V(Y)$ with $a = 2$, b = −3: 4(4) + 9(1) = **25**, SD = **5**. (The minus sign doesn't reduce variance: $b^2 = 9$.)",
    },
  ],

  theory: [
    {
      title: "Discrete vs continuous random variables",
      level: "Level 1",
      question: "Distinguish discrete and continuous random variables, with their probability functions and examples.",
      solution: "A **discrete** RV takes finite or countably many values (counted: calls, defects); its pmf gives $P(X = x)$ with $\\sum f = 1$. A **continuous** RV takes any value in an interval (measured: time, weight); its pdf has total area 1, $P(a < X < b) = \\int_a^b f$, and $P(X = a) = 0$. Both have a CDF $F(x) = P(X \\le x)$.",
    },
    {
      title: "Why is P(X = a) = 0 for a continuous RV?",
      level: "Level 2",
      question: "Explain why the probability of an exact value is zero for a continuous random variable, and what that means for inequalities.",
      solution: "Probability is the area under the pdf. The “area” over a single point a is $\\int_a^a f(x)dx = 0$, a line with no width. So $P(a < X < b) = P(a \\le X \\le b)$: strict and non-strict inequalities give the same answer (unlike the discrete case).",
    },
    {
      title: "Rules of expectation and variance",
      level: "Level 2",
      question: "State E(aX + b) and V(aX + b), and the condition for V(aX + bY) = $a^2 V(X) + b^2 V(Y)$.",
      solution: "E(aX + b) = aE(X) + b; V(aX + b) = $a^2 V(X)$ (a constant shifts the distribution without spreading it); V(aX + bY) = $a^2 V(X) + b^2 V(Y)$ when X and Y are **independent**. Also E(XY) = $E(X) E(Y)$ only under independence, and $E(X/Y) \\ne E(X)/E(Y)$.",
    },
    {
      title: "Marginal distributions and independence",
      level: "Level 2",
      question: "Define marginal distributions for discrete and continuous cases, and state the condition for independence of X and Y.",
      solution: "Marginal of X: $g(x)$ = Σ_y $f(x, y)$ (discrete) or $\\int f(x, y)$ dy (continuous); similarly $h(y)$. X and Y are independent iff $f(x, y) = g(x) h(y)$ for all (x, y), e.g. e^(−(x+y)) = e^(−x)e^(−y) (slide 53).",
    },
  ],

  quiz: [
    {
      topic: "Random variables",
      q: "The amount of rainfall in a day (mm) is a…",
      options: ["Discrete random variable", "Continuous random variable", "Categorical variable", "Constant"],
      answer: 1,
      why: "It's measured and can take any value in an interval.",
      wrong: ["It isn't counted.", null, "It's numerical.", "It varies from day to day."],
    },
    {
      topic: "pmf",
      type: "num",
      q: "$p(x) = k$, 3k, 5k, 7k, 9k for $x = 0$…4. Find k (fraction or decimal).",
      answer: 1 / 25,
      display: "1/25",
      tol: 0.001,
      why: "$25 k = 1$.",
    },
    {
      topic: "pmf",
      q: "Which is NOT required for a valid pmf?",
      options: ["$f(x) \\ge 0$", "$\\sum f(x) = 1$", "$f(x) \\le 1$ for each x", "$f(x)$ increases with x"],
      answer: 3,
      why: "No ordering is required; f can rise or fall.",
      wrong: ["Required: probabilities can't be negative.", "Required: total probability is 1.", "Follows from the two conditions.", null],
    },
    {
      topic: "Expectation",
      type: "num",
      q: "f(0..4) = 0.4, 0.25, 0.2, 0.05, 0.1. $E(X)$?",
      answer: 1.2,
      tol: 0.001,
      why: "0.25 + 0.4 + 0.15 + 0.4.",
    },
    {
      topic: "Expectation",
      type: "num",
      q: "Same distribution: $\\text{Var}(X) = 1.66$. If $Y = 3 X + 5$, what is $\\text{Var}(Y)$?",
      answer: 14.94,
      tol: 0.01,
      why: "$a^2 V(X) = 9 \\times 1.66$; the +5 doesn't matter.",
    },
    {
      topic: "Expectation",
      type: "num",
      q: "Dice game: win 3 dollars on 7, lose 2 on 8, lose 4 on 3. A's expected gain?",
      answer: 0,
      tol: 0.001,
      why: "$(18 - 10 - 8)/36 = 0$ → fair.",
    },
    {
      topic: "Expectation",
      q: "E(XY) = $E(X) E(Y)$ is guaranteed when…",
      options: ["Always", "X and Y are independent", "X and Y have the same mean", "Never"],
      answer: 1,
      why: "Slide 14: not true in general, only under independence.",
      wrong: ["Fails for dependent variables.", null, "Equal means aren't enough.", "It does hold under independence."],
    },
    {
      topic: "Continuous",
      type: "num",
      q: "f(x) = 2e^(−2x), $x > 0$. $P(1 < X < 3)$? (3 decimals)",
      answer: 0.133,
      tol: 0.001,
      why: "$e^{-2} - e^{-6}$.",
    },
    {
      topic: "Continuous",
      type: "num",
      q: "Find k so that kx e^(−$4 x^2$), $x > 0$, is a pdf.",
      answer: 8,
      tol: 0.001,
      why: "$k/8 = 1$.",
    },
    {
      topic: "Continuous",
      type: "num",
      q: "$F(y) = y/4$ on [0, 4]. $P(Y > 1.5)$? (decimal)",
      answer: 0.625,
      tol: 0.001,
      why: "$1 - 1.5/4 = 5/8$.",
    },
    {
      topic: "Continuous",
      q: "For a continuous RV, $P(X = 2)$ equals…",
      options: ["$f(2)$", "$F(2)$", "0", "$1 - F(2)$"],
      answer: 2,
      why: "The area over a single point is zero.",
      wrong: ["$f(2)$ is a density height, not a probability.", "$F(2) = P(X \\le 2)$.", null, "That's $P(X > 2)$."],
    },
    {
      topic: "Joint",
      type: "num",
      q: "Census table: $p(1, 30)$ = .03, $p(1, 45)$ = .06, $p(1, 70)$ = .10. Marginal $p(x = 1)$?",
      answer: 0.19,
      tol: 0.001,
      why: "Sum across the row.",
    },
    {
      topic: "Joint",
      type: "num",
      q: "$P(x, y) = K(2 x + 3 y)$, $x = 0$, 1, 2; $y = 1$, 2, 3. K? (fraction or decimal)",
      answer: 1 / 72,
      display: "1/72",
      tol: 0.0005,
      why: "Total of $(2 x + 3 y) = 72$.",
    },
    {
      topic: "Joint",
      q: "$f(x, y) = x + y$ on the unit square has marginals x + ½ and y + ½. X and Y are…",
      options: ["Independent", "Not independent", "Mutually exclusive", "Identically zero"],
      answer: 1,
      why: "(x + ½)(y + ½) ≠ x + y.",
      wrong: ["The product of the marginals differs from f.", null, "Not a property of RVs here.", "f integrates to 1."],
    },
  ],
};
