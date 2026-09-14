/* import axios from "axios"; */
import { createContext, useEffect, useState } from "react";
import service from "../services/index.services";

// Context Component => shares the context with the app
const AuthContext = createContext()

// Wrapper Component => holds the states and functions to the shared
function AuthWrapper( { children } ) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedUserId, setLoggedUserId] = useState(null)
  const [isVerifyingUser, setIsVerifyingUser] = useState(true)

  // only for roles
  const [loggedUserRole, setLoggedUserRole] = useState(null)

  const verifyUser = async () => {
    // ... this function will send the token to the backend so the backend can verify it

    // const authToken = localStorage.getItem("authToken")

    try {
      
      // const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/verify`, {
      //   headers: {
      //     authorization: `Bearer ${authToken}`
      //   }
      // })
      const response = await service.get("/auth/verify")

      // the token is valid
      setIsLoggedIn(true)
      setLoggedUserId(response.data.payload._id)

      setLoggedUserRole(response.data.payload.role) // only for roles

      setIsVerifyingUser(false)

    } catch (error) {
      // the token is not valid
      setIsLoggedIn(false)
      setLoggedUserId(null)
      setIsVerifyingUser(false)
      setLoggedUserRole(null)
    }
  }

  useEffect(() => {
    verifyUser() // we call this when the app loads for the first time to check if the user already has a valid token
  }, [])

  const passedContext = {
    isLoggedIn,
    setIsLoggedIn,
    loggedUserId,
    setLoggedUserId,
    verifyUser,
    loggedUserRole,
    setLoggedUserRole
  }

  if (isVerifyingUser) {
    //! invest some time into a cool animation for the user to see on their fist visit to the app.
    return <h3>Verifying user credentials...</h3>
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthContext,
  AuthWrapper
}