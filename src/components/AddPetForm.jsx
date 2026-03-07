const speciesOptions = ["Dog", "Cat"];

const breedOptionsBySpecies = {
  Dog: [
    "Golden Retriever",
    "Labrador Retriever",
    "German Shepherd",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Cavapoo",
    "Mixed Breed",
  ],
  Cat: [
    "Domestic Shorthair",
    "Orange Tabby",
    "Persian",
    "Maine Coon",
    "Ragdoll",
    "Siamese",
    "British Shorthair",
    "Mixed Breed",
  ],
};

const weightUnitOptions = ["lb", "kg"];

export default function AddPetForm({
  onSavePet,
  embedded = false,
  petData,
  onPetChange,
}) {
  function handleSubmit(e) {
    e.preventDefault();

    if (!petData.name.trim()) {
      alert("Please enter pet name.");
      return;
    }

    const newPet = {
      ...petData,
      id:
        petData.id ||
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now())),
      name: petData.name.trim(),
      species: petData.species || "",
      breed: petData.breed || "",
      weight: petData.weight === "" ? "" : Number(petData.weight),
      unit: petData.unit || "lb",
      age: petData.age === "" ? "" : Number(petData.age),
      healthConditions: petData.healthConditions?.trim() || "",
      birthDate: petData.birthDate || "",
      image: petData.image || "",
    };

    onSavePet?.(newPet);
  }

  const inputClass =
    "w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10";

  const disabledSelectClass =
    "w-full rounded-xl border border-[#e8a58d] bg-white px-3 py-2 outline-none focus:border-[#d87c5a] focus:ring-2 focus:ring-[#d87c5a]/10 disabled:cursor-not-allowed disabled:bg-[#f5f1ec]";

  const content = (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-bold text-[#1f1f1f]">Add Pet</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-3 gap-y-3">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Pet name</label>
          <input
            name="name"
            value={petData.name}
            onChange={(e) => onPetChange("name", e.target.value)}
            placeholder="e.g. Max"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Species</label>
          <select
            name="species"
            value={petData.species}
            onChange={(e) => {
              onPetChange("species", e.target.value);
              onPetChange("breed", "");
            }}
            className={inputClass}
          >
            <option value="">Select species</option>
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Breed</label>
          <select
            name="breed"
            value={petData.breed}
            onChange={(e) => onPetChange("breed", e.target.value)}
            disabled={!petData.species}
            className={disabledSelectClass}
          >
            <option value="">
              {petData.species ? "Select breed" : "Select species first"}
            </option>
            {(breedOptionsBySpecies[petData.species] || []).map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Weight</label>
          <input
            name="weight"
            type="number"
            value={petData.weight}
            onChange={(e) => onPetChange("weight", e.target.value)}
            placeholder="e.g. 70"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Unit</label>
          <select
            name="unit"
            value={petData.unit}
            onChange={(e) => onPetChange("unit", e.target.value)}
            className={inputClass}
          >
            {weightUnitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Age</label>
          <input
            name="age"
            type="number"
            value={petData.age}
            onChange={(e) => onPetChange("age", e.target.value)}
            placeholder="e.g. 5"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">Birth date</label>
          <input
            name="birthDate"
            type="date"
            value={petData.birthDate}
            onChange={(e) => onPetChange("birthDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4f4b45]">
            Health Conditions And Activity Level
          </label>
          <textarea
            name="healthConditions"
            value={petData.healthConditions}
            onChange={(e) => onPetChange("healthConditions", e.target.value)}
            placeholder="e.g. Hip dysplasia, food allergies, arthritis..."
            rows={3}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="col-span-2 justify-self-center rounded-full bg-[#d87c5a] px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-[#c96d4c]"
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