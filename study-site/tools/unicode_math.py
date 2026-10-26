"""Convert plain-Unicode formulas in the data files (e.g. "Σf = 1", "F(x) = P(X ≤ x)", "x̄", "σ/√n")
into KaTeX `$...$` so every formula renders in the same style.

Run from study-site/:   python3 tools/unicode_math.py [--write] [files...]
Without --write it prints a sample of the changes (dry run).

Only string fields that the app renders through markdown/KaTeX are touched (not titles, headings, ids…),
and never text that is already inside $…$, `code` or ```code blocks```."""
import re, sys, glob

SKIP_KEYS = {"title", "heading", "source", "short", "icon", "group", "id", "name", "kind", "type", "file",
             "level", "topic", "slides", "display", "unit", "placeholder", "pyq", "marks", "label"}

GREEK = {"α": "alpha", "β": "beta", "γ": "gamma", "δ": "delta", "ε": "epsilon", "ϵ": "epsilon", "ζ": "zeta", "η": "eta",
         "θ": "theta", "κ": "kappa", "λ": "lambda", "μ": "mu", "ν": "nu", "ξ": "xi", "π": "pi", "ρ": "rho", "σ": "sigma",
         "τ": "tau", "φ": "phi", "ϕ": "phi", "χ": "chi", "ψ": "psi", "ω": "omega", "Δ": "Delta", "Θ": "Theta",
         "Φ": "Phi", "Ω": "Omega", "Γ": "Gamma", "Λ": "Lambda"}
SUB = dict(zip("₀₁₂₃₄₅₆₇₈₉ₐₑₒₓᵢⱼₖₙₘₜₚₛₗₕᵣᵤᵥ₊₋", "0123456789aeoxijknmtpslhruv+-"))
SUP = dict(zip("⁰¹²³⁴⁵⁶⁷⁸⁹ᵀⁿˣᶻⁱᵏᵗʰᵖᵈ⁻⁺⁽⁾ᵃᵇᶜᵉ", "0123456789Tnxzikthpd-+()abce"))
COMB = {"\u0304": "bar", "\u0302": "hat", "\u0303": "tilde"}
FUNCS = {"Var": r"\text{Var}", "Cov": r"\text{Cov}", "log": r"\log", "ln": r"\ln", "exp": r"\exp", "max": r"\max",
         "min": r"\min", "sign": r"\text{sign}", "argmin": r"\arg\min", "argmax": r"\arg\max", "sigmoid": r"\text{sigmoid}",
         "SD": r"\text{SD}", "SE": r"\text{SE}", "IQR": r"\text{IQR}", "MSE": r"\text{MSE}", "RMSE": r"\text{RMSE}",
         "SSE": r"\text{SSE}", "SST": r"\text{SST}", "SSR": r"\text{SSR}", "SSTR": r"\text{SSTR}", "SSBL": r"\text{SSBL}",
         "MSTR": r"\text{MSTR}", "MSBL": r"\text{MSBL}", "TP": r"\text{TP}", "TN": r"\text{TN}", "FP": r"\text{FP}",
         "FN": r"\text{FN}", "TPR": r"\text{TPR}", "FPR": r"\text{FPR}", "CF": r"\text{CF}", "Gini": r"\text{Gini}",
         "Entropy": r"\text{Entropy}", "Gain": r"\text{Gain}", "Error": r"\text{Error}", "Precision": r"\text{Precision}",
         "Recall": r"\text{Recall}", "Accuracy": r"\text{Accuracy}", "odds": r"\text{odds}", "logit": r"\text{logit}",
         "ReLU": r"\text{ReLU}", "tanh": r"\tanh"}
RELS = {"=": "=", "≠": r"\ne", "≤": r"\le", "≥": r"\ge", "<": "<", ">": ">", "≈": r"\approx", "∈": r"\in", "⟺": r"\iff"}
BINS = {"+": "+", "−": "-", "-": "-", "×": r"\times", "·": r"\cdot", "/": "/", "÷": r"\div", "±": r"\pm"}
MATHCHARS = set(GREEK) | set(SUB) | set(SUP) | set(COMB) | set("Σ√∫∂∇‖≤≥≠≈∈∞′⟺±")


class Fail(Exception):
    pass


class Parser:
    def __init__(self, s, i):
        self.s, self.i, self.math, self.syms, self.ops, self.calls = s, i, False, 0, 0, 0

    def peek(self, k=0):
        j = self.i + k
        return self.s[j] if j < len(self.s) else ""

    def sp(self):
        while self.peek() == " ":
            self.i += 1

    # ---- atoms
    def scripts(self):
        out = ""
        sub = "".join(SUB.get(c, "") for c in self._take(SUB))
        sup = "".join(SUP.get(c, "") for c in self._take(SUP))
        if not sub:
            sub = "".join(SUB.get(c, "") for c in self._take(SUB))
        if sub:
            out += "_{%s}" % sub; self.math = True
        if sup:
            out += "^{%s}" % sup; self.math = True
        while self.peek() == "′":
            self.i += 1; out += "'"; self.math = True
        if self.peek() == "^":
            self.i += 1
            if self.peek() == "(":
                inner = self.group("(", ")", brackets=False)
                out += "^{%s}" % inner
            else:
                a = self.atom(allow_call=False)
                out += "^{%s}" % a
            self.math = True
        return out

    def _take(self, table):
        st = self.i
        while self.peek() and self.peek() in table:
            self.i += 1
        return self.s[st:self.i]

    def symbol(self):
        c = self.peek()
        if c in GREEK:
            self.i += 1; self.math = True
            base = "\\" + GREEK[c] + " "
        elif c.isascii() and c.isalpha():
            # multi-letter function / abbreviation?
            m = re.match(r"[A-Za-z]+", self.s[self.i:])
            word = m.group(0)
            if len(word) > 1:
                if word in FUNCS:
                    self.i += len(word)
                    return FUNCS[word] + (" " if FUNCS[word][-1].isalpha() else "") + self.scripts(), True
                # letter + digits like x1, Q3, w0  (only one letter followed by digits)
                raise Fail
            self.i += 1
            base = c
            if re.match(r"\d", self.peek()) and not re.match(r"\d*[A-Za-z]", self.s[self.i:]):
                d = re.match(r"\d+", self.s[self.i:]).group(0)
                self.i += len(d); base += "_{%s}" % d
        else:
            raise Fail
        m_us = re.match(r"_([A-Za-z0-9]+)", self.s[self.i:])
        if m_us and self.s[self.i - 1] != "_" and "_" not in base:
            w = m_us.group(1)
            base = base.rstrip() + ("_{\\text{%s}}" % w if len(w) > 1 and w.isalpha() else "_{%s}" % w)
            self.i += len(m_us.group(0)); self.math = True
        if self.peek() and self.peek() in COMB:
            base = "\\%s{%s}" % (COMB[self.peek()], base.strip()); self.i += 1; self.math = True
        base += self.scripts()
        self.syms += 1
        return base, False

    def group(self, op, cl, brackets=True):
        self.i += 1
        parts = []
        while True:
            self.sp()
            if self.peek() == cl:
                self.i += 1
                break
            if self.peek() == ",":
                self.i += 1; parts.append(", "); continue
            if self.peek() == "|":
                self.i += 1; parts.append(r" \mid "); continue
            if self.peek() == ";":
                self.i += 1; parts.append("; "); continue
            parts.append(self.expr(inside=True))
            if not parts[-1]:
                raise Fail
        inner = "".join(parts)
        if brackets:
            return {"(": "(", "[": "[", "{": r"\{"}[op] + inner + {")": ")", "]": "]", "}": r"\}"}[cl]
        return inner

    def atom(self, allow_call=True):
        self.sp()
        c = self.peek()
        if not c:
            raise Fail
        if c == "Σ":
            self.i += 1; self.math = True
            return r"\sum" + self.scripts() + " " + self.term(no_rel=True)
        if c == "∫":
            self.i += 1; self.math = True
            return r"\int" + self.scripts() + " " + self.term(no_rel=True)
        if c == "√":
            self.i += 1; self.math = True
            if self.peek() == "(":
                return r"\sqrt{%s}" % self.group("(", ")", brackets=False)
            return r"\sqrt{%s}" % self.atom(allow_call=False)
        if c and c in "∂∇":
            self.i += 1; self.math = True
            return {"∂": r"\partial ", "∇": r"\nabla "}[c] + self.atom()
        if c == "‖":
            self.i += 1; self.math = True
            inner = self.expr(inside=True)
            if self.peek() != "‖":
                raise Fail
            self.i += 1
            return r"\|%s\|" % inner + self.scripts()
        if c == "∞":
            self.i += 1; self.math = True
            return r"\infty"
        if c and c in "([":
            g = self.group(c, ")" if c == "(" else "]")
            return g + self.scripts()
        m = re.match(r"\d+(?:\.\d+)?%?", self.s[self.i:])
        if m:
            self.i += len(m.group(0))
            return m.group(0).replace("%", r"\%") + self.scripts()
        base, isfunc = self.symbol()
        if allow_call and self.peek() == "(":
            base += self.group("(", ")")
            if not isfunc:
                self.calls += 1
        return base

    # ---- expressions
    def term(self, no_rel=False):
        out = self.atom()
        while True:
            save = self.i
            # implicit multiplication: directly adjacent atom (no space), e.g. aμ, 2x, Σx f(x)
            c = self.peek()
            if c and (c in GREEK or c in "Σ√(" or (c.isascii() and c.isalpha())) and self.s[self.i - 1] != " ":
                try:
                    out += " " + self.atom()
                    continue
                except Fail:
                    self.i = save
                    break
            # space-juxtaposition only towards an obviously mathematical atom: f(x), σ, x̄, Σ…
            if c == " ":
                j = self.i + 1
                nxt = self.s[j:j + 2]
                if nxt and (nxt[0] in GREEK or nxt[0] in ("Σ", "√", "∂") or re.match(r"[A-Za-z]\(|[A-Za-z][\u0304\u0302₀-₉ᵢⱼₖₙ]", nxt)):
                    try:
                        self.i = j
                        out += " " + self.atom()
                        continue
                    except Fail:
                        self.i = save
                        break
            break
        return out

    def expr(self, inside=False):
        out = self.term()
        while True:
            save = self.i
            self.sp()
            c = self.peek()
            if c in RELS or c in BINS:
                # a hyphen/minus that is part of a word (x-axis) or a list bullet is not an operator
                if c == "-" and (self.s[self.i - 1] != " " or self.peek(1) != " "):
                    self.i = save
                    break
                if c == "·" and self.s[self.i - 1] == " " and ("=" in out or "\\le" in out or "\\ge" in out or re.match(r" [\d.]+%?[:\s]", self.s[self.i + 1:])):
                    self.i = save
                    break
                if c == "·" and re.match(r"\s*(?:[A-Z]{1,3}|CS|Lec)\d", self.s[self.i + 1:]):
                    self.i = save
                    break
                if c in "<>" and self.peek(1) and self.peek(1) in "/=":
                    self.i = save
                    break
                self.i += 1
                try:
                    rhs = self.term()
                except Fail:
                    self.i = save
                    break
                op = RELS.get(c) or BINS.get(c)
                if c in RELS:
                    self.ops += 1
                elif c not in "/":
                    self.ops += 1
                if c and c in "≤≥≠≈∈±×·÷−":
                    self.math = True
                out += " %s %s" % (op, rhs)
                continue
            self.i = save
            break
        return out


def tidy(latex):
    latex = re.sub(r"\s+", " ", latex).strip()
    latex = re.sub(r"(\\[a-zA-Z]+) (?=[_^(){},'])", r"\1", latex)   # \theta _{0} -> \theta_{0}
    latex = re.sub(r"_\{(\w)\}", r"_\1", latex)                      # _{0} -> _0
    latex = re.sub(r"\^\{(\w)\}", r"^\1", latex)
    latex = latex.replace(" / ", "/")
    return latex


def convert_segment(t):
    """t: text with no $…$ or code. Returns converted text and count."""
    out, i, n = [], 0, 0
    while i < len(t):
        c = t[i]
        start_ok = (i == 0 or not (t[i - 1].isalnum() or t[i - 1] in "_\\'’*")) and (c.isalnum() or c in MATHCHARS or c in "(‖")
        if start_ok and not t.startswith(("http", "www"), i):
            p = Parser(t, i)
            try:
                latex = p.expr()
                end = p.i
                # trim trailing spaces
                while end > i and t[end - 1] == " ":
                    end -= 1
                ok_bound = end >= len(t) or not (t[end].isalnum() or t[end] in ("\u0304", "\u0302"))
                span = t[i:end]
                if re.fullmatch(r"[A-Z]\((?:[a-e]|i{1,3}|iv|v)\)", span) and re.match(r"\s+[A-Za-z]", t[end:]):
                    raise Fail
                if re.fullmatch(r"[a-z]{1,2} × \d+(?:\.\d+)?", span) and re.search(r"\d\s$", t[:i]):
                    raise Fail
                numeric_eq = p.ops >= 2 and "=" in span and re.fullmatch(r"[\d.\s+−\-×·/()=%]+", span) is not None
                accept = ok_bound and (p.math or p.calls or numeric_eq or (p.ops >= 1 and p.syms >= 1 and re.search(r"[=<>≤≥]", span)))
                # single bare latin letter / number: never
                if accept and not re.fullmatch(r"[A-Za-z0-9.]+", t[i:end]):
                    out.append("$" + tidy(latex) + "$")
                    n += 1
                    i = end
                    continue
            except (Fail, RecursionError, IndexError):
                pass
        out.append(c)
        i += 1
    return "".join(out), n


PROTECT = re.compile(r"(```[\s\S]*?```|\b(?:[A-Z]{1,3}|Lec|CS|Set )\d+(?:\.\d+)?\s*·\s*[\d][\d–, ]*|`[^`]*`|\$\$[\s\S]*?\$\$|\$[^$\n]*\$|\[[^\]]*\]\([^)]*\)|https?://\S+)")


def convert_text(raw, quote='"'):
    """raw = JS string-literal content (escapes as in source). Work on an unescaped view for parsing."""
    # Represent JS escapes \n, \" and \\ so the parser sees real characters; re-escape on output.
    text = raw.replace("\\\\", "\x00").replace("\\" + quote, quote).replace("\\n", "\n").replace("\x00", "\\")
    parts = PROTECT.split(text)
    total = 0
    for k in range(0, len(parts), 2):
        # don't touch markdown table separator rows or flow blocks
        new, n = convert_segment(parts[k])
        parts[k] = new
        total += n
    out = "".join(parts)
    out = out.replace("\\", "\\\\").replace(quote, "\\" + quote)
    if quote == '"':
        out = out.replace("\n", "\\n")
    return out, total


LIT = re.compile(r'"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`')


def process(path, write):
    s = open(path).read()
    res, last, pos, total, samples = [], None, 0, 0, []
    for m in LIT.finditer(s):
        gap = s[pos:m.start()]
        keys = re.findall(r"(\w+)\s*:\s*[\[\"{(]?\s*$", gap) or re.findall(r"(\w+)\s*:", gap)
        if keys:
            last = keys[-1]
        res.append(gap)
        quote = '"' if m.group(1) is not None else "`"
        body = m.group(1) if quote == '"' else m.group(2)
        if (quote == "`" and "${" in body) or last in SKIP_KEYS or "import" in gap[-20:] or not re.search(r"[=<>(]|[^\x00-\x7f]", body):
            res.append(m.group(0))
        else:
            new, n = convert_text(body, quote)
            if n:
                total += n
                if len(samples) < 6:
                    samples.append((body[:150], new[:200]))
            res.append(quote + new + quote)
        pos = m.end()
    res.append(s[pos:])
    if write and total:
        open(path, "w").write("".join(res))
    return total, samples


if __name__ == "__main__":
    write = "--write" in sys.argv
    files = [a for a in sys.argv[1:] if not a.startswith("--")] or sorted(glob.glob("data/*/*.js"))
    grand = 0
    for f in files:
        n, samples = process(f, write)
        grand += n
        if n:
            print(f"{f}: {n}")
            if not write:
                for a, b in samples[:3]:
                    print("   -", a)
                    print("   +", b)
    print("total", grand, "(written)" if write else "(dry run)")
