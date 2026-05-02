

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Community from "./pages/Community/Community";
import HistoryTable from "./HistoryTable";
import SupplementForm from "./SupplementForm";
import Login from "./pages/Profile/Login";
import Register from "./pages/Profile/Register";
import Navbar from "./components/Navbar/Navbar";
import Adopt from "./pages/Adopt/Adopt";
import Missing from "./pages/Missing/Missing";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyPet from "./pages/MyPet/MyPetPage";
import ProtectedRoute from "./components/ProtectedRoute";


import LostPet from "./LostPet/LostPet"
import AdoptPet from "./AdoptPet/AdoptPet"
import AdoptionForm from "./AdoptPet/adoptionForm";

import LostPetReport from "./LostPet/Report"


function Layout() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFF9F0", boxSizing: "border-box" }}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-pet" element={<ProtectedRoute><MyPet /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/adopt" element={<ProtectedRoute><Adopt /></ProtectedRoute>} />
        <Route path="/missing" element={<ProtectedRoute><Missing /></ProtectedRoute>} />
        <Route path="/AdoptPet" element={<AdoptPet/>} />
        <Route path="/AdoptionForm" element={<AdoptionForm/> } />
        <Route path="/LostPet" element={<LostPet/>} /> 
        <Route path="/LostPetReport" element={<LostPetReport/>} />

        <Route path="/history" element={
          <ProtectedRoute>
            <>
              <SupplementForm />
              <HistoryTable />
            </>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}