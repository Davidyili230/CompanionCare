<<<<<<< Updated upstream
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";
import {
  subscribeToPets,
  subscribeToSupplements,
  deleteSupplement,
} from "../../services/petService";
import TodaysReminders from "../../components/TodaysReminders";
import RecentIntake from "../../components/RecentIntake";

function getAgeLabel(pet) {
  if (pet?.age) return `${pet.age} yr`;
  if (!pet?.birthDate) return "—";

  const dob = new Date(`${pet.birthDate}T12:00:00`);
  if (Number.isNaN(dob.getTime())) return "—";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? `${age} yr` : "—";
}

function formatSupplementDescription(supplement) {
  const parts = [];

  if (supplement.brand) parts.push(`Brand: ${supplement.brand}`);
  if (supplement.dosage) {
    parts.push(`Dose: ${supplement.dosage} ${supplement.unit || ""}`.trim());
  }

  if (supplement.notes) parts.push(supplement.notes);

  return parts.join(" • ") || "No supplement description added yet.";
}

function formatSupplementSchedule(supplement) {
  const parts = [];

  if (supplement.frequency) parts.push(supplement.frequency);
  if (supplement.timeOfDay) parts.push(supplement.timeOfDay);
  if (supplement.startDate) parts.push(`Start: ${supplement.startDate}`);

  return parts.join(" • ") || "Schedule not set";
}

function DashboardPetCard({ pet, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pet.id)}
      className={`flex w-full min-h-42.5 flex-col items-center rounded-[22px] border px-4 py-4 text-center transition-all duration-200 ${
        selected
          ? "border-[#de7e52] bg-[#fcf5ef]"
          : "border-[#de7e52] bg-white hover:bg-[#fcf5ef]"
      }`}
    >
      <div className="mb-3 flex h-17 w-17 items-center justify-center overflow-hidden rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
        {pet.image ? (
          <img
            src={pet.image}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[26px] font-semibold text-[#d87c5a]">
            {pet.name?.[0]?.toUpperCase() || "P"}
          </span>
        )}
      </div>

      <p className="text-[16px] font-bold leading-tight text-[#1f1f1f]">
        {pet.name || "Unnamed pet"}
      </p>

      <p className="mt-2 text-[13px] leading-snug text-[#4f4f4f]">
        {pet.species || "Unknown"}
        <br />
        {pet.breed || "Unknown breed"}
      </p>
    </button>
  );
}

function AddPetShortcutCard() {
  return (
    <Link
      to="/my-pet"
      className="flex w-full min-h-42.5 flex-col items-center justify-center rounded-[22px] border border-dashed border-[#de7e52] bg-white px-4 py-4 text-center transition-all duration-200 hover:bg-[#fcf5ef]"
    >
      <div className="mb-4 flex h-17 w-17 items-center justify-center rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
        <span className="text-[28px] font-medium leading-none text-[#d87c5a]">
          +
        </span>
      </div>

      <p className="text-[16px] font-bold text-[#1f1f1f]">Add Pet</p>
    </Link>
  );
}


function ActiveSupplementCard({ supplement, onDelete }) {
  return (
    <div className="rounded-[18px] border border-[#ecdcc8] bg-white px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-bold text-[#1f1f1f]">
            {supplement.name || "Unnamed supplement"}
          </h3>

          <p className="mt-2 text-[13px] leading-6 text-[#7b6e65]">
            {formatSupplementDescription(supplement)}
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:w-55">
          <div className="rounded-[14px] border border-[#ecdcc8] bg-[#fffaf6] px-3 py-3">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[#8a786c]">
              Time to take
            </p>
            <p className="mt-2 text-[14px] font-semibold text-[#1f1f1f]">
              {formatSupplementSchedule(supplement)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(supplement.id)}
              className="rounded-full bg-red-500 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-red-600"
            >
              Delete
            </button>

            <span className="rounded-full bg-[#f7efe7] px-4 py-2 text-[12px] font-semibold text-[#b67a5d]">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveSupplementsSection({
  selectedPet,
  supplements,
  onDeleteSupplement,
}) {
  return (
    <section className="rounded-[28px] border border-[#ecdcc8] bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#1f1f1f]">
          Active Supplements
        </h2>
      </div>

      {!selectedPet ? (
        <div className="mt-5 flex min-h-130 items-center justify-center rounded-[22px] border border-dashed border-[#e7cdbd] bg-[#fffaf6] px-6 text-center">
          <p className="text-[14px] text-[#8a786c]">
            Select a pet from the My Pets section first.
          </p>
        </div>
      ) : supplements.length === 0 ? (
        <div className="mt-5 flex min-h-130 flex-col items-center justify-center rounded-[22px] border border-dashed border-[#e7cdbd] bg-[#fffaf6] px-6 text-center">
          <p className="text-[18px] font-semibold text-[#1f1f1f]">
            No active supplements
          </p>
          <p className="mt-2 max-w-95 text-[14px] leading-6 text-[#7b6e65]">
            {selectedPet.name || "This pet"} does not have any supplements yet.
          </p>

          <Link
            to="/my-pet?tab=addSupplement"
            state={{
              selectedPetId: selectedPet.id,
              mode: "edit",
              openTab: "supplement",
            }}
            className="mt-5 rounded-full bg-[#de7e52] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#cf7045]"
          >
            Add Supplement
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {supplements.map((supplement) => (
            <ActiveSupplementCard
              key={supplement.id}
              supplement={supplement}
              onDelete={onDeleteSupplement}
            />
          ))}

          <div className="pt-3 flex justify-center">
            <Link
              to="/my-pet?tab=addSupplement"
              state={{
                selectedPetId: selectedPet.id,
                mode: "edit",
                openTab: "supplement",
              }}
              className="inline-flex rounded-full bg-[#de7e52] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#cf7045]"
            >
              + Add Supplement
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUid(user?.uid ?? null);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!currentUid) {
      setPets([]);
      setSelectedPetId(null);
      return;
    }

    const unsubscribe = subscribeToPets((list) => {
      setPets(list);

      setSelectedPetId((prevSelectedPetId) => {
        if (!list.length) return null;

        const stillExists = list.some((pet) => pet.id === prevSelectedPetId);
        if (stillExists) return prevSelectedPetId;

        return list[0].id;
      });
    });

    return () => unsubscribe();
  }, [authReady, currentUid]);

  useEffect(() => {
    if (!authReady || !currentUid || !selectedPetId) {
      setSupplements([]);
      return;
    }

    const unsubscribe = subscribeToSupplements(selectedPetId, (list) => {
      setSupplements(list);
    });

    return () => unsubscribe();
  }, [authReady, currentUid, selectedPetId]);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  const handleDeleteSupplement = async (supplementId) => {
    if (!selectedPetId || !supplementId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this supplement?"
    );

    if (!confirmed) return;

    try {
      await deleteSupplement(supplementId);
    } catch (error) {
      console.error("Failed to delete supplement:", error);
      alert("Failed to delete supplement. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f2e9] px-6 pb-6 pt-4">
      <main className="mt-6 grid gap-5">
        {/* Top row */}
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <TodaysReminders pets={pets} />

          <section className="rounded-[28px] border border-[#ecdcc8] bg-white px-5 py-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#1f1f1f]">
                My Pets (Choose a pet)
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {pets.length === 0 ? (
                <AddPetShortcutCard />
              ) : (
                <>
                  {pets.map((pet) => (
                    <DashboardPetCard
                      key={pet.id}
                      pet={pet}
                      selected={selectedPetId === pet.id}
                      onSelect={setSelectedPetId}
                    />
                  ))}
                  <AddPetShortcutCard />
                </>
              )}
            </div>
          </section>
        </div>

        {/* Bottom row */}
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-[#ecdcc8] bg-white px-5 py-5 shadow-sm">
            <div className="rounded-[22px] border border-[#ecdcc8] bg-[#fffaf6] px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#1f1f1f]">
                  Pet Profile
                </h2>

                <Link
                  to="/my-pet"
                  state={
                    selectedPet
                      ? {
                          selectedPetId: selectedPet.id,
                          mode: "edit",
                        }
                      : undefined
                  }
                  className="rounded-full bg-[#de7e52] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#cf7045]"
                >
                  Edit in My Pet
                </Link>
              </div>

              {selectedPet ? (
                <div className="mt-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
                      {selectedPet.image ? (
                        <img
                          src={selectedPet.image}
                          alt={selectedPet.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[34px] font-semibold text-[#d87c5a]">
                          {selectedPet.name?.[0]?.toUpperCase() || "P"}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[24px] font-bold text-[#1f1f1f]">
                        {selectedPet.name || "Unnamed pet"}
                      </h3>
                      <p className="mt-1 text-[15px] text-[#5a514a]">
                        {selectedPet.species || "Unknown species"} ·{" "}
                        {selectedPet.breed || "Unknown breed"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[18px] border border-[#ecdcc8] bg-white px-4 py-4">
                      <p className="text-[12px] font-medium uppercase tracking-wide text-[#8a786c]">
                        Age
                      </p>
                      <p className="mt-2 text-[18px] font-bold text-[#1f1f1f]">
                        {getAgeLabel(selectedPet)}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#ecdcc8] bg-white px-4 py-4">
                      <p className="text-[12px] font-medium uppercase tracking-wide text-[#8a786c]">
                        Species
                      </p>
                      <p className="mt-2 text-[18px] font-bold text-[#1f1f1f]">
                        {selectedPet.species || "—"}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#ecdcc8] bg-white px-4 py-4">
                      <p className="text-[12px] font-medium uppercase tracking-wide text-[#8a786c]">
                        Breed
                      </p>
                      <p className="mt-2 text-[18px] font-bold text-[#1f1f1f]">
                        {selectedPet.breed || "—"}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#ecdcc8] bg-white px-4 py-4">
                      <p className="text-[12px] font-medium uppercase tracking-wide text-[#8a786c]">
                        Weight
                      </p>
                      <p className="mt-2 text-[18px] font-bold text-[#1f1f1f]">
                        {selectedPet.weight
                          ? `${selectedPet.weight} ${selectedPet.unit || "lb"}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-[#ecdcc8] bg-white px-4 py-4">
                    <p className="text-[12px] font-medium uppercase tracking-wide text-[#8a786c]">
                      Health Conditions & Activity Level
                    </p>
                    <p className="mt-2 text-[15px] leading-7 text-[#3f3a36]">
                      {selectedPet.healthConditions ||
                        "No information added yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex min-h-55 items-center justify-center rounded-[18px] border border-dashed border-[#e7cdbd] bg-white px-6 text-center">
                  <p className="text-[14px] text-[#8a786c]">
                    Select a pet from the My Pets section first.
                  </p>
                </div>
              )}
            </div>

            <RecentIntake />
          </section>

          <ActiveSupplementsSection
            selectedPet={selectedPet}
            supplements={supplements}
            onDeleteSupplement={handleDeleteSupplement}
          />
        </div>
      </main>
    </div>
  );
}
=======
export default function Dashboard() {
  return <></>;
}
>>>>>>> Stashed changes
