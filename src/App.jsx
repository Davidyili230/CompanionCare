import { Routes, Route, Outlet } from "react-router-dom";
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
import MyPet from "./pages/MyPet/MyPet";

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-pet" element={<MyPet />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/missing" element={<Missing />} />
        <Route path="/history" element={
          <>
            <SupplementForm />
            <HistoryTable />
          </>
        } />
      </Route>
    </Routes>
  );
}