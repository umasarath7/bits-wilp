// ML — Mixed quiz: every module's quiz combined, tagged by module so the topic filter becomes a module filter.
import m1 from "./m1.js";
import m2 from "./m2.js";
import m3 from "./m3.js";
import m4 from "./m4.js";
import m5 from "./m5.js";
import m6 from "./m6.js";
import m7 from "./m7.js";

const quiz = [[1, m1], [2, m2], [3, m3], [4, m4], [5, m5], [6, m6], [7, m7]].flatMap(([n, m]) =>
  m.quiz.map((q) => ({ ...q, topic: `M${n}`, q: `*(M${n} · ${q.topic})* ${q.q}` })));

export default {
  title: "Mixed Quiz: All Modules",
  source: `${quiz.length} questions from Modules 1–7`,
  quizMode: "step",
  overview:
    "Every module's quiz in one place. Open the **❓ Quiz** tab. Use **🔀 Mixed** for exam-style revision, or pick a module (M1…M7) for a topic quiz. Answer one at a time, **Submit**, read why the other options are wrong, **retry** the ones you miss, and check your per-module score at the end. Numeric answers accept decimals or fractions.",
  summary: [
    {
      id: "how",
      heading: "How to use this quiz",
      slides: "",
      blocks: [
        {
          type: "list",
          items: [
            "**Practice mode on:** a “Show solution” button lets you peek. Turn it off to simulate the exam.",
            "Work numeric questions on paper first, then type the answer (round as the question says; small rounding differences are accepted).",
            "After finishing, use **↺ Retry the ones I missed** until the score is full, then revisit the weakest module's ⚡ Recap.",
          ],
        },
      ],
    },
  ],
  quiz,
};
