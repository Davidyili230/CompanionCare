import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

function HistoryTable() {
  const [entries, setEntries] = useState([]);
  const [filterPet, setFilterPet] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "supplements"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });
    return () => unsubscribe();
  }, []);

  const filtered = entries.filter((entry) => {
    const matchPet = filterPet === "" || entry.pet.toLowerCase().includes(filterPet.toLowerCase());
    const matchStatus = filterStatus === "" || entry.status === filterStatus;
    const entryDate = new Date(entry.dateTime);
    const matchFrom = filterDateFrom === "" || entryDate >= new Date(filterDateFrom);
    const matchTo = filterDateTo === "" || entryDate <= new Date(filterDateTo);
    return matchPet && matchStatus && matchFrom && matchTo;
  });

  const exportCSV = () => {
    const headers = ["Date & Time", "Pet", "Supplement", "Dosage", "Scheduled", "Status"];
    const rows = filtered.map((e) => [e.dateTime, e.pet, e.supplement, e.dosage, e.scheduled, e.status]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supplement_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Intake History</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
        <input
          placeholder="Filter by pet"
          value={filterPet}
          onChange={(e) => setFilterPet(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Given">Given</option>
          <option value="Missed">Missed</option>
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
        />
        <button onClick={() => { setFilterPet(""); setFilterStatus(""); setFilterDateFrom(""); setFilterDateTo(""); }}>
          Clear Filters
        </button>
      </div>

      {/* Export Button */}
      <button onClick={exportCSV} style={{ marginBottom: "15px" }}>
        Export CSV
      </button>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>Date & Time</th>
            <th style={thStyle}>Pet</th>
            <th style={thStyle}>Supplement</th>
            <th style={thStyle}>Dosage</th>
            <th style={thStyle}>Scheduled</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((entry) => (
            <tr key={entry.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{entry.dateTime}</td>
              <td style={tdStyle}>{entry.pet}</td>
              <td style={tdStyle}>{entry.supplement}</td>
              <td style={tdStyle}>{entry.dosage}</td>
              <td style={tdStyle}>{entry.scheduled}</td>
              <td style={tdStyle}>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: "10px", textAlign: "left", borderBottom: "2px solid #ccc" };
const tdStyle = { padding: "10px" };

export default HistoryTable;