import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCitizenProfile, updateCitizenProfile } from "../api/authService";
import { getMyReports } from "../api/complaintService";
import { ArrowLeft, Phone, MapPin, Edit3, BadgeCheck, Trophy, ShieldCheck, Camera, Calendar, FileText, Activity, Bell, Settings, Loader2, Mail } from "lucide-react";
import CitizenNavbar from "./CitizenNavbar";

export default function CitizenProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reportsRes] = await Promise.all([getCitizenProfile(), getMyReports(1, 100)]);
        setProfile(profileRes.data?.user);
        const complaints = reportsRes.data?.complaints || [];
        setStats({ total: complaints.length, resolved: complaints.filter(c => c.status === "resolved").length });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const imgUrl = (p) => (!p ? "https://randomuser.me/api/portraits/men/75.jpg" : p.startsWith("http") ? p : p);

  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData(); fd.append("profile_picture", file);
      const res = await updateCitizenProfile(fd);
      setProfile(res.data?.user); updateUser(res.data?.user);
    } catch (err) { console.error(err); }
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50"><Loader2 size={36} className="animate-spin text-blue-600" /></div>);

  const u = profile || user || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><ArrowLeft className="text-blue-700" /></button>
            <div><h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">Citizen Profile</h1><p className="text-sm text-gray-500">Smart Civic Identity</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><Bell className="text-blue-700" /><div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" /></button>
            <button className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition"><Settings className="text-blue-700" /></button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex gap-8">
        <CitizenNavbar />
        <div className="flex-1 space-y-8">
          <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl p-10">
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-center">
              <div className="relative">
                <img src={imgUrl(u.profile_picture)} alt="Profile" className="w-52 h-52 rounded-[36px] object-cover border-4 border-white/20 shadow-2xl" />
                <label className="absolute bottom-4 right-4 w-14 h-14 rounded-2xl bg-white text-blue-700 shadow-xl flex items-center justify-center hover:scale-105 transition cursor-pointer">
                  <Camera size={22} /><input type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
                </label>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-5"><span className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/10 font-bold flex items-center gap-2"><BadgeCheck size={18} /> Verified Citizen</span></div>
                <h2 className="text-6xl font-black leading-tight">{u.full_name || "Citizen"}</h2>
                <p className="text-blue-100 text-xl mt-3">Active Civic Contributor</p>
                <div className="grid md:grid-cols-2 gap-5 mt-8">
                  <PInfoCard icon={<Phone size={18} />} title="Phone" value={u.mobile || "N/A"} />
                  <PInfoCard icon={<MapPin size={18} />} title="Area" value={u.area || "N/A"} />
                  <PInfoCard icon={<Mail size={18} />} title="Pincode" value={u.pincode || "N/A"} />
                  <PInfoCard icon={<Calendar size={18} />} title="Language" value={u.preferred_language || "English"} />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <SCard icon={<FileText />} title="Reports" value={stats.total} color="from-blue-600 to-cyan-500" />
            <SCard icon={<Activity />} title="Resolved" value={stats.resolved} color="from-green-500 to-emerald-400" />
            <SCard icon={<Trophy />} title="Points" value="—" color="from-yellow-500 to-orange-400" />
            <SCard icon={<ShieldCheck />} title="Trust" value="—" color="from-purple-500 to-indigo-500" />
          </section>

          <section className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[36px] shadow-xl p-8">
            <div className="flex items-center gap-4 mb-8"><div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-400 text-white flex items-center justify-center shadow-xl"><Trophy size={30} /></div><div><h3 className="text-4xl font-black text-gray-800">Achievements</h3><p className="text-gray-500">Your civic contribution badges</p></div></div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {stats.total >= 10 && <ACard title="Active Reporter" desc="Submitted 10+ civic reports." g="from-blue-600 to-cyan-500" />}
              {stats.resolved >= 5 && <ACard title="Problem Solver" desc="Had 5+ issues resolved." g="from-green-500 to-emerald-400" />}
              {stats.total >= 1 && <ACard title="First Step" desc="Submitted your first report!" g="from-purple-500 to-indigo-500" />}
              {stats.total === 0 && <p className="text-gray-500 col-span-full text-center py-8">Submit your first complaint to earn achievements!</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PInfoCard({ icon, title, value }) {
  return (<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5"><div className="flex items-center gap-3 text-white/80 mb-2">{icon}<span className="font-semibold">{title}</span></div><h3 className="font-bold text-lg">{value}</h3></div>);
}
function SCard({ icon, title, value, color }) {
  return (<div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[32px] shadow-xl p-7 hover:-translate-y-1 hover:shadow-2xl transition-all"><div className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${color} text-white flex items-center justify-center shadow-lg mb-6`}>{icon}</div><p className="text-gray-500 text-lg">{title}</p><h3 className="text-5xl font-black text-gray-800 mt-3">{value}</h3></div>);
}
function ACard({ title, desc, g }) {
  return (<div className={`rounded-[32px] p-8 text-white shadow-xl bg-gradient-to-r ${g}`}><h3 className="text-2xl font-black mb-4">{title}</h3><p className="text-white/90 leading-relaxed">{desc}</p></div>);
}