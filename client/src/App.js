
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import ReportChoice from "./components/ReportChoice";
import ReportAppBug from "./components/ReportAppBug";
import ReportStationHazard from "./components/ReportStationHazard";
import MyAppBugReports from "./components/MyAppBugReports";
import MyStationHazardReports from "./components/MyStationHazardReports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> {/* ← This line is essential */}
        <Route path="/home" element={<Home />} />
        <Route path="/report-choice" element={<ReportChoice />} />
        <Route path="/report/app-bug" element={<ReportAppBug />} />
        <Route path="/report/station-hazard" element={<ReportStationHazard />} />
        <Route path="/my-app-bug-reports" element={<MyAppBugReports />} />
        <Route path="/my-station-hazard-reports" element={<MyStationHazardReports />} />
      </Routes>
    </Router>
  );
}

export default App;
