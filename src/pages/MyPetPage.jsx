import { useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import AddPetEmptyCard from "../components/AddPetEmptyCard";
import AddPetForm from "../components/AddPetForm";
import AddSupplementForm from "../components/AddSupplementForm";
import RecommendedDosagePanel from "../components/RecommendedDosagePanel";
import SupplementSuggestionList from "../components/SupplementSuggestionList";

export default function MyPetPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const addPetSectionRef = useRef(null);

  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  const dosageItems = []; // Leave blank for now (formula/backend will be added later)

  function handleClickAddPetCard() {
    // Clicking the empty-state card scrolls to the Add Pet form
    addPetSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleAddPet(newPet) {
    setPets((prev) => [...prev, newPet]);
    setSelectedPetId((prevSelected) => prevSelected ?? newPet.id);
  }

  function handleAddSupplement(newSupplement) {
    // Mock frontend only for now
    console.log("New supplement (mock):", newSupplement);

    // Future:
    // 1) Save to local state
    // 2) POST to backend
    // 3) Update supplement history / reminders
  }

  return (
    <div className="my-pet-page">
      <Navbar />

      <main className="my-pet-content">
        {/* Left Column */}
        <div className="left-column">
          <section className="section-card add-pet-card">
            <h3>My Pets (Choose a pet)</h3>

            <div className="pet-list">
              {pets.length === 0 ? (
                <AddPetEmptyCard onClick={handleClickAddPetCard} />
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

          <div ref={addPetSectionRef}>
            <AddPetForm onSavePet={handleAddPet} />
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <section className="section-card right-main-card">
            <div className="right-top-grid">
              <AddSupplementForm
                selectedPet={selectedPet}
                onAddSupplement={handleAddSupplement}
              />
              <RecommendedDosagePanel
                pet={selectedPet}
                dosageItems={dosageItems}
              />
            </div>

            <SupplementSuggestionList />
          </section>
        </div>
      </main>
    </div>
  );
}