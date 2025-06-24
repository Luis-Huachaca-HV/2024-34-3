import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const BatchDashboard = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const chartInstances = useRef({});

  useEffect(() => {
    fetch('http://localhost:3001/batch')
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      data.slice(0, visibleCount).forEach(item => {
        const batchKey = `batch-${item.vehicle_id}`;
        const canvas = document.getElementById(`chart-batch-${item.vehicle_id}`);
        if (!canvas) return;

        const labels = Object.keys(item).filter(k => k.startsWith("459_"));
        const values = labels.map(k => item[k]);

        if (chartInstances.current[batchKey]) {
          chartInstances.current[batchKey].data.labels = labels;
          chartInstances.current[batchKey].data.datasets[0].data = values;
          chartInstances.current[batchKey].update();
        } else {
          chartInstances.current[batchKey] = new Chart(canvas, {
            type: 'bar',
            data: {
              labels,
              datasets: [{
                label: 'Promedio Batch 459',
                data: values,
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
              }]
            },
            options: {
              responsive: true,
              animation: { duration: 800, easing: 'easeOutQuart' },
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }
          });
        }
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [data, visibleCount]);  // 👈 Se actualiza si cambia el límite

  return (
    <div>
      <h2>Análisis Batch: Promedio variables 459 por vehículo</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data.slice(0, visibleCount).map(vehicle => (
          <div key={vehicle.vehicle_id} style={{ width: '400px', margin: '10px' }}>
            <h4>Vehículo {vehicle.vehicle_id}</h4>
            <canvas
              id={`chart-batch-${vehicle.vehicle_id}`}
              style={{ width: '100%', height: '300px' }}
            />
          </div>
        ))}
      </div>

      {visibleCount < data.length && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button onClick={() => setVisibleCount(prev => prev + 5)}>
            Ver más vehículos
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchDashboard;
