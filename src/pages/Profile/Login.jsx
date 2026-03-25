import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full flex flex-col font-['Segoe_UI',_sans-serif]">

      <div className="flex flex-col items-center p-[20px] gap-[28px] box-border">

      {/* CENTER BRAND: Auto Layout | Vertical | Spacing 12px | Hug Height */}
      <div className="flex flex-col items-center gap-[12px] shrink-0">
        <div className="w-[96px] h-[96px] shrink-0 flex items-center justify-center">
          <img 
            src="public/Logo.PNG"
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
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-[48px] px-[16px] pr-[44px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#d87c5a] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
    </div>
  );
};

export default Login;