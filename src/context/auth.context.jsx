/* import axios from "axios"; */
import { createContext, useEffect, useState } from "react";
import service from "../services/index.services";
import { Loader2 } from "lucide-react";

// Context Component => shares the context with the app
const AuthContext = createContext()

// Wrapper Component => holds the states and functions to the shared
function AuthWrapper( { children } ) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedUserId, setLoggedUserId] = useState(null)
  const [isVerifyingUser, setIsVerifyingUser] = useState(true)
  const [loggedUserRole, setLoggedUserRole] = useState(null)

  const verifyUser = async () => {

    try {
      
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
   if (isVerifyingUser) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#15171B] text-[#F3F1ED]">
      <Loader2 className="h-10 w-10 animate-spin text-[#FF5A36]" />
      <p
        className="text-sm font-bold uppercase tracking-[0.18em] text-[#A6ABB2]"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        Verifying credentials...
      </p>
    </div>
  );
}
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