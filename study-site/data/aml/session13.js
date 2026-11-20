// AML — Deep Learning II: convolutional neural networks (convolution, edge detectors, padding, stride, parameters,
// pooling, LeNet/AlexNet/VGG) and recurrent neural networks (unfolding, sequence-modelling types, character RNN).
// Source: CourseFiles/AML/Watermark_BITS_WILP_AML.pdf (consolidated open-book PDF), pages 526–595.
// "page N" = page of that PDF. Every number was recomputed with numpy; PDF slips are flagged on the page.

export default {
  title: "Deep Learning II: CNNs & RNNs",
  source: "Consolidated PDF (Watermark_BITS_WILP_AML.pdf) · pages 526–595",
  quizMode: "step",
  overview:
    "Session 12 built ordinary (fully connected) neural networks. This part asks: **what goes wrong when the input is an image or a sentence?** For images, a plain network needs millions of weights and ignores which pixels are neighbours (pages 527–533). A **convolutional neural network (CNN)** fixes this by sliding one small **filter** across the image, so the same few weights are reused everywhere (pages 534–555). You will compute convolutions by hand, use **padding** and **stride**, count **parameters**, and apply **max/average pooling** (pages 556–572), then meet three famous CNNs (pages 573–577). For sequences, a **recurrent neural network (RNN)** carries a memory from one time step to the next (pages 578–595). **This whole topic is AML-only; it is not in the ML course.** Page numbers refer to your consolidated exam PDF.",

  summary: [
    {
      id: "why",
      heading: "Lesson 1: Why not use a plain neural network for images?",
      slides: "527–533",
      blocks: [
        { type: "callout", kind: "tip", title: "🔗 ML overlap: none (AML only)", text: "CNNs and RNNs are taught only in AML. Spend full study time here; the ML course has nothing to reuse." },
        { type: "callout", kind: "idea", title: "In plain words", text: "A plain network looks at an image as one long list of numbers and gives **every pixel its own weight to every neuron**. That is like hiring a separate guard for every square centimetre of a museum. A CNN instead uses **one small detector** (say, an “edge finder”) and **walks it across the whole image**, so the same guard checks every room." },
        {
          type: "p",
          text: "**Training is the same as before (page 527):** forward pass → loss → backpropagation → update $W_{new} = W_{old} - \\eta\\,\\partial L/\\partial W$. The problem is the **size and shape** of the input.",
        },
        {
          type: "table",
          caption: "Three problems with a fully connected network on images (pages 528–532)",
          head: ["Problem", "Numbers from the PDF", "What a CNN does instead"],
          rows: [
            ["**Too many weights**", "28×28 image → 784 inputs; 1,000 hidden neurons → **784 × 1,000 = 784,000** weights. A 224×224 colour image → 224×224×3 = **150,528** inputs → **150,528,000** weights in the first layer alone", "A 3×3 filter has only **9** weights, reused everywhere"],
            ["**Ignores neighbours**", "Flattening keeps the pixel values but removes their 2-D arrangement; an eye is a pattern of **nearby** pixels", "Each filter looks at a small **local** patch"],
            ["**Same feature, different place**", "A cat's ear in the top-left vs top-right needs separate weights", "**Weight sharing**: the same filter slides over every position"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Remember it",
          text: "**CNN = local connections + shared filters.** Plain network on a 224×224×3 image with 1,000 neurons: **150.5 million** weights in layer 1.",
        },
      ],
    },
    {
      id: "layers",
      heading: "Lesson 2: What a CNN is made of",
      slides: "534–544, 553–555",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "A CNN is an assembly line. **Convolution layers** find small patterns (edges, corners). **Pooling layers** shrink the picture while keeping the strongest signals. Deeper layers combine small patterns into bigger ones (edges → eyes → faces). At the end, **fully connected layers** make the final decision, e.g. “this is a 7”." },
        {
          type: "p",
          text: "**Definition (page 536).** A CNN is a neural network for data with a **grid-like topology**: a time series is a 1-D grid, an image a 2-D grid of pixels. It uses **convolution in place of general matrix multiplication** in some layers. Pages 538–542 show a network recognising the digit **7**: early filters respond to simple strokes, and deeper layers respond to more complex combinations.",
        },
        {
          type: "table",
          caption: "Types of layers (pages 543, 553)",
          head: ["Layer", "Job", "Learnable weights?"],
          rows: [
            ["**Convolution (Conv)**", "Slide filters over the input to detect local patterns", "Yes: the filter values (+ one bias per filter)"],
            ["**Pooling (Pool)**", "Shrink each feature map (max or average of small windows)", "**No**: fixed computation"],
            ["**Fully connected (FC)**", "Every neuron connects to every neuron of the next layer; makes the final prediction", "Yes"],
          ],
        },
        {
          type: "p",
          text: "**How a CNN learns (pages 554–555).** Exactly like an ANN: forward pass → loss → backpropagation → gradient update $W_{new} = W_{old} - \\eta\\,\\partial L/\\partial W$. The only difference is **what W is**: in a dense layer, W holds one weight per connection; in a convolution layer, W holds the **shared filter weights**. So the network **learns its own filters** (page 552: “the NN will learn the 9 weights in the filter”).",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Conv → Pool → … → FC.** Conv learns filters; Pool has nothing to learn; FC decides." },
      ],
    },
    {
      id: "conv",
      heading: "Lesson 3: The convolution operation, by hand",
      slides: "545–549",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "Lay the 3×3 filter on the top-left corner of the image. **Multiply each pair of overlapping numbers and add the nine products**: that's one output number. Slide one step right and repeat. When you reach the edge, go down one row and start again." },
        {
          type: "callout",
          kind: "formula",
          title: "Output size (page 545)",
          text: "Input $n \\times n$, filter $f \\times f$ (no padding, stride 1):\n$$\\text{output} = (n - f + 1) \\times (n - f + 1)$$ 6×6 image, 3×3 filter → **4×4** output.",
        },
        { type: "diagram", name: "a13-conv" },
        {
          type: "callout",
          kind: "example",
          title: "PDF example (pages 546–549): vertical-edge filter on a 6×6 image",
          text: "Image rows: (3 0 1 2 7 4), (1 5 8 9 3 1), (2 7 2 5 1 3), (0 1 3 1 7 8), (4 2 1 6 2 8), (2 4 5 2 3 9). Filter rows: (1 0 −1), (1 0 −1), (1 0 −1).\n**Top-left cell:** window (3 0 1 / 1 5 8 / 2 7 2) → $3(1) + 1(1) + 2(1) + 0 + 0 + 0 + 1(-1) + 8(-1) + 2(-1) = 6 - 11 = $ **−5**.\n**Shortcut for this filter:** (sum of the window's left column) − (sum of its right column). Next cell: $(0 + 5 + 7) - (2 + 9 + 5) = 12 - 16 = $ **−4**.\n**Bottom-right:** window (1 7 8 / 6 2 8 / 2 3 9) → $(1 + 6 + 2) - (8 + 8 + 9) = 9 - 25 = $ **−16**.\n\n| | | | |\n|---|---|---|---|\n| −5 | −4 | 0 | 8 |\n| −10 | −2 | **2** | 3 |\n| 0 | −2 | −4 | −7 |\n| −3 | −2 | −3 | −16 |",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 549",
          text: "The PDF's output shows **−2** in row 2, column 3. The window there is (8 9 3 / 2 5 1 / 3 1 7): $(8 + 2 + 3) - (3 + 1 + 7) = 13 - 11 = $ **+2**. All other 15 values match.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Overlay, multiply, add, slide.** Output side = n − f + 1." },
      ],
    },
    {
      id: "edges",
      heading: "Lesson 4: Edge detectors: what a filter “sees”",
      slides: "550–552",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "The filter (1 0 −1) compares **left vs right**. On a flat region left and right are equal, so the answer is 0. Where bright meets dark, left − right is large, so the output lights up exactly at the **edge**. Turn the filter on its side, (1 1 1 / 0 0 0 / −1 −1 −1), and it finds **horizontal** edges instead." },
        {
          type: "callout",
          kind: "example",
          title: "Vertical edge (page 550)",
          text: "Every row of the image is (10 10 10 0 0 0): bright left half, dark right half. With the vertical filter each output row is **(0 30 30 0)**: zero over the flat parts, **30** where the window straddles the edge ($10 + 10 + 10 - 0 = 30$).",
        },
        {
          type: "callout",
          kind: "example",
          title: "Horizontal edge (page 551)",
          text: "Top three rows all 10s, bottom three all 0s. With the horizontal filter (1 1 1 / 0 0 0 / −1 −1 −1) the output rows are **(0 0 0 0), (30 30 30 30), (30 30 30 30), (0 0 0 0)**: the edge shows up in the middle rows.",
        },
        {
          type: "p",
          text: "**Other angles (page 552).** Edges at 45°, 60° and so on need other filters; a CNN **stacks many filters** and **learns their nine weights** $w_1 \\dots w_9$ during training instead of us designing them.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Big output = the pattern the filter is looking for is there.** (1 0 −1) → vertical edges; its transpose → horizontal edges." },
      ],
    },
    {
      id: "pad-stride",
      heading: "Lesson 5: Padding and stride",
      slides: "556–566",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "**Padding** = put a frame of zeros around the picture so it doesn't shrink and the corner pixels get used as often as the middle ones. **Stride** = how many squares the filter jumps each time; a stride of 2 skips every other position and roughly halves the output size." },
        {
          type: "table",
          caption: "Two problems without padding (page 559) and the two padding types (page 561)",
          head: ["", "Valid padding", "Same padding"],
          rows: [
            ["Padding p", "0 (none)", "enough zeros to keep the size"],
            ["Output vs input", "Output **shrinks** (6×6 → 4×4)", "Output **= input** size"],
            ["Corner pixels", "Used only once (information lost)", "Used more often"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "General output size (pages 562–563)",
          text: "Input $n \\times n$, filter $f \\times f$, padding p, stride s:\n$$\\text{output} = \\left\\lfloor \\frac{n + 2p - f}{s} \\right\\rfloor + 1$$ (⌊ ⌋ = round down; the filter must lie completely inside the padded input.) With s = 1 this is $n + 2p - f + 1$. **Same padding** needs $p = \\dfrac{f - 1}{2}$: 3×3 → p = 1, 5×5 → p = 2, 7×7 → p = 3.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): pages 561–562",
          text: "The PDF writes “same padding: p = f − 1”, but its own examples (3×3 → 1, 5×5 → 2, 7×7 → 3) follow **p = (f − 1)/2**. Check: n = 6, f = 3, p = 1 → 6 + 2 − 3 + 1 = 6 ✓; with p = f − 1 = 2 you'd get 8, which is not “same”.",
        },
        {
          type: "callout",
          kind: "example",
          title: "Padding in action (page 560)",
          text: "Pad the 6×6 image with zeros to 8×8, then apply the 3×3 vertical filter → a **6×6** output (same size). Top-left cell: window (0 0 0 / 0 3 0 / 0 1 5) → left column 0, right column $0 + 0 + 5$ → $0 - 5 = $ **−5**. (Exercise solution prepared for the website; full output computed in Python.)",
        },
        {
          type: "callout",
          kind: "example",
          title: "Stride 2 (pages 564–566)",
          text: "7×7 image, 3×3 filter (3 4 4 / 1 0 2 / −1 0 3), stride 2 → $\\lfloor (7 - 3)/2 \\rfloor + 1 = 3$ → **3×3** output. Windows start at columns/rows 1, 3, 5.\nFirst window (2 4 7 / 6 6 9 / 3 4 8): $2(3) + 4(4) + 7(4) + 6(1) + 6(0) + 9(2) + 3(-1) + 4(0) + 8(3) = 6 + 16 + 28 + 6 + 0 + 18 - 3 + 0 + 24 = $ **95**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): pages 564–566",
          text: "The PDF's output (91, 100, 83 / 69, 91, 127 / 44, 72, 74) does **not** match its printed 7×7 grid. No single filter gives those nine numbers from that grid; they come from a version of this textbook example with different input values. With the grid exactly as printed, the correct output is **95, 100, 88 / 69, 88, 118 / 44, 68, 71** (computed with numpy). In the exam, show your window-by-window working.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Output = ⌊(n + 2p − f)/s⌋ + 1. Same padding: p = (f − 1)/2.**" },
      ],
    },
    {
      id: "params-pool",
      heading: "Lesson 6: Counting parameters, and pooling",
      slides: "567–572",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "A filter's weights are what the network learns. A 3×3 filter on a colour image is really a **3×3×3 cube** (one 3×3 slice per colour channel): 27 weights plus 1 bias. **Pooling** is a summary step: in each 2×2 block keep the **biggest** number (max) or the **average**. It has nothing to learn." },
        {
          type: "callout",
          kind: "formula",
          title: "Parameters per conv layer (page 567)",
          text: "$$\\text{params} = (f \\times f \\times n_C + 1) \\times \\text{(number of filters)}$$ $n_C$ = number of input channels (3 for RGB); +1 is the bias of each filter.\n3×3 filter on RGB: $3 \\times 3 \\times 3 + 1 = $ **28**; two filters: $28 \\times 2 = $ **56**. Unlike a dense layer, this **does not depend on the image size**.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Slide check (flagged): page 567",
          text: "The general line reads “# Parameters: f × f × nC” without the +1, but the worked answer (28) includes the bias. Use $f \\times f \\times n_C + 1$ per filter.",
        },
        {
          type: "callout",
          kind: "formula",
          title: "Pooling (pages 568–570)",
          text: "Filter f, stride s, **no padding**: output $\\left\\lfloor\\frac{n - f}{s}\\right\\rfloor + 1$ per side. Used for subsampling: smaller representation, faster computation. **No learnable parameters** (gradient descent is not applied), and it works on **each channel separately**.",
        },
        { type: "diagram", name: "a13-pool" },
        {
          type: "callout",
          kind: "example",
          title: "PDF example (pages 571–572): 4×4 → 2×2 with f = 2, s = 2",
          text: "Input rows (2 4 7 4), (6 6 9 8), (3 4 8 3), (7 5 3 6).\nBlocks: top-left {2, 4, 6, 6}, top-right {7, 4, 9, 8}, bottom-left {3, 4, 7, 5}, bottom-right {8, 3, 3, 6}.\n**Max pooling:** (6 9 / 7 8). **Average pooling:** (18/4 = 4.5, 28/4 = 7 / 19/4 = 4.75, 20/4 = 5).",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Each filter: f·f·channels + 1.** Pooling: max or mean of each block, zero parameters." },
      ],
    },
    {
      id: "arch",
      heading: "Lesson 7: Three famous CNN architectures",
      slides: "573–577",
      blocks: [
        {
          type: "table",
          caption: "Architectures for classification (pages 575–577)",
          head: ["Network", "Task", "Parameters learned", "Memory hook"],
          rows: [
            ["**LeNet-5**", "Handwritten characters, 10 classes", "≈ **60 thousand**", "The small pioneer"],
            ["**AlexNet**", "ImageNet, 1000 classes", "≈ **60 million**", "1000× bigger than LeNet"],
            ["**VGG-16**", "ImageNet; **16 layers**", "≈ **138 million**", "Deep and uniform (all 3×3 filters)"],
          ],
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**60 K → 60 M → 138 M**: LeNet → AlexNet → VGG-16." },
      ],
    },
    {
      id: "rnn",
      heading: "Lesson 8: Recurrent neural networks",
      slides: "578–592",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "To understand a sentence you remember the words you've already read. An **RNN** does the same: at every time step it takes the new input **and its own memory from the previous step** (the hidden state $h^{\\langle t-1 \\rangle}$), and passes an updated memory forward. The loop that feeds memory back is the **recurrent edge**." },
        {
          type: "p",
          text: "**Feedforward vs recurrent (pages 579–580).** Networks so far are **feedforward**: input → output, no memory. An RNN at time step t takes $x^{\\langle t \\rangle}$ and $h^{\\langle t-1 \\rangle}$, produces $h^{\\langle t \\rangle}$ and an output $y^{\\langle t \\rangle}$. **Unfolding** draws the loop as a chain of copies, one per time step, sharing the same weights. RNNs can be single-layer or **multilayer** (stacked hidden states).",
        },
        {
          type: "table",
          caption: "Types of sequence modelling (pages 584–587)",
          head: ["Type", "Input → output", "Example from the PDF"],
          rows: [
            ["**Many-to-one**", "sequence → one fixed-size output", "**Sentiment analysis**: text → class label"],
            ["**One-to-many**", "one input → sequence", "**Image captioning**: image → sentence"],
            ["**Many-to-many (direct)**", "sequence → sequence, step by step", "**Video captioning**: each frame described"],
            ["**Many-to-many (delayed)**", "read the whole input, then output", "**Language translation** (English → French, page 592)"],
          ],
        },
        {
          type: "p",
          text: "**Applications (page 581):** stock-market prediction, DNA / protein sequence modelling, text classification, speech recognition, language translation.",
        },
        {
          type: "p",
          text: "**Generating names with a character RNN (pages 589–591).** *Training:* at each step the network outputs a **softmax** probability for every possible next letter; for the next input we ignore the prediction and feed the **correct** next letter from the data. *Generating:* **sample** a letter from the softmax and feed it as the next input. Works for word-level and character-level RNNs.",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**RNN = network with memory** ($h^{\\langle t-1 \\rangle} \\to h^{\\langle t \\rangle}$). Sentiment = many-to-one, captioning = one-to-many, translation = many-to-many (delayed)." },
      ],
    },
    {
      id: "charrnn",
      heading: "Lesson 9: Preparing data for a character RNN",
      slides: "593–595",
      blocks: [
        { type: "callout", kind: "idea", title: "In plain words", text: "The RNN's job is to **guess the next character**. So the training input is the text, and the target is the **same text shifted one place to the left**." },
        {
          type: "list",
          ordered: true,
          items: [
            "**Break the text into characters (page 593):** “Hello world!” → H, e, l, l, o, ␣, w, o, r, l, d, !",
            "**Map characters to integers and back (page 594):** dictionaries `char2int` and `int2char`. The whole corpus becomes a long list of integers (page 595).",
            "**Make x and y (page 595):** x = H e l l o ␣ w o r l d ! ; y = e l l o ␣ w o r l d ! EOS: the target is **shifted by one** (EOS = end-of-sequence marker).",
            "**Represent each symbol:** a **one-hot** vector (length = number of distinct characters), or for words, a semantic embedding such as **word2vec** or **GloVe**.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          title: "Counting for “Hello world!” (exercise solution prepared for the website)",
          text: "12 characters. Distinct ones: H, e, l, o, space, w, r, d, ! → **9**, so each one-hot vector has length 9 (10 if EOS gets its own symbol). The first training pair is (x = ‘H’, y = ‘e’); the last is (x = ‘!’, y = EOS).",
        },
        { type: "callout", kind: "remember", title: "Remember it", text: "**Target = input shifted by one.** Characters → integers → one-hot." },
      ],
    },
  ],

  recap: [
    {
      type: "table",
      caption: "CNNs & RNNs on one screen (consolidated PDF pages)",
      head: ["Idea", "Formula / fact", "Pages"],
      rows: [
        ["Why CNN", "Dense layer on 224×224×3 with 1,000 neurons = 150,528,000 weights; CNN uses local, shared filters", "528–533"],
        ["Layers", "Conv (learns filters) → Pool (no params) → FC (decides)", "543, 553"],
        ["Convolution", "Multiply overlapping cells, add, slide; output n − f + 1", "545–549"],
        ["Edge filters", "(1 0 −1) rows → vertical edges; transpose → horizontal; edge response 30 in the PDF example", "550–552"],
        ["Padding / stride", "Output ⌊(n + 2p − f)/s⌋ + 1; same padding p = (f − 1)/2", "559–566"],
        ["Parameters", "(f·f·n_C + 1) per filter; 3×3 on RGB = 28", "567"],
        ["Pooling", "Max or average of each f×f block; output ⌊(n − f)/s⌋ + 1; no parameters", "568–572"],
        ["Architectures", "LeNet-5 ≈ 60 K, AlexNet ≈ 60 M, VGG-16 ≈ 138 M parameters", "575–577"],
        ["RNN", "Hidden state carries memory $h^{\\langle t-1 \\rangle} \\to h^{\\langle t \\rangle}$; unfold over time", "579–581"],
        ["Sequence types", "many-to-one (sentiment), one-to-many (captioning), many-to-many (translation)", "584–592"],
        ["Char RNN", "chars → ints → one-hot; y = x shifted by one", "593–595"],
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Don't lose marks",
      text: "Draw the 3×3 window you're using and write all nine products · state the output-size formula before using it · in parameter counts include the **bias** and the **channels** · say clearly that pooling has **no** learnable parameters · name the sequence type and give an example.",
    },
  ],

  glossary: [
    ["CNN", "Convolutional neural network", "A network that uses convolution (sliding filters) in some layers; for grid data like images"],
    ["Filter / kernel", "", "Small weight matrix (e.g. 3×3) slid over the input"],
    ["Feature map", "", "The output of one filter over the whole input"],
    ["Weight sharing", "", "The same filter weights are used at every position"],
    ["Padding", "Valid / same", "Zeros added around the input; valid = none, same = keeps size, p = (f − 1)/2"],
    ["Stride", "s", "How many pixels the filter jumps each step"],
    ["Pooling", "Max / average", "Replace each f×f block with its max or mean; no parameters"],
    ["Fully connected layer", "FC, dense", "Every neuron connected to every neuron of the next layer"],
    ["Channels", "$n_C$", "Depth of the input, e.g. 3 for RGB"],
    ["LeNet-5 / AlexNet / VGG-16", "", "Classic CNNs with ≈ 60 K / 60 M / 138 M parameters"],
    ["RNN", "Recurrent neural network", "A network whose hidden state is fed back at the next time step"],
    ["Hidden state", "$h^{\\langle t \\rangle}$", "The RNN's memory at time t"],
    ["Unfolding", "", "Drawing an RNN as a chain of copies, one per time step"],
    ["Many-to-one / one-to-many / many-to-many", "", "Sequence-modelling types by input and output shape"],
    ["Softmax", "", "Turns scores into probabilities over all possible next characters"],
    ["One-hot encoding", "", "A vector of zeros with a single 1 marking the symbol"],
    ["word2vec / GloVe", "Word embeddings", "Dense vectors that capture word meaning"],
  ],

  examTips: [
    "For any convolution question, write the output-size formula first, then show at least one window's nine products in full.",
    "For the filter (1 0 −1) on each row, use the shortcut: left-column sum − right-column sum.",
    "Parameter counts: (f × f × channels + 1) × filters. Compare with a dense layer to show why CNNs are efficient.",
    "Pooling: show the four blocks, then their max (or mean). Pooling has 0 learnable parameters.",
    "For RNN theory questions, draw the unfolded chain and label $x^{\\langle t \\rangle}$, $h^{\\langle t \\rangle}$, $y^{\\langle t \\rangle}$.",
  ],

  problems: [
    {
      title: "Weights in a dense first layer (pages 528, 530)",
      level: "Easy",
      question: "How many weights (no biases) connect (a) a 28×28 grayscale image and (b) a 224×224 RGB image to a hidden layer of 1,000 neurons? Including biases, how many parameters in (a)?",
      solution: "### Formula\nweights = (number of inputs) × (number of neurons).\n### (a)\n$28 \\times 28 = 784$ inputs → $784 \\times 1000 = $ **784,000**; with 1,000 biases → **785,000** parameters.\n### (b)\n$224 \\times 224 \\times 3 = 150{,}528$ inputs → $150{,}528 \\times 1000 = $ **150,528,000** weights (over 150 million in one layer).",
    },
    {
      title: "Convolution by hand (pages 546–549)",
      level: "Medium",
      hint: "For this filter, output = left-column sum − right-column sum of the window.",
      question: "Image rows (3 0 1 2 7 4), (1 5 8 9 3 1), (2 7 2 5 1 3), (0 1 3 1 7 8), (4 2 1 6 2 8), (2 4 5 2 3 9); filter rows (1 0 −1) ×3. Find the output size and the cells (1,1), (1,2), (2,3) and (4,4).",
      solution: "### Size\n$6 - 3 + 1 = 4$ → **4×4**.\n### Cells\n(1,1): window rows (3 0 1 / 1 5 8 / 2 7 2) → $(3 + 1 + 2) - (1 + 8 + 2) = 6 - 11 = $ **−5**.\n(1,2): (0 1 2 / 5 8 9 / 7 2 5) → $(0 + 5 + 7) - (2 + 9 + 5) = $ **−4**.\n(2,3): (8 9 3 / 2 5 1 / 3 1 7) → $(8 + 2 + 3) - (3 + 1 + 7) = $ **2** (the PDF prints −2).\n(4,4): (1 7 8 / 6 2 8 / 2 3 9) → $(1 + 6 + 2) - (8 + 8 + 9) = $ **−16**.",
    },
    {
      title: "Output sizes",
      level: "Easy",
      question: "Find the output size for: (a) n = 6, f = 3, p = 0, s = 1; (b) n = 6, f = 3, p = 1, s = 1; (c) n = 7, f = 3, p = 0, s = 2; (d) n = 32, f = 5, p = 0, s = 1; (e) n = 28, f = 5, same padding; (f) AlexNet's first layer: n = 227, f = 11, p = 0, s = 4.",
      solution: "### Formula\n$\\lfloor (n + 2p - f)/s \\rfloor + 1$.\n(a) $(6 - 3)/1 + 1 = $ **4**. (b) $(6 + 2 - 3) + 1 = $ **6** (same). (c) $\\lfloor 4/2 \\rfloor + 1 = $ **3**. (d) $27 + 1 = $ **28**. (e) same padding $p = (5 - 1)/2 = 2$ → $(28 + 4 - 5) + 1 = $ **28**. (f) $\\lfloor 216/4 \\rfloor + 1 = $ **55**. (Parts d–f: exercise solution prepared for the website.)",
    },
    {
      title: "Stride-2 convolution (pages 564–566)",
      level: "Hard",
      question: "7×7 image rows (2 4 7 4 6 2 9), (6 6 9 8 7 4 3), (3 4 8 3 8 9 7), (7 8 3 6 6 3 4), (4 2 1 8 2 4 6), (3 2 4 1 9 8 3), (0 1 3 9 2 1 4); filter (3 4 4 / 1 0 2 / −1 0 3); stride 2. Compute the full output.",
      solution: "### Size\n$\\lfloor (7 - 3)/2 \\rfloor + 1 = 3$ → 3×3; windows start at rows/columns 1, 3, 5.\n### First window (rows 1–3, columns 1–3)\n$2(3) + 4(4) + 7(4) + 6(1) + 6(0) + 9(2) + 3(-1) + 4(0) + 8(3) = $ **95**.\n### Second window (rows 1–3, columns 3–5): (7 4 6 / 9 8 7 / 8 3 8)\n$21 + 16 + 24 + 9 + 0 + 14 - 8 + 0 + 24 = $ **100**.\n### All nine\n**95, 100, 88 / 69, 88, 118 / 44, 68, 71**.\n⚠️ The PDF shows 91, 100, 83 / 69, 91, 127 / 44, 72, 74, which cannot come from the grid as printed. (Values computed with numpy.)",
    },
    {
      title: "Vertical edge detector (page 550)",
      level: "Easy",
      question: "Every row of a 6×6 image is (10 10 10 0 0 0). Apply the filter (1 0 −1) ×3 and interpret the output.",
      solution: "Window over columns 1–3: $30 - 30 = 0$; columns 2–4: $30 - 0 = 30$; columns 3–5: $30 - 0 = 30$; columns 4–6: $0 - 0 = 0$. Every output row is **(0 30 30 0)**. The bright band of 30s marks the **vertical edge** between the bright left half and the dark right half.",
    },
    {
      title: "Parameters in conv layers (page 567)",
      level: "Medium",
      question: "(a) How many parameters do two 3×3 filters on an RGB image have? (b) Ten 5×5 filters on an RGB image? (c) Compare (b) with a dense layer of 10 neurons on a 32×32×3 image.",
      solution: "### Formula\n$(f \\cdot f \\cdot n_C + 1) \\times$ filters.\n(a) $(3 \\cdot 3 \\cdot 3 + 1) \\times 2 = 28 \\times 2 = $ **56**.\n(b) $(5 \\cdot 5 \\cdot 3 + 1) \\times 10 = 76 \\times 10 = $ **760**.\n(c) Dense: $32 \\cdot 32 \\cdot 3 = 3072$ inputs → $(3072 + 1) \\times 10 = $ **30,730**, about 40 times more, and it grows with image size while the conv layer doesn't. (b, c: exercise solution prepared for the website.)",
    },
    {
      title: "Max and average pooling (pages 571–572)",
      level: "Easy",
      question: "Apply 2×2 max pooling and 2×2 average pooling (stride 2) to the 4×4 input (2 4 7 4), (6 6 9 8), (3 4 8 3), (7 5 3 6).",
      solution: "### Blocks\nTL {2, 4, 6, 6}; TR {7, 4, 9, 8}; BL {3, 4, 7, 5}; BR {8, 3, 3, 6}.\n### Max\n**(6 9 / 7 8)**.\n### Average\n18/4 = **4.5**, 28/4 = **7**, 19/4 = **4.75**, 20/4 = **5**.\n### Size\n$\\lfloor (4 - 2)/2 \\rfloor + 1 = 2$ → 2×2. No parameters are learned.",
    },
    {
      title: "Pooling practice",
      level: "Medium",
      question: "Apply 2×2 max pooling with stride 2 to rows (1 3 2 1), (4 6 5 0), (7 2 9 8), (1 0 3 4). Then give the average pooling result.",
      solution: "Blocks: {1, 3, 4, 6}, {2, 1, 5, 0}, {7, 2, 1, 0}, {9, 8, 3, 4}.\n**Max:** (6 5 / 7 9). **Average:** (14/4 = 3.5, 8/4 = 2 / 10/4 = 2.5, 24/4 = 6). (Exercise solution prepared for the website.)",
    },
    {
      title: "Sequence-modelling type",
      level: "Easy",
      question: "Classify each task: (a) movie review → positive/negative; (b) photo → caption; (c) English sentence → French sentence; (d) label every frame of a video; (e) predict tomorrow's stock price from the last 30 days.",
      solution: "(a) **many-to-one**. (b) **one-to-many**. (c) **many-to-many, delayed** (read the whole sentence first). (d) **many-to-many, direct**. (e) **many-to-one** (a sequence of 30 values → one number).",
    },
    {
      title: "Character-RNN training pairs (pages 593–595)",
      level: "Medium",
      question: "For the text “Hello world!”, write x and y, the number of distinct characters, and the one-hot vector length.",
      solution: "x = H e l l o ␣ w o r l d ! ; y = e l l o ␣ w o r l d ! EOS (shifted by one). Distinct characters: H, e, l, o, ␣, w, r, d, ! → **9** (10 including EOS), so one-hot vectors have length 9 (or 10). Each position is a training example: input ‘H’ → target ‘e’, …, input ‘!’ → target EOS.",
    },
  ],

  theory: [
    {
      title: "Why CNNs instead of fully connected networks for images",
      level: "Easy",
      question: "Give three reasons a fully connected ANN is a poor choice for image classification, and how a CNN addresses each.",
      solution: "(1) **Too many parameters** (pages 528, 530): a 224×224×3 image into 1,000 neurons needs 150,528,000 weights, so memory, computation and data needs explode; a CNN filter has a handful of weights (e.g. 28) regardless of image size. (2) **Spatial structure is ignored** (page 531): flattening removes the 2-D arrangement, but features like eyes are patterns of nearby pixels; CNN filters look at local patches. (3) **Same feature in different places** (page 532): a dense network must learn separate weights for each location; a CNN shares the same filter across all positions (weight sharing), so a detector learnt once works everywhere.",
    },
    {
      title: "Padding, stride and pooling",
      level: "Medium",
      question: "Explain padding, stride and pooling, with the output-size formula for each and the effect on the representation.",
      solution: "**Padding** (pages 559–562): add zeros around the input. Without it the image shrinks (6×6 → 4×4) and corner pixels are used only once. Valid padding p = 0; same padding p = (f − 1)/2 keeps the size. **Stride** (page 563): the step size s of the filter; output ⌊(n + 2p − f)/s⌋ + 1, so a larger stride reduces the output. **Pooling** (pages 568–572): replace each f×f block with its max (max pooling) or mean (average pooling); output ⌊(n − f)/s⌋ + 1; reduces size and computation, keeps the strongest responses, works per channel, and has no learnable parameters.",
    },
    {
      title: "How an RNN differs from a feedforward network",
      level: "Medium",
      question: "Explain the structure of an RNN, what unfolding means, and the four sequence-modelling patterns with an example each.",
      solution: "A feedforward network maps one input to one output with no memory. An RNN (pages 579–580) has a **recurrent edge**: at time t it combines input $x^{\\langle t \\rangle}$ with the previous hidden state $h^{\\langle t-1 \\rangle}$ to produce $h^{\\langle t \\rangle}$ and output $y^{\\langle t \\rangle}$, so information from earlier steps is remembered. **Unfolding** draws the loop as a chain of identical copies, one per time step, sharing weights; it can be stacked into a multilayer RNN. **Patterns** (pages 584–587): many-to-one (sentiment analysis), one-to-many (image captioning), many-to-many direct (video captioning), many-to-many delayed (translation).",
    },
  ],

  quiz: [
    { topic: "Why CNN", type: "num", q: "A 28×28 image feeds 1,000 hidden neurons. How many weights (no biases)?", answer: 784000, tol: 0.5, why: "$784 \\times 1000$ (page 528)." },
    { topic: "Why CNN", q: "Weight sharing in a CNN means…", options: ["every pixel has its own weight", "the same filter weights are used at every position", "weights are copied between layers", "biases are shared by all neurons"], answer: 1, why: "One filter slides over all positions (page 532).", wrong: ["That's a dense layer.", null, "No.", "Not the meaning."] },
    { topic: "Convolution", type: "num", q: "Window (3 0 1 / 1 5 8 / 2 7 2), filter (1 0 −1) on each row. Output value?", answer: -5, tol: 0.01, why: "$(3 + 1 + 2) - (1 + 8 + 2) = -5$ (page 547)." },
    { topic: "Convolution", type: "num", q: "Output side length for a 10×10 input and a 3×3 filter, no padding, stride 1?", answer: 8, tol: 0.01, why: "$10 - 3 + 1 = 8$." },
    { topic: "Padding / stride", type: "num", q: "Same padding for a 5×5 filter: p = ?", answer: 2, tol: 0.01, why: "$p = (f - 1)/2 = 2$ (page 562 examples)." },
    { topic: "Padding / stride", type: "num", q: "Output side for n = 7, f = 3, p = 0, s = 2?", answer: 3, tol: 0.01, why: "$\\lfloor 4/2 \\rfloor + 1 = 3$ (page 564)." },
    { topic: "Parameters", type: "num", q: "Parameters in ONE 3×3 filter on an RGB image (with bias)?", answer: 28, tol: 0.01, why: "$3 \\cdot 3 \\cdot 3 + 1 = 28$ (page 567)." },
    { topic: "Pooling", q: "How many learnable parameters does a max-pooling layer have?", options: ["f × f", "f × f + 1", "0", "one per channel"], answer: 2, why: "Pooling is a fixed computation (page 569).", wrong: ["That's a filter.", "That's a filter with bias.", null, "No."] },
    { topic: "Pooling", type: "num", q: "Average-pool the block {3, 4, 7, 5}.", answer: 4.75, tol: 0.001, why: "$19/4 = 4.75$ (page 572)." },
    { topic: "Edges", q: "The filter (1 1 1 / 0 0 0 / −1 −1 −1) detects…", options: ["vertical edges", "horizontal edges", "corners only", "colour"], answer: 1, why: "It compares top rows with bottom rows (page 551).", wrong: ["That's (1 0 −1) on each row.", null, "No.", "No."] },
    { topic: "Architectures", q: "Which network learns about 138 million parameters?", options: ["LeNet-5", "AlexNet", "VGG-16", "a 3×3 conv layer"], answer: 2, why: "Page 577.", wrong: ["≈ 60 thousand.", "≈ 60 million.", null, "28."] },
    { topic: "RNN", q: "Sentiment analysis of a review is which sequence type?", options: ["one-to-many", "many-to-one", "many-to-many", "one-to-one"], answer: 1, why: "Text in, one label out (page 585).", wrong: ["That's captioning.", null, "Output isn't a sequence.", "Input is a sequence."] },
    { topic: "RNN", q: "Image captioning is…", options: ["many-to-one", "one-to-many", "many-to-many delayed", "not a sequence task"], answer: 1, why: "One image → a sequence of words (page 586).", wrong: ["Reversed.", null, "Input isn't a sequence.", "It is."] },
    { topic: "RNN", q: "In a character RNN, the target sequence y is…", options: ["the input reversed", "the input shifted by one character", "the one-hot of the first letter", "a class label"], answer: 1, why: "We predict the next character (page 595).", wrong: ["No.", null, "No.", "No."] },
  ],
};
