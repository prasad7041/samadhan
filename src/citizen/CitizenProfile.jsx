import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCitizenProfile, updateCitizenProfile } from "../api/authService";
import { getMyReports } from "../api/complaintService";
import {
  ArrowLeft,
  Phone,
  MapPin,
  BadgeCheck,
  Trophy,
  ShieldCheck,
  Camera,
  Calendar,
  FileText,
  Activity,
  Bell,
  Settings,
  Loader2,
  Mail,
  Check,
  Globe,
  Award,
  Zap,
  CheckCircle,
} from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";
import { motion } from "framer-motion";

export default function CitizenProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  // ================= NOTIFICATION STATE =================
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your report regarding streetlights has been marked as In-Progress.", time: "2h ago", unread: true },
    { id: 2, text: "Verification successful! 'Verified Citizen' badge issued.", time: "1 day ago", unread: false },
  ]);

  const hasUnread = notifications.some((n) => n.unread);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reportsRes] = await Promise.all([getCitizenProfile(), getMyReports(1, 100)]);
        setProfile(profileRes.data?.user);
        const complaints = reportsRes.data?.complaints || [];
        setStats({
          total: complaints.length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dropdown handler for notifications click-outside close
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

  const imgUrl = (p) => (!p ? "https://randomuser.me/api/portraits/men/75.jpg" : p.startsWith("http") ? p : p);

  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("profile_picture", file);
      const res = await updateCitizenProfile(fd);
      setProfile(res.data?.user);
      updateUser(res.data?.user);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Loader2 size={36} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const u = profile || user || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900 overflow-hidden relative">
      {/* BACKGROUND BLUR DECORATIONS */}
      <div className="fixed top-0 left-0 w-[450px] h-[450px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          
          {/* LEFT SIDE: GO BACK & BANNER TITLE */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center hover:bg-blue-50 text-blue-700 transition"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Citizen Profile
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 hidden sm:block">Smart Civic Identity</p>
            </div>
          </div>

          {/* RIGHT SIDE: UTILITIES & NOTIFICATIONS */}
          <div className="flex items-center gap-4">
            
            {/* NOTIFICATIONS CONTAINER CONTROLLER */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-12 h-12 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition text-blue-700 ${
                  showNotifications ? "ring-2 ring-blue-600/20 border-blue-300" : ""
                }`}
              >
                <Bell size={20} />
                {hasUnread && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* NOTIFICATION ANCHORED DROPDOWN WINDOW */}
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
                      <p className="p-5 text-center text-xs text-gray-400 font-medium">No system reports available.</p>
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

            {/* GEAR SETTINGS UTILITY */}
            <button className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center hover:bg-blue-50 text-blue-700 transition">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Rail Container */}
        <div className="lg:w-[280px] flex-shrink-0">
          <CitizenNavbar />
        </div>

        {/* Primary Data Render Stream */}
        <div className="flex-1 min-w-0 space-y-8">
          
          {/* IDENTITY HERO BLOCK CARD */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-6 md:p-10"
          >
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col xl:flex-row gap-8 xl:gap-10 items-center">
              
              {/* IMAGE LOADER DISPATCH CONTAINER */}
              <div className="relative flex-shrink-0">
                <img
                  src={imgUrl(u.profile_picture)}
                  alt="Profile Identity"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-[32px] object-cover border-4 border-white/20 shadow-2xl"
                />
                <label className="absolute bottom-2 right-2 w-12 h-12 rounded-xl bg-white text-blue-700 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer border border-blue-50">
                  <Camera size={20} />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
                </label>
              </div>

              {/* DETAILS FIELDS BLOCK */}
              <div className="flex-1 w-full text-center xl:text-left">
                <div className="flex flex-wrap justify-center xl:justify-start items-center gap-4 mb-4">
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/10 text-xs font-bold flex items-center gap-2">
                    <BadgeCheck size={16} /> Verified Citizen
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  {u.full_name || "Citizen"}
                </h2>
                <p className="text-blue-100 text-base md:text-lg mt-1 font-medium">Active Civic Contributor</p>
                
                {/* REFACTORED PERSONAL DATACARDS WITH APPROPRIATE SUITABLE ICONS */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8 text-left">
                  <PInfoCard icon={<Phone size={16} />} title="Phone" value={u.mobile || "N/A"} />
                  <PInfoCard icon={<MapPin size={16} />} title="Area Region" value={u.area || "N/A"} />
                  <PInfoCard icon={<Mail size={16} />} title="Zip / Pincode" value={u.pincode || "N/A"} />
                  <PInfoCard icon={<Globe size={16} />} title="Preferred Language" value={u.preferred_language || "English"} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ================= CORE ANALYTICS COUNTERS ================= */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <SCard icon={<FileText />} title="Reports Logged" value={stats.total} color="from-blue-600 to-cyan-500" />
            <SCard icon={<Activity />} title="Issues Resolved" value={stats.resolved} color="from-emerald-500 to-green-400" />
            <SCard icon={<Trophy />} title="Impact Points" value="2,450" color="from-yellow-500 to-orange-400" />
            <SCard icon={<ShieldCheck />} title="Trust Rating" value="98%" color="from-purple-500 to-indigo-500" />
          </section>

          {/* ================= SYSTEM EARNED ACHIEVEMENTS ================= */}
          <section className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[32px] shadow-sm p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-400 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <Award size={26} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Earned Accomplishments</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Your community contribution tokens & status markers</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {stats.total >= 10 && (
                <ACard 
                  icon={<Zap size={18} />} 
                  title="Active Reporter" 
                  desc="Submitted 10+ validated regional citizen entries." 
                  g="from-blue-600 to-cyan-500" 
                />
              )}
              {stats.resolved >= 5 && (
                <ACard 
                  icon={<CheckCircle size={18} />} 
                  title="Problem Solver" 
                  desc="Collaborated on 5+ fully functional civic remedies." 
                  g="from-emerald-500 to-green-400" 
                />
              )}
              {stats.total >= 1 && (
                <ACard 
                  icon={<Trophy size={18} />} 
                  title="First Step" 
                  desc="Initialized community support with your initial case file." 
                  g="from-purple-500 to-indigo-500" 
                />
              )}
              {stats.total === 0 && (
                <p className="text-gray-400 col-span-full text-center py-10 font-medium text-sm">
                  File your first regional problem tracking case to unlock profile badges!
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENT MODULE: DATA CARD ================= */
function PInfoCard({ icon, title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
      <div className="p-2.5 bg-white/10 rounded-xl text-white/90 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="text-[10px] text-blue-200/80 uppercase tracking-wider block font-bold">{title}</span>
        <h3 className="font-bold text-sm md:text-base text-white truncate mt-0.5">{value}</h3>
      </div>
    </div>
  );
}

/* ================= COMPONENT MODULE: ANALYTICS GRID CARD ================= */
function SCard({ icon, title, value, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[28px] shadow-sm p-5 md:p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${color} text-white flex items-center justify-center shadow-sm mb-4`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-gray-400 text-xs md:text-sm font-bold tracking-wide">{title}</p>
        <h3 className="text-2xl md:text-4xl font-black text-gray-800 mt-1 leading-none">{value}</h3>
      </div>
    </div>
  );
}

/* ================= COMPONENT MODULE: BADGES DISPLAY ================= */
function ACard({ icon, title, desc, g }) {
  return (
    <div className={`rounded-[24px] p-6 text-white shadow-md bg-gradient-to-br ${g} flex flex-col justify-between relative overflow-hidden group`}>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
      <div>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-black tracking-tight mb-1.5">{title}</h3>
        <p className="text-white/85 text-xs leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}