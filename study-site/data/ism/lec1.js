// ISM — Lecture 1 (CS-1): Overview of the course & basics of statistics
// Source: CourseFiles/ISM/Lec1.pdf (70 slides). Every topic cites its slides; nothing outside the deck is taught.
// Per-topic structure: what you'll learn → notation → formula (+ when to use) → simple example →
// harder example → common mistakes → quick revision. Slide problems + Level 1–3 practice are in the Numerical tab.

export default {
  title: "Basics of Statistics: Centre, Spread, Shape & Outliers",
  source: "Lec1.pdf (CS-1) · 70 slides",
  quizMode: "step",
  overview:
    "The lecture opens with a puzzle (slides 7–8): two IPL batsmen's runs in five matches. **Who is better on average? Who is more consistent? Are there any unusual scores?** Answering properly takes the whole toolkit of descriptive statistics, built up in this order: first decide **what kind of data** you have (its level of measurement), then summarise its **centre** (mean, median, mode), its **shape** (symmetric or skewed), its **spread** (range, variance, standard deviation) and finally its **five-number summary**, box plot and **outliers**. By the end you can answer all three IPL questions with numbers.",

  simpleIntro: "Descriptive statistics answers three questions about any pile of numbers: **what is typical** (centre), **how spread out** (variability), and **are there oddballs** (outliers). The lecture's running puzzle: two IPL batsmen, five matches each. Who is better? Who is more consistent? By the end you can answer both with numbers.",

  simple: [
    {
      "id": "s-big",
      "heading": "1. The big picture: the IPL puzzle",
      "slides": "",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Match",
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
          "rows": [
            [
              "Batsman 1",
              "45",
              "62",
              "86",
              "28",
              "44"
            ],
            [
              "Batsman 2",
              "34",
              "78",
              "12",
              "135",
              "64"
            ]
          ],
          "caption": "Runs scored (lecturer's slide 7)"
        },
        {
          "type": "cards",
          "items": [
            {
              "title": "Centre",
              "text": "One number for “typical”: the **mean**, **median** or **mode**.",
              "tag": "Who is better?",
              "example": "Batsman 2 averages 64.6 vs 53."
            },
            {
              "title": "Spread",
              "text": "How far scores wander from the centre: **range**, **variance**, **standard deviation**, **IQR**.",
              "tag": "Who is consistent?",
              "example": "Batsman 1's SD ≈ 19.7 vs 42.0.",
              "figure": "i1-spread"
            },
            {
              "title": "Shape & outliers",
              "text": "Is the data lopsided (**skewed**)? Are any values far from the rest (**outliers**)? A **box plot** shows both.",
              "tag": "Any oddballs?",
              "figure": "i1-boxanat"
            }
          ]
        }
      ]
    },
    {
      "id": "s-types",
      "heading": "2. What kind of data do I have?",
      "slides": "10–19",
      "blocks": [
        {
          "type": "p",
          "text": "The type of data decides which summaries make sense. Climb the ladder: each level allows everything below it, plus one more thing."
        },
        {
          "type": "table",
          "head": [
            "Level",
            "You can…",
            "Example"
          ],
          "rows": [
            [
              "**Nominal**",
              "only name / count categories",
              "Vehicle type, blood group"
            ],
            [
              "**Ordinal**",
              "+ put them in order",
              "Satisfaction: low < medium < high"
            ],
            [
              "**Interval**",
              "+ subtract (differences mean something)",
              "Temperature in °C"
            ],
            [
              "**Ratio**",
              "+ divide (a true zero: “twice as much”)",
              "Runs, income, age"
            ]
          ]
        },
        {
          "type": "diagram",
          "name": "i1-levels"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Quick test",
          "text": "Can you say “twice as much”? → ratio. Only “more/less”? → ordinal. Only “different”? → nominal."
        }
      ]
    },
    {
      "id": "s-centre",
      "heading": "3. The centre: mean, median, mode",
      "slides": "20–29",
      "blocks": [
        {
          "type": "callout",
          "kind": "formula",
          "title": "Mean",
          "text": "$$\\bar x = \\frac{\\sum x}{n} \\qquad \\text{(grouped data: } \\bar x = \\frac{\\sum f x}{\\sum f}\\text{)}$$"
        },
        {
          "type": "p",
          "text": "**Median** = the middle value after **sorting** (n odd: position $\\frac{n + 1}{2}$; n even: average the two middle values). **Mode** = the most frequent value."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example: the IPL batsmen",
          "text": "Batsman 1: total 265 → mean $= 265/5 = 53$; sorted 28, 44, **45**, 62, 86 → median 45.\nBatsman 2: total 323 → mean $= 323/5 = 64.6$; sorted 12, 34, **64**, 78, 135 → median 64."
        },
        {
          "type": "answer",
          "value": "Batsman 2 is better on average (64.6 vs 53)",
          "text": "Notice Batsman 2's mean is pulled up by the single 135."
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Which centre to use?",
          "text": "- Symmetric data, no outliers → **mean**.\n- Skewed data or outliers (incomes, house prices) → **median**: one billionaire doesn't move it.\n- Categories (most popular car colour) → **mode**."
        },
        {
          "type": "check",
          "q": "Incomes: 30, 32, 35, 38, 500 (thousand). Which best describes a typical income?",
          "options": [
            "Mean (127)",
            "Median (35)",
            "Range",
            "Mode"
          ],
          "answer": 1,
          "why": "The 500 drags the mean up to 127, far above everyone else. The median (35) is typical."
        }
      ]
    },
    {
      "id": "s-shape",
      "heading": "4. Shape: is the data lopsided?",
      "slides": "30–32",
      "blocks": [
        {
          "type": "p",
          "text": "In a **symmetric** distribution, mean = median = mode. If a long tail stretches to the **right** (a few huge values), the mean is dragged right: **mean > median** (positive skew). A long **left** tail gives mean < median (negative skew). **Name the skew after the tail**, not the peak."
        },
        {
          "type": "diagram",
          "name": "i1-skew"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Shortcuts (moderately skewed data)",
          "text": "$$3\\,\\text{Median} = \\text{Mode} + 2\\,\\text{Mean} \\qquad \\text{Skewness} = \\frac{3(\\bar x - \\text{Median})}{s}$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example",
          "text": "Mean 40, median 42 → Mode $= 3(42) - 2(40) = 46$. Mean < median < mode → **negatively (left) skewed**."
        }
      ]
    },
    {
      "id": "s-spread",
      "heading": "5. Spread: range, variance, standard deviation",
      "slides": "33–56",
      "blocks": [
        {
          "type": "p",
          "text": "Two groups can share an average yet behave very differently. **Range** = max − min (quick, but uses only two values). The **standard deviation** measures the *typical distance from the mean*, using every value."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Variance and SD",
          "text": "$$s^2 = \\frac{\\sum (x - \\bar x)^2}{n - 1} \\quad \\text{(sample)} \\qquad \\sigma^2 = \\frac{\\sum(x - \\mu)^2}{N} \\quad \\text{(population)} \\qquad SD = \\sqrt{\\text{variance}}$$"
        },
        {
          "type": "p",
          "text": "**Recipe:** (1) find the mean, (2) subtract it from each value, (3) square, (4) add up (= SS), (5) divide by $n - 1$ (sample) or $N$ (population), (6) square root."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Solved example (lecturer's slide 46): Group 1",
          "text": "Scores 2, 8, 5, 3, 7, 8, 5, 2, 5; mean = 5.\nDeviations: −3, 3, 0, −2, 2, 3, 0, −3, 0 → squares sum to $SS = 44$.\n$s = \\sqrt{44/8} = \\sqrt{5.5} = 2.345$."
        },
        {
          "type": "answer",
          "value": "s = 2.345",
          "text": "Group 2 (1, 15, 5, 5, 6, 3, 5, 2, 3) has the **same mean 5** but $s = 4.093$: almost double the spread."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Back to the IPL puzzle",
          "text": "Treating each batsman's 5 matches as the whole population (as the slides do): variance **388 vs 1767.84**, SD **19.7 vs 42.0**. **Batsman 1 is far more consistent**; Batsman 2 is a boom-or-bust player."
        },
        {
          "type": "diagram",
          "name": "i1-ipl"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "n or n − 1?",
          "text": "Sample → divide by $n - 1$ (it corrects for estimating the mean from the same data). Whole population → divide by $N$. Say which you used."
        }
      ]
    },
    {
      "id": "s-box",
      "heading": "6. Quartiles, IQR, box plots and outliers",
      "slides": "57–63",
      "blocks": [
        {
          "type": "p",
          "text": "Sort the data and cut it into four equal parts. $Q_1$ = the 25% mark, $Q_2$ = median, $Q_3$ = the 75% mark. The **IQR** $= Q_3 - Q_1$ is the spread of the **middle half**: it ignores extremes."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Outlier fences",
          "text": "$$\\text{Position of } Q_1 = \\frac{n + 1}{4}, \\quad Q_3 = \\frac{3(n + 1)}{4} \\qquad \\text{fences: } Q_1 - 1.5\\,IQR \\text{ and } Q_3 + 1.5\\,IQR$$ Anything outside the fences is an **outlier**."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's example (slide 58)",
          "text": "11, 12, 13, 16, 16, 17, 17, 18, 21 ($n = 9$). $Q_1$ at position 2.5 → 12.5; median 16; $Q_3$ at position 7.5 → 17.5. IQR $= 5$; fences 5 and 25 → **no outliers**."
        },
        {
          "type": "diagram",
          "name": "i1-boxanat"
        },
        {
          "type": "check",
          "q": "Q₁ = 20, Q₃ = 30. Which value is an outlier?",
          "options": [
            "12",
            "40",
            "46",
            "25"
          ],
          "answer": 2,
          "why": "IQR = 10 → fences $20 - 15 = 5$ and $30 + 15 = 45$. Only 46 lies outside them."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "7. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Data type ladder:** nominal → ordinal → interval → ratio.\n- **Centre:** mean (symmetric), median (skewed/outliers), mode (categories).\n- **Skew is named after the tail:** right tail → mean > median.\n- **SD recipe:** mean → deviations → square → sum → ÷ (n − 1) → √.\n- **Box plot:** Q₁ at (n+1)/4, Q₃ at 3(n+1)/4; outliers beyond Q₁ − 1.5 IQR or Q₃ + 1.5 IQR."
        }
      ]
    }
  ],

  summary: [
    {
      id: "course",
      heading: "Lesson 0: How this course is organised",
      slides: "3–6",
      blocks: [
        {
          type: "table",
          caption: "The six modules (slide 3)",
          head: ["Module", "Topic", "Lectures on this site"],
          rows: [
            ["M1", "Basic Probability & Statistics", "Lec 1–2"],
            ["M2", "Conditional Probability & Bayes' theorem", "Lec 3–4"],
            ["M3", "Probability Distributions", "Lec 5–6"],
            ["M4", "Hypothesis Testing", "Lec 7, 9"],
            ["M5", "Prediction & Forecasting", "Lec 10"],
            ["M6", "Prediction & Forecasting: Gaussian Mixture Model & Expectation Maximization", "not in the slides provided"],
          ],
        },
        {
          type: "table",
          caption: "Evaluation (slide 5)",
          head: ["Component", "Name", "Type", "Weight"],
          rows: [
            ["EC-1(a)", "Quizzes 1 & 2", "Online", "10%"],
            ["EC-1(b)", "Assignments 1 & 2", "Online", "20%"],
            ["EC-2", "Mid-Semester Test", "**Closed book**", "30%"],
            ["EC-3", "Comprehensive Exam", "**Open book**", "40%"],
          ],
        },
        {
          type: "p",
          text: "**Textbooks (slide 4):** T1 Kaptein et al., *Statistics for Data Scientists* (Springer 2022); T2 Devore, *Probability and Statistics for Engineering and Sciences* (8th ed.); T3 Brockwell & Davis, *Introduction to Time Series and Forecasting*. This lecture covers T1 & T2 material for **Module 1, CS-1**: measures of central tendency and variability, symmetric and asymmetric data, outlier detection and the five-point summary (slide 6).",
        },
        {
          type: "callout",
          kind: "exam",
          title: "What the weightings mean for you",
          text: "The mid-sem is **closed book**, so you need the formulas in your head. The comprehensive is **open book**, so you can look formulas up but must recognise **which method a question needs**. Every lecture page here ends with formula boxes and a ⚡ Recap for exactly that reason.",
        },
      ],
    },
    {
      id: "why",
      heading: "Lesson 1: Why statistics? The IPL puzzle",
      slides: "7–9",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "What statistics is for, and the three questions (centre, consistency, extremes) that the rest of the lecture answers.",
        },
        {
          type: "table",
          caption: "IPL 2026 statistics: runs scored in 5 matches (slide 7)",
          head: ["Match", "1", "2", "3", "4", "5"],
          rows: [
            ["Batsman 1", "45", "62", "86", "28", "44"],
            ["Batsman 2", "34", "78", "12", "135", "64"],
          ],
        },
        {
          type: "p",
          text: "Imagine you're a team selector. Just looking at the table, Batsman 2 has the single biggest score (135), but also the smallest (12). Is he better? More exciting, certainly, but can you rely on him? Slide 8 turns this into three questions: **(1) Who performs better on average? (2) Who is more consistent? (3) Are there any unusual (extreme) scores?** Each question needs a different tool, and that's the plan for the lecture.",
        },
        {
          type: "p",
          text: "**Statistics** (slide 9) is the science used to **collect** data, **present and organise** it systematically, **analyse** it, **infer** from it, and **take decisions** from it. Today is about the first three steps: describing data with a few well-chosen numbers. That's called **descriptive statistics**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Average → **measures of central tendency** (Lessons 3–5). Consistency → **measures of variability** (Lessons 6–7). Extremes → **five-number summary, IQR and outliers** (Lesson 9).",
        },
      ],
    },
    {
      id: "types",
      heading: "Lesson 2: What kind of data do I have? Variables and levels of measurement",
      slides: "10–19",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Before calculating anything, classify the data. The type decides **which calculations make sense**. You can't average eye colours!",
        },
        {
          type: "p",
          text: "**Two families of variables (slides 10, 18).**",
        },
        {
          type: "list",
          items: [
            "**Categorical (qualitative):** expresses a quality, in defined categories. Examples: marital status, political party, eye colour. Two kinds: **nominal** (no ordering possible: hair colour, religion) and **ordinal** (ordering possible: health rated poor / reasonable / good / excellent).",
            "**Numerical (quantitative):** measured in numbers. Two kinds: **discrete** (countable, a finite number of possibilities: number of children, defects per hour) and **continuous** (measured, infinitely many possible values: weight, voltage, height).",
          ],
        },
        {
          type: "p",
          text: "**Four levels of measurement (slides 11–15), from lowest to highest:**",
        },
        {
          type: "table",
          head: ["Level", "Definition (slide wording)", "Slide examples"],
          rows: [
            ["**Nominal**", "Classifies data into distinct categories in which **no ranking** is implied", "Gender, marital status, voting for different parties"],
            ["**Ordinal**", "Distinct categories in which **ranking is implied**", "Satisfied / Neutral / Unsatisfied; Professor / Associate / Assistant Professor; grades A–F; Gold / Silver / Bronze"],
            ["**Interval**", "Ordered; the **difference** between measurements is meaningful, but there is **no true zero**", "Temperature in °F and °C; months of the year (no month zero, and January isn't “twice” June)"],
            ["**Ratio**", "Ordered; differences are meaningful **and there is a true zero**", "Weight, age, salary"],
          ],
        },
        { type: "diagram", name: "i1-levels" },
        {
          type: "table",
          caption: "Impact of the choice of measurement scale (slide 17)",
          head: ["Data level", "Meaningful operations", "Statistical methods"],
          rows: [
            ["Nominal", "Classifying and counting", "Nonparametric"],
            ["Ordinal", "All of the above **plus ranking**", "Nonparametric"],
            ["Interval", "All of the above **plus addition, subtraction**", "Parametric"],
            ["Ratio", "All of the above **plus multiplication and division**", "Parametric"],
          ],
        },
        {
          type: "p",
          text: "**Why does the true zero matter?** On a ratio scale, 0 means “none of it”: a salary of ₹0 is no salary, so ₹60,000 really is twice ₹30,000. On an interval scale, 0 is just a point on the scale: 0 °C isn't “no temperature”, so 40 °C is **not** twice as hot as 20 °C. You can subtract interval values (20 °C warmer) but not divide them.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slide 19): classify each survey question",
          text: "| Question | Type of variable |\n|---|---|\n| Type of vehicle owned (two-wheeler, four-wheeler) | Categorical: **Nominal** (no order) |\n| Product satisfaction (unsatisfied … satisfied) | Categorical: **Ordinal** (ordered) |\n| How many magazines do you subscribe to? (0, 1, 2, …) | Numerical: **Discrete** (a count) |\n| How tall are you (inches)? | Continuous: **Ratio** |\n| Weight (kg) | Continuous: **Ratio** |\n| Temperature (°C or °F) | Continuous: **Interval** (no true zero) |",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Calling numbers-as-labels numeric. A **jersey number** or **roll number** is nominal: averaging them means nothing.\n- Treating °C as ratio. It has a zero, but not a *true* zero, so it's **interval**.\n- Confusing **discrete vs continuous** (how values arise: counted vs measured) with **interval vs ratio** (whether zero is real). A variable has both labels, e.g. weight is continuous *and* ratio.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "N-O-I-R, lowest to highest: **N**ominal (names) → **O**rdinal (order) → **I**nterval (differences) → **R**atio (true zero, ratios). Nominal/ordinal → nonparametric; interval/ratio → parametric.",
        },
      ],
    },
    {
      id: "mean",
      heading: "Lesson 3: What is the typical value? The mean",
      slides: "20–25",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A **measure of central tendency** is a single value that describes the “centre” of the data, the performance of the group (slide 20). There are three: **mean, median, mode**. We start with the most used, the mean.",
        },
        {
          type: "table",
          caption: "Notation (as on slide 21)",
          head: ["Symbol", "Read as", "Meaning"],
          rows: [
            ["$Y$ (or $x$)", "Y", "One score / observation"],
            ["$\\bar Y$ (or $\\bar X$)", "Y bar", "The mean of the scores"],
            ["$N$ (or $n$)", "N", "Number of scores"],
            ["$\\Sigma$", "sigma", "“Add them all up”"],
            ["$f$", "f", "Frequency: how many times a score occurs (grouped data)"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Mean (slide 21)",
          text: "**Ungrouped data:**\n$$\\bar Y = \\frac{\\Sigma Y}{N} = \\frac{Y_1 + Y_2 + \\dots + Y_n}{N}$$\n**Grouped data (a frequency table):**\n$$\\bar Y = \\frac{\\Sigma fY}{N}, \\qquad N = \\Sigma f$$\n$fY$ = a score multiplied by its frequency.\n\n**Use when:** the data is interval or ratio and you'll go on to compute standard deviation, coefficient of variation or skewness, or when sampling stability is wanted (slide 25).",
        },
        {
          type: "p",
          text: "**Simple example: the time to get ready (slide 22).** You record, for 10 working days, the minutes from getting out of bed to leaving home: 39, 29, 43, 52, 39, 44, 40, 31, 44, 35.",
        },
        {
          type: "p",
          text: "$$\\bar X = \\frac{\\text{sum of the values}}{\\text{number of values}} = \\frac{39 + 29 + 43 + 52 + 39 + 44 + 40 + 31 + 44 + 35}{10} = \\frac{396}{10} = 39.6 \\text{ minutes}$$",
        },
        {
          type: "p",
          text: "**Slightly harder: grouped scores (slide 23).** A survey of children in Bengaluru records hours spent watching TV per day. Data comes as a frequency table, so multiply each score by its frequency first.",
        },
        {
          type: "table",
          head: ["Hours (Y)", "Frequency (f)", "fY"],
          rows: [
            ["1", "104", "104"],
            ["2", "130", "260"],
            ["3", "98", "294"],
            ["**Total**", "**N = 332**", "**ΣfY = 658**"],
          ],
        },
        {
          type: "p",
          text: "$$\\bar Y = \\frac{\\Sigma fY}{N} = \\frac{658}{332} = 1.98 \\text{ hours}$$ Notice 1.98 isn't one of the possible scores (1, 2 or 3). That's one of the mean's properties: **it may not be an actual score in the distribution.**",
        },
        {
          type: "p",
          text: "**Properties of the mean (slide 24):**",
        },
        {
          type: "list",
          items: [
            "It measures **stability**: the most stable measure of centre, because **every score contributes** to it.",
            "It is **easily affected by extreme scores**. One huge value drags it toward itself.",
            "**The sum of each score's distance from the mean is zero.** (The mean is the balance point. We'll need this in Lesson 7.)",
            "It can be applied to **interval** level measurement (and therefore ratio too).",
            "It **may not be an actual score** (1.98 hours above).",
            "It is very **easy to compute**.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Grouped data: dividing $\\Sigma fY$ by the **number of rows** (3) instead of $N = \\Sigma f$ (332).\n- Forgetting to multiply by f: $\\frac{1+2+3}{3} = 2$ is wrong because more children watch 2 hours than 3.\n- Reporting the mean for data with an extreme value without comment. Check the median too (Lesson 4).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Mean = sum ÷ count; grouped: $\\Sigma fY / \\Sigma f$. Uses every value, so it's stable but sensitive to extremes. Deviations from the mean sum to 0.",
        },
      ],
    },
    {
      id: "median-mode",
      heading: "Lesson 4: What if there are extreme values or categories? Median and mode",
      slides: "26–29",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Two more measures of centre: the **mode** (most frequent) and the **median** (the middle). Each one survives a situation where the mean fails.",
        },
        {
          type: "p",
          text: "**The mode (slides 26–27)** is the category or score with the **largest frequency**. It works for **nominal, ordinal and interval/ratio** data, so it's the only measure of centre for nominal data (you can count “most common blood group”, but can't average it).",
        },
        {
          type: "p",
          text: "**Example (slide 26):** a systems manager counts server failures per day for two weeks: 1, 3, 0, 3, 26, 2, 7, 4, 0, 2, 3, 3, 6, 3. The value **3 appears five times**, more than any other, so **mode = 3**: “the most common occurrence is three server failures in a day.” Note the 26: a disastrous day, yet the mode ignores it completely.",
        },
        {
          type: "list",
          items: [
            "Usable for **qualitative as well as quantitative** data.",
            "**May not be unique.** A data set can have two modes (bimodal) or more (multi-modal).",
            "**Not affected by extreme values.**",
            "When to use: when the data is measured on a **nominal scale**.",
          ],
        },
        {
          type: "p",
          text: "**The median (slide 28)** is the score that divides the distribution into **two equal parts**: 50% of values lie below it and 50% above. It's also called the **middle score** or the **50th percentile**. To compute it, **first sort the data**, then:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Median (slide 28)",
          text: "Sort the n values from smallest to largest.\n- **Rule 1, n odd:** the median is the **middle-ranked value**, at position $\\frac{n+1}{2}$.\n- **Rule 2, n even:** the median is the **average of the two middle-ranked values**, at positions $\\frac{n}{2}$ and $\\frac{n}{2}+1$.\n\n**Use when:** the data is skewed or has extreme values. The median works for both symmetrical and asymmetrical data (slide 30).",
        },
        {
          type: "p",
          text: "**Example 1, odd n (slide 29):** three-year annualised returns of seven low-risk small-cap growth funds, already sorted: 19.0, 20.8, 22.3, **22.4**, 24.9, 26.0, 29.9. With $n = 7$ the middle is position $(7 + 1)/2 = 4$, so **median = 22.4**.",
        },
        {
          type: "p",
          text: "**Example 2, even n (slide 29):** the 10 travel times, sorted: 29, 31, 35, 39, **39, 40**, 43, 44, 44, 52. With $n = 10$ the middle positions are 5 and 6, so **median = $(39 + 40)/2 = 39.5$** minutes. Compare the mean of the same data, 39.6: almost equal, which hints the data is roughly symmetric (Lesson 5).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Taking the middle of the **unsorted** list. Always sort first.\n- Even n: picking one middle value instead of averaging the two.\n- Saying “no mode” when two values tie. They are **both** modes (bimodal).\n- Using the mean for nominal data. Only the mode applies.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Mode = most frequent (any level, may not be unique, ignores extremes). Median = middle of sorted data (position (n+1)/2; average the two middles when n is even); robust to extremes.",
        },
      ],
    },
    {
      id: "shape",
      heading: "Lesson 5: Is the data lopsided? Shape and skewness",
      slides: "30–32, 63",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How comparing mean, median and mode reveals the **shape** of the data, and how to measure skewness with a single number.",
        },
        {
          type: "p",
          text: "Because the mean gets dragged toward extreme values but the median doesn't, **the gap between them tells you which way the data leans** (slide 31):",
        },
        {
          type: "list",
          items: [
            "**Symmetrical:** mean = median (= mode for a single-peaked shape).",
            "**Negatively (left) skewed:** **mean < median**. A long **left** tail: a few unusually small values pull the mean down.",
            "**Positively (right) skewed:** **mean > median**. A long **right** tail: a few unusually large values pull the mean up.",
            "**Bimodal:** two distinct modes. **Multi-modal:** more than two distinct modes.",
          ],
        },
        { type: "diagram", name: "i1-skew" },
        {
          type: "p",
          text: "**Which measure of centre should you report? (slide 30)** The median can be used for both symmetrical and asymmetrical data. For symmetrical data the mean, median or mode can all be used. So for skewed data (incomes, house prices, server failures with that 26) prefer the **median**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Empirical relation and coefficients of skewness (slide 32)",
          text: "For **moderately skewed** data, the empirical relationship is\n$$3\\,\\text{Median} = \\text{Mode} + 2\\,\\text{Mean}$$\nCoefficient of skewness (s = standard deviation):\n$$\\text{using the mode: } \\frac{\\bar X - \\text{Mode}}{s} \\qquad \\text{using the median: } \\frac{3(\\bar X - \\text{Median})}{s}$$\nSign: **positive → right skew, zero → symmetric, negative → left skew** (slide 63: $S < 0$, $S = 0$, $S > 0$).",
        },
        {
          type: "p",
          text: "An **empirical** relationship (slide 32) is one supported by experiment and observation but not necessarily by theory. So the relation is a handy approximation, not an exact law. Its main use: **estimating one measure from the other two**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example",
          text: "A distribution has mean 40 and median 42. Estimate the mode.\n\n$\\text{Mode} = 3\\,\\text{Median} - 2\\,\\text{Mean} = 3(42) - 2(40) = 126 - 80 = 46.$ Since mean (40) < median (42) < mode (46), the data is **negatively (left) skewed**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Practice Q4 data (slide 68)",
          text: "Mean = 74.3, median = 79, $s = 10.534$ (computed in the Numerical tab). Coefficient of skewness $= \\frac{3(74.3 - 79)}{10.534} = \\frac{-14.1}{10.534} = -1.34$. Strongly **negative**: the two very low values (45, 48) drag the mean below the median.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged, not guessed)",
          text: "Slide 32 writes “Medain” (a typo for Median) and describes moderately skewed data as “skewness between −0.5 to 0.5”. That wording is kept as given; use the empirical relation only for **mildly / moderately skewed** data, and quote the range as the slide states it.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Naming skew by where the **peak** is. Skew is named by the **tail**: a long right tail = positive skew, even though the peak sits on the left.\n- Writing the relation as 3 Mean = Mode + 2 Median. The **3 goes with the median**.\n- In the median formula of the coefficient, forgetting the factor **3**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Mean chases the tail. Right skew: mode < median < mean. Left skew: mean < median < mode. 3 Median = Mode + 2 Mean. Sk = ($\\bar{X}$ − Mode)/$s = 3$($\\bar{X}$ − Median)/s.",
        },
      ],
    },
    {
      id: "range",
      heading: "Lesson 6: Why isn't the average enough? Variability and the range",
      slides: "33–38",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Two data sets can share the same centre and still look completely different. We need a **measure of variability (spread)**. The simplest is the range.",
        },
        {
          type: "p",
          text: "**“Why mean is not enough?” (slides 33–35).** Look at two groups of nine scores:",
        },
        {
          type: "table",
          head: ["", "Scores", "Mean", "Median", "Mode"],
          rows: [
            ["Group 1 ($X_1$)", "2, 8, 5, 3, 7, 8, 5, 2, 5", "5", "5", "5"],
            ["Group 2 ($X_2$)", "1, 15, 5, 5, 6, 3, 5, 2, 3", "5", "5", "5"],
          ],
        },
        { type: "diagram", name: "i1-spread" },
        {
          type: "p",
          text: "All three measures of centre are identical, yet Group 2 has a 15 and a 1, so it's clearly more scattered. **Do we need any other measure? Yes** (slide 36): three measures of variability: **the range, the variance, the standard deviation**. Variability is a quantitative distance measure based on the differences between scores; it describes the spread of scores, or the distance of a score from the mean (slide 37). Its purposes: to **describe the distribution** and to measure **how well an individual score represents the distribution**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Range (slide 38)",
          text: "$$\\text{Range} = \\text{highest score} - \\text{lowest score}$$\nFor continuous data the slide uses real limits: Range = URL for $X_{max}$ − LRL for $X_{min}$ (upper real limit of the largest minus lower real limit of the smallest).\n\n**Limitation:** it's based on **only two scores**, not all the data, so it's an **imprecise, unreliable** measure of variability.",
        },
        {
          type: "p",
          text: "**Example (slide 38):** scores 7, 2, 7, 6, 5, 6, 2. Range = $7 - 2$ = **5**. **Harder (Group 1 vs Group 2):** range of Group $1 = 8 - 2 = 6$; range of Group $2 = 15 - 1 = 14$. The range does separate them, but notice Group 2's range is driven entirely by one score (15). Change that single score and the range changes completely. That's why we need a measure that uses **every** score.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Same centre ≠ same data. Range = $\\max - \\min$: quick, but uses only two values and is wrecked by one extreme.",
        },
      ],
    },
    {
      id: "sd",
      heading: "Lesson 7: How far is a typical score from the mean? Variance and standard deviation",
      slides: "39–54",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The **standard deviation (SD)** is the most common and most important measure of variability: the standard (typical) distance of scores from the mean (slide 39). The **variance** is its companion: the mean of the squared deviations.",
        },
        {
          type: "p",
          text: "**Building the idea (slides 40–42).** The natural first try: find each score's deviation from the mean, $x - \\bar x$, and average them. Exercise (slide 40): do it for any data set, and you'll always get **zero**. Why? Because the mean is the **balance point**: the positive deviations exactly cancel the negative ones (Lesson 3's property). For the 10 travel times (mean 39.6) the deviations are −0.6, −10.6, 3.4, 12.4, −0.6, 4.4, 0.4, −8.6, 4.4, −4.6, which add to exactly 0.",
        },
        { type: "diagram", name: "i1-dev" },
        {
          type: "p",
          text: "**The new strategy (slide 42):** (a) **square** each deviation, so negatives become positive; (b) **sum** the squared deviations to get the **Sum of Squares (SS)**; (c) **average** them. The mean squared deviation is the **variance**. Because we squared, variance is in **squared units** (minutes²), so we take its **square root** to get back to the original units. That square root is the **standard deviation**.",
        },
        {
          type: "table",
          caption: "Notation (slides 43–44, 51)",
          head: ["Symbol", "Meaning"],
          rows: [
            ["$SS = \\Sigma(X - \\mu)^2$", "Sum of squared deviations (Sum of Squares)"],
            ["$\\mu$, $N$", "Population mean, population size"],
            ["$\\sigma^2$, $\\sigma$", "Population variance, population SD (Greek sigma)"],
            ["$\\bar X$, $n$", "Sample mean, sample size"],
            ["$s^2$, $s$", "Sample variance, sample SD"],
            ["df $= n - 1$", "Degrees of freedom"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Variance and standard deviation (slides 43–44, 51)",
          text: "**Population** (all the data; mean $\\mu$ known):\n$$\\sigma^2 = \\frac{SS}{N} = \\frac{\\Sigma(X-\\mu)^2}{N}, \\qquad \\sigma = \\sqrt{\\sigma^2}$$\n**Sample** (estimating a population from a sample):\n$$s^2 = \\frac{SS}{n-1} = \\frac{\\Sigma(X-\\bar X)^2}{n-1}, \\qquad s = \\sqrt{\\frac{SS}{n-1}}$$\n**Use:** $\\sigma$ when you have the whole population; **s with $n - 1$** when the data is a sample used to estimate the population.",
        },
        {
          type: "p",
          text: "**Why $n - 1$ for a sample? (slides 50–52)** The goal of inferential statistics is to draw conclusions about a population from a sample. But samples have **less variability** than the population: extreme scores are less likely to be picked. Computing the sample variance with N would give a **biased** (too small) estimate. Dividing by **n − 1** corrects it. The idea behind it is **degrees of freedom**: once you've used the data to compute $\\bar X$, only $n - 1$ scores are free to vary. The last one is fixed, because the deviations must sum to zero. So **df = $n - 1$**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example: Group 1 (slide 46)",
          text: "Scores 2, 8, 5, 3, 7, 8, 5, 2, 5; $\\bar X = 45/9 = 5$.\n\nDeviations: −3, 3, 0, −2, 2, 3, 0, −3, 0. Squares: 9, 9, 0, 4, 4, 9, 0, 9, 0. $SS = 44$.\n\n$$S = \\sqrt{\\frac{SS}{n-1}} = \\sqrt{\\frac{44}{8}} = \\sqrt{5.5} = 2.345$$",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: Group 2 (slide 47)",
          text: "Scores 1, 15, 5, 5, 6, 3, 5, 2, 3; $\\bar X = 5$.\n\nDeviations: −4, 10, 0, 0, 1, −2, 0, −3, −2. Squares: 16, 100, 0, 0, 1, 4, 0, 9, 4. $SS = 134$.\n\n$$S = \\sqrt{\\frac{134}{8}} = \\sqrt{16.75} = 4.093$$\nSame mean, but Group 2's SD is almost double. Most of its SS (100 of 134) comes from the single score 15: squaring makes big deviations count heavily.",
        },
        {
          type: "p",
          text: "**Interpreting the SD (slides 54, 56).** A small SD means scores cluster tightly around the mean; a large SD means they're widely scattered. As a rough picture, the SD extends from the mean about **halfway to the most extreme score**. And together, the mean and the SD describe a whole distribution with just two numbers: centre and spread.",
        },
        {
          type: "callout",
          kind: "exam",
          title: "Learning checks from the slides (48–49, 53–54)",
          text: "- *If all scores are the same, SD = 1.00.* **False.** Every score equals the mean, every deviation is 0, so **SD = 0**.\n- *The SD measures…* **(4) the square root of the average squared distance of a score from the mean.**\n- *A sample of four scores has SS = 24. Variance?* $s^2 = SS/(n-1) = 24/3 =$ **8** (option 3).\n- *A sample systematically has less variability than a population.* **True.** Extreme scores affect variability but are less likely to be included in a sample.\n- *The SD is the distance from the mean to the farthest point.* **False.** It extends roughly **halfway** to the most extreme score.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Dividing a **sample's** SS by n. Use **n − 1** (the SS = 24 check: 24/4 = 6 is the trap option).\n- Forgetting the square root: variance ≠ SD.\n- Squaring the **sum** of deviations instead of summing the **squares**: $(\\Sigma d)^2 = 0$ always.\n- Thinking SD can be negative. It's a square root of squares: always ≥ 0, and 0 only when all scores are equal.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Deviations sum to 0 → square them. SS = $\\sum(x - \\bar{x})^2$. Population: $\\sigma^2$ = SS/N. Sample: $s^2$ = SS/$(n - 1)$, df = $n - 1$. SD = √variance, same units as data.",
        },
      ],
    },
    {
      id: "ipl",
      heading: "Lesson 8: Answering the IPL puzzle",
      slides: "7–8, 55–56",
      blocks: [
        {
          type: "p",
          text: "Now we have the tools. **Average:** Batsman 1: 265/5 = **53**; Batsman 2: 323/5 = **64.6**. Batsman 2 scores more on average.",
        },
        {
          type: "p",
          text: "**Consistency:** the slides' answer (slide 55) is variance **388 vs 1767.84**, SD **≈ 19.7 vs ≈ 42.05**. Batsman 1 is **more consistent** (low spread); Batsman 2 is **highly variable**, with the large spread due to the 135.",
        },
        { type: "diagram", name: "i1-ipl" },
        {
          type: "callout",
          kind: "example",
          title: "Working for Batsman 1",
          text: "Deviations from 53: −8, 9, 33, −25, −9. Squares: 64, 81, 1089, 625, 81. $SS = 1940$.\n\n$\\sigma^2 = 1940/5 = 388$, $\\sigma = \\sqrt{388} = 19.70$.\n\nBatsman 2: deviations from 64.6 are −30.6, 13.4, −52.6, 70.4, −0.6; $SS = 8839.2$; $\\sigma^2 = 8839.2/5 = 1767.84$; $\\sigma = 42.05$.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): which divisor?",
          text: "The slide's 388 and 1767.84 divide SS by **N = 5**, i.e. they treat the five matches as the **population** $(\\sigma^2)$. If you treat them as a **sample** ($s^2$, divide by $n - 1 = 4$) you get **485** and **2209.8** ($s = 22.02$ and 47.01). The conclusion is the same either way. In an exam, **state which you're using**: “treating the 5 matches as the population…” or “as a sample, using $n - 1$…”.",
        },
        {
          type: "p",
          text: "**Unusual scores:** the 135 looks extreme. Is it formally an outlier? We'll test it with the $1.5 \\times \\text{IQR}$ rule in Lesson 9 (spoiler: with only five scores, it isn't).",
        },
      ],
    },
    {
      id: "five",
      heading: "Lesson 9: Where are the middle 50% and the outliers? Five-number summary, IQR and box plots",
      slides: "57–63",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A spread measure that **isn't fooled by extreme values** (the IQR), a five-number summary of any data set, the box plot that draws it, and a rule for flagging outliers.",
        },
        {
          type: "p",
          text: "**Five-number summary (slide 57):** **Minimum, $Q_1$** (first quartile, the 25% mark), **Median, $Q_3$** (third quartile, the 75% mark), **Maximum**. Quartiles split the sorted data into four equal parts, just as the median splits it into two.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Quartiles, IQR and outlier fences (slides 58, 61)",
          text: "Sort the n values. Then\n$$\\text{Position of } Q_1 = \\frac{1(n+1)}{4}, \\qquad \\text{Position of } Q_3 = \\frac{3(n+1)}{4}$$\nIf the position is not a whole number, go that fraction of the way between the neighbouring values (position 2.5 → halfway between the 2nd and 3rd values).\n$$IQR = Q_3 - Q_1$$\n$$\\text{Lower limit} = Q_1 - 1.5\\,IQR, \\qquad \\text{Upper limit} = Q_3 + 1.5\\,IQR$$\nPoints outside the limits are **potential outliers**; points beyond $Q_1 - 3\\,IQR$ or $Q_3 + 3\\,IQR$ are **major outliers** (slide 60).",
        },
        {
          type: "p",
          text: "**The IQR** (slide 58) is a measure of variation, also called the **mid-spread**: the spread of the **middle 50%** of the data. Because it ignores the lowest and highest quarters, it is **not affected by extreme values**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simple example (slide 58)",
          text: "Ordered data: 11, 12, 13, 16, 16, 17, 17, 18, 21 $(n = 9)$.\n\nPosition of $Q_1 = \\frac{1(9+1)}{4} = 2.5$ → halfway between 12 and 13 → $Q_1 = 12.5$.\n\nPosition of $Q_3 = \\frac{3(9+1)}{4} = 7.5$ → halfway between 17 and 18 → $Q_3 = 17.5$.\n\n$IQR = 17.5 - 12.5 = 5$. Fences: $12.5 - 7.5 = 5$ and $17.5 + 7.5 = 25$. Every value lies inside, so **no outliers**. Five-number summary: 11, 12.5, 16, 17.5, 21.",
        },
        { type: "diagram", name: "i1-boxanat" },
        {
          type: "p",
          text: "**The box-and-whisker plot (slides 59–60)** draws the five-number summary: a **box** from $Q_1$ to $Q_3$ (its length is the IQR), a line inside at the **median $(Q_2)$**, and **whiskers** out to the smallest and largest values that are not outliers. Outliers are plotted as separate points.",
        },
        {
          type: "p",
          text: "**Reading skewness from a box plot (slide 63).** Symmetric: the median sits in the middle of the box and the whiskers are about equal. **Negatively skewed:** the median is nearer $Q_3$ and the **left** whisker is longer. **Positively skewed:** the median is nearer $Q_1$ and the **right** whisker is longer. **Outliers and the normal curve (slide 62):** the fences $Q_1 - 1.5$ IQR and $Q_3 + 1.5$ IQR sit at about ±$2.698 \\sigma$ for bell-shaped data (the box itself spans about ±$0.6745 \\sigma$ and holds the middle 50%), so in bell-shaped data very few points fall outside them.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Slightly harder: is the IPL 135 an outlier?",
          text: "Batsman 2 sorted: 12, 34, 64, 78, 135 $(n = 5)$. $Q_1$ at position 1.5 → $(12 + 34)/2 = 23$. $Q_3$ at position 4.5 → $(78 + 135)/2 = 106.5$. IQR = 83.5. Upper limit = $106.5 + 1.5 (83.5) = 231.75$. Since 135 < 231.75, it is **not** an outlier by the rule. With only five scores the quartiles are very wide. The 135 is unusual but inflates the SD (Lesson 8); it doesn't break the fence.",
        },
        {
          type: "p",
          text: "**Two worked box plots from the practice problems** (full working in the ✍️ Numerical tab). Practice Q4 shows a left-skewed set with two outliers; Practice Q5 compares two bank branches side by side, which is the most common exam use of box plots.",
        },
        { type: "diagram", name: "i1-boxq4" },
        { type: "diagram", name: "i1-boxq5" },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Finding quartiles in **unsorted** data.\n- Using position n/4 instead of the slides' **(n + 1)/4**. Different textbooks use different rules; in this course use (n + 1)/4.\n- Drawing whiskers to the fences. Whiskers stop at the **most extreme data value inside** the fences.\n- Calling every far-away point an outlier without computing the fences.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Five numbers: Min, $Q_1$, Median, $Q_3$, Max. $Q_1$ at (n+1)/4, $Q_3$ at 3(n+1)/4. $\\text{IQR} = Q_3 - Q_1$ (robust). Fences $Q_1 - 1.5$ IQR, $Q_3 + 1.5$ IQR (major: 3 IQR). Box plot: median nearer $Q_1$ + long right whisker → right skew.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Lec1 on one screen",
      head: ["Question", "Tool", "Formula"],
      rows: [
        ["What kind of data?", "Nominal < Ordinal < Interval < Ratio", "N/O → nonparametric; I/R → parametric"],
        ["Typical value?", "Mean / Median / Mode", "$\\bar x = \\Sigma x / n$; grouped $\\Sigma fx / \\Sigma f$; median at $(n+1)/2$"],
        ["Lopsided?", "Compare mean and median", "Right skew: mean > median; 3 Md = Mo + $2 \\bar{x}$"],
        ["How spread?", "Range, variance, SD", "$s^2 = SS/(n-1)$, $\\sigma^2 = SS/N$"],
        ["Middle 50%, outliers?", "Five-number summary, IQR, box plot", "$Q_1$ at (n+1)/4; fences $Q_1 - 1.5$ IQR, $Q_3 + 1.5$ IQR"],
      ],
    },
    { type: "diagram", name: "i1-skew" },
    { type: "diagram", name: "i1-boxanat" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Sort before median/quartiles · sample → **n − 1** · state $\\sigma$ or s · skew is named by the **tail** · deviations always sum to 0.",
    },
  ],

  glossary: [
    ["Descriptive statistics", "", "Numbers and graphs that summarise data (centre, spread, shape)"],
    ["Nominal / Ordinal", "Levels of measurement", "Categories without order / categories with order"],
    ["Interval / Ratio", "Levels of measurement", "Numbers with meaningful differences; ratio adds a true zero"],
    ["$\\bar X$, $\\mu$", "Sample mean, population mean", "The average of a sample / of the whole population"],
    ["Median", "", "Middle value of sorted data (50th percentile)"],
    ["Mode", "", "Most frequent value or category"],
    ["Skewness", "", "Lopsidedness; named after the long tail (left = negative, right = positive)"],
    ["SS", "Sum of Squares", "$\\Sigma(x - \\bar x)^2$, the total squared deviation"],
    ["$\\sigma^2$, $\\sigma$", "Population variance, population standard deviation", "SS/N and its square root"],
    ["$s^2$, $s$", "Sample variance, sample standard deviation", "SS/$(n - 1)$ and its square root"],
    ["df", "Degrees of freedom", "Number of values free to vary: $n - 1$ for a sample variance"],
    ["$Q_1$, $Q_2$, $Q_3$", "First, second, third quartile", "25%, 50% (median), 75% marks of sorted data"],
    ["IQR", "Interquartile Range", "$Q_3 - Q_1$: spread of the middle 50%"],
    ["Outlier", "", "A value outside $Q_1 - 1.5$ IQR … $Q_3 + 1.5$ IQR"],
    ["URL / LRL", "Upper / Lower Real Limit", "Boundaries of a continuous measurement, used for the range"],
  ],

  examTips: [
    "Always write the formula first, then substitute. Marks are given for method.",
    "For SD questions, say whether you treat the data as a **sample $(n - 1)$** or a **population (N)**.",
    "Quartiles: use the slides' **(n + 1)/4** position rule and show the interpolation.",
    "“Comment on the shape” → compare mean vs median **and** look at the box plot whiskers; quote the coefficient of skewness if you have s.",
    "“Comment on outliers” → compute both fences explicitly and list any values outside.",
  ],

  problems: [
    {
      title: "Mean time to get ready (slide 22)",
      level: "From slides",
      hint: "Add all 10 times, divide by 10.",
      question: "The times (minutes) to get ready for 10 consecutive work days are: 39, 29, 43, 52, 39, 44, 40, 31, 44, 35. Find the mean.",
      solution: "### What is being asked\nThe arithmetic mean of 10 ungrouped values.\n### Why this approach\nUngrouped interval/ratio data → $\\bar X = \\Sigma X / n$.\n### Working\n$\\Sigma X = 39 + 29 + 43 + 52 + 39 + 44 + 40 + 31 + 44 + 35 = 396$\n$$\\bar X = \\frac{396}{10} = 39.6$$\n### Answer\n**Mean = 39.6 minutes.**\n### Takeaway\nThe mean (39.6) is not one of the recorded times. That's allowed.",
    },
    {
      title: "Deviations from the mean sum to zero (slides 40–41 exercise)",
      level: "From slides",
      hint: "Subtract 39.6 from each time and add the results.",
      question: "Exercise from slide 40 (exercise solution prepared for the website): for the get-ready times above, find the deviation of each value from the mean and then the “mean deviation”.",
      solution: "### What is being asked\nCompute $x - \\bar x$ for each value and average them.\n### Working\nDeviations from 39.6: −0.6, −10.6, 3.4, 12.4, −0.6, 4.4, 0.4, −8.6, 4.4, −4.6.\nPositives: $3.4 + 12.4 + 4.4 + 0.4 + 4.4 = 25.0$. Negatives: −$0.6 - 10.6 - 0.6 - 8.6 - 4.6$ = −25.0. Sum = **0**, so the mean deviation is **0**.\n### Takeaway\nThis always happens: the mean is the balance point (slide 41). That's why the SD squares the deviations first.",
    },
    {
      title: "Mean of grouped scores: TV hours in Bengaluru (slide 23)",
      level: "From slides",
      hint: "Multiply each score by its frequency; divide ΣfY by $\\sum f$.",
      question: "Hours spent watching TV per day: 1 hour $(f = 104)$, 2 hours $(f = 130)$, 3 hours $(f = 98)$. Find the mean.",
      solution: "### What is being asked\nThe mean of grouped (frequency-table) data.\n### Why this approach\nEach score occurs f times, so weight it: $\\bar Y = \\Sigma fY / N$.\n### Working\n$fY$: $1 \\times 104 = 104$, $2 \\times 130 = 260$, $3 \\times 98 = 294$. $\\Sigma fY = 658$; $N = 104 + 130 + 98 = 332$.\n$$\\bar Y = \\frac{658}{332} = 1.98$$\n### Answer\n**Mean ≈ 1.98 hours per day.**\n### Takeaway\nDivide by $\\sum f$ (332 children), not by the number of rows (3).",
    },
    {
      title: "Mode of server failures (slide 26)",
      level: "From slides",
      hint: "Count how often each value appears.",
      question: "Daily server failures over two weeks: 1, 3, 0, 3, 26, 2, 7, 4, 0, 2, 3, 3, 6, 3. Find the mode and interpret it.",
      solution: "### Working\nFrequencies: 0 → 2, 1 → 1, 2 → 2, **3 → 5**, 4 → 1, 6 → 1, 7 → 1, 26 → 1.\n### Answer\n**Mode = 3**: the most common occurrence is three server failures in a day.\n### Takeaway\nThe extreme 26 has no effect on the mode. (It would pull the mean up to 4.5.)",
    },
    {
      title: "Median: odd and even n (slide 29)",
      level: "From slides",
      hint: "Sort first; n odd → middle value; n even → average of the two middle values.",
      question: "(a) Returns of seven small-cap funds: 19.0, 20.8, 22.3, 22.4, 24.9, 26.0, 29.9. (b) Travel times (sorted): 29, 31, 35, 39, 39, 40, 43, 44, 44, 52. Find each median.",
      solution: "### (a) $n = 7$ (odd)\nPosition $(7 + 1)/2 = 4$ → **median = 22.4**.\n### (b) $n = 10$ (even)\nPositions 5 and 6 → 39 and 40 → **median = $(39 + 40)/2 = 39.5$** minutes.\n### Takeaway\nMean of (b) is 39.6, median 39.5: nearly equal, so the data is roughly symmetric.",
    },
    {
      title: "Range (slide 38)",
      level: "From slides",
      question: "Find the range of the scores 7, 2, 7, 6, 5, 6, 2.",
      solution: "Range = highest − lowest = $7 - 2$ = **5**. It uses only two of the seven scores, which is why it's called an imprecise measure.",
    },
    {
      title: "Classify the variables (slide 19)",
      level: "From slides",
      question: "Classify: (i) type of vehicle owned; (ii) product satisfaction (unsatisfied, neutral, fairly satisfied, satisfied); (iii) number of magazines subscribed to; (iv) height in inches; (v) weight in kg; (vi) temperature in °C or °F.",
      solution: "(i) Categorical: **nominal** · (ii) Categorical: **ordinal** · (iii) Numerical: **discrete** · (iv) Continuous: **ratio** · (v) Continuous: **ratio** · (vi) Continuous: **interval** (0 °C / 0 °F is not “no temperature”).",
    },
    {
      title: "Same mean, different spread: Groups 1 and 2 (slides 33–47)",
      level: "From slides",
      hint: "Both means are 5. Find SS for each, then divide by $n - 1 = 8$.",
      question: "Group 1: 2, 8, 5, 3, 7, 8, 5, 2, 5. Group 2: 1, 15, 5, 5, 6, 3, 5, 2, 3. Show that mean, median and mode are equal for both, then find the standard deviation of each.",
      solution: "### Centre\nBoth sums are 45, so both means = 45/9 = 5. Sorted G1: 2, 2, 3, 5, **5**, 5, 7, 8, 8 → median 5, mode 5. Sorted G2: 1, 2, 3, 3, **5**, 5, 5, 6, 15 → median 5, mode 5.\n### Why SD\nIdentical centres, so only a spread measure can tell them apart. The slides use the sample formula $S = \\sqrt{SS/(n-1)}$.\n### Working\nG1 squared deviations: 9, 9, 0, 4, 4, 9, 0, 9, 0 → SS = 44 → $S = \\sqrt{44/8} = 2.345$.\nG2 squared deviations: 16, 100, 0, 0, 1, 4, 0, 9, 4 → SS = 134 → $S = \\sqrt{134/8} = 4.093$.\n### Answer\n**S₁ = 2.345, $S_2 = 4.093$**: Group 2 is much more variable.\n### Takeaway\n“Why mean is not enough”: always report a spread measure with the centre.",
    },
    {
      title: "Learning check: variance from SS (slide 53)",
      level: "From slides",
      question: "A sample of four scores has SS = 24. What is the variance? (1) 6 (2) 7 (3) 8 (4) 12",
      solution: "Sample → $s^2 = SS/(n-1) = 24/3 =$ **8**, option (3). Option (1), 6, is the trap: dividing by $n = 4$ (the population formula).",
    },
    {
      title: "IPL batsmen: average, consistency, extremes (slides 7–8, 55)",
      level: "From slides",
      hint: "Mean for average, SD for consistency, IQR fences for extremes.",
      question: "Runs in 5 matches. Batsman 1: 45, 62, 86, 28, 44. Batsman 2: 34, 78, 12, 135, 64. Who performs better on average? Who is more consistent? Are there any unusual scores?",
      solution: "### Average\nB1: 265/5 = **53**. B2: 323/5 = **64.6**. Batsman 2 is better on average.\n### Consistency (variance and SD)\nB1: deviations −8, 9, 33, −25, −9 → SS = 1940. B2: SS = 8839.2.\nAs on slide 55 (divide by $N = 5$): $\\sigma_1^2 = 388$, $\\sigma_1 = 19.7$; $\\sigma_2^2 = 1767.84$, $\\sigma_2 = 42.05$.\n(Using $n - 1 = 4$: $s_1^2 = 485$, $s_1 = 22.02$; $s_2^2 = 2209.8$, $s_2 = 47.01$. Same conclusion.)\n**Batsman 1 is more consistent**; Batsman 2's spread comes mostly from the 135.\n### Extremes\nB2 sorted 12, 34, 64, 78, 135: $Q_1 = 23$, $Q_3 = 106.5$, IQR = 83.5, upper fence 231.75 → 135 is **unusual but not an outlier** by the 1.5 IQR rule.\n### Takeaway\nAverage and consistency are different questions. Answer both with the right tool.",
    },
    {
      title: "Interquartile range (slide 58)",
      level: "From slides",
      question: "Ordered data: 11, 12, 13, 16, 16, 17, 17, 18, 21. Find $Q_1$, $Q_3$ and the IQR.",
      solution: "### Formula\nPosition of $Q_1 = 1(n+1)/4$, of $Q_3 = 3(n+1)/4$, with $n = 9$.\n### Working\n$Q_1$ position = 10/4 = 2.5 → between 12 and 13 → **12.5**. $Q_3$ position = 30/4 = 7.5 → between 17 and 18 → **17.5**.\n### Answer\n**IQR = $17.5 - 12.5 = 5$.**",
    },
    {
      title: "Practice Q1: office noise levels (slide 66)",
      level: "From slides",
      hint: "$n = 77$. $Q_1$ is at position 19.5 and $Q_3$ at 58.5. Use the sample SD.",
      question: "Noise levels (dBA) for 77 office workers (data on slide 66, already sorted from 55.3 to 83.0). (a) Find the arithmetic mean, SD, variance and IQR. (b) Draw a box-and-whisker plot. (c) Comment on outliers, if any.",
      solution: "*Exercise solution prepared for the website.*\n### Approach\nThe data is a sample of 77 workers → use $s^2 = SS/(n-1)$. Quartiles by the (n + 1)/4 rule.\n### (a) Working\n$\\Sigma x = 4996.3$, so $\\bar x = 4996.3/77 = 64.887$ dBA.\n$SS = \\Sigma(x - \\bar x)^2 = 4627.007$ → $s^2 = 4627.007/76 = 60.88$ dBA², $s = 7.80$ dBA.\nPosition of $Q_1 = 78/4 = 19.5$ → 19th and 20th values are both 57.8 → **Q₁ = 57.8**. Median at position 39 → **64.7**. Position of $Q_3 = 58.5$ → 58th and 59th are both 70.4 → **Q₃ = 70.4**.\n**IQR = $70.4 - 57.8 = 12.6$.**\n### (b) Box plot\nFive-number summary: 55.3, 57.8, 64.7, 70.4, 83.0. Box from 57.8 to 70.4 with the median at 64.7; whiskers to 55.3 and 83.0.\n### (c) Outliers\nLower fence = $57.8 - 1.5 (12.6) = 38.9$; upper fence = $70.4 + 18.9 = 89.3$. All values lie in [55.3, 83.0], so **no outliers**.\n### Shape\nMean 64.89 vs median 64.7 (Sk = $3 (0.187)/7.80 \\approx 0.07$): nearly symmetric overall, though the right whisker (12.6) is much longer than the left (2.5).",
    },
    {
      title: "Practice Q2: fat in chicken sandwiches (slide 67)",
      level: "From slides",
      hint: "Sort the 20 values. $Q_1$ at position 5.25, $Q_3$ at 15.75.",
      question: "Total fat (g/serving) for 20 chicken sandwiches: 7 8 4 5 16 20 20 24 19 30 23 30 25 19 29 29 30 30 40 56. (a) Mean, median, $Q_1$, $Q_3$. (b) Variance, SD, range, IQR; any outliers? (c) Are the data skewed? (d) Conclusions.",
      solution: "*Exercise solution prepared for the website.*\n### Sort\n4, 5, 7, 8, 16, 19, 19, 20, 20, 23, 24, 25, 29, 29, 30, 30, 30, 30, 40, 56 $(n = 20)$.\n### (a)\nMean = 464/20 = **23.2 g**. Median = average of 10th and 11th = (23 + 24)/2 = **23.5 g**.\n$Q_1$ position = 21/4 = 5.25 → $16 + 0.25 (19 - 16)$ = **16.75**. $Q_3$ position = 15.75 → $30 + 0.75 (30 - 30)$ = **30**.\n### (b)\nSS = 2915.2 → $s^2 = 2915.2/19 = 153.43$, **s = 12.39 g**. Range = $56 - 4$ = **52**. $\\text{IQR} = 30 - 16.75$ = **13.25**.\nFences: $16.75 - 19.875$ = −3.125 and $30 + 19.875 = 49.875$ → **56 is an outlier**.\n### (c) Shape\nMean (23.2) is just below the median (23.5); Sk = $3 (23.2 - 23.5)/12.39$ = −$0.07 \\approx 0$. The middle of the data is roughly symmetric, but there's one high outlier (56) on the right.\n### (d) Conclusion\nA typical chicken sandwich has about 23–24 g of fat; the middle half lies between about 17 and 30 g. One sandwich (56 g) is unusually fatty.",
    },
    {
      title: "Practice Q3: camera battery life (slide 68)",
      level: "From slides",
      hint: "$n = 12$. $Q_1$ at position 3.25, $Q_3$ at 9.75.",
      question: "Battery life (shots): 300 180 85 170 380 460 260 35 380 120 110 240. List the five-point summary.",
      solution: "*Exercise solution prepared for the website.*\n### Sort\n35, 85, 110, 120, 170, 180, 240, 260, 300, 380, 380, 460.\n### Quartiles\n$Q_1$ position = 13/4 = 3.25 → $110 + 0.25 (120 - 110)$ = **112.5**. Median = (180 + 240)/2 = **210**. $Q_3$ position = 9.75 → $300 + 0.75 (380 - 300)$ = **360**.\n### Answer\n**Min 35, $Q_1$ 112.5, Median 210, $Q_3$ 360, Max 460.**\n(IQR = 247.5; fences −258.75 and 731.25, so no outliers.)",
    },
    {
      title: "Practice Q4: quartiles, IQR, outliers, box plot (slide 68)",
      level: "From slides",
      hint: "$n = 20$. After sorting, check the two smallest values against $Q_1 - 1.5$ IQR.",
      question: "Data: 73 78 70 81 79 80 73 48 80 80 78 80 80 79 74 82 80 64 45 82. (a) Quartiles. (b) IQR. (c) Five-number summary. (d) Potential outliers. (e) Box plot and interpretation.",
      solution: "*Exercise solution prepared for the website.*\n### Sort\n45, 48, 64, 70, 73, 73, 74, 78, 78, 79, 79, 80, 80, 80, 80, 80, 80, 81, 82, 82.\n### (a) Quartiles\n$Q_1$ position 5.25 → 73 + 0.25(0) = **73**. Median = (79 + 79)/2 = **79**. $Q_3$ position 15.75 → 80 + 0.75(0) = **80**. Interpretation: 25% of values are ≤ 73, half are ≤ 79, 75% are ≤ 80.\n### (b) IQR\n**80 − 73 = 7**: the middle 50% of the data lies within a 7-unit band.\n### (c) Five-number summary\n**45, 73, 79, 80, 82.**\n### (d) Outliers\nLower fence = $73 - 10.5 = 62.5$; upper fence = $80 + 10.5 = 90.5$. **45 and 48 are potential outliers** (both are even below $Q_1 - 3$ IQR = 52, so major outliers).\n### (e) Box plot\nThe median sits close to $Q_3$ and the lower whisker (down to 64) is much longer, with two outliers on the left. The data is **negatively (left) skewed** (mean 74.3 < median 79; Sk = −1.34).",
    },
    {
      title: "Practice Q5: waiting times at two bank branches (slide 69)",
      level: "From slides",
      hint: "$n = 15$ for each, so $Q_1$ is the 4th value and $Q_3$ the 12th (positions 4 and 12 are whole numbers).",
      question: "Commercial branch (15 customers): 4.21, 5.55, 3.02, 5.13, 4.77, 2.34, 3.54, 3.20, 4.50, 6.10, 0.38, 5.12, 6.46, 6.19, 3.79. Residential branch: 9.66, 5.90, 8.02, 5.79, 8.73, 3.82, 8.01, 8.35, 10.49, 6.68, 5.64, 4.08, 6.17, 9.91, 5.47. (a) Five-number summaries. (b) Box plots and shape. (c) Similarities and differences.",
      solution: "*Exercise solution prepared for the website.*\n### Sort\nCommercial: 0.38, 2.34, 3.02, **3.20**, 3.54, 3.79, 4.21, **4.50**, 4.77, 5.12, 5.13, **5.55**, 6.10, 6.19, 6.46.\nResidential: 3.82, 4.08, 5.47, **5.64**, 5.79, 5.90, 6.17, **6.68**, 8.01, 8.02, 8.35, **8.73**, 9.66, 9.91, 10.49.\n### (a) Five-number summaries ($Q_1$ position 16/4 = 4, median 8, $Q_3$ 12)\n| Branch | Min | $Q_1$ | Median | $Q_3$ | Max |\n|---|---|---|---|---|---|\n| Commercial | 0.38 | 3.20 | 4.50 | 5.55 | 6.46 |\n| Residential | 3.82 | 5.64 | 6.68 | 8.73 | 10.49 |\n### (b) Shape\nCommercial: median − $Q_1 = 1.30 > Q_3$ − median = 1.05, and the left whisker (2.82) is far longer than the right (0.91) → **left (negatively) skewed** (mean 4.29 < median 4.50). Fences −0.325 and 9.075 → no outliers.\nResidential: $Q_3$ − median = 2.05 > median − $Q_1 = 1.04$ → **right (positively) skewed** (mean 7.11 > median 6.68). Fences 1.005 and 13.365 → no outliers.\n### (c) Comparison\nSimilar: both have 15 observations and no outliers. Different: the commercial branch's customers wait **less** (median 4.50 vs 6.68 min) and the **middle 50% is tighter** (IQR 2.35 vs 3.09); the two branches are skewed in opposite directions.",
    },
    {
      title: "Level 1: mean, median and mode",
      level: "Level 1",
      hint: "Sort first for the median; $n = 7$ is odd.",
      question: "Daily cups of tea sold by a stall over a week: 4, 8, 6, 5, 3, 8, 9 (in tens). Find the mean, median and mode.",
      solution: "### Working\nSum = 43, $n = 7$ → **mean = 43/7 = 6.14**. Sorted: 3, 4, 5, **6**, 8, 8, 9 → median at position 4 = **6**. 8 appears twice → **mode = 8**.\n### Takeaway\nThe three measures differ (6.14, 6, 8). With only 7 values, don't read too much into the shape.",
    },
    {
      title: "Level 1: level of measurement",
      level: "Level 1",
      question: "Classify each as nominal, ordinal, interval or ratio, and as discrete or continuous where it is numerical: (i) customer rating as Poor / Fair / Good / Excellent; (ii) monthly electricity bill in ₹; (iii) number of complaints received per day; (iv) temperature in Delhi in °C; (v) mode of commuting (bus, metro, car).",
      solution: "(i) **Ordinal** (ordered categories) · (ii) **Ratio**, continuous (₹0 means no bill) · (iii) **Ratio**, **discrete** (a count with a true zero) · (iv) **Interval**, continuous (no true zero) · (v) **Nominal**.",
    },
    {
      title: "Level 1: range and sample SD",
      level: "Level 1",
      question: "A sample has values 4, 7, 10. Find the range, the sample variance and the sample SD.",
      solution: "Range = $10 - 4$ = **6**. Mean = 7; deviations −3, 0, 3; SS = 18. $s^2 = 18/(3-1) =$ **9**, $s =$ **3**.",
    },
    {
      title: "Level 2: sample standard deviation",
      level: "Level 2",
      hint: "Find the mean, then SS, then divide by $n - 1 = 5$.",
      question: "UPI payments received by a small shop on six random days: 12, 15, 9, 20, 14, 14. Find the mean and sample SD.",
      solution: "### Working\nMean = 84/6 = **14**. Deviations: −2, 1, −5, 6, 0, 0 → squares 4, 1, 25, 36, 0, 0 → SS = 66.\n$s^2 = 66/5 = 13.2$, **s = 3.63** payments.\n### Takeaway\nIt's a sample of days, so $n - 1$.",
    },
    {
      title: "Level 2: grouped mean",
      level: "Level 2",
      question: "In a housing society, cars per household: 0 cars (12 households), 1 car (20), 2 cars (6), 3 cars (2). Find the mean number of cars per household.",
      solution: "$N = 40$; $\\Sigma fY = 0(12) + 1(20) + 2(6) + 3(2) = 38$. **Mean = 38/40 = 0.95** cars per household.",
    },
    {
      title: "Level 2: empirical relation",
      level: "Level 2",
      question: "A moderately skewed distribution has mean 40 and median 42. Estimate the mode and state the direction of skew.",
      solution: "$3\\,\\text{Median} = \\text{Mode} + 2\\,\\text{Mean}$ → Mode = $3 (42) - 2 (40)$ = **46**. Mean < median < mode → **negatively (left) skewed**.",
    },
    {
      title: "Level 2: five-number summary and outliers",
      level: "Level 2",
      hint: "$n = 9$: $Q_1$ at position 2.5, $Q_3$ at 7.5.",
      question: "Delivery times (minutes) for nine food orders: 22, 25, 27, 28, 30, 31, 33, 35, 60. Give the five-number summary and test for outliers.",
      solution: "### Working\n$Q_1$ position 2.5 → (25 + 27)/2 = **26**. Median (position 5) = **30**. $Q_3$ position 7.5 → (33 + 35)/2 = **34**. IQR = 8.\nFences: $26 - 12 = 14$ and $34 + 12 = 46$. **60 > 46 → outlier**; it is even beyond $Q_3 + 3$ IQR = 58, so a **major** outlier.\n### Answer\nFive-number summary: **22, 26, 30, 34, 60**; one (major) outlier, 60.",
    },
    {
      title: "Level 3: which machine is more consistent?",
      level: "Level 3",
      hint: "Same mean, so compare the SDs.",
      question: "Two machines fill 500 ml bottles. Samples: Machine A 498, 502, 500, 499, 501; Machine B 495, 505, 500, 497, 503. Which machine would you buy, and why?",
      solution: "### Approach\nBoth means are 500 ml (on target), so the decision rests on **variability**: compute the sample SD.\n### Working\nA: deviations −2, 2, 0, −1, 1 → SS = 10 → $s^2 = 2.5$, $s_A = 1.58$ ml.\nB: deviations −5, 5, 0, −3, 3 → SS = 68 → $s^2 = 17$, $s_B = 4.12$ ml.\n### Answer\n**Machine A**: same average fill, but about 2.6× less spread, so fewer under-filled or over-filled bottles.",
    },
    {
      title: "Level 3: adding a value equal to the mean",
      level: "Level 3",
      hint: "SS doesn't change (the new deviation is 0), but $n - 1$ does.",
      question: "A sample of 5 values has mean 10 and SD 2. A sixth value, 10, is added. Find the new mean and new SD.",
      solution: "### Working\nOld SS = $s^2(n-1) = 4 × 4 = 16$. The new value equals the mean, so the mean stays **10** and its deviation is 0: SS stays 16.\nNew $s^2 = 16/(6-1) = 3.2$, **new $s = 1.79$**.\n### Takeaway\nAdding a value at the centre **reduces** the SD: same total squared deviation, shared among more degrees of freedom.",
    },
    {
      title: "Level 3: coefficient of skewness both ways",
      level: "Level 3",
      question: "A distribution has mean 52, median 50 and SD 12. (a) Find the coefficient of skewness using the median. (b) Estimate the mode with the empirical relation and recompute the coefficient using the mode. Comment.",
      solution: "(a) $Sk = 3(52 - 50)/12 = 6/12 =$ **0.5** (positive skew).\n(b) Mode = $3 (50) - 2 (52)$ = **46**; $Sk = (52 - 46)/12 =$ **0.5**.\n**Comment:** the two formulas agree exactly here, because the mode was estimated with the empirical relation, which is what links them. The positive value means a longer right tail.",
    },
  ],

  theory: [
    {
      title: "Why is the mean not enough?",
      level: "Level 1",
      question: "Using the slides' two groups, explain why a measure of central tendency alone cannot describe a data set.",
      solution: "### What the examiner wants\nThe idea of variability, with the slide example.\n### Model answer\nGroups $X_1$ (2, 8, 5, 3, 7, 8, 5, 2, 5) and $X_2$ (1, 15, 5, 5, 6, 3, 5, 2, 3) both have **mean = median = mode = 5**, yet $X_2$ is far more scattered ($S = 4.093$ vs 2.345). A centre tells you *where* the data is, not *how spread* it is. So we also need measures of variability: range, variance and standard deviation.\n### Takeaway\nAlways report centre **and** spread.",
    },
    {
      title: "Which measure of centre?",
      level: "Level 2",
      question: "For each, state the best measure of central tendency and why: (a) favourite cricket team of students; (b) annual incomes in a city with a few billionaires; (c) heights of adult men in a large sample.",
      solution: "(a) **Mode**: the data is nominal; only the mode applies.\n(b) **Median**: the incomes are right-skewed; the mean would be dragged up by the few extreme values.\n(c) **Mean**: interval/ratio and roughly symmetric, so the mean uses every value and is the most stable (and is needed for SD).",
    },
    {
      title: "Why divide by n − 1?",
      level: "Level 2",
      question: "Explain why the sample variance uses $n - 1$ rather than n, and define degrees of freedom.",
      solution: "### Model answer\nSamples systematically have **less variability** than the population (extreme scores are less likely to be included), so dividing SS by n gives a **biased, too-small** estimate of the population variance. Dividing by **n − 1** corrects this (slides 50–51).\n**Degrees of freedom** = the number of scores that are independent and free to vary. Once $\\bar X$ is computed from the sample, the deviations must sum to zero, so only $n - 1$ of them are free: **df = $n - 1$** (slide 52).",
    },
    {
      title: "Range vs IQR vs SD",
      level: "Level 3",
      question: "Compare range, IQR and standard deviation as measures of variability. Which would you use for data with outliers?",
      solution: "| | Range | IQR | SD |\n|---|---|---|---|\n| Uses | Only min and max | Middle 50% | Every value |\n| Effect of extremes | Wrecked by one value | **Not affected** | Strongly affected (squared) |\n| Units | Data units | Data units | Data units (variance: squared) |\n| Best for | Quick rough idea | Skewed data / outliers | Symmetric data, further analysis |\n\n**With outliers, use the IQR** (together with the median), as in the box plot.",
    },
    {
      title: "Reading a box plot",
      level: "Level 2",
      question: "What can you read from a box-and-whisker plot? How do you tell the direction of skew from it?",
      solution: "It shows the **five-number summary** (min, $Q_1$, median, $Q_3$, max), the **IQR** (box length), and **outliers** (points beyond $Q_1 - 1.5$ IQR or $Q_3 + 1.5$ IQR). **Skew:** median near the centre of the box with equal whiskers → symmetric; median nearer $Q_3$ with a longer **left** whisker → **negative** skew; median nearer $Q_1$ with a longer **right** whisker → **positive** skew (slide 63).",
    },
  ],

  quiz: [
    {
      topic: "Data types",
      q: "Temperature in °C is measured on which scale?",
      options: ["Nominal", "Ordinal", "Interval", "Ratio"],
      answer: 2,
      why: "Differences are meaningful but there is no true zero (0 °C isn't “no temperature”).",
      wrong: ["Nominal has no order; temperatures are ordered.", "Ordinal only ranks; temperature differences are meaningful too.", null, "Ratio needs a true zero, so 40 °C isn't twice 20 °C."],
    },
    {
      topic: "Data types",
      q: "Which statistical methods suit ordinal data, according to slide 17?",
      options: ["Parametric", "Nonparametric", "Both equally", "Neither"],
      answer: 1,
      why: "Nominal and ordinal data → nonparametric; interval and ratio → parametric.",
      wrong: ["Parametric methods need at least interval data (addition/subtraction).", null, "The slide assigns ordinal to nonparametric only.", "Ranking-based (nonparametric) methods do apply."],
    },
    {
      topic: "Centre",
      type: "num",
      q: "Find the mean of 39, 29, 43, 52, 39, 44, 40, 31, 44, 35.",
      answer: 39.6,
      tol: 0.05,
      why: "396 / 10 = 39.6.",
    },
    {
      topic: "Centre",
      type: "num",
      q: "Grouped data: score 1 $(f = 104)$, 2 $(f = 130)$, 3 $(f = 98)$. Mean to 2 decimals?",
      answer: 1.98,
      tol: 0.01,
      why: "ΣfY = $104 + 260 + 294 = 658$; $N = 332$; 658/332 = 1.98.",
    },
    {
      topic: "Centre",
      type: "num",
      q: "Median of 29, 31, 35, 39, 39, 40, 43, 44, 44, 52?",
      answer: 39.5,
      tol: 0.01,
      why: "$n = 10$ (even): average of 5th and 6th values, (39 + 40)/2.",
    },
    {
      topic: "Centre",
      q: "Which measure of central tendency is the only one usable for nominal data?",
      options: ["Mean", "Median", "Mode", "Midrange"],
      answer: 2,
      why: "You can count categories (mode) but can't sort or average them.",
      wrong: ["Averaging category labels is meaningless.", "The median needs ordering, which nominal data lacks.", null, "Midrange is not covered, and needs numbers anyway."],
    },
    {
      topic: "Shape",
      q: "A distribution has mean 70 and median 62. It is most likely…",
      options: ["Symmetric", "Positively (right) skewed", "Negatively (left) skewed", "Bimodal"],
      answer: 1,
      why: "Mean > median: the mean is pulled toward a long right tail.",
      wrong: ["Symmetric needs mean ≈ median.", null, "Left skew gives mean < median.", "Mean vs median says nothing about the number of peaks."],
    },
    {
      topic: "Shape",
      type: "num",
      q: "Moderately skewed data: mean 40, median 42. Estimate the mode using 3 Median = Mode + 2 Mean.",
      answer: 46,
      tol: 0.01,
      why: "Mode = $3 (42) - 2 (40) = 46$.",
    },
    {
      topic: "Spread",
      type: "num",
      q: "A sample of four scores has SS = 24. What is the variance?",
      answer: 8,
      tol: 0.01,
      why: "Sample: $s^2$ = SS/$(n - 1) = 24/3 = 8$.",
    },
    {
      topic: "Spread",
      q: "If all the scores in a data set are the same, the standard deviation is…",
      options: ["1", "0", "Equal to the mean", "Undefined"],
      answer: 1,
      why: "Every deviation from the mean is 0, so SS = 0 and SD = 0.",
      wrong: ["There's no spread at all, so it can't be 1.", null, "SD measures spread, not location.", "$\\sqrt{0} = 0$ is perfectly defined."],
    },
    {
      topic: "Spread",
      type: "num",
      q: "Group 1: 2, 8, 5, 3, 7, 8, 5, 2, 5 (SS = 44). Sample SD to 3 decimals?",
      answer: 2.345,
      tol: 0.002,
      why: "$s = \\sqrt{44/8} = \\sqrt{5.5} = 2.345$.",
    },
    {
      topic: "Spread",
      q: "Why are deviations squared when computing the variance?",
      options: ["To make the numbers bigger", "Because deviations from the mean always sum to zero", "To convert to percentages", "Because the median requires it"],
      answer: 1,
      why: "The mean is the balance point, so raw deviations cancel out. Squaring makes them all positive.",
      wrong: ["Size isn't the goal; cancellation is the problem.", null, "No percentages are involved.", "The median plays no role in variance."],
    },
    {
      topic: "Five-number summary",
      type: "num",
      q: "Ordered data 11, 12, 13, 16, 16, 17, 17, 18, 21. IQR?",
      answer: 5,
      tol: 0.01,
      why: "$Q_1$ at position 2.5 = 12.5; $Q_3$ at 7.5 = 17.5; IQR = 5.",
    },
    {
      topic: "Five-number summary",
      type: "num",
      q: "$Q_1 = 73$, $Q_3 = 80$. What is the lower outlier limit $Q_1 - 1.5$ IQR?",
      answer: 62.5,
      tol: 0.01,
      why: "IQR = 7; $73 - 10.5 = 62.5$.",
    },
    {
      topic: "Five-number summary",
      q: "In a box plot the median is close to $Q_1$ and the right whisker is much longer. The data is…",
      options: ["Negatively skewed", "Symmetric", "Positively skewed", "Has no outliers"],
      answer: 2,
      why: "The long right side (tail) means positive skew.",
      wrong: ["Negative skew has the long side on the left.", "Symmetric needs a centred median and equal whiskers.", null, "Whisker length alone doesn't settle outliers; you need the fences."],
    },
    {
      topic: "Five-number summary",
      q: "Which measure of variability is NOT affected by extreme values?",
      options: ["Range", "Variance", "Standard deviation", "Interquartile range"],
      answer: 3,
      why: "The IQR uses only the middle 50%.",
      wrong: ["Range is literally $\\max - \\min$.", "Squaring makes extremes count even more.", "SD is √variance, so it's affected too.", null],
    },
  ],
};
