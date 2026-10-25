// AML — Contact Session 11: Unsupervised learning (hierarchical clustering, k-means, EM)
// Source: CourseFiles/AML/ContactSession11-UnsupLearning.pptx (45 slides). Every lesson cites its slides.

export default {
  title: "Unsupervised Learning: Hierarchical Clustering, K-Means & EM",
  source: "ContactSession11-UnsupLearning.pptx · 45 slides",
  quizMode: "step",
  overview:
    "Until now every example came with an answer. Here the data has **no labels**, X = {x⁽¹⁾, …, x⁽ᴺ⁾}, and the goal is to **find sub-groups using similarity** (slide 3). Three approaches: **agglomerative hierarchical clustering** starts with every point alone and keeps merging the two closest clusters, drawing a **dendrogram**; the answer depends on how “distance between clusters” is defined (single link, complete link, group average, Ward). **K-means** fixes K and alternates two steps that both reduce the squared-distance objective J: assign each point to its nearest centre (**E-step**), then move each centre to the mean of its points (**M-step**). **EM for Gaussian mixtures** is the soft version: each point belongs to every cluster with a probability, which handles multimodal data a single Gaussian can't fit. Expect hand-traced k-means iterations and dendrogram merges in the exam.",

  summary: [
    {
      id: "intro",
      heading: "Lesson 1: Unsupervised learning and clustering",
      slides: "3, 19–20",
      blocks: [
        {
          type: "p",
          text: "**Supervised vs unsupervised (slide 3).** Supervised data has (x, y) pairs and we learn to predict y. Unsupervised data has only x; the objective is to find **patterns or sub-groups** using **data similarity**. **Clustering** (slides 19–20): given X, find K groups such that points inside a cluster are closer to each other than to points in other clusters, e.g. height–weight data split into K = 2 groups.",
        },
        {
          type: "table",
          head: ["Approach", "Output", "Must choose"],
          rows: [
            ["Hierarchical (agglomerative)", "A whole tree of nested clusters (dendrogram); cut it at any level", "Distance and linkage"],
            ["K-means", "K hard clusters with centres", "K and initial centres"],
            ["EM / Gaussian mixture", "K soft clusters (membership probabilities) with means and variances", "K and initial parameters"],
          ],
        },
      ],
    },
    {
      id: "hier",
      heading: "Lesson 2: Agglomerative hierarchical clustering",
      slides: "4–14, 18",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "The bottom-up merging algorithm and the four ways of measuring the distance between two clusters.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Basic algorithm (slides 5–6, 18)",
          text: "```flow\nCompute the proximity matrix -> Each point is a cluster -> Merge the two closest clusters -> Update the proximity matrix -> Repeat until one cluster remains\n```\nMore common than divisive (top-down) clustering. The result is drawn as a **dendrogram** (“tree drawing”): the **height of each join = the distance at which the two clusters merged**. The key operation is the **proximity of two clusters**, and the linkage choice distinguishes the algorithms.",
        },
        {
          type: "table",
          caption: "Inter-cluster proximity (slides 11–14)",
          head: ["Linkage", "Distance between clusters A and B", "Behaviour"],
          rows: [
            ["**MIN / single link**", "Closest pair: $\\min_{a \\in A, b \\in B} d(a, b)$", "Can follow long, chain-like shapes; sensitive to noise (chaining)"],
            ["**MAX / complete link**", "Farthest pair: $\\max d(a, b)$ (with similarities: the **least** similar pair)", "Compact, roughly equal-sized clusters; can break large clusters"],
            ["**Group average**", "Average of all pairwise distances", "Compromise between MIN and MAX"],
            ["**Distance between centroids** / Ward's", "Centroid distance / increase in squared error from merging", "Ward ≈ k-means objective"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Similarity vs distance",
          text: "Slides 12–13 use a **similarity** matrix (1 = identical). With similarities, “closest” means the **largest** value; MAX/complete link uses the **least similar** pair, single link the **most** similar pair.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Similarity matrix I1–I5 (slides 12–13)",
          text: "sim(I1, I2) = 0.90, sim(I4, I5) = 0.80, sim(I2, I3) = 0.70, sim(I1, I4) = 0.65…\n*Merges prepared for the website:*\n- **Single link:** {1,2} at 0.90 → {4,5} at 0.80 → {1,2}+3 at 0.70 (sim(2,3)) → all at 0.65.\n- **Complete link:** {1,2} 0.90 → {4,5} 0.80 → 3 + {4,5} at min(0.40, 0.30) = **0.30** → all at 0.10.\n- **Group average:** {1,2} 0.90 → {4,5} 0.80 → {1,2}+{4,5} at (0.65 + 0.20 + 0.60 + 0.50)/4 = **0.4875** → + 3 at 0.375.\nSame data, different linkage, different hierarchy.",
        },
      ],
    },
    {
      id: "hierex",
      heading: "Lesson 3: Worked example: six points, single link",
      slides: "15–17",
      blocks: [
        {
          type: "table",
          caption: "Distance matrix of p1…p6 (slide 15)",
          head: ["", "p1", "p2", "p3", "p4", "p5", "p6"],
          rows: [
            ["p1", "0", "", "", "", "", ""],
            ["p2", "0.24", "0", "", "", "", ""],
            ["p3", "0.22", "0.15", "0", "", "", ""],
            ["p4", "0.37", "0.20", "0.15", "0", "", ""],
            ["p5", "0.34", "0.14", "0.28", "0.29", "0", ""],
            ["p6", "0.23", "0.25", "0.11", "0.22", "0.39", "0"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Single link (MIN), merge by merge (slides 16–17)",
          text: "1. Smallest entry: d(3, 6) = **0.11** → merge {3, 6}. Update with MIN: d({3,6}, 1) = min(0.22, 0.23) = 0.22; to 2: min(0.15, 0.25) = 0.15; to 4: min(0.15, 0.22) = 0.15; to 5: min(0.28, 0.39) = 0.28.\n2. Next smallest: d(2, 5) = **0.14** → {2, 5}.\n3. d({3,6}, {2,5}) = min(d(3,2), d(6,2), d(3,5), d(6,5)) = min(0.15, 0.25, 0.28, 0.39) = **0.15** → {2, 3, 5, 6}.\n4. d(4, {2,3,5,6}) = min(0.20, 0.15, 0.29, 0.22) = **0.15** → add p4.\n5. d(1, rest) = min(0.24, 0.22, 0.37, 0.34, 0.23) = **0.22** → one cluster.",
        },
        { type: "diagram", name: "a11-dendro" },
        {
          type: "callout",
          kind: "example",
          title: "Same data, other linkages",
          text: "*Prepared for the website.* **Complete link:** {3,6} 0.11 → {2,5} 0.14 → {3,6}+4 at max(0.15, 0.22) = **0.22** → 1+{2,5} at max(0.24, 0.34) = **0.34** → all at **0.39**. **Group average:** {3,6} 0.11 → {2,5} 0.14 → {3,6}+4 at (0.15 + 0.22)/2 = **0.185** → {2,5}+{3,4,6} at **0.26** → + p1 at **0.28**.\nSingle link merges p4 into the big group early (chaining through p3); complete link keeps {1, 2, 5} and {3, 4, 6} as two compact groups.",
        },
      ],
    },
    {
      id: "kmeans",
      heading: "Lesson 4: K-means: the objective and the two steps",
      slides: "21–39",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "What k-means minimises, why its two alternating steps each reduce it, and how to trace it by hand.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Distortion measure (slides 22–23)",
          text: "Let $\\mu_k$ be the mean (centre) of cluster k and $r_{nk} \\in \\{0, 1\\}$ with $r_{nk} = 1$ if point $x_n$ is assigned to cluster k.\n$$J = \\sum_{n=1}^{N}\\sum_{k=1}^{K}r_{nk}\\,\\|x_n - \\mu_k\\|^2$$\nK-means finds $\\{\\mu_k\\}$ and $\\{r_{nk}\\}$ that minimise J: the sum of squared distances from each point to its centre.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "E-step and M-step (slides 24–34)",
          text: "**E-step (fix μ, choose r):** J is linear in $r_{nk}$ and each point can be optimised independently, so assign each point to its **closest** centre:\n$$r_{nk} = \\begin{cases}1 & k = \\arg\\min_j\\|x_n - \\mu_j\\|^2\\\\0 & \\text{otherwise}\\end{cases}$$\n**M-step (fix r, choose μ):** J is quadratic in $\\mu_k$; set $\\partial J/\\partial\\mu_k = 2\\sum_n r_{nk}(x_n - \\mu_k) = 0$:\n$$\\mu_k = \\frac{\\sum_n r_{nk}x_n}{\\sum_n r_{nk}} = \\frac{\\text{sum of the points in cluster } k}{\\text{number of points in cluster } k}$$\n**Algorithm (slide 35):** initialise μ; repeat E-step, M-step until μ stops changing.",
        },
        {
          type: "p",
          text: "**Convergence (slide 39).** Each E-step and each M-step can only lower (or keep) J, so J decreases monotonically and the algorithm stops when J no longer changes significantly (or after a maximum number of iterations). The **initial centres affect the result**: k-means finds a local minimum, so run it several times with different initialisations.",
        },
        {
          type: "callout",
          kind: "example",
          title: "1-D example (slide 21)",
          text: "Data 2, 3, 4, 10, 11, 12, 20, 25, 30; K = 2; initial μ₁ = 2, μ₂ = 4.\n| Iter | C₁ | C₂ | μ₁ | μ₂ |\n|---|---|---|---|---|\n| 1 | {2, 3} | {4, 10, 11, 12, 20, 25, 30} | 2.5 | 16 |\n| 2 | {2, 3, 4} | {10, 11, 12, 20, 25, 30} | 3 | 18 |\n| 3 | {2, 3, 4, 10} | {11, 12, 20, 25, 30} | 4.75 | 19.6 |\n| 4 | {2, 3, 4, 10, 11, 12} | {20, 25, 30} | 7 | 25 |\n| 5 | same | same | 7 | 25 → **converged** |\nE.g. iteration 3: 10 is |10 − 3| = 7 from μ₁ but |10 − 18| = 8 from μ₂, so it moves to C₁.",
        },
        { type: "diagram", name: "a11-kmeans" },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): slide 21",
          text: "Iteration 2 reads “μ2 = (10+11+12+20+25+30)/=18”; the divisor is **6** (108/6 = 18).",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common mistakes",
          text: "- Recomputing a centre before all points are assigned: do **all** E-step assignments first, then all M-step means.\n- Ties: state a rule (e.g. assign to the lower-index cluster).\n- Thinking k-means finds the global minimum: it depends on the initial centres.",
        },
      ],
    },
    {
      id: "em",
      heading: "Lesson 5: Mixture models and the EM algorithm",
      slides: "40–44",
      blocks: [
        {
          type: "p",
          text: "**Multimodal data (slides 40–41).** A Gaussian is intrinsically **unimodal**, so one Gaussian can't fit data with several peaks, such as the Old Faithful geyser data (eruption length vs waiting time), which has two clear groups. **Mixture distributions (slide 42)** are linear combinations of basic distributions: $p(x) = \\sum_k \\pi_k\\,\\mathcal N(x \\mid \\mu_k, \\sigma_k^2)$, with mixing weights $\\pi_k$ summing to 1.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "EM clustering (slide 43)",
          text: "EM finds **maximum-likelihood** estimates of model parameters when data is **incomplete** (here, the cluster of each point is unknown).\n- **E-step:** given the current Gaussians, compute for each point the **probability** that it belongs to each cluster (its responsibility): $\\gamma_{nk} = \\frac{\\pi_k\\mathcal N(x_n \\mid \\mu_k, \\sigma_k^2)}{\\sum_j\\pi_j\\mathcal N(x_n \\mid \\mu_j, \\sigma_j^2)}$.\n- **M-step:** update each Gaussian using those probabilities as weights: $\\mu_k = \\frac{\\sum_n\\gamma_{nk}x_n}{\\sum_n\\gamma_{nk}}$ (similarly for σ_k and π_k).\n- Repeat until the parameters stabilise.\nK-means is the special case with **hard** assignments (γ = 0 or 1) and equal spherical variances.",
        },
        {
          type: "callout",
          kind: "example",
          title: "EM example (slide 44)",
          text: "Data: 1.0, 1.3, 2.2, 2.6, 2.8, 5.0, 7.3, 7.4, 7.5, 7.7, 7.9. Initial means μ₁ = 6.63, μ₂ = 7.57 (both near the right group). After iteration 1: μ₁ = 3.72 (wide, covering the left points), μ₂ = 7.4. At convergence (t = 5): **μ₁ = 2.48, μ₂ = 7.56**, a wide Gaussian over the left group and a narrow one over the tight right group. Check: mean(1.0, 1.3, 2.2, 2.6, 2.8, 5.0) = 2.48 and mean(7.3, …, 7.9) = 7.56.",
        },
        {
          type: "table",
          head: ["", "K-means", "EM (Gaussian mixture)"],
          rows: [
            ["Assignment", "Hard: each point in exactly one cluster", "Soft: probability for each cluster"],
            ["Cluster shape", "Spherical, similar size", "Each cluster has its own mean and variance"],
            ["Objective", "Minimise J (squared distances)", "Maximise likelihood"],
            ["Both", "Iterative E/M steps; sensitive to initialisation; need K", ""],
          ],
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "formula",
      title: "K-means",
      text: "$J = \\sum_n\\sum_k r_{nk}\\|x_n - \\mu_k\\|^2$ · E: assign to the nearest μ · M: $\\mu_k$ = mean of its points · repeat until μ stops changing",
    },
    { type: "diagram", name: "a11-kmeans" },
    {
      type: "table",
      head: ["Linkage", "Cluster distance"],
      rows: [["Single (MIN)", "closest pair"], ["Complete (MAX)", "farthest pair"], ["Group average", "mean of all pairs"], ["Ward", "increase in SSE"]],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Show the updated proximity matrix after every merge · dendrogram height = merge distance · k-means: table of iteration, clusters, means · EM = soft k-means for Gaussian mixtures.",
    },
  ],

  glossary: [
    ["Unsupervised learning", "", "Learning structure from unlabelled data"],
    ["Clustering", "", "Grouping similar points"],
    ["Agglomerative clustering", "bottom-up", "Start with singletons, merge the closest clusters"],
    ["Divisive clustering", "top-down", "Start with one cluster, split"],
    ["Dendrogram", "", "Tree diagram of merges; height = merge distance"],
    ["Proximity matrix", "", "Pairwise distances (or similarities)"],
    ["Single link", "MIN", "Cluster distance = closest pair"],
    ["Complete link", "MAX", "Cluster distance = farthest pair"],
    ["Group average", "", "Cluster distance = average pairwise distance"],
    ["Ward's method", "", "Merge that least increases squared error"],
    ["K-means", "", "K hard clusters minimising squared distance to centres"],
    ["Distortion measure", "J", "Σ rₙₖ‖xₙ − μₖ‖²"],
    ["E-step", "", "Assign points (hard in k-means, probabilistic in EM)"],
    ["M-step", "", "Recompute parameters (means) from the assignments"],
    ["Gaussian mixture", "", "Weighted sum of Gaussians for multimodal data"],
    ["EM algorithm", "", "Maximum-likelihood estimation with hidden assignments"],
    ["Responsibility", "γₙₖ", "Probability that point n belongs to cluster k"],
  ],

  examTips: [
    "Hierarchical: after each merge, rewrite the proximity matrix with the new cluster's row computed by the linkage rule.",
    "Check whether the matrix holds distances (merge smallest) or similarities (merge largest).",
    "K-means: a table with columns iteration | clusters | new means; stop when assignments repeat.",
    "Explain k-means vs EM in one line: hard vs soft assignment.",
  ],

  problems: [
    {
      title: "Single-link clustering of six points (slides 15–17)",
      level: "Medium",
      hint: "Smallest entry first: d(3,6) = 0.11.",
      question: "Using the 6 × 6 distance matrix of p1…p6, perform single-link agglomerative clustering. Give the order and height of each merge.",
      solution: "1. {3, 6} at **0.11**.\n2. {2, 5} at **0.14**.\n3. {3, 6} + {2, 5} at min(0.15, 0.25, 0.28, 0.39) = **0.15**.\n4. + p4 at min(0.20, 0.15, 0.29, 0.22) = **0.15**.\n5. + p1 at min(0.24, 0.22, 0.37, 0.34, 0.23) = **0.22**.",
    },
    {
      title: "Complete link on the same matrix",
      level: "Hard",
      hint: "Use the MAXIMUM pairwise distance when updating.",
      question: "Repeat the six-point clustering with complete link.",
      solution: "*Exercise solution prepared for the website.*\n{3,6} 0.11 → {2,5} 0.14 → d({3,6}, 4) = max(0.15, 0.22) = 0.22, d({3,6}, {2,5}) = 0.39, d({3,6}, 1) = 0.23, d({2,5}, 1) = 0.34, d({2,5}, 4) = 0.29 → merge {3,6,4} at **0.22** → next smallest d(1, {2,5}) = **0.34** → final merge {1,2,5} + {3,4,6} at **0.39**.",
    },
    {
      title: "Similarity matrix with MAX and group average (slides 12–13)",
      level: "Medium",
      question: "For the similarity matrix of I1…I5 (I1–I2 0.90, I1–I3 0.10, I1–I4 0.65, I1–I5 0.20, I2–I3 0.70, I2–I4 0.60, I2–I5 0.50, I3–I4 0.40, I3–I5 0.30, I4–I5 0.80), give the merges for complete link and group average.",
      solution: "*Exercise solution prepared for the website.*\nBoth begin {1,2} at 0.90, {4,5} at 0.80.\n**Complete (least similar pair):** sim(3, {1,2}) = min(0.10, 0.70) = 0.10; sim(3, {4,5}) = min(0.40, 0.30) = 0.30; sim({1,2}, {4,5}) = min(0.65, 0.20, 0.60, 0.50) = 0.20 → merge 3 with {4,5} at **0.30**, then everything at **0.10**.\n**Group average:** sim({1,2}, {4,5}) = 1.95/4 = **0.4875**; sim(3, {1,2}) = 0.40; sim(3, {4,5}) = 0.35 → merge {1,2,4,5} at 0.4875, then + 3 at (0.10 + 0.70 + 0.40 + 0.30)/4 = **0.375**.",
    },
    {
      title: "K-means in one dimension (slide 21)",
      level: "Easy",
      question: "Cluster 2, 3, 4, 10, 11, 12, 20, 25, 30 into K = 2 starting from μ₁ = 2, μ₂ = 4. Show every iteration until convergence.",
      solution: "It 1: {2, 3} | {4, …, 30} → μ = (2.5, 16).\nIt 2: {2, 3, 4} | {10, …, 30} → (3, 18).\nIt 3: {2, 3, 4, 10} | {11, …, 30} → (4.75, 19.6).\nIt 4: {2, 3, 4, 10, 11, 12} | {20, 25, 30} → (7, 25).\nIt 5: no change → **converged at μ₁ = 7, μ₂ = 25**.",
    },
    {
      title: "K-means objective",
      level: "Medium",
      question: "Compute J for the final clustering above, and for the clustering after iteration 1 (μ = 2.5, 16 with clusters {2,3} | {4,…,30}).",
      solution: "*Exercise solution prepared for the website.*\nFinal: cluster {2,3,4,10,11,12}, μ = 7 → squares 25 + 16 + 9 + 9 + 16 + 25 = 100; cluster {20,25,30}, μ = 25 → 25 + 0 + 25 = 50 → **J = 150**.\nAfter iteration 1: {2, 3} about 2.5 → 0.5; {4,10,11,12,20,25,30} about 16 → 144 + 36 + 25 + 16 + 16 + 81 + 196 = 514 → **J = 514.5**. J dropped from 514.5 to 150.",
    },
    {
      title: "Different initial centres",
      level: "Hard",
      question: "Run k-means on the same data with initial μ₁ = 10, μ₂ = 30. Do you get the same answer?",
      solution: "*Exercise solution prepared for the website.*\nIt 1: points ≤ 20 go to μ₁ = 10 ({2, 3, 4, 10, 11, 12, 20}, since 20 is equidistant: tie → C₁), {25, 30} to μ₂ → μ = (8.857, 27.5).\nIt 2: 20 is now closer to 27.5? |20 − 8.86| = 11.14 > |20 − 27.5| = 7.5 → moves → {2, …, 12} | {20, 25, 30} → μ = (7, 25).\nIt 3: unchanged → the **same final clusters** here; on other data, a poor start can end in a worse local minimum.",
    },
    {
      title: "Hard vs soft assignment",
      level: "Easy",
      question: "Point x = 5.0 lies between two clusters with means 2.48 and 7.56. How would k-means and EM treat it differently?",
      solution: "*Exercise solution prepared for the website.*\nK-means assigns it entirely to the nearer centre (|5 − 2.48| = 2.52 < 2.56 → cluster 1). EM gives it a probability for each cluster based on both Gaussians (the wide left Gaussian gives it much more density than the narrow right one), so it contributes partially to each mean.",
    },
  ],

  theory: [
    {
      title: "Agglomerative clustering and linkage",
      level: "Medium",
      question: "Describe agglomerative hierarchical clustering and compare single, complete and group-average linkage.",
      solution: "Compute the proximity matrix; start with each point as a cluster; repeatedly merge the two closest clusters and update the matrix until one cluster remains; show the result as a dendrogram with merge heights. Single link uses the closest pair (handles elongated shapes, suffers chaining/noise); complete link uses the farthest pair (compact clusters, may split big ones); group average uses the mean of all pairs (a compromise) (slides 5–14).",
    },
    {
      title: "K-means as optimisation",
      level: "Hard",
      question: "Write the k-means objective and derive the E- and M-steps. Why does it converge?",
      solution: "J = ΣₙΣₖ rₙₖ‖xₙ − μₖ‖². E-step: with μ fixed, J is linear in r and each point is independent, so set rₙₖ = 1 for the nearest centre. M-step: with r fixed, J is quadratic in μₖ; setting ∂J/∂μₖ = −2Σₙrₙₖ(xₙ − μₖ) = 0 gives μₖ = Σₙrₙₖxₙ / Σₙrₙₖ, the cluster mean. Each step cannot increase J and there are finitely many assignments, so J converges (to a local minimum that depends on initialisation) (slides 22–39).",
    },
    {
      title: "Gaussian mixtures and EM",
      level: "Medium",
      question: "Why use a mixture of Gaussians? Describe EM clustering.",
      solution: "A single Gaussian is unimodal and can't fit multimodal data (e.g. Old Faithful). A mixture Σπₖ𝒩(μₖ, σₖ²) can. EM estimates its parameters by maximum likelihood with unknown assignments: the E-step computes each point's probability of belonging to each component; the M-step re-estimates means, variances and weights using those probabilities; repeat until stable. K-means is the hard-assignment special case (slides 40–44).",
    },
  ],

  quiz: [
    { topic: "Basics", q: "Unsupervised learning differs from supervised learning because…", options: ["It uses more data", "The data points carry no labels", "It can't use distances", "It always uses neural nets"], answer: 1, why: "Slide 3.", wrong: ["Not the definition.", null, "Clustering uses distances.", "No."] },
    { topic: "Hierarchical", q: "Agglomerative clustering starts with…", options: ["One cluster of all points", "Each point as its own cluster", "K random centres", "A labelled set"], answer: 1, why: "Bottom-up (slide 5).", wrong: ["That's divisive.", null, "That's k-means.", "Unsupervised."] },
    { topic: "Hierarchical", q: "In a dendrogram, the height of a join represents…", options: ["Cluster size", "The distance at which the clusters merged", "The number of iterations", "The mean of the cluster"], answer: 1, why: "Slide 16.", wrong: ["No.", null, "No.", "No."] },
    { topic: "Hierarchical", q: "Complete (MAX) link defines cluster distance as…", options: ["Closest pair", "Farthest pair", "Average of pairs", "Centroid distance"], answer: 1, why: "Slide 12.", wrong: ["Single link.", null, "Group average.", "Centroid method."] },
    { topic: "Hierarchical", type: "num", q: "Single link: d({3,6}, {2,5}) with d(3,2) = 0.15, d(6,2) = 0.25, d(3,5) = 0.28, d(6,5) = 0.39?", answer: 0.15, tol: 0.001, why: "Minimum." },
    { topic: "Hierarchical", type: "num", q: "Group-average similarity of {I1, I2} and {I4, I5} with pairs 0.65, 0.20, 0.60, 0.50? (4 decimals)", answer: 0.4875, tol: 0.0005, why: "1.95/4." },
    { topic: "K-means", q: "In the k-means E-step, each point is…", options: ["Moved toward the mean", "Assigned to its nearest centre", "Given a probability per cluster", "Removed if far away"], answer: 1, why: "Slide 26.", wrong: ["Points don't move.", null, "That's EM.", "No."] },
    { topic: "K-means", q: "The M-step sets each centre to…", options: ["A random point", "The mean of the points assigned to it", "The median of all points", "The farthest point"], answer: 1, why: "μₖ = Σrₙₖxₙ/Σrₙₖ.", wrong: ["No.", null, "Not k-means.", "No."] },
    { topic: "K-means", type: "num", q: "Iteration 1 of slide 21: μ₂ = mean(4, 10, 11, 12, 20, 25, 30)?", answer: 16, tol: 0.001, why: "112/7." },
    { topic: "K-means", type: "num", q: "Final centres of slide 21's k-means: μ₁ = ?", answer: 7, tol: 0.001, why: "mean(2, 3, 4, 10, 11, 12)." },
    { topic: "K-means", q: "Which is TRUE about k-means?", options: ["It always finds the global minimum", "J never increases from one step to the next", "It needs labels", "It gives soft memberships"], answer: 1, why: "Both steps minimise J (slide 39).", wrong: ["Local minimum; depends on initialisation.", null, "Unsupervised.", "That's EM."] },
    { topic: "EM", q: "A single Gaussian fails on the Old Faithful data because…", options: ["It has too many parameters", "The data is multimodal and a Gaussian is unimodal", "The data has labels", "It can't be computed"], answer: 1, why: "Slides 40–41.", wrong: ["No.", null, "No.", "No."] },
    { topic: "EM", q: "K-means vs EM for Gaussian mixtures: the key difference is…", options: ["K-means needs K, EM doesn't", "Hard vs soft (probabilistic) assignment", "EM can't converge", "K-means uses likelihood"], answer: 1, why: "EM's E-step gives probabilities.", wrong: ["Both need K.", null, "It converges.", "EM uses likelihood."] },
  ],
};
