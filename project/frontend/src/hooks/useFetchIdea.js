import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useFetchIdea = (id) => {
  const { token } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !id) return;

    const fetchIdea = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/ideas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIdea(res.data.data);
      } catch (err) {
        console.error("Error fetching idea:", err);
        setError(err.response?.data?.message || "Failed to fetch idea");
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id, token]);

  return { idea, loading, error };
};
