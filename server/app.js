const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_EMAIL = "admin@mackynexus.com";
const ADMIN_PASSWORD = "Macky143921";
const ADMIN_TOKEN = "macky-admin-token";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      role VARCHAR(30) NOT NULL,
      name VARCHAR(120) NOT NULL,
      mobile VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_requirements (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(150),
      location VARCHAR(150) NOT NULL,
      category VARCHAR(120) NOT NULL,
      requirement TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_providers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      company_name VARCHAR(150) NOT NULL,
      contact_person VARCHAR(120) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(150),
      service_type VARCHAR(150) NOT NULL,
      city VARCHAR(120) NOT NULL,
      details TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend working" });
});

function formatRows(rows) {
  return rows.map((row) => ({
    ...row,
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleString("en-IN")
      : "",
  }));
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 6;
}

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { role, name, mobile, email, password } = req.body;

    if (!role || !name || !mobile || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "All fields are required",
      });
    }

    if (!["customer", "provider"].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid role",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email address",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1 OR mobile = $2`,
      [email.trim().toLowerCase(), mobile.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "User already exists with this email or mobile",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (role, name, mobile, email, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, role, name, mobile, email, created_at`,
      [role, name.trim(), mobile.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    return res.json({
      ok: true,
      message: `${role === "customer" ? "Customer" : "Service Provider"} signup successful`,
      user: {
        id: result.rows[0].id,
        role: result.rows[0].role,
        name: result.rows[0].name,
        mobile: result.rows[0].mobile,
        email: result.rows[0].email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error during signup",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { role, login, password } = req.body;

    if (!role || !login || !password) {
      return res.status(400).json({
        ok: false,
        message: "Role, login and password are required",
      });
    }

    if (!["customer", "provider"].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid role",
      });
    }

    const userResult = await pool.query(
      `SELECT * FROM users
       WHERE role = $1 AND (email = $2 OR mobile = $2)
       LIMIT 1`,
      [role, login.trim().toLowerCase()]
    );

    let user = userResult.rows[0];

    if (!user) {
      const altUserResult = await pool.query(
        `SELECT * FROM users
         WHERE role = $1 AND mobile = $2
         LIMIT 1`,
        [role, login.trim()]
      );
      user = altUserResult.rows[0];
    }

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        message: "Invalid password",
      });
    }

    return res.json({
      ok: true,
      message: "Login successful",
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error during login",
    });
  }
});

app.post("/api/customer-requirements", async (req, res) => {
  try {
    const {
      userId,
      name,
      phone,
      email,
      location,
      category,
      requirement,
    } = req.body;

    if (!name || !phone || !location || !category || !requirement) {
      return res.status(400).json({
        ok: false,
        message: "Required fields missing",
      });
    }

    await pool.query(
      `INSERT INTO customer_requirements
      (user_id, name, phone, email, location, category, requirement)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userId || null,
        name.trim(),
        phone.trim(),
        email ? email.trim().toLowerCase() : "",
        location.trim(),
        category.trim(),
        requirement.trim(),
      ]
    );

    return res.json({
      ok: true,
      message: "Customer requirement submitted successfully",
    });
  } catch (error) {
    console.error("Customer requirement error:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.post("/api/service-providers", async (req, res) => {
  try {
    const {
      userId,
      companyName,
      contactPerson,
      phone,
      email,
      serviceType,
      city,
      details,
    } = req.body;

    if (!companyName || !contactPerson || !phone || !serviceType || !city || !details) {
      return res.status(400).json({
        ok: false,
        message: "Required fields missing",
      });
    }

    await pool.query(
      `INSERT INTO service_providers
      (user_id, company_name, contact_person, phone, email, service_type, city, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId || null,
        companyName.trim(),
        contactPerson.trim(),
        phone.trim(),
        email ? email.trim().toLowerCase() : "",
        serviceType.trim(),
        city.trim(),
        details.trim(),
      ]
    );

    return res.json({
      ok: true,
      message: "Service provider registered successfully",
    });
  } catch (error) {
    console.error("Service provider error:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({
      ok: true,
      message: "Admin login successful",
      token: ADMIN_TOKEN,
    });
  }

  return res.status(401).json({
    ok: false,
    message: "Invalid admin credentials",
  });
});

app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];

    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    const customerRequirements = await pool.query(
      `SELECT * FROM customer_requirements ORDER BY id DESC`
    );

    const serviceProviders = await pool.query(
      `SELECT
        id,
        company_name,
        contact_person,
        phone,
        email,
        service_type,
        city,
        details,
        created_at
      FROM service_providers
      ORDER BY id DESC`
    );

    const formattedProviders = serviceProviders.rows.map((row) => ({
      id: row.id,
      companyName: row.company_name,
      contactPerson: row.contact_person,
      phone: row.phone,
      email: row.email,
      serviceType: row.service_type,
      city: row.city,
      details: row.details,
      createdAt: row.created_at
        ? new Date(row.created_at).toLocaleString("en-IN")
        : "",
    }));

    return res.json({
      ok: true,
      customerRequirements: formatRows(customerRequirements.rows),
      serviceProviders: formattedProviders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.delete("/api/admin/customer-requirements/:id", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];

    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    await pool.query(`DELETE FROM customer_requirements WHERE id = $1`, [
      req.params.id,
    ]);

    return res.json({
      ok: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
});

app.delete("/api/admin/service-providers/:id", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];

    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized",
      });
    }

    await pool.query(`DELETE FROM service_providers WHERE id = $1`, [
      req.params.id,
    ]);

    return res.json({
      ok: true,
      message: "Service provider deleted successfully",
    });
  } catch (error) {
    console.error("Delete provider error:", error);
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