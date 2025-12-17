import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import Rooms from "./pages/Rooms";

// Komponen untuk memproteksi rute (hanya yang punya token bisa akses)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Nested Routes inside Dashboard */}
          <Route
            index
            element={<div className="text-2xl">Welcome to Dashboard</div>}
          />
          <Route path="rooms" element={<Rooms />} />
          {/* Tambahkan rute Users, Settings, dll di sini */}
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
