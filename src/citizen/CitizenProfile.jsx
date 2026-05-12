import React from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Edit3,
  BadgeCheck,
  Trophy,
  ShieldCheck,
  Star,
  Camera,
  Calendar,
  FileText,
  Activity,
  Bell,
  Settings,
} from "lucide-react";

import CitizenNavbar from "./CitizenNavbar";

export default function CitizenProfile() {
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
                Citizen Profile
              </h1>

              <p className="text-sm text-gray-500">
                Smart Civic Identity
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Bell className="text-blue-700" />

              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>

            <button className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Settings className="text-blue-700" />
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
          {/* ================= HERO PROFILE ================= */}

          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-10">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-center">
              {/* PROFILE IMAGE */}
              <div className="relative">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Profile"
                  className="w-52 h-52 rounded-[36px] object-cover border-4 border-white/20 shadow-2xl"
                />

                {/* Camera */}
                <button className="absolute bottom-4 right-4 w-14 h-14 rounded-2xl bg-white text-blue-700 shadow-xl flex items-center justify-center hover:scale-105 transition">
                  <Camera size={22} />
                </button>
              </div>

              {/* INFO */}
              <div className="flex-1">
                {/* VERIFIED */}
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <span className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/10 font-bold flex items-center gap-2">
                    <BadgeCheck size={18} />

                    Verified Citizen
                  </span>

                  <span className="px-5 py-3 rounded-2xl bg-yellow-400 text-black font-black shadow-lg flex items-center gap-2">
                    <Star size={18} />

                    4.9 Rating
                  </span>
                </div>

                <h2 className="text-6xl font-black leading-tight">
                  Vamsi Prasad
                </h2>

                <p className="text-blue-100 text-xl mt-3">
                  Active Civic Contributor
                </p>

                {/* CONTACT */}
                <div className="grid md:grid-cols-2 gap-5 mt-8">
                  <InfoCard
                    icon={<Mail size={18} />}
                    title="Email"
                    value="vamsi@gmail.com"
                  />

                  <InfoCard
                    icon={<Phone size={18} />}
                    title="Phone"
                    value="+91 9876543210"
                  />

                  <InfoCard
                    icon={<MapPin size={18} />}
                    title="Location"
                    value="Andhra Pradesh, India"
                  />

                  <InfoCard
                    icon={<Calendar size={18} />}
                    title="Joined"
                    value="Jan 2025"
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="px-7 py-4 rounded-2xl bg-white text-blue-700 font-bold shadow-xl hover:scale-105 transition flex items-center gap-2">
                    <Edit3 size={18} />

                    Edit Profile
                  </button>

                  <button className="px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 font-bold hover:bg-white/20 transition flex items-center gap-2">
                    <ShieldCheck size={18} />

                    Privacy Settings
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================= STATS ================= */}

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              icon={<FileText />}
              title="Reports Submitted"
              value="142"
              color="from-blue-600 to-cyan-500"
            />

            <StatCard
              icon={<Activity />}
              title="Resolved Issues"
              value="108"
              color="from-green-500 to-emerald-400"
            />

            <StatCard
              icon={<Trophy />}
              title="Reward Points"
              value="2,840"
              color="from-yellow-500 to-orange-400"
            />

            <StatCard
              icon={<ShieldCheck />}
              title="Trust Score"
              value="98%"
              color="from-purple-500 to-indigo-500"
            />
          </section>

          {/* ================= ACHIEVEMENTS ================= */}

          <section className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[36px] shadow-xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-400 text-white flex items-center justify-center shadow-xl">
                <Trophy size={30} />
              </div>

              <div>
                <h3 className="text-4xl font-black text-gray-800">
                  Achievements
                </h3>

                <p className="text-gray-500">
                  Your civic contribution badges
                </p>
              </div>
            </div>

            {/* BADGES */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AchievementCard
                title="Top Contributor"
                description="Submitted 100+ verified civic reports."
                gradient="from-blue-600 to-cyan-500"
              />

              <AchievementCard
                title="Rapid Reporter"
                description="Fastest verified issue reporting in your district."
                gradient="from-green-500 to-emerald-400"
              />

              <AchievementCard
                title="Community Hero"
                description="Highly rated citizen by local community."
                gradient="from-purple-500 to-indigo-500"
              />
            </div>
          </section>
        </div>
      </main>
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
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
      <div className="flex items-center gap-3 text-white/80 mb-2">
        {icon}

        <span className="font-semibold">
          {title}
        </span>
      </div>

      <h3 className="font-bold text-lg">
        {value}
      </h3>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[32px] shadow-xl p-7 hover:-translate-y-1 hover:shadow-2xl transition-all">
      <div
        className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${color} text-white flex items-center justify-center shadow-lg mb-6`}
      >
        {icon}
      </div>

      <p className="text-gray-500 text-lg">
        {title}
      </p>

      <h3 className="text-5xl font-black text-gray-800 mt-3">
        {value}
      </h3>
    </div>
  );
}

/* ================= ACHIEVEMENT CARD ================= */

function AchievementCard({
  title,
  description,
  gradient,
}) {
  return (
    <div
      className={`rounded-[32px] p-8 text-white shadow-xl bg-gradient-to-r ${gradient}`}
    >
      <h3 className="text-2xl font-black mb-4">
        {title}
      </h3>

      <p className="text-white/90 leading-relaxed">
        {description}
      </p>
    </div>
  );
}