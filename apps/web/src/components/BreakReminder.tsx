"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X } from "lucide-react";

export default function BreakReminder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show reminder every 45 minutes of continuous active session
    const INTERVAL = 45 * 60 * 1000;
    
    const timer = setInterval(() => {
      setShow(true);
      // Auto hide after 15 seconds
      setTimeout(() => setShow(false), 15000);
    }, INTERVAL);

    // Initial demo trigger for testing (shows after 10 seconds, then standard interval)
    // Comment this out in production
    // const demoTimer = setTimeout(() => { setShow(true); setTimeout(() => setShow(false), 15000); }, 10000);

    return () => {
      clearInterval(timer);
      // clearTimeout(demoTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm"
        >
          <div className="p-3 bg-accent/20 rounded-xl text-accent">
            <Coffee size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-1">Đã đến lúc nghỉ ngơi!</h4>
            <p className="text-sm text-muted-foreground">Bạn đã làm việc liên tục 45 phút rồi. Hãy đứng lên vươn vai và uống một ngụm nước nhé.</p>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
