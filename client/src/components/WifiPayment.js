import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WifiPayment.css";

const stripePromise = loadStripe("pk_test_51Sf6nWG5kxx8ChUoi0EGOAF7CGToqKh39NIHWR5wNAOBSykxNe2TNfBInDPm9MCl6LdnQ7tm3Y2WbT9w6UxHLHj800e69z1eVq");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/wifi-success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, activate subscription
      try {
        await axios.post("http://localhost:5000/api/wifi/activate", {
          userId,
          paymentIntentId: paymentIntent.id,
        });
        
        setMessage("Payment successful! Your WiFi subscription is now active.");
        setTimeout(() => {
          navigate("/wifi-subscription");
        }, 2000);
      } catch (err) {
        setMessage("Payment succeeded but subscription activation failed. Please contact support.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements} className="pay-button">
        {isLoading ? "Processing..." : "Pay ৳100"}
      </button>
      {message && <div className="payment-message">{message}</div>}
    </form>
  );
}

export default function WifiPayment() {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    // Create payment intent
    axios
      .post("http://localhost:5000/api/wifi/create-payment-intent")
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("Error creating payment intent:", err));
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() + 2);

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="wifi-payment-container">
      <div className="wifi-payment-card">
        <button onClick={() => navigate("/wifi-subscription")} className="back-button">
          ← Back
        </button>

        <h2>WiFi Subscription Payment</h2>

        <div className="subscription-summary">
          <h3>Subscription Details</h3>
          <div className="detail-row">
            <span className="label">Subscriber:</span>
            <span className="value">{userName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Subscription Start:</span>
            <span className="value">{formatDate(startDate)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Subscription End:</span>
            <span className="value">{formatDate(endDate)}</span>
          </div>
          <div className="detail-row price-row">
            <span className="label">Amount:</span>
            <span className="value price">৳100</span>
          </div>
        </div>

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
}
