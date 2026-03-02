import { useRef, useState } from "react";
import AddPetForm from "./AddPetForm";
import AddSupplementForm from "./AddSupplementForm";
import SupplementSuggestionList from "./SupplementSuggestionList";

const TABS = [
  { id: "add-pet", label: "Add Pet" },
  { id: "add-supplement", label: "Add Supplement" },
];

export default function PetWorkspaceTabs({
  selectedPet,
  onSavePet,
  onAddSupplement,
  suggestions = [],
}) {
  const [activeTab, setActiveTab] = useState("add-pet");
  const tabRefs = useRef([]);

  function moveTo(index) {
    const normalized = (index + TABS.length) % TABS.length;
    const next = TABS[normalized];
    setActiveTab(next.id);
    tabRefs.current[normalized]?.focus();
  }

  function handleKeyDown(event, index) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(TABS.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        setActiveTab(TABS[index].id);
        break;
      default:
        break;
    }
  }

  return (
    <section className="rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm min-h-[760px]">
      <div className="mb-4 overflow-x-auto">
        <div
          role="tablist"
          aria-label="Pet management tabs"
          className="flex gap-2 border-b border-[#f2e0d4] pb-3"
        >
          {TABS.map((tab, index) => {
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-[#d87c5a]/30",
                  selected
                    ? "bg-[#d87c5a] text-[#1f1f1f]"
                    : "bg-[#fff7f2] text-[#7a6d63] hover:bg-[#f7e5da]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="panel-add-pet"
        role="tabpanel"
        aria-labelledby="tab-add-pet"
        hidden={activeTab !== "add-pet"}
        className="pt-1"
      >
        <AddPetForm embedded onSavePet={onSavePet} />
      </div>

      <div
        id="panel-add-supplement"
        role="tabpanel"
        aria-labelledby="tab-add-supplement"
        hidden={activeTab !== "add-supplement"}
        className="pt-1"
      >
        <AddSupplementForm
          embedded
          selectedPet={selectedPet}
          onAddSupplement={onAddSupplement}
        />

        <div className="mt-6">
          <SupplementSuggestionList
            selectedPet={selectedPet}
            suggestions={suggestions}
          />
        </div>
      </div>
    </section>
  );
}