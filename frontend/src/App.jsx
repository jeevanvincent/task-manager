import React, { useState, useEffect } from 'react';
import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import StatsBar from './components/StatsBar';
import Auth from './components/Auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  // Read the token from localStorage on initialization so users stay logged in
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Function to save token state
  const handleAuthSuccess = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  // Function to clear session data on logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  const fetchTasks = async () => {
    if (!token) return;
    try {
      let url = `${API_URL}/api/tasks?search=${search}`;
      if (filterPriority) url += `&priority=${filterPriority}`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` } // 🔐 Added Authentication Header
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filterPriority, token]);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await fetch(`${API_URL}/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 🔐 Added Authentication Header
          },
          body: JSON.stringify(taskData)
        });
        const updated = await res.json();
        setTasks(tasks.map(t => t._id === updated._id ? updated : t));
        setEditingTask(null);
      } else {
        const res = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 🔐 Added Authentication Header
          },
          body: JSON.stringify(taskData)
        });
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
      }
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` } // 🔐 Added Authentication Header
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🔐 Added Authentication Header
        },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      setTasks(tasks.map(t => t._id === id ? updated : t));
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // 🚪 IF NO USER SESSION TOKEN, INTERCEPT AND SHOW LOGIN WINDOW
  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto text-slate-100">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            TaskSync Pro
          </h1>
          <p className="text-slate-400 text-sm mt-1">Advanced multi-user cloud dashboard</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto items-center">
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
          
          {/* Logout Trigger Button */}
          <button 
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-900 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
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