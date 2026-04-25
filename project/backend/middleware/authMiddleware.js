import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Session expired. Please login again.",
      code: "TOKEN_MISSING",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user object to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
        code: "USER_NOT_FOUND",
      });
    }

    next();
  } catch (err) {
    // 🔒 HANDLE TOKEN EXPIRY CLEANLY
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      message: "Session expired. Please login again.",
      code: "TOKEN_INVALID",
    });
  }
};
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.activeRole !== role) {
      return res.status(403).json({
        message: `Access denied. ${role} role required.`,
      });
    }
    next();
  };
};

export const verifyAdmin = (req, res, next) => {
  if (req.user?.roles?.includes("admin")) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admins only.",
  });
};
