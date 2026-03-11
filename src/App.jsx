import { Routes, Route } from "react-router-dom";
import Community from "./pages/Community/Community";
import HistoryTable from "./HistoryTable";
import SupplementForm from "./SupplementForm";

export default function App() {
  return (
    <Routes>
      {/* <Route path ="/" element={<Dashboard />} /> */}
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