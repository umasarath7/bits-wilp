"""Generate teaching figures (inline SVG) for the study site.

Run:  python3 tools/gen_figures.py      (from study-site/)
Writes: figures.js  ->  export const figures = { name: { svg, caption } }

Every coordinate that represents data is computed here (fits, curves, contours,
margins), so the pictures match the numbers in the notes. Colours come from CSS
variables (see styles.css, "teaching figures"), so the figures follow light/dark mode.
"""
import json, math, random

W = 440  # default viewBox width; text is sized for this so it stays legible on phones

# ---------------------------------------------------------------- primitives

def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def text(x, y, s, cls="t", anchor="middle", extra=""):
    return f'<text x="{f(x)}" y="{f(y)}" class="{cls}" text-anchor="{anchor}"{extra}>{esc(s)}</text>'

def ml_text(x, y, lines, cls="t", anchor="middle", lh=15):
    """Multi-line text centred vertically on y."""
    y0 = y - (len(lines) - 1) * lh / 2
    return "".join(text(x, y0 + i * lh + 4, s, cls, anchor) for i, s in enumerate(lines))

SOFT = {"box", "box2", "box3", "cell1", "cell2", "cell3", "cg", "cb", "zone1", "n1", "n3"}

def rect(x, y, w, h, cls="box", r=6, extra=""):
    under = f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{r}" class="under"/>' if cls in SOFT else ""
    return under + f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{r}" class="{cls}"{extra}/>'

def line(x1, y1, x2, y2, cls="ax", extra=""):
    return f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" class="{cls}"{extra}/>'

def circle(x, y, r, cls, title=None):
    t = f"<title>{esc(title)}</title>" if title else ""
    if cls in ("n1", "n3"):
        return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" class="under"/><circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" class="{cls}">{t}</circle>'
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" class="{cls}">{t}</circle>'

def square(x, y, s, cls, title=None):
    t = f"<title>{esc(title)}</title>" if title else ""
    return f'<rect x="{f(x - s)}" y="{f(y - s)}" width="{f(2 * s)}" height="{f(2 * s)}" rx="1.5" class="{cls}">{t}</rect>'

def path(pts, cls="l1", close=False):
    d = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts) + (" Z" if close else "")
    under = f'<path d="{d}" class="under"/>' if cls in ("cell1", "cell2", "cell3") else ""
    return under + f'<path d="{d}" class="{cls}"/>'

class Fig:
    def __init__(self, name, h, w=W):
        self.name, self.w, self.h, self.parts = name, w, h, []
    def add(self, *s):
        self.parts.extend(s)
        return self
    def arrow(self, x1, y1, x2, y2, cls="arr", both=False):
        m = f'url(#ah-{self.name})'
        start = f' marker-start="{m}"' if both else ""
        self.parts.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" class="{cls}" marker-end="{m}"{start}/>')
    def box(self, x, y, w, h, lines, cls="box", tcls="t", lh=15):
        if isinstance(lines, str):
            lines = [lines]
        self.parts.append(rect(x, y, w, h, cls))
        self.parts.append(ml_text(x + w / 2, y + h / 2, lines, tcls, lh=lh))
    def svg(self, label):
        defs = (f'<defs><marker id="ah-{self.name}" viewBox="0 0 10 10" refX="9" refY="5" '
                f'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
                f'<path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>'
                f'<clipPath id="cp-{self.name}"><rect x="0" y="0" width="{self.w}" height="{self.h}"/></clipPath></defs>')
        return (f'<svg viewBox="0 0 {self.w} {self.h}" class="fig" role="img" aria-label="{esc(label)}">'
                + defs + "".join(self.parts) + "</svg>")

class Plot:
    """Maps data coordinates into a rectangle of a Fig."""
    def __init__(self, fig, x, y, w, h, xr, yr):
        self.fig, self.x, self.y, self.w, self.h, self.xr, self.yr = fig, x, y, w, h, xr, yr
    def X(self, v):
        return self.x + (v - self.xr[0]) / (self.xr[1] - self.xr[0]) * self.w
    def Y(self, v):
        return self.y + self.h - (v - self.yr[0]) / (self.yr[1] - self.yr[0]) * self.h
    def P(self, x, y):
        return (self.X(x), self.Y(y))
    def axes(self, xt=(), yt=(), xl=None, yl=None, grid=True, fmt=f, box=False):
        g = self.fig
        if grid:
            for v in yt:
                g.add(line(self.x, self.Y(v), self.x + self.w, self.Y(v), "gr"))
        g.add(line(self.x, self.y + self.h, self.x + self.w, self.y + self.h, "ax"))
        g.add(line(self.x, self.y, self.x, self.y + self.h, "ax"))
        for v in xt:
            g.add(text(self.X(v), self.y + self.h + 14, fmt(v), "ts"))
        for v in yt:
            g.add(text(self.x - 5, self.Y(v) + 4, fmt(v), "ts", "end"))
        if xl:
            g.add(text(self.x + self.w / 2, self.y + self.h + 30, xl, "ts2"))
        if yl:
            g.add(f'<text x="{f(self.x - 32)}" y="{f(self.y + self.h / 2)}" class="ts2" text-anchor="middle" '
                  f'transform="rotate(-90 {f(self.x - 32)} {f(self.y + self.h / 2)})">{esc(yl)}</text>')
    def curve(self, fn, a, b, cls="l1", n=160, clip=True):
        pts = []
        for i in range(n + 1):
            xv = a + (b - a) * i / n
            yv = fn(xv)
            yv = max(self.yr[0] - 5 * (self.yr[1] - self.yr[0]), min(self.yr[1] + 5 * (self.yr[1] - self.yr[0]), yv))
            pts.append(self.P(xv, yv))
        cid = next_id(self.fig.name)
        c = f' clip-path="url(#{cid})"' if clip else ""
        cp = (f'<clipPath id="{cid}"><rect x="{f(self.x)}" y="{f(self.y)}" width="{f(self.w)}" height="{f(self.h)}"/></clipPath>'
              if clip else "")
        d = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts)
        self.fig.add(cp + f'<path d="{d}" class="{cls}"{c}/>')

_ids = [0]
def next_id(prefix):
    _ids[0] += 1
    return f"{prefix}-c{_ids[0]}"

# ---------------------------------------------------------------- maths helpers

def solve(A, b):
    n = len(A)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        M[c], M[p] = M[p], M[c]
        for r in range(n):
            if r != c:
                k = M[r][c] / M[c][c]
                M[r] = [a - k * b_ for a, b_ in zip(M[r], M[c])]
    return [M[i][n] / M[i][i] for i in range(n)]

def polyfit(xs, ys, deg):
    A = [[sum(x ** (i + j) for x in xs) for j in range(deg + 1)] for i in range(deg + 1)]
    b = [sum(y * x ** i for x, y in zip(xs, ys)) for i in range(deg + 1)]
    c = solve(A, b)
    return lambda x: sum(ci * x ** i for i, ci in enumerate(c))

def lagrange(xs, ys):
    def p(x):
        s = 0
        for i, xi in enumerate(xs):
            t = ys[i]
            for j, xj in enumerate(xs):
                if i != j:
                    t *= (x - xj) / (xi - xj)
            s += t
        return s
    return p

sig = lambda z: 1 / (1 + math.exp(-z))
npdf = lambda x, m, s: math.exp(-(x - m) ** 2 / (2 * s * s)) / (math.sqrt(2 * math.pi) * s)

# shared noisy sine data (N = 10), used for the fitting pictures
SX = [i / 9 for i in range(10)]
_noise = [0.18, -0.22, 0.10, 0.25, -0.15, 0.20, -0.28, 0.05, -0.12, 0.22]
SY = [math.sin(2 * math.pi * x) + e for x, e in zip(SX, _noise)]

FIGS = {}

def reg(name, fig, caption):
    FIGS[name] = {"svg": fig.svg(caption.replace("*", "")), "caption": caption}

# ================================================================= AML S1

def s1_fits():
    g = Fig("s1fits", 190)
    fits = [("Too simple: underfit", polyfit(SX, SY, 1), "Student B"),
            ("Just right", polyfit(SX, SY, 3), "Student C"),
            ("Too flexible: overfit", lagrange(SX, SY), "Student A")]
    pw = 128
    for i, (title, fn, who) in enumerate(fits):
        x0 = 12 + i * (pw + 14)
        p = Plot(g, x0, 30, pw, 120, (-0.05, 1.05), (-1.7, 1.7))
        g.add(rect(x0, 30, pw, 120, "panel", 4))
        p.curve(lambda x: math.sin(2 * math.pi * x), 0, 1, "lg")
        p.curve(fn, -0.02, 1.02, "l2")
        for x, y in zip(SX, SY):
            g.add(circle(*p.P(x, y), 4, "d1"))
        g.add(text(x0 + pw / 2, 20, title, "tb"))
        g.add(text(x0 + pw / 2, 168, who, "ts2"))
    g.add(line(150, 182, 164, 182, "lg"), text(168, 186, "true pattern", "ts2", "start"),
          line(250, 182, 264, 182, "l2"), text(268, 186, "model's curve", "ts2", "start"))
    reg("s1-fits", g, "The same 10 noisy points fitted three ways. A straight line misses the pattern (underfit); a gentle curve follows it; a curve with as many parameters as points passes through every point, noise included, and swings wildly between them (overfit).")

def s1_ucurve():
    g = Fig("s1u", 230)
    p = Plot(g, 58, 20, 340, 160, (1, 10), (0, 1.0))
    p.axes(xt=[1, 4, 7, 10], yt=[0, 0.5, 1.0], xl="model complexity (e.g. polynomial degree) →", yl="error")
    tr = lambda k: 0.9 * math.exp(-0.35 * k) + 0.05
    va = lambda k: tr(k) + 0.006 * k * k
    g.add(f'<rect x="{f(p.X(1))}" y="20" width="{f(p.X(3) - p.X(1))}" height="160" class="zone2"/>',
          f'<rect x="{f(p.X(7))}" y="20" width="{f(p.X(10) - p.X(7))}" height="160" class="zone2"/>')
    p.curve(tr, 1, 10, "l1", clip=False)
    p.curve(va, 1, 10, "l2", clip=False)
    kb = min((k / 100 for k in range(100, 1001)), key=va)
    g.add(line(p.X(kb), 20, p.X(kb), 180, "guide"))
    g.add(circle(*p.P(kb, va(kb)), 5, "d2", f"sweet spot: lowest validation error (complexity ≈ {kb:.1f})"))
    g.add(text(p.X(2), 36, "underfitting", "ts2"), text(p.X(8.5), 36, "overfitting", "ts2"),
          text(p.X(kb), 14, "sweet spot", "ts"))
    g.add(text(p.X(10) - 4, p.Y(tr(10)) - 8, "training error", "ts", "end"),
          text(p.X(10) - 4, p.Y(va(10)) + 16, "validation error", "ts", "end"))
    reg("s1-ucurve", g, "As a model gets more complex, **training error keeps falling**, but **validation error falls and then rises**. Left of the sweet spot the model underfits (both errors high); right of it the model overfits (a growing gap).")

def s1_kfold():
    g = Fig("s1k", 200)
    k, cw, ch = 5, 52, 24
    x0, y0 = 88, 24
    for r in range(k):
        y = y0 + r * (ch + 8)
        g.add(text(x0 - 10, y + 16, f"Round {r + 1}", "ts", "end"))
        for c in range(k):
            cls = "cell2" if c == r else "cell1"
            g.add(rect(x0 + c * (cw + 3), y, cw, ch, cls, 4))
            g.add(text(x0 + c * (cw + 3) + cw / 2, y + 16, "validate" if c == r else "train", "ts"))
        g.add(text(x0 + k * (cw + 3) + 16, y + 16, f"score {r + 1}", "ts", "start"))
    g.add(text(430, 196, "final score = average of the 5", "tb", "end"))
    g.add(text(x0 + 2.5 * (cw + 3), 14, "the data split into 5 folds", "ts2"))
    reg("s1-kfold", g, "5-fold cross-validation: each round holds out a different fold (orange) and trains on the other four (blue). Every example is validated exactly once, and the final score is the average of the five.")

def s1_threshold():
    g = Fig("s1t", 130)
    p = Plot(g, 30, 40, 380, 40, (0.75, 4.75), (0, 1))
    g.add(line(p.X(0.8), p.Y(0.5), p.X(4.7), p.Y(0.5), "ax"))
    data = [(1.0, "B"), (1.5, "B"), (2.0, "B"), (2.5, "M"), (3.0, "B"), (3.5, "M"), (4.0, "M"), (4.5, "M")]
    for x, lab in data:
        X, Y = p.X(x), p.Y(0.5)
        g.add(text(X, Y + 26, f(x), "ts"))
        if lab == "B":
            g.add(circle(X, Y, 6, "d1", f"{x} cm: benign"))
        else:
            g.add(square(X, Y, 6, "d2", f"{x} cm: malignant"))
    T = p.X(2.25)
    g.add(line(T, 18, T, 96, "guide2"), text(T, 14, "threshold T = 2.25", "tb"))
    g.add(text((p.X(0.8) + T) / 2, 110, "← predict benign", "ts2"), text((T + p.X(4.7)) / 2, 110, "predict malignant →", "ts2"))
    g.add(circle(40, 124, 4, "d1"), text(48, 128, "benign", "ts2", "start"),
          square(110, 124, 4, "d2"), text(118, 128, "malignant", "ts2", "start"),
          text(p.X(4.7), 128, "tumour size (cm)", "ts2", "end"))
    reg("s1-threshold", g, "A one-number classifier: everything above T is predicted malignant. With T = 2.25 only one point is wrong (the benign 3.0). No single cut can be perfect, because a malignant 2.5 sits left of a benign 3.0.")

def s1_types():
    g = Fig("s1ty", 200)
    rnd = random.Random(3)
    A = [(rnd.gauss(0.3, 0.09), rnd.gauss(0.3, 0.09)) for _ in range(9)]
    B = [(rnd.gauss(0.7, 0.09), rnd.gauss(0.68, 0.09)) for _ in range(9)]
    titles = ["Supervised", "Unsupervised", "Semi-supervised"]
    notes = ["every point labelled", "no labels: find groups", "few labels, many unlabelled"]
    for i in range(3):
        x0 = 10 + i * 144
        p = Plot(g, x0, 28, 132, 132, (0, 1), (0, 1))
        g.add(rect(x0, 28, 132, 132, "panel", 4))
        g.add(text(x0 + 66, 20, titles[i], "tb"), text(x0 + 66, 178, notes[i], "ts2"))
        if i == 1:
            g.add(f'<ellipse cx="{f(p.X(0.3))}" cy="{f(p.Y(0.3))}" rx="34" ry="34" class="grp"/>',
                  f'<ellipse cx="{f(p.X(0.7))}" cy="{f(p.Y(0.68))}" rx="34" ry="34" class="grp"/>')
        if i == 0:
            g.add(line(p.X(0.05), p.Y(0.95), p.X(0.95), p.Y(0.05), "guide2"))
        for j, (x, y) in enumerate(A):
            if i == 0 or (i == 2 and j < 2):
                g.add(circle(*p.P(x, y), 4.5, "d1"))
            else:
                g.add(circle(*p.P(x, y), 4.5, "dn"))
        for j, (x, y) in enumerate(B):
            if i == 0 or (i == 2 and j < 2):
                g.add(square(*p.P(x, y), 4.5, "d2"))
            else:
                g.add(circle(*p.P(x, y), 4.5, "dn"))
    g.add(circle(120, 194, 4, "d1"), text(128, 198, "class A", "ts2", "start"),
          square(190, 194, 4, "d2"), text(198, 198, "class B", "ts2", "start"),
          circle(260, 194, 4, "dn"), text(268, 198, "no label", "ts2", "start"))
    reg("s1-types", g, "The same data under three kinds of feedback. Supervised: every point has its answer, so the model learns the boundary. Unsupervised: no answers, so it finds groups. Semi-supervised: a few labels spread to their clusters.")

def s1_rl():
    g = Fig("s1rl", 150)
    g.box(40, 50, 120, 50, ["Agent", "(learner)"], "box")
    g.box(280, 50, 120, 50, ["Environment", "(game, maze)"], "box3")
    g.arrow(160, 62, 280, 62)
    g.add(text(220, 54, "action", "ts"))
    g.arrow(280, 90, 160, 90)
    g.add(text(220, 108, "new state + reward (+/−)", "ts"))
    g.add(text(220, 22, "repeat many times → learn a policy: state → best action", "ts2"))
    reg("s1-rl", g, "Reinforcement learning: the agent acts, the environment answers with a new state and a reward, and over many rounds the agent learns a policy that collects the most reward.")

# ================================================================= AML S2

def s2_ladder():
    g = Fig("s2l", 230)
    steps = [("Nominal", "=  ≠", "PIN code, blood group"),
             ("Ordinal", "+  <  >", "grades, rankings"),
             ("Interval", "+  +  −", "°C, calendar dates"),
             ("Ratio", "+  ×  ÷  (true zero)", "kg, Kelvin, counts")]
    for i, (n, ops, ex) in enumerate(steps):
        x = 12 + i * 106
        h = 50 + i * 30
        y = 170 - h
        g.add(rect(x, y, 100, h, ["box", "box", "box3", "box3"][i], 6))
        g.add(text(x + 50, y + 18, n, "tb"), text(x + 50, y + 36, ops, "ts"))
        g.add(ml_text(x + 50, 190, ex.split(", "), "ts2", lh=14))
    g.add(text(12, 222, "← categorical", "ts2", "start"), text(428, 222, "numeric →", "ts2", "end"))
    g.arrow(40, 30, 150, 12)
    g.add(text(160, 16, "each step allows one more operation", "ts", "start"))
    reg("s2-ladder", g, "The attribute-type ladder: each type allows everything the one below it does, plus one more operation. Only ratio attributes have a true zero, so only they support “twice as much”.")

def s2_distance():
    g = Fig("s2d", 250)
    p = Plot(g, 40, 14, 200, 200, (0, 6.5), (0, 6.5))
    for v in range(0, 7):
        g.add(line(p.X(v), p.Y(0), p.X(v), p.Y(6.5), "gr"), line(p.X(0), p.Y(v), p.X(6.5), p.Y(v), "gr"))
        g.add(text(p.X(v), p.Y(0) + 14, str(v), "ts"), text(p.X(0) - 6, p.Y(v) + 4, str(v), "ts", "end"))
    P, Q = (1, 2), (4, 6)
    g.add(path([p.P(1, 2), p.P(4, 2), p.P(4, 6)], "l2"))
    g.add(path([p.P(1, 2), p.P(4, 6)], "l1"))
    g.add(circle(*p.P(*P), 5, "dk"), circle(*p.P(*Q), 5, "dk"))
    g.add(text(p.X(1) + 8, p.Y(2) + 30, "P (1, 2)", "tb", "start"), text(p.X(4) - 8, p.Y(6) - 6, "Q (4, 6)", "tb", "end"))
    g.add(text(p.X(2.5), p.Y(2) + 16, "3", "ts"), text(p.X(4) + 10, p.Y(4) + 4, "4", "ts", "start"))
    lx = 262
    g.add(line(lx, 60, lx + 22, 60, "l2"), text(lx + 28, 64, "Manhattan: 3 + 4 = 7", "t", "start"))
    g.add(line(lx, 90, lx + 22, 90, "l1"), text(lx + 28, 94, "Euclidean: √(3² + 4²) = 5", "t", "start"))
    g.add(text(lx, 124, "Supremum: max(3, 4) = 4", "t", "start"))
    g.add(text(lx, 160, "always: L₁ ≥ L₂ ≥ L∞", "ts2", "start"))
    reg("s2-distance", g, "Three distances between the same two points. Manhattan walks the grid (3 blocks across, then 4 up), Euclidean goes straight, and supremum keeps only the biggest single difference.")

def s2_meanmedian():
    g = Fig("s2mm", 120)
    p = Plot(g, 20, 40, 400, 30, (0, 260), (0, 1))
    g.add(line(p.X(0), p.Y(0.5), p.X(260), p.Y(0.5), "ax"))
    for v in [0, 50, 100, 150, 200, 250]:
        g.add(line(p.X(v), p.Y(0.5) - 3, p.X(v), p.Y(0.5) + 3, "ax"), text(p.X(v), p.Y(0.5) + 18, str(v), "ts"))
    for v in [30, 35, 40, 45, 250]:
        g.add(circle(p.X(v), p.Y(0.5), 5, "d1", f"salary {v}k"))
    g.add(line(p.X(40), 26, p.X(40), 56, "guide2"), text(p.X(40), 20, "median 40", "tb"))
    g.add(line(p.X(80), 26, p.X(80), 56, "guide"), text(p.X(80) + 4, 20, "mean 80", "tb", "start"))
    g.add(text(p.X(250), 44, "founder", "ts2"))
    g.add(text(420, 112, "monthly salary (₹ thousand)", "ts2", "end"))
    reg("s2-meanmedian", g, "One outlier (the founder's 250) drags the mean to 80, although four of five people earn 45 or less. The median (40) still describes a typical employee.")

def s2_corr():
    g = Fig("s2c", 200)
    p = Plot(g, 50, 14, 220, 150, (-3.5, 3.5), (0, 10))
    p.axes(xt=[-3, -2, -1, 0, 1, 2, 3], yt=[0, 5, 10], xl="x", yl="y")
    p.curve(lambda x: x * x, -3.2, 3.2, "lg")
    for x in range(-3, 4):
        g.add(circle(*p.P(x, x * x), 4.5, "d1", f"({x}, {x * x})"))
    g.add(text(290, 70, "y = x² exactly,", "t", "start"), text(290, 90, "yet correlation r = 0", "tb", "start"),
          text(290, 120, "left half falls, right half", "ts2", "start"), text(290, 136, "rises: they cancel", "ts2", "start"))
    reg("s2-corr", g, "Correlation only measures straight-line relationships. Here y is completely determined by x, but because the pattern is a U-shape, the correlation is exactly 0.")

def s2_boxplot():
    g = Fig("s2b", 140)
    p = Plot(g, 30, 44, 380, 40, (0, 100), (0, 1))
    q = {"p10": 12, "p25": 28, "p50": 40, "p75": 58, "p90": 74}
    y = p.Y(0.5)
    g.add(line(p.X(q["p10"]), y, p.X(q["p25"]), y, "ax2"), line(p.X(q["p75"]), y, p.X(q["p90"]), y, "ax2"))
    g.add(line(p.X(q["p10"]), y - 10, p.X(q["p10"]), y + 10, "ax2"), line(p.X(q["p90"]), y - 10, p.X(q["p90"]), y + 10, "ax2"))
    g.add(rect(p.X(q["p25"]), y - 18, p.X(q["p75"]) - p.X(q["p25"]), 36, "box", 3))
    g.add(line(p.X(q["p50"]), y - 18, p.X(q["p50"]), y + 18, "l1"))
    g.add(circle(p.X(93), y, 5, "d2", "outlier"))
    for k, lab in [("p10", "10th"), ("p25", "25th"), ("p75", "75th"), ("p90", "90th")]:
        g.add(text(p.X(q[k]), y + 36, lab, "ts"))
    g.add(text(p.X(q["p50"]), y - 24, "median (50th)", "ts"))
    g.add(text(p.X(93), y + 36, "outlier", "ts"))
    g.add(text(p.X((q["p25"] + q["p75"]) / 2), y + 52, "box = middle 50% of the data (IQR)", "ts2"))
    reg("s2-boxplot", g, "Anatomy of a box plot: the box spans the 25th to 75th percentile, the line inside is the median, whiskers reach the 10th and 90th percentiles, and anything beyond is drawn as an outlier.")

def s2_curse():
    g = Fig("s2cu", 190)
    rnd = random.Random(7)
    pts = [(rnd.random(), rnd.random()) for _ in range(10)]
    p1 = Plot(g, 20, 70, 160, 10, (0, 1), (0, 1))
    g.add(line(20, 75, 180, 75, "ax"))
    for x, _ in pts:
        g.add(circle(p1.X(x), 75, 4.5, "d1"))
    g.add(text(100, 30, "1 feature", "tb"), text(100, 50, "10 points on a line: crowded", "ts2"))
    x0 = 250
    p2 = Plot(g, x0, 24, 150, 150, (0, 1), (0, 1))
    g.add(rect(x0, 24, 150, 150, "panel", 4))
    for x, y in pts:
        g.add(circle(*p2.P(x, y), 4.5, "d1"))
    g.add(text(x0 + 75, 16, "2 features", "tb"), text(x0 + 75, 188, "same 10 points: far apart", "ts2"))
    g.arrow(190, 75, 240, 75)
    g.add(text(100, 110, "each new feature multiplies", "ts2"), text(100, 126, "the space; the data thins out", "ts2"))
    reg("s2-curse", g, "The curse of dimensionality: the same ten points that are packed together along one feature become sparse once a second feature is added. With dozens of features, every point is far from every other.")

def s2_pca():
    g = Fig("s2p", 200)
    rnd = random.Random(11)
    p = Plot(g, 40, 14, 220, 170, (-3, 3), (-2.4, 2.4))
    p.axes(xt=[], yt=[], xl="feature x₁", yl="feature x₂", grid=False)
    ang = math.radians(35)
    for _ in range(40):
        t, s = rnd.gauss(0, 1.1), rnd.gauss(0, 0.25)
        x, y = t * math.cos(ang) - s * math.sin(ang), t * math.sin(ang) + s * math.cos(ang)
        g.add(circle(*p.P(x, y), 3.5, "d1"))
    g.arrow(*p.P(0, 0), *p.P(2.6 * math.cos(ang), 2.6 * math.sin(ang)), "arrk")
    g.arrow(*p.P(0, 0), *p.P(-0.7 * math.sin(ang), 0.7 * math.cos(ang)), "arrk")
    g.add(text(p.X(2.6 * math.cos(ang)) + 4, p.Y(2.6 * math.sin(ang)) - 6, "PC1", "tb", "start"),
          text(p.X(-0.7 * math.sin(ang)) - 6, p.Y(0.7 * math.cos(ang)) - 4, "PC2", "tb", "end"))
    g.add(text(290, 70, "PC1: the direction of", "t", "start"), text(290, 88, "most variation", "t", "start"),
          text(290, 120, "Describe each point by its", "ts2", "start"), text(290, 136, "position along PC1:", "ts2", "start"),
          text(290, 152, "2 numbers become 1", "ts2", "start"))
    reg("s2-pca", g, "PCA finds new axes. Here the cloud is a tilted cigar, so almost all the variation lies along PC1; keeping only each point's position along PC1 loses very little.")

def s2_cosine():
    g = Fig("s2co", 180)
    p = Plot(g, 40, 14, 170, 150, (0, 6), (0, 5))
    p.axes(xt=[], yt=[], grid=False)
    g.arrow(*p.P(0, 0), *p.P(2, 1.5), "arr1")
    g.arrow(*p.P(0, 0), *p.P(4.4, 3.3), "arr1b")
    g.arrow(*p.P(0, 0), *p.P(1.2, 4.2), "arr2")
    g.add(text(p.X(2) + 6, p.Y(1.5) + 14, "short article", "ts", "start"),
          text(p.X(4.4) + 4, p.Y(3.3) - 6, "long article", "ts", "start"),
          text(p.X(1.2) + 6, p.Y(4.2), "different topic", "ts", "start"))
    g.add(text(240, 60, "Same direction → cosine = 1,", "t", "start"), text(240, 78, "even though lengths differ", "t", "start"),
          text(240, 110, "Bigger angle → lower cosine", "t", "start"),
          text(240, 140, "Euclidean distance would call", "ts2", "start"), text(240, 156, "the two cricket articles far apart", "ts2", "start"))
    reg("s2-cosine", g, "Cosine similarity compares the direction of word-count vectors, not their length. A long and a short article on the same topic point the same way (cosine near 1); an article on another topic points elsewhere.")

# ================================================================= AML S3

def s3_confusion():
    g = Fig("s3c", 230)
    x0, y0, cw, ch = 96, 50, 110, 60
    g.add(text(x0 + cw, 18, "Predicted", "tb"), text(x0 + cw / 2, 40, "fraud", "ts"), text(x0 + 1.5 * cw, 40, "genuine", "ts"))
    g.add(f'<text x="30" y="{f(y0 + ch)}" class="tb" text-anchor="middle" transform="rotate(-90 30 {f(y0 + ch)})">Actual</text>')
    g.add(text(x0 - 8, y0 + ch / 2 + 4, "fraud", "ts", "end"), text(x0 - 8, y0 + 1.5 * ch + 4, "genuine", "ts", "end"))
    cells = [("TP = 30", "caught", "good"), ("FN = 10", "missed", "bad"), ("FP = 20", "false alarm", "bad"), ("TN = 940", "let through", "good")]
    for i, (a, b, k) in enumerate(cells):
        cx, cy = x0 + (i % 2) * cw, y0 + (i // 2) * ch
        g.add(rect(cx + 2, cy + 2, cw - 4, ch - 4, "cg" if k == "good" else "cb", 4))
        g.add(text(cx + cw / 2, cy + 28, a, "tb"), text(cx + cw / 2, cy + 46, b, "ts2"))
    g.add(rect(x0 - 2, y0 - 2, 2 * cw + 4, ch + 4, "ring1", 7))
    g.add(rect(x0 - 5, y0 - 5, cw + 10, 2 * ch + 10, "ring2", 8))
    g.add(text(x0 + 2 * cw + 12, y0 + 14, "Recall =", "ts", "start"),
          text(x0 + 2 * cw + 12, y0 + 30, "30 / (30 + 10)", "ts", "start"),
          text(x0 + 2 * cw + 12, y0 + 46, "= 0.75 (the row)", "ts2", "start"))
    g.add(text(x0 + cw / 2, y0 + 2 * ch + 24, "Precision = 30 / (30 + 20) = 0.60", "ts"),
          text(x0 + cw / 2, y0 + 2 * ch + 40, "(the column)", "ts2"))
    reg("s3-confusion", g, "The fraud model's confusion matrix. **Recall** reads along the actual-fraud row (how many frauds were caught); **precision** reads down the predicted-fraud column (how many alerts were real).")

def s3_threshold():
    g = Fig("s3t", 220)
    p = Plot(g, 40, 30, 380, 140, (0, 1), (0, 3.6))
    p.axes(xt=[0, 0.25, 0.5, 0.75, 1], yt=[], xl="model's fraud score", grid=False)
    gen = lambda x: npdf(x, 0.32, 0.12)
    fr = lambda x: npdf(x, 0.68, 0.12)
    t = 0.55
    fp = [p.P(t, 0)] + [p.P(t + i * (1 - t) / 60, gen(t + i * (1 - t) / 60)) for i in range(61)] + [p.P(1, 0)]
    fn = [p.P(0, 0)] + [p.P(i * t / 60, fr(i * t / 60)) for i in range(61)] + [p.P(t, 0)]
    g.add(path(fp, "area1", True), path(fn, "area2", True))
    p.curve(gen, 0, 1, "l1", clip=False)
    p.curve(fr, 0, 1, "l2", clip=False)
    g.add(line(p.X(t), 22, p.X(t), 170, "guide2"), text(p.X(t), 16, "threshold", "tb"))
    g.add(text(p.X(0.32), p.Y(gen(0.32)) - 8, "genuine", "ts"), text(p.X(0.68), p.Y(fr(0.68)) - 8, "fraud", "ts"))
    g.add(text(p.X(0.47), p.Y(0.35), "FN", "tb"), text(p.X(0.63), p.Y(0.35), "FP", "tb"))
    g.add(text(230, 214, "threshold left → recall ↑ but precision ↓", "ts2"))
    reg("s3-threshold", g, "Scores for genuine (blue) and fraud (orange) transactions overlap. Everything right of the threshold is flagged: the shaded blue tail is false positives, the shaded orange tail is missed fraud. Every threshold trades one for the other.")

def s3_roc():
    g = Fig("s3r", 250)
    p = Plot(g, 60, 16, 190, 190, (0, 1), (0, 1))
    p.axes(xt=[0, 0.5, 1], yt=[0, 0.5, 1], xl="FPR (false alarms)", yl="TPR (recall)")
    pts = [(0, 0), (0, 0.2), (0, 0.4), (0.2, 0.4), (0.6, 0.6), (0.8, 0.6), (0.8, 0.8), (1, 0.8), (1, 1)]
    g.add(path([p.P(*q) for q in pts] + [p.P(1, 0)], "area1", True))
    g.add(line(p.X(0), p.Y(0), p.X(1), p.Y(1), "guide"))
    g.add(path([p.P(*q) for q in pts], "l1"))
    for q in pts:
        g.add(circle(*p.P(*q), 3.5, "d1", f"FPR {q[0]}, TPR {q[1]}"))
    g.add(circle(*p.P(0, 1), 6, "dk"), text(p.X(0) + 12, p.Y(1) + 18, "ideal (0, 1)", "ts", "start"))
    g.add(text(p.X(0.55), p.Y(0.2), "AUC = 0.56", "tb"))
    g.add(text(280, 60, "Each dot is one threshold.", "t", "start"), text(280, 90, "Hugging the top-left", "t", "start"),
          text(280, 108, "corner = good model;", "t", "start"), text(280, 126, "dashed diagonal = guessing.", "t", "start"),
          text(280, 160, "This model (slide 21) is", "ts2", "start"), text(280, 176, "barely better than random.", "ts2", "start"))
    reg("s3-roc", g, "The ROC curve for the slide-21 example: each threshold gives one (FPR, TPR) point. The shaded area under the curve is the AUC (0.56), barely above the random-guess diagonal (0.5).")

def s3_ova():
    g = Fig("s3o", 170)
    cls = [("A", "box"), ("B", "box2"), ("C", "box3")]
    g.add(text(105, 16, "One-vs-All: 3 classifiers", "tb"), text(330, 16, "One-vs-One: 3 pairs", "tb"))
    for i, (c, k) in enumerate(cls):
        y = 30 + i * 44
        g.box(20, y, 170, 34, f"{c}  vs  the rest", k)
    pairs = ["A vs B", "A vs C", "B vs C"]
    for i, pr in enumerate(pairs):
        g.box(250, 30 + i * 44, 160, 34, pr, "boxn")
    g.add(text(105, 164, "pick the highest score", "ts2"), text(330, 164, "majority vote wins", "ts2"))
    reg("s3-ova", g, "Two ways to use yes/no classifiers for three classes. One-vs-All trains one detector per class (K of them); One-vs-One trains one per pair (K(K−1)/2, i.e. 45 for 10 digits).")

# ================================================================= AML S4

HX, HY = [1, 2, 3, 4, 5], [2, 4, 5, 4, 5]

def s4_residuals():
    g = Fig("s4r", 250)
    p = Plot(g, 56, 14, 220, 190, (0, 6.3), (0, 7))
    p.axes(xt=[0, 1, 2, 3, 4, 5, 6], yt=[0, 2, 4, 6], xl="hours studied (x)", yl="exam score (y)")
    b0, b1 = 2.2, 0.6
    for x, y in zip(HX, HY):
        g.add(line(p.X(x), p.Y(y), p.X(x), p.Y(b0 + b1 * x), "res"))
    p.curve(lambda x: b0 + b1 * x, 0, 6.3, "l1")
    for x, y in zip(HX, HY):
        g.add(circle(*p.P(x, y), 5, "d2", f"x={x}, y={y}, residual {y - (b0 + b1 * x):+.1f}"))
    g.add(circle(*p.P(3, 4), 5, "dk"), text(p.X(3) + 8, p.Y(4) + 16, "(x̄, ȳ) = (3, 4)", "ts", "start"))
    g.add(circle(*p.P(6, 5.8), 5, "d1"), text(p.X(6) - 6, p.Y(5.8) - 10, "6 h → 5.8", "ts", "end"))
    g.add(text(296, 60, "ŷ = 2.2 + 0.6x", "tb", "start"),
          text(296, 88, "dotted gaps =", "ts", "start"), text(296, 104, "residuals", "ts", "start"),
          text(296, 136, "least squares makes", "ts", "start"), text(296, 152, "the sum of their", "ts", "start"),
          text(296, 168, "squares smallest", "ts", "start"))
    reg("s4-residuals", g, "The least-squares line for the hours → score data. Each dotted gap is a residual; the line is chosen to make the sum of squared residuals (SSE = 2.4) as small as possible, and it always passes through the mean point (3, 4).")

def s4_bowl():
    g = Fig("s4b", 260)
    p = Plot(g, 60, 14, 220, 200, (-0.6, 3.2), (-0.3, 1.6))
    p.axes(xt=[0, 1, 2, 3], yt=[0, 0.5, 1, 1.5], xl="θ₀ (intercept)", yl="θ₁ (slope)")
    H = [[1, 3], [3, 11]]
    tr, det = 12, 2
    l1 = tr / 2 + math.sqrt(tr * tr / 4 - det)
    l2 = tr / 2 - math.sqrt(tr * tr / 4 - det)
    v1 = (3, l1 - 1); n1 = math.hypot(*v1); v1 = (v1[0] / n1, v1[1] / n1)
    v2 = (-v1[1], v1[0])
    jmin = 0.24
    for c in [0.3, 0.45, 0.8, 1.5, 3, 6]:
        r = math.sqrt(2 * (c - jmin))
        pts = []
        for i in range(121):
            a = 2 * math.pi * i / 120
            d1, d2 = r / math.sqrt(l1) * math.cos(a), r / math.sqrt(l2) * math.sin(a)
            pts.append(p.P(2.2 + d1 * v1[0] + d2 * v2[0], 0.6 + d1 * v1[1] + d2 * v2[1]))
        g.add(path(pts, "cont", True).replace("/>", ' clip-path="url(#s4b-clip)"/>'))
    g.add(f'<clipPath id="s4b-clip"><rect x="{p.x}" y="{p.y}" width="{p.w}" height="{p.h}"/></clipPath>')
    t0 = t1 = 0.0
    trail = [(t0, t1)]
    for _ in range(300):
        e = [t0 + t1 * x - y for x, y in zip(HX, HY)]
        g0 = sum(e) / 5; g1 = sum(ei * x for ei, x in zip(e, HX)) / 5
        t0, t1 = t0 - 0.1 * g0, t1 - 0.1 * g1
        trail.append((t0, t1))
    g.add(path([p.P(*q) for q in trail], "l2"))
    for q in trail[:6]:
        g.add(circle(*p.P(*q), 3.5, "d2"))
    g.add(circle(*p.P(2.2, 0.6), 5.5, "dk", "minimum: θ₀ = 2.2, θ₁ = 0.6"))
    g.add(text(p.X(0) + 6, p.Y(0) + 14, "start (0, 0)", "ts", "start"), text(p.X(2.2) - 8, p.Y(0.6) + 20, "minimum (2.2, 0.6)", "ts", "end"))
    g.add(text(296, 60, "each ellipse: lines", "ts", "start"), text(296, 76, "with equal cost J", "ts", "start"),
          text(296, 108, "orange: gradient", "ts", "start"), text(296, 124, "descent, α = 0.1", "ts", "start"),
          text(296, 156, "big jumps first, then", "ts2", "start"), text(296, 172, "a slow walk along", "ts2", "start"), text(296, 188, "the valley floor", "ts2", "start"))
    reg("s4-bowl", g, "The cost bowl seen from above (a contour plot) for the hours data. Each ellipse joins (θ₀, θ₁) pairs with equal cost; the centre is the OLS answer. The orange path is gradient descent from (0, 0): its first step is the worked example in Lesson 7, then it zig-zags into the long valley and creeps toward the minimum.")

def s4_lr():
    g = Fig("s4lr", 200)
    for i, (alpha, title) in enumerate([(0.15, "α small: slow, steady"), (0.95, "α too large: overshoots")]):
        x0 = 14 + i * 214
        p = Plot(g, x0, 28, 196, 140, (-1.25, 1.25), (0, 1.6))
        g.add(rect(x0, 28, 196, 140, "panel", 4))
        p.curve(lambda t: t * t, -1.25, 1.25, "lg")
        th = [1.0]
        for _ in range(6):
            th.append(th[-1] - alpha * 2 * th[-1])
        pts = [p.P(t, t * t) for t in th]
        g.add(path(pts, "l2"))
        for q in pts:
            g.add(circle(*q, 3.5, "d2"))
        g.add(text(x0 + 98, 20, title, "tb"))
        g.add(text(x0 + 98, 186, "J(θ) = θ², start at θ = 1", "ts2"))
    reg("s4-lr", g, "Gradient descent on the bowl J(θ) = θ². With a small learning rate each step moves a little downhill; with a large one each step overshoots to the other side, so it bounces (and past α = 1 it diverges).")

def s4_poly():
    g = Fig("s4p", 175)
    ms = [(0, polyfit(SX, SY, 0)), (1, polyfit(SX, SY, 1)), (3, polyfit(SX, SY, 3)), (9, lagrange(SX, SY))]
    diag = ["underfit", "underfit", "good fit", "overfit"]
    for i, (m, fn) in enumerate(ms):
        x0 = 8 + i * 108
        p = Plot(g, x0, 26, 100, 110, (-0.05, 1.05), (-1.7, 1.7))
        g.add(rect(x0, 26, 100, 110, "panel", 4))
        p.curve(fn, -0.02, 1.02, "l2")
        for x, y in zip(SX, SY):
            g.add(circle(*p.P(x, y), 3.5, "d1"))
        g.add(text(x0 + 50, 18, f"M = {m}", "tb"), text(x0 + 50, 154, diag[i], "ts2"))
    g.add(text(220, 172, "10 points, polynomial of order M (M + 1 coefficients)", "ts2"))
    reg("s4-poly", g, "Polynomials of order 0, 1, 3 and 9 fitted to the same 10 points. M = 3 follows the underlying wave; M = 9 has 10 coefficients for 10 points, so it hits every point exactly and oscillates wildly.")

def s4_archery():
    g = Fig("s4a", 250)
    rnd = random.Random(5)
    specs = [("low bias, low variance", (0, 0), 0.07), ("low bias, high variance", (0, 0), 0.26),
             ("high bias, low variance", (0.42, 0.3), 0.07), ("high bias, high variance", (0.42, 0.3), 0.26)]
    for i, (lab, (bx, by), sd) in enumerate(specs):
        cx, cy = 115 + (i % 2) * 210, 62 + (i // 2) * 118
        for r, cls in [(46, "tg3"), (32, "tg2"), (17, "tg1")]:
            g.add(circle(cx, cy, r, cls))
        for _ in range(8):
            dx, dy = bx + rnd.gauss(0, sd), by + rnd.gauss(0, sd)
            g.add(circle(cx + dx * 46, cy + dy * 46, 3.8, "d2"))
        g.add(text(cx, cy + 62, lab, "ts"))
    g.add(text(20, 66, "just right", "ts2", "start"), text(20, 184, "underfit", "ts2", "start"),
          text(420, 66, "overfit", "ts2", "end"), text(420, 184, "worst", "ts2", "end"))
    reg("s4-archery", g, "Bias and variance as archery. Each dot is the same model trained on a different sample of data. Bias is how far the average shot is from the bullseye; variance is how scattered the shots are.")

# ================================================================= AML S5

def s5_linearfail():
    g = Fig("s5f", 250)
    xs = [1, 2, 3, 4, 5, 6, 7, 8]; ys = [0, 0, 0, 0, 1, 1, 1, 1]
    p = Plot(g, 50, 50, 360, 150, (0, 21), (-0.3, 1.5))
    p.axes(xt=[0, 5, 10, 15, 20], yt=[0, 0.5, 1], xl="hours studied", yl="pass (1) / fail (0)")
    a = polyfit(xs, ys, 1); b = polyfit(xs + [20], ys + [1], 1)
    p.curve(a, 0, 21, "l1"); p.curve(b, 0, 21, "l2")
    ca = [x / 100 for x in range(0, 2101)]
    xa = min(ca, key=lambda x: abs(a(x) - 0.5)); xb = min(ca, key=lambda x: abs(b(x) - 0.5))
    for x, y in zip(xs, ys):
        g.add(circle(*p.P(x, y), 4.5, "d1"))
    g.add(circle(*p.P(20, 1), 5, "d2", "the student who studied 20 hours"))
    g.add(line(p.X(xa), p.Y(0.5), p.X(xa), p.Y(-0.3), "guide"), line(p.X(xb), p.Y(0.5), p.X(xb), p.Y(-0.3), "guide"))
    g.add(text(p.X(20), p.Y(1) - 10, "far-away pass", "ts"))
    g.add(line(60, 14, 76, 14, "l1"), text(80, 18, f"fitted without the far point: 0.5 is crossed at {xa:.1f} h", "ts2", "start"))
    g.add(line(60, 32, 76, 32, "l2"), text(80, 36, f"with it: the cut-off moves to {xb:.1f} h, so the 5 h pass is now a “fail”", "ts2", "start"))
    reg("s5-linearfail", g, "Why a straight line is a poor classifier. Adding one correct but far-away point (a student who studied 20 h and passed) tilts the line and moves its 0.5 cut-off from 4.5 h to 5.3 h, so the student who studied 5 hours and passed is now predicted to fail. The line also goes above 1 and below 0, which no probability can.")

def s5_sigmoid():
    g = Fig("s5s", 230)
    p = Plot(g, 56, 16, 300, 170, (0, 6), (0, 1))
    p.axes(xt=[0, 1, 2, 3, 4, 5, 6], yt=[0, 0.5, 1], xl="hours studied", yl="P(pass)")
    p.curve(lambda x: sig(-4 + 1.5 * x), 0, 6, "l1")
    g.add(line(p.X(0), p.Y(0.5), p.X(6), p.Y(0.5), "guide"))
    xb = 4 / 1.5
    g.add(line(p.X(xb), p.Y(0), p.X(xb), p.Y(1), "guide2"))
    for x in [1, 2, 3, 4, 5]:
        v = sig(-4 + 1.5 * x)
        g.add(circle(*p.P(x, v), 4.5, "d1", f"{x} h: {v:.3f}"))
        g.add(text(p.X(x) + (8 if x < 3 else -8), p.Y(v) + (4 if x < 3 else -8), f"{v:.2f}", "ts", "start" if x < 3 else "end"))
    g.add(text(p.X(xb), p.Y(1) - 4, "boundary 2.67 h", "ts"))
    g.add(text(372, 70, "predict", "ts2", "start"), text(372, 86, "pass", "tb", "start"),
          text(372, 150, "predict", "ts2", "start"), text(372, 166, "fail", "tb", "start"))
    reg("s5-sigmoid", g, "The sigmoid turns the score z = −4 + 1.5 × hours into a probability that never leaves 0–1. It crosses 0.5 where z = 0, at 2.67 hours: that's the decision boundary.")

def s5_boundary():
    g = Fig("s5b", 228)
    p = Plot(g, 30, 22, 170, 160, (0, 4), (0, 4))
    g.add(path([p.P(0, 3), p.P(3, 0), p.P(4, 0), p.P(4, 4), p.P(0, 4)], "zone1", True))
    p.axes(xt=[0, 1, 2, 3, 4], yt=[0, 1, 2, 3, 4], grid=False)
    g.add(line(*p.P(0, 3), *p.P(3, 0), "l2"))
    g.add(text(p.X(2.8), p.Y(3.3), "y = 1", "tb"), text(p.X(0.8), p.Y(0.8), "y = 0", "tb"))
    g.add(text(115, 14, "θ = (−3, 1, 1): x₁ + x₂ = 3", "ts"))
    q = Plot(g, 250, 22, 170, 160, (-2, 2), (-2, 2))
    g.add(rect(250, 22, 170, 160, "zone1", 0))
    cx, cy = q.X(0), q.Y(0)
    g.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(q.X(1) - cx)}" ry="{f(cy - q.Y(1))}" class="zone0"/>')
    g.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(q.X(1) - cx)}" ry="{f(cy - q.Y(1))}" class="l2f"/>')
    g.add(text(cx, cy + 4, "y = 0", "tb"), text(q.X(1.45), q.Y(1.6), "y = 1", "tb"))
    g.add(text(335, 14, "with x₁², x₂²: x₁² + x₂² = 1", "ts"))
    g.add(text(115, 222, "straight boundary", "ts2"), text(335, 222, "curved boundary (unit circle)", "ts2"))
    reg("s5-boundary", g, "The decision boundary is where θᵀx = 0. With raw features it's a straight line (left); adding squared features lets the same model draw a circle (right).")

def s5_logloss():
    g = Fig("s5l", 220)
    p = Plot(g, 56, 16, 260, 160, (0, 1), (0, 4.6))
    p.axes(xt=[0, 0.25, 0.5, 0.75, 1], yt=[0, 1, 2, 3, 4], xl="model's predicted probability h", yl="cost")
    p.curve(lambda h: -math.log(max(h, 1e-6)), 0.01, 1, "l1")
    p.curve(lambda h: -math.log(max(1 - h, 1e-6)), 0, 0.99, "l2")
    for h in [0.9, 0.1]:
        g.add(circle(*p.P(h, -math.log(h)), 4.5, "d1", f"y = 1, h = {h}: cost {-math.log(h):.2f}"))
    g.add(text(p.X(0.1) + 8, p.Y(-math.log(0.1)) + 2, "confidently wrong: 2.30", "ts", "start"),
          text(p.X(0.9), p.Y(-math.log(0.9)) - 10, "nearly right: 0.11", "ts"))
    g.add(line(334, 60, 350, 60, "l1"), text(354, 64, "if y = 1", "ts", "start"), text(354, 80, "cost −ln h", "ts2", "start"))
    g.add(line(334, 110, 350, 110, "l2"), text(354, 114, "if y = 0", "ts", "start"), text(354, 130, "cost −ln(1−h)", "ts2", "start"))
    reg("s5-logloss", g, "Log-loss for one example. When the true answer is 1 (blue), the cost is near zero for a confident correct prediction and shoots up as the prediction heads toward 0. The orange curve is the mirror image for y = 0.")

# ================================================================= AML S6

def s6_tree():
    g = Fig("s6t", 230)
    g.box(160, 8, 120, 34, "10,000 people", "boxn")
    g.box(40, 76, 150, 36, ["100 ill (1%)"], "box2")
    g.box(250, 76, 150, 36, ["9,900 healthy"], "box")
    g.arrow(200, 42, 130, 76); g.arrow(240, 42, 320, 76)
    g.box(10, 146, 100, 36, ["95 test +"], "cb")
    g.box(120, 146, 90, 36, ["5 test −"], "boxn")
    g.box(230, 146, 100, 36, ["495 test +"], "cb")
    g.box(340, 146, 90, 36, ["9,405 test −"], "boxn")
    for a, b in [(90, 60), (140, 165), (300, 280), (350, 385)]:
        g.arrow(a, 112, b, 146)
    g.add(text(220, 212, "Positives: 95 + 495 = 590.  P(ill | +) = 95 / 590 ≈ 16%", "tb"))
    reg("s6-tree", g, "Why a positive test from a 95%-accurate test means only a 16% chance of disease. The rare disease produces 95 true positives, but the huge healthy group produces 495 false positives. The prior (1%) outweighs the likelihood.")

def s6_gauss():
    g = Fig("s6g", 230)
    p = Plot(g, 60, 26, 280, 150, (140, 200), (0, 0.085))
    p.axes(xt=[140, 150, 160, 170, 180, 190, 200], yt=[0, 0.04, 0.08], xl="height (cm)", yl="density", fmt=lambda v: f"{v:.2f}")
    p.curve(lambda x: npdf(x, 175, 6), 140, 200, "l1")
    p.curve(lambda x: npdf(x, 162, 5), 140, 200, "l2")
    g.add(line(p.X(172), p.Y(0), p.X(172), p.Y(0.08), "guide2"), text(p.X(172), p.Y(0.08) - 4, "172 cm", "tb"))
    m, fe = npdf(172, 175, 6), npdf(172, 162, 5)
    g.add(circle(*p.P(172, m), 5, "d1", f"male density {m:.4f}"), circle(*p.P(172, fe), 5, "d2", f"female density {fe:.4f}"))
    g.add(text(p.X(172) + 8, p.Y(m) + 4, f"{m:.4f}", "ts", "start"), text(p.X(172) + 8, p.Y(fe) + 4, f"{fe:.4f}", "ts", "start"))
    g.add(line(356, 60, 372, 60, "l1"), text(376, 64, "male", "ts", "start"), text(376, 80, "μ 175, σ 6", "ts2", "start"),
          line(356, 110, 372, 110, "l2"), text(376, 114, "female", "ts", "start"), text(376, 130, "μ 162, σ 5", "ts2", "start"))
    reg("s6-gauss", g, "Gaussian Naïve Bayes for a continuous attribute. Each class gets its own bell curve; the height of each curve at 172 cm is that class's likelihood. Here the male curve is about 5× higher.")

def s6_gendisc():
    g = Fig("s6gd", 200)
    rnd = random.Random(21)
    A = [(rnd.gauss(0.32, 0.1), rnd.gauss(0.35, 0.1)) for _ in range(12)]
    B = [(rnd.gauss(0.7, 0.1), rnd.gauss(0.66, 0.1)) for _ in range(12)]
    for i, title in enumerate(["Generative (e.g. NB)", "Discriminative (LR, SVM)"]):
        x0 = 10 + i * 216
        p = Plot(g, x0, 28, 204, 140, (0, 1), (0, 1))
        g.add(rect(x0, 28, 204, 140, "panel", 4), text(x0 + 102, 20, title, "tb"))
        if i == 0:
            for (cx, cy), cls in [((0.32, 0.35), "grp1"), ((0.7, 0.66), "grp2")]:
                for r in (0.12, 0.22):
                    g.add(f'<ellipse cx="{f(p.X(cx))}" cy="{f(p.Y(cy))}" rx="{f(r * 204)}" ry="{f(r * 140)}" class="{cls}"/>')
        else:
            g.add(line(p.X(0.1), p.Y(0.95), p.X(0.95), p.Y(0.05), "l1"))
        for x, y in A:
            g.add(circle(*p.P(x, y), 4, "d1"))
        for x, y in B:
            g.add(square(*p.P(x, y), 4, "d2"))
        g.add(text(x0 + 102, 186, ["models what each class looks like", "learns only the boundary"][i], "ts2"))
    reg("s6-gendisc", g, "Two ways to classify. A generative model describes each class's data (the contours), then asks which class more likely produced a new point. A discriminative model skips that and learns the boundary directly.")

# ================================================================= AML S7

POS = [(3, 2), (4, 3), (2, 3), (3, -1)]
NEG = [(1, 0), (1, -1), (0, 2), (-1, 2)]

def s7_margin():
    g = Fig("s7m", 240)
    for i in range(2):
        x0 = 10 + i * 218
        p = Plot(g, x0, 28, 200, 175, (-1.8, 4.8), (-1.9, 3.9))
        g.add(rect(x0, 28, 200, 175, "panel", 4))
        g.add(f'<clipPath id="s7m-clip{i}"><rect x="{x0}" y="28" width="200" height="175"/></clipPath>')
        def ln(c, cls):
            g.add(line(*p.P(-1.8, c + 7.2), *p.P(4.8, c - 19.2), cls).replace("/>", f' clip-path="url(#s7m-clip{i})"/>'))
        if i == 0:
            for a_, c_ in [(4, 6), (2, 4.5), (3, 5.5), (1.2, 3.6)]:
                g.add(line(*p.P((c_ + 1.9) / a_, -1.9), *p.P((c_ - 3.9) / a_, 3.9), "thin").replace("/>", f' clip-path="url(#s7m-clip{i})"/>'))
            g.add(text(x0 + 100, 20, "Many lines separate the data…", "tb"))
        else:
            g.add(path([p.P(-1.8, 11 + 7.2), p.P(4.8, 11 - 19.2), p.P(4.8, 4 - 19.2), p.P(-1.8, 4 + 7.2)], "zone1", True).replace("/>", f' clip-path="url(#s7m-clip{i})"/>'))
            ln(11, "guide"); ln(4, "guide"); ln(7.5, "l2")
            for s in [(2, 3), (3, -1), (1, 0)]:
                g.add(circle(*p.P(*s), 9, "svring"))
            g.add(text(x0 + 100, 20, "…SVM picks the widest margin", "tb"))
        for q in POS:
            g.add(circle(*p.P(*q), 4.5, "d1", f"+ {q}"))
        for q in NEG:
            g.add(square(*p.P(*q), 4.5, "d2", f"− {q}"))
    g.add(text(228 + 100, 222, "4x + y = 7.5, margin 2/‖w‖ = 1.70", "ts"),
          text(228 + 100, 236, "circled = support vectors", "ts2"))
    g.add(circle(40, 226, 4, "d1"), text(48, 230, "positive", "ts2", "start"), square(110, 226, 4, "d2"), text(118, 230, "negative", "ts2", "start"))
    reg("s7-margin", g, "The revision-deck data. Any of the thin lines separates the classes, but a new point near one of them could fall on the wrong side. The SVM chooses the line with the widest empty band (the margin); only the three circled support vectors touch its edges.")

def s7_slack():
    g = Fig("s7s", 250)
    p = Plot(g, 40, 14, 210, 210, (0, 4.2), (0, 4.2))
    g.add(path([p.P(0, 2), p.P(2, 0), p.P(4.2, 0), p.P(4.2, 0), p.P(0, 4.2)], "zone0", True))
    g.add(path([p.P(0, 2), p.P(2, 0), p.P(4, 0), p.P(0, 4)], "zone1", True))
    p.axes(xt=[0, 1, 2, 3, 4], yt=[0, 1, 2, 3, 4], grid=False)
    g.add(line(*p.P(0, 3), *p.P(3, 0), "l2"), line(*p.P(0, 2), *p.P(2, 0), "guide"), line(*p.P(0, 4), *p.P(4, 0), "guide"))
    pts = [((1, 1), "−", "ξ = 0"), ((2, 2), "+", "ξ = 0"), ((3, 3), "+", "safe"), ((2, 0.5), "−", "ξ = 0.5"),
           ((1.8, 1.5), "+", "ξ = 0.7"), ((1, 1.5), "+", "ξ = 1.5")]
    for (x, y), c, lab in pts:
        if c == "+":
            g.add(circle(*p.P(x, y), 5, "d1", f"{lab}"))
        else:
            g.add(square(*p.P(x, y), 5, "d2", f"{lab}"))
        if (x, y) == (1, 1.5):
            g.add(text(p.X(x) - 8, p.Y(y) + 4, lab, "ts", "end"))
        else:
            g.add(text(p.X(x) + 8, p.Y(y) + 4, lab, "ts", "start"))
    g.add(text(268, 50, "Solid: boundary x₁ + x₂ = 3", "ts", "start"), text(268, 68, "Dashed: margin lines (= 2, = 4)", "ts", "start"),
          text(268, 104, "ξ = 0: outside the margin", "ts2", "start"), text(268, 120, "0 < ξ < 1: inside, still correct", "ts2", "start"),
          text(268, 136, "ξ > 1: wrong side (misclassified)", "ts2", "start"),
          text(268, 172, "Objective: ½‖w‖² + C·Σξ", "tb", "start"))
    reg("s7-slack", g, "Soft margin with w = (1, 1), b = −3. Points outside the band cost nothing; points inside it pay a slack ξ between 0 and 1; the point on the wrong side pays ξ > 1. C sets how expensive those payments are.")

def s7_lift():
    g = Fig("s7l", 250)
    p = Plot(g, 60, 20, 270, 170, (-0.4, 6.4), (-0.8, 10))
    p.axes(xt=[0, 1, 2, 3, 4, 5, 6], yt=[0, 2.5, 5, 9], xl="x (original feature)", yl="z = (x − 3)²")
    p.curve(lambda x: (x - 3) ** 2, -0.3, 6.3, "lg")
    g.add(line(p.X(-0.4), p.Y(2.5), p.X(6.4), p.Y(2.5), "l2"))
    for x in range(7):
        z = (x - 3) ** 2
        cls = "d1" if 2 <= x <= 4 else "d2"
        mk = circle if cls == "d1" else square
        g.add(mk(*p.P(x, z), 4.5, cls, f"x = {x}, z = {z}"))
        g.add(line(p.X(x), p.Y(z), p.X(x), p.Y(-0.6), "res"))
        g.add(mk(p.X(x), p.Y(-0.6), 4, cls))
    for xc in (3 - math.sqrt(2.5), 3 + math.sqrt(2.5)):
        g.add(line(p.X(xc), p.Y(2.5), p.X(xc), p.Y(-0.8), "guide2"))
    g.add(text(p.X(6.4) + 6, p.Y(2.5) + 4, "z = 2.5", "tb", "start"),
          text(344, 70, "one flat line", "ts2", "start"), text(344, 86, "in the lifted", "ts2", "start"), text(344, 102, "space…", "ts2", "start"),
          text(344, 176, "…= two cuts", "ts2", "start"), text(344, 192, "x = 1.42, 4.58", "ts2", "start"))
    reg("s7-lift", g, "The kernel idea in one picture. On the original line (bottom row) the pattern − − + + + − − can't be split by one cut. Lifting each point to height z = (x − 3)² puts the positives low and negatives high, so one flat line z = 2.5 separates them. Back on the original line that becomes two cut points.")

def s7_xor():
    g = Fig("s7x", 210)
    p = Plot(g, 20, 28, 160, 150, (-1.6, 1.6), (-1.6, 1.6))
    g.add(rect(20, 28, 160, 150, "panel", 4))
    g.add(line(p.X(0), p.Y(-1.6), p.X(0), p.Y(1.6), "gr"), line(p.X(-1.6), p.Y(0), p.X(1.6), p.Y(0), "gr"))
    for (x, y) in [(1, 1), (-1, -1)]:
        g.add(circle(*p.P(x, y), 5.5, "d1", f"+ ({x}, {y})"))
    for (x, y) in [(1, -1), (-1, 1)]:
        g.add(square(*p.P(x, y), 5.5, "d2", f"− ({x}, {y})"))
    g.add(text(100, 20, "XOR: no straight line works", "tb"))
    g.arrow(190, 100, 240, 100)
    g.add(text(215, 90, "z = x₁x₂", "tb"))
    q = Plot(g, 260, 60, 160, 80, (-1.6, 1.6), (0, 1))
    g.add(line(q.X(-1.6), q.Y(0.5), q.X(1.6), q.Y(0.5), "ax"))
    for v in (-1, 1):
        g.add(text(q.X(v), q.Y(0.5) + 18, str(v), "ts"))
    g.add(text(q.X(0) + 6, q.Y(0.5) + 18, "0", "ts", "start"))
    g.add(square(q.X(-1), q.Y(0.5) - 10, 5.5, "d2"), square(q.X(-1), q.Y(0.5) - 24, 5.5, "d2"))
    g.add(circle(q.X(1), q.Y(0.5) - 10, 5.5, "d1"), circle(q.X(1), q.Y(0.5) - 24, 5.5, "d1"))
    g.add(line(q.X(0), 40, q.X(0), 150, "l2"))
    g.add(text(340, 36, "z = 0 separates perfectly", "tb"), text(340, 170, "back in (x₁, x₂): x₁x₂ = 0,", "ts2"), text(340, 186, "i.e. the two axes", "ts2"))
    g.add(text(100, 196, "same signs → +, different → −", "ts2"))
    reg("s7-xor", g, "XOR can't be split by any line in the original plane, but the single feature z = x₁x₂ puts both + points at z = 1 and both − points at z = −1. The boundary z = 0 maps back to the two coordinate axes.")

# ================================================================= DMML L1

def d1_models():
    g = Fig("d1m", 330)
    def panel(x, y, w, h, title, sub):
        g.add(rect(x, y, w, h, "panel", 6), text(x + w / 2, y + 18, title, "tb"), text(x + w / 2, y + h - 8, sub, "ts2"))
    # relational
    panel(8, 8, 136, 150, "Relational", "tables + keys · SQL")
    for r in range(4):
        for c in range(3):
            g.add(rect(22 + c * 36, 32 + r * 22, 34, 20, "cell1" if r else "cell2", 2))
    g.add(text(76, 128, "Customers ⟷ Orders", "ts"))
    # hierarchical
    panel(152, 8, 136, 150, "Hierarchical", "tree · navigational")
    nodes = {"r": (220, 42), "a": (184, 82), "b": (256, 82), "c": (168, 120), "d": (200, 120), "e": (256, 120)}
    for a, b in [("r", "a"), ("r", "b"), ("a", "c"), ("a", "d"), ("b", "e")]:
        g.add(line(*nodes[a], *nodes[b], "ax2"))
    for n in nodes.values():
        g.add(circle(*n, 8, "n1"))
    # graph
    panel(296, 8, 136, 150, "Graph", "nodes + edges · Cypher")
    gn = [(322, 50), (380, 44), (410, 90), (352, 96), (320, 120), (400, 128)]
    for a, b in [(0, 1), (1, 2), (0, 3), (3, 2), (3, 4), (2, 5), (4, 5)]:
        g.add(line(*gn[a], *gn[b], "ax2"))
    for n in gn:
        g.add(circle(*n, 8, "n3"))
    # document
    panel(60, 168, 150, 150, "Document", "self-contained JSON")
    for i, s in enumerate(['{ "title": "Book1",', '  "author": "Pravin",', '  "sold_as": [', '    {"paperback": 20},', '    {"e-book": 10} ] }']):
        g.add(text(70, 206 + i * 18, s, "mono", "start"))
    # key-value
    panel(228, 168, 150, 150, "Key-value", "lookup by key only")
    for i, (k, v) in enumerate([("cart:u42", "[3 items]"), ("sess:9f1", "{…}"), ("cfg:theme", "dark")]):
        y = 196 + i * 34
        g.add(rect(238, y, 58, 24, "cell2", 3), text(267, y + 16, k, "ts"))
        g.arrow(298, y + 12, 316, y + 12)
        g.add(rect(318, y, 52, 24, "cell1", 3), text(344, y + 16, v, "ts"))
    reg("d1-models", g, "The five data models side by side. Each makes different questions easy: joins across tables (relational), walking a tree (hierarchical), following relationships (graph), fetching a whole flexible record (document), or a single lightning-fast lookup (key-value).")

def d1_graph():
    g = Fig("d1g", 220)
    N = {"F": (62, 110, "Flagged account", "box2", 110), "D": (168, 44, "Device D1", "boxn", 84), "P": (168, 176, "Phone P7", "boxn", 84),
         "A": (318, 44, "Acct A", "box", 70), "C": (318, 176, "Acct C", "box", 70), "B": (398, 110, "Acct B", "box", 70)}
    E = [("F", "D", "uses", -12, -4), ("F", "P", "uses", -12, 16), ("D", "A", "used by", 0, -6), ("P", "C", "used by", 0, -6), ("A", "B", "sends ₹", 16, -2)]
    for a, b, lab, ox, oy in E:
        x1, y1 = N[a][:2]; x2, y2 = N[b][:2]
        g.add(line(x1, y1, x2, y2, "ax2"))
    for k, (x, y, lab, cls, w) in N.items():
        g.box(x - w / 2, y - 16, w, 32, lab, cls, "ts")
    for a, b, lab, ox, oy in E:
        x1, y1 = N[a][:2]; x2, y2 = N[b][:2]
        g.add(text((x1 + x2) / 2 + ox, (y1 + y2) / 2 + oy, lab, "ts2"))
    g.add(text(220, 214, "MATCH (f {flagged:true})-[*1..3]-(s) RETURN s", "mono"))
    reg("d1-graph", g, "Fraud-ring detection with a graph. Starting from the flagged account, follow up to three relationships (shared device, shared phone, transfers) to reach suspects A, B and C. In a graph database each hop just follows a stored link; in SQL each hop is another JOIN.")

def d1_rowcol():
    g = Fig("d1r", 230)
    cols = [("id", "cell1"), ("city", "cell2"), ("amt", "cell3")]
    g.add(text(76, 16, "The table", "tb"))
    for c, (n, cls) in enumerate(cols):
        g.add(rect(12 + c * 44, 24, 42, 20, "boxn", 2), text(33 + c * 44, 38, n, "ts"))
        for r in range(3):
            g.add(rect(12 + c * 44, 46 + r * 22, 42, 20, cls, 2), text(33 + c * 44, 60 + r * 22, f"{n[0]}{r + 1}", "ts"))
    g.add(text(296, 16, "How it's laid out on disk", "tb"))
    g.add(text(158, 50, "Row store", "tb", "start"))
    x = 158
    for r in range(3):
        for c, (n, cls) in enumerate(cols):
            g.add(rect(x, 58, 29, 22, cls, 2), text(x + 14.5, 73, f"{n[0]}{r + 1}", "ts"))
            x += 30
        x += 4
    g.add(text(158, 108, "Column store", "tb", "start"))
    x = 158
    for c, (n, cls) in enumerate(cols):
        for r in range(3):
            g.add(rect(x, 116, 29, 22, cls, 2), text(x + 14.5, 131, f"{n[0]}{r + 1}", "ts"))
            x += 30
        x += 4
    g.add(rect(158 + 94 - 3, 112, 188, 30, "ring2", 5))
    g.add(text(12, 172, "“Save a new order” → the row store writes one block.", "ts", "start"),
          text(12, 192, "“Total amount by city” → the column store reads only", "ts", "start"),
          text(12, 208, "the city and amt blocks (dashed); a row store reads everything.", "ts", "start"))
    reg("d1-rowcol", g, "The same three-row table stored two ways. A row store keeps each record together (fast whole-record writes, OLTP); a column store keeps each column together, so an analytical query reads only the columns it needs (OLAP, ML training).")

def d1_cube():
    g = Fig("d1c", 230)
    ox, oy, s, dx, dy = 44, 196, 28, 16, -11
    def iso(i, j, k):
        return (ox + i * s + k * dx, oy - j * s + k * dy)
    for i in range(4):
        for j in range(4):
            x, y = iso(i, j + 1, 0)
            g.add(rect(x, y, s - 2, s - 2, "cell2" if i == 2 else "cell1", 2))
    for i in range(4):
        for k in range(3):
            g.add(path([iso(i, 4, k), iso(i + 1, 4, k), iso(i + 1, 4, k + 1), iso(i, 4, k + 1)], "cell2" if i == 2 else "cell1", True))
    for j in range(4):
        for k in range(3):
            g.add(path([iso(4, j, k), iso(4, j + 1, k), iso(4, j + 1, k + 1), iso(4, j, k + 1)], "cell1", True))
    g.add(text(ox + 2 * s, oy + 18, "Time →", "ts"))
    g.add(f'<text x="{ox - 12}" y="{oy - 2 * s}" class="ts" text-anchor="middle" transform="rotate(-90 {ox - 12} {oy - 2 * s})">Product →</text>')
    g.add(text(ox + 4 * s + 3 * dx + 2, oy - 4 * s + 3 * dy - 4, "Region ↗", "ts", "start"))
    g.add(text(ox + 2.5 * s, 22, "slice: one year (orange)", "ts2"))
    hx = 290
    for i, lab in enumerate(["Country", "State", "City"]):
        g.box(hx, 50 + i * 52, 90, 30, lab, "boxn", "ts")
    g.arrow(hx - 14, 180, hx - 14, 54)
    g.add(text(hx - 14, 44, "roll-up", "tb"))
    g.arrow(hx + 104, 54, hx + 104, 180)
    g.add(text(hx + 104, 198, "drill-down", "tb"))
    reg("d1-cube", g, "OLAP thinks of data as a cube: a measure (sales) along dimensions (time, product, region). A slice fixes one dimension (orange: one year); roll-up summarises up a hierarchy (city → country) and drill-down goes the other way.")

# ================================================================= DMML L2

def d2_liability():
    g = Fig("d2l", 236)
    steps = [("1. Access restriction", "rights + logs", "box"), ("2. Pseudonymisation", "reversible IDs", "box3"), ("3. Connection removal", "unlink PII", "box2")]
    for i, (a, b, cls) in enumerate(steps):
        x, y = 10 + i * 144, 150 - i * 50
        g.box(x, y, 136, 46, [a, b], cls, "ts", lh=16)
    g.add(text(362, 42, "recommended", "tb"))
    g.arrow(10, 212, 430, 212)
    g.add(text(430, 230, "protection ↑ and effort ↑", "ts2", "end"))
    g.add(text(10, 22, "Hospital example:", "ts", "start"), text(10, 40, "1. only the treating doctor sees names", "ts2", "start"),
          text(10, 56, "2. names swapped for random IDs", "ts2", "start"), text(10, 72, "3. model data has no link to identity", "ts2", "start"))
    reg("d2-liability", g, "Three ways to reduce the risk that data becomes a liability, from least to most protective. Each step protects more, but is harder to do while keeping the data useful.")

def d2_components():
    g = Fig("d2c", 220)
    g.add(circle(220, 110, 44, "n3"), text(220, 106, "the", "ts"), text(220, 122, "data", "tb"))
    bx = [(20, 20, "I. Integration & processing", "ETL → ELT; filter, merge"), (250, 20, "II. Storage", "warehouse / lake / lakehouse"),
          (20, 150, "III. Governance", "metadata, taxonomy, roles"), (250, 150, "IV. Security", "access, encryption, masking")]
    for x, y, a, b in bx:
        g.box(x, y, 170, 50, [a, b], "box", "ts", lh=16)
    for x, y in [(190, 60), (250, 60), (190, 160), (250, 160)]:
        g.arrow(x + (15 if x > 200 else -15) * 0, y, 220 + (x - 220) * 0.5, 110 + (y - 110) * 0.5)
    reg("d2-components", g, "The four components of data management, all serving the same data: get it in and shape it, store it, agree on what it means and who owns it, and guard it.")

# ================================================================= DMML L3

def d3_central():
    g = Fig("d3c", 230)
    titles = ["Centralised", "Decentralised", "Hybrid"]
    for i, t in enumerate(titles):
        x0 = 6 + i * 146
        g.add(rect(x0, 6, 140, 200, "panel", 6), text(x0 + 70, 24, t, "tb"))
        for j in range(3):
            g.box(x0 + 8 + j * 43, 40, 38, 24, f"BU{j + 1}", "boxn", "ts")
        if i == 0:
            for j in range(3):
                g.arrow(x0 + 27 + j * 43, 64, x0 + 70, 104)
            g.box(x0 + 20, 106, 100, 34, "one hub", "box2", "ts")
            g.arrow(x0 + 70, 140, x0 + 70, 164)
            g.box(x0 + 20, 166, 100, 28, "group reports", "box", "ts")
        elif i == 1:
            for j in range(3):
                g.arrow(x0 + 27 + j * 43, 64, x0 + 27 + j * 43, 96)
                g.box(x0 + 8 + j * 43, 98, 38, 44, ["own", "stack"], "box3", "ts")
            g.box(x0 + 20, 166, 100, 28, "stitched reports", "boxn", "ts")
            for j in range(3):
                g.arrow(x0 + 27 + j * 43, 142, x0 + 70, 166)
        else:
            g.add(rect(x0 + 6, 76, 128, 26, "box2", 4), text(x0 + 70, 93, "governance + MDM", "ts"))
            for j, d in enumerate(["cust", "pay", "risk"]):
                g.box(x0 + 8 + j * 43, 114, 38, 36, d, "box3", "ts")
            g.box(x0 + 20, 166, 100, 28, "group reports", "box", "ts")
    g.add(text(76, 222, "banks, hospitals", "ts2"), text(222, 222, "insurance", "ts2"), text(368, 222, "telecom", "ts2"))
    reg("d3-central", g, "Who controls the data. Centralised: every business unit feeds one hub. Decentralised: each unit runs its own stack and reports are stitched together. Hybrid: domains own their data under shared governance and master data.")

def d3_starsnow():
    g = Fig("d3s", 230)
    def star(x0, title, snow):
        g.add(text(x0 + 110, 16, title, "tb"))
        cx, cy = x0 + 110, 116
        dims = [("Date", 0, -70), ("Product", 66, -8), ("Store", 0, 70), ("Customer", -66, -8)]
        subs = [("Category", 66, -8, 0, -52), ("City", 0, 70, 66, 0)] if snow else []
        for n, dx, dy in dims:
            g.add(line(cx, cy, cx + dx, cy + dy, "ax2"))
        for n, dx, dy, sx, sy in subs:
            g.add(line(cx + dx, cy + dy, cx + dx + sx, cy + dy + sy, "ax2"))
        g.box(cx - 36, cy - 20, 72, 40, ["Sales", "(fact)"], "box2", "ts", lh=14)
        for n, dx, dy in dims:
            g.box(cx + dx - 32, cy + dy - 13, 64, 26, n, "box", "ts")
        for n, dx, dy, sx, sy in subs:
            g.box(cx + dx + sx - 32, cy + dy + sy - 12, 64, 24, n, "box3", "ts")
    star(0, "Star: one level", False)
    star(220, "Snowflake: dimensions split", True)
    g.add(text(110, 224, "denormalised: fewer joins, faster", "ts2"), text(330, 224, "normalised: less repetition", "ts2"))
    reg("d3-starsnow", g, "Warehouse schemas. A star keeps each dimension in one wide table around the fact table (fast, simple). A snowflake splits dimensions into sub-tables such as Product → Category (less duplication, more joins).")

def d3_lambda():
    g = Fig("d3l", 272)
    g.add(text(220, 16, "Lambda: two paths", "tb"))
    g.box(10, 50, 90, 50, ["events", "(immutable)"], "boxn", "ts", lh=15)
    g.box(140, 28, 130, 36, "batch layer (cold)", "box", "ts")
    g.box(140, 86, 130, 36, "speed layer (hot)", "box2", "ts")
    g.box(320, 50, 110, 50, ["serving", "layer"], "box3", "ts", lh=15)
    g.arrow(100, 68, 140, 46); g.arrow(100, 82, 140, 104); g.arrow(270, 46, 320, 66); g.arrow(270, 104, 320, 86)
    g.add(text(205, 140, "accurate but hours behind  /  fast but approximate", "ts2"))
    g.add(text(220, 170, "Kappa: one stream", "tb"))
    g.box(10, 190, 130, 40, "ordered event log", "boxn", "ts")
    g.box(175, 190, 120, 40, "stream processor", "box2", "ts")
    g.box(330, 190, 100, 40, "live views", "box3", "ts")
    g.arrow(140, 210, 175, 210); g.arrow(295, 210, 330, 210)
    g.add(f'<path d="M 235 230 C 235 256, 75 256, 75 232" class="arr" fill="none" marker-end="url(#ah-{g.name})"/>')
    g.add(text(155, 266, "replay from the start to recompute", "ts2"))
    reg("d3-lambda", g, "Lambda sends every event down a slow, accurate batch path and a fast speed path, then merges them (two codebases). Kappa keeps one ordered log and one stream processor, and recomputes history by replaying the log.")

def d3_mesh():
    g = Fig("d3m", 230)
    g.add(text(108, 16, "Data mesh: who owns it", "tb"), text(330, 16, "Data fabric: how it connects", "tb"))
    for i, d in enumerate(["Orders", "Payments", "Catalog"]):
        x = 10 + i * 68
        g.add(rect(x, 30, 62, 110, "panel", 5), text(x + 31, 46, d, "ts"))
        g.box(x + 6, 56, 50, 30, "team", "boxn", "ts")
        g.box(x + 6, 96, 50, 36, ["data", "product"], "box2", "ts", lh=13)
    g.box(10, 152, 198, 26, "self-serve platform", "box", "ts")
    g.add(text(108, 196, "+ federated governance", "ts2"))
    for i, s in enumerate(["lake", "DW", "CRM", "DB"]):
        x = 240 + i * 48
        g.box(x, 60, 44, 36, s, "boxn", "ts")
        g.arrow(x + 22, 96, x + 22, 138)
    g.box(240, 138, 188, 40, ["one fabric layer", "APIs · CDC · virtualisation"], "box3", "ts", lh=15)
    g.arrow(334, 178, 334, 200); g.add(text(334, 216, "query it all as one", "ts2"))
    reg("d3-mesh", g, "Mesh changes ownership: each domain team publishes its data as a product on a shared self-serve platform. Fabric changes connectivity: one technical layer spans all existing stores (lake, warehouse, CRM, databases) so they can be queried together.")

# ================================================================= DMML L4

def d4_modes():
    g = Fig("d4m", 230)
    rows = [("1. Through a database", [("writer app", "box"), ("database", "boxn"), ("reader app", "box")], "encode now, decode later"),
            ("2. Through service calls", [("client", "box"), ("API / service", "box3"), ("", None)], "request → response, right now"),
            ("3. Through a message broker", [("producer", "box"), ("topic / queue", "box2"), ("consumers", "box")], "async, buffered, fan-out")]
    for i, (t, bs, note) in enumerate(rows):
        y = 24 + i * 70
        g.add(text(10, y, t, "tb", "start"))
        for j, (lab, cls) in enumerate(bs):
            if not cls:
                continue
            g.box(10 + j * 150, y + 10, 120, 34, lab, cls, "ts")
        if i == 1:
            g.arrow(130, y + 20, 160, y + 20); g.arrow(160, y + 34, 130, y + 34)
        else:
            g.arrow(130, y + 27, 160, y + 27); g.arrow(280, y + 27, 310, y + 27)
        g.add(text(430, y, note, "ts2", "end"))
    reg("d4-modes", g, "The three ways data moves between programs: left in a database for someone to read later, asked for directly through a service call, or published to a broker that delivers it to whoever subscribes.")

def d4_compat():
    g = Fig("d4c", 190)
    rows = [("Backward compatibility", "v2 code", "box2", "data written by v1", "cell1", "new code reads old data"),
            ("Forward compatibility", "v1 code", "box", "data written by v2", "cell2", "old code reads new data")]
    for i, (t, code, cc, data, dc, note) in enumerate(rows):
        y = 20 + i * 76
        g.add(text(10, y, t, "tb", "start"), text(430, y, note, "ts2", "end"))
        g.box(10, y + 12, 110, 36, code, cc, "ts")
        g.arrow(120, y + 30, 250, y + 30)
        g.add(text(185, y + 24, "reads", "ts"))
        g.box(250, y + 12, 160, 36, data, dc, "ts")
    g.add(text(220, 182, "During a rolling upgrade v1 and v2 run side by side, so you need both.", "ts2"))
    reg("d4-compat", g, "Backward compatibility lets new code read data written by old code; forward compatibility lets old code read data written by new code. A rolling upgrade needs both at once.")

def d4_broker():
    g = Fig("d4b", 220)
    g.box(10, 90, 100, 40, "order service", "box")
    g.box(150, 80, 110, 60, ["topic:", "OrderPlaced"], "box2", "t", lh=16)
    g.arrow(110, 110, 150, 110)
    subs = ["warehouse", "payments", "SMS", "analytics", "ML model"]
    for i, s in enumerate(subs):
        y = 14 + i * 42
        g.box(320, y, 110, 32, s, "box3", "ts")
        g.arrow(260, 110, 320, y + 16)
    g.add(text(60, 150, "publish once,", "ts2"), text(60, 166, "move on", "ts2"))
    g.add(text(205, 170, "stores messages if a", "ts2"), text(205, 186, "subscriber is down", "ts2"))
    reg("d4-broker", g, "Publish/subscribe through a broker. The order service publishes one message; every interested service receives its own copy when it's ready. If the SMS service is down, its messages wait in the broker.")

def d4_tdsmds():
    g = Fig("d4t", 240)
    g.add(text(105, 16, "Traditional data stack", "tb"), text(325, 16, "Modern data stack", "tb"))
    g.add(rect(30, 30, 150, 170, "boxn", 8))
    for i, s in enumerate(["on-prem servers", "one big ETL tool", "fixed warehouse", "Excel reports"]):
        g.add(text(105, 64 + i * 36, s, "ts"))
    g.add(text(105, 222, "monolithic · manual · batch", "ts2"))
    layers = [("BI & analytics", "Looker, Tableau"), ("transformation", "dbt (SQL)"), ("storage", "Snowflake, BigQuery"), ("ingestion", "Fivetran, Kafka")]
    for i, (a, b) in enumerate(layers):
        y = 30 + i * 44
        g.box(240, y, 170, 38, [a, b], ["box3", "box", "box2", "box"][i], "ts", lh=15)
    g.add(text(325, 222, "cloud · modular · elastic", "ts2"))
    reg("d4-tdsmds", g, "The traditional stack is one on-premises block that is hard to change. The modern stack is a set of cloud layers, each a separate plug-and-play tool, that scale on demand and are paid for as used.")

# ================================================================= DMML L5

def d5_storage():
    g = Fig("d5s", 220)
    g.add(text(72, 16, "File", "tb"), text(220, 16, "Block", "tb"), text(368, 16, "Object", "tb"))
    tree = [(20, 36, "/data"), (36, 60, "/orders"), (52, 84, "2025.csv"), (52, 108, "2026.csv"), (36, 132, "/logs"), (52, 156, "app.log")]
    for x, y, s in tree:
        g.add(text(x, y, ("📁 " if s.startswith("/") else "📄 ") + s, "ts", "start"))
    g.add(text(72, 196, "folders + byte streams", "ts2"))
    for r in range(4):
        for c in range(4):
            n = r * 4 + c
            g.add(rect(160 + c * 30, 34 + r * 30, 27, 27, "cell2" if n == 6 else "cell1", 3), text(173.5 + c * 30, 52 + r * 30, str(n), "ts"))
    g.add(text(220, 172, "rewrite any one block", "ts2"), text(220, 196, "databases, VM disks", "ts2"))
    g.add(rect(300, 36, 136, 130, "panel", 10))
    for i, k in enumerate(["img/482.jpg", "logs/day1.gz", "model.bin"]):
        g.add(rect(310, 48 + i * 38, 116, 28, "box3", 4), text(368, 66 + i * 38, k, "ts"))
    g.add(text(368, 180, "key → whole object", "ts2"), text(368, 196, "immutable; lakes (S3)", "ts2"))
    reg("d5-storage", g, "File storage organises byte streams in a folder tree. Block storage is a grid of fixed-size numbered blocks, any of which can be rewritten (good for databases). Object storage keeps whole immutable objects under keys, cheaply and at huge scale: the basis of data lakes.")

def d5_consistency():
    g = Fig("d5c", 236)
    for i, (t, sub) in enumerate([("Strong consistency", "replicas agree before confirming"), ("Eventual consistency", "confirm first, copies catch up")]):
        y0 = 20 + i * 112
        g.add(text(10, y0, t, "tb", "start"), text(430, y0, sub, "ts2", "end"))
        g.add(line(90, y0 + 34, 420, y0 + 34, "ax"), line(90, y0 + 70, 420, y0 + 70, "ax"))
        g.add(text(84, y0 + 38, "primary", "ts", "end"), text(84, y0 + 74, "replica", "ts", "end"))
        g.add(circle(120, y0 + 34, 5, "d1", "write x = 5"), text(120, y0 + 24, "write x=5", "ts"))
        if i == 0:
            g.arrow(120, y0 + 34, 200, y0 + 70)
            g.add(circle(200, y0 + 70, 5, "d1"), text(250, y0 + 24, "confirm after sync", "ts"))
            g.add(circle(320, y0 + 70, 5, "d3", "read → 5"), text(320, y0 + 90, "read → 5 ✓", "ts"))
        else:
            g.add(text(200, y0 + 24, "confirm now", "ts"))
            g.add(circle(180, y0 + 70, 5, "d2", "read → 4"), text(180, y0 + 90, "read → 4 (stale)", "ts"))
            g.arrow(120, y0 + 34, 290, y0 + 70)
            g.add(circle(350, y0 + 70, 5, "d3", "read → 5"), text(350, y0 + 90, "later → 5 ✓", "ts"))
    reg("d5-consistency", g, "After a write, strong consistency makes the replicas agree before confirming, so every read sees the new value (bank balances). Eventual consistency confirms at once, so a read may briefly see the old value until the copies catch up (like counts).")

def d5_stack():
    g = Fig("d5st", 290)
    layers = ["model development", "feature engineering", "model operations", "versioning", "architecture", "job scheduler", "compute resources", "data warehouse"]
    for i, n in enumerate(layers):
        w = 140 + i * 24
        y = 12 + i * 32
        cls = "box2" if i < 3 else ("box3" if i < 5 else "box")
        g.box(210 - w / 2, y, w, 28, f"{8 - i}. {n}", cls, "ts")
    g.add(text(10, 26, "ML-specific,", "ts2", "start"), text(10, 42, "changes fastest", "ts2", "start"),
          text(430, 250, "generic", "ts2", "end"), text(430, 266, "foundations", "ts2", "end"))
    g.add(text(210, 284, "the model itself is the smallest layer", "ts2"))
    reg("d5-stack", g, "The data-science infrastructure stack, drawn so width suggests effort. Generic foundations (data, compute, scheduling) sit at the bottom; ML-specific work sits on top; model development is the smallest slice.")

def d5_reverse():
    g = Fig("d5r", 200)
    g.box(20, 80, 100, 44, ["CRM", "(salespeople)"], "box", "ts", lh=15)
    g.box(170, 20, 110, 40, "warehouse", "boxn", "ts")
    g.box(320, 80, 100, 44, ["lead-scoring", "model"], "box2", "ts", lh=15)
    g.box(170, 150, 110, 40, "scores table", "box3", "ts")
    g.arrow(70, 80, 170, 42); g.add(text(100, 50, "ETL", "tb"))
    g.arrow(280, 42, 370, 80)
    g.arrow(370, 124, 280, 168)
    g.arrow(170, 168, 70, 124); g.add(text(96, 170, "reverse ETL", "tb"))
    reg("d5-reverse", g, "Reverse ETL closes the loop. Data flows from the CRM into the warehouse, a model scores the leads, and reverse ETL writes the scores back into the CRM where salespeople already work.")

# ================================================================= DMML L6

def d6_cycle():
    g = Fig("d6c", 250)
    names = ["Business goal", "Framing", "Data processing", "Model development", "Deployment", "Monitoring"]
    cx, cy, R = 220, 125, 92
    pos = []
    for i, n in enumerate(names):
        a = -math.pi / 2 + i * 2 * math.pi / 6
        pos.append((cx + R * 1.55 * math.cos(a), cy + R * math.sin(a)))
    for i in range(6):
        (x1, y1), (x2, y2) = pos[i], pos[(i + 1) % 6]
        g.arrow(x1 + (x2 - x1) * 0.3, y1 + (y2 - y1) * 0.3, x1 + (x2 - x1) * 0.7, y1 + (y2 - y1) * 0.7)
    for i, (x, y) in enumerate(pos):
        g.box(x - 62, y - 15, 124, 30, names[i], "box2" if i == 0 else ("box3" if i == 5 else "box"), "ts")
    g.add(f'<path d="M {f(pos[5][0] + 10)} {f(pos[5][1] + 16)} Q {cx} {cy + 10} {f(pos[2][0] - 10)} {f(pos[2][1] - 16)}" class="arr2" fill="none" marker-end="url(#ah-{g.name})"/>')
    g.add(text(cx, cy + 34, "drift → back to data", "ts2"))
    reg("d6-cycle", g, "The ML lifecycle is a loop, not a line. Monitoring in production feeds back (dashed) to data processing and model development whenever drift or weak performance appears.")

def d6_deploy():
    g = Fig("d6d", 250)
    titles = ["Blue/green", "Canary", "A/B test", "Shadow"]
    for i, t in enumerate(titles):
        x0, y0 = 8 + (i % 2) * 218, 8 + (i // 2) * 120
        g.add(rect(x0, y0, 208, 110, "panel", 6), text(x0 + 104, y0 + 18, t, "tb"))
        g.box(x0 + 8, y0 + 44, 50, 34, "users", "boxn", "ts")
        if i == 0:
            g.box(x0 + 110, y0 + 28, 90, 26, "blue (old)", "boxn", "ts")
            g.box(x0 + 110, y0 + 66, 90, 26, "green (new)", "box3", "ts")
            g.arrow(x0 + 58, y0 + 61, x0 + 110, y0 + 79); g.add(text(x0 + 104, y0 + 104, "switch all traffic at once", "ts2"))
        elif i == 1:
            g.box(x0 + 110, y0 + 28, 90, 26, "old: 95%", "boxn", "ts")
            g.box(x0 + 110, y0 + 66, 90, 26, "new: 5%", "box3", "ts")
            g.arrow(x0 + 58, y0 + 55, x0 + 110, y0 + 41); g.arrow(x0 + 58, y0 + 67, x0 + 110, y0 + 79, "arr3")
            g.add(text(x0 + 104, y0 + 104, "small group first, then grow", "ts2"))
        elif i == 2:
            g.box(x0 + 110, y0 + 28, 90, 26, "old: 50%", "boxn", "ts")
            g.box(x0 + 110, y0 + 66, 90, 26, "new: 50%", "box3", "ts")
            g.arrow(x0 + 58, y0 + 55, x0 + 110, y0 + 41); g.arrow(x0 + 58, y0 + 67, x0 + 110, y0 + 79)
            g.add(text(x0 + 104, y0 + 104, "days/weeks: measure impact", "ts2"))
        else:
            g.box(x0 + 110, y0 + 28, 90, 26, "old: answers", "boxn", "ts")
            g.box(x0 + 110, y0 + 66, 90, 26, "new: logged", "box3", "ts")
            g.arrow(x0 + 58, y0 + 55, x0 + 110, y0 + 41); g.arrow(x0 + 58, y0 + 67, x0 + 110, y0 + 79, "arr3")
            g.add(text(x0 + 104, y0 + 104, "same inputs, zero user risk", "ts2"))
    reg("d6-deploy", g, "Four ways to release a new model safely. Blue/green switches all traffic between two identical environments; canary starts with a small slice; A/B splits traffic for long enough to measure business impact; shadow copies the inputs to the new model but only the old one answers users.")

def d6_federated():
    g = Fig("d6f", 220)
    g.box(160, 14, 120, 44, ["server", "global model"], "box2", "ts", lh=15)
    for i, d in enumerate(["phone A", "phone B", "phone C"]):
        x = 30 + i * 140
        g.box(x, 150, 100, 50, [d, "local data"], "box3", "ts", lh=15)
        g.arrow(210 + (i - 1) * 20, 58, x + 36, 150)
        g.arrow(x + 64, 150, 230 + (i - 1) * 20, 58, "arr3")
    g.add(text(80, 100, "model down", "ts", "end"), text(360, 100, "updates up", "ts", "start"))
    g.add(text(220, 216, "the data never leaves the device; only model updates travel", "ts2"))
    reg("d6-federated", g, "Federated learning. The server sends the current model to each device; each device trains on its own private data and sends back only the model update; the server averages the updates into a better model.")

def d6_drift():
    g = Fig("d6dr", 220)
    rnd = random.Random(8)
    for i, t in enumerate(["Data drift: inputs move", "Concept drift: rule changes"]):
        x0 = 10 + i * 216
        p = Plot(g, x0, 28, 204, 150, (0, 1), (0, 1))
        g.add(rect(x0, 28, 204, 150, "panel", 4), text(x0 + 102, 20, t, "tb"))
        if i == 0:
            g.add(line(p.X(0.5), p.Y(0), p.X(0.5), p.Y(1), "l1"))
            for _ in range(12):
                g.add(circle(*p.P(rnd.gauss(0.36, 0.1), rnd.gauss(0.36, 0.1)), 3.8, "dn"))
            for _ in range(12):
                g.add(circle(*p.P(rnd.gauss(0.62, 0.1), rnd.gauss(0.68, 0.1)), 3.8, "d2"))
            g.add(text(x0 + 102, 196, "grey: training · orange: new inputs", "ts2"))
        else:
            g.add(line(p.X(0.5), p.Y(0), p.X(0.5), p.Y(1), "guide"), line(p.X(0.2), p.Y(0), p.X(0.8), p.Y(1), "l2"))
            for _ in range(16):
                x, y = rnd.random(), rnd.random()
                pos = y > (x - 0.2) / 0.6
                g.add((circle if pos else square)(*p.P(x, y), 3.8, "d1" if pos else "d2"))
            g.add(text(x0 + 102, 196, "dashed: old boundary · orange: new", "ts2"))
    reg("d6-drift", g, "Data drift: new inputs come from a different region than the training data, though the rule (blue line) is unchanged. Concept drift: the inputs look the same, but the correct boundary itself has moved, so the old model's line (dashed) is now wrong.")

# ================================================================= DMML L7

def d7_partitions():
    g = Fig("d7p", 210)
    g.box(10, 80, 80, 44, ["producers", "(apps)"], "boxn", "ts", lh=15)
    g.add(text(220, 20, "topic: video-plays", "tb"))
    keys = [("user-1", "cell1"), ("user-2", "cell2"), ("user-3", "cell3")]
    for i, (k, cls) in enumerate(keys):
        y = 36 + i * 50
        g.add(rect(120, y, 200, 36, "panel", 4), text(126, y + 16, f"partition {i}", "ts2", "start"), text(126, y + 30, f"key: {k}", "ts2", "start"))
        for j in range(4):
            g.add(rect(200 + j * 28, y + 6, 24, 24, cls, 3), text(212 + j * 28, y + 22, str(j), "ts"))
        g.arrow(90, 102, 120, y + 18)
        g.arrow(320, y + 18, 350, y + 18)
        g.add(text(356, y + 22, f"consumer {i + 1}", "ts", "start"))
    g.add(text(220, 200, "same key → same partition, so each user's events stay in order", "ts2"))
    reg("d7-partitions", g, "A topic split into partitions, like lanes on a road. Each event's key (here the user id) decides its lane, so one user's events stay in order while different lanes are processed in parallel. Numbers are offsets.")

def d7_late():
    g = Fig("d7l", 200)
    p = Plot(g, 84, 40, 336, 100, (0, 12), (0, 1))
    g.add(rect(p.X(0), 44, p.X(5) - p.X(0), 92, "zone1", 0))
    g.add(line(p.X(0), p.Y(0.7), p.X(12), p.Y(0.7), "ax"), line(p.X(0), p.Y(0.2), p.X(12), p.Y(0.2), "ax"))
    g.add(text(78, p.Y(0.7) + 4, "happened", "ts", "end"), text(78, p.Y(0.2) + 4, "arrived", "ts", "end"))
    evs = [(1, 1.5), (2, 2.6), (3, 3.4), (4, 4.5), (2.5, 8.6)]
    for a, b in evs:
        late = b > 7
        g.add(line(p.X(a), p.Y(0.7), p.X(b), p.Y(0.2), "res"))
        g.add(circle(p.X(a), p.Y(0.7), 4.5, "d2" if late else "d1"), circle(p.X(b), p.Y(0.2), 4.5, "d2" if late else "d1"))
    g.add(line(p.X(7), 30, p.X(7), 150, "guide2"), text(p.X(7), 24, "watermark (cut-off)", "tb"))
    g.add(text(p.X(2.5), 160, "window: 0–5 min", "ts2"), text(p.X(9.4), 160, "late phone event:", "ts2"), text(p.X(9.4), 176, "past the cut-off, dropped", "ts2"))
    g.add(text(420, 196, "time (minutes) →", "ts2", "end"))
    reg("d7-late", g, "Late-arriving data. Each event has the time it happened (top) and the time it reached the pipeline (bottom). Most arrive quickly, but one (orange) arrives after the watermark, so it's no longer counted in its window.")

def d7_queuestream():
    g = Fig("d7q", 210)
    g.add(text(100, 16, "Queue: a mailbox", "tb"), text(330, 16, "Stream: a replayable log", "tb"))
    for i in range(4):
        cls = "cellx" if i == 0 else "cell1"
        g.add(rect(12 + i * 44, 50, 40, 32, cls, 3), text(32 + i * 44, 70, f"m{i + 1}", "ts"))
    g.add(text(100, 106, "m1 consumed + acked", "ts2"), text(100, 122, "→ deleted for good", "ts2"))
    for i in range(6):
        g.add(rect(236 + i * 32, 50, 30, 32, "cell3", 3), text(251 + i * 32, 70, str(i), "ts"))
    for lab, off, y in [("A at 5", 5, 110), ("B at 2", 2, 130)]:
        x = 251 + off * 32
        g.arrow(x, y - 12, x, 84)
        g.add(text(x, y + 4, lab, "ts"))
    g.add(text(330, 172, "events are kept; each reader", "ts2"), text(330, 188, "remembers its own offset", "ts2"))
    reg("d7-queuestream", g, "A queue deletes a message once it has been consumed and acknowledged. A stream keeps an ordered log; each consumer just remembers its own offset, so history can be re-read (replayed) at any time.")

# ================================================================= DMML L8

def d8_selection():
    g = Fig("d8s", 250)
    rnd = random.Random(4)
    pts = [(rnd.random(), rnd.random(), rnd.random() < 0.5) for _ in range(48)]
    titles = [("Coverage bias", "only our buyers invited"), ("Non-response bias", "competitor buyers decline"), ("Sampling bias", "first 200 replies only")]
    for i, (t, sub) in enumerate(titles):
        x0 = 8 + i * 146
        p = Plot(g, x0, 28, 138, 150, (0, 1), (0, 1))
        g.add(rect(x0, 28, 138, 150, "panel", 4), text(x0 + 69, 20, t, "tb"), text(x0 + 69, 196, sub, "ts2"))
        for j, (x, y, ours) in enumerate(pts):
            if i == 0:
                sel = ours
            elif i == 1:
                sel = ours or (j % 5 == 0)
            else:
                sel = x < 0.35
            cls = ("d1" if ours else "d2") if sel else "dn"
            (circle if ours else square) and g.add((circle if ours else square)(*p.P(x, y), 3.8, cls))
        if i == 2:
            g.add(line(p.X(0.35), p.Y(0), p.X(0.35), p.Y(1), "guide2"), text(p.X(0.17), p.Y(0) - 6, "fastest", "ts2"))
    g.add(circle(110, 222, 4, "d1"), text(118, 226, "our buyers", "ts2", "start"),
          square(200, 222, 4, "d2"), text(208, 226, "competitor buyers", "ts2", "start"),
          circle(320, 222, 4, "dn"), text(328, 226, "not in the sample", "ts2", "start"))
    g.add(text(220, 246, "In every case the sample no longer looks like the whole population.", "ts2"))
    reg("d8-selection", g, "The three sub-types of selection bias, using the product-survey example. Coloured points made it into the training data; grey ones didn't. Coverage leaves out a whole group, non-response loses the people who decline, and non-random sampling keeps only the keenest responders.")

def d8_psi():
    g = Fig("d8p", 220)
    p = Plot(g, 56, 16, 270, 160, (0, 4), (0, 0.45))
    p.axes(xt=[], yt=[0, 0.2, 0.4], yl="share of data", fmt=lambda v: f"{int(v * 100)}%")
    E, A = [0.25] * 4, [0.10, 0.20, 0.30, 0.40]
    for i in range(4):
        bx = p.X(i) + 10
        for j, (v, cls) in enumerate([(E[i], "bar1"), (A[i], "bar2")]):
            x = bx + j * 26
            g.add(f'<path d="M{f(x)},{f(p.Y(0))} V{f(p.Y(v) + 4)} Q{f(x)},{f(p.Y(v))} {f(x + 4)},{f(p.Y(v))} H{f(x + 20)} Q{f(x + 24)},{f(p.Y(v))} {f(x + 24)},{f(p.Y(v) + 4)} V{f(p.Y(0))} Z" class="{cls}"><title>{"training" if j == 0 else "production"} bin {i + 1}: {int(v * 100)}%</title></path>')
            g.add(text(x + 12, p.Y(v) - 5, f"{int(v * 100)}%", "ts"))
        g.add(text(p.X(i + 0.5), p.Y(0) + 16, f"bin {i + 1}", "ts"))
    g.add(rect(340, 50, 12, 12, "bar1", 2), text(358, 60, "training", "ts", "start"),
          rect(340, 76, 12, 12, "bar2", 2), text(358, 86, "production", "ts", "start"))
    g.add(text(340, 130, "PSI = 0.228", "tb", "start"), text(340, 148, "moderate shift", "ts2", "start"), text(340, 164, "(0.1–0.25)", "ts2", "start"))
    reg("d8-psi", g, "The PSI worked example. The training data was spread evenly over four bins; production data has shifted toward the higher bins. Summing (A − E)·ln(A/E) over the bins gives 0.228: a moderate shift worth investigating.")

def d8_leak():
    g = Fig("d8le", 190)
    g.add(line(20, 90, 420, 90, "ax"))
    g.add(line(220, 48, 220, 130, "guide2"), text(220, 40, "moment of prediction", "tb"), text(220, 146, "(loan application)", "ts2"))
    for x, s in [(50, "income"), (110, "age"), (170, "credit history")]:
        g.add(circle(x, 90, 5, "d1", s))
    g.add(text(50, 114, "income", "ts"), text(110, 114, "age", "ts"), text(170, 114, "credit", "ts"), text(170, 128, "history", "ts"))
    g.add(square(300, 90, 5, "d2", "late-payment reminders"), square(390, 90, 5, "dk", "target"))
    g.add(text(300, 114, "late-payment", "ts"), text(300, 128, "reminders", "ts"), text(390, 114, "the target", "ts"))
    g.add(text(110, 70, "known then: OK to use", "ts2"), text(340, 70, "only known later: leakage", "ts2"))
    g.add(text(220, 170, "In training every column is filled in; at prediction time", "ts2"), text(220, 184, "the right-hand ones are always empty.", "ts2"))
    reg("d8-leak", g, "A feature from the future. When a loan application is scored, late-payment reminders don't exist yet (they come after the loan starts). A model trained on them looks brilliant offline and fails in production.")

# ---------------------------------------------------------------- build

for fn in [s1_fits, s1_ucurve, s1_kfold, s1_threshold, s1_types, s1_rl,
           s2_ladder, s2_distance, s2_meanmedian, s2_corr, s2_boxplot, s2_curse, s2_pca, s2_cosine,
           s3_confusion, s3_threshold, s3_roc, s3_ova,
           s4_residuals, s4_bowl, s4_lr, s4_poly, s4_archery,
           s5_linearfail, s5_sigmoid, s5_boundary, s5_logloss,
           s6_tree, s6_gauss, s6_gendisc,
           s7_margin, s7_slack, s7_lift, s7_xor,
           d1_models, d1_graph, d1_rowcol, d1_cube,
           d2_liability, d2_components,
           d3_central, d3_starsnow, d3_lambda, d3_mesh,
           d4_modes, d4_compat, d4_broker, d4_tdsmds,
           d5_storage, d5_consistency, d5_stack, d5_reverse,
           d6_cycle, d6_deploy, d6_federated, d6_drift,
           d7_partitions, d7_late, d7_queuestream,
           d8_selection, d8_psi, d8_leak]:
    fn()

out = "// Generated by tools/gen_figures.py. Do not edit by hand; edit the generator and re-run it.\n"
out += "export const figures = " + json.dumps(FIGS, ensure_ascii=False, indent=0) + ";\n"
open("figures.js", "w").write(out)
print(len(FIGS), "figures written")
