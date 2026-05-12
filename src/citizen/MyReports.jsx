import React from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Search,
  Eye,
  MapPin,
  CalendarDays,
  TrendingUp,
  Filter,
} from "lucide-react";

import CitizenNavbar from "./CitizenNavbar";

/* ================= REPORTS ================= */

const reports = [
  {
    id: 1,
    title: "Garbage Overflow",
    status: "Pending",
    location: "Madhapur Main Road",
    date: "12 May 2026",
    priority: "High",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    title: "Street Light Failure",
    status: "Resolved",
    location: "KPHB Colony",
    date: "09 May 2026",
    priority: "Medium",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    title: "Road Damage",
    status: "In Progress",
    location: "Ameerpet Junction",
    date: "06 May 2026",
    priority: "Critical",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
];

/* ================= MAIN ================= */

export default function MyReports() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      {/* ================= BACKGROUND EFFECTS ================= */}

      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate(-1)
              }
              className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"
            >
              <ArrowLeft className="text-blue-700" />
            </button>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                My Reports
              </h1>

              <p className="text-sm text-gray-500">
                Track all your civic reports
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg">
              <Search
                size={18}
                className="text-blue-500"
              />

              <input
                type="text"
                placeholder="Search reports..."
                className="bg-transparent outline-none ml-3 w-56"
              />
            </div>

            {/* Filter */}
            <button className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Filter className="text-blue-700" />
            </button>

            {/* Notification */}
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Bell className="text-blue-700" />

              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex gap-8">
        {/* ================= COMMON NAVBAR ================= */}

        <CitizenNavbar />

        {/* ================= CONTENT ================= */}

        <div className="flex-1 space-y-8">
          {/* ================= HERO ================= */}

          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-10">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <TrendingUp size={30} />
                </div>

                <div>
                  <h1 className="text-5xl font-black">
                    Civic Report Tracking
                  </h1>

                  <p className="text-blue-100 text-lg mt-2">
                    Monitor report progress,
                    authority actions, and issue
                    resolution updates.
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroCard
                  title="Total Reports"
                  value="142"
                />

                <HeroCard
                  title="Resolved"
                  value="108"
                />

                <HeroCard
                  title="Pending"
                  value="24"
                />

                <HeroCard
                  title="In Progress"
                  value="10"
                />
              </div>
            </div>
          </section>

          {/* ================= REPORTS ================= */}

          <div className="space-y-8">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-72 object-cover"
                  />

                  {/* STATUS */}
                  <div className="absolute top-5 right-5">
                    <span
                      className={`px-5 py-3 rounded-full text-sm font-bold shadow-lg ${
                        report.status ===
                        "Resolved"
                          ? "bg-green-100 text-green-700"
                          : report.status ===
                            "Pending"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8">
                  {/* TOP */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">
                          <FileText size={24} />
                        </div>

                        <div>
                          <h2 className="text-3xl font-black text-gray-800">
                            {report.title}
                          </h2>

                          <p className="text-gray-500 mt-1">
                            Issue ID:
                            {" "}
                            #SM-
                            {report.id}
                            2026
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PRIORITY */}
                    <span
                      className={`px-5 py-3 rounded-2xl text-sm font-bold w-fit ${
                        report.priority ===
                        "Critical"
                          ? "bg-red-100 text-red-700"
                          : report.priority ===
                            "High"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {report.priority} Priority
                    </span>
                  </div>

                  {/* INFO */}
                  <div className="grid md:grid-cols-3 gap-5 mt-8">
                    <InfoCard
                      icon={<MapPin size={18} />}
                      title="Location"
                      value={report.location}
                    />

                    <InfoCard
                      icon={<CalendarDays size={18} />}
                      title="Reported On"
                      value={report.date}
                    />

                    <InfoCard
                      icon={<Clock3 size={18} />}
                      title="Current Status"
                      value={report.status}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-2">
                      <Eye size={18} />

                      View Details
                    </button>

                    <button className="px-7 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition flex items-center gap-2">
                      <CheckCircle2 size={18} />

                      Track Progress
                    </button>

                    <button className="px-7 py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition flex items-center gap-2">
                      <AlertTriangle size={18} />

                      Escalate
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

/* ================= HERO CARD ================= */

function HeroCard({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <p className="text-blue-100 text-sm uppercase tracking-widest">
        {title}
      </p>

      <h3 className="text-5xl font-black mt-3">
        {value}
      </h3>
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
      <div className="flex items-center gap-3 text-blue-700 mb-3">
        {icon}

        <span className="font-semibold">
          {title}
        </span>
      </div>

      <h3 className="font-bold text-gray-800 text-lg">
        {value}
      </h3>
    </div>
  );
}