"""Helpers for writing the 🌱 Simple tab of a lecture page.

A content script builds INTRO (one paragraph) and SECTIONS (list of {id, heading, slides, blocks}) with the
helpers below, then calls write(path, INTRO, SECTIONS). Running it again replaces the previous Simple tab.
Block types used: p, list, table, callout (formula/example/tip/remember/warn), answer, cards, check, diagram."""
import json, re


def P(t): return {"type": "p", "text": t}
def L(*items, ordered=False): return {"type": "list", "items": list(items), **({"ordered": True} if ordered else {})}
def F(title, t): return {"type": "callout", "kind": "formula", "title": title, "text": t}
def EX(title, t): return {"type": "callout", "kind": "example", "title": title, "text": t}
def ANS(value, t=""): return {"type": "answer", "value": value, **({"text": t} if t else {})}
def TIP(title, t): return {"type": "callout", "kind": "tip", "title": title, "text": t}
def WARN(title, t): return {"type": "callout", "kind": "warn", "title": title, "text": t}
def REM(t, title="Remember"): return {"type": "callout", "kind": "remember", "title": title, "text": t}
def CHK(q, options, answer, why): return {"type": "check", "q": q, "options": options, "answer": answer, "why": why}
def FIG(name, cap=None): return {"type": "diagram", "name": name, **({"caption": cap} if cap else {})}
def T(head, rows, caption=None): return {"type": "table", "head": head, "rows": rows, **({"caption": caption} if caption else {})}
def CARDS(*items): return {"type": "cards", "items": list(items)}
def CARD(title, text, tag=None, example=None, figure=None):
    c = {"title": title, "text": text}
    if tag: c["tag"] = tag
    if example: c["example"] = example
    if figure: c["figure"] = figure
    return c
def SEC(n, sid, heading, blocks, slides=""):
    return {"id": "s-" + sid, "heading": f"{n}. {heading}", "slides": slides, "blocks": blocks}


def write(path, intro, sections):
    src = open(path).read()
    # remove an existing simple tab (from "simpleIntro:" up to "summary: [")
    src = re.sub(r"\n  simpleIntro: [\s\S]*?(?=\n  summary: \[)", "", src, count=1)
    marker = "\n  summary: ["
    assert marker in src, path
    ins = ("\n  simpleIntro: " + json.dumps(intro, ensure_ascii=False) + ",\n\n  simple: "
           + json.dumps(sections, ensure_ascii=False, indent=2).replace("\n", "\n  ") + ",\n")
    src = src.replace(marker, ins + marker, 1)
    open(path, "w").write(src)
    print("wrote Simple tab:", path, len(sections), "sections")
