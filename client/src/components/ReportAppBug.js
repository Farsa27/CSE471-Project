import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBug, FaArrowLeft, FaPaperPlane, FaStar, FaUpload } from "react-icons/fa";

const ReportAppBug = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to report");
      setIsSubmitting(false);
      return;
    }
    
    const user = JSON.parse(userStr);
    if (!user._id) {
      alert("Please login to report");
      setIsSubmitting(false);
      return;
    }

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
        alert("Report submitted successfully!");
        navigate("/my-app-bug-reports");
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-300 grid place-items-center">
              <FaBug />
            </div>
            <h1 className="text-2xl font-bold">Report App Bug</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tell us what went wrong</h2>
            <p className="text-slate-300 text-sm">Your feedback helps us fix bugs and improve the app</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject <span className="text-slate-400">(Optional)</span></label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400/40 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description <span className="text-red-400">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the bug in detail. Include steps to reproduce if possible."
                required
                rows="6"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-blue-400/40 transition resize-none"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">App Experience Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      star <= rating ? "text-yellow-400" : "text-slate-600"
                    } hover:text-yellow-300`}
                  >
                    <FaStar />
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-400">({rating}/5)</span>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Attachments <span className="text-slate-400">(Optional)</span></label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition"
                >
                  <FaUpload className="text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {files.length > 0 ? `${files.length} file(s) selected` : "Upload screenshots or videos"}
                  </span>
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2">Images and videos help us understand the issue better</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg font-medium transition"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportAppBug;
