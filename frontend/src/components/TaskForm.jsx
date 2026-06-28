import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSave, editingTask, setEditingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Todo');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!title.trim()) formErrors.title = "Task Title is required.";
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSave({ title, description, priority, status });
    setTitle('');
    setDescription('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col gap-4 sticky top-6">
      <h3 className="text-xl font-bold text-white mb-2">
        {editingTask ? '📝 Edit Task' : '✨ Create Task'}
      </h3>
      
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">TASK TITLE</label>
        <input 
          type="text" 
          className={`w-full bg-slate-900/50 text-white rounded-xl p-3 border ${errors.title ? 'border-red-500' : 'border-slate-700'} focus:outline-none`}
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if(errors.title) setErrors({});
          }}
        />
        {errors.title && <span className="text-xs text-red-400 mt-1 block">{errors.title}</span>}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">DESCRIPTION</label>
        <textarea 
          className="w-full bg-slate-900/50 text-white rounded-xl p-3 border border-slate-700 focus:outline-none h-24 resize-none"
          placeholder="Provide context details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">PRIORITY</label>
          <select 
            className="w-full bg-slate-900 text-white rounded-xl p-3 border border-slate-700 focus:outline-none"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">STATUS</label>
          <select 
            className="w-full bg-slate-900 text-white rounded-xl p-3 border border-slate-700 focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl mt-2 hover:opacity-90 transition-all cursor-pointer">
        {editingTask ? 'Update Task' : 'Save Task'}
      </button>

      {editingTask && (
        <button type="button" onClick={() => setEditingTask(null)} className="text-xs text-slate-400 hover:text-white underline mt-1">
          Cancel Edit
        </button>
      )}
    </form>
  );
}