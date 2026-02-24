import React from "react";

export default function SupplementSuggestionList({
  selectedPet = null,
  suggestions = [],
  onAddSuggestion,
}) {
  const sourceList = Array.isArray(suggestions) ? suggestions : [];

  // If a species field is added later, you can filter by pet type. For now, this is just a placeholder to show how it would work.
  const filteredList = selectedPet?.species
    ? sourceList.filter((item) => {
        if (!item?.species) return true;
        return (
          String(item.species).toLowerCase() ===
          String(selectedPet.species).toLowerCase()
        );
      })
    : sourceList;

  const itemsToShow = filteredList.slice(0, 4);

  function handleAdd(item) {
    if (onAddSuggestion) {
      onAddSuggestion(item);
      return;
    }

    // If no logic is provided, only print (no pop-up window will appear).
    console.log("Add suggestion:", item);
  }

  return (
    <section className="suggestion-section">
      <h3>Supplement Suggestion</h3>

      <p className="suggestion-subtitle">
        {selectedPet
          ? `Recommendation for ${selectedPet.name}`
          : "Recommendation for selected pet"}
      </p>

      {itemsToShow.length === 0 ? (
        <div className="empty-panel-message">
          No data
        </div>
      ) : (
        <div className="suggestion-grid">
          {itemsToShow.map((item, index) => {
            const key = item.id ?? `${item.title || "suggestion"}-${index}`;

            return (
              <div key={key} className="suggestion-card">
                <div className="suggestion-text">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.title}
                    >
                      {item.title || "Untitled supplement"}
                    </a>
                  ) : (
                    <div className="suggestion-title-text">
                      {item.title || "Untitled supplement"}
                    </div>
                  )}

                  <div className="suggestion-sub">
                    {item.subtitle || "Supplement"}
                  </div>
                </div>

                <button
                  type="button"
                  className="icon-add-btn"
                  onClick={() => handleAdd(item)}
                  aria-label={`Add ${item.subtitle || item.title || "supplement"}`}
                  title="Add supplement"
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}