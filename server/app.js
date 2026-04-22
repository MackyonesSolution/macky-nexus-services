const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const customerRequirements = [];
const serviceProviders = [];

const ADMIN_EMAIL = "admin@mackynexus.com";
const ADMIN_PASSWORD = "123456";
const ADMIN_TOKEN = "macky-admin-token";

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.post("/api/customer-requirements", (req, res) => {
  try {
    const { name, phone, email, location, category, requirement } = req.body;

    if (!name || !phone || !email || !location || !category || !requirement) {
      return res.status(400).json({
        ok: false,
        message: "All customer fields are required",
      });
    }

    const newRequirement = {
      id: Date.now(),
      name,
      phone,
      email,
      location,
      category,
      requirement,
      createdAt: new Date().toLocaleString(),
    };

    customerRequirements.unshift(newRequirement);

    return res.json({
      ok: true,
      message: "Customer requirement submitted successfully",
      data: newRequirement,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.post("/api/service-providers", (req, res) => {
  try {
    const { companyName, contactPerson, phone, email, serviceType, city, details } = req.body;

    if (!companyName || !contactPerson || !phone || !email || !serviceType || !city || !details) {
      return res.status(400).json({
        ok: false,
        message: "All provider fields are required",
      });
    }

    const newProvider = {
      id: Date.now(),
      companyName,
      contactPerson,
      phone,
      email,
      serviceType,
      city,
      details,
      createdAt: new Date().toLocaleString(),
    };

    serviceProviders.unshift(newProvider);

    return res.json({
      ok: true,
      message: "Service provider registered successfully",
      data: newProvider,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.post("/api/admin/login", (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.json({
        ok: true,
        message: "Admin login successful",
        token: ADMIN_TOKEN,
      });
    }

    return res.status(401).json({
      ok: false,
      message: "Invalid admin email or password",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.get("/api/admin/dashboard", (req, res) => {
  try {
    const token = req.headers["x-admin-token"];

    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    return res.json({
      ok: true,
      customerRequirements,
      serviceProviders,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});