from pyspark.sql import SparkSession
from pyspark.sql.functions import mean
import os

# Configuraciones clave para evitar errores de bind
spark = SparkSession.builder \
    .appName("BatchAnalysis") \
    .config("spark.driver.bindAddress", "127.0.0.1") \
    .config("spark.ui.port", "4069") \
    .config("spark.port.maxRetries", "100") \
    .config("spark.driver.host", "127.0.0.1") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000") \
    .getOrCreate()

# Cargar CSV desde local
df = spark.read.option("header", True).option("inferSchema", True).csv("data/train_operational_readouts.csv")

# Filtrar columnas 459
columns_459 = [f"459_{i}" for i in range(20)]
df_459 = df.select(["vehicle_id"] + columns_459)

# Calcular promedios por vehículo
batch_result = df_459.groupBy("vehicle_id").agg(
    *[mean(c).alias(c) for c in columns_459]
)

# Escribir en HDFS como JSON (puedes cambiar a .csv si lo prefieres)
batch_result.write.mode("overwrite").json("hdfs://localhost:9000/bigdata/batch_results")
print("✅ Resultados batch guardados en HDFS en /bigdata/batch_results")
