import React from "react";
import {
  Home,
  MapPin,
  CheckCircle2,
  Trophy,
  User,
  FileText,
  LogOut,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function CitizenNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Feed",
      icon: <Home size={18} />,
      path: "/citizenDashboard",
    },
    {
      label: "Nearby",
      icon: <MapPin size={18} />,
      path: "/citizen/nearbyissues",
    },
    {
      label: "Resolved",
      icon: <CheckCircle2 size={18} />,
      path: "/citizen/resolvedissues",
    },
    {
      label: "Reports",
      icon: <FileText size={18} />,
      path: "/citizen/myreports",
    },
    {
      label: "Rewards",
      icon: <Trophy size={18} />,
      path: "/citizen/rewards",
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      path: "/citizen/profile",
    },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      {/* Changed h-[calc(100vh-120px)] to h-fit so it dynamically wraps the content tightly */}
      <aside className="hidden lg:flex fixed left-6 top-24 w-64 z-40 h-fit">
        <div className="w-full bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/60 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.15)] p-5 flex flex-col transition-all duration-300 hover:shadow-[0_30px_60px_-10px_rgba(37,99,235,0.22)] hover:border-blue-100/80">
          
          {/* Logo Section - Reduced bottom margin */}
          <div className="mb-5 px-1">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
              Samadhan
            </h1>
            <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest mt-0.5">
              Citizen Portal
            </p>
          </div>

          {/* Navigation Links - Reduced gap between items */}
          <nav className="space-y-1.5">
            {navItems.map((item, index) => {
              const active = location.pathname === item.path;

                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={`group relative w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 transform active:scale-[0.98]
                    
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)]"
                        : "bg-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 border border-transparent hover:border-blue-100/50"
                    }`}
                  >
                    {/* Icon Container */}
                    <div
                      className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-105 ${
                        active
                          ? "text-white bg-white/10"
                          : "text-blue-600 bg-blue-50 group-hover:bg-blue-100/70"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <span className="relative z-10">{item.label}</span>

                    {/* Active Decorative Dot */}
                    {active && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                    )}
                  </button>
                );
              })}
            </nav>

          {/* Logout Button - Now sits directly under the menu items with a cleaner spacing layout */}
          <div className="mt-5 pt-4 border-t border-blue-50/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold shadow-[0_8px_20px_-4px_rgba(239,68,68,0.35)] hover:shadow-[0_12px_24px_-4px_rgba(239,68,68,0.45)] hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-red-400/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      {/* Left unchanged to protect your existing touch interaction layout */}
      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl h-20 flex justify-around items-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] z-50">
        {navItems.slice(0, 5).map((item, index) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1.5 w-14 h-14 rounded-2xl transition-all duration-300 transform active:scale-90
                
                ${
                  active
                    ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_10px_20px_-4px_rgba(37,99,235,0.4)] scale-105"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
            >
              <div className={`transition-transform duration-300 ${active ? "scale-100" : "hover:scale-110"}`}>
                {React.cloneElement(item.icon, { size: active ? 16 : 18 })}
              </div>

              <span className={`text-[9px] font-black tracking-wide ${active ? "text-white" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1.5 w-14 h-14 rounded-2xl text-red-500 hover:bg-red-50/60 transition-all duration-300 active:scale-90"
        >
          <LogOut size={18} />
          <span className="text-[9px] font-black text-red-400 tracking-wide">
            Exit
          </span>
        </button>
      </div>
    </>
  );
}