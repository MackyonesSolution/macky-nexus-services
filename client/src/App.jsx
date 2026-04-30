import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

function App() {
  const [page, setPage] = useState("home");
  const [adminToken, setAdminToken] = useState("");
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [customerList, setCustomerList] = useState([]);
  const [providerList, setProviderList] = useState([]);

  const [customerSignup, setCustomerSignup] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [providerSignup, setProviderSignup] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [customerLogin, setCustomerLogin] = useState({
    login: "",
    password: "",
  });

  const [providerLogin, setProviderLogin] = useState({
    login: "",
    password: "",
  });

  const [loggedCustomer, setLoggedCustomer] = useState(null);
  const [loggedProvider, setLoggedProvider] = useState(null);

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

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  const handleCustomerSignupChange = (e) => {
    setCustomerSignup({ ...customerSignup, [e.target.name]: e.target.value });
  };

  const handleProviderSignupChange = (e) => {
    setProviderSignup({ ...providerSignup, [e.target.name]: e.target.value });
  };

  const handleCustomerLoginChange = (e) => {
    setCustomerLogin({ ...customerLogin, [e.target.name]: e.target.value });
  };

  const handleProviderLoginChange = (e) => {
    setProviderLogin({ ...providerLogin, [e.target.name]: e.target.value });
  };

  const handleCustomerFormChange = (e) => {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  };

  const handleProviderFormChange = (e) => {
    setProviderForm({ ...providerForm, [e.target.name]: e.target.value });
  };

  const customerSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "customer",
          name: customerSignup.name,
          mobile: customerSignup.mobile,
          email: customerSignup.email,
          password: customerSignup.password,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setCustomerSignup({ name: "", mobile: "", email: "", password: "" });
        setPage("customerLogin");
      }
    } catch (error) {
      alert("Customer signup failed");
      console.log(error);
    }
  };

  const providerSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "provider",
          name: providerSignup.name,
          mobile: providerSignup.mobile,
          email: providerSignup.email,
          password: providerSignup.password,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setProviderSignup({ name: "", mobile: "", email: "", password: "" });
        setPage("providerLogin");
      }
    } catch (error) {
      alert("Provider signup failed");
      console.log(error);
    }
  };

  const customerLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "customer",
          login: customerLogin.login,
          password: customerLogin.password,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setLoggedCustomer(data.user);
        setCustomerForm({
          name: data.user.name || "",
          phone: data.user.mobile || "",
          email: data.user.email || "",
          location: "",
          category: "",
          requirement: "",
        });
        setCustomerLogin({ login: "", password: "" });
        setPage("customer");
      }
    } catch (error) {
      alert("Customer login failed");
      console.log(error);
    }
  };

  const providerLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "provider",
          login: providerLogin.login,
          password: providerLogin.password,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setLoggedProvider(data.user);
        setProviderForm({
          companyName: "",
          contactPerson: data.user.name || "",
          phone: data.user.mobile || "",
          email: data.user.email || "",
          serviceType: "",
          city: "",
          details: "",
        });
        setProviderLogin({ login: "", password: "" });
        setPage("provider");
      }
    } catch (error) {
      alert("Provider login failed");
      console.log(error);
    }
  };

  const customerFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-requirements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedCustomer?.id || null,
          ...customerForm,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setCustomerForm({
          name: loggedCustomer?.name || "",
          phone: loggedCustomer?.mobile || "",
          email: loggedCustomer?.email || "",
          location: "",
          category: "",
          requirement: "",
        });
      }
    } catch (error) {
      alert("Customer form submit failed");
      console.log(error);
    }
  };

  const providerFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/service-providers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedProvider?.id || null,
          ...providerForm,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setProviderForm({
          companyName: "",
          contactPerson: loggedProvider?.name || "",
          phone: loggedProvider?.mobile || "",
          email: loggedProvider?.email || "",
          serviceType: "",
          city: "",
          details: "",
        });
      }
    } catch (error) {
      alert("Provider form submit failed");
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

  const adminLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const deleteCustomer = async (id) => {
    const ok = window.confirm("Delete this customer permanently?");
    if (!ok) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/customer-requirements/${id}`,
        {
          method: "DELETE",
          headers: { "x-admin-token": adminToken },
        }
      );

      const data = await res.json();
      alert(data.message);
      if (data.ok) loadDashboard();
    } catch (error) {
      alert("Delete failed");
      console.log(error);
    }
  };

  const deleteProvider = async (id) => {
    const ok = window.confirm("Delete this provider permanently?");
    if (!ok) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/service-providers/${id}`,
        {
          method: "DELETE",
          headers: { "x-admin-token": adminToken },
        }
      );

      const data = await res.json();
      alert(data.message);
      if (data.ok) loadDashboard();
    } catch (error) {
      alert("Delete failed");
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === "adminDashboard" && adminToken) {
      loadDashboard(adminToken);
    }
  }, [page, adminToken]);

  if (page === "customerSignup") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Customer Signup</h2>
            <p>Create your customer account</p>
          </div>

          <form className="contact-form" onSubmit={customerSignupSubmit}>
            <input type="text" name="name" placeholder="Full Name" value={customerSignup.name} onChange={handleCustomerSignupChange} />
            <input type="text" name="mobile" placeholder="Mobile Number" value={customerSignup.mobile} onChange={handleCustomerSignupChange} />
            <input type="email" name="email" placeholder="Email Address" value={customerSignup.email} onChange={handleCustomerSignupChange} />
            <input type="password" name="password" placeholder="Password" value={customerSignup.password} onChange={handleCustomerSignupChange} />
            <button type="submit">Create Customer Account</button>
          </form>

          <div className="admin-note">
            <p>Already have an account?</p>
            <button type="button" onClick={() => setPage("customerLogin")}>Go to Customer Login</button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "customerLogin") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Customer Login</h2>
            <p>Login with email or mobile and password</p>
          </div>

          <form className="contact-form" onSubmit={customerLoginSubmit}>
            <input type="text" name="login" placeholder="Email or Mobile" value={customerLogin.login} onChange={handleCustomerLoginChange} />
            <input type="password" name="password" placeholder="Password" value={customerLogin.password} onChange={handleCustomerLoginChange} />
            <button type="submit">Login as Customer</button>
          </form>

          <div className="admin-note">
            <p>New customer?</p>
            <button type="button" onClick={() => setPage("customerSignup")}>Create Customer Account</button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "providerSignup") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Service Provider Signup</h2>
            <p>Create your provider account</p>
          </div>

          <form className="contact-form" onSubmit={providerSignupSubmit}>
            <input type="text" name="name" placeholder="Contact Person Name" value={providerSignup.name} onChange={handleProviderSignupChange} />
            <input type="text" name="mobile" placeholder="Mobile Number" value={providerSignup.mobile} onChange={handleProviderSignupChange} />
            <input type="email" name="email" placeholder="Email Address" value={providerSignup.email} onChange={handleProviderSignupChange} />
            <input type="password" name="password" placeholder="Password" value={providerSignup.password} onChange={handleProviderSignupChange} />
            <button type="submit">Create Provider Account</button>
          </form>

          <div className="admin-note">
            <p>Already have an account?</p>
            <button type="button" onClick={() => setPage("providerLogin")}>Go to Provider Login</button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "providerLogin") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Service Provider Login</h2>
            <p>Login with email or mobile and password</p>
          </div>

          <form className="contact-form" onSubmit={providerLoginSubmit}>
            <input type="text" name="login" placeholder="Email or Mobile" value={providerLogin.login} onChange={handleProviderLoginChange} />
            <input type="password" name="password" placeholder="Password" value={providerLogin.password} onChange={handleProviderLoginChange} />
            <button type="submit">Login as Service Provider</button>
          </form>

          <div className="admin-note">
            <p>New service provider?</p>
            <button type="button" onClick={() => setPage("providerSignup")}>Create Provider Account</button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "customer") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Customer Requirement Form</h2>
            <p>Welcome, {loggedCustomer?.name}</p>
          </div>

          <form className="contact-form" onSubmit={customerFormSubmit}>
            <div className="form-grid">
              <input type="text" name="name" placeholder="Your Name" value={customerForm.name} onChange={handleCustomerFormChange} />
              <input type="text" name="phone" placeholder="Phone Number" value={customerForm.phone} onChange={handleCustomerFormChange} />
              <input type="email" name="email" placeholder="Email Address" value={customerForm.email} onChange={handleCustomerFormChange} />
              <input type="text" name="location" placeholder="Location / City" value={customerForm.location} onChange={handleCustomerFormChange} />
            </div>

            <select name="category" value={customerForm.category} onChange={handleCustomerFormChange}>
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
              onChange={handleCustomerFormChange}
            ></textarea>

            <button type="submit">Submit Requirement</button>
          </form>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "provider") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Service Provider Form</h2>
            <p>Welcome, {loggedProvider?.name}</p>
          </div>

          <form className="contact-form" onSubmit={providerFormSubmit}>
            <div className="form-grid">
              <input type="text" name="companyName" placeholder="Company / Business Name" value={providerForm.companyName} onChange={handleProviderFormChange} />
              <input type="text" name="contactPerson" placeholder="Contact Person Name" value={providerForm.contactPerson} onChange={handleProviderFormChange} />
              <input type="text" name="phone" placeholder="Phone Number" value={providerForm.phone} onChange={handleProviderFormChange} />
              <input type="email" name="email" placeholder="Email Address" value={providerForm.email} onChange={handleProviderFormChange} />
              <input type="text" name="serviceType" placeholder="Service Type" value={providerForm.serviceType} onChange={handleProviderFormChange} />
              <input type="text" name="city" placeholder="City / Location" value={providerForm.city} onChange={handleProviderFormChange} />
            </div>

            <textarea
              name="details"
              placeholder="Write your service details here"
              rows="6"
              value={providerForm.details}
              onChange={handleProviderFormChange}
            ></textarea>

            <button type="submit">Register as Service Provider</button>
          </form>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "adminLogin") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Admin Login</h2>
            <p>Login to access admin dashboard</p>
          </div>

          <form className="contact-form" onSubmit={adminLoginSubmit}>
            <input type="email" name="email" placeholder="Admin Email" value={adminForm.email} onChange={handleAdminChange} />
            <input type="password" name="password" placeholder="Admin Password" value={adminForm.password} onChange={handleAdminChange} />
            <button type="submit">Login as Admin</button>
          </form>

          <div className="admin-note">
            <p><strong>Demo Admin Email:</strong> admin@mackynexus.com</p>
            <p><strong>Demo Password:</strong> Macky143921</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "adminDashboard") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section">
          <div className="section-title">
            <h2>Customer Requirements</h2>
          </div>

          <div className="dashboard-list">
            {customerList.length === 0 ? (
              <div className="card"><h3>No Customer Data Yet</h3></div>
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
                  <button
                    onClick={() => deleteCustomer(item.id)}
                    style={{
                      marginTop: "10px",
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete Permanently
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section section-dark">
          <div className="section-title">
            <h2>Service Providers</h2>
          </div>

          <div className="dashboard-list">
            {providerList.length === 0 ? (
              <div className="card"><h3>No Provider Data Yet</h3></div>
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
                  <button
                    onClick={() => deleteProvider(item.id)}
                    style={{
                      marginTop: "10px",
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete Permanently
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site">
      <Header setPage={setPage} />

      <section id="home" className="hero">
        <div className="hero-text">
          <span className="badge">One Platform • Multiple Services • Direct Opportunities</span>
          <h2>
            The Smart Marketplace for Customers, Vendors, Freelancers,
            Companies & Service Providers
          </h2>
          <p>
            Macky Nexus Services connects people who need services with the
            people who provide them across solar, property, IT, telecom and more.
          </p>

          <div className="hero-buttons">
            <button type="button" onClick={() => setPage("customerSignup")}>
              Customer Signup
            </button>
            <button type="button" className="outline" onClick={() => setPage("providerSignup")}>
              Provider Signup
            </button>
          </div>
        </div>

        <div className="hero-card">
          <h3>Quick Access</h3>
          <ul>
            <li>✔ Customer Signup/Login</li>
            <li>✔ Service Provider Signup/Login</li>
            <li>✔ Admin Dashboard</li>
            <li>✔ Requirement Posting</li>
            <li>✔ Provider Registration</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Choose Login Type</h2>
          <p>Select the account type you want to use</p>
        </div>

        <div className="dashboard-list">
          <div className="card">
            <h3>Customer Account</h3>
            <p>Create account and post requirements.</p>
            <button type="button" onClick={() => setPage("customerSignup")}>Customer Signup</button>
            <button type="button" className="outline" onClick={() => setPage("customerLogin")} style={{ marginTop: "10px" }}>
              Customer Login
            </button>
          </div>

          <div className="card">
            <h3>Service Provider Account</h3>
            <p>Create account and register services.</p>
            <button type="button" onClick={() => setPage("providerSignup")}>Provider Signup</button>
            <button type="button" className="outline" onClick={() => setPage("providerLogin")} style={{ marginTop: "10px" }}>
              Provider Login
            </button>
          </div>

          <div className="card">
            <h3>Admin Access</h3>
            <p>Admin can review and delete all data.</p>
            <button type="button" onClick={() => setPage("adminLogin")}>Admin Login</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Header({ setPage }) {
  return (
    <header className="header">
      <div className="brand">
        <h1>Macky Nexus Services ⭐</h1>
        <p>Your Trusted Network for Services, Vendors & Opportunities</p>
      </div>

      <nav className="nav">
        <button className="nav-btn" type="button" onClick={() => setPage("home")}>Home</button>
        <button className="nav-btn" type="button" onClick={() => setPage("customerLogin")}>Customer Login</button>
        <button className="nav-btn" type="button" onClick={() => setPage("providerLogin")}>Service Provider Login</button>
        <button className="nav-btn" type="button" onClick={() => setPage("adminLogin")}>Admin</button>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Macky Nexus Services ⭐ | All Rights Reserved</p>
    </footer>
  );
}

export default App;