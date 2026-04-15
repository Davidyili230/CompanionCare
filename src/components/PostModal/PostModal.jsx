import { useEffect, useState } from "react";
import {
   fetchComments,
   addComment as apiAddComment,
   toggleLike,
   checkLiked,
} from "../../api/community.api";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

// const BASE_URL = "http://192.168.1.136:8080";
const BASE_URL = "http://localhost:8080";

export default function PostModal({ post, onClose }) {
   const images = post?.images || [];
   const video = post?.video || null;
   const [idx, setIdx] = useState(0);

   // comment
   const [comments, setComments] = useState([]);
   const [text, setText] = useState("");
   const [submittingComment, setSubmittingComment] = useState(false);

   // like
   const [liked, setLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);

   // loading
   useEffect(() => {
      if (!post?.id) return;

      // loading comment
      fetchComments(post.id).then(setComments).catch(console.error);

      // check if liked already
      checkLiked(post.id).then(setLiked).catch(console.error);
   }, [post?.id]);

   useEffect(() => {
      setLikeCount(post?.likeCount ?? 0);
   }, [post]);
   
   useEffect(() => {
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

   const createdAtStr = post.createdAt?.toDate
      ? post.createdAt.toDate().toLocaleString()
      : "";

   // sent comment
   const handleAddComment = async () => {
      const t = text.trim();
      if (!t || !post?.id) return;
      setSubmittingComment(true);
      try {
         await apiAddComment(post.id, t);
         // reload
         const updated = await fetchComments(post.id);
         setComments(updated);
         setText("");
      } catch (err) {
         console.error(err);
      } finally {
         setSubmittingComment(false);
      }
   };
   
const handleToggleLike = async () => {
   if (!post?.id) return;

   try {
      await toggleLike(post.id);

      // fetch data
      const snap = await getDoc(doc(db, "posts", post.id));
      const data = snap.data();

      setLikeCount(data.likeCount);

      const isLiked = await checkLiked(post.id);
      setLiked(isLiked);

   } catch (err) {
      console.error(err);
   }
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
            {/* 左边：图片/视频 */}
            <div
               style={{
                  position: "relative",
                  background: "#FFF9F0",
                  minWidth: 0,
                  overflow: "hidden",
               }}
            >
               {images.length > 0 ? (
                  <img
                     src={images[idx]}
                     alt=""
                     style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                     }}
                  />
               ) : video ? (
                  <video
                     src={video}
                     controls
                     style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        background: "#000",
                     }}
                  />
               ) : (
                  <div style={{ color: "#999", padding: 20 }}>No media</div>
               )}

               {/* 关闭按钮 */}
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
               >
                  ✕
               </button>

               {/* 多图切换箭头 */}
               {images.length > 1 && (
                  <>
                     <button
                        onClick={() => setIdx((v) => Math.max(0, v - 1))}
                        disabled={idx === 0}
                        style={arrowStyle("left")}
                     >
                        ‹
                     </button>
                     <button
                        onClick={() =>
                           setIdx((v) => Math.min(images.length - 1, v + 1))
                        }
                        disabled={idx === images.length - 1}
                        style={arrowStyle("right")}
                     >
                        ›
                     </button>
                  </>
               )}

               {/* 底部缩略图 */}
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
                           src={src}
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

            {/* 右边：信息 + 评论 */}
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
               {/* 点赞按钮 */}
               <button
                  onClick={handleToggleLike}
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
               >
                  {liked ? "🧡" : "🤍"}
                  <span style={{ fontSize: 12, color: "#999" }}>
                     {likeCount}
                  </span>
               </button>

               {/* 发帖人信息 */}
               <div style={{ flex: "0 0 auto" }}>
                  <div
                     style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                     {post.authorAvatar ? (
                        <img
                           src={post.authorAvatar}
                           alt=""
                           style={{
                              width: 34,
                              height: 34,
                              borderRadius: 999,
                              objectFit: "cover",
                           }}
                        />
                     ) : (
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
                     )}
                     <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 900 }}>
                           {post.username || "Anonymous"}
                        </div>
                        <div style={{ fontSize: 12, color: "#666" }}>
                           #{post.label}
                        </div>
                     </div>
                  </div>

                  <div style={{ fontSize: 18, fontWeight: 900, marginTop: 10 }}>
                     {post.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                     {createdAtStr}
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
                     Comments ({comments.length})
                  </div>
               </div>

               {/* 评论列表 */}
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
                  {comments.length === 0 && (
                     <div
                        style={{
                           color: "#B0A090",
                           fontSize: 13,
                           textAlign: "center",
                           marginTop: 20,
                        }}
                     >
                        No comments yet
                     </div>
                  )}
                  {comments.map((c) => (
                     <div key={c.id} style={{ display: "flex", gap: 10 }}>
                        {c.authorAvatar ? (
                           <img
                              src={c.authorAvatar}
                              alt=""
                              style={{
                                 width: 28,
                                 height: 28,
                                 borderRadius: 999,
                                 objectFit: "cover",
                                 flexShrink: 0,
                              }}
                           />
                        ) : (
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
                              {(c.username || "U")[0]}
                           </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                           <div style={{ fontWeight: 900, fontSize: 12 }}>
                              {c.username || "Anonymous"}
                           </div>
                           <div style={{ fontSize: 13, color: "#333" }}>
                              {c.content}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* 输入评论 */}
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
                           background: "#fff",
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") handleAddComment();
                        }}
                     />
                     <button
                        onClick={handleAddComment}
                        disabled={submittingComment}
                        style={{
                           padding: "10px 12px",
                           borderRadius: 10,
                           border: "1px solid #506705",
                           background: submittingComment ? "#ccc" : "#c4960d",
                           color: "#fff",
                           fontWeight: 900,
                           cursor: submittingComment
                              ? "not-allowed"
                              : "pointer",
                           whiteSpace: "nowrap",
                        }}
                     >
                        {submittingComment ? "..." : "Send"}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function arrowStyle(side) {
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
