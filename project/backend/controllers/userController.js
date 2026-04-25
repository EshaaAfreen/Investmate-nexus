import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";



// Add a new role
export const addRole = async (req, res) => {
  const { role } = req.body;

  if (!["entrepreneur", "investor"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Get the logged-in user
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Initialize roles array if empty
  let roles = user.roles || (user.role ? [user.role] : []);

  // Check if role already exists
  if (roles.includes(role)) {
    return res.status(400).json({ message: "Role already assigned" });
  }

  // Add the new role
  roles.push(role);
  user.roles = roles;

  // Optionally, set activeRole to the new role if you want
  user.activeRole = role;

  await user.save();

  res.json({
    message: "Role added successfully",
    roles: user.roles,
    activeRole: user.activeRole,
    token: generateToken(user),
  });
};


// Switch active role
export const switchRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.roles.includes(role)) {
    return res.status(403).json({ message: "Role not assigned to user" });
  }

  user.activeRole = role;
  await user.save();

  res.json({
    message: "Role switched successfully",
    activeRole: user.activeRole,
    token: generateToken(user),
  });
};

// Get user by ID (for chat initiation)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email activeRole");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
