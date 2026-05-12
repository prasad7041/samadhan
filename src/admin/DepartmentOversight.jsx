import React, { useState, useEffect } from "react";
import { getDepartments } from "../api/adminService";

import {
  Bell,
  Plus,
  Droplets,
  Zap,
  Trash2,
  Bus,
  HeartPulse,
  Clock3,
  FileText,
  Home,
  Users,
  Building2,
  ScrollText,
  Sparkles,
  Activity,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ================= DATA ================= */

const departments = [
  {
    name: "Water & Sewage",
    zone: "Zone 1 & 2",
    priority: "High Priority",
    priorityStyle:
      "bg-green-100 text-green-700",
    open: 142,
    resolved: 891,
    load: 78,
    avg: "4.2 hrs avg.",
    icon: <Droplets size={24} />,
    color: "from-blue-600 to-cyan-500",
  },

  {
    name: "Electricity Board",
    zone: "City-wide",
    priority: "Critical",
    priorityStyle:
      "bg-red-100 text-red-700",
    open: 254,
    resolved: 1205,
    load: 92,
    avg: "6.8 hrs avg.",
    icon: <Zap size={24} />,
    color: "from-red-500 to-orange-400",
  },

  {
    name: "Waste Management",
    zone: "Urban Clusters",
    priority: "Standard",
    priorityStyle:
      "bg-blue-100 text-blue-700",
    open: 86,
    resolved: 2410,
    load: 45,
    avg: "2.5 hrs avg.",
    icon: <Trash2 size={24} />,
    color: "from-slate-600 to-slate-400",
  },

  {
    name: "Roads & Transport",
    zone: "Public Works",
    priority: "Optimal",
    priorityStyle:
      "bg-green-100 text-green-700",
    open: 312,
    resolved: 548,
    load: 88,
    avg: "12.4 hrs avg.",
    icon: <Bus size={24} />,
    color: "from-gray-700 to-gray-500",
  },

  {
    name: "Public Health",
    zone: "Municipal Clinics",
    priority: "Review Needed",
    priorityStyle:
      "bg-yellow-100 text-yellow-700",
    open: 48,
    resolved: 432,
    load: 32,
    avg: "1.8 hrs avg.",
    icon: <HeartPulse size={24} />,
    color: "from-pink-500 to-rose-400",
  },
];

/* ================= MAIN ================= */

export default function DepartmentOversight() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = { Droplets, Zap, Trash2, Bus, HeartPulse };
  const defaultIcons = [Droplets, Zap, Trash2, Bus, HeartPulse];

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        const depts = res.data?.departments || res.data || [];
        if (Array.isArray(depts) && depts.length > 0) {
          setDepartments(depts.map((d, i) => ({
            name: d.name || d.sector || "Department",
            zone: d.zone || "General",
            priority: d.priority || "Standard",
            priorityStyle: "bg-blue-100 text-blue-700",
            open: d.open || 0,
            resolved: d.resolved || 0,
            load: d.load || 50,
            avg: d.avg || "N/A",
            icon: React.createElement(defaultIcons[i % defaultIcons.length], { size: 24 }),
            color: ["from-blue-600 to-cyan-500", "from-red-500 to-orange-400", "from-slate-600 to-slate-400", "from-gray-700 to-gray-500", "from-pink-500 to-rose-400"][i % 5],
          })));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDepts();
  }, []);
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
              Department Oversight
            </h2>

            <p className="text-gray-500 text-sm">
              AI Powered Civic Department Monitoring
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center">
              <Bell />

              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

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
                    Smart Department Monitoring
                  </h1>

                  <p className="text-blue-100 text-lg mt-2">
                    Monitor civic department
                    performance, workloads, and
                    operational efficiency in real-time.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroStat
                  icon={<Activity />}
                  title="Operational Health"
                  value="94.2%"
                />

                <HeroStat
                  icon={<Building2 />}
                  title="Departments"
                  value="12"
                />

                <HeroStat
                  icon={<ShieldCheck />}
                  title="Active Systems"
                  value="842"
                />

                <HeroStat
                  icon={<TrendingUp />}
                  title="Efficiency"
                  value="91%"
                />
              </div>
            </div>
          </section>

          {/* ================= DEPARTMENTS ================= */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <DepartmentCard
                key={index}
                dept={dept}
              />
            ))}

            {/* Add Department */}
            <div className="rounded-[36px] border-2 border-dashed border-blue-200 bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center p-10 hover:bg-white/80 transition-all cursor-pointer hover:scale-[1.02]">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl">
                <Plus size={34} />
              </div>

              <h3 className="text-2xl font-black mt-6">
                Add Department
              </h3>

              <p className="text-gray-500 text-center mt-3 leading-relaxed">
                Register and monitor a new
                municipal authority department.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <button className="fixed bottom-8 right-8 w-16 h-16 rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition z-50">
          <FileText size={28} />
        </button>
      </main>
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

/* ================= DEPARTMENT CARD ================= */

function DepartmentCard({ dept }) {
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[36px] shadow-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300">
      {/* Top Gradient */}
      <div
        className={`h-3 bg-gradient-to-r ${dept.color}`}
      />

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-md">
              {dept.icon}
            </div>

            <div>
              <h3 className="text-2xl font-black">
                {dept.name}
              </h3>

              <p className="text-gray-500 mt-1">
                {dept.zone}
              </p>
            </div>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${dept.priorityStyle}`}
          >
            {dept.priority}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-3xl p-5">
            <p className="text-sm text-gray-500">
              Open Tickets
            </p>

            <h4 className="text-3xl font-black mt-2">
              {dept.open}
            </h4>
          </div>

          <div className="bg-cyan-50 rounded-3xl p-5">
            <p className="text-sm text-gray-500">
              Resolved
            </p>

            <h4 className="text-3xl font-black text-blue-700 mt-2">
              {dept.resolved}
            </h4>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">
              Current Load
            </span>

            <span className="font-bold text-blue-700">
              {dept.load}%
            </span>
          </div>

          <div className="w-full h-4 bg-blue-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${dept.color} rounded-full`}
              style={{
                width: `${dept.load}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock3 size={18} />

            <span>{dept.avg}</span>
          </div>

          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-105 transition">
            <FileText size={18} />

            Contact Head
          </button>
        </div>
      </div>
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