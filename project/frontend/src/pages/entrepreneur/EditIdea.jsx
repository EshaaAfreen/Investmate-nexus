import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Trash2, Upload, ArrowLeft } from "lucide-react";

export default function EditIdea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Idea fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    market: "",
    problem: "",
    solution: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Files
  const [ideaDocs, setIdeaDocs] = useState({
    businessPlan: null,
    marketResearch: null,
    financials: null,
  });
  const [businessPlan, setBusinessPlan] = useState(null);
  const [marketResearch, setMarketResearch] = useState(null);
  const [financials, setFinancials] = useState(null);

  // Success message
  const [success, setSuccess] = useState(false);

  // Fetch idea data
  const fetchIdea = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to load idea");
        return;
      }

      setForm({
        title: data.data.title,
        description: data.data.description,
        market: data.data.market,
        problem: data.data.problem,
        solution: data.data.solution,
      });

      setIdeaDocs({
        businessPlan: data.data.files?.businessPlan || null,
        marketResearch: data.data.files?.marketResearch || null,
        financials: data.data.files?.financials || null,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch idea");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Delete file immediately
  const handleDeleteFile = async (type) => {
    if (!ideaDocs[type]) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/delete-files`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ types: [type] }),
      });
      const data = await res.json();
      if (res.ok) {
        setIdeaDocs(prev => ({ ...prev, [type]: null }));
        alert(`${type} deleted successfully`);
      } else {
        alert(data.message || "Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting file");
    }
  };

  // Upload new files
  const handleUploadFiles = async (e) => {
    e.preventDefault();
    if (!businessPlan && !marketResearch && !financials) {
      alert("Please select at least one file to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (businessPlan) formData.append("businessPlan", businessPlan);
    if (marketResearch) formData.append("marketResearch", marketResearch);
    if (financials) formData.append("financials", financials);

    try {
      const res = await fetch(`${API_URL}/ideas/${id}/upload-docs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setBusinessPlan(null);
        setMarketResearch(null);
        setFinancials(null);
        fetchIdea(); // refresh idea docs
      } else {
        alert(data.message || "Failed to upload files.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading files.");
    }
  };

  // Save text fields
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/ideas/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update idea fields");
      alert("Idea updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update idea");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <button className="btn btn-link ps-0 mb-3" onClick={() => navigate(`/e/ideas/${id}`)}>
        <ArrowLeft size={18} className="me-1" /> Back to Idea
      </button>

      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="mb-3" style={{ color: "#047857" }}>Edit Idea Details</h4>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" value={form.title} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Market</label>
          <input name="market" className="form-control" value={form.market} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Problem</label>
          <textarea name="problem" className="form-control" rows="3" value={form.problem} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Solution</label>
          <textarea name="solution" className="form-control" rows="3" value={form.solution} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows="4" value={form.description} onChange={handleChange} />
        </div>
        <button className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
      </div>

      <div className="card p-4 shadow-sm border-0">
        <h4 className="mb-3" style={{ color: "#047857" }}>Manage Documents</h4>
        {success && <div className="alert alert-success">Documents uploaded successfully!</div>}

        <form onSubmit={handleUploadFiles}>
          {["businessPlan", "marketResearch", "financials"].map((type) => (
            <div className="mb-3" key={type}>
              <label className="form-label fw-bold">
                {type === "businessPlan" ? "Business Plan" : type === "marketResearch" ? "Market Research" : "Financial Projections"}
              </label>
              {ideaDocs[type] ? (
                <div className="d-flex align-items-center mb-2">
                  <a href={`${API_URL}/${ideaDocs[type].url}`} target="_blank" rel="noopener noreferrer" className="me-3">
                    <FileText size={18} /> {ideaDocs[type].filename}
                  </a>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteFile(type)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  className="form-control"
                  accept={type === "financials" ? ".pdf,.xls,.xlsx" : ".pdf,.doc,.docx"}
                  onChange={(e) =>
                    type === "businessPlan"
                      ? setBusinessPlan(e.target.files[0])
                      : type === "marketResearch"
                      ? setMarketResearch(e.target.files[0])
                      : setFinancials(e.target.files[0])
                  }
                />
              )}
            </div>
          ))}

          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn text-white" style={{ backgroundColor: "#047857" }}>
              <Upload size={18} className="me-2" /> Upload Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
