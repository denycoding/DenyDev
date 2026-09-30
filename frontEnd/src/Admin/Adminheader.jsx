import {
  MessageCircle,
  User,
  LayoutDashboard,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";
import { FiUsers } from "react-icons/fi";
import { FaUsers } from "react-icons/fa6";

import { Code2 } from "lucide-react";
import API from ".././API";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Adminheader() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const Navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    Navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className="  w-full
        sticky
        top-0
        z-10
bg-[#4C1D95]/100
        backdrop-blur-xl
        border-b
        border-white/20
        shadow-lg"
      >
        {/* Main Header */}
        <div className="px-4 sm:px-6 md:px-10 py-4">
          <div className="flex items-center justify-between">
            {/* LEFT - LOGO */}
            <button
              onClick={() => handleNavigate("/admindashboard")}
              className="
              flex
              items-center
              gap-3
              group
              cursor-pointer
            "
            >
              <div
                className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-purple-500
                to-blue-600
                shadow-lg
                shadow-purple-500/20
                group-hover:scale-105
                transition
              "
              >
                <Code2 size={22} className="text-white" />
              </div>

              <div className="text-left">
                <h1
                  className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  tracking-tight
                  text-white
                "
                >
                  Deny<span className="text-purple-400">Dev</span>
                </h1>

                <p className="hidden sm:block text-[10px] text-gray-400 tracking-widest uppercase">
                  Admin Panel
                </p>
              </div>
            </button>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex flex-1 mr-8 justify-center">
              <ul className="flex items-center gap-6 lg:gap-10 text-white font-medium">
                {/* Dashboard */}
                <li>
                  <button
                    onClick={() => handleNavigate("/admindashboard")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/admindashboard")
                        ? "bg-purple-500/20 text-white border border-purple-400/30"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                </li>

                {/* Users (placeholder — replace with your real admin route) */}
                <li>
                  <button
                    onClick={() => handleNavigate("/clients")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/clients")
                        ? "bg-purple-500/20 text-white border border-purple-400/30"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <FiUsers size={18} />

                    <span>Clients</span>
                  </button>
                </li>

                {/* Projects (placeholder — replace with your real admin route) */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancers")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/freelancers")
                        ? "bg-purple-500/20 text-white border border-purple-400/30"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <FaUsers size={18} />

                    <span>Freelancers</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* RIGHT - PROFILE + MOBILE MENU */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate("/adminprofile")}
                className="hidden sm:flex items-center gap-2 bg-purple-700 px-3 py-2 rounded-lg hover:bg-purple-600 transition text-white"
              >
                <User size={18} />
                <span className="max-w-[120px] truncate">
                  {user?.name || user?.fullName || "Admin"}
                </span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white p-2 rounded-lg hover:bg-purple-800 transition"
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          {menuOpen && (
            <nav className="md:hidden mt-4 border-t border-purple-700 pt-4">
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    onClick={() => handleNavigate("/admindashboard")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive("/admindashboard")
                        ? "bg-purple-800 text-white"
                        : "text-white hover:bg-purple-800"
                    }`}
                  >
                    <LayoutDashboard size={19} />
                    Dashboard
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => handleNavigate("/adminusers")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive("/adminusers")
                        ? "bg-purple-800 text-white"
                        : "text-white hover:bg-purple-800"
                    }`}
                  >
                    <MessageCircle size={19} />
                    Users
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => handleNavigate("/adminprojects")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive("/adminprojects")
                        ? "bg-purple-800 text-white"
                        : "text-white hover:bg-purple-800"
                    }`}
                  >
                    <FolderOpen size={19} />
                    Projects
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => handleNavigate("/adminprofile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive("/adminprofile")
                        ? "bg-purple-800 text-white"
                        : "text-white hover:bg-purple-800"
                    }`}
                  >
                    <User size={19} />
                    <span className="max-w-[120px] truncate">
                      {user?.name || user?.fullName || "Admin"}
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

export default Adminheader;
