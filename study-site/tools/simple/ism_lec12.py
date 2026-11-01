import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("A **time series** is one number recorded again and again over time: monthly sales, yearly crop output, quarterly GDP. "
         "The goal is to **forecast** the next values. Think of it like weather: there is a long-run climate (trend), a yearly rhythm (seasons), "
         "slow irregular waves (cycles) and day-to-day surprises (noise). This lecture shows how to separate those pieces and three families of forecasting tools: "
         "**trend lines**, **smoothing** (moving averages, exponential smoothing) and **Holt / Holt-Winters** for trends and seasons. All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Break it into parts", "Every series = **T**rend + **S**easonal + **C**yclical + **I**rregular (or their product).", tag="Understand", example="House sales: rising trend, summer peaks", figure="i12-comp"),
     CARD("Smooth the noise", "Average neighbouring values (moving average) or blend new data with the old forecast (exponential smoothing).", tag="Forecast flat series", example="3-year MA forecast for 2005 = 26.33", figure="i12-ma"),
     CARD("Follow trend and seasons", "**Holt** adds a running trend; **Holt-Winters** also adds a seasonal factor for each month or quarter.", tag="Forecast trending series", example="GDP forecast for 2021 = 2363", figure="i12-holt"),
   ),
 ]),
 SEC(2, "parts", "The four ingredients of a time series", [
   T(["Ingredient", "In plain words", "Example"],
     [["**Trend**", "The long-run direction over several years", "India's population keeps rising"],
      ["**Seasonal**", "A rhythm that repeats every year (or week) on the calendar", "AC sales peak every summer"],
      ["**Cyclical**", "Long waves of boom and slump, with no fixed length (2+ years)", "Business cycles"],
      ["**Irregular**", "Random, unpredictable shocks", "A flood, a sudden policy change"]]),
   FIG("i12-comp"),
   F("Putting them together (slide 12)", "$$\\text{Additive: } y_t = T_t + C_t + S_t + I_t \\qquad \\text{Multiplicative: } y_t = T_t \\times C_t \\times S_t \\times I_t$$ **Additive** if the seasonal swings stay the same size; **multiplicative** if they grow with the level."),
   CHK("Sales jump every Diwali, every year. Which component?", ["Trend", "Seasonal", "Cyclical", "Irregular"], 1, "A fixed, calendar-based repeat within a year is seasonal."),
 ], "3–12"),
 SEC(3, "trend", "Drawing a trend line through the years", [
   P("**The trick: renumber the years so they are centred on zero.** Then the least-squares formulas from Lecture 11 become very short, because $\\sum x = 0$."),
   F("Coded time (slide 15)", "- **Odd number of years:** middle year = 0, so x = −2, −1, 0, 1, 2.\n- **Even number of years:** x = −5, −3, −1, 1, 3, 5 (steps of 2, so no zero).\n$$b = \\frac{\\sum xY}{\\sum x^2} \\qquad a = \\frac{\\sum Y}{n} \\qquad \\hat Y = a + bx$$"),
   EX("Lecturer's slide 16: crops 2016–2020",
      "Y = 35, 55, 79, 80, 40. Middle year 2018 → x = −2, −1, 0, 1, 2.\n"
      "$\\sum xY = -70 - 55 + 0 + 80 + 80 = 35$, $\\sum x^2 = 10$, $\\sum Y = 289$.\n"
      "$b = 35/10 = 3.5$, $a = 289/5 = 57.8$. For 2021, x = 3: $57.8 + 3.5 \\times 3$."),
   ANS("2021 forecast: 68.3 tons"),
   EX("Lecturer's slide 17: sales 2016–2021 (even)", "x = −5, −3, −1, 1, 3, 5; $\\sum xY = 18$, $\\sum x^2 = 70$, $\\sum Y = 166$. $b = 0.2571$, $a = 166/6 = 27.67$. For 2022, x = 7 → 29.47. (The slide's “12111/6” is a typo: 12111 is the sum of the years, not the sales.)"),
   TIP("Curved trend?", "Add an $x^2$ term: $Y = a + bx + cx^2$, with three normal equations (slide 18). But be careful forecasting with curves: our website check on the crop data gives a 2021 forecast of −3 tons!"),
 ], "13–18"),
 SEC(4, "ma", "Moving averages: smoothing by averaging neighbours", [
   P("Neighbouring values are usually similar, so averaging them cancels random noise. Take k values, average them, slide one step, repeat. **The last average is the forecast for the next period.**"),
   EX("Lecturer's slides 20–21: production 1995–2004",
      "Data: 21, 22, 23, 25, 24, 22, 25, 26, 27, 26.\n"
      "First 3-year average: $(21 + 22 + 23)/3 = 22.00$, placed at the **middle year, 1996**.\n"
      "Slide on: 23.33, 24.00, 23.67, 23.67, 24.33, 26.00, 26.33.\n"
      "Forecast 2005 = last average $(26 + 27 + 26)/3$."),
   ANS("2005 forecast: 26.33"),
   FIG("i12-ma"),
   WARN("Where does each average go?", "Put it at the **middle** of its window (slide 20's table puts 22.00 at 1995, one row too early). For an **even** window like 4 years, the average lands between two years, so average neighbouring pairs to **centre** it: $(22.75 + 23.50)/2 = 23.13$ at 1997 (slide 22)."),
   CHK("Values 25, 24, 22. Their 3-period moving average?", ["23.00", "23.67", "24.00", "71"], 1, "$(25 + 24 + 22)/3 = 71/3 = 23.67$."),
 ], "19–23"),
 SEC(5, "es", "Exponential smoothing: blend new data with the old forecast", [
   P("**Analogy.** Your forecast is your current opinion. Each period you see the actual value and move your opinion **part of the way** towards it. α (alpha) says how far you move: α = 0.3 means 30% of the way."),
   F("One-line update (slides 24, 28)", "$$F_{t+1} = \\alpha Y_t + (1 - \\alpha)F_t \\qquad \\text{start with } F_2 = Y_1$$\n- α near 1: jumpy, follows the latest value (α = 1 is the **naïve** forecast).\n- α near 0: calm and smooth, slow to react."),
   EX("Lecturer's slide 25: α = 0.3",
      "Start $F_{1996} = 21$.\n"
      "$F_{1997} = 0.3(22) + 0.7(21) = 21.3$\n"
      "$F_{1998} = 0.3(23) + 0.7(21.3) = 21.81$\n"
      "$F_{1999} = 0.3(25) + 0.7(21.81) = 22.77$ … and so on to $F_{2004} = 25.05$.\n"
      "$F_{2005} = 0.3(26) + 0.7(25.05)$"),
   ANS("2005 forecast: 25.34"),
   TIP("Why “exponential”?", "Today's value gets weight α, yesterday's α(1 − α), the day before α(1 − α)², …: weights shrink by the same factor each step back, exponentially."),
   CHK("$F_t = 50$, $Y_t = 60$, α = 0.2. $F_{t+1}$?", ["52", "58", "55", "60"], 0, "$0.2(60) + 0.8(50) = 12 + 40 = 52$."),
 ], "24–29"),
 SEC(6, "errors", "Scoring forecasts: MSE, MAD, MAPE, LAD", [
   P("Error = **actual − forecast**, written $\\Delta_t$ (delta). Smaller errors = better method. Four ways to summarise them:"),
   T(["Measure", "Formula", "In words"],
     [["MSE", "$\\frac{\\sum\\Delta^2}{n}$", "average **squared** error (big misses hurt a lot)"],
      ["MAD", "$\\frac{\\sum|\\Delta|}{n}$", "average size of the miss, in the data's units"],
      ["MAPE", "$\\frac{100}{n}\\sum\\frac{|\\Delta|}{Y}$", "average miss as a **percentage**"],
      ["LAD", "$\\max|\\Delta|$", "the single **worst** miss"]]),
   EX("Lecturer's slides 30–34: which α is best?", "Capacity utilization for 15 quarters, smoothed three ways:\nα = 0.2 → MSE 3.848; α = 0.4 → MSE 2.395; α = 0.7 → MSE **1.579**."),
   ANS("α = 0.7 wins", "Its forecast for Q4/2020 is 80.74. This series turns down then up, so a quick-reacting forecast does best."),
   FIG("i12-exp"),
   CHK("Errors 2, −1, −3, 2. MAD?", ["0", "2", "4.5", "8"], 1, "$(2 + 1 + 3 + 2)/4 = 2$. (MSE would be 18/4 = 4.5.)"),
 ], "26–35"),
 SEC(7, "holt", "Holt: smoothing that follows a trend", [
   P("On a rising series, simple smoothing is always **behind**, because it blends in older, lower values. Holt keeps **two** running numbers: the **level** L (where we are now) and the **trend** T (how much we climb per period)."),
   F("Holt's three lines (slide 44)", "$$L_t = \\alpha Y_t + (1 - \\alpha)(L_{t-1} + T_{t-1})$$ $$T_t = \\beta(L_t - L_{t-1}) + (1 - \\beta)T_{t-1}$$ $$F_{t+1} = L_t + T_t, \\qquad F_{t+k} = L_t + kT_t$$ **Level:** blend today's actual with where we expected to be. **Trend:** blend the latest climb with the old trend. **Forecast:** level + trend."),
   EX("Lecturer's slides 53–57: GDP, α = 0.8, β = 0.4",
      "Start $L = 1451$, $T = 0$.\n"
      "**2001** (1499): $L = 0.8(1499) + 0.2(1451) = 1489$; $T = 0.4(1489 - 1451) = 15$ → forecast 2002 = 1504.\n"
      "**2002** (1686): $L = 0.8(1686) + 0.2(1489 + 15) = 1650$; $T = 0.4(161) + 0.6(15) = 73$ → forecast 2003 = 1723.\n"
      "… GDP falls after 2015, so the trend turns negative. **2020:** $L = 2412$, $T = -49$."),
   ANS("2021 forecast: 2412 − 49 = 2363"),
   FIG("i12-holt"),
   CHK("L = 2412, T = −49. Forecast 2 periods ahead?", ["2363", "2314", "2461", "2412"], 1, "$L + 2T = 2412 - 98$."),
 ], "42–57"),
 SEC(8, "hw", "Holt-Winters: trend plus seasons", [
   P("Now add a **seasonal factor** for each quarter (or month): 1.14 means “this quarter usually runs 14% above normal”, 0.90 means 10% below. Holt-Winters removes the season before updating the level, then puts it back into the forecast."),
   F("Start-up and forecast (slides 58–60)", "**Factors from year 1:** $S_i = Y_i \\div (\\text{average of year 1})$.\n**Start:** $L_{M+1} = Y_{M+1}/S_1$, $T_{M+1} = Y_{M+1}/S_1 - Y_M/S_M$.\n**Forecast:** $(L_t + kT_t) \\times$ the factor of the **same season last year**."),
   EX("Lecturer's slides 61–62: quarterly demand",
      "Year 1: 362, 385, 432, 341 (average 380). Factors: 0.953, 1.013, **1.137** (Q3 is the peak), 0.897.\n"
      "Next Q1 = 382: $L_5 = 382/0.953 = 400.99$; $T_5 = 400.99 - 341/0.897 = 20.99$.\n"
      "Forecast Q2: $(400.99 + 20.99) \\times 1.013 = 427.54$ (actual 409)."),
   WARN("Slide 62's last four forecasts use the wrong quarters", "They multiply by the factors from two quarters earlier. Matching each quarter to its own factor gives **731.97, 795.93, 907.82, 718.56** for Q1–Q4, with the Q3 peak where it belongs."),
   CHK("The Q3 seasonal factor is 1.14 and level + trend = 800. Q3 forecast?", ["800", "912", "702", "1140"], 1, "$800 \\times 1.14 = 912$."),
 ], "58–68"),
 SEC(9, "test", "Test your understanding", [
   CHK("Which method suits a series with **no** trend and **no** seasons?", ["Holt-Winters", "Simple exponential smoothing", "Quadratic trend", "Holt"], 1, "Smoothing methods are for flat (stationary) series (slides 14, 19)."),
   CHK("A stationary series is one whose behaviour…", ["grows over time", "doesn't change when you shift the time origin", "repeats every year", "is always zero"], 1, "Slide 69."),
   CHK("Three methods give MSE 4.2, 2.9 and 3.5. Choose…", ["4.2", "2.9", "3.5", "any"], 1, "Smallest error wins."),
 ]),
 SEC(10, "remember", "What to remember for your exam", [
   REM("- **T-S-C-I:** Trend (long run), Seasonal (calendar), Cyclical (irregular long waves), Irregular (random).\n"
       "- **Trend line:** centre the years (x sums to 0), $b = \\sum xY/\\sum x^2$, $a = \\bar Y$.\n"
       "- **Moving average:** average k neighbours, put it in the middle; last MA = next forecast.\n"
       "- **Exponential smoothing:** $F_{t+1} = \\alpha Y + (1 - \\alpha)F$, start $F_2 = Y_1$.\n"
       "- **Errors:** actual − forecast; MSE, MAD, MAPE, LAD; smallest wins.\n"
       "- **Holt:** level → trend → forecast $L + kT$. **Holt-Winters:** × the same season's factor.\n"
       "- Memory hook: **“Average to calm it, add a trend to chase it, add seasons to dance with it.”**"),
 ]),
]

write("data/ism/lec12.js", INTRO, SECTIONS)
