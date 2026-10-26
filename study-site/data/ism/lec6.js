// ISM — Lecture 6 (CS-6): Probability distributions — Bernoulli, Binomial, Poisson, Normal; intro to t, χ², F
// Source: CourseFiles/ISM/Lec6.pdf (80 slides). Every topic cites its slides; nothing outside the deck is taught.

export default {
  title: "Binomial, Poisson & Normal Distributions",
  source: "Lec6.pdf (CS-6) · 80 slides",
  quizMode: "step",
  overview:
    "Lecture 5 built distributions from scratch. In practice, a few **named distributions** cover most situations, and recognising which one applies is half the exam. **Bernoulli**: one yes/no trial. **Binomial**: the number of successes in n independent yes/no trials (customers asking for water, correct guesses on an MCQ test). **Poisson**: the number of rare events in a fixed time or space (calls per minute, defects per sheet), also used to approximate the binomial when n is large and p small. **Normal**: the bell curve for measured quantities (scores, valve flow), handled through the **standard normal Z** and its table, and also used to approximate the binomial when np and nq are both at least 15. The lecture ends with a self-study introduction to the **t, $\\chi^2$ and F** distributions, which return in hypothesis testing.",

  simpleIntro: "These are the three most important probability distributions in statistics and data science. Each one answers a different kind of “how likely?” question. Learn **when** to use each, its **one formula**, and **one worked example**, and you can handle almost every exam question on this lecture. (The 📊 **Slides** tab has every lecturer example and slide reference.)",

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
              "title": "Binomial distribution",
              "tag": "Fixed number of trials",
              "figure": "i6-binom",
              "text": "Counts the number of **successes** in a fixed number of independent yes/no trials.",
              "example": "Out of 10 customers, how many ask for water?"
            },
            {
              "title": "Poisson distribution",
              "tag": "Events in an interval",
              "figure": "i6-poisson",
              "text": "Counts how many times an event happens in a fixed stretch of **time or space**.",
              "example": "How many customers arrive at a cafeteria in 10 minutes?"
            },
            {
              "title": "Normal distribution",
              "tag": "Continuous measurements",
              "figure": "i6-rule",
              "text": "Measurements that cluster around an average in a symmetric **bell-shaped** curve.",
              "example": "Exam scores, heights, measurement errors."
            }
          ]
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "How to choose in 5 seconds",
          "text": "- Counting **successes out of n tries**? → **Binomial**.\n- Counting **events per minute / per page / per km**, with no fixed number of tries? → **Poisson**.\n- **Measuring** something (score, weight, time) that can take any value? → **Normal**."
        }
      ]
    },
    {
      "id": "s-bern",
      "heading": "2. The building block: one yes/no trial (Bernoulli)",
      "slides": "5–8",
      "blocks": [
        {
          "type": "p",
          "text": "Before counting many trials, look at **one**: a single shot that either hits (1) or misses (0). That's a **Bernoulli trial** with success probability $p$."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Bernoulli",
          "text": "$P(X = 1) = p$, $P(X = 0) = 1 - p = q$\n\nMean $= p$, Variance $= pq$"
        },
        {
          "type": "p",
          "text": "A binomial is just **n Bernoulli trials added together**. Keep that picture in mind for the next section."
        }
      ]
    },
    {
      "id": "s-binom",
      "heading": "3. Binomial distribution",
      "slides": "10–23",
      "blocks": [
        {
          "type": "p",
          "text": "**When do we use it?** When all four conditions hold:"
        },
        {
          "type": "list",
          "items": [
            "A **fixed** number of trials, $n$.",
            "Each trial has only **two outcomes**: success or failure.",
            "The probability of success, $p$, **stays the same** every time.",
            "Trials are **independent** (one doesn't affect another)."
          ]
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "If $X$ is the number of successes:\n$$P(X = k) = \\binom{n}{k}\\,p^k\\,(1 - p)^{n - k}$$"
        },
        {
          "type": "p",
          "text": "**Where:** $n$ = number of trials · $k$ = number of successes you want · $p$ = probability of success · $1 - p = q$ = probability of failure · $\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}$ = number of ways to choose which $k$ trials succeed."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Mean and variance",
          "text": "$$E[X] = np \\qquad \\text{Var}(X) = np(1 - p)$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 1): water with meals",
          "text": "3 out of 5 customers ask for water with their meal, so $p = 0.6$. In a sample of $n = 10$ customers, what is the probability that **exactly 6** ask for water?\n\nGiven $n = 10$, $p = 0.6$, $k = 6$:\n$$P(X = 6) = \\binom{10}{6}(0.6)^6(0.4)^4 = 210 \\times 0.046656 \\times 0.0256 = 0.2508$$"
        },
        {
          "type": "answer",
          "value": "25.08%",
          "text": "The probability that exactly 6 of the 10 customers ask for water is about **25%**."
        },
        {
          "type": "p",
          "text": "Mean $= np = 10 \\times 0.6 = 6$ customers. Variance $= np(1 - p) = 10 \\times 0.6 \\times 0.4 = 2.4$. Standard deviation $= \\sqrt{2.4} = 1.549$."
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "The “at least” shortcut",
          "text": "“At least 3” means 3, 4, 5, …, 10: eight terms to add. Instead use the **complement**: $P(X \\ge 3) = 1 - [P(0) + P(1) + P(2)] = 1 - 0.0123 = 0.9877$. Always ask: is the opposite event shorter to compute?"
        },
        {
          "type": "diagram",
          "name": "i6-binom"
        },
        {
          "type": "check",
          "q": "A fair coin is tossed 4 times. What is the probability of exactly 2 heads?",
          "options": [
            "1/4",
            "3/8",
            "1/2",
            "5/8"
          ],
          "answer": 1,
          "why": "$\\binom{4}{2}(0.5)^2(0.5)^2 = 6 \\times \\frac{1}{16} = \\frac{3}{8}$."
        }
      ]
    },
    {
      "id": "s-pois",
      "heading": "4. Poisson distribution",
      "slides": "25–36",
      "blocks": [
        {
          "type": "p",
          "text": "**When do we use it?** To count events that happen **independently** at a **constant average rate** in a fixed interval of time or space, with no fixed number of “tries”. Examples:"
        },
        {
          "type": "list",
          "items": [
            "Customers arriving at a counter per 10 minutes.",
            "Calls to a switchboard per minute.",
            "Defects per sheet of metal, typos per page."
          ]
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$P(X = k) = \\frac{e^{-\\lambda}\\,\\lambda^k}{k!}$$"
        },
        {
          "type": "p",
          "text": "**Where:** $\\lambda$ (lambda) = **expected number of events in the interval** · $k$ = number of events you want the probability for · $e \\approx 2.71828$."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Mean and variance",
          "text": "$$E[X] = \\lambda \\qquad \\text{Var}(X) = \\lambda$$\nA key property: **the mean and the variance are equal.**"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Always scale λ to the interval asked",
          "text": "If customers arrive at **0.3 per minute** and the question asks about **10 minutes**, then $\\lambda = 0.3 \\times 10 = 3$. Forgetting to rescale is the most common Poisson mistake."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Example 8): cafeteria arrivals",
          "text": "Customers arrive at a cafeteria at 0.3 per minute. What is the probability that **exactly 2** arrive in a 10-minute period?\n\n$\\lambda = 0.3 \\times 10 = 3$, $k = 2$:\n$$P(X = 2) = \\frac{e^{-3}\\,3^2}{2!} = \\frac{0.049787 \\times 9}{2} = 0.2240$$"
        },
        {
          "type": "answer",
          "value": "22.40%",
          "text": "The probability of exactly 2 arrivals in 10 minutes is about **22.4%**. Mean $= 3$, variance $= 3$, standard deviation $= \\sqrt 3 = 1.732$."
        },
        {
          "type": "diagram",
          "name": "i6-poisson"
        },
        {
          "type": "p",
          "text": "**Binomial vs Poisson.** When $n$ is large and $p$ is small, the binomial can be approximated by a Poisson with $\\lambda = np$ (rule of thumb on the slides: $n \\ge 100$, $np \\le 10$). Lecturer's Example 9: 5% of books have defective bindings; $P$(exactly 2 of 100): binomial gives $0.081$, Poisson with $\\lambda = 5$ gives $0.084$. Close enough, and far easier to compute."
        },
        {
          "type": "check",
          "q": "A call centre receives on average 2 calls per minute. Under a Poisson model, what is the **variance** of the number of calls per minute?",
          "options": [
            "1",
            "2",
            "4",
            "$\\sqrt 2$"
          ],
          "answer": 1,
          "why": "For a Poisson, variance $= \\lambda = 2$ (the same as the mean)."
        }
      ]
    },
    {
      "id": "s-norm",
      "heading": "5. Normal distribution",
      "slides": "40–57",
      "blocks": [
        {
          "type": "p",
          "text": "**When do we use it?** For **continuous** measurements that cluster symmetrically around an average: biological measurements, manufacturing errors, exam scores. Unlike binomial and Poisson (which give the probability of exact counts), a continuous variable gives probability to **intervals**: $P(X = 70)$ exactly is 0; we ask $P(70 < X < 80)$."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The bell curve",
          "text": "$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\,e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}$$\n$\\mu$ = mean (the centre) · $\\sigma$ = standard deviation (the spread) · $\\sigma^2$ = variance. You never integrate this by hand; you use the **Z-table**."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The standard normal (Z-score)",
          "text": "Convert any normal value into a standard score:\n$$Z = \\frac{X - \\mu}{\\sigma}$$\nThe standard normal has $\\mu = 0$, $\\sigma = 1$. The Z-score says **how many standard deviations a value is above (+) or below (−) the mean**, so one table works for every normal distribution."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's Problems 12–14): statistics test scores",
          "text": "Test scores are normal with mean $\\mu = 75$ and SD $\\sigma = 4$. What proportion of students score **above 80**?\n\n**Step 1, Z-score:** $Z = \\frac{80 - 75}{4} = 1.25$.\n**Step 2, table:** $P(Z \\le 1.25) = 0.8944$.\n**Step 3, complement (“above”):** $P(X > 80) = 1 - 0.8944 = 0.1056$."
        },
        {
          "type": "answer",
          "value": "10.56%",
          "text": "About **10.6%** of students score above 80. And between 70 and 80: $P(-1.25 < Z < 1.25) = 0.8944 - 0.1056 = 0.7888$ (about 79%)."
        },
        {
          "type": "diagram",
          "name": "i6-z"
        },
        {
          "type": "table",
          "head": [
            "Within",
            "Range",
            "Share of data"
          ],
          "rows": [
            [
              "1 standard deviation",
              "$\\mu - \\sigma$ to $\\mu + \\sigma$",
              "**68%**"
            ],
            [
              "2 standard deviations",
              "$\\mu - 2\\sigma$ to $\\mu + 2\\sigma$",
              "**95%**"
            ],
            [
              "3 standard deviations",
              "$\\mu - 3\\sigma$ to $\\mu + 3\\sigma$",
              "**99.7%**"
            ]
          ],
          "caption": "The 68–95–99.7 rule: quick estimates without a table"
        },
        {
          "type": "diagram",
          "name": "i6-rule"
        },
        {
          "type": "check",
          "q": "A normal variable has mean 100 and standard deviation 15. What is the Z-score for $X = 130$?",
          "options": [
            "1",
            "1.5",
            "2",
            "3"
          ],
          "answer": 2,
          "why": "$Z = \\frac{130 - 100}{15} = 2$: 130 is two standard deviations above the mean."
        }
      ]
    },
    {
      "id": "s-approx",
      "heading": "6. Bridge: using the normal for a big binomial",
      "slides": "59–63",
      "blocks": [
        {
          "type": "p",
          "text": "When $n$ is large, binomial sums get tedious (imagine adding 14 terms). If **$np \\ge 15$ and $n(1 - p) \\ge 15$**, the binomial looks like a bell curve, so use a normal with $\\mu = np$ and $\\sigma = \\sqrt{np(1 - p)}$."
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Continuity correction (don't skip it)",
          "text": "A count like 13 is a **bar** from 12.5 to 13.5 on the continuous scale. So “fewer than 14” means $X < 13.5$, and “at most 20” means $X \\le 20.5$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's Problem 18",
          "text": "31% of seniors plan to go to college; $n = 50$. $P$(fewer than 14)? Check $np = 15.5$, $nq = 34.5$ ✓. $\\mu = 15.5$, $\\sigma = \\sqrt{50 \\times 0.31 \\times 0.69} = 3.27$. $Z = \\frac{13.5 - 15.5}{3.27} = -0.61$ → $P = 0.2709$. (The exact binomial gives $0.2747$: very close.)"
        }
      ]
    },
    {
      "id": "s-family",
      "heading": "7. A first look: t, χ² and F (used in later lectures)",
      "slides": "64–70",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Distribution",
            "Think of it as",
            "Used for"
          ],
          "rows": [
            [
              "**t**",
              "A normal curve with **fatter tails**, for small samples when σ is unknown",
              "Tests and intervals for means (Lectures 7, 9)"
            ],
            [
              "**$\\chi^2$** (chi-square)",
              "Right-skewed, only positive values",
              "Variances, goodness of fit, independence (Lecture 9)"
            ],
            [
              "**F**",
              "A ratio of two variances, only positive",
              "Comparing variances, ANOVA (Lecture 10)"
            ]
          ]
        },
        {
          "type": "p",
          "text": "For this lecture you only need to recognise them; you'll use their tables later."
        }
      ]
    },
    {
      "id": "s-compare",
      "heading": "8. Quick comparison table",
      "slides": "",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Property",
            "Binomial",
            "Poisson",
            "Normal"
          ],
          "rows": [
            [
              "Data type",
              "Discrete (counts)",
              "Discrete (counts)",
              "Continuous"
            ],
            [
              "What it counts / models",
              "Successes in $n$ trials",
              "Events per interval",
              "Measurements"
            ],
            [
              "Parameters",
              "$n$, $p$",
              "$\\lambda$",
              "$\\mu$, $\\sigma$"
            ],
            [
              "Mean",
              "$np$",
              "$\\lambda$",
              "$\\mu$"
            ],
            [
              "Variance",
              "$np(1 - p)$",
              "$\\lambda$",
              "$\\sigma^2$"
            ],
            [
              "Typical shape",
              "Depends on $n$, $p$",
              "Depends on $\\lambda$ (skewed when small)",
              "Bell-shaped, symmetric"
            ],
            [
              "Lecture example",
              "Water with meals",
              "Cafeteria arrivals",
              "Test scores"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-test",
      "heading": "9. Test your understanding",
      "slides": "",
      "blocks": [
        {
          "type": "p",
          "text": "Try these exam-style questions. Select an answer to check it."
        },
        {
          "type": "check",
          "q": "In 200 units with 3% defective, the number of defectives is best modelled by…",
          "options": [
            "Normal",
            "Poisson with $\\lambda = 6$",
            "Binomial with $n = 3$",
            "Poisson with $\\lambda = 0.03$"
          ],
          "answer": 1,
          "why": "$n$ is large and $p$ is small, so Poisson with $\\lambda = np = 200 \\times 0.03 = 6$ (lecturer's Example 7)."
        },
        {
          "type": "check",
          "q": "Calls arrive at 2 every 3 minutes. For a **9-minute** window, $\\lambda$ = ?",
          "options": [
            "2",
            "3",
            "6",
            "18"
          ],
          "answer": 2,
          "why": "Rescale the rate: $2 \\times \\frac{9}{3} = 6$ (lecturer's Example 6)."
        },
        {
          "type": "check",
          "q": "$P(Z > 1.25)$ when $P(Z \\le 1.25) = 0.8944$?",
          "options": [
            "0.8944",
            "0.1056",
            "0.7888",
            "0.3944"
          ],
          "answer": 1,
          "why": "“Greater than” → complement: $1 - 0.8944 = 0.1056$."
        },
        {
          "type": "check",
          "q": "Which needs a continuity correction?",
          "options": [
            "Poisson probability of exactly 2 events",
            "Normal approximation to a binomial",
            "Binomial probability of exactly 6",
            "Reading a Z-table"
          ],
          "answer": 1,
          "why": "Approximating a discrete count with a continuous curve: widen each count by ±0.5."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "10. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Binomial:** fixed $n$, two outcomes, constant $p$, independent. $P = \\binom{n}{k}p^k(1 - p)^{n - k}$; mean $np$, variance $np(1 - p)$.\n- **Poisson:** events per interval at a constant rate. $P = \\frac{e^{-\\lambda}\\lambda^k}{k!}$; **mean = variance = λ**. Rescale λ to the interval.\n- **Normal:** continuous, bell-shaped. Convert with $Z = \\frac{X - \\mu}{\\sigma}$, read the table, and take $1 -$ for “greater than”.\n- **Shortcuts:** “at least” → complement · 68–95–99.7 · Poisson ≈ binomial when $n$ big, $p$ small · Normal ≈ binomial when $np, nq \\ge 15$ (+ continuity correction)."
        },
        {
          "type": "p",
          "text": "The most important exam skill is **recognising which distribution fits the problem** before choosing a formula. Then switch to the ✍️ **Numerical** tab and practise the lecturer's problems."
        }
      ]
    }
  ],

  summary: [
    {
      id: "bernoulli",
      heading: "Lesson 1: One yes/no trial: the Bernoulli distribution",
      slides: "5–9",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Bernoulli distribution (slides 5–8)",
          text: "A trial with outcome 1 (success, probability p) or 0 (failure, probability $q = 1 - p$):\n$$p(x) = p^x q^{1-x}, \\quad x = 0, 1$$\n$$E(X) = p, \\qquad \\text{Var}(X) = pq$$\n**Proof:** $E(X) = 0 \\cdot q + 1 \\cdot p = p$; $E(X^2) = 0^2 q + 1^2 p = p$; $\\text{Var} = p - p^2 = p(1 - p) = pq$.",
        },
        {
          type: "p",
          text: "**Example (slide 6):** a basketball player scores with probability 0.6. P(miss) = $P(X = 0) = 1 - 0.6$ = **0.4**. A pass/fail exam is another Bernoulli trial. **Applications (slide 9):** quality control (pass/fail), yes/no survey questions, risk assessment (investment succeeds/fails), marketing campaigns (customer responds or not). Bernoulli is the binomial with just **one** trial.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Bernoulli(p): values 0/1, mean p, variance pq.",
        },
      ],
    },
    {
      id: "binomial",
      heading: "Lesson 2: How many successes in n trials? The binomial distribution",
      slides: "10–24",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The distribution of the **number of successes** in a fixed number of independent Bernoulli trials, and how to check whether a situation qualifies.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Binomial distribution (slides 10–13)",
          text: "**Conditions:** (1) a finite, fixed number of trials n; (2) the trials are independent; (3) the probability of success p is constant for each trial; (4) each trial has two mutually exclusive outcomes, success or failure.\n$$P(X = x) = \\binom{n}{x} p^x q^{n-x}, \\quad x = 0, 1, \\dots, n$$\nn = number of trials, x = number of successes, p = probability of success, $q = 1 - p$ = probability of failure.\n$$E(X) = np, \\qquad \\text{Var}(X) = npq$$\n(Proof: X is a sum of n independent Bernoulli variables, so add their means and variances.)",
        },
        {
          type: "p",
          text: "**Is it binomial? (slide 14)** (a) Number of people getting Corona in a room of 30: catching it is **not independent** (people infect each other), so not binomial. (b) 2 of 20 projectors are defective and 3 are selected: if the first two picks are both defective, the third is known to be good. The picks are **not independent** (sampling without replacement from a small lot), so not binomial.",
        },
        {
          type: "table",
          caption: "Translating words to symbols (slide 17)",
          head: ["Phrase", "Symbol"],
          rows: [
            ["at least", "$X \\ge x$"],
            ["more than, greater than", "$X > x$"],
            ["fewer than, less than", "$X < x$"],
            ["no more than, at most", "$X \\le x$"],
            ["exactly", "$X = x$"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: Example 1 (slides 15–16), water with meals",
          text: "3 out of 5 customers ask for water $(p = 0.6)$; sample $n = 10$.\n\n(i) $P(6) = \\binom{10}{6}(0.6)^6(0.4)^4 = 0.251$.\n(ii) Less than 9: $1 - [P(9) + P(10)] = 0.954$.\n(iii) No one: $P(0) = 0.4^{10} = 0.0001$.\n(iv) At most 2: $P(0) + P(1) + P(2) = 0.0001 + 0.0016 + 0.0106 = 0.0123$.\n(v) At least 3: $1 - [P(0) + P(1) + P(2)] = 0.9877$.",
        },
        { type: "diagram", name: "i6-binom" },
        {
          type: "p",
          text: "**Example 2 (slide 18):** ten coins, P(3 or fewer heads) = $(0.5)^{10}[\\binom{10}{0} + \\binom{10}{1} + \\binom{10}{2} + \\binom{10}{3}] = \\frac{1 + 10 + 45 + 120}{1024} = \\frac{176}{1024} = 0.1718$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Example 4 (slides 20–21), guessing an MCQ test",
          text: "5 questions, 4 choices each, pure guessing: $n = 5$, $p = 1/4$.\n\n(a) $P(3) = \\binom{5}{3}(1/4)^3(3/4)^2 = 45/512 = 0.0879$.\n(b) $P(X \\le 3) = 1 - P(4) - P(5) = 1 - 15/1024 - 1/1024 = 63/64$.\n(c) $P(X \\ge 1) = 1 - (3/4)^5 = 0.7627$.\n(d) Mean $np = 5/4$; variance $npq = 15/16$.",
        },
        {
          type: "p",
          text: "**Working backwards from mean and variance (Example 5, slide 22):** mean np = 6, variance npq = 4 → $q = 4/6 = 2/3$, $p = 1/3$, $n = 6/(1/3)$ = **18**. **Example 6 (slide 23):** mean defectives in samples of 20 is 2 → $p = 2/20 = 0.1$. $P(X \\ge 3) = 1 - [P(0) + P(1) + P(2)] = 0.323$, so out of 1000 samples about **323** have at least 3 defectives. **Example 3 (slide 19):** two dice rolled 5 times; “product = 6” ((1,6), (6,1), (2,3), (3,2)) has $p = 4/36 = 1/9$; $P(X \\ge 4) = 5(1/9)^4(8/9) + (1/9)^5 = 0.000694$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Using binomial when trials aren't independent (sampling without replacement from a small lot).\n- “Less than 9” includes 0–8. Use the complement $1 - P(9) - P(10)$ instead of adding nine terms.\n- Forgetting the $\\binom{n}{x}$ factor (the number of orders the successes can come in).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Binomial(n, p): fixed n, independent, constant p, two outcomes. $P(x)$ = ⁿCₓ $p^x$ $q^{n-x}$, mean np, variance npq.",
        },
      ],
    },
    {
      id: "poisson",
      heading: "Lesson 3: Counting rare events in time or space: the Poisson distribution",
      slides: "25–37",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The distribution for the number of events in a fixed interval when events are rare and there's no fixed upper limit, and how it approximates the binomial.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Poisson distribution (slides 25–26, 31)",
          text: "$$P(X = x) = \\frac{e^{-\\lambda}\\lambda^x}{x!}, \\quad x = 0, 1, 2, \\dots$$\n$\\lambda$ = expected number of occurrences in the interval. For a rate per unit time, use **λt** for an interval of length t.\n$$E(X) = \\lambda, \\qquad \\text{Var}(X) = \\lambda, \\qquad \\sigma = \\sqrt{\\lambda}$$\n**Mean and variance are the same!**",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Poisson approximation to the binomial (slides 25, 32)",
          text: "When n → $\\infty$ and p → 0 with np = $\\lambda$ fixed, Binomial(n, p) ≈ Poisson($\\lambda$ = np). The approximation is more accurate if **n ≥ 100 and np ≤ 10**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: Example 6 (slide 27), switchboard calls",
          text: "Calls arrive at 2 every 3 minutes. P(5 or more calls in 9 minutes)? Scale the rate to the interval: $\\lambda = 2 \\cdot \\frac{9}{3} = 6$.\n\n$P(X \\ge 5) = 1 - P(X \\le 4) = 1 - e^{-6}\\left(1 + 6 + \\frac{6^2}{2!} + \\frac{6^3}{3!} + \\frac{6^4}{4!}\\right) = 0.715$.",
        },
        { type: "diagram", name: "i6-poisson" },
        {
          type: "p",
          text: "**Example 7 (slide 28):** 3% of units are defective; in 200 units, $\\lambda = 200 \\times 0.03 = 6$. P(fewer than 2) = $P(0) + P(1)$ = $e^{-6} + 6e^{-6}$ = 0.00247 + 0.0148 = **0.0173**. **Example 10 (slides 35–36):** 0.6 calls per minute. (a) P(at least 1 in a minute) = $1 - e^{-0.6}$ = **0.4512**. (b) In 4 minutes, $\\lambda t = 2.4$: P(at least 3) = $1 - [P(0) + P(1) + P(2)]$ = **0.4303**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Example 9 (slides 33–34), binomial vs Poisson",
          text: "5% of books have defective bindings; P(exactly 2 of 100 defective)?\n\n(a) Binomial: $\\binom{100}{2}(0.05)^2(0.95)^{98} = 0.081$.\n(b) Poisson with $\\lambda$ = np = 5: $\\frac{5^2 e^{-5}}{2!} = 0.084$.\n\nClose, as the rule $n \\ge 100$, np ≤ 10 predicts.",
        },
        {
          type: "p",
          text: "**Example 8 (slides 29–30), the cafeteria:** customers arrive at 0.3 per minute. In 10 minutes $\\lambda = 3$: (a) $P(2) = \\frac{e^{-3}3^2}{2!}$ = **0.224**; (b) $P(X \\ge 2) = 1 - P(0) - P(1)$ = **0.80**; (c) exactly one in the first 5 minutes **and** one in the next 5 ($\\lambda = 1.5$ each, non-overlapping intervals, so multiply): $(1.5e^{-1.5})^2$ = **0.112**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): Example 8(c)",
          text: "Slide 30 writes the second factor as $e^{-0.3 \\cdot 1}(0.3 \\cdot 10)^1/1!$ and reports **0.001115**. The next 5-minute span also has $\\lambda = 0.3 \\times 5 = 1.5$, so both factors are $e^{-1.5}(1.5)$, giving **0.112**. (The slide's expression as printed doesn't evaluate to 0.001115 either.)",
        },
        {
          type: "p",
          text: "**Where Poisson appears (slide 37):** arrivals at queues (people at airports and banks, loan applications, read/write operations on file servers) and defects (per 1000 feet of copper wire, blemishes per square foot of paint, errors per typed page).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Not rescaling $\\lambda$ to the asked interval (2 per 3 minutes → 6 per 9 minutes).\n- Writing $\\sigma = \\lambda$. It's **σ² = $\\lambda$**, so $\\sigma = \\sqrt{\\lambda}$.\n- Applying Poisson to events that aren't rare or have a small fixed maximum (use binomial).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Poisson($\\lambda$): e^{−$\\lambda$}$\\lambda^x/x$!, mean = variance = $\\lambda$. Rescale $\\lambda$ to the interval. Approximates the binomial with $\\lambda$ = np ($n \\ge 100$, np ≤ 10).",
        },
      ],
    },
    {
      id: "normal",
      heading: "Lesson 4: The bell curve: normal and standard normal distributions",
      slides: "38–58",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The normal distribution's shape and properties, the 68–95–99.7 rule, and how to find any normal probability with the Z table.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Normal distribution (slides 40, 48)",
          text: "$$f(x; \\mu, \\sigma) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}, \\quad -\\infty < x < \\infty$$\nParameters: mean $\\mu$ (−$\\infty < \\mu < \\infty$) and standard deviation $\\sigma > 0$; we write $X \\sim N(\\mu, \\sigma^2)$. $E(X) = \\mu$, $\\text{Var}(X) = \\sigma^2$.",
        },
        {
          type: "list",
          items: [
            "Bell-shaped and **symmetric** about the mean; **mean = median = mode** (slide 41).",
            "Total area under the curve = 1.",
            "The curve approaches the x-axis but **never touches** it.",
            "Changing $\\mu$ **shifts** the curve; changing $\\sigma$ makes it **wider/flatter or narrower/taller** (slides 41, 47, 58).",
            "It describes heights, weights, lengths, profits, prices, wages, times and the **errors of repeated measurements** (slide 39).",
          ],
        },
        { type: "diagram", name: "i6-rule" },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): the 3σ figure",
          text: "Slide 44 labels the area within $\\mu \\pm 3 \\sigma$ as **99.97%** (49.99% each side). Slide 48, and the standard normal table $(2 \\times 0.49865 = 0.9973)$, give **99.7%**. Use 99.7%.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Standardising (slides 49–51)",
          text: "$$Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$$\nThe standard normal has mean 0 and SD 1. Its CDF $F(z) = P(Z \\le z)$ is tabulated (slide 51). Use symmetry for negatives:\n$$F(-z) = 1 - F(z), \\qquad P(Z > z) = 1 - F(z), \\qquad P(a < Z < b) = F(b) - F(a)$$",
        },
        {
          type: "p",
          text: "**Why standardise? (slide 49)** Take $x = 1$, 2, 3, 4, 5 $(\\mu = 3, \\sigma = 1.41)$. Subtracting 3 and dividing by 1.41 gives z = −1.42, −0.71, 0, 0.71, 1.42, with mean 0 and SD 1. Any normal X becomes Z, so **one table works for every normal distribution**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: Problem 11 (slide 52), reading the table",
          text: "(a) $P(Z < 1.75) = F(1.75) = 0.9599$.\n(b) $P(Z < -1.25) = 1 - F(1.25) = 0.1056$.\n(c) $P(Z > 2.06) = 1 - F(2.06) = 0.0197$.\n(d) $P(Z > -1.82) = F(1.82) = 0.9656$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Problem 14 (slide 55), between two values",
          text: "Statistics test: $\\mu = 75$, $\\sigma = 4$. $P(70 < X < 80)$?\n\n$z_1 = \\frac{70 - 75}{4} = -1.25$, $z_2 = \\frac{80 - 75}{4} = 1.25$.\n\n$P = F(1.25) - F(-1.25) = 0.8944 - 0.1056 = 0.7888$.",
        },
        { type: "diagram", name: "i6-z" },
        {
          type: "table",
          caption: "The other normal problems on the slides",
          head: ["Problem", "Set-up", "Working", "Answer"],
          rows: [
            ["12 (slide 53)", "$\\mu = 30$, $\\sigma = 4$; $P(X < 40)$", "$z = 2.5$", "**0.9938**"],
            ["13 (slide 54)", "$\\mu = 30$, $\\sigma = 4$; $P(X > 38)$", "$z = 2$ → $1 - 0.9773$", "**0.0227**"],
            ["15 (slide 56)", "$\\mu = 30$, $\\sigma = 5$; $(i) P(26 \\le X \\le 40)$, (ii) $P(X > 45)$", "(i) z = −0.8 to 2: 0.2881 + 0.4772; (ii) $z = 3$: $0.5 - 0.49865$", "**0.7653**, **0.00135**"],
            ["16 (slide 57)", "Valves $\\mu = 496$, $\\sigma = 25$; $(a) P(X \\ge 450)$, $(b) P(445.5 < X < 522)$", "(a) z = −1.84: $1 - 0.0329$; (b) z = −2.02 to 1.04: $0.8508 - 0.0217$", "**0.9671**, **0.8291**"],
          ],
        },
        {
          type: "p",
          text: "(Slide 53's last line says “less than 90”; it means less than **40**.) Slide 56 uses the other style of table, the **area between 0 and z**: $P(0 \\le Z \\le 0.8) = 0.2881$ and $P(0 \\le Z \\le 2) = 0.4772$. Either table works; just know which one you're reading.",
        },
        {
          type: "p",
          text: "**Skewness reminder (slides 45–46):** negatively skewed = longer left tail, mass concentrated on the right; positively skewed = longer right tail, mass on the left (as in Lecture 1). The normal curve has neither.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Reading $P(Z > z)$ straight from a cumulative table. You need $1 - F(z)$.\n- Dividing by the variance instead of $\\sigma$ in $z = (x - \\mu)/\\sigma$.\n- Mixing the cumulative table (slide 51) with the 0-to-z table (slide 56).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$N(\\mu, \\sigma^2)$: symmetric, mean = median = mode. 68–95–99.7. $z = (x - \\mu)/\\sigma$; F(−z) = $1 - F(z)$; $P(a < Z < b) = F(b) - F(a)$.",
        },
      ],
    },
    {
      id: "approx",
      heading: "Lesson 5: When the binomial is too tedious: the normal approximation",
      slides: "59–63",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Normal approximation to the binomial (slide 59)",
          text: "If **np ≥ 15 and nq ≥ 15**, the binomial X is approximately normal with\n$$\\mu = np, \\qquad \\sigma = \\sqrt{npq}$$\n**Continuity correction:** a discrete value x covers the interval $x - 0.5$ to x + 0.5, so “fewer than 14” → $P(X < 13.5)$, “at most 20” → $P(X \\le 20.5)$.",
        },
        {
          type: "p",
          text: "**Can we use it? (Problem 17, slides 60–61)** (1) $n = 45$, $p = 0.47$: np = 21.15, nq = 23.85, both ≥ 15 → **yes**. (2) $n = 25$, $p = 0.36$: np = 9 < 15 → **no**, use the binomial.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: Problem 18 (slide 62)",
          text: "31% of seniors plan to attend college; $n = 50$. P(fewer than 14)?\n\nCheck: np = 15.5, nq = 34.5 → OK. $\\mu = 15.5$, $\\sigma = \\sqrt{50 \\times 0.31 \\times 0.69} = 3.27$.\n\nContinuity correction: $P(X < 13.5)$. $z = \\frac{13.5 - 15.5}{3.27} = -0.61$. $P(Z < -0.61) = 0.2709$.",
        },
        { type: "diagram", name: "i6-approx" },
        {
          type: "p",
          text: "**Problem 19 (slide 63), seeded clouds:** $n = 40$, $p = 0.62$: $\\mu = 24.8$, $\\sigma^2 = 9.424$, $\\sigma = 3.0699$; np = $24.8 \\ge 15$ and nq = $15.2 \\ge 15$. P(at most 20) → $P(X \\le 20.5)$: $z = \\frac{20.5 - 24.8}{3.0699} = -1.40$, so $P = F(-1.40) = 0.0808$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): Problem 19",
          text: "Slide 63 gives $F(-1.40) = 0.808$. Since z is negative, the probability must be below 0.5: from the table $F(1.40) = 0.9192$, so **F(−1.40) = $1 - 0.9192 = 0.0808$**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Check np ≥ 15 and nq ≥ 15 → $\\mu$ = np, $\\sigma$ = √(npq) → ±0.5 continuity correction → z → table.",
        },
      ],
    },
    {
      id: "family",
      heading: "Lesson 6 (self-study): Introducing the t, χ² and F distributions",
      slides: "64–71",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "What the three sampling distributions used in hypothesis testing look like and when they arise. Just the introduction, as on the slides.",
        },
        {
          type: "table",
          head: ["Distribution", "Arises as / used for", "Shape", "Parameter(s)"],
          rows: [
            ["**t** (Student's t)", "Sampling distribution of the mean when $\\sigma$ is **unknown**, for small samples; uses sample SD $S = \\sqrt{\\frac{1}{n-1}\\sum(x_i - \\bar x)^2}$", "Bell-shaped and symmetric like Z, but **heavier tails**; t → Z as degrees of freedom increase", "$\\nu$ degrees of freedom"],
            ["**χ²** (chi-square)", "Sampling distribution of the sample variance; analysis of variance; **goodness of fit**; estimation and hypothesis testing", "Not symmetric; ranges from 0 to $\\infty$ (first quadrant only)", "$\\nu$ degrees of freedom only"],
            ["**F**", "Ratio of two sample variances, $F = \\frac{S_1^2/\\sigma_1^2}{S_2^2/\\sigma_2^2}$, from independent normal samples; comparing population variances", "Lies entirely in the first quadrant", "$\\nu_1 = n_1 - 1$, $\\nu_2 = n_2 - 1$; **order matters**"],
          ],
        },
        { type: "diagram", name: "i6-family" },
        {
          type: "p",
          text: "The pdfs on slides 65, 66 and 69 involve the gamma function $\\Gamma$; you don't need to integrate them. Their tables are used in Lectures 7, 9 and 10. The F-distribution was developed by **Fisher** to study the behaviour of two variances (slide 70).",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Which distribution?",
      head: ["Situation", "Distribution", "Formula", "Mean / Var"],
      rows: [
        ["One yes/no trial", "Bernoulli(p)", "$p^xq^{1-x}$", "p / pq"],
        ["Successes in n independent trials", "Binomial(n, p)", "$\\binom{n}{x}p^xq^{n-x}$", "np / npq"],
        ["Rare events per interval", "Poisson($\\lambda$)", "$e^{-\\lambda}\\lambda^x/x!$", "$\\lambda/\\lambda$"],
        ["Measured, bell-shaped", "Normal($\\mu$, $\\sigma^2$)", "$z = (x-\\mu)/\\sigma$", "$\\mu/\\sigma^2$"],
      ],
    },
    { type: "diagram", name: "i6-rule" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Check binomial conditions · rescale $\\lambda$ to the interval · $1 - F(z)$ for “greater than” · np, nq ≥ 15 and ±0.5 for the normal approximation.",
    },
  ],

  glossary: [
    ["Bernoulli trial", "", "A single trial with outcomes 1 (success) or 0 (failure)"],
    ["Binomial(n, p)", "", "Number of successes in n independent Bernoulli trials"],
    ["Poisson($\\lambda$)", "", "Number of rare events in an interval with mean $\\lambda$"],
    ["$\\lambda$", "lambda", "Expected number of occurrences in the interval (Poisson mean and variance)"],
    ["$N(\\mu, \\sigma^2)$", "Normal distribution", "Bell curve with mean $\\mu$ and variance $\\sigma^2$"],
    ["Z", "Standard normal variable", "$(X - \\mu)/\\sigma$ ~ $N(0, 1)$"],
    ["$F(z)$", "Standard normal CDF", "$P(Z \\le z)$, read from the table"],
    ["Continuity correction", "", "±0.5 adjustment when approximating a discrete distribution by a continuous one"],
    ["t, $\\chi^2$, F", "Student's t, chi-square, Fisher's F", "Sampling distributions used in tests (with degrees of freedom)"],
    ["df, $\\nu$", "Degrees of freedom", "Parameter of t, $\\chi^2$ and F distributions"],
  ],

  examTips: [
    "Always state the distribution and its parameters first, e.g. “X ~ Bin(10, 0.6)” or “X ~ Poisson(6)”.",
    "Use complements for “at least” and “less than (large number)” to avoid long sums.",
    "Draw a quick bell curve and shade the region before using the Z table.",
    "For normal approximations, write the np and nq check explicitly: it's a mark.",
  ],

  problems: [
    {
      title: "Bernoulli: missing a shot (slide 6)",
      level: "From slides",
      question: "A basketball player scores with probability 0.6. What's the probability of a miss? Find the mean and variance of X (1 = score).",
      solution: "P(miss) = $1 - 0.6$ = **0.4**. $E(X) = p$ = **0.6**; Var = pq = **0.24**.",
    },
    {
      title: "Is it binomial? (slide 14)",
      level: "From slides",
      question: "Which binomial conditions fail? (a) Number of people getting Corona in a room of 30. (b) 3 of 20 projectors (2 defective) are tested.",
      solution: "(a) Infection isn't **independent** across people → not binomial. (b) Without replacement from a small lot, each pick changes the next pick's probability → trials not **independent** (p not constant) → not binomial.",
    },
    {
      title: "Example 1: water with meals (slides 15–16)",
      level: "From slides",
      hint: "$n = 10$, $p = 0.6$. Use complements for (ii) and (v).",
      question: "3 of every 5 customers ask for water. For 10 customers: (i) exactly 6, (ii) less than 9, (iii) none, (iv) at most 2, (v) at least 3 ask for water.",
      solution: "X ~ Bin(10, 0.6).\n(i) $\\binom{10}{6}0.6^6 0.4^4 =$ **0.251**. (ii) $1 - P(9) - P(10) = 1 - 0.0403 - 0.0060$ = **0.954**. (iii) $0.4^{10} =$ **0.0001**. (iv) 0.0001 + 0.0016 + 0.0106 = **0.0123**. (v) $1 - 0.0123$ = **0.9877**.",
    },
    {
      title: "Example 2: ten coins (slide 18)",
      level: "From slides",
      question: "Ten coins are thrown. P(3 or fewer heads)?",
      solution: "$(0.5)^{10}(1 + 10 + 45 + 120) = 176/1024 =$ **0.1718**.",
    },
    {
      title: "Example 3: product of two dice (slide 19)",
      level: "From slides",
      question: "A pair of dice is rolled 5 times; success = product 6. P(at least 4 successes)?",
      solution: "$p = 4/36 = 1/9$ ((1,6), (6,1), (2,3), (3,2)). $P(X \\ge 4) = 5(1/9)^4(8/9) + (1/9)^5 =$ **0.000694**.",
    },
    {
      title: "Example 4: guessing MCQs (slides 20–21)",
      level: "From slides",
      question: "5 questions, 4 choices, guessing. P(a) exactly 3, (b) at most 3, (c) at least 1 correct; (d) mean and variance.",
      solution: "(a) $10 \\times(1/64) \\times(9/16)$ = **45/512 = 0.0879**. (b) $1 - 15/1024 - 1/1024$ = **63/64**. (c) $1 - (3/4)^5$ = **0.7627**. (d) Mean **5/4**, variance **15/16**.",
    },
    {
      title: "Example 5: binomial from mean and variance (slide 22)",
      level: "From slides",
      question: "Find the binomial distribution with mean 6 and variance 4.",
      solution: "q = npq/np = 4/6 = 2/3, $p = 1/3$, $n = 6/(1/3) = 18$ → **X ~ Bin(18, 1/3)**, $P(X = x) = \\binom{18}{x}(1/3)^x(2/3)^{18-x}$.",
    },
    {
      title: "Example 6: samples with at least 3 defectives (slide 23)",
      level: "From slides",
      question: "Mean defectives in samples of 20 is 2. Of 1000 samples, how many have at least 3 defectives?",
      solution: "np = 2 → $p = 0.1$. $P(X \\ge 3) = 1 - [0.9^{20} + 20(0.1)(0.9)^{19} + 190(0.01)(0.9)^{18}] = 1 - 0.6769 = 0.323$ → **≈ 323 samples**.",
    },
    {
      title: "Poisson Example 6: switchboard (slide 27)",
      level: "From slides",
      question: "Calls arrive at 2 every 3 minutes. P(5 or more calls in 9 minutes)?",
      solution: "$\\lambda = 2 \\times 9/3 = 6$. $P(X \\ge 5) = 1 - P(X \\le 4)$ = **0.715**.",
    },
    {
      title: "Poisson Example 7: defective units (slide 28)",
      level: "From slides",
      question: "3% of units are defective. In a sample of 200, P(fewer than 2 defective)?",
      solution: "$\\lambda = 6$. $P(0) + P(1) = e^{-6}(1 + 6) = 0.00247 + 0.0148$ = **0.0173**.",
    },
    {
      title: "Poisson Example 8: cafeteria arrivals (slides 29–30)",
      level: "From slides",
      hint: "$\\lambda = 0.3$ × (minutes). For (c), multiply the two 5-minute probabilities.",
      question: "Customers arrive at 0.3 per minute. (a) P(exactly 2 in 10 minutes), (b) P(2 or more in 10 minutes), (c) P(exactly 1 in a 5-minute span and 1 in the next 5-minute span).",
      solution: "$(a) \\lambda = 3$: $9 e^{-3}/2$ = **0.224**. (b) $1 - e^{-3}(1 + 3)$ = **0.80**.\n$(c) \\lambda = 1.5$ per span: (1.5e^{−1.5})² = $0.3347^2$ = **0.112**.\n⚠️ The slide reports 0.001115, using a second factor with $(0.3 \\cdot 10)$ and e^{−0.3}; see the flag in Lesson 3.",
    },
    {
      title: "Poisson Example 9: defective bindings (slides 33–34)",
      level: "From slides",
      question: "5% of books have defective bindings. P(2 of 100 defective) by (a) the binomial, (b) the Poisson approximation.",
      solution: "(a) $\\binom{100}{2}0.05^2 0.95^{98} =$ **0.081**. $(b) \\lambda = 5$: $25 e^{-5}/2$ = **0.084**.",
    },
    {
      title: "Poisson Example 10: 0.6 calls per minute (slides 35–36)",
      level: "From slides",
      question: "A switchboard gets 0.6 calls per minute. P(a) at least 1 call in a minute, (b) at least 3 calls in 4 minutes.",
      solution: "(a) 1 − e^{−0.6} = **0.4512**. $(b) \\lambda t = 2.4$: 1 − e^{−2.4}(1 + 2.4 + 2.88) = **0.4303**.",
    },
    {
      title: "Problem 11: standard normal probabilities (slide 52)",
      level: "From slides",
      question: "Z standard normal. Find $P(Z < 1.75)$, P(Z < −1.25), $P(Z > 2.06)$, P(Z > −1.82).",
      solution: "**0.9599**, $1 - 0.8944$ = **0.1056**, $1 - 0.9803$ = **0.0197**, $F(1.82)$ = **0.9656**.",
    },
    {
      title: "Problems 12–14: test scores (slides 53–55)",
      level: "From slides",
      question: "$(12) \\mu = 30$, $\\sigma = 4$: $P(X < 40)$? (13) Same: $P(X > 38)$? $(14) \\mu = 75$, $\\sigma = 4$: $P(70 < X < 80)$?",
      solution: "(12) $z = 2.5$ → **0.9938**. (13) $z = 2$ → $1 - 0.9773$ = **0.0227**. (14) z = ±1.25 → $0.8944 - 0.1056$ = **0.7888**.",
    },
    {
      title: "Problem 15: N(30, 5²) (slide 56)",
      level: "From slides",
      question: "X ~ $N(30, 5^2)$. Find $(i) P(26 \\le X \\le 40)$, (ii) $P(X > 45)$.",
      solution: "(i) z = −0.8 to 2: 0.2881 + 0.4772 = **0.7653**. (ii) $z = 3$: $0.5 - 0.49865$ = **0.00135**.",
    },
    {
      title: "Problem 16: butterfly valves (slide 57)",
      level: "From slides",
      question: "Flow coefficient ~ $N(496, 25^2)$. P(a) at least 450, (b) between 445.5 and 522.",
      solution: "(a) z = −1.84: $1 - 0.0329$ = **0.9671**. (b) z = −2.02 and 1.04: $0.8508 - 0.0217$ = **0.8291**.",
    },
    {
      title: "Problems 17–19: normal approximation (slides 60–63)",
      level: "From slides",
      question: "(17) Can the normal approximation be used for $n = 45$, $p = 0.47$ and $n = 25$, $p = 0.36$? (18) 31% plan college, $n = 50$: P(fewer than 14)? (19) 62% of seeded clouds grow, $n = 40$: P(at most 20)?",
      solution: "(17) 21.15 and $23.85 \\ge 15$ → **yes**; np = 9 < 15 → **no**.\n$(18) \\mu = 15.5$, $\\sigma = 3.27$; $P(X < 13.5)$ → z = −0.61 → **0.2709**.\n$(19) \\mu = 24.8$, $\\sigma = 3.0699$; $P(X \\le 20.5)$ → z = −1.40 → **0.0808** (the slide's 0.808 is a slip: a negative z can't give more than 0.5).",
    },
    {
      title: "Practice 1: machine breakdowns (slides 72–73)",
      level: "From slides",
      question: "8% of machines break down at least once a year. Using the Poisson approximation, among 25 machines find $P(a)$ 5 break down, (b) at least 4, (c) 3 to 8 inclusive.",
      solution: "*Exercise solution prepared for the website.*\n$\\lambda = 25 \\times 0.08 = 2$.\n(a) $\\frac{e^{-2}2^5}{5!} =$ **0.0361**.\n(b) $1 - [P(0) + P(1) + P(2) + P(3)] = 1 - e^{-2}(1 + 2 + 2 + 4/3)$ = **0.1429**.\n$(c) P(3)$ + … + $P(8)$ = **0.3231**.",
    },
    {
      title: "Practice 2: trucks at a depot (slide 74)",
      level: "From slides",
      question: "On average 12 trucks arrive per day. P(fewer than 9 arrive on a given day)?",
      solution: "*Exercise solution prepared for the website.*\n$\\lambda = 12$. $P(X \\le 8) = \\sum_0^8 e^{-12}$ $12^x/x$! = **0.1550**.",
    },
    {
      title: "Practice 3: sheet-metal defects (slide 75)",
      level: "From slides",
      question: "5 defects per 10 sq ft on average. P(a 15 sq ft sheet has at least 6 defects)?",
      solution: "*Exercise solution prepared for the website.*\n$\\lambda = 15 \\times 5/10 = 7.5$. $P(X \\ge 6) = 1 - P(X \\le 5)$ = **0.7586**.",
    },
    {
      title: "Practice 4: standard normal areas (slides 76–77)",
      level: "From slides",
      question: "$P(Z > 1.09)$, P(Z < −1.65), P(−$1 < Z < 1.96$), $P(1.25 < Z < 2.75)$?",
      solution: "$0.5 - 0.3621$ = **0.1379**; $0.5 - 0.4505$ = **0.0495**; 0.3413 + 0.4750 = **0.8163**; $0.4970 - 0.3944$ = **0.1026**.",
    },
    {
      title: "Practice 5: instrument life (slide 78)",
      level: "From slides",
      question: "Life ~ $N(12, 2^2)$ months. P(a) less than 7, (b) between 7 and 12 months.",
      solution: "(a) z = −2.5 → **0.0062**.\n(b) *Solution prepared for the website:* z from −2.5 to 0 → $0.5 - 0.0062$ = **0.4938**.",
    },
    {
      title: "Practice 6: computer crashes (slide 79)",
      level: "From slides",
      hint: "“Once every 4 months” means $\\lambda = 1$ for a 4-month period.",
      question: "A computer crashes on average once every 4 months. In a 4-month period, P(no crash), $P(1)$, $P(2)$, P(3 crashes)?",
      solution: "*Exercise solution prepared for the website.*\n$\\lambda = 1$ per 4 months: $P(0) = e^{-1}$ = **0.3679**, $P(1)$ = **0.3679**, $P(2)$ = **0.1839**, $P(3)$ = **0.0613**.\n⚠️ The slide's hint writes $P(x) = 4^x e^{-4}/x$! $(\\lambda = 4)$, which would mean 4 crashes per 4 months; that contradicts “once every 4 months”. With $\\lambda = 4$ the values would be 0.0183, 0.0733, 0.1465, 0.1954.",
    },
    {
      title: "Practice 7–9: binomial (slide 80)",
      level: "From slides",
      question: "(7) Binomial with mean 20 and $n = 30$: variance and SD? (8) $p = 0.2$ per shot; how many shots so that P(at least one hit) > 2/3? (9) 15% of candies are pink; P(exactly 4 pink out of 10)?",
      solution: "*Exercise solutions prepared for the website.*\n(7) $p = 20/30 = 2/3$, $q = 1/3$: variance = 30(2/3)(1/3) = **6.67**, SD = **2.58**.\n(8) $1 - 0.8^n > 2/3$ → $0.8^n < 1/3$ → $n > \\ln(1/3)/\\ln(0.8) = 4.92$ → **n = 5** shots.\n(9) $\\binom{10}{4}0.15^4 0.85^6 =$ **0.040** ✓.",
    },
    {
      title: "Level 1: Bernoulli mean and variance",
      level: "Level 1",
      question: "A customer buys after a demo with probability 0.7. For $X = 1$ if they buy, find $E(X)$ and $\\text{Var}(X)$.",
      solution: "$E(X)$ = **0.7**, $\\text{Var} = 0.7 \\times 0.3$ = **0.21**.",
    },
    {
      title: "Level 1: binomial probability",
      level: "Level 1",
      question: "A fair coin is tossed 4 times. P(exactly 2 heads)?",
      solution: "$\\binom{4}{2}(0.5)^4 = 6/16 =$ **0.375**.",
    },
    {
      title: "Level 1: Poisson zero",
      level: "Level 1",
      question: "A help desk gets 2 tickets per hour on average. P(no tickets in an hour)?",
      solution: "$e^{-2} =$ **0.1353**.",
    },
    {
      title: "Level 2: n and p from mean and variance",
      level: "Level 2",
      question: "A binomial distribution has mean 8 and variance 4.8. Find n and p.",
      solution: "$q = 4.8/8 = 0.6$ → p = **0.4**, $n = 8/0.4$ = **20**.",
    },
    {
      title: "Level 2: tall students",
      level: "Level 2",
      question: "Heights ~ $N(165, 6^2)$ cm. P(height > 177 cm)?",
      solution: "$z = (177 - 165)/6 = 2$ → $1 - 0.9772$ = **0.0228**.",
    },
    {
      title: "Level 2: Poisson approximation",
      level: "Level 2",
      question: "1% of items are defective. In a batch of 200, use the Poisson approximation to find P(at most 1 defective).",
      solution: "$\\lambda = 2$: $e^{-2}(1 + 2)$ = **0.406**. ($n = 200 \\ge 100$ and np = $2 \\le 10$, so the approximation is appropriate.)",
    },
    {
      title: "Level 3: 100 coin tosses",
      level: "Level 3",
      question: "A fair coin is tossed 100 times. Using the normal approximation, find P(at least 60 heads).",
      solution: "np = nq = $50 \\ge 15$; $\\mu = 50$, $\\sigma = \\sqrt{25} = 5$. “At least 60” → $P(X \\ge 59.5)$: $z = 1.9$ → $1 - 0.9713$ = **0.0287**.",
    },
    {
      title: "Level 3: find σ",
      level: "Level 3",
      question: "X ~ $N(50, \\sigma^2)$ and $P(X > 60) = 0.1587$. Find $\\sigma$.",
      solution: "$1 - F(z) = 0.1587$ → $F(z) = 0.8413$ → $z = 1$. So $(60 - 50)/\\sigma = 1$ → **σ = 10**.",
    },
    {
      title: "Level 3: which distribution?",
      level: "Level 3",
      question: "Name the distribution and its parameters: (a) typing errors per page when the average is 1.5; (b) number of sixes in 12 rolls of a die; (c) weight of 1-kg rice bags with mean 1.002 kg and SD 0.01 kg.",
      solution: "(a) **Poisson($\\lambda = 1.5$)**: rare events per unit, no fixed maximum. (b) **Binomial($n = 12$, $p = 1/6$)**: fixed independent trials with constant p. (c) **Normal($\\mu = 1.002$, $\\sigma = 0.01$)**: a measured quantity with symmetric errors.",
    },
  ],

  theory: [
    {
      title: "Conditions for the binomial distribution",
      level: "Level 1",
      question: "State the conditions under which the binomial distribution applies, and give an example where one fails.",
      solution: "(1) Fixed finite number of trials n; (2) independent trials; (3) constant probability of success p; (4) two mutually exclusive outcomes per trial. Fails, e.g., when selecting 3 of 20 projectors (2 defective) without replacement: the trials aren't independent (slide 14).",
    },
    {
      title: "Binomial vs Poisson",
      level: "Level 2",
      question: "Compare the binomial and Poisson distributions. When can the Poisson approximate the binomial?",
      solution: "| | Binomial | Poisson |\n|---|---|---|\n| Counts | Successes in n trials | Events in an interval |\n| Range | 0…n | 0, 1, 2, … (no upper bound) |\n| Parameters | n, p | $\\lambda$ |\n| Mean / variance | np / npq (variance < mean) | $\\lambda/\\lambda$ (equal) |\n\nPoisson approximates the binomial with $\\lambda$ = np when n is large and p small; accurate if $n \\ge 100$ and np ≤ 10 (slide 32).",
    },
    {
      title: "Properties of the normal distribution",
      level: "Level 1",
      question: "List the properties of the normal curve and the empirical areas.",
      solution: "Bell-shaped and symmetric about $\\mu$; mean = median = mode; total area 1; asymptotic to the x-axis; $\\mu$ sets location, $\\sigma$ sets spread. About 68% of the area lies within $\\mu \\pm \\sigma$, 95% within $\\mu \\pm 2 \\sigma$, 99.7% within $\\mu \\pm 3 \\sigma$ (slides 41–48).",
    },
    {
      title: "Why standardise?",
      level: "Level 2",
      question: "Why do we convert a normal variable to Z, and how?",
      solution: "Every normal distribution has a different $\\mu$ and $\\sigma$, but $Z = (X - \\mu)/\\sigma$ maps any of them onto $N(0, 1)$ without changing areas (probabilities). So a single table of $F(z) = P(Z \\le z)$ gives probabilities for every normal distribution (slides 49–51).",
    },
    {
      title: "t, χ² and F at a glance",
      level: "Level 2",
      question: "Briefly describe the t, $\\chi^2$ and F distributions and where each is used.",
      solution: "**t:** symmetric, bell-shaped with heavier tails than Z; used for the sample mean when $\\sigma$ is unknown (small samples); tends to Z as df grows. **χ²:** non-negative and skewed, depends only on df; used for the sample variance, goodness of fit and ANOVA. **F:** non-negative ratio of two scaled sample variances with $(n_1 - 1, n_2 - 1)$ df, where order matters; used to compare two variances (slides 64–71).",
    },
  ],

  quiz: [
    {
      topic: "Binomial",
      type: "num",
      q: "X ~ Bin(10, 0.6). $P(X = 6)$? (3 decimals)",
      answer: 0.251,
      tol: 0.001,
      why: "¹⁰C₆ = 210, and $210 \\times 0.6^6 \\times 0.4^4 = 0.2508$.",
    },
    {
      topic: "Binomial",
      type: "num",
      q: "5 MCQs with 4 options, guessing. P(at least one correct)? (4 decimals)",
      answer: 0.7627,
      tol: 0.0005,
      why: "$1 - (3/4)^5$.",
    },
    {
      topic: "Binomial",
      type: "num",
      q: "Binomial mean 6, variance 4. n = ?",
      answer: 18,
      tol: 0.01,
      why: "$q = 2/3$, $p = 1/3$, $n = 6/p$.",
    },
    {
      topic: "Binomial",
      q: "Selecting 3 of 20 projectors (2 defective) without replacement is not binomial because…",
      options: ["n isn't fixed", "Trials aren't independent", "There are more than two outcomes", "p is too small"],
      answer: 1,
      why: "Each pick changes the next pick's probability.",
      wrong: ["$n = 3$ is fixed.", null, "Defective/not defective: two outcomes.", "Small p is fine for a binomial."],
    },
    {
      topic: "Poisson",
      type: "num",
      q: "2 calls per 3 minutes. $\\lambda$ for a 9-minute period?",
      answer: 6,
      tol: 0.001,
      why: "$2 \\times 9/3$.",
    },
    {
      topic: "Poisson",
      type: "num",
      q: "0.6 calls per minute. P(at least one call in a minute)? (4 decimals)",
      answer: 0.4512,
      tol: 0.0005,
      why: "1 − e^(−0.6).",
    },
    {
      topic: "Poisson",
      q: "For a Poisson distribution with $\\lambda = 9$, the standard deviation is…",
      options: ["9", "81", "3", "4.5"],
      answer: 2,
      why: "Variance = $\\lambda = 9$, so $\\sigma = \\sqrt{9} = 3$.",
      wrong: ["That's the variance.", "That's $\\lambda^2$.", null, "No such rule."],
    },
    {
      topic: "Poisson",
      q: "The Poisson approximation to the binomial is most accurate when…",
      options: ["$n \\ge 100$ and np ≤ 10", "np ≥ 15 and nq ≥ 15", "$p = 0.5$", "$n < 30$"],
      answer: 0,
      why: "Slide 32's rule.",
      wrong: [null, "That's the condition for the normal approximation.", "Symmetric p suits the normal approximation, not Poisson.", "Poisson needs large n."],
    },
    {
      topic: "Normal",
      type: "num",
      q: "$\\mu = 75$, $\\sigma = 4$. $P(70 < X < 80)$? (4 decimals)",
      answer: 0.7888,
      tol: 0.0005,
      why: "$F(1.25)$ − F(−1.25) = $0.8944 - 0.1056$.",
    },
    {
      topic: "Normal",
      type: "num",
      q: "P(Z > −1.82)? (4 decimals)",
      answer: 0.9656,
      tol: 0.0005,
      why: "= $F(1.82)$ by symmetry.",
    },
    {
      topic: "Normal",
      type: "num",
      q: "Valves ~ $N(496, 25^2)$. $P(X \\ge 450)$? (4 decimals)",
      answer: 0.9671,
      tol: 0.0005,
      why: "z = −1.84 → $1 - 0.0329$.",
    },
    {
      topic: "Normal",
      q: "About what percentage of a normal distribution lies within $\\mu \\pm 2 \\sigma$?",
      options: ["68%", "90%", "95%", "99.7%"],
      answer: 2,
      why: "68–95–99.7 rule.",
      wrong: ["That's ±$1 \\sigma$.", "Not part of the rule.", null, "That's ±$3 \\sigma$."],
    },
    {
      topic: "Normal approximation",
      type: "num",
      q: "$n = 50$, $p = 0.31$. Using the continuity correction, the z-value for $P(X < 14)$ is? (2 decimals)",
      answer: -0.61,
      tol: 0.01,
      why: "$(13.5 - 15.5)/3.27$.",
    },
    {
      topic: "Normal approximation",
      type: "num",
      q: "Clouds: $n = 40$, $p = 0.62$, $P(X \\le 20)$ ≈ P(Z ≤ −1.40) = ? (4 decimals)",
      answer: 0.0808,
      tol: 0.0005,
      why: "$1 - F(1.40) = 1 - 0.9192$. (The slide's 0.808 is a slip.)",
    },
    {
      topic: "t, χ², F",
      q: "Compared with the standard normal, the t-distribution has…",
      options: ["Lighter tails", "Heavier tails", "Only positive values", "Two df parameters"],
      answer: 1,
      why: "Slide 65: heavier tails, tending to Z as df grows.",
      wrong: ["It's the other way round.", null, "That's $\\chi^2$ and F.", "That's F."],
    },
  ],
};
