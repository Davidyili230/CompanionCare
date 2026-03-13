export default function SupplementSuggestionList({
  selectedPet,
  suggestions = [],
}) {
  const hasSuggestions = suggestions.length > 0;

  return (
    <section className="rounded-2xl border border-[#ecdcc8] bg-[#fffaf6] p-4">
      <div className="mb-3">
        <h3 className="text-[18px] font-bold text-[#1f1f1f]">
          Supplement Suggestion
        </h3>
        <p className="mt-1 text-sm text-[#6f655f]">
          Recommendation for selected pet
        </p>
      </div>

      {!selectedPet ? (
        <div className="rounded-xl border border-[#f0d7c8] bg-white px-4 py-3 text-sm text-[#8a7d75]">
          Select a pet first to view supplement suggestions.
        </div>
      ) : !hasSuggestions ? (
        <div className="rounded-xl border border-[#f0d7c8] bg-white px-4 py-3 text-sm text-[#8a7d75]">
          No data
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((item, index) => (
            <div
              key={item.id ?? index}
              className="rounded-xl border border-[#f0d7c8] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-[15px] font-semibold text-[#1f1f1f]">
                    {item.name}
                  </h4>
                  {item.reason ? (
                    <p className="mt-1 text-sm text-[#6f655f]">{item.reason}</p>
                  ) : null}
                </div>

                {item.tag ? (
                  <span className="rounded-full bg-[#f7e5da] px-3 py-1 text-xs font-medium text-[#d87c5a]">
                    {item.tag}
                  </span>
                ) : null}
              </div>

              {item.note ? (
                <p className="mt-3 text-sm text-[#8a7d75]">{item.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}