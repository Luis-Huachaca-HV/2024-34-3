# batch_analysis.py
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, mean, stddev

spark = SparkSession.builder.appName("ScaniaBatchAnalysis").getOrCreate()

df = spark.read.json("hdfs://localhost:9000/user/hadoop/scan_data/performance-data/*.json")
df = df.selectExpr("data.vehicle_id as vehicle_id", *[
    f"data.`459_{i}` as `459_{i}`" for i in range(20)
])

# Calcular media y std para cada variable
for i in range(20):
    stat = df.select(mean(col(f'459_{i}')).alias('mean'), stddev(col(f'459_{i}')).alias('std')).collect()
    print(f"459_{i}: mean={stat[0]['mean']:.2f}, std={stat[0]['std']:.2f}")
