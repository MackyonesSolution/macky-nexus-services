import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

function Header({ setPage }) {
  return (
    <header className="header">
      <div className="brand">
        <h1>Macky Nexus Services ⭐</h1>
        <p>Your Trusted Network for Services, Vendors & Opportunities</p>
      </div>

      <nav className="nav">
        <button className="nav-btn" type="button" onClick={() => setPage("home")}>
          Home
        </button>
        <button className="nav-btn" type="button" onClick={() => setPage("customerLogin")}>
          Customer Login
        </button>
        <button className="nav-btn" type="button" onClick={() => setPage("providerLogin")}>
          Service Provider Login
        </button>
        <button className="nav-btn" type="button" onClick={() => setPage("adminLogin")}>
          Admin
        </button>
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

  const [forgotForm, setForgotForm] = useState({
    email: "",
  });

  const [resetForm, setResetForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loggedCustomer, setLoggedCustomer] = useState(null);
  const [loggedProvider, setLoggedProvider] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    category: "",
    budget: "",
    urgency: "",
    requirement: "",
  });

  const [providerForm, setProviderForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    category: "",
    city: "",
    state: "",
    serviceAreas: "",
    experienceYears: "",
    teamSize: "",
    toolsSummary: "",
    vehiclesAvailable: "",
    emergencySupport: "",
    description: "",
    telecomWorkTypes: "",
    fusionMachine: "",
    otdr: "",
    powerMeter: "",
    drillingMachine: "",
    ladder: "",
    safetyKit: "",
    telecomCertifications: "",
    propertyServices: "",
    residentialCommercial: "",
    propertyTypes: "",
    solarTypes: "",
    rooftopGround: "",
    installationCapacityKw: "",
    technicianCount: "",
    electricalLicense: "",
    brandsHandled: "",
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

  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
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
          city: "",
          category: "",
          budget: "",
          urgency: "",
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
        setProviderForm((prev) => ({
          ...prev,
          contactPerson: data.user.name || "",
          phone: data.user.mobile || "",
          email: data.user.email || "",
        }));
        setProviderLogin({ login: "", password: "" });
        setPage("provider");
      }
    } catch (error) {
      alert("Provider login failed");
      console.log(error);
    }
  };

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotForm.email }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setForgotForm({ email: "" });
      }
    } catch (error) {
      alert("Failed to send reset link");
      console.log(error);
    }
  };

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      alert("Invalid reset link");
      return;
    }

    if (resetForm.password !== resetForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: resetForm.password,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.ok) {
        setResetForm({ password: "", confirmPassword: "" });
        setPage("customerLogin");
        window.history.replaceState({}, "", "/");
      }
    } catch (error) {
      alert("Password reset failed");
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
          city: "",
          category: "",
          budget: "",
          urgency: "",
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
      const res = await fetch(`${API_BASE_URL}/api/provider-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedProvider?.id || null,
          ...providerForm,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Provider profile submit failed");
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
        `${API_BASE_URL}/api/admin/provider-profile/${id}`,
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
    if (window.location.pathname === "/reset-password") {
      setPage("resetPassword");
    }
  }, []);

  useEffect(() => {
    if (page === "adminDashboard" && adminToken) {
      loadDashboard();
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
            <button type="button" className="outline" onClick={() => setPage("forgotPassword")}>
              Forgot Password
            </button>
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
            <button type="button" className="outline" onClick={() => setPage("forgotPassword")}>
              Forgot Password
            </button>
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

  if (page === "forgotPassword") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Forgot Password</h2>
            <p>Enter your email to get reset link</p>
          </div>

          <form className="contact-form" onSubmit={forgotPasswordSubmit}>
            <input type="email" name="email" placeholder="Email Address" value={forgotForm.email} onChange={handleForgotChange} />
            <button type="submit">Send Reset Link</button>
          </form>
        </section>
        <Footer />
      </div>
    );
  }

  if (page === "resetPassword") {
    return (
      <div className="site">
        <Header setPage={setPage} />
        <section className="section section-dark">
          <div className="section-title">
            <h2>Reset Password</h2>
            <p>Set your new password</p>
          </div>

          <form className="contact-form" onSubmit={resetPasswordSubmit}>
            <input type="password" name="password" placeholder="New Password" value={resetForm.password} onChange={handleResetChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={resetForm.confirmPassword} onChange={handleResetChange} />
            <button type="submit">Update Password</button>
          </form>
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
              <input type="text" name="city" placeholder="City" value={customerForm.city} onChange={handleCustomerFormChange} />
            </div>

            <select name="category" value={customerForm.category} onChange={handleCustomerFormChange}>
              <option value="">Select Service Category</option>
              <option value="Vendor Requirement">Vendor Requirement</option>
              <option value="Solar Service">Solar Service</option>
              <option value="Property Service">Property Service</option>
              <option value="Telecom Support">Telecom Support</option>
              <option value="IT Company Service">IT Company Service</option>
            </select>

            <div className="form-grid">
              <input type="text" name="budget" placeholder="Budget" value={customerForm.budget} onChange={handleCustomerFormChange} />
              <input type="text" name="urgency" placeholder="Urgency" value={customerForm.urgency} onChange={handleCustomerFormChange} />
            </div>

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
            <h2>Professional Service Provider Profile</h2>
            <p>Welcome, {loggedProvider?.name}</p>
          </div>

          <form className="contact-form" onSubmit={providerFormSubmit}>
            <div className="form-grid">
              <input type="text" name="companyName" placeholder="Company / Business Name" value={providerForm.companyName} onChange={handleProviderFormChange} />
              <input type="text" name="contactPerson" placeholder="Contact Person Name" value={providerForm.contactPerson} onChange={handleProviderFormChange} />
              <input type="text" name="phone" placeholder="Phone Number" value={providerForm.phone} onChange={handleProviderFormChange} />
              <input type="email" name="email" placeholder="Email Address" value={providerForm.email} onChange={handleProviderFormChange} />
              <input type="text" name="category" placeholder="Category (Telecom / Property / Solar / IT / Vendor)" value={providerForm.category} onChange={handleProviderFormChange} />
              <input type="text" name="city" placeholder="City" value={providerForm.city} onChange={handleProviderFormChange} />
              <input type="text" name="state" placeholder="State" value={providerForm.state} onChange={handleProviderFormChange} />
              <input type="text" name="serviceAreas" placeholder="Service Areas" value={providerForm.serviceAreas} onChange={handleProviderFormChange} />
              <input type="text" name="experienceYears" placeholder="Experience (Years)" value={providerForm.experienceYears} onChange={handleProviderFormChange} />
              <input type="text" name="teamSize" placeholder="Team Size" value={providerForm.teamSize} onChange={handleProviderFormChange} />
              <input type="text" name="vehiclesAvailable" placeholder="Vehicles Available" value={providerForm.vehiclesAvailable} onChange={handleProviderFormChange} />
              <input type="text" name="emergencySupport" placeholder="Emergency Support (Yes/No)" value={providerForm.emergencySupport} onChange={handleProviderFormChange} />
            </div>

            <textarea name="toolsSummary" placeholder="Tools / Equipment Summary" rows="3" value={providerForm.toolsSummary} onChange={handleProviderFormChange}></textarea>
            <textarea name="description" placeholder="Company / Service Description" rows="4" value={providerForm.description} onChange={handleProviderFormChange}></textarea>

            <div className="section-title">
              <h2 style={{ fontSize: '24px' }}>Telecom Details</h2>
            </div>
            <textarea name="telecomWorkTypes" placeholder="FTTH / OFC / Splicing / Fault Repair / Survey" rows="3" value={providerForm.telecomWorkTypes} onChange={handleProviderFormChange}></textarea>
            <div className="form-grid">
              <input type="text" name="fusionMachine" placeholder="Fusion Machine (Yes/No)" value={providerForm.fusionMachine} onChange={handleProviderFormChange} />
              <input type="text" name="otdr" placeholder="OTDR (Yes/No)" value={providerForm.otdr} onChange={handleProviderFormChange} />
              <input type="text" name="powerMeter" placeholder="Power Meter (Yes/No)" value={providerForm.powerMeter} onChange={handleProviderFormChange} />
              <input type="text" name="drillingMachine" placeholder="Drilling Machine (Yes/No)" value={providerForm.drillingMachine} onChange={handleProviderFormChange} />
              <input type="text" name="ladder" placeholder="Ladder (Yes/No)" value={providerForm.ladder} onChange={handleProviderFormChange} />
              <input type="text" name="safetyKit" placeholder="Safety Kit (Yes/No)" value={providerForm.safetyKit} onChange={handleProviderFormChange} />
            </div>
            <textarea name="telecomCertifications" placeholder="Telecom Certificates / Licenses / Details" rows="3" value={providerForm.telecomCertifications} onChange={handleProviderFormChange}></textarea>

            <div className="section-title">
              <h2 style={{ fontSize: '24px' }}>Property Details</h2>
            </div>
            <input type="text" name="propertyServices" placeholder="Sell / Purchase / Rent / Lease" value={providerForm.propertyServices} onChange={handleProviderFormChange} />
            <input type="text" name="residentialCommercial" placeholder="Residential / Commercial" value={providerForm.residentialCommercial} onChange={handleProviderFormChange} />
            <textarea name="propertyTypes" placeholder="Flat / Plot / House / Shop / Office / Land" rows="3" value={providerForm.propertyTypes} onChange={handleProviderFormChange}></textarea>

            <div className="section-title">
              <h2 style={{ fontSize: '24px' }}>Solar Details</h2>
            </div>
            <input type="text" name="solarTypes" placeholder="Residential / Commercial / Industrial" value={providerForm.solarTypes} onChange={handleProviderFormChange} />
            <input type="text" name="rooftopGround" placeholder="Rooftop / Ground" value={providerForm.rooftopGround} onChange={handleProviderFormChange} />
            <input type="text" name="installationCapacityKw" placeholder="Installation Capacity (KW)" value={providerForm.installationCapacityKw} onChange={handleProviderFormChange} />
            <input type="text" name="technicianCount" placeholder="Technician Count" value={providerForm.technicianCount} onChange={handleProviderFormChange} />
            <input type="text" name="electricalLicense" placeholder="Electrical License (Yes/No)" value={providerForm.electricalLicense} onChange={handleProviderFormChange} />
            <textarea name="brandsHandled" placeholder="Brands Handled" rows="3" value={providerForm.brandsHandled} onChange={handleProviderFormChange}></textarea>

            <button type="submit">Save Professional Profile</button>
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
                  <p><strong>City:</strong> {item.city}</p>
                  <p><strong>Budget:</strong> {item.budget}</p>
                  <p><strong>Urgency:</strong> {item.urgency}</p>
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
                  <p><strong>Category:</strong> {item.serviceType}</p>
                  <p><strong>City:</strong> {item.city}</p>
                  <p><strong>Details:</strong> {item.details}</p>
                  <p><strong>Status:</strong> {item.approvalStatus}</p>
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

            <button
              type="button"
              className="outline"
              onClick={() => setPage("providerSignup")}
            >
              Provider Signup
            </button>
          </div>
        </div>

        <div className="hero-card">
          <h3>Quick Access</h3>
          <ul>
            <li>✔ Customer Signup/Login</li>
            <li>✔ Service Provider Signup/Login</li>
            <li>✔ Forgot Password by Email</li>
            <li>✔ Admin Dashboard</li>
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

export default App;