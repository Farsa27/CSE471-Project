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
      </div>
    </div>
  );
};

export default ReportChoice;
