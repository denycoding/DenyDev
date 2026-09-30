import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IndianRupee,
  Clock,
  CalendarDays,
  Briefcase,
  CheckCircle2,
  MessageCircle,
  XCircle,
  User,
  CreditCard,
} from "lucide-react";
import Clientheader from "./Clientheader";
import API from "./API";

function ClientViewProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [actionError, setActionError] = useState("");
 
  // =====================================================
  // PAYMENT STATES
  // =====================================================

  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // =====================================================
  // FETCH PROJECT + PROPOSALS
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, proposalsRes] = await Promise.all([
          API.get(`/postjobs/${projectId}`),
          API.get(`/proposals/project/${projectId}`),
        ]);

        if (projectRes.data.success) {
          setProject(projectRes.data.project);
        }

        if (proposalsRes.data.success) {
          setProposals(proposalsRes.data.proposals);
        }
      } catch (error) {
        console.log("Fetch Client Project Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // =====================================================
  // ACCEPT PROPOSAL 
  // =====================================================

  const handleAccept = async (proposalId) => {
    setActionError("");
    setAcceptingId(proposalId);

    try {
      const res = await API.patch(`/proposals/${proposalId}/accept`);

      if (res.data.success) {
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId
              ? { ...p, status: "accepted" }
              : { ...p, status: "rejected" }
          )
        );

        // Open payment after accepting proposal
        setShowPayment(true);
      }
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to accept proposal."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  // =====================================================
  // DEMO PAYMENT
  // =====================================================

  const handleDemoPayment = async () => {
    if (!acceptedProposal) return;

    try {
      setPaymentLoading(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate fake transaction ID
      const demoTransactionId =
        "DEMO_TXN_" +
        Date.now() +
        "_" +
        Math.floor(1000 + Math.random() * 9000);

      setTransactionId(demoTransactionId);
       setPaymentSuccess(true);

      // Start project after successful payment
      setProject((prev) => ({
        ...prev,
        status: "in-progress",
      }));
    } catch (error) {
      console.error("Demo Payment Error:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  // =====================================================
  // REJECT PROPOSAL
  // =====================================================

  const handleReject = async (proposalId) => {
    setActionError("");
    setRejectingId(proposalId);

    try {
      const res = await API.patch(`/proposals/${proposalId}/reject`);

      if (res.data.success) {
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId ? { ...p, status: "rejected" } : p
          )
        );
      }
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to reject proposal."
      );
    } finally {
      setRejectingId(null);
    }
  };

  // =====================================================
  // CHAT WITH FREELANCER
  // =====================================================

  const handleChat = (freelancerId) => {
    if (!freelancerId) {
      console.log("Freelancer ID not found");
      return;
    }

    navigate(`/clientmessages/${freelancerId}`);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002b] text-white">
        <Clientheader />

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
        <Clientheader />

        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-3">
            Project not found
          </h2>

          <button
            type="button"
            onClick={() => navigate("/clientproject")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg transition"
          >
            Back to My Projects
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROJECT STATUS
  // =====================================================

  const projectHasAcceptedProposal = proposals.some(
    (p) => p.status === "accepted"
  );

  const acceptedProposal = proposals.find(
    (p) => p.status === "accepted"
  );

  // =====================================================
  // DURATION
  // =====================================================

  const duration = String(project.deadline || "")
    .replace(/days?/gi, "")
    .trim();

  // =====================================================
  // SORTED PROPOSALS
  // =====================================================

  const sortedProposals = [...proposals].sort((a, b) => {
    const rank = {
      accepted: 0,
      pending: 1,
      rejected: 2,
    };

    const rankA = rank[a.status] ?? 1;
    const rankB = rank[b.status] ?? 1;

    return rankA - rankB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      <Clientheader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate("/clientprojects")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to My Projects
        </button>

        {/* PROJECT CARD */}

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

          {/* =====================================================
              PROJECT HEADER
          ===================================================== */}

          <div className="p-6 sm:p-8 border-b border-white/10">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

              {/* PROJECT TITLE */}

              <div>
                <span className="inline-block bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  {project.category || "Project"}
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {project.title}
                </h1>

                <p className="text-gray-400 mt-3">
                  Posted by you
                </p>
              </div>

              {/* PROJECT STATUS */}

              <div className="flex w-full lg:w-4/12 flex-col gap-3">

                {projectHasAcceptedProposal ? (
                  <>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">

                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={20}
                          className="text-green-400"
                        />

                        <h3 className="font-semibold text-green-400">
                          Freelancer Hired
                        </h3>
                      </div>

                      <p className="text-gray-300 text-sm mt-2 leading-6">
                        You have accepted a freelancer for this project.
                      </p>

                    </div>

                    {/* ACCEPTED FREELANCER ACTIONS */}

                    {acceptedProposal && (
                      <div className="flex flex-col gap-3">

                        <div className="flex items-center gap-2">

                          {/* VIEW PROFILE */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/freelancer/${acceptedProposal.freelancerId?._id}`
                              )
                            }
                            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition"
                          >
                            <User size={16} />
                            View Profile
                          </button>

                          {/* CHAT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleChat(
                                acceptedProposal.freelancerId?._id
                              )
                            }
                            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
                          >
                            <MessageCircle size={18} />

                            Chat with{" "}
                            {acceptedProposal.freelancerId?.fullName ||
                              "Freelancer"}
                          </button>

                        </div>

                        {/* PAYMENT BUTTON */}

                        {!paymentSuccess && (
                          <button
                            type="button"
                            onClick={() => setShowPayment(true)}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                          >
                            <CreditCard size={18} />

                            Pay ₹
                            {Number(
                              acceptedProposal.bidAmount || 0
                            ).toLocaleString("en-IN")}
                          </button>
                        )}

                        {/* PAID STATUS */}

                        {paymentSuccess && (
                          <div className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 py-3 rounded-xl font-semibold">
                            <CheckCircle2 size={18} />
                            Payment Completed
                          </div>
                        )}

                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">

                    <div className="flex items-center gap-2">

                      <Clock
                        size={20}
                        className="text-yellow-400"
                      />

                      <h3 className="font-semibold text-yellow-400">
                        Hiring in Progress
                      </h3>

                    </div>

                    <p className="text-gray-300 text-sm mt-2 leading-6">
                      Review the proposals below and select the freelancer
                      you want to hire.
                    </p>

                  </div>
                )}

              </div>

            </div>
          </div>

          {/* =====================================================
              PROJECT INFORMATION
          ===================================================== */}

          <div className="p-6 sm:p-8">

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

            <div className="mb-10">

              <h2 className="text-xl font-bold text-white mb-4">
                Project Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* CATEGORY */}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-3">

                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Briefcase
                        size={20}
                        className="text-purple-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Category
                      </p>

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
                      <IndianRupee
                        size={20}
                        className="text-purple-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Project Budget
                      </p>

                      <p className="text-white font-medium mt-1">
                        ₹
                        {Number(
                          project.budgetMin || 0
                        ).toLocaleString("en-IN")}{" "}
                        - ₹
                        {Number(
                          project.budgetMax || 0
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                </div>

                {/* DURATION */}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-3">

                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Clock
                        size={20}
                        className="text-purple-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Duration
                      </p>

                      <p className="text-white font-medium mt-1">
                        {duration
                          ? `${duration} Days`
                          : "Not specified"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* DEADLINE */}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-3">

                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <CalendarDays
                        size={20}
                        className="text-purple-400"
                      />
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Deadline
                      </p>

                      <p className="text-white font-medium mt-1">
                        {project.deadline || "Not specified"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                PROPOSALS SECTION
            ===================================================== */}

            <div className="border-t border-white/10 pt-8">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold text-white">
                  Proposals
                </h2>

                <span className="bg-purple-500/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {proposals.length}
                </span>

              </div>

              {/* ACTION ERROR */}

              {actionError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm mb-5">
                  {actionError}
                </div>
              )}

              {/* NO PROPOSALS */}

              {proposals.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">

                  <p className="text-gray-400 text-center">
                    No proposals received yet.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {sortedProposals.map((p) => {

                    const isLocked =
                      projectHasAcceptedProposal &&
                      p.status !== "accepted";

                    return (
                      <div
                        key={p._id}
                        className={`group relative overflow-hidden bg-gradient-to-br from-[#1a0b35] via-[#16082d] to-[#10002b] border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,0,0,0.35)] ${
                          p.status === "accepted"
                            ? "border-green-400/40"
                            : p.status === "rejected"
                              ? "border-red-400/20"
                              : "border-purple-400/15 hover:border-purple-400/40"
                        } ${
                          isLocked
                            ? "opacity-40 pointer-events-none"
                            : ""
                        }`}
                      >

                        {/* FREELANCER INFO */}

                        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">

                          <div>

                            <h3 className="font-semibold text-lg text-white">
                              {p.freelancerId?.fullName ||
                                "Freelancer"}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              Freelancer Proposal
                            </p>

                          </div>

                          <div className="flex items-center gap-1 text-white font-bold">

                            <IndianRupee size={16} />

                            {Number(
                              p.bidAmount || 0
                            ).toLocaleString("en-IN")}

                          </div>

                        </div>

                        {/* COVER LETTER */}

                        <p className="text-gray-300 text-sm leading-6 mb-4">
                          {p.coverLetter}
                        </p>

                        {/* DELIVERY */}

                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">

                          <Clock size={14} />

                          {p.deliveryTime} days delivery

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-white/10">

                          {/* STATUS */}

                          <div>

                            {p.status === "accepted" && (
                              <span className="flex items-center gap-1 text-green-400 text-sm font-medium">

                                <CheckCircle2 size={16} />

                                Accepted

                              </span>
                            )}

                            {p.status === "rejected" && (
                              <span className="flex items-center gap-1 text-gray-500 text-sm">

                                <XCircle size={16} />

                                Rejected

                              </span>
                            )}

                            {p.status !== "accepted" &&
                              p.status !== "rejected" && (
                                <span className="text-yellow-400 text-sm">
                                  Pending
                                </span>
                              )}

                          </div>

                          {/* BUTTONS */}

                          <div className="flex items-center gap-2">

                            {/* ACCEPTED */}

                            {p.status === "accepted" && (
                              <div className="flex items-center gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/freelancer/${p.freelancerId?._id}`
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition"
                                >
                                  <User size={16} />
                                  View Profile
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleChat(
                                      p.freelancerId?._id
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 border border-white/10 rounded-lg text-sm font-medium transition"
                                >
                                  <MessageCircle size={16} />
                                  Chat
                                </button>

                                {/* PAY AGAIN / PAYMENT */}

                                {!paymentSuccess && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPayment(true)
                                    }
                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 border border-green-500/30 rounded-lg text-sm font-medium transition"
                                  >
                                    <CreditCard size={16} />
                                    Pay
                                  </button>
                                )}

                              </div>
                            )}

                            {/* REJECT + ACCEPT */}

                            {p.status !== "accepted" &&
                              p.status !== "rejected" &&
                              !projectHasAcceptedProposal && (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      rejectingId === p._id
                                    }
                                    onClick={() =>
                                      handleReject(p._id)
                                    }
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 border border-white/10 rounded-lg text-sm font-medium transition"
                                  >
                                    <XCircle size={16} />

                                    {rejectingId === p._id
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      acceptingId === p._id
                                    }
                                    onClick={() =>
                                      handleAccept(p._id)
                                    }
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition"
                                  >
                                    {acceptingId === p._id
                                      ? "Accepting..."
                                      : "Accept"}
                                  </button>
                                </>
                              )}

                            {/* POSITION FILLED */}

                            {isLocked && (
                              <span className="text-gray-500 text-xs">
                                Position filled
                              </span>
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          DEMO PAYMENT MODAL
      ===================================================== */}

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-[#1a0b35] border border-white/10 rounded-2xl shadow-2xl p-6">

            {!paymentSuccess ? (
              <>
                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-xl font-bold text-white">
                      Demo Payment
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Secure checkout
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle size={22} />
                  </button>

                </div>

                {/* AMOUNT */}

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">

                  <p className="text-gray-400 text-sm">
                    Payment to freelancer
                  </p>

                  <div className="flex items-center gap-1 mt-2">

                    <IndianRupee
                      size={24}
                      className="text-green-400"
                    />

                    <span className="text-3xl font-bold text-white">
                      {Number(
                        acceptedProposal?.bidAmount || 0
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>

                  <p className="text-gray-500 text-xs mt-2">
                    {acceptedProposal?.freelancerId?.fullName ||
                      "Freelancer"}
                  </p>

                </div>

                {/* FAKE CARD */}

                <div className="space-y-4">

                  <div>

                    <label className="text-sm text-gray-300">
                      Card Number
                    </label>

                    <input
                      type="text"
                      value="4242 4242 4242 4242"
                      readOnly
                      className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none"
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <label className="text-sm text-gray-300">
                        Expiry
                      </label>

                      <input
                        type="text"
                        value="12/28"
                        readOnly
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none"
                      />

                    </div>

                    <div>

                      <label className="text-sm text-gray-300">
                        CVV
                      </label>

                      <input
                        type="text"
                        value="123"
                        readOnly
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none"
                      />

                    </div>

                  </div>

                </div>

                {/* DEMO NOTICE */}

              

                {/* PAY BUTTON */}

                <button
                  type="button"
                  onClick={handleDemoPayment}
                  disabled={paymentLoading}
                  className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
                >
                  {paymentLoading
                    ? "Processing Payment..."
                    : `Pay ₹${Number(
                        acceptedProposal?.bidAmount || 0
                      ).toLocaleString("en-IN")}`}
                </button>

              </>
            ) : (

              /* =================================================
                 PAYMENT SUCCESS
              ================================================= */

              <div className="text-center py-5">

                <div className="w-16 h-16 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">

                  <CheckCircle2
                    size={32}
                    className="text-green-400"
                  />

                </div>

                <h2 className="text-2xl font-bold text-white mt-5">
                  Payment Successful
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  Your payment has been processed successfully.
                </p>

                {/* TRANSACTION DETAILS */}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6 text-left">

                  <div className="flex justify-between mb-3">

                    <span className="text-gray-400 text-sm">
                      Amount
                    </span>

                    <span className="text-white font-semibold">
                      ₹
                      {Number(
                        acceptedProposal?.bidAmount || 0
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div>

                    <p className="text-gray-400 text-xs">
                      Transaction ID
                    </p>

                    <p className="text-white text-xs font-mono mt-1 break-all">
                      {transactionId}
                    </p>

                  </div>

                  <div className="flex justify-between mt-3">

                    <span className="text-gray-400 text-sm">
                      Status
                    </span>

                    <span className="text-green-400 text-sm font-semibold">
                      Paid
                    </span>

                  </div>

                </div>

                <p className="text-blue-300 text-xs mt-5">
                  Demo payment only — no real money was charged.
                </p>

                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Continue
                </button>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default ClientViewProject;