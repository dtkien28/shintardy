"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  Music, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  PieChart
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lịch học", href: "/dashboard/schedules", icon: Calendar },
  { name: "Việc cần làm", href: "/dashboard/todos", icon: CheckSquare },
  { name: "Cảm hứng", href: "/dashboard/stories", icon: Flame },
  { name: "Sổ tay", href: "/dashboard/bookmarks", icon: BookOpen },
  { name: "Tổng kết", href: "/dashboard/summary", icon: PieChart },
  { name: "Góc học tập", href: "/dashboard/study", icon: BookOpen },
  { name: "Playlist", href: "/dashboard/playlists", icon: Music },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col glass-panel border-r border-white/10 z-50 overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-gradient">Shintardy</span>
          </motion.div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
            S
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isCollapsed ? 'absolute -right-3 top-6 bg-primary/20 backdrop-blur-md rounded-full border border-white/10' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-primary/20 text-primary shadow-inner border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} className={isActive ? "text-primary" : "group-hover:text-foreground transition-colors"} />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
              {isActive && !isCollapsed && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto border-t border-white/5 space-y-2">
        <Link 
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all group"
          title={isCollapsed ? "Cài đặt" : undefined}
        >
          <Settings size={20} className="group-hover:text-foreground transition-colors" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Cài đặt</span>}
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Đăng xuất</span>}
        </button>
        
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center text-white font-medium shadow-md">
              {user.full_name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
