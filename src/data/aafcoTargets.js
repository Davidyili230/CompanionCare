// per 1000 kcal targets

export const AAFCO_TARGETS = {
  dog: {
    adult: {
      vitaminA: { label: "Vitamin A", unit: "IU/day", per1000kcal: 1250 },
      vitaminD: { label: "Vitamin D", unit: "IU/day", per1000kcal: 125 },
      vitaminE: { label: "Vitamin E", unit: "IU/day", per1000kcal: 12.5 },
    },
  },
  cat: {
    adult: {
      vitaminA: { label: "Vitamin A", unit: "IU/day", per1000kcal: 833 },
      vitaminD: { label: "Vitamin D", unit: "IU/day", per1000kcal: 70 },
      vitaminE: { label: "Vitamin E", unit: "IU/day", per1000kcal: 10 },
    },
  },
};