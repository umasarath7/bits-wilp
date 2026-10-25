// AML — Webinar 1: Classification models & Streamlit app (loan-approval case study)
// Source: CourseFiles/AML/Webinar 1/ — AML_Webinar_1.ppt (47 slides), AML_Webinar_1.ipynb, the three loan CSVs,
// loan_streamlit_app.py, rqmnts.txt and the run instructions. Every number was re-checked against the CSVs / notebook output.

export default {
  title: "Webinar 1: Loan Approval: Classification Models & a Streamlit App",
  source: "AML_Webinar_1.ppt (47 slides) + notebook + CSVs + loan_streamlit_app.py",
  quizMode: "step",
  overview:
    "This webinar is **practical**: one complete data-science project, start to finish, in Python. A home-loan company receives applications from **urban, semi-urban and rural** branches (three CSV files with **different column names and codes**) and wants to predict whether a loan will be **approved**. We walk the lifecycle exactly as the notebook does: **business understanding → data acquisition → data preparation (standardise and merge the three files) → exploratory data analysis → feature engineering (missing values, log transforms, new features like EMI) → model building (logistic regression, decision tree, random forest, Naïve Bayes, SVM, XGBoost) and comparison → deployment as a Streamlit web app**. Each lesson shows the code, says what it does and why, gives the actual output, and points out the traps, including several real mistakes in the notebook that are worth learning from. Run it yourself as you read: the last lesson tells you how.",

  summary: [
    {
      id: "business",
      heading: "Lesson 1: Business understanding: framing the problem",
      slides: "2–4",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Before writing code, a data scientist asks: **“What decision are we trying to make better?”** Here: a bank wants to decide faster whether to approve home loans. Past applications with their outcomes are our teacher. The output is Yes/No, so it's a **classification** problem."},
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to turn a business request into an ML task before touching any code.",
        },
        {
          type: "p",
          text: "**The business (slide 3, notebook):** “HomePlanners” offers home loans to salaried and other applicants through field teams in urban, semi-urban and rural areas. Customers submit an application; the approval team decides whether to disburse. Screening by hand is slow, so the bank wants to **automate the approval decision** and find which customer segments are eligible.\n\n**ML framing:** target = **Approved (Yes/No)** → a **binary classification** problem; inputs = the application attributes. **Factors likely to matter (slide 4):** applicant income, self-employed vs salaried, age, job type, marital status, **credit history**, loan amount, loan tenure.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "The project lifecycle (slide 2)",
          text: "```flow\nBusiness understanding -> Data acquisition -> Data preparation -> Exploratory data analysis -> Feature engineering -> Model building & selection -> Deployment (Streamlit)\n```",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Start from the decision, not the data.** Loan approval = predict Yes/No from application details = binary classification."},
      ],
    },
    {
      id: "acquire",
      heading: "Lesson 2: Data acquisition: reading three inconsistent files",
      slides: "5–8",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Three branch offices each kept their own spreadsheet, and each **named and coded things differently** (Married = Yes/No in one, 1/−1 in another; Gender = M/F vs 1/0). Before you can combine them, you must translate everything into **one common language**, exactly like converting three currencies into rupees before adding them up."},
        {
          type: "p",
          text: "**Libraries (slide 6):** **pandas** (data frames: load, clean, analyse), **NumPy** (fast arrays and maths), **Seaborn** (statistical plots, built on Matplotlib, works with pandas), **Matplotlib** (static/interactive plots).",
        },
        {
          type: "p",
          text: "```python\nimport pandas as pd, numpy as np, seaborn as sns, matplotlib.pyplot as plt\nurban_data     = pd.read_csv(\"Urban_loans.csv\")       # 35 rows × 12 cols\nsemiurban_data = pd.read_csv(\"Semi_Urban_loans.csv\")  # 39 rows × 12 cols\nrural_data     = pd.read_csv(\"Rural_loans.csv\")       # 40 rows × 10 cols\nurban_data.head(2)    # first rows: a quick sanity check\nurban_data.shape      # (rows, columns): confirm everything was read\nurban_data.columns    # column names\n```",
        },
        {
          type: "table",
          caption: "The same information, named and coded three ways (notebook cells 23–38)",
          head: ["Meaning", "Urban", "Semi-urban", "Rural"],
          rows: [
            ["Loan ID", "Loan_ID", "LID", "Loan_ID"],
            ["Gender", "Gender: M/F", "Gender: M/F", "Sex: **1/0**"],
            ["Married", "Married: Yes/No", "Marrital_Status: **1/−1**", "Marrital_Status: Yes/No"],
            ["Self-employed", "0/1", "**Yes/No**", "0/1"],
            ["Education", "Grad/NonGrad", "**G/NG**", "**NG/G**"],
            ["Income", "Applicant_Income", "Applicant_Income", "**Income**"],
            ["Co-applicant income", "CoapplicantIncome", "Coapplicant_Income", "**missing**"],
            ["Dependents", "Dependents", "Dependents", "DependentsCount"],
            ["Loan amount", "Loan_Amt", "LoanAmt", "LoanAmount"],
            ["Tenure", "Tenure", "LoanAmountTerm", "Loan_Term"],
            ["Credit history", "Yes/No", "**1/0**", "**missing**"],
            ["Target", "Approved: Y/N", "Approved: **1/0**", "Loan_Status: **Yes/No**"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Lesson",
          text: "Real data from several sources rarely agrees on names **or** codes. Before merging, list every column (`set(a.columns.append(b.columns)...)`) and every column's `unique()` values.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Look before you merge:** `.shape`, `.columns`, `.unique()` on every file. Same meaning, different names/codes = translate first."},
      ],
    },
    {
      id: "prep",
      heading: "Lesson 3: Data preparation: standardise and merge",
      slides: "9–16",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Data preparation = **rename, recode, then stack**.\n1. Rename columns to one standard (LID → Loan_ID).\n2. Recode values to one standard (G → Grad, 1 → Yes).\n3. Add a column remembering where each row came from (Property_Location).\n4. Stack the three tables on top of each other (`pd.concat`).\n\nGolden rule: **never invent data**. The rural file simply had no credit-history column; writing “No” for all of them made up facts and later misled every model."},
        {
          type: "p",
          text: "**Target schema (slide 11):** Loan_ID, Gender, Married, Tenure, Education, Self_Employed, Income, CoapplicantIncome, Credit_History, Dependents, Loan_Amt, **Approved** (target), plus a new **Property_Location** column (URBAN / SEMI_URBAN / RURAL) so the area isn't lost when the files are combined.",
        },
        {
          type: "p",
          text: "```python\n# 1) recode values to one convention\nsemiurban_data['Marrital_Status'] = semiurban_data['Marrital_Status'].replace({1: 'Yes', -1: 'No'})\nsemiurban_data['Self_Employed']   = semiurban_data['Self_Employed'].replace({'Yes': 1, 'No': 0})\nsemiurban_data['Education']       = semiurban_data['Education'].replace({'G': 'Grad', 'NG': 'NonGrad'})\nsemiurban_data['Credit_History']  = semiurban_data['Credit_History'].replace({1: 'Yes', 0: 'No'})\nsemiurban_data['Approved']        = semiurban_data['Approved'].replace({1: 'Y', 0: 'N'})\nrural_data['Sex']         = rural_data['Sex'].replace({1: 'M', 0: 'F'})\nrural_data['Loan_Status'] = rural_data['Loan_Status'].replace({'Yes': 'Y', 'No': 'N'})\n\n# 2) copy into a new frame with the standard column names\nsemiurban_df = pd.DataFrame()\nsemiurban_df['Loan_ID'] = semiurban_data['LID']\nsemiurban_df['Married'] = semiurban_data['Marrital_Status']\n# ... one line per column ...\nsemiurban_df['Property_Location'] = 'SEMI_URBAN'\n\n# 3) stack the three frames (rows on top of each other)\nloan_data = pd.concat([urban_df, semiurban_df, rural_df])\nloan_data.shape   # (114, 13)\n```",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Why `concat`, not `merge`?",
          text: "The three files hold **different applicants with the same columns**, so we stack rows (`pd.concat`). `merge` joins **different columns about the same rows** on a key. (The notebook says “merge horizontally”, but `concat` here stacks **vertically**.)",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Data-preparation trap (flagged): rural credit history",
          text: "Rural_loans.csv has **no Credit_History and no co-applicant income** columns. The notebook fills them with `rural_df['Credit_History'] = \"No\"` and `CoapplicantIncome = 0`. That **invents data**: all 40 rural applicants are recorded as having *no* credit history, yet 62.5% of them were approved. In the urban and semi-urban files, every applicant with credit history = No was **rejected** (13 of 13). Mixing the fake rural “No” values hides that strong signal, and the models later rank **Property_Location_RURAL** and **Credit_History_No** among the top features largely because of this artefact. Better: mark the value as **missing / “Unknown”** (its own category), or keep a flag column `credit_history_known`.",
        },
        {
          type: "p",
          text: "Final merged data: **114 rows × 13 columns**: 12 independent variables (incl. Loan_ID) and the target (slide 16).",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Rename → recode → tag the source → concat (stack rows).** Missing column? Mark it “Unknown”, don't invent values."},
      ],
    },
    {
      id: "eda",
      heading: "Lesson 4: Exploratory data analysis",
      slides: "17–30",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "**EDA = getting to know your data before trusting it**, like reading a patient's history before treatment.\n- **One column at a time (univariate):** what values appear and how often? Any strange outliers? Is it lopsided (skewed)?\n- **Each column against the answer (bivariate):** do married applicants get approved more often? Use row percentages, not raw counts.\n- **Numbers against numbers:** a correlation heat map.\n\nAlways read the numbers off the output itself; the notebook's mistakes (56% vs the real 65%, “left skew” for a right tail) came from retyping or eyeballing."},
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to look at data before modelling: one variable at a time (univariate), then each variable against the target (bivariate), then correlations. EDA, promoted by John Tukey, is about what the data tells us beyond formal modelling (slide 18).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Target balance (slide 19)",
          text: "```python\nloan_data['Approved'].value_counts()   # Y 74, N 40\nloan_data['Approved'].value_counts().plot.barh()\n```\n**74 / 114 = 65%** approved: moderately imbalanced, so look at precision/recall, not just accuracy.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Notebook/slide check (flagged): approval rate",
          text: "The slide and notebook compute `64 / (64 + 50) = 56%`, but the `value_counts()` output directly above shows **Y 74, N 40** (urban 20 + semi-urban 29 + rural 25 = 74). The correct rate is **74/114 = 64.9%**. Always compute from the output, never retype numbers.",
        },
        {
          type: "table",
          caption: "Univariate analysis (slides 20–23, notebook)",
          head: ["Variable type", "Plot", "What we saw"],
          rows: [
            ["Nominal (Gender, Married, Self_Employed, Credit_History)", "`value_counts(normalize=True).plot.barh()` in a 2 × 2 grid (`plt.subplot(2,2,i)`)", "About 75% male, about 67% married, about 15% self-employed"],
            ["Ordinal (Dependents, Education, Property_Location)", "`.plot.bar()`", "Few applicants with 3+ dependents; more graduates apply; roughly equal samples per area"],
            ["Numeric (Applicant_Income, CoapplicantIncome, Loan_Amt)", "Histogram + box plot", "Income: **strongly right-skewed** (mean 6082 vs median 3780, max 63337, skew 4.7) with outliers. Loan amount: also right-skewed (mean 156 vs median 126, skew 2.3)"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Notebook check (flagged): skew direction",
          text: "The notebook calls income “tilted towards the left”, calls Loan_Amt “normal” and later “a bit left skewed”. A long tail of **large** values is **right (positive) skew**: mean > median, as both variables show here. That's exactly why the log transform (Lesson 5) helps.",
        },
        {
          type: "p",
          text: "**Bivariate analysis (slides 24–28).** Cross-tabulate each categorical variable with the target and plot **row proportions** as stacked bars:\n```python\nMarried = pd.crosstab(loan_data['Married'], loan_data['Approved'])\nMarried.div(Married.sum(1).astype(float), axis=0).plot(kind='barh', stacked=True)\n```\n`div(..., axis=0)` divides each row by its total, so bars compare **approval rates**, not raw counts. Findings: married applicants have a higher approval share; non-graduates are rejected more often; applicants with **no credit history are rarely approved**; 1 dependent shows a higher approval share; Self_Employed shows nothing notable.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Notebook check (flagged): approval by area",
          text: "The notebook concludes “applicants from rural areas get loans easily”. The CSVs give approval rates **semi-urban 74%**, **rural 62.5%**, **urban 57%**. Semi-urban is highest. (The Gender cross-tab on slide 25, F 16/10 and M 33/50, also differs from the notebook's output, F 15/11 and M 23/60; trust the code output.)",
        },
        {
          type: "p",
          text: "**Hypotheses to test (slide 28):** high income → approval; good credit history → approval; smaller loan → approval; shorter tenure → approval; lower **EMI** → approval. **Correlation heat map (slides 29–30):** `sns.heatmap(df_num.corr(), annot=True, cmap='OrRd')` on the numeric columns; darker = stronger correlation. Loan amount correlates with applicant and co-applicant income.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Univariate (each column alone) → bivariate (each column vs the target) → correlations.** Mean ≫ median means a long right tail (right skew)."},
      ],
    },
    {
      id: "fe",
      heading: "Lesson 5: Feature engineering: missing values, skew and new features",
      slides: "(notebook §5)",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Feature engineering = **cooking the raw ingredients into something the model can digest**.\n- **Fill the holes:** categories → the most common value (mode); numbers → the middle value (median), which isn't dragged around by millionaires.\n- **Tame the giants:** take the log of very skewed money columns so one huge income doesn't dominate.\n- **Create meaningful features** a loan officer would think of: total household income, monthly instalment (EMI), money left after paying the EMI."},
        {
          type: "callout",
          kind: "example",
          title: "Missing values",
          text: "```python\nloan_data.isnull().sum()\n# Gender 5, Married 2, Self_Employed 7, Dependents 3, Loan_Amt 7, Tenure 2, Credit_History 7\ncat_cols = ['Gender', 'Married', 'Self_Employed', 'Credit_History']\nloan_data[cat_cols] = loan_data[cat_cols].fillna(loan_data[cat_cols].mode().iloc[0])   # categorical → mode\nnum_cols = ['Applicant_Income', 'CoapplicantIncome', 'Loan_Amt', 'Tenure']\nloan_data[num_cols] = loan_data[num_cols].fillna(loan_data[num_cols].median())         # numeric → median\n```\n**Median, not mean**, for Loan_Amt because outliers drag the mean. Other options: drop rows/columns (large data; consider % missing and *why* it's missing), category-wise imputation, model-based imputation.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Taming skew with logs",
          text: "`loan_data['Applicant_Income_log'] = np.log(loan_data['Applicant_Income'])`. A log compresses large values much more than small ones, so a long right tail becomes close to symmetric and outliers lose their pull. (Other outlier options: drop rows, cap at boundary values, sklearn's `LocalOutlierFactor`.)",
        },
        {
          type: "table",
          caption: "Feature creation (notebook cells 163–176)",
          head: ["New feature", "Formula", "Business logic"],
          rows: [
            ["Total_Income", "Applicant_Income + CoapplicantIncome", "Household repayment capacity"],
            ["EMI", "Loan_Amt / Tenure", "Monthly instalment (loan in thousands → EMI in thousands)"],
            ["Balance_Income", "Total_Income − EMI × 1000", "Money left after paying the EMI (× 1000 aligns the units)"],
            ["…_log", "np.log(…) of each", "Remove right skew"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Compute the features for one applicant",
          text: "*Prepared for the website.* Income 5000, co-applicant 1500, loan 150 (thousand), tenure 360 months.\nTotal = 6500 → log = **8.78**. EMI = 150/360 = 0.4167 (thousand) → log = **−0.875**. Balance = 6500 − 416.7 = 6083.3 → log = **8.71**.\nThese are exactly the values the Streamlit app computes from the form inputs.",
        },
        {
          type: "p",
          text: "Then drop the raw columns that were turned into features (Applicant_Income, CoapplicantIncome, Loan_Amt, Tenure, Total_Income, EMI, Balance_Income) and the identifier **Loan_ID** (unique per row, carries no pattern). Remaining: Gender, Married, Self_Employed, Education, Dependents, Credit_History, Property_Location, Total_Income_log, EMI_log, Balance_Income_log, Approved.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Notebook check (flagged): imputation undone",
          text: "Cell 159 runs `loan_data = loan_data_old.astype({...'category'})`. That **re-copies the raw data**, discarding the imputations and log columns made just before; the NaNs come back (`info()` shows Gender 109 non-null again). The notebook rescues it later with `fillna(median)` on the dummy-encoded frame and `replace([np.inf, -np.inf], np.nan)` for logs of non-positive values. Lesson: convert types on the **working** frame (`loan_data.astype(...)`), and keep a raw copy only for EDA.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Fill gaps (mode/median) → log the skewed → build business features (Total income, EMI, Balance) → drop IDs.**"},
      ],
    },
    {
      id: "model",
      heading: "Lesson 6: Model building: six classifiers",
      slides: "31–36",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Now we let several different “students” sit the same exam: logistic regression, a decision tree, a random forest, Naïve Bayes, an SVM and XGBoost. Before that: turn categories into 0/1 columns (`get_dummies`), split the data into a **practice set** (train) and an **exam set** (test) with the same Yes/No mix (`stratify`), and scale the numbers using **only the practice set**."},
        {
          type: "p",
          text: "```python\nloan_data = pd.get_dummies(loan_data)                     # one-hot encode (Approved → Approved_N / Approved_Y)\nX = loan_data.drop(['Approved_Y', 'Approved_N'], axis=1)\n# 19 columns: Self_Employed, Total_Income_log, EMI_log, Balance_Income_log,\n# Gender_F/M, Married_No/Yes, Education_Grad/NonGrad, Dependents_0/1/2/3+,\n# Credit_History_No/Yes, Property_Location_RURAL/SEMI_URBAN/URBAN\ny = loan_data['Approved_Y']\n\nfrom sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\n\nfrom sklearn.preprocessing import MinMaxScaler\nscaler = MinMaxScaler()\nX_train = scaler.fit_transform(X_train)   # fit on train only\nX_test  = scaler.transform(X_test)        # reuse train min/max\n```\n`stratify=y` keeps the 65/35 class ratio in both parts; `random_state` makes the split reproducible. 20% of 114 → **23 test rows**. (In the notebook, logistic regression used a separate 30% split, unstratified and without random_state, with the MinMaxScaler; the other five models used the stratified 80/20 split **without** scaling.)",
        },
        {
          type: "table",
          caption: "The models (slides 31–36)",
          head: ["Model", "Code", "Notes"],
          rows: [
            ["Logistic regression", "`LogisticRegression(max_iter=1000)`", "Linear; coefficients give feature effects (slide 31 mislabels it “Linear Regression”)"],
            ["Decision tree", "`DecisionTreeClassifier(criterion='gini', max_depth=4, random_state=42)`", "max_depth limits overfitting (pre-pruning, AML S9)"],
            ["Random forest", "`RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)`", "Bagged trees (AML S10)"],
            ["Naïve Bayes", "`GaussianNB()`", "Assumes Gaussian features, independent given the class: poor fit for 0/1 dummies"],
            ["SVM", "`SVC(kernel='linear', probability=True)`", "probability=True enables predict_proba"],
            ["XGBoost", "`XGBClassifier(eval_metric='logloss')`", "Gradient-boosted trees; `pip install xgboost` (use_label_encoder is obsolete)"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Reading the logistic-regression coefficients",
          text: "`model_LR.coef_` sorted by absolute value: **Credit_History_No −1.22**, Property_Location_RURAL +1.12, Credit_History_Yes +1.10, Property_Location_URBAN −1.04, Dependents_1 +0.84, Gender_M +0.57… Positive → raises the log-odds of approval; negative → lowers it (AML S5). Accuracy on its 30% split: **0.743** (the notebook text says “almost 71%”; the printed value is 74.3%). Note the RURAL and Credit_History_No weights are partly the rural-imputation artefact.",
        },
        {
          type: "p",
          text: "**Decision tree:** train accuracy 0.835, test accuracy **0.826**; rejected: precision 1.00, recall 0.50; approved: precision 0.79, recall 1.00. Top feature importances: Property_Location_RURAL 0.256, Credit_History_No 0.249, Married_No 0.158, Gender_M 0.109. Train ≈ test accuracy, so with depth 4 it isn't overfitting.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**get_dummies → stratified train/test split → scale (fit on train only) → fit several models.** Same data, many algorithms, fair comparison."},
      ],
    },
    {
      id: "compare",
      heading: "Lesson 7: Evaluating and comparing the models",
      slides: "37–38",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Choosing a model is like hiring: the best candidate depends on **which mistakes hurt your business most**. For a bank, approving a bad loan (false positive) is costly, so **precision** for “Approved” matters. And with only 23 test applicants, one lucky guess changes accuracy by 4%, so use **cross-validation** before declaring a winner."},
        {
          type: "p",
          text: "```python\nfrom sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix\nresults = []\nfor name, model in models.items():\n    y_pred = model.predict(X_test)\n    results.append({'Model': name,\n                    'Accuracy':  accuracy_score(y_test, y_pred),\n                    'Precision': precision_score(y_test, y_pred, zero_division=0),\n                    'Recall':    recall_score(y_test, y_pred, zero_division=0),\n                    'F1 Score':  f1_score(y_test, y_pred, zero_division=0)})\nprint(pd.DataFrame(results).sort_values(by='Accuracy', ascending=False))\n```",
        },
        {
          type: "table",
          caption: "Results on the 23 test rows (positive class = Approved; confusion matrix [[TN, FP], [FN, TP]])",
          head: ["Model", "Accuracy", "Precision", "Recall", "F1", "Confusion matrix"],
          rows: [
            ["**SVM (linear)**", "**0.870**", "0.833", "**1.000**", "**0.909**", "[[5, 3], [0, 15]]"],
            ["Random forest", "0.826", "0.824", "0.933", "0.875", "[[5, 3], [1, 14]]"],
            ["Decision tree (depth 4)", "0.826", "0.789", "1.000", "0.882", "rejected recall 0.50"],
            ["XGBoost", "0.783", "**0.917**", "0.733", "0.815", "[[7, 1], [4, 11]]"],
            ["Naïve Bayes", "0.652", "0.733", "0.733", "0.733", "[[4, 4], [4, 11]]"],
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Check one row by hand",
          text: "SVM: TN 5, FP 3, FN 0, TP 15. Accuracy = 20/23 = **0.870**; precision = 15/18 = **0.833**; recall = 15/15 = **1.0**; F1 = 2(0.833)(1)/1.833 = **0.909** ✓.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "How to read this comparison (important)",
          text: "- **23 test rows** is tiny: one prediction changes accuracy by 4.3 points. Use **stratified k-fold cross-validation** (`cross_val_score`) before declaring a winner.\n- **Which metric?** For a bank, approving a bad loan (FP, “approved” predicted for a rejected case) is costly, so **precision** for “Approved” matters, and XGBoost (0.917) makes the fewest such mistakes (1 FP). SVM approves everyone who deserved it (recall 1.0) but lets 3 bad cases through.\n- Naïve Bayes underperforms because GaussianNB treats 0/1 dummy columns as Gaussian and its independence assumption is violated (e.g. Gender_F = 1 − Gender_M).",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Pick the metric that matches the costly mistake (here: precision for Approved).** Tiny test set → cross-validate. Read the confusion matrix, not just accuracy."},
      ],
    },
    {
      id: "deploy",
      heading: "Lesson 8: Deployment: a Streamlit app",
      slides: "39–47 + loan_streamlit_app.py",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Deployment = **putting the model behind a shop counter** so anyone can use it. Streamlit turns a Python script into a web page: the sidebar is the application form, the button sends it to the model, and the page shows Approved/Rejected with a probability.\n\nThe golden rule: the app must prepare each new applicant **exactly the way training data was prepared** (same features, same order, same scaling). Otherwise the model is reading a form in a language it never learned, and it will give wrong answers **without any error message**."},
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to put a trained model behind a web form so non-technical users can try it, with Python only.",
        },
        {
          type: "p",
          text: "**Streamlit (slides 39–40):** an open-source Python library that turns a script into an interactive web app. No HTML, CSS or JavaScript; the script runs **top to bottom** on every interaction; it auto-reloads on save; built-in widgets (sliders, dropdowns, buttons) take one line each. Ideal for ML demos and sharing models with stakeholders.",
        },
        {
          type: "table",
          caption: "Streamlit essentials (slides 43–47)",
          head: ["Purpose", "Calls"],
          rows: [
            ["Text & layout", "`st.title`, `st.header`, `st.subheader`, `st.write` (text, data frames, anything), `st.markdown`"],
            ["Inputs", "`st.selectbox`, `st.number_input(min_value=…)`, `st.slider`, `st.text_input`, `st.button`"],
            ["Sidebar", "`st.sidebar.header(...)`, `st.sidebar.selectbox(...)`"],
            ["Show results", "`st.dataframe(df)` (interactive), `st.table(df)` (static), `st.success`, `st.error`, `st.info`"],
            ["Caching", "`@st.cache_resource` for models/connections; `@st.cache_data` for data frames/computations: avoids reloading on every rerun"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "Save the model, then load it in the app",
          text: "Notebook (last cell):\n```python\nimport joblib\njoblib.dump(dt_model, \"loan_model.pkl\")   # the depth-4 decision tree\n```\nApp:\n```python\n@st.cache_resource\ndef load_model():\n    return joblib.load(\"loan_model.pkl\")\nmodel = load_model()\n```",
        },
        {
          type: "p",
          text: "**How loan_streamlit_app.py works:**\n1. **Sidebar form:** Gender, Married, Dependents (0/1/2/3+), Education, Self Employed, Credit History, Property Location, Applicant income, Co-applicant income, Loan amount (thousands), Tenure (months).\n2. **`build_feature_vector()`** repeats the training-time feature engineering: Total_Income = applicant + co-applicant; EMI = loan / tenure; Balance = total − EMI × 1000; their logs (with `safe_log`, which clamps at 0.001 so log never sees 0 or a negative number); Self_Employed → 1/0; **one-hot** columns built by hand.\n3. The columns are put in **exactly the training order** (`FEATURE_COLUMNS`) via `pd.DataFrame([data], columns=FEATURE_COLUMNS)`.\n4. On **Predict**: `model.predict` (1 = approved) and `model.predict_proba(X)[0][1]` (approval probability) → `st.success` or `st.error`, then the feature row is shown with `st.dataframe`.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "The #1 deployment bug: training–serving skew",
          text: "The app must produce **the same features, in the same order and scale**, as training. Here it works because the saved decision tree was trained on **unscaled** features (cell 225 re-split X without the MinMaxScaler). If you deploy the scaled logistic regression or SVM instead, you must also `joblib.dump` the **scaler** and call `scaler.transform` in the app; otherwise predictions will be wrong without any error message.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**Save the model (joblib) → load once (@st.cache_resource) → rebuild the same features → predict → show.** Same pipeline in training and serving; no exceptions."},
      ],
    },
    {
      id: "run",
      heading: "Lesson 9: Run it yourself: step by step",
      slides: "41–42 + run instructions",
      blocks: [
        {"type": "callout", "kind": "idea", "title": "In plain words", "text": "Order matters: **install → run the notebook (it creates loan_model.pkl) → start the app**. The app only *reads* the model file; it never trains one."},
        {
          type: "p",
          text: "```bash\n# 1) put the CSVs, notebook and app in one folder; open a terminal there\ncd \"Webinar 1\"\n\n# 2) install the requirements (numpy, pandas, scikit-learn, matplotlib, streamlit, joblib)\npython3 -m pip install -r rqmnts.txt\n#   if scikit-learn/numpy complain:  pip install -U scipy scikit-learn  and  pip install \"numpy>=2.0,<2.8\"\n\n# 3) run the notebook top to bottom; its last cell writes loan_model.pkl\n\n# 4) start the app\npython3 -m streamlit run loan_streamlit_app.py\n#   opens http://localhost:8501 ; keep the terminal open (it's a live server)\n```",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Run-instruction check (flagged)",
          text: "The instructions say step 3 is `python loan_streamlit_app.py` to “train the model (creates model.joblib)”. The app script **doesn't train anything**: it only **loads `loan_model.pkl`**, which the **notebook's last cell** creates. Run the notebook first; otherwise the app stops with “No such file: loan_model.pkl”.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Try these inputs in the app",
          text: "1. Credit history **No**, location URBAN, other fields default, then switch only the location to RURAL. The tree's top features are Property_Location_RURAL and Credit_History_No, so see whether location alone flips the answer (the imputation artefact made visible).\n2. Credit history **Yes**, Married Yes, Semi-urban, income 5000, loan 150, tenure 360: a typical approved profile; note the probability.\n3. Raise the loan amount to 700 and cut tenure to 60: EMI rises, Balance_Income falls. Watch whether the prediction flips; a depth-4 tree may ignore these features entirely, which is itself a useful finding.",
        },
        {"type": "callout", "kind": "remember", "title": "Remember it", "text": "**pip install -r rqmnts.txt → run the notebook → python3 -m streamlit run loan_streamlit_app.py → open localhost:8501.**"},
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "formula",
      title: "The pipeline in one line",
      text: "```flow\nread 3 CSVs -> rename + recode -> concat (114 × 13) -> EDA -> impute (mode/median) -> log + Total_Income, EMI, Balance -> get_dummies -> stratified split -> scale (fit on train) -> 6 models -> compare -> joblib.dump -> Streamlit\n```",
    },
    {
      type: "table",
      head: ["Step", "Key code"],
      rows: [
        ["Inspect", "`.shape`, `.columns`, `.unique()`, `.isnull().sum()`, `.value_counts()`"],
        ["Combine", "`pd.concat([urban_df, semiurban_df, rural_df])`"],
        ["Rates by group", "`pd.crosstab(a, b)` then `.div(.sum(1), axis=0)`"],
        ["Impute", "`fillna(mode)` categorical · `fillna(median)` numeric"],
        ["Encode", "`pd.get_dummies(X)`"],
        ["Split", "`train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)`"],
        ["Scale", "`MinMaxScaler().fit_transform(train)` / `.transform(test)`"],
        ["Save / serve", "`joblib.dump` · `@st.cache_resource` + `joblib.load` · `streamlit run app.py`"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Lessons that carry marks",
      text: "Standardise names **and** codes before merging · don't invent values for missing columns · median for skewed data · log for right skew · fit transforms on training data only · 23 test rows → use cross-validation · deploy the same feature pipeline (and scaler) you trained with.",
    },
  ],

  glossary: [
    ["EDA", "exploratory data analysis", "Summarising data with plots and statistics before modelling"],
    ["Univariate / bivariate analysis", "", "One variable at a time / a variable against another (often the target)"],
    ["pd.concat", "", "Stack data frames (rows) with the same columns"],
    ["pd.crosstab", "", "Frequency table of two categorical variables"],
    ["value_counts", "", "Count of each unique value (normalize=True gives proportions)"],
    ["Imputation", "", "Filling missing values (mode, median, model-based)"],
    ["Log transform", "", "np.log to reduce right skew and the effect of outliers"],
    ["EMI", "equated monthly instalment", "Loan amount / tenure"],
    ["get_dummies", "one-hot encoding", "One 0/1 column per category"],
    ["Stratified split", "", "Train/test split keeping class proportions"],
    ["MinMaxScaler", "", "Scale features to [0, 1] using training min/max"],
    ["joblib", "", "Save/load trained Python objects (models) to disk"],
    ["Streamlit", "", "Python library that turns scripts into web apps"],
    ["@st.cache_resource", "", "Cache heavy objects (models) across reruns"],
    ["Training–serving skew", "", "Mismatch between training-time and deployment-time features"],
  ],

  examTips: [
    "If asked to “describe the data-science lifecycle”, list the seven stages and give one concrete action from this case for each.",
    "Explain why median beats mean for skewed numeric imputation, and why log transforms help right-skewed variables.",
    "When comparing models, mention the metric that matches the business cost (precision for approvals) and the small test set.",
    "For deployment questions: save model (and scaler) with joblib, rebuild identical features in the app, cache the model, run with `streamlit run`.",
  ],

  problems: [
    {
      title: "Plan the standardisation",
      level: "Easy",
      question: "The semi-urban file codes Married as 1/−1, Education as G/NG and Approved as 1/0. Write the pandas code to convert them to Yes/No, Grad/NonGrad and Y/N.",
      solution: "```python\nsemiurban_data['Marrital_Status'] = semiurban_data['Marrital_Status'].replace({1: 'Yes', -1: 'No'})\nsemiurban_data['Education'] = semiurban_data['Education'].replace({'G': 'Grad', 'NG': 'NonGrad'})\nsemiurban_data['Approved'] = semiurban_data['Approved'].replace({1: 'Y', 0: 'N'})\n```\nThen copy into `semiurban_df` with the standard names (Marrital_Status → Married, LID → Loan_ID, LoanAmt → Loan_Amt, LoanAmountTerm → Tenure, Coapplicant_Income → CoapplicantIncome) and add `Property_Location = 'SEMI_URBAN'`.",
    },
    {
      title: "Approval rate from value_counts",
      level: "Easy",
      question: "`value_counts()` shows Y 74, N 40. What is the approval rate, and what's wrong with the notebook's `64/(64+50)`?",
      solution: "*Exercise solution prepared for the website.*\n74/114 = **64.9%**. The notebook's 64 and 50 don't match the printed counts (and 64 + 50 = 114 only by coincidence), giving 56%. Compute from the output, e.g. `loan_data['Approved'].value_counts(normalize=True)`.",
    },
    {
      title: "Engineer the features for an applicant",
      level: "Medium",
      hint: "EMI is in thousands; multiply by 1000 before subtracting from income.",
      question: "Income 4000, co-applicant 2000, loan 120 (thousand), tenure 240 months. Compute Total_Income_log, EMI_log and Balance_Income_log.",
      solution: "*Exercise solution prepared for the website.*\nTotal = 6000 → ln 6000 = **8.70**.\nEMI = 120/240 = 0.5 → ln 0.5 = **−0.693**.\nBalance = 6000 − 500 = 5500 → ln 5500 = **8.61**.",
    },
    {
      title: "Metrics from the XGBoost confusion matrix",
      level: "Medium",
      question: "XGBoost: [[7, 1], [4, 11]] (rows actual N/Y, columns predicted N/Y). Compute accuracy, precision, recall and F1 for 'Approved'.",
      solution: "TN 7, FP 1, FN 4, TP 11. Accuracy = 18/23 = **0.783**; precision = 11/12 = **0.917**; recall = 11/15 = **0.733**; F1 = 2(0.917)(0.733)/1.650 = **0.815** ✓ matches the notebook.",
    },
    {
      title: "Which model would you deploy?",
      level: "Hard",
      question: "Using the comparison table, which model would you deploy for the bank and why? What would you do before deciding?",
      solution: "*Exercise solution prepared for the website.*\nThe costly error for a bank is approving a loan that should be rejected (FP for “Approved”). **XGBoost** has the highest precision (0.917, only 1 FP) despite lower accuracy; SVM has the best accuracy and F1 but 3 FPs. Before deciding: (1) fix the rural credit-history imputation; (2) evaluate all models with **stratified 5- or 10-fold cross-validation**, since 23 test rows are too few; (3) tune hyperparameters on validation folds; (4) consider the probability threshold (e.g. approve only if P > 0.7) to trade recall for precision.",
    },
    {
      title: "Fix the rural credit-history problem",
      level: "Hard",
      question: "Rural data has no credit-history column. Propose two better treatments than filling “No”, with code.",
      solution: "*Exercise solution prepared for the website.*\n1. **Explicit unknown category:** `rural_df['Credit_History'] = 'Unknown'`, then `get_dummies` creates Credit_History_Unknown, so the model learns its own effect without polluting “No”.\n2. **Missing flag + imputation:** `rural_df['Credit_History'] = np.nan`; add `loan_data['CH_known'] = loan_data['Credit_History'].notna().astype(int)`; impute the missing values with the mode **inside** the training folds.\nEither way, retrain and compare feature importances: Credit_History_No should become a clean negative signal.",
    },
    {
      title: "Write a minimal Streamlit app",
      level: "Medium",
      question: "Write a Streamlit script that loads `loan_model.pkl` once, asks for the 19 features (assume a helper `build_feature_vector()`), and shows the prediction and probability.",
      solution: "*Exercise solution prepared for the website.*\n```python\nimport streamlit as st, joblib\n\n@st.cache_resource\ndef load_model():\n    return joblib.load('loan_model.pkl')\n\nmodel = load_model()\nst.title('Loan Approval Prediction')\nst.sidebar.header('Applicant Details')\n# ... st.sidebar.selectbox / number_input widgets ...\nif st.button('Predict Loan Approval'):\n    X = build_feature_vector()                  # same 19 columns, same order as training\n    p = model.predict_proba(X)[0][1]\n    (st.success if p >= 0.5 else st.error)(f'Approval probability: {p:.1%}')\n    st.dataframe(X)\nelse:\n    st.info('Fill the details and click Predict.')\n```\nRun: `python3 -m streamlit run app.py` → http://localhost:8501.",
    },
  ],

  theory: [
    {
      title: "Data-science lifecycle for the loan case",
      level: "Easy",
      question: "List the stages of the webinar's data-science lifecycle with one action from the loan case for each.",
      solution: "Business understanding (automate loan approval: binary classification) → data acquisition (read three CSVs) → data preparation (standardise names and codes, add Property_Location, concat to 114 × 13) → EDA (target balance, bar charts, cross-tabs, correlation heat map) → feature engineering (mode/median imputation, log transforms, Total_Income, EMI, Balance_Income, one-hot encoding) → model building and selection (LR, DT, RF, NB, SVM, XGBoost compared on accuracy/precision/recall/F1) → deployment (joblib + Streamlit app) (slide 2).",
    },
    {
      title: "Why log-transform income?",
      level: "Easy",
      question: "Why does the notebook apply np.log to income, EMI and balance income?",
      solution: "These variables are strongly right-skewed (income mean 6082 vs median 3780, max 63337). A log compresses large values far more than small ones, making the distribution closer to normal and reducing the influence of outliers on models such as logistic regression and Gaussian NB.",
    },
    {
      title: "Accuracy is not enough",
      level: "Medium",
      question: "The SVM had the highest accuracy. Why might that not make it the best model here?",
      solution: "With 23 test rows, accuracy differences of one or two predictions are noise. The classes are imbalanced (65% approved), and the business cost is asymmetric: wrongly approving a bad loan (FP) is expensive, so precision for “Approved” matters; XGBoost had the best precision (0.917). Use cross-validation and a cost-aware metric or threshold.",
    },
    {
      title: "Streamlit and deployment pitfalls",
      level: "Medium",
      question: "Describe how the Streamlit app serves the model, and the main pitfall when deploying.",
      solution: "The model is saved with joblib and loaded once with @st.cache_resource. Sidebar widgets collect inputs; build_feature_vector recreates the training features (totals, EMI, balance, logs, one-hot columns) in the same column order; model.predict and predict_proba produce the result shown with st.success/st.error. Pitfall: **training–serving skew**: any difference in features, order or scaling (e.g. forgetting the MinMaxScaler for a scaled model) silently gives wrong predictions.",
    },
  ],

  quiz: [
    { topic: "Framing", q: "Predicting whether a loan is approved is…", options: ["Regression", "Binary classification", "Clustering", "Reinforcement learning"], answer: 1, why: "Target Yes/No.", wrong: ["Target isn't numeric.", null, "We have labels.", "No rewards."] },
    { topic: "Preparation", q: "Combining urban, semi-urban and rural rows that share the same columns uses…", options: ["pd.merge on Loan_ID", "pd.concat", "pd.crosstab", "pd.get_dummies"], answer: 1, why: "Stacks rows.", wrong: ["merge joins columns on a key.", null, "That's a frequency table.", "That's encoding."] },
    { topic: "Preparation", q: "Filling every rural Credit_History with “No” is a problem because…", options: ["It's slow", "It invents data and corrupts a strong signal", "pandas can't do it", "Rural rows are deleted"], answer: 1, why: "Rural was 62.5% approved despite fake “No”.", wrong: ["Speed is irrelevant.", null, "It can.", "They aren't."] },
    { topic: "EDA", type: "num", q: "Approval rate from Y 74, N 40? (3 decimals)", answer: 0.649, tol: 0.002, why: "74/114." },
    { topic: "EDA", q: "Income with mean 6082 and median 3780 is…", options: ["Left-skewed", "Right-skewed", "Symmetric", "Uniform"], answer: 1, why: "Mean > median: long right tail.", wrong: ["Mean would be below the median.", null, "Mean ≈ median then.", "No."] },
    { topic: "EDA", q: "In `crosstab.div(crosstab.sum(1), axis=0)` the bars show…", options: ["Raw counts", "Row proportions (approval rate per group)", "Column totals", "Correlations"], answer: 1, why: "Each row divided by its total.", wrong: ["Before dividing.", null, "No.", "No."] },
    { topic: "Feature engineering", q: "Why impute Loan_Amt with the median rather than the mean?", options: ["It's faster", "Outliers pull the mean", "Median is always larger", "sklearn requires it"], answer: 1, why: "Robust to outliers.", wrong: ["No.", null, "Not true.", "No."] },
    { topic: "Feature engineering", type: "num", q: "EMI for loan 150 (thousand) over 360 months, in thousands? (4 decimals)", answer: 0.4167, tol: 0.0005, why: "150/360." },
    { topic: "Feature engineering", q: "Loan_ID is dropped before modelling because…", options: ["It has missing values", "It's a unique identifier with no pattern", "It's numeric", "It's the target"], answer: 1, why: "Notebook cell 180.", wrong: ["It doesn't.", null, "It's a string.", "No."] },
    { topic: "Modelling", q: "`stratify=y` in train_test_split…", options: ["Shuffles features", "Keeps class proportions equal in train and test", "Scales data", "Removes outliers"], answer: 1, why: "Important with imbalance.", wrong: ["No.", null, "No.", "No."] },
    { topic: "Modelling", q: "The MinMaxScaler should be…", options: ["Fit on all data", "Fit on train, applied to test", "Fit on test", "Fit separately on each"], answer: 1, why: "Avoids leakage.", wrong: ["Leaks test info.", null, "No.", "Different scales."] },
    { topic: "Evaluation", type: "num", q: "SVM: TP 15, FP 3, FN 0, TN 5. Precision? (3 decimals)", answer: 0.833, tol: 0.002, why: "15/18." },
    { topic: "Evaluation", q: "Which model had the highest precision for “Approved”?", options: ["SVM", "Random forest", "XGBoost", "Naïve Bayes"], answer: 2, why: "0.917 (1 FP).", wrong: ["0.833.", "0.824.", null, "0.733."] },
    { topic: "Deployment", q: "`@st.cache_resource` is used to…", options: ["Cache data frames", "Load the model once instead of on every rerun", "Style the page", "Create widgets"], answer: 1, why: "Slide 47.", wrong: ["That's @st.cache_data.", null, "No.", "No."] },
    { topic: "Deployment", q: "The Streamlit app needs loan_model.pkl, which is created by…", options: ["Running the app script", "The notebook's last cell (joblib.dump)", "pip install", "streamlit run"], answer: 1, why: "The app only loads it (the run instructions are misleading).", wrong: ["It only loads.", null, "No.", "No."] },
    { topic: "Deployment", q: "Training–serving skew means…", options: ["The model is too big", "Features at prediction time differ from training features", "The server is slow", "Classes are imbalanced"], answer: 1, why: "Same features, order, scaling required.", wrong: ["No.", null, "No.", "No."] },
  ],
};
