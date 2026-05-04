export default function PetCard({ pet, selected, onClick, onDelete }) {
  return (
    <div
      className={`flex w-full min-h-57.5 flex-col items-center rounded-[22px] border bg-white px-4 py-4 text-center transition-all duration-200 ${
        selected
          ? "border-[#de7e52] bg-[#fcf5ef]"
          : "border-[#de7e52] hover:bg-[#fcf5ef]"
      }`}
    >
      <button
        type="button"
        onClick={() => onClick(pet.id)}
        className="flex w-full flex-1 flex-col items-center text-center pb-3"
      >
        <div className="mb-3 flex h-18.5 w-18.5 items-center justify-center overflow-hidden rounded-full border border-[#9a9a9a] bg-[#f2f2f2]">
          {pet.image ? (
            <img
              src={pet.image}
              alt={pet.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[28px] font-semibold text-[#d87c5a]">
              {pet.name?.[0]?.toUpperCase() || "P"}
            </span>
          )}
        </div>

        <p className="text-[16px] font-bold leading-tight text-[#1f1f1f]">
          {pet.name}
        </p>

        <p className="mt-2 text-[13px] leading-snug text-[#4f4f4f]">
          {pet.species}, <br />
          {pet.breed || "unknown"}
        </p>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete?.(pet.id);
        }}
        className="mt-3 rounded-full bg-red-500 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}