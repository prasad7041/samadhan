import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReports } from "../api/complaintService";
import { ArrowLeft, CheckCircle2, Calendar, Bell, Search, TrendingUp, Trophy, ShieldCheck, MapPin, Eye, Star, Filter, Loader2 } from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";

export default function ResolvedIssues() {
  const navigate = useNavigate();
  const [resolved, setResolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyReports(1, 100);
        const all = res.data?.complaints || [];
        setResolved(all.filter(c => c.status === "resolved"));
      } catch { setError("Failed to load resolved issues."); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const imgUrl = (p) => (!p ? null : p.startsWith("http") ? p : p);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><ArrowLeft className="text-blue-700" /></button>
            <div><h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">Resolved Issues</h1><p className="text-sm text-gray-500">Successfully completed civic reports</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg"><Search size={18} className="text-blue-500" /><input type="text" placeholder="Search resolved issues..." className="bg-transparent outline-none ml-3 w-56" /></div>
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
              <div className="flex items-center gap-5 mb-6"><div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center"><TrendingUp size={30} /></div><div><h1 className="text-5xl font-black">Successful Civic Actions</h1><p className="text-blue-100 text-lg mt-2">Track completed civic improvements.</p></div></div>
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroCard title="Resolved" value={resolved.length} />
                <HeroCard title="Success Rate" value={resolved.length > 0 ? "100%" : "—"} />
                <HeroCard title="This Month" value={resolved.filter(r => new Date(r.updated_at) > new Date(Date.now() - 30*24*60*60*1000)).length} />
                <HeroCard title="Total" value={resolved.length} />
              </div>
            </div>
          </section>

          {loading && <div className="flex items-center justify-center py-20"><Loader2 size={36} className="animate-spin text-blue-600" /><span className="ml-3 text-gray-500">Loading...</span></div>}
          {error && !loading && <div className="px-6 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">{error}</div>}
          {!loading && !error && resolved.length === 0 && <div className="text-center py-20"><p className="text-gray-500 text-lg">No resolved issues yet.</p></div>}

          <div className="space-y-8">
            {resolved.map(item => (
              <div key={item.id} className="bg-white/80 backdrop-blur-2xl rounded-[36px] border border-blue-100 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                {item.image_path && (
                  <div className="relative">
                    <img src={imgUrl(item.image_path)} alt="" className="w-full h-72 object-cover" />
                    <div className="absolute top-5 right-5"><span className="px-5 py-3 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-lg flex items-center gap-2"><CheckCircle2 size={16} /> Resolved</span></div>
                  </div>
                )}
                <div className="p-8">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-xl"><CheckCircle2 size={28} /></div>
                      <div><h2 className="text-3xl font-black text-gray-800">{item.description?.slice(0, 40)}...</h2><p className="text-gray-500 mt-1">Resolution ID: #RS-{item.id}</p></div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-6">{item.description}</p>
                  <div className="grid md:grid-cols-3 gap-5 mt-8">
                    <InfoCard icon={<MapPin size={18} />} title="Location" value={item.location || "N/A"} />
                    <InfoCard icon={<Calendar size={18} />} title="Resolved On" value={new Date(item.updated_at).toLocaleDateString()} />
                    <InfoCard icon={<ShieldCheck size={18} />} title="Status" value="Resolved" />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-2"><Eye size={18} /> View Details</button>
                    <button className="px-7 py-4 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition flex items-center gap-2"><Trophy size={18} /> Appreciate</button>
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