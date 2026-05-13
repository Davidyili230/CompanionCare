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

   if (loading) return <p className="text-[#9A8A7A] text-sm">Loading...</p>;

   // when no post
   if (posts.length === 0)
      return (
         <div className="text-center py-16 text-[#B0A090]">
            <div className="text-5xl mb-3">🐾</div>
            <div className="text-base font-semibold">No posts yet</div>
         </div>
      );

   return (
      <>
         <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-4">
            My Posts ({posts.length})
         </div>
         <div
            className="grid gap-4"
            style={{
               gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
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
                     className="relative h-[300px] rounded-xl overflow-hidden cursor-pointer border border-[#e6e8ee]"
                     style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}
                  >
                     {cover ? (
                        <img
                           src={cover}
                           alt=""
                           className="absolute inset-0 w-full h-full object-cover"
                        />
                     ) : (
                        <div className="absolute inset-0 bg-[#FFF9F0] flex items-center justify-center p-4">
                           <p
                              className="text-[#7A6A5A] text-sm leading-relaxed text-center"
                              style={{
                                 display: "-webkit-box",
                                 WebkitLineClamp: 6,
                                 WebkitBoxOrient: "vertical",
                                 overflow: "hidden",
                              }}
                           >
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
                     {isVideo && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 grid place-items-center text-white text-base">
                           ▶
                        </div>
                     )}

                     {/* info */}
                     <div className="absolute left-0 right-0 bottom-0 p-2.5 text-white flex items-end justify-between gap-2">
                        <div className="min-w-0">
                           <div className="text-[11px] text-white/75 mb-0.5">
                              #{post.label}
                           </div>
                           <div className="text-[13px] font-extrabold truncate">
                              {post.title}
                           </div>
                        </div>
                        <div className="flex flex-col items-center shrink-0 gap-0.5">
                           <span className="text-lg">
                              {likedMap[post.id] ? "🧡" : "🤍"}
                           </span>
                           <span className="text-[11px] font-extrabold">
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

//done
