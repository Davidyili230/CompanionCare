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
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setFormData({ pet: "", supplement: "", dosage: "", scheduled: "", status: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1.5px solid #F0E8DF",
    background: "#fff",
    fontSize: 14,
    color: "#2C1810",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #F0E8DF",
            padding: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: 18,
              fontWeight: 700,
              color: "#2C1810",
            }}
          >
            Log a Supplement
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <input
                name="pet"
                placeholder="Pet Name"
                value={formData.pet}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="supplement"
                placeholder="Supplement"
                value={formData.supplement}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="dosage"
                placeholder="Dosage (e.g. 100mg)"
                value={formData.dosage}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="scheduled"
                placeholder="Scheduled (e.g. Daily)"
                value={formData.scheduled}
                onChange={handleChange}
                style={inputStyle}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ ...inputStyle, color: formData.status ? "#2C1810" : "#9A8A7A" }}
              >
                <option value="">Select Status</option>
                <option value="Given">Given</option>
                <option value="Missed">Missed</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="submit"
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #E8854A, #D4631A)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(212,99,26,0.28)",
                }}
              >
                Log Supplement
              </button>

              {success && (
                <span style={{ fontSize: 13, color: "#D4631A", fontWeight: 600 }}>
                  ✓ Supplement logged!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SupplementForm;
