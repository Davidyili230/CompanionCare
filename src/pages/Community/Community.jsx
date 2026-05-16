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

const TIME_COLORS = [
   { bg: "#FFF0E6", text: "#D4631A" },
   { bg: "#FFF4EC", text: "#D4731A" },
   { bg: "#FFF8F2", text: "#C47030" },
   { bg: "#FFFCF8", text: "#B06828" },
];

const FIXED_LABELS = ["All", "Daily", "Train", "Healthy", "Food", "Other"]; //label
const LABEL_COLORS = {
   Daily: { bg: "#FFF0E6", text: "#D4631A", dot: "#E8854A" },
   Train: { bg: "#FFF4E6", text: "#D4831A", dot: "#EFA050" },
   Healthy: { bg: "#FFF7EC", text: "#C47820", dot: "#E8A86A" },
   Food: { bg: "#FFFAF0", text: "#B07030", dot: "#DDB880" },
   Other: { bg: "#FFFCF5", text: "#A06828", dot: "#D4C090" },
};

const SORT_OPTIONS = [
   { label: "🕐 Latest", value: "createdAt" },
   { label: "🔥 Most Liked", value: "likeCount" },
   { label: "🎲 Random", value: "random" },
];

const SORT_COLORS = [
   { bg: "#FFF0E6", text: "#D4631A" }, // Latest - 最深
   { bg: "#FFF5EC", text: "#C47020" }, // Most Liked
   { bg: "#FFFAF5", text: "#B06828" }, // Random - 最浅
];

const toDate = (val) => {
   //convert to js data object
   if (!val) return null;
   if (val?.toDate) return val.toDate();
   return new Date(val);
};

function FilterButton({ active, onClick, children, color }) {
   return (
      <button
         onClick={onClick}
         className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border-none cursor-pointer mb-0.5 text-sm transition-all duration-150"
         style={{
            fontWeight: active ? 700 : 400,
            background: active ? color?.bg || "#FFF0E6" : "transparent",
            color: active ? color?.text || "#D4631A" : "#6A5A4A",
         }}
      >
         {children}
      </button>
   );
}

function AskAI() {
   const [question, setQuestion] = useState("");
   const [answer, setAnswer] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleAsk = async () => {
      const q = question.trim();
      if (!q || loading) return;

      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (!apiKey) {
         setError("Groq API key is missing. Check your .env file.");
         return;
      }

      setLoading(true);
      setError("");
      setAnswer("");

      try {
         const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
               },
               body: JSON.stringify({
                  model: "llama-3.1-8b-instant",
                  messages: [
                     {
                        role: "system",
                        content:
                           "You are a helpful pet care assistant. Answer clearly and briefly.",
                     },
                     {
                        role: "user",
                        content: q,
                     },
                  ],
               }),
            },
         );

         const data = await res.json();

         if (!res.ok) {
            throw new Error(
               data.error?.message || `Request failed: ${res.status}`,
            );
         }

         const text = data.choices?.[0]?.message?.content;

         if (text) {
            setAnswer(text);
         } else {
            setError("No response from AI. Please try again.");
         }
      } catch (err) {
         console.error("Groq API error:", err);
         setError(`AI request failed: ${err.message}`);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-white rounded-2xl p-4 border border-[#F0E8DF]">
         <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-3">
            🤖 Ask AI
         </div>

         <div className="flex gap-2 mb-3">
            <input
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder="Ask about pet care..."
               className="flex-1 px-3 py-2 rounded-xl border border-[#F0E8DF] outline-none bg-[#FFFBF8] text-sm text-[#2C1810]"
               onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                     handleAsk();
                  }
               }}
               disabled={loading}
            />

            <button
               onClick={handleAsk}
               disabled={loading}
               className={`px-3 py-2 rounded-xl border-none text-white text-sm font-bold shrink-0 ${
                  loading
                     ? "bg-[#E0C8B8] cursor-not-allowed"
                     : "bg-[#D4631A] cursor-pointer"
               }`}
            >
               {loading ? "..." : "Ask"}
            </button>
         </div>

         {error && (
            <div className="text-xs text-[#D4631A] bg-[#FFF0E6] px-3 py-2 rounded-xl">
               {error}
            </div>
         )}

         {answer && (
            <div className="text-sm text-[#444] bg-[#FFF9F0] px-3 py-3 rounded-xl leading-relaxed border border-[#F0E8DF]">
               <span className="text-[#D4631A] font-bold text-xs">🤖 AI: </span>
               {answer}
            </div>
         )}
      </div>
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
   const [sortBy, setSortBy] = useState("createdAt"); // 排序状态

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
      let result = posts.filter((p) => {
         if (activeLabel !== "All" && p.label !== activeLabel) return false;
         if (activeDays !== null) {
            const cutoff = new Date(now - activeDays * 86400000);
            const postDate = toDate(p.createdAt);
            if (!postDate || postDate < cutoff) return false;
         }
         if (search.trim()) {
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

      // 前端排序
      if (sortBy === "likeCount") {
         result = [...result].sort(
            (a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0),
         );
      } else if (sortBy === "random") {
         result = [...result].sort(() => Math.random() - 0.5);
      } else {
         result = [...result].sort((a, b) => {
            const dateA = toDate(a.createdAt)?.getTime() ?? 0;
            const dateB = toDate(b.createdAt)?.getTime() ?? 0;
            return dateB - dateA;
         });
      }

      return result;
   }, [posts, activeLabel, activeDays, search, sortBy]);

   const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount ?? 0), 0);
   const memberCount = new Set(posts.map((p) => p.username)).size;
   const activeFilterCount =
      (activeLabel !== "All" ? 1 : 0) + (activeDays !== null ? 1 : 0);

   const SidebarContent = () => (
      <>
         <div className="bg-white rounded-2xl p-4 border border-[#F0E8DF]">
            <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-2">
               Category
            </div>
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
                     color={l !== "All" ? LABEL_COLORS[l] : null}
                  >
                     {l === "All" ? (
                        <span className="text-sm">🏠</span>
                     ) : (
                        <span
                           className="w-2 h-2 rounded-full shrink-0"
                           style={{
                              background: active
                                 ? LABEL_COLORS[l]?.dot
                                 : "#D0C8BE",
                           }}
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
            {TIME_FILTERS.map((tf, i) => {
               const active = activeDays === tf.days;
               return (
                  <FilterButton
                     key={tf.label}
                     active={active}
                     onClick={() => {
                        setActiveDays(tf.days);
                        if (isMobile) setShowMobileFilter(false);
                     }}
                     color={TIME_COLORS[i]}
                  >
                     <span className="text-sm">{active ? "⏰" : "○"}</span>
                     {tf.label}
                  </FilterButton>
               );
            })}

            <div className="h-px bg-[#F0E8DF] my-3" />
            <div className="text-[11px] font-extrabold text-[#B0A090] uppercase tracking-widest mb-2">
               Sort By
            </div>
            {SORT_OPTIONS.map((opt, i) => {
               const active = sortBy === opt.value;
               return (
                  <FilterButton
                     key={opt.value}
                     active={active}
                     onClick={() => {
                        setSortBy(opt.value);
                        if (isMobile) setShowMobileFilter(false);
                     }}
                     color={SORT_COLORS[i]}
                  >
                     {opt.label}
                  </FilterButton>
               );
            })}
         </div>

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

         {/* AI 问答，只在桌面侧边栏显示 */}
         {!isMobile && <AskAI />}
      </>
   );

   return (
      <>
         <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            .mobile-drawer { animation: slideInRight 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
         `}</style>

         <div className={isMobile ? "p-3 pb-20" : "p-6"}>
            <div
               className={`max-w-[1200px] mx-auto ${isMobile ? "block" : "grid grid-cols-[1fr_3fr] gap-7 items-start"}`}
            >
               {/* 桌面端侧边栏 */}
               {!isMobile && (
                  <aside className="sticky top-6 flex flex-col gap-3">
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
                  {/* 搜索栏 + AI 问答栏，左右分栏 */}
                  <div
                     className={`flex gap-3 mb-4 ${isMobile ? "flex-col" : "flex-row items-center"}`}
                  >
                     {/* 左边：搜索栏 */}
                     <div className="flex items-center gap-2 bg-white border border-[#F0E8DF] rounded-full px-5 py-2.5 flex-1">
                        <span className="text-sm text-[#B0A090]">🔍</span>
                        <input
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           placeholder="Search posts..."
                           className="border-none outline-none bg-transparent text-sm text-[#2C1810] w-full"
                        />
                     </div>

                     {/* 手机端 AI 问答入口，桌面端在侧边栏 */}
                     {isMobile && (
                        <div className="bg-white border border-[#F0E8DF] rounded-2xl p-3">
                           <AskAI />
                        </div>
                     )}
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

         {isMobile && (
            <div
               className="fixed bottom-0 left-0 right-0 bg-[#FFF9F0] border-t border-[#F0E8DF] px-6 py-2.5 flex gap-3 z-[100]"
               style={{
                  paddingBottom: "max(10px, env(safe-area-inset-bottom))",
               }}
            >
               <button
                  onClick={() => setShowNewPost(true)}
                  className="flex-1 py-3 rounded-2xl border-none text-white text-sm font-bold cursor-pointer"
                  style={{
                     background: "linear-gradient(135deg, #E8854A, #D4631A)",
                  }}
               >
                  Add New Post
               </button>
               <button
                  onClick={() => setShowMobileFilter(true)}
                  className={`px-5 py-3 rounded-2xl border text-sm font-bold cursor-pointer flex items-center gap-1.5 ${activeFilterCount > 0 ? "bg-[#FFF0E6] text-[#D4631A] border-[#F0E8DF]" : "bg-white text-[#6A5A4A] border-[#F0E8DF]"}`}
               >
                  🔧 Filter
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
