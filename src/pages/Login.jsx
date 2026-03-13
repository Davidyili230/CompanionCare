import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    if (!email) {
      setError("Please enter your email address above to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch {
      setError("Could not send reset email. Please check your email address.");
    }
  };

  return (
    /* BODY FRAME: Auto Layout | Vertical | Spacing 28px | Padding 20px */
    <div className="min-h-screen w-full bg-[#fdf6ec] flex flex-col items-center p-[20px] gap-[28px] font-['Segoe_UI',_sans-serif] box-border">

      <NavBar />

      {/* CENTER BRAND: Auto Layout | Vertical | Spacing 12px | Hug Height */}
      <div className="flex flex-col items-center gap-[12px] shrink-0">
        <div className="w-[96px] h-[96px] shrink-0 flex items-center justify-center">
          <img 
            src="/Logo.png" 
            alt="Main Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[36px] font-[900] italic text-[#d87c5a] leading-none shrink-0">
          CompanionCare
        </span>
      </div>

      {/* LOGIN CARD: Auto Layout | Vertical | Spacing 20px | Padding 40px | Fixed Width 480px */}
      <main className="flex flex-col items-center gap-[20px] w-full max-w-[480px] border-[2px] border-solid border-[#f0dece] rounded-[20px] p-[40px] shrink-0 box-border shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-[20px] font-[700] text-[#2d3e50] text-center leading-none shrink-0">
          Welcome Back
        </h2>

        {/* FORM: Auto Layout | Vertical | Spacing 16px | Fill Width */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[16px] w-full shrink-0">
          {/* EMAIL INPUT FRAME: Auto Layout | Vertical | Spacing 5px | Fill Width */}
          <div className="flex flex-col gap-[5px] w-full shrink-0">
            <label className="text-[14px] font-[700] text-[#2d3e50] shrink-0">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              /* Correction: px-[16px] ensures right padding is not tight */
              className="w-full h-[48px] px-[16px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
            />
          </div>

          {/* PASSWORD INPUT FRAME: Auto Layout | Vertical | Spacing 5px | Fill Width */}
          <div className="flex flex-col gap-[5px] w-full shrink-0">
            <label className="text-[14px] font-[700] text-[#2d3e50] shrink-0">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              /* Correction: px-[16px] ensures right padding is not tight */
              className="w-full h-[48px] px-[16px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
            />
          </div>

          {error && (
            <p className="w-full text-[13px] text-[#c0392b] bg-white border border-[#f5c6cb] rounded-[8px] px-[12px] py-[10px]">
              {error}
            </p>
          )}

          {resetMessage && (
            <p className="w-full text-[13px] text-[#27ae60] bg-white border border-[#a9dfbf] rounded-[8px] px-[12px] py-[10px]">
              {resetMessage}
            </p>
          )}

          <button
            type="submit"
            className="flex flex-row items-center justify-center w-full p-[16px] bg-[#d87c5a] text-white text-[15px] font-[700] border-none rounded-full cursor-pointer hover:bg-[#c76b4a] transition-all duration-150 shrink-0"
          >
              Login
          </button>
        </form>

        <a href="#" onClick={handleForgotPassword} className="text-[14px] font-[700] text-[#d87c5a] hover:underline shrink-0">
          Forgot Password?
        </a>

        {/* SIGNUP ROW: Auto Layout | Horizontal | Spacing 6px */}
        <div className="flex flex-row items-center gap-[6px] shrink-0">
          <span className="text-[14px] text-[#8b9bae]">Dont have an account?</span>
          <Link to="/register" className="text-[14px] text-[#d87c5a] font-[500] hover:underline">
            Sign up
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Login;