import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../firebase/firebase";

const EyeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword && !currentPassword) {
      setError("Please enter your current password to set a new one.");
      return;
    }

    setSaving(true);
    try {
      const firebaseUser = auth.currentUser;
      let photoURL = user?.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `avatars/${firebaseUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const profileUpdates = {};
      if (photoURL !== user?.photoURL) profileUpdates.photoURL = photoURL;
      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(firebaseUser, profileUpdates);
      }

      if (newPassword) {
        const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, newPassword);
      }

      setSuccessMsg("Profile updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPhotoFile(null);
    } catch (err) {
      const code = err.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Current password is incorrect.");
      } else if (code === "auth/weak-password") {
        setError("New password must be at least 6 characters.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const avatarLetter = (user?.displayName || user?.email || "?")[0].toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#FFF9F0", boxSizing: "border-box" }}>
      <div style={{ padding: "24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left sidebar */}
          <aside style={{ position: "sticky", top: 24 }}>
            <div className="rounded-3xl border border-[#ecdcc8] bg-white shadow-md overflow-hidden">

              {/* Profile header banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #c96a3a 0%, #de7e52 55%, #f0a47a 100%)",
                  height: 100,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                <div style={{ position: "absolute", bottom: -32, left: -12, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <div style={{ position: "absolute", top: 16, left: 18, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Avatar + name */}
              <div className="flex flex-col items-center px-6 pb-6" style={{ marginTop: -48 }}>

                {/* Avatar with camera badge */}
                <div className="relative" style={{ width: 96, height: 96 }}>
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="rounded-full object-cover w-full h-full ring-4 ring-white shadow-md"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-full text-white text-3xl font-bold w-full h-full ring-4 ring-white shadow-md"
                      style={{ background: "linear-gradient(135deg, #c96a3a, #de7e52)" }}
                    >
                      {avatarLetter}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                    style={{ background: "#de7e52" }}
                    title="Change photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>

                {/* Name + email + badge */}
                <div className="mt-3 text-center">
                  {user?.displayName && (
                    <p className="text-lg font-bold text-[#1f1f1f] leading-tight">{user.displayName}</p>
                  )}
                  <p className="text-xs text-[#aaa] mt-0.5">{user?.email}</p>
                  <span
                    className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{ background: "#fdf0e8", color: "#de7e52" }}
                  >
                    Pet Parent
                  </span>
                </div>

                {/* Gradient divider */}
                <div className="w-full mt-5" style={{ height: 1, background: "linear-gradient(to right, transparent, #ecdcc8, transparent)" }} />

                {/* Password section */}
                <div className="w-full mt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#de7e52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#bbb]">Change Password</p>
                  </div>
                  <form onSubmit={handleSave} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#777]">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Current password"
                          className="w-full rounded-xl border border-[#ecdcc8] bg-[#fdf7f2] px-3 pr-9 py-2.5 text-sm outline-none focus:border-[#de7e52] transition-colors"
                        />
                        <button type="button" onClick={() => setShowCurrentPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#de7e52] transition-colors" tabIndex={-1}>
                          {showCurrentPassword ? <EyeOff /> : <EyeOn />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#777]">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full rounded-xl border border-[#ecdcc8] bg-[#fdf7f2] px-3 pr-9 py-2.5 text-sm outline-none focus:border-[#de7e52] transition-colors"
                        />
                        <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#de7e52] transition-colors" tabIndex={-1}>
                          {showNewPassword ? <EyeOff /> : <EyeOn />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#777]">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full rounded-xl border border-[#ecdcc8] bg-[#fdf7f2] px-3 pr-9 py-2.5 text-sm outline-none focus:border-[#de7e52] transition-colors"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#de7e52] transition-colors" tabIndex={-1}>
                          {showConfirmPassword ? <EyeOff /> : <EyeOn />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-600" style={{ background: "#fff1f0", border: "1px solid #ffd6d6" }}>
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    )}
                    {successMsg && (
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-green-700" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {successMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-1 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
                      style={{
                        background: saving ? "#e8a07a" : "linear-gradient(135deg, #c96a3a, #de7e52)",
                        cursor: saving ? "not-allowed" : "pointer",
                      }}
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </form>
                </div>

                {/* Gradient divider */}
                <div className="w-full mt-5" style={{ height: 1, background: "linear-gradient(to right, transparent, #ecdcc8, transparent)" }} />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 border border-[#ecdcc8] text-[#888] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
          </aside>

          {/* Right main area (empty) */}
          <main
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #F0E8DF",
              minHeight: 400,
            }}
          />
        </div>
      </div>
    </div>
  );
}
