import { useEffect, useState } from "react";

const supplementUnitOptions = ["mg", "g", "IU"];
const frequencyOptions = ["daily", "twice daily", "weekly", "monthly", "as needed"];

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
  onAddSupplement,
  embedded = false,
}) {
  const [form, setForm] = useState(createInitialForm(selectedPet));
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      selectedPetId: selectedPet?.id ?? "",
      selectedPetName: selectedPet?.name ?? "",
    }));
  }, [selectedPet]);

  function handleChange(e) {
    const { name, value } = e.target;
    setError("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

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

    onAddSupplement?.(payload);

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

  const inputClass =
    "w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10";

  const content = (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-bold text-[#1f1f1f]">
          Add supplement to pet
        </h3>
        <p className="mt-2 text-[#2b2b2b]">
          {!selectedPet
            ? "No pet selected yet. Add a pet first, then choose it to create a supplement plan."
            : `Create a supplement plan for ${selectedPet.name}.`}
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#f1c9b8] bg-[#fff7f2] px-3 py-2 text-sm text-[#b23b2a]">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-3 gap-y-3">
        {/* Select Pet */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Select Pet</label>
          <input
            name="selectedPetName"
            value={form.selectedPetName}
            onChange={handleChange}
            readOnly={!!selectedPet}
            placeholder="e.g. Max - Golden Retriever"
            className={inputClass}
          />
        </div>

        {/* Supplement name */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">
            Supplement name
          </label>
          <input
            name="supplementName"
            value={form.supplementName}
            onChange={handleChange}
            placeholder="e.g. Omega-3 Fish Oil"
            className={inputClass}
          />
        </div>

        {/* Dosage */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Dosage</label>
          <input
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            placeholder="e.g. 1000"
            className={inputClass}
          />
        </div>

        {/* Unit */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className={inputClass}
          >
            {supplementUnitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Frequency</label>
          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select frequency</option>
            {frequencyOptions.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </select>
        </div>

        {/* Time of day */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Time of day</label>
          <input
            name="timeOfDay"
            value={form.timeOfDay}
            onChange={handleChange}
            placeholder="e.g. 8:00 AM"
            className={inputClass}
          />
        </div>

        {/* Start Date */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Start Date</label>
          <input
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            placeholder="e.g. Today, or choose a date"
            className={inputClass}
          />
        </div>

        {/* Notes */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. Give with food, supports joint health..."
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!selectedPet}
          className={[
            "col-span-2 justify-self-center rounded-full px-6 py-2 font-semibold transition",
            selectedPet
              ? "bg-[#d87c5a] text-white hover:opacity-95"
              : "cursor-not-allowed bg-[#efc4b1] text-[#7f7770]",
          ].join(" ")}
        >
          + Add this supplement
        </button>
      </form>
    </div>
  );

  if (embedded) return content;

  return (
    <section className="rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm">
      {content}
    </section>
  );
}