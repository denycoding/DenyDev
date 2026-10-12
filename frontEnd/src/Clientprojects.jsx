import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import Clientheader from "./Clientheader";
import API from "./API";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  open: "bg-yellow-500/20 text-yellow-300",
  "in-progress": "bg-blue-500/20 text-blue-300",
  completed: "bg-green-500/20 text-green-300",
  closed: "bg-red-500/20 text-red-300",
};

const STATUS_LABELS = {
  open: "Open",
  "in-progress": "In Progress",
  completed: "Completed",
  closed: "Closed",
};

function Clientprojects() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // =====================================================
  // FETCH MY PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user?._id && !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const clientId = user._id || user.id;

        const res = await API.get(`/postjobs/client/${clientId}`);

        if (res.data.success) {
          setProjects(res.data.jobs || []);
        }
      } catch (error) {
        console.log("Fetch My Projects Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [projects]);

  // =====================================================
  // FETCH PROGRESS FOR `IN-PROGRESS PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchProgress = async () => {
      const inProgressJobs = projects.filter(
        (p) => p.status?.toLowerCase() === "in-progress",
      );

      if (inProgressJobs.length === 0) return;

      try {
        const results = await Promise.all(
          inProgressJobs.map((job) => API.get(`/proposals/project/${job._id}`)),
        );

        const map = {};

        results.forEach((res, index) => {
          if (res.data.success) {
            const accepted = res.data.proposals.find(
              (p) => p.status === "accepted",
            );

            if (accepted) {
              map[inProgressJobs[index]._id] = accepted.progress || 0;
            }
          }
        });

        setProgressMap(map);
      } catch (error) {
        console.log("Fetch Progress Error:", error);
      }
    };

    if (projects.length > 0) {
      fetchProgress();
    }
  }, [projects]);

  // =====================================================
  // PROJECT COUNTS
  // =====================================================

  const totalProjects = projects.length;

  const inProgressCount = projects.filter(
    (project) => project.status?.toLowerCase() === "in-progress",
  ).length;

  const completedCount = projects.filter(
    (project) => project.status?.toLowerCase() === "completed",
  ).length;

  // =====================================================
  // TABS
  // =====================================================

  const tabs = ["All", "In Progress", "Completed"];

  // =====================================================
  // SEARCH + TAB FILTER
  // =====================================================

  const filteredProjects = projects.filter((project) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      project.title?.toLowerCase().includes(search) ||
      project.category?.toLowerCase().includes(search) ||
      project.skills?.some((skill) => skill.toLowerCase().includes(search));

    const status = project.status?.toLowerCase();

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "In Progress" && status === "in-progress") ||
      (activeTab === "Completed" && status === "completed");

    return matchesSearch && matchesTab;
  });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      <Clientheader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">My Projects</h1>

          <p className="text-purple-200 text-base sm:text-lg">
            Manage and track your projects
          </p>
        </div>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">Total Projects</p>
            <h2 className="text-3xl font-bold">{totalProjects}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">In Progress</p>
            <h2 className="text-3xl font-bold">{inProgressCount}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">Completed</p>
            <h2 className="text-3xl font-bold">{completedCount}</h2>
          </div>
        </div>

        {/* SEARCH */}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
            />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none text-white placeholder-purple-300 focus:border-purple-500"
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            <SlidersHorizontal size={18} />
            Filter
          </button>
        </div>

        {/* TABS */}

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full transition ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-200 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}

        {loading && (
          <p className="text-purple-200 text-center py-10">
            Loading your projects...
          </p>
        )}

        {/* NO PROJECTS */}

        {!loading && filteredProjects.length === 0 && (
          <p className="text-purple-200 text-center py-10">
            {activeTab === "All" && !searchText
              ? "You haven't posted any projects yet."
              : "No projects found for this filter."}
          </p>
        )}

        {/* PROJECT CARDS */}

        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const projectStatus = project.status?.toLowerCase() || "open";
              const progressValue = progressMap[project._id] || 0;

              return (
                <div
                  key={project._id}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.14] transition"
                >
                  {/* Card Top */}

                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold">{project.title}</h2>
                    </div>

                    <button
                      type="button"
                      className="text-purple-300 hover:text-white"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  {/* Budget + Deadline */}

                  <div className="flex justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-purple-300" />

                      <div>
                        <p className="text-xs text-purple-300">Budget</p>

                        <p className="font-semibold">
                          ₹
                          {Number(project.budgetMin || 0).toLocaleString(
                            "en-IN",
                          )}{" "}
                          - ₹
                          {Number(project.budgetMax || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-purple-300" />

                      <div>
                        <p className="text-xs text-purple-300">Deadline</p>

                        <p className="font-semibold">
                          {project.deadline || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}

                  <div className="mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[projectStatus] ||
                        "bg-white/10 text-purple-200"
                      }`}
                    >
                      {STATUS_LABELS[projectStatus] || project.status || "Open"}
                    </span>
                  </div>

                  {/* Progress (in-progress projects only) */}

                  {projectStatus === "in-progress" && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-purple-300">Progress</p>
                        <p className="text-xs font-semibold text-purple-200">
                          {progressValue}%
                        </p>
                      </div>

                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completed indicator (full bar, locked at 100%) */}

                  {projectStatus === "completed" && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-purple-300">Progress</p>
                        <p className="text-xs font-semibold text-green-300">
                          100%
                        </p>
                      </div>

                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full" />
                      </div>
                    </div>
                  )}

                  {/* Bottom */}

                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                      {project.proposals || 0} proposals
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate(`/clientprojects/${project._id}`)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientprojects;
