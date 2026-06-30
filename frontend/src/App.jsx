import React, { useState, useEffect } from 'react';
import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import StatsBar from './components/StatsBar';

// Set the base URL only (without appending routes here)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // 1. Cleaned up the duplicate brackets here
  const fetchTasks = async () => {
    try {
      // Explicitly points to /api/tasks endpoint
      let url = `${API_URL}/api/tasks?search=${search}`;
      if (filterPriority) url += `&priority=${filterPriority}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterPriority]);

  // 2. Added /api/tasks to both PUT and POST methods
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Updated endpoint route for editing
        const res = await fetch(`${API_URL}/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const updated = await res.json();
        setTasks(tasks.map(t => t._id === updated._id ? updated : t));
        setEditingTask(null);
      } else {
        // Updated endpoint route for creating a task
        const res = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
      }
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // 3. Added /api/tasks to the DELETE method
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // 4. Added /api/tasks to the Status Change PUT method
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      setTasks(tasks.map(t => t._id === id ? updated : t));
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto text-slate-100">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            TaskSync Pro
          </h1>
          <p className="text-slate-400 text-sm mt-1">Advanced lifecycle management dashboard</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </header>

      <StatsBar tasks={tasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-1">
          <TaskForm onSave={handleSaveTask} editingTask={editingTask} setEditingTask={setEditingTask} />
        </div>
        <div className="lg:col-span-2">
          <TaskBoard tasks={tasks} onDelete={handleDeleteTask} onEdit={setEditingTask} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}