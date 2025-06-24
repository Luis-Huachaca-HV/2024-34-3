# motor_producer.py
import pandas as pd
from kafka import KafkaProducer
import json
import time
from utils.feature_groups import motor_cols

KAFKA_TOPIC = 'motor-data'
KAFKA_SERVER = 'localhost:9092'

# Lee el dataset
df = pd.read_csv("data/train_operational_readouts.csv")
cols = ['vehicle_id', 'time_step'] + motor_cols
df_motor = df[cols]

# Configura el productor Kafka
producer = KafkaProducer(
    bootstrap_servers=KAFKA_SERVER,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Envía cada fila como mensaje Kafka
for _, row in df_motor.iterrows():
    message = row.to_dict()
    producer.send(KAFKA_TOPIC, value=message)
    print(f"[✔] Sent to {KAFKA_TOPIC}: {message['vehicle_id']} - {message['time_step']}")
    time.sleep(0.5)  # Simulación tiempo real

producer.flush()
