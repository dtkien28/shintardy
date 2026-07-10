"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, Plus, Music, MoreVertical, Upload, Trash2 } from "lucide-react";
import api from "@/lib/api";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Player state
  const [currentPlaylist, setCurrentPlaylist] = useState<any | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Upload state
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingPlaylistId, setUploadingPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

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

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await api.post("/playlists", { name: newPlaylistName });
      setPlaylists([res.data.data, ...playlists]);
      setNewPlaylistName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  };

  const deletePlaylist = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa playlist này?")) return;
    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(playlists.filter(p => p.id !== id));
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Failed to delete playlist", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, playlistId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("audio", file);

    setUploadingPlaylistId(playlistId);
    try {
      const res = await api.post(`/playlists/${playlistId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // Refresh playlists to get new track
      await fetchPlaylists();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Tải lên thất bại. Vui lòng kiểm tra lại file (chỉ hỗ trợ mp3, wav, max 10MB).");
    } finally {
      setUploadingPlaylistId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const togglePlay = (playlist: any, trackIndex: number = 0) => {
    if (currentPlaylist?.id === playlist.id && currentTrackIndex === trackIndex) {
      // Toggle play/pause on same track
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Play new track
      setCurrentPlaylist(playlist);
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
      }, 100);
    }
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentPlaylist.tracks?.length) return;
    const nextIdx = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(nextIdx);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const prevTrack = () => {
    if (!currentPlaylist || !currentPlaylist.tracks?.length) return;
    const prevIdx = currentTrackIndex === 0 ? currentPlaylist.tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIdx);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const getFullAudioUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
    return `${baseUrl}${url}`;
  };

  const currentTrack = currentPlaylist?.tracks?.[currentTrackIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Music className="text-accent" size={32} />
            Không gian Âm nhạc
          </h1>
          <p className="text-muted-foreground">Tự tạo danh sách phát (mp3) của riêng bạn để tập trung tối đa</p>
        </div>
        
        {isCreating ? (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Tên playlist..." 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createPlaylist()}
            />
            <button onClick={createPlaylist} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium">Lưu</button>
            <button onClick={() => setIsCreating(false)} className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium">Hủy</button>
          </div>
        ) : (
          <button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/25">
            <Plus size={18} />
            <span>Tạo Playlist Mới</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, idx) => (
            <motion.div 
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-2 rounded-3xl group relative overflow-hidden flex flex-col h-[320px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10"></div>
              
              <div className="h-32 w-full rounded-2xl bg-black/20 mb-4 overflow-hidden relative flex items-center justify-center shrink-0">
                <Music size={40} className="text-white/20" />
                {playlist.tracks?.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm z-10">
                    <button 
                      onClick={() => togglePlay(playlist, 0)}
                      className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all"
                    >
                      {currentPlaylist?.id === playlist.id && isPlaying ? <Pause className="fill-current" size={20} /> : <Play className="fill-current ml-1" size={20} />}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="px-4 flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{playlist.tracks?.length || 0} bài hát</p>
                </div>
                <button onClick={() => deletePlaylist(playlist.id)} className="text-muted-foreground hover:text-red-400 p-1">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Tracks List */}
              <div className="px-2 flex-1 overflow-y-auto custom-scrollbar mb-2 space-y-1">
                {playlist.tracks?.map((track: any, tIdx: number) => (
                  <div 
                    key={track.id} 
                    className={`flex items-center gap-2 p-2 rounded-xl text-sm transition-colors cursor-pointer ${currentTrack?.id === track.id ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
                    onClick={() => togglePlay(playlist, tIdx)}
                  >
                    <Music size={14} className={currentTrack?.id === track.id ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="truncate flex-1 font-medium">{track.title}</span>
                  </div>
                ))}
                {playlist.tracks?.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Chưa có bài hát nào
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="px-2 mt-auto">
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  id={`upload-${playlist.id}`} 
                  onChange={(e) => handleFileUpload(e, playlist.id)} 
                />
                <label 
                  htmlFor={`upload-${playlist.id}`} 
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                >
                  {uploadingPlaylistId === playlist.id ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <><Upload size={16} /> Thêm bài hát</>
                  )}
                </label>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Audio Element (Hidden) */}
      {currentTrack && (
        <audio 
          ref={audioRef}
          src={getFullAudioUrl(currentTrack.url)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />
      )}

      {/* Floating Music Player Bar */}
      {currentTrack && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass-panel rounded-full px-6 py-4 flex flex-col md:flex-row items-center justify-between z-50 border-white/20 shadow-2xl gap-4"
        >
          {/* Progress bar background */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10 rounded-t-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }}></div>
            <div className="truncate flex-1">
              <p className="font-bold text-sm truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentPlaylist?.name}</p>
            </div>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="flex items-center gap-6">
              <button onClick={prevTrack} className="text-muted-foreground hover:text-white transition-colors">
                <SkipBack size={20} className="fill-current" />
              </button>
              <button 
                onClick={() => {
                  if (isPlaying) audioRef.current?.pause();
                  else audioRef.current?.play();
                  setIsPlaying(!isPlaying);
                }}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
              </button>
              <button onClick={nextTrack} className="text-muted-foreground hover:text-white transition-colors">
                <SkipForward size={20} className="fill-current" />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
            <Volume2 size={18} className="text-muted-foreground" />
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
