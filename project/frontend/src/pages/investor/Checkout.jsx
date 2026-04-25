// src/pages/investor/Checkout.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFetchIdea } from "../../hooks/useFetchIdea";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const Checkout = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { idea, loading, error } = useFetchIdea(ideaId);

  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  if (loading) return <p className="text-center mt-4">Loading idea...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (!idea) return <p className="text-center mt-4 text-danger">Idea not found</p>;

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => navigate("/i/portfolio"), 2000);
  };

  return (
    <div className="container py-4">
      <button className="btn btn-link ps-0 mb-3 text-decoration-none text-secondary" onClick={() => navigate(`/i/ideas/${idea._id}`)}>
        <ArrowLeft size={18} className="me-1" /> Back to Idea
      </button>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header bg-primary-custom text-white border-0 py-3">
              <h4 className="mb-0 fw-bold">Investment Checkout</h4>
            </div>
            <div className="card-body p-4">
              {success && <div className="alert alert-success animate-fade-in">Investment successful! Redirecting...</div>}

              <div className="alert alert-light border shadow-sm mb-4">
                <h5 className="alert-heading text-primary-custom fw-bold">{idea.title}</h5>
                <p className="mb-0 text-muted">{idea.description}</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold text-secondary">Investment Amount ($)</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="5"
                  step="5"
                  required
                />
              </div>

              {amount > 0 && (
                <Elements stripe={stripePromise}>
                  <PaymentForm amount={Number(amount)} ideaId={idea._id} token={token} onSuccess={handleSuccess} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
