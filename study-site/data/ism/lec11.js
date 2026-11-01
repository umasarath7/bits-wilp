// ISM — Lecture 11: Regression (simple linear, non-linear, polynomial, multiple, logistic) and correlation
// Source: CourseFiles/ISM/Lec11.pdf (49 pages). Every topic cites its slides; nothing outside the deck is taught.
// Numbers marked "Exercise solution prepared for the website" were computed (and checked in Python) from the slide data.

export default {
  title: "Regression & Correlation",
  source: "Lec11.pdf · 49 pages",
  quizMode: "step",
  overview:
    "Two variables often move together: hours studied and marks, advertising and sales, engine size and fuel use. **Regression** finds the straight line (or curve) that best describes how y changes with x, so we can **predict** y from x. **Correlation** gives one number, r, that says how **strong** and in which **direction** the straight-line relationship is. The lecture builds the least-squares line by hand (slides 3–12), measures how good it is with SSE, SST and $r^2$ (slides 13–21), bends the line into curves with transformations and polynomials (slides 22–31), defines correlation (slides 32–41), adds more predictors (multiple regression, slides 42–46) and ends with logistic regression for yes/no outcomes (slides 47–49).",

  simpleIntro: "Imagine plotting every student's study hours (x) against their marks (y). The dots drift upwards in a rough band. **Regression** draws the one straight line that sits closest to those dots, so you can say “study 2 more hours, expect about this many more marks”. **Correlation** gives a single number, r, that says how tightly the dots hug a line and whether it goes up or down. Then the lecture bends the line into curves, adds more predictors, and handles yes/no outcomes. All examples are the lecturer's own.",

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
              "title": "Regression line",
              "text": "The straight line $\\hat y = \\hat\\beta_0 + \\hat\\beta_1x$ that best fits the dots. Use it to **predict** y from x.",
              "tag": "Predict",
              "example": "ŷ = 75.21 − 0.209x (slide 10)",
              "figure": "i11-line"
            },
            {
              "title": "r² (fit quality)",
              "text": "The share of y's ups and downs that the line explains, from 0% to 100%.",
              "tag": "How good?",
              "example": "r² = 0.79 → the line explains 79%",
              "figure": "i11-sst"
            },
            {
              "title": "Correlation r",
              "text": "One number from −1 to +1: the **sign** gives the direction, the **size** gives the strength of the straight-line link.",
              "tag": "How strong?",
              "example": "r = 0.7155 (slide 38)",
              "figure": "i11-corr"
            }
          ]
        }
      ]
    },
    {
      "id": "s-line",
      "heading": "2. The best straight line: least squares",
      "slides": "3–12",
      "blocks": [
        {
          "type": "p",
          "text": "**The model in words.** y = a straight line in x + some random noise: $Y = \\beta_0 + \\beta_1x + \\epsilon$. Say it as “beta-nought plus beta-one x plus epsilon”. $\\beta_0$ is where the line starts (the value at x = 0), $\\beta_1$ is the **slope** (change in y per 1 unit of x), and $\\epsilon$ is the noise that pushes each dot above or below the line."
        },
        {
          "type": "p",
          "text": "**Which line is “best”?** For any line, measure each dot's vertical gap to the line (its **residual**). Square the gaps (so +3 and −3 don't cancel, and big misses count more) and add them up. The **least-squares line** makes that total as small as possible."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The recipe (slides 9, 20)",
          "text": "1. Make a table with columns x, y, x², xy (and y²) and add up each column.\n2. $S_{xx} = \\sum x^2 - \\frac{(\\sum x)^2}{n}$ (how spread out x is).\n3. $S_{xy} = \\sum xy - \\frac{\\sum x \\sum y}{n}$ (how x and y move together).\n4. **Slope** $\\hat\\beta_1 = \\frac{S_{xy}}{S_{xx}}$, **intercept** $\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slides 10–12): 14 points",
          "text": "Totals: $n = 14$, $\\sum x = 1307.5$, $\\sum y = 779.2$, $\\sum x^2 = 128913.93$, $\\sum xy = 71347.3$.\n\n$S_{xx} = 128913.93 - \\frac{1307.5^2}{14} = 6802.77$\n$S_{xy} = 71347.3 - \\frac{1307.5 \\times 779.2}{14} = -1424.41$\nSlope $= \\frac{-1424.41}{6802.77} = -0.2094$. Means: $\\bar x = 93.39$, $\\bar y = 55.66$.\nIntercept $= 55.66 - (-0.2094)(93.39) = 75.21$."
        },
        {
          "type": "answer",
          "value": "ŷ = 75.21 − 0.2094x",
          "text": "In words: every extra unit of x lowers the predicted y by about 0.21. At x = 100, ŷ = 54.27."
        },
        {
          "type": "diagram",
          "name": "i11-line"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Don't predict outside the data",
          "text": "The x values run from 59 to 132. Predicting at x = 300 assumes the line keeps going where we have no data (**extrapolation**). The lecturer: use it “within the range, but not beyond”."
        },
        {
          "type": "check",
          "q": "$S_{xy} = 6$, $S_{xx} = 10$, $\\bar x = 3$, $\\bar y = 4$. The regression line is…",
          "options": [
            "ŷ = 0.6 + 2.2x",
            "ŷ = 2.2 + 0.6x",
            "ŷ = 4 + 0.6x",
            "ŷ = 1.67 + 3x"
          ],
          "answer": 1,
          "why": "Slope $6/10 = 0.6$; intercept $4 - 0.6 \\times 3 = 2.2$."
        }
      ]
    },
    {
      "id": "s-fit",
      "heading": "3. How good is the line? SST, SSE and r²",
      "slides": "11–21",
      "blocks": [
        {
          "type": "p",
          "text": "Take one dot. Its distance from the plain average $\\bar y$ is the **total** gap. The line explains part of it (from $\\bar y$ up to the line); the rest (from the line to the dot) is **left over**. Square and add over all dots:"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Three sums of squares",
          "text": "$$SST = SSR + SSE$$\n- **SST** (total) $= \\sum(y - \\bar y)^2$: how much y varies at all.\n- **SSR** (regression) $= \\sum(\\hat y - \\bar y)^2$: the part the line explains.\n- **SSE** (error) $= \\sum(y - \\hat y)^2$: the part the line misses.\n$$r^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST} \\qquad s^2 = \\frac{SSE}{n - 2}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Back to the 14 points (website calculation)",
          "text": "$SST = 377.17$, $SSE = 78.92$, so $SSR = 298.25$.\n$r^2 = 1 - \\frac{78.92}{377.17} = 0.791$. $s = \\sqrt{78.92/12} = 2.56$."
        },
        {
          "type": "answer",
          "value": "r² = 0.79",
          "text": "The line explains 79% of the variation in y; a typical dot is about 2.6 units off the line."
        },
        {
          "type": "diagram",
          "name": "i11-sst"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Why n − 2?",
          "text": "We used the data to estimate **two** numbers (intercept and slope) before measuring the leftover scatter. Each estimate costs one degree of freedom."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Overfitting (slide 21)",
          "text": "A wiggly curve through every point makes SSE almost 0, but it is copying the noise and will predict new data badly."
        }
      ]
    },
    {
      "id": "s-curves",
      "heading": "4. When the dots curve: transform or use a polynomial",
      "slides": "22–31",
      "blocks": [
        {
          "type": "p",
          "text": "**Option 1: straighten the curve.** Some curves become straight lines after taking logs or reciprocals. Fit an ordinary line to the transformed numbers, then transform back."
        },
        {
          "type": "table",
          "head": [
            "If the curve is…",
            "Transform",
            "You get the line"
          ],
          "rows": [
            [
              "Exponential $y = \\alpha e^{\\beta x}$",
              "$y' = \\ln y$",
              "$y' = \\ln\\alpha + \\beta x$"
            ],
            [
              "Power $y = \\alpha x^{\\beta}$",
              "logs of x **and** y",
              "$y' = \\log\\alpha + \\beta x'$"
            ],
            [
              "$y = \\alpha + \\beta\\log x$",
              "$x' = \\log x$",
              "$y = \\alpha + \\beta x'$"
            ],
            [
              "Reciprocal $y = \\alpha + \\beta/x$",
              "$x' = 1/x$",
              "$y = \\alpha + \\beta x'$"
            ]
          ],
          "caption": "Intrinsically linear models (slide 24)"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slide 27: a power curve",
          "text": "12 points at x = 600, 500, 400. Take $\\ln x$ and $\\ln y$; the line through them has slope **−5.40** and intercept **35.67**. Back-transform: $\\hat\\alpha = e^{35.67} = 3.1 \\times 10^{15}$, so $\\hat y = 3.1 \\times 10^{15}x^{-5.40}$. Fitted values: 3.09, 8.26, 27.58."
        },
        {
          "type": "diagram",
          "name": "i11-power"
        },
        {
          "type": "p",
          "text": "**Option 2: polynomial.** If the data rise then fall (a peak) or fall then rise (a valley), add powers of x: $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ (quadratic, one bend) or up to $x^3$ (cubic, two bends). The lecturer: you rarely need more than $x^3$."
        },
        {
          "type": "check",
          "q": "Which transformation straightens $y = \\alpha e^{\\beta x}$?",
          "options": [
            "1/x",
            "ln y",
            "ln x only",
            "y²"
          ],
          "answer": 1,
          "why": "$\\ln y = \\ln\\alpha + \\beta x$: a straight line in x."
        }
      ]
    },
    {
      "id": "s-corr",
      "heading": "5. Correlation: one number for direction and strength",
      "slides": "32–41",
      "blocks": [
        {
          "type": "callout",
          "kind": "formula",
          "title": "Pearson's r",
          "text": "$$r = \\frac{S_{xy}}{\\sqrt{S_{xx}\\,S_{yy}}} \\qquad S_{yy} = \\sum y^2 - \\frac{(\\sum y)^2}{n}$$ It always lies between −1 and +1."
        },
        {
          "type": "table",
          "head": [
            "r",
            "Meaning"
          ],
          "rows": [
            [
              "close to +1",
              "strong **positive** straight-line link (x up → y up)"
            ],
            [
              "close to −1",
              "strong **negative** link (x up → y down)"
            ],
            [
              "close to 0",
              "no **straight-line** link (there may still be a curve!)"
            ]
          ]
        },
        {
          "type": "diagram",
          "name": "i11-corr"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slide 38",
          "text": "$S_{xx} = 0.025516$, $S_{yy} = 434.5375$, $S_{xy} = 2.3826$.\n$r = \\frac{2.3826}{\\sqrt{0.025516 \\times 434.5375}} = \\frac{2.3826}{3.3298}$"
        },
        {
          "type": "answer",
          "value": "r = 0.7155",
          "text": "A fairly strong positive relationship; $r^2 = 0.51$, so x explains about half of y's variation."
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Square r to interpret it",
          "text": "r = 0.6 is **not** twice as strong as r = 0.3: $0.6^2 = 36\\%$ explained vs $0.3^2 = 9\\%$, four times as much (slide 41)."
        },
        {
          "type": "check",
          "q": "A scatter plot shows a perfect U-shape. r is most likely…",
          "options": [
            "close to +1",
            "close to −1",
            "close to 0",
            "exactly 1"
          ],
          "answer": 2,
          "why": "r only detects straight-line patterns; a U has no overall upward or downward tilt."
        }
      ]
    },
    {
      "id": "s-multi",
      "heading": "6. Two or more predictors: multiple regression",
      "slides": "42–46",
      "blocks": [
        {
          "type": "p",
          "text": "Marks depend on study hours **and** sleep. Multiple regression uses several x's at once: $y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2 + \\epsilon$. Each $\\beta$ is the change in y for one more unit of **that** predictor, **with the others held fixed**."
        },
        {
          "type": "p",
          "text": "**By hand with two predictors (slides 43–46).** The slides name the response x and the predictors $y_1$, $y_2$. Compute five “corrected sums” (each is a total minus a correction, like $S_{xy}$), plug them into the formulas for $b_1$ and $b_2$, then $b_0 = \\bar x - b_1\\bar y_1 - b_2\\bar y_2$."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slides 44–46 (22 rows)",
          "text": "Corrected sums: $\\Sigma y_1^2 = 134.77$, $\\Sigma y_2^2 = 5616.95$, $\\Sigma y_1x = -53.95$, $\\Sigma y_2x = 220.14$, $\\Sigma y_1y_2 = -137.68$.\n$b_1 = \\frac{5616.95(-53.95) - (-137.68)(220.14)}{134.77(5616.95) - 137.68^2} = -0.3696$, $b_2 = 0.0301$, $b_0 = 5.867$."
        },
        {
          "type": "answer",
          "value": "x̂ = 5.867 − 0.3696 y₁ + 0.0301 y₂"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Slide 46's final equation doesn't match its data",
          "text": "The slide prints $0.45898 - 0.0018y_1 + 0.12013y_2$. Its own sums and formulas (and a computer fit) give the equation above. Use ours."
        }
      ]
    },
    {
      "id": "s-logit",
      "heading": "7. Yes/no outcomes: logistic regression",
      "slides": "47–49",
      "blocks": [
        {
          "type": "p",
          "text": "Pass or fail? Buy or not? We want a **probability**, which must stay between 0 and 1, but a straight line shoots past both. Logistic regression bends the line into an **S-curve**:"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The logit model (slides 47–49)",
          "text": "$$p(x) = \\frac{e^{\\beta_0 + \\beta_1x}}{1 + e^{\\beta_0 + \\beta_1x}} \\qquad \\text{odds} = \\frac{p}{1 - p} = e^{\\beta_0 + \\beta_1x}$$ So the **log of the odds** is a straight line in x. $\\beta_1 > 0$: the chance of success rises with x. Each extra unit of x multiplies the odds by $e^{\\beta_1}$ (the **odds ratio**)."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Illustration (website numbers)",
          "text": "$\\beta_0 = -3$, $\\beta_1 = 0.5$. At $x = 6$ the exponent is 0, so $p = \\frac{1}{1 + 1} = 0.5$. At $x = 4$: $p = \\frac{e^{-1}}{1 + e^{-1}} = 0.27$. At $x = 8$: $p = 0.73$."
        },
        {
          "type": "check",
          "q": "In logistic regression, p = 0.5 exactly when…",
          "options": [
            "x = 0",
            "β₀ + β₁x = 0",
            "β₁ = 1",
            "x = β₁"
          ],
          "answer": 1,
          "why": "Then $e^0 = 1$ and $p = 1/(1 + 1) = 0.5$."
        }
      ]
    },
    {
      "id": "s-test",
      "heading": "8. Test your understanding",
      "slides": "",
      "blocks": [
        {
          "type": "check",
          "q": "The least-squares line always passes through…",
          "options": [
            "(0, 0)",
            "(x̄, ȳ)",
            "the highest point",
            "(1, β₁)"
          ],
          "answer": 1,
          "why": "Because $\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$."
        },
        {
          "type": "check",
          "q": "SSE = 20, SST = 80. r²?",
          "options": [
            "0.25",
            "0.75",
            "0.8",
            "4"
          ],
          "answer": 1,
          "why": "$1 - 20/80 = 0.75$."
        },
        {
          "type": "check",
          "q": "The slope is negative. r must be…",
          "options": [
            "positive",
            "negative",
            "zero",
            "could be either"
          ],
          "answer": 1,
          "why": "In simple regression r and the slope always share their sign."
        },
        {
          "type": "check",
          "q": "To fit $y = \\alpha x^{\\beta}$ you take logs of…",
          "options": [
            "y only",
            "x only",
            "both x and y",
            "neither"
          ],
          "answer": 2,
          "why": "$\\log y = \\log\\alpha + \\beta\\log x$."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "9. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Table first:** x, y, x², y², xy and their totals.\n- **Slope** $= S_{xy}/S_{xx}$; **intercept** $= \\bar y - \\text{slope} \\times \\bar x$; say the slope in words.\n- **SST = SSR + SSE**; $r^2 = 1 - SSE/SST$ (share explained); $s^2 = SSE/(n - 2)$.\n- $r = S_{xy}/\\sqrt{S_{xx}S_{yy}}$; same sign as the slope; square it to interpret.\n- Curved data: transform (log, 1/x) or add $x^2$, $x^3$. Yes/no outcome: logistic S-curve.\n- Memory hook: **“Squares make the line, r² grades the line.”**"
        }
      ]
    }
  ],

  summary: [
    {
      id: "slr",
      heading: "Lesson 1: Drawing the best straight line: simple linear regression",
      slides: "3–12",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to find the one straight line that sits closest to a cloud of points, and how to use it to predict.",
        },
        {
          type: "p",
          text: "**The goal (slide 3).** Use x (which we know or control) to learn about y (which is random). The relationship is not exact: two cars with the same engine size still differ in mileage. So we model y as **a straight line plus noise** (slide 6):",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The linear probabilistic model (slides 4, 6)",
          text: "$$Y = \\beta_0 + \\beta_1 x + \\epsilon$$\nRead it aloud: “y equals beta-nought plus beta-one times x, plus epsilon.”\n- $x$: the **independent / predictor / explanatory** variable (fixed by the experimenter).\n- $Y$: the **dependent / response** variable (random).\n- $\\beta_0$ (intercept): the value of y when $x = 0$. $\\beta_1$ (slope): how much y changes when x rises by 1.\n- $\\epsilon$ (epsilon): the **random error**, positive or negative, that pushes points above or below the true line. Its spread is $\\sigma^2$.",
        },
        {
          type: "p",
          text: "**Look first (slides 4–5).** Always draw a **scatter plot**: one dot per $(x_i, y_i)$ pair. If the dots drift up or down in a rough band, a straight line is sensible.",
        },
        {
          type: "p",
          text: "**Least squares (slides 7–8).** For any candidate line $y = b_0 + b_1x$, the **residual** of a point is its vertical gap $e_i = y_i - (b_0 + b_1x_i)$. Some gaps are positive, some negative, so we square them (no cancelling, and big misses are punished more) and add them up. The **least-squares line** is the one with the smallest total: $\\sum (y_i - b_0 - b_1x_i)^2$. Setting the two partial derivatives to zero gives the **normal equations**:\n$$nb_0 + b_1\\sum x_i = \\sum y_i \\qquad b_0\\sum x_i + b_1\\sum x_i^2 = \\sum x_iy_i$$\nThey have one unique solution as long as not all $x_i$ are identical.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The estimates you actually use (slides 9, 20)",
          text: "$$S_{xx} = \\sum x_i^2 - \\frac{(\\sum x_i)^2}{n} \\qquad S_{xy} = \\sum x_iy_i - \\frac{(\\sum x_i)(\\sum y_i)}{n}$$\n$$\\hat\\beta_1 = b_1 = \\frac{S_{xy}}{S_{xx}} \\qquad \\hat\\beta_0 = b_0 = \\bar y - \\hat\\beta_1\\bar x \\qquad \\hat y = \\hat\\beta_0 + \\hat\\beta_1x$$\n“Beta-hat” means an **estimate** from the sample. $S_{xx}$ measures the spread of x; $S_{xy}$ measures how x and y move together.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 10–12): 14 data points",
          text: "Column totals from the slide: $n = 14$, $\\sum x = 1307.5$, $\\sum y = 779.2$, $\\sum x^2 = 128913.93$, $\\sum xy = 71347.3$.\n\n**Step 1: the two S’s.** $S_{xx} = 128913.93 - \\frac{1307.5^2}{14} = 6802.7693$. $S_{xy} = 71347.3 - \\frac{1307.5 \\times 779.2}{14} = -1424.4143$.\n**Step 2: slope.** $\\hat\\beta_1 = \\frac{-1424.4143}{6802.7693} = -0.20938742$.\n**Step 3: intercept.** $\\bar x = 93.392857$, $\\bar y = 55.657143$, so $\\hat\\beta_0 = 55.657143 - (-0.20938742)(93.392857) = 75.212432$.\n**Line:** $\\hat y = 75.212432 - 0.20938742x$. Each extra unit of x lowers the predicted y by about 0.21.",
        },
        { type: "diagram", name: "i11-line" },
        {
          type: "callout",
          kind: "warn",
          title: "Predict inside the data range only (slide 12)",
          text: "The data run from $x = 59$ to $x = 132$. Predicting at $x = 100$ is fine ($\\hat y = 54.27$). Predicting at $x = 300$ (**extrapolation**) assumes the straight line continues where we have no evidence; the slide says the equation can be used “within the range, but not beyond the range”.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Slope $= S_{xy}/S_{xx}$, intercept $= \\bar y - \\text{slope} \\times \\bar x$. The line always passes through $(\\bar x, \\bar y)$.",
        },
      ],
    },
    {
      id: "fit",
      heading: "Lesson 2: How good is the line? SSE, SST, SSR and r²",
      slides: "11, 13–21",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to measure the scatter left over after fitting the line, and what fraction of y’s variation the line explains.",
        },
        {
          type: "p",
          text: "**Picture it (slide 11).** Take one point. Its distance from the plain average $\\bar y$ (**A**, total) splits into two pieces: from $\\bar y$ up to the line (**B**, the part the line explains) and from the line to the point (**C**, the part left unexplained). Square and add over all points:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The three sums of squares (slides 11, 14, 16, 19)",
          text: "$$\\underbrace{\\sum(y_i - \\bar y)^2}_{SST\\ (=S_{yy})} = \\underbrace{\\sum(\\hat y_i - \\bar y)^2}_{SSR} + \\underbrace{\\sum(y_i - \\hat y_i)^2}_{SSE}$$\n- **SST** (total): how much y varies at all, measured around the flat line $\\bar y$. Shortcut $S_{yy} = \\sum y_i^2 - (\\sum y_i)^2/n$.\n- **SSR** (regression): the part explained by x.\n- **SSE** (error / residual): the part the line misses. Shortcut $SSE = \\sum y_i^2 - \\hat\\beta_0\\sum y_i - \\hat\\beta_1\\sum x_iy_i$ (slide 14).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Coefficient of determination and the error variance (slides 14, 18–19)",
          text: "$$r^2 = 1 - \\frac{SSE}{SST} = \\frac{SSR}{SST} \\qquad \\hat\\sigma^2 = s^2 = \\frac{SSE}{n - 2}$$\n$r^2$ is the **proportion of the variation in y explained by the line**, between 0 and 1. We divide SSE by $n - 2$ because two parameters ($\\beta_0$, $\\beta_1$) were estimated first, costing 2 degrees of freedom.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Continuing the 14-point example (Exercise solution prepared for the website)",
          text: "$\\sum y^2 = 43745.22$, so $SST = 43745.22 - \\frac{779.2^2}{14} = 377.17$.\n$SSE = 43745.22 - 75.212432(779.2) - (-0.20938742)(71347.3) = 78.92$.\n$SSR = 377.17 - 78.92 = 298.25$.\n$r^2 = 1 - \\frac{78.92}{377.17} = 0.791$: the line explains about **79%** of the variation in y.\n$s^2 = \\frac{78.92}{12} = 6.58$, $s = 2.56$: a typical point sits about 2.6 units from the line.",
        },
        { type: "diagram", name: "i11-sst" },
        {
          type: "p",
          text: "**Three pictures (slide 15).** (a) Every point on the line: SSE = 0, $r^2 = 1$. (b) Points close to the line: SSE small. (c) Points scattered widely: SSE large, $r^2$ small, so a straight line in x is a poor explanation; try a non-linear or multiple regression (slide 19). The residuals of a least-squares line always **add up to zero** (slide 14), apart from rounding.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Overfitting (slide 21)",
          text: "A wiggly curve through every training point makes SSE (the slide calls it RSS) tiny, but it is fitting the noise, so it predicts **new** data badly. Prefer the simplest model that captures the pattern.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "SST = SSR + SSE. $r^2$ = explained / total. $s^2 = SSE/(n - 2)$.",
        },
      ],
    },
    {
      id: "nonlinear",
      heading: "Lesson 3: When the pattern bends: transformations and polynomial regression",
      slides: "22–31",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Two ways to handle curved data: straighten it with logs or reciprocals, or fit a polynomial.",
        },
        {
          type: "p",
          text: "**Two options (slide 22).** If a straight line fits badly, either (1) replace the line by a curve in x (**intrinsically linear** models or **polynomial** regression), or (2) add more predictors (**multiple regression**, Lesson 5). First plot the data and the fitted curve together and look for tilt or curvature that the model misses (slide 23).",
        },
        {
          type: "table",
          caption: "Useful intrinsically linear functions (slides 24–25)",
          head: ["Model", "Transform", "Straight-line form"],
          rows: [
            ["Exponential $y = \\alpha e^{\\beta x}$", "$y' = \\ln y$", "$y' = \\ln\\alpha + \\beta x$"],
            ["Power $y = \\alpha x^{\\beta}$", "$y' = \\log y$, $x' = \\log x$", "$y' = \\log\\alpha + \\beta x'$"],
            ["$y = \\alpha + \\beta\\log x$", "$x' = \\log x$", "$y = \\alpha + \\beta x'$"],
            ["Reciprocal $y = \\alpha + \\beta\\frac{1}{x}$", "$x' = 1/x$", "$y = \\alpha + \\beta x'$"],
          ],
        },
        {
          type: "p",
          text: "**Intrinsically linear** (slide 24) means: after transforming x and/or y, the model becomes $y' = \\beta_0 + \\beta_1x'$. Then the ordinary least-squares formulas from Lesson 1 apply to $(x', y')$, and you transform back to get the original parameters (slide 26). Models like $y = \\alpha + \\gamma e^{\\beta x}$ or $y = \\alpha + \\gamma x^{\\beta}$ cannot be straightened this way (slide 28).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slide 27): a power model",
          text: "12 points at $x = 600, 500, 400$ with y falling steeply. Fit $y = \\alpha x^{\\beta}$.\n**Step 1.** Take logs: $x' = \\ln x$, $y' = \\ln y$, so $y' = \\ln\\alpha + \\beta x'$.\n**Step 2.** Least squares on $(x', y')$: $\\hat\\beta = -5.39974$, intercept $\\ln\\hat\\alpha = 35.66931$.\n**Step 3.** Back-transform: $\\hat\\alpha = e^{35.66931} = 3.097 \\times 10^{15}$.\n**Model:** $\\hat y = 3.097 \\times 10^{15}\\,x^{-5.39974}$, giving fitted values 3.088 (x = 600), 8.265 (x = 500) and 27.576 (x = 400).",
        },
        { type: "diagram", name: "i11-power" },
        {
          type: "callout",
          kind: "formula",
          title: "Polynomial regression (slides 29–31)",
          text: "For data with a peak or a valley:\n$$Y = \\beta_0 + \\beta_1x + \\beta_2x^2 + \\dots + \\beta_kx^k + \\epsilon, \\qquad \\epsilon \\sim N(0, \\sigma^2)$$\nLeast squares gives $k + 1$ normal equations, e.g. for $k = 2$:\n$$b_0n + b_1\\sum x + b_2\\sum x^2 = \\sum y$$ $$b_0\\sum x + b_1\\sum x^2 + b_2\\sum x^3 = \\sum xy$$ $$b_0\\sum x^2 + b_1\\sum x^3 + b_2\\sum x^4 = \\sum x^2y$$\n$k = 2$ is **quadratic** (one bend), $k = 3$ is **cubic** (two bends). “Very rarely in practice is it necessary to go beyond $k = 3$.”",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Curved but always rising or falling → transform (log, reciprocal) and fit a line. Has a peak or valley → polynomial.",
        },
      ],
    },
    {
      id: "corr",
      heading: "Lesson 4: How strongly do x and y move together? Correlation",
      slides: "32–41",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A single number, Pearson’s r, that measures the direction and strength of a straight-line relationship.",
        },
        {
          type: "p",
          text: "**Three types (slide 33).** **Positive**: high x goes with high y. **Negative**: high x goes with low y. **None**: no consistent tendency.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Covariance and Pearson’s correlation coefficient (slides 34–36)",
          text: "$$\\text{Cov}(x, y) = \\frac{\\sum(x_i - \\bar x)(y_i - \\bar y)}{n - 1}$$\n$$r = \\frac{\\text{Cov}(x, y)}{\\sqrt{\\text{Var}\\,x}\\,\\sqrt{\\text{Var}\\,y}} = \\frac{S_{xy}}{\\sqrt{S_{xx}\\,S_{yy}}}$$\nThe $n - 1$’s cancel (the lecturer crosses them out on slide 35), leaving the easy form on the right. Covariance’s sign gives the direction, but its size depends on units; dividing by both standard deviations turns it into r, which always lies between −1 and +1.",
        },
        { type: "diagram", name: "i11-corr" },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slide 38): 16 pairs",
          text: "From the table: $S_{xx} = 0.025516$, $S_{yy} = 434.5375$, $S_{xy} = 2.3826$.\n$$r = \\frac{2.3826}{\\sqrt{0.025516 \\times 434.5375}} = \\frac{2.3826}{3.3298} = 0.7155$$\nA fairly strong **positive** linear relationship. $r^2 = 0.512$: about 51% of y’s variation is explained by x.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Careful with r (slides 37, 39)",
          text: "- r measures **linear** association only. $r \\approx 0$ does not mean “no relationship”; there may be a strong curve.\n- Extreme values (outliers) can change r a lot.\n- r is hard to interpret directly, so square it.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Coefficient of determination, r² (slides 40–41)",
          text: "$r^2$ = explained variation / total variation. If $r = 0.9$, $r^2 = 0.81$: 81% of the variation in y is explained by x. If $r = 0.6$, $r^2 = 0.36$; if $r = 0.3$, $r^2 = 0.09$. So $r = 0.6$ is **not** “twice as strong” as $r = 0.3$: it explains **four times** as much (36% vs 9%).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$r = S_{xy}/\\sqrt{S_{xx}S_{yy}}$, between −1 and 1. Sign = direction, size = strength. In simple regression, r has the same sign as the slope and $r^2 = SSR/SST$.",
        },
      ],
    },
    {
      id: "multiple",
      heading: "Lesson 5: More than one predictor: multiple linear regression",
      slides: "42–46",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to predict one variable from two predictors at once, and the hand formulas for the two-predictor case.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The model (slide 42)",
          text: "$$y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2 + \\dots + \\beta_kx_k + \\epsilon$$\nEach $\\beta_j$ is the change in y when $x_j$ rises by 1 **while the other predictors stay fixed**. (The slide writes $k > 2$; the model works for any $k \\ge 2$.)",
        },
        {
          type: "p",
          text: "**Two predictors by hand (slides 43–46).** The slides call the response **x** and the two predictors **y₁, y₂**, so the model is $\\hat x = b_0 + b_1y_1 + b_2y_2$. First compute the five “regression sums” (each is a sum minus a correction, like $S_{xy}$):",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Two-predictor formulas (slides 43, 46)",
          text: "$$\\Sigma y_1^2 = \\sum y_1^2 - \\frac{(\\sum y_1)^2}{n}, \\quad \\Sigma y_2^2 = \\sum y_2^2 - \\frac{(\\sum y_2)^2}{n}, \\quad \\Sigma y_1y_2 = \\sum y_1y_2 - \\frac{\\sum y_1\\sum y_2}{n}$$\n$$\\Sigma y_1x = \\sum y_1x - \\frac{\\sum y_1\\sum x}{n}, \\quad \\Sigma y_2x = \\sum y_2x - \\frac{\\sum y_2\\sum x}{n}$$\n$$b_1 = \\frac{(\\Sigma y_2^2)(\\Sigma y_1x) - (\\Sigma y_1y_2)(\\Sigma y_2x)}{(\\Sigma y_1^2)(\\Sigma y_2^2) - (\\Sigma y_1y_2)^2} \\qquad b_2 = \\frac{(\\Sigma y_1^2)(\\Sigma y_2x) - (\\Sigma y_1y_2)(\\Sigma y_1x)}{(\\Sigma y_1^2)(\\Sigma y_2^2) - (\\Sigma y_1y_2)^2}$$\n$$b_0 = \\bar x - b_1\\bar y_1 - b_2\\bar y_2$$",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 44–46): 22 observations",
          text: "Totals: $\\sum x = 129$, $\\sum y_1 = 81$, $\\sum y_2 = 991$, $\\sum y_1^2 = 433$, $\\sum y_2^2 = 50257$, $\\sum xy_1 = 421$, $\\sum xy_2 = 6031$, $\\sum y_1y_2 = 3511$.\n**Regression sums:** $\\Sigma y_1^2 = 134.7727$, $\\Sigma y_2^2 = 5616.9545$, $\\Sigma y_1x = -53.9545$, $\\Sigma y_2x = 220.1364$, $\\Sigma y_1y_2 = 3511 - \\frac{81 \\times 991}{22} = -137.6818$.\n**Denominator:** $134.7727 \\times 5616.9545 - (-137.6818)^2 = 738056$.\n$b_1 = \\frac{5616.9545(-53.9545) - (-137.6818)(220.1364)}{738056} = -0.3696$\n$b_2 = \\frac{134.7727(220.1364) - (-137.6818)(-53.9545)}{738056} = 0.0301$\n$b_0 = 5.8636 - (-0.3696)(3.6818) - 0.0301(45.0455) = 5.8669$\n**Model:** $\\hat x = 5.867 - 0.3696\\,y_1 + 0.0301\\,y_2$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): the final equation on slide 46",
          text: "Slide 46 states $\\hat Y = 0.45898 - 0.0018y_1 + 0.12013y_2$. Plugging the slide’s own regression sums (slide 45) into the slide’s own formulas gives $b_1 = -0.3696$, $b_2 = 0.0301$, $b_0 = 5.867$, and a computer least-squares fit of the 22 rows agrees. The slide’s numbers don’t come from this data (we also tried regressing $y_1$ or $y_2$ on the others), so use $\\hat x = 5.867 - 0.3696y_1 + 0.0301y_2$.",
        },
        {
          type: "p",
          text: "**Linear vs non-linear (slide 46).** This model is linear: it is a sum of predictors times coefficients. Non-linear models with several variables include logistic, quadratic and probit regression.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Five regression sums → one shared denominator → $b_1$, $b_2$ → $b_0 = \\bar x - b_1\\bar y_1 - b_2\\bar y_2$.",
        },
      ],
    },
    {
      id: "logistic",
      heading: "Lesson 6: Yes/no outcomes: logistic regression",
      slides: "47–49",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Why a straight line fails for a 0/1 outcome, and the S-shaped curve used instead.",
        },
        {
          type: "p",
          text: "**The problem (slide 47).** When the outcome is categorical (pass/fail, yes/no, 1/0), we want the **probability** of success, $p(x)$, which must stay between 0 and 1. A straight line would eventually go below 0 or above 1. The predictors can be categorical or continuous.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The logit function (slides 47–49)",
          text: "$$p(x) = \\frac{e^{\\beta_0 + \\beta_1x}}{1 + e^{\\beta_0 + \\beta_1x}} \\qquad \\frac{p(x)}{1 - p(x)} = e^{\\beta_0 + \\beta_1x}$$\nThe left curve is S-shaped between 0 and 1. The ratio $\\frac{p}{1 - p}$ is the **odds** of success. Taking logs, $\\ln\\frac{p}{1 - p} = \\beta_0 + \\beta_1x$: the **log-odds** is a straight line in x. If $\\beta_1 > 0$ the success probability rises with x; if $\\beta_1 < 0$ it falls (slide 48). Each one-unit rise in x multiplies the odds by $e^{\\beta_1}$, the **odds ratio** (slide 47).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Illustration (Exercise solution prepared for the website)",
          text: "Suppose $\\beta_0 = -3$, $\\beta_1 = 0.5$. At $x = 4$: $\\beta_0 + \\beta_1x = -1$, so $p = \\frac{e^{-1}}{1 + e^{-1}} = 0.269$. At $x = 6$: the exponent is 0, so $p = \\frac{1}{2}$. At $x = 8$: $p = 0.731$. Each extra unit of x multiplies the odds by $e^{0.5} = 1.65$.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Logistic = probability of a yes. Log-odds is linear in x. $p = 0.5$ where $\\beta_0 + \\beta_1x = 0$.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Lec11 on one screen",
      head: ["Tool", "Key formula"],
      rows: [
        ["Building blocks", "$S_{xx} = \\sum x^2 - \\frac{(\\sum x)^2}{n}$, $S_{yy} = \\sum y^2 - \\frac{(\\sum y)^2}{n}$, $S_{xy} = \\sum xy - \\frac{\\sum x\\sum y}{n}$"],
        ["Least-squares line", "$\\hat\\beta_1 = S_{xy}/S_{xx}$, $\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$"],
        ["Sums of squares", "$SST = S_{yy} = SSR + SSE$; $SSE = \\sum(y - \\hat y)^2$"],
        ["Goodness of fit", "$r^2 = 1 - SSE/SST$; $s^2 = SSE/(n - 2)$"],
        ["Correlation", "$r = S_{xy}/\\sqrt{S_{xx}S_{yy}}$, $-1 \\le r \\le 1$"],
        ["Transformations", "exponential: $\\ln y$; power: $\\ln y$ and $\\ln x$; reciprocal: $1/x$"],
        ["Polynomial", "$y = \\beta_0 + \\beta_1x + \\dots + \\beta_kx^k$; k + 1 normal equations"],
        ["Two predictors", "$b_1$, $b_2$ from the five regression sums; $b_0 = \\bar x - b_1\\bar y_1 - b_2\\bar y_2$"],
        ["Logistic", "$p = \\frac{e^{\\beta_0 + \\beta_1x}}{1 + e^{\\beta_0 + \\beta_1x}}$, odds $= e^{\\beta_0 + \\beta_1x}$"],
      ],
    },
    { type: "diagram", name: "i11-sst" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Build the $x^2$, $y^2$, $xy$ table first · keep 4+ decimals in $S_{xx}$, $S_{xy}$ · state the line in words (slope meaning) · don't extrapolate · divide SSE by $n - 2$ · r and the slope share a sign.",
    },
  ],

  glossary: [
    ["Regression", "", "Modelling how a response y depends on predictor(s) x, to predict y"],
    ["Predictor / response", "Independent / dependent variable", "x (fixed or known) / Y (random)"],
    ["$\\beta_0$, $\\beta_1$", "Beta-nought, beta-one", "True intercept and slope; $\\hat\\beta$ are the sample estimates"],
    ["$\\epsilon$", "Epsilon, the random error", "Vertical deviation of Y from the true line, mean 0, variance $\\sigma^2$"],
    ["Residual", "", "$e_i = y_i - \\hat y_i$, observed minus fitted"],
    ["Least squares", "", "Choose the line that minimises the sum of squared residuals"],
    ["Normal equations", "", "The equations obtained by setting the partial derivatives of SSE to zero"],
    ["SST, SSR, SSE", "Total / regression / error sum of squares", "SST = SSR + SSE"],
    ["$r^2$", "Coefficient of determination", "Proportion of the variation in y explained by the model"],
    ["$s^2$", "Estimate of $\\sigma^2$", "$SSE/(n - 2)$"],
    ["Extrapolation", "", "Predicting outside the range of the observed x values (unsafe)"],
    ["Overfitting", "", "Fitting the noise in the training data; poor predictions on new data"],
    ["Intrinsically linear", "", "A curve that becomes a straight line after transforming x and/or y"],
    ["Polynomial regression", "", "$y = \\beta_0 + \\beta_1x + \\dots + \\beta_kx^k$, for data with peaks or valleys"],
    ["Covariance", "", "Average product of deviations; sign shows the direction of joint movement"],
    ["r", "Pearson product-moment correlation coefficient", "Strength and direction of the linear relation, between −1 and 1"],
    ["Multiple regression", "", "Regression with two or more predictors"],
    ["Logistic regression", "", "Models the probability of a binary outcome with the logit (S-shaped) function"],
    ["Odds, odds ratio", "", "$p/(1 - p)$; the factor $e^{\\beta_1}$ by which odds change per unit of x"],
  ],

  examTips: [
    "Always build the table x, y, x², y², xy and its column totals first; every formula in this lecture uses those five totals.",
    "Write the answer as an equation AND in words: “for every 1-unit increase in x, y changes by $\\hat\\beta_1$ on average”.",
    "If asked “how good is the fit?”, give $r^2$ as a percentage of variation explained.",
    "r and the slope always have the same sign; if they don't, recheck $S_{xy}$.",
    "For a power or exponential model, transform, fit a line, then transform back; state the final curved equation.",
  ],

  problems: [
    {
      title: "Least-squares line (slides 10–12)",
      level: "From slides",
      question: "$n = 14$, $\\sum x = 1307.5$, $\\sum y = 779.2$, $\\sum x^2 = 128913.93$, $\\sum xy = 71347.3$. Find the least-squares regression line.",
      solution: "### Approach\nCompute $S_{xx}$ and $S_{xy}$, then slope $= S_{xy}/S_{xx}$ and intercept $= \\bar y - \\text{slope} \\cdot \\bar x$.\n### Working\n$S_{xx} = 128913.93 - 1307.5^2/14 = 6802.7693$\n$S_{xy} = 71347.3 - (1307.5)(779.2)/14 = -1424.4143$\n$\\hat\\beta_1 = -1424.4143/6802.7693 = -0.20938742$\n$\\hat\\beta_0 = 55.657143 - (-0.20938742)(93.392857) = 75.212432$\n### Answer\n$\\hat y = 75.2124 - 0.2094x$: y falls by about 0.21 per unit of x.",
    },
    {
      title: "Prediction and residual (slides 10–14)",
      level: "Level 1",
      question: "Using $\\hat y = 75.212432 - 0.20938742x$: (a) predict y at $x = 100$; (b) the first data point is $(132, 46)$. Find its residual. Is the point above or below the line?",
      solution: "### Formula\n$\\hat y = \\hat\\beta_0 + \\hat\\beta_1x$; residual $= y - \\hat y$.\n### Working\n(a) $75.212432 - 20.938742 = 54.27$.\n(b) $\\hat y = 75.212432 - 0.20938742(132) = 47.573$; residual $= 46 - 47.573 = -1.573$.\n### Answer\n(a) **54.27**. (b) **−1.573**: negative, so the point lies **below** the line. (Exercise solution prepared for the website.)",
    },
    {
      title: "SST, SSE, r² and s (slides 14–19)",
      level: "Level 2",
      question: "For the same 14 points, $\\sum y^2 = 43745.22$. Find SST, SSE, SSR, $r^2$ and $s$, and interpret $r^2$.",
      solution: "### Formulas\n$SST = \\sum y^2 - (\\sum y)^2/n$; $SSE = \\sum y^2 - \\hat\\beta_0\\sum y - \\hat\\beta_1\\sum xy$; $r^2 = 1 - SSE/SST$; $s = \\sqrt{SSE/(n - 2)}$.\n### Working\n$SST = 43745.22 - 779.2^2/14 = 377.17$\n$SSE = 43745.22 - 75.212432(779.2) + 0.20938742(71347.3) = 78.92$\n$SSR = 377.17 - 78.92 = 298.25$\n$r^2 = 1 - 78.92/377.17 = 0.791$; $s^2 = 78.92/12 = 6.577$, $s = 2.564$\n### Interpretation\nThe line explains **79.1%** of the variation in y; typical scatter about the line is about **2.56** units. (Exercise solution prepared for the website.)",
    },
    {
      title: "A small line by hand",
      level: "Level 1",
      question: "x: 1, 2, 3, 4, 5; y: 2, 4, 5, 4, 5. Find the regression line, SSE, $r^2$ and r.",
      solution: "### Totals\n$\\sum x = 15$, $\\sum y = 20$, $\\sum x^2 = 55$, $\\sum y^2 = 86$, $\\sum xy = 66$.\n### Working\n$S_{xx} = 55 - 225/5 = 10$; $S_{xy} = 66 - 300/5 = 6$; $S_{yy} = 86 - 400/5 = 6$.\n$\\hat\\beta_1 = 0.6$; $\\hat\\beta_0 = 4 - 0.6(3) = 2.2$ → $\\hat y = 2.2 + 0.6x$.\n$SSE = S_{yy} - \\hat\\beta_1S_{xy} = 6 - 3.6 = 2.4$; $r^2 = 1 - 2.4/6 = 0.6$; $r = 6/\\sqrt{10 \\times 6} = 0.775$.\n### Answer\n$\\hat y = 2.2 + 0.6x$, SSE = 2.4, $r^2 = 0.60$, r = **0.775**. (Exercise solution prepared for the website.)",
    },
    {
      title: "Correlation coefficient (slide 38)",
      level: "From slides",
      question: "16 pairs give $S_{xx} = 0.025516$, $S_{yy} = 434.5375$, $S_{xy} = 2.3826$. Find r and $r^2$ and interpret.",
      solution: "### Formula\n$r = S_{xy}/\\sqrt{S_{xx}S_{yy}}$.\n### Working\n$\\sqrt{0.025516 \\times 434.5375} = 3.3298$; $r = 2.3826/3.3298 = 0.7155$; $r^2 = 0.512$.\n### Interpretation\nModerately strong **positive** linear relation; x explains about **51%** of the variation in y.",
    },
    {
      title: "Comparing correlations (slides 40–41)",
      level: "From slides",
      question: "Study A has $r = 0.6$, study B has $r = 0.3$. Is A twice as strong as B?",
      solution: "### Approach\nCompare $r^2$, the share of variation explained.\n### Working\n$0.6^2 = 0.36$; $0.3^2 = 0.09$.\n### Answer\nNo. A explains **36%** of the variation, B only **9%**: four times as much, not twice.",
    },
    {
      title: "Power model by transformation (slide 27)",
      level: "From slides",
      question: "Fitting $y = \\alpha x^{\\beta}$ to 12 points, least squares on $x' = \\ln x$, $y' = \\ln y$ gives slope −5.39974 and intercept 35.66931. Write the fitted model and predict y at $x = 500$.",
      solution: "### Approach\n$\\ln y = \\ln\\alpha + \\beta\\ln x$, so slope $= \\hat\\beta$ and intercept $= \\ln\\hat\\alpha$.\n### Working\n$\\hat\\beta = -5.39974$; $\\hat\\alpha = e^{35.66931} = 3.097 \\times 10^{15}$.\n$\\hat y(500) = 3.097 \\times 10^{15} \\times 500^{-5.39974} = 8.265$.\n### Answer\n$\\hat y = 3.097 \\times 10^{15}x^{-5.39974}$; at x = 500, **ŷ ≈ 8.26** (slide: 8.264962651).",
    },
    {
      title: "Which transformation? (slides 24–25)",
      level: "Level 1",
      question: "Give the transformation that makes each model linear: (a) $y = \\alpha e^{\\beta x}$; (b) $y = \\alpha + \\beta/x$; (c) $y = \\alpha x^{\\beta}$.",
      solution: "(a) $y' = \\ln y$: $\\ln y = \\ln\\alpha + \\beta x$.\n(b) $x' = 1/x$: $y = \\alpha + \\beta x'$.\n(c) $y' = \\log y$, $x' = \\log x$: $y' = \\log\\alpha + \\beta x'$.",
    },
    {
      title: "Multiple regression, two predictors (slides 44–46)",
      level: "From slides",
      question: "22 observations: $\\sum x = 129$, $\\sum y_1 = 81$, $\\sum y_2 = 991$, $\\sum y_1^2 = 433$, $\\sum y_2^2 = 50257$, $\\sum xy_1 = 421$, $\\sum xy_2 = 6031$, $\\sum y_1y_2 = 3511$. Fit $\\hat x = b_0 + b_1y_1 + b_2y_2$ and predict x when $y_1 = 3$, $y_2 = 40$.",
      solution: "### Regression sums\n$\\Sigma y_1^2 = 134.7727$, $\\Sigma y_2^2 = 5616.9545$, $\\Sigma y_1x = -53.9545$, $\\Sigma y_2x = 220.1364$, $\\Sigma y_1y_2 = -137.6818$.\n### Coefficients\nDenominator $= 134.7727(5616.9545) - 137.6818^2 = 738056$.\n$b_1 = [5616.9545(-53.9545) - (-137.6818)(220.1364)]/738056 = -0.3696$\n$b_2 = [134.7727(220.1364) - (-137.6818)(-53.9545)]/738056 = 0.0301$\n$b_0 = 5.8636 + 0.3696(3.6818) - 0.0301(45.0455) = 5.867$\n### Answer\n$\\hat x = 5.867 - 0.3696y_1 + 0.0301y_2$; at (3, 40): $5.867 - 1.109 + 1.205 =$ **5.96**.\n⚠️ Slide 46 prints $0.45898 - 0.0018y_1 + 0.12013y_2$, which does not follow from its own sums.",
    },
    {
      title: "Logistic regression probabilities",
      level: "Level 2",
      question: "A logistic model has $\\beta_0 = -3$, $\\beta_1 = 0.5$. Find $p(x)$ at $x = 4$ and $x = 6$, and the odds ratio for a one-unit increase in x.",
      solution: "### Formula\n$p(x) = e^{\\beta_0 + \\beta_1x}/(1 + e^{\\beta_0 + \\beta_1x})$; odds ratio $= e^{\\beta_1}$.\n### Working\n$x = 4$: exponent −1 → $p = 0.3679/1.3679 = 0.269$. $x = 6$: exponent 0 → $p = 1/2$.\n$e^{0.5} = 1.649$.\n### Answer\n**0.269**, **0.5**; each extra unit of x multiplies the odds of success by **1.65**. (Exercise solution prepared for the website.)",
    },
  ],

  theory: [
    {
      title: "The least-squares principle",
      level: "Level 1",
      question: "Explain the principle of least squares and why residuals are squared.",
      solution: "For a candidate line $y = b_0 + b_1x$, each point has a vertical deviation (residual) $e_i = y_i - (b_0 + b_1x_i)$. Least squares chooses $b_0$, $b_1$ to minimise $\\sum e_i^2$ (slide 7). Squaring stops positive and negative residuals cancelling and punishes large misses more. Differentiating with respect to $b_0$ and $b_1$ and setting to zero gives the normal equations, whose unique solution is $\\hat\\beta_1 = S_{xy}/S_{xx}$, $\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$ (slides 8–9).",
    },
    {
      title: "SST, SSR, SSE and r²",
      level: "Level 2",
      question: "Define SST, SSR and SSE, state their relationship, and explain the coefficient of determination.",
      solution: "SST $= \\sum(y_i - \\bar y)^2$ is the total variation of y about its mean; SSR $= \\sum(\\hat y_i - \\bar y)^2$ is the variation explained by the regression; SSE $= \\sum(y_i - \\hat y_i)^2$ is the unexplained variation about the line. SST = SSR + SSE (slide 11). $r^2 = SSR/SST = 1 - SSE/SST$ is the proportion of observed y variation explained by the model, between 0 and 1 (slides 18–19). SSE = 0 means a perfect fit; a small $r^2$ suggests trying a non-linear or multiple regression.",
    },
    {
      title: "Why n − 2?",
      level: "Level 2",
      question: "Why is $\\sigma^2$ estimated by $SSE/(n - 2)$ and not $SSE/n$?",
      solution: "To compute the residuals we must first estimate two parameters, $\\beta_0$ and $\\beta_1$, from the same data. Each estimate uses up one degree of freedom, so SSE has $n - 2$ degrees of freedom, and dividing by $n - 2$ gives an unbiased estimate of $\\sigma^2$ (slide 14).",
    },
    {
      title: "Correlation vs regression",
      level: "Level 2",
      question: "Distinguish correlation from regression. What are the limitations of Pearson’s r?",
      solution: "Regression gives an **equation** to predict y from x (direction matters: y depends on x). Correlation gives a **single number** r between −1 and 1 measuring the strength and direction of the **linear** association, symmetric in x and y (slide 32). Limitations (slides 37, 39): it assumes a linear relationship (r ≈ 0 can hide a strong curve); its value is hard to interpret (use $r^2$); it is affected by extreme values; hand calculation is time-consuming.",
    },
    {
      title: "Intrinsically linear vs polynomial models",
      level: "Level 3",
      question: "When would you use a transformation (intrinsically linear model) and when a polynomial model? Give examples.",
      solution: "Intrinsically linear models (slides 24–26) suit curves that keep rising or keep falling: exponential $y = \\alpha e^{\\beta x}$ (use $\\ln y$), power $y = \\alpha x^{\\beta}$ (logs of both), reciprocal $y = \\alpha + \\beta/x$ (use $1/x$). Fit a straight line to the transformed data, then back-transform. Polynomial models (slides 29–31) suit data with a peak or valley: quadratic (k = 2) or cubic (k = 3); the k + 1 normal equations are solved directly. Models like $y = \\alpha + \\gamma e^{\\beta x}$ are not intrinsically linear (slide 28).",
    },
    {
      title: "Logistic regression",
      level: "Level 2",
      question: "Why is linear regression unsuitable for a binary outcome, and how does logistic regression fix this?",
      solution: "A binary outcome needs a predicted probability between 0 and 1, but a straight line is unbounded. Logistic regression models $p(x) = e^{\\beta_0 + \\beta_1x}/(1 + e^{\\beta_0 + \\beta_1x})$, an S-shaped curve between 0 and 1 (slides 47–48). Equivalently the odds $p/(1 - p) = e^{\\beta_0 + \\beta_1x}$ (slide 49), so the log-odds is linear in x, and $e^{\\beta_1}$ is the odds ratio per unit increase in x.",
    },
  ],

  quiz: [
    {
      topic: "Least squares",
      type: "num",
      q: "$S_{xy} = -1424.4143$, $S_{xx} = 6802.7693$. Slope $\\hat\\beta_1$? (4 decimals)",
      answer: -0.2094,
      tol: 0.0002,
      why: "$S_{xy}/S_{xx} = -0.20939$.",
    },
    {
      topic: "Least squares",
      type: "num",
      q: "$\\bar x = 93.392857$, $\\bar y = 55.657143$, $\\hat\\beta_1 = -0.20938742$. Intercept $\\hat\\beta_0$? (2 decimals)",
      answer: 75.21,
      tol: 0.01,
      why: "$\\bar y - \\hat\\beta_1\\bar x = 55.657 + 19.555$.",
    },
    {
      topic: "Least squares",
      q: "The least-squares line always passes through…",
      options: ["the origin", "$(\\bar x, \\bar y)$", "the first data point", "the point with the largest residual"],
      answer: 1,
      why: "$\\hat\\beta_0 = \\bar y - \\hat\\beta_1\\bar x$ rearranges to $\\bar y = \\hat\\beta_0 + \\hat\\beta_1\\bar x$.",
      wrong: ["Only if the intercept happens to be 0.", null, "No special reason.", "No."],
    },
    {
      topic: "Least squares",
      q: "Least squares minimises…",
      options: ["the sum of residuals", "the sum of squared vertical deviations", "the sum of squared horizontal deviations", "the largest residual"],
      answer: 1,
      why: "$\\sum(y_i - b_0 - b_1x_i)^2$ (slide 7). The plain sum of residuals is always 0, so it can't be minimised.",
      wrong: ["It is always 0 for the LS line.", null, "Vertical, because we predict y.", "That would be a minimax fit."],
    },
    {
      topic: "Fit",
      type: "num",
      q: "SSE = 78.92, SST = 377.17. $r^2$? (3 decimals)",
      answer: 0.791,
      tol: 0.002,
      why: "$1 - 78.92/377.17$.",
    },
    {
      topic: "Fit",
      type: "num",
      q: "SSE = 78.92 from n = 14 points. Estimate $s^2$ of $\\sigma^2$. (2 decimals)",
      answer: 6.58,
      tol: 0.01,
      why: "$SSE/(n - 2) = 78.92/12$.",
    },
    {
      topic: "Fit",
      q: "Which statement about SSE is true?",
      options: ["SSE > SST always", "SSE = 0 means all points lie on the line", "SSE measures explained variation", "SSE is divided by n − 1 to estimate σ²"],
      answer: 1,
      why: "Slide 15(a).",
      wrong: ["SSE ≤ SST.", null, "That's SSR.", "By n − 2."],
    },
    {
      topic: "Correlation",
      type: "num",
      q: "$S_{xy} = 2.3826$, $S_{xx} = 0.025516$, $S_{yy} = 434.5375$. r? (3 decimals)",
      answer: 0.716,
      tol: 0.002,
      why: "$2.3826/\\sqrt{11.0877} = 0.7155$.",
    },
    {
      topic: "Correlation",
      q: "r = 0.6 compared with r = 0.3 means the first explains…",
      options: ["twice as much variation", "four times as much variation", "the same", "half as much"],
      answer: 1,
      why: "$0.36/0.09 = 4$ (slide 41).",
      wrong: ["Compare r², not r.", null, "No.", "No."],
    },
    {
      topic: "Correlation",
      q: "r ≈ 0 for a data set. What can you conclude?",
      options: ["x and y are unrelated", "There is no strong LINEAR relationship", "The slope is large", "The data have outliers"],
      answer: 1,
      why: "A curved relationship can still have r ≈ 0 (slide 37).",
      wrong: ["Too strong: there may be a curve.", null, "r ≈ 0 means slope ≈ 0.", "Not implied."],
    },
    {
      topic: "Transformations",
      q: "To fit $y = \\alpha e^{\\beta x}$ by least squares, you transform…",
      options: ["x to ln x", "y to ln y", "both to logs", "x to 1/x"],
      answer: 1,
      why: "$\\ln y = \\ln\\alpha + \\beta x$ (slide 24).",
      wrong: ["That's for $y = \\alpha + \\beta\\log x$.", null, "That's for the power model.", "That's the reciprocal model."],
    },
    {
      topic: "Transformations",
      q: "Which model is NOT intrinsically linear?",
      options: ["$y = \\alpha x^{\\beta}$", "$y = \\alpha + \\beta/x$", "$y = \\alpha + \\gamma e^{\\beta x}$", "$y = \\alpha e^{\\beta x}$"],
      answer: 2,
      why: "Slide 28.",
      wrong: ["Logs of both sides.", "Use x′ = 1/x.", null, "Log y."],
    },
    {
      topic: "Polynomial",
      type: "num",
      q: "How many normal equations does a cubic (k = 3) polynomial regression have?",
      answer: 4,
      tol: 0,
      why: "k + 1 = 4 (one per coefficient $b_0$ to $b_3$).",
    },
    {
      topic: "Multiple regression",
      q: "In $y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2$, $\\beta_1$ is…",
      options: ["the correlation of y and x₁", "the change in y per unit of x₁ with x₂ held fixed", "the value of y when x₁ = 1", "always positive"],
      answer: 1,
      why: "Each coefficient is a partial effect.",
      wrong: ["Not a correlation.", null, "That's not what a slope means.", "Can be either sign."],
    },
    {
      topic: "Logistic",
      type: "num",
      q: "Logistic model $\\beta_0 = -3$, $\\beta_1 = 0.5$. p at x = 4? (3 decimals)",
      answer: 0.269,
      tol: 0.002,
      why: "$e^{-1}/(1 + e^{-1})$.",
    },
    {
      topic: "Logistic",
      q: "In logistic regression, what is linear in x?",
      options: ["p(x)", "the odds p/(1 − p)", "the log-odds ln[p/(1 − p)]", "1 − p(x)"],
      answer: 2,
      why: "$\\ln\\frac{p}{1 - p} = \\beta_0 + \\beta_1x$ (slide 49).",
      wrong: ["p is S-shaped.", "The odds are exponential in x.", null, "Also S-shaped."],
    },
  ],
};
