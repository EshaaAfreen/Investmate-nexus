import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(new URLSearchParams(window.location.search).get("role") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await register(name, email, password, role);
      setLoading(false);

      if (res.success) {
        // ✅ redirect according to activeRole returned from backend
        navigate(
          res.activeRole === "entrepreneur" ? "/e/dashboard" : "/i/dashboard"
        );
      } else {
        setError(res.error);
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card-custom p-4 animate-fade-in">
              <div className="card-body">
                <div className="mb-3">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>
                    &larr; Back
                  </button>
                </div>

                <h2 className="text-center mb-4 text-primary-custom">
                  Create Account
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">I am a/an</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select your role</option>
                      <option value="entrepreneur">Entrepreneur</option>
                      <option value="investor">Investor</option>

                    </select>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary text-white"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary-custom fw-bold">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
