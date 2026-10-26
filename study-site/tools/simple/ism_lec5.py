import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("A **random variable** turns the outcome of an experiment into a number (heads in two tosses, TVs sold today, waiting time). "
         "Once outcomes are numbers you can list how likely each value is (the **distribution**), find the long-run average (**expected value**) "
         "and the spread (**variance**). This lecture does that for countable values (discrete), measured values (continuous) and two variables at once. "
         "All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Discrete RV", "Values you can **count**: 0, 1, 2, …. Each value gets a probability (a **pmf**) and the probabilities add to 1.", tag="Bars", example="TV sets sold per day", figure="i5-pmf"),
     CARD("Continuous RV", "Values you **measure** (time, weight). Probability is the **area** under a density curve (a **pdf**).", tag="Area", example="Lifetime of a bulb", figure="i5-pdf"),
     CARD("Expected value & variance", "The long-run **average** of the RV, and how far values typically stray from it.", tag="Centre & spread", example="KPN sells 1.2 TVs a day on average"),
   ),
 ]),
 SEC(2, "rv", "Random variables and the pmf", [
   P("Toss two coins and let X = number of heads. The outcomes TT, HT, TH, HH become the numbers 0, 1, 1, 2. The **pmf** (probability mass function) $f(x) = P(X = x)$ lists the probability of each value."),
   T(["x (heads)", "0", "1", "2"], [["f(x)", "1/4", "2/4", "1/4"]], caption="Lecturer's slide 11"),
   F("A valid pmf needs two things", "$$f(x) \\ge 0 \\text{ for every } x \\qquad \\text{and} \\qquad \\sum_x f(x) = 1$$"),
   EX("Solved example (lecturer's Example 2): find k",
      "$p(x) = k, 3k, 5k, 7k, 9k$ for $x = 0, 1, 2, 3, 4$. Find k and $P(X < 3)$.\n\n"
      "**Approach:** an unknown constant in a pmf → set the total to 1.\n"
      "$k + 3k + 5k + 7k + 9k = 25k = 1 \\Rightarrow k = \\frac{1}{25}$. Then $P(X < 3) = k + 3k + 5k = \\frac{9}{25}$."),
   ANS("k = 1/25 · P(X < 3) = 9/25", "“< 3” means 0, 1, 2: it excludes 3. “≤ 3” would include it."),
   F("CDF (cumulative distribution)", "$$F(x) = P(X \\le x) = \\sum_{t \\le x} f(t) \\qquad P(a < X \\le b) = F(b) - F(a)$$ A staircase that climbs from 0 to 1. For k above: F = 1/25, 4/25, 9/25, 16/25, 1."),
   FIG("i5-cdf"),
 ], "5–12, 18–20, 23, 26–28"),
 SEC(3, "ev", "Expected value and variance", [
   P("$E(X)$ is a **weighted average**: each value weighted by how often it happens. If you watched the experiment for years, the average would settle at $E(X)$. It's Lecture 1's grouped mean with probabilities in place of frequencies."),
   F("Formulas", "$$E(X) = \\mu = \\sum x\\,f(x) \\qquad \\text{Var}(X) = \\sum (x - \\mu)^2 f(x) = E(X^2) - \\mu^2 \\qquad \\sigma = \\sqrt{\\text{Var}(X)}$$"),
   EX("Solved example (lecturer's slides 21–22): KPN Appliances",
      "Over 200 days, TV sales were 0, 1, 2, 3, 4 sets with probabilities 0.40, 0.25, 0.20, 0.05, 0.10.\n\n"
      "**Mean:** $E(X) = 0(0.4) + 1(0.25) + 2(0.2) + 3(0.05) + 4(0.1) = 1.2$.\n"
      "**Shortcut variance:** $E(X^2) = 0 + 0.25 + 0.8 + 0.45 + 1.6 = 3.1$, so $\\text{Var}(X) = 3.1 - 1.2^2 = 1.66$, $\\sigma = 1.288$."),
   ANS("μ = 1.2 TVs a day · σ² = 1.66 · σ ≈ 1.29"),
   F("Transformation rules", "$$E(aX + b) = aE(X) + b \\qquad \\text{Var}(aX + b) = a^2\\,\\text{Var}(X)$$ Adding a constant **shifts** without spreading; multiplying by a stretches the SD by $|a|$ and the variance by $a^2$."),
   CHK("E(X) = 1.2, Var(X) = 1.66. Profit = 4X + 3. What is Var(profit)?", ["6.64", "9.64", "26.56", "7.8"], 2, "$4^2 \\times 1.66 = 26.56$. The +3 doesn't change the spread. (E(profit) = 7.8.)"),
   WARN("Sign trap", "$\\text{Var}(X) = E(X^2) \\,{-}\\, [E(X)]^2$. Slide 25 prints a “+” by mistake; its next line subtracts correctly."),
 ], "13–17, 21–27"),
 SEC(4, "cont", "Continuous random variables: probability is area", [
   P("A waiting time can be 2.31 or 2.3104 minutes: there are too many values to give each a probability. Instead a **density** curve $f(x)$ is drawn, and $P(a < X < b)$ is the **area under the curve** between a and b. The probability of any single exact value is 0."),
   FIG("i5-pdf"),
   F("pdf rules", "$$f(x) \\ge 0, \\quad \\int_{-\\infty}^{\\infty} f(x)\\,dx = 1, \\quad P(a < X < b) = \\int_a^b f(x)\\,dx$$ $$F(x) = \\int_{-\\infty}^{x} f(u)\\,du, \\quad E(X) = \\int x f(x)\\,dx, \\quad \\text{Var}(X) = \\int x^2 f(x)\\,dx - \\mu^2$$"),
   EX("Solved example (lecturer's Example 1): $f(x) = 2e^{-2x}$, $x > 0$",
      "Find $P(1 < X < 3)$ and $P(X > 0.5)$.\n\n"
      "The integral of $2e^{-2x}$ is $-e^{-2x}$.\n"
      "$P(1 < X < 3) = [-e^{-2x}]_1^3 = e^{-2} - e^{-6} = 0.133$\n"
      "$P(X > 0.5) = [-e^{-2x}]_{0.5}^{\\infty} = e^{-1} = 0.368$"),
   ANS("0.133 and 0.368", "CDF: $F(x) = 1 - e^{-2x}$; mean $1/2$, variance $1/4$."),
   EX("Lecturer's slide 39: find k", "$f(x) = kxe^{-4x^2}$, $x > 0$. Set the area to 1: substitute $u = 4x^2$ ($du = 8x\\,dx$) → $\\frac{k}{8}\\int_0^{\\infty} e^{-u}du = \\frac{k}{8} = 1$ → **k = 8**."),
   WARN("A density is not a probability", "$f(0) = 2$ above is bigger than 1, and that's fine. Only **areas** are probabilities."),
   CHK("Y has CDF F(y) = y/4 on [0, 4]. P(Y > 1.5)?", ["1.5/4", "5/8", "1/4", "3/8"], 1, "$1 - F(1.5) = 1 - 0.375 = 0.625 = 5/8$ (lecturer's slide 40)."),
 ], "30–40"),
 SEC(5, "joint", "Two random variables: joint, marginal, independent", [
   P("A **joint table** gives $P(X = x, Y = y)$ for every pair, and all the cells add to 1. Add across a row or down a column to get the distribution of **one** variable alone: the **marginal** (it's written in the table's margin)."),
   T(["", "Y = 0", "Y = 1", "Y = 2", "Y = 3", "g(x)"],
     [["X = 0", "0", "1/8", "1/4", "1/8", "1/2"], ["X = 1", "1/8", "1/4", "1/8", "0", "1/2"], ["h(y)", "1/8", "3/8", "3/8", "1/8", "1"]],
     caption="Lecturer's slides 54–55, with the margins added"),
   EX("Reading the table", "$P(X + Y \\ge 2)$: list the qualifying cells (0,2), (0,3), (1,1), (1,2), (1,3) → $\\frac{1}{4} + \\frac{1}{8} + \\frac{1}{4} + \\frac{1}{8} + 0 = \\frac{3}{4}$."),
   F("Independence", "$$X, Y \\text{ independent} \\iff f(x, y) = g(x)\\,h(y) \\text{ for } \\textbf{every} \\text{ cell}$$ Continuous: same idea with densities (e.g. $e^{-(x+y)} = e^{-x} \\cdot e^{-y}$ → independent)."),
   CHK("In the table above, are X and Y independent?", ["Yes", "No: cell (0, 0) is 0 but g(0)h(0) = 1/16", "Yes, because both margins are 1/2", "Can't tell"], 1,
       "One failing cell is enough to prove dependence; proving independence needs every cell."),
 ], "46–64"),
 SEC(6, "compare", "Discrete vs continuous at a glance", [
   T(["", "Discrete", "Continuous"],
     [["Values", "countable (0, 1, 2, …)", "an interval (measured)"],
      ["Distribution", "pmf $f(x) = P(X = x)$", "pdf $f(x)$: a density, not a probability"],
      ["Total", "$\\sum f(x) = 1$", "$\\int f(x)\\,dx = 1$"],
      ["P(a ≤ X ≤ b)", "add the bars", "area $\\int_a^b f(x)\\,dx$"],
      ["P(X = a)", "can be > 0", "always 0"],
      ["Mean", "$\\sum x f(x)$", "$\\int x f(x)\\,dx$"]]),
 ]),
 SEC(7, "test", "Test your understanding", [
   CHK("f(x) = x/6 for x = 1, 2, 3. Valid pmf?", ["Yes", "No, it sums to 2", "No, f(3) > 0.5", "Only if x is continuous"], 0, "1/6 + 2/6 + 3/6 = 1 and all are ≥ 0 (lecturer's slide 12)."),
   CHK("For a continuous RV, P(X = 2) equals…", ["f(2)", "F(2)", "0", "1/2"], 2, "A single point has zero width, so zero area."),
   CHK("X takes 1, 2, 3 with probabilities 0.2, 0.5, 0.3. E(X)?", ["2", "2.1", "1.9", "6"], 1, "$0.2 + 1.0 + 0.9 = 2.1$."),
 ]),
 SEC(8, "remember", "What to remember for your exam", [
   REM("- **pmf:** every $f(x) \\ge 0$ and they sum to 1. Unknown k → set the sum (or integral) to 1.\n"
       "- **CDF** $F(x) = P(X \\le x)$; $P(a < X \\le b) = F(b) - F(a)$.\n"
       "- $E(X) = \\sum x f(x)$; $\\text{Var} = E(X^2) - \\mu^2$; $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$.\n"
       "- **Continuous:** probability = area; $P(X = a) = 0$; replace sums with integrals.\n"
       "- **Joint:** marginal = row/column sum; independent only if **every** cell = $g(x)h(y)$."),
 ]),
]

write("data/ism/lec5.js", INTRO, SECTIONS)
