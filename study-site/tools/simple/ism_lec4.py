import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Lecture 3 went **forwards**: from a cause to an effect (“if the bolt came from machine A, how likely is it defective?”). "
         "**Bayes' theorem** goes **backwards**: from the effect you saw to the cause behind it (“this bolt is defective, which machine made it?”). "
         "The same idea, applied to many features at once, is the **Naive Bayes classifier** behind spam filters. All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Bayes' theorem", "Turn $P(\\text{evidence} \\mid \\text{cause})$ into $P(\\text{cause} \\mid \\text{evidence})$.", tag="Reasoning backwards", example="A child has a rash: flu or measles?", figure="i4-flu"),
     CARD("Prior → posterior", "Start with a belief (**prior**), see evidence, update to a new belief (**posterior**).", tag="Learning from data", example="Spam rate 50% → 95% once the filter flags it"),
     CARD("Naive Bayes", "Score each class by prior × the likelihood of **each feature**, assuming the features are independent. Biggest score wins.", tag="A classifier", example="Will the player play tennis today?"),
   ),
 ]),
 SEC(2, "bayes", "Bayes' theorem: from effect back to cause", [
   P("Think of a tree. Lecture 3's **total probability** adds up every path that leads to the evidence. Bayes then asks: **what share of that total came through the path I care about?**"),
   F("Bayes' theorem", "$$P(A_i \\mid B) = \\frac{P(A_i)\\,P(B \\mid A_i)}{\\sum_j P(A_j)\\,P(B \\mid A_j)} = \\frac{\\text{this path}}{\\text{all paths to } B}$$"),
   T(["Word", "Meaning", "Flu example"],
     [["**Prior** $P(A_i)$", "Belief before the evidence", "P(flu) = 0.9"],
      ["**Likelihood** $P(B \\mid A_i)$", "How well the cause explains the evidence", "P(rash | flu) = 0.08"],
      ["**Evidence** $P(B)$", "Total probability of what you saw", "P(rash) = 0.167"],
      ["**Posterior** $P(A_i \\mid B)$", "Belief after the evidence", "P(flu | rash) = 0.431"]]),
   EX("Solved example (lecturer's Example 2): flu or measles?",
      "90% of sick children have flu, 10% measles. A rash appears in 8% of flu cases and 95% of measles cases. A child has a rash. P(flu)?\n\n"
      "**Path flu → rash:** $0.9 \\times 0.08 = 0.072$.\n**Path measles → rash:** $0.1 \\times 0.95 = 0.095$.\n"
      "**All paths:** $P(\\text{rash}) = 0.072 + 0.095 = 0.167$.\n"
      "$P(\\text{flu} \\mid \\text{rash}) = \\frac{0.072}{0.167}$"),
   ANS("0.431", "Flu dropped from 90% to 43%: the rash is strong evidence for measles (P(measles | rash) = 0.569), even though measles is rare."),
   FIG("i4-flu"),
   WARN("Rare things stay rare", "1% have a condition; the test catches 90% and false-alarms 5%. P(condition | positive) $= \\frac{0.009}{0.009 + 0.0495} = 0.154$. Most positives are false alarms, because the healthy group is so much bigger."),
 ], "4–12"),
 SEC(3, "tree", "The exam recipe: draw the tree", [
   P("Almost every Bayes question in the exam has the same shape: **groups with shares**, **a rate inside each group**, and “given the evidence, which group?”"),
   F("Four steps", "1. Branch 1: the causes with their priors (they must add to 1).\n2. Branch 2: the evidence rate under each cause.\n3. Multiply along each path; **add** the paths that end in the evidence → $P(B)$.\n4. Divide the path you want by $P(B)$."),
   EX("Solved example (lecturer's Problem 2): the bolt factory",
      "Machines A, B, C make 25%, 35%, 40% of the bolts; 5%, 4%, 2% of their bolts are defective. A random bolt is defective. Which machine made it?\n\n"
      "Paths: A $0.25 \\times 0.05 = 0.0125$; B $0.35 \\times 0.04 = 0.014$; C $0.40 \\times 0.02 = 0.008$. Total $P(D) = 0.0345$.\n"
      "$P(A \\mid D) = \\frac{0.0125}{0.0345} = 0.362$, $P(B \\mid D) = 0.406$, $P(C \\mid D) = 0.232$."),
   ANS("P(A | defective) = 0.362", "C makes the most bolts, yet it is the **least** likely culprit: its defect rate is low."),
   FIG("i4-bolt"),
   CHK("Spam is 50% of email. The filter flags 99% of spam and 5% of normal email. A flagged email: P(it is NOT spam)?", ["0.05", "0.048", "0.5", "0.01"], 1,
       "$\\frac{0.5 \\times 0.05}{0.5 \\times 0.05 + 0.5 \\times 0.99} = \\frac{0.025}{0.52} = 0.048$ (lecturer's Example 3)."),
 ], "52–66"),
 SEC(4, "map", "MAP: picking the most believable hypothesis", [
   P("In machine learning, the “causes” are **hypotheses** h (spam / not spam, plays / doesn't play) and the evidence is the **data** D. We want the hypothesis with the biggest posterior."),
   F("MAP and ML", "$$h_{MAP} = \\arg\\max_h P(D \\mid h)\\,P(h)$$ $P(D)$ is the same for every h, so drop it when **comparing**. If all priors are equal, this becomes $h_{ML} = \\arg\\max_h P(D \\mid h)$."),
   EX("Solved example (lecturer's Example 4): play when sunny?",
      "14 days: Sunny had Yes 3, No 2. Overall Yes 9, No 5.\n"
      "Yes: $P(\\text{Sunny} \\mid \\text{Yes})P(\\text{Yes}) = \\frac{3}{9} \\cdot \\frac{9}{14} = \\frac{3}{14}$. No: $\\frac{2}{5} \\cdot \\frac{5}{14} = \\frac{2}{14}$.\n"
      "Divide each by $P(\\text{Sunny}) = 5/14$ → 0.60 vs 0.40."),
   ANS("Plays (0.60 > 0.40)"),
 ], "13–20"),
 SEC(5, "nb", "Naive Bayes: many features at once", [
   P("With several features $x_1, \\dots, x_n$, the likelihood $P(x_1, \\dots, x_n \\mid h)$ needs far too much data to estimate. The **naive** trick: assume the features are **independent within each class**, so the likelihood is just a product of one-feature fractions you can count from a table."),
   F("Naive Bayes rule", "$$\\text{score}(c) = P(c) \\prod_i P(x_i \\mid c) \\qquad \\text{predict the class with the highest score}$$"),
   EX("Solved example (lecturer's Example 5): play tennis?",
      "Today: Outlook Sunny, Temp Hot, Humidity Normal, Windy False. Read each fraction from the 14-day table.\n\n"
      "**Yes:** $\\frac{3}{9} \\cdot \\frac{2}{9} \\cdot \\frac{6}{9} \\cdot \\frac{6}{9} \\cdot \\frac{9}{14} = 0.0212$\n"
      "**No:** $\\frac{2}{5} \\cdot \\frac{2}{5} \\cdot \\frac{1}{5} \\cdot \\frac{2}{5} \\cdot \\frac{5}{14} = 0.0046$"),
   ANS("Yes: the player will play", "You only need to compare the scores. Dividing both by P(X) (as the slide does) turns them into 0.726 and 0.157 but doesn't change the winner."),
   TIP("Table habit", "For each feature, write the fraction as **count of (feature value AND class) ÷ count of class**. The denominator is the class total (9 Yes, 5 No), not 14."),
 ], "19–29"),
 SEC(6, "laplace", "Zero counts and Laplace smoothing (text classification)", [
   P("If a word never appeared in spam during training, $P(\\text{word} \\mid \\text{spam}) = 0$, and one zero wipes out the whole product, however spammy the other words are. **Laplace smoothing** adds 1 to every count so nothing is ever exactly 0."),
   F("Laplace smoothing", "$$P(w \\mid c) = \\frac{\\text{count}(w, c) + 1}{\\text{total words in } c + |V|} \\qquad |V| = \\text{number of distinct words in all training text}$$"),
   EX("Solved example (lecturer's slides 30–35): sports or not?",
      "Training: “A great game” (S), “The election was over” (N), “Very clean match” (S), “A clean but forgettable game” (S), “It was a close election” (N). Classify **“A very close game”**.\n\n"
      "Sports has 11 words, Not-sports 9, vocabulary $|V| = 14$. Priors 3/5 and 2/5.\n"
      "**Sports:** a $\\frac{2+1}{25}$, very $\\frac{1+1}{25}$, close $\\frac{0+1}{25}$, game $\\frac{2+1}{25}$ → $\\frac{3 \\cdot 2 \\cdot 1 \\cdot 3}{25^4} \\cdot \\frac{3}{5} = 2.76 \\times 10^{-5}$\n"
      "**Not sports:** $\\frac{2 \\cdot 1 \\cdot 2 \\cdot 1}{23^4} \\cdot \\frac{2}{5} = 0.57 \\times 10^{-5}$"),
   ANS("Sports", "Without smoothing, “close” (0 times in Sports) would make the Sports score exactly 0."),
   CHK("Class c has 20 words; the vocabulary has 10 words; “goal” appears 3 times in c. Smoothed P(goal | c)?", ["3/20", "4/30", "4/20", "3/30"], 1, "$(3 + 1)/(20 + 10) = 4/30$."),
 ], "30–48"),
 SEC(7, "test", "Test your understanding", [
   CHK("In Bayes' theorem the denominator P(B) is found using…", ["the complement rule", "the law of total probability", "independence", "the MLE"], 1, "Add up every path that leads to B."),
   CHK("Machine 1 makes 70% (2% defective), machine 2 makes 30% (5% defective). A defective item: P(machine 2)?", ["0.30", "0.517", "0.05", "0.483"], 1,
       "Paths 0.014 and 0.015 → $0.015/0.029 = 0.517$."),
   CHK("Why is Naive Bayes called “naive”?", ["It ignores priors", "It assumes features are independent given the class", "It uses only one feature", "It never smooths"], 1, "That assumption is rarely exactly true, but it works surprisingly well."),
 ]),
 SEC(8, "remember", "What to remember for your exam", [
   REM("- **Bayes = this path ÷ all paths** on the tree. The denominator is total probability.\n"
       "- **Prior × likelihood → posterior.** A rare cause stays fairly unlikely even after a positive test.\n"
       "- **MAP:** $\\arg\\max P(D \\mid h)P(h)$; drop $P(D)$ when comparing. Equal priors → ML.\n"
       "- **Naive Bayes:** prior × product of per-feature fractions; each fraction's denominator is the **class count**.\n"
       "- **Laplace:** $\\frac{\\text{count} + 1}{\\text{class words} + |V|}$ so no zero kills the product."),
 ]),
]

write("data/ism/lec4.js", INTRO, SECTIONS)
