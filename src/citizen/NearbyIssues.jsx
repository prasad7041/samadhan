import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNearbyComplaints } from "../api/complaintService";
import { ArrowLeft, MapPin, AlertTriangle, Clock3, Bell, Search, Navigation, Eye, TrendingUp, ShieldAlert, CheckCircle2, Filter, Loader2 } from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";

export default function NearbyIssues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        let lat = 17.385, lng = 78.4867;
        if (navigator.geolocation) {
          try {
            const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
            lat = pos.coords.latitude; lng = pos.coords.longitude;
          } catch {}
        }
        const res = await getNearbyComplaints(lat, lng, 10, 1, 20);
        setIssues(res.data?.complaints || []);
      } catch { setError("Failed to load nearby issues."); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const imgUrl = (p) => (!p ? null : p.startsWith("http") ? p : p);
  const statusStyle = (s) => s === "resolved" ? "bg-green-100 text-green-700" : s === "pending" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
  const prioStyle = (p) => p === "critical" ? "bg-red-100 text-red-700" : p === "high" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700";
  const fmtStatus = (s) => (s || "pending").replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><ArrowLeft className="text-blue-700" /></button>
            <div><h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">Nearby Issues</h1><p className="text-sm text-gray-500">Real-time civic issue tracking</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg"><Search size={18} className="text-blue-500" /><input type="text" placeholder="Search nearby issues..." className="bg-transparent outline-none ml-3 w-56" /></div>
            <button className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><Filter className="text-blue-700" /></button>
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><Bell className="text-blue-700" /><div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" /></button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex gap-8">
        <CitizenNavbar />
        <div className="flex-1 space-y-8">
          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-10">
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6"><div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center"><TrendingUp size={30} /></div><div><h1 className="text-5xl font-black">Smart Nearby Monitoring</h1><p className="text-blue-100 text-lg mt-2">Discover nearby civic issues in real-time.</p></div></div>
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroCard title="Nearby Issues" value={issues.length} />
                <HeroCard title="Urgent" value={issues.filter(i => i.priority === "high" || i.priority === "critical").length} />
                <HeroCard title="Resolved" value={issues.filter(i => i.status === "resolved").length} />
                <HeroCard title="Pending" value={issues.filter(i => i.status === "pending").length} />
              </div>
            </div>
          </section>

          {loading && <div className="flex items-center justify-center py-20"><Loader2 size={36} className="animate-spin text-blue-600" /><span className="ml-3 text-gray-500">Loading nearby issues...</span></div>}
          {error && !loading && <div className="px-6 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">{error}</div>}
          {!loading && !error && issues.length === 0 && <div className="text-center py-20"><p className="text-gray-500 text-lg">No nearby issues found.</p></div>}

          <div className="space-y-8">
            {issues.map(issue => (
              <div key={issue.id} className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                {issue.image_path && (
                  <div className="relative">
                    <img src={imgUrl(issue.image_path)} alt="" className="w-full h-72 object-cover" />
                    <div className="absolute top-5 right-5"><span className={`px-5 py-3 rounded-full text-sm font-bold shadow-lg ${statusStyle(issue.status)}`}>{fmtStatus(issue.status)}</span></div>
                  </div>
                )}
                <div className="p-8">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl"><AlertTriangle size={28} /></div>
                      <div><h2 className="text-3xl font-black text-gray-800">{issue.description?.slice(0, 40)}...</h2><p className="text-gray-500 mt-1">Issue ID: #NI-{issue.id}</p></div>
                    </div>
                    <span className={`px-5 py-3 rounded-2xl text-sm font-bold w-fit ${prioStyle(issue.priority)}`}>{issue.priority ? `${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority` : "Normal"}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-6">{issue.description}</p>
                  <div className="grid md:grid-cols-3 gap-5 mt-8">
                    <InfoCard icon={<MapPin size={18} />} title="Location" value={issue.location || "N/A"} />
                    <InfoCard icon={<Clock3 size={18} />} title="Reported" value={new Date(issue.created_at).toLocaleDateString()} />
                    <InfoCard icon={<ShieldAlert size={18} />} title="Status" value={fmtStatus(issue.status)} />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-2"><Eye size={18} /> View Details</button>
                    <button className="px-7 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition flex items-center gap-2"><Navigation size={18} /> Navigate</button>
                    <button className="px-7 py-4 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition flex items-center gap-2"><CheckCircle2 size={18} /> Mark Helpful</button>
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
  return (<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6"><p className="text-blue-100 text-sm uppercase tracking-widest">{title}</p><h3 className="text-5xl font-black mt-3">{value}</h3></div>);
}
function InfoCard({ icon, title, value }) {
  return (<div className="bg-blue-50 border border-blue-100 rounded-3xl p-5"><div className="flex items-center gap-3 text-blue-700 mb-3">{icon}<span className="font-semibold">{title}</span></div><h3 className="font-bold text-gray-800 text-lg">{value}</h3></div>);
}