"""Insert { type: "diagram", name } blocks after the block containing an anchor phrase.
Idempotent: skips a figure that is already placed in the file."""
import re, sys

PLACE = {
 "data/aml/session1.js": [("s1-threshold", "The tumour example shows how simple"),
                          ("s1-types", "Summary: the type of feedback decides"),
                          ("s1-rl", "It's how you train a dog with treats"),
                          ("s1-fits", "Student A is **overfitting**"),
                          ("s1-ucurve", "Now look back at the speech-recognition table")],
 "data/aml/session2.js": [("s2-ladder", "The four types. Each type has all the properties"),
                          ("s2-curse", "**An intuition.** Scatter 100 points"),
                          ("s2-pca", "**How PCA works, intuitively.**"),
                          ("s2-meanmedian", "A small startup's monthly salaries"),
                          ("s2-boxplot", "**Box plot** (slide 74)"),
                          ("s2-distance", "Notice Manhattan ≥ Euclidean ≥ Supremum"),
                          ("s2-cosine", "**Cosine similarity.** Represent each document"),
                          ("s2-corr", "correlation = 0 means “no linear relationship”")],
 "data/aml/session3.js": [("s3-ova", "**One-vs-One (OvO).** Train one classifier"),
                          ("s3-confusion", "There are 40 frauds. The model catches 30"),
                          ("s3-threshold", "**Every threshold gives a different confusion matrix.**"),
                          ("s3-roc", "**AUC, the Area Under the ROC Curve (slide 20),**")],
 "data/aml/session4.js": [("s4-residuals", "**Step 1, the means:**"),
                          ("s4-bowl", "A **contour plot** (slide 24)"),
                          ("s4-lr", "Overshoots the minimum; may **oscillate**"),
                          ("s4-poly", "Follows the underlying sine shape nicely"),
                          ("s4-archery", "**An analogy: archery.**")],
 "data/aml/session5.js": [("s5-linearfail", "**One far-away point wrecks it.**"),
                          ("s5-sigmoid", "Running example: will the student pass?"),
                          ("s5-boundary", "**Curved boundaries (slide 9).**"),
                          ("s5-logloss", "Feel the numbers (y = 1)")],
 "data/aml/session6.js": [("s6-gendisc", "**Discriminative:** don't model the fruits"),
                          ("s6-tree", "Why the prior matters so much: a medical test"),
                          ("s6-gauss", 'title: "Gaussian likelihood"')],
 "data/aml/session7.js": [("s7-margin", "**Support vectors (slides 9–10).**"),
                          ("s7-slack", "Exactly on the decision boundary"),
                          ("s7-lift", "**The idea: lift the data into more dimensions.**"),
                          ("s7-xor", "Recipe 2: non-separable data (XOR, PYQ Q5)")],
 "data/aml/exam-summary.js": [("s3-confusion", "Layout (rows = actual, columns = predicted)"),
                              ("s4-residuals", "Interpret the slope in words"),
                              ("s7-margin", "**Linear SVM by hand:**"),
                              ("s7-xor", "**XOR (PYQ 5):**")],
 "data/dmml/l1.js": [("d1-models", "Comparison of data models (slide 26)"),
                     ("d1-graph", "Built around a **graph**"),
                     ("d1-rowcol", "Which layout suits which question?"),
                     ("d1-cube", "**Pivot (rotate):**")],
 "data/dmml/l2.js": [("d2-liability", "**Connection removal (recommended).**"),
                     ("d2-components", "Guardrails against **unauthorised access")],
 "data/dmml/l3.js": [("d3-central", "**Hybrid (slides 11–12).**"),
                     ("d3-starsnow", "like the arms of a snowflake"),
                     ("d3-mesh", "changes **who owns** the data")],
 "data/dmml/l4.js": [("d4-modes", "Before we look at pipelines as a whole"),
                     ("d4-compat", "Rolling upgrades need **both**."),
                     ("d4-broker", "Why a retailer loves a broker"),
                     ("d4-tdsmds", "TDS vs MDS (slide 39): the core of PYQ Q4")],
 "data/dmml/l5.js": [("d5-consistency", "**Eventual consistency:** writes are confirmed quickly"),
                     ("d5-storage", "Storage systems (slides 27–45)"),
                     ("d5-reverse", "**Reverse ETL (slides 46–50).**"),
                     ("d5-stack", "It's only a **tiny part**")],
 "data/dmml/l6.js": [("d6-cycle", "**The phases are not strictly sequential**"),
                     ("d6-drift", "When either is detected, the alarm manager"),
                     ("d6-deploy", "**Zero user risk**"),
                     ("d6-federated", "**Federated learning in one sentence:**")],
 "data/dmml/l7.js": [("d7-partitions", "**Topics and partitions (slides 41–43).**"),
                     ("d7-queuestream", "Queue vs stream in one line"),
                     ("d7-late", "Set a **cut-off time (watermark)**")],
 "data/dmml/l8.js": [("d8-selection", "The three sub-types of selection bias"),
                     ("d8-leak", "A loan-default model using"),
                     ("d8-psi", "A feature's training distribution over 4 bins")],
 "data/dmml/exam-summary.js": [("d3-lambda", "**Lambda:** batch (cold) + speed (hot) + serving"),
                               ("d8-selection", "PYQ Q6 skeleton (selection bias)")],
}

def block_end(lines, i):
    """Given the index of the line holding the anchor, return the index of the line that closes its block."""
    ln = lines[i]
    if re.match(r"^ {8}\{ type:", ln) and ln.rstrip().endswith("},"):
        return i
    for j in range(i, len(lines)):
        if lines[j].rstrip() == "        },":
            return j
    raise SystemExit("no block end")

for path, items in PLACE.items():
    src = open(path).read()
    for name, anchor in items:
        if f'name: "{name}"' in src:
            continue
        pos = src.find(anchor)
        if pos < 0:
            sys.exit(f"anchor not found in {path}: {anchor}")
        lines = src.split("\n")
        li = src[:pos].count("\n")
        # the anchor must sit inside a notes block (8-space indentation level or deeper)
        e = block_end(lines, li)
        lines.insert(e + 1, f'        {{ type: "diagram", name: "{name}" }},')
        src = "\n".join(lines)
    open(path, "w").write(src)
    print("placed", path)
