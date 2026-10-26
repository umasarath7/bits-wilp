// ISM — Searchable formula & concept index (for the open-book comprehensive).
// Each row: [Topic, Formula, Conditions / when to use, Typical question wording, Worked example (lecture · slides)]

const ROWS = [
  // ---- Lecture 1
  ["Mean (ungrouped)", "$\\bar x = \\frac{\\sum x}{n}$", "Interval/ratio data", "“average”, “mean time”", "Get-ready times → 39.6 (L1 · 22)"],
  ["Mean (grouped)", "$\\bar Y = \\frac{\\sum fY}{\\sum f}$", "Frequency table", "“frequency”, “hours (f)”", "TV hours → 1.98 (L1 · 23)"],
  ["Median", "position $\\frac{n+1}{2}$ of sorted data; average the two middles if n is even", "Skewed data, outliers", "“middle value”, “50th percentile”", "Funds → 22.4; times → 39.5 (L1 · 29)"],
  ["Mode", "most frequent value", "Nominal data; may not be unique", "“most common”", "Server failures → 3 (L1 · 26)"],
  ["Empirical relation", "$3\\,\\text{Median} = \\text{Mode} + 2\\,\\text{Mean}$", "Moderately skewed data", "“estimate the mode”", "Mean 40, median 42 → mode 46 (L1 · 32)"],
  ["Coefficient of skewness", "$\\frac{\\bar X - \\text{Mode}}{s}$ or $\\frac{3(\\bar X - \\text{Median})}{s}$", "Sign gives direction of skew", "“skewness”, “shape”", "Practice Q4 → −1.34 (L1 · 32, 68)"],
  ["Range", "$\\max - \\min$", "Quick but crude", "“range”", "7,2,7,6,5,6,2 → 5 (L1 · 38)"],
  ["Population variance / SD", "$\\sigma^2 = \\frac{\\sum(x-\\mu)^2}{N}$", "Whole population", "“population”, all data", "IPL 388, 1767.84 (L1 · 55)"],
  ["Sample variance / SD", "$s^2 = \\frac{\\sum(x-\\bar x)^2}{n-1}$, df = $n - 1$", "Sample estimating a population", "“sample”, “estimate”", "Groups → 2.345, 4.093 (L1 · 46–47)"],
  ["Quartiles", "$Q_1$ at $\\frac{n+1}{4}$, $Q_3$ at $\\frac{3(n+1)}{4}$ (interpolate)", "Sorted data", "“quartiles”, “five-number summary”", "11…21 → 12.5, 17.5 (L1 · 58)"],
  ["IQR & outlier fences", "$\\text{IQR} = Q_3 - Q_1$; fences $Q_1 - 1.5$ IQR, $Q_3 + 1.5$ IQR (major: 3 IQR)", "Robust to extremes", "“outliers”, “box plot”", "Practice Q4: 45, 48 outliers (L1 · 61, 68)"],
  ["Levels of measurement", "Nominal < Ordinal < Interval < Ratio", "Ratio has a true zero; N/O nonparametric", "“type of variable”", "Slide 19 survey (L1 · 11–19)"],
  // ---- Lecture 2
  ["Classical probability", "$\\frac{\\text{favourable}}{\\text{total}}$", "Equally likely outcomes", "“fair die”, “at random”", "Two dice sums (L2 · 24–27)"],
  ["Empirical probability", "$\\frac{\\text{times occurred}}{\\text{observations}}$", "Past data; law of large numbers", "“based on records”", "(L2 · 16)"],
  ["Axioms", "$P(S) = 1$; $0 \\le P \\le 1$; disjoint → add", "Check a probability assignment", "“permissible?”", "Example 1 (L2 · 17, 23)"],
  ["Complement", "$P(A) = 1 - P(A^c)$", "“at least one”, “neither”", "“at least”, “not”", "Computers 14/15 (L2 · 40)"],
  ["Addition rule", "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$", "Any two events (drop last term if ME)", "“or”, “at least one of”", "Exams → 14/45; investors 35% (L2 · 28–31)"],
  ["Independence test", "$P(A \\cap B) = P(A)P(B)$", "Must be given or tested", "“independent?”", "Dice max/min → dependent (L2 · 35)"],
  ["Combinations", "$^nC_r = \\frac{n!}{r!(n-r)!}$; permutations $\\frac{N!}{(N-n)!}$", "Random selection, order ignored / matters", "“committee”, “chosen at random”", "Majority women 5/33 (L2 · 41; L3 · 49)"],
  // ---- Lecture 3
  ["Conditional probability", "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$", "$P(B) > 0$", "“given that”, “if … then”", "Loan table 0.85 / 0.72 (L3 · 14–15)"],
  ["Multiplication rule", "$P(A \\cap B) = P(A)P(B \\mid A)$; chains for 3+", "Stages, without replacement", "“first … then”", "Two queens 0.0045 (L3 · 9, 55)"],
  ["Total probability", "$P(B) = \\sum P(A_i)P(B \\mid A_i)$", "$A_i$ mutually exclusive & exhaustive", "“overall”, “a randomly chosen …”", "Gas station 0.455; forest 0.36 (L3 · 30–47)"],
  // ---- Lecture 4
  ["Bayes' theorem", "$P(E_i \\mid A) = \\frac{P(E_i)P(A \\mid E_i)}{\\sum_j P(E_j)P(A \\mid E_j)}$", "Reverse a conditional", "“found defective — which machine?”", "Bolts 0.362; flu 0.431 (L4 · 4–10, 54)"],
  ["MAP / ML hypothesis", "$h_{MAP} = \\arg\\max P(D \\mid h)P(h)$; equal priors → $h_{ML} = \\arg\\max P(D \\mid h)$", "Choosing a class", "“most probable hypothesis”", "(L4 · 18)"],
  ["Naive Bayes", "$P(c \\mid x) \\propto P(c)\\prod_j P(x_j \\mid c)$", "Features conditionally independent given class", "“classify the new instance”", "Tennis → Yes; species → S2 (L4 · 23–29)"],
  ["Laplace smoothing", "$P(t \\mid c) = \\frac{N_{tc} + 1}{N_c + T}$", "Any zero count", "“zero probability”, text classification", "Sports text; movie → Negative (L4 · 33–42)"],
  // ---- Lecture 5
  ["pmf conditions", "$f(x) \\ge 0$, $\\sum f(x) = 1$", "Discrete RV", "“find k”, “valid?”", "$k = 1/25$ (L5 · 10, 26)"],
  ["Expected value (discrete)", "$E(X) = \\sum x f(x)$", "Discrete RV", "“expected”, “on average”", "KPN 1.2 TVs (L5 · 13, 21)"],
  ["Variance (discrete)", "$\\text{Var}(X) = E(X^2) - [E(X)]^2$", "Discrete RV", "“variance of X”", "KPN 1.66 (L5 · 15, 22)"],
  ["Rules of E and Var", "E(aX + b) = aE(X) + b; V(aX + b) = $a^2 V(X)$; V(aX + bY) = $a^2 V(X) + b^2 V(Y)$ if independent", "Linear transforms", "“profit = 500X + 200”", "(L5 · 14, 16)"],
  ["CDF", "$F(x) = P(X \\le x)$; continuous $F(x) = \\int_{-\\infty}^x f$, $f = F'$", "Any RV", "“distribution function”", "Dice CDF; y/4 (L5 · 23, 40)"],
  ["pdf conditions & probability", "$f \\ge 0$, $\\int f = 1$, $P(a<X<b) = \\int_a^b f$", "Continuous RV; $P(X = a) = 0$", "“density”, “between”", "2e^(−2x): 0.133 (L5 · 32, 36)"],
  ["Mean/variance (continuous)", "$\\mu = \\int x f\\,dx$, $\\sigma^2 = \\int x^2 f\\,dx - \\mu^2$", "Continuous RV", "“mean of the density”", "$\\mu = 1/2$, $\\sigma^2 = 1/4$ (L5 · 34, 38)"],
  ["Marginals", "$g(x) = \\sum_y f(x,y)$ or $\\int f\\,dy$", "Joint distribution", "“marginal”", "Census table $p(x = 1)$ = .19 (L5 · 50, 52)"],
  ["Independent RVs", "$f(x, y) = g(x)h(y)$ for all x, y", "Joint distribution", "“are X and Y independent?”", "e^(−(x+y)) yes; x + y no (L5 · 53, 69)"],
  // ---- Lecture 6
  ["Bernoulli", "$p^x q^{1-x}$; mean p, variance pq", "One yes/no trial", "“single trial”", "Basketball 0.4 (L6 · 6–8)"],
  ["Binomial", "$\\binom{n}{x}p^xq^{n-x}$; mean np, variance npq", "Fixed n, independent, constant p, two outcomes", "“out of n”, “exactly / at least”", "Water 0.251; MCQ 45/512 (L6 · 10–23)"],
  ["Poisson", "$\\frac{e^{-\\lambda}\\lambda^x}{x!}$; mean = variance = $\\lambda$", "Rare events per interval (rescale $\\lambda$)", "“per minute”, “on average … per”", "Switchboard 0.715 (L6 · 26–36)"],
  ["Poisson ≈ binomial", "$\\lambda$ = np", "$n \\ge 100$, np ≤ 10", "“use the Poisson approximation”", "Bindery 0.084 vs 0.081 (L6 · 32–34)"],
  ["Normal & standardising", "$z = \\frac{x - \\mu}{\\sigma}$; F(−z) = $1 - F(z)$", "Measured, bell-shaped", "“normally distributed with mean … SD …”", "Test 70–80 → 0.7888 (L6 · 49–57)"],
  ["68–95–99.7 rule", "$\\mu \\pm \\sigma$: 68%, ± $2 \\sigma$: 95%, ± $3 \\sigma$: 99.7%", "Normal", "“approximately what %”", "(L6 · 42–48)"],
  ["Normal ≈ binomial", "$\\mu$ = np, $\\sigma$ = √(npq), ±0.5 continuity correction", "np ≥ 15 and nq ≥ 15", "“use the normal approximation”", "College 0.2709 (L6 · 59–63)"],
  // ---- Lecture 7
  ["Stratified allocation", "$n_h = n \\frac{N_h}{N}$", "Heterogeneous population", "“proportional allocation”", "333, 1000, 167 (L7 · 14)"],
  ["CLT / z for a mean", "$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$; $\\sigma_{\\bar x} = \\sigma/\\sqrt n$", "$n \\ge 30$, or normal population", "“sample of n … mean between”", "Vehicles 0.9210 (L7 · 32–36)"],
  ["Finite population correction", "SE × $\\sqrt{\\frac{N-n}{N-1}}$", "$n/N \\ge 0.05$", "“of the company's 350 employees”", "0.9808 (L7 · 42–46)"],
  ["Sample proportion", "$\\hat p = x/n$; $z = \\frac{\\hat p - P}{\\sqrt{PQ/n}}$", "nP, nQ > 15", "“what proportion of the sample”", "Drug 0.9875 (L7 · 47–52)"],
  ["CI for $\\mu$", "$\\bar x \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n}$; $z = 1.645/1.96/2.33/2.58$", "$\\sigma$ known or large n", "“construct a 95% confidence interval”", "Phone (500.22, 519.78) (L7 · 62–67)"],
  ["CI for P", "$\\hat p \\pm z_{\\alpha/2}\\sqrt{\\hat p\\hat q/n}$", "Large n", "“estimate the proportion”", "Telemarketing (0.29, 0.49) (L7 · 70–74)"],
  ["CI for differences", "$(\\bar x_1 - \\bar x_2) \\pm z\\,SE$; $(p_1 - p_2) \\pm z\\,SE$", "Two independent samples", "“difference between”", "(L7 · 63–64, 71–72)"],
  // ---- Lecture 9
  ["Hypotheses & tails", "$H_0$ has =/≤/≥; $H_1$ <, >, ≠ sets the tail", "Every test", "“claims”, “at least”, “differs”", "(L9 · 7–14)"],
  ["Errors & p-value", "Type I = reject true $H_0$ $(\\alpha)$; Type II $(\\beta)$; power $1 - \\beta$; reject if $p \\le \\alpha$", "Every test", "“level of significance”", "(L9 · 18–25)"],
  ["z critical values", "two-tail ±2.58/±1.96/±1.645; one-tail 2.33/1.65/1.28 (1/5/10%)", "z-tests", "“at 5% level”", "(L9 · 27)"],
  ["z-test one mean", "$z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$", "$n \\ge 30$ or $\\sigma$ known", "“claims mean is …”", "Sodium 1.842; delivery 2.36 (L9 · 28–30)"],
  ["z-test two means", "$z = \\frac{\\bar x_1 - \\bar x_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$", "Large independent samples", "“brand A vs B”", "Tyres 2.37 (L9 · 35–39)"],
  ["z-test proportion(s)", "$z = \\frac{p - P}{\\sqrt{PQ/n}}$; two: pooled $\\hat P = \\frac{X_1+X_2}{n_1+n_2}$", "Large samples", "“survival rate”, “two judges”", "0.63; 2.55 (L9 · 41–46)"],
  ["t-test one mean", "$t = \\frac{\\bar x - \\mu}{s/\\sqrt n}$, df $n - 1$", "$\\sigma$ unknown, $n < 30$", "“sample of 10 … SD”", "Sports cars −1.93 (L9 · 51–57)"],
  ["Pooled t (two means)", "$t = \\frac{\\bar x_1 - \\bar x_2}{s_p\\sqrt{1/n_1 + 1/n_2}}$, $s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}$", "Normal, equal variances, independent", "“two groups, small samples”", "Courier 1.556 (L9 · 58–61)"],
  ["Paired t", "$t = \\frac{\\bar d}{s_d/\\sqrt n}$, df pairs − 1", "Same subjects before/after", "“before and after”", "Training 1.629; diet 8.38 (L9 · 62–65, 92)"],
  ["$\\chi^2$ independence", "$E = \\frac{r \\times c}{n}$, $\\chi^2 = \\sum\\frac{(O-E)^2}{E}$, df $(r - 1) (c - 1)$", "Counts; $E \\ge 5$ (else Yates / Fisher / merge)", "“is there an association”", "RTO 7.318; smoking 14.46 (L9 · 66–80)"],
  ["$\\chi^2$ goodness of fit", "$\\chi^2 = \\sum\\frac{(O-E)^2}{E}$, df $k - 1$ − (params)", "Theoretical frequencies", "“fit”, “follow the law”, “uniform”", "Digits 58.54; Mendel 2.27 (L9 · 81–85, 91)"],
  // ---- Lecture 10
  ["Likelihood / MLE", "$L(\\theta) = \\prod f(x_i \\mid \\theta)$; solve $\\frac{d\\log L}{d\\theta} = 0$", "Distribution assumed", "“maximum likelihood estimate”", "Helmets $\\hat{p} = 0.3$ (L10 · 6–14)"],
  ["Standard MLEs", "Bernoulli/binomial k/n · Poisson $\\bar{x}$ · exponential $1/\\bar{x}$ · normal $\\bar{x}$, $\\sum(x - \\bar{x})^2/n$", "i.i.d. sample", "“MLE of $\\lambda/p/\\mu$”", "Hard drives $\\hat{\\lambda} = 2.6$ (L10 · 16–21, 65)"],
  ["F-test for variances", "$F = s_1^2/s_2^2$ (larger on top), df $(n_1 - 1, n_2 - 1)$", "Two independent normal populations", "“more variable”, “less variability”", "Impurities 2.04; impellers 1.18 (L10 · 23–29)"],
  ["One-way ANOVA", "$\\text{CF} = G^2/n$; $\\text{SST} = \\sum x^2 - \\text{CF}$; $\\text{SSTR} = \\sum C_i^2/n_i - \\text{CF}$; $F = [\\text{SSTR}/(k - 1)]/[\\text{SSE}/(n - k)]$", "Normal, equal variances, independent", "“three or more groups”", "$F = 4.0$; iron 4.54 (L10 · 32–49)"],
  ["Two-way ANOVA", "$\\text{SSBL} = \\sum R_j^2/k - \\text{CF}$; $\\text{SSE} = \\text{SST} - \\text{SSTR} - \\text{SSBL}$; error df $(k - 1) (m - 1)$", "One observation per cell; blocks", "“treatments and blocks”, “plots and fertilizers”", "Fertilizer 3.6, 2.4 (L10 · 51–64)"],
];

export default {
  title: "Formula & Concept Index",
  source: `${ROWS.length} formulas across Lectures 1–7, 9, 10 · searchable`,
  overview:
    "Your open-book companion. Type a keyword: a topic (“Bayes”), a symbol (“$\\lambda$”), a phrase from the question (“at least”, “before and after”, “association”) or a lecture (“L9”). Each row gives the formula, **when it applies**, the **typical wording** that signals it, and a **worked example** with its slides. Then open that lecture for the full method.",
  summary: [
    {
      id: "index",
      heading: "🔎 Search the index",
      slides: "",
      blocks: [
        {
          type: "search",
          placeholder: "Search: e.g. “given that”, Poisson, L7, df, outlier…",
          head: ["Topic", "Formula", "Conditions / when", "Typical wording", "Worked example (lecture · slides)"],
          rows: ROWS,
        },
      ],
    },
  ],
};
