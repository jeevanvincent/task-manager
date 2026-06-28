import React from 'react';
import TaskCard from './TaskCard';

export default function TaskBoard({ tasks, onDelete, onEdit, onStatusChange }) {
  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map(column => {
        const filteredTasks = tasks.filter(task => task.status === column);
        return (
          <div key={column} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800 min-h-[500px]">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="font-bold text-slate-300 text-base tracking-wide uppercase">{column}</h2>
              <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full font-bold">
                {filteredTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-600 border border-dashed border-slate-800 rounded-xl">
                  No tasks here
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard key={task._id} task={task} onDelete={onDelete} onEdit={onEdit} onStatusChange={onStatusChange} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}