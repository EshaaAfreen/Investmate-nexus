import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import {
    DollarSign,
    FileText,
    TrendingUp,
    Activity,
    Plus,
    X,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Upload
} from "lucide-react";

export const TrackingPage = () => {
    const { id } = useParams(); // businessId
    const { user } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [activeTab, setActiveTab] = useState("utilization");
    const [loading, setLoading] = useState(true);

    // Data States
    const [utilization, setUtilization] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [cashFlow, setCashFlow] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [docs, setDocs] = useState([]);
    const [ideaData, setIdeaData] = useState(null);

    // Form States (for Entrepreneur)
    const [utilPayload, setUtilPayload] = useState({ category: "", amount: "", description: "" });
    const [revPayload, setRevPayload] = useState({ month: "", revenue: "", expenses: "" });
    const [cfPayload, setCfPayload] = useState({ month: "", cashIn: "", cashOut: "" });

    // Receipt Upload Modal/Form state
    const [showReceiptForm, setShowReceiptForm] = useState(false);
    const [receiptPayload, setReceiptPayload] = useState({ category: "", amount: "", file: null });

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

    useEffect(() => {
        fetchTrackingData();
    }, [id]);

    const fetchTrackingData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [utilRes, revRes, cfRes, docRes, recRes, ideaRes] = await Promise.all([
                axios.get(`${API_URL}/tracking/${id}/utilization`, { headers }),
                axios.get(`${API_URL}/tracking/${id}/revenue`, { headers }),
                axios.get(`${API_URL}/tracking/${id}/cashflow`, { headers }),
                axios.get(`${API_URL}/tracking/${id}/docs`, { headers }),
                axios.get(`${API_URL}/tracking/${id}/receipts`, { headers }),
                axios.get(`${API_URL}/ideas/${id}`, { headers })
            ]);

            setUtilization(utilRes.data.data);
            setRevenue(revRes.data.data);
            setCashFlow(cfRes.data.data);
            setDocs(docRes.data.data);
            setReceipts(recRes.data.data);
            setIdeaData(ideaRes.data.data);
        } catch (err) {
            console.error("Error fetching tracking data", err);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- HANDLERS ----------------
    const handleUtilSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/tracking/${id}/utilization`, utilPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrackingData();
            setUtilPayload({ category: "", amount: "", description: "" });
        } catch (err) { alert("Failed to add utilization"); }
    };

    const handleRevSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/tracking/${id}/revenue`, revPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrackingData();
            setRevPayload({ month: "", revenue: "", expenses: "" });
        } catch (err) { alert("Failed to add revenue"); }
    };

    const handleCfSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/tracking/${id}/cashflow`, cfPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrackingData();
            setCfPayload({ month: "", cashIn: "", cashOut: "" });
        } catch (err) { alert("Failed to add cash flow"); }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.isTrusted ? e.target.files[0] : e; // Handle both direct event and manual file passing
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        let endpoint = "docs";

        if (type === "receipt") {
            formData.append("category", receiptPayload.category || "General");
            formData.append("amount", receiptPayload.amount || 0);
            endpoint = "receipts";
        } else {
            formData.append("type", type);
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/tracking/${id}/${endpoint}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            fetchTrackingData();
            alert("File uploaded!");
            setShowReceiptForm(false);
            setReceiptPayload({ category: "", amount: "", file: null });
        } catch (err) { alert("Upload failed"); }
    };


    // ---------------- RENDERERS ----------------
    const renderUtilization = () => (
        <div className="row g-4">
            <div className="col-md-6">
                <div className="card-custom p-4 h-100">
                    <h5 className="mb-4 text-primary-custom">Total Spending Breakdown</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={utilization}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="amount"
                                nameKey="category"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {utilization.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="col-md-6">
                {user.activeRole === "entrepreneur" && (
                    <div className="card-custom p-4 mb-3">
                        <h6 className="mb-3 fw-bold">Add Utilization</h6>
                        <form onSubmit={handleUtilSubmit}>
                            <input className="form-control mb-2" placeholder="Category (e.g. Marketing)" value={utilPayload.category} onChange={e => setUtilPayload({ ...utilPayload, category: e.target.value })} required />
                            <input className="form-control mb-2" type="number" placeholder="Amount" value={utilPayload.amount} onChange={e => setUtilPayload({ ...utilPayload, amount: e.target.value })} required />
                            <input className="form-control mb-2" placeholder="Description" value={utilPayload.description} onChange={e => setUtilPayload({ ...utilPayload, description: e.target.value })} />
                            <button className="btn btn-sm btn-primary w-100 mt-2">Add Entry</button>
                        </form>
                    </div>
                )}
                <div className="card-custom p-4">
                    <h6 className="mb-3 fw-bold">Spending Log</h6>
                    <div className="table-responsive" style={{ maxHeight: '200px' }}>
                        <table className="table table-sm table-hover">
                            <thead className="bg-light"><tr><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                            <tbody>
                                {utilization.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.category}</td>
                                        <td>${u.amount.toLocaleString()}</td>
                                        <td>{new Date(u.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRevenue = () => (
        <div className="row">
            <div className="col-md-8">
                <div className="card shadow-sm border-0 p-3">
                    <h5>Monthly Revenue & Net Profit</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                            <Line type="monotone" dataKey="netProfit" stroke="#8884d8" name="Net Profit" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="col-md-4">
                {/* ROI BADGE - Simple Calc */}
                <div className="card shadow-sm border-0 p-3 mb-3 text-center bg-light">
                    <h6 className="text-muted">Net Profit (Total)</h6>
                    <h3 className="text-success">${revenue.reduce((acc, curr) => acc + (curr.netProfit || 0), 0).toLocaleString()}</h3>
                </div>

                {user.activeRole === "entrepreneur" && (
                    <div className="card shadow-sm border-0 p-3">
                        <h6>Add Monthly Data</h6>
                        <form onSubmit={handleRevSubmit}>
                            <input className="form-control mb-2" placeholder="Month (e.g. Jan 2024)" value={revPayload.month} onChange={e => setRevPayload({ ...revPayload, month: e.target.value })} required />
                            <input className="form-control mb-2" type="number" placeholder="Revenue" value={revPayload.revenue} onChange={e => setRevPayload({ ...revPayload, revenue: e.target.value })} required />
                            <input className="form-control mb-2" type="number" placeholder="Expenses" value={revPayload.expenses} onChange={e => setRevPayload({ ...revPayload, expenses: e.target.value })} required />
                            <button className="btn btn-sm btn-success w-100">Update Report</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCashFlow = () => {
        // Calculate Health
        // If netCash is consistently negative (simplified logic: if last entry is negative -> Risky)
        const lastEntry = cashFlow.length > 0 ? cashFlow[cashFlow.length - 1] : null;
        const isRisky = lastEntry ? lastEntry.cashIn - lastEntry.cashOut < 0 : false;

        return (
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 p-3">
                        <div className="d-flex justify-content-between">
                            <h5>Cash Flow (In vs Out)</h5>
                            {lastEntry && (
                                <span className={`badge ${isRisky ? 'bg-danger' : 'bg-success'}`}>
                                    Health: {isRisky ? "Risky (Negative Flow)" : "Stable (Positive Flow)"}
                                </span>
                            )}
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={cashFlow}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cashIn" fill="#4caf50" name="Cash In" />
                                <Bar dataKey="cashOut" fill="#f44336" name="Cash Out" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-md-4">
                    {user.activeRole === "entrepreneur" && (
                        <div className="card shadow-sm border-0 p-3">
                            <h6>Update Cash Flow</h6>
                            <form onSubmit={handleCfSubmit}>
                                <input className="form-control mb-2" placeholder="Month (e.g. Jan 2024)" value={cfPayload.month} onChange={e => setCfPayload({ ...cfPayload, month: e.target.value })} required />
                                <input className="form-control mb-2" type="number" placeholder="Cash In" value={cfPayload.cashIn} onChange={e => setCfPayload({ ...cfPayload, cashIn: e.target.value })} required />
                                <input className="form-control mb-2" type="number" placeholder="Cash Out" value={cfPayload.cashOut} onChange={e => setCfPayload({ ...cfPayload, cashOut: e.target.value })} required />
                                <button className="btn btn-sm btn-success w-100">Add Entry</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );

    };

    const renderDocs = () => (
        <div className="row">
            <div className="col-md-6">
                <div className="card shadow-sm border-0 p-3 mb-4">
                    <h5>Regulatory Documents</h5>
                    {docs.length === 0 ? <p className="text-muted">No regulatory documents uploaded.</p> : (
                        <ul className="list-group list-group-flush">
                            {docs.map(doc => (
                                <li key={doc._id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                                    <span>
                                        <FileText size={16} className="me-2 text-primary" />
                                        {doc.type.toUpperCase()}
                                    </span>
                                    <div className="d-flex align-items-center">
                                        {doc.verified ? <CheckCircle size={16} color="green" className="me-2" /> : <XCircle size={16} color="red" className="me-2" />}
                                        <a href={`${API_URL}/tracking/docs/${doc._id}/file?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="card shadow-sm border-0 p-3">
                    <h5>Idea Documents</h5>
                    {!ideaData?.files || Object.values(ideaData.files).every(f => !f) ? (
                        <p className="text-muted">No idea documents uploaded.</p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {ideaData.files.businessPlan && (
                                <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                                    <span><FileText size={16} className="me-2 text-primary" /> Business Plan</span>
                                    <a href={`${API_URL}/ideas/${id}/files/businessPlan?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                                </li>
                            )}
                            {ideaData.files.marketResearch && (
                                <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                                    <span><FileText size={16} className="me-2 text-primary" /> Market Research</span>
                                    <a href={`${API_URL}/ideas/${id}/files/marketResearch?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                                </li>
                            )}
                            {ideaData.files.financials && (
                                <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                                    <span><FileText size={16} className="me-2 text-primary" /> Financials</span>
                                    <a href={`${API_URL}/ideas/${id}/files/financials?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {user.activeRole === "entrepreneur" && (
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-3 mb-3">
                        <h6>Upload Regulatory Doc</h6>
                        <div className="mb-3">
                            <label className="form-label small text-muted">Registration / License / NTN</label>
                            <div className="input-group">
                                <input type="file" className="form-control" onChange={(e) => handleFileUpload(e, 'registration')} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReceipts = () => (
        <div className="row">
            <div className="col-md-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Receipts & Proofs</h5>
                    {user.activeRole === "entrepreneur" && !showReceiptForm && (
                        <button className="btn btn-sm btn-outline-success" onClick={() => setShowReceiptForm(true)}>
                            Upload New Receipt <Plus size={14} className="ms-1" />
                        </button>
                    )}
                </div>

                {showReceiptForm && (
                    <div className="card shadow-sm border-0 p-3 mb-4 bg-light">
                        <h6>New Receipt Details</h6>
                        <div className="row g-2">
                            <div className="col-md-4">
                                <input className="form-control" placeholder="Category (e.g. Rent)" value={receiptPayload.category} onChange={e => setReceiptPayload({ ...receiptPayload, category: e.target.value })} />
                            </div>
                            <div className="col-md-3">
                                <input className="form-control" type="number" placeholder="Amount" value={receiptPayload.amount} onChange={e => setReceiptPayload({ ...receiptPayload, amount: e.target.value })} />
                            </div>
                            <div className="col-md-5 d-flex gap-2">
                                <input type="file" className="form-control" onChange={e => setReceiptPayload({ ...receiptPayload, file: e.target.files[0] })} />
                                <button className="btn btn-success" onClick={() => handleFileUpload(receiptPayload.file, 'receipt')} disabled={!receiptPayload.file}>Upload</button>
                                <button className="btn btn-outline-secondary" onClick={() => setShowReceiptForm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-3">
                    {receipts.length === 0 ? <div className="col-12 text-center py-5 text-muted">No receipts found.</div> : receipts.map(r => (
                        <div key={r._id} className="col-md-3">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="bg-light d-flex align-items-center justify-content-center border-bottom" style={{ height: '120px' }}>
                                    <FileText size={32} className="text-muted" />
                                </div>
                                <div className="card-body p-3">
                                    <p className="mb-1 fw-bold text-truncate" title={r.filename}>{r.filename}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge bg-info-subtle text-info">{r.category}</span>
                                        <span className="fw-bold text-success">${r.amount?.toLocaleString() || 0}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">{new Date(r.date).toLocaleDateString()}</small>
                                        <a href={`${API_URL}/tracking/receipts/${r._id}/file?token=${localStorage.getItem("token")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link p-0 text-decoration-none">View File</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );


    if (loading) return <div className="p-5 text-center text-primary-custom fw-bold">Loading Tracking Data...</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button className="btn btn-link ps-0 mb-2 text-decoration-none text-secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} className="me-1" /> Back
                    </button>
                    <h2 className="text-primary-custom">Business Tracking: <span className="text-dark">{ideaData?.title}</span></h2>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-4 gap-2">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'utilization' ? 'active bg-primary-custom' : 'text-secondary bg-white border'}`} onClick={() => setActiveTab('utilization')}>Utilization</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'revenue' ? 'active bg-primary-custom' : 'text-secondary bg-white border'}`} onClick={() => setActiveTab('revenue')}>Revenue & ROI</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'cashflow' ? 'active bg-primary-custom' : 'text-secondary bg-white border'}`} onClick={() => setActiveTab('cashflow')}>Cash Flow</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'docs' ? 'active bg-primary-custom' : 'text-secondary bg-white border'}`} onClick={() => setActiveTab('docs')}>Documents</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'receipts' ? 'active bg-primary-custom' : 'text-secondary bg-white border'}`} onClick={() => setActiveTab('receipts')}>Receipts</button>
                </li>
            </ul>

            {/* Content */}
            <div className="tab-content animate-fade-in">
                {activeTab === 'utilization' && renderUtilization()}
                {activeTab === 'revenue' && renderRevenue()}
                {activeTab === 'cashflow' && renderCashFlow()}
                {activeTab === 'docs' && renderDocs()}
                {activeTab === 'receipts' && renderReceipts()}
            </div>

        </div >
    );
};
