import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Lightbulb, MessageSquare } from "lucide-react";
import { useFetchInvestments } from "../../hooks/useFetchInvestments";
import { useFetchRecommendedIdeas } from "../../hooks/useFetchRecommendedIdeas";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { NavigationBlocker } from "../../components/NavigationBlocker";

export const InvestorDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch investments
  const { investments, loading: invLoading, error: invError } = useFetchInvestments();

  // Fetch recommended ideas
  const { ideas: recommendations, loading: recLoading, error: recError } = useFetchRecommendedIdeas();

  // Fetch Portfolio Stats
  const [stats, setStats] = useState([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/tracking/investor-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data || []);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (invLoading || recLoading) return <p className="text-center mt-4">Loading dashboard...</p>;
  if (invError) return <p className="text-center mt-4 text-danger">{invError}</p>;
  if (recError) return <p className="text-center mt-4 text-danger">{recError}</p>;

  const totalInvestment = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalIdeas = investments.length;

  return (
    <div className="container py-4">
      <NavigationBlocker />
      <h2 className="mb-4 text-primary-custom">
        Investor Dashboard
      </h2>

      {/* Portfolio Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card-custom border-0 h-100">
            <div className="card-body text-center p-4">
              <TrendingUp size={32} className="text-warning mb-2" />
              <h3 className="mb-0 fw-bold">${totalInvestment.toLocaleString()}</h3>
              <p className="text-secondary mb-0">Total Portfolio Value</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-custom border-0 h-100">
            <div className="card-body text-center p-4">
              <Lightbulb size={32} className="text-warning mb-2" />
              <h3 className="mb-0 fw-bold">{totalIdeas}</h3>
              <p className="text-secondary mb-0">Active Investments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Graph */}
      <div className="card-custom mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 fw-bold text-primary-custom">Portfolio Profit/Loss Over Time</h5>
        </div>
        <div className="card-body" style={{ height: "300px" }}>
          {stats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="netProfit"
                  stroke="#047857"
                  fillOpacity={1}
                  fill="url(#colorNet)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              No financial data available yet.
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Portfolio Snapshot */}
        <div className="col-lg-6">
          <div className="card-custom h-100">
            <div className="card-header bg-primary-custom text-white border-0 py-3">
              <h5 className="mb-0">Portfolio Snapshot</h5>
            </div>
            <div className="card-body p-0">
              {investments.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-muted mb-0">You have not invested in any ideas yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">Idea</th>
                        <th className="px-4 py-3">Investment</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv) => (
                        <tr key={inv._id}>
                          <td className="px-4">{inv.idea?.title || "Unknown Idea"}</td>
                          <td className="px-4">${inv.amount.toLocaleString()}</td>
                          <td className="px-4">
                            <span
                              className={`badge rounded-pill ${inv.idea?.status === "validated" ? "bg-success" : "bg-warning"
                                }`}
                            >
                              {inv.idea?.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="p-3 text-center border-top">
                <button
                  className="btn btn-primary text-white w-100"
                  onClick={() => navigate("/i/portfolio")}
                >
                  View Full Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Ideas */}
        <div className="col-lg-6">
          <div className="card-custom h-100">
            <div className="card-header bg-primary-custom text-white border-0 py-3">
              <h5 className="mb-0">Recommended Ideas</h5>
            </div>
            <div className="card-body p-3">
              {recommendations.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted mb-0">No recommended ideas at the moment.</p>
                </div>
              ) : (
                recommendations.slice(0, 3).map((idea) => (
                  <div key={idea._id} className="card border-0 bg-light mb-3">
                    <div className="card-body">
                      <h6 className="card-title fw-bold text-primary-custom">{idea.title}</h6>
                      <p className="card-text text-secondary small">{idea.description}</p>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-primary text-white flex-grow-1"
                          onClick={() => navigate(`/i/ideas/${idea._id}`)}
                        >
                          View Details
                        </button>
                        {idea.userId && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/chat?userId=${idea.userId}&ideaId=${idea._id}`)}
                            title="Message Owner"
                          >
                            <MessageSquare size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate("/i/recommendations")}
                >
                  View All Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
