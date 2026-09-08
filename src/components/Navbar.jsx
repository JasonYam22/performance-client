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
    <nav>
      <Link to="/">Home</Link>

      { !isLoggedIn && <Link to="/signup">Signup</Link> } 
      { !isLoggedIn && <Link to="/login">Login</Link> }

      { isLoggedIn && <Link to="/private-page-example">Private Page Example</Link> }
      { isLoggedIn && <button onClick={handleLogout}>Logout</button> }
      
    </nav>
  );
}

export default Navbar;
