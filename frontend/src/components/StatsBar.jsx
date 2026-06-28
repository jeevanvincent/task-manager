import React from 'react';

export default function StatsBar({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-center">
        <span className="text-xs text-slate-400 block font-medium">Total Tasks</span>
        <span className="text-2xl font-black text-white">{total}</span>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-center">
        <span className="text-xs text-slate-400 block font-medium">In Progress</span>
        <span className="text-2xl font-black text-amber-400">{inProgress}</span>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-center">
        <span className="text-xs text-slate-400 block font-medium">Completed</span>
        <span className="text-2xl font-black text-emerald-400">{done}</span>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-center">
        <span className="text-xs text-slate-400 block font-medium">Efficiency</span>
        <span className="text-2xl font-black text-cyan-400">{completionPercentage}%</span>
      </div>
    </div>
  );
}