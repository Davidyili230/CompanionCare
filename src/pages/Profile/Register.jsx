import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const usernameRef = doc(db, "usernames", username);
      const usernameSnap = await getDoc(usernameRef);
      if (usernameSnap.exists()) {
        setError("Username is already taken. Please choose another.");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await updateProfile(userCredential.user, { displayName: username });
      // Reserve the username (for uniqueness checks)
      await setDoc(usernameRef, { uid });
      // Store full user profile keyed by UID
      await setDoc(doc(db, "users", uid), {
        username,
        email,
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address (e.g. you@example.com).");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="w-full flex flex-col font-['Segoe_UI',_sans-serif]">

      <div className="flex flex-col items-center p-[20px] gap-[28px] box-border">

      {/* CENTER BRAND */}
      <div className="flex flex-col items-center gap-[12px] shrink-0">
        <div className="w-[96px] h-[96px] shrink-0 flex items-center justify-center">
          <img
            src="public/Logo.PNG"
            alt="Main Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[36px] font-[900] italic text-[#d87c5a] leading-none shrink-0">
          Join CompanionCare
        </span>
      </div>

      {/* REGISTER CARD: Auto Layout | Vertical | Spacing 20px | Padding 40px | Fixed Width 480px */}
      <main className="flex flex-col items-center gap-[20px] w-full max-w-[480px] border-[2px] border-solid border-[#f0dece] rounded-[20px] p-[40px] shrink-0 box-border shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-[20px] font-[700] text-[#2d3e50] text-center leading-none shrink-0">
          Create Account
        </h2>

        {/* FORM: Auto Layout | Vertical | Spacing 16px */}
        <form onSubmit={handleRegister} className="flex flex-col items-center gap-[16px] w-full shrink-0">

          <div className="flex flex-col gap-[5px] w-full shrink-0">
            <label className="text-[14px] font-[700] text-[#2d3e50] shrink-0">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              required
              className="w-full h-[48px] px-[16px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
            />
          </div>

          <div className="flex flex-col gap-[5px] w-full shrink-0">
            <label className="text-[14px] font-[700] text-[#2d3e50] shrink-0">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full h-[48px] px-[16px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
            />
          </div>

          <div className="flex flex-col gap-[5px] w-full shrink-0">
            <label className="text-[14px] font-[700] text-[#2d3e50] shrink-0">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-[48px] px-[16px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
            />
          </div>

          <div className="flex flex-col gap-[5px] w-full shrink-0">
            <label className="text-[14px] font-[700] text-[#2d3e50] shrink-0">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-[48px] px-[16px] py-[12px] border-[2px] border-solid border-[#f0dece] rounded-[12px] text-[14px] text-[#2d3e50] outline-none transition-all duration-150 bg-white placeholder:text-[#b0b8c1] focus:border-[#d87c5a] box-border"
            />
          </div>

          {error && (
            <p className="w-full text-[13px] text-[#c0392b] bg-[#fdecea] border border-[#f5c6cb] rounded-[8px] px-[12px] py-[10px]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex flex-row items-center justify-center w-full p-[16px] bg-[#d87c5a] text-white text-[15px] font-[700] border-none rounded-full cursor-pointer hover:bg-[#c76b4a] transition-all duration-150 shrink-0 mt-[4px]"
          >
            Sign Up
          </button>
        </form>

        {/* FOOTER ROW */}
        <div className="flex flex-row items-center gap-[6px] shrink-0">
          <span className="text-[14px] text-[#8b9bae]">Already have an account?</span>
          <Link to="/login" className="text-[14px] text-[#d87c5a] font-[500] hover:underline">
            Log in
          </Link>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Register;
