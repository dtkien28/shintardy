"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import api from "@/lib/api";

const moods = [
  { emoji: "🤩", label: "Tuyệt vời", type: "positive" },
  { emoji: "😊", label: "Khá ổn", type: "positive" },
  { emoji: "😐", label: "Bình thường", type: "neutral" },
  { emoji: "😔", label: "Hơi buồn", type: "negative" },
  { emoji: "😫", label: "Áp lực", type: "negative" },
];

export default function MoodCheckin() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  // Check if we already checked in today
  useEffect(() => {
    const lastCheckin = localStorage.getItem("lastMoodCheckin");
    const today = new Date().toDateString();
    
    if (lastCheckin !== today) {
      // Show check-in after 2 seconds
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleMoodSelect = async (mood: string) => {
    try {
      const res = await api.post("/moods", { mood_emoji: mood });
      
      localStorage.setItem("lastMoodCheckin", new Date().toDateString());
      
      if (res.data.data.suggestion) {
        setSuggestion(res.data.data.suggestion);
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to save mood", error);
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[var(--background)] border border-white/10 p-8 rounded-[32px] shadow-2xl relative overflow-hidden"
          >
            {/* Background blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            {!suggestion ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Hôm nay bạn cảm thấy thế nào?</h2>
                  <p className="text-muted-foreground">Chia sẻ một chút để Shintardy đồng hành cùng bạn nhé.</p>
                </div>

                <div className="flex justify-between items-center gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.emoji}
                      onClick={() => handleMoodSelect(m.emoji)}
                      className="group flex flex-col items-center gap-2 flex-1"
                    >
                      <div className="text-4xl transition-transform transform group-hover:scale-125 group-hover:-translate-y-2 group-active:scale-95 duration-200">
                        {m.emoji}
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center p-3 bg-accent/20 text-accent rounded-2xl mb-4">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-xl font-bold mb-4">Một chút động lực cho bạn</h2>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 italic text-muted-foreground text-sm">
                  "{suggestion.summary}"
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
                >
                  Cảm ơn Shintardy!
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
