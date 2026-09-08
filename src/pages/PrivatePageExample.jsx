import service from "../services/index.services.js"
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from "../context/auth.context.jsx"

function PrivatePageExample() {

  const { loggedUserRole } = useContext(AuthContext)

  const [dataOnlyForLoggedUsers, setData] = useState(null)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      
      // call a private route here...
      const response = await service.get("/example-private-route")
      console.log(response)
      setData(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  // loading handler here

  return (
    <div>
      
      <h3>Private Page Example</h3>
      <p>Should only be visible for logged in users that already validated their credentials (login) and have a valid token</p>

      {dataOnlyForLoggedUsers}
      <br />
      
      {loggedUserRole === "admin" && <button>Self-Destruct</button>}

    </div>
  )
}

export default PrivatePageExample