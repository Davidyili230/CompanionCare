import { useEffect, useState } from "react";
import { db } from "./firebase/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

const ENTRIES_PER_PAGE = 10;

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  if (isNaN(date)) return dateTimeStr;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function HistoryTable() {
  const [entries, setEntries] = useState([]);
  const [filterPet, setFilterPet] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [tableError, setTableError] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "supplementHistory"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setEntries(data);
        setTableError("");
      },
      (error) => {
        console.error("Error fetching data: ", error);
        setTableError("Failed to load supplement history. Please refresh the page.");
      }
    );
    return () => unsubscribe();
  }, []);

  const filtered = entries.filter((entry) => {
    const matchPet = filterPet === "" || entry.pet.toLowerCase().includes(filterPet.toLowerCase());
    const matchStatus = filterStatus === "" || entry.status === filterStatus;
    const entryDate = new Date(entry.dateTime);
    const matchFrom = filterDateFrom === "" || entryDate >= new Date(filterDateFrom);
    const matchTo = filterDateTo === "" || entryDate <= new Date(filterDateTo);
    const matchSearch = searchQuery === "" || [
      entry.pet, entry.supplement, entry.dosage, entry.scheduled, entry.status, entry.dateTime
    ].some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchPet && matchStatus && matchFrom && matchTo && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ENTRIES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ENTRIES_PER_PAGE,
    currentPage * ENTRIES_PER_PAGE
  );

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    setDeleteError("");
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteDoc(doc(db, "supplementHistory", id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        setDeleteError("Failed to delete entry. Please try again.");
      }
    }
  };

  const handleEditClick = (entry) => {
    setEditingId(entry.id);
    setEditData({ ...entry });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditError("");
    try {
      await updateDoc(doc(db, "supplementHistory", editingId), {
        pet: editData.pet,
        supplement: editData.supplement,
        dosage: editData.dosage,
        scheduled: editData.scheduled,
        status: editData.status,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating document: ", error);
      setEditError("Failed to save changes. Please try again.");
    }
  };

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
    <div className="p-4 md:p-6 pt-2" style={{ backgroundColor: "#f5f0e8" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#5a3e2b" }}>Intake History</h2>

      {tableError && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#f8d7da", color: "#721c24" }}>
          {tableError}
        </div>
      )}

      {deleteError && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#f8d7da", color: "#721c24" }}>
          {deleteError}
        </div>
      )}

      {editError && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#f8d7da", color: "#721c24" }}>
          {editError}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none bg-white"
          placeholder="Search by pet, supplement, dosage, status..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl p-5 shadow-sm md:w-48 flex-shrink-0 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#5a3e2b" }}>Filter by pets</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Pet name"
              value={filterPet}
              onChange={handleFilterChange(setFilterPet)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#5a3e2b" }}>Date Range</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none mb-2"
              value={filterDateFrom}
              onChange={handleFilterChange(setFilterDateFrom)}
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={filterDateTo}
              onChange={handleFilterChange(setFilterDateTo)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#5a3e2b" }}>Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={filterStatus}
              onChange={handleFilterChange(setFilterStatus)}
            >
              <option value="">All</option>
              <option value="Given">Given</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
          <button
            onClick={() => { setFilterPet(""); setFilterStatus(""); setFilterDateFrom(""); setFilterDateTo(""); setSearchQuery(""); setCurrentPage(1); }}
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
        <div className="bg-white rounded-xl shadow-sm flex-1 overflow-x-auto flex flex-col">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ backgroundColor: "#f5f0e8" }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Date & Time</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Pet</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Supplement</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Dosage</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Scheduled</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Status</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "#5a3e2b" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16">
                    <p className="text-gray-400 text-base font-semibold mb-1">No supplements logged yet</p>
                    <p className="text-gray-300 text-sm">Use the form above to log your first supplement!</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">No entries match your search or filters</td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 hover:bg-orange-50 transition">
                    {editingId === entry.id ? (
                      <>
                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDateTime(entry.dateTime)}</td>
                        <td className="px-4 py-2">
                          <input name="pet" value={editData.pet} onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                        </td>
                        <td className="px-4 py-2">
                          <input name="supplement" value={editData.supplement} onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                        </td>
                        <td className="px-4 py-2">
                          <input name="dosage" value={editData.dosage} onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                        </td>
                        <td className="px-4 py-2">
                          <input name="scheduled" value={editData.scheduled} onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                        </td>
                        <td className="px-4 py-2">
                          <select name="status" value={editData.status} onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                            <option value="Given">Given</option>
                            <option value="Missed">Missed</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <button onClick={handleEditSave}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                              style={{ backgroundColor: "#155724" }}>
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                              style={{ backgroundColor: "#6c757d" }}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-gray-700">{formatDateTime(entry.dateTime)}</td>
                        <td className="px-4 py-3 text-gray-700">{entry.pet}</td>
                        <td className="px-4 py-3 text-gray-700">{entry.supplement}</td>
                        <td className="px-4 py-3 text-gray-700">{entry.dosage}</td>
                        <td className="px-4 py-3 text-gray-700">{entry.scheduled}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: entry.status === "Given" ? "#d4edda" : "#f8d7da",
                              color: entry.status === "Given" ? "#155724" : "#721c24"
                            }}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                            <button onClick={() => handleEditClick(entry)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                              style={{ backgroundColor: "#5a3e2b" }}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(entry.id)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                              style={{ backgroundColor: "#c1622f" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg text-sm font-semibold disabled:opacity-40"
                style={{ color: "#c1622f" }}
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">
                {currentPage} ... {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg text-sm font-semibold disabled:opacity-40"
                style={{ color: "#c1622f" }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryTable;