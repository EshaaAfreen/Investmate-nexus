import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🔹 Add this:
export const addRole = async ({ role }) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/users/add-role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Switch role
export const switchRole = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/users/switch-role`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
