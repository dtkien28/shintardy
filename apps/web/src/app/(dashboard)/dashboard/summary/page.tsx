"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, CheckSquare, Clock, Star, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function SummaryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/summary/weekly");
        setSummary(res.data.data);
      } catch (error) {
        console.error("Error fetching summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="text-center mb-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
        <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl mb-4 shadow-lg border border-white/10">
          <PieChart className="text-primary" size={40} />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">Nhìn lại tuần qua</h1>
        <p className="text-muted-foreground text-lg">Bạn đã làm rất tốt, hãy tự hào về những nỗ lực của mình.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-48 bg-white/5 rounded-3xl"></div>
          <div className="h-48 bg-white/5 rounded-3xl"></div>
          <div className="md:col-span-2 h-64 bg-white/5 rounded-3xl"></div>
        </div>
      ) : summary ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-8 rounded-[32px] bg-gradient-to-br from-primary/10 to-transparent border-primary/20 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Đã hoàn thành</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-primary">{summary.stats.completed_todos}</span>
                  <span className="text-xl font-medium">công việc</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <CheckSquare size={32} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 rounded-[32px] bg-gradient-to-br from-accent/10 to-transparent border-accent/20 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Thời gian tập trung</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-accent">{summary.stats.total_study_hours}</span>
                  <span className="text-xl font-medium">giờ</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                <Clock size={32} />
              </div>
            </motion.div>
          </div>

          {summary.encouragement && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 md:p-12 rounded-[40px] text-center relative overflow-hidden mt-8"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent -z-10"></div>
              <Star className="text-yellow-500 mx-auto mb-6" size={48} />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Gửi tặng bạn một thông điệp</h2>
              <div className="max-w-2xl mx-auto italic text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                "{summary.encouragement.summary}"
              </div>
              <Link 
                href="/dashboard/stories" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-medium"
              >
                Đọc thêm những câu chuyện khác
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Không có dữ liệu tuần này.</div>
      )}
    </div>
  );
}
