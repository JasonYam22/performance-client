import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../../context/auth.context";
import service from "../../services/index.services";

function Login() {

  const { setIsLoggedIn, setLoggedUserId, setLoggedUserRole } = useContext(AuthContext)

  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState(null)

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();

    const body = {
      email,
      password
    }

    try {
      
      // ... contact backend validate user credentials
      // const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}api/auth/login`, body)
      const response = await service.post("/auth/login", body)
      console.log(response)

      // store the token in localStorage
      localStorage.setItem("authToken", response.data.authToken)

      // update the auth states correctly
      setIsLoggedIn(true)
      setLoggedUserId(response.data.payload._id)

      setLoggedUserRole(response.data.payload.role) // only for roles

      navigate("/")

    } catch (error) {
      console.log(error)
      if (error.response?.status === 400) {
    setErrorMessage(error.response?.data?.message || "Something went wrong");
      } else {
  navigate("/error")
      }
    }

  };

  return (
       <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* bright, clearly visible sports background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1744060204728-f68e434a3edf?fm=jpg&q=80&w=2400&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-[#15171B]/25" />

      {/* centered card */}
      <div className="relative z-10 w-full max-w-sm bg-[#22252B] border-2 border-[#454951] rounded-3xl p-10 shadow-2xl shadow-black/40 text-[#F3F1ED]">
        <div className="flex justify-end mb-8">
          <p className="text-sm text-[#A6ABB2] font-medium">
            New here?{" "}
            <Link to="/signup" className="text-[#F3F1ED] font-semibold underline underline-offset-4 decoration-[#FF5A36]">
              Sign up
            </Link>
          </p>
        </div>

        <h1
          className="text-5xl font-black mb-8 tracking-tight"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A6ABB2] font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full bg-transparent border-b-2 border-[#454951] focus:border-[#FF5A36] outline-none py-2 text-lg font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A6ABB2] font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full bg-transparent border-b-2 border-[#454951] focus:border-[#FF5A36] outline-none py-2 text-lg font-medium transition-colors"
            />
          </div>

          {errorMessage && <p className="text-sm text-[#FF5A36] font-semibold">{errorMessage}</p>}

          <button
            type="submit"
            className="mt-2 bg-[#FF5A36] text-[#15171B] font-black text-lg py-3 rounded-full hover:bg-[#ff7355] transition-colors shadow-lg shadow-[#FF5A36]/20"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
