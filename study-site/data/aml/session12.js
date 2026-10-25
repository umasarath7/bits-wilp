// AML — Contact Session 12: Artificial neural networks and an introduction to deep learning
// Source: CourseFiles/AML/ContactSession12-ANN.pptx (30 slides). Every lesson cites its slides.

export default {
  title: "Artificial Neural Networks & Intro to Deep Learning",
  source: "ContactSession12-ANN.pptx · 30 slides",
  quizMode: "step",
  overview:
    "A neural network is built from one simple part, the **perceptron**: weigh the inputs, add a bias, and threshold the result. One perceptron draws **one straight line**, so it can compute AND, OR and NOT but not XOR. We learn how to find its weights (the **perceptron training rule** and the gradient-based **delta rule**), then replace the hard threshold with smooth **activation functions** (sigmoid, tanh, ReLU, softplus) and stack neurons into **layers**. Hidden layers with non-linear activations let the network draw curved, complex boundaries. Training a layered network needs **backpropagation**: run the inputs forward, measure the output error, and pass the “blame” backwards through the weights. The session ends with what makes deep learning different and the hyperparameters you must tune.",

  summary: [
    {
      id: "perceptron",
      heading: "Lesson 1: Linear classification and the perceptron",
      slides: "2–6",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How a weighted sum plus a threshold becomes a classifier, and how to hand-design one for a truth table.",
        },
        {
          type: "callout",
          kind: "example",
          title: "A linearly separable dataset (slide 2)",
          text: "13 points (x₁, x₂) labelled Green or Red, e.g. (1, 9) Green, (4, 5) Red, (8, 5) Green, (7, 1) Red. Plotted, they look **linearly separable**. One possible boundary: **if 2x₁ + 3x₂ − 25 > 0 → Green, otherwise Red**. Check: (8, 5) → 16 + 15 − 25 = 6 > 0 Green ✓; (4, 5) → 8 + 15 − 25 = −2 Red ✓. *(Checked for all 13 points: no errors.)* Many other lines also work.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Perceptron (slide 3)",
          text: "Inputs $x_1, x_2$ (plus a constant input $x_0 = 1$), weights $w_0, w_1, w_2$, output $\\text{sign}(w_0 + w_1x_1 + w_2x_2) = \\text{sign}(w^Tx)$. For the boundary above, w = (−25, 2, 3). The perceptron is a picture of a **linear boundary**; the weights are its parameters. The real question is *how to find them from data*.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Logic gates with one perceptron (slide 5)",
          text: "Output σ(wᵀx) read as 0/1, with w₁ = w₂ = 20.\n| x₁ | x₂ | −30 + 20x₁ + 20x₂ | AND | −10 + 20x₁ + 20x₂ | OR |\n|---|---|---|---|---|---|\n| 0 | 0 | −30 | 0 | −10 | 0 |\n| 0 | 1 | −10 | 0 | 10 | 1 |\n| 1 | 0 | −10 | 0 | 10 | 1 |\n| 1 | 1 | 10 | **1** | 30 | 1 |\n**NOT:** w₀ = 10, w₁ = −20 (x = 0 → 10 → 1; x = 1 → −10 → 0). **XOR is not possible**: its 1s are on opposite corners, and no single line separates them.",
        },
        { type: "diagram", name: "a12-gates" },
        {
          type: "callout",
          kind: "example",
          title: "Design a perceptron for “x₁ AND NOT x₂” (slide 6)",
          text: "Truth table: (0,0) → 0, (0,1) → 0, (1,0) → 1, (1,1) → 0. Conditions (output 1 when ≥ 0):\n(1) w₀ < 0 → take **w₀ = −1**. (2) w₀ + w₂ < 0 → take **w₂ = −1**. (3) w₀ + w₁ ≥ 0 → take **w₁ = 1.5**. (4) w₀ + w₁ + w₂ = −0.5 < 0 ✓.\nSo **(w₀, w₁, w₂) = (−1, 1.5, −1)**. Other choices also work.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): slide 6's final line",
          text: "The slide's working gives w₀ = −1, w₂ = −1, w₁ = 1.5, but it writes the answer as (w₀, w₁, w₂) = (−1, **−1, 1.5**). That order computes “NOT x₁ AND x₂” ((0,1) → 1). The correct vector for this table is **(−1, 1.5, −1)**.",
        },
      ],
    },
    {
      id: "training",
      heading: "Lesson 2: Learning the weights: perceptron rule and delta rule",
      slides: "4, 7–8",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Perceptron training rule (slide 4)",
          text: "Begin with random weights; repeat over the examples: for each **misclassified** example,\n$$w_i \\leftarrow w_i + \\eta(t - o)x_i$$\n(t = target, o = perceptron output, η = learning rate) until all examples are correct.\n- Correct prediction → t − o = 0 → **no change**.\n- Output −1 but target +1 → weights **increase** (toward x).\n- Output +1 but target −1 → weights **decrease**.\nConvergence is guaranteed **only if the data is linearly separable** and η is small enough. Different runs may converge to different acceptable weights.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Train a perceptron for OR",
          text: "*Exercise solution prepared for the website.* Output 1 if wᵀx > 0, else 0; η = 0.5; start w = (w₀, w₁, w₂) = (0, 0, 0).\n- Epoch 1: (0,0) t0 o0 ✓ · (0,1) t1 **o0** → w = (0.5, 0, 0.5) · (1,0) o1 ✓ · (1,1) ✓.\n- Epoch 2: (0,0) **o1** (w₀ = 0.5 > 0) → w = (0, 0, 0.5) · (0,1) ✓ · (1,0) **o0** → w = (0.5, 0.5, 0.5) · (1,1) ✓.\n- Epoch 3: (0,0) **o1** → w = (0, 0.5, 0.5); the rest ✓.\n- Epoch 4: all four correct → stop with **w = (0, 0.5, 0.5)**: output 1 when 0.5x₁ + 0.5x₂ > 0.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Delta rule: gradient descent (slides 7–8)",
          text: "Use the **un-thresholded** output $o = w \\cdot x$ and the squared training error\n$$E(w) = \\frac{1}{2}\\sum_{d \\in D}(t_d - o_d)^2, \\quad \\frac{\\partial E}{\\partial w_i} = \\sum_{d}(t_d - o_d)(-x_{id})$$\n$$w_i \\leftarrow w_i - \\eta\\frac{\\partial E}{\\partial w_i} = w_i + \\eta\\sum_d(t_d - o_d)x_{id}$$\nBatch algorithm: set every Δwᵢ = 0; for each example add η(t − o)xᵢ; then wᵢ ← wᵢ + Δwᵢ; repeat. It converges toward the **minimum-error (best-fit) hypothesis** even when the data is **not** linearly separable.",
        },
        {
          type: "table",
          head: ["", "Perceptron rule", "Delta rule"],
          rows: [
            ["Output used", "Thresholded (±1 / 0–1)", "Un-thresholded wᵀx"],
            ["Updates on", "Misclassified examples only", "Every example (gradient of E)"],
            ["Converges", "Only if linearly separable", "Always, to the least-squared-error weights (small η)"],
          ],
        },
      ],
    },
    {
      id: "network",
      heading: "Lesson 3: Neurons, activation functions and networks",
      slides: "9–12, 30",
      blocks: [
        {
          type: "callout",
          kind: "formula",
          title: "Activation functions (slide 9)",
          text: "A **neuron** computes act(wᵀx), replacing the hard threshold with a smooth non-linear function:\n- **Sigmoid** $h(x) = \\frac{1}{1 + e^{-x}}$ (0 to 1)\n- **tanh** $h(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$ (−1 to 1)\n- **Softplus** $h(x) = \\log(1 + e^x)$ (smooth ReLU)\n- **ReLU (rectify)** $h(x) = \\max(0, x)$",
        },
        {
          type: "p",
          text: "**Neural network (slide 10):** neurons connected in layers: **input layer → hidden layer(s) → output layer**. The number of layers and nodes per layer can vary; use **one output neuron per class** for multi-class problems. A network **two levels deep can represent any Boolean function** (so XOR is possible with one hidden layer). **More hidden nodes → more complex boundaries (slide 11):** with 1 hidden node the boundary is nearly a line; with 3–5 it follows the moon-shaped classes; with very many it can start fitting noise.",
        },
        { type: "diagram", name: "s7-xor" },
        {
          type: "table",
          caption: "What determines the decision boundary (slide 30)",
          head: ["Network", "Boundary"],
          rows: [
            ["Single-layer perceptron", "Linear"],
            ["Multiple layers, **only linear** activations", "**Still linear** (a composition of linear maps is linear)"],
            ["Hidden layers with non-linear activations (sigmoid, tanh)", "Can be non-linear (curved)"],
            ["ReLU hidden layers", "Complex, **piecewise-linear** boundaries"],
            ["Deep network with non-linear activations", "Highly complex boundaries"],
          ],
        },
        {
          type: "p",
          text: "**When are neural networks appropriate? (slide 12)** Many attribute–value pairs (lots of data); output may be discrete, real or a vector; training data may contain errors; **long training times are acceptable**; **fast evaluation** is needed; and humans don't need to understand the learned function.",
        },
      ],
    },
    {
      id: "backprop",
      heading: "Lesson 4: Backpropagation",
      slides: "14–24",
      blocks: [
        {
          type: "callout",
          kind: "idea",
          title: "What am I learning?",
          text: "How to assign blame for the output error to hidden-layer weights whose “correct” values we never see.",
        },
        {
          type: "p",
          text: "As in the perceptron algorithm, cycle through the examples: if the output is correct, make no change; if not, adjust the weights to reduce the error (slide 16). The hard part is the **hidden** nodes: we don't know what their outputs should have been (slide 17). **The trick: assess the blame for the error and divide it among the contributing weights.** Each hidden node j is responsible for a fraction of the error δ in every output node it connects to, divided according to the **strength of the connection** (slide 18).",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Two phases per iteration (slides 17–23)",
          text: "**Forward phase:** using the current weights, compute every neuron's output layer by layer: $z^{(l)} = \\Theta^{(l-1)}a^{(l-1)}$, $a^{(l)} = \\text{act}(z^{(l)})$.\n**Backward phase:** compute the errors from the output back, updating layer k + 1's weights before layer k's.\n- $\\delta_j^{(l)}$ = the “error” of node j in layer l; formally $\\delta_j^{(l)} = \\frac{\\partial\\,\\text{cost}}{\\partial z_j^{(l)}}$.\n- **Output layer:** $\\delta^{(4)} = a^{(4)} - y$.\n- **Hidden layers:** each node collects the errors of the nodes it feeds, weighted by the connecting weights: $\\delta_2^{(3)} = \\Theta_{12}^{(3)}\\delta_1^{(4)}$, $\\delta_1^{(3)} = \\Theta_{11}^{(3)}\\delta_1^{(4)}$, $\\delta_2^{(2)} = \\Theta_{12}^{(2)}\\delta_1^{(3)} + \\Theta_{22}^{(2)}\\delta_2^{(3)}$ (times the activation's derivative $a(1 - a)$ for sigmoid units).\n- **Weight update:** $\\Theta_{ji} \\leftarrow \\Theta_{ji} - \\eta\\,\\delta_j\\,a_i$.",
        },
        {
          type: "callout",
          kind: "example",
          title: "One backprop step on a 2-2-1 sigmoid network",
          text: "*Exercise solution prepared for the website.* Input x = (1, 0), target y = 1, η = 0.5, cost ½(y − o)².\nHidden weights [bias, w₁, w₂]: h₁ (0.1, 0.2, −0.1), h₂ (0.0, −0.3, 0.4). Output weights [bias, from h₁, from h₂]: (0.2, 0.5, −0.4).\n**Forward:** z₁ = 0.1 + 0.2 = 0.3 → a₁ = σ(0.3) = 0.5744; z₂ = −0.3 → a₂ = 0.4256. z_o = 0.2 + 0.5(0.5744) − 0.4(0.4256) = 0.3170 → o = **0.5786**; error E = ½(1 − 0.5786)² = **0.0888**.\n**Backward:** δ_o = (o − y)·o(1 − o) = −0.4214 × 0.2438 = **−0.1027**.\nδ₁ = δ_o × 0.5 × a₁(1 − a₁) = −0.1027 × 0.5 × 0.2445 = **−0.0126**; δ₂ = δ_o × (−0.4) × 0.2445 = **+0.0100**.\n**Updates (Θ − η·δ·input):** output → (0.2514, 0.5295, −0.3781); h₁ → (0.1063, 0.2063, −0.1) (x₂ = 0, so its weight is unchanged); h₂ → (−0.0050, −0.3050, 0.4).\n**Check:** the new output is 0.5980, and the error falls to **0.0808**.",
        },
        {
          type: "table",
          caption: "Incremental (stochastic) vs batch gradient descent (slide 24)",
          head: ["Batch GD", "Stochastic GD"],
          rows: [
            ["Gradient from the **whole** training set per update", "Gradient from **one** sample per update"],
            ["Slow on very large datasets (full pass per update)", "Computationally faster; makes progress from the first sample"],
            ["Smooth path", "Noisy path"],
          ],
        },
      ],
    },
    {
      id: "deep",
      heading: "Lesson 5: Introduction to deep learning",
      slides: "25–30",
      blocks: [
        {
          type: "list",
          items: [
            "Hand-engineered features are **brittle and don't scale**; deep learning **learns the features/representations directly from data** (slide 27).",
            "**Why now?** Data (ImageNet…), compute power (GPUs) and software (TensorFlow).",
            "DL keeps getting better as the data grows and can solve very complex problems.",
            "Deep learning is **not just adding more layers**: it is building networks of parameterised functional modules and training them from examples with gradient-based optimisation (Yann LeCun).",
            "**Hierarchy of features (slide 28):** deeper layers represent increasingly abstract features (edges → shapes → object parts → objects).",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Hyperparameters (slide 29)",
          text: "How many layers? How many units per layer? What learning rate? Which activation function? These are hard to answer up front, so tuning is **iterative**: try, validate, adjust. Experiment at playground.tensorflow.org.",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "formula",
      title: "Formulas",
      text: "Perceptron $o = \\text{sign}(w^Tx)$ · rule $w_i \\leftarrow w_i + \\eta(t - o)x_i$ · delta rule $E = \\frac{1}{2}\\sum(t - o)^2$, $w_i \\leftarrow w_i + \\eta\\sum(t - o)x_i$ · sigmoid $\\frac{1}{1 + e^{-x}}$ · backprop $\\delta^{(L)} = a - y$, $\\delta^{(l)} = (\\Theta^T\\delta^{(l+1)}) \\odot a(1 - a)$, $\\Theta \\leftarrow \\Theta - \\eta\\,\\delta\\,a$",
    },
    { type: "diagram", name: "a12-gates" },
    {
      type: "table",
      head: ["Fact", "Remember"],
      rows: [
        ["AND / OR / NOT", "w = (−30, 20, 20) / (−10, 20, 20) / (10, −20)"],
        ["XOR", "not linearly separable → needs a hidden layer"],
        ["Linear activations only", "network stays linear"],
        ["Two-level network", "can represent any Boolean function"],
        ["Backprop", "forward pass → output error → propagate δ back → update"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Perceptron design: one inequality per truth-table row · training rule changes weights only on mistakes · backprop: forward values first, then δ from the output back, then updates.",
    },
  ],

  glossary: [
    ["Perceptron", "", "Weighted sum + threshold: a linear classifier"],
    ["Bias weight", "w₀", "Weight on the constant input x₀ = 1"],
    ["Linearly separable", "", "Classes can be split by a hyperplane"],
    ["Perceptron training rule", "", "wᵢ ← wᵢ + η(t − o)xᵢ on mistakes"],
    ["Delta rule", "LMS rule", "Gradient descent on squared error of the linear output"],
    ["Learning rate", "η", "Step size of the weight updates"],
    ["Activation function", "", "Non-linearity applied to a neuron's weighted input"],
    ["Sigmoid / tanh / ReLU / softplus", "", "1/(1+e⁻ˣ) · (eˣ−e⁻ˣ)/(eˣ+e⁻ˣ) · max(0, x) · log(1+eˣ)"],
    ["Hidden layer", "", "Layer between input and output"],
    ["Backpropagation", "", "Forward pass, then propagate errors backwards to compute gradients"],
    ["δ (delta)", "", "Error term of a node: ∂cost/∂z"],
    ["Deep learning", "", "Training multi-layer networks of parameterised modules by gradient descent"],
    ["Hyperparameters", "", "Layers, units, learning rate, activation…"],
  ],

  examTips: [
    "For a truth-table design, write one inequality per row, fix w₀ first, and check the last row.",
    "For a perceptron-training trace, tabulate epoch | x | t | o | new w, updating only on mistakes.",
    "State clearly: a single perceptron can't do XOR; one hidden layer with non-linear activation can.",
    "Backprop numericals: list z and a for every node, then δ_out, then δ_hidden, then each updated weight.",
  ],

  problems: [
    {
      title: "Check the linear boundary (slide 2)",
      level: "Easy",
      question: "Classify (10, 9), (7, 1), (2, 10) and (2, 5) with 2x₁ + 3x₂ − 25 > 0 → Green.",
      solution: "(10, 9): 20 + 27 − 25 = 22 → **Green** ✓ · (7, 1): 14 + 3 − 25 = −8 → **Red** ✓ · (2, 10): 4 + 30 − 25 = 9 → **Green** ✓ · (2, 5): 4 + 15 − 25 = −6 → **Red** ✓.",
    },
    {
      title: "Logic gates (slide 5)",
      level: "Easy",
      question: "Verify that w = (−30, 20, 20) computes AND and w = (−10, 20, 20) computes OR. Give weights for NOT.",
      solution: "AND: −30, −10, −10, 10 for (0,0), (0,1), (1,0), (1,1) → 0, 0, 0, 1 ✓. OR: −10, 10, 10, 30 → 0, 1, 1, 1 ✓. NOT: w₀ = 10, w₁ = −20 → x = 0 gives 10 → 1; x = 1 gives −10 → 0.",
    },
    {
      title: "Design a perceptron (slide 6)",
      level: "Medium",
      hint: "One inequality per row; fix w₀ from row (0,0).",
      question: "Find weights for (0,0) → 0, (0,1) → 0, (1,0) → 1, (1,1) → 0 (output 1 when w₀ + w₁x₁ + w₂x₂ ≥ 0).",
      solution: "w₀ < 0 → w₀ = −1. w₀ + w₂ < 0 → w₂ = −1. w₀ + w₁ ≥ 0 → w₁ = 1.5. Check w₀ + w₁ + w₂ = −0.5 < 0 ✓.\n**(w₀, w₁, w₂) = (−1, 1.5, −1)**. (The slide's written answer (−1, −1, 1.5) swaps w₁ and w₂.)",
    },
    {
      title: "Why not XOR?",
      level: "Medium",
      question: "Show that no single perceptron computes XOR, and describe a network that does.",
      solution: "*Exercise solution prepared for the website.*\nXOR needs w₀ < 0, w₀ + w₂ ≥ 0, w₀ + w₁ ≥ 0, w₀ + w₁ + w₂ < 0. Adding the middle two: 2w₀ + w₁ + w₂ ≥ 0, so w₀ + w₁ + w₂ ≥ −w₀ > 0, contradicting the last condition. So it is impossible.\nNetwork: hidden h₁ = OR (−10, 20, 20), h₂ = AND (−30, 20, 20); output = h₁ AND NOT h₂, e.g. (−10, 20, −20) → (0,0): h = (0,0) → 0; (0,1)/(1,0): h = (1,0) → 1; (1,1): h = (1,1) → 0 ✓.",
    },
    {
      title: "Perceptron training for OR",
      level: "Medium",
      hint: "Update only when o ≠ t.",
      question: "Train a perceptron (output 1 if wᵀx > 0, else 0) on OR with η = 0.5 from w = (0, 0, 0). Show each update.",
      solution: "*Exercise solution prepared for the website.*\nE1: (0,1) wrong → w = (0.5, 0, 0.5).\nE2: (0,0) wrong (o = 1) → (0, 0, 0.5); (1,0) wrong → (0.5, 0.5, 0.5).\nE3: (0,0) wrong → (0, 0.5, 0.5).\nE4: no mistakes → **w = (0, 0.5, 0.5)**.",
    },
    {
      title: "Delta-rule batch update",
      level: "Medium",
      question: "Linear unit o = w·x with x₀ = 1, w = (0, 0, 0), η = 0.1. Data (x₁, x₂, t): (0, 0, −1), (0, 1, −1), (1, 0, −1), (1, 1, +1). Compute one batch update.",
      solution: "*Exercise solution prepared for the website.*\nAll outputs are 0 → errors t − o = −1, −1, −1, +1.\nΔw₀ = 0.1(−1 − 1 − 1 + 1) = −0.2; Δw₁ = 0.1(0 + 0 − 1 + 1) = 0; Δw₂ = 0.1(0 − 1 + 0 + 1) = 0.\nNew w = **(−0.2, 0, 0)**.",
    },
    {
      title: "Backpropagation step (2-2-1 network)",
      level: "Hard",
      hint: "δ_out = (o − y)o(1 − o); δ_hidden = δ_out × w × a(1 − a).",
      question: "Sigmoid network, x = (1, 0), y = 1, η = 0.5. Hidden: h₁ (bias 0.1, 0.2, −0.1), h₂ (0, −0.3, 0.4). Output (bias 0.2, 0.5 from h₁, −0.4 from h₂). Do one forward and backward pass.",
      solution: "*Exercise solution prepared for the website.*\nForward: a₁ = σ(0.3) = 0.5744, a₂ = σ(−0.3) = 0.4256, z_o = 0.3170, o = 0.5786, E = 0.0888.\nδ_o = (0.5786 − 1)(0.5786)(0.4214) = −0.1027.\nδ₁ = −0.1027 × 0.5 × 0.2445 = −0.0126; δ₂ = −0.1027 × (−0.4) × 0.2445 = 0.0100.\nOutput weights: 0.2 + 0.0514 = **0.2514**, 0.5 + 0.0295 = **0.5295**, −0.4 + 0.0219 = **−0.3781**.\nh₁: (0.1063, 0.2063, −0.1); h₂: (−0.0050, −0.3050, 0.4).\nNew output 0.5980, error 0.0808 (decreased).",
    },
  ],

  theory: [
    {
      title: "Perceptron and its limitation",
      level: "Easy",
      question: "What is a perceptron? What can't it represent and why?",
      solution: "A perceptron computes sign(w₀ + Σwᵢxᵢ): a linear boundary. It can represent linearly separable functions such as AND, OR and NOT, but not XOR, whose positive examples lie on opposite corners: no line separates them (slides 3–5).",
    },
    {
      title: "Perceptron rule vs delta rule",
      level: "Medium",
      question: "Compare the perceptron training rule and the delta rule.",
      solution: "Perceptron rule: wᵢ ← wᵢ + η(t − o)xᵢ with thresholded o, applied to misclassified examples; converges only if the data is linearly separable and η is suitable. Delta rule: gradient descent on E = ½Σ(t − o)² with the un-thresholded o = w·x; wᵢ ← wᵢ + ηΣ(t − o)xᵢ; converges toward the least-squared-error weights even for non-separable data (slides 4, 7–8).",
    },
    {
      title: "Role of activation functions",
      level: "Medium",
      question: "Why do hidden layers need non-linear activation functions?",
      solution: "A composition of linear layers is itself linear, so a multi-layer network with only linear activations still draws a linear boundary. Non-linear activations (sigmoid, tanh, ReLU, softplus) let hidden layers form curved or piecewise-linear boundaries; deeper non-linear networks can model highly complex boundaries (slides 9, 30).",
    },
    {
      title: "Backpropagation",
      level: "Hard",
      question: "Explain the backpropagation algorithm.",
      solution: "Each iteration has a forward phase (compute every neuron's output layer by layer with the current weights) and a backward phase. The output error δ = a − y is computed first; each hidden node's error is the sum of the errors of the nodes it feeds, weighted by the connection weights (times the activation derivative). Weights are updated from the last layer backwards: Θ ← Θ − η·δ·(input activation). This assigns blame to hidden weights whose correct outputs are unknown (slides 16–23).",
    },
    {
      title: "What makes deep learning different?",
      level: "Easy",
      question: "Summarise the key points about deep learning from the session.",
      solution: "It learns features directly from data instead of hand engineering; it became practical thanks to large datasets, GPUs and software frameworks; performance improves with more data; deeper layers learn a hierarchy of increasingly abstract features; it's not just more layers but trainable parameterised modules optimised by gradients; hyperparameters (layers, units, learning rate, activation) are tuned iteratively (slides 27–29).",
    },
  ],

  quiz: [
    { topic: "Perceptron", type: "num", q: "Value of 2x₁ + 3x₂ − 25 at (8, 5)?", answer: 6, tol: 0, why: "16 + 15 − 25." },
    { topic: "Perceptron", q: "Which bias w₀ (with w₁ = w₂ = 20) makes the perceptron compute OR?", options: ["−30", "−10", "10", "30"], answer: 1, why: "Slide 5.", wrong: ["That's AND.", null, "(0,0) would output 1.", "All outputs 1."] },
    { topic: "Perceptron", q: "A single perceptron cannot compute…", options: ["AND", "OR", "NOT", "XOR"], answer: 3, why: "Not linearly separable.", wrong: ["It can.", "It can.", "It can.", null] },
    { topic: "Perceptron", q: "Correct weights (w₀, w₁, w₂) for output 1 only at (x₁, x₂) = (1, 0)?", options: ["(−1, −1, 1.5)", "(−1, 1.5, −1)", "(1, 1, 1)", "(−30, 20, 20)"], answer: 1, why: "The slide-6 answer swaps w₁ and w₂.", wrong: ["That fires at (0,1).", null, "Fires everywhere.", "That's AND."] },
    { topic: "Training", q: "The perceptron rule changes weights when…", options: ["Every example", "Only misclassified examples", "Only correctly classified examples", "Never"], answer: 1, why: "t − o = 0 when correct.", wrong: ["That's the delta rule.", null, "Opposite.", "No."] },
    { topic: "Training", q: "Convergence of the perceptron rule requires…", options: ["Non-linear data", "Linearly separable data and a suitable η", "A sigmoid output", "Batch updates"], answer: 1, why: "Slide 4.", wrong: ["Opposite.", null, "Not needed.", "Not needed."] },
    { topic: "Training", q: "The delta rule minimises…", options: ["Number of misclassifications", "½Σ(t − o)² with un-thresholded o", "Cross-entropy", "The margin"], answer: 1, why: "Slide 7.", wrong: ["That's the perceptron's goal.", null, "Not here.", "SVM."] },
    { topic: "Activations", type: "num", q: "ReLU(−2.5) = ?", answer: 0, tol: 0, why: "max(0, x)." },
    { topic: "Activations", type: "num", q: "Sigmoid(0) = ?", answer: 0.5, tol: 0.001, why: "1/(1 + 1)." },
    { topic: "Networks", q: "A multi-layer network with only linear activations produces…", options: ["Curved boundaries", "A linear boundary", "Piecewise boundaries", "Random boundaries"], answer: 1, why: "Slide 30.", wrong: ["Needs non-linearity.", null, "That's ReLU.", "No."] },
    { topic: "Networks", q: "A network two levels deep can represent…", options: ["Only linear functions", "Any Boolean function", "Only AND/OR", "Nothing useful"], answer: 1, why: "Slide 10.", wrong: ["No.", null, "More.", "No."] },
    { topic: "Backprop", q: "In backpropagation, weights at layer k + 1 are updated…", options: ["After layer k", "Before layer k", "Randomly", "Only in the forward phase"], answer: 1, why: "Backward phase (slide 17).", wrong: ["Reverse order.", null, "No.", "Backward phase."] },
    { topic: "Backprop", q: "The output-layer error term on slide 20 is…", options: ["δ = y", "δ = a − y", "δ = Θa", "δ = 0"], answer: 1, why: "δ⁽⁴⁾ = a⁽⁴⁾ − y.", wrong: ["No.", null, "That's z.", "No."] },
    { topic: "Backprop", q: "A hidden node's error is…", options: ["Equal to the output error", "The sum of downstream errors weighted by connection weights", "Always zero", "The input value"], answer: 1, why: "Slides 18, 23.", wrong: ["It's apportioned by weights.", null, "No.", "No."] },
    { topic: "GD", q: "Stochastic gradient descent computes the gradient from…", options: ["The whole dataset", "A single sample", "Half the data", "The test set"], answer: 1, why: "Slide 24.", wrong: ["Batch.", null, "That's a mini-batch-ish idea, not SGD.", "Never."] },
  ],
};
