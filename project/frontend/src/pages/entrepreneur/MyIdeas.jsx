import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetchIdeas } from "../../hooks/useFetchIdeas";
import { Eye, Activity, ArrowLeft } from "lucide-react";

export const MyIdeas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const { ideas, loading, error } = useFetchIdeas("/ideas/my-ideas");
  const [filter, setFilter] = useState("all");

  const filteredIdeas =
    filter === "all" ? ideas : ideas.filter((idea) => idea.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-secondary",
      validated: "bg-success",
      revision: "bg-warning",
      rejected: "bg-danger",
    };
    return badges[status] || "bg-secondary";
  };

  // DELETE IDEA HANDLER
  const handleDeleteIdea = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this idea?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token"); // <--- must send token

    try {
      const res = await fetch(`${API_URL}/ideas/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // <--- send token
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Idea deleted successfully!");
        window.location.reload();
      } else {
        alert(data.message || "Failed to delete idea.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting idea");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading ideas...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-link ps-0 mb-2 text-decoration-none text-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="me-1" /> Back
          </button>
          <h2 className="text-primary-custom">My Ideas</h2>
        </div>
        <select
          className="form-select"
          style={{ width: "auto" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Ideas</option>
          <option value="pending">Pending</option>
          <option value="validated">Validated</option>
          <option value="revision">Needs Revision</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card-custom mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Market</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-5">
                      No ideas found
                    </td>
                  </tr>
                ) : (
                  filteredIdeas.map((idea) => (
                    <tr key={idea._id}>
                      <td className="px-4 fw-medium">{idea.title}</td>
                      <td className="px-4">{idea.market}</td>
                      <td className="px-4">
                        <span className={`badge rounded-pill ${getStatusBadge(idea.status)}`}>
                          {idea.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4">
                        <div className="d-flex gap-2">
                          {/* VIEW BUTTON */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/e/ideas/${idea._id}`)}
                          >
                            <Eye size={16} className="me-1" />
                            View
                          </button>

                          {/* EDIT BUTTON */}
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => navigate(`/e/ideas/edit/${idea._id}`)}
                          >
                            Edit
                          </button>

                          {/* TRACKING BUTTON */}
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => navigate(`/tracking/${idea._id}`)}
                            title="Manage Tracking"
                          >
                            <Activity size={16} className="me-1" />
                            Track
                          </button>
                          {/* DELETE BUTTON */}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={idea.investments && idea.investments.length > 0}
                            title={
                              idea.investments?.length > 0
                                ? "Cannot delete — investors have invested in this idea"
                                : "Delete this idea"
                            }
                            onClick={() => handleDeleteIdea(idea._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
