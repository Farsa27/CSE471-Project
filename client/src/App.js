
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import TrainScheduleList from "./components/TrainScheduleList";
import BookedTickets from "./components/BookedTickets";
import PaymentCheckout from "./components/PaymentCheckout";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AddTrainSchedule from "./components/AddTrainSchedule";
import EditTrainSchedule from "./components/EditTrainSchedule";
import AdminBookings from "./components/AdminBookings";
import StaffManagement from "./components/StaffManagement";
import AdminReports from "./components/AdminReports";
import LostItemForm from "./components/lostItemForm";
import LostAndFoundGallery from "./components/LostAndFoundGallery";
import NotificationPanel from "./components/NotificationPanel";
import Feedback from "./components/Feedback";
import StudentVerification from "./components/StudentVerification";
import VerifyStudents from "./components/VerifyStudents";
import WifiSubscription from "./components/WifiSubscription";
import WifiPayment from "./components/WifiPayment";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> {/* ← This line is essential */}
        <Route path="/home" element={<Home />} />
        <Route path="/qr-ticket" element={<QRTicket />} />
        <Route path="/station-map" element={<StationMap />} />
        <Route path="/train-schedules" element={<TrainScheduleList />} />
        <Route path="/booked-tickets" element={<BookedTickets />} />
        <Route path="/payment-checkout" element={<PaymentCheckout />} />
        <Route path="/report-choice" element={<ReportChoice />} />
        <Route path="/report/app-bug" element={<ReportAppBug />} />
        <Route path="/report/station-hazard" element={<ReportStationHazard />} />
        <Route path="/my-app-bug-reports" element={<MyAppBugReports />} />
        <Route path="/my-station-hazard-reports" element={<MyStationHazardReports />} />
        <Route path="/lost-items-form" element={<LostItemForm />} />
        <Route path="/lost-items-gallery" element={<LostAndFoundGallery />} />
        <Route path="/notifications" element={<NotificationPanel />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/student-verification" element={<StudentVerification />} />
        <Route path="/wifi-subscription" element={<WifiSubscription />} />
        <Route path="/wifi-payment" element={<WifiPayment />} />
        
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-schedule" element={<AddTrainSchedule />} />
        <Route path="/edit-schedule/:id" element={<EditTrainSchedule />} />
        <Route path="/admin-bookings" element={<AdminBookings />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/admin-reports" element={<AdminReports />} />
        <Route path="/verify-students" element={<VerifyStudents />} />
      </Routes>
    </Router>
  );
}

export default App;
