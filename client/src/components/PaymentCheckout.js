import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentCheckout.css";

const stripePromise = loadStripe("pk_test_51Sf6nWG5kxx8ChUoi0EGOAF7CGToqKh39NIHWR5wNAOBSykxNe2TNfBInDPm9MCl6LdnQ7tm3Y2WbT9w6UxHLHj800e69z1eVq");

function CheckoutForm({ bookingData }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, save booking
      try {
        await axios.post("http://localhost:5000/api/payments/save-booking", {
          ...bookingData,
          paymentIntentId: paymentIntent.id,
        });
        
        setMessage("Payment successful! Your ticket has been booked.");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } catch (err) {
        setMessage("Payment succeeded but booking failed. Please contact support.");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements} className="pay-button">
        {isLoading ? "Processing..." : `Pay ৳${bookingData.price}`}
      </button>
      {message && <div className="payment-message">{message}</div>}
    </form>
  );
}

export default function PaymentCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const bookingData = location.state?.bookingData;

  useEffect(() => {
    if (!bookingData) {
      navigate("/");
      return;
    }

    // Create payment intent
    axios
      .post("http://localhost:5000/api/payments/create-payment-intent", {
        amount: bookingData.price,
      })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("Error creating payment intent:", err));
  }, [bookingData, navigate]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Payment</h2>
        <div className="booking-summary">
          <h3>Booking Details</h3>
          <p><strong>Train:</strong> {bookingData?.trainName}</p>
          <p><strong>From:</strong> {bookingData?.from}</p>
          <p><strong>To:</strong> {bookingData?.to}</p>
          <p><strong>Departure:</strong> {bookingData?.departure}</p>
          <p><strong>Arrival:</strong> {bookingData?.arrival}</p>
          <p><strong>Passenger:</strong> {bookingData?.passengerName}</p>
          <p><strong>Email:</strong> {bookingData?.passengerEmail}</p>
          <p className="price"><strong>Amount:</strong> ৳{bookingData?.price}</p>
        </div>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm bookingData={bookingData} />
          </Elements>
        )}
      </div>
    </div>
  );
}
