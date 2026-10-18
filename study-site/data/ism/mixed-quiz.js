// ISM — Mixed quiz: every lecture's quiz combined, tagged by lecture so the topic filter becomes a lecture filter.
import l1 from "./lec1.js";
import l2 from "./lec2.js";
import l3 from "./lec3.js";
import l4 from "./lec4.js";
import l5 from "./lec5.js";
import l6 from "./lec6.js";
import l7 from "./lec7.js";
import l9 from "./lec9.js";
import l10 from "./lec10.js";

const quiz = [[1, l1], [2, l2], [3, l3], [4, l4], [5, l5], [6, l6], [7, l7], [9, l9], [10, l10]].flatMap(([n, l]) =>
  l.quiz.map((q) => ({ ...q, topic: `L${n}`, q: `*(L${n} · ${q.topic})* ${q.q}` })));

export default {
  title: "Mixed Quiz: All Lectures",
  source: `${quiz.length} questions from Lectures 1–7, 9, 10`,
  quizMode: "step",
  overview:
    "Every lecture's quiz in one place. Open the **❓ Quiz** tab. Use **🔀 Mixed** for exam-style revision, or pick a lecture (L1…L10) for a topic quiz. Answer one at a time, **Submit**, read why the other options are wrong, **retry** the ones you miss, and check your per-lecture score at the end. Numeric answers accept decimals or fractions (e.g. 14/45).",
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
            "After finishing, use **↺ Retry the ones I missed** until the score is full, then revisit the weakest lecture's ⚡ Recap.",
          ],
        },
      ],
    },
  ],
  quiz,
};
