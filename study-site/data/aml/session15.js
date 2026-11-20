// AML — FAccT machine learning: fairness, accountability, transparency, privacy, security; sources of bias,
// Simpson's paradox, real-world examples, fairness through unawareness, and the three group-fairness criteria
// (demographic parity, equalized odds, equal opportunity) with the PDF's hiring practice question.
// Source: CourseFiles/AML/Watermark_BITS_WILP_AML.pdf (consolidated open-book PDF), pages 703–746.

export default {
  title: "FAccT ML: Fairness, Bias & Fairness Criteria",
  source: "Consolidated PDF (Watermark_BITS_WILP_AML.pdf) · pages 703–746",
  quizMode: "step",
  overview:
    "A model can be accurate and still be **unfair**: it learns patterns from historical data, including historical prejudice, and can **amplify** them (page 712). This part names the five concerns of **FAccT** (fairness, accountability, transparency, privacy, security, pages 703–709), shows how bias enters through data (**Simpson's paradox**, biased historical data, real cases such as COMPAS and Amazon's hiring tool, pages 713–719), explains why simply **deleting the sensitive column** (“fairness through unawareness”) doesn't work (pages 720–721), and then teaches the three measurable fairness criteria: **demographic parity**, **equalized odds** and **equal opportunity** (pages 722–725, 744–745). It ends with a numerical practice question you can expect in the exam (pages 726–743). **ML overlap:** ML Module 11 covers FAccT requirements, COMPAS and unawareness/proxies; the **three criteria with numbers and Simpson's paradox are AML only.** Page numbers refer to your consolidated exam PDF.",

  summary: [
    {
      id: "facct",
      heading: "Lesson 1: The five FAccT concerns",
      slides: "703–709",
      blocks: [
        { type: "callout", kind: "tip", title: "🔗 ML overlap: partial", text: "**Shared with ML Module 11:** FAccT as a set of requirements, COMPAS, fairness through unawareness and proxy features. **AML only:** Simpson's paradox, the real-world examples on pages 715–717, and **computing demographic parity / equalized odds / equal opportunity**: practise these. **ML only:** interpretability and its trade-off with accuracy." },
        { type: "callout", kind: "idea", title: "In plain words", text: "Before trusting a model with people's lives (loans, jobs, bail), ask five questions: Is it **fair** to every group? **Who is responsible** if it fails? Can we **see why** it decided? Does it **protect personal data**? Can someone **trick or poison** it?" },
        {
          type: "table",
          caption: "FAccT and friends (pages 704–709)",
          head: ["Concern", "The question the PDF asks"],
          rows: [
            ["**Fairness**", "How do we ensure gender and ethnic fairness in ML models?"],
            ["**Accountability**", "Who takes responsibility for failed ML models?"],
            ["**Transparency**", "How do we make models transparent and compliant with regulations?"],
            ["**Privacy**", "How do we protect user privacy when exposing data to ML models?"],
            ["**Security / robustness**", "How do we defend models against **data poisoning**?"],
          ],
        },
        {
          type: "p",
          text: "**FAccT is interdisciplinary (page 709):** machine learning, statistics and theory meet psychology, social science and public policy.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**F-A-T + Privacy + Security.** FAccT = Fairness, Accountability, Transparency." },
      ],
    },
    {
      id: "bias",
      heading: "Lesson 2: How bias gets in: data, Simpson's paradox and real cases",
      slides: "710–719",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "A model is a mirror of its training data. If the data are lopsided (few dark-skinned faces, mostly male CVs, historical arrest records), the model copies the lopsidedness, and because it is applied to millions of people, it **amplifies** it." },
        {
          type: "p",
          text: "**What is fairness? (page 712)** “The absence of bias towards an individual or a group” (Mehrabi et al., 2019). Machines do follow instructions, but ML models **approximate patterns in the data**, so they **learn and amplify** whatever bias is there. **Model sensitivity (page 713):** one regression line fitted to data made of distinct subgroups (red) can point in the **opposite direction** to the lines fitted within each subgroup (green).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Simpson's paradox: Berkeley admissions (page 714)",
          text: "Overall, **44%** of men but only **35%** of women were admitted, which looks like bias against women. But department by department, women were admitted at a **similar or higher** rate in most departments (A: 82% vs 62%, B: 68% vs 63%, D: 35% vs 33%, F: 7% vs 6%).\n**Why:** women applied mostly to departments with low admission rates (C, E: 593 and 393 women), men to easy ones (A, B: 825 and 560 men). Using only the six departments shown: men $\\approx 1198/2691 = $ **44.5%**, women $\\approx 557/1835 = $ **30.3%**. (Aggregation computed for the website from the table.)\n**Lesson:** a trend in the combined data can **reverse** inside every subgroup. A model trained on aggregated data can learn the wrong story.",
        },
        {
          type: "table",
          caption: "Real-world examples (pages 715–719)",
          head: ["Case", "What went wrong", "Bias source"],
          rows: [
            ["**HP webcam** (2009)", "Face-tracking followed a white face but not a black face", "Unrepresentative training data / lighting contrast"],
            ["**New Zealand passport robot** (2016)", "Rejected an Asian man's photo: “subject's eyes are closed”", "Unrepresentative faces"],
            ["**Amazon hiring tool**", "Penalised CVs containing the word “women's”", "Historical hiring data dominated by men"],
            ["**COMPAS** (page 718)", "Commercial risk-assessment software; > 1 million offenders since 2000; **137 features**; predicts the risk of a misdemeanour or felony", "Historical criminal-justice data"],
            ["**Word embeddings** (page 719, Garg et al. 2018)", "Occupations like nurse, librarian, housekeeper sit near “women”; carpenter, mechanic, engineer near “men”", "Bias in historical text"],
          ],
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Biased data in → biased (and amplified) decisions out.** Simpson's paradox: the overall trend can flip inside every group." },
      ],
    },
    {
      id: "unaware",
      heading: "Lesson 3: Fairness through unawareness, and why it fails",
      slides: "720–721",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "“Let's just delete the race column.” The model can still **guess race from other columns** that go with it, such as postcode or shopping habits. Those stand-in columns are called **proxies**." },
        {
          type: "p",
          text: "**Fairness through unawareness (page 720):** none of the sensitive features (e.g. race, ethnicity) is used directly by the model. The PDF's hiring example trains on Skills and Years of experience only.",
        },
        {
          type: "p",
          text: "**Indirect evidence (page 721):** add the feature “Often goes to Mexican markets”. It is not race, but it correlates with being Hispanic, so the model can still discriminate. The sensitive attribute is **inferred from indirect evidence**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Exam trap",
          text: "Removing a sensitive column does **not** guarantee fairness. You must also check for **proxy features** and **measure** the outcomes per group (Lesson 4). Unawareness is an **individual** criterion; the other three are **group** criteria (page 744).",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Hide the column ≠ hide the information.** Proxies leak it back in." },
      ],
    },
    {
      id: "criteria",
      heading: "Lesson 4: Three fairness criteria you can calculate",
      slides: "722–725, 744–745",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "Split people by the protected group A (e.g. A = 1 protected, A = 0 not). **Demographic parity:** both groups get the good outcome equally often, full stop. **Equal opportunity:** among the people who **truly deserve** it (Y = 1), both groups get it equally often. **Equalized odds:** equal rates both for the deserving (Y = 1) **and** the undeserving (Y = 0)." },
        {
          type: "table",
          caption: "Fairness criteria (pages 723–725, 744)",
          head: ["Criterion", "Condition", "In words", "Type"],
          rows: [
            ["**Unawareness**", "A is excluded from the predictor", "Don't use the sensitive feature", "Individual"],
            ["**Demographic parity**", "$P(\\hat Y = 1 \\mid A = 0) = P(\\hat Y = 1 \\mid A = 1)$", "Same **positive-prediction rate** in every group", "Group"],
            ["**Equal opportunity**", "$P(\\hat Y = 1 \\mid A = 0, Y = 1) = P(\\hat Y = 1 \\mid A = 1, Y = 1)$", "Same **true-positive rate** (qualified people treated alike)", "Group"],
            ["**Equalized odds**", "$P(\\hat Y = 1 \\mid A = 0, Y = y) = P(\\hat Y = 1 \\mid A = 1, Y = y)$ for y = 0 **and** 1", "Same **TPR and same FPR**", "Group"],
          ],
        },
        { type: "diagram", name: "a15-criteria" },
        {
          type: "callout",
          kind: "tip",
          title: "How the three relate",
          text: "Equalized odds ⇒ equal opportunity (it contains it). Demographic parity ignores Y altogether, so it can hold even when qualified people are treated differently, and vice versa. Demographic parity “does not require features to be masked out” (page 723).",
        },
        {
          type: "callout",
          kind: "example",
          title: "The 14-row table on pages 724–725 (exercise solution prepared for the website)",
          text: "Rows (A, Y, Ŷ): A = 0: (0,1,0) (0,0,0) (0,1,0) (0,1,1) (0,0,0) (0,0,1) (0,1,1); A = 1: (1,0,1) (1,1,1) (1,0,1) (1,0,0) (1,1,1) (1,1,0) (1,0,0).\n- **Positive rate:** A = 0: 3/7 = 0.43; A = 1: 4/7 = 0.57 → **demographic parity ✗**\n- **TPR (Y = 1):** A = 0: 2/4 = 0.50; A = 1: 2/3 = 0.67 → **equal opportunity ✗**\n- **FPR (Y = 0):** A = 0: 1/3 = 0.33; A = 1: 2/4 = 0.50 → **equalized odds ✗**",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Parity: P(Ŷ=1 | group). Opportunity: P(Ŷ=1 | group, Y=1). Odds: opportunity + P(Ŷ=1 | group, Y=0).**" },
      ],
    },
    {
      id: "practice",
      heading: "Lesson 5: The PDF's practice question: two hiring predictors",
      slides: "726–743",
      blocks: [
        { type: "callout", kind: "idea", title: "What am I learning?", text: "To decide, for a given table, which fairness criteria each predictor satisfies: the AML exam-style question." },
        {
          type: "table",
          caption: "Practice data (page 726): A = race (H = Hispanic, W = White), Y = true hiring decision",
          head: ["Race", "Skill", "Years", "Mexican markets?", "Y", "Ŷ1", "Ŷ2"],
          rows: [
            ["H", "Javascript", "1", "yes", "no", "0", "1"],
            ["H", "C++", "5", "yes", "yes", "1", "1"],
            ["H", "Python", "1", "no", "yes", "1", "0"],
            ["W", "Java", "2", "no", "yes", "0", "0"],
            ["W", "C++", "3", "no", "yes", "1", "1"],
            ["W", "C++", "0", "no", "no", "1", "0"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Predictor Ŷ1 (pages 727–734)",
          text: "**Demographic parity:** H rows Ŷ1 = 0, 1, 1 → 2/3; W rows 0, 1, 1 → 2/3 → **✓ satisfied**.\n**Equal opportunity (Y = yes):** H: C++ 5 (1), Python (1) → 1; W: Java (0), C++ 3 (1) → 1/2 → **✗**.\n**Equalized odds (also Y = no):** H: Javascript (0) → 0; W: C++ 0 (1) → 1 → **✗**.\n**Ŷ1 satisfies demographic parity only.**",
        },
        {
          type: "callout",
          kind: "example",
          title: "Predictor Ŷ2 (pages 735–743)",
          text: "**Demographic parity:** H: 1, 1, 0 → 2/3; W: 0, 1, 0 → 1/3 → **✗**.\n**Equal opportunity (Y = yes):** H: C++ 5 (1), Python (0) → 1/2; W: Java (0), C++ 3 (1) → 1/2 → **✓ satisfied**.\n**Equalized odds (Y = no):** H: Javascript (1) → 1; W: C++ 0 (0) → 0 → **✗**.\n**Ŷ2 satisfies equal opportunity only.**",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): pages 735–737",
          text: "Under the heading “Demographic Parity for Predictor Ŷ2”, the PDF writes P(**Ŷ1** = 1 | R = H) = 2/3 and P(**Ŷ1** = 1 | R = W) = 1/3. These are the **Ŷ2** rates (Ŷ1's are 2/3 and 2/3). Label them Ŷ2 in your answer.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "A fast method",
          text: "Make three mini-tables per predictor: (1) all rows by group → parity; (2) only Y = yes rows by group → opportunity; (3) only Y = no rows by group → with (2), odds. Six fractions answer everything.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Ŷ1: parity ✓, opportunity ✗, odds ✗. Ŷ2: parity ✗, opportunity ✓, odds ✗.** A predictor can pass one criterion and fail another." },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "FAccT on one screen (consolidated PDF pages)",
      head: ["Idea", "Key point", "Pages"],
      rows: [
        ["FAccT concerns", "Fairness, accountability, transparency, privacy, security (data poisoning)", "704–709"],
        ["Fairness", "Absence of bias towards an individual or group; models learn and amplify data bias", "712"],
        ["Simpson's paradox", "Aggregate trend reverses within subgroups (Berkeley: 44% vs 35% overall, women ahead in most departments)", "714"],
        ["Real cases", "HP webcam, NZ passport, Amazon hiring, COMPAS (137 features), word-embedding bias", "715–719"],
        ["Unawareness", "Drop A; fails because of proxies (e.g. “goes to Mexican markets”)", "720–721"],
        ["Demographic parity", "$P(\\hat Y = 1 \\mid A = 0) = P(\\hat Y = 1 \\mid A = 1)$", "723"],
        ["Equal opportunity", "Equal TPR: condition on Y = 1", "725"],
        ["Equalized odds", "Equal TPR and FPR: condition on Y = 1 and Y = 0", "724"],
        ["Practice answer", "Ŷ1: parity only; Ŷ2: equal opportunity only", "726–743"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Write each probability with its condition, e.g. $P(\\hat Y_1 = 1 \\mid R = W, Y = \\text{yes}) = 1/2$ · show which rows you counted · give a ✓/✗ verdict for **every** criterion and predictor · remember equalized odds needs **both** Y = yes and Y = no to match.",
    },
  ],

  glossary: [
    ["FAccT", "Fairness, Accountability and Transparency", "The field studying responsible ML (plus privacy and security)"],
    ["Fairness", "", "Absence of bias towards an individual or a group"],
    ["Accountability", "", "Who is responsible when a model fails"],
    ["Transparency", "", "Making models understandable and compliant with regulations"],
    ["Data poisoning", "", "Attacking a model by corrupting its training data"],
    ["Simpson's paradox", "", "A trend in combined data reverses within each subgroup"],
    ["Sensitive / protected attribute", "A", "e.g. race, gender; A = 1 marks the protected group"],
    ["Proxy feature", "Indirect evidence", "A feature correlated with the sensitive attribute"],
    ["Fairness through unawareness", "", "Not using A directly; an individual criterion, defeated by proxies"],
    ["Demographic parity", "Statistical parity", "Equal positive-prediction rates across groups"],
    ["Equal opportunity", "", "Equal true-positive rates across groups"],
    ["Equalized odds", "Equality of odds", "Equal true-positive and false-positive rates across groups"],
    ["COMPAS", "", "Commercial criminal-risk tool; 137 features; > 1 million offenders assessed"],
  ],

  examTips: [
    "Define all three criteria with formulas before computing; the definitions alone carry marks.",
    "For a table question, filter rows by group (and by Y) and write each probability as a fraction.",
    "If one predictor passes parity and another passes opportunity, say so; a predictor can satisfy one criterion and fail another.",
    "For “why isn't removing race enough?”, give a proxy example (postcode, “goes to Mexican markets”).",
    "Use Simpson's paradox as the go-to example of how aggregated data can mislead a model.",
  ],

  problems: [
    {
      title: "Hiring practice: predictor Ŷ1 (pages 726–734)",
      level: "Medium",
      question: "Using the six-row table (Race, Y, Ŷ1): H no 0; H yes 1; H yes 1; W yes 0; W yes 1; W no 1. Which fairness criteria does Ŷ1 satisfy?",
      solution: "### Demographic parity\n$P(\\hat Y_1 = 1 \\mid H) = 2/3$, $P(\\hat Y_1 = 1 \\mid W) = 2/3$ → **✓**.\n### Equal opportunity\n$P(\\hat Y_1 = 1 \\mid H, Y = \\text{yes}) = 2/2 = 1$; $P(\\hat Y_1 = 1 \\mid W, Y = \\text{yes}) = 1/2$ → **✗**.\n### Equalized odds\nAlso $P(\\hat Y_1 = 1 \\mid H, \\text{no}) = 0$ vs $P(\\hat Y_1 = 1 \\mid W, \\text{no}) = 1$ → **✗**.\n**Ŷ1 satisfies demographic parity only.**",
    },
    {
      title: "Hiring practice: predictor Ŷ2 (pages 735–743)",
      level: "Medium",
      question: "Same table with Ŷ2: H no 1; H yes 1; H yes 0; W yes 0; W yes 1; W no 0. Which criteria does Ŷ2 satisfy?",
      solution: "### Demographic parity\nH: 2/3; W: 1/3 → **✗**.\n### Equal opportunity\nH (yes rows: 1, 0) → 1/2; W (yes rows: 0, 1) → 1/2 → **✓**.\n### Equalized odds\nH (no row: 1) → 1; W (no row: 0) → 0 → **✗**.\n**Ŷ2 satisfies equal opportunity only.** (The PDF labels the parity rates “Ŷ1” on pages 735–737; they are Ŷ2's.)",
    },
    {
      title: "The A/Y/Ŷ table (pages 724–725)",
      level: "Medium",
      question: "A = 0 rows (Y, Ŷ): (1,0) (0,0) (1,0) (1,1) (0,0) (0,1) (1,1). A = 1 rows: (0,1) (1,1) (0,1) (0,0) (1,1) (1,0) (0,0). Check demographic parity, equal opportunity and equalized odds.",
      solution: "### Parity\nA = 0: Ŷ = 1 in 3 of 7 = 0.43; A = 1: 4 of 7 = 0.57 → ✗.\n### Equal opportunity (Y = 1)\nA = 0: Y = 1 rows (1,0) (1,0) (1,1) (1,1) → 2/4 = 0.50; A = 1: (1,1) (1,1) (1,0) → 2/3 = 0.67 → ✗.\n### Equalized odds (also Y = 0)\nA = 0: (0,0) (0,0) (0,1) → 1/3; A = 1: (0,1) (0,1) (0,0) (0,0) → 2/4 = 0.50 → ✗.\nNone of the three holds. (Exercise solution prepared for the website.)",
    },
    {
      title: "Design a fair predictor",
      level: "Hard",
      question: "In the six-row hiring table, propose Ŷ3 that satisfies equalized odds (and therefore equal opportunity). Does it also satisfy demographic parity?",
      solution: "Simplest: **Ŷ3 = Y** (predict the true decision): H rows 0, 1, 1; W rows 1, 1, 0.\nTPR: H 2/2 = 1, W 2/2 = 1 ✓. FPR: H 0/1 = 0, W 0/1 = 0 ✓ → **equalized odds ✓** (and equal opportunity ✓).\nParity: H 2/3, W 2/3 → ✓ here too, but only because both groups happen to have the same share of “yes” in Y. If the base rates differed, a perfect predictor would satisfy equalized odds but **not** demographic parity. (Exercise solution prepared for the website.)",
    },
    {
      title: "Simpson's paradox in numbers (page 714)",
      level: "Easy",
      question: "Dept A: men 825 applicants (62% admitted), women 108 (82%). Dept C: men 325 (37%), women 593 (34%). Compute the combined admission rate for each sex over these two departments and explain the paradox.",
      solution: "Men admitted: 0.62 × 825 + 0.37 × 325 = 511.5 + 120.25 = 631.75 of 1150 → **54.9%**.\nWomen: 0.82 × 108 + 0.34 × 593 = 88.56 + 201.62 = 290.18 of 701 → **41.4%**.\nWomen do better in Dept A and nearly as well in C, yet worse overall, because 85% of the women applied to the harder Dept C. Combining groups with different base rates can reverse a trend. (Exercise solution prepared for the website.)",
    },
  ],

  theory: [
    {
      title: "Why can ML models be unfair?",
      level: "Easy",
      question: "Explain, with two real-world examples, how bias enters ML models.",
      solution: "ML models approximate the patterns in their training data, so they learn and **amplify** whatever bias the data contain (page 712). Sources: unrepresentative data (HP webcams failing on black faces; NZ passport robot misreading an Asian man's eyes, pages 715–716), historical decisions (Amazon's hiring tool penalising “women's”, page 717; COMPAS trained on criminal-justice records, page 718), biased text (word embeddings linking occupations to gender, page 719), and aggregation effects such as Simpson's paradox (page 714), where a pooled trend reverses within subgroups.",
    },
    {
      title: "Fairness through unawareness",
      level: "Medium",
      question: "What is fairness through unawareness, and why is it not sufficient?",
      solution: "A model is fair through unawareness if it uses none of the sensitive features directly (page 720). It fails because the sensitive attribute can be **inferred from indirect evidence**: features correlated with it act as proxies, e.g. “often goes to Mexican markets” reveals ethnicity in the PDF's hiring example (page 721), so the model can still discriminate. It is an individual-level criterion (page 744); group criteria (demographic parity, equal opportunity, equalized odds) measure outcomes and are needed as well.",
    },
    {
      title: "Comparing the three group fairness criteria",
      level: "Medium",
      question: "Define demographic parity, equal opportunity and equalized odds, and explain how they differ.",
      solution: "**Demographic parity** (page 723): $P(\\hat Y = 1 \\mid A = 0) = P(\\hat Y = 1 \\mid A = 1)$: the favourable outcome is distributed at the same rate across groups, regardless of qualification. **Equal opportunity** (page 725): $P(\\hat Y = 1 \\mid A = 0, Y = 1) = P(\\hat Y = 1 \\mid A = 1, Y = 1)$: qualified members get the favourable outcome at the same rate (equal TPR). **Equalized odds** (page 724): the same for both Y = 1 and Y = 0 (equal TPR and FPR), so it implies equal opportunity. Parity ignores the true label and can conflict with accuracy when base rates differ; the odds-based criteria condition on the true label. In the PDF's practice, Ŷ1 satisfies only parity and Ŷ2 only equal opportunity (pages 726–743).",
    },
  ],

  quiz: [
    { topic: "FAccT", q: "“How do we defend ML models against data poisoning?” belongs to…", options: ["fairness", "transparency", "security", "accountability"], answer: 2, why: "Page 708.", wrong: ["About groups.", "About explanations/regulation.", null, "About responsibility."] },
    { topic: "Bias", q: "Simpson's paradox means…", options: ["the overall trend can reverse within every subgroup", "small samples are always biased", "removing a feature removes its effect", "accuracy implies fairness"], answer: 0, why: "Berkeley admissions example (page 714).", wrong: [null, "Not the definition.", "That's the unawareness fallacy.", "No."] },
    { topic: "Bias", type: "num", q: "How many features does COMPAS use (according to the PDF)?", answer: 137, tol: 0.5, why: "Page 718." },
    { topic: "Unawareness", q: "Removing the race column may still leave the model biased because…", options: ["models ignore columns", "other features act as proxies for race", "race is always the most important feature", "fairness needs more data"], answer: 1, why: "Indirect evidence (page 721).", wrong: ["No.", null, "Not necessarily.", "Not the reason given."] },
    { topic: "Criteria", q: "Equal opportunity requires equal…", options: ["positive-prediction rates", "true-positive rates", "false-positive rates only", "accuracy"], answer: 1, why: "Condition on Y = 1 (page 725).", wrong: ["That's parity.", null, "Odds needs TPR and FPR.", "Not a fairness criterion here."] },
    { topic: "Criteria", q: "Which criterion implies another one?", options: ["Parity implies opportunity", "Equalized odds implies equal opportunity", "Opportunity implies odds", "None"], answer: 1, why: "Odds includes the Y = 1 condition.", wrong: ["No.", null, "Reverse.", "Odds ⇒ opportunity."] },
    { topic: "Practice", type: "num", q: "Ŷ2 for Hispanic applicants: 1, 1, 0. P(Ŷ2 = 1 | H)? (2 decimals)", answer: 0.67, tol: 0.005, why: "2/3 (page 736)." },
    { topic: "Practice", type: "num", q: "Ŷ1 among qualified White applicants: 0 and 1. P(Ŷ1 = 1 | W, Y = yes)?", answer: 0.5, tol: 0.001, why: "1/2 (page 731)." },
    { topic: "Practice", q: "In the PDF's practice question, Ŷ1 satisfies…", options: ["demographic parity only", "equal opportunity only", "equalized odds", "none"], answer: 0, why: "2/3 = 2/3, but TPR 1 vs 0.5 (pages 729–734).", wrong: [null, "That's Ŷ2.", "Fails both conditions.", "Parity holds."] },
    { topic: "Practice", q: "In the PDF's practice question, Ŷ2 satisfies…", options: ["demographic parity only", "equal opportunity only", "equalized odds", "none"], answer: 1, why: "TPR 1/2 = 1/2, FPR 1 vs 0 (pages 738–743).", wrong: ["2/3 vs 1/3.", null, "FPRs differ.", "Opportunity holds."] },
  ],
};
