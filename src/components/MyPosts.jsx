import { useEffect, useState } from "react";
import { fetchMyPosts } from "../api/community.api";
import { checkLiked } from "../api/community.api";
import PostModal from "./PostModal/PostModal";

const getVideoCover = (url) => {
   return url
      .replace("/upload/", "/upload/w_400,c_scale/")
      .replace(/\.(mp4|mov|avi|webm)$/i, ".jpg");
};

export default function MyPosts() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedPost, setSelectedPost] = useState(null);
   const [likedMap, setLikedMap] = useState({});

   const loadPosts = async () => {
      try {
         const data = await fetchMyPosts();
         setPosts(data);

         const results = await Promise.all(
            data.map(async (post) => {
               try {
                  const isLiked = await checkLiked(post.id);
                  return [post.id, isLiked];
               } catch {
                  return [post.id, false];
               }
            }),
         );

         setLikedMap(Object.fromEntries(results));
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadPosts();
   }, []);

   if (loading)
      return <p style={{ color: "#9A8A7A", fontSize: 14 }}>Loading...</p>;

   if (posts.length === 0)
      return (
         <div
            style={{ textAlign: "center", padding: "60px 0", color: "#B0A090" }}
         >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No posts yet</div>
         </div>
      );

   return (
      <>
         <div
            style={{
               fontSize: 11,
               fontWeight: 800,
               color: "#B0A090",
               textTransform: "uppercase",
               letterSpacing: 1.1,
               marginBottom: 16,
            }}
         >
            My Posts ({posts.length})
         </div>

         <div
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
               gap: 16,
            }}
         >
            {posts.map((post) => {
               const cover =
                  post.images?.[0] ||
                  (post.video ? getVideoCover(post.video) : null);
               const isVideo = !post.images?.[0] && !!post.video;

               return (
                  <div
                     key={post.id}
                     onClick={() => setSelectedPost(post)}
                     style={{
                        position: "relative",
                        height: 300,
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "1px solid #e6e8ee",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                     }}
                  >
                     {/* 封面 */}
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
                              width: 36,
                              height: 36,
                              borderRadius: 999,
                              background: "rgba(0,0,0,0.5)",
                              display: "grid",
                              placeItems: "center",
                              color: "#fff",
                              fontSize: 16,
                           }}
                        >
                           ▶
                        </div>
                     )}
                     {/* 底部信息：label + title + like */}
                     <div
                        style={{
                           position: "absolute",
                           left: 0,
                           right: 0,
                           bottom: 0,
                           padding: 10,
                           color: "#fff",
                           display: "flex",
                           alignItems: "flex-end",
                           justifyContent: "space-between",
                           gap: 8,
                        }}
                     >
                        <div style={{ minWidth: 0 }}>
                           <div
                              style={{
                                 fontSize: 11,
                                 color: "rgba(255,255,255,0.75)",
                                 marginBottom: 3,
                              }}
                           >
                              #{post.label}
                           </div>
                           <div
                              style={{
                                 fontSize: 13,
                                 fontWeight: 800,
                                 whiteSpace: "nowrap",
                                 overflow: "hidden",
                                 textOverflow: "ellipsis",
                              }}
                           >
                              {post.title}
                           </div>
                        </div>
                        <div
                           style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                              gap: 1,
                           }}
                        >
                           <span style={{ fontSize: 18 }}>
                              {likedMap[post.id] ? "🧡" : "🤍"}
                           </span>
                           <span style={{ fontSize: 11, fontWeight: 800 }}>
                              {post.likeCount ?? 0}
                           </span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {selectedPost && (
            <PostModal
               key={selectedPost.id}
               post={selectedPost}
               onClose={() => {
                  setSelectedPost(null);
                  loadPosts();
               }}
            />
         )}
      </>
   );
}
