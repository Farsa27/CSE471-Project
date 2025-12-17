import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import ReportChoice from "./components/ReportChoice";
import ReportAppBug from "./components/ReportAppBug";
import ReportStationHazard from "./components/ReportStationHazard";
import MyAppBugReports from "./components/MyAppBugReports";
import MyStationHazardReports from "./components/MyStationHazardReports";
import QRTicket from "./components/QRTicket";
import StationMap from "./components/StationMap";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminBookings from "./components/AdminBookings";
import AddTrainSchedule from "./components/AddTrainSchedule";
import EditTrainSchedule from "./components/EditTrainSchedule";
import TrainScheduleList from "./components/TrainScheduleList";
import Layout from "./components/Layout";
import StaffManagement from "./components/StaffManagement"; // ✅ FIX: import StaffManagement
import PaymentCheckout from "./components/PaymentCheckout";
import BookedTickets from "./components/BookedTickets";
import AdminReports from "./components/AdminReports";

function PrivateRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin-login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> {/* Essential duplicate */}
        <Route path="/home" element={<Home />} />
        <Route path="/qr-ticket" element={<QRTicket />} />
        <Route path="/station-map" element={<StationMap />} />
        <Route path="/report-choice" element={<ReportChoice />} />
        <Route path="/report/app-bug" element={<ReportAppBug />} />
        <Route path="/report/station-hazard" element={<ReportStationHazard />} />
        <Route path="/my-app-bug-reports" element={<MyAppBugReports />} />
        <Route path="/my-station-hazard-reports" element={<MyStationHazardReports />} />
        <Route path="/Layout" element={<Layout />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-bookings"
          element={
            <PrivateRoute>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-schedule"
          element={
            <PrivateRoute>
              <AddTrainSchedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-schedule/:id"
          element={
            <PrivateRoute>
              <EditTrainSchedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-staff"
          element={
            <PrivateRoute>
              <StaffManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff-management"
          element={
            <PrivateRoute>
              <StaffManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-reports"
          element={
            <PrivateRoute>
              <AdminReports />
            </PrivateRoute>
          }
        />

        <Route path="/train-schedules" element={<TrainScheduleList />} />
        <Route path="/payment-checkout" element={<PaymentCheckout />} />
        <Route path="/booked-tickets" element={<BookedTickets />} />
      </Routes>
    </Router>
  );
}
