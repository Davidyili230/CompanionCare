import { useEffect, useState } from "react";
import {
   fetchComments,
   addComment as apiAddComment,
   toggleLike,
   checkLiked,
   deleteComment,
   deletePost,
} from "../../api/community.api";
import { auth } from "../../firebase";

export default function PostModal({ post, onClose }) {
   const images = post?.images || [];
   const video = post?.video || null;
   const [idx, setIdx] = useState(0);

   const [comments, setComments] = useState([]);
   const [text, setText] = useState("");
   const [submittingComment, setSubmittingComment] = useState(false);

   const [liked, setLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);

   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   useEffect(() => {
      const handler = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
   }, []);

   useEffect(() => {
      if (!post?.id) return;
      fetchComments(post.id).then(setComments).catch(console.error);
      checkLiked(post.id).then(setLiked).catch(console.error);
   }, [post?.id]);

   useEffect(() => {
      setLikeCount(post?.likeCount ?? 0);
   }, [post]);

   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = "";
      };
   }, []);

   useEffect(() => {
      const onKey = (e) => {
         if (e.key === "Escape") onClose?.();
         if (e.key === "ArrowLeft") setIdx((v) => Math.max(0, v - 1));
         if (e.key === "ArrowRight") setIdx((v) => Math.min(images.length - 1, v + 1));
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [onClose, images.length]);

   if (!post) return null;

   const createdAtStr = post.createdAt?.toDate
      ? post.createdAt.toDate().toLocaleString()
      : "";

   const currentUid = auth.currentUser?.uid;

   const handleAddComment = async () => {
      const t = text.trim();
      if (!t || !post?.id) return;
      setSubmittingComment(true);
      try {
         await apiAddComment(post.id, t);
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
      const wasLiked = liked;
      setLiked(!wasLiked);
      setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
      try {
         await toggleLike(post.id);
      } catch (err) {
         setLiked(wasLiked);
         setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
         console.error(err);
      }
   };

   const handleDeleteComment = async (commentId) => {
      if (!window.confirm("Delete this comment?")) return;
      try {
         await deleteComment(post.id, commentId);
         setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (err) {
         console.error(err);
      }
   };

   const handleDeletePost = async () => {
      if (!window.confirm("Delete this post?")) return;
      try {
         await deletePost(post.id);
         onClose?.();
      } catch (err) {
         console.error(err);
      }
   };

   // ── 手机布局 ──
   if (isMobile) {
      return (
         <>
            <style>{`
               .modal-comment-list::-webkit-scrollbar { display: none; }
               .modal-comment-list { -ms-overflow-style: none; scrollbar-width: none; }
               @keyframes slideUp {
                  from { transform: translateY(100%); opacity: 0; }
                  to   { transform: translateY(0); opacity: 1; }
               }
               .mobile-modal { animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
            `}</style>
            <div
               onMouseDown={(e) => {
                  if (e.target === e.currentTarget) onClose?.();
               }}
               style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "flex-end",
               }}
            >
               <div
                  className="mobile-modal"
                  style={{
                     width: "100%",
                     maxHeight: "92vh",
                     background: "#FFF9F0",
                     borderRadius: "20px 20px 0 0",
                     display: "flex",
                     flexDirection: "column",
                     overflow: "hidden",
                  }}
               >
                  <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
                     <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D0C8BE" }} />
                  </div>

                  <button
                     onClick={onClose}
                     style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: "none",
                        background: "rgba(0,0,0,0.12)",
                        color: "#444",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 900,
                        display: "grid",
                        placeItems: "center",
                        zIndex: 10,
                     }}
                  >
                     ✕
                  </button>

                  <div
                     style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "4/3",
                        flexShrink: 0,
                        background: "#000",
                     }}
                  >
                     {images.length > 0 ? (
                        <img
                           src={images[idx]}
                           alt=""
                           style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                     ) : video ? (
                        <video
                           src={video}
                           controls
                           style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                     ) : null}

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
                              onClick={() => setIdx((v) => Math.min(images.length - 1, v + 1))}
                              disabled={idx === images.length - 1}
                              style={arrowStyle("right")}
                           >
                              ›
                           </button>
                           <div
                              style={{
                                 position: "absolute",
                                 bottom: 10,
                                 left: "50%",
                                 transform: "translateX(-50%)",
                                 background: "rgba(0,0,0,0.5)",
                                 color: "#fff",
                                 fontSize: 12,
                                 fontWeight: 700,
                                 padding: "3px 10px",
                                 borderRadius: 999,
                              }}
                           >
                              {idx + 1} / {images.length}
                           </div>
                        </>
                     )}
                  </div>

                  <div
                     style={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                     }}
                  >
                     <div style={{ padding: "14px 16px 0" }}>
                        <div
                           style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                           }}
                        >
                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                              <div>
                                 <div style={{ fontWeight: 900, fontSize: 14 }}>
                                    {post.username || "Anonymous"}
                                 </div>
                                 <div style={{ fontSize: 11, color: "#666" }}>#{post.label}</div>
                              </div>
                           </div>

                           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {currentUid === post.authorId && (
                                 <button
                                    onClick={handleDeletePost}
                                    style={{
                                       background: "none",
                                       border: "none",
                                       cursor: "pointer",
                                       fontSize: 13,
                                       color: "#D4631A",
                                       fontWeight: 700,
                                       padding: "4px 8px",
                                       borderRadius: 8,
                                    }}
                                 >
                                    🗑 Delete
                                 </button>
                              )}

                              <button
                                 onClick={handleToggleLike}
                                 style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                 }}
                              >
                                 <span style={{ fontSize: 26 }}>{liked ? "🧡" : "🤍"}</span>
                                 <span style={{ fontSize: 11, color: "#999" }}>{likeCount}</span>
                              </button>
                           </div>
                        </div>

                        <div style={{ fontSize: 17, fontWeight: 900, marginTop: 10 }}>
                           {post.title}
                        </div>
                        <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{createdAtStr}</div>
                        <div
                           style={{
                              color: "#444",
                              lineHeight: "20px",
                              marginTop: 6,
                              fontSize: 14,
                           }}
                        >
                           {post.content || ""}
                        </div>

                        <div style={{ height: 1, background: "#e8e0d5", margin: "12px 0" }} />
                        <div style={{ fontWeight: 900, marginBottom: 8, fontSize: 14 }}>
                           Comments ({comments.length})
                        </div>
                     </div>

                     <div
                        className="modal-comment-list"
                        style={{
                           flex: 1,
                           overflowY: "auto",
                           padding: "0 16px",
                           display: "flex",
                           flexDirection: "column",
                           gap: 12,
                        }}
                     >
                        {comments.length === 0 && (
                           <div
                              style={{
                                 color: "#B0A090",
                                 fontSize: 13,
                                 textAlign: "center",
                                 padding: "20px 0",
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

                              <div style={{ minWidth: 0, flex: 1 }}>
                                 <div
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "space-between",
                                    }}
                                 >
                                    <div style={{ fontWeight: 900, fontSize: 12 }}>
                                       {c.username || "Anonymous"}
                                    </div>
                                    {currentUid === c.authorId && (
                                       <button
                                          onClick={() => handleDeleteComment(c.id)}
                                          style={{
                                             background: "none",
                                             border: "none",
                                             cursor: "pointer",
                                             fontSize: 11,
                                             color: "#B0A090",
                                             padding: "0 4px",
                                          }}
                                       >
                                          🗑
                                       </button>
                                    )}
                                 </div>
                                 <div style={{ fontSize: 13, color: "#333" }}>{c.content}</div>
                              </div>
                           </div>
                        ))}

                        <div style={{ height: 8 }} />
                     </div>
                  </div>

                  <div
                     style={{
                        borderTop: "1px solid #e8e0d5",
                        padding: "10px 16px",
                        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
                        background: "#FFF9F0",
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
                              fontSize: 14,
                           }}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment();
                           }}
                        />
                        <button
                           onClick={handleAddComment}
                           disabled={submittingComment}
                           style={{
                              padding: "10px 14px",
                              borderRadius: 10,
                              border: "1px solid #506705",
                              background: submittingComment ? "#ccc" : "#c4960d",
                              color: "#fff",
                              fontWeight: 900,
                              cursor: submittingComment ? "not-allowed" : "pointer",
                              whiteSpace: "nowrap",
                              fontSize: 14,
                           }}
                        >
                           {submittingComment ? "..." : "Send"}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   }

   // ── 桌面布局 ──
   return (
      <>
         <style>{`
            .modal-comment-list::-webkit-scrollbar { width: 4px; }
            .modal-comment-list::-webkit-scrollbar-track { background: transparent; }
            .modal-comment-list::-webkit-scrollbar-thumb { background: #D0C8BE; border-radius: 4px; }
         `}</style>

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
                           onClick={() => setIdx((v) => Math.min(images.length - 1, v + 1))}
                           disabled={idx === images.length - 1}
                           style={arrowStyle("right")}
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
                  }}
               >
                  <div style={{ flex: "0 0 auto" }}>
                     <div
                        style={{
                           display: "flex",
                           alignItems: "flex-start",
                           gap: 10,
                        }}
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
                                 flexShrink: 0,
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
                                 flexShrink: 0,
                              }}
                           >
                              {(post.username || "U")[0]}
                           </div>
                        )}

                        <div style={{ minWidth: 0, flex: 1 }}>
                           <div style={{ fontWeight: 900 }}>{post.username || "Anonymous"}</div>
                           <div style={{ fontSize: 12, color: "#666" }}>#{post.label}</div>
                        </div>

                        <div
                           style={{
                              marginLeft: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              flexShrink: 0,
                           }}
                        >
                           {currentUid === post.authorId && (
                              <button
                                 onClick={handleDeletePost}
                                 style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    color: "#D4631A",
                                    fontWeight: 700,
                                    padding: "4px 8px",
                                    borderRadius: 8,
                                    whiteSpace: "nowrap",
                                 }}
                              >
                                 🗑 Delete post
                              </button>
                           )}

                           <button
                              onClick={handleToggleLike}
                              style={{
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
                                 flexShrink: 0,
                              }}
                           >
                              {liked ? "🧡" : "🤍"}
                              <span style={{ fontSize: 12, color: "#999" }}>{likeCount}</span>
                           </button>
                        </div>
                     </div>

                     <div style={{ fontSize: 18, fontWeight: 900, marginTop: 10 }}>{post.title}</div>
                     <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{createdAtStr}</div>
                     <div style={{ color: "#444", lineHeight: "20px", marginTop: 6 }}>
                        {post.content || ""}
                     </div>

                     <div style={{ height: 1, background: "#e8e0d5", margin: "12px 0" }} />
                     <div style={{ fontWeight: 900, marginBottom: 8 }}>Comments ({comments.length})</div>
                  </div>

                  <div
                     className="modal-comment-list"
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

                           <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                 }}
                              >
                                 <div style={{ fontWeight: 900, fontSize: 12 }}>
                                    {c.username || "Anonymous"}
                                 </div>
                                 {currentUid === c.authorId && (
                                    <button
                                       onClick={() => handleDeleteComment(c.id)}
                                       style={{
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          fontSize: 11,
                                          color: "#B0A090",
                                          padding: "0 4px",
                                       }}
                                    >
                                       🗑
                                    </button>
                                 )}
                              </div>
                              <div style={{ fontSize: 13, color: "#333" }}>{c.content}</div>
                           </div>
                        </div>
                     ))}
                  </div>

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
                              cursor: submittingComment ? "not-allowed" : "pointer",
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
      </>
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