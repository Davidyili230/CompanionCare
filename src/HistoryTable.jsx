import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

function HistoryTable() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "supplements"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Intake History</h2>
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
          {entries.map((entry) => (
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