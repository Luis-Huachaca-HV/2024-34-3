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

// Nueva ruta para análisis batch
app.get('/batch', (req, res) => {
  fs.readFile('batch_results.json', (err, data) => {
    if (err) {
      console.error("❌ Error leyendo batch_results.json:", err.message);
      return res.status(500).send("No se pudo leer el archivo batch");
    }
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      console.error("❌ Error parseando JSON de batch_results.json:", parseErr.message);
      res.status(500).send("Error al parsear resultados batch");
    }
  });
});

server.listen(3001, () => {
  console.log('📡 Backend server running on http://localhost:3001');
});
