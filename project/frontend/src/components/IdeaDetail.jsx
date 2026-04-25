import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, ArrowLeft, MessageSquare } from "lucide-react";

export const IdeaDetails = ({
  idea: initialIdea,
  role,
  allowUpload = false,
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState(initialIdea);
  const API_URL = import.meta.env.VITE_API_URL;

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-secondary",
      validated: "bg-success",
      revision: "bg-warning",
      rejected: "bg-danger",
    };
    return badges[status] || "bg-secondary";
  };

  // Fetch latest idea from backend
  const fetchIdea = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/ideas/${idea._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setIdea(data.data);
      else console.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-4">
      {/* Back Button */}
      {showBackButton && (
        <button
          className="btn btn-link ps-0 mb-3 text-decoration-none text-secondary"
          onClick={() =>
            navigate(role === "investor" ? "/i/ideas" : "/e/ideas")
          }
        >
          <ArrowLeft size={18} className="me-1" />
          Back to Ideas
        </button>
      )}

      <div className="row g-4">
        {/* Left Section */}
        <div className="col-lg-8">
          <div className="card-custom mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div className="d-flex align-items-center">
                  <h3 className="fw-bold text-primary-custom mb-0 me-3">{idea.title}</h3>
                  <span className={`badge rounded-pill ${getStatusBadge(idea.status)}`}>
                    {idea.status}
                  </span>
                </div>

                {role === "investor" && idea.entrepreneur && (
                  <button
                    className="btn btn-primary d-flex align-items-center btn-sm text-white"
                    onClick={() => navigate(`/chat?userId=${idea.entrepreneur}`)}
                  >
                    <MessageSquare size={16} className="me-2" />
                    Message
                  </button>
                )}
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-2">Description</h6>
                <p className="text-muted">{idea.description}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-2">Target Market</h6>
                <p className="text-muted">{idea.market}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-2">Problem Statement</h6>
                <p className="text-muted">{idea.problem}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-2">Solution</h6>
                <p className="text-muted">{idea.solution}</p>
              </div>

              {/* Documents */}
              <h6 className="fw-bold text-secondary mb-3">Documents</h6>

              <div className="list-group list-group-flush">
                {/* Idea License */}
                {idea.files?.ideaLicense ? (
                  <a
                    href={`${API_URL}/ideas/${idea._id}/files/ideaLicense?token=${localStorage.getItem("token")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="list-group-item list-group-item-action border-0 px-0 d-flex align-items-center text-primary-custom"
                  >
                    <FileText size={18} className="me-2" />
                    Idea License – {idea.files.ideaLicense.filename}
                  </a>
                ) : (
                  <div className="py-2 text-muted fst-italic">No License Document uploaded</div>
                )}

                {/* Business Plan */}
                {idea.files?.businessPlan ? (
                  <a
                    href={`${API_URL}/ideas/${idea._id}/files/businessPlan?token=${localStorage.getItem("token")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="list-group-item list-group-item-action border-0 px-0 d-flex align-items-center text-primary-custom"
                  >
                    <FileText size={18} className="me-2" />
                    Business Plan – {idea.files.businessPlan.filename}
                  </a>
                ) : (
                  <div className="py-2 text-muted fst-italic">No Business Plan uploaded</div>
                )}

                {/* Market Research */}
                {idea.files?.marketResearch ? (
                  <a
                    href={`${API_URL}/ideas/${idea._id}/files/marketResearch?token=${localStorage.getItem("token")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="list-group-item list-group-item-action border-0 px-0 d-flex align-items-center text-primary-custom"
                  >
                    <FileText size={18} className="me-2" />
                    Market Research – {idea.files.marketResearch.filename}
                  </a>
                ) : (
                  <div className="py-2 text-muted fst-italic">No Market Research uploaded</div>
                )}

                {/* Financials */}
                {idea.files?.financials ? (
                  <a
                    href={`${API_URL}/ideas/${idea._id}/files/financials?token=${localStorage.getItem("token")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="list-group-item list-group-item-action border-0 px-0 d-flex align-items-center text-primary-custom"
                  >
                    <FileText size={18} className="me-2" />
                    Financials – {idea.files.financials.filename}
                  </a>
                ) : (
                  <div className="py-2 text-muted fst-italic">No Financial Document uploaded</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Sidebar */}
        <div className="col-lg-4">
          <div className="card-custom">
            <div className="card-header bg-primary-custom text-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Feedback</h6>
            </div>
            <div className="card-body p-3">
              {idea.feedback?.length > 0 ? (
                idea.feedback.map((fb, i) => (
                  <div key={i} className="alert alert-light border shadow-sm mb-2 text-dark">
                    {fb}
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">No feedback yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
