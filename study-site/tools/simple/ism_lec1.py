import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Descriptive statistics answers three questions about any pile of numbers: **what is typical** (centre), **how spread out** (variability), "
         "and **are there oddballs** (outliers). The lecture's running puzzle: two IPL batsmen, five matches each. Who is better? Who is more "
         "consistent? By the end you can answer both with numbers.")

SECTIONS = [
 SEC(1, "big", "The big picture: the IPL puzzle", [
   T(["Match", "1", "2", "3", "4", "5"], [["Batsman 1", "45", "62", "86", "28", "44"], ["Batsman 2", "34", "78", "12", "135", "64"]],
     caption="Runs scored (lecturer's slide 7)"),
   CARDS(
     CARD("Centre", "One number for “typical”: the **mean**, **median** or **mode**.", tag="Who is better?", example="Batsman 2 averages 64.6 vs 53."),
     CARD("Spread", "How far scores wander from the centre: **range**, **variance**, **standard deviation**, **IQR**.", tag="Who is consistent?", example="Batsman 1's SD ≈ 19.7 vs 42.0.", figure="i1-spread"),
     CARD("Shape & outliers", "Is the data lopsided (**skewed**)? Are any values far from the rest (**outliers**)? A **box plot** shows both.", tag="Any oddballs?", figure="i1-boxanat"),
   ),
 ]),
 SEC(2, "types", "What kind of data do I have?", [
   P("The type of data decides which summaries make sense. Climb the ladder: each level allows everything below it, plus one more thing."),
   T(["Level", "You can…", "Example"],
     [["**Nominal**", "only name / count categories", "Vehicle type, blood group"],
      ["**Ordinal**", "+ put them in order", "Satisfaction: low < medium < high"],
      ["**Interval**", "+ subtract (differences mean something)", "Temperature in °C"],
      ["**Ratio**", "+ divide (a true zero: “twice as much”)", "Runs, income, age"]]),
   FIG("i1-levels"),
   TIP("Quick test", "Can you say “twice as much”? → ratio. Only “more/less”? → ordinal. Only “different”? → nominal."),
 ], "10–19"),
 SEC(3, "centre", "The centre: mean, median, mode", [
   F("Mean", "$$\\bar x = \\frac{\\sum x}{n} \\qquad \\text{(grouped data: } \\bar x = \\frac{\\sum f x}{\\sum f}\\text{)}$$"),
   P("**Median** = the middle value after **sorting** (n odd: position $\\frac{n + 1}{2}$; n even: average the two middle values). **Mode** = the most frequent value."),
   EX("Solved example: the IPL batsmen",
      "Batsman 1: total 265 → mean $= 265/5 = 53$; sorted 28, 44, **45**, 62, 86 → median 45.\n"
      "Batsman 2: total 323 → mean $= 323/5 = 64.6$; sorted 12, 34, **64**, 78, 135 → median 64."),
   ANS("Batsman 2 is better on average (64.6 vs 53)", "Notice Batsman 2's mean is pulled up by the single 135."),
   TIP("Which centre to use?", "- Symmetric data, no outliers → **mean**.\n- Skewed data or outliers (incomes, house prices) → **median**: one billionaire doesn't move it.\n- Categories (most popular car colour) → **mode**."),
   CHK("Incomes: 30, 32, 35, 38, 500 (thousand). Which best describes a typical income?", ["Mean (127)", "Median (35)", "Range", "Mode"], 1,
       "The 500 drags the mean up to 127, far above everyone else. The median (35) is typical."),
 ], "20–29"),
 SEC(4, "shape", "Shape: is the data lopsided?", [
   P("In a **symmetric** distribution, mean = median = mode. If a long tail stretches to the **right** (a few huge values), the mean is dragged right: **mean > median** (positive skew). A long **left** tail gives mean < median (negative skew). **Name the skew after the tail**, not the peak."),
   FIG("i1-skew"),
   F("Shortcuts (moderately skewed data)", "$$3\\,\\text{Median} = \\text{Mode} + 2\\,\\text{Mean} \\qquad \\text{Skewness} = \\frac{3(\\bar x - \\text{Median})}{s}$$"),
   EX("Lecturer's example", "Mean 40, median 42 → Mode $= 3(42) - 2(40) = 46$. Mean < median < mode → **negatively (left) skewed**."),
 ], "30–32"),
 SEC(5, "spread", "Spread: range, variance, standard deviation", [
   P("Two groups can share an average yet behave very differently. **Range** = max − min (quick, but uses only two values). The **standard deviation** measures the *typical distance from the mean*, using every value."),
   F("Variance and SD", "$$s^2 = \\frac{\\sum (x - \\bar x)^2}{n - 1} \\quad \\text{(sample)} \\qquad \\sigma^2 = \\frac{\\sum(x - \\mu)^2}{N} \\quad \\text{(population)} \\qquad SD = \\sqrt{\\text{variance}}$$"),
   P("**Recipe:** (1) find the mean, (2) subtract it from each value, (3) square, (4) add up (= SS), (5) divide by $n - 1$ (sample) or $N$ (population), (6) square root."),
   EX("Solved example (lecturer's slide 46): Group 1",
      "Scores 2, 8, 5, 3, 7, 8, 5, 2, 5; mean = 5.\nDeviations: −3, 3, 0, −2, 2, 3, 0, −3, 0 → squares sum to $SS = 44$.\n$s = \\sqrt{44/8} = \\sqrt{5.5} = 2.345$."),
   ANS("s = 2.345", "Group 2 (1, 15, 5, 5, 6, 3, 5, 2, 3) has the **same mean 5** but $s = 4.093$: almost double the spread."),
   EX("Back to the IPL puzzle", "Treating each batsman's 5 matches as the whole population (as the slides do): variance **388 vs 1767.84**, SD **19.7 vs 42.0**. **Batsman 1 is far more consistent**; Batsman 2 is a boom-or-bust player."),
   FIG("i1-ipl"),
   WARN("n or n − 1?", "Sample → divide by $n - 1$ (it corrects for estimating the mean from the same data). Whole population → divide by $N$. Say which you used."),
 ], "33–56"),
 SEC(6, "box", "Quartiles, IQR, box plots and outliers", [
   P("Sort the data and cut it into four equal parts. $Q_1$ = the 25% mark, $Q_2$ = median, $Q_3$ = the 75% mark. The **IQR** $= Q_3 - Q_1$ is the spread of the **middle half**: it ignores extremes."),
   F("Outlier fences", "$$\\text{Position of } Q_1 = \\frac{n + 1}{4}, \\quad Q_3 = \\frac{3(n + 1)}{4} \\qquad \\text{fences: } Q_1 - 1.5\\,IQR \\text{ and } Q_3 + 1.5\\,IQR$$ Anything outside the fences is an **outlier**."),
   EX("Lecturer's example (slide 58)", "11, 12, 13, 16, 16, 17, 17, 18, 21 ($n = 9$). $Q_1$ at position 2.5 → 12.5; median 16; $Q_3$ at position 7.5 → 17.5. IQR $= 5$; fences 5 and 25 → **no outliers**."),
   FIG("i1-boxanat"),
   CHK("Q₁ = 20, Q₃ = 30. Which value is an outlier?", ["12", "40", "46", "25"], 2, "IQR = 10 → fences $20 - 15 = 5$ and $30 + 15 = 45$. Only 46 lies outside them."),
 ], "57–63"),
 SEC(7, "remember", "What to remember for your exam", [
   REM("- **Data type ladder:** nominal → ordinal → interval → ratio.\n"
       "- **Centre:** mean (symmetric), median (skewed/outliers), mode (categories).\n"
       "- **Skew is named after the tail:** right tail → mean > median.\n"
       "- **SD recipe:** mean → deviations → square → sum → ÷ (n − 1) → √.\n"
       "- **Box plot:** Q₁ at (n+1)/4, Q₃ at 3(n+1)/4; outliers beyond Q₁ − 1.5 IQR or Q₃ + 1.5 IQR."),
 ]),
]

write("data/ism/lec1.js", INTRO, SECTIONS)
