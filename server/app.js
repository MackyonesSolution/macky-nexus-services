const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_EMAIL = "admin@mackynexus.com";
const ADMIN_PASSWORD = "Macky143921";
const ADMIN_TOKEN = "macky-admin-token";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_requirements (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      requirement TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_providers (
      id BIGSERIAL PRIMARY KEY,
      company_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      service_type TEXT NOT NULL,
      city TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
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

app.post("/api/send-otp", async (req, res) => {
  try {
    const mobile = String(req.body.mobile || "").trim();

    if (!mobile) {
      return res.status(400).json({
        ok: false,
        message: "Mobile number is required",
      });
    }

    if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
      return res.status(500).json({
        ok: false,
        message: "MSG91 configuration missing",
      });
    }

    const response = await fetch("https://control.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: MSG91_TEMPLATE_ID,
        mobile: `91${mobile}`,
      }),
    });

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Failed to send OTP",
    });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  try {
    const mobile = String(req.body.mobile || "").trim();
    const otp = String(req.body.otp || "").trim();

    if (!mobile || !otp) {
      return res.status(400).json({
        ok: false,
        message: "Mobile number and OTP are required",
      });
    }

    if (!MSG91_AUTH_KEY) {
      return res.status(500).json({
        ok: false,
        message: "MSG91 configuration missing",
      });
    }

    const url = `https://control.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        authkey: MSG91_AUTH_KEY,
      },
    });

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Failed to verify OTP",
    });
  }
});

app.post("/api/customer-requirements", async (req, res) => {
  try {
    const { name, phone, email, location, category, requirement } = req.body;

    if (!name || !phone || !email || !location || !category || !requirement) {
      return res.status(400).json({
        ok: false,
        message: "All customer fields are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO customer_requirements
      (name, phone, email, location, category, requirement)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        name,
        phone,
        email,
        location,
        category,
        requirement,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
      `,
      [name, phone, email, location, category, requirement]
    );

    return res.json({
      ok: true,
      message: "Customer requirement submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.post("/api/service-providers", async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      phone,
      email,
      serviceType,
      city,
      details,
    } = req.body;

    if (
      !companyName ||
      !contactPerson ||
      !phone ||
      !email ||
      !serviceType ||
      !city ||
      !details
    ) {
      return res.status(400).json({
        ok: false,
        message: "All provider fields are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO service_providers
      (company_name, contact_person, phone, email, service_type, city, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        company_name AS "companyName",
        contact_person AS "contactPerson",
        phone,
        email,
        service_type AS "serviceType",
        city,
        details,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
      `,
      [companyName, contactPerson, phone, email, serviceType, city, details]
    );

    return res.json({
      ok: true,
      message: "Service provider registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
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

app.get("/api/admin/dashboard", async (req, res) => {
  try {
    if (!checkAdmin(req, res)) return;

    const customers = await pool.query(`
      SELECT
        id,
        name,
        phone,
        email,
        location,
        category,
        requirement,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
      FROM customer_requirements
      ORDER BY id DESC
    `);

    const providers = await pool.query(`
      SELECT
        id,
        company_name AS "companyName",
        contact_person AS "contactPerson",
        phone,
        email,
        service_type AS "serviceType",
        city,
        details,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
      FROM service_providers
      ORDER BY id DESC
    `);

    return res.json({
      ok: true,
      customerRequirements: customers.rows,
      serviceProviders: providers.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.delete("/api/admin/customer-requirements/:id", async (req, res) => {
  try {
    if (!checkAdmin(req, res)) return;

    await pool.query(
      `DELETE FROM customer_requirements WHERE id = $1`,
      [req.params.id]
    );

    return res.json({
      ok: true,
      message: "Customer requirement deleted permanently",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.delete("/api/admin/service-providers/:id", async (req, res) => {
  try {
    if (!checkAdmin(req, res)) return;

    await pool.query(
      `DELETE FROM service_providers WHERE id = $1`,
      [req.params.id]
    );

    return res.json({
      ok: true,
      message: "Service provider deleted permanently",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database init failed:", error);
    process.exit(1);
  });