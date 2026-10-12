import { FaHome } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./API";
import { Sparkles, LoaderCircle } from "lucide-react";

function PostJob() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [, setDescription] = useState("");

  // -----------------------------------------
  // Get logged-in client
  // -----------------------------------------

  // -----------------------------------------
  // Job form state
  // -----------------------------------------

  const [job, setJob] = useState({
    title: "",
    companyName: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
  });

  // -----------------------------------------
  // Handle input changes
  // -----------------------------------------

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------------------
  // Submit job
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatTitle = (text) => {
      return text
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
    try {
      // -----------------------------------------
      // Check login
      // -----------------------------------------

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login as a client first.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      // -----------------------------------------
      // Get client ID
      // -----------------------------------------

      const clientId = user.id || user._id;

      if (!clientId) {
        alert("Client information not found. Please login again.");
        return;
      }

      // -----------------------------------------
      // Check client role
      // -----------------------------------------

      if (user.role !== "client") {
        alert("Only clients can post jobs.");
        return;
      }

      // -----------------------------------------
      // Validate budget
      // -----------------------------------------

      if (Number(job.budgetMin) > Number(job.budgetMax)) {
        alert("Minimum budget cannot be greater than maximum budget.");
        return;
      }

      // -----------------------------------------
      // Project data
      // -----------------------------------------

      const projectData = {
        title: formatTitle(job.title),
        companyName: formatTitle(job.companyName),
        description: job.description.trim(),

        budgetMin: Number(job.budgetMin),
        budgetMax: Number(job.budgetMax),

        deadline: job.deadline.trim(),
      };

      // -----------------------------------------
      // Debug
      // -----------------------------------------

      console.log("Project Data:", projectData);

      // -----------------------------------------
      // Send data to backend
      // -----------------------------------------

      const res = await Api.post("/postjob", projectData);

      console.log("Post Job Response:", res.data);

      // -----------------------------------------
      // Success
      // -----------------------------------------

      if (res.data.success) {
        alert("Job Posted Successfully 🚀");

        // Clear form
        setJob({
          title: "",
          companyName: "",
          description: "",
          budgetMin: "",
          budgetMax: "",
          deadline: "",
        });

        // Go to client dashboard
        navigate("/clientdashboard");
      } else {
        alert(res.data.message || "Job Posting Failed");
      }
    } catch (error) {
      console.error("Post Job Error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while posting the job",
      );
    }
  };

  const generateDescription = async () => {
    if (!job.title.trim()) {
      alert("Please enter a project title first");
      return;
    }

    try {
      setGenerating(true);

      const response = await Api.post("/generate-description", {
        title: job.title,
        companyName: job.companyName,
      });

      setJob((prevJob) => ({
        ...prevJob,
        description: response.data.description,
      }));
    } catch (error) {
      console.error(
        "AI generation failed:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "Unable to generate description. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-[#10002b] flex items-center justify-center p-3 xs:p-4 sm:p-6 relative">
      {/* Home Button */}

      <button
        onClick={() => navigate("/clientdashboard")}
        className="absolute top-3 left-3 sm:top-6 sm:left-6 p-2 z-10"
      >
        <FaHome
          className="text-white hover:text-purple-400 transition"
          size={28}
        />
      </button>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mt-14 sm:mt-10 md:mt-0"
      >
        {/* Heading */}

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Post a Job
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Tell freelancers what you need and get proposals
        </p>

        {/* =====================================================
            PROJECT TITLE
        ===================================================== */}

        <div className="mb-4">
          <label className="block font-medium text-sm mb-2">
            Project Title
          </label>

          <input
            type="text"
            name="title"
            value={job.title}
            placeholder="Example: E-Commerce Website"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* =====================================================
            COMPANY NAME
        ===================================================== */}

        <div className="mb-4">
          <label className="block font-medium text-sm mb-2">
            Company / Organization
          </label>

          <input
            type="text"
            name="companyName"
            value={job.companyName}
            placeholder="Example: ABC Technologies"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* =====================================================
            PROJECT DESCRIPTION
        ===================================================== */}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 ">
            <label className="block font-medium text-sm mb-2">
              Project Description
            </label>

            <button
              type="button"
              onClick={generateDescription}
              disabled={generating}
              className="flex items-center gap-2 rounded-xl
    bg-purple-600 px-5 py-3 font-semibold text-white
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
            name="description"
            value={job.description}
            onChange={handleChange}
            placeholder="Describe your project..."
            rows={5}
            required
            className="w-full rounded-xl border border-gray-300
    bg-[#180035] p-4 text-white outline-none
    focus:border-purple-400"
          />
        </div>

        {/* =====================================================
            BUDGET
        ===================================================== */}

        <div className="mb-4">
          <label className="block font-medium text-sm mb-2">Budget Range</label>

          <div className="flex items-center gap-2">
            {/* Minimum Budget */}

            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                ₹
              </span>

              <input
                type="number"
                name="budgetMin"
                value={job.budgetMin}
                placeholder="5,000"
                min="1"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 pl-8 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <span className="text-gray-500 font-medium">-</span>

            {/* Maximum Budget */}

            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                ₹
              </span>

              <input
                type="number"
                name="budgetMax"
                value={job.budgetMax}
                placeholder="20,000"
                min="1"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 pl-8 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            DEADLINE
        ===================================================== */}

        <div className="mb-6">
          <label className="block font-medium text-sm mb-2">
            Project Deadline
          </label>

          <input
            type="text"
            name="deadline"
            value={job.deadline}
            placeholder="Example: 20 Days"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* =====================================================
            SUBMIT
        ===================================================== */}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}

export default PostJob;
