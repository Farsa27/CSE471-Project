import { useNavigate } from "react-router-dom";

const ReportChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Report</h2>
        <p className="mb-6 text-gray-600">Choose report type:</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/report/app-bug")}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Report App Bug
          </button>

          <button
            onClick={() => navigate("/report/station-hazard")}
            className="w-full bg-yellow-600 text-white py-2 rounded"
          >
            Report Station Hazard
          </button>
        </div>

        <div className="border-t pt-6 mt-6">
          <p className="mb-4 text-gray-600 text-sm">View your reports:</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/my-app-bug-reports")}
              className="w-full bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200"
            >
              My App Bug Reports
            </button>

            <button
              onClick={() => navigate("/my-station-hazard-reports")}
              className="w-full bg-yellow-100 text-yellow-700 py-2 rounded hover:bg-yellow-200"
            >
              My Station Hazard Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportChoice;
