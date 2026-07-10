"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, AlignLeft, X, Trash2, Edit2 } from "lucide-react";
import api from "@/lib/api";

interface ClassSchedule {
  id: string;
  subject_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location: string | null;
  note: string | null;
}

const DAYS = [
  { id: 1, name: "Thứ 2" },
  { id: 2, name: "Thứ 3" },
  { id: 3, name: "Thứ 4" },
  { id: 4, name: "Thứ 5" },
  { id: 5, name: "Thứ 6" },
  { id: 6, name: "Thứ 7" },
  { id: 0, name: "Chủ nhật" }
];

const COLORS = [
  "bg-blue-500/20 border-blue-500/30 text-blue-300",
  "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
  "bg-purple-500/20 border-purple-500/30 text-purple-300",
  "bg-orange-500/20 border-orange-500/30 text-orange-300",
  "bg-pink-500/20 border-pink-500/30 text-pink-300"
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    subject_name: "",
    day_of_week: 1,
    start_time: "07:00",
    end_time: "09:00",
    location: "",
    note: ""
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/schedules");
      setSchedules(res.data.data);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject_name.trim()) return;

    try {
      if (editingId) {
        const res = await api.put(`/schedules/${editingId}`, formData);
        setSchedules(schedules.map(s => s.id === editingId ? res.data.data : s));
      } else {
        const res = await api.post("/schedules", formData);
        setSchedules([...schedules, res.data.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save schedule", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lịch này?")) return;
    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(schedules.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete schedule", error);
    }
  };

  const openModal = (schedule?: ClassSchedule) => {
    if (schedule) {
      setEditingId(schedule.id);
      setFormData({
        subject_name: schedule.subject_name,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        location: schedule.location || "",
        note: schedule.note || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        subject_name: "",
        day_of_week: 1,
        start_time: "07:00",
        end_time: "09:00",
        location: "",
        note: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Render Time Grid
  const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 AM to 21:00 PM

  const getEventStyle = (schedule: ClassSchedule) => {
    const startHour = parseInt(schedule.start_time.split(":")[0]);
    const startMin = parseInt(schedule.start_time.split(":")[1]);
    const endHour = parseInt(schedule.end_time.split(":")[0]);
    const endMin = parseInt(schedule.end_time.split(":")[1]);

    const topOffset = ((startHour - 7) * 60 + startMin) * (64 / 60); // 64px per hour
    const height = ((endHour - startHour) * 60 + (endMin - startMin)) * (64 / 60);

    return { top: `${topOffset}px`, height: `${height}px` };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CalendarIcon className="text-primary" size={32} />
            Thời Khóa Biểu
          </h1>
          <p className="text-muted-foreground">Quản lý lịch học chi tiết theo tuần</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/25"
        >
          <Plus size={18} />
          <span>Thêm lịch học</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="glass-panel rounded-[40px] overflow-hidden border border-white/5 relative">
          <div className="flex overflow-x-auto custom-scrollbar">
            {/* Time Column */}
            <div className="min-w-[80px] bg-white/5 border-r border-white/5 flex flex-col pt-12 sticky left-0 z-20 backdrop-blur-md">
              {HOURS.map(hour => (
                <div key={hour} className="h-16 border-b border-white/5 text-xs text-muted-foreground font-medium text-right pr-2 -mt-2">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Days Columns */}
            <div className="flex flex-1 min-w-[800px]">
              {DAYS.map(day => (
                <div key={day.id} className="flex-1 min-w-[120px] border-r border-white/5 relative flex flex-col">
                  {/* Day Header */}
                  <div className="h-12 flex items-center justify-center font-semibold text-sm border-b border-white/5 bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                    {day.name}
                  </div>
                  
                  {/* Grid Lines */}
                  <div className="relative flex-1" style={{ height: `${HOURS.length * 64}px` }}>
                    {HOURS.map(hour => (
                      <div key={hour} className="h-16 border-b border-white/5 w-full"></div>
                    ))}

                    {/* Events */}
                    {schedules.filter(s => s.day_of_week === day.id).map((schedule, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={schedule.id}
                        style={getEventStyle(schedule)}
                        className={`absolute left-1 right-1 rounded-xl p-2 border overflow-hidden group hover:z-30 transition-all shadow-md ${COLORS[idx % COLORS.length]}`}
                        onClick={() => openModal(schedule)}
                      >
                        <div className="font-bold text-xs truncate mb-1">{schedule.subject_name}</div>
                        <div className="text-[10px] opacity-80 flex flex-col gap-0.5">
                          <span>{schedule.start_time} - {schedule.end_time}</span>
                          {schedule.location && <span className="truncate">{schedule.location}</span>}
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/40 backdrop-blur-md rounded-md p-0.5">
                          <button onClick={(e) => { e.stopPropagation(); openModal(schedule); }} className="p-1 hover:text-white"><Edit2 size={12}/></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(schedule.id); }} className="p-1 hover:text-red-400"><Trash2 size={12}/></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={closeModal} className="absolute top-6 right-6 text-muted-foreground hover:text-white">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6">{editingId ? 'Sửa Lịch Học' : 'Thêm Lịch Học Mới'}</h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Môn học / Sự kiện *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject_name}
                    onChange={e => setFormData({...formData, subject_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="VD: Toán rời rạc"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Thứ</label>
                    <select 
                      value={formData.day_of_week}
                      onChange={e => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    >
                      {DAYS.map(d => <option key={d.id} value={d.id} className="bg-zinc-800">{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phòng học (Tùy chọn)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Phòng 302"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Bắt đầu</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="time" 
                        required
                        value={formData.start_time}
                        onChange={e => setFormData({...formData, start_time: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Kết thúc</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="time" 
                        required
                        value={formData.end_time}
                        onChange={e => setFormData({...formData, end_time: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Ghi chú (Tùy chọn)</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <textarea 
                      value={formData.note}
                      onChange={e => setFormData({...formData, note: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                      placeholder="Nhắc nhở làm bài tập..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors">
                    Hủy
                  </button>
                  <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl shadow-lg shadow-primary/25 transition-all">
                    Lưu Lịch Học
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
