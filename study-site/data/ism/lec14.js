// ISM — Session 14: Stochastic processes, stationarity, autocorrelation (ACF/PACF), white noise, Ljung-Box,
// AR / MA / ARMA / ARIMA models, the Dickey-Fuller test, choosing p, d, q, and SARIMA / SARIMAX / VAR.
// Source: CourseFiles/ISM/S1-26_DSEZC418_ISM.pdf (consolidated open-book PDF), pages 736–821.
// All "page N" references are page numbers of that consolidated PDF. Every number was re-computed in Python.
// Numbers marked "Exercise solution prepared for the website" were made for practice from the PDF's own data.

export default {
  title: "Stationarity, Autocorrelation & ARIMA Models",
  source: "Consolidated PDF (S1-26_DSEZC418_ISM.pdf) · pages 736–821 · Session 14",
  quizMode: "step",
  overview:
    "Lectures 12–13 forecast with trend lines and smoothing. Session 14 goes one level deeper: it treats a time series as one **realisation of a stochastic (random) process** (pages 737–743), asks whether that process is **stationary** (its behaviour doesn't drift with time, pages 744–758), and measures how strongly today depends on the past with the **autocorrelation function (ACF)** and the **partial autocorrelation function (PACF)** (pages 759–790). A series with no autocorrelation is **white noise**, checked with the **±2/√T** rule and the **Ljung-Box test** (pages 777–784). It then builds the classic models: **AR(p)** (today depends on past values), **MA(q)** (today depends on past shocks), **ARMA(p, q)** (both), and **ARIMA(p, d, q)** (difference first to remove trend), with the **Dickey-Fuller test** for stationarity and **AIC/BIC** to pick p, d, q (pages 791–817). It ends with **SARIMA, SARIMAX, VAR and VARMAX** (pages 818–820). **Page numbers on this page refer to your consolidated exam PDF.**",

  simpleIntro: "Lecture 12–13 forecast a series with trend lines and smoothing. Session 14 asks two deeper questions. **Is the series stable over time (stationary)?** And **how much does today depend on yesterday (autocorrelation)?** The answers lead to the classic forecasting models: **AR** (today depends on past values), **MA** (today depends on past surprises), **ARMA** (both), and **ARIMA** (ARMA after removing trend by differencing). Page numbers are from your consolidated exam PDF.",

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
              "title": "Is it stable?",
              "text": "A **stationary** series has the same average, the same wobble and the same neighbour-link at every point in time.",
              "tag": "Check first",
              "example": "Trend or seasons ⇒ not stationary",
              "figure": "i14-stat"
            },
            {
              "title": "Does it remember?",
              "text": "**Autocorrelation** $r_k$ = how strongly the series is linked to itself k steps back.",
              "tag": "Measure",
              "example": "15-value series: $r_1 = 0.83$",
              "figure": "i14-acf"
            },
            {
              "title": "Model the memory",
              "text": "**AR** remembers past values, **MA** remembers past shocks, **ARIMA** first removes trend by differencing.",
              "tag": "Forecast",
              "example": "ACF → q, PACF → p",
              "figure": "i14-pattern"
            }
          ]
        }
      ]
    },
    {
      "id": "s-process",
      "heading": "2. A time series is one printout of a random machine",
      "slides": "737–743",
      "blocks": [
        {
          "type": "p",
          "text": "Think of a **machine** that prints a whole wiggly line each time you run it. The machine is the **stochastic process** $\\{Y_t\\}$. The one line you actually observed is a **realisation**: your time series. We study the line to learn about the machine."
        },
        {
          "type": "table",
          "head": [
            "Time points are…",
            "Process type",
            "Example"
          ],
          "rows": [
            [
              "a continuous range, $[0, \\infty)$",
              "Continuous-time",
              "A temperature sensor"
            ],
            [
              "whole numbers 0, 1, 2, …",
              "Discrete-time",
              "Monthly sales"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Quarterly GDP figures form a…",
          "options": [
            "continuous-time process",
            "discrete-time process",
            "white-noise process",
            "stationary process, always"
          ],
          "answer": 1,
          "why": "Quarters are whole-number time points (page 739)."
        }
      ]
    },
    {
      "id": "s-stationary",
      "heading": "3. Stationary: the series looks the same at any time",
      "slides": "744–758",
      "blocks": [
        {
          "type": "p",
          "text": "**Test in your head:** cut a window out of the series. If you couldn't tell *when* it was taken, the series is stationary. A trend gives the date away (later = higher); seasons give the month away."
        },
        {
          "type": "diagram",
          "name": "i14-stat"
        },
        {
          "type": "table",
          "head": [
            "",
            "Strict",
            "Weak (second order)"
          ],
          "rows": [
            [
              "Needs",
              "The whole distribution unchanged by a time shift",
              "Only mean and variance constant; covariance depends only on the gap"
            ],
            [
              "Used in practice?",
              "Rarely: too strong to check",
              "Yes"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**Stationary = same mean, same spread, same neighbour-link at all times.** Trend and seasonality are the two usual reasons a series is not stationary, so remove them first (page 758)."
        }
      ]
    },
    {
      "id": "s-acf",
      "heading": "4. Autocorrelation: how much the series remembers",
      "slides": "759–776",
      "blocks": [
        {
          "type": "p",
          "text": "Slide the series back one step and line it up with itself. If big values sit next to big values, the lag-1 autocorrelation $r_1$ is large. Do it for 2 steps, 3 steps, … and draw the bars: that is the **ACF** (correlogram)."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Sample autocorrelation (page 766)",
          "text": "$$r_k = \\frac{\\text{sum of } (y_t - \\bar y)(y_{t-k} - \\bar y)}{\\text{sum of all } (y_t - \\bar y)^2}$$ Same overall mean and same bottom line for every k."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "PDF pages 770–771: 22, 24, 25, 25, 28, 29, 34, 37, 40, 44, 51, 48, 47, 50, 51",
          "text": "Mean = 37. Deviations −15, −13, −12, …, 14. Bottom line: sum of squares = 1676.\nTop line for lag 1: (−15)(−13) + (−13)(−12) + … + (13)(14) = 1394."
        },
        {
          "type": "answer",
          "value": "$r_1 = 1394/1676 = 0.8317$",
          "text": "then $r_2 = 0.6563$, $r_3 = 0.4911$, … slowly fading"
        },
        {
          "type": "diagram",
          "name": "i14-acf"
        },
        {
          "type": "table",
          "head": [
            "ACF shape",
            "Means"
          ],
          "rows": [
            [
              "Big, positive, **slowly fading**",
              "Trend"
            ],
            [
              "Spikes at 4, 8, 12 (or 12, 24)",
              "Quarterly (or monthly) seasons"
            ],
            [
              "All small, inside the bounds",
              "White noise"
            ]
          ]
        },
        {
          "type": "check",
          "q": "An ACF starts at 0.87 and falls slowly: 0.77, 0.67, 0.59, … The series most likely has…",
          "options": [
            "no pattern",
            "a trend",
            "a 4-quarter season",
            "a unit root of 0"
          ],
          "answer": 1,
          "why": "Large positive small-lag values that fade slowly signal a trend (page 774)."
        }
      ]
    },
    {
      "id": "s-noise",
      "heading": "5. White noise: pure static",
      "slides": "777–784",
      "blocks": [
        {
          "type": "p",
          "text": "**White noise** is like radio static: mean 0, steady volume, and no pattern at all. Today tells you nothing about tomorrow. After a good model, what's left over (the residuals) should be white noise."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The 95% fence (page 779)",
          "text": "$$\\pm\\frac{2}{\\sqrt{T}}$$ About 95% of a white-noise ACF's bars stay inside this fence. A big bar outside ⇒ there is still a pattern to model."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "The PDF's arithmetic slip (pages 781–782)",
          "text": "It says $2/\\sqrt{50} = 2.8$. It is **0.283**. And $2/\\sqrt{200} = $ **0.141**, not 2.8. A correlation can never be bigger than 1, so a fence at 2.8 would be meaningless."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Ljung-Box test (page 784)",
          "text": "$H_0$: white noise. **p < 0.05 ⇒ reject: there is autocorrelation.** p > 0.05 ⇒ treat as white noise."
        },
        {
          "type": "check",
          "q": "T = 25, so the fence is ±0.4. The ACF bars are −0.21, 0.09, −0.05, 0.04, −0.02, 0.30, −0.03. Verdict?",
          "options": [
            "Not white noise",
            "Consistent with white noise",
            "Has a trend",
            "Needs differencing"
          ],
          "answer": 1,
          "why": "Every bar is inside ±0.4 (the sales series, pages 783, 793)."
        }
      ]
    },
    {
      "id": "s-pacf",
      "heading": "6. PACF: the direct link, middle-men removed",
      "slides": "786–790",
      "blocks": [
        {
          "type": "p",
          "text": "Today and the day before yesterday may look linked only because both are linked to **yesterday**. The **partial** autocorrelation takes yesterday's influence out and keeps just the **direct** link (page 786). At lag 1 there is no middle-man, so **PACF(1) = ACF(1)**."
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**ACF = total link. PACF = direct link.**"
        }
      ]
    },
    {
      "id": "s-models",
      "heading": "7. AR, MA, ARMA: three ways to remember the past",
      "slides": "791–805",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Model",
            "Today depends on…",
            "Formula",
            "Order read from"
          ],
          "rows": [
            [
              "**AR(p)**",
              "the last p **values**",
              "$Y_t = c + \\phi_1Y_{t-1} + \\dots + \\phi_pY_{t-p} + \\varepsilon_t$",
              "PACF cut-off"
            ],
            [
              "**MA(q)**",
              "the last q **surprises** (errors)",
              "$Y_t = w_t + \\theta_1w_{t-1} + \\dots + \\theta_qw_{t-q}$",
              "ACF cut-off"
            ],
            [
              "**ARMA(p, q)**",
              "both",
              "AR terms + MA terms",
              "both plots"
            ]
          ]
        },
        {
          "type": "diagram",
          "name": "i14-pattern"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "PDF page 793: AR(1) on the sales series",
          "text": "Fitted line: $\\hat Y_t = 8.502 - 0.486\\,Y_{t-1}$. Last value 5.8 → next = $8.502 - 0.486 \\times 5.8$."
        },
        {
          "type": "answer",
          "value": "Forecast ≈ 5.683",
          "text": "negative coefficient ⇒ the series zig-zags (exercise solution prepared for the website)"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "ARMA(1, 1) forecast",
          "text": "$\\hat Y_t = \\phi_0 + \\phi_1Y_{t-1} + \\theta_1\\varepsilon_{t-1}$ with 2, 0.6, 0.3, last value 10, last error 1.5: $2 + 6 + 0.45$."
        },
        {
          "type": "answer",
          "value": "8.45"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Memory hook",
          "text": "“**P**ACF gives **p**.” The other plot, ACF, gives q. Page 804: ACF 2 spikes, PACF 1 spike ⇒ ARMA(1, 2)."
        },
        {
          "type": "check",
          "q": "ACF cuts off after 1 lag; PACF fades slowly. Model?",
          "options": [
            "AR(1)",
            "MA(1)",
            "ARMA(2, 2)",
            "White noise"
          ],
          "answer": 1,
          "why": "ACF cut-off gives the MA order: q = 1."
        }
      ]
    },
    {
      "id": "s-df",
      "heading": "8. Dickey-Fuller: is there a unit root?",
      "slides": "794–798",
      "blocks": [
        {
          "type": "p",
          "text": "In $Y_t = \\mu + \\phi_1Y_{t-1} + \\varepsilon_t$, if $\\phi_1 = 1$ each value is just the last one plus a shock: a **random walk**, like a drunkard wandering off and never coming home. That is a **unit root**, and it is non-stationary."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The trick (page 795)",
          "text": "Subtract $Y_{t-1}$ from both sides: $\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$ with $\\delta = \\phi_1 - 1$.\n- $H_0$: δ = 0 (unit root, **non-stationary**)\n- $H_1$: δ < 0 (stationary)\n- $t = \\hat\\delta/SE(\\hat\\delta)$; **reject $H_0$ if t is below the DF critical value**."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Practice",
          "text": "$\\hat\\delta = -0.45$, SE = 0.15 → t = −3.0. DF critical value −2.89."
        },
        {
          "type": "answer",
          "value": "−3.0 < −2.89 ⇒ reject $H_0$ ⇒ stationary",
          "text": "exercise prepared for the website"
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**In Dickey-Fuller, $H_0$ = the bad news (unit root).** You need strong evidence (a very negative t) to call the series stationary."
        }
      ]
    },
    {
      "id": "s-arima",
      "heading": "9. ARIMA: difference first, then ARMA",
      "slides": "806–820",
      "blocks": [
        {
          "type": "p",
          "text": "A trending series is like a staircase. Look at the **step heights** instead of the floor levels and you get a flat row of numbers: that's **differencing**. Fit ARMA to the step heights, then add them back up to forecast the stairs."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Differencing",
          "text": "Levels 10, 13, 17, 20, 24 (climbing) → differences 3, 4, 3, 4 (flat)."
        },
        {
          "type": "answer",
          "value": "One difference: d = 1"
        },
        {
          "type": "table",
          "head": [
            "Letter",
            "Means",
            "Order"
          ],
          "rows": [
            [
              "AR",
              "past values",
              "p"
            ],
            [
              "I",
              "differencing (Integrated)",
              "d"
            ],
            [
              "MA",
              "past errors",
              "q"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "Need",
            "Use"
          ],
          "rows": [
            [
              "Seasons",
              "**S**ARIMA"
            ],
            [
              "Seasons + outside drivers (price, ads)",
              "SARIMA**X**"
            ],
            [
              "Several series together",
              "**V**AR / VARMAX"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Choosing between models",
          "text": "Fit a few candidates and keep the one with the **lowest AIC or BIC** (page 817)."
        },
        {
          "type": "check",
          "q": "ARIMA(2, 1, 0) means…",
          "options": [
            "2 differences, 1 AR term",
            "AR(2) after one difference, no MA",
            "MA(2) after one difference",
            "seasonal model"
          ],
          "answer": 1,
          "why": "p = 2 AR terms, d = 1 difference, q = 0 MA terms."
        }
      ]
    }
  ],

  summary: [
    {
      id: "process",
      heading: "Lesson 1: A time series as a stochastic process",
      slides: "737–743",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "Imagine a machine that produces a whole time series every time you switch it on. Switch it on once and you get one wiggly line: **that line is your data**. The machine itself, with all the lines it *could* have produced, is the **stochastic process**. We only ever see one line, and we use it to learn about the machine.",
        },
        {
          type: "p",
          text: "**Definition (page 737).** A **stochastic process** is a family of random variables $\\{Y_t, t \\in T\\}$ defined on a probability space $(\\Omega, \\mathcal{F}, P)$: $\\Omega$ is the sample space, $\\mathcal{F}$ the collection of events (subsets of $\\Omega$), P the probability measure, and **T the index set** (usually time). $Y_t$ is the random quantity at time t, and in general it may depend on $Y_{t-1}$ or on any earlier $Y_s$, s < t (page 740).",
        },
        {
          type: "table",
          caption: "Index set T decides the type (page 739)",
          head: ["Index set T", "Type of process", "Example"],
          rows: [
            ["$(-\\infty, \\infty)$ or $[0, \\infty)$", "**Continuous-time** process", "A temperature sensor recording all the time"],
            ["$\\{0, \\pm1, \\pm2, \\dots\\}$ or $\\{0, 1, 2, \\dots\\}$", "**Discrete-time** process", "Monthly sales, quarterly GDP"],
          ],
        },
        {
          type: "p",
          text: "**Process vs series (pages 739, 742).** Upper-case $\\{Y_t\\}$ is the process; an observed time series $y = (y_1, \\dots, y_n)$ is **one realisation** (a sample function) of the random vector $(Y_1, \\dots, Y_n)$ with joint density $f_Y(y)$. Each realisation is called an **ensemble** or data set (page 738). We use the series to estimate the process's parameters.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The process is fully described by its finite-dimensional distributions (pages 741, 743)",
          text: "$$F_{Y_{t_1}, \\dots, Y_{t_k}}(y_1, \\dots, y_k) = P(Y_{t_1} \\le y_1, \\dots, Y_{t_k} \\le y_k)$$ for any times $t_1 < \\dots < t_k$ in T and any real numbers $y_1, \\dots, y_k$. Knowing all of these tells us everything about $\\{Y_t\\}$.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Process = the machine; series = one printout.** Continuous T → continuous-time process; integer T → discrete-time process.",
        },
      ],
    },
    {
      id: "stationary",
      heading: "Lesson 2: Stationarity: strict and weak",
      slides: "744–758",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "A **stationary** series looks the same whichever stretch of time you look at: same average level, same amount of wobble, and the same link between neighbours. Cut any window out of it and you couldn't say *when* it was taken. A series with a trend or seasons is **not** stationary: its level clearly depends on the date.",
        },
        { type: "diagram", name: "i14-stat" },
        {
          type: "callout",
          kind: "formula",
          title: "Moments of a process (pages 745–746)",
          text: "- Mean function: $E(Y_t) = \\mu_t$\n- Variance function: $V(Y_t) = \\sigma_t^2$\n- Covariance function: $\\text{Cov}(Y_t, Y_s) = E[(Y_t - \\mu_t)(Y_s - \\mu_s)]$\n- Correlation function: $\\rho(Y_t, Y_s) = \\dfrac{\\text{Cov}(Y_t, Y_s)}{\\sqrt{\\sigma_t^2}\\sqrt{\\sigma_s^2}}$\n\nIn general these are **functions of time**. We usually work with the first two moments.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Strict stationarity (pages 744, 747, 749)",
          text: "The process is **strictly stationary** if its properties are unaffected by a change of time origin: for every k, every set of times and every shift h,\n$$F_{Y_{t_1}, \\dots, Y_{t_k}}(y_1, \\dots, y_k) = F_{Y_{t_1 + h}, \\dots, Y_{t_k + h}}(y_1, \\dots, y_k)$$",
        },
        {
          type: "list",
          items: [
            "**Consequences (page 748).** If it is strictly stationary and $E(Y_t^2) < \\infty$, the mean and variance are **constants**, and the covariance and correlation depend **only on the time gap**, not on where you are in time.",
            "**Simplest example (page 748):** a sequence of **i.i.d.** random variables (independent, identically distributed, page 738).",
            "**With k = 1 (pages 752–754):** every $Y_t$ has the same pdf f(y), so there is one constant mean $\\mu = \\int y f(y)\\,dy$ and one constant variance $\\sigma^2 = \\int (y - \\mu)^2 f(y)\\,dy$, estimated by $\\hat\\mu = \\bar y = \\frac{1}{n}\\sum y_i$ and $\\hat\\sigma^2 = \\frac{1}{n}\\sum (y_i - \\bar y)^2$.",
            "**Why we care (page 749):** reliable prediction needs a stationary series, i.e. **no systematic change** such as trend or seasonality, only random fluctuations.",
          ],
        },
        {
          type: "table",
          caption: "Strict vs weak stationarity (pages 750–751)",
          head: ["", "Strictly stationary", "Weakly (n-th order) stationary"],
          rows: [
            ["Requires", "The **whole joint distribution** is unchanged by any time shift", "Only the **moments up to order n** exist and are unchanged by a time shift"],
            ["Second-order weak", "–", "Constant mean, constant variance, covariance/correlation depend only on the lag"],
            ["In practice", "Too strong; hard to check from one series", "What we actually use"],
            ["Link", "Strict + finite first two moments ⇒ second-order weakly stationary", "But a strictly stationary process **without** finite moments is not weakly stationary"],
          ],
        },
        {
          type: "p",
          text: "**Real data (pages 755–758).** Many business and economic series (e.g. stock prices) are **non-stationary**, with no natural mean (page 757 shows the Wolfer sunspot numbers 1770–1869 as a classic series). The two main causes of non-stationarity are **trend** and **seasonality**, so before fitting a stationary model we **remove** them (e.g. by differencing, Lesson 9).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Stationary = same mean, same spread, same neighbour-link at all times.** Trend or seasons ⇒ not stationary ⇒ remove them first.",
        },
      ],
    },
    {
      id: "acf",
      heading: "Lesson 3: Autocovariance and the autocorrelation function (ACF)",
      slides: "759–776, 785",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "**Auto**correlation is the correlation of a series **with its own past**. Slide the series back by one step (lag 1) and correlate it with the original: if high values tend to follow high values, $r_1$ is large and positive. Do the same for lag 2, lag 3, … and plot all of them: that bar chart is the **ACF** or **correlogram**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Autocovariance and ACF of a stationary series (pages 761–763)",
          text: "$$\\gamma_h = \\text{Cov}(Y_t, Y_{t+h}) = E[(Y_t - \\mu)(Y_{t+h} - \\mu)] \\qquad \\rho_h = \\frac{\\gamma_h}{\\gamma_0} = \\frac{\\text{Cov}(Y_{t+h}, Y_t)}{\\sigma^2}$$\n- At lag 0: $\\gamma_0 = \\sigma^2$, so $\\rho_0 = 1$.\n- $|\\gamma_h| \\le \\gamma_0$ for every h (page 762), so $-1 \\le \\rho_h \\le 1$.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Sample autocorrelation at lag k (pages 766–767)",
          text: "$$r_k = \\frac{\\sum_{t=k+1}^{T}(y_t - \\bar y)(y_{t-k} - \\bar y)}{\\sum_{t=1}^{T}(y_t - \\bar y)^2}$$ T = length of the series. Note the **same overall mean $\\bar y$** and the **same full denominator** for every k. $r_1$ links $Y_t$ with $Y_{t-1}$, $r_2$ with $Y_{t-2}$, …, $r_k$ with $Y_{t-k}$ (page 768).",
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF example (pages 770–771, 785): a 15-value series",
          text: "Values: 22, 24, 25, 25, 28, 29, 34, 37, 40, 44, 51, 48, 47, 50, 51. Mean $\\bar y = 555/15 = 37$.\nDeviations: −15, −13, −12, −12, −9, −8, −3, 0, 3, 7, 14, 11, 10, 13, 14; sum of squares = **1676**.\nLag 1: sum of neighbouring products $(-15)(-13) + (-13)(-12) + \\dots + (13)(14) = 1394$ → $r_1 = 1394/1676 = $ **0.8317**.\nLag 2: products two apart sum to 1100 → $r_2 = $ **0.6563**. Lag 3: 823 → $r_3 = $ **0.4911**.\nThe PDF's full list: 0.8317, 0.6563, 0.4911, 0.2786, 0.0310, −0.1653, −0.3037, −0.4010, −0.4582, −0.4505 (lags 1–10, all verified).",
        },
        { type: "diagram", name: "i14-acf" },
        {
          type: "table",
          caption: "Reading the shape of an ACF (pages 774–776)",
          head: ["Series has…", "ACF looks like…", "PDF example"],
          rows: [
            ["**Trend**", "Large positive values at small lags that **decay slowly**", "Retail quarterly sales 2011–2018 (pages 769, 772–773): $r_1 = 0.874$, $r_2 = 0.770$, … falling to $r_{13} = -0.140$"],
            ["**Seasonality**", "**Bigger spikes at the seasonal lags** (multiples of the season length, e.g. 4, 8, 12 for quarterly)", "Page 776 seasonal series"],
            ["**No pattern (white noise)**", "All spikes small, inside $\\pm 2/\\sqrt{T}$", "Lesson 4"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**$r_k$ = (sum of products k apart) ÷ (sum of all squares), both around the overall mean.** Slowly fading ACF ⇒ trend. Spikes at 4, 8, 12 ⇒ quarterly seasons.",
        },
      ],
    },
    {
      id: "whitenoise",
      heading: "Lesson 4: White noise, the ±2/√T bounds and the Ljung-Box test",
      slides: "777–784",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "**White noise** is pure, patternless randomness, like radio static. Knowing today tells you nothing about tomorrow. If what's left after your model (the residuals) is white noise, your model has captured every pattern there was. If not, there's still something left to model.",
        },
        {
          type: "p",
          text: "**Definition (page 777).** A series with **no autocorrelation**: the values are i.i.d. with **mean 0**, the same variance $\\sigma^2$, and zero correlation with every other value. The name comes from white light, which contains all frequencies equally (page 778); “noise” comes from signal processing.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The 95% bounds (pages 779–781)",
          text: "For white noise, about **95% of ACF spikes lie within**\n$$\\pm \\frac{2}{\\sqrt{T}}$$ T = length of the series. If one or more large spikes fall outside, or clearly more than 5% of them do, the series is **probably not white noise** (page 780). These are the blue dashed lines on an ACF plot.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): pages 781–782",
          text: "The PDF writes $\\pm 2/\\sqrt{50} = \\pm 2.8$ and $\\pm 2/\\sqrt{200} = \\pm 2.8$. Both are wrong: $2/\\sqrt{50} = $ **±0.283** and $2/\\sqrt{200} = $ **±0.141**. (Autocorrelations can never exceed 1 in size, so a bound of 2.8 would make every series look like white noise.)",
        },
        {
          type: "table",
          caption: "Applying the rule to the PDF's three series (all verified)",
          head: ["Series", "T", "Bound $2/\\sqrt{T}$", "ACF", "Verdict"],
          rows: [
            ["15-value series (page 771)", "15", "±0.516", "$r_1 = 0.832$, $r_2 = 0.656$ outside", "**Not** white noise (trend)"],
            ["Retail sales (page 773)", "30", "±0.365", "$r_1$ to $r_6$ (0.874 … 0.407) outside", "**Not** white noise (trend)"],
            ["Sales 5.3, 4.4, … (pages 783, 793)", "25", "±0.400", "Largest $|r_k|$ ≈ 0.30 (lag 6); $r_1 = -0.2125$", "Consistent with white noise"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 783",
          text: "The chart's lag-1 value −0.2125 matches the sales data on page 793, but the other bars (0.0922, −0.0582, 0.0026, 0.15, 0.3734, −0.0444) could not be reproduced from that data. The standard ACF formula gives 0.0884, −0.0534, 0.0433, −0.0231, 0.2956, −0.0333 for lags 2–7. Either way, every spike is inside ±0.4, so the conclusion is the same.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Ljung-Box test: a test for many lags at once (page 784)",
          text: "- $H_0$: the series is random / white noise / i.i.d. (no autocorrelation).\n- $H_1$: the series shows serial (auto)correlation.\n- **P < 0.05 → reject $H_0$**: not white noise.\n- **P > 0.05 → fail to reject $H_0$**: treat as white noise. (For real white noise the p-value is usually large.)",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**White noise = mean 0, constant variance, zero autocorrelation.** Spikes inside $\\pm 2/\\sqrt{T}$ and a Ljung-Box **p > 0.05** ⇒ white noise. Residuals of a good model should be white noise.",
        },
      ],
    },
    {
      id: "pacf",
      heading: "Lesson 5: Partial autocorrelation (PACF) and correlograms",
      slides: "786–790",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "Today's price may look linked to the price two days ago only **because** both are linked to yesterday. The **partial** autocorrelation removes that middle-man: it is the link between today and k days ago **after taking out** the effect of all the days in between (page 786).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "PACF (page 787)",
          text: "A conditional correlation. For example, the **lag-3 partial autocorrelation** is\n$$\\frac{\\text{Cov}(X_t, X_{t-3} \\mid X_{t-1}, X_{t-2})}{\\sqrt{\\text{Var}(X_t \\mid X_{t-1}, X_{t-2})\\,\\text{Var}(X_{t-3} \\mid X_{t-1}, X_{t-2})}}$$ **At lag 1 the PACF equals the ACF**: there is nothing in between to remove.",
        },
        {
          type: "p",
          text: "**Correlograms (pages 788–790).** A correlogram is the plot of $r_k$ against k with the 95% bounds. Page 789 shows the ACF and PACF of a differenced premium series with bounds $\\pm 1.96/\\sqrt{T}$, mostly inside the bounds. Page 788 shows a slowly decaying oscillating ACF (a strongly autocorrelated series). Together, the ACF and PACF are used to pick the orders of an ARMA model (Lesson 8).",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**ACF = total link to lag k. PACF = direct link to lag k, middle-men removed.** Lag 1: PACF = ACF.",
        },
      ],
    },
    {
      id: "ar",
      heading: "Lesson 6: Autoregressive models AR(p)",
      slides: "791–793",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "An **autoregressive** model is a regression of the series **on its own past values**: “tomorrow's sales = a constant + some fraction of today's sales + some fraction of yesterday's + a random shock.” *Auto* = self, *regressive* = regression.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "AR(p) (pages 791–792)",
          text: "$$Y_t = c + \\phi_1 Y_{t-1} + \\phi_2 Y_{t-2} + \\dots + \\phi_p Y_{t-p} + \\varepsilon_t$$ $\\phi_1, \\dots, \\phi_p$ are the parameters, c a constant, $\\varepsilon_t$ **white noise**. The output depends **linearly on its own previous values** plus a random error: a *stochastic difference equation*.",
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF example (page 793): one-lag regressions on 25 periods of sales",
          text: "Sales: 5.3, 4.4, 5.4, 5.8, 5.6, 4.8, 5.6, 5.6, 5.4, 6.5, 5.1, 5.8, 5.0, 6.2, 5.6, 6.7, 5.2, 5.5, 5.8, 5.1, 5.8, 6.7, 5.2, 6.0, 5.8. The lag columns shift the series down by 1 … 7 rows. Regressing $Y_t$ on each lag separately (all on the same 18 periods t = 8 … 25) gives:\n\n| Lag | 1 | 2 | 3 | 4 | 5 | 6 | 7 |\n|---|---|---|---|---|---|---|---|\n| Intercept | 8.502 | 4.814 | 6.408 | 6.617 | 6.246 | 3.381 | 5.816 |\n| Coefficient | −0.486 | 0.161 | −0.121 | −0.159 | −0.094 | 0.421 | −0.017 |\n\nVerified in Python. Lag 6 has the largest positive coefficient (0.421), matching the lag-6 ACF spike: a possible 6-period rhythm.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Using it to forecast (exercise solution prepared for the website)",
          text: "AR(1) from the lag-1 row: $\\hat Y_t = 8.502 - 0.486\\,Y_{t-1}$. Last value $Y_{25} = 5.8$ → $\\hat Y_{26} = 8.502 - 0.486(5.8) = $ **5.683**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**AR = regress on your own past values.** p = how many past values. The error term is white noise.",
        },
      ],
    },
    {
      id: "df",
      heading: "Lesson 7: Testing for stationarity: the Dickey-Fuller test",
      slides: "794–798, 811–812",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "In $Y_t = \\mu + \\phi_1 Y_{t-1} + \\varepsilon_t$, if $\\phi_1 = 1$ each value is just the last value plus a fresh shock: a **random walk** that never returns to a fixed mean, so it is **non-stationary**. This is called a **unit root**. The Dickey-Fuller test asks: *is $\\phi_1$ really 1, or is it below 1?*",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Dickey-Fuller test for AR(1) (pages 794–795)",
          text: "Start: $Y_t = \\mu + \\phi_1 Y_{t-1} + \\varepsilon_t$. Hypotheses: $H_0: \\phi_1 = 1$ (unit root, non-stationary) vs $H_1: \\phi_1 < 1$ (no unit root, stationary).\nSubtract $Y_{t-1}$ from both sides:\n$$\\Delta Y_t = Y_t - Y_{t-1} = \\mu + \\delta Y_{t-1} + \\varepsilon_t, \\qquad \\delta = \\phi_1 - 1$$ so the test becomes $H_0: \\delta = 0$ vs $H_1: \\delta < 0$, with\n$$t_{\\hat\\delta} = \\frac{\\hat\\delta}{SE(\\hat\\delta)}$$ which follows the **Dickey-Fuller distribution** (not the usual t). **Reject $H_0$ if $t_{\\hat\\delta}$ < DF critical value** (P ≤ 0.05) → stationary; otherwise fail to reject → unit root.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Augmented Dickey-Fuller (ADF) for AR(p) (pages 796–798, 812)",
          text: "$$\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\sum_{i=2}^{p} \\beta_i Y_{t-i} + \\varepsilon_t$$ (page 812 writes the extra terms with lagged differences $\\Delta Y_{t-i}$). Test $\\delta$ exactly as above with the DF distribution. The extra coefficients $\\beta_i$ are tested with ordinary **t-tests**, $t_{\\hat\\beta_i} = \\hat\\beta_i/SE(\\hat\\beta_i)$ (page 798).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 798",
          text: "The rejection rule says “reject $H_0$ if $t_{\\hat\\beta_i}$ > t(CV)” but the next line says “fail to reject if $t_{\\hat\\delta}$ < t(CV)”. The second should also be $t_{\\hat\\beta_i}$. Keep the two tests separate in your answer: **δ uses the DF table, β uses the t table.**",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Unit root = $\\phi_1 = 1$ = random walk = non-stationary.** Rewrite as $\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$; **H₀: δ = 0**; reject (stationary) only if $t_{\\hat\\delta}$ is **more negative** than the DF critical value.",
        },
      ],
    },
    {
      id: "arma",
      heading: "Lesson 8: Moving-average MA(q) and ARMA(p, q) models",
      slides: "799–805",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "AR models remember past **values**. MA models remember past **surprises** (shocks): a sudden spike in demand last week may still echo this week. ARMA combines both. (Don't confuse this MA *model* with the moving-*average smoothing* of Lecture 12.)",
        },
        {
          type: "callout",
          kind: "formula",
          title: "MA(q) (pages 799–800)",
          text: "$$Y_t = w_t + \\theta_1 w_{t-1} + \\theta_2 w_{t-2} + \\dots + \\theta_q w_{t-q}$$ $\\theta_1, \\dots, \\theta_q$ are constants with $\\theta_q \\ne 0$, and $w_t$ is **Gaussian white noise** with mean 0 and variance $\\sigma_w^2$ (noise whose values are normally distributed).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "ARMA(1, 1) and ARMA(p, q) (pages 801–805)",
          text: "$$Y_t = \\phi_0 + \\phi_1 Y_{t-1} + \\theta_1\\varepsilon_{t-1} + \\varepsilon_t \\qquad \\hat Y_t = \\phi_0 + \\phi_1 Y_{t-1} + \\theta_1\\varepsilon_{t-1}$$ $\\phi_0$: constant; $\\phi_1$: AR coefficient on $Y_{t-1}$; $\\theta_1$: MA coefficient on last period's error $\\varepsilon_{t-1}$. For the forecast everything is known except the current error $\\varepsilon_t$, which is left out (page 803).\n$$\\text{ARMA}(p, q):\\; y_t = \\phi_1 y_{t-1} + \\dots + \\phi_p y_{t-p} + \\varepsilon_t + \\theta_1\\varepsilon_{t-1} + \\dots + \\theta_q\\varepsilon_{t-q}, \\quad \\text{i.e. } \\Phi(L)y_t = \\Theta(L)\\varepsilon_t$$ ARMA gives a **parsimonious** (few-parameter) description of a weakly stationary process with one polynomial for AR and one for MA (page 801).",
        },
        { type: "diagram", name: "i14-pattern" },
        {
          type: "table",
          caption: "Choosing p and q from the plots (pages 803–804, 816)",
          head: ["Plot", "Tells you", "How"],
          rows: [
            ["**ACF**", "the **MA order q**", "Count the significant spikes before the ACF cuts off"],
            ["**PACF**", "the **AR order p**", "Count the significant spikes before the PACF cuts off"],
            ["Page 804 example", "ACF: 2 spikes outside; PACF: 1 spike outside", "MA order 2, AR order 1 → **ARMA(1, 2)**"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "ARMA(1, 1) forecast (exercise solution prepared for the website)",
          text: "$\\phi_0 = 2$, $\\phi_1 = 0.6$, $\\theta_1 = 0.3$; last value $Y_{t-1} = 10$, last error $\\varepsilon_{t-1} = 1.5$.\n$\\hat Y_t = 2 + 0.6(10) + 0.3(1.5) = 2 + 6 + 0.45 = $ **8.45**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**AR = past values (PACF gives p). MA = past shocks (ACF gives q).** “**P**ACF → **p**”; the other one, ACF, gives q.",
        },
      ],
    },
    {
      id: "arima",
      heading: "Lesson 9: ARIMA(p, d, q), choosing p, d, q, and SARIMA / SARIMAX / VAR",
      slides: "806–820",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "ARMA only works on stationary data. If the series has a trend, first look at the **changes** from one period to the next instead of the levels (**differencing**). A rising staircase becomes a flat row of step-heights. Fit ARMA to the changes, then add them back up to forecast the original. That “I” step is the only difference between ARMA and **ARIMA**.",
        },
        {
          type: "table",
          caption: "What A-R-I-M-A stands for (page 806)",
          head: ["Letter", "Name", "Meaning", "Order"],
          rows: [
            ["**AR**", "Auto-regression", "Uses the link between an observation and some lagged observations", "p"],
            ["**I**", "Integrated", "**Differencing** the raw data to make the series stationary", "d (number of differences)"],
            ["**MA**", "Moving average", "Uses the link between an observation and past residual errors", "q"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Differencing and undoing it (pages 807–808)",
          text: "First difference: $Z_t = Y_{t+1} - Y_t$ (page 808; most books write $Y_t - Y_{t-1}$, same idea). The differenced series $Z_t$ is now (closer to) stationary: its mean doesn't drift (page 807 shows a trending $Y_t$ becoming a flat $Z_t$). Fit an ARMA to $Z_t$. To get back to the original level, **add the differences up** again: $Y_k = \\sum_{i=1}^{k-l} Z_{k-i} + a_l$ (page 807), where $a_l$ is a known starting value. AR and MA work on stationary data; **I is a pre-processing step** (page 809).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Differencing the retail series (exercise solution prepared for the website)",
          text: "Retail sales (page 769) Q1 2011 – Q4 2012: 147772, 154400, 166188, 170202, 173264, 175371, 184957, 186395.\nFirst differences: 6628, 11788, 4014, 3062, 2107, 9586, 1438. The levels climb steadily; the differences go up and down around a roughly constant level, with no steady climb. One difference (d = 1) removes the trend.",
        },
        {
          type: "list",
          items: [
            "**Process for building the model (pages 813–815):** rationale (why this model), full mathematical definition, second-order properties (mean, variance, ACF), correlogram, then simulate and fit to check the implementation.",
            "**Choosing p, d, q (pages 816–817):** the ACF suggests the MA part; the PACF suggests the AR part (the PDF's “MR model” on page 816 is a typo for AR); the extended ACF helps when both are needed. Then compare candidate models by **AIC** (Akaike) or **BIC** (Schwarz Bayesian): **the lowest value wins**. R packages do this automatically.",
            "**Page 811:** test stationarity with Dickey-Fuller first. If the unit root is not rejected, difference (d = 1) and test again.",
          ],
        },
        {
          type: "table",
          caption: "The ARIMA family (pages 818–820)",
          head: ["Model", "Adds", "Use when"],
          rows: [
            ["**ARIMA**", "AR + differencing + MA", "One series with trend but **no seasonality** (most widely used for univariate forecasting)"],
            ["**SARIMA**", "Seasonal AR/I/MA terms", "One series with a **seasonal** component"],
            ["**SARIMAX**", "Seasonal terms + e**X**ogenous factors (outside variables)", "Seasonality plus outside drivers (price, holidays, weather)"],
            ["**VAR**", "Vector autoregression", "**Several series together**: each variable is a linear function of past lags of itself and of the others"],
            ["**VARMAX**", "VAR + MA terms + exogenous inputs", "Multivariate, with relationships between dependent and independent variables"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**ARIMA(p, d, q) = difference d times, then ARMA(p, q).** Seasons → **S**ARIMA. Outside drivers → add **X**. Many series together → **V**AR. Pick between models by the **lowest AIC/BIC**.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Session 14 on one screen (consolidated PDF pages)",
      head: ["Idea", "Key formula / rule", "Pages"],
      rows: [
        ["Stochastic process", "Family $\\{Y_t, t \\in T\\}$; a time series is one realisation", "737–743"],
        ["Strict stationarity", "Joint distribution unchanged by any time shift h", "744–749"],
        ["Weak (2nd-order) stationarity", "Constant mean and variance; covariance depends only on the lag", "750–751"],
        ["ACF", "$\\rho_h = \\gamma_h/\\gamma_0$; $r_k = \\frac{\\sum_{t=k+1}^T (y_t - \\bar y)(y_{t-k} - \\bar y)}{\\sum (y_t - \\bar y)^2}$; $\\rho_0 = 1$", "759–773"],
        ["Trend / seasonal ACF", "Slow decay / spikes at seasonal lags", "774–776"],
        ["White noise", "Mean 0, constant variance, no autocorrelation; 95% of spikes in $\\pm 2/\\sqrt{T}$", "777–782"],
        ["Ljung-Box", "$H_0$: white noise; p < 0.05 → not white noise", "784"],
        ["PACF", "Correlation at lag k with intermediate lags removed; PACF(1) = ACF(1)", "786–787"],
        ["AR(p)", "$Y_t = c + \\phi_1Y_{t-1} + \\dots + \\phi_pY_{t-p} + \\varepsilon_t$", "791–793"],
        ["Dickey-Fuller", "$\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$; $H_0: \\delta = 0$ (unit root); reject if $t_{\\hat\\delta}$ < DF CV", "794–798"],
        ["MA(q)", "$Y_t = w_t + \\theta_1w_{t-1} + \\dots + \\theta_qw_{t-q}$", "799–800"],
        ["ARMA(1, 1)", "$\\hat Y_t = \\phi_0 + \\phi_1Y_{t-1} + \\theta_1\\varepsilon_{t-1}$; ACF → q, PACF → p", "801–805"],
        ["ARIMA(p, d, q)", "Difference d times ($Z_t = Y_{t+1} - Y_t$), then ARMA(p, q); choose by lowest AIC/BIC", "806–817"],
        ["SARIMA / SARIMAX / VAR(MAX)", "Seasonal / + exogenous / multivariate", "818–820"],
      ],
    },
    { type: "diagram", name: "i14-pattern" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Use the **overall mean** and the **full denominator** in every $r_k$ · compute $2/\\sqrt{T}$ correctly (it is below 1; the PDF's 2.8 is wrong) · state $H_0$ and $H_1$ in words for Ljung-Box and Dickey-Fuller · in Dickey-Fuller, $H_0$ is the **unit root** (non-stationary) · ACF → q, PACF → p · ARIMA's “I” = differencing.",
    },
  ],

  glossary: [
    ["Stochastic process", "Random process", "A family of random variables $\\{Y_t, t \\in T\\}$ indexed by time"],
    ["Index set T", "", "The set of time points; continuous (an interval) or discrete (integers)"],
    ["Realisation", "Sample function, ensemble", "One observed time series produced by the process"],
    ["i.i.d.", "Independent and identically distributed", "Same distribution, mutually independent"],
    ["Strictly stationary", "", "All joint distributions unchanged by a shift of time origin"],
    ["Weakly stationary", "Second-order / covariance stationary", "Constant mean and variance; covariance depends only on the lag"],
    ["Lag h (or k)", "", "The time gap between two observations"],
    ["Autocovariance $\\gamma_h$", "ACVF", "$\\text{Cov}(Y_t, Y_{t+h})$; $\\gamma_0 = \\sigma^2$"],
    ["Autocorrelation $\\rho_h$, $r_k$", "ACF", "Correlation of the series with itself k steps back; $\\rho_0 = 1$"],
    ["Correlogram", "ACF plot", "Bar chart of $r_k$ against k with the 95% bounds"],
    ["Partial autocorrelation", "PACF", "Correlation at lag k after removing the effect of lags 1 … k − 1"],
    ["White noise", "", "Mean 0, constant variance, zero autocorrelation"],
    ["Gaussian white noise", "", "White noise whose values are normally distributed"],
    ["Ljung-Box test", "", "Tests whether a group of autocorrelations are all zero ($H_0$: white noise)"],
    ["AR(p)", "Autoregressive model", "Regression of $Y_t$ on its own p previous values"],
    ["MA(q)", "Moving-average model", "$Y_t$ as a combination of the current and q past white-noise shocks"],
    ["ARMA(p, q)", "", "AR(p) and MA(q) combined; for stationary series"],
    ["ARIMA(p, d, q)", "Autoregressive integrated moving average", "Difference d times, then ARMA(p, q)"],
    ["Differencing", "", "$Z_t = Y_{t+1} - Y_t$: replaces levels with changes to remove trend"],
    ["Unit root", "", "$\\phi_1 = 1$ in AR(1): a random walk, non-stationary"],
    ["Dickey-Fuller test", "DF; ADF (augmented)", "Tests $H_0: \\delta = 0$ (unit root) in $\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$"],
    ["AIC / BIC", "Akaike / Schwarz Bayesian information criterion", "Model-choice scores; the lowest is best"],
    ["SARIMA", "Seasonal ARIMA", "ARIMA with seasonal terms"],
    ["SARIMAX", "", "SARIMA with exogenous (outside) variables"],
    ["VAR / VARMAX", "Vector autoregression", "Models several series together, each on lags of all of them"],
  ],

  examTips: [
    "For an ACF by hand, make the table t | $y_t$ | $y_t - \\bar y$ | $(y_t - \\bar y)^2$ | product with lag k, and show both sums before dividing.",
    "Always compute the white-noise bound $2/\\sqrt{T}$ for the given T and say which spikes are outside it.",
    "For Dickey-Fuller, write the rewriting step $\\Delta Y_t = \\mu + (\\phi_1 - 1)Y_{t-1} + \\varepsilon_t$ and define $\\delta = \\phi_1 - 1$ before testing.",
    "When asked to identify a model from plots: ACF cut-off → MA order q; PACF cut-off → AR order p; trend → difference first (d = 1).",
    "For an ARMA forecast, write the fitted equation, substitute the last value and the last error, and drop the unknown current error.",
  ],

  problems: [
    {
      title: "ACF by hand for the 15-value series (pages 770–771, 785)",
      level: "From slides",
      question: "Series: 22, 24, 25, 25, 28, 29, 34, 37, 40, 44, 51, 48, 47, 50, 51. Compute $r_1$ and $r_2$ and say whether the series is white noise.",
      solution: "### Approach\n$r_k = \\frac{\\sum_{t=k+1}^{T}(y_t - \\bar y)(y_{t-k} - \\bar y)}{\\sum_{t=1}^{T}(y_t - \\bar y)^2}$, using the overall mean and the full denominator.\n### Mean and deviations\n$\\bar y = 555/15 = 37$. Deviations: −15, −13, −12, −12, −9, −8, −3, 0, 3, 7, 14, 11, 10, 13, 14.\nDenominator: $225 + 169 + 144 + 144 + 81 + 64 + 9 + 0 + 9 + 49 + 196 + 121 + 100 + 169 + 196 = 1676$.\n### Lag 1\nProducts of neighbours: 195, 156, 144, 108, 72, 24, 0, 0, 21, 98, 154, 110, 130, 182 → sum 1394. $r_1 = 1394/1676 = $ **0.8317**.\n### Lag 2\nProducts two apart: 180, 156, 108, 96, 27, 0, −9, 0, 42, 77, 140, 143, 140 → sum 1100. $r_2 = 1100/1676 = $ **0.6563**.\n### White noise?\nBound $2/\\sqrt{15} = \\pm 0.516$. Both $r_1$ and $r_2$ are far outside, and the ACF decays slowly: **not white noise**; the series has a **trend**.",
    },
    {
      title: "White-noise bounds (pages 779–782)",
      level: "From slides",
      question: "Find the 95% white-noise bounds for series of length T = 50 and T = 200. A series of length 50 has $r_1 = 0.35$ and all other $|r_k| < 0.2$. Is it white noise?",
      solution: "### Formula\nBounds $= \\pm 2/\\sqrt{T}$.\n### Working\nT = 50: $2/7.071 = $ **±0.283**. T = 200: $2/14.142 = $ **±0.141**.\n⚠️ The PDF writes ±2.8 for both (pages 781–782); that is an arithmetic slip.\n### Decision\n$r_1 = 0.35 > 0.283$: a large spike outside the bounds, so the series is **probably not white noise** (there is lag-1 autocorrelation to model). (Second part: exercise solution prepared for the website.)",
    },
    {
      title: "Reading the retail ACF (pages 769, 772–773)",
      level: "Level 1",
      question: "The retail quarterly sales series (T = 30) has ACF 0.874, 0.770, 0.674, 0.589, 0.500, 0.407, 0.331, 0.251, … What do these values say about the series?",
      solution: "### Bound\n$2/\\sqrt{30} = \\pm 0.365$.\n### Reading\nLags 1–6 (0.874 down to 0.407) are outside the bound, and the values are **large, positive and decay slowly**. That is the signature of a **trend** (page 774). So the series is not stationary and not white noise. Difference it before fitting an ARMA model.\n(All ACF values recomputed and verified from the page 769 data.)",
    },
    {
      title: "AR(1) forecast from the lag regression (page 793)",
      level: "Level 2",
      question: "From the PDF's lag-1 regression, $\\hat Y_t = 8.502 - 0.486Y_{t-1}$. The last observed sales value is $Y_{25} = 5.8$. Forecast $Y_{26}$, and say what the negative coefficient means.",
      solution: "### Working\n$\\hat Y_{26} = 8.502 - 0.486(5.8) = 8.502 - 2.819 = $ **5.683**.\n### Meaning\nA negative $\\phi_1$ means a high value tends to be followed by a lower one and vice versa: the series **zig-zags** around its mean (also seen in the negative $r_1 = -0.2125$). (Exercise solution prepared for the website.)",
    },
    {
      title: "Dickey-Fuller decision",
      level: "Level 2",
      question: "For an AR(1) series, the regression $\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$ gives $\\hat\\delta = -0.45$ with $SE(\\hat\\delta) = 0.15$. The 5% Dickey-Fuller critical value is −2.89. State the hypotheses, compute the statistic, and decide.",
      solution: "### Hypotheses (pages 794–795)\n$H_0: \\delta = 0$ (i.e. $\\phi_1 = 1$, unit root, non-stationary) vs $H_1: \\delta < 0$ (stationary).\n### Statistic\n$t_{\\hat\\delta} = \\hat\\delta/SE(\\hat\\delta) = -0.45/0.15 = $ **−3.00**.\n### Decision\n$-3.00 < -2.89$ → **reject $H_0$**. There is no unit root; the series is **stationary**, so no differencing is needed (d = 0). Also $\\hat\\phi_1 = 1 + \\hat\\delta = 0.55$. (Exercise prepared for the website; the critical value is given in the question because the PDF has no DF table.)",
    },
    {
      title: "ARMA(1, 1) one-step forecast (pages 802–803)",
      level: "Level 1",
      question: "An ARMA(1, 1) model has $\\phi_0 = 2$, $\\phi_1 = 0.6$, $\\theta_1 = 0.3$. The last observation is 10 and last period's error was 1.5. Forecast the next value.",
      solution: "### Formula\n$\\hat Y_t = \\phi_0 + \\phi_1Y_{t-1} + \\theta_1\\varepsilon_{t-1}$ (the current error $\\varepsilon_t$ is unknown and left out).\n### Working\n$2 + 0.6(10) + 0.3(1.5) = 2 + 6 + 0.45 = $ **8.45**. (Exercise solution prepared for the website.)",
    },
    {
      title: "Identify the model from ACF and PACF (page 804)",
      level: "Level 2",
      question: "A stationary series shows 2 significant ACF spikes then a cut-off, and 1 significant PACF spike then a cut-off. Which ARMA model? If the original series had needed one difference to become stationary, which ARIMA model?",
      solution: "### Rule\nACF cut-off gives the MA order q; PACF cut-off gives the AR order p.\n### Answer\nq = 2, p = 1 → **ARMA(1, 2)**. With one difference (d = 1) → **ARIMA(1, 1, 2)**.",
    },
    {
      title: "Differencing to remove trend (pages 806–808)",
      level: "Level 1",
      question: "Difference the series 10, 13, 17, 20, 24 once. Is the differenced series closer to stationary? How would you recover the original values?",
      solution: "### Working\n$Z_t = Y_{t+1} - Y_t$: 3, 4, 3, 4.\n### Comment\nThe original climbs steadily (trend). The differences stay around a constant level of about 3.5, so the series is now (close to) stationary: d = 1.\n### Undo it\nAdd the differences back to the starting value: 10, 10 + 3 = 13, 13 + 4 = 17, … (the summation formula on page 807). (Exercise solution prepared for the website.)",
    },
  ],

  theory: [
    {
      title: "Strict vs weak stationarity",
      level: "Level 1",
      question: "Define a strictly stationary process and a weakly (second-order) stationary process. How are they related, and why does forecasting need stationarity?",
      solution: "**Strict (pages 744, 747):** the joint distribution of $(Y_{t_1}, \\dots, Y_{t_k})$ equals that of $(Y_{t_1 + h}, \\dots, Y_{t_k + h})$ for every k, every set of times and every shift h: nothing changes when time is shifted. **Weak, second order (pages 750–751):** only the first two moments are time-invariant: constant mean, constant variance, and covariance/correlation depending only on the lag. **Relation:** strict + finite first two moments ⇒ weak; but a strictly stationary process without finite moments is not weakly stationary, and weak does not imply strict. **Why it matters (page 749):** reliable prediction needs a series with no systematic change (trend, seasonality), only random fluctuation around a stable mean, so the past behaviour carries over to the future.",
    },
    {
      title: "ACF vs PACF",
      level: "Level 1",
      question: "Explain the difference between autocorrelation and partial autocorrelation, and how each is used to choose an ARMA model.",
      solution: "**ACF (pages 763–768):** $\\rho_k$ = correlation between $Y_t$ and $Y_{t-k}$, including indirect effects through the lags in between. **PACF (pages 786–787):** the correlation between $Y_t$ and $Y_{t-k}$ after removing the effect of $Y_{t-1}, \\dots, Y_{t-k+1}$, i.e. the direct link only (stock-price example: yesterday's PACF is the real link after taking out the day before yesterday). At lag 1 they are equal. **Use (pages 803–804, 816):** a sharp cut-off in the ACF after q lags suggests MA(q); a cut-off in the PACF after p lags suggests AR(p); both decaying suggests ARMA. Confirm with AIC/BIC.",
    },
    {
      title: "White noise and how to test for it",
      level: "Level 1",
      question: "What is white noise? Describe two ways to check whether a series is white noise.",
      solution: "**White noise (pages 777–778):** i.i.d. values with mean 0, constant variance $\\sigma^2$ and zero autocorrelation at every lag; named by analogy with white light containing all frequencies equally. **Check 1: ACF bounds (pages 779–781):** about 95% of the sample autocorrelations should lie inside $\\pm 2/\\sqrt{T}$; one large spike outside, or clearly more than 5% outside, means not white noise. **Check 2: Ljung-Box test (page 784):** $H_0$: the series is white noise (no autocorrelation in the group of lags tested) vs $H_1$: serial correlation. p < 0.05 → reject (not white noise); p > 0.05 → white noise. Application: residuals of a good model should pass both checks.",
    },
    {
      title: "The Dickey-Fuller test",
      level: "Level 2",
      question: "Explain the idea of a unit root and set up the Dickey-Fuller test for an AR(1) model. How does the augmented version differ?",
      solution: "In $Y_t = \\mu + \\phi_1Y_{t-1} + \\varepsilon_t$, $\\phi_1 = 1$ (a **unit root**) makes the series a random walk whose level never settles: non-stationary. **DF test (pages 794–795):** $H_0: \\phi_1 = 1$ vs $H_1: \\phi_1 < 1$. Subtracting $Y_{t-1}$: $\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$ with $\\delta = \\phi_1 - 1$, so $H_0: \\delta = 0$ vs $H_1: \\delta < 0$. Statistic $t_{\\hat\\delta} = \\hat\\delta/SE(\\hat\\delta)$ follows the Dickey-Fuller distribution; reject $H_0$ (stationary) if $t_{\\hat\\delta}$ < DF critical value (P ≤ 0.05). **Augmented DF (pages 796–798, 812):** for AR(p), add lagged terms $\\sum \\beta_i Y_{t-i}$ (or lagged differences) to the regression; δ is still tested against the DF distribution, while each $\\beta_i$ is tested with an ordinary t-test. If the unit root is not rejected, difference the series (d = 1) and test again.",
    },
    {
      title: "From AR and MA to ARIMA, SARIMAX and VAR",
      level: "Level 2",
      question: "Write the AR(p), MA(q) and ARMA(p, q) models. Explain what ARIMA(p, d, q) adds, how p, d, q are chosen, and when you would use SARIMA, SARIMAX or VAR instead.",
      solution: "**AR(p) (page 792):** $Y_t = c + \\phi_1Y_{t-1} + \\dots + \\phi_pY_{t-p} + \\varepsilon_t$: depends on past values. **MA(q) (page 800):** $Y_t = w_t + \\theta_1w_{t-1} + \\dots + \\theta_qw_{t-q}$, $w_t$ Gaussian white noise: depends on past shocks. **ARMA(p, q) (pages 801–805):** both; a parsimonious model for a weakly stationary series. **ARIMA (pages 806–809):** adds **I**, differencing d times ($Z_t = Y_{t+1} - Y_t$) to make a trending series stationary before fitting ARMA; forecasts are summed back to the original scale. **Choosing p, d, q (pages 811, 816–817):** d from Dickey-Fuller (difference until stationary); q from the ACF, p from the PACF (extended ACF for mixtures); compare candidates by the lowest AIC/BIC. **Extensions (pages 818–820):** SARIMA when there is seasonality (ARIMA does not handle it); SARIMAX when outside (exogenous) variables also drive the series; VAR/VARMAX when several series influence each other.",
    },
  ],

  quiz: [
    {
      topic: "Stochastic process",
      q: "An observed monthly sales series is best described as…",
      options: ["the stochastic process itself", "one realisation of a stochastic process", "a continuous-time process", "white noise"],
      answer: 1,
      why: "The series is one sample function of the process $\\{Y_t\\}$ (pages 739, 742).",
      wrong: ["The process is the whole family of random variables.", null, "Monthly data have a discrete index set.", "Nothing says it has no autocorrelation."],
    },
    {
      topic: "Stationarity",
      q: "Which property does a second-order (weakly) stationary process NOT need?",
      options: ["Constant mean", "Constant variance", "Covariance depending only on the lag", "The same joint distribution after every time shift"],
      answer: 3,
      why: "An identical joint distribution is strict stationarity; weak stationarity needs only the first two moments (pages 750–751).",
      wrong: ["Required.", "Required.", "Required.", null],
    },
    {
      topic: "Stationarity",
      q: "The two main causes of non-stationarity in practice are…",
      options: ["mean and variance", "trend and seasonality", "AR and MA terms", "outliers and missing values"],
      answer: 1,
      why: "Page 758: trend and seasonality must be removed before fitting a stationary model.",
      wrong: ["These are moments, not causes.", null, "These are model parts.", "Not the causes named in the PDF."],
    },
    {
      topic: "ACF",
      type: "num",
      q: "A series has $\\sum(y_t - \\bar y)(y_{t-1} - \\bar y) = 1394$ and $\\sum(y_t - \\bar y)^2 = 1676$. Find $r_1$ (4 decimals).",
      answer: 0.8317,
      tol: 0.0005,
      why: "$1394/1676 = 0.8317$ (page 771).",
    },
    {
      topic: "ACF",
      q: "$\\rho_0$, the autocorrelation at lag 0, always equals…",
      options: ["0", "1", "$\\sigma^2$", "it depends on the series"],
      answer: 1,
      why: "$\\rho_0 = \\gamma_0/\\gamma_0 = 1$ (page 763).",
      wrong: ["A series is perfectly correlated with itself.", null, "That's $\\gamma_0$, the autocovariance.", "It is always 1."],
    },
    {
      topic: "ACF",
      q: "An ACF with large positive values at small lags that decay slowly suggests…",
      options: ["white noise", "a trend", "an MA(1) process", "a seasonal pattern only"],
      answer: 1,
      why: "Page 774: trend → small-lag autocorrelations large and positive, fading slowly.",
      wrong: ["White noise has all spikes near 0.", null, "MA(1) cuts off after lag 1.", "Seasonality shows spikes at seasonal lags."],
    },
    {
      topic: "White noise",
      type: "num",
      q: "Upper 95% white-noise bound $2/\\sqrt{T}$ for T = 50? (3 decimals)",
      answer: 0.283,
      tol: 0.001,
      why: "$2/\\sqrt{50} = 0.283$. The PDF's “2.8” on page 781 is a slip.",
    },
    {
      topic: "White noise",
      q: "A Ljung-Box test gives p = 0.01. Conclusion?",
      options: ["The series is white noise", "Reject $H_0$: the series has autocorrelation", "The series is stationary", "Fail to reject $H_0$"],
      answer: 1,
      why: "$H_0$ is white noise; p < 0.05 → reject (page 784).",
      wrong: ["That would need p > 0.05.", null, "Ljung-Box tests autocorrelation, not stationarity.", "p is below 0.05."],
    },
    {
      topic: "PACF",
      q: "At lag 1, the PACF…",
      options: ["is always 0", "equals the ACF at lag 1", "equals 1", "is undefined"],
      answer: 1,
      why: "There are no intermediate lags to remove (page 787).",
      wrong: ["No.", null, "Only $\\rho_0 = 1$.", "It is defined."],
    },
    {
      topic: "AR / MA",
      q: "Which plot is used to choose the AR order p?",
      options: ["ACF", "PACF", "Time plot", "Histogram"],
      answer: 1,
      why: "PACF cut-off → AR order; ACF cut-off → MA order (page 804).",
      wrong: ["ACF gives the MA order q.", null, "Shows trend, not the order.", "Not used for order."],
    },
    {
      topic: "AR / MA",
      type: "num",
      q: "ARMA(1, 1): $\\phi_0 = 2$, $\\phi_1 = 0.6$, $\\theta_1 = 0.3$, $Y_{t-1} = 10$, $\\varepsilon_{t-1} = 1.5$. Forecast $\\hat Y_t$?",
      answer: 8.45,
      tol: 0.01,
      why: "$2 + 6 + 0.45 = 8.45$.",
    },
    {
      topic: "Dickey-Fuller",
      q: "In the Dickey-Fuller test, the null hypothesis is…",
      options: ["the series is stationary", "the series has a unit root (non-stationary)", "the series is white noise", "$\\phi_1 < 1$"],
      answer: 1,
      why: "$H_0: \\phi_1 = 1$ ⇔ $\\delta = 0$: unit root (page 794).",
      wrong: ["That's the alternative.", null, "That's Ljung-Box.", "That's $H_1$."],
    },
    {
      topic: "Dickey-Fuller",
      type: "num",
      q: "$\\hat\\delta = -0.45$, $SE(\\hat\\delta) = 0.15$. Compute $t_{\\hat\\delta}$.",
      answer: -3,
      tol: 0.01,
      why: "$-0.45/0.15 = -3.0$; compare with the DF critical value.",
    },
    {
      topic: "ARIMA",
      q: "In ARIMA(p, d, q), d is…",
      options: ["the number of AR terms", "the number of times the series is differenced", "the number of MA terms", "the seasonal period"],
      answer: 1,
      why: "“I” = integrated = differencing to make the series stationary (page 806).",
      wrong: ["That's p.", null, "That's q.", "Seasonal terms belong to SARIMA."],
    },
    {
      topic: "ARIMA",
      q: "You must forecast sales that depend on their own past, on seasons, and on advertising spend. Best choice?",
      options: ["ARIMA", "SARIMA", "SARIMAX", "MA(1)"],
      answer: 2,
      why: "Seasonal + an exogenous driver → SARIMAX (page 819).",
      wrong: ["ARIMA handles no seasonality.", "No exogenous variable.", null, "Far too simple."],
    },
    {
      topic: "ARIMA",
      q: "Among candidate ARIMA models, choose the one with…",
      options: ["the highest AIC", "the lowest AIC/BIC", "the most parameters", "the highest $r_1$"],
      answer: 1,
      why: "Page 817: investigate the models with the lowest AIC or BIC.",
      wrong: ["Lower is better.", null, "More parameters risk overfitting.", "Not a model-selection rule."],
    },
  ],
};
