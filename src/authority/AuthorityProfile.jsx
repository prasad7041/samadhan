import React, { useState, useEffect, useMemo } from "react";
import { getAuthorityProfile } from "../api/authService";
import { getAssignedComplaints } from "../api/complaintService";
import { useAuth } from "../context/AuthContext";
import AuthorityNavbar from "./AuthorityNavbar";
import {
  Verified,
  Badge,
  Email,
  Phone,
  LocationOn,
  CalendarMonth,
  AssignmentTurnedIn,
  TrendingUp,
  EmojiEvents,
  WorkspacePremium,
  AccountCircle,
  Edit,
} from "@mui/icons-material";

/* ================= MAIN COMPONENT ================= */

export default function AuthorityProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resolved, setResolved] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [profRes, tasksRes] = await Promise.all([
          getAuthorityProfile(), 
          getAssignedComplaints(1, 100)
        ]);
        
        if (isMounted) {
          setProfile(profRes.data?.user);
          const complaints = tasksRes.data?.complaints || [];
          setResolved(complaints.filter(c => c.status === "resolved" || c.status === "Resolved").length);
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        if (isMounted) setLoading(false); 
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Memoize computed values to prevent rebuilding strings and re-parsing dates on every render pass
  const officer = useMemo(() => {
    return {
      name: profile?.email?.split("@")[0] || user?.email?.split("@")[0] || "Officer",
      role: profile?.job_role || "Civic Officer",
      department: profile?.sector || "General",
      email: profile?.email || "N/A",
      phone: profile?.mobile || "N/A",
      location: `${profile?.area || "N/A"}${profile?.pincode ? `, ${profile.pincode}` : ""}`,
      joined: profile?.created_at 
        ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      resolved,
      rating: 4.8,
      efficiency: "91%",
      tag: "Active Officer",
      avatar: profile?.profile_picture || "https://randomuser.me/api/portraits/men/32.jpg",
    };
  }, [profile, user, resolved]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 pb-32 overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 px-6 h-20 flex items-center justify-between shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
            <AccountCircle />
          </div>

          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Authority Profile
            </h1>
            <p className="text-xs text-gray-500">
              Officer Information & Achievements
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button className="w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
          <Edit className="text-blue-700" />
        </button>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="pt-28 px-6 max-w-7xl mx-auto">
        <AuthorityNavbar />

        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-10 mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
            {/* Avatar Profile Grid wrapper */}
            <div className="relative">
              <img
                src={officer.avatar}
                alt={officer.name}
                className="w-48 h-48 rounded-[36px] object-cover border-4 border-white/20 shadow-2xl"
                onError={(e) => {
                  e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
                }}
              />

              <div className="absolute -bottom-4 -right-4 bg-white text-blue-700 rounded-2xl px-4 py-3 font-bold shadow-xl flex items-center gap-2 select-none">
                <Verified />
                Verified
              </div>
            </div>

            {/* Info Layout */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <span className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/10 font-bold text-sm">
                  {officer.tag}
                </span>

                <span className="px-5 py-3 rounded-2xl bg-yellow-400 text-black font-black shadow-lg text-sm">
                  ⭐ {officer.rating}
                </span>
              </div>

              <h2 className="text-5xl font-black mb-3 tracking-tight">
                {officer.name}
              </h2>

              <p className="text-2xl text-white/90 mb-6 font-medium">
                {officer.role}
              </p>

              {/* Department badge wrapper */}
              <div className="flex items-center gap-3 mb-6 text-lg font-semibold text-blue-50">
                <Badge />
                {officer.department}
              </div>

              {/* Contact Credentials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoCard
                  icon={<Email />}
                  label="Email"
                  value={officer.email}
                />
                <InfoCard
                  icon={<Phone />}
                  label="Phone"
                  value={officer.phone}
                />
                <InfoCard
                  icon={<LocationOn />}
                  label="Location"
                  value={officer.location}
                />
                <InfoCard
                  icon={<CalendarMonth />}
                  label="Joined"
                  value={officer.joined}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            icon={<AssignmentTurnedIn />}
            title="Resolved Cases"
            value={officer.resolved}
            color="from-blue-600 to-cyan-500"
          />
          <StatCard
            icon={<TrendingUp />}
            title="Efficiency"
            value={officer.efficiency}
            color="from-green-500 to-emerald-400"
          />
          <StatCard
            icon={<EmojiEvents />}
            title="Recognition"
            value="Excellent"
            color="from-yellow-500 to-orange-400"
          />
        </div>

        {/* Honor Badges & Achievements Display */}
        <section className="mt-10 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[36px] p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <WorkspacePremium className="text-yellow-500 text-4xl" />
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">
              Achievements & Credits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AchievementCard
              title="Top Performer 2026"
              description="Awarded for highest citizen satisfaction score."
              color="from-yellow-500 to-orange-400"
            />
            <AchievementCard
              title="Rapid Response Officer"
              description="Resolved emergency civic complaints under 2 hours."
              color="from-blue-600 to-cyan-500"
            />
            <AchievementCard
              title="Community Hero"
              description="Recognized for outstanding public engagement."
              color="from-pink-500 to-rose-400"
            />
            <AchievementCard
              title="Infrastructure Excellence"
              description="Maintained highest resolution efficiency."
              color="from-green-500 to-emerald-400"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= COMPONENT MEMOIZATION WRAPPERS ================= */

const InfoCard = React.memo(function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-sm transition-all hover:bg-white/15">
      <div className="flex items-center gap-3 mb-2 text-white/80">
        {icon}
        <span className="font-semibold text-sm tracking-wide">
          {label}
        </span>
      </div>
      <h3 className="text-lg font-bold truncate">
        {value}
      </h3>
    </div>
  );
});

const StatCard = React.memo(function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[36px] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${color} text-white flex items-center justify-center shadow-lg mb-6`}>
        {icon}
      </div>
      <p className="text-gray-500 text-lg mb-2 font-medium">
        {title}
      </p>
      <h3 className="text-5xl font-black text-gray-800">
        {value}
      </h3>
    </div>
  );
});

const AchievementCard = React.memo(function AchievementCard({ title, description, color }) {
  return (
    <div className={`rounded-[32px] p-8 text-white shadow-xl bg-gradient-to-r ${color} hover:scale-[1.01] transition-transform duration-200`}>
      <h3 className="text-2xl font-black mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-white/90 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
});