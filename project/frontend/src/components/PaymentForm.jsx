// src/components/PaymentForm.jsx
import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = ({ amount, ideaId, token, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSecret, setFetchingSecret] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (amount >= 5) {
      setFetchingSecret(true);
      setError("");
      // Create PaymentIntent on backend
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/payments/create-payment-intent`,
          { amount },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setFetchingSecret(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Error connecting to payment gateway");
          setFetchingSecret(false);
        });
    }
  }, [amount, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Payment system not initialized. Please refresh.");
      setLoading(false);
      return;
    }

    try {
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        // ✅ Call backend to save/update investment record
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/investments/${ideaId}`,
          { amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          onSuccess();
        } else {
          setError("Payment succeeded but failed to update investment record. Please contact support.");
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An unexpected error occurred during payment.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="mb-4">
        <label className="form-label fw-bold text-secondary small uppercase">Card Details</label>
        <div className="p-3 border rounded bg-white shadow-sm">
          <CardElement options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
            }
          }} />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary text-white w-100 py-2 fw-bold"
        disabled={!stripe || loading || fetchingSecret || !amount || !clientSecret}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...</>
        ) : fetchingSecret ? (
          "Initializing..."
        ) : (
          `Complete Investment of $${amount}`
        )}
      </button>
      {!clientSecret && !fetchingSecret && amount > 0 && amount < 5 && (
        <p className="text-danger small mt-2">Minimum investment is $5</p>
      )}
    </form>
  );
};

export default PaymentForm;
