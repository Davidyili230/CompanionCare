import { useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import AddPetEmptyCard from "../components/AddPetEmptyCard";
import PetWorkspaceTabs from "../components/PetWorkspaceTabs";
import RecommendedDosagePanel from "../components/RecommendedDosagePanel";

export default function MyPetPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const addPetSectionRef = useRef(null);

  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  const dosageItems = [];
  const suggestions = [];

  function handleAddPet(newPet) {
    setPets((prev) => [...prev, newPet]);
    setSelectedPetId((prevSelected) => prevSelected ?? newPet.id);
  }

  function handleAddSupplement(newSupplement) {
    console.log("New supplement:", newSupplement);
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f2e9] p-3">
      <Navbar />

      <main className="mt-4 grid gap-4 xl:grid-cols-[520px_minmax(0,1fr)]">
        {/* Left side: My Pets bigger */}
        <section className="rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm min-h-[760px]">
          <h3 className="text-[15px] font-bold text-[#1f1f1f]">
            My Pets (Choose a pet)
          </h3>

          <div className="mt-4 flex flex-wrap gap-4">
            {pets.length === 0 ? (
              <AddPetEmptyCard
                onClick={() =>
                  addPetSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              />
            ) : (
              pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  selected={selectedPetId === pet.id}
                  onClick={setSelectedPetId}
                />
              ))
            )}
          </div>
        </section>

        {/* Right side: Tabs + dosage panel */}
        <div
          ref={addPetSectionRef}
          className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <PetWorkspaceTabs
            selectedPet={selectedPet}
            onSavePet={handleAddPet}
            onAddSupplement={handleAddSupplement}
            suggestions={suggestions}
          />

          <div className="self-start">
            <RecommendedDosagePanel
              pet={selectedPet}
              dosageItems={dosageItems}
            />
          </div>
        </div>
      </main>
    </div>
  );
}