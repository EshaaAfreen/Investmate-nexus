import { createContext, useContext, useEffect, useState } from "react";
import * as authAPI from "../api/auth";
import * as userAPI from "../api/user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Initialize auth from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setIsAuthenticated(true);
      }
    } catch {
      clearAuth();
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        roles: Array.isArray(data.roles) ? data.roles : ["entrepreneur"],
        activeRole:
          data.activeRole ||
          (Array.isArray(data.roles) && data.roles[0]) ||
          "entrepreneur",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);

      return { success: true, activeRole: userData.activeRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  // REGISTER
  const register = async (name, email, password, role) => {
    try {
      const data = await authAPI.signup({ name, email, password, role });

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        roles: data.roles,
        activeRole: data.activeRole,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // LOGOUT (STATE ONLY)
  const logout = () => {
    clearAuth();
  };

  // SWITCH ROLE
  const switchRole = async (role) => {
    try {
      const data = await userAPI.switchRole({ role });
      const updatedUser = { ...user, activeRole: data.activeRole };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch {
      return { success: false };
    }
  };

  // ADD ROLE
  const addRole = async (role) => {
    try {
      const data = await userAPI.addRole({ role });

      const updatedUser = {
        ...user,
        roles: data.roles,
        activeRole: data.activeRole,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch {
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        addRole,
        isEntrepreneur: user?.activeRole === "entrepreneur",
        isInvestor: user?.activeRole === "investor",
        isAdmin: user?.roles?.includes("admin"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
