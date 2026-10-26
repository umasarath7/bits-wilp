import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Probability is a number from 0 (impossible) to 1 (certain) that measures how likely something is. This lecture gives you the "
         "vocabulary (experiments, outcomes, events), three ways to get a probability, and the two rules you'll use in every later lecture: "
         "the **addition rule** for “A or B” and the **complement rule** for “not A” / “at least one”. All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Sample space", "The list of **every** possible outcome of an experiment, written S.", tag="All that can happen", example="Two dice: 36 outcomes, (1,1) to (6,6).", figure="i2-dice"),
     CARD("Event", "A **set of outcomes** you care about, written A, B, ….", tag="What you're asking about", example="“The sum is more than 8.”"),
     CARD("Combining events", "**Or** (union ∪), **and** (intersection ∩), **not** (complement $A^c$). Draw a Venn diagram!", tag="And / or / not", figure="i2-venn"),
   ),
 ]),
 SEC(2, "vocab", "Experiments, outcomes and events", [
   T(["Word", "Meaning", "Example (one die)"],
     [["Random experiment", "An action with an uncertain result", "Roll a die"],
      ["Sample space S", "All possible outcomes", "{1, 2, 3, 4, 5, 6}"],
      ["Event", "Some of the outcomes", "Even = {2, 4, 6}"],
      ["Complement $A^c$", "Everything **not** in A", "Odd = {1, 3, 5}"],
      ["Union $A \\cup B$", "A **or** B (or both)", "Even or > 4 = {2, 4, 5, 6}"],
      ["Intersection $A \\cap B$", "A **and** B", "Even and > 4 = {6}"],
      ["Mutually exclusive", "Can't happen together: $A \\cap B = \\emptyset$", "“1” and “6” on one roll"],
      ["Exhaustive", "Together they cover all of S", "Even, odd"]]),
 ], "6–14"),
 SEC(3, "define", "Three ways to get a probability", [
   T(["Approach", "Formula / idea", "Use when"],
     [["**Classical**", "$P(A) = \\frac{\\text{favourable outcomes}}{\\text{total outcomes}}$", "Outcomes are equally likely (fair coin, die, random pick)"],
      ["**Empirical**", "$P(A) = \\frac{\\text{times it happened}}{\\text{total trials}}$", "You have past data"],
      ["**Axiomatic**", "Rules every probability must obey (below)", "Checking whether numbers are valid"]]),
   F("The three axioms", "1. $P(S) = 1$ (something must happen).\n2. $0 \\le P(A) \\le 1$.\n3. If A and B can't happen together: $P(A \\cup B) = P(A) + P(B)$."),
   CHK("Four outcomes are assigned 0.31, 0.27, 0.28, 0.16. Is this a valid probability assignment?", ["Yes", "No, the sum is 1.02", "No, one is negative", "Only if they're independent"], 1,
       "They must add to exactly 1; these add to 1.02 (lecturer's Example 1b)."),
 ], "15–23"),
 SEC(4, "add", "“A or B”: the addition rule", [
   P("Adding $P(A) + P(B)$ counts the overlap (outcomes in **both**) twice, so subtract it once."),
   F("Addition rule", "$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$ If A and B are mutually exclusive (no overlap): $P(A \\cup B) = P(A) + P(B)$."),
   F("Complement rule", "$$P(\\text{not } A) = 1 - P(A)$$ Use it whenever the question says **“at least one”**, **“neither”** or **“not”**: the opposite event is often much shorter to count."),
   EX("Solved example (lecturer's Example 2): two dice",
      "Throw two dice (36 equally likely outcomes). What is the probability the sum is **neither 7 nor 11**?\n\n"
      "Sum 7 happens 6 ways, sum 11 happens 2 ways, and they can't both happen → $P(7 \\text{ or } 11) = \\frac{6 + 2}{36} = \\frac{8}{36}$.\n"
      "Complement: $P(\\text{neither}) = 1 - \\frac{8}{36} = \\frac{28}{36}$."),
   ANS("7/9 ≈ 0.778", "Far quicker than counting the 28 remaining outcomes one by one."),
   EX("Lecturer's Example 3: run the rule backwards",
      "P(pass Statistics) = 2/3, P(**not** pass Maths) = 5/9, P(pass at least one) = 4/5. Find P(pass both).\n"
      "P(pass Maths) $= 1 - 5/9 = 4/9$. Addition rule: $\\frac{4}{5} = \\frac{2}{3} + \\frac{4}{9} - P(\\text{both})$ → $P(\\text{both}) = \\frac{14}{45}$."),
   FIG("i2-exam"),
   CHK("75% hold annuities, 45% hold stocks, 85% hold at least one. What % hold both?", ["30%", "35%", "40%", "120%"], 1, "$0.75 + 0.45 - 0.85 = 0.35$ (lecturer's Example 4)."),
 ], "19–34"),
 SEC(5, "indep", "Independent vs mutually exclusive (the classic trap)", [
   T(["", "Mutually exclusive", "Independent"],
     [["Meaning", "**Can't both happen**", "One happening **doesn't change** the chance of the other"],
      ["Test", "$P(A \\cap B) = 0$", "$P(A \\cap B) = P(A)\\,P(B)$"],
      ["Example", "One die shows 1 and shows 6", "Coin heads and die shows 6"]]),
   WARN("They are NOT the same", "If two events are mutually exclusive (and both possible), they are **dependent**: knowing one happened tells you the other **didn't**."),
   EX("Lecturer's Example 7", "Throw a die twice. A = {max is 2}: 3 outcomes; B = {min is 2}: 9 outcomes; A and B = {(2,2)}: 1 outcome. $P(A)P(B) = \\frac{3}{36} \\cdot \\frac{9}{36} = \\frac{27}{1296} \\ne \\frac{1}{36}$ → **dependent**."),
 ], "21–22, 35"),
 SEC(6, "count", "Counting equally likely outcomes", [
   F("Combinations", "$$^nC_r = \\frac{n!}{r!\\,(n - r)!} \\qquad \\text{(ways to choose r items from n when order doesn't matter)}$$"),
   EX("Lecturer's Example 9: a committee", "Choose 5 people from 8 men and 4 women. P(majority are women)? Majority = 4W + 1M or 3W + 2M.\n"
      "$P = \\frac{^8C_1 \\cdot {}^4C_4 + {}^8C_2 \\cdot {}^4C_3}{^{12}C_5} = \\frac{8 + 112}{792} = \\frac{120}{792}$"),
   ANS("5/33 ≈ 0.152"),
 ], "36–41"),
 SEC(7, "test", "Test your understanding", [
   CHK("P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.2. P(A or B)?", ["0.9", "0.7", "0.2", "0.1"], 1, "$0.5 + 0.4 - 0.2 = 0.7$."),
   CHK("A and B are independent with P(A) = 0.6, P(B) = 0.5. P(A and B)?", ["1.1", "0.3", "0.1", "0.5"], 1, "Independent → multiply: 0.3."),
   CHK("P(at least one head in 3 coin tosses)?", ["1/8", "3/8", "7/8", "1/2"], 2, "Complement: $1 - P(\\text{no heads}) = 1 - \\frac{1}{8} = \\frac{7}{8}$."),
 ]),
 SEC(8, "remember", "What to remember for your exam", [
   REM("- Probabilities live in [0, 1] and all outcomes sum to 1.\n"
       "- **Or:** $P(A) + P(B) - P(A \\cap B)$. **Not / at least one:** $1 - P(\\text{opposite})$.\n"
       "- **Independent:** $P(A \\cap B) = P(A)P(B)$. **Mutually exclusive:** $P(A \\cap B) = 0$. Not the same thing!\n"
       "- Equally likely + choosing groups → combinations $^nC_r$."),
 ]),
]

write("data/ism/lec2.js", INTRO, SECTIONS)
