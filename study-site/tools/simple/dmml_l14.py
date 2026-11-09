import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("ChatGPT-style models (**LLMs**) learned language by reading a huge library of text. So the **text you feed them decides how good they are**. "
         "And when a company wants a chatbot that knows *its own* policies, the bot looks up the right pages at answer time: that's **RAG**. "
         "This lecture shows how text is collected, cleaned, cut into pieces, turned into numbers (embeddings), stored for fast lookup, fed to the model, "
         "and improved through feedback.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Train", "Pre-train on huge public text, then fine-tune on your domain.", tag="Teach the model", example="Common Crawl, then legal documents"),
     CARD("Look things up (RAG)", "Store your documents as vectors; fetch the relevant ones for each question.", tag="Open-book exam", example="HR policy chatbot"),
     CARD("Keep improving", "Evaluate, collect thumbs up/down, fix data, update.", tag="Feedback loop", example="RLHF, A/B tests"),
   ),
   T(["Pipeline", "Job in one line"],
     [["**LLM data pipeline**", "Get the text ready (clean, tokenise, embed)"], ["**LLM pipeline**", "Turn a question into an answer (prompt → model → parse)"],
      ["**LLMOps pipeline**", "Run it all safely (versions, CI/CD, hallucination and cost monitoring)"]]),
 ], "4–6"),
 SEC(2, "diff", "Why LLM data is different", [
   T(["", "Classic ML", "LLMs"],
     [["Learns from", "Tables", "Libraries of text"], ["Data shape", "Structured", "Unstructured"], ["Size", "Smaller, one task", "Enormous, general"],
      ["Same data every stage?", "Yes", "No: different data for pre-training, fine-tuning, RAG, evaluation"],
      ["Feedback", "Occasional", "Constant (RLHF, user logs)"], ["Freshness & sources", "Relaxed", "RAG must be current and show which document it used"]]),
 ], "7–9"),
 SEC(3, "types", "Four pipelines", [
   T(["Pipeline", "Like…", "Data"],
     [["**Pre-training**", "Going to school: learn language and general knowledge", "Wikipedia, Common Crawl, books"],
      ["**Fine-tuning**", "Professional training for one job", "Curated domain or instruction data"],
      ["**RAG**", "An open-book exam with today's notes", "Your company's documents"],
      ["**Evaluation & feedback**", "Regular report cards", "Human ratings, test sets, user feedback"]]),
   P("**Fine-tuning in 3 steps:** choose the right base model (a smaller one tuned well can beat a giant on a narrow task) → set the learning rate carefully (too high erases what it knew) → prevent overfitting (dropout, weight decay, early stopping)."),
   P("**Evaluation:** metrics (perplexity, BLEU, ROUGE, bias, safety) → automated unit/functional/load tests → tools (Deepchecks, Arize, OpenAI Evals) → release gradually with **feature flags** and keep a **rollback**."),
 ], "10–27"),
 SEC(4, "rag", "RAG step by step", [
   P("```flow\nCompany documents -> Cut into chunks -> Turn chunks into vectors (embeddings) -> Store in a vector database\nQuestion -> Turn into a vector -> Find the closest chunks -> Give chunks + question to the LLM -> Answer citing the source\n```"),
   TIP("Why vectors?", "An **embedding** turns text into a list of numbers so that **similar meanings sit close together**. “Leave policy” and “holiday rules” land near each other even with no shared words."),
   CHK("In RAG, what does the system search when a user asks a question?", ["The LLM's weights", "A vector database of document chunks", "The internet", "The training logs"], 1, "The query vector is compared with stored chunk vectors."),
 ], "28–33"),
 SEC(5, "clean", "Getting the text ready", [
   T(["Step", "Why", "How"],
     [["**Deduplicate**", "The web repeats itself; duplicates cause memorising", "Hashing (exact), MinHash LSH (near-duplicates)"],
      ["**Detect language**", "Don't answer in the wrong language", "Language classifiers (110+ languages)"],
      ["**Check copyright**", "Models can recite books word for word", "Fuzzy matching, detection tools"],
      ["**Filter toxicity**", "Hateful web text becomes bad behaviour", "Toxicity classifiers, blocklists, safety APIs"],
      ["**Normalise**", "Same thing, same form", "Lowercase, café → cafe, can't → cannot, dates → 2024-01-31"],
      ["**Tokenise**", "Models read tokens, not words", "Word / **subword** (token + ##ization) / character"],
      ["**Tag metadata**", "Know where each piece came from", "Domain, language, quality, version, source, sensitivity"]]),
   CHK("Two crawled pages are identical except for a footer. Which technique catches them?", ["Exact hashing", "Near-duplicate matching (MinHash LSH)", "Tokenisation", "Lowercasing"], 1, "Exact hashing misses small differences; MinHash catches near-duplicates."),
 ], "34–59"),
 SEC(6, "vec", "Embeddings, vector indexes and context", [
   T(["Index", "Simple idea"],
     [["**HNSW**", "A road map linking similar vectors: hop quickly to the nearest"], ["**IVF**", "Sort vectors into neighbourhoods; search only the closest ones"],
      ["**PQ**", "Compress vectors to save memory"], ["**Flat**", "Compare with everything: exact but slow"]]),
   P("**Context engineering** = packing the prompt well: tell the model its **role**, add the user's **history** and **retrieved** facts, and **compress** (summaries, ranking) because the context window is limited (e.g. 128K tokens)."),
 ], "60–65"),
 SEC(7, "arch", "The whole system", [
   P("```flow\nOffline: sources -> ingest -> clean -> tokenize -> chunk -> embed -> vector store\nOnline: question -> retrieve and assemble context -> LLM -> answer\nLoop: logs and thumbs up/down -> human review -> cleaned data back into the offline pipeline\n```"),
   REM("**Offline builds the library, online answers questions, the loop keeps it improving.**"),
 ], "66–76"),
 SEC(8, "cons", "Things that can go wrong (and fixes)", [
   T(["Concern", "Fix"],
     [["Too slow / too big", "Spark, Ray, GPUs; distillation and quantisation for speed"], ["Bad data → hallucinations", "Cleaning, dedup, bias checks, Delta Lake lineage"],
      ["Can't see problems", "Monitor drift, cost, latency (MLflow, LangFuse, Arize)"], ["Privacy / copyright", "Automatic PII redaction and copyright checks"],
      ["Stale vectors", "Regenerate embeddings, refresh indexes"], ["Cost", "Smaller models, caching, planning"]]),
   REM("“**S**mart **Q**ueries **O**ften **G**et **V**ery **L**ow **C**ost”: Scalability, Quality, Observability, Governance, Vector DataOps, Latency, Cost."),
 ], "77–83"),
 SEC(9, "tools", "Tools to recognise", [
   T(["Need", "Tools"],
     [["Connect LLM to data", "LangChain, LlamaIndex"], ["Agents", "AutoGen, CrewAI"], ["Serve models", "vLLM, Ollama (local)"],
      ["Fine-tune", "Hugging Face, Unsloth, DeepSpeed"], ["Vector DB", "Pinecone, Chroma, pgvector"], ["Observe", "LangFuse, Arize"], ["Cloud", "AWS Bedrock, Databricks"]]),
 ], "84–89"),
 SEC(10, "remember", "What to remember for your exam", [
   REM("- **3 pipelines:** data, LLM (inference), LLMOps.\n"
       "- **4 types:** pre-training, fine-tuning, RAG, evaluation & feedback.\n"
       "- **RAG:** chunk → embed → vector DB; question → embed → search → LLM.\n"
       "- **Clean:** dedup, language, copyright, toxicity; normalise; tokenise; tag.\n"
       "- **Indexes:** HNSW, IVF, PQ, flat. **Context:** role, assembly, retrieval, compression.\n"
       "- **Considerations:** SQOGVLC; quantise/distil for latency; redact PII."),
 ]),
]

write("data/dmml/l14.js", INTRO, SECTIONS)
