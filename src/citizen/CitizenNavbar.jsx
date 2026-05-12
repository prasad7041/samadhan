import React from "react";

import {
  Home,
  MapPin,
  CheckCircle2,
  Trophy,
  User,
  FileText,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function CitizenNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const navItems = [
    {
      label: "Feed",
      icon: <Home size={20} />,
      path: "/citizenDashboard",
    },

    {
      label: "Nearby",
      icon: <MapPin size={20} />,
      path: "/citizen/nearbyissues",
    },

    {
      label: "Resolved",
      icon: <CheckCircle2 size={20} />,
      path: "/citizen/resolvedissues",
    },

    {
      label: "Reports",
      icon: <FileText size={20} />,
      path: "/citizen/myreports",
    },

    {
      label: "Rewards",
      icon: <Trophy size={20} />,
      path: "/citizen/rewards",
    },

    {
      label: "Profile",
      icon: <User size={20} />,
      path: "/citizen/profile",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white/80 backdrop-blur-2xl rounded-[32px] border border-blue-100 shadow-2xl p-5">
          {/* Profile */}
          <div className="mb-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[28px] p-5 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="profile"
                className="w-14 h-14 rounded-2xl border-2 border-white/20"
              />

              <div>
                <h3 className="font-bold text-lg">
                  Citizen Portal
                </h3>

                <p className="text-blue-100 text-sm">
                  Smart Civic Dashboard
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
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-5">
            <p className="font-bold text-gray-800">
              Civic Status
            </p>

            <p className="text-sm text-gray-500 mt-1">
              All city services operational
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] bg-white/90 backdrop-blur-2xl border border-blue-100 rounded-3xl h-20 flex justify-around items-center shadow-2xl z-50">
        {navItems.slice(0, 5).map(
          (item, index) => {
            const active =
              location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() =>
                  navigate(item.path)
                }
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                  active
                    ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
                    : "text-gray-500"
                }`}
              >
                {item.icon}

                <span className="text-[10px] font-bold">
                  {item.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </>
  );
}