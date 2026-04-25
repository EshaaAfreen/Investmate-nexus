import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/ideas";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchAllIdeas = async () => {
  return axios.get(`${API_URL}/admin/ideas`, authHeader());
};

export const updateIdeaStatus = async (id, status) => {
  return axios.put(
    `${API_URL}/admin/idea/${id}/status`,
    { status },
    authHeader()
  );
};
