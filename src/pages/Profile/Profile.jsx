import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../firebase/firebase";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      if (displayName !== user?.displayName) profileUpdates.displayName = displayName;
      if (photoURL !== user?.photoURL) profileUpdates.photoURL = photoURL;
      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(firebaseUser, profileUpdates);
      }

      if (newEmail !== user?.email) {
        await updateEmail(firebaseUser, newEmail);
      }

      if (newPassword) {
        await updatePassword(firebaseUser, newPassword);
      }

      setSuccessMsg("Profile updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
      setPhotoFile(null);
    } catch (err) {
      setError(err.message);
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
            <div className="text-center">
              <p className="text-xl font-bold text-[#1f1f1f]">
                {user?.displayName || "No display name set"}
              </p>
              <p className="text-sm text-[#888]">{user?.email}</p>
            </div>
          </div>

          {/* Edit form */}
          <div className="rounded-3xl border border-[#ecdcc8] bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#1f1f1f] mb-6">Edit Profile</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border border-[#ecdcc8] px-4 py-2 text-sm outline-none focus:border-[#de7e52]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="rounded-xl border border-[#ecdcc8] px-4 py-2 text-sm outline-none focus:border-[#de7e52]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="rounded-xl border border-[#ecdcc8] px-4 py-2 text-sm outline-none focus:border-[#de7e52]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#555]">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="rounded-xl border border-[#ecdcc8] px-4 py-2 text-sm outline-none focus:border-[#de7e52]"
                />
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
