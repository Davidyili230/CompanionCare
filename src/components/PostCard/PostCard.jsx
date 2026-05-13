const getVideoCover = (url) => {
   //video - jpg
   return url
      .replace("/upload/", "/upload/w_400,c_scale/")
      .replace(/\.(mp4|mov|avi|webm)$/i, ".jpg");
};

export default function PostCard({ post, onOpen }) {
   //if it is a video, replace by first flame
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

         {/* card containing, show post when click */}
         <div className="post-card" onClick={() => onOpen?.(post)}>
            {cover ? (
               <img
                  src={cover}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
               />
            ) : (
               // 没有图片/视频时显示内容文字
               <div className="absolute inset-0 bg-[#FFF9F0] flex items-center justify-center p-4">
                  <p className="text-[#7A6A5A] text-sm leading-relaxed line-clamp-6 text-center">
                     {post.content || "No content"}
                  </p>
               </div>
            )}
            <div
               className="absolute inset-0"
               style={{
                  background:
                     "linear-gradient(to bottom, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55) 100%)",
               }}
            />
            {/* the video sign */}
            {isVideo && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white text-xl">
                  ▶
               </div>
            )}
            {/* info */}
            <div className="absolute left-0 right-0 bottom-0 p-3 text-white flex items-center justify-between">
               {/* info */}
               <div className="flex items-center gap-2.5 min-w-0">
                  {/* image */}
                  {post.authorAvatar ? (
                     <img
                        src={post.authorAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                     />
                  ) : (
                     <div className="w-7 h-7 rounded-full bg-white/25 grid place-items-center font-extrabold uppercase shrink-0 text-xs">
                        {(post.username || "U")[0]}
                     </div>
                  )}

                  <div className="min-w-0">
                     <div className="text-[13px] font-extrabold leading-4">
                        {post.username || "Anonymous"}
                     </div>
                     <div className="text-sm font-extrabold mt-0.5 truncate max-w-[200px]">
                        {post.title}
                     </div>
                  </div>
               </div>

               <div className="flex flex-col items-center shrink-0 gap-0.5">
                  <span className="text-xl">{liked ? "🧡" : "🤍"}</span>
                  <span className="text-xs font-extrabold">
                     {post.likeCount ?? 0}
                  </span>
               </div>
            </div>
         </div>
      </>
   );
}
const BASE_URL = "http://192.168.1.136:8080";

const fixUrl = (u) => {     // solve the path issue
   if (!u) return "";
   if (u.startsWith("http")) return u;
   if (u.startsWith("/uploads/")) return `${BASE_URL}${u}`;
   return u;
};

export default function PostCard({ post, onOpen }) {
  const cover = fixUrl(post.media?.[0]);

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
      {/* Cover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: cover ? `url("${encodeURI(cover)}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: cover ? "transparent" : "#f2f3f5",
          transform: "scale(1.02)",
        }}
      />

      {/* Gradient if no img just title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Bottom info bar */}
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
        {/* img  name. title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
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

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, lineHeight: "16px" }}>
              {post.username}
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

        {/* 右：like and count */}
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
          <span style={{ fontSize: 12, fontWeight: 800 }}>{post.likes ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

//done
