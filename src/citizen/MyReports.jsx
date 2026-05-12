import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReports } from "../api/complaintService";
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
  Loader2,
} from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, inProgress: 0 });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await getMyReports(1, 50);
        const complaints = res.data?.complaints || [];
        setReports(complaints);

        // Calculate stats
        setStats({
          total: complaints.length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
          pending: complaints.filter((c) => c.status === "pending").length,
          inProgress: complaints.filter((c) => c.status === "in_progress").length,
        });
      } catch (err) {
        setError("Failed to load your reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return path;
  };

  const getStatusStyle = (status) => {
    if (status === "resolved") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "critical") return "bg-red-100 text-red-700";
    if (priority === "high") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <ArrowLeft className="text-blue-700" />
            </button>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">My Reports</h1>
              <p className="text-sm text-gray-500">Track all your civic reports</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg">
              <Search size={18} className="text-blue-500" />
              <input type="text" placeholder="Search reports..." className="bg-transparent outline-none ml-3 w-56" />
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Filter className="text-blue-700" />
            </button>
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Bell className="text-blue-700" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex gap-8">
        <CitizenNavbar />

        <div className="flex-1 space-y-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-10">
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <TrendingUp size={30} />
                </div>
                <div>
                  <h1 className="text-5xl font-black">Civic Report Tracking</h1>
                  <p className="text-blue-100 text-lg mt-2">Monitor report progress, authority actions, and issue resolution updates.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroCard title="Total Reports" value={stats.total} />
                <HeroCard title="Resolved" value={stats.resolved} />
                <HeroCard title="Pending" value={stats.pending} />
                <HeroCard title="In Progress" value={stats.inProgress} />
              </div>
            </div>
          </section>

          {/* LOADING */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500 font-medium">Loading your reports...</span>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="px-6 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">{error}</div>
          )}

          {/* EMPTY */}
          {!loading && !error && reports.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">You haven't submitted any reports yet.</p>
              <button onClick={() => navigate("/citizen/raise")} className="mt-4 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
                Raise Your First Complaint
              </button>
            </div>
          )}

          {/* REPORTS */}
          <div className="space-y-8">
            {reports.map((report) => (
              <div key={report.id} className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                {report.image_path && (
                  <div className="relative">
                    <img src={getImageUrl(report.image_path)} alt={report.description?.slice(0, 30)} className="w-full h-72 object-cover" />
                    <div className="absolute top-5 right-5">
                      <span className={`px-5 py-3 rounded-full text-sm font-bold shadow-lg ${getStatusStyle(report.status)}`}>
                        {report.status?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-gray-800">{report.description?.slice(0, 40)}...</h2>
                          <p className="text-gray-500 mt-1">Issue ID: #SM-{report.id}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`px-5 py-3 rounded-2xl text-sm font-bold w-fit ${getPriorityStyle(report.priority)}`}>
                      {report.priority ? `${report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority` : "Normal Priority"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-5 mt-8">
                    <InfoCard icon={<MapPin size={18} />} title="Location" value={report.location || "N/A"} />
                    <InfoCard icon={<CalendarDays size={18} />} title="Reported On" value={formatDate(report.created_at)} />
                    <InfoCard icon={<Clock3 size={18} />} title="Current Status" value={report.status?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Pending"} />
                  </div>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-2">
                      <Eye size={18} /> View Details
                    </button>
                    <button className="px-7 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition flex items-center gap-2">
                      <CheckCircle2 size={18} /> Track Progress
                    </button>
                    <button className="px-7 py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition flex items-center gap-2">
                      <AlertTriangle size={18} /> Escalate
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

function HeroCard({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <p className="text-blue-100 text-sm uppercase tracking-widest">{title}</p>
      <h3 className="text-5xl font-black mt-3">{value}</h3>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
      <div className="flex items-center gap-3 text-blue-700 mb-3">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <h3 className="font-bold text-gray-800 text-lg">{value}</h3>
    </div>
  );
}