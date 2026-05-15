import React, { useState, useEffect } from "react";
import { getSectorComplaints, updateComplaintStatus } from "../api/complaintService";

import {
  Menu,
  Notifications,
  AssignmentTurnedIn,
  Home,
  AssignmentInd,
  MilitaryTech,
  AccountCircle,
  ThumbUp,
  Chat,
  Repeat,
  LocationOn,
  CalendarToday,
  Search,
} from "@mui/icons-material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ================= DATA ================= */

const initialTasks = [
  {
    id: 1,
    title: "Repair Broken Street Lights",
    department: "Electrical Department",
    location: "Central Avenue",
    reported: "2 hours ago",
    status: "Pending",
    priority: "High",
    likes: 124,
    comments: 32,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Three streetlights are completely non-functional causing safety concerns during night hours.",
  },

  {
    id: 2,
    title: "Drainage Overflow",
    department: "Water Management",
    location: "Sector 4 Market",
    reported: "5 hours ago",
    status: "In Progress",
    priority: "Medium",
    likes: 89,
    comments: 18,
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
    description:
      "Drainage system overflow near the market area affecting nearby shops and pedestrians.",
  },

  {
    id: 3,
    title: "Road Pothole Repair",
    department: "Roads Department",
    location: "Lakeview Road",
    reported: "Yesterday",
    status: "Resolved",
    priority: "Low",
    likes: 54,
    comments: 11,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    description:
      "Large potholes creating inconvenience and traffic delays for commuters.",
  },
];

/* ================= MAIN ================= */

export default function AuthorityTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getSectorComplaints(1, 50);
        const list = res?.data?.complaints || res?.complaints || res?.data || [];
        const complaints = Array.isArray(list) ? list : (Array.isArray(res?.data?.data?.complaints) ? res.data.data.complaints : []);
        setTasks(complaints.map(c => ({
          id: c.id,
          title: c.title || c.description?.slice(0, 40) + "...",
          department: c.sector || "General",
          location: c.location || "Unknown",
          reported: new Date(c.created_at).toLocaleDateString(),
          status: c.status === "resolved" ? "Resolved" : c.status === "in_progress" ? "In Progress" : "Pending",
          priority: c.priority === "high" || c.priority === "critical" ? "High" : c.priority === "medium" ? "Medium" : "Low",
          likes: 0, comments: 0,
          image: c.image_path || null,
          description: c.description,
        })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTasks();
  }, []);

  const handleLike = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus, `Status updated to ${newStatus}`);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus === "resolved" ? "Resolved" : newStatus === "in_progress" ? "In Progress" : "Pending" } : t));
    } catch (err) { console.error(err); }
  };

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
              <AssignmentTurnedIn />
            </div>

            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Authority Tasks
              </h1>

              <p className="text-xs text-gray-500">
                Task & Issue Management
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-blue-50 border border-blue-100 px-4 h-12 rounded-2xl">
            <Search className="text-blue-600" />

            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent outline-none ml-3 w-52"
            />
          </div>

          {/* Notification */}
          <button className="relative w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
            <Notifications className="text-blue-700" />

            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
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
              Assigned Tasks
            </h2>

            <p className="text-blue-100 text-xl max-w-3xl leading-relaxed">
              Manage civic complaints assigned to
              your department and monitor public
              infrastructure issue resolution.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              <HeroStat
                title="Pending"
                value="18"
              />

              <HeroStat
                title="In Progress"
                value="42"
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

        {/* Tasks Feed */}
        <div className="space-y-10">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleLike={handleLike}
            />
          ))}
        </div>
      </main>

      {/* ================= COMMON NAVBAR ================= */}

      <AuthorityNavbar />
    </div>
  );
}

/* ================= TASK CARD ================= */

function TaskCard({
  task,
  handleLike,
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative">
        <img
          src={task.image}
          alt={task.title}
          className="w-full h-80 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status */}
        <div className="absolute top-5 left-5">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
              task.status === "Pending"
                ? "bg-red-100 text-red-700"
                : task.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Overlay Text */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-sm opacity-80 mb-2">
            {task.department}
          </p>

          <h3 className="text-4xl font-black mb-3">
            {task.title}
          </h3>

          <p className="text-white/90 max-w-3xl leading-relaxed">
            {task.description}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6">
        {/* Details */}
        <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <LocationOn className="text-blue-600" />

              <span className="font-medium">
                {task.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarToday className="text-blue-600" />

              <span className="font-medium">
                {task.reported}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div
            className={`px-5 py-3 rounded-2xl text-white font-bold shadow-lg ${
              task.priority === "High"
                ? "bg-gradient-to-r from-red-500 to-red-400"
                : task.priority === "Medium"
                ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                : "bg-gradient-to-r from-gray-500 to-gray-400"
            }`}
          >
            {task.priority} Priority
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-blue-100 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Like */}
            <button
              onClick={() =>
                handleLike(task.id)
              }
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
            >
              <ThumbUp />

              <span className="font-semibold">
                {task.likes}
              </span>
            </button>

            {/* Comments */}
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
              <Chat />

              <span className="font-semibold">
                {task.comments}
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

          {/* Action Button */}
          <button
            className={`px-6 py-3 rounded-2xl text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition ${
              task.status === "Resolved"
                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                : "bg-gradient-to-r from-blue-600 to-cyan-500"
            }`}
          >
            {task.status === "Resolved"
              ? "Completed"
              : "View Task"}
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