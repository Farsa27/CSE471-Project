import React, { useEffect, useState } from 'react';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch notifications (reusable for refresh)
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/notifications');

      if (!response.ok) {
        throw new Error(`Failed to load notifications (${response.status})`);
      }

      const data = await response.json();

      // Flexible handling: accept { notifications: [...] }, [...] or { data: [...] }
      const notifs = data.notifications || data.data || data || [];
      setNotifications(Array.isArray(notifs) ? notifs : []);
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Check your connection.');
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchNotifications();
  };

  // Format timestamp nicely
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h2>Notifications</h2>
        <button onClick={handleRefresh} className="refresh-btn" title="Refresh notifications">
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <p className="text-center text-gray-600">Loading your notifications...</p>
          <div className="spinner"></div>
        </div>
      )}

      {error && !loading && (
        <div className="error-message">
          <p className="error-text">⚠️ {error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <p className="text-gray-600 text-center">No notifications at the moment.</p>
          <p className="text-sm text-center text-gray-500 mt-2">
            You'll be notified here about train delays, cancellations, or important updates.
          </p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification._id || notification.id || Math.random()}
              className="notification-card"
            >
              <div className="notification-icon">⚠️</div>
              <div className="notification-content">
                <p className="message">
                  <strong>{notification.title || 'System Alert'}</strong>
                </p>
                <p className="details">{notification.message || 'No details provided.'}</p>

                {notification.alternative && (
                  <div className="alternative-box">
                    <span className="alternative-label">👉 Suggested Alternative:</span>
                    <span className="alternative-text">{notification.alternative}</span>
                  </div>
                )}

                <p className="timestamp">{formatDate(notification.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}