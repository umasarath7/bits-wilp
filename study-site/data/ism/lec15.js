// ISM — Session 15: Gaussian Mixture Models (GMM): mixtures, latent variables, responsibilities, maximum likelihood,
// the EM algorithm for GMMs, worked numerical examples, challenges and applications.
// Source: CourseFiles/ISM/S1-26_DSEZC418_ISM.pdf (consolidated open-book PDF), pages 822–867.
// All "page N" references are page numbers of that consolidated PDF. Every number was re-computed in Python.
// Numbers marked "Exercise solution prepared for the website" extend the PDF's own examples.

export default {
  title: "Gaussian Mixture Models & the EM Algorithm",
  source: "Consolidated PDF (S1-26_DSEZC418_ISM.pdf) · pages 822–867 · Session 15",
  quizMode: "step",
  overview:
    "When data come from **several groups mixed together** (two companies' share prices, sedentary and active students), one bell curve can't describe them. A **Gaussian Mixture Model (GMM)** adds several normal curves, each with its own **mean**, **spread** and **weight** (pages 824–830). It is a **soft clustering** method: every point gets a **probability** of belonging to each group, called its **responsibility**, found with Bayes' theorem (pages 841–845). The parameters are fitted by **maximum likelihood**, but the log of a sum has no closed-form solution, so we use the **Expectation-Maximization (EM) algorithm**: E-step = compute responsibilities, M-step = re-estimate weights, means and variances from them, repeat until the log-likelihood stops rising (pages 831–833, 846–855). The session ends with three exam-style numerical problems (pages 856–867). **Page numbers on this page refer to your consolidated exam PDF.** The same EM algorithm also appears in Machine Learning, Module 10.",

  simpleIntro: "Sometimes one bell curve can't describe the data because there are really **two or more groups mixed together**: two companies' share prices, sedentary and active students. A **Gaussian Mixture Model (GMM)** adds several bell curves, each with its own **centre, width and weight**. Every point gets a **probability** of belonging to each group (soft clustering), and the curves are fitted with the **EM algorithm**: guess the groups, refit the curves, repeat. Page numbers are from your consolidated exam PDF.",

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
              "title": "Mix bell curves",
              "text": "$p(x) = \\pi_1\\mathcal N_1 + \\pi_2\\mathcal N_2 + \\dots$: weights add up to 1.",
              "tag": "Model",
              "example": "Share prices: peaks at 90 and 100",
              "figure": "i15-mix"
            },
            {
              "title": "Soft labels",
              "text": "Each point gets a **responsibility**: the probability each curve produced it (Bayes' theorem).",
              "tag": "E-step",
              "example": "x = 92 → 0.83 from curve 1",
              "figure": "i15-resp"
            },
            {
              "title": "Refit and repeat",
              "text": "Move each curve to fit its (weighted) points; repeat until the fit stops improving.",
              "tag": "M-step",
              "example": "New mean μ₁ = 94.1"
            }
          ]
        }
      ]
    },
    {
      "id": "s-mix",
      "heading": "2. Two bags of marbles in one jar",
      "slides": "824–830",
      "blocks": [
        {
          "type": "p",
          "text": "Pour small and big marbles into one jar and measure them all: the histogram has **two humps**. A GMM says the jar is “60% bag 1 + 40% bag 2”, each bag being a bell curve. In the valley between the humps you can't be sure which bag a marble came from, so you give a **probability** instead of a yes/no."
        },
        {
          "type": "diagram",
          "name": "i15-mix"
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The mixture (page 828)",
          "text": "$$p(x) = \\sum_{k=1}^{K}\\pi_k\\,\\mathcal N(x \\mid \\mu_k, \\sigma_k^2), \\qquad \\pi_1 + \\dots + \\pi_K = 1$$"
        },
        {
          "type": "table",
          "head": [
            "Knob",
            "Symbol",
            "Controls"
          ],
          "rows": [
            [
              "Centre",
              "$\\mu_k$",
              "where the bell sits"
            ],
            [
              "Spread / shape",
              "$\\sigma_k^2$ or $\\Sigma_k$",
              "how wide (and tilted) it is"
            ],
            [
              "Weight",
              "$\\pi_k$",
              "how much of the data it explains"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "PDF page 825: share prices",
          "text": "Company A: 1000 points around Rs 90. Company B: 800 points around Rs 100."
        },
        {
          "type": "answer",
          "value": "$\\pi_A = 1000/1800 = 0.556$, $\\pi_B = 0.444$"
        },
        {
          "type": "check",
          "q": "Soft clustering means…",
          "options": [
            "each point joins exactly one cluster",
            "each point gets a probability for every cluster",
            "clusters never overlap",
            "there is only one cluster"
          ],
          "answer": 1,
          "why": "GMM gives probabilities; clusters may overlap (page 824)."
        }
      ]
    },
    {
      "id": "s-resp",
      "heading": "3. Responsibility = Bayes' theorem again",
      "slides": "841–845",
      "blocks": [
        {
          "type": "p",
          "text": "Each point has a **hidden label** (which bell made it). We guess it with Bayes, exactly like Lecture 4: **prior × likelihood ÷ total**."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "Responsibility (page 845)",
          "text": "$$\\gamma_k(x) = \\frac{\\pi_k \\times \\text{height of bell } k \\text{ at } x}{\\text{sum of } \\pi_j \\times \\text{height of bell } j \\text{ at } x}$$ A point's responsibilities always add up to 1."
        },
        {
          "type": "diagram",
          "name": "i15-resp"
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "PDF pages 856–859: π = 0.6/0.4, μ = 90/100, σ = 5, x = 95",
          "text": "95 is exactly halfway and the bells have the same width, so the two heights are equal and cancel."
        },
        {
          "type": "answer",
          "value": "$\\gamma_1 = 0.6/(0.6 + 0.4) = 0.6$"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Equal-σ shortcut",
          "text": "With the same σ you can drop the $1/\\sqrt{2\\pi\\sigma^2}$ part and compare $\\pi_k e^{-(x - \\mu_k)^2/(2\\sigma^2)}$ only. For x = 92 with $2\\sigma^2 = 50$: $0.6e^{-0.08}$ vs $0.4e^{-1.28}$."
        },
        {
          "type": "check",
          "q": "With π = 0.6/0.4 and equal σ, what is γ₁ exactly halfway between the means?",
          "options": [
            "0.5",
            "0.6",
            "0.4",
            "1"
          ],
          "answer": 1,
          "why": "The bell heights cancel, leaving the weight."
        }
      ]
    },
    {
      "id": "s-em",
      "heading": "4. EM: guess the groups, refit, repeat",
      "slides": "831–833, 846–855",
      "blocks": [
        {
          "type": "p",
          "text": "If we knew every point's group, fitting would be easy: just average each group. We don't, so we **loop**. It works like k-means, except every point votes for every group with a weight."
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "The loop (pages 854–855)",
          "text": "1. **Start** with guesses for π, μ, σ².\n2. **E-step:** responsibilities γ for every point.\n3. **M-step:** $N_k = \\sum\\gamma$ (the soft count); $\\pi_k = N_k/N$; $\\mu_k = \\sum\\gamma x/N_k$; $\\sigma_k^2 = \\sum\\gamma(x - \\mu_k)^2/N_k$.\n4. Compute the log-likelihood; repeat until it stops rising."
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**E = Estimate who belongs where. M = Move the bells.** The log-likelihood never goes down."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Why not just solve it?",
          "text": "The log-likelihood is a log **of a sum**, $\\sum\\ln\\{\\sum_k\\pi_k\\mathcal N\\}$, so there's no neat formula (page 846). EM gets round this."
        }
      ]
    },
    {
      "id": "s-example",
      "heading": "5. The PDF's EM example in four lines",
      "slides": "856–863",
      "blocks": [
        {
          "type": "callout",
          "kind": "example",
          "title": "Pages 860–863: data 92, 95, 98; start π = 0.6/0.4, μ = 90/100, σ = 5",
          "text": "**E-step:** γ₁ = 0.83 (for 92), 0.60 (for 95), 0.31 (for 98).\n**Soft count:** $N_1 = 0.83 + 0.60 + 0.31 = 1.74$.\n**New weight:** $\\pi_1 = 1.74/3$.\n**New mean:** $\\mu_1 = (0.83 \\times 92 + 0.60 \\times 95 + 0.31 \\times 98)/1.74$."
        },
        {
          "type": "answer",
          "value": "$\\pi_1 = 0.58$, $\\pi_2 = 0.42$, $\\mu_1 = 94.1$",
          "text": "the mean moved from 90 towards the data"
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Typo on page 863",
          "text": "The PDF writes 0.92, 0.95, 0.98 inside the bracket. Use **92, 95, 98**; the answer 94.1 needs those."
        },
        {
          "type": "check",
          "q": "Responsibilities 0.83, 0.60, 0.31. New π₁?",
          "options": [
            "0.58",
            "0.60",
            "1.74",
            "0.31"
          ],
          "answer": 0,
          "why": "Average of the responsibilities: 1.74/3 = 0.58."
        }
      ]
    },
    {
      "id": "s-steps",
      "heading": "6. When the groups are already known",
      "slides": "864–867",
      "blocks": [
        {
          "type": "p",
          "text": "If the question tells you which points belong to which group, there is no EM to do: just compute each group's numbers directly."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "Pages 864–867: steps (thousands) 3.2, 3.8, 4.1, 4.5, 4.9 | 9.2, 9.8, 10.3, 10.7, 11.4",
          "text": "Group 1: mean 20.5/5 = 4.1, variance 1.7/5.\nGroup 2: mean 51.4/5 = 10.28, variance 2.828/5.\nWeights: 5 of 10 each."
        },
        {
          "type": "answer",
          "value": "μ = 4.1, 10.28 · σ² = 0.34, 0.5656 · π = 0.5, 0.5"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Divide by n here",
          "text": "The PDF divides by n = 5 (the maximum-likelihood variance), not n − 1 as in Lecture 1."
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "New student with 7.0 thousand steps (exercise solution prepared for the website)",
          "text": "Responsibility for sedentary = 0.069, so we class the student as **active**. 7.0 is closer to 4.1 than to 10.28, but the sedentary bell is much narrower."
        },
        {
          "type": "check",
          "q": "Where is a GMM used to find unusual points?",
          "options": [
            "Clustering",
            "Density estimation",
            "Anomaly detection",
            "Regression"
          ],
          "answer": 2,
          "why": "Points with very low likelihood under the fitted GMM are flagged (page 835)."
        }
      ]
    }
  ],

  summary: [
    {
      id: "what",
      heading: "Lesson 1: What is a Gaussian Mixture Model?",
      slides: "823–827, 834–835",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "Pour two bags of marbles, small ones and big ones, into one jar. If you measure every marble's size and draw a histogram, you see **two humps**. A GMM says: “this histogram is really two bell curves added together; let's find each bell's centre, width and how many marbles came from each bag.” In the middle, where the humps overlap, you can't be sure which bag a marble came from, so a GMM gives a **probability** for each bag instead of a hard yes/no.",
        },
        {
          type: "p",
          text: "**Definition (page 824).** A GMM is a probabilistic model that represents data as a **mixture of Gaussian (normal) distributions**. Each Gaussian component represents **one cluster**. It assumes the data were generated from several Gaussians with **unknown parameters**. GMMs are popular for **clustering** and **density estimation** (page 827).",
        },
        {
          type: "table",
          caption: "Hard vs soft clustering (page 824)",
          head: ["", "Hard clustering (e.g. k-means)", "Soft clustering (GMM)"],
          rows: [
            ["Each point gets…", "exactly one cluster", "a **probability** for every cluster"],
            ["Clusters", "do not overlap", "may overlap"],
            ["Cluster shape", "roughly round, equal size", "any ellipse (via the covariance), any weight"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF example (pages 825–826): two companies' share prices",
          text: "Company A: price ~ Normal(mean Rs 90, SD Rs 2), **1000** sample points. Company B: Normal(mean Rs 100, SD Rs 2), **800** points. Mix the two samples and the histogram has two peaks, near 90 and 100 (page 826). The mixing weights are the shares of points: $\\pi_A = 1000/1800 = 0.556$, $\\pi_B = 800/1800 = 0.444$. Points in the valley between the peaks are ambiguous; GMM handles them with probabilities.",
        },
        { type: "diagram", name: "i15-mix" },
        {
          type: "table",
          caption: "Challenges and applications (pages 834–835)",
          head: ["Challenges", "Applications"],
          rows: [
            ["Assumes the data really come from Gaussians, which may not hold", "**Clustering** (soft: a point can belong to several clusters with probabilities)"],
            ["The number of components K must usually be chosen beforehand", "**Density estimation**: the GMM is a smooth estimate of the data's distribution"],
            ["Likelihood can blow up (singularities) when a component shrinks onto one point (page 847)", "**Anomaly detection**: points with very low likelihood under the GMM are unusual"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**GMM = several bell curves added together; each bell = one cluster.** Soft clustering: every point gets a probability for each cluster.",
        },
      ],
    },
    {
      id: "model",
      heading: "Lesson 2: The mixture formula and its three ingredients",
      slides: "828–830, 836–840, 843",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "The mixture is a **weighted sum** of bell curves: each curve is multiplied by its weight, and the weights add up to 1. A bigger weight means that group contributed more of the data.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "GMM density (pages 828, 837, 843)",
          text: "$$p(\\mathbf{x}) = \\sum_{k=1}^{K} \\pi_k\\, \\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol\\mu_k, \\boldsymbol\\Sigma_k), \\qquad \\sum_{k=1}^{K}\\pi_k = 1, \\quad 0 \\le \\pi_k \\le 1$$ Read it as: “the chance of seeing x = sum over groups of (share of that group) × (how likely x is inside that group).” The mixing coefficients can be read as **prior probabilities**: $p(\\mathbf x) = \\sum_k p(k)\\,p(\\mathbf x \\mid k)$ (page 843).",
        },
        {
          type: "table",
          caption: "The parameters of a GMM (pages 829–830)",
          head: ["Symbol", "Name", "What it controls"],
          rows: [
            ["$\\mu_k$", "Mean", "The **centre** of component k"],
            ["$\\Sigma_k$ (or $\\sigma_k^2$ in 1-D)", "Covariance", "The **shape and orientation** (width, tilt of the ellipse)"],
            ["$\\pi_k$", "Mixing coefficient (weight)", "The **importance**: share of the data from component k"],
            ["K", "Number of components", "How many Gaussians are mixed"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "The Gaussian building block (pages 836, 840)",
          text: "One dimension: $\\mathcal{N}(x \\mid \\mu, \\sigma^2) = \\dfrac{1}{\\sqrt{2\\pi\\sigma^2}}\\exp\\left\\{-\\dfrac{(x - \\mu)^2}{2\\sigma^2}\\right\\}$\n\nd dimensions: $\\mathcal{N}(\\mathbf x \\mid \\boldsymbol\\mu, \\boldsymbol\\Sigma) = \\dfrac{1}{(2\\pi)^{d/2}|\\boldsymbol\\Sigma|^{1/2}}\\exp\\left\\{-\\tfrac12(\\mathbf x - \\boldsymbol\\mu)^{T}\\boldsymbol\\Sigma^{-1}(\\mathbf x - \\boldsymbol\\mu)\\right\\}$\n\nPage 840: a general Σ gives a tilted ellipse (a), a diagonal Σ an axis-aligned ellipse (b), and $\\Sigma = \\sigma^2 I$ a circle (c).",
        },
        {
          type: "p",
          text: "**Why mix? (pages 837–838).** One Gaussian fitted to two clumps (page 838, left) puts a big ellipse over empty space between them. A mixture of two (right) puts one ellipse on each clump. With K = 3 (page 837), three bumps added together can model a curve with three peaks.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**$p(x) = \\sum_k \\pi_k \\mathcal{N}(x \\mid \\mu_k, \\Sigma_k)$**, weights sum to 1. Three knobs per component: **centre μ, shape Σ, weight π.**",
        },
      ],
    },
    {
      id: "latent",
      heading: "Lesson 3: Hidden labels and responsibilities (Bayes' theorem)",
      slides: "839, 841–845",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "Behind every data point is a **hidden label** saying which group produced it, but we never see it. The **responsibility** $\\gamma(z_k)$ is our best guess, after seeing x, of the probability that group k produced it. It is just **Bayes' theorem** from Lecture 4: prior (weight) × likelihood (bell height), divided by the total.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The latent variable z (pages 841, 844)",
          text: "z is a K-dimensional **1-of-K** binary vector: exactly one $z_k = 1$, the rest 0 (it names the component). Then\n$$p(z_k = 1) = \\pi_k, \\quad p(\\mathbf z) = \\prod_{k=1}^K \\pi_k^{z_k}, \\quad p(\\mathbf x \\mid \\mathbf z) = \\prod_{k=1}^K \\mathcal N(\\mathbf x \\mid \\boldsymbol\\mu_k, \\boldsymbol\\Sigma_k)^{z_k}$$ and summing the joint $p(\\mathbf z)p(\\mathbf x \\mid \\mathbf z)$ over all states of z gives back the mixture $p(\\mathbf x) = \\sum_k \\pi_k\\mathcal N(\\mathbf x \\mid \\boldsymbol\\mu_k, \\boldsymbol\\Sigma_k)$.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Responsibility (page 845)",
          text: "$$\\gamma(z_k) \\equiv p(z_k = 1 \\mid \\mathbf x) = \\frac{\\pi_k\\,\\mathcal N(\\mathbf x \\mid \\boldsymbol\\mu_k, \\boldsymbol\\Sigma_k)}{\\sum_{j=1}^{K}\\pi_j\\,\\mathcal N(\\mathbf x \\mid \\boldsymbol\\mu_j, \\boldsymbol\\Sigma_j)}$$ $\\pi_k$ = **prior** probability of component k; $\\gamma(z_k)$ = the **posterior** after observing x. The responsibilities of one point always add up to 1.",
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF example (pages 856–859): responsibility at x = 95",
          text: "$\\pi_1 = 0.6$, $\\pi_2 = 0.4$; $\\mu_1 = 90$, $\\mu_2 = 100$; $\\sigma_1 = \\sigma_2 = 5$ (so $\\sigma^2 = 25$).\n$p(x) = \\dfrac{0.6}{\\sqrt{2\\pi}\\,5}e^{-(x - 90)^2/50} + \\dfrac{0.4}{\\sqrt{2\\pi}\\,5}e^{-(x - 100)^2/50}$.\nAt x = 95 the point is **exactly halfway**, so both bell heights are equal and cancel:\n$\\gamma_1 = \\dfrac{0.6\\,\\mathcal N(95 \\mid 90, 25)}{0.6\\,\\mathcal N(95 \\mid 90, 25) + 0.4\\,\\mathcal N(95 \\mid 100, 25)} = \\dfrac{0.6}{0.6 + 0.4} = $ **0.6**.",
        },
        { type: "diagram", name: "i15-resp" },
        {
          type: "callout",
          kind: "tip",
          title: "Shortcut for equal variances",
          text: "When the components have the **same σ**, the $1/\\sqrt{2\\pi\\sigma^2}$ factors cancel, so you only need $\\pi_k e^{-(x - \\mu_k)^2/(2\\sigma^2)}$. That is how the PDF writes $\\gamma_{11} = \\dfrac{0.6e^{-0.08}}{0.6e^{-0.08} + 0.4e^{-1.28}}$ on page 862.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Responsibility = weight × bell height ÷ total.** Same idea as Bayes: prior × likelihood ÷ evidence. Halfway point with equal σ ⇒ responsibility = the weight.",
        },
      ],
    },
    {
      id: "mle",
      heading: "Lesson 4: Maximum likelihood and why we need EM",
      slides: "839, 842, 846–850, 852",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "If we knew each point's label, fitting would be easy: average each group's points for its mean, and so on (page 842). But the labels are hidden. So we go round in a loop: **guess** the labels softly (E-step), **refit** each group using those soft labels (M-step), and repeat. Each lap can only improve the fit.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Log-likelihood (pages 839, 846)",
          text: "For N independent points:\n$$\\ln p(\\mathbf X \\mid \\boldsymbol\\pi, \\boldsymbol\\mu, \\boldsymbol\\Sigma) = \\sum_{n=1}^{N}\\ln\\left\\{\\sum_{k=1}^{K}\\pi_k\\,\\mathcal N(\\mathbf x_n \\mid \\boldsymbol\\mu_k, \\boldsymbol\\Sigma_k)\\right\\}$$ **The difficulty:** the sum over k sits **inside** the logarithm, so the log no longer acts directly on the Gaussian and there is no closed-form answer, unlike a single Gaussian (Lecture 10's MLE).",
        },
        {
          type: "table",
          caption: "Setting the derivatives to zero (pages 848–850)",
          head: ["Parameter", "Result", "In words"],
          rows: [
            ["Mean $\\mu_k$", "$\\mu_k = \\dfrac{1}{N_k}\\sum_n \\gamma(z_{nk})\\,\\mathbf x_n$, with $N_k = \\sum_n \\gamma(z_{nk})$", "A **weighted average** of all points, weighted by responsibility"],
            ["Covariance $\\Sigma_k$", "$\\Sigma_k = \\dfrac{1}{N_k}\\sum_n \\gamma(z_{nk})(\\mathbf x_n - \\mu_k)(\\mathbf x_n - \\mu_k)^T$", "A weighted spread around the new mean"],
            ["Weight $\\pi_k$", "Lagrange multiplier for $\\sum\\pi_k = 1$ gives $\\lambda = -N$, so $\\pi_k = \\dfrac{N_k}{N}$", "The **share of the total responsibility**"],
          ],
        },
        {
          type: "p",
          text: "**$N_k$ is the effective number of points in component k**: the sum of the responsibilities (a point that is 70% in cluster 1 counts 0.7). These equations are **coupled**: γ depends on μ, Σ, π and vice versa, so they are not a closed-form solution, which suggests the iterative scheme (page 852). **Each EM cycle is guaranteed not to decrease the likelihood.**",
        },
        {
          type: "table",
          caption: "Problems of GMM and their fixes (page 847)",
          head: ["Problem", "Solved by"],
          rows: [
            ["How to maximise the log-likelihood", "The **EM algorithm**"],
            ["Singularities in the likelihood (a component collapsing onto one point)", "A **Bayesian** treatment"],
            ["How to choose the number of components K", "Also a **Bayesian** treatment"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**$N_k = \\sum_n \\gamma_{nk}$; $\\pi_k = N_k/N$; $\\mu_k$ = responsibility-weighted average; $\\Sigma_k$ = responsibility-weighted spread.** Sum inside the log ⇒ no closed form ⇒ EM.",
        },
      ],
    },
    {
      id: "em",
      heading: "Lesson 5: The EM algorithm for GMMs, step by step",
      slides: "831–833, 851, 853–855",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "**E** = **E**stimate who belongs where (responsibilities). **M** = **M**ove the bells to fit their (soft) members. Repeat until nothing changes much. It is like k-means, but every point votes for every cluster with a weight instead of joining just one.",
        },
        {
          type: "p",
          text: "```flow\n1. Initialise mu_k, Sigma_k, pi_k; compute log-likelihood -> 2. E-step: responsibilities gamma(z_nk) -> 3. M-step: N_k, mu_k, Sigma_k, pi_k -> 4. Evaluate log-likelihood -> converged? else back to 2\n```",
        },
        {
          type: "callout",
          kind: "formula",
          title: "EM algorithm for GMM (pages 854–855)",
          text: "1. **Initialise** the means $\\mu_k$, covariances $\\Sigma_k$ and mixing coefficients $\\pi_k$, and evaluate the initial log-likelihood.\n2. **E-step:** $\\gamma(z_{nk}) = \\dfrac{\\pi_k\\mathcal N(\\mathbf x_n \\mid \\mu_k, \\Sigma_k)}{\\sum_j \\pi_j\\mathcal N(\\mathbf x_n \\mid \\mu_j, \\Sigma_j)}$\n3. **M-step:** $N_k = \\sum_n\\gamma(z_{nk})$; $\\mu_k^{new} = \\dfrac{1}{N_k}\\sum_n\\gamma(z_{nk})\\mathbf x_n$; $\\Sigma_k^{new} = \\dfrac{1}{N_k}\\sum_n\\gamma(z_{nk})(\\mathbf x_n - \\mu_k^{new})(\\mathbf x_n - \\mu_k^{new})^T$; $\\pi_k^{new} = \\dfrac{N_k}{N}$\n4. **Evaluate** $\\ln p(\\mathbf X \\mid \\mu, \\Sigma, \\pi) = \\sum_n\\ln\\{\\sum_k\\pi_k\\mathcal N(\\mathbf x_n \\mid \\mu_k, \\Sigma_k)\\}$. Stop when the change in log-likelihood (or in the parameters) falls below a threshold (page 832); otherwise go back to step 2.",
        },
        {
          type: "p",
          text: "**The pictures (pages 833, 853, from Bishop).** (a) Two circles start in the wrong places over two clumps of green points. (b) E-step: each point is coloured by its responsibilities, a blend of blue and red. (c) M-step: the circles move and stretch to fit their coloured points. (d)–(f) After L = 2, 5 and 20 cycles the two ellipses sit neatly on the two clumps.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Initialise → E (responsibilities) → M ($N_k$, μ, Σ, π) → log-likelihood → repeat.** The log-likelihood never goes down.",
        },
      ],
    },
    {
      id: "examples",
      heading: "Lesson 6: Worked examples from the PDF",
      slides: "856–867",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The three exam-style GMM questions in the PDF: one responsibility, one full EM iteration, and estimating a GMM when the groups are known.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Example 1: one EM iteration (pages 860–863)",
          text: "Start: $\\pi_1 = 0.6$, $\\pi_2 = 0.4$, $\\mu_1 = 90$, $\\mu_2 = 100$, $\\sigma_1 = \\sigma_2 = 5$ ($\\sigma^2 = 25$). Data x = {92, 95, 98}, N = 3.\n**E-step** (equal σ, so only the exponents matter; $2\\sigma^2 = 50$):\n- x = 92: $(92 - 90)^2/50 = 0.08$, $(92 - 100)^2/50 = 1.28$ → $\\gamma_{11} = \\dfrac{0.6e^{-0.08}}{0.6e^{-0.08} + 0.4e^{-1.28}} = \\dfrac{0.5539}{0.5539 + 0.1112} = $ **0.83**\n- x = 95: halfway → $\\gamma_{21} = $ **0.60**\n- x = 98: exponents swap → $\\gamma_{31} = \\dfrac{0.6e^{-1.28}}{0.6e^{-1.28} + 0.4e^{-0.08}} = \\dfrac{0.1668}{0.1668 + 0.3692} = $ **0.31**\n**M-step:** $\\pi_1 = \\frac13(0.83 + 0.60 + 0.31) = $ **0.58**, $\\pi_2 = $ **0.42**.\n$\\mu_1 = \\dfrac{0.83(92) + 0.60(95) + 0.31(98)}{0.83 + 0.60 + 0.31} = $ **94.1**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 863",
          text: "The working writes “0.83(0.92) + 0.6(0.95) + 0.31(0.98)”. The data are **92, 95, 98**, not 0.92, 0.95, 0.98. The final answer **94.1** is correct only with 92, 95, 98.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Finishing the iteration (exercise solution prepared for the website)",
          text: "Component 2 responsibilities: 0.17, 0.40, 0.69 ($N_2 = 1.256$). $\\mu_2 = \\dfrac{0.17(92) + 0.40(95) + 0.69(98)}{1.256} = $ **96.25**.\nVariances: $\\sigma_1^2 = \\frac{1}{N_1}\\sum\\gamma_{i1}(x_i - 94.10)^2 = $ **5.10**; $\\sigma_2^2 = $ **4.58**.\nLog-likelihood: **−9.12** before → **−6.92** after one full iteration. It went up, as EM promises.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Example 2: step counts of 10 students (pages 864–867)",
          text: "Daily steps (thousands): {3.2, 3.8, 4.1, 4.5, 4.9 | 9.2, 9.8, 10.3, 10.7, 11.4}; first five = sedentary, last five = active.\n(a) $p(x) = \\pi_1\\mathcal N(x \\mid \\mu_1, \\sigma_1^2) + \\pi_2\\mathcal N(x \\mid \\mu_2, \\sigma_2^2)$, with $\\mathcal N(x \\mid \\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-(x - \\mu)^2/(2\\sigma^2)}$.\n(b) $\\mu_1 = 20.5/5 = $ **4.1**; $\\sigma_1^2 = (0.81 + 0.09 + 0 + 0.16 + 0.64)/5 = 1.7/5 = $ **0.34**.\n$\\mu_2 = 51.4/5 = $ **10.28**; $\\sigma_2^2 = (1.1664 + 0.2304 + 0.0004 + 0.1764 + 1.2544)/5 = 2.828/5 = $ **0.5656**.\n(c) $\\pi_1 = \\pi_2 = 5/10 = $ **0.5**.\n(d) For a new student, compute $\\gamma(z_k) = \\dfrac{\\pi_k\\mathcal N(x \\mid \\mu_k, \\sigma_k^2)}{\\sum_i\\pi_i\\mathcal N(x \\mid \\mu_i, \\sigma_i^2)}$ and put them in group 1 if $\\gamma(z_1) > \\gamma(z_2)$; target the sedentary group with health programmes.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Divide by n here, not n − 1",
          text: "The variances on pages 865–866 divide by **n = 5**, the maximum-likelihood estimate (the same as the M-step formula with all responsibilities 0 or 1). Lecture 1's sample variance divides by n − 1 and would give 0.425 and 0.707. For GMM questions, follow the PDF and divide by n (or by $N_k$).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Classifying a new student (exercise solution prepared for the website)",
          text: "x = 7.0 thousand steps: $0.5\\,\\mathcal N(7 \\mid 4.1, 0.34) = 1.46 \\times 10^{-6}$, $0.5\\,\\mathcal N(7 \\mid 10.28, 0.5656) = 1.96 \\times 10^{-5}$ → $\\gamma(z_1) = $ **0.069**, so this student is classed as **active**. The two responsibilities are equal at about **6.82** thousand steps, the boundary between the groups. It sits closer to the sedentary mean because that group's spread is narrower.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**Equal σ: compare $\\pi_k e^{-(x - \\mu_k)^2/(2\\sigma^2)}$.** M-step: $\\pi_1 = \\bar\\gamma$, $\\mu_1 = \\sum\\gamma x/\\sum\\gamma$. Known groups: plain mean, variance ÷ n, weight = share of points.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Session 15 on one screen (consolidated PDF pages)",
      head: ["Idea", "Key formula / rule", "Pages"],
      rows: [
        ["GMM", "Mixture of Gaussians, one per cluster; soft clustering", "824–827"],
        ["Density", "$p(x) = \\sum_k\\pi_k\\mathcal N(x \\mid \\mu_k, \\Sigma_k)$, $\\sum\\pi_k = 1$, $0 \\le \\pi_k \\le 1$", "828, 837, 843"],
        ["Parameters", "μ centre, Σ shape/orientation, π weight, K count", "829–830"],
        ["Latent z", "1-of-K; $p(z_k = 1) = \\pi_k$; $p(x) = \\sum_z p(z)p(x \\mid z)$", "841, 844"],
        ["Responsibility", "$\\gamma(z_k) = \\pi_k\\mathcal N(x \\mid \\mu_k, \\Sigma_k)/\\sum_j\\pi_j\\mathcal N(x \\mid \\mu_j, \\Sigma_j)$", "845"],
        ["Log-likelihood", "$\\sum_n\\ln\\{\\sum_k\\pi_k\\mathcal N(x_n \\mid \\mu_k, \\Sigma_k)\\}$: sum inside log → no closed form", "846"],
        ["M-step", "$N_k = \\sum_n\\gamma_{nk}$; $\\mu_k = \\sum_n\\gamma_{nk}x_n/N_k$; $\\Sigma_k = \\sum_n\\gamma_{nk}(x_n - \\mu_k)(x_n - \\mu_k)^T/N_k$; $\\pi_k = N_k/N$", "848–850, 855"],
        ["EM loop", "Initialise → E → M → log-likelihood → repeat; likelihood never decreases", "831–832, 852–855"],
        ["Worked answers", "γ(95) = 0.6; γ = 0.83, 0.60, 0.31 → π₁ = 0.58, μ₁ = 94.1; steps μ = 4.1, 10.28, σ² = 0.34, 0.5656, π = 0.5", "856–867"],
      ],
    },
    { type: "diagram", name: "i15-resp" },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Write the GMM density with the weights and say they sum to 1 · in the E-step show the formula, then the numbers (equal σ ⇒ the constants cancel) · check each point's responsibilities add to 1 · in the M-step compute $N_k$ first, then π, μ, Σ · use the data values, not 0.92 (page 863 typo) · GMM variances divide by $N_k$ (or n).",
    },
  ],

  glossary: [
    ["Gaussian mixture model", "GMM", "A density that is a weighted sum of K Gaussian components"],
    ["Component", "", "One Gaussian in the mixture; one cluster"],
    ["Mixing coefficient $\\pi_k$", "Weight, prior", "Share of the data from component k; $\\sum\\pi_k = 1$"],
    ["Mean $\\mu_k$", "", "Centre of component k"],
    ["Covariance $\\Sigma_k$", "", "Shape and orientation of component k (σ² in one dimension)"],
    ["Soft clustering", "", "Each point gets a probability of belonging to each cluster; clusters may overlap"],
    ["Hard clustering", "", "Each point belongs to exactly one cluster (e.g. k-means)"],
    ["Latent variable z", "Hidden variable", "The unseen 1-of-K label saying which component generated a point"],
    ["1-of-K representation", "One-hot", "A binary vector with exactly one element equal to 1"],
    ["Responsibility $\\gamma(z_{nk})$", "Posterior", "$p(z_k = 1 \\mid x_n)$: probability that component k generated $x_n$"],
    ["$N_k$", "Effective count", "$\\sum_n\\gamma(z_{nk})$: soft number of points in component k"],
    ["Log-likelihood", "", "$\\sum_n\\ln p(x_n)$; EM increases it every cycle"],
    ["EM algorithm", "Expectation-Maximization", "Alternate E-step (responsibilities) and M-step (re-estimate parameters) until convergence"],
    ["Lagrange multiplier", "", "Used to maximise subject to $\\sum\\pi_k = 1$; gives $\\pi_k = N_k/N$"],
    ["Singularity", "", "Likelihood → ∞ when a component collapses onto a single point"],
    ["Density estimation", "", "Using the GMM as a smooth estimate of the data's distribution"],
    ["Anomaly detection", "", "Flagging points with very low likelihood under the fitted GMM"],
  ],

  examTips: [
    "Start every GMM answer by writing $p(x) = \\sum_k\\pi_k\\mathcal N(x \\mid \\mu_k, \\sigma_k^2)$ with the given numbers substituted.",
    "In the E-step, show one responsibility in full (formula, exponents, values), then list the others. With equal σ, say that the constant cancels.",
    "In the M-step, write $N_k$ first, then $\\pi_k = N_k/N$, then $\\mu_k = \\sum\\gamma x/N_k$. Keep 2–4 decimals.",
    "If the groups are given (no EM needed), compute the plain mean, the variance dividing by n, and π = share of points.",
    "Explain applications in one line each: soft clustering, density estimation, anomaly detection; and state the two challenges (Gaussian assumption, choosing K).",
  ],

  problems: [
    {
      title: "Responsibility at the midpoint (pages 856–859)",
      level: "From slides",
      question: "A 1-D GMM has $\\pi_1 = 0.6$, $\\pi_2 = 0.4$, $\\mu_1 = 90$, $\\mu_2 = 100$, $\\sigma_1 = \\sigma_2 = 5$. (1) Write p(x) explicitly. (2) Find the responsibility of component 1 for x = 95.",
      solution: "### (1) Density\n$p(x) = \\dfrac{0.6}{\\sqrt{2\\pi}\\cdot 5}\\exp\\left(-\\dfrac{(x - 90)^2}{50}\\right) + \\dfrac{0.4}{\\sqrt{2\\pi}\\cdot 5}\\exp\\left(-\\dfrac{(x - 100)^2}{50}\\right)$\n### (2) Responsibility\n$\\gamma_1(95) = \\dfrac{\\pi_1\\mathcal N(95 \\mid 90, 25)}{\\pi_1\\mathcal N(95 \\mid 90, 25) + \\pi_2\\mathcal N(95 \\mid 100, 25)}$. 95 is 5 away from both means and σ is equal, so the two Gaussian values are identical ($\\mathcal N = 0.0484$) and cancel:\n$\\gamma_1 = \\dfrac{0.6}{0.6 + 0.4} = $ **0.6**. (Also p(95) = 0.0484.)",
    },
    {
      title: "One EM iteration (pages 860–863)",
      level: "From slides",
      question: "Same initial parameters ($\\pi_1 = 0.6$, $\\pi_2 = 0.4$, $\\mu_1 = 90$, $\\mu_2 = 100$, $\\sigma = 5$). Data {92, 95, 98}. (a) E-step: responsibilities of component 1. (b) M-step: new mixing coefficients and new $\\mu_1$.",
      solution: "### (a) E-step\nEqual σ ⇒ $\\gamma_{i1} = \\dfrac{0.6e^{-(x_i - 90)^2/50}}{0.6e^{-(x_i - 90)^2/50} + 0.4e^{-(x_i - 100)^2/50}}$.\n- 92: exponents 0.08 and 1.28 → $\\dfrac{0.5539}{0.5539 + 0.1112} = $ **0.83**\n- 95: equal exponents → **0.60**\n- 98: exponents 1.28 and 0.08 → $\\dfrac{0.1668}{0.1668 + 0.3692} = $ **0.31**\n### (b) M-step\n$N_1 = 0.83 + 0.60 + 0.31 = 1.74$.\n$\\pi_1 = 1.74/3 = $ **0.58**; $\\pi_2 = $ **0.42**.\n$\\mu_1 = \\dfrac{0.83(92) + 0.60(95) + 0.31(98)}{1.74} = \\dfrac{163.74}{1.74} = $ **94.1**.\n⚠️ Page 863 writes 0.92, 0.95, 0.98 inside the bracket; the data are 92, 95, 98.",
    },
    {
      title: "Completing the M-step and checking the likelihood",
      level: "Level 3",
      question: "Continue the previous problem: find $\\mu_2$, $\\sigma_1^2$ and $\\sigma_2^2$ after the M-step, and compare the log-likelihood before and after the iteration.",
      solution: "### Component 2\n$\\gamma_{i2} = 1 - \\gamma_{i1}$ = 0.17, 0.40, 0.69; $N_2 = 1.256$.\n$\\mu_2 = \\dfrac{0.1672(92) + 0.4(95) + 0.6888(98)}{1.256} = $ **96.25**.\n### Variances (divide by $N_k$)\n$\\sigma_1^2 = \\dfrac{0.8328(92 - 94.10)^2 + 0.6(95 - 94.10)^2 + 0.3112(98 - 94.10)^2}{1.744} = $ **5.10**.\n$\\sigma_2^2 = $ **4.58** (same way around 96.25).\n### Log-likelihood\nBefore: $\\sum\\ln p(x_i) = $ **−9.12**. After ($\\pi_1 = 0.581$, μ = 94.10, 96.25, σ² = 5.10, 4.58): **−6.92**. It increased, as every EM cycle must. (Exercise solution prepared for the website; all values computed in Python with unrounded responsibilities.)",
    },
    {
      title: "Step counts: estimating a GMM from known groups (pages 864–867)",
      level: "From slides",
      question: "Daily steps (thousands): {3.2, 3.8, 4.1, 4.5, 4.9, 9.2, 9.8, 10.3, 10.7, 11.4}; first five sedentary, last five active. (a) Write the two-component GMM density. (b) Estimate each component's mean and variance. (c) Compute the mixing coefficients. (d) How can the GMM segment students?",
      solution: "### (a)\n$p(x) = \\pi_1\\mathcal N(x \\mid \\mu_1, \\sigma_1^2) + \\pi_2\\mathcal N(x \\mid \\mu_2, \\sigma_2^2)$, $\\mathcal N(x \\mid \\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-(x - \\mu)^2/(2\\sigma^2)}$.\n### (b)\nComponent 1: $\\mu_1 = 20.5/5 = $ **4.1**; deviations −0.9, −0.3, 0, 0.4, 0.8 → $\\sigma_1^2 = 1.7/5 = $ **0.34**.\nComponent 2: $\\mu_2 = 51.4/5 = $ **10.28**; squared deviations 1.1664, 0.2304, 0.0004, 0.1764, 1.2544 → $\\sigma_2^2 = 2.828/5 = $ **0.5656**.\n### (c)\n$\\pi_1 = \\pi_2 = 5/10 = $ **0.5**.\n### (d)\nFor a student with x steps, compute $\\gamma(z_k) = \\pi_k\\mathcal N(x \\mid \\mu_k, \\sigma_k^2)/\\sum_i\\pi_i\\mathcal N(x \\mid \\mu_i, \\sigma_i^2)$; assign to component 1 (sedentary) if $\\gamma(z_1) > \\gamma(z_2)$, otherwise component 2. Sedentary students can then be targeted for health interventions, with γ showing how confident the assignment is.",
    },
    {
      title: "Classify a new student",
      level: "Level 2",
      question: "Using the fitted step-count GMM (μ = 4.1, 10.28; σ² = 0.34, 0.5656; π = 0.5 each), classify a student who walks 7.0 thousand steps.",
      solution: "### Bell heights\n$\\mathcal N(7 \\mid 4.1, 0.34) = \\frac{1}{\\sqrt{2\\pi(0.34)}}e^{-(2.9)^2/0.68} = 2.91 \\times 10^{-6}$; times 0.5 → $1.46 \\times 10^{-6}$.\n$\\mathcal N(7 \\mid 10.28, 0.5656) = \\frac{1}{\\sqrt{2\\pi(0.5656)}}e^{-(3.28)^2/1.1312} = 3.93 \\times 10^{-5}$; times 0.5 → $1.96 \\times 10^{-5}$.\n### Responsibility\n$\\gamma(z_1) = \\dfrac{1.46 \\times 10^{-6}}{1.46 \\times 10^{-6} + 1.96 \\times 10^{-5}} = $ **0.069** → **active** (component 2, probability 0.931).\nNote 7.0 is nearer 4.1 by distance (2.9 vs 3.28), but the sedentary group is narrower, so 7.0 is many more of its SDs away. (Exercise solution prepared for the website.)",
    },
    {
      title: "Share prices: weights and a valley point (pages 825–826)",
      level: "Level 2",
      question: "Company A prices ~ N(90, 2²) with 1000 points; Company B ~ N(100, 2²) with 800 points. Give the mixing coefficients and the probability that a price of Rs 95 came from Company A. What about Rs 93?",
      solution: "### Weights\n$\\pi_A = 1000/1800 = $ **0.556**, $\\pi_B = $ **0.444**.\n### x = 95\nEqual σ and 95 is halfway → bell heights cancel → $\\gamma_A = \\pi_A = $ **0.556**.\n### x = 93\nExponents: $(93 - 90)^2/8 = 1.125$, $(93 - 100)^2/8 = 6.125$.\n$\\gamma_A = \\dfrac{0.556e^{-1.125}}{0.556e^{-1.125} + 0.444e^{-6.125}} = $ **0.995**: almost certainly Company A. (Exercise solution prepared for the website.)",
    },
  ],

  theory: [
    {
      title: "GMM vs k-means",
      level: "Level 1",
      question: "Explain what a Gaussian Mixture Model is and how it differs from hard clustering such as k-means.",
      solution: "A GMM (pages 824, 828) models the data density as $p(x) = \\sum_k\\pi_k\\mathcal N(x \\mid \\mu_k, \\Sigma_k)$: K Gaussian components, each a cluster, with mixing weights summing to 1. It is **soft clustering**: each point gets a responsibility (probability) for every cluster, and clusters may overlap. k-means is **hard**: each point joins exactly one cluster and clusters don't overlap. GMM also learns each cluster's **shape and orientation** through $\\Sigma_k$ and its **size** through $\\pi_k$, whereas k-means implicitly assumes round, equally sized clusters. Both are fitted iteratively; GMM uses EM, which increases the likelihood each cycle.",
    },
    {
      title: "Latent variables and responsibilities",
      level: "Level 2",
      question: "Explain the role of the latent variable z in a GMM and derive the responsibility $\\gamma(z_k)$ using Bayes' theorem.",
      solution: "z is a hidden 1-of-K binary vector naming the component that generated x (page 841): $z_k \\in \\{0, 1\\}$, $\\sum_k z_k = 1$. Its marginal is $p(z_k = 1) = \\pi_k$, i.e. $p(\\mathbf z) = \\prod_k\\pi_k^{z_k}$, and given z, x is Gaussian: $p(x \\mid z_k = 1) = \\mathcal N(x \\mid \\mu_k, \\Sigma_k)$ (page 844). Summing the joint over z gives $p(x) = \\sum_k\\pi_k\\mathcal N(x \\mid \\mu_k, \\Sigma_k)$. By Bayes' theorem (page 845): $\\gamma(z_k) = p(z_k = 1 \\mid x) = \\dfrac{p(z_k = 1)p(x \\mid z_k = 1)}{\\sum_j p(z_j = 1)p(x \\mid z_j = 1)} = \\dfrac{\\pi_k\\mathcal N(x \\mid \\mu_k, \\Sigma_k)}{\\sum_j\\pi_j\\mathcal N(x \\mid \\mu_j, \\Sigma_j)}$. $\\pi_k$ is the prior; $\\gamma(z_k)$ is the posterior after observing x.",
    },
    {
      title: "Why EM, and the EM steps",
      level: "Level 2",
      question: "Why can't the GMM likelihood be maximised in closed form? Describe the EM algorithm for a GMM, including the update equations.",
      solution: "The log-likelihood $\\sum_n\\ln\\{\\sum_k\\pi_k\\mathcal N(x_n \\mid \\mu_k, \\Sigma_k)\\}$ has a **sum inside the log** (page 846), so setting derivatives to zero gives equations in which the responsibilities depend on the parameters and vice versa (coupled, page 852): no closed form. **EM (pages 854–855):** (1) initialise $\\mu_k, \\Sigma_k, \\pi_k$ and compute the log-likelihood; (2) **E-step:** $\\gamma(z_{nk}) = \\pi_k\\mathcal N(x_n \\mid \\mu_k, \\Sigma_k)/\\sum_j\\pi_j\\mathcal N(x_n \\mid \\mu_j, \\Sigma_j)$; (3) **M-step:** $N_k = \\sum_n\\gamma(z_{nk})$, $\\mu_k = \\frac{1}{N_k}\\sum_n\\gamma(z_{nk})x_n$, $\\Sigma_k = \\frac{1}{N_k}\\sum_n\\gamma(z_{nk})(x_n - \\mu_k)(x_n - \\mu_k)^T$, $\\pi_k = N_k/N$ (from a Lagrange multiplier with $\\lambda = -N$, page 850); (4) re-evaluate the log-likelihood and repeat until its change (or the parameters' change) is below a threshold. Each cycle cannot decrease the likelihood.",
    },
    {
      title: "Challenges and applications",
      level: "Level 1",
      question: "List the main applications and challenges of GMMs.",
      solution: "**Applications (page 835):** soft clustering (points belong to several clusters with probabilities); density estimation (a smooth model of the data distribution); anomaly detection (low-likelihood points are unusual), e.g. segmenting students by activity for health programmes (page 867). **Challenges (pages 834, 847):** the Gaussian assumption may not fit the data; K must usually be chosen in advance; the likelihood has singularities when a component collapses onto one point; and EM can converge to a local maximum depending on initialisation. The PDF notes that a Bayesian treatment handles singularities and the choice of K.",
    },
  ],

  quiz: [
    {
      topic: "Concept",
      q: "GMM is called a soft clustering method because…",
      options: ["clusters must not overlap", "each point gets a probability of belonging to each cluster", "it uses only one Gaussian", "it ignores the variance"],
      answer: 1,
      why: "Page 824: soft clustering assigns probabilities; clusters may overlap.",
      wrong: ["That's hard clustering.", null, "A mixture has several.", "Variance (covariance) is a key parameter."],
    },
    {
      topic: "Concept",
      q: "In a GMM, the mixing coefficients $\\pi_k$ must…",
      options: ["sum to 1 and lie between 0 and 1", "all be equal", "sum to K", "be negative for small clusters"],
      answer: 0,
      why: "$\\sum\\pi_k = 1$, $0 \\le \\pi_k \\le 1$ (page 843).",
      wrong: [null, "Only in special cases.", "They sum to 1.", "Probabilities can't be negative."],
    },
    {
      topic: "Concept",
      q: "Which GMM parameter describes the shape and orientation of a cluster?",
      options: ["Mean $\\mu_k$", "Covariance $\\Sigma_k$", "Mixing coefficient $\\pi_k$", "K"],
      answer: 1,
      why: "Page 829: covariance → shape and orientation.",
      wrong: ["The mean is the centre.", null, "The weight is importance.", "K is the number of components."],
    },
    {
      topic: "Concept",
      type: "num",
      q: "Share prices: 1000 points from company A and 800 from company B. Mixing coefficient $\\pi_A$? (3 decimals)",
      answer: 0.556,
      tol: 0.001,
      why: "$1000/1800 = 0.556$.",
    },
    {
      topic: "Responsibility",
      q: "The responsibility $\\gamma(z_k)$ is…",
      options: ["the prior probability of component k", "the posterior probability that component k generated x", "the variance of component k", "the log-likelihood"],
      answer: 1,
      why: "$\\gamma(z_k) = p(z_k = 1 \\mid x)$ via Bayes' theorem (page 845).",
      wrong: ["That's $\\pi_k$.", null, "No.", "No."],
    },
    {
      topic: "Responsibility",
      type: "num",
      q: "$\\pi_1 = 0.6$, $\\pi_2 = 0.4$, $\\mu_1 = 90$, $\\mu_2 = 100$, $\\sigma_1 = \\sigma_2 = 5$. Responsibility of component 1 for x = 95?",
      answer: 0.6,
      tol: 0.005,
      why: "Halfway with equal σ: the Gaussians cancel, leaving 0.6/(0.6 + 0.4) (page 859).",
    },
    {
      topic: "Responsibility",
      type: "num",
      q: "Same model. Responsibility of component 1 for x = 92? (2 decimals)",
      answer: 0.83,
      tol: 0.005,
      why: "$0.6e^{-0.08}/(0.6e^{-0.08} + 0.4e^{-1.28}) = 0.5539/0.6651 = 0.83$ (page 862).",
    },
    {
      topic: "EM",
      q: "Why is EM needed to fit a GMM?",
      options: ["The data are always discrete", "The log-likelihood has a sum inside the logarithm, so there is no closed-form solution", "Gaussians have no mean", "To choose the number of components"],
      answer: 1,
      why: "Page 846: the log no longer acts directly on the Gaussian.",
      wrong: ["GMMs model continuous data.", null, "They do.", "The PDF says K needs a Bayesian treatment (page 847)."],
    },
    {
      topic: "EM",
      q: "In the E-step of EM for a GMM, we…",
      options: ["update the means", "compute the responsibilities using the current parameters", "choose K", "compute $\\pi_k = N_k/N$"],
      answer: 1,
      why: "Page 854: E-step = responsibilities.",
      wrong: ["That's the M-step.", null, "Chosen beforehand.", "That's the M-step."],
    },
    {
      topic: "EM",
      type: "num",
      q: "Responsibilities of component 1 for three points are 0.83, 0.60, 0.31. New $\\pi_1$? (2 decimals)",
      answer: 0.58,
      tol: 0.005,
      why: "$\\pi_1 = N_1/N = 1.74/3 = 0.58$ (page 863).",
    },
    {
      topic: "EM",
      type: "num",
      q: "Responsibilities 0.83, 0.60, 0.31 for x = 92, 95, 98. New $\\mu_1$? (1 decimal)",
      answer: 94.1,
      tol: 0.05,
      why: "$(0.83 \\cdot 92 + 0.6 \\cdot 95 + 0.31 \\cdot 98)/1.74 = 94.1$.",
    },
    {
      topic: "EM",
      q: "During EM, the log-likelihood…",
      options: ["can go up or down", "never decreases from one cycle to the next", "always reaches the global maximum", "stays constant"],
      answer: 1,
      why: "Page 852: each EM cycle is guaranteed not to decrease the likelihood.",
      wrong: ["It cannot go down.", null, "It may stop at a local maximum.", "It increases until convergence."],
    },
    {
      topic: "Worked example",
      type: "num",
      q: "Sedentary step counts {3.2, 3.8, 4.1, 4.5, 4.9}: variance used in the PDF (divide by n)?",
      answer: 0.34,
      tol: 0.005,
      why: "Mean 4.1; squared deviations sum 1.7; 1.7/5 = 0.34 (page 865).",
    },
    {
      topic: "Worked example",
      q: "A GMM application where points with very low likelihood are flagged is…",
      options: ["density estimation", "anomaly detection", "hard clustering", "regression"],
      answer: 1,
      why: "Page 835: unusual points have low likelihood under the GMM.",
      wrong: ["That models the distribution.", null, "GMM is soft.", "Not a GMM application listed."],
    },
  ],
};
