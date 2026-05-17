import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getSectorComplaints, updateComplaintStatus } from "../api/complaintService";
import { getAuthorityProfile } from "../api/authService";
import AuthorityNavbar from "./AuthorityNavbar";

import {
  AssignmentTurnedIn,
  Notifications,
  LocationOn,
  CalendarToday,
  Search,
  ThumbUp,
  Chat,
  Repeat,
} from "@mui/icons-material";

/* ================= MAIN COMPONENT ================= */

export default function AuthorityTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const dropdownRef = useRef(null);

  const mockNotifications = [
    { id: 1, text: "New Critical pothole reported in your sector.", time: "5m ago", urgent: true },
    { id: 2, text: "Complaint #SMD-104 status updated to processing.", time: "1h ago", urgent: false },
    { id: 3, text: "Weekly structural report is ready for review.", time: "4h ago", urgent: false },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Complaints Data
  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        const [complaintsRes, profileRes] = await Promise.all([
          getSectorComplaints(1, 50),
          getAuthorityProfile()
        ]);

        if (isMounted) {
          // Handle Profile Pic Setup
          setProfilePic(profileRes?.data?.user?.profile_picture || null);

          // Handle Complaints Parsing
          const list = complaintsRes?.data?.complaints || complaintsRes?.complaints || complaintsRes?.data || [];
          const complaints = Array.isArray(list) ? list : (Array.isArray(complaintsRes?.data?.data?.complaints) ? complaintsRes.data.data.complaints : []);
          
          setTasks(complaints.map(c => ({
            id: c.id,
            title: c.title || (c.description ? c.description.slice(0, 40) + "..." : "Untitled Issue"),
            department: c.sector || "General",
            location: c.location || "Unknown",
            reported: c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN"),
            status: c.status === "resolved" ? "Resolved" : c.status === "in_progress" ? "In Progress" : "Pending",
            priority: c.priority === "high" || c.priority === "critical" ? "High" : c.priority === "medium" ? "Medium" : "Low",
            likes: 0, 
            comments: 0,
            image: c.image_path || null,
            description: c.description || "No description provided.",
          })));
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        if (isMounted) setLoading(false); 
      }
    };
    fetchTasks();
    return () => { isMounted = false; };
  }, []);

  const handleLike = React.useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  }, []);

  const handleViewTask = React.useCallback((id) => {
  navigate(`/authority/tasks/${id}`);
}, [navigate]);

  // Client-side real-time task searching filter logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  // Compute live counter dynamic tallies
  const taskStats = useMemo(() => {
    return tasks.reduce((acc, current) => {
      if (current.status === "Pending") acc.pending++;
      if (current.status === "In Progress") acc.inProgress++;
      if (current.status === "Resolved") acc.resolved++;
      return acc;
    }, { pending: 0, inProgress: 0, resolved: 0 });
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 pb-32 overflow-hidden relative">
      {/* Background Blur */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 px-6 h-20 flex items-center justify-between shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
              <AssignmentTurnedIn />
            </div>

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Authority Tasks
              </h1>
              <p className="text-xs text-gray-500">
                Task & Issue Management
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Search Input Controller */}
          <div className="hidden md:flex items-center bg-blue-50 border border-blue-100 px-4 h-12 rounded-2xl focus-within:ring-2 focus-within:ring-blue-400 transition-all">
            <Search className="text-blue-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="bg-transparent outline-none ml-3 w-52 text-sm font-medium text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Notification Button */}
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadNotifications(false);
            }}
            className="relative w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition active:scale-95"
          >
            <Notifications className="text-blue-700" />
            {unreadNotifications && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-14 top-16 w-80 bg-white/95 backdrop-blur-2xl border border-blue-100 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between border-b border-blue-50 pb-3 mb-2">
                <h4 className="font-black text-gray-800 text-lg">Alerts & Updates</h4>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg">Live</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-2xl transition border ${n.urgent ? "bg-red-50/60 border-red-100" : "bg-blue-50/40 border-transparent hover:bg-blue-50/80"}`}>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{n.text}</p>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Picture Box */}
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md bg-gray-100">
            <img
              src={profilePic || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="Authority Officer Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
              }}
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="pt-28 px-6 max-w-7xl mx-auto">
        <AuthorityNavbar />
        
        {/* Hero Jumbotron Header */}
        <section className="mb-10 rounded-[36px] overflow-hidden relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-3 tracking-tight">
              Assigned Tasks
            </h2>

            <p className="text-blue-100 text-xl max-w-3xl leading-relaxed font-medium">
              Manage civic complaints assigned to your department and monitor public
              infrastructure issue resolution.
            </p>

            {/* Live Numerical Metric Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              <HeroStat title="Pending" value={taskStats.pending || "0"} />
              <HeroStat title="In Progress" value={taskStats.inProgress || "0"} />
              <HeroStat title="Resolved" value={taskStats.resolved || "0"} />
              <HeroStat title="Total Tasks" value={tasks.length || "0"} />
            </div>
          </div>
        </section>

        {/* Tasks Grid Processing States Feed */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
        
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-lg font-semibold bg-white/40 backdrop-blur-md border border-blue-100 rounded-[32px] shadow-inner">
            {searchQuery ? "No matching layout parameters found." : "No tasks assigned yet."}
          </div>
        )}

        <div className="space-y-10">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleLike={handleLike}
              onViewTask={handleViewTask}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= OPTIMIZED SUB-COMPONENTS (MEMOIZED) ================= */

const TaskCard = React.memo(function TaskCard({ task, handleLike, onViewTask }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Banner Attachment Media */}
      <div className="relative">
        <img
          src={task.image || "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=600"}
          alt={task.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Floating Status Pill */}
        <div className="absolute top-5 left-5">
          <span className={`px-4 py-2 rounded-full text-sm font-black shadow-lg ${
            task.status === "Pending"
              ? "bg-red-100 text-red-700"
              : task.status === "In Progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}>
            {task.status}
          </span>
        </div>

        {/* Overlay Structural Copy */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">
            {task.department}
          </p>
          <h3 className="text-4xl font-black mb-3 tracking-tight">
            {task.title}
          </h3>
          <p className="text-white/90 max-w-3xl leading-relaxed line-clamp-2 font-medium">
            {task.description}
          </p>
        </div>
      </div>

      {/* Detail Metadata Card Body */}
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <LocationOn className="text-blue-600" />
              <span className="font-semibold text-sm">{task.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarToday className="text-blue-600" />
              <span className="font-semibold text-sm">{task.reported}</span>
            </div>
          </div>

          {/* Priority Indicator Pill */}
          <div className={`px-5 py-2.5 rounded-2xl text-white text-sm font-black shadow-md ${
            task.priority === "High"
              ? "bg-gradient-to-r from-red-500 to-red-400"
              : task.priority === "Medium"
              ? "bg-gradient-to-r from-yellow-500 to-orange-400"
              : "bg-gradient-to-r from-gray-500 to-gray-400"
          }`}>
            {task.priority} Priority
          </div>
        </div>

        {/* Social Metrics Actions Wrapper */}
        <div className="border-t border-blue-100 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleLike(task.id)}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition active:scale-90"
            >
              <ThumbUp />
              <span className="font-bold text-gray-600">{task.likes}</span>
            </button>

            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition">
              <Chat />
              <span className="font-bold text-gray-600">{task.comments}</span>
            </button>

            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition">
              <Repeat />
              <span className="font-bold text-gray-600 text-sm">Re-Mension</span>
            </button>
          </div>

          {/* Navigation Route Link Handler Button */}
          <button
            onClick={() => onViewTask(task.id)}
            className={`px-6 py-3 rounded-2xl text-white font-black shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all ${
              task.status === "Resolved"
                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                : "bg-gradient-to-r from-blue-600 to-cyan-500"
            }`}
          >
            {task.status === "Resolved" ? "Completed" : "View Task"}
          </button>
        </div>
      </div>
    </div>
  );
});

const HeroStat = React.memo(function HeroStat({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-sm">
      <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-5xl font-black tracking-tight">
        {value}
      </h3>
    </div>
  );
});