import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("A model is like a chef who can only taste what you put on the plate. **Features** are the ingredients you choose and prepare; **labels** are the "
         "answers you teach it with. This lecture covers how to pick and prepare ingredients (feature engineering), how to get answers when labelling is costly, "
         "how to make extra training data, and how big companies keep features organised and shared (the **feature store**) under clear rules (**governance**).")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Features", "The prepared inputs a model learns from.", tag="Ingredients", example="temperature, humidity, pressure (not the record ID!)"),
     CARD("Labels", "The correct answers for training, often the most expensive part.", tag="Answer key", example="spam / not spam; house price"),
     CARD("Feature store", "One shared, governed shelf of features for training **and** serving.", tag="The pantry", example="Offline history + online latest values"),
   ),
 ]),
 SEC(2, "def", "Feature definition vs feature value", [
   T(["", "Meaning", "Example"],
     [["**Feature definition**", "The **recipe** (code) for extracting it", "“Country from the customer's IP address”"],
      ["**Feature value**", "One **result** of the recipe", "“India”"]]),
   P("**Who invents features?** Humans (domain knowledge, can imagine **new** data to collect, spot bias) or algorithms (AutoML, **embeddings**: “cat” → [0.2, 0.8, 0.1]), which are fast but only find what's already in the data."),
   P("```flow\nCollect -> Clean -> Define -> Extract -> Store -> Evaluate -> Train and serve -> Update -> Delete values -> Retire\n```"),
 ], "4–22"),
 SEC(3, "labels", "Labels: why they're hard and five ways around it", [
   T(["Problem with hand labels", "Picture"],
     [["**Expensive**", "Spam: anyone. X-rays: a radiologist"], ["**Privacy**", "Patient data can't leave the hospital"],
      ["**Slow**", "Speech transcription can take 400× the audio length"], ["**Disagreement**", "Is this film a comedy or a family drama?"],
      ["**Mixed quality**", "Adding 1M cheap labels made a model **worse**: track where labels came from (lineage)"]]),
   T(["Way around", "One-line idea", "Example"],
     [["**Natural labels**", "Behaviour labels itself", "Click = good recommendation"],
      ["**Weak supervision**", "Rules write the labels (Snorkel)", "Note says ‘pneumonia’ → EMERGENT"],
      ["**Semi-supervision**", "A few labels spread to the rest", "Train, add confident guesses, retrain"],
      ["**Transfer learning**", "Borrow an already-trained brain", "Fine-tune BERT"],
      ["**Active learning**", "The model asks for the labels it needs", "Label only the most uncertain samples"]]),
   REM("**W**eak, **S**emi, **T**ransfer, **A**ctive: “**W**e **S**hare **T**rained **A**nswers.”"),
   CHK("A model picks the 100 emails it is least sure about and asks humans to label only those. This is…", ["Weak supervision", "Active learning", "Transfer learning", "Augmentation"], 1, "The model queries the most useful samples."),
 ], "23–46"),
 SEC(4, "aug", "Augmentation: more data from the data you have", [
   T(["Type", "Simple idea", "Example"],
     [["**Label-preserving**", "Change it, meaning stays", "A rotated dog photo is still a dog; swap a word for a synonym"],
      ["**Perturbation**", "Add a little noise", "Noisy images make the model tougher against attacks"],
      ["**Synthesis**", "Create new samples", "“Find me a [CUISINE] restaurant near [LOCATION]”; **MixUp** blends a dog and cat image 70/30"]]),
 ], "47–54"),
 SEC(5, "ops", "Everyday feature operations", [
   T(["Missing type", "Why missing", "Survey example"],
     [["**MNAR**", "Because of the value itself", "Rich people hide income"],
      ["**MAR**", "Because of another column", "One gender skips age"],
      ["**MCAR**", "No reason (rare)", "Job field forgotten"]]),
   P("**Fix by deleting** (columns or rows: may lose information or add bias) or **imputing** (default/mean/median: may add bias). Never fill “children” with 0, because then you can't tell “none” from “didn't say”. **No method is perfect.**"),
   T(["Operation", "Why", "Watch out"],
     [["**Scaling**", "Age 20–40 vs income 10k–150k shouldn't look unequal", "Use **training** min/max only (else leakage); log for skewed data"],
      ["**Binning**", "Treat 9,000.50 like 10,000", "Boundaries"],
      ["**Hashing trick**", "New brands appear daily; hash them into fixed slots (2¹⁸ = 262,144)", "Collisions are rare but possible"],
      ["**Feature crossing**", "Marital status × children captures combinations", "Too many features → overfitting"]]),
   EX("The Amazon brand story", "Brands numbered 0…2 million → **crash** on a new brand → UNKNOWN bucket → new brands get no traffic → top-99% + UNKNOWN → 20 new brands all treated alike → **hashing trick** fixes it."),
   CHK("Values are missing because high earners refuse to report income. Type?", ["MCAR", "MAR", "MNAR", "None"], 2, "Missing because of the value itself."),
 ], "55–71"),
 SEC(6, "good", "Good features: important, general, worth the cost", [
   L("**Importance:** how much worse the model gets without it (SHAP, XGBoost). At Facebook the top 10 features gave half the importance; the last 300 under 1%.",
     "**Generalises:** a comment's ID is useless; values seen in training must also appear in real use (Sunday never in training → DAY_OF_WEEK hurts).",
     "**Coverage:** a feature known for only 1% of people rarely helps.",
     "**Worth it:** A/B test the model with one new feature and estimate the **ROI** (value vs cost)."),
   WARN("Too many features", "More leakage risk, overfitting, memory/cost, slower predictions, and technical debt."),
 ], "72–80"),
 SEC(7, "store", "The feature store: a shared pantry", [
   T(["", "Offline store", "Online store"],
     [["Like…", "The warehouse of past stock", "The counter with today's fresh items"],
      ["Holds", "Years of history", "Only the latest value"],
      ["For", "Training (point-in-time correct)", "Live predictions in milliseconds"],
      ["Tech", "S3, BigQuery, Snowflake", "Redis, DynamoDB, Cassandra"]]),
   P("Five parts: **serving, storage, transform, monitoring, registry** (the single source of truth). The big win: training and serving use the **same definitions**, so there's no **training-serving skew**."),
   CHK("A fraud model needs a customer's latest transaction count within 20 ms. Which store?", ["Offline store", "Online store", "Data lake", "Registry"], 1, "Low-latency latest values live in the online store."),
 ], "81–94"),
 SEC(8, "gov", "Governance: rules for the pantry", [
   P("Without rules: duplicate features, conflicting definitions, unknown origins, privacy violations."),
   REM("Five principles: **D**iscoverable, **U**nderstandable, **T**rustworthy, **A**ccountable, **C**ompliant (“**DUTAC**”)."),
   P("```flow\nPropose in Git -> Automatic checks -> Review -> Approve -> Staging -> Production -> Deprecated -> Retired\n```"),
   P("Plus: naming like `user_transaction_counts_7d`, a named **owner** for every feature, tags like **PII**, role-based access, and versioning. **Start simple**, then grow."),
 ], "95–108"),
 SEC(9, "remember", "What to remember for your exam", [
   REM("- **Definition** = recipe; **value** = one result.\n"
       "- **Labels:** expensive, private, slow, disputed. Fixes: natural, weak, semi, transfer, active.\n"
       "- **Augment:** transform, perturb, synthesise (MixUp).\n"
       "- **Missing:** MNAR / MAR / MCAR; delete or impute, never perfect.\n"
       "- **Scale with training statistics; hash unseen categories; cross for combinations.**\n"
       "- **Feature store:** offline (history) + online (latest); same definitions → no skew.\n"
       "- **Governance:** DUTAC, owners, approval, lifecycle, versioning."),
 ]),
]

write("data/dmml/l11.js", INTRO, SECTIONS)
