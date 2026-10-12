import {
  MessageCircle,
  User,
  LayoutDashboard,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";
import { Code2 } from "lucide-react";
import API from "./API";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Freelancerheader() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const Navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  // Navigation function
  const handleNavigate = (path) => {
    Navigate(path);

    setMenuOpen(false);
  };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className="  w-full
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
              onClick={() => handleNavigate("/freelancerdashboard")}
              className="
              flex
              items-center
              gap-3
              group
              cursor-pointer
            "
            >
              {/* Logo Icon */}

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

              {/* Logo Text */}

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
                  Freelance Platform
                </p>
              </div>
            </button>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex flex-1 mr-8 justify-center">
              <ul className="flex items-center gap-6 lg:gap-10 text-white font-medium">
                {/* Dashboard */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancerdashboard")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/freelancerdashboard")
                        ? "bg-purple-600/30 text-white border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <LayoutDashboard size={18} />

                    <span>Dashboard</span>
                  </button>
                </li>

                {/* Messages */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancermessage")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/freelancermessage")
                        ? "bg-purple-600/30 text-white border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <MessageCircle size={18} />

                    <span>Messages</span>

                    {/* Notification */}
                   </button>
                </li>

                {/* Projects */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancerproject")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/freelancerproject")
                        ? "bg-purple-600/30 text-white border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <FolderOpen size={18} />

                    <span>Projects</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* RIGHT - PROFILE + MOBILE MENU */}
            <div className="flex items-center gap-3">
              {/* Profile - Desktop */}
              <button
                onClick={() => handleNavigate("/freelancerprofile")}
                className="hidden sm:flex items-center gap-2 bg-purple-700 px-3 py-2 rounded-lg hover:bg-purple-600 transition text-white"
              >
                <User size={18} />
                <span className="max-w-[120px] truncate">
                  {user?.name || user?.fullName || "Profile"}
                </span>{" "}
              </button>

              {/* Mobile Menu Button */}
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
                {/* Dashboard */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancerdashboard")}
                    className="w-full flex items-center gap-3 text-white px-4 py-3 rounded-lg hover:bg-purple-800 transition"
                  >
                    <LayoutDashboard size={19} />
                    Dashboard
                  </button>
                </li>

                {/* Messages */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancermessage")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/freelancermessages")
                        ? "bg-purple-600/30 text-white border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                        : "text-white/80 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent"
                    }`}
                  >
                    <MessageCircle size={19} />
                    Messages
                  </button>
                </li>

                {/* Projects */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancerproject")}
                    className="w-full flex items-center gap-3 text-white px-4 py-3 rounded-lg hover:bg-purple-800 transition"
                  >
                    <FolderOpen size={19} />
                    Projects
                  </button>
                </li>

                {/* Profile */}
                <li>
                  <button
                    onClick={() => handleNavigate("/freelancerprofile")}
                    className="w-full flex items-center gap-3 text-white px-4 py-3 rounded-lg hover:bg-purple-800 transition"
                  >
                    <User size={19} />
                    <span className="max-w-[120px] truncate">
                      {user?.name || user?.fullName || "Profile"}
                    </span>{" "}
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

export default Freelancerheader;
