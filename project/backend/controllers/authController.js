// controllers/authController.js
// Signup: accept roles array or single role

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const initialRole = role || "entrepreneur";

    const user = await User.create({
      name,
      email,
      password,
      roles: [initialRole],
      activeRole: initialRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles || [user.role],
      activeRole: user.activeRole,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles || [user.role], // fallback
      activeRole: user.activeRole || (user.roles && user.roles[0]) || user.role, // fallback
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
