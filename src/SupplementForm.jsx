import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function SupplementForm() {
  const [formData, setFormData] = useState({
    pet: "",
    supplement: "",
    dosage: "",
    scheduled: "",
    status: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "supplements"), {
        ...formData,
        dateTime: new Date().toLocaleString(),
      });
      alert("Supplement logged!");
      setFormData({ pet: "", supplement: "", dosage: "", scheduled: "", status: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Log a Supplement</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="pet" placeholder="Pet Name" value={formData.pet} onChange={handleChange} />
        <input name="supplement" placeholder="Supplement" value={formData.supplement} onChange={handleChange} />
        <input name="dosage" placeholder="Dosage (e.g. 100mg)" value={formData.dosage} onChange={handleChange} />
        <input name="scheduled" placeholder="Scheduled (e.g. Daily)" value={formData.scheduled} onChange={handleChange} />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="Given">Given</option>
          <option value="Missed">Missed</option>
        </select>
        <button onClick={handleSubmit}>Log Supplement</button>
      </div>
    </div>
  );
}

export default SupplementForm;