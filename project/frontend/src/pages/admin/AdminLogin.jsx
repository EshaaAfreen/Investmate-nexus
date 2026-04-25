import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        if (res.activeRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. This account does not have administrator privileges.');
        }
      } else {
        setError(res.error);
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card-custom p-4 animate-fade-in shadow-lg">
              <div className="card-body">
                <div className="mb-4">
                  <button
                    onClick={() => navigate('/')}
                    className="btn btn-link text-secondary p-0 text-decoration-none d-flex align-items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back to Home
                  </button>
                </div>

                <div className="text-center mb-4">
                  <div className="bg-primary-custom text-white d-inline-block p-3 rounded-circle mb-3">
                    <span className="fw-bold h4">A</span>
                  </div>
                  <h2 className="fw-bold text-primary-custom mb-1">Admin Portal</h2>
                  <p className="text-secondary small">Secure access for system administrators</p>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="form-label small fw-bold text-secondary">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label small fw-bold text-secondary">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary text-white w-100 py-2 mt-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span> Authenticating...</>
                    ) : 'Sign In to Dashboard'}
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t text-center">
                  <p className="text-muted small mb-0">
                    &copy; 2024 Investmate Nexus Admin
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
