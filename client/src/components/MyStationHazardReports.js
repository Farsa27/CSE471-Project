import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft, FaPlus, FaMapMarkerAlt, FaPaperclip, FaClock } from "react-icons/fa";

const MyStationHazardReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Please login");
        navigate("/");
        return;
      }

      const user = JSON.parse(userStr);
      if (!user._id) {
        alert("Please login");
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`https://cse471-project-production.up.railway.app/api/reports/station-hazard/${user._id}`);
        const data = await res.json();
        if (res.ok) {
          setReports(data.reports);
        } else {
          alert(data.message || "Failed to fetch reports");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/report-choice")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 grid place-items-center">
                <FaExclamationTriangle />
              </div>
              <h1 className="text-2xl font-bold">My Station Hazard Reports</h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/report/station-hazard")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition"
          >
            <FaPlus />
            <span className="hidden sm:inline">New Report</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 grid place-items-center">
              <FaExclamationTriangle className="text-amber-400" size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Hazard Reports Yet</h2>
            <p className="text-slate-400 mb-6">You haven't reported any station hazards. Help us maintain safety!</p>
            <button
              onClick={() => navigate("/report/station-hazard")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition"
            >
              <FaPlus />
              <span>Submit First Report</span>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-400">Total reports: <span className="text-slate-100 font-semibold">{reports.length}</span></p>
            </div>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 grid place-items-center">
                          <FaMapMarkerAlt size={14} />
                        </div>
                        <h2 className="text-xl font-bold">{report.stationLocation}</h2>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <FaClock size={12} />
                        <span>{new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="text-sm font-semibold text-amber-100">Safety Issue</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 mb-4 leading-relaxed">{report.description}</p>

                  {/* Attachments */}
                  {report.media && report.media.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-400">
                        <FaPaperclip size={12} />
                        <span>Evidence ({report.media.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {report.media.map((file, idx) => (
                          <a
                            key={idx}
                            href={`https://cse471-project-production.up.railway.app${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
                          >
                            <FaPaperclip className="text-amber-400" size={12} />
                            <span className="truncate">File {idx + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-slate-500 font-mono">ID: {report._id}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyStationHazardReports;
