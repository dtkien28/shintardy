"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookOpen, Clock } from "lucide-react";
import api from "@/lib/api";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get("/stories/bookmarks/me");
        setBookmarks(res.data.data);
      } catch (error) {
        console.error("Error fetching bookmarks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 shadow-lg">
          <BookOpen className="text-primary" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Sổ tay cảm hứng</h1>
          <p className="text-muted-foreground">Những mẩu chuyện và bài học bạn đã lưu lại</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={bookmark.id}
              className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-6 group hover:border-primary/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">
                    {bookmark.story?.tier === 'LARGE' ? 'Bài viết dài' : 'Mẩu chuyện'}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {new Date(bookmark.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {bookmark.story?.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {bookmark.story?.summary}
                </p>
              </div>
              <div className="flex items-center md:items-end justify-between md:flex-col mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                <button className="text-primary text-sm font-medium hover:underline">
                  Đọc lại
                </button>
                <button className="text-muted-foreground hover:text-red-400 transition-colors" title="Bỏ lưu">
                  <Bookmark className="fill-current" size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="text-muted-foreground" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sổ tay của bạn đang trống</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Hãy khám phá các câu chuyện trong ngày và lưu lại những thông điệp có ý nghĩa với bạn nhất.
          </p>
          <a href="/dashboard/stories" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors">
            Khám phá Câu chuyện
          </a>
        </div>
      )}
    </div>
  );
}
