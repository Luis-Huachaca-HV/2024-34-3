const express = require('express');
const http = require('http');
const { Kafka } = require('kafkajs');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs'); // ← para leer batch_results.json

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

const kafka = new Kafka({
  clientId: 'dashboard-app',
  brokers: ['localhost:9092']
});

const topics = [
  "motor-data",
  "emissions-data",
  "transmission-data",
  "brakes-data",
  "performance-data",
  "telemetry-data"
];

const consumer = kafka.consumer({ groupId: 'dashboard-group' });

async function startKafkaConsumer() {
  await consumer.connect();
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const value = JSON.parse(message.value.toString());
        io.emit('kafka-message', { topic, data: value });
        console.log(`[${topic}]`, value);
      } catch (err) {
        console.error(`Error parsing message from topic ${topic}`, err.message);
      }
    }
  });
}

startKafkaConsumer().catch(console.error);

app.get('/batch', (req, res) => {
  const hdfsPath = '/bigdata/batch_results/batch_results.json';

  exec(`hdfs dfs -cat ${hdfsPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Error ejecutando HDFS cat:', stderr || err.message);
      return res.status(500).send('Error accediendo al archivo en HDFS');
    }

    try {
      const parsed = JSON.parse(stdout);
      res.json(parsed);
    } catch (parseErr) {
      console.error('❌ Error parseando JSON desde HDFS:', parseErr.message);
      res.status(500).send('Error al parsear resultados batch desde HDFS');
    }
  });
});

server.listen(3001, () => {
  console.log('📡 Backend server running on http://localhost:3001');
});
