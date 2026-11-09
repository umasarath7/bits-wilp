import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Imagine a cook testing 200 versions of a recipe: a pinch more salt here, a different oven there. If they never write anything down, they'll "
         "never know which version won the competition, or be able to make it again. ML teams face the same problem. This lecture teaches the **lab notebook** "
         "of ML: how to run experiments properly, what **metadata** (notes about data, models and runs) to keep, where to keep it, and how to manage the "
         "winning models in a **model registry**.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Experiment properly", "Split data fairly; change one thing at a time.", tag="Test", example="k-fold cross-validation"),
     CARD("Write everything down", "Metadata: which data, code, settings, environment and results.", tag="Lab notebook", example="git SHA + data hash + hyperparameters"),
     CARD("Manage the winners", "A model registry stores chosen models with versions and stages.", tag="Trophy cabinet", example="MLflow: staging → production"),
   ),
 ]),
 SEC(2, "split", "Splitting data: practice, mock exam, final exam", [
   T(["Set", "Like…"], [["**Training**", "Textbook practice problems"], ["**Validation**", "Mock exams for choosing settings"], ["**Test**", "The final exam, seen only once"]]),
   T(["Method", "Simple idea"],
     [["**k-fold**", "Cut data into k pieces; each piece takes a turn as the test; average the k scores"],
      ["**LOOCV**", "Leave out one row at a time (very slow)"],
      ["**Leave-p-out**", "Leave out every group of p rows (explodes in cost)"],
      ["**Shuffle split**", "Shuffle and split randomly a few times (seeded)"]]),
   CHK("Data split into 5 parts; train on 4, test on 1, repeat 5 times and average. This is…", ["Hold-out", "5-fold cross-validation", "LOOCV", "Bootstrapping"], 1, "k-fold with k = 5."),
 ], "4–14"),
 SEC(3, "exp", "Four kinds of experiment", [
   T(["Change…", "Keep fixed", "Name"],
     [["The model", "Data", "**Model selection**"], ["The features", "Model", "**Feature engineering**"],
      ["The settings (learning rate…)", "Model", "**Hyperparameter tuning**"], ["The data (more, varied)", "Model", "**Data augmentation**"]]),
   P("**Searching settings:** grid (try all), random (try some), Bayesian (smart guessing), Hyperband (drop the worst half each round), genetic (keep the fittest)."),
   REM("**Parameters** are learned; **hyperparameters** are chosen before training."),
 ], "15–21"),
 SEC(4, "valid", "Six pillars of model validation", [
   T(["Pillar", "Question"],
     [["Conceptual soundness", "Does it make sense?"], ["Data quality", "Can we trust the training data?"], ["Process verification", "Was it built and deployed correctly?"],
      ["Outcomes analysis", "Does it perform, and stay fair?"], ["Ongoing monitoring", "Is it still healthy?"], ["Governance", "Who is accountable?"]]),
   REM("“**C**an **D**ata **P**rove **O**ur **M**odel's **G**oodness?”"),
 ], "22–29"),
 SEC(5, "meta", "Metadata: the label on the jar", [
   P("A photo stores its camera, date and place. A book has a title page and contents. That information *about* the thing is **metadata**."),
   T(["Type", "Tells you…", "Example"],
     [["Descriptive", "What is it?", "Title, keywords"], ["Structural", "How is it organised?", "Table schema, keys"],
      ["Administrative", "Who may use it, when made?", "Access rights, dates"], ["Technical", "What format, where?", "File type, location, encryption"],
      ["Statistical", "How was it produced?", "Sampling method"]]),
   P("**For ML, record for every model:**"),
   P("```flow\nWhich Data: hash -> Which Code: git SHA -> Which Settings: hyperparameters -> Which Environment: Dockerfile -> Which Results: metrics\n```"),
   REM("**D-C-S-E-R**: Data, Code, Settings, Environment, Results. With these five, any model can be rebuilt."),
   P("Also: labels' **source and confidence**, features' **owner and use restrictions**, pipelines' **cached outputs** (tools like MLMD in TFX record them automatically)."),
 ], "30–47"),
 SEC(6, "where", "Where does metadata live?", [
   T(["", "One big system", "Several small systems"],
     [["Good", "Easy to analyse everything together", "Simple, independent, one outage doesn't stop all"],
      ["Bad", "Hard to design; one outage hurts everyone", "Hard to join; need shared IDs"]]),
   WARN("Golden rule", "Metadata systems must never be in the **live path** of training or serving."),
   T(["Option", "Like…"], [["**Build**", "Cooking at home: exactly how you like it, but you do all the work"], ["**Open source**", "A free community kitchen: ready, but you clean up"], ["**Buy**", "A restaurant: easy, but you pay and depend on them"]]),
   P("**Repository** = shelf · **registry** = a checkpoint list of important items · **store** = a shop where you browse and compare. Pipeline-first (MLMD) vs model-first (MLflow, Neptune)."),
 ], "48–60"),
 SEC(7, "lin", "Lineage: forward, backward, sideways", [
   T(["Direction", "Answers"], [["**Forward**", "If I change this, what is affected downstream?"], ["**Backward**", "Where did this number come from?"], ["**Horizontal**", "How does data flow across systems?"]]),
   P("Metadata management is the whole library catalogue; **lineage** is one special part of it: each item's travel history."),
 ], "61–66"),
 SEC(8, "track", "Experiment tracking", [
   P("Runs scattered across a laptop, Colab and the cloud → nobody knows which was best. **Experiment tracking** logs every run into **one place**: database + dashboard + client library."),
   T(["Way", "Verdict"],
     [["Spreadsheet", "Fine alone, breaks in a team"], ["Git", "Not built for ML: can't compare many runs, no live view"], ["**Tracking tool**", "Built for it ✓"]]),
   T(["Tool", "Remember it as…"],
     [["**MLflow**", "Tracking + a registry with stages"], ["**W&B**", "Pretty charts + hyperparameter sweeps"], ["**Comet**", "Real-time + Git snapshots"],
      ["**Neptune**", "Flexible nested metadata"], ["**DVC**", "Git for data"], ["**DagsHub**", "GitHub for ML (Git + DVC + MLflow)"]]),
   CHK("Which approach CANNOT show experiments live while they run?", ["W&B", "MLflow", "Committing results to Git after each run", "Comet"], 2, "Git only stores results after the run finishes."),
 ], "67–92"),
 SEC(9, "reg", "The model registry: the trophy cabinet", [
   P("Operations asks: *How do I use this model? Was it tested? What does it depend on? Which version is best?* The **registry** answers, for every model version."),
   P("```flow\nMany experiment runs -> Register best model v3 -> Staging: tests, fairness, approval -> Production -> Monitor -> Retrain v4 or roll back to v3\n```"),
   T(["Term", "Simple meaning"], [["Model repository", "A folder of model files"], ["**Model registry**", "Versions + stages + approvals + docs"], ["Model store", "Registry offered as a service, plus more"]]),
   T(["MLOps level", "Registry use"], [["0", "Humans register and deploy by hand"], ["1", "Pipeline registers models automatically (continuous training)"], ["2", "Plus CI/CD and automatic promotion"]]),
 ], "93–118"),
 SEC(10, "remember", "What to remember for your exam", [
   REM("- **Split:** train / validation / test; k-fold, LOOCV, shuffle split.\n"
       "- **4 experiments:** model, features, hyperparameters, data.\n"
       "- **Validation pillars:** “Can Data Prove Our Model's Goodness?”\n"
       "- **Metadata:** 5 types; for models record **D-C-S-E-R**.\n"
       "- **Systems:** one vs many; never in the live path; build / open source / buy.\n"
       "- **Tracking:** one place for all runs; MLflow, W&B, Comet, Neptune, DVC, DagsHub.\n"
       "- **Registry:** versions, stages, approvals; MLOps levels 0/1/2."),
 ]),
]

write("data/dmml/l12.js", INTRO, SECTIONS)
