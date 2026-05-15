import React, { useState, useEffect } from "react";
import { getSectorComplaints } from "../api/complaintService";

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
  Chat,
  Repeat,
  Notifications,
  Home,
  AssignmentInd,
  MilitaryTech,
  AccountCircle,
} from "@mui/icons-material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ================= DATA ================= */

/* ================= MAIN ================= */

export default function AuthorityDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSectorComplaints(1, 50);
        const list = res?.data?.complaints || res?.complaints || res?.data || [];
        const complaints = Array.isArray(list) ? list : (Array.isArray(res?.data?.data?.complaints) ? res.data.data.complaints : []);
        setIssues(complaints.map(c => ({
          id: `#SMD-${c.id}`,
          title: c.title || c.description?.slice(0, 40) + "...",
          description: c.description,
          priority: c.priority === "high" ? "High" : c.priority === "critical" ? "High" : c.priority === "medium" ? "Medium" : "Low",
          color: c.priority === "high" || c.priority === "critical" ? "from-red-500 to-red-400" : c.priority === "medium" ? "from-blue-500 to-cyan-400" : "from-gray-500 to-gray-400",
          badge: c.priority === "high" || c.priority === "critical" ? "bg-red-100 text-red-700" : c.priority === "medium" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700",
          time: new Date(c.created_at).toLocaleDateString(),
          location: c.location || "Unknown",
          reported: `Reported ${new Date(c.created_at).toLocaleDateString()}`,
          likes: 0, comments: 0,
          image: c.image_path || null,
        })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 pb-32 overflow-hidden relative">
      {/* Background Blur */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 px-6 h-20 flex items-center justify-between shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
            <Menu className="text-blue-700" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
              <Verified />
            </div>

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Authority Panel
              </h1>

              <p className="text-xs text-gray-500">
                Smart Civic Management
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="relative w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
            <Notifications className="text-blue-700" />

            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}

      <main className="pt-28 px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="mb-10 rounded-[36px] overflow-hidden relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-3">
              Authority Dashboard
            </h2>

            <p className="text-blue-100 text-xl max-w-2xl leading-relaxed">
              Monitor citizen-reported civic
              issues, manage public infrastructure
              tasks, and coordinate faster issue
              resolution.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              <HeroStat
                title="Total Issues"
                value="120"
              />

              <HeroStat
                title="Urgent"
                value="15"
              />

              <HeroStat
                title="Resolved"
                value="92"
              />

              <HeroStat
                title="Departments"
                value="12"
              />
            </div>
          </div>
        </section>

        {/* Feed */}
        {loading && <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}
        {!loading && issues.length === 0 && <div className="text-center py-20 text-gray-500 text-lg">No complaints assigned yet.</div>}
        <div className="space-y-10">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </div>
      </main>

      {/* ================= COMMON NAVBAR ================= */}

      <AuthorityNavbar />
    </div>
  );
}

/* ================= ISSUE CARD ================= */

function IssueCard({ issue }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative">
        <img
          src={issue.image}
          alt={issue.title}
          className="w-full h-80 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Priority */}
        <div className="absolute top-5 left-5">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg ${issue.badge}`}
          >
            {issue.priority === "High" && (
              <PriorityHigh fontSize="small" />
            )}

            {issue.priority === "Medium" && (
              <Bolt fontSize="small" />
            )}

            {issue.priority === "Low" && (
              <Info fontSize="small" />
            )}

            {issue.priority} Priority
          </span>
        </div>

        {/* Overlay Text */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-sm opacity-80 mb-2">
            {issue.id}
          </p>

          <h3 className="text-4xl font-black mb-3">
            {issue.title}
          </h3>

          <p className="text-white/90 max-w-3xl leading-relaxed">
            {issue.description}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6">
        {/* Info */}
        <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <LocationOn className="text-blue-600" />

              <span className="font-medium">
                {issue.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarToday className="text-blue-600" />

              <span className="font-medium">
                {issue.reported}
              </span>
            </div>
          </div>

          {/* Time */}
          <div
            className={`bg-gradient-to-r ${issue.color} text-white px-5 py-3 rounded-2xl shadow-lg`}
          >
            <div className="flex items-center gap-2 text-lg font-bold">
              <Schedule />

              {issue.time}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-blue-100 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Like */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
              <ThumbUp />

              <span className="font-semibold">
                {issue.likes}
              </span>
            </button>

            {/* Comments */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
              <Chat />

              <span className="font-semibold">
                {issue.comments}
              </span>
            </button>

            {/* Re-Mension */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
              <Repeat />

              <span className="font-semibold">
                Re-Mension
              </span>
            </button>
          </div>

          {/* Button */}
          <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HERO STAT ================= */

function HeroStat({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <p className="text-blue-100 text-sm uppercase tracking-widest mb-2">
        {title}
      </p>

      <h3 className="text-5xl font-black">
        {value}
      </h3>
    </div>
  );
}

/* ================= COMMON AUTHORITY NAVBAR ================= */

function AuthorityNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home />,
      path: "/authority/dashboard",
    },

    {
      label: "Tasks",
      icon: <AssignmentInd />,
      path: "/authority/tasks",
    },

    {
      label: "Performance",
      icon: <MilitaryTech />,
      path: "/authority/performance",
    },

    {
      label: "Profile",
      icon: <AccountCircle />,
      path: "/authority/profile",
    },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-xl bg-white/90 backdrop-blur-2xl border border-blue-100 rounded-3xl h-20 flex justify-around items-center shadow-2xl z-50">
      {navItems.map((item, index) => {
        const active =
          location.pathname === item.path;

        return (
          <button
            key={index}
            onClick={() =>
              navigate(item.path)
            }
            className={`flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-2xl transition-all ${
              active
                ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
                : "text-gray-500 hover:bg-blue-50"
            }`}
          >
            {item.icon}

            <span className="text-xs font-bold">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}