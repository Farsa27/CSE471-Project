import React, { useState } from "react";
import "./Feedback.css";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const submit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setMessage({ type: "error", text: "Please select a rating between 1 and 5" });
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Thank you for your feedback!" });
        setRating(0);
        setComment("");
      } else {
        const json = await res.json();
        setMessage({ type: "error", text: json.message || "Failed to submit feedback" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error" });
    }
  };

  return (
    <div className="feedback-page">
      <form onSubmit={submit} className="feedback-form">
        <h2>Rate your metro experience</h2>

        <div className="stars" role="group" aria-label="rating">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hover || rating);
            return (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={active ? "on" : "off"}
                aria-label={`${star} star`}
              >
                &#9733;
              </button>
            );
          })}
        </div>

        <textarea
          placeholder="Write a short review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" className="submit-btn">Submit Feedback</button>
        <button
          type="button"
          style={{ color: "white" }}
          onClick={() => {
            setRating(0);
            setComment("");
            setMessage(null);
          }}
          className="nav-link"
        >
          Reset
        </button>

        {message && (
          <div className={`message ${message.type === "success" ? "success" : "error"}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
