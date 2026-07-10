"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, Plus, Music, MoreVertical } from "lucide-react";
import api from "@/lib/api";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/playlists");
        setPlaylists(res.data.data);
      } catch (error) {
        console.error("Error fetching playlists", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Music className="text-accent" size={32} />
            Không gian Âm nhạc
          </h1>
          <p className="text-muted-foreground">Lofi & Âm thanh trắng giúp bạn tập trung tối đa</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/25">
          <Plus size={18} />
          <span>Tạo Playlist Mới</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Lofi Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-2 rounded-3xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent -z-10"></div>
            <div className="h-40 w-full rounded-2xl bg-black/40 mb-4 overflow-hidden relative">
              {/* Replace with actual thumbnail if available */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm z-10">
                <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all">
                  <Play className="fill-current ml-1" size={20} />
                </button>
              </div>
            </div>
            <div className="px-4 pb-4">
              <h3 className="font-bold text-lg">Lofi Chill Study ☕</h3>
              <p className="text-sm text-muted-foreground mt-1">24 tracks • Thư giãn</p>
            </div>
          </motion.div>

          {/* Dynamic Playlists */}
          {playlists.map((playlist, idx) => (
            <motion.div 
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-2 rounded-3xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10"></div>
              <div className="h-40 w-full rounded-2xl bg-black/20 mb-4 overflow-hidden relative flex items-center justify-center">
                <Music size={40} className="text-white/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm z-10">
                  <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all">
                    <Play className="fill-current ml-1" size={20} />
                  </button>
                </div>
              </div>
              <div className="px-4 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{playlist.tracks?.length || 0} tracks</p>
                </div>
                <button className="text-muted-foreground hover:text-white">
                  <MoreVertical size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Music Player Bar (Global Player concept) */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass-panel rounded-full px-6 py-4 flex items-center justify-between z-50 border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary animate-spin-slow" style={{ animationDuration: '10s' }}></div>
          <div className="hidden sm:block truncate">
            <p className="font-bold text-sm truncate">Lofi Girl - chill beats to relax/study to</p>
            <p className="text-xs text-muted-foreground">Livestream</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center gap-6">
            <button className="text-muted-foreground hover:text-white transition-colors">
              <SkipBack size={20} className="fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
            </button>
            <button className="text-muted-foreground hover:text-white transition-colors">
              <SkipForward size={20} className="fill-current" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/3">
          <Volume2 size={18} className="text-muted-foreground" />
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
