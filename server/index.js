const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Macky Nexus backend running" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, phone, email, password, userType, city } = req.body;

    if (!fullName || !phone || !email || !password || !userType || !city) {
      return res.status(400).json({ ok: false, message: "Required fields missing" });
    }

    return res.json({
      ok: true,
      message: "Signup successful",
      user: { fullName, phone, email, userType, city },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ ok: false, message: "Required fields missing" });
    }

    return res.json({
      ok: true,
      message: "Login successful",
      role,
      user: { email, role },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.post("/api/requirements", async (req, res) => {
  try {
    const { name, phone, email, category, location, serviceDate, requirement } = req.body;

    if (!name || !phone || !email || !category || !location || !requirement) {
      return res.status(400).json({ ok: false, message: "Required fields missing" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `New Requirement - ${category}`,
      html: `
        <h2>New Requirement Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Preferred Date:</strong> ${serviceDate || "Not provided"}</p>
        <p><strong>Requirement:</strong> ${requirement}</p>
      `,
    });

    return res.json({ ok: true, message: "Requirement submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Unable to submit requirement" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});