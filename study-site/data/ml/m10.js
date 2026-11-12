// ML (DSEZG565) — Module 10: Unsupervised learning (k-means, k-medoids, GMM & EM, cluster validity)
// Source: CourseFiles/ML/Machine Learning_Watermarked_ppts_Nov2026.pdf, pages 652–726 (Session 14).
// All "slides" references on this page are PAGE NUMBERS of that consolidated PDF (the open-book exam copy).

export default {
  title: "Unsupervised Learning: Clustering & EM",
  source: "Consolidated PDF (Nov 2026) · pages 652–726 · Session 14",
  quizMode: "step",
  overview:
    "No labels this time: the task is to **find groups** in the data by similarity (page 654). The module covers **k-means** (hard clustering, the E-step/M-step loop, a full worked example, SSE, choosing k with the **elbow method**, limitations and outlier scores), **k-medoids** (robust to outliers), **Gaussian mixture models (GMM)** fitted with the **EM algorithm** (soft clustering, with a numeric E-step and M-step), and **cluster validity** (external, internal and relative measures; SSE, correlation, **silhouette coefficient**). **Page numbers on this page refer to your consolidated exam PDF.**",

  summary: [
    {
      id: "kmeans",
      heading: "Lesson 1: K-means clustering",
      slides: "653–662, 705–706",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Drop k pins on a map at random. Every house joins its nearest pin. Move each pin to the centre of its houses. Houses rejoin their nearest pin. Repeat until nothing moves. The pins are the **centroids**; the groups are the **clusters**."},
        {
          type: "callout",
          kind: "formula",
          title: "Objective and algorithm (pages 655–660)",
          text: "$$J = \\sum_{n=1}^{N}\\sum_{k=1}^{K} r_{nk}\\,\\|x_n - \\mu_k\\|^2$$\n$r_{nk} \\in \\{0, 1\\}$ is a **binary indicator**: 1 if point $x_n$ belongs to cluster k (**1-of-K coding**). Minimise J by alternating:\n- **E-step (assign):** fix the centroids $\\mu_k$; put each point in the cluster with the nearest centroid.\n- **M-step (update):** fix the assignments; move each centroid to the **mean** of its points: $\\mu_k = \\frac{\\sum_n r_{nk}x_n}{\\sum_n r_{nk}}$.\nRepeat until the centroids (or assignments) stop changing.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (pages 661–662): weight and glucose, k = 2",
          text: "Candidates (weight, glucose): 1 (72, 185), 2 (56, 170), 3 (60, 168), 4 (68, 179), 5 (72, 182), 6 (77, 188), 7 (70, 180), 8 (84, 183). Initial centroids = candidates 1 and 2.\n**Iteration 1:** each point joins the nearer centroid (compare squared distances, e.g. candidate 3: to C1 $12^2 + 17^2 = 433$, to C2 $4^2 + 2^2 = 20$ → C2). Clusters **C1 = {1, 4, 5, 6, 7, 8}**, **C2 = {2, 3}**.\nNew centroids: C1 = (73.83, 182.83), C2 = (58, 169).\n**Iteration 2:** the same clusters → **stop after 2 iterations**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Second example (pages 705–706): six points",
          text: "A(1, 2), B(1, 4), C(1, 0), D(10, 2), E(10, 4), F(10, 0); initial centroids A and D. Distances to (1, 2): 0, 2, 2, 9, 9.22, 9.22 → clusters {A, B, C} and {D, E, F}. New centroids (1, 2) and (10, 2) are unchanged → converged in one step.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**K-means = assign to nearest centroid (E), move centroid to the mean (M), repeat.** Always show the distance table and the new means."},
      ],
    },
    {
      id: "kmeans2",
      heading: "Lesson 2: Evaluating k-means, choosing k, limitations, outliers",
      slides: "663–671, 707–710",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "SSE (page 663)",
          text: "$$SSE = \\sum_{i=1}^{K}\\sum_{x \\in C_i}\\text{dist}^2(m_i, x)$$\n$m_i$ = the representative point (the mean) of cluster $C_i$. Between two clusterings prefer the smaller SSE, but **increasing k always reduces SSE**, so a good clustering with a small k can beat a poor one with a larger k.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Elbow method (pages 670, 707)",
          text: "Compute SSE for k = 2, 3, 4, 5, 6… and plot it against k. SSE always falls; choose the k at the **“elbow”**, where the drop suddenly flattens (k = 3 in the slide). You can also simply inspect the data visually.",
        },
        {
          type: "table",
          caption: "Strengths, comments and limitations (pages 664–668, 708–710)",
          head: ["", "Points"],
          rows: [
            ["**Strength**", "Efficient: **O(tkn)** for n objects, k clusters, t iterations (k, t ≪ n). Compare PAM O(k(n−k)²) and CLARA O(ks² + k(n−k))"],
            ["**Comment**", "Often terminates at a **local optimum**: results depend on the **initial centroids** (page 664)"],
            ["**Limitations**", "Problems when clusters differ in **size**, **density** or have **non-globular** shapes; sensitive to **noise and outliers**"],
            ["**Other weaknesses**", "Needs a mean, so only for **continuous** data (use **k-modes** for categorical); **k must be fixed in advance**; can't find **non-convex** clusters"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Naive k-means outlier score (page 671)",
          text: "$$\\text{score}(x) = \\frac{\\text{dist}(x, \\mu_k)}{L_{\\mu_k}}$$\nwhere $L_{\\mu_k}$ is the average distance of all points in cluster k to its centre. The **higher** the ratio, the more likely x is an outlier.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**SSE goes down as k goes up, so look for the elbow.** K-means likes round, similar-sized, similar-density clusters and hates outliers."},
      ],
    },
    {
      id: "kmedoids",
      heading: "Lesson 3: K-medoids",
      slides: "669, 711–715",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "The mean gets dragged by one billionaire in a room of teachers. A **medoid** is an actual person in the room: the one with the smallest total distance to everybody else. Outliers can't drag it."},
        {
          type: "callout",
          kind: "formula",
          title: "K-medoids / PAM (pages 669, 711–712)",
          text: "**Medoid:** the most centrally located object in a cluster, i.e. with the **smallest total (average) dissimilarity** to the others; always an **actual data point**. Works with any distance (Euclidean, Manhattan) or a dissimilarity matrix, so it suits non-numeric data and is **robust to outliers**.\n**PAM** (Partitioning Around Medoids): start with k medoids; repeatedly replace a medoid with a non-medoid if that lowers the total distance. Good for small data, doesn't scale; **CLARA** (PAM on samples) and **CLARANS** (randomised re-sampling) are faster.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (pages 713–715)",
          text: "A(1, 1), B(2, 3), C(4, 1), D(8, 1), E(9, 3), F(11, 1); k = 2; initial medoids A and D.\n**Assign:** clusters {A, B, C} and {D, E, F}.\n**New medoid** = the point with the smallest total distance within its cluster: A 0 + 2.24 + 3 = 5.24; **B 2.24 + 0 + 2.83 = 5.06**; C 5.83 → **B**. Similarly D 5.24, **E 5.06**, F 5.83 → **E**.\n**Reassign** with medoids B(2, 3), E(9, 3): same clusters → **converged**; final medoids **B and E**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 715 distance table",
          text: "Two entries are wrong: F(11, 1) to B(2, 3) is $\\sqrt{81 + 4} = 9.22$ (printed 9.49), and C(4, 1) to E(9, 3) is $\\sqrt{25 + 4} = 5.39$ (printed 5.83). Neither changes the clusters.",
        },
      ],
    },
    {
      id: "gmm",
      heading: "Lesson 4: Gaussian mixture models: soft clustering",
      slides: "672–688, 700–701, 723–726",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "K-means says “this point is in cluster 1, full stop”. A GMM says “this point is **70% cluster 1, 30% cluster 2**”. Each cluster is a bell-shaped blob (a Gaussian) with its own centre, spread and size, and points near a border get **shared membership**."},
        {
          type: "p",
          text: "**Why soft clustering? (pages 673–675)** K-means makes **hard** assignments: overlapping clusters are hard to call, non-circular shapes don't fit, and a small shift can flip a border point. A GMM gives **probabilistic** assignments that quantify the uncertainty. Mixture models don't need to know which sub-population a point came from (the classes are **latent**), so this is unsupervised learning, with parameters found by maximum likelihood.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The mixture model (pages 677–681, 688, 725)",
          text: "$$p(x) = \\sum_{k=1}^{K}\\pi_k\\,\\mathcal{N}(x \\mid \\mu_k, \\Sigma_k), \\qquad \\sum_k\\pi_k = 1$$\n$\\pi_k$ = **mixing coefficient** (weight) of component k; $\\mu_k$ = mean; $\\Sigma_k$ = covariance matrix. θ = all the π, μ, Σ.\nMultivariate Gaussian: $\\mathcal{N}(x; \\mu, \\Sigma) = \\frac{1}{(2\\pi)^{n/2}|\\Sigma|^{1/2}}\\exp\\left(-\\frac12(x - \\mu)^T\\Sigma^{-1}(x - \\mu)\\right)$.\n**Covariance shapes (page 679):** diagonal with equal variances (round), diagonal with unequal variances (axis-aligned ellipse, still uncorrelated), full (tilted ellipse: correlated dimensions).",
        },
        {
          type: "p",
          text: "**Why not one Gaussian? (pages 676, 682)** A Gaussian is **unimodal**; real data such as **Old Faithful geyser** eruptions (length vs time to next eruption) has several modes. A mixture assumes each point came independently from one of several probabilistic clusters.",
        },
        {
          type: "table",
          caption: "scikit-learn GaussianMixture covariance_type (pages 700–701)",
          head: ["Setting", "Cluster shape"],
          rows: [
            ["**full**", "Any ellipsoid: own shape, size and orientation"],
            ["**spherical**", "Spheres, possibly different sizes (variances)"],
            ["**diag**", "Ellipsoids of any size, axes parallel to the coordinate axes (diagonal Σ)"],
            ["**tied**", "All clusters share one covariance (same shape, size and orientation)"],
          ],
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**GMM = several bell curves added up, each with a weight π, centre μ and spread Σ; membership is a probability, not a yes/no.**"},
      ],
    },
    {
      id: "em",
      heading: "Lesson 5: The EM algorithm for GMMs",
      slides: "683–699",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Chicken and egg: if we knew which blob each point belonged to, estimating the blobs would be easy; if we knew the blobs, assigning points would be easy. **EM** alternates: guess memberships from the current blobs (**E**), then re-fit the blobs from those memberships (**M**), and repeat. It is k-means with soft memberships."},
        {
          type: "callout",
          kind: "formula",
          title: "EM for GMM (pages 689–692)",
          text: "**Initialise** π, μ, Σ (and compute the log-likelihood).\n**E-step:** responsibilities $$\\gamma(z_{nk}) = \\frac{\\pi_k\\mathcal{N}(x_n \\mid \\mu_k, \\Sigma_k)}{\\sum_j\\pi_j\\mathcal{N}(x_n \\mid \\mu_j, \\Sigma_j)}$$ = probability that $x_n$ was generated by component k.\n**M-step:** with $N_k = \\sum_n\\gamma(z_{nk})$ (effective number of points in k):\n$$\\mu_k^{new} = \\frac{1}{N_k}\\sum_n\\gamma(z_{nk})x_n, \\quad \\Sigma_k^{new} = \\frac{1}{N_k}\\sum_n\\gamma(z_{nk})(x_n - \\mu_k^{new})(x_n - \\mu_k^{new})^T, \\quad \\pi_k^{new} = \\frac{N_k}{N}$$\n**Log-likelihood:** $\\ln p(X) = \\sum_n\\ln\\sum_k\\pi_k\\mathcal{N}(x_n \\mid \\mu_k, \\Sigma_k)$. Repeat until it (or the parameters) changes less than a threshold.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Practical recipe (page 693)",
          text: "I. Standardise the data if needed. II. Fix the number of clusters. III. Initialise means, covariances, weights. IV. **E-step:** memberships. V. Log-likelihood. VI. **M-step:** re-estimate. VII. New log-likelihood; repeat IV–VII until convergence.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example (pages 694–698): three documents, two clusters",
          text: "Docs (word1, word2): Doc1 (2, 2), Doc2 (4, 5), Doc3 (7, 2). Cluster 1: mean (3, 3), SDs (4, 0.707), weight 0.5. Cluster 2: mean (4, 4), SDs (0.5, 0.707), weight 0.5. Covariances diagonal (off-diagonal 0).\n**E-step:** Doc1: weight × density = 0.0100 (C1) vs 0.0000014 (C2) → memberships **0.9999 / 0.0001**. Doc2: 0.0005 vs 0.0828 (sum 0.0833) → **0.006 / 0.994**. Doc3: 0.0063 vs ≈0 → **1 / 0**.\n**Log-likelihood:** ln(0.0100) + ln(0.0833) + ln(0.0063) = **−12.16**.\n**M-step (cluster 1):** $N_1 = 0.9999 + 0.006 + 1 = 2.006$; mean $= [0.9999(2) + 0.006(4) + 1(7)]/N_1$ and $[0.9999(2) + 0.006(5) + 1(2)]/N_1$ = **(4.50, 2.01)**; weight $\\pi_1 = 2.006/3 = $ **0.67**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 698 “Std.Dev = (6.23, 0.03)”",
          text: "Those numbers are the new **variances** $\\frac{1}{N_1}\\sum\\gamma(x - \\mu)^2$ = (6.23, 0.027). The **standard deviations** are their square roots, about **(2.50, 0.16)**. Use SDs if you plug them back into the density formula as on page 694.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**E-step: who belongs where (probabilities). M-step: re-fit each blob with points weighted by membership. Stop when the log-likelihood stops rising.**"},
      ],
    },
    {
      id: "validity",
      heading: "Lesson 6: Cluster analysis and cluster validity",
      slides: "702–704, 716–722",
      blocks: [
        {
          type: "table",
          caption: "What clustering is and isn't (pages 702–704)",
          head: ["", "Examples"],
          rows: [
            ["**Uses**", "Understanding (group documents, genes, stocks moving together), **summarisation** (reduce large data), e.g. clustering Australian precipitation"],
            ["**Not cluster analysis**", "Supervised classification (has labels), simple segmentation (alphabetical by surname), query results, graph partitioning"],
            ["**Types**", "**Partitional:** non-overlapping subsets, each object in exactly one (k-means). **Hierarchical:** nested clusters as a tree"],
          ],
        },
        {
          type: "p",
          text: "**Why validate? (pages 716–717)** To avoid finding patterns in noise, and to compare algorithms, clusterings or clusters. Aspects: clustering **tendency** (is there non-random structure?), comparison with **external labels**, fit **without** external information, comparing two clusterings, and the **correct number of clusters**.",
        },
        {
          type: "table",
          caption: "Measures of cluster validity (page 718)",
          head: ["Type", "Measures", "Example"],
          rows: [
            ["**External index**", "Match clusters to externally supplied class labels", "Entropy"],
            ["**Internal index**", "Goodness without external information", "SSE"],
            ["**Relative index**", "Compare two clusterings or clusters", "Often an external or internal index used comparatively"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Correlation and silhouette (pages 719, 722)",
          text: "**Correlation:** build the **proximity matrix** and an **incidence matrix** (1 if two points share a cluster, else 0); correlate their n(n−1)/2 upper-triangle entries. High correlation (with similarity) = points in the same cluster are close. Not good for density-based clusters.\n**Silhouette coefficient** for point i: a = average distance to points in **its own** cluster; b = **minimum** over other clusters of the average distance to that cluster's points.\n$$s = 1 - \\frac{a}{b} \\ (a < b), \\qquad s = \\frac{b}{a} - 1 \\ (a \\ge b)$$\nUsually between 0 and 1; **closer to 1 is better**. Average over a cluster or the whole clustering.",
        },
        {
          type: "p",
          text: "**Framework (page 721):** to judge whether an index value is good, compare it with values from **random** data or clusterings: the more atypical the result, the more likely the structure is real. **SSE** is also good for comparing clusterings and estimating k (page 720).",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**External = against true labels (entropy). Internal = no labels (SSE, silhouette). Relative = compare clusterings. Silhouette near 1 = tight and well separated.**"},
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "M10 on one screen",
      head: ["Idea", "Key formula / fact"],
      rows: [
        ["K-means", "Minimise $J = \\sum r_{nk}\\|x_n - \\mu_k\\|^2$: E-step assign, M-step mean; O(tkn); local optimum"],
        ["Evaluate / choose k", "SSE (falls with k) → elbow; outlier score dist/average dist"],
        ["Limitations", "Size, density, non-globular shapes, outliers; continuous data only; k fixed"],
        ["K-medoids (PAM)", "Medoid = real point with the smallest total distance; robust; CLARA, CLARANS"],
        ["GMM", "$p(x) = \\sum\\pi_k\\mathcal{N}(x \\mid \\mu_k, \\Sigma_k)$; soft memberships"],
        ["EM", "E: $\\gamma = \\pi_k\\mathcal{N}_k/\\sum_j\\pi_j\\mathcal{N}_j$; M: $N_k$, weighted μ, Σ, $\\pi = N_k/N$; stop when log-likelihood stalls"],
        ["Validity", "External (entropy) · internal (SSE, silhouette $1 - a/b$) · relative; correlation of proximity and incidence matrices"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "K-means: distance table each iteration, new centroids, stopping reason · k-medoids: total-distance table for medoid choice · EM: show both weight × density values, their sum, responsibilities, then $N_k$, μ, π.",
    },
  ],

  glossary: [
    ["Clustering", "—", "Grouping unlabelled objects by similarity"],
    ["Centroid", "—", "Mean point of a cluster"],
    ["K-means", "—", "Partitional clustering minimising within-cluster squared distance"],
    ["E-step / M-step", "Expectation / Maximisation", "Assign (or compute memberships) / re-estimate parameters"],
    ["1-of-K coding", "$r_{nk}$", "Binary indicator of a point's cluster"],
    ["SSE", "Sum of squared errors", "Total squared distance of points to their cluster centres"],
    ["Elbow method", "—", "Choose k where SSE stops falling steeply"],
    ["Hard / soft clustering", "—", "One cluster per point / probabilistic membership"],
    ["Medoid", "—", "The actual data point with the smallest total dissimilarity in its cluster"],
    ["PAM / CLARA / CLARANS", "Partitioning Around Medoids / Clustering LARge Applications / … based on RANdomized Search", "K-medoid algorithms"],
    ["K-modes", "—", "K-means variant for categorical data"],
    ["GMM", "Gaussian Mixture Model", "Data modelled as a weighted sum of Gaussians"],
    ["Mixing coefficient π", "Component weight", "Share of the mixture belonging to a component"],
    ["Covariance matrix Σ", "—", "Spread and orientation of a Gaussian"],
    ["Responsibility γ(z_nk)", "—", "Probability point n belongs to component k"],
    ["EM algorithm", "Expectation–Maximisation", "Iterative MLE with latent variables"],
    ["Latent variable", "—", "Hidden quantity (which cluster generated a point)"],
    ["External / internal / relative index", "—", "Cluster validity against labels / without labels / comparing clusterings"],
    ["Silhouette coefficient", "—", "$1 - a/b$: cohesion vs separation for a point"],
    ["Incidence matrix", "—", "1 if two points share a cluster, else 0"],
  ],

  examTips: [
    "For k-means, write the distance table (squared distances are fine for comparing), the cluster lists and the recomputed centroids for every iteration, then state why the algorithm stops.",
    "When asked about limitations, give the four (size, density, shape, outliers) plus “k must be chosen” and “local optimum”.",
    "For EM, use the responsibilities formula explicitly, and remember π_k = N_k/N.",
    "For cluster validity, classify the measure (external, internal, relative) before computing it.",
  ],

  problems: [
    {
      title: "K-means: weight and glucose (pages 661–662)",
      level: "From slides",
      question: "Points 1 (72, 185), 2 (56, 170), 3 (60, 168), 4 (68, 179), 5 (72, 182), 6 (77, 188), 7 (70, 180), 8 (84, 183); k = 2 with initial centroids 1 and 2. Find the clusters and the number of iterations.",
      solution: "### Iteration 1\nSquared distances to C1 (72, 185) vs C2 (56, 170): 3 → 433 vs 20 (C2); 4 → 52 vs 225 (C1); 5 → 9 vs 400; 6 → 34 vs 765; 7 → 29 vs 296; 8 → 148 vs 953 → **C1 = {1, 4, 5, 6, 7, 8}, C2 = {2, 3}**.\n### New centroids\nC1 = (443/6, 1097/6) = **(73.83, 182.83)**; C2 = **(58, 169)**.\n### Iteration 2\nSame assignments → **converged after 2 iterations**.",
    },
    {
      title: "K-means: six points (pages 705–706)",
      level: "From slides",
      question: "A(1, 2), B(1, 4), C(1, 0), D(10, 2), E(10, 4), F(10, 0), k = 2, initial centroids A and D. Cluster the points.",
      solution: "Distances to (1, 2): 0, 2, 2, 9, 9.22, 9.22; to (10, 2): 9, 9.22, 9.22, 0, 2, 2 → **{A, B, C}** and **{D, E, F}**. New centroids (1, 2) and (10, 2) are unchanged → **converged**.",
    },
    {
      title: "K-medoids (pages 713–715)",
      level: "From slides",
      question: "A(1, 1), B(2, 3), C(4, 1), D(8, 1), E(9, 3), F(11, 1); k = 2, initial medoids A and D. Find the final medoids.",
      solution: "### Assign\n{A, B, C}, {D, E, F}.\n### Total within-cluster distances\nA 5.24, **B 5.06**, C 5.83; D 5.24, **E 5.06**, F 5.83 → medoids **B, E**.\n### Reassign\nSame clusters → converged. Final medoids **B(2, 3), E(9, 3)**.\n⚠️ Page 715 prints F–B as 9.49 (correct 9.22) and C–E as 5.83 (correct 5.39).",
    },
    {
      title: "EM E-step and M-step (pages 694–698)",
      level: "From slides",
      question: "Doc1 (2, 2), Doc2 (4, 5), Doc3 (7, 2). C1: μ (3, 3), SD (4, 0.707), π 0.5; C2: μ (4, 4), SD (0.5, 0.707), π 0.5; diagonal covariance. Do one E-step, the log-likelihood and the M-step for cluster 1.",
      solution: "### E-step (π × product of 1-D normal densities)\nDoc1: 0.01003 vs 0.0000014 → γ = 0.9999, 0.0001. Doc2: 0.00050 vs 0.0828 → 0.006, 0.994. Doc3: 0.00628 vs ≈0 → 1, 0.\n### Log-likelihood\nln 0.01003 + ln 0.08329 + ln 0.00628 = **−12.16**.\n### M-step, cluster 1\nN₁ = 2.006; μ₁ = (0.9999·2 + 0.006·4 + 7, 0.9999·2 + 0.006·5 + 2)/N₁ = **(4.50, 2.01)**; variances (6.23, 0.027) → SDs (2.50, 0.16); π₁ = 2.006/3 = **0.67**.",
    },
    {
      title: "Silhouette coefficient",
      level: "Level 1",
      question: "A point's average distance to its own cluster is a = 2 and the smallest average distance to another cluster is b = 5. Find its silhouette coefficient. What if a = 5, b = 2?",
      solution: "a < b → s = 1 − a/b = 1 − 0.4 = **0.6** (well placed). a = 5, b = 2 → s = b/a − 1 = **−0.6** (probably in the wrong cluster). Exercise solution prepared for the website.",
    },
    {
      title: "Outlier score",
      level: "Level 2",
      question: "In a cluster, points lie at distances 1, 2, 2, 3 and 12 from the centroid. Compute each point's naive k-means outlier score.",
      solution: "### Average distance\nL = (1 + 2 + 2 + 3 + 12)/5 = 4.\n### Scores (dist/L)\n0.25, 0.5, 0.5, 0.75, **3.0** → the point at distance 12 is the outlier candidate. Exercise solution prepared for the website.",
    },
  ],

  theory: [
    {
      title: "K-means algorithm and its limitations",
      level: "Level 2",
      question: "Describe the k-means algorithm with its objective, and discuss its limitations and how to choose k.",
      solution: "K-means minimises $J = \\sum_n\\sum_k r_{nk}\\|x_n - \\mu_k\\|^2$ (page 655). Initialise k centroids; **E-step:** assign each point to the nearest centroid; **M-step:** recompute each centroid as the mean of its points; repeat until no change. Complexity O(tkn); converges to a **local optimum**, so results depend on initial centroids (page 664). Limitations (pages 665–668, 710): clusters of different **sizes**, **densities** or **non-globular** shapes, **outliers**; needs a mean (continuous data; use k-modes for categorical); k fixed in advance. Choose k with the **elbow method**: plot SSE vs k and take the point where the decrease flattens (pages 670, 707). K-medoids reduces outlier sensitivity.",
    },
    {
      title: "K-means vs GMM",
      level: "Level 2",
      question: "Compare k-means (hard clustering) with Gaussian mixture models (soft clustering).",
      solution: "K-means gives each point to exactly **one** cluster and models clusters implicitly as round regions around centroids; a small shift can flip a border point (page 673). A GMM models the data as $\\sum\\pi_k\\mathcal{N}(\\mu_k, \\Sigma_k)$ and gives each point a **probability** of belonging to each component, quantifying uncertainty; covariances allow **elliptical** clusters of different sizes and orientations (pages 675, 679). Both are fitted iteratively: k-means is essentially EM with hard assignments and equal spherical clusters. GMMs need more parameters and computation; k-means is faster and simpler.",
    },
    {
      title: "The EM algorithm for GMMs",
      level: "Level 3",
      question: "Explain the EM algorithm for Gaussian mixture models, including the E-step and M-step formulas and the convergence criterion.",
      solution: "Goal: maximise the likelihood of data $X$ under $p(x) = \\sum_k\\pi_k\\mathcal{N}(x \\mid \\mu_k, \\Sigma_k)$, where the generating component is **latent**. Initialise π, μ, Σ. **E-step:** responsibilities $\\gamma(z_{nk}) = \\pi_k\\mathcal{N}(x_n \\mid \\mu_k, \\Sigma_k)/\\sum_j\\pi_j\\mathcal{N}(x_n \\mid \\mu_j, \\Sigma_j)$. **M-step:** keep γ fixed and apply MLE: $N_k = \\sum_n\\gamma_{nk}$, $\\mu_k = \\frac{1}{N_k}\\sum\\gamma_{nk}x_n$, $\\Sigma_k = \\frac{1}{N_k}\\sum\\gamma_{nk}(x_n - \\mu_k)(x_n - \\mu_k)^T$, $\\pi_k = N_k/N$. Repeat until the change in log-likelihood $\\sum_n\\ln\\sum_k\\pi_k\\mathcal{N}(x_n \\mid \\mu_k, \\Sigma_k)$ (or in the parameters) falls below a threshold (pages 689–692). Example: three documents, log-likelihood −12.16 after the first E-step (page 697).",
    },
    {
      title: "Cluster validity",
      level: "Level 2",
      question: "Why do we evaluate clusterings, and what are external, internal and relative measures? Explain the silhouette coefficient.",
      solution: "We validate to avoid finding patterns in noise and to compare algorithms, clusterings or clusters; aspects include clustering tendency, agreement with external labels, fit without external information, comparing clusterings and finding the right number of clusters (pages 716–717). **External** indices compare with known labels (entropy); **internal** indices use only the data (SSE); **relative** indices compare clusterings (page 718). Correlation between the proximity and incidence matrices is another internal check (page 719). **Silhouette** (page 722): a = mean distance to own cluster, b = smallest mean distance to another cluster, s = 1 − a/b (if a < b); near 1 means cohesive and well separated; averaged over clusters or the whole clustering.",
    },
  ],

  quiz: [
    { topic: "K-means", q: "In k-means, the M-step…", options: ["assigns points to the nearest centroid", "moves each centroid to the mean of its points", "computes probabilities", "chooses k"], answer: 1, why: "Page 659." },
    { topic: "K-means", type: "num", q: "Glucose example: new C1 weight coordinate = (72 + 68 + 72 + 77 + 70 + 84)/6? (2 decimals)", answer: 73.83, tol: 0.01, why: "443/6." },
    { topic: "K-means", q: "Increasing k in k-means always…", options: ["increases SSE", "decreases (or keeps) SSE", "removes outliers", "changes the distance metric"], answer: 1, why: "Page 663: so we use the elbow." },
    { topic: "K-means", q: "Which is NOT a k-means limitation?", options: ["Differing cluster sizes", "Non-globular shapes", "Outliers", "Requires labelled data"], answer: 3, why: "It's unsupervised." },
    { topic: "K-means", q: "K-means typically converges to…", options: ["the global optimum", "a local optimum", "k = 1", "a medoid"], answer: 1, why: "Page 710." },
    { topic: "K-medoids", q: "A medoid is…", options: ["the mean of the cluster", "an actual data point with the smallest total distance to the others", "the farthest point", "a random point"], answer: 1, why: "Page 711." },
    { topic: "K-medoids", type: "num", q: "Total distance from B(2, 3) to A(1, 1) and C(4, 1)? (2 decimals)", answer: 5.06, tol: 0.01, why: "2.24 + 2.83." },
    { topic: "GMM", q: "GMMs perform…", options: ["hard clustering", "soft (probabilistic) clustering", "supervised classification", "dimensionality reduction"], answer: 1, why: "Page 675." },
    { topic: "GMM", q: "The mixing coefficients π_k of a GMM must…", options: ["be equal", "sum to 1", "be integers", "equal the means"], answer: 1, why: "They are probabilities." },
    { topic: "GMM", q: "covariance_type = \"tied\" means…", options: ["all clusters are spheres", "all clusters share one covariance matrix", "axes are parallel", "each cluster has its own full covariance"], answer: 1, why: "Page 700." },
    { topic: "EM", type: "num", q: "Weight1·N1 = 0.0005 and Weight2·N2 = 0.0828 for a point. Its responsibility for cluster 2? (3 decimals)", answer: 0.994, tol: 0.002, why: "0.0828/0.0833." },
    { topic: "EM", type: "num", q: "N₁ = 2.006 out of 3 points. New mixing weight π₁? (2 decimals)", answer: 0.67, tol: 0.005, why: "N_k/N." },
    { topic: "Validity", q: "Entropy against known class labels is an…", options: ["internal index", "external index", "relative index", "elbow measure"], answer: 1, why: "Page 718." },
    { topic: "Validity", type: "num", q: "Silhouette with a = 1, b = 4?", answer: 0.75, tol: 0.001, why: "1 − 1/4." },
  ],
};
