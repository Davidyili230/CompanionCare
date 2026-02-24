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

export default function AddPetForm({ onSavePet }) {
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
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: form.petName.trim(),
      species: form.species.trim() || "Unknown",
      breed: form.breed.trim() || "Unknown",
      ageYears: form.age ? Number(form.age) : null,
      weight: form.weight ? Number(form.weight) : null,
      weightUnit: form.unit || "lb",
      image: "", // For simplicity, I'm leaving the image blank for now. We can add an image upload feature later.
      healthConditions: form.healthConditions.trim(),
      birthDate: form.birthDate.trim(),
    };

    onSavePet?.(newPet);

    setForm(initialForm);
  }

  return (
    <section className="section-card add-pet-card">
      <h3>Add Pet</h3>

      <form className="form-grid" onSubmit={handleSubmit}>
        {/* For simplicity, I'm not doing separate inputs for kg/lb or date picker for birth date, but those can be added later. */}
        <div className="field field-full">
          <label>Pet name</label>
          <input
            name="petName"
            value={form.petName}
            onChange={handleChange}
            placeholder="e.g. Max"
          />
        </div>

        <div className="field">
          <label>Species</label>
          <input
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="e.g. Dog"
          />
        </div>

        <div className="field">
          <label>Breed</label>
          <input
            name="breed"
            value={form.breed}
            onChange={handleChange}
            placeholder="e.g. Golden Retriever"
          />
        </div>

        <div className="field">
          <label>Weight</label>
          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="e.g. 70"
          />
        </div>

        <div className="field">
          <label>Unit</label>
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. lb"
          />
        </div>

        <div className="field">
          <label>Age</label>
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="e.g. 5"
          />
        </div>

        <div className="field">
          <label>Birth date</label>
          <input
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            placeholder="e.g. 2/10/2021"
          />
        </div>

        <div className="field field-full">
          <label>Health Conditions</label>
          <textarea
            name="healthConditions"
            value={form.healthConditions}
            onChange={handleChange}
            placeholder="e.g. Hip dysplasia, food allergies, arthritis..."
            rows={3}
          />
        </div>

        <button type="submit" className="btn-primary btn-center">
          Save Pet
        </button>
      </form>
    </section>
  );
}