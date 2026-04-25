import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useFetchIdeas } from "../../hooks/useFetchIdeas";
import { IdeaDetails } from "../../components/IdeaDetail.jsx";
import { Modal, Button, Form } from "react-bootstrap";
import { MessageSquare } from "lucide-react";

export const AllIdeas = () => {
  const navigate = useNavigate();
  const { user, isInvestor } = useAuth();

  if (!user) return <p className="text-center mt-4">Loading...</p>;

  const endpoint = isInvestor
    ? "/ideas/all-ideas"
    : "/ideas/my-ideas";

  const { ideas, loading, error } = useFetchIdeas(endpoint);

  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState("");

  const handleViewIdea = (idea) => {
    setSelectedIdea(idea);
    setShowModal(true);
  };

  const handleInvestSubmit = async () => {
    if (!investAmount || Number(investAmount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/investments/${selectedIdea._id}`,
        { amount: investAmount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setShowInvestModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Investment failed");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading ideas...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary-custom">
        {isInvestor ? "All Entrepreneur Ideas" : "My Ideas"}
      </h2>

      <div className="row g-4">
        {ideas.map((idea) => (
          <div key={idea._id} className="col-md-4">
            <div className="card-custom h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="mb-0 fw-bold text-dark">{idea.title}</h5>

                  {/* ✅ Badge colors SAME as Portfolio */}
                  <span
                    className={`badge rounded-pill ${idea.status === "validated"
                      ? "bg-success"
                      : "bg-warning"
                      }`}
                  >
                    {idea.status}
                  </span>
                </div>

                <p className="text-secondary small mb-4 flex-grow-1">{idea.description}</p>

                <div className="d-grid gap-2 mt-auto">
                  <button
                    className="btn btn-sm btn-primary text-white"
                    onClick={() => handleViewIdea(idea)}
                  >
                    View Idea
                  </button>

                  {isInvestor && (
                    <>
                      {idea.userId && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/chat?userId=${idea.userId}&ideaId=${idea._id}`)}
                          title="Message Owner"
                        >
                          <MessageSquare size={16} />
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => navigate(`/i/ideas/${idea._id}/risk`)}
                      >
                        Assess Risk
                      </button>

                      <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#d4af37", border: "none" }}
                        onClick={() => navigate(`/i/checkout/${idea._id}`)}
                      >
                        Invest Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Idea Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Idea Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIdea && (
            <IdeaDetails
              idea={selectedIdea}
              role="investor"
              showBackButton={false}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Invest Modal */}
      <Modal
        show={showInvestModal}
        onHide={() => setShowInvestModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Invest in Idea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Amount to Invest</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvestModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleInvestSubmit}>
            Invest
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
