import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../api/adminService";
import { getAllComplaints } from "../api/complaintService";

import {
  Dashboard,
  Group,
  AccountBalance,
  ReceiptLong,
  Search,
  Notifications,
  Person,
  TaskAlt,
  Bolt,
  TrendingUp,
  WarningAmber,
  Home,
} from "@mui/icons-material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ================= DATA ================= */

const departments = [
  { name: "Sanitation", value: 98 },
  { name: "Public Works", value: 82 },
  { name: "Water Supply", value: 64 },
  { name: "Electricity", value: 91 },
];

const escalations = [
  {
    id: "#SM-9821",
    issue: "Main Pipe Burst",
    location: "Central District, Area 4",
    status: "-2h 45m",
  },

  {
    id: "#SM-9844",
    issue: "Grid Outage",
    location: "Industrial Zone B",
    status: "-1h 12m",
  },

  {
    id: "#SM-9856",
    issue: "Hazardous Waste",
    location: "Old Town Riverside",
    status: "Due in 15m",
  },
];

const chartHeights = [
  "40%",
  "60%",
  "85%",
  "55%",
  "45%",
  "70%",
  "95%",
];

/* ================= MAIN ================= */

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalCitizens: 0, totalAuthorities: 0, totalComplaints: 0, resolvedComplaints: 0 });
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([getDashboardStats(), getAllComplaints({ status: 'pending', page: 1, limit: 5 })]);
        if (statsRes.data) setStats(statsRes.data);
        const complaints = complaintsRes.data?.complaints || [];
        setEscalations(complaints.map(c => ({ id: `#SM-${c.id}`, issue: c.description?.slice(0, 25) + "...", location: c.location || "Unknown", status: new Date(c.created_at).toLocaleDateString() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex text-gray-900 overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar />

      {/* ================= MAIN ================= */}

      <main className="flex-1 lg:ml-[22rem] flex flex-col">
        {/* ================= HEADER ================= */}

        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-blue-100 px-8 h-20 flex items-center justify-between">
          {/* Left */}
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>

            <p className="text-gray-500 text-sm">
              AI Powered Civic Monitoring System
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-blue-100 px-5 py-3 rounded-2xl shadow-lg">
              <Search className="text-gray-500" />

              <input
                type="text"
                placeholder="Search system records..."
                className="bg-transparent outline-none w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center">
              <Notifications className="text-blue-700" />

              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-xl">
              AU
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <div className="p-8 space-y-8">
          {/* KPI CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard
              icon={<Person />}
              title="Active Users"
              value="24,892"
              change="+12%"
            />

            <KpiCard
              icon={<TaskAlt />}
              title="Total Resolved"
              value="1,402"
              change="+5%"
            />

            <KpiCard
              icon={<Bolt />}
              title="Efficiency Rate"
              value="94.2%"
              change="-2%"
            />
          </section>

          {/* ================= CHARTS ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Complaint Trends */}
            <section className="lg:col-span-8 bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-xl p-8 border border-blue-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black">
                    Complaint Trends
                  </h3>

                  <p className="text-gray-500">
                    Weekly civic analytics
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                    Weekly
                  </button>

                  <button className="px-5 py-2 rounded-2xl bg-blue-50 text-gray-700">
                    Monthly
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[32px] flex items-end gap-4 px-6 overflow-hidden border border-blue-100">
                {chartHeights.map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-3xl bg-gradient-to-t from-blue-700 to-cyan-400 hover:scale-105 transition-all duration-300 shadow-lg"
                      style={{ height }}
                    />
                  )
                )}
              </div>

              <div className="flex justify-between mt-5 text-gray-500 text-sm px-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </section>

            {/* Department Performance */}
            <section className="lg:col-span-4 bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="text-blue-700 text-4xl" />

                <h3 className="text-3xl font-black">
                  Department Performance
                </h3>
              </div>

              <div className="space-y-6">
                {departments.map(
                  (dept, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-3">
                        <span className="font-semibold">
                          {dept.name}
                        </span>

                        <span className="text-blue-700 font-black">
                          {dept.value}%
                        </span>
                      </div>

                      <div className="w-full bg-blue-50 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full"
                          style={{
                            width: `${dept.value}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              <button className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition">
                View Full Reports
              </button>
            </section>

            {/* Escalations */}
            <section className="lg:col-span-12 bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-xl border border-blue-100 p-8 overflow-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <WarningAmber className="text-red-500 text-4xl" />

                  <div>
                    <h3 className="text-3xl font-black">
                      Critical Escalations
                    </h3>

                    <p className="text-gray-500">
                      Immediate actions required
                    </p>
                  </div>
                </div>

                <span className="bg-red-100 text-red-700 px-5 py-2 rounded-full text-sm font-bold">
                  4 Actions Required
                </span>
              </div>

              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-blue-100 text-left text-gray-500">
                    <th className="py-5">
                      Ticket ID
                    </th>

                    <th>Issue Type</th>

                    <th>Location</th>

                    <th>SLA Status</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {escalations.map(
                    (item, index) => (
                      <tr
                        key={index}
                        className="border-b border-blue-50 hover:bg-blue-50/50 transition"
                      >
                        <td className="py-5 font-black text-blue-700">
                          {item.id}
                        </td>

                        <td className="font-semibold">
                          {item.issue}
                        </td>

                        <td>{item.location}</td>

                        <td className="text-red-600 font-bold">
                          {item.status}
                        </td>

                        <td>
                          <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition">
                            Assign Dept
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </div>

        {/* Floating Status */}
        <div className="fixed bottom-5 right-5 bg-white/90 backdrop-blur-2xl border border-blue-100 rounded-3xl px-6 py-4 shadow-2xl flex items-center gap-4 z-50">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

          <div>
            <p className="font-bold text-sm">
              System Operational
            </p>

            <p className="text-xs text-gray-500">
              All services running normally
            </p>
          </div>
        </div>
      </main>
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
      icon: <Home />,
      path: "/admin",
    },

    {
      label: "User Management",
      icon: <Group />,
      path: "/admin/usermanagement",
    },

    {
      label: "Departments",
      icon: <AccountBalance />,
      path: "/admin/departmentoversight",
    },

    {
      label: "Logs",
      icon: <ReceiptLong />,
      path: "/admin/auditlogs",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-80 fixed left-5 top-5 h-[95vh] bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[40px] p-6 shadow-2xl z-50">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
            <Dashboard />
          </div>

          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Samadhan
            </h1>

            <p className="text-xs text-gray-500">
              Smart Civic AI Admin
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 p-4 rounded-3xl mb-8">
        <img
          src="https://i.pravatar.cc/100"
          alt="admin"
          className="w-14 h-14 rounded-2xl"
        />

        <div>
          <p className="font-bold text-lg">
            Admin Portal
          </p>

          <p className="text-sm text-gray-500">
            System Administrator
          </p>
        </div>
      </div>

      {/* Nav */}
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
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active
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
    </aside>
  );
}

/* ================= KPI CARD ================= */

function KpiCard({
  icon,
  title,
  value,
  change,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-xl border border-blue-100 p-7 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-4 rounded-3xl text-white shadow-lg">
          {icon}
        </div>

        <span
          className={`font-bold px-4 py-2 rounded-full ${change.startsWith("+")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {change}
        </span>
      </div>

      <p className="text-gray-500 text-lg">
        {title}
      </p>

      <h3 className="text-6xl font-black mt-3 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
        {value}
      </h3>
    </div>
  );
}