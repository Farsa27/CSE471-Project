import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyAppBugReports = () => {
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
        const res = await fetch(`http://localhost:5000/api/reports/app-bug/${user._id}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My App Bug Reports</h1>

        <button
          onClick={() => navigate("/report-choice")}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit New Report
        </button>

        {reports.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-600">No reports yet. Submit your first bug report!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="bg-white p-6 rounded shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{report.subject || "Untitled"}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()} at{" "}
                      {new Date(report.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {report.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="font-semibold">{report.rating}/5</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{report.description}</p>

                {report.media && report.media.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Attachments:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {report.media.map((file, idx) => (
                        <a
                          key={idx}
                          href={`http://localhost:5000${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm truncate"
                        >
                          📎 File {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Report ID: {report._id}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/home")}
          className="mt-6 px-4 py-2 border rounded hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default MyAppBugReports;
