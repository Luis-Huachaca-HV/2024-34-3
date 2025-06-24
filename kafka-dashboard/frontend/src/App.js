import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import BatchDashboard from './components/BatchDashboard';

function App() {
  const [showBatch, setShowBatch] = useState(false);

  return (
    <div className="App">
      <h1>Kafka Dashboard</h1>
      <button onClick={() => setShowBatch(prev => !prev)}>
        {showBatch ? "🔁 Ver Streaming" : "📊 Ver Batch"}
      </button>
      {showBatch ? <BatchDashboard /> : <Dashboard />}
    </div>
  );
}

export default App;
