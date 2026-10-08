import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { LiaRupeeSignSolid } from "react-icons/lia";

import {
  ArrowLeft,
  FolderKanban,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Globe,
  Building2,
  Calendar,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { BriefcaseBusiness, Star, Code, User } from "lucide-react";

import Adminheader from "./Adminheader";
import API from "../API";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/client/${clientId}`);

        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching client profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [clientId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get(`/postjobs/client/${clientId}`);

        if (res.data.success) {
          setProjects(res.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching client projects:", error);
      }
    };

    if (clientId) {
      fetchProjects();
    }
  }, [clientId]);

  if (loading) {
    return (
      <>
        <Adminheader />
        <div className="min-h-screen bg-[#10002b] flex items-center justify-center text-white">
          <p className="text-gray-400">Loading client profile...</p>
        </div>
      </>
    );
  }

  if (notFound || !profile) {
    return (
      <>
        <Adminheader />
        <div className="min-h-screen bg-[#10002b] flex flex-col items-center justify-center text-white gap-4">
          <p className="text-gray-400">Client not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 px-5 py-2 rounded-xl hover:bg-purple-500 transition"
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  const handleBlockUser = async () => {
    try {
      const action = profile.accountType === "Blocked" ? "Activate" : "Block";

      const confirmed = window.confirm(
        `Are you sure you want to ${action} this client?`,
      );

      if (!confirmed) {
        return;
      }

      const res = await API.post(`/admin/blockclient/${clientId}`);

      if (res.data.success) {
        alert(res.data.message);

        setProfile((prev) => ({
          ...prev,
          accountType: res.data.accountType,
        }));
      }
    } catch (error) {
      console.error("Block/Unblock Client Error:", error);
      alert("Failed to update block status.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!confirm("Are you sure you want to delete this client?")) {
        return;
      }

      const res = await API.post(`/admin/delete-client/${clientId}`);

      if (res.data.success) {
        alert("Client deleted successfully.");
        navigate("/clients");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleDeleteProject = async (projectId) => {
    try {
      if (!confirm("Are you sure you want to delete this project?")) {
        return;
      }

      const res = await API.delete(`/postjobs/${projectId}`);

      if (res.data.success) {
        alert("Project deleted successfully.");

        // Remove deleted project from the UI
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId),
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#18003b] to-[#240046] text-white px-4 sm:px-6 lg:px-10 py-8">
        {/* BACK BUTTON + ACTIONS */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back to Clients
          </button>

          <div className="flex gap-3">
            <button
              className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              onClick={handleBlockUser}
            >
              {profile.accountType === "Blocked"
                ? "Activate User"
                : "Block User"}
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              onClick={handleDeleteUser}
            >
              Delete User
            </button>
          </div>
        </div>

        {/* BLOCKED BANNER */}
        {profile.accountType === "Blocked" && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-3 mb-6 text-sm font-medium">
            This client is currently blocked.
          </div>
        )}

        {/* PROFILE INCOMPLETE BANNER */}

        {/* PROFILE HERO */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={profile.image || FALLBACK_IMAGE}
              alt={profile.clientName}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-400/40"
            />

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {profile.clientName || "Unnamed Client"}
              </h1>

              <p className="text-purple-300 mt-1">
                {profile.clientType || "Client"}
              </p>

              <div
                className="
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-3
                mt-7
              "
              >
                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FolderKanban size={15} />

                    <span className="text-xs">Projects Posted</span>
                  </div>

                  <p className="text-xl font-bold mt-1">{projects.length}</p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle size={15} className="text-green-400" />

                    <span className="text-xs">Completed</span>
                  </div>

                  <p className="text-xl font-bold mt-1">
                    {projects.filter((p) => p.status === "completed").length}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={15} />

                    <span className="text-xs">Active</span>
                  </div>

                  <p className="text-xl font-bold mt-1">
                    {projects.filter((p) => p.status === "in-progress").length}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={15} />

                    <span className="text-xs">Joined At</span>
                  </div>

                  <p className="text-l font-bold mt-1">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} />
                Email
              </div>
              <p className="text-white mt-2 break-all">
                {profile.email || "N/A"}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} />
                Phone
              </div>
              <p className="text-white mt-2">{profile.phone || "N/A"}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} />
                Location
              </div>
              <p className="text-white mt-2">{profile.location || "N/A"}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe size={16} />
                Website
              </div>
              {profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 mt-2 block break-all"
                >
                  {profile.website}
                </a>
              ) : (
                <p className="text-white mt-2">N/A</p>
              )}
            </div>
          </div>
        </div>

        {/* COMPANY INFORMATION */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Company Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Building2 size={16} />
                Company
              </div>
              <p className="text-white mt-2">{profile.companyName || "N/A"}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Briefcase size={16} />
                Industry
              </div>
              <p className="text-white mt-2">{profile.industry || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">About Company</h2>
          <p className="text-gray-300 leading-6">
            {profile.aboutCompany || "No information available."}
          </p>
        </div>
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-5">Projects</h2>

          {projects.length === 0 ? (
            <p className="text-gray-400">No projects posted by this client.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-black/20 border border-white/10  rounded-xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold  text-white">
                      {project.title}
                    </h3>

                    <button
                      className="bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete Project
                    </button>
                  </div>

                  <p className="text-gray-400 mt-2">{project.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-white mt-1">
                        ₹{project.budgetMin} - ₹{project.budgetMax}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-gray-200 mt-1 capitalize">
                        {project.status}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Project Type</p>
                      <p className="text-gray-200 mt-1">
                        {project.projectType || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Proposals</p>
                      <p className="text-gray-200 mt-1">
                        {project.proposals || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ClientDetails;
