"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MoreHorizontal,
  Plus
} from "lucide-react";

// Types
interface Schedule {
  id: string;
  subject_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location?: string;
}

interface Todo {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, todosRes] = await Promise.all([
          api.get("/schedules"),
          api.get("/todos")
        ]);
        
        // Only show today's schedule for dashboard (simplified for now)
        setSchedules(schedulesRes.data.data.slice(0, 3)); 
        
        // Show pending todos
        setTodos(todosRes.data.data.filter((t: Todo) => t.status !== 'done').slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const today = new Date().getDay();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {getGreeting()}, <span className="text-gradient">{user?.full_name?.split(' ').pop() || 'Bạn'}</span> 👋
          </h1>
          <p className="text-muted-foreground">
            Hôm nay là {dayNames[today]}, hãy bắt đầu một ngày học tập thật hiệu quả nhé.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium">
            <Plus size={16} />
            <span>Thêm Task</span>
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/25">
            <Plus size={16} />
            <span>Thêm Lịch</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Schedules */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-primary" size={24} />
                Lịch học sắp tới
              </h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">Xem tất cả</button>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-white/5 rounded-2xl"></div>
                ))}
              </div>
            ) : schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.map((schedule, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    key={schedule.id}
                    className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="w-2 h-12 rounded-full bg-gradient-to-b from-primary to-accent mr-4"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{schedule.subject_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {schedule.start_time} - {schedule.end_time}
                        </span>
                        {schedule.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {schedule.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all">
                      <MoreHorizontal size={20} className="text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-muted-foreground" size={24} />
                </div>
                <p className="text-muted-foreground">Bạn không có lịch học nào sắp tới.</p>
              </div>
            )}
          </motion.div>
          
          {/* Analytics / Stats card could go here */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
             <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border-primary/20 flex flex-col justify-center">
               <h3 className="text-muted-foreground font-medium mb-2 text-sm">Thời gian tự học</h3>
               <p className="text-2xl font-bold">12<span className="text-sm font-normal text-muted-foreground ml-1">giờ</span> 30<span className="text-sm font-normal text-muted-foreground ml-1">phút</span></p>
             </div>
             <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent border-accent/20 flex flex-col justify-center">
               <h3 className="text-muted-foreground font-medium mb-2 text-sm">Tiến độ công việc</h3>
               <p className="text-2xl font-bold">85<span className="text-lg text-accent ml-1">%</span></p>
             </div>
             
             {/* Habit Tracker Widget */}
             <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col justify-between">
               <h3 className="text-muted-foreground font-medium text-xs mb-3 flex items-center justify-between">
                 <span>Thói quen (Hôm nay)</span>
               </h3>
               <div className="flex justify-around items-center gap-2">
                 <button className="flex flex-col items-center gap-1 group" onClick={() => {
                   api.post("/habits", { habit_type: "WATER", value: 1 }).catch(() => {});
                 }}>
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                     💧
                   </div>
                   <span className="text-[10px] text-muted-foreground">Uống nước</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 group" onClick={() => {
                   api.post("/habits", { habit_type: "EXERCISE", value: 30 }).catch(() => {});
                 }}>
                   <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                     🏃
                   </div>
                   <span className="text-[10px] text-muted-foreground">Thể dục</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 group" onClick={() => {
                   api.post("/habits", { habit_type: "SLEEP", value: 8 }).catch(() => {});
                 }}>
                   <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                     😴
                   </div>
                   <span className="text-[10px] text-muted-foreground">Giấc ngủ</span>
                 </button>
               </div>
             </div>
          </motion.div>
        </div>

        {/* Right Column: Todos */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-6 h-full min-h-[500px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-accent" size={24} />
                Việc cần làm
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
                ))}
              </div>
            ) : todos.length > 0 ? (
              <div className="space-y-3">
                {todos.map((todo, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    key={todo.id}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                  >
                    <div className="mt-0.5 relative flex-shrink-0 cursor-pointer">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground group-hover:border-accent transition-colors"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{todo.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          todo.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          todo.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'TB' : 'Thấp'}
                        </span>
                        {todo.due_date && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(todo.due_date).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="text-muted-foreground" size={24} />
                </div>
                <p className="text-sm text-muted-foreground">Bạn đã hoàn thành mọi thứ. Thật tuyệt vời!</p>
              </div>
            )}
            
            <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:text-foreground hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Plus size={16} />
              Thêm công việc
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
