// DMML — Lecture 11: Feature Preparations
// Source: CourseFiles/DMML/L11-Feature Preparations.pptx (110 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Feature Preparation",
  source: "L11-Feature Preparations.pptx · 110 slides",
  overview:
    "A model never sees “the data”: it sees **features**, carefully chosen and prepared measurements. This lecture follows a feature through its whole life. It defines **features vs feature definitions vs feature values** (slides 4–15), walks the **feature life-cycle** from collection to retirement (slides 16–22), tackles the hardest input of all, **labels** (hand labels, natural labels, weak/semi-supervision, transfer and active learning, slides 23–46), shows how to make more data with **augmentation** (slides 47–54), teaches the everyday **feature-engineering operations** (missing values, scaling, discretization, encoding, feature crossing, slides 55–71), explains what makes a **good feature** (importance, generalization, cost, slides 72–80), and ends with the **feature store** (slides 81–94) and **feature governance** (slides 95–108). Main sources: Chip Huyen's *Designing ML Systems* and *Reliable Machine Learning*.",

  simpleIntro: "A model is like a chef who can only taste what you put on the plate. **Features** are the ingredients you choose and prepare; **labels** are the answers you teach it with. This lecture covers how to pick and prepare ingredients (feature engineering), how to get answers when labelling is costly, how to make extra training data, and how big companies keep features organised and shared (the **feature store**) under clear rules (**governance**).",

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
              "title": "Features",
              "text": "The prepared inputs a model learns from.",
              "tag": "Ingredients",
              "example": "temperature, humidity, pressure (not the record ID!)"
            },
            {
              "title": "Labels",
              "text": "The correct answers for training, often the most expensive part.",
              "tag": "Answer key",
              "example": "spam / not spam; house price"
            },
            {
              "title": "Feature store",
              "text": "One shared, governed shelf of features for training **and** serving.",
              "tag": "The pantry",
              "example": "Offline history + online latest values"
            }
          ]
        }
      ]
    },
    {
      "id": "s-def",
      "heading": "2. Feature definition vs feature value",
      "slides": "4–22",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Meaning",
            "Example"
          ],
          "rows": [
            [
              "**Feature definition**",
              "The **recipe** (code) for extracting it",
              "“Country from the customer's IP address”"
            ],
            [
              "**Feature value**",
              "One **result** of the recipe",
              "“India”"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Who invents features?** Humans (domain knowledge, can imagine **new** data to collect, spot bias) or algorithms (AutoML, **embeddings**: “cat” → [0.2, 0.8, 0.1]), which are fast but only find what's already in the data."
        },
        {
          "type": "p",
          "text": "```flow\nCollect -> Clean -> Define -> Extract -> Store -> Evaluate -> Train and serve -> Update -> Delete values -> Retire\n```"
        }
      ]
    },
    {
      "id": "s-labels",
      "heading": "3. Labels: why they're hard and five ways around it",
      "slides": "23–46",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Problem with hand labels",
            "Picture"
          ],
          "rows": [
            [
              "**Expensive**",
              "Spam: anyone. X-rays: a radiologist"
            ],
            [
              "**Privacy**",
              "Patient data can't leave the hospital"
            ],
            [
              "**Slow**",
              "Speech transcription can take 400× the audio length"
            ],
            [
              "**Disagreement**",
              "Is this film a comedy or a family drama?"
            ],
            [
              "**Mixed quality**",
              "Adding 1M cheap labels made a model **worse**: track where labels came from (lineage)"
            ]
          ]
        },
        {
          "type": "table",
          "head": [
            "Way around",
            "One-line idea",
            "Example"
          ],
          "rows": [
            [
              "**Natural labels**",
              "Behaviour labels itself",
              "Click = good recommendation"
            ],
            [
              "**Weak supervision**",
              "Rules write the labels (Snorkel)",
              "Note says ‘pneumonia’ → EMERGENT"
            ],
            [
              "**Semi-supervision**",
              "A few labels spread to the rest",
              "Train, add confident guesses, retrain"
            ],
            [
              "**Transfer learning**",
              "Borrow an already-trained brain",
              "Fine-tune BERT"
            ],
            [
              "**Active learning**",
              "The model asks for the labels it needs",
              "Label only the most uncertain samples"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**W**eak, **S**emi, **T**ransfer, **A**ctive: “**W**e **S**hare **T**rained **A**nswers.”"
        },
        {
          "type": "check",
          "q": "A model picks the 100 emails it is least sure about and asks humans to label only those. This is…",
          "options": [
            "Weak supervision",
            "Active learning",
            "Transfer learning",
            "Augmentation"
          ],
          "answer": 1,
          "why": "The model queries the most useful samples."
        }
      ]
    },
    {
      "id": "s-aug",
      "heading": "4. Augmentation: more data from the data you have",
      "slides": "47–54",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Type",
            "Simple idea",
            "Example"
          ],
          "rows": [
            [
              "**Label-preserving**",
              "Change it, meaning stays",
              "A rotated dog photo is still a dog; swap a word for a synonym"
            ],
            [
              "**Perturbation**",
              "Add a little noise",
              "Noisy images make the model tougher against attacks"
            ],
            [
              "**Synthesis**",
              "Create new samples",
              "“Find me a [CUISINE] restaurant near [LOCATION]”; **MixUp** blends a dog and cat image 70/30"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-ops",
      "heading": "5. Everyday feature operations",
      "slides": "55–71",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Missing type",
            "Why missing",
            "Survey example"
          ],
          "rows": [
            [
              "**MNAR**",
              "Because of the value itself",
              "Rich people hide income"
            ],
            [
              "**MAR**",
              "Because of another column",
              "One gender skips age"
            ],
            [
              "**MCAR**",
              "No reason (rare)",
              "Job field forgotten"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Fix by deleting** (columns or rows: may lose information or add bias) or **imputing** (default/mean/median: may add bias). Never fill “children” with 0, because then you can't tell “none” from “didn't say”. **No method is perfect.**"
        },
        {
          "type": "table",
          "head": [
            "Operation",
            "Why",
            "Watch out"
          ],
          "rows": [
            [
              "**Scaling**",
              "Age 20–40 vs income 10k–150k shouldn't look unequal",
              "Use **training** min/max only (else leakage); log for skewed data"
            ],
            [
              "**Binning**",
              "Treat 9,000.50 like 10,000",
              "Boundaries"
            ],
            [
              "**Hashing trick**",
              "New brands appear daily; hash them into fixed slots (2¹⁸ = 262,144)",
              "Collisions are rare but possible"
            ],
            [
              "**Feature crossing**",
              "Marital status × children captures combinations",
              "Too many features → overfitting"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "example",
          "title": "The Amazon brand story",
          "text": "Brands numbered 0…2 million → **crash** on a new brand → UNKNOWN bucket → new brands get no traffic → top-99% + UNKNOWN → 20 new brands all treated alike → **hashing trick** fixes it."
        },
        {
          "type": "check",
          "q": "Values are missing because high earners refuse to report income. Type?",
          "options": [
            "MCAR",
            "MAR",
            "MNAR",
            "None"
          ],
          "answer": 2,
          "why": "Missing because of the value itself."
        }
      ]
    },
    {
      "id": "s-good",
      "heading": "6. Good features: important, general, worth the cost",
      "slides": "72–80",
      "blocks": [
        {
          "type": "list",
          "items": [
            "**Importance:** how much worse the model gets without it (SHAP, XGBoost). At Facebook the top 10 features gave half the importance; the last 300 under 1%.",
            "**Generalises:** a comment's ID is useless; values seen in training must also appear in real use (Sunday never in training → DAY_OF_WEEK hurts).",
            "**Coverage:** a feature known for only 1% of people rarely helps.",
            "**Worth it:** A/B test the model with one new feature and estimate the **ROI** (value vs cost)."
          ]
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Too many features",
          "text": "More leakage risk, overfitting, memory/cost, slower predictions, and technical debt."
        }
      ]
    },
    {
      "id": "s-store",
      "heading": "7. The feature store: a shared pantry",
      "slides": "81–94",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Offline store",
            "Online store"
          ],
          "rows": [
            [
              "Like…",
              "The warehouse of past stock",
              "The counter with today's fresh items"
            ],
            [
              "Holds",
              "Years of history",
              "Only the latest value"
            ],
            [
              "For",
              "Training (point-in-time correct)",
              "Live predictions in milliseconds"
            ],
            [
              "Tech",
              "S3, BigQuery, Snowflake",
              "Redis, DynamoDB, Cassandra"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Five parts: **serving, storage, transform, monitoring, registry** (the single source of truth). The big win: training and serving use the **same definitions**, so there's no **training-serving skew**."
        },
        {
          "type": "check",
          "q": "A fraud model needs a customer's latest transaction count within 20 ms. Which store?",
          "options": [
            "Offline store",
            "Online store",
            "Data lake",
            "Registry"
          ],
          "answer": 1,
          "why": "Low-latency latest values live in the online store."
        }
      ]
    },
    {
      "id": "s-gov",
      "heading": "8. Governance: rules for the pantry",
      "slides": "95–108",
      "blocks": [
        {
          "type": "p",
          "text": "Without rules: duplicate features, conflicting definitions, unknown origins, privacy violations."
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "Five principles: **D**iscoverable, **U**nderstandable, **T**rustworthy, **A**ccountable, **C**ompliant (“**DUTAC**”)."
        },
        {
          "type": "p",
          "text": "```flow\nPropose in Git -> Automatic checks -> Review -> Approve -> Staging -> Production -> Deprecated -> Retired\n```"
        },
        {
          "type": "p",
          "text": "Plus: naming like `user_transaction_counts_7d`, a named **owner** for every feature, tags like **PII**, role-based access, and versioning. **Start simple**, then grow."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "9. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Definition** = recipe; **value** = one result.\n- **Labels:** expensive, private, slow, disputed. Fixes: natural, weak, semi, transfer, active.\n- **Augment:** transform, perturb, synthesise (MixUp).\n- **Missing:** MNAR / MAR / MCAR; delete or impute, never perfect.\n- **Scale with training statistics; hash unseen categories; cross for combinations.**\n- **Feature store:** offline (history) + online (latest); same definitions → no skew.\n- **Governance:** DUTAC, owners, approval, lifecycle, versioning."
        }
      ]
    }
  ],

  summary: [
    {
      id: "what",
      heading: "Lesson 1: What exactly is a feature?",
      slides: "4–15",
      blocks: [
        {
          type: "p",
          text: "**Slide 5's puzzle.** To predict tomorrow's weather we have columns like RecordID, scientist's name, country, date, latitude, longitude, temperature, morning/evening, humidity, cloud cover, **IP address**, wind direction and pressure. Which are useful inputs? Temperature, humidity, pressure, wind and cloud cover clearly are; the record ID, scientist's name and IP address clearly aren't. Choosing and preparing those useful inputs is feature work.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Definitions (slides 6–7)",
          text: "A **feature** is *an individual measurable property of a data set*: any aspect of the data useful for the model's goal. Features are the **link between the model and the data**, and usually involve some preprocessing.\n- **Feature definition** = the **code or description** of what to extract. *“The customer's source country, found by looking up their IP address in a geolocation service.”*\n- **Feature value** = one **specific output** of that definition. *“India”, “Russia”, “The Dominican Republic”.*",
        },
        {
          type: "table",
          caption: "Recap of the four feature activities (slides 9–13, from Lecture 6)",
          head: ["Activity", "What it does", "Examples"],
          rows: [
            ["**Feature creation**", "Make new features from existing data", "One-hot encoding, binning, splitting, calculated fields"],
            ["**Transformation & imputation**", "Replace missing or invalid values; reshape", "Cartesian products of features, non-linear transforms, domain features"],
            ["**Feature extraction**", "Reduce the data with dimensionality reduction", "PCA, ICA, LDA"],
            ["**Feature selection**", "Keep the subset that lowers the error", "Feature-importance scores, correlation matrix"],
          ],
        },
        {
          type: "table",
          caption: "Who engineers features? (slides 13–15)",
          head: ["", "Human-driven", "Algorithmic / automated"],
          rows: [
            ["**How**", "Domain understanding + brainstorming + statistical checks (YarnIt: time of day, humidity, price might predict yarn purchases)", "AutoML picks features and applies transforms (log scaling, thresholds); **embeddings** learn representations (“cat” → [0.2, 0.8, 0.1])"],
            ["**Strength**", "Can imagine **new data worth collecting**; understands collection and **bias**", "As good as or better than humans on constrained problems; fast"],
            ["**Limit**", "Slow, needs experts", "Can only find features that **already exist** in the data"],
          ],
        },
      ],
    },
    {
      id: "lifecycle",
      heading: "Lesson 2: The life of a feature, from birth to retirement",
      slides: "16–22",
      blocks: [
        {
          type: "p",
          text: "```flow\nCollect or create data -> Clean and normalise -> Define candidate feature -> Extract values -> Store values -> Evaluate -> Train and serve\nTrain and serve -> Update definition -> Delete values -> Discontinue feature\n```",
        },
        {
          type: "table",
          caption: "The stages (slides 18–22)",
          head: ["Stage", "What happens"],
          rows: [
            ["**Collection / creation**", "No data, no features"],
            ["**Cleaning / normalisation**", "Coarse preprocessing: drop malformed examples, scale to common ranges, delete data you may not train on for **policy** reasons"],
            ["**Candidate definition**", "A hypothesis, from experts or tools, about which data will help"],
            ["**Value extraction**", "Code that reads raw data and outputs features. If you serve online, the **same logic must run at serving time**: ideally the same code for training and serving"],
            ["**Store values**", "Write them where training can read them **quickly and consistently**"],
            ["**Evaluation**", "**Coarse-grained:** is it worth integrating? **Fine-grained:** continuously judge quality and value vs cost"],
            ["**Training & serving**", "The whole point: use features in models"],
            ["**Update definition**", "Fix a bug or improve it; **version** the definition and optionally re-process old data"],
            ["**Delete values**", "Permission revoked (by a person or government), or too old / inefficient"],
            ["**Discontinue**", "Remove serving code → remove stored values → stop extraction → delete the feature code"],
          ],
        },
      ],
    },
    {
      id: "labels",
      heading: "Lesson 3: Labels: the expensive part, and five ways around it",
      slides: "23–46",
      blocks: [
        {
          type: "p",
          text: "**Features are inputs; labels are the answers** (slides 24–25). In house-price prediction, bedrooms, area and location are features; the price is the label. Features should be measurable, ideally independent, and can be numeric, categorical or text. Labels depend on the features and can be categorical (spam / not spam) or numeric (price). **Most production ML is supervised**, so it needs labels (slide 26).",
        },
        {
          type: "table",
          caption: "Why hand labels hurt (slides 27–32)",
          head: ["Problem", "Example"],
          rows: [
            ["**Expensive**", "Spam labelling: 20 crowd workers trained in 15 minutes. Chest X-rays: board-certified **radiologists**, scarce and costly"],
            ["**Privacy threat**", "Patient or financial data often **can't leave the organisation** to be labelled"],
            ["**Slow**", "Phonetic speech transcription can take **400×** the audio's length, slowing iteration"],
            ["**Label multiplicity**", "Annotators disagree (is a film comedy or family drama? which entities in “Darth Sidious…Galactic Emperor of the First Galactic Empire”?). Fix: a **clear problem definition** (e.g. “pick the longest substring”) taught to all annotators"],
            ["**Lineage**", "A team added 1M crowd-labelled samples to 100K good ones and accuracy **fell**: the new labels were worse and couldn't be separated. Track the **origin of every sample and label**"],
          ],
        },
        {
          type: "p",
          text: "**Natural labels (slide 33).** Some tasks label themselves: in a recommender, a recommendation that is **clicked** is POSITIVE; one not clicked within, say, 10 minutes is NEGATIVE.",
        },
        {
          type: "table",
          caption: "Handling the lack of labels (slides 34–46)",
          head: ["Method", "Idea", "Needs ground truth?", "Example / note"],
          rows: [
            ["**Weak supervision**", "Write **labelling functions (LFs)** that encode heuristics; combine, denoise and reweight their (noisy, conflicting) outputs. Also called **programmatic labelling** (**Snorkel**)", "No (a small hand-labelled set is recommended to check LFs)", "“If the nurse's note mentions pneumonia → EMERGENT”. LF types: keywords, regex, database lookup, other models' outputs"],
            ["**Semi-supervision**", "Start from a **small set of labels** and spread them using structure", "Yes, an initial set", "**Self-training** (add confident predictions), **similarity/clustering/kNN**, **perturbation** (small noise keeps the label)"],
            ["**Transfer learning**", "Reuse a model trained on a cheap base task (e.g. language modelling) for your **downstream** task, **zero-shot** or **fine-tuned**", "No for the base task", "ImageNet models for detection; **BERT, GPT-3** for text"],
            ["**Active learning**", "The model **asks** for labels on the most useful samples", "Yes (annotators answer queries)", "**Uncertainty sampling** (least confident) or **query-by-committee** (most disagreement)"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Weak supervision: pros and cons (slide 37)",
          text: "**Pros:** great for **private data** (experts see only a small cleared subset to write LFs); expertise becomes **versioned, reusable, shareable** code; just re-run LFs when data changes. **Cons:** labels may be **too noisy**, and LFs don't cover every sample, which is exactly why you still train an ML model to **generalise** beyond them.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**W**eak = rules write labels · **S**emi = a few labels spread · **T**ransfer = borrow a trained brain · **A**ctive = the model asks. (“**W**e **S**hare **T**rained **A**nswers.”)",
        },
      ],
    },
    {
      id: "augment",
      heading: "Lesson 4: Making more data: augmentation",
      slides: "47–54",
      blocks: [
        {
          type: "p",
          text: "**Data augmentation** is *a family of techniques to increase the amount of training data*. It began for small datasets (medical imaging) but now also makes models **robust to noise and adversarial attacks**. It is standard in computer vision and growing in NLP (slide 49).",
        },
        {
          type: "table",
          caption: "Three types (slides 50–54)",
          head: ["Type", "How", "Examples"],
          rows: [
            ["**Label-preserving transformations**", "Change the sample but not its meaning", "Images: crop, flip, rotate, invert, erase part (a rotated dog is still a dog). Text: swap a word for a synonym or a close word in embedding space"],
            ["**Perturbation**", "Add small noise", "Noisy images. **Adversarial attacks** use noise to fool a model; **adversarial augmentation** trains on such samples to fix weak spots (**DeepFool** finds the minimum noise that causes misclassification; BERT uses perturbation in NLP)"],
            ["**Data synthesis**", "Generate new samples", "NLP **templates**: “Find me a [CUISINE] restaurant within [NUMBER] miles of [LOCATION]”. Vision **MixUp**: $x' = \\gamma x_1 + (1 - \\gamma)x_2$, with label $\\gamma \\cdot 0 + (1 - \\gamma) \\cdot 1$ for DOG = 0, CAT = 1"],
          ],
        },
        {
          type: "p",
          text: "**MixUp benefits:** better generalisation, less memorisation of corrupt labels, more robustness to adversarial examples, and more stable GAN training (slide 54).",
        },
      ],
    },
    {
      id: "ops",
      heading: "Lesson 5: Everyday feature-engineering operations",
      slides: "55–71",
      blocks: [
        {
          type: "table",
          caption: "Three kinds of missing values (slides 57–59)",
          head: ["Type", "Why it's missing", "Survey example"],
          rows: [
            ["**MNAR** (not at random)", "Because of the **value itself**", "High earners don't report **income**"],
            ["**MAR** (at random)", "Because of **another observed variable**", "Gender-A respondents tend not to report **age**"],
            ["**MCAR** (completely at random)", "No pattern at all (rare: investigate first)", "People randomly forget the **job** field"],
          ],
        },
        {
          type: "table",
          caption: "Deletion or imputation? (slides 60–63)",
          head: ["Method", "How", "Risk"],
          rows: [
            ["**Column deletion**", "Drop a variable with too many blanks (e.g. 50%+ of marital status)", "Lose useful information (marital status predicts home buying)"],
            ["**Row deletion**", "Drop samples with blanks; OK if MCAR and few", "Loses information if MNAR; creates **bias** if MAR"],
            ["**Imputation**", "Fill with a default, or the mean/median/mode (e.g. July's median temperature)", "Adds your own bias/noise, even **leakage**. Filling “number of children” with **0** hides who simply didn't answer"],
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "There is no perfect way (slide 63)",
          text: "Deletion risks losing information or adding bias; imputation risks injecting bias, noise or leakage. Often several techniques are combined.",
        },
        {
          type: "p",
          text: "**Scaling (slides 64–66).** Age ranges 20–40 but income 10,000–150,000; a model sees only numbers and may treat the bigger one as more important. **Feature scaling** brings features to similar ranges and often boosts performance (especially gradient-boosted trees and logistic regression, per the slide). For **skewed** features use a **log transform**. Watch out: scaling needs **global statistics** (min, max, mean), so compute them on **training data only** and **reuse** them for new data, or you leak information; if new data drifts, those statistics go stale.",
        },
        {
          type: "p",
          text: "**Discretization / binning / quantization (slide 67).** Turn a continuous value into buckets so 9,000.50 and 10,000 are treated alike. Rarely used; the hard part is **boundaries** (where does exactly 1.5 go?).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Encoding categories: the Amazon brand story (slides 68–70)",
          text: "Encoding 2 million brands as numbers 0…1,999,999 worked on historical data, then **crashed in production** on an unseen brand. Adding an **UNKNOWN** bucket stopped the crash, but new brands got no traffic. Encoding only the top 99% and grouping the rest as UNKNOWN helped, until 20 new brands (luxury and knock-off alike) arrived and were all treated as unpopular. **Fix: the hashing trick** (popularised by Microsoft's **Vowpal Wabbit**): hash each category into a **fixed space**, e.g. 18 bits = 262,144 slots, so **any category, even an unseen one, gets an index**. Fixed categories such as age brackets need none of this.",
        },
        {
          type: "p",
          text: "**Feature crossing (slide 71).** Combine features to capture **non-linear** relationships, e.g. marital status × number of children for predicting house purchases. Essential for models that are bad at non-linear relationships (linear/logistic regression, tree models), but the number of features can **explode** and the model may **overfit**.",
        },
      ],
    },
    {
      id: "good",
      heading: "Lesson 6: What makes a good feature?",
      slides: "72–80",
      blocks: [
        {
          type: "p",
          text: "More features usually help at first, and the production feature list **only grows**. But too many features mean more chances for **leakage**, **overfitting**, more **memory and cost** to serve, higher **latency** for online prediction, and useless features become **technical debt** (slide 73).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Feature importance (slides 74–75)",
          text: "*How much the model's performance drops if the feature is removed.* Use built-in importance (e.g. **XGBoost**) or model-agnostic tools: **SHAP** (also gives each feature's contribution to **one specific prediction**) and **InterpretML**. A few features dominate: in Facebook's click-through model, the **top 10 features gave about half** the total importance and the **last 300 gave under 1%**.",
        },
        {
          type: "table",
          caption: "Feature generalization (slides 76–78)",
          head: ["Check", "Meaning", "Example"],
          rows: [
            ["**Useful at all?**", "Some fields never generalise", "A spam comment's **comment ID** is useless; the **user ID** of the poster might help"],
            ["**Coverage**", "% of samples with a value; very low coverage rarely generalises (unless missingness itself is informative, MNAR); big train/test coverage gaps signal different distributions", "“Number of children” known for only 1% of people"],
            ["**Value distribution**", "Values seen in training should overlap values in test", "Taxi ETA retrained weekly on Mon–Sat: **DAY_OF_WEEK** never shows Sunday in training, so it hurts; **HOUR_OF_DAY** overlaps 100% and helps"],
          ],
        },
        {
          type: "p",
          text: "**Reuse and evaluation (slides 79–80).** **Log and wait:** reuse the features the prediction service already extracted for retraining (saves compute, keeps training and serving consistent). **Feature stores** let teams share features. To judge a new feature: retrain the existing model **with one extra feature**, send a fraction of traffic to it (**A/B test**), and estimate a rough **ROI**: a feature can add value yet cost more to collect, store and maintain than it is worth.",
        },
      ],
    },
    {
      id: "store",
      heading: "Lesson 7: The feature store",
      slides: "81–94",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Definition (slide 82)",
          text: "A **feature store** is *a service that ingests large volumes of data, computes features and stores them*, giving training pipelines and online applications easy access. It is a **dual database**: an **offline store** for training (batch, history) and an **online store** for low-latency serving.",
        },
        {
          type: "table",
          caption: "Offline vs online store (slides 82–89)",
          head: ["", "Offline store", "Online store"],
          rows: [
            ["**Holds**", "Months or years of feature history", "Only the **latest** value per entity (the current state of the world)"],
            ["**Used for**", "Training; **point-in-time correct** (“time-travel”) views", "Real-time inference: one fresh feature vector at a time"],
            ["**Speed**", "Batch, scale-out", "Low latency, high throughput; usually **eventually consistent**"],
            ["**Technology**", "Hive, BigQuery, Parquet, S3, Snowflake, Redshift (extend the existing lake/warehouse to avoid silos)", "Redis, DynamoDB, Cassandra, MySQL Cluster"],
          ],
        },
        {
          type: "table",
          caption: "Five components (slides 86–93)",
          head: ["Component", "Job"],
          rows: [
            ["**Serving**", "Give training and serving the **same** feature definitions: prevents **training-serving skew**. SDKs for notebooks; a fast API for online"],
            ["**Storage**", "Offline + online layers"],
            ["**Transform**", "Manage and orchestrate jobs (Spark, Pandas) that keep features **fresh**, plus ingest externally computed values"],
            ["**Monitoring**", "“When ML breaks it's usually data”: track correctness, quality, staleness, availability, latency, error rates, job lag"],
            ["**Registry**", "The **single source of truth**: standard feature definitions and metadata, a catalog to discover, collaborate and publish; it configures ingestion, transforms and storage"],
          ],
        },
        {
          type: "p",
          text: "**What it stores and does (slide 83):** feature **definitions** (as code), feature **values** (easy to write, read and use), **serving** fast enough that expensive CPUs/GPUs never wait on I/O, and **metadata** (feature metadata helps model builders; pipeline metadata helps reliability engineers). **Two storage shapes (slide 94):** **columns** (structured, ordered, often by time: column-oriented storage) or **blobs** (unordered, unstructured bytes). Stores are often **replicated** near training compute.",
        },
      ],
    },
    {
      id: "gov",
      heading: "Lesson 8: Feature governance",
      slides: "95–108",
      blocks: [
        {
          type: "p",
          text: "Once a feature store holds mission-critical features, ad-hoc management leads to **duplicate features, inconsistent definitions, unknown origins and compliance violations** (slide 96). Governance gives shared rules for a feature's whole life.",
        },
        {
          type: "table",
          caption: "Five principles (slide 97)",
          head: ["Principle", "Meaning"],
          rows: [
            ["**Discoverability**", "Easy to find existing features → reuse, no duplicates"],
            ["**Understandability**", "Clear definitions, docs and metadata"],
            ["**Trustworthiness**", "Quality, accuracy, lineage: validated and monitored"],
            ["**Accountability**", "A named **owner** for each feature"],
            ["**Compliance**", "Privacy laws (**GDPR, CCPA**) and internal policies"],
          ],
        },
        {
          type: "table",
          caption: "Components of the framework (slides 99–107)",
          head: ["Component", "Details"],
          rows: [
            ["**Definition standards**", "Naming like `user_transaction_counts_7d` (entity_group_aggregation_window); standard data types; descriptions; tags (**PII**, experimental, finance); required metadata (owner, sources, logic, update frequency)"],
            ["**Ownership & stewardship**", "Owner keeps logic correct, monitors quality and drift, updates docs, manages access, handles retirement"],
            ["**Approval workflow**", "Proposal → review (value, does it already exist?, technical soundness, standards, performance, compliance) → approval → deployment (often via Git pull requests)"],
            ["**Lifecycle stages**", "Experimental → Staging → Production → **Deprecated** (notify users, set a date) → **Retired**"],
            ["**Access control**", "Who can define, modify, approve, consume (RBAC)"],
            ["**Versioning**", "Why: reproducibility, rollback, experimentation, audit, collaboration. What: definitions, transformation code, feature data (snapshots/time travel), feature-group schemas"],
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Doing it in practice (slide 108)",
          text: "Centralise metadata in the **registry** · manage feature definitions **as code** in Git (reviews, history, CI/CD) · **enforce policies automatically** in CI (required metadata, naming, linters) · **RBAC** · **start simple** (naming, owners, descriptions), then iterate.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "idea",
      title: "In one line",
      text: "Define features carefully, get labels cleverly, engineer and test features honestly, then share them through a governed feature store.",
    },
    {
      type: "list",
      items: [
        "**Feature definition** = code/description; **feature value** = one output (“India”).",
        "**Life-cycle:** collect → clean → define → extract → store → evaluate → train/serve → update → delete → discontinue.",
        "**Hand labels:** expensive, privacy, slow, multiplicity (fix: clear definition), lineage. **Natural labels:** clicks.",
        "**Lack of labels:** weak supervision (LFs, Snorkel) · semi-supervision (self-training, clustering, perturbation) · transfer learning (BERT, fine-tune) · active learning (uncertainty, committee).",
        "**Augmentation:** label-preserving transforms · perturbation/adversarial · synthesis (templates, MixUp).",
        "**Missing values:** MNAR / MAR / MCAR; deletion vs imputation (no perfect way).",
        "**Ops:** scaling (train statistics only; log for skew) · discretization · hashing trick for unseen categories · feature crossing (non-linear, may overfit).",
        "**Good features:** importance (SHAP), coverage, overlapping value distributions, ROI.",
        "**Feature store:** offline (history, training, time travel) + online (latest, low latency); serving, storage, transform, monitoring, registry; prevents training-serving skew.",
        "**Governance:** discoverable, understandable, trustworthy, accountable, compliant; owners, approvals, lifecycle, access, versioning.",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: methods for lack of labels with examples · missing-value types and handling · feature store architecture (online vs offline) · feature governance framework · Amazon brand / hashing trick scenario.",
    },
  ],

  glossary: [
    ["Feature", "Attribute", "Measurable property of the data used as model input"],
    ["Feature definition / value", "—", "Extraction code or description / one specific output of it"],
    ["Feature engineering", "—", "Selecting and transforming variables into model-ready features"],
    ["PCA / ICA / LDA", "Principal / Independent Component Analysis; Linear Discriminant Analysis", "Dimensionality-reduction techniques"],
    ["AutoML", "Automated machine learning", "Automates feature selection, transforms and model search"],
    ["Embedding", "—", "Learned numeric vector representing an item (e.g. a word)"],
    ["Label", "Target", "The answer the model learns to predict"],
    ["Label multiplicity", "Label ambiguity", "Several possible labels for one instance (annotator disagreement)"],
    ["Natural labels", "—", "Labels produced automatically by user behaviour (clicks)"],
    ["Weak supervision", "Programmatic labelling", "Labels from heuristic labelling functions"],
    ["LF", "Labelling function", "Code that encodes a heuristic to label data (Snorkel)"],
    ["Semi-supervision", "—", "Spreading a small set of labels using structure (self-training, clustering, perturbation)"],
    ["Transfer learning", "—", "Reusing a model trained on a base task for a downstream task"],
    ["Zero-shot / fine-tuning", "—", "Using a base model directly / continuing training on the new task"],
    ["Active learning", "Query learning", "The model selects which samples humans should label"],
    ["Query-by-committee", "—", "Label the samples on which several models disagree most"],
    ["Data augmentation", "—", "Techniques that increase the amount of training data"],
    ["Adversarial attack / augmentation", "—", "Noise that fools a model / training on such noisy samples"],
    ["DeepFool", "—", "Algorithm finding the minimum noise causing misclassification"],
    ["MixUp", "—", "Blending two samples and their labels: $x' = \\gamma x_1 + (1 - \\gamma)x_2$"],
    ["MNAR / MAR / MCAR", "Missing Not At Random / At Random / Completely At Random", "Why a value is missing: itself / another variable / no reason"],
    ["Imputation", "—", "Filling missing values (default, mean, median, mode)"],
    ["Feature scaling", "—", "Bringing features to similar ranges"],
    ["Discretization", "Binning, quantization", "Turning continuous values into buckets"],
    ["Hashing trick", "—", "Hash categories into a fixed-size index space (handles unseen values)"],
    ["Feature crossing", "—", "Combining features to model non-linear relationships"],
    ["SHAP", "SHapley Additive exPlanations", "Measures overall and per-prediction feature contributions"],
    ["Feature coverage", "—", "% of samples that have a value for a feature"],
    ["Log and wait", "—", "Reusing features extracted at prediction time for retraining"],
    ["ROI", "Return on investment", "Value of a feature vs cost to collect, store and maintain"],
    ["Feature store", "—", "Service that computes, stores and serves features (offline + online)"],
    ["Training-serving skew", "—", "Features computed differently in training and serving"],
    ["Point-in-time correct", "Time travel", "Feature values as they were at each training example's time"],
    ["Feature registry", "—", "Single source of truth for feature definitions and metadata"],
    ["PII", "Personally Identifiable Information", "Data that identifies a person"],
    ["GDPR / CCPA", "General Data Protection Regulation / California Consumer Privacy Act", "Privacy laws"],
    ["RBAC", "Role-Based Access Control", "Permissions assigned by role"],
  ],

  examTips: [
    "For ‘lack of labels’ questions, give all four methods in a table (idea, needs labels?, example) and end with which you'd pick for the scenario.",
    "For missing values: define MNAR/MAR/MCAR with the survey examples, then compare deletion and imputation with their risks.",
    "Feature store answers need the **offline vs online** table and the phrase **‘prevents training-serving skew’**.",
    "Use the lecture's stories: Amazon brands (hashing trick), taxi DAY_OF_WEEK (generalization), Facebook top-10 features (importance), 1M noisy labels (lineage).",
  ],

  theory: [
    {
      title: "Handling the lack of labels",
      marks: 5,
      question: "A hospital wants to classify patient notes as EMERGENT or not, but radiologists and doctors have little time to label, and notes cannot leave the hospital. Explain why hand labelling is difficult here and describe the techniques for handling the lack of labels. Which would you recommend?",
      solution: `
### What the examiner wants
The drawbacks of hand labels tied to the scenario, the four techniques with how they work, and a justified recommendation.

### Model answer
**Why hand labels are hard (slides 27–32):** **expensive** (needs scarce clinical experts), **privacy** (notes can't be sent to outside annotators), **slow** (slow iteration when requirements change), **label multiplicity** (doctors disagree; needs a clear definition of “emergent”), and **lineage** (mixing labels of different quality can lower accuracy).

| Technique | How it works | Needs labels? | In this hospital |
|---|---|---|---|
| **Weak supervision** | **Labelling functions** encode heuristics; combine and denoise their outputs (Snorkel) | No (a few to check LFs) | LF: note mentions *pneumonia* → EMERGENT; regex on vital signs; lookup in a dangerous-disease list; output of an existing triage system |
| **Semi-supervision** | Spread a small labelled set: self-training, clustering/kNN, perturbation | A small set | Label 500 notes, train, add high-confidence predictions, retrain |
| **Transfer learning** | Fine-tune a model pre-trained on a large text corpus | Few for fine-tuning | Fine-tune a clinical BERT on a few hundred labelled notes |
| **Active learning** | Model asks experts to label only the most uncertain notes (uncertainty sampling, query-by-committee) | Yes, targeted | Doctors label 50 uncertain notes a day instead of random ones |

\`\`\`flow
Doctors write LFs on a small cleared sample -> Apply LFs to all notes inside the hospital -> Denoise into weak labels -> Fine-tune pre-trained clinical language model -> Active learning: doctors label most uncertain notes -> Better model
\`\`\`

**Recommendation:** start with **weak supervision**: it suits **strict privacy** (experts only see a small cleared subset; LFs run on the rest without anyone looking) and turns expertise into **versioned, reusable code** (slide 37). Combine with **transfer learning** for accuracy and **active learning** to spend scarce doctor time where it matters. Train an ML model anyway, because LFs don't cover every note and the model must **generalise** beyond them.`,
    },
    {
      title: "Missing values: types and treatment",
      marks: 5,
      question: "A housing-survey dataset has missing income, age and job values, and marital status is missing for over 50% of rows. Explain the three types of missing values with these examples and discuss how to handle them.",
      solution: `
### Model answer
**Types (slides 57–59):**

| Type | Cause | Example |
|---|---|---|
| **MNAR**: missing not at random | The value itself | High earners don't disclose **income** |
| **MAR**: missing at random | Another observed variable | Respondents of gender A often skip **age** |
| **MCAR**: completely at random | No pattern (rare) | **Job** left blank by accident |

**Deletion (slides 60–61):**
- **Column deletion:** drop *marital status* (50%+ missing). Easy, but it may be **highly predictive** of buying a house (married couples are more likely to own).
- **Row deletion:** fine if values are **MCAR** and few; with **MNAR** it removes informative rows; with **MAR** it **biases** the sample (fewer gender-A respondents).

**Imputation (slide 62):** fill with a default (empty string for job) or the mean/median/mode (e.g. median temperature for July). Danger: filling *number of children* with **0** mixes “no children” with “didn't answer”. Add a “was missing” indicator, and compute fill statistics on **training data only** to avoid **leakage**.

\`\`\`flow
Find missing values -> Diagnose: MNAR, MAR or MCAR -> Few and MCAR: delete rows -> Informative missingness: impute + missing flag -> Validate model on held-out data
\`\`\`

**Conclusion (slide 63):** there is **no perfect way**: deletion risks losing information and adding bias; imputation risks injecting bias, noise or leakage. Diagnose the type first, combine techniques, and check the effect on held-out performance.`,
    },
    {
      title: "Feature store: online vs offline and its components",
      marks: 5,
      question: "A food-delivery company trains ETA models on months of history and serves predictions in milliseconds. Explain how a feature store supports both needs, its main components, and how it prevents training-serving skew.",
      solution: `
### Model answer
**Definition (slide 82):** a feature store ingests data, **computes, stores and serves features** for training pipelines and online applications, built as a **dual database**.

| | Offline store | Online store |
|---|---|---|
| Content | Months/years of history | Latest value per entity (restaurant, driver) |
| Use | Training with **point-in-time correct** views (time travel) | Real-time inference, one fresh feature vector |
| Tech | S3, BigQuery, Snowflake, Hive, Parquet | Redis, DynamoDB, Cassandra |

\`\`\`flow
Orders stream + order history -> Transform jobs (Spark/Pandas) using registry definitions -> Offline store: avg_prep_time_30d history -> Training
Transform jobs -> Online store: latest restaurant_load, driver_distance -> ETA model API in milliseconds
\`\`\`

**Components (slides 86–93):** **serving** (SDK for notebooks, low-latency API), **storage** (offline + online), **transform** (orchestrated jobs keep features fresh, e.g. \`restaurant_orders_last_15m\`), **monitoring** (staleness, availability, latency, error rates, job lag: “when ML breaks, it's usually data”), **registry** (single source of truth for definitions and metadata; catalog for reuse).

**Preventing training-serving skew (slide 87):** the **same feature definition** from the registry computes values for both stores, so a feature like *average prep time* means exactly the same at training and at serving; mismatches “cause catastrophic and hard-to-debug performance problems”. Point-in-time correctness also prevents **leakage** of future values into training.

**Extra benefits:** feature **reuse** across teams, less duplicated pipelines, governance and lineage.`,
    },
    {
      title: "Feature governance framework",
      marks: 5,
      question: "Several teams in a bank publish features to a shared feature store and are seeing duplicate and inconsistent features. Propose a feature governance framework.",
      solution: `
### Model answer
**Why (slide 96):** without rules, feature stores suffer **duplication, inconsistent definitions, unknown origins and compliance violations**.

**Principles (slide 97):** **discoverability** (find before you build), **understandability** (clear docs), **trustworthiness** (validated, monitored, lineage), **accountability** (named owner), **compliance** (GDPR/CCPA, internal policy).

**Components (slides 99–107):**
1. **Definition standards:** naming like \`customer_txn_count_7d\`; standard types; mandatory description; tags (PII, finance, experimental); required metadata (owner, source, logic, refresh frequency).
2. **Ownership:** each feature group has an owning team responsible for correctness, drift monitoring, docs, access and retirement.
3. **Approval workflow:** proposal → review (does it already exist? correct and efficient? standards? performance? compliance?) → approval → deployment, via **Git pull requests**.
4. **Lifecycle:** experimental → staging → production → deprecated (notify, set date) → retired.
5. **Access control:** RBAC, so only approved roles can see PII-tagged features.
6. **Versioning:** definitions, transformation code, data snapshots and group schemas, for reproducibility, rollback, audit.

\`\`\`flow
Propose feature in Git PR -> Automated checks: naming, metadata, linter -> Review board -> Approve -> Staging -> Production in registry -> Monitor -> Deprecate -> Retire
\`\`\`

**Implementation (slide 108):** centralise in the **registry**, features **as code** with CI/CD policy checks, RBAC, and **start simple** (names, owners, descriptions) before adding heavier workflows.`,
    },
  ],

  quiz: [
    { q: "“The customer's source country from IP lookup” is a:", options: ["Feature value", "Feature definition", "Label", "Embedding"], answer: 1, why: "The rule/code is the definition; “India” is a value (slide 7)." },
    { q: "Which feature activity uses PCA, ICA or LDA?", options: ["Feature selection", "Feature extraction", "Imputation", "Crossing"], answer: 1, why: "Dimensionality reduction (slide 11)." },
    { q: "A clicked recommendation counted as POSITIVE is an example of:", options: ["Weak supervision", "Natural labels", "Active learning", "MixUp"], answer: 1, why: "Slide 33." },
    { q: "Snorkel's labelling functions belong to:", options: ["Semi-supervision", "Weak supervision", "Transfer learning", "Active learning"], answer: 1, why: "Programmatic labelling (slide 35)." },
    { q: "Which method needs an initial set of labels and adds high-confidence predictions?", options: ["Weak supervision", "Self-training (semi-supervision)", "Hashing trick", "Augmentation"], answer: 1, why: "Slide 39." },
    { q: "Labelling the samples the model is least certain about is:", options: ["Active learning", "Transfer learning", "Perturbation", "Imputation"], answer: 0, why: "Uncertainty sampling (slide 45)." },
    { q: "High earners not disclosing income is:", options: ["MCAR", "MAR", "MNAR", "Not missing"], answer: 2, why: "Missing because of the value itself (slide 58)." },
    { q: "Why must scaling statistics come from training data only?", options: ["To save memory", "To avoid data leakage", "Because test data has no min", "It doesn't matter"], answer: 1, why: "Slide 66." },
    { q: "The hashing trick solves:", options: ["Missing values", "Unseen categories at serving time", "Overfitting", "Label noise"], answer: 1, why: "Fixed hash space for any category (slide 70)." },
    { q: "Why might DAY_OF_WEEK hurt a taxi-ETA model trained on Mon–Sat and tested on Sunday?", options: ["Low coverage", "Train and test values don't overlap", "It is a label", "It is too important"], answer: 1, why: "Slide 78." },
    { q: "Which store holds only the latest feature value per entity for low-latency inference?", options: ["Offline store", "Online store", "Registry", "Data lake"], answer: 1, why: "Slide 89." },
    { q: "The feature-store component that is the single source of truth for definitions is the:", options: ["Registry", "Online store", "Monitor", "Transform"], answer: 0, why: "Slide 93." },
    { q: "Which is NOT one of the five feature-governance principles?", options: ["Discoverability", "Accountability", "Compliance", "Maximum feature count"], answer: 3, why: "Slide 97." },
  ],
};
