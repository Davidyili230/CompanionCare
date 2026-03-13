import { useEffect, useState, useMemo } from "react";
import { fetchCommunityPosts } from "../../api/community.api";
import PostCard from "../../components/PostCard/PostCard";
import PostModal from "../../components/PostModal/PostModal";
import Navbar from "../../components/Navbar/Navbar";

const TIME_FILTERS = [
   { label: "All time", days: null },
   { label: "Last 7 days", days: 7 },
   { label: "Last 30 days", days: 30 },
   { label: "Last 90 days", days: 90 },
];

const LABEL_COLORS = { bg: "#FFF0E6", text: "#D4631A", dot: "#F08040" };

export default function Community() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [selectedPost, setSelectedPost] = useState(null);
   const [activeLabel, setActiveLabel] = useState("All");
   const [activeDays, setActiveDays] = useState(null);
   const [search, setSearch] = useState("");

   useEffect(() => {
      fetchCommunityPosts()
         .then((data) => setPosts(data.items || []))
         .catch((err) => setError(err.message))
         .finally(() => setLoading(false));
   }, []);

   const allLabels = useMemo(() => {
      // get all the label
      const unique = new Set(
         posts
            .map((p) => p.label)
            .filter((l) => l !== null && l !== undefined && l !== ""),
      );
      return ["All", ...Array.from(unique)];
   }, [posts]);

   const filteredPosts = useMemo(() => {
      const now = new Date();
      return posts.filter((p) => {
         if (activeLabel !== "All" && p.label !== activeLabel) return false;
         if (activeDays !== null) {
            const cutoff = new Date(now - activeDays * 86400000);
            if (new Date(p.createdAt) < cutoff) return false;
         }
         if (search.trim() !== "") {
            const q = search.toLowerCase();
            if (
               !p.title?.toLowerCase().includes(q) &&
               !p.content?.toLowerCase().includes(q)
            )
               return false;
         }
         return true;
      });
   }, [posts, activeLabel, activeDays, search]);

   return (
      <div
         style={{
            minHeight: "100vh",
            background: "#FFF9F0",
            boxSizing: "border-box",
         }}
      >
         <Navbar />

         <div style={{ padding: "24px" }}>
            <div
               style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "1fr 3fr",
                  gap: 28,
                  alignItems: "start",
               }}
            >
               <aside
                  style={{
                     position: "sticky",
                     top: 24,
                     display: "flex",
                     flexDirection: "column",
                     gap: 14,
                  }}
               >
                  <button
                     style={{
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 14,
                        border: "none",
                        background: "linear-gradient(135deg, #E8854A, #D4631A)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(212,99,26,0.28)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                     }}
                  >
                     ➕ New Post
                  </button>

                  <div
                     style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "18px 16px",
                        border: "1.5px solid #F0E8DF",
                     }}
                  >
                     <div
                        style={{
                           fontSize: 11,
                           fontWeight: 800,
                           color: "#B0A090",
                           textTransform: "uppercase",
                           letterSpacing: 1.1,
                           marginBottom: 10,
                        }}
                     >
                        Category
                     </div>

                     {allLabels.map((l) => {
                        const active = activeLabel === l;
                        return (
                           <button
                              key={l}
                              onClick={() => setActiveLabel(l)}
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 8,
                                 width: "100%",
                                 padding: "8px 10px",
                                 borderRadius: 10,
                                 border: "none",
                                 cursor: "pointer",
                                 marginBottom: 2,
                                 fontSize: 13,
                                 fontWeight: active ? 700 : 400,
                                 transition: "all 0.15s",
                                 background: active
                                    ? l === "All"
                                       ? "#FFF0E6"
                                       : LABEL_COLORS.bg
                                    : "transparent",
                                 color: active
                                    ? l === "All"
                                       ? "#D4631A"
                                       : LABEL_COLORS.text
                                    : "#6A5A4A",
                              }}
                           >
                              {l === "All" ? (
                                 <span style={{ fontSize: 14 }}>🏠</span>
                              ) : (
                                 <span
                                    style={{
                                       width: 8,
                                       height: 8,
                                       borderRadius: "50%",
                                       flexShrink: 0,
                                       background: active
                                          ? LABEL_COLORS.dot
                                          : "#D0C8BE",
                                    }}
                                 />
                              )}
                              {l.charAt(0).toUpperCase() + l.slice(1)}
                           </button>
                        );
                     })}

                     <div
                        style={{
                           height: 1,
                           background: "#F0E8DF",
                           margin: "14px 0",
                        }}
                     />

                     <div
                        style={{
                           fontSize: 11,
                           fontWeight: 800,
                           color: "#B0A090",
                           textTransform: "uppercase",
                           letterSpacing: 1.1,
                           marginBottom: 10,
                        }}
                     >
                        Time Range
                     </div>

                     {TIME_FILTERS.map((tf) => {
                        const active = activeDays === tf.days;
                        return (
                           <button
                              key={tf.label}
                              onClick={() => setActiveDays(tf.days)}
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 8,
                                 width: "100%",
                                 padding: "8px 10px",
                                 borderRadius: 10,
                                 border: "none",
                                 cursor: "pointer",
                                 marginBottom: 2,
                                 fontSize: 13,
                                 fontWeight: active ? 700 : 400,
                                 transition: "all 0.15s",
                                 background: active ? "#FFF0E6" : "transparent",
                                 color: active ? "#D4631A" : "#6A5A4A",
                              }}
                           >
                              <span style={{ fontSize: 13 }}>
                                 {active ? "🕐" : "○"}
                              </span>
                              {tf.label}
                           </button>
                        );
                     })}
                  </div>

                  <div
                     style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "18px 16px",
                        border: "1.5px solid #F0E8DF",
                     }}
                  >
                     <div
                        style={{
                           fontSize: 11,
                           fontWeight: 800,
                           color: "#B0A090",
                           textTransform: "uppercase",
                           letterSpacing: 1.1,
                           marginBottom: 12,
                        }}
                     >
                        Community Stats
                     </div>
                     <div
                        style={{
                           display: "flex",
                           flexDirection: "column",
                           gap: 8,
                        }}
                     >
                        <div
                           style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                           }}
                        >
                           <span style={{ color: "#7A6A5A" }}>
                              📝 Total Posts
                           </span>
                           <span style={{ fontWeight: 700, color: "#2C1810" }}>
                              {posts.length}
                           </span>
                        </div>
                        <div
                           style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                           }}
                        >
                           <span style={{ color: "#7A6A5A" }}>🐾 Members</span>
                           <span style={{ fontWeight: 700, color: "#2C1810" }}>
                              {new Set(posts.map((p) => p.username)).size}
                           </span>
                        </div>
                     </div>
                  </div>
               </aside>

               <main>
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        border: "1.5px solid #F0E8DF",
                        borderRadius: 999,
                        padding: "10px 20px",
                        marginBottom: 20,
                     }}
                  >
                     <span style={{ fontSize: 14, color: "#B0A090" }}>🔍</span>
                     <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search posts..."
                        style={{
                           border: "none",
                           outline: "none",
                           background: "transparent",
                           fontSize: 14,
                           color: "#2C1810",
                           width: "100%",
                        }}
                     />
                  </div>

                  {loading && <p style={{ color: "#9A8A7A" }}>Loading...</p>}
                  {error && <p style={{ color: "#D4631A" }}>{error}</p>}

                  {!loading && filteredPosts.length === 0 && (
                     <div
                        style={{
                           textAlign: "center",
                           padding: "60px 0",
                           color: "#B0A090",
                        }}
                     >
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                           No posts match your filters
                        </div>
                     </div>
                  )}

                  {!loading && filteredPosts.length > 0 && (
                     <div
                        style={{
                           display: "grid",
                           gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                           gap: 20,
                           alignItems: "start",
                        }}
                     >
                        {filteredPosts.map((post) => (
                           <PostCard
                              key={post.id}
                              post={post}
                              onOpen={() => setSelectedPost(post)}
                           />
                        ))}
                     </div>
                  )}
               </main>
            </div>
         </div>

         {selectedPost && (
            <PostModal
               key={selectedPost.id}
               post={selectedPost}
               onClose={() => setSelectedPost(null)}
            />
         )}
      </div>
   );
}
