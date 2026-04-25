import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NavigationBlocker } from "../../components/NavigationBlocker";
import { useFetchIdeas } from "../../hooks/useFetchIdeas";
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
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

export const EntrepreneurDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all ideas created by this entrepreneur
  const { ideas, loading } = useFetchIdeas("/ideas/my-ideas");

  // Fetch Entrepreneur Stats
  const [stats, setStats] = useState([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/tracking/entrepreneur-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data || []);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, [API_URL]);

  const pendingIdeas = ideas.filter((i) => i.status === "pending");
  const validatedIdeas = ideas.filter((i) => i.status === "validated");
  const revisionIdeas = ideas.filter((i) => i.status === "revision");

  return (
    <div className="container py-4">
      <NavigationBlocker />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary-custom">Entrepreneur Dashboard</h2>
        <button
          className="btn btn-primary text-white"
          onClick={() => navigate("/e/ideas/new")}
        >
          <Plus size={18} className="me-2" />
          Submit New Idea
        </button>
      </div>

      {loading ? (
        <p>Loading ideas...</p>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card-custom text-center h-100">
                <div className="card-body p-4">
                  <Clock size={32} className="text-warning mb-2" />
                  <h3 className="fw-bold">{pendingIdeas.length}</h3>
                  <p className="text-secondary mb-0">Pending Ideas</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom text-center h-100">
                <div className="card-body p-4">
                  <CheckCircle size={32} className="text-success mb-2" />
                  <h3 className="fw-bold">{validatedIdeas.length}</h3>
                  <p className="text-secondary mb-0">Validated Ideas</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom text-center h-100">
                <div className="card-body p-4">
                  <AlertCircle size={32} className="text-danger mb-2" />
                  <h3 className="fw-bold">{revisionIdeas.length}</h3>
                  <p className="text-secondary mb-0">Needs Revision</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Performance Graph */}
          <div className="card-custom mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold text-primary-custom">Business Profit/Loss Over Time</h5>
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
                  No financial data available yet. Add Revenue data in Tracking to see charts.
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card-custom mb-4">
                <div className="card-header bg-primary-custom text-white border-0 py-3">
                  <h5 className="mb-0">Recent Feedback</h5>
                </div>
                <div className="card-body p-0">
                  {ideas.filter((i) => i.feedback?.length > 0).length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-muted mb-0">No feedback yet</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {ideas
                        .filter((i) => i.feedback?.length > 0)
                        .map((i) => (
                          <div
                            key={i._id}
                            className="list-group-item list-group-item-action border-0 py-3 px-4"
                            onClick={() => navigate(`/e/ideas/${i._id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="fw-bold text-primary-custom mb-1">{i.title}</h6>
                                <p className="text-muted small mb-0">{i.feedback[0]}</p>
                              </div>
                              <span
                                className={`badge rounded-pill ${i.status === "validated"
                                  ? "bg-success"
                                  : i.status === "revision"
                                    ? "bg-warning"
                                    : "bg-secondary"
                                  }`}
                              >
                                {i.status || "pending"}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
