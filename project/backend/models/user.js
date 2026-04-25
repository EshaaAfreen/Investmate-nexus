import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 👇 MULTIPLE ROLES
  roles: {
    type: [String],
    enum: ["entrepreneur", "investor", "admin"],
    default: ["entrepreneur"],
  },

  // 👇 CURRENTLY ACTIVE ROLE
  activeRole: {
    type: String,
    enum: ["entrepreneur", "investor", "admin"],
    default: "entrepreneur",
  },

  createdAt: { type: Date, default: Date.now },
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
