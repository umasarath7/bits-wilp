// ISM — Lecture 10 (CS-10): Maximum likelihood estimation, F-test for variances, one-way and two-way ANOVA
// Source: CourseFiles/ISM/Lec10.pdf (73 pages). Every topic cites its slides; nothing outside the deck is taught.

export default {
  title: "Maximum Likelihood, the F-test & ANOVA",
  source: "Lec10.pdf (CS-10) · 73 pages",
  quizMode: "step",
  overview:
    "Two final tools. **Maximum likelihood estimation (MLE)** answers: which parameter value makes the data we actually saw *most likely*? For ten helmets with three flawed, the answer is $p = 0.3$. The same recipe (write the likelihood, take logs, differentiate, set to zero) gives the familiar estimators: $\\bar x$ for Poisson and normal means, k/n for a binomial proportion. Then we compare **more than two means at once**. The **F-test** compares two variances (is one process more variable?), and **ANOVA** splits total variation into *between-groups* and *within-groups* parts. If the between-group variation is large relative to the within-group noise ($F = \\text{MSTR}/\\text{MSE}$ beyond the F table value), the group means differ. One-way ANOVA handles one factor; two-way ANOVA adds a **block** factor to soak up extra variation.",

  simpleIntro: "Three tools in one lecture. **Maximum likelihood (MLE)** picks the parameter value that makes your data most likely. The **F-test** asks whether one process is more *variable* than another. **ANOVA** asks whether three or more groups have the same *mean*, by comparing how far apart the groups are with how scattered each group is. All examples are the lecturer's own.",

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
              "title": "Maximum likelihood (MLE)",
              "text": "Try every possible parameter value; keep the one under which the **observed data is most probable**.",
              "tag": "Estimating a parameter",
              "example": "3 of 10 helmets flawed → best guess p = 0.3",
              "figure": "i10-lik"
            },
            {
              "title": "F-test",
              "text": "Divide the bigger sample variance by the smaller. Far above 1 → the variances really differ.",
              "tag": "Comparing spread",
              "example": "Is a new chemical process less variable?"
            },
            {
              "title": "ANOVA",
              "text": "Are 3+ group means equal? Compare the spread **between** group means with the spread **within** groups.",
              "tag": "Comparing 3+ means",
              "example": "Do three teaching methods give the same average score?",
              "figure": "i10-anova"
            }
          ]
        }
      ]
    },
    {
      "id": "s-mle",
      "heading": "2. Maximum likelihood: the most believable parameter",
      "slides": "3–21",
      "blocks": [
        {
          "type": "p",
          "text": "Detective thinking: you have the evidence (data) and several suspects (parameter values). The **likelihood** $L(\\theta)$ asks, for each suspect, “how probable is this evidence if *you* did it?” The **MLE** $\\hat\\theta$ is the suspect who makes the evidence most probable."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Recipe",
          "text": "1. Write the likelihood: $L(\\theta) = \\prod f(x_i \\mid \\theta)$ (multiply the probabilities of each observation).\n2. Take logs: $\\ln L = \\sum \\ln f(x_i \\mid \\theta)$ (products become sums: easier).\n3. Differentiate, set to 0, solve for $\\theta$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 6–11): bike helmets",
          "text": "10 helmets are inspected; 3 are flawed. What is the MLE of $p$, the probability a helmet is flawed?\n\n**1.** $L(p) = p^3(1 - p)^7$ (3 flawed, 7 fine).\n**2.** $\\ln L = 3\\ln p + 7\\ln(1 - p)$.\n**3.** $\\frac{3}{p} - \\frac{7}{1 - p} = 0 \\Rightarrow 3(1 - p) = 7p \\Rightarrow p = 0.3$."
        },
        {
          "type": "answer",
          "value": "p̂ = 0.3",
          "text": "The data are most likely when p = 0.3 ($L = 0.00222$, higher than at $p = 0.25$ (0.00209) or $p = 0.5$ (0.00098)). It is simply the sample proportion, 3/10."
        },
        {
          "type": "table",
          "head": [
            "Distribution",
            "MLE"
          ],
          "rows": [
            [
              "Bernoulli / binomial",
              "$\\hat p = \\frac{\\text{successes}}{n}$"
            ],
            [
              "Poisson",
              "$\\hat\\lambda = \\bar x$"
            ],
            [
              "Exponential",
              "$\\hat\\lambda = 1/\\bar x$"
            ],
            [
              "Normal",
              "$\\hat\\mu = \\bar x$, $\\hat\\sigma^2 = \\frac{\\sum(x - \\bar x)^2}{n}$ (divides by n, so slightly biased)"
            ]
          ],
          "caption": "The answers you'll keep getting: learn these and skip the calculus"
        },
        {
          "type": "check",
          "q": "Daily defective counts: 7, 3, 1, 2, 4, 1, 2, 3, 1, 2 (Poisson). MLE of λ?",
          "options": [
            "2",
            "2.6",
            "3",
            "26"
          ],
          "answer": 1,
          "why": "Poisson MLE = sample mean = 26/10 = 2.6 (lecturer's Practice Problem 1)."
        }
      ]
    },
    {
      "id": "s-f",
      "heading": "3. F-test: which process is more variable?",
      "slides": "22–29",
      "blocks": [
        {
          "type": "p",
          "text": "Two machines make bolts with the same average length, but one may be more **erratic**. Compare their variances with a ratio: if the spreads were equal, the ratio would be close to 1."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Formula",
          "text": "$$F = \\frac{s_1^2}{s_2^2} \\quad (\\text{larger variance on top}), \\qquad df = (n_1 - 1,\\ n_2 - 1)$$ Reject $H_0: \\sigma_1^2 = \\sigma_2^2$ if F exceeds the table value."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 26–27): chemical impurities",
          "text": "Original process: $n = 25$, $s^2 = 1.04$. New process: $n = 25$, $s^2 = 0.51$. Is the new process less variable (5%)?\n\n$F = \\frac{1.04}{0.51} = 2.04$; critical $F_{0.05}(24, 24) = 1.98$."
        },
        {
          "type": "answer",
          "value": "Reject H₀ (2.04 > 1.98)",
          "text": "The new process has significantly less variability."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Square the SDs!",
          "text": "If the question gives **standard deviations** ($s = 5.1$, $4.7$), square them first: $F = 26.01/22.09 = 1.18$, not $5.1/4.7$."
        }
      ]
    },
    {
      "id": "s-anova",
      "heading": "4. One-way ANOVA: are 3 or more means equal?",
      "slides": "30–50",
      "blocks": [
        {
          "type": "p",
          "text": "Why not many t-tests? With 3 groups you'd need 3 tests, and each one adds a chance of a false alarm. ANOVA does it in **one** test."
        },
        {
          "type": "p",
          "text": "**The idea in one picture:** if the group averages sit far apart **compared with** how scattered the values are inside each group, the true means probably differ."
        },
        {
          "type": "diagram",
          "name": "i10-anova"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The ANOVA recipe (k groups, n values in total)",
          "text": "- $CF = G^2/n$ ($G$ = grand total)\n- $SST = \\sum x^2 - CF$ (total variation)\n- $SSTR = \\sum \\frac{C_j^2}{n_j} - CF$ (**between** groups; $C_j$ = group total)\n- $SSE = SST - SSTR$ (**within** groups)\n$$F = \\frac{MSTR}{MSE} = \\frac{SSTR/(k - 1)}{SSE/(n - k)}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 42–46): three groups",
          "text": "Group 1: 8, 10, 7, 14, 11 (mean 10). Group 2: 7, 5, 10, 9, 9 (mean 8). Group 3: 12, 9, 13, 12, 14 (mean 12). Grand mean 10.\n\n**Between:** $SSTR = 5[(10 - 10)^2 + (8 - 10)^2 + (12 - 10)^2] = 40$, df 2 → $MSTR = 20$.\n**Within:** $SSE = 60$ (squared distances from each group's own mean), df 12 → $MSE = 5$.\n$F = 20/5 = 4.0$; critical $F_{0.05}(2, 12) = 3.89$."
        },
        {
          "type": "answer",
          "value": "Reject H₀ (4.0 > 3.89)",
          "text": "At least two of the group means differ. (ANOVA doesn't say *which* ones.)"
        },
        {
          "type": "check",
          "q": "4 groups, 40 observations in total. Degrees of freedom for F?",
          "options": [
            "(4, 40)",
            "(3, 36)",
            "(3, 39)",
            "(4, 36)"
          ],
          "answer": 1,
          "why": "Between $k - 1 = 3$; within $n - k = 36$."
        }
      ]
    },
    {
      "id": "s-anova2",
      "heading": "5. Two-way ANOVA: two factors at once",
      "slides": "51–64",
      "blocks": [
        {
          "type": "p",
          "text": "Sometimes a second factor (a **block**: different plots of land, different study times) also affects the result. Two-way ANOVA splits the total variation into **treatments + blocks + error**, then tests each factor against the error."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Extra piece",
          "text": "$$SSBL = \\sum \\frac{R_i^2}{k} - CF \\qquad SSE = SST - SSTR - SSBL \\qquad \\text{error df} = (k - 1)(m - 1)$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example: fertilizers and plots",
          "text": "3 fertilizers (blocks) × 4 plots (treatments), $G = 84$, $n = 12$: $CF = 588$, $SST = 36$. Each factor gets its own F-ratio against MSE; see 📊 Slides for the full table."
        }
      ]
    },
    {
      "id": "s-compare",
      "heading": "6. Quick comparison table",
      "slides": "",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Tool",
            "Question",
            "Statistic",
            "Decision"
          ],
          "rows": [
            [
              "MLE",
              "Best estimate of a parameter?",
              "maximise $\\ln L(\\theta)$",
              "the $\\hat\\theta$ itself"
            ],
            [
              "F-test",
              "Are two variances equal?",
              "$F = s_1^2/s_2^2$ (larger on top)",
              "reject if F > table $F(n_1 - 1, n_2 - 1)$"
            ],
            [
              "One-way ANOVA",
              "Are 3+ means equal?",
              "$F = MSTR/MSE$",
              "reject if F > $F(k - 1, n - k)$"
            ],
            [
              "Two-way ANOVA",
              "Effects of 2 factors?",
              "one F per factor",
              "each vs $F(\\cdot, (k - 1)(m - 1))$"
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
          "q": "The MLE of the mean of a normal distribution is…",
          "options": [
            "the median",
            "x̄",
            "x̄ with n − 1",
            "the mode"
          ],
          "answer": 1,
          "why": "$\\hat\\mu = \\bar x$."
        },
        {
          "type": "check",
          "q": "s₁ = 6, s₂ = 4. The F statistic is…",
          "options": [
            "1.5",
            "2.25",
            "0.44",
            "10"
          ],
          "answer": 1,
          "why": "Square first: 36/16 = 2.25."
        },
        {
          "type": "check",
          "q": "ANOVA gives F = 1.2 with critical value 3.5. Conclusion?",
          "options": [
            "All means differ",
            "At least two means differ",
            "No evidence the means differ",
            "Variances differ"
          ],
          "answer": 2,
          "why": "F below the critical value → don't reject $H_0$."
        },
        {
          "type": "check",
          "q": "Which compares the between-group variation with the within-group variation?",
          "options": [
            "t-test",
            "χ² test",
            "ANOVA F",
            "MLE"
          ],
          "answer": 2,
          "why": "That ratio is exactly ANOVA's F = MSTR/MSE."
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
          "text": "- **MLE:** likelihood → log → derivative = 0. Shortcuts: $\\hat p$ = k/n, Poisson $\\bar x$, exponential $1/\\bar x$, normal $\\bar x$ and $\\sum(x - \\bar x)^2/n$.\n- **F-test:** $F = s_1^2/s_2^2$ with the **larger variance on top**; square SDs first; df $(n_1 - 1, n_2 - 1)$.\n- **ANOVA:** CF, SST, SSTR, SSE → $F = \\frac{SSTR/(k - 1)}{SSE/(n - k)}$. Reject → *at least two* means differ.\n- **Two-way:** also subtract SSBL; error df $(k - 1)(m - 1)$."
        }
      ]
    }
  ],

  summary: [
    {
      id: "mle",
      heading: "Lesson 1: Which parameter makes the data most likely? Maximum likelihood",
      slides: "3–15",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A general method for estimating parameters: maximise the likelihood of the observed sample.",
        },
        {
          type: "p",
          text: "**Estimation (slide 4)** finds unknown population parameters from sample statistics. A good estimator is **unbiased, consistent, efficient and sufficient**. MLE, introduced by **R. A. Fisher** in the 1920s (slide 3), is the most popular method: recommended especially for large samples because its estimators have desirable efficiency properties. It requires a **distributional assumption** first.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Likelihood and MLE (slides 12–14)",
          text: "For i.i.d. $x_1, \\dots, x_n$ from $f(x \\mid \\theta)$:\n$$L(\\theta) = f(x_1, \\dots, x_n \\mid \\theta) = \\prod_{i=1}^{n} f(x_i \\mid \\theta), \\qquad \\log L(\\theta) = \\sum_{i=1}^{n} \\log f(x_i \\mid \\theta)$$\nThe MLE $\\hat\\theta$ is the value of $\\theta$ that maximises $L(\\theta)$, found by solving $\\frac{d \\log L}{d\\theta} = 0$. Logs turn the product into a sum, and maximising log L is the same as maximising L. If L isn't differentiable, maximise directly (e.g. using order statistics) (slide 15).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: bike helmets (slides 6–11)",
          text: "10 helmets; the 1st, 3rd and 10th are flawed. Let $X_i = 1$ if flawed (Bernoulli, $p^x(1-p)^{1-x}$). Independence → likelihood\n$$L(p) = p^3(1 - p)^7$$\n$p = 0.25$ gives $(0.25)^3(0.75)^7 = 0.002086$; $p = 0.50$ gives $0.5^{10} = 0.000977$. Which p maximises it?\n\n$\\ln L = 3\\ln p + 7\\ln(1 - p)$; $\\frac{d}{dp}: \\frac{3}{p} - \\frac{7}{1 - p} = 0 \\Rightarrow 3(1 - p) = 7p \\Rightarrow p = 0.30$, the sample proportion.\n\nIf we only knew “3 of 10 flawed”, the binomial likelihood $^{10}C_3 p^3(1-p)^7$ has the same maximiser: the constant $^{10}C_3$ doesn't matter.",
        },
        { type: "diagram", name: "i10-lik" },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Likelihood = joint pmf/pdf of the data, viewed as a function of $\\theta$. Log, differentiate, set to 0, solve.",
        },
      ],
    },
    {
      id: "mles",
      heading: "Lesson 2: MLEs for the standard distributions",
      slides: "16–21, 65–66",
      blocks: [
        {
          type: "table",
          caption: "The MLEs (slide 21)",
          head: ["Distribution", "Parameter", "MLE", "Derivation (slides)"],
          rows: [
            ["Bernoulli", "p", "$\\hat p = \\frac{\\sum x_i}{n} = \\bar X$", "helmet example"],
            ["Binomial (k successes in n)", "$\\theta = p$", "$\\hat\\theta = \\frac{k}{n}$", "$\\frac{k}{\\theta} - \\frac{n-k}{1-\\theta} = 0$ (slide 16)"],
            ["Poisson", "$\\mu$ $(\\lambda)$", "$\\hat\\lambda = \\frac{\\sum x_i}{n} = \\bar X$", "$\\ell = -n\\mu + n\\bar X\\log\\mu$, $\\ell' = -n + \\frac{n\\bar X}{\\mu} = 0$ (slides 17–18)"],
            ["Exponential", "$\\lambda$", "$\\hat\\lambda = 1/\\bar X$", "slide 21"],
            ["Normal", "$\\mu$, $\\sigma^2$", "$\\hat\\mu = \\bar X$, $\\hat\\sigma^2 = \\frac{\\sum(x_i - \\bar X)^2}{n}$", "partial derivatives of ln f (slides 19–20)"],
          ],
        },
        {
          type: "p",
          text: "**Poisson details (slides 17–18):** $L(\\mu) = \\prod \\frac{e^{-\\mu}\\mu^{x_i}}{x_i!}$. The factorials don't involve $\\mu$, so they drop out of the maximisation: $L(\\mu) \\propto e^{-n\\mu}\\mu^{n\\bar X}$. Here the MLE equals the moment estimator $\\bar X$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Note: the normal σ̂² is biased (slide 20)",
          text: "The MLE $\\hat\\sigma^2$ divides by **n**, not $n - 1$, so it is **not** unbiased: two principles (unbiasedness and maximum likelihood) give two different estimators. Compare Lecture 1, where the sample variance divides by $n - 1$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Practice Problem 1 (slide 65), hard drives",
          text: "Daily defective counts (Poisson): 7, 3, 1, 2, 4, 1, 2, 3, 1, 2. $\\hat\\lambda = \\bar X = 26/10 = 2.6$.\n\nBy the invariance of MLEs, the MLE of P(0 or 1 defectives) plugs in $\\hat\\lambda$: $e^{-2.6}(1 + 2.6) = 0.2674$.",
        },
        {
          type: "p",
          text: "**Practice Problem 2 (slide 66):** sample 0, 1, 0, 0, 1, 0 with $P(X = 0) = 1 - p$, $P(X = 1) = p$. $L(p) = (1-p)^3p^2$; $\\log L = 3\\log(1 - p) + 2\\log p$; $-\\frac{3}{1-p} + \\frac{2}{p} = 0 \\Rightarrow p = 1/3$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): interpreting p̂ = 1/3",
          text: "Slide 66 says “there is 1/3 chance to observe this sample”. That's not what the MLE means. $\\hat p = 1/3$ is the value of p under which this sample is **most likely**; the probability of the sample at that p is $L(1/3) = (2/3)^3(1/3)^2 = 0.033$.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Bernoulli/binomial: k/n. Poisson: $\\bar{x}$. Exponential: $1/\\bar{x}$. Normal: $\\bar{x}$ and $\\sum(x - \\bar{x})^2/n$.",
        },
      ],
    },
    {
      id: "ftest",
      heading: "Lesson 3: Is one process more variable? The F-test for two variances",
      slides: "22–29",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "F-test (slides 23–25)",
          text: "$$F = \\frac{s_1^2}{s_2^2}, \\quad s_1^2 = \\text{the larger sample variance}, \\quad df = (n_1 - 1, n_2 - 1)$$\n$H_0$: $\\sigma_1^2 = \\sigma_2^2$ vs $H_1$: $\\sigma_1^2 > \\sigma_2^2$ (upper tail), < (lower tail) or ≠ (two-tail, use $\\alpha/2$). **Assumes** two independent, normally distributed populations. Reject $H_0$ if F > $F_{\\alpha}(n_1 - 1, n_2 - 1)$ (or $F_{\\alpha/2}$ for two-tailed).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: chemical impurities (slides 26–27)",
          text: "Original process: $n = 25$, $s^2 = 1.04$. New process: $n = 25$, $s^2 = 0.51$. Is the new process less variable (5%)?\n\n$H_0$: $\\sigma_1^2 = \\sigma_2^2$, $H_1$: $\\sigma_1^2 > \\sigma_2^2$. $F = \\frac{1.04}{0.51} = 2.04$. Critical $F_{0.05}(24, 24) = 1.98$.\n\n2.04 > 1.98 → **reject $H_0$**: the new process has less variability.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: impeller grinding (slides 28–29)",
          text: "Process 1: $n_1 = 12$, $s_1 = 5.1$; process 2: $n_2 = 15$, $s_2 = 4.7$. Does process 1 vary more?\n\nSquare the SDs first! $F = \\frac{5.1^2}{4.7^2} = \\frac{26.01}{22.09} = 1.18$. Critical $F_{0.05}(11, 14) \\approx 2.53$ (slide; tables give 2.57).\n\n1.18 < 2.53 → **do not reject $H_0$**: no evidence process 1 is more variable.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Dividing **standard deviations** instead of variances.\n- Putting the smaller variance on top (then $F < 1$ and never exceeds the upper critical value).\n- Swapping the df order: $F(11, 14) \\ne F(14, 11)$. Numerator df comes first.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "F = larger $s^2$ / smaller $s^2$, df $(n_1 - 1, n_2 - 1)$. Reject if F > table value.",
        },
      ],
    },
    {
      id: "oneway",
      heading: "Lesson 4: Comparing three or more means: one-way ANOVA",
      slides: "30–50",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to test whether $k \\ge 3$ population means are equal using **one** test instead of many t-tests, by comparing variation between groups with variation within groups.",
        },
        {
          type: "p",
          text: "**Hypotheses (slide 32):** $H_0$: $\\mu_1 = \\mu_2$ = … = $\\mu$_k; $H_1$: not all means are equal. Rejecting $H_0$ means **at least two** means differ, not that all differ. **Assumptions (slide 33):** the response is normally distributed in each population, with the **same variance $\\sigma^2$**, and observations are **independent**. Types (slide 31): one-way, two-way, three-way (LSD), repeated-measures; this course covers one- and two-way.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "One-way ANOVA (slides 37–41, 45)",
          text: "$$SSTR = \\sum_j n_j(\\bar x_j - \\bar x)^2, \\quad MSTR = \\frac{SSTR}{k - 1} \\quad \\text{(between treatments)}$$\n$$SSE = \\sum_j (n_j - 1)s_j^2, \\quad MSE = \\frac{SSE}{n_T - k} \\quad \\text{(within treatments)}$$\n$$F = \\frac{MSTR}{MSE} \\sim F(k - 1, n_T - k), \\qquad SST = SSTR + SSE$$\n**Shortcut with the correction factor:** $CF = G^2/n$ (G = grand total); $SST = \\sum\\sum x_{ij}^2 - CF$; $SSTR = \\sum \\frac{C_i^2}{n_i} - CF$ ($C_i$ = treatment totals); $SSE = SST - SSTR$.",
        },
        {
          type: "table",
          caption: "ANOVA table layout (slide 40)",
          head: ["Source", "Sum of squares", "df", "Mean square", "F"],
          rows: [
            ["Treatments (between)", "SSTR", "$k - 1$", "$\\text{MSTR} = \\text{SSTR}/(k - 1)$", "MSTR/MSE"],
            ["Error (within)", "SSE", "$n - k$", "$\\text{MSE} = \\text{SSE}/(n - k)$", ""],
            ["Total", "SST", "$n - 1$", "", ""],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: three groups (slides 42–46)",
          text: "Group 1: 8, 10, 7, 14, 11 (total 50, mean 10). Group 2: 7, 5, 10, 9, 9 (40, mean 8). Group 3: 12, 9, 13, 12, 14 (60, mean 12). $G = 150$, $n = 15$, grand mean 10.\n\n**Method 1:** SSTR = 5[$(10 - 10)^2 + (8 - 10)^2 + (12 - 10)^2$] = 40; SSE = sum of squared deviations from each group's own mean = 60; SST = 100.\n**Method 2 (CF):** $\\text{CF} = 150^2/15 = 1500$; $\\text{SST} = 1600 - 1500 = 100$; $\\text{SSTR} = (50^2 + 40^2 + 60^2)/5 - 1500 = 40$; SSE = 60.\n\nMSTR = 40/2 = 20, MSE = 60/12 = 5, **F = 4** > $F_0$.₀₅(2, 12) = 3.89 → **reject $H_0$**: the means differ.",
        },
        { type: "diagram", name: "i10-anova" },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: iron intake, 4 groups × 10 patients (slides 47–49)",
          text: "Group totals 195.5, 208, 215, 272.5 (means 19.55, 20.8, 21.5, 27.25); $G = 891$, $n = 40$.\n\n$\\text{CF} = 891^2/40 = 19847.03$; $\\text{SST} = 21119.5 - 19847.03 = 1272.47$; $\\text{SSTR} = 20196.55 - 19847.03 = 349.52$; SSE = 922.95.\n\nMSTR = 349.52/3 = 116.51; MSE = 922.95/36 = 25.64; **F = 4.54** > $F_0$.₀₅(3, 36) = 2.87 → **reject $H_0$**. Group 4's higher mean drives the difference.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide checks (flagged): iron intake",
          text: "Slide 48 writes G = **981**; the data (and the slide's own $\\text{CF} = 19847.03 = 891^2/40$) give **G = 891**. Slide 49 reports $F = 4.455$; 116.51/25.64 = **4.544**. It also quotes $F(0.05; 3, 36)$ = **4.38**; the table value is about **2.87**. The decision (reject $H_0$) is unchanged. (Slide 46 also writes $F = \\text{SSTR}/\\text{SSE}$; it's MSTR/MSE = 20/5 = 4.)",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Using SSTR/SSE instead of MSTR/MSE.\n- Wrong df: between $k - 1$, within $n - k$ (n = total observations).\n- Concluding “all means differ” after rejecting $H_0$. Only “at least two differ”.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$\\text{CF} = G^2/n$ · $\\text{SST} = \\sum x^2 - \\text{CF}$ · $\\text{SSTR} = \\sum C_i^2/n_i - \\text{CF}$ · $\\text{SSE} = \\text{SST} - \\text{SSTR}$ · $F = [\\text{SSTR}/(k - 1)]/[\\text{SSE}/(n - k)]$.",
        },
      ],
    },
    {
      id: "twoway",
      heading: "Lesson 5: Controlling for a second factor: two-way ANOVA",
      slides: "51–64",
      blocks: [
        {
          type: "p",
          text: "**Why add blocks? (slide 52)** Two-way ANOVA compares a study variable over three or more groups (**treatments**) while controlling for another variable (**blocks**). Removing the block variation from the error makes the test **considerably more accurate** than one-way ANOVA.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Two-way ANOVA, one observation per cell (slides 54–57)",
          text: "k treatments (columns), m blocks (rows), n = km.\n$$CF = \\frac{G^2}{n}, \\quad SST = \\sum\\sum x_{ij}^2 - CF$$\n$$SSTR = \\sum \\frac{C_i^2}{m} - CF, \\quad SSBL = \\sum \\frac{R_j^2}{k} - CF, \\quad SSE = SST - SSTR - SSBL$$\n| Source | SS | df | MS | F |\n|---|---|---|---|---|\n| Treatments | SSTR | $k - 1$ | $\\text{SSTR}/(k - 1)$ | MSTR/MSE |\n| Blocks | SSBL | $m - 1$ | $\\text{SSBL}/(m - 1)$ | MSBL/MSE |\n| Error | SSE | $(k - 1) (m - 1)$ | $\\text{SSE}/[(k - 1) (m - 1)]$ | |\n| Total | SST | $n - 1$ | | |\n\nTwo pairs of hypotheses: $H_{01}$ no treatment differences, $H_{02}$ no block differences.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: fertilizers and plots (slides 58–60)",
          text: "Rows (blocks, fertilizers): Nitrogen 6, 4, 8, 6; Potash 7, 6, 6, 9; Phosphate 8, 5, 10, 9. Columns (treatments, plots A–D) totals 21, 15, 24, 24; row totals 24, 28, 32; $G = 84$, $n = 12$.\n\n$\\text{CF} = 84^2/12 = 588$; $\\text{SST} = 624 - 588 = 36$; $\\text{SSTR} = (21^2 + 15^2 + 24^2 + 24^2)/3 - 588 = 18$; $\\text{SSBL} = (24^2 + 28^2 + 32^2)/4 - 588 = 8$; SSE = 10.\n\nMSTR = 6, MSBL = 4, MSE = 10/6 = 1.67. F(plots) = $3.6 < F_0$.₀₅(3, 6) = 4.76; F(fertilizers) = $2.4 < F_0$.₀₅(2, 6) = 5.14 → **neither factor is significant**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: teaching method × study time (slides 61–64)",
          text: "The slides average the three scores in each cell, then run two-way ANOVA on the $3 \\times 2$ table of means: Traditional 65 / 71, Online 57.67 / 67.33, Hybrid 64 / 72.33 (< 2 h / > 2 h). $G = 397.33$, $n = 6$.\n\nCF = 26311.85; SST = 140.94; SSTR (method) = 41.58; SSBL (time) = 95.92; SSE = 3.44; MSE = 1.72.\n\nF(method) = $20.79/1.72 = 12.08 < F_0$.₀₅(2, 2) = 19.00 → method **not significant**. F(time) = $95.92/1.72 = 55.8 > F_0$.₀₅(1, 2) = 18.51 → study time **is significant**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Two-way: SST = SSTR + SSBL + SSE; error df $(k - 1) (m - 1)$; one F per factor, both against MSE.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Lec10 on one screen",
      head: ["Tool", "Key formula"],
      rows: [
        ["MLE", "maximise $\\log L(\\theta) = \\sum \\log f(x_i \\mid \\theta)$"],
        ["MLEs", "Bernoulli/binomial k/n · Poisson $\\bar{x}$ · Exponential $1/\\bar{x}$ · Normal $\\bar{x}$, $\\sum(x - \\bar{x})^2/n$"],
        ["F-test", "$F = s_1^2/s_2^2$ (larger on top), df $(n_1 - 1, n_2 - 1)$"],
        ["One-way ANOVA", "$F = \\text{MSTR}/\\text{MSE}$, df $(k - 1, n - k)$"],
        ["Two-way ANOVA", "$F_{\\text{TR}} = \\text{MSTR}/\\text{MSE}$, $F_{\\text{BL}} = \\text{MSBL}/\\text{MSE}$, error df $(k - 1) (m - 1)$"],
        ["Shortcut", "$\\text{CF} = G^2/n$; SS = Σ(total²/count) − CF"],
      ],
    },
    { type: "diagram", name: "i10-anova" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Square SDs for F · larger variance on top · always draw the ANOVA table · df: $k - 1$, $n - k$ (one-way); $(k - 1) (m - 1)$ error (two-way).",
    },
  ],

  glossary: [
    ["MLE", "Maximum likelihood estimation / estimator", "Parameter value that maximises the likelihood of the data"],
    ["Likelihood $L(\\theta)$", "", "Joint pmf/pdf of the sample viewed as a function of $\\theta$"],
    ["i.i.d.", "Independent and identically distributed", "Each observation independent, from the same distribution"],
    ["Unbiased / consistent / efficient / sufficient", "", "Properties of a good estimator"],
    ["F-test", "Fisher's F-test", "Test of the ratio of two variances"],
    ["ANOVA", "Analysis of variance", "Tests equality of 3+ means by partitioning variation"],
    ["SST, SSTR, SSE", "Total / treatment / error sums of squares", "SST = SSTR + SSE"],
    ["MSTR, MSE", "Mean square for treatments / error", "SS divided by its df"],
    ["SSBL, MSBL", "Block sum of squares / mean square", "Variation due to the block factor (two-way)"],
    ["CF", "Correction factor", "$G^2/n$, used in shortcut sums of squares"],
    ["Treatment / block", "", "Factor of interest / control factor in two-way ANOVA"],
  ],

  examTips: [
    "For MLE questions: write $L(\\theta)$, take logs, differentiate, set to zero, solve, and state the MLE in words.",
    "In ANOVA, compute CF first and keep 2–3 decimals throughout. Rounding errors grow fast.",
    "Always present the ANOVA table (source, SS, df, MS, F) and compare F with the table value for the correct (df₁, df₂).",
    "For two-way ANOVA, state both conclusions (treatments and blocks) separately.",
  ],

  problems: [
    {
      title: "Helmet MLE (slides 6–11)",
      level: "From slides",
      question: "Of 10 helmets, numbers 1, 3 and 10 are flawed. Write the likelihood, evaluate it at $p = 0.25$ and 0.5, and find the MLE of p.",
      solution: "$L(p)$ = p³($1 - p$)⁷. $L(0.25)$ = **0.002086**; $L(0.5)$ = **0.000977**.\nln $L = 3$ ln p + 7 $\\ln(1 - p)$ → $3/p - 7/(1 - p) = 0$ → **p̂ = 0.3**.",
    },
    {
      title: "Binomial MLE (slide 16)",
      level: "From slides",
      question: "Derive the MLE of $\\theta$ for a binomial with k successes in n trials.",
      solution: "log $L = \\log$ ⁿCₖ + k $\\log \\theta + (n - k)$ $\\log(1 - \\theta)$. Derivative: $k/\\theta - (n - k)/(1 - \\theta) = 0$ → $k - k \\theta = n \\theta - k \\theta$ → **θ̂ = k/n**.",
    },
    {
      title: "Poisson MLE (slides 17–18)",
      level: "From slides",
      question: "Derive the MLE of the Poisson mean $\\mu$.",
      solution: "L ∝ e^{−$n \\mu$} μ^{nX̄} (factorials drop out). ℓ = −$n \\mu$ + nX̄ $\\log \\mu$; dℓ/$d \\mu$ = −n + nX̄/$\\mu = 0$ → **μ̂ = $\\bar{X}$**.",
    },
    {
      title: "Impurity variability, F-test (slides 26–27)",
      level: "From slides",
      question: "Original: $n = 25$, $s^2 = 1.04$; new: $n = 25$, $s^2 = 0.51$. Is the new process less variable at 5%?",
      solution: "$F = 1.04/0.51$ = **2.04** > $F_0$.₀₅(24, 24) = 1.98 → **reject $H_0$**: the new process is less variable $(p = 0.044)$.",
    },
    {
      title: "Impeller grinding, F-test (slides 28–29)",
      level: "From slides",
      question: "$n_1 = 12$, $s_1 = 5.1$; $n_2 = 15$, $s_2 = 4.7$. Does process 1 vary more (5%)?",
      solution: "$F = 26.01/22.09$ = **1.18** < $F_0$.₀₅(11, 14) ≈ 2.53 (exact 2.57) → **do not reject $H_0$** $(p = 0.38)$.",
    },
    {
      title: "One-way ANOVA, three groups (slides 42–46)",
      level: "From slides",
      question: "G1: 8, 10, 7, 14, 11; G2: 7, 5, 10, 9, 9; G3: 12, 9, 13, 12, 14. Test equality of means at 5%.",
      solution: "CF = 1500; SST = 100; SSTR = 40; SSE = 60. MSTR = 20, MSE = 5, **F = 4.0** > 3.89 (2, 12) → **reject $H_0$** $(p = 0.047)$.",
    },
    {
      title: "One-way ANOVA, iron intake (slides 47–49)",
      level: "From slides",
      question: "Four groups of 10 patients (data on slide 47). Is there a difference in mean iron intake at 5%?",
      solution: "$G = 891$ (slide: 981, a typo), CF = 19847.03, SST = 1272.47, SSTR = 349.52, SSE = 922.95. MSTR = 116.51, MSE = 25.64, **F = 4.54** (slide: 4.455) > $F_0$.₀₅(3, 36) = 2.87 (slide: 4.38) → **reject $H_0$** $(p = 0.008)$. Means: 19.55, 20.8, 21.5, **27.25**.\n(The slide also asks for an LSD follow-up; the LSD formula isn't given in the slides, so it's not covered here.)",
    },
    {
      title: "Two-way ANOVA, fertilizers (slides 58–60)",
      level: "From slides",
      question: "Rows Nitrogen 6, 4, 8, 6; Potash 7, 6, 6, 9; Phosphate 8, 5, 10, 9 (plots A–D). Test plots and fertilizers at 5%.",
      solution: "CF = 588; SST = 36; SSTR (plots) = 18; SSBL (fertilizers) = 8; SSE = 10; MSE = 1.67.\nF(plots) = 6/1.67 = **3.6** < 4.76 → not significant. F(fertilizers) = 4/1.67 = **2.4** < 5.14 → not significant.",
    },
    {
      title: "Two-way ANOVA, teaching method × study time (slides 61–64)",
      level: "From slides",
      question: "Using the cell means (65, 71; 57.67, 67.33; 64, 72.33), test the effects of teaching method and study time at 5%.",
      solution: "CF = 26311.85; SST = 140.94; SSTR = 41.58; SSBL = 95.92; SSE = 3.44; MSE = 1.72.\nMethod: F = **12.08** < $F(2, 2) = 19.0$ → not significant. Time: F = **55.8** > $F(1, 2) = 18.51$ → **significant**.",
    },
    {
      title: "Practice 1: hard-drive defects (slide 65)",
      level: "From slides",
      question: "Poisson daily counts: 7, 3, 1, 2, 4, 1, 2, 3, 1, 2. MLE of P(0 or 1 defectives in a day)?",
      solution: "*Exercise solution prepared for the website.*\n$\\hat{\\lambda} = \\bar{x}$ = **2.6**. $\\hat{P}(X \\le 1)$ = e^{−2.6}(1 + 2.6) = **0.267**.",
    },
    {
      title: "Practice 2: Bernoulli sample 0, 1, 0, 0, 1, 0 (slide 66)",
      level: "From slides",
      question: "Find the MLE of p.",
      solution: "$L = (1 - p)^3 p^2$ → −$3/(1 - p) + 2/p = 0$ → **p̂ = 1/3**. (This is the most likely p, not “a 1/3 chance of the sample”: $L(1/3) = 0.033$.)",
    },
    {
      title: "Practice 3: Linda's salespeople (slide 67)",
      level: "From slides",
      question: "Weekly sales (thousands): L: 7, 6, 7, 4; M: 6, 8, 6, 6; N: 9, 8, 7, 10. ANOVA at 5%.",
      solution: "*Exercise solution prepared for the website.*\nTotals 24, 26, 34; $G = 84$, $n = 12$, CF = 588. $\\text{SST} = 616 - 588 = 28$; $\\text{SSTR} = (24^2 + 26^2 + 34^2)/4 - 588 = 14$; SSE = 14.\nMSTR = 7, MSE = 14/9 = 1.556, **F = 4.5** > $F_0$.₀₅(2, 9) = 4.26 → **reject $H_0$**: average sales differ (N is highest).",
    },
    {
      title: "Practice 4: tin-coating weights (slide 68)",
      level: "From slides",
      question: "Four laboratories each measure 12 disks (data on slide 68). Test equality of means at 5%.",
      solution: "*Exercise solution prepared for the website.*\nMeans: A 0.268, B 0.227, C 0.230, D 0.249. SSTR = 0.01337, SSE = 0.06753 (df 3, 44). MSTR = 0.004458, MSE = 0.001535, **F = 2.91** > $F_0$.₀₅(3, 44) = 2.82 → **reject $H_0$** (just; $p = 0.045$): the labs' mean weights differ.",
    },
    {
      title: "Practice 5: iron intake by group and trimester (slide 69)",
      level: "From slides",
      question: "Ten groups (G1–G10) × three trimesters (data on slide 69). Two-way ANOVA at 5%: do groups differ? Do trimesters differ?",
      solution: "*Exercise solution prepared for the website.*\nTreatments = 10 groups $(k = 10)$, blocks = 3 trimesters $(m = 3)$, $n = 30$. $G = 695$, CF = 16100.83, SST = 884.67, SSTR = 134.17, SSBL = 436.72, SSE = 313.78 (df 18), MSE = 17.43.\nGroups: $F = 14.91/17.43$ = **0.86** < $F(9, 18) = 2.46$ → not significant. Trimesters: $F = 218.36/17.43$ = **12.53** > $F(2, 18) = 3.55$ → **significant** (iron intake rises across trimesters).\n(The slide's heading says “four groups” but the table has ten.)",
    },
    {
      title: "Practice 6: chemicals on fabric strength (slide 70)",
      level: "From slides",
      question: "4 chemicals × 5 fabric samples (randomised complete block). Test at $\\alpha = 0.01$.",
      solution: "*Exercise solution prepared for the website.*\nTreatments = chemicals $(k = 4)$, blocks = fabric samples $(m = 5)$. $G = 39.2$, CF = 76.83, SST = 25.69, SSTR = 18.04, SSBL = 6.69, SSE = 0.95 (df 12), MSE = 0.0792.\nChemicals: $F = 6.015/0.0792$ = **75.9** > $F_0$.₀₁(3, 12) = 5.95 → **significant**. Fabrics: F = **21.1** > $F_0$.₀₁(4, 12) = 5.41 → significant.",
    },
    {
      title: "Problem 7: glue curing time (slides 71–73)",
      level: "From slides",
      question: "A: 13, 10, 8, 11, 8; B: 13, 11, 14, 14; C: 17, 14, 13, 10, 11, 12. Any difference at 5%?",
      solution: "$G = 179$, CF = 2136.07, SST = 82.93, SSTR = 28.1, SSE = 54.83. MSTR = 14.05, MSE = 4.569, **F = 3.08** < $F_0$.₀₅(2, 12) = 3.89 → **do not reject $H_0$** $(p = 0.084)$.",
    },
    {
      title: "Level 1: Poisson MLE",
      level: "Level 1",
      question: "Poisson counts 2, 0, 3, 1, 4. Find $\\hat{\\lambda}$.",
      solution: "$\\hat{\\lambda} = \\bar{x} = 10/5$ = **2**.",
    },
    {
      title: "Level 1: F statistic",
      level: "Level 1",
      question: "$s_1^2 = 9$ $(n_1 = 10)$, $s_2^2 = 4$ $(n_2 = 8)$. Compute F and its df.",
      solution: "$F = 9/4$ = **2.25**, df **(9, 7)**.",
    },
    {
      title: "Level 2: MLEs from data",
      level: "Level 2",
      question: "(a) 7 successes in 20 Bernoulli trials: $\\hat{p}$? (b) Exponential waiting times with mean 5 minutes: $\\hat{\\lambda}$?",
      solution: "$(a) \\hat{p} = 7/20$ = **0.35**. $(b) \\hat{\\lambda} = 1/\\bar{x}$ = **0.2** per minute.",
    },
    {
      title: "Level 2: complete an ANOVA table",
      level: "Level 2",
      question: "$k = 4$ groups, $n = 20$ observations, SSTR = 60, SSE = 80. Complete the table and test at 5%.",
      solution: "df: 3 and 16. MSTR = 20, MSE = 5, **F = 4.0** > $F_0$.₀₅(3, 16) = 3.24 → **reject $H_0$**. SST = 140 with df 19.",
    },
    {
      title: "Level 3: normal MLEs vs sample variance",
      level: "Level 3",
      question: "Normal sample 4, 6, 8. Find $\\hat{\\mu}$ and $\\hat{\\sigma}^2$ (MLE) and compare with $s^2$.",
      solution: "$\\hat{\\mu}$ = **6**. $\\sum(x - 6)^2 = 8$ → $\\hat{\\sigma}^2 = 8/3$ = **2.67** (divides by n). $s^2 = 8/2$ = **4** (divides by $n - 1$). The MLE is smaller: it's biased.",
    },
    {
      title: "Level 3: a full one-way ANOVA",
      level: "Level 3",
      question: "A: 3, 5, 4; B: 6, 8, 7; C: 9, 7, 8. Test equality of means at 5%.",
      solution: "$G = 57$, CF = 361, $\\text{SST} = 393 - 361 = 32$, $\\text{SSTR} = (12^2 + 21^2 + 24^2)/3 - 361 = 26$, SSE = 6. MSTR = 13, MSE = 1, **F = 13** > $F_0$.₀₅(2, 6) = 5.14 → **reject $H_0$**.",
    },
  ],

  theory: [
    {
      title: "What is maximum likelihood?",
      level: "Level 1",
      question: "Explain the principle of maximum likelihood and the steps to find an MLE.",
      solution: "Choose the parameter value under which the observed sample is most probable. Steps: (1) assume a distribution $f(x \\mid \\theta)$; (2) write $L(\\theta)$ = Π $f(x_i \\mid \\theta)$; (3) take log L; (4) set d log $L/d \\theta = 0$ and solve; (5) check it's a maximum. E.g. 3 flawed helmets of 10 gives $\\hat{p} = 0.3$ (slides 6–14).",
    },
    {
      title: "Why is the normal MLE of σ² biased?",
      level: "Level 2",
      question: "Compare the MLE of $\\sigma^2$ with the sample variance.",
      solution: "MLE: $\\hat{\\sigma}^2 = \\sum(x_i - \\bar{x})^2/n$; sample variance: $s^2 = \\sum(x_i - \\bar{x})^2/(n - 1)$. Because $\\bar{x}$ is estimated from the same data, deviations are systematically small, so dividing by n underestimates $\\sigma^2$ (biased). Two principles, unbiasedness and maximum likelihood, give two different estimators (slide 20).",
    },
    {
      title: "Assumptions and logic of ANOVA",
      level: "Level 2",
      question: "State the assumptions of one-way ANOVA and explain why $F = \\text{MSTR}/\\text{MSE}$ tests equality of means.",
      solution: "Assumptions: normal responses in each population, equal variances $\\sigma^2$, independent observations (slide 33). MSE estimates $\\sigma^2$ from within-group scatter regardless of $H_0$. MSTR estimates $\\sigma^2$ **only if** $H_0$ is true; if the means differ, MSTR is inflated. So $F = \\text{MSTR}/\\text{MSE} \\approx 1$ under $H_0$, and a large F (beyond $F(k - 1, n - k)$) signals differing means.",
    },
    {
      title: "One-way vs two-way ANOVA",
      level: "Level 2",
      question: "Distinguish one-way and two-way ANOVA. Why is two-way often more accurate?",
      solution: "One-way tests one factor (treatments): SST = SSTR + SSE. Two-way adds a block factor: SST = SSTR + SSBL + SSE, with an F-test for each. Removing block-to-block variation from the error reduces MSE, so treatment differences are detected more accurately (slide 52).",
    },
  ],

  quiz: [
    {
      topic: "MLE",
      type: "num",
      q: "3 flawed helmets out of 10. MLE of p?",
      answer: 0.3,
      tol: 0.001,
      why: "Maximise p³($1 - p$)⁷ → $p = 3/10$.",
    },
    {
      topic: "MLE",
      type: "num",
      q: "Poisson counts 7, 3, 1, 2, 4, 1, 2, 3, 1, 2. $\\hat{\\lambda}$?",
      answer: 2.6,
      tol: 0.001,
      why: "$\\hat{\\lambda} = \\bar{x}$.",
    },
    {
      topic: "MLE",
      q: "The MLE of the normal variance divides $\\sum(x - \\bar{x})^2$ by…",
      options: ["$n - 1$", "n", "n + 1", "$\\sqrt{n}$"],
      answer: 1,
      why: "$\\hat{\\sigma}^2 = \\sum(x - \\bar{x})^2/n$, which is biased (slide 20).",
      wrong: ["That's the unbiased sample variance $s^2$.", null, "No standard estimator uses n + 1.", "Not a variance formula."],
    },
    {
      topic: "MLE",
      q: "Why do we usually maximise log L instead of L?",
      options: ["log L has a different maximiser", "Products become sums, making differentiation easier", "L can be negative", "It removes the need for a distribution"],
      answer: 1,
      why: "log is increasing, so the same $\\theta$ maximises both (slide 10).",
      wrong: ["The maximiser is the same.", null, "Likelihoods are non-negative.", "MLE always needs a distributional assumption."],
    },
    {
      topic: "F-test",
      type: "num",
      q: "$s_1 = 5.1$, $s_2 = 4.7$. $F = s_1^2/s_2^2$? (2 decimals)",
      answer: 1.18,
      tol: 0.01,
      why: "26.01/22.09.",
    },
    {
      topic: "F-test",
      q: "In the F-test for two variances, the numerator should be…",
      options: ["The smaller sample variance", "The larger sample variance", "The larger standard deviation", "The pooled variance"],
      answer: 1,
      why: "Slide 24: $s_1^2$ is the larger sample variance.",
      wrong: ["That gives $F < 1$.", null, "Use variances, not SDs.", "Pooling assumes the variances are equal, which is what's being tested."],
    },
    {
      topic: "ANOVA",
      type: "num",
      q: "One-way: SSTR = 40, SSE = 60, $k = 3$, $n = 15$. F?",
      answer: 4,
      tol: 0.01,
      why: "(40/2)/(60/12).",
    },
    {
      topic: "ANOVA",
      type: "num",
      q: "$G = 150$, $n = 15$. Correction factor CF?",
      answer: 1500,
      tol: 0.5,
      why: "$G^2/n$.",
    },
    {
      topic: "ANOVA",
      q: "Rejecting $H_0$ in one-way ANOVA means…",
      options: ["All means differ", "At least two population means differ", "The variances differ", "The data aren't normal"],
      answer: 1,
      why: "Slide 32.",
      wrong: ["Too strong a conclusion.", null, "ANOVA assumes equal variances; it tests means.", "Normality is an assumption, not the conclusion."],
    },
    {
      topic: "ANOVA",
      type: "num",
      q: "Two-way with $k = 4$ treatments and $m = 3$ blocks. Error df?",
      answer: 6,
      tol: 0.01,
      why: "$(k - 1) (m - 1) = 3 \\times 2$.",
    },
    {
      topic: "ANOVA",
      type: "num",
      q: "Fertilizer example: MSTR = 6, MSE = 1.67. F for treatments? (1 decimal)",
      answer: 3.6,
      tol: 0.05,
      why: "6/1.67.",
    },
    {
      topic: "ANOVA",
      q: "Which is NOT an assumption of ANOVA?",
      options: ["Normal responses", "Equal population variances", "Independent observations", "Equal sample sizes"],
      answer: 3,
      why: "Groups may have different sizes (e.g. the glue example: 5, 4, 6).",
      wrong: ["Required (slide 33).", "Required.", "Required.", null],
    },
  ],
};
