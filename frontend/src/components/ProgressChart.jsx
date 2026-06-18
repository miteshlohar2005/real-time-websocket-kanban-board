import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function ProgressChart({ tasks }) {
  const counts = {
    'To Do': 0,
    'In Progress': 0,
    'Done': 0
  };

  tasks.forEach(task => {
    if (counts[task.status] !== undefined) {
      counts[task.status]++;
    }
  });

  const data = [
    { name: 'To Do', count: counts['To Do'], color: '#3b82f6' },
    { name: 'In Progress', count: counts['In Progress'], color: '#f59e0b' },
    { name: 'Done', count: counts['Done'], color: '#10b981' }
  ];

  const total = tasks.length;
  const doneCount = counts['Done'];
  const percentComplete = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="glass-panel chart-container">
      <div className="header" style={{ marginBottom: '1rem' }}>
        <h3>Project Progress</h3>
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
          {percentComplete}% Complete
        </span>
      </div>
      
      <div style={{ height: 250, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
