import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("Think of a restaurant. Groceries arrive at the back door (**ingestion**, Lecture 7). Someone checks they're fresh (**validation**, Lecture 8). "
         "Now the kitchen must **wash, chop, cook and plate** them so customers get a finished dish. That kitchen work on data is **analytics engineering**: "
         "combining sources, cleaning and transforming them in tidy layers, testing the result, writing the recipe down, keeping old versions, and "
         "being able to say where every number came from.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Integrate", "Bring data from every source together into **one trusted view**.", tag="Combine", example="Sales DB + CRM + ad platforms → one customer table"),
     CARD("Transform in layers", "Improve data step by step: **Bronze** (raw) → **Silver** (clean) → **Gold** (ready to use).", tag="Cook", example="dbt: staging → intermediate → marts"),
     CARD("Test, document, version, trace", "Check the logic is right, write it down, keep old copies, and track where data came from.", tag="Trust", example="DVC, lakeFS, Delta Lake; lineage tracker"),
   ),
   P("```flow\nSources -> Integrate -> Transform (Bronze -> Silver -> Gold) -> Test -> Document -> Version + Lineage -> Trusted analytics and ML\n```"),
 ]),
 SEC(2, "integ", "Ingestion vs integration: moving vs cooking", [
   T(["", "Ingestion", "Integration"],
     [["In one word", "**Move**", "**Combine + clean**"],
      ["Restaurant", "Groceries delivered to the kitchen", "Groceries cooked into one meal"],
      ["Improves quality?", "No", "Yes (merge, filter, clean)"],
      ["Complexity", "Simple", "Complex (ETL, metadata, governance)"]]),
   TIP("ETL or ELT?", "**ETL:** cook **before** putting food in the fridge (transform, then load). **ELT:** put everything in the fridge first and cook **inside** the warehouse when needed. Modern cloud warehouses favour **ELT**."),
   P("**Why integration is harder today:** many more sources (apps, IoT, APIs), people want data in **real time**, and everything is moving to the **cloud**. So integration must run **continuously and automatically**, not as a one-time project."),
   CHK("A pipeline copies files from an S3 bucket into the lake every hour, without changing them. This is…", ["Data integration", "Data ingestion", "Data normalization", "Reverse ETL"], 1, "Just moving data is ingestion."),
 ], "4–15"),
 SEC(3, "types", "Seven ways to transform data", [
   T(["Type", "Plain meaning", "Example"],
     [["**Cleaning**", "Fix mistakes", "Remove duplicates, fill blanks, fix typos"],
      ["**Standardization**", "Same units and formats", "lb → kg; one date format"],
      ["**Aggregation**", "Summarise", "Daily sales → monthly"],
      ["**Enrichment**", "Add extra info", "PIN code → city"],
      ["**Integration**", "Merge sources", "CRM + billing"],
      ["**Normalization**", "Remove repetition, one consistent form", "Phone numbers in one format"],
      ["**Filtering**", "Keep only what you need", "Only 2025 orders"]]),
   REM("**“Clean Students Always Eat In Nice Fields”**: Cleaning, Standardization, Aggregation, Enrichment, Integration, Normalization, Filtering."),
   P("**The six-step process** for any transformation:"),
   P("```flow\n1 Discovery: what do I have? -> 2 Mapping: which field goes where? -> 3 Logic: what rules? -> 4 Execution: run it -> 5 Validation: is it right? -> 6 Documentation and monitoring: keep it working\n```"),
   REM("**“Do My Laundry Every Valid Day”**: Discovery, Mapping, Logic, Execution, Validation, Documentation."),
 ], "16–26"),
 SEC(4, "layers", "Layers: Medallion and dbt", [
   P("**Analogy: a water filter with three stages.** Muddy water goes in (Bronze), the first filter removes dirt (Silver), the last makes it drinkable and bottled for customers (Gold). You never throw away the muddy water, because you may need to filter it again."),
   T(["Layer", "What's in it", "Retail example"],
     [["🥉 **Bronze**", "Raw data, exactly as received (+ when it was loaded)", "Raw POS transactions"],
      ["🥈 **Silver**", "Cleaned, de-duplicated, merged: one enterprise view", "One clean `customers` table"],
      ["🥇 **Gold**", "Ready-to-use tables for a specific need", "`monthly_sales_by_store`"],
      ["💎 **Platinum** (some firms)", "Gold + ML predictions", "Customer table with a churn score"]]),
   P("**dbt** (data build tool) does the same with SQL inside the warehouse (ELT):"),
   P("```flow\nLanding (raw copy) -> Staging stg_: rename, cast types -> Intermediate int_: business logic -> Marts dim_ and fact_: ready for BI\n```"),
   T(["dbt layer", "≈ Medallion"], [["Staging", "Bronze"], ["Intermediate", "Silver"], ["Marts", "Gold"]]),
   TIP("Fact vs dimension", "**Fact** = an event with numbers (an order of 2 items worth ₹500). **Dimension** = who/what/when describes it (the customer, the product, the date)."),
   CHK("Which layer would hold `monthly_revenue_by_region`, read directly by a dashboard?", ["Bronze", "Silver", "Gold", "Landing"], 2, "Consumption-ready, project-specific tables live in Gold (marts)."),
 ], "27–38"),
 SEC(5, "test", "Testing: did the recipe come out right?", [
   P("A job can finish with **no errors** and still give **wrong numbers** (GST added twice, a join that drops customers). So we test the **logic**, in three steps:"),
   L("**Schema check:** right columns, right types, NOT NULL / UNIQUE / allowed values, every order's customer exists.",
     "**Contract check:** the producer and consumer agreed on the format; flag breaking changes.",
     "**Logic check:** business rules (“15% VAT only on category X”), compare source vs target, regression (old results unchanged), speed at real volumes.", ordered=True),
   T(["Level", "Tests"], [["Unit", "One rule"], ["Integration", "The whole pipeline end to end"], ["Regression", "Today's output vs yesterday's"]]),
   EX("Lecturer's insurance exercise", "Payouts depend on policy, location and history. Check sample payouts against **manually verified** ones, check **monthly totals**, run new fraud logic **in parallel** with production first. Result: zero payout errors, approvals 20% faster."),
 ], "39–48"),
 SEC(6, "docs", "Writing the recipe down: data-model documentation", [
   T(["Model", "Like…", "Shows"],
     [["**Conceptual**", "An architect's sketch", "Big entities in business words (Customer places Order)"],
      ["**Logical**", "The floor plan", "Entities, attributes, relationships"],
      ["**Physical**", "The construction drawing", "Tables, data types, indexes"]]),
   P("Good documentation means **clarity, easier maintenance, faster onboarding, consistent definitions and better teamwork**. Tools: **dbt** (docs built in), **DataHub** (catalog + lineage + contracts), **Amundsen** (search for data, from Lyft)."),
 ], "49–57"),
 SEC(7, "version", "Data versioning: an undo button for data", [
   P("Code has Git. Data needs the same, because a model is only reproducible if you know **exactly which data** trained it."),
   T(["Why?", "Plain meaning"],
     [["**Riskless testing**", "Try new data; if it's worse, go back"],
      ["**Business performance**", "Compare this year's data with last year's"],
      ["**Audit & compliance**", "Prove what data you had and when (GDPR)"]]),
   T(["How?", "Like…", "Catch"],
     [["**Full copy**", "Photocopying the whole book every day", "Wastes space"],
      ["**valid_from / valid_to**", "Crossing out an old line and writing the new one below, with dates", "Only via query filters"],
      ["**Tools** (Git for data)", "Track changes in Google Docs", "Learning curve"]]),
   P("**Version names:** `3.2.4` = **big change . new feature . small fix**. Tools: **DVC** (Git-based), **lakeFS** (Git branches for a data lake), **Delta Lake** (time travel, ACID), **Dolt** (SQL database you can branch), **Git LFS** (big files as pointers), **Pachyderm**, **Neptune**."),
   REM("Why: **RBA**: Riskless testing, Business performance, Audit. How: **copy → columns → tools**."),
   CHK("A team wants Git-style branches and instant rollback over a petabyte data lake on S3. Best fit?", ["Git LFS", "lakeFS", "Amundsen", "Full duplication"], 1, "lakeFS gives Git-like branching/commits over S3/GCS at petabyte scale."),
 ], "58–80"),
 SEC(8, "lineage", "Lineage: the parcel-tracking page for data", [
   P("**Data lineage** shows the full journey of a value: where it came from, which steps changed it, where it went. It works by **saving metadata at every step**."),
   P("For ML, a **lineage tracker** remembers six things so you can **rebuild any past model exactly**:"),
   P("```flow\nInfrastructure code + Data snapshot + Pipeline code + Feature list + Model code + Container image -> Lineage tracker -> Re-create the model at any point in time\n```"),
   REM("*“If you can't explain the data that trained the model, you can't trust the model.”*"),
 ], "81–89"),
 SEC(9, "remember", "What to remember for your exam", [
   REM("- **Ingestion moves, integration combines + cleans.** ETL = transform first; ELT = load first.\n"
       "- **7 transformations:** Clean, Standardize, Aggregate, Enrich, Integrate, Normalize, Filter.\n"
       "- **6 steps:** Discovery, Mapping, Logic, Execution, Validation, Documentation.\n"
       "- **Bronze raw → Silver clean → Gold ready** (Platinum = + ML). dbt: staging → intermediate → marts.\n"
       "- **Test:** schema → contract → logic; unit / integration / regression.\n"
       "- **Versioning:** why RBA; how copy → columns → tools; DVC, lakeFS, Delta Lake.\n"
       "- **Lineage** = tracking page for data; makes models reproducible."),
 ]),
]

write("data/dmml/l9.js", INTRO, SECTIONS)
