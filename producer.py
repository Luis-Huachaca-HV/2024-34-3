# producer.py
import pandas as pd
from kafka import KafkaProducer
import json
import time
import random
from feature_groups import all_families

KAFKA_SERVER = 'localhost:9092'
DATA_PATH = 'data/train_operational_readouts.csv'

# Carga el dataset
df = pd.read_csv(DATA_PATH)
vehicle_ids = df['vehicle_id'].unique()

# Configura Kafka
producer = KafkaProducer(
    bootstrap_servers=KAFKA_SERVER,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_data(vehicle_id):
    df_vehicle = df[df['vehicle_id'] == vehicle_id]
    for _, row in df_vehicle.iterrows():
        base = {'vehicle_id': int(row['vehicle_id']), 'time_step': float(row['time_step'])}

        for topic, columns in all_families.items():
            data = base.copy()
            for col in columns:
                if col in row:
                    data[col] = float(row[col])
            producer.send(topic, value=data)
            print(f"[{vehicle_id}] Sent to {topic} at t={data['time_step']}")
        time.sleep(0.5)  # simula tiempo real

    producer.flush()
