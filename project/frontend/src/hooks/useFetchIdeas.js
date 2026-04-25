// hooks/useFetchIdeas.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useFetchIdeas = (endpoint) => {
  const { token } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
    const fetchIdeas = async () => {
      if (!token) return;

      try {
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIdeas(res.data.data || []);
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError(err.response?.data?.message || "Failed to fetch ideas");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [endpoint, token]);

  return { ideas, loading, error };
};
