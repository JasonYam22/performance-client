import "./App.css";
import { Routes, Route } from "react-router";
import "./index.css"
// pages
import HomePage from "./pages/private/HomePage"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import ActivityPage from "./pages/private/ActivityPage";
import PathPage from "./pages/private/PathPage"
import CaloriePage from "./pages/private/CaloriePage"
import ErrorPage from "./pages/ErrorPage"

// components
import Navbar from "./components/Navbar"
/* import OnlyAdmin from "./components/OnlyAdmin" */
import OnlyPrivate from "./components/OnlyPrivate"
import UserPage from "./pages/private/UserPage";

function App() {

  return (
    <div>
      <Navbar />

      <br />
      <hr />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
           <Route path="/error" element={<ErrorPage />} />
               <Route path="/private/user" element={<OnlyPrivate><UserPage/></OnlyPrivate>} />
             <Route path="/" element={<OnlyPrivate><HomePage /></OnlyPrivate>} />
           <Route path="/private/activities" element={<OnlyPrivate><ActivityPage/></OnlyPrivate>} />
              <Route path="/private/calories" element={<OnlyPrivate><CaloriePage/></OnlyPrivate>} />
                 <Route path="/private/paths" element={<OnlyPrivate><PathPage/></OnlyPrivate>} />

        {/* error FE routes here... */}

      </Routes>
    </div>
  )
}

export default App
