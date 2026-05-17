import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Bus,
  ReceiptText,
  Store,
  Coffee,
  Dumbbell,
  Zap,
  Droplets,
  Bell,
  Search,
  Gift,
  TrendingUp,
  Star,
  Crown,
  Sparkles,
  Medal,
  LayoutDashboard,
  Check,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import CitizenNavbar from "./CitizenNavbar";

/* ================= BADGES ================= */
const badges = [
  {
    title: "Water Warrior",
    icon: <Droplets size={30} />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Road Ranger",
    icon: <Bus size={30} />,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Green Guard",
    icon: <Zap size={30} />,
    color: "from-emerald-500 to-green-400",
    locked: true,
  },
];

/* ================= REWARDS (With hidden backend tags) ================= */
const rewards = [
  {
    category: "Public Transit Credits",
    icon: <Bus className="text-blue-600" />,
    items: [
      {
        title: "Monthly Metro Pass",
        subtitle: "Unlimited city travel access",
        points: "800",
        tags: ["transit", "metro_pass", "high_tier"], // Hidden metadata tracking
      },
      {
        title: "5 Ride Credits",
        subtitle: "Valid on CityCab App",
        points: "350",
        tags: ["transit", "cab_credit", "mid_tier"], // Hidden metadata tracking
      },
    ],
  },
  {
    category: "Utility Discounts",
    icon: <ReceiptText className="text-blue-600" />,
    items: [
      {
        title: "15% Electricity Rebate",
        subtitle: "Apply to next month's bill",
        points: "1200",
        tags: ["utility", "electricity", "premium_tier"], // Hidden metadata tracking
      },
      {
        title: "Water Credit",
        subtitle: "Municipal water service",
        points: "600",
        tags: ["utility", "water_credit", "mid_tier"], // Hidden metadata tracking
      },
    ],
  },
  {
    category: "Local Business Coupons",
    icon: <Store className="text-blue-600" />,
    items: [
      {
        title: "Daily Grind Cafe",
        subtitle: "Free Coffee & Pastry",
        points: "150",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
        customIcon: <Coffee />,
        tags: ["local_business", "food_beverage", "low_tier"], // Hidden metadata tracking
      },
      {
        title: "Civic Wellness Gym",
        subtitle: "1-Day All-Access Pass",
        points: "250",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
        customIcon: <Dumbbell />,
        tags: ["local_business", "fitness", "low_tier"], // Hidden metadata tracking
      },
    ],
  },
];

/* ================= MAIN COMPONENT ================= */
export default function Rewards() {
  const navigate = useNavigate();

  // ================= NOTIFICATION STATE =================
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Congratulations! You reached Elite Citizen tier.", time: "1h ago", unread: true },
    { id: 2, text: "Your 'Water Warrior' badge is now fully unlocked.", time: "4h ago", unread: true },
    { id: 3, text: "New local rewards added near your primary district.", time: "2 days ago", unread: false },
  ]);

  const hasUnread = notifications.some((n) => n.unread);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900 overflow-hidden relative">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed top-0 left-0 w-[450px] h-[450px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          
          {/* LEFT SIDE: DASHBOARD & TITLE */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-12 h-12 rounded-2xl bg-white shadow-md border border-blue-100 flex items-center justify-center hover:bg-blue-50 text-blue-700 transition"
              title="Dashboard"
            >
              <LayoutDashboard size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Rewards Hub
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Smart Civic Rewards
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: TOOLS & NOTIFICATIONS */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg">
              <Search size={18} className="text-blue-500" />
              <input
                type="text"
                placeholder="Search rewards..."
                className="bg-transparent outline-none ml-3 w-56 text-sm"
              />
            </div>

            {/* NOTIFICATIONS CONTROLLER */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition text-blue-700 ${
                  showNotifications ? "ring-2 ring-blue-600/20 border-blue-300" : ""
                }`}
              >
                <Bell size={20} />
                {hasUnread && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* NOTIFICATION DROP-DOWN TAB */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl border border-blue-100 rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] overflow-hidden z-[100] text-left animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-5 bg-blue-50/40 border-b border-blue-100/50 flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Notifications</h4>
                    {hasUnread && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                      >
                        <Check size={12} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-blue-50/50">
                    {notifications.length === 0 ? (
                      <p className="p-5 text-center text-xs text-gray-400 font-medium">No recent updates available.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 flex gap-3 transition items-start ${
                            notif.unread ? "bg-blue-50/20" : "hover:bg-gray-50/50"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notif.unread ? "bg-blue-600 shadow-[0_0_6px_#2563eb]" : "bg-transparent"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs leading-normal ${
                                notif.unread ? "text-gray-800 font-semibold" : "text-gray-500 font-medium"
                              }`}
                            >
                              {notif.text}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 block">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE ICON */}
            <button 
              onClick={() => navigate("/citizen/profile")} 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg flex items-center justify-center hover:opacity-95 transition-all border border-blue-200 overflow-hidden"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:w-[280px] flex-shrink-0">
          <CitizenNavbar />
        </div>

        {/* Content Feeds Area */}
        <div className="flex-1 min-w-0 space-y-12">
          
          {/* ================= HERO HERO HERO ================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 md:p-10 text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-inner">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight">Civic Rewards System</h1>
                  <p className="text-blue-100 text-sm md:text-lg mt-1">
                    Earn rewards by helping improve your city through civic participation.
                  </p>
                </div>
              </div>

              {/* INTERACTIVE POINTS FIELD */}
              <div className="mt-8 flex flex-wrap items-end gap-3">
                <h2 className="text-5xl md:text-7xl font-black">2,450</h2>
                <span className="text-xl md:text-2xl font-semibold mb-1 text-blue-100">Reward Points</span>
              </div>

              {/* HERO STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <HeroCard icon={<Gift size={20} />} title="Redeemed" value="18" />
                <HeroCard icon={<Crown size={20} />} title="Citizen Tier" value="Elite" />
                <HeroCard icon={<TrendingUp size={20} />} title="Monthly Gain" value="+150" />
                <HeroCard icon={<Star size={20} />} title="Ranking" value="#42" />
              </div>
            </div>
          </motion.section>

          {/* ================= ACHIEVEMENT BADGES SECTION ================= */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900">Achievement Badges</h3>
                <p className="text-xs md:text-sm text-gray-500">Your civic participation milestones</p>
              </div>
              <button className="px-5 py-2.5 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 text-sm transition shadow-sm">
                View All
              </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {badges.map((badge, index) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={index}
                  className={`rounded-[32px] border border-blue-100 bg-white/80 backdrop-blur-2xl p-6 md:p-8 shadow-xl text-center flex flex-col justify-between ${
                    badge.locked ? "opacity-50 grayscale select-none" : ""
                  }`}
                >
                  <div>
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-5 bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-2xl`}>
                      {badge.icon}
                    </div>
                    <h4 className="font-black text-xl md:text-2xl text-gray-800">{badge.title}</h4>
                  </div>
                  <div className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mx-auto">
                    <Medal size={14} />
                    Achievement
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================= REWARDS FEEDS GRID ================= */}
          <div className="space-y-12">
            {rewards.map((section, index) => (
              <section key={index}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-md flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900">{section.category}</h3>
                    <p className="text-xs md:text-sm text-gray-500">Redeem premium civic benefits</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {section.items.map((item, idx) => (
                    <RewardCard key={idx} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* FLOATING ACTION UTILITY TRIGGER */}
      <button
        onClick={() => navigate("/redeemRewards")}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 rounded-[24px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition z-50"
      >
        <Gift size={26} />
      </button>
    </div>
  );
}

/* ================= COMPONENT MODULE: HERO CARD ================= */
function HeroCard({ icon, title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
      <div className="mb-2 text-white opacity-90">{icon}</div>
      <div>
        <p className="text-blue-100 text-[10px] uppercase tracking-widest">{title}</p>
        <h3 className="text-xl md:text-2xl font-black mt-1 leading-none">{value}</h3>
      </div>
    </div>
  );
}

/* ================= COMPONENT MODULE: REWARD CARD ================= */
function RewardCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-[32px] bg-white/80 backdrop-blur-2xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
    >
      <div>
        {/* CONDITIONAL HEADER HEADER IMAGE */}
        {item.image && (
          <div className="h-48 md:h-52 overflow-hidden relative">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-5 text-white flex items-center gap-3">
              <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white block">
                {item.customIcon}
              </span>
              <h4 className="text-xl md:text-2xl font-black leading-tight">{item.title}</h4>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {!item.image && <h4 className="text-xl md:text-2xl font-black text-gray-900 mb-2">{item.title}</h4>}
          <p className="text-gray-500 text-sm leading-relaxed">{item.subtitle}</p>
        </div>
      </div>

      {/* FOOTER ACTION PANEL */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 flex items-center justify-between mt-auto">
        <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
          {item.points} Pts
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-5 h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
        >
          Redeem
        </motion.button>
      </div>
    </motion.div>
  );
}