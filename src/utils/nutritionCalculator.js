export function toKg(weight, unit) {
  if (!weight || Number.isNaN(Number(weight))) return null;
  const w = Number(weight);
  if (unit === "kg") return w;
  if (unit === "lb") return w * 0.45359237;
  return null;
}

export function calcRER(weightKg) {
  if (!weightKg || weightKg <= 0) return null;
  return 70 * Math.pow(weightKg, 0.75);
}

export function calcMER(rer, factor) {
  if (!rer || !factor) return null;
  return rer * factor;
}

export function calcDailyRequired(mer, per1000kcalTarget) {
  if (!mer || per1000kcalTarget == null) return null;
  return (mer / 1000) * per1000kcalTarget;
}

export function roundDisplay(value) {
  if (value == null) return "-";
  if (value >= 100) return value.toFixed(0);
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(3);
}