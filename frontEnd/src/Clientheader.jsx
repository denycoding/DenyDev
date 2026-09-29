import {
  MessageCircle,
  Plus,
  User,
  LayoutDashboard,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { Code2 } from "lucide-react";
import { useState } from "react";

function Clientheader() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

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
        <div className="px- sm:px-6 md:px-10 py-4">
          <div className="flex items-center justify-between">
            {" "}
            {/* LEFT - LOGO */}
            <button
              onClick={() => handleNavigation("#")}
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
                    onClick={() => handleNavigate("/clientdashboard")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/clientdashboard")
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
                    onClick={() => handleNavigate("/clientmessages")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/clientmessages")
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
                    onClick={() => handleNavigate("/clientprojects")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/clientprojects")
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
            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 ml-auto">
              {" "}
              {/* POST JOB - Desktop */}
              <button
                onClick={() => handleNavigate("/postjob")}
                className="
                  hidden sm:flex
                  items-center
                  justify-center
                  gap-1
                  bg-white
                  text-purple-900
                  px-3
                  py-2
                  rounded-lg
                  font-medium
                  hover:bg-gray-200
                  transition
                  whitespace-nowrap
                "
              >
                <Plus size={18} />
                <span>Post Job</span>
              </button>
              {/* PROFILE - Desktop */}
              <button
                onClick={() => handleNavigate("/clientprofile")}
                className="
                  hidden sm:flex
                  items-center
                  gap-2
                  bg-purple-700
                  px-3
                  py-2
                  rounded-lg
                  hover:bg-purple-600
                  transition
                  text-white
                "
              >
                <User size={18} />

                <span className="max-w-[120px] truncate">
                  {user?.name || user?.fullName || "Profile"}
                </span>
              </button>
              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="
    md:hidden
    ml-auto
    text-white
    p-2
    rounded-lg
    hover:bg-purple-800
    transition
  "
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          {menuOpen && (
            <nav className="md:hidden mt-4 border-t border-purple-700 pt4">
              <ul className="flex flex-col gap-2">
                {/* Dashboard */}
                <li>
                  <button
                    onClick={() => handleNavigate("/clientdashboard")}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-white
                      px-4
                      py-3
                      rounded-lg
                      hover:bg-purple-800
                      transition
                    "
                  >
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                  </button>
                </li>

                {/* Messages */}
                <li>
                  <button
                    onClick={() => handleNavigate("/clientmessages")}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-white
                      px-4
                      py-3
                      rounded-lg
                      hover:bg-purple-800
                      transition
                    "
                  >
                    <MessageCircle size={19} />
                    <span>Messages</span>
                  </button>
                </li>

                {/* Projects */}
                <li>
                  <button
                    onClick={() => handleNavigate("/clientprojects")}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-white
                      px-4
                      py-3
                      rounded-lg
                      hover:bg-purple-800
                      transition
                    "
                  >
                    <FolderOpen size={19} />
                    <span>Projects</span>
                  </button>
                </li>

                {/* Post Job */}
                <li>
                  <button
                    onClick={() => handleNavigate("/postjob")}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-white
                      px-4
                      py-3
                      rounded-lg
                      hover:bg-purple-800
                      transition
                    "
                  >
                    <Plus size={19} />
                    <span>Post Job</span>
                  </button>
                </li>

                {/* Profile */}
                <li>
                  <button
                    onClick={() => handleNavigate("/clientprofile")}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-white
                      px-4
                      py-3
                      rounded-lg
                      hover:bg-purple-800
                      transition
                    "
                  >
                    <User size={19} />

                    <span>{user?.name || user?.fullName || "Profile"}</span>
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

export default Clientheader;
