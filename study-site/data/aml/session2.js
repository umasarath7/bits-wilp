// AML — Contact Session 2: End-to-End ML (framing, data types, preprocessing, analysis, tools)
// Source: CourseFiles/AML/ContactSession2-EndToEndML.pptx (99 slides)
// Teaching style: each lesson opens with the "why", builds on the housing running example,
// spells out every abbreviation the first time, and only then gives formulas.

export default {
  title: "End-to-End ML: Framing, Data & Preprocessing",
  source: "ContactSession2-EndToEndML.pptx · 99 slides",
  overview:
    "Session 1 told us *what* ML is. This session walks through *what you actually do* on a real project, from the first meeting with the business to a clean dataset ready for a model. We follow the slides' running example the whole way: **predicting house prices from census data**. We'll ask, one step at a time: what problem are we really solving, and how will we measure success? What kind of data do we have, and what can we legally do with each column? How do we clean it and reshape it? How do we summarise it, compare records, and look at it? Every idea starts with *why* we need it. Abbreviations are spelled out the first time, and there's a glossary at the end.",

  summary: [
    {
      id: "frame",
      heading: "Lesson 1: Why start with the big picture? Framing the problem",
      slides: "2–6",
      blocks: [
        {
          type: "p",
          text: "Imagine a real-estate investment firm calls you in. They say: *“Build a model of housing prices using the census data.”* (slide 4). The census gives, for every **district** (the smallest area the census reports on, about 600 to 3,000 people), numbers like population, median income, and the median house price. The model should predict the median house price of any district from all the other numbers. It is judged by **how close its predictions are to the actual prices for districts it hasn't seen**.",
        },
        {
          type: "p",
          text: "It's tempting to open a notebook and start coding. Don't. The first questions are about the **business**, because the answers change everything that follows (slide 5):",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**What will the prediction be used for, and what's the benefit?** Say the firm feeds your price into another system that decides where to invest. Then errors cost real money, which affects how accurate the model must be, which metric you use, and how much effort goes into maintaining it.",
            "**What's the current solution, and how good is it?** Maybe experts estimate prices by hand today and are often 20% off. That's your **baseline**. Your model only adds value if it beats the baseline.",
          ],
        },
        {
          type: "p",
          text: "**Then decide what kind of ML problem it is (slide 6).** Remember the three questions from Session 1? Answer each one from what you know about the data:",
        },
        {
          type: "list",
          items: [
            "**Labels?** Each district in the data comes with its actual median house price, i.e. the answer we want to predict. So it's **supervised**.",
            "**Category or number?** We predict a price, a real number, from several inputs (population, income and so on). So it's **multivariate regression**. (“Multivariate” here just means many input variables.)",
            "**Batch or online?** The census data sits still; it isn't streaming in. And it's small enough to fit in memory. So **batch** learning is fine.",
          ],
        },
        {
          type: "callout",
          kind: "idea",
          title: "The conclusion, in one sentence",
          text: "The housing task is a **supervised, multivariate, batch regression** problem. In exams, frame any problem this way: *type of feedback → category or number → batch or online → metric*, each with a “because”.",
        },
      ],
    },
    {
      id: "metric",
      heading: "Lesson 2: How do we measure how wrong the model is? RMSE and MAE",
      slides: "7",
      blocks: [
        {
          type: "p",
          text: "We said the model is good if its predictions are *close* to the actual prices. But “close” needs to be a single number, so we can compare models and track progress. For regression, the slides give two standard choices. Both start from the **error** on each district: predicted price − actual price.",
        },
        {
          type: "p",
          text: "**First idea: just average the errors.** It doesn't work. An error of +10 lakh on one district and −10 lakh on another average to 0, which makes a terrible model look perfect. We need to stop positive and negative errors cancelling. There are two ways to do that, and they give the two metrics.",
        },
        {
          type: "p",
          text: "**Way 1: take the absolute value (drop the sign).** Average the sizes of the errors. This is the **Mean Absolute Error (MAE)**. In plain words: *on average, how many lakhs is the prediction off by?*",
        },
        {
          type: "p",
          text: "**Way 2: square the errors,** average them, then take the square root to get back to the original units. This is the **Root Mean Square Error (RMSE)**. Squaring does two things: it makes every error positive, and it **punishes big errors much more** than small ones (an error of 2 counts as 4, but an error of 10 counts as 100).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The two formulas (slide 7 notation)",
          text: "$$\\text{MAE} = \\frac{1}{m}\\sum_{i=1}^{m} \\left| h(x^{(i)}) - y^{(i)} \\right| \\qquad \\text{RMSE} = \\sqrt{\\frac{1}{m}\\sum_{i=1}^{m} \\left( h(x^{(i)}) - y^{(i)} \\right)^2}$$\n\n- $m$ = number of districts (instances)\n- $x^{(i)}$ = the features of the $i$-th district; $y^{(i)}$ = its actual price\n- $h$ = the model (h for “hypothesis”), so $h(x^{(i)})$ is the predicted price\n- $\\Sigma$ (sigma) means “add all of these up”",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: one bad miss",
          text: "Four flats have actual prices 50, 60, 70, 80 (₹ lakh). A model predicts 52, 57, 71, 82. The errors are +2, −3, +1, +2.\n\n- MAE $= (2+3+1+2)/4 = $ **2.0** lakh\n- RMSE $= \\sqrt{(4+9+1+4)/4} = \\sqrt{4.5} = $ **2.12** lakh\n\nNow suppose the last prediction is 90 instead (error +10):\n\n- MAE $= (2+3+1+10)/4 = $ **4.0**, i.e. doubled\n- RMSE $= \\sqrt{(4+9+1+100)/4} = \\sqrt{28.5} = $ **5.34**, i.e. **2.5× bigger**\n\nOne large miss moved RMSE much more than MAE. That's the squaring at work.",
        },
        {
          type: "p",
          text: "**So which one should you use?** RMSE is the usual default for regression, and it's right when **big errors are especially bad** (a price off by ₹50 lakh is a disaster, not just five ₹10-lakh mistakes). But if your data has **many outliers**, such as a few palatial districts, RMSE gets dominated by them. Then **MAE is preferred**, because it treats every lakh of error the same (slide 7).",
        },
        {
          type: "p",
          text: "**The general form: norms.** Both metrics are ways of measuring the “size” of the list of errors. That size is called a **norm**. MAE uses the **ℓ₁ norm** (sum of absolute values, also called the **Manhattan** norm). RMSE uses the **ℓ₂ norm** (square root of the sum of squares, the **Euclidean** norm). In general the ℓₖ norm is $\\|v\\|_k = (\\sum |v_i|^k)^{1/k}$. **The higher k is, the more the norm focuses on the largest values** and ignores small ones. That's exactly why RMSE (k = 2) is more sensitive to outliers than MAE (k = 1). We'll meet these same norms again as distances in Lesson 10.",
        },
      ],
    },
    {
      id: "data",
      heading: "Lesson 3: What exactly is data? Objects and attributes",
      slides: "8–11",
      blocks: [
        {
          type: "p",
          text: "Before we can clean or model data, we need a shared vocabulary for it. Picture the housing data as a spreadsheet: each **row** is a district, each **column** is a measurement about it.",
        },
        {
          type: "list",
          items: [
            "An **attribute** is a property or characteristic of an object, such as a person's eye colour or a district's median income. It's a column. Different books call it a **variable, field, characteristic, dimension or feature**; they all mean the same thing.",
            "An **object** is the thing being described, a row. It's also called a **record, point, case, sample, entity or instance**.",
            "An **attribute value** is the actual number or symbol in a cell, e.g. median income = 8.3.",
          ],
        },
        {
          type: "p",
          text: "**An attribute is not the same as its values (slide 10).** This sounds pedantic, but it matters. *The same attribute can be recorded with different values*: height can be in feet or metres. And *different attributes can use the same kind of values* but mean very different things: an employee ID and an age are both whole numbers, but averaging ages makes sense while averaging IDs is nonsense. **The properties of the attribute decide what you can do with it, not the fact that it's stored as a number.**",
        },
        {
          type: "p",
          text: "**Discrete vs continuous (slide 11).** A **discrete** attribute has a finite (or countably infinite) set of values: PIN codes, the number of rooms, the set of words in a collection of documents. It's usually stored as whole numbers. **Binary** attributes (yes/no, 0/1) are a special case of discrete. A **continuous** attribute takes real-number values: temperature, height, weight, price. In practice we can only store a finite number of digits, so continuous attributes are usually stored as floating-point numbers.",
        },
      ],
    },
    {
      id: "types",
      heading: "Lesson 4: Why do attribute types matter? Nominal, ordinal, interval, ratio",
      slides: "12–17",
      blocks: [
        {
          type: "p",
          text: "Here's a question that sounds silly but isn't: *is 20 °C twice as hot as 10 °C?* Most people say yes. It's wrong. To see why, and to avoid doing meaningless maths on your data, you need the four attribute types.",
        },
        {
          type: "p",
          text: "The idea is a **ladder**. Each step up allows one more kind of operation. Ask four questions of any attribute (slide 12):",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Can I tell whether two values are the same or different?** (= and ≠). This is **distinctness**.",
            "**Can I put the values in order?** (< and >). This is **order**.",
            "**Is the difference between two values meaningful?** (+ and −). **Meaningful differences.**",
            "**Is the ratio between two values meaningful?** (× and ÷). **Meaningful ratios**, which requires a **true zero** (zero means “none of it”).",
          ],
        },
        {
          type: "table",
          caption: "The four types. Each type has all the properties of the ones above it, plus one more",
          head: ["Type", "What it allows", "Examples", "Operations that make sense"],
          rows: [
            ["**Nominal**", "Distinctness only (=, ≠)", "PIN code, eye colour, employee ID, blood group", "Mode (most frequent value), counts"],
            ["**Ordinal**", "+ Order (<, >)", "Grades (A, B, C), rankings, {short, medium, tall}, 1–10 taste scores", "Median, percentiles"],
            ["**Interval**", "+ Meaningful differences (+, −)", "Calendar dates, temperature in °C or °F", "Mean, standard deviation, correlation"],
            ["**Ratio**", "+ Meaningful ratios (×, ÷): has a true zero", "Temperature in Kelvin, length, weight, counts, time taken to run a race", "Everything, including “twice as much”"],
          ],
        },
        { type: "diagram", name: "s2-ladder" },
        {
          type: "p",
          text: "Walk up the ladder with examples. **Nominal:** PIN codes 560001 and 400001 are just different names; saying one is “bigger” means nothing. **Ordinal:** grade A is better than grade B, but the gap between A and B isn't necessarily the same as between B and C. **Interval:** the difference between 10 °C and 20 °C is exactly the same as between 20 °C and 30 °C, so differences work. **Ratio:** a 10 kg bag really is twice as heavy as a 5 kg bag, because 0 kg means “no weight at all”.",
        },
        {
          type: "p",
          text: "**Back to the temperature puzzle (slide 13).** Celsius puts 0 at the freezing point of water, a convenient choice but not “no heat”. Because the zero is arbitrary, ratios don't mean anything: 20 °C is not twice as hot as 10 °C. (Convert to Fahrenheit, 50 °F and 68 °F, and the “twice” vanishes.) **Kelvin** starts at absolute zero, where there is genuinely no heat, so 20 K really is twice 10 K. Same physical quantity, different scale, different type: Celsius is **interval**, Kelvin is **ratio**.",
        },
        {
          type: "p",
          text: "Slide 13's second puzzle: Bill is 3 inches above average height, Bob is 6 inches above average. Is Bob twice as tall as Bill? **No.** “Height above average” has its zero at the average, not at zero height, so it's an interval scale just like Celsius.",
        },
        {
          type: "p",
          text: "Nominal and ordinal are called **categorical** (or qualitative); interval and ratio are **numeric** (or quantitative).",
        },
        {
          type: "p",
          text: "**Asymmetric attributes (slide 16).** Sometimes only the **presence** of a value matters, not its absence. Think of a supermarket's list of items: that you bought rice tells me something; that you didn't buy any of the other 9,999 products tells me almost nothing. The same goes for the words present in a document. We'll see in Lesson 10 that such data needs special similarity measures.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Key message (slide 17)",
          text: "Only use operations that are **meaningful for the attribute's type**. The way data is stored (as numbers or strings) can hide its real properties, or suggest properties it doesn't have. A PIN code is stored as a number, but you should never average it.",
        },
      ],
    },
    {
      id: "datasets",
      heading: "Lesson 5: What shapes can a dataset take?",
      slides: "18–27",
      blocks: [
        {
          type: "p",
          text: "Not all data is a neat spreadsheet. The shape of the data decides which tools you can use, so it's worth recognising the common shapes. First, four **characteristics** to check on any dataset (slide 18):",
        },
        {
          type: "list",
          items: [
            "**Dimensionality:** how many attributes? Hundreds or thousands of columns bring special problems, the **curse of dimensionality** (Lesson 8).",
            "**Sparsity:** are most values zero or empty? In a supermarket's product-by-customer table, almost every cell is 0. When only presence counts, storing just the non-zero entries saves huge amounts of space and time.",
            "**Resolution:** at what level of detail was it recorded? Patterns depend on scale. Rainfall measured per minute is mostly noise; per year, the monsoon pattern disappears. Per month, it's clear.",
            "**Size:** how many records? Some analyses only work on small data; others need a lot.",
          ],
        },
        {
          type: "p",
          text: "**Types of datasets (slides 19–27).** There are three families:",
        },
        {
          type: "list",
          items: [
            "**Record data:** a collection of records, each with the same fixed set of attributes. Three special kinds: a **data matrix**, where all attributes are numeric, so each record is a point in multi-dimensional space and the whole dataset is an $m \\times n$ matrix ($m$ rows = objects, $n$ columns = attributes); **document data**, where each document becomes a vector of word counts (one column per word); and **transaction data**, where each record is a set of items, e.g. the products in one shopping trip.",
            "**Graph data:** objects connected by links. The World Wide Web (pages linked to pages), social networks, and molecules such as benzene (C₆H₆), where atoms are connected by bonds.",
            "**Ordered data:** the order matters. **Sequences of transactions** (what a customer bought, visit after visit), **genetic sequences** (strings of A, C, G, T), **time series** and **spatio-temporal data** (average monthly temperature of land and ocean across the globe).",
          ],
        },
      ],
    },
    {
      id: "quality",
      heading: "Lesson 6: Why is real data dirty, and what do we do about it?",
      slides: "28–35",
      blocks: [
        {
          type: "p",
          text: "**Why data quality matters (slide 30).** Suppose a bank builds a loan-risk model on poor data. Two bad things happen at once: some **creditworthy people are refused loans**, and **more loans go to people who default**. The model is only as good as the data it learnt from. Slide 31 lists the usual problems: noise and outliers, wrong data, fake data, missing values and duplicates. Let's take them one at a time.",
        },
        {
          type: "p",
          text: "**Noise (slide 32).** Noise is random distortion of the true values. Think of a voice on a bad phone line, or “snow” on an old TV. The slide adds random noise to two clean sine waves, and their shape becomes hard to see. In data: a faulty sensor adding random jitter to temperature readings, or typos in manually entered numbers.",
        },
        {
          type: "p",
          text: "**Outliers (slide 33).** An outlier is a record that is **very different from most of the others**: a ₹40-crore bungalow in a district of ₹40-lakh flats. The key point is that outliers come in two kinds:",
        },
        {
          type: "list",
          items: [
            "**Case 1: the outlier is noise** that gets in the way of the analysis (a typing mistake added three zeros). Fix it or remove it.",
            "**Case 2: the outlier is exactly what you're looking for.** In **credit-card fraud detection** and **network intrusion detection**, the rare, unusual records *are* the target. Deleting them would delete the whole point.",
          ],
        },
        {
          type: "p",
          text: "**Missing values (slide 34).** Values go missing for two reasons: the information **wasn't collected** (people decline to give their age or weight), or the attribute **doesn't apply** (annual income for a child). Three ways to handle them:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Eliminate** the rows or the column. Simple, but you lose data, and if the people with missing values are different from the rest, you introduce bias.",
            "**Estimate** the missing values. Use the median of the column, or for a temperature time series, interpolate between the readings before and after. In the housing notebook, 207 districts are missing `total_bedrooms`, and they're filled with the median.",
            "**Ignore** the missing value during analysis, e.g. compare two records using only the attributes both of them have.",
          ],
        },
        {
          type: "p",
          text: "**Duplicate data (slide 35).** The same real-world entity appears more than once, or nearly so: the same customer registered with two email addresses, or the same transaction logged twice. This is a **major issue when merging data from different sources**. Finding and resolving these is part of **data cleaning**.",
        },
      ],
    },
    {
      id: "prep",
      heading: "Lesson 7: How do we reshape data before modelling?",
      slides: "36–45",
      blocks: [
        {
          type: "p",
          text: "Clean data still isn't always in the right shape for a model. It may be too big, too detailed, on wildly different scales, or in the wrong form (text where the model needs numbers). Preprocessing fixes this. The slides cover these techniques.",
        },
        {
          type: "p",
          text: "**Aggregation (slide 37): combine many into one.** Combine two or more attributes (or objects) into a single one, e.g. daily sales into monthly sales, or cities into states. Why? **Less data** to process, a **change of scale** (a state-level view), and **more stable** data. Averages over bigger groups vary less. The slide shows that the standard deviation of *yearly* precipitation is smaller than that of *monthly* precipitation.",
        },
        {
          type: "p",
          text: "**Sampling (slides 38–39): use a subset.** Processing all the data may be too slow or expensive. The **key principle**: a sample works almost as well as the full data **if it is representative**, i.e. it has roughly the same properties as the whole. The slide shows 8,000 points reduced to 2,000 and then 500: the overall shape survives at 2,000, but details start to vanish at 500. Types of sampling:",
        },
        {
          type: "list",
          items: [
            "**Simple random sampling:** every item has an equal chance of being picked. *Without replacement*, a picked item is removed and can't be picked again. *With replacement*, it's put back, so it can be picked more than once.",
            "**Stratified sampling:** first split the data into groups (**strata**), then sample randomly from each group. This guarantees small but important groups are represented. If only 4% of districts are very-low-income, a plain random sample might barely include any; a stratified sample makes sure it includes about 4%.",
          ],
        },
        {
          type: "p",
          text: "**Discretisation (slides 40–43): turn a continuous number into a few categories.** Map a continuous attribute onto a small number of ordered bins, i.e. make it **ordinal**. Example: age → {child, adult, senior}. Many classification algorithms work best when attributes have only a few values. How do you choose the bin edges?",
        },
        {
          type: "list",
          items: [
            "**Unsupervised** (no labels used): **equal width** (every bin covers the same range, e.g. 0–20, 20–40, 40–60), **equal frequency** (every bin holds the same number of records), or **k-means** (let a clustering algorithm find natural groups).",
            "**Supervised** (use the class labels to place the edges): the slides' **Iris** flower dataset has three species. If you cut petal width into low, medium and high at the right points, low → Setosa, medium → Versicolour, high → Virginica. The labels tell you where to cut.",
          ],
        },
        {
          type: "p",
          text: "**Binarisation (slide 44): turn categories into 0/1 columns.** Map a categorical (or discretised) attribute into one or more **binary** attributes. Eye colour ∈ {brown, blue, green} becomes three columns: is_brown, is_blue, is_green. Exactly one of them is 1 for each person. This is also called **one-hot encoding**, and it's how text categories are usually fed to models (Lesson 12).",
        },
        {
          type: "p",
          text: "**Attribute transformation (slide 45): apply a function to every value.** Simple functions such as $x^k$, $\\log x$, $e^x$ or $|x|$. For example, incomes are heavily skewed (a few people earn enormously more), and taking $\\log(\\text{income})$ pulls that long tail in. The most important transformation is **normalisation**, which puts attributes on comparable scales:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The two common scaling methods",
          text: "**Min-max normalisation** squeezes values into the range 0 to 1:\n$$x' = \\frac{x - \\min}{\\max - \\min}$$\n\n**Standardisation (z-score)** centres values at 0 with a spread of 1:\n$$z = \\frac{x - \\bar x}{s}$$\n\nHere $\\bar x$ (“x-bar”) is the mean and $s$ is the standard deviation. A z-score says *how many standard deviations above or below average* a value is. A z of +2 means “unusually high”.",
        },
        {
          type: "p",
          text: "**Why scaling matters.** Take two customers described by age and annual income: A = (25 years, ₹5,00,000) and B = (45 years, ₹5,10,000). The age difference is 20 years, which is huge, but the income difference is ₹10,000, which is small. Yet the Euclidean distance between them is about **10,000**, almost entirely from income, simply because income is measured in bigger numbers. Any algorithm that uses distances (k-Nearest Neighbours, clustering) will effectively ignore age. Scaling puts both attributes on an equal footing.",
        },
      ],
    },
    {
      id: "dims",
      heading: "Lesson 8: Why can too many features hurt? Dimensionality reduction and feature engineering",
      slides: "46–51",
      blocks: [
        {
          type: "p",
          text: "You might think more attributes always means more information and a better model. Often the opposite happens, and the reason has a dramatic name: the **curse of dimensionality** (slide 46).",
        },
        {
          type: "p",
          text: "**An intuition.** Scatter 100 points along a 1-metre ruler: they're packed closely, about 1 cm apart. Now scatter the same 100 points across a 1 m × 1 m floor: much more space between them. Now across a 1 m × 1 m × 1 m room: they're very far apart. **Each new dimension multiplies the space, but you still have the same 100 points**, so the data becomes **sparse**. In very high dimensions, every point is far from every other point, and the distances all look about the same. Methods that depend on “nearby” and “dense”, such as clustering, k-Nearest Neighbours and outlier detection, stop working well.",
        },
        { type: "diagram", name: "s2-curse" },
        {
          type: "p",
          text: "**Dimensionality reduction (slide 47)** fights this. Its purposes: avoid the curse of dimensionality; **reduce time and memory** needed by algorithms; make data **easier to visualise** (you can plot 2 or 3 dimensions, not 50); and help **remove irrelevant features and noise**. The popular techniques are **Principal Component Analysis (PCA)** and **Singular Value Decomposition (SVD)**.",
        },
        {
          type: "p",
          text: "**How PCA works, intuitively.** Imagine a cloud of points shaped like a long, thin cigar tilted in 2-D. Most of the variation is along the length of the cigar. PCA finds that direction and says: *describe each point just by where it lies along the cigar*. You go from 2 numbers per point to 1 and lose very little. In general, PCA **finds new axes (projections) that capture the largest amount of variation** in the data, in decreasing order of importance. Slide 48 shows images rebuilt from more and more PCA components: **more components give a better reconstruction**, but less reduction.",
        },
        { type: "diagram", name: "s2-pca" },
        {
          type: "p",
          text: "**Feature subset selection (slide 49): keep only the useful columns.** Another way to cut dimensions is to drop features. Two kinds are worth dropping:",
        },
        {
          type: "list",
          items: [
            "**Redundant features** duplicate information already in other features. The purchase price of a product and the sales tax (GST) paid on it: one follows from the other.",
            "**Irrelevant features** carry no useful information for the task. A student's roll number doesn't help predict their Grade Point Average (GPA).",
          ],
        },
        {
          type: "p",
          text: "**Feature creation (slides 50–51): build better columns.** Sometimes the raw attributes don't express the important information well, and a new attribute does it better. Three ways:",
        },
        {
          type: "list",
          items: [
            "**Feature extraction:** derive features from raw data, e.g. extract edges from images before recognising objects.",
            "**Feature construction:** combine existing attributes. Mass and volume separately don't tell you what a material is, but **density = mass ÷ volume** does. In the housing data, **rooms per household** turns out to be far more useful than the total number of rooms (Lesson 12).",
            "**Mapping data to a new space:** transform the data so hidden patterns become visible. The slide mixes two sine waves with noise. In the original (time) view it's a mess, but a **Fourier transform** (which breaks a signal into its frequencies) shows two clear spikes at the two frequencies. **Wavelet** transforms work similarly.",
          ],
        },
      ],
    },
    {
      id: "stats",
      heading: "Lesson 9: How do we summarise data in a few numbers?",
      slides: "52–59",
      blocks: [
        {
          type: "p",
          text: "Before modelling, you should **explore** the data: this is called **Exploratory Data Analysis (EDA)**. Why? To pick the right preprocessing and tools, and because humans are very good at spotting patterns that automated tools miss (slide 54). The first step is **summary statistics**: numbers that capture the **frequency, location (centre) and spread** of each attribute (slide 55). Most can be computed in a single pass through the data.",
        },
        {
          type: "p",
          text: "**For categorical data: frequency and mode (slide 56).** The **frequency** of a value is the percentage of records that have it. The **mode** is the most frequent value. *In a class, the mode of “favourite subject” might be Maths, with a frequency of 40%.*",
        },
        {
          type: "p",
          text: "**Percentiles (slide 57).** For ordinal or continuous data, the **p-th percentile** $x_p$ is the value such that **p% of the observed values are less than it**. If your exam score is at the 90th percentile, 90% of students scored below you. The **50th percentile is the median**.",
        },
        {
          type: "p",
          text: "**Location: mean vs median (slide 58).** The **mean** (average) is the most common measure of the centre, but it is **very sensitive to outliers**. The **median** (the middle value when sorted) and the **trimmed mean** (drop the top and bottom p%, then average the rest) are more robust.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example: why the mean can mislead",
          text: "A small startup's monthly salaries (₹ thousand): 30, 35, 40, 45 and the founder's 250.\n\n- **Mean** $= (30+35+40+45+250)/5 = 400/5 = $ **80**\n- **Median** = the middle value when sorted = **40**\n\nFour of the five people earn 45 or less, yet the “average salary” is 80. One outlier dragged the mean up; the median still describes a typical employee. That's why news reports on incomes and house prices usually quote the **median**, and why the census gives *median* house value and *median* income.",
        },
        { type: "diagram", name: "s2-meanmedian" },
        {
          type: "p",
          text: "**Spread: range and variance (slide 59).** The **range** is max − min: simple, but it depends only on the two most extreme values, so a single outlier changes it completely. The **variance**, and its square root the **standard deviation** $s$, is the most common measure of spread: roughly, *how far is a typical value from the mean?* Because it squares distances, it too is affected by outliers, so more robust measures are sometimes used: the **Average Absolute Deviation (AAD)**, the **Median Absolute Deviation (MAD)**, and the **Interquartile Range (IQR)**, which is the 75th percentile minus the 25th.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Spread formulas",
          text: "$$s^2 = \\frac{1}{m-1}\\sum_{i=1}^{m} (x_i - \\bar x)^2 \\qquad \\text{AAD} = \\frac{1}{m}\\sum_{i=1}^{m} |x_i - \\bar x|$$\n\n$m$ = number of values. We divide by $m - 1$ (not $m$) for the **sample** variance, because using the sample's own mean makes the spread look slightly smaller than it really is; $m-1$ corrects for that.",
        },
      ],
    },
    {
      id: "proximity",
      heading: "Lesson 10: How do we measure how similar two things are?",
      slides: "60–70",
      blocks: [
        {
          type: "p",
          text: "Many ML methods need to answer one question over and over: *how alike are these two records?* k-Nearest Neighbours finds the most similar past cases; clustering groups similar customers; recommendation systems find users with similar tastes. So we need a number for “alike”.",
        },
        {
          type: "p",
          text: "**Two directions (slide 60).** A **similarity** is higher when objects are more alike and often lies between 0 and 1. A **dissimilarity**, usually called a **distance**, is lower when they're more alike, with a minimum of 0 and no fixed upper limit. **Proximity** is the umbrella word for either.",
        },
        { type: "p", text: "#### Distances between numeric records" },
        {
          type: "p",
          text: "**Euclidean distance (slide 62)** is the straight-line distance you learnt in school geometry (Pythagoras), extended to any number of attributes. **Important:** if the attributes are on different scales, **standardise first**. Remember the age-vs-income example from Lesson 7.",
        },
        {
          type: "p",
          text: "**Minkowski distance (slides 64–65)** is a family of distances with a dial $r$. Turning the dial gives the distances you need to know:",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The Minkowski family",
          text: "$$d(x, y) = \\left( \\sum_{k=1}^{n} |x_k - y_k|^r \\right)^{1/r}$$\n\n$n$ = number of attributes; $x_k, y_k$ = the $k$-th attribute of $x$ and $y$.\n\n- **r = 1: Manhattan distance** (also called city-block, taxicab or L₁): $\\sum |x_k - y_k|$. The distance a taxi drives on a grid of streets, where you can't cut diagonally. For binary vectors this equals the **Hamming distance**: the number of positions where the bits differ.\n- **r = 2: Euclidean distance** (L₂): $\\sqrt{\\sum (x_k - y_k)^2}$. The straight line, as the crow flies.\n- **r → ∞: Supremum distance** (L_max or L∞): $\\max_k |x_k - y_k|$. Only the single biggest difference counts.\n\nDon't confuse $r$ (the dial) with $n$ (the number of attributes). All three work for any $n$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Worked example",
          text: "Points $P = (1, 2)$ and $Q = (4, 6)$. First, the differences in each attribute: $|1-4| = 3$ and $|2-6| = 4$.\n\n- Manhattan: $3 + 4 = $ **7** (walk 3 blocks east, then 4 blocks north)\n- Euclidean: $\\sqrt{3^2 + 4^2} = \\sqrt{25} = $ **5** (the straight line)\n- Supremum: $\\max(3, 4) = $ **4**\n\nNotice Manhattan ≥ Euclidean ≥ Supremum. That ordering always holds.",
        },
        { type: "diagram", name: "s2-distance" },
        {
          type: "p",
          text: "**Mahalanobis distance** goes one step further: it accounts for the fact that attributes can be **correlated** and have **different spreads**. Picture height and weight: they rise together. A person who is tall *and* heavy is typical; a person who is tall *and* very light is unusual. Mahalanobis distance treats a step *along* the natural trend of the data as short and a step *against* it as long, even if the straight-line (Euclidean) distances are equal. Formula: $(x - y)^T \\Sigma^{-1} (x - y)$, where $\\Sigma$ (capital sigma) is the **covariance matrix** of the data.",
        },
        { type: "p", text: "#### Similarity for documents and sparse data" },
        {
          type: "p",
          text: "**Cosine similarity.** Represent each document as a vector of word counts. Two articles about cricket share words like “wicket” and “over”, but one might be ten times longer, so its counts are ten times bigger and Euclidean distance would call them far apart. Cosine similarity looks only at the **angle** between the two vectors, not their lengths: pointing the same way means similar topics. It also **ignores 0–0 matches**, words absent from both documents, which carry no information (the asymmetric attributes from Lesson 4).",
        },
        { type: "diagram", name: "s2-cosine" },
        {
          type: "callout",
          kind: "formula",
          title: "Cosine similarity",
          text: "$$\\cos(x, y) = \\frac{x \\cdot y}{\\|x\\| \\, \\|y\\|}$$\n\n$x \\cdot y$ (the dot product) = $\\sum x_k y_k$; $\\|x\\|$ (the length) = $\\sqrt{\\sum x_k^2}$. Result: 1 = same direction, 0 = nothing in common.",
        },
        { type: "p", text: "#### Correlation, and its blind spot" },
        {
          type: "p",
          text: "**Correlation (slides 67–68)** measures the **linear** relationship between two attributes, on a scale from −1 (perfect downward straight line) through 0 (no straight-line pattern) to +1 (perfect upward straight line). Hours studied and marks typically have a positive correlation.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Drawback of correlation (slide 69)",
          text: "Take $x = (-3, -2, -1, 0, 1, 2, 3)$ and $y = x^2 = (9, 4, 1, 0, 1, 4, 9)$. Here $y$ is **completely determined** by $x$, yet the correlation is exactly **0**. Why? The relationship is a U-shape, not a straight line, and correlation only detects straight lines. On the left half, y falls as x rises; on the right half, it rises. The two halves cancel.\n\n**Lesson: correlation = 0 means “no linear relationship”, not “no relationship”.**",
        },
        { type: "diagram", name: "s2-corr" },
        {
          type: "p",
          text: "**Choosing a measure (slide 70).** The right measure depends on the kind of data: records, images, graphs, sequences and 3-D protein structures all have their own. Useful properties to look for: **symmetry** (distance from A to B equals B to A), **tolerance to noise and outliers**, and above all, the measure must **fit the data and agree with domain knowledge**.",
        },
      ],
    },
    {
      id: "viz",
      heading: "Lesson 11: Why look at the data? Visualisation",
      slides: "71–82",
      blocks: [
        {
          type: "p",
          text: "A table of 20,000 rows tells you almost nothing. The same data as a picture can show a trend, a cluster or an outlier in seconds. **Visualisation** turns data into graphical elements (points, lines, shapes, colours) so our eyes can do the pattern-finding (slide 71). The slides cover these techniques:",
        },
        {
          type: "table",
          head: ["Plot", "What it shows", "Use it when"],
          rows: [
            ["**Histogram** (slide 72)", "Split one attribute's values into bins and draw a bar for how many records fall in each", "You want the **distribution** of one attribute: is it bell-shaped, skewed, capped? Note: its shape changes with the number of bins"],
            ["**2-D histogram** (slide 73)", "The joint distribution of two attributes", "You want to see how two attributes vary together"],
            ["**Box plot** (slide 74)", "A box from the 25th to the 75th percentile, a line at the median (50th), whiskers to the 10th and 90th percentiles, dots for outliers", "Comparing distributions across groups compactly; spotting outliers"],
            ["**Scatter plot** (slide 75)", "Each record is a dot positioned by two attributes; a grid of these (scatter-plot matrix) covers many pairs", "Looking for **relationships** between attributes"],
            ["**Contour plot** (slide 76)", "Lines connecting points of equal value on a map-like grid", "A continuous attribute measured over space: elevation, sea-surface temperature, rainfall"],
            ["**Matrix plot** (slides 77–79)", "The data matrix or the correlation matrix drawn as coloured cells", "Seeing structure when records are sorted by class"],
            ["**Star plots, Chernoff faces** (slides 80–82)", "Each record becomes a star (axes radiating out) or a cartoon face (each attribute controls a feature like eye size)", "Comparing records across many attributes at once, using our skill at recognising shapes and faces"],
          ],
        },
        { type: "diagram", name: "s2-boxplot" },
      ],
    },
    {
      id: "tools",
      heading: "Lesson 12: Putting it all together: the housing notebook",
      slides: "83–99",
      blocks: [
        {
          type: "p",
          text: "**The tools (slides 84–88).** **Jupyter Notebook** lets you mix live code, equations, charts and text, and run code step by step. **Google Colab** is Google's cloud version, with free access to GPUs and TPUs (Graphics and Tensor Processing Units, special chips that speed up ML). **Anaconda** installs Python with everything set up. The key Python libraries: **NumPy** (fast arrays and linear algebra), **SciPy** (scientific functions built on NumPy), **Matplotlib** (plotting) and **scikit-learn** (ready-made ML models, preprocessing and evaluation tools). Free datasets: the UC Irvine (UCI) Machine Learning Repository, Kaggle, and Amazon Web Services (AWS).",
        },
        {
          type: "p",
          text: "Now watch every lesson above get used on the real housing data (the backup slides follow the Hands-On ML notebook):",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Look at the structure** (`housing.info()`). There are 20,640 districts, which is fairly small. **207 districts are missing `total_bedrooms`** (Lesson 6: missing values). All attributes are numeric except `ocean_proximity`, which is text: a categorical attribute (Lesson 4).",
            "**Plot histograms** of every attribute (Lesson 11). Several surprises: median income is not in US dollars but scaled and **capped** at 15 (top) and 0.5 (bottom). House age and **house value are also capped**, at $500,000. That's dangerous: the model may learn that prices *never* exceed $500K. Fix: collect proper labels for those districts, or remove them from training and test sets. The attributes are on **very different scales** (Lesson 7: scaling needed), and many histograms are **tail-heavy** (a long tail to the right), so a transformation such as log could make them more bell-shaped.",
            "**Check correlations** (Lesson 10). House value is **strongly correlated with median income**. There's a small negative correlation with latitude (prices dip slightly as you go north). A scatter plot shows the $500K cap as a horizontal line, plus fainter lines near $450K, $350K and $280K: data quirks the model might wrongly learn.",
            "**Try attribute combinations** (Lesson 8: feature construction). The total number of rooms in a district isn't very useful; a big district just has more rooms. **Rooms per household** is far more informative, and indeed it correlates with price better than total rooms or total bedrooms.",
            "**Clean the data** (Lesson 6). scikit-learn's **imputer** (`SimpleImputer` with `strategy=\"median\"`) is “trained” on the numeric columns: it learns each column's median and stores them in `statistics_`. Then it fills every missing value with the learnt median. It must be given numeric columns only, since a median of text makes no sense.",
            "**Handle the text attribute** (Lesson 7: binarisation). If you simply number the categories 0, 1, 2, 3, 4, the algorithm assumes nearby numbers are similar, so it would think '<1H OCEAN' (0) and 'NEAR OCEAN' (4) are very different, which is false. Use **one-hot encoding**: one 0/1 column per category.",
            "**Create the test set** (Lesson 7: stratified sampling). Hold out 20%. A purely random split may not represent the income categories properly, and income is the most important predictor. So split by **income category (stratified)**, so the test set has the same proportion of each income band as the whole data. Fix the random seed so the split is the same every run (**reproducibility**).",
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "The whole session in six lines",
          text: "1. Frame first: business goal, baseline, then supervised/regression/batch. Housing = supervised multivariate batch regression.\n2. Metric: RMSE by default; MAE when there are many outliers (higher norm → more weight on big errors).\n3. Attribute types climb a ladder: nominal (=) → ordinal (<) → interval (−) → ratio (÷, true zero). Only do maths the type allows.\n4. Clean: noise, outliers (sometimes the target!), missing values (drop / estimate / ignore), duplicates.\n5. Reshape: aggregate, sample (stratify for small groups), discretise, one-hot encode, scale; reduce dimensions (PCA, feature selection) and create better features.\n6. Explore: median beats mean with outliers; choose a distance that fits the data (standardise first!); correlation only sees straight lines.",
        },
      ],
    },
  ],

  glossary: [
    ["Instance / object", "Record, row, sample", "One thing being described, e.g. one district"],
    ["Attribute / feature", "Variable, field, column, dimension", "One property measured for every object, e.g. median income"],
    ["Baseline", "—", "The current solution's performance, which your model must beat"],
    ["Multivariate", "—", "Using several input variables"],
    ["$h$", "Hypothesis", "The model; $h(x)$ is its prediction for input $x$"],
    ["$m$", "—", "Number of instances (rows)"],
    ["$x^{(i)}, y^{(i)}$", "—", "Features and actual value of the $i$-th instance"],
    ["MAE", "Mean Absolute Error", "Average size of the errors, ignoring sign"],
    ["RMSE", "Root Mean Square Error", "Square root of the average squared error; punishes big errors more"],
    ["ℓ₁, ℓ₂ norm", "L-one, L-two norm", "Sum of absolute values; square root of the sum of squares"],
    ["Nominal", "—", "Categories with no order (PIN code, blood group)"],
    ["Ordinal", "—", "Categories with an order but unequal gaps (grades)"],
    ["Interval", "—", "Numbers where differences are meaningful but zero is arbitrary (°C, dates)"],
    ["Ratio", "—", "Numbers with a true zero, so “twice as much” makes sense (kg, Kelvin, counts)"],
    ["Asymmetric attribute", "—", "Only presence (non-zero) matters, e.g. items in a basket"],
    ["Sparsity", "—", "Most values are zero or empty"],
    ["Outlier", "—", "A record very different from the rest; noise or the target (fraud)"],
    ["Imputation", "—", "Filling in missing values, e.g. with the median"],
    ["Aggregation", "—", "Combining many values into one (daily → monthly)"],
    ["Stratified sampling", "—", "Split into groups (strata), then sample from each"],
    ["Discretisation", "—", "Turning a continuous attribute into a few ordered bins"],
    ["Binarisation / one-hot encoding", "—", "Turning a category into 0/1 columns, one per category"],
    ["$\\bar x$", "x-bar", "The mean (average) of x"],
    ["$s$", "Standard deviation", "Typical distance of values from the mean"],
    ["z-score", "Standard score", "$(x - \\bar x)/s$: how many standard deviations from the mean"],
    ["Curse of dimensionality", "—", "In many dimensions, data is sparse and distances lose meaning"],
    ["PCA", "Principal Component Analysis", "Finds new axes that capture the most variation, to reduce dimensions"],
    ["SVD", "Singular Value Decomposition", "A matrix technique used for dimensionality reduction"],
    ["GPA", "Grade Point Average", "Used in the irrelevant-feature example"],
    ["EDA", "Exploratory Data Analysis", "Exploring data with statistics and plots before modelling"],
    ["Percentile $x_p$", "—", "The value below which p% of the data falls"],
    ["AAD", "Average Absolute Deviation", "Average distance from the mean, without squaring"],
    ["MAD", "Median Absolute Deviation", "Median distance from the median; very robust"],
    ["IQR", "Interquartile Range", "75th percentile − 25th percentile"],
    ["Proximity", "—", "Similarity or dissimilarity (distance)"],
    ["L₁ / Manhattan", "City-block distance", "Sum of absolute differences"],
    ["L₂ / Euclidean", "Straight-line distance", "Square root of the sum of squared differences"],
    ["L∞ / Supremum", "L-max distance", "The largest single difference"],
    ["Hamming distance", "—", "Number of positions where two binary strings differ"],
    ["$\\Sigma$ (in Mahalanobis)", "Covariance matrix", "Describes the spread and correlation of the attributes"],
    ["Cosine similarity", "—", "Similarity by the angle between vectors; ignores length and 0–0 matches"],
    ["Correlation ($r$)", "Pearson correlation coefficient", "Strength of the straight-line relationship, from −1 to +1"],
    ["GPU / TPU", "Graphics / Tensor Processing Unit", "Chips that speed up ML computation"],
    ["UCI", "University of California, Irvine", "Hosts a well-known ML dataset repository"],
  ],

  examTips: [
    "Attribute-type questions: give the **type + the property that decides it**, e.g. “ratio, because it has a true zero”.",
    "Distance calculations appear in almost every paper (**PYQ Q1a**: Euclidean + Manhattan). Always write the difference in each attribute first, then apply each formula.",
    "A “list the data-preprocessing issues in this table” question appeared in the revision deck. Scan for **duplicates, missing/n/a, mixed units or currencies, inconsistent date formats, redundant columns (age vs date of birth), invalid values (0 or negative)**.",
    "RMSE vs MAE: pick **MAE** when told there are many outliers.",
    "Correlation = 0 does **not** mean independence; quote the $y = x^2$ example.",
  ],

  problems: [
    {
      title: "Minkowski family of distances",
      pyq: "Midsem Q1(a): Euclidean & Manhattan distance",
      level: "Easy",
      marks: 3,
      hint: "Write down $|x_k - y_k|$ for each of the 4 attributes first. Every distance in the family is built from that one list.",
      question:
        "Two customers of an e-commerce site are described by (orders last month, returns, support tickets, hours on app): $x = (1, 5, 2, 8)$ and $y = (4, 1, 6, 5)$. Compute the (a) Manhattan, (b) Euclidean, (c) supremum and (d) Minkowski $r = 3$ distances.",
      solution: `
### What is being asked
How far apart two records are, using four members of the Minkowski family (Lesson 10).

### Why this approach
All Minkowski distances use the same ingredient: the **absolute difference in each attribute**. They differ only in how those differences are combined: added (r = 1), squared-then-rooted (r = 2), cubed-then-cube-rooted (r = 3), or just the maximum (r → ∞).

### Formula
$$d_r(x, y) = \\left( \\sum_{k} |x_k - y_k|^r \\right)^{1/r}, \\qquad d_\\infty = \\max_k |x_k - y_k|$$

### Working
Differences: $|1-4| = 3$, $|5-1| = 4$, $|2-6| = 4$, $|8-5| = 3$, i.e. $(3, 4, 4, 3)$.

**(a) Manhattan (r = 1):** $3 + 4 + 4 + 3 = 14$

**(b) Euclidean (r = 2):** $\\sqrt{3^2 + 4^2 + 4^2 + 3^2} = \\sqrt{9 + 16 + 16 + 9} = \\sqrt{50} = 7.071$

**(c) Supremum:** $\\max(3, 4, 4, 3) = 4$

**(d) r = 3:** $(3^3 + 4^3 + 4^3 + 3^3)^{1/3} = (27 + 64 + 64 + 27)^{1/3} = 182^{1/3} = 5.667$

### Answer
Manhattan **14**, Euclidean **7.071**, supremum **4**, Minkowski-3 **5.667**.

### Takeaway
As r grows, the distance shrinks toward the single largest difference: $L_1 \\ge L_2 \\ge L_3 \\ge L_\\infty$ always. In the exam, write the difference vector first; it earns method marks and prevents slips.`,
    },
    {
      title: "Distance matrices for four points",
      level: "Medium",
      marks: 5,
      hint: "There are only 6 distinct pairs (the matrix is symmetric with zeros on the diagonal). For each pair, write the differences in x and y, then apply L₁, L₂ and L∞.",
      question:
        "Four delivery hubs sit on a city grid at $p_1 = (0,2)$, $p_2 = (2,0)$, $p_3 = (3,1)$, $p_4 = (5,1)$ (km). Build the $L_1$, $L_2$ and $L_\\infty$ distance matrices. Which pair is closest under each metric?",
      solution: `
### What is being asked
All pairwise distances, under three metrics, arranged as matrices (slide 63/66 style).

### Why this approach
A distance matrix is symmetric ($d(a,b) = d(b,a)$) with zeros on the diagonal, so we only compute the 6 pairs above the diagonal and mirror them.

### Working
| Pair | Δx, Δy | L₁ | L₂ | L∞ |
|---|---|---|---|---|
| p1–p2 | 2, 2 | 4 | $\\sqrt8 = 2.828$ | 2 |
| p1–p3 | 3, 1 | 4 | $\\sqrt{10} = 3.162$ | 3 |
| p1–p4 | 5, 1 | 6 | $\\sqrt{26} = 5.099$ | 5 |
| p2–p3 | 1, 1 | 2 | $\\sqrt2 = 1.414$ | 1 |
| p2–p4 | 3, 1 | 4 | $\\sqrt{10} = 3.162$ | 3 |
| p3–p4 | 2, 0 | 2 | 2 | 2 |

**$L_1$ matrix**

| | p1 | p2 | p3 | p4 |
|---|---|---|---|---|
| p1 | 0 | 4 | 4 | 6 |
| p2 | 4 | 0 | 2 | 4 |
| p3 | 4 | 2 | 0 | 2 |
| p4 | 6 | 4 | 2 | 0 |

**$L_2$ matrix**

| | p1 | p2 | p3 | p4 |
|---|---|---|---|---|
| p1 | 0 | 2.828 | 3.162 | 5.099 |
| p2 | 2.828 | 0 | 1.414 | 3.162 |
| p3 | 3.162 | 1.414 | 0 | 2 |
| p4 | 5.099 | 3.162 | 2 | 0 |

**$L_\\infty$ matrix**

| | p1 | p2 | p3 | p4 |
|---|---|---|---|---|
| p1 | 0 | 2 | 3 | 5 |
| p2 | 2 | 0 | 1 | 3 |
| p3 | 3 | 1 | 0 | 2 |
| p4 | 5 | 3 | 2 | 0 |

### Answer
Closest pair: **p2–p3** under $L_2$ (1.414) and $L_\\infty$ (1). Under $L_1$ it's a **tie** between p2–p3 and p3–p4 (both 2).

### Takeaway
Different metrics can rank neighbours differently. A diagonal step (1, 1) is cheap in L₂ and L∞ but costs 2 in L₁, the same as a straight step of 2. So the choice of distance changes which neighbours k-NN or clustering will pick.`,
    },
    {
      title: "Cosine similarity of documents",
      level: "Easy",
      marks: 3,
      hint: "Dot product: multiply matching positions and add (only positions where *both* are non-zero matter). Length: square root of the sum of squares of each vector.",
      question:
        "A news site stores each article as a vector of word counts over 10 words: $d_1 = (3,2,0,5,0,0,0,2,0,0)$, $d_2 = (1,0,0,0,0,0,0,1,0,2)$. Compute their cosine similarity. Why is cosine preferred over Euclidean distance for documents?",
      solution: `
### What is being asked
How similar two documents are, by the angle between their word-count vectors (Lesson 10).

### Why this approach
Documents differ in length, and most words are absent from both (sparse, asymmetric data). Cosine ignores length and 0–0 matches, and looks only at whether the two vectors point in the same direction.

### Formula
$$\\cos(d_1, d_2) = \\frac{d_1 \\cdot d_2}{\\|d_1\\| \\, \\|d_2\\|}$$

### Working
- Dot product: only positions 1 and 8 are non-zero in both, so $d_1 \\cdot d_2 = 3 \\times 1 + 2 \\times 1 = 5$
- $\\|d_1\\| = \\sqrt{9 + 4 + 25 + 4} = \\sqrt{42} = 6.481$
- $\\|d_2\\| = \\sqrt{1 + 1 + 4} = \\sqrt6 = 2.449$

$$\\cos(d_1, d_2) = \\frac{5}{6.481 \\times 2.449} = \\frac{5}{15.875} = 0.315$$

### Answer
Cosine similarity = **0.315**, i.e. weakly similar.

**Why cosine for documents:** the vectors are **sparse and asymmetric**, so the thousands of words missing from both documents shouldn't count as “agreement”, and cosine ignores them. It is also **independent of length**: an article pasted twice has cosine 1 with the original, while Euclidean distance would call them far apart.

### Takeaway
Use cosine whenever *direction matters more than size*: documents, shopping baskets, user ratings.`,
    },
    {
      title: "Pearson correlation and its drawback",
      level: "Medium",
      marks: 4,
      hint: "Subtract the means, multiply the deviations pairwise and add ($S_{xy}$). Divide by $\\sqrt{S_{xx} S_{yy}}$. For (b), the mean of x is 0, which makes the sum quick.",
      question:
        "(a) Hours studied $x = (1,2,3,4,5)$ and marks $y = (2,4,5,4,5)$. Compute the correlation. (b) Compute the correlation between $x = (-3,-2,-1,0,1,2,3)$ and $y = x^2$. Interpret both.",
      solution: `
### What is being asked
The strength of the straight-line relationship in two datasets, and what a correlation of 0 does and doesn't mean.

### Why this approach
Correlation compares how the two variables move **together** relative to how much each moves **on its own**. For each point, ask: “is x above or below its average? Is y?” If both are on the same side, the product is positive; if opposite, it's negative. Adding these products gives $S_{xy}$.

### Formula
$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} \\, S_{yy}}}, \\quad S_{xy} = \\sum (x - \\bar x)(y - \\bar y), \\quad S_{xx} = \\sum (x - \\bar x)^2, \\quad S_{yy} = \\sum (y - \\bar y)^2$$

### Working
**(a)** $\\bar x = 3$, $\\bar y = 20/5 = 4$

| $x$ | $y$ | $x - \\bar x$ | $y - \\bar y$ | product | $(x-\\bar x)^2$ | $(y - \\bar y)^2$ |
|---|---|---|---|---|---|---|
| 1 | 2 | −2 | −2 | 4 | 4 | 4 |
| 2 | 4 | −1 | 0 | 0 | 1 | 0 |
| 3 | 5 | 0 | 1 | 0 | 0 | 1 |
| 4 | 4 | 1 | 0 | 0 | 1 | 0 |
| 5 | 5 | 2 | 1 | 2 | 4 | 1 |
| | | | **Sum** | **6** | **10** | **6** |

$$r = \\frac{6}{\\sqrt{10 \\times 6}} = \\frac{6}{7.746} = 0.775$$

**(b)** $y = (9, 4, 1, 0, 1, 4, 9)$, $\\bar x = 0$, $\\bar y = 28/7 = 4$.
$S_{xy} = (-3)(5) + (-2)(0) + (-1)(-3) + (0)(-4) + (1)(-3) + (2)(0) + (3)(5) = -15 + 3 - 3 + 15 = 0$, so $r = 0$.

### Answer
**(a)** $r = $ **0.775**: a strong positive linear relationship; more hours go with higher marks.

**(b)** $r = $ **0**, even though $y$ is **perfectly determined** by $x$. The relationship is a U-shape: the left half slopes down, the right half slopes up, and they cancel.

### Takeaway
Correlation only measures **straight-line** association. **Zero correlation does not mean independence.** Always plot the data before trusting r.`,
    },
    {
      title: "Summary statistics with an outlier",
      level: "Medium",
      marks: 5,
      hint: "Sort first (it already is). Median of 8 values = average of the 4th and 5th. A 12.5% trimmed mean on 8 values drops 1 value from each end. For the standard deviation, divide by m − 1 = 7.",
      question:
        "Daily footfall (hundreds of visitors) at a mall over 8 days: 10, 12, 13, 15, 15, 18, 20, 97 (the last day had a festival sale). Compute the mean, median, mode, 12.5%-trimmed mean, range, sample standard deviation and AAD. Recompute the mean, median and standard deviation without 97. What do you conclude?",
      solution: `
### What is being asked
Summarise the data with location and spread measures (Lesson 9), and see which ones one outlier distorts.

### Why this approach
Some statistics use every value's size (mean, range, standard deviation), so an extreme value pulls them. Others depend only on positions in the sorted list (median, trimmed mean), so they resist outliers. Computing both shows the difference.

### Formulas
$$\\bar x = \\frac{\\sum x_i}{m}, \\qquad s = \\sqrt{\\frac{\\sum (x_i - \\bar x)^2}{m - 1}}, \\qquad \\text{AAD} = \\frac{\\sum |x_i - \\bar x|}{m}$$

### Working
- **Mean** $= (10+12+13+15+15+18+20+97)/8 = 200/8 = 25$
- **Median** = average of the 4th and 5th values $= (15 + 15)/2 = 15$
- **Mode** = 15 (appears twice)
- **Trimmed mean (12.5%):** drop 1 value from each end (10 and 97): $(12+13+15+15+18+20)/6 = 93/6 = 15.5$
- **Range** $= 97 - 10 = 87$
- **Standard deviation:** deviations from 25 are −15, −13, −12, −10, −10, −7, −5, 72. Squares: 225, 169, 144, 100, 100, 49, 25, 5184, summing to 5996. $s^2 = 5996/7 = 856.57$, so $s = 29.27$
- **AAD** $= (15+13+12+10+10+7+5+72)/8 = 144/8 = 18.0$

**Without 97** (7 values: 10, 12, 13, 15, 15, 18, 20): mean $= 103/7 = 14.71$, median = 15, standard deviation = 3.45.

### Answer
| | Mean | Median | Std dev |
|---|---|---|---|
| With 97 | **25** | **15** | **29.27** |
| Without 97 | **14.71** | **15** | **3.45** |

Also: mode **15**, trimmed mean **15.5**, range **87**, AAD **18.0**.

### Takeaway
One outlier shifted the mean by 10 and made the standard deviation **8.5× bigger**, while the **median and trimmed mean barely moved**. When outliers are present, report robust statistics (median, trimmed mean, IQR). Then decide whether the outlier is noise or the most interesting day of all.`,
    },
    {
      title: "Min-max normalisation and z-score standardisation",
      level: "Easy",
      marks: 3,
      hint: "Min-max: subtract the minimum, divide by the range. Z-score: subtract the mean, divide by the sample standard deviation (divide the sum of squares by m − 1 = 4).",
      question:
        "Annual incomes (₹ lakh) of five loan applicants: 20, 30, 50, 60, 90. (a) Min-max normalise to [0, 1]. (b) Z-score standardise (use the sample standard deviation). (c) Why does Euclidean distance need this?",
      solution: `
### What is being asked
Rescale one attribute in the two standard ways (Lesson 7), and explain why scaling matters for distances.

### Why this approach
Distance-based methods add up differences across attributes. If one attribute is measured in much bigger numbers, it dominates. Rescaling puts every attribute on a comparable range.

### Formulas
$$x' = \\frac{x - \\min}{\\max - \\min}, \\qquad z = \\frac{x - \\bar x}{s}$$

### Working
**(a)** min = 20, max = 90, range = 70.
$x' = (20-20)/70,\\ (30-20)/70,\\ \\dots$ → **0, 0.143, 0.429, 0.571, 1.0**

**(b)** Mean $= 250/5 = 50$. Deviations: −30, −20, 0, 10, 40. Squares sum to $900 + 400 + 0 + 100 + 1600 = 3000$.
$s = \\sqrt{3000/4} = \\sqrt{750} = 27.386$
$z = -30/27.386, \\dots$ → **−1.095, −0.730, 0, 0.365, 1.461**

### Answer
(a) 0, 0.143, 0.429, 0.571, 1.0 (b) −1.095, −0.730, 0, 0.365, 1.461

**(c)** Euclidean distance is dominated by whichever attribute has the largest numeric range. If income were in rupees (lakhs of units) and age in years (tens), age would barely affect the distance. Scaling gives every attribute an equal say (slide 62: “standardisation is necessary if scales differ”).

### Takeaway
Min-max fixes the range to [0, 1] but is sensitive to extreme values. Z-scores centre at 0 and express each value as “standard deviations from average”, which also makes outliers easy to spot (|z| > 2 or 3).`,
    },
    {
      title: "Equal-width vs equal-frequency discretisation",
      level: "Easy",
      marks: 3,
      hint: "Equal width: bin width = (max − min) ÷ number of bins. Equal frequency: 12 values into 3 bins = 4 values per bin, in sorted order.",
      question: "Customer ages at a gym: 4, 8, 15, 21, 21, 24, 25, 28, 34, 40, 52, 60. Discretise them into 3 bins using (a) equal width and (b) equal frequency.",
      solution: `
### What is being asked
Turn a continuous attribute into 3 ordered bins using the two unsupervised methods (Lesson 7).

### Why this approach
- **Equal width** gives every bin the same *range of values*.
- **Equal frequency** gives every bin the same *number of records*.

### Working
**(a) Equal width:** width $= (60 - 4)/3 = 56/3 = 18.67$
- Bin 1: [4, 22.67) → 4, 8, 15, 21, 21 (5 values)
- Bin 2: [22.67, 41.33) → 24, 25, 28, 34, 40 (5 values)
- Bin 3: [41.33, 60] → 52, 60 (2 values)

**(b) Equal frequency:** 12 values ÷ 3 bins = 4 per bin
- Bin 1: 4, 8, 15, 21
- Bin 2: 21, 24, 25, 28
- Bin 3: 34, 40, 52, 60

### Takeaway
Equal width is simple, but outliers stretch the range and leave some bins nearly empty (bin 3 has only 2 people). Equal frequency balances the counts but can split identical values across bins: the two 21s ended up in different bins, which a careful implementation would avoid.`,
    },
    {
      title: "RMSE vs MAE with an outlier",
      level: "Medium",
      marks: 4,
      hint: "Compute the errors (predicted − actual) first. MAE averages their absolute values; RMSE averages their squares, then takes the square root.",
      question:
        "A house-price model (₹ crore) gives: actual 3, 5, 2, 7, 4; predicted 2.5, 5, 4, 8, 4.5. (a) Compute MAE and RMSE. (b) A sixth house has actual 6 and predicted 16. Recompute both. (c) Which metric changed more, and which would you report if outliers are common?",
      solution: `
### What is being asked
Compare how the two regression metrics (Lesson 2) react to one large error.

### Why this approach
MAE counts every unit of error equally. RMSE squares errors first, so large errors dominate.

### Formulas
$$\\text{MAE} = \\frac1m \\sum |e_i|, \\qquad \\text{RMSE} = \\sqrt{\\frac1m \\sum e_i^2}, \\qquad e_i = \\text{predicted} - \\text{actual}$$

### Working
**(a)** Errors: −0.5, 0, 2, 1, 0.5
- MAE $= (0.5 + 0 + 2 + 1 + 0.5)/5 = 4/5 = 0.80$
- RMSE $= \\sqrt{(0.25 + 0 + 4 + 1 + 0.25)/5} = \\sqrt{5.5/5} = \\sqrt{1.1} = 1.049$

**(b)** New error = 16 − 6 = 10
- MAE $= (4 + 10)/6 = 14/6 = 2.33$
- RMSE $= \\sqrt{(5.5 + 100)/6} = \\sqrt{17.58} = 4.19$

### Answer
| | MAE | RMSE |
|---|---|---|
| 5 houses | **0.80** | **1.049** |
| + outlier | **2.33** | **4.19** |
| Growth | 2.9× | **4×** |

**(c)** RMSE grew more, because squaring turned the error of 10 into 100. If outliers are common, report **MAE** (slide 7).

### Takeaway
RMSE = “punish big misses hard”, right when big errors are unacceptable and outliers are rare. MAE = “every unit of error counts the same”, which is more robust when the data has many outliers.`,
    },
    {
      title: "Stratified test-set sizes",
      level: "Easy",
      marks: 3,
      hint: "Test size = 20% of all districts. Then give each income category the same share of the test set as it has in the full data.",
      question:
        "The housing dataset has 20,640 districts. Income categories 1–5 make up 4%, 32%, 35%, 18% and 11% of the data. You hold out 20% as the test set. How many districts of each category should a stratified split put in the test set? Why not a purely random split?",
      solution: `
### What is being asked
Apply stratified sampling (Lessons 7 and 12) to build a representative test set.

### Why this approach
Income is the most important predictor of price. The test set must contain each income band in the **same proportion** as the full data, otherwise the test score is biased.

### Working
Test size $= 0.20 \\times 20640 = 4128$

| Category | Share | Test count $= \\text{share} \\times 4128$ |
|---|---|---|
| 1 | 4% | 165.1 ≈ **165** |
| 2 | 32% | 1320.96 ≈ **1321** |
| 3 | 35% | 1444.8 ≈ **1445** |
| 4 | 18% | 743.04 ≈ **743** |
| 5 | 11% | 454.08 ≈ **454** |

Check: 165 + 1321 + 1445 + 743 + 454 = 4128 ✓

### Answer
165, 1321, 1445, 743 and 454 districts. **Why not purely random:** a random draw could, by chance, include far fewer than 165 category-1 districts (a small, 4% group). Then the test set wouldn't represent low-income districts, and the reported error would be misleading. Stratification guarantees the proportions.

### Takeaway
Stratify on the attribute that matters most, especially when some groups are small.`,
    },
    {
      title: "Mahalanobis distance",
      level: "Hard",
      marks: 5,
      hint: "Invert the 2×2 covariance matrix: swap the diagonal, negate the off-diagonal, divide by the determinant. Then compute $d^T \\Sigma^{-1} d$ for each difference vector $d$.",
      question:
        "Two correlated measurements (say, standardised height and weight) have covariance matrix $\\Sigma = \\begin{pmatrix}0.3 & 0.2\\\\0.2 & 0.3\\end{pmatrix}$. For $A = (0.5, 0.5)$, $B = (0, 1)$, $C = (1.5, 1.5)$ compute $\\text{mahal}(A,B)$ and $\\text{mahal}(A,C) = (x-y)^T\\Sigma^{-1}(x-y)$. Compare with the Euclidean distances and explain.",
      solution: `
### What is being asked
Distances that take the data's correlation into account (Lesson 10), compared with plain Euclidean distance.

### Why this approach
The attributes rise together (positive covariance 0.2), so the data cloud stretches along the diagonal. Mahalanobis measures distance in units of that spread: moving *along* the diagonal is normal, moving *across* it is unusual.

### Formula
$$\\text{mahal}(x, y) = (x - y)^T \\Sigma^{-1} (x - y), \\qquad \\begin{pmatrix}a & b\\\\b & d\\end{pmatrix}^{-1} = \\frac{1}{ad - b^2}\\begin{pmatrix}d & -b\\\\-b & a\\end{pmatrix}$$

### Working
$\\det \\Sigma = 0.3 \\times 0.3 - 0.2 \\times 0.2 = 0.09 - 0.04 = 0.05$
$$\\Sigma^{-1} = \\frac{1}{0.05}\\begin{pmatrix}0.3 & -0.2\\\\-0.2 & 0.3\\end{pmatrix} = \\begin{pmatrix}6 & -4\\\\-4 & 6\\end{pmatrix}$$

For $d = (d_1, d_2)$: $d^T \\Sigma^{-1} d = 6d_1^2 + 6d_2^2 - 8 d_1 d_2$

**A–B:** $d = (0.5, -0.5)$ → $6(0.25) + 6(0.25) - 8(0.5)(-0.5) = 1.5 + 1.5 + 2 = 5$

**A–C:** $d = (-1, -1)$ → $6 + 6 - 8(1) = 4$

**Euclidean:** $|AB| = \\sqrt{0.5^2 + 0.5^2} = 0.707$; $|AC| = \\sqrt{1 + 1} = 1.414$

### Answer
| | Euclidean | Mahalanobis |
|---|---|---|
| A–B | 0.707 | **5** |
| A–C | 1.414 | **4** |

By Euclidean distance C is twice as far as B, but by Mahalanobis **C is closer**.

### Takeaway
C lies *along* the direction the data naturally varies (tall and heavy together), which is typical. B lies *across* it (taller but lighter), which is unusual. Mahalanobis respects the shape of the data, which is why it is used for outlier detection.`,
    },
    {
      title: "Hamming distance and one-hot encoding",
      level: "Easy",
      marks: 3,
      hint: "Hamming = count the positions where the bits differ. For one-hot vectors, each has exactly one 1; think about where two different ones disagree.",
      question:
        "(a) Hamming distance between 1011101 and 1001001? (b) `ocean_proximity` has 5 categories: <1H OCEAN, INLAND, ISLAND, NEAR BAY, NEAR OCEAN. How many columns does one-hot encoding create, and what is the Hamming distance between any two different one-hot vectors? (c) Why is label encoding 0–4 a bad idea here?",
      solution: `
### What is being asked
Distances between binary vectors, and why one-hot encoding is the right way to feed a nominal attribute to a model (Lessons 7 and 12).

### Working
**(a)** Line them up:
\`\`\`
1 0 1 1 1 0 1
1 0 0 1 0 0 1
\`\`\`
They differ at positions 3 and 5, so the Hamming distance is **2**.

**(b)** One column per category → **5 columns**. Two different one-hot vectors, e.g. 10000 and 01000, disagree exactly where each has its 1, so the distance is always **2**.

**(c)** Label encoding sets '<1H OCEAN' = 0 … 'NEAR OCEAN' = 4. The model then assumes 0 is closer to 1 than to 4, an **order that doesn't exist**, since the attribute is nominal. One-hot encoding makes **every category equally far from every other**, which is exactly right for nominal data (slide 98).

### Takeaway
Encode nominal attributes with one-hot; use integers only for ordinal attributes where the order is real (e.g. low < medium < high).`,
    },
  ],

  theory: [
    {
      title: "Identify attribute types",
      marks: 4,
      question:
        "Classify each attribute as nominal, ordinal, interval or ratio, and as discrete or continuous. Justify. (a) Employee ID (b) Customer satisfaction (1–5 stars) (c) Temperature in °C (d) Time taken to run 100 m (e) Date of birth (f) Number of children (g) Blood group (h) Kelvin temperature",
      solution: `
### What the examiner wants
For each attribute: the type, whether it's discrete or continuous, and **the property that decides the type**. Use the ladder: = (nominal) → < (ordinal) → − (interval) → ÷ with a true zero (ratio).

### Model answer
| Attribute | Type | Discrete / continuous | Why |
|---|---|---|---|
| Employee ID | **Nominal** | Discrete | Only = / ≠ is meaningful; averaging IDs is nonsense |
| Satisfaction 1–5 | **Ordinal** | Discrete | Order matters, but the gaps between stars aren't equal |
| °C | **Interval** | Continuous | Differences are meaningful; zero is arbitrary, so 20 °C ≠ 2 × 10 °C |
| 100 m time | **Ratio** | Continuous | True zero; 20 s really is twice 10 s |
| Date of birth | **Interval** | Discrete (days) | Differences (age) are meaningful; there's no true “zero date” |
| Number of children | **Ratio** | Discrete | Counts have a true zero |
| Blood group | **Nominal** | Discrete | Labels only, no order |
| Kelvin | **Ratio** | Continuous | Absolute zero means no heat |

### Takeaway
The deciding question is usually **“is there a true zero?”** (ratio vs interval) or **“is there an order?”** (ordinal vs nominal).`,
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
### What the examiner wants
At least six **distinct** issues, each named, pointed at in the table, and given a fix. Scan column by column and use the Lesson 6 checklist: duplicates, missing values, invalid values, inconsistent formats, redundant attributes.

### Model answer
1. **Duplicate record:** rows 1 and 3 are identical. *Fix:* de-duplicate.
2. **Missing value “n/a” in Age:** *Fix:* derive it from the date of birth (best here) or impute with the mean/median.
3. **Blank Profession:** *Fix:* impute with the **mode**, or add an “Unknown” category.
4. **Redundant attributes:** Age and Date of Birth carry the same information. *Fix:* keep one (e.g. compute age at purchase date).
5. **Inconsistent date formats:** dd/mm/yyyy, yyyy-mm-dd, “14 Mar 2015”, yyyy/mm/dd. *Fix:* parse everything into one standard format.
6. **Mixed currencies:** ₹ and USD in Sum Insured. *Fix:* convert to one currency.
7. **Invalid value / outlier:** Age = 212 is impossible (noise). *Fix:* recompute from DOB or treat as missing.
8. **Invalid Sum Insured = ₹ 0:** a purchased policy can't insure 0. *Fix:* treat as missing and impute.
9. **Inconsistent capitalisation:** “doctor” vs “Engineer”. *Fix:* normalise the text case.
10. **Numbers stored as text:** Indian digit grouping (5,00,000) and currency symbols. *Fix:* strip them and store plain numbers.

### Takeaway
Structure beats volume: name the issue, point to the cell, give the fix. Six clean points score better than ten vague ones.`,
    },
    {
      title: "Frame the housing-price problem",
      marks: 3,
      question:
        "You must build a model that predicts the median house price of a district from census data. Explain how you would frame the problem: the questions to ask the business, the type of learning task, and the performance measure.",
      solution: `
### What the examiner wants
The Lesson 1 sequence: **business questions → task type (with reasons) → metric**.

### Model answer
- **Business questions:** What is the prediction for, and how will it be used (e.g. it feeds a downstream investment system)? This decides the algorithm, the metric and the maintenance effort. What is the **current solution / baseline**, e.g. experts' manual estimates that are often 20% off? That tells you what “good enough” means.
- **Task type:** **supervised** (each district is labelled with its actual median price), **regression** (the output is a real number), **multivariate** (many input attributes), **batch** (static data that fits in memory; no continuous stream).
- **Metric:** **RMSE** $= \\sqrt{\\frac1m\\sum(h(x^{(i)}) - y^{(i)})^2}$ is the usual choice. Use **MAE** if there are many outlier districts.
- **Check assumptions:** if the downstream system actually needs price *categories* (cheap / medium / expensive), the problem becomes classification.

### Takeaway
Every framing answer: *why* (business) → *what kind* (supervised/regression/batch) → *how measured* (metric).`,
    },
    {
      title: "Handling missing values",
      marks: 3,
      question: "Give two reasons values go missing, and explain three strategies to handle missing values with their trade-offs.",
      solution: `
### What the examiner wants
Two reasons with examples, and three strategies, **each with its downside**.

### Model answer
**Reasons:** (1) the information **wasn't collected**, e.g. people decline to give their age or weight; (2) the attribute **doesn't apply**, e.g. annual income for children.

**Strategies:**
1. **Eliminate** the rows or the column. Simple, but loses data, and can introduce **bias** if the rows with missing values are systematically different (e.g. younger customers skip the age field).
2. **Estimate / impute:** the median or mean for numbers (e.g. \`SimpleImputer(strategy="median")\` for total_bedrooms), the mode for categories, interpolation for time series. Keeps the data, but can shrink the variance and blur correlations.
3. **Ignore during analysis:** e.g. compute similarity using only the attributes both records have. Some algorithms, such as Naive Bayes, skip missing values naturally.

### Takeaway
Before dropping anything, ask: *are the records with missing values different from the rest?*`,
    },
    {
      title: "Curse of dimensionality and dimensionality reduction",
      marks: 3,
      question: "What is the curse of dimensionality? List the purposes of dimensionality reduction and name two techniques.",
      solution: `
### What the examiner wants
A clear definition with its consequence, the four purposes from slide 47, and two named techniques.

### Model answer
**Curse of dimensionality:** as the number of attributes grows, the volume of the space grows exponentially, so a fixed amount of data becomes very **sparse**. Distances between points become nearly equal, and density loses meaning. Clustering, k-NN and outlier detection degrade, and far more data is needed to generalise.

**Purposes of dimensionality reduction (slide 47):**
- avoid the curse of dimensionality
- reduce the time and memory needed by algorithms
- make the data easier to visualise
- help eliminate irrelevant features and reduce noise

**Techniques:** **PCA** (Principal Component Analysis: find new axes that capture the most variance) and **SVD** (Singular Value Decomposition). Feature subset selection is another route.

### Takeaway
The one-line intuition: same number of points, more dimensions → more empty space → “nearest neighbour” stops meaning much.`,
    },
    {
      title: "Feature subset selection vs feature creation",
      marks: 3,
      question: "Differentiate feature subset selection and feature creation, with examples of redundant features, irrelevant features, feature extraction and feature construction.",
      solution: `
### What the examiner wants
The difference (**keep a subset** vs **make new attributes**), with the slide examples for each sub-type.

### Model answer
- **Feature subset selection** keeps a subset of the existing features:
  - *Redundant:* duplicates information already in others, e.g. purchase price and sales tax paid.
  - *Irrelevant:* carries no useful information for the task, e.g. student ID when predicting GPA.
- **Feature creation** makes new, more informative attributes:
  - *Extraction:* from raw data, e.g. edges extracted from images.
  - *Construction:* combining features, e.g. density = mass/volume, or **rooms_per_household** = total_rooms/households.
  - *Mapping to a new space:* e.g. a Fourier/wavelet transform exposes frequencies hidden in noise.

### Takeaway
Selection **removes** columns; creation **adds** better ones. Both aim at fewer, more useful features.`,
    },
    {
      title: "Sampling methods",
      marks: 3,
      question: "Why do we sample in ML? Explain simple random sampling (with and without replacement) and stratified sampling. When is stratified sampling essential?",
      solution: `
### What the examiner wants
The reason and the **key principle** (representativeness), definitions of each method, and a concrete case where stratification is needed.

### Model answer
**Why:** processing all the data is too expensive or slow. **Key principle:** a sample works almost as well as the full data **if it is representative**, i.e. it has roughly the same properties as the original.

- **Simple random:** every item has an equal chance of selection.
  - *Without replacement:* a selected item is removed and can't be picked again.
  - *With replacement:* an item can be picked more than once (used in bootstrapping).
- **Stratified:** partition the data into groups (strata), then randomly sample from each, usually in proportion.

**Essential** when some groups are small or important, e.g. rare classes (fraud) or the income categories in the housing data. A random sample might miss them or under-represent them.

### Takeaway
Random sampling is fair *on average*; stratified sampling is fair *every time*.`,
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
