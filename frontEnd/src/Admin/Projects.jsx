import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Adminheader from "./Adminheader";
import API from "../API";

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

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // =====================================================
  // FETCH ALL PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/admin/projects");

        if (res.data.success) {
          setProjects(res.data.projects || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // =====================================================
  // SEARCH + STATUS FILTER
  // =====================================================

  const tabs = ["All", "Open", "In Progress", "Completed"];

  const filteredProjects = projects.filter((project) => {
    const text = searchText.toLowerCase().trim();
    const status = String(project.status || "open").toLowerCase();

    const matchesSearch =
      !text ||
      project.title?.toLowerCase().includes(text) ||
      project.clientName?.toLowerCase().includes(text) ||
      project.companyName?.toLowerCase().includes(text);

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Open" && status === "open") ||
      (activeTab === "In Progress" && status === "in-progress") ||
      (activeTab === "Completed" && status === "completed");

    return matchesSearch && matchesTab;
  });

  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-[#10002b] text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* PAGE HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>

              <p className="text-gray-400 mt-2">
                View all projects posted on the platform
              </p>
            </div>

            <div className="bg-purple-900 px-5 py-3 rounded-xl">
              <p className="text-sm text-gray-300">Total Projects</p>

              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by project, client or company..."
            className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 mb-5 outline-none text-white placeholder-gray-500 focus:border-purple-500"
          />

          {/* STATUS TABS */}
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm transition ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-purple-200 hover:bg-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* TABLE */}
          <div className="bg-[#180035] border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No projects found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-900/50">
                    <tr className="text-left text-gray-400">
                      <th className="px-6 py-4">Sr. No.</th>
                      <th className="px-6 py-4">Project</th>
                       <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Budget</th>
                       <th className="px-6 py-4">Posted On</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.map((project, index) => {
                      const status = String(
                        project.status || "open",
                      ).toLowerCase();

                      return (
                        <tr
                          key={project._id}
                          className="border-t border-white/10 hover:bg-white/5 transition"
                        >
                          {/* SR NO */}
                          <td className="px-6 py-4 text-gray-400">
                            {index + 1}
                          </td>

                          {/* PROJECT NAME */}
                          <td className="px-6 py-4 font-medium text-white max-w-[220px]">
                            <p className="truncate">{project.title || "N/A"}</p>
                          </td>

                          
                          <td className="px-6 py-4 text-gray-300">
                            {project.companyName && (
                              <p className="text-l text-white">
                                {project.companyName}
                              </p>
                            )}
                          </td>

                          {/* BUDGET */}
                          <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                            ₹
                            {Number(project.budgetMin || 0).toLocaleString(
                              "en-IN",
                            )}{" "}
                            - ₹
                            {Number(project.budgetMax || 0).toLocaleString(
                              "en-IN",
                            )}
                          </td>

                          

                          {/* POSTED ON */}
                          <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                            {project.createdAt
                              ? new Date(project.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                STATUS_STYLES[status] ||
                                "bg-white/10 text-purple-200"
                              }`}
                            >
                              {STATUS_LABELS[status] || project.status}
                            </span>
                          </td>

                          {/* ACTION */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                navigate(`/client/${project.clientId}`)
                              }
                              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition whitespace-nowrap"
                            >
                              View Client
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
