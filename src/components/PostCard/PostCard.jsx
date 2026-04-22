import { useEffect, useState } from "react";
import { checkLiked } from "../../api/community.api";

const getVideoCover = (url) => {
   return url
      .replace("/upload/", "/upload/w_400,c_scale/")
      .replace(/\.(mp4|mov|avi|webm)$/i, ".jpg");
};

export default function PostCard({ post, onOpen }) {
   const firstImage = post.images?.[0];
   const videoUrl = post.video;

   let cover = null;
   let isVideo = false;

   if (firstImage) {
      cover = firstImage;
   } else if (videoUrl) {
      cover = getVideoCover(videoUrl);
      isVideo = true;
   }

   const [liked, setLiked] = useState(false);

   useEffect(() => {
      checkLiked(post.id)
         .then(setLiked)
         .catch(() => {});
   }, [post.id]);

   return (
      <>
         <style>{`
            .post-card {
               position: relative;
               width: 100%;
               height: 320px;
               border-radius: 16px;
               overflow: hidden;
               cursor: pointer;
               background: #fff;
               border: 1px solid #e6e8ee;
               box-shadow: 0 6px 18px rgba(0,0,0,0.06);
               transition: transform 0.15s ease, box-shadow 0.15s ease;
            }
            .post-card:hover {
               transform: translateY(-2px);
               box-shadow: 0 10px 28px rgba(0,0,0,0.1);
            }
            .post-card:active {
               transform: scale(0.98);
            }
            @media (max-width: 640px) {
               .post-card {
                  height: 240px;
                  border-radius: 12px;
               }
            }
         `}</style>

         <div className="post-card" onClick={() => onOpen?.(post)}>
            {cover ? (
               <img
                  src={cover}
                  alt=""
                  style={{
                     position: "absolute",
                     inset: 0,
                     width: "100%",
                     height: "100%",
                     objectFit: "cover",
                     objectPosition: "center",
                  }}
               />
            ) : (
               <div
                  style={{
                     position: "absolute",
                     inset: 0,
                     backgroundColor: "#f2f3f5",
                  }}
               />
            )}

            <div
               style={{
                  position: "absolute",
                  inset: 0,
                  background:
                     "linear-gradient(to bottom, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55) 100%)",
               }}
            />

            {isVideo && (
               <div
                  style={{
                     position: "absolute",
                     top: "50%",
                     left: "50%",
                     transform: "translate(-50%, -50%)",
                     width: 48,
                     height: 48,
                     borderRadius: 999,
                     background: "rgba(0,0,0,0.5)",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     color: "#fff",
                     fontSize: 20,
                  }}
               >
                  ▶
               </div>
            )}

            <div
               style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: 12,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}
            >
               <div
                  style={{
                     display: "flex",
                     alignItems: "center",
                     gap: 10,
                     minWidth: 0,
                  }}
               >
                  {post.authorAvatar ? (
                     <img
                        src={post.authorAvatar}
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
                           background: "rgba(255,255,255,0.25)",
                           display: "grid",
                           placeItems: "center",
                           fontWeight: 800,
                           textTransform: "uppercase",
                           flexShrink: 0,
                        }}
                     >
                        {(post.username || "U")[0]}
                     </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                     <div
                        style={{
                           fontSize: 13,
                           fontWeight: 800,
                           lineHeight: "16px",
                        }}
                     >
                        {post.username || "Anonymous"}
                     </div>
                     <div
                        style={{
                           fontSize: 14,
                           fontWeight: 800,
                           marginTop: 2,
                           whiteSpace: "nowrap",
                           overflow: "hidden",
                           textOverflow: "ellipsis",
                           maxWidth: 200,
                        }}
                     >
                        {post.title}
                     </div>
                  </div>
               </div>

               {/*  */}
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     flexShrink: 0,
                     gap: 2,
                  }}
               >
                  <span style={{ fontSize: 20 }}>{liked ? "🧡" : "🤍"}</span>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>
                     {post.likeCount ?? 0}
                  </span>
               </div>
            </div>
         </div>
      </>
   );
}

