import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchRecommendedIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/ideas/recommendations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Response is an array, set directly
        if (Array.isArray(res.data.data)) {
          setIdeas(res.data.data || []);
        } else {
          setIdeas([]);
          console.warn("Unexpected response:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);

        // If token is invalid or expired
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login"; // redirect to login
          return;
        }

        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return { ideas, loading, error };
};
