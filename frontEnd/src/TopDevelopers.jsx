import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./API";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function TopDevelopers() {
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDevelopers = async () => {
      try {
        const res = await API.get("/top-freelancers");

        if (res.data.success) {
          setDevelopers(res.data.freelancers);
        }
      } catch (error) {
        console.error("Error fetching top developers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDevelopers();
  }, []);

  // Logged-in clients go straight to the freelancer's profile;
  // everyone else is sent to login first.
  const handleHire = (userId) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user?.role === "client") {
      navigate(`/freelancer/${userId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <section
        id="developers"
        className="w-full min-h-screen bg-[#10002b] py-24 px-10"
      >
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Top Developers</h1>

          <p className="text-gray-300 text-lg mt-5">
            Hire experienced developers for your next project.
          </p>
        </div>

        {loading && (
          <p className="text-gray-400 text-center mt-20">
            Loading top developers...
          </p>
        )}

        {!loading && developers.length === 0 && (
          <p className="text-gray-400 text-center mt-20">
            No developers available yet.
          </p>
        )}

        {!loading && developers.length > 0 && (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
  {developers.map((dev) => (
    <div
      key={dev.userId}
      className="group relative overflow-hidden rounded-2xl
      border border-purple-500/20 bg-[#10002b]
      shadow-lg shadow-black/20
      transition-all duration-300
      hover:border-purple-400/50 hover:shadow-purple-900/30
      hover:-translate-y-2"
    >
      {/* Top Accent */}
      <div className="h-2 w-full bg-gradient-to-r
        from-purple-700 via-violet-500 to-purple-900"
      />

      {/* Card Content */}
      <div className="p-4">

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <div className="absolute -inset-1 rounded-full
              bg-gradient-to-tr from-purple-600 to-violet-400
              opacity-70 blur-sm transition-opacity
              group-hover:opacity-100"
            />

            <img
              src={dev.image || FALLBACK_IMAGE}
              alt={dev.name || "Freelancer"}
              className="relative h-28 w-28 rounded-full
              border-4 border-[#180035] object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-white">
            {dev.name || "Unnamed Freelancer"}
          </h2>

          <p className="mt-1 text-sm font-medium text-purple-300">
            {dev.title || "Freelancer"}
          </p>

          {/* Rating */}
          <div className="mt-3 inline-flex items-center gap-2
            rounded-full border border-yellow-400/20
            bg-yellow-400/10 px-4 py-1.5"
          >
            <span className="text-yellow-400">★</span>

            <span className="text-sm font-semibold text-yellow-200">
              {dev.rating ? Number(dev.rating).toFixed(1) : "New"}
            </span>

            <span className="text-xs text-gray-400">
              {dev.reviewCount > 0
                ? `${dev.reviewCount} reviews`
                : "No reviews"}
            </span>
          </div>
        </div>

        {/* About */}
        <div className="mt-3 rounded-xl border border-purple-500/10
          bg-[#180035] p-4"
        >
          <p className="line-clamp-3 min-h-[60px] text-sm
            leading-6 text-gray-300"
          >
            {dev.bio ||
              "A skilled freelancer ready to help bring your project ideas to life."}
          </p>
        </div>

        {/* Skills */}
        <div className="mt-5">
          <h3 className="mb-3 text-xs font-bold uppercase
            tracking-[0.15em] text-purple-300"
          >
            Skills & Expertise
          </h3>

          <div className="flex min-h-[56px] flex-wrap content-start gap-2">
            {dev.skills && dev.skills.length > 0 ? (
              <>
                {dev.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-md bg-purple-500/10
                    px-3 py-1.5 text-xs font-medium
                    text-purple-200 ring-1 ring-purple-400/20
                    transition-colors hover:bg-purple-500/20"
                  >
                    {skill}
                  </span>
                ))}

                {dev.skills.length > 3 && (
                  <span className="rounded-md bg-white/5
                    px-3 py-1.5 text-xs text-gray-400"
                  >
                    +{dev.skills.length - 3}  
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">
                No skills listed
              </span>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt- grid grid-cols-3 divide-x
          divide-purple-500/20 rounded-xl border
          border-purple-500/15 bg-[#180035] py-4"
        >
          <div className="px-2 text-center">
            <p className="text-lg font-bold text-white">
              {dev.experience != null && dev.experience !== ""
                ? `${dev.experience}y`
                : "—"}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Experience
            </p>
          </div>

          <div className="px-2 text-center">
            <p className="text-lg font-bold text-white">
              {dev.projects ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Projects
            </p>
          </div>

          <div className="px-2 text-center">
            <p className="text-lg font-bold text-white">
              {dev.hourlyRate
                ? `₹${Number(dev.hourlyRate).toLocaleString("en-IN")}`
                : "—"}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Per Hour
            </p>
          </div>
        </div>

        {/* Hire Button */}
        <button
          type="button"
          onClick={() => handleHire(dev.userId)}
          className="mt-6 flex w-full items-center justify-center
          gap-2 rounded-xl border border-purple-400/30
          bg-gradient-to-r from-purple-700 to-violet-700
          py-3.5 font-semibold text-white
          shadow-md shadow-purple-950/30
          transition-all duration-300
          hover:border-purple-300/50
          hover:from-purple-600 hover:to-violet-600
          active:scale-[0.98]"
        >
          Hire Freelancer
          <span className="transition-transform duration-300
            group-hover:translate-x-1"
          >
            →
          </span>
        </button>

      </div>
    </div>
  ))}
</div>
          )}
      </section>
    </>
  );
}

export default TopDevelopers;
