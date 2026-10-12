const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // or "bcrypt", whichever you installed
const jwt = require("jsonwebtoken");

const FreelancerProfile = require("../models/FreelancerProfile");
const Message = require("../models/Message");
const Proposal = require("../models/Proposal");
const ClientProfile = require("../models/ClientProfile");
const User = require("../models/User");
const PostJob = require("../models/PostJob");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const sameId = (a, b) => String(a) === String(b);

const denied = (res) =>
  res.status(403).json({
    success: false,
    message: "Access denied",
  });

// =========================================================
// PUBLIC ROUTES (no token needed)
// =========================================================

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;

    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!["client", "freelancer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role",
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

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const fetchUser = await User.findOne({ email });

    // Same message for "no such user" and "wrong password"
    if (!fetchUser || !(await bcrypt.compare(password, fetchUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (fetchUser.accountType === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact support.",
      });
    }

    const token = jwt.sign(
      {
        id: fetchUser._id,
        role: fetchUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
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

    return res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
});

// TOP FREELANCERS (shown on the public home page)
router.get("/top-freelancers", async (req, res) => {
  try {
    // Exclude freelancers whose account has been blocked by an admin
    const blockedUsers = await User.find({ accountType: "Blocked" }, "_id");
    const blockedIds = blockedUsers.map((u) => u._id);

    const freelancers = await FreelancerProfile.aggregate([
      { $match: { userId: { $nin: blockedIds } } },

      // Count reviews so ties on rating are broken by number of reviews
      {
        $addFields: {
          reviewCount: { $size: { $ifNull: ["$reviews", []] } },
        },
      },

      { $sort: { rating: -1, reviewCount: -1, createdAt: -1 } },
      { $limit: 6 },

      // Public-safe fields only (no email, phone, etc.)
      {
        $project: {
          _id: 0,
          userId: 1,
          name: 1,
          title: 1,
          skills: 1,
          rating: 1,
          reviewCount: 1,
          experience: 1,
          hourlyRate: 1,
          image: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      freelancers,
    });
  } catch (error) {
    console.error("Top Freelancers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top freelancers",
    });
  }
});

// =========================================================
// JOBS
// =========================================================

// POST JOB (client only)
router.post(
  "/postjob",
  authMiddleware,
  roleMiddleware("client"),
  async (req, res) => {
    try {
      const {
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

      // The client is always the logged-in user (from the token)
      const client = req.user;

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

      if (!deadline || !String(deadline).trim()) {
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
        clientName: client.fullName,
        title: title.trim(),
        companyName: companyName?.trim() || "",
        description: description.trim(),
        projectType,
        experienceLevel,
        duration: duration?.trim() || "",
        budgetMin: minimumBudget,
        budgetMax: maximumBudget,
        deadline: String(deadline).trim(),
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
      });
    }
  },
);

// GET ALL JOBS (any logged-in user)
router.get("/postjobs", authMiddleware, async (req, res) => {
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

// GET A CLIENT'S OWN JOBS (client sees only their own, admin sees any)
router.get(
  "/postjobs/client/:clientId",
  authMiddleware,
  roleMiddleware("client", "admin"),
  async (req, res) => {
    try {
      const { clientId } = req.params;

      if (req.user.role === "client" && !sameId(clientId, req.user._id)) {
        return denied(res);
      }

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
  },
);

// GET SINGLE PROJECT (any logged-in user)
router.get("/postjobs/:id", authMiddleware, async (req, res) => {
  try {
    const project = await PostJob.findById(req.params.id);

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

// DELETE PROJECT (owner client, or admin)
router.delete(
  "/postjobs/:id",
  authMiddleware,
  roleMiddleware("client", "admin"),
  async (req, res) => {
    try {
      const project = await PostJob.findById(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      if (
        req.user.role === "client" &&
        !sameId(project.clientId, req.user._id)
      ) {
        return denied(res);
      }

      await PostJob.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Delete Project Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete project",
      });
    }
  },
);

// =========================================================
// FREELANCER PROFILES
// =========================================================

// CREATE / UPDATE OWN FREELANCER PROFILE (freelancer only)
router.post(
  "/freelancerprofile",
  authMiddleware,
  roleMiddleware("freelancer"),
  async (req, res) => {
    try {
      const {
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

      // The profile always belongs to the logged-in user
      const user = req.user;
      const userId = user._id;

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
      });
    }
  },
);

// GET ALL FREELANCER PROFILES (client browse page, any logged-in user)
router.get("/freelancerprofiles", authMiddleware, async (req, res) => {
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

// GET ALL FREELANCERS (admin list, merged User + Profile)
router.get(
  "/freelancerprofile",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
          createdAt: user.createdAt,
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
  },
);

// GET SINGLE FREELANCER PROFILE (any logged-in user)
router.get("/freelancerprofile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

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
    });
  }
});

// RATE FREELANCER (client only)
router.post(
  "/freelancerprofile/:userId/rate",
  authMiddleware,
  roleMiddleware("client"),
  async (req, res) => {
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
  },
);

// SUBMIT REVIEW FOR A FREELANCER (client only)
router.post(
  "/freelancerprofile/:userId/review",
  authMiddleware,
  roleMiddleware("client"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { rating, comment } = req.body;

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

      // The reviewer is always the logged-in client
      profile.reviews.push({
        clientId: req.user._id,
        clientName: req.user.fullName || "Anonymous",
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
  },
);

// =========================================================
// MESSAGES
// =========================================================

// GET MESSAGES BETWEEN TWO USERS (only the two participants)
router.get("/messages/:userA/:userB", authMiddleware, async (req, res) => {
  try {
    const { userA, userB } = req.params;

    if (!sameId(req.user._id, userA) && !sameId(req.user._id, userB)) {
      return denied(res);
    }

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

// GET CONVERSATION PARTNERS (only your own conversations)
router.get("/conversations/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!sameId(req.user._id, userId)) {
      return denied(res);
    }

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
    }).select("fullName");

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
// PROPOSALS
// =========================================================

// SUBMIT PROPOSAL (freelancer only)
router.post(
  "/proposals/:projectId",
  authMiddleware,
  roleMiddleware("freelancer"),
  async (req, res) => {
    try {
      const { bidAmount, deliveryTime, coverLetter } = req.body;

      // The proposal always comes from the logged-in freelancer
      const freelancer = req.user;

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

      const existingProposal = await Proposal.findOne({
        projectId: project._id,
        freelancerId: freelancer._id,
      });

      if (existingProposal) {
        return res.status(400).json({
          success: false,
          message: "You have already submitted a proposal for this project",
        });
      }

      const proposal = await Proposal.create({
        projectId: project._id,
        projectName: project.title,
        freelancerId: freelancer._id,
        clientId: project.clientId,
        bidAmount: Number(bidAmount),
        deliveryTime: Number(deliveryTime),
        coverLetter: coverLetter.trim(),
        status: "pending",
      });

      project.proposals = (project.proposals || 0) + 1;
      await project.save();

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
      });
    }
  },
);

// GET PROPOSALS FOR A PROJECT (project owner client, or admin)
router.get(
  "/proposals/project/:projectId",
  authMiddleware,
  roleMiddleware("client", "admin"),
  async (req, res) => {
    try {
      const project = await PostJob.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      if (
        req.user.role === "client" &&
        !sameId(project.clientId, req.user._id)
      ) {
        return denied(res);
      }

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
      });
    }
  },
);

// GET PROPOSALS FOR A FREELANCER (that freelancer, or admin)
router.get(
  "/proposals/freelancer/:freelancerId",
  authMiddleware,
  roleMiddleware("freelancer", "admin"),
  async (req, res) => {
    try {
      if (
        req.user.role === "freelancer" &&
        !sameId(req.params.freelancerId, req.user._id)
      ) {
        return denied(res);
      }

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
      });
    }
  },
);

// ACCEPT A PROPOSAL (the client who owns the project)
router.patch(
  "/proposals/:proposalId/accept",
  authMiddleware,
  roleMiddleware("client"),
  async (req, res) => {
    try {
      const { proposalId } = req.params;

      const proposal = await Proposal.findById(proposalId);

      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      if (!sameId(proposal.clientId, req.user._id)) {
        return denied(res);
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
      });
    }
  },
);

// UPDATE PROPOSAL PROGRESS (only the freelancer or client on that proposal)
router.patch(
  "/proposals/:proposalId/progress",
  authMiddleware,
  roleMiddleware("client", "freelancer"),
  async (req, res) => {
    try {
      const progress = Number(req.body.progress);

      if (![0, 25, 50, 75, 100].includes(progress)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid progress value" });
      }

      const existing = await Proposal.findById(req.params.proposalId);

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Proposal not found" });
      }

      const isParticipant =
        sameId(existing.freelancerId, req.user._id) ||
        sameId(existing.clientId, req.user._id);

      if (!isParticipant) {
        return denied(res);
      }

      const proposal = await Proposal.findByIdAndUpdate(
        req.params.proposalId,
        { progress },
        { new: true },
      );

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
  },
);

// =========================================================
// CLIENT PROFILES
// =========================================================

// CREATE / UPDATE OWN CLIENT PROFILE (client only)
router.post(
  "/clientprofile",
  authMiddleware,
  roleMiddleware("client"),
  async (req, res) => {
    try {
      const {
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

      // The profile always belongs to the logged-in client
      const client = req.user;
      const clientId = client._id;

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
      });
    }
  },
);

// GET A CLIENT PROFILE (any logged-in user)
router.get("/clientprofile/:clientId", authMiddleware, async (req, res) => {
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
    });
  }
});

// =========================================================
// ADMIN ONLY
// =========================================================

// GET ALL CLIENTS (admin list, merged User + Profile)
router.get(
  "/clients",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const clientUsers = await User.find({ role: "client" })
        .sort({ createdAt: -1 })
        .lean();

      const profiles = await ClientProfile.find().lean();

      const profileMap = new Map();

      profiles.forEach((profile) => {
        profileMap.set(String(profile.clientId), profile);
      });

      const merged = clientUsers.map((user) => {
        const profile = profileMap.get(String(user._id));

        return {
          clientId: user._id,
          fullName: user.fullName || "",
          email: user.email || "",
          createdAt: user.registeredAt || user.createdAt || null,
          clientName: profile?.clientName || user.fullName || "",
          companyName: profile?.companyName || "",
          location: profile?.location || "",
          clientType: profile?.clientType || "",
          hiringStatus: profile?.hiringStatus || "",
          image: profile?.image || "",
          hasProfile: Boolean(profile),
          accountType: user.accountType || "Active",
        };
      });

      return res.status(200).json(merged);
    } catch (error) {
      console.error("Error fetching clients:", error);

      return res.status(500).json({
        message: "Failed to fetch clients",
      });
    }
  },
);

// GET SINGLE CLIENT (admin detail view)
router.get(
  "/client/:clientId",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
  },
);

// DELETE FREELANCER
router.post(
  "/admin/delete-freelancer/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role !== "freelancer") {
        return res.status(400).json({
          success: false,
          message: "This user is not a freelancer",
        });
      }

      await FreelancerProfile.deleteOne({ userId });
      await User.findByIdAndDelete(userId);

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
  },
);

// DELETE CLIENT
router.post(
  "/admin/delete-client/:clientId",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
          message: "Client not found",
        });
      }

      if (user.role !== "client") {
        return res.status(400).json({
          success: false,
          message: "This user is not a client",
        });
      }

      await ClientProfile.deleteOne({ clientId });
      await PostJob.deleteMany({ clientId });
      await Proposal.deleteMany({ clientId });
      await Message.deleteMany({
        $or: [{ senderId: clientId }, { receiverId: clientId }],
      });
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
      });
    }
  },
);

// BLOCK / UNBLOCK CLIENT (toggle)
router.post(
  "/admin/blockclient/:clientId",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
  },
);

// BLOCK / UNBLOCK FREELANCER (toggle, accountType is stored only in User)
router.post(
  "/admin/blockfreelancers/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
  },
);

// DASHBOARD STATS
router.get(
  "/dashboard-stats",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
      console.error("Dashboard Stats Error:", error);

      res.status(500).json({
        message: "Failed to fetch dashboard statistics",
      });
    }
  },
);

// RECENT USERS
router.get(
  "/recent-users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
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
  },
);

// RECENT PROJECTS
router.get(
  "/recent-projects",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const projects = await PostJob.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title description status clientName companyName createdAt");

      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      console.error("Recent Projects Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch recent projects",
      });
    }
  },
);

// ALL PROJECTS (admin list, with hired freelancer name)
router.get(
  "/admin/projects",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const jobs = await PostJob.find().sort({ createdAt: -1 });

      // Collect hired freelancer IDs and fetch their names in one query
      const freelancerIds = jobs
        .map((job) => job.assignedFreelancerId)
        .filter(Boolean);

      const freelancers = await User.find(
        { _id: { $in: freelancerIds } },
        "fullName",
      );

      const nameMap = new Map();
      freelancers.forEach((f) => {
        nameMap.set(String(f._id), f.fullName);
      });

      const projects = jobs.map((job) => ({
        ...job.toObject(),
        assignedFreelancerName: job.assignedFreelancerId
          ? nameMap.get(String(job.assignedFreelancerId)) || ""
          : "",
      }));

      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      console.error("Admin Get Projects Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
      });
    }
  },
);

// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;
