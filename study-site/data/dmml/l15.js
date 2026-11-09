// DMML — Lecture 15: Data Privacy, Governance & Responsible ML
// Source: CourseFiles/DMML/L15-Data Privacy, Governance  Responsible ML.pptx (52 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Privacy, Governance & Responsible ML",
  source: "L15-Data Privacy, Governance  Responsible ML.pptx · 52 slides",
  overview:
    "ML runs on data about **people**: health records, card transactions, locations. Get it wrong and you get headlines like *“Data of 81.5 crore Indians dumped on dark web”* or *“Morgan Stanley fined 60 million dollars for data-protection mishaps”* (slide 5). This lecture covers what **data privacy** means and its **six pillars** (slides 4–14), the main **laws**: India's **DPDPA 2023**, the EU's **GDPR**, California's **CPRA** and the US health law **HIPAA** (slides 15–26), **privacy-preserving ML**: technical, institutional and ML measures including **differential privacy, homomorphic encryption, multi-party computation and federated learning** (slides 27–40), and **pseudonymisation, anonymisation (k-anonymity) and synthetic data** (slides 41–50).",

  simpleIntro: "Your phone knows where you sleep, your bank knows what you buy, your hospital knows your blood test results. ML is hungry for exactly this kind of data, so the question is: **how do we learn from people's data without betraying them?** This lecture answers in three parts: the **rules of good behaviour** (privacy pillars), the **laws** that enforce them (India's DPDPA, Europe's GDPR, California's CPRA, US health law HIPAA), and the **techniques** that let ML learn while keeping people private (federated learning, differential privacy, encryption, anonymisation).",

  simple: [
    {
      "id": "s-big",
      "heading": "1. The big picture",
      "slides": "4–7",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Behave well",
              "text": "Six pillars: consent, transparency, minimisation, security, accountability, rights.",
              "tag": "Principles",
              "example": "Opt-in for marketing emails"
            },
            {
              "title": "Obey the law",
              "text": "DPDPA (India), GDPR (EU), CPRA (California), HIPAA (US health).",
              "tag": "Regulations",
              "example": "GDPR fine: up to €20 M or 4% of turnover"
            },
            {
              "title": "Use privacy tech",
              "text": "Learn from data without exposing it.",
              "tag": "Techniques",
              "example": "Federated learning across hospitals"
            }
          ]
        },
        {
          "type": "p",
          "text": "**Why it matters:** headlines like *“Data of 81.5 crore Indians dumped on dark web”* and *“Morgan Stanley fined 60 million dollars”*."
        }
      ]
    },
    {
      "id": "s-pillars",
      "heading": "2. Six pillars of privacy",
      "slides": "8–14",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Pillar",
            "In plain words",
            "Example"
          ],
          "rows": [
            [
              "**Consent**",
              "Ask clearly; let them say no",
              "Opt-in checkbox"
            ],
            [
              "**Transparency**",
              "Tell them what you do with it",
              "App privacy policy"
            ],
            [
              "**Minimisation**",
              "Take only what you need",
              "Workout location, not your whole location history"
            ],
            [
              "**Security**",
              "Lock it up",
              "Encryption (remember the Equifax breach)"
            ],
            [
              "**Accountability**",
              "Be able to prove you followed the rules",
              "GDPR audits"
            ],
            [
              "**Rights**",
              "Let them see, fix or delete it",
              "Download your social-media data"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "“**C**ats **T**hink **M**ice **S**mell **A**wfully **R**ich”: Consent, Transparency, Minimisation, Security, Accountability, Rights."
        }
      ]
    },
    {
      "id": "s-laws",
      "heading": "3. Four laws to know",
      "slides": "15–26",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Law",
            "Where / what",
            "Remember"
          ],
          "rows": [
            [
              "**DPDPA 2023**",
              "India",
              "Rights to access, correct, erase, **revoke consent**; children under 18 can't be tracked or targeted with ads; notices in **22 languages**; minimum penalty **₹50 crore**"
            ],
            [
              "**GDPR (2018)**",
              "Anyone handling EU residents' data",
              "**Right to be forgotten**, portability; **no pre-ticked boxes**; IP address counts as personal data; fine up to **€20 M or 4%**"
            ],
            [
              "**CPRA (2023)**",
              "California",
              "Know, delete, correct, **opt out of sale/sharing**; extra care for sensitive data; under-16 consent, under-13 parents"
            ],
            [
              "**HIPAA**",
              "US health data (PHI)",
              "Privacy Rule, Security Rule, **Breach Notification Rule**; vendors (business associates) must comply too"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**GDPR's 7 principles:** lawful-fair-transparent, purpose limitation, minimisation, accuracy, storage limitation, integrity & confidentiality, accountability."
        },
        {
          "type": "check",
          "q": "A company outside Europe serves customers in France. Does GDPR apply?",
          "options": [
            "No, it's outside Europe",
            "Yes, GDPR covers anyone processing EU residents' data",
            "Only if it has an EU office",
            "Only for health data"
          ],
          "answer": 1,
          "why": "GDPR applies regardless of where the company is located."
        }
      ]
    },
    {
      "id": "s-measures",
      "heading": "4. Everyday protections",
      "slides": "27–31",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Measure",
            "Plain meaning"
          ],
          "rows": [
            [
              "Access control",
              "Need-to-know only"
            ],
            [
              "Access logging",
              "Write down who looked at what"
            ],
            [
              "Data separation",
              "Keep names away from model features"
            ],
            [
              "Ethics training",
              "Teach the team"
            ],
            [
              "Privacy by design",
              "Build privacy in from day one"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-tech",
      "heading": "5. Four privacy techniques for ML",
      "slides": "32–40",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Technique",
            "Everyday analogy",
            "Catch"
          ],
          "rows": [
            [
              "**Differential privacy**",
              "Blur one face in a crowd photo: the crowd looks the same, no one is recognisable",
              "A bit less accurate"
            ],
            [
              "**Homomorphic encryption**",
              "Work on a locked box with gloves: you never see inside",
              "Very slow / costly"
            ],
            [
              "**Multi-party computation**",
              "Friends find their average salary without anyone revealing their own",
              "Lots of back-and-forth messages"
            ],
            [
              "**Federated learning**",
              "Send the teacher to each school instead of moving all students to one school",
              "Communication cost; devices must be online"
            ]
          ]
        },
        {
          "type": "p",
          "text": "```flow\nGlobal model -> Trains inside Hospital A -> Only the update leaves\nGlobal model -> Trains inside Hospital B -> Only the update leaves\nUpdates -> Server averages them -> Better global model\n```"
        },
        {
          "type": "check",
          "q": "Five banks want a joint fraud model but can't share customer records. Best fit?",
          "options": [
            "Synthetic data only",
            "Federated learning",
            "Pseudonymisation only",
            "Publish the data"
          ],
          "answer": 1,
          "why": "Each bank trains locally; only model updates are shared."
        }
      ]
    },
    {
      "id": "s-anon",
      "heading": "6. Hiding identities: three levels",
      "slides": "41–50",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Method",
            "What happens",
            "Still personal data (GDPR)?",
            "Best for"
          ],
          "rows": [
            [
              "**Pseudonymised**",
              "Name → code (a key can reverse it)",
              "**Yes**",
              "Medical research needing re-contact"
            ],
            [
              "**Anonymised**",
              "Identifiers removed for good",
              "**No**",
              "Sharing and reuse, AI development"
            ],
            [
              "**Synthetic**",
              "Fake but realistic records",
              "—",
              "Testing software"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "formula",
          "title": "k-anonymity",
          "text": "Everyone must hide in a group of **at least k** look-alikes. Show **birth year** instead of birthday and only the **first 4 digits** of the zip code until every (zip, age) group has ≥ k people. Medicine recommends **k ≥ 5**."
        },
        {
          "type": "callout",
          "kind": "warn",
          "title": "Pseudonyms can leak",
          "text": "If only one person has the job “President”, a code doesn't hide them."
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "7. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **Pillars:** consent, transparency, minimisation, security, accountability, rights.\n- **DPDPA:** India, ₹50 crore, 22 languages, under-18 protections. **GDPR:** global reach, forgotten, €20 M / 4%.\n- **CPRA:** opt out of sale. **HIPAA:** health data, 3 rules.\n- **DP** blur · **HE** locked box · **MPC** secret average · **FL** teacher travels.\n- **Pseudonymised** = still personal; **anonymised** = not; **synthetic** = for testing; **k-anonymity** k ≥ 5."
        }
      ]
    }
  ],

  summary: [
    {
      id: "privacy",
      heading: "Lesson 1: What is data privacy, and what must organisations do?",
      slides: "4–14",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Definitions (slides 6–7)",
          text: "**Data privacy** (information privacy): *a person should control their personal data, including how organisations collect, store and use it.* For companies this means getting **consent**, **protecting** data from misuse and letting users **manage** their data.\n**Data privacy compliance**: following the **laws and standards** for collecting, processing, storing and sharing personal information: consent, security measures, letting users access or delete data, and **documenting what you collect, why, and how long you keep it**.",
        },
        {
          type: "table",
          caption: "Six pillars of privacy compliance (slides 8–14)",
          head: ["Pillar", "Meaning", "Example"],
          rows: [
            ["**Consent**", "Explicit, not assumed: people choose whether to share", "**Opt-in** checkbox for marketing emails"],
            ["**Transparency**", "People know how data is collected, used and shared", "The privacy policy shown when you install an app"],
            ["**Data minimisation**", "Collect only what the purpose needs", "A fitness app takes workout location, not your whole location history"],
            ["**Security**", "Encryption, access control, secure storage", "The **Equifax** breach shows the cost of weak protection"],
            ["**Accountability**", "Organisations answer for compliance and can **prove** it", "GDPR's strict penalties"],
            ["**Individual rights**", "Access, correct, delete your data", "Downloading a copy of your data from a social network"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook: “CT-MS-AR”",
          text: "**C**onsent, **T**ransparency, **M**inimisation, **S**ecurity, **A**ccountability, **R**ights: “**C**ats **T**hink **M**ice **S**mell **A**wfully **R**ich”.",
        },
      ],
    },
    {
      id: "laws",
      heading: "Lesson 2: The key privacy laws",
      slides: "15–26",
      blocks: [
        {
          type: "table",
          caption: "India: DPDPA 2023 (Digital Personal Data Protection Act) (slides 17–19)",
          head: ["Area", "Provision"],
          rows: [
            ["**Rights**", "Access; correction and **erasure**; **revoke consent**; grievance redressal; nominate someone to act on your behalf (death/incapacity), plus **consent managers**"],
            ["**Children (under 18)**", "Special protection; no processing harmful to their well-being, **no tracking, behavioural monitoring or targeted advertising**"],
            ["**Penalty**", "Minimum **₹50 crore** for a breach"],
            ["**Languages**", "Terms and collection notices available in all **22 languages** of the Constitution's 8th Schedule"],
            ["**Exemptions**", "Enforcing legal rights/claims; courts and tribunals; prevention, detection or prosecution of offences; data of non-residents processed under foreign contracts; mergers and demergers; checking financial details of loan defaulters"],
          ],
        },
        {
          type: "p",
          text: "**A typical DPDPA journey (slide 19):** (1) design privacy policies and procedures → (2) serve a **privacy notice** at collection points where consent is obtained → (3) document the **legal grounds** for all processing → (4) obtain adequate consent and a mechanism to **manage** it → (5) procedures for **grievances** → (6) a mechanism to respond to **data-principal rights** requests → (7) **technical and organisational safeguards** → (8) revisit **data-processor contracts** → (9) a **breach-notification** template for the Board and data principals → (10) inform data principals about earlier processing.",
        },
        {
          type: "table",
          caption: "EU: GDPR (General Data Protection Regulation, since 25 May 2018) (slides 20–22)",
          head: ["Area", "Provision"],
          rows: [
            ["**Scope**", "Any organisation **anywhere** processing data of people in the EU/EEA"],
            ["**Personal data**", "Anything identifying a person: names, **IP addresses**, emails, health and behaviour data"],
            ["**Rights**", "Access, rectify, **erase (“right to be forgotten”)**, restrict processing, **data portability**"],
            ["**Consent**", "Freely given, specific, informed, unambiguous: **no pre-ticked boxes**"],
            ["**Penalty**", "Up to **€20 million or 4% of global annual turnover**, whichever is higher"],
          ],
        },
        {
          type: "table",
          caption: "GDPR's seven principles (slide 22)",
          head: ["Principle", "Meaning"],
          rows: [
            ["**Lawfulness, fairness, transparency**", "Lawful, fair, transparent to the person"],
            ["**Purpose limitation**", "Use only for the purposes stated at collection"],
            ["**Data minimisation**", "Only what is absolutely necessary"],
            ["**Accuracy**", "Keep it correct and up to date"],
            ["**Storage limitation**", "Keep identifying data only as long as needed"],
            ["**Integrity & confidentiality**", "Appropriate security (e.g. encryption)"],
            ["**Accountability**", "The **data controller** must be able to **demonstrate** compliance"],
          ],
        },
        {
          type: "table",
          caption: "USA: CPRA and HIPAA (slides 23–26)",
          head: ["", "CPRA (California Privacy Rights Act, 2023)", "HIPAA (Health Insurance Portability and Accountability Act)"],
          rows: [
            ["**Protects**", "California residents' personal information", "**Protected Health Information (PHI)**: medical records, billing, lab results"],
            ["**Applies to**", "For-profit businesses dealing with Californians", "**Covered entities** (providers, health plans, clearinghouses) and their **business associates** (vendors)"],
            ["**Key rights / rules**", "Know, access, delete, correct, **opt out of sale/sharing** for cross-context advertising; limit use of **sensitive personal information** (precise location, SSN, race, health)", "**Privacy Rule** (use of data), **Security Rule** (safeguards for electronic PHI), **Breach Notification Rule** (tell individuals, HHS and maybe the media)"],
            ["**Minors / patients**", "Consent to sell data of under-16s; **parental** consent under 13", "Patients can see and copy records, request corrections, send their e-PHI to a third party"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**DPDPA = India, ₹50 crore, 22 languages, kids under 18. GDPR = EU, €20 M or 4%, right to be forgotten. CPRA = California, opt out of sale. HIPAA = US health, PHI.**",
        },
      ],
    },
    {
      id: "ppml",
      heading: "Lesson 3: Privacy-preserving ML",
      slides: "27–40",
      blocks: [
        {
          type: "table",
          caption: "Technical and institutional measures (slides 29–30, from *Reliable Machine Learning*)",
          head: ["Measure", "What it means"],
          rows: [
            ["**Access controls**", "Personal data is **need-to-know**: engineers request access for a purpose; review access periodically"],
            ["**Access logging**", "Record who accessed what and when: spot misuse, keep evidence"],
            ["**Data minimisation**", "Collect less and use less"],
            ["**Data separation**", "Keep names and addresses apart from the features a model actually needs"],
            ["**Ethics training**", "For everyone entering a new domain or building ML products"],
            ["**Data-access guidelines**", "Clear written rules on appropriate access and use"],
            ["**Privacy by design**", "Build privacy into every element of the ML pipeline and product from the start"],
          ],
        },
        {
          type: "p",
          text: "**Why ML needs special measures (slide 31):** collecting data for ML threatens privacy, and an attacker can even **extract private information memorised by a model**.",
        },
        {
          type: "table",
          caption: "Four ML techniques (slides 32–40)",
          head: ["Technique", "Idea in plain words", "Protects", "Strength", "Weakness"],
          rows: [
            ["**Differential privacy (DP)**", "Add carefully calibrated noise so the result is **almost the same whether or not any one person is in the data**", "Identity, raw data, features, **model**", "**Provable** privacy guarantee", "**Lower accuracy**"],
            ["**Homomorphic encryption (HE)**", "Train/predict **on encrypted data**; only the data owner can decrypt the result. Used in **MLaaS** (protect training data and query data from the service provider)", "Identity, raw data, features, **input**", "Computes on encrypted data; provable", "**High computation cost**; works on numeric data"],
            ["**Multi-party computation (MPC)**", "Several parties compute a function together **without revealing their own inputs**; a verifier checks each contribution", "Identity, raw data, features, **input**", "Computes on encrypted data", "Large circuits/memory; **constant communication and online availability**; fixed-point arithmetic"],
            ["**Federated learning (FL)**", "Send the **model to the data**: each hospital/phone trains locally; only **model updates** go to a server for aggregation; raw data never leaves", "Identity, raw data, features, model", "**Decentralised** training", "**Communication overhead**; devices must be available; scalability"],
          ],
        },
        {
          type: "p",
          text: "```flow\nGlobal model -> Hospital A trains locally on private data\nGlobal model -> Hospital B trains locally on private data\nHospital A local model -> FL server aggregates updates -> Improved global model\nHospital B local model -> FL server aggregates updates\n```",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Note on the slide title",
          text: "Slide 36 abbreviates multi-party computation as “MCP”; the standard abbreviation (used in the slide's own text) is **MPC**.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "**DP = blur the crowd · HE = work inside a locked box · MPC = add up secrets without telling them · FL = send the teacher to the students, not the students to the teacher.**",
        },
      ],
    },
    {
      id: "anon",
      heading: "Lesson 4: Pseudonymisation, anonymisation and synthetic data",
      slides: "41–50",
      blocks: [
        {
          type: "p",
          text: "Anonymisation techniques can be applied to any dataset in the ML process to protect individuals and resist **de-anonymisation attacks**, and they let teams use ordinary ML frameworks, but on their own they can **reduce model accuracy** (slide 42).",
        },
        {
          type: "table",
          caption: "Three approaches (slides 43–50)",
          head: ["Method", "What it does", "Still personal data under GDPR?", "Use"],
          rows: [
            ["**Pseudonymisation**", "Replace direct identifiers (name, address, SSN) with **codes**; a **key** can map back (useful to re-contact study participants)", "**Yes**: rare combinations (occupation “President”) or outside information can re-identify people", "Medical research, regulated analysis"],
            ["**Anonymisation**", "**Irreversibly** remove direct **and indirect** identifiers so re-identification is practically impossible", "**No**: can be used for secondary purposes", "Cross-border collaboration, cheaper clinical trials with real-world data, reusing trial data, AI development, hospital data lakes"],
            ["**Synthetic data**", "Generate **artificial** data from rules or a generative model that mimics real statistical patterns", "—", "Mainly **test data** for software and IT systems"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "k-anonymity (slides 45–47)",
          text: "A dataset is **k-anonymous** if, for any combination of the identifying attributes, **at least k people** share it, so nobody stands out in a group smaller than k.\n*Example:* require at least **10 people** for every (zip code, age) bucket by reporting **birth month or year** instead of the full date and only the **first 4 digits** of a 5-digit zip code. In medicine **k ≥ 5** is recommended; values above 50 have been reported.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Pitfalls of synthetic data (slide 48)",
          text: "(1) The generative model may carry **hidden (“cryptic”) bias**. (2) Because it is random, a real person's information may occasionally be reproduced. Hence it suits **testing systems**, not scientific analysis.",
        },
        {
          type: "p",
          text: "**Slide 49's picture:** *pseudonymised* = “44455, male” (a code replaces the name); *anonymised* = “male” (nothing identifying left); *synthetic* = “male, 35 y/o” generated from statistics of real data.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "idea",
      title: "In one line",
      text: "Give people control over their data (consent, transparency, minimisation, security, accountability, rights), obey the laws (DPDPA, GDPR, CPRA, HIPAA), and build ML that protects privacy (access control, DP, HE, MPC, FL, anonymisation).",
    },
    {
      type: "list",
      items: [
        "**Six pillars:** consent, transparency, data minimisation, security, accountability, individual rights.",
        "**DPDPA 2023 (India):** access, correction/erasure, revoke consent, grievance, nominee; children under 18 (no tracking or targeted ads); ₹50 crore minimum penalty; 22 languages; exemptions.",
        "**GDPR (EU, 2018):** global scope; IP is personal data; right to be forgotten, portability; no pre-ticked boxes; €20 M or 4%; seven principles.",
        "**CPRA (California):** know, delete, correct, opt out of sale/sharing; sensitive personal information; minors under 16/13.",
        "**HIPAA (US health):** PHI; covered entities + business associates; Privacy, Security, Breach Notification rules.",
        "**Measures:** access control and logging, minimisation, separation; ethics training, guidelines, privacy by design.",
        "**ML techniques:** DP (noise, provable, less accurate), HE (compute on encrypted data, costly), MPC (joint compute without revealing, heavy communication), FL (train where data lives, communication overhead).",
        "**Pseudonymised** (still personal data) vs **anonymised** (not personal data; k-anonymity, k ≥ 5 in medicine) vs **synthetic** (test data; cryptic bias).",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: compare GDPR and DPDPA for an ML product · privacy-preserving technique for hospitals sharing data (federated learning / MPC) · pseudonymisation vs anonymisation vs synthetic data with k-anonymity.",
    },
  ],

  glossary: [
    ["Data privacy", "Information privacy", "A person's control over their personal data"],
    ["Privacy compliance", "—", "Following laws/standards for collecting and using personal data"],
    ["Opt-in", "—", "The user actively agrees (explicit consent)"],
    ["Data minimisation", "—", "Collect and use only what is necessary"],
    ["DPDPA", "Digital Personal Data Protection Act, 2023", "India's personal-data law"],
    ["Data principal / consent manager", "—", "The person the data is about / registered intermediary managing consent"],
    ["GDPR", "General Data Protection Regulation", "EU privacy law (since 25 May 2018)"],
    ["EEA", "European Economic Area", "EU plus Iceland, Liechtenstein, Norway"],
    ["Right to be forgotten", "Right to erasure", "Ask for your personal data to be deleted"],
    ["Data portability", "—", "Right to receive and move your data"],
    ["Data controller", "—", "Organisation deciding why and how data is processed"],
    ["CPRA", "California Privacy Rights Act", "California privacy law (2023)"],
    ["SPI", "Sensitive Personal Information", "e.g. precise geolocation, SSN, race, health"],
    ["HIPAA", "Health Insurance Portability and Accountability Act", "US health-data law"],
    ["PHI / ePHI", "(electronic) Protected Health Information", "Identifiable health data"],
    ["Covered entity / business associate", "—", "Provider/plan/clearinghouse / vendor handling PHI for them"],
    ["HHS", "US Department of Health and Human Services", "Receives HIPAA breach notifications"],
    ["Privacy by design", "—", "Building privacy into a product from the start"],
    ["Differential privacy", "DP", "Noise so results barely change with or without one person"],
    ["Homomorphic encryption", "HE", "Computation on encrypted data"],
    ["MLaaS", "Machine Learning as a Service", "A third party trains/serves models for you"],
    ["Multi-party computation", "MPC (Secure MPC)", "Joint computation without revealing private inputs"],
    ["Federated learning", "FL", "Training locally on each data holder; only updates are shared"],
    ["De-anonymisation attack", "Re-identification", "Linking anonymised records back to people"],
    ["Pseudonymisation", "—", "Replace identifiers with codes (reversible with a key)"],
    ["Anonymisation", "—", "Irreversibly remove direct and indirect identifiers"],
    ["k-anonymity", "—", "Every identifying combination is shared by at least k people"],
    ["Synthetic data", "—", "Artificial data mimicking real statistics"],
    ["RWD / RWE", "Real-World Data / Evidence", "Health data from routine care used in research"],
    ["RCT", "Randomised Controlled Trial", "Gold-standard clinical study design"],
  ],

  examTips: [
    "For law questions, use a comparison table (scope, rights, consent, penalties, special groups) and name the law precisely: DPDPA 2023, GDPR 2018, CPRA 2023, HIPAA.",
    "For privacy-preserving ML, state what each technique protects, its strength and its weakness (the slide-40 table) and pick one for the scenario.",
    "Always contrast pseudonymised (still personal data, reversible) with anonymised (not personal data) and explain k-anonymity with the zip-code example.",
    "Tie answers back to the six pillars: consent, transparency, minimisation, security, accountability, rights.",
  ],

  theory: [
    {
      title: "Privacy-preserving ML for hospitals",
      marks: 5,
      question: "Five hospitals want to build a joint disease-prediction model, but patient records cannot leave each hospital under HIPAA/DPDPA-style rules. Explain the privacy-preserving ML techniques available and recommend an approach.",
      solution: `
### What the examiner wants
Each technique's idea, what it protects, its trade-offs, and a justified recommendation for the scenario, plus supporting institutional measures.

### Model answer
**Constraint:** PHI is protected (HIPAA Privacy and Security Rules; DPDPA's rights and penalties), so raw records must stay inside each hospital.

| Technique | How it works here | Strength | Weakness |
|---|---|---|---|
| **Federated learning** | A global model is sent to each hospital, trained locally; only **model updates** are aggregated by a server | Raw data never leaves; decentralised | Communication overhead; hospitals must be online |
| **Differential privacy** | Add calibrated noise to updates or outputs so no single patient changes the result much | **Provable** guarantee; stops memorisation | Some **accuracy loss** |
| **Multi-party computation** | Hospitals jointly compute training without revealing inputs | Strong input secrecy | Heavy communication, memory, always online |
| **Homomorphic encryption** | Train or predict on encrypted data at a third party (MLaaS) | Provider never sees plain text | Very high computation cost |

\`\`\`flow
Global model -> Each hospital trains on local records -> Clip updates and add DP noise -> Secure aggregation on FL server -> Improved global model -> Next round
\`\`\`

**Recommendation:** **federated learning + differential privacy** (and secure aggregation): data stays local, updates leak little, and the guarantee is provable. Use HE only for an external prediction service.

**Supporting measures (slides 29–30):** need-to-know **access control** and **access logging**, data **minimisation** and **separation** (names apart from features), **ethics training**, written access guidelines, and **privacy by design**. Consent and transparency notices cover research use; breach-notification procedures are in place.`,
    },
    {
      title: "GDPR vs DPDPA for an ML product",
      marks: 5,
      question: "An Indian start-up launches a personalised-learning app used by students in India and the EU. Compare the obligations under India's DPDPA 2023 and the EU's GDPR, and explain how the ML data pipeline must change.",
      solution: `
### Model answer
| | **DPDPA 2023 (India)** | **GDPR (EU)** |
|---|---|---|
| Scope | Digital personal data processed in India | **Any** organisation processing EU/EEA residents' data, wherever located |
| Rights | Access, correction, erasure, **revoke consent**, grievance redressal, nominee | Access, rectify, **erase (right to be forgotten)**, restrict, **portability** |
| Consent | Notice in **22 scheduled languages**; consent managers | Freely given, specific, informed, unambiguous; **no pre-ticked boxes** |
| Children | Under **18**: no tracking, behavioural monitoring or **targeted ads** | Special protection for children |
| Penalties | Minimum **₹50 crore** | Up to **€20 M or 4% of global turnover** |
| Principles | — | Lawfulness, purpose limitation, minimisation, accuracy, storage limitation, integrity, accountability |

**Impact on the ML pipeline:**
- **Consent and purpose:** record consent per purpose; train personalisation models only on data with valid consent (**purpose limitation**).
- **Children:** students are minors, so **no behavioural profiling for ads** under DPDPA; personalisation must be clearly educational and consented by guardians.
- **Minimisation and separation:** keep names/emails apart from learning features; pseudonymise IDs.
- **Erasure:** a deletion request must remove data from storage, feature stores and future training sets (versioned datasets make this traceable).
- **Security and accountability:** encryption, access logging, documented processing, breach-notification process.

\`\`\`flow
Consent with purpose and language -> Collect minimum data -> Pseudonymize and separate identifiers -> Train on consented data only -> Honor erase or revoke requests -> Audit log
\`\`\``,
    },
    {
      title: "Pseudonymisation, anonymisation and synthetic data",
      marks: 5,
      question: "Distinguish pseudonymisation, anonymisation and synthetic data. Explain k-anonymity with an example, and state when each approach is appropriate for ML.",
      solution: `
### Model answer
| | Pseudonymisation | Anonymisation | Synthetic data |
|---|---|---|---|
| What | Replace names/IDs with codes; a key can reverse it | **Irreversibly** remove direct and indirect identifiers | Artificial records generated to mimic real statistics |
| Re-identification | Possible (unique combinations, external data) | Practically impossible | Small chance real data leaks |
| GDPR status | **Still personal data** | **Not** personal data | — |
| Example (slide 49) | “44455, male” | “male” | “male, 35 years old” |
| Best use | Medical research needing re-contact | Secondary use: cross-border collaboration, AI development, hospital data lakes | **Testing** software/IT systems |

**k-anonymity (slides 46–47):** every combination of identifying attributes must be shared by **at least k people**. Example: town data where each (zip code, age) bucket must contain ≥ 10 people: report **birth year or month** instead of date and only the **first 4 digits** of the zip code. In medicine **k ≥ 5** is recommended.

\`\`\`flow
Raw records -> Remove direct identifiers -> Generalize quasi-identifiers: age band, zip prefix -> Check every group has at least k people -> Release anonymized dataset
\`\`\`

**Trade-offs:** anonymisation can **reduce model accuracy**; synthetic data can carry **cryptic bias** from its generator. Choose pseudonymisation when linkage is needed, anonymisation for broad reuse, synthetic data for testing pipelines.`,
    },
  ],

  quiz: [
    { q: "A marketing-email checkbox the user must actively tick reflects which pillar?", options: ["Transparency", "Consent (opt-in)", "Security", "Accountability"], answer: 1, why: "Slide 9." },
    { q: "A fitness app collecting only workout locations illustrates:", options: ["Data minimisation", "Portability", "Encryption", "Pseudonymisation"], answer: 0, why: "Slide 11." },
    { q: "Minimum penalty for a breach under India's DPDPA 2023:", options: ["₹5 crore", "₹50 crore", "€20 million", "4% of turnover"], answer: 1, why: "Slide 17." },
    { q: "Under DPDPA, collection notices must be available in:", options: ["English only", "Hindi and English", "All 22 languages of the 8th Schedule", "Any one regional language"], answer: 2, why: "Slide 17." },
    { q: "Maximum GDPR fine:", options: ["€1 million", "€20 million or 4% of global turnover, whichever is higher", "2% of profit", "₹50 crore"], answer: 1, why: "Slide 21." },
    { q: "Which GDPR principle says keep identifying data only as long as necessary?", options: ["Purpose limitation", "Storage limitation", "Accuracy", "Accountability"], answer: 1, why: "Slide 22." },
    { q: "Under CPRA, consumers can:", options: ["Only view data", "Opt out of the sale or sharing of their data", "Fine companies directly", "Access others' data"], answer: 1, why: "Slide 23." },
    { q: "HIPAA protects:", options: ["Card numbers", "Protected Health Information", "Social-media posts", "Source code"], answer: 1, why: "Slide 24." },
    { q: "Which technique gives a provable privacy guarantee but reduces model accuracy?", options: ["Differential privacy", "Federated learning", "Pseudonymisation", "Access logging"], answer: 0, why: "Slides 33, 40." },
    { q: "Training a model on encrypted data so the provider never sees plain text is:", options: ["Homomorphic encryption", "k-anonymity", "Federated learning", "Synthetic data"], answer: 0, why: "Slide 34." },
    { q: "Training locally on each hospital's data and sharing only model updates is:", options: ["MPC", "Federated learning", "Anonymisation", "Differential privacy"], answer: 1, why: "Slide 38." },
    { q: "Under GDPR, pseudonymised data is:", options: ["Not personal data", "Still personal data", "Synthetic data", "Always anonymous"], answer: 1, why: "Slide 44." },
    { q: "Recommended minimum k for k-anonymity in the medical domain:", options: ["1", "2", "5", "1000"], answer: 2, why: "Slide 47." },
    { q: "Synthetic data is best suited for:", options: ["Scientific analysis", "Testing software and IT systems", "Replacing consent", "Clinical diagnosis"], answer: 1, why: "Slides 48, 50." },
  ],
};
