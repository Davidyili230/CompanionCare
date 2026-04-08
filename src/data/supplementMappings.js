export const SUPPLEMENT_RULES = [
  {
    key: "vitamin-a",
    label: "Vitamin A",
    match: (pet) =>
      ["dog", "cat"].includes(String(pet?.species ?? "").trim().toLowerCase()),
  },
  {
    key: "vitamin-d",
    label: "Vitamin D",
    match: (pet) =>
      ["dog", "cat"].includes(String(pet?.species ?? "").trim().toLowerCase()),
  },
  {
    key: "vitamin-e",
    label: "Vitamin E",
    match: (pet) =>
      ["dog", "cat"].includes(String(pet?.species ?? "").trim().toLowerCase()),
  },
  {
    key: "multivitamin",
    label: "Multivitamin",
    match: (pet) =>
      ["dog", "cat"].includes(String(pet?.species ?? "").trim().toLowerCase()),
  },
];