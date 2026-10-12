import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import Freelancerheader from "./Freelancerheader";
import API from "./API";

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-300",
  accepted: "bg-green-500/20 text-green-300",
  rejected: "bg-red-500/20 text-red-300",
  completed: "bg-red-500/20 text-red-300",
};

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};

function Freelancerproject() {
  const freelancer = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchMyProposals = async () => {
      const freelancerId = freelancer?._id || freelancer?.id;

      if (!freelancerId) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/proposals/freelancer/${freelancerId}`);

        if (res.data.success) {
          setProposals(res.data.proposals);
        }
      } catch (error) {
        console.log("Fetch My Proposals Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProposals();
  }, []);

  const totalProjects = proposals.length;
  const activeCount = proposals.filter((p) => p.status === "pending").length;
  const acceptedCount = proposals.filter((p) => p.status === "accepted").length;
  const rejectedCount = proposals.filter((p) => p.status === "rejected").length;
  const completeedCount = proposals.filter((p) => p.status === "completed").length;

  const tabs = ["All", "Pending", "Accepted", "Rejected", "Completed"];

  const filteredProposals = proposals.filter((p) => {
    const text = searchText.toLowerCase().trim();

    const matchesSearch =
      !text ||
      p.projectId?.title?.toLowerCase().includes(text) ||
      p.projectId?.category?.toLowerCase().includes(text) ||
      p.clientId?.fullName?.toLowerCase().includes(text);

    const matchesTab =
      activeTab === "All" ||
      p.status?.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      <Freelancerheader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">My Projects</h1>
          <p className="text-purple-200 text-base sm:text-lg">
            Manage and track your freelance proposals
          </p>
        </div>

        {/* Statistics — all real, derived from actual proposal statuses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">Total Proposals</p>
            <h2 className="text-3xl font-bold">{totalProjects}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">Pending</p>
            <h2 className="text-3xl font-bold">{activeCount}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">Accepted</p>
            <h2 className="text-3xl font-bold">{acceptedCount}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">Rejected</p>
            <h2 className="text-3xl font-bold">{rejectedCount}</h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none text-white placeholder-purple-300 focus:border-purple-500"
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            <SlidersHorizontal size={18} />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full transition ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-200 hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-purple-200 text-center py-10">
            Loading your proposals...
          </p>
        )}

        {!loading && filteredProposals.length === 0 && (
          <p className="text-purple-200 text-center py-10">
            {activeTab === "All" && !searchText
              ? "You haven't sent any proposals yet."
              : "No proposals found for this filter."}
          </p>
        )}

        {/* Project Cards */}
        {!loading && filteredProposals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProposals.map((p) => (
              <div
                key={p._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.14] transition"
              >
                {/* Card Top */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold">
                      {p.projectId?.title || "Project removed"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="text-purple-300 hover:text-white"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Client */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-semibold">
                    {(p.clientId?.fullName || "C").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium">
                      {p.clientId?.fullName || "Client"}
                    </p>
                  </div>
                </div>

                {/* Your Bid and Deadline */}
                <div className="flex justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-purple-300" />
                    <div>
                      <p className="text-xs text-purple-300">Your Bid</p>
                      <p className="font-semibold">
                        ₹{Number(p.bidAmount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-purple-300" />
                    <div>
                      <p className="text-xs text-purple-300">Deadline</p>
                      <p className="font-semibold">
                        {p.projectId?.deadline || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[p.status] || "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {STATUS_LABELS[p.status] || p.status}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      p.status === "accepted" &&
                      p.projectId?._id &&
                      navigate(`/freelancerproject/${p.projectId._id}`)
                    }
                    disabled={p.status !== "accepted" || !p.projectId?._id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      p.status === "accepted"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-900/50 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Freelancerproject;
