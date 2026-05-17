import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNearbyComplaints } from "../api/complaintService";
import { 
  LayoutDashboard,
  MapPin, 
  AlertTriangle, 
  Clock3, 
  Bell, 
  Search, 
  Navigation, 
  Eye, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2,
  Check,
  User
} from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";

export default function NearbyIssues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= NOTIFICATION STATE =================
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your report about 'Pothole on Main Rd' was approved.", time: "2h ago", unread: true },
    { id: 2, text: "A user re-mentioned your complaint regarding water leakage.", time: "5h ago", unread: true },
    { id: 3, text: "Welcome to Samadhan! Start making your community better.", time: "1 day ago", unread: false },
  ]);

  const hasUnread = notifications.some(n => n.unread);

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
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // ================= FETCH COMPLAINTS =================
  useEffect(() => {
    const fetch = async () => {
      try {
        let lat = 17.385, lng = 78.4867;
        if (navigator.geolocation) {
          try {
            const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
            lat = pos.coords.latitude; lng = pos.coords.longitude;
          } catch {}
        }
        const res = await getNearbyComplaints(lat, lng, 10, 1, 20);
        setIssues(res.data?.complaints || []);
      } catch { 
        setError("Failed to load nearby issues."); 
      } finally { 
        setLoading(false); 
      }
    };
    fetch();
  }, []);

  const imgUrl = (p) => (!p ? null : p.startsWith("http") ? p : p);
  const statusStyle = (s) => s === "resolved" ? "bg-green-100 text-green-700" : s === "pending" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
  const prioStyle = (p) => p === "critical" ? "bg-red-100 text-red-700" : p === "high" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700";
  const fmtStatus = (s) => (s || "pending").replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />
      
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Replaced 'Dashboard' text with just the Layout Dashboard Icon wrapper */}
            <button 
              onClick={() => navigate("/dashboard")} 
              className="w-12 h-12 rounded-2xl bg-white shadow-md border border-blue-100 flex items-center justify-center hover:bg-blue-50 text-blue-700 transition"
              title="Dashboard"
            >
              <LayoutDashboard size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">Nearby Issues</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Real-time civic issue tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg">
              <Search size={18} className="text-blue-500" />
              <input type="text" placeholder="Search nearby issues..." className="bg-transparent outline-none ml-3 w-56 text-sm" />
            </div>
            
            {/* NOTIFICATION CONTROLLER & DROPDOWN CONTAINER */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition text-blue-700 ${showNotifications ? 'ring-2 ring-blue-600/20 border-blue-300' : ''}`}
              >
                <Bell size={20} />
                {hasUnread && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* NOTIFICATION DROP-DOWN TAB */}
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
                      <p className="p-5 text-center text-xs text-gray-400 font-medium">No recent updates available.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 flex gap-3 transition items-start ${notif.unread ? "bg-blue-50/20" : "hover:bg-gray-50/50"}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? "bg-blue-600 shadow-[0_0_6px_#2563eb]" : "bg-transparent"}`} />
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

            {/* PROFILE ICON */}
            <button className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg flex items-center justify-center hover:opacity-95 transition-all border border-blue-200">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:w-[280px] flex-shrink-0">
          <CitizenNavbar />
        </div>

        {/* Main Feed Content Container */}
        <div className="flex-1 min-w-0 space-y-8">
          
          {/* Smart Monitoring Hero Banner Layout */}
          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-8 md:p-10">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-inner">
                  <TrendingUp size={26} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">Smart Nearby Monitoring</h1>
                  <p className="text-blue-100 text-sm md:text-base mt-1">Discover nearby civic issues in real-time.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <HeroCard title="Nearby Issues" value={issues.length} />
                <HeroCard title="Urgent Updates" value={issues.filter(i => i.priority === "high" || i.priority === "critical").length} />
                <HeroCard title="Resolved Case" value={issues.filter(i => i.status === "resolved").length} />
                <HeroCard title="Pending Case" value={issues.filter(i => i.status === "pending").length} />
              </div>
            </div>
          </section>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500 font-medium">Loading nearby issues...</span>
            </div>
          )}
          {error && !loading && <div className="px-6 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center font-medium shadow-sm">{error}</div>}
          {!loading && !error && issues.length === 0 && <div className="text-center py-20"><p className="text-gray-500 text-lg font-medium">No nearby issues found.</p></div>}

          {/* Issues Cards Stream */}
          <div className="space-y-8">
            {issues.map(issue => (
              <div key={issue.id} className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                {issue.image_path && (
                  <div className="relative">
                    <img src={imgUrl(issue.image_path)} alt="" className="w-full h-72 object-cover" />
                    <div className="absolute top-5 right-5">
                      <span className={`px-5 py-3 rounded-full text-sm font-bold shadow-lg ${statusStyle(issue.status)}`}>
                        {fmtStatus(issue.status)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl flex-shrink-0">
                        <AlertTriangle size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-800">{issue.description?.slice(0, 40)}...</h2>
                        <p className="text-gray-500 text-sm mt-1">Issue ID: #NI-{issue.id}</p>
                      </div>
                    </div>
                    <span className={`px-5 py-3 rounded-2xl text-sm font-bold w-fit ${prioStyle(issue.priority)}`}>
                      {issue.priority ? `${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority` : "Normal"}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-6 text-sm md:text-base">{issue.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-5 mt-8">
                    <InfoCard icon={<MapPin size={18} />} title="Location" value={issue.location || "N/A"} />
                    <InfoCard icon={<Clock3 size={18} />} title="Reported" value={new Date(issue.created_at).toLocaleDateString()} />
                    <InfoCard icon={<ShieldAlert size={18} />} title="Status" value={fmtStatus(issue.status)} />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-2 text-sm">
                      <Eye size={18} /> View Details
                    </button>
                    <button className="px-7 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition flex items-center gap-2 text-sm">
                      <Navigation size={18} /> Navigate
                    </button>
                    <button className="px-7 py-4 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition flex items-center gap-2 text-sm">
                      <CheckCircle2 size={18} /> Mark Helpful
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroCard({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
      <p className="text-blue-100 text-xs uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl md:text-4xl font-black mt-2">{value}</h3>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
      <div className="flex items-center gap-3 text-blue-700 mb-3">
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <h3 className="font-bold text-gray-800 text-base truncate">{value}</h3>
    </div>
  );
}