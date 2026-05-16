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
    <div>
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Avatar + name header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="relative group" style={{ width: 80, height: 80 }}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-full text-white text-3xl font-bold w-full h-full"
                  style={{ background: "#de7e52" }}
                >
                  {avatarLetter}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </div>

          {/* Edit form */}
          <div className="rounded-3xl border border-[#ecdcc8] bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#1f1f1f] mb-6">Edit Profile</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Required to change password"
                    className="w-full rounded-xl border border-[#ecdcc8] px-4 pr-10 py-2 text-sm outline-none focus:border-[#de7e52]"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#de7e52] transition-colors" tabIndex={-1}>
                    {showCurrentPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full rounded-xl border border-[#ecdcc8] px-4 pr-10 py-2 text-sm outline-none focus:border-[#de7e52]"
                  />
                  <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#de7e52] transition-colors" tabIndex={-1}>
                    {showNewPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-[#ecdcc8] px-4 pr-10 py-2 text-sm outline-none focus:border-[#de7e52]"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8c1] hover:text-[#de7e52] transition-colors" tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

              <button
                type="submit"
                disabled={saving}
                className="mt-2 rounded-full py-2 text-sm font-semibold text-white transition-opacity"
                style={{ background: "#de7e52", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Logout */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLogout}
              className="rounded-full px-6 py-2 text-sm font-semibold text-[#de7e52] border border-[#de7e52] hover:bg-[#f7e9df] transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
