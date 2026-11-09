import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("A car's dashboard tells you the speed, fuel and engine temperature; a good mechanic can also tell you **why** the engine light came on. Data pipelines "
         "and ML models need both. The dangerous failures are **silent**: the system keeps running but the numbers are old, doubled or quietly wrong. "
         "This lecture teaches how to watch data (the **five pillars**), how to watch models (**drift**, staleness, bad labels), what to measure, when to retrain, "
         "and how to set clear targets (**SLIs, SLOs, SLAs**).")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Watch the data", "Is it fresh, the right amount, the right shape, traceable, normal-looking?", tag="Data observability", example="ETL failed, reports used old data"),
     CARD("Watch the model", "Is it still accurate, or have the world, the rules or the features changed?", tag="ML observability", example="Winter coats recommended in spring"),
     CARD("Close the loop", "Set targets, alert, find the cause, retrain automatically.", tag="Act", example="Retrain when PSI > 0.2"),
   ),
   P("**Why it matters:** data downtime can cost 140K–540K dollars **per hour**; bad data about 12.9 million dollars a year. A facial-recognition error even led to a wrongful arrest."),
 ], "4–9"),
 SEC(2, "mvo", "Monitoring vs observability", [
   T(["", "Monitoring", "Observability"],
     [["Like…", "The dashboard warning light", "The mechanic finding the cause"], ["Answers", "**What** happened?", "**Why**, and where?"],
      ["Style", "Reactive", "Proactive"], ["Finds", "Problems you expected", "Problems you didn't expect"]]),
   P("**Maturity ladder:** L0 monitoring → L1 observability → L2 full-stack (metrics, events, logs, traces) → L3 intelligent (AI finds patterns) → L4 federated (any data, on demand)."),
 ], "10–12"),
 SEC(3, "pillars", "Five pillars, one story", [
   P("**The story:** a complaints system (phone, web, chat, email, post) loads data every night from OLTP to OLAP for reports and models."),
   T(["Pillar", "Question", "What went wrong"],
     [["**Freshness**", "Is it up to date?", "The ETL failed silently; reports used old data"], ["**Volume**", "Right amount?", "Every record loaded **twice**"],
      ["**Schema**", "Same structure?", "A key column changed without warning; 750 reports a year at risk"], ["**Lineage**", "Where does it come from and go?", "An unknown system downstream complained"],
      ["**Distribution**", "Do values look normal?", "A spike turned out to be test data loaded by mistake"]]),
   REM("“**F**resh **V**egetables **S**poil **L**ess **D**aily”: Freshness, Volume, Schema, Lineage, Distribution."),
   T(["", "Data quality", "Data observability"], [["Checks", "The data itself (rules)", "The whole pipeline's health"], ["When", "At rest", "In motion"], ["Style", "Known rules", "Learns what's normal (ML)"]]),
   CHK("Sales numbers suddenly doubled overnight because a loader ran twice. Which pillar catches it?", ["Freshness", "Volume", "Lineage", "Schema"], 1, "Unexpected row counts are a volume problem."),
 ], "13–21"),
 SEC(4, "how", "How we watch: the toolkit", [
   T(["Pattern", "Simple idea"],
     [["**Logs**", "A flight recorder: structured (JSON), with a correlation ID to follow one request"], ["**Traces**", "A parcel's full journey; each stop is a span"],
      ["**Alerts**", "Only when it matters, by severity, linked to on-call"], ["**Dashboards**", "The 4 golden signals: **latency, traffic, errors, saturation**"],
      ["**Anomaly detection**", "Learn normal, flag odd: one value (point), odd for the time (contextual), odd as a group (collective)"]]),
   P("**Observability pipeline:** ingest (limit floods) → transform (filter noise, sample, mask PII) → store (hot recent data, cold old data) → query (access control)."),
   T(["Tool", "For"], [["Monte Carlo / Databand", "Automatic data observability"], ["Soda Core", "Data tests written as code"], ["OpenLineage", "Lineage"], ["OpenTelemetry", "Logs, metrics, traces"]]),
   P("**DataOps cycle:** detect (rule checks) → awareness (shared metadata and lineage across teams) → iterate (data-as-code)."),
 ], "22–49"),
 SEC(5, "ml", "How ML systems fail quietly", [
   P("A translator that returns French in under a second is *operationally* fine, even if the French is **wrong**. That's a silent ML failure."),
   T(["Failure", "Plain meaning", "Example"],
     [["**Data drift**", "The **customers** changed", "Shopping trends shift; winter model in spring"], ["**Concept drift**", "The **rules** changed", "What counts as fraud evolves"],
      ["**Feature staleness**", "The **news is old**", "Cached features; slow joins (fresh data ≠ fresh features)"], ["**Label mismatch**", "The **answer key** is wrong", "Annotator errors, class imbalance"],
      ["**Inference degradation**", "Slowly getting worse", "Old assumptions no longer hold"]]),
   P("**Root causes:** mostly **data** (drift, training-serving skew, quality, labels), then **model design** (overfitting, feedback loops, wrong goal), then **operations** (offline ≠ online, no monitoring)."),
   CHK("Inputs look the same as last year, but what counts as ‘fraud’ has changed. This is…", ["Data drift", "Concept drift", "Feature staleness", "Volume issue"], 1, "The input→target relationship changed."),
 ], "50–73"),
 SEC(6, "measure", "What to measure and when to retrain", [
   T(["Layer", "Examples"], [["Software", "Latency, errors, memory"], ["Data", "% missing, out-of-range, PSI"], ["Model", "Precision, recall, F1, RMSE, calibration, fairness"], ["Business", "Clicks, purchases, approvals"]]),
   F("Rules of thumb (slide 80)", "**PSI** < 0.1 stable · 0.1–0.25 moderate · **> 0.25 act**. Retrain when PSI > 0.2, or F1/accuracy drops 5–10% from the training baseline."),
   P("**Drift tests:** PSI, Kolmogorov–Smirnov, Jensen–Shannon, Wasserstein. **Tools:** **Evidently** (open-source drift reports) and **Arize** (diagnose performance), both linking to MLflow and Airflow."),
 ], "74–83"),
 SEC(7, "slo", "Targets: SLI → SLO → SLA", [
   T(["Term", "Like…", "Example"],
     [["**SLI**", "The thermometer reading", "Duplicate rate; data freshness"], ["**SLO**", "The target temperature", "“99% of pipelines deliver within 1 hour”; “accuracy ≥ 95%”"],
      ["**SLA**", "The promise, with a penalty", "“We'll meet it 90% of the time; if not, …”"]]),
   WARN("Slide arithmetic", "90% over 30 days (720 hours) allows **72 hours** of misses, not the 7.2 hours printed on slide 87 (that would be 99%)."),
   P("```flow\nData checks -> Model monitoring -> Versions and lineage -> Retrain when a trigger fires -> Data checks\n```"),
   P("**LLM observability:** vector drift (RAG context shifting), prompt drift, LLM-as-a-judge for hallucination and safety, full traces of each request."),
 ], "84–89"),
 SEC(8, "remember", "What to remember for your exam", [
   REM("- **Monitoring** = what (light); **observability** = why (mechanic).\n"
       "- **Five pillars:** Freshness, Volume, Schema, Lineage, Distribution.\n"
       "- **Golden signals:** latency, traffic, errors, saturation.\n"
       "- **ML failures:** customers changed (data drift), rules changed (concept drift), old news (staleness), wrong answer key (labels).\n"
       "- **PSI > 0.25 act; retrain at PSI > 0.2 or 5–10% F1 drop.**\n"
       "- **SLI** measure → **SLO** target → **SLA** promise."),
 ]),
]

write("data/dmml/l16.js", INTRO, SECTIONS)
