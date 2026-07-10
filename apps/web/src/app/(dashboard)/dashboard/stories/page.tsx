"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Bookmark, ArrowRight, Share2, Sparkles } from "lucide-react";
import api from "@/lib/api";

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("Tất cả");

  const tags = ["Tất cả", "Truyền cảm hứng", "Vượt qua áp lực", "Góc nhìn", "Kỹ năng"];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Fetch all stories for MVP. In production, this would be /stories/today
        const res = await api.get("/stories");
        
        // Mock data if DB is empty for UI demonstration
        const fetchedStories = res.data.data.length > 0 ? res.data.data : [
          {
            id: '1', tier: 'LARGE', title: 'Tại sao chúng ta hay trì hoãn?', 
            summary: 'Trì hoãn không phải vì lười biếng, mà là cách bộ não phản ứng với những cảm xúc tiêu cực liên quan đến công việc.',
            mood_tags: ['Vượt qua áp lực'], major_tags: [], status: 'PUBLISHED'
          },
          {
            id: '2', tier: 'MEDIUM', title: 'Quy tắc 2 phút thay đổi cuộc đời', 
            summary: 'Nếu một việc mất chưa tới 2 phút để hoàn thành, hãy làm nó ngay lập tức. Đừng để nó lọt vào danh sách To-do của bạn.',
            mood_tags: ['Kỹ năng'], major_tags: [], status: 'PUBLISHED'
          },
          {
            id: '3', tier: 'SMALL', title: 'Cố lên!', 
            summary: 'Bạn đã đi được một quãng đường rất dài rồi. Chỉ một chút nữa thôi, kết quả sẽ xứng đáng với mọi nỗ lực của bạn ngày hôm nay.',
            mood_tags: ['Truyền cảm hứng'], major_tags: [], status: 'PUBLISHED'
          },
          {
            id: '4', tier: 'MEDIUM', title: 'Nghệ thuật của sự từ chối', 
            summary: 'Từ chối những cơ hội tốt để giữ năng lượng cho những cơ hội vĩ đại. Bạn không thể làm hài lòng tất cả mọi người.',
            mood_tags: ['Góc nhìn'], major_tags: [], status: 'PUBLISHED'
          }
        ];
        
        setStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching stories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const handleBookmark = async (storyId: string) => {
    try {
      await api.post(`/stories/${storyId}/bookmark`);
      // Toast notification would go here
      alert("Đã lưu vào Sổ tay cảm hứng!");
    } catch (error) {
      console.error("Failed to bookmark", error);
    }
  };

  const filteredStories = activeTag === "Tất cả" 
    ? stories 
    : stories.filter(s => s.mood_tags?.includes(activeTag));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header section */}
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -z-10"></div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 shadow-lg border border-white/10"
        >
          <Flame className="text-accent" size={32} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Cảm hứng mỗi ngày</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Dừng lại một chút. Hít một hơi thật sâu. Đọc những dòng chữ này để sạc lại năng lượng trước khi tiếp tục hành trình của bạn.
        </p>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTag === tag 
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" 
                : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/10"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Pinterest-style Masonry Layout using CSS Columns */}
      {loading ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`bg-white/5 rounded-3xl animate-pulse ${i % 2 === 0 ? 'h-64' : 'h-96'}`}></div>
          ))}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredStories.map((story, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={story.id || idx}
              className={`break-inside-avoid glass-panel rounded-3xl p-6 group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                story.tier === 'LARGE' ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20' : 
                story.tier === 'SMALL' ? 'bg-gradient-to-br from-accent/10 to-transparent border-accent/20' : ''
              }`}
            >
              {/* Card Content */}
              <div className="mb-4">
                {story.tier === 'LARGE' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                    <Sparkles size={12} /> Nổi bật
                  </span>
                )}
                <h2 className="text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                  {story.title}
                </h2>
                <p className="text-muted-foreground/90 leading-relaxed text-sm md:text-base">
                  {story.summary}
                </p>
              </div>

              {/* Tags inside card */}
              {story.mood_tags && story.mood_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {story.mood_tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-white/5 text-muted-foreground rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons (Appears on hover in desktop, always on in mobile) */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <button className="text-sm font-medium text-primary flex items-center gap-1 hover:text-accent transition-colors">
                  Đọc tiếp <ArrowRight size={16} />
                </button>
                <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleBookmark(story.id)}
                    className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
