// AML — Clustering in depth: partitioning (k-means problems, choosing k, elbow), hierarchical (single / complete /
// average linkage problems), density-based (DBSCAN), and cluster evaluation (Hopkins, BCubed, silhouette).
// Source: CourseFiles/AML/Watermark_BITS_WILP_AML.pdf (consolidated open-book PDF), pages 596–702.
// "page N" = page of that PDF. Every number was recomputed in Python; PDF slips are flagged on the page.

export default {
  title: "Clustering in Depth: Linkage, DBSCAN & Cluster Evaluation",
  source: "Consolidated PDF (Watermark_BITS_WILP_AML.pdf) · pages 596–702",
  quizMode: "step",
  overview:
    "Session 11 introduced clustering. This deck (pages 596–702) is the **numerical workbook** for it, and almost every topic ends in a step-by-step problem: a **k-means** run on five 2-D points, choosing **k with the elbow method**, **single-, complete- and average-linkage** hierarchical clustering with dendrograms, **DBSCAN** with ε and MinPts, and three ways to **evaluate** a clustering: the **Hopkins statistic** (is there any cluster structure?), **BCubed** precision/recall (compare with true labels), and the **silhouette coefficient** (how tight and well separated?). **ML overlap:** k-means, the elbow idea and silhouette also appear in ML Module 10; hierarchical linkage, DBSCAN, Hopkins and BCubed are **AML only**. Page numbers refer to your consolidated exam PDF.",

  summary: [
    {
      id: "concepts",
      heading: "Lesson 1: What clustering is, and the three families of methods",
      slides: "599–612",
      blocks: [
        { type: "callout", kind: "tip", title: "🔗 ML overlap: partial", text: "**Shared with ML Module 10:** what clustering is, k-means, choosing k (elbow), silhouette. **AML only:** the method families table, hierarchical linkage problems, DBSCAN, Hopkins statistic, BCubed. **ML only:** k-medoids, GMM/EM details (ML M10)." },
        { type: "callout", kind: "idea", title: "In plain words", text: "Clustering is sorting a pile of unlabelled things into groups so that things **in the same group are alike** and things **in different groups are not** (page 600). Nobody tells you the right groups: it is **learning by observation** (unsupervised, page 601)." },
        {
          type: "p",
          text: "**Applications (pages 602–604):** market segmentation, land use from satellite images, insurance (groups with high claim cost), city planning, earthquake epicentres along faults, image segmentation, grouping web-search results, outlier detection, and as a preprocessing step. **Clustering is subjective** (page 605): the same points can be grouped in different reasonable ways.",
        },
        {
          type: "table",
          caption: "Comparison of clustering methods (pages 608–609, 611)",
          head: ["Family", "Examples", "Cluster shape", "Key idea"],
          rows: [
            ["**Partitioning**", "k-means, k-medoids (PAM)", "Spherical, mutually exclusive", "Pick k centres, relocate points iteratively; distance-based; small–medium data"],
            ["**Hierarchical**", "Agglomerative (AGNES), divisive (DIANA), BIRCH", "Spherical", "Build a tree of merges/splits; **a merge or split can never be undone**"],
            ["**Density-based**", "DBSCAN, OPTICS", "**Arbitrary** shapes", "Clusters are dense regions separated by sparse ones; can filter out outliers"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Distances for numeric attributes (page 612)",
          text: "Euclidean $\\sqrt{\\sum (x_{ik} - x_{jk})^2}$ · Manhattan $\\sum |x_{ik} - x_{jk}|$ · Minkowski $\\left(\\sum |x_{ik} - x_{jk}|^p\\right)^{1/p}$ (p = 1 Manhattan, p = 2 Euclidean).",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Partition = k centres. Hierarchy = tree of merges. Density = crowded regions.** Only density-based finds odd shapes and labels noise." },
      ],
    },
    {
      id: "kmeans",
      heading: "Lesson 2: K-means, worked on paper",
      slides: "614–627, 634–637",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "Drop k flags on the map. Everyone walks to the nearest flag. Move each flag to the middle of its crowd. Repeat until nobody changes flag." },
        {
          type: "p",
          text: "**Concepts (page 614).** Each cluster $C_i$ is represented by its **centroid** (the mean of its points); clusters don't overlap. Quality = **within-cluster variation** (sum of squared distances to the centroid; lower is better).",
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF problem (pages 623–625): A(0, 1), B(3, 0), C(2, 4), D(2, 1), E(3, 5), k = 2",
          text: "**Step 1, distance matrix:** AB 3.16, AC 3.61, AD 2, AE 5, BC 4.12, BD 1.41, BE 5, CD 3, CE 1.41, DE 4.12.\n**Step 2:** start with centroids A and C.\n**Step 3, assign:** B → A (3.16 < 4.12), D → A (2 < 3), E → C (1.41 < 5) → **C1 = {A, B, D}, C2 = {C, E}**.\n**Step 4, new centroids:** C1 = ((0 + 3 + 2)/3, (1 + 0 + 1)/3) = **(1.67, 0.67)**; C2 = ((2 + 3)/2, (4 + 5)/2) = **(2.5, 4.5)**.\n**Step 5, distances to centroids:** A 1.70 / 4.30, B 1.49 / 4.53, C 3.35 / 0.71, D 0.47 / 3.54, E 4.53 / 0.71 → same clusters → **converged** (page 625). SSE = 6.33.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Rounding note: page 624",
          text: "The PDF writes the centroid as (1.66, 0.66), i.e. truncated; 5/3 = 1.67. Its distances 1.69 and 0.48 for A and D are 1.70 and 0.47 with the exact centroid. The clusters are unaffected.",
        },
        {
          type: "callout",
          kind: "example",
          title: "One-dimensional example (page 626)",
          text: "Points 2, 3, 4, 10, 11, 12, 20, 25, 30. **Iteration 1:** C1 = {2, 3}, C2 = {4, 10, 11, 12, 20, 25, 30} → μ1 = 2.5, μ2 = 112/7 = **16**. **Iteration 2:** 4 is closer to 2.5 → C1 = {2, 3, 4}, μ1 = **3**; C2 = {10, 11, 12, 20, 25, 30}, μ2 = 108/6 = **18**; and so on.",
        },
        {
          type: "table",
          caption: "Strengths, weaknesses and fixes (pages 622, 627, 634–637)",
          head: ["Strengths", "Weaknesses", "Fixes"],
          rows: [
            ["Compact, separated clusters; complexity O(nktd); scalable, efficient on large numeric data", "NP-hard; **no guarantee of the global optimum**; result **depends on the initial centres**", "Several runs; hierarchical clustering on a sample to pick starting centres; choose widely separated starting centres"],
            ["–", "Struggles with clusters of **different sizes, densities or non-globular shapes**", "Use many clusters, then merge the pieces"],
            ["–", "Sensitive to scale and outliers", "**Pre-process:** normalise, remove outliers. **Post-process:** drop tiny clusters, split loose (high-SSE) ones, merge close (low-SSE) ones"],
          ],
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Assign to nearest centroid → recompute means → repeat until no change.** Always show the distance table." },
      ],
    },
    {
      id: "choosek",
      heading: "Lesson 3: How many clusters? The √(n/2) rule and the elbow method",
      slides: "628–633, 692",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "More clusters always lower the within-cluster error (with one cluster per point it's zero), so you can't just pick the smallest error. Plot error against k and look for the **elbow**: the point after which adding clusters stops helping much." },
        {
          type: "list",
          items: [
            "**Rule of thumb (page 628):** $k \\approx \\sqrt{n/2}$ for n points. n = 9 → $\\sqrt{4.5} \\approx 2.1$.",
            "**Elbow method:** compute the within-cluster variance for several k; choose the turning point of the curve.",
            "**Cross-validation:** compare an overall quality measure across k.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF elbow problem (pages 629–633): D = {2, 10, 12, 4, 25, 3, 30, 20, 11}",
          text: "The PDF assigns points to the given starting centroids and sums the squared distances **to those centroids**:\n- k = 2 (centroids 3, 10): {2, 3, 4}, {10, 11, 12, 20, 25, 30} → $1 + 1 + 4 + 1 + 100 + 225 + 400 = $ **732**\n- k = 3 (3, 10, 25): {2, 3, 4}, {10, 11, 12}, {20, 25, 30} → $1 + 1 + 4 + 1 + 25 + 25 = $ **57**\n- k = 4 (3, 10, 20, 30): … {20, 25}, {30} → **32**\n- k = 5 (3, 10, 12, 20, 25) → **28**\nThe drop from 732 to 57 is huge, then small (57 → 32 → 28): **elbow at k = 3**.",
        },
        { type: "diagram", name: "a14-elbow" },
        {
          type: "callout",
          kind: "warn",
          title: "Method note: pages 629–632",
          text: "The PDF measures distances from the **starting centroids**, not from the cluster **means** after k-means converges (it also says “Manhattan” but squares the differences). Running real k-means gives SSE **150, 54, 16.5, 15, 13.5** for k = 2…6. The curve is different, but the **elbow is still at k = 3**. In the exam, follow the method the question states.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Error always falls as k grows; pick the bend, not the minimum.** Quick guess: $k \\approx \\sqrt{n/2}$." },
      ],
    },
    {
      id: "hier",
      heading: "Lesson 4: Hierarchical clustering and the three linkages",
      slides: "639–651",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "Start with every point as its own little group. Repeatedly **merge the two closest groups** until one group remains, recording each merge and its distance in a tree, the **dendrogram**. Cut the tree at any height to get that many clusters. The only question is: *how far apart are two groups?* That's the **linkage**." },
        {
          type: "table",
          caption: "Agglomerative vs divisive (pages 639–643)",
          head: ["", "Agglomerative (AGNES)", "Divisive (DIANA)"],
          rows: [
            ["Direction", "Bottom-up: merge", "Top-down: split"],
            ["Starts with", "Each point alone", "All points in one cluster"],
            ["Shared limitation", "A merge can never be undone", "A split can never be undone"],
          ],
        },
        {
          type: "table",
          caption: "Linkage measures (pages 646–650)",
          head: ["Linkage", "Distance between clusters", "Good at", "Weak at"],
          rows: [
            ["**Single** (nearest neighbour, MIN)", "$\\min |p - p'|$ over pairs", "Fast; non-globular shapes", "Noise (creates long chains)"],
            ["**Complete** (farthest neighbour, MAX)", "$\\max |p - p'|$ over pairs", "Cleanly separated, globular clusters", "Outliers and noise"],
            ["**Average**", "$\\frac{1}{n_in_j}\\sum |p - p'|$", "Globular clusters; categorical as well as numeric data", "–"],
          ],
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Single = closest pair, complete = farthest pair, average = mean of all pairs.** Merge the smallest, update the matrix, repeat." },
      ],
    },
    {
      id: "linkage-problems",
      heading: "Lesson 5: Linkage problems, step by step",
      slides: "652–668",
      blocks: [
        { type: "callout", kind: "idea", title: "What am I learning?", text: "The three exam-style linkage problems on the same five points A(2, 2), B(5, 8), C(2, 4), D(4, 3), E(3, 5)." },
        {
          type: "table",
          caption: "Distance matrix (page 652; Euclidean, 1 decimal)",
          head: ["", "A", "B", "C", "D", "E"],
          rows: [
            ["A", "0", "6.7", "2.0", "2.2", "3.2"],
            ["B", "", "0", "5.0", "5.1", "3.6"],
            ["C", "", "", "0", "2.2", "**1.4**"],
            ["D", "", "", "", "0", "2.2"],
            ["E", "", "", "", "", "0"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Single linkage (pages 652–659)",
          text: "1. Smallest = CE 1.4 → merge **{C, E}** at 1.4.\n2. Update with MIN: A–CE = min(2.0, 3.2) = 2.0; B–CE = min(5.0, 3.6) = 3.6; D–CE = min(2.2, 2.2) = 2.2 → smallest A–CE → merge **{A, C, E}** at 2.0.\n3. B–ACE = min(6.7, 5.0, 3.6) = 3.6; D–ACE = min(2.2, 2.2, 2.2) = 2.2 → merge **{D, A, C, E}** at 2.2.\n4. B joins last at **3.6**.\nMerge heights: **1.4, 2.0, 2.2, 3.6**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Complete linkage (pages 661–668)",
          text: "1. Merge **{C, E}** at 1.4.\n2. Update with MAX: A–CE = max(2.0, 3.2) = 3.2; B–CE = 5.0; D–CE = max(2.2, 2.2) = 2.2; A–D = 2.2 → merge **{A, D}** at 2.2.\n3. B–AD = max(6.7, 5.1) = 6.7; B–CE = 5.0; AD–CE = max(2.0, 3.2, 2.2, 2.2) = 3.2 → merge **{A, D, C, E}** at 3.2.\n4. B joins last at max(6.7, 5.0, 5.1, 3.6) = **6.7**.\nMerge heights: **1.4, 2.2, 3.2, 6.7**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Tie (flagged): page 664",
          text: "After {C, E}, both A–D and D–CE equal **2.2** (exactly √5 = 2.236). The PDF picks A–D without comment. Merging D with CE first is equally valid and gives a different tree. In an exam, **state the tie and your tie-break rule**.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Average linkage: PDF's additional problem, page 660 (exercise solution prepared for the website)",
          text: "1. Merge **{C, E}** at 1.41.\n2. A–CE = (2.0 + 3.16)/2 = 2.58; B–CE = (5.0 + 3.61)/2 = 4.30; D–CE = (2.24 + 2.24)/2 = 2.24; A–D = 2.24 → tie again; take **{A, D}** at 2.24.\n3. AD–CE = (AC 2.0 + AE 3.16 + DC 2.24 + DE 2.24)/4 = **2.41** (smaller than B–AD = (6.71 + 5.10)/2 = 5.90 and B–CE = 4.30) → merge at 2.41.\n4. B joins last at (6.71 + 5.0 + 5.10 + 3.61)/4 = **5.10**.\nMerge heights: **1.41, 2.24, 2.41, 5.10**. (Values computed in Python.)",
        },
        { type: "diagram", name: "a14-dendro" },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Same first merge, different trees.** Single gives low merge heights (chains); complete gives high ones (compact groups); average lands in between." },
      ],
    },
    {
      id: "dbscan",
      heading: "Lesson 6: DBSCAN: clusters as crowded regions",
      slides: "670–683",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "Draw a circle of radius ε around every point. A point with at least **MinPts** points inside its circle (itself included) is a **core** point: it stands in a crowd. Crowds that touch join into one cluster. A point inside a crowd's circle but not crowded itself is a **border** point. A point in nobody's circle is **noise**." },
        {
          type: "p",
          text: "**Why (page 670):** partitioning and hierarchical methods find round clusters; they fail on “S” shapes and ovals. **DBSCAN** (Density-Based Spatial Clustering of Applications with Noise, page 671) finds core objects and connects their neighbourhoods into dense regions. It succeeds on arbitrary shapes (page 677) but struggles when clusters have very **different densities** (page 678).",
        },
        {
          type: "table",
          caption: "DBSCAN vocabulary (pages 672–676)",
          head: ["Term", "Meaning"],
          rows: [
            ["**ε-neighbourhood**", "All points within radius ε of o (ε is a hyperparameter)"],
            ["**MinPts**", "Density threshold (hyperparameter)"],
            ["**Core object**", "Its ε-neighbourhood holds at least MinPts objects"],
            ["**Directly density-reachable**", "p is in the ε-neighbourhood of a **core** object q"],
            ["**Density-reachable**", "A chain q = p₁ → p₂ → … → pₙ = p of direct reachability"],
            ["**Density-connected**", "p₁ and p₂ are both density-reachable from some q"],
            ["**Cluster**", "A maximal set of density-connected objects"],
          ],
        },
        { type: "diagram", name: "a14-dbscan" },
        {
          type: "callout",
          kind: "example",
          title: "PDF problem (pages 679–683): A(2, 2), B(3, 1), C(3, 4), D(5, 3), E(10, 14); ε = 3, MinPts = 4",
          text: "**Distances:** AB 1.4, AC 2.2, AD 3.2, AE 14.4, BC 3.0, BD 2.8, BE 14.8, CD 2.2, CE 12.2, DE 12.1.\n**Neighbours within 3 (density counts the point itself):**\n- N(A) = {B, C} → 3\n- N(B) = {A, C, D} → **4 → core**\n- N(C) = {A, B, D} → **4 → core**\n- N(D) = {B, C} → 3\n- N(E) = {} → 1\n**Grow from B:** add A, C, D; C is core, so add its neighbours (nothing new) → **cluster {A, B, C, D}**; A and D are **border** points; **E is noise**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 680",
          text: "The PDF lists N(C) = {A, B, C}. C's neighbours within 3 are **A (2.2), B (3.0) and D (2.2)**, so N(C) = {A, B, D}. Its density, 4, is correct.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Core: ≥ MinPts in its ε-circle (count itself). Border: in a core's circle. Noise: neither.** Note whether “within ε” includes the boundary (here BC = 3.0 counts)." },
      ],
    },
    {
      id: "eval",
      heading: "Lesson 7: Evaluating a clustering: Hopkins, BCubed and silhouette",
      slides: "685–701",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "Three questions, three tools. **Is there anything to cluster at all?** → Hopkins statistic. **If I know the true groups, how well did I recover them?** → BCubed precision and recall. **Without true groups, are my clusters tight and far apart?** → silhouette coefficient." },
        {
          type: "table",
          caption: "Cluster evaluation tasks (page 685)",
          head: ["Task", "Question", "Tool in the PDF"],
          rows: [
            ["1. Clustering tendency", "Is there non-random structure?", "**Hopkins statistic** (pages 686–691)"],
            ["2. Number of clusters", "What k?", "√(n/2), elbow, cross-validation (page 692)"],
            ["3a. Quality, extrinsic", "Ground truth available", "Homogeneity, completeness, rag bag, small-cluster preservation; **BCubed** (pages 694–696)"],
            ["3b. Quality, intrinsic", "No ground truth", "**Silhouette coefficient** (pages 697–701)"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Hopkins statistic (pages 687–688)",
          text: "Sample n points $p_i$; $x_i$ = distance from $p_i$ to its nearest neighbour in D. Sample n data points $q_i$; $y_i$ = distance from $q_i$ to its nearest **other** point in D.\n$$H = \\frac{\\sum y_i}{\\sum x_i + \\sum y_i}$$ **Reading it (PDF):** uniformly spread data → H ≈ 0.5; highly clustered → H ≈ 0; H > 0.5 → probably no significant clusters.",
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF problem (pages 689–691): D = {2, 10, 12, 4, 25, 3, 30, 20, 11}",
          text: "**Step 1:** sample {2, 12, 25, 30, 11}; nearest distances d(2, 3) + d(12, 11) + d(25, 20) + d(30, 25) + d(11, 10) = 1 + 1 + 5 + 5 + 1 → $\\sum x = 13$.\n**Step 2:** sample without replacement 12, 30, 4, 11, 3, removing each from D as you go → 1, 5, 1, 1, 1 → $\\sum y = 9$.\n**Step 3:** $H = 9/(13 + 9) = 9/22 = $ **0.41** → below 0.5: the data **can be clustered**, but the clusters are not highly distinct.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Method note: page 687",
          text: "In the textbook definition (Han & Kamber), the $p_i$ are random points drawn **uniformly from the data space**, not from the data, so that $\\sum x$ reflects empty space. The PDF samples both sets from D. Follow the PDF's steps in the exam, but if asked to explain H, say that one sample is random points and the other is real data points.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "BCubed precision and recall (pages 695–696)",
          text: "For each object, compare it with the other objects:\n- **Precision of o:** of the objects in **o's cluster**, the fraction with o's **true label**.\n- **Recall of o:** of the objects with **o's true label**, the fraction in **o's cluster**.\nBCubed precision / recall = the average over all objects.",
        },
        {
          type: "callout",
          kind: "example",
          title: "BCubed in numbers (exercise solution prepared for the website)",
          text: "True labels: o1, o2, o3 = X; o4, o5 = Y. Clusters: {o1, o2}, {o3, o4, o5}.\nPrecision: o1 1/1, o2 1/1, o3 0/2, o4 1/2, o5 1/2 → (1 + 1 + 0 + 0.5 + 0.5)/5 = **0.6**.\nRecall: o1 1/2 (o2 yes, o3 no), o2 1/2, o3 0/2, o4 1/1, o5 1/1 → (0.5 + 0.5 + 0 + 1 + 1)/5 = **0.6**.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Silhouette coefficient (pages 697–698)",
          text: "a(o) = average distance from o to the **other members of its own cluster** (compactness; smaller is better).\nb(o) = the **smallest** average distance from o to the members of **another** cluster (separation; larger is better).\n$$s(o) = \\frac{b(o) - a(o)}{\\max\\{a(o),\\, b(o)\\}}, \\qquad -1 \\le s \\le 1$$ s near 1: o sits well inside a compact, well-separated cluster (preferred); near 0: on a boundary; negative: probably in the wrong cluster.",
        },
        {
          type: "callout",
          kind: "example",
          title: "PDF problem (pages 699–701): C1 = {p1, p2}, C2 = {p3, p4}",
          text: "Distances: p1p2 0.10, p1p3 0.65, p1p4 0.55, p2p3 0.70, p2p4 0.60, p3p4 0.30.\n- p1: a = 0.10, b = (0.65 + 0.55)/2 = 0.60 → s = 0.50/0.60 = **0.833**\n- p2: a = 0.10, b = (0.70 + 0.60)/2 = 0.65 → s = 0.55/0.65 = **0.846**\n- p3: a = 0.30, b = (0.65 + 0.70)/2 = 0.675 → s = 0.375/0.675 = **0.556**\n- p4: a = 0.30, b = (0.55 + 0.60)/2 = 0.575 → s = 0.275/0.575 = **0.478**\nCluster averages: C1 = **0.840**, C2 = **0.517**; overall = **0.678**. (The PDF shows 0.839, 0.516 and 0.677: truncated, not rounded.)",
        },
        { type: "diagram", name: "a14-sil" },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Hopkins:** H = Σy/(Σx + Σy); near 0 = clustered, 0.5 = random. **Silhouette:** (b − a)/max(a, b), closer to 1 is better. **BCubed:** per-object precision and recall, then average." },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "Clustering in depth on one screen (consolidated PDF pages)",
      head: ["Topic", "Rule / formula", "PDF answer", "Pages"],
      rows: [
        ["k-means", "assign to nearest centroid; centroid = mean; repeat", "{A, B, D}, {C, E}; centroids (1.67, 0.67), (2.5, 4.5)", "623–625"],
        ["Choosing k", "k ≈ √(n/2); elbow = bend in error vs k", "Elbow at k = 3 (732, 57, 32, 28)", "628–633"],
        ["Single linkage", "cluster distance = min pair", "Merge heights 1.4, 2.0, 2.2, 3.6", "652–659"],
        ["Complete linkage", "cluster distance = max pair", "1.4, 2.2, 3.2, 6.7", "661–668"],
        ["Average linkage", "mean of all pairs", "1.41, 2.24, 2.41, 5.10 (website)", "660"],
        ["DBSCAN", "core: ≥ MinPts in ε-circle (incl. itself); border; noise", "Core B, C; cluster {A, B, C, D}; noise E", "679–683"],
        ["Hopkins", "H = Σy/(Σx + Σy)", "9/22 = 0.41", "687–691"],
        ["BCubed", "average per-object precision / recall", "–", "695–696"],
        ["Silhouette", "s = (b − a)/max(a, b)", "0.833, 0.846, 0.556, 0.478; overall 0.678", "697–701"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Write the full distance matrix first · after each merge, show the **updated** matrix with the linkage rule (min / max / mean) · draw the dendrogram with merge heights · in DBSCAN, list N(p) and the count for every point and say whether the point itself counts · in silhouette, a is **own** cluster, b is the **nearest other** cluster.",
    },
  ],

  glossary: [
    ["Partitioning method", "k-means, k-medoids", "Divide n objects into k non-overlapping clusters"],
    ["Centroid", "", "Mean of the points in a cluster"],
    ["Within-cluster variation", "SSE", "Sum of squared distances of points to their centroid"],
    ["Elbow method", "", "Choose k at the bend of the error-vs-k curve"],
    ["Agglomerative / divisive", "AGNES / DIANA", "Bottom-up merging / top-down splitting"],
    ["Dendrogram", "", "Tree showing which clusters merge and at what distance"],
    ["Single linkage", "MIN, nearest neighbour", "Cluster distance = closest pair"],
    ["Complete linkage", "MAX, farthest neighbour", "Cluster distance = farthest pair"],
    ["Average linkage", "", "Cluster distance = mean of all pairs"],
    ["DBSCAN", "", "Density-based clustering that finds arbitrary shapes and labels noise"],
    ["ε (eps)", "", "Neighbourhood radius in DBSCAN"],
    ["MinPts", "", "Minimum points (including itself) for a core object"],
    ["Core / border / noise", "", "Dense point / near a core / neither"],
    ["Density-reachable / connected", "", "Linked through a chain of core points / both reachable from one core"],
    ["Hopkins statistic", "H", "Tests clustering tendency; ≈ 0 clustered, ≈ 0.5 random"],
    ["Extrinsic / intrinsic evaluation", "", "With / without ground-truth labels"],
    ["BCubed precision / recall", "", "Per-object precision and recall against the true labels, averaged"],
    ["Silhouette coefficient", "s(o)", "(b − a)/max(a, b), between −1 and 1"],
  ],

  examTips: [
    "Distance matrices: keep 2–3 decimals and write the formula for one entry, e.g. $d(A, B) = \\sqrt{3^2 + 6^2} = 6.71$.",
    "Hierarchical: after each merge, recompute only the rows involving the new cluster, and name the linkage rule each time.",
    "If two distances tie, say so and state which you merge first.",
    "DBSCAN: make a table Point | ε-neighbours | count | core? Then grow clusters from the core points.",
    "Silhouette: compute a, b and s for each point in a small table, then average per cluster and overall.",
  ],

  problems: [
    {
      title: "k-means on five points (pages 623–625)",
      level: "Medium",
      question: "Cluster A(0, 1), B(3, 0), C(2, 4), D(2, 1), E(3, 5) into k = 2 clusters with Euclidean distance, starting from centroids A and C. Show two iterations.",
      solution: "### Distances to A and C\nB: 3.16 vs 4.12 → A; D: 2 vs 3 → A; E: 5 vs 1.41 → C.\n**C1 = {A, B, D}, C2 = {C, E}.**\n### New centroids\nC1 = (5/3, 2/3) = (1.67, 0.67); C2 = (2.5, 4.5).\n### Iteration 2\nA 1.70 vs 4.30; B 1.49 vs 4.53; C 3.35 vs 0.71; D 0.47 vs 3.54; E 4.53 vs 0.71 → same assignment → **converged**. SSE = 6.33.",
    },
    {
      title: "Elbow method (pages 629–633)",
      level: "Medium",
      question: "D = {2, 10, 12, 4, 25, 3, 30, 20, 11}. Using the PDF's method (squared distance to the given starting centroids), compute the within-cluster variance for k = 2 (3, 10), k = 3 (3, 10, 25), k = 4 (3, 10, 20, 30), k = 5 (3, 10, 12, 20, 25), and choose k.",
      solution: "### k = 2\n{2, 3, 4} around 3 → 1 + 0 + 1 = 2; {10, 11, 12, 20, 25, 30} around 10 → 0 + 1 + 4 + 100 + 225 + 400 = 730 → **732**.\n### k = 3\n2 + (0 + 4 + 1) + (25 + 0 + 25) = **57**.\n### k = 4\n2 + 5 + (25 + 0) + 0 = **32**.\n### k = 5\n2 + 0 + 1 + 0 + 25 = **28**.\n### Decision\n732 → 57 is a huge drop; after that the gains are small → **k = 3**. (True k-means SSE: 150, 54, 16.5, 15 — same elbow.)",
    },
    {
      title: "Single vs complete linkage (pages 652–668)",
      level: "Hard",
      question: "Points A(2, 2), B(5, 8), C(2, 4), D(4, 3), E(3, 5). Perform single- and complete-linkage clustering, giving each merge and its height.",
      solution: "### Distance matrix\nAB 6.71, AC 2.00, AD 2.24, AE 3.16, BC 5.00, BD 5.10, BE 3.61, CD 2.24, CE 1.41, DE 2.24.\n### Single (MIN)\nCE 1.41 → A + CE at min(2.00, 3.16) = 2.00 → D + ACE at 2.24 → B at min(6.71, 5.00, 5.10, 3.61) = **3.61**.\n### Complete (MAX)\nCE 1.41 → A–CE 3.16, D–CE 2.24, A–D 2.24 (tie) → AD at 2.24 → AD–CE = max(2.00, 3.16, 2.24, 2.24) = 3.16 → B at **6.71**.\n### Comment\nSingle linkage merges at low heights (it chains through the nearest pair); complete linkage keeps clusters compact, so B joins only at 6.71.",
    },
    {
      title: "Average linkage (page 660, unsolved in the PDF)",
      level: "Hard",
      question: "Cluster the same five points with average linkage.",
      solution: "1. CE at 1.41.\n2. A–CE = (2.00 + 3.16)/2 = 2.58; B–CE = 4.30; D–CE = 2.24; A–D = 2.24 → merge AD at **2.24** (tie with D–CE; state it).\n3. AD–CE = (2.00 + 3.16 + 2.24 + 2.24)/4 = **2.41**; B–AD = 5.90; B–CE = 4.30 → merge ADCE at 2.41.\n4. B–ADCE = (6.71 + 5.00 + 5.10 + 3.61)/4 = **5.10**.\nHeights 1.41, 2.24, 2.41, 5.10. (Exercise solution prepared for the website.)",
    },
    {
      title: "DBSCAN (pages 679–683)",
      level: "Medium",
      question: "A(2, 2), B(3, 1), C(3, 4), D(5, 3), E(10, 14); ε = 3, MinPts = 4 (count includes the point). Find core, border and noise points and the clusters.",
      solution: "### ε-neighbours\nA: B 1.41, C 2.24 → count 3. B: A 1.41, C 3.00, D 2.83 → **4, core**. C: A 2.24, B 3.00, D 2.24 → **4, core**. D: B 2.83, C 2.24 → 3. E: none → 1.\n### Clusters\nFrom B: A, C, D are reachable; C is core but adds nothing new → **{A, B, C, D}**. Core: B, C. Border: A, D. **Noise: E**.",
    },
    {
      title: "DBSCAN with a smaller radius",
      level: "Hard",
      question: "Repeat the previous problem with ε = 2.5 and MinPts = 3.",
      solution: "Neighbours within 2.5: A {B, C} → 3 core; B {A} → 2; C {A, D} → 3 core; D {C} → 2; E {} → 1.\nCore A and C are within 2.24 of each other → connected. Cluster from A: B, C; from C: D → **{A, B, C, D}**; border B, D; noise E. Same cluster, different core points. (Exercise solution prepared for the website.)",
    },
    {
      title: "Hopkins statistic (pages 689–691)",
      level: "Easy",
      question: "With $\\sum x_i = 13$ and $\\sum y_i = 9$, compute H and interpret it.",
      solution: "$H = 9/(13 + 9) = $ **0.41**. Below 0.5 → there is some clustering tendency, but the clusters are not highly distinct (H ≈ 0 would be strongly clustered; ≈ 0.5 uniform).",
    },
    {
      title: "Silhouette coefficient (pages 699–701)",
      level: "Medium",
      question: "C1 = {p1, p2}, C2 = {p3, p4}; distances p1p2 0.10, p1p3 0.65, p1p4 0.55, p2p3 0.70, p2p4 0.60, p3p4 0.30. Compute s for each point, each cluster and overall.",
      solution: "| Point | a | b | s |\n|---|---|---|---|\n| p1 | 0.10 | 0.600 | 0.833 |\n| p2 | 0.10 | 0.650 | 0.846 |\n| p3 | 0.30 | 0.675 | 0.556 |\n| p4 | 0.30 | 0.575 | 0.478 |\n\nC1 = (0.833 + 0.846)/2 = **0.840**; C2 = (0.556 + 0.478)/2 = **0.517**; overall = **0.678**. C1 is tighter and better separated than C2.",
    },
    {
      title: "BCubed precision and recall",
      level: "Medium",
      question: "True labels: o1, o2, o3 = X; o4, o5 = Y. Clusters: {o1, o2}, {o3, o4, o5}. Compute BCubed precision and recall.",
      solution: "### Precision (same cluster → same label?)\no1 1/1, o2 1/1, o3 0/2, o4 1/2, o5 1/2 → **0.6**.\n### Recall (same label → same cluster?)\no1 1/2, o2 1/2, o3 0/2, o4 1/1, o5 1/1 → **0.6**.\nPutting o3 with the Y objects costs both precision and recall. (Exercise solution prepared for the website.)",
    },
  ],

  theory: [
    {
      title: "Comparing clustering families",
      level: "Easy",
      question: "Compare partitioning, hierarchical and density-based clustering: method, cluster shape, examples and limitations.",
      solution: "**Partitioning** (k-means, k-medoids; pages 609, 611): choose k representatives and relocate points iteratively; distance-based; finds spherical, mutually exclusive clusters; needs k, depends on initialisation, struggles with different sizes/densities/shapes. **Hierarchical** (AGNES, DIANA, BIRCH; page 639): builds a tree of merges (bottom-up) or splits (top-down), shown as a dendrogram; any number of clusters by cutting the tree; merges/splits cannot be undone; linkage choice changes results. **Density-based** (DBSCAN, OPTICS; pages 670–676): clusters are dense regions separated by sparse ones; finds arbitrary shapes and labels noise; needs ε and MinPts and struggles with varying densities.",
    },
    {
      title: "Single, complete and average linkage",
      level: "Medium",
      question: "Define the three linkage measures and their strengths and weaknesses.",
      solution: "Single (MIN): distance between the closest pair of points; fast and handles non-globular shapes, but chains through noise. Complete (MAX): distance between the farthest pair; good for cleanly separated globular clusters, but sensitive to outliers. Average: mean of all pairwise distances; good for globular clusters and handles categorical as well as numeric data (pages 646–650). On the PDF's five points they give merge heights 1.4/2.0/2.2/3.6 (single) vs 1.4/2.2/3.2/6.7 (complete).",
    },
    {
      title: "Evaluating clusterings",
      level: "Medium",
      question: "Describe the three cluster-evaluation tasks and one method for each.",
      solution: "(1) **Clustering tendency** (pages 686–691): is there non-random structure? Hopkins statistic H = Σy/(Σx + Σy); ≈ 0.5 uniform, near 0 clustered. (2) **Number of clusters** (page 692): √(n/2) rule, elbow method, cross-validation. (3) **Quality**: extrinsic (with ground truth; pages 694–696) using homogeneity, completeness, rag bag, small-cluster preservation, e.g. BCubed precision/recall; intrinsic (no ground truth; pages 697–698) using the silhouette coefficient s = (b − a)/max(a, b), where a measures compactness and b separation.",
    },
  ],

  quiz: [
    { topic: "Methods", q: "Which family can find S-shaped clusters and label noise?", options: ["Partitioning", "Hierarchical", "Density-based", "None"], answer: 2, why: "Page 670.", wrong: ["Spherical clusters only.", "Spherical clusters only.", null, "DBSCAN can."] },
    { topic: "k-means", type: "num", q: "Centroid x-coordinate of A(0, 1), B(3, 0), D(2, 1)? (2 decimals)", answer: 1.67, tol: 0.01, why: "5/3 = 1.67 (page 624)." },
    { topic: "Choosing k", type: "num", q: "Rule-of-thumb k for n = 50 points? (√(n/2))", answer: 5, tol: 0.01, why: "√25 = 5 (page 628)." },
    { topic: "Choosing k", q: "In the elbow method you choose k where…", options: ["the error is smallest", "the error curve bends", "k = n", "k = 1"], answer: 1, why: "Error always falls with k (page 628).", wrong: ["That's k = n.", null, "Overfits.", "Underfits."] },
    { topic: "Linkage", q: "Complete linkage measures the distance between clusters as…", options: ["the closest pair", "the farthest pair", "the average pair", "the centroid distance"], answer: 1, why: "Page 647.", wrong: ["Single.", null, "Average.", "Not in the PDF."] },
    { topic: "Linkage", type: "num", q: "Single linkage: A–C = 2.0, A–E = 3.2. Distance A to cluster {C, E}?", answer: 2.0, tol: 0.01, why: "min(2.0, 3.2) (page 654)." },
    { topic: "Linkage", type: "num", q: "Complete linkage: A–C = 2.0, A–E = 3.2. Distance A to {C, E}?", answer: 3.2, tol: 0.01, why: "max (page 663)." },
    { topic: "DBSCAN", q: "A point with fewer than MinPts neighbours but inside a core point's ε-circle is…", options: ["core", "border", "noise", "a centroid"], answer: 1, why: "Border points belong to a cluster without being dense themselves.", wrong: ["Needs ≥ MinPts.", null, "Noise is in no core's circle.", "Not a DBSCAN term."] },
    { topic: "DBSCAN", q: "In the PDF problem (ε = 3, MinPts = 4), E(10, 14) is…", options: ["core", "border", "noise", "its own cluster"], answer: 2, why: "No neighbour within 3 (page 683).", wrong: ["Count 1.", "Not near a core.", null, "DBSCAN labels it noise."] },
    { topic: "Hopkins", type: "num", q: "Σx = 13, Σy = 9. Hopkins H? (2 decimals)", answer: 0.41, tol: 0.005, why: "9/22 (page 691)." },
    { topic: "Hopkins", q: "H close to 0 means the data are…", options: ["uniformly random", "highly clustered", "unclusterable", "normal"], answer: 1, why: "Page 688.", wrong: ["≈ 0.5.", null, "≈ 1 in the PDF.", "Not about normality."] },
    { topic: "Silhouette", type: "num", q: "a = 0.1, b = 0.6. Silhouette s? (3 decimals)", answer: 0.833, tol: 0.001, why: "0.5/0.6 (page 700)." },
    { topic: "Silhouette", q: "A negative silhouette for a point suggests…", options: ["a perfect cluster", "the point is probably in the wrong cluster", "the cluster is empty", "k is too small"], answer: 1, why: "b < a: it's closer to another cluster.", wrong: ["That's near 1.", null, "No.", "Not necessarily."] },
    { topic: "Evaluation", q: "Silhouette is an example of…", options: ["an extrinsic method", "an intrinsic method", "a clustering tendency test", "a linkage"], answer: 1, why: "No ground truth needed (page 697).", wrong: ["That uses ground truth (BCubed).", null, "That's Hopkins.", "No."] },
  ],
};
