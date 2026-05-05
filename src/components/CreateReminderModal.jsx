import { useEffect, useState } from "react";
import { saveReminder } from "../services/reminderService";

const CATEGORIES = [
  { value: "walk",       label: "Walk",       icon: "🦮" },
  { value: "vet",        label: "Vet Visit",  icon: "🏥" },
  { value: "grooming",   label: "Grooming",   icon: "✂️" },
  { value: "medication", label: "Medication", icon: "💊" },
  { value: "feeding",    label: "Feeding",    icon: "🍖" },
  { value: "other",      label: "Other",      icon: "📋" },
];

const FREQUENCIES = [
  { value: "once",        label: "Once" },
  { value: "daily",       label: "Daily" },
  { value: "twice daily", label: "Twice Daily" },
  { value: "weekly",      label: "Weekly" },
  { value: "monthly",     label: "Monthly" },
  { value: "as needed",   label: "As Needed" },
];

function createBlankForm() {
  return {
    petId: "",
    petName: "",
    title: "",
    category: "walk",
    frequency: "daily",
    timeOfDay: "",
    notes: "",
  };
}

export default function CreateReminderModal({ pets = [], onClose, onSaved }) {
  const [form, setForm] = useState(createBlankForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "petId") {
        const pet = pets.find((p) => p.id === value);
        next.petName = pet?.name ?? "";
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Reminder title is required.");
      return;
    }
    setSaving(true);
    try {
      await saveReminder(form);
      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save reminder. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const isOnce = form.frequency === "once";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 pb-0 sm:items-center sm:px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[24px] max-h-[90vh]">
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#e0d9d1]" />
        </div>

        <div className="px-6 py-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#1f1f1f]">
              New Reminder
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#8a786c] transition hover:bg-[#f2ece6] hover:text-[#1f1f1f]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Pet selector */}
            {pets.length > 0 && (
              <div>
                <label className="block text-[13px] font-semibold text-[#5a514a]">
                  Pet
                </label>
                <select
                  name="petId"
                  value={form.petId}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-[12px] border border-[#ecdcc8] bg-[#fffaf6] px-3 py-2.5 text-[14px] text-[#1f1f1f] outline-none focus:border-[#de7e52]"
                >
                  <option value="">All pets / General</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[13px] font-semibold text-[#5a514a]">
                Reminder Title{" "}
                <span className="font-normal text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Morning walk, Vet check-up…"
                autoFocus
                className="mt-1.5 w-full rounded-[12px] border border-[#ecdcc8] bg-[#fffaf6] px-3 py-2.5 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#de7e52] focus:ring-2 focus:ring-[#de7e52]/10 placeholder:text-[#b0a49c]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[13px] font-semibold text-[#5a514a]">
                Category
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, category: cat.value }))
                    }
                    className={`flex items-center gap-1.5 rounded-[12px] border px-3 py-2 text-[13px] font-medium transition ${
                      form.category === cat.value
                        ? "border-[#de7e52] bg-[#de7e52] text-white"
                        : "border-[#ecdcc8] bg-[#fffaf6] text-[#5a514a] hover:border-[#de7e52]/60"
                    }`}
                  >
                    <span className="text-[14px]">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-[13px] font-semibold text-[#5a514a]">
                Frequency
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, frequency: f.value }))
                    }
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                      form.frequency === f.value
                        ? "border-[#de7e52] bg-[#de7e52] text-white"
                        : "border-[#ecdcc8] bg-[#fffaf6] text-[#5a514a] hover:border-[#de7e52]/60"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {isOnce && (
                <p className="mt-1.5 text-[11px] text-[#9a8a7e]">
                  This reminder will be removed after you complete it.
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-[13px] font-semibold text-[#5a514a]">
                Time{" "}
                <span className="font-normal text-[#9a8a7e]">(optional)</span>
              </label>
              <input
                type="time"
                name="timeOfDay"
                value={form.timeOfDay}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-[12px] border border-[#ecdcc8] bg-[#fffaf6] px-3 py-2.5 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#de7e52] focus:ring-2 focus:ring-[#de7e52]/10"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[13px] font-semibold text-[#5a514a]">
                Notes{" "}
                <span className="font-normal text-[#9a8a7e]">(optional)</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any extra details…"
                className="mt-1.5 w-full resize-none rounded-[12px] border border-[#ecdcc8] bg-[#fffaf6] px-3 py-2.5 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#de7e52] focus:ring-2 focus:ring-[#de7e52]/10 placeholder:text-[#b0a49c]"
              />
            </div>

            {error && (
              <p className="rounded-[10px] bg-red-50 px-3 py-2 text-[13px] font-medium text-red-500">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-[#ecdcc8] bg-white py-2.5 text-[14px] font-semibold text-[#5a514a] transition hover:bg-[#f7f2e9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-[#de7e52] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#cf7045] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Reminder"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
