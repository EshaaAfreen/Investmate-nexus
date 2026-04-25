import { useEffect, useState } from "react";
import { fetchAllIdeas, updateIdeaStatus } from "../../api/admin";
import { NavigationBlocker } from "../../components/NavigationBlocker";
import { CheckCircle, XCircle, RefreshCcw, FileText, User, Layout, MessageSquare } from "lucide-react";

const statusOptions = [
  { value: "validated", label: "Validated", icon: CheckCircle, color: "text-success" },
  { value: "revision", label: "Needs Revision", icon: RefreshCcw, color: "text-warning" },
  { value: "rejected", label: "Rejected", icon: XCircle, color: "text-danger" },
  { value: "pending", label: "Pending", icon: Layout, color: "text-secondary" }
];

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIdeaId, setExpandedIdeaId] = useState(null);

  const loadIdeas = async () => {
    try {
      const res = await fetchAllIdeas();
      setIdeas(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateIdeaStatus(id, status);
      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === id ? { ...idea, status } : idea
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary-custom" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container py-4 animate-fade-in">
      <NavigationBlocker />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-primary-custom mb-0">Admin Management</h2>
        <span className="badge bg-primary-custom px-3 py-2 rounded-pill">
          {ideas.length} Total Submissions
        </span>
      </div>

      {ideas.length === 0 ? (
        <div className="card-custom text-center p-5">
          <p className="text-muted mb-0">No business ideas have been submitted yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {ideas.map((idea) => (
            <div key={idea._id} className="col-lg-4 col-md-6">
              <div className="card-custom h-100 d-flex flex-column">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold text-dark mb-0 line-clamp-2">{idea.title}</h5>
                    <span className={`badge rounded-pill small ${idea.status === 'validated' ? 'bg-success' :
                      idea.status === 'revision' ? 'bg-warning text-dark' :
                        idea.status === 'rejected' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                      {idea.status ? idea.status.charAt(0).toUpperCase() + idea.status.slice(1) : 'Pending'}
                    </span>
                  </div>

                  <div className="d-flex align-items-center text-muted small mb-3">
                    <User size={14} className="me-1" />
                    <span>{idea.userId?.name || "Anonymous"}</span>
                  </div>

                  <p className="text-secondary small mb-4 line-clamp-3">
                    {idea.description}
                  </p>

                  <div className="mt-auto">
                    <button
                      className={`btn btn-sm w-100 fw-bold ${expandedIdeaId === idea._id ? 'btn-outline-secondary' : 'btn-primary text-white'}`}
                      onClick={() => setExpandedIdeaId(expandedIdeaId === idea._id ? null : idea._id)}
                    >
                      {expandedIdeaId === idea._id ? "Close Portfolio" : "Review Submission"}
                    </button>
                  </div>
                </div>

                {/* Expanded Section */}
                {expandedIdeaId === idea._id && (
                  <div className="card-footer bg-light border-0 p-4 animate-fade-in">
                    <div className="mb-4">
                      <h6 className="fw-bold text-primary-custom mb-2">Market Analysis</h6>
                      <p className="small text-secondary">{idea.market || "No data provided"}</p>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold text-primary-custom mb-2">Problem / Solution</h6>
                      <p className="small text-secondary mb-1"><strong>Problem:</strong> {idea.problem}</p>
                      <p className="small text-secondary"><strong>Solution:</strong> {idea.solution}</p>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold text-primary-custom mb-2 d-flex align-items-center">
                        <FileText size={16} className="me-1" /> Attached Files
                      </h6>
                      <div className="list-group list-group-flush rounded border small">
                        {idea.files && (idea.files.ideaLicense || idea.files.businessPlan || idea.files.marketResearch || idea.files.financials) ? (
                          <>
                            {idea.files.ideaLicense && (
                              <a href={`${API_URL}/ideas/${idea._id}/files/ideaLicense?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action text-primary-custom border-0">
                                Idea License
                              </a>
                            )}
                            {idea.files.businessPlan && (
                              <a href={`${API_URL}/ideas/${idea._id}/files/businessPlan?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action text-primary-custom border-0 border-top">
                                Business Plan
                              </a>
                            )}
                            {idea.files.marketResearch && (
                              <a href={`${API_URL}/ideas/${idea._id}/files/marketResearch?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action text-primary-custom border-0 border-top">
                                Market Research
                              </a>
                            )}
                            {idea.files.financials && (
                              <a href={`${API_URL}/ideas/${idea._id}/files/financials?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action text-primary-custom border-0 border-top">
                                Financial Projections
                              </a>
                            )}
                          </>
                        ) : (
                          <div className="list-group-item text-muted">No files uploaded</div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-top">
                      <h6 className="fw-bold mb-3">Update Status</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            className={`btn btn-xs rounded-pill d-flex align-items-center gap-1 ${idea.status === opt.value
                              ? 'btn-primary text-white'
                              : 'btn-outline-secondary'
                              }`}
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            onClick={() => handleStatusUpdate(idea._id, opt.value)}
                          >
                            <opt.icon size={12} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
