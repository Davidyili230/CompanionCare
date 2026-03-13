import { Routes, Route } from "react-router-dom";
import Community from "./pages/Community/Community";
import HistoryTable from "./HistoryTable";
import SupplementForm from "./SupplementForm";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      {/* <Route path ="/" element={<Dashboard />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/community" element={<Community />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
      <Route path="/history" element={
        <div>
          <SupplementForm />
          <HistoryTable />
        </div>
      } />
    </Routes>
  );
}