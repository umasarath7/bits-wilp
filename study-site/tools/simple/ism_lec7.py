import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("We almost never get to measure a whole population; we measure a **sample** and make a careful guess about the population. "
         "This lecture explains why that guess works (the **Central Limit Theorem**), how much it wobbles (the **standard error**), "
         "and how to turn it into a range you can trust (a **confidence interval**). Every example below is the lecturer's own; "
         "the 📊 **Slides** tab has the full slide-by-slide notes.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Population vs sample", "The **population** is everyone you care about; a **sample** is the few you actually measure. Population numbers (μ, σ, P) are **parameters**; sample numbers (x̄, s, p̂) are **statistics**.", tag="Who we measure", example="All voters in India (population) vs 2,000 polled (sample)."),
     CARD("Sampling distribution", "Take many samples and the sample mean **changes every time**. Those means form their own distribution, centred on μ and narrower than the population.", tag="Means wobble", figure="i7-means"),
     CARD("Confidence interval", "Instead of one guess, give a **range**: estimate ± margin of error. “We are 95% confident μ is between 500 and 520.”", tag="A range, not a point", figure="i7-ci"),
   ),
   TIP("The one idea that ties it all together", "A sample mean is an **estimate that wobbles**. The standard error $\\sigma/\\sqrt n$ measures how much it wobbles. Bigger samples wobble less."),
 ]),
 SEC(2, "pop", "Population, sample, parameter, statistic", [
   T(["", "Population", "Sample"],
     [["What it is", "Everyone of interest", "The ones we actually measure"],
      ["Its numbers are called", "**Parameters** (fixed, usually unknown)", "**Statistics** (change from sample to sample)"],
      ["Mean / SD / proportion", "$\\mu$, $\\sigma$, $P$", "$\\bar x$, $s$, $\\hat p$"]]),
   P("Memory trick: **P**opulation ↔ **P**arameter, **S**ample ↔ **S**tatistic. Greek letters for the population, Roman letters for the sample."),
 ], "4–7"),
 SEC(3, "methods", "How to pick a sample", [
   T(["Method", "How", "Use when"],
     [["Simple random", "Every member has an equal chance", "The population is fairly uniform"],
      ["Systematic", "Every $k$-th member, $k = N/n$", "You have an ordered list"],
      ["Stratified", "Split into groups (strata), sample each **in proportion**", "Groups differ a lot"],
      ["Cluster / multistage", "Pick whole groups, then sample inside them", "The population is spread out geographically"]]),
   EX("Lecturer's example: proportional allocation",
      "Three strata of 2000, 6000 and 1000 people ($N = 9000$); total sample 1500. Each stratum gets $1500 \\times \\frac{\\text{its size}}{9000}$: **333**, **1000** and **167**."),
 ], "8–17"),
 SEC(4, "clt", "The Central Limit Theorem (CLT)", [
   P("Here is the most useful fact in this course. Take samples of size $n$ and compute each sample's mean. Then:"),
   L("The means are centred on the **true mean** $\\mu$.",
     "They are **less spread out** than individual values: their SD is $\\sigma/\\sqrt n$, called the **standard error (SE)**.",
     "For $n \\ge 30$ they follow a **normal (bell) curve**, **whatever shape the population has**. (If the population is already normal, any $n$ works.)"),
   F("Formula", "$$\\bar x \\sim N\\left(\\mu,\\ \\frac{\\sigma^2}{n}\\right) \\qquad z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$$"),
   FIG("i7-clt"),
   EX("Solved example (lecturer's slides 34–36): vehicle ages",
      "Vehicle ages have mean $\\mu = 96$ months and $\\sigma = 16$. For a random sample of $n = 36$ vehicles, what is the probability that the **sample mean** is between 90 and 100 months?\n\n"
      "**Step 1, standard error:** $SE = \\frac{16}{\\sqrt{36}} = 2.667$.\n"
      "**Step 2, z-scores:** $z_1 = \\frac{90 - 96}{2.667} = -2.25$, $z_2 = \\frac{100 - 96}{2.667} = 1.50$.\n"
      "**Step 3, table:** $P = F(1.50) - F(-2.25) = 0.9332 - 0.0122 = 0.9210$."),
   ANS("92.10%", "The average age of 36 vehicles is very likely (92%) to be between 90 and 100 months."),
   WARN("The #1 mistake", "A question about **one** vehicle uses $\\sigma$; a question about the **mean of 36** vehicles uses $\\sigma/\\sqrt n$. For one vehicle, $P(X > 100)$ is about 40%; for the mean of 36, $P(\\bar x > 100)$ is only about 7%. Read the question carefully."),
   CHK("Population SD is 21 and you take samples of 49. What is the standard error of the mean?",
       ["21", "3", "0.43", "441"], 1, "$21/\\sqrt{49} = 21/7 = 3$ (lecturer's department-store example)."),
 ], "18–41"),
 SEC(5, "fpc", "Small populations: the finite correction", [
   P("If your sample is a **big slice** of a small population (more than 5%), the mean wobbles even less, so shrink the standard error with the **finite population correction**:"),
   F("Formula", "$$SE = \\frac{\\sigma}{\\sqrt n}\\sqrt{\\frac{N - n}{N - 1}} \\qquad \\text{use when } \\frac{n}{N} \\ge 0.05$$"),
   EX("Lecturer's example: 350 employees",
      "$N = 350$, $\\mu = 37.6$, $\\sigma = 8.3$, $n = 45$ ($45/350 = 13\\% > 5\\%$). $SE = \\frac{8.3}{\\sqrt{45}}\\sqrt{\\frac{305}{349}} = 1.157$. "
      "$P(\\bar x < 40)$: $z = \\frac{40 - 37.6}{1.157} = 2.07$ → **0.9808**."),
 ], "42–46"),
 SEC(6, "phat", "Proportions behave the same way", [
   P("For yes/no data the sample statistic is the **proportion** $\\hat p = x/n$ (successes ÷ sample size). It also follows a bell curve when the sample is big enough ($nP > 15$ and $nQ > 15$):"),
   F("Formula", "$$z = \\frac{\\hat p - P}{\\sqrt{PQ/n}}, \\qquad Q = 1 - P$$"),
   EX("Solved example (lecturer's slides 51–52): a new drug",
      "60% of patients are cured ($P = 0.6$). In a sample of 120 patients, what is the probability that **at least half** are cured?\n\n"
      "$SE = \\sqrt{\\frac{0.6 \\times 0.4}{120}} = 0.0447$, $z = \\frac{0.5 - 0.6}{0.0447} = -2.24$, $P(Z > -2.24) = 1 - 0.0125 = 0.9875$."),
   ANS("98.75%", "Almost certainly at least half of the 120 will be cured."),
 ], "47–52"),
 SEC(7, "ci", "Confidence intervals for a mean", [
   P("A single number (the point estimate $\\bar x$) is almost never exactly right. A **confidence interval** gives a range: **estimate ± margin of error**, where the margin = (a z-value) × (the standard error)."),
   F("Formula", "$$\\bar x \\pm z_{\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}$$"),
   T(["Confidence", "90%", "95%", "98%", "99%"], [["$z_{\\alpha/2}$", "1.645", "1.96", "2.33", "2.58"]],
     caption="The four z-values to memorise"),
   EX("Solved example (lecturer's slides 65–67): phone bills",
      "A sample of $n = 85$ phone bills has mean $\\bar x = 510$ minutes; $\\sigma = 46$. Build a **95%** confidence interval for the true mean.\n\n"
      "Margin $= 1.96 \\times \\frac{46}{\\sqrt{85}} = 9.78$. Interval: $510 \\pm 9.78$."),
   ANS("500.22 to 519.78 minutes", "We are **95% confident** that the population's average call time lies in this range."),
   TIP("How the interval changes", "- **Higher confidence → wider** interval (99% uses 2.58: here ±12.87).\n- **Bigger sample → narrower** interval ($\\sqrt n$ is in the denominator).\n- Say “we are 95% confident the interval contains μ”, not “μ has a 95% chance”."),
   FIG("i7-ci"),
   CHK("Which change makes a confidence interval **narrower**?",
       ["Raising confidence from 95% to 99%", "Increasing the sample size", "A larger σ", "Using z = 2.58"], 1,
       "A bigger $n$ shrinks $\\sigma/\\sqrt n$. The other three all make it wider."),
 ], "53–69"),
 SEC(8, "cip", "Confidence intervals for a proportion", [
   F("Formula", "$$\\hat p \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat p\\,(1 - \\hat p)}{n}}$$"),
   P("Note: the interval uses the **sample** proportion $\\hat p$ inside the square root (we don't know the true P; that's what we're estimating)."),
   EX("Lecturer's example: telemarketing",
      "In a sample of 87 calls, 39% led to a sale. 95% CI: $0.39 \\pm 1.96\\sqrt{\\frac{0.39 \\times 0.61}{87}} = 0.39 \\pm 0.10$."),
   ANS("29% to 49%", "We are 95% confident the true success rate is between 29% and 49%."),
 ], "70–76"),
 SEC(9, "compare", "Quick comparison table", [
   T(["Question about…", "Standard error", "z (or interval)"],
     [["one value $X$", "$\\sigma$", "$z = \\frac{X - \\mu}{\\sigma}$"],
      ["a sample **mean** $\\bar x$", "$\\frac{\\sigma}{\\sqrt n}$", "$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$"],
      ["a mean, small population ($n/N \\ge 5\\%$)", "$\\frac{\\sigma}{\\sqrt n}\\sqrt{\\frac{N - n}{N - 1}}$", "same, with the corrected SE"],
      ["a sample **proportion** $\\hat p$", "$\\sqrt{PQ/n}$", "$z = \\frac{\\hat p - P}{\\sqrt{PQ/n}}$"],
      ["CI for $\\mu$", "$\\frac{\\sigma}{\\sqrt n}$", "$\\bar x \\pm z\\frac{\\sigma}{\\sqrt n}$"],
      ["CI for $P$", "$\\sqrt{\\hat p\\hat q/n}$", "$\\hat p \\pm z\\sqrt{\\hat p\\hat q/n}$"]]),
 ]),
 SEC(10, "test", "Test your understanding", [
   CHK("The CLT says that for $n \\ge 30$ the sample mean is approximately normal…",
       ["only if the population is normal", "whatever the population's shape", "only for proportions", "only if σ is known"], 1,
       "That's the power of the CLT: the population can be skewed; the sample mean still becomes bell-shaped."),
   CHK("$\\mu = 448$, $\\sigma = 21$, $n = 49$. The z-score for $\\bar x = 441$ is…",
       ["−0.33", "−2.33", "−7", "−1.00"], 1, "$SE = 21/7 = 3$; $z = (441 - 448)/3 = -2.33$."),
   CHK("For a 90% confidence interval, which z do you use?", ["1.645", "1.96", "2.33", "2.58"], 0,
       "90% → 1.645; 95% → 1.96; 98% → 2.33; 99% → 2.58."),
   CHK("A sample is 60 people from a company of 500. Should you use the finite population correction?",
       ["No, n is above 30", "Yes, n/N = 12% ≥ 5%", "Only for proportions", "Never for means"], 1,
       "The rule is about the **fraction** sampled: $60/500 = 0.12 \\ge 0.05$."),
 ]),
 SEC(11, "remember", "What to remember for your exam", [
   REM("- **Parameter** = population (μ, σ, P); **statistic** = sample ($\\bar x$, s, $\\hat p$).\n"
       "- **CLT:** $\\bar x \\sim N(\\mu, \\sigma^2/n)$ for $n \\ge 30$; $SE = \\sigma/\\sqrt n$.\n"
       "- **Mean of a sample?** Divide σ by $\\sqrt n$. **One value?** Don't.\n"
       "- **Small population** ($n/N \\ge 5\\%$): multiply SE by $\\sqrt{(N - n)/(N - 1)}$.\n"
       "- **Proportion:** $z = (\\hat p - P)/\\sqrt{PQ/n}$.\n"
       "- **CI = estimate ± z × SE**; z = 1.645 / 1.96 / 2.33 / 2.58 for 90 / 95 / 98 / 99%."),
   P("Then go to ✍️ **Solved Questions** and practise the lecturer's problems."),
 ]),
]

write("data/ism/lec7.js", INTRO, SECTIONS)
