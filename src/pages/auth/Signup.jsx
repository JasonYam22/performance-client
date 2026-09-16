import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../../services/index.services";

function Signup() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState(null)

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignup = async (e) => {
    e.preventDefault();

    const body = {
      email,
      username,
      password
    }

    try {
      
      // ... contact backend to register the user
      // await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, body)
      await service.post("/auth/signup", body)
      console.log("user created")

      navigate("/login")

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
      <div className="relative z-10 w-full max-w-4xl bg-[#22252B] border-2 border-[#454951] rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-black/40">
        {/* Left — form panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12 text-[#F3F1ED]">
          <div className="flex justify-end mb-8">
            <p className="text-sm text-[#A6ABB2] font-medium">
              Already a member?{" "}
              <Link to="/login" className="text-[#F3F1ED] font-semibold underline underline-offset-4 decoration-[#FF5A36]">
                Login
              </Link>
            </p>
          </div>

          <h1
            className="text-5xl font-black mb-8 tracking-tight"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            Sign up
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A6ABB2] font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full bg-transparent border-b-2 border-[#454951] focus:border-[#FF5A36] outline-none py-2 text-lg font-medium transition-colors"
              />
            </div>

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

            <p className="text-xs text-[#A6ABB2] font-medium mt-1">
              By signing up, you agree to our terms of service and privacy policy.
            </p>

            {errorMessage && <p className="text-sm text-[#FF5A36] font-semibold">{errorMessage}</p>}

            <button
              type="submit"
              className="mt-2 bg-[#FF5A36] text-[#15171B] font-black text-lg py-3 rounded-full hover:bg-[#ff7355] transition-colors shadow-lg shadow-[#FF5A36]/20"
            >
              Sign up
            </button>
          </form>
        </div>

        {/* Right — decorative only, no image block */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center bg-[#1A1C21] p-10">
          <div className="relative w-4/5 aspect-[3/4]">
            <div className="absolute -bottom-8 -left-8 w-2/5 aspect-[4/3] rounded-xl bg-gradient-to-br from-[#FF5A36]/30 to-[#22252B] border-2 border-[#454951]" />
            <div className="absolute -top-6 -right-6 w-14 h-14 rounded-full border-2 border-[#33C97A]" />
            <div className="absolute top-1/3 -right-10 w-20 h-20 rounded-full bg-[#33C97A]/20 border-2 border-[#33C97A]/60" />
          </div>
        </div>
      </div>
    </div>
  );
 
}

export default Signup;