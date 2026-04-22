import { useState } from "react";
import { db } from "./firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

function SupplementForm() {
  const [formData, setFormData] = useState({
    pet: "",
    supplement: "",
    dosage: "",
    scheduled: "",
    status: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pet || !formData.supplement || !formData.dosage || !formData.scheduled || !formData.status) {
      alert("Please fill in all fields before submitting!");
      return;
    }

    try {
      await addDoc(collection(db, "supplementHistory"), {
        ...formData,
        dateTime: new Date().toLocaleString(),
      });
      setSuccess(true);
      setFormData({ pet: "", supplement: "", dosage: "", scheduled: "", status: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 px-6" style={{ backgroundColor: "#f5f0e8" }}>
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#5a3e2b" }}>Log a Supplement</h2>

        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#d4edda", color: "#155724" }}>
            Supplement logged successfully!
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            name="pet"
            placeholder="Pet Name"
            value={formData.pet}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
          />
          <input
            name="supplement"
            placeholder="Supplement"
            value={formData.supplement}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
          />
          <input
            name="dosage"
            placeholder="Dosage (e.g. 100mg)"
            value={formData.dosage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
          />
          <input
            name="scheduled"
            placeholder="Scheduled (e.g. Daily)"
            value={formData.scheduled}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">Select Status</option>
            <option value="Given">Given</option>
            <option value="Missed">Missed</option>
          </select>
          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-lg text-white font-semibold transition"
            style={{ backgroundColor: "#c1622f" }}
          >
            Log Supplement
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplementForm;