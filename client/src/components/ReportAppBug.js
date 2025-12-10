import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportAppBug = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    if (!userStr) return alert("Please login to report");
    
    const user = JSON.parse(userStr);
    if (!user._id) return alert("Please login to report");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("rating", rating);
    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports/app-bug", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Report submitted");
        navigate("/home");
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Submission error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Report App Bug</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (optional)"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="w-full border px-3 py-2 rounded h-24"
          />

          <div>
            <label className="block mb-1">Upload images or videos (optional)</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>

          <div>
            <label className="block mb-1">Rating</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="border px-2 py-1 rounded">
              <option value={5}>5 - Excellent</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportAppBug;
