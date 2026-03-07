import { AAFCO_TARGETS } from "../data/aafcoTargets";

export function toKg(weight, unit) {
  if (weight == null || weight === "") return null;

  const w = Number(weight);
  if (!Number.isFinite(w) || w <= 0) return null;

  const u = String(unit || "").toLowerCase();
  if (u === "kg") return w;
  if (u === "lb") return w * 0.45359237;

  return null;
}

export function calcRER(weightKg) {
  if (weightKg == null || weightKg <= 0) return null;
  return 70 * Math.pow(weightKg, 0.75);
}

// MVP MER factor based on species, life stage, and neuter status
export function getMerFactor(pet) {
  const species = String(pet?.species || "").trim().toLowerCase();
  const lifeStage = String(pet?.lifeStage || "adult").trim().toLowerCase();
  const neuterStatus = String(pet?.neuterStatus || "neutered")
    .trim()
    .toLowerCase();

  // Growth
  if (lifeStage === "growth") {
    if (species === "dog") return 2.0;
    if (species === "cat") return 2.5;
  }

  // Adult
  if (lifeStage === "adult") {
    if (species === "dog") return neuterStatus === "intact" ? 1.8 : 1.6;
    if (species === "cat") return neuterStatus === "intact" ? 1.4 : 1.2;
  }

  return 1.0;
}

export function calcMER(rer, factor) {
  if (rer == null || factor == null) return null;
  return rer * factor;
}

export function per1000kcalToPerDay(merKcalPerDay, per1000kcalValue) {
  if (merKcalPerDay == null || per1000kcalValue == null) return null;
  return (merKcalPerDay / 1000) * per1000kcalValue;
}

export function formatNumber(value, decimals = 3) {
  if (value == null || !Number.isFinite(value)) return "-";
  return value.toFixed(decimals);
}

function resolveStageKey(pet) {
  const explicitStage = String(pet?.lifeStage || "")
    .trim()
    .toLowerCase();

  if (explicitStage) return explicitStage;

  const ageRaw =
    pet?.age !== undefined && pet?.age !== null && pet?.age !== ""
      ? Number(pet.age)
      : pet?.ageYears !== undefined && pet?.ageYears !== null && pet?.ageYears !== ""
      ? Number(pet.ageYears)
      : null;

  if (Number.isFinite(ageRaw) && ageRaw < 1) return "growth";

  return "adult";
}

export function calcDosageItems(pet) {
  if (!pet) return { meta: null, items: [] };

  const species = String(pet.species || "").trim().toLowerCase();
  const stageKey = resolveStageKey(pet);

  const weightKg = toKg(pet.weight, pet.unit || pet.weightUnit);
  const rer = calcRER(weightKg);

  const factor = getMerFactor({
    ...pet,
    species,
    lifeStage: stageKey,
  });

  const mer = calcMER(rer, factor);

  const profile = AAFCO_TARGETS?.[species]?.[stageKey];

  if (!species || !profile || mer == null) {
    return {
      meta: { species, stageKey, weightKg, rer, factor, mer },
      items: [],
    };
  }

  const keysToShow = ["vitaminA", "vitaminD", "vitaminE"];

  const items = keysToShow
    .map((key) => {
      const row = profile[key];
      if (!row) return null;

      const daily = per1000kcalToPerDay(mer, row.per1000kcal);
      if (daily == null) return null;

      const label = row.label || key;
      const value = `${formatNumber(daily, 0)} ${row.unit}`;

      return {
        key,
        nutrient: label,
        name: label,
        value,
        unit: row.unit,
        rawValue: daily,
        description:
          "These are general guidelines based on veterinary recommendations. Consult your vet for personalized advice.",
      };
    })
    .filter(Boolean);

  return {
    meta: { species, stageKey, weightKg, rer, factor, mer },
    items,
  };
}