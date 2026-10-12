import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  LogOut,
  Users,
  UserCheck,
  FolderKanban,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  KeyRound,
} from "lucide-react";

import Adminheader from "./Adminheader";
import API from "../API";

// Edit these paths to match your router
const QUICK_LINKS = [
  { label: "Manage Freelancers", path: "/admin/freelancers", icon: UserCheck },
  { label: "Manage Clients", path: "/admin/clients", icon: Users },
  { label: "View Projects", path: "/admin/projects", icon: FolderKanban },
];

function AdminProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const adminName = user?.fullName || user?.name || "Administrator";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Only admins may view this page
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, []);

  // Platform overview
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  const statCards = [
    { label: "Total Clients", value: stats?.totalClients, icon: Users },
    {
      label: "Total Freelancers",
      value: stats?.totalFreelancers,
      icon: UserCheck,
    },
    {
      label: "Total Projects",
      value: stats?.totalProjects,
      icon: FolderKanban,
    },
    { label: "Active Projects", value: stats?.activeProjects, icon: Clock },
    {
      label: "Completed Projects",
      value: stats?.completedProjects,
      icon: CheckCircle,
    },
    {
      label: "Total Proposals",
      value: stats?.totalProposals,
      icon: FileText,
    },
  ];

  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#18003b] to-[#240046] text-white px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          {/* PAGE TITLE */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Profile</h1>

              <p className="text-gray-400 text-sm mt-1">
                Your account details and platform overview.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          {/* PROFILE HERO */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0638] via-[#21094a] to-[#2d0b5c] border border-purple-400/20 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Avatar with initial */}
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-purple-400/40 shadow-xl shrink-0">
                  {adminName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {adminName}
                  </h2>

                  <p className="text-purple-300 mt-1 font-medium">
                    Platform Administrator
                  </p>

                  <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/10 text-green-400 border-green-400/20">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Account Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PLATFORM OVERVIEW */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Platform Overview</h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {statCards.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Icon size={16} className="text-purple-400" />
                    </div>

                    <span className="text-xs sm:text-sm">{label}</span>
                  </div>

                  <p className="text-3xl font-bold mt-3">
                    {loading ? "..." : (value ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ACCOUNT DETAILS */}
            <div className="lg:col-span-2 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-1">Account Details</h2>

              <p className="text-gray-500 text-sm mb-5">
                Information linked to your administrator account.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail size={16} />
                    Email
                  </div>

                  <p className="text-white mt-2 break-all">
                    {user?.email || "N/A"}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <ShieldCheck size={16} />
                    Role
                  </div>

                  <p className="text-white mt-2 capitalize">
                    {user?.role || "N/A"}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <KeyRound size={16} />
                    Session
                  </div>

                  <p className="text-green-400 mt-2 font-medium">
                    {localStorage.getItem("token")
                      ? "Signed in"
                      : "Not signed in"}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <ShieldCheck size={16} />
                    Access Level
                  </div>

                  <p className="text-white mt-2">Full platform access</p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-1">Quick Actions</h2>

              <p className="text-gray-500 text-sm mb-5">
                Jump to the main management areas.
              </p>

              <div className="flex flex-col gap-3">
                {QUICK_LINKS.map(({ label, path, icon: Icon }) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => navigate(path)}
                    className="group flex items-center justify-between bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-400/30 rounded-xl px-4 py-3 text-sm font-medium transition"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} className="text-purple-400" />
                      {label}
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
