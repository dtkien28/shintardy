"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Square, History, BookOpen, Coffee, Flame } from "lucide-react";
import api from "@/lib/api";

export default function StudyRoomPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && !startTime) {
      setStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setStartTime(null);
    if (mode === "pomodoro") setTimeLeft(25 * 60);
    else if (mode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const changeMode = (newMode: "pomodoro" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setIsActive(false);
    setStartTime(null);
    if (newMode === "pomodoro") setTimeLeft(25 * 60);
    else if (newMode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const handleSessionComplete = async () => {
    if (mode !== "pomodoro" || !startTime) return;
    
    try {
      // API call to save the study session
      await api.post("/study-sessions", {
        mode: "solo",
        duration_minutes: 25,
        started_at: startTime.toISOString(),
        ended_at: new Date().toISOString()
      });
      // Optionally show a success toast here
    } catch (error) {
      console.error("Failed to save study session", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate circle dash offset
  const totalTime = mode === "pomodoro" ? 25 * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60;
  const progress = 1 - (timeLeft / totalTime);
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Góc Học Tập Tập Trung</h1>
        <p className="text-muted-foreground">Sử dụng phương pháp Pomodoro để tối ưu hiệu suất</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Timer Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 glass-panel p-8 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]"
        >
          {/* Animated background pulse when active */}
          {isActive && (
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] -z-10"
            />
          )}

          {/* Mode Selector */}
          <div className="flex bg-black/20 p-1.5 rounded-2xl mb-12 backdrop-blur-md">
            <button 
              onClick={() => changeMode("pomodoro")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${mode === "pomodoro" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              <Flame size={16} /> Pomodoro
            </button>
            <button 
              onClick={() => changeMode("shortBreak")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${mode === "shortBreak" ? "bg-accent text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              <Coffee size={16} /> Nghỉ ngắn
            </button>
            <button 
              onClick={() => changeMode("longBreak")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${mode === "longBreak" ? "bg-blue-500 text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              <Coffee size={16} /> Nghỉ dài
            </button>
          </div>

          {/* Circular Timer Display */}
          <div className="relative flex items-center justify-center mb-12 group">
            <svg className="w-72 h-72 transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/10"
              />
              <motion.circle
                cx="144"
                cy="144"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                className={mode === "pomodoro" ? "text-primary" : mode === "shortBreak" ? "text-accent" : "text-blue-500"}
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className="absolute text-6xl font-bold tracking-tighter tabular-nums drop-shadow-2xl">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${isActive ? "bg-red-500 shadow-red-500/30" : "bg-primary shadow-primary/30"}`}
            >
              {isActive ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-2" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-16 h-16 rounded-2xl glass-button flex items-center justify-center text-foreground hover:text-red-400"
            >
              <Square size={24} className="fill-current" />
            </button>
          </div>
        </motion.div>

        {/* Side Panel */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              Ghi chú phiên học
            </h3>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm h-32 resize-none focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="Ghi chú lại những gì bạn định học trong 25 phút tới..."
            ></textarea>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <History className="text-accent" size={20} />
              Thống kê hôm nay
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-sm text-muted-foreground">Số phiên hoàn thành</span>
                <span className="font-bold text-lg">0</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-sm text-muted-foreground">Thời gian tập trung</span>
                <span className="font-bold text-lg text-primary">0 phút</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
