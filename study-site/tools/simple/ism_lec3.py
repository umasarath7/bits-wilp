import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Probabilities change when you **learn something**. Knowing it's cloudy raises the chance of rain. This lecture gives you four tools: "
         "**conditional probability** (the chance of A once you know B happened), the **multiplication rule** (“A and then B”), "
         "**independence** (when learning B changes nothing) and the **law of total probability** (split a hard question into easy cases). "
         "All examples are the lecturer's own.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Conditional probability", "Once you know B happened, **B becomes your whole world**. Ask: what fraction of B is also A?", tag="“Given that…”", example="P(MasterCard | has Visa) = 0.5", figure="i3-cond"),
     CARD("Independence", "Learning B **doesn't change** the chance of A, so probabilities simply multiply.", tag="Information that doesn't matter", example="Coin toss and a die roll"),
     CARD("Total probability", "Split the population into cases, find the chance **within each case**, then combine with a weighted average.", tag="Divide and conquer", example="Gas station: P(fills tank) = 0.455", figure="i3-tree"),
   ),
 ]),
 SEC(2, "cond", "Conditional probability: shrink the world", [
   P("$P(A \\mid B)$ is read “the probability of A **given** B”. The bar means *we already know B happened*, so outcomes outside B are no longer possible. Among what remains (B), what share is also A?"),
   FIG("i3-cond"),
   F("Formula", "$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} \\qquad (P(B) > 0)$$ The overlap divided by the new “world” B."),
   EX("Solved example (lecturer's Example 1): Visa and MasterCard",
      "A student is picked at random. A = has Visa, B = has MasterCard. $P(A) = 0.5$, $P(B) = 0.5$, $P(A \\cap B) = 0.25$. Find $P(B \\mid A)$.\n\n"
      "**Approach:** the world is now “Visa holders”. What fraction of them also have MasterCard?\n"
      "$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{0.25}{0.5} = 0.5$."),
   ANS("0.5", "Half of the Visa holders also carry a MasterCard."),
   EX("Lecturer's Example 3: one event inside another",
      "A repair shop: A = next item is an audio component $(P = 0.6)$, B = it's a CD player $(P = 0.05)$. Every CD player is an audio component, so $A \\cap B = B$:\n"
      "$P(B \\mid A) = \\frac{0.05}{0.6} = 0.0833$."),
   WARN("P(A | B) is not P(B | A)", "P(spots | measles) is nearly 1; P(measles | spots) is small (many things cause spots). Always check **which event is known**: it goes after the bar and in the denominator."),
   CHK("P(A ∩ B) = 0.2 and P(B) = 0.5. What is P(A | B)?", ["0.1", "0.4", "0.7", "2.5"], 1, "$0.2 / 0.5 = 0.4$."),
 ], "6–17"),
 SEC(3, "mult", "“A and then B”: the multiplication rule", [
   P("Rearrange the conditional formula and you get a recipe for “and”: the chance of the first step, times the chance of the second step **given the first happened**."),
   F("Multiplication rule", "$$P(A \\cap B) = P(A)\\,P(B \\mid A)$$ For a chain: $P(A \\cap B \\cap C) = P(A)\\,P(B \\mid A)\\,P(C \\mid A \\cap B)$."),
   EX("Solved example (lecturer's Example 7): two queens",
      "Two cards are dealt **without replacement**. P(both queens)?\n\n"
      "First card: 4 queens out of 52. Given that it was a queen, only 3 queens remain out of 51.\n"
      "$P = \\frac{4}{52} \\times \\frac{3}{51} = 0.0045$"),
   ANS("≈ 0.0045", "The second fraction changed because the first card was not put back."),
   TIP("Spot the clue", "**“Without replacement”**, “one after another”, “in stages” → multiply, updating the fractions at each step."),
 ], "8–10, 23–24"),
 SEC(4, "indep", "Independence: when information doesn't matter", [
   P("If knowing B tells you nothing new about A, then $P(A \\mid B) = P(A)$: the events are **independent**. Plug that into the multiplication rule and “and” becomes a plain product."),
   F("Independence test", "$$A, B \\text{ independent} \\iff P(A \\cap B) = P(A)\\,P(B) \\iff P(A \\mid B) = P(A)$$"),
   EX("Solved example (lecturer's Example 4): spam features",
      "Two independent features: A = email contains “offer” $(P = 0.6)$, B = has a suspicious link $(P = 0.4)$.\n\n"
      "**Both:** $0.6 \\times 0.4 = 0.24$.\n"
      "**Either (or both):** addition rule from Lecture 2: $0.6 + 0.4 - 0.24 = 0.76$.\n"
      "**Neither:** complement: $1 - 0.76 = 0.24$."),
   ANS("Both 0.24 · either 0.76 · neither 0.24"),
   EX("Testing independence from data (slide 27)",
      "100 flights: 45 from airport A, 20 late, 9 both. $P(A)P(\\text{late}) = 0.45 \\times 0.20 = 0.09$, which equals $P(A \\cap \\text{late}) = 9/100$ → **independent**. "
      "Same idea: P(late | A) $= 9/45 = 0.20$ = P(late). Knowing the airport tells you nothing."),
   EX("Lecturer's Example 1: letters from two bags",
      "Bag 1: I, L, J, A, U. Bag 2: L, R, H, E, C, A. One card from each bag (independent draws). P(J and R) $= \\frac{1}{5} \\cdot \\frac{1}{6} = \\frac{1}{30}$. "
      "Both vowels: Bag 1 has **three** vowels (I, A, U), Bag 2 has two → $\\frac{3}{5} \\cdot \\frac{2}{6} = \\frac{1}{5}$. (The slide's 2/15 counts only two vowels in Bag 1.)"),
   CHK("P(A) = 0.3, P(B) = 0.5, P(A ∩ B) = 0.15. Are A and B independent?", ["Yes", "No", "Can't tell", "Only if mutually exclusive"], 0, "$0.3 \\times 0.5 = 0.15$ = P(A ∩ B) → independent."),
 ], "18–28"),
 SEC(5, "total", "Law of total probability: split into cases", [
   P("Some questions are hard in one go but easy case by case. If the population splits into groups $A_1, A_2, \\dots$ (no overlaps, nobody left out: a **partition**) and you know the rate of B inside each group, the overall rate is a **weighted average**."),
   FIG("i3-partition"),
   F("Formula", "$$P(B) = \\sum_i P(A_i)\\,P(B \\mid A_i)$$ **Tree method:** one branch per case, **multiply along each path, add across the paths**."),
   EX("Solved example (lecturer's Example 1): the gas station",
      "40% of customers buy regular, 35% plus, 25% premium. Of these, 30%, 60% and 50% fill the tank. P(the next customer fills the tank)?\n\n"
      "$P(B) = (0.4)(0.3) + (0.35)(0.6) + (0.25)(0.5) = 0.12 + 0.21 + 0.125$"),
   ANS("0.455", "Just under half of all customers fill their tank."),
   FIG("i3-tree"),
   EX("Lecturer's Example 2: the binary channel",
      "A 1 is sent 40% of the time (so a 0 is sent 60%). A sent 0 arrives correctly with probability 0.90, a sent 1 with 0.95. P(a 1 is received)?\n\n"
      "Two ways to receive a 1: a 1 was sent and survived $(0.4 \\times 0.95 = 0.38)$, or a 0 was sent and flipped $(0.6 \\times 0.10 = 0.06)$.\n"
      "$P(\\text{1 received}) = 0.38 + 0.06 = 0.44$."),
   FIG("i3-channel"),
   TIP("Spot the clue", "The question gives **percentages of groups** (machines, suppliers, signal types) and **a rate within each group** (defective, fills tank, error), then asks for the **overall** rate → total probability. Reversing it (“given it was defective, which machine?”) is **Bayes**: Lecture 4."),
   CHK("Machine A makes 60% of items (2% defective), machine B 40% (5% defective). Overall defective rate?", ["3.5%", "3.2%", "7%", "2.6%"], 1, "$0.6(0.02) + 0.4(0.05) = 0.012 + 0.020 = 0.032$."),
 ], "29–47"),
 SEC(6, "compare", "Which rule do I need?", [
   T(["The question says…", "Use", "Formula"],
     [["“given that”, “among those who…”", "Conditional", "$P(A \\mid B) = P(A \\cap B)/P(B)$"],
      ["“A and then B”, without replacement", "Multiplication rule", "$P(A)P(B \\mid A)$"],
      ["independent events, “both”", "Product", "$P(A)P(B)$"],
      ["“either”, “at least one”", "Addition / complement (Lecture 2)", "$P(A) + P(B) - P(A \\cap B)$, $1 - P(\\text{none})$"],
      ["groups + a rate in each → overall rate", "Total probability", "$\\sum P(A_i)P(B \\mid A_i)$"]]),
 ], "49–50"),
 SEC(7, "test", "Test your understanding", [
   CHK("Two cards without replacement. P(both aces)?", ["(4/52)²", "(4/52)(3/51)", "4/52 + 3/51", "(4/52)(4/51)"], 1, "Multiplication rule with the fraction updated after the first ace."),
   CHK("If A and B are independent, P(A | B) equals…", ["P(B)", "P(A)", "P(A)P(B)", "0"], 1, "Knowing B changes nothing."),
   CHK("Same binary channel: P(1 received) = 0.44 and P(1 sent and received) = 0.38. P(1 was sent | 1 received)?", ["0.38", "0.44", "0.864", "0.95"], 2, "$0.38 / 0.44 = 0.864$: a preview of Bayes' theorem (Lecture 4)."),
 ]),
 SEC(8, "remember", "What to remember for your exam", [
   REM("- **Given B** → B is your new world: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$. The known event goes **after the bar** and in the **denominator**.\n"
       "- **And (in stages):** $P(A)P(B \\mid A)$; without replacement → update the fractions.\n"
       "- **Independent:** $P(A \\cap B) = P(A)P(B)$; test it from the data.\n"
       "- **Total probability:** multiply along tree branches, add across: $\\sum P(A_i)P(B \\mid A_i)$."),
 ]),
]

write("data/ism/lec3.js", INTRO, SECTIONS)
