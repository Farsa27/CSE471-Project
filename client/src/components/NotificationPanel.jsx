
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationPanel.css'; 

export default function NotificationPanel() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userEmail = localStorage.getItem('userEmail');

  const fetchNotifications = useCallback(async () => {
    if (!userEmail) {
      setError('Please log in to view your notifications.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/user/${userEmail}`);

      if (!response.ok) {
        if (response.status === 404) {
          setNotifications([]);
        } else {
          throw new Error('Failed to load notifications');
        }
      } else {
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    fetchNotifications();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour${diffMins >= 120 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="notification-panel">
      {/* Header with Back Button */}
      <div className="panel-header">
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            cursor: 'pointer',
            color: '#e0f5e0',
            padding: '0 10px'
          }}
          title="Go back"
        >
          ←
        </button>

        <h2>Notifications</h2>

        <button onClick={handleRefresh} className="refresh-btn">
          ↻ Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Loading your notifications...</p>
          <div className="spinner"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-message">
          <p className="error-text">⚠️ {error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No notifications at the moment.</p>
          <p className="text-sm text-center text-gray-500 mt-2">
            You'll be notified here about train delays, 
            cancellations, 
            or important updates.
          </p>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((notification, index) => (
            <div
              key={notification._id || index}
              className="notification-card"
            >
              <div className="notification-icon">⚠️</div>
              <div className="notification-content">
                <p className="message">
                  <strong>{notification.title || 'Train Delay Alert'}</strong>
                </p>
                <p className="details">
                  {notification.message || 'No details provided.'}
                </p>

                {notification.alternative && (
                  <div className="alternative-box">
                    <span className="alternative-label">Suggested Alternative:</span>
                    <span className="alternative-text">
                      {notification.alternative}
                    </span>
                  </div>
                )}

                <p className="timestamp">
                  {formatDate(notification.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}