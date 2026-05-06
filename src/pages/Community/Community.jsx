<<<<<<< Updated upstream
import { useEffect, useState, useMemo } from "react";
import { fetchCommunityPosts } from "../../api/community.api";
import PostCard from "../../components/PostCard/PostCard";
import PostModal from "../../components/PostModal/PostModal";
import NewPostModal from "../../components/NewPostModal";

const TIME_FILTERS = [
   //time filter
   { label: "All time", days: null },
   { label: "Last 7 days", days: 7 },
   { label: "Last 30 days", days: 30 },
   { label: "Last 90 days", days: 90 },
];

const FIXED_LABELS = ["All", "Daily", "Train", "Healthy", "Food", "Other"]; //label
const LABEL_COLORS = { bg: "#FFF0E6", text: "#D4631A", dot: "#F08040" }; //color

const toDate = (val) => {
   //convert to js data object
   if (!val) return null;
   if (val?.toDate) return val.toDate();
   return new Date(val);
};

function FilterButton({ active, onClick, children }) {
   //when i user filterbutton, the content inside is children
   return (
      <button
         onClick={onClick}
         className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl border-none cursor-pointer mb-0.5 text-sm transition-all duration-150 ${
            active
               ? "font-bold bg-[#FFF0E6] text-[#D4631A]"
               : "font-normal bg-transparent text-[#6A5A4A]"
         }`}
      >
         {children}
      </button>
   );
}

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
      //check ismobile or window
      const handler = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
   }, []);

   const loadPosts = async () => {
      //get all the post from backend
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
      //filter, refetch the post when it get clicked
      const now = new Date();
      return posts.filter((p) => {
         if (activeLabel !== "All" && p.label !== activeLabel) return false; //base on label
         if (activeDays !== null) {
            //base on time
            const cutoff = new Date(now - activeDays * 86400000);
            const postDate = toDate(p.createdAt);
            if (!postDate || postDate < cutoff) return false;
         }
         if (search.trim()) {
            //base on content or title
            const q = search.toLowerCase();
            if (
               !p.title?.toLowerCase().includes(q) &&
               !p.content?.toLowerCase().includes(q) &&
               !p.username?.toLowerCase().includes(q)
            )
               return false;
         }
         return true;
      });
   }, [posts, activeLabel, activeDays, search]);

   const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount ?? 0), 0);
   const memberCount = new Set(posts.map((p) => p.username)).size;
   const activeFilterCount = // for phone shows how many filter u choose
      (activeLabel !== "All" ? 1 : 0) + (activeDays !== null ? 1 : 0);

   const SidebarContent = () => (
      <>
         {/* 分类筛选卡片 */}
         <div className="bg-white rounded-2xl p-4 border border-[#F0E8DF]">
            <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-2">
               Category
            </div>

            {/* render the category button */}
            {FIXED_LABELS.map((l) => {
               const active = activeLabel === l;
               return (
                  <FilterButton
                     key={l}
                     active={active}
                     onClick={() => {
                        setActiveLabel(l);
                        if (isMobile) setShowMobileFilter(false);
                     }}
                  >
                     {l === "All" ? (
                        <span className="text-sm">🏠</span>
                     ) : (
                        <span
                           className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-[#F08040]" : "bg-[#D0C8BE]"}`}
                        />
                     )}
                     {l.charAt(0).toUpperCase() + l.slice(1)}
                  </FilterButton>
               );
            })}

            <div className="h-px bg-[#F0E8DF] my-3" />
            <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-2">
               Time Range
            </div>

            {/* render time button */}
            {TIME_FILTERS.map((tf) => {
               const active = activeDays === tf.days;
               return (
                  <FilterButton
                     key={tf.label}
                     active={active}
                     onClick={() => {
                        setActiveDays(tf.days);
                        if (isMobile) setShowMobileFilter(false);
                     }}
                  >
                     <span className="text-sm">{active ? "🕐" : "○"}</span>
                     {tf.label}
                  </FilterButton>
               );
            })}
         </div>

         {/* stat card */}
         <div className="bg-white rounded-2xl p-4 border border-[#F0E8DF]">
            <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-3">
               Community Stats
            </div>
            <div className="flex flex-col gap-2">
               {[
                  { icon: "📝", label: "Total Posts", value: posts.length },
                  { icon: "🐾", label: "Members", value: memberCount },
                  { icon: "❤️", label: "Total Likes", value: totalLikes },
               ].map(({ icon, label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                     <span className="text-[#7A6A5A]">
                        {icon} {label}
                     </span>
                     <span className="font-bold text-[#2C1810]">{value}</span>
                  </div>
               ))}
            </div>
         </div>
      </>
   );

   return (
      <>
         {/* for filter bar in mobile */}
         <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            .mobile-drawer { animation: slideInRight 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
         `}</style>

         {/* main container */}
         <div className={isMobile ? "p-3 pb-20" : "p-6"}>
            <div
               className={`max-w-[1200px] mx-auto ${isMobile ? "block" : "grid grid-cols-[1fr_3fr] gap-7 items-start"}`}
            >
               {/* side bar */}
               {!isMobile && (
                  <aside className="sticky top-6 flex flex-col gap-3">
                     {/* add new post */}
                     <button
                        onClick={() => setShowNewPost(true)}
                        className="w-full py-3 rounded-2xl border-none text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md"
                        style={{
                           background:
                              "linear-gradient(135deg, #E8854A, #D4631A)",
                           boxShadow: "0 4px 14px rgba(212,99,26,0.28)",
                        }}
                     >
                        Add New Post
                     </button>
                     <SidebarContent />
                  </aside>
               )}

               <main>
                  {/* search bar */}
                  <div className="flex items-center gap-2 bg-white border border-[#F0E8DF] rounded-full px-5 py-2.5 mb-4">
                     <span className="text-sm text-[#B0A090]">🔍</span>
                     <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search posts..."
                        className="border-none outline-none bg-transparent text-sm text-[#2C1810] w-full"
                     />
                  </div>

                  {loading && <p className="text-[#9A8A7A]">Loading...</p>}
                  {error && <p className="text-[#D4631A]">{error}</p>}
                  {!loading && filteredPosts.length === 0 && (
                     <div className="text-center py-16 text-[#B0A090]">
                        <div className="text-5xl mb-3">🐾</div>
                        <div className="text-base font-semibold">
                           No posts match your filters
                        </div>
                     </div>
                  )}

                  {/* size for phone or computer */}
                  {!loading && filteredPosts.length > 0 && (
                     <div
                        className={`grid gap-5 items-start ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-3"}`}
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

         {/* button bar fixed */}
         {isMobile && (
            <div
               className="fixed bottom-0 left-0 right-0 bg-[#FFF9F0] border-t border-[#F0E8DF] px-6 py-2.5 flex gap-3 z-[100]"
               style={{
                  paddingBottom: "max(10px, env(safe-area-inset-bottom))",
               }}
            >
               {/* add new post */}
               <button
                  onClick={() => setShowNewPost(true)}
                  className="flex-1 py-3 rounded-2xl border-none text-white text-sm font-bold cursor-pointer"
                  style={{
                     background: "linear-gradient(135deg, #E8854A, #D4631A)",
                  }}
               >
                  Add New Post
               </button>

               {/* filter button */}
               <button
                  onClick={() => setShowMobileFilter(true)}
                  className={`px-5 py-3 rounded-2xl border text-sm font-bold cursor-pointer flex items-center gap-1.5 ${activeFilterCount > 0 ? "bg-[#FFF0E6] text-[#D4631A] border-[#F0E8DF]" : "bg-white text-[#6A5A4A] border-[#F0E8DF]"}`}
               >
                  🔧 Filter
                  {/* number of filter that selected */}
                  {activeFilterCount > 0 && (
                     <span className="bg-[#D4631A] text-white rounded-full text-[11px] font-black w-4 h-4 grid place-items-center">
                        {activeFilterCount}
                     </span>
                  )}
               </button>
            </div>
         )}

         {isMobile && showMobileFilter && (
            <div
               className="fixed inset-0 z-[200] flex justify-end bg-black/40"
               style={{ animation: "fadeIn 0.2s ease" }}
               onClick={(e) => {
                  if (e.target === e.currentTarget) setShowMobileFilter(false);
               }}
            >
               <div
                  className="mobile-drawer bg-[#FFF9F0] w-[min(320px,85vw)] h-full overflow-y-auto flex flex-col gap-3 p-6"
                  style={{
                     paddingBottom: "max(24px, env(safe-area-inset-bottom))",
                  }}
               >
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-black text-base">Filter</span>
                     <button
                        onClick={() => setShowMobileFilter(false)}
                        className="bg-none border-none text-xl cursor-pointer text-[#666]"
                     >
                        ✕
                     </button>
                  </div>
                  <SidebarContent />
               </div>
            </div>
         )}

         {/* pop up card */}
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

//done