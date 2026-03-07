import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MyPetPage from "./pages/MyPetPage";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/my-pet" replace />} />
        <Route
          path="/dashboard"
          element={<PlaceholderPage title="Dashboard" />}
        />
        <Route path="/my-pet" element={<MyPetPage />} />
        <Route
          path="/history"
          element={<PlaceholderPage title="History" />}
        />
        <Route
          path="/community"
          element={<PlaceholderPage title="Community" />}
        />
        <Route
          path="/profile"
          element={<PlaceholderPage title="Profile" />}
        />
      </Routes>
    </BrowserRouter>
  );
}