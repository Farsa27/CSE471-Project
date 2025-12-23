import React, { useState } from "react";

export default function Feedback({ onSuccess } = {}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("submitted");
        setComment("");
        setRating(5);
        if (typeof onSuccess === "function") onSuccess();
      } else {
        setStatus(data.message || res.statusText || "Submission failed");
      }
    } catch (err) {
      setStatus(err.message || "Network error");
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="feedback-form" style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Rate your metro experience</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Rating</label>
          <div>
            {stars.map((s) => {
              const filled = s <= (hoverRating || rating);
              return (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    cursor: "pointer",
                    fontSize: 26,
                    color: filled ? "gold" : "#ddd",
                    marginRight: 6,
                    userSelect: "none",
                  }}
                  aria-label={`${s} star`}
                >
                  {filled ? "★" : "☆"}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Feedback (optional)</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} style={{ width: "100%" }} maxLength={500} />
        </div>

        <button type="submit">Submit</button>
      </form>

      {status === "sending" && <p>Sending...</p>}
      {status === "submitted" && <p>Thanks for your feedback!</p>}
      {status && status !== "sending" && status !== "submitted" && (
        <p style={{ color: "red" }}>{status}</p>
      )}
    </div>
  );
}
