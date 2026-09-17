import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Activity, Flame, ChevronLeft, User } from "lucide-react";

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
  <nav className="sticky top-0 z-50 border-b border-[#3A3D42]/70 bg-[#15171B]/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">

      {/* Logo */}
      <Link
        to="/"
        className="group flex items-center gap-3"
      >
        <div className="relative">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            className="transition-transform duration-300 group-hover:scale-105"
          >
            <rect
              width="34"
              height="34"
              rx="10"
              fill="#FF5A36"
            />
            <path
              d="M7 21.5H11L13.5 11L17 25L20 15.5L22.5 21.5H27"
              stroke="#15171B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <span
          className="text-xl tracking-tight text-[#F3F1ED]"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          Performance
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm font-semibold">

        {/* Back */}
        {isLoggedIn && (
          <button
            onClick={() => navigate(-1)}
            className="mr-2 flex items-center gap-1.5 rounded-full px-3 py-2 text-[#A6ABB2] transition-all hover:bg-[#22252B] hover:text-[#F3F1ED]"
          >
            <ChevronLeft size={17} />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* Public Navigation */}
        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className="rounded-full px-4 py-2.5 text-[#C4C9CE] transition-all hover:bg-[#22252B] hover:text-[#F3F1ED]"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-full bg-[#FF5A36] px-5 py-2.5 font-bold text-[#15171B] shadow-[0_0_20px_rgba(255,90,54,0.15)] transition-all hover:bg-[#ff7355] hover:shadow-[0_0_25px_rgba(255,90,54,0.3)]"
            >
              Sign up
            </Link>
          </>
        )}

        {/* Logged-in Navigation */}
        {isLoggedIn && (
          <>
            <Link
              to="/private/user"
              className="group flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-[#A6ABB2] transition-all hover:border-[#3A3D42] hover:bg-[#22252B] hover:text-[#F3F1ED]"
            >
              <User
                size={17}
                className="transition-colors group-hover:text-[#4FA8FF]"
              />
              <span className="hidden md:inline">Profile</span>
            </Link>

            <Link
              to="/private/activities"
              className="group flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-[#A6ABB2] transition-all hover:border-[#3A3D42] hover:bg-[#22252B] hover:text-[#F3F1ED]"
            >
              <Activity
                size={17}
                className="transition-colors group-hover:text-[#FF5A36]"
              />
              <span className="hidden md:inline">Activity</span>
            </Link>

            <Link
              to="/private/calories"
              className="group flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-[#A6ABB2] transition-all hover:border-[#3A3D42] hover:bg-[#22252B] hover:text-[#F3F1ED]"
            >
              <Flame
                size={17}
                className="transition-colors group-hover:text-[#FF5A36]"
              />
              <span className="hidden md:inline">Calories</span>
            </Link>

            <div className="mx-2 h-7 w-px bg-[#3A3D42]" />

            <button
              onClick={handleLogout}
              className="rounded-full border-2 border-[#3A3D42] px-4 py-2.5 text-[#A6ABB2] transition-all hover:border-[#FF5A36] hover:bg-[#FF5A36]/10 hover:text-[#F3F1ED]"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  </nav>
);

}


export default Navbar;