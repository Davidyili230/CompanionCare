import React from "react";

export default function RecommendedDosagePanel({ pet = null, dosageItems = [] }) {
  const hasPet = !!pet;
  const hasDosageItems = Array.isArray(dosageItems) && dosageItems.length > 0;

  const petSummary = hasPet
    ? [
        pet.weight != null ? `${pet.weight}${pet.weightUnit ?? ""}` : null,
        pet.ageYears != null ? `${pet.ageYears} years` : null,
        pet.breed || null,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <section className="dosage-panel">
      <h3>Recommended Dosage</h3>

      {!hasPet ? (
        <div className="empty-panel-message">
          Select a pet to view recommended dosage guidance.
        </div>
      ) : (
        <>
          <p className="dosage-subtitle">
            For {pet.name}
            {petSummary ? ` (${petSummary})` : ""}
          </p>

          <div className="dosage-list">
            {!hasDosageItems ? (
              <div className="empty-panel-message">
                No dosage data yet. (Mockup / pending formula implementation)
              </div>
            ) : (
              dosageItems.map((item, index) => {
                const key =
                  item.id ??
                  item.nutrient ??
                  item.label ??
                  `${item.value ?? "dose"}-${index}`;

                return (
                  <div key={key} className="dosage-item">
                    <div className="dosage-item-title">
                      {item.nutrient || item.label || "Nutrient"}
                    </div>

                    <div className="dosage-item-value">
                      {item.value ?? "-"}
                    </div>

                    {item.description ? (
                      <div className="dosage-item-desc">{item.description}</div>
                    ) : null}

                    {item.maxValue ? (
                      <div className="dosage-item-desc">
                        Max: {item.maxValue}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <div className="dosage-note">
        These are general guidelines based on veterinary recommendations.
        Consult your vet for personalized advice.
      </div>
    </section>
  );
}