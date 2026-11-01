import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Imagine plotting every student's study hours (x) against their marks (y). The dots drift upwards in a rough band. "
         "**Regression** draws the one straight line that sits closest to those dots, so you can say “study 2 more hours, expect about this many more marks”. "
         "**Correlation** gives a single number, r, that says how tightly the dots hug a line and whether it goes up or down. "
         "Then the lecture bends the line into curves, adds more predictors, and handles yes/no outcomes. All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Regression line", "The straight line $\\hat y = \\hat\\beta_0 + \\hat\\beta_1x$ that best fits the dots. Use it to **predict** y from x.", tag="Predict", example="ŷ = 75.21 − 0.209x (slide 10)", figure="i11-line"),
     CARD("r² (fit quality)", "The share of y's ups and downs that the line explains, from 0% to 100%.", tag="How good?", example="r² = 0.79 → the line explains 79%", figure="i11-sst"),
     CARD("Correlation r", "One number from −1 to +1: the **sign** gives the direction, the **size** gives the strength of the straight-line link.", tag="How strong?", example="r = 0.7155 (slide 38)", figure="i11-corr"),
   ),
 ]),
 SEC(2, "line", "The best straight line: least squares", [
   P("**The model in words.** y = a straight line in x + some random noise: $Y = \\beta_0 + \\beta_1x + \\epsilon$. Say it as “beta-nought plus beta-one x plus epsilon”. $\\beta_0$ is where the line starts (the value at x = 0), $\\beta_1$ is the **slope** (change in y per 1 unit of x), and $\\epsilon$ is the noise that pushes each dot above or below the line."),
   P("**Which line is “best”?** For any line, measure each dot's vertical gap to the line (its **residual**). Square the gaps (so +3 and −3 don't cancel, and big misses count more) and add them up. The **least-squares line** makes that total as small as possible."),
   F("The recipe (slides 9, 20)", "1. Make a table with columns x, y, x², xy (and y²) and add up each column.\n2. $S_{xx} = \\sum x^2 - \\frac{(\\sum x)^2}{n}$ (how spread out x is).\n3. $S_{xy} = \\sum xy - \\frac{\\sum x \\sum y}{n}$ (how x and y move together).\n4. **Slope** $\\hat\\beta_1 = \\frac{S_{xy}}{S_{xx}}$, **intercept** $\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$."),
   EX("Solved example (lecturer's slides 10–12): 14 points",
      "Totals: $n = 14$, $\\sum x = 1307.5$, $\\sum y = 779.2$, $\\sum x^2 = 128913.93$, $\\sum xy = 71347.3$.\n\n"
      "$S_{xx} = 128913.93 - \\frac{1307.5^2}{14} = 6802.77$\n"
      "$S_{xy} = 71347.3 - \\frac{1307.5 \\times 779.2}{14} = -1424.41$\n"
      "Slope $= \\frac{-1424.41}{6802.77} = -0.2094$. Means: $\\bar x = 93.39$, $\\bar y = 55.66$.\n"
      "Intercept $= 55.66 - (-0.2094)(93.39) = 75.21$."),
   ANS("ŷ = 75.21 − 0.2094x", "In words: every extra unit of x lowers the predicted y by about 0.21. At x = 100, ŷ = 54.27."),
   FIG("i11-line"),
   WARN("Don't predict outside the data", "The x values run from 59 to 132. Predicting at x = 300 assumes the line keeps going where we have no data (**extrapolation**). The lecturer: use it “within the range, but not beyond”."),
   CHK("$S_{xy} = 6$, $S_{xx} = 10$, $\\bar x = 3$, $\\bar y = 4$. The regression line is…", ["ŷ = 0.6 + 2.2x", "ŷ = 2.2 + 0.6x", "ŷ = 4 + 0.6x", "ŷ = 1.67 + 3x"], 1,
       "Slope $6/10 = 0.6$; intercept $4 - 0.6 \\times 3 = 2.2$."),
 ], "3–12"),
 SEC(3, "fit", "How good is the line? SST, SSE and r²", [
   P("Take one dot. Its distance from the plain average $\\bar y$ is the **total** gap. The line explains part of it (from $\\bar y$ up to the line); the rest (from the line to the dot) is **left over**. Square and add over all dots:"),
   F("Three sums of squares", "$$SST = SSR + SSE$$\n- **SST** (total) $= \\sum(y - \\bar y)^2$: how much y varies at all.\n- **SSR** (regression) $= \\sum(\\hat y - \\bar y)^2$: the part the line explains.\n- **SSE** (error) $= \\sum(y - \\hat y)^2$: the part the line misses.\n$$r^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST} \\qquad s^2 = \\frac{SSE}{n - 2}$$"),
   EX("Back to the 14 points (website calculation)", "$SST = 377.17$, $SSE = 78.92$, so $SSR = 298.25$.\n$r^2 = 1 - \\frac{78.92}{377.17} = 0.791$. $s = \\sqrt{78.92/12} = 2.56$."),
   ANS("r² = 0.79", "The line explains 79% of the variation in y; a typical dot is about 2.6 units off the line."),
   FIG("i11-sst"),
   TIP("Why n − 2?", "We used the data to estimate **two** numbers (intercept and slope) before measuring the leftover scatter. Each estimate costs one degree of freedom."),
   WARN("Overfitting (slide 21)", "A wiggly curve through every point makes SSE almost 0, but it is copying the noise and will predict new data badly."),
 ], "11–21"),
 SEC(4, "curves", "When the dots curve: transform or use a polynomial", [
   P("**Option 1: straighten the curve.** Some curves become straight lines after taking logs or reciprocals. Fit an ordinary line to the transformed numbers, then transform back."),
   T(["If the curve is…", "Transform", "You get the line"],
     [["Exponential $y = \\alpha e^{\\beta x}$", "$y' = \\ln y$", "$y' = \\ln\\alpha + \\beta x$"],
      ["Power $y = \\alpha x^{\\beta}$", "logs of x **and** y", "$y' = \\log\\alpha + \\beta x'$"],
      ["$y = \\alpha + \\beta\\log x$", "$x' = \\log x$", "$y = \\alpha + \\beta x'$"],
      ["Reciprocal $y = \\alpha + \\beta/x$", "$x' = 1/x$", "$y = \\alpha + \\beta x'$"]],
     caption="Intrinsically linear models (slide 24)"),
   EX("Lecturer's slide 27: a power curve", "12 points at x = 600, 500, 400. Take $\\ln x$ and $\\ln y$; the line through them has slope **−5.40** and intercept **35.67**. Back-transform: $\\hat\\alpha = e^{35.67} = 3.1 \\times 10^{15}$, so $\\hat y = 3.1 \\times 10^{15}x^{-5.40}$. Fitted values: 3.09, 8.26, 27.58."),
   FIG("i11-power"),
   P("**Option 2: polynomial.** If the data rise then fall (a peak) or fall then rise (a valley), add powers of x: $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ (quadratic, one bend) or up to $x^3$ (cubic, two bends). The lecturer: you rarely need more than $x^3$."),
   CHK("Which transformation straightens $y = \\alpha e^{\\beta x}$?", ["1/x", "ln y", "ln x only", "y²"], 1, "$\\ln y = \\ln\\alpha + \\beta x$: a straight line in x."),
 ], "22–31"),
 SEC(5, "corr", "Correlation: one number for direction and strength", [
   F("Pearson's r", "$$r = \\frac{S_{xy}}{\\sqrt{S_{xx}\\,S_{yy}}} \\qquad S_{yy} = \\sum y^2 - \\frac{(\\sum y)^2}{n}$$ It always lies between −1 and +1."),
   T(["r", "Meaning"],
     [["close to +1", "strong **positive** straight-line link (x up → y up)"],
      ["close to −1", "strong **negative** link (x up → y down)"],
      ["close to 0", "no **straight-line** link (there may still be a curve!)"]]),
   FIG("i11-corr"),
   EX("Lecturer's slide 38", "$S_{xx} = 0.025516$, $S_{yy} = 434.5375$, $S_{xy} = 2.3826$.\n$r = \\frac{2.3826}{\\sqrt{0.025516 \\times 434.5375}} = \\frac{2.3826}{3.3298}$"),
   ANS("r = 0.7155", "A fairly strong positive relationship; $r^2 = 0.51$, so x explains about half of y's variation."),
   TIP("Square r to interpret it", "r = 0.6 is **not** twice as strong as r = 0.3: $0.6^2 = 36\\%$ explained vs $0.3^2 = 9\\%$, four times as much (slide 41)."),
   CHK("A scatter plot shows a perfect U-shape. r is most likely…", ["close to +1", "close to −1", "close to 0", "exactly 1"], 2, "r only detects straight-line patterns; a U has no overall upward or downward tilt."),
 ], "32–41"),
 SEC(6, "multi", "Two or more predictors: multiple regression", [
   P("Marks depend on study hours **and** sleep. Multiple regression uses several x's at once: $y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2 + \\epsilon$. Each $\\beta$ is the change in y for one more unit of **that** predictor, **with the others held fixed**."),
   P("**By hand with two predictors (slides 43–46).** The slides name the response x and the predictors $y_1$, $y_2$. Compute five “corrected sums” (each is a total minus a correction, like $S_{xy}$), plug them into the formulas for $b_1$ and $b_2$, then $b_0 = \\bar x - b_1\\bar y_1 - b_2\\bar y_2$."),
   EX("Lecturer's slides 44–46 (22 rows)", "Corrected sums: $\\Sigma y_1^2 = 134.77$, $\\Sigma y_2^2 = 5616.95$, $\\Sigma y_1x = -53.95$, $\\Sigma y_2x = 220.14$, $\\Sigma y_1y_2 = -137.68$.\n"
      "$b_1 = \\frac{5616.95(-53.95) - (-137.68)(220.14)}{134.77(5616.95) - 137.68^2} = -0.3696$, $b_2 = 0.0301$, $b_0 = 5.867$."),
   ANS("x̂ = 5.867 − 0.3696 y₁ + 0.0301 y₂"),
   WARN("Slide 46's final equation doesn't match its data", "The slide prints $0.45898 - 0.0018y_1 + 0.12013y_2$. Its own sums and formulas (and a computer fit) give the equation above. Use ours."),
 ], "42–46"),
 SEC(7, "logit", "Yes/no outcomes: logistic regression", [
   P("Pass or fail? Buy or not? We want a **probability**, which must stay between 0 and 1, but a straight line shoots past both. Logistic regression bends the line into an **S-curve**:"),
   F("The logit model (slides 47–49)", "$$p(x) = \\frac{e^{\\beta_0 + \\beta_1x}}{1 + e^{\\beta_0 + \\beta_1x}} \\qquad \\text{odds} = \\frac{p}{1 - p} = e^{\\beta_0 + \\beta_1x}$$ So the **log of the odds** is a straight line in x. $\\beta_1 > 0$: the chance of success rises with x. Each extra unit of x multiplies the odds by $e^{\\beta_1}$ (the **odds ratio**)."),
   EX("Illustration (website numbers)", "$\\beta_0 = -3$, $\\beta_1 = 0.5$. At $x = 6$ the exponent is 0, so $p = \\frac{1}{1 + 1} = 0.5$. At $x = 4$: $p = \\frac{e^{-1}}{1 + e^{-1}} = 0.27$. At $x = 8$: $p = 0.73$."),
   CHK("In logistic regression, p = 0.5 exactly when…", ["x = 0", "β₀ + β₁x = 0", "β₁ = 1", "x = β₁"], 1, "Then $e^0 = 1$ and $p = 1/(1 + 1) = 0.5$."),
 ], "47–49"),
 SEC(8, "test", "Test your understanding", [
   CHK("The least-squares line always passes through…", ["(0, 0)", "(x̄, ȳ)", "the highest point", "(1, β₁)"], 1, "Because $\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$."),
   CHK("SSE = 20, SST = 80. r²?", ["0.25", "0.75", "0.8", "4"], 1, "$1 - 20/80 = 0.75$."),
   CHK("The slope is negative. r must be…", ["positive", "negative", "zero", "could be either"], 1, "In simple regression r and the slope always share their sign."),
   CHK("To fit $y = \\alpha x^{\\beta}$ you take logs of…", ["y only", "x only", "both x and y", "neither"], 2, "$\\log y = \\log\\alpha + \\beta\\log x$."),
 ]),
 SEC(9, "remember", "What to remember for your exam", [
   REM("- **Table first:** x, y, x², y², xy and their totals.\n"
       "- **Slope** $= S_{xy}/S_{xx}$; **intercept** $= \\bar y - \\text{slope} \\times \\bar x$; say the slope in words.\n"
       "- **SST = SSR + SSE**; $r^2 = 1 - SSE/SST$ (share explained); $s^2 = SSE/(n - 2)$.\n"
       "- $r = S_{xy}/\\sqrt{S_{xx}S_{yy}}$; same sign as the slope; square it to interpret.\n"
       "- Curved data: transform (log, 1/x) or add $x^2$, $x^3$. Yes/no outcome: logistic S-curve.\n"
       "- Memory hook: **“Squares make the line, r² grades the line.”**"),
 ]),
]

write("data/ism/lec11.js", INTRO, SECTIONS)
