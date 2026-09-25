"""Recap blocks for each DMML lecture (the ⚡ Recap tab). Inserted into data/dmml/lN.js
as `recap: [...]`, just before `glossary:`. The DMML exam summary imports these.
Run: python3 tools/recaps.py   (idempotent: replaces an existing recap)"""
import json, re

def P(t): return {"type": "p", "text": t}
def H(t): return {"type": "p", "text": f"#### {t}"}
def L(*items): return {"type": "list", "items": list(items)}
def T(head, rows, caption=None):
    b = {"type": "table", "head": head, "rows": rows}
    if caption: b["caption"] = caption
    return b
def D(name, cap): return {"type": "diagram", "name": name, "caption": cap}
def IDEA(t): return {"type": "callout", "kind": "idea", "title": "In one line", "text": t}
def EXAM(t): return {"type": "callout", "kind": "exam", "title": "Exam hook", "text": t}

RECAPS = {
"l1": [
    IDEA("How data is **shaped and stored** decides which questions are easy to ask of it."),
    L("**Data management** = ingest · process · secure · store → better decisions.",
      "ML depends on it for **structure, performance, accuracy, reliability**.",
      "**Formats:** structured (fixed schema) · semi-structured (tags, JSON, email) · unstructured (images, audio)."),
    D("d1-models", "Five data models, each fast at a different question."),
    T(["Model", "Makes easy", "Example"], [
        ["Relational", "joins, SQL; normalise to cut redundancy", "MySQL"],
        ["Hierarchical", "walking a tree", "Windows Registry"],
        ["**Graph**", "**following relationships** (Cypher, Gremlin)", "Neo4j"],
        ["Document", "whole flexible record", "MongoDB"],
        ["Key-value", "fastest lookup by key", "Redis"]]),
    T(["Pair", "Remember"], [
        ["Declarative vs imperative", "say **what** (SQL; optimiser picks how) vs spell out **how**"],
        ["Row vs column store", "row → writes, OLTP · column (Parquet) → reads, OLAP, ML"],
        ["Text vs binary serialization", "CSV/XML/JSON readable · Protobuf/Avro/BSON compact; same schema both ends"],
        ["OLTP vs OLAP", "record transactions · analyse history (roll-up, drill-down, slice/dice, pivot)"]]),
    EXAM("**PYQ Q1:** graph model → relationship-first languages; a 3-hop fraud-ring query is one Cypher line vs a JOIN per hop in SQL."),
],
"l2": [
    IDEA("Data is an **asset** when managed well and a **liability** when exposed or misused. Manage both sides."),
    L("**Asset:** data → value (Netflix). Relevant data is hard to collect.",
      "**Liability:** leaks, misuse, no consent → legal, ethical, reputational harm. PII needs **consent + deletion criteria**.",
      "**Myths:** “more data == better”, “this stuff is easy”."),
    D("d2-liability", "Reduce liability: restrict → pseudonymise → remove the link."),
    L("**ML pipelines** break on **distribution** changes, not just volume or correctness (lost-country example).",
      "**Reliability:** durability · consistency · versioning (time travel) · performance · availability."),
    D("d2-components", "Four components around the data."),
    T(["Component", "Key words"], [
        ["Integration", "ETL → ELT; filter, merge, aggregate"],
        ["Storage", "warehouse (schema) · lake (raw, cheap) · lakehouse (both)"],
        ["Governance", "councils, metadata, taxonomy, roles"],
        ["Security", "access control, encryption, masking, disaster recovery"]]),
    P("**Lifecycle:** creation → ingestion → processing (validate, clean, enrich) → post-processing (store, metadata, visualise) → ML. **Roles:** analyst, engineer, scientist, architect, DBA, BI analyst."),
    EXAM("**PYQ Q2:** value → protect → leverage → mitigate liability → KPI → example (hospital or bank)."),
],
"l3": [
    IDEA("Architecture = the **blueprint**: flexible, reversible decisions made by weighing trade-offs."),
    D("d3-central", "Who controls the data."),
    T(["Style", "Strength", "Weakness", "Industry"], [
        ["Centralised", "governance, consistency", "bottleneck, single point of failure", "banks, hospitals"],
        ["Decentralised", "unit autonomy", "duplication, inconsistent definitions", "insurance"],
        ["**Hybrid**", "central MDM + domain agility", "coordination effort", "telecom"]]),
    T(["Store", "Remember"], [
        ["Warehouse", "facts + dimensions; **star** (fast) vs **snowflake** (compact)"],
        ["Mart", "department slice of the warehouse"],
        ["Lake", "ELT, cheap, any data; risk: swamp, dark data, WORN"],
        ["Lakehouse", "lake + warehouse management + ACID"]]),
    D("d3-lambda", "Lambda = two paths; Kappa = one replayable stream."),
    L("**Mesh** = who owns (domains, data as product, self-serve platform, federated governance).",
      "**Fabric** = how it connects (one integration layer: APIs, CDC, virtualisation).",
      "**Big data 5 Vs:** volume, velocity, variety, veracity, value."),
    EXAM("**PYQ Q3:** compare the 3 styles on integration, security, performance → recommend **hybrid** (central governance + regional stores for data residency) → diagram."),
],
"l4": [
    IDEA("Pipelines move data automatically from where it's made to where it's useful, and they break when sources change."),
    D("d4-modes", "Three ways data moves between programs."),
    L("**Backward** = new code reads old data · **forward** = old code reads new data · rolling upgrades need both.",
      "Services: **REST** (HTTP philosophy) · SOAP (XML, WSDL) · **gRPC** (fast binary). RPC's “looks local” idea is flawed.",
      "Brokers (Kafka): buffer, redeliver, decouple, fan-out; async."),
    T(["", "Traditional stack", "Modern stack"], [
        ["Infra", "on-prem", "cloud-native"], ["Scale", "manual", "elastic"],
        ["Integration", "hand-built", "automated connectors"], ["Design", "monolithic", "modular"],
        ["Analytics", "batch", "real-time"], ["Cost", "upfront", "pay-as-you-go"],
        ["Transform", "ETL", "ELT (dbt)"], ["Users", "IT-dependent", "self-service"]], "PYQ Q4 table"),
    L("**Pipeline** = pull → transform → push. Pains: always under construction, **data drift**, tied to platforms.",
      "Parts: origin, dataflow, storage, processing, destination, workflow, monitoring.",
      "**ETL** for governed/legacy · **ELT** for cloud/ML · batch vs stream · **CDC** for change-by-change replication."),
    EXAM("**PYQ Q4:** reproduce the 8-row TDS vs MDS table, add TDS problems and one tool per MDS layer."),
],
"l5": [
    IDEA("The machinery under pipelines: how data gets in, where it lives, how it's served back, and how it's kept running."),
    L("Lifecycle: source → ingestion → transformation → serving; **storage** underneath.",
      "Ingest (Fivetran) · model in SQL (**dbt**) · orchestrate dependencies (**Airflow**, Kubeflow)."),
    D("d5-storage", "File tree · rewritable blocks · immutable objects."),
    L("**Strong** consistency = always latest (bank balance) · **eventual** = fast, maybe stale (likes).",
      "Also: cache (Redis), HDFS (3× replication), streaming storage (Kafka retention + replay)."),
    D("d5-reverse", "Reverse ETL puts model output back where people work."),
    L("Analytics: business (history) · operational (act now) · embedded (inside the product).",
      "Serve by files, OLAP tables, streams, **query federation** (Trino), notebooks.",
      "ML stack: warehouse → compute → scheduler → architecture → versioning → model ops → features → **model (smallest)**.",
      "Automate: IaC (Terraform), GitOps, retries, self-healing. **DataOps** = DevOps + agile for data.",
      "Secure data **at rest** (encrypt), **in transit** (TLS), **in use** (RBAC)."),
    P("**Experiment → CI** (tests + retrain + registry) **→ CD** (canary, A/B) **→ CT** (recurring retraining). Observability prevents data downtime. **DoorDash:** feature store, aggregators, prediction logs, single-writer model store."),
    EXAM("Not asked last time, so likely: file vs block vs object, strong vs eventual, reverse ETL, CI/CD/CT, DoorDash platform."),
],
"l6": [
    IDEA("ML is a **loop**, not a line: business goal → framing → data → model → deploy → monitor → back again."),
    D("d6-cycle", "The lifecycle loops back on drift."),
    L("**Business goal first**; ask whether ML is even needed.",
      "Machinery: feature store (online/offline), model registry, feedback loops, alarm manager, scheduler, lineage.",
      "Prep: clean, **dedupe before splitting** (leakage), scale, balance, augment; features: create, transform, extract, select."),
    D("d6-drift", "Data drift: inputs move. Concept drift: the rule moves."),
    D("d6-deploy", "Four safe ways to release a model."),
    H("Data engineering pipeline (PYQ Q5)"),
    P("```flow\nIngestion (sources, provenance, backup, privacy, metadata, lock the test set) -> Exploration & validation (profiling, rules, missing ratio) -> Wrangling (reusable scripts, outliers, impute, restructure) -> Splitting (train / validation / test)\n```"),
    L("Three levels: **Data · Model · Code**.",
      "Package: ONNX, PMML, PFA, pickle. Serve: as-service, as-dependency, precompute, on-demand, **federated**.",
      "MLOps = DataOps → ModelOps → DevOps + feedback. Failures: Twitter, Airbnb, Booking.com, Pinterest."),
    EXAM("**PYQ Q5:** draw the 4-step pipeline **first**, list activities under each step, then link it to the Model and Code levels."),
],
"l7": [
    IDEA("Know each source before ingesting it; then guard the front door with contracts and checks."),
    L("Classify sources: batch/real-time · structured/semi/unstructured · raw/derived · internal/external (**Netflix**).",
      "1st / 2nd / 3rd-party data · user-entered (messy) vs system logs (noisy) vs user behaviour (privacy).",
      "Sources: relational, key-value, document, wide-column, search, time-series; REST, GraphQL, **webhooks**, gRPC, sharing, queues, streams."),
    D("d7-queuestream", "Queue forgets; stream keeps and replays."),
    D("d7-partitions", "Same key → same partition → order kept."),
    L("Ingestion = consume → light clean → land. ~90% of time goes on break-fix from **data drift**.",
      "**Data contract** = what · how · how often · who. Plus **lineage** and **governance** (GDPR, DPDPA…).",
      "Batch: time vs size cut · full snapshot vs incremental · bulk migration."),
    D("d7-late", "Events past the watermark are dropped."),
    T(["Streaming concern", "Fix"], [
        ["schema evolution", "schema registry"], ["late data", "watermark cut-off"],
        ["duplicates / order", "idempotent consumers"], ["reprocess", "replay"],
        ["bad events", "dead-letter queue"], ["big messages", "send a pointer"]]),
    EXAM("Not asked last time, so likely: streaming concerns + fixes, CDC (batch vs log-based, read replica), data contracts."),
],
"l8": [
    IDEA("Measure data quality, find bias and leakage, watch for drift, and validate before every training run."),
    L("**10 dimensions:** accuracy, completeness, consistency, timeliness, validity, uniqueness, integrity, lineage, reliability, accessibility.",
      "For ML also: informative, covered, realistic, unbiased, no feedback loop, consistent labels, big enough."),
    D("d8-selection", "Coverage · non-response · sampling bias."),
    L("**Selection bias** = convenient, unrepresentative data: **coverage · non-response · sampling**.",
      "Other biases: omitted variable, reporting, labelling, automation, confirmation…"),
    D("d8-leak", "Only use features known at prediction time."),
    L("**Leakage causes:** target is a function of a feature (GDP) · feature hides the target (“M18-25”) · feature from the future.",
      "**Drift:** schema skew · distribution skew · **concept drift** · training-serving skew (share feature code)."),
    D("d8-psi", "PSI 0.228 = moderate shift."),
    L("**PSI** = Σ(A − E)·ln(A/E): < 0.1 stable, 0.1–0.25 moderate, > 0.25 drift.",
      "Profile once at the start; **validate before every training run** (Great Expectations, Soda, Deequ); shift left to ingestion."),
    EXAM("**PYQ Q6:** define selection bias → 3 sub-types with the survey examples → ML impact → detect → mitigate."),
],
}

for key, blocks in RECAPS.items():
    path = f"data/dmml/{key}.js"
    src = open(path).read()
    js = "  recap: " + json.dumps(blocks, ensure_ascii=False, indent=2).replace("\n", "\n  ") + ",\n\n"
    src = re.sub(r"  recap: \[.*?\n  \],\n\n", "", src, flags=re.S)
    i = src.index("  glossary: [")
    src = src[:i] + js + src[i:]
    open(path, "w").write(src)
print("recaps written:", ", ".join(RECAPS))
