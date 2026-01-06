import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaWifi, FaArrowLeft, FaCheckCircle, FaCopy, FaBolt, FaShieldAlt, FaTrain } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function WifiSubscription() {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/wifi/status/${userId}`);
      setSubscriptionData(res.data);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      alert(t("Please log in first"));
      navigate("/login");
      return;
    }

    fetchSubscriptionStatus();
  }, [userId, navigate, t, fetchSubscriptionStatus]);


  const handleSubscribe = () => {
    navigate("/wifi-payment");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">{t("Loading subscription...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <FaArrowLeft />
            <span>{t("Back")}</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center">
              <FaWifi />
            </div>
            <h1 className="text-2xl font-bold">{t("WiFi Subscription")}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {!subscriptionData?.isActive ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-8 text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-500/20 border-4 border-purple-500/30 grid place-items-center">
                  <FaWifi className="text-purple-300" size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-2">{t("Monthly WiFi Access")}</h2>
                <p className="text-slate-300 max-w-md mx-auto">
                  {t("Get unlimited high-speed WiFi access in all station areas and trains")}
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center flex-shrink-0">
                    <FaBolt size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("High-Speed Internet")}</h4>
                    <p className="text-sm text-slate-400">{t("Fast and reliable connection")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center flex-shrink-0">
                    <FaShieldAlt size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("Secure Connection")}</h4>
                    <p className="text-sm text-slate-400">{t("Protected and encrypted")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center flex-shrink-0">
                    <FaWifi size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("All Stations")}</h4>
                    <p className="text-sm text-slate-400">{t("Access in every station")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 grid place-items-center flex-shrink-0">
                    <FaTrain size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("On Trains")}</h4>
                    <p className="text-sm text-slate-400">{t("Works during travel")}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <div className="text-5xl font-bold mb-2">৳100</div>
                <div className="text-slate-400">{t("per month")}</div>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <FaWifi />
                <span>{t("Subscribe Now")}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Badge */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCheckCircle className="text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold">{t("Active Subscription")}</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t("Subscriber:")}</span>
                  <span className="font-semibold">{userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t("Valid Until:")}</span>
                  <span className="font-semibold text-emerald-300">{formatDate(subscriptionData.expiryDate)}</span>
                </div>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaWifi className="text-purple-400" />
                <span>{t("Your WiFi Credentials")}</span>
              </h3>

              <div className="space-y-4">
                {/* WiFi ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t("WiFi ID")}</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg font-mono text-sm">
                      {subscriptionData.wifiId}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(subscriptionData.wifiId);
                        alert(t("WiFi ID copied!"));
                      }}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2"
                    >
                      <FaCopy />
                      <span className="hidden sm:inline">{t("Copy")}</span>
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">{t("Password")}</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg font-mono text-sm">
                      {subscriptionData.wifiPassword}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(subscriptionData.wifiPassword);
                        alert(t("Password copied!"));
                      }}
                      className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2"
                    >
                      <FaCopy />
                      <span className="hidden sm:inline">{t("Copy")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <FaWifi className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-100 mb-1">{t("How to Connect")}</h4>
                  <p className="text-sm text-blue-200/80">
                    {t('Use these credentials to connect to "MassTransit_WiFi" network in any station or train.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

