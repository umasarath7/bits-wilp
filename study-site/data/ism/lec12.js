// ISM — Lectures 12 & 13 (one deck): Time series analysis — components, trend fitting, moving averages,
// exponential smoothing, forecast-error measures, Holt (double) and Holt-Winters (triple) smoothing, stationarity.
// Source: CourseFiles/ISM/Lec12-13.pdf (70 pages). Every topic cites its slides; nothing outside the deck is taught.
// Numbers marked "Exercise solution prepared for the website" were computed (and checked in Python) from the slide data.

export default {
  title: "Time Series Analysis & Forecasting",
  source: "Lec12-13.pdf (Sessions 12 & 13) · 70 pages · consolidated exam PDF pp. 667–735",
  quizMode: "step",
  overview:
    "A **time series** is a list of values recorded one after another in time: monthly sales, yearly crop output, quarterly GDP. The order matters, and the past is used to **forecast** the future. This deck first breaks a series into its parts (**trend, seasonal, cyclical, irregular**, slides 3–12), then fits a straight or curved **trend line** (slides 13–18). For series without a clear trend it **smooths** the noise with **moving averages** (slides 19–23) and **exponential smoothing** (slides 24–29), and judges forecasts with **MSE, MAD, MAPE and LAD** (slides 27, 30–35). For series with a trend it adds a trend term (**Holt’s double exponential smoothing**, slides 42–57), and for trend plus seasons a seasonal term (**Holt-Winters triple exponential smoothing**, slides 58–68). It ends with **stationarity** (slides 69–70). Slides 36–41 are practice exercises; worked solutions are in ✍️ Solved Questions.",

  simpleIntro: "A **time series** is one number recorded again and again over time: monthly sales, yearly crop output, quarterly GDP. The goal is to **forecast** the next values. Think of it like weather: there is a long-run climate (trend), a yearly rhythm (seasons), slow irregular waves (cycles) and day-to-day surprises (noise). This lecture shows how to separate those pieces and three families of forecasting tools: **trend lines**, **smoothing** (moving averages, exponential smoothing) and **Holt / Holt-Winters** for trends and seasons. All examples are the lecturer's own.",

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
              "title": "Break it into parts",
              "text": "Every series = **T**rend + **S**easonal + **C**yclical + **I**rregular (or their product).",
              "tag": "Understand",
              "example": "House sales: rising trend, summer peaks",
              "figure": "i12-comp"
            },
            {
              "title": "Smooth the noise",
              "text": "Average neighbouring values (moving average) or blend new data with the old forecast (exponential smoothing).",
              "tag": "Forecast flat series",
              "example": "3-year MA forecast for 2005 = 26.33",
              "figure": "i12-ma"
            },
            {
              "title": "Follow trend and seasons",
              "text": "**Holt** adds a running trend; **Holt-Winters** also adds a seasonal factor for each month or quarter.",
              "tag": "Forecast trending series",
              "example": "GDP forecast for 2021 = 2363",
              "figure": "i12-holt"
            }
          ]
        }
      ]
    },
    {
      "id": "s-parts",
      "heading": "2. The four ingredients of a time series",
      "slides": "3–12",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Ingredient",
            "In plain words",
            "Example"
          ],
          "rows": [
            [
              "**Trend**",
              "The long-run direction over several years",
              "India's population keeps rising"
            ],
            [
              "**Seasonal**",
              "A rhythm that repeats every year (or week) on the calendar",
              "AC sales peak every summer"
            ],
            [
              "**Cyclical**",
              "Long waves of boom and slump, with no fixed length (2+ years)",
              "Business cycles"
            ],
            [
              "**Irregular**",
              "Random, unpredictable shocks",
              "A flood, a sudden policy change"
            ]
          ]
        },
        {
          "type": "diagram",
          "name": "i12-comp"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Putting them together (slide 12)",
          "text": "$$\\text{Additive: } y_t = T_t + C_t + S_t + I_t \\qquad \\text{Multiplicative: } y_t = T_t \\times C_t \\times S_t \\times I_t$$ **Additive** if the seasonal swings stay the same size; **multiplicative** if they grow with the level."
        },
        {
          "type": "check",
          "q": "Sales jump every Diwali, every year. Which component?",
          "options": [
            "Trend",
            "Seasonal",
            "Cyclical",
            "Irregular"
          ],
          "answer": 1,
          "why": "A fixed, calendar-based repeat within a year is seasonal."
        }
      ]
    },
    {
      "id": "s-trend",
      "heading": "3. Drawing a trend line through the years",
      "slides": "13–18",
      "blocks": [
        {
          "type": "p",
          "text": "**The trick: renumber the years so they are centred on zero.** Then the least-squares formulas from Lecture 11 become very short, because $\\sum x = 0$."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Coded time (slide 15)",
          "text": "- **Odd number of years:** middle year = 0, so x = −2, −1, 0, 1, 2.\n- **Even number of years:** x = −5, −3, −1, 1, 3, 5 (steps of 2, so no zero).\n$$b = \\frac{\\sum xY}{\\sum x^2} \\qquad a = \\frac{\\sum Y}{n} \\qquad \\hat Y = a + bx$$"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slide 16: crops 2016–2020",
          "text": "Y = 35, 55, 79, 80, 40. Middle year 2018 → x = −2, −1, 0, 1, 2.\n$\\sum xY = -70 - 55 + 0 + 80 + 80 = 35$, $\\sum x^2 = 10$, $\\sum Y = 289$.\n$b = 35/10 = 3.5$, $a = 289/5 = 57.8$. For 2021, x = 3: $57.8 + 3.5 \\times 3$."
        },
        {
          "type": "answer",
          "value": "2021 forecast: 68.3 tons"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slide 17: sales 2016–2021 (even)",
          "text": "x = −5, −3, −1, 1, 3, 5; $\\sum xY = 18$, $\\sum x^2 = 70$, $\\sum Y = 166$. $b = 0.2571$, $a = 166/6 = 27.67$. For 2022, x = 7 → 29.47. (The slide's “12111/6” is a typo: 12111 is the sum of the years, not the sales.)"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Curved trend?",
          "text": "Add an $x^2$ term: $Y = a + bx + cx^2$, with three normal equations (slide 18). But be careful forecasting with curves: our website check on the crop data gives a 2021 forecast of −3 tons!"
        }
      ]
    },
    {
      "id": "s-ma",
      "heading": "4. Moving averages: smoothing by averaging neighbours",
      "slides": "19–23",
      "blocks": [
        {
          "type": "p",
          "text": "Neighbouring values are usually similar, so averaging them cancels random noise. Take k values, average them, slide one step, repeat. **The last average is the forecast for the next period.**"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slides 20–21: production 1995–2004",
          "text": "Data: 21, 22, 23, 25, 24, 22, 25, 26, 27, 26.\nFirst 3-year average: $(21 + 22 + 23)/3 = 22.00$, placed at the **middle year, 1996**.\nSlide on: 23.33, 24.00, 23.67, 23.67, 24.33, 26.00, 26.33.\nForecast 2005 = last average $(26 + 27 + 26)/3$."
        },
        {
          "type": "answer",
          "value": "2005 forecast: 26.33"
        },
        {
          "type": "diagram",
          "name": "i12-ma"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Where does each average go?",
          "text": "Put it at the **middle** of its window (slide 20's table puts 22.00 at 1995, one row too early). For an **even** window like 4 years, the average lands between two years, so average neighbouring pairs to **centre** it: $(22.75 + 23.50)/2 = 23.13$ at 1997 (slide 22)."
        },
        {
          "type": "check",
          "q": "Values 25, 24, 22. Their 3-period moving average?",
          "options": [
            "23.00",
            "23.67",
            "24.00",
            "71"
          ],
          "answer": 1,
          "why": "$(25 + 24 + 22)/3 = 71/3 = 23.67$."
        }
      ]
    },
    {
      "id": "s-es",
      "heading": "5. Exponential smoothing: blend new data with the old forecast",
      "slides": "24–29",
      "blocks": [
        {
          "type": "p",
          "text": "**Analogy.** Your forecast is your current opinion. Each period you see the actual value and move your opinion **part of the way** towards it. α (alpha) says how far you move: α = 0.3 means 30% of the way."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "One-line update (slides 24, 28)",
          "text": "$$F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t \\qquad \\text{start with } F_2 = Y_1$$\n- α near 1: jumpy, follows the latest value (α = 1 is the **naïve** forecast).\n- α near 0: calm and smooth, slow to react."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slide 25: α = 0.3",
          "text": "Start $F_{1996} = 21$.\n$F_{1997} = 0.3(22) + 0.7(21) = 21.3$\n$F_{1998} = 0.3(23) + 0.7(21.3) = 21.81$\n$F_{1999} = 0.3(25) + 0.7(21.81) = 22.77$ … and so on to $F_{2004} = 25.05$.\n$F_{2005} = 0.3(26) + 0.7(25.05)$"
        },
        {
          "type": "answer",
          "value": "2005 forecast: 25.34"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Why “exponential”?",
          "text": "Today's value gets weight α, yesterday's α(1 − α), the day before α(1 − α)², …: weights shrink by the same factor each step back, exponentially."
        },
        {
          "type": "check",
          "q": "$F_t = 50$, $Y_t = 60$, α = 0.2. $F_{t+1}$?",
          "options": [
            "52",
            "58",
            "55",
            "60"
          ],
          "answer": 0,
          "why": "$0.2(60) + 0.8(50) = 12 + 40 = 52$."
        }
      ]
    },
    {
      "id": "s-errors",
      "heading": "6. Scoring forecasts: MSE, MAD, MAPE, LAD",
      "slides": "26–35",
      "blocks": [
        {
          "type": "p",
          "text": "Error = **actual − forecast**, written $\\Delta_t$ (delta). Smaller errors = better method. Four ways to summarise them:"
        },
        {
          "type": "table",
          "head": [
            "Measure",
            "Formula",
            "In words"
          ],
          "rows": [
            [
              "MSE",
              "$\\frac{\\sum\\Delta^2}{n}$",
              "average **squared** error (big misses hurt a lot)"
            ],
            [
              "MAD",
              "$\\frac{\\sum|\\Delta|}{n}$",
              "average size of the miss, in the data's units"
            ],
            [
              "MAPE",
              "$\\frac{100}{n}\\sum\\frac{|\\Delta|}{Y}$",
              "average miss as a **percentage**"
            ],
            [
              "LAD",
              "$\\max|\\Delta|$",
              "the single **worst** miss"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slides 30–34: which α is best?",
          "text": "Capacity utilization for 15 quarters, smoothed three ways:\nα = 0.2 → MSE 3.848; α = 0.4 → MSE 2.395; α = 0.7 → MSE **1.579**."
        },
        {
          "type": "answer",
          "value": "α = 0.7 wins",
          "text": "Its forecast for Q4/2020 is 80.74. This series turns down then up, so a quick-reacting forecast does best."
        },
        {
          "type": "diagram",
          "name": "i12-exp"
        },
        {
          "type": "check",
          "q": "Errors 2, −1, −3, 2. MAD?",
          "options": [
            "0",
            "2",
            "4.5",
            "8"
          ],
          "answer": 1,
          "why": "$(2 + 1 + 3 + 2)/4 = 2$. (MSE would be 18/4 = 4.5.)"
        }
      ]
    },
    {
      "id": "s-holt",
      "heading": "7. Holt: smoothing that follows a trend",
      "slides": "42–57",
      "blocks": [
        {
          "type": "p",
          "text": "On a rising series, simple smoothing is always **behind**, because it blends in older, lower values. Holt keeps **two** running numbers: the **level** L (where we are now) and the **trend** T (how much we climb per period)."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Holt's three lines (slide 44)",
          "text": "$$L_t = \\alpha Y_t + (1 - \\alpha)(L_{t-1} + T_{t-1})$$ $$T_t = \\beta(L_t - L_{t-1}) + (1 - \\beta)T_{t-1}$$ $$F_{t+1} = L_t + T_t, \\qquad F_{t+k} = L_t + kT_t$$ **Level:** blend today's actual with where we expected to be. **Trend:** blend the latest climb with the old trend. **Forecast:** level + trend."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slides 53–57: GDP, α = 0.8, β = 0.4",
          "text": "Start $L = 1451$, $T = 0$.\n**2001** (1499): $L = 0.8(1499) + 0.2(1451) = 1489$; $T = 0.4(1489 - 1451) = 15$ → forecast 2002 = 1504.\n**2002** (1686): $L = 0.8(1686) + 0.2(1489 + 15) = 1650$; $T = 0.4(161) + 0.6(15) = 73$ → forecast 2003 = 1723.\n… GDP falls after 2015, so the trend turns negative. **2020:** $L = 2412$, $T = -49$."
        },
        {
          "type": "answer",
          "value": "2021 forecast: 2412 − 49 = 2363"
        },
        {
          "type": "diagram",
          "name": "i12-holt"
        },
        {
          "type": "check",
          "q": "L = 2412, T = −49. Forecast 2 periods ahead?",
          "options": [
            "2363",
            "2314",
            "2461",
            "2412"
          ],
          "answer": 1,
          "why": "$L + 2T = 2412 - 98$."
        }
      ]
    },
    {
      "id": "s-hw",
      "heading": "8. Holt-Winters: trend plus seasons",
      "slides": "58–68",
      "blocks": [
        {
          "type": "p",
          "text": "Now add a **seasonal factor** for each quarter (or month): 1.14 means “this quarter usually runs 14% above normal”, 0.90 means 10% below. Holt-Winters removes the season before updating the level, then puts it back into the forecast."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Start-up and forecast (slides 58–60)",
          "text": "**Factors from year 1:** $S_i = Y_i \\div (\\text{average of year 1})$.\n**Start:** $L_{M+1} = Y_{M+1}/S_1$, $T_{M+1} = Y_{M+1}/S_1 - Y_M/S_M$.\n**Forecast:** $(L_t + kT_t) \\times$ the factor of the **same season last year**."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Lecturer's slides 61–62: quarterly demand",
          "text": "Year 1: 362, 385, 432, 341 (average 380). Factors: 0.953, 1.013, **1.137** (Q3 is the peak), 0.897.\nNext Q1 = 382: $L_5 = 382/0.953 = 400.99$; $T_5 = 400.99 - 341/0.897 = 20.99$.\nForecast Q2: $(400.99 + 20.99) \\times 1.013 = 427.54$ (actual 409)."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Slide 62's last four forecasts use the wrong quarters",
          "text": "They multiply by the factors from two quarters earlier. Matching each quarter to its own factor gives **731.97, 795.93, 907.82, 718.56** for Q1–Q4, with the Q3 peak where it belongs."
        },
        {
          "type": "check",
          "q": "The Q3 seasonal factor is 1.14 and level + trend = 800. Q3 forecast?",
          "options": [
            "800",
            "912",
            "702",
            "1140"
          ],
          "answer": 1,
          "why": "$800 \\times 1.14 = 912$."
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
          "q": "Which method suits a series with **no** trend and **no** seasons?",
          "options": [
            "Holt-Winters",
            "Simple exponential smoothing",
            "Quadratic trend",
            "Holt"
          ],
          "answer": 1,
          "why": "Smoothing methods are for flat (stationary) series (slides 14, 19)."
        },
        {
          "type": "check",
          "q": "A stationary series is one whose behaviour…",
          "options": [
            "grows over time",
            "doesn't change when you shift the time origin",
            "repeats every year",
            "is always zero"
          ],
          "answer": 1,
          "why": "Slide 69."
        },
        {
          "type": "check",
          "q": "Three methods give MSE 4.2, 2.9 and 3.5. Choose…",
          "options": [
            "4.2",
            "2.9",
            "3.5",
            "any"
          ],
          "answer": 1,
          "why": "Smallest error wins."
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
          "text": "- **T-S-C-I:** Trend (long run), Seasonal (calendar), Cyclical (irregular long waves), Irregular (random).\n- **Trend line:** centre the years (x sums to 0), $b = \\sum xY/\\sum x^2$, $a = \\bar Y$.\n- **Moving average:** average k neighbours, put it in the middle; last MA = next forecast.\n- **Exponential smoothing:** $F_{t+1} = \\alpha Y + (1 - \\alpha)F$, start $F_2 = Y_1$.\n- **Errors:** actual − forecast; MSE, MAD, MAPE, LAD; smallest wins.\n- **Holt:** level → trend → forecast $L + kT$. **Holt-Winters:** × the same season's factor.\n- Memory hook: **“Average to calm it, add a trend to chase it, add seasons to dance with it.”**"
        }
      ]
    }
  ],

  summary: [
    {
      id: "components",
      heading: "Lesson 1: What is a time series, and what is it made of?",
      slides: "3–12",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "To recognise the four building blocks of any time series and how they combine.",
        },
        {
          type: "p",
          text: "**Definition (slides 3–6).** A time series is a set of observations $Y_1, Y_2, \\dots, Y_n$, where $Y_t$ (“Y at time t”) is the value at time t. A **continuous** series is recorded all the time (reactor temperature, tide level, an electrical signal); a **discrete** series is recorded at fixed intervals or accumulated over a period (monthly sales, daily rainfall, yearly crop production). Slide 5 shows two: India’s population 1901–2011 (236 → 1211 million) and international tourist arrivals.",
        },
        { type: "diagram", name: "i12-comp" },
        {
          type: "table",
          caption: "The four components (slides 7–11)",
          head: ["Component", "What it looks like", "Typical cause", "Time scale"],
          rows: [
            ["**Trend** $T_t$", "Persistent overall upward or downward movement (need not be a straight line)", "Population, technology", "Several years"],
            ["**Seasonal** $S_t$", "Regular ups and downs that repeat over a fixed, known period", "Weather, customs, festivals", "Within one year (month, quarter, day of week)"],
            ["**Cyclical** $C_t$", "Repeated but **non-periodic** waves; no fixed length", "Business booms and slumps", "Usually at least 2 years"],
            ["**Irregular** $I_t$", "No pattern, unpredictable", "Disasters, sudden policy or interest-rate changes, company collapses", "Short, random"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Seasonal vs cyclical: the classic confusion",
          text: "**Seasonal** = fixed calendar rhythm you can set your watch by (ice-cream sales peak every summer). **Cyclical** = long waves of irregular length (an economic boom may last 3 years or 7). The slide warns the name “cycle” is misleading: there is no guarantee it returns regularly (slide 10).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Additive vs multiplicative models (slide 12)",
          text: "$$\\text{Additive: } y_t = T_t + C_t + S_t + I_t \\qquad \\text{Multiplicative: } y_t = T_t \\times C_t \\times S_t \\times I_t$$\nUse **additive** when the swings around the trend stay the same size as the series grows. Use **multiplicative** when the swings grow in proportion to the level (a 10% festival boost is bigger when sales are bigger).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "**T-S-C-I**: Trend (years), Seasonal (fixed, within a year), Cyclical (irregular waves, 2+ years), Irregular (random).",
        },
      ],
    },
    {
      id: "trend",
      heading: "Lesson 2: Fitting a trend line by least squares",
      slides: "13–18",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Which forecasting method to pick, and how to fit a straight or quadratic trend quickly by coding the years.",
        },
        {
          type: "p",
          text: "**The map (slides 13–14).** Forecasting is **qualitative** (opinion, panel consensus, Delphi method, market research) or **quantitative**. Quantitative methods are either **causal** (regression on other variables) or **time series**. For a time series, ask: **is there a trend?** No → **smoothing methods** (moving average, exponential smoothing). Yes → **trend models** (linear, quadratic, exponential, auto-regressive).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Linear trend with coded time (slide 15)",
          text: "Model $Y_t = a + bt + e$. Replace the years by a coded variable x that is centred on zero, so $\\sum x = 0$ and the least-squares formulas collapse to:\n$$\\hat b = \\frac{\\sum xY_t}{\\sum x^2} \\qquad \\hat a = \\frac{\\sum Y_t}{n}$$\n- **Odd n:** $x = \\frac{t - \\text{middle value of } t}{h}$ → $x = \\dots, -2, -1, 0, 1, 2, \\dots$\n- **Even n:** $x = \\frac{t - \\text{mean of the two middle values}}{h/2}$ → $x = \\dots, -5, -3, -1, 1, 3, 5, \\dots$\n(h = the gap between consecutive times, e.g. 1 year.)",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example, odd n (slide 16): crop production 2016–2020",
          text: "Y = 35, 55, 79, 80, 40 tons. Middle year 2018, so $x = t - 2018 = -2, -1, 0, 1, 2$.\n$\\sum Y = 289$; $\\sum xY = -70 - 55 + 0 + 80 + 80 = 35$; $\\sum x^2 = 10$.\n$\\hat b = 35/10 = 3.5$; $\\hat a = 289/5 = 57.8$ → $\\hat Y = 57.8 + 3.5x$.\n**Forecast 2021** ($x = 3$): $57.8 + 3.5(3) = 68.3$ tons.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example, even n (slide 17): mall sales 2016–2021",
          text: "Y = 23, 27, 31, 34, 22, 29 (’000). Middle two years 2018 and 2019 → mean 2018.5, and $h/2 = 1/2$, so $x = 2(t - 2018.5) = -5, -3, -1, 1, 3, 5$.\n$\\sum Y = 166$; $\\sum xY = 18$; $\\sum x^2 = 70$.\n$\\hat b = 18/70 = 0.2571$; $\\hat a = 166/6 = 27.6667$ → $\\hat Y = 27.6667 + 0.2571x$.\n**Forecast 2022** ($x = 2(2022 - 2018.5) = 7$): $27.6667 + 0.2571(7) = 29.47$ thousand.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): slide 17",
          text: "Slide 17 writes $\\hat a = 12111/6$. 12111 is the sum of the **years**, not the sales. The sales total is 166, and $166/6 = 27.6667$, which is the value the slide then uses. Also remember x moves in steps of 2 here, so the trend per **year** is $2 \\times 0.2571 = 0.514$ thousand.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Quadratic trend (slide 18)",
          text: "$Y_t = a + bx + cx^2 + e$, with x coded as above. Three normal equations:\n$$\\sum Y = na + b\\sum x + c\\sum x^2$$ $$\\sum xY = a\\sum x + b\\sum x^2 + c\\sum x^3$$ $$\\sum x^2Y = a\\sum x^2 + b\\sum x^3 + c\\sum x^4$$\nWith centred x, $\\sum x = \\sum x^3 = 0$, so b comes straight from the middle equation and a, c from the other two (solve by elimination).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Centre the years so $\\sum x = 0$; then $b = \\sum xY/\\sum x^2$ and $a = \\bar Y$. Forecast by plugging in the future year’s x.",
        },
      ],
    },
    {
      id: "ma",
      heading: "Lesson 3: Smoothing the noise: moving averages",
      slides: "19–23",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How averaging a few neighbouring values removes random wiggles, and how to use the last average as a forecast.",
        },
        {
          type: "p",
          text: "**The idea (slide 19).** Values close in time are usually close in value. Averaging each value with its neighbours cancels much of the random noise and leaves a smooth trend-cycle. Moving averages suit series **without a strong trend** (a horizontal, stationary pattern). As a forecasting rule: *the average of the most recent k values is the forecast for the next period.*",
        },
        {
          type: "callout",
          kind: "formula",
          title: "k-period moving average",
          text: "$$MA_k = \\frac{Y_t + Y_{t-1} + \\dots + Y_{t-k+1}}{k}$$\n**Odd k (3, 5):** place each average at the **middle** period of its window. **Even k (4):** the average falls between two periods, so average each adjacent pair of moving averages to get a **centred moving average** that lines up with a period (slide 22).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 20–21): 3-year moving average",
          text: "Production 1995–2004: 21, 22, 23, 25, 24, 22, 25, 26, 27, 26.\nFirst window: $(21 + 22 + 23)/3 = 22.00$ (centred at 1996). Slide along one year at a time: 23.33, 24.00, 23.67, 23.67, 24.33, 26.00, 26.33 (the last is centred at 2003).\n**Forecast 2005** = the last 3-year average $(26 + 27 + 26)/3 = 26.33$.",
        },
        { type: "diagram", name: "i12-ma" },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): where the averages sit (slide 20)",
          text: "Slide 20’s table writes 22.00 next to **1995**. But 22.00 is the average of 1995–1997, so it belongs to the **middle year, 1996** (centred MA), as slide 23 does correctly. Shift the whole column down one row: 22.00 at 1996 … 26.33 at 2003. If you use the averages as forecasts instead, 22.00 would be the forecast for 1998.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slide 22): 4-year centred moving average",
          text: "Add 2005 = 28. 4-year averages: $(21 + 22 + 23 + 25)/4 = 22.75$ (between 1996 and 1997), then 23.50, 23.50, 24.00, 24.25, 25.00, 26.00, 26.75.\nCentre them: $(22.75 + 23.50)/2 = 23.13$ at **1997**; then 23.50, 23.75, 24.13, 24.63, 25.50, 26.38 at 1998–2003. (The slide’s last line, 26.75 at 2004, would need the next 4-year average from 2006 data, which we don’t have.)",
        },
        {
          type: "p",
          text: "**Window size (slide 23).** With 25 periods of sales, the 5-period average is smoother than the 3-period average. A longer window removes more noise, but it reacts more slowly to real changes and loses more values at the ends (k − 1 values in total).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Add k values, divide by k, slide one step. Odd k → middle period. Even k → centre by averaging pairs. Last MA = next forecast.",
        },
      ],
    },
    {
      id: "es",
      heading: "Lesson 4: Exponential smoothing: a weighted average with a memory",
      slides: "24–26, 28–29",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "A one-line update that blends the newest value with the previous forecast, and what the smoothing constant α controls.",
        },
        {
          type: "p",
          text: "**The idea (slide 24).** A moving average gives the last k values equal weight and ignores everything older. Exponential smoothing uses **all** past values, with weights that **shrink exponentially** the further back you go. In practice you only keep one number (the last forecast) and update it each period.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Simple exponential smoothing (slides 24, 28)",
          text: "$$F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t \\qquad \\text{start: } F_2 = Y_1$$\nRead aloud: “next forecast = alpha times today’s actual + (1 − alpha) times today’s forecast”. $\\alpha$ (alpha) is the **smoothing constant**, $0 \\le \\alpha \\le 1$.\n- $\\alpha = 1$: the forecast is just the last actual value (the **naïve** forecast).\n- $\\alpha = 0$: the forecast never changes.\n- Small α → smooth, slow to react. Large α → follows the latest values closely, more variable (slide 29).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slide 25): production with α = 0.3",
          text: "Data 1995–2004: 21, 22, 23, 25, 24, 22, 25, 26, 27, 26. Start $F_{1996} = Y_{1995} = 21$.\n$F_{1997} = 0.3(22) + 0.7(21) = 21.3$\n$F_{1998} = 0.3(23) + 0.7(21.3) = 21.81$\n$F_{1999} = 0.3(25) + 0.7(21.81) = 22.767$\n… continue: 23.1369, 22.7958, 23.4571, 24.2200, 25.0540.\n**Forecast 2005** $= 0.3(26) + 0.7(25.0540) = 25.338$.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Why “exponential”?",
          text: "Unroll the formula: $F_{t+1} = \\alpha Y_t + \\alpha(1 - \\alpha)Y_{t-1} + \\alpha(1 - \\alpha)^2Y_{t-2} + \\dots$ With α = 0.3 the weights are 0.3, 0.21, 0.147, …: each older value counts 70% as much as the next newer one.",
        },
        {
          type: "p",
          text: "**Advantage over moving averages (slide 34):** exponential smoothing has no long start-up delay; a k-period moving average cannot produce its first value until k observations exist.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "$F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t$, $F_2 = Y_1$. α near 1 = nervous (follows data); α near 0 = calm (smooth).",
        },
      ],
    },
    {
      id: "errors",
      heading: "Lesson 5: How good is a forecast? MSE, MAD, MAPE, LAD",
      slides: "26–27, 30–35",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Four ways to score forecast errors, and how to use them to choose α.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Performance measures (slide 27)",
          text: "Forecast error $\\Delta_t = Y_t - F_t$ (actual minus forecast; Δ is “delta”). Over n forecasts:\n$$MSE = \\frac{\\sum \\Delta_t^2}{n} \\qquad MAD = \\frac{\\sum |\\Delta_t|}{n} \\qquad MAPE = \\frac{100}{n}\\sum \\frac{|\\Delta_t|}{Y_t} \\qquad LAD = \\max |\\Delta_t|$$\nMSE = mean squared error, MAD = mean absolute deviation, MAPE = mean absolute **percent** error, LAD = largest absolute deviation. **Smaller is better** for all four.",
        },
        {
          type: "table",
          caption: "Which measure tells you what? (slide 35)",
          head: ["Measure", "Strength"],
          rows: [
            ["MSE", "Squares the errors, so it punishes large misses (possibly outliers) heavily"],
            ["MAD", "Same units as the data; gives large misses less weight than MSE"],
            ["MAPE", "A percentage, so it compares series of different sizes; a big miss counts less when the value itself is big"],
            ["LAD", "Tells you whether **every** error stays below some threshold"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 26, 30–34): choosing α for capacity utilization",
          text: "15 quarters (Q1/2017–Q3/2020): 82.5, 81.3, 81.3, 79.0, 76.6, 78.0, 78.4, 78.0, 78.8, 78.7, 78.4, 80.0, 80.7, 80.7, 80.8. Smooth with α = 0.2, 0.4 and 0.7 (all start $F_2 = 82.5$).\nFirst error for α = 0.2: $\\Delta = 81.3 - 82.5 = -1.2$, squared 1.44. Next: $F_3 = 0.2(81.3) + 0.8(82.5) = 82.26$, $\\Delta^2 = (81.3 - 82.26)^2 = 0.9216$, and so on for the 14 errors.\n\n| α | MSE | forecast Q4/2020 |\n|---|---|---|\n| 0.2 | 3.848 | 79.943 |\n| 0.4 | 2.395 | 80.396 |\n| 0.7 | **1.579** | 80.739 |\n\n**α = 0.7 has the smallest MSE**, so it is the best choice for this series.",
        },
        { type: "diagram", name: "i12-exp" },
        {
          type: "p",
          text: "**Same series, the other measures for α = 0.7 (Exercise solution prepared for the website):** MAD = 0.905, MAPE = 1.147%, LAD = 3.122 (the big miss at Q1/2018, when utilization dropped to 76.6).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Error = actual − forecast. MSE squares, MAD takes absolute values, MAPE makes it a %, LAD takes the worst. Pick the α (or k) with the smallest error.",
        },
      ],
    },
    {
      id: "holt",
      heading: "Lesson 6: Series with a trend: Holt’s double exponential smoothing",
      slides: "42–57",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "Why simple smoothing lags behind a rising series, and how adding a smoothed trend term fixes it.",
        },
        {
          type: "p",
          text: "**The problem (slide 42).** On a steadily rising series, simple exponential smoothing always **lags**: it averages old (lower) values with new ones, so the forecast is always too low. Holt keeps two running quantities: the **level** $L_t$ (where the series is now) and the **trend** $T_t$ (how much it rises per period), each smoothed with its own constant.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Holt’s equations (slides 43–45, 48)",
          text: "$$L_t = \\alpha Y_t + (1 - \\alpha)(L_{t-1} + T_{t-1}) \\qquad \\text{(level)}$$\n$$T_t = \\beta(L_t - L_{t-1}) + (1 - \\beta)T_{t-1} \\qquad \\text{(trend)}$$\n$$F_{t+1} = L_t + T_t \\qquad F_{t+k} = L_t + kT_t$$\n**Level:** blend today’s actual with where yesterday’s level + trend said we would be. **Trend:** blend the latest step up (new level − old level) with the previous trend. α = level smoothing constant, β (beta) = trend smoothing constant, both between 0 and 1.",
        },
        {
          type: "table",
          caption: "Extreme settings (slides 46–51)",
          head: ["Setting", "Effect"],
          rows: [
            ["α = 0", "$L_t = L_{t-1} + T_{t-1}$: the level ignores new data (smoothed level = current forecast)"],
            ["α = 1", "$L_t = Y_t$: the level is just the actual value"],
            ["β = 0", "$T_t = T_{t-1}$: the trend never updates"],
            ["β = 1", "$T_t = L_t - L_{t-1}$: the trend is the full latest change in level"],
            ["α = 1, β = 0 (from start T = 0)", "Same as the naïve forecast, no trend component"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 53–57): GDP with α = 0.8, β = 0.4",
          text: "Start: $L_{2000} = Y_{2000} = 1451$, $T_{2000} = 0$.\n**2001** ($Y = 1499$): $L = 0.8(1499) + 0.2(1451 + 0) = 1489$; $T = 0.4(1489 - 1451) + 0.6(0) = 15$; forecast for 2002 $= 1489 + 15 = 1504$.\n**2002** ($Y = 1686$): $L = 0.8(1686) + 0.2(1489 + 15) = 1650$; $T = 0.4(1650 - 1489) + 0.6(15) = 73$; forecast 2003 $= 1723$.\n**2003** ($Y = 1764$): $L = 1756$, $T = 86$ → forecast 2004 = 1842.\n… GDP keeps rising to 2689 in 2014, then falls. The trend turns negative:\n**2020** ($Y = 2396$): $L = 0.8(2396) + 0.2(2499 - 24) = 2412$; $T = 0.4(2412 - 2499) + 0.6(-24) = -49$.\n**Forecast 2021** $= 2412 - 49 = 2363$.",
        },
        { type: "diagram", name: "i12-holt" },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): typos in the GDP table (slide 54)",
          text: "- The 2002 trend line is printed as $0.4(1505 - 1489)$; it should be $0.4(1650 - 1489)$, the new level minus the old level. The slide’s answer, 73, is the correct one.\n- The 2017 forecast entry reads “1872 − 28 = 2518”; it should be $2546 - 28 = 2518$.\nThe forecasts themselves (1505, 1723, …, 2363) are correct when you keep whole numbers as the slide does.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Level, then trend, then forecast = level + trend. k steps ahead: $L_t + kT_t$.",
        },
      ],
    },
    {
      id: "hw",
      heading: "Lesson 7: Trend + seasons: Holt-Winters triple exponential smoothing",
      slides: "58–68",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to add a third smoothed quantity, the seasonal factor, so the forecast rises and falls with the seasons.",
        },
        {
          type: "p",
          text: "**The idea.** Demand for houses peaks every summer; demand for heaters peaks every winter. Holt-Winters keeps a **seasonal factor** for each of the M periods in a year (M = 4 for quarters, 12 for months). A factor of 1.13 means “this season runs 13% above the deseasonalised level”. The level is computed from **deseasonalised** data (actual ÷ seasonal factor), and the forecast is put back into season by multiplying.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Getting started (slides 58–59)",
          text: "**Seasonal factors from year 1:** $S_i = \\frac{Y_i}{\\text{Average}(Y_1, \\dots, Y_M)}$ for $i = 1, \\dots, M$.\n**Initial level and trend** at the first period of year 2 (period M + 1):\n$$L_{M+1} = \\frac{Y_{M+1}}{S_1} \\qquad T_{M+1} = \\frac{Y_{M+1}}{S_1} - \\frac{Y_M}{S_M}$$\n(Slide 59 shows the monthly case: $L_{13} = Y_{13}/S_1$, $T_{13} = Y_{13}/S_1 - Y_{12}/S_{12}$.)",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Updating (slide 60)",
          text: "$$L_t = \\alpha\\frac{Y_t}{S_{t-M}} + (1 - \\alpha)(L_{t-1} + T_{t-1})$$\n$$T_t = \\beta(L_t - L_{t-1}) + (1 - \\beta)T_{t-1}$$\n$$S_t = \\gamma\\frac{Y_t}{L_t} + (1 - \\gamma)S_{t-M}$$\n$$F_{t+1} = (L_t + T_t)\\,S_{t+1-M} \\qquad F_{t+k} = (L_t + kT_t)\\,S_{t+k-M}$$\nγ (gamma) is the seasonal smoothing constant. $S_{t-M}$ is the factor for the **same season last year**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): brackets in the forecast (slide 60)",
          text: "Slide 60 prints $F_{t+1} = L_t + T_tS_{t-M+1}$. The spreadsheet on slide 62 actually computes $(L_t + T_t) \\times S_{t+1-M}$ (e.g. period 6: $(400.99 + 20.99) \\times 1.013158 = 427.54$), so read it with brackets.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (slides 61–62): quarterly demand, α = 0.2, β = 0.3, γ = 0.15",
          text: "**Year 1 (2011):** 362, 385, 432, 341; average 380. Seasonal factors: $S_1 = 362/380 = 0.952632$, $S_2 = 1.013158$, $S_3 = 1.136842$, $S_4 = 0.897368$.\n**Start at period 5** ($Y_5 = 382$): $L_5 = 382/0.952632 = 400.99$; $T_5 = 400.99 - 341/0.897368 = 400.99 - 380 = 20.99$; $S_5 = 0.15(382/400.99) + 0.85(0.952632) = 0.952632$.\n**Forecast period 6:** $(400.99 + 20.99) \\times S_2 = 421.99 \\times 1.013158 = 427.54$. Actual 409, error 18.54.\n**Period 6 update** ($Y_6 = 409$): $L_6 = 0.2(409/1.013158) + 0.8(421.99) = 418.33$; $T_6 = 0.3(418.33 - 400.99) + 0.7(20.99) = 19.90$.\n… after period 24: $L_{24} = 754.5588$, $T_{24} = 14.998$, and last year’s factors $S_{21}$–$S_{24}$ = 0.951154, 1.014493, 1.135416, 0.882156.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): the forecasts for periods 25–28 (slide 62)",
          text: "Using $F_{24+k} = (L_{24} + kT_{24})\\,S_{20+k}$:\n- k = 1 (Q1): $(754.56 + 15.00) \\times 0.951154 = 731.97$\n- k = 2 (Q2): $784.55 \\times 1.014493 = 795.93$\n- k = 3 (Q3): $799.55 \\times 1.135416 = 907.82$\n- k = 4 (Q4): $814.55 \\times 0.882156 = 718.56$\n\nThe slide shows 871.37, 692.95, 760.50, 826.36. Those come from multiplying by $S_{19}$–$S_{22}$ (the Q3, Q4, Q1, Q2 factors), two periods out of step: Q1 is forecast with the summer (Q3) factor. Use the corrected values; Q3 should be the peak, as in every past year.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Second example (slides 63–68): monthly house sales, M = 12, α = β = γ = 0.1",
          text: "2015 average $= 217571.75$; $S_1 = 131646/217571.75 = 0.605069$ (January is slow), …, $S_6 = 1.276232$ (June is busy), $S_{12} = 0.967897$.\n$L_{13} = 154183/0.605069 = 254819$; $T_{13} = 254819 - 210587/0.967897 = 254819 - 217572 = 37247$.\nForecast Feb 2016 $= (254819 + 37247) \\times S_2 = 292066 \\times 0.81324 = 237519$; actual 168895, error −68624.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Lesson from the house example (website observation)",
          text: "The starting trend, 37,247 extra houses **per month**, comes from a single month-to-month jump. With β = 0.1 it shrinks only slowly (36403, 35355, …), so the 2016–2017 forecasts sit far above the actual sales (errors of −100,000 to −250,000). The errors only become small in 2019. Poor starting values plus small smoothing constants mean a long “warm-up”.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Quick revision",
          text: "Three equations: level (deseasonalised), trend, season. Forecast = (level + k × trend) × same-season factor from last year.",
        },
      ],
    },
    {
      id: "stationary",
      heading: "Lesson 8: Stationary processes",
      slides: "69–70",
      blocks: [
        {
          type: "p",
          text: "A time series can be viewed as one realisation of a **stochastic (random) process**. A process is **strictly stationary** if its statistical properties are unaffected by a **change of origin**: shifting the whole series in time doesn’t change its behaviour (slide 69). It is “in equilibrium”: no trend, no seasonal pattern.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Moments of a process (slide 70)",
          text: "Mean function $E(Y_t) = \\mu_t$; variance function $V(Y_t) = \\sigma_t^2$; and $E(Y_tY_s)$, which links two different times. Usually the first two moments are used. For a stationary process the mean and variance do not change with t.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Why it matters",
          text: "Moving averages and simple exponential smoothing are designed for series that wander around a constant level (slide 19), i.e. roughly stationary ones. A series with a trend or seasons is not stationary; use trend models, Holt or Holt-Winters.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Lec12–13 on one screen",
      head: ["Tool", "Key formula / rule"],
      rows: [
        ["Components", "Trend, Seasonal, Cyclical, Irregular; $y = T + C + S + I$ or $T \\times C \\times S \\times I$"],
        ["Linear trend", "code x so $\\sum x = 0$; $b = \\sum xY/\\sum x^2$, $a = \\sum Y/n$"],
        ["Quadratic trend", "3 normal equations in a, b, c"],
        ["Moving average", "average of k values; odd k → middle; even k → centre; last MA = next forecast"],
        ["Exponential smoothing", "$F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t$, $F_2 = Y_1$"],
        ["Errors", "$\\Delta = Y - F$; MSE $\\sum\\Delta^2/n$; MAD $\\sum|\\Delta|/n$; MAPE $\\frac{100}{n}\\sum|\\Delta|/Y$; LAD $\\max|\\Delta|$"],
        ["Holt", "$L_t = \\alpha Y_t + (1 - \\alpha)(L_{t-1} + T_{t-1})$; $T_t = \\beta(L_t - L_{t-1}) + (1 - \\beta)T_{t-1}$; $F_{t+k} = L_t + kT_t$"],
        ["Holt-Winters", "$L_t = \\alpha Y_t/S_{t-M} + \\dots$; $S_t = \\gamma Y_t/L_t + (1 - \\gamma)S_{t-M}$; $F_{t+k} = (L_t + kT_t)S_{t+k-M}$"],
        ["Stationary", "properties unchanged by a shift in time; constant mean and variance"],
      ],
    },
    { type: "diagram", name: "i12-comp" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Show the coded-x table for trends · place moving averages at the middle period · state $F_2 = Y_1$ when starting exponential smoothing · error = actual − forecast · lowest MSE wins · Holt-Winters forecasts use the factor of the **same season**.",
    },
  ],

  glossary: [
    ["Time series", "", "Observations of a variable recorded sequentially in time, $Y_1, \\dots, Y_n$"],
    ["Trend $T_t$", "Secular variation", "Long-term upward or downward movement"],
    ["Seasonal $S_t$", "", "Pattern repeating over a fixed known period within a year"],
    ["Cyclical $C_t$", "", "Repeated but non-periodic fluctuations, usually 2+ years"],
    ["Irregular $I_t$", "Random variation", "Unpredictable, pattern-free variation"],
    ["Additive / multiplicative model", "", "$y = T + C + S + I$ / $y = T \\times C \\times S \\times I$"],
    ["Delphi method", "", "Qualitative forecasting by repeated rounds of expert opinion"],
    ["Moving average (MA)", "", "Average of k consecutive values, slid along the series"],
    ["Centred moving average", "", "Average of two adjacent even-period MAs, aligned with a period"],
    ["Exponential smoothing", "", "$F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t$; exponentially decreasing weights on the past"],
    ["α, β, γ", "Alpha, beta, gamma", "Smoothing constants for level, trend and season (0 to 1)"],
    ["Naïve forecast", "", "Next forecast = last actual value (α = 1)"],
    ["MSE", "Mean squared error", "$\\sum\\Delta_t^2/n$"],
    ["MAD", "Mean absolute deviation", "$\\sum|\\Delta_t|/n$"],
    ["MAPE", "Mean absolute percent error", "$\\frac{100}{n}\\sum|\\Delta_t|/Y_t$"],
    ["LAD", "Largest absolute deviation", "$\\max|\\Delta_t|$"],
    ["Holt’s method", "Double exponential smoothing", "Smooths a level and a trend"],
    ["Holt-Winters", "Triple exponential smoothing", "Smooths level, trend and seasonal factors"],
    ["Seasonal factor", "Seasonal index", "Ratio of a season’s value to the average level"],
    ["Stationary process", "", "Statistical properties unaffected by a change of time origin"],
  ],

  examTips: [
    "For trend questions, always write the table Year | Y | x | x² | xY with totals, and say how you coded x.",
    "Moving averages: state the window, show the first sum, then list the rest; put each average at the middle year.",
    "Exponential smoothing: write the start value ($F_2 = Y_1$) explicitly, keep 3–4 decimals, and show the first two updates in full.",
    "When comparing methods or α values, compute the same error measure over the same periods, then say which is smallest and why it is better.",
    "Holt / Holt-Winters: order of work in every period is level → trend → (season) → forecast.",
  ],

  problems: [
    {
      title: "Linear trend, odd n (slide 16)",
      level: "From slides",
      question: "Crop production (tons) 2016–2020: 35, 55, 79, 80, 40. Fit $Y_t = a + bx$ with coded time and forecast 2021.",
      solution: "### Approach\nOdd n → $x = t - 2018$ (middle year), so $\\sum x = 0$, $b = \\sum xY/\\sum x^2$, $a = \\bar Y$.\n### Table\nx = −2, −1, 0, 1, 2; xY = −70, −55, 0, 80, 80 → $\\sum xY = 35$; $\\sum x^2 = 10$; $\\sum Y = 289$.\n### Working\n$b = 35/10 = 3.5$; $a = 289/5 = 57.8$ → $\\hat Y = 57.8 + 3.5x$.\n2021: x = 3 → $57.8 + 10.5 =$ **68.3 tons**.",
    },
    {
      title: "Linear trend, even n (slide 17)",
      level: "From slides",
      question: "Mall sales (’000) 2016–2021: 23, 27, 31, 34, 22, 29. Fit a linear trend and forecast 2022.",
      solution: "### Approach\nEven n → $x = (t - 2018.5)/(1/2) = 2(t - 2018.5)$: −5, −3, −1, 1, 3, 5.\n### Working\n$\\sum Y = 166$; $\\sum xY = -115 - 81 - 31 + 34 + 66 + 145 = 18$; $\\sum x^2 = 70$.\n$b = 18/70 = 0.2571$; $a = 166/6 = 27.6667$.\n2022: x = 7 → $27.6667 + 0.2571 \\times 7 =$ **29.47 thousand**.\n⚠️ The slide writes a = 12111/6 (12111 is the sum of the years); the correct numerator is 166.",
    },
    {
      title: "Quadratic trend for the crop data",
      level: "Level 3",
      question: "Fit $Y = a + bx + cx^2$ to the crop data (x = −2 … 2, Y = 35, 55, 79, 80, 40). Compare its SSE with the linear trend’s and comment on the 2021 forecast.",
      solution: "### Sums\n$\\sum x = \\sum x^3 = 0$, $\\sum x^2 = 10$, $\\sum x^4 = 34$, $\\sum Y = 289$, $\\sum xY = 35$, $\\sum x^2Y = 4(35) + 55 + 80 + 4(40) = 435$.\n### Normal equations (slide 18)\n$289 = 5a + 10c$; $35 = 10b$; $435 = 10a + 34c$.\n$b = 3.5$. From the first, $a = 57.8 - 2c$; substitute: $435 = 578 - 20c + 34c$ → $c = -10.214$, $a = 78.229$.\n### Fit\n$\\hat Y = 78.229 + 3.5x - 10.214x^2$. SSE: linear 1664.3, quadratic **203.7**: the hump-shaped data are fitted far better.\n### Caution\n2021 (x = 3): $78.229 + 10.5 - 91.93 = -3.2$ tons, impossible. A curve that fits the past well can extrapolate absurdly. (Exercise solution prepared for the website.)",
    },
    {
      title: "3-year moving average and forecast (slides 20–21)",
      level: "From slides",
      question: "Production 1995–2004: 21, 22, 23, 25, 24, 22, 25, 26, 27, 26. Compute the 3-year moving averages and forecast 2005.",
      solution: "### Working\n(21 + 22 + 23)/3 = 22.00 (1996); (22 + 23 + 25)/3 = 23.33 (1997); 24.00 (1998); 23.67 (1999); 23.67 (2000); 24.33 (2001); 26.00 (2002); (26 + 27 + 26)/3 = 26.33 (2003).\n### Forecast\nLast 3-year average → **2005: 26.33**.\n⚠️ Slide 20 lists 22.00 against 1995; a centred average belongs to the middle year (1996).",
    },
    {
      title: "4-year centred moving average (slide 22)",
      level: "From slides",
      question: "Production 1995–2005: 21, 22, 23, 25, 24, 22, 25, 26, 27, 26, 28. Compute the 4-year centred moving averages.",
      solution: "### 4-year averages\n22.75, 23.50, 23.50, 24.00, 24.25, 25.00, 26.00, 26.75 (each between two years).\n### Centre them (average adjacent pairs)\n1997: 23.125; 1998: 23.50; 1999: 23.75; 2000: 24.125; 2001: 24.625; 2002: 25.50; 2003: 26.375.\n(Slide rounds to 23.13, 23.50, 23.75, 24.13, 24.63, 25.50, 26.38.)",
    },
    {
      title: "Simple exponential smoothing (slide 25)",
      level: "From slides",
      question: "Using α = 0.3 on the production series 1995–2004 (21, 22, 23, 25, 24, 22, 25, 26, 27, 26), find the forecasts and the forecast for 2005.",
      solution: "### Formula\n$F_{t+1} = 0.3Y_t + 0.7F_t$, $F_{1996} = 21$.\n### Working\n1997: 0.3(22) + 0.7(21) = 21.3; 1998: 21.81; 1999: 22.767; 2000: 23.1369; 2001: 22.7958; 2002: 23.4571; 2003: 24.2200; 2004: 25.0540.\n### Answer\n2005: $0.3(26) + 0.7(25.0540) =$ **25.338**.",
    },
    {
      title: "Choosing α by MSE (slides 26, 30–34)",
      level: "From slides",
      question: "Capacity utilization for 15 quarters is smoothed with α = 0.2, 0.4 and 0.7. The squared errors sum to 53.869, 33.534 and 22.105 respectively over 14 forecasts. Find each MSE, choose α, and give the Q4/2020 forecast for the best α (last actual 80.8, last forecast 80.5959).",
      solution: "### MSE = Σ Δ² / n\nα = 0.2: 53.869/14 = **3.848**; α = 0.4: 33.534/14 = **2.395**; α = 0.7: 22.105/14 = **1.579**.\n### Choice\nα = 0.7 (smallest MSE): this series changes direction, so a responsive forecast does best.\n### Forecast\n$0.7(80.8) + 0.3(80.5959) =$ **80.739**.",
    },
    {
      title: "All four error measures (slides 27, 33)",
      level: "Level 2",
      question: "For α = 0.7 on the utilization series, the 14 absolute errors |Y − F| sum to 12.670, the percentage errors |Δ|/Y sum to 0.16058, and the largest absolute error is 3.122. Find MAD, MAPE and LAD, and say what LAD tells you.",
      solution: "### Working\nMAD = 12.670/14 = **0.905**; MAPE = 100 × 0.16058/14 = **1.147%**; LAD = **3.122**.\n### Meaning\nOn average the forecast misses by under 1 percentage point (about 1.1% of the value); the worst single miss is 3.12 points (Q1/2018). (Exercise solution prepared for the website.)",
    },
    {
      title: "Practice: 2-, 3-, 4-quarter MAs on utilization (slides 36–37)",
      level: "Level 2",
      question: "Using the 15-quarter utilization series, find the 2-, 3- and 4-quarter moving averages, use each as a forecast for the next quarter, compute MSE and MAD, and comment.",
      solution: "### Moving averages (first and last values)\n2-quarter: 81.90, 81.30, 80.15, … , 80.70, 80.75. 3-quarter: 81.70, 80.53, … , 80.47, 80.73. 4-quarter: 81.03, 79.55, … , 79.95, 80.55.\n### Forecast errors (forecast = average of the previous k quarters)\n| k | MSE | MAD | next forecast |\n|---|---|---|---|\n| 2 | **1.892** | **0.969** | 80.75 |\n| 3 | 2.533 | 1.158 | 80.73 |\n| 4 | 2.813 | 1.198 | 80.55 |\n### Comment\nThe shortest window wins: the series turns down then up, and short windows react faster. Exponential smoothing with α = 0.7 (MSE 1.579, slide 34) beats all three. (Exercise solution prepared for the website.)",
    },
    {
      title: "Practice: census population (slide 41)",
      level: "Level 2",
      question: "India’s census population (millions) 1901–2011: 236, 258, 251, 272, 319, 361, 439, 548, 685, 843, 1027, 1211. Forecast 2021 with 3- and 4-period moving averages and compare their MSE, MAD, MAPE and LAD.",
      solution: "### Forecasts\n3-period: (843 + 1027 + 1211)/3 = **1027**. 4-period: (685 + 843 + 1027 + 1211)/4 = **941.5**.\n### Errors (forecast = average of previous k censuses)\n| k | MSE | MAD | MAPE | LAD |\n|---|---|---|---|---|\n| 3 | 48263.6 | 186.1 | 26.6% | 359.3 |\n| 4 | 75357.9 | 240.7 | 33.2% | 435.3 |\n### Comment\n3-period is better on every measure, but both are poor: the population rises steadily, so moving averages always lag behind (the 2021 forecasts are below the 2011 value!). A trend model or Holt’s method suits this series. (Exercise solution prepared for the website.)",
    },
    {
      title: "Practice: tourist arrivals (slides 38–39)",
      level: "Level 2",
      question: "International tourist arrivals in India (millions), 2001–2018: 2.54, 2.38, 2.73, 3.46, 3.92, 4.45, 5.08, 5.28, 5.17, 5.78, 6.31, 6.58, 6.97, 13.11, 13.77, 15.02, 16.81, 17.82. Find the 2-, 3- and 4-year moving-average forecasts for 2019 and the MSE of each.",
      solution: "### Forecasts for 2019\n2-year: (16.81 + 17.82)/2 = **17.315**; 3-year: **16.55**; 4-year: **15.855**.\n### MSE (one-step-ahead forecasts)\n2-year **4.424**; 3-year 6.827; 4-year 10.037. MAD: 1.412, 1.925, 2.432.\n### Comment\nShorter windows win because the series trends upward (and jumps in 2014). (Exercise solution prepared for the website.)",
    },
    {
      title: "Holt’s method, first steps (slides 53–57)",
      level: "From slides",
      question: "GDP: 2000 = 1451, 2001 = 1499, 2002 = 1686. With α = 0.8, β = 0.4, $L_{2000} = 1451$, $T_{2000} = 0$, find $L$ and $T$ for 2001 and 2002 and the forecast for 2003.",
      solution: "### 2001\n$L = 0.8(1499) + 0.2(1451 + 0) = 1489.4 \\approx 1489$; $T = 0.4(1489 - 1451) + 0.6(0) = 15.2 \\approx 15$.\n### 2002\n$L = 0.8(1686) + 0.2(1489 + 15) = 1649.6 \\approx 1650$; $T = 0.4(1650 - 1489) + 0.6(15) = 73.4 \\approx 73$.\n### Forecast 2003\n$F = L + T = 1650 + 73 =$ **1723**.",
    },
    {
      title: "Holt’s method, forecasting ahead",
      level: "Level 1",
      question: "At 2020 the GDP model has $L = 2412$, $T = -49$. Forecast 2021 and 2022.",
      solution: "### Formula\n$F_{t+k} = L_t + kT_t$.\n### Answer\n2021: 2412 − 49 = **2363**; 2022: 2412 − 2(49) = **2314**. (2022: Exercise solution prepared for the website.)",
    },
    {
      title: "Holt-Winters start-up (slides 61–62)",
      level: "From slides",
      question: "Quarterly demand, 2011: 362, 385, 432, 341; first quarter of 2012: 382. Find the four initial seasonal factors, $L_5$, $T_5$, and the forecast for period 6 (β, γ not needed yet).",
      solution: "### Seasonal factors\nAverage = 1520/4 = 380. $S_1 = 0.952632$, $S_2 = 1.013158$, $S_3 = 1.136842$, $S_4 = 0.897368$.\n### Level and trend\n$L_5 = 382/0.952632 = 400.99$; $T_5 = 400.99 - 341/0.897368 = 400.99 - 380 = 20.99$.\n### Forecast\n$F_6 = (L_5 + T_5)S_2 = 421.99 \\times 1.013158 =$ **427.54**.",
    },
    {
      title: "Holt-Winters forecasts for the next year (slide 62)",
      level: "Level 3",
      question: "After period 24: $L_{24} = 754.5588$, $T_{24} = 14.998$; $S_{21}$–$S_{24}$ = 0.951154, 1.014493, 1.135416, 0.882156 (Q1–Q4 of 2016). Forecast periods 25–28 (Q1–Q4 of 2017).",
      solution: "### Formula\n$F_{24+k} = (L_{24} + kT_{24})S_{20+k}$: each quarter uses its own factor from last year.\n### Working\nk = 1: 769.557 × 0.951154 = **731.97**\nk = 2: 784.555 × 1.014493 = **795.93**\nk = 3: 799.553 × 1.135416 = **907.82**\nk = 4: 814.551 × 0.882156 = **718.56**\n⚠️ The slide’s 871.37, 692.95, 760.50, 826.36 multiply by $S_{19}$–$S_{22}$, which belong to other quarters.",
    },
    {
      title: "Holt-Winters initialisation, monthly (slides 65–66)",
      level: "From slides",
      question: "House sales 2015 average 217571.75; Jan 2015 = 131646, Dec 2015 = 210587, Jan 2016 = 154183, Feb 2016 = 168895; $S_2 = 0.81324$. Find $S_1$, $S_{12}$, $L_{13}$, $T_{13}$ and the forecast for February 2016.",
      solution: "### Factors\n$S_1 = 131646/217571.75 = 0.605069$; $S_{12} = 210587/217571.75 = 0.967897$.\n### Level and trend\n$L_{13} = 154183/0.605069 = 254819$; $T_{13} = 254819 - 210587/0.967897 = 254819 - 217572 = 37247$.\n### Forecast\n$F_{14} = (254819 + 37247) \\times 0.81324 =$ **237519**; actual 168895 → error **−68624**.",
    },
  ],

  theory: [
    {
      title: "Components of a time series",
      level: "Level 1",
      question: "Describe the four components of a time series with an example of each, and explain when an additive or a multiplicative model is appropriate.",
      solution: "Trend: long-term persistent rise or fall over several years, e.g. population growth (slide 8). Seasonal: regular up-and-down pattern within a year with a fixed, known period, e.g. summer sales peaks (slide 9). Cyclical: repeated but non-periodic waves of 2+ years, e.g. business cycles (slide 10). Irregular: unpredictable random variation, e.g. natural disasters, sudden policy changes (slide 11). Additive $y = T + C + S + I$ when variation around the trend does not change with the level; multiplicative $y = T \\times C \\times S \\times I$ when it grows in proportion to the level (slide 12).",
    },
    {
      title: "Moving average vs exponential smoothing",
      level: "Level 2",
      question: "Compare moving averages and simple exponential smoothing. What does the smoothing constant α control?",
      solution: "A k-period moving average weights the last k values equally and ignores older data; it needs k values before the first average and loses values at the ends (slides 19, 34). Exponential smoothing $F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t$ uses all past data with exponentially decreasing weights, needs only the previous forecast, and has no long start-up delay. α controls responsiveness: small α → smooth, slow to react; large α → follows recent values, more variable; α = 1 is the naïve forecast (slides 24, 29). Both suit series without a strong trend; both lag behind a trending series (slide 42).",
    },
    {
      title: "Choosing a forecast error measure",
      level: "Level 2",
      question: "Define MSE, MAD, MAPE and LAD and state when each is preferred.",
      solution: "With error $\\Delta_t = Y_t - F_t$: MSE $= \\sum\\Delta_t^2/n$ gives large errors (possibly outliers) heavy weight; MAD $= \\sum|\\Delta_t|/n$ is in the data’s units and gives large errors less weight; MAPE $= \\frac{100}{n}\\sum|\\Delta_t|/Y_t$ is a percentage, useful for comparing series of different sizes, and gives less weight to a large error when the value is large; LAD $= \\max|\\Delta_t|$ checks whether all errors fall below a threshold (slides 27, 35). The course focuses on MSE and MAD. Choose the method or constant with the smallest error.",
    },
    {
      title: "Why Holt, why Holt-Winters?",
      level: "Level 3",
      question: "Explain why simple exponential smoothing fails on trending or seasonal data and how Holt’s and Holt-Winters’ methods fix it. Write their equations.",
      solution: "Simple smoothing averages past levels, so on a rising series the forecast always lags (slide 42). **Holt** adds a smoothed trend: $L_t = \\alpha Y_t + (1 - \\alpha)(L_{t-1} + T_{t-1})$, $T_t = \\beta(L_t - L_{t-1}) + (1 - \\beta)T_{t-1}$, $F_{t+k} = L_t + kT_t$ (slide 44). **Holt-Winters** also handles seasons with M seasonal factors: the level uses deseasonalised data $Y_t/S_{t-M}$, the factors update by $S_t = \\gamma Y_t/L_t + (1 - \\gamma)S_{t-M}$, and the forecast is $(L_t + kT_t)S_{t+k-M}$ (slide 60). Initial factors are $Y_i/\\text{average of the first year}$; $L_{M+1} = Y_{M+1}/S_1$, $T_{M+1} = Y_{M+1}/S_1 - Y_M/S_M$ (slides 58–59).",
    },
    {
      title: "Forecasting methods map",
      level: "Level 1",
      question: "Classify forecasting methods, and explain how to decide between smoothing methods and trend models for a time series.",
      solution: "Qualitative methods: personal judgment, panel consensus, Delphi method, market research. Quantitative methods: causal (regression) and time series (slide 13). For a time series, check for a trend: none → smoothing methods (moving average, exponential smoothing); trend present → trend models (linear, quadratic, exponential, auto-regressive) (slide 14), or Holt / Holt-Winters smoothing (slides 42, 58).",
    },
    {
      title: "Stationarity",
      level: "Level 2",
      question: "What is a strictly stationary stochastic process, and which moments describe a process?",
      solution: "A stochastic process is strictly stationary if its properties are unaffected by a change of time origin: the process is in a state of equilibrium (slide 69). It is described by its moments: the mean function $E(Y_t) = \\mu_t$, the variance function $V(Y_t) = \\sigma_t^2$, and cross-moments such as $E(Y_tY_s)$; usually the first two are used (slide 70). For a stationary series these don’t depend on t, so it has no trend or seasonality, which is the setting smoothing methods assume.",
    },
  ],

  quiz: [
    {
      topic: "Components",
      q: "Ice-cream sales peak every summer. This is…",
      options: ["trend", "seasonal variation", "cyclical variation", "irregular variation"],
      answer: 1,
      why: "A fixed, known period within a year (slide 9).",
      wrong: ["Trend is a long-run direction.", null, "Cycles are longer and irregular in length.", "It is predictable, not random."],
    },
    {
      topic: "Components",
      q: "A sudden collapse of a major company affects a sales series. This is…",
      options: ["trend", "seasonal", "cyclical", "irregular"],
      answer: 3,
      why: "Unpredictable, random events (slide 11).",
      wrong: ["No persistent direction.", "Not calendar-based.", "Not a recurring wave.", null],
    },
    {
      topic: "Components",
      q: "When the seasonal swings grow as the series level grows, use…",
      options: ["an additive model", "a multiplicative model", "a moving average only", "no model"],
      answer: 1,
      why: "Multiplicative: variation proportional to the level (slide 12).",
      wrong: ["Additive assumes constant-size swings.", null, "A moving average doesn’t model seasonality.", "No."],
    },
    {
      topic: "Trend",
      type: "num",
      q: "Crop data: $\\sum xY = 35$, $\\sum x^2 = 10$, $\\sum Y = 289$, n = 5. Forecast for x = 3?",
      answer: 68.3,
      tol: 0.05,
      why: "$b = 3.5$, $a = 57.8$; $57.8 + 10.5$.",
    },
    {
      topic: "Trend",
      q: "For 6 years 2016–2021, the coded values x are…",
      options: ["−3, −2, −1, 1, 2, 3", "−5, −3, −1, 1, 3, 5", "0, 1, 2, 3, 4, 5", "−2.5 … 2.5 in steps of 1, then rounded"],
      answer: 1,
      why: "$x = 2(t - 2018.5)$ (slide 17).",
      wrong: ["Not equally spaced (skips 0).", null, "Not centred, so $\\sum x \\ne 0$.", "Rounding breaks the spacing."],
    },
    {
      topic: "Moving average",
      type: "num",
      q: "3-year moving average of 25, 24, 22? (2 decimals)",
      answer: 23.67,
      tol: 0.01,
      why: "71/3.",
    },
    {
      topic: "Moving average",
      type: "num",
      q: "4-year MAs are 22.75 and 23.50. The centred MA? (3 decimals)",
      answer: 23.125,
      tol: 0.001,
      why: "Average of the two adjacent 4-year MAs (slide 22).",
    },
    {
      topic: "Moving average",
      q: "A longer moving-average window gives…",
      options: ["a more variable line", "a smoother line that reacts more slowly", "exactly the same line", "forecasts with no lag"],
      answer: 1,
      why: "More values averaged → more noise removed, but slower response.",
      wrong: ["Opposite.", null, "No.", "Longer windows lag more."],
    },
    {
      topic: "Exponential smoothing",
      type: "num",
      q: "$F_t = 21$, $Y_t = 22$, α = 0.3. $F_{t+1}$?",
      answer: 21.3,
      tol: 0.001,
      why: "$0.3(22) + 0.7(21)$.",
    },
    {
      topic: "Exponential smoothing",
      q: "With α = 1, simple exponential smoothing gives…",
      options: ["the overall mean", "the naïve forecast (last actual value)", "a constant forecast", "the moving average"],
      answer: 1,
      why: "$F_{t+1} = Y_t$ (slide 24).",
      wrong: ["No.", null, "That's α = 0.", "No."],
    },
    {
      topic: "Errors",
      type: "num",
      q: "Errors: 2, −1, −3, 2. MSE?",
      answer: 4.5,
      tol: 0.001,
      why: "(4 + 1 + 9 + 4)/4 = 18/4.",
    },
    {
      topic: "Errors",
      type: "num",
      q: "Errors: 2, −1, −3, 2. MAD?",
      answer: 2,
      tol: 0.001,
      why: "(2 + 1 + 3 + 2)/4.",
    },
    {
      topic: "Errors",
      q: "Which measure punishes large errors most?",
      options: ["MAD", "MSE", "MAPE", "the mean error"],
      answer: 1,
      why: "Squaring makes large errors dominate (slide 35).",
      wrong: ["MAD gives them less weight.", null, "Percent-based, not squared.", "Positive and negative errors cancel."],
    },
    {
      topic: "Holt",
      type: "num",
      q: "Holt: $L_{t-1} = 1451$, $T_{t-1} = 0$, $Y_t = 1499$, α = 0.8. $L_t$? (1 decimal)",
      answer: 1489.4,
      tol: 0.05,
      why: "$0.8(1499) + 0.2(1451)$.",
    },
    {
      topic: "Holt",
      type: "num",
      q: "Holt: $L_t = 2412$, $T_t = -49$. Forecast 3 periods ahead?",
      answer: 2265,
      tol: 0.5,
      why: "$L_t + 3T_t = 2412 - 147$.",
    },
    {
      topic: "Holt-Winters",
      type: "num",
      q: "First-year quarterly demand 362, 385, 432, 341. Initial seasonal factor for Q3? (4 decimals)",
      answer: 1.1368,
      tol: 0.0002,
      why: "432/380.",
    },
    {
      topic: "Holt-Winters",
      q: "In Holt-Winters, the forecast for next quarter multiplies (level + trend) by…",
      options: ["the latest seasonal factor, whatever quarter it is", "the seasonal factor of the same quarter last year", "the average of all factors", "γ"],
      answer: 1,
      why: "$F_{t+1} = (L_t + T_t)S_{t+1-M}$ (slide 60).",
      wrong: ["That mixes up seasons (the mistake in slide 62's last rows).", null, "Averaging removes the seasonality.", "γ is a smoothing constant."],
    },
    {
      topic: "Stationarity",
      q: "A strictly stationary process is one whose properties…",
      options: ["increase over time", "are unaffected by a change of time origin", "repeat every year", "are always zero"],
      answer: 1,
      why: "Slide 69.",
      wrong: ["That's a trend.", null, "That's seasonality.", "No."],
    },
  ],
};
