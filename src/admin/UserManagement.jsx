import React, { useState, useEffect } from "react";
import { getAllCitizens, getAllAuthorities, deleteUser } from "../api/adminService";

import {
  Bell,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Home,
  Users,
  Building2,
  ScrollText,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ================= MAIN ================= */

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("citizens");

  const fetchUsers = async (tab) => {
    setLoading(true);
    try {
      const res = tab === "citizens" ? await getAllCitizens(1, 50) : await getAllAuthorities(1, 50);
      const list = res.data?.citizens || res.data?.authorities || [];
      setUsers(list.map(u => ({
        initials: (u.full_name || u.email || "?").slice(0, 2).toUpperCase(),
        name: u.full_name || u.email?.split("@")[0] || "User",
        email: u.email || u.mobile || "N/A",
        sector: u.sector || u.area || "N/A",
        role: tab === "citizens" ? "Citizen" : u.job_role || "Authority",
        status: "Active",
        score: "—",
        id: u.id,
        userRole: tab === "citizens" ? "citizen" : "authority",
      })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(activeTab); }, [activeTab]);

  const handleDelete = async (role, id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try { await deleteUser(role, id); fetchUsers(activeTab); } catch (err) { console.error(err); }
  };

  const statusStyles = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Suspended: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex text-gray-900 overflow-hidden relative">
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
              User Management
            </h2>

            <p className="text-gray-500 text-sm">
              AI Powered Civic User Analytics
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-blue-100 px-5 py-3 rounded-2xl shadow-lg">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search users..."
                className="bg-transparent outline-none w-60"
              />
            </div>

            {/* Notification */}
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center">
              <Bell />

              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-xl">
              AU
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <div className="p-8 space-y-8">
          {/* ================= HERO ================= */}

          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <Sparkles size={34} />
                </div>

                <div>
                  <h1 className="text-5xl font-black">
                    Smart User Monitoring
                  </h1>

                  <p className="text-blue-100 text-lg mt-2">
                    Real-time citizen and authority
                    analytics powered by AI.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroStat
                  icon={<Users />}
                  title="Total Users"
                  value="12,482"
                />

                <HeroStat
                  icon={<Activity />}
                  title="Active Now"
                  value="842"
                />

                <HeroStat
                  icon={<ShieldCheck />}
                  title="Verified"
                  value="8,142"
                />

                <HeroStat
                  icon={<Sparkles />}
                  title="Engagement"
                  value="85%"
                />
              </div>
            </div>
          </section>

          {/* ================= TABLE ================= */}

          <section className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-2xl overflow-hidden">
            {/* Controls */}
            <div className="p-8 border-b border-blue-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              {/* Tabs */}
              <div className="flex bg-blue-50 p-2 rounded-2xl">
                <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg font-bold">
                  Citizens
                </button>

                <button className="px-8 py-3 rounded-2xl text-gray-600 hover:bg-white transition">
                  Authority
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-11 pr-5 py-3 border border-blue-100 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-blue-400 w-72"
                  />
                </div>

                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-blue-100 bg-white hover:bg-blue-50 transition shadow-sm">
                  <Filter size={18} />

                  Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-blue-50/70">
                  <tr className="text-left text-gray-600">
                    <th className="px-8 py-5">
                      User Details
                    </th>

                    <th className="px-8 py-5">
                      Sector
                    </th>

                    <th className="px-8 py-5">
                      Role
                    </th>

                    <th className="px-8 py-5">
                      Trust Score
                    </th>

                    <th className="px-8 py-5">
                      Status
                    </th>

                    <th className="px-8 py-5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="border-t border-blue-50 hover:bg-blue-50/40 transition"
                    >
                      {/* User */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-lg">
                            {user.initials}
                          </div>

                          <div>
                            <p className="font-bold text-lg">
                              {user.name}
                            </p>

                            <p className="text-gray-500 text-sm">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="px-8 py-6 text-gray-700 font-medium">
                        {user.sector}
                      </td>

                      {/* Role */}
                      <td className="px-8 py-6">
                        <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold">
                          {user.role}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-3 rounded-full bg-blue-100 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                              style={{
                                width: user.score,
                              }}
                            />
                          </div>

                          <span className="font-bold text-blue-700">
                            {user.score}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span
                          className={`px-4 py-2 rounded-full border text-sm font-bold ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <button className="w-11 h-11 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-700 transition">
                            <Edit size={18} />
                          </button>

                          <button className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition">
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 p-8 border-t border-blue-100 bg-blue-50/50">
              <p className="text-gray-500">
                Showing 1 to 10 of 12,482 users
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

        {/* Floating Add */}
        <button className="fixed bottom-8 right-8 w-16 h-16 rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition z-50">
          <Plus size={28} />
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