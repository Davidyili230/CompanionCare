export const AAFCO_PROFILES = {
  dog: {
    adult: {
      vitaminA: { unit: "IU", per1000kcal: 1250, maxPer1000kcal: 62500 },
      vitaminD: { unit: "IU", per1000kcal: 125, maxPer1000kcal: 750 },
      vitaminE: { unit: "IU", per1000kcal: 12.5, maxPer1000kcal: null },
      thiamine: { unit: "mg", per1000kcal: 0.56, maxPer1000kcal: null },
      riboflavin: { unit: "mg", per1000kcal: 1.3, maxPer1000kcal: null },
      vitaminB12: { unit: "mg", per1000kcal: 0.007, maxPer1000kcal: null },
    },
    growth_reproduction: {
      vitaminA: { unit: "IU", per1000kcal: 1250, maxPer1000kcal: 62500 },
      vitaminD: { unit: "IU", per1000kcal: 125, maxPer1000kcal: 750 },
      vitaminE: { unit: "IU", per1000kcal: 12.5, maxPer1000kcal: null },
      // ...
    }
  },
  cat: {
    adult: {
      vitaminA: { unit: "IU", per1000kcal: 833, maxPer1000kcal: 83325 },
      vitaminD: { unit: "IU", per1000kcal: 70, maxPer1000kcal: 7520 },
      vitaminE: { unit: "IU", per1000kcal: 10, maxPer1000kcal: null },
      vitaminK: { unit: "mg", per1000kcal: 0.025, maxPer1000kcal: null },
      thiamine: { unit: "mg", per1000kcal: 1.4, maxPer1000kcal: null },
      vitaminB12: { unit: "mg", per1000kcal: 0.005, maxPer1000kcal: null },
      taurine_extruded: { unit: "g", per1000kcal: 0.25, maxPer1000kcal: null },
      taurine_canned: { unit: "g", per1000kcal: 0.50, maxPer1000kcal: null },
    },
    growth_reproduction: {
      vitaminA: { unit: "IU", per1000kcal: 1667, maxPer1000kcal: 83325 },
      vitaminD: { unit: "IU", per1000kcal: 70, maxPer1000kcal: 7520 },
      vitaminE: { unit: "IU", per1000kcal: 10, maxPer1000kcal: null },
      // ...
    }
  }
};