import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";

import {
  User,
  Mail,
  MapPin,
  Briefcase,
  LogOut,
  Phone,
  Globe,
  Calendar,
  Code,
  Clock,
  Star,
  Edit3,
  Save,
  X,
  Award,
  DollarSign,
  Camera,
} from "lucide-react";

import { FaHome } from "react-icons/fa";
import API from "./API";

function Freelancerprofile() {
  const navigate = useNavigate();

  // =========================================================
  // GET LOGGED IN USER
  // =========================================================

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  // =========================================================
  // STATES
  // =========================================================

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    name: loggedUser?.fullName || "",
    email: loggedUser?.email || "",
    image: loggedUser?.image || "",

    phone: "",
    location: "",
    portfolio: "",
createdAt: "",
    title: "",
    bio: "",
    rating: 0,

    experience: "",
    projects: 0,
    hourlyRate: 0,

    skills: [],
  });

  // =========================================================
  // SKILL INPUT
  // =========================================================

  const [skillInput, setSkillInput] = useState("");

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) {
          alert("User not found. Please login again.");
          navigate("/login");
          return;
        }

        const res = await API.get(`/freelancerprofile/${user.id}`);

        console.log("Profile response:", res.data);

        if (res.data.profile) {
          const profile = res.data.profile;

          setFormData({
            name: profile.name || user.fullName || "",
            email: profile.email || user.email || "",
            image: profile.image || user.image || "",

            phone: profile.phone || "",
            location: profile.location || "",
            portfolio: profile.portfolio || "",
            createdAt: profile.createdAt || "",
            title: profile.title || "",
            bio: profile.bio || "",
            rating: profile.rating ?? 0,

            experience: profile.experience || "",
            projects: profile.projects ?? 0,
            hourlyRate: profile.hourlyRate ?? 0,

            skills: Array.isArray(profile.skills) ? profile.skills : [],
          });

          if (profile.image) {
            setImagePreview(profile.image);
          }
        } else {
          setFormData({
            name: user.fullName || "",
            email: user.email || "",
            image: user.image || "",

            phone: "",
            location: "",
            portfolio: "",
            createdAt: "",  
            title: "",
            bio: "",
            rating: 0,

            experience: "",
            projects: 0,
            hourlyRate: 0,

            skills: [], 
          });

          setImagePreview(user.image || "");
        }
      } catch (error) {
        console.error("Error fetching freelancer profile:", error);

        setFormData((previous) => ({
          ...previous,
          name: loggedUser?.fullName || "",
          email: loggedUser?.email || "",
          image: loggedUser?.image || "",
        }));

        setImagePreview(loggedUser?.image || "");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // COMPRESS IMAGE
  // =========================================================

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          let width = img.width;
          let height = img.height;

          // -----------------------------------------------
          // RESIZE IMAGE
          // -----------------------------------------------

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas not supported"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // -----------------------------------------------
          // COMPRESS IMAGE
          // -----------------------------------------------

          const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

          resolve(compressedImage);
        };

        img.onerror = () => {
          reject(new Error("Unable to load selected image"));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Unable to read selected image"));
      };

      reader.readAsDataURL(file);
    });
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // -----------------------------------------------
    // CHECK FILE TYPE
    // -----------------------------------------------

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    try {
      setUploadingImage(true);

      // -----------------------------------------------
      // COMPRESS IMAGE
      // -----------------------------------------------

      const compressedImage = await compressImage(file);

      console.log(
        "Original image size:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      console.log(
        "Compressed image size:",
        ((compressedImage.length * 3) / 4 / 1024 / 1024).toFixed(2),
        "MB",
      );

      setSelectedImage(file);
      setImagePreview(compressedImage);
    } catch (error) {
      console.error("Error compressing image:", error);

      alert("Failed to process image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================================================
  // ADD SKILL
  // =========================================================
  const formatSkill = (skill) => {
    skill = skill.trim();

    if (!skill) return "";

    return skill.charAt(0).toUpperCase() + skill.slice(1);
  };
  const addSkill = () => {
    const skills = skillInput
      .split(/[,\s\n]+/)
      .map((skill) => formatSkill(skill))
      .filter((skill) => skill !== "");

    if (skills.length === 0) {
      return;
    }

    setFormData((previous) => {
      const existingSkills = previous.skills;

      const newSkills = skills.filter(
        (skill) =>
          !existingSkills.some(
            (item) => item.toLowerCase() === skill.toLowerCase(),
          ),
      );

      return {
        ...previous,
        skills: [...existingSkills, ...newSkills],
      };
    });

    setSkillInput("");
  };

  // =========================================================
  // REMOVE SKILL
  // =========================================================

  const removeSkill = (skillToRemove) => {
    setFormData((previous) => ({
      ...previous,
      skills: previous.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    alert("Logout Successfully");

    navigate("/login");
  };

  // =========================================================
  // SUBMIT RATING (for a client to rate this freelancer)
  // =========================================================

  const submitRating = async (freelancerId, ratingValue) => {
    try {
      const res = await API.post(`/freelancerprofile/${freelancerId}/rate`, {
        rating: ratingValue,
      });

      if (res.data.success) {
        alert("Rating saved!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // =====================================================
      // CHECK USER
      // =====================================================

      if (!user?.id) {
        alert("User not found. Please login again.");
        navigate("/login");
        return;
      }

      // =====================================================
      // VALIDATION
      // =====================================================

      if (!formData.name.trim()) {
        alert("Please enter your name.");
        return;
      }

      if (!formData.email.trim()) {
        alert("Please enter your email.");
        return;
      }

      if (!formData.phone.trim()) {
        alert("Please enter your phone number.");
        return;
      }

      if (!formData.title.trim()) {
        alert("Please enter your professional title.");
        return;
      }

      if (!formData.experience.trim()) {
        alert("Please enter your experience.");
        return;
      }

      if (
        formData.projects === "" ||
        formData.projects === null ||
        formData.projects === undefined
      ) {
        alert("Please enter number of projects.");
        return;
      }

      if (Number(formData.projects) < 0) {
        alert("Projects cannot be negative.");
        return;
      }

      if (
        formData.hourlyRate === "" ||
        formData.hourlyRate === null ||
        formData.hourlyRate === undefined
      ) {
        alert("Please enter hourly rate.");
        return;
      }

      if (Number(formData.hourlyRate) < 0) {
        alert("Hourly Rate cannot be negative.");
        return;
      }

      if (!Array.isArray(formData.skills) || formData.skills.length === 0) {
        alert("Please add at least one skill.");
        return;
      }

      // =====================================================
      // IMAGE URL
      // =====================================================

      let imageURL = formData.image || "";

      // =====================================================
      // UPLOAD IMAGE TO CLOUDINARY
      // =====================================================

      if (selectedImage) {
        try {
          setUploadingImage(true);

          const imageData = new FormData();

          imageData.append("image", selectedImage);

          console.log("Uploading image to Cloudinary...");

          const uploadResponse = await API.post(
            "/upload_profile_image",
            imageData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          console.log("Cloudinary upload response:", uploadResponse.data);

          if (!uploadResponse.data.success) {
            alert(uploadResponse.data.message || "Image upload failed");

            setUploadingImage(false);
            return;
          }

          imageURL = uploadResponse.data.image;

          console.log("Cloudinary Image URL:", imageURL);
        } catch (imageError) {
          console.error("Cloudinary image upload error:", imageError);

          setUploadingImage(false);

          alert(imageError.response?.data?.message || "Failed to upload image");

          return;
        }
      }

      // =====================================================
      // PROFILE DATA
      // =====================================================

      const data = {
        userId: user.id,

        name: formData.name.trim(),

        email: formData.email.trim(),

        image: imageURL,

        phone: formData.phone.trim(),

        location: formData.location.trim(),

        portfolio: formData.portfolio.trim(),

        title: formData.title.trim(),

        bio: formData.bio.trim(),

        experience: formData.experience.trim(),

        projects: Number(formData.projects),

        hourlyRate: Number(formData.hourlyRate),

        skills: formData.skills,
      };

      console.log("Sending profile data:", data);

      // =====================================================
      // SAVE PROFILE TO DATABASE
      // =====================================================

      const res = await API.post("/freelancerprofile", data);

      console.log("Save response:", res.data);

      // =====================================================
      // SUCCESS
      // =====================================================

      if (res.data.success) {
        const profile = res.data.profile;

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          image: profile.image || "",

          phone: profile.phone || "",
          location: profile.location || "",
          portfolio: profile.portfolio || "",

          title: profile.title || "",
          bio: profile.bio || "",
          rating: profile.rating ?? 0,

          experience: profile.experience || "",

          projects: profile.projects ?? 0,

          hourlyRate: profile.hourlyRate ?? 0,

          skills: Array.isArray(profile.skills) ? profile.skills : [],
        });

        // ===================================================
        // UPDATE IMAGE PREVIEW
        // ===================================================

        if (profile.image) {
          setImagePreview(profile.image);
        }

        setSelectedImage(null);
        setUploadingImage(false);
        setEditMode(false);

        alert("Profile Updated Successfully 🚀");
      } else {
        setUploadingImage(false);

        alert(res.data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving freelancer profile:", error);

      setUploadingImage(false);

      alert(error.response?.data?.message || "Failed to save profile");
    }
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = async () => {
    setEditMode(false);

    setSelectedImage(null);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        return;
      }

      const res = await API.get(`/freelancerprofile/${user.id}`);

      if (res.data.profile) {
        const profile = res.data.profile;

        setFormData({
          name: profile.name || user.fullName || "",

          email: profile.email || user.email || "",

          image: profile.image || user.image || "",

          phone: profile.phone || "",

          location: profile.location || "",

          portfolio: profile.portfolio || "",

          title: profile.title || "",

          bio: profile.bio || "",
          rating: profile.rating ?? 0,

          experience: profile.experience || "",

          projects: profile.projects ?? 0,

          hourlyRate: profile.hourlyRate ?? 0,

          skills: Array.isArray(profile.skills) ? profile.skills : [],
        });

        setImagePreview(profile.image || user.image || "");
      } else {
        setImagePreview(user.image || "");
      }
    } catch (error) {
      console.error("Error restoring profile:", error);
    }
  };


  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputClass =
    "w-full bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none placeholder-gray-500 disabled:opacity-70 transition";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002b] flex items-center justify-center text-white">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const profileImage =
    imagePreview ||
    formData.image ||
    loggedUser?.image ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // =========================================================
  // UI
  // =========================================================

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
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-5
          mb-8
        "
      >
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/freelancerdashboard")}
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
            title="Freelancer Dashboard"
          >
            <FaHome size={20} />
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Freelancer Profile
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Manage your professional profile and account information.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
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
            <>
              <button
                onClick={handleSave}
                disabled={uploadingImage}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-green-500
                  hover:bg-green-600
                  disabled:opacity-50
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                "
              >
                <Save size={17} />

                {uploadingImage ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={handleCancel}
                disabled={uploadingImage}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-white/10
                  hover:bg-white/20
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
            </>
          )}

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

      {/* PROFILE HERO */}

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

        <div
          className="
            relative
            flex
            flex-col
            lg:flex-row
            gap-8
            items-start
          "
        >
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
                src={profileImage}
                alt="Freelancer Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {editMode && (
              <label
                className="
                  absolute
                  bottom-2
                  left-2
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  bg-purple-600
                  hover:bg-purple-500
                  rounded-full
                  cursor-pointer
                  shadow-lg
                "
              >
                <Camera size={17} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

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

          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {formData.name || "Freelancer Name"}
            </h2>

            <p className="text-purple-300 mt-1 font-medium">
              {formData.title || "Professional Title Not Added"}
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-4
                mt-4
                text-sm
                text-gray-400
              "
            >
              <span className="flex items-center gap-2">
                <MapPin size={15} />

                {formData.location || "Location not added"}
              </span>

              <span className="flex items-center gap-2">
                <Calendar size={15} />
                {formData.createdAt || "Creation date not added"}
              </span>
            </div>

            {/* STATS */}

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-3
                mt-7
              "
            >
              <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase size={15} />

                  <span className="text-xs">Projects</span>
                </div>

                <p className="text-xl font-bold mt-1">
                  {formData.projects || 0}
                </p>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={15} />

                  <span className="text-xs">Experience</span>
                </div>

                <p className="text-xl font-bold mt-1">
                  {formData.experience || "Not Set"}
                </p>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Star size={15} className="text-yellow-400" />

                  <span className="text-xs">Rating</span>
                </div>

                <p className="text-xl font-bold mt-1">
                  {formData.rating ? formData.rating.toFixed(1) : "0.0"}
                </p>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <LiaRupeeSignSolid  size={15} />

                  <span className="text-xs">Hourly Rate</span>
                </div>

                <p className="text-xl font-bold mt-1">
                  {formData.hourlyRate ? `₹${formData.hourlyRate}` : "Not Set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PERSONAL + PROFESSIONAL */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
          <div className="mb-6">
            <h2 className="text-xl font-bold">Personal Details</h2>

            <p className="text-gray-500 text-sm mt-1">
              Add your basic contact information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Full Name <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3 top-3 text-gray-500"
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

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Email <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3 top-3 text-gray-500"
                />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter your email"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Phone <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-3 top-3 text-gray-500"
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

            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3 top-3 text-gray-500"
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

            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 mb-2 block">
                Portfolio Website
              </label>

              <div className="relative">
                <Globe
                  size={17}
                  className="absolute left-3 top-3 text-gray-500"
                />

                <input
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="https://yourportfolio.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>

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
            <Award size={19} className="text-purple-400" />

            <h2 className="text-xl font-bold">Professional</h2>
          </div>

          <label className="text-xs text-gray-400 block mb-2">
            Professional Title <span className="text-red-400">*</span>
          </label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="e.g. Full Stack Developer"
            className={`${inputClass} mb-5`}
          />

          <label className="text-xs text-gray-400 block mb-2">
            Experience <span className="text-red-400">*</span>
          </label>

          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="e.g. 2 Years"
            className={`${inputClass} mb-5`}
          />

          <label className="text-xs text-gray-400 block mb-2">Projects</label>

          <input
            type="number"
            min="0"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="e.g. 10"
            className={`${inputClass} mb-5`}
          />

          <label className="text-xs text-gray-400 block mb-2">
            Hourly Rate <span className="text-red-400">*</span>
          </label>

          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">₹</span>

            <input
              type="number"
              min="0"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. 500"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>
      </div>

      {/* ABOUT ME */}

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
        <div className="flex items-start gap-2 mb-5">
          <User size={19} className="text-purple-400 mt-1" />

          <div>
            <h2 className="text-xl font-bold">About Me</h2>

            <p className="text-gray-500 text-sm mt-1">
              Tell clients about yourself and your experience.
            </p>
          </div>
        </div>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!editMode}
          rows="5"
          placeholder="Write something about yourself..."
          className={`${inputClass} resize-none leading-6`}
        />
      </div>

      {/* SKILLS */}

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
        <div className="flex items-start gap-2 mb-5">
          <Code size={19} className="text-purple-400 mt-1" />

          <div>
            <h2 className="text-xl font-bold">
              Skills <span className="text-red-400">*</span>
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Add the technologies and skills you offer.
            </p>
          </div>
        </div>

        {formData.skills.length === 0 ? (
          <p className="text-gray-500 text-sm">No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="
                    flex
                    items-center
                    gap-2
                    bg-purple-500/10
                    text-purple-300
                    border
                    border-purple-400/20
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                  "
              >
                {skill}

                {editMode && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-400 transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {editMode && (
          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
              mt-5
              max-w-md
            "
          >
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill..."
              className={inputClass}
            />

            <button
              type="button"
              onClick={addSkill}
              className="
                bg-purple-600
                hover:bg-purple-500
                px-5
                py-2.5
                rounded-xl
                font-semibold
                transition
              "
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Freelancerprofile;
