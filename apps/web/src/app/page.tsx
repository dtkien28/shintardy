import Link from "next/link";
import { ArrowRight, Brain, Clock, Flame, CheckCircle2 } from "lucide-react";


export const metadata = {
  title: 'Shintardy - Đồng hành cùng bạn trên chặng đường học tập',
  description: 'Nền tảng quản lý thời gian, công việc và cảm xúc giúp bạn học tập không áp lực.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-primary/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 md:px-12 border-b border-white/10 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-lg">
            S
          </div>
          <span className="font-bold text-xl tracking-tight">Shintardy</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 text-sm font-medium hover:text-primary transition-colors">
            Đăng nhập
          </Link>
          <Link href="/register" className="px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-full transition-colors hidden sm:block">
            Đăng ký miễn phí
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-8">
          <SparklesIcon className="w-4 h-4 text-accent" />
          <span>Phiên bản mới nhất: Cảm hứng cốt lõi</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
          Học tập không áp lực, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            quản lý cảm xúc thông minh
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Shintardy không chỉ là công cụ quản lý thời gian, mà còn là người bạn đồng hành giúp bạn duy trì động lực, theo dõi thói quen và chữa lành tinh thần sau những giờ học căng thẳng.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/login"
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 hover:scale-105 transition-all w-full sm:w-auto justify-center"
          >
            Bắt đầu hành trình <ArrowRight size={20} />
          </Link>
          <a 
            href="#features"
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full transition-all w-full sm:w-auto justify-center"
          >
            Tìm hiểu thêm
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Tính năng nổi bật</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Được thiết kế dựa trên khoa học hành vi, giúp bạn tối ưu hóa hiệu suất mà không bị kiệt sức.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Clock className="text-blue-400" size={32} />}
            title="Góc học tập Pomodoro"
            description="Tập trung sâu với đồng hồ đếm ngược, kết hợp nhạc lofi thư giãn và nhắc nhở nghỉ giải lao tự động."
          />
          <FeatureCard 
            icon={<CheckCircle2 className="text-emerald-400" size={32} />}
            title="Quản lý việc cần làm"
            description="Lên danh sách nhiệm vụ, chia nhỏ mục tiêu và theo dõi tiến độ một cách khoa học, ngăn nắp."
          />
          <FeatureCard 
            icon={<Flame className="text-orange-400" size={32} />}
            title="Cảm hứng mỗi ngày"
            description="Kho tàng các mẩu chuyện ngắn truyền động lực, được thiết kế dưới dạng thẻ Pinterest tuyệt đẹp."
          />
          <FeatureCard 
            icon={<Brain className="text-purple-400" size={32} />}
            title="Đồng hành cảm xúc"
            description="Theo dõi tâm trạng, log thói quen 1-chạm và nhận báo cáo khích lệ vào mỗi cuối tuần."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-muted-foreground mt-auto">
        <p>&copy; {new Date().getFullYear()} Shintardy. Xây dựng với ♥️ cho cộng đồng học tập.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
