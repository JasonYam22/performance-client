import { useNavigate, Link } from "react-router-dom"
import { Activity, Flame, Target, ShoppingBag } from "lucide-react";

function HomePage() {

const navigate = useNavigate();

 return (
    <div className="min-h-screen bg-[#15171B] text-[#F3F1ED] overflow-hidden">
      {/* Hero — full-bleed image, nav overlaid */}
           <section className="relative min-h-[90vh] flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1744060204728-f68e434a3edf?fm=jpg&q=80&w=2400&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#15171B]/70 via-[#15171B]/20 to-[#15171B]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#FF5A36]/20 blur-[140px]" />


        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-4xl pt-24">
          <h1
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            Every step counted. Every run remembered.
          </h1>
          <p className="text-[#E4E1DB] text-lg font-medium mt-6 max-w-xl">
            Track your runs, fuel your training, and hit the goals you actually set for yourself — not someone else's plan.
          </p>
          <Link
            to="/signup"
            className="inline-block w-fit mt-8 bg-[#FF5A36] text-[#15171B] font-black text-lg px-8 py-3 rounded-full hover:bg-[#ff7355] hover:scale-105 transition-all shadow-lg shadow-[#FF5A36]/30"
          >
            Get started
          </Link>
        </div>

        <div className="relative z-10 flex flex-wrap gap-x-12 gap-y-4 px-6 md:px-16 pb-10">
          <div>
            <p className="text-[#FF5A36] text-4xl font-black" style={{ fontFamily: "'Archivo Black', sans-serif" }}>10K+</p>
            <p className="text-[#C4C9CE] text-xs font-bold uppercase tracking-wider mt-1">Runs logged</p>
          </div>
          <div>
            <p className="text-[#33C97A] text-4xl font-black" style={{ fontFamily: "'Archivo Black', sans-serif" }}>82%</p>
            <p className="text-[#C4C9CE] text-xs font-bold uppercase tracking-wider mt-1">Goals reached</p>
          </div>
          <div>
            <p className="text-[#4FA8FF] text-4xl font-black" style={{ fontFamily: "'Archivo Black', sans-serif" }}>24/7</p>
            <p className="text-[#C4C9CE] text-xs font-bold uppercase tracking-wider mt-1">Track anytime</p>
          </div>
        </div>
      </section>

      {/* Info / feature cards — on a slightly lifted, glowing surface */}
      <section className="relative px-6 md:px-16 py-24">
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#33C97A]/10 blur-[140px]" />
        <div className="absolute -right-40 top-1/4 w-[400px] h-[400px] rounded-full bg-[#FF5A36]/10 blur-[140px]" />

        <div className="relative max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-14 text-center" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
            Everything your training needs, in one place
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1D2025] border-2 border-[#3A3D42] rounded-2xl p-6 hover:border-[#FF5A36]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#FF5A36]/15 border-2 border-[#FF5A36]/40 flex items-center justify-center mb-4">
                <Activity size={22} className="text-[#FF5A36]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Track activity</h3>
              <p className="text-[#A6ABB2] text-sm font-medium">
                Log every run, walk, or ride — distance, duration, and pace, all in one clean history.
              </p>
            </div>

            <div className="bg-[#1D2025] border-2 border-[#3A3D42] rounded-2xl p-6 hover:border-[#33C97A]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#33C97A]/15 border-2 border-[#33C97A]/40 flex items-center justify-center mb-4">
                <Flame size={22} className="text-[#33C97A]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Fuel smarter</h3>
              <p className="text-[#A6ABB2] text-sm font-medium">
                Log meals and macros, and see exactly how many calories you've got left for the day.
              </p>
            </div>

            <div className="bg-[#1D2025] border-2 border-[#3A3D42] rounded-2xl p-6 hover:border-[#4FA8FF]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#4FA8FF]/15 border-2 border-[#4FA8FF]/40 flex items-center justify-center mb-4">
                <Target size={22} className="text-[#4FA8FF]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Set real goals</h3>
              <p className="text-[#A6ABB2] text-sm font-medium">
                Daily calorie targets and weekly workout goals that stay visible, not buried in a menu.
              </p>
            </div>

            <div className="bg-[#1D2025] border-2 border-[#3A3D42] rounded-2xl p-6 hover:border-[#FFC94F]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#FFC94F]/15 border-2 border-[#FFC94F]/40 flex items-center justify-center mb-4">
                <ShoppingBag size={22} className="text-[#FFC94F]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Gear wishlist</h3>
              <p className="text-[#A6ABB2] text-sm font-medium">
                Keep track of the shoes and gear you're eyeing next, right next to your training data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-8 border-t-2 border-[#22252B] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#A6ABB2] text-sm font-medium">© 2026 Performance. Built for athletes, by athletes.</p>
        <div className="flex gap-6 text-sm font-semibold">
    {/*       <Link to="/about" className="text-[#A6ABB2] hover:text-[#F3F1ED] transition-colors">About</Link> */}
          <Link to="/login" className="text-[#A6ABB2] hover:text-[#F3F1ED] transition-colors">Login</Link>
        </div>
      </footer>
    </div>
  );

}


export default HomePage