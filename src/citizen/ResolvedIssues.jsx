import React from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Bell,
  Search,
  TrendingUp,
  Trophy,
  ShieldCheck,
  MapPin,
  Eye,
  Star,
  Filter,
} from "lucide-react";

import CitizenNavbar from "./CitizenNavbar";

/* ================= RESOLVED ISSUES ================= */

const resolved = [
  {
    id: 1,
    title: "Road Damage Fixed",
    date: "May 8, 2026",
    location: "Madhapur Main Road",
    department: "Roads & Transport",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Damaged roads and potholes were successfully repaired improving traffic flow and public safety.",
  },

  {
    id: 2,
    title: "Drainage Cleaned",
    date: "May 6, 2026",
    location: "Kukatpally",
    department: "Water & Drainage",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    description:
      "Blocked drainage systems were cleaned preventing overflow and water stagnation.",
  },

  {
    id: 3,
    title: "Street Lights Restored",
    date: "May 2, 2026",
    location: "Ameerpet Junction",
    department: "Electricity Board",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Faulty street lights were repaired enhancing night-time visibility and safety.",
  },
];

/* ================= MAIN ================= */

export default function ResolvedIssues() {
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
                Resolved Issues
              </h1>

              <p className="text-sm text-gray-500">
                Successfully completed civic
                reports
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
                placeholder="Search resolved issues..."
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
                    Successful Civic Actions
                  </h1>

                  <p className="text-blue-100 text-lg mt-2">
                    Track completed civic
                    improvements and see how
                    citizen participation is making
                    the city better.
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroCard
                  title="Resolved"
                  value="842"
                />

                <HeroCard
                  title="Success Rate"
                  value="91%"
                />

                <HeroCard
                  title="Citizens Helped"
                  value="24k+"
                />

                <HeroCard
                  title="Departments"
                  value="12"
                />
              </div>
            </div>
          </section>

          {/* ================= ISSUES ================= */}

          <div className="space-y-8">
            {resolved.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-72 object-cover"
                  />

                  {/* RESOLVED BADGE */}
                  <div className="absolute top-5 right-5">
                    <span className="px-5 py-3 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-lg flex items-center gap-2">
                      <CheckCircle2
                        size={16}
                      />

                      Resolved
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8">
                  {/* TOP */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-xl">
                        <CheckCircle2
                          size={28}
                        />
                      </div>

                      <div>
                        <h2 className="text-3xl font-black text-gray-800">
                          {item.title}
                        </h2>

                        <p className="text-gray-500 mt-1">
                          Resolution ID:
                          {" "}
                          #RS-
                          {item.id}
                          2026
                        </p>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="px-5 py-3 rounded-2xl bg-yellow-100 text-yellow-700 font-bold flex items-center gap-2 w-fit">
                      <Star size={18} />

                      {item.rating} Rating
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 leading-relaxed mt-6">
                    {item.description}
                  </p>

                  {/* INFO */}
                  <div className="grid md:grid-cols-3 gap-5 mt-8">
                    <InfoCard
                      icon={<MapPin size={18} />}
                      title="Location"
                      value={item.location}
                    />

                    <InfoCard
                      icon={<Calendar size={18} />}
                      title="Resolved On"
                      value={item.date}
                    />

                    <InfoCard
                      icon={
                        <ShieldCheck
                          size={18}
                        />
                      }
                      title="Department"
                      value={item.department}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-2">
                      <Eye size={18} />

                      View Details
                    </button>

                    <button className="px-7 py-4 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition flex items-center gap-2">
                      <Trophy size={18} />

                      Appreciate
                    </button>

                    <button className="px-7 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition flex items-center gap-2">
                      <TrendingUp size={18} />

                      View Progress
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