import React from "react";

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
    avatar:
      "https://randomuser.me/api/portraits/men/32.jpg",
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
    avatar:
      "https://randomuser.me/api/portraits/women/44.jpg",
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
    avatar:
      "https://randomuser.me/api/portraits/men/68.jpg",
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
    avatar:
      "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

/* ================= MAIN ================= */

export default function AuthorityPerformance() {
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
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}

      <main className="pt-28 px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="mb-10 rounded-[36px] overflow-hidden relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-3">
              Department Performance
            </h2>

            <p className="text-blue-100 text-xl max-w-3xl leading-relaxed">
              Analyze authority efficiency,
              resolution performance, citizen
              satisfaction, and officer achievements
              through smart civic analytics.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              <HeroStat
                title="Resolved Cases"
                value="2.4k"
              />

              <HeroStat
                title="Active Officers"
                value="184"
              />

              <HeroStat
                title="Avg Rating"
                value="4.8"
              />

              <HeroStat
                title="Efficiency"
                value="91%"
              />
            </div>
          </div>
        </section>

        {/* Top Officers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {officers.map((officer) => (
            <OfficerCard
              key={officer.id}
              officer={officer}
            />
          ))}
        </div>
      </main>

      {/* ================= NAVBAR ================= */}

      <AuthorityNavbar />
    </div>
  );
}

/* ================= OFFICER CARD ================= */

function OfficerCard({ officer }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[36px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Top */}
      <div
        className={`bg-gradient-to-r ${officer.color} p-8 text-white relative overflow-hidden`}
      >
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

      {/* Content */}
      <div className="p-8">
        {/* Tag */}
        <div className="flex items-center justify-between mb-8">
          <span
            className={`px-5 py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${officer.color} shadow-lg`}
          >
            {officer.tag}
          </span>

          <div className="flex items-center gap-2 text-yellow-500">
            <Star />

            <span className="font-bold text-lg">
              {officer.score}/100
            </span>
          </div>
        </div>

        {/* Stats */}
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

/* ================= PERFORMANCE BOX ================= */

function PerformanceBox({
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

      <h3 className="text-2xl font-black text-gray-800">
        {value}
      </h3>
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

/* ================= COMMON NAVBAR ================= */

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