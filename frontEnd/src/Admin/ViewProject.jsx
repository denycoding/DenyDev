import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Copy,
  FileText,
  LoaderCircle,
  MessageSquareText,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Adminheader from "./Adminheader";
import API from "../API";

const STATUS_STYLES = {
  open: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "in-progress": "border-sky-400/30 bg-sky-400/10 text-sky-300",
  completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  closed: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatBudget = (amount) => {
  if (amount == null || amount === "") return "N/A";

  const value = Number(amount);

  return Number.isFinite(value) ? `₹${value.toLocaleString("en-IN")}` : "N/A";
};

function DetailCard({ icon: Icon, label, value, onCopy }) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "N/A"
      : String(value);

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:bg-white/[0.06]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="rounded-lg bg-purple-500/15 p-2 text-purple-300">
            <Icon size={16} />
          </span>
          {label}
        </div>

        {onCopy && displayValue !== "N/A" && (
          <button
            type="button"
            onClick={() => onCopy(displayValue)}
            title={`Copy ${label}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <Copy size={14} />
          </button>
        )}
      </div>

      <p className="break-words text-sm font-semibold leading-6 text-white">
        {displayValue}
      </p>
    </div>
  );
}

function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [toast, setToast] = useState("");

  // Fetch project details
  useEffect(() => {
    let active = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/admin/projects/${id}`);

        if (!active) return;

        if (res.data?.success && res.data.project) {
          setProject(res.data.project);
        } else {
          setProject(null);
          setError("Project not found.");
        }
      } catch (err) {
        if (!active) return;

        console.error("Fetch project error:", err);

        setError(
          err.response?.data?.message || "Failed to load project details.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProject();

    return () => {
      active = false;
    };
  }, [id]);

  // Automatically dismiss toast notifications
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // Copy text to clipboard
  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(String(value));
      setToast("Copied to clipboard!");
    } catch {
      setToast("Unable to copy. Please copy manually.");
    }
  };

  // Delete project
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      const res = await API.delete(`/admin/projects/${id}`);

      if (res.data?.success) {
        setShowDeleteModal(false);
        setToast("Project deleted successfully!");

        setTimeout(() => {
          navigate("/admin/projects");
        }, 700);
      } else {
        setError(res.data?.message || "Failed to delete project.");
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error("Delete project error:", err);

      setError(err.response?.data?.message || "Failed to delete project.");

      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const status = String(project?.status || "open").toLowerCase();

  const statusLabel = status
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const description = project?.description || "No description provided.";

  const tabs = [
    { id: "overview", label: "Overview", icon: BriefcaseBusiness },
    { id: "description", label: "Description", icon: FileText },
    { id: "client", label: "Client Details", icon: UserRound },
  ];

  // Loading screen
  if (loading) {
    return (
      <>
        <Adminheader />

        <main className="flex min-h-screen items-center justify-center bg-[#10002b] px-4 text-white">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-[#180035] px-10 py-12 shadow-2xl">
            <LoaderCircle className="animate-spin text-purple-300" size={38} />

            <h2 className="font-semibold">Loading project details...</h2>

            <p className="text-sm text-slate-400">Please wait a moment.</p>
          </div>
        </main>
      </>
    );
  }

  // Project not found
  if (!project) {
    return (
      <>
        <Adminheader />

        <main className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] px-4 py-12 text-white">
          <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#180035] p-8 text-center shadow-2xl">
            <BriefcaseBusiness
              size={40}
              className="mx-auto mb-5 text-purple-300"
            />

            <h1 className="text-2xl font-bold">Project unavailable</h1>

            <p className="mt-3 text-sm text-slate-400">
              {error || "This project could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/projects")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
            >
              <ArrowLeft size={17} />
              Back to Projects
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Adminheader />

      <main className="min-h-screen bg-gradient-to-br from-[#10002b] via-[#16002f] to-[#240046] px-4 py-7 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin/projects")}
                className="mb-4 inline-flex items-center gap-2 text-sm text-purple-300 transition hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to all projects
              </button>

              <div className="flex items-center gap-3">
                <span className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-3 text-purple-200">
                  <BriefcaseBusiness size={24} />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                    Admin Workspace / Projects
                  </p>

                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {project.title || "Untitled Project"}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(project._id)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
              >
                <Copy size={16} />
                Copy Project ID
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
              >
                <Trash2 size={16} />
                Delete Project
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="rounded-lg p-1 hover:bg-red-500/20"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Project hero */}
          <section className="relative mb-6 overflow-hidden rounded-3xl border border-purple-300/15 bg-gradient-to-br from-[#2a0752] via-[#210044] to-[#180035] p-6 shadow-xl sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      STATUS_STYLES[status] ||
                      "border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {statusLabel}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                    ID: {String(project._id || "").slice(-8) || "N/A"}
                  </span>
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {project.companyName || "Independent Client"}
                </h2>

                <p className="mt-2 max-w-2xl leading-7 text-slate-300">
                  {description.length > 180
                    ? `${description.slice(0, 180).trim()}…`
                    : description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[340px]">
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                    <CircleDollarSign size={16} className="text-emerald-300" />
                    Budget Range
                  </div>

                  <p className="text-lg font-bold">
                    {formatBudget(project.budgetMin)}
                  </p>
                  <p className="text-center">-</p>
                  <p className="text-lg font-bold">
                    {formatBudget(project.budgetMax)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                    <MessageSquareText size={16} className="text-sky-300" />
                    Proposals
                  </div>

                  <p className="text-2xl font-bold">{project.proposals ?? 0}</p>

                  <p className="mt-1 text-xs text-slate-400">Received so far</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick information cards */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Project Type",
                value: project.projectType || "Not specified",
                icon: BriefcaseBusiness,
              },
              {
                label: "Experience Level",
                value: project.experienceLevel || "Not specified",
                icon: ShieldCheck,
              },
              {
                label: "Duration",
                value: project.duration || "Not specified",
                icon: Clock3,
              },
              {
                label: "Posted On",
                value: formatDate(project.createdAt),
                icon: CalendarDays,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#180035]/80 p-4 transition hover:border-purple-400/30"
              >
                <div className="rounded-xl bg-purple-500/15 p-3 text-purple-200">
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Interactive tabs */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#180035]/90 shadow-xl">
            <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-2 sm:p-3">
              {tabs.map(({ id: tabId, label, icon: Icon }) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setActiveTab(tabId)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tabId
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-7">
              {/* Overview tab */}
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-xl font-bold">Project Information</h2>

                  <p className="mb-5 mt-1 text-sm text-slate-400">
                    Important project fields and assignment details.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <DetailCard
                      icon={Building2}
                      label="Company"
                      value={project.companyName}
                    />

                    <DetailCard
                      icon={BriefcaseBusiness}
                      label="Project Title"
                      value={project.title}
                    />

                    <DetailCard
                      icon={CalendarDays}
                      label="Deadline"
                      value={formatDate(project.deadline)}
                    />

                    <DetailCard
                      icon={CircleDollarSign}
                      label="Minimum Budget"
                      value={formatBudget(project.budgetMin)}
                    />

                    <DetailCard
                      icon={CircleDollarSign}
                      label="Maximum Budget"
                      value={formatBudget(project.budgetMax)}
                    />

                    <DetailCard
                      icon={CalendarDays}
                      label="Posted Date"
                      value={formatDate(project.createdAt)}
                    />

                    <DetailCard
                      icon={Users}
                      label="Proposal Count"
                      value={project.proposals ?? 0}
                    />

                    <DetailCard
                      icon={UserRound}
                      label="Assigned Freelancer ID"
                      value={project.assignedFreelancerId}
                      onCopy={copyToClipboard}
                    />

                    <DetailCard
                      icon={ShieldCheck}
                      label="Project Status"
                      value={statusLabel}
                    />
                  </div>
                </div>
              )}

              {/* Description tab */}
              {activeTab === "description" && (
                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">Project Description</h2>

                      <p className="mt-1 text-sm text-slate-400">
                        Full project brief provided by the client.
                      </p>
                    </div>

                    {description.length > 260 && (
                      <button
                        type="button"
                        onClick={() =>
                          setDescriptionExpanded((previous) => !previous)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-purple-200 transition hover:bg-white/5"
                      >
                        {descriptionExpanded ? "Show Less" : "Read Full Brief"}

                        <ChevronDown
                          size={16}
                          className={`transition ${
                            descriptionExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-5 sm:p-6">
                    <p className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-300">
                      {description.length > 260 && !descriptionExpanded
                        ? `${description.slice(0, 260).trim()}…`
                        : description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(description)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600/20 px-4 py-2.5 text-sm font-semibold text-purple-200 transition hover:bg-purple-600/30"
                  >
                    <Copy size={15} />
                    Copy Description
                  </button>
                </div>
              )}

              {/* Client tab */}
              {activeTab === "client" && (
                <div>
                  <h2 className="text-xl font-bold">Client Details</h2>

                  <p className="mb-5 mt-1 text-sm text-slate-400">
                    Client information linked to this project.
                  </p>

                  <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-gradient-to-r from-purple-500/[0.08] to-transparent p-5 sm:flex-row sm:items-center sm:p-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-500/15 text-purple-200">
                      <UserRound size={30} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Client Account
                      </p>

                      <h3 className="mt-1 break-words text-xl font-bold">
                        {project.clientName || "Client name unavailable"}
                      </h3>

                      <p className="mt-2 break-all text-sm text-slate-400">
                        ID: {project.clientId || "N/A"}
                      </p>
                    </div>

                    {project.clientId && (
                      <button
                        type="button"
                        onClick={() => navigate(`/client/${project.clientId}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
                      >
                        <UserRound size={16} />
                        View Client Profile
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailCard
                      icon={UserRound}
                      label="Client Name"
                      value={project.clientName}
                    />

                    <DetailCard
                      icon={Copy}
                      label="Client ID"
                      value={project.clientId}
                      onCopy={copyToClipboard}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <p className="mt-5 text-center text-xs text-slate-500">
            DenyDev Admin Workspace · Project Record Details
          </p>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-[#16002f] px-5 py-4 text-sm font-medium text-white shadow-2xl"
        >
          <Check size={18} className="shrink-0 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#1b0730] p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <Trash2 size={25} />
            </div>

            <h2 className="text-xl text-red-600 font-bold">
              Delete This Project?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              You're about to permanently delete{" "}
              <span className="font-semibold text-white">
                "{project.title || "Untitled Project"}"
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Delete Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewProject;
