import { Routes, Route } from "react-router-dom";
import Community from "./pages/Community/Community";
import HistoryTable from "./HistoryTable";
import SupplementForm from "./SupplementForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar/Navbar";
import Adopt from "./pages/Adopt/Adopt";
import Missing from "./pages/Missing/Missing";

export default function App() {
  return (
    <Routes>
      {/* <Route path ="/" element={<Dashboard />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/community" element={<Community />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
      <Route path="/adopt" element={<Adopt />} />
      <Route path="/missing" element={<Missing />} />
      <Route path="/history" element={
        <div style={{ minHeight: "100vh", background: "#FFF9F0", boxSizing: "border-box" }}>
          <Navbar />
          <SupplementForm />
          <HistoryTable />
        </div>
      } />
    </Routes>
  );
}