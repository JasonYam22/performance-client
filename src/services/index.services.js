import axios from "axios";

// service will be an object with all initial configurations for the requests made into the backend.
const service = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`
})

// configuring all outgoing requests to include the token, in a secure way, as per the documentation of axios.
service.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken")
  if (authToken) {
    config.headers.authorization = `Bearer ${authToken}`
  }
  return config
})

const foodApi = axios.create({
  baseURL: import.meta.env.VITE_CALORIE_API_URL,
});

export { foodApi };

// a bit more complex, creating individual functions to use in the components
// function loginService(body) {
//   return service.post("/auth/login", body)
// }

export default service