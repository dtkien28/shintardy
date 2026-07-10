"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Save, Camera, GraduationCap, BookOpen, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user, login } = useAuth(); // using login context to refresh user data if needed
  
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Profile Form
  const [profileData, setProfileData] = useState({
    full_name: "",
    school: "",
    major: "",
    avatar_url: ""
  });

  // Security Form
  const [securityData, setSecurityData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || "",
        school: user.school || "",
        major: user.major || "",
        avatar_url: user.avatar_url || ""
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await api.patch("/auth/me", profileData);
      setMessage({ text: "Cập nhật hồ sơ thành công!", type: "success" });
      
      // Update local storage user data
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        // A hacky way to force context update is reloading or we can manually update context
        localStorage.setItem("user", JSON.stringify(res.data.data));
        window.location.reload(); 
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Có lỗi xảy ra khi cập nhật hồ sơ.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ text: "Mật khẩu xác nhận không khớp.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/password", {
        oldPassword: securityData.oldPassword,
        newPassword: securityData.newPassword
      });
      setMessage({ text: "Đổi mật khẩu thành công!", type: "success" });
      setSecurityData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setMessage({ text: error.response?.data?.error?.message || "Mật khẩu cũ không chính xác.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <User className="text-primary" size={32} />
          Cài đặt Tài khoản
        </h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và bảo mật của bạn</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
              activeTab === "profile" 
                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <User size={18} /> Hồ sơ cá nhân
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
              activeTab === "security" 
                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <Shield size={18} /> Bảo mật
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel p-8 rounded-[32px] min-h-[500px]">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 ${
                message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {activeTab === "profile" ? (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleProfileSubmit}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">Thông tin Cơ bản</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-4xl font-bold text-white shadow-xl relative group">
                  {profileData.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.email}</h3>
                  <p className="text-sm text-muted-foreground">Thành viên Shintardy</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      placeholder="Nhập họ và tên..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Trường học</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="text" 
                        value={profileData.school}
                        onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="VD: ĐH Bách Khoa"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Chuyên ngành</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="text" 
                        value={profileData.major}
                        onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="VD: Khoa học máy tính"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><Save size={18} /> Lưu Thay Đổi</>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSecuritySubmit}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">Đổi Mật Khẩu</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="password" 
                      required
                      value={securityData.oldPassword}
                      onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><Save size={18} /> Cập nhật Mật khẩu</>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
