import React, { useState, useEffect, useRef } from "react";
import { getSectorComplaints } from "../api/complaintService";
import { getAuthorityProfile } from "../api/authService";
import AuthorityNavbar from "./AuthorityNavbar";
import {
  Menu,
  Verified,
  Schedule,
  LocationOn,
  CalendarToday,
  PriorityHigh,
  Bolt,
  Info,
  ThumbUp,
  ThumbUpOutlined,
  Chat,
  Repeat,
  Notifications,
  Search,
  Close,
  Description,
  CheckCircle,
  Autorenew,
  HourglassEmpty,
  Map,
  CorporateFare,
  Send
} from "@mui/icons-material";

/* ================= MAIN DASHBOARD ================= */

export default function AuthorityDashboard() {
  const [issues, setIssues] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null); // Floating tab state
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const dropdownRef = useRef(null);

  const mockNotifications = [
    { id: 1, text: "New Critical pothole reported in your sector.", time: "5m ago", urgent: true },
    { id: 2, text: "Complaint #SMD-104 status updated to processing.", time: "1h ago", urgent: false },
    { id: 3, text: "Weekly structural report is ready for review.", time: "4h ago", urgent: false },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchComplaintsData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, profileRes] = await Promise.all([
        getSectorComplaints(1, 50),
        getAuthorityProfile()
      ]);
      
      setProfilePic(profileRes?.data?.user?.profile_picture || null);

      const list = complaintsRes?.data?.complaints || complaintsRes?.complaints || complaintsRes?.data || [];
      const complaints = Array.isArray(list) ? list : (Array.isArray(complaintsRes?.data?.data?.complaints) ? complaintsRes.data.data.complaints : []);
      
      setIssues(complaints.map(c => ({
        id: `#SMD-${c.id}`,
        rawId: c.id,
        title: c.title || c.description?.slice(0, 40) + "...",
        description: c.description || "No description provided.",
        priority: c.priority === "high" ? "High" : c.priority === "critical" ? "High" : c.priority === "medium" ? "Medium" : "Low",
        status: (c.status || "pending").toLowerCase(),
        area: c.area || "Not Specified",
        sector: c.sector || "Not Specified",
        color: c.priority === "high" || c.priority === "critical" ? "from-red-500 to-red-400" : c.priority === "medium" ? "from-blue-500 to-cyan-400" : "from-gray-500 to-gray-400",
        badge: c.priority === "high" || c.priority === "critical" ? "bg-red-100 text-red-700" : c.priority === "medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700",
        time: new Date(c.created_at).toLocaleDateString("en-IN"),
        location: c.location || "Unknown Location",
        reported: `Reported ${new Date(c.created_at).toLocaleDateString("en-IN")}`,
        likes: c.likes_count || c.likes || 0, 
        comments: c.comments_count || c.comments || 0,
        remensions: c.remensions_count || c.remensions || 0,
        likedByUser: false,
        commentsList: [
          { id: 1, user: "Citizen Collector", text: "Heavy baseline blockages seen around morning hours here.", date: "Yesterday" }
        ],
        image: c.image_path ? `http://localhost:5000${c.image_path}` : null,
      })));
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchComplaintsData();
  }, []);

  // Sync back state changes from detail panel modal view pipelines
  const handleUpdateIssueState = (updatedIssue) => {
    setIssues(prev => prev.map(item => item.id === updatedIssue.id ? updatedIssue : item));
    setSelectedIssue(updatedIssue);
  };

  const handleToggleLike = (targetIssue) => {
    const updated = {
      ...targetIssue,
      likedByUser: !targetIssue.likedByUser,
      likes: targetIssue.likedByUser ? targetIssue.likes - 1 : targetIssue.likes + 1
    };
    setIssues(prev => prev.map(item => item.id === targetIssue.id ? updated : item));
    if (selectedIssue && selectedIssue.id === targetIssue.id) {
      setSelectedIssue(updated);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const query = searchQuery.toLowerCase();
    return (
      issue.id.toLowerCase().includes(query) ||
      issue.title.toLowerCase().includes(query) ||
      issue.description?.toLowerCase().includes(query) ||
      issue.location.toLowerCase().includes(query) ||
      issue.area.toLowerCase().includes(query) ||
      issue.sector.toString().toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 pb-32 overflow-hidden relative">
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-blue-100 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
              <Verified />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Authority Panel
              </h1>
              <p className="text-xs text-gray-500">Smart Civic Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <div className="hidden md:flex items-center bg-blue-50 border border-blue-100 px-4 h-12 rounded-2xl">
            <Search className="text-blue-600" />
            <input
              type="text"
              placeholder="Search issues, sectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none ml-3 w-52 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadNotifications(false);
            }}
            className="relative w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <Notifications className="text-blue-700" />
            {unreadNotifications && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-14 top-16 w-80 bg-white/95 backdrop-blur-2xl border border-blue-100 rounded-3xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-blue-50 pb-3 mb-2">
                <h4 className="font-black text-gray-800 text-lg">Alerts & Updates</h4>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg">Live</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-2xl transition-colors border ${n.urgent ? "bg-red-50/60 border-red-100" : "bg-blue-50/40 border-transparent hover:bg-blue-50/80"}`}>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{n.text}</p>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md bg-gray-100">
            <img
              src={profilePic || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://randomuser.me/api/portraits/men/32.jpg"; }}
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="pt-28 px-6 max-w-7xl mx-auto">
        <AuthorityNavbar />
        <div className="flex-1">
          <section className="mb-10 rounded-[36px] overflow-hidden relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-3">Authority Dashboard</h2>
              <p className="text-blue-100 text-xl max-w-2xl leading-relaxed">
                Monitor citizen-reported civic issues, manage public infrastructure tasks, and coordinate faster issue resolution.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
                <HeroStat title="Total Issues" value={issues.length || "0"} />
                <HeroStat title="Urgent" value={issues.filter(i => i.priority === "High").length || "0"} />
                <HeroStat title="Resolved" value={issues.filter(i => i.status === "resolved").length || "0"} />
                <HeroStat title="Departments" value="12" />
              </div>
            </div>
          </section>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
          
          {!loading && issues.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-lg">No complaints assigned yet.</div>
          )}

          {!loading && issues.length > 0 && filteredIssues.length === 0 && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[36px] border border-dashed border-blue-200 p-8">
              <p className="text-gray-500 text-lg font-medium">No complaints match: "{searchQuery}"</p>
            </div>
          )}

          <div className="space-y-10">
            {filteredIssues.map((issue) => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                onOpenDetails={setSelectedIssue} 
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        </div>
      </main>

      {/* ================= FLOATING DETAILS OVERVIEW TAB ================= */}
      {selectedIssue && (
        <FloatingDetailsTab 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          onToggleLike={handleToggleLike}
          onUpdateIssue={handleUpdateIssueState}
        />
      )}
    </div>
  );
}

/* ================= COMPLAINT FEED CARD ================= */

function IssueCard({ issue, onOpenDetails, onToggleLike }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-1 will-change-transform transition-[transform,shadow] duration-300 ease-out">
      <div className="relative">
        <img
          src={issue.image || "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=600"}
          alt={issue.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-5 left-5">
          <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg ${issue.badge}`}>
            {issue.priority === "High" && <PriorityHigh fontSize="small" />}
            {issue.priority === "Medium" && <Bolt fontSize="small" />}
            {issue.priority === "Low" && <Info fontSize="small" />}
            {issue.priority} Priority
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-sm opacity-80 mb-1">{issue.id}</p>
          <h3 className="text-4xl font-black mb-3">{issue.title}</h3>
          
          {/* Section & Area Badge Rows */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1 rounded-xl flex items-center gap-1">
              <Map style={{ fontSize: 14 }} /> Area: {issue.area}
            </span>
            <span className="text-xs bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1 rounded-xl flex items-center gap-1">
              <CorporateFare style={{ fontSize: 14 }} /> Sector: {issue.sector}
            </span>
          </div>

          <p className="text-white/90 max-w-3xl leading-relaxed line-clamp-2">{issue.description}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <LocationOn className="text-blue-600" />
              <span className="font-medium">{issue.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarToday className="text-blue-600" />
              <span className="font-medium">{issue.reported}</span>
            </div>
          </div>
          <div className={`bg-gradient-to-r ${issue.color} text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-base font-bold`}>
            <Schedule />
            Status: <span className="capitalize">{issue.status.replace("_", " ")}</span>
          </div>
        </div>

        <div className="border-t border-blue-100 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onToggleLike(issue)}
              className={`flex items-center gap-2 transition-colors duration-200 font-semibold ${issue.likedByUser ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            >
              {issue.likedByUser ? <ThumbUp /> : <ThumbUpOutlined />}
              <span>{issue.likes}</span>
            </button>
            <button 
              onClick={() => onOpenDetails(issue)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <Chat />
              <span className="font-semibold">{issue.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
              <Repeat />
              <span className="font-semibold">{issue.remensions} Re-Mensions</span>
            </button>
          </div>

          <button 
            onClick={() => onOpenDetails(issue)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 ease-out"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= FLOATING READ-ONLY DETAILS OVERVIEW TAB ================= */

function FloatingDetailsTab({ issue, onClose, onToggleLike, onUpdateIssue }) {
  const [commentInput, setCommentInput] = useState("");
  const commentEndRef = useRef(null);

  useEffect(() => {
    if (commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [issue.commentsList]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "Authority Observer",
      text: commentInput.trim(),
      date: "Just Now"
    };

    const updatedIssue = {
      ...issue,
      comments: issue.comments + 1,
      commentsList: [...(issue.commentsList || []), newComment]
    };

    onUpdateIssue(updatedIssue);
    setCommentInput("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Floating Viewer Interface */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-50 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <Close />
        </button>

        {/* Left Section: Image Showcase Header panel */}
        <div className="w-full md:w-5/12 h-1/3 md:h-full relative bg-gray-900">
          <img 
            src={issue.image || "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=800"} 
            alt={issue.title} 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest font-black backdrop-blur-sm">{issue.id}</span>
            <h3 className="text-3xl font-black leading-tight">{issue.title}</h3>
            
            {/* Sector / Area badging info overlay */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] bg-black/40 border border-white/20 font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Map style={{ fontSize: 12 }} /> Area: {issue.area}
              </span>
              <span className="text-[11px] bg-black/40 border border-white/20 font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                <CorporateFare style={{ fontSize: 12 }} /> Sector: {issue.sector}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-xs opacity-90 pt-2 font-medium">
              <span className="flex items-center gap-1.5"><LocationOn fontSize="small" /> {issue.location}</span>
              <span className="flex items-center gap-1.5"><CalendarToday fontSize="small" /> {issue.reported}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Structural Information & Live Feedback Modules */}
        <div className="w-full md:w-7/12 h-2/3 md:h-full p-6 md:p-8 overflow-hidden flex flex-col justify-between bg-gradient-to-b from-white to-blue-50/30">
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            
            {/* Status Information Metadata Header row */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-xs uppercase font-black text-gray-400 tracking-wider">Current Status</h4>
                <div className={`mt-1 flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold border text-xs capitalize ${
                  issue.status === "resolved" ? "bg-green-50 border-green-200 text-green-700" : issue.status === "in_progress" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {issue.status === "resolved" && <CheckCircle style={{ fontSize: 16 }} />}
                  {issue.status === "in_progress" && <Autorenew style={{ fontSize: 16 }} className="animate-spin" />}
                  {issue.status === "pending" && <HourglassEmpty style={{ fontSize: 16 }} />}
                  {issue.status.replace("_", " ")}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-black text-gray-400 tracking-wider text-right">Priority Class</h4>
                <span className={`mt-1 block text-center px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${issue.color}`}>
                  {issue.priority} Priority
                </span>
              </div>
            </div>

            {/* Public Issue Narrative */}
            <div className="bg-white border border-blue-100/60 shadow-sm p-4 rounded-3xl">
              <h5 className="text-xs font-black uppercase text-blue-600 mb-1.5 tracking-wider flex items-center gap-1">
                <Description style={{ fontSize: 16 }} /> Grievance Narrative
              </h5>
              <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-line max-h-24 overflow-y-auto custom-scrollbar">
                {issue.description}
              </p>
            </div>

            {/* Public Engagement Stats Bar */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => onToggleLike(issue)}
                className={`border rounded-2xl p-2.5 text-center transition-all duration-200 scale-100 active:scale-95 flex flex-col items-center justify-center ${
                  issue.likedByUser ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-blue-100/60 text-gray-700 hover:bg-blue-50/40"
                }`}
              >
                {issue.likedByUser ? <ThumbUp style={{ fontSize: 20 }} /> : <ThumbUpOutlined style={{ fontSize: 20 }} className="text-blue-600" />}
                <p className="text-sm font-black mt-0.5">{issue.likes}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Likes</p>
              </button>

              <div className="bg-white border border-blue-100/60 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                <Chat className="text-blue-600" style={{ fontSize: 20 }} />
                <p className="text-sm font-black text-gray-700 mt-0.5">{issue.comments}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Comments</p>
              </div>

              <div className="bg-white border border-blue-100/60 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                <Repeat className="text-blue-600" style={{ fontSize: 20 }} />
                <p className="text-sm font-black text-gray-700 mt-0.5">{issue.remensions}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Mentions</p>
              </div>
            </div>

            {/* Interactive Internal Board Discussion Feed */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-black text-gray-400 tracking-wider">Public Discussion Feed</h4>
              <div className="bg-white/70 border border-blue-100/60 rounded-3xl p-4 h-36 overflow-y-auto custom-scrollbar space-y-3">
                {(!issue.commentsList || issue.commentsList.length === 0) ? (
                  <p className="text-xs text-gray-400 font-medium text-center py-8">No feedback records filed yet.</p>
                ) : (
                  issue.commentsList.map((comm) => (
                    <div key={comm.id} className="text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-black text-blue-700">{comm.user}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{comm.date}</span>
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed">{comm.text}</p>
                    </div>
                  ))
                )}
                <div ref={commentEndRef} />
              </div>
            </div>

          </div>

          {/* Comment Submission form engine block */}
          <form onSubmit={handlePostComment} className="mt-4 pt-3 border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Write an informational note or response statement..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-white border border-blue-100 h-11 px-4 rounded-xl text-xs font-medium outline-none focus:border-blue-400 transition-colors shadow-inner text-gray-700"
            />
            <button
              type="submit"
              className="h-11 w-11 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 ease-out"
            >
              <Send style={{ fontSize: 16 }} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

/* ================= STAT EMBED COMPONENT ================= */

function HeroStat({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <p className="text-blue-100 text-sm uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-5xl font-black">{value}</h3>
    </div>
  );
}