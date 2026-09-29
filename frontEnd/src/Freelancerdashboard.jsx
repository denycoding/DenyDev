import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { IoFilter } from "react-icons/io5";
import Freelancerheader from "./Freelancerheader";
import Footer from "./Footer";
import API from "./API";
import {
  FaCode,
  FaChartBar,
  FaRobot,
  FaShieldAlt,
  FaCloud,
  FaTools,
  FaTimes,
} from "react-icons/fa";

function Freelancerdashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  // =========================================================
  // TYPEWRITER PLACEHOLDER
  // =========================================================

  const searchPlaceholders = [
    "Search for...",
    "Full Stack projects...",
    "React projects...",
    "AI / ML projects...",
    "Data Science projects...",
    "Python projects...",
    "DevOps projects...",
    "Cloud Computing projects...",
    "Web Development projects...",
    "Node.js projects...",
    "Cybersecurity projects...",
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = searchPlaceholders[phraseIndex];

    // Typing speed vs deleting speed vs pause at full phrase
    const typingSpeed = isDeleting ? 20 : 30;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          // Pause at the full phrase before deleting
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        // Deleting backward
        if (charIndex > 0) {
          setTypedText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % searchPlaceholders.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);
  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/postjobs");

        if (res.data.success) {
          const openProjects = res.data.jobs.filter(
            (project) => project.status?.toLowerCase() === "open",
          );

          setProjects(openProjects);
        }
      } catch (error) {
        console.log("Fetch Projects Error:", error);
      }
    };

    fetchProjects();
  }, []);

  // =========================================================
  // CATEGORY FILTER
  // =========================================================

  const handleCategory = (category) => {
    setSelectedCategory(category);
    setSearch("");
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedCategory("");
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
  };

  // =========================================================
  // FILTER PROJECTS
  // =========================================================

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase().trim();

    const projectTitle = (project.title || "").toLowerCase();

    const projectCategory = (project.category || "").toLowerCase();

    const projectDescription = (project.description || "").toLowerCase();

    const matchesSearch =
      !searchText ||
      projectTitle.includes(searchText) ||
      projectCategory.includes(searchText) ||
      projectDescription.includes(searchText) ||
      (project.skills || []).some((skill) =>
        skill.toLowerCase().includes(searchText),
      );

    const matchesCategory =
      !selectedCategory || projectCategory === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // =========================================================
  // PAGINATION
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const visibleProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Freelancerheader />

      <main className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* WELCOME */}

        <div className="mb-8">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name || user?.fullName || "Freelancer"} 👋
          </h1>
        </div>

        {/* SEARCH */}

        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-purple-500 transition">
            <Search className="ml-4 text-gray-500 flex-shrink-0" size={20} />

            <input
              type="search"
              placeholder={typedText}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3.5 outline-none text-black text-sm sm:text-base"
            />
          </div>
        </div>

        {/* MAIN HEADING */}

        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Find projects that match your skills
          </h2>

          <p className="text-gray-300 mt-3 text-sm sm:text-base">
            Explore freelance opportunities and connect with clients worldwide.
          </p>
        </div>

        {/* TOP PROJECTS + FILTER */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold">
              Top Projects
            </h2>

            <p className="text-gray-400 mt-1 text-sm">
              Projects posted by clients
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedCategory || search) {
                clearFilters();
              } else {
                setShowFilters(!showFilters);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition shadow-sm ${
              selectedCategory || search
                ? " bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {selectedCategory || search ? (
              <>
                <FaTimes size={18} />
                Clear Filter
              </>
            ) : (
              <>
                <IoFilter className="text-purple-600" size={18} />
                Filter
              </>
            )}
          </button>
        </div>

        {selectedCategory && (
          <div className="mb-6 text-gray-300 text-sm">
            Showing projects in:
            <span className="text-purple-300 font-semibold ml-1">
              {selectedCategory}
            </span>
          </div>
        )}

        {/* PROJECTS */}

        <section>
          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-300 py-16">
              <h3 className="text-xl font-semibold">No projects found</h3>

              <p className="mt-2 text-gray-400">
                Try searching for another skill or project.
              </p>

              {(search || selectedCategory) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {visibleProjects.map((project) => (
                  <div
                    key={project._id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b0b38] via-[#16082f] to-[#10002b] p-5 sm:p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/30 hover:shadow-[0_18px_45px_rgba(124,58,237,0.20)]"
                  >
                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />

                    {/* HEADER */}
                    <div className="relative mb-5 flex items-center justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-gradient-to-br from-purple-500/20 to-violet-700/20 text-sm font-bold text-purple-300">
                          {(project.companyName || project.clientName || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Posted by
                          </p>

                          <p className="truncate text-sm font-semibold text-gray-200">
                            {project.companyName ||
                              project.clientName ||
                              "Client"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                          String(project.status).toLowerCase() === "open"
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
                            : "border-gray-400/20 bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            String(project.status).toLowerCase() === "open"
                              ? "bg-emerald-400"
                              : "bg-gray-400"
                          }`}
                        />

                        {String(project.status || "Open")
                          .charAt(0)
                          .toUpperCase() +
                          String(project.status || "Open").slice(1)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <div className="relative mb-3">
                      <h3 className="min-h-[56px] line-clamp-2 text-xl font-bold leading-7 text-white transition-colors duration-300 group-hover:text-purple-200">
                        {project.title}
                      </h3>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="mb-5 min-h-[60px] line-clamp-3 text-sm leading-5 text-gray-400">
                      {project.description ||
                        "No project description available."}
                    </p>

                    {/* PROJECT INFO */}
                    <div className="mb-5 grid grid-cols-2 gap-3">
                      {/* Budget */}
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors duration-300 group-hover:border-purple-400/15">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                            ₹
                          </div>

                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Budget
                          </p>
                        </div>

                        <p className="text-sm  font-bold text-white">
                          ₹
                          {Number(project.budgetMin || 0).toLocaleString(
                            "en-IN",
                          )}
                          <span className="mx-1 text-gray-500">–</span>
                        </p>

                        <p className="text-sm font-bold text-purple-300">
                          ₹
                          {Number(project.budgetMax || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>

                      {/* Deadline */}
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors duration-300 group-hover:border-purple-400/15">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                            ⏱
                          </div>

                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Deadline
                          </p>
                        </div>

                        <p className="text-sm font-bold text-white">
                          {project.deadline || 0} Days
                        </p>

                        <p className="mt-1 text-[11px] text-gray-500">
                          Delivery period
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM META */}
                    <div className="mb-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[11px] text-gray-500">Client</p>

                        <p className="mt-1 max-w-[140px] truncate text-sm font-semibold text-gray-200">
                          {project.clientName || "Client"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] text-gray-500">Proposals</p>

                        <p className="mt-1 text-sm font-semibold text-gray-200">
                          {project.proposals || 0}
                        </p>
                      </div>
                    </div>

                    {/* VIEW PROJECT */}
                    <button
                      type="button"
                      onClick={() => navigate(`/project/${project._id}`)}
                      className="relative mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_8px_25px_rgba(124,58,237,0.30)] active:scale-[0.98]"
                    >
                      View Project
                      <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                          currentPage === page
                            ? "bg-purple-600 text-white"
                            : "bg-white/10 hover:bg-white/20 border border-white/10 text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Freelancerdashboard;
