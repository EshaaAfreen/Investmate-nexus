import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      roles: user.roles,
      activeRole: user.activeRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
};

export default generateToken;