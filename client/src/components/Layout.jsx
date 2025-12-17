// frontend/src/Layout.jsx
import { NavLink } from "react-router-dom";
import "./Layout.css";
import TrainScheduleList from "./TrainScheduleList"; // adjust path if needed

export default function Layout() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div className="layout-container">
      
      <nav className="navbar">
        <h1 className="navbar-title">Mass Transit Control</h1>

        
        {isAdmin && (
          <div className="admin-nav">
            <NavLink to="/" className="nav-link">Home</NavLink>
            
            <NavLink to="/train-schedules" className="nav-link orange">Train Schedules</NavLink>
            <NavLink to="/admin-bookings" className="nav-link green">Manage Bookings</NavLink>
            <NavLink to="/staff-management" className="nav-link purple">Staff Management</NavLink>
          </div>
        )}
      </nav>

      
      <main className="main-content">
        <TrainScheduleList />
      </main>
    </div>
  );
}
