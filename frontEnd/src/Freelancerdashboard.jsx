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
const [user] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
});
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [slowLoad, setSlowLoad] = useState(false);

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

  const typingSpeed = isDeleting ? 20 : 30;

  const delay =
    !isDeleting && charIndex === currentPhrase.length
      ? 1000
      : typingSpeed;

  const timeout = setTimeout(() => {
    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        setTypedText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        setIsDeleting(true);
      }
    } else {
      if (charIndex > 0) {
        setTypedText(currentPhrase.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setIsDeleting(false);
        setPhraseIndex(
          (prev) => (prev + 1) % searchPlaceholders.length
        );
      }
    }
  }, delay);

  return () => clearTimeout(timeout);
}, [charIndex, isDeleting, phraseIndex]);

  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  useEffect(() => {
    
const fetchProjects = async () => {
  try {
    setLoading(true);
    setLoadError("");

    const res = await API.get("/postjobs");

    if (res.data.success) {
      const openProjects = (res.data.jobs || []).filter(
        (project) => project.status?.toLowerCase() === "open"
      );

      setProjects(openProjects);
    } else {
      setProjects([]);
      setLoadError("Could not load projects. Please try again.");
    }
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    setLoadError("Could not load projects. Please try again.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProjects();
}, []);

useEffect(() => {
  if (!loading) {
    setSlowLoad(false);
    return;
  }

  const timer = setTimeout(() => setSlowLoad(true), 5000);

  return () => clearTimeout(timer);
}, [loading]);


    useEffect(() => {
      fetchProjects();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Show a "server is waking up" hint if loading takes more than 5 seconds
    useEffect(() => {
      if (!loading) {
        setSlowLoad(false);
        return;
      }

      const timer = setTimeout(() => setSlowLoad(true), 5000);
      return () => clearTimeout(timer);
    }, [loading]);

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

const projectCategory = (
  project.projectType || project.category || ""
).toLowerCase();

    const projectDescription = (project.description || "").toLowerCase();

   const matchesSearch =
  !searchText ||
  projectTitle.includes(searchText) ||
  projectCategory.includes(searchText) ||
  projectDescription.includes(searchText) ||
  (Array.isArray(project.skills) &&
    project.skills.some((skill) =>
      String(skill).toLowerCase().includes(searchText)
    ));

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
          <div className="group flex items-center gap-3 rounded-2xl border border-purple-100/20 bg-[#180035] px-4 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:border-purple-400/40 focus-within:border-purple-400/70 focus-within:shadow-lg focus-within:shadow-purple-500/15">
            <Search
              className="shrink-0 text-white transition-colors duration-300 group-focus-within:text-white"
              size={21}
            />

            <input
              type="search"
              placeholder={typedText}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent py-4 text-sm text-white font-serif outline-none placeholder:text-gray-400 placeholder:italic sm:text-base"
              aria-label="Search projects"
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
  {loading ? (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-white/10 bg-[#1b0b38] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-4 w-32 rounded bg-white/10" />
              </div>
            </div>

            <div className="mb-3 h-6 w-3/4 rounded bg-white/10" />

            <div className="mb-5 space-y-2">
              <div className="h-3 rounded bg-white/10" />
              <div className="h-3 rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-white/10" />
              <div className="h-20 rounded-xl bg-white/10" />
            </div>

            <div className="h-11 rounded-xl bg-white/10" />
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        {slowLoad
          ? "The server is waking up, this can take up to a minute..."
          : "Loading projects..."}
      </p>
    </div>
  ) : loadError ? (
    <div className="py-16 text-center text-gray-300">
      <h3 className="text-xl font-semibold">{loadError}</h3>

      <button
        type="button"
        onClick={fetchProjects}
        className="mt-5 rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white transition hover:bg-purple-700"
      >
        Try again
      </button>
    </div>
  ) : filteredProjects.length === 0 ? (
    /* ...your existing "No projects found" block stays exactly as it is... */
  ) : (
    /* ...your existing projects grid and pagination stay exactly as they are... */
  )}
</section>
      </main>

      <Footer />
    </>
  );
}

export default Freelancerdashboard;
