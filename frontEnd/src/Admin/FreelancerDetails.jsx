import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const res = await API.get(`/freelancerprofile/${userId}`);

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

  return (
    <>
      <Adminheader />
      

      <div className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#18003b] to-[#240046] text-white px-4 sm:px-6 lg:px-10 py-8">
        {/* BACK BUTTON */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Freelancers
        </button>

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

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {profile.fullName ||
                  profile.name ||
                  profile.freelancerName ||
                  "Unnamed Freelancer"}
              </h1>

              <p className="text-purple-300 mt-1">
                {profile.title ||
                  profile.profession ||
                  profile.role ||
                  "Freelancer"}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {profile.location || "Location not set"}
                </span>

                {profile.experience && (
                  <span className="flex items-center gap-1">
                    <BriefcaseBusiness size={14} />
                    {profile.experience}
                  </span>
                )}

                {profile.rating !== undefined && (
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />

                    {profile.rating}
                  </span>
                )}
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

            {/* AVAILABILITY */}

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Availability</p>

              <p className="text-green-400 mt-2 font-medium">
                {profile.availability || "N/A"}
              </p>
            </div>

            {/* RATING */}

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Star size={16} />
                Rating
              </div>

              <p className="text-yellow-400 mt-2 font-medium">
                {profile.rating !== undefined ? profile.rating : "N/A"}
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
