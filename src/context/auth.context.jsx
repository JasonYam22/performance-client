import { createContext, useState } from "react";

// Context Component => shares the context with the app
const AuthContext = createContext()

// Wrapper Component => holds the states and functions to the shared
function AuthWrapper( { children } ) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedUserId, setLoggedUserId] = useState(null)

  const verifyUser = () => {
    // ...
  }

  const passedContext = {
    isLoggedIn,
    setIsLoggedIn,
    loggedUserId,
    setLoggedUserId,
    verifyUser
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