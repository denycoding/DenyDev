const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/generate-description", async (req, res) => {
  try {
    const { title, skills, companyName } = req.body;

    // Validate project title
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Please enter a valid project title.",
      });
    }

    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured.",
      });
    }

    // Prepare skills
    const safeSkills = Array.isArray(skills)
      ? skills.join(", ")
      : typeof skills === "string"
        ? skills
        : "Not specified";

    // Import Gemini SDK dynamically to work with CommonJS
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are a professional freelance project description writer
for DenyDev, a freelance marketplace.

Your task is to generate a project description based on the
PROJECT TITLE and COMPANY NAME.

PROJECT TITLE: ${title}
COMPANY NAME: ${companyName || "Not provided"}

STEP 1: IDENTIFY THE PROJECT DOMAIN

Analyze the project title and company name to understand
the actual type of work required.

Identify the most relevant domain, such as:

- Website Development
- Web Application Development
- Mobile Application Development
- Data Science and Data Analysis
- Construction Data Analysis
- Artificial Intelligence and Machine Learning
- Cloud Computing and DevOps
- Cybersecurity
- Database Management
- UI/UX Design
- API and Backend Development
- Business Intelligence and Reporting
- Automation and Scripting
- Other specialized technical or non-technical domains

STEP 2: FOLLOW THE TITLE'S ACTUAL MEANING

Generate a description that directly matches the project title
and its identified domain.

Examples:

1. Title: Construction Data Analysis
   Expected direction: Analyze construction-related data,
   project costs, timelines, resource usage, and performance
   metrics, if relevant to the title. Do not describe website
   development unless the title explicitly requests a website.

2. Title: Cloud Infrastructure Setup
   Expected direction: Cloud infrastructure, deployment,
   configuration, scalability, monitoring, and reliability.

3. Title: Cybersecurity Audit
   Expected direction: Security assessment, vulnerability
   identification, risk analysis, and security recommendations.

4. Title: Sales Data Analysis
   Expected direction: Analyze sales data, identify trends,
   measure performance, and create useful reports or insights.

5. Title: E-commerce Website Development
   Expected direction: Website pages, product listings,
   shopping cart, checkout, and other relevant website features.

6. Title: AI Customer Support Chatbot
   Expected direction: AI-powered conversations, customer
   queries, response generation, and chatbot functionality.

STEP 3: DESCRIPTION REQUIREMENTS

- Write approximately 30–60 words.
- Use simple, clear, professional English.
- Explain the main project objective.
- Include relevant features, tasks, and technical requirements
  appropriate to the identified domain.
- Consider the company name as contextual information only.
- Do not assume that every project requires a website, web app,
  dashboard, AI integration, or database.
- Do not invent specific requirements, technologies, company
  details, or features that are not supported by the title
  or provided context.
- If the title is ambiguous, use a reasonable general
  interpretation instead of inventing a specific solution.
- Return only the project description, without a heading,
  category label, introduction, or explanation.
`;

    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    const description = response.output_text?.trim();

    if (!description) {
      return res.status(502).json({
        message: "Gemini returned an empty description. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      description,
    });
  } catch (error) {
    console.error("Gemini description error:", error.message);

    return res.status(500).json({
      message: "Failed to generate description. Please try again.",
    });
  }
});

router.post("/generate-proposal", async (req, res) => {
  try {
    const {
      projectTitle,
      projectDescription,
      companyName,
      skills,
      budgetMin,
      budgetMax,
      deliveryTime,
      freelancerName,
      freelancerExperience,
      freelancerSkills,
      freelancerTitle,
      freelancerBudget,
      freelancerdeliveryTime,
    } = req.body;

    if (
      typeof projectTitle !== "string" ||
      !projectTitle.trim() ||
      typeof projectDescription !== "string" ||
      !projectDescription.trim()
    ) {
      return res.status(400).json({
        message: "Project title and description are required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured.",
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You write professional cover letter paragraphs for freelancers
applying to projects on DenyDev, a freelance marketplace.

Write a personalized cover letter as ONE continuous paragraph
of approximately 60 to 90 words in simple, professional English.

Project title: ${projectTitle}
Project description: ${projectDescription}
Client/company: ${companyName || "Client"}
Required skills: ${Array.isArray(skills) ? skills.join(", ") : "Not specified"}
Budget: ${
      budgetMin != null && budgetMax != null
        ? `₹${budgetMin} - ₹${budgetMax}`
        : "Not specified"
    }
Expected delivery time: ${deliveryTime || "Not specified"}
Freelancer name: ${freelancerName || "Freelancer"}
Freelancer Experience: ${freelancerExperience || "Freelancer"}
Freelancer title: ${freelancerTitle || "Not specified"}
Freelancer budget: ${freelancerBudget || "Not specified"}
Freelancer DeliverTime: ${freelancerdeliveryTime || "Not specified"}
Freelancer skills: ${
      Array.isArray(freelancerSkills)
        ? freelancerSkills.join(", ")
        : "Not specified"
    }

Instructions:
- Return exactly ONE paragraph.
- Do not use an email format.
- Do not include greetings such as "Dear Client" or "Hello".
- Do not include a subject line, heading, bullet points, or numbered lists.
- Do not include closing phrases such as "Best regards" or "Sincerely".
- Explain why the freelancer is suitable for this project.
- Connect relevant freelancer skills to the project requirements.
- Show interest in delivering quality work.
- Use Freelancer Budget and Delivery Time and mention in paragraph.
 - Do not invent details that were not provided.
- Return only the paragraph, with no extra explanation.
`;

    const response = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: prompt,
    });

    const coverLetter = response.output_text?.trim();

    if (!coverLetter) {
      return res.status(502).json({
        message: "AI returned an empty proposal. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      coverLetter,
    });
  } catch (error) {
    console.error("Gemini proposal error:", error.message);

    return res.status(500).json({
      message: "Failed to generate proposal. Please try again.",
    });
  }
});

router.post("/generate-bio", async (req, res) => {
  try {
    const { name, title, experience, phone, projects, skills, hourlyRate } =
      req.body;
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are a professional freelancer profile and bio writer
for DenyDev, a freelance marketplace.

Generate a professional, attractive, and trustworthy bio
for a freelancer using the information provided below.

FREELANCER DETAILS:
- Name: ${name || "Not provided"}
- Professional Title: ${title || "Not provided"}
- Experience: ${experience || "Not provided"}
- Phone: ${phone || "Not provided"}
- Projects: ${projects || "Not provided"}
- Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Not provided"}
- Hourly Rate: ${hourlyRate ? `₹${hourlyRate}/hour` : "Not provided"}

REQUIREMENTS:
- Write approximately 30–60 words.
- Use simple, clear, professional English.
- Introduce the freelancer naturally using their name and
  professional title when available.
- Highlight relevant skills and experience.
- Mention completed projects and their value when project
  information is provided.
- Explain how the freelancer can help clients solve problems.
- Maintain a confident but realistic tone.
- Make the bio suitable for a freelance marketplace profile.
- Do not invent qualifications, achievements, clients,
  project details, or years of experience.
- Do not mention missing information.
- Do not include the phone number or hourly rate in the bio;
  these details can be displayed separately on the profile.
- Avoid unnecessary repetition and generic claims.
- Return only the bio, without a heading or explanation.
`;

    const response = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: prompt,
    });
    const bio = response.output_text.trim();

    return res.status(200).json({
      success: true,
      bio,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
