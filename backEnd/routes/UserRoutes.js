const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const PostJob = require("../models/PostJob");
const FreelancerProfile = require("../models/FreelancerProfile");
const Message = require("../models/Message");
const Proposal = require("../models/Proposal");
const ClientProfile = require("../models/ClientProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================================================
// REGISTER
// =========================================================

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;

    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration Successfully",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
});

// =========================================================
// LOGIN
// =========================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const fetchUser = await User.findOne({ email });

    if (!fetchUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const matchPassword = await bcrypt.compare(password, fetchUser.password);

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: fetchUser._id,
        role: fetchUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
      user: {
        id: fetchUser._id,
        fullName: fetchUser.fullName,
        email: fetchUser.email,
        role: fetchUser.role,
      },
      role: fetchUser.role,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
});

// =========================================================
// POST JOB
// =========================================================

router.post("/postjob", async (req, res) => {
  try {
    const {
      clientId,
      clientName,
      title,
      companyName,
      description,
      projectType,
      experienceLevel,
      duration,
      budgetMin,
      budgetMax,
      deadline,
    } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (client.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can post jobs",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project description is required",
      });
    }

    if (
      budgetMin === undefined ||
      budgetMin === "" ||
      budgetMax === undefined ||
      budgetMax === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Budget range is required",
      });
    }

    if (!deadline || !deadline.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project deadline is required",
      });
    }

    const minimumBudget = Number(budgetMin);
    const maximumBudget = Number(budgetMax);

    if (Number.isNaN(minimumBudget) || Number.isNaN(maximumBudget)) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid number",
      });
    }

    if (minimumBudget <= 0 || maximumBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be greater than 0",
      });
    }

    if (minimumBudget > maximumBudget) {
      return res.status(400).json({
        success: false,
        message: "Minimum budget cannot be greater than maximum budget",
      });
    }

    const newJob = new PostJob({
      clientId: client._id,
      clientName: clientName || client.fullName || client.name,
      title: title.trim(),
      companyName: companyName?.trim() || "",
      description: description.trim(),
      projectType,
      experienceLevel,
      duration: duration?.trim() || "",
      budgetMin: minimumBudget,
      budgetMax: maximumBudget,
      deadline: deadline.trim(),
      status: "open",
      assignedFreelancerId: null,
      proposals: 0,
    });

    await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Post Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to post job",
      error: error.message,
    });
  }
});

router.get("/postjobs", async (req, res) => {
  try {
    const jobs = await PostJob.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// =========================================================
// CREATE / UPDATE FREELANCER PROFILE
// =========================================================

router.post("/freelancerprofile", async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      image,
      phone,
      location,
      website,
      title,
      bio,
      category,
      experience,
      projects,
      hourlyRate,
      skills,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can create a freelancer profile",
      });
    }

    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          name: name?.trim() || user.fullName,
          email: email?.trim() || user.email,
          image: image || "",
          phone: phone?.trim() || "",
          location: location?.trim() || "",
          website: website?.trim() || "",
          title: title?.trim() || "",
          category: category?.trim() || "",
          bio: bio?.trim() || "",
          experience: experience?.trim() || "",
          projects:
            projects !== undefined && projects !== "" ? Number(projects) : 0,
          hourlyRate:
            hourlyRate !== undefined && hourlyRate !== ""
              ? Number(hourlyRate)
              : 0,
          skills: Array.isArray(skills) ? skills : [],
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Freelancer profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Freelancer Profile Save Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Freelancer profile already exists for this user",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save freelancer profile",
      error: error.message,
    });
  }
});

// =========================================================
// GET SINGLE FREELANCER PROFILE (falls back to basic User info)
// =========================================================

router.get("/freelancerprofile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await FreelancerProfile.findOne({ userId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        profile: {
          userId: user._id,
          fullName: user.fullName,
          name: user.fullName,
          email: user.email,
          createdAt: user.registeredAt || user.createdAt,
          image: "",
          title: "",
          location: "",
          phone: "",
          website: "",
          experience: "",
          hourlyRate: 0,
          projects: 0,
          rating: 0,
          skills: [],
          bio: "",
          blocked: user.accountType,
        },
      });
    }

    res.status(200).json({
      success: true,
      hasProfile: true,
      profile: {
        ...profile.toObject(),
        blocked: user.accountType,
      },
    });
  } catch (error) {
    console.error("Get Freelancer Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer profile",
      error: error.message,
    });
  }
});

// =========================================================
// RATE FREELANCER
// =========================================================

router.post("/freelancerprofile/:userId/rate", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId },
      { $set: { rating: Number(rating) } },
      { new: true },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      rating: profile.rating,
    });
  } catch (error) {
    console.error("Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// =========================================================
// GET ALL FREELANCER PROFILES (plural — used by Client dashboard browse page)
// =========================================================

router.get("/freelancerprofiles", async (req, res) => {
  try {
    const profiles = await FreelancerProfile.find();

    res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error("Get Freelancer Profiles Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancers",
    });
  }
});

// =========================================================
// SUBMIT REVIEW FOR A FREELANCER
// =========================================================

router.post("/freelancerprofile/:userId/review", async (req, res) => {
  try {
    const { userId } = req.params;
    const { clientId, clientName, rating, comment } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const profile = await FreelancerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    profile.reviews.push({
      clientId,
      clientName: clientName || "Anonymous",
      rating: Number(rating),
      comment: comment?.trim() || "",
    });

    const total = profile.reviews.reduce(
      (acc, review) => acc + review.rating,
      0,
    );

    profile.rating = total / profile.reviews.length;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      profile,
    });
  } catch (error) {
    console.error("Submit Review Error:", error);

    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =========================================================
// GET MESSAGES BETWEEN TWO USERS
// =========================================================

router.get("/messages/:userA/:userB", async (req, res) => {
  try {
    const { userA, userB } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// =========================================================
// GET CONVERSATION PARTNERS
// =========================================================

router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const partnerMap = new Map();

    messages.forEach((msg) => {
      const partnerId =
        String(msg.senderId) === String(userId)
          ? String(msg.receiverId)
          : String(msg.senderId);

      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, msg);
      }
    });

    const partnerIds = [...partnerMap.keys()];

    const partners = await User.find({
      _id: { $in: partnerIds },
    });

    const conversations = partners.map((partner) => {
      const lastMsg = partnerMap.get(String(partner._id));

      return {
        userId: partner._id,
        name: partner.fullName,
        lastMessage: lastMsg?.text || "",
        time: lastMsg?.createdAt || null,
      };
    });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
});

// =========================================================
// GET SINGLE PROJECT
// =========================================================

router.get("/postjobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await PostJob.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =========================================================
// SUBMIT PROPOSAL
// =========================================================

router.post("/proposals/:projectId", async (req, res) => {
  try {
    const { freelancerId, bidAmount, deliveryTime, coverLetter } = req.body;

    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        message: "Freelancer ID is required",
      });
    }

    if (!bidAmount) {
      return res.status(400).json({
        success: false,
        message: "Bid amount is required",
      });
    }

    if (!deliveryTime) {
      return res.status(400).json({
        success: false,
        message: "Delivery time is required",
      });
    }

    if (!coverLetter || !coverLetter.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cover letter is required",
      });
    }

    const project = await PostJob.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const projectName = project.title;

    if (!project.clientId) {
      return res.status(400).json({
        success: false,
        message:
          "This project does not have a client ID. Please create a new project.",
      });
    }

    if (project.assignedFreelancerId) {
      return res.status(400).json({
        success: false,
        message: "This position has already been filled.",
      });
    }

    const freelancer = await User.findById(freelancerId);

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    if (freelancer.role !== "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can submit proposals",
      });
    }

    const existingProposal = await Proposal.findOne({
      projectId: project._id,
      freelancerId,
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a proposal for this project",
      });
    }

    const proposal = await Proposal.create({
      projectId: project._id,
      projectName,
      freelancerId: freelancer._id,
      clientId: project.clientId,
      bidAmount: Number(bidAmount),
      deliveryTime: Number(deliveryTime),
      coverLetter: coverLetter.trim(),
      status: "pending",
    });

    project.proposals = (project.proposals || 0) + 1;

    await project.save();

    if (!proposal) {
      return res.status(500).json({
        success: false,
        message: "Failed to create proposal",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      proposal,
    });
  } catch (error) {
    console.error("Submit Proposal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit proposal",
      error: error.message,
    });
  }
});

// =========================================================
// GET PROPOSALS FOR A PROJECT
// =========================================================

router.get("/proposals/project/:projectId", async (req, res) => {
  try {
    const proposals = await Proposal.find({
      projectId: req.params.projectId,
    })
      .populate("freelancerId", "fullName email role")
      .populate("clientId", "fullName email role")
      .populate("projectId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      proposals,
    });
  } catch (error) {
    console.error("Get Project Proposals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get project proposals",
      error: error.message,
    });
  }
});

// =========================================================
// GET PROPOSALS FOR A FREELANCER
// =========================================================

router.get("/proposals/freelancer/:freelancerId", async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancerId: req.params.freelancerId,
    })
      .populate("projectId")
      .populate("clientId", "fullName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      proposals,
    });
  } catch (error) {
    console.error("Get Freelancer Proposals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get freelancer proposals",
      error: error.message,
    });
  }
});

router.get("/postjobs/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const jobs = await PostJob.find({ clientId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Client PostJobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your projects",
    });
  }
});

router.delete("/postjobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await PostJob.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await PostJob.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
});
// =========================================================
// ACCEPT A PROPOSAL
// =========================================================

router.patch("/proposals/:proposalId/accept", async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "This proposal has already been accepted",
      });
    }

    proposal.status = "accepted";
    await proposal.save();

    await Proposal.updateMany(
      { projectId: proposal.projectId, _id: { $ne: proposal._id } },
      { $set: { status: "rejected" } },
    );

    await PostJob.findByIdAndUpdate(proposal.projectId, {
      status: "in-progress",
      assignedFreelancerId: proposal.freelancerId,
    });

    return res.status(200).json({
      success: true,
      message: "Proposal accepted",
      proposal,
    });
  } catch (error) {
    console.error("Accept Proposal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept proposal",
      error: error.message,
    });
  }
});

// =========================================================
// UPDATE PROPOSAL PROGRESS
// =========================================================

router.patch("/proposals/:proposalId/progress", async (req, res) => {
  try {
    const { progress } = req.body;

    if (![0, 25, 50, 75, 100].includes(progress)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid progress value" });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.proposalId,
      { progress },
      { new: true },
    );

    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    if (progress === 100) {
      await PostJob.findByIdAndUpdate(proposal.projectId, {
        status: "completed",
      });
    }

    res.json({ success: true, proposal });
  } catch (error) {
    console.error("Update Progress Error:", error);

    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =========================================================
// CLIENT PROFILE — CREATE / UPDATE
// =========================================================

router.post("/clientprofile", async (req, res) => {
  try {
    const {
      clientId,
      image,
      clientName,
      email,
      phone,
      location,
      companyName,
      website,
      clientType,
      industry,
      preferredBudget,
      hiringStatus,
      aboutCompany,
    } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (client.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can create a client profile",
      });
    }

    const profile = await ClientProfile.findOneAndUpdate(
      { clientId },
      {
        $set: {
          clientId,
          role: "client",
          image: image || "",
          clientName: clientName || "",
          email: email || client.email || "",
          phone: phone || "",
          location: location || "",
          companyName: companyName || "",
          website: website || "",
          clientType: clientType || "",
          industry: industry || "",
          preferredBudget: preferredBudget || "",
          hiringStatus: hiringStatus || "",
          aboutCompany: aboutCompany || "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Client profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Save Client Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save client profile",
      error: error.message,
    });
  }
});

// =========================================================
// GET CLIENT'S OWN PROFILE (used by the client's own profile page)
// =========================================================

router.get("/clientprofile/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    const profile = await ClientProfile.findOne({ clientId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: "Client profile not found",
        profile: null,
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Client Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch client profile",
      error: error.message,
    });
  }
});

// =========================================================
// GET ALL CLIENTS (admin list — merged User + Profile)
// =========================================================

router.get("/clients", async (req, res) => {
  try {
    const clientUsers = await User.find({ role: "client" }).sort({
      createdAt: -1,
    });

    const profiles = await ClientProfile.find();

    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(String(profile.clientId), profile);
    });

    const merged = clientUsers.map((user) => {
      const profile = profileMap.get(String(user._id));

      return {
        clientId: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.registeredAt || user.createdAt,
        clientName: profile?.clientName || user.fullName,
        companyName: profile?.companyName || "",
        location: profile?.location || "",
        clientType: profile?.clientType || "",
        hiringStatus: profile?.hiringStatus || "",
        image: profile?.image || "",
        hasProfile: Boolean(profile),
        accountType: user.accountType || "Active", // ✅ correct field, correct source
      };
    });

    res.status(200).json(merged);
  } catch (error) {
    console.error("Error fetching clients:", error);

    res.status(500).json({
      message: "Failed to fetch clients",
    });
  }
});

// =========================================================
// GET SINGLE CLIENT (admin detail view — falls back to basic User info)
// =========================================================

router.get("/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    const user = await User.findById(clientId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await ClientProfile.findOne({ clientId });

    const baseInfo = {
      clientId: user._id,
      clientName: user.fullName,
      email: user.email,
      createdAt: user.registeredAt || user.createdAt,
      accountType: user.accountType || "unBlock",
    };

    if (!profile) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        profile: {
          ...baseInfo,
          image: "",
          phone: "",
          location: "",
          companyName: "",
          website: "",
          clientType: "",
          industry: "",
          preferredBudget: "",
          hiringStatus: "",
          aboutCompany: "",
          accountType: user.accountType || "unBlock",
        },
      });
    }

    res.status(200).json({
      success: true,
      hasProfile: true,
      profile: {
        ...profile.toObject(),
        accountType: user.accountType || "unBlock",
      },
    });
  } catch (error) {
    console.error("Get Client Detail Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch client details",
    });
  }
});
// =========================================================
// GET ALL FREELANCERS (admin list — merged User + Profile)
// =========================================================

router.get("/freelancerprofile", async (req, res) => {
  try {
    const freelancerUsers = await User.find({ role: "freelancer" }).sort({
      createdAt: -1,
    });

    const profiles = await FreelancerProfile.find();

    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(String(profile.userId), profile);
    });

    const merged = freelancerUsers.map((user) => {
      const profile = profileMap.get(String(user._id));

      return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.registeredAt || user.createdAt,
        name: profile?.name || user.fullName,
        skills: profile?.skills || [],
        title: profile?.title || "",
        location: profile?.location || "",
        rating: profile?.rating || 0,
        hourlyRate: profile?.hourlyRate || 0,
        image: profile?.image || "",
        hasProfile: Boolean(profile),
        accountType: user.accountType || "Active",
      };
    });

    res.status(200).json(merged);
  } catch (error) {
    console.error("Error fetching freelancers:", error);

    res.status(500).json({
      message: "Failed to fetch freelancers",
    });
  }
});
// =========================================================
// ADMIN: DELETE FREELANCER
// =========================================================

router.post("/admin/delete-freelancer/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await FreelancerProfile.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Freelancer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Freelancer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete freelancer",
    });
  }
});

router.post("/admin/delete-client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    // Find client user
    const user = await User.findById(clientId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Make sure the user is actually a client
    if (user.role !== "client") {
      return res.status(400).json({
        success: false,
        message: "This user is not a client",
      });
    }

    // Delete client profile
    await ClientProfile.deleteOne({
      clientId: clientId,
    });

    // Delete client's projects
    await PostJob.deleteMany({
      clientId: clientId,
    });

    // Delete proposals related to client's projects
    await Proposal.deleteMany({
      clientId: clientId,
    });

    // Delete messages involving this client
    await Message.deleteMany({
      $or: [{ senderId: clientId }, { receiverId: clientId }],
    });

    // Finally delete user account
    await User.findByIdAndDelete(clientId);

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete Client Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
});
// =========================================================
// ADMIN: BLOCK / UNBLOCK FREELANCER (toggle)
// =========================================================

router.post("/admin/blockclient/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const user = await User.findById(clientId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Client user account not found.",
      });
    }

    if (user.role !== "client") {
      return res.status(400).json({
        success: false,
        message: "This user is not a client.",
      });
    }

    user.accountType = user.accountType === "Blocked" ? "Active" : "Blocked";

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        user.accountType === "Blocked"
          ? "Client blocked successfully"
          : "Client unblocked successfully",
      accountType: user.accountType,
      blocked: user.accountType,
    });
  } catch (error) {
    console.error("Block Client Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update client block status",
    });
  }
});

/* =========================================================
   BLOCK / UNBLOCK FREELANCER
   accountType is stored ONLY in User
========================================================= */

router.post("/admin/blockfreelancers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Freelancer user account not found.",
      });
    }

    if (user.role !== "freelancer") {
      return res.status(400).json({
        success: false,
        message: "This user is not a freelancer.",
      });
    }

    user.accountType = user.accountType === "Blocked" ? "Active" : "Blocked";

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        user.accountType === "Blocked"
          ? "Freelancer blocked successfully"
          : "Freelancer unblocked successfully",
      accountType: user.accountType,
      blocked: user.accountType,
    });
  } catch (error) {
    console.error("Block Freelancer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update freelancer block status",
    });
  }
});

// =========================================================
// ADMIN: DELETE CLIENT
// =========================================================

// =========================================================
// DASHBOARD STATS
// =========================================================

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: "client" });
    const totalFreelancers = await User.countDocuments({
      role: "freelancer",
    });

    const totalProjects = await PostJob.countDocuments();
    const activeProjects = await PostJob.countDocuments({
      status: "in-progress",
    });
    const completedProjects = await PostJob.countDocuments({
      status: "completed",
    });

    const totalProposals = await Proposal.countDocuments();

    res.json({
      totalClients,
      totalFreelancers,
      totalProjects,
      activeProjects,
      completedProjects,
      totalProposals,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
});

router.get("/recent-users", async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["client", "freelancer"] },
    })
      .sort({ registeredAt: -1 })
      .limit(3)
      .select("fullName email role registeredAt createdAt");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Recent Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent users",
    });
  }
});

router.get("/recent-projects", async (req, res) => {
  try {
    const projects = await PostJob.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title description status clientName companyName createdAt");

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (e) {
    console.error("Recent Projects Error:", e);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent projects",
    });
  }
});
// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;
