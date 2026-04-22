import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

function normalizeSpecies(species) {
  return String(species ?? "").trim().toLowerCase();
}

export async function getCatalogSuggestionsForPet(pet, ruleKeys = []) {
  const species = normalizeSpecies(pet?.species);
  const weight = Number(pet?.weight);

  if (!species || !Array.isArray(ruleKeys) || ruleKeys.length === 0) {
    return [];
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    return [];
  }

  const snapshot = await getDocs(collection(db, "supplementCatalog"));

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return items.filter((item) => {
    return (
      item.active === true &&
      String(item.species ?? "").trim().toLowerCase() === species &&
      ruleKeys.includes(item.recommendationKey) &&
      weight >= Number(item.minWeight ?? 0) &&
      weight <= Number(item.maxWeight ?? Infinity)
    );
  });
}