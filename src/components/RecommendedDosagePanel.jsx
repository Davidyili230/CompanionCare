export default function RecommendedDosagePanel({ pet = null, dosageItems = [] }) {
  const hasPet = !!pet;
  const hasDosageItems = Array.isArray(dosageItems) && dosageItems.length > 0;

  return (
    <section className="rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm">
      <h3 className="text-[15px] font-bold text-[#1f1f1f]">
        Recommended Dosage
      </h3>

      {!hasPet ? (
        <div className="mt-4 rounded-2xl border border-[#f1c9b8] bg-[#fffdfb] p-4">
          <p className="text-[#2b2b2b]">
            Select a pet to view recommended dosage guidance.
          </p>

          <div className="mt-4 rounded-xl border border-[#f1c9b8] bg-white px-3 py-3 text-sm text-[#d87c5a]">
            These are general guidelines based on veterinary recommendations.
            Consult your vet for personalized advice.
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-[#5f5a55]">
            For {pet.name}
          </p>

          {!hasDosageItems ? (
            <div className="rounded-2xl border border-dashed border-[#d8d1c7] bg-[#fffdfb] p-4 text-sm text-[#6f675d]">
              No dosage data yet.
            </div>
          ) : (
            dosageItems.map((item, index) => (
              <div
                key={item.id ?? item.nutrient ?? index}
                className="rounded-2xl border border-[#f1c9b8] bg-[#fffdfb] p-4"
              >
                <div className="text-sm font-semibold text-[#1f1f1f]">
                  {item.nutrient}
                </div>
                <div className="mt-1 text-lg font-bold text-[#1f1f1f]">
                  {item.value}
                </div>
                {item.description ? (
                  <div className="mt-2 text-sm text-[#6f675d]">
                    {item.description}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}