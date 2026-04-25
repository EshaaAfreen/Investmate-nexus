import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, MessageSquare, Plus } from "lucide-react";

export const Navbar = () => {
  const { user, logout, switchRole, addRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we should show the full dashboard navbar or the guest/landing navbar
  const isDashboardRoute = location.pathname.startsWith('/e/') ||
    location.pathname.startsWith('/i/') ||
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname.startsWith('/tracking/');

  // Logout handler
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    if (window.idleTimerRef) clearTimeout(window.idleTimerRef);
    if (window.logoutTimerRef) clearTimeout(window.logoutTimerRef);

    logout();
    navigate("/");
  };

  const handleAddRole = async (roleToAdd) => {
    const res = await addRole(roleToAdd);
    if (res.success) alert(`Role "${roleToAdd}" added successfully!`);
    else alert(res.error);
  };

  const getBrandLink = () => {
    if (!user) return "/";
    if (user.activeRole === "entrepreneur") return "/e/dashboard";
    if (user.activeRole === "investor") return "/i/dashboard";
    if (user.activeRole === "admin") return "/admin/dashboard";
    return "/";
  };


  // Define if we should show the dashboard-specific links
  const showDashboardLinks = !!user;


  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom py-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to={getBrandLink()}>
          Investmate Nexus
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!showDashboardLinks ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/login">
                    Admin Portal
                  </Link>
                </li>

                {user && (
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => navigate(user.activeRole === 'entrepreneur' ? '/e/dashboard' : user.activeRole === 'investor' ? '/i/dashboard' : '/admin/dashboard')}>
                      Return to Dashboard
                    </button>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={user.activeRole === "entrepreneur" ? "/e/dashboard" : user.activeRole === "investor" ? "/i/dashboard" : "/admin/dashboard"}
                  >
                    Dashboard
                  </Link>
                </li>

                {user.activeRole === "entrepreneur" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/e/ideas">
                      My Ideas
                    </Link>
                  </li>
                )}

                {user.activeRole === "investor" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/i/ideas">
                        All Ideas
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/i/recommendations">
                        Recommendations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/i/portfolio">
                        Portfolio
                      </Link>
                    </li>
                  </>
                )}

                {user.activeRole !== "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/chat">
                      <MessageSquare size={18} className="me-1" /> Messages
                    </Link>
                  </li>
                )}

                {/* Role Switcher */}
                {user?.roles && user?.roles.length > 1 && (
                  <li className="nav-item dropdown">
                    <button className="btn btn-link nav-link dropdown-toggle" data-bs-toggle="dropdown">
                      Role: {user.activeRole.charAt(0).toUpperCase() + user.activeRole.slice(1)}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {user?.roles.map((r) => (
                        <li key={r}>
                          <button
                            className="dropdown-item"
                            disabled={r === user.activeRole}
                            onClick={() => switchRole(r)}
                          >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}

                {/* Add Role */}
                {["entrepreneur", "investor"]
                  .filter((r) => !user?.roles?.includes(r))
                  .length > 0 && (
                    <li className="nav-item dropdown">
                      <button className="btn btn-link nav-link dropdown-toggle" data-bs-toggle="dropdown">
                        <Plus size={16} /> Add Role
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        {["entrepreneur", "investor"]
                          .filter((r) => !user?.roles?.includes(r))
                          .map((r) => (
                            <li key={r}>
                              <button className="dropdown-item" onClick={() => handleAddRole(r)}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </button>
                            </li>
                          ))}
                      </ul>
                    </li>
                  )}

                <li className="nav-item">
                  <span className="nav-link fw-bold text-white">{user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    <LogOut size={18} />
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
