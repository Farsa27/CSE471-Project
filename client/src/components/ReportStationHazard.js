import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft, FaPaperPlane, FaMapMarkerAlt, FaUpload } from "react-icons/fa";

const ReportStationHazard = () => {
  const navigate = useNavigate();
  const [stationLocation, setStationLocation] = useState("");
  const [description, setDescription] = useState("");
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
    formData.append("stationLocation", stationLocation);
    formData.append("description", description);
    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }

    try {
      const res = await fetch("http://localhost:5000|https://cse471-project-backend-51jt.onrender.com/api/reports/station-hazard", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Hazard report submitted successfully!");
        navigate("/my-station-hazard-reports");
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
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 grid place-items-center">
              <FaExclamationTriangle />
            </div>
            <h1 className="text-2xl font-bold">Report Station Hazard</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Alert Banner */}
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-100 mb-1">Report Safety Concerns</h3>
              <p className="text-sm text-amber-200/80">Help us maintain safe stations by reporting hazards, damages, or safety issues immediately.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Hazard Details</h2>
            <p className="text-slate-300 text-sm">Provide accurate information to help us respond quickly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station Location */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-amber-400" />
                  <span>Station Location <span className="text-red-400">*</span></span>
                </div>
              </label>
              <input
                value={stationLocation}
                onChange={(e) => setStationLocation(e.target.value)}
                placeholder="e.g., Central Station, Platform 3"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-amber-400/40 transition"
              />
              <p className="text-xs text-slate-400 mt-2">Be as specific as possible about the location</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Hazard Description <span className="text-red-400">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hazard: What is it? Where exactly is it located? How severe is it?"
                required
                rows="6"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-amber-400/40 transition resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">Include severity level and any immediate risks</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Evidence <span className="text-slate-400">(Highly Recommended)</span></label>
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
                    {files.length > 0 ? `${files.length} file(s) selected` : "Upload photos or videos of the hazard"}
                  </span>
                </label>
              </div>
              <p className="text-xs text-amber-300 mt-2">Visual evidence helps our team assess and prioritize the issue</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 rounded-lg font-medium transition"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Hazard Report</span>
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

export default ReportStationHazard;

