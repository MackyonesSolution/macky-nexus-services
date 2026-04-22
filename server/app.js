const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const DATA_DIR = __dirname;
const CUSTOMERS_FILE = path.join(DATA_DIR, "customerRequirements.json");
const PROVIDERS_FILE = path.join(DATA_DIR, "serviceProviders.json");

const ADMIN_EMAIL = "admin@mackynexus.com";
const ADMIN_PASSWORD = "Macky143921";
const ADMIN_TOKEN = "macky-admin-token";

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
  }
}

function readData(filePath) {
  try {
    ensureFileExists(filePath);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (error) {
    return [];
  }
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function checkAdmin(req, res) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
    return false;
  }
  return true;
}

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

    const customerRequirements = readData(CUSTOMERS_FILE);

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
    writeData(CUSTOMERS_FILE, customerRequirements);

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

    const serviceProviders = readData(PROVIDERS_FILE);

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
    writeData(PROVIDERS_FILE, serviceProviders);

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
    if (!checkAdmin(req, res)) return;

    const customerRequirements = readData(CUSTOMERS_FILE);
    const serviceProviders = readData(PROVIDERS_FILE);

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

app.delete("/api/admin/customer-requirements/:id", (req, res) => {
  try {
    if (!checkAdmin(req, res)) return;

    const id = Number(req.params.id);
    const customerRequirements = readData(CUSTOMERS_FILE);
    const updatedRequirements = customerRequirements.filter((item) => item.id !== id);

    writeData(CUSTOMERS_FILE, updatedRequirements);

    return res.json({
      ok: true,
      message: "Customer requirement deleted permanently",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.delete("/api/admin/service-providers/:id", (req, res) => {
  try {
    if (!checkAdmin(req, res)) return;

    const id = Number(req.params.id);
    const serviceProviders = readData(PROVIDERS_FILE);
    const updatedProviders = serviceProviders.filter((item) => item.id !== id);

    writeData(PROVIDERS_FILE, updatedProviders);

    return res.json({
      ok: true,
      message: "Service provider deleted permanently",
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