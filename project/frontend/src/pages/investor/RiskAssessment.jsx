import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer as BarResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend,
  ResponsiveContainer as PieResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer as RadarResponsiveContainer,
} from "recharts";

export const RiskAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const assessRisk = async () => {
      setLoading(true);
      setError("");

      try {
        console.log(`${import.meta.env.VITE_FASTAPI_URL}/predict-risk-files/${id}`);
        const res = await axios.post(
          `${import.meta.env.VITE_FASTAPI_URL}/predict-risk-files/${id}`
        );
        console.log(res);

        setResult(res.data.risk);
        setFeatures(res.data.features);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to assess risk");
      } finally {
        setLoading(false);
      }
    };

    assessRisk();
  }, [id]);

  const riskColor = {
    Low: "success",
    Medium: "warning",
    High: "danger",
  };

  // Feature names (update as per your model)
  const featureNames = [
    "Team Experience",
    "Market Potential",
    "Financial Stability",
    "Low Competition Risk",
    "Product Readiness",
    "Innovation Level",
  ];

  const barData = features
    ? features.map((val, idx) => ({ name: featureNames[idx], value: val }))
    : [];

  const pieData = features
    ? features.map((val, idx) => ({ name: featureNames[idx], value: Math.round(val * 100) }))
    : [];

  const radarData = features
    ? features.map((val, idx) => ({ feature: featureNames[idx], value: val }))
    : [];

  const COLORS = ["#047857", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#10B981"];

  return (
    <div className="container py-4">
      <button className="btn btn-link ps-0 mb-3" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} className="me-1" /> Back
      </button>

      {/* Overall Risk */}
      <div className="card border-0 shadow-sm mb-4">
        <div className={`card-header bg-${riskColor[result] || "secondary"} text-white`}>
          <h4 className="mb-0">AI Risk Assessment</h4>
        </div>
        <div className="card-body p-4">
          {loading && <p>Analyzing business documents...</p>}
          {error && <p className="text-danger">{error}</p>}
          {result && (
            <div className={`alert alert-${riskColor[result] || "secondary"}`}>
              <h5>Overall Risk: {result}</h5>
            </div>
          )}
        </div>
      </div>

      {features && features.length > 0 && (
        <>
          {/* Radar Chart */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-purple-700 text-white">
              <h5 className="mb-0">Feature Analysis (Radar)</h5>
            </div>
            <div className="card-body">
              <RadarResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="feature" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar name="Feature Value" dataKey="value" stroke="#047857" fill="#047857" fillOpacity={0.6} />
                </RadarChart>
              </RadarResponsiveContainer>
            </div>
          </div>

          {/* Numeric Bar Chart */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Feature Numeric Values</h5>
            </div>
            <div className="card-body">
              <BarResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <BarTooltip />
                  <Bar dataKey="value" fill="#047857" />
                </BarChart>
              </BarResponsiveContainer>
            </div>
          </div>

          {/* Feature Coverage Pie Chart */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Feature Coverage (%)</h5>
            </div>
            <div className="card-body">
              <PieResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <PieTooltip formatter={(value) => `${value}%`} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "0.9rem" }} />
                </PieChart>
              </PieResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
