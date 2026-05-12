import React from "react";

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

/* ================= REWARDS ================= */

const rewards = [
  {
    category: "Public Transit Credits",

    icon: <Bus className="text-blue-600" />,

    items: [
      {
        title: "Monthly Metro Pass",
        subtitle:
          "Unlimited city travel access",
        points: "800",
      },

      {
        title: "5 Ride Credits",
        subtitle:
          "Valid on CityCab App",
        points: "350",
      },
    ],
  },

  {
    category: "Utility Discounts",

    icon: (
      <ReceiptText className="text-blue-600" />
    ),

    items: [
      {
        title:
          "15% Electricity Rebate",

        subtitle:
          "Apply to next month's bill",

        points: "1200",
      },

      {
        title: "Water Credit",

        subtitle:
          "Municipal water service",

        points: "600",
      },
    ],
  },

  {
    category: "Local Business Coupons",

    icon: (
      <Store className="text-blue-600" />
    ),

    items: [
      {
        title: "Daily Grind Cafe",

        subtitle:
          "Free Coffee & Pastry",

        points: "150",

        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",

        customIcon: <Coffee />,
      },

      {
        title:
          "Civic Wellness Gym",

        subtitle:
          "1-Day All-Access Pass",

        points: "250",

        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",

        customIcon: <Dumbbell />,
      },
    ],
  },
];

/* ================= MAIN ================= */

export default function Rewards() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900 overflow-hidden relative">
      {/* BACKGROUND */}
      <div className="fixed top-0 left-0 w-[450px] h-[450px] bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-cyan-300/10 blur-3xl rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xl">
              <Trophy size={28} />
            </div>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Rewards Hub
              </h1>

              <p className="text-sm text-gray-500">
                Smart Civic Rewards
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl border border-blue-100 px-4 h-12 rounded-2xl shadow-lg">
              <Search
                size={18}
                className="text-blue-500"
              />

              <input
                type="text"
                placeholder="Search rewards..."
                className="bg-transparent outline-none ml-3 w-56"
              />
            </div>

            {/* NOTIFICATION */}
            <button className="relative w-12 h-12 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition">
              <Bell className="text-blue-700" />

              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* PROFILE */}
            <button
              onClick={() =>
                navigate(
                  "/citizen/profile"
                )
              }
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="pt-28 pb-32 max-w-7xl mx-auto px-4 md:px-8 flex gap-8">
        {/* ================= COMMON NAVBAR ================= */}

        <CitizenNavbar />

        {/* ================= CONTENT ================= */}

        <div className="flex-1 space-y-10">
          {/* ================= HERO ================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <Sparkles size={32} />
                </div>

                <div>
                  <h1 className="text-5xl font-black">
                    Civic Rewards System
                  </h1>

                  <p className="text-blue-100 text-lg mt-2">
                    Earn rewards by helping
                    improve your city through
                    civic participation.
                  </p>
                </div>
              </div>

              {/* POINTS */}
              <div className="mt-10 flex flex-wrap items-end gap-4">
                <h2 className="text-7xl font-black">
                  2,450
                </h2>

                <span className="text-3xl font-semibold mb-2">
                  Reward Points
                </span>
              </div>

              {/* STATS */}
              <div className="grid md:grid-cols-4 gap-5 mt-10">
                <HeroCard
                  icon={<Gift />}
                  title="Redeemed"
                  value="18"
                />

                <HeroCard
                  icon={<Crown />}
                  title="Citizen Tier"
                  value="Elite"
                />

                <HeroCard
                  icon={<TrendingUp />}
                  title="Monthly Gain"
                  value="+150"
                />

                <HeroCard
                  icon={<Star />}
                  title="Ranking"
                  value="#42"
                />
              </div>
            </div>
          </motion.section>

          {/* ================= BADGES ================= */}

          <section>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-4xl font-black text-gray-900">
                  Achievement Badges
                </h3>

                <p className="text-gray-500 mt-1">
                  Your civic participation
                  milestones
                </p>
              </div>

              <button className="px-5 py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition">
                View All
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {badges.map(
                (badge, index) => (
                  <motion.div
                    whileHover={{
                      y: -5,
                    }}
                    key={index}
                    className={`rounded-[32px] border border-blue-100 bg-white/80 backdrop-blur-2xl p-8 shadow-xl text-center ${
                      badge.locked
                        ? "opacity-50 grayscale"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-2xl`}
                    >
                      {badge.icon}
                    </div>

                    <h4 className="font-black text-2xl text-gray-800">
                      {badge.title}
                    </h4>

                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      <Medal size={16} />

                      Achievement
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </section>

          {/* ================= REWARDS ================= */}

          <div className="space-y-12">
            {rewards.map(
              (section, index) => (
                <section key={index}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-lg">
                      {section.icon}
                    </div>

                    <div>
                      <h3 className="text-4xl font-black text-gray-900">
                        {section.category}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Redeem premium
                        civic benefits
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {section.items.map(
                      (
                        item,
                        idx
                      ) => (
                        <RewardCard
                          key={idx}
                          item={item}
                        />
                      )
                    )}
                  </div>
                </section>
              )
            )}
          </div>
        </div>
      </main>

      {/* ================= FLOATING BUTTON ================= */}

      <button
        onClick={() =>
          navigate("/redeemRewards")
        }
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition z-50"
      >
        <Gift size={30} />
      </button>
    </div>
  );
}

/* ================= HERO CARD ================= */

function HeroCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <div className="mb-4">
        {icon}
      </div>

      <p className="text-blue-100 text-sm uppercase tracking-widest">
        {title}
      </p>

      <h3 className="text-4xl font-black mt-3">
        {value}
      </h3>
    </div>
  );
}

/* ================= REWARD CARD ================= */

function RewardCard({ item }) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="overflow-hidden rounded-[36px] bg-white/80 backdrop-blur-2xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all"
    >
      {/* IMAGE */}
      {item.image && (
        <div className="h-56 overflow-hidden relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-5 left-5 text-white">
            <div className="flex items-center gap-3">
              {item.customIcon}

              <h4 className="text-3xl font-black">
                {item.title}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-8">
        {!item.image && (
          <h4 className="text-3xl font-black text-gray-900 mb-3">
            {item.title}
          </h4>
        )}

        <p className="text-gray-500 text-lg mb-6">
          {item.subtitle}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-black text-blue-700">
            {item.points} Pts
          </span>

          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            className="px-6 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl hover:shadow-2xl transition"
          >
            Redeem
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}