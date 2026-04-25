import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useFetchRecommendedIdeas } from "../../hooks/useFetchRecommendedIdeas";

export const Recommendations = () => {
  const navigate = useNavigate();
  const { ideas, loading, error } = useFetchRecommendedIdeas();

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (ideas.length === 0) return <p>No recommended ideas at the moment.</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: "#047857" }}>Recommended Ideas</h2>
      <div className="row g-4">
        {ideas.map((idea) => (
          <div key={idea._id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{idea.title}</h5>
                <p className="card-text text-muted small">{idea.description}</p>
                <button
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: "#047857" }}
                  onClick={() => navigate(`/i/ideas/${idea._id}`)}
                >
                  <Eye size={16} className="me-1" /> View Idea
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
