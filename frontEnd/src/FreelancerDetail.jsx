import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";

import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import API from "./API";

const FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function FreelancerDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const client = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // =========================================================
  // REVIEW FORM STATE
  // =========================================================

  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/freelancerprofile/${userId}`);

      if (res.data.success && res.data.profile) {
        setProfile(res.data.profile);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.log(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const handleSubmitReview = async () => {
    if (!client?.id) {
      alert("Please login as a client to leave a review.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(`/freelancerprofile/${userId}/review`, {
        clientId: client.id,
        clientName: client.fullName || client.name,
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.data.success) {
        alert("Review submitted!");

        setReviewRating(0);
        setReviewComment("");

        // refresh profile so new review + updated rating show immediately
        fetchProfile();
      } else {
        alert(res.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // CHAT
  // =========================================================

  const handleChat = () => {
    navigate(`/clientmessages/${profile.userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002b] flex items-center justify-center text-white">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-[#10002b] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-gray-400">Freelancer not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 px-5 py-2 rounded-xl hover:bg-purple-500 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#18003b] to-[#240046] text-white px-4 sm:px-6 lg:px-10 py-8">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* HERO */}
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={profile.image || FALLBACK_IMAGE}
            alt={profile.name}
            className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-400/40"
          />

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {profile.name || "Unnamed Freelancer"}
            </h1>
            <p className="text-purple-300 mt-1">
              {profile.title || "No title set"}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {profile.location || "Location not set"}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {profile.rating ? Number(profile.rating).toFixed(1) : "New"}
                <span className="text-gray-500">
                  ({profile.reviews?.length || 0} reviews)
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 max-w-md">
              <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock size={14} />
                  <p className="text-[11px]">Experience</p>
                </div>
                <p className="font-bold mt-1 text-sm">
                  {profile.experience
                    ? `${profile.experience} Years`
                    : "Not set"}
                </p>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Briefcase size={14} />
                  <p className="text-[11px]">Projects</p>
                </div>
                <p className="font-bold mt-1 text-sm">
                  {profile.projects || 0}+
                </p>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <LiaRupeeSignSolid size={13} />
                  <p className="text-[11px]">Rate</p>
                </div>
                <p className="font-bold mt-1 ml-1 text-sm">
                  {profile.hourlyRate ? `${profile.hourlyRate}/hr` : "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-3 self-start w-full sm:w-auto">
            <button
              type="button"
              onClick={handleChat}
              className="bg-purple-600 hover:bg-purple-500  flex items-center justify-center gap-2  border border-white/10 px-4 py-3 rounded-xl font-semibold transition"
            >
              <MessageCircle size={17} />
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      {profile.bio && (
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-3">About</h2>
          <p className="text-gray-300 leading-6">{profile.bio}</p>
        </div>
      )}

      {/* SKILLS */}
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {(profile.skills || []).map((skill, index) => (
            <span
              key={index}
              className="text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-400/20 px-3 py-1.5 rounded-lg"
            >
              {skill}
            </span>
          ))}
          {(!profile.skills || profile.skills.length === 0) && (
            <p className="text-gray-500 text-sm">No skills added.</p>
          )}
        </div>
      </div>

      {/* LEAVE A REVIEW */}
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

        {/* STAR PICKER */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReviewRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={26}
                className={
                  star <= (hoverRating || reviewRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }
              />
            </button>
          ))}

          {reviewRating > 0 && (
            <span className="ml-2 text-sm text-gray-400">
              {reviewRating} / 5
            </span>
          )}
        </div>

        {/* COMMENT */}
        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          rows="3"
          placeholder="Share your experience working with this freelancer..."
          className="w-full bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none placeholder-gray-500 resize-none transition mb-4"
        />

        <button
          type="button"
          onClick={handleSubmitReview}
          disabled={submitting}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-6 py-2.5 rounded-xl font-semibold transition"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* REVIEWS LIST */}
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Reviews ({profile.reviews?.length || 0})
        </h2>

        {(!profile.reviews || profile.reviews.length === 0) && (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        )}

        <div className="space-y-4">
          {(profile.reviews || []).map((review, index) => (
            <div
              key={index}
              className="border-b border-white/10 pb-4 last:border-0"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">
                  {review.clientName || "Anonymous"}
                </p>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{review.rating}</span>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-400 text-sm mt-1">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FreelancerDetail;
