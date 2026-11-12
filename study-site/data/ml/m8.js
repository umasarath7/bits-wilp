// ML (DSEZG565) — Module 8: Bayesian learning (MLE, MAP, Bayes optimal, Gibbs, Naive Bayes)
// Source: CourseFiles/ML/Machine Learning_Watermarked_ppts_Nov2026.pdf, pages 486–576 (Session 11).
// All "slides" references on this page are PAGE NUMBERS of that consolidated PDF (the open-book exam copy).

export default {
  title: "Bayesian Learning & Naive Bayes",
  source: "Consolidated PDF (Nov 2026) · pages 486–576 · Session 11",
  quizMode: "step",
  overview:
    "Bayesian learning treats a model's parameters and hypotheses as things we are **uncertain** about, and uses **probability** to decide. Two questions run through the module: *which parameter value makes my data most likely?* (**MLE**) and *which value is most believable once I also use what I knew beforehand?* (**MAP**). From there come the **Bayes optimal** and **Gibbs** classifiers, and the most practical result, the **Naive Bayes classifier**: for categorical features (with **Laplace smoothing**), continuous features (**Gaussian NB**) and text (**multinomial** and **Bernoulli** models). It also explains why least squares and the logistic log-loss are not arbitrary: both are MLEs. **Page numbers on this page refer to your consolidated exam PDF.**",

  summary: [
    {
      id: "params",
      heading: "Lesson 1: Parameters, likelihood and Bayes' theorem",
      slides: "487–492",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "A **parameter** θ (theta) is the dial that sets a distribution's shape: the bias of a coin, the mean of a bell curve, the weights of a regression. **Likelihood** asks: *if the dial were set to θ, how probable is the data I actually saw?* Bayes' theorem then lets us flip that around to *how probable is θ, now that I've seen the data?*"},
        {
          type: "p",
          text: "**Why this module exists (page 487):** two questions left open earlier. *Where does the logistic-regression cost come from?* and *why is least squares a reasonable cost for linear regression?* Both answers are **maximum likelihood**. The running example (pages 488–490) is car price vs mileage: X, Y both continuous (regression), both binned (Low/Medium/High), or X continuous with Y a class label (classification). A **distribution = model + parameter θ**; e.g. CarPrice = 8.5 + 0.5·Mileage − 1.5·Mileage² has θ = (θ₀, θ₁, θ₂) with feature map x = [1, M, M²].",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Bayes' theorem for parameters (page 492)",
          text: "$$P(\\theta \\mid \\text{data}) = \\frac{P(\\text{data} \\mid \\theta)\\,P(\\theta)}{P(\\text{data})}$$\n- $P(\\theta)$: **prior**, belief about θ *before* seeing data.\n- $P(\\text{data} \\mid \\theta) = L(\\theta)$: **likelihood**.\n- $P(\\theta \\mid \\text{data})$: **posterior**, belief *after* seeing data.\n- $P(\\text{data})$: evidence (same for every θ, so it can be ignored when comparing).\nIn hypothesis language: $P(h \\mid D) = P(D \\mid h)P(h)/P(D)$.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "The i.i.d. assumption (page 491)",
          text: "Samples $X_1, \\dots, X_n$ are **independent and identically distributed**: each has the same PMF (discrete) or PDF (continuous) $f(X \\mid \\theta)$, and they don't influence each other. That is what lets the likelihood become a **product**.",
        },
      ],
    },
    {
      id: "mle",
      heading: "Lesson 2: Maximum likelihood estimation (MLE)",
      slides: "493–501, 510–517",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Try every possible dial setting and keep the one under which your data would have been **most likely** to appear. Products of many small probabilities are awkward, so we take logs: the same θ wins, and products become sums."},
        {
          type: "callout",
          kind: "formula",
          title: "The 3-step MLE recipe (pages 493, 501)",
          text: "$$L(\\theta) = \\prod_{i=1}^{n} f(X_i \\mid \\theta), \\qquad LL(\\theta) = \\log L(\\theta) = \\sum_{i=1}^{n} \\log f(X_i \\mid \\theta), \\qquad \\theta_{MLE} = \\arg\\max_{\\theta} LL(\\theta)$$\n1. **Determine** the formula for $LL(\\theta)$.\n2. **Differentiate** $LL(\\theta)$ with respect to each θ.\n3. **Solve** derivative = 0 (or use gradient ascent if there is no closed form).\nLog is monotonic, so $L$ and $LL$ have the same maximiser.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (pages 512–513): a discrete PMF",
          text: "X takes 0, 1, 2, 3 with $P = \\frac{2\\theta}{3}, \\frac{\\theta}{3}, \\frac{2(1-\\theta)}{3}, \\frac{1-\\theta}{3}$. Observed counts: 0 twice, 1 three times, 2 three times, 3 twice.\n**1.** $L(\\theta) = \\left(\\frac{1-\\theta}{3}\\right)^2\\left(\\frac{2\\theta}{3}\\right)^2\\left(\\frac{2(1-\\theta)}{3}\\right)^3\\left(\\frac{\\theta}{3}\\right)^3$, so $LL = 5\\log\\theta + 5\\log(1-\\theta) + \\text{const}$.\n**2.** $\\frac{dLL}{d\\theta} = \\frac{5}{\\theta} - \\frac{5}{1-\\theta} = \\frac{5 - 10\\theta}{\\theta(1-\\theta)}$.\n**3.** Set to 0 → $\\hat\\theta_{MLE} = 0.5$.",
        },
        {
          type: "table",
          caption: "MLE explains the costs you already know (pages 494–500, 514–517)",
          head: ["Model / noise", "Likelihood", "What maximising it means"],
          rows: [
            ["Linear regression, **Gaussian** noise $\\epsilon \\sim N(0, \\sigma^2)$", "$y^{(i)} \\mid x^{(i)}; \\theta \\sim N(\\theta^Tx^{(i)}, \\sigma^2)$", "Maximising LL = minimising $J(\\theta) = \\frac12\\sum(y^{(i)} - \\theta^Tx^{(i)})^2$: **least squares is the MLE**"],
            ["Linear regression, **Laplacian** noise (Problem 0)", "$\\propto \\exp(-|y_i - \\theta^Tx_i|/b)$", "Minimise the **mean absolute error (L1)**: more robust to outliers"],
            ["Bernoulli coin $X_i \\sim \\text{Ber}(p)$", "$\\prod p^{x_i}(1-p)^{1-x_i}$", "$\\hat p = \\frac{1}{n}\\sum X_i = k/n$"],
            ["Logistic regression, Bernoulli labels", "$\\prod \\sigma_i^{y_i}(1-\\sigma_i)^{1-y_i}$", "Maximise $\\sum[y_i\\ln\\sigma_i + (1-y_i)\\ln(1-\\sigma_i)]$ = minimise the **log-loss**; **no closed form** → gradient ascent"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem 1 (pages 516–517): one gradient-ascent step for logistic regression",
          text: "Data x = 1, 2, 3, 4 with y = 0, 0, 1, 1; start θ = (0, 0), α = 0.1.\n(b) Every σ = 0.5 → $LL = 4\\ln 0.5 = -2.773$.\n(c) $\\frac{\\partial LL}{\\partial\\theta_j} = \\sum(y_i - \\sigma_i)x_{ij}$; residuals (−0.5, −0.5, 0.5, 0.5) → $\\partial/\\partial\\theta_0 = 0$, $\\partial/\\partial\\theta_1 = 2$ → θ = (0, 0.2).\n(d) σ = 0.550, 0.599, 0.646, 0.690 → **LL = −2.520** (up from −2.773). The gradient equations are non-linear in θ, so there's no closed form: iterate.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**MLE = write L, take log, differentiate, solve.** Gaussian noise → least squares; Laplacian noise → absolute error; Bernoulli → k/n; logistic → log-loss with gradient ascent."},
      ],
    },
    {
      id: "map",
      heading: "Lesson 3: MAP, the Bayes optimal classifier and the Gibbs classifier",
      slides: "502–509, 518–519",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "MLE trusts only the data. **MAP** also weighs in what you believed beforehand (the prior). If only 20% of coins are biased, you need strong evidence before you decide yours is one of them. With a **uniform** prior, MAP and MLE are the same."},
        {
          type: "callout",
          kind: "formula",
          title: "MAP (page 502)",
          text: "$$\\theta_{MAP} = \\arg\\max_{\\theta} f(\\theta \\mid X_1, \\dots, X_n) = \\arg\\max_{\\theta} f(X \\mid \\theta)\\,f(\\theta)$$\n**Brute-force MAP:** (1) determine the prior of each hypothesis, (2) compute the posterior of every hypothesis, (3) choose the highest → $h_{MAP}$. For a continuous θ: prior → posterior ∝ likelihood × prior → differentiate → solve.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Page 503 example",
          text: "Likelihood $x(1-x)^{y-1}$ with y = 3 and prior 2x → posterior ∝ $2x^2(1-x)^2$. Differentiate: $4x(1-x)(1-2x) = 0$ → x ∈ {0, 0.5, 1}; values {0, 0.125, 0} → $\\hat x_{MAP} = 0.5$.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Bayes optimal classifier (pages 505–507)",
          text: "Don't just use the single best hypothesis: let **every** hypothesis vote, weighted by its posterior.\n$$v_{opt} = \\arg\\max_{v_j \\in V} \\sum_{h_i \\in H} P(v_j \\mid h_i)\\,P(h_i \\mid D)$$\n*Page 506:* $P(h_1 \\mid D) = 0.4$, $P(h_2 \\mid D) = P(h_3 \\mid D) = 0.3$; $h_1$ says +, $h_2$ and $h_3$ say −. $h_{MAP} = h_1$ predicts **+**, but the weighted vote is + : 0.4 vs − : 0.6, so the Bayes optimal answer is **−**. *$h_{MAP}(x)$ is not necessarily the most probable classification.*",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Gibbs classifier (page 508)",
          text: "Bayes optimal is the best possible but **expensive** with many hypotheses. **Gibbs:** pick **one** hypothesis at random according to $P(h \\mid D)$ and use it. Surprising guarantee (Haussler et al.; Mitchell ch. 6): $E[\\text{error}_{Gibbs}] \\le 2\\,E[\\text{error}_{BayesOptimal}]$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem 2 (pages 518–519): MLE vs MAP vs Bayes optimal",
          text: "Three coin kinds: P(H) = 0.1, 0.4, 0.8 with priors 0.4, 0.4, 0.2. Tosses D = {H, H, T}.\n(a) $P(D \\mid h) = p^2(1-p)$ = 0.009, 0.096, **0.128** → $h_{MLE} = h_3$.\n(b) Posteriors ∝ likelihood × prior = 0.0036, 0.0384, 0.0256 → normalised **0.053, 0.568, 0.379** → $h_{MAP} = h_2$. The prior (0.4 vs 0.2) outweighs $h_3$'s likelihood advantage.\n(c) $h_{MAP}$: P(H) = 0.4 → predict **Tails**. Bayes optimal: $P(H \\mid D) = 0.1(0.053) + 0.4(0.568) + 0.8(0.379) \\approx 0.536$ → predict **Heads**. They disagree.\n(d) Uniform prior → MAP = MLE = $h_3$. Many more tosses → the likelihood dominates and MAP and MLE converge; **priors matter most when data is scarce**.",
        },
        {
          type: "table",
          caption: "Summary (pages 504, 509)",
          head: ["Method", "Chooses", "Uses prior?", "When"],
          rows: [
            ["**MLE**", "θ making the data most likely", "No", "Large samples: an excellent estimator"],
            ["**MAP**", "Most probable θ given the data", "Yes", "Little data, real prior knowledge; = MLE under a uniform prior"],
            ["**Bayes optimal**", "Class with the largest posterior-weighted vote", "Yes", "Best possible accuracy, expensive"],
            ["**Gibbs**", "One random hypothesis by posterior", "Yes", "Cheap; error at most 2× Bayes optimal"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**MLE: data only. MAP: data × prior. Bayes optimal: everyone votes. Gibbs: draw one voter at random (≤ 2× the error).**"},
      ],
    },
    {
      id: "nb",
      heading: "Lesson 4: The Naive Bayes classifier (categorical features)",
      slides: "520–537",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "To classify, compare P(class) × P(features | class) across classes. Estimating the full joint of many features needs far too much data, so Naive Bayes **assumes the features are independent within each class**: multiply one small table per feature."},
        {
          type: "p",
          text: "**Generative vs discriminative (pages 521–522).** **Generative** models (Gaussians, **Naive Bayes**, mixtures of multinomials or Gaussians, Bayesian networks) model $P(x \\mid y)$ and $P(y)$: you could sample from them to *generate* data. **Discriminative** models (e.g. logistic regression) model $P(y \\mid x)$ directly. To predict you don't need the denominator: $\\arg\\max_y P(y \\mid x) = \\arg\\max_y P(x \\mid y)P(y)$. Applications include spam filtering, sentiment and digit recognition (5 vs 6 from binary pixels, page 524).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Naive Bayes (pages 525–527, 531)",
          text: "The full joint $P(X_1, \\dots, X_n \\mid Y)$ needs about $2^n - 1$ parameters per class for n binary features. **Conditional independence:** $P(X_1, \\dots, X_n \\mid Y) = \\prod_i P(X_i \\mid Y)$, so\n$$Y_{new} = \\arg\\max_{y_k} P(Y = y_k)\\prod_i P(X_i^{new} \\mid Y = y_k)$$\n**Train:** estimate $P(Y = y_k) = \\frac{\\#D\\{Y = y_k\\}}{|D|}$ and each $P(X_i = x_{ij} \\mid Y = y_k)$ by counting. **Classify:** multiply, take the argmax.",
        },
        {
          type: "callout",
          kind: "example",
          title: "EnjoySport (pages 528–530)",
          text: "7 days (3 Yes, 4 No). Test X = ⟨Sunny, Warm, Normal, Strong, Change⟩.\nYes: $\\frac33 \\cdot \\frac33 \\cdot \\frac23 \\cdot \\frac23 \\cdot \\frac13 \\cdot \\frac37 = 0.0635$\nNo: $\\frac24 \\cdot \\frac14 \\cdot \\frac14 \\cdot \\frac34 \\cdot \\frac24 \\cdot \\frac47 = 0.006696$\n→ **EnjoySport = Yes**; normalised $P(\\text{Yes} \\mid X) = 0.0635/(0.0635 + 0.0067) = 0.905$ (P(X) cancels).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "The zero-frequency problem (page 532)",
          text: "Test X = ⟨**Rainy**, Warm, Normal, Breeze, Same⟩. Rainy never occurs with Yes, so P(Rainy | Yes) = 0/3 and the whole Yes score is **0**, whatever the other features say. NB predicts No (0.00223). One unseen value wipes out all other evidence.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Laplace (add-one) smoothing and the m-estimate (pages 533–537)",
          text: "$$P(A_i \\mid C) = \\frac{N_{ic} + 1}{N_c + d} \\qquad \\text{(Laplace)} \\qquad\\qquad P(A_i \\mid C) = \\frac{N_{ic} + m\\,p}{N_c + m} \\qquad \\text{(m-estimate)}$$\n$N_{ic}$ = instances of class c with value $A_i$; $N_c$ = instances in class c; **d = number of distinct values of the attribute**; p = prior estimate (e.g. 1/d); m = equivalent sample size. No probability is ever 0.\n*EnjoySport Rainy case (Sky d = 2, AirTemp d = 3, others 2):* Yes $= \\frac15 \\cdot \\frac46 \\cdot \\frac35 \\cdot \\frac25 \\cdot \\frac35 \\cdot \\frac37 = 0.00823$; No $= \\frac36 \\cdot \\frac27 \\cdot \\frac26 \\cdot \\frac26 \\cdot \\frac36 \\cdot \\frac47 = 0.00454$ → **Yes**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem 3 (pages 538–539): telecom churn",
          text: "Classify {Premium, Low usage, 3+ calls}; priors Yes 3/7, No 4/7.\n(a) Unsmoothed: Yes $= \\frac37 \\cdot \\frac03 \\cdot \\frac33 \\cdot \\frac23 = 0$; No $= \\frac47 \\cdot \\frac34 \\cdot \\frac14 \\cdot \\frac04 = 0$: **both zero**, cannot decide.\n(b) Laplace (Plan d = 2, Usage d = 2, Calls d = 3): Yes $= \\frac37 \\cdot \\frac15 \\cdot \\frac45 \\cdot \\frac36 = 0.0343$; No $= \\frac47 \\cdot \\frac46 \\cdot \\frac26 \\cdot \\frac17 = 0.0181$ → **Churn = Yes**, P(Yes | x) ≈ **0.654**.\n(c) Plan and usage are probably correlated (premium users use more), so independence is doubtful, but the argmax often survives because only the **ranking** matters.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**NB score = prior × product of per-feature fractions; the denominator of each fraction is the class count.** A zero kills everything → add 1 on top, add d (number of values) below."},
      ],
    },
    {
      id: "gnb",
      heading: "Lesson 5: Continuous features: Gaussian Naive Bayes",
      slides: "540–549",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Humidity can be 61.3% or 83.7%: there's no table of counts. Instead, assume each class's values follow a **bell curve**, learn its mean and variance, and read the curve's height at the new value."},
        {
          type: "callout",
          kind: "formula",
          title: "Gaussian NB (pages 540–542)",
          text: "$$P(X_i = x \\mid Y = y_k) = \\frac{1}{\\sqrt{2\\pi\\sigma_{ik}^2}}\\exp\\left(-\\frac{(x - \\mu_{ik})^2}{2\\sigma_{ik}^2}\\right)$$\n**Learn** per (feature, class): $\\mu_{ik} = \\frac{1}{N_k}\\sum x$, $\\sigma_{ik}^2 = \\frac{1}{N_k - 1}\\sum(x - \\mu_{ik})^2$ (sample variance; the MLE divides by $N_k$). **Predict:** prior × product of densities (mixed with categorical tables), argmax.\nA density is **not a probability** (it can exceed 1), and products of many small numbers **underflow**: in practice compare **sums of logs**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "EnjoySport with Humidity (pages 543–545)",
          text: "Yes: 85, 83, 85 → μ = 84.33, s² = 1.33. No: 80, 70, 90, 50 → μ = 72.5, s² = 291.67.\nAt humidity 60: $N(60; 84.33, 1.33) = 1.28 \\times 10^{-97}$ (60 is far outside Yes's narrow curve); $N(60; 72.5, 291.67) = 0.0179$.\nTest ⟨Rainy, Warm, 60, Breeze, Same⟩: Yes ≈ $4.1 \\times 10^{-99}$, No ≈ 0.00016 → **EnjoySport = No**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem 4 (pages 546–547): study hours and gender",
          text: "Classify {3.5 hours, Male}. Pass: hours 4.5, 7, 8, 9 → μ = 7.125, s² = 3.73; 2 of 4 male; prior 4/9. Fail: 2, 4, 2.5, 3, 8.3 → μ = 3.96, s² = 6.43; 3 of 5 male; prior 5/9.\nPass: $\\frac24 \\times N(3.5) = 0.0355 \\times \\frac49 = 0.0079$. Fail: $\\frac35 \\times 0.1547 \\times \\frac59 = 0.0516$ → **Fail**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem 5 (pages 548–549): oven temperature and shift",
          text: "Classify Temp 79, Night. Good: 70, 72, 74, 76 → μ = 73, s² = 6.667; P(Night | Good) = 1/4; prior 4/7. Bad: 80, 84, 88 → μ = 84, s² = 16; P(Night | Bad) = 2/3; prior 3/7.\nf(79 | Good) = 0.01038 → score 0.00148; f(79 | Bad) = 0.04566 → score 0.01305 → **Bad**, P(Bad | x) ≈ **0.898**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 549, part (d)",
          text: "The population variances are **5** (Good) and **10.67** (Bad: (16 + 0 + 16)/3), not “5 and 8.75” as printed. The slide's scores (≈ 0.0007 vs 0.0108, still Bad) are the ones you get with 10.67, so only the quoted variance is a typo.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Continuous feature → bell curve per class (μ, s²) → plug in the value → multiply like any other NB term.** Work in logs."},
      ],
    },
    {
      id: "text",
      heading: "Lesson 6: Text classification: multinomial vs Bernoulli Naive Bayes",
      slides: "550–565",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Turn a document into a **bag of words**: ignore order, keep word counts (page 551). **Multinomial NB** cares *how many times* each word appears. **Bernoulli NB** only asks *is the word present or absent?*, and absent words count as evidence too."},
        {
          type: "table",
          caption: "The two text models (pages 552–562, 565)",
          head: ["", "Multinomial", "Bernoulli"],
          rows: [
            ["**Feature**", "Word counts (every token in the test doc)", "One binary feature per **vocabulary** word: present / absent"],
            ["**P(w | c) with Laplace**", "$\\frac{\\text{count}(w, c) + 1}{\\text{tokens in } c + |V|}$", "$\\frac{\\text{docs of } c \\text{ containing } w + 1}{\\text{docs in } c + 2}$"],
            ["**Score**", "prior × ∏ over **tokens** of P(w | c) (repeats multiply again)", "prior × ∏ over **all vocabulary**: P(w | c) if present, 1 − P(w | c) if absent"],
            ["**scikit-learn**", "MultinomialNB", "BernoulliNB"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "“A very close game” (pages 552–554)",
          text: "Sports has 11 words, Not-sports 9, vocabulary |V| = 14; priors 3/5, 2/5. Without smoothing, “close” never appears in Sports → score 0.\nLaplace: Sports $= \\frac{3}{25} \\cdot \\frac{2}{25} \\cdot \\frac{1}{25} \\cdot \\frac{3}{25} \\cdot \\frac35 = 2.765 \\times 10^{-5}$; Not $= \\frac{2}{23} \\cdot \\frac{1}{23} \\cdot \\frac{2}{23} \\cdot \\frac{1}{23} \\cdot \\frac25 = 0.572 \\times 10^{-5}$ → **Sports**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "The China example (pages 556–562, Manning IR book)",
          text: "Train: “Chinese Beijing Chinese”, “Chinese Chinese Shanghai”, “Chinese Macao” (China); “Tokyo Japan Chinese” (not). Test $d_5$ = “Chinese Chinese Chinese Tokyo Japan”. |V| = 6; China has 8 tokens, not-China 3.\n**Multinomial:** P(Chinese | c) = 6/14 = 3/7, P(Tokyo | c) = P(Japan | c) = 1/14; not-c: 2/9 each → $\\frac34(\\frac37)^3(\\frac1{14})^2 \\approx 0.0003$ vs $\\frac14(\\frac29)^5 \\approx 0.0001$ → **China**.\n**Bernoulli:** counts documents, uses absent words (Beijing, Shanghai, Macao) → 0.005 vs 0.022 → **not China**. The models disagree.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Problem 6 (pages 563–564): spam vs ham",
          text: "V = {win, cash, meeting, report}; test “win win win meeting”; priors Spam 2/5, Ham 3/5.\n(a) Multinomial: Spam 7 tokens (win 5, cash 2), Ham 8 → P(win | S) = 6/11, P(meeting | S) = 1/11, P(win | H) = 1/12, P(meeting | H) = 5/12. Spam $= \\frac25(\\frac6{11})^3\\frac1{11} = 0.0059$, Ham $= \\frac35(\\frac1{12})^3\\frac5{12} = 0.00014$ → **Spam**.\n(b) Bernoulli (win, meeting present; cash, report absent): Spam $= \\frac25 \\cdot \\frac34 \\cdot (1 - \\frac34) \\cdot \\frac14 \\cdot (1 - \\frac14) = 0.0141$; Ham $= \\frac35 \\cdot \\frac15 \\cdot (1 - \\frac35) \\cdot \\frac45 \\cdot (1 - \\frac35) = 0.0154$ → **Ham** (narrowly).\n(c) Multinomial counts “win” three times; Bernoulli ignores repetition and lets absent words vote.",
        },
        {
          type: "table",
          caption: "Naive Bayes family summary (page 565)",
          head: ["Variant", "Feature type", "P(xᵢ | y)", "Smoothing", "scikit-learn"],
          rows: [
            ["Gaussian", "Continuous", "$N(x_i; \\mu_{iy}, \\sigma^2_{iy})$", "var_smoothing (added to σ²)", "GaussianNB"],
            ["Multinomial", "Counts / word frequencies", "$\\frac{N_{iy} + \\alpha}{N_y + \\alpha|V|}$", "Laplace α = 1", "MultinomialNB"],
            ["Bernoulli", "Binary present/absent", "$p x_i + (1 - p)(1 - x_i)$, $p = \\frac{N_{iy} + \\alpha}{N_y + 2\\alpha}$", "Laplace α = 1", "BernoulliNB"],
            ["Categorical", "Discrete categories", "$\\frac{N_{icy} + \\alpha}{N_y + \\alpha d_i}$", "Laplace α = 1", "CategoricalNB"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Multinomial counts words; Bernoulli checks presence and also lets missing words vote.** Denominators: tokens + |V| (multinomial), documents + 2 (Bernoulli)."},
      ],
    },
    {
      id: "lrnb",
      heading: "Lesson 7: Logistic regression vs Naive Bayes, and Bayesian learning in practice",
      slides: "566–574",
      blocks: [
        {
          type: "p",
          text: "**Why not learn P(Y | X) directly? (page 566)** That is exactly what logistic regression does. **Page 567:** the logistic form of P(Y | X) is **precisely** what Gaussian Naive Bayes implies under three assumptions: $Y \\sim \\text{Bernoulli}(\\pi)$; $X_i \\mid Y = k \\sim N(\\mu_{ik}, \\sigma_i^2)$ with $\\sigma_i$ **not depending on the class**; and $X_i$ conditionally independent given Y. So logistic regression is a close **discriminative** relative of GNB, though the two can give different results. (With class-specific variances, as in the GNB exercises, the boundary is not exactly linear; pages 572–574 are a self-read derivation, where the sign convention is $w = -\\theta$.)",
        },
        {
          type: "table",
          caption: "Bayesian learning: strengths and practical issues (pages 568–569)",
          head: ["Strengths", "Practical issues"],
          rows: [
            ["Each training example can **incrementally** raise or lower the probability of a hypothesis", "Needs initial knowledge of **many probabilities** (from background knowledge, earlier data, distribution assumptions)"],
            ["More flexible than methods that **eliminate** a hypothesis after one inconsistent example", "**Computational cost** of the Bayes optimal hypothesis (linear in the number of candidate hypotheses)"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Generative NB models P(x | y)P(y); discriminative LR models P(y | x). With shared variances, GNB implies the logistic form.**"},
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "M8 on one screen",
      head: ["Idea", "Key formula / fact"],
      rows: [
        ["Bayes' theorem", "$P(\\theta \\mid D) = P(D \\mid \\theta)P(\\theta)/P(D)$: posterior ∝ likelihood × prior"],
        ["MLE", "$\\arg\\max\\sum\\log f(X_i \\mid \\theta)$: log, differentiate, solve (gradient ascent if no closed form)"],
        ["MLE links", "Gaussian noise → least squares; Laplacian → absolute error; Bernoulli → k/n; logistic → log-loss"],
        ["MAP", "$\\arg\\max f(X \\mid \\theta)f(\\theta)$; = MLE under a uniform prior; prior matters when data is scarce"],
        ["Bayes optimal", "$\\arg\\max_v\\sum_h P(v \\mid h)P(h \\mid D)$; Gibbs error ≤ 2× Bayes optimal"],
        ["Naive Bayes", "$\\arg\\max_y P(y)\\prod_i P(x_i \\mid y)$ (conditional independence)"],
        ["Laplace", "$(N_{ic} + 1)/(N_c + d)$, d = distinct values; m-estimate $(N_{ic} + mp)/(N_c + m)$"],
        ["Gaussian NB", "Per class μ, s²; plug value into $N(x; \\mu, \\sigma^2)$; use logs"],
        ["Text NB", "Multinomial: (count + 1)/(tokens + |V|); Bernoulli: (docs + 1)/(docs + 2), absent words count"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Show priors first · list every conditional fraction with its denominator · state when you smooth and the value of d · normalise if asked for a probability · for MAP vs MLE, say why they differ (the prior).",
    },
  ],

  glossary: [
    ["Parameter θ", "Theta", "Value(s) that fix a distribution or model"],
    ["i.i.d.", "Independent and identically distributed", "Samples don't affect each other and share one distribution"],
    ["Likelihood L(θ)", "—", "Probability (density) of the observed data as a function of θ"],
    ["Log-likelihood LL(θ)", "—", "log L(θ): turns products into sums, same maximiser"],
    ["MLE", "Maximum Likelihood Estimation", "θ that makes the data most likely"],
    ["Prior / posterior", "—", "Belief before / after seeing the data"],
    ["MAP", "Maximum A Posteriori", "θ (or h) with the highest posterior"],
    ["Bayes optimal classifier", "—", "Posterior-weighted vote of all hypotheses"],
    ["Gibbs classifier", "—", "Classify with one hypothesis drawn by posterior probability"],
    ["Version space", "—", "Hypotheses consistent with the training data"],
    ["Generative / discriminative", "—", "Models P(x | y)P(y) / models P(y | x) directly"],
    ["Naive Bayes", "NB", "Bayes classifier assuming features independent given the class"],
    ["Conditional independence", "—", "$P(X_1..X_n \\mid Y) = \\prod P(X_i \\mid Y)$"],
    ["Zero-frequency problem", "—", "An unseen value gives probability 0 and wipes out the score"],
    ["Laplace smoothing", "Add-one smoothing", "(count + 1)/(class count + d)"],
    ["m-estimate", "—", "(count + m·p)/(class count + m)"],
    ["Gaussian NB", "GNB", "NB with a normal density per continuous feature and class"],
    ["Bag of words", "—", "Document as unordered word counts"],
    ["Multinomial / Bernoulli NB", "—", "Text NB using word counts / word presence-absence"],
    ["|V|", "Vocabulary size", "Number of distinct words in the training documents"],
  ],

  examTips: [
    "MLE derivations: always write L, then LL, then the derivative, then solve, and say why log is allowed (monotonic).",
    "For MLE vs MAP vs Bayes optimal questions, compute likelihoods, then posteriors (normalise), then the posterior-weighted prediction, and comment on the role of the prior.",
    "Naive Bayes: priors → table of conditional fractions → products → compare → normalise if a probability is asked. Smooth only when a zero appears (or when told to).",
    "Text NB: state which model (multinomial or Bernoulli) and its denominator; in Bernoulli remember the (1 − p) terms for absent words.",
  ],

  problems: [
    {
      title: "Discrete MLE (pages 511–513)",
      level: "From slides",
      question: "P(X = 0, 1, 2, 3) = 2θ/3, θ/3, 2(1−θ)/3, (1−θ)/3. Observed: 0 ×2, 1 ×3, 2 ×3, 3 ×2. Find the MLE of θ.",
      solution: "### Likelihood\n$L(\\theta) = (2\\theta/3)^2(\\theta/3)^3(2(1-\\theta)/3)^3((1-\\theta)/3)^2$.\n### Log\n$LL = 5\\log\\theta + 5\\log(1-\\theta) + \\text{const}$.\n### Differentiate and solve\n$\\frac{5}{\\theta} - \\frac{5}{1-\\theta} = 0$ → **θ̂ = 0.5**.",
    },
    {
      title: "MLE with Laplacian noise (Problem 0, pages 514–515)",
      level: "From slides",
      question: "$y_i = \\theta^Tx_i + e_i$ where $e_i$ is Laplacian noise with scale b: $p(e) = \\frac{1}{2b}e^{-|e|/b}$. Find the MLE of θ and comment on the loss.",
      solution: "### Likelihood\n$L(\\theta) = \\prod \\frac{1}{2b}\\exp(-|y_i - \\theta^Tx_i|/b)$.\n### Log\n$LL = -n\\log 2b - \\frac{1}{b}\\sum|y_i - \\theta^Tx_i|$.\n### Maximise\nMaximising LL ⟺ **minimising $\\sum|y_i - \\theta^Tx_i|$**: the mean absolute error (L1 loss), not MSE. L1 is **more robust to outliers**. (With Gaussian noise the same steps give least squares.)",
    },
    {
      title: "Logistic regression gradient ascent (Problem 1, pages 516–517)",
      level: "From slides",
      question: "x = 1, 2, 3, 4; y = 0, 0, 1, 1; model σ(θ₀ + θ₁x); θ = (0, 0), α = 0.1. Find LL, one gradient-ascent step and the new LL.",
      solution: "### LL at (0, 0)\nAll σ = 0.5 → $LL = 4\\ln 0.5$ = **−2.773**.\n### Gradient\n$\\partial LL/\\partial\\theta_j = \\sum(y_i - \\sigma_i)x_{ij}$; residuals (−0.5, −0.5, 0.5, 0.5) → (0, 2).\n### Step\nθ = (0, 0) + 0.1·(0, 2) = **(0, 0.2)**.\n### New LL\nσ = 0.550, 0.599, 0.646, 0.690 → ln 0.450 + ln 0.401 + ln 0.646 + ln 0.690 = **−2.520**.\nNo closed form because σ is non-linear in θ → iterate.",
    },
    {
      title: "MLE vs MAP vs Bayes optimal (Problem 2, pages 518–519)",
      level: "From slides",
      question: "Coins with P(H) = 0.1, 0.4, 0.8 and priors 0.4, 0.4, 0.2. D = {H, H, T}. Find h_MLE, h_MAP and the Bayes optimal prediction for the next toss.",
      solution: "### Likelihoods\n$p^2(1-p)$: 0.009, 0.096, 0.128 → **h_MLE = h₃**.\n### Posteriors\n× prior: 0.0036, 0.0384, 0.0256 (sum 0.0676) → 0.053, **0.568**, 0.379 → **h_MAP = h₂**.\n### Next toss\nh_MAP: P(H) = 0.4 → Tails. Bayes optimal: 0.1(0.053) + 0.4(0.568) + 0.8(0.379) = **0.536** → **Heads**.\n### Comment\nThe prior pulls MAP away from MLE; with a uniform prior they coincide; with lots of data they converge.",
    },
    {
      title: "EnjoySport with Laplace smoothing (pages 532–537)",
      level: "From slides",
      question: "Using the 7-day EnjoySport table, classify ⟨Rainy, Warm, Normal, Breeze, Same⟩ (a) without and (b) with Laplace smoothing.",
      solution: "### (a) Unsmoothed\nP(Rainy | Yes) = 0/3 → Yes score **0**; No = (2/4)(1/4)(1/4)(1/4)(2/4)(4/7) = **0.00223** → No (forced by one zero).\n### (b) Laplace, d = 2, 3, 2, 2, 2\nYes = (1/5)(4/6)(3/5)(2/5)(3/5)(3/7) = **0.00823**; No = (3/6)(2/7)(2/6)(2/6)(3/6)(4/7) = **0.00454** → **Yes**.",
    },
    {
      title: "Churn with Laplace smoothing (Problem 3, pages 538–539)",
      level: "From slides",
      question: "Classify {Plan = Premium, Usage = Low, Calls = 3+} from the 7-row churn table, unsmoothed and with Laplace smoothing; give P(Churn = Yes | x).",
      solution: "### Priors\nYes 3/7, No 4/7.\n### Unsmoothed\nYes: (3/7)(0/3)(3/3)(2/3) = 0; No: (4/7)(3/4)(1/4)(0/4) = 0 → undecidable.\n### Laplace (d = 2, 2, 3)\nYes: (3/7)(1/5)(4/5)(3/6) = **0.0343**; No: (4/7)(4/6)(2/6)(1/7) = **0.0181** → **Yes**; P = 0.0343/0.0524 ≈ **0.654**.",
    },
    {
      title: "Gaussian NB: study hours (Problem 4, pages 546–547)",
      level: "From slides",
      question: "Hours/gender/result: (4.5, M, Pass), (7, F, Pass), (2, M, Fail), (4, F, Fail), (2.5, M, Fail), (3, F, Fail), (8.3, M, Fail), (8, F, Pass), (9, M, Pass). Classify {3.5 hours, Male}.",
      solution: "### Per class\nPass: μ = 7.125, s² = 3.73; P(M | Pass) = 2/4; prior 4/9. Fail: μ = 3.96, s² = 6.43; P(M | Fail) = 3/5; prior 5/9.\n### Densities at 3.5\nPass 0.0355; Fail 0.1547.\n### Scores\nPass = (2/4)(0.0355)(4/9) = **0.0079**; Fail = (3/5)(0.1547)(5/9) = **0.0516** → **Fail**.",
    },
    {
      title: "Gaussian NB: oven batches (Problem 5, pages 548–549)",
      level: "From slides",
      question: "Temp/shift/quality: 70 D G, 72 D G, 74 N G, 76 D G, 80 N B, 84 N B, 88 D B. Classify Temp = 79, Night (sample variance) and give P(Bad | x).",
      solution: "### Per class\nGood μ = 73, s² = 6.667, P(N | G) = 1/4, prior 4/7. Bad μ = 84, s² = 16, P(N | B) = 2/3, prior 3/7.\n### Densities\nf(79 | G) = exp(−36/13.33)/√(2π·6.667) = 0.01038; f(79 | B) = exp(−25/32)/√(2π·16) = 0.04566.\n### Scores\nGood 0.00148, Bad **0.01305** → **Bad**; P(Bad | x) = **0.898**.\n⚠️ Part (d): population variances are 5 and **10.67** (slide prints 8.75); scores 0.0007 vs 0.0108, still Bad.",
    },
    {
      title: "Multinomial vs Bernoulli (Problem 6, pages 563–564)",
      level: "From slides",
      question: "Spam: “win cash win”, “win win win cash”. Ham: “cash meeting”, “report meeting meeting”, “meeting report cash”. Classify “win win win meeting” with Laplace smoothing under both models.",
      solution: "### Multinomial (|V| = 4)\nSpam 7 tokens: P(win) = 6/11, P(meeting) = 1/11. Ham 8 tokens: P(win) = 1/12, P(meeting) = 5/12.\nSpam = (2/5)(6/11)³(1/11) = **0.0059**; Ham = (3/5)(1/12)³(5/12) = **0.00014** → **Spam**.\n### Bernoulli\nSpam: win 3/4, cash 3/4, meeting 1/4, report 1/4. Ham: win 1/5, cash 3/5, meeting 4/5, report 3/5.\nSpam = (2/5)(3/4)(1/4)(1/4)(3/4) = **0.0141**; Ham = (3/5)(1/5)(2/5)(4/5)(2/5) = **0.0154** → **Ham**.\n### Why\nMultinomial rewards “win” ×3; Bernoulli ignores repeats and penalises the absent words.",
    },
    {
      title: "Bayes optimal vs MAP (pages 506–507)",
      level: "Level 1",
      question: "P(h₁ | D) = 0.4, P(h₂ | D) = 0.3, P(h₃ | D) = 0.3; h₁ predicts +, h₂ and h₃ predict −. What do MAP and Bayes optimal predict?",
      solution: "MAP uses h₁ → **+**. Bayes optimal: P(+ | D) = 0.4, P(− | D) = 0.3 + 0.3 = 0.6 → **−**. The single most probable hypothesis is outvoted.",
    },
    {
      title: "Gaussian density by hand",
      level: "Level 2",
      question: "A class has μ = 72.5, s² = 291.67 for humidity. Compute N(60; μ, s²).",
      solution: "### Formula\n$\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/2\\sigma^2}$.\n### Working\n$\\sqrt{2\\pi \\times 291.67} = 42.81$; $(60 - 72.5)^2 = 156.25$; $156.25/583.33 = 0.2679$; $e^{-0.2679} = 0.765$.\n### Answer\n0.765/42.81 = **0.0179** (matches page 544).",
    },
  ],

  theory: [
    {
      title: "MLE vs MAP",
      level: "Level 2",
      question: "Explain MLE and MAP estimation, how they relate through Bayes' theorem, and when they give the same answer.",
      solution: "**MLE** picks θ maximising the likelihood $L(\\theta) = \\prod f(X_i \\mid \\theta)$ (i.i.d. data): it uses only the data. **MAP** picks θ maximising the posterior $f(\\theta \\mid X) \\propto f(X \\mid \\theta)f(\\theta)$: it combines the likelihood with a **prior**. By Bayes' theorem posterior ∝ likelihood × prior, so MAP = MLE when the prior is **uniform**, and the two converge as the sample grows (the likelihood dominates). The prior matters most with **little data** (coin example, pages 518–519: MLE h₃, MAP h₂ after only three tosses).",
    },
    {
      title: "Why is least squares a reasonable cost?",
      level: "Level 2",
      question: "Show how the least-squares cost and the logistic log-loss arise from maximum likelihood.",
      solution: "Linear regression: $y^{(i)} = \\theta^Tx^{(i)} + \\epsilon^{(i)}$ with $\\epsilon \\sim N(0, \\sigma^2)$ i.i.d. Then $y^{(i)} \\mid x^{(i)} \\sim N(\\theta^Tx^{(i)}, \\sigma^2)$ and $LL = \\text{const} - \\frac{1}{2\\sigma^2}\\sum(y^{(i)} - \\theta^Tx^{(i)})^2$, so maximising LL = minimising $\\frac12\\sum(y - \\theta^Tx)^2$ (pages 494–498). Logistic regression: labels are Bernoulli with $P(y = 1) = \\sigma(\\theta^Tx)$; $LL = \\sum[y\\ln\\sigma + (1 - y)\\ln(1 - \\sigma)]$, the negative of the log-loss; there is no closed form, so use gradient ascent (pages 499–500). With Laplacian noise MLE gives the L1 (absolute) loss instead (Problem 0).",
    },
    {
      title: "Bayes optimal and Gibbs classifiers",
      level: "Level 2",
      question: "Describe the Bayes optimal classifier and the Gibbs classifier, and compare their cost and error.",
      solution: "**Bayes optimal** (page 505): classify x as $\\arg\\max_v\\sum_h P(v \\mid h)P(h \\mid D)$, combining all hypotheses weighted by their posteriors; no classifier using the same hypothesis space and prior does better on average, and it can disagree with $h_{MAP}$ (page 506). It is **expensive** when there are many hypotheses. **Gibbs** (page 508): draw a single hypothesis at random according to $P(h \\mid D)$ and use it. Under a correct prior its expected error is at most **twice** the Bayes optimal error, at a fraction of the cost.",
    },
    {
      title: "Naive Bayes: assumption, zero frequency and variants",
      level: "Level 3",
      question: "State the Naive Bayes assumption and why it is needed, explain the zero-frequency problem and its fix, and contrast Gaussian, multinomial and Bernoulli NB.",
      solution: "Bayes classifier: $\\arg\\max_y P(x \\mid y)P(y)$. Estimating the full joint $P(x_1..x_n \\mid y)$ needs ~$2^n - 1$ parameters per class (page 525), so NB assumes **conditional independence**: $P(x \\mid y) = \\prod P(x_i \\mid y)$. **Zero frequency** (page 532): a value never seen with a class gives P = 0 and zeroes the whole product; **Laplace smoothing** $(N_{ic} + 1)/(N_c + d)$ (or the m-estimate) fixes it. **Variants** (page 565): Gaussian for continuous features (per-class μ, σ²); multinomial for word counts ((count + 1)/(tokens + |V|)); Bernoulli for word presence ((docs + 1)/(docs + 2), absent words contribute 1 − p); categorical for general discrete features. Even when independence is violated, the argmax ranking is often still correct.",
    },
    {
      title: "Logistic regression and Gaussian Naive Bayes",
      level: "Level 3",
      question: "How are logistic regression and Gaussian Naive Bayes related?",
      solution: "GNB is **generative** (learns P(Y) and P(X | Y)); LR is **discriminative** (learns P(Y | X) directly). If $Y \\sim \\text{Bernoulli}(\\pi)$, $X_i \\mid Y = k \\sim N(\\mu_{ik}, \\sigma_i^2)$ with variances **shared across classes**, and the $X_i$ are conditionally independent, then the posterior P(Y = 1 | X) implied by GNB has exactly the logistic (sigmoid of a linear function) form (page 567, derivation pages 572–574). So LR can be viewed as a closely related alternative to GNB, though the two estimate parameters differently and can give different results; with class-specific variances the GNB boundary is not exactly linear.",
    },
  ],

  quiz: [
    { topic: "MLE", type: "num", q: "MLE of a Bernoulli p from 7 heads in 20 tosses?", answer: 0.35, tol: 0.001, why: "$\\hat p = k/n = 7/20$." },
    { topic: "MLE", q: "Maximum likelihood with Gaussian noise in linear regression is equivalent to minimising…", options: ["absolute error", "squared error", "log-loss", "hinge loss"], answer: 1, why: "Pages 494–498.", wrong: ["That comes from Laplacian noise (Problem 0).", null, "That is for logistic regression.", "That is the SVM loss."] },
    { topic: "MLE", q: "Why is there no closed-form MLE for logistic regression?", options: ["The likelihood is not differentiable", "The gradient equations are non-linear in θ", "The data are not i.i.d.", "The prior is unknown"], answer: 1, why: "σ sits inside the sums (page 517)." },
    { topic: "MAP", q: "MAP equals MLE when…", options: ["the data are small", "the prior is uniform", "the likelihood is Gaussian", "never"], answer: 1, why: "Page 504." },
    { topic: "MAP", type: "num", q: "Coin problem: likelihoods 0.009, 0.096, 0.128; priors 0.4, 0.4, 0.2. Posterior of h₂? (3 decimals)", answer: 0.568, tol: 0.002, why: "0.0384/0.0676." },
    { topic: "Bayes optimal", type: "num", q: "Bayes optimal P(H | D) in the coin problem with posteriors 0.053, 0.568, 0.379? (3 decimals)", answer: 0.536, tol: 0.003, why: "0.1(0.053) + 0.4(0.568) + 0.8(0.379)." },
    { topic: "Bayes optimal", q: "The Gibbs classifier's expected error is at most…", options: ["equal to Bayes optimal", "twice Bayes optimal", "half Bayes optimal", "unbounded"], answer: 1, why: "Page 508." },
    { topic: "Naive Bayes", q: "The ‘naive’ assumption is that features are…", options: ["normally distributed", "independent given the class", "equally important", "binary"], answer: 1, why: "Page 526." },
    { topic: "Naive Bayes", type: "num", q: "EnjoySport Yes score = (3/3)(3/3)(2/3)(2/3)(1/3)(3/7)? (4 decimals)", answer: 0.0635, tol: 0.0002, why: "Page 530." },
    { topic: "Naive Bayes", q: "With Laplace smoothing, the denominator for P(Sky = Rainy | Yes) when Yes has 3 days and Sky has 2 values is…", options: ["3", "4", "5", "7"], answer: 2, why: "$N_c + d = 3 + 2$." },
    { topic: "Naive Bayes", q: "Laplace smoothing solves…", options: ["underflow", "the zero-frequency problem", "class imbalance", "missing labels"], answer: 1, why: "Pages 532–535." },
    { topic: "Gaussian NB", q: "In Gaussian NB, why compare sums of log-probabilities?", options: ["Densities are negative", "Products of many small numbers underflow", "Logs remove the prior", "Required by Laplace"], answer: 1, why: "Page 542." },
    { topic: "Text NB", q: "Which NB model lets absent vocabulary words affect the score?", options: ["Multinomial", "Bernoulli", "Gaussian", "Both multinomial and Gaussian"], answer: 1, why: "Pages 559–562." },
    { topic: "Text NB", type: "num", q: "Multinomial with Laplace: ‘win’ appears 5 times in spam, spam has 7 tokens, |V| = 4. P(win | spam)? (3 decimals)", answer: 0.545, tol: 0.002, why: "(5 + 1)/(7 + 4) = 6/11." },
    { topic: "LR vs NB", q: "Logistic regression is…", options: ["generative", "discriminative", "unsupervised", "a Bayesian network"], answer: 1, why: "It models P(Y | X) directly (pages 521, 566)." },
  ],
};
