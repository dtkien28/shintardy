"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical, Calendar, Clock, Trash2 } from "lucide-react";
import api from "@/lib/api";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in-progress" | "done";

interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: Priority;
  status: Status;
}

export default function KanbanBoard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState<Status | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data.data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("todoId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Status) => {
    const todoId = e.dataTransfer.getData("todoId");
    if (!todoId) return;

    const todo = todos.find(t => t.id === todoId);
    if (!todo || todo.status === newStatus) return;

    // Optimistic update
    setTodos(prev => prev.map(t => t.id === todoId ? { ...t, status: newStatus } : t));

    try {
      await api.put(`/todos/${todoId}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchTodos(); // Revert on failure
    }
  };

  const addTask = async (status: Status) => {
    if (!newTaskTitle.trim()) {
      setIsAdding(null);
      return;
    }

    try {
      const res = await api.post("/todos", {
        title: newTaskTitle,
        status,
        priority: "medium"
      });
      setTodos(prev => [...prev, res.data.data]);
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setIsAdding(null);
      setNewTaskTitle("");
    }
  };

  const deleteTask = async (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      console.error("Failed to delete task", error);
      fetchTodos();
    }
  };

  const columns: { id: Status, title: string, color: string }[] = [
    { id: "todo", title: "📝 Cần làm", color: "bg-zinc-800/50 border-zinc-700/50" },
    { id: "in-progress", title: "🔥 Đang làm", color: "bg-blue-900/20 border-blue-800/30" },
    { id: "done", title: "✅ Hoàn thành", color: "bg-emerald-900/20 border-emerald-800/30" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bảng Công Việc</h1>
        <p className="text-muted-foreground">Quản lý nhiệm vụ kéo thả theo phương pháp Kanban</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-start h-[calc(100vh-250px)] min-h-[500px]">
          {columns.map(col => (
            <div 
              key={col.id}
              className={`flex-1 w-full flex flex-col rounded-3xl border backdrop-blur-md p-4 h-full overflow-hidden ${col.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-lg">{col.title}</h3>
                <span className="text-sm font-medium bg-black/30 px-2.5 py-1 rounded-full">
                  {todos.filter(t => t.status === col.id).length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                <AnimatePresence>
                  {todos.filter(t => t.status === col.id).map(todo => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={todo.id}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, todo.id)}
                      className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/20 cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`font-medium ${todo.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.title}
                        </h4>
                        <button 
                          onClick={() => deleteTask(todo.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {todo.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{todo.description}</p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          todo.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          todo.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {todo.priority}
                        </div>
                        {todo.due_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{new Date(todo.due_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isAdding === col.id ? (
                  <div className="glass-panel p-3 rounded-2xl border border-primary/50">
                    <input 
                      autoFocus
                      type="text"
                      className="w-full bg-transparent outline-none text-sm font-medium mb-3"
                      placeholder="Nhập tên công việc..."
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTask(col.id)}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsAdding(null)} className="text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 text-muted-foreground">Hủy</button>
                      <button onClick={() => addTask(col.id)} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-medium shadow-md">Thêm</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAdding(col.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/10 hover:border-white/30 text-muted-foreground hover:text-white transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> Thêm việc
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
