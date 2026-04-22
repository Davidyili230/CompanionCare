import { useEffect, useState, useMemo } from "react";
import { fetchCommunityPosts } from "../../api/community.api";
import PostCard from "../../components/PostCard/PostCard";
import PostModal from "../../components/PostModal/PostModal";
import NewPostModal from "../../components/NewPostModal";
import NewPostModal from "../../components/NewPostModal";

const TIME_FILTERS = [
   { label: "All time", days: null },
   { label: "Last 7 days", days: 7 },
   { label: "Last 30 days", days: 30 },
   { label: "Last 90 days", days: 90 },
];

const FIXED_LABELS = ["All", "Daily", "Train", "Healthy", "Food", "Other"];
const LABEL_COLORS = { bg: "#FFF0E6", text: "#D4631A", dot: "#F08040" };

const toDate = (val) => {
   if (!val) return null;
   if (val?.toDate) return val.toDate();
   return new Date(val);
};

export default function Community() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [selectedPost, setSelectedPost] = useState(null);
   const [activeLabel, setActiveLabel] = useState("All");
   const [activeDays, setActiveDays] = useState(null);
   const [search, setSearch] = useState("");
   const [showNewPost, setShowNewPost] = useState(false);
   const [showMobileFilter, setShowMobileFilter] = useState(false);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

   useEffect(() => {
      const handler = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
   }, []);

   const loadPosts = async () => {
      setLoading(true);
      try {
         const data = await fetchCommunityPosts();
         setPosts(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadPosts();
   }, []);

   const filteredPosts = useMemo(() => {
      const now = new Date();
      return posts.filter((p) => {
         if (activeLabel !== "All" && p.label !== activeLabel) return false;
         if (activeDays !== null) {
            const cutoff = new Date(now - activeDays * 86400000);
            const postDate = toDate(p.createdAt);
            if (!postDate || postDate < cutoff) return false;
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

   const totalLikes = useMemo(
      () => posts.reduce((sum, p) => sum + (p.likeCount ?? 0), 0),
      [posts],
   );
   const memberCount = useMemo(
      () => new Set(posts.map((p) => p.username)).size,
      [posts],
   );
   const activeFilterCount =
      (activeLabel !== "All" ? 1 : 0) + (activeDays !== null ? 1 : 0);

   const SidebarContent = () => (
      <>
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
            {FIXED_LABELS.map((l) => {
               const active = activeLabel === l;
               return (
                  <button
                     key={l}
                     onClick={() => {
                        setActiveLabel(l);
                        if (isMobile) setShowMobileFilter(false);
                     }}
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
                              background: active ? LABEL_COLORS.dot : "#D0C8BE",
                           }}
                        />
                     )}
                     {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
               );
            })}
            <div
               style={{ height: 1, background: "#F0E8DF", margin: "14px 0" }}
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
                     onClick={() => {
                        setActiveDays(tf.days);
                        if (isMobile) setShowMobileFilter(false);
                     }}
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
                     <span style={{ fontSize: 13 }}>{active ? "🕐" : "○"}</span>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
               <div
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                     fontSize: 13,
                  }}
               >
                  <span style={{ color: "#7A6A5A" }}>📝 Total Posts</span>
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
                     {memberCount}
                  </span>
               </div>
               <div
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                     fontSize: 13,
                  }}
               >
                  <span style={{ color: "#7A6A5A" }}>❤️ Total Likes</span>
                  <span style={{ fontWeight: 700, color: "#2C1810" }}>
                     {totalLikes}
                  </span>
               </div>
            </div>
         </div>
      </>
   );

   return (
      <>
         <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            .mobile-drawer { animation: slideInRight 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
         `}</style>

         <div
            style={{ padding: isMobile ? "12px 16px 80px" : "16px 24px 24px" }}
         >
            <div
               style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  display: isMobile ? "block" : "grid",
                  gridTemplateColumns: "1fr 3fr",
                  gap: 28,
                  alignItems: "start",
               }}
            >
               {!isMobile && (
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
                        onClick={() => setShowNewPost(true)}
                        style={{
                           width: "100%",
                           padding: "12px 0",
                           borderRadius: 14,
                           border: "none",
                           background:
                              "linear-gradient(135deg, #E8854A, #D4631A)",
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
                     <SidebarContent />
                  </aside>
               )}
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
                        marginBottom: 16,
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
                           gridTemplateColumns: isMobile
                              ? "repeat(2, minmax(0, 1fr))"
                              : "repeat(3, minmax(0, 1fr))",
                           gap: isMobile ? 12 : 20,
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

         {isMobile && (
            <div
               style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "#FFF9F0",
                  borderTop: "1.5px solid #F0E8DF",
                  padding: "10px 24px",
                  paddingBottom: "max(10px, env(safe-area-inset-bottom))",
                  display: "flex",
                  gap: 12,
                  zIndex: 100,
               }}
            >
               <button
                  onClick={() => setShowNewPost(true)}
                  style={{
                     flex: 1,
                     padding: "12px 0",
                     borderRadius: 14,
                     border: "none",
                     background: "linear-gradient(135deg, #E8854A, #D4631A)",
                     color: "#fff",
                     fontSize: 14,
                     fontWeight: 700,
                     cursor: "pointer",
                  }}
               >
                  ➕ New Post
               </button>
               <button
                  onClick={() => setShowMobileFilter(true)}
                  style={{
                     padding: "12px 18px",
                     borderRadius: 14,
                     border: "1.5px solid #F0E8DF",
                     background: activeFilterCount > 0 ? "#FFF0E6" : "#fff",
                     color: activeFilterCount > 0 ? "#D4631A" : "#6A5A4A",
                     fontSize: 14,
                     fontWeight: 700,
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     gap: 6,
                  }}
               >
                  🔧 Filter
                  {activeFilterCount > 0 && (
                     <span
                        style={{
                           background: "#D4631A",
                           color: "#fff",
                           borderRadius: 999,
                           fontSize: 11,
                           fontWeight: 900,
                           width: 18,
                           height: 18,
                           display: "grid",
                           placeItems: "center",
                        }}
                     >
                        {activeFilterCount}
                     </span>
                  )}
               </button>
            </div>
         )}

         {isMobile && showMobileFilter && (
            <div
               style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 200,
                  display: "flex",
                  justifyContent: "flex-end",
                  background: "rgba(0,0,0,0.4)",
                  animation: "fadeIn 0.2s ease",
               }}
               onClick={(e) => {
                  if (e.target === e.currentTarget) setShowMobileFilter(false);
               }}
            >
               <div
                  className="mobile-drawer"
                  style={{
                     width: "min(320px, 85vw)",
                     height: "100%",
                     background: "#FFF9F0",
                     overflowY: "auto",
                     padding: "24px 16px",
                     paddingBottom: "max(24px, env(safe-area-inset-bottom))",
                     display: "flex",
                     flexDirection: "column",
                     gap: 14,
                  }}
               >
                  <div
                     style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                     }}
                  >
                     <span style={{ fontWeight: 900, fontSize: 16 }}>
                        Filter
                     </span>
                     <button
                        onClick={() => setShowMobileFilter(false)}
                        style={{
                           background: "none",
                           border: "none",
                           fontSize: 20,
                           cursor: "pointer",
                           color: "#666",
                        }}
                     >
                        ✕
                     </button>
                  </div>
                  <SidebarContent />
               </div>
            </div>
         )}

         {selectedPost && (
            <PostModal
               key={selectedPost.id}
               post={selectedPost}
               onClose={async () => {
                  setSelectedPost(null);
                  await loadPosts();
               }}
            />
         )}
         {showNewPost && (
            <NewPostModal
               onClose={() => setShowNewPost(false)}
               onSuccess={async () => {
                  setShowNewPost(false);
                  await loadPosts();
               }}
               existingLabels={FIXED_LABELS.slice(1)}
            />
         )}
      </>
   );
}
