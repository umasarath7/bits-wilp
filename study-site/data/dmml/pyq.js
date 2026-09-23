// DMML — Previous comprehensive paper, solved.
// Model answers live in the lecture files (single source of truth); this page collects them in paper order.
// Source: CourseFiles/DMML/Previous Papers/*.jpeg (6 questions × 5 marks)

import l1 from "./l1.js";
import l2 from "./l2.js";
import l3 from "./l3.js";
import l4 from "./l4.js";
import l6 from "./l6.js";
import l8 from "./l8.js";

const pick = (lecture, label, n) => {
  const q = lecture.theory.find((t) => t.pyq);
  return { ...q, title: `Q${n} (${label}): ${q.title}`, pyq: true };
};

export default {
  title: "Previous Comprehensive Paper (Solved)",
  source: "CourseFiles/DMML/Previous Papers · 6 questions × 5 marks = 30",
  overview:
    "The previous DMML comprehensive paper had **six 5-mark, theory/application questions**, roughly **one per major lecture**. Every question asks you to *apply* a concept to a scenario (“How would you apply…”, “How can an organisation…”), not just define it. Model answers are in the **Theory** tab. The same answers also appear in each lecture's Theory tab, marked 📌 PYQ.",

  summary: [
    {
      id: "pattern",
      heading: "Paper pattern & mapping",
      slides: "",
      blocks: [
        {
          type: "table",
          head: ["Q", "Topic", "Lecture", "Question style"],
          rows: [
            ["1", "Graph data models → query languages; example of efficient relationship queries", "L1 Data Representations", "Explain influence + example"],
            ["2", "“Data as an Asset” → value, protect, leverage, mitigate liability", "L2 DM Fundamentals", "Apply a principle to strategy"],
            ["3", "Architecture by **centralisation** for a global org (integration, security, performance)", "L3 Data Architectures", "Design with trade-offs"],
            ["4", "**Traditional vs Modern Data Stack**", "L4 Data Pipelines", "Compare"],
            ["5", "**Data engineering pipeline** (Data/Model/Code) **with diagram**", "L6 ML Lifecycle", "Describe with diagram"],
            ["6", "**Selection bias** with examples", "L8 Profiling & Validation", "Describe with examples"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "What this tells you about the next paper",
          text: "Expect one question from almost **every lecture**. L5 (infrastructure/DataOps) and L7 (ingestion) weren't asked last time, so **prepare them well**. Likely picks: storage types, reverse ETL, CI/CD/CT, streaming ingestion challenges, CDC, data contracts. Also expect cross-lecture questions such as Lambda/Kappa, drift and leakage, and deployment strategies.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Time budget",
          text: "6 × 5 marks. Budget about **15–18 minutes per answer**: 2 minutes to plan (headings + diagram), 12 to write, 2 to add an example and a conclusion.",
        },
      ],
    },
  ],

  theory: [
    pick(l1, "Graph models", 1),
    pick(l2, "Data as an asset", 2),
    pick(l3, "Architecture by centralisation", 3),
    pick(l4, "TDS vs MDS", 4),
    pick(l6, "Data engineering pipeline", 5),
    pick(l8, "Selection bias", 6),
  ],

  quiz: [],
};
