import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AppLayout from "./components/AppLayout.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Landing } from "./pages/Landing.jsx";
import { Login } from "./components/Login.jsx";
import { Register } from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Chat } from "./pages/other_pages/Chat.jsx";

import { AdminLogin } from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import { EntrepreneurDashboard } from "./pages/entrepreneur/EntrepreneurDashboard.jsx";
import { SubmitIdea } from "./pages/entrepreneur/SubmitIdea.jsx";
import { MyIdeas } from "./pages/entrepreneur/MyIdeas.jsx";
import { IdeaDetail } from "./pages/entrepreneur/IdeaDetail.jsx";
import { UploadDocs } from "./pages/entrepreneur/UploadDocs.jsx";
import EditIdea from "./pages/entrepreneur/EditIdea.jsx";

import { InvestorDashboard } from "./pages/investor/InvestorDashboard.jsx";
import { Recommendations } from "./pages/investor/Recommendations.jsx";
import { InvestorIdeaDetail } from "./pages/investor/InvestorIdeaDetail.jsx";
import { RiskAssessment } from "./pages/investor/RiskAssessment.jsx";
import { Portfolio } from "./pages/investor/Portfolio.jsx";
import { Checkout } from "./pages/investor/Checkout.jsx";
import { AllIdeas } from "./pages/investor/AllIdeas.jsx";
import { TrackingPage } from "./pages/shared/TrackingPage.jsx";



function AppContent() {
  return (
    <div
      className="d-flex flex-column min-vh-100"
    >
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/e/dashboard"
            element={
              <ProtectedRoute role="entrepreneur">
                <EntrepreneurDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e/ideas/new"
            element={
              <ProtectedRoute role="entrepreneur">
                <SubmitIdea />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e/ideas"
            element={
              <ProtectedRoute role="entrepreneur">
                <MyIdeas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e/ideas/edit/:id"
            element={
              <ProtectedRoute role="entrepreneur">
                <EditIdea />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e/ideas/:id"
            element={
              <ProtectedRoute role="entrepreneur">
                <IdeaDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e/ideas/:id/docs"
            element={
              <ProtectedRoute role="entrepreneur">
                <UploadDocs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/i/dashboard"
            element={
              <ProtectedRoute role="investor">
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/i/recommendations"
            element={
              <ProtectedRoute role="investor">
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/i/ideas"
            element={
              <ProtectedRoute role="investor">
                <AllIdeas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/i/ideas/:id"
            element={
              <ProtectedRoute role="investor">
                <InvestorIdeaDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/i/ideas/:id/risk"
            element={
              <ProtectedRoute role="investor">
                <RiskAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/i/portfolio"
            element={
              <ProtectedRoute role="investor">
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/i/checkout/:ideaId"
            element={
              <ProtectedRoute role="investor">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:id"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <AppContent />
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}
export default App;
