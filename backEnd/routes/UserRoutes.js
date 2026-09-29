const express = require("express");
const router = express.Router();

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

    // Validate fields
    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Response
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

    // Find user
    const fetchUser = await User.findOne({ email });

    if (!fetchUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Check password
    const matchPassword = await bcrypt.compare(password, fetchUser.password);

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Create JWT
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

    // Login success
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

    // -----------------------------------------
    // Validate client
    // -----------------------------------------

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // -----------------------------------------
    // Check client exists
    // -----------------------------------------

    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // -----------------------------------------
    // Check client role
    // -----------------------------------------

    if (client.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can post jobs",
      });
    }

    // -----------------------------------------
    // Validate required project information
    // -----------------------------------------

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

    // -----------------------------------------
    // Convert budget to numbers
    // -----------------------------------------

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

    // -----------------------------------------
    // Create job
    // -----------------------------------------

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

    // -----------------------------------------
    // Response
    // -----------------------------------------

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

    // Check user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check role
    if (user.role !== "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can create a freelancer profile",
      });
    }

    // Create or update profile
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

    // Duplicate userId
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
// GET FREELANCER PROFILE
// =========================================================

router.get("/freelancerprofile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find profile
    const profile = await FreelancerProfile.findOne({ userId });

    // Profile doesn't exist
    if (!profile) {
      return res.status(200).json({
        success: true,
        profile: null,
        message: "Freelancer profile not created yet",
      });
    }

    // Profile found
    res.status(200).json({
      success: true,
      profile,
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

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Update rating
    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId },

      {
        $set: {
          rating: Number(rating),
        },
      },

      {
        new: true,
      },
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
// GET ALL FREELANCER PROFILES
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
// GET MESSAGES BETWEEN TWO USERS
// =========================================================

router.get("/messages/:userA/:userB", async (req, res) => {
  try {
    const { userA, userB } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: userA,
          receiverId: userB,
        },
        {
          senderId: userB,
          receiverId: userA,
        },
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

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    // Store latest message for each partner
    const partnerMap = new Map();

    messages.forEach((msg) => {
      const partnerId =
        String(msg.senderId) === String(userId)
          ? String(msg.receiverId)
          : String(msg.senderId);

      // Only store latest message
      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, msg);
      }
    });

    // Get partner IDs
    const partnerIds = [...partnerMap.keys()];

    // Get users
    const partners = await User.find({
      _id: {
        $in: partnerIds,
      },
    });

    // Build conversations
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
// =====================================================
// SUBMIT PROPOSAL
// =====================================================

// =====================================================
// SUBMIT PROPOSAL
// =====================================================
// =========================================================
// SUBMIT PROPOSAL
// =========================================================

router.post("/proposals/:projectId", async (req, res) => {
  try {
    const { freelancerId, bidAmount, deliveryTime, coverLetter } = req.body;

    // -----------------------------------------
    // Validate fields
    // -----------------------------------------

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

    // -----------------------------------------
    // Find project
    // -----------------------------------------

    const project = await PostJob.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get project name from database
    const projectName = project.title;

    // -----------------------------------------
    // Check project client
    // -----------------------------------------

    if (!project.clientId) {
      return res.status(400).json({
        success: false,
        message:
          "This project does not have a client ID. Please create a new project.",
      });
    }

    // -----------------------------------------
    // Reject if position already filled
    // -----------------------------------------

    if (project.assignedFreelancerId) {
      return res.status(400).json({
        success: false,
        message: "This position has already been filled.",
      });
    }

    // -----------------------------------------
    // Check freelancer
    // -----------------------------------------

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

    // -----------------------------------------
    // Check duplicate proposal
    // -----------------------------------------

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

    // -----------------------------------------
    // Create proposal
    // -----------------------------------------

    const proposal = await Proposal.create({
      projectId: project._id,
      projectName: projectName, // ✅ Project name from PostJob DB

      freelancerId: freelancer._id,
      clientId: project.clientId,

      bidAmount: Number(bidAmount),
      deliveryTime: Number(deliveryTime),
      coverLetter: coverLetter.trim(),

      status: "pending",
    });

    // -----------------------------------------
    // Increase proposal count
    // -----------------------------------------

    project.proposals = (project.proposals || 0) + 1;

    await project.save();

    // -----------------------------------------
    // Success response
    // -----------------------------------------

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

    // Mark this one accepted
    proposal.status = "accepted";
    await proposal.save();

    // Reject every other proposal on the same project
    await Proposal.updateMany(
      { projectId: proposal.projectId, _id: { $ne: proposal._id } },
      { $set: { status: "rejected" } },
    );

    // Update the job itself
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
// routes/proposalRoutes.js
router.patch("/proposals/:proposalId/progress", async (req, res) => {
  try {
    const { progress } = req.body;

    if (![0, 25, 50, 75, 100].includes(progress)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid progress value" });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.proposalId, // ✅ fixed
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
    console.log("Update Progress Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
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
    console.log("Submit Review Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// =========================================================
// EXPORT ROUTER
// =========================================================

router.get("/user/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    const profile = await ClientProfile.findOne({ clientId });

    return res.status(200).json({
      success: true,
      profile: profile || null,
    });
  } catch (error) {
    console.error("Get Client Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch client profile",
    });
  }
});

router.post("/clientprofile", async (req, res) => {
  try {
    const {
      clientId,
      image,
      ClientName,
      email,
      phone,
      location,
      CompanyName,
      website,
      AboutCompany,
      ClientType,
    } = req.body;

    // Check client ID
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    // Check client exists
    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check role
    if (client.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can create a client profile",
      });
    }

    // Create or update profile
    const profile = await ClientProfile.findOneAndUpdate(
      { clientId },
      {
        $set: {
          clientId,
          image: image || "",
          ClientName: ClientName || "",
          email: email || "",
          phone: phone || "",
          location: location || "",
          CompanyName: CompanyName || "",
          website: website || "",
          AboutCompany: AboutCompany || "",
          ClientType: ClientType || "",
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

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalClients = await User.countDocuments({
      role: "client",
    });

    const totalFreelancers = await User.countDocuments({
      role: "freelancer",
    });

    const totalProjects = await Project.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "active",
    });

    const completedProjects = await Project.countDocuments({
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
module.exports = router;

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalClients = await User.countDocuments({
      role: "client",
    });

    const totalFreelancers = await User.countDocuments({
      role: "freelancer",
    });

    const totalProjects = await Project.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "active",
    });

    const completedProjects = await Project.countDocuments({
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
