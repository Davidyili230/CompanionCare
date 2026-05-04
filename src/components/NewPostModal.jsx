import { useState, useRef } from "react";
import { createCommunityPost } from "../api/community.api";

const FIXED_LABELS = ["Daily", "Train", "Healthy", "Food", "Other"];
const LABEL_COLORS = { bg: "#FFF0E6", text: "#D4631A", dot: "#F08040" };
const MAX_IMAGES = 5;

export default function NewPostModal({ onClose, onSuccess }) {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [label, setLabel] = useState("Other");
   const [images, setImages] = useState([]);
   const [video, setVideo] = useState(null);
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState("");

   const imageInputRef = useRef(null);
   const videoInputRef = useRef(null);

   const handleImageChange = (e) => {
      // allow 5 image
      const selected = Array.from(e.target.files);
      const mapped = selected.map((file) => ({
         file,
         preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...mapped].slice(0, MAX_IMAGES));
      e.target.value = "";
   };

   const handleVideoChange = (e) => {
      const file = e.target.files[0]; // only allow one video
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
      // submit post
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
         className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
         style={{
            background: "rgba(44,24,16,0.45)",
            backdropFilter: "blur(4px)",
         }}
      >
         <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[20px] w-full max-w-[560px] flex flex-col gap-5 max-h-[90vh] overflow-y-auto border border-[#F0E8DF]"
            style={{
               padding: "32px 28px",
               boxShadow: "0 24px 60px rgba(44,24,16,0.18)",
            }}
         >
            {/* top title */}
            <div className="flex justify-between items-center">
               <div>
                  <div className="text-xl font-extrabold text-[#2C1810]">
                     ✍️ Publish a new post
                  </div>
                  <div className="text-xs text-[#B0A090] mt-0.5">
                     Share your idea to community
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F5EDE6] border-none cursor-pointer text-sm text-[#9A8A7A] flex items-center justify-center"
               >
                  ✕
               </button>
            </div>

            {/* title */}
            <Field label="Title">
               <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give a title to your post..."
                  maxLength={100}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#F0E8DF] text-sm text-[#2C1810] outline-none bg-[#FFFBF8] box-border focus:border-[#E8854A] transition-colors"
               />
            </Field>

            {/* category */}
            <Field label="Category (optional)">
               <div className="flex gap-2 flex-wrap">
                  {FIXED_LABELS.map((l) => {
                     const active = label === l;
                     return (
                        <button
                           key={l}
                           onClick={() => setLabel(l)}
                           className={`px-3.5 py-1.5 rounded-full text-xs cursor-pointer transition-all ${
                              active
                                 ? "border-[#E8854A] bg-[#FFF0E6] text-[#D4631A] font-bold border-[1.5px]"
                                 : "border-[#F0E8DF] bg-white text-[#7A6A5A] font-normal border-[1.5px]"
                           }`}
                        >
                           {l.charAt(0).toUpperCase() + l.slice(1)}
                        </button>
                     );
                  })}
               </div>
            </Field>

            {/* content */}
            <Field label="Content">
               <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write down what you want to share..."
                  rows={4}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#F0E8DF] text-sm text-[#2C1810] outline-none bg-[#FFFBF8] box-border resize-y leading-relaxed focus:border-[#E8854A] transition-colors"
                  style={{ fontFamily: "inherit" }}
               />
            </Field>

            {/* image */}
            <Field label={`Pic (at most ${MAX_IMAGES})`}>
               {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                     {images.map((img, i) => (
                        <div
                           key={i}
                           className="relative rounded-lg overflow-hidden aspect-square"
                        >
                           <img
                              src={img.preview}
                              alt=""
                              className="w-full h-full object-cover"
                           />
                           <button
                              onClick={() => removeImage(i)}
                              className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full border-none cursor-pointer text-white text-[10px] flex items-center justify-center bg-[rgba(44,24,16,0.6)]"
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
                        className="hidden"
                     />
                     <button
                        onClick={() => imageInputRef.current.click()}
                        className="w-full py-3 rounded-xl border-[1.5px] border-dashed border-[#E8C4A0] bg-[#FFFBF8] text-[#D4631A] text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
                     >
                        🖼️ Add image{" "}
                        {images.length > 0
                           ? `(${images.length}/${MAX_IMAGES})`
                           : ""}
                     </button>
                  </>
               )}
            </Field>

            {/* video */}
            <Field label="Video (at most one)">
               {video ? (
                  <div className="flex items-center justify-between bg-[#FFF0E6] rounded-xl px-3.5 py-2.5">
                     <div className="flex items-center gap-2">
                        <span className="text-xl">🎬</span>
                        <span className="text-xs text-[#7A6A5A] break-all">
                           {video.name}
                        </span>
                     </div>
                     <button
                        onClick={() => setVideo(null)}
                        className="bg-none border-none cursor-pointer text-[#D4631A] text-xs font-bold shrink-0"
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
                        className="hidden"
                     />
                     <button
                        onClick={() => videoInputRef.current.click()}
                        className="w-full py-3 rounded-xl border-[1.5px] border-dashed border-[#E8C4A0] bg-[#FFFBF8] text-[#D4631A] text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
                     >
                        🎬 Add video
                     </button>
                  </>
               )}
            </Field>

            {submitting && (
               <div className="text-xs text-[#D4631A] bg-[#FFF0E6] px-3.5 py-2.5 rounded-xl text-center">
                  ⏳ Uploading...
               </div>
            )}

            {error && (
               <div className="text-xs text-[#D4631A] bg-[#FFF0E6] px-3.5 py-2.5 rounded-xl">
                  ⚠️ {error}
               </div>
            )}

            <div className="flex gap-2.5 justify-end">
               <button
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl border border-[#F0E8DF] bg-white text-[#7A6A5A] text-sm font-semibold cursor-pointer"
               >
                  Cancel
               </button>
               <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-5 py-2.5 rounded-xl border-none text-white text-sm font-bold ${submitting ? "bg-[#E0C8B8] cursor-not-allowed" : "cursor-pointer"}`}
                  style={{
                     background: submitting
                        ? "#E0C8B8"
                        : "linear-gradient(135deg, #E8854A, #D4631A)",
                     boxShadow: submitting
                        ? "none"
                        : "0 4px 14px rgba(212,99,26,0.28)",
                  }}
               >
                  {submitting ? "Publishing..." : "🚀 Publish"}
               </button>
            </div>
         </div>
      </div>
   );
}

function Field({ label, children }) {
   return (
      <div className="flex flex-col gap-1.5">
         <label className="text-xs font-bold text-[#B0A090] uppercase tracking-wider">
            {label}
         </label>
         {children}
      </div>
   );
}

//done