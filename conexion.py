from kafka import KafkaProducer

import json


producer = KafkaProducer(
	bootstrap_servers=["3.86.225.150:9092"],
	value_serializer=lambda v: json.dumps(v).encode('utf-8')


)

producer.send('test',{'msg': 'Hello from outside EC2'})

producer.flush()
