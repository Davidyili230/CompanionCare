import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = "http://192.168.1.136:8080";

const fixUrl = (u) => {     // solve the path issue
   if (!u) return "";
   if (u.startsWith("http")) return u;
   if (u.startsWith("/uploads/")) return `${BASE_URL}${u}`;
   return u;
};

const DEFAULT_COMMENTS = [    // will delete
   { id: "c1", user: "Emily", text: "So cute dog" },
   { id: "c2", user: "David", text: "Where is this" },
];

export default function PostModal({ post, onClose }) {
   const { user } = useAuth();
   const currentUser = user?.username ?? "";
   const images = useMemo(() => post?.media || [], [post]);
   const [idx, setIdx] = useState(0);

   const [commentsByPost, setCommentsByPost] = useState({});
   const comments = commentsByPost[post?.id] ?? DEFAULT_COMMENTS;
   const [text, setText] = useState("");

   const [likedByPost, setLikedByPost] = useState({});
   const liked = likedByPost[post?.id]?.includes(currentUser) ?? false;
   const likeCount = (post?.likes ?? 0) + (liked ? 1 : 0);

   const toggleLike = () => { //check if the users click like or not
      if (!post?.id) return;
      setLikedByPost((prev) => {
         const users = prev[post.id] ?? [];
         const alreadyLiked = users.includes(currentUser);
         return {
            ...prev,
            [post.id]: alreadyLiked
               ? users.filter((u) => u !== currentUser)
               : [...users, currentUser],
         };
      });
   };

   useEffect(() => {    // register some key in keyboard, only change when images length change and onCLos
      const onKey = (e) => {
         if (e.key === "Escape") onClose?.();
         if (e.key === "ArrowLeft") setIdx((v) => Math.max(0, v - 1));
         if (e.key === "ArrowRight")
            setIdx((v) => Math.min(images.length - 1, v + 1));
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [onClose, images.length]);

   if (!post) return null;

   const cover = fixUrl(images[idx]);

   const addComment = () => {
      const t = text.trim();
      if (!t || !post?.id) return;
      setCommentsByPost((prev) => {
         const curr = prev[post.id] ?? DEFAULT_COMMENTS;
         return {
            ...prev,
            [post.id]: [
               ...curr,
               { id: "c" + Date.now(), user: currentUser, text: t },
            ],
         };
      });
      setText("");
   };

   return (
      <div
         onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
         }}
         style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: 18,
         }}
      >
        {/* style for pic and comment area */}
         <div
            style={{
               width: "min(1100px, 96vw)",
               height: "min(720px, 92vh)",
               background: "#FFF9F0",
               borderRadius: 18,
               overflow: "hidden",
               display: "grid",
               gridTemplateColumns: "1.2fr 0.8fr",
               alignItems: "stretch",
            }}
         >
            {/* LEFT: images */}
            <div
               style={{
                  position: "relative",
                  background: "#FFF9F0",
                  minWidth: 0,
                  overflow: "hidden",
               }}
            >
               {/* img area */}
               {cover ? (
                  <img
                     src={cover}
                     alt=""
                     style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                     }}
                  />
               ) : (
                  <div style={{ color: "#999", padding: 20 }}>No images</div>
               )}

               <button
                  onClick={onClose}
                  style={{
                     position: "absolute",
                     top: 12,
                     right: 12,
                     width: 36,
                     height: 36,
                     borderRadius: 999,
                     border: "1px solid rgba(255,255,255,0.25)",
                     background: "rgba(0,0,0,0.35)",
                     color: "#fff",
                     cursor: "pointer",
                     fontSize: 16,
                     fontWeight: 900,
                  }}
                  aria-label="Close"
               >
                  ✕
               </button>

               {images.length > 1 && (
                  <>
                     <button
                        onClick={() => setIdx((v) => Math.max(0, v - 1))}
                        disabled={idx === 0}
                        style={arrowStyle("left")}
                        aria-label="Previous image"
                     >
                        ‹
                     </button>
                     <button
                        onClick={() =>
                           setIdx((v) => Math.min(images.length - 1, v + 1))
                        }
                        disabled={idx === images.length - 1}
                        style={arrowStyle("right")}
                        aria-label="Next image"
                     >
                        ›
                     </button>
                  </>
               )}

               {images.length > 1 && (  
                  <div
                     style={{
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: 12,
                        display: "flex",
                        gap: 8,
                        overflowX: "auto",
                        paddingBottom: 4,
                     }}
                  >
                     {images.map((src, i) => (
                        <img
                           key={src + i}
                           src={fixUrl(src)}
                           alt=""
                           onClick={() => setIdx(i)}
                           style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 10,
                              border:
                                 i === idx
                                    ? "2px solid #fff"
                                    : "1px solid rgba(255,255,255,0.25)",
                              cursor: "pointer",
                              opacity: i === idx ? 1 : 0.75,
                           }}
                        />
                     ))}
                  </div>
               )}
            </div>

            {/* RIGHT: info + comments */}
            <div
               style={{
                  height: "100%",
                  minHeight: 0,
                  minWidth: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  padding: 16,
                  boxSizing: "border-box",
                  position: "relative",
               }}
            >
               {/* heart button */}
               <button
                  onClick={toggleLike}
                  style={{
                     position: "absolute",
                     top: 16,
                     right: 16,
                     background: "none",
                     border: "none",
                     cursor: "pointer",
                     fontSize: 30,
                     lineHeight: 1,
                     padding: 4,
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     gap: 2,
                  }}
                  aria-label="Like"
               >
                  {liked ? "🧡" : "🤍"}
                  <span style={{ fontSize: 12, color: "#999" }}>
                     {likeCount}
                  </span>
               </button>

               {/* user image */}
               <div style={{ flex: "0 0 auto" }}>
                  <div
                     style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                     <div
                        style={{
                           width: 34,
                           height: 34,
                           borderRadius: 999,
                           background: "rgba(0,0,0,0.08)",
                           display: "grid",
                           placeItems: "center",
                           fontWeight: 900,
                        }}
                     >
                        {(post.username || "U")[0]}
                     </div>
                     <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 900 }}>{post.username}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>
                           #{post.label}
                        </div>
                     </div>
                  </div>

                  <div style={{ fontSize: 18, fontWeight: 900, marginTop: 10 }}>
                     {post.title}
                  </div>

                  {/* time */}
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                     {new Date(post.createdAt).toLocaleString()}
                  </div>

                  <div
                     style={{ color: "#444", lineHeight: "20px", marginTop: 6 }}
                  >
                     {post.content || ""}
                  </div>

                  <div
                     style={{
                        height: 1,
                        background: "#e8e0d5",
                        margin: "12px 0",
                     }}
                  />
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>
                     Comments
                  </div>
               </div>

               {/* comment area */}
               <div
                  style={{
                     flex: "1 1 auto",
                     minHeight: 0,
                     overflowY: "auto",
                     display: "flex",
                     flexDirection: "column",
                     gap: 12,
                     paddingRight: 4,
                  }}
               >
                  {comments.map((c) => (
                     <div key={c.id} style={{ display: "flex", gap: 10 }}>
                        <div
                           style={{
                              width: 28,
                              height: 28,
                              borderRadius: 999,
                              background: "rgba(0,0,0,0.08)",
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 900,
                              fontSize: 12,
                              flexShrink: 0,
                           }}
                        >
                           {(c.user || "U")[0]}
                        </div>
                        <div style={{ minWidth: 0 }}>
                           <div style={{ fontWeight: 900, fontSize: 12 }}>
                              {c.user}
                           </div>
                           <div style={{ fontSize: 13, color: "#333" }}>
                              {c.text}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* enter comment area */}
               <div
                  style={{
                     flex: "0 0 auto",
                     borderTop: "1px solid #e8e0d5",
                     paddingTop: 10,
                     marginTop: 10,
                  }}
               >
                  <div style={{ display: "flex", gap: 8 }}>
                     <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment..."
                        style={{
                           flex: 1,
                           padding: "10px 12px",
                           borderRadius: 10,
                           border: "1px solid #e8e0d5",
                           outline: "none",
                           background: "#fff"
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") addComment();
                        }}
                     />
                     {/*sent button */}
                     <button
                        onClick={addComment}
                        style={{
                           padding: "10px 12px",
                           borderRadius: 10,
                           border: "1px solid #506705",
                           background: "#c4960d",
                           color: "#fff",
                           fontWeight: 900,
                           cursor: "pointer",
                           whiteSpace: "nowrap",
                        }}
                     >
                        Send
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function arrowStyle(side) {   //shows the arrow position
   return {
      position: "absolute",
      top: "50%",
      [side]: 10,
      transform: "translateY(-50%)",
      width: 40,
      height: 40,
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(0,0,0,0.35)",
      color: "#fff",
      cursor: "pointer",
      fontSize: 22,
      fontWeight: 900,
      display: "grid",
      placeItems: "center",
      userSelect: "none",
   };
}
