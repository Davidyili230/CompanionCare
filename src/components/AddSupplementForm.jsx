import { useEffect, useState } from "react";

function createInitialForm(selectedPet) {
  return {
    selectedPetId: selectedPet?.id ?? "",
    selectedPetName: selectedPet?.name ?? "",
    supplementName: "",
    dosage: "",
    unit: "mg",
    frequency: "",
    timeOfDay: "",
    startDate: "",
    notes: "",
  };
}

export default function AddSupplementForm({
  selectedPet = null,
  selectedPetName,
  onAddSupplement,
}) {
  const [form, setForm] = useState(createInitialForm(selectedPet));
  const [error, setError] = useState("");

// When switching pet cards, update the pet information in the form synchronously (do not clear other entered content).
  useEffect(() => {
    if (selectedPet) {
      setForm((prev) => ({
        ...prev,
        selectedPetId: selectedPet.id ?? "",
        selectedPetName: selectedPet.name ?? "",
      }));
    } else if (selectedPetName) {
      setForm((prev) => ({
        ...prev,
        selectedPetId: prev.selectedPetId || "",
        selectedPetName,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        selectedPetId: "",
        selectedPetName: "",
      }));
    }
  }, [selectedPet, selectedPetName]);

  function handleChange(e) {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.selectedPetName.trim()) {
      setError("Please select a pet first.");
      return;
    }

    if (!form.supplementName.trim()) {
      setError("Please enter a supplement name.");
      return;
    }

    if (form.dosage && Number.isNaN(Number(form.dosage))) {
      setError("Dosage must be a number.");
      return;
    }

    const payload = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      petId: form.selectedPetId || null,
      petName: form.selectedPetName.trim(),
      supplementName: form.supplementName.trim(),
      dosage: form.dosage === "" ? null : Number(form.dosage),
      unit: form.unit.trim() || "mg",
      frequency: form.frequency.trim(),
      timeOfDay: form.timeOfDay.trim(),
      startDate: form.startDate.trim(),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    };

// First, execute the parent component's callback (if any).
    if (onAddSupplement) {
      onAddSupplement(payload);
    } else {
// Local demo without logical parent callback: just print the payload and show an alert (no pop-up window will appear).
      console.log("Add Supplement (mock):", payload);
      alert("Mockup: Supplement added (frontend only).");
    }

// Keep pet information after submission, clear everything else.
    setForm((prev) => ({
      ...prev,
      supplementName: "",
      dosage: "",
      unit: "mg",
      frequency: "",
      timeOfDay: "",
      startDate: "",
      notes: "",
    }));
  }

  const displayPetName =
    selectedPet?.name || selectedPetName || form.selectedPetName || "";

  const isNoPetSelected = !displayPetName;

  return (
    <div className="supplement-form-wrap">
      <h3>Add supplement to pet</h3>

      {isNoPetSelected && (
        <div className="empty-panel-message" style={{ marginBottom: 12 }}>
          No pet selected yet. Add a pet first, then choose it to create a
          supplement plan.
        </div>
      )}

      {error && (
        <div className="empty-panel-message" style={{ marginBottom: 12, color: "#b23b2a" }}>
          {error}
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>
        {/* Select Pet */}
        <div className="field field-full">
          <label>Select Pet</label>
          <input
            name="selectedPetName"
            value={form.selectedPetName}
            onChange={handleChange}
            placeholder="e.g. Max - Golden Retriever (70lb, 5 years)"
            readOnly={!!selectedPet}
          />
        </div>

        {/* Supplement name */}
        <div className="field field-full">
          <label>Supplement name</label>
          <input
            name="supplementName"
            value={form.supplementName}
            onChange={handleChange}
            placeholder="e.g. Omega-3 Fish Oil"
          />
        </div>

        {/* Dosage + Unit */}
        <div className="field">
          <label>Dosage</label>
          <input
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            placeholder="e.g. 1000"
            inputMode="decimal"
          />
        </div>

        <div className="field">
          <label>Unit</label>
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. mg"
          />
        </div>

        {/* Frequency */}
        <div className="field field-full">
          <label>Frequency</label>
          <input
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            placeholder="e.g. daily, weekly, monthly"
          />
        </div>

        {/* Time of day */}
        <div className="field field-full">
          <label>Time of day</label>
          <input
            name="timeOfDay"
            value={form.timeOfDay}
            onChange={handleChange}
            placeholder="e.g. 8:00 AM"
          />
        </div>

        {/* Start Date */}
        <div className="field field-full">
          <label>Start Date</label>
          <input
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            placeholder="e.g. Today, or choose a date"
          />
        </div>

        {/* Notes */}
        <div className="field field-full">
          <label>Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="e.g. Give with food, supports joint health..."
            rows={2}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isNoPetSelected}
          style={isNoPetSelected ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
        >
          + Add this supplement
        </button>
      </form>
    </div>
  );
}