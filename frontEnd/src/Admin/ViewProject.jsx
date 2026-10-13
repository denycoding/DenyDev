import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Adminheader from "./Adminheader";
import API from "../API";

function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // FETCH PROJECT DETAILS
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        // This endpoint must exist in your backend.
        const res = await API.get(`/admin/projects/${id}`);
        if (res.data.success) {
          setProject(res.data.project);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        console.error("Fetch project error:", err);
        setError(
          err.response?.data?.message || "Failed to load project details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // DELETE PROJECT
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      // This DELETE endpoint must exist in your backend.
      const res = await API.delete(`/admin/projects/${id}`);

      if (res.data.success) {
        alert("Project deleted successfully.");
        navigate("/admin/projects");
      } else {
        setError(res.data.message || "Failed to delete project.");
      }
    } catch (err) {
      console.error("Delete project error:", err);
      setError(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "N/A"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatBudget = (amount) =>
    amount == null || amount === ""
      ? "N/A"
      : `₹${Number(amount).toLocaleString("en-IN")}`;

  const Detail = ({ label, value }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="mb-2 text-sm text-gray-400">{label}</p>
      <p className="break-words font-medium text-white">{value ?? "N/A"}</p>
    </div>
  );

  const statusStyles = {
    open: "bg-yellow-500/20 text-yellow-300",
    "in-progress": "bg-blue-500/20 text-blue-300",
    completed: "bg-green-500/20 text-green-300",
    closed: "bg-red-500/20 text-red-300",
  };

  if (loading) {
    return (
      <>
        <Adminheader />
        <div className="min-h-screen bg-[#10002b] p-8 text-center text-gray-300">
          Loading project details...
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Adminheader />
        <div className="min-h-screen bg-[#10002b] p-6 text-white">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => navigate("/admin/projects")}
              className="mb-6 rounded-lg bg-purple-600 px-4 py-2 hover:bg-purple-700"
            >
              Back to Projects
            </button>

            <p className="text-red-400">{error || "Project not found."}</p>
          </div>
        </div>
      </>
    );
  }

  const status = String(project.status || "open").toLowerCase();

  return (
    <>
      <Adminheader />

      <main className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] px-4 py-8 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-purple-300">
                Admin / Projects / Project Details
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                {project.title || "Untitled Project"}
              </h1>

              <p className="mt-2 text-gray-400">
                Review all information about this project.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/admin/projects")}
                className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
              >
                Back
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          {/* PROJECT OVERVIEW */}
          <section className="mb-6 rounded-2xl border border-white/10 bg-[#180035] p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Project Overview</h2>

              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  statusStyles[status] || "bg-white/10 text-gray-300"
                }`}
              >
                {status
                  .replace("-", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Project Title" value={project.title} />
              <Detail label="Company" value={project.companyName} />
              <Detail label="Project Type" value={project.projectType} />
              <Detail
                label="Experience Level"
                value={project.experienceLevel}
              />
              <Detail label="Duration" value={project.duration} />
              <Detail
                label="Minimum Budget"
                value={formatBudget(project.budgetMin)}
              />
              <Detail
                label="Maximum Budget"
                value={formatBudget(project.budgetMax)}
              />
              <Detail label="Deadline" value={formatDate(project.deadline)} />
              <Detail label="Posted On" value={formatDate(project.createdAt)} />
              <Detail
                label="Number of Proposals"
                value={project.proposals ?? 0}
              />
              <Detail label="Client ID" value={project.clientId} />
              <Detail
                label="Assigned Freelancer ID"
                value={project.assignedFreelancerId}
              />
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="mb-6 rounded-2xl border border-white/10 bg-[#180035] p-5 sm:p-7">
            <h2 className="mb-4 text-xl font-semibold">Project Description</h2>

            <p className="whitespace-pre-wrap leading-7 text-gray-300">
              {project.description || "No description provided."}
            </p>
          </section>

          {/* CLIENT DETAILS */}
          <section className="mb-6 rounded-2xl border border-white/10 bg-[#180035] p-5 sm:p-7">
            <h2 className="mb-5 text-xl font-semibold">Client Details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Client Name" value={project.clientName} />
              <Detail label="Client ID" value={project.clientId} />
            </div>

            {project.clientId && (
              <button
                onClick={() => navigate(`/client/${project.clientId}`)}
                className="mt-5 rounded-lg bg-purple-600 px-5 py-2 hover:bg-purple-700"
              >
                View Client Profile
              </button>
            )}
          </section>

          {/* DELETE WARNING */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-gray-300">
            Deleting this project removes it from the platform. Make sure you
            have selected the correct project before confirming deletion.
          </div>
        </div>
      </main>
    </>
  );
}

export default ViewProject;
