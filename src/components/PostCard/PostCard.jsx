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

   return (
      <div
         onClick={() => onOpen?.(post)}
         style={{
            position: "relative",
            width: "100%",
            height: 320,
            borderRadius: 16,
            overflow: "hidden",
            cursor: "pointer",
            background: "#fff",
            border: "1px solid #e6e8ee",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
         }}
      >
         {/* 封面图片 */}
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
            // 没有图片/视频时显示灰色背景
            <div
               style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#f2f3f5",
               }}
            />
         )}

         {/* 渐变遮罩 */}
         <div
            style={{
               position: "absolute",
               inset: 0,
               background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55) 100%)",
            }}
         />

         {/* 视频播放图标 */}
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

         {/* 底部信息栏 */}
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
               {/* 头像：有头像显示图片，没有显示名字首字母 */}
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
                  {/* 发帖人名字 */}
                  <div
                     style={{
                        fontSize: 13,
                        fontWeight: 800,
                        lineHeight: "16px",
                     }}
                  >
                     {post.username || "Anonymous"}
                  </div>
                  {/* 帖子标题 */}
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

            {/* 点赞数 */}
            <div
               style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  gap: 2,
               }}
            >
               <span style={{ fontSize: 20 }}>🤍</span>
               <span style={{ fontSize: 12, fontWeight: 800 }}>
                  {post.likeCount ?? 0}
               </span>
            </div>
         </div>
      </div>
   );
}
