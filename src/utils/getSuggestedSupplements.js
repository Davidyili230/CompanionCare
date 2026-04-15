import { SUPPLEMENT_RULES } from "../data/supplementMappings";

export function getSuggestedSupplementRules(pet) {
  if (!pet) return [];

  return SUPPLEMENT_RULES.filter(
    (rule) => typeof rule.match === "function" && rule.match(pet)
  );
}