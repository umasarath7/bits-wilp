// ISM — Lecture 7 (CS-7): Sampling, sampling distributions, CLT, estimation and confidence intervals
// Source: CourseFiles/ISM/Lec7.pdf (84 pages; slides numbered "of 90"). Every topic cites its slides.

export default {
  title: "Sampling, the Central Limit Theorem & Confidence Intervals",
  source: "Lec7.pdf (CS-7) · 84 pages",
  quizMode: "step",
  overview:
    "We almost never see a whole population: we see a **sample** and want to say something about the population. This lecture builds that bridge. First the vocabulary (population vs sample, **parameter** vs **statistic**) and the ways of drawing a sample (random, systematic, stratified, multistage; and non-probability methods). Then the key insight: a statistic such as $\\bar x$ changes from sample to sample, so it has its own **sampling distribution**. The **Central Limit Theorem** says that for large samples $(n \\ge 30)$ $\\bar x$ is approximately normal with mean $\\mu$ and standard error $\\sigma/\\sqrt{n}$, whatever the population's shape. That lets us compute probabilities about sample means and proportions (with a **finite population correction** when sampling a big slice of a small population), and turn things around into **confidence intervals**: estimate ± z × standard error.",

  simpleIntro: "We almost never get to measure a whole population; we measure a **sample** and make a careful guess about the population. This lecture explains why that guess works (the **Central Limit Theorem**), how much it wobbles (the **standard error**), and how to turn it into a range you can trust (a **confidence interval**). Every example below is the lecturer's own; the 📊 **Slides** tab has the full slide-by-slide notes.",

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
              "title": "Population vs sample",
              "text": "The **population** is everyone you care about; a **sample** is the few you actually measure. Population numbers (μ, σ, P) are **parameters**; sample numbers (x̄, s, p̂) are **statistics**.",
              "tag": "Who we measure",
              "example": "All voters in India (population) vs 2,000 polled (sample)."
            },
            {
              "title": "Sampling distribution",
              "text": "Take many samples and the sample mean **changes every time**. Those means form their own distribution, centred on μ and narrower than the population.",
              "tag": "Means wobble",
              "figure": "i7-means"
            },
            {
              "title": "Confidence interval",
              "text": "Instead of one guess, give a **range**: estimate ± margin of error. “We are 95% confident μ is between 500 and 520.”",
              "tag": "A range, not a point",
              "figure": "i7-ci"
            }
          ]
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "The one idea that ties it all together",
          "text": "A sample mean is an **estimate that wobbles**. The standard error $\\sigma/\\sqrt n$ measures how much it wobbles. Bigger samples wobble less."
        }
      ]
    },
    {
      "id": "s-pop",
      "heading": "2. Population, sample, parameter, statistic",
      "slides": "4–7",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Population",
            "Sample"
          ],
          "rows": [
            [
              "What it is",
              "Everyone of interest",
              "The ones we actually measure"
            ],
            [
              "Its numbers are called",
              "**Parameters** (fixed, usually unknown)",
              "**Statistics** (change from sample to sample)"
            ],
            [
              "Mean / SD / proportion",
              "$\\mu$, $\\sigma$, $P$",
              "$\\bar x$, $s$, $\\hat p$"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Memory trick: **P**opulation ↔ **P**arameter, **S**ample ↔ **S**tatistic. Greek letters for the population, Roman letters for the sample."
        }
      ]
    },
    {
      "id": "s-methods",
      "heading": "3. How to pick a sample",
      "slides": "8–17",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Method",
            "How",
            "Use when"
          ],
          "rows": [
            [
              "Simple random",
              "Every member has an equal chance",
              "The population is fairly uniform"
            ],
            [
              "Systematic",
              "Every $k$-th member, $k = N/n$",
              "You have an ordered list"
            ],
            [
              "Stratified",
              "Split into groups (strata), sample each **in proportion**",
              "Groups differ a lot"
            ],
            [
              "Cluster / multistage",
              "Pick whole groups, then sample inside them",
              "The population is spread out geographically"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: proportional allocation",
          "text": "Three strata of 2000, 6000 and 1000 people ($N = 9000$); total sample 1500. Each stratum gets $1500 \\times \\frac{\\text{its size}}{9000}$: **333**, **1000** and **167**."
        }
      ]
    },
    {
      "id": "s-clt",
      "heading": "4. The Central Limit Theorem (CLT)",
      "slides": "18–41",
      "blocks": [
        {
          "type": "p",
          "text": "Here is the most useful fact in this course. Take samples of size $n$ and compute each sample's mean. Then:"
        },
        {
          "type": "list",
          "items": [
            "The means are centred on the **true mean** $\\mu$.",
            "They are **less spread out** than individual values: their SD is $\\sigma/\\sqrt n$, called the **standard error (SE)**.",
            "For $n \\ge 30$ they follow a **normal (bell) curve**, **whatever shape the population has**. (If the population is already normal, any $n$ works.)"
          ]
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$\\bar x \\sim N\\left(\\mu,\\ \\frac{\\sigma^2}{n}\\right) \\qquad z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$$"
        },
        {
          "type": "diagram",
          "name": "i7-clt"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 34–36): vehicle ages",
          "text": "Vehicle ages have mean $\\mu = 96$ months and $\\sigma = 16$. For a random sample of $n = 36$ vehicles, what is the probability that the **sample mean** is between 90 and 100 months?\n\n**Step 1, standard error:** $SE = \\frac{16}{\\sqrt{36}} = 2.667$.\n**Step 2, z-scores:** $z_1 = \\frac{90 - 96}{2.667} = -2.25$, $z_2 = \\frac{100 - 96}{2.667} = 1.50$.\n**Step 3, table:** $P = F(1.50) - F(-2.25) = 0.9332 - 0.0122 = 0.9210$."
        },
        {
          "type": "answer",
          "value": "92.10%",
          "text": "The average age of 36 vehicles is very likely (92%) to be between 90 and 100 months."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "The #1 mistake",
          "text": "A question about **one** vehicle uses $\\sigma$; a question about the **mean of 36** vehicles uses $\\sigma/\\sqrt n$. For one vehicle, $P(X > 100)$ is about 40%; for the mean of 36, $P(\\bar x > 100)$ is only about 7%. Read the question carefully."
        },
        {
          "type": "check",
          "q": "Population SD is 21 and you take samples of 49. What is the standard error of the mean?",
          "options": [
            "21",
            "3",
            "0.43",
            "441"
          ],
          "answer": 1,
          "why": "$21/\\sqrt{49} = 21/7 = 3$ (lecturer's department-store example)."
        }
      ]
    },
    {
      "id": "s-fpc",
      "heading": "5. Small populations: the finite correction",
      "slides": "42–46",
      "blocks": [
        {
          "type": "p",
          "text": "If your sample is a **big slice** of a small population (more than 5%), the mean wobbles even less, so shrink the standard error with the **finite population correction**:"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$SE = \\frac{\\sigma}{\\sqrt n}\\sqrt{\\frac{N - n}{N - 1}} \\qquad \\text{use when } \\frac{n}{N} \\ge 0.05$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: 350 employees",
          "text": "$N = 350$, $\\mu = 37.6$, $\\sigma = 8.3$, $n = 45$ ($45/350 = 13\\% > 5\\%$). $SE = \\frac{8.3}{\\sqrt{45}}\\sqrt{\\frac{305}{349}} = 1.157$. $P(\\bar x < 40)$: $z = \\frac{40 - 37.6}{1.157} = 2.07$ → **0.9808**."
        }
      ]
    },
    {
      "id": "s-phat",
      "heading": "6. Proportions behave the same way",
      "slides": "47–52",
      "blocks": [
        {
          "type": "p",
          "text": "For yes/no data the sample statistic is the **proportion** $\\hat p = x/n$ (successes ÷ sample size). It also follows a bell curve when the sample is big enough ($nP > 15$ and $nQ > 15$):"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$z = \\frac{\\hat p - P}{\\sqrt{PQ/n}}, \\qquad Q = 1 - P$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 51–52): a new drug",
          "text": "60% of patients are cured ($P = 0.6$). In a sample of 120 patients, what is the probability that **at least half** are cured?\n\n$SE = \\sqrt{\\frac{0.6 \\times 0.4}{120}} = 0.0447$, $z = \\frac{0.5 - 0.6}{0.0447} = -2.24$, $P(Z > -2.24) = 1 - 0.0125 = 0.9875$."
        },
        {
          "type": "answer",
          "value": "98.75%",
          "text": "Almost certainly at least half of the 120 will be cured."
        }
      ]
    },
    {
      "id": "s-ci",
      "heading": "7. Confidence intervals for a mean",
      "slides": "53–69",
      "blocks": [
        {
          "type": "p",
          "text": "A single number (the point estimate $\\bar x$) is almost never exactly right. A **confidence interval** gives a range: **estimate ± margin of error**, where the margin = (a z-value) × (the standard error)."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$\\bar x \\pm z_{\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}$$"
        },
        {
          "type": "table",
          "head": [
            "Confidence",
            "90%",
            "95%",
            "98%",
            "99%"
          ],
          "rows": [
            [
              "$z_{\\alpha/2}$",
              "1.645",
              "1.96",
              "2.33",
              "2.58"
            ]
          ],
          "caption": "The four z-values to memorise"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 65–67): phone bills",
          "text": "A sample of $n = 85$ phone bills has mean $\\bar x = 510$ minutes; $\\sigma = 46$. Build a **95%** confidence interval for the true mean.\n\nMargin $= 1.96 \\times \\frac{46}{\\sqrt{85}} = 9.78$. Interval: $510 \\pm 9.78$."
        },
        {
          "type": "answer",
          "value": "500.22 to 519.78 minutes",
          "text": "We are **95% confident** that the population's average call time lies in this range."
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "How the interval changes",
          "text": "- **Higher confidence → wider** interval (99% uses 2.58: here ±12.87).\n- **Bigger sample → narrower** interval ($\\sqrt n$ is in the denominator).\n- Say “we are 95% confident the interval contains μ”, not “μ has a 95% chance”."
        },
        {
          "type": "diagram",
          "name": "i7-ci"
        },
        {
          "type": "check",
          "q": "Which change makes a confidence interval **narrower**?",
          "options": [
            "Raising confidence from 95% to 99%",
            "Increasing the sample size",
            "A larger σ",
            "Using z = 2.58"
          ],
          "answer": 1,
          "why": "A bigger $n$ shrinks $\\sigma/\\sqrt n$. The other three all make it wider."
        }
      ]
    },
    {
      "id": "s-cip",
      "heading": "8. Confidence intervals for a proportion",
      "slides": "70–76",
      "blocks": [
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$\\hat p \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat p\\,(1 - \\hat p)}{n}}$$"
        },
        {
          "type": "p",
          "text": "Note: the interval uses the **sample** proportion $\\hat p$ inside the square root (we don't know the true P; that's what we're estimating)."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: telemarketing",
          "text": "In a sample of 87 calls, 39% led to a sale. 95% CI: $0.39 \\pm 1.96\\sqrt{\\frac{0.39 \\times 0.61}{87}} = 0.39 \\pm 0.10$."
        },
        {
          "type": "answer",
          "value": "29% to 49%",
          "text": "We are 95% confident the true success rate is between 29% and 49%."
        }
      ]
    },
    {
      "id": "s-compare",
      "heading": "9. Quick comparison table",
      "slides": "",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Question about…",
            "Standard error",
            "z (or interval)"
          ],
          "rows": [
            [
              "one value $X$",
              "$\\sigma$",
              "$z = \\frac{X - \\mu}{\\sigma}$"
            ],
            [
              "a sample **mean** $\\bar x$",
              "$\\frac{\\sigma}{\\sqrt n}$",
              "$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$"
            ],
            [
              "a mean, small population ($n/N \\ge 5\\%$)",
              "$\\frac{\\sigma}{\\sqrt n}\\sqrt{\\frac{N - n}{N - 1}}$",
              "same, with the corrected SE"
            ],
            [
              "a sample **proportion** $\\hat p$",
              "$\\sqrt{PQ/n}$",
              "$z = \\frac{\\hat p - P}{\\sqrt{PQ/n}}$"
            ],
            [
              "CI for $\\mu$",
              "$\\frac{\\sigma}{\\sqrt n}$",
              "$\\bar x \\pm z\\frac{\\sigma}{\\sqrt n}$"
            ],
            [
              "CI for $P$",
              "$\\sqrt{\\hat p\\hat q/n}$",
              "$\\hat p \\pm z\\sqrt{\\hat p\\hat q/n}$"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-test",
      "heading": "10. Test your understanding",
      "slides": "",
      "blocks": [
        {
          "type": "check",
          "q": "The CLT says that for $n \\ge 30$ the sample mean is approximately normal…",
          "options": [
            "only if the population is normal",
            "whatever the population's shape",
            "only for proportions",
            "only if σ is known"
          ],
          "answer": 1,
          "why": "That's the power of the CLT: the population can be skewed; the sample mean still becomes bell-shaped."
        },
        {
          "type": "check",
          "q": "$\\mu = 448$, $\\sigma = 21$, $n = 49$. The z-score for $\\bar x = 441$ is…",
          "options": [
            "−0.33",
            "−2.33",
            "−7",
            "−1.00"
          ],
          "answer": 1,
          "why": "$SE = 21/7 = 3$; $z = (441 - 448)/3 = -2.33$."
        },
        {
          "type": "check",
          "q": "For a 90% confidence interval, which z do you use?",
          "options": [
            "1.645",
            "1.96",
            "2.33",
            "2.58"
          ],
          "answer": 0,
          "why": "90% → 1.645; 95% → 1.96; 98% → 2.33; 99% → 2.58."
        },
        {
          "type": "check",
          "q": "A sample is 60 people from a company of 500. Should you use the finite population correction?",
          "options": [
            "No, n is above 30",
            "Yes, n/N = 12% ≥ 5%",
            "Only for proportions",
            "Never for means"
          ],
          "answer": 1,
          "why": "The rule is about the **fraction** sampled: $60/500 = 0.12 \\ge 0.05$."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "11. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Parameter** = population (μ, σ, P); **statistic** = sample ($\\bar x$, s, $\\hat p$).\n- **CLT:** $\\bar x \\sim N(\\mu, \\sigma^2/n)$ for $n \\ge 30$; $SE = \\sigma/\\sqrt n$.\n- **Mean of a sample?** Divide σ by $\\sqrt n$. **One value?** Don't.\n- **Small population** ($n/N \\ge 5\\%$): multiply SE by $\\sqrt{(N - n)/(N - 1)}$.\n- **Proportion:** $z = (\\hat p - P)/\\sqrt{PQ/n}$.\n- **CI = estimate ± z × SE**; z = 1.645 / 1.96 / 2.33 / 2.58 for 90 / 95 / 98 / 99%."
        },
        {
          "type": "p",
          "text": "Then go to ✍️ **Solved Questions** and practise the lecturer's problems."
        }
      ]
    }
  ],

  summary: [
    {
      id: "terms",
      heading: "Lesson 1: Population, sample, parameter, statistic",
      slides: "4–7, 53–55",
      blocks: [
        {
          type: "table",
          head: ["Term", "Meaning (slides 4–7)", "Example"],
          rows: [
            ["**Population**", "All elements of interest for a specific aim; surveying all of them is a **census**", "All voters in India"],
            ["**Sample**", "A subset of the population; surveying it is a **sample survey**", "2000 voters polled"],
            ["**Parameter**", "A population constant, usually unknown: $\\mu$, $\\sigma^2$, P, $\\rho$", "True % supporting a policy"],
            ["**Statistic (estimator)**", "A function of the sample observations, used to estimate a parameter: $\\bar x$, $S^2$, $\\hat p$, r. Its numerical value is the **estimate**", "% supporting it in the poll"],
            ["**Sampling distribution**", "The distribution of a statistic over repeated random samples", "How the poll % would vary"],
          ],
        },
        {
          type: "p",
          text: "**Inferential statistics (slide 5)** uses sample data to estimate and test hypotheses about population characteristics, while minimising resources: money, manpower, material and time (**3MT**). Distributions also have parameters: Binomial (n, p), Poisson $(\\lambda)$, Normal $(\\mu, \\sigma^2)$ (slide 6). Three forms of inference (slide 53): **point estimation, interval estimation, hypothesis testing** (Lecture 9).",
        },
        {
          type: "table",
          caption: "Parameter vs its estimator (slide 55)",
          head: ["Measure", "Population parameter", "Sample estimate"],
          rows: [["Mean", "$\\mu$", "$\\bar x$"], ["Variance", "$\\sigma^2$", "$S^2$"], ["Proportion", "P", "p"], ["Correlation", "$\\rho$", "r"]],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Parameter = population, Greek, fixed but unknown. Statistic = sample, Roman, varies from sample to sample.",
        },
      ],
    },
    {
      id: "methods",
      heading: "Lesson 2: How should we choose the sample? Sampling methods",
      slides: "8–17",
      blocks: [
        {
          type: "p",
          text: "**Why sample at all? (slides 9–10)** The population may be unknown or infinite; even when finite, a census may need huge resources. A sample **saves money**, **saves time**, and for given resources **broadens the scope** of the study. And because observed data = truth + bias + random error (slide 11), a well-chosen **representative** sample lets us generalise reliably.",
        },
        {
          type: "table",
          caption: "Methods of selecting a sample (slides 11–16)",
          head: ["Method", "Population", "How"],
          rows: [
            ["**Simple random**", "Homogeneous, finite", "Units selected one by one with **equal probability**"],
            ["**Systematic random**", "Finite with a sampling frame in some order (alphabetical, date of birth, Aadhaar, phone number)", "First unit at random, then every k-th unit, **k = N/n**"],
            ["**Stratified random**", "Heterogeneous", "Split into homogeneous **strata**; simple random sample in each, **proportional to stratum size**; combine by weighted average"],
            ["**Multistage random**", "Heterogeneous, spread over a wide area in clusters (country → state → district)", "Select clusters at successive stages"],
            ["Purposive / judgement", "–", "Units judged able to serve a specific purpose"],
            ["Convenience", "–", "Whatever is convenient to the investigator"],
            ["Quota", "Heterogeneous", "Strata as in stratified, but quotas filled at the investigator's convenience"],
            ["Snowball (chain link)", "Heterogeneous", "Already-selected units recommend the next ones"],
          ],
        },
        {
          type: "p",
          text: "The first four are **probability sampling** (every unit has a known chance of selection); the last four are **non-probability sampling** (no specific probability structure).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: proportional allocation (slide 14)",
          text: "Three strata of sizes 2000, 6000 and 1000 $(N = 9000)$; total sample $n = 1500$. Each stratum gets n × (stratum size)/N: $1500 \\times \\frac{2000}{9000} = 333$, $1500 \\times \\frac{6000}{9000} = 1000$, $1500 \\times \\frac{1000}{9000} = 167$.",
        },
        {
          type: "p",
          text: "**Sampling error (slide 17)** occurs when the sample is not representative of the population (not selected on a probability basis, improper techniques). Sampling error is proportional to **sampling variation**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Homogeneous → simple random. Ordered list → systematic $(k = N/n)$. Heterogeneous → stratified (proportional allocation). Spread-out clusters → multistage.",
        },
      ],
    },
    {
      id: "variation",
      heading: "Lesson 3: Statistics vary: sampling variation and the sampling distribution of x̄",
      slides: "18–31",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Why a sample mean is itself a random variable, and what its distribution looks like.",
        },
        {
          type: "p",
          text: "**Sampling variation (slides 18–22).** From a population of 100 employees' wages, ten samples of sizes 8–12 give means ranging from **1338** to **3035** (overall population mean 2162.24) and SDs from 117 to 989. The estimates vary from one sample to another, forming a random variable. **Sampling variability decreases as the sample size increases**; samples must be random and of an optimum size.",
        },
        {
          type: "p",
          text: "**Definition (slide 24):** the probability distribution of a statistic is its **sampling distribution**. It depends on the population's distribution, the sample size and the method of selection. The distribution of sample means is the **sampling distribution of the mean**; of sample variances, the **sampling distribution of the variance** (slide 23).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: N = 8 population (slides 26–29)",
          text: "Population: 54, 55, 59, 63, 64, 68, 69, 70 $(\\mu = 62.75)$. Take **all** $8 \\times 8 = 64$ samples of size $n = 2$ **with replacement** and average each pair: (54, 54) → 54, (54, 55) → 54.5, …, (70, 70) → 70.\n\nThe population histogram is flat-ish, but the 64 means **pile up in the middle and tail off** toward 54 and 70. Their mean is still 62.75, and their SD (4.12) equals $\\sigma/\\sqrt{2} = 5.83/1.414$.",
        },
        { type: "diagram", name: "i7-means" },
        {
          type: "p",
          text: "**Slides 30–31** repeat the experiment with a uniform population (and exponential, U-shaped and normal ones) and sample sizes 2, 5, 10, 20, 30: as n grows, the histograms of sample means become **bell-shaped**, whatever the population's shape, and their spread shrinks.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Sample means vary → they have a distribution. Centre = $\\mu$; spread shrinks as n grows; shape becomes normal.",
        },
      ],
    },
    {
      id: "clt",
      heading: "Lesson 4: The Central Limit Theorem and z for sample means",
      slides: "32–41",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Central Limit Theorem (slides 32–33)",
          text: "If samples of size n are drawn randomly from a population with mean $\\mu$ and $\\text{SD} \\sigma$, the sample means $\\bar x$ are approximately normally distributed for **sufficiently large n $(n \\ge 30)$, regardless of the population's shape**. If the population is normal, $\\bar x$ is normal for **any** n.\n$$\\mu_{\\bar x} = \\mu, \\qquad \\sigma_{\\bar x} = \\frac{\\sigma}{\\sqrt n} \\quad \\text{(standard error of the mean)}$$\n$$Z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$$",
        },
        { type: "diagram", name: "i7-clt" },
        {
          type: "p",
          text: "**Why does this matter?** We can now answer questions about **averages** with the normal table, even when individual values aren't normal. The only change from Lecture 6 is that we divide by **σ/$\\sqrt{n}$** instead of $\\sigma$: averages are less variable than individuals.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: vehicle ages (slides 34–36)",
          text: "$\\mu = 96$ months, $\\sigma = 16$, $n = 36$ (≥ 30, so CLT applies). $\\text{SE} = 16/\\sqrt{36} = 2.667$.\n\n$z_1 = \\frac{90 - 96}{2.667} = -2.25$, $z_2 = \\frac{100 - 96}{2.667} = 1.50$.\n\n$P(90 < \\bar x < 100) = 0.9332 - 0.0122 = 0.9210$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: department store (slides 40–41)",
          text: "$\\mu = 448$ shoppers/hour, $\\sigma = 21$, $n = 49$ hours: SE = 21/7 = 3.\n\n$z_1 = \\frac{441 - 448}{3} = -2.33$, $z_2 = \\frac{446 - 448}{3} = -0.67$.\n\n$P(-2.33 < z < -0.67) = P(0.67 < z < 2.33) = F(2.33) - F(0.67) = 0.9901 - 0.7485 = 0.2416$.",
        },
        {
          type: "p",
          text: "**Tire store (slides 37–39):** $\\mu = 85$ dollars, $\\sigma = 9$ dollars, $n = 40$. $z = \\frac{87 - 85}{9/\\sqrt{40}} = \\frac{2}{1.42} = 1.41$, so $P(\\bar x \\ge 87) = 1 - 0.9207 = 0.0793$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Using $\\sigma$ instead of $\\sigma/\\sqrt{n}$ for a question about a **mean**.\n- Applying the CLT to a non-normal population with $n < 30$.\n- Confusing “an individual vehicle” (use $\\sigma$) with “the mean of 36 vehicles” (use $\\sigma/\\sqrt{n}$).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$\\bar{x}$ ~ $N(\\mu, \\sigma^2/n)$ for $n \\ge 30$ (or any n if the population is normal). $z = (\\bar{x} - \\mu)/(\\sigma/\\sqrt{n})$.",
        },
      ],
    },
    {
      id: "fpc",
      heading: "Lesson 5: Sampling a big slice of a small population: finite correction",
      slides: "42–46",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Finite population correction (slides 42–43)",
          text: "$$z = \\frac{\\bar x - \\mu}{\\frac{\\sigma}{\\sqrt n}\\sqrt{\\frac{N - n}{N - 1}}}$$\nThe factor $\\sqrt{\\frac{N-n}{N-1}}$ shrinks the standard error when the sample is a sizeable part of the population. **Rule of thumb:** if $n/N < 0.05$ it makes little difference and can be ignored; as N grows relative to n it approaches 1.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: 350 employees (slides 44–46)",
          text: "$N = 350$, $\\mu = 37.6$ years, $\\sigma = 8.3$, $n = 45$ ($n/N = 0.13 > 0.05$, so correct). P($\\bar x$ < 40)?\n\n$$z = \\frac{40 - 37.6}{\\frac{8.3}{\\sqrt{45}}\\sqrt{\\frac{350 - 45}{350 - 1}}} = \\frac{2.4}{1.157} = 2.07$$\nArea between 0 and 2.07 = 0.4808, so $P = 0.4808 + 0.5000$ = **0.9808**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$n/N \\ge 0.05$ → multiply SE by $\\sqrt{(N - n)/(N - 1)}$.",
        },
      ],
    },
    {
      id: "proportion",
      heading: "Lesson 6: Counting characteristics: the sampling distribution of p̂",
      slides: "47–52",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Sample proportion (slides 47–50)",
          text: "$$\\hat p = \\frac{x}{n}$$\nx = number of items in the sample with the characteristic, n = sample size. If **np > 15 and nq > 15**, $\\hat p$ is approximately normal with mean P and standard error $\\sqrt{\\frac{PQ}{n}}$ (standard error of the proportion):\n$$Z = \\frac{\\hat p - P}{\\sqrt{\\frac{PQ}{n}}}, \\qquad Q = 1 - P$$",
        },
        {
          type: "p",
          text: "**Example (slide 48):** 30 of 100 factory workers belong to a union, so $\\hat p = 0.30$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: a new drug (slides 51–52)",
          text: "60% of patients are cured $(P = 0.6)$. In a sample of 120, P($\\hat p$ ≥ 0.5)?\n\n$SE = \\sqrt{\\frac{0.6 \\times 0.4}{120}} = 0.0447$, $z = \\frac{0.5 - 0.6}{0.0447} = -2.24$.\n\n$P(Z > -2.24) = 1 - 0.0125 = 0.9875$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): the drug example",
          text: "Slide 52 writes the denominator as $\\sqrt{0.5 \\times 0.5/120}$ (which would give z = −2.19) and later “z > −2.14”. The SE must use the **population** proportion $P = 0.6$, $\\sqrt{0.6 \\times 0.4/120}$, which gives the slide's **z = −2.24** and **0.9875**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$\\hat{p} = x/n$. SE = √(PQ/n) using the population P. Check nP, nQ > 15.",
        },
      ],
    },
    {
      id: "ci",
      heading: "Lesson 7: From a single guess to a range: point estimates and confidence intervals",
      slides: "53–69, 79–82",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Why a single number (point estimate) isn't enough, and how to build an interval that contains the parameter with a stated confidence.",
        },
        {
          type: "p",
          text: "**Point estimate (slide 54):** a statistic used to estimate a parameter, e.g. $\\bar x$ for $\\mu$. It's only as good as the sample's representativeness and varies between samples. **Interval estimate (slides 56–57):** using the point estimate, compute lower and upper bounds that cover the unknown parameter with a stated level of confidence: the **confidence interval**, the most powerful form of estimation.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Confidence interval for μ (slides 58–62)",
          text: "$$\\text{Sample estimate} \\pm Z_{\\alpha/2}\\,SE(\\text{estimate}) \\quad\\Rightarrow\\quad \\bar x \\pm Z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n}$$\n$\\alpha$ = probability of a Type I error; confidence level = $100 (1 - \\alpha)$%. $Z_{\\alpha/2}$ satisfies $F(Z_{\\alpha/2}) = 1 - \\alpha/2$.\n\n| Confidence | $\\alpha$ | $\\alpha/2$ | $Z_{\\alpha/2}$ |\n|---|---|---|---|\n| 90% | 0.10 | 0.05 | 1.645 |\n| 95% | 0.05 | 0.025 | 1.96 |\n| 98% | 0.02 | 0.01 | 2.33 |\n| 99% | 0.01 | 0.005 | 2.58 |\n\n(Finite population: multiply the SE by $\\sqrt{(N-n)/(N-1)}$.)",
        },
        { type: "diagram", name: "i7-ci" },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: cellular phone minutes (slides 65–67)",
          text: "$n = 85$ bills, $\\bar x$ = 510 minutes, $\\sigma = 46$, 95% confidence.\n\n$510 \\pm 1.96\\frac{46}{\\sqrt{85}} = 510 \\pm 9.78 \\Rightarrow 500.22 \\le \\mu \\le 519.78$.\n\nInterpretation: the researcher is **95% confident** that the population average call length is between 500.22 and 519.78 minutes. Point estimate 510; error of estimate 9.78.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: 800 engineers, 98% CI with correction (slides 68–69)",
          text: "$N = 800$, $n = 50$ (> 5% of N), $\\bar x$ = 34.3, $\\sigma = 8$, $z = 2.33$.\n\n$34.30 \\pm 2.33\\frac{8}{\\sqrt{50}}\\sqrt{\\frac{750}{799}} = 34.30 \\pm 2.55 \\Rightarrow 31.75 \\le \\mu \\le 36.85$.\n\n(The slide's formula line writes “$\\bar x - z…$” on both sides; the upper limit is $\\bar x + z…$, as its numbers show.)",
        },
        {
          type: "p",
          text: "**Exercise (slides 81–82): years trading with India.** $n = 44$, $\\bar x$ = 10.455, $\\sigma = 7.7$, 90% → $z = 1.645$ (area 0.45 between 0 and z): $10.455 \\pm 1.645\\frac{7.7}{\\sqrt{44}} = 10.455 \\pm 1.910 \\Rightarrow 8.545 \\le \\mu \\le 12.365$.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Difference of two means (slides 63–64)",
          text: "$$(\\bar X_1 - \\bar X_2) \\pm Z_{\\alpha/2}\\,SE(\\bar X_1 - \\bar X_2)$$\nAs stated on slide 64: when $n_1 = n_2$, $SE = \\sqrt{\\frac{S_1^2}{n_1} + \\frac{S_2^2}{n_2}}$; when $n_1 \\ne n_2$, $SE = s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ with pooled SD $s_p = \\sqrt{\\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}}$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Using $z = 1.96$ for every confidence level. Look up $Z_{\\alpha/2}$.\n- Forgetting $\\sqrt{n}$ in the SE.\n- Saying “$\\mu$ has a 95% probability of being in this interval”. Say “we are 95% confident the interval contains $\\mu$”.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "CI = estimate ± $z \\times \\text{SE}$. Mean: $\\bar{x} \\pm z \\sigma/\\sqrt{n}$. z: 1.645 / 1.96 / 2.33 / 2.58 for 90 / 95 / 98 / 99%. Wider confidence → wider interval; bigger n → narrower.",
        },
      ],
    },
    {
      id: "ciprop",
      heading: "Lesson 8: Confidence intervals for proportions",
      slides: "70–76, 83–84",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "CI for P and for P₁ − P₂ (slides 70–72)",
          text: "$$\\hat p \\pm Z_{\\alpha/2}\\sqrt{\\frac{\\hat p\\hat q}{n}}, \\qquad \\hat q = 1 - \\hat p$$\n$$(p_1 - p_2) \\pm Z_{\\alpha/2}\\,SE(p_1 - p_2)$$\nAs stated on slide 72: when $n_1 = n_2$, $SE = \\sqrt{\\frac{p_1q_1}{n_1} + \\frac{p_2q_2}{n_2}}$; when $n_1 \\ne n_2$, $SE = \\sqrt{pq\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}$ with pooled $p = \\frac{n_1p_1 + n_2p_2}{n_1 + n_2}$, $q = 1 - p$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: telemarketing (slides 73–74)",
          text: "$n = 87$, $\\hat p$ = 0.39, 95%: $0.39 \\pm 1.96\\sqrt{\\frac{0.39 \\times 0.61}{87}} = 0.39 \\pm 0.10 \\Rightarrow 0.29 \\le p \\le 0.49$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: 92% confidence (slides 75–76)",
          text: "Coopers & Lybrand: $n = 210$ CEOs, $\\hat p$ = 0.51. For 92%, $\\alpha = 0.08$, $\\alpha/2 = 0.04$ → $z_{0.04} = 1.75$.\n\n$0.51 \\pm 1.75\\sqrt{\\frac{0.51 \\times 0.49}{210}} = 0.51 \\pm 0.06 \\Rightarrow 0.45 \\le p \\le 0.57$.",
        },
        {
          type: "p",
          text: "**Exercise (slides 83–84): boot-cut jeans.** 34 of 212 sales → $\\hat p$ = 0.16; 90% ($z = 1.645$; the slide writes 1.646): $0.16 \\pm 1.645\\sqrt{\\frac{0.16 \\times 0.84}{212}} = 0.16 \\pm 0.04 \\Rightarrow 0.12 \\le p \\le 0.20$.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Proportion CI uses the **sample** $\\hat{p}$ in the SE (we don't know P). Testing (Lec 6 / Lec 9) uses the hypothesised P.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Lec7 on one screen",
      head: ["Need", "Formula"],
      rows: [
        ["P(about $\\bar{x}$)", "$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$ ($n \\ge 30$ or normal population)"],
        ["Finite population, $n/N \\ge 5\\%$", "SE × $\\sqrt{(N-n)/(N-1)}$"],
        ["P(about $\\hat{p}$)", "$z = \\frac{\\hat p - P}{\\sqrt{PQ/n}}$ (nP, nQ > 15)"],
        ["CI for $\\mu$", "$\\bar x \\pm z_{\\alpha/2}\\sigma/\\sqrt n$"],
        ["CI for P", "$\\hat p \\pm z_{\\alpha/2}\\sqrt{\\hat p\\hat q/n}$"],
        ["z values", "90%: 1.645 · 95%: 1.96 · 98%: 2.33 · 99%: 2.58"],
      ],
    },
    { type: "diagram", name: "i7-clt" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "State “$n \\ge 30$, so by CLT…” · $\\sigma/\\sqrt{n}$ not $\\sigma$ · check n/N for the correction · interpret the CI in words.",
    },
  ],

  glossary: [
    ["Census", "", "Collecting data from the entire population"],
    ["Parameter", "", "Population constant $(\\mu, \\sigma^2, P, \\rho)$, usually unknown"],
    ["Statistic / estimator", "", "Function of the sample $(\\bar{x}, S^2, \\hat{p})$ used to estimate a parameter"],
    ["Sampling distribution", "", "Distribution of a statistic over repeated samples"],
    ["SE", "Standard error", "SD of a statistic's sampling distribution, e.g. $\\sigma/\\sqrt{n}$"],
    ["CLT", "Central Limit Theorem", "$\\bar{x}$ is approximately normal for large n, whatever the population's shape"],
    ["FPC", "Finite population correction", "$\\sqrt{(N - n)/(N - 1)}$ multiplier for the SE"],
    ["$\\hat{p}$", "Sample proportion", "x/n"],
    ["CI", "Confidence interval", "Estimate ± z_{$\\alpha/2$} × SE"],
    ["$\\alpha$", "Level of significance", "1 − confidence level; probability of a Type I error"],
    ["3MT", "Money, Manpower, Material, Time", "Resources saved by sampling"],
    ["Stratified sampling", "", "Random sampling within homogeneous strata, allocated in proportion to size"],
  ],

  examTips: [
    "Write “By CLT, $\\bar{x}$ ~ $N(\\mu, \\sigma^2/n)$” before computing. It shows you know why you're using z.",
    "For finite populations, compute n/N first and say whether the correction is needed.",
    "Always finish a CI question with an interpretation sentence.",
    "Memorise the z-values for 90/95/98/99%. The table lookup costs time.",
  ],

  problems: [
    {
      title: "Stratified allocation (slide 14)",
      level: "From slides",
      question: "Three strata have sizes 2000, 6000, 1000. Allocate a sample of 1500 proportionally.",
      solution: "$1500 \\times 2000/9000$ = **333**, $1500 \\times 6000/9000$ = **1000**, $1500 \\times 1000/9000$ = **167**.",
    },
    {
      title: "Sampling distribution with N = 8 (slides 26–29)",
      level: "From slides",
      hint: "There are 64 equally likely samples of size 2 (with replacement).",
      question: "Population: 54, 55, 59, 63, 64, 68, 69, 70. For all samples of size 2 with replacement, find the mean and SD of the sample means and compare them with $\\mu$ and $\\sigma$.",
      solution: "*Calculation prepared for the website (the slides show the histogram).*\n$\\mu = 502/8$ = **62.75**; $\\sigma = \\sqrt{33.94}$ = **5.83**.\nThe 64 sample means average **62.75** (= $\\mu$) with SD **4.12** = $\\sigma/\\sqrt{2} = 5.83/1.414$. The means range from 54 to 70 and pile up in the centre.",
    },
    {
      title: "Vehicle ages (slides 34–36)",
      level: "From slides",
      question: "$\\mu = 96$ months, $\\sigma = 16$, $n = 36$. $P(90 < \\bar{x} < 100)$?",
      solution: "SE = 16/6 = 2.667. z = −2.25 and 1.50 → $0.9332 - 0.0122$ = **0.9210**.",
    },
    {
      title: "Tire store (slides 37–39)",
      level: "From slides",
      question: "$\\mu = 85$ dollars, $\\sigma = 9$ dollars, $n = 40$. P($\\bar{x} \\ge 87$ dollars)?",
      solution: "$\\text{SE} = 9/\\sqrt{40} = 1.42$; $z = 2/1.42 = 1.41$ → $1 - 0.9207$ = **0.0793**.",
    },
    {
      title: "Department store shoppers (slides 40–41)",
      level: "From slides",
      question: "$\\mu = 448$, $\\sigma = 21$, $n = 49$. $P(441 \\le \\bar{x} \\le 446)$?",
      solution: "SE = 3; z = −2.33 and −0.67 → $F(2.33) - F(0.67) = 0.9901 - 0.7485$ = **0.2416**.",
    },
    {
      title: "350 hourly employees (slides 44–46)",
      level: "From slides",
      question: "$N = 350$, $\\mu = 37.6$, $\\sigma = 8.3$, $n = 45$. $P(\\bar{x} < 40)$?",
      solution: "$n/N = 0.13$ → use the correction. $\\text{SE} = (8.3/\\sqrt{45}) \\sqrt{305/349} = 1.157$; $z = 2.4/1.157 = 2.07$ → **0.9808**.",
    },
    {
      title: "Cancer drug (slides 51–52)",
      level: "From slides",
      question: "60% are cured. For $n = 120$, $P(\\hat{p} \\ge 0.50)$?",
      solution: "$\\text{SE} = \\sqrt{0.6 \\times 0.4/120} = 0.0447$; z = −0.1/0.0447 = −2.24 → $1 - 0.0125$ = **0.9875**. (The slide's displayed $\\sqrt{0.5 \\times 0.5/120}$ is a typo; its z = −2.24 comes from $P = 0.6$.)",
    },
    {
      title: "CI: cellular minutes (slides 65–67)",
      level: "From slides",
      question: "$n = 85$, $\\bar{x} = 510$, $\\sigma = 46$. 95% CI for $\\mu$?",
      solution: "$510 \\pm 1.96 (46/\\sqrt{85}) = 510 \\pm 9.78$ → **(500.22, 519.78)** minutes.",
    },
    {
      title: "CI: 800 engineers (slides 68–69)",
      level: "From slides",
      question: "$N = 800$, $n = 50$, $\\bar{x} = 34.3$, $\\sigma = 8$. 98% CI for $\\mu$?",
      solution: "$z = 2.33$; $\\text{SE} = (8/\\sqrt{50}) \\sqrt{750/799} = 1.096$ → $34.3 \\pm 2.55$ → **(31.75, 36.85)** years.",
    },
    {
      title: "CI: telemarketing proportion (slides 73–74)",
      level: "From slides",
      question: "$n = 87$, $\\hat{p} = 0.39$. 95% CI for p?",
      solution: "$0.39 \\pm 1.96 \\sqrt{0.39 \\times 0.61/87} = 0.39 \\pm 0.10$ → **(0.29, 0.49)**.",
    },
    {
      title: "CI: succession plans, 92% (slides 75–76)",
      level: "From slides",
      question: "$n = 210$, $\\hat{p} = 0.51$. 92% CI for p?",
      solution: "$z_0$.₀₄ = 1.75: $0.51 \\pm 1.75 \\sqrt{0.51 \\times 0.49/210} = 0.51 \\pm 0.06$ → **(0.45, 0.57)**.",
    },
    {
      title: "Homework: car mufflers (slide 77)",
      level: "From slides",
      question: "Run time ~ $N(1.82, 1.20^2)$ hours. P(mean of 40 runs is between 1.65 and 2.04)?",
      solution: "*Exercise solution prepared for the website.*\n$\\text{SE} = 1.20/\\sqrt{40} = 0.1897$. $z_1 = (1.65 - 1.82)/0.1897$ = −0.90; $z_2 = (2.04 - 1.82)/0.1897 = 1.16$.\n$P = F(1.16)$ − F(−0.90) = $0.8770 - 0.1841$ = **0.693**.",
    },
    {
      title: "Homework: engine bearings (slide 78)",
      level: "From slides",
      hint: "Compute both z-values before reading the table: are they on the same side of the mean?",
      question: "Insufficient lubrication has mean 0.6520 ml and SD 0.0125 ml. For $n = 60$, $P(0.600 < \\bar{x} < 0.640)$?",
      solution: "*Exercise solution prepared for the website.*\n$\\text{SE} = 0.0125/\\sqrt{60} = 0.00161$. $z(0.640)$ = −0.012/0.00161 = −7.44; $z(0.600)$ = −32.2.\nBoth limits are far below the mean, so P = F(−7.44) − F(−32.2) **≈ 0** (well under 0.0001). A sample mean that low is practically impossible.",
    },
    {
      title: "Homework: CI with n = 100, σ = 5.1 (slide 79)",
      level: "From slides",
      question: "$n = 100$, $\\sigma = 5.1$, $\\bar{x} = 2.16$. 95% CI for $\\mu$?",
      solution: "*Exercise solution prepared for the website.*\n$2.16 \\pm 1.96 (5.1/10) = 2.16 \\pm 1.00$ → **(1.16, 3.16)**.",
    },
    {
      title: "Homework: nanopillars, 99% CI (slide 80)",
      level: "From slides",
      question: "$n = 50$, $\\bar{x} = 305.58$ nm, $s^2 = 1366.86$ $(s = 36.97)$. 99% CI for the population mean.",
      solution: "*Exercise solution prepared for the website.*\nLarge n → use $z = 2.58$ with s for $\\sigma$: $305.58 \\pm 2.58 (36.97/\\sqrt{50}) = 305.58 \\pm 13.49$ → **(292.09, 319.07)** nm.\n⚠️ Data check: the 50 values printed on the slide actually give $\\bar{x} = 311.14$ and $s = 38.28$ (CI $311.14 \\pm 13.97$). The stated summary (305.58, 36.97) doesn't match the listed data; we used the stated summary, as the question instructs.",
    },
    {
      title: "Exercise: trading with India, 90% CI (slides 81–82)",
      level: "From slides",
      question: "$n = 44$, $\\bar{x} = 10.455$ years, $\\sigma = 7.7$. 90% CI for $\\mu$.",
      solution: "$z = 1.645$: $10.455 \\pm 1.645 (7.7/\\sqrt{44}) = 10.455 \\pm 1.910$ → **(8.545, 12.365)** years.",
    },
    {
      title: "Exercise: boot-cut jeans, 90% CI (slides 83–84)",
      level: "From slides",
      question: "34 of 212 sales were boot-cut. 90% CI for the proportion.",
      solution: "$\\hat{p} = 0.16$; $0.16 \\pm 1.645 \\sqrt{0.16 \\times 0.84/212} = 0.16 \\pm 0.04$ → **(0.12, 0.20)**.",
    },
    {
      title: "Level 1: standard error",
      level: "Level 1",
      question: "$\\sigma = 12$ and $n = 36$. What is the standard error of the mean?",
      solution: "$12/\\sqrt{36}$ = **2**.",
    },
    {
      title: "Level 1: proportional allocation",
      level: "Level 1",
      question: "Strata of 3000, 5000 and 2000 people; total sample 500. Allocate proportionally.",
      solution: "$500 \\times 0.3$ = **150**, $500 \\times 0.5$ = **250**, $500 \\times 0.2$ = **100**.",
    },
    {
      title: "Level 1: which z?",
      level: "Level 1",
      question: "What is z_{$\\alpha/2$} for a 90% and for a 99% confidence interval?",
      solution: "90%: $\\alpha/2 = 0.05$ → **1.645**. 99%: $\\alpha/2 = 0.005$ → **2.58**.",
    },
    {
      title: "Level 2: probability for a mean",
      level: "Level 2",
      question: "$\\mu = 50$, $\\sigma = 10$, $n = 25$ (normal population). $P(\\bar{x} > 53)$?",
      solution: "SE = 2; $z = 1.5$ → $1 - 0.9332$ = **0.0668**.",
    },
    {
      title: "Level 2: CI for a mean",
      level: "Level 2",
      question: "$n = 64$ delivery times, $\\bar{x} = 72$ minutes, $\\sigma = 8$. 95% CI for $\\mu$.",
      solution: "$72 \\pm 1.96 (8/8) = 72 \\pm 1.96$ → **(70.04, 73.96)** minutes.",
    },
    {
      title: "Level 2: CI for a proportion",
      level: "Level 2",
      question: "120 of 400 surveyed UPI users had a failed transaction last month. 95% CI for the proportion.",
      solution: "$\\hat{p} = 0.30$; $\\text{SE} = \\sqrt{0.3 \\times 0.7/400} = 0.0229$ → $0.30 \\pm 0.045$ → **(0.255, 0.345)**.",
    },
    {
      title: "Level 3: CI with finite correction",
      level: "Level 3",
      question: "$N = 500$ accounts, $n = 100$ sampled, $\\bar{x}$ = ₹150, $\\sigma$ = ₹20. 95% CI for $\\mu$.",
      solution: "$n/N = 0.2$ → correct. $\\text{SE} = (20/10) \\sqrt{400/499} = 1.791$ → $150 \\pm 1.96 (1.791) = 150 \\pm 3.51$ → **(146.49, 153.51)**.",
    },
    {
      title: "Level 3: difference of two means",
      level: "Level 3",
      question: "Two training methods, $n_1 = n_2 = 50$: $\\bar{x}_1 = 82$, $s_1 = 10$; $\\bar{x}_2 = 78$, $s_2 = 12$. 95% CI for $\\mu_1 - \\mu_2$. Is there clear evidence of a difference?",
      solution: "$n_1 = n_2$ → $\\text{SE} = \\sqrt{100/50 + 144/50} = 2.209$. CI = $4 \\pm 1.96 (2.209) = 4 \\pm 4.33$ → **(−0.33, 8.33)**. The interval contains 0, so the data don't clearly show a difference.",
    },
    {
      title: "Level 3: difference of two proportions",
      level: "Level 3",
      question: "45% of 200 urban and 35% of 200 rural respondents prefer online banking. 95% CI for $p_1 - p_2$.",
      solution: "$n_1 = n_2$ → $\\text{SE} = \\sqrt{0.45 \\times 0.55/200 + 0.35 \\times 0.65/200} = 0.0487$. $0.10 \\pm 1.96 (0.0487) = 0.10 \\pm 0.096$ → **(0.004, 0.196)**. It excludes 0, so urban preference is higher.",
    },
  ],

  theory: [
    {
      title: "Parameter vs statistic",
      level: "Level 1",
      question: "Distinguish parameter and statistic with examples. Why does a statistic have a sampling distribution?",
      solution: "A **parameter** is a fixed (usually unknown) population constant: $\\mu$, $\\sigma^2$, P, $\\rho$. A **statistic** is computed from a sample: $\\bar{x}$, $S^2$, $\\hat{p}$, r. Different random samples give different values of a statistic, so it is a random variable, and its probability distribution is its sampling distribution (slides 6–7, 24).",
    },
    {
      title: "State the Central Limit Theorem",
      level: "Level 2",
      question: "State the Central Limit Theorem and explain its importance.",
      solution: "If samples of size n are drawn from a population with mean $\\mu$ and $\\text{SD} \\sigma$, then for large n $(n \\ge 30) \\bar{x}$ is approximately normal with mean $\\mu$ and $\\text{SD} \\sigma/\\sqrt{n}$, regardless of the population's shape; if the population is normal, this holds for any n. Importance: we can use z-scores and the normal table for sample means and build confidence intervals even when the population isn't normal (slides 32–33).",
    },
    {
      title: "Stratified vs quota sampling",
      level: "Level 2",
      question: "Compare stratified random sampling with quota sampling.",
      solution: "Both split a heterogeneous population into homogeneous strata. **Stratified** then uses **random** sampling within each stratum, with allocation proportional to stratum size, so it's a probability method that supports valid inference. **Quota** fills fixed quotas at the investigator's **convenience**, a non-probability method that can introduce bias (slides 14, 16).",
    },
    {
      title: "Factors affecting the width of a CI",
      level: "Level 3",
      question: "How do the confidence level, sample size and population SD affect the width of $\\bar{x} \\pm z \\sigma/\\sqrt{n}$?",
      solution: "Width = $2 z \\sigma/\\sqrt{n}$. Higher confidence → larger z → **wider**. Larger $\\sigma$ → **wider**. Larger n → **narrower**, but only as $1/\\sqrt{n}$, so halving the width needs **4×** the sample size.",
    },
    {
      title: "When to use the finite population correction",
      level: "Level 1",
      question: "What is the finite population correction factor and when should it be used?",
      solution: "$\\sqrt{(N - n)/(N - 1)}$ multiplies the standard error when sampling without replacement from a finite population. Use it when the sample is at least 5% of the population $(n/N \\ge 0.05)$; otherwise it's close to 1 and can be ignored (slides 42–43).",
    },
  ],

  quiz: [
    {
      topic: "Sampling",
      q: "Selecting every k-th unit from an ordered list after a random start is…",
      options: ["Simple random sampling", "Systematic random sampling", "Stratified sampling", "Snowball sampling"],
      answer: 1,
      why: "$k = N/n$; only the first unit is random.",
      wrong: ["Simple random selects every unit with equal probability, not at fixed intervals.", null, "Stratified samples within strata.", "Snowball relies on recommendations."],
    },
    {
      topic: "Sampling",
      q: "Which is a non-probability sampling method?",
      options: ["Stratified", "Multistage", "Quota", "Systematic"],
      answer: 2,
      why: "Quotas are filled at the investigator's convenience.",
      wrong: ["Random within strata: a probability method.", "Random at each stage: a probability method.", null, "Random start, fixed interval: a probability method."],
    },
    {
      topic: "Sampling",
      type: "num",
      q: "Strata of 2000, 6000, 1000; total sample 1500. Size allocated to the 6000 stratum?",
      answer: 1000,
      tol: 0.5,
      why: "$1500 \\times 6000/9000$.",
    },
    {
      topic: "CLT",
      type: "num",
      q: "$\\sigma = 21$, $n = 49$. Standard error of $\\bar{x}$?",
      answer: 3,
      tol: 0.001,
      why: "$21/\\sqrt{49}$.",
    },
    {
      topic: "CLT",
      type: "num",
      q: "$\\mu = 96$, $\\sigma = 16$, $n = 36$. $P(90 < \\bar{x} < 100)$? (4 decimals)",
      answer: 0.921,
      tol: 0.001,
      why: "z = −2.25 to 1.5 → $0.9332 - 0.0122$.",
    },
    {
      topic: "CLT",
      q: "By the CLT, the sampling distribution of $\\bar{x}$ is approximately normal when…",
      options: ["The population is uniform only", "$n \\ge 30$, regardless of the population's shape", "$n < 30$ always", "$\\sigma$ is unknown"],
      answer: 1,
      why: "Large samples → normal $\\bar{x}$ for any population.",
      wrong: ["It's not restricted to uniform populations.", null, "Small n works only for normal populations.", "Not a CLT condition."],
    },
    {
      topic: "CLT",
      type: "num",
      q: "$N = 350$, $n = 45$, $\\sigma = 8.3$. SE with the finite correction? (3 decimals)",
      answer: 1.157,
      tol: 0.002,
      why: "$(8.3/\\sqrt{45}) \\cdot \\sqrt{305/349}$.",
    },
    {
      topic: "Proportions",
      type: "num",
      q: "$P = 0.6$, $n = 120$. z for $\\hat{p} = 0.5$? (2 decimals)",
      answer: -2.24,
      tol: 0.01,
      why: "−$0.1/\\sqrt{0.24/120}$.",
    },
    {
      topic: "Confidence intervals",
      type: "num",
      q: "z_{$\\alpha/2$} for a 98% confidence interval? (2 decimals)",
      answer: 2.33,
      tol: 0.01,
      why: "$\\alpha/2 = 0.01$ → $F(z) = 0.99$.",
    },
    {
      topic: "Confidence intervals",
      type: "num",
      q: "$\\bar{x} = 510$, $\\sigma = 46$, $n = 85$, 95%. Margin of error? (2 decimals)",
      answer: 9.78,
      tol: 0.02,
      why: "$1.96 \\times 46/\\sqrt{85}$.",
    },
    {
      topic: "Confidence intervals",
      q: "To halve the width of a CI for $\\mu$ (same confidence), the sample size must be…",
      options: ["Doubled", "Halved", "Quadrupled", "Unchanged"],
      answer: 2,
      why: "Width ∝ $1/\\sqrt{n}$.",
      wrong: ["Doubling n shrinks the width only by $\\sqrt{2}$.", "That widens it.", null, "Width depends on n."],
    },
    {
      topic: "Confidence intervals",
      type: "num",
      q: "$\\hat{p} = 0.39$, $n = 87$, 95%. Margin of error? (2 decimals)",
      answer: 0.1,
      tol: 0.005,
      why: "$1.96 \\sqrt{0.39 \\times 0.61/87} = 0.102$.",
    },
    {
      topic: "Confidence intervals",
      q: "A 95% CI for $\\mu$ is (500.22, 519.78). The correct interpretation is…",
      options: ["95% of all calls last between 500 and 520 minutes", "We're 95% confident the population mean lies in this interval", "$\\bar{x}$ has a 95% chance of being in the interval", "$\\mu = 510$ with 95% certainty"],
      answer: 1,
      why: "The CI is about the population mean $\\mu$ (slide 67).",
      wrong: ["Individual calls vary far more than the mean.", null, "$\\bar{x} = 510$ is the centre, so it's certainly inside.", "510 is the point estimate, not $\\mu$."],
    },
  ],
};
