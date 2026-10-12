import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, LoaderCircle } from "lucide-react";

import {
  ArrowLeft,
  Calendar,
  IndianRupee,
  Briefcase,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";

import Freelancerheader from "./Freelancerheader";
import API from "./API";

function Freelancerproposal() {
  const [generating, setGenerating] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // PROJECT STATES
  // =====================================================

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // PROPOSAL STATES
  // =====================================================

  const [showProposalModal, setShowProposalModal] = useState(() => {
    return localStorage.getItem("showProposalModal") === "true";
  });
  const [proposalLoading, setProposalLoading] = useState(false);

  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [proposalError, setProposalError] = useState("");

  const [formData, setFormData] = useState({
    bidAmount: "",
    deliveryTime: "",
    coverLetter: "",
  });

  useEffect(() => {
    if (showProposalModal) {
      localStorage.setItem("showProposalModal", "true");
    } else {
      localStorage.removeItem("showProposalModal");
    }
  }, [showProposalModal]);

  // =====================================================
  // FETCH PROJECT
  // =====================================================

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/postjobs/${projectId}`);

        if (res.data.success) {
          setProject(res.data.project);
        }
      } catch (error) {
        console.log("Fetch Project Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const checkExistingProposal = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        const freelancerId = user._id || user.id || user.freelancerId;

        if (!freelancerId) return;

        const res = await API.get(`/proposals/freelancer/${freelancerId}`);

        if (res.data.success) {
          const existingProposal = res.data.proposals.find(
            (proposal) => String(proposal.projectId?._id) === String(projectId),
          );

          if (existingProposal) {
            setProposalSubmitted(true);
          }
        }
      } catch (error) {
        console.log("Check Existing Proposal Error:", error);
      }
    };

    checkExistingProposal();
  }, [projectId]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProposalError("");
  };

  // =====================================================
  // OPEN PROPOSAL MODAL
  // =====================================================

  const handleSendProposal = () => {
    setProposalError("");
    setProposalSuccess(false);

    setFormData({
      bidAmount: "",
      deliveryTime: "",
      coverLetter: "",
    });

    setShowProposalModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeProposalModal = () => {
    if (proposalLoading) return;

    setShowProposalModal(false);
    setProposalError("");
    setProposalSuccess(false);
  };

  // =====================================================
  // SUBMIT PROPOSAL
  // =====================================================

  const handleSubmitProposal = async (e) => {
    e.preventDefault();

    // -----------------------------------------
    // Clear previous errors
    // -----------------------------------------

    setProposalError("");

    // -----------------------------------------
    // Get logged-in user
    // -----------------------------------------

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setProposalError(
        "Please login as a freelancer before submitting a proposal.",
      );

      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("User Parse Error:", error);

      setProposalError("Invalid login information. Please login again.");

      return;
    }

    // -----------------------------------------
    // Get freelancer ID
    // -----------------------------------------

    const freelancerId = user._id || user.id || user.freelancerId;

    if (!freelancerId) {
      setProposalError("Freelancer information not found. Please login again.");

      return;
    }

    // -----------------------------------------
    // Validate bid amount
    // -----------------------------------------

    if (!formData.bidAmount) {
      setProposalError("Please enter your bid amount.");

      return;
    }

    if (Number(formData.bidAmount) <= 0) {
      setProposalError("Bid amount must be greater than 0.");

      return;
    }

    // -----------------------------------------
    // Validate delivery time
    // -----------------------------------------

    if (!formData.deliveryTime) {
      setProposalError("Please enter your delivery time.");

      return;
    }

    if (Number(formData.deliveryTime) <= 0) {
      setProposalError("Delivery time must be greater than 0.");

      return;
    }

    // -----------------------------------------
    // Validate cover letter
    // -----------------------------------------

    if (!formData.coverLetter.trim()) {
      setProposalError("Please write a cover letter.");

      return;
    }

    // -----------------------------------------
    // Submit proposal
    // -----------------------------------------

    try {
      setProposalLoading(true);

      const res = await API.post(`/proposals/${project._id}`, {
        freelancerId,
        bidAmount: Number(formData.bidAmount),
        deliveryTime: Number(formData.deliveryTime),
        coverLetter: formData.coverLetter.trim(),
      });

      if (res.data.success) {
        setProposalSuccess(true);
        setProposalSubmitted(true);

        setProject((prev) => ({
          ...prev,
          proposals: (prev.proposals || 0) + 1,
        }));

        setTimeout(() => {
          setShowProposalModal(false);
          setProposalSuccess(false);

          setFormData({
            bidAmount: "",
            deliveryTime: "",
            coverLetter: "",
          });
        }, 2000);
      }
    } catch (error) {
      setProposalError(
        error.response?.data?.message ||
          "Failed to submit proposal. Please try again.",
      );
    } finally {
      setProposalLoading(false);
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
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-3">Project not found</h2>
          <button
            onClick={() => navigate("/freelancerdashboard")}
            className="bg-purple-600 hover:bg-purple-700 px-5 rounded-lg transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // DURATION
  // =====================================================

  const duration = String(project.deadline || "")
    .replace(/days?/gi, "")
    .trim();

  // =====================================================
  // JSX
  // =====================================================

  const generateProposal = async () => {
    if (!project?.title || !project?.description) {
      setProposalError("Project information is missing.");
      return;
    }

    try {
      setGenerating(true);
      setProposalError("");

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : {};

      const response = await API.post("/generate-proposal", {
        projectTitle: project.title,
        projectDescription: project.description,
        companyName: project.companyName || "Client",
        skills: project.skills || [],
        budgetMin: project.budgetMin,
        budgetMax: project.budgetMax,
        deliveryTime: formData.deliveryTime || duration || "Not specified",
        freelancerName: user.fullName || user.name || "Freelancer",
        freelancerExperience: user.experience,
        freelancerSkills: user.skills || [],
        freelancerTitle: user.title || "",
        freelancerBudget: formData.bidAmount,
        freelancerdeliveryTime: formData.deliveryTime,
      });

      setFormData((prev) => ({
        ...prev,
        coverLetter: response.data.coverLetter,
      }));
    } catch (error) {
      console.error(
        "AI Proposal Generation Error:",
        error.response?.data || error.message,
      );

      setProposalError(
        error.response?.data?.message ||
          "Failed to generate proposal. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Freelancerheader />

      <main className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] px-4 sm:px-6 lg:px-10 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {project.title}
                  </h1>

                  <p className="text-gray-400 mt-3">
                    Posted by{" "}
                    <span className="text-white font-medium">
                      {project.companyName || "Client"}
                    </span>
                  </p>
                </div>

                <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl px-6 py-4 min-w-[220px]">
                  <p className="text-gray-400 text-sm">Project Budget</p>

                  <div className="flex items-center text-white gap-1 mt-1">
                    <IndianRupee size={20} />
                    <span className="text-xl font-bold text-white">
                      {Number(project.budgetMin || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-xl font-bold text-white">
                      {Number(project.budgetMax || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-6 sm:p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Project Description
                  </h2>
                  <p className="text-gray-300 leading-7 whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

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

                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Project Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                          <Briefcase size={20} className="text-purple-400" />
                        </div>
                        <div></div>
                      </div>
                    </div>

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

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                          <Calendar size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Deadline</p>
                          <p className="text-white font-medium mt-1">
                            {project.deadline || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                          <Send size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Proposals</p>
                          <p className="text-white font-medium mt-1">
                            {project.proposals || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4">
                    About the Client
                  </h3>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold mb-4">
                      {(project.companyName || "C").charAt(0).toUpperCase()}
                    </div>

                    <h4 className="text-white font-semibold text-lg">
                      {project.companyName || "Client"}
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">Project Client</p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSendProposal}
                    disabled={proposalSubmitted}
                    className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold transition ${
                      proposalSubmitted
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {proposalSubmitted ? (
                      <>
                        <CheckCircle size={18} />
                        Proposal Submitted
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Proposal
                      </>
                    )}
                  </button>
                  <p className="text-gray-500 text-xs text-center mt-3">
                    Submit your proposal to this client
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 mt-0">
          <div className="w-full max-w-2xl max-h-[100vh] mt-0 overflow-y-auto bg-[#180035] border border-white/10 rounded-2xl shadow-2xl shadow-white/30">
            <div className="flex items-center justify-center px-5 py-3 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold flex justify-center text-white">
                  Send Proposal
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Submit your offer for this project
                </p>
              </div>
            </div>

            {proposalSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
                  <CheckCircle size={38} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Proposal Submitted!
                </h3>
                <p className="text-gray-400 mt-2">
                  Your proposal has been sent to the client successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="p-5 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Coapany Name
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                    {project.companyName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Project
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                    {project.title}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-0 pb-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        name="bidAmount"
                        value={formData.bidAmount}
                        onChange={handleInputChange}
                        placeholder={`₹${Number(
                          project.budgetMin || 0,
                        ).toLocaleString(
                          "en-IN",
                        )} - ₹${Number(project.budgetMax || 0).toLocaleString("en-IN")}`}
                        min="1"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Delivery Time
                    </label>
                    <div className="relative">
                      <Clock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        placeholder={`${duration || "7"}`}
                        min="1"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-16 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        Days
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 ">
                    <label className="block text-sm font-medium text-gray-300 mb-2 mt-0">
                      Cover Letter
                    </label>
                    <button
                      type="button"
                      onClick={generateProposal}
                      disabled={generating}
                      className="flex items-center gap-2 rounded-xl
              bg-purple-600 px-4 py-2  text-white
    transition hover:bg-purple-700
    disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {generating ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}

                      {generating ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="500"
                    placeholder="Explain why you are the right freelancer for this project..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-purple-500 resize-none"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">
                      {formData.coverLetter.length}/500
                    </span>
                  </div>
                </div>

                {proposalError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 mt-0 mb-0 py-2.5 text-sm">
                    {proposalError}
                  </div>
                )}

                <div className="flex mt-0 flex-col sm:flex-row gap-3 ">
                  <button
                    type="button"
                    onClick={closeProposalModal}
                    disabled={proposalLoading}
                    className="w-full sm:w-1/3 border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={proposalLoading}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
                  >
                    {proposalLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Proposal
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Freelancerproposal;
