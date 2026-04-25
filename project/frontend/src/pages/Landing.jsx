import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { Footer } from '../components/Footer';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <div className="container py-5">
          <div className="text-center mb-5 animate-fade-in">
            <h1 className="display-4 fw-bold mb-3 text-primary-custom">
              Welcome to Investmate Nexus
            </h1>
            <p className="lead text-secondary">
              Connecting innovative entrepreneurs with forward-thinking investors
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Entrepreneurs */}
            <div className="col-md-5">
              <div className="card-custom h-100 p-4">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <Lightbulb size={64} className="text-warning" />
                  </div>
                  <h3 className="card-title mb-3 text-primary-custom">
                    For Entrepreneurs
                  </h3>
                  <p className="card-text text-secondary mb-4">
                    Submit your innovative ideas, get validation, and connect with investors.
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary btn-lg text-white"
                      onClick={() => navigate('/register?role=entrepreneur')}
                    >
                      Get Started
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate('/login?role=entrepreneur')}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Investors */}
            <div className="col-md-5">
              <div className="card-custom h-100 p-4">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <TrendingUp size={64} className="text-warning" />
                  </div>
                  <h3 className="card-title mb-3 text-primary-custom">
                    For Investors
                  </h3>
                  <p className="card-text text-secondary mb-4">
                    Discover validated startup ideas, assess risks, and invest confidently.
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary btn-lg text-white"
                      onClick={() => navigate('/register?role=investor')}
                    >
                      Get Started
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate('/login?role=investor')}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-secondary mb-2">Are you an administrator?</p>
            <button
              className="btn btn-outline-primary btn-sm px-4"
              onClick={() => navigate('/admin/login')}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};
