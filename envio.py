import pandas as pd
import simplejson as json
import time
import threading
from kafka import KafkaProducer

# Configuración del productor Kafka
producer = KafkaProducer(
    bootstrap_servers=["54.159.147.252:9092"],
    value_serializer=lambda v: json.dumps(v, ignore_nan=True).encode('utf-8')
)

TOPIC_GROUPS = {
    "motor-data": ['171_0', '666_0', '427_0'],
    "emissions-data": ['837_0'] + [f'167_{i}' for i in range(10)],
    "transmission-data": [f'272_{i}' for i in range(10)] + [f'291_{i}' for i in range(11)],
    "brakes-data": ['370_0'] + [f'158_{i}' for i in range(10)],
    "performance-data": ['309_0', '835_0'] + [f'459_{i}' for i in range(20)],
    "telemetry-data": ['100_0'] + [f'397_{i}' for i in range(36)],
}

# Cargar datos
df = pd.read_csv("data/train_operational_readouts.csv")
vehicle_ids = df['vehicle_id'].unique()[:10]

def simulate_vehicle(vehicle_id):
    while True:
        vehicle_data = df[df['vehicle_id'] == vehicle_id]
        for _, row in vehicle_data.iterrows():
            for topic, columns in TOPIC_GROUPS.items():
                data_payload = {
                    col: (None if pd.isna(row[col]) else row[col])
                    for col in columns if col in row
                }
                data_payload["vehicle_id"] = int(row["vehicle_id"])
                data_payload["time_step"] = row["time_step"]

                print(f"[{topic}] Vehículo {vehicle_id} ➜", json.dumps(data_payload, ignore_nan=True))
                producer.send(topic, data_payload)

            time.sleep(1)  # ⏱️ Más lento: 1 segundo por paso de tiempo

try:
    threads = []
    for vehicle_id in vehicle_ids:
        t = threading.Thread(target=simulate_vehicle, args=(vehicle_id,))
        t.daemon = True  # ⬅️ Para que se cierren bien al hacer Ctrl+C
        t.start()
        threads.append(t)

    # Espera infinita
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\n⛔ Envío detenido por el usuario con Ctrl+C.")

finally:
    producer.flush()
    print("✅ Productor Kafka cerrado.")
