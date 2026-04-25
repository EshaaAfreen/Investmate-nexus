import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, FileText, Trash2 } from 'lucide-react';

export const UploadDocs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [businessPlan, setBusinessPlan] = useState(null);
  const [marketResearch, setMarketResearch] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [ideaDocs, setIdeaDocs] = useState({ businessPlan: null, marketResearch: null, financials: null });
  const [success, setSuccess] = useState(false);

  // Fetch existing idea files
  const fetchIdeaDocs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/ideas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setIdeaDocs({
          businessPlan: data.data.files.businessPlan || null,
          marketResearch: data.data.files.marketResearch || null,
          financials: data.data.files.financials || null
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIdeaDocs();
  }, []);

  // Delete a file
  const handleDelete = async (type) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/delete-files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ types: [type] }),
      });
      const data = await res.json();
      if (res.ok) {
        setIdeaDocs(prev => ({ ...prev, [type]: null }));
        alert(`${type} deleted successfully`);
      } else {
        alert(data.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting document');
    }
  };

  // Upload files
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessPlan && !marketResearch && !financials) {
      alert('Please select at least one file to upload.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (businessPlan) formData.append('businessPlan', businessPlan);
    if (marketResearch) formData.append('marketResearch', marketResearch);
    if (financials) formData.append('financials', financials);

    try {
      const res = await fetch(`${API_URL}/ideas/${id}/upload-docs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        fetchIdeaDocs();
        setBusinessPlan(null);
        setMarketResearch(null);
        setFinancials(null);
      } else {
        alert(data.message || 'Failed to upload documents.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading documents.');
    }
  };

  return (
    <div className="container py-4">
      <button className="btn btn-link ps-0 mb-3 text-decoration-none text-secondary" onClick={() => navigate(`/e/ideas/${id}`)}>
        <ArrowLeft size={18} className="me-1" /> Back to Idea
      </button>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-header bg-primary-custom text-white border-0 py-3">
              <h4 className="mb-0 fw-bold">Upload Documents</h4>
            </div>
            <div className="card-body p-4">
              {success && <div className="alert alert-success animate-fade-in">Documents uploaded successfully!</div>}

              <form onSubmit={handleSubmit}>
                {['businessPlan', 'marketResearch', 'financials'].map((type) => (
                  <div className="mb-4" key={type}>
                    <label className="form-label fw-bold text-secondary">
                      {type === 'businessPlan'
                        ? 'Business Plan'
                        : type === 'marketResearch'
                          ? 'Market Research'
                          : 'Financial Projections'}
                    </label>

                    {ideaDocs[type] ? (
                      <div className="d-flex align-items-center p-2 bg-light rounded border">
                        <a
                          href={`${API_URL}/${ideaDocs[type].url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="me-auto text-decoration-none text-dark d-flex align-items-center"
                        >
                          <FileText size={18} className="me-2 text-primary-custom" /> {ideaDocs[type].filename}
                        </a>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(type)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        className="form-control"

                        onChange={(e) =>
                          type === 'businessPlan'
                            ? setBusinessPlan(e.target.files[0])
                            : type === 'marketResearch'
                              ? setMarketResearch(e.target.files[0])
                              : setFinancials(e.target.files[0])
                        }
                      />
                    )}
                  </div>
                ))}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end pt-3 border-top">
                  <button type="button" className="btn btn-outline-secondary me-md-2" onClick={() => navigate(`/e/ideas/${id}`)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary text-white">
                    <Upload size={18} className="me-2" /> Upload Documents
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
