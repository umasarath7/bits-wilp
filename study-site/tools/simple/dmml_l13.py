import sys; sys.path.insert(0, "tools")
from simple_lib import *

INTRO = ("One person can't move a mountain of sand with a spoon, but a thousand people with buckets can. That's the whole idea of this lecture. When data is too big "
         "for one computer, we **split it across many machines** (HDFS), **work on all the pieces at once** (MapReduce), **keep the busy pieces in fast memory** (Spark), "
         "and **handle new data the moment it arrives** (streaming with Flink). Then we compare the cloud platforms that do all this for you, and decide when ML needs "
         "batch and when it needs streaming.")

SECTIONS = [
 SEC(1, "big", "The big picture", [
   CARDS(
     CARD("Store it in pieces", "HDFS cuts files into blocks, spreads them over many machines and keeps 3 copies.", tag="Distributed storage", example="A country's phone book split by surname"),
     CARD("Process pieces together", "MapReduce: map → shuffle → reduce, all in parallel.", tag="Parallel processing", example="Max temperature per city"),
     CARD("Faster and live", "Spark keeps data in memory; Flink processes each event in milliseconds.", tag="In-memory + streaming", example="Real-time fraud detection"),
   ),
 ]),
 SEC(2, "vs", "Big data and its 5 V's", [
   T(["V", "Plain meaning", "Example"],
     [["**Volume**", "How much", "Petabytes of transactions"], ["**Velocity**", "How fast it arrives", "Stock trades every millisecond"],
      ["**Variety**", "How many kinds", "Tables, JSON, images, video"], ["**Veracity**", "How trustworthy", "Noisy sensor readings"], ["**Value**", "How useful", "Better pricing decisions"]]),
   P("**Big shift:** instead of bringing data to the analysis, big data **moves the analysis to the data**, uses **ELT**, and **distributed** computing."),
   P("**Real examples:** Amazon (recommendations, dynamic pricing, fraud), Ginger.io (predicts mental-health episodes from phone habits), KIA (sensor data for predictive maintenance)."),
   WARN("Not a replacement", "Big-data analytics doesn't replace databases or warehouses, and isn't just about size."),
   P("**Challenges:** clear goals, huge volumes, integration and quality, infrastructure, skilled people, privacy and compliance."),
 ], "4–25"),
 SEC(3, "dp", "Distributed vs parallel", [
   T(["", "Parallel", "Distributed"],
     [["Picture", "Many cooks in **one kitchen**, one shared fridge", "Many **kitchens in different buildings**, talking by phone"],
      ["Memory", "Shared", "Each has its own"], ["Talk speed", "Very fast (nanoseconds)", "Slower (milliseconds)"],
      ["Grow by", "Bigger machine (up)", "More machines (out)"], ["If one fails", "Everything stops", "Others carry on"]]),
   CHK("Which design keeps working when one machine dies?", ["Parallel system", "Distributed system", "Single server", "Shared-memory system"], 1, "Distributed systems reassign the work to other nodes."),
 ], "26–35"),
 SEC(4, "mem", "Disk vs memory", [
   P("**Disk-based:** a chef walking to the **basement storeroom** for every ingredient (milliseconds). **In-memory:** the ingredients sit in a **pantry next to the stove** (microseconds). Cheaper RAM made in-memory computing practical."),
 ], "36–39"),
 SEC(5, "hadoop", "The Hadoop family", [
   T(["Job", "Tool"],
     [["Store files", "**HDFS**"], ["Manage resources", "**YARN**"], ["Process", "**MapReduce**, **Spark**"], ["Query", "**Hive** (SQL), Drill, Pig"],
      ["NoSQL database", "**HBase**"], ["Bring data in", "**Flume** (logs), **Sqoop** (from SQL databases)"], ["Stream", "**Kafka**, Storm"],
      ["ML", "MLlib, Mahout"], ["Coordinate / schedule / manage", "ZooKeeper, Oozie, Ambari"]]),
 ], "40–45"),
 SEC(6, "hdfs", "HDFS: one file, many machines", [
   P("```flow\nBig file -> Cut into blocks -> Spread across DataNodes -> Copy each block to 2 more nodes -> NameNode keeps the map\n```"),
   T(["Part", "Like…"], [["**NameNode**", "A librarian's catalogue: knows which shelf holds each chapter"], ["**DataNodes**", "The shelves that hold the chapters"]]),
   P("Three copies mean a dead server loses nothing, and work can run on whichever machine already holds the data (**data locality**)."),
 ], "46–49"),
 SEC(7, "mr", "MapReduce: sort the laundry, then fold", [
   P("```flow\nInput files -> Split -> Map: label each item -> Shuffle: one pile per label -> Reduce: process each pile -> Result\n```"),
   EX("Lecturer's example: hottest day per city", "Map turns each record into a pair like ⟨Tokyo, 37⟩. Shuffle sends every Tokyo pair to one reducer, every London pair to another. Each reducer keeps the maximum."),
   ANS("Tokyo 38 · London 27 · New York 33 · Toronto 32", "A 10-hour single-machine job could take about an hour split into 10 parallel tasks."),
   CHK("Which step makes sure all values for ‘London’ end up in the same place?", ["Split", "Map", "Shuffle", "Reduce"], 2, "Shuffling groups pairs by key."),
 ], "50–56"),
 SEC(8, "spark", "Spark: keep it in memory", [
   P("MapReduce writes to disk after every step, which is slow when ML reads the same data again and again. **Spark** loads data into memory **once** and reuses it, for fast **repeated queries** and **iterative training**."),
   T(["Spark word", "Simple meaning"],
     [["**RDD / DataFrame**", "Data split into fault-tolerant pieces / the same with column names"], ["**Lazy + DAG**", "Writes down the plan first, runs it all when you ask for a result"],
      ["**Driver**", "The boss (your program)"], ["**Cluster manager**", "Hands out the work"], ["**Workers**", "Do the work and cache data"]]),
   P("Library family: **Core**, **Streaming**, **MLlib**, **SQL**, **GraphX**."),
 ], "57–68"),
 SEC(9, "frameworks", "Modern frameworks in one line each", [
   T(["Framework", "Remember it as…"],
     [["**Spark**", "Big batches; streams as tiny batches (seconds)"], ["**Structured Streaming**", "Your batch code, now running as a stream"],
      ["**Flink**", "True streaming, one event at a time, milliseconds, exactly-once"], ["**Ray**", "Python ML at scale (tasks, objects, actors)"],
      ["**Dask**", "Pandas and NumPy, but on many machines"]]),
   T(["Cloud platform", "Big idea", "Best for"],
     [["**Snowflake**", "Storage and compute scale separately; multi-cloud", "BI, self-service analytics, data sharing"],
      ["**BigQuery**", "Serverless; pay per query; ML in SQL", "Google Cloud users; huge ad-hoc queries"],
      ["**Databricks**", "Lakehouse (Spark + Delta Lake)", "Data engineering + ML on any data"]]),
   CHK("A bank must flag fraud within milliseconds, event by event. Best engine?", ["Batch MapReduce", "Apache Flink", "Hive", "Dask"], 1, "Flink is streaming-first with millisecond latency."),
 ], "69–87"),
 SEC(10, "bs", "Batch or streaming for ML?", [
   T(["Ask", "If yes…"], [["Does the data lose value within minutes?", "Streaming"], ["Is budget tight?", "Batch (cheaper)"]]),
   T(["", "Batch", "Streaming"],
     [["Training", "First model on years of history", "Keep updating on fresh data"], ["Prediction", "Nightly / monthly scoring of everyone", "Instant: fraud, live recommendations"]]),
 ], "88–93"),
 SEC(11, "remember", "What to remember for your exam", [
   REM("- **5 V's:** Volume, Velocity, Variety, Veracity, Value.\n"
       "- **Parallel** = one kitchen; **distributed** = many kitchens.\n"
       "- **HDFS:** NameNode (map) + DataNodes (blocks), 3 copies.\n"
       "- **MapReduce:** split → map → shuffle → reduce.\n"
       "- **Spark:** in memory, lazy DAG, driver → manager → workers.\n"
       "- **Flink** = true streaming; **Ray** = Python ML; **Dask** = big Pandas.\n"
       "- **Snowflake / BigQuery / Databricks** = split storage-compute / serverless / lakehouse.\n"
       "- **ML:** batch for history and bulk; streaming for live."),
 ]),
]

write("data/dmml/l13.js", INTRO, SECTIONS)
