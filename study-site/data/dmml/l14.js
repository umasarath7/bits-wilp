// DMML — Lecture 14: Data Pipelines for LLMs
// Source: CourseFiles/DMML/L14-Data Pipelines for LLMs.pptx (92 slides)
// Teaching style: "Lesson N: Why …?" — the why first, a running example, real-world cases, glossary at the end.

export default {
  title: "Data Pipelines for LLMs",
  source: "L14-Data Pipelines for LLMs.pptx · 92 slides",
  overview:
    "A **large language model (LLM)** learns to predict the next word from enormous amounts of text (slide 5). Its quality is decided by its **data**: what text goes in, how clean it is, and, for chatbots answering company questions, which documents it can **look up** at answer time. This lecture separates **LLM data pipelines, LLM (inference) pipelines and LLMOps pipelines**, and explains why LLM data work differs from classical ML (slides 4–9). It covers the four pipeline types, **pre-training, fine-tuning, evaluation & feedback, and RAG** (slides 10–33), the **core components** (sourcing, cleaning, normalisation and tokenisation, metadata, embeddings, vector indexing, context engineering, monitoring, slides 34–68), a full **architecture** (batch preprocessing + real-time retrieval + feedback loop, slides 69–76), **engineering considerations** (slides 77–83) and **tools** (slides 84–89).",

  simpleIntro: "ChatGPT-style models (**LLMs**) learned language by reading a huge library of text. So the **text you feed them decides how good they are**. And when a company wants a chatbot that knows *its own* policies, the bot looks up the right pages at answer time: that's **RAG**. This lecture shows how text is collected, cleaned, cut into pieces, turned into numbers (embeddings), stored for fast lookup, fed to the model, and improved through feedback.",

  simple: [
    {
      "id": "s-big",
      "heading": "1. The big picture",
      "slides": "4–6",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "title": "Train",
              "text": "Pre-train on huge public text, then fine-tune on your domain.",
              "tag": "Teach the model",
              "example": "Common Crawl, then legal documents"
            },
            {
              "title": "Look things up (RAG)",
              "text": "Store your documents as vectors; fetch the relevant ones for each question.",
              "tag": "Open-book exam",
              "example": "HR policy chatbot"
            },
            {
              "title": "Keep improving",
              "text": "Evaluate, collect thumbs up/down, fix data, update.",
              "tag": "Feedback loop",
              "example": "RLHF, A/B tests"
            }
          ]
        },
        {
          "type": "table",
          "head": [
            "Pipeline",
            "Job in one line"
          ],
          "rows": [
            [
              "**LLM data pipeline**",
              "Get the text ready (clean, tokenise, embed)"
            ],
            [
              "**LLM pipeline**",
              "Turn a question into an answer (prompt → model → parse)"
            ],
            [
              "**LLMOps pipeline**",
              "Run it all safely (versions, CI/CD, hallucination and cost monitoring)"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-diff",
      "heading": "2. Why LLM data is different",
      "slides": "7–9",
      "blocks": [
        {
          "type": "table",
          "head": [
            "",
            "Classic ML",
            "LLMs"
          ],
          "rows": [
            [
              "Learns from",
              "Tables",
              "Libraries of text"
            ],
            [
              "Data shape",
              "Structured",
              "Unstructured"
            ],
            [
              "Size",
              "Smaller, one task",
              "Enormous, general"
            ],
            [
              "Same data every stage?",
              "Yes",
              "No: different data for pre-training, fine-tuning, RAG, evaluation"
            ],
            [
              "Feedback",
              "Occasional",
              "Constant (RLHF, user logs)"
            ],
            [
              "Freshness & sources",
              "Relaxed",
              "RAG must be current and show which document it used"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-types",
      "heading": "3. Four pipelines",
      "slides": "10–27",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Pipeline",
            "Like…",
            "Data"
          ],
          "rows": [
            [
              "**Pre-training**",
              "Going to school: learn language and general knowledge",
              "Wikipedia, Common Crawl, books"
            ],
            [
              "**Fine-tuning**",
              "Professional training for one job",
              "Curated domain or instruction data"
            ],
            [
              "**RAG**",
              "An open-book exam with today's notes",
              "Your company's documents"
            ],
            [
              "**Evaluation & feedback**",
              "Regular report cards",
              "Human ratings, test sets, user feedback"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Fine-tuning in 3 steps:** choose the right base model (a smaller one tuned well can beat a giant on a narrow task) → set the learning rate carefully (too high erases what it knew) → prevent overfitting (dropout, weight decay, early stopping)."
        },
        {
          "type": "p",
          "text": "**Evaluation:** metrics (perplexity, BLEU, ROUGE, bias, safety) → automated unit/functional/load tests → tools (Deepchecks, Arize, OpenAI Evals) → release gradually with **feature flags** and keep a **rollback**."
        }
      ]
    },
    {
      "id": "s-rag",
      "heading": "4. RAG step by step",
      "slides": "28–33",
      "blocks": [
        {
          "type": "p",
          "text": "```flow\nCompany documents -> Cut into chunks -> Turn chunks into vectors (embeddings) -> Store in a vector database\nQuestion -> Turn into a vector -> Find the closest chunks -> Give chunks + question to the LLM -> Answer citing the source\n```"
        },
        {
          "type": "callout",
          "kind": "tip",
          "title": "Why vectors?",
          "text": "An **embedding** turns text into a list of numbers so that **similar meanings sit close together**. “Leave policy” and “holiday rules” land near each other even with no shared words."
        },
        {
          "type": "check",
          "q": "In RAG, what does the system search when a user asks a question?",
          "options": [
            "The LLM's weights",
            "A vector database of document chunks",
            "The internet",
            "The training logs"
          ],
          "answer": 1,
          "why": "The query vector is compared with stored chunk vectors."
        }
      ]
    },
    {
      "id": "s-clean",
      "heading": "5. Getting the text ready",
      "slides": "34–59",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Step",
            "Why",
            "How"
          ],
          "rows": [
            [
              "**Deduplicate**",
              "The web repeats itself; duplicates cause memorising",
              "Hashing (exact), MinHash LSH (near-duplicates)"
            ],
            [
              "**Detect language**",
              "Don't answer in the wrong language",
              "Language classifiers (110+ languages)"
            ],
            [
              "**Check copyright**",
              "Models can recite books word for word",
              "Fuzzy matching, detection tools"
            ],
            [
              "**Filter toxicity**",
              "Hateful web text becomes bad behaviour",
              "Toxicity classifiers, blocklists, safety APIs"
            ],
            [
              "**Normalise**",
              "Same thing, same form",
              "Lowercase, café → cafe, can't → cannot, dates → 2024-01-31"
            ],
            [
              "**Tokenise**",
              "Models read tokens, not words",
              "Word / **subword** (token + ##ization) / character"
            ],
            [
              "**Tag metadata**",
              "Know where each piece came from",
              "Domain, language, quality, version, source, sensitivity"
            ]
          ]
        },
        {
          "type": "check",
          "q": "Two crawled pages are identical except for a footer. Which technique catches them?",
          "options": [
            "Exact hashing",
            "Near-duplicate matching (MinHash LSH)",
            "Tokenisation",
            "Lowercasing"
          ],
          "answer": 1,
          "why": "Exact hashing misses small differences; MinHash catches near-duplicates."
        }
      ]
    },
    {
      "id": "s-vec",
      "heading": "6. Embeddings, vector indexes and context",
      "slides": "60–65",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Index",
            "Simple idea"
          ],
          "rows": [
            [
              "**HNSW**",
              "A road map linking similar vectors: hop quickly to the nearest"
            ],
            [
              "**IVF**",
              "Sort vectors into neighbourhoods; search only the closest ones"
            ],
            [
              "**PQ**",
              "Compress vectors to save memory"
            ],
            [
              "**Flat**",
              "Compare with everything: exact but slow"
            ]
          ]
        },
        {
          "type": "p",
          "text": "**Context engineering** = packing the prompt well: tell the model its **role**, add the user's **history** and **retrieved** facts, and **compress** (summaries, ranking) because the context window is limited (e.g. 128K tokens)."
        }
      ]
    },
    {
      "id": "s-arch",
      "heading": "7. The whole system",
      "slides": "66–76",
      "blocks": [
        {
          "type": "p",
          "text": "```flow\nOffline: sources -> ingest -> clean -> tokenize -> chunk -> embed -> vector store\nOnline: question -> retrieve and assemble context -> LLM -> answer\nLoop: logs and thumbs up/down -> human review -> cleaned data back into the offline pipeline\n```"
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "**Offline builds the library, online answers questions, the loop keeps it improving.**"
        }
      ]
    },
    {
      "id": "s-cons",
      "heading": "8. Things that can go wrong (and fixes)",
      "slides": "77–83",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Concern",
            "Fix"
          ],
          "rows": [
            [
              "Too slow / too big",
              "Spark, Ray, GPUs; distillation and quantisation for speed"
            ],
            [
              "Bad data → hallucinations",
              "Cleaning, dedup, bias checks, Delta Lake lineage"
            ],
            [
              "Can't see problems",
              "Monitor drift, cost, latency (MLflow, LangFuse, Arize)"
            ],
            [
              "Privacy / copyright",
              "Automatic PII redaction and copyright checks"
            ],
            [
              "Stale vectors",
              "Regenerate embeddings, refresh indexes"
            ],
            [
              "Cost",
              "Smaller models, caching, planning"
            ]
          ]
        },
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "“**S**mart **Q**ueries **O**ften **G**et **V**ery **L**ow **C**ost”: Scalability, Quality, Observability, Governance, Vector DataOps, Latency, Cost."
        }
      ]
    },
    {
      "id": "s-tools",
      "heading": "9. Tools to recognise",
      "slides": "84–89",
      "blocks": [
        {
          "type": "table",
          "head": [
            "Need",
            "Tools"
          ],
          "rows": [
            [
              "Connect LLM to data",
              "LangChain, LlamaIndex"
            ],
            [
              "Agents",
              "AutoGen, CrewAI"
            ],
            [
              "Serve models",
              "vLLM, Ollama (local)"
            ],
            [
              "Fine-tune",
              "Hugging Face, Unsloth, DeepSpeed"
            ],
            [
              "Vector DB",
              "Pinecone, Chroma, pgvector"
            ],
            [
              "Observe",
              "LangFuse, Arize"
            ],
            [
              "Cloud",
              "AWS Bedrock, Databricks"
            ]
          ]
        }
      ]
    },
    {
      "id": "s-remember",
      "heading": "10. What to remember for your exam",
      "slides": "",
      "blocks": [
        {
          "type": "callout",
          "kind": "remember",
          "title": "Remember",
          "text": "- **3 pipelines:** data, LLM (inference), LLMOps.\n- **4 types:** pre-training, fine-tuning, RAG, evaluation & feedback.\n- **RAG:** chunk → embed → vector DB; question → embed → search → LLM.\n- **Clean:** dedup, language, copyright, toxicity; normalise; tokenise; tag.\n- **Indexes:** HNSW, IVF, PQ, flat. **Context:** role, assembly, retrieval, compression.\n- **Considerations:** SQOGVLC; quantise/distil for latency; redact PII."
        }
      ]
    }
  ],

  summary: [
    {
      id: "intro",
      heading: "Lesson 1: Why are LLM data pipelines different?",
      slides: "4–9",
      blocks: [
        {
          type: "table",
          caption: "Three kinds of pipeline (slide 6)",
          head: ["Pipeline", "Centred on", "Does"],
          rows: [
            ["**LLM data pipeline**", "**Data**", "Cleaning, tokenisation, embedding generation for vector databases: data ready for training or **RAG**"],
            ["**LLM pipeline**", "**Inference**", "Chains prompt engineering, model calls (API or local) and output parsing: user prompt → final answer"],
            ["**LLMOps pipeline**", "**Operations**", "Whole lifecycle: version control, CI/CD, monitoring for drift and **hallucinations**, **cost** (token usage)"],
          ],
        },
        {
          type: "table",
          caption: "Traditional ML vs LLMs (slides 7–9)",
          head: ["Parameter", "Traditional ML", "LLMs"],
          rows: [
            ["**Focus**", "**Data-centric**: improve quality, consistency, diversity", "**Knowledge-centric**: broad understanding of language and the world"],
            ["**Data type**", "Mostly structured after processing", "**Unstructured** text with no schema: hard to organise, search and parse"],
            ["**Scale**", "Smaller, task-specific datasets", "Vast, diverse corpora"],
            ["**Diversity of data**", "Same data through all stages", "**Different datasets per stage** → separate pipelines"],
            ["**Feedback**", "Considered, less central", "Constantly updated after deployment: **RLHF** (human evaluation) and user interaction logs"],
            ["**Quality, traceability, freshness**", "Tolerant; manual traceability via the registry", "**Curation critical**; for RAG track **which document produced which answer**; RAG needs **up-to-the-minute** data (news, policies)"],
          ],
        },
        {
          type: "callout",
          kind: "idea",
          title: "In plain words",
          text: "Classical ML learns from **tables**; an LLM learns from **libraries**. And a RAG chatbot is like a student allowed to bring **today's notes** into the exam, so the notes must be clean, current and traceable.",
        },
      ],
    },
    {
      id: "types",
      heading: "Lesson 2: Four types of LLM pipeline",
      slides: "10–33",
      blocks: [
        {
          type: "p",
          text: "**Pipeline vs stage (slide 11).** A **pipeline** is a multi-stage funnel toward a goal with its **own data, orchestration, tools and SLAs**, able to run independently. A **stage** is a milestone inside one pipeline. **Stages of LLM training (slide 12):** data preparation (collect, clean, tokenise) → **pre-training** (most resource-intensive: grammar, semantic relationships, world knowledge) → **fine-tuning** (adapt to customer support, document review…) → **evaluation** (accuracy, bias, reliability) → **deployment**.",
        },
        {
          type: "table",
          caption: "The four pipelines (slide 33 summary)",
          head: ["Pipeline", "Purpose", "Example data"],
          rows: [
            ["**Pre-training**", "Ingest and process large-scale raw text: learn grammar, syntax, context, facts, reasoning", "Wikipedia, Common Crawl, BooksCorpus"],
            ["**Fine-tuning**", "Curate domain-specific or instruction data", "Domain adaptation, ChatGPT-style instruction tuning"],
            ["**RAG**", "Combine external knowledge with the LLM at answer time", "Enterprise Q&A, documentation assistants"],
            ["**Evaluation & feedback**", "Continuous evaluation, RLHF, preference tuning", "OpenAI's reward modelling, human/AI feedback loops"],
          ],
        },
        {
          type: "p",
          text: "**Pre-training refresh (slide 15):** CI/CD can retrain when **new information** appears, **user feedback** shows weaknesses, or **performance drops** (e.g. a finance assistant retrained on current stock data).",
        },
        {
          type: "table",
          caption: "Fine-tuning in three steps (slides 16–19)",
          head: ["Step", "Key points"],
          rows: [
            ["**1. Choose the pre-trained model**", "It sets the limits of what tuning can do; bigger = better reasoning but costlier; a smaller model fine-tuned well often wins on narrow tasks"],
            ["**2. Tune parameters and hyperparameters**", "**Learning rate** too high overwrites pre-trained knowledge, too low changes nothing; **batch size** trades stability, memory and convergence"],
            ["**3. Prevent overfitting**", "Strong validation but brittle in production → **dropout**, **weight decay**, **early stopping**"],
          ],
        },
        {
          type: "p",
          text: "Fine-tuning gives a **generalist** foundation model **preferences** for terminology, structure and decision boundaries in a domain (clinical notes, legal analysis, risk assessment), using **transfer learning** on a small, curated dataset.",
        },
        {
          type: "table",
          caption: "Evaluation & feedback pipeline (slides 20–27): “with power comes responsibility”",
          head: ["Step", "What"],
          rows: [
            ["**1. Define metrics**", "Performance (**perplexity, BLEU, ROUGE**), **fairness & bias**, **robustness & safety** against adversarial inputs"],
            ["**2. Automate tests**", "Unit (small outputs), functional (scenarios), **load** (many queries)"],
            ["**3. Integrate tools**", "Deepchecks, Arize AI, OpenAI Evals, Hugging Face Evaluate; monitoring with Grafana and Prometheus"],
            ["**4. Deploy with confidence**", "**Feature flags** (gradual rollout) and **rollback** mechanisms"],
            ["**Best practices**", "**A/B tests** (fast vs detailed chatbot), **real-time user feedback**, monitor logs for **drift** and anomalous behaviour"],
          ],
        },
        {
          type: "callout",
          kind: "formula",
          title: "RAG: Retrieval-Augmented Generation (slides 28–32)",
          text: "Augment the LLM with **your own business data** so answers are current and specific. Two pipelines:\n1. **Recurring ingestion:** ingest documents → pre-process (**split text into chunks** that fit the embedding model) → **generate embeddings** (high-dimensional vectors) → **store** in a **vector database**.\n2. **Inference:** embed the user **query** → find the most similar stored vectors → the **LLM** writes an answer from the query + retrieved context.",
        },
        {
          type: "p",
          text: "```flow\nDocuments -> Chunk -> Embed -> Vector DB\nUser question -> Embed query -> Similarity search in Vector DB -> Top chunks + question -> LLM -> Answer with sources\n```",
        },
      ],
    },
    {
      id: "components",
      heading: "Lesson 3: Core components of an LLM data pipeline",
      slides: "34–68",
      blocks: [
        {
          type: "table",
          caption: "Data sourcing (slides 36–44)",
          head: ["Source", "Strength", "Caution"],
          rows: [
            ["**Public datasets**", "Diversity and scale", "Quality, relevance, inherent bias"],
            ["**Domain-specific datasets**", "Industry jargon and nuance (medical, legal, finance)", "Curation effort"],
            ["**User-generated content**", "Varied styles, constantly updated", "Noise, toxicity"],
            ["**Licensed corpora**", "Legal, high-quality books/articles", "**Cost** (fees, subscriptions)"],
            ["**Code repositories**", "Technical language, coding help", "Respect **licences** and privacy"],
            ["**Synthesised data**", "When real data is scarce, sensitive or costly", "Check quality and relevance"],
          ],
        },
        {
          type: "table",
          caption: "Cleaning & filtering (slides 45–53)",
          head: ["Step", "Why", "Techniques"],
          rows: [
            ["**Deduplication**", "Web crawls repeat pages (mirrors, reposts, boilerplate); duplicates waste compute and cause memorisation/leakage", "**Exact** (hashing: fast, misses near-duplicates) · **semantic** (embeddings: accurate, expensive) · **approximate** (**MinHash LSH**, Jaccard: balanced, for trillion-token data) · **suffix arrays** (repeated substrings)"],
            ["**Language detection**", "Wrong language → wrong answers", "Built-in token patterns, prompt engineering, external classifiers (**MediaPipe**, 110+ languages), perplexity-based (“binoculars”)"],
            ["**Copyright checks**", "Models can memorise and reproduce copyrighted text (e.g. a model reciting *Harry Potter*'s first line)", "Detection (CopyrightCatcher, DE-COP), fuzzy matching, copyright traps; mitigation: machine unlearning, temperature, real-time agent checks. Courts debate **fair use**"],
            ["**Toxicity filtering**", "Hateful/offensive web text becomes model behaviour; sources: imperfect data, randomness, no ground truth (hallucination)", "Classifiers (FastText, DeBERTa, Celadon), keyword blocklists, safety APIs (Perspective API, Azure Content Safety)"],
          ],
        },
        {
          type: "table",
          caption: "Normalisation and tokenisation (slides 54–56)",
          head: ["Step", "Examples"],
          rows: [
            ["**Normalisation** (standard format)", "Lowercasing; removing accents (café → cafe); expanding contractions (can't → cannot); handling punctuation; dates to ISO (2024-01-31); removing emojis/special characters"],
            ["**Word tokenisation**", "“Tokenization is important!” → [Tokenization, is, important, !]"],
            ["**Subword tokenisation**", "tokenization → [token, ##ization] (handles rare/new words)"],
            ["**Character tokenisation**", "[t, o, k, e, n, …]"],
          ],
        },
        {
          type: "p",
          text: "**Metadata tagging (slides 57–59).** Attach structured information to data and to every request (who, what, where, why: user, feature, app version, model provider, session ID) for **traceability and root-cause analysis**. Tags: **domain** (legal, medical), **language** (ISO codes like en-US), **quality** (high/medium/low/vetted: filters noise and reduces hallucinations), **version** (v1.0), plus source, **sensitivity** and timestamp. Methods: LLM-assisted auto-tagging, expert labelling, keyword/entity extraction (spaCy, NLTK), structure-aware formats (JSON-LD, DITA).",
        },
        {
          type: "table",
          caption: "Embeddings (slides 60–61)",
          head: ["Term", "Meaning"],
          rows: [
            ["**Embedding** (the vector)", "Numbers representing a token, sentence or image; similar meanings sit close together"],
            ["**Embedding layer** (component)", "The LLM's learnable **lookup table**: token ID → vector; trained with the whole model (self-supervised); then positional encoding → transformer blocks"],
            ["**Embedding model** (system)", "A separate network (small transformer, Word2Vec) whose only job is producing embeddings, e.g. for **semantic search**"],
          ],
        },
        {
          type: "table",
          caption: "Vector indexing (slides 62–63): Approximate Nearest Neighbour (ANN) search",
          head: ["Index", "How", "Trade-off"],
          rows: [
            ["**HNSW**", "Graph connecting similar vectors; fast traversal", "Very fast, popular"],
            ["**IVF** (inverted file)", "k-means clusters; search only the closest clusters", "Fewer comparisons"],
            ["**PQ** (product quantisation)", "Split vectors into sub-vectors, replace with centroids", "Saves memory, faster"],
            ["**Flat**", "Store raw vectors, compare with all", "Exact but slow (linear)"],
          ],
        },
        {
          type: "table",
          caption: "Context engineering (slides 64–65)",
          head: ["Component", "Idea"],
          rows: [
            ["**Role & intent conditioning**", "Tell the model who it is and why it's answering (persona) before giving details"],
            ["**Dynamic context assembly**", "Merge user history, environment variables and external data (APIs, DBs) just in time"],
            ["**Retrieval layer**", "Fetch only the most relevant pieces from a vector DB (Pinecone, Weaviate, FAISS)"],
            ["**Context compression**", "Context windows are limited (e.g. 128K tokens for GPT-4 Turbo): **summarise** old turns, **rank** by relevance, **hierarchical memory** (short/medium/long term)"],
          ],
        },
        {
          type: "p",
          text: "**Monitoring & feedback (slides 66–67).** **Observability** (logs, traces, latency, **token usage**), continuous **evaluation** (relevance, accuracy, safety, bias, often **LLM-as-a-judge**), **data tracking** (drift in queries, prompt templates, temperature). Loop: **monitor → evaluate → act** (automatic retraining/fine-tuning, or **human-in-the-loop** thumbs up/down) → **update** prompts or models → redeploy.",
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook: the order of the components",
          text: "“**S**ome **C**ats **N**ever **M**eet **E**very **V**isiting **C**at's **M**other”: **S**ourcing → **C**leaning → **N**ormalisation/tokenisation → **M**etadata → **E**mbeddings → **V**ector index → **C**ontext engineering → **M**onitoring.",
        },
      ],
    },
    {
      id: "arch",
      heading: "Lesson 4: The full architecture",
      slides: "69–76",
      blocks: [
        {
          type: "p",
          text: "```flow\nRaw text sources -> Ingestion -> Cleaning and filtering -> Tokenization -> Chunking -> Embedding generation -> Vector store\nUser query -> Retrieval and context assembly from Vector store -> LLM inference -> Response to user\nResponse to user -> Monitoring and logging -> Human review and labelling -> Back to Cleaning and filtering\n```",
        },
        {
          type: "table",
          caption: "Three parts (slides 71–76)",
          head: ["Part", "What it does"],
          rows: [
            ["**1. Batch preprocessing** (offline)", "Builds the RAG knowledge base from large static corpora: ingest (scrapers, connectors) → clean (noise, boilerplate, duplicates, sensitive content) → tokenise → **chunk** (e.g. 256 or 512 tokens **with overlap** to keep context) → embed → store in a vector DB (Pinecone, Weaviate, **pgvector**)"],
            ["**2. Real-time retrieval** (online)", "Embed the query → similarity search → assemble retrieved chunks + query into a prompt → LLM → answer"],
            ["**3. Feedback loop**", "Log interactions and thumbs up/down → humans review negative cases, correct and label → clean data re-enters the batch pipeline → new embeddings update the vector store (or fine-tune the model)"],
          ],
        },
      ],
    },
    {
      id: "consider",
      heading: "Lesson 5: Engineering considerations",
      slides: "77–83",
      blocks: [
        {
          type: "table",
          head: ["Factor", "Challenge", "Best practice"],
          rows: [
            ["**Scalability & performance**", "Huge compute, bottlenecks", "Distributed processing (**Spark** for preprocessing, **Ray** for distributed training/inference), GPUs, load balancing, cloud/edge"],
            ["**Data quality**", "Poor data → **hallucinations**, bias, unreliable output", "Automated pipelines, deduplication, bias and toxicity detection; **Delta Lake** for lineage and compliance"],
            ["**Observability**", "Drift, security holes, unpredictable behaviour", "Lineage incl. **data versions and embedding updates**; MLflow, Prometheus, W&B; alerts for drift, adversarial attacks, anomalies"],
            ["**Governance & privacy**", "Personal data and copyright", "Automate **PII redaction** and copyright checks inside the pipeline; governance framework"],
            ["**Vector DataOps**", "Stale or broken embeddings", "Efficient **embedding regeneration**, automatic index updates, vector-quality monitoring"],
            ["**Latency**", "Slow inference for real-time apps", "**Distillation**, **quantisation**, edge deployment"],
            ["**Cost**", "Expensive to run", "Optimise resources; plan and forecast with LLMOps expertise"],
          ],
        },
        {
          type: "callout",
          kind: "remember",
          title: "Memory hook",
          text: "“**S**mart **Q**ueries **O**ften **G**et **V**ery **L**ow **C**ost”: Scalability, Quality, Observability, Governance, Vector DataOps, Latency, Cost.",
        },
      ],
    },
    {
      id: "tools",
      heading: "Lesson 6: Tools and frameworks",
      slides: "84–89",
      blocks: [
        {
          type: "table",
          head: ["Category", "Tools"],
          rows: [
            ["**App development & orchestration**", "**LangChain** (connect LLMs to data, APIs, conversation state), **LlamaIndex** (private data for RAG), Haystack, Semantic Kernel (Microsoft), Dify"],
            ["**Agent frameworks**", "**AutoGen** (multi-agent conversations), **CrewAI** (role-playing agents), SuperAGI"],
            ["**Serving & inference**", "**vLLM** (high-throughput serving), **Ollama** (run models locally), OpenLLM"],
            ["**Fine-tuning**", "**Hugging Face Transformers**, Unsloth (faster, less memory), DeepSpeed (large-model optimisation)"],
            ["**Vector databases**", "Chroma, **Pinecone** (managed), Elasticsearch, **pgvector** (also Weaviate, FAISS, Milvus)"],
            ["**Data orchestration**", "Airflow, Prefect, Kubeflow Pipelines"],
            ["**Tracking & observability**", "MLflow, W&B, **LangFuse** (LLM app tracing/evaluation), **Arize** (drift and hallucinations; Phoenix)"],
            ["**Cloud**", "Databricks Lakehouse, **AWS Bedrock** (managed foundation models)"],
          ],
        },
        {
          type: "p",
          text: "**The emerging toolchain (slide 85):** **LLMs** (OpenAI, Anthropic, Cohere, PaLM 2, Dolly, MosaicML) → **AI memory** (proprietary data in vector stores: Pinecone, Chroma, Milvus, Vertex AI Matching Engine) → **orchestration** (LangChain, LlamaIndex) → **evaluation** (Arize, Phoenix).",
        },
      ],
    },
  ],

  recap: [
    {
      type: "callout",
      kind: "idea",
      title: "In one line",
      text: "LLMs need huge, clean, traceable text: source it, clean it (dedup, language, copyright, toxicity), tokenise, tag, embed and index it, assemble the right context at query time, and keep improving through feedback.",
    },
    {
      type: "list",
      items: [
        "**3 pipelines:** data (prepare text), LLM (prompt → answer), LLMOps (lifecycle, drift, hallucination, cost).",
        "**LLM vs ML data:** knowledge-centric, unstructured, vast, different data per stage, RLHF feedback, provenance + freshness for RAG.",
        "**4 pipeline types:** pre-training (Common Crawl), fine-tuning (choose model, hyperparameters, prevent overfitting), evaluation & feedback (metrics, automated tests, tools, feature flags, rollback), RAG.",
        "**RAG:** chunk → embed → vector DB; query → embed → similarity search → LLM with context.",
        "**Cleaning:** dedup (exact, semantic, MinHash LSH, suffix arrays), language detection, copyright checks, toxicity filtering.",
        "**Tokenisation:** word / subword / character; normalisation (lowercase, accents, contractions, ISO dates).",
        "**Metadata:** domain, language, quality, version, source, sensitivity, timestamp.",
        "**Vector indexes:** HNSW, IVF, PQ, flat (ANN search).",
        "**Context engineering:** role conditioning, dynamic assembly, retrieval, compression.",
        "**Considerations:** scalability, quality, observability, governance (PII redaction), vector DataOps, latency (distil, quantise), cost.",
        "**Tools:** LangChain, LlamaIndex, vLLM, Ollama, Hugging Face, Pinecone, pgvector, LangFuse, Arize, Bedrock.",
      ],
    },
    {
      type: "callout",
      kind: "exam",
      title: "Exam hook",
      text: "Likely 5-markers: design a RAG pipeline with a diagram · LLM vs traditional ML data pipelines · data cleaning for LLM training (dedup, toxicity, copyright) · engineering considerations for a production LLM system.",
    },
  ],

  glossary: [
    ["LLM", "Large Language Model", "Model trained on vast text to predict the next token"],
    ["LLMOps", "LLM Operations", "Managing the LLM lifecycle: versions, CI/CD, monitoring, cost"],
    ["Hallucination", "—", "Confident but false or nonsensical output"],
    ["RAG", "Retrieval-Augmented Generation", "Answering with documents retrieved from your own data"],
    ["RLHF", "Reinforcement Learning from Human Feedback", "Refining a model with human preference judgements"],
    ["Pre-training / fine-tuning", "—", "Learning language from huge corpora / adapting to a domain or task"],
    ["Foundation model", "—", "Large general-purpose pre-trained model"],
    ["Perplexity / BLEU / ROUGE", "—", "Language-model and text-overlap quality metrics"],
    ["Feature flag", "—", "Switch for gradually rolling out a change"],
    ["Common Crawl", "—", "Large public web-crawl dataset"],
    ["Deduplication", "—", "Removing repeated documents"],
    ["MinHash LSH", "Locality-Sensitive Hashing", "Probabilistic near-duplicate detection"],
    ["Jaccard similarity", "—", "Overlap of two sets divided by their union"],
    ["Toxicity filtering", "—", "Removing offensive or hateful content"],
    ["Fair use", "—", "Legal doctrine on permitted use of copyrighted material"],
    ["Machine unlearning", "—", "Removing the influence of specific training data"],
    ["Tokenisation (word / subword / character)", "—", "Splitting text into tokens at different granularity"],
    ["Normalisation", "—", "Converting text to a standard form"],
    ["PII", "Personally Identifiable Information", "Data that identifies a person; redact before use"],
    ["Embedding / embedding layer / embedding model", "—", "Vector / LLM lookup table / separate model producing vectors"],
    ["Chunking", "—", "Splitting documents into pieces (e.g. 512 tokens) with overlap"],
    ["Vector database", "—", "Store optimised for similarity search over embeddings"],
    ["ANN", "Approximate Nearest Neighbour", "Fast, approximately correct similarity search"],
    ["HNSW / IVF / PQ", "Hierarchical Navigable Small World / Inverted File / Product Quantization", "Vector index types"],
    ["Context window", "—", "Maximum tokens the model can consider at once"],
    ["Context engineering", "—", "Designing what information goes into the prompt"],
    ["LLM-as-a-judge", "—", "Using an LLM to grade another model's outputs"],
    ["HITL", "Human-in-the-loop", "Humans review and correct outputs"],
    ["Distillation / quantisation", "—", "Smaller student model / lower-precision weights to cut latency and cost"],
    ["LangChain / LlamaIndex", "—", "Frameworks connecting LLMs to data and tools"],
    ["vLLM / Ollama", "—", "Fast LLM serving / running LLMs locally"],
    ["pgvector", "—", "Vector search extension for PostgreSQL"],
  ],

  examTips: [
    "For RAG questions, draw **both** pipelines (ingestion and query) and name a vector DB, an embedding model and an orchestration framework.",
    "For LLM vs ML data, use the six parameters: focus, data type, scale, diversity, feedback, quality/traceability/freshness.",
    "For data cleaning, give the four steps with one technique each: dedup (MinHash LSH), language detection (classifier), copyright (fuzzy match), toxicity (classifier/blocklist).",
    "Mention the feedback loop (monitor → evaluate → act → update) and governance (PII redaction) to score the last marks.",
  ],

  theory: [
    {
      title: "Designing a RAG pipeline",
      marks: 5,
      question: "A company wants an internal chatbot that answers employees' questions about HR policies, which change every quarter. Design a RAG-based data pipeline with a diagram, explaining each component and how answers stay current and traceable.",
      solution: `
### What the examiner wants
Both pipelines (offline ingestion and online inference), each component's role, freshness, provenance, and a feedback loop.

### Model answer
**Why RAG:** the base LLM doesn't know company policies and its training data goes stale. RAG **augments the LLM with business data at answer time** (slide 28).

\`\`\`flow
HR policy PDFs + intranet pages -> Ingest -> Clean: dedup, remove boilerplate, redact PII -> Chunk 512 tokens with overlap -> Embed -> Vector DB with metadata: doc, version, date
Employee question -> Embed query -> Similarity search: top chunks -> Context assembly: role + chunks + question -> LLM -> Answer with cited policy sections
Answer -> Thumbs up/down + logs -> Human review -> Fix documents or tags -> Re-embed
\`\`\`

**Components:**
1. **Ingestion:** connectors pull policy documents; re-run whenever HR publishes a new version (**freshness**).
2. **Cleaning:** deduplicate old copies, strip headers/footers, **redact PII** (slides 45–47, 82).
3. **Tokenise and chunk:** split into ~256–512-token chunks with overlap so each fits the embedding model (slide 72).
4. **Metadata tagging:** domain = HR, version = 2025-Q3, effective date, sensitivity (slide 58), so retrieval can filter to the **current** version.
5. **Embeddings + vector index:** vectors stored in a vector DB (Pinecone, pgvector) with an ANN index such as **HNSW** (slide 63).
6. **Context engineering:** persona (“You are the HR assistant”), retrieved chunks, conversation summary to fit the context window (slides 64–65).
7. **LLM inference:** answers only from the provided context and **cites the source document**, giving **traceability** (slide 9).
8. **Monitoring & feedback:** log queries, latency and token cost; LLM-as-a-judge and user ratings; human review fixes bad answers (slides 66–67, 75–76).

**Tools:** LlamaIndex or LangChain, an embedding model, Pinecone/pgvector, Airflow for re-ingestion, LangFuse/Arize for observability.`,
    },
    {
      title: "Why LLM data pipelines differ from classical ML pipelines",
      marks: 5,
      question: "Explain how data pipelines for LLMs differ from those for traditional ML models, and distinguish the LLM data pipeline, LLM pipeline and LLMOps pipeline.",
      solution: `
### Model answer
| Parameter | Traditional ML | LLMs |
|---|---|---|
| Focus | Data-centric (quality, consistency) | **Knowledge-centric**: broad understanding of language and the world |
| Data type | Mostly structured | **Unstructured** text, no schema |
| Scale | Task-specific, smaller | Vast, diverse corpora (Common Crawl, Wikipedia) |
| Data per stage | Same data throughout | **Different datasets** for pre-training, fine-tuning, RAG, evaluation → separate pipelines |
| Feedback | Secondary | Continuous: **RLHF**, user-interaction logs |
| Quality, traceability, freshness | Tolerant | Curation critical; **provenance** of each RAG answer; **up-to-the-minute** data |

**Three pipelines (slide 6):**
- **LLM data pipeline** (data-centric): cleaning, tokenisation, embeddings, ready for training or RAG.
- **LLM pipeline** (inference-centric): prompt engineering → model call → output parsing.
- **LLMOps pipeline** (operations-centric): version control, CI/CD, monitoring drift and **hallucinations**, **token-cost** optimisation.

\`\`\`flow
LLM data pipeline: clean, tokenize, embed -> LLM pipeline: prompt, call model, parse -> LLMOps: version, deploy, monitor, cost
\`\`\`

**Example:** a bank's credit model uses one structured table through all stages, while its customer-service LLM needs web text for pre-training, curated banking dialogues for fine-tuning, fresh policy documents for RAG, and human ratings for RLHF.`,
    },
    {
      title: "Cleaning and preparing text for LLM training",
      marks: 5,
      question: "Describe the data cleaning, filtering, normalisation and tokenisation steps needed before training an LLM on web-scraped text, with techniques for each.",
      solution: `
### Model answer
Poor data leads to **inaccuracy, bias, incoherence and hallucinations** (slides 45, 80).

| Step | Problem | Techniques |
|---|---|---|
| **Deduplication** | Mirrors, reposts, boilerplate repeat everywhere; wastes compute, causes memorisation | Exact hashing · semantic (embeddings) · **MinHash LSH + Jaccard** (scales to trillions of tokens) · suffix arrays |
| **Language detection** | Wrong-language data or replies | Classifiers (MediaPipe, 110+ languages), prompt-based, perplexity-based |
| **Copyright checks** | Model may memorise and reproduce books or news | CopyrightCatcher, DE-COP, fuzzy matching, copyright traps; machine unlearning |
| **Toxicity filtering** | Hateful content becomes model behaviour | Classifiers (FastText, DeBERTa), blocklists, Perspective API / Azure Content Safety |
| **PII redaction** | Privacy law | Automated detection and masking (slide 82) |
| **Normalisation** | Inconsistent forms | Lowercase, strip accents, expand contractions, ISO dates, remove special characters |
| **Tokenisation** | Model needs units | Word, **subword** (token + ##ization, handles rare words), character |
| **Metadata tagging** | Traceability and filtering | Domain, language, quality, version, source, sensitivity |

\`\`\`flow
Web crawl -> Dedup: MinHash LSH -> Language filter -> Copyright and toxicity filters -> PII redaction -> Normalize -> Tokenize -> Tag metadata -> Training corpus v1.0
\`\`\`

At scale this runs on **Spark** or **Ray**, with **Delta Lake** for versioning and lineage (slides 79–80).`,
    },
    {
      title: "Engineering considerations for production LLM systems",
      marks: 5,
      question: "What engineering considerations must be addressed when running LLM data pipelines in production? Suggest techniques and tools for each.",
      solution: `
### Model answer
| Consideration | Risk | Techniques / tools |
|---|---|---|
| **Scalability & performance** | Massive compute, bottlenecks | Spark for preprocessing, **Ray** for distributed training/inference, GPUs, load balancing |
| **Data quality** | Hallucinations, bias | Automated cleaning, dedup, bias/toxicity detection; **Delta Lake** lineage |
| **Observability** | Drift, attacks, anomalies | Track data and **embedding versions**; MLflow, Prometheus, W&B, LangFuse, Arize; alerts |
| **Governance & privacy** | PII, copyright | Automated **PII redaction** and copyright checks in the pipeline |
| **Vector DataOps** | Stale embeddings | Regenerate embeddings, auto-update indexes, monitor vector quality |
| **Latency** | Slow real-time answers | **Distillation**, **quantisation**, edge deployment, vLLM serving |
| **Cost** | Token and GPU bills | Resource optimisation, caching, smaller fine-tuned models, forecasting |

\`\`\`flow
Ingest at scale: Spark -> Quality and PII gates -> Versioned embeddings -> Low-latency serving: vLLM, quantized -> Observability: drift, cost, hallucinations -> Feedback and retrain
\`\`\`

**Evaluation and deployment safety (slides 21–24):** automated unit, functional and load tests; metrics (perplexity, BLEU, ROUGE, bias, safety); **feature flags** for gradual rollout and **rollback**; A/B tests and user feedback after release.`,
    },
  ],

  quiz: [
    { q: "Which pipeline chains prompt engineering, model calls and output parsing?", options: ["LLM data pipeline", "LLM pipeline", "LLMOps pipeline", "Pre-training pipeline"], answer: 1, why: "Inference-centric (slide 6)." },
    { q: "Compared with traditional ML, LLM data is mostly:", options: ["Structured", "Unstructured", "Numeric only", "Small"], answer: 1, why: "Slide 7." },
    { q: "Wikipedia and Common Crawl are typical data for which pipeline?", options: ["Fine-tuning", "Pre-training", "Evaluation", "RAG queries"], answer: 1, why: "Slide 33." },
    { q: "A learning rate that is too high during fine-tuning can:", options: ["Overwrite useful pre-trained knowledge", "Do nothing", "Reduce cost", "Remove toxicity"], answer: 0, why: "Slide 18." },
    { q: "BLEU, ROUGE and perplexity are used in which pipeline step?", options: ["Deduplication", "Evaluation metrics", "Tokenisation", "Chunking"], answer: 1, why: "Slide 21." },
    { q: "In RAG, documents are split into chunks mainly to:", options: ["Fit the embedding model and retrieve precise pieces", "Encrypt them", "Remove duplicates", "Translate them"], answer: 0, why: "Slides 29, 72." },
    { q: "Which deduplication technique balances accuracy and cost for trillion-token datasets?", options: ["Exact hashing", "Semantic embeddings", "MinHash LSH approximate matching", "Manual review"], answer: 2, why: "Slide 47." },
    { q: "Splitting “tokenization” into [token, ##ization] is:", options: ["Word tokenisation", "Subword tokenisation", "Character tokenisation", "Normalisation"], answer: 1, why: "Slide 54." },
    { q: "Converting “31st January 2024” to 2024-01-31 is part of:", options: ["Tokenisation", "Normalisation", "Embedding", "Indexing"], answer: 1, why: "Slide 56." },
    { q: "Which vector index groups vectors into k-means clusters and searches only the closest ones?", options: ["HNSW", "IVF", "Flat", "PQ"], answer: 1, why: "Slide 63." },
    { q: "Summarising old turns and ranking text to fit the context window is:", options: ["Context compression", "Toxicity filtering", "Pre-training", "Quantisation"], answer: 0, why: "Slide 65." },
    { q: "Which technique reduces LLM inference latency?", options: ["Deduplication", "Quantisation", "Chunk overlap", "Language detection"], answer: 1, why: "Slide 83." },
    { q: "Which tool is for running LLMs locally?", options: ["Pinecone", "Ollama", "LangFuse", "Arize"], answer: 1, why: "Slide 87." },
  ],
};
