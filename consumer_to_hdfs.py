# consumer_to_hdfs.py
from kafka import KafkaConsumer
from hdfs import InsecureClient
import json
import time

topics = [
    "motor-data",
    "emissions-data",
    "transmission-data",
    "brakes-data",
    "performance-data",
    "telemetry-data"
]

consumer = KafkaConsumer(
    *topics,
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='hdfs-writer'
)

# Conéctate a tu HDFS
client = InsecureClient('http://localhost:9870', user='hadoop')

# Ruta base para los archivos
hdfs_base_path = '/user/hadoop/scan_data'

buffer = []

try:
    for message in consumer:
        buffer.append(json.dumps({
            "topic": message.topic,
            "data": message.value
        }))

        # cada 100 mensajes, guardamos en un archivo batch
        if len(buffer) >= 100:
            filename = f"{hdfs_base_path}/{message.topic}/{int(time.time())}.json"
            client.write(filename, data="\n".join(buffer), encoding='utf-8')
            print(f"Escribiendo {len(buffer)} registros en {filename}")
            buffer.clear()

except KeyboardInterrupt:
    print("Finalizando")
