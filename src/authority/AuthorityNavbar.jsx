import React from "react";

import {
  Home,
  AssignmentInd,
  MilitaryTech,
  AccountCircle,
  Logout,
} from "@mui/icons-material";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AuthorityNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
      >
        <Logout />

        <span className="text-xs font-bold">
          Logout
        </span>
      </button>
    </nav>
  );
}