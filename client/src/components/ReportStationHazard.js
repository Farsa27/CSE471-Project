import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportStationHazard = () => {
  const navigate = useNavigate();
  const [stationLocation, setStationLocation] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    if (!userStr) return alert("Please login to report");
    
    const user = JSON.parse(userStr);
    if (!user._id) return alert("Please login to report");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("stationLocation", stationLocation);
    formData.append("description", description);
    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports/station-hazard", {
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
        <h2 className="text-xl font-bold mb-4">Report Station Hazard</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={stationLocation}
            onChange={(e) => setStationLocation(e.target.value)}
            placeholder="Station location (e.g., Central Station)"
            required
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of hazard"
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

          <div className="flex gap-2">
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Submit</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportStationHazard;
