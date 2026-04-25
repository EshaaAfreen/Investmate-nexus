import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export const SubmitIdea = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [market, setMarket] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { user, token } = useAuth(); // get logged-in user and token
  const API_URL = import.meta.env.VITE_API_URL; // backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit an idea.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("market", market);
      formData.append("problem", problem);
      formData.append("solution", solution);
      if (licenseFile) {
        formData.append("ideaLicense", licenseFile);
      }

      const response = await axios.post(
        `${API_URL}/ideas/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (response.data.success) {
        setSuccess(true);

        setTimeout(() => {
          navigate("/e/ideas");
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to submit idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header bg-primary-custom text-white border-0 py-3">
              <h4 className="mb-0 fw-bold">Submit New Idea</h4>
            </div>

            <div className="card-body p-4">
              {success && (
                <div className="alert alert-success animate-fade-in">
                  Idea submitted successfully! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Idea Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter idea title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your idea"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Target Market</label>
                  <input
                    type="text"
                    className="form-control"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    placeholder="Who is your target market?"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">
                    Problem Statement
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What problem does this idea solve?"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">Solution</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="How does your idea solve the problem?"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">Idea License Document (Mandatory)</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setLicenseFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,image/*"
                    required
                  />
                  <small className="text-muted">Upload your idea license or registration document.</small>
                </div>


                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={loading}
                    onClick={() => navigate("/e/dashboard")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary text-white"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Idea"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
