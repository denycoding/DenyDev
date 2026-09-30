import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./API";

import {
  User,
  Mail,
  MapPin,
  LogOut,
  Phone,
  Globe,
  Calendar,
  Edit3,
  Save,
  X,
  Building2,
  DollarSign,
  FolderKanban,
  CheckCircle,
  Clock,
} from "lucide-react";

import { FaHome } from "react-icons/fa";

function ClientProfile() {
  const navigate = useNavigate();

  // =========================================================
  // LOGGED-IN USER
  // =========================================================

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [editMode, setEditMode] = useState(false);

  // Used to restore old data when Cancel is clicked
  const [originalFormData, setOriginalFormData] = useState(null);

  // Profile created date
  const [createdAt, setCreatedAt] = useState(null);

  // =========================================================
  // CLIENT PROFILE DATA
  // =========================================================

  const [formData, setFormData] = useState({
    name: user?.name || user?.fullName || "",
    email: user?.email || "",

    phone: "",
    location: "",

    companyName: "",
    companyWebsite: "",

    clientType: "",
    industry: "",

    about: "",

    preferredBudget: "",
    hiringStatus: "",
  });

  // =========================================================
  // FETCH CLIENT PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      const clientId = user?._id || user?.id;

      if (!clientId) {
        console.log("Client ID not found");
        return;
      }

      try {
        const res = await Api.get(`/clientprofile/${clientId}`);

        if (res.data.success && res.data.profile) {
          const profileData = res.data.profile;

          const updatedData = {
            name: profileData.clientName || user?.name || user?.fullName || "",

            email: profileData.email || user?.email || "",

            phone: profileData.phone || "",

            location: profileData.location || "",

            companyName: profileData.companyName || "",

            companyWebsite: profileData.website || "",

            clientType: profileData.clientType || "",

            industry: profileData.industry || "",

            preferredBudget: profileData.preferredBudget || "",

            hiringStatus: profileData.hiringStatus || "",

            about: profileData.aboutCompany || "",
          };

          setFormData(updatedData);

          setOriginalFormData(updatedData);

          setCreatedAt(profileData.createdAt || null);
        }
      } catch (error) {
        console.log("Fetch Client Profile Error:", error);

        // If profile does not exist yet,
        // default data from localStorage will remain.
      }
    };

    fetchProfile();
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // START EDITING
  // =========================================================

  const handleEdit = () => {
    // Store current data before editing
    setOriginalFormData({ ...formData });

    setEditMode(true);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    const clientId = user?._id || user?.id;

    // Check client ID
    if (!clientId) {
      alert("Client ID not found. Please login again.");
      return;
    }

    const data = {
      clientId,

      image: user?.image || "",

      // Personal Details
      clientName: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,

      // Company Details
      companyName: formData.companyName,
      website: formData.companyWebsite,

      // Client Information
      clientType: formData.clientType,
      industry: formData.industry,
      preferredBudget: formData.preferredBudget,
      hiringStatus: formData.hiringStatus,

      // About
      aboutCompany: formData.about,
    };

    console.log("Saving Client Profile:", data);

    try {
      const res = await Api.post("/clientprofile", data);

      if (res.data.success) {
        const profile = res.data.profile;

        // Update frontend with actual backend data
        const updatedData = {
          name: profile.clientName || user?.name || user?.fullName || "",

          email: profile.email || user?.email || "",

          phone: profile.phone || "",

          location: profile.location || "",

          companyName: profile.companyName || "",

          companyWebsite: profile.website || "",

          clientType: profile.clientType || "",

          industry: profile.industry || "",

          preferredBudget: profile.preferredBudget || "",

          hiringStatus: profile.hiringStatus || "",

          about: profile.aboutCompany || "",
        };

        setFormData(updatedData);

        setOriginalFormData(updatedData);

        setCreatedAt(profile.createdAt || createdAt);

        setEditMode(false);

        alert("Profile Updated Successfully 🚀");
      } else {
        alert(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.log("Save Client Profile Error:", error);

      alert(error?.response?.data?.message || "Failed to update profile");
    }
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {
    // Restore previous data
    if (originalFormData) {
      setFormData({
        ...originalFormData,
      });
    }

    setEditMode(false);
  };

  // =========================================================
  // GET JOINED DATE
  // =========================================================

  const getJoinedDate = () => {
    if (!createdAt) {
      return "Joined after registration";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Joined after registration";
    }

    return `Joined ${date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    })}`;
  };

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputClass =
    "w-full bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none placeholder-gray-500 disabled:opacity-70 transition";

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#10002b]
        via-[#18003b]
        to-[#240046]
        text-white
        px-4
        sm:px-6
        lg:px-10
        py-8
      "
    >
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex items-center justify-between gap-5 mb-8">
        {/* LEFT SIDE */}

        <div className="flex items-center gap-5">
          {/* HOME BUTTON */}

          <button
            onClick={() => navigate("/clientdashboard")}
            className="
              w-11
              h-11
              flex
              items-center
              justify-center
              rounded-xl
              bg-white/10
              border
              border-white/10
              hover:bg-purple-600
              transition
            "
            title="Client Dashboard"
          >
            <FaHome size={20} />
          </button>

          {/* TITLE */}

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Client Profile</h1>

            <p className="text-gray-400 text-sm mt-1">
              Manage your personal and professional client information.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-3">
          {/* EDIT / SAVE */}

          {!editMode ? (
            <button
              onClick={handleEdit}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-purple-600
                hover:bg-purple-500
                px-4
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-green-500
                hover:bg-green-600
                px-4
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              <Save size={17} />
              Save Changes
            </button>
          )}

          {/* CANCEL */}

          {editMode && (
            <button
              onClick={handleCancel}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-white/10
                hover:bg-white/20
                border
                border-white/10
                px-4
                py-2.5
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              <X size={17} />
              Cancel
            </button>
          )}

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              flex
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
              transition
            "
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* PROFILE HERO */}
      {/* ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#1a0638]
          via-[#21094a]
          to-[#2d0b5c]
          border
          border-purple-400/20
          rounded-3xl
          p-6
          sm:p-8
          shadow-2xl
          mb-8
        "
      >
        {/* Background Glow */}

        <div
          className="
            absolute
            -top-24
            -right-24
            w-64
            h-64
            bg-purple-600/20
            rounded-full
            blur-3xl
          "
        />

        <div className="relative flex flex-col lg:flex-row gap-8 items-start">
          {/* ================================================= */}
          {/* PROFILE IMAGE */}
          {/* ================================================= */}

          <div className="relative">
            <div
              className="
                w-32
                h-32
                sm:w-36
                sm:h-36
                rounded-3xl
                overflow-hidden
                border-4
                border-purple-400/40
                shadow-2xl
              "
            >
              <img
                src={
                  user?.image ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Client Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online Status */}

            <span
              className="
                absolute
                bottom-2
                right-2
                w-5
                h-5
                bg-green-400
                border-4
                border-[#21094a]
                rounded-full
              "
            />
          </div>

          {/* ================================================= */}
          {/* PROFILE INFORMATION */}
          {/* ================================================= */}

          <div className="flex-1">
            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-start
                justify-between
                gap-4
              "
            >
              <div>
                {/* Name */}

                <h2 className="text-2xl sm:text-3xl font-bold">
                  {formData.name || "Client Name"}
                </h2>

                {/* Client Type */}

                <p className="text-purple-300 mt-1 font-medium">
                  {formData.clientType || "Client"}
                </p>

                {/* Location */}

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <MapPin size={15} />

                    {formData.location || "Location not added"}
                  </span>

                  <span className="flex items-center gap-2">
                    <Calendar size={15} />

                    {getJoinedDate()}
                  </span>
                </div>
              </div>

              {/* Hiring Status */}

              <span
                className="
                  self-start
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  text-xs
                  font-semibold
                  border
                  bg-purple-400/10
                  text-purple-300
                  border-purple-400/20
                "
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />

                {formData.hiringStatus || "Hiring Status Not Set"}
              </span>
            </div>

            {/* ================================================= */}
            {/* CLIENT STATS */}
            {/* ================================================= */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
              {/* Total Projects */}

              <div
                className="
                  bg-black/20
                  border
                  border-white/10
                  rounded-xl
                  p-4
                "
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <FolderKanban size={15} />

                  <span className="text-xs">Projects Posted</span>
                </div>

                <p className="text-xl font-bold mt-1">0</p>
              </div>

              {/* Completed */}

              <div
                className="
                  bg-black/20
                  border
                  border-white/10
                  rounded-xl
                  p-4
                "
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle size={15} className="text-green-400" />

                  <span className="text-xs">Completed</span>
                </div>

                <p className="text-xl font-bold mt-1">0</p>
              </div>

              {/* Active */}

              <div
                className="
                  bg-black/20
                  border
                  border-white/10
                  rounded-xl
                  p-4
                "
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={15} />

                  <span className="text-xs">Active</span>
                </div>

                <p className="text-xl font-bold mt-1">0</p>
              </div>

              {/* Total Spent */}

              <div
                className="
                  bg-black/20
                  border
                  border-white/10
                  rounded-xl
                  p-4
                "
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign size={15} />

                  <span className="text-xs">Total Spent</span>
                </div>

                <p className="text-xl font-bold mt-1">₹0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* PERSONAL + CLIENT DETAILS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ================================================= */}
        {/* PERSONAL DETAILS */}
        {/* ================================================= */}

        <div
          className="
            xl:col-span-2
            bg-white/[0.05]
            backdrop-blur-xl
            border
            border-white/10
            rounded-2xl
            p-6
          "
        >
          {/* Header */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Personal Details</h2>

              <p className="text-gray-500 text-sm mt-1">
                Your basic contact information.
              </p>
            </div>

            {!editMode && (
              <button
                onClick={handleEdit}
                className="
                  flex
                  items-center
                  gap-2
                  bg-purple-600
                  hover:bg-purple-500
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                "
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>

          {/* Fields */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-500
                  "
                />

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter your full name"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Email</label>

              <div className="relative">
                <Mail
                  size={17}
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-500
                  "
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter your email"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Phone */}

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Phone</label>

              <div className="relative">
                <Phone
                  size={17}
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-500
                  "
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter phone number"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Location */}

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-500
                  "
                />

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="City, Country"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Company Name */}

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Company Name
              </label>

              <div className="relative">
                <Building2
                  size={17}
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-500
                  "
                />

                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter company name"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Company Website */}

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Company Website
              </label>

              <div className="relative">
                <Globe
                  size={17}
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-500
                  "
                />

                <input
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="https://yourcompany.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CLIENT INFORMATION */}
        {/* ================================================= */}

        <div
          className="
            bg-white/[0.05]
            backdrop-blur-xl
            border
            border-white/10
            rounded-2xl
            p-6
          "
        >
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={19} className="text-purple-400" />

            <h2 className="text-xl font-bold">Client Information</h2>
          </div>

          {/* Client Type */}

          <label className="text-xs text-gray-400 block mb-2">
            Client Type
          </label>

          <select
            name="clientType"
            value={formData.clientType}
            onChange={handleChange}
            disabled={!editMode}
            className={`${inputClass} mb-5`}
          >
            <option value="" className="bg-[#21094a]">
              Select Client Type
            </option>

            <option value="Individual" className="bg-[#21094a]">
              Individual
            </option>

            <option value="Startup" className="bg-[#21094a]">
              Startup
            </option>

            <option value="Small Business" className="bg-[#21094a]">
              Small Business
            </option>

            <option value="Company" className="bg-[#21094a]">
              Company
            </option>

            <option value="Agency" className="bg-[#21094a]">
              Agency
            </option>
          </select>

          {/* Industry */}

          <label className="text-xs text-gray-400 block mb-2">Industry</label>

          <input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="e.g. E-commerce, Education"
            className={`${inputClass} mb-5`}
          />

          {/* Preferred Budget */}

          <label className="text-xs text-gray-400 block mb-2">
            Preferred Project Budget
          </label>

          <div className="relative">
            <DollarSign
              size={17}
              className="
                absolute
                left-3
                top-3
                text-gray-500
              "
            />

            <input
              name="preferredBudget"
              value={formData.preferredBudget}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. ₹10,000 - ₹50,000"
              className={`${inputClass} pl-10`}
            />
          </div>

          {/* Hiring Status */}

          <label className="text-xs text-gray-400 block mb-2 mt-5">
            Hiring Status
          </label>

          <select
            name="hiringStatus"
            value={formData.hiringStatus}
            onChange={handleChange}
            disabled={!editMode}
            className={inputClass}
          >
            <option value="" className="bg-[#21094a]">
              Select Hiring Status
            </option>

            <option value="Currently Hiring" className="bg-[#21094a]">
              Currently Hiring
            </option>

            <option value="Looking for Freelancers" className="bg-[#21094a]">
              Looking for Freelancers
            </option>

            <option value="Not Hiring" className="bg-[#21094a]">
              Not Hiring
            </option>
          </select>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ABOUT CLIENT */}
      {/* ===================================================== */}

      <div
        className="
          mt-6
          bg-white/[0.05]
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          p-6
        "
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={19} className="text-purple-400" />

          <div>
            <h2 className="text-xl font-bold">About Me / Company</h2>

            <p className="text-gray-500 text-sm mt-1">
              Tell freelancers about yourself or your company.
            </p>
          </div>
        </div>

        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          disabled={!editMode}
          rows="5"
          placeholder="Write something about yourself, your company, your business, or the type of projects you usually work on..."
          className={`${inputClass} resize-none leading-6`}
        />
      </div>

      {/* ===================================================== */}
      {/* BOTTOM SAVE / CANCEL */}
      {/* ===================================================== */}

      {editMode && (
        <div className="flex justify-end gap-3 mt-6 pb-4">
          <button
            onClick={handleCancel}
            className="
              flex
              items-center
              gap-2
              bg-white/10
              hover:bg-white/20
              border
              border-white/10
              px-5
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition
            "
          >
            <X size={17} />
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              flex
              items-center
              gap-2
              bg-green-500
              hover:bg-green-600
              px-5
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition
            "
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default ClientProfile;
