import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, TrendingUp, Lightbulb, ArrowLeft, Activity, Trash2 } from "lucide-react";

import { useFetchInvestments } from "../../hooks/useFetchInvestments";

export const Portfolio = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message state


  // Fetch investments
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/investments/my-investments`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setInvestments(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch investments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const totalValue = investments.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );



  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this investment? This action cannot be undone.")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/investments/${id}/withdraw`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setSuccessMessage("Investment withdrawn successfully!");
        fetchInvestments(); // Refresh the list
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Withdrawal failed:", err);
      alert("Failed to withdraw investment. Please try again.");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary-custom" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="container py-5 text-center"><p className="text-danger">{error}</p></div>;

  return (
    <div className="container py-4">
      <button className="btn btn-link ps-0 mb-3 text-decoration-none text-secondary" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} className="me-1" /> Back
      </button>
      <h2 className="mb-4 text-primary-custom">
        Investment Portfolio
      </h2>

      {/* Success Alert */}
      {successMessage && (
        <div className="alert alert-success text-center animate-fade-in shadow-sm">{successMessage}</div>
      )}

      <div className="card-custom border-0 shadow-sm mb-4">
        <div className="card-body text-center p-4">
          <h3 className="mb-2 fw-medium text-secondary">Total Portfolio Value</h3>
          <h2 className="display-4 fw-bold text-primary-custom">${totalValue.toLocaleString()}</h2>
        </div>
      </div>

      <div className="card-custom border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Idea</th>
                  <th className="px-4 py-3">Investment Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-end">Operations</th>
                </tr>

              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv._id}>
                    <td className="px-4">
                      <strong>{inv.idea?.title || "Unknown Idea"}</strong>
                    </td>
                    <td className="px-4">
                      ${(inv.amount || 0).toLocaleString()}
                    </td>

                    <td className="px-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 text-capitalize">
                      <span
                        className={`badge rounded-pill ${inv.status === "active"
                          ? "bg-success"
                          : "bg-danger"
                          }`}
                      >
                        {inv.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2 shadow-sm"
                        onClick={() => navigate(`/tracking/${inv.idea?._id}`)}
                        title="View Tracking"
                      >
                        <Activity size={16} className="me-1" />
                        Track
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger shadow-sm"
                        onClick={() => handleWithdraw(inv._id)}
                        disabled={inv.status === 'withdrawn'}
                      >
                        <Trash2 size={16} className="me-1" />
                        Withdraw
                      </button>
                    </td>

                  </tr>
                ))}
                {investments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-5">
                      You have no investments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
