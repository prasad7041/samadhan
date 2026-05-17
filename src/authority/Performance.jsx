import React, { useState, useEffect, useRef } from "react";
import { getAssignedComplaints } from "../api/complaintService";
import { getAuthorityProfile } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import AuthorityNavbar from "./AuthorityNavbar";

import {
  EmojiEvents,
  Star,
  WorkspacePremium,
  AssignmentTurnedIn,
  TrendingUp,
  LocalFireDepartment,
  Bolt,
  Shield,
  Groups,
  Verified,
  Notifications,
  Home,
  AssignmentInd,
  MilitaryTech,
  AccountCircle,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";

/* ================= MOCK DATA FOR LEADERBOARD ================= */

const officers = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Roads Department",
    score: 98,
    resolved: 124,
    tag: "Top Performer",
    color: "from-yellow-500 to-orange-400",
    icon: <EmojiEvents fontSize="large" />,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Anita Verma",
    role: "Water Management",
    score: 92,
    resolved: 98,
    tag: "Rapid Responder",
    color: "from-blue-600 to-cyan-400",
    icon: <Bolt fontSize="large" />,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Vikram Reddy",
    role: "Electrical Department",
    score: 88,
    resolved: 84,
    tag: "Consistent Officer",
    color: "from-green-500 to-emerald-400",
    icon: <WorkspacePremium fontSize="large" />,
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Sanitation Team",
    score: 80,
    resolved: 70,
    tag: "Community Hero",
    color: "from-pink-500 to-rose-400",
    icon: <Groups fontSize="large" />,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

/* ================= MAIN COMPONENT ================= */

export default function AuthorityPerformance() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resolved: 0, total: 0, pending: 0 });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Notification Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const dropdownRef = useRef(null);

  const mockNotifications = [
    { id: 1, text: "New Critical pothole reported in your sector.", time: "5m ago", urgent: true },
    { id: 2, text: "Complaint #SMD-104 status updated to processing.", time: "1h ago", urgent: false },
    { id: 3, text: "Weekly structural report is ready for review.", time: "4h ago", urgent: false },
  ];

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, profileRes] = await Promise.all([
          getAssignedComplaints(1, 100),
          getAuthorityProfile()
        ]);

        // Setup sync profile picture
        setProfilePic(profileRes?.data?.user?.profile_picture || null);

        // Compute performance states dynamically
        const complaints = complaintsRes?.data?.complaints || complaintsRes?.complaints || complaintsRes?.data || [];
        const complaintsArray = Array.isArray(complaints) ? complaints : [];
        
        const total = complaintsArray.length;
        const resolved = complaintsArray.filter(c => c.status === 'resolved' || c.status === 'Resolved').length;
        const pending = complaintsArray.filter(c => c.status === 'pending' || c.status === 'Pending').length;

        setStats({ total, resolved, pending });
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // Calculate an individual performance efficiency percentage
  const dynamicEfficiency = stats.total > 0 
    ? Math.round((stats.resolved / stats.total) * 100) 
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 pb-32 overflow-hidden relative">
      {/* Background Blurs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 px-6 h-20 flex items-center justify-between shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
            <TrendingUp />
          </div>

          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Authority Performance
            </h1>
            <p className="text-xs text-gray-500">
              Officer Analytics & Credits
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
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

          {/* Notification Popover Dropdown */}
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

          {/* Connected Officer Avatar */}
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

        {/* Hero Banner featuring Dynamic API Metrics */}
        <section className="mb-10 rounded-[36px] overflow-hidden relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-3">
              Department Performance
            </h2>

            <p className="text-blue-100 text-xl max-w-3xl leading-relaxed">
              Analyze authority efficiency, resolution performance, citizen
              satisfaction, and officer achievements through smart civic analytics.
            </p>

            {/* Live Metrics Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              <HeroStat
                title="Assigned Cases"
                value={loading ? "..." : stats.total}
              />
              <HeroStat
                title="Your Resolved"
                value={loading ? "..." : stats.resolved}
              />
              <HeroStat
                title="Pending Work"
                value={loading ? "..." : stats.pending}
              />
              <HeroStat
                title="My Efficiency"
                value={loading ? "..." : `${dynamicEfficiency}%`}
              />
            </div>
          </div>
        </section>

        {/* Top Officers Performance Board */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-black text-gray-800">Sector Leaderboard</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            Updated Hourly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {officers.map((officer) => (
            <OfficerCard
              key={officer.id}
              officer={officer}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= OFFICER CARD ================= */

function OfficerCard({ officer }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[36px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Top Background Element */}
      <div className={`bg-gradient-to-r ${officer.color} p-8 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={officer.avatar}
              alt={officer.name}
              className="w-24 h-24 rounded-3xl border-4 border-white/30 object-cover shadow-xl"
            />

            <div>
              <h3 className="text-3xl font-black">
                {officer.name}
              </h3>
              <p className="text-white/80 text-lg">
                {officer.role}
              </p>
            </div>
          </div>

          <div className="text-white">
            {officer.icon}
          </div>
        </div>
      </div>

      {/* Content Fields */}
      <div className="p-8">
        {/* Achievements Tag */}
        <div className="flex items-center justify-between mb-8">
          <span className={`px-5 py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${officer.color} shadow-lg text-sm`}>
            {officer.tag}
          </span>

          <div className="flex items-center gap-2 text-yellow-500">
            <Star />
            <span className="font-bold text-lg">
              {officer.score}/100
            </span>
          </div>
        </div>

        {/* Secondary Metric Cards Box */}
        <div className="grid grid-cols-2 gap-5">
          <PerformanceBox
            icon={<AssignmentTurnedIn />}
            title="Resolved"
            value={officer.resolved}
          />
          <PerformanceBox
            icon={<Verified />}
            title="Citizen Trust"
            value={`${officer.score}%`}
          />
          <PerformanceBox
            icon={<Shield />}
            title="Safety Index"
            value="Excellent"
          />
          <PerformanceBox
            icon={<LocalFireDepartment />}
            title="Activity"
            value="High"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= PERFORMANCE BOX CONTAINER ================= */

function PerformanceBox({ icon, title, value }) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 transition hover:bg-blue-50">
      <div className="flex items-center gap-3 text-blue-700 mb-3">
        {icon}
        <span className="font-semibold text-sm">
          {title}
        </span>
      </div>
      <h3 className="text-2xl font-black text-gray-800">
        {value}
      </h3>
    </div>
  );
}

/* ================= HERO STAT COMPONENT ================= */

function HeroStat({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-inner">
      <p className="text-blue-100 text-xs uppercase tracking-widest mb-2 font-bold">
        {title}
      </p>
      <h3 className="text-4xl font-black">
        {value}
      </h3>
    </div>
  );
}