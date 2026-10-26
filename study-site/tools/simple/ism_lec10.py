import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Three tools in one lecture. **Maximum likelihood (MLE)** picks the parameter value that makes your data most likely. "
         "The **F-test** asks whether one process is more *variable* than another. **ANOVA** asks whether three or more groups have the "
         "same *mean*, by comparing how far apart the groups are with how scattered each group is. All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Maximum likelihood (MLE)", "Try every possible parameter value; keep the one under which the **observed data is most probable**.", tag="Estimating a parameter", example="3 of 10 helmets flawed → best guess p = 0.3", figure="i10-lik"),
     CARD("F-test", "Divide the bigger sample variance by the smaller. Far above 1 → the variances really differ.", tag="Comparing spread", example="Is a new chemical process less variable?"),
     CARD("ANOVA", "Are 3+ group means equal? Compare the spread **between** group means with the spread **within** groups.", tag="Comparing 3+ means", example="Do three teaching methods give the same average score?", figure="i10-anova"),
   ),
 ]),
 SEC(2, "mle", "Maximum likelihood: the most believable parameter", [
   P("Detective thinking: you have the evidence (data) and several suspects (parameter values). The **likelihood** $L(\\theta)$ asks, for each suspect, “how probable is this evidence if *you* did it?” The **MLE** $\\hat\\theta$ is the suspect who makes the evidence most probable."),
   F("Recipe", "1. Write the likelihood: $L(\\theta) = \\prod f(x_i \\mid \\theta)$ (multiply the probabilities of each observation).\n2. Take logs: $\\ln L = \\sum \\ln f(x_i \\mid \\theta)$ (products become sums: easier).\n3. Differentiate, set to 0, solve for $\\theta$."),
   EX("Solved example (lecturer's slides 6–11): bike helmets",
      "10 helmets are inspected; 3 are flawed. What is the MLE of $p$, the probability a helmet is flawed?\n\n"
      "**1.** $L(p) = p^3(1 - p)^7$ (3 flawed, 7 fine).\n"
      "**2.** $\\ln L = 3\\ln p + 7\\ln(1 - p)$.\n"
      "**3.** $\\frac{3}{p} - \\frac{7}{1 - p} = 0 \\Rightarrow 3(1 - p) = 7p \\Rightarrow p = 0.3$."),
   ANS("p̂ = 0.3", "The data are most likely when p = 0.3 ($L = 0.00222$, higher than at $p = 0.25$ (0.00209) or $p = 0.5$ (0.00098)). It is simply the sample proportion, 3/10."),
   T(["Distribution", "MLE"],
     [["Bernoulli / binomial", "$\\hat p = \\frac{\\text{successes}}{n}$"], ["Poisson", "$\\hat\\lambda = \\bar x$"], ["Exponential", "$\\hat\\lambda = 1/\\bar x$"],
      ["Normal", "$\\hat\\mu = \\bar x$, $\\hat\\sigma^2 = \\frac{\\sum(x - \\bar x)^2}{n}$ (divides by n, so slightly biased)"]],
     caption="The answers you'll keep getting: learn these and skip the calculus"),
   CHK("Daily defective counts: 7, 3, 1, 2, 4, 1, 2, 3, 1, 2 (Poisson). MLE of λ?", ["2", "2.6", "3", "26"], 1, "Poisson MLE = sample mean = 26/10 = 2.6 (lecturer's Practice Problem 1)."),
 ], "3–21"),
 SEC(3, "f", "F-test: which process is more variable?", [
   P("Two machines make bolts with the same average length, but one may be more **erratic**. Compare their variances with a ratio: if the spreads were equal, the ratio would be close to 1."),
   F("Formula", "$$F = \\frac{s_1^2}{s_2^2} \\quad (\\text{larger variance on top}), \\qquad df = (n_1 - 1,\\ n_2 - 1)$$ Reject $H_0: \\sigma_1^2 = \\sigma_2^2$ if F exceeds the table value."),
   EX("Solved example (lecturer's slides 26–27): chemical impurities",
      "Original process: $n = 25$, $s^2 = 1.04$. New process: $n = 25$, $s^2 = 0.51$. Is the new process less variable (5%)?\n\n"
      "$F = \\frac{1.04}{0.51} = 2.04$; critical $F_{0.05}(24, 24) = 1.98$."),
   ANS("Reject H₀ (2.04 > 1.98)", "The new process has significantly less variability."),
   WARN("Square the SDs!", "If the question gives **standard deviations** ($s = 5.1$, $4.7$), square them first: $F = 26.01/22.09 = 1.18$, not $5.1/4.7$."),
 ], "22–29"),
 SEC(4, "anova", "One-way ANOVA: are 3 or more means equal?", [
   P("Why not many t-tests? With 3 groups you'd need 3 tests, and each one adds a chance of a false alarm. ANOVA does it in **one** test."),
   P("**The idea in one picture:** if the group averages sit far apart **compared with** how scattered the values are inside each group, the true means probably differ."),
   FIG("i10-anova"),
   F("The ANOVA recipe (k groups, n values in total)", "- $CF = G^2/n$ ($G$ = grand total)\n- $SST = \\sum x^2 - CF$ (total variation)\n- $SSTR = \\sum \\frac{C_j^2}{n_j} - CF$ (**between** groups; $C_j$ = group total)\n- $SSE = SST - SSTR$ (**within** groups)\n$$F = \\frac{MSTR}{MSE} = \\frac{SSTR/(k - 1)}{SSE/(n - k)}$$"),
   EX("Solved example (lecturer's slides 42–46): three groups",
      "Group 1: 8, 10, 7, 14, 11 (mean 10). Group 2: 7, 5, 10, 9, 9 (mean 8). Group 3: 12, 9, 13, 12, 14 (mean 12). Grand mean 10.\n\n"
      "**Between:** $SSTR = 5[(10 - 10)^2 + (8 - 10)^2 + (12 - 10)^2] = 40$, df 2 → $MSTR = 20$.\n"
      "**Within:** $SSE = 60$ (squared distances from each group's own mean), df 12 → $MSE = 5$.\n"
      "$F = 20/5 = 4.0$; critical $F_{0.05}(2, 12) = 3.89$."),
   ANS("Reject H₀ (4.0 > 3.89)", "At least two of the group means differ. (ANOVA doesn't say *which* ones.)"),
   CHK("4 groups, 40 observations in total. Degrees of freedom for F?", ["(4, 40)", "(3, 36)", "(3, 39)", "(4, 36)"], 1, "Between $k - 1 = 3$; within $n - k = 36$."),
 ], "30–50"),
 SEC(5, "anova2", "Two-way ANOVA: two factors at once", [
   P("Sometimes a second factor (a **block**: different plots of land, different study times) also affects the result. Two-way ANOVA splits the total variation into **treatments + blocks + error**, then tests each factor against the error."),
   F("Extra piece", "$$SSBL = \\sum \\frac{R_i^2}{k} - CF \\qquad SSE = SST - SSTR - SSBL \\qquad \\text{error df} = (k - 1)(m - 1)$$"),
   EX("Lecturer's example: fertilizers and plots", "3 fertilizers (blocks) × 4 plots (treatments), $G = 84$, $n = 12$: $CF = 588$, $SST = 36$. Each factor gets its own F-ratio against MSE; see 📊 Slides for the full table."),
 ], "51–64"),
 SEC(6, "compare", "Quick comparison table", [
   T(["Tool", "Question", "Statistic", "Decision"],
     [["MLE", "Best estimate of a parameter?", "maximise $\\ln L(\\theta)$", "the $\\hat\\theta$ itself"],
      ["F-test", "Are two variances equal?", "$F = s_1^2/s_2^2$ (larger on top)", "reject if F > table $F(n_1 - 1, n_2 - 1)$"],
      ["One-way ANOVA", "Are 3+ means equal?", "$F = MSTR/MSE$", "reject if F > $F(k - 1, n - k)$"],
      ["Two-way ANOVA", "Effects of 2 factors?", "one F per factor", "each vs $F(\\cdot, (k - 1)(m - 1))$"]]),
 ]),
 SEC(7, "test", "Test your understanding", [
   CHK("The MLE of the mean of a normal distribution is…", ["the median", "x̄", "x̄ with n − 1", "the mode"], 1, "$\\hat\\mu = \\bar x$."),
   CHK("s₁ = 6, s₂ = 4. The F statistic is…", ["1.5", "2.25", "0.44", "10"], 1, "Square first: 36/16 = 2.25."),
   CHK("ANOVA gives F = 1.2 with critical value 3.5. Conclusion?",
       ["All means differ", "At least two means differ", "No evidence the means differ", "Variances differ"], 2, "F below the critical value → don't reject $H_0$."),
   CHK("Which compares the between-group variation with the within-group variation?", ["t-test", "χ² test", "ANOVA F", "MLE"], 2, "That ratio is exactly ANOVA's F = MSTR/MSE."),
 ]),
 SEC(8, "remember", "What to remember for your exam", [
   REM("- **MLE:** likelihood → log → derivative = 0. Shortcuts: $\\hat p$ = k/n, Poisson $\\bar x$, exponential $1/\\bar x$, normal $\\bar x$ and $\\sum(x - \\bar x)^2/n$.\n"
       "- **F-test:** $F = s_1^2/s_2^2$ with the **larger variance on top**; square SDs first; df $(n_1 - 1, n_2 - 1)$.\n"
       "- **ANOVA:** CF, SST, SSTR, SSE → $F = \\frac{SSTR/(k - 1)}{SSE/(n - k)}$. Reject → *at least two* means differ.\n"
       "- **Two-way:** also subtract SSBL; error df $(k - 1)(m - 1)$."),
 ]),
]

write("data/ism/lec10.js", INTRO, SECTIONS)
