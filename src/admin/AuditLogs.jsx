import React from "react";

import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Archive,
  History,
  Shield,
  User,
  FileText,
  Home,
  Users,
  Building2,
  ScrollText,
  Sparkles,
  Activity,
  AlertTriangle,
  Bell,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ================= DATA ================= */

const logs = [
  {
    time: "14:22",
    date: "Oct 24",
    user: "Rajesh Kumar",
    role: "Senior Administrator",
    action:
      "Escalated Case #SC-2024-089 to Municipal Commissioner's Office.",
    button: "View Case",
    icon: <FileText size={18} />,
  },

  {
    time: "13:45",
    date: "Oct 24",
    user: "System Core",
    role: "Automated Audit",
    action:
      "Updated Sanitation Department dashboard settings to prioritize monsoon-related reports.",
    button: "View Config",
    icon: <Shield size={18} />,
    highlighted: true,
  },

  {
    time: "11:02",
    date: "Oct 24",
    user: "Anita Desai",
    role: "Dept Manager",
    action:
      "Denied access request for User ID #4421 citing expired NDA.",
    button: "Profile",
    icon: <User size={18} />,
    security: true,
  },

  {
    time: "09:15",
    date: "Oct 24",
    user: "Samir Shah",
    role: "L1 Support",
    action:
      'Resolved Case #WS-2024-551 with "Verified Repair" status.',
    button: "Timeline",
    icon: <History size={18} />,
  },

  {
    time: "Yesterday",
    date: "17:30",
    user: "Main Admin",
    role: "Global Access",
    action:
      "Batch archived 450 resolved reports from Q2 2024.",
    button: "Log",
    icon: <Archive size={18} />,
  },
];

/* ================= MAIN ================= */

export default function AuditLogs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar />

      {/* ================= MAIN ================= */}

      <main className="flex-1 lg:ml-[22rem]">
        {/* ================= HEADER ================= */}

        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-blue-100 px-8 h-20 flex items-center justify-between">
          {/* Left */}
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Audit Logs
            </h2>

            <p className="text-gray-500 text-sm">
              AI Powered System Activity Monitoring
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-blue-100 px-5 py-3 rounded-2xl shadow-lg">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search activities..."
                className="bg-transparent outline-none w-60"
              />
            </div>

            {/* Filter */}
            <button className="w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-lg flex items-center justify-center">
              <Filter size={18} />
            </button>

            {/* Download */}
            <button className="w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-lg flex items-center justify-center">
              <Download size={18} />
            </button>

            {/* Notification */}
            <button className="relative w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-lg flex items-center justify-center">
              <Bell size={18} />

              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-xl">
              AU
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <div className="p-8 space-y-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <Sparkles size={32} />
                </div>

                <div>
                  <h1 className="text-5xl font-black">
                    Smart Audit Monitoring
                  </h1>

                  <p className="text-blue-100 text-lg mt-2">
                    Real-time system logs,
                    security tracking, and civic
                    activity monitoring.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroStat
                  icon={<Activity />}
                  title="Total Actions"
                  value="1,284"
                />

                <HeroStat
                  icon={<AlertTriangle />}
                  title="Security Alerts"
                  value="3"
                />

                <HeroStat
                  icon={<Shield />}
                  title="Protected"
                  value="99.8%"
                />

                <HeroStat
                  icon={<History />}
                  title="Live Logs"
                  value="24/7"
                />
              </div>
            </div>
          </section>

          {/* ================= LOGS ================= */}

          <section className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-2xl overflow-hidden">
            {/* Top */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 p-8 border-b border-blue-100">
              <div>
                <h3 className="text-3xl font-black">
                  Chronological Activity Feed
                </h3>

                <p className="text-gray-500 mt-1">
                  Live civic system activity logs
                </p>
              </div>

              <span className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg">
                Live Feed Active
              </span>
            </div>

            {/* Logs */}
            <div>
              {logs.map((log, index) => (
                <LogCard
                  key={index}
                  log={log}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 p-8 border-t border-blue-100 bg-blue-50/40">
              <p className="text-gray-500">
                Showing 1 to 5 of 1,284 entries
              </p>

              <div className="flex items-center gap-3">
                <button className="w-11 h-11 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center">
                  <ChevronLeft size={18} />
                </button>

                <button className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg">
                  1
                </button>

                <button className="w-11 h-11 rounded-2xl bg-white border border-blue-100">
                  2
                </button>

                <button className="w-11 h-11 rounded-2xl bg-white border border-blue-100">
                  3
                </button>

                <button className="w-11 h-11 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ================= LOG CARD ================= */

function LogCard({ log }) {
  return (
    <div
      className={`p-8 border-b border-blue-50 hover:bg-blue-50/40 transition ${
        log.highlighted
          ? "border-l-4 border-cyan-500 bg-cyan-50/40"
          : ""
      }`}
    >
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Time */}
        <div className="w-28">
          <p className="font-black text-lg">
            {log.time}
          </p>

          <p className="text-gray-500 text-sm">
            {log.date}
          </p>
        </div>

        {/* User */}
        <div className="flex items-center gap-4 xl:w-80">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">
            {log.icon}
          </div>

          <div>
            <p className="font-bold text-lg">
              {log.user}
            </p>

            <p className="text-gray-500">
              {log.role}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed">
            {log.action}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {log.security && (
            <span className="px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-bold">
              Security Flag
            </span>
          )}

          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-105 transition">
            {log.button}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HERO STAT ================= */

function HeroStat({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <div className="mb-4 text-white">
        {icon}
      </div>

      <p className="text-blue-100 text-sm uppercase tracking-widest">
        {title}
      </p>

      <h3 className="text-5xl font-black mt-2">
        {value}
      </h3>
    </div>
  );
}

/* ================= SIDEBAR ================= */

function AdminSidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/admin",
    },

    {
      label: "User Management",
      icon: <Users size={20} />,
      path: "/admin/usermanagement",
    },

    {
      label: "Departments",
      icon: <Building2 size={20} />,
      path: "/admin/departmentoversight",
    },

    {
      label: "Audit Logs",
      icon: <ScrollText size={20} />,
      path: "/admin/auditlogs",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-80 fixed left-5 top-5 h-[95vh] bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[40px] p-6 shadow-2xl z-50">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
            <Sparkles size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Samadhan
            </h1>

            <p className="text-xs text-gray-500">
              Smart Civic AI Admin
            </p>
          </div>
        </div>
      </div>

      {/* Admin Card */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[32px] p-6 text-white shadow-xl mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center font-black text-xl">
            AU
          </div>

          <div>
            <p className="font-bold text-lg">
              Admin Portal
            </p>

            <p className="text-blue-100 text-sm">
              System Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {navItems.map((item, index) => {
          const active =
            location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() =>
                navigate(item.path)
              }
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-blue-50 text-gray-600"
              }`}
            >
              {item.icon}

              <span className="font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto bg-blue-50 border border-blue-100 rounded-3xl p-5">
        <p className="font-bold text-gray-800">
          AI Monitoring Active
        </p>

        <p className="text-sm text-gray-500 mt-1">
          All civic systems operational
        </p>
      </div>
    </aside>
  );
}