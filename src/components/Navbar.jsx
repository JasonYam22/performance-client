import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

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
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-sm font-semibold tracking-wide">Home</Link>

        {!isLoggedIn && <Link to="/signup" className="text-sm font-semibold tracking-wide">Signup</Link>}
        {!isLoggedIn && <Link to="/login" className="text-sm font-semibold tracking-wide">Login</Link>}
        {isLoggedIn && <Link to="/private/user" className="text-sm font-semibold tracking-wide">User</Link>}
        {isLoggedIn && <Link to="/private/activities" className="text-sm font-semibold tracking-wide">ACTIVITY PAGE</Link>}
        {isLoggedIn && <Link to="/private/calories" className="text-sm font-semibold tracking-wide">CALORIE PAGE</Link>}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <button type="button" onClick={() => navigate(-1)} className="border px-3 py-1 text-sm font-medium rounded">
            Back
          </button>
        )}
        {isLoggedIn && (
          <button type="button" onClick={handleLogout} className="border px-3 py-1 text-sm font-medium rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
