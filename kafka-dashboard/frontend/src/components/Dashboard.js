import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [chartsData, setChartsData] = useState({});
  const chartInstances = useRef({});

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('kafka-message', ({ topic, data }) => {
      const vehicleId = data.vehicle_id;
      if (!vehicleId || typeof data !== 'object') return;

      const chartKey = `${topic}-${vehicleId}`;
      const labels = Object.keys(data).filter(k => k !== 'vehicle_id' && k !== 'time_step');
      const values = labels.map(k => data[k]);

      setChartsData(prev => ({
        ...prev,
        [chartKey]: { labels, values, topic, vehicleId, raw: data }
      }));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    Object.entries(chartsData).forEach(([key, { labels, values, topic, vehicleId, raw }]) => {
      const canvas = document.getElementById(`chart-${key}`);
      if (canvas) {
        if (chartInstances.current[key]) {
          chartInstances.current[key].data.labels = labels;
          chartInstances.current[key].data.datasets[0].data = values;
          chartInstances.current[key].update();
        } else {
          chartInstances.current[key] = new Chart(canvas, {
            type: 'bar',
            data: {
              labels,
              datasets: [{
                label: key,
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
              }]
            },
            options: {
              responsive: true,
              animation: {
                duration: 800,
                easing: 'easeOutQuart'
              },
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }
          });
        }
      }

      // Histograma especial para 459
      if (topic === 'performance-data') {
        const histoKey = `histogram-${vehicleId}`;
        const histoCanvas = document.getElementById(`chart-${histoKey}`);
        const histoLabels = Object.keys(raw).filter(k => k.startsWith('459_'));
        const histoValues = histoLabels.map(k => raw[k]);

        if (histoCanvas) {
          if (chartInstances.current[histoKey]) {
            chartInstances.current[histoKey].data.labels = histoLabels;
            chartInstances.current[histoKey].data.datasets[0].data = histoValues;
            chartInstances.current[histoKey].update();
          } else {
            chartInstances.current[histoKey] = new Chart(histoCanvas, {
              type: 'bar',
              data: {
                labels: histoLabels,
                datasets: [{
                  label: 'Histograma 459',
                  data: histoValues,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)'
                }]
              },
              options: {
                responsive: true,
                animation: {
                  duration: 1000,
                  easing: 'easeOutQuart'
                },
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }
            });
          }
        }
      }
    });
  }, [chartsData]);

  const groupedByVehicle = {};
  Object.entries(chartsData).forEach(([key, chart]) => {
    const { vehicleId } = chart;
    if (!groupedByVehicle[vehicleId]) groupedByVehicle[vehicleId] = [];
    groupedByVehicle[vehicleId].push(
      <div key={key} style={{ width: '300px', height: '200px', margin: '10px' }}>
        <h4>{chart.topic} – Vehículo {vehicleId}</h4>
        <canvas id={`chart-${key}`} />
      </div>
    );
  });

  return (
    <div>
      <h2>Kafka Dashboard</h2>
      {Object.entries(groupedByVehicle).map(([vehicleId, charts]) => (
        <div key={vehicleId} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>Vehículo {vehicleId}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>{charts}</div>
          <div style={{ width: '100%', marginTop: '10px' }}>
            <h4>Histograma 459 – Vehículo {vehicleId}</h4>
            <canvas id={`chart-histogram-${vehicleId}`} style={{ width: '100%', height: '300px' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
