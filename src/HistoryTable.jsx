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
    const unsubscribe = onSnapshot(collection(db, "supplementHistory"), (snapshot) => {
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
    <div className="min-h-screen p-6" style={{ backgroundColor: "#f5f0e8" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#5a3e2b" }}>Intake History</h2>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl p-5 shadow-sm w-48 flex-shrink-0 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#5a3e2b" }}>Filter by pets</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: "#c1622f" }}
              placeholder="Pet name"
              value={filterPet}
              onChange={(e) => setFilterPet(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#5a3e2b" }}>Date Range</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none mb-2"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#5a3e2b" }}>Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Given">Given</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
          <button
            onClick={() => { setFilterPet(""); setFilterStatus(""); setFilterDateFrom(""); setFilterDateTo(""); }}
            className="w-full border-2 rounded-lg py-2 text-sm font-semibold transition"
            style={{ borderColor: "#c1622f", color: "#c1622f" }}
          >
            Clear Filters
          </button>
          <button
            onClick={exportCSV}
            className="w-full rounded-lg py-2 text-sm font-semibold text-white transition"
            style={{ backgroundColor: "#c1622f" }}
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm flex-1 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f5f0e8" }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Date & Time</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Pet</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Supplement</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Dosage</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Scheduled</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">No entries found</td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 hover:bg-orange-50 transition">
                    <td className="px-4 py-3 text-gray-700">{entry.dateTime}</td>
                    <td className="px-4 py-3 text-gray-700">{entry.pet}</td>
                    <td className="px-4 py-3 text-gray-700">{entry.supplement}</td>
                    <td className="px-4 py-3 text-gray-700">{entry.dosage}</td>
                    <td className="px-4 py-3 text-gray-700">{entry.scheduled}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: entry.status === "Given" ? "#d4edda" : "#f8d7da",
                          color: entry.status === "Given" ? "#155724" : "#721c24"
                        }}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryTable;
