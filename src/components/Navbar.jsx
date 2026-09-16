import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Flame, ChevronLeft } from "lucide-react";

function Navbar() {

  const navigate = useNavigate()

  const { isLoggedIn, setIsLoggedIn, setLoggedUserId } = useContext(AuthContext)

  const handleLogout = () => {

    // remove token from localstorage
    localStorage.removeItem("authToken")

    // revert the context states
    setIsLoggedIn(false)
    setLoggedUserId(null)

    // navigate the user to a public page
    navigate("/login")

  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-3 text-[#F3F1ED] bg-[#1A1C21]/50 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
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
        <span className="font-black text-lg tracking-tight" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
          Performance
        </span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-semibold">
        {isLoggedIn && (
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#C4C9CE] hover:text-[#F3F1ED] transition-colors">
            <ChevronLeft size={16} />
            Back
          </button>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" className="text-[#C4C9CE] hover:text-[#F3F1ED] transition-colors">Login</Link>
            <Link
              to="/signup"
              className="bg-[#FF5A36] text-[#15171B] font-black px-5 py-2 rounded-full hover:bg-[#ff7355] transition-colors"
            >
              Sign up
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/private/activities" className="text-[#C4C9CE] hover:text-[#F3F1ED] transition-colors">
              Activity
            </Link>
            <Link to="/private/calories" className="flex items-center gap-1 text-[#C4C9CE] hover:text-[#F3F1ED] transition-colors">
              <Flame size={16} />
              Calories
            </Link>
            <button
              onClick={handleLogout}
              className="border-2 border-[#5A5F66] px-4 py-2 rounded-full hover:border-[#C4C9CE] transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );

}


export default Navbar;