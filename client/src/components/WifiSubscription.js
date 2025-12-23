import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WifiSubscription.css";

export default function WifiSubscription() {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userId) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    fetchSubscriptionStatus();
  }, [userId, navigate]);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wifi/status/${userId}`);
      setSubscriptionData(res.data);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="wifi-subscription-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="wifi-subscription-container">
      <div className="wifi-subscription-card">
        <button onClick={() => navigate("/home")} className="back-button">
          ← Back to Home
        </button>

        <h2>WiFi Subscription</h2>

        {!subscriptionData?.isActive ? (
          <div className="subscription-inactive">
            <div className="wifi-icon">📶</div>
            <h3>Monthly WiFi Access</h3>
            <p className="description">
              Get unlimited WiFi access in all station areas and trains for just 100 Taka per month!
            </p>

            <div className="features">
              <div className="feature">✓ High-speed internet</div>
              <div className="feature">✓ Access in all stations</div>
              <div className="feature">✓ Works on trains</div>
              <div className="feature">✓ Unique credentials</div>
            </div>

            <div className="price-section">
              <div className="price">৳100</div>
              <div className="price-label">per month</div>
            </div>

            <button onClick={handleSubscribe} className="subscribe-button">
              Subscribe Now
            </button>
          </div>
        ) : (
          <div className="subscription-active">
            <div className="active-badge">
              <span className="badge-icon">✓</span> Active Subscription
            </div>

            <div className="user-info">
              <h3>{userName}</h3>
              <p className="validity">
                Valid till: <strong>{formatDate(subscriptionData.expiryDate)}</strong>
              </p>
            </div>

            <div className="credentials-section">
              <h4>Your WiFi Credentials</h4>
              
              <div className="credential-item">
                <label>WiFi ID</label>
                <div className="credential-value">
                  <span>{subscriptionData.wifiId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(subscriptionData.wifiId);
                      alert("WiFi ID copied!");
                    }}
                    className="copy-button"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="credential-item">
                <label>Password</label>
                <div className="credential-value">
                  <span>{subscriptionData.wifiPassword}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(subscriptionData.wifiPassword);
                      alert("Password copied!");
                    }}
                    className="copy-button"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="info-box">
              <p>
                Use these credentials to connect to "MassTransit_WiFi" network in any station or
                train.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
