import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNearbyComplaints } from "../api/complaintService";
import {
  Search,
  Bell,
  ThumbsUp,
  MessageCircle,
  Plus,
  TrendingUp,
  Send,
  Repeat2,
  Loader2,
  MapPin,
  Calendar,
  Check,
} from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";
import { motion } from "framer-motion";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= NOTIFICATION STATE =================
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your report about 'Pothole on Main Rd' was approved.", time: "2h ago", unread: true },
    { id: 2, text: "A user re-mensioned your complaint regarding water leakage.", time: "5h ago", unread: true },
    { id: 3, text: "Welcome to Samadhan! Start making your community better.", time: "1 day ago", unread: false },
  ]);

  const hasUnread = notifications.some((n) => n.unread);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // ================= FETCH COMPLAINTS =================
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        let lat = 17.385;
        let lng = 78.4867;

        if (navigator.geolocation) {
          try {
            const pos = await new Promise((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          } catch {
            // Fall back to defaults safely
          }
        }

        const res = await getNearbyComplaints(lat, lng, 50, 1, 20);
        const complaints = res.data?.complaints || [];
        setPosts(
          complaints.map((c) => ({
            id: c.id,
            user: c.citizen_name || "Anonymous Citizen",
            time: new Date(c.created_at).toLocaleDateString(),
            location: c.location || "Unknown Location",
            priority: c.priority || "medium",
            likes: 0,
            commentsCount: 0,
            showComments: false,
            newComment: "",
            content: c.description,
            image: c.image_path || null,
            avatar: c.citizen_profile_picture || null,
            comments: [],
            status: c.status,
          }))
        );
      } catch (err) {
        setError("Failed to load complaints.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // ================= ACTION HANDLERS =================
  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post))
    );
  };

  const toggleComments = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, showComments: !post.showComments } : post))
    );
  };

  const handleCommentInput = (id, value) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, newComment: value } : post))
    );
  };

  const addComment = (id) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id && post.newComment.trim() !== "") {
          return {
            ...post,
            comments: [...post.comments, { user: "You", text: post.newComment }],
            commentsCount: post.commentsCount + 1,
            newComment: "",
          };
        }
        return post;
      })
    );
  };

  // ================= UTILITY STRINGS =================
  const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";
    return path.startsWith("http") ? path : path;
  };

  const getPriorityLabel = (priority) => {
    const map = {
      high: "High Priority",
      medium: "In Progress",
      low: "Low Priority",
      critical: "Critical",
    };
    return map[priority] || priority;
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high" || priority === "critical") return "bg-rose-50 text-rose-600 border border-rose-100";
    if (priority === "medium") return "bg-amber-50 text-amber-700 border border-amber-100";
    return "bg-sky-50 text-sky-600 border border-sky-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900 overflow-hidden relative">
      {/* BACKGROUND BLUR DECORATIONS */}
      <div className="fixed top-0 left-0 w-[450px] h-[450px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          
          {/* LOGO TITLE ASSIGNMENT */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-500 text-white flex items-center justify-center shadow-lg">
              <TrendingUp size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Samadhan
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Dashboard</p>
            </div>
          </div>

          {/* UTILITIES AND DROP CONTROLS */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100/80 border border-transparent focus-within:border-blue-300 focus-within:bg-white px-4 h-11 rounded-xl transition-all">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search civic issues..."
                className="bg-transparent outline-none ml-2.5 w-48 text-sm placeholder:text-gray-400 text-gray-700"
              />
            </div>

            {/* NOTIFICATIONS DROPDOWN PORTAL */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-12 h-12 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition text-blue-700 ${
                  showNotifications ? "ring-2 ring-blue-600/20 border-blue-300" : ""
                }`}
              >
                <Bell size={18} />
                {hasUnread && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl border border-blue-100 rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] overflow-hidden z-[100] text-left animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-5 bg-blue-50/40 border-b border-blue-100/50 flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Notifications</h4>
                    {hasUnread && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                      >
                        <Check size={12} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-blue-50/50">
                    {notifications.length === 0 ? (
                      <p className="p-5 text-center text-xs text-gray-400 font-medium">No updates available.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 flex gap-3 transition items-start ${
                            notif.unread ? "bg-blue-50/20" : "hover:bg-gray-50/50"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notif.unread ? "bg-blue-600 shadow-[0_0_6px_#2563eb]" : "bg-transparent"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-normal ${notif.unread ? "text-gray-800 font-semibold" : "text-gray-500 font-medium"}`}>
                              {notif.text}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 block">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* QUICK-NAV PROFILE THUMBNAIL */}
            <button
              onClick={() => navigate("/citizen/profile")}
              className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-blue-600/20 hover:ring-blue-600 transition shadow-sm flex-shrink-0"
            >
              <img
                src={user?.profile_picture ? getImageUrl(user.profile_picture) : "https://randomuser.me/api/portraits/men/75.jpg"}
                alt="Profile Gateway"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Rail Container */}
        <div className="lg:w-[280px] flex-shrink-0">
          <CitizenNavbar />
        </div>

        {/* Primary Streams Area */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* HERO BANNER SEGMENT */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-6 md:p-8"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                Report Civic Problems Faster
              </h2>
              <p className="text-blue-100/90 text-xs md:text-sm mt-2 leading-relaxed font-medium">
                Connect directly with your local municipality, log geolocated updates, and track real-time issue resolutions.
              </p>
            </div>

            {/* Sync Matrix Analytics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 relative z-10">
              <HeroCard title="Active" value={posts.filter((p) => p.status !== "resolved").length || "0"} />
              <HeroCard title="Resolved" value={posts.filter((p) => p.status === "resolved").length || "0"} />
              <HeroCard title="Hi" value={user?.full_name?.split(" ")[0] || "Citizen"} />
              <HeroCard title="Status" value="Active" isStatus={true} />
            </div>
          </motion.section>

          {/* LOADING STREAM CONDITION */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Syncing Regional Feeds...</span>
            </div>
          )}

          {/* ERROR STATUS CONDITION */}
          {error && !loading && (
            <div className="px-5 py-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold text-center shadow-sm">
              {error}
            </div>
          )}

          {/* EMPTY FEED DISPATCH */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-16 bg-white/80 backdrop-blur-2xl rounded-3xl border border-blue-100 p-8 shadow-md">
              <p className="text-gray-400 text-sm font-medium">No active local complaints found nearby.</p>
              <button
                onClick={() => navigate("/citizen/raise")}
                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
              >
                File Initial Complaint
              </button>
            </div>
          )}

          {/* FEED LIST RENDERER */}
          {!loading &&
            !error &&
            posts.map((item) => (
              <article
                key={item.id}
                className="bg-white/80 backdrop-blur-2xl rounded-[32px] border border-blue-100 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-5 md:p-6 flex gap-4">
                  <img
                    src={item.avatar ? getImageUrl(item.avatar) : "https://randomuser.me/api/portraits/lego/1.jpg"}
                    alt={item.user}
                    className="w-12 h-12 rounded-2xl object-cover ring-4 ring-blue-50 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base leading-snug">{item.user}</h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {item.time}
                          </span>
                          <span>•</span>
                          <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                            <MapPin size={12} />
                            {item.location}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide whitespace-nowrap ${getPriorityStyle(item.priority)}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed break-words font-medium">{item.content}</p>
                  </div>
                </div>

                {/* ATTACHED MEDIA BLOCK */}
                {item.image && (
                  <div className="px-5 md:px-6 pb-4">
                    <img
                      src={getImageUrl(item.image)}
                      alt="Issue asset reference"
                      className="w-full h-56 md:h-80 object-cover rounded-[24px] border border-blue-50 shadow-inner"
                    />
                  </div>
                )}

                {/* METRIC FOUL ACTIONS CONTROLS */}
                <div className="px-5 md:px-6 py-4 bg-blue-50/20 border-t border-blue-100/50 flex justify-between items-center">
                  <div className="flex gap-6">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
                    >
                      <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-gray-600">{item.likes}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(item.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group"
                    >
                      <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-gray-600">{item.commentsCount}</span>
                    </button>
                  </div>

                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-600 transition-colors text-xs font-bold">
                    <Repeat2 size={16} />
                    <span className="hidden sm:inline">Re-Mension</span>
                  </button>
                </div>

                {/* EXPANDED COMMENT ENGINE SECTION */}
                {item.showComments && (
                  <div className="px-5 md:px-6 pb-5 pt-3 space-y-3 bg-blue-50/10 border-t border-blue-100/30">
                    {item.comments.map((comment, idx) => (
                      <div key={idx} className="bg-white border border-blue-50 rounded-2xl p-3.5 shadow-sm">
                        <p className="text-xs font-black text-blue-600">{comment.user}</p>
                        <p className="text-gray-600 text-xs mt-0.5 font-medium">{comment.text}</p>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        value={item.newComment}
                        onChange={(e) => handleCommentInput(item.id, e.target.value)}
                        placeholder="Write an update..."
                        className="flex-1 px-4 py-3 bg-white text-xs rounded-xl border border-blue-100 outline-none focus:border-blue-400 transition"
                      />
                      <button
                        onClick={() => addComment(item.id)}
                        className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition flex-shrink-0 shadow-md shadow-blue-600/15"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
        </div>
      </main>

      {/* ================= FLOATING ACTION DISPATCH FAB ================= */}
      <button
        onClick={() => navigate("/citizen/raise")}
        className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition z-50 border border-white/10"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

/* ================= EXPORTED MODULE: COMPACT HERO GRID CARD ================= */
function HeroCard({ title, value, isStatus = false }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-w-0">
      <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-wider truncate">{title}</p>
      
      <div className="flex items-center gap-2 mt-2 min-w-0">
        {isStatus && (
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        )}
        <h3 className="text-lg md:text-xl font-black truncate text-white leading-none">
          {value}
        </h3>
      </div>
    </div>
  );
}

export default CitizenDashboard;