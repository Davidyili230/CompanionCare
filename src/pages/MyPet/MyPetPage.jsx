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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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

    setErrors({});
    setTouched({});
  }, [selectedPet, formMode]);

  function validatePetForm(pet) {
    const nextErrors = {};

    const weightValue = String(pet.weight ?? "").trim();
    const ageValue = String(pet.age ?? "").trim();
    const birthDateValue = String(pet.birthDate ?? "").trim();

    // weight is required
    if (!weightValue) {
      nextErrors.weight = "Weight is required.";
    } else if (!Number.isFinite(Number(weightValue)) || Number(weightValue) <= 0) {
      nextErrors.weight = "Please enter a valid weight.";
    }

    // age / birthDate validation - at least one is required, and both must be valid if provided
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

    // 用户一旦修改字段，就先清掉对应错误
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[field];

      // age / birthDate 是联动字段，改一个时两个 warning 都清掉
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
    setDraftPet(EMPTY_PET);
    setErrors({});
    setTouched({});

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

    const petToSave = {
      ...EMPTY_PET,
      ...draftPet,
      ...newPet,
      id: newPet?.id ?? draftPet?.id ?? crypto.randomUUID(),
      weight:
        petToValidate.weight === "" || petToValidate.weight === null
          ? ""
          : Number(petToValidate.weight),
      age:
        petToValidate.age === "" || petToValidate.age === null
          ? ""
          : Number(petToValidate.age),
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
    setErrors({});
    setTouched({});
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
            onFieldBlur={handleFieldBlur}
            onStartAddPet={handleStartAddPet}
            onSavePet={handleAddPet}
            onAddSupplement={handleAddSupplement}
            suggestions={suggestions}
            errors={errors}
            touched={touched}
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
}