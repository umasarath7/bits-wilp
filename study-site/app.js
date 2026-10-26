import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import { marked } from "https://esm.sh/marked@12.0.2";
import { subjects } from "./data/subjects.js";
import { figures } from "./figures.js";

const html = htm.bind(React.createElement);
marked.setOptions({ breaks: true });

// ```flow fenced blocks render as box-and-arrow diagrams: one row per line, steps split by "->".
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
marked.use({
  renderer: {
    code(code, lang) {
      if (lang !== "flow") return false;
      const rows = code.trim().split("\n").filter(Boolean).map((line) => {
        const steps = line.split("->").map((x) => `<span class="flow-step">${esc(x.trim())}</span>`);
        return `<div class="flow-row">${steps.join('<span class="flow-arrow">→</span>')}</div>`;
      });
      return `<div class="flow">${rows.join("")}</div>`;
    },
  },
});

// ---------- helpers ----------

// Markdown + KaTeX. Math is pulled out before markdown so backslashes survive.
function md(text, inline = false) {
  if (!text) return "";
  const math = [];
  const stash = (tex, display) => {
    math.push({ tex, display });
    return `@@MATH${math.length - 1}@@`;
  };
  let src = String(text)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true))
    .replace(/\$([^$\n]+?)\$/g, (_, t) => stash(t, false))
    // A bare "<" (as in "x < 5") can be mistaken for the start of an HTML tag and swallow emphasis.
    .replace(/<(?=[\s\d=])/g, "&lt;");
  // Dedent by the common indentation only, so nested lists keep their structure.
  const lines = src.split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  src = lines.map((l) => l.slice(Number.isFinite(indent) ? indent : 0)).join("\n");
  let out = inline ? marked.parseInline(src) : marked.parse(src);
  return out.replace(/@@MATH(\d+)@@/g, (_, i) => {
    const { tex, display } = math[+i];
    try {
      return window.katex.renderToString(tex, { displayMode: display, throwOnError: false });
    } catch {
      return tex;
    }
  });
}
const Md = ({ text, inline, className }) =>
  html`<div className=${"md " + (className || "")} dangerouslySetInnerHTML=${{ __html: md(text, inline) }} />`;

const store = {
  get(k, d) {
    try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  },
};

function useHash() {
  const [hash, setHash] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    const on = () => setHash(location.hash.slice(1) || "/");
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return hash;
}

function useDone() {
  const [done, setDone] = useState(() => store.get("done", {}));
  const toggle = (key) => {
    const next = { ...done, [key]: !done[key] };
    setDone(next);
    store.set("done", next);
  };
  return [done, toggle];
}

// ---------- diagrams ----------

const diagrams = {
  tradVsMl: () => html`
    <figure className="diagram">
      <svg viewBox="0 0 520 150" role="img" aria-label="Traditional programming versus machine learning">
        <text x="130" y="16" className="dg-title">Traditional programming</text>
        <text x="390" y="16" className="dg-title">Machine learning</text>
        ${[0, 260].map((dx, k) => html`
          <g key=${k} transform=${`translate(${dx},0)`}>
            <rect x="10" y="32" width="70" height="30" rx="6" className="dg-in" />
            <text x="45" y="52" className="dg-t">Data</text>
            <rect x="10" y="92" width="70" height="30" rx="6" className="dg-in" />
            <text x="45" y="112" className="dg-t">${k ? "Output" : "Program"}</text>
            <path d="M80 47 L110 70 M80 107 L110 84" className="dg-line" />
            <rect x="110" y="55" width="80" height="44" rx="8" className="dg-box" />
            <text x="150" y="82" className="dg-t">Computer</text>
            <path d="M190 77 L212 77" className="dg-line" marker-end="url(#arr)" />
            <rect x="215" y="62" width="30" height="30" rx="6" className=${k ? "dg-out hl" : "dg-out"} />
            <text x="230" y="81" className="dg-t sm">${k ? "Prog" : "Out"}</text>
          </g>`)}
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="dg-arrow" />
          </marker>
        </defs>
      </svg>
      <figcaption>Traditional: Data + Program → Output. ML: Data + Output → <b>Program (model)</b>.</figcaption>
    </figure>`,
};

// ---------- content blocks ----------

function Block({ b }) {
  switch (b.type) {
    case "p":
      return html`<${Md} text=${b.text} />`;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return html`<${Tag} className="list">
        ${b.items.map((it, i) => html`<li key=${i} dangerouslySetInnerHTML=${{ __html: md(it, true) }} />`)}
      </${Tag}>`;
    }
    case "table":
      return html`<div className="table-wrap">
        ${b.caption && html`<div className="caption" dangerouslySetInnerHTML=${{ __html: md(b.caption, true) }} />`}
        <table>
          <thead><tr>${b.head.map((h, i) => html`<th key=${i} dangerouslySetInnerHTML=${{ __html: md(h, true) }} />`)}</tr></thead>
          <tbody>
            ${b.rows.map((r, i) => html`<tr key=${i}>
              ${r.map((c, j) => html`<td key=${j} dangerouslySetInnerHTML=${{ __html: md(c, true) }} />`)}
            </tr>`)}
          </tbody>
        </table>
      </div>`;
    case "search":
      return html`<${SearchTable} b=${b} />`;
    case "callout":
      return html`<div className=${"callout " + b.kind}>
        <div className="callout-title">${{ exam: "🎯 ", tip: "💡 ", warn: "⚠️ ", idea: "🧠 ", example: "✏️ ", formula: "📐 ", remember: "📝 " }[b.kind] || ""}${b.title}</div>
        <${Md} text=${b.text} />
      </div>`;
    case "diagram": {
      const F = figures[b.name];
      if (F) return html`<figure className="figure">
        <div dangerouslySetInnerHTML=${{ __html: F.svg }} />
        <figcaption><${Md} text=${b.caption || F.caption} /></figcaption>
      </figure>`;
      const D = diagrams[b.name];
      return D ? html`<${D} />` : null;
    }
    case "answer":
      return html`<div className="answer-box">
        <div className="answer-label">${b.label || "Answer"}</div>
        ${b.value && html`<div className="answer-value"><${Md} inline text=${b.value} /></div>`}
        ${b.text && html`<${Md} text=${b.text} />`}
      </div>`;
    case "cards":
      return html`<div className="cards-grid">
        ${b.items.map((c, i) => html`<div key=${i} className="pcard">
          ${c.figure && figures[c.figure] && html`<div className="pcard-fig" dangerouslySetInnerHTML=${{ __html: figures[c.figure].svg }} />`}
          <div className="pcard-body">
            <div className="pcard-title">${c.title}</div>
            ${c.tag && html`<span className="pcard-tag">${c.tag}</span>`}
            <${Md} text=${c.text} />
            ${c.example && html`<div className="pcard-ex"><${Md} inline text=${"*Example:* " + c.example} /></div>`}
          </div>
        </div>`)}
      </div>`;
    case "check":
      return html`<${CheckQ} b=${b} />`;
    default:
      return null;
  }
}

// A one-question self-check: pick an option, see right/wrong and why.
function CheckQ({ b }) {
  const [pick, setPick] = useState(null);
  return html`<div className="check-q">
    <div className="check-stem"><${Md} inline text=${b.q} /></div>
    <div className="check-opts">
      ${b.options.map((o, j) => html`<button key=${j} disabled=${pick !== null}
        className=${"check-opt" + (pick === null ? "" : j === b.answer ? " right" : j === pick ? " wrong" : "")}
        onClick=${() => setPick(j)}><span dangerouslySetInnerHTML=${{ __html: md(o, true) }} /></button>`)}
    </div>
    ${pick !== null && html`<div className=${"why " + (pick === b.answer ? "ok" : "no")}>
      <b>${pick === b.answer ? "✅ Correct. " : "❌ Not quite. "}</b><${Md} inline text=${b.why} />
      <button className="btn ghost small" onClick=${() => setPick(null)}>Try again</button>
    </div>`}
  </div>`;
}

// A table with a filter box: rows stay visible when any cell contains every typed word.
function SearchTable({ b }) {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = b.rows.filter((r) => {
    const text = r.join(" ").toLowerCase();
    return words.every((w) => text.includes(w));
  });
  return html`<div className="table-wrap search-table">
    <input className="search" type="search" value=${q} placeholder=${b.placeholder || "Search…"} onInput=${(e) => setQ(e.target.value)} />
    <div className="muted small">${rows.length} of ${b.rows.length} shown</div>
    <table>
      <thead><tr>${b.head.map((h, i) => html`<th key=${i} dangerouslySetInnerHTML=${{ __html: md(h, true) }} />`)}</tr></thead>
      <tbody>
        ${rows.map((r) => html`<tr key=${r[0] + r[1]}>
          ${r.map((c, j) => html`<td key=${j} dangerouslySetInnerHTML=${{ __html: md(c, true) }} />`)}
        </tr>`)}
      </tbody>
    </table>
  </div>`;
}

// ---------- tabs ----------

function NotesTab({ s }) {
  const [closed, setClosed] = useState({});
  return html`<div>
    ${s.overview && html`<div className="overview"><b>In one paragraph:</b> <${Md} inline text=${s.overview} /></div>`}
    <nav className="chips">
      ${s.summary.map((sec) => html`<a key=${sec.id} href=${"#sec-" + sec.id} onClick=${(e) => {
        e.preventDefault();
        setClosed((c) => ({ ...c, [sec.id]: false }));
        document.getElementById("sec-" + sec.id)?.scrollIntoView({ behavior: "smooth" });
      }}>${sec.heading.replace(/^\d+\.\s*/, "")}</a>`)}
      ${s.glossary?.length > 0 && html`<a href="#glossary" onClick=${(e) => { e.preventDefault(); document.getElementById("glossary")?.scrollIntoView({ behavior: "smooth" }); }}>Glossary</a>`}
      ${s.keyTerms?.length > 0 && html`<a href="#terms" onClick=${(e) => { e.preventDefault(); document.getElementById("terms")?.scrollIntoView({ behavior: "smooth" }); }}>Key terms</a>`}
    </nav>

    ${s.summary.map((sec) => html`
      <section key=${sec.id} id=${"sec-" + sec.id} className="card section">
        <button className="section-head" onClick=${() => setClosed((c) => ({ ...c, [sec.id]: !c[sec.id] }))}>
          <span>${sec.heading}</span>
          <span className="meta">${sec.slides && html`<span className="slides">slides ${sec.slides}</span>`}
            <span className=${"chev " + (closed[sec.id] ? "" : "open")}>▾</span></span>
        </button>
        ${!closed[sec.id] && html`<div className="section-body">${sec.blocks.map((b, i) => html`<${Block} key=${i} b=${b} />`)}</div>`}
      </section>`)}

    ${s.glossary?.length > 0 && html`<section id="glossary" className="card section">
      <div className="section-head static"><span>📚 Glossary of terms and abbreviations</span></div>
      <div className="section-body">
        <div className="table-wrap"><table>
          <thead><tr><th>Term / symbol</th><th>Full name</th><th>What it means in plain words</th></tr></thead>
          <tbody>${s.glossary.map((row, i) => html`<tr key=${i}>${row.map((c, j) => html`<td key=${j} dangerouslySetInnerHTML=${{ __html: md(c, true) }} />`)}</tr>`)}</tbody>
        </table></div>
      </div>
    </section>`}

    ${s.keyTerms?.length > 0 && html`<section id="terms" className="card section">
      <div className="section-head static"><span>Key terms</span></div>
      <div className="section-body terms">
        ${s.keyTerms.map(([t, d]) => html`<div key=${t} className="term"><b dangerouslySetInnerHTML=${{ __html: md(t, true) }} /><span dangerouslySetInnerHTML=${{ __html: md(d, true) }} /></div>`)}
      </div>
    </section>`}

    ${s.examTips?.length > 0 && html`<section className="card section">
      <div className="section-head static"><span>🎯 Exam tips</span></div>
      <div className="section-body">
        <ul className="list">${s.examTips.map((t, i) => html`<li key=${i} dangerouslySetInnerHTML=${{ __html: md(t, true) }} />`)}</ul>
      </div>
    </section>`}
  </div>`;
}

// Shared by the Problems (numerical) and Theory tabs.
function QuestionsTab({ items, storeKey, answerLabel, legacyKeys }) {
  const [open, setOpen] = useState({});
  const [hint, setHint] = useState({});
  // Progress is stored per question id; older per-tab progress (numerical / theory) is carried over once.
  const [solved, setSolved] = useState(() => {
    const cur = store.get(storeKey, null);
    if (cur || !legacyKeys) return cur || {};
    const merged = {};
    items.forEach((p, i) => { if (p.legacy && store.get(legacyKeys[p.legacy[0]], {})[p.legacy[1]]) merged[i] = true; });
    return merged;
  });
  const [filter, setFilter] = useState("All");
  const [kind, setKind] = useState("All");
  const kinds = [...new Set(items.map((p) => p.kind).filter(Boolean))];
  const levels = ["All", ...new Set(items.map((p) => p.level).filter(Boolean))];
  if (items.some((p) => p.pyq)) levels.push("📌 PYQ");
  const all = items.every((_, i) => open[i]);
  const markSolved = (i) => {
    const next = { ...solved, [i]: !solved[i] };
    setSolved(next);
    store.set(storeKey, next);
  };
  const solvedCount = items.filter((_, i) => solved[i]).length;
  const visible = (p) => (kind === "All" || p.kind === kind) && (filter === "All" || (filter === "📌 PYQ" ? p.pyq : p.level === filter));

  return html`<div>
    <div className="toolbar">
      ${kinds.length > 1 && html`<div className="seg">
        ${["All", ...kinds].map((k) => html`<button key=${k} className=${kind === k ? "on" : ""} onClick=${() => setKind(k)}>${k === "Numerical" ? "✍️ Numerical" : k === "Theory" ? "📝 Theory" : "All types"}</button>`)}
      </div>`}
      ${levels.length > 2 && html`<div className="seg">
        ${levels.map((l) => html`<button key=${l} className=${filter === l ? "on" : ""} onClick=${() => setFilter(l)}>${l}</button>`)}
      </div>`}
      <span className="muted">${solvedCount}/${items.length} done</span>
      <button className="btn ghost" onClick=${() => setOpen(all ? {} : Object.fromEntries(items.map((_, i) => [i, true])))}>
        ${all ? "Hide all answers" : "Show all answers"}
      </button>
    </div>
    ${items.map((p, i) => !visible(p) ? null : html`
      <article key=${i} className=${"card problem " + (solved[i] ? "is-solved" : "")}>
        <header>
          <span className="qnum">Q${i + 1}</span>
          <h3>${p.title}</h3>
          ${p.pyq && html`<span className="badge pyq" title=${typeof p.pyq === "string" ? p.pyq : "Same pattern as a previous-year question"}>📌 PYQ</span>`}
          ${p.kind === "Theory" && html`<span className="badge theory">Theory</span>`}
          ${p.level && html`<span className=${"badge " + p.level.toLowerCase().replace(/\s+/g, "-")}>${p.level}</span>`}
          ${p.marks && html`<span className="badge marks">${p.marks} marks</span>`}
        </header>
        <${Md} text=${p.question} />
        <div className="problem-actions">
          <button className="btn" onClick=${() => setOpen((o) => ({ ...o, [i]: !o[i] }))}>
            ${open[i] ? `Hide ${(p.answerLabel || answerLabel).toLowerCase()} ▴` : `Show ${(p.answerLabel || answerLabel).toLowerCase()} ▾`}
          </button>
          ${p.hint && html`<button className="btn ghost" onClick=${() => setHint((h) => ({ ...h, [i]: !h[i] }))}>${hint[i] ? "Hide hint" : "💡 Hint"}</button>`}
          <label className="check"><input type="checkbox" checked=${!!solved[i]} onChange=${() => markSolved(i)} /> Done</label>
        </div>
        ${hint[i] && p.hint && html`<div className="callout tip hint"><${Md} text=${p.hint} /></div>`}
        ${open[i] && html`<div className="solution"><div className="sol-label">${p.answerLabel || answerLabel}</div><${Md} text=${p.solution} /></div>`}
      </article>`)}
  </div>`;
}

// One-screen recap of a session: few words, a diagram or two, the exam hook.
function RecapTab({ s }) {
  return html`<div className="card recap">
    <div className="section-body">${s.recap.map((b, i) => html`<${Block} key=${i} b=${b} />`)}</div>
  </div>`;
}

// Quiz questions are MCQ ({options, answer: index}) or numeric ({type: "num", answer: number, tol?, unit?}).
// Optional: topic (for topic quizzes and the score summary), wrong: [why each option is wrong], solution.
const numOf = (t) => {
  const m = String(t).trim().replace(/,/g, "").match(/^(-?[\d.]+)\s*(?:\/\s*(-?[\d.]+))?\s*%?$/);
  if (!m) return NaN;
  return m[2] !== undefined ? +m[1] / +m[2] : +m[1];
};
const isRight = (q, st) => {
  if (!st?.submitted || st.revealed) return false;
  if (q.type !== "num") return st.pick === q.answer;
  const x = numOf(st.num), tol = q.tol ?? Math.max(Math.abs(q.answer) * 0.01, 0.005);
  return Math.abs(x - q.answer) <= tol;
};

function QuizItem({ q, n, st = {}, set, instant, practice }) {
  const done = st.submitted || st.revealed;
  const ok = isRight(q, st);
  const canSubmit = q.type === "num" ? String(st.num ?? "").trim() !== "" : st.pick !== undefined;
  const submit = () => canSubmit && set({ ...st, submitted: true });
  return html`<div className="card quiz">
    <div className="quiz-q"><span className="qnum">${n}</span> <${Md} inline text=${q.q} />
      ${q.topic && html`<span className="badge topic">${q.topic}</span>`}</div>
    ${q.type === "num"
      ? html`<div className="num-answer">
          <input type="text" inputMode="decimal" placeholder="Your answer" value=${st.num ?? ""} disabled=${done}
            onInput=${(e) => set({ ...st, num: e.target.value })} onKeyDown=${(e) => e.key === "Enter" && submit()} />
          ${q.unit && html`<span className="muted">${q.unit}</span>`}
        </div>`
      : html`<div className="options">
          ${q.options.map((o, j) => {
            let cls = "opt";
            if (done && j === q.answer) cls += " correct";
            else if (done && j === st.pick) cls += " wrong";
            else if (!done && j === st.pick) cls += " picked";
            return html`<button key=${j} className=${cls} disabled=${done}
              onClick=${() => set(instant ? { ...st, pick: j, submitted: true } : { ...st, pick: j })}>
              <span className="opt-letter">${"ABCDEF"[j]}</span> <span dangerouslySetInnerHTML=${{ __html: md(o, true) }} />
            </button>`;
          })}
        </div>`}
    ${!done && html`<div className="problem-actions">
      ${(!instant || q.type === "num") && html`<button className="btn" disabled=${!canSubmit} onClick=${submit}>Submit</button>`}
      ${practice && html`<button className="btn ghost" onClick=${() => set({ ...st, revealed: true })}>Show solution</button>`}
    </div>`}
    ${done && html`<div className=${"why " + (ok ? "ok" : "no")}>
      ${st.revealed ? "Solution: " : ok ? "✓ Correct. " : "✗ Not quite. "}
      ${q.type === "num" && !ok && html`<span>The answer is <b>${q.display ?? +(+q.answer).toFixed(4)}${q.unit ? " " + q.unit : ""}</b>. </span>`}
      <${Md} inline text=${q.why} />
      ${q.wrong && q.type !== "num" && html`<ul className="list wrong-list">
        ${q.wrong.map((w, j) => w && j !== q.answer ? html`<li key=${j}><b>${"ABCDEF"[j]}</b> is wrong: <span dangerouslySetInnerHTML=${{ __html: md(w, true) }} /></li>` : null)}
      </ul>`}
      ${q.solution && html`<div className="solution"><${Md} text=${q.solution} /></div>`}
    </div>`}
    ${done && !ok && html`<div className="problem-actions"><button className="btn ghost" onClick=${() => set({})}>↺ Retry this question</button></div>`}
  </div>`;
}

function QuizTab({ s }) {
  const [mode, setMode] = useState(s.quizMode || "all");
  const [practice, setPractice] = useState(true);
  const [topic, setTopic] = useState("All topics");
  const [st, setSt] = useState({});
  const [cur, setCur] = useState(0);
  const topics = [...new Set(s.quiz.map((q) => q.topic).filter(Boolean))];
  const list = s.quiz.map((q, i) => ({ q, i })).filter(({ q }) => topic === "All topics" || q.topic === topic);
  const set = (i) => (v) => setSt((x) => ({ ...x, [i]: v }));
  const answered = list.filter(({ i }) => st[i]?.submitted || st[i]?.revealed).length;
  const score = list.filter(({ q, i }) => isRight(q, st[i])).length;
  const restart = () => { setSt({}); setCur(0); };
  const retryWrong = () => {
    setSt((x) => Object.fromEntries(Object.entries(x).filter(([i]) => isRight(s.quiz[i], x[i]))));
    const first = list.findIndex(({ q, i }) => !isRight(q, st[i]));
    setCur(Math.max(first, 0));
  };
  const finished = answered === list.length && list.length > 0;
  const byTopic = topics.map((t) => {
    const qs = list.filter(({ q }) => q.topic === t);
    return [t, qs.filter(({ q, i }) => isRight(q, st[i])).length, qs.length];
  }).filter(([, , n]) => n);

  return html`<div>
    <div className="toolbar">
      <div className="seg">
        <button className=${mode === "step" ? "on" : ""} onClick=${() => setMode("step")}>🎯 One at a time</button>
        <button className=${mode === "all" ? "on" : ""} onClick=${() => setMode("all")}>📋 All questions</button>
      </div>
      <label className="check"><input type="checkbox" checked=${practice} onChange=${() => setPractice(!practice)} /> Practice mode</label>
      <span><b>Score:</b> ${score} / ${answered} answered (${list.length} total)</span>
      <button className="btn ghost" onClick=${restart}>Reset</button>
    </div>
    ${topics.length > 1 && html`<div className="toolbar">
      <div className="seg wrap">
        ${["All topics", ...topics].map((t) => html`<button key=${t} className=${topic === t ? "on" : ""} onClick=${() => { setTopic(t); setCur(0); }}>${t === "All topics" ? "🔀 Mixed (all topics)" : t}</button>`)}
      </div>
    </div>`}

    ${mode === "all" && list.map(({ q, i }, k) => html`<${QuizItem} key=${i} q=${q} n=${k + 1} st=${st[i]} set=${set(i)} instant=${true} practice=${practice} />`)}

    ${mode === "step" && list.length > 0 && !finished && (() => {
      const k = Math.min(cur, list.length - 1), { q, i } = list[k];
      return html`<div>
        <div className="progress quiz-progress"><div style=${{ width: (answered / list.length) * 100 + "%" }} /></div>
        <div className="muted small">Question ${k + 1} of ${list.length}</div>
        <${QuizItem} key=${i} q=${q} n=${k + 1} st=${st[i]} set=${set(i)} instant=${false} practice=${practice} />
        <div className="pager">
          <button className="btn ghost" disabled=${k === 0} onClick=${() => setCur(k - 1)}>← Previous</button>
          <button className="btn" onClick=${() => setCur(k + 1 < list.length ? k + 1 : list.findIndex(({ i: j }) => !(st[j]?.submitted || st[j]?.revealed)))}>Next →</button>
        </div>
      </div>`;
    })()}

    ${finished && html`<div className="card final">
      You scored <b>${score}/${list.length}</b>. ${score === list.length ? "Excellent! 🎉" : score >= list.length * 0.7 ? "Good. Review the ones you missed." : "Re-read the notes and try again."}
      ${byTopic.length > 0 && html`<div className="table-wrap"><table>
        <thead><tr><th>Topic</th><th>Correct</th><th></th></tr></thead>
        <tbody>${byTopic.map(([t, c, n]) => html`<tr key=${t}><td>${t}</td><td>${c} / ${n}</td><td>${c === n ? "✓" : c / n >= 0.5 ? "Revise" : "Re-read the notes"}</td></tr>`)}</tbody>
      </table></div>`}
      <div className="problem-actions center">
        ${score < list.length && html`<button className="btn" onClick=${retryWrong}>↺ Retry the ones I missed</button>`}
        <button className="btn ghost" onClick=${restart}>Start again</button>
      </div>
    </div>`}
  </div>`;
}

// ---------- session view ----------

// "Session 3" / "S3" for numbered sessions; the entry's own label for extras like papers.
const label = (x, long, unit = "Session") => typeof x.n === "number" ? (long ? `${unit} ${x.n}` : `${unit[0]}${x.n}`) : x.short || x.title;


function SessionView({ subject, session, tab: requestedTab, done, toggleDone, onData }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const key = `${subject.id}:${session.n}`;

  useEffect(() => {
    setData(null); setErr(null);
    if (!session.file) return;
    import("./data/" + session.file.replace("./", ""))
      .then((m) => { setData(m.default); onData?.({ key, sections: (m.default.summary || []).map((x) => [x.id, x.heading]) }); })
      .catch((e) => setErr(String(e)));
    document.querySelector(".main")?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [key]);

  // Fall back to Notes when the requested tab has no content for this session (e.g. no numericals).
  const home = data?.simple?.length ? "simple" : "notes";
  // Numerical problems and theory questions share one "Solved Questions" tab.
  const solvedItems = [
    ...(data?.problems || []).map((p, i) => ({ ...p, kind: "Numerical", legacy: ["n", i] })),
    ...(data?.theory || []).map((p, i) => ({ ...p, kind: "Theory", answerLabel: "Model answer", legacy: ["t", i] })),
  ];
  const want = requestedTab === "theory" ? "problems" : requestedTab;
  const tab = want && (want === "notes" || (want === "problems" ? solvedItems.length : data?.[want]?.length)) ? want : home;
  const changeTab = (t) => { location.hash = `#/${subject.id}/${session.n}/${t}`; };
  const idx = subject.sessions.indexOf(session);
  const prev = subject.sessions[idx - 1], next = subject.sessions[idx + 1];

  return html`<div className="session">
    <div className="session-head">
      <div className="eyebrow">${subject.code} · ${label(session, true, subject.unit)}</div>
      <h1>${data?.title || session.title}</h1>
      ${data && html`<div className="muted small">Source: ${data.source}</div>`}
    </div>

    ${!session.file && html`<div className="card empty">
      <p>📭 Notes for this session haven't been added yet.</p>
      <p className="muted small">Share the slide deck and it will be summarised with the same template.</p>
    </div>`}
    ${err && html`<div className="card empty">Couldn't load this session: ${err}</div>`}
    ${session.file && !data && !err && html`<div className="loading">Loading…</div>`}

    ${data && html`
      <div className="tabs" role="tablist">
        ${[["simple", "🌱 Simple"], ["notes", data.simple?.length ? "📊 Slides" : "📖 Notes"], ["recap", "⚡ Recap"], ["problems", `✍️ Solved Questions (${solvedItems.length})`], ["quiz", `❓ Quiz (${data.quiz?.length || 0})`]]
          .filter(([id]) => id === "notes" || (id === "problems" ? solvedItems.length : data[id]?.length))
          .map(([id, label]) =>
          html`<button key=${id} role="tab" className=${tab === id ? "on" : ""} onClick=${() => changeTab(id)}>${label}</button>`)}
      </div>
      ${tab === "simple" && html`<${NotesTab} s=${{ overview: data.simpleIntro, summary: data.simple }} />`}
      ${tab === "notes" && html`<${NotesTab} s=${data} />`}
      ${tab === "recap" && html`<${RecapTab} s=${data} />`}
      ${tab === "problems" && html`<${QuestionsTab} key=${key + "q"} items=${solvedItems} storeKey=${key + ":questions"} answerLabel="Solution"
        legacyKeys=${{ n: key + ":solved", t: key + ":theory" }} />`}
      ${tab === "quiz" && html`<${QuizTab} s=${data} key=${key} />`}
      <div className="complete">
        <label className="check big"><input type="checkbox" checked=${!!done[key]} onChange=${() => toggleDone(key)} /> Mark session as revised</label>
      </div>`}

    <div className="pager">
      ${prev ? html`<a className="btn ghost" href=${`#/${subject.id}/${prev.n}`}>← ${label(prev, false, subject.unit)}: ${prev.title}</a>` : html`<span />`}
      ${next && html`<a className="btn ghost" href=${`#/${subject.id}/${next.n}`}>${label(next, false, subject.unit)}: ${next.title} →</a>`}
    </div>
  </div>`;
}

// ---------- layout ----------

function SubjectView({ subject, sessionN, tab, done, toggleDone }) {
  const [menu, setMenu] = useState(false);
  const [toc, setToc] = useState(null);
  const [tocOpen, setTocOpen] = useState(true);
  const session = subject.sessions.find((x) => String(x.n) === sessionN);
  useEffect(() => setMenu(false), [sessionN]);
  // Sidebar topic link: open the Notes tab, then scroll to that lesson.
  const goTopic = (e, x, id) => {
    e.preventDefault();
    setMenu(false);
    location.hash = `#/${subject.id}/${x.n}/notes`;
    setTimeout(() => document.getElementById("sec-" + id)?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  return html`<div className="layout">
    <header className="topbar">
      <button className="icon-btn menu-btn" aria-label="Sessions" onClick=${() => setMenu(!menu)}>☰</button>
      <a href="#/" className="brand">← All subjects</a>
      <span className="topbar-title">${subject.name}</span>
    </header>
    <div className=${"scrim " + (menu ? "show" : "")} onClick=${() => setMenu(false)} />
    <aside className=${"sidebar " + (menu ? "open" : "")}>
      <div className="side-title">${subject.code} ${subject.unit ? subject.unit + "s" : "Sessions"}</div>
      ${subject.sessions.length === 0 && html`<p className="muted small pad">No sessions yet.</p>`}
      ${subject.sessions.map((x, i) => html`
        ${x.group && x.group !== subject.sessions[i - 1]?.group && html`<div key=${"g" + i} className="side-title group">${x.group}</div>`}
        <a key=${x.n} href=${`#/${subject.id}/${x.n}`} className=${"side-item " + (String(x.n) === sessionN ? "active " : "") + (x.file ? "" : "pending")}>
          <span className="sn">${done[`${subject.id}:${x.n}`] ? "✓" : x.icon || x.n}</span>
          <span className="st">${x.title}</span>
          ${String(x.n) === sessionN && toc?.key === `${subject.id}:${x.n}` && toc.sections.length > 1 && html`<button className="toc-toggle" title="Show/hide topics"
            onClick=${(e) => { e.preventDefault(); e.stopPropagation(); setTocOpen(!tocOpen); }}>${tocOpen ? "▾" : "▸"}</button>`}
        </a>
        ${String(x.n) === sessionN && tocOpen && toc?.key === `${subject.id}:${x.n}` && toc.sections.length > 1 && html`<div key=${"toc" + i} className="side-toc">
          ${toc.sections.map(([id, h]) => html`<a key=${id} href=${`#/${subject.id}/${x.n}/notes`} onClick=${(e) => goTopic(e, x, id)}>${h.replace(/^Lesson \d+:\s*/, "")}</a>`)}
        </div>`}`)}
    </aside>
    <main className="main">
      ${session
        ? html`<${SessionView} subject=${subject} session=${session} tab=${tab} done=${done} toggleDone=${toggleDone} onData=${setToc} />`
        : html`<div className="session">
            <div className="eyebrow">${subject.code}</div>
            <h1>${subject.name}</h1>
            <p className="muted">${subject.blurb}</p>
            <p>${subject.sessions.length ? "Pick a session from the menu to start." : "No sessions added yet."}</p>
          </div>`}
    </main>
  </div>`;
}

function Landing({ done }) {
  return html`<div className="landing">
    <h1>BITS-WILP-DSE</h1>
    <p className="muted">Session-by-session summaries, exam-style problems and quick quizzes.</p>
    <div className="grid">
      ${subjects.map((s) => {
        const lectures = s.sessions.filter((x) => typeof x.n === "number");
        const ready = lectures.filter((x) => x.file).length;
        const rev = lectures.filter((x) => done[`${s.id}:${x.n}`]).length;
        const pct = lectures.length ? Math.round((rev / lectures.length) * 100) : 0;
        return html`<a key=${s.id} href=${`#/${s.id}`} className="card subject">
          <div className="code">${s.code}</div>
          <h2>${s.name}</h2>
          <p className="muted small">${s.blurb}</p>
          <div className="progress"><div style=${{ width: pct + "%" }} /></div>
          <div className="small muted">${ready}/${lectures.length} sessions ready · ${rev} revised</div>
        </a>`;
      })}
    </div>
  </div>`;
}

function App() {
  const hash = useHash();
  const [done, toggleDone] = useDone();
  const [, sid, sn, tab] = hash.split("/");
  const subject = subjects.find((s) => s.id === sid);
  if (!subject) return html`<${Landing} done=${done} />`;
  return html`<${SubjectView} subject=${subject} sessionN=${sn || null} tab=${["simple", "notes", "recap", "problems", "theory", "quiz"].includes(tab) ? tab : null} done=${done} toggleDone=${toggleDone} />`;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);

// ---------- installable app + offline ----------
// Register the service worker, then (when idle and online) save every page's data and the libraries
// this visit loaded into the cache, so the whole site works offline after one visit.
if ("serviceWorker" in navigator) {
  addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      if (!navigator.onLine || !("caches" in window)) return;
      const cache = await caches.open("bits-wilp-dse-v2");
      const files = subjects.flatMap((s) => s.sessions.map((x) => new URL("./data/" + x.file.replace("./", ""), location.href).href));
      const loaded = performance.getEntriesByType("resource").map((r) => r.name).filter((u) => /^https:\/\/(esm\.sh|cdn\.jsdelivr\.net)\//.test(u));
      const katex = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/KaTeX_";
      loaded.push(...["Main-Regular", "Main-Bold", "Main-Italic", "Math-Italic", "Math-BoldItalic", "AMS-Regular", "Size1-Regular",
        "Size2-Regular", "Size3-Regular", "Size4-Regular", "Caligraphic-Regular", "SansSerif-Regular", "Typewriter-Regular"].map((f) => katex + f + ".woff2"));
      const warm = () => [...new Set([...files, ...loaded])].forEach((u) =>
        cache.match(u).then((hit) => hit || fetch(u, { mode: u.startsWith(location.origin) ? "same-origin" : "cors" }).then((r) => r.ok && cache.put(u, r)).catch(() => {})));
      setTimeout(warm, 2000);
    } catch {}
  });
}
