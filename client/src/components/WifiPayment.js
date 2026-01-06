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
import { FaWifi, FaArrowLeft, FaCreditCard, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe("pk_test_51Sf6nWG5kxx8ChUoi0EGOAF7CGToqKh39NIHWR5wNAOBSykxNe2TNfBInDPm9MCl6LdnQ7tm3Y2WbT9w6UxHLHj800e69z1eVq");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(null);
  const { t } = useTranslation();

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
      setMessageType('error');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, activate subscription
      try {
        await axios.post("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/wifi/activate", {
          userId,
          paymentIntentId: paymentIntent.id,
        });
        
        setMessage(t("Payment successful! Your WiFi subscription is now active."));
        setMessageType('success');
        setTimeout(() => {
          navigate("/wifi-subscription");
        }, 2000);
      } catch (err) {
        setMessage(t("Payment succeeded but subscription activation failed. Please contact support."));
        setMessageType('error');
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <PaymentElement />
      </div>
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 font-semibold text-lg transition flex items-center justify-center gap-2"
      >
        <FaCreditCard />
        <span>{isLoading ? t("Processing...") : t("Pay ৳100")}</span>
      </button>
      {message && (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${
          messageType === 'success'
            ? 'border border-emerald-500/30 bg-emerald-500/10'
            : 'border border-red-500/30 bg-red-500/10'
        }`}>
          {messageType === 'success' ? (
            <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="text-red-400 mt-1 flex-shrink-0" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </form>
  );
}

export default function WifiPayment() {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const userName = localStorage.getItem("userName");
  const { t } = useTranslation();

  useEffect(() => {
    // Create payment intent
    axios
      .post("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/wifi/create-payment-intent")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/wifi-subscription")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <FaArrowLeft />
            <span>{t("Back")}</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center">
              <FaWifi />
            </div>
            <h1 className="text-2xl font-bold">{t("WiFi Subscription Payment")}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Subscription Summary */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">{t("Subscription Details")}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">{t("Subscriber")}</span>
              <span className="font-semibold">{userName}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">{t("Subscription Start")}</span>
              <span className="font-semibold text-sm">{formatDate(startDate)}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">{t("Subscription End")}</span>
              <span className="font-semibold text-sm">{formatDate(endDate)}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-semibold">{t("Total Amount")}</span>
              <span className="text-2xl font-bold text-purple-300">৳100</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCreditCard className="text-purple-400" />
            <span>{t("Payment Information")}</span>
          </h2>
          {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">{t("Preparing payment...")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

