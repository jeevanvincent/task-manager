import React from 'react';

export default function TaskCard({ task, onDelete, onEdit, onStatusChange }) {
  const priorityColors = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="bg-slate-800/70 backdrop-blur-md p-5 rounded-xl border border-slate-700/50 shadow-md border-l-4 border-l-indigo-500 transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-bold text-white text-lg tracking-tight hover:text-cyan-400 transition-colors">
          {task.title}
        </h4>
        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
        {task.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between border-t border-slate-700/50 pt-3 mt-2">
        <select 
          className="bg-slate-900 text-slate-300 text-xs rounded-md p-1 outline-none border border-slate-700/50"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-cyan-400 text-xs font-semibold">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="text-slate-400 hover:text-rose-400 text-xs font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}