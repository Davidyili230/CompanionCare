import { useState } from "react";

const initialForm = {
  petName: "",
  species: "",
  breed: "",
  weight: "",
  unit: "lb",
  age: "",
  birthDate: "",
  healthConditions: "",
};

export default function AddPetForm({ onSavePet, embedded = false }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.petName.trim()) {
      alert("Please enter pet name.");
      return;
    }

    const newPet = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      name: form.petName.trim(),
      species: form.species.trim() || "Unknown",
      breed: form.breed.trim() || "Unknown",
      ageYears: form.age ? Number(form.age) : null,
      weight: form.weight ? Number(form.weight) : null,
      weightUnit: form.unit || "lb",
      image: "",
      healthConditions: form.healthConditions.trim(),
      birthDate: form.birthDate.trim(),
    };

    onSavePet?.(newPet);
    setForm(initialForm);
  }

  const content = (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-bold text-[#1f1f1f]">Add Pet</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-3 gap-y-3">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Pet name</label>
          <input
            name="petName"
            value={form.petName}
            onChange={handleChange}
            placeholder="e.g. Max"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Species</label>
          <input
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="e.g. Dog"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Breed</label>
          <input
            name="breed"
            value={form.breed}
            onChange={handleChange}
            placeholder="e.g. Golden Retriever"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Weight</label>
          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="e.g. 70"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Unit</label>
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. lb"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Age</label>
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="e.g. 5"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Birth date</label>
          <input
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            placeholder="e.g. 2/10/2021"
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">
            Health Conditions And Activity Level
          </label>
          <textarea
            name="healthConditions"
            value={form.healthConditions}
            onChange={handleChange}
            placeholder="e.g. Hip dysplasia, food allergies, arthritis..."
            rows={3}
            className="w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 justify-self-center rounded-full bg-[#d87c5a] px-6 py-2 font-semibold text-[#1f1f1f] transition hover:opacity-95"
        >
          Save Pet
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