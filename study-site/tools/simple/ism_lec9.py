import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("A **hypothesis test** is a courtroom for claims. The claim being tested is presumed innocent (the **null hypothesis**) until the data "
         "give strong evidence against it. Every test in this lecture (z, t and χ²) follows the **same five steps**; only the formula for the test "
         "statistic changes. Learn the steps once, then learn *which formula fits which situation*. All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("z-test", "Large samples (n ≥ 30) or σ known. Tests one mean, two means, one proportion or two proportions.", tag="Big samples", example="Does mean sodium exceed 920 mg? (n = 44)"),
     CARD("t-test", "Small samples with σ unknown. One mean, two independent means (pooled), or **paired** before/after data.", tag="Small samples", example="Did a training programme raise scores? (9 trainees)"),
     CARD("χ² test", "Counts in categories. Are two categorical variables **associated**, or does data **fit** a theory?", tag="Categories", example="Are accident times linked to fatality?", figure="i9-chi"),
   ),
   TIP("The five steps (same for every test)",
       "1. Write $H_0$ (with =, ≤ or ≥) and $H_1$ (with ≠, < or >).\n2. Choose α (usually 5%).\n3. Compute the **test statistic** (z, t or χ²).\n4. Compare with the **critical value** (or compare the p-value with α).\n5. **Decide** (reject / don't reject $H_0$) and **write the conclusion in words**."),
 ]),
 SEC(2, "hyp", "Null and alternative hypotheses", [
   P("Think of a courtroom. $H_0$ = “innocent” (nothing new is going on; the claim is fine). $H_1$ = what you want to prove. You only **reject** $H_0$ if the evidence is strong; otherwise you **fail to reject** it, which is not the same as proving it true."),
   T(["Words in the question", "$H_0$", "$H_1$", "Test"],
     [["“equals”, “is”, “differs?”", "$\\mu = \\mu_0$", "$\\mu \\ne \\mu_0$", "Two-tailed"],
      ["“more than”, “exceeds”, “increased”", "$\\mu \\le \\mu_0$", "$\\mu > \\mu_0$", "Right-tailed"],
      ["“less than”, “at least … (is it lower?)”", "$\\mu \\ge \\mu_0$", "$\\mu < \\mu_0$", "Left-tailed"]]),
   FIG("i9-tails"),
   P("**Rule:** the equals sign always goes in $H_0$. The sign in $H_1$ decides the tail."),
 ], "4–15"),
 SEC(3, "errors", "Two ways to be wrong, and the p-value", [
   T(["", "$H_0$ actually true", "$H_0$ actually false"],
     [["You reject $H_0$", "**Type I error** (probability α): convicting an innocent person", "Correct ✅ (probability = **power** = 1 − β)"],
      ["You keep $H_0$", "Correct ✅", "**Type II error** (probability β): letting a guilty person go"]]),
   F("The decision rule", "**p-value** = if $H_0$ were true, the chance of seeing data this extreme (or more).\n- **$p \\le \\alpha$ → reject $H_0$.** The data would be too surprising if $H_0$ were true.\n- $p > \\alpha$ → don't reject $H_0$."),
   T(["Test", "α = 10%", "α = 5%", "α = 1%"],
     [["Two-tailed", "±1.645", "±1.96", "±2.58"], ["One-tailed", "1.28", "1.645", "2.33"]],
     caption="Critical z-values to memorise"),
 ], "16–27"),
 SEC(4, "z1", "z-test for one mean", [
   F("Formula", "$$z = \\frac{\\bar x - \\mu_0}{\\sigma/\\sqrt n} \\qquad \\text{use when } n \\ge 30 \\text{ or } \\sigma \\text{ known}$$"),
   EX("Solved example (lecturer's slide 28): sodium content",
      "A maker claims mean sodium is **no more than** 920 mg. A sample of $n = 44$ has $\\bar x = 925$, $s = 18$. Test at 5%.\n\n"
      "**1.** $H_0: \\mu \\le 920$, $H_1: \\mu > 920$ (right-tailed).\n"
      "**2.** α = 0.05 → critical $z = 1.645$.\n"
      "**3.** $z = \\frac{925 - 920}{18/\\sqrt{44}} = \\frac{5}{2.714} = 1.842$.\n"
      "**4.** $1.842 > 1.645$ (p = 0.033 < 0.05).\n"
      "**5.** Reject $H_0$."),
   ANS("Reject H₀", "There is enough evidence (at 5%) that mean sodium **exceeds** 920 mg. The claim is not supported."),
   CHK("Claim: average delivery = 3 days. n = 50, x̄ = 3.4, σ = 1.2. What is z?",
       ["0.33", "1.65", "2.36", "16.7"], 2, "$z = \\frac{3.4 - 3}{1.2/\\sqrt{50}} = \\frac{0.4}{0.170} = 2.36 > 1.96$ → reject (two-tailed)."),
 ], "26–30"),
 SEC(5, "z2", "z-tests for two means and for proportions", [
   F("Two means (large samples)", "$$z = \\frac{\\bar x_1 - \\bar x_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$$"),
   EX("Lecturer's example: taxi tyres", "Brand A: $n = 30$, mean 38600 km, SD 5000. Brand B: $n = 40$, mean 35450 km, SD 6100.\n$z = \\frac{3150}{\\sqrt{5000^2/30 + 6100^2/40}} = \\frac{3150}{1328} = 2.37 > 1.96$ → **the brands differ at 5%** (but not at 1%, where the critical value is 2.58)."),
   F("One proportion", "$$z = \\frac{p - P}{\\sqrt{PQ/n}} \\qquad P = \\text{claimed proportion},\\ Q = 1 - P$$"),
   EX("Lecturer's example: disease survival", "18 of 20 survived ($p = 0.90$). Is survival above 85%? $z = \\frac{0.90 - 0.85}{\\sqrt{0.85 \\times 0.15/20}} = 0.63 < 1.645$ → **not significant**: 90% vs 85% on only 20 patients isn't convincing."),
   F("Two proportions (pool them under H₀)", "$$\\hat P = \\frac{X_1 + X_2}{n_1 + n_2}, \\qquad z = \\frac{p_1 - p_2}{\\sqrt{\\hat P\\hat Q\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}$$"),
 ], "31–46"),
 SEC(6, "t", "t-tests: small samples", [
   P("When the sample is **small** and σ is **unknown**, the sample SD $s$ is itself shaky, so use the **t-distribution**: a bell curve with fatter tails (harder to reject). Its shape depends on **degrees of freedom (df)**."),
   T(["Situation", "Statistic", "df"],
     [["One mean", "$t = \\frac{\\bar x - \\mu_0}{s/\\sqrt n}$", "$n - 1$"],
      ["Two **independent** groups (pooled)", "$t = \\frac{\\bar x_1 - \\bar x_2}{s_p\\sqrt{1/n_1 + 1/n_2}}$, $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$", "$n_1 + n_2 - 2$"],
      ["**Paired** (same people before/after)", "$t = \\frac{\\bar d}{s_d/\\sqrt n}$ on the differences $d$", "pairs − 1"]]),
   EX("Solved example (lecturer's slides 62–65): training programme (paired)",
      "9 trainees took an aptitude test before and after training. Differences (after − before): −5, 7, 11, −8, 11, 21, 0, 9, −1. Did scores improve (5%)?\n\n"
      "**1.** $H_0: \\mu_d = 0$, $H_1: \\mu_d > 0$.\n"
      "**2.** df $= 9 - 1 = 8$ → critical $t = 1.860$.\n"
      "**3.** $\\bar d = 5$, $s_d = 9.21$, $t = \\frac{5}{9.21/\\sqrt 9} = 1.629$.\n"
      "**4.** $1.629 < 1.860$.\n"
      "**5.** Don't reject $H_0$."),
   ANS("Not significant", "An average gain of 5 points on only 9 people isn't enough evidence that the training works."),
   WARN("Two traps", "- **Paired vs independent:** the same people measured twice → **paired**. Two separate groups → pooled.\n- **Check the sign:** for $H_1: \\mu > \\mu_0$ you can only reject if t is **positive** and beyond the critical value. (The slides' sports-car example misses this; see 📊 Slides.)"),
   CHK("10 students' scores before and after coaching. Which test?",
       ["Pooled two-sample t", "Paired t", "χ² independence", "z for two proportions"], 1, "Same students measured twice → paired t on the differences, df = 9."),
 ], "47–65"),
 SEC(7, "chi", "χ² tests: counts in categories", [
   P("χ² (chi-square) compares **observed counts O** with the counts **E you'd expect** if $H_0$ were true. Big gaps → big χ² → reject."),
   F("Formula", "$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$\n- **Independence** (a two-way table): $E = \\frac{\\text{row total} \\times \\text{column total}}{n}$, df $= (r - 1)(c - 1)$.\n- **Goodness of fit:** E from the theory (uniform, a ratio, Poisson…), df $= k - 1 - (\\text{parameters estimated})$."),
   EX("Solved example (lecturer's slides 72–76): road accidents",
      "400 accidents: early hours 280 (80 fatal, 200 not); other times 120 (19 fatal, 101 not). Is time of day associated with fatality?\n\n"
      "Expected fatal in early hours $= \\frac{280 \\times 99}{400} = 69.3$; the others: 210.7, 29.7, 90.3.\n"
      "$\\chi^2 = \\frac{10.7^2}{69.3} + \\frac{10.7^2}{210.7} + \\frac{10.7^2}{29.7} + \\frac{10.7^2}{90.3} = 7.318$; df $= 1$, critical $3.841$."),
   ANS("Reject H₀ (χ² = 7.318 > 3.841)", "Accident time and fatality **are associated**: early-hours accidents are more often fatal than chance would explain."),
   FIG("i9-chi"),
   CHK("A 3 × 4 contingency table. Degrees of freedom?", ["12", "7", "6", "11"], 2, "$(3 - 1)(4 - 1) = 6$."),
 ], "66–85"),
 SEC(8, "choose", "Which test? A decision table", [
   T(["If the question…", "Use"],
     [["compares one mean with a claim, n ≥ 30", "z (one mean)"],
      ["compares one mean with a claim, small n, σ unknown", "t (one mean), df n − 1"],
      ["compares two large groups' means", "z (two means)"],
      ["compares two small independent groups", "pooled t, df n₁ + n₂ − 2"],
      ["measures the **same** subjects twice", "paired t, df pairs − 1"],
      ["tests a percentage against a claim", "z (one proportion)"],
      ["compares two percentages", "z (two proportions, pooled)"],
      ["has a table of counts for two categorical variables", "χ² independence"],
      ["compares observed counts with a theory", "χ² goodness of fit"]]),
 ]),
 SEC(9, "test", "Test your understanding", [
   CHK("You reject a true H₀. This is…", ["Type I error", "Type II error", "Power", "A correct decision"], 0, "Rejecting a true $H_0$ = Type I (probability α)."),
   CHK("p-value = 0.03 with α = 0.05. Decision?", ["Reject H₀", "Don't reject H₀", "Accept H₁ with certainty", "Need a bigger α"], 0, "$p \\le \\alpha$ → reject $H_0$."),
   CHK("Claim: “average battery life is at least 500 hours”. The alternative hypothesis is…",
       ["μ ≠ 500", "μ > 500", "μ < 500", "μ = 500"], 2, "“At least 500” is the claim ($H_0: \\mu \\ge 500$); you'd try to show it's lower: $H_1: \\mu < 500$, left-tailed."),
   CHK("Two-tailed z-test at 1%. Critical values?", ["±1.645", "±1.96", "±2.33", "±2.58"], 3, "Two-tailed 1% → ±2.58."),
 ]),
 SEC(10, "remember", "What to remember for your exam", [
   REM("- **Five steps:** $H_0$/$H_1$ → α → statistic → critical value or p-value → decision **in words**.\n"
       "- $H_0$ holds the =; the sign of $H_1$ sets the tail.\n"
       "- **z** for big samples / known σ; **t** for small samples (watch df); **paired** for before/after; **χ²** for counts.\n"
       "- **p ≤ α → reject.** Critical z: 1.645 / 1.96 / 2.33 / 2.58.\n"
       "- **Type I** = reject a true $H_0$ (α); **Type II** = keep a false $H_0$ (β); power = 1 − β.\n"
       "- χ²: $E = \\frac{\\text{row} \\times \\text{col}}{n}$, df $(r - 1)(c - 1)$; goodness of fit df $k - 1$ − parameters."),
   P("Then practise in ✍️ **Solved Questions**; the 📊 **Slides** tab lists the slide errors in this lecture (taxi tyres, sports cars, courier, paired df, digits)."),
 ]),
]

write("data/ism/lec9.js", INTRO, SECTIONS)
