// ISM — Exam summary: every lecture's ⚡ Recap on one page (single source of truth: the lecture files).
import l1 from "./lec1.js";
import l2 from "./lec2.js";
import l3 from "./lec3.js";
import l4 from "./lec4.js";
import l5 from "./lec5.js";
import l6 from "./lec6.js";
import l7 from "./lec7.js";
import l9 from "./lec9.js";
import l10 from "./lec10.js";

const LECTURES = [[1, l1], [2, l2], [3, l3], [4, l4], [5, l5], [6, l6], [7, l7], [9, l9], [10, l10]].map(([n, l]) => ({
  id: `l${n}`,
  heading: `L${n}. ${l.title}`,
  slides: "",
  blocks: l.recap,
}));

export default {
  title: "ISM Exam Summary",
  source: "Lectures 1–7, 9, 10 · read in about 30 minutes",
  overview:
    "Read this before the exam. The **mid-sem is closed book** (formulas must be in your head) and the **comprehensive is open book** (you can look formulas up, but must recognise **which method** a question needs, quickly). Section 1 is a decision map from question wording to method; sections L1–L10 are each lecture's ⚡ Recap; section 2 lists the traps that cost marks, including the slide errors we found. For lookups during an open-book exam, use the 🔎 **Formula Index** page.",

  summary: [
    {
      id: "map",
      heading: "1. Which method? A decision map",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["If the question…", "Use", "Lecture"],
          rows: [
            ["gives raw data and asks centre / spread / outliers", "mean, median, SD $(n - 1)$, quartiles at (n+1)/4, fences 1.5 IQR", "L1"],
            ["asks “A or B”, “at least one”, “neither”", "addition rule, complement", "L2"],
            ["says “given that…” or gives a two-way table", "conditional probability", "L3"],
            ["gives % of groups and a rate in each group, asks the overall rate", "total probability (tree)", "L3"],
            ["… then asks which group, given the outcome", "Bayes' theorem", "L4"],
            ["gives a table of features and a new case to classify", "Naive Bayes (+ Laplace if any zero)", "L4"],
            ["asks to find k, $E(X)$, Var(X) from a pmf/pdf", "$\\sum f = 1$ or $\\int f = 1$; $E = \\sum x$ f; $\\text{Var} = E(X^2) - \\mu^2$", "L5"],
            ["counts successes in n independent trials", "binomial", "L6"],
            ["counts rare events per time/space", "Poisson (rescale $\\lambda$)", "L6"],
            ["measured quantity, bell-shaped", "normal, $z = (x - \\mu)/\\sigma$", "L6"],
            ["asks about the **mean of a sample**", "CLT: $z = (\\bar{x} - \\mu)/(\\sigma/\\sqrt{n})$ (+ FPC if $n/N \\ge 5\\%$)", "L7"],
            ["asks for a range for $\\mu$ or P", "confidence interval: estimate ± $z \\cdot \\text{SE}$", "L7"],
            ["tests a claim about a mean/proportion", "z-test (large n) or t-test (small n, $\\sigma$ unknown)", "L9"],
            ["before/after on the same subjects", "paired t-test", "L9"],
            ["two categorical variables in a table", "$\\chi^2$ independence, df $(r - 1) (c - 1)$", "L9"],
            ["observed vs theoretical frequencies", "$\\chi^2$ goodness of fit", "L9"],
            ["“find the estimator / most likely parameter”", "MLE: maximise log L", "L10"],
            ["compares two variances", "F = larger $s^2$ / smaller $s^2$", "L10"],
            ["compares 3+ means", "ANOVA (one-way; two-way if blocks)", "L10"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "The universal answer layout",
          text: "```flow\nDefine events / variables -> State formula + conditions -> Substitute -> Compute (4 d.p.) -> Conclude in words\n```\nFor tests: $H_0 \\cdot H_1 \\cdot \\alpha$ · statistic · critical value (with df and tail) or p-value · decision · conclusion in context.",
        },
      ],
    },
    ...LECTURES,
    {
      id: "traps",
      heading: "2. Traps that cost marks",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Sample vs population:** $s^2$ divides by $n - 1$, $\\sigma^2$ by N. State which you use.",
            "**Skew is named by the tail**, not the peak. Mean chases the tail.",
            "**P(A | B) ≠ $P(B \\mid A)$.** Check which group you divide by.",
            "**Mutually exclusive ≠ independent.** ME events with $P > 0$ are dependent.",
            "**E($X^2$) ≠ [$E(X)$]²**; V(aX + b) = $a^2 V(X)$.",
            "**Rescale $\\lambda$** to the interval; $\\sigma = \\sqrt{\\lambda}$ for Poisson.",
            "**1 − $F(z)$** for “greater than”; F(−z) = $1 - F(z)$.",
            "**σ/$\\sqrt{n}$**, not $\\sigma$, for questions about a sample mean.",
            "**One-tailed tests:** check the statistic's sign agrees with $H_1$ before rejecting.",
            "**df:** one-sample t $n - 1$; pooled $n_1 + n_2 - 2$; paired pairs − 1; $\\chi^2$ $(r - 1) (c - 1)$; ANOVA $(k - 1, n - k)$.",
            "**F-test:** square the SDs, larger variance on top.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide errors to be aware of (details on each lecture page and the Coverage page)",
          text: "L2 Ex1(d) sums to 15/16 · L3 vowels (1/5) and “irregular girl” (0.2045) · L4 firms V/W (7/16, 3/7) and species height table · L5 P(prime) = 2/3 · L6 cafeteria (0.112), clouds F(−1.40) = 0.0808, 99.7% · L7 drug SE uses 0.6 · L9 sports-car sign, courier 4.56, digits “>”, paired df · L10 iron $G = 891$, $F = 4.54$, $F(3, 36) = 2.87$.",
        },
      ],
    },
  ],
};
