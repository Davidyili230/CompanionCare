import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import { AuthProvider, useAuth } from "./context/AuthContext"; // Added useAuth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function Dashboard() {
  const { user } = useAuth(); // Changed from AuthProvider() to useAuth()
  return (
    <div>
      <h1>Protected Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. Added root route to prevent blank page */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
