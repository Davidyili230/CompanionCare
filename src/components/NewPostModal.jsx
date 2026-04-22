import { useState, useRef } from "react";
import { createCommunityPost } from "../api/community.api";

const FIXED_LABELS = ["Daily", "Train", "Healthy", "Food", "Other"];
const LABEL_COLORS = { bg: "#FFF0E6", text: "#D4631A", dot: "#F08040" };
const MAX_IMAGES = 5;

export default function NewPostModal({
   onClose,
   onSuccess,
}) {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [label, setLabel] = useState("Other");
   const [images, setImages] = useState([]);
   const [video, setVideo] = useState(null);
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState("");

   const imageInputRef = useRef(null);
   const videoInputRef = useRef(null);

   const labelOptions = FIXED_LABELS

   const handleImageChange = (e) => {
      const selected = Array.from(e.target.files);
      const mapped = selected.map((file) => ({
         file,
         preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...mapped].slice(0, MAX_IMAGES));
      e.target.value = "";
   };

   const handleVideoChange = (e) => {
      const file = e.target.files[0];   // only allow one video
      if (file) setVideo({ file, name: file.name });
      e.target.value = "";
   };

   const removeImage = (index) => {
      setImages((prev) => {
         const next = [...prev];
         URL.revokeObjectURL(next[index].preview);
         next.splice(index, 1);
         return next;
      });
   };

   const handleSubmit = async () => {
      if (!title.trim()) return setError("Please enter title");
      if (!content.trim()) return setError("Please enter content");

      setError("");
      setSubmitting(true);
      try {
         await createCommunityPost({
            title,
            content,
            label: label || null,
            images: images.map((i) => i.file),
            video: video?.file || null,
         });
         onSuccess?.();
         onClose();
      } catch (err) {
         setError(err.message || "Fail to publish, try again");
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div
         onClick={onClose}
         style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,24,16,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
         }}
      >
         <div
            onClick={(e) => e.stopPropagation()}
            style={{
               background: "#fff",
               borderRadius: 20,
               padding: "32px 28px",
               width: "100%",
               maxWidth: 560,
               boxShadow: "0 24px 60px rgba(44,24,16,0.18)",
               border: "1.5px solid #F0E8DF",
               display: "flex",
               flexDirection: "column",
               gap: 20,
               maxHeight: "90vh",
               overflowY: "auto",
            }}
         >
            {/* Header */}
            <div
               style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <div>
                  <div
                     style={{ fontSize: 20, fontWeight: 800, color: "#2C1810" }}
                  >
                     ✍️ Publish a new post
                  </div>
                  <div style={{ fontSize: 12, color: "#B0A090", marginTop: 2 }}>
                     Share your idea to community
                  </div>
               </div>
               <button
                  onClick={onClose}
                  style={{
                     background: "#F5EDE6",
                     border: "none",
                     borderRadius: "50%",
                     width: 32,
                     height: 32,
                     cursor: "pointer",
                     fontSize: 14,
                     color: "#9A8A7A",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  ✕
               </button>
            </div>

            {/* Title */}
            <Field label="title">
               <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give a title to your post..."
                  maxLength={100}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#E8854A")}
                  onBlur={(e) => (e.target.style.borderColor = "#F0E8DF")}
               />
            </Field>

            {/* Label */}
            <Field label="Category(option)">
               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {labelOptions.map((l) => {
                     const active = label === l;
                     return (
                        <button
                           key={l}
                           onClick={() => setLabel(l)}
                           style={{
                              padding: "6px 14px",
                              borderRadius: 999,
                              border: `1.5px solid ${active ? "#E8854A" : "#F0E8DF"}`,
                              background: active ? LABEL_COLORS.bg : "#fff",
                              color: active ? LABEL_COLORS.text : "#7A6A5A",
                              fontSize: 12,
                              fontWeight: active ? 700 : 400,
                              cursor: "pointer",
                           }}
                        >
                           {l.charAt(0).toUpperCase() + l.slice(1)}
                        </button>
                     );
                  })}
               </div>
            </Field>

            {/* Content */}
            <Field label="Content">
               <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write down what you want to share..."
                  rows={4}
                  style={{
                     ...inputStyle,
                     resize: "vertical",
                     lineHeight: 1.6,
                     fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#E8854A")}
                  onBlur={(e) => (e.target.style.borderColor = "#F0E8DF")}
               />
            </Field>

            {/* Images */}
            <Field label={`Pic (At most ${MAX_IMAGES}`}>
               {images.length > 0 && (
                  <div
                     style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 6,
                        marginBottom: 8,
                     }}
                  >
                     {images.map((img, i) => (
                        <div
                           key={i}
                           style={{
                              position: "relative",
                              borderRadius: 8,
                              overflow: "hidden",
                              aspectRatio: "1",
                           }}
                        >
                           <img
                              src={img.preview}
                              alt=""
                              style={{
                                 width: "100%",
                                 height: "100%",
                                 objectFit: "cover",
                              }}
                           />
                           <button
                              onClick={() => removeImage(i)}
                              style={{
                                 position: "absolute",
                                 top: 2,
                                 right: 2,
                                 background: "rgba(44,24,16,0.6)",
                                 border: "none",
                                 borderRadius: "50%",
                                 width: 18,
                                 height: 18,
                                 cursor: "pointer",
                                 color: "#fff",
                                 fontSize: 10,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                              }}
                           >
                              ✕
                           </button>
                        </div>
                     ))}
                  </div>
               )}
               {images.length < MAX_IMAGES && (
                  <>
                     <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                     />
                     <button
                        onClick={() => imageInputRef.current.click()}
                        style={uploadBtnStyle}
                     >
                        🖼️ Add image{" "}
                        {images.length > 0
                           ? `(${images.length}/${MAX_IMAGES})`
                           : ""}
                     </button>
                  </>
               )}
            </Field>

            {/* Video */}
            <Field label="Video (at most one)">
               {video ? (
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#FFF0E6",
                        borderRadius: 10,
                        padding: "10px 14px",
                     }}
                  >
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: 8,
                        }}
                     >
                        <span style={{ fontSize: 20 }}>🎬</span>
                        <span
                           style={{
                              fontSize: 12,
                              color: "#7A6A5A",
                              wordBreak: "break-all",
                           }}
                        >
                           {video.name}
                        </span>
                     </div>
                     <button
                        onClick={() => setVideo(null)}
                        style={{
                           background: "none",
                           border: "none",
                           cursor: "pointer",
                           color: "#D4631A",
                           fontSize: 12,
                           fontWeight: 700,
                           flexShrink: 0,
                        }}
                     >
                        Delete
                     </button>
                  </div>
               ) : (
                  <>
                     <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{ display: "none" }}
                     />
                     <button
                        onClick={() => videoInputRef.current.click()}
                        style={uploadBtnStyle}
                     >
                        🎬 Add video
                     </button>
                  </>
               )}
            </Field>

            {/* 上传提示 */}
            {submitting && (
               <div
                  style={{
                     fontSize: 12,
                     color: "#D4631A",
                     background: "#FFF0E6",
                     padding: "10px 14px",
                     borderRadius: 10,
                     textAlign: "center",
                  }}
               >
                  ⏳ Uploading
               </div>
            )}

            {/* Error */}
            {error && (
               <div
                  style={{
                     fontSize: 12,
                     color: "#D4631A",
                     background: "#FFF0E6",
                     padding: "10px 14px",
                     borderRadius: 10,
                  }}
               >
                  ⚠️ {error}
               </div>
            )}

            {/* Actions */}
            <div
               style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
               <button
                  onClick={onClose}
                  disabled={submitting}
                  style={{
                     padding: "10px 22px",
                     borderRadius: 12,
                     border: "1.5px solid #F0E8DF",
                     background: "#fff",
                     color: "#7A6A5A",
                     fontSize: 13,
                     fontWeight: 600,
                     cursor: "pointer",
                  }}
               >
                  Cancel
               </button>
               <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                     padding: "10px 22px",
                     borderRadius: 12,
                     border: "none",
                     background: submitting
                        ? "#E0C8B8"
                        : "linear-gradient(135deg, #E8854A, #D4631A)",
                     color: "#fff",
                     fontSize: 13,
                     fontWeight: 700,
                     cursor: submitting ? "not-allowed" : "pointer",
                     boxShadow: submitting
                        ? "none"
                        : "0 4px 14px rgba(212,99,26,0.28)",
                  }}
               >
                  {submitting ? "Publishing..." : "🚀 Published"}
               </button>
            </div>
         </div>
      </div>
   );
}

function Field({ label, children }) {
   return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
         <label
            style={{
               fontSize: 12,
               fontWeight: 700,
               color: "#B0A090",
               textTransform: "uppercase",
               letterSpacing: 1,
            }}
         >
            {label}
         </label>
         {children}
      </div>
   );
}

const inputStyle = {
   padding: "12px 14px",
   borderRadius: 12,
   border: "1.5px solid #F0E8DF",
   fontSize: 14,
   color: "#2C1810",
   outline: "none",
   background: "#FFFBF8",
   width: "100%",
   boxSizing: "border-box",
};

const uploadBtnStyle = {
   padding: "11px",
   borderRadius: 12,
   border: "1.5px dashed #E8C4A0",
   background: "#FFFBF8",
   color: "#D4631A",
   fontSize: 13,
   fontWeight: 600,
   cursor: "pointer",
   width: "100%",
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
   gap: 8,
};
