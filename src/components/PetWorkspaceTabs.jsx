<<<<<<< Updated upstream
import { useRef } from "react";
import AddPetForm from "./AddPetForm";
import AddSupplementForm from "./AddSupplementForm";
import SupplementSuggestionList from "./SupplementSuggestionList";

const TABS = [
  { id: "add-pet", label: "Add Pet" },
  { id: "add-supplement", label: "Add Supplement" },
];

export default function PetWorkspaceTabs({
  selectedPet,
  draftPet,
  supplements = [],
  activeTab = "add-pet",
  onTabChange,
  onDraftPetChange,
  onFieldBlur,
  onStartAddPet,
  onSavePet,
  onAddSupplement,
  onDeleteSupplement,
  suggestions = [],
  suggestionLoading = false,
  suggestionError = "",
  errors = {},
  touched = {},
}) {
  const tabRefs = useRef([]);

  function changeTab(tabId) {
    onTabChange?.(tabId);

    if (tabId === "add-pet") {
      onStartAddPet?.();
    }
  }

  function moveTo(index) {
    const normalized = (index + TABS.length) % TABS.length;
    const next = TABS[normalized];

    changeTab(next.id);
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
        changeTab(TABS[index].id);
        break;

      default:
        break;
    }
  }

  return (
    <section className="min-h-190 rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm">
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
                onClick={() => changeTab(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#d87c5a]/30",
                  selected
                    ? "bg-[#d87c5a] text-white"
                    : "bg-[#fff7f2] text-[#7a6d63] hover:bg-[#f7e5da] hover:text-[#d87c5a]",
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
        <AddPetForm
          embedded
          petData={draftPet}
          onPetChange={onDraftPetChange}
          onFieldBlur={onFieldBlur}
          onSavePet={onSavePet}
          errors={errors}
          touched={touched}
        />
      </div>

      <div
        id="panel-add-supplement"
        role="tabpanel"
        aria-labelledby="tab-add-supplement"
        hidden={activeTab !== "add-supplement"}
        className="pt-1"
      >
        {!selectedPet ? (
          <div className="rounded-2xl border border-[#f0d8c8] bg-[#fff8f3] px-4 py-3 text-sm text-[#7a6d63]">
            Please select a pet before adding supplements.
          </div>
        ) : (
          <>
            <AddSupplementForm
              embedded
              selectedPet={selectedPet}
              onAddSupplement={onAddSupplement}
            />

            <div className="mt-6">
              <h4 className="mb-3 text-sm font-bold text-[#1f1f1f]">
                Current Supplements
              </h4>

              {supplements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#ead7ca] bg-[#fffaf7] px-4 py-4 text-sm text-[#7a6d63]">
                  No supplements added for this pet yet.
                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                  {supplements.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#ecdcc8] bg-[#fffaf7] p-3"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-[#1f1f1f]">
                          {item.name || "Untitled Supplement"}
                        </p>

                        <button
                          type="button"
                          onClick={() => onDeleteSupplement?.(item.id)}
                          className="shrink-0 rounded-full bg-red-500 px-3 py-1 text-[11px] font-medium text-white transition hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="space-y-1 text-sm text-[#5f5a55]">
                        <p>
                          <span className="font-medium">Brand:</span>{" "}
                          {item.brand || "-"}
                        </p>

                        <p>
                          <span className="font-medium">Dosage:</span>{" "}
                          {item.dosage || "-"}
                        </p>

                        <p>
                          <span className="font-medium">Frequency:</span>{" "}
                          {item.frequency || "-"}
                        </p>

                        <p>
                          <span className="font-medium">Notes:</span>{" "}
                          {item.notes || "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <SupplementSuggestionList
                selectedPet={selectedPet}
                suggestions={suggestions}
                loading={suggestionLoading}
                error={suggestionError}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
=======
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
  draftPet,
  onDraftPetChange,
  onStartAddPet,
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

    if (next.id === "add-pet") {
      onStartAddPet?.();
    }

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
        if (TABS[index].id === "add-pet") {
          onStartAddPet?.();
        }
        break;
      default:
        break;
    }
  }

  return (
    <section className="rounded-3xl border border-[#ecdcc8] bg-white p-4 shadow-sm min-h-190">
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
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "add-pet") {
                    onStartAddPet?.();
                  }
                }}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#d87c5a]/30",
                  selected
                    ? "bg-[#d87c5a] text-white"
                    : "bg-[#fff7f2] text-[#7a6d63] hover:bg-[#f7e5da] hover:text-[#d87c5a]",
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
        <AddPetForm
          embedded
          petData={draftPet}
          onPetChange={onDraftPetChange}
          onSavePet={onSavePet}
        />
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
>>>>>>> Stashed changes
}