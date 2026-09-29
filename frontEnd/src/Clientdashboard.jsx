import { useState, useEffect } from "react";
import { Search, Briefcase, Clock, Star, ArrowRight } from "lucide-react";

import {
  FaTools,
  FaCode,
  FaChartBar,
  FaRobot,
  FaShieldAlt,
  FaCloud,
} from "react-icons/fa";

import { IoFilter } from "react-icons/io5";

import Clientheader from "./Clientheader";
import Footer from "./Footer";
import API from "./API";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function Clientdashboard() {
  const Navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // =========================================================
  // TYPEWRITER PLACEHOLDER
  // =========================================================

  const searchPlaceholders = [
    "Search your projects...",
    "Web Development projects...",
    "AI / ML projects...",
    "Data Science projects...",
    "DevOps projects...",
    "Cloud Computing projects...",
    "React projects...",
    "Python projects...",
    "Cybersecurity projects...",
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = searchPlaceholders[phraseIndex];

    const typingSpeed = isDeleting ? 20 : 30;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
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

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await API.get("/freelancerprofiles");
        if (res.data.success) {
          setDevelopers(res.data.profiles);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const formatName = (name) => {
    return String(name || "")
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const handleCategory = (category) => {
    setSelectedCategory(category);
  };
  const filteredDevelopers = developers.filter((dev) => {
    const text = searchText.toLowerCase().trim();

    const developerCategory = String(dev.category || "")
      .toLowerCase()
      .trim();

    const selected = selectedCategory.toLowerCase().trim();

    const matchesSearch =
      !text ||
      dev.name?.toLowerCase().includes(text) ||
      dev.title?.toLowerCase().includes(text) ||
      developerCategory.includes(text) ||
      dev.skills?.some((skill) => skill.toLowerCase().includes(text));

    const matchesCategory = !selectedCategory || developerCategory === selected;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Clientheader />

      <section className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#18003b] to-[#240046] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* WELCOME */}
        <div className="mb-8">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name || user?.fullName || "Client"} 👋
          </h1>
        </div>

        {/* SEARCH */}
        <div className=" max-w-3xl mx-auto mb-14">
          <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-xl focus-within:ring-2 focus-within:ring-purple-500 transition">
            <Search className="ml-5 text-gray-500 flex-shrink-0" size={21} />
            <input
              type="search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSelectedCategory("");
              }}
              placeholder={typedText}
              className="w-full px-4 py-4 outline-none text-black text-sm sm:text-base"
            />
          </div>
        </div>

        {/* MAIN HEADING */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Find freelancers for every type of work
          </h2>
          <p className="text-gray-400 mt-4 text-sm sm:text-base">
            Browse categories and hire top talent.
          </p>
        </div>

        {/* DEVELOPERS */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold">
                Top Developers
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                Hire experienced professionals for your next project.
              </p>
            </div>

            <div className="flex justify-end">
  <button
    type="button"
    className="
      flex
      items-center
      gap-2
      bg-white
      text-gray-800
      px-5
      py-2.5
      rounded-xl
      font-medium
      hover:bg-gray-100
      transition
      shadow-lg
    "
  >
    <IoFilter className="text-purple-600" size={18} />
    Filter
  </button>
</div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <p className="text-gray-400 text-center py-10">
              Loading freelancers...
            </p>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredDevelopers.length === 0 && (
            <p className="text-gray-400 text-center py-10">
              {selectedCategory || searchText
                ? "No freelancers found for your filter."
                : "No freelancers found yet."}
            </p>
          )}

          {/* FREELANCER CARDS */}
          {!loading && developers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredDevelopers.map((dev) => (
                <div
                  key={dev._id}
                  className="
                    group
                    relative
                     
                    overflow-hidden
                    rounded-2xl
                    border
                    border-purple-400/20
                    bg-gradient-to-br
                    from-[#1a0638]
                    via-[#21094a]
                    to-[#2d0b5c]
                    text-white
                    shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-purple-400/60
                    hover:shadow-[0_20px_50px_rgba(124,58,237,0.30)]
                  "
                >
                  <div className="absolute -top-20 -right-20 w-40 h-40  bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition"></div>

                  {/* TOP SECTION */}
                  <div className="relative px-5 pt-5 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <img
                        src={dev.image || FALLBACK_IMAGE}
                        alt={dev.name}
                        className="
                          w-16
                          h-16
                          rounded-2xl
                          object-cover
                          border-2
                          border-purple-400/50
                          shadow-lg
                          group-hover:border-purple-300
                          group-hover:scale-105
                          transition-all
                          duration-300
                        "
                      />

                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {formatName(dev.name) || "Unnamed Freelancer"}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          {dev.title || "No title set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="px-5 py-5">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="font-bold text-white text-sm">
                            {dev.rating ? Number(dev.rating).toFixed(1) : "0"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({dev.reviews?.length || 0} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="mb-5">
                      <p className="text-xs text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {(dev.skills || [])
                          .slice(0, 4)
                          .map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="
                              text-xs
                              font-medium
                              bg-purple-500/10
                              text-purple-300
                              border
                              border-purple-400/20
                              px-2.5
                              py-1.5
                              rounded-lg
                              hover:bg-purple-500/20
                              transition
                            "
                            >
                              {skill}
                            </span>
                          ))}
                        {(!dev.skills || dev.skills.length === 0) && (
                          <span className="text-xs text-gray-500">
                            No skills added
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock size={14} />
                          <p className="text-[11px]">Experience</p>
                        </div>
                        <p className="font-bold text-white mt-1 text-sm">
                          {dev.experience
                            ? `${dev.experience} Years`
                            : "Not set"}
                        </p>
                      </div>

                      <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Briefcase size={14} />
                          <p className="text-[11px]">Projects</p>
                        </div>
                        <p className="font-bold text-white mt-1 text-sm">
                          {dev.projects || 0}+
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PRICE SECTION */}
                  <div className="border-t border-white/10 bg-black/20 px-5 py-5">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {dev.hourlyRate ? `₹${dev.hourlyRate}` : "Not set"}
                        <span className="text-sm font-normal text-gray-500">
                          /hr
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => Navigate(`/freelancer/${dev.userId}`)}
                      className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-3
                        rounded-xl
                        font-semibold
                        transition-all
                        bg-purple-600
                        text-white
                        hover:bg-purple-500
                        hover:shadow-lg
                        hover:shadow-purple-500/30
                        active:scale-[0.98]
                      "
                    >
                      Hire Now
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Clientdashboard;
