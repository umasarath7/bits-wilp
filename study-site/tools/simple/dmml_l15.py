import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Your phone knows where you sleep, your bank knows what you buy, your hospital knows your blood test results. ML is hungry for exactly this kind of data, "
         "so the question is: **how do we learn from people's data without betraying them?** This lecture answers in three parts: the **rules of good behaviour** "
         "(privacy pillars), the **laws** that enforce them (India's DPDPA, Europe's GDPR, California's CPRA, US health law HIPAA), and the **techniques** that let ML "
         "learn while keeping people private (federated learning, differential privacy, encryption, anonymisation).")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Behave well", "Six pillars: consent, transparency, minimisation, security, accountability, rights.", tag="Principles", example="Opt-in for marketing emails"),
     CARD("Obey the law", "DPDPA (India), GDPR (EU), CPRA (California), HIPAA (US health).", tag="Regulations", example="GDPR fine: up to €20 M or 4% of turnover"),
     CARD("Use privacy tech", "Learn from data without exposing it.", tag="Techniques", example="Federated learning across hospitals"),
   ),
   P("**Why it matters:** headlines like *“Data of 81.5 crore Indians dumped on dark web”* and *“Morgan Stanley fined 60 million dollars”*."),
 ], "4–7"),
 SEC(2, "pillars", "Six pillars of privacy", [
   T(["Pillar", "In plain words", "Example"],
     [["**Consent**", "Ask clearly; let them say no", "Opt-in checkbox"], ["**Transparency**", "Tell them what you do with it", "App privacy policy"],
      ["**Minimisation**", "Take only what you need", "Workout location, not your whole location history"], ["**Security**", "Lock it up", "Encryption (remember the Equifax breach)"],
      ["**Accountability**", "Be able to prove you followed the rules", "GDPR audits"], ["**Rights**", "Let them see, fix or delete it", "Download your social-media data"]]),
   REM("“**C**ats **T**hink **M**ice **S**mell **A**wfully **R**ich”: Consent, Transparency, Minimisation, Security, Accountability, Rights."),
 ], "8–14"),
 SEC(3, "laws", "Four laws to know", [
   T(["Law", "Where / what", "Remember"],
     [["**DPDPA 2023**", "India", "Rights to access, correct, erase, **revoke consent**; children under 18 can't be tracked or targeted with ads; notices in **22 languages**; minimum penalty **₹50 crore**"],
      ["**GDPR (2018)**", "Anyone handling EU residents' data", "**Right to be forgotten**, portability; **no pre-ticked boxes**; IP address counts as personal data; fine up to **€20 M or 4%**"],
      ["**CPRA (2023)**", "California", "Know, delete, correct, **opt out of sale/sharing**; extra care for sensitive data; under-16 consent, under-13 parents"],
      ["**HIPAA**", "US health data (PHI)", "Privacy Rule, Security Rule, **Breach Notification Rule**; vendors (business associates) must comply too"]]),
   P("**GDPR's 7 principles:** lawful-fair-transparent, purpose limitation, minimisation, accuracy, storage limitation, integrity & confidentiality, accountability."),
   CHK("A company outside Europe serves customers in France. Does GDPR apply?", ["No, it's outside Europe", "Yes, GDPR covers anyone processing EU residents' data", "Only if it has an EU office", "Only for health data"], 1, "GDPR applies regardless of where the company is located."),
 ], "15–26"),
 SEC(4, "measures", "Everyday protections", [
   T(["Measure", "Plain meaning"],
     [["Access control", "Need-to-know only"], ["Access logging", "Write down who looked at what"], ["Data separation", "Keep names away from model features"],
      ["Ethics training", "Teach the team"], ["Privacy by design", "Build privacy in from day one"]]),
 ], "27–31"),
 SEC(5, "tech", "Four privacy techniques for ML", [
   T(["Technique", "Everyday analogy", "Catch"],
     [["**Differential privacy**", "Blur one face in a crowd photo: the crowd looks the same, no one is recognisable", "A bit less accurate"],
      ["**Homomorphic encryption**", "Work on a locked box with gloves: you never see inside", "Very slow / costly"],
      ["**Multi-party computation**", "Friends find their average salary without anyone revealing their own", "Lots of back-and-forth messages"],
      ["**Federated learning**", "Send the teacher to each school instead of moving all students to one school", "Communication cost; devices must be online"]]),
   P("```flow\nGlobal model -> Trains inside Hospital A -> Only the update leaves\nGlobal model -> Trains inside Hospital B -> Only the update leaves\nUpdates -> Server averages them -> Better global model\n```"),
   CHK("Five banks want a joint fraud model but can't share customer records. Best fit?", ["Synthetic data only", "Federated learning", "Pseudonymisation only", "Publish the data"], 1, "Each bank trains locally; only model updates are shared."),
 ], "32–40"),
 SEC(6, "anon", "Hiding identities: three levels", [
   T(["Method", "What happens", "Still personal data (GDPR)?", "Best for"],
     [["**Pseudonymised**", "Name → code (a key can reverse it)", "**Yes**", "Medical research needing re-contact"],
      ["**Anonymised**", "Identifiers removed for good", "**No**", "Sharing and reuse, AI development"],
      ["**Synthetic**", "Fake but realistic records", "—", "Testing software"]]),
   F("k-anonymity", "Everyone must hide in a group of **at least k** look-alikes. Show **birth year** instead of birthday and only the **first 4 digits** of the zip code until every (zip, age) group has ≥ k people. Medicine recommends **k ≥ 5**."),
   WARN("Pseudonyms can leak", "If only one person has the job “President”, a code doesn't hide them."),
 ], "41–50"),
 SEC(7, "remember", "What to remember for your exam", [
   REM("- **Pillars:** consent, transparency, minimisation, security, accountability, rights.\n"
       "- **DPDPA:** India, ₹50 crore, 22 languages, under-18 protections. **GDPR:** global reach, forgotten, €20 M / 4%.\n"
       "- **CPRA:** opt out of sale. **HIPAA:** health data, 3 rules.\n"
       "- **DP** blur · **HE** locked box · **MPC** secret average · **FL** teacher travels.\n"
       "- **Pseudonymised** = still personal; **anonymised** = not; **synthetic** = for testing; **k-anonymity** k ≥ 5."),
 ]),
]

write("data/dmml/l15.js", INTRO, SECTIONS)
