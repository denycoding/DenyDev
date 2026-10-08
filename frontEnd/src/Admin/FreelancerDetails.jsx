import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";

import { Briefcase, Clock } from "lucide-react";

import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Globe,
  BriefcaseBusiness,
  Calendar,
  Star,
  Code,
  User,
} from "lucide-react";

import Adminheader from "./Adminheader";
import API from "../API";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function FreelancerDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/freelancerprofile/${userId}`); // ✅ fixed — GET, not block toggle

        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
         } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching freelancer profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  /* Loading */
  if (loading) {
    return (
      <>
        <Adminheader />

        <div className="min-h-screen bg-[#10002b] flex items-center justify-center text-white">
          <p className="text-gray-400">Loading freelancer profile...</p>
        </div>
      </>
    );
  }

  /* Not Found */
  if (notFound || !profile) {
    return (
      <>
        <Adminheader />

        <div className="min-h-screen bg-[#10002b] flex flex-col items-center justify-center text-white gap-4">
          <p className="text-gray-400">Freelancer not found.</p>

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
      const action = profile.blocked === "Blocked" ? "Active" : "Blocked";

      const confirmed = window.confirm(
        `Are you sure you want to ${action} this freelancer?`,
      );
      
      if (!confirmed) {
        return;
      }

      const res = await API.post(`/admin/blockfreelancers/${userId}`);

      if (res.data.success) {
        alert(res.data.message);

        setProfile((prev) => ({
          ...prev,
          blocked: res.data.blocked,
        }));
      }
    } catch (error) {
      console.error("Block/Unblock Freelancer Error:", error);
      alert("Failed to update block status.");
    }
  };
  const handleDeleteUser = async () => {
    try {
      if (!confirm("Are you sure you want to delete this freelancer?")) {
        return;
      }

      const res = await API.post(`/admin/delete-freelancer/${userId}`);
      if (res.data.success) {
        alert("Freelancer deleted successfully.");
        navigate("/freelancers");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#18003b] to-[#240046] text-white px-4 sm:px-6 lg:px-10 py-8 ">
        {/* BACK BUTTON */}
        <div className="flex items-center  justify-between mb-5 pointer">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white  transition"
          >
            <ArrowLeft size={18} />
            Back to Freelancers
          </button>
          <div className="flex gap-3">
            <button
              className="flex
              items-center
              justify-center
              gap-2
              bg-red-500/10
              border
              border-red-400/20
              text-red-400
              hover:bg-red-500
              hover:text-white
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition"
              onClick={handleBlockUser}
            >
              {profile.blocked === "Blocked" ? "Activate User" : "Block User"}
            </button>
            <button
              className="flex
              items-center
              justify-center
              gap-2
              bg-red-500/10
              border
              border-red-400/20
              text-red-400
              hover:bg-red-500
              hover:text-white
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition"
              onClick={handleDeleteUser}
            >
              Delete User
            </button>
          </div>
        </div>

        {/* BLOCKED BANNER */}
        {profile.blocked === "Blocked" && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-3 mb-6 text-sm font-medium">
            This freelancer is currently blocked.
          </div>
        )}

        {/* PROFILE HERO */}

        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* IMAGE */}

            <img
              src={profile.image || FALLBACK_IMAGE}
              alt={
                profile.fullName ||
                profile.name ||
                profile.freelancerName ||
                "Freelancer"
              }
              className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-400/40"
            />

            {/* BASIC INFORMATION */}

            <div className="flex-1 ">
              <h1 className="text-2xl sm:text-3xl font-bold w-full ">
                {profile.fullName ||
                  profile.name ||
                  profile.freelancerName ||
                  "Unnamed Freelancer"}
              </h1>

              <p className="text-purple-300 mt-1 ">
                {profile.title ||
                  profile.profession ||
                  profile.role ||
                  "Freelancer"}
              </p>

              <div
                className="
                grid
                grid-cols-2
                sm:grid-cols-5
                gap-3
                mt-7
              "
              >
                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase size={15} />

                    <span className="text-xs">Projects</span>
                  </div>

                  <p className="text-xl font-bold mt-1">
                    {profile.projects || 0}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={15} />

                    <span className="text-xs">Experience</span>
                  </div>

                  <p className="text-xl font-bold mt-1">
                    {profile.experience || "Not Set"}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star size={15} className="text-yellow-400" />

                    <span className="text-xs">Rating</span>
                  </div>

                  <p className="text-xl font-bold mt-1">
                    {profile.rating ? profile.rating.toFixed(1) : "0.0"}
                  </p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <LiaRupeeSignSolid size={17} />

                    <span className="text-xs">Hourly Rate</span>
                  </div>

                  <p className="text-xl font-bold ml-1 mt-1">
                    {profile.hourlyRate ? `${profile.hourlyRate}` : "Not Set"}
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
            {/* EMAIL */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} />
                Email
              </div>

              <p className="text-white mt-2 break-all">
                {profile.email || "N/A"}
              </p>
            </div>

            {/* PHONE */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} />
                Phone
              </div>

              <p className="text-white mt-2">{profile.phone || "N/A"}</p>
            </div>

            {/* LOCATION */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} />
                Location
              </div>

              <p className="text-white mt-2">{profile.location || "N/A"}</p>
            </div>

            {/* WEBSITE */}

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

        {/* PROFESSIONAL INFORMATION */}

        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Professional Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PROFESSION */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <User size={16} />
                Profession
              </div>

              <p className="text-white mt-2">
                {profile.title || profile.profession || "N/A"}
              </p>
            </div>

            {/* EXPERIENCE */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <BriefcaseBusiness size={16} />
                Experience
              </div>

              <p className="text-white mt-2">{profile.experience || "N/A"}</p>
            </div>

            {/* HOURLY RATE */}

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Hourly Rate</p>

              <p className="text-white mt-2">
                {profile.hourlyRate || profile.hourlyRate === 0
                  ? `$${profile.hourlyRate}/hr`
                  : "N/A"}
              </p>
            </div>

            {/* RATING */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Star size={16} />
                Rating
              </div>

              <p className="text-yellow-400 mt-2 font-medium">
                {profile.rating !== undefined
                  ? profile.rating.toFixed(1)
                  : "N/A"}
              </p>
            </div>

            {/* JOINED */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar size={16} />
                Joined
              </div>

              <p className="text-white mt-2">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* SKILLS */}

        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Code size={20} />
            <h2 className="text-xl font-bold">Skills</h2>
          </div>

          {profile.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-600/20 border border-purple-400/20 text-purple-300 px-4 py-2 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No skills available.</p>
          )}
        </div>

        {/* ABOUT FREELANCER */}

        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">About Freelancer</h2>

          <p className="text-gray-300 leading-6">
            {profile.bio ||
              profile.about ||
              profile.description ||
              "No information available."}
          </p>
        </div>
      </div>
    </>
  );
}

export default FreelancerDetails;
