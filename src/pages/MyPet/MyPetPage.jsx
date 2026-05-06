<<<<<<< Updated upstream
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import PetCard from "../../components/PetCard";
import AddPetEmptyCard from "../../components/AddPetEmptyCard";
import PetWorkspaceTabs from "../../components/PetWorkspaceTabs";
import RecommendedDosagePanel from "../../components/RecommendedDosagePanel";
import { calcDosageItems } from "../../utils/dosageCalculator";
import {
  savePet,
  subscribeToPets,
  deletePet,
  subscribeToSupplements,
  saveSupplement,
  deleteSupplement,
} from "../../services/petService";
import { auth } from "../../firebase.js";
import { getSuggestedSupplementRules } from "../../utils/getSuggestedSupplements";
import { getCatalogSuggestionsForPet } from "../../services/supplementCatalogService";

const EMPTY_PET = {
  id: null,
  name: "",
  species: "",
  breed: "",
  weight: "",
  unit: "lb",
  age: "",
  birthDate: "",
  healthConditions: "",
  image: "",
};

function formatDateToInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getBirthDateFromAge(age) {
  const years = Number(age);

  if (!Number.isFinite(years) || years < 0) return "";

  const today = new Date();
  const birthDate = new Date(today);
  birthDate.setFullYear(today.getFullYear() - Math.floor(years));

  return formatDateToInput(birthDate);
}

function getAgeFromBirthDate(birthDate) {
  if (!birthDate) return "";

  const dob = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age < 0 ? "" : String(age);
}

export default function MyPetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [workspaceTab, setWorkspaceTab] = useState("add-pet");

  const [pets, setPets] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [draftPet, setDraftPet] = useState(EMPTY_PET);
  const [formMode, setFormMode] = useState("add");
  const [authReady, setAuthReady] = useState(false);
  const [currentUid, setCurrentUid] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");

  const addPetSectionRef = useRef(null);

  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  useEffect(() => {
    if (formMode !== "edit") return;

    if (selectedPet) {
      setDraftPet({
        ...EMPTY_PET,
        ...selectedPet,
      });
    } else {
      setDraftPet(EMPTY_PET);
    }

    setErrors({});
    setTouched({});
  }, [selectedPet, formMode]);

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

  useEffect(() => {
    const navState = location.state;
    const tabFromQuery = searchParams.get("tab");
    const tabFromState = navState?.openTab;

    if (!authReady) return;

    const shouldOpenSupplementTab =
      tabFromQuery === "addSupplement" || tabFromState === "supplement";

    if (shouldOpenSupplementTab) {
      setWorkspaceTab("add-supplement");
    }

    if (!navState?.selectedPetId || navState?.mode !== "edit") {
      if (shouldOpenSupplementTab) {
        requestAnimationFrame(() => {
          addPetSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });

        navigate(location.pathname, { replace: true, state: null });
      }

      return;
    }

    if (!pets.length) return;

    const targetPet = pets.find((pet) => pet.id === navState.selectedPetId);
    if (!targetPet) return;

    setSelectedPetId(targetPet.id);
    setFormMode("edit");
    setDraftPet({
      ...EMPTY_PET,
      ...targetPet,
    });
    setErrors({});
    setTouched({});

    requestAnimationFrame(() => {
      addPetSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    navigate(location.pathname, { replace: true, state: null });
  }, [authReady, pets, location, navigate, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadSuggestions() {
      if (!selectedPet?.species) {
        setSuggestions([]);
        setSuggestionError("");
        setLoadingSuggestions(false);
        return;
      }

      try {
        setLoadingSuggestions(true);
        setSuggestionError("");

        const rules = getSuggestedSupplementRules(selectedPet);
        const ruleKeys = rules.map((rule) => rule.key);

        if (ruleKeys.length === 0) {
          setSuggestions([]);
          return;
        }

        const data = await getCatalogSuggestionsForPet(selectedPet, ruleKeys);

        const ruleOrder = ruleKeys.reduce((acc, key, index) => {
          acc[key] = index;
          return acc;
        }, {});

        const normalized = [...data]
          .sort((a, b) => {
            const keyDiff =
              (ruleOrder[a.recommendationKey] ?? 999) -
              (ruleOrder[b.recommendationKey] ?? 999);

            if (keyDiff !== 0) return keyDiff;

            return (a.minWeight ?? 0) - (b.minWeight ?? 0);
          })
          .map((item) => ({
            id: item.id,
            name: item.name || "Unnamed supplement",
            reason: `Recommended dose for ${selectedPet?.name || "this pet"}`,
            tag: item.recommendationKey || "supplement",
            note: [
              item.brand ? `Brand: ${item.brand}` : "",
              `Dose: ${item.dosageAmount} ${item.dosageUnit}`,
            ]
              .filter(Boolean)
              .join(" • "),
            imageUrl: "",
            link: "",
          }));

        if (!cancelled) {
          setSuggestions(normalized);
        }
      } catch (error) {
        if (!cancelled) {
          setSuggestions([]);
          setSuggestionError(
            error.message || "Failed to load supplement suggestions."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSuggestions(false);
        }
      }
    }

    loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [selectedPet]);

  function validatePetForm(pet) {
    const nextErrors = {};

    const weightValue = String(pet.weight ?? "").trim();
    const ageValue = String(pet.age ?? "").trim();
    const birthDateValue = String(pet.birthDate ?? "").trim();

    if (!weightValue) {
      nextErrors.weight = "Weight is required.";
    } else if (
      !Number.isFinite(Number(weightValue)) ||
      Number(weightValue) <= 0
    ) {
      nextErrors.weight = "Please enter a valid weight.";
    }

    if (!ageValue && !birthDateValue) {
      nextErrors.age = "Please enter age or birth date.";
      nextErrors.birthDate = "Please enter age or birth date.";
    } else {
      if (ageValue) {
        const ageNumber = Number(ageValue);
        if (!Number.isFinite(ageNumber) || ageNumber < 0) {
          nextErrors.age = "Please enter a valid age.";
        }
      }

      if (birthDateValue) {
        const dob = new Date(`${birthDateValue}T12:00:00`);
        const today = new Date();

        if (Number.isNaN(dob.getTime())) {
          nextErrors.birthDate = "Please enter a valid birth date.";
        } else if (dob > today) {
          nextErrors.birthDate = "Birth date cannot be in the future.";
        }
      }
    }

    return nextErrors;
  }

  function handleDraftPetChange(field, value) {
    setDraftPet((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "age") {
        const nextBirthDate = value ? getBirthDateFromAge(value) : "";
        if (prev.birthDate !== nextBirthDate) {
          next.birthDate = nextBirthDate;
        }
      }

      if (field === "birthDate") {
        const nextAge = value ? getAgeFromBirthDate(value) : "";
        if (String(prev.age ?? "") !== nextAge) {
          next.age = nextAge;
        }
      }

      return next;
    });

    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[field];

      if (field === "age" || field === "birthDate") {
        delete nextErrors.age;
        delete nextErrors.birthDate;
      }

      return nextErrors;
    });
  }

  function handleFieldBlur(field) {
    setTouched((prev) => {
      if (field === "age" || field === "birthDate") {
        return {
          ...prev,
          age: true,
          birthDate: true,
        };
      }

      return {
        ...prev,
        [field]: true,
      };
    });

    setErrors(validatePetForm(draftPet));
  }

  function handleStartAddPet() {
    setFormMode("add");
    setSelectedPetId(null);
    setDraftPet(EMPTY_PET);
    setErrors({});
    setTouched({});

    addPetSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSelectPet(petId) {
    const pet = pets.find((p) => p.id === petId) ?? null;
    setSelectedPetId(petId);
    setFormMode("edit");
    setDraftPet(pet ? { ...EMPTY_PET, ...pet } : EMPTY_PET);

    addPetSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleAddPet(newPet) {
    const petToValidate = {
      ...EMPTY_PET,
      ...draftPet,
      ...newPet,
    };

    const validationErrors = validatePetForm(petToValidate);

    setErrors(validationErrors);
    setTouched({
      weight: true,
      age: true,
      birthDate: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const petId = await savePet(petToValidate);

      setSelectedPetId(petId);
      setFormMode("add");
      setDraftPet(EMPTY_PET);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Failed to save pet. Please try again.");
    }
  }

  async function handleDeletePet(petId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet?"
    );

    if (!confirmed) return;

    try {
      await deletePet(petId);

      if (selectedPetId === petId) {
        setSelectedPetId(null);
      }

      setDraftPet((prev) => (prev.id === petId ? EMPTY_PET : prev));
      setFormMode("add");
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Failed to delete pet. Please try again.");
    }
  }

  async function handleAddSupplement(newSupplement) {
    if (!selectedPetId) {
      alert("Please select a pet first.");
      return;
    }

    try {
      await saveSupplement(selectedPetId, newSupplement);
    } catch (error) {
      console.error("Error saving supplement:", error);
      alert("Failed to save supplement. Please try again.");
    }
  }

  async function handleDeleteSupplement(supplementId) {
    try {
      await deleteSupplement(supplementId);
    } catch (error) {
      console.error("Error deleting supplement:", error);
      alert("Failed to delete supplement. Please try again.");
    }
  }

  const hasDraftInput = Boolean(
    draftPet.name ||
      draftPet.species ||
      draftPet.breed ||
      draftPet.weight ||
      draftPet.age ||
      draftPet.birthDate ||
      draftPet.healthConditions ||
      draftPet.image
  );

  const dosageSourcePet = hasDraftInput ? draftPet : selectedPet;

  const { items: dosageItems } = useMemo(() => {
    return calcDosageItems(dosageSourcePet);
  }, [dosageSourcePet]);

  return (
    <div className="min-h-screen w-full bg-[#f7f2e9] px-6 pb-6 pt-4">
      <main className="mt-6 grid gap-5 xl:grid-cols-[560px_minmax(0,1fr)]">
        <section className="self-start rounded-[28px] border border-[#ecdcc8] bg-white px-4 py-5 shadow-sm xl:min-h-177.5">
          <h3 className="text-[15px] font-bold text-[#1f1f1f]">
            My Pets (Choose a pet)
          </h3>

          <div className="mt-5 grid grid-cols-3 gap-4 content-start">
            {pets.length === 0 ? (
              <AddPetEmptyCard onClick={handleStartAddPet} />
            ) : (
              <>
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    selected={selectedPetId === pet.id}
                    onClick={handleSelectPet}
                    onDelete={handleDeletePet}
                  />
                ))}

                <AddPetEmptyCard onClick={handleStartAddPet} />
              </>
            )}
          </div>
        </section>

        <div
          ref={addPetSectionRef}
          className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <PetWorkspaceTabs
            selectedPet={selectedPet}
            draftPet={draftPet}
            supplements={supplements}
            activeTab={workspaceTab}
            onTabChange={setWorkspaceTab}
            onDraftPetChange={handleDraftPetChange}
            onFieldBlur={handleFieldBlur}
            onStartAddPet={handleStartAddPet}
            onSavePet={handleAddPet}
            onAddSupplement={handleAddSupplement}
            onDeleteSupplement={handleDeleteSupplement}
            suggestions={suggestions}
            suggestionLoading={loadingSuggestions}
            suggestionError={suggestionError}
            errors={errors}
            touched={touched}
            formMode={formMode}
          />

          <div className="self-start">
            <RecommendedDosagePanel
              pet={dosageSourcePet}
              dosageItems={dosageItems}
            />
          </div>
        </div>
      </main>
    </div>
  );
=======
import { useEffect, useMemo, useRef, useState } from "react";
import PetCard from "../../components/PetCard";
import AddPetEmptyCard from "../../components/AddPetEmptyCard";
import PetWorkspaceTabs from "../../components/PetWorkspaceTabs";
import RecommendedDosagePanel from "../../components/RecommendedDosagePanel";
import { calcDosageItems } from "../../utils/dosageCalculator";

const EMPTY_PET = {
  id: null,
  name: "",
  species: "",
  breed: "",
  weight: "",
  unit: "lb",
  age: "",
  birthDate: "",
  healthConditions: "",
  image: "",
};

function formatDateToInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getBirthDateFromAge(age) {
  const years = Number(age);

  if (!Number.isFinite(years) || years < 0) return "";

  const today = new Date();
  const birthDate = new Date(today);
  birthDate.setFullYear(today.getFullYear() - Math.floor(years));

  return formatDateToInput(birthDate);
}

function getAgeFromBirthDate(birthDate) {
  if (!birthDate) return "";

  const dob = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age < 0 ? "" : String(age);
}

export default function MyPetPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [draftPet, setDraftPet] = useState(EMPTY_PET);
  const [formMode, setFormMode] = useState("add");

  const addPetSectionRef = useRef(null);

  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  useEffect(() => {
    if (formMode !== "edit") return;

    if (selectedPet) {
      setDraftPet({
        ...EMPTY_PET,
        ...selectedPet,
      });
    } else {
      setDraftPet(EMPTY_PET);
    }
  }, [selectedPet, formMode]);

  function handleDraftPetChange(field, value) {
    setDraftPet((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "age") {
        const nextBirthDate = value ? getBirthDateFromAge(value) : "";
        if (prev.birthDate !== nextBirthDate) {
          next.birthDate = nextBirthDate;
        }
      }

      if (field === "birthDate") {
        const nextAge = value ? getAgeFromBirthDate(value) : "";
        if (String(prev.age ?? "") !== nextAge) {
          next.age = nextAge;
        }
      }

      return next;
    });
  }

  function handleStartAddPet() {
    setFormMode("add");
    setDraftPet(EMPTY_PET);

    addPetSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSelectPet(petId) {
    setSelectedPetId(petId);
    setFormMode("edit");
  }

  function handleAddPet(newPet) {
    const petToSave = {
      ...EMPTY_PET,
      ...draftPet,
      ...newPet,
      id: newPet?.id ?? draftPet?.id ?? crypto.randomUUID(),
      weight:
        draftPet.weight === "" || draftPet.weight === null
          ? ""
          : Number(draftPet.weight),
      age:
        draftPet.age === "" || draftPet.age === null
          ? ""
          : Number(draftPet.age),
    };

    setPets((prev) => {
      const exists = prev.some((pet) => pet.id === petToSave.id);

      if (exists) {
        return prev.map((pet) => (pet.id === petToSave.id ? petToSave : pet));
      }

      return [...prev, petToSave];
    });

    setSelectedPetId(petToSave.id);
    setFormMode("add");
    setDraftPet(EMPTY_PET);
  }

  const hasDraftInput = Boolean(
    draftPet.name ||
      draftPet.species ||
      draftPet.breed ||
      draftPet.weight ||
      draftPet.age ||
      draftPet.birthDate ||
      draftPet.healthConditions ||
      draftPet.image
  );

  const dosageSourcePet = hasDraftInput ? draftPet : selectedPet;

  const { items: dosageItems } = useMemo(() => {
    return calcDosageItems(dosageSourcePet);
  }, [dosageSourcePet]);

  const suggestions = [];

  function handleAddSupplement(newSupplement) {
    console.log("New supplement:", newSupplement);
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f2e9] p-3">
      <main className="mt-4 grid gap-4 xl:grid-cols-[520px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm min-h-190">
          <h3 className="text-[15px] font-bold text-[#1f1f1f]">
            My Pets (Choose a pet)
          </h3>

          <div className="mt-4 flex flex-wrap gap-4">
            {pets.length === 0 ? (
              <AddPetEmptyCard onClick={handleStartAddPet} />
            ) : (
              pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  selected={selectedPetId === pet.id}
                  onClick={handleSelectPet}
                />
              ))
            )}
          </div>
        </section>

        <div
          ref={addPetSectionRef}
          className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <PetWorkspaceTabs
            selectedPet={selectedPet}
            draftPet={draftPet}
            onDraftPetChange={handleDraftPetChange}
            onStartAddPet={handleStartAddPet}
            onSavePet={handleAddPet}
            onAddSupplement={handleAddSupplement}
            suggestions={suggestions}
          />

          <div className="self-start">
            <RecommendedDosagePanel
              pet={dosageSourcePet}
              dosageItems={dosageItems}
            />
          </div>
        </div>
      </main>
    </div>
  );
>>>>>>> Stashed changes
}