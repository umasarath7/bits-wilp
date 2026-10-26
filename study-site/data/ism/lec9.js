// ISM — Lecture 9 (CS-9): Hypothesis testing — z-tests (means, proportions), t-tests, chi-square tests
// Source: CourseFiles/ISM/Lec9.pdf (94 pages). Every topic cites its slides; nothing outside the deck is taught.
// Note: no Lec8.pdf was provided in CourseFiles/ISM.

export default {
  title: "Hypothesis Testing: z, t and χ² Tests",
  source: "Lec9.pdf (CS-9) · 94 pages",
  quizMode: "step",
  overview:
    "A taxi company must choose between two tyre brands; a watchdog doubts a courier's “3-day delivery” claim; an RTO suspects early-morning accidents are deadlier. Each is a **claim to be checked against sample data**, and since samples vary (Lecture 7), we need a rule that separates real effects from chance. That rule is the **hypothesis test**: state $H_0$ (no difference) and $H_1$ (the claim to establish), choose $\\alpha$, compute a **test statistic**, and reject $H_0$ if the statistic falls in the **rejection region** (equivalently, if the **p-value ≤ $\\alpha$**). This lecture covers the **z-test** (large samples, $\\sigma$ known) for one mean, two means, one proportion and two proportions; **Student's t-test** (small samples, $\\sigma$ unknown) for one mean, two independent means and paired data; and the **χ² test** for independence in contingency tables and for goodness of fit.",

  simpleIntro: "A **hypothesis test** is a courtroom for claims. The claim being tested is presumed innocent (the **null hypothesis**) until the data give strong evidence against it. Every test in this lecture (z, t and χ²) follows the **same five steps**; only the formula for the test statistic changes. Learn the steps once, then learn *which formula fits which situation*. All examples are the lecturer's own.",

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
              "title": "z-test",
              "text": "Large samples (n ≥ 30) or σ known. Tests one mean, two means, one proportion or two proportions.",
              "tag": "Big samples",
              "example": "Does mean sodium exceed 920 mg? (n = 44)"
            },
            {
              "title": "t-test",
              "text": "Small samples with σ unknown. One mean, two independent means (pooled), or **paired** before/after data.",
              "tag": "Small samples",
              "example": "Did a training programme raise scores? (9 trainees)"
            },
            {
              "title": "χ² test",
              "text": "Counts in categories. Are two categorical variables **associated**, or does data **fit** a theory?",
              "tag": "Categories",
              "example": "Are accident times linked to fatality?",
              "figure": "i9-chi"
            }
          ]
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "The five steps (same for every test)",
          "text": "1. Write $H_0$ (with =, ≤ or ≥) and $H_1$ (with ≠, < or >).\n2. Choose α (usually 5%).\n3. Compute the **test statistic** (z, t or χ²).\n4. Compare with the **critical value** (or compare the p-value with α).\n5. **Decide** (reject / don't reject $H_0$) and **write the conclusion in words**."
        }
      ]
    },
    {
      "id": "s-hyp",
      "heading": "2. Null and alternative hypotheses",
      "slides": "4–15",
      "blocks": [
        {
          "type": "p",
          "text": "Think of a courtroom. $H_0$ = “innocent” (nothing new is going on; the claim is fine). $H_1$ = what you want to prove. You only **reject** $H_0$ if the evidence is strong; otherwise you **fail to reject** it, which is not the same as proving it true."
        },
        {
          "type": "table",
          "head": [
            "Words in the question",
            "$H_0$",
            "$H_1$",
            "Test"
          ],
          "rows": [
            [
              "“equals”, “is”, “differs?”",
              "$\\mu = \\mu_0$",
              "$\\mu \\ne \\mu_0$",
              "Two-tailed"
            ],
            [
              "“more than”, “exceeds”, “increased”",
              "$\\mu \\le \\mu_0$",
              "$\\mu > \\mu_0$",
              "Right-tailed"
            ],
            [
              "“less than”, “at least … (is it lower?)”",
              "$\\mu \\ge \\mu_0$",
              "$\\mu < \\mu_0$",
              "Left-tailed"
            ]
          ]
        },
        {
          "type": "diagram",
          "name": "i9-tails"
        },
        {
          "type": "p",
          "text": "**Rule:** the equals sign always goes in $H_0$. The sign in $H_1$ decides the tail."
        }
      ]
    },
    {
      "id": "s-errors",
      "heading": "3. Two ways to be wrong, and the p-value",
      "slides": "16–27",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "$H_0$ actually true",
            "$H_0$ actually false"
          ],
          "rows": [
            [
              "You reject $H_0$",
              "**Type I error** (probability α): convicting an innocent person",
              "Correct ✅ (probability = **power** = 1 − β)"
            ],
            [
              "You keep $H_0$",
              "Correct ✅",
              "**Type II error** (probability β): letting a guilty person go"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The decision rule",
          "text": "**p-value** = if $H_0$ were true, the chance of seeing data this extreme (or more).\n- **$p \\le \\alpha$ → reject $H_0$.** The data would be too surprising if $H_0$ were true.\n- $p > \\alpha$ → don't reject $H_0$."
        },
        {
          "type": "table",
          "head": [
            "Test",
            "α = 10%",
            "α = 5%",
            "α = 1%"
          ],
          "rows": [
            [
              "Two-tailed",
              "±1.645",
              "±1.96",
              "±2.58"
            ],
            [
              "One-tailed",
              "1.28",
              "1.645",
              "2.33"
            ]
          ],
          "caption": "Critical z-values to memorise"
        }
      ]
    },
    {
      "id": "s-z1",
      "heading": "4. z-test for one mean",
      "slides": "26–30",
      "blocks": [
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$z = \\frac{\\bar x - \\mu_0}{\\sigma/\\sqrt n} \\qquad \\text{use when } n \\ge 30 \\text{ or } \\sigma \\text{ known}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slide 28): sodium content",
          "text": "A maker claims mean sodium is **no more than** 920 mg. A sample of $n = 44$ has $\\bar x = 925$, $s = 18$. Test at 5%.\n\n**1.** $H_0: \\mu \\le 920$, $H_1: \\mu > 920$ (right-tailed).\n**2.** α = 0.05 → critical $z = 1.645$.\n**3.** $z = \\frac{925 - 920}{18/\\sqrt{44}} = \\frac{5}{2.714} = 1.842$.\n**4.** $1.842 > 1.645$ (p = 0.033 < 0.05).\n**5.** Reject $H_0$."
        },
        {
          "type": "answer",
          "value": "Reject H₀",
          "text": "There is enough evidence (at 5%) that mean sodium **exceeds** 920 mg. The claim is not supported."
        },
        {
          "type": "check",
          "q": "Claim: average delivery = 3 days. n = 50, x̄ = 3.4, σ = 1.2. What is z?",
          "options": [
            "0.33",
            "1.65",
            "2.36",
            "16.7"
          ],
          "answer": 2,
          "why": "$z = \\frac{3.4 - 3}{1.2/\\sqrt{50}} = \\frac{0.4}{0.170} = 2.36 > 1.96$ → reject (two-tailed)."
        }
      ]
    },
    {
      "id": "s-z2",
      "heading": "5. z-tests for two means and for proportions",
      "slides": "31–46",
      "blocks": [
        {
          "type": "callout",
          "kind": "formula",
          "title": "Two means (large samples)",
          "text": "$$z = \\frac{\\bar x_1 - \\bar x_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: taxi tyres",
          "text": "Brand A: $n = 30$, mean 38600 km, SD 5000. Brand B: $n = 40$, mean 35450 km, SD 6100.\n$z = \\frac{3150}{\\sqrt{5000^2/30 + 6100^2/40}} = \\frac{3150}{1328} = 2.37 > 1.96$ → **the brands differ at 5%** (but not at 1%, where the critical value is 2.58)."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "One proportion",
          "text": "$$z = \\frac{p - P}{\\sqrt{PQ/n}} \\qquad P = \\text{claimed proportion},\\ Q = 1 - P$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: disease survival",
          "text": "18 of 20 survived ($p = 0.90$). Is survival above 85%? $z = \\frac{0.90 - 0.85}{\\sqrt{0.85 \\times 0.15/20}} = 0.63 < 1.645$ → **not significant**: 90% vs 85% on only 20 patients isn't convincing."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Two proportions (pool them under H₀)",
          "text": "$$\\hat P = \\frac{X_1 + X_2}{n_1 + n_2}, \\qquad z = \\frac{p_1 - p_2}{\\sqrt{\\hat P\\hat Q\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}$$"
        }
      ]
    },
    {
      "id": "s-t",
      "heading": "6. t-tests: small samples",
      "slides": "47–65",
      "blocks": [
        {
          "type": "p",
          "text": "When the sample is **small** and σ is **unknown**, the sample SD $s$ is itself shaky, so use the **t-distribution**: a bell curve with fatter tails (harder to reject). Its shape depends on **degrees of freedom (df)**."
        },
        {
          "type": "table",
          "head": [
            "Situation",
            "Statistic",
            "df"
          ],
          "rows": [
            [
              "One mean",
              "$t = \\frac{\\bar x - \\mu_0}{s/\\sqrt n}$",
              "$n - 1$"
            ],
            [
              "Two **independent** groups (pooled)",
              "$t = \\frac{\\bar x_1 - \\bar x_2}{s_p\\sqrt{1/n_1 + 1/n_2}}$, $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$",
              "$n_1 + n_2 - 2$"
            ],
            [
              "**Paired** (same people before/after)",
              "$t = \\frac{\\bar d}{s_d/\\sqrt n}$ on the differences $d$",
              "pairs − 1"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 62–65): training programme (paired)",
          "text": "9 trainees took an aptitude test before and after training. Differences (after − before): −5, 7, 11, −8, 11, 21, 0, 9, −1. Did scores improve (5%)?\n\n**1.** $H_0: \\mu_d = 0$, $H_1: \\mu_d > 0$.\n**2.** df $= 9 - 1 = 8$ → critical $t = 1.860$.\n**3.** $\\bar d = 5$, $s_d = 9.21$, $t = \\frac{5}{9.21/\\sqrt 9} = 1.629$.\n**4.** $1.629 < 1.860$.\n**5.** Don't reject $H_0$."
        },
        {
          "type": "answer",
          "value": "Not significant",
          "text": "An average gain of 5 points on only 9 people isn't enough evidence that the training works."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Two traps",
          "text": "- **Paired vs independent:** the same people measured twice → **paired**. Two separate groups → pooled.\n- **Check the sign:** for $H_1: \\mu > \\mu_0$ you can only reject if t is **positive** and beyond the critical value. (The slides' sports-car example misses this; see 📊 Slides.)"
        },
        {
          "type": "check",
          "q": "10 students' scores before and after coaching. Which test?",
          "options": [
            "Pooled two-sample t",
            "Paired t",
            "χ² independence",
            "z for two proportions"
          ],
          "answer": 1,
          "why": "Same students measured twice → paired t on the differences, df = 9."
        }
      ]
    },
    {
      "id": "s-chi",
      "heading": "7. χ² tests: counts in categories",
      "slides": "66–85",
      "blocks": [
        {
          "type": "p",
          "text": "χ² (chi-square) compares **observed counts O** with the counts **E you'd expect** if $H_0$ were true. Big gaps → big χ² → reject."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$\n- **Independence** (a two-way table): $E = \\frac{\\text{row total} \\times \\text{column total}}{n}$, df $= (r - 1)(c - 1)$.\n- **Goodness of fit:** E from the theory (uniform, a ratio, Poisson…), df $= k - 1 - (\\text{parameters estimated})$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 72–76): road accidents",
          "text": "400 accidents: early hours 280 (80 fatal, 200 not); other times 120 (19 fatal, 101 not). Is time of day associated with fatality?\n\nExpected fatal in early hours $= \\frac{280 \\times 99}{400} = 69.3$; the others: 210.7, 29.7, 90.3.\n$\\chi^2 = \\frac{10.7^2}{69.3} + \\frac{10.7^2}{210.7} + \\frac{10.7^2}{29.7} + \\frac{10.7^2}{90.3} = 7.318$; df $= 1$, critical $3.841$."
        },
        {
          "type": "answer",
          "value": "Reject H₀ (χ² = 7.318 > 3.841)",
          "text": "Accident time and fatality **are associated**: early-hours accidents are more often fatal than chance would explain."
        },
        {
          "type": "diagram",
          "name": "i9-chi"
        },
        {
          "type": "check",
          "q": "A 3 × 4 contingency table. Degrees of freedom?",
          "options": [
            "12",
            "7",
            "6",
            "11"
          ],
          "answer": 2,
          "why": "$(3 - 1)(4 - 1) = 6$."
        }
      ]
    },
    {
      "id": "s-choose",
      "heading": "8. Which test? A decision table",
      "slides": "",
      "blocks": [
        {
          "type": "table",
          "head": [
            "If the question…",
            "Use"
          ],
          "rows": [
            [
              "compares one mean with a claim, n ≥ 30",
              "z (one mean)"
            ],
            [
              "compares one mean with a claim, small n, σ unknown",
              "t (one mean), df n − 1"
            ],
            [
              "compares two large groups' means",
              "z (two means)"
            ],
            [
              "compares two small independent groups",
              "pooled t, df n₁ + n₂ − 2"
            ],
            [
              "measures the **same** subjects twice",
              "paired t, df pairs − 1"
            ],
            [
              "tests a percentage against a claim",
              "z (one proportion)"
            ],
            [
              "compares two percentages",
              "z (two proportions, pooled)"
            ],
            [
              "has a table of counts for two categorical variables",
              "χ² independence"
            ],
            [
              "compares observed counts with a theory",
              "χ² goodness of fit"
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
          "type": "check",
          "q": "You reject a true H₀. This is…",
          "options": [
            "Type I error",
            "Type II error",
            "Power",
            "A correct decision"
          ],
          "answer": 0,
          "why": "Rejecting a true $H_0$ = Type I (probability α)."
        },
        {
          "type": "check",
          "q": "p-value = 0.03 with α = 0.05. Decision?",
          "options": [
            "Reject H₀",
            "Don't reject H₀",
            "Accept H₁ with certainty",
            "Need a bigger α"
          ],
          "answer": 0,
          "why": "$p \\le \\alpha$ → reject $H_0$."
        },
        {
          "type": "check",
          "q": "Claim: “average battery life is at least 500 hours”. The alternative hypothesis is…",
          "options": [
            "μ ≠ 500",
            "μ > 500",
            "μ < 500",
            "μ = 500"
          ],
          "answer": 2,
          "why": "“At least 500” is the claim ($H_0: \\mu \\ge 500$); you'd try to show it's lower: $H_1: \\mu < 500$, left-tailed."
        },
        {
          "type": "check",
          "q": "Two-tailed z-test at 1%. Critical values?",
          "options": [
            "±1.645",
            "±1.96",
            "±2.33",
            "±2.58"
          ],
          "answer": 3,
          "why": "Two-tailed 1% → ±2.58."
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
          "text": "- **Five steps:** $H_0$/$H_1$ → α → statistic → critical value or p-value → decision **in words**.\n- $H_0$ holds the =; the sign of $H_1$ sets the tail.\n- **z** for big samples / known σ; **t** for small samples (watch df); **paired** for before/after; **χ²** for counts.\n- **p ≤ α → reject.** Critical z: 1.645 / 1.96 / 2.33 / 2.58.\n- **Type I** = reject a true $H_0$ (α); **Type II** = keep a false $H_0$ (β); power = 1 − β.\n- χ²: $E = \\frac{\\text{row} \\times \\text{col}}{n}$, df $(r - 1)(c - 1)$; goodness of fit df $k - 1$ − parameters."
        },
        {
          "type": "p",
          "text": "Then practise in ✍️ **Solved Questions**; the 📊 **Slides** tab lists the slide errors in this lecture (taxi tyres, sports cars, courier, paired df, digits)."
        }
      ]
    }
  ],

  summary: [
    {
      id: "hypotheses",
      heading: "Lesson 1: What exactly are we testing? Null and alternative hypotheses",
      slides: "4–15",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to turn a business question into a pair of hypotheses and decide whether the test is one- or two-tailed.",
        },
        {
          type: "p",
          text: "**Why test? (slide 6)** To **validate assumptions** about a population or process, to **support decision-making** with data rather than intuition, and to **determine statistical significance**: is the observed effect real or just chance?",
        },
        {
          type: "table",
          caption: "The two hypotheses (slide 7)",
          head: ["", "Null hypothesis $H_0$", "Alternative hypothesis $H_1$"],
          rows: [
            ["Meaning", "No difference: neutral; any observed difference may be due to **sampling variation**", "A difference that is yet to be proved/established"],
            ["Tyres (slides 8–10)", "Mean mileage of brands A and B is the same", "$A < B$, or $A > B$ (one-tailed), or $A \\ne B$ (two-tailed)"],
            ["Judges (slides 12–14)", "Proportion of false positives is the same for both judges", "Judge 1 lower, higher, or different"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Which tail? (slide 11)",
          text: "$\\mu_1 < \\mu_2$ → **one-tailed (left)**; $\\mu_1 > \\mu_2$ → **one-tailed (right)**; $\\mu_1 \\neq \\mu_2$ → **two-tailed**. The direction of **H₁** decides.",
        },
        {
          type: "p",
          text: "**The warning (slide 15):** a test is a statistical rule that decides whether to reject $H_0$ **based on the sample, not the population**, so the decision can differ from reality. That's where errors come in.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$H_0$ always contains equality (=, ≤, ≥). $H_1$ is what you want to establish (<, >, ≠); its sign sets the tail.",
        },
      ],
    },
    {
      id: "errors",
      heading: "Lesson 2: What can go wrong? Type I and Type II errors, α and power",
      slides: "16–21",
      blocks: [
        {
          type: "table",
          caption: "Errors in decision making (slides 18–20)",
          head: ["Decision", "$H_0$ actually true", "$H_0$ actually false ($H_1$ true)"],
          rows: [
            ["Do not reject $H_0$", "✓ Correct (confidence level $1 - \\alpha$)", "✗ **Type II error** $(\\beta)$"],
            ["Reject $H_0$", "✗ **Type I error** $(\\alpha)$", "✓ Correct (**power** $1 - \\beta$)"],
          ],
        },
        {
          type: "p",
          text: "**Level of significance $\\alpha$ (slide 21):** the **maximum probability of a Type I error** (rejecting a true $H_0$). Think of a court: $H_0$ = “the defendant is innocent”. A Type I error convicts an innocent person; a Type II error frees a guilty one. Choosing a small $\\alpha$ (say 1%) makes false convictions rare but lets more guilty people go (bigger $\\beta$).",
        },
        {
          type: "table",
          caption: "Kinds of tests (slides 16–19)",
          head: ["", "Parametric", "Non-parametric (distribution-free)"],
          rows: [
            ["Assumption", "Data follow a probability distribution characterised by parameters", "No distributional assumption"],
            ["Examples", "**Z-test** (large sample, $n \\ge 30$); **t-test** (small sample, $n < 30$: unpaired, paired); **ANOVA** (1-way, 2-way)", "**Chi-square**, Fisher's exact, Mann–Whitney U, Wilcoxon signed rank, Kruskal–Wallis, Friedman"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Type I = reject a true $H_0$ $(\\alpha)$. Type II = keep a false $H_0$ $(\\beta)$. Power = $1 - \\beta$.",
        },
      ],
    },
    {
      id: "pvalue",
      heading: "Lesson 3: Critical values and p-values: the decision rule",
      slides: "21–27",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Decision rules (slides 21–27, 32–34)",
          text: "**p-value:** if $H_0$ is true, the probability of getting a sample statistic **as extreme or more extreme** than the one observed.\n- **If $p \\le \\alpha$, reject $H_0$.** If $p > \\alpha$, fail to reject $H_0$.\n\n**Critical values of z:**\n\n| Test | $\\alpha = 1\\%$ | 5% | 10% |\n|---|---|---|---|\n| Two-tailed | ±2.58 | ±1.96 | ±1.645 |\n| Right-tailed | 2.33 | 1.65 | 1.28 |\n| Left-tailed | −2.33 | −1.65 | −1.28 |\n\nReject $H_0$ if z falls in the tail(s) beyond the critical value.",
        },
        { type: "diagram", name: "i9-tails" },
        {
          type: "p",
          text: "**General procedure (slide 26):** (1) set up $H_0$; (2) set up $H_1$, which decides one- or two-tailed; (3) choose $\\alpha$; (4) compute the test statistic under $H_0$; (5) compare with the critical value (or compare p with $\\alpha$); (6) state the conclusion **in the problem's words**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$p \\le \\alpha$ → reject. Two-tailed 5%: ±1.96; one-tailed 5%: 1.65 (slides also use 1.645).",
        },
      ],
    },
    {
      id: "zmean",
      heading: "Lesson 4: Testing one mean with the z-test",
      slides: "26–30, 86",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "z-test for a single mean (slide 26)",
          text: "$$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$$\n**Use when:** $n \\ge 30$ (or $\\sigma$ known). If $\\sigma$ is unknown, the sample s is used; for large n the t-distribution is nearly the same as Z.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: sodium content (slide 28)",
          text: "Claim: mean sodium **no more than** 920 mg. $n = 44$, $\\bar{x} = 925$, $s = 18$, $\\alpha = 0.05$.\n\n$H_0$: $\\mu \\le 920$, $H_1$: $\\mu > 920$ (right-tailed).\n\n$z = \\frac{925 - 920}{18/\\sqrt{44}} = 1.842 > 1.65$ → **reject $H_0$**: there's enough evidence that the mean sodium content exceeds 920 mg.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: delivery time, two-tailed (slide 30)",
          text: "Claim: average delivery = 3 days. $n = 50$, $\\bar{x} = 3.4$, $\\sigma = 1.2$, $\\alpha = 0.05$. $H_0$: $\\mu = 3$, $H_1$: $\\mu \\ne 3$.\n\n$z = \\frac{3.4 - 3}{1.2/\\sqrt{50}} = 2.36 > 1.96$ → **reject $H_0$**: delivery time differs significantly from 3 days.",
        },
        {
          type: "p",
          text: "**Light bulbs (slide 29):** $H_0$: $\\mu \\ge 750$, $H_1$: $\\mu < 750$, $n = 36$, $\\bar{x} = 745$, $s = 60$, $\\alpha = 0.01$. $z = \\frac{745 - 750}{60/6} = -0.5$, which is not beyond −2.33, so it's in the acceptance region: **not enough evidence** that the mean life is below 750 hours. (The slide's wording, “the manufacturer guarantees the mean life is less than 750”, sits oddly with this $H_0$; the computation and conclusion follow the stated hypotheses.)",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$z = (\\bar{x} - \\mu_0)/(\\sigma/\\sqrt{n})$. Claim with “no more than” → $H_0$: $\\mu$ ≤ …, $H_1$: $\\mu$ > … (right tail).",
        },
      ],
    },
    {
      id: "ztwo",
      heading: "Lesson 5: Comparing two means with the z-test",
      slides: "31–40",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "z for difference of means (slide 35)",
          text: "Under $H_0$: $\\mu_1 = \\mu_2$ (large independent samples):\n$$z = \\frac{\\bar x_1 - \\bar x_2}{\\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}}$$\nCommon $\\sigma$: $z = \\frac{\\bar x_1 - \\bar x_2}{\\sigma\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}$. If $\\sigma_1$, $\\sigma_2$ are unknown, use the sample SDs $s_1$, $s_2$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: taxi tyres (slides 36–39)",
          text: "Brand A: $n = 30$, mean 38600 km, SD 5000. Brand B: $n = 40$, mean 35450 km, SD 6100. $H_0$: $\\mu_1 - \\mu_2 = 0$, $H_1$: $\\mu_1 - \\mu_2 \\ne 0$.\n\n$z = \\frac{38600 - 35450}{\\sqrt{\\frac{5000^2}{30} + \\frac{6100^2}{40}}} = \\frac{3150}{1328} = 2.37$\n\nAt 5% (±1.96): **reject $H_0$**, the brands differ, so buy A (higher mean). At 1% (±2.58): **don't reject**, the evidence isn't strong enough at that stricter level.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): taxi tyres",
          text: "The slides report z = **2.30**; the data give $3150/\\sqrt{833333 + 930250} = 3150/1328 = $ **2.37**. Both conclusions (reject at 5%, not at 1%) are unchanged. Slide 39 also mentions “critical value for $\\alpha = 0.05$ is 1.96” while testing at 1% (2.58 is the one used).",
        },
        {
          type: "p",
          text: "**Coaching program (slide 40):** Group A $n = 40$, mean 78, $s = 10$; Group B $n = 35$, mean 74, $s = 12$. $H_0$: $\\mu_1 \\le \\mu_2$, $H_1$: $\\mu_1 > \\mu_2$. $z = \\frac{4}{\\sqrt{2.5 + 4.114}} = 1.555 < 1.645$ → **fail to reject**: no evidence at 5% that coaching raises the average score.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$z = (\\bar{x}_1 - \\bar{x}_2)/\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}$. Same z can be significant at 5% but not at 1%.",
        },
      ],
    },
    {
      id: "zprop",
      heading: "Lesson 6: Testing proportions with the z-test",
      slides: "41–46",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Single proportion (slide 41)",
          text: "$$z = \\frac{p - P}{\\sigma_p}, \\qquad \\sigma_p = \\sqrt{\\frac{PQ}{n}} \\quad \\left(\\times\\sqrt{\\frac{N-n}{N-1}} \\text{ for a finite population}\\right)$$\nP = hypothesised population proportion, $Q = 1 - P$, p = sample proportion. If P is unknown, use p: $\\sigma_p = \\sqrt{pq/n}$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: disease survival (slide 42)",
          text: "18 of 20 survived $(p = 0.90)$. $H_0$: $P = 0.85$, $H_1$: $P > 0.85$.\n\n$z = \\frac{0.90 - 0.85}{\\sqrt{0.85 \\times 0.15/20}} = 0.63 < 1.645$ → **do not reject $H_0$**: no evidence the survival rate exceeds 85%.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Difference of proportions (slide 44)",
          text: "Under $H_0$: $P_1 = P_2$, with pooled estimate $\\hat P = \\frac{n_1p_1 + n_2p_2}{n_1 + n_2} = \\frac{X_1 + X_2}{n_1 + n_2}$:\n$$z = \\frac{p_1 - p_2}{\\sqrt{\\hat P\\hat Q\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}$$",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: two judges (slides 45–46)",
          text: "Judge 1: 90 false positives in 3000 (3.00%). Judge 2: 48 in 2500 (1.92%). $H_0$: $P_1 = P_2$, $H_1$: $P_1 > P_2$, $\\alpha = 0.05$.\n\n$\\hat P = \\frac{90 + 48}{5500} = 0.025$. $SE = \\sqrt{0.025 \\times 0.975\\left(\\frac{1}{3000} + \\frac{1}{2500}\\right)} = 0.00424$.\n\n$z = \\frac{0.030 - 0.0192}{0.00424} = 2.55 > 1.645$ → **reject $H_0$**: Judge 1 has more false positives $(p = 0.005)$.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "One proportion: SE uses the hypothesised P. Two proportions: pool them under $H_0$.",
        },
      ],
    },
    {
      id: "ttest",
      heading: "Lesson 7: Small samples, σ unknown: Student's t-tests",
      slides: "47–65",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "When to switch from z to t, and the three t-tests: one mean, two independent means (unpaired), and paired observations.",
        },
        {
          type: "table",
          caption: "z or t? (slide 47)",
          head: ["Use z when", "Use t when"],
          rows: [["$\\sigma$ is **known**", "$\\sigma$ is **unknown**"], ["n is **large** (≥ 30)", "n is **small** (< 30)"]],
        },
        {
          type: "p",
          text: "The t-distribution approaches z as n increases, so with $\\sigma$ unknown and $n \\ge 30$, z is often acceptable. **Degrees of freedom (slide 48):** if $a + b = 20$ and you choose $a = 9$, b is forced (df = $2 - 1 = 1$); with three numbers summing to 20, two are free (df = 2). In general, **df = $n - 1$**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The three t-tests (slides 49–65)",
          text: "**One mean:** $t = \\frac{\\bar x - \\mu}{s/\\sqrt n}$, df = $n - 1$.\n\n**Two independent means (unpaired):** assumes normal populations, unknown but **equal** variances, independent groups, random allocation:\n$$t = \\frac{\\bar x_1 - \\bar x_2}{s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}, \\quad s_p = \\sqrt{\\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}}, \\quad df = n_1 + n_2 - 2$$\n**Paired:** with differences $d = y - x$, $t = \\frac{\\bar d - \\mu_d}{s_d/\\sqrt n}$, $\\mu$_d = 0 under $H_0$, df = $n - 1$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: sports-car mileage (slides 51–57)",
          text: "Claim: 18580 km/year; the firm suspects it's **higher**. $n = 10$, $\\bar{x} = 17352$, $s = 2012$. $H_0$: $\\mu = 18580$, $H_1$: $\\mu > 18580$, df = 9.\n\n$t = \\frac{17352 - 18580}{2012/\\sqrt{10}} = \\frac{-1228}{636.3} = -1.93$.\n\nFor a **right**-tailed test we reject only for $t > 1.833$ (5%) or $t > 2.821$ (1%). t is **negative**, so **do not reject $H_0$** at either level: the sample mean is *below* the claim and gives no evidence that mileage is higher.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): sports cars",
          text: "The slides compare **|t|** = 1.929 with 1.833 and **reject $H_0$ at 5%** $(p = 0.0427)$. But $H_1$: $\\mu > 18580$ is one-sided and the sample mean (17352) lies **below** 18580, so the evidence points the other way; the correct right-tailed p-value is about 0.96. (If $H_1$ had been $\\mu < 18580$, then t = −1.93 < −1.833 would reject at 5%, with $p = 0.043$.) Slide 54's heading also says 2.262, the two-tailed 5% value; the 1% one-tailed value used, 2.821, is correct.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: courier packets, pooled t (slides 60–61)",
          text: "Beginning of month: $n_1 = 15$, $\\bar{x}_1 = 5.25$ kg, $s_1^2 = 1.20$. End: $n_2 = 10$, $\\bar{x}_2 = 4.56$ kg, $s_2^2 = 1.15$. $H_1$: beginning heavier (one-tailed), df = 23.\n\n$s_p = \\sqrt{\\frac{14(1.20) + 9(1.15)}{23}} = 1.0865$; SE = $1.0865\\sqrt{\\frac{1}{15} + \\frac{1}{10}} = 0.4436$.\n\n$t = \\frac{5.25 - 4.56}{0.4436} = 1.556 < 1.714$ → **do not reject $H_0$** (one-tailed $p = 0.067$). 95% CI: $0.69 \\pm 2.069(0.4436) = (-0.23, 1.61)$, which contains 0.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): courier packets",
          text: "Slide 61 computes $\\frac{5.25 - 4.26}{0.443} = 2.233$ and rejects $H_0$, with CI (0.073, 1.907). But the end-of-month mean is **4.56**, so the difference is 0.69, not 0.99: t = **1.556**, which is **not significant** (one-tailed critical 1.714; the slide also writes $H_1$ as ≠ while the question is one-sided). Corrected CI: **(−0.23, 1.61)**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Paired t: training program (slides 62–65)",
          text: "Aptitude before (x) and after (y) for 9 trainees; $d = y - x$: −5, 7, 11, −8, 11, 21, 0, 9, −1. $\\sum d = 45$, $\\bar d = 5$, $\\sum(d - 5)^2 = 678$, $s_d = \\sqrt{678/8} = 9.21$.\n\n$H_0$: $\\mu$_d = 0, $H_1$: $\\mu$_d > 0. $t = \\frac{5}{9.21/\\sqrt 9} = 1.629$.\n\nWith $n = 9$, **df = 8** and the 5% one-tailed critical value is **1.860**. Since 1.629 < 1.860, **do not reject $H_0$** $(p = 0.071)$: no significant improvement.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): paired example",
          text: "Slide 65 uses critical value 1.833 (that's df = 9; here df = $n - 1 = 8$, giving 1.860) and labels (−0.627, 10.627) a **95%** CI. That interval uses 1.833, so it's roughly a 90% two-sided interval; the 95% CI with df = 8 is $5 \\pm 2.306(3.069) = (-2.08, 12.08)$. The conclusion (don't reject) is unchanged.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Comparing |t| with a one-tailed critical value without checking the **sign** agrees with $H_1$.\n- Wrong df: one sample $n - 1$; pooled $n_1 + n_2 - 2$; paired (number of pairs) − 1.\n- Using an unpaired test on before/after data on the same subjects. That's **paired**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$t = (\\bar{x} - \\mu)/(s/\\sqrt{n})$, df $n - 1$. Pooled $s_p$ for two groups, df $n_1 + n_2 - 2$. Paired: test the differences.",
        },
      ],
    },
    {
      id: "chiind",
      heading: "Lesson 8: Are two categorical variables associated? χ² test of independence",
      slides: "66–80",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "χ² test for independence (slides 69–71)",
          text: "In an $r \\times c$ contingency table, expected frequency for each cell:\n$$E = \\frac{\\text{row total} \\times \\text{column total}}{n}$$\n$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}, \\qquad df = (r - 1)(c - 1)$$\n$H_0$: the variables are independent (not associated), Observed = Expected. $H_1$: associated. Reject $H_0$ if $\\chi^2$ > critical value.",
        },
        {
          type: "list",
          items: [
            "Use **frequencies (counts)** only, never percentages, proportions or means (slide 67).",
            "Generally for **nominal** data. Because the link may be chance, call it **association**, not relation.",
            "Sample size should be at least 20. If an expected frequency is < 5: apply **Yates' correction**; in a **2 × 2** table use **Fisher's exact** probabilities; in an $r \\times c$ table **merge** rows or columns meaningfully (slide 68).",
            "A $2 \\times 2$ table is what machine learning calls a confusion matrix.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: RTO accidents (slides 72–76)",
          text: "400 accidents: early hours 280 (80 fatal, 200 non-fatal); other times 120 (19 fatal, 101 non-fatal). Fatal total 99, non-fatal 301.\n\nExpected: $E_1 = 280 \\times 99/400 = 69.3$, $E_2 = 210.7$, $E_3 = 29.7$, $E_4 = 90.3$.\n\n$\\chi^2 = \\frac{10.7^2}{69.3} + \\frac{10.7^2}{210.7} + \\frac{10.7^2}{29.7} + \\frac{10.7^2}{90.3} = 1.652 + 0.543 + 3.855 + 1.268 = 7.318$.\n\ndf = 1, critical 3.841 → **reject $H_0$**: timing and fatality appear associated.",
        },
        { type: "diagram", name: "i9-chi" },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: smoking and hypertension (slides 77–80)",
          text: "180 people; hypertension yes: 21 non-smokers, 36 moderate, 30 heavy (87); no: 48, 26, 19 (93). Column totals 69, 62, 49.\n\nExpected (yes row): 33.35, 29.97, 23.68; (no row): 35.65, 32.03, 25.32.\n\n$\\chi^2 = 4.57 + 1.21 + 1.69 + 4.28 + 1.14 + 1.58 = 14.46$; df = $(2 - 1) (3 - 1) = 2$; critical 5.99 → **reject $H_0$** $(p < 0.001)$: smoking and hypertension appear associated.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "E = row × column / n. $\\chi^2 = \\sum(O - E)^2/E$, df = $(r - 1) (c - 1)$. Expected < 5 → Yates / Fisher / merge.",
        },
      ],
    },
    {
      id: "chigof",
      heading: "Lesson 9: Does the data fit a theory? χ² goodness of fit",
      slides: "81–85",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Goodness of fit (slide 81)",
          text: "Karl Pearson's test of whether observed frequencies $O_i$ match expected (theoretical) frequencies $E_i$:\n$$\\chi^2 = \\sum_{i=1}^{n} \\frac{(O_i - E_i)^2}{E_i}, \\quad df = n - 1$$\n(Subtract one more df for each parameter estimated from the data, e.g. df = $k - 2$ when a Poisson $\\lambda$ is estimated, slide 85.)",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: telephone digits (slides 82–83)",
          text: "10000 digits; $H_0$: digits 0–9 are uniformly frequent, so $E = 1000$ each. Observed (0 → 9): 1026, 1107, 997, 966, 1075, 933, 1107, 972, 964, 853.\n\n$\\chi^2 = \\frac{26^2 + 107^2 + 3^2 + 34^2 + 75^2 + 67^2 + 107^2 + 28^2 + 36^2 + 147^2}{1000} = 58.542$; df = 9, critical 16.919.\n\nSince **58.542 > 16.919**, reject $H_0$: the digits are **not** uniformly distributed.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide checks (flagged): goodness-of-fit examples",
          text: "- **Digits:** slide 83 writes “58.542 < 16.919” but concludes non-uniform; the inequality should be reversed (58.542 is **greater** than 16.919). The slide's table lists 954 for digit 8, which makes the total 9990; the stated total of 10000 and $\\chi^2 = 58.542$ require **964**.\n- **Bus terminus (slides 84–85):** the slide's last column sums to **11.75**, but the text says $\\chi^2 = 3.402$. Recomputing with $\\lambda = 2.96$ gives $\\chi^2$ ≈ **11.45**. Either way it's below the 1% critical value 13.28 (df = $6 - 2 = 4$), so the conclusion holds: arrivals follow the Poisson law.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "GOF: E from the theory (uniform, ratio, Poisson…). df = categories − 1 − (parameters estimated).",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Pick the test",
      head: ["Question", "Test statistic", "df / critical"],
      rows: [
        ["One mean, $n \\ge 30$ or $\\sigma$ known", "$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$", "±1.96 (2-tail 5%), 1.645 (1-tail)"],
        ["Two means, large", "$z = \\frac{\\bar x_1 - \\bar x_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$", "same"],
        ["One proportion", "$z = \\frac{p - P}{\\sqrt{PQ/n}}$", "same"],
        ["Two proportions", "$z = \\frac{p_1 - p_2}{\\sqrt{\\hat P\\hat Q(1/n_1 + 1/n_2)}}$", "same"],
        ["One mean, small, $\\sigma$ unknown", "$t = \\frac{\\bar x - \\mu}{s/\\sqrt n}$", "df $n - 1$"],
        ["Two means, small", "pooled $s_p$", "df $n_1 + n_2 - 2$"],
        ["Before/after", "paired t on d", "df pairs − 1"],
        ["Association of categories", "$\\chi^2 = \\sum (O - E)^2/E$", "$(r - 1) (c - 1)$"],
        ["Fit to a theory", "$\\chi^2$ GOF", "$k - 1$ − params"],
      ],
    },
    { type: "diagram", name: "i9-tails" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "$H_0$ has the equality · $H_1$ sets the tail · check the sign of t/z for one-tailed tests · right df · conclude in words.",
    },
  ],

  glossary: [
    ["$H_0$", "Null hypothesis", "No difference; differences due to sampling variation"],
    ["$H_1$", "Alternative hypothesis", "The difference to be established"],
    ["$\\alpha$", "Level of significance", "Maximum probability of a Type I error"],
    ["Type I error", "", "Rejecting a true $H_0$ (probability $\\alpha$)"],
    ["Type II error", "", "Not rejecting a false $H_0$ (probability $\\beta$)"],
    ["Power", "$1 - \\beta$", "Probability of correctly rejecting a false $H_0$"],
    ["p-value", "", "P(statistic at least as extreme as observed | $H_0$ true)"],
    ["Critical value", "", "Boundary of the rejection region"],
    ["df", "Degrees of freedom", "Number of independent values free to vary"],
    ["$s_p$", "Pooled standard deviation", "Combined SD of two samples assuming equal variances"],
    ["Paired t-test", "", "t-test on differences of matched observations"],
    ["Contingency table", "$r \\times c$ table", "Cross-tabulated counts of two categorical variables"],
    ["Yates' correction", "", "Continuity correction for $\\chi^2$ when expected counts are small"],
    ["Fisher's exact test", "", "Exact test for $2 \\times 2$ tables with small expected counts"],
    ["GOF", "Goodness of fit", "$\\chi^2$ test of observed vs theoretical frequencies"],
  ],

  examTips: [
    "Use the 6-step layout every time: $H_0$, $H_1$, $\\alpha$, statistic, critical value/p-value, conclusion in context.",
    "Write the critical value with its df and tail, e.g. “$t_0$.₀₅,₂₃ = 1.714 (one-tailed)”.",
    "For $\\chi^2$, show a table with O, E, $(O - E)^2/E$. Examiners award marks per column.",
    "Before concluding a one-tailed test, check the statistic's sign agrees with $H_1$.",
  ],

  problems: [
    {
      title: "Sodium content (slide 28)",
      level: "From slides",
      question: "Claim: mean sodium ≤ 920 mg. $n = 44$, $\\bar{x} = 925$, $s = 18$, $\\alpha = 0.05$. Reject the claim?",
      solution: "$H_0$: $\\mu \\le 920$, $H_1$: $\\mu > 920$. $z = 5/(18/\\sqrt{44})$ = **1.842** > 1.65 → **reject $H_0$**; the mean likely exceeds 920 mg $(p = 0.033)$.",
    },
    {
      title: "Light bulbs (slide 29)",
      level: "From slides",
      question: "$H_0$: $\\mu \\ge 750$, $H_1$: $\\mu < 750$; $n = 36$, $\\bar{x} = 745$, $s = 60$, $\\alpha = 0.01$.",
      solution: "z = −5/10 = **−0.5**; critical −2.33 → **do not reject $H_0$** $(p = 0.31)$.",
    },
    {
      title: "Delivery time (slide 30)",
      level: "From slides",
      question: "Claim $\\mu = 3$ days. $n = 50$, $\\bar{x} = 3.4$, $\\sigma = 1.2$, $\\alpha = 0.05$, two-tailed.",
      solution: "$z = 0.4/(1.2/\\sqrt{50})$ = **2.36** > 1.96 → **reject $H_0$** $(p = 0.018)$.",
    },
    {
      title: "Taxi tyres A vs B (slides 36–39)",
      level: "From slides",
      question: "A: $n = 30$, mean 38600, SD 5000. B: $n = 40$, mean 35450, SD 6100. Test for a difference at 5% and 1%.",
      solution: "$z = 3150/\\sqrt{5000^2/30 + 6100^2/40} = 3150/1328$ = **2.37** (slides: 2.30).\n5%: 2.37 > 1.96 → **reject $H_0$** (choose A). 1%: 2.37 < 2.58 → **do not reject**.",
    },
    {
      title: "Coaching program (slide 40)",
      level: "From slides",
      question: "A: $n = 40$, 78, $s = 10$; B: $n = 35$, 74, $s = 12$. Is A better at 5%?",
      solution: "$z = 4/\\sqrt{2.5 + 4.114}$ = **1.555** < 1.645 → **fail to reject $H_0$** $(p = 0.060)$.",
    },
    {
      title: "Disease survival (slide 42)",
      level: "From slides",
      question: "18 of 20 survived. Test $H_0$: $P = 0.85$ vs $H_1$: $P > 0.85$ at 5%.",
      solution: "$z = 0.05/\\sqrt{0.1275/20}$ = **0.63** < 1.645 → **do not reject $H_0$**.",
    },
    {
      title: "Two judges (slides 45–46)",
      level: "From slides",
      question: "Judge 1: 90/3000 false positives; Judge 2: 48/2500. Does Judge 1 commit more? $\\alpha = 0.05$.",
      solution: "$\\hat{P} = 138/5500 = 0.0251$; SE = 0.00424; $z = (0.030 - 0.0192)/0.00424$ = **2.55** > 1.645 → **reject $H_0$** $(p = 0.005)$.",
    },
    {
      title: "Sports-car mileage (slides 51–57)",
      level: "From slides",
      question: "Claim 18580 km; suspicion: higher. $n = 10$, $\\bar{x} = 17352$, $s = 2012$. Test at 5% and 1%.",
      solution: "t = −1228/636.3 = **−1.93**, df 9. Right-tailed criticals: 1.833 (5%), 2.821 (1%). t is negative → **do not reject $H_0$** at either level $(p \\approx 0.96)$.\n⚠️ The slides use |t| and reject at 5%; that would be right only for $H_1$: $\\mu < 18580$ (then $p = 0.043$).",
    },
    {
      title: "Courier packets (slides 60–61)",
      level: "From slides",
      question: "$n_1 = 15$, $\\bar{x}_1 = 5.25$, $s_1^2 = 1.20$; $n_2 = 10$, $\\bar{x}_2 = 4.56$, $s_2^2 = 1.15$. Are beginning-of-month packets heavier (5%)? P-value and 95% CI.",
      solution: "$s_p = 1.0865$, SE = 0.4436, $t = 0.69/0.4436$ = **1.556**, df 23. One-tailed critical 1.714 → **do not reject $H_0$**; p = **0.067**. 95% CI: $0.69 \\pm 2.069 (0.4436)$ = **(−0.23, 1.61)**.\n⚠️ The slide uses 4.26 instead of 4.56 ($t = 2.233$, CI 0.073–1.907).",
    },
    {
      title: "Training program, paired (slides 63–65)",
      level: "From slides",
      question: "Before: 75, 70, 46, 68, 68, 43, 55, 68, 77. After: 70, 77, 57, 60, 79, 64, 55, 77, 76. Has the score improved (5%)?",
      solution: "$\\bar{d} = 5$, $s_d = 9.21$, $t = 1.629$, df **8**; critical 1.860 → **do not reject $H_0$** $(p = 0.071)$. 95% CI (−2.08, 12.08).\n(The slide uses df 9 / 1.833; same conclusion.)",
    },
    {
      title: "RTO accidents (slides 72–76)",
      level: "From slides",
      question: "Early hours: 80 fatal, 200 non-fatal; other: 19 fatal, 101 non-fatal. Association at 5%?",
      solution: "$E = 69.3$, 210.7, 29.7, 90.3; $\\chi^2$ = **7.318**, df 1 > 3.841 → **reject $H_0$**: associated.",
    },
    {
      title: "Smoking and hypertension (slides 77–80)",
      level: "From slides",
      question: "Yes: 21, 36, 30; No: 48, 26, 19 (non, moderate, heavy). Test independence at 5%.",
      solution: "$\\chi^2$ = **14.46**, df 2 > 5.99 → **reject $H_0$** $(p < 0.001)$.",
    },
    {
      title: "Telephone digits (slides 82–83)",
      level: "From slides",
      question: "Digits 0–9 observed: 1026, 1107, 997, 966, 1075, 933, 1107, 972, 964, 853 $(n = 10000)$. Uniform?",
      solution: "$E = 1000$; $\\chi^2$ = **58.542** > 16.919 (df 9) → **reject $H_0$**: not uniform. (Slide typos: “<” and 954 for digit 8.)",
    },
    {
      title: "Bus arrivals and the Poisson law (slides 84–85)",
      level: "From slides",
      question: "200 buses, $\\lambda = 2.96$; observed for 0, 1, 2, 3, 4, ≥5 arrivals: 10, 13, 45, 49, 32, 41. Poisson fit at $\\alpha = 0.01$?",
      solution: "$p_i = 0.0518$, 0.1534, 0.2270, 0.2240, 0.1657, 0.1781; $E_i = 200 p_i = 10.36$, 30.68, 45.40, 44.80, 33.15, 35.61.\n$\\chi^2 = 0.013 + 10.186 + 0.004 + 0.394 + 0.040 + 0.815$ = **11.45** (slide table: 11.75; slide text: 3.402).\ndf = $6 - 1 - 1 = 4$; critical 13.28 → **do not reject**: arrivals follow Poisson.",
    },
    {
      title: "Exercise 1: propellant burning rate (slide 86)",
      level: "From slides",
      question: "$\\mu_0 = 50$ cm/s, $\\sigma = 2$, $n = 25$, $\\bar{x} = 51.3$. Two-tailed test at 5%.",
      solution: "*Exercise solution prepared for the website.*\n$z = 1.3/(2/5)$ = **3.25** > 1.96 → **reject $H_0$**: the mean burning rate differs from 50 cm/s.",
    },
    {
      title: "Exercise 2: builder's 70% claim (slide 86)",
      level: "From slides",
      question: "Claim: 70% of new homes have the installation; sample 28 of 55. Test, give the P-value and a 95% CI.",
      solution: "*Exercise solution prepared for the website.*\n$\\hat{p} = 0.509$. $z = (0.509 - 0.7)/\\sqrt{0.21/55}$ = **−3.09** → |z| > 1.96 → **reject the claim**; P-value = **0.002**. 95% CI: $0.509 \\pm 1.96 \\sqrt{0.509 \\times 0.491/55}$ = **(0.377, 0.641)**, which excludes 0.70.\n(The stem says “solar water heaters” then “heat pumps”; the calculation is the same.)",
    },
    {
      title: "Exercise 3: brand A outsells B by 8%? (slide 87)",
      level: "From slides",
      question: "42 of 200 prefer A, 18 of 100 prefer B. Test $H_0$: $P_1 - P_2 = 0.08$ at 5%; 95% CI and P-value.",
      solution: "*Exercise solution prepared for the website.*\n$p_1 = 0.21$, $p_2 = 0.18$, difference 0.03. Pooled $p = 60/300 = 0.2$ (as in the hint): $\\text{SE} = \\sqrt{0.2 \\times 0.8 \\times(1/200 + 1/100)} = 0.049$.\n$z = (0.03 - 0.08)/0.049$ = **−1.02** → **do not reject**: the 8% claim is consistent with the data. P-value = **0.31**. CI: $0.03 \\pm 0.096$ = **(−0.066, 0.126)**, which contains 0.08.",
    },
    {
      title: "Exercise 4: health-club weight loss (slide 87)",
      level: "From slides",
      question: "Claim: average loss ≥ 7 kg. $n = 15$, $\\bar{x} = 6.26$, $s = 1.91$. Test at 1%; P-value.",
      solution: "*Exercise solution prepared for the website.*\n$H_0$: $\\mu \\ge 7$, $H_1$: $\\mu < 7$. t = −$0.74/(1.91/\\sqrt{15})$ = **−1.50**, df 14; critical −2.624 → **do not reject** the claim. P ≈ **0.078** (hint: ≈ 0.075).",
    },
    {
      title: "Exercise 5: radial vs belted tyres (slides 88–89)",
      level: "From slides",
      hint: "Same 12 cars on both tyre types: that's a paired design (df = 11, as in the hint).",
      question: "Radial: 4.2, 5.7, 2.6, 7.0, 6.7, 4.5, 5.7, 5.1, 7.4, 6.9, 6.1, 3.2. Belted: 4.3, 3.9, 5.2, 5.9, 5.8, 4.4, 4.7, 5.8, 5.9, 3.7, 4.9, 4.9. Do radials give better economy (5%)? P-value, 95% CI, inference.",
      solution: "*Exercise solution prepared for the website.*\n(i) Unpaired t assumptions: normal populations, independent random samples, equal unknown variances.\n(ii) The **same cars** were used, so the correct analysis is **paired** (df = $12 - 1 = 11$, matching the hint's df). d = radial − belted: $\\bar{d} = 0.475$, $s_d = 1.585$, $t = 0.475/(1.585/\\sqrt{12})$ = **1.04** < 1.796 → **do not reject $H_0$**.\n(iii) P ≈ **0.16**.\n(iv) 95% CI for $\\mu$_d: **(−0.53, 1.48)**.\n(v) No significant evidence that radials improve fuel economy.\n(If analysed as unpaired, $t = 0.95$ with df 22: same conclusion.)",
    },
    {
      title: "Exercise 6: impurity tests (slide 90)",
      level: "From slides",
      question: "Two procedures on 8 specimens (Test 1 lists 7 values: 1.6, 1.3, 1.7, 1.4, 1.5, 1.3, 1.2; Test 2: 1.9, 1.7, 2.1, 2.0, 1.3, 1.5, 1.7, 1.4). Same mean impurity at $\\alpha = 0.01$?",
      solution: "*Exercise solution prepared for the website.*\n⚠️ **The data are incomplete/ambiguous:** the stem says “three tests” but shows two, Test 1 has only 7 values for 8 specimens, and the hint's df = $(15 - 1) + (6 - 1) = 19$ doesn't match the table. A definitive answer isn't possible.\n**Illustration with the values shown** (unpaired t): means 1.429 and 1.700, t = −2.15, df 13; two-tailed 1% critical 3.012 → **do not reject $H_0$** at $\\alpha = 0.01$ $(p = 0.051)$.",
    },
    {
      title: "Exercise 7: two thermocouples (slide 91)",
      level: "From slides",
      question: "$n_1 = 15$, $\\bar{x}_1 = 315$, $s_1 = 3.8$; $n_2 = 10$, $\\bar{x}_2 = 303$, $s_2 = 4.9$. (a) 95% CI for $\\mu_1 - \\mu_2$, (b) test at 5%, (c) P-value.",
      solution: "*Exercise solution prepared for the website.*\n$s_p = \\sqrt{(14 \\times 14.44 + 9 \\times 24.01)/23} = 4.264$; $\\text{SE} = 4.264 \\sqrt{1/15 + 1/10} = 1.741$; df 23.\n(a) $12 \\pm 2.069 (1.741)$ = **(8.40, 15.60)**.\n(b) $t = 12/1.741$ = **6.89** > 2.069 → **reject $H_0$**: the means differ.\n(c) P < **0.001**.",
    },
    {
      title: "Exercise 8: Mendel's 9 : 3 : 3 : 1 (slide 91)",
      level: "From slides",
      question: "Of 160 flowers: MG 84, MR 35, RG 28, RR 13. Compatible with 9 : 3 : 3 : 1 at $\\alpha = 0.05$?",
      solution: "*Exercise solution prepared for the website.*\n$E = 90$, 30, 30, 10. $\\chi^2 = 36/90 + 25/30 + 4/30 + 9/10$ = **2.27**; df 3, critical 7.815 → **do not reject**: the data are compatible with Mendel's law.",
    },
    {
      title: "Exercise 9: diet program, paired (slide 92)",
      level: "From slides",
      question: "Before: 195, 213, 247, 201, 187, 210, 215, 246, 294, 310. After: 187, 195, 221, 190, 175, 197, 199, 221, 278, 285. Is the program effective (5%)?",
      solution: "*Exercise solution prepared for the website.*\nd = before − after: 8, 18, 26, 11, 12, 13, 16, 25, 16, 25; $\\bar{d} = 17$, $s_d = 6.41$.\n$H_1$: $\\mu$_d > 0. $t = 17/(6.41/\\sqrt{10})$ = **8.38**, df 9 > 1.833 → **reject $H_0$**: the program reduces weight $(p < 0.0001)$.",
    },
    {
      title: "Exercise 10: can χ² be applied? (slide 93)",
      level: "From slides",
      question: "Type 1: ≤10 days 42, >10 days 3; Type 2: 18, 7 $(n = 70)$. Can the $\\chi^2$ test be applied?",
      solution: "*Exercise solution prepared for the website.*\nExpected frequencies: Type 1: 38.57, **6.43**; Type 2: 21.43, **3.57**. One cell has $E < 5$ in a $2 \\times 2$ table, so per slide 68 the plain $\\chi^2$ test is **not appropriate**: use **Fisher's exact probabilities** (or Yates' correction). (For reference: Yates-corrected $\\chi^2 = 4.36$; Fisher's exact $p = 0.028$.)",
    },
    {
      title: "Exercise 11: pension plan vs job classification (slide 94)",
      level: "From slides",
      question: "Salaried: 166, 86, 68; hourly: 84, 64, 32 (plans 1, 2, 3). Association at 5%?",
      solution: "*Exercise solution prepared for the website.*\nE: salaried 160, 96, 64; hourly 90, 54, 36. $\\chi^2 = 0.225 + 1.042 + 0.25 + 0.4 + 1.852 + 0.444$ = **4.21**; df 2, critical 5.99 → **do not reject**: no evidence of association.",
    },
    {
      title: "Level 1: identify the tail",
      level: "Level 1",
      question: "Write $H_0$ and $H_1$ and name the tail: (a) “Our battery lasts at least 10 hours”; (b) “Average wait is 5 minutes”; (c) “The new drug lowers BP by more than 0”.",
      solution: "$(a) H_0$: $\\mu \\ge 10$ vs $H_1$: $\\mu$ below 10, so **left-tailed**. $(b) H_0$: $\\mu = 5$ vs $H_1$: $\\mu \\ne 5$, so **two-tailed**. $(c) H_0$: mean difference ≤ 0 vs $H_1$: mean difference above 0, so **right-tailed**.",
    },
    {
      title: "Level 1: single-mean z",
      level: "Level 1",
      question: "$\\mu_0 = 100$, $\\sigma = 15$, $n = 36$, $\\bar{x} = 104$. Two-tailed at 5%.",
      solution: "$z = 4/2.5$ = **1.6** < 1.96 → **do not reject $H_0$**.",
    },
    {
      title: "Level 2: proportion test",
      level: "Level 2",
      question: "A bank claims 40% of customers use its app. In a sample of 200, 90 do. Test at 5% (two-tailed).",
      solution: "$\\hat{p} = 0.45$; $z = 0.05/\\sqrt{0.24/200}$ = **1.44** < 1.96 → **do not reject**: consistent with 40%.",
    },
    {
      title: "Level 2: small-sample t",
      level: "Level 2",
      question: "$n = 16$, $\\bar{x} = 52$, $s = 6$. Test $H_0$: $\\mu = 50$ vs $H_1$: $\\mu > 50$ at 5%.",
      solution: "$t = 2/(6/4)$ = **1.33**, df 15, critical 1.753 → **do not reject $H_0$**.",
    },
    {
      title: "Level 2: a 2 × 2 χ²",
      level: "Level 2",
      question: "Online vs offline buyers by gender: Men 30 online, 20 offline; Women 20 online, 30 offline. Association at 5%?",
      solution: "All $E = 25$. $\\chi^2 = 4 \\times 25/25$ = **4.0** > 3.841 (df 1) → **reject $H_0$**: associated.",
    },
    {
      title: "Level 3: paired summary data",
      level: "Level 3",
      question: "16 employees' productivity before/after training: $\\bar{d} = 3$, $s_d = 4$. Did training help (5%)?",
      solution: "$t = 3/(4/4)$ = **3.0**, df 15 > 1.753 → **reject $H_0$**: training improved productivity.",
    },
    {
      title: "Level 3: is the die fair?",
      level: "Level 3",
      question: "A die rolled 60 times shows 1–6: 8, 12, 9, 11, 6, 14. Fair at 5%?",
      solution: "$E = 10$ each; $\\chi^2 = (4 + 4 + 1 + 1 + 16 + 16)/10$ = **4.2**; df 5, critical 11.07 → **do not reject**: consistent with a fair die.",
    },
    {
      title: "Level 3: which error?",
      level: "Level 3",
      question: "A quality team tests $H_0$: “the batch meets spec”. (a) They reject a good batch. (b) They accept a bad batch. Name each error and say how lowering $\\alpha$ affects them.",
      solution: "(a) Rejecting a true $H_0$ = **Type I** (probability $\\alpha$). (b) Not rejecting a false $H_0$ = **Type II** $(\\beta)$. Lowering $\\alpha$ makes (a) rarer but generally makes (b) more likely (power $1 - \\beta$ falls).",
    },
  ],

  theory: [
    {
      title: "Type I and Type II errors",
      level: "Level 1",
      question: "Define Type I and Type II errors, $\\alpha$ and power, using the decision table.",
      solution: "Type I: reject $H_0$ when it's true (probability $\\alpha$, the level of significance). Type II: fail to reject $H_0$ when it's false (probability $\\beta$). Power = $1 - \\beta$ = probability of correctly rejecting a false $H_0$. Correct decisions: not rejecting a true $H_0$ $(1 - \\alpha)$ and rejecting a false $H_0$ $(1 - \\beta)$ (slides 18–20).",
    },
    {
      title: "z-test vs t-test",
      level: "Level 2",
      question: "When should you use the z-test and when the t-test?",
      solution: "z: $\\sigma$ known or n large (≥ 30). t: $\\sigma$ unknown and n small (< 30), using s and df = $n - 1$. As n grows, t approaches z, so z is acceptable for large n even with $\\sigma$ unknown (slide 47).",
    },
    {
      title: "p-value decision rule",
      level: "Level 1",
      question: "Define the p-value and state the decision rule.",
      solution: "Assuming $H_0$ is true, the p-value is the probability of a test statistic as extreme as or more extreme than the observed one (in the direction of $H_1$). Reject $H_0$ if $p \\le \\alpha$; otherwise fail to reject (slides 21, 25).",
    },
    {
      title: "Assumptions of the unpaired t-test",
      level: "Level 2",
      question: "State the assumptions of Student's unpaired t-test.",
      solution: "Samples come from normal populations; population variances are unknown but equal; the two groups are independent; subjects are allocated randomly; typically $n < 30$ (for larger n it still applies, approaching z) (slide 58).",
    },
    {
      title: "Conditions for the χ² test",
      level: "Level 2",
      question: "State the conditions for applying the $\\chi^2$ test and what to do when they fail.",
      solution: "Apply $\\chi^2$ only to frequencies (not percentages or means), generally for nominal data, with $n \\ge 20$. If expected frequencies are < 5: use Yates' correction; for a $2 \\times 2$ table use Fisher's exact probabilities; for $r \\times c$, merge rows/columns meaningfully (slides 67–68).",
    },
  ],

  quiz: [
    {
      topic: "Basics",
      q: "“The mean sodium content is no more than 920 mg” is tested with…",
      options: ["$H_0$: $\\mu \\le 920$, $H_1$: $\\mu > 920$ (right-tailed)", "$H_0$: $\\mu = 920$, $H_1$: $\\mu \\ne 920$", "$H_0$: $\\mu > 920$, $H_1$: $\\mu \\le 920$", "$H_0$: $\\mu \\ge 920$, $H_1$: $\\mu < 920$"],
      answer: 0,
      why: "The claim (with equality) is $H_0$; the challenge is $\\mu > 920$.",
      wrong: [null, "The claim is one-sided.", "$H_0$ must contain the equality.", "That tests a different claim."],
    },
    {
      topic: "Basics",
      q: "Rejecting a true null hypothesis is a…",
      options: ["Type I error", "Type II error", "Correct decision", "Power"],
      answer: 0,
      why: "Its probability is $\\alpha$.",
      wrong: [null, "Type II = keeping a false $H_0$.", "It's an error.", "Power = rejecting a false $H_0$."],
    },
    {
      topic: "Basics",
      q: "p-value = 0.03, $\\alpha = 0.05$. Decision?",
      options: ["Reject $H_0$", "Fail to reject $H_0$", "Accept $H_1$ with certainty", "Need a larger $\\alpha$"],
      answer: 0,
      why: "$p \\le \\alpha$ → reject.",
      wrong: [null, "That's for $p > \\alpha$.", "Tests never give certainty.", "$\\alpha$ is fixed in advance."],
    },
    {
      topic: "z-tests",
      type: "num",
      q: "$\\bar{x} = 3.4$, $\\mu_0 = 3$, $\\sigma = 1.2$, $n = 50$. z? (2 decimals)",
      answer: 2.36,
      tol: 0.01,
      why: "$0.4/(1.2/\\sqrt{50})$.",
    },
    {
      topic: "z-tests",
      type: "num",
      q: "Taxi tyres: difference 3150, $\\text{SE} = \\sqrt{5000^2/30 + 6100^2/40}$. z? (2 decimals)",
      answer: 2.37,
      tol: 0.01,
      why: "3150/1328 (slides round to 2.30).",
    },
    {
      topic: "z-tests",
      type: "num",
      q: "18 of 20 survive; $H_0$: $P = 0.85$. z? (2 decimals)",
      answer: 0.63,
      tol: 0.01,
      why: "$0.05/\\sqrt{0.85 \\times 0.15/20}$.",
    },
    {
      topic: "z-tests",
      type: "num",
      q: "Critical z for a two-tailed test at $\\alpha = 0.01$? (2 decimals)",
      answer: 2.58,
      tol: 0.01,
      why: "$\\alpha/2 = 0.005$ → 2.58.",
    },
    {
      topic: "t-tests",
      type: "num",
      q: "Paired: $\\bar{d} = 5$, $s_d = 9.21$, $n = 9$. t? (3 decimals)",
      answer: 1.629,
      tol: 0.005,
      why: "5/(9.21/3).",
    },
    {
      topic: "t-tests",
      type: "num",
      q: "Degrees of freedom for a pooled t-test with $n_1 = 15$, $n_2 = 10$?",
      answer: 23,
      tol: 0.01,
      why: "$n_1 + n_2 - 2$.",
    },
    {
      topic: "t-tests",
      q: "Before/after scores on the same trainees should be analysed with…",
      options: ["Unpaired t-test", "Paired t-test", "$\\chi^2$ test", "z-test for proportions"],
      answer: 1,
      why: "Matched observations → test the differences.",
      wrong: ["The samples aren't independent.", null, "Scores aren't category counts.", "Not proportions."],
    },
    {
      topic: "t-tests",
      q: "$H_1$: $\\mu > 18580$ and t = −1.93 (critical 1.833). Correct decision?",
      options: ["Reject $H_0$ because |t| > 1.833", "Do not reject $H_0$: t is on the wrong side", "Reject $H_1$ and accept that $\\mu < 18580$", "Use a two-tailed test instead"],
      answer: 1,
      why: "A right-tailed test rejects only for large positive t.",
      wrong: ["|t| ignores the direction of $H_1$. This is the slide's slip.", null, "Failing to reject $H_0$ doesn't prove $\\mu < 18580$.", "The tail must be fixed before seeing the data."],
    },
    {
      topic: "χ² tests",
      type: "num",
      q: "$2 \\times 2$ table: row 280, column 99, $n = 400$. Expected frequency? (1 decimal)",
      answer: 69.3,
      tol: 0.05,
      why: "$280 \\times 99/400$.",
    },
    {
      topic: "χ² tests",
      type: "num",
      q: "df for $a \\chi^2$ independence test on a $2 \\times 3$ table?",
      answer: 2,
      tol: 0.01,
      why: "$(2 - 1) (3 - 1)$.",
    },
    {
      topic: "χ² tests",
      q: "In a $2 \\times 2$ table one expected frequency is 3.57. You should…",
      options: ["Proceed with ordinary $\\chi^2$", "Use Fisher's exact probabilities (or Yates' correction)", "Convert to percentages", "Use a paired t-test"],
      answer: 1,
      why: "Slide 68: expected < 5 in a $2 \\times 2$ table.",
      wrong: ["Small expected counts make $\\chi^2$ unreliable.", null, "$\\chi^2$ must use counts.", "Not a t-test situation."],
    },
    {
      topic: "χ² tests",
      type: "num",
      q: "Mendel 9:3:3:1 with $O = 84$, 35, 28, 13 $(n = 160)$. $\\chi^2$? (2 decimals)",
      answer: 2.27,
      tol: 0.01,
      why: "$E = 90$, 30, 30, 10.",
    },
  ],
};
