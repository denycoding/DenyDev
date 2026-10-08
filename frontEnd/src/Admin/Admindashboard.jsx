import Adminheader from "./Adminheader";
import ProjectCategoryChart from "./ProjectCategoryChart";
import StatsChart from "./StatsChart";
import ProposalChart from "./ProposalChart";
import { useEffect, useState } from "react";
import Api from "../API";

function Admindashboard() {
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await Api.get("/freelancerprofile");
        setTotalFreelancers(res.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFreelancers();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await Api.get("/clients");
        setTotalClients(res.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await Api.get("/postjobs");
        setTotalProjects(res.data.jobs.length);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const res = await Api.get("/recent-users");

        console.log("Recent Users:", res.data.users);

        setRecentUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };

    fetchRecentUsers();
  }, []);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const res = await Api.get("/recent-projects");

        console.log("Recent Projects:", res.data.projects);

        setRecentProjects(res.data.projects);
      } catch (error) {
        console.error("Error fetching recent projects:", error);
      }
    };

    fetchRecentProjects();
  }, []);
  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-[#10002b] pb-12">
        {/* =====================================================
            WELCOME SECTION
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 pt-8">
          <div>
            <h1 className="text-white font-serif text-3xl sm:text-4xl font-bold">
              <span className="text-purple-400">│</span> Welcome back, Admin
            </h1>

            <p className="text-gray-400 text-sm sm:text-base ml-5 mt-3">
              Here's what's happening on DenyDev today.
            </p>
          </div>
        </section>

        {/* =====================================================
            STATISTICS CARDS
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Clients */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-purple-900/50 hover:border-purple-500/30 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Clients
                  </p>

                  <h3 className="text-3xl font-bold text-white mt-2">
                    {totalClients}
                  </h3>

                  <p className="text-gray-400 text-xs mt-2">
                    Registered clients
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            {/* Total Freelancers */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-purple-900/50 hover:border-purple-500/30 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Freelancers
                  </p>

                  <h3 className="text-3xl font-bold text-white mt-2">
                    {totalFreelancers}
                  </h3>

                  <p className="text-gray-400 text-xs mt-2">
                    Registered freelancers
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
              </div>
            </div>

            {/* Total Projects */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-purple-900/50 hover:border-purple-500/30 transition duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Projects
                  </p>

                  <h3 className="text-3xl font-bold text-white mt-2">
                    {totalProjects}
                  </h3>

                  <p className="text-gray-400 text-xs mt-2">Projects posted</p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CHARTS SECTION
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Projects by Category */}
            <ProjectCategoryChart />

            {/* Clients / Freelancers / Projects */}
            <StatsChart />

            {/* Proposal Statistics */}
            <ProposalChart />
          </div>
        </section>

        {/* =====================================================
            RECENT ACTIVITY
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 pt-6">
          <div className="mb-6">
            <h2 className="text-white text-3xl font-serif font-bold">
              Recent Activity
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Latest projects and users on DenyDev.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* =================================================
                RECENT PROJECTS
            ================================================== */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h3 className="text-xl font-semibold text-white">
                  Recent Projects
                </h3>

                <span className="w-fit text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                  {recentProjects.length} Projects
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Latest projects posted on DenyDev
              </p>

              <ol className="space-y-3">
                {recentProjects.map((project, index) => (
                  <li
                    key={project._id}
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg"
                  >
                    {/* Number */}
                    <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                      {index + 1}
                    </span>

                    {/* Project Details */}
                    <div className="min-w-0">
                      <p className="text-gray-200 font-medium truncate">
                        {project.title}
                      </p>

                      <p className="text-gray-400 text-sm truncate">
                        {project.clientName ||
                          project.companyName ||
                          "Unknown Client"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {/* =================================================
                RECENT USERS
            ================================================== */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h3 className="text-xl font-semibold text-white">
                  Recent Users
                </h3>

                <span className="w-fit text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                  {recentUsers.length} Users
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Latest registered users
              </p>

              <div className="space-y-3">
                {recentUsers.map((user) => {
                  const name = user.fullName || "Unknown User";

                  // Get initials
                  const initials = name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {name}
                        </p>

                        <p className="text-gray-400 text-sm capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Admindashboard;
