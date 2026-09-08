// adding the functionaly for protecting pages only for admins. WIP.

import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { Navigate } from "react-router-dom"

function OnlyAdmin(props) {

  const { isLoggedIn, loggedUserRole } = useContext(AuthContext)

  if (isLoggedIn && loggedUserRole === "admin") {
    return props.children // you can see an admin page
  } else {
    return <Navigate to="/login"/>
  }

}
export default OnlyAdmin