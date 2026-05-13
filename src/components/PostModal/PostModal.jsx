import { useEffect, useState } from "react";
import {
   fetchComments,
   addComment,
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

   const currentUid = auth.currentUser?.uid; // check if delete should be show or not

   const handleAddComment = async () => {
      const t = text.trim();
      if (!t || !post?.id) return;
      setSubmittingComment(true);
      try {
         await addComment(post.id, t);
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
               className="fixed inset-0 bg-black/60 z-[9999] flex items-end"
            >
               <div className="mobile-modal w-full max-h-[92vh] bg-[#FFF9F0] rounded-t-[20px] flex flex-col overflow-hidden">
                  <div className="flex justify-center py-3">
                     <div className="w-9 h-1 rounded-full bg-[#D0C8BE]" />
                  </div>
                  <button
                     onClick={onClose}
                     className="absolute top-4 right-4 w-8 h-8 rounded-full border-none bg-black/10 text-[#444] cursor-pointer text-sm font-black grid place-items-center z-10"
                  >
                     ✕
                  </button>
                  <div
                     className="relative w-full bg-black shrink-0"
                     style={{ aspectRatio: "4/3" }}
                  >
                     {images.length > 0 ? (
                        <img
                           src={images[idx]}
                           alt=""
                           className="w-full h-full object-contain"
                        />
                     ) : video ? (
                        <video
                           src={video}
                           controls
                           className="w-full h-full object-contain"
                        />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF9F0] gap-2">
                           <img
                              src="/Mediabgpic.JPG"
                              alt=""
                              className="w-24 h-24 object-contain opacity-70"
                           />
                           <p className="text-sm font-bold text-[#B0A090]">
                              Next time add a photo please...
                           </p>
                           <p className="text-xs text-[#C0B0A0]">
                              We believe in you 📸
                           </p>
                        </div>
                     )}

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
                                 setIdx((v) =>
                                    Math.min(images.length - 1, v + 1),
                                 )
                              }
                              disabled={idx === images.length - 1}
                              style={arrowStyle("right")}
                           >
                              ›
                           </button>
                           <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                              {idx + 1} / {images.length}
                           </div>
                        </>
                     )}
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                     <div className="p-4 pb-0">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2.5">
                              {post.authorAvatar ? (
                                 <img
                                    src={post.authorAvatar}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover"
                                 />
                              ) : (
                                 <div className="w-8 h-8 rounded-full bg-black/8 grid place-items-center font-black text-sm">
                                    {(post.username || "U")[0]}
                                 </div>
                              )}
                              <div>
                                 <div className="font-black text-sm">
                                    {post.username || "Anonymous"}
                                 </div>
                                 <div className="text-[11px] text-[#666]">
                                    #{post.label}
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-2">
                              {currentUid === post.authorId && (
                                 <button
                                    onClick={handleDeletePost}
                                    className="bg-none border-none cursor-pointer text-[13px] text-[#D4631A] font-bold px-2 py-1 rounded-lg"
                                 >
                                    🗑 Delete
                                 </button>
                              )}
                              <button
                                 onClick={handleToggleLike}
                                 className="bg-none border-none cursor-pointer flex flex-col items-center gap-0.5"
                              >
                                 <span className="text-2xl">
                                    {liked ? "🧡" : "🤍"}
                                 </span>
                                 <span className="text-[11px] text-[#999]">
                                    {likeCount}
                                 </span>
                              </button>
                           </div>
                        </div>

                        {/* post info */}
                        <div className="text-[17px] font-black mt-2.5">
                           {post.title}
                        </div>
                        <div className="text-[11px] text-[#999] mt-0.5">
                           {createdAtStr}
                        </div>
                        <div className="text-[#444] leading-5 mt-1.5 text-sm">
                           {post.content || ""}
                        </div>
                        <div className="h-px bg-[#e8e0d5] my-3" />
                        <div className="font-black mb-2 text-sm">
                           Comments ({comments.length})
                        </div>
                     </div>

                     {/* comment */}
                     <div className="modal-comment-list flex-1 overflow-y-auto px-4 flex flex-col gap-3">
                        {comments.length === 0 && (
                           <div className="text-[#B0A090] text-sm text-center py-5">
                              No comments yet
                           </div>
                        )}
                        {comments.map((c) => (
                           <div key={c.id} className="flex gap-2.5">
                              {/* image */}
                              {c.authorAvatar ? (
                                 <img
                                    src={c.authorAvatar}
                                    alt=""
                                    className="w-7 h-7 rounded-full object-cover shrink-0"
                                 />
                              ) : (
                                 <div className="w-7 h-7 rounded-full bg-black/8 grid place-items-center font-black text-xs shrink-0">
                                    {(c.username || "U")[0]}
                                 </div>
                              )}
                              <div className="min-w-0 flex-1">
                                 <div className="flex items-center justify-between">
                                    <div className="font-black text-xs">
                                       {c.username || "Anonymous"}
                                    </div>
                                    {/* authentication for itself */}
                                    {currentUid === c.authorId && (
                                       <button
                                          onClick={() =>
                                             handleDeleteComment(c.id)
                                          }
                                          className="bg-none border-none cursor-pointer text-[11px] text-[#B0A090] px-1"
                                       >
                                          🗑
                                       </button>
                                    )}
                                 </div>
                                 <div className="text-[13px] text-[#333]">
                                    {c.content}
                                 </div>
                              </div>
                           </div>
                        ))}
                        <div className="h-2" />
                     </div>
                  </div>

                  <div
                     className="border-t border-[#e8e0d5] bg-[#FFF9F0] px-4 pt-2.5"
                     style={{
                        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
                     }}
                  >
                     <div className="flex gap-2">
                        <input
                           value={text}
                           onChange={(e) => setText(e.target.value)}
                           placeholder="Write a comment..."
                           className="flex-1 px-3 py-2.5 rounded-xl border border-[#e8e0d5] outline-none bg-white text-sm"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment();
                           }}
                        />
                        <button
                           onClick={handleAddComment}
                           disabled={submittingComment}
                           className={`px-3.5 py-2.5 rounded-xl border border-[#506705] text-white font-black text-sm whitespace-nowrap ${submittingComment ? "bg-[#ccc] cursor-not-allowed" : "bg-[#c4960d] cursor-pointer"}`}
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
            className="fixed inset-0 bg-black/55 z-[9999] grid place-items-center p-4"
         >
            <div
               className="bg-[#FFF9F0] rounded-[18px] overflow-hidden grid items-stretch"
               style={{
                  width: "min(1100px, 96vw)",
                  height: "min(720px, 92vh)",
                  gridTemplateColumns: "1.2fr 0.8fr",
               }}
            >
               {/* left side */}
               <div className="relative bg-[#FFF9F0] min-w-0 overflow-hidden">
                  {images.length > 0 ? (
                     <img
                        src={images[idx]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain"
                     />
                  ) : video ? (
                     <video
                        src={video}
                        controls
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                     />
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF9F0] gap-3">
                        <img
                           src="/Mediabgpic.JPG"
                           alt=""
                           className="w-100 h-100 object-contain opacity-70"
                        />
                        <p className="text-base font-bold text-[#B0A090]">
                           Next time add a photo/video please...
                        </p>
                        <p className="text-xs text-[#C0B0A0]">
                           We believe in you 📸
                        </p>
                     </div>
                  )}

                  <button
                     onClick={onClose}
                     className="absolute top-3 right-3 w-9 h-9 rounded-full border border-white/25 bg-black/35 text-white cursor-pointer text-base font-black"
                  >
                     ✕
                  </button>

                  {/* the arrow when image more than 2 */}
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

                  {images.length > 1 && (
                     <div className="absolute left-3 right-3 bottom-3 flex gap-2 overflow-x-auto pb-1">
                        {images.map((src, i) => (
                           <img
                              key={src + i}
                              src={src}
                              alt=""
                              onClick={() => setIdx(i)}
                              className="w-16 h-16 object-cover rounded-xl cursor-pointer shrink-0"
                              style={{
                                 border:
                                    i === idx
                                       ? "2px solid #fff"
                                       : "1px solid rgba(255,255,255,0.25)",
                                 opacity: i === idx ? 1 : 0.75,
                              }}
                           />
                        ))}
                     </div>
                  )}
               </div>

               {/* right side */}
               <div className="h-full min-h-0 min-w-0 overflow-hidden flex flex-col p-4 box-border">
                  <div className="shrink-0">
                     <div className="flex items-start gap-2.5">
                        {post.authorAvatar ? (
                           <img
                              src={post.authorAvatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                           />
                        ) : (
                           <div className="w-8 h-8 rounded-full bg-black/8 grid place-items-center font-black shrink-0">
                              {(post.username || "U")[0]}
                           </div>
                        )}

                        <div className="min-w-0 flex-1">
                           <div className="font-black">
                              {post.username || "Anonymous"}
                           </div>
                           <div className="text-xs text-[#666]">
                              #{post.label}
                           </div>
                        </div>
                        <div className="ml-auto flex items-center gap-2.5 shrink-0">
                           {currentUid === post.authorId && (
                              <button
                                 onClick={handleDeletePost}
                                 className="bg-none border-none cursor-pointer text-[13px] text-[#D4631A] font-bold px-2 py-1 rounded-lg whitespace-nowrap"
                              >
                                 🗑 Delete post
                              </button>
                           )}
                           <button
                              onClick={handleToggleLike}
                              className="bg-none border-none cursor-pointer text-3xl leading-none p-1 flex flex-col items-center gap-0.5 shrink-0"
                           >
                              {liked ? "🧡" : "🤍"}
                              <span className="text-xs text-[#999]">
                                 {likeCount}
                              </span>
                           </button>
                        </div>
                     </div>

                     {/* post info */}
                     <div className="text-lg font-black mt-2.5">
                        {post.title}
                     </div>
                     <div className="text-xs text-[#999] mt-1">
                        {createdAtStr}
                     </div>
                     <div className="text-[#444] leading-5 mt-1.5">
                        {post.content || ""}
                     </div>

                     <div className="h-px bg-[#e8e0d5] my-3" />
                     <div className="font-black mb-2">
                        Comments ({comments.length})
                     </div>
                  </div>

                  <div className="modal-comment-list flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1">
                     {comments.length === 0 && (
                        <div className="text-[#B0A090] text-sm text-center mt-5">
                           No comments yet
                        </div>
                     )}
                     {comments.map((c) => (
                        <div key={c.id} className="flex gap-2.5">
                           {c.authorAvatar ? (
                              <img
                                 src={c.authorAvatar}
                                 alt=""
                                 className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                           ) : (
                              <div className="w-7 h-7 rounded-full bg-black/8 grid place-items-center font-black text-xs shrink-0">
                                 {(c.username || "U")[0]}
                              </div>
                           )}
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                 <div className="font-black text-xs">
                                    {c.username || "Anonymous"}
                                 </div>
                                 {currentUid === c.authorId && (
                                    <button
                                       onClick={() => handleDeleteComment(c.id)}
                                       className="bg-none border-none cursor-pointer text-[11px] text-[#B0A090] px-1"
                                    >
                                       🗑
                                    </button>
                                 )}
                              </div>
                              <div className="text-[13px] text-[#333]">
                                 {c.content}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="shrink-0 border-t border-[#e8e0d5] pt-2.5 mt-2.5">
                     <div className="flex gap-2">
                        <input
                           value={text}
                           onChange={(e) => setText(e.target.value)}
                           placeholder="Write a comment..."
                           className="flex-1 px-3 py-2.5 rounded-xl border border-[#e8e0d5] outline-none bg-white"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment();
                           }}
                        />
                        <button
                           onClick={handleAddComment}
                           disabled={submittingComment}
                           className={`px-3 py-2.5 rounded-xl border border-[#506705] text-white font-black cursor-pointer whitespace-nowrap ${submittingComment ? "bg-[#ccc] cursor-not-allowed" : "bg-[#c4960d]"}`}
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

// left right arrow
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
import { useEffect, useMemo, useState } from "react";

const BASE_URL = "http://192.168.1.136:8080";

const fixUrl = (u) => {     // solve the path issue
   if (!u) return "";
   if (u.startsWith("http")) return u;
   if (u.startsWith("/uploads/")) return `${BASE_URL}${u}`;
   return u;
};

const CURRENT_USER = "Anthony";   // will delete
const DEFAULT_COMMENTS = [    // will delete
   { id: "c1", user: "Emily", text: "So cute dog" },
   { id: "c2", user: "David", text: "Where is this" },
];

export default function PostModal({ post, onClose }) {
   const images = useMemo(() => post?.media || [], [post]);
   const [idx, setIdx] = useState(0);

   const [commentsByPost, setCommentsByPost] = useState({});
   const comments = commentsByPost[post?.id] ?? DEFAULT_COMMENTS;
   const [text, setText] = useState("");

   const [likedByPost, setLikedByPost] = useState({});
   const liked = likedByPost[post?.id]?.includes(CURRENT_USER) ?? false;
   const likeCount = (post?.likes ?? 0) + (liked ? 1 : 0);

   const toggleLike = () => { //check if the users click like or not
      if (!post?.id) return;
      setLikedByPost((prev) => {
         const users = prev[post.id] ?? [];
         const alreadyLiked = users.includes(CURRENT_USER);
         return {
            ...prev,
            [post.id]: alreadyLiked
               ? users.filter((u) => u !== CURRENT_USER)
               : [...users, CURRENT_USER],
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
               { id: "c" + Date.now(), user: CURRENT_USER, text: t },
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

//done
