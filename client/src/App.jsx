import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:5000";

function App() {
  const [page, setPage] = useState("home");
  const [adminToken, setAdminToken] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [providerList, setProviderList] = useState([]);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    category: "",
    requirement: "",
  });

  const [providerForm, setProviderForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    serviceType: "",
    city: "",
    details: "",
  });

  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  });

  const handleCustomerChange = (e) => {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  };

  const handleProviderChange = (e) => {
    setProviderForm({ ...providerForm, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-requirements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerForm),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setCustomerForm({
          name: "",
          phone: "",
          email: "",
          location: "",
          category: "",
          requirement: "",
        });
      }
    } catch (error) {
      alert("Customer form submission failed");
      console.log(error);
    }
  };

  const handleProviderSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/service-providers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerForm),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setProviderForm({
          companyName: "",
          contactPerson: "",
          phone: "",
          email: "",
          serviceType: "",
          city: "",
          details: "",
        });
      }
    } catch (error) {
      alert("Provider form submission failed");
      console.log(error);
    }
  };

  const loadDashboard = async (tokenValue = adminToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: {
          "x-admin-token": tokenValue,
        },
      });

      const data = await res.json();

      if (data.ok) {
        setCustomerList(data.customerRequirements || []);
        setProviderList(data.serviceProviders || []);
      } else {
        alert(data.message || "Unable to load dashboard");
      }
    } catch (error) {
      alert("Dashboard loading failed");
      console.log(error);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminForm),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setAdminToken(data.token);
        setPage("adminDashboard");
        await loadDashboard(data.token);
      }
    } catch (error) {
      alert("Admin login failed");
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === "adminDashboard" && adminToken) {
      loadDashboard(adminToken);
    }
  }, [page, adminToken]);

  if (page === "customer") {
    return (
      <div className="site">
        <header className="header">
          <div className="brand">
            <h1>Macky Nexus Services ⭐</h1>
            <p>Your Trusted Network for Services, Vendors & Opportunities</p>
          </div>

          <nav className="nav">
            <button className="nav-btn" type="button" onClick={() => setPage("home")}>
              Home
            </button>
            <button className="nav-btn" type="button" onClick={() => setPage("provider")}>
              Service Provider
            </button>
            <button className="nav-btn" type="button" onClick={() => setPage("adminLogin")}>
              Admin
            </button>
          </nav>
        </header>

        <section className="section section-dark">
          <div className="section-title">
            <h2>Customer Requirement Form</h2>
            <p>Post your requirement and connect with the right service provider.</p>
          </div>

          <form className="contact-form" onSubmit={handleCustomerSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={customerForm.name}
                onChange={handleCustomerChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={customerForm.phone}
                onChange={handleCustomerChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={customerForm.email}
                onChange={handleCustomerChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location / City"
                value={customerForm.location}
                onChange={handleCustomerChange}
              />
            </div>

            <select
              name="category"
              value={customerForm.category}
              onChange={handleCustomerChange}
            >
              <option value="">Select Service Category</option>
              <option value="Vendor Requirement">Vendor Requirement</option>
              <option value="Solar Service">Solar Service</option>
              <option value="Property Service">Property Service</option>
              <option value="Freelancer Requirement">Freelancer Requirement</option>
              <option value="IT Company Service">IT Company Service</option>
              <option value="Telecom Support">Telecom Support</option>
            </select>

            <textarea
              name="requirement"
              placeholder="Write your requirement here"
              rows="6"
              value={customerForm.requirement}
              onChange={handleCustomerChange}
            ></textarea>

            <button type="submit">Submit Requirement</button>
          </form>
        </section>

        <footer className="footer">
          <p>© 2026 Macky Nexus Services ⭐ | All Rights Reserved</p>
        </footer>
      </div>
    );
  }

  if (page === "provider") {
    return (
      <div className="site">
        <header className="header">
          <div className="brand">
            <h1>Macky Nexus Services ⭐</h1>
            <p>Your Trusted Network for Services, Vendors & Opportunities</p>
          </div>

          <nav className="nav">
            <button className="nav-btn" type="button" onClick={() => setPage("home")}>
              Home
            </button>
            <button className="nav-btn" type="button" onClick={() => setPage("customer")}>
              Customer
            </button>
            <button className="nav-btn" type="button" onClick={() => setPage("adminLogin")}>
              Admin
            </button>
          </nav>
        </header>

        <section className="section section-dark">
          <div className="section-title">
            <h2>Service Provider Registration Form</h2>
            <p>Register your services and grow your business through the platform.</p>
          </div>

          <form className="contact-form" onSubmit={handleProviderSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="companyName"
                placeholder="Company / Business Name"
                value={providerForm.companyName}
                onChange={handleProviderChange}
              />
              <input
                type="text"
                name="contactPerson"
                placeholder="Contact Person Name"
                value={providerForm.contactPerson}
                onChange={handleProviderChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={providerForm.phone}
                onChange={handleProviderChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={providerForm.email}
                onChange={handleProviderChange}
              />
              <input
                type="text"
                name="serviceType"
                placeholder="Service Type"
                value={providerForm.serviceType}
                onChange={handleProviderChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City / Location"
                value={providerForm.city}
                onChange={handleProviderChange}
              />
            </div>

            <textarea
              name="details"
              placeholder="Write your service details here"
              rows="6"
              value={providerForm.details}
              onChange={handleProviderChange}
            ></textarea>

            <button type="submit">Register as Service Provider</button>
          </form>
        </section>

        <footer className="footer">
          <p>© 2026 Macky Nexus Services ⭐ | All Rights Reserved</p>
        </footer>
      </div>
    );
  }

  if (page === "adminLogin") {
    return (
      <div className="site">
        <header className="header">
          <div className="brand">
            <h1>Macky Nexus Services ⭐</h1>
            <p>Your Trusted Network for Services, Vendors & Opportunities</p>
          </div>

          <nav className="nav">
            <button className="nav-btn" type="button" onClick={() => setPage("home")}>
              Home
            </button>
            <button className="nav-btn" type="button" onClick={() => setPage("customer")}>
              Customer
            </button>
            <button className="nav-btn" type="button" onClick={() => setPage("provider")}>
              Provider
            </button>
          </nav>
        </header>

        <section className="section section-dark">
          <div className="section-title">
            <h2>Admin Login</h2>
            <p>Login to access admin dashboard.</p>
          </div>

          <form className="contact-form" onSubmit={handleAdminLogin}>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={adminForm.email}
              onChange={handleAdminChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              value={adminForm.password}
              onChange={handleAdminChange}
            />
            <button type="submit">Login as Admin</button>
          </form>

          <div className="admin-note">
            <p><strong>Demo Admin Email:</strong> admin@mackynexus.com</p>
            <p><strong>Demo Password:</strong> 123456</p>
          </div>
        </section>

        <footer className="footer">
          <p>© 2026 Macky Nexus Services ⭐ | All Rights Reserved</p>
        </footer>
      </div>
    );
  }

  if (page === "adminDashboard") {
    return (
      <div className="site">
        <header className="header">
          <div className="brand">
            <h1>Macky Nexus Services ⭐</h1>
            <p>Admin Dashboard</p>
          </div>

          <nav className="nav">
            <button className="nav-btn" type="button" onClick={() => setPage("home")}>
              Home
            </button>
            <button className="nav-btn" type="button" onClick={loadDashboard}>
              Refresh
            </button>
          </nav>
        </header>

        <section className="section">
          <div className="section-title">
            <h2>Customer Requirements</h2>
            <p>Submitted customer data is shown below.</p>
          </div>

          <div className="dashboard-list">
            {customerList.length === 0 ? (
              <div className="card">
                <h3>No Customer Data Yet</h3>
                <p>Customer form submissions will appear here.</p>
              </div>
            ) : (
              customerList.map((item) => (
                <div className="card" key={item.id}>
                  <h3>{item.category}</h3>
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Requirement:</strong> {item.requirement}</p>
                  <p><strong>Submitted:</strong> {item.createdAt}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section section-dark">
          <div className="section-title">
            <h2>Service Providers</h2>
            <p>Registered provider data is shown below.</p>
          </div>

          <div className="dashboard-list">
            {providerList.length === 0 ? (
              <div className="card">
                <h3>No Provider Data Yet</h3>
                <p>Provider registrations will appear here.</p>
              </div>
            ) : (
              providerList.map((item) => (
                <div className="card" key={item.id}>
                  <h3>{item.companyName}</h3>
                  <p><strong>Contact Person:</strong> {item.contactPerson}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Service Type:</strong> {item.serviceType}</p>
                  <p><strong>City:</strong> {item.city}</p>
                  <p><strong>Details:</strong> {item.details}</p>
                  <p><strong>Submitted:</strong> {item.createdAt}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="footer">
          <p>© 2026 Macky Nexus Services ⭐ | All Rights Reserved</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="site">
      <header className="header">
        <div className="brand">
          <h1>Macky Nexus Services ⭐</h1>
          <p>Your Trusted Network for Services, Vendors & Opportunities</p>
        </div>

        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#roles">Roles</a>
          <a href="#why">Why Us</a>
          <a href="#contact">Contact</a>
          <button className="nav-btn" type="button" onClick={() => setPage("adminLogin")}>
            Admin
          </button>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-text">
          <span className="badge">
            One Platform • Multiple Services • Direct Opportunities
          </span>

          <h2>
            The Smart Marketplace for Customers, Vendors, Freelancers,
            Companies & Service Providers
          </h2>

          <p>
            Macky Nexus Services connects people who need services with the
            people who provide them. From vendors and freelancers to solar,
            property, IT, and telecom services, everything is available in one
            trusted platform.
          </p>

          <div className="hero-buttons">
            <button type="button" onClick={() => setPage("customer")}>
              Customer Login
            </button>

            <button
              type="button"
              className="outline"
              onClick={() => setPage("provider")}
            >
              Service Provider Login
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-box">
              <h3>All-in-One</h3>
              <p>Services Marketplace</p>
            </div>
            <div className="stat-box">
              <h3>Direct</h3>
              <p>Customer Connection</p>
            </div>
            <div className="stat-box">
              <h3>Fast</h3>
              <p>Requirement Posting</p>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <h3>What You Get Here</h3>
          <ul>
            <li>✔ Vendor Marketplace</li>
            <li>✔ Solar Services</li>
            <li>✔ Property Services</li>
            <li>✔ Freelancer Network</li>
            <li>✔ IT Company Support</li>
            <li>✔ Telecom Solutions</li>
            <li>✔ Requirement Posting</li>
            <li>✔ Business Opportunities</li>
          </ul>
        </div>
      </section>

      <section id="services" className="section">
        <div className="section-title">
          <h2>Our Service Categories</h2>
          <p>
            Explore trusted professionals, companies, and service partners
            across multiple industries.
          </p>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Vendor Marketplace</h3>
            <p>Find trusted vendors, contractors, and service teams for business needs.</p>
          </div>
          <div className="card">
            <h3>Solar Services</h3>
            <p>Connect with solar installation companies and experts.</p>
          </div>
          <div className="card">
            <h3>Property Services</h3>
            <p>Get property support and professional maintenance services.</p>
          </div>
          <div className="card">
            <h3>Freelancer Network</h3>
            <p>Hire freelancers for technical and digital work.</p>
          </div>
          <div className="card">
            <h3>IT Company Services</h3>
            <p>Find software, website, and technical support providers.</p>
          </div>
          <div className="card">
            <h3>Telecom Solutions</h3>
            <p>Get telecom support for FTTH and field work.</p>
          </div>
        </div>
      </section>

      <section id="roles" className="section section-dark">
        <div className="section-title">
          <h2>Who Can Use This Platform?</h2>
          <p>Macky Nexus Services is designed for every side of the marketplace.</p>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Customers / Clients</h3>
            <p>Search services and post your requirements.</p>
          </div>
          <div className="card">
            <h3>Service Providers</h3>
            <p>Register your business and get direct leads.</p>
          </div>
          <div className="card">
            <h3>Freelancers / Vendors</h3>
            <p>Find work opportunities and business connections.</p>
          </div>
          <div className="card">
            <h3>Companies / Businesses</h3>
            <p>Post requirements and hire trusted service partners.</p>
          </div>
        </div>
      </section>

      <section id="why" className="section">
        <div className="section-title">
          <h2>Why Choose Macky Nexus Services?</h2>
          <p>Built to simplify service discovery and business growth.</p>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Trusted Connections</h3>
            <p>Connect with providers in a clear and professional way.</p>
          </div>
          <div className="card">
            <h3>Multiple Industries</h3>
            <p>One platform for solar, property, telecom, IT, and more.</p>
          </div>
          <div className="card">
            <h3>Growth Opportunities</h3>
            <p>Providers and companies can get more visibility and leads.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section section-dark">
        <div className="section-title">
          <h2>Quick Access</h2>
          <p>Choose how you want to use Macky Nexus Services.</p>
        </div>

        <div className="dashboard-list">
          <div className="card">
            <h3>Customer Requirement</h3>
            <p>Open customer form and post your requirement.</p>
            <button type="button" onClick={() => setPage("customer")}>
              Open Customer Form
            </button>
          </div>

          <div className="card">
            <h3>Service Provider Registration</h3>
            <p>Open provider form and register your services.</p>
            <button type="button" onClick={() => setPage("provider")}>
              Open Provider Form
            </button>
          </div>

          <div className="card">
            <h3>Admin Access</h3>
            <p>Open admin login and access dashboard.</p>
            <button type="button" onClick={() => setPage("adminLogin")}>
              Open Admin Login
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Macky Nexus Services ⭐ | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;