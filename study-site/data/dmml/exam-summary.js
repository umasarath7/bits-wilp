// DMML — Exam summary: everything from all eight lectures on one page, for the night before the exam.
// The per-lecture sections are the lectures' own ⚡ Recap blocks (single source of truth), so this page
// always matches the Recap tabs. Sections 1–3 (how to answer, traps, checklist) live here.

import l1 from "./l1.js";
import l2 from "./l2.js";
import l3 from "./l3.js";
import l4 from "./l4.js";
import l5 from "./l5.js";
import l6 from "./l6.js";
import l7 from "./l7.js";
import l8 from "./l8.js";

const LECTURES = [l1, l2, l3, l4, l5, l6, l7, l8].map((l, i) => ({
  id: `l${i + 1}`,
  heading: `L${i + 1}. ${l.title}`,
  slides: "",
  blocks: l.recap,
}));

export default {
  title: "DMML Exam Summary",
  source: "Lectures 1–8 + previous comprehensive paper · read in about 25 minutes",
  overview:
    "Read this the night before and on the morning of the exam. The DMML comprehensive is **pure theory**: six 5-mark questions, roughly **one per lecture**, and every one asks you to **apply** a concept to a scenario. This page gives you, for each lecture, the **definitions, lists and diagram** you must be able to reproduce, plus the **example** that makes an answer concrete. Section 1 tells you how to write; sections L1–L8 are the eight lecture recaps (the same as each lecture's ⚡ Recap tab) and tell you what to write; sections 2–3 are the traps to avoid and a final checklist.",

  summary: [
    {
      id: "paper",
      heading: "1. What the paper looks like, and how to answer",
      slides: "",
      blocks: [
        {
          type: "table",
          caption: "Previous comprehensive: 6 × 5 marks",
          head: ["Q", "Asked", "Lecture", "Style"],
          rows: [
            ["1", "How graph data models influence query languages + example", "L1", "Mechanism + example"],
            ["2", "Apply “data as an asset” to a data-management strategy", "L2", "Strategy"],
            ["3", "Architecture by centralisation for a global organisation", "L3", "Design with trade-offs"],
            ["4", "Traditional vs Modern Data Stack", "L4", "Compare"],
            ["5", "Data engineering pipeline, with a diagram", "L6", "Describe with diagram"],
            ["6", "Selection bias with examples", "L8", "Describe with examples"],
          ],
        },
        {
          type: "callout",
          kind: "exam",
          title: "Not asked last time, so prepare them well",
          text: "**L5** (storage types, consistency, reverse ETL, the ML infrastructure stack, CI/CD/CT, DoorDash) and **L7** (source types, data contracts, CDC, streaming ingestion concerns). Also likely: **Lambda vs Kappa**, **leakage and drift**, **deployment strategies**.",
        },
        {
          type: "p",
          text: "```flow\n1. Define / set context -> 2. Key concepts (4–6 points) -> 3. Diagram or comparison table -> 4. Apply to the scenario + real example -> 5. Trade-offs + one-line conclusion\n```",
        },
        {
          type: "table",
          caption: "Decode the verb",
          head: ["If the question says…", "Write…"],
          rows: [
            ["**Compare / differentiate**", "A table with 6–8 rows, then a one-line verdict"],
            ["**…with a (suitable) diagram**", "A labelled box-and-arrow diagram **first**, then explain each box. No diagram = lost marks"],
            ["**…with examples**", "Definition → sub-types → 2–3 concrete examples → impact"],
            ["**How would you apply / design…**", "Options → evaluate against **every** criterion named → recommendation → why"],
            ["**How can an organisation…**", "Strategy: goals → controls → risks and mitigation → KPI → example"],
          ],
        },
        {
          type: "p",
          text: "**Time:** about 15–18 minutes per answer: 2 to plan headings and the diagram, 12 to write, 2 for the example and conclusion. Make each criterion in the question a **visible sub-heading**.",
        },
      ],
    },
    ...LECTURES,
    {
      id: "traps",
      heading: "2. Traps that cost marks",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Skipping a clause.** If the question lists integration, security and performance, each needs its own heading.",
            "**No diagram when the question asks for one.** Draw boxes and arrows, even rough ones.",
            "**Definitions only.** Every PYQ said *apply / design / how can*. Tie each point to the scenario.",
            "**Mixing up pairs:** backward vs forward compatibility; data drift vs concept drift; mesh (organisational) vs fabric (technical); Lambda (two paths) vs Kappa (one stream); ETL vs ELT; star vs snowflake.",
            "**Forgetting the liability side** of “data as an asset”.",
            "**No example.** Use the slides' own: Netflix, DoorDash, IMD, Airbnb, Booking.com, Pinterest, the EU-tax drill-down, the hospital quality examples, the product survey.",
          ],
        },
      ],
    },
    {
      id: "checklist",
      heading: "3. Final 5-minute checklist",
      slides: "",
      blocks: [
        {
          type: "callout",
          kind: "remember",
          title: "Can you, without looking…",
          text: "1. Compare the five data models, and write one Cypher query?\n2. List the three ways to reduce data liability, in order?\n3. Draw Lambda and Kappa, and compare centralised / decentralised / hybrid?\n4. Reproduce the TDS vs MDS table (8 rows)?\n5. Compare file, block and object storage, and draw experiment → CI → CD → CT?\n6. Draw the 4-step data engineering pipeline with activities under each step?\n7. List the streaming-ingestion concerns with a fix for each, and define a data contract?\n8. Explain selection bias with its three sub-types, the three causes of leakage, and PSI?\n\nIf yes to all eight, you're ready. Good luck!",
        },
      ],
    },
  ],
};
