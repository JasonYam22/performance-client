function HomePage() {
 return (
    <div className="bg-[#1E293B] text-[#F8FAFC] min-h-screen flex flex-col justify-between">
      {/* Navbar Section */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-[#94A3B8]/30">
        <div className="text-lg font-bold tracking-wider text-[#3B82F6]">PERFORMANCE</div>
        
        <div className="flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#0F172A]/50 border border-[#94A3B8]/30 rounded px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="border border-[#94A3B8]/40 px-4 py-1.5 text-sm rounded hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-colors"
        >
          Log out
        </button>
      </nav>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center space-y-10 flex-1 justify-center">
        {/* Creative Headline */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            PUSH YOUR <span className="text-[#3B82F6]">LIMITS</span> EVERY SINGLE STEP
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8]">
            Track your daily running distance, monitor calorie expenditure, and conquer your fitness goals with high-contrast precision.
          </p>
        </div>

        {/* Center Image Container with Blurry Background Card */}
        <div className="relative w-full max-w-3xl p-6 rounded-2xl border border-[#94A3B8]/30 bg-[#0F172A]/40 backdrop-blur-md shadow-2xl flex items-center justify-center overflow-hidden group">
          {/* Blurry absolute duplicate for aesthetic glow/blur border effect */}
          <div className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-25 scale-110 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80')` }} />
          
          {/* Inner Clear Image Card */}
          <div className="relative z-10 w-full h-80 md:h-96 rounded-xxl overflow-hidden border border-[#94A3B8]/20 shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80" 
              alt="Runner Performance" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80 flex items-end justify-center pb-6">
              <button
                type="button"
                onClick={() => navigate('/private/activities')}
                className="bg-[#3B82F6] text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow-lg hover:bg-[#2563EB] transition-all transform hover:-translate-y-0.5"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>

        {/* Sub-info Section */}
        <div className="max-w-xl text-center space-y-2">
          <h3 className="text-xs uppercase tracking-widest text-[#94A3B8] font-semibold">Seamless Sync & Analytics</h3>
          <p className="text-sm text-[#F8FAFC]/80">
            Monitor weekly metrics, check individualized calorie burn rates, and elevate your routine through clean, high-contrast visual breakdowns.
          </p>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full border-t border-[#94A3B8]/30 py-4 text-center text-xs text-[#94A3B8]">
        © 2026 PERFORMANCE TRACKER. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

export default HomePage