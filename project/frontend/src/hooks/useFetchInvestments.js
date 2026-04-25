import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useFetchInvestments = () => {
  const { token } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchInvestments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/investments/my-investments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvestments(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [token]);

  return { investments, loading, error };
};
