import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role"); // "investor" or "entrepreneur"

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);

      if (!res.success) {
        setError(res.error);
        return;
      }

      // ✅ Check if the user's activeRole matches the role of the form
      if (res.activeRole !== role) {
        setError(
          `You cannot log in here. This is a ${role} login. Your account is registered as ${res.activeRole}.`
        );
        return;
      }

      // ✅ Redirect to the dashboard based on role
      navigate(res.activeRole === "entrepreneur" ? "/e/dashboard" : "/i/dashboard");
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card-custom p-4 animate-fade-in">
              <div className="card-body">
                {/* Back Button */}
                <div className="mb-3">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    &larr; Back
                  </button>
                </div>

                <h2 className="text-center mb-2 text-primary-custom">
                  Welcome Back{" "}
                  {role === "investor" ? "Investor" : "Entrepreneur"}
                </h2>
                <p className="text-secondary text-center mb-4">
                  {role === "investor"
                    ? "Only investors can log in here."
                    : "Only entrepreneurs can log in here."}
                </p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                  <div className="mb-4">
                    <label className="form-label fw-bold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary text-white"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="text-muted">
                    Don't have an account?{" "}
                    <Link
                      to={`/register?role=${role}`}
                      className="text-primary-custom fw-bold"
                    >
                      Register here
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
