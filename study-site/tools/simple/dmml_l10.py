import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Picture an orchestra. Fifty musicians, each excellent, but without a **conductor** they'd start at different times and drown each other out. "
         "A company's data pipelines are the musicians: extract here, transform there, train a model, send a report. **Orchestration** is the conductor: "
         "it decides **what runs, in which order, at what time, and what to do when something goes wrong**. Airflow is the most famous conductor.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Why", "By hand, 5 pipelines are fine; 500 are chaos: forgotten steps, wrong order, no record, messy fixes.", tag="The problem", example="Reports every day + ML every 30 minutes"),
     CARD("What", "A **DAG**: boxes (tasks) joined by one-way arrows (dependencies), with no loops.", tag="The plan", example="ingest → validate → transform → train → deploy"),
     CARD("How", "An orchestrator (Airflow, Prefect, Dagster…) schedules, runs, retries, logs and alerts.", tag="The conductor", example="Netflix runs thousands of tasks on Airflow"),
   ),
 ]),
 SEC(2, "why", "Why manual pipelines break", [
   T(["Problem", "Everyday picture"],
     [["**Time**", "One person can't press 500 buttons every morning"],
      ["**Dependencies**", "“Run C only after A and B finish”: someone always forgets"],
      ["**Compliance gaps**", "No record of who ran what, when, with which settings"],
      ["**Error recovery**", "Each person fixes failures their own way"]]),
   REM("Manual pipelines fail on **T-D-C-E**: Time, Dependencies, Compliance, Error recovery."),
   P("Orchestration fixes this and gives **Efficiency, Reliability, Scalability, Flexibility and Monitoring**."),
 ], "4–12"),
 SEC(3, "words", "Similar words, different meanings", [
   T(["Pair", "Simple difference"],
     [["**Orchestration vs choreography**", "Orchestra with a **conductor** vs dancers **reacting to each other** (no central control, harder to debug)"],
      ["**Automation vs orchestration**", "One machine doing **one task** (password reset) vs a manager **connecting many tasks** into a full process (access request: check → update → notify → confirm)"],
      ["**Data pipeline vs workflow**", "Pipeline **moves and transforms data**; workflow is the **whole process**, including decisions and human approvals"]]),
   CHK("Services A, B, C, D call each other directly, with no central controller. This is…", ["Orchestration", "Choreography", "Automation", "A DAG"], 1, "No conductor, point-to-point calls: choreography."),
 ], "13–21"),
 SEC(4, "dag", "The DAG: a recipe card for the conductor", [
   P("**D**irected: arrows have one direction, so the order is clear. **A**cyclic: no going round in circles (else the pipeline never ends). **G**raph: boxes and arrows."),
   P("```flow\nIngest orders -> Validate -> Transform -> Train model -> Deploy\nIngest customers -> Validate\n```"),
   T(["Part", "Job", "Analogy"],
     [["**Task / operator**", "Does one piece of work", "A musician playing"],
      ["**Sensor**", "**Waits** for a file, time or event", "A musician waiting for the cue"],
      ["**Scheduler**", "Decides **when** each task may start", "The conductor's baton"],
      ["**Executor**", "Actually **runs** the task", "The hands on the instrument"],
      ["**Retries, SLA, logs**", "Try again, deadline, written record", "Second take, concert time, recording"]]),
   REM("**Scheduler decides when, executor runs it, sensor waits, operator does.**"),
   CHK("Task 1 → Task 2 → Task 4 → Task 1. What's wrong?", ["Nothing", "It is cyclic, so it would loop forever", "It is undirected", "It has too few tasks"], 1, "A DAG must be acyclic."),
 ], "22–31"),
 SEC(5, "tools", "Which conductor? The tools", [
   T(["Tool", "Remember it as…"],
     [["**Airflow**", "The classic: Python DAGs for ETL (Netflix)"],
      ["**Prefect**", "Modern Python, cloud-friendly, live monitoring"],
      ["**Dagster**", "The quality inspector: type-safe, lineage (healthcare)"],
      ["**Argo**", "Every task is a **container** on Kubernetes"],
      ["**Kubeflow**", "Built for the **ML** lifecycle on Kubernetes"]]),
   P("**Kinds of tool:** operator-native (task templates) vs container-native (each task a container); open source (you run it) vs managed (Astronomer, Cloud Composer); data-specific vs general-purpose (AWS Step Functions)."),
 ], "32–42"),
 SEC(6, "design", "Designing a workflow", [
   P("```flow\nTrigger: new file or 1 AM -> Ingest -> Validate -> Transform -> Train -> Deploy only if better than current model\nValidate fails -> Alert -> Stop\n```"),
   P("**Commonly forgotten pieces:** a logger, continuous monitoring, resource allocation and security."),
   EX("Lecturer's AWS case study", "Managed Airflow (**MWAA**) runs three notebooks: clean **weather** data → clean **taxi** rides and join with weather → train a model predicting **taxi fares** from rain and distance."),
 ], "43–50"),
 SEC(7, "dataops", "Orchestration in DataOps", [
   P("```flow\nCI/CD: what should change -> Orchestration: when and in what order -> Automation: runs it -> Observability: what happened and why\n```"),
   P("Good orchestration observability knows the difference between a **hiccup that was retried** and a **failure that stopped the run**, finds the **root cause** fast, and can **block bad data** from moving on."),
 ], "51–58"),
 SEC(8, "golden", "The golden rule: idempotent and atomic", [
   T(["Word", "Simple meaning", "Example"],
     [["**Idempotent**", "Doing it twice = doing it once", "Light switch **ON** (not the “volume +1” button). Overwrite today's partition instead of appending"],
      ["**Atomic**", "All or nothing, never half-done", "Copy the file **first**, delete the original **only after** the copy works"]]),
   P("Why? Pipelines fail and get **retried**. If tasks are idempotent and atomic, a retry never creates duplicates or loses data."),
   T(["Other habits", ""],
     [["One DAG per business goal", "no “monster DAG”"], ["Clear names", "`transfer_s3_to_redshift`, not `task_1`"], ["No hard-coded values", "use variables and connections"],
      ["Useful logs and alerts", "what failed, on which data, link to the log"], ["DAGs in Git, tested", "pytest, CI before merge"]]),
   CHK("A load task appends rows; after a retry, totals double. The task is not…", ["atomic", "idempotent", "directed", "scheduled"], 1, "Running it twice changed the result."),
 ], "60–75"),
 SEC(9, "remember", "What to remember for your exam", [
   REM("- **Why:** manual fails on T-D-C-E.\n"
       "- **Orchestration** = conductor; **choreography** = dancers; **automation** = one task.\n"
       "- **DAG** = directed + acyclic; nodes = tasks, edges = dependencies.\n"
       "- **Operator** does, **sensor** waits, **scheduler** when, **executor** runs; retries, SLAs, logs.\n"
       "- **Tools:** Airflow, Prefect, Dagster, Argo, Kubeflow.\n"
       "- **Golden rule:** idempotent (light switch) + atomic (copy, then delete)."),
 ]),
]

write("data/dmml/l10.js", INTRO, SECTIONS)
