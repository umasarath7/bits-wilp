import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Sometimes one bell curve can't describe the data because there are really **two or more groups mixed together**: two companies' "
         "share prices, sedentary and active students. A **Gaussian Mixture Model (GMM)** adds several bell curves, each with its own **centre, width and weight**. "
         "Every point gets a **probability** of belonging to each group (soft clustering), and the curves are fitted with the **EM algorithm**: guess the groups, "
         "refit the curves, repeat. Page numbers are from your consolidated exam PDF.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Mix bell curves", "$p(x) = \\pi_1\\mathcal N_1 + \\pi_2\\mathcal N_2 + \\dots$: weights add up to 1.", tag="Model", example="Share prices: peaks at 90 and 100", figure="i15-mix"),
     CARD("Soft labels", "Each point gets a **responsibility**: the probability each curve produced it (Bayes' theorem).", tag="E-step", example="x = 92 → 0.83 from curve 1", figure="i15-resp"),
     CARD("Refit and repeat", "Move each curve to fit its (weighted) points; repeat until the fit stops improving.", tag="M-step", example="New mean μ₁ = 94.1"),
   ),
 ]),
 SEC(2, "mix", "Two bags of marbles in one jar", [
   P("Pour small and big marbles into one jar and measure them all: the histogram has **two humps**. A GMM says the jar is “60% bag 1 + 40% bag 2”, each bag being a bell curve. In the valley between the humps you can't be sure which bag a marble came from, so you give a **probability** instead of a yes/no."),
   FIG("i15-mix"),
   F("The mixture (page 828)", "$$p(x) = \\sum_{k=1}^{K}\\pi_k\\,\\mathcal N(x \\mid \\mu_k, \\sigma_k^2), \\qquad \\pi_1 + \\dots + \\pi_K = 1$$"),
   T(["Knob", "Symbol", "Controls"],
     [["Centre", "$\\mu_k$", "where the bell sits"], ["Spread / shape", "$\\sigma_k^2$ or $\\Sigma_k$", "how wide (and tilted) it is"], ["Weight", "$\\pi_k$", "how much of the data it explains"]]),
   EX("PDF page 825: share prices", "Company A: 1000 points around Rs 90. Company B: 800 points around Rs 100."),
   ANS("$\\pi_A = 1000/1800 = 0.556$, $\\pi_B = 0.444$"),
   CHK("Soft clustering means…", ["each point joins exactly one cluster", "each point gets a probability for every cluster", "clusters never overlap", "there is only one cluster"], 1, "GMM gives probabilities; clusters may overlap (page 824)."),
 ], "824–830"),
 SEC(3, "resp", "Responsibility = Bayes' theorem again", [
   P("Each point has a **hidden label** (which bell made it). We guess it with Bayes, exactly like Lecture 4: **prior × likelihood ÷ total**."),
   F("Responsibility (page 845)", "$$\\gamma_k(x) = \\frac{\\pi_k \\times \\text{height of bell } k \\text{ at } x}{\\text{sum of } \\pi_j \\times \\text{height of bell } j \\text{ at } x}$$ A point's responsibilities always add up to 1."),
   FIG("i15-resp"),
   EX("PDF pages 856–859: π = 0.6/0.4, μ = 90/100, σ = 5, x = 95", "95 is exactly halfway and the bells have the same width, so the two heights are equal and cancel."),
   ANS("$\\gamma_1 = 0.6/(0.6 + 0.4) = 0.6$"),
   TIP("Equal-σ shortcut", "With the same σ you can drop the $1/\\sqrt{2\\pi\\sigma^2}$ part and compare $\\pi_k e^{-(x - \\mu_k)^2/(2\\sigma^2)}$ only. For x = 92 with $2\\sigma^2 = 50$: $0.6e^{-0.08}$ vs $0.4e^{-1.28}$."),
   CHK("With π = 0.6/0.4 and equal σ, what is γ₁ exactly halfway between the means?", ["0.5", "0.6", "0.4", "1"], 1, "The bell heights cancel, leaving the weight."),
 ], "841–845"),
 SEC(4, "em", "EM: guess the groups, refit, repeat", [
   P("If we knew every point's group, fitting would be easy: just average each group. We don't, so we **loop**. It works like k-means, except every point votes for every group with a weight."),
   F("The loop (pages 854–855)", "1. **Start** with guesses for π, μ, σ².\n2. **E-step:** responsibilities γ for every point.\n3. **M-step:** $N_k = \\sum\\gamma$ (the soft count); $\\pi_k = N_k/N$; $\\mu_k = \\sum\\gamma x/N_k$; $\\sigma_k^2 = \\sum\\gamma(x - \\mu_k)^2/N_k$.\n4. Compute the log-likelihood; repeat until it stops rising."),
   REM("**E = Estimate who belongs where. M = Move the bells.** The log-likelihood never goes down."),
   WARN("Why not just solve it?", "The log-likelihood is a log **of a sum**, $\\sum\\ln\\{\\sum_k\\pi_k\\mathcal N\\}$, so there's no neat formula (page 846). EM gets round this."),
 ], "831–833, 846–855"),
 SEC(5, "example", "The PDF's EM example in four lines", [
   EX("Pages 860–863: data 92, 95, 98; start π = 0.6/0.4, μ = 90/100, σ = 5",
      "**E-step:** γ₁ = 0.83 (for 92), 0.60 (for 95), 0.31 (for 98).\n"
      "**Soft count:** $N_1 = 0.83 + 0.60 + 0.31 = 1.74$.\n"
      "**New weight:** $\\pi_1 = 1.74/3$.\n"
      "**New mean:** $\\mu_1 = (0.83 \\times 92 + 0.60 \\times 95 + 0.31 \\times 98)/1.74$."),
   ANS("$\\pi_1 = 0.58$, $\\pi_2 = 0.42$, $\\mu_1 = 94.1$", "the mean moved from 90 towards the data"),
   WARN("Typo on page 863", "The PDF writes 0.92, 0.95, 0.98 inside the bracket. Use **92, 95, 98**; the answer 94.1 needs those."),
   CHK("Responsibilities 0.83, 0.60, 0.31. New π₁?", ["0.58", "0.60", "1.74", "0.31"], 0, "Average of the responsibilities: 1.74/3 = 0.58."),
 ], "856–863"),
 SEC(6, "steps", "When the groups are already known", [
   P("If the question tells you which points belong to which group, there is no EM to do: just compute each group's numbers directly."),
   EX("Pages 864–867: steps (thousands) 3.2, 3.8, 4.1, 4.5, 4.9 | 9.2, 9.8, 10.3, 10.7, 11.4",
      "Group 1: mean 20.5/5 = 4.1, variance 1.7/5.\nGroup 2: mean 51.4/5 = 10.28, variance 2.828/5.\nWeights: 5 of 10 each."),
   ANS("μ = 4.1, 10.28 · σ² = 0.34, 0.5656 · π = 0.5, 0.5"),
   TIP("Divide by n here", "The PDF divides by n = 5 (the maximum-likelihood variance), not n − 1 as in Lecture 1."),
   EX("New student with 7.0 thousand steps (exercise solution prepared for the website)", "Responsibility for sedentary = 0.069, so we class the student as **active**. 7.0 is closer to 4.1 than to 10.28, but the sedentary bell is much narrower."),
   CHK("Where is a GMM used to find unusual points?", ["Clustering", "Density estimation", "Anomaly detection", "Regression"], 2, "Points with very low likelihood under the fitted GMM are flagged (page 835)."),
 ], "864–867"),
]

write("data/ism/lec15.js", INTRO, SECTIONS)
