import { useNavigate } from "react-router-dom";

function ErrorPage () {

    const navigate = useNavigate()
  return (
  <div className="min-h-screen bg-[#15171B] text-[#F3F1ED] flex items-center justify-center px-6">
    <div className="w-full max-w-lg text-center">

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <svg width="28" height="28" viewBox="0 0 26 26" fill="none">
          <rect width="26" height="26" rx="7" fill="#FF5A36" />
          <path
            d="M5 17 L9 17 L11 9 L14 21 L16 13 L18 17 L21 17"
            stroke="#15171B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        <span
          className="text-lg tracking-tight"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          Performance
        </span>
      </div>

      {/* Error */}
      <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] px-8 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5A36]">
          Something went wrong
        </p>

        <h1
          className="mt-4 text-6xl"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          404
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#A6ABB2]">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-full bg-[#FF5A36] px-6 py-3 text-sm font-bold text-[#15171B] transition-all hover:bg-[#ff7355] active:scale-95"
        >
          Back to home
        </button>
      </div>

    </div>
  </div>
);
}

export default ErrorPage