// AML — Contact Session 2: End-to-End ML (framing, data types, preprocessing, analysis, tools)
// Source: CourseFiles/AML/ContactSession2-EndToEndML.pptx (99 slides)

export default {
  title: "End-to-End ML: Framing, Data & Preprocessing",
  source: "ContactSession2-EndToEndML.pptx · 99 slides",
  overview:
    "How a real ML project starts: frame the business problem (type of learning, metric such as RMSE/MAE), understand the data (attribute types: nominal, ordinal, interval, ratio; dataset types), clean and pre-process it (noise, outliers, missing values, duplicates, aggregation, sampling, discretisation, scaling, dimensionality reduction, feature selection/creation), explore it (summary statistics, distance/similarity measures, correlation, visualisation), and prepare it in Python/scikit-learn (imputation, one-hot encoding, stratified test split).",

  summary: [
    {
      id: "frame",
      heading: "1. Framing the ML problem",
      slides: "2–7",
      blocks: [
        { type: "p", text: "**Running example:** predict the *median house price* of a California district from census attributes (population, median income, …). A district has about 600–3000 people." },
        {
          type: "list",
          ordered: true,
          items: [
            "**Business objective:** how will the output be used, and what benefit does it bring? This drives the choice of algorithm, metric and maintenance effort. What is the **baseline** (e.g. experts' manual estimates) and how good is it?",
            "**Choice of model:** answer the four questions. Labels available → *supervised*. Real-valued output from many inputs → *multivariate regression*. Data at rest that fits in memory → *batch*. Instance- or model-based?",
            "**Choice of metric:** for regression, typically **RMSE**, or **MAE** when there are many outliers.",
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Framing template",
          text: "The housing problem is a **supervised, multivariate, batch regression** problem. Always answer framing questions as: *supervision → task type → batch/online → metric*, with a “because…” for each.",
        },
        {
          type: "table",
          caption: "Regression metrics ($h$ = model, $m$ = number of instances)",
          head: ["Metric", "Formula", "Norm", "Use when"],
          rows: [
            ["**RMSE**", "$\\sqrt{\\frac{1}{m}\\sum_{i}(h(x^{(i)}) - y^{(i)})^2}$", "$\\ell_2$ (Euclidean)", "Default. Penalises large errors heavily"],
            ["**MAE**", "$\\frac{1}{m}\\sum_{i}|h(x^{(i)}) - y^{(i)}|$", "$\\ell_1$ (Manhattan)", "Many outliers. More robust"],
          ],
        },
        { type: "p", text: "General form: the $\\ell_k$ norm $\\|v\\|_k = (\\sum |v_i|^k)^{1/k}$. The higher the $k$, the more the norm focuses on large values and ignores small ones. That is why RMSE is more sensitive to outliers than MAE." },
      ],
    },
    {
      id: "types",
      heading: "2. Data types & representation",
      slides: "8–27",
      blocks: [
        { type: "p", text: "An **attribute** (variable, field, feature, dimension) is a property of an **object** (record, instance, sample, point). *Attribute values* are the numbers/symbols assigned to it. The same attribute can have different values (height in feet or metres). Different attributes can share the same value set (ID and age are both integers) but have different properties." },
        {
          type: "table",
          caption: "Discrete vs continuous",
          head: ["", "Discrete", "Continuous"],
          rows: [
            ["Values", "Finite or countably infinite", "Real numbers"],
            ["Examples", "Zip codes, counts, words in documents. **Binary** is a special case", "Temperature, height, weight"],
            ["Stored as", "Integers", "Floating point"],
          ],
        },
        {
          type: "table",
          caption: "The four attribute types. Each type adds a property to the one above it",
          head: ["Type", "Properties", "Examples", "Meaningful operations"],
          rows: [
            ["**Nominal**", "Distinctness (=, ≠)", "ID numbers, eye colour, zip codes", "Mode, entropy, χ² test"],
            ["**Ordinal**", "+ Order (<, >)", "Grades, rankings, {short, medium, tall}", "Median, percentiles"],
            ["**Interval**", "+ Differences (+, −)", "Calendar dates, °C, °F", "Mean, std dev, Pearson correlation"],
            ["**Ratio**", "+ Ratios (×, ÷)", "Kelvin, length, counts, elapsed time", "Geometric mean, % variation"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Interval vs ratio: the classic trick",
          text: "10 °C is **not** twice as hot as 5 °C, because Celsius has an arbitrary zero (interval). 10 K **is** twice 5 K, because Kelvin has a true zero (ratio). Likewise, “Bob is 6 inches above average and Bill is 3 inches above average” does **not** mean Bob is twice as tall: height-above-average is an interval scale.",
        },
        { type: "p", text: "Nominal and ordinal are **categorical (qualitative)**; interval and ratio are **numeric (quantitative)**. **Asymmetric attributes:** only non-zero values matter (words present in a document, items in a basket)." },
        {
          type: "table",
          caption: "Characteristics & types of datasets",
          head: ["Characteristic", "Why it matters"],
          rows: [
            ["**Dimensionality**", "High dimensionality brings the *curse of dimensionality*"],
            ["**Sparsity**", "Only presence counts, which saves storage and computation"],
            ["**Resolution**", "Patterns depend on scale (too fine = noise, too coarse = pattern disappears)"],
            ["**Size**", "The type of analysis possible depends on data size"],
          ],
        },
        {
          type: "list",
          items: [
            "**Record data:** a data matrix (m objects × n numeric attributes = points in n-D space), document-term vectors (term counts), transaction data (a set of items per transaction).",
            "**Graph data:** the World Wide Web, molecules (benzene C₆H₆).",
            "**Ordered data:** sequences of transactions, genomic sequences, spatio-temporal data (monthly land/ocean temperature).",
          ],
        },
      ],
    },
    {
      id: "prep",
      heading: "3. Data quality & preprocessing",
      slides: "28–51",
      blocks: [
        { type: "p", text: "Poor data leads to poor models. For example, a loan-risk classifier built on bad data denies credit-worthy people and approves defaulters." },
        {
          type: "table",
          caption: "Data quality problems",
          head: ["Problem", "What it is", "Handling"],
          rows: [
            ["**Noise**", "Modification of original values (voice distortion, TV “snow”)", "Smoothing, robust algorithms"],
            ["**Outliers**", "Objects very different from the rest. Either *noise* or *the goal* (fraud, intrusion detection)", "Remove if noise; study if they are the target"],
            ["**Missing values**", "Not collected (people decline to give age) or not applicable (income for children)", "Eliminate objects/attributes, **estimate** (mean/median/interpolation), or ignore during analysis"],
            ["**Duplicates**", "Same entity twice, e.g. a person with 2 email addresses. Common when merging sources", "Data cleaning / de-duplication"],
            ["Wrong/fake data", "Invalid entries", "Validation rules"],
          ],
        },
        {
          type: "table",
          caption: "Preprocessing techniques",
          head: ["Technique", "Idea", "Example"],
          rows: [
            ["**Aggregation**", "Combine attributes/objects into one: data reduction, change of scale, more stable data", "Daily → monthly sales; yearly precipitation has lower std than monthly"],
            ["**Sampling**", "Use a representative subset. **Simple random** (with/without replacement), **stratified** (sample from each partition)", "8000 → 2000 → 500 points keeps the shape if representative"],
            ["**Discretisation**", "Continuous → ordinal. Unsupervised: *equal width, equal frequency, k-means*. Supervised: use class labels to place the breaks", "Iris petal width → low/medium/high"],
            ["**Binarisation**", "Continuous/categorical → one or more binary attributes", "Eye colour → one-hot bits"],
            ["**Attribute transformation**", "Simple functions ($x^k$, $\\log x$, $e^x$, $|x|$); **normalisation / standardisation** $z = (x-\\bar x)/s$", "Income → log(income)"],
            ["**Dimensionality reduction**", "Avoid the curse of dimensionality, reduce time/memory, enable visualisation, remove noise. **PCA**, **SVD**: find projections capturing the most variance", "784-pixel images → 50 components"],
            ["**Feature subset selection**", "Drop **redundant** features (price and sales tax) and **irrelevant** ones (student ID for GPA)", "Filter/wrapper methods"],
            ["**Feature creation**", "**Extraction** (edges from images), **construction** (density = mass/volume), **mapping to a new space** (Fourier/wavelet)", "rooms_per_household"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Curse of dimensionality",
          text: "As dimensions increase, data becomes increasingly **sparse**: points spread out, and density and distance lose meaning (all points look almost equally far apart). This hurts clustering, k-NN and outlier detection. More components in PCA give a better reconstruction but less reduction.",
        },
      ],
    },
    {
      id: "analysis",
      heading: "4. Data analysis: statistics, proximity, visualisation",
      slides: "52–82",
      blocks: [
        { type: "p", text: "**Data exploration (EDA)** helps select the right preprocessing and tools, and uses the human ability to spot patterns." },
        {
          type: "table",
          caption: "Summary statistics",
          head: ["Measure", "Definition", "Note"],
          rows: [
            ["Frequency / **Mode**", "% of times a value occurs / most frequent value", "Categorical data"],
            ["**Percentile** $x_p$", "p% of values are less than $x_p$", "Ordinal/continuous. The median is $x_{50\\%}$"],
            ["**Mean**", "$\\bar x = \\frac1m\\sum x_i$", "Very sensitive to outliers"],
            ["**Median / trimmed mean**", "Middle value / mean after dropping p% at both ends", "Robust to outliers"],
            ["**Range**", "max − min", "Very sensitive to outliers"],
            ["**Variance / std**", "$s^2 = \\frac{1}{m-1}\\sum (x_i-\\bar x)^2$", "Most common measure of spread"],
            ["**AAD**", "$\\frac1m\\sum|x_i-\\bar x|$", "Less affected by outliers. Also MAD and IQR"],
          ],
        },
        { type: "p", text: "**Similarity** is higher when objects are more alike, often in [0, 1]. **Dissimilarity** (distance) is lower when they are alike, with a minimum of 0. **Proximity** means either." },
        {
          type: "table",
          caption: "Distance measures",
          head: ["Measure", "Formula", "Notes"],
          rows: [
            ["**Euclidean**", "$d(x,y)=\\sqrt{\\sum_k (x_k-y_k)^2}$", "**Standardise first** if scales differ"],
            ["**Minkowski**", "$d(x,y)=\\left(\\sum_k |x_k-y_k|^r\\right)^{1/r}$", "Generalises the rows below"],
            ["r = 1: **Manhattan** ($L_1$)", "$\\sum_k |x_k-y_k|$", "For binary vectors it equals the **Hamming** distance (number of differing bits)"],
            ["r = 2: **Euclidean** ($L_2$)", "", ""],
            ["r → ∞: **Supremum** ($L_\\infty$)", "$\\max_k |x_k-y_k|$", "The largest difference in any component"],
            ["**Mahalanobis**", "$(x-y)^T\\Sigma^{-1}(x-y)$", "Accounts for correlation and different variances between attributes"],
            ["**Cosine** (similarity)", "$\\cos(x,y)=\\dfrac{x\\cdot y}{\\|x\\|\\,\\|y\\|}$", "Documents; ignores 0-0 matches and vector length"],
            ["**Correlation**", "$r = \\dfrac{s_{xy}}{s_x s_y}$", "**Linear** relationship only, in [−1, 1]"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Drawback of correlation (slide 69)",
          text: "$x = (-3,\\dots,3)$, $y = x^2 = (9,4,1,0,1,4,9)$ gives correlation **0**, even though y is perfectly determined by x. Correlation only detects *linear* relationships.",
        },
        { type: "p", text: "**Do not confuse r with n:** r is the Minkowski parameter, n is the number of dimensions. Every distance works for any n. A good proximity measure is symmetric, tolerant to noise/outliers, and agrees with domain knowledge." },
        {
          type: "table",
          caption: "Visualisation techniques",
          head: ["Plot", "Shows"],
          rows: [
            ["**Histogram**", "Distribution of one variable. Its shape depends on the number of bins. 2-D histograms show joint distributions"],
            ["**Box plot**", "10th/25th/50th/75th/90th percentiles + outliers"],
            ["**Scatter plot (matrix)**", "Relationships between pairs of attributes"],
            ["**Contour plot**", "Continuous attribute on a spatial grid (sea-surface temperature)"],
            ["**Matrix plot**", "Data/correlation matrix as an image, objects sorted by class"],
            ["**Star plots, Chernoff faces**", "Many attributes per object (axes radiating from a centre / facial features)"],
          ],
        },
      ],
    },
    {
      id: "tools",
      heading: "5. Tools & the housing notebook",
      slides: "83–99",
      blocks: [
        { type: "p", text: "**Tools:** Jupyter notebooks, Google Colab (cloud, free GPU/TPU), Anaconda. Libraries: **NumPy** (arrays, linear algebra), **SciPy**, **Matplotlib** (plotting), **scikit-learn** (models, preprocessing, model selection). Datasets: UCI, Kaggle, AWS." },
        {
          type: "list",
          items: [
            "`housing.info()`: 20,640 instances; **207** districts are missing `total_bedrooms`; `ocean_proximity` is text (categorical).",
            "**Histograms:** median income is scaled and capped (0.5–15). House value and age are *capped*, so the model may learn that prices never exceed 500K. Fix: collect proper labels or drop those districts. Attributes have very different scales, and many are **tail-heavy**, so transform them towards a bell shape.",
            "**Correlations:** price correlates strongly with median income. There is a small negative correlation with latitude, and the price cap is visible as a horizontal line at 500K.",
            "**Attribute combinations:** `rooms_per_household` is more correlated with price than total rooms or total bedrooms.",
            "**Cleaning:** `SimpleImputer(strategy='median')` learns medians (`statistics_`) on numeric columns only, then fills the gaps.",
            "**Categorical data:** ordinal integer encoding wrongly implies that nearby codes are similar ('<1H OCEAN' vs 'NEAR OCEAN'), so use **one-hot encoding**.",
            "**Test set:** 20%. A purely random split may not represent the important income categories, so use a **stratified split** on income category. Fix the random seed for **reproducibility**.",
          ],
        },
      ],
    },
  ],

  keyTerms: [
    ["Nominal / Ordinal", "Categorical types: distinctness only / + order."],
    ["Interval / Ratio", "Numeric types: meaningful differences / + a true zero, so ratios are meaningful."],
    ["Asymmetric attribute", "Only presence (non-zero) matters."],
    ["RMSE vs MAE", "$\\ell_2$ vs $\\ell_1$ error. RMSE punishes large errors more; MAE is robust to outliers."],
    ["Stratified sampling", "Split the population into groups and sample from each in proportion."],
    ["Discretisation", "Continuous → ordinal (equal width / equal frequency / k-means / supervised)."],
    ["Binarisation / one-hot", "Categorical → binary columns."],
    ["Standardisation", "$z = (x-\\bar x)/s$."],
    ["Curse of dimensionality", "In high dimensions data is sparse and distances lose meaning."],
    ["PCA", "Projection that captures the maximum variance."],
    ["Minkowski distance", "$L_r$ distance: r = 1 Manhattan, r = 2 Euclidean, r = ∞ supremum."],
    ["Hamming distance", "Number of differing bits (L1 on binary vectors)."],
    ["Cosine similarity", "Angle between vectors: $x\\cdot y/(\\|x\\|\\|y\\|)$."],
    ["Mahalanobis", "Distance that accounts for the covariance of the data."],
    ["Imputation", "Filling missing values (e.g. with the median)."],
  ],

  examTips: [
    "Attribute-type questions: give the **type + the property that decides it** (e.g. “ratio, because a true zero exists”).",
    "Distance calculations appear in almost every paper (**PYQ Q1a**: Euclidean + Manhattan). Always show the difference vector first, then each formula.",
    "A “list the data preprocessing issues in this table” question appeared in the revision deck. Scan for **duplicates, missing/n/a, mixed units/currency, inconsistent date formats, redundant columns (age vs DOB), invalid values (0 or negative)**.",
    "RMSE vs MAE: pick **MAE** when told there are many outliers.",
    "Remember: correlation = 0 does **not** mean independence.",
  ],

  problems: [
    {
      title: "Minkowski family of distances",
      pyq: "Midsem Q1(a): Euclidean & Manhattan distance",
      level: "Easy",
      marks: 3,
      question:
        "For $x = (1, 5, 2, 8)$ and $y = (4, 1, 6, 5)$, compute the (a) Manhattan, (b) Euclidean, (c) supremum and (d) Minkowski $r = 3$ distances.",
      solution: `
Differences $|x_k - y_k| = (3, 4, 4, 3)$

**(a)** $L_1 = 3+4+4+3 = $ **14**

**(b)** $L_2 = \\sqrt{9+16+16+9} = \\sqrt{50} = $ **7.071**

**(c)** $L_\\infty = \\max(3,4,4,3) = $ **4**

**(d)** $L_3 = (27+64+64+27)^{1/3} = 182^{1/3} = $ **5.667**

Note the ordering $L_1 \\ge L_2 \\ge L_3 \\ge L_\\infty$: it always holds.`,
    },
    {
      title: "Distance matrices for four points",
      level: "Medium",
      marks: 5,
      question:
        "Points: $p_1 = (0,2)$, $p_2 = (2,0)$, $p_3 = (3,1)$, $p_4 = (5,1)$. Build the $L_1$, $L_2$ and $L_\\infty$ distance matrices. Which pair is closest under each metric?",
      solution: `
**$L_1$ (Manhattan)**

| | p1 | p2 | p3 | p4 |
|---|---|---|---|---|
| p1 | 0 | 4 | 4 | 6 |
| p2 | 4 | 0 | 2 | 4 |
| p3 | 4 | 2 | 0 | 2 |
| p4 | 6 | 4 | 2 | 0 |

**$L_2$ (Euclidean)**

| | p1 | p2 | p3 | p4 |
|---|---|---|---|---|
| p1 | 0 | 2.828 | 3.162 | 5.099 |
| p2 | 2.828 | 0 | 1.414 | 3.162 |
| p3 | 3.162 | 1.414 | 0 | 2 |
| p4 | 5.099 | 3.162 | 2 | 0 |

**$L_\\infty$ (supremum)**

| | p1 | p2 | p3 | p4 |
|---|---|---|---|---|
| p1 | 0 | 2 | 3 | 5 |
| p2 | 2 | 0 | 1 | 3 |
| p3 | 3 | 1 | 0 | 2 |
| p4 | 5 | 3 | 2 | 0 |

Closest pair: **p2–p3** under $L_2$ (1.414) and $L_\\infty$ (1). Under $L_1$ there is a **tie**: p2–p3 and p3–p4 are both 2. Different metrics can rank neighbours differently.`,
    },
    {
      title: "Cosine similarity of documents",
      level: "Easy",
      marks: 3,
      question:
        "Two term-frequency vectors: $d_1 = (3,2,0,5,0,0,0,2,0,0)$, $d_2 = (1,0,0,0,0,0,0,1,0,2)$. Compute their cosine similarity. Why is cosine preferred over Euclidean distance for documents?",
      solution: `
- $d_1 \\cdot d_2 = 3\\cdot1 + 2\\cdot1 = 5$
- $\\|d_1\\| = \\sqrt{9+4+25+4} = \\sqrt{42} = 6.481$
- $\\|d_2\\| = \\sqrt{1+1+4} = \\sqrt6 = 2.449$
$$\\cos(d_1,d_2) = \\frac{5}{6.481 \\times 2.449} = \\mathbf{0.315}$$

**Why cosine:** document vectors are **sparse and asymmetric**. Cosine ignores the many 0-0 matches (words absent from both) and is independent of document **length** (a document repeated twice has cosine 1 with the original). Euclidean distance would call two long documents on the same topic “far apart”.`,
    },
    {
      title: "Pearson correlation and its drawback",
      level: "Medium",
      marks: 4,
      question:
        "(a) Compute the correlation between $x = (1,2,3,4,5)$ and $y = (2,4,5,4,5)$. (b) Compute the correlation between $x = (-3,-2,-1,0,1,2,3)$ and $y = x^2$. Interpret both.",
      solution: `
**(a)** $\\bar x = 3$, $\\bar y = 4$

| $x-\\bar x$ | $y-\\bar y$ | product |
|---|---|---|
| −2 | −2 | 4 |
| −1 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 2 | 1 | 2 |

$\\sum = 6$, $\\sum(x-\\bar x)^2 = 10$, $\\sum(y-\\bar y)^2 = 6$
$$r = \\frac{6}{\\sqrt{10 \\times 6}} = \\frac{6}{7.746} = \\mathbf{0.775}$$
A strong positive linear relationship.

**(b)** $\\bar x = 0$, $\\bar y = 4$. $\\sum (x-\\bar x)(y - \\bar y) = (-3)(5)+(-2)(0)+(-1)(-3)+0+(1)(-3)+(2)(0)+(3)(5) = 0$, so $r = $ **0**.
y is a **perfect (quadratic) function** of x, but correlation only measures *linear* association. **Zero correlation does not mean independence.**`,
    },
    {
      title: "Summary statistics with an outlier",
      level: "Medium",
      marks: 5,
      question:
        "Data: 10, 12, 13, 15, 15, 18, 20, 97. Compute the mean, median, mode, 12.5%-trimmed mean, range, sample standard deviation and AAD. Recompute the mean, median and std without 97. What do you conclude?",
      solution: `
- Mean $= 200/8 = $ **25**
- Median $= (15+15)/2 = $ **15**
- Mode $=$ **15**
- Trimmed mean (drop 1 value at each end) $= (12+13+15+15+18+20)/6 = 93/6 = $ **15.5**
- Range $= 97-10 = $ **87**
- Sample variance $= \\frac{1}{7}\\sum(x_i-25)^2 = 5996/7 = 856.57$, so std $=$ **29.27**
- AAD $= \\frac18(15+13+12+10+10+7+5+72) = 144/8 = $ **18.0**

**Without 97:** mean = **14.71**, median = **15**, std = **3.45**

**Conclusion:** one outlier moved the mean by 10 and multiplied the std by 8.5×, while the **median** and **trimmed mean** barely moved. Use robust statistics (median, trimmed mean, IQR) when outliers are present.`,
    },
    {
      title: "Min-max normalisation and z-score standardisation",
      level: "Easy",
      marks: 3,
      question:
        "Incomes (in thousands): 20, 30, 50, 60, 90. (a) Min-max normalise to [0, 1]. (b) Z-score standardise (use the sample std). (c) Why does Euclidean distance need this?",
      solution: `
**(a)** $x' = (x-20)/(90-20)$ → **0, 0.143, 0.429, 0.571, 1.0**

**(b)** Mean = 50. Deviations: −30, −20, 0, 10, 40, squares sum to 3000. $s = \\sqrt{3000/4} = 27.386$.
$z$ = **−1.095, −0.730, 0, 0.365, 1.461**

**(c)** Distance is dominated by the attribute with the largest numeric range. Income (tens of thousands) would swamp age (tens). Scaling puts every attribute on an equal footing (slide 62: “standardisation is necessary if scales differ”).`,
    },
    {
      title: "Equal-width vs equal-frequency discretisation",
      level: "Easy",
      marks: 3,
      question: "Discretise into 3 bins using (a) equal width and (b) equal frequency: 4, 8, 15, 21, 21, 24, 25, 28, 34, 40, 52, 60.",
      solution: `
**(a) Equal width:** width $= (60-4)/3 = 18.67$ → bins [4, 22.67), [22.67, 41.33), [41.33, 60]
- Bin 1: 4, 8, 15, 21, 21 (5 values)
- Bin 2: 24, 25, 28, 34, 40 (5 values)
- Bin 3: 52, 60 (2 values)

**(b) Equal frequency (depth 4):**
- Bin 1: 4, 8, 15, 21
- Bin 2: 21, 24, 25, 28
- Bin 3: 34, 40, 52, 60

Equal width is simple but sensitive to outliers (they create near-empty bins). Equal frequency balances counts but can split identical values (21) across bins.`,
    },
    {
      title: "RMSE vs MAE with an outlier",
      level: "Medium",
      marks: 4,
      question:
        "Actual: 3, 5, 2, 7, 4. Predicted: 2.5, 5, 4, 8, 4.5. (a) Compute MAE and RMSE. (b) A sixth house has actual 6 and predicted 16. Recompute both. (c) Which metric changed more, and which would you report if outliers are common?",
      solution: `
**(a)** Errors: −0.5, 0, 2, 1, 0.5
- MAE $= 4/5 = $ **0.80**
- RMSE $= \\sqrt{(0.25+0+4+1+0.25)/5} = \\sqrt{1.1} = $ **1.049**

**(b)** Add an error of 10:
- MAE $= 14/6 = $ **2.33**
- RMSE $= \\sqrt{(5.5+100)/6} = \\sqrt{17.58} = $ **4.19**

**(c)** RMSE grew **4×**, MAE only **2.9×**, because squaring amplifies the large error. With many outliers, report **MAE** (the $\\ell_1$ norm, slide 7). RMSE is preferred when large errors are especially bad and outliers are rare (bell-shaped errors).`,
    },
    {
      title: "Stratified test-set sizes",
      level: "Easy",
      marks: 3,
      question:
        "The housing dataset has 20,640 districts. Income categories 1–5 make up 4%, 32%, 35%, 18% and 11% of the data. You hold out 20% as the test set. How many districts of each category should a stratified split put in the test set? Why not a purely random split?",
      solution: `
Test size $= 0.2 \\times 20640 = 4128$

| Cat | % | Test count |
|---|---|---|
| 1 | 4% | ≈ **165** |
| 2 | 32% | ≈ **1321** |
| 3 | 35% | ≈ **1445** |
| 4 | 18% | ≈ **743** |
| 5 | 11% | ≈ **454** |

(The rounding sums to 4128.)

**Why stratify:** median income is the most important predictor. A random split could by chance under-represent a small stratum such as category 1 (only 4%), biasing the test estimate. Stratification guarantees each category appears in the same proportion as in the population.`,
    },
    {
      title: "Mahalanobis distance",
      level: "Hard",
      marks: 5,
      question:
        "The covariance matrix of the data is $\\Sigma = \\begin{pmatrix}0.3 & 0.2\\\\0.2 & 0.3\\end{pmatrix}$. For $A = (0.5, 0.5)$, $B = (0, 1)$, $C = (1.5, 1.5)$ compute $\\text{mahal}(A,B)$ and $\\text{mahal}(A,C) = (x-y)^T\\Sigma^{-1}(x-y)$. Compare with the Euclidean distances and explain.",
      solution: `
$\\det\\Sigma = 0.09 - 0.04 = 0.05$
$$\\Sigma^{-1} = \\frac{1}{0.05}\\begin{pmatrix}0.3 & -0.2\\\\-0.2 & 0.3\\end{pmatrix} = \\begin{pmatrix}6 & -4\\\\-4 & 6\\end{pmatrix}$$

**A–B:** $d = (0.5, -0.5)$
$d^T\\Sigma^{-1}d = 6(0.25) + 6(0.25) - 2\\cdot4\\cdot(0.5)(-0.5) = 1.5+1.5+2 = $ **5**

**A–C:** $d = (-1, -1)$
$d^T\\Sigma^{-1}d = 6 + 6 - 2\\cdot4\\cdot(1) = $ **4**

**Euclidean:** $|AB| = 0.707$, $|AC| = 1.414$. So C is *twice as far* as B by Euclidean distance, but **closer** by Mahalanobis.

**Why:** the attributes are positively correlated, so the data cloud stretches along the diagonal. C lies *along* the direction of variation, which is typical. B lies *across* it, which is unusual. Mahalanobis measures distance in units of the data's spread.`,
    },
    {
      title: "Hamming distance and one-hot encoding",
      level: "Easy",
      marks: 3,
      question:
        "(a) Hamming distance between 1011101 and 1001001? (b) `ocean_proximity` has 5 categories: <1H OCEAN, INLAND, ISLAND, NEAR BAY, NEAR OCEAN. How many columns does one-hot encoding create, and what is the Hamming distance between any two different one-hot vectors? (c) Why is label encoding 0–4 a bad idea here?",
      solution: `
**(a)** Compare bit by bit: they differ at positions 3 and 5, so the Hamming distance is **2**.

**(b)** **5 columns** (one per category). Two different one-hot vectors always differ in exactly 2 positions, so the Hamming distance is **2**: every category is equally far from every other.

**(c)** Label encoding makes '<1H OCEAN' = 0 and 'NEAR OCEAN' = 4. The algorithm assumes 0 and 1 are more similar than 0 and 4, an **order that doesn't exist** (the attribute is nominal). One-hot avoids this false ordering (slide 98).`,
    },
  ],

  theory: [
    {
      title: "Identify attribute types",
      marks: 4,
      question:
        "Classify each attribute as nominal, ordinal, interval or ratio, and as discrete or continuous. Justify. (a) Employee ID (b) Customer satisfaction (1–5 stars) (c) Temperature in °C (d) Time taken to run 100 m (e) Date of birth (f) Number of children (g) Blood group (h) Kelvin temperature",
      solution: `
| Attribute | Type | Discrete/Cont. | Why |
|---|---|---|---|
| Employee ID | **Nominal** | Discrete | Only = / ≠ is meaningful; averaging IDs is nonsense |
| Satisfaction 1–5 | **Ordinal** | Discrete | Order matters but the gaps aren't equal |
| °C | **Interval** | Continuous | Differences meaningful; zero is arbitrary, so 20 °C ≠ 2 × 10 °C |
| 100 m time | **Ratio** | Continuous | True zero; 20 s is twice 10 s |
| Date of birth | **Interval** | Discrete (days) | Differences (age) meaningful; no true zero date |
| No. of children | **Ratio** | Discrete | True zero, counts |
| Blood group | **Nominal** | Discrete | Labels only |
| Kelvin | **Ratio** | Continuous | Absolute zero exists |`,
    },
    {
      title: "Spot the data-preprocessing issues",
      pyq: "Revision deck Q5: list at least 6 issues with the travel-insurance dataset",
      marks: 6,
      question: `An insurance company's 2015 travel-insurance purchase log is shown below. List **at least six** issues that must be fixed during data preprocessing, and suggest a fix for each.

| Cust ID | Name | Age | Date of Birth | Profession | Date of Purchase | Sum Insured |
|---|---|---|---|---|---|---|
| 101 | Ravi K | 34 | 12/05/1981 | Engineer | 2015-03-14 | ₹ 5,00,000 |
| 102 | Meera S | n/a | 1990-07-22 | | 14 Mar 2015 | USD 8,000 |
| 101 | Ravi K | 34 | 12/05/1981 | Engineer | 2015-03-14 | ₹ 5,00,000 |
| 103 | John P | 212 | 1978-01-02 | Teacher | 2015/04/01 | ₹ 0 |
| 104 | Anu | 29 | 1986-11-30 | doctor | 2015-05-10 | ₹ 3,00,000 |`,
      solution: `
1. **Duplicate record:** rows 1 and 3 are identical. *Fix:* de-duplicate.
2. **Missing value "n/a" in Age:** *Fix:* derive it from DOB (best here) or impute with the mean/median.
3. **Blank Profession:** *Fix:* impute with the **mode**, or add an "Unknown" category.
4. **Redundant attributes:** Age and Date of Birth carry the same information. *Fix:* keep one (derive age at purchase date).
5. **Inconsistent date formats:** dd/mm/yyyy, yyyy-mm-dd, "14 Mar 2015", yyyy/mm/dd. *Fix:* parse into one standard format.
6. **Mixed currencies:** ₹ and USD in Sum Insured. *Fix:* convert to one currency.
7. **Invalid / outlier value:** Age = 212 is impossible (noise). *Fix:* recompute from DOB or treat as missing.
8. **Invalid Sum Insured = ₹ 0:** a purchased policy can't insure 0. *Fix:* treat as missing and impute (mean/median).
9. **Inconsistent capitalisation:** "doctor" vs "Engineer". *Fix:* normalise the text case.
10. **Formatting:** Indian digit grouping (5,00,000) and currency symbols stored as text. *Fix:* strip them and store as numbers.`,
    },
    {
      title: "Frame the housing-price problem",
      marks: 3,
      question:
        "You must build a model that predicts the median house price of a district from census data. Explain how you would frame the problem: the questions to ask the business, the type of learning task, and the performance measure.",
      solution: `
- **Business questions:** What is the prediction for, and how will it be used (e.g. it feeds an investment system downstream)? This decides the algorithm, the metric and the effort. What is the **current solution/baseline**, e.g. experts' manual estimates with about 20% error? That tells you what is "good enough".
- **Task type:** *supervised* (labelled with actual median prices), *regression* (real-valued output), *multivariate* (many input features), *batch* (static data that fits in memory, no continuous stream). A plain batch-learning model is fine.
- **Metric:** **RMSE** $=\\sqrt{\\frac1m\\sum(h(x^{(i)})-y^{(i)})^2}$ is the typical choice. Use **MAE** if there are many outlier districts.
- Also **check assumptions:** e.g. if downstream actually needs price *categories* (cheap/medium/expensive), the problem becomes classification.`,
    },
    {
      title: "Handling missing values",
      marks: 3,
      question: "Give two reasons values go missing, and explain three strategies to handle missing values with their trade-offs.",
      solution: `
**Reasons:** (1) information not collected, e.g. people decline to give age or weight; (2) the attribute doesn't apply, e.g. annual income for children.

**Strategies:**
1. **Eliminate** the objects (rows) or the attribute (column). Simple, but loses data and can introduce **bias** if the rows missing values are systematically different.
2. **Estimate / impute:** mean/median (e.g. \`SimpleImputer(strategy="median")\` for total_bedrooms), the mode for categories, interpolation for time series. Keeps the data, but can distort the variance and correlations.
3. **Ignore during analysis:** e.g. compute similarity using only the attributes that are present. Algorithms such as Naive Bayes can skip them naturally.`,
    },
    {
      title: "Curse of dimensionality and dimensionality reduction",
      marks: 3,
      question: "What is the curse of dimensionality? List the purposes of dimensionality reduction and name two techniques.",
      solution: `
**Curse of dimensionality:** as the number of attributes grows, the volume of the space grows exponentially, so a fixed amount of data becomes very **sparse**. Distances between points become nearly equal and density loses meaning. Clustering, k-NN and outlier detection degrade, and more data is needed to generalise.

**Purposes of reduction (slide 47):**
- avoid the curse of dimensionality
- reduce the time and memory needed by algorithms
- make data easier to visualise
- help eliminate irrelevant features and reduce noise

**Techniques:** **PCA** (find orthogonal projections capturing the maximum variance) and **SVD**. Feature *subset selection* is another route.`,
    },
    {
      title: "Feature subset selection vs feature creation",
      marks: 3,
      question: "Differentiate feature subset selection and feature creation, with examples of redundant features, irrelevant features, feature extraction and feature construction.",
      solution: `
- **Feature subset selection** keeps a subset of the existing features:
  - *Redundant:* duplicates the information in others, e.g. purchase price and sales tax paid.
  - *Irrelevant:* no useful information for the task, e.g. student ID when predicting GPA.
- **Feature creation** makes new, more informative attributes:
  - *Extraction:* from raw data, e.g. edges from images.
  - *Construction:* combining features, e.g. density = mass/volume, or **rooms_per_household** = total_rooms/households.
  - *Mapping to a new space:* e.g. Fourier/wavelet transform to expose frequencies hidden in noise.`,
    },
    {
      title: "Sampling methods",
      marks: 3,
      question: "Why do we sample in ML? Explain simple random sampling (with and without replacement) and stratified sampling. When is stratified sampling essential?",
      solution: `
**Why:** processing all the data is too expensive or slow. **Key principle:** a sample works almost as well as the full data **if it is representative**, i.e. it has roughly the same properties as the original.

- **Simple random:** every item has an equal chance of selection.
  - *Without replacement:* a selected item is removed and can't be picked again.
  - *With replacement:* an item can be picked more than once (used in bootstrap).
- **Stratified:** partition the data into groups (strata), then randomly sample from each, usually in proportion.

**Essential** when some groups are small or important, such as rare classes (fraud) or the income categories in housing. Random sampling might miss or under-represent them.`,
    },
  ],

  quiz: [
    { q: "Temperature in Celsius is which attribute type?", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answer: 2, why: "Differences are meaningful but zero is arbitrary, so ratios are not." },
    { q: "Minkowski distance with r → ∞ is:", options: ["Manhattan", "Euclidean", "Supremum (max component difference)", "Hamming"], answer: 2, why: "$L_\\infty$ = the maximum absolute difference over the components." },
    { q: "Which metric is preferred when the data has many outliers?", options: ["RMSE", "MAE", "R²", "Accuracy"], answer: 1, why: "MAE ($\\ell_1$) doesn't square errors, so outliers affect it less." },
    { q: "Correlation between x = (−3…3) and y = x² is:", options: ["1", "−1", "0", "0.5"], answer: 2, why: "The relationship is perfect but non-linear; correlation only captures linear association." },
    { q: "Dividing total_rooms by households to get rooms_per_household is:", options: ["Feature selection", "Feature construction", "Discretisation", "Sampling"], answer: 1, why: "A new feature built by combining existing ones." },
    { q: "Why use one-hot encoding for ocean_proximity instead of integers 0–4?", options: ["Saves memory", "Integers imply a false order and similarity", "scikit-learn requires it", "It removes missing values"], answer: 1, why: "Nominal categories have no order, and integer codes would suggest that nearby codes are similar." },
    { q: "Which statistic is LEAST affected by an outlier?", options: ["Mean", "Range", "Standard deviation", "Median"], answer: 3, why: "The median depends only on the middle value(s)." },
    { q: "Student ID when predicting GPA is an example of:", options: ["Redundant feature", "Irrelevant feature", "Noise", "Duplicate"], answer: 1, why: "It carries no information useful for the task." },
    { q: "The Hamming distance between 1100 and 1010 is:", options: ["1", "2", "3", "4"], answer: 1, why: "They differ in positions 2 and 3." },
    { q: "The housing test set was created with stratified sampling on:", options: ["Latitude", "Income category", "Ocean proximity", "House age"], answer: 1, why: "Median income is the most important predictor, so the test set must represent every income category." },
  ],
};
