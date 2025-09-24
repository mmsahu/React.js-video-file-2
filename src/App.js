import React, { useEffect, useState, useRef } from 'react';
import { generatePattern } from './pattern';

export default function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // generate initial pattern
    setGrid(generatePattern(rows, cols, phase));
  }, [rows, cols, phase]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        // advance phase to animate ribbons
        setPhase(p => (p + 1) % Math.max(1, cols + 1));
      }, 600);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, cols]);

  function handleRowsChange(e){
    const val = Math.max(5, Number(e.target.value) || 5);
    setRows(val);
  }
  function handleColsChange(e){
    const val = Math.max(5, Number(e.target.value) || 5);
    setCols(val);
  }

  return (
    <div className="app">
      <h2>Pattern Grid (approx. from uploaded video)</h2>

      <div className="controls">
        <label>Rows: <input type="number" value={rows} min={5} onChange={handleRowsChange} /></label>
        <label>Cols: <input type="number" value={cols} min={5} onChange={handleColsChange} /></label>
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Stop</button>
        <button onClick={() => { setRows(20); setCols(10); setPhase(0); }}>Reset to 20×10</button>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${cols}, var(--cell-size))` }}
      >
        {grid.flat().map((cell, idx) => (
          <div key={idx} className={`cell ${cell.color}`} title={cell.number}>
            {cell.number}
          </div>
        ))}
      </div>

      <div className="note">
        Default grid: 20 × 10. Grid supports min 5 × 5 and is fully dynamic.
        Pattern generation logic is isolated in <code>src/pattern.js</code> (pure functions).
      </div>
    </div>
  );
}
