import React, { useState } from "react";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setMessage("Please select a rating between 1 and 5");
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        setMessage("Thank you for your feedback!");
        setRating(0);
        setComment("");
      } else {
        const json = await res.json();
        setMessage(json.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Rate your metro experience</h2>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hover || rating);
            return (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-3xl focus:outline-none ${active ? "text-yellow-400" : "text-gray-300"}`}
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
          className="w-full p-2 border rounded min-h-[100px]"
        />

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Submit Feedback</button>
          <button type="button" onClick={() => { setRating(0); setComment(""); setMessage(""); }} className="px-3 py-2 bg-gray-200 rounded">Reset</button>
        </div>

        {message && <div className="text-sm text-gray-700">{message}</div>}
      </form>
    </main>
  );
}
