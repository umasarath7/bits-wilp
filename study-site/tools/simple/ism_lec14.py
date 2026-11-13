import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Lecture 12–13 forecast a series with trend lines and smoothing. Session 14 asks two deeper questions. "
         "**Is the series stable over time (stationary)?** And **how much does today depend on yesterday (autocorrelation)?** "
         "The answers lead to the classic forecasting models: **AR** (today depends on past values), **MA** (today depends on past surprises), "
         "**ARMA** (both), and **ARIMA** (ARMA after removing trend by differencing). Page numbers are from your consolidated exam PDF.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Is it stable?", "A **stationary** series has the same average, the same wobble and the same neighbour-link at every point in time.", tag="Check first", example="Trend or seasons ⇒ not stationary", figure="i14-stat"),
     CARD("Does it remember?", "**Autocorrelation** $r_k$ = how strongly the series is linked to itself k steps back.", tag="Measure", example="15-value series: $r_1 = 0.83$", figure="i14-acf"),
     CARD("Model the memory", "**AR** remembers past values, **MA** remembers past shocks, **ARIMA** first removes trend by differencing.", tag="Forecast", example="ACF → q, PACF → p", figure="i14-pattern"),
   ),
 ]),
 SEC(2, "process", "A time series is one printout of a random machine", [
   P("Think of a **machine** that prints a whole wiggly line each time you run it. The machine is the **stochastic process** $\\{Y_t\\}$. The one line you actually observed is a **realisation**: your time series. We study the line to learn about the machine."),
   T(["Time points are…", "Process type", "Example"],
     [["a continuous range, $[0, \\infty)$", "Continuous-time", "A temperature sensor"],
      ["whole numbers 0, 1, 2, …", "Discrete-time", "Monthly sales"]]),
   CHK("Quarterly GDP figures form a…", ["continuous-time process", "discrete-time process", "white-noise process", "stationary process, always"], 1, "Quarters are whole-number time points (page 739)."),
 ], "737–743"),
 SEC(3, "stationary", "Stationary: the series looks the same at any time", [
   P("**Test in your head:** cut a window out of the series. If you couldn't tell *when* it was taken, the series is stationary. A trend gives the date away (later = higher); seasons give the month away."),
   FIG("i14-stat"),
   T(["", "Strict", "Weak (second order)"],
     [["Needs", "The whole distribution unchanged by a time shift", "Only mean and variance constant; covariance depends only on the gap"],
      ["Used in practice?", "Rarely: too strong to check", "Yes"]]),
   REM("**Stationary = same mean, same spread, same neighbour-link at all times.** Trend and seasonality are the two usual reasons a series is not stationary, so remove them first (page 758)."),
 ], "744–758"),
 SEC(4, "acf", "Autocorrelation: how much the series remembers", [
   P("Slide the series back one step and line it up with itself. If big values sit next to big values, the lag-1 autocorrelation $r_1$ is large. Do it for 2 steps, 3 steps, … and draw the bars: that is the **ACF** (correlogram)."),
   F("Sample autocorrelation (page 766)", "$$r_k = \\frac{\\text{sum of } (y_t - \\bar y)(y_{t-k} - \\bar y)}{\\text{sum of all } (y_t - \\bar y)^2}$$ Same overall mean and same bottom line for every k."),
   EX("PDF pages 770–771: 22, 24, 25, 25, 28, 29, 34, 37, 40, 44, 51, 48, 47, 50, 51",
      "Mean = 37. Deviations −15, −13, −12, …, 14. Bottom line: sum of squares = 1676.\n"
      "Top line for lag 1: (−15)(−13) + (−13)(−12) + … + (13)(14) = 1394."),
   ANS("$r_1 = 1394/1676 = 0.8317$", "then $r_2 = 0.6563$, $r_3 = 0.4911$, … slowly fading"),
   FIG("i14-acf"),
   T(["ACF shape", "Means"],
     [["Big, positive, **slowly fading**", "Trend"],
      ["Spikes at 4, 8, 12 (or 12, 24)", "Quarterly (or monthly) seasons"],
      ["All small, inside the bounds", "White noise"]]),
   CHK("An ACF starts at 0.87 and falls slowly: 0.77, 0.67, 0.59, … The series most likely has…", ["no pattern", "a trend", "a 4-quarter season", "a unit root of 0"], 1, "Large positive small-lag values that fade slowly signal a trend (page 774)."),
 ], "759–776"),
 SEC(5, "noise", "White noise: pure static", [
   P("**White noise** is like radio static: mean 0, steady volume, and no pattern at all. Today tells you nothing about tomorrow. After a good model, what's left over (the residuals) should be white noise."),
   F("The 95% fence (page 779)", "$$\\pm\\frac{2}{\\sqrt{T}}$$ About 95% of a white-noise ACF's bars stay inside this fence. A big bar outside ⇒ there is still a pattern to model."),
   WARN("The PDF's arithmetic slip (pages 781–782)", "It says $2/\\sqrt{50} = 2.8$. It is **0.283**. And $2/\\sqrt{200} = $ **0.141**, not 2.8. A correlation can never be bigger than 1, so a fence at 2.8 would be meaningless."),
   F("Ljung-Box test (page 784)", "$H_0$: white noise. **p < 0.05 ⇒ reject: there is autocorrelation.** p > 0.05 ⇒ treat as white noise."),
   CHK("T = 25, so the fence is ±0.4. The ACF bars are −0.21, 0.09, −0.05, 0.04, −0.02, 0.30, −0.03. Verdict?", ["Not white noise", "Consistent with white noise", "Has a trend", "Needs differencing"], 1, "Every bar is inside ±0.4 (the sales series, pages 783, 793)."),
 ], "777–784"),
 SEC(6, "pacf", "PACF: the direct link, middle-men removed", [
   P("Today and the day before yesterday may look linked only because both are linked to **yesterday**. The **partial** autocorrelation takes yesterday's influence out and keeps just the **direct** link (page 786). At lag 1 there is no middle-man, so **PACF(1) = ACF(1)**."),
   REM("**ACF = total link. PACF = direct link.**"),
 ], "786–790"),
 SEC(7, "models", "AR, MA, ARMA: three ways to remember the past", [
   T(["Model", "Today depends on…", "Formula", "Order read from"],
     [["**AR(p)**", "the last p **values**", "$Y_t = c + \\phi_1Y_{t-1} + \\dots + \\phi_pY_{t-p} + \\varepsilon_t$", "PACF cut-off"],
      ["**MA(q)**", "the last q **surprises** (errors)", "$Y_t = w_t + \\theta_1w_{t-1} + \\dots + \\theta_qw_{t-q}$", "ACF cut-off"],
      ["**ARMA(p, q)**", "both", "AR terms + MA terms", "both plots"]]),
   FIG("i14-pattern"),
   EX("PDF page 793: AR(1) on the sales series", "Fitted line: $\\hat Y_t = 8.502 - 0.486\\,Y_{t-1}$. Last value 5.8 → next = $8.502 - 0.486 \\times 5.8$."),
   ANS("Forecast ≈ 5.683", "negative coefficient ⇒ the series zig-zags (exercise solution prepared for the website)"),
   EX("ARMA(1, 1) forecast", "$\\hat Y_t = \\phi_0 + \\phi_1Y_{t-1} + \\theta_1\\varepsilon_{t-1}$ with 2, 0.6, 0.3, last value 10, last error 1.5: $2 + 6 + 0.45$."),
   ANS("8.45"),
   TIP("Memory hook", "“**P**ACF gives **p**.” The other plot, ACF, gives q. Page 804: ACF 2 spikes, PACF 1 spike ⇒ ARMA(1, 2)."),
   CHK("ACF cuts off after 1 lag; PACF fades slowly. Model?", ["AR(1)", "MA(1)", "ARMA(2, 2)", "White noise"], 1, "ACF cut-off gives the MA order: q = 1."),
 ], "791–805"),
 SEC(8, "df", "Dickey-Fuller: is there a unit root?", [
   P("In $Y_t = \\mu + \\phi_1Y_{t-1} + \\varepsilon_t$, if $\\phi_1 = 1$ each value is just the last one plus a shock: a **random walk**, like a drunkard wandering off and never coming home. That is a **unit root**, and it is non-stationary."),
   F("The trick (page 795)", "Subtract $Y_{t-1}$ from both sides: $\\Delta Y_t = \\mu + \\delta Y_{t-1} + \\varepsilon_t$ with $\\delta = \\phi_1 - 1$.\n- $H_0$: δ = 0 (unit root, **non-stationary**)\n- $H_1$: δ < 0 (stationary)\n- $t = \\hat\\delta/SE(\\hat\\delta)$; **reject $H_0$ if t is below the DF critical value**."),
   EX("Practice", "$\\hat\\delta = -0.45$, SE = 0.15 → t = −3.0. DF critical value −2.89."),
   ANS("−3.0 < −2.89 ⇒ reject $H_0$ ⇒ stationary", "exercise prepared for the website"),
   REM("**In Dickey-Fuller, $H_0$ = the bad news (unit root).** You need strong evidence (a very negative t) to call the series stationary."),
 ], "794–798"),
 SEC(9, "arima", "ARIMA: difference first, then ARMA", [
   P("A trending series is like a staircase. Look at the **step heights** instead of the floor levels and you get a flat row of numbers: that's **differencing**. Fit ARMA to the step heights, then add them back up to forecast the stairs."),
   EX("Differencing", "Levels 10, 13, 17, 20, 24 (climbing) → differences 3, 4, 3, 4 (flat)."),
   ANS("One difference: d = 1"),
   T(["Letter", "Means", "Order"],
     [["AR", "past values", "p"], ["I", "differencing (Integrated)", "d"], ["MA", "past errors", "q"]]),
   T(["Need", "Use"],
     [["Seasons", "**S**ARIMA"], ["Seasons + outside drivers (price, ads)", "SARIMA**X**"], ["Several series together", "**V**AR / VARMAX"]]),
   TIP("Choosing between models", "Fit a few candidates and keep the one with the **lowest AIC or BIC** (page 817)."),
   CHK("ARIMA(2, 1, 0) means…", ["2 differences, 1 AR term", "AR(2) after one difference, no MA", "MA(2) after one difference", "seasonal model"], 1, "p = 2 AR terms, d = 1 difference, q = 0 MA terms."),
 ], "806–820"),
]

write("data/ism/lec14.js", INTRO, SECTIONS)
