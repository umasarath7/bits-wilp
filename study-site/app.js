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
    .replace(/\$([^$\n]+?)\$/g, (_, t) => stash(t, false));
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
    default:
      return null;
  }
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
function QuestionsTab({ items, storeKey, answerLabel }) {
  const [open, setOpen] = useState({});
  const [hint, setHint] = useState({});
  const [solved, setSolved] = useState(() => store.get(storeKey, {}));
  const [filter, setFilter] = useState("All");
  const levels = ["All", ...new Set(items.map((p) => p.level).filter(Boolean))];
  if (items.some((p) => p.pyq)) levels.push("📌 PYQ");
  const all = items.every((_, i) => open[i]);
  const markSolved = (i) => {
    const next = { ...solved, [i]: !solved[i] };
    setSolved(next);
    store.set(storeKey, next);
  };
  const solvedCount = items.filter((_, i) => solved[i]).length;
  const visible = (p) => filter === "All" || (filter === "📌 PYQ" ? p.pyq : p.level === filter);

  return html`<div>
    <div className="toolbar">
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
          ${p.level && html`<span className=${"badge " + p.level.toLowerCase()}>${p.level}</span>`}
          ${p.marks && html`<span className="badge marks">${p.marks} marks</span>`}
        </header>
        <${Md} text=${p.question} />
        <div className="problem-actions">
          <button className="btn" onClick=${() => setOpen((o) => ({ ...o, [i]: !o[i] }))}>
            ${open[i] ? `Hide ${answerLabel.toLowerCase()} ▴` : `Show ${answerLabel.toLowerCase()} ▾`}
          </button>
          ${p.hint && html`<button className="btn ghost" onClick=${() => setHint((h) => ({ ...h, [i]: !h[i] }))}>${hint[i] ? "Hide hint" : "💡 Hint"}</button>`}
          <label className="check"><input type="checkbox" checked=${!!solved[i]} onChange=${() => markSolved(i)} /> Done</label>
        </div>
        ${hint[i] && p.hint && html`<div className="callout tip hint"><${Md} text=${p.hint} /></div>`}
        ${open[i] && html`<div className="solution"><div className="sol-label">${answerLabel}</div><${Md} text=${p.solution} /></div>`}
      </article>`)}
  </div>`;
}

function QuizTab({ s }) {
  const [picked, setPicked] = useState({});
  const answered = Object.keys(picked).length;
  const score = s.quiz.filter((q, i) => picked[i] === q.answer).length;
  return html`<div>
    <div className="toolbar">
      <span><b>Score:</b> ${score} / ${answered} answered (${s.quiz.length} total)</span>
      <button className="btn ghost" onClick=${() => setPicked({})}>Reset</button>
    </div>
    ${s.quiz.map((q, i) => {
      const p = picked[i];
      const done = p !== undefined;
      return html`<div key=${i} className="card quiz">
        <div className="quiz-q"><span className="qnum">${i + 1}</span> <${Md} inline text=${q.q} /></div>
        <div className="options">
          ${q.options.map((o, j) => {
            let cls = "opt";
            if (done && j === q.answer) cls += " correct";
            else if (done && j === p) cls += " wrong";
            return html`<button key=${j} className=${cls} disabled=${done} onClick=${() => setPicked((x) => ({ ...x, [i]: j }))}>
              <span className="opt-letter">${"ABCD"[j]}</span> <span dangerouslySetInnerHTML=${{ __html: md(o, true) }} />
            </button>`;
          })}
        </div>
        ${done && html`<div className=${"why " + (p === q.answer ? "ok" : "no")}>
          ${p === q.answer ? "✓ Correct. " : "✗ Not quite. "}<${Md} inline text=${q.why} />
        </div>`}
      </div>`;
    })}
    ${answered === s.quiz.length && html`<div className="card final">
      You scored <b>${score}/${s.quiz.length}</b>. ${score === s.quiz.length ? "Excellent! 🎉" : score >= s.quiz.length * 0.7 ? "Good. Review the ones you missed." : "Re-read the notes and try again."}
    </div>`}
  </div>`;
}

// ---------- session view ----------

// "Session 3" / "S3" for numbered sessions; the entry's own label for extras like papers.
const label = (x, long) => typeof x.n === "number" ? (long ? `Session ${x.n}` : `S${x.n}`) : x.short || x.title;


function SessionView({ subject, session, tab: requestedTab, done, toggleDone }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const key = `${subject.id}:${session.n}`;

  useEffect(() => {
    setData(null); setErr(null);
    if (!session.file) return;
    import("./data/" + session.file.replace("./", ""))
      .then((m) => setData(m.default))
      .catch((e) => setErr(String(e)));
    document.querySelector(".main")?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [key]);

  // Fall back to Notes when the requested tab has no content for this session (e.g. no numericals).
  const tab = requestedTab === "notes" || data?.[requestedTab]?.length ? requestedTab : "notes";
  const changeTab = (t) => { location.hash = `#/${subject.id}/${session.n}/${t}`; };
  const idx = subject.sessions.indexOf(session);
  const prev = subject.sessions[idx - 1], next = subject.sessions[idx + 1];

  return html`<div className="session">
    <div className="session-head">
      <div className="eyebrow">${subject.code} · ${label(session, true)}</div>
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
        ${[["notes", "📖 Notes"], ["problems", `✍️ Numerical (${data.problems?.length || 0})`], ["theory", `📝 Theory (${data.theory?.length || 0})`], ["quiz", `❓ Quiz (${data.quiz?.length || 0})`]]
          .filter(([id]) => id === "notes" || data[id === "problems" ? "problems" : id]?.length)
          .map(([id, label]) =>
          html`<button key=${id} role="tab" className=${tab === id ? "on" : ""} onClick=${() => changeTab(id)}>${label}</button>`)}
      </div>
      ${tab === "notes" && html`<${NotesTab} s=${data} />`}
      ${tab === "problems" && html`<${QuestionsTab} key=${key + "p"} items=${data.problems || []} storeKey=${key + ":solved"} answerLabel="Solution" />`}
      ${tab === "theory" && html`<${QuestionsTab} key=${key + "t"} items=${data.theory || []} storeKey=${key + ":theory"} answerLabel="Model answer" />`}
      ${tab === "quiz" && html`<${QuizTab} s=${data} key=${key} />`}
      <div className="complete">
        <label className="check big"><input type="checkbox" checked=${!!done[key]} onChange=${() => toggleDone(key)} /> Mark session as revised</label>
      </div>`}

    <div className="pager">
      ${prev ? html`<a className="btn ghost" href=${`#/${subject.id}/${prev.n}`}>← ${label(prev)}: ${prev.title}</a>` : html`<span />`}
      ${next && html`<a className="btn ghost" href=${`#/${subject.id}/${next.n}`}>${label(next)}: ${next.title} →</a>`}
    </div>
  </div>`;
}

// ---------- layout ----------

function SubjectView({ subject, sessionN, tab, done, toggleDone }) {
  const [menu, setMenu] = useState(false);
  const session = subject.sessions.find((x) => String(x.n) === sessionN);
  useEffect(() => setMenu(false), [sessionN]);

  return html`<div className="layout">
    <header className="topbar">
      <button className="icon-btn menu-btn" aria-label="Sessions" onClick=${() => setMenu(!menu)}>☰</button>
      <a href="#/" className="brand">← All subjects</a>
      <span className="topbar-title">${subject.name}</span>
    </header>
    <div className=${"scrim " + (menu ? "show" : "")} onClick=${() => setMenu(false)} />
    <aside className=${"sidebar " + (menu ? "open" : "")}>
      <div className="side-title">${subject.code} Sessions</div>
      ${subject.sessions.length === 0 && html`<p className="muted small pad">No sessions yet.</p>`}
      ${subject.sessions.map((x, i) => html`
        ${x.group && x.group !== subject.sessions[i - 1]?.group && html`<div key=${"g" + i} className="side-title group">${x.group}</div>`}
        <a key=${x.n} href=${`#/${subject.id}/${x.n}`} className=${"side-item " + (String(x.n) === sessionN ? "active " : "") + (x.file ? "" : "pending")}>
          <span className="sn">${done[`${subject.id}:${x.n}`] ? "✓" : x.icon || x.n}</span>
          <span className="st">${x.title}</span>
        </a>`)}
    </aside>
    <main className="main">
      ${session
        ? html`<${SessionView} subject=${subject} session=${session} tab=${tab} done=${done} toggleDone=${toggleDone} />`
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
    <h1>M.Tech Sem 2: Study Notes</h1>
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
  return html`<${SubjectView} subject=${subject} sessionN=${sn || null} tab=${["notes", "problems", "theory", "quiz"].includes(tab) ? tab : "notes"} done=${done} toggleDone=${toggleDone} />`;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
