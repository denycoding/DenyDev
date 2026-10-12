import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  IndianRupee,
  Clock,
  CalendarDays,
  Briefcase,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

import Freelancerheader from "./Freelancerheader";
import API from "./API";

function FreelancerViewProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const freelancer = JSON.parse(localStorage.getItem("user"));

  const [project, setProject] = useState(null);
  const [myProposal, setMyProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  // =====================================================
  // FETCH PROJECT + MY PROPOSAL
  // =====================================================
 
  useEffect(() => {
    const fetchData = async () => {
      const freelancerId = freelancer?._id || freelancer?.id;

      if (!freelancerId) {
        setLoading(false);
        return;
      }

      try {
        const [projectRes, proposalsRes] = await Promise.all([
          API.get(`/postjobs/${projectId}`),
          API.get(`/proposals/freelancer/${freelancerId}`),
        ]);

        if (projectRes.data.success) {
          setProject(projectRes.data.project);
        }

        if (proposalsRes.data.success) {
          const proposal = proposalsRes.data.proposals.find(
            (p) => p.projectId?._id === projectId,
          );

          setMyProposal(proposal || null);
        }
      } catch (error) {
        console.log("Fetch Freelancer Project Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // =====================================================
  // SYNC PROGRESS ONCE PROPOSAL LOADS
  // =====================================================

  useEffect(() => {
    if (myProposal?.progress !== undefined) {
      setProgress(myProposal.progress);
    }
    
  }, [myProposal]);

  // =====================================================
  // CHAT WITH CLIENT
  // =====================================================

  const handleChat = () => {
    const clientId =
      myProposal?.clientId?._id ||
      myProposal?.clientId?.id ||
      project?.clientId;

    if (!clientId) {
      console.log("Client ID not found");
      return;
    }

    navigate(`/freelancermessage/${clientId}`);
  };

  // =====================================================
  // UPDATE PROGRESS
  // =====================================================

  const handleProgressUpdate = async (value) => {
    // Cannot go backward or select the same progress again
    if (updatingProgress || value <= progress) return;

    setUpdatingProgress(true);
    setProject((value) => ({
      ...value,
      status: "completed",
    }));

    try {
      const res = await API.patch(`/proposals/${myProposal._id}/progress`, {
        progress: value,
      });

      if (res.data.success) {
        setProgress(value);
      }
    } catch (error) {
      console.log("Update Progress Error:", error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002b] text-white">
        <Freelancerheader />

        <div className="flex justify-center items-center min-h-[70vh]">
          <p className="text-gray-300 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROJECT NOT FOUND
  // =====================================================

  if (!project) {
    return (
      <div className="min-h-screen bg-[#10002b] text-white">
        <Freelancerheader />

        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-3">Project not found</h2>

          <button
            type="button"
            onClick={() => navigate("/freelancerproject")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg transition"
          >
            Back to My Projects
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO PROPOSAL
  // =====================================================

  if (!myProposal) {
    return (
      <div className="min-h-screen bg-[#10002b] text-white">
        <Freelancerheader />

        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-3">Proposal not found</h2>

          <p className="text-gray-400 mb-5">
            You have not submitted a proposal for this project.
          </p>

          <button
            type="button"
            onClick={() => navigate("/freelancerproject")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg transition"
          >
            Back to My Projects
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  const isAccepted = myProposal.status === "accepted";
  const isPending = myProposal.status === "pending";
  const isRejected = myProposal.status === "rejected";

  // =====================================================
  // DURATION
  // =====================================================

  const duration = String(project.deadline || "")
    .replace(/days?/gi, "")
    .trim();

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      <Freelancerheader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate("/freelancerproject")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to My Projects
        </button>

        {/* PROJECT HEADER */}

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8 border-b border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <span className="inline-block bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  {project.category || "Project"}
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {project.title}
                </h1>

                <p className="text-gray-400 mt-3">
                  Client:{" "}
                  <span className="text-white text-2xl font-medium">
                    {myProposal.clientId?.fullName ||
                      project.companyName ||
                      "Client"}
                  </span>
                </p>
              </div>

              {/* PROJECT STATUS */}

              <div className="flex w-4/12 flex-col gap-3">
                {isAccepted && (
                  <>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-green-400" />
                        <h3 className="font-semibold text-green-400">
                          You're Hired!
                        </h3>
                      </div>

                      <p className="text-gray-300 text-sm mt-2 leading-6">
                        The client has accepted your proposal. You can now start
                        working on this project.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleChat}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      <MessageCircle size={18} />
                      Chat
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* LEFT SIDE */}

            <div className="lg:col-span-2 p-6 sm:p-8">
              {/* PROJECT DESCRIPTION */}

              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Project Description
                </h2>

                <p className="text-gray-300 leading-7 whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* REQUIRED SKILLS */}

              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-3">
                  {(project.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-gray-200 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* PROJECT DETAILS */}

              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  Project Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CATEGORY */}

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Briefcase size={20} className="text-purple-400" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Category</p>

                        <p className="text-white font-medium mt-1">
                          {project.category || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BUDGET */}

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <IndianRupee size={20} className="text-purple-400" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Project Budget</p>

                        <p className="text-white font-medium mt-1">
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
                  </div>

                  {/* DURATION */}

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Clock size={20} className="text-purple-400" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Duration</p>

                        <p className="text-white font-medium mt-1">
                          {duration ? `${duration} Days` : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DEADLINE */}

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <CalendarDays size={20} className="text-purple-400" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Deadline</p>

                        <p className="text-white font-medium mt-1">
                          {project.deadline || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-8">
              {/* PROGRESS */}

              {isAccepted && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Project Progress
                    </h3>
                    <span className="text-sm font-semibold text-purple-300">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Steps */}
                  <div className="relative mt-8">
                    {/* Connecting Line */}
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10" />

                    <div className="relative flex items-start justify-between">
                      {[0, 25, 50, 75, 100].map((value, index) => {
                        const isCurrentProgress = value === progress;
                        const isNextStep = value === progress + 25;
                        const isCompleted = value < progress;

                        return (
                          <div
                            key={value}
                            className="flex flex-col items-center w-1/5"
                          >
                            {/* Step Circle */}
                            <button
                              type="button"
                              disabled={!isNextStep || updatingProgress}
                              onClick={() => handleProgressUpdate(value)}
                              className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                isCurrentProgress
                                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30"
                                  : isCompleted
                                    ? "bg-purple-600/40 border-purple-500/40 text-purple-200 cursor-not-allowed"
                                    : isNextStep
                                      ? "bg-white/10 border-purple-500/50 text-purple-300 hover:bg-purple-600/30 hover:border-purple-500 cursor-pointer"
                                      : "bg-[#180035] border-white/10 text-gray-500 cursor-not-allowed"
                              } ${
                                updatingProgress
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {value === 100 ? "✓" : `${value}`}
                            </button>

                            {/* Step Label */}
                            <div className="mt-3 text-center">
                              <p
                                className={`text-xs font-semibold ${
                                  isCurrentProgress
                                    ? "text-purple-300"
                                    : isNextStep
                                      ? "text-gray-300"
                                      : "text-gray-500"
                                }`}
                              >
                                {value}%
                              </p>

                              <p className="text-[10px] text-gray-500 mt-1">
                                {value === 0
                                  ? "Started"
                                  : value === 25
                                    ? "Planning"
                                    : value === 50
                                      ? "Development"
                                      : value === 75
                                        ? "Testing"
                                        : "Completed"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PENDING */}

              {isPending && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-5">
                  <h3 className="font-semibold text-yellow-400 mb-2">
                    Proposal Pending
                  </h3>

                  <p className="text-gray-300 text-sm leading-6">
                    Your proposal is currently being reviewed by the client.
                  </p>
                </div>
              )}

              {/* REJECTED */}

              {isRejected && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-5">
                  <h3 className="font-semibold text-red-400 mb-2">
                    Proposal Rejected
                  </h3>

                  <p className="text-gray-300 text-sm leading-6">
                    Unfortunately, the client did not select your proposal for
                    this project.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FreelancerViewProject;
