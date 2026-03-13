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

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1.5px solid #F0E8DF",
    background: "#fff",
    fontSize: 13,
    color: "#2C1810",
    outline: "none",
  };

  return (
    <div style={{ padding: "20px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            marginTop: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#2C1810" }}>
            Intake History
            <span
              style={{
                marginLeft: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#D4631A",
                background: "#FFF0E6",
                borderRadius: 999,
                padding: "2px 10px",
              }}
            >
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </h2>

          <button
            onClick={exportCSV}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "1.5px solid #F0E8DF",
              background: "#fff",
              color: "#D4631A",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #F0E8DF",
            padding: "16px 20px",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <input
            placeholder="Filter by pet"
            value={filterPet}
            onChange={(e) => setFilterPet(e.target.value)}
            style={inputStyle}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Statuses</option>
            <option value="Given">Given</option>
            <option value="Missed">Missed</option>
          </select>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={() => {
              setFilterPet("");
              setFilterStatus("");
              setFilterDateFrom("");
              setFilterDateTo("");
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1.5px solid #F0E8DF",
              background: "transparent",
              color: "#9A8A7A",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #F0E8DF",
            overflow: "hidden",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#B0A090",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>No records found</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FFF9F0" }}>
                  {["Date & Time", "Pet", "Supplement", "Dosage", "Scheduled", "Status"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#B0A090",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          borderBottom: "1.5px solid #F0E8DF",
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #F0E8DF" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFAF6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={tdStyle}>{entry.dateTime}</td>
                    <td style={tdStyle}>{entry.pet}</td>
                    <td style={tdStyle}>{entry.supplement}</td>
                    <td style={tdStyle}>{entry.dosage}</td>
                    <td style={tdStyle}>{entry.scheduled}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: entry.status === "Given" ? "#E6F4EA" : "#FFF0E6",
                          color: entry.status === "Given" ? "#2E7D32" : "#D4631A",
                        }}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const tdStyle = { padding: "12px 16px", fontSize: 14, color: "#2C1810" };

export default HistoryTable;
